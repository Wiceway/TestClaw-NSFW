import { n as ok } from "./result-BQGgYouL.mjs";
import "./agent-scope-config-Dm8T0OhW.mjs";
import { r as isIncognitoSessionKey } from "./session-key-B8Cn8Xls.mjs";
import { A as parseAgentSessionKey } from "./session-key-C_bfgyCp.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { i as resolveIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { t as sessionChanges } from "./session-row-changes-BVp_K0FZ.mjs";
import { a as registerAssistantAgentDatabaseAsyncResource, i as matchesAgentDatabaseReadCandidatePath, o as registerAssistantAgentDatabaseReadCandidateResource } from "./testclaw-agent-db-resources-hI09vxvz.mjs";
import { l as getOpenIncognitoAgentDatabase } from "./testclaw-agent-db-lifecycle-BQsqjh85.mjs";
import { a as prepareAssistantAgentDatabaseRegistrySnapshotRead } from "./testclaw-agent-db-registry-listing-bY5cRH88.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-AxJeGVjE.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-BReqLf0S.mjs";
import { c as readCommittedIncognitoSessionSharing, f as retainPreparedSessionSharingFacts, n as isPreparedSessionSharingChange, r as projectSessionSharingEntry } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
import { a as readSessionEntriesFromStoreInWorker } from "./session-accessor-CtBBLApI.mjs";
import { r as resolveSessionStoreIdentity } from "./session-store-key-GnE6aqPA.mjs";
import { f as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-DvyPYce4.mjs";
import { n as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-GDy04iAH.mjs";
import { r as prepareGatewaySessionStoreTargetReadOnly } from "./session-utils-store-lookup-iKakm6L6.mjs";
import { c as resolveCanonicalSessionStoreMatchFromStoreKeys } from "./session-utils-store-BVoy_pJn.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/gateway/session-sharing-preparation.ts
var SessionMutationFactsUnavailableError = class extends Error {
	constructor(options) {
		super("Session access facts are unavailable; retry after session storage is ready.", options);
		this.name = "SessionMutationFactsUnavailableError";
	}
};
function routeFacts(cfg) {
	return {
		agents: listAgentIds(cfg),
		store: cfg.session?.store,
		mainKey: cfg.session?.mainKey,
		scope: cfg.session?.scope
	};
}
async function prepareSessionMutationFacts(params) {
	const route = routeFacts(params.cfg);
	const { canonicalKey, agentId } = resolveSessionStoreIdentity(params);
	const releases = [];
	let active = true;
	let invalidated = false;
	let facts;
	const selectedPaths = /* @__PURE__ */ new Set();
	const release = () => {
		if (active) {
			active = false;
			for (const stop of releases.splice(0).toReversed()) stop();
		}
	};
	const assertActive = () => {
		if (!active || invalidated) throw new SessionMutationFactsUnavailableError();
	};
	const invalidate = () => {
		invalidated = true;
	};
	const changed = (change) => {
		if ("all" in change) {
			if (typeof change.scope === "string" && [
				"profiles",
				"catalog",
				"acp",
				"agent-runs",
				"worker-placements",
				"worker-environments",
				"config"
			].includes(change.scope)) return;
			if (typeof change.scope === "object" && change.scope.agentId && change.scope.agentId !== agentId) return;
			invalidate();
			return;
		}
		if (change.scope === "automation" || change.agentId && change.agentId !== agentId && !change.storePath || ![
			params.sessionKey,
			canonicalKey,
			...facts?.target?.storeKeys ?? []
		].includes(change.sessionKey)) return;
		if (!change.storePath) return;
		if (!change.factsInvalidated && (change.facts?.kind === "unchanged" || change.facts?.kind === "participants" || change.facts?.kind === "category")) return;
		if (!facts || !selectedPaths.has(path.resolve(change.storePath)) || !isPreparedSessionSharingChange(change)) invalidate();
	};
	releases.push(sessionChanges.subscribeFacts(changed), onSessionIdentityMutation((change) => {
		if (change.agentId === agentId && change.previous.sessionKeys.includes(canonicalKey)) invalidate();
	}));
	try {
		let assertSource;
		let readFacts = () => facts;
		if (isIncognitoSessionKey(canonicalKey)) {
			const storePath = resolveIncognitoAssistantAgentSqlitePath({ agentId });
			const database = getOpenIncognitoAgentDatabase(agentId, storePath);
			if (!database) throw new SessionMutationFactsUnavailableError();
			const initial = readCommittedIncognitoSessionSharing(database.db, canonicalKey);
			if (!initial) throw new SessionMutationFactsUnavailableError();
			const { sessionId, lifecycleRevision } = initial.entry;
			selectedPaths.add(path.resolve(storePath));
			releases.push(registerAssistantAgentDatabaseAsyncResource({
				agentId,
				path: storePath,
				revoke: release,
				close: async () => release()
			}));
			assertSource = () => {
				if (getOpenIncognitoAgentDatabase(agentId, storePath) !== database) throw new SessionMutationFactsUnavailableError();
			};
			readFacts = () => {
				const current = readCommittedIncognitoSessionSharing(database.db, canonicalKey);
				if (!current || current.entry.sessionId !== sessionId || current.entry.lifecycleRevision !== lifecycleRevision) {
					invalidate();
					throw new SessionMutationFactsUnavailableError();
				}
				return {
					target: {
						agentId,
						canonicalKey,
						storeKey: canonicalKey,
						storeKeys: [canonicalKey],
						storePath,
						entry: current.entry
					},
					membership: current.membership
				};
			};
			facts = readFacts();
		} else {
			const parsedAgent = parseAgentSessionKey(params.sessionKey)?.agentId;
			const { candidates: discoveryCandidates, ...inventory } = prepareSessionStoreTargetInventory(params.cfg, [agentId, ...parsedAgent ? [parsedAgent] : []]);
			const candidates = discoveryCandidates.flatMap((candidate) => [candidate, {
				...candidate,
				path: candidate.physicalPath
			}]);
			const candidateIdentities = discoveryCandidates.map((candidate) => ({
				candidate,
				identity: readDatabasePathIdentitySync(candidate.path).key
			}));
			for (const candidate of candidates) releases.push(registerAssistantAgentDatabaseReadCandidateResource({
				...candidate,
				revoke: release,
				close: async () => release()
			}));
			const registry = prepareAssistantAgentDatabaseRegistrySnapshotRead({ env: inventory.env });
			let assertRegistry;
			const members = /* @__PURE__ */ new Map();
			const retainedReads = /* @__PURE__ */ new Map();
			const selected = await withSessionHistoryWorkerReadCandidates(discoveryCandidates, async (discovery) => {
				let sources = await discovery.readTargetInventory({
					...inventory,
					registeredDatabases: { status: "deferred" }
				});
				if (sources.kind === "session-target-registry-required") {
					const current = await registry.read();
					assertRegistry = current.assertCurrent;
					current.assertCurrent();
					sources = await discovery.readTargetInventory({
						...inventory,
						registeredDatabases: current.result.status === "available" ? current.result.entries : { status: "unavailable" }
					});
				}
				if (sources.kind !== "session-target-inventory") throw new SessionMutationFactsUnavailableError();
				const targetDiscoveryCache = /* @__PURE__ */ new Map();
				for (const source of sources.agents) {
					if (!source.result.available && source.result.reason !== "database-missing") throw new SessionMutationFactsUnavailableError();
					targetDiscoveryCache.set(source.agentId, {
						existing: source.result.available ? source.result.targets : [],
						fallback: {
							agentId: source.agentId,
							storePath: inventory.paths.get(source.agentId).configured
						}
					});
				}
				const target = await prepareGatewaySessionStoreTargetReadOnly({
					cfg: inventory.config,
					key: params.sessionKey,
					agentId,
					env: inventory.env,
					targetDiscoveryCache
				}, async (reads) => {
					for (const read of reads) {
						assertActive();
						const loaded = await readSessionEntriesFromStoreInWorker({
							agentId: read.agentId ?? agentId,
							storePath: read.storePath,
							sessionKeys: read.options.exactKeys,
							projection: "sharing",
							env: inventory.env
						});
						const store = Object.fromEntries(loaded.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
						read.result = ok(store);
						if (loaded.sharing) {
							read.readSource = loaded.sharing.source;
							members.set(read.storePath, loaded.sharing);
							for (const sessionKey of read.options.exactKeys) {
								const key = `${loaded.sharing.databaseIdentity}\0${sessionKey}`;
								if (retainedReads.has(key)) continue;
								const entry = store[sessionKey];
								const retained = retainPreparedSessionSharingFacts({
									databaseIdentity: loaded.sharing.databaseIdentity,
									sessionKey,
									entry: entry ? projectSessionSharingEntry(entry) : void 0,
									membership: new Set(loaded.sharing.members.find((row) => row.sessionKey === sessionKey)?.identityIds)
								});
								retainedReads.set(key, retained);
								releases.push(retained.release);
							}
						}
					}
				});
				discovery.assertCurrent();
				assertRegistry?.();
				return target;
			});
			assertActive();
			const match = resolveCanonicalSessionStoreMatchFromStoreKeys(selected.store, selected.storeKeys);
			const sharing = members.get(selected.storePath);
			if (!match) {
				if (!params.allowMissing) throw new SessionMutationFactsUnavailableError();
				facts = {
					target: null,
					membership: /* @__PURE__ */ new Set()
				};
			} else {
				if (!sharing) throw new SessionMutationFactsUnavailableError();
				const target = {
					agentId: selected.agentId,
					canonicalKey: selected.canonicalKey,
					storePath: selected.storePath,
					storeKeys: selected.storeKeys,
					entry: projectSessionSharingEntry(match.entry),
					storeKey: match.key
				};
				facts = {
					target,
					membership: new Set(sharing.members.find((member) => member.sessionKey === match.key)?.identityIds)
				};
				selectedPaths.add(path.resolve(selected.storePath));
				selectedPaths.add(path.resolve(sharing.source.path));
				const sourceCandidates = discoveryCandidates.filter((candidate) => matchesAgentDatabaseReadCandidatePath({
					...candidate,
					path: candidate.physicalPath
				}, sharing.source.path));
				if (sourceCandidates.length === 0) throw new SessionMutationFactsUnavailableError();
				for (const candidate of sourceCandidates) selectedPaths.add(path.resolve(candidate.path));
				const retained = retainedReads.get(`${sharing.databaseIdentity}\0${target.storeKey}`);
				if (!retained) throw new SessionMutationFactsUnavailableError();
				readFacts = () => {
					const current = retained.readCurrent();
					if (!current?.entry) throw new SessionMutationFactsUnavailableError();
					return {
						target: {
							...target,
							entry: current.entry
						},
						membership: current.membership
					};
				};
			}
			assertSource = () => {
				assertRegistry?.();
				for (const { candidate, identity } of candidateIdentities) {
					assertSessionStoreReadCandidate(candidate.path, [candidate]);
					if (readDatabasePathIdentitySync(candidate.path).key !== identity) throw new SessionMutationFactsUnavailableError();
				}
				for (const read of members.values()) if (readDatabasePathIdentitySync(read.source.path).key !== read.databaseIdentity) throw new SessionMutationFactsUnavailableError();
				for (const read of retainedReads.values()) if (!read.readCurrent()) throw new SessionMutationFactsUnavailableError();
			};
		}
		const readCurrent = (cfg) => {
			try {
				assertActive();
				if (!isDeepStrictEqual(routeFacts(cfg), route)) throw new SessionMutationFactsUnavailableError();
				const currentIdentity = resolveSessionStoreIdentity({
					...params,
					cfg
				});
				if (currentIdentity.agentId !== agentId || currentIdentity.canonicalKey !== canonicalKey) throw new SessionMutationFactsUnavailableError();
				assertSource();
				return readFacts();
			} catch (error) {
				throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
			}
		};
		readCurrent(params.cfg);
		return {
			readCurrent,
			release
		};
	} catch (error) {
		release();
		throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
	}
}
//#endregion
export { prepareSessionMutationFacts as n, SessionMutationFactsUnavailableError as t };
