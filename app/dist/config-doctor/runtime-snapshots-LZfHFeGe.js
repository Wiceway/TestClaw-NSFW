import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { a as asDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { c as trackAsyncWork } from "./async-work-scope-Botgjsbr.js";
import { b as sleepWithAbort } from "./utils-BfoJTy8l.js";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.js";
import { S as isSecretRef } from "./types.secrets-K95Dlap_.js";
import "./errors-cp9Var1Z.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { i as retainCurrentWorkerNativeSection } from "./worker-task-pool-DdST9izh.js";
import "./backoff-BHAE7e61.js";
import { a as isSafeOAuthPostClaimSettlement, h as cloneAuthProfileStore, i as isSafeOAuthOwnerRefreshResult, s as isSafeToAdoptMainStoreOAuthIdentity } from "./oauth-shared-BGXKQwtd.js";
import { C as setRuntimeExternalCliProfileIds, T as OAUTH_REFRESH_CALL_TIMEOUT_MS, c as mergeAuthProfileStores, n as buildPersistedAuthProfileSecretsStore, o as loadPersistedAuthProfileStoreAtDatabasePath, x as removePersonalAuthProfileReferences, y as getRuntimeExternalCliProfileIds } from "./persisted-CmvE9bHt.js";
import { c as createOAuthRefreshFence, d as isSameOAuthRefreshGeneration, l as isOAuthRefreshFence, r as hasUsableOAuthCredential, s as createFailedOAuthRefreshFence, u as isPendingOAuthRefreshFence } from "./credential-state-5qP-kY45.js";
import { b as closeAuthProfileReadPool, c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership, t as captureAuthProfileOwnerScope } from "./path-resolve-C56x-mXN.js";
import { E as registerFreshSharedAuthStoreHandoff, h as resolveAuthProfileDatabasePath, k as resolveLegacyAuthProfileSourceCandidates } from "./sqlite-C9aIS6tB.js";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-CVM6EPDA.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/mutation-lineage.ts
const persistedMutationRecords = /* @__PURE__ */ new Map();
let persistedMutationRevision = 0;
let evictedOwnerMutationFloor = 0;
const MAX_PERSISTED_MUTATION_OWNERS = 256;
const MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER = 256;
function resolveRuntimeStoreKey(agentDir, env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
function maxMutationRevision(record) {
	return Math.max(record.credentialRevision, record.profileSetRevision, record.stateRevision, record.mutationFloor, ...record.profileRevisions.values());
}
function getOrCreatePersistedMutationRecord(ownerKey) {
	const existing = persistedMutationRecords.get(ownerKey);
	if (existing) {
		persistedMutationRecords.delete(ownerKey);
		persistedMutationRecords.set(ownerKey, existing);
		return existing;
	}
	const record = {
		credentialRevision: evictedOwnerMutationFloor,
		credentialRevisionKnown: evictedOwnerMutationFloor === 0,
		profileSetRevision: evictedOwnerMutationFloor,
		profileSetRevisionKnown: evictedOwnerMutationFloor === 0,
		stateRevision: evictedOwnerMutationFloor,
		stateRevisionKnown: evictedOwnerMutationFloor === 0,
		mutationFloor: evictedOwnerMutationFloor,
		profileRevisions: /* @__PURE__ */ new Map()
	};
	persistedMutationRecords.set(ownerKey, record);
	while (persistedMutationRecords.size > MAX_PERSISTED_MUTATION_OWNERS) {
		const oldestOwnerKey = persistedMutationRecords.keys().next().value;
		if (oldestOwnerKey === void 0) break;
		const oldest = persistedMutationRecords.get(oldestOwnerKey);
		persistedMutationRecords.delete(oldestOwnerKey);
		if (oldest) evictedOwnerMutationFloor = Math.max(evictedOwnerMutationFloor, maxMutationRevision(oldest));
	}
	record.mutationFloor = Math.max(record.mutationFloor, evictedOwnerMutationFloor);
	return record;
}
function setProfileMutationRevision(record, profileId, revision) {
	record.profileRevisions.delete(profileId);
	record.profileRevisions.set(profileId, revision);
	while (record.profileRevisions.size > MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER) {
		const oldestProfileId = record.profileRevisions.keys().next().value;
		if (oldestProfileId === void 0) break;
		const oldestRevision = record.profileRevisions.get(oldestProfileId) ?? 0;
		record.profileRevisions.delete(oldestProfileId);
		record.mutationFloor = Math.max(record.mutationFloor, oldestRevision);
	}
}
function getPersistedMutationRecord(ownerKey) {
	return persistedMutationRecords.get(ownerKey);
}
/** All persisted rows, including usage state, follow their exact owner's write generation. */
function getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(ownerKey, scope = "rows") {
	const record = getPersistedMutationRecord(ownerKey);
	if (record && scope === "credentials") return Math.max(record.credentialRevision, record.profileSetRevision, record.mutationFloor);
	return record ? maxMutationRevision(record) : evictedOwnerMutationFloor;
}
function recordRuntimeAuthProfileStorePersistedMutation(ownerKey, mutation) {
	persistedMutationRevision += 1;
	const record = getOrCreatePersistedMutationRecord(ownerKey);
	if (mutation.profileSetChanged) {
		record.profileSetRevision = persistedMutationRevision;
		record.profileSetRevisionKnown = true;
	}
	if (mutation.credentialsChanged) {
		record.credentialRevision = persistedMutationRevision;
		record.credentialRevisionKnown = true;
		for (const profileId of mutation.profileIds) setProfileMutationRevision(record, profileId, persistedMutationRevision);
	}
	if (mutation.stateChanged) {
		record.stateRevision = persistedMutationRevision;
		record.stateRevisionKnown = true;
	}
}
function combineMutationTokens(tokens) {
	return {
		revision: Math.max(0, ...tokens.map((token) => token.revision)),
		known: tokens.every((token) => token.known)
	};
}
/** Bounded persisted credential lineage; unknown means its exact token was evicted. */
function getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, options) {
	const requestedKey = options?.owner?.databasePath ?? resolveRuntimeStoreKey(agentDir);
	if (!profileId) {
		const record = getPersistedMutationRecord(requestedKey);
		return record ? {
			revision: record.credentialRevision,
			known: record.credentialRevisionKnown
		} : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	}
	if (options?.includeMain && options.owner?.kind === "unresolved") return {
		revision: 0,
		known: false
	};
	const mainKey = !options?.includeMain ? requestedKey : options.owner?.kind === "resolved" ? options.owner.sharedDatabasePath : resolveRuntimeStoreKey(void 0);
	return combineMutationTokens((requestedKey === mainKey || options?.includeMain !== true ? [requestedKey] : [requestedKey, mainKey]).map((key) => {
		const record = getPersistedMutationRecord(key);
		if (!record) return {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
		const revision = record.profileRevisions.get(profileId);
		return revision === void 0 ? {
			revision: record.mutationFloor,
			known: record.mutationFloor === 0
		} : {
			revision,
			known: true
		};
	}));
}
/** Persisted token for profile-id additions and removals in one owner store. */
function getRuntimeAuthProfileStoreProfileSetMutationToken(agentDir, databasePath) {
	const record = getPersistedMutationRecord(databasePath ?? resolveRuntimeStoreKey(agentDir));
	return record ? {
		revision: record.profileSetRevision,
		known: record.profileSetRevisionKnown
	} : {
		revision: evictedOwnerMutationFloor,
		known: evictedOwnerMutationFloor === 0
	};
}
/** Persisted mutation token for non-secret selection state in one owner store. */
function getRuntimeAuthProfileStoreStateMutationToken(agentDir, options) {
	const requestedKey = options?.owner?.databasePath ?? resolveRuntimeStoreKey(agentDir);
	if (options?.includeMain && options.owner?.kind === "unresolved") return {
		revision: 0,
		known: false
	};
	const mainKey = !options?.includeMain ? requestedKey : options.owner?.kind === "resolved" ? options.owner.sharedDatabasePath : resolveRuntimeStoreKey(void 0);
	return combineMutationTokens((requestedKey === mainKey || options?.includeMain !== true ? [requestedKey] : [requestedKey, mainKey]).map((key) => {
		const record = getPersistedMutationRecord(key);
		return record ? {
			revision: record.stateRevision,
			known: record.stateRevisionKnown
		} : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	}));
}
const testing = {
	MAX_PERSISTED_MUTATION_OWNERS,
	MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER,
	getPersistedMutationRecordCounts() {
		return {
			owners: persistedMutationRecords.size,
			profiles: Math.max(0, ...Array.from(persistedMutationRecords.values(), (record) => record.profileRevisions.size))
		};
	},
	resetPersistedMutationLineage() {
		persistedMutationRecords.clear();
		persistedMutationRevision = 0;
		evictedOwnerMutationFloor = 0;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.runtimeAuthSnapshotsTestApi")] = testing;
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-fence.ts
/** Full structural equality for compare-and-swap of persisted OAuth credentials. */
function isExactOAuthCredential(current, expected) {
	return current?.type === "oauth" && isDeepStrictEqual(current, expected);
}
function hasUnexpiredOAuthCredential(credential) {
	return hasUsableOAuthCredential(credential, { refreshMarginMs: 0 });
}
function createOAuthRefreshTimeoutError(label, timeoutMs) {
	return /* @__PURE__ */ new Error(`OAuth refresh call "${label}" exceeded hard timeout (${timeoutMs}ms)`);
}
/**
* Observe one durable refresh claim without retaining a process-local owner.
* Reads happen between bounded sleeps, so no store lock spans the wait.
*/
async function observeOAuthRefreshFenceSettlement(params) {
	const deadline = Date.now() + params.timeoutMs;
	while (true) {
		params.signal?.throwIfAborted();
		const snapshot = await observeOAuthRefreshSettlementBeforeDeadline(params.label, params.timeoutMs, deadline, Promise.resolve().then(() => params.read()), params.signal);
		params.signal?.throwIfAborted();
		if (!params.isPending(snapshot)) return await params.resolve(snapshot);
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) throw createOAuthRefreshTimeoutError(params.label, params.timeoutMs);
		await sleepWithAbort(Math.min(25, remainingMs), params.signal);
	}
}
/** Normalize provider-default serialized OAuth data into an owned profile credential. */
function normalizeOAuthRefreshCredential(credential, fallbackProvider) {
	if (!credential) return;
	return {
		...credential,
		type: "oauth",
		provider: typeof credential.provider === "string" && credential.provider.trim() ? credential.provider : fallbackProvider
	};
}
/**
* Run the durable fence protocol for provider-keyed serialized stores.
* Backend locks cover only exact-CAS reads and writes; provider callbacks run outside them.
*/
function refreshSerializedOAuthCredential(params) {
	return trackAsyncWork(() => runSerializedOAuthRefresh(params));
}
async function runSerializedOAuthRefresh(params) {
	const observeFence = async (generation) => await observeOAuthRefreshFenceSettlement({
		label: params.label,
		timeoutMs: params.timeoutMs,
		read: () => params.backend.withLock((current) => {
			const data = params.parse(current);
			return { result: {
				credential: params.readCredential(data),
				data
			} };
		}),
		isPending: ({ credential }) => credential?.provider === generation.provider && isPendingOAuthRefreshFence(credential),
		resolve: async ({ credential, data }) => {
			if (!isSafeOAuthPostClaimSettlement(generation, credential)) return null;
			params.commit(data);
			return await params.resolve(credential);
		}
	});
	const candidate = await params.backend.withLock((current) => {
		const data = params.parse(current);
		const credential = params.readCredential(data);
		if (!credential || credential.provider !== params.provider) return { result: { kind: "unavailable" } };
		if (isPendingOAuthRefreshFence(credential)) return { result: {
			kind: "observe",
			generation: credential
		} };
		if (isOAuthRefreshFence(credential)) return { result: { kind: "unavailable" } };
		if (hasUnexpiredOAuthCredential(credential)) return { result: {
			kind: "use",
			credential,
			data
		} };
		return { result: {
			kind: "claimable",
			credential
		} };
	});
	if (candidate.kind === "unavailable") return null;
	if (candidate.kind === "observe") return await observeFence(candidate.generation);
	if (candidate.kind === "use") {
		params.commit(candidate.data);
		return await params.resolve(candidate.credential);
	}
	if (!await params.canRefresh(candidate.credential)) return null;
	let releaseNativeSection;
	let settlement;
	try {
		const claim = await params.backend.withLock((current) => {
			const data = params.parse(current);
			const credential = params.readCredential(data);
			if (!credential || credential.provider !== params.provider) return { result: { kind: "unavailable" } };
			if (!isExactOAuthCredential(credential, candidate.credential)) {
				if (isPendingOAuthRefreshFence(credential)) return { result: {
					kind: "observe",
					generation: credential
				} };
				if (isOAuthRefreshFence(credential)) return { result: { kind: "unavailable" } };
				return hasUnexpiredOAuthCredential(credential) ? { result: {
					kind: "use",
					credential,
					data
				} } : { result: { kind: "unavailable" } };
			}
			const fence = createOAuthRefreshFence({
				profileId: params.profileId,
				credential
			});
			releaseNativeSection = retainCurrentWorkerNativeSection();
			const nextData = params.writeCredential(data, fence);
			return {
				result: {
					kind: "claimed",
					credential,
					fence,
					data,
					nextData
				},
				next: params.serialize(nextData)
			};
		});
		if (claim.kind === "unavailable") return null;
		if (claim.kind === "observe") return await observeFence(claim.generation);
		if (claim.kind === "use") {
			params.commit(claim.data);
			return await params.resolve(claim.credential);
		}
		const markFailed = async () => {
			const failed = await params.backend.withLock((current) => {
				const data = params.parse(current);
				if (!isExactOAuthCredential(params.readCredential(data), claim.fence)) return { result: null };
				const nextData = params.writeCredential(data, createFailedOAuthRefreshFence(claim.fence));
				return {
					result: nextData,
					next: params.serialize(nextData)
				};
			});
			if (failed) params.commit(failed);
		};
		const settleFailure = async (failure) => {
			const normalizedInitiatingError = failure ? toErrorObject(failure.error, "OAuth refresh failed") : void 0;
			try {
				await markFailed();
			} catch (cleanupError) {
				const normalizedCleanupError = toErrorObject(cleanupError, "OAuth refresh terminal fencing failed");
				if (!normalizedInitiatingError) throw normalizedCleanupError;
				throw new AggregateError([normalizedInitiatingError, normalizedCleanupError], "OAuth refresh failed and terminal fencing could not be completed.", { cause: normalizedInitiatingError });
			}
			if (normalizedInitiatingError) throw normalizedInitiatingError;
			return null;
		};
		try {
			params.commit(claim.nextData);
		} catch (error) {
			return await settleFailure({ error });
		}
		settlement = trackAsyncWork(async () => {
			let refreshed;
			try {
				refreshed = await params.refresh(claim.credential, claim.data);
			} catch (error) {
				return settleFailure({ error });
			}
			if (!refreshed) return settleFailure();
			try {
				if (!hasUnexpiredOAuthCredential(refreshed.credential)) throw new Error("OAuth refresh returned an unusable credential");
				if (!isSafeOAuthOwnerRefreshResult(claim.credential, refreshed.credential)) throw new Error("OAuth refresh returned credentials for a different OAuth account");
				const settled = await params.backend.withLock((current) => {
					const data = params.parse(current);
					const authoritative = params.readCredential(data);
					if (isExactOAuthCredential(authoritative, claim.fence)) {
						const nextData = params.writeCredential(data, refreshed.credential);
						return {
							result: {
								credential: refreshed.credential,
								data: nextData,
								persisted: true
							},
							next: params.serialize(nextData)
						};
					}
					return { result: isSafeOAuthPostClaimSettlement(claim.credential, authoritative) ? {
						credential: authoritative,
						data,
						persisted: false
					} : null };
				});
				if (!settled) throw new Error("OAuth credential owner changed before refresh completed");
				params.commit(settled.data);
				return settled.persisted ? refreshed : await params.resolve(settled.credential);
			} catch (error) {
				return settleFailure({ error });
			}
		});
		const finish = () => releaseNativeSection?.();
		settlement.then(finish, finish);
		return await observeOAuthRefreshSettlement(params.label, params.timeoutMs, settlement);
	} finally {
		if (!settlement) releaseNativeSection?.();
	}
}
/** Observe a refresh owner without canceling its durable settlement after timeout. */
async function observeOAuthRefreshSettlement(label, timeoutMs, settlement, signal) {
	return await observeOAuthRefreshSettlementBeforeDeadline(label, timeoutMs, Date.now() + timeoutMs, settlement, signal);
}
async function observeOAuthRefreshSettlementBeforeDeadline(label, timeoutMs, deadline, settlement, signal) {
	let timeoutHandle;
	try {
		return await racePromiseWithAbortSignal(new Promise((resolve, reject) => {
			timeoutHandle = setTimeout(() => {
				reject(createOAuthRefreshTimeoutError(label, timeoutMs));
			}, Math.max(0, deadline - Date.now()));
			settlement.finally(() => {
				if (Date.now() >= deadline) throw createOAuthRefreshTimeoutError(label, timeoutMs);
			}).then(resolve, reject);
		}), signal);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-observation.ts
function createRefreshTarget() {
	return {
		current: true,
		retired: createDeferredCore()
	};
}
const activeRefreshes = /* @__PURE__ */ new Set();
/** Register before publishing a fence; release only after durable settlement or claim rollback. */
function beginOAuthRefreshObservation(params) {
	const completion = createDeferredCore();
	const refresh = {
		targets: /* @__PURE__ */ new Map([[path.resolve(params.databasePath), createRefreshTarget()]]),
		profileId: params.profileId,
		provider: params.provider,
		claimId: params.claimId,
		generation: params.generation,
		settling: false,
		settled: completion.promise
	};
	const releaseNativeSection = retainCurrentWorkerNativeSection();
	activeRefreshes.add(refresh);
	return {
		includeDatabase: (databasePath) => {
			const key = path.resolve(databasePath);
			const existing = refresh.targets.get(key);
			const target = existing?.current ? existing : createRefreshTarget();
			refresh.targets.set(key, target);
			return () => {
				target.current = false;
				target.retired.resolve();
			};
		},
		beginSettlement: () => {
			refresh.settling = true;
		},
		finish: () => {
			activeRefreshes.delete(refresh);
			completion.resolve();
			releaseNativeSection();
		}
	};
}
/** Retire only replaced claim targets; the producer still owns all remaining cleanup. */
function publishOAuthRefreshClaimIdentities(databasePath, claimIds) {
	const key = path.resolve(databasePath);
	for (const refresh of activeRefreshes) {
		if (!claimIds.has(refresh.profileId)) continue;
		const target = refresh.targets.get(key);
		if (claimIds.get(refresh.profileId) === refresh.claimId) {
			if (target && !target.current) refresh.targets.set(key, createRefreshTarget());
			continue;
		}
		if (refresh.settling) continue;
		if (target?.current) {
			target.current = false;
			target.retired.resolve();
		}
	}
}
/** Capture matching work now, without reading credentials or following subsequent refreshes. */
function captureOAuthRefreshSettlement(params) {
	const paths = new Set(params.databasePaths.map((databasePath) => path.resolve(databasePath)));
	const pending = [...activeRefreshes].flatMap((refresh) => {
		if (params.profileId && refresh.profileId !== params.profileId || !params.matchesProvider(refresh.provider)) return [];
		return [...refresh.targets].flatMap(([databasePath, target]) => target.current && paths.has(databasePath) && (!params.localPin || databasePath === params.localPin.databasePath || params.localPin.generation === refresh.generation) ? [Promise.race([refresh.settled, target.retired.promise])] : []);
	});
	if (pending.length === 0) return;
	const settled = Promise.all(pending).then(() => {});
	return async (signal) => {
		await observeOAuthRefreshSettlement("runtime auth profile read", OAUTH_REFRESH_CALL_TIMEOUT_MS, settled, signal);
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-materializations.ts
const materializations = /* @__PURE__ */ new Map();
const listeners = /* @__PURE__ */ new Set();
function ownerKey(agentDir) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
}
function notify(agentDir) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0
	};
	for (const listener of listeners) listener(event);
}
function registerRuntimeAuthMaterializationMutationListener(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
/** Records successful auth at the boundary that proved one exact runtime route. */
function recordRuntimeAuthMaterialization(params) {
	const fact = {
		provider: normalizeProviderId(params.provider),
		modelId: params.modelId.trim(),
		modelApi: params.modelApi.trim().toLowerCase(),
		modelBaseUrl: params.modelBaseUrl.trim(),
		requestTransportOverrides: params.requestTransportOverrides,
		authMode: params.authMode.trim().toLowerCase(),
		runtimeOwnerId: params.runtimeOwnerId.trim().toLowerCase(),
		...params.authProfileId?.trim() ? { authProfileId: params.authProfileId.trim() } : {}
	};
	if (Object.values(fact).some((value) => !value)) return false;
	const key = ownerKey(params.agentDir);
	const existing = materializations.get(key) ?? [];
	if (existing.some((candidate) => isDeepStrictEqual(candidate, fact))) return false;
	materializations.set(key, [...existing, fact].slice(-64));
	notify(params.agentDir);
	return true;
}
/** Revokes all facts backed by one runtime owner after a classified auth failure. */
function revokeRuntimeAuthMaterializations(params) {
	const key = ownerKey(params.agentDir);
	const provider = normalizeProviderId(params.provider);
	const runtimeOwnerId = params.runtimeOwnerId.trim().toLowerCase();
	const existing = materializations.get(key);
	if (!provider || !runtimeOwnerId || !existing) return false;
	const next = existing.filter((fact) => fact.provider !== provider || fact.runtimeOwnerId !== runtimeOwnerId);
	if (next.length === existing.length) return false;
	if (next.length) materializations.set(key, next);
	else materializations.delete(key);
	notify(params.agentDir);
	return true;
}
function getPreparedRuntimeAuthMaterializations(agentDir) {
	return materializations.get(ownerKey(agentDir)) ?? [];
}
/** Clears materializations for an already resolved canonical auth database owner. */
function clearRuntimeAuthMaterializationsAtDatabasePath(databasePath) {
	materializations.delete(databasePath);
}
function clearAllRuntimeAuthMaterializations() {
	materializations.clear();
}
//#endregion
//#region src/agents/auth-profiles/runtime-persisted-rows.ts
const IDENTITY_PROBE_INTERVAL_MS = 100;
var AuthProfileRuntimeReadStaleError = class extends Error {
	constructor(waitForSettlement) {
		super("Auth profile store changed during its runtime read; retry resolution");
		this.waitForSettlement = waitForSettlement;
		this.name = "AuthProfileRuntimeReadStaleError";
	}
};
function freezeRows(value) {
	if (value === null || typeof value !== "object" || Object.isFrozen(value)) return;
	Object.freeze(value);
	for (const child of Object.values(value)) freezeRows(child);
}
function readIdentity(databasePath) {
	return [
		"",
		"-wal",
		"-journal"
	].map((suffix) => {
		const stat = fs.statSync(databasePath + suffix, {
			bigint: true,
			throwIfNoEntry: false
		});
		return stat ? `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}` : "missing";
	}).join("/");
}
/** A derived rows cache; the runtime snapshot owner supplies publication generations. */
function createRuntimeAuthProfileRowsCache(revisionAtPath) {
	const entries = /* @__PURE__ */ new Map();
	return {
		clear(databasePath) {
			if (databasePath === void 0) entries.clear();
			else entries.delete(databasePath);
		},
		prepare(databasePath, reader, captureSettlement) {
			const revision = revisionAtPath(databasePath);
			const ownerLineage = [databasePath, ...revision.ownerLineage ?? []];
			let capturedRows;
			const assertCurrent = () => {
				reader.assertCurrent();
				if (revisionAtPath(databasePath).selection !== revision.selection) throw new AuthProfileRuntimeReadStaleError(captureSettlement?.(ownerLineage, capturedRows));
			};
			return {
				assertCurrent,
				async read() {
					assertCurrent();
					const entry = entries.get(databasePath);
					const checkedAt = performance.now();
					if (entry?.revision === revision.rows && checkedAt - entry.checkedAt < IDENTITY_PROBE_INTERVAL_MS) {
						capturedRows = entry.rows;
						return entry.rows;
					}
					const identity = readIdentity(databasePath);
					if (entry?.identity === identity && entry.revision === revision.rows) {
						entry.checkedAt = checkedAt;
						capturedRows = entry.rows;
						return entry.rows;
					}
					entries.delete(databasePath);
					const rows = await reader.read();
					capturedRows = rows;
					assertCurrent();
					if (rows.cacheable && rows.store.status !== "unreadable" && rows.state.status !== "unreadable" && revisionAtPath(databasePath).rows === revision.rows && readIdentity(databasePath) === identity) {
						freezeRows(rows);
						entries.set(databasePath, {
							identity,
							checkedAt,
							revision: revision.rows,
							rows
						});
						while (entries.size > 64) entries.delete(entries.keys().next().value);
					}
					return rows;
				}
			};
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/ownership.ts
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.local,
		right: params.main
	})) return true;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	if (isDeepStrictEqual(params.local, params.main)) return true;
	const mainExpires = asDateTimestampMs(params.main.expires);
	if (mainExpires === void 0) return false;
	const localExpires = asDateTimestampMs(params.local.expires);
	return localExpires === void 0 || mainExpires >= localExpires;
}
function isInheritedMainOAuthCredentialFromStores(params) {
	if (params.persistedStores.isMainStore || params.credential.type !== "oauth") return false;
	if (params.persistedStores.localStore?.profiles[params.profileId]) return false;
	const mainCredential = params.persistedStores.mainStore?.profiles[params.profileId];
	return mainCredential?.type === "oauth" && (isDeepStrictEqual(mainCredential, params.credential) || shouldUseMainOwnerForLocalOAuthCredential({
		profileId: params.profileId,
		local: params.credential,
		main: mainCredential
	}));
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-owner.ts
/** Canonical owner identity and nonpublishing auth snapshot composition. */
function createEmptyAuthProfileStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function stripRuntimeExternalProfileMetadata(store) {
	const stripped = { ...store };
	delete stripped.runtimeExternalProfileIds;
	delete stripped.runtimeExternalProfileIdsAuthoritative;
	setRuntimeExternalCliProfileIds(stripped, []);
	return stripped;
}
function markRuntimePersistedProfiles(store, persistedStore = store) {
	const profileIds = Object.entries(persistedStore.profiles).flatMap(([profileId, credential]) => isDeepStrictEqual(store.profiles[profileId], credential) ? [profileId] : []).toSorted();
	return {
		...store,
		runtimePersistedProfileIds: profileIds.length > 0 ? profileIds : void 0,
		runtimeLocalOrderProviderIds: Object.keys(persistedStore.order ?? {}).toSorted()
	};
}
function setRuntimeLocalProfileMetadata(store, localProfileIds, runtimeInheritsMainState = false) {
	return {
		...store,
		runtimeLocalProfileIds: [...new Set(localProfileIds)].toSorted(),
		...runtimeInheritsMainState ? { runtimeInheritsMainState: true } : {}
	};
}
function runtimeStoreInheritsMainState(store, localStore) {
	const state = ({ order, lastGood, usageStats }) => ({
		order,
		lastGood,
		usageStats
	});
	return !isDeepStrictEqual(state(store), state(localStore));
}
function listRuntimeLocalProfileIds(store, mainStore) {
	if (store.runtimeLocalProfileIds) return store.runtimeLocalProfileIds;
	return Object.entries(store.profiles).flatMap(([profileId, credential]) => mainStore && shouldUseMainOwnerForLocalOAuthCredential({
		profileId,
		local: credential,
		main: mainStore.profiles[profileId]
	}) ? [] : [profileId]);
}
function mergeLocalAuthProfileStoreWithInheritedStore(localStore, inheritedStore) {
	const merged = inheritedStore ? mergeAuthProfileStores(inheritedStore, localStore, { preserveBaseRuntimeExternalProfiles: true }) : localStore;
	return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(merged), listRuntimeLocalProfileIds(localStore, inheritedStore), runtimeStoreInheritsMainState(merged, localStore));
}
/** Compose the selected durable owner without publishing or discovering an ambient environment. */
function loadRuntimeAuthProfileOwnerSnapshot(owner, options = {}) {
	assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath);
	assertAuthProfileMigrationStateAtDatabasePath(owner.sharedDatabasePath);
	const isShared = owner.databasePath === owner.sharedDatabasePath;
	const sharedKind = owner.location === "state-db" ? "shared-state" : "agent";
	const sharedStore = isShared ? void 0 : options.inheritedStore ?? markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, sharedKind) ?? createEmptyAuthProfileStore());
	if (options.candidates && sharedStore) assertAuthProfileMigrationCandidates({
		databasePath: owner.sharedDatabasePath,
		candidates: options.candidates.shared,
		hasCredentials: () => Object.keys(sharedStore.profiles).length > 0
	});
	const localStore = markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.databasePath, isShared ? sharedKind : "agent") ?? createEmptyAuthProfileStore());
	if (options.candidates) assertAuthProfileMigrationCandidates({
		databasePath: owner.databasePath,
		candidates: isShared ? options.candidates.shared : options.candidates.local,
		hasCredentials: () => Object.keys(localStore.profiles).length > 0
	});
	return sharedStore ? mergeLocalAuthProfileStoreWithInheritedStore(localStore, sharedStore) : setRuntimeLocalProfileMetadata(localStore, listRuntimeLocalProfileIds(localStore));
}
/** Diagnostic source facts never participate in canonical ownership decisions. */
function captureRuntimeAuthProfileLegacyCandidates(agentDir, env = process.env) {
	return {
		local: resolveLegacyAuthProfileSourceCandidates({
			agentDir,
			env
		}),
		shared: resolveLegacyAuthProfileSourceCandidates({ env })
	};
}
function cloneRuntimeAuthProfileLegacyCandidates(candidates) {
	return candidates && {
		local: candidates.local.map((source) => ({ ...source })),
		shared: candidates.shared.map((source) => ({ ...source }))
	};
}
function prepareRuntimeAuthProfileStoreSnapshots(entries, env = process.env) {
	if (entries.length === 0) return [];
	const owner = captureRuntimeAuthSharedOwner(env);
	return entries.map((entry) => {
		const databasePath = entry.databasePath ?? (entry.agentDir ? resolveAuthProfileDatabasePath(entry.agentDir) : owner.sharedDatabasePath);
		return {
			databasePath,
			agentDir: path.dirname(databasePath),
			store: cloneAuthProfileStore(entry.store),
			owner: cloneRuntimeAuthSharedOwner(owner),
			legacyCandidates: captureRuntimeAuthProfileLegacyCandidates(databasePath === owner.sharedDatabasePath ? void 0 : entry.agentDir ?? path.dirname(databasePath), env)
		};
	});
}
function cloneRuntimeAuthSharedOwner(owner) {
	return owner.kind === "unresolved" ? {
		...owner,
		scope: { ...owner.scope }
	} : { ...owner };
}
function captureRuntimeAuthSharedOwner(env = process.env) {
	return {
		kind: "resolved",
		sharedDatabasePath: resolveSharedAuthStorePath(env),
		location: resolveSharedAuthStoreOwnership(env).location
	};
}
function runtimeAuthProfileSnapshotSharesOwner(snapshot, owner) {
	return resolveRuntimeAuthSharedOwnerPath(snapshot, owner.location) === owner.sharedDatabasePath;
}
/** Resolve a captured owner's path without opening a cold scope or consulting ambient state. */
function resolveRuntimeAuthSharedOwnerPath(snapshot, location) {
	if (snapshot.kind === "resolved") return snapshot.sharedDatabasePath;
	return location === "state-db" ? resolveAssistantStateSqlitePath({ TESTCLAW_STATE_DIR: snapshot.scope.stateDir }) : path.join(snapshot.scope.sharedMainDir, "testclaw-agent.sqlite");
}
function runtimeAuthSharedOwnerRebound(previous, next) {
	return next.kind === "resolved" ? !runtimeAuthProfileSnapshotSharesOwner(previous, next) : !isDeepStrictEqual(previous, next);
}
function runtimeAuthCredentialState(entries) {
	return Array.from(entries).filter(([, store]) => Object.keys(store.profiles).length > 0).map(([key, store]) => [key, store.profiles]).toSorted(([left], [right]) => left.localeCompare(right));
}
/** Model metadata follows credentials and availability, never rotation bookkeeping. */
function runtimeAuthMetadataState(store) {
	return {
		order: store.order,
		profiles: store.profiles,
		runtimePersistedProfileIds: store.runtimePersistedProfileIds,
		runtimeExternalProfileIds: store.runtimeExternalProfileIds,
		runtimeExternalProfileIdsAuthoritative: store.runtimeExternalProfileIdsAuthoritative,
		runtimeExternalCliProfileIds: store.runtimeExternalCliProfileIds,
		runtimeLocalProfileIds: store.runtimeLocalProfileIds,
		runtimeLocalOrderProviderIds: store.runtimeLocalOrderProviderIds,
		availability: Object.fromEntries(Object.entries(store.usageStats ?? {}).flatMap(([profileId, stats]) => {
			if (!store.profiles[profileId] && !profileId.startsWith("inline-api-key:")) return [];
			const availability = {
				blockedUntil: stats.blockedUntil,
				blockedModel: stats.blockedModel,
				blockedScope: stats.blockedScope,
				cooldownUntil: stats.cooldownUntil,
				cooldownReason: stats.cooldownReason,
				cooldownModel: stats.cooldownModel,
				disabledUntil: stats.disabledUntil,
				disabledReason: stats.disabledReason
			};
			return Object.values(availability).some((value) => value !== void 0) ? [[profileId, availability]] : [];
		}))
	};
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	if (store.runtimeCredentialSources) store.runtimeCredentialSources = Object.fromEntries(Object.entries(store.runtimeCredentialSources).filter(([profileId]) => keptProfileIds.has(profileId)));
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId) || profileId.startsWith("inline-api-key:"))) : void 0;
	store.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	store.runtimeLocalProfileIds = store.runtimeLocalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	store.runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	setRuntimeExternalCliProfileIds(store, getRuntimeExternalCliProfileIds(store).filter((profileId) => keptProfileIds.has(profileId)));
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function preserveResolvedSecretBackedCredentials(params) {
	const next = cloneAuthProfileStore(params.next);
	for (const [profileId, credential] of Object.entries(next.profiles)) {
		const existing = params.existing.profiles[profileId];
		if (credential.type === "api_key" && existing?.type === "api_key" && credential.key === void 0 && existing.key !== void 0 && isSecretRef(credential.keyRef) && isDeepStrictEqual(credential.keyRef, existing.keyRef)) next.profiles[profileId] = {
			...credential,
			key: existing.key
		};
		else if (credential.type === "token" && existing?.type === "token" && credential.token === void 0 && existing.token !== void 0 && isSecretRef(credential.tokenRef) && isDeepStrictEqual(credential.tokenRef, existing.tokenRef)) next.profiles[profileId] = {
			...credential,
			token: existing.token
		};
	}
	return next;
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshots.ts
/**
* Process-local auth profile snapshots used by prepared runtimes and tests.
* Snapshots are cloned at boundaries so callers cannot mutate shared state.
*/
const runtimeAuthStoreSnapshots = /* @__PURE__ */ new Map();
function runtimeStoreEntries() {
	return Array.from(runtimeAuthStoreSnapshots, ([key, entry]) => [key, entry.store]);
}
const runtimeAuthStoreMutationListeners = /* @__PURE__ */ new Set();
let runtimeAuthStoreCredentialsRevision = 0;
let runtimeAuthStoreSnapshotsRevision = 0;
const runtimeAuthStoreSnapshotRevisions = /* @__PURE__ */ new Map();
let runtimeAuthStoreMetadataRevision = 0;
const runtimeAuthStoreMetadataRevisions = /* @__PURE__ */ new Map();
let runtimeAuthStoreMetadataRevisionFloor = 0;
const runtimeAuthProfileRowsCache = createRuntimeAuthProfileRowsCache((databasePath) => {
	const owner = runtimeAuthStoreSnapshots.get(databasePath)?.owner;
	return {
		rows: `${getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath)}:${getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath)}`,
		selection: `${runtimeAuthStoreMetadataRevisions.get(databasePath) ?? runtimeAuthStoreMetadataRevisionFloor}:${getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath, "credentials")}`,
		ownerLineage: owner?.kind === "resolved" ? [owner.sharedDatabasePath] : owner ? [resolveRuntimeAuthSharedOwnerPath(owner, "state-db"), resolveRuntimeAuthSharedOwnerPath(owner, "legacy-main")] : []
	};
});
registerFreshSharedAuthStoreHandoff(({ previousSharedDatabasePath, sharedDatabasePath, env }) => {
	let rebound = false;
	const entries = listOwnedRuntimeAuthProfileStoreSnapshots();
	for (const entry of entries) {
		if (entry.owner.kind === "resolved" && entry.owner.location !== "legacy-main" || !runtimeAuthProfileSnapshotSharesOwner(entry.owner, {
			sharedDatabasePath: previousSharedDatabasePath,
			location: "legacy-main"
		})) continue;
		rebound = true;
		entry.owner = {
			kind: "resolved",
			sharedDatabasePath,
			location: "state-db"
		};
		entry.legacyCandidates = captureRuntimeAuthProfileLegacyCandidates(entry.agentDir, env);
	}
	if (rebound) replaceOwnedRuntimeAuthProfileStoreSnapshots(entries);
});
function advanceRuntimeAuthStoreSnapshotsRevision() {
	closeAuthProfileReadPool();
	runtimeAuthStoreSnapshotsRevision += 1;
}
function snapshotMetadataState(entry) {
	return entry && {
		state: runtimeAuthMetadataState(entry.store),
		owner: entry.owner,
		legacyCandidates: entry.legacyCandidates
	};
}
function advanceRuntimeAuthStoreMetadataRevision(key) {
	runtimeAuthStoreMetadataRevision += 1;
	runtimeAuthStoreMetadataRevisions.delete(key);
	runtimeAuthStoreMetadataRevisions.set(key, runtimeAuthStoreMetadataRevision);
	while (runtimeAuthStoreMetadataRevisions.size > 256) {
		const [oldestKey, revision] = runtimeAuthStoreMetadataRevisions.entries().next().value;
		runtimeAuthStoreMetadataRevisions.delete(oldestKey);
		runtimeAuthStoreMetadataRevisionFloor = Math.max(runtimeAuthStoreMetadataRevisionFloor, revision);
	}
}
function recordMetadataRevision(key, previous, next) {
	if (isDeepStrictEqual(snapshotMetadataState(previous), snapshotMetadataState(next))) return false;
	advanceRuntimeAuthStoreMetadataRevision(key);
	return true;
}
function replaceChangesCredentials(entries) {
	const next = new Map(entries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	return !isDeepStrictEqual(runtimeAuthCredentialState(runtimeStoreEntries()), runtimeAuthCredentialState(next));
}
function recordChangedSnapshotRevisions(entries) {
	const next = new Map(entries.map((entry) => [entry.databasePath, {
		store: entry.store,
		owner: entry.owner,
		legacyCandidates: entry.legacyCandidates
	}]));
	const keys = /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()]);
	let metadataChanged = false;
	for (const key of keys) {
		const previous = runtimeAuthStoreSnapshots.get(key);
		const candidate = next.get(key);
		if (isDeepStrictEqual(previous, candidate)) continue;
		metadataChanged = recordMetadataRevision(key, previous, candidate) || metadataChanged;
		advanceRuntimeAuthStoreSnapshotsRevision();
		if (next.has(key)) runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
		else runtimeAuthStoreSnapshotRevisions.delete(key);
	}
	return metadataChanged;
}
function resolveRuntimeSnapshotEntryKey(entry) {
	return entry.databasePath ?? resolveRuntimeStoreKey(entry.agentDir);
}
function notifyRuntimeAuthStoreMutation(agentDir, profileSetChanged = false) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0,
		profileSetChanged
	};
	for (const listener of runtimeAuthStoreMutationListeners) listener(event);
}
function authProfilesChanged(previous, next) {
	return !isDeepStrictEqual(previous?.profiles ?? {}, next?.profiles ?? {});
}
function authProfileSetChanged(previous, next) {
	return !isDeepStrictEqual(Object.keys(previous?.profiles ?? {}).toSorted(), Object.keys(next?.profiles ?? {}).toSorted());
}
/** Observes credential, ownership, and availability changes, excluding usage bookkeeping. */
function registerRuntimeAuthProfileStoreMutationListener(listener) {
	runtimeAuthStoreMutationListeners.add(listener);
	return () => runtimeAuthStoreMutationListeners.delete(listener);
}
/** Reads a cloned runtime auth profile store snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshotCore(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotAtDatabasePath(resolveRuntimeStoreKey(agentDir));
}
function getRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath) {
	const store = runtimeAuthStoreSnapshots.get(databasePath)?.store;
	return store ? cloneAuthProfileStore(store) : void 0;
}
/** Capture an authoritative local pin without copying or reopening credential material. */
function captureRuntimeAuthProfileLocalPin(databasePath, profileId) {
	const store = runtimeAuthStoreSnapshots.get(databasePath)?.store;
	const credential = store?.profiles[profileId];
	if (!credential || !store?.runtimeLocalProfileIds?.includes(profileId)) return;
	return {
		databasePath,
		matchesCredential: (current) => isDeepStrictEqual(credential, current)
	};
}
function getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath) {
	const entry = runtimeAuthStoreSnapshots.get(databasePath);
	return entry && {
		databasePath,
		agentDir: path.dirname(databasePath),
		store: cloneAuthProfileStore(entry.store),
		owner: cloneRuntimeAuthSharedOwner(entry.owner),
		legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(entry.legacyCandidates)
	};
}
/**
* Reads the effective prepared auth store without falling back to persisted storage.
* Lifecycle consumers use this after auth publication so request paths never reopen SQLite.
*/
function getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir, env) {
	const inheritedKey = resolveRuntimeStoreKey(inheritedAuthDir, env);
	const requestedKey = resolveRuntimeStoreKey(agentDir, env);
	const inherited = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(inheritedKey);
	if (requestedKey === inheritedKey) return inherited;
	const requested = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(requestedKey);
	if (agentDir && inherited && requested) return mergeAuthProfileStores(inherited, requested, { preserveBaseRuntimeExternalProfiles: true });
	if (agentDir && !requested && inherited) return {
		...inherited,
		runtimeLocalOrderProviderIds: []
	};
	return requested ?? inherited;
}
/** Captures the published owners once; catalog reads refresh usage without opening storage. */
function createPreparedRuntimeAuthProfileUsageReader(agentDir, inheritedAuthDir) {
	const requestedKey = resolveRuntimeStoreKey(agentDir);
	const requestedOwner = runtimeAuthStoreSnapshots.get(requestedKey)?.owner;
	const inheritedKey = inheritedAuthDir ? resolveRuntimeStoreKey(inheritedAuthDir) : requestedOwner?.kind === "resolved" ? requestedOwner.sharedDatabasePath : requestedKey;
	const owners = [.../* @__PURE__ */ new Set([inheritedKey, requestedKey])].flatMap((key) => {
		const entry = runtimeAuthStoreSnapshots.get(key);
		return entry ? [{
			key,
			owner: entry.owner
		}] : [];
	});
	return (store) => {
		const current = /* @__PURE__ */ new Map();
		for (const { key, owner } of owners) {
			const entry = runtimeAuthStoreSnapshots.get(key);
			if (!entry || runtimeAuthSharedOwnerRebound(owner, entry.owner)) return store;
			current.set(key, entry.store);
		}
		const inherited = current.get(inheritedKey);
		const requested = current.get(requestedKey);
		const published = inherited && requested && inheritedKey !== requestedKey ? mergeAuthProfileStores(inherited, requested, { preserveBaseRuntimeExternalProfiles: true }) : requested ?? inherited;
		if (!published) return store;
		const workerProfiles = buildPersistedAuthProfileSecretsStore(store).profiles;
		const publishedProfiles = buildPersistedAuthProfileSecretsStore(published).profiles;
		let usageStats;
		for (const [profileId, credential] of Object.entries(workerProfiles)) {
			if (!isDeepStrictEqual(credential, publishedProfiles[profileId])) continue;
			const usage = (published.profiles[profileId] === requested?.profiles[profileId] ? requested : inherited)?.usageStats?.[profileId];
			if (isDeepStrictEqual(store.usageStats?.[profileId], usage)) continue;
			usageStats ??= { ...store.usageStats };
			if (usage === void 0) delete usageStats[profileId];
			else usageStats[profileId] = usage;
		}
		return usageStats ? {
			...store,
			usageStats: cloneAuthProfileStore({
				version: store.version,
				profiles: {},
				usageStats
			}).usageStats
		} : store;
	};
}
/** Lists cloned snapshots with their canonical database identity and producer ownership. */
function listOwnedRuntimeAuthProfileStoreSnapshots() {
	return Array.from(runtimeAuthStoreSnapshots, ([databasePath, entry]) => ({
		databasePath,
		agentDir: path.dirname(databasePath),
		store: cloneAuthProfileStore(entry.store),
		owner: cloneRuntimeAuthSharedOwner(entry.owner),
		legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(entry.legacyCandidates)
	}));
}
/** Select derived snapshots by their producer's shared owner, never directory shape. */
function listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) {
	return listOwnedRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath !== owner.sharedDatabasePath && runtimeAuthProfileSnapshotSharesOwner(entry.owner, owner));
}
/** Returns true when a runtime snapshot exists for an agent dir. */
function hasRuntimeAuthProfileStoreSnapshot(agentDir) {
	return runtimeAuthStoreSnapshots.has(resolveRuntimeStoreKey(agentDir));
}
/** Checks the owned profile keys without copying private credential data out of the owner. */
function hasRuntimeAuthProfileStoreSource(agentDir) {
	const store = runtimeAuthStoreSnapshots.get(resolveRuntimeStoreKey(agentDir))?.store;
	return Boolean(store && Object.keys(store.profiles).length > 0);
}
/** Returns true when requested or main runtime snapshots contain profiles. */
function hasAnyRuntimeAuthProfileStoreSource(agentDir) {
	return hasRuntimeAuthProfileStoreSource(agentDir) || Boolean(agentDir) && hasRuntimeAuthProfileStoreSource();
}
/** Replaces all runtime auth profile snapshots with cloned entries. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
	replaceOwnedRuntimeAuthProfileStoreSnapshots(entries.map((entry) => {
		const databasePath = resolveRuntimeSnapshotEntryKey(entry);
		return {
			databasePath,
			agentDir: path.dirname(databasePath),
			store: cloneAuthProfileStore(entry.store),
			owner: cloneRuntimeAuthSharedOwner(runtimeAuthStoreSnapshots.get(databasePath)?.owner ?? {
				kind: "unresolved",
				scope: captureAuthProfileOwnerScope()
			}),
			legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(runtimeAuthStoreSnapshots.get(databasePath)?.legacyCandidates ?? captureRuntimeAuthProfileLegacyCandidates(entry.agentDir ?? (entry.databasePath ? path.dirname(databasePath) : void 0)))
		};
	}));
}
function replaceOwnedRuntimeAuthProfileStoreSnapshots(entries) {
	const sharedEntries = entries.map((entry) => ({
		...entry,
		store: removePersonalAuthProfileReferences(entry.store)
	}));
	const reboundKeys = new Set(sharedEntries.filter((entry) => {
		const previous = runtimeAuthStoreSnapshots.get(entry.databasePath);
		return previous && runtimeAuthSharedOwnerRebound(previous.owner, entry.owner);
	}).map((entry) => entry.databasePath));
	if (replaceChangesCredentials(sharedEntries) || reboundKeys.size > 0) runtimeAuthStoreCredentialsRevision += 1;
	const next = new Map(sharedEntries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	const profileSetChanged = [.../* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()])].some((key) => authProfileSetChanged(runtimeAuthStoreSnapshots.get(key)?.store, next.get(key)));
	for (const key of /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()])) if (reboundKeys.has(key) || authProfilesChanged(runtimeAuthStoreSnapshots.get(key)?.store, next.get(key))) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	const metadataChanged = recordChangedSnapshotRevisions(sharedEntries);
	const nextOwned = sharedEntries.map((entry) => {
		return [resolveRuntimeSnapshotEntryKey(entry), {
			store: cloneAuthProfileStore(entry.store),
			owner: cloneRuntimeAuthSharedOwner(entry.owner),
			legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(entry.legacyCandidates)
		}];
	});
	runtimeAuthStoreSnapshots.clear();
	for (const [key, entry] of nextOwned) runtimeAuthStoreSnapshots.set(key, entry);
	if (metadataChanged) notifyRuntimeAuthStoreMutation(void 0, profileSetChanged);
}
/** Clears all runtime auth profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
	const snapshotsChanged = runtimeAuthStoreSnapshots.size > 0;
	const credentialsChanged = runtimeAuthCredentialState(runtimeStoreEntries()).length > 0;
	const profileSetChanged = runtimeStoreEntries().some(([, store]) => Object.keys(store.profiles).length > 0);
	if (credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	advanceRuntimeAuthStoreSnapshotsRevision();
	runtimeAuthProfileRowsCache.clear();
	runtimeAuthStoreMetadataRevision += 1;
	runtimeAuthStoreMetadataRevisionFloor = runtimeAuthStoreMetadataRevision;
	runtimeAuthStoreSnapshots.clear();
	clearAllRuntimeAuthMaterializations();
	runtimeAuthStoreSnapshotRevisions.clear();
	runtimeAuthStoreMetadataRevisions.clear();
	if (snapshotsChanged) notifyRuntimeAuthStoreMutation(void 0, profileSetChanged);
}
/** Clears one runtime auth-profile snapshot without disturbing other active agents. */
function clearRuntimeAuthProfileStoreSnapshotCore(agentDir) {
	return clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(resolveRuntimeStoreKey(agentDir), agentDir);
}
function clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(key, agentDir) {
	runtimeAuthProfileRowsCache.clear(key);
	const store = runtimeAuthStoreSnapshots.get(key)?.store;
	if (!store) {
		advanceRuntimeAuthStoreMetadataRevision(key);
		return false;
	}
	if (Object.keys(store.profiles).length > 0) runtimeAuthStoreCredentialsRevision += 1;
	advanceRuntimeAuthStoreSnapshotsRevision();
	recordMetadataRevision(key, runtimeAuthStoreSnapshots.get(key), void 0);
	runtimeAuthStoreSnapshots.delete(key);
	clearRuntimeAuthMaterializationsAtDatabasePath(key);
	runtimeAuthStoreSnapshotRevisions.delete(key);
	notifyRuntimeAuthStoreMutation(agentDir, Object.keys(store.profiles).length > 0);
	return true;
}
function setRuntimeAuthProfileStoreSnapshotAtKey(store, key, agentDir, owner, legacyCandidates) {
	const sharedStore = removePersonalAuthProfileReferences(store);
	const previous = runtimeAuthStoreSnapshots.get(key);
	const sharedOwnerChanged = !isDeepStrictEqual(previous?.owner, owner) || !isDeepStrictEqual(previous?.legacyCandidates, legacyCandidates);
	const credentialsChanged = !isDeepStrictEqual(runtimeAuthCredentialState(runtimeAuthStoreSnapshots.has(key) ? [[key, runtimeAuthStoreSnapshots.get(key).store]] : []), runtimeAuthCredentialState([[key, sharedStore]]));
	const sharedOwnerRebound = previous && runtimeAuthSharedOwnerRebound(previous.owner, owner);
	if (credentialsChanged || sharedOwnerRebound) runtimeAuthStoreCredentialsRevision += 1;
	const previousStore = previous?.store;
	const profileSetChanged = authProfileSetChanged(previousStore, sharedStore);
	if (sharedOwnerRebound || authProfilesChanged(previousStore, sharedStore)) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	const metadataChanged = recordMetadataRevision(key, previous, {
		store: sharedStore,
		owner,
		legacyCandidates
	});
	if (sharedOwnerChanged || !isDeepStrictEqual(previousStore, sharedStore)) {
		advanceRuntimeAuthStoreSnapshotsRevision();
		runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
	}
	runtimeAuthStoreSnapshots.set(key, {
		store: cloneAuthProfileStore(sharedStore),
		owner: cloneRuntimeAuthSharedOwner(owner),
		legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(legacyCandidates)
	});
	if (metadataChanged) notifyRuntimeAuthStoreMutation(agentDir, profileSetChanged);
}
/** Stores a cloned runtime auth profile snapshot for an agent dir. */
function setRuntimeAuthProfileStoreSnapshot(store, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(store, resolveRuntimeStoreKey(agentDir), agentDir, captureRuntimeAuthSharedOwner(), captureRuntimeAuthProfileLegacyCandidates(agentDir));
}
/** Restore the captured runtime owner independently of the persistence transaction. */
function restoreOwnedRuntimeAuthProfileStoreSnapshot(entry, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(entry.store, entry.databasePath, agentDir, entry.owner, entry.legacyCandidates);
}
/** Materialization changes contents, not the existing producer's shared ownership. */
function updateRuntimeAuthProfileStoreSnapshot(store, agentDir) {
	const key = resolveRuntimeStoreKey(agentDir);
	setRuntimeAuthProfileStoreSnapshotAtKey(store, key, agentDir, runtimeAuthStoreSnapshots.get(key)?.owner ?? captureRuntimeAuthSharedOwner(), runtimeAuthStoreSnapshots.get(key)?.legacyCandidates ?? captureRuntimeAuthProfileLegacyCandidates(agentDir));
}
/** Stores a cloned snapshot under an already resolved canonical database owner. */
function setRuntimeAuthProfileStoreSnapshotAtDatabasePath(store, databasePath, agentDir, owner, legacyCandidates) {
	const existing = runtimeAuthStoreSnapshots.get(databasePath);
	const candidates = "env" in owner ? captureRuntimeAuthProfileLegacyCandidates(databasePath === owner.sharedDatabasePath ? void 0 : agentDir, owner.env) : legacyCandidates ?? (existing && runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner) ? existing.legacyCandidates : void 0);
	setRuntimeAuthProfileStoreSnapshotAtKey(store, databasePath, agentDir, {
		kind: "resolved",
		sharedDatabasePath: owner.sharedDatabasePath,
		location: owner.location
	}, candidates);
}
/**
* Invalidates prepared credential ownership after a persisted owner-store write.
* Main-store credentials are inherited by custom-agent snapshots, so those
* derived snapshots must be dropped even when no exact main snapshot exists.
* State-only saves refresh them in the publisher without changing credential ownership.
*/
function noteRuntimeAuthProfileStorePersistedMutation(agentDir, mutation, owner) {
	if (!mutation.credentialsChanged && !mutation.profileSetChanged && !mutation.stateChanged) return;
	if (mutation.credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	const ownerKey = owner?.databasePath ?? resolveRuntimeStoreKey(agentDir);
	if (mutation.credentialsChanged && mutation.oauthRefreshClaimIds?.size) publishOAuthRefreshClaimIdentities(ownerKey, mutation.oauthRefreshClaimIds);
	runtimeAuthProfileRowsCache.clear(ownerKey);
	if (mutation.selectionChanged) advanceRuntimeAuthStoreMetadataRevision(ownerKey);
	if (mutation.credentialsChanged || mutation.profileSetChanged) clearRuntimeAuthMaterializationsAtDatabasePath(ownerKey);
	recordRuntimeAuthProfileStorePersistedMutation(ownerKey, mutation);
	const mainKey = owner?.sharedDatabasePath ?? resolveRuntimeStoreKey(void 0);
	if (ownerKey === mainKey && (mutation.credentialsChanged || mutation.profileSetChanged)) {
		let deletedDerivedSnapshot = false;
		const sharedOwner = owner ?? captureRuntimeAuthSharedOwner();
		for (const [key, entry] of runtimeAuthStoreSnapshots) if (key !== mainKey && runtimeAuthProfileSnapshotSharesOwner(entry.owner, sharedOwner)) {
			recordMetadataRevision(key, entry, void 0);
			runtimeAuthStoreSnapshots.delete(key);
			runtimeAuthStoreSnapshotRevisions.delete(key);
			deletedDerivedSnapshot = true;
		}
		if (deletedDerivedSnapshot) advanceRuntimeAuthStoreSnapshotsRevision();
	}
	if (mutation.credentialsChanged || mutation.profileSetChanged) notifyRuntimeAuthStoreMutation(agentDir, mutation.profileSetChanged === true);
}
/** Stable token for credential ownership without coupling to usage bookkeeping. */
function getRuntimeAuthProfileStoreCredentialsRevision() {
	return runtimeAuthStoreCredentialsRevision;
}
/** Metadata generation; full snapshot revisions separately fence bookkeeping and rollback. */
function getRuntimeAuthProfileStoreMetadataRevision(agentDir) {
	return runtimeAuthStoreMetadataRevisions.get(resolveRuntimeStoreKey(agentDir)) ?? runtimeAuthStoreMetadataRevision;
}
function getRuntimeAuthProfileStoreSnapshotsRevision() {
	return runtimeAuthStoreSnapshotsRevision;
}
/** Process-local generation for one exact runtime snapshot rollback owner. */
function getRuntimeAuthProfileStoreSnapshotRevision(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(resolveRuntimeStoreKey(agentDir));
}
/** Process-local generation for an already resolved canonical snapshot owner. */
function getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath) {
	return runtimeAuthStoreSnapshotRevisions.get(databasePath) ?? runtimeAuthStoreSnapshotsRevision;
}
//#endregion
export { normalizeOAuthRefreshCredential as $, createEmptyAuthProfileStore as A, runtimeStoreInheritsMainState as B, replaceRuntimeAuthProfileStoreSnapshots as C, setRuntimeAuthProfileStoreSnapshotAtDatabasePath as D, setRuntimeAuthProfileStoreSnapshot as E, prepareRuntimeAuthProfileStoreSnapshots as F, AuthProfileRuntimeReadStaleError as G, stripRuntimeExternalProfileMetadata as H, preserveResolvedSecretBackedCredentials as I, registerRuntimeAuthMaterializationMutationListener as J, getPreparedRuntimeAuthMaterializations as K, pruneAuthProfileStoreReferences as L, loadRuntimeAuthProfileOwnerSnapshot as M, markRuntimePersistedProfiles as N, updateRuntimeAuthProfileStoreSnapshot as O, mergeLocalAuthProfileStoreWithInheritedStore as P, isExactOAuthCredential as Q, runtimeAuthMetadataState as R, replaceOwnedRuntimeAuthProfileStoreSnapshots as S, runtimeAuthProfileRowsCache as T, isInheritedMainOAuthCredentialFromStores as U, setRuntimeLocalProfileMetadata as V, shouldUseMainOwnerForLocalOAuthCredential as W, beginOAuthRefreshObservation as X, revokeRuntimeAuthMaterializations as Y, captureOAuthRefreshSettlement as Z, hasRuntimeAuthProfileStoreSource as _, createPreparedRuntimeAuthProfileUsageReader as a, getRuntimeAuthProfileStoreProfileSetMutationToken as at, noteRuntimeAuthProfileStorePersistedMutation as b, getRuntimeAuthProfileStoreCredentialsRevision as c, getRuntimeAuthProfileStoreSnapshotCore as d, observeOAuthRefreshFenceSettlement as et, getRuntimeAuthProfileStoreSnapshotRevision as f, hasRuntimeAuthProfileStoreSnapshot as g, hasAnyRuntimeAuthProfileStoreSource as h, clearRuntimeAuthProfileStoreSnapshots as i, getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath as it, listRuntimeLocalProfileIds as j, captureRuntimeAuthProfileLegacyCandidates as k, getRuntimeAuthProfileStoreMetadataRevision as l, getRuntimeAuthProfileStoreSnapshotsRevision as m, clearRuntimeAuthProfileStoreSnapshotAtDatabasePath as n, refreshSerializedOAuthCredential as nt, getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath as o, getRuntimeAuthProfileStoreStateMutationToken as ot, getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath as p, recordRuntimeAuthMaterialization as q, clearRuntimeAuthProfileStoreSnapshotCore as r, getRuntimeAuthProfileStoreCredentialMutationToken as rt, getPreparedRuntimeAuthProfileStoreSnapshotCore as s, captureRuntimeAuthProfileLocalPin as t, observeOAuthRefreshSettlement as tt, getRuntimeAuthProfileStoreSnapshotAtDatabasePath as u, listOwnedRuntimeAuthProfileStoreSnapshots as v, restoreOwnedRuntimeAuthProfileStoreSnapshot as w, registerRuntimeAuthProfileStoreMutationListener as x, listRuntimeAuthProfileStoreSnapshotsForSharedOwner as y, runtimeAuthProfileSnapshotSharesOwner as z };
