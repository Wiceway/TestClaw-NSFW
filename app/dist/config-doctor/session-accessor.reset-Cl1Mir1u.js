import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { c as resolveAgentIdFromSessionKey, k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { S as parseParentLinkedOpaqueEntry, b as isIndexedSessionEntry, x as parseOpaqueLeafEntry, y as findSessionTranscriptHeader } from "./transcript-payload-BaqIXvVM.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { P as resolveSessionAuthProfileOverrideSource, T as hasSessionActiveAutoModelFallback } from "./agent-scope-BiRi-Smp.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { a as deferAssistantAgentPostCommitPublication, f as runAssistantAgentWriteTransaction, l as openAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { n as projectModelContextMessages } from "./model-context-message-BMr0fCKI.js";
import { t as runAssistantAgentWorkerWrite } from "./testclaw-agent-write-admission-fcqqlXn0.js";
import { c as isInternalSessionEffectsKey } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { Dt as sqliteSessionEntriesEqual, a as normalizeLifecycleTarget, c as readSessionIdentitySnapshot, d as resolveLifecyclePrimaryEntry, f as writeSessionEntry, i as deleteSessionEntryRows, it as runSqliteSessionDeletionTransaction, n as deleteLegacySessionEntryRows, nt as hasPreparedNativeSessionDeletion, ot as withSqliteSessionDeletions, rt as runPreparedSqliteSessionWrite, u as rehomeSessionWindows } from "./session-accessor.sqlite-entry-store-BzD1qpup.js";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-Bxbtl4CI.js";
import { C as readExactSessionEntryRow, S as readExactSessionEntryJson, b as prepareExactSessionEntryRowReads, d as readSessionEntryCache, p as retainSessionEntryWorkerPublication, r as projectSessionSharingEntry } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { a as normalizeStoreSessionKey, c as resolveSessionStoreEntryCore, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-BKQU6sPT.js";
import { a as getSessionKysely, d as resolveSqliteStoreScope, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, i as formatSqliteSessionReferenceForScope, m as resolveSqliteTranscriptScope, n as cloneSessionEntry, o as normalizeSqliteSessionKey, r as formatLegacySqliteSessionMarkerForScope, u as resolveSqliteScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { D as preserveSqliteSameKeySessionRolloverLineage, E as resolveSessionStorePathForScope, d as patchSessionEntryCore, j as iterateSessionEntriesForListing, s as loadSessionEntry } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { n as readSessionEntryCount, r as readSessionEntryStore, t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-BMYuBnL9.js";
import { _ as prunePublishedSessionArchivesByRetention, a as assertPlannedLifecycleArtifactEntriesUnchanged, c as deletePlannedLifecycleArtifactEntries, f as projectSessionEntryLifecycleMutation, g as shouldRemoveSessionEntry, o as collectProjectedReferencedSessionIds, s as deleteMaterializedSessionStatePlans, u as planSessionStateAfterEntryRemoval, v as publishSessionStateArchives, y as emitArchivedTranscriptUpdates } from "./session-accessor.sqlite-generation-copy-DcJmL4R4.js";
import { n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-CRMka_kI.js";
import { C as prepareLifecycleIdentityPublication, S as prepareCommittedSessionEntryRemovals, T as publishCommittedSessionIdentity, c as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort, s as applySessionEntryMaintenance, w as prepareSessionIdentityPublication, x as emptySessionEntryMaintenancePlan, y as applySessionEntryMaintenanceInDatabase } from "./session-history-eviction-DQFASP_w.js";
import { i as isSessionTranscriptSideAppendEntry, o as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, p as selectSessionTranscriptTreePathNodes, r as isSessionTranscriptLeafControl, u as scanSessionTranscriptTree } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { l as resolveMaintenanceConfig, u as captureSessionMaintenancePreservation } from "./disk-budget-BOamfkPB.js";
import { D as loadTranscriptEventsFromDatabase, a as ensureTranscriptHeader, h as createSessionTranscriptHeader, n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-BX2GNujg.js";
import { n as supportsAssistantAgentDatabaseExecution, t as captureAssistantAgentDatabaseExecution } from "./testclaw-agent-execution-CA747lDP.js";
import { o as resolveFreshSessionTotalTokens, r as mergeSessionEntry } from "./types-BhbLC9G7.js";
import { o as resolveStoredSessionOwnerAgentId } from "./session-store-key-DRl7Rrsc.js";
import { f as hasPluginHostCleanupTarget, h as shouldSkipPluginHostCleanupStore, i as resolveAccessStorePath, m as matchesPluginHostCleanupSession, p as isLockedHarnessSessionOwnedByPlugin, t as listSessionEntriesCore, u as clearPluginHostCleanupTarget } from "./session-accessor.entry-BGyeftoC.js";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-B67C58J9.js";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CBtrr-9r.js";
import { f as resolveAgentHarnessSessionStoreError, p as resolveAgentHarnessSessionStoreTransitionError } from "./agent-harness-session-key-Bbf-OONo.js";
import { s as appendSessionResetBoundary } from "./session-accessor.sqlite-lifecycle-DroV7NMI.js";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-BAEDh6TK.js";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, o as assertModelSelectionUnlocked } from "./model-overrides-D92VyxpR.js";
import { n as iterateSessionContextEntries } from "./session-BKH3neS_.js";
import { r as derivePromptTokens, u as normalizeUsage } from "./usage-C3K3M4jZ.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { isMainThread } from "node:worker_threads";
import { stripCompactionReplayCheckpoint } from "@testclaw/ai/transports";
//#region src/config/sessions/session-accessor.sqlite-replacement-read.ts
function readSessionEntryReplacementLabelOwnerKeys(database, label) {
	return label === void 0 ? [] : executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("label", "=", label).orderBy("session_key")).rows.map((row) => row.session_key);
}
function selectReplacementKeys(database, params, labelOwnerKeys) {
	if (params.statuses) {
		if (params.statuses.length === 0) return [];
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("status", "in", params.statuses);
		if (params.sessionKeys) query = query.where("session_key", "in", sqliteStringSet(params.sessionKeys));
		return executeSqliteQuerySync(database.db, query).rows.map((row) => row.session_key).toSorted((left, right) => left.localeCompare(right));
	}
	if (params.sessionKeys) return uniqueStrings([...params.sessionKeys, ...labelOwnerKeys]);
	assertCanonicalSqliteSessionKeysCurrent(database);
	return [...iterateSessionEntryKeys(database)];
}
/** Detached entries and their CAS bytes must come from the same admitted read snapshot. */
function readSessionEntryReplacementState(database, params) {
	const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
	const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
	const labelOwnerKeys = readSessionEntryReplacementLabelOwnerKeys(database, params.includeLabelOwners);
	const selected = selectReplacementKeys(database, params, labelOwnerKeys);
	const expectedRows = /* @__PURE__ */ new Map();
	const readPrepared = selected.length > 1 ? prepareExactSessionEntryRowReads(database, selected) : void 0;
	return {
		entries: selected.flatMap((sessionKey) => {
			const row = readPrepared ? readPrepared(sessionKey) : readExactSessionEntryRow(database, sessionKey);
			if (!row) {
				if (!selectedKeys || selectedStatuses) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
				return [];
			}
			if (selectedStatuses && (!row.entry.status || !selectedStatuses.has(row.entry.status))) return [];
			expectedRows.set(sessionKey, row);
			return [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}];
		}),
		expectedRows,
		labelOwnerKeys
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-state.ts
/** Receipts carry only publication facts, never saved prompts or maintenance payloads. */
function prepareSessionEntryReplacementPublication(result) {
	return {
		kind: "session-entry-replacements",
		membershipInvalidatedKeys: result.membershipInvalidatedKeys,
		previous: new Map([...result.previous].map(([key, entry]) => [key, {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		}])),
		current: new Map([...result.current].map(([key, entry]) => [key, projectSessionSharingEntry(entry)])),
		changedKeys: [.../* @__PURE__ */ new Set([
			...result.previous.keys(),
			...result.current.keys(),
			...result.maintenancePlans.flatMap((plan) => plan.archivedSessionKeys)
		])]
	};
}
/** One SQL owner serves admitted worker writes and the native rollback exception. */
function commitSessionEntryReplacementsInDatabase(database, input, assertCommitAllowed) {
	if (input.includeLabelOwners !== void 0 && JSON.stringify(readSessionEntryReplacementLabelOwnerKeys(database, input.includeLabelOwners)) !== JSON.stringify(input.labelOwnerKeys)) throw new Error("SQLite session label owners changed before replacement");
	const transactionEntries = /* @__PURE__ */ new Map();
	for (const sessionKey of input.validationKeys) {
		const transactionRow = readExactSessionEntryRow(database, sessionKey);
		const expectedRow = input.expectedRows.get(sessionKey);
		if (transactionRow?.row.entry_json !== expectedRow?.row.entry_json || !sqliteSessionEntriesEqual(transactionRow?.entry, expectedRow?.entry)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
		if (transactionRow) transactionEntries.set(sessionKey, transactionRow.entry);
	}
	assertCommitAllowed();
	const previous = /* @__PURE__ */ new Map();
	const current = /* @__PURE__ */ new Map();
	const membershipInvalidatedKeys = [];
	for (const replacement of input.replacements) {
		const sourceEntries = [replacement.sessionKey, ...replacement.previousSessionKeys ?? []].flatMap((sessionKey) => {
			const entry = transactionEntries.get(sessionKey);
			return entry ? [{
				entry,
				sessionKey
			}] : [];
		});
		const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
		for (const { entry, sessionKey } of sourceEntries) previous.set(sessionKey, entry);
		const written = writeSessionEntry(database, replacement.sessionKey, cloneSessionEntry(replacement.entry), {
			...input.consumePendingReset ? { consumePendingReset: true } : {},
			previousEntry: selectedBefore ?? null,
			canonicalPreviousEntry: transactionEntries.get(replacement.sessionKey) ?? null
		});
		deleteLegacySessionEntryRows(database, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, { rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId });
		if (replacement.previousSessionKeys?.some((key) => key !== replacement.sessionKey)) membershipInvalidatedKeys.push(replacement.sessionKey);
		current.set(replacement.sessionKey, written);
	}
	const maintenance = input.maintenance;
	const preservation = maintenance?.preservation;
	return {
		previous,
		current,
		maintenancePlans: [maintenance && preservation ? applySessionEntryMaintenanceInDatabase(database, maintenance, () => preservation) : emptySessionEntryMaintenancePlan()],
		membershipInvalidatedKeys
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-worker.ts
async function withReplacementWorker(options, databaseIdentity, assertCurrent, run, onCommit) {
	const execution = captureAssistantAgentDatabaseExecution(options, databaseIdentity ? { expectedIdentity: {
		kind: "file",
		physicalIdentity: databaseIdentity,
		nativeLocation: options.path
	} } : {});
	const assertHeld = () => {
		execution.assertCurrent();
		assertCurrent();
	};
	const source = {
		assertCurrent: assertHeld,
		createAdmission(binding) {
			return (retained) => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertHeld();
					if (request.stage === "commit") onCommit?.(admission, retained, request.facts);
					if (!grant()) throw new Error("Session replacement authority expired");
				});
				return {
					nativeLocations: binding.nativeLocations,
					admission
				};
			};
		}
	};
	try {
		return await runAssistantAgentWorkerWrite(options, () => run(execution, source));
	} finally {
		await execution.release();
	}
}
function prepareSessionEntryReplacementDatabase(options, assertCurrent) {
	return withReplacementWorker(options, void 0, assertCurrent, (execution, source) => execution.prepare(source));
}
async function commitSessionEntryReplacementsInWorker(options, databaseIdentity, input, assertCurrent) {
	const publication = retainSessionEntryWorkerPublication({
		agentId: options.agentId,
		storePath: options.path,
		databaseIdentity
	});
	let committed;
	let admitted;
	try {
		return await withReplacementWorker(options, databaseIdentity, assertCurrent, async (execution, source) => {
			const result = await execution.runExisting(source, (worker) => worker.execute({
				type: "session.entries.replace",
				input
			}));
			if (!result) throw new Error("Session database disappeared before replacement");
			committed = result;
			return result;
		}, (admission, retained, facts) => {
			if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-entry-replacements" || !Array.isArray(facts.publication.changedKeys) || !facts.publication.changedKeys.every((key) => typeof key === "string") || !Array.isArray(facts.publication.membershipInvalidatedKeys) || !facts.publication.membershipInvalidatedKeys.every((key) => typeof key === "string")) throw new Error("Session replacement commit omitted its publication keys");
			admitted = {
				admission,
				retained
			};
			publication.begin(facts.publication.changedKeys, facts.publication.membershipInvalidatedKeys);
		});
	} finally {
		if (admitted) {
			const settlement = await admitted.retained.settled;
			const facts = admitted.admission.committed?.facts;
			let receipt;
			if (isRecord(facts) && facts.kind === "session-entry-replacements") receipt = facts;
			else if (committed) receipt = prepareSessionEntryReplacementPublication(committed);
			const published = publication.settle(receipt, settlement.kind === "unknown");
			if (published) publishCommittedSessionIdentity(options.agentId, published.previous, published.current);
		}
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-projection.ts
async function applySqliteSessionEntryReplacementProjection(params, normalize) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? params.sessionKeys?.[0] ?? "",
		storePath: params.storePath
	});
	resolved.env = cloneEnvWithPlatformSemantics(resolved.env ?? process.env);
	resolved.env.TESTCLAW_STATE_DIR = resolveStateDir(resolved.env);
	const databaseOptions = {
		...toDatabaseOptions(resolved),
		path: resolveAssistantAgentSqlitePath(toDatabaseOptions(resolved))
	};
	resolved.path = databaseOptions.path;
	const useWorker = isMainThread && supportsAssistantAgentDatabaseExecution(databaseOptions);
	const preparedWrite = await runPreparedSqliteSessionWrite(resolved, async () => {
		const readNative = () => withSqliteSessionDatabase(databaseOptions, (database) => ({
			...readSessionEntryReplacementState(database, params),
			databaseIdentity: readAssistantAgentDatabaseIdentity(database).identity
		}));
		const snapshot = useWorker ? await withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
			const read = () => owner.readExactEntries({
				sessionKeys: params.sessionKeys ?? [],
				projection: "replacement",
				replacementSelection: {
					sessionKeys: params.sessionKeys,
					statuses: params.statuses,
					includeLabelOwners: params.includeLabelOwners
				},
				env: { ...resolved.env }
			});
			let result = await read();
			if (!result.replacement) {
				await prepareSessionEntryReplacementDatabase(databaseOptions, () => {
					owner.assertCurrent();
					params.assertCommitAllowed?.();
				});
				result = await read();
			}
			if (!result.replacement) throw new Error("Session replacement snapshot lost its initialized database");
			return result.replacement;
		}) : await readNative();
		const { entries, expectedRows, labelOwnerKeys } = snapshot;
		const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
		const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
		const replacementAuthorityKeys = selectedStatuses ? new Set(entries.map(({ sessionKey }) => sessionKey)) : selectedKeys;
		const operation = await params.update(entries);
		const replacements = normalize(operation.replacements);
		const claimedCanonicalKeys = /* @__PURE__ */ new Set();
		for (const replacement of replacements) {
			const previousSessionKeys = replacement.previousSessionKeys;
			const canonical = previousSessionKeys !== void 0;
			if (canonical && !replacement.sessionKey) throw new Error("Session entry replacement requires a key");
			if (canonical && [replacement.sessionKey, ...previousSessionKeys ?? []].some(isInternalSessionEffectsKey)) throw new Error("Session entry canonical replacement cannot target internal effects rows");
			for (const sessionKey of [replacement.sessionKey, ...previousSessionKeys ?? []]) {
				if (replacementAuthorityKeys && !replacementAuthorityKeys.has(sessionKey)) throw new Error(`Session entry replacement is outside the selected ${selectedStatuses ? "row" : "key"} set: ${sessionKey}`);
				if (canonical) {
					if (claimedCanonicalKeys.has(sessionKey)) throw new Error(`Session entry replacements overlap at ${sessionKey}`);
					claimedCanonicalKeys.add(sessionKey);
				}
			}
			if (canonical) {
				for (const previousSessionKey of previousSessionKeys) if (!expectedRows.has(previousSessionKey)) throw new Error(`Session entry canonical projection cannot replace missing alias ${previousSessionKey}`);
			}
		}
		const applicable = replacements.filter((replacement) => replacement.previousSessionKeys || expectedRows.has(replacement.sessionKey));
		if (params.requireWriteSuccess && replacements.length > 0 && applicable.length === 0) throw new Error("session entry replacements did not persist any rows");
		if (applicable.length === 0) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: operation.result
			})
		};
		const mutationKeys = new Set(applicable.flatMap((replacement) => [replacement.sessionKey, ...replacement.previousSessionKeys ?? []]));
		const validationKeys = /* @__PURE__ */ new Set([...mutationKeys, ...labelOwnerKeys]);
		return {
			deletedEntries: [...mutationKeys].flatMap((sessionKey) => {
				const entry = expectedRows.get(sessionKey)?.entry;
				return entry && !applicable.some((replacement) => replacement.sessionKey === sessionKey) ? [{
					entry,
					sessionKey
				}] : [];
			}),
			commit: async (assertSourceCurrent) => {
				const maintenance = params.skipMaintenance === false ? {
					activeSessionKey: params.activeSessionKey ?? "",
					archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
					maintenance: resolveMaintenanceConfig(),
					preservation: captureSessionMaintenancePreservation(params.storePath),
					storePath: params.storePath
				} : void 0;
				const assertCurrent = () => {
					assertSourceCurrent?.();
					params.assertCommitAllowed?.();
					if (maintenance && !isDeepStrictEqual(maintenance.preservation, captureSessionMaintenancePreservation(params.storePath))) throw new Error("Session maintenance protection changed before replacement");
				};
				const input = {
					expectedRows,
					labelOwnerKeys,
					includeLabelOwners: params.includeLabelOwners,
					validationKeys: [...validationKeys],
					replacements: applicable,
					consumePendingReset: params.consumePendingReset,
					maintenance
				};
				if (!useWorker || hasPreparedNativeSessionDeletion()) return withSqliteSessionDatabase(databaseOptions, () => {
					const committed = runSqliteSessionDeletionTransaction((database) => {
						const result = commitSessionEntryReplacementsInDatabase(database, input, assertCurrent);
						return {
							...result,
							publish: prepareSessionIdentityPublication(database, resolved.agentId, result.previous, result.current)
						};
					}, databaseOptions, { operationLabel: "session.entry-replacements" });
					committed.publish();
					return {
						maintenancePlans: committed.maintenancePlans,
						result: operation.result
					};
				}, assertCurrent);
				if (typeof snapshot.databaseIdentity !== "string") throw new Error("Session replacement requires its durable database identity");
				return {
					maintenancePlans: (await commitSessionEntryReplacementsInWorker(databaseOptions, snapshot.databaseIdentity, input, assertCurrent)).maintenancePlans,
					result: operation.result
				};
			}
		};
	}, "session.entry-replacements");
	const committed = preparedWrite.result;
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: preparedWrite.deletedEntries });
	return committed.result;
}
async function applySessionEntryExactReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection(params, (replacements) => [...replacements ?? []].map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})));
}
/** Internal alias-aware owner; public SDK replacements remain exact-key only. */
async function applySessionEntryCanonicalReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection({
		...params,
		...params.sessionKeys ? { sessionKeys: uniqueStrings(params.sessionKeys.map((key) => key.trim()).filter(Boolean)) } : {}
	}, (replacements) => [...replacements ?? []].map((replacement) => ({
		entry: replacement.entry,
		previousSessionKeys: uniqueStrings(replacement.previousSessionKeys.map((key) => key.trim()).filter(Boolean)),
		sessionKey: replacement.sessionKey.trim()
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-batch-projection.ts
/** Compatibility adapter for the shipped detached-store projection. */
async function applySessionEntryBatchProjection(params) {
	return await applySessionEntryCanonicalReplacements({
		...params,
		update: async (entries) => {
			const store = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
			const operation = await params.update(store);
			return {
				result: operation.result,
				replacements: [...operation.mutations ?? []].map((mutation) => ({
					entry: mutation.entry,
					previousSessionKeys: mutation.previousSessionKeys ?? [],
					sessionKey: mutation.sessionKey
				}))
			};
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle-types.ts
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection.ts
let sessionArchiveRuntimePromise;
function loadSessionArchiveRuntime$1() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime-C2b98Jp6.js");
	return sessionArchiveRuntimePromise;
}
async function applySessionEntryReplacements(params) {
	return await applySessionEntryExactReplacements(params);
}
/**
* Applies a detached whole-store projection under the SQLite writer lane.
* This exists only for bounded compatibility adapters that must preserve a
* legacy serialized callback without exposing mutable storage internals.
*/
async function applySessionStoreProjection(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? "",
		storePath: params.storePath
	});
	const preparedWrite = await runPreparedSqliteSessionWrite(resolved, async () => {
		return withSqliteSessionDatabase(toDatabaseOptions(resolved), async (database) => {
			const before = readSessionEntryStore(database);
			const projected = structuredClone(before);
			const operation = await params.update(projected);
			if (!operation.persist) return {
				deletedEntries: [],
				commit: () => ({
					maintenancePlans: [],
					result: operation.result
				})
			};
			const lockedEntriesBefore = new Map(Object.entries(before).filter(([, entry]) => entry.modelSelectionLocked === true));
			const transitionError = resolveAgentHarnessSessionStoreTransitionError({
				before: lockedEntriesBefore,
				store: projected
			});
			const storeError = resolveAgentHarnessSessionStoreError(projected);
			if (transitionError || storeError) throw new Error(transitionError ?? storeError);
			const changedKeys = uniqueStrings([...Object.keys(before), ...Object.keys(projected)]).filter((sessionKey) => !sqliteSessionEntriesEqual(before[sessionKey], projected[sessionKey]));
			if (changedKeys.length === 0) return {
				deletedEntries: [],
				commit: () => ({
					maintenancePlans: [],
					result: operation.result
				})
			};
			const maintenancePlans = [];
			return {
				deletedEntries: changedKeys.flatMap((sessionKey) => {
					const entry = before[sessionKey];
					return entry && !projected[sessionKey] ? [{
						entry,
						sessionKey
					}] : [];
				}),
				commit: (assertSourceCurrent) => withSqliteSessionDatabase(toDatabaseOptions(resolved), () => {
					runSqliteSessionDeletionTransaction((transactionDb) => {
						assertSourceCurrent?.();
						for (const sessionKey of changedKeys) {
							const current = readExactSessionEntryRow(transactionDb, sessionKey)?.entry;
							if (!sqliteSessionEntriesEqual(current, before[sessionKey])) throw new Error(`SQLite session entry changed before store projection for ${sessionKey}`);
						}
						for (const sessionKey of changedKeys) {
							const entry = projected[sessionKey];
							if (entry) writeSessionEntry(transactionDb, sessionKey, cloneSessionEntry(entry), { previousEntry: before[sessionKey] ?? null });
							else deleteSessionEntryRows(transactionDb, sessionKey);
						}
						maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
							activeSessionKey: params.activeSessionKey ?? "",
							archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
							skipMaintenance: params.skipMaintenance,
							storePath: params.storePath
						}));
					}, toDatabaseOptions(resolved), { operationLabel: "session.store-projection" });
					return {
						maintenancePlans,
						result: operation.result
					};
				})
			};
		});
	}, "session.store-projection");
	const committed = preparedWrite.result;
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: preparedWrite.deletedEntries });
	return committed.result;
}
function readProjectedRemovalEntry(database, projected, allowCanonicalRepair = false) {
	const expectedRawEntryJson = projected.removal.expectedRawEntryJson;
	if (expectedRawEntryJson === void 0) return (allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, projected.sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, projected.sessionKey))?.entry;
	if (readExactSessionEntryJson(database, projected.sessionKey) !== expectedRawEntryJson) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${projected.sessionKey}`);
	return projected.expectedEntry;
}
/** Applies exact lifecycle removals/upserts using SQLite session rows. */
async function applySessionEntryLifecycleMutation(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const removals = [...params.removals ?? []];
	const upserts = [...params.upserts ?? []];
	let artifactCleanupError;
	const captureArtifactCleanupError = (error) => {
		if (params.captureArtifactCleanupError === true) {
			artifactCleanupError ??= error;
			return;
		}
		throw error;
	};
	let projected;
	let materializedRemovalPlans = [];
	let removalArchiveMaterializationFailed = false;
	const preparedWrite = await runPreparedSqliteSessionWrite(resolved, async () => {
		projected = await projectSessionEntryLifecycleMutation(toDatabaseOptions(resolved), {
			...params.allowCanonicalRepair ? { allowCanonicalRepair: true } : {},
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
			removals,
			upserts
		});
		const deletedOwners = projected.removals.flatMap(({ sessionKey, expectedEntry: entry }) => {
			return entry && !projected.upsertedEntries.some((upsert) => upsert.sessionKey === sessionKey) ? [{
				entry,
				sessionKey
			}] : [];
		});
		const resetSources = projected.upsertedEntries.flatMap(({ resetBoundary, expectedEntry }) => resetBoundary && expectedEntry?.sessionId ? [expectedEntry.sessionId] : []);
		return {
			deletedEntries: deletedOwners,
			...projected.deletePlans.length > 0 || resetSources.length > 0 ? { beforeCommit: async () => {
				if (resetSources.length > 0) {
					const { restoreSessionColdTranscript } = await import("./session-cold-storage-BtPaMmVG.js");
					for (const sessionId of new Set(resetSources)) await restoreSessionColdTranscript({
						agentId: resolved.agentId,
						env: resolved.env,
						storePath: params.storePath,
						sessionId
					});
				}
				try {
					materializedRemovalPlans = await materializeSessionStateDeletePlans(projected.deletePlans);
				} catch (error) {
					removalArchiveMaterializationFailed = true;
					captureArtifactCleanupError(error);
				}
			} } : {},
			commit: (assertSourceCurrent) => withSqliteSessionDatabase(toDatabaseOptions(resolved), () => commitProjectedLifecycleMutation(materializedRemovalPlans, removalArchiveMaterializationFailed, assertSourceCurrent))
		};
	}, "session.lifecycle.mutate", params.withCommit);
	const committed = preparedWrite.result;
	function commitProjectedLifecycleMutation(removalPlans, materializationFailed, assertSourceCurrent) {
		let beforeCount = 0;
		const removedSessionKeys = [];
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runSqliteSessionDeletionTransaction((transactionDb) => {
			params.beforeCommitInTransaction?.();
			assertSourceCurrent?.();
			if (params.onLifecycleCommitted) deferAssistantAgentPostCommitPublication(transactionDb, params.onLifecycleCommitted);
			beforeCount = readSessionEntryCount(transactionDb);
			const validatedRemovals = projected.removals.filter((removal) => {
				if (materializationFailed && removal.removal.archiveRemovedTranscript === true) return false;
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) {
					const replacedInSameMutation = projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey);
					throw new Error(replacedInSameMutation ? `SQLite session entry has stale lifecycle state for ${removal.sessionKey}` : `SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				}
				const shouldRemove = shouldRemoveSessionEntry(entry, removal.removal);
				if (!shouldRemove && projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey)) throw new Error(`SQLite session entry has stale lifecycle state for ${removal.sessionKey}`);
				return shouldRemove;
			});
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, removalPlans, void 0, new Set(validatedRemovals.map((removal) => removal.sessionKey)));
			const legacyReplacementTargets = /* @__PURE__ */ new Map();
			for (const { sessionKey, entry, expectedEntry, routeContext, resetBoundary } of projected.upsertedEntries) {
				const sameKeyRemoval = validatedRemovals.find((removal) => removal.sessionKey === sessionKey);
				const currentEntry = sameKeyRemoval ? readProjectedRemovalEntry(transactionDb, sameKeyRemoval, params.allowCanonicalRepair) : (params.allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(transactionDb, sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(transactionDb, sessionKey))?.entry;
				const expectedCurrentEntry = expectedEntry ?? sameKeyRemoval?.expectedEntry;
				if (!sqliteSessionEntriesEqual(currentEntry, expectedCurrentEntry)) {
					if (sameKeyRemoval) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
					throw new SessionEntryLifecycleUpsertConflictError(sessionKey);
				}
				if (sameKeyRemoval && !shouldRemoveSessionEntry(currentEntry, sameKeyRemoval.removal)) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
				if (resetBoundary && expectedEntry?.sessionId) {
					const boundaryScope = {
						...resolved,
						sessionId: expectedEntry.sessionId,
						sessionKey
					};
					appendSessionResetBoundary(transactionDb, boundaryScope, expectedEntry, resetBoundary);
				}
				writeSessionEntry(transactionDb, sessionKey, entry, {
					allowStoredAliases: params.allowCanonicalRepair === true,
					preserveNodeSuggestions: params.allowCanonicalRepair === true,
					previousEntry: expectedCurrentEntry ?? null,
					...routeContext !== void 0 ? { routeContext } : {}
				});
				const relatedRemovalKeys = validatedRemovals.flatMap((removal) => {
					const removedSessionId = removal.expectedEntry.sessionId;
					return removal.sessionKey !== sessionKey && (removedSessionId === entry.sessionId || removedSessionId === entry.previousSessionId) ? [removal.sessionKey] : [];
				});
				rehomeSessionWindows(transactionDb, sessionKey, relatedRemovalKeys);
				for (const legacyKey of relatedRemovalKeys) {
					const removedEntry = validatedRemovals.find((removal) => removal.sessionKey === legacyKey)?.expectedEntry;
					legacyReplacementTargets.set(legacyKey, {
						canonicalKey: sessionKey,
						rehomeMembers: removedEntry?.sessionId === entry.sessionId
					});
				}
			}
			params.afterUpsertsInTransaction?.(transactionDb);
			params.afterFreshUpsertsInTransaction?.(transactionDb);
			const upsertedKeys = new Set(projected.upsertedEntries.map((upsert) => upsert.sessionKey));
			for (const removal of validatedRemovals) {
				if (upsertedKeys.has(removal.sessionKey)) continue;
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) throw new Error(`SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				if (!shouldRemoveSessionEntry(entry, removal.removal)) continue;
				const replacement = legacyReplacementTargets.get(removal.sessionKey);
				if (replacement) deleteLegacySessionEntryRows(transactionDb, [removal.sessionKey], replacement.canonicalKey, {
					rehomeMembers: replacement.rehomeMembers,
					validatedEntries: /* @__PURE__ */ new Map([[removal.sessionKey, entry]])
				});
				else deleteSessionEntryRows(transactionDb, removal.sessionKey, {
					deleteOwnedWindows: removal.removal.deleteOwnedWindows === true,
					deliveryCleanupKeys: removal.removal.deliveryCleanupKeys,
					validatedEntry: entry
				});
				removedSessionKeys.push(removal.sessionKey);
			}
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: params.activeSessionKey ?? "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				forceMaintenance: params.maintenanceOverride !== void 0,
				maintenanceConfig: params.maintenanceOverride ? {
					...resolveMaintenanceConfig(),
					...params.maintenanceOverride
				} : void 0,
				skipMaintenance: params.skipMaintenance,
				storePath: params.storePath
			}));
			return prepareLifecycleIdentityPublication({
				database: transactionDb,
				agentId: resolved.agentId,
				projected,
				removedSessionKeys
			});
		}, toDatabaseOptions(resolved))();
		return {
			archivedTranscripts,
			beforeCount,
			maintenancePlans,
			removedSessionKeys,
			publishArchives: params.skipMaintenance !== true || params.allowCanonicalRepair === true || params.afterUpsertsInTransaction !== void 0 || removals.length > 0 || projected.upsertedEntries.length === 0 || projected.upsertedEntries.some(({ expectedEntry }) => expectedEntry !== void 0)
		};
	}
	const { archivedTranscripts: maintenanceArchivedTranscripts, ...maintenance } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: preparedWrite.deletedEntries });
	let publishedRemovalTranscripts = [];
	try {
		if (committed.publishArchives) publishedRemovalTranscripts = await publishSessionStateArchives(resolved, committed.archivedTranscripts);
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	const archivedTranscripts = [...publishedRemovalTranscripts, ...maintenanceArchivedTranscripts];
	const afterCount = readSessionEntryCount(openAssistantAgentDatabase(toDatabaseOptions(resolved)));
	emitArchivedTranscriptUpdates(archivedTranscripts);
	const archivedTranscriptDirectories = uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted();
	if (archivedTranscriptDirectories.length > 0 && params.cleanupArchivedTranscripts) try {
		const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime$1();
		await cleanupArchivedSessionTranscripts({
			directories: archivedTranscriptDirectories,
			rules: params.cleanupArchivedTranscripts.rules,
			nowMs: params.cleanupArchivedTranscripts.nowMs
		});
		await prunePublishedSessionArchivesByRetention({
			scope: resolved,
			rules: params.cleanupArchivedTranscripts.rules,
			nowMs: params.cleanupArchivedTranscripts.nowMs
		});
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	return {
		beforeCount: committed.beforeCount,
		removedEntries: committed.removedSessionKeys.length,
		removedSessionKeys: committed.removedSessionKeys,
		...maintenance,
		archivedTranscriptDirectories,
		afterCount,
		artifactCleanupError
	};
}
/** Purges entries owned by a deleted agent from SQLite session rows. */
async function purgeDeletedAgentSessionEntries(params) {
	const resolved = resolveSqliteScope({
		agentId: params.storeAgentId,
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openAssistantAgentDatabase(toDatabaseOptions(resolved));
		const store = readSessionEntryStore(database);
		const remainingStore = { ...store };
		const entryRemovals = [];
		const removedEntriesToArchive = [];
		for (const sessionKey of Object.keys(store)) {
			if (resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) !== params.agentId) continue;
			const entry = store[sessionKey];
			if (!entry) continue;
			entryRemovals.push({
				expectedEntry: cloneSessionEntry(entry),
				sessionKey
			});
			removedEntriesToArchive.push(entry);
			delete remainingStore[sessionKey];
		}
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entryRemovals.map((removal) => removal.sessionKey),
			projectedStore: remainingStore
		});
		return {
			deletePlans: removedEntriesToArchive.flatMap((entry) => planSessionStateAfterEntryRemoval({
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				database,
				entry,
				reason: "deleted",
				referencedSessionIds
			})),
			entryRemovals
		};
	}, "session.agent-purge.prepare");
	const materializedPlans = await materializeSessionStateDeletePlans(prepared.deletePlans);
	const committed = await withSqliteSessionDeletions(resolved, prepared.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
		entry,
		sessionKey
	}] : []), async () => await runExclusiveSqliteSessionWrite(resolved, async () => {
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runSqliteSessionDeletionTransaction((transactionDb) => {
			const currentOwnedSessionKeys = Object.keys(readSessionEntryStore(transactionDb)).filter((sessionKey) => resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) === params.agentId).toSorted();
			const plannedSessionKeys = prepared.entryRemovals.map((removal) => removal.sessionKey).toSorted();
			if (JSON.stringify(currentOwnedSessionKeys) !== JSON.stringify(plannedSessionKeys)) throw new Error("SQLite deleted-agent session entries changed before purge");
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, prepared.entryRemovals);
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, new Set(prepared.entryRemovals.map((removal) => removal.sessionKey)));
			deletePlannedLifecycleArtifactEntries(transactionDb, prepared.entryRemovals);
			const publish = prepareCommittedSessionEntryRemovals(resolved.agentId, prepared.entryRemovals);
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				storePath: params.storePath
			}));
			return publish;
		}, toDatabaseOptions(resolved))();
		return {
			archivedTranscripts,
			maintenancePlans
		};
	}, "session.agent-purge.commit"));
	const { archivedTranscripts: maintenanceArchivedTranscripts } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: prepared.entryRemovals.length });
	const archivedTranscripts = [...await publishSessionStateArchives(resolved, committed.archivedTranscripts), ...maintenanceArchivedTranscripts];
	emitArchivedTranscriptUpdates(archivedTranscripts);
}
/** Fully replaces rows for one transcript in the additive SQLite transcript store. */
//#endregion
//#region src/config/sessions/session-entry-selection.ts
var SessionLabelOwnerIndex = class {
	#owners = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
		for (const [sessionKey, entry] of Object.entries(this.store)) this.#update(sessionKey, entry.label, true);
	}
	isLabelInUse(label, excludedKeys) {
		for (const sessionKey of this.#owners.get(label) ?? []) if (!excludedKeys.includes(sessionKey)) return true;
		return false;
	}
	replaceEntry(candidateKeys, primaryKey, entry) {
		for (const sessionKey of /* @__PURE__ */ new Set([...candidateKeys, primaryKey])) {
			this.#update(sessionKey, this.store[sessionKey]?.label, false);
			delete this.store[sessionKey];
		}
		const cloned = structuredClone(entry);
		this.store[primaryKey] = cloned;
		this.#update(primaryKey, cloned.label, true);
		return cloned;
	}
	#update(sessionKey, label, add) {
		if (label === void 0) return;
		const owners = this.#owners.get(label) ?? /* @__PURE__ */ new Set();
		if (add) {
			owners.add(sessionKey);
			this.#owners.set(label, owners);
			return;
		}
		owners.delete(sessionKey);
	}
};
function selectSessionModelOverride(entry) {
	return {
		modelOverride: entry.modelOverride,
		providerOverride: entry.providerOverride,
		modelOverrideSource: entry.modelOverrideSource,
		modelOverrideRouteResolution: entry.modelOverrideRouteResolution,
		agentRuntimeOverride: entry.agentRuntimeOverride
	};
}
/** Carries only user/runtime selection into a new dashboard fork. */
function inheritSessionSelection(parentEntry) {
	if (!parentEntry) return {};
	const authProfileOverrideSource = resolveSessionAuthProfileOverrideSource(parentEntry);
	const inheritModelSelection = !hasSessionActiveAutoModelFallback(parentEntry);
	const inheritAuthProfile = inheritModelSelection || authProfileOverrideSource === "user" || authProfileOverrideSource === "user-link";
	return {
		...inheritModelSelection && parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...inheritModelSelection && parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...inheritModelSelection && parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...inheritModelSelection && parentEntry.modelOverrideRouteResolution ? { modelOverrideRouteResolution: parentEntry.modelOverrideRouteResolution } : {},
		...inheritModelSelection && parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.contextWindow ? { contextWindow: parentEntry.contextWindow } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.toolOverrides ? { toolOverrides: parentEntry.toolOverrides } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...inheritAuthProfile && authProfileOverrideSource && parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...inheritAuthProfile && authProfileOverrideSource ? { authProfileOverrideSource } : {}
	};
}
function cloneOptionalSessionEntry(entry) {
	return entry ? structuredClone(entry) : void 0;
}
function resolveProjectionExistingEntry(snapshot, target) {
	const candidateKeys = target.candidateKeys ?? [target.primaryKey];
	let freshest;
	for (const candidateKey of candidateKeys) {
		const entry = snapshot.store[candidateKey];
		if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
	}
	return cloneOptionalSessionEntry(freshest);
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle.ts
/** Projects ordered session patches against one store snapshot and commits once. */
async function applySessionPatchProjections(params) {
	return await applySessionEntryBatchProjection({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		skipMaintenance: true,
		update: async (workingStore) => {
			const snapshot = { store: workingStore };
			const labelOwners = new SessionLabelOwnerIndex(workingStore);
			const mutations = [];
			const results = [];
			for (const operation of params.operations) try {
				const target = operation.resolveTarget(snapshot);
				const existingEntry = resolveProjectionExistingEntry(snapshot, target);
				const candidateKeys = uniqueStrings((target.candidateKeys ?? [target.primaryKey]).map((key) => key.trim()).filter(Boolean));
				const projected = await operation.project({
					...target,
					...snapshot,
					...existingEntry ? { existingEntry } : {},
					isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys)
				});
				if (!projected.ok) {
					results.push(projected);
					continue;
				}
				const authorizationFailure = operation.authorize?.();
				if (authorizationFailure) {
					results.push(authorizationFailure);
					continue;
				}
				const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== target.primaryKey && workingStore[sessionKey]);
				mutations.push({
					entry: projected.entry,
					...previousSessionKeys.length > 0 ? { previousSessionKeys } : {},
					sessionKey: target.primaryKey
				});
				const cloned = labelOwners.replaceEntry(candidateKeys, target.primaryKey, projected.entry);
				results.push({
					ok: true,
					entry: structuredClone(cloned)
				});
			} catch (error) {
				if (!operation.onError) throw error;
				results.push(operation.onError(error));
			}
			return {
				mutations,
				result: results
			};
		}
	});
}
/** Applies one patch through the canonical ordered batch projection owner. */
async function applySessionPatchProjection(params) {
	const [result] = await applySessionPatchProjections({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		operations: [{
			resolveTarget: params.resolveTarget,
			project: params.project,
			...params.assertCurrent ? { authorize: () => {
				params.assertCurrent?.();
			} } : {}
		}]
	});
	if (!result) throw new Error("Session patch projection produced no result");
	return result;
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	if (shouldSkipPluginHostCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	const now = Date.now();
	let cleared = 0;
	for (const { entry, sessionKey } of listSessionEntriesCore({
		agentId: params.agentId,
		storePath: params.storePath,
		projection: "list"
	})) {
		if (isLockedHarnessSessionOwnedByPlugin(entry, params.preserveLockedHarnessIds)) continue;
		if (!matchesPluginHostCleanupSession(sessionKey, entry, params.sessionKey) || !hasPluginHostCleanupTarget(entry, params)) continue;
		if (params.shouldCleanup && !params.shouldCleanup()) break;
		await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey,
			storePath: params.storePath
		}, (currentEntry) => {
			if (isLockedHarnessSessionOwnedByPlugin(currentEntry, params.preserveLockedHarnessIds)) return null;
			if (!hasPluginHostCleanupTarget(currentEntry, params)) return null;
			clearPluginHostCleanupTarget(currentEntry, params);
			currentEntry.updatedAt = now;
			return currentEntry;
		}, {
			shouldCommit: params.shouldCleanup,
			onCommitted: () => {
				cleared += 1;
			},
			replaceEntry: true,
			skipMaintenance: true
		});
	}
	return cleared;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-creation-read.ts
function* collectCreationCandidates(snapshot, normalizedKey, facts) {
	for (const candidate of iterateSessionEntriesForListing(snapshot)) {
		if (candidate.sessionKey === normalizedKey) facts.targetEntry = candidate.entry;
		else facts.labels.add(candidate.entry.label);
		yield candidate;
	}
}
/** Owns the complete target payload and sibling-label facts before asynchronous preparation. */
function readSessionCreationSnapshot(scope) {
	const database = openAssistantAgentDatabase(toDatabaseOptions(resolveSqliteScope(scope)));
	const snapshot = readSessionEntryCache(database, {
		cache: false,
		projection: "list",
		fullEntryKeys: [normalizeStoreSessionKey(scope.sessionKey), ...collectSessionEntryLookupKeys(database, scope.sessionKey)]
	});
	const facts = {
		targetEntry: void 0,
		labels: /* @__PURE__ */ new Set()
	};
	const resolved = resolveSessionEntryCandidates({
		entries: collectCreationCandidates(snapshot, normalizeStoreSessionKey(scope.sessionKey), facts),
		sessionKey: scope.sessionKey,
		canonicalKeys: true
	});
	const { targetEntry, labels } = facts;
	return {
		normalizedKey: resolved.normalizedKey,
		legacyKeys: resolved.legacyKeys,
		existingEntry: resolved.existing ? { ...resolved.existing.entry } : void 0,
		targetEntry: targetEntry ? { ...targetEntry } : void 0,
		isLabelInUse: (label) => labels.has(label)
	};
}
//#endregion
//#region src/config/sessions/session-entry-navigation.ts
/** Physical replay traversal stops on unknown rows; budget exhaustion retains the current ID. */
function* walkSessionCurrentTurn(initialParentId, ancestorLimit) {
	let parentId = initialParentId;
	let remainingAncestors = ancestorLimit;
	while (parentId && remainingAncestors-- > 0) {
		const parent = yield parentId;
		if (!parent || parent.id !== parentId || !parent.traversable) break;
		parentId = parent.parentId;
	}
	return parentId;
}
function resolveSessionCanonicalParentId(parentId, byId, opaqueParentsById) {
	let seen;
	let currentId = parentId;
	while (currentId && !byId.has(currentId)) {
		if (seen?.has(currentId)) return null;
		(seen ??= /* @__PURE__ */ new Set()).add(currentId);
		currentId = opaqueParentsById.get(currentId) ?? null;
	}
	return currentId;
}
/** Opaque keep markers retain the same canonical ancestry as session replay. */
function resolveOpaqueSessionFirstKeptEntryId(params) {
	const { firstKeptEntryId, byId, opaqueParentsById } = params;
	const parent = resolveSessionCanonicalParentId(firstKeptEntryId, byId, opaqueParentsById);
	if (parent !== null) return parent;
	const seen = /* @__PURE__ */ new Set();
	let currentId = params.parentId;
	let firstCanonicalDescendant;
	while (currentId && !seen.has(currentId)) {
		if (currentId === firstKeptEntryId) {
			if (firstCanonicalDescendant) return firstCanonicalDescendant;
			break;
		}
		seen.add(currentId);
		const entry = byId.get(currentId);
		if (entry) {
			firstCanonicalDescendant = entry.id;
			currentId = entry.parentId;
		} else currentId = opaqueParentsById.get(currentId) ?? null;
	}
	for (const entry of params.entries()) {
		const ancestors = /* @__PURE__ */ new Set();
		let parentId = entry.parentId;
		while (parentId && opaqueParentsById.has(parentId) && !ancestors.has(parentId)) {
			if (parentId === firstKeptEntryId) return entry.id;
			ancestors.add(parentId);
			parentId = opaqueParentsById.get(parentId) ?? null;
		}
	}
	return params.fallbackParentId ?? void 0;
}
/** Normalize selected branch boundaries before choosing or hydrating model context. */
function normalizeSessionContextEntryBoundaries(entries, navigation) {
	if (!entries.some((entry) => isRecord(entry) && (entry.type === "compaction" || entry.type === "reset") && typeof entry.firstKeptEntryId === "string")) return entries.slice();
	const byId = /* @__PURE__ */ new Map();
	const opaqueParentsById = /* @__PURE__ */ new Map();
	for (const node of navigation) if (isIndexedSessionEntry(node.entry)) byId.set(node.id, {
		id: node.id,
		parentId: node.parentId
	});
	else opaqueParentsById.set(node.id, node.parentId);
	return entries.map((entry) => {
		if (!isIndexedSessionEntry(entry) || entry.type !== "compaction" && entry.type !== "reset" || entry.firstKeptEntryId === void 0 || byId.has(entry.firstKeptEntryId) || !opaqueParentsById.has(entry.firstKeptEntryId)) return entry;
		const parentId = resolveSessionCanonicalParentId(entry.parentId, byId, opaqueParentsById);
		const firstKeptEntryId = resolveOpaqueSessionFirstKeptEntryId({
			firstKeptEntryId: entry.firstKeptEntryId,
			parentId,
			fallbackParentId: parentId,
			byId,
			opaqueParentsById,
			entries: () => byId.values()
		});
		return firstKeptEntryId ? {
			...entry,
			firstKeptEntryId
		} : entry;
	});
}
/** One navigation owner for runtime sessions and streaming transcript operations. */
var SessionEntryNavigation = class {
	constructor() {
		this.byId = /* @__PURE__ */ new Map();
		this.opaqueParentsById = /* @__PURE__ */ new Map();
		this.logicalParentsById = /* @__PURE__ */ new Map();
		this.invalidLeafControlIds = /* @__PURE__ */ new Set();
		this.labelsById = /* @__PURE__ */ new Map();
		this.labelTimestampsById = /* @__PURE__ */ new Map();
		this.leafId = null;
		this.appendParentId = null;
		this.resetDescendantIds = /* @__PURE__ */ new Set();
	}
	clearNavigation() {
		this.byId.clear();
		this.opaqueParentsById.clear();
		this.logicalParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.labelsById.clear();
		this.labelTimestampsById.clear();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.latestResetId = void 0;
		this.resetDescendantIds.clear();
	}
	finishNavigation() {
		this.latestResetId = void 0;
		this.resetDescendantIds.clear();
	}
	resolveOpaqueLeafTargetId(targetId) {
		if (targetId === null || this.byId.has(targetId)) return targetId;
		return this.resolveCanonicalParentId(targetId);
	}
	resolveOpaqueAppendParentId(parentId) {
		if (parentId === null || this.byId.has(parentId) || this.opaqueParentsById.has(parentId)) return parentId;
		return this.resolveCanonicalParentId(parentId);
	}
	resolveOpaqueLeafControl(leafEntry) {
		if (!leafEntry) return;
		const isKnownReference = (id) => id === null || this.byId.has(id) || this.opaqueParentsById.has(id) && !this.invalidLeafControlIds.has(id);
		if (!isKnownReference(leafEntry.targetId) || leafEntry.appendParentId !== void 0 && !isKnownReference(leafEntry.appendParentId)) return;
		const leafId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
		return {
			leafId,
			appendParentId: leafEntry.appendParentId === void 0 ? leafId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId),
			...leafEntry.appendMode ? { appendMode: leafEntry.appendMode } : {}
		};
	}
	appendOpaqueNavigationRecord(opaqueRecord) {
		const leafEntry = parseOpaqueLeafEntry(opaqueRecord);
		if (leafEntry) {
			const leafState = this.resolveOpaqueLeafControl(leafEntry);
			if (!leafState) {
				this.invalidLeafControlIds.add(leafEntry.id);
				this.opaqueParentsById.set(leafEntry.id, this.resolveOpaqueAppendParentId(leafEntry.parentId));
				return;
			}
			const effectiveLeafState = this.latestResetId !== void 0 && (leafState.leafId === null || !this.resetDescendantIds.has(leafState.leafId)) ? {
				leafId: this.leafId,
				appendParentId: this.leafId
			} : leafState;
			this.opaqueParentsById.set(leafEntry.id, effectiveLeafState.leafId);
			if (this.latestResetId !== void 0 && effectiveLeafState.leafId !== null && this.resetDescendantIds.has(effectiveLeafState.leafId)) this.resetDescendantIds.add(leafEntry.id);
			this.leafId = effectiveLeafState.leafId;
			this.appendParentId = effectiveLeafState.appendParentId;
			this.appendMode = effectiveLeafState.appendMode;
			return;
		}
		const link = parseParentLinkedOpaqueEntry(opaqueRecord);
		if (link) {
			this.opaqueParentsById.set(link.id, link.parentId);
			if (this.latestResetId !== void 0 && link.parentId !== null && this.resetDescendantIds.has(link.parentId)) this.resetDescendantIds.add(link.id);
			this.appendParentId = link.id;
		}
	}
	appendCanonicalNavigationEntry(entry, hasParentId = Object.hasOwn(entry, "parentId")) {
		if (entry.type === "label" && !this.byId.has(entry.targetId)) {
			this.opaqueParentsById.set(entry.id, this.resolveCanonicalParentId(entry.parentId));
			return;
		}
		if (this.latestResetId !== void 0 && !isSessionTranscriptSideAppendEntry(entry) && (entry.parentId === null || !this.resetDescendantIds.has(entry.parentId)) || !hasParentId || !isSessionTranscriptSideAppendEntry(entry) && entry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(entry.id, this.leafId);
		this.byId.set(entry.id, entry);
		if (entry.type === "reset") {
			this.latestResetId = entry.id;
			this.resetDescendantIds.clear();
			this.resetDescendantIds.add(entry.id);
		} else {
			const logicalParentId = this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : entry.parentId;
			if (this.latestResetId !== void 0 && logicalParentId !== null && this.resetDescendantIds.has(logicalParentId)) this.resetDescendantIds.add(entry.id);
		}
		this.appendParentId = entry.id;
		if (isSessionTranscriptSideAppendEntry(entry)) this.appendMode = "side";
		else {
			this.leafId = entry.id;
			this.appendMode = void 0;
		}
		if (entry.type === "label") {
			if (entry.label) {
				this.labelsById.set(entry.targetId, entry.label);
				this.labelTimestampsById.set(entry.targetId, entry.timestamp);
			} else {
				this.labelsById.delete(entry.targetId);
				this.labelTimestampsById.delete(entry.targetId);
			}
		}
	}
	resolveCanonicalParentId(parentId) {
		return resolveSessionCanonicalParentId(parentId, this.byId, this.opaqueParentsById);
	}
	resolveEntryParentId(entry) {
		return this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : this.resolveCanonicalParentId(entry.parentId);
	}
	normalizeEntryParent(entry) {
		const parentId = this.resolveEntryParentId(entry);
		let normalized = parentId === entry.parentId ? entry : {
			...entry,
			parentId
		};
		if (normalized.parentId === normalized.id) normalized = {
			...normalized,
			parentId: null
		};
		return normalized;
	}
	getBranch(fromId) {
		const path = [];
		const seen = /* @__PURE__ */ new Set();
		let currentId = fromId ?? this.leafId;
		while (currentId && !seen.has(currentId)) {
			seen.add(currentId);
			const current = this.byId.get(currentId);
			if (current) {
				const normalizedCurrent = this.normalizeEntryParent(current);
				path.push(normalizedCurrent);
				currentId = normalizedCurrent.parentId;
			} else currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		path.reverse();
		return path;
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-fork.ts
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
function formatParentForkTooLargeMessage(params) {
	return `Parent context is too large to fork (${params.parentTokens}/${params.maxTokens} tokens); starting with isolated context instead.`;
}
function planParentForkDecision(parentEntry, transcriptEstimate, options = {}) {
	const maxTokens = normalizePositiveTokenCount(options.maxTokens) ?? DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = options.preferTranscriptEstimate ? transcriptEstimate?.tokens : normalizePositiveTokenCount(Math.max(resolveFreshSessionTotalTokens(parentEntry) ?? 0, transcriptEstimate?.tokens ?? 0));
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: formatParentForkTooLargeMessage({
			parentTokens,
			maxTokens
		})
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
function estimateParentForkPromptTokens(source) {
	if (!source) return;
	let byteEstimate = 0;
	let latestUsageEstimate;
	let latestUsageEstimateIsExactContext = false;
	let trailingBytes = 0;
	for (const { event, context } of selectParentForkTokenEstimateEvents(source.branchEntries)) {
		if (context !== "reset-retained" && isRecord(event) && isRecord(event.message) && event.message.excludeFromContext === true) continue;
		let contextEvent = event;
		if (isRecord(event) && isRecord(event.message)) {
			const message = context !== "current" && isIndexedSessionEntry(event) && event.type === "message" && event.message.role === "assistant" ? stripCompactionReplayCheckpoint(event.message) : event.message;
			contextEvent = {
				...event,
				message: projectModelContextMessages([message])[0]
			};
		}
		const serializedBytes = Buffer.byteLength(JSON.stringify(contextEvent)) + 1;
		byteEstimate += serializedBytes;
		if (context !== "current" || !isRecord(event)) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const message = isRecord(event.message) ? event.message : void 0;
		const usageRaw = isRecord(message?.usage) ? message.usage : isRecord(event.usage) ? event.usage : void 0;
		if (!usageRaw) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const contextUsage = readTranscriptContextUsage(usageRaw);
		if (message?.api === "cli" && contextUsage === void 0) {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "unavailable") {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "available") {
			latestUsageEstimate = normalizePositiveTokenCount(contextUsage.totalTokens);
			latestUsageEstimateIsExactContext = true;
			trailingBytes = 0;
			continue;
		}
		const usage = normalizeUsage(usageRaw);
		const promptTokens = normalizePositiveTokenCount(derivePromptTokens({
			input: usage?.input,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = normalizePositiveTokenCount(usage?.output) ?? 0;
		const totalTokens = promptTokens === void 0 ? void 0 : normalizePositiveTokenCount(promptTokens + outputTokens);
		if (typeof totalTokens === "number") {
			latestUsageEstimate = totalTokens;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
		}
	}
	if (latestUsageEstimate !== void 0) {
		const tokens = normalizePositiveTokenCount(latestUsageEstimate + Math.ceil(trailingBytes / 4));
		return tokens === void 0 ? void 0 : {
			kind: latestUsageEstimateIsExactContext ? "exact-context" : "legacy-or-bytes",
			tokens
		};
	}
	const tokens = normalizePositiveTokenCount(Math.ceil(byteEstimate / 4));
	return tokens === void 0 ? void 0 : {
		kind: "legacy-or-bytes",
		tokens
	};
}
function* selectParentForkTokenEstimateEvents(branch) {
	if (!branch.some((event) => isRecord(event) && (event.type === "compaction" || event.type === "reset"))) {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const indexedEntries = branch.filter(isIndexedSessionEntry);
	const selected = Array.from(iterateSessionContextEntries(indexedEntries));
	const boundary = selected[0]?.entry;
	if (boundary?.type !== "compaction" && boundary?.type !== "reset") {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const contexts = new Map(selected.map(({ entry, context }) => [entry.id, context]));
	const indexedIds = new Set(indexedEntries.map((entry) => entry.id));
	const boundaryIndex = branch.findIndex((entry) => isRecord(entry) && entry.id === boundary.id);
	for (const [index, event] of branch.entries()) {
		const context = isRecord(event) && typeof event.id === "string" ? contexts.get(event.id) : void 0;
		if (context) yield {
			event,
			context
		};
		else if (index > boundaryIndex && (!isRecord(event) || typeof event.id !== "string" || !indexedIds.has(event.id))) yield {
			event,
			context: "opaque"
		};
	}
}
function normalizePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readTranscriptContextUsage(usageRaw) {
	const contextUsage = usageRaw.contextUsage;
	if (!isRecord(contextUsage)) return;
	if (contextUsage.state === "unavailable") return { state: "unavailable" };
	if (contextUsage.state !== "available") return;
	const totalTokens = normalizePositiveTokenCount(contextUsage.totalTokens);
	return totalTokens === void 0 ? void 0 : {
		state: "available",
		totalTokens
	};
}
function resolveParentForkSourceTranscript(fileEntries, forkFrom) {
	if (fileEntries.length === 0) return null;
	const header = findSessionTranscriptHeader(fileEntries);
	const entries = fileEntries.filter((entry) => !(isRecord(entry) && entry.type === "session"));
	const tree = scanSessionTranscriptTree(entries);
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const appendPath = selectSessionTranscriptTreePathNodes(tree, tree.appendParentId);
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath,
		appendPath,
		appendParentId: tree.appendParentId
	});
	const visibleBranchEntries = normalizeSessionContextEntryBoundaries(mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	}), tree.nodes);
	const branchEntries = forkFrom === "last-completed" ? visibleBranchEntries.slice(0, findLastCompletedAssistantIndex(visibleBranchEntries) + 1) : visibleBranchEntries;
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastBranchEntry = branchEntries.at(-1);
	const lastBranchEntryId = isRecord(lastBranchEntry) && typeof lastBranchEntry.id === "string" ? lastBranchEntry.id : null;
	return {
		appendParentId: forkFrom === "last-completed" ? lastBranchEntryId : mergedPath.appendParentId,
		...forkFrom !== "last-completed" && lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		branchEntries,
		cwd: typeof header?.cwd === "string" ? header.cwd : void 0,
		version: header?.version ?? 3,
		labelsToWrite: collectBranchLabels({
			allEntries: entries,
			pathEntryIds
		}),
		leafId: forkFrom === "last-completed" ? lastBranchEntryId : tree.leafId,
		preserveLeafControl: forkFrom !== "last-completed" && isSessionTranscriptLeafControl(lastLeafUpdateNode?.entry)
	};
}
function findLastCompletedAssistantIndex(entries) {
	return entries.findLastIndex((entry) => {
		const message = isRecord(entry) && isRecord(entry.message) ? entry.message : void 0;
		return message?.role === "assistant" && message.stopReason !== "toolUse";
	});
}
function collectBranchLabels(params) {
	return params.allEntries.flatMap((entry) => isRecord(entry) && entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !params.pathEntryIds.has(entry.id) && params.pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string" ? [{
		targetId: entry.targetId,
		label: entry.label,
		timestamp: entry.timestamp
	}] : []);
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
function buildLabelEntries(params) {
	let parentId = params.lastEntryId;
	return params.labelsToWrite.map(({ targetId, label, timestamp }) => {
		const entry = {
			type: "label",
			id: generateEntryId(params.pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		parentId = entry.id;
		return entry;
	});
}
function hasAssistantEntry(entries) {
	return entries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
}
function buildForkedChildTranscriptEvents(params) {
	const keepHistory = params.source.preserveLeafControl || hasAssistantEntry(params.source.branchEntries);
	const header = {
		...createSessionTranscriptHeader({
			cwd: params.source.cwd,
			sessionId: params.targetSessionId,
			version: keepHistory ? params.source.version : void 0
		}),
		parentSession: params.parentSessionFile
	};
	if (!keepHistory) return [header];
	const pathEntryIds = new Set(params.source.branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = params.source.branchEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = buildLabelEntries({
		labelsToWrite: params.source.labelsToWrite,
		pathEntryIds,
		lastEntryId: lastPathEntryId
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		header,
		...params.source.branchEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-session.ts
async function forkSessionTranscriptFromParent(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const target = params.targetStorePath ? resolveSqliteScope({
		sessionKey: params.sessionKey,
		storePath: params.targetStorePath
	}) : resolved;
	const crossDatabase = target.agentId !== resolved.agentId || (target.path ?? "") !== (resolved.path ?? "");
	if (params.parentEntry.sessionId) {
		params.commitGuard?.();
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-BtPaMmVG.js");
		await restoreSessionColdTranscript({
			agentId: resolved.agentId,
			env: resolved.env,
			storePath: params.storePath,
			sessionId: params.parentEntry.sessionId
		});
	}
	if (!crossDatabase) return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = { status: "failed" };
		runAssistantAgentWriteTransaction((database) => {
			params.commitGuard?.();
			result = forkSqliteParentTranscriptInTransaction(database, resolved, {
				enforceTokenLimit: params.enforceTokenLimit,
				maxTokens: params.maxTokens,
				parentEntry: params.parentEntry,
				parentSessionKey: params.parentSessionKey,
				forkFrom: params.forkFrom,
				targetSessionId: params.targetSessionId,
				targetSessionKey: params.sessionKey
			});
		}, toDatabaseOptions(resolved));
		return result;
	}, "session.parent.fork-transcript");
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const sourceDatabase = openAssistantAgentDatabase(toDatabaseOptions(resolved));
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(sourceDatabase, params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	return await runExclusiveSqliteSessionWrite(target, async () => {
		const sessionId = params.targetSessionId ?? randomUUID();
		const targetScope = {
			...target,
			sessionId,
			sessionKey: normalizeSqliteSessionKey(params.sessionKey)
		};
		const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
		runAssistantAgentWriteTransaction((database) => {
			params.commitGuard?.();
			writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
				parentSessionFile,
				source
			});
		}, toDatabaseOptions(target));
		return {
			status: "created",
			transcript: {
				sessionFile,
				sessionId
			}
		};
	}, "session.parent.fork-transcript");
}
/** Forks parent context into a child session entry using SQLite rows only. */
async function forkSessionEntryFromParentTarget(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openAssistantAgentDatabase(toDatabaseOptions(resolved));
		const parent = resolveLifecyclePrimaryEntry(database, parentTarget);
		if (!parent?.entry.sessionId) return { status: "missing-parent" };
		const base = resolveLifecyclePrimaryEntry(database, sessionTarget)?.entry ?? params.fallbackEntry;
		if (!base) return { status: "missing-entry" };
		if (params.skipForkWhen?.(cloneSessionEntry(base))) {
			const sessionEntry = persistSqliteParentForkSkipPatch({
				commitGuard: params.commitGuard,
				entry: base,
				sessionKey: sessionTarget.canonicalKey,
				patch: params.skipPatch?.(cloneSessionEntry(base)),
				resolved
			});
			return {
				status: "skipped",
				reason: "existing-entry",
				parentEntry: cloneSessionEntry(parent.entry),
				sessionEntry
			};
		}
		assertModelSelectionUnlocked(parent.entry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
		return {
			status: "prepared",
			parentEntry: cloneSessionEntry(parent.entry),
			base: cloneSessionEntry(base)
		};
	}, "session.parent.fork-entry");
	if (prepared.status !== "prepared") return prepared;
	params.commitGuard?.();
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-BtPaMmVG.js");
	await restoreSessionColdTranscript({
		agentId: resolved.agentId,
		env: resolved.env,
		storePath: params.storePath,
		sessionId: prepared.parentEntry.sessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		params.commitGuard?.();
		const committed = runAssistantAgentWriteTransaction((writeDatabase) => {
			params.commitGuard?.();
			const freshParent = resolveLifecyclePrimaryEntry(writeDatabase, parentTarget)?.entry;
			const freshBase = resolveLifecyclePrimaryEntry(writeDatabase, sessionTarget)?.entry ?? params.fallbackEntry;
			if (!freshParent || !freshBase || !sqliteSessionEntriesEqual(freshParent, prepared.parentEntry) || !sqliteSessionEntriesEqual(freshBase, prepared.base)) return { result: { status: "failed" } };
			assertModelSelectionUnlocked(freshParent, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
			const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(writeDatabase, freshParent.sessionId));
			const decision = planParentForkDecision(freshParent, estimateParentForkPromptTokens(source));
			if (decision.status === "skip") return { skip: {
				decision,
				base: freshBase,
				parentEntry: freshParent
			} };
			const fork = forkSqliteParentTranscriptInTransaction(writeDatabase, resolved, {
				parentEntry: freshParent,
				parentSessionKey: parentTarget.canonicalKey,
				source,
				targetSessionKey: sessionTarget.canonicalKey
			});
			if (fork.status !== "created") return { result: fork.status === "missing-parent" ? { status: "missing-parent" } : { status: "failed" } };
			const forkIdentityPatch = {
				...params.patch?.({
					decision,
					entry: cloneSessionEntry(freshBase),
					fork: fork.transcript,
					parentEntry: cloneSessionEntry(freshParent)
				}),
				forkSource: {
					sessionKey: parentTarget.canonicalKey,
					sessionId: freshParent.sessionId
				},
				forkedFromParent: true,
				lifecycleRunId: void 0,
				lastRunId: void 0,
				sessionId: fork.transcript.sessionId,
				totalTokens: void 0,
				totalTokensFresh: false,
				totalTokensVersion: void 0
			};
			const previousIdentity = readSessionIdentitySnapshot(writeDatabase, [sessionTarget.canonicalKey]);
			const next = writeSessionEntry(writeDatabase, sessionTarget.canonicalKey, mergeSessionEntry(freshBase, forkIdentityPatch), {
				previousEntry: freshBase,
				canonicalPreviousEntry: previousIdentity.get(sessionTarget.canonicalKey) ?? null
			});
			const currentIdentity = readSessionIdentitySnapshot(writeDatabase, [sessionTarget.canonicalKey]);
			return {
				result: {
					status: "forked",
					decision,
					fork: fork.transcript,
					parentEntry: cloneSessionEntry(freshParent),
					sessionEntry: cloneSessionEntry(next)
				},
				publish: prepareSessionIdentityPublication(writeDatabase, resolved.agentId, previousIdentity, currentIdentity)
			};
		}, toDatabaseOptions(resolved));
		if ("skip" in committed) {
			const { decision, base, parentEntry } = committed.skip;
			const patch = params.decisionSkipPatch?.({
				decision,
				entry: cloneSessionEntry(base),
				parentEntry: cloneSessionEntry(parentEntry)
			});
			const sessionEntry = persistSqliteParentForkSkipPatch({
				commitGuard: params.commitGuard,
				entry: base,
				sessionKey: sessionTarget.canonicalKey,
				patch,
				resolved
			});
			return {
				status: "skipped",
				reason: "decision-skip",
				parentEntry: cloneSessionEntry(parentEntry),
				sessionEntry,
				decision
			};
		}
		committed.publish?.();
		return committed.result;
	}, "session.parent.fork-entry");
}
function persistSqliteParentForkSkipPatch(params) {
	if (!params.patch) return cloneSessionEntry(params.entry);
	const merged = mergeSessionEntry(params.entry, params.patch);
	const next = preserveSqliteSameKeySessionRolloverLineage({
		next: merged,
		previous: params.entry,
		sessionKey: params.sessionKey
	});
	runAssistantAgentWriteTransaction((database) => {
		params.commitGuard?.();
		const previousIdentity = readSessionIdentitySnapshot(database, [params.sessionKey]);
		writeSessionEntry(database, params.sessionKey, next, {
			previousEntry: params.entry,
			canonicalPreviousEntry: previousIdentity.get(params.sessionKey) ?? null
		});
		const currentIdentity = readSessionIdentitySnapshot(database, [params.sessionKey]);
		return prepareSessionIdentityPublication(database, params.resolved.agentId, previousIdentity, currentIdentity);
	}, toDatabaseOptions(params.resolved))();
	return cloneSessionEntry(next);
}
async function resolveSessionParentForkDecision(params) {
	const parentSessionId = typeof params.parentEntry.sessionId === "string" ? params.parentEntry.sessionId : "";
	if (parentSessionId.length === 0) return planParentForkDecision(params.parentEntry);
	const resolved = resolveSqliteStoreScope(params.storePath);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Bh8F7AV4.js");
	return readRestoredSessionTranscript({
		agentId: resolved.agentId,
		storePath: params.storePath,
		sessionId: parentSessionId
	}, () => {
		const database = openAssistantAgentDatabase(toDatabaseOptions(resolved));
		return planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, parentSessionId))));
	});
}
function forkSqliteParentTranscriptInTransaction(database, resolved, params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = params.source === void 0 ? resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, params.parentEntry.sessionId), params.forkFrom) : params.source;
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: normalizeSqliteSessionKey(params.targetSessionKey)
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
	writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
		parentSessionFile,
		source
	});
	return {
		status: "created",
		transcript: {
			sessionFile,
			sessionId
		}
	};
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(source), {
		maxTokens: params.maxTokens,
		preferTranscriptEstimate: params.forkFrom === "last-completed"
	});
	return decision.status === "skip" ? decision : void 0;
}
function writeSqliteForkedChildTranscriptInTransaction(database, targetScope, params) {
	appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
		parentSessionFile: params.parentSessionFile,
		source: params.source,
		targetSessionId: targetScope.sessionId
	}));
}
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.ts
async function forkSessionFromParentTranscript(params) {
	return await forkSessionTranscriptFromParent(params);
}
/**
* Creates or updates one session entry and initializes its transcript header as
* one SQLite-backed lifecycle operation. Callers do not compose row creation,
* transcript initialization, rollback, and normalized session identity.
*/
async function createSessionEntryWithTranscript(scope, createEntry, options = {}) {
	const storePath = resolveAccessStorePath(scope);
	const storeScope = {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env,
		storePath
	};
	const { normalizedKey, legacyKeys, ...context } = readSessionCreationSnapshot({
		...storeScope,
		sessionKey: scope.sessionKey
	});
	const created = await createEntry(context);
	if (!created.ok) return {
		ok: false,
		error: created.error,
		phase: "entry"
	};
	const ownerAssignment = options.resolveOwnerAssignment?.();
	const { cwd, commitGuard, withCommit, onLifecycleCommitted } = options;
	const initializeTranscript = async (assertSourceCurrent) => {
		try {
			const transcriptScope = resolveSqliteTranscriptScope({
				...storeScope,
				sessionId: created.entry.sessionId,
				sessionKey: normalizedKey
			});
			await runExclusiveSqliteSessionWrite(transcriptScope, async () => {
				runAssistantAgentWriteTransaction((database) => {
					commitGuard?.();
					assertSourceCurrent?.();
					ensureTranscriptHeader(database, transcriptScope, cwd);
				}, toDatabaseOptions(transcriptScope));
			}, "session.entry.create-with-transcript");
			return;
		} catch (err) {
			commitGuard?.();
			assertSourceCurrent?.();
			return formatErrorMessage(err);
		}
	};
	const transcriptError = withCommit ? await withCommit(initializeTranscript) : await initializeTranscript();
	if (transcriptError !== void 0) return {
		ok: false,
		error: transcriptError,
		phase: "transcript"
	};
	const entry = created.entry;
	await applySessionEntryLifecycleMutation({
		...storeScope,
		removals: legacyKeys.map((sessionKey) => ({ sessionKey })),
		upserts: [{
			sessionKey: normalizedKey,
			entry
		}],
		skipMaintenance: true,
		...commitGuard ? { beforeCommitInTransaction: commitGuard } : {},
		...withCommit ? { withCommit } : {},
		...ownerAssignment ? { afterFreshUpsertsInTransaction: (database) => {
			if (!replaceSessionOwnerInTransaction(database, normalizedKey, ownerAssignment)) throw new Error(`Session owner assignment lost its target: ${normalizedKey}`);
		} } : {},
		...onLifecycleCommitted ? { onLifecycleCommitted: () => onLifecycleCommitted(entry) } : {}
	});
	return {
		ok: true,
		entry,
		sessionFile: normalizedKey
	};
}
function cloneSessionEntries(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, { ...entry }]));
}
function collectSessionEntryKeys(...entries) {
	return [...new Set(entries.flatMap((entry) => Object.keys(entry)))];
}
function sessionEntryFieldEqual(left, right) {
	return Object.is(left, right) || isDeepStrictEqual(left, right);
}
function sessionEntryFieldUnset(hasValue, value) {
	return !hasValue || value === void 0;
}
function sessionEntryFieldUnchanged(params) {
	const { leftHasValue, leftValue, rightHasValue, rightValue } = params;
	if (sessionEntryFieldUnset(leftHasValue, leftValue) && sessionEntryFieldUnset(rightHasValue, rightValue)) return true;
	return leftHasValue === rightHasValue && sessionEntryFieldEqual(leftValue, rightValue);
}
function mergeConcurrentReplySessionMetadata(params) {
	const { currentEntry, preparedEntry, snapshotEntry } = params;
	if (!snapshotEntry || preparedEntry.sessionId !== snapshotEntry.sessionId) return preparedEntry;
	const merged = { ...preparedEntry };
	const mergedFields = merged;
	for (const key of collectSessionEntryKeys(currentEntry, preparedEntry, snapshotEntry)) {
		const currentHasValue = Object.hasOwn(currentEntry, key);
		const snapshotHasValue = Object.hasOwn(snapshotEntry, key);
		const preparedHasValue = Object.hasOwn(preparedEntry, key);
		const currentValue = currentEntry[key];
		const snapshotValue = snapshotEntry[key];
		const preparedValue = preparedEntry[key];
		const currentChanged = !sessionEntryFieldUnchanged({
			leftHasValue: currentHasValue,
			leftValue: currentValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		const preparedKeptSnapshot = sessionEntryFieldUnchanged({
			leftHasValue: preparedHasValue,
			leftValue: preparedValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		if (currentChanged && preparedKeptSnapshot) {
			if (currentHasValue) mergedFields[key] = currentValue;
			else delete mergedFields[key];
		}
	}
	return merged;
}
function createReplySessionInitializationRevision(entry) {
	if (!entry) return JSON.stringify(null);
	return JSON.stringify({ sessionId: entry.sessionId });
}
/** Updates an existing entry only; returns null when the session is absent. */
async function updateSessionEntry(scope, update, options = {}) {
	return await patchSessionEntryCore(scope, update, options);
}
/** Resolves one abort target identity without exposing the mutable store. */
function resolveSessionAbortTarget(scope) {
	const entry = loadSessionEntry(scope);
	if (!entry) return null;
	return {
		entry: { ...entry },
		sessionId: entry.sessionId,
		sessionKey: normalizeStoreSessionKey(scope.sessionKey)
	};
}
/**
* Resolves, marks, touches, and canonicalizes one abort target entry as a
* storage-sized operation. Runtime abort side effects remain with callers.
*/
async function markSessionAbortTarget(params) {
	const resolution = { target: null };
	try {
		const sessionKey = normalizeStoreSessionKey(params.scope.sessionKey);
		const updated = await patchSessionEntryCore(params.scope, (currentEntry) => {
			if (params.isCurrent?.() === false) return null;
			resolution.target = {
				entry: { ...currentEntry },
				persisted: false,
				sessionId: currentEntry.sessionId,
				sessionKey
			};
			const entry = {
				...currentEntry,
				abortedLastRun: true,
				updatedAt: params.now?.() ?? Date.now()
			};
			applySessionAbortCutoff(entry, params.resolveAbortCutoff?.({
				entry: { ...currentEntry },
				sessionKey
			}));
			return entry;
		}, {
			replaceEntry: true,
			skipMaintenance: true,
			assertCommitAllowed: () => {
				if (resolution.target && params.isCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
			}
		});
		return updated && resolution.target ? {
			entry: { ...updated },
			persisted: true,
			sessionId: updated.sessionId,
			sessionKey
		} : null;
	} catch (error) {
		const fallbackTarget = resolution.target;
		if (fallbackTarget) return {
			entry: fallbackTarget.entry,
			persisted: fallbackTarget.persisted,
			sessionId: fallbackTarget.sessionId,
			sessionKey: fallbackTarget.sessionKey,
			persistenceError: formatErrorMessage(error)
		};
		throw error;
	}
}
function applySessionAbortCutoff(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
//#endregion
//#region src/config/sessions/session-accessor.reset.ts
var SessionInitializationAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session initialization agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_INITIALIZATION_AGENT_SCOPE_MISMATCH";
		this.name = "SessionInitializationAgentScopeMismatchError";
	}
};
function assertSessionInitializationAgentScope(agentId, sessionKey) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (sessionKeyAgentId && normalizeAgentId(sessionKeyAgentId) !== normalizedAgentId) throw new SessionInitializationAgentScopeMismatchError(normalizedAgentId, sessionKeyAgentId);
}
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime-C2b98Jp6.js"));
/**
* Persists runner reset metadata with its transcript boundary.
*/
async function persistSessionResetLifecycle(params) {
	await applySessionEntryLifecycleMutation({
		agentId: params.agentId,
		activeSessionKey: params.sessionKey,
		storePath: params.storePath,
		upserts: [{
			sessionKey: params.sessionKey,
			entry: params.nextEntry,
			resetBoundary: {
				context: "preserve-tail",
				reason: "reset",
				cwd: params.workspaceDir
			}
		}],
		skipMaintenance: true
	});
	return { replayedMessages: 0 };
}
function loadReplySessionInitializationEntries(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const result = withAssistantAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const entries = {};
		const currentKey = normalizeStoreSessionKey(params.sessionKey);
		const keys = /* @__PURE__ */ new Set([currentKey, ...params.relatedSessionKeys ?? []]);
		for (const key of keys) {
			const sessionKey = normalizeStoreSessionKey(key);
			if (!sessionKey || entries[sessionKey]) continue;
			const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
			if (entry) {
				entries[sessionKey] = entry;
				if (sessionKey === currentKey && entry.parentSessionKey) keys.add(entry.parentSessionKey);
			}
		}
		return entries;
	}), toDatabaseOptions(resolveSqliteScope(params)));
	return result.found ? result.value : {};
}
/** Loads the declared reply-session rows without exposing a mutable store. */
function loadReplySessionInitializationSnapshot(params) {
	const storePath = resolveSessionStorePathForScope(params);
	const store = loadReplySessionInitializationEntries({
		...params,
		storePath
	});
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntryCore({
				store,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
function createStaleReplySessionInitializationResult(currentEntry) {
	return {
		ok: false,
		...currentEntry ? { currentEntry } : {},
		reason: "stale-snapshot",
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
/**
* Persists one reply-session initialization result and archives the previous
* transcript after metadata commits, keeping archive failure warning-only.
*/
async function commitReplySessionInitialization(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const store = loadReplySessionInitializationEntries({
		...params,
		storePath
	});
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	if (createReplySessionInitializationRevision(currentEntry) !== params.expectedRevision) return createStaleReplySessionInitializationResult(currentEntry);
	const readEntry = (sessionKey) => {
		const entry = resolveSessionStoreEntryCore({
			store,
			sessionKey
		}).existing;
		return entry ? { ...entry } : void 0;
	};
	const sessionEntry = params.prepareSessionEntry ? await params.prepareSessionEntry({
		...currentEntry ? { currentEntry } : {},
		readEntry,
		sessionEntry: params.sessionEntry
	}) : params.sessionEntry;
	let staleCommit;
	let committedSessionEntry = sessionEntry;
	let beforeEntryMutationDone = false;
	const upserts = [{
		sessionKey: resolved.normalizedKey,
		...params.routeContext !== void 0 ? { routeContext: params.routeContext } : {},
		...params.resetBoundary ? { resetBoundary: params.resetBoundary } : {},
		buildEntry: async ({ currentEntry: commitEntry }) => {
			if (createReplySessionInitializationRevision(commitEntry) !== params.expectedRevision) {
				staleCommit = commitEntry ? { ...commitEntry } : null;
				return null;
			}
			committedSessionEntry = commitEntry ? mergeConcurrentReplySessionMetadata({
				currentEntry: commitEntry,
				preparedEntry: sessionEntry,
				snapshotEntry: params.snapshotEntry ?? params.previousEntry
			}) : sessionEntry;
			if (!beforeEntryMutationDone) {
				await params.beforeEntryMutation?.({
					...commitEntry ? { currentEntry: { ...commitEntry } } : {},
					sessionEntry: committedSessionEntry
				});
				beforeEntryMutationDone = true;
			}
			return committedSessionEntry;
		}
	}];
	if (params.retiredEntry) {
		const retiredEntry = params.retiredEntry;
		upserts.push({
			sessionKey: retiredEntry.key,
			buildEntry: () => staleCommit === void 0 ? retiredEntry.entry : null
		});
	}
	try {
		await applySessionEntryLifecycleMutation({
			activeSessionKey: params.activeSessionKey,
			agentId: params.agentId,
			maintenanceOverride: params.maintenanceConfig,
			storePath,
			upserts,
			beforeCommitInTransaction: params.commitGuard
		});
	} catch (error) {
		if (!(error instanceof SessionEntryLifecycleUpsertConflictError) || error.sessionKey !== resolved.normalizedKey) throw error;
		return createStaleReplySessionInitializationResult(loadSessionEntry({
			agentId: params.agentId,
			readConsistency: "latest",
			sessionKey: error.sessionKey,
			storePath
		}));
	}
	if (staleCommit !== void 0) return createStaleReplySessionInitializationResult(staleCommit ?? void 0);
	store[resolved.normalizedKey] = committedSessionEntry;
	if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
	const committed = {
		ok: true,
		previousSessionTranscript: {},
		sessionEntry: { ...committedSessionEntry },
		sessionStoreView: cloneSessionEntries(store)
	};
	const previousSessionTranscript = isIncognitoSessionKey(params.sessionKey) || params.previousEntry?.incognito === true ? {} : params.archivePreviousTranscript === false ? {} : await archivePreviousSessionTranscript({
		agentId: params.agentId,
		onArchiveError: params.onArchiveError,
		previousEntry: params.previousEntry,
		storePath: params.storePath
	});
	return {
		...committed,
		previousSessionTranscript
	};
}
async function archivePreviousSessionTranscript(params) {
	if (!params.previousEntry?.sessionId) return {};
	const { archiveSessionTranscriptsDetailed, resolveStableSessionEndTranscript } = await loadSessionArchiveRuntime();
	const archivedTranscripts = archiveSessionTranscriptsDetailed({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		reason: "reset",
		onArchiveError: params.onArchiveError
	});
	return resolveStableSessionEndTranscript({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		archivedTranscripts
	});
}
//#endregion
export { applySessionEntryReplacements as C, applySessionEntryCanonicalReplacements as E, applySessionEntryLifecycleMutation as S, purgeDeletedAgentSessionEntries as T, applySessionPatchProjections as _, createSessionEntryWithTranscript as a, inheritSessionSelection as b, resolveSessionAbortTarget as c, resolveSessionParentForkDecision as d, SessionEntryNavigation as f, applySessionPatchProjection as g, walkSessionCurrentTurn as h, persistSessionResetLifecycle as i, updateSessionEntry as l, resolveOpaqueSessionFirstKeptEntryId as m, commitReplySessionInitialization as n, forkSessionFromParentTranscript as o, normalizeSessionContextEntryBoundaries as p, loadReplySessionInitializationSnapshot as r, markSessionAbortTarget as s, SessionInitializationAgentScopeMismatchError as t, forkSessionEntryFromParentTarget as u, cleanupPluginHostSessionStore as v, applySessionStoreProjection as w, selectSessionModelOverride as x, SessionLabelOwnerIndex as y };
