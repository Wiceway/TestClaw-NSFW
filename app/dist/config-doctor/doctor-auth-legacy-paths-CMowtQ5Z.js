import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { a as resolveAgentDir, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import "./agent-scope-BiRi-Smp.js";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-BxNVBaMw.js";
import { S as resolveSharedMainAuthAgentDir } from "./path-resolve-C56x-mXN.js";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-DH8A5K-d.js";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-DKFLGAzG.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-auth-legacy-paths.ts
function resolveLegacyAuthAgentDir(agentDir) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir();
}
function listExistingAgentDirsFromState(env, onUnavailable) {
	const root = path.join(resolveStateDir(env), "agents");
	let entries;
	try {
		entries = fs.readdirSync(root, { withFileTypes: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) onUnavailable?.(root);
		return [];
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(root, entry.name, "agent")).filter((agentDir) => {
		try {
			const directory = fs.statSync(agentDir).isDirectory();
			if (!directory) onUnavailable?.(agentDir);
			return directory;
		} catch (error) {
			if (!onUnavailable) return false;
			if (!hasErrnoCode(error, "ENOENT")) {
				onUnavailable?.(agentDir);
				return false;
			}
			try {
				fs.lstatSync(agentDir);
				onUnavailable?.(agentDir);
			} catch (missing) {
				if (!hasErrnoCode(missing, "ENOENT")) onUnavailable?.(agentDir);
				else try {
					fs.statSync(path.dirname(agentDir));
				} catch {
					onUnavailable?.(agentDir);
				}
			}
			return false;
		}
	});
}
/**
* One canonical enumeration of legacy auth-store repair candidates. Sidecar
* inline-recovery and flat-store SQLite migration must see the same dirs, or
* decryptable sidecar secrets get imported as credential-less profiles.
*/
function listAuthProfileRepairCandidates(cfg, env, onUnavailable) {
	const candidates = /* @__PURE__ */ new Map();
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => listAgentIds(cfg).map((agentId) => ({
		agentId,
		path: resolveAgentDir(cfg, agentId, env)
	})), {
		kind: "agent-directory",
		readDatabasePaths: () => resolveConfiguredAgentDatabaseCandidatePaths(cfg, { env })
	});
	const addCandidate = (agentDir) => {
		const resolvedAgentDir = agentDir ? resolveUserPath(agentDir, env) : void 0;
		const authPath = resolveLegacyAuthProfilesPath(resolvedAgentDir ?? resolveSharedMainAuthAgentDir(env));
		if (!candidates.get(authPath) || agentDir === void 0) candidates.set(authPath, {
			agentDir: resolvedAgentDir,
			authPath
		});
	};
	addCandidate(void 0);
	addCandidate(resolveLegacyInheritedAuthAgentDir(cfg, env));
	const envAgentDir = readNonBlankString(env.TESTCLAW_AGENT_DIR) ?? readNonBlankString(env.PI_CODING_AGENT_DIR);
	if (envAgentDir) addCandidate(envAgentDir);
	for (const agentId of listAgentIds(cfg)) addCandidate(resolveAgentDir(cfg, agentId, env));
	for (const agentDir of listExistingAgentDirsFromState(env, onUnavailable)) addCandidate(agentDir);
	return [...candidates.values()].filter(({ authPath }) => !isRetained(path.dirname(authPath)));
}
function resolveLegacyAuthProfilesPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-profiles.json");
}
function resolveLegacyAuthStatePath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-state.json");
}
function resolveLegacyFlatAuthPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth.json");
}
//#endregion
export { resolveLegacyFlatAuthPath as i, resolveLegacyAuthProfilesPath as n, resolveLegacyAuthStatePath as r, listAuthProfileRepairCandidates as t };
