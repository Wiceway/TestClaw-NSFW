import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import { r as getChildLogger } from "./logger-Cnti88IN.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { o as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-BYUk2TxG.mjs";
import { d as publishSqliteWalCheckpointObservation, u as onSqliteWalCheckpoint } from "./sqlite-wal-36gEREe5.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-DAdiee0a.mjs";
import { a as runQueuedStoreWrite } from "./testclaw-agent-write-admission-D_VtLORb.mjs";
import { n as supportsAssistantAgentDatabaseExecution, t as captureAssistantAgentDatabaseExecution } from "./testclaw-agent-execution-DcgJclkA.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-FtNy8CfS.mjs";
import { a as getSessionKysely, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, u as resolveSqliteScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DgteG5a_.mjs";
import { K as hasPreparedNativeSessionDeletion, X as withSqliteSessionDeletions } from "./session-accessor.sqlite-entry-store-Ct1v5fIu.mjs";
import { g as runExclusiveSessionLifecycleMutation, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-8OlXMJli.mjs";
import { c as normalizeResolvedMaintenanceConfigInput, s as isSessionEntryDiskBudgetEvictable } from "./store-maintenance-BULqjr93.mjs";
import { i as isRecentHistoricalSessionId, n as collectRecentSessionHistoryIds, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-1Q7GsvTs.mjs";
import { c as withSqliteMutationWorkerLifetime, l as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans, o as runSqliteTranscriptArchiveWorkerOperation, r as runExclusiveSqliteTranscriptArchiveWorker } from "./session-accessor.sqlite-archive-FJzUmscm.mjs";
import { h as emitArchivedTranscriptUpdates, l as readReferencedSessionIds, m as publishSessionStateArchives, s as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-lifecycle-state-wgApFYeY.mjs";
import { i as readSessionTranscriptJsonlBytesInDatabase, r as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-2RyZJSfV.mjs";
import { a as createSessionMaintenanceFinalizationOperation, d as resolveSessionReclamationDatabaseOptions, f as runExclusiveSqliteSessionReclamation, n as createHistoryEvictionReclamationPlan, p as runSqliteSessionReclamation, s as createSessionMaintenanceStatisticsOperation } from "./session-accessor.sqlite-reclamation-CHkbJGoY.mjs";
import { c as measureSessionPhysicalDiskUsage, l as resolveMaintenanceConfig, n as hasRetainedSessionTranscriptArchives, o as observeSessionArchivePruning, r as pruneSessionTranscriptArchivesToHighWater, s as timeArchivePruningAsync, u as captureSessionMaintenancePreservation } from "./disk-budget-t8-7rutO.mjs";
import fs from "node:fs";
import path from "node:path";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
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
		const { cleanUpAutomaticallyArchivedWorktrees } = await import("./session-worktree-lifecycle-CY1wEjTr.mjs");
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
		const { readSessionArchivePruningInDatabase } = await import("./session-history-archive-pruning.worker-hmyCtdnE.mjs");
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
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-BAoz2J15.mjs");
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
			const { readSessionArchivePruningInDatabase, deletePublishedSessionArchiveInDatabase, removeLegacySessionArchiveInDatabase } = await import("./session-history-archive-pruning.worker-hmyCtdnE.mjs");
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
			const [{ withSessionHistoryWorkerDatabase }, { maintenanceLane }] = await Promise.all([import("./session-transcript-worker-runtime-BAoz2J15.mjs"), import("./session-transcript-worker-resources-DDpSzlXx.mjs")]);
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
	const { deleteDiskBudgetSessionEntryLifecycle } = await import("./session-accessor.sqlite-lifecycle-C9iy-LlV.mjs");
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
export { reclaimSqliteFreePages as a, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as c, kickSessionHistoryDiskBudgetMaintenance as i, refreshSqliteSessionPlannerStatisticsBestEffort as l, enforceSqliteSessionHistoryDiskBudget as n, withSqliteSessionPageReclamation as o, inspectSqliteSessionHistoryDiskBudget as r, applySessionEntryMaintenance as s, collectAdmissionProtectedSessionIds as t };
