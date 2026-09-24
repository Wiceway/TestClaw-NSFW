import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { a as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-CHO49mcb.js";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { r as getChildLogger } from "./logger-DmjW9g94.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { d as runWithSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { a as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { B as publishSqliteWalCheckpointObservation, V as coerceRequiredSqliteNumber, z as onSqliteWalCheckpoint } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DewCyJy9.js";
import { tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { a as resolveAssistantStateDirForDatabasePath, s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-D2a98CpI.js";
import { a as deferAssistantAgentPostCommitPublication, f as runAssistantAgentWriteTransaction, l as openAssistantAgentDatabase, s as getAssistantAgentDatabaseIfOpen } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly, t as retainAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { r as runQueuedStoreWrite } from "./testclaw-agent-write-admission-fcqqlXn0.js";
import { $ as recordSessionEntryMaintenanceAgeFact, D as deleteSessionDeliveryArtifacts, Dt as sqliteSessionEntriesEqual, Et as sqliteLifecycleTargetSnapshotsEqual, Y as invalidateSessionEntryMaintenanceAgeFact, Z as readSessionEntryMaintenanceAgeFact, et as stageSessionEntryMaintenanceAgeFact, f as writeSessionEntry, it as runSqliteSessionDeletionTransaction, k as readSessionNodeArtifactFingerprint, nt as hasPreparedNativeSessionDeletion, o as readLifecycleTargetSnapshot, ot as withSqliteSessionDeletions, r as deleteLifecycleTargetRows } from "./session-accessor.sqlite-entry-store-BzD1qpup.js";
import { _ as parseSessionEntryJson, x as sessionEntryMetadataJson } from "./session-canonical-key-Bxbtl4CI.js";
import { a as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { a as normalizeStoreSessionKey } from "./store-entry-BKQU6sPT.js";
import { a as getSessionKysely, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, n as cloneSessionEntry, u as resolveSqliteScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { g as runExclusiveSessionLifecycleMutation, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import { _ as shouldRunSessionEntryMaintenance, l as isSessionEntryDiskBudgetEvictable, u as normalizeResolvedMaintenanceConfigInput } from "./legacy-compaction-history-3Lv-j3a5.js";
import { i as isRecentHistoricalSessionId, n as collectRecentSessionHistoryIds, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-nPIoUuY6.js";
import { n as readSessionEntryCount, r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-BMYuBnL9.js";
import { a as assertPlannedLifecycleArtifactEntriesUnchanged, c as deletePlannedLifecycleArtifactEntries, d as planSessionStateDeleteIfUnreferenced, h as readSessionGenerationIdsForKeys, l as partitionUnchangedPlannedLifecycleArtifactEntries, n as readSqliteSessionGenerationClaim, o as collectProjectedReferencedSessionIds, p as readReferencedSessionIds, r as readSqliteSessionGenerationWindows, s as deleteMaterializedSessionStatePlans, v as publishSessionStateArchives, y as emitArchivedTranscriptUpdates } from "./session-accessor.sqlite-generation-copy-DcJmL4R4.js";
import { c as withSqliteMutationWorkerLifetime, d as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans, o as runSqliteTranscriptArchiveWorkerOperation, r as runExclusiveSqliteTranscriptArchiveWorker, u as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-archive-CRMka_kI.js";
import { t as emitSessionIdentityMutation } from "./session-lifecycle-events-BrsNxBVT.js";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { c as measureSessionPhysicalDiskUsage, h as planSessionEntryMaintenance, l as resolveMaintenanceConfig, m as resolveSessionMaintenancePreserveKeys, n as hasRetainedSessionTranscriptArchives, o as observeSessionArchivePruning, r as pruneSessionTranscriptArchivesToHighWater, s as timeArchivePruningAsync, u as captureSessionMaintenancePreservation } from "./disk-budget-BOamfkPB.js";
import { r as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-BgbzFdQ4.js";
import { n as supportsAssistantAgentDatabaseExecution, t as captureAssistantAgentDatabaseExecution } from "./testclaw-agent-execution-CA747lDP.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual, toUSVString } from "node:util";
import { sql } from "kysely";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
//#region src/config/sessions/session-accessor.sqlite-identity.ts
function toSessionIdentityTarget(entry, sessionKeys) {
	const sessionId = normalizeOptionalString(entry?.sessionId);
	return {
		...sessionId ? { sessionId } : {},
		sessionKeys
	};
}
function prepareCommittedSessionEntryRemovals(agentId, removals) {
	const previousByKey = /* @__PURE__ */ new Map();
	for (const removal of removals) if (!previousByKey.has(removal.sessionKey)) previousByKey.set(removal.sessionKey, toSessionIdentityTarget(removal.expectedEntry, [removal.sessionKey]));
	return () => {
		for (const previous of previousByKey.values()) emitSessionIdentityMutation({
			agentId,
			kind: "delete",
			previous
		});
	};
}
function publishCommittedSessionIdentity(agentId, previous, current) {
	const currentKeysBySessionId = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of current) {
		const sessionId = normalizeOptionalString(entry.sessionId);
		if (sessionId) currentKeysBySessionId.set(sessionId, [...currentKeysBySessionId.get(sessionId) ?? [], sessionKey]);
	}
	const movedKeysByCurrentKey = /* @__PURE__ */ new Map();
	const handledPreviousKeys = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of previous) {
		if (current.has(sessionKey)) continue;
		const sessionId = normalizeOptionalString(entry.sessionId);
		const currentKeys = sessionId ? currentKeysBySessionId.get(sessionId) : void 0;
		if (currentKeys?.length !== 1) continue;
		const [currentKey] = currentKeys;
		if (!currentKey) continue;
		movedKeysByCurrentKey.set(currentKey, [...movedKeysByCurrentKey.get(currentKey) ?? [], sessionKey]);
		handledPreviousKeys.add(sessionKey);
	}
	for (const [currentKey, previousKeys] of movedKeysByCurrentKey) {
		const currentEntry = current.get(currentKey);
		if (currentEntry) emitSessionIdentityMutation({
			agentId,
			kind: "move",
			previous: toSessionIdentityTarget(currentEntry, previousKeys),
			current: toSessionIdentityTarget(currentEntry, [currentKey])
		});
	}
	for (const [sessionKey, previousEntry] of previous) {
		const currentEntry = current.get(sessionKey);
		const previousTarget = toSessionIdentityTarget(previousEntry, [sessionKey]);
		if (currentEntry) {
			const currentTarget = toSessionIdentityTarget(currentEntry, [sessionKey]);
			const kind = previousTarget.sessionId !== currentTarget.sessionId ? "replace" : previousEntry.lifecycleRevision !== currentEntry.lifecycleRevision ? "reset" : void 0;
			if (kind) emitSessionIdentityMutation({
				agentId,
				kind,
				previous: previousTarget,
				current: currentTarget
			});
		} else if (!handledPreviousKeys.has(sessionKey)) emitSessionIdentityMutation({
			agentId,
			kind: "delete",
			previous: previousTarget
		});
	}
	for (const [sessionKey, currentEntry] of current) {
		if (previous.has(sessionKey) || movedKeysByCurrentKey.has(sessionKey)) continue;
		emitSessionIdentityMutation({
			agentId,
			kind: "create",
			previous: { sessionKeys: [] },
			current: toSessionIdentityTarget(currentEntry, [sessionKey])
		});
	}
}
function prepareSessionIdentityPublication(database, agentId, previous, current) {
	const publish = () => publishCommittedSessionIdentity(agentId, previous, current);
	return () => {
		if (!deferSqlitePostCommitPublication(database.db, publish)) publish();
	};
}
function prepareLifecycleIdentityPublication(params) {
	const removedKeys = new Set(params.removedSessionKeys);
	const previous = new Map(params.projected.removals.filter((removal) => removedKeys.has(removal.sessionKey)).map((removal) => [removal.sessionKey, removal.expectedEntry]));
	const current = /* @__PURE__ */ new Map();
	for (const upsert of params.projected.upsertedEntries) {
		if (!current.has(upsert.sessionKey) && upsert.expectedEntry) previous.set(upsert.sessionKey, upsert.expectedEntry);
		current.set(upsert.sessionKey, upsert.entry);
	}
	return prepareSessionIdentityPublication(params.database, params.agentId, previous, current);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-candidates.ts
function collectSqliteSessionMaintenanceBaseKeys(store, activeSessionKeys) {
	const keys = [];
	const seen = /* @__PURE__ */ new Set();
	for (const activeSessionKey of activeSessionKeys) {
		let currentKey = normalizeStoreSessionKey(activeSessionKey);
		while (currentKey && !seen.has(currentKey)) {
			seen.add(currentKey);
			keys.push(currentKey);
			currentKey = normalizeStoreSessionKey(store[currentKey]?.parentSessionKey ?? "");
		}
	}
	return keys;
}
function readSessionMaintenanceKeyProjection(database) {
	const db = getSessionKysely(database.db);
	const store = {};
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"parent_session_key",
		"session_key",
		"updated_at"
	]).where("archived_at", "is", null).orderBy("session_key", "asc"))) store[row.session_key] = {
		sessionId: row.current_session_id,
		updatedAt: row.updated_at,
		...row.parent_session_key ? { parentSessionKey: row.parent_session_key } : {}
	};
	return store;
}
function readSessionMaintenanceAgeCandidates(params) {
	if (params.minimumAgeMs == null || params.minimumAgeMs <= 0) return {};
	const db = getSessionKysely(params.database.db);
	const store = {};
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		sessionEntryMetadataJson,
		"current_session_id",
		"session_key",
		"updated_at"
	]).where("updated_at", "<", Date.now() - params.minimumAgeMs).where("archived_at", "is", null).orderBy("updated_at", "asc"))) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSessionMaintenanceCapCandidates(params) {
	const db = getSessionKysely(params.database.db);
	const excludedKeys = [...params.excludedKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	const store = {};
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		sessionEntryMetadataJson,
		"current_session_id",
		"session_key",
		"updated_at"
	]).where("archived_at", "is", null).$if(excludedKeys.length > 0, (query) => query.where("session_key", "not in", sqliteStringSet(excludedKeys))).orderBy("session_key", "asc"))) {
		if (params.excludedKeys.has(row.session_key)) continue;
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		store[row.session_key] = entry;
	}
	return store;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-store.ts
function readSessionTranscriptJsonlBytesInDatabase(database, sessionIds) {
	const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["session_id", sql`SUM(${transcriptEventReadBytesSql()} + 1)`.as("jsonl_bytes")]).where("session_id", "in", sessionIds).groupBy("session_id")).rows;
	return new Map(rows.map((row) => [row.session_id, coerceRequiredSqliteNumber(row.jsonl_bytes)]));
}
function refreshSessionPlannerStatisticsInDatabase(database) {
	const row = database.db.prepare("PRAGMA analysis_limit").get();
	const previousLimit = Number(row?.analysis_limit ?? 0);
	try {
		database.db.exec("PRAGMA analysis_limit = 1000; ANALYZE main;");
	} finally {
		database.db.exec(`PRAGMA analysis_limit = ${previousLimit};`);
	}
}
function emptySessionEntryMaintenancePlan() {
	return {
		archivedSessionKeys: [],
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
}
/** Only a current age fact can avoid planning; pressure and force still require a pass. */
function canSkipSessionEntryMaintenanceInDatabase(database, params, entryCount) {
	if (params.maintenance.mode === "warn") return true;
	if (params.forceMaintenance) return false;
	const ageFact = readSessionEntryMaintenanceAgeFact(database.db, params.maintenance);
	return ageFact !== void 0 && Date.now() < ageFact.next.at && !shouldRunSessionEntryMaintenance({
		entryCount: entryCount ?? readSessionEntryCount(database, { includeArchived: false }),
		maxEntries: params.maintenance.maxEntries,
		force: params.forceMaintenance
	});
}
/** Planning and archive metadata writes share the caller's admitted transaction. */
function applySessionEntryMaintenanceInDatabase(database, params, readPreservation) {
	const maintenance = params.maintenance;
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	const entryCount = readSessionEntryCount(database, { includeArchived: false });
	if (canSkipSessionEntryMaintenanceInDatabase(database, params, entryCount)) return emptySessionEntryMaintenancePlan();
	invalidateSessionEntryMaintenanceAgeFact(database.db);
	const plannedAt = Date.now();
	const activeSessionKeys = uniqueStrings([params.activeSessionKey ?? "", ...params.activeSessionKeys ?? []]);
	const removalReasons = /* @__PURE__ */ new Map();
	const archivedKeys = /* @__PURE__ */ new Set();
	const { store, archived, capArchived, modelRunPruned, pruned, capped } = planSessionEntryMaintenance({
		profile: "write",
		maintenance,
		initialUnarchivedCount: entryCount,
		forceMaintenance: params.forceMaintenance,
		readPreserveKeys: () => {
			const snapshot = readPreservation();
			const keyProjection = readSessionMaintenanceKeyProjection(database);
			return resolveSessionMaintenancePreserveKeys({
				snapshot,
				store: keyProjection,
				baseKeys: collectSqliteSessionMaintenanceBaseKeys(keyProjection, activeSessionKeys)
			});
		},
		log: false,
		readAgeCandidates: (minimumAgeMs) => readSessionMaintenanceAgeCandidates({
			database,
			minimumAgeMs
		}),
		readCapCandidates: (remainingEntryCount) => {
			const overflow = Math.max(0, remainingEntryCount - maintenance.maxEntries);
			if (overflow > 0) {
				const capStore = readSessionMaintenanceCapCandidates({
					database,
					excludedKeys: /* @__PURE__ */ new Set([...removalReasons.keys(), ...archivedKeys])
				});
				return {
					store: capStore,
					maxEntries: Object.keys(capStore).length - overflow
				};
			}
		},
		onRemoved: ({ key }, reason) => removalReasons.set(key, reason),
		onArchived: ({ key }) => archivedKeys.add(key)
	});
	const selectedKeys = uniqueStrings([...archivedKeys, ...removalReasons.keys()]);
	const selectedEntries = readSessionEntryStore(database, { sessionKeys: selectedKeys });
	const archivedSessionKeys = [];
	const archivedWorktrees = [];
	for (const key of archivedKeys) {
		const previousEntry = selectedEntries[key];
		const planned = store[key];
		if (!previousEntry || !planned?.archivedAt) continue;
		const entry = {
			...previousEntry,
			archivedAt: planned.archivedAt,
			archiveReason: planned.archiveReason
		};
		delete entry.archivedBy;
		writeSessionEntry(database, key, entry, { canonicalPreviousEntry: previousEntry });
		archivedSessionKeys.push(key);
		if (entry.worktree) archivedWorktrees.push({
			entry: cloneSessionEntry(entry),
			sessionKey: key,
			storePath: params.storePath
		});
	}
	const removals = [...removalReasons].flatMap(([sessionKey, maintenanceReason]) => {
		const expectedEntry = selectedEntries[sessionKey];
		return expectedEntry ? [{
			expectedEntry,
			maintenanceReason,
			sessionKey
		}] : [];
	});
	recordSessionEntryMaintenanceAgeFact(database, maintenance, plannedAt);
	if (removals.length === 0) return {
		archivedSessionKeys,
		...archivedWorktrees.length ? { archivedWorktrees } : {},
		entryRemovals: [],
		stateDeletePlans: [],
		archived,
		capArchived,
		modelRunPruned: 0,
		pruned: 0,
		capped: capArchived
	};
	const removedSessionIds = /* @__PURE__ */ new Set();
	for (const removal of removals) for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) removedSessionIds.add(sessionId);
	for (const sessionId of readSessionGenerationIdsForKeys(database, removals.map((removal) => removal.sessionKey))) removedSessionIds.add(sessionId);
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: removals.map((removal) => removal.sessionKey),
		projectedStore: {}
	});
	const deletePlans = [];
	for (const sessionId of removedSessionIds) {
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: true,
			archiveDirectory: params.archiveDirectory,
			database,
			referencedSessionIds,
			sessionId
		});
		if (plan) deletePlans.push(plan);
	}
	return {
		archivedSessionKeys,
		...archivedWorktrees.length ? { archivedWorktrees } : {},
		entryRemovals: removals,
		stateDeletePlans: deletePlans,
		archived,
		capArchived,
		modelRunPruned,
		pruned,
		capped
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-transaction.ts
function reclaimSessionMaintenanceInTransaction(plan, callbacks) {
	if (plan.kind === "maintenance-statistics") {
		const database = openAssistantAgentDatabase(plan.databaseOptions);
		runWithSqliteBusyTimeout(database.db, 0, () => runAssistantAgentWriteTransaction((current) => {
			callbacks.beforeMutation?.();
			refreshSessionPlannerStatisticsInDatabase(current);
			callbacks.onCommit?.(current);
		}, plan.databaseOptions, { busyTimeoutMs: 0 }));
		return {
			kind: plan.kind,
			value: true
		};
	}
	if (plan.kind === "maintenance-plan") {
		let preservationRequired;
		try {
			return runAssistantAgentWriteTransaction((database) => {
				callbacks.beforeMutation?.();
				stageSessionEntryMaintenanceAgeFact(database.db, plan.input.ageFact);
				const maintenance = applySessionEntryMaintenanceInDatabase(database, plan.input, () => {
					if (plan.input.preservation === null) {
						preservationRequired = /* @__PURE__ */ new Error("SQLite maintenance requires session preservation");
						throw preservationRequired;
					}
					return plan.input.preservation;
				});
				if (maintenance.archived > 0 || maintenance.entryRemovals.length > 0) callbacks.onCommit?.(database);
				return {
					kind: plan.kind,
					value: maintenance,
					ageFact: readSessionEntryMaintenanceAgeFact(database.db, plan.input.maintenance)
				};
			}, plan.databaseOptions);
		} catch (error) {
			if (preservationRequired && error === preservationRequired) return { kind: "maintenance-preservation-required" };
			throw error;
		}
	}
	return runSqliteSessionDeletionTransaction((database) => {
		callbacks.beforeMutation?.();
		const partition = partitionUnchangedPlannedLifecycleArtifactEntries(database, plan.entries);
		const archivedTranscripts = deleteMaterializedSessionStatePlans(database, plan.materializedPlans, void 0, new Set(partition.unchanged.map((entry) => entry.sessionKey)));
		deletePlannedLifecycleArtifactEntries(database, partition.unchanged);
		const result = {
			kind: plan.kind,
			value: {
				archivedTranscripts,
				changedEntries: partition.changed,
				committedEntries: partition.unchanged
			}
		};
		callbacks.onCommit?.(database, result);
		return result;
	}, plan.databaseOptions);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation-publication.ts
function prepareReclamationPublication(plan, result) {
	if (plan.kind === "maintenance-finalize" && result?.kind === "maintenance-finalize") return prepareCommittedSessionEntryRemovals(plan.agentId, result.value.committedEntries);
	if (plan.kind === "lifecycle-artifacts") return prepareCommittedSessionEntryRemovals(plan.agentId, plan.entries);
}
function collectReclamationChangedSessionKeys(plan, result) {
	switch (result.kind) {
		case "maintenance-plan": return result.value.archivedSessionKeys;
		case "maintenance-finalize": return result.value.committedEntries.map(({ sessionKey }) => sessionKey);
		case "maintenance-preservation-required":
		case "maintenance-statistics": return [];
		default: return [...plan.materializedPlans.flatMap(({ snapshot }) => snapshot.sessionKey ? [snapshot.sessionKey] : []), ...plan.kind === "lifecycle-artifacts" ? plan.entries.map(({ sessionKey }) => sessionKey) : plan.kind === "entry" || plan.kind === "historical-generation" ? [plan.deleteParams.target.canonicalKey, ...plan.deleteParams.target.storeKeys] : []];
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation-run.ts
function prepareReclamationWorkerTransferList(plan) {
	const buffers = /* @__PURE__ */ new Set();
	for (const materializedPlan of plan.materializedPlans) {
		const archive = materializedPlan.archive;
		if (!archive) continue;
		const bytes = archive.bytes;
		let owned = bytes;
		let buffer;
		if (bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) buffer = bytes.buffer;
		else {
			buffer = new ArrayBuffer(bytes.byteLength);
			owned = new Uint8Array(buffer);
			owned.set(bytes);
		}
		materializedPlan.archive = {
			...archive,
			bytes: owned
		};
		buffers.add(buffer);
	}
	return [...buffers];
}
async function runPreparedSqliteSessionReclamation(params, owner) {
	const { database, claim, worker, assertRequestCurrent, commitGate } = owner;
	const { plan } = params;
	const assertCommitAllowed = () => {
		worker.assertCurrent(plan.databaseOptions, claim);
		assertRequestCurrent();
	};
	assertCommitAllowed();
	let publishCommitted;
	const runAuthorized = () => withSqliteReclamationAuthorization(commitGate, database.db, () => {
		assertCommitAllowed();
		publishCommitted = prepareReclamationPublication(plan);
	}, (authorize) => worker.run({
		claim,
		validationOwner: {
			database,
			isCurrent: claim.isCurrent
		},
		commitGate,
		plan,
		diagnostics: params.diagnostics,
		onCommitRequest: authorize,
		withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(plan.databaseOptions, async () => {
			let refusal;
			try {
				assertCommitAllowed();
			} catch (error) {
				refusal = { error };
			}
			const completed = await run(refusal);
			if (completed) {
				params.onWorkerResult?.(completed);
				withSqlitePostCommitPublications(database.db, () => {
					const publishRemoval = plan.kind === "maintenance-finalize" ? prepareReclamationPublication(plan, completed) : publishCommitted;
					if (publishRemoval) deferSqlitePostCommitPublication(database.db, publishRemoval);
					for (const sessionKey of new Set(collectReclamationChangedSessionKeys(plan, completed))) publishSessionEntryCacheInvalidation(database, { sessionKey });
				});
				if (plan.kind === "maintenance-statistics" && getAssistantAgentDatabaseIfOpen(plan.databaseOptions)?.db === database.db) try {
					assertCommitAllowed();
					runWithSqliteBusyTimeout(database.db, 0, () => {
						database.db.exec("ANALYZE sqlite_schema;");
					});
				} catch (error) {
					try {
						getChildLogger({ subsystem: "session-sqlite" }).warn("Committed SQLite session statistics could not refresh parent planner metadata", {
							agentId: database.agentId,
							error,
							path: database.path
						});
					} catch {}
				}
			}
		}, "session.reclamation.worker-commit", {
			...params.diagnostics,
			reclamationAdmission
		}, "worker"),
		transferList: prepareReclamationWorkerTransferList(plan)
	}));
	return plan.kind === "maintenance-finalize" ? await runExclusiveSqliteSessionWrite(plan.databaseOptions, runAuthorized, "session.maintenance.finalize", params.diagnostics) : await runAuthorized();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation.ts
const reclamationQueue = resolveGlobalSingleton(Symbol.for("testclaw.sqliteSessionReclamationQueue"), () => new KeyedAsyncQueue());
/** Bounds materialized archive bytes through the matching reclamation commit. */
function runExclusiveSqliteSessionReclamation(run) {
	return reclamationQueue.enqueue("session-reclamation", run);
}
function resolveSessionReclamationDatabaseOptions(options) {
	const sourceEnv = options.env ?? process.env;
	const sharedStatePath = options.database?.path ?? resolveAssistantStateSqlitePath(sourceEnv);
	return {
		agentId: normalizeAgentId(options.agentId),
		env: { TESTCLAW_STATE_DIR: resolveAssistantStateDirForDatabasePath(sharedStatePath) },
		path: resolveAssistantAgentSqlitePath(options)
	};
}
function deleteSessionBoardRows(database, sessionKeys) {
	const keys = [...new Set(sessionKeys)];
	if (keys.length === 0) return;
	const db = getNodeSqliteKysely(database.db);
	const tables = new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", ["board_tabs", "board_widgets"])).rows.map((row) => row.name));
	if (!tables.has("board_tabs") || !tables.has("board_widgets")) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "in", keys));
	executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "in", keys));
}
function shouldDeleteSqliteSessionEntryLifecycle(database, entry, params, scope = {
	kind: "entry",
	phase: "plan"
}) {
	if (params.expectedDatabaseIdentity !== void 0 && params.expectedDatabaseIdentity !== readAssistantAgentDatabaseIdentity(database).identity) return false;
	if (!entry || params.expectedEntry && !sqliteSessionEntriesEqual(entry, params.expectedEntry)) return false;
	if (params.expectedSessionId !== void 0 && (params.expectedSessionId === null ? entry.sessionId !== void 0 : entry.sessionId !== params.expectedSessionId)) return false;
	if (params.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== params.expectedLifecycleRevision || params.expectedUpdatedAt !== void 0 && entry.updatedAt !== params.expectedUpdatedAt) return false;
	if (scope.kind === "entry" && params.expectedNodeArtifactFingerprint !== void 0 && params.expectedNodeArtifactFingerprint !== readSessionNodeArtifactFingerprint(database, params.target.canonicalKey)) return false;
	if (params.expectedGenerations) {
		const expected = new Map(params.expectedGenerations.map((generation) => [generation.window.session_id, generation]));
		if (readSqliteSessionGenerationWindows(database, scope.kind === "entry" ? [params.target.canonicalKey, ...params.target.storeKeys] : [], scope.kind === "entry" ? collectSessionStateIdsForEntry(entry) : [scope.sessionId]).some((window) => {
			const generation = expected.get(window.session_id);
			return !generation || !isDeepStrictEqual({ ...generation.window }, { ...window }) || scope.phase === "commit" && generation.fingerprint !== readSqliteSessionGenerationClaim(database, window).fingerprint;
		})) return false;
	}
	return true;
}
function readValidatedSessionDeletionTarget(database, validation) {
	const snapshot = readLifecycleTargetSnapshot(database, validation.deleteParams.target);
	const entry = snapshot[0]?.entry;
	if (!sqliteLifecycleTargetSnapshotsEqual(validation.preparedTargetSnapshot, snapshot) || !shouldDeleteSqliteSessionEntryLifecycle(database, entry, validation.deleteParams, validation.scope)) return;
	return {
		snapshot,
		entry
	};
}
function* prepareHistoricalGenerationDeletions(params) {
	const expected = params.deleteParams.expectedGenerations ? new Map(params.deleteParams.expectedGenerations.map((generation) => [generation.window.session_id, generation])) : void 0;
	for (const sessionId of params.sessionIds) {
		const generation = expected?.get(sessionId);
		yield {
			sessionId,
			deleteParams: expected ? {
				...params.deleteParams,
				expectedGenerations: generation ? [generation] : []
			} : params.deleteParams,
			preparedTargetSnapshot: params.preparedTargetSnapshot,
			scope: {
				kind: "historical-generation",
				phase: "plan",
				sessionId
			}
		};
	}
}
function expectedEntryMismatchResult() {
	return {
		archivedTranscripts: [],
		deleted: false,
		expectedEntryMismatch: true
	};
}
function reclaimSqliteSessionInTransaction(plan, callbacks = {}) {
	if (plan.kind === "maintenance-pages") {
		const database = openAssistantAgentDatabase(plan.databaseOptions);
		return {
			kind: plan.kind,
			value: database.walMaintenance.reclaimFreePages({
				maxPages: plan.maxPages,
				beforeMutation: callbacks.beforeMutation,
				onCommit: () => callbacks.onCommit?.(database),
				afterCommit: callbacks.afterCommit
			})
		};
	}
	const result = reclaimSqliteRowsInTransaction(plan, callbacks);
	callbacks.afterCommit?.();
	if (result.kind === "history-eviction" && result.value.deleted) reclaimSqliteFreePagesBestEffort(plan.databaseOptions);
	return result;
}
function reclaimSqliteRowsInTransaction(plan, callbacks) {
	if (plan.kind === "maintenance-plan" || plan.kind === "maintenance-finalize" || plan.kind === "maintenance-statistics") return reclaimSessionMaintenanceInTransaction(plan, callbacks);
	if (plan.kind === "entry") {
		const value = runSqliteSessionDeletionTransaction((transactionDb) => {
			callbacks.beforeMutation?.();
			const current = readValidatedSessionDeletionTarget(transactionDb, {
				...plan,
				scope: {
					kind: "entry",
					phase: "commit"
				}
			});
			if (!current) return expectedEntryMismatchResult();
			const { snapshot, entry } = current;
			const sessionKeys = [
				plan.deleteParams.target.canonicalKey,
				...plan.deleteParams.target.storeKeys,
				...snapshot.map((row) => row.sessionKey)
			];
			const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, void 0, new Set(sessionKeys));
			deleteLifecycleTargetRows(transactionDb, plan.deleteParams.target);
			if (plan.deleteParams.deleteDeliveryArtifacts === true) deleteSessionDeliveryArtifacts(transactionDb, plan.deleteParams.target.canonicalKey, sessionKeys);
			deleteSessionBoardRows(transactionDb, sessionKeys);
			callbacks.onCommit?.(transactionDb);
			return {
				archivedTranscripts,
				deleted: true,
				deletedEntry: cloneSessionEntry(entry),
				...entry.sessionId ? { deletedSessionId: entry.sessionId } : {}
			};
		}, plan.databaseOptions);
		return {
			kind: plan.kind,
			value
		};
	}
	if (plan.kind === "lifecycle-artifacts") {
		const value = runSqliteSessionDeletionTransaction((transactionDb) => {
			callbacks.beforeMutation?.();
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, plan.entries);
			const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, void 0, new Set(plan.entries.map((entry) => entry.sessionKey)));
			const removedEntries = deletePlannedLifecycleArtifactEntries(transactionDb, plan.entries);
			callbacks.onCommit?.(transactionDb);
			return {
				archivedTranscripts,
				removedEntries
			};
		}, plan.databaseOptions);
		return {
			kind: plan.kind,
			value
		};
	}
	const value = runAssistantAgentWriteTransaction((transactionDb) => {
		callbacks.beforeMutation?.();
		const protectedSessionIds = new Set(plan.protectedSessionIds);
		const diskBudget = plan.kind === "history-eviction" ? plan.diskBudget : void 0;
		let excludedSessionKeys;
		if (plan.kind === "historical-generation") {
			const current = readValidatedSessionDeletionTarget(transactionDb, {
				...plan,
				scope: {
					kind: "historical-generation",
					phase: "commit",
					sessionId: plan.sessionId
				}
			});
			if (!current) return {
				archivedTranscripts: [],
				deleted: false,
				expectedEntryMismatch: true
			};
			excludedSessionKeys = /* @__PURE__ */ new Set([
				plan.deleteParams.target.canonicalKey,
				...plan.deleteParams.target.storeKeys,
				...current.snapshot.map((row) => row.sessionKey)
			]);
		} else if (isRecentHistoricalSessionId({
			database: transactionDb,
			...plan.diskBudget,
			sessionId: plan.sessionId
		})) protectedSessionIds.add(plan.sessionId);
		const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, protectedSessionIds, excludedSessionKeys, void 0, diskBudget);
		const db = getSessionKysely(transactionDb.db);
		const deleted = executeSqliteQuerySync(transactionDb.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", plan.sessionId)).rows.length === 0;
		if (deleted) callbacks.onCommit?.(transactionDb);
		return {
			archivedTranscripts: deleted ? archivedTranscripts : [],
			deleted
		};
	}, plan.databaseOptions);
	return {
		kind: plan.kind,
		value
	};
}
function reclaimSqliteFreePagesBestEffort(databaseOptions) {
	try {
		openAssistantAgentDatabase(databaseOptions).walMaintenance.reclaimFreePages({ checkpointMode: "PASSIVE" });
	} catch {}
}
async function runSqliteSessionReclamation(params) {
	if (params.diagnostics) params.diagnostics.kind = params.plan.kind;
	if (params.forceInProcess || isIncognitoAssistantAgentSqlitePath(params.plan.databaseOptions.path, {
		agentId: params.plan.databaseOptions.agentId,
		env: params.plan.databaseOptions.env
	})) return await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
		params.assertCommitAllowed?.();
		return await withSqliteSessionDatabase(params.plan.databaseOptions, () => {
			params.assertCommitAllowed?.();
			return reclaimSqliteSessionInTransaction(params.plan, {
				beforeMutation: params.assertCommitAllowed,
				onCommit: (database, result) => {
					const publish = prepareReclamationPublication(params.plan, result);
					if (publish) deferAssistantAgentPostCommitPublication(database, publish);
					params.onInProcessCommit?.(database);
				}
			});
		}, params.assertCommitAllowed);
	}, "session.reclamation.in-process", params.diagnostics);
	return await withSqliteMutationWorkerLifetime(params.plan.databaseOptions, async ({ assertCurrent, commitGate, signal }) => {
		const assertRequestCurrent = () => {
			assertCurrent();
			params.assertCommitAllowed?.();
		};
		const retained = await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
			assertRequestCurrent();
			return retainAssistantAgentDatabaseReadOnly(params.plan.databaseOptions);
		}, "session.reclamation.retain");
		if (!retained.found) throw new Error("SQLite session reclamation lost its prepared database");
		const { database, claim } = retained;
		try {
			const plan = {
				...params.plan,
				databaseOptions: {
					...params.plan.databaseOptions,
					path: readAssistantAgentDatabaseIdentity(database).filename
				}
			};
			return await withSqliteReclamationWorker(plan.databaseOptions, claim, async (worker) => {
				return runPreparedSqliteSessionReclamation({
					...params,
					plan
				}, {
					database,
					claim,
					worker,
					assertRequestCurrent,
					commitGate
				});
			}, assertRequestCurrent, signal);
		} finally {
			claim.release();
		}
	});
}
function prepareReclamationDeleteParams({ commitGuard: _commitGuard, ...params }) {
	return params;
}
function createSessionEntryReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		deleteParams: prepareReclamationDeleteParams(params.deleteParams),
		kind: "entry",
		materializedPlans: params.materializedPlans,
		preparedTargetSnapshot: params.preparedTargetSnapshot
	};
}
function createLifecycleArtifactReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		agentId: params.agentId,
		entries: params.entries,
		kind: "lifecycle-artifacts",
		materializedPlans: params.materializedPlans
	};
}
function createSessionMaintenancePlanningOperation(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		input: params.input,
		kind: "maintenance-plan",
		materializedPlans: []
	};
}
function createSessionMaintenanceStatisticsOperation(databaseOptions) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
		kind: "maintenance-statistics",
		materializedPlans: []
	};
}
function createSessionMaintenanceFinalizationOperation(params) {
	return {
		...params,
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		kind: "maintenance-finalize"
	};
}
function createHistoryEvictionReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		diskBudget: params.diskBudget,
		kind: "history-eviction",
		materializedPlans: params.materializedPlans,
		protectedSessionIds: [...params.protectedSessionIds],
		sessionId: params.sessionId
	};
}
function createHistoricalGenerationReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		deleteParams: prepareReclamationDeleteParams(params.deleteParams),
		kind: "historical-generation",
		materializedPlans: params.materializedPlans,
		preparedTargetSnapshot: params.preparedTargetSnapshot,
		protectedSessionIds: [...params.protectedSessionIds],
		sessionId: params.sessionId
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance.ts
const MAX_SESSION_MAINTENANCE_BATCH_ENTRIES = 64;
const MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES = 67108864;
const SESSION_TRANSCRIPT_BYTE_QUERY_BATCH = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const plannerMaintenanceByStore = /* @__PURE__ */ new Map();
/** Coalesce bounded planner-statistics refreshes behind the per-store writer lane. */
async function refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	if (deletedEntries < SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES || !isCurrent()) return;
	const storePath = resolveAssistantAgentSqlitePath(toDatabaseOptions(scope));
	const active = plannerMaintenanceByStore.get(storePath);
	if (active) {
		await active;
		return;
	}
	const completion = runSqliteSessionReclamation({
		diagnostics: { kind: "maintenance-statistics" },
		assertCommitAllowed: () => {
			if (!isCurrent()) throw new Error("SQLite maintenance planner owner retired");
		},
		forceInProcess: false,
		plan: createSessionMaintenanceStatisticsOperation(toDatabaseOptions(scope))
	}).then(() => void 0).catch((error) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session planner-statistics refresh failed", {
			agentId: scope.agentId,
			error,
			path: storePath
		});
	}).finally(() => {
		plannerMaintenanceByStore.delete(storePath);
	});
	plannerMaintenanceByStore.set(storePath, completion);
	await completion;
}
function buildSessionMaintenanceBatches(params) {
	const parent = params.entryRemovals.map((_, index) => index);
	const find = (index) => {
		let root = index;
		while (parent[root] !== root) root = parent[root] ?? root;
		let current = index;
		while (parent[current] !== current) {
			const next = parent[current] ?? root;
			parent[current] = root;
			current = next;
		}
		return root;
	};
	const union = (left, right) => {
		const leftRoot = find(left);
		const rightRoot = find(right);
		if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
	};
	const removalIndexesBySessionId = /* @__PURE__ */ new Map();
	const removalIndexBySessionKey = /* @__PURE__ */ new Map();
	const addRemovalIndex = (sessionId, index) => {
		const indexes = removalIndexesBySessionId.get(sessionId) ?? [];
		if (indexes.includes(index)) return;
		if (indexes.length > 0) union(indexes[0] ?? index, index);
		indexes.push(index);
		removalIndexesBySessionId.set(sessionId, indexes);
	};
	for (const [index, removal] of params.entryRemovals.entries()) {
		if (!removal.expectedEntry) continue;
		removalIndexBySessionKey.set(removal.sessionKey, index);
		for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) addRemovalIndex(sessionId, index);
	}
	for (const plan of params.stateDeletePlans) {
		const ownerIndex = plan.snapshot.sessionKey ? removalIndexBySessionKey.get(plan.snapshot.sessionKey) : void 0;
		if (ownerIndex !== void 0) addRemovalIndex(plan.sessionId, ownerIndex);
	}
	const groupsByRoot = /* @__PURE__ */ new Map();
	for (const [index, removal] of params.entryRemovals.entries()) {
		const root = find(index);
		const group = groupsByRoot.get(root) ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: index,
			stateDeletePlans: [],
			workItems: 0
		};
		group.entryRemovals.push(removal);
		group.order = Math.min(group.order, index);
		groupsByRoot.set(root, group);
	}
	const plansBySessionId = /* @__PURE__ */ new Map();
	for (const plan of params.stateDeletePlans) {
		const plans = plansBySessionId.get(plan.sessionId) ?? [];
		plans.push(plan);
		plansBySessionId.set(plan.sessionId, plans);
	}
	const standaloneGroups = [];
	let standaloneOrder = params.entryRemovals.length;
	for (const [sessionId, plans] of plansBySessionId) {
		const removalIndex = removalIndexesBySessionId.get(sessionId)?.[0];
		const removalGroup = removalIndex === void 0 ? void 0 : groupsByRoot.get(find(removalIndex));
		const group = removalGroup ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: standaloneOrder++,
			stateDeletePlans: [],
			workItems: 0
		};
		group.stateDeletePlans.push(...plans);
		if (plans.some((plan) => plan.archiveTranscript)) group.archiveBytes += params.archiveBytesBySessionId.get(sessionId) ?? 0;
		if (!removalGroup) standaloneGroups.push(group);
	}
	const groups = [...groupsByRoot.values(), ...standaloneGroups].map((group) => {
		group.workItems = Math.max(group.entryRemovals.length, new Set(group.stateDeletePlans.map((plan) => plan.sessionId)).size);
		return group;
	}).toSorted((left, right) => left.order - right.order);
	const batches = [];
	let batch = {
		archiveBytes: 0,
		entryRemovals: [],
		stateDeletePlans: [],
		workItems: 0
	};
	const flush = () => {
		if (batch.workItems === 0) return;
		batches.push(batch);
		batch = {
			archiveBytes: 0,
			entryRemovals: [],
			stateDeletePlans: [],
			workItems: 0
		};
	};
	for (const group of groups) {
		const exceedsEntryLimit = batch.workItems > 0 && batch.workItems + group.workItems > MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
		const exceedsByteLimit = batch.workItems > 0 && batch.archiveBytes + group.archiveBytes > MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES;
		if (exceedsEntryLimit || exceedsByteLimit) flush();
		batch.archiveBytes += group.archiveBytes;
		batch.entryRemovals.push(...group.entryRemovals);
		batch.stateDeletePlans.push(...group.stateDeletePlans);
		batch.workItems += group.workItems;
	}
	flush();
	return batches;
}
async function readSessionTranscriptJsonlBytes(scope, sessionIds, isCurrent) {
	const bytesBySessionId = /* @__PURE__ */ new Map();
	const options = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_BYTE_QUERY_BATCH) {
		const batch = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_BYTE_QUERY_BATCH);
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		if (!isCurrent()) return bytesBySessionId;
		let sized;
		if (isIncognitoAssistantAgentSqlitePath(options.path, options)) {
			const opened = withAssistantAgentDatabaseReadOnly((database) => readSessionTranscriptJsonlBytesInDatabase(database, batch), options);
			if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
			sized = opened.value;
		} else {
			const results = await withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => await runSqliteTranscriptArchiveWorkerOperation({
				assertCurrent,
				signal,
				expectedMessageType: "sized",
				workerData: {
					type: "sqlite-transcript-archive-v2",
					operation: "maintenance-size",
					input: {
						...options,
						sessionIds: batch
					}
				}
			}));
			if (!results[0]) throw new Error("SQLite maintenance sizing worker omitted its result");
			sized = results[0];
		}
		if (!isCurrent()) return bytesBySessionId;
		for (const [sessionId, bytes] of sized) bytesBySessionId.set(sessionId, bytes);
	}
	return bytesBySessionId;
}
function applySessionEntryMaintenance(database, params) {
	if (params.skipMaintenance) return emptySessionEntryMaintenancePlan();
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	return applySessionEntryMaintenanceInDatabase(database, {
		...params,
		maintenance
	}, () => captureSessionMaintenancePreservation(params.storePath));
}
/** Finalizes maintenance after its caller releases the per-store writer lane. */
async function finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(scope, plans, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	const committedCounts = {
		archived: plans.reduce((count, plan) => count + plan.archived, 0),
		capArchived: plans.reduce((count, plan) => count + plan.capArchived, 0),
		modelRunPruned: 0,
		pruned: 0,
		capped: plans.reduce((count, plan) => count + plan.capped - plan.entryRemovals.filter((removal) => removal.maintenanceReason === "capped").length, 0)
	};
	const emptyResult = () => ({
		archivedTranscripts: [],
		...committedCounts
	});
	if (!isCurrent()) return emptyResult();
	const archivedWorktrees = plans.flatMap((plan) => plan.archivedWorktrees ?? []);
	if (archivedWorktrees.length) {
		const { cleanUpAutomaticallyArchivedWorktrees } = await import("./session-worktree-lifecycle-CrDlHVhu.js");
		if (!isCurrent()) return emptyResult();
		await cleanUpAutomaticallyArchivedWorktrees(scope, archivedWorktrees);
	}
	const entryRemovals = plans.flatMap((plan) => plan.entryRemovals);
	const stateDeletePlans = plans.flatMap((plan) => plan.stateDeletePlans);
	const warn = (message, error, warnedStateDeletePlans) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn(message, {
			agentId: scope.agentId,
			error,
			path: scope.path,
			sessionIds: uniqueStrings(warnedStateDeletePlans.map((plan) => plan.sessionId))
		});
	};
	if (!isCurrent()) return emptyResult();
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	let archiveBytesBySessionId;
	try {
		archiveBytesBySessionId = await readSessionTranscriptJsonlBytes(scope, stateDeletePlans.filter((plan) => plan.archiveTranscript).map((plan) => plan.sessionId), isCurrent);
	} catch (error) {
		warn("SQLite session maintenance archive sizing failed", error, stateDeletePlans);
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	if (!isCurrent()) return emptyResult();
	const publishedTranscripts = [];
	let deletedEntries = options.deletedEntriesBeforeMaintenance ?? 0;
	for (const batch of buildSessionMaintenanceBatches({
		archiveBytesBySessionId,
		entryRemovals,
		stateDeletePlans
	})) {
		if (!isCurrent()) break;
		let archivedTranscripts;
		let changedEntryRemovals;
		let committedEntryRemovals;
		try {
			const materializedPlans = await materializeSessionStateDeletePlans(batch.stateDeletePlans);
			if (!isCurrent()) break;
			const result = await withSqliteSessionDeletions(scope, batch.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
				entry,
				sessionKey
			}] : []), async (assertCurrent) => await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-finalize" },
				assertCommitAllowed: () => {
					assertCurrent();
					if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
				},
				forceInProcess: hasPreparedNativeSessionDeletion(),
				plan: createSessionMaintenanceFinalizationOperation({
					agentId: scope.agentId,
					databaseOptions: toDatabaseOptions(scope),
					entries: batch.entryRemovals,
					materializedPlans
				})
			}));
			if (result.kind !== "maintenance-finalize") throw new Error("SQLite maintenance returned another operation's result");
			archivedTranscripts = result.value.archivedTranscripts;
			changedEntryRemovals = result.value.changedEntries;
			committedEntryRemovals = result.value.committedEntries;
		} catch (error) {
			warn("SQLite session maintenance cleanup failed", error, batch.stateDeletePlans);
			break;
		}
		if (!isCurrent()) break;
		if (changedEntryRemovals.length > 0) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session maintenance skipped changed entries", {
			agentId: scope.agentId,
			path: scope.path,
			sessionKeys: changedEntryRemovals.map((removal) => removal.sessionKey)
		});
		deletedEntries += batch.workItems - (batch.entryRemovals.length - committedEntryRemovals.length);
		for (const removal of committedEntryRemovals) if (removal.maintenanceReason === "model-run-pruned") committedCounts.modelRunPruned += 1;
		else if (removal.maintenanceReason === "pruned") committedCounts.pruned += 1;
		else if (removal.maintenanceReason === "capped") committedCounts.capped += 1;
		try {
			publishedTranscripts.push(...await publishSessionStateArchives(scope, archivedTranscripts));
		} catch (error) {
			warn("SQLite session maintenance archive publication failed", error, batch.stateDeletePlans);
		}
	}
	if (isCurrent()) await refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, { isCurrent });
	return {
		archivedTranscripts: publishedTranscripts,
		...committedCounts
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-page-reclamation.ts
/** Preview reads share the history reader without waiting for archive or writer admission. */
async function readSqliteSessionArchivePruning(input) {
	const options = resolveSessionReclamationDatabaseOptions(input);
	if (!supportsAssistantAgentDatabaseExecution(options)) {
		const { readSessionArchivePruningInDatabase } = await import("./session-history-archive-pruning.worker-ClVk7AyN.js");
		return withSqliteSessionDatabase(options, (database) => readSessionArchivePruningInDatabase(database));
	}
	const physical = readDatabasePathIdentitySync(options.path);
	if (!physical.key.startsWith("file:")) return null;
	const databaseOptions = {
		...options,
		path: physical.canonicalPath
	};
	const expectedIdentity = {
		kind: "file",
		physicalIdentity: physical.key.slice(5),
		nativeLocation: physical.canonicalPath
	};
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-C1vb1UkM.js");
	assertExistingDatabaseIdentity(options.path, physical.key);
	return withSessionHistoryWorkerDatabase(databaseOptions, async (reader) => {
		assertExistingDatabaseIdentity(options.path, physical.key);
		const result = await reader.readArchivePruning({
			env: databaseOptions.env,
			expectedIdentity
		});
		reader.assertCurrent();
		assertExistingDatabaseIdentity(options.path, physical.key);
		return result;
	});
}
/** Retain source custody before archive admission; each page unit owns its writer separately. */
async function withSqliteSessionPageReclamation(input, run) {
	const options = resolveSessionReclamationDatabaseOptions(input);
	const incognito = isIncognitoAssistantAgentSqlitePath(options.path, options);
	const nativeOwner = !supportsAssistantAgentDatabaseExecution(options);
	const physical = incognito ? void 0 : readDatabasePathIdentitySync(options.path);
	if (physical && !physical.key.startsWith("file:")) throw new Error("SQLite archive pruning requires its existing database");
	return withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => {
		if (nativeOwner) {
			const { readSessionArchivePruningInDatabase, deletePublishedSessionArchiveInDatabase, removeLegacySessionArchiveInDatabase } = await import("./session-history-archive-pruning.worker-ClVk7AyN.js");
			const databaseOptions = physical ? {
				...options,
				path: physical.canonicalPath
			} : options;
			const assertNativeCurrent = () => {
				assertCurrent();
				if (physical) {
					assertExistingDatabaseIdentity(options.path, physical.key);
					assertExistingDatabaseIdentity(databaseOptions.path, physical.key);
				}
			};
			const runNative = () => {
				assertNativeCurrent();
				return run((maxPages) => runExclusiveSqliteSessionWrite(databaseOptions, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
					assertNativeCurrent();
					return database.walMaintenance.reclaimFreePages({
						maxPages,
						beforeMutation: assertNativeCurrent,
						onCommit: assertNativeCurrent
					});
				}, assertNativeCurrent), "session.history.free-pages"), assertNativeCurrent, databaseOptions, {
					read: async () => await withSqliteSessionDatabase(databaseOptions, (database) => {
						assertNativeCurrent();
						return readSessionArchivePruningInDatabase(database);
					}, assertNativeCurrent),
					removeLegacy: async (filePath) => await withSqliteSessionDatabase(databaseOptions, (database) => removeLegacySessionArchiveInDatabase(database, databaseOptions, filePath, assertNativeCurrent), assertNativeCurrent),
					deletePublished: async (row) => await withSqliteSessionDatabase(databaseOptions, (database) => {
						deletePublishedSessionArchiveInDatabase(database, databaseOptions, row, assertNativeCurrent);
					}, assertNativeCurrent)
				});
			};
			return physical ? runExclusiveSqliteTranscriptArchiveWorker(runNative, signal) : runNative();
		}
		if (!physical) throw new Error("SQLite archive pruning requires its existing file owner");
		const databaseOptions = {
			...options,
			path: physical.canonicalPath
		};
		const expectedIdentity = {
			kind: "file",
			physicalIdentity: physical.key.slice(5),
			nativeLocation: physical.canonicalPath
		};
		const execution = captureAssistantAgentDatabaseExecution(databaseOptions, { expectedIdentity });
		const assertPruningCurrent = () => {
			assertCurrent();
			execution.assertCurrent();
			assertExistingDatabaseIdentity(options.path, physical.key);
			assertExistingDatabaseIdentity(databaseOptions.path, physical.key);
		};
		const source = {
			assertCurrent: assertPruningCurrent,
			createAdmission(binding) {
				return () => ({
					nativeLocations: binding.nativeLocations,
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						binding.authorize(request);
						assertPruningCurrent();
						if (!grant()) throw new Error("SQLite archive pruning authority expired");
					})
				});
			}
		};
		const write = async (operation, label) => {
			const result = await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				assertPruningCurrent();
				return execution.runExisting(source, async (worker) => ({ value: await operation(worker) }), { retireNativeOnFailure: true });
			}, label, void 0, "worker");
			assertPruningCurrent();
			if (!result) throw new Error("SQLite archive pruning lost its prepared database");
			return result.value;
		};
		try {
			const [{ withSessionHistoryWorkerDatabase }, { maintenanceLane }] = await Promise.all([import("./session-transcript-worker-runtime-C1vb1UkM.js"), import("./session-transcript-worker-resources-Da_KZN5F.js")]);
			assertPruningCurrent();
			return await withSessionHistoryWorkerDatabase(databaseOptions, async (reader) => await runExclusiveSqliteTranscriptArchiveWorker(async () => {
				assertPruningCurrent();
				return run(async (maxPages) => {
					const result = await write((worker) => worker.execute({
						type: "session.archivePruning.reclaimPages",
						input: { maxPages }
					}), "session.history.free-pages");
					if (result.checkpoint) result.checkpoint = publishSqliteWalCheckpointObservation(databaseOptions.path, result.checkpoint);
					return result;
				}, assertPruningCurrent, databaseOptions, {
					read: async () => {
						assertPruningCurrent();
						const result = await reader.readArchivePruning({
							env: databaseOptions.env,
							expectedIdentity
						});
						assertPruningCurrent();
						return result;
					},
					removeLegacy: (filePath) => write((worker) => worker.execute({
						type: "session.archivePruning.removeLegacy",
						input: { filePath }
					}), "session.history.archive-prune"),
					deletePublished: (row) => write((worker) => worker.execute({
						type: "session.archivePruning.deletePublished",
						input: row
					}), "session.history.archive-prune")
				});
			}, signal), maintenanceLane);
		} finally {
			await execution.release();
		}
	});
}
//#endregion
//#region src/config/sessions/session-history-archive-pruning.ts
function withArchivePruningWriter(params, run) {
	return runExclusiveSqliteSessionWrite(params.databaseOptions, async () => {
		params.assertCurrent();
		return run();
	}, "session.history.archive-prune");
}
async function reclaimSqliteFreePages(databaseOptions, diagnostics, limits) {
	const reclaimPages = limits?.reclaimPages;
	if (!reclaimPages) return withSqliteSessionPageReclamation(databaseOptions, (reclaim, assertCurrent, preparedOptions) => reclaimSqliteFreePages(preparedOptions, diagnostics, {
		...limits,
		reclaimPages: reclaim,
		assertCurrent: () => {
			limits?.assertCurrent?.();
			assertCurrent();
		}
	}));
	let remaining = limits?.maxPages;
	const maxPasses = limits?.maxPasses ?? Infinity;
	for (let pass = 0; pass < maxPasses && (remaining === void 0 || remaining > 0); pass++) {
		if (pass > 0) await setImmediate$1();
		limits?.assertCurrent?.();
		const result = await reclaimPages(remaining);
		if (diagnostics) {
			for (const key of [
				"checkpointCalls",
				"checkpointIncomplete",
				"checkpointMs",
				"queryMs",
				"vacuumMs",
				"vacuumPasses",
				"vacuumPagesRequested"
			]) diagnostics[key] = (diagnostics[key] ?? 0) + result[key];
			diagnostics.checkpointMaxMs = Math.max(diagnostics.checkpointMaxMs ?? 0, result.checkpointMaxMs);
			diagnostics.checkpoint = result.checkpoint?.health;
		}
		if (!result.checkpointCompleted) {
			limits?.onCheckpointIncomplete?.(result.checkpoint);
			return false;
		}
		const before = result.freePagesBefore;
		const after = result.remainingFreePages;
		if (before === null || after === null || before <= 0 || after >= before) return true;
		remaining = Math.min(remaining ?? before, before) - (before - after);
	}
	return true;
}
async function hasCanonicalSessionTranscriptArchives(databaseOptions) {
	return await readSqliteSessionArchivePruning(databaseOptions) !== null;
}
async function pruneCanonicalSessionTranscriptArchivesToHighWater(params) {
	const { diagnostics } = params;
	const measure = () => timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	let usage = await measure();
	let removedFiles = 0;
	while (usage.totalBytes > params.highWaterBytes) {
		if (!await withArchivePruningWriter(params, async () => {
			usage = await measure();
			params.assertCurrent();
			if (usage.totalBytes <= params.highWaterBytes) return false;
			const row = await timeArchivePruningAsync(diagnostics, "queryMs", () => params.archives.read());
			params.assertCurrent();
			if (!row) return false;
			const archivePath = path.resolve(params.archiveDirectory, row.archive_name);
			if (path.dirname(archivePath) !== path.resolve(params.archiveDirectory) || path.basename(archivePath) !== row.archive_name) throw new Error(`Invalid canonical session archive name for ${row.session_id}`);
			params.assertCurrent();
			try {
				await timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => fs.promises.rm(archivePath));
				removedFiles += 1;
				if (diagnostics) diagnostics.removedFiles = (diagnostics.removedFiles ?? 0) + 1;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) {
					if (diagnostics) diagnostics.failedRemovals = (diagnostics.failedRemovals ?? 0) + 1;
					return false;
				}
				if (diagnostics) diagnostics.missingFiles = (diagnostics.missingFiles ?? 0) + 1;
			}
			await timeArchivePruningAsync(diagnostics, "rowDeletionMs", () => params.archives.deletePublished(row));
			return true;
		})) break;
		const checkpointCompleted = await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params);
		usage = await measure();
		if (!checkpointCompleted) break;
	}
	return {
		removedFiles,
		usage
	};
}
function pruneAllSessionTranscriptArchivesToHighWater(input) {
	const diagnostics = input.diagnostics ?? { trigger: "initial" };
	return observeSessionArchivePruning(diagnostics, () => withSqliteSessionPageReclamation(input.databaseOptions, (reclaimPages, assertCurrent, databaseOptions, archives) => pruneSessionArchivesWithOwner({
		...input,
		diagnostics,
		reclaimPages,
		assertCurrent,
		databaseOptions,
		archives
	})));
}
async function pruneSessionArchivesWithOwner(params) {
	const { diagnostics } = params;
	const measure = () => timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	const before = await measure();
	diagnostics.totalBytesBefore = before.totalBytes;
	diagnostics.walBytesBefore = before.databaseWalBytes;
	const finish = (result) => {
		params.assertCurrent();
		diagnostics.totalBytesAfter = result.usage.totalBytes;
		diagnostics.walBytesAfter = result.usage.databaseWalBytes;
		const checkpointIncomplete = diagnostics.checkpointIncomplete ?? 0;
		diagnostics.completed = checkpointIncomplete === 0 && !diagnostics.failedRemovals;
		return {
			...result,
			completed: diagnostics.completed,
			checkpointIncomplete,
			checkpoint: diagnostics.checkpoint
		};
	};
	if (!await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params)) return finish({
		removedFiles: 0,
		usage: await measure()
	});
	const canonical = await pruneCanonicalSessionTranscriptArchivesToHighWater(params);
	if (diagnostics.checkpointIncomplete || canonical.usage.totalBytes <= params.highWaterBytes) return finish(canonical);
	const legacy = await pruneSessionTranscriptArchivesToHighWater({
		diagnostics,
		highWaterBytes: params.highWaterBytes,
		storePath: params.storePath,
		removeFile: (file) => withArchivePruningWriter(params, async () => {
			const usage = await measure();
			params.assertCurrent();
			if (usage.totalBytes <= params.highWaterBytes) return "preserved";
			return timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => params.archives.removeLegacy(file.path));
		})
	});
	return finish({
		removedFiles: canonical.removedFiles + legacy.removedFiles,
		usage: legacy.usage
	});
}
//#endregion
//#region src/config/sessions/session-history-budget-state.ts
const log$1 = createSubsystemLogger("sessions/history-eviction");
function createPhysicalBudgetResult(params) {
	const totalBytesAfter = params.totalBytesAfter ?? params.totalBytesBefore;
	return {
		totalBytesBefore: params.totalBytesBefore,
		totalBytesAfter,
		removedFiles: params.removedFiles ?? 0,
		removedEntries: params.removedEntries ?? 0,
		freedBytes: Math.max(0, params.totalBytesBefore - totalBytesAfter),
		maxBytes: params.maxBytes,
		highWaterBytes: params.highWaterBytes,
		overBudget: params.totalBytesBefore > params.maxBytes,
		...params.deferred ? {
			deferredReason: "checkpoint-incomplete",
			...params.deferred
		} : {}
	};
}
const PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 18e5;
const FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 6e4;
const budgetKickStateByStore = /* @__PURE__ */ new Map();
onSqliteWalCheckpoint(({ databasePath, health, observedAtNs }) => {
	if (health.state !== "complete") return;
	for (const state of budgetKickStateByStore.values()) if (state.checkpointBlocked?.databasePath === databasePath && (!state.checkpointBlocked.checkpoint || observedAtNs >= state.checkpointBlocked.checkpoint.observedAtNs)) {
		state.checkpointBlocked = void 0;
		state.blockedUntil = void 0;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
	}
});
function deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint) {
	const state = getBudgetKickState(params.storePath, params.maintenance);
	state.checkpointBlocked = {
		databasePath: sqliteReaderDatabasePathKey(databasePath),
		checkpoint
	};
}
function getBudgetKickState(storePath, budget) {
	let state = budgetKickStateByStore.get(storePath);
	if (!state) {
		state = {
			budget,
			lastCheckAt: -Infinity,
			lastForcedCheckAt: -Infinity,
			running: false
		};
		budgetKickStateByStore.set(storePath, state);
	} else if (state.budget.maxDiskBytes !== budget.maxDiskBytes || state.budget.highWaterBytes !== budget.highWaterBytes || state.budget.preserveRecentMs !== budget.preserveRecentMs) {
		state.budget = budget;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
		state.blockedUntil = void 0;
	}
	return state;
}
function recordPhysicalBudgetOutcome(params, result) {
	if (params.mode !== "enforce" || !result) return;
	const state = getBudgetKickState(params.storePath, params.maintenance);
	if (result.deferredReason) {
		if (state.checkpointBlocked?.warned) return;
		if (state.checkpointBlocked) state.checkpointBlocked.warned = true;
		log$1.warn("session history disk budget deferred until a completed WAL checkpoint is observed", {
			storePath: params.storePath,
			reason: result.deferredReason,
			totalBytesBefore: result.totalBytesBefore,
			totalBytesAfter: result.totalBytesAfter,
			walBytesBefore: result.walBytesBefore,
			walBytesAfter: result.walBytesAfter,
			checkpoint: result.checkpoint
		});
		return;
	}
	if (result.totalBytesAfter <= result.maxBytes) {
		state.blockedUntil = void 0;
		return;
	}
	const alreadyBlocked = state.blockedUntil !== void 0;
	state.blockedUntil = Date.now() + PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	if (!alreadyBlocked) log$1.warn("session history disk budget remains exceeded after cleanup; retained data is protected or could not be reclaimed. Raise session.maintenance.maxDiskBytes or export and delete unneeded sessions; automatic checks resume on activity after 30 minutes", {
		storePath: params.storePath,
		totalBytes: result.totalBytesAfter,
		maxBytes: result.maxBytes,
		highWaterBytes: result.highWaterBytes,
		nextCheckAt: state.blockedUntil
	});
}
//#endregion
//#region src/config/sessions/session-history-entry-eviction.runtime.ts
async function deleteDiskBudgetArchivedSessionEntry(params, resolved) {
	const { deleteDiskBudgetSessionEntryLifecycle } = await import("./session-accessor.sqlite-lifecycle-BIcW8CI3.js");
	return await deleteDiskBudgetSessionEntryLifecycle(params, resolved);
}
//#endregion
//#region src/config/sessions/session-history-eviction-candidates.ts
const DISK_EVICTABLE_ARCHIVE_BATCH_SIZE = 64;
function readDiskEvictableArchivedSessionBatch(params) {
	const limit = Math.max(1, params.limit ?? DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
	const candidates = [];
	let cursor = params.after;
	while (candidates.length < limit) {
		const database = openAssistantAgentDatabase(params.databaseOptions);
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select([
			"archived_at",
			"current_session_id",
			"entry_json",
			"session_key",
			"updated_at"
		]).where("archived_at", "is not", null).orderBy("archived_at", "asc").orderBy("session_key", "asc").limit(DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
		if (cursor) {
			const after = cursor;
			query = query.where((eb) => eb.or([eb("archived_at", ">", after.archivedAt), eb.and([eb("archived_at", "=", after.archivedAt), eb("session_key", ">", after.sessionKey)])]));
		}
		const rows = executeSqliteQuerySync(database.db, query).rows;
		let scanned = 0;
		for (const row of rows) {
			scanned += 1;
			if (row.archived_at == null) continue;
			cursor = {
				archivedAt: row.archived_at,
				sessionKey: row.session_key
			};
			const entry = parseSessionEntryJson(row);
			if (entry && isSessionEntryDiskBudgetEvictable({
				key: row.session_key,
				entry,
				preserveRecentMs: params.preserveRecentMs
			})) {
				candidates.push({
					archivedAt: row.archived_at,
					entry,
					sessionKey: row.session_key
				});
				if (candidates.length >= limit) break;
			}
		}
		const exhausted = rows.length < DISK_EVICTABLE_ARCHIVE_BATCH_SIZE && scanned === rows.length;
		if (candidates.length >= limit || exhausted) return {
			candidates,
			...cursor ? { cursor } : {},
			exhausted
		};
	}
	return {
		candidates,
		...cursor ? { cursor } : {},
		exhausted: false
	};
}
//#endregion
//#region src/config/sessions/session-history-eviction.ts
/** Reports the same physical total enforce mode compares, without projecting logical row bytes. */
async function inspectSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.TESTCLAW_STATE_DIR = resolveStateDir(params.env);
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return {
		diskBudget: null,
		wouldMutate: false
	};
	const usage = await measureSessionPhysicalDiskUsage(params.storePath);
	const diskBudget = createPhysicalBudgetResult({
		totalBytesBefore: usage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	if (!diskBudget.overBudget || params.mode !== "enforce") return {
		diskBudget,
		wouldMutate: false
	};
	const blocked = budgetKickStateByStore.get(params.storePath)?.checkpointBlocked;
	if (blocked) return {
		diskBudget: {
			...diskBudget,
			deferredReason: "checkpoint-incomplete",
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: usage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		},
		wouldMutate: false
	};
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (await hasCanonicalSessionTranscriptArchives(databaseOptions) || await hasRetainedSessionTranscriptArchives(params.storePath)) return {
		diskBudget,
		wouldMutate: true
	};
	const candidates = readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		storePath: params.storePath
	});
	const archivedCandidates = readDiskEvictableArchivedSessionBatch({
		databaseOptions,
		limit: 1,
		preserveRecentMs: params.maintenance.preserveRecentMs
	});
	return {
		diskBudget,
		wouldMutate: candidates.length > 0 || archivedCandidates.candidates.length > 0
	};
}
function collectProtectedHistoricalSessionIds(params) {
	const protectedSessionIds = readReferencedSessionIds(params.database, void 0, void 0, params);
	for (const sessionId of collectAdmissionProtectedSessionIds(params)) protectedSessionIds.add(sessionId);
	return protectedSessionIds;
}
function collectCandidateAdditionalProtection(params) {
	const protectedSessionIds = collectAdmissionProtectedSessionIds(params);
	if (isRecentHistoricalSessionId(params)) protectedSessionIds.add(params.sessionId);
	return protectedSessionIds;
}
/** Session ids owned by in-flight work admissions, without live-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	const protectedSessionIds = /* @__PURE__ */ new Set();
	const admissionIdentities = collectActiveSessionWorkAdmissions().get(params.storePath) ?? /* @__PURE__ */ new Set();
	if (admissionIdentities.size === 0) return protectedSessionIds;
	for (const identity of admissionIdentities) protectedSessionIds.add(identity);
	const normalizedAdmissionKeys = new Set([...admissionIdentities].map((identity) => normalizeStoreSessionKey(identity)));
	const db = getSessionKysely(params.database.db);
	const admittedKeyBytes = [];
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["session_key", db.fn("hex", ["session_key"]).as("key_bytes")]))) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) admittedKeyBytes.push(row.key_bytes);
	const rows = admittedKeyBytes.length ? iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["entry_json", "current_session_id"]).where("session_key", "in", db.selectFrom("session_nodes").select("session_key").where(db.fn("hex", ["session_key"]), "in", sqliteStringSet(admittedKeyBytes)))) : [];
	for (const row of rows) {
		protectedSessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (entry) for (const sessionId of collectSessionStateIdsForEntry(entry)) protectedSessionIds.add(sessionId);
	}
	const generationRows = iterateSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select(["session_id", "session_key"]));
	for (const row of generationRows) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) protectedSessionIds.add(row.session_id);
	return protectedSessionIds;
}
function readHistoricalSessionIds(params) {
	const database = openAssistantAgentDatabase(params.databaseOptions);
	const scope = {
		...params,
		database
	};
	const protectedSessionIds = collectProtectedHistoricalSessionIds(scope);
	for (const sessionId of collectRecentSessionHistoryIds(scope)) protectedSessionIds.add(sessionId);
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc")).rows.flatMap((row) => protectedSessionIds.has(row.session_id) ? [] : [row.session_id]);
}
const log = createSubsystemLogger("sessions/history-eviction");
/** Fire-and-forget budget pass from the ordinary entry-write maintenance seam. */
function kickSessionHistoryDiskBudgetMaintenance(input) {
	if (input.agentId && isIncognitoAssistantAgentSqlitePath(input.storePath, {
		agentId: input.agentId,
		env: input.env
	})) return;
	const maintenance = input.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode !== "enforce" || maintenance.maxDiskBytes == null || maintenance.highWaterBytes == null) return;
	const now = input.now ?? Date.now();
	const state = getBudgetKickState(input.storePath, maintenance);
	if (state.checkpointBlocked) return;
	if (state.running) {
		if (input.force) {
			const env = { ...input.env ?? process.env };
			env.TESTCLAW_STATE_DIR = resolveStateDir(env);
			state.pendingForce = {
				...input,
				env,
				maintenanceConfig: maintenance,
				now: void 0
			};
		}
		return;
	}
	const interval = input.force ? FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS : PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	const lastCheckAt = input.force ? state.lastForcedCheckAt : state.lastCheckAt;
	if (now < (state.blockedUntil ?? -Infinity) || now - lastCheckAt < interval) return;
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.TESTCLAW_STATE_DIR = resolveStateDir(params.env);
	state.lastCheckAt = now;
	if (input.force) state.lastForcedCheckAt = now;
	state.running = true;
	budgetKickStateByStore.set(params.storePath, state);
	enforceSqliteSessionHistoryDiskBudget({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath,
		mode: maintenance.mode,
		maintenance
	}).catch((error) => {
		log.warn("session history disk-budget sweep failed; retrying on next kick", {
			error,
			storePath: params.storePath
		});
	}).finally(() => {
		state.running = false;
		if (state.pendingForce) {
			const pending = state.pendingForce;
			state.pendingForce = void 0;
			kickSessionHistoryDiskBudgetMaintenance(pending);
		}
	});
}
const SESSION_HISTORY_MAINTENANCE_QUEUES = /* @__PURE__ */ new Map();
/** Extracts historical sessions durably before reclaiming their SQLite rows. */
async function enforceSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.TESTCLAW_STATE_DIR = resolveStateDir(params.env);
	return await runQueuedStoreWrite({
		queues: SESSION_HISTORY_MAINTENANCE_QUEUES,
		storePath: params.storePath,
		label: "enforceSqliteSessionHistoryDiskBudget",
		fn: async () => {
			const result = await enforceSessionHistoryMaintenanceSerialized(params);
			recordPhysicalBudgetOutcome(params, result);
			return result;
		}
	});
}
async function enforceSessionHistoryMaintenanceSerialized(params) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return null;
	const initialUsage = await measureSessionPhysicalDiskUsage(params.storePath);
	const blocked = getBudgetKickState(params.storePath, params.maintenance).checkpointBlocked;
	if (blocked && params.mode === "enforce") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		deferred: {
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: initialUsage.databaseWalBytes
		}
	});
	if (initialUsage.totalBytes <= maxDiskBytes || params.mode === "warn") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	return await withSqliteTranscriptArchiveSession(toDatabaseOptions(resolved), () => enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes));
}
async function enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes) {
	const databaseOptions = toDatabaseOptions(resolved);
	const databasePath = resolveAssistantAgentSqlitePath(databaseOptions);
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
	const pruneArchives = (trigger) => {
		return pruneAllSessionTranscriptArchivesToHighWater({
			archiveDirectory,
			databaseOptions,
			diagnostics: { trigger },
			highWaterBytes,
			storePath: params.storePath,
			onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
		});
	};
	let pruning = await pruneArchives("initial");
	let { usage, removedFiles } = pruning;
	let removedEntries = 0;
	const finish = () => createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		totalBytesAfter: usage.totalBytes,
		removedEntries,
		removedFiles,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		...pruning.checkpointIncomplete ? { deferred: {
			checkpoint: pruning.checkpoint,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		} } : {}
	});
	if (pruning.checkpointIncomplete) return finish();
	const candidates = usage.totalBytes > highWaterBytes ? readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		storePath: params.storePath
	}) : [];
	for (const sessionId of candidates) {
		if (usage.totalBytes <= highWaterBytes) break;
		const eviction = await runExclusiveSessionLifecycleMutation({
			scope: params.storePath,
			identities: [sessionId],
			run: async () => {
				const plan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
					const protectedBeforeArchive = collectCandidateAdditionalProtection({
						database,
						preserveRecentMs: params.maintenance.preserveRecentMs,
						sessionId,
						storePath: params.storePath
					});
					for (const referenced of readReferencedSessionIds(database, void 0, [sessionId], params.maintenance)) protectedBeforeArchive.add(referenced);
					return planSessionStateDeleteIfUnreferenced({
						archiveDirectory,
						archiveTranscript: true,
						database,
						reason: "deleted",
						referencedSessionIds: protectedBeforeArchive,
						sessionId
					});
				}), "session.history.eviction-prepare");
				if (!plan) return null;
				return await runExclusiveSqliteSessionReclamation(async () => {
					const materialized = await materializeSessionStateDeletePlans([plan]);
					const diagnostics = {};
					const reclamationPlan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
						const protectedSessionIds = collectCandidateAdditionalProtection({
							database,
							preserveRecentMs: params.maintenance.preserveRecentMs,
							sessionId,
							storePath: params.storePath
						});
						if (protectedSessionIds.has(sessionId)) return null;
						return createHistoryEvictionReclamationPlan({
							databaseOptions,
							diskBudget: { preserveRecentMs: params.maintenance.preserveRecentMs },
							materializedPlans: materialized,
							protectedSessionIds,
							sessionId
						});
					}), "session.history.reclamation-plan", diagnostics);
					if (!reclamationPlan) return null;
					const reclaimed = await runSqliteSessionReclamation({
						diagnostics,
						forceInProcess: params.reclamationMode === "in-process",
						plan: reclamationPlan
					});
					if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
					if (!reclaimed.value.deleted) return null;
					return { archivedTranscripts: reclaimed.value.archivedTranscripts };
				});
			}
		});
		if (!eviction) {
			usage = await measureSessionPhysicalDiskUsage(params.storePath);
			continue;
		}
		const publishedArchives = await publishSessionStateArchives(resolved, eviction.archivedTranscripts);
		removedEntries += 1;
		emitArchivedTranscriptUpdates(publishedArchives);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
		if (usage.totalBytes > highWaterBytes) {
			const repruned = await pruneArchives("after-eviction");
			pruning = repruned;
			removedFiles += repruned.removedFiles;
			usage = repruned.usage;
			if (repruned.checkpointIncomplete) return finish();
		}
	}
	if (usage.totalBytes > highWaterBytes) {
		const finalPrune = await pruneArchives("final");
		pruning = finalPrune;
		removedFiles += finalPrune.removedFiles;
		usage = finalPrune.usage;
		if (finalPrune.checkpointIncomplete) return finish();
	}
	if (usage.totalBytes > highWaterBytes) {
		let after;
		while (usage.totalBytes > highWaterBytes) {
			const batch = readDiskEvictableArchivedSessionBatch({
				...after ? { after } : {},
				databaseOptions,
				preserveRecentMs: params.maintenance.preserveRecentMs
			});
			if (batch.candidates.length === 0) break;
			after = batch.cursor;
			for (const candidate of batch.candidates) {
				if (usage.totalBytes <= highWaterBytes) break;
				if (!(await runExclusiveSessionLifecycleMutation({
					scope: params.storePath,
					identities: [candidate.sessionKey, candidate.entry.sessionId],
					run: async () => await deleteDiskBudgetArchivedSessionEntry({
						...params.agentId ? { agentId: params.agentId } : {},
						archiveTranscript: false,
						deleteDeliveryArtifacts: true,
						deleteTranscriptWithoutArchive: true,
						expectedEntry: candidate.entry,
						expectedSessionId: candidate.entry.sessionId,
						storePath: params.storePath,
						target: {
							canonicalKey: candidate.sessionKey,
							storeKeys: [candidate.sessionKey]
						}
					}, resolved)
				})).deleted) {
					usage = await measureSessionPhysicalDiskUsage(params.storePath);
					continue;
				}
				removedEntries += 1;
				const pageDiagnostics = { trigger: "after-eviction" };
				const checkpointCompleted = await withSqliteSessionPageReclamation(databaseOptions, async (reclaimPages, assertCurrent, preparedOptions) => {
					try {
						return await reclaimSqliteFreePages(preparedOptions, pageDiagnostics, {
							reclaimPages,
							assertCurrent,
							onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
						});
					} catch {
						assertCurrent();
						return true;
					}
				});
				usage = await measureSessionPhysicalDiskUsage(params.storePath);
				if (!checkpointCompleted) {
					pruning = {
						usage,
						removedFiles: 0,
						completed: false,
						checkpointIncomplete: pageDiagnostics.checkpointIncomplete ?? 1,
						checkpoint: pageDiagnostics.checkpoint
					};
					return finish();
				}
			}
			if (batch.exhausted) break;
		}
	}
	if (removedEntries > 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, removedEntries);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return finish();
}
//#endregion
export { prepareLifecycleIdentityPublication as C, prepareCommittedSessionEntryRemovals as S, publishCommittedSessionIdentity as T, runSqliteSessionReclamation as _, reclaimSqliteFreePages as a, canSkipSessionEntryMaintenanceInDatabase as b, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as c, createLifecycleArtifactReclamationPlan as d, createSessionEntryReclamationPlan as f, runExclusiveSqliteSessionReclamation as g, readValidatedSessionDeletionTarget as h, kickSessionHistoryDiskBudgetMaintenance as i, refreshSqliteSessionPlannerStatisticsBestEffort as l, prepareHistoricalGenerationDeletions as m, enforceSqliteSessionHistoryDiskBudget as n, withSqliteSessionPageReclamation as o, createSessionMaintenancePlanningOperation as p, inspectSqliteSessionHistoryDiskBudget as r, applySessionEntryMaintenance as s, collectAdmissionProtectedSessionIds as t, createHistoricalGenerationReclamationPlan as u, shouldDeleteSqliteSessionEntryLifecycle as v, prepareSessionIdentityPublication as w, emptySessionEntryMaintenancePlan as x, applySessionEntryMaintenanceInDatabase as y };
