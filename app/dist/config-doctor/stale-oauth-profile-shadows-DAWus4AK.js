import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { a as resolveAgentDir, k as listAgentEntries } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./agent-scope-BiRi-Smp.js";
import { s as isSafeToAdoptMainStoreOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-BGXKQwtd.js";
import { a as loadPersistedAuthProfileStore, s as loadPersistedSharedAuthProfileStore, v as isLegacyOAuthRef } from "./persisted-CmvE9bHt.js";
import { r as hasUsableOAuthCredential } from "./credential-state-5qP-kY45.js";
import { S as resolveSharedMainAuthAgentDir } from "./path-resolve-C56x-mXN.js";
import { p as updateAuthProfileStoreWithLock } from "./store-runtime-gE8saxs_.js";
import { n as resolveLegacyAuthProfilesPath } from "./doctor-auth-legacy-paths-CMowtQ5Z.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor/shared/stale-oauth-profile-shadows.ts
async function loadRawAuthProfileStore(authPath) {
	try {
		const raw = JSON.parse(await fs.readFile(authPath, "utf8"));
		return isRecord(raw) ? raw : null;
	} catch {
		return null;
	}
}
function hasLegacyOAuthSidecarRef(raw, profileId) {
	if (!raw || !isRecord(raw.profiles)) return false;
	const profile = raw.profiles[profileId];
	if (!isRecord(profile)) return false;
	return profile.type === "oauth" && profile.provider === "openai-codex" && isLegacyOAuthRef(profile.oauthRef);
}
async function collectStateAgentDirs(env) {
	const agentsRoot = path.join(resolveStateDir(env), "agents");
	return (await fs.readdir(agentsRoot, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(agentsRoot, entry.name, "agent"));
}
async function collectCandidateAgentDirs(cfg, env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) {
		const id = entry.id?.trim();
		if (id) dirs.add(path.resolve(resolveAgentDir(cfg, id, env)));
	}
	for (const agentDir of await collectStateAgentDirs(env)) dirs.add(path.resolve(agentDir));
	return [...dirs].toSorted((left, right) => left.localeCompare(right));
}
function shouldRemoveLocalOAuthShadow(params) {
	const { local, main, now } = params;
	if (!main || main.type !== "oauth" || local.provider !== main.provider) return false;
	if (!isSafeToAdoptMainStoreOAuthIdentity(local, main)) return false;
	if (areOAuthCredentialsEquivalent(local, main)) return true;
	if (!hasUsableOAuthCredential(main, { now })) return false;
	if (!hasUsableOAuthCredential(local, { now })) return true;
	const localExpires = Number.isFinite(local.expires) ? local.expires : 0;
	return (Number.isFinite(main.expires) ? main.expires : 0) >= localExpires;
}
/** Find local OAuth profiles that safely inherit fresher main-agent credentials instead. */
async function scanStaleOAuthProfileShadows(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now();
	const mainAuthPath = path.resolve(resolveLegacyAuthProfilesPath(resolveSharedMainAuthAgentDir(env)));
	const mainStore = loadPersistedSharedAuthProfileStore(env);
	if (!mainStore) return [];
	const hits = [];
	for (const agentDir of await collectCandidateAgentDirs(params.cfg, env)) {
		const authPath = path.resolve(resolveLegacyAuthProfilesPath(agentDir));
		if (authPath === mainAuthPath) continue;
		const rawLocalStore = await loadRawAuthProfileStore(authPath);
		const localStore = loadPersistedAuthProfileStore(agentDir);
		if (!localStore) continue;
		for (const [profileId, local] of Object.entries(localStore.profiles)) {
			if (local.type !== "oauth") continue;
			if (hasLegacyOAuthSidecarRef(rawLocalStore, profileId)) continue;
			const main = mainStore.profiles[profileId];
			if (shouldRemoveLocalOAuthShadow({
				local,
				main: main?.type === "oauth" ? main : void 0,
				now
			})) hits.push({
				agentDir,
				authPath,
				profileId
			});
		}
	}
	return hits;
}
function removeStaleProfilesFromStore(params) {
	const removedProfileIds = [];
	const profiles = { ...params.store.profiles };
	const usageStats = params.store.usageStats ? { ...params.store.usageStats } : void 0;
	const lastGood = params.store.lastGood ? { ...params.store.lastGood } : void 0;
	for (const profileId of params.profileIds) {
		const local = profiles[profileId];
		const main = params.mainStore.profiles[profileId];
		if (local?.type !== "oauth" || !shouldRemoveLocalOAuthShadow({
			local,
			main: main?.type === "oauth" ? main : void 0,
			now: params.now
		})) continue;
		delete profiles[profileId];
		if (usageStats) delete usageStats[profileId];
		if (lastGood) {
			for (const [provider, lastGoodProfileId] of Object.entries(lastGood)) if (lastGoodProfileId === profileId) delete lastGood[provider];
		}
		removedProfileIds.push(profileId);
	}
	return {
		store: {
			...params.store,
			profiles,
			...usageStats && Object.keys(usageStats).length > 0 ? { usageStats } : { usageStats: void 0 },
			...lastGood && Object.keys(lastGood).length > 0 ? { lastGood } : { lastGood: void 0 }
		},
		removedProfileIds
	};
}
function formatProfileList(profileIds) {
	return profileIds.length === 1 ? expectDefined(profileIds[0], "profile ids entry at 0") : `${profileIds.length} profiles`;
}
async function repairStaleOAuthProfilesForAgent(params) {
	const rawStore = await loadRawAuthProfileStore(resolveLegacyAuthProfilesPath(params.agentDir));
	const profileIds = new Set([...params.profileIds].filter((profileId) => !hasLegacyOAuthSidecarRef(rawStore, profileId)));
	if (profileIds.size === 0) return { status: "unchanged" };
	if (!loadPersistedAuthProfileStore(params.agentDir)) return { status: "missing" };
	let sawStore = false;
	let removedProfileIds = [];
	await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			sawStore = true;
			const result = removeStaleProfilesFromStore({
				store,
				mainStore: params.mainStore,
				profileIds,
				now: params.now
			});
			if (result.removedProfileIds.length === 0) return false;
			removedProfileIds = result.removedProfileIds;
			Object.assign(store, result.store);
			return true;
		}
	});
	if (!sawStore) return { status: "missing" };
	return removedProfileIds.length > 0 ? {
		status: "changed",
		removedProfileIds
	} : { status: "unchanged" };
}
/** Format warnings for stale per-agent OAuth profile shadows. */
function collectStaleOAuthProfileShadowWarnings(params) {
	return params.hits.map((hit) => `- ${shortenHomePath(hit.authPath)} has stale OAuth auth profile ${hit.profileId}; it shadows the fresher main-agent credential. Run "${params.doctorFixCommand}" to remove the local shadow and inherit main auth.`);
}
/** Remove stale per-agent OAuth profile shadows after rechecking each locked store. */
async function repairStaleOAuthProfileShadows(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now();
	const hits = await scanStaleOAuthProfileShadows({
		...params,
		env,
		now
	});
	const changes = [];
	const warnings = [];
	const byAgentDir = /* @__PURE__ */ new Map();
	for (const hit of hits) {
		const existing = byAgentDir.get(hit.agentDir) ?? [];
		existing.push(hit);
		byAgentDir.set(hit.agentDir, existing);
	}
	for (const [agentDir, agentHits] of byAgentDir) {
		const mainStore = loadPersistedSharedAuthProfileStore(env);
		if (!mainStore) continue;
		const profileIds = new Set(agentHits.map((hit) => hit.profileId));
		try {
			const repair = await repairStaleOAuthProfilesForAgent({
				agentDir,
				mainStore,
				profileIds,
				now
			});
			if (repair.status === "changed") changes.push(`Removed stale OAuth auth profile shadow ${formatProfileList(repair.removedProfileIds.toSorted())} from ${shortenHomePath(resolveLegacyAuthProfilesPath(agentDir))}; this agent now inherits main auth.`);
		} catch (error) {
			warnings.push(`Failed to remove stale OAuth auth profile shadow from ${shortenHomePath(resolveLegacyAuthProfilesPath(agentDir))}: ${String(error)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
const testing = {
	removeStaleProfilesFromStore,
	repairStaleOAuthProfilesForAgent
};
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.staleOAuthProfileShadowsTestApi")] = testing;
//#endregion
export { repairStaleOAuthProfileShadows as n, scanStaleOAuthProfileShadows as r, collectStaleOAuthProfileShadowWarnings as t };
