import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./src-D9uQ497Z.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as asDateTimestampMs, m as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-0M4tZV2c.js";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { a as runInDetachedAsyncContext } from "./async-work-scope-Botgjsbr.js";
import { n as isAbortError, r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.js";
import { c as resolveAgentIdFromSessionKey, k as parseAgentSessionKey, s as normalizeOptionalAgentId, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as sha256Base64Url } from "./crypto-digest-BPwjfEnk.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { Gt as cronQuietTriggerTaskDetail, Jt as cronTaskRecordStoreKey, Kt as cronRunLogEntryToTaskDetail, Xt as cronTaskRecordToScriptRunResult, Yt as cronTaskRecordToRunLogEntry, Zt as cronTaskRecordToTriggerEval, fn as resolveAdmittedCronCompletionStatus, ft as TESTCLAW_STATE_SCHEMA_SQL, pn as resolveCronCompletionStatus, qt as cronRunStatusToTaskStatus, t as executeExistingAssistantStateRead, tn as resolveCronTaskRecordTimestamp } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import { C as runWithGatewayIndependentRootWorkContinuation, r as beginGatewayRootWorkAdmissionWhenOpen, t as GatewayDrainingError } from "./gateway-work-admission-DJ5CkZgB.js";
import { l as resolveMaintenanceConfig } from "./disk-budget-BOamfkPB.js";
import { r as readExpiredCronRunEntriesInWorker } from "./session-accessor-DMf92PxK.js";
import { S as applySessionEntryLifecycleMutation } from "./session-accessor.reset-Cl1Mir1u.js";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BE5EAdRS.js";
import { n as executionOwnerBindingFromAdmission, r as isRetainedExecutionOwnerBinding, t as createExecutionStartedOwnerBinding } from "./execution-owner-binding-spQL-oQK.js";
import "./system-events-BUr4KJmI.js";
import { a as listTaskRecordsByRuntimeSourceIdInDatabase } from "./task-registry.store.kernel-Bnd9Ls7p.js";
import { t as bindTaskFlowExecution } from "./task-flow-registry.store.sqlite-DCqJxfzY.js";
import { t as bindTaskRunExecution } from "./task-registry.store.sqlite-tpQTiwLa.js";
import { c as hasDescendantRunAwaitingSettle } from "./subagent-registry-read-DD46xgBs.js";
import { v as CRON_TASK_KIND } from "./task-registry-lFPM6OHy.js";
import { c as finalizeTaskRunById, f as recordTaskRunProgressByRunIdCore, l as finalizeTaskRunByRunIdCore, o as createRunningTaskRunCore, u as findTaskByRunId } from "./task-executor-DtuHr87Y.js";
import { t as buildPendingGeneratedMediaSessionKeySet } from "./task-status-access-saQ8mgsA.js";
import { n as AgentDeletionCommitUncertainError, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-BHA6mh5y.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { _ as cronSchedulingInputsEqual, a as loadCronRows, m as upsertCronJobRow, n as deleteCronJobRowInDatabase, o as loadedCronStoreFromRows, v as tryCronScheduleIdentity, y as normalizeCronJobIdentityFields } from "./row-codec-uVFeVvND.js";
import { a as createCronStreamSourceIdentity, i as appendCronPayloadText, n as normalizeCronJobInput, o as cronStreamScheduleKey } from "./normalize-7Cb8d2VO.js";
import "./normalize-CErIsKfn.js";
import { c as resolveCronToolsAllowExecTargetRecoveryError } from "./scheduled-tool-policy-CQE6r880.js";
import { t as parseAbsoluteTimeMs } from "./parse-CUOktP0M.js";
import { i as resolveCronAuthenticatedChannelRequester, r as resolveCronAuthenticatedCallerOrigin } from "./tools-allow-provenance-DohE6dbm.js";
import { a as resolveCronDeliverySessionKey, r as isInvalidCronSessionTargetIdError } from "./session-target-DJsUULzX.js";
import { n as getInvalidPersistedCronJobReason, t as assertCronJobStateTimestamps } from "./persisted-shape-B1W205jS.js";
import { n as resolvePacedNextRunAtMs } from "./pacing-BFMWlVUa.js";
import { t as materializeLegacyDefaultCronJobOwners } from "./legacy-default-agent-owner-migration-DPueBeYw.js";
import { C as requestActiveCronJobCancellation, S as onCronJobInactive, _ as noteActiveCronJobMessageActionAuthorityMutation, b as noteActiveCronJobScheduleMutation, d as isCronActiveJobMarkerCurrent, f as isCronJobActive, g as markCronJobWaitingForHeartbeat, h as markCronJobActive, n as bindCronJobAdmittedRun, o as clearCronJobActive, p as isCronSelfRemovalCurrent, v as noteActiveCronJobMessageSourceAuthorityMutation, x as noteActiveCronJobTriggerMutation, y as noteActiveCronJobRemoval } from "./active-jobs-DhbrbXjH.js";
import { t as computeNextRunAtMs } from "./schedule-BBo1-jUf.js";
import { B as findActiveCronRunReceiptInDatabase, C as hasPendingCronTriggerInterval, D as autoDisableCronJob, E as retainManualOneShotOccurrence, F as assertCronRunReceiptCurrent, G as prepareCronRunReceiptAdjudication, H as finishCronRunReceiptInDatabase, I as assertCronRunReceiptCurrentInDatabase, J as releaseLocalCronRunReceiptOwnership, K as prepareCronRunReceiptClaim, L as assertCronRunReceiptOwnedInDatabase, M as CronRunReceiptRevisionError, N as activateCronRunReceiptInDatabase, O as maybeAutoDisableCronJobAfterRunFailure, P as adjudicateActiveCronRunReceiptInDatabase, R as claimCronRunReceiptInDatabase, S as summarizeCronJobSchedule, T as resolveManualOneShotOccurrenceAtMs, U as isCronRunReceiptOwnerStale, V as finishCronRunReceipt, W as isCronRunReceiptSettlementPending, X as describeUnavailableCronAgent, Y as trackCronRunReceiptSettlement, _ as recordScheduleComputeError, a as findJobOrThrow, b as resolveJobLastRunStatus, c as isJobDue, d as isTimeScheduledJob, f as needsCronTimerMaintenance, g as recomputeNextRunsForMaintenance, h as recomputeJobNextRunAtMs, i as errorBackoffMs, j as CronRunReceiptConflictError, l as isJobEnabled, n as computeJobNextRunAtMs, o as hasActiveCronRun, p as nextWakeAtMs, q as readCronRunReceiptCurrentJob, r as computeJobPreviousRunAtOrBeforeMs, s as hasScheduledNextRunAtMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, u as isStaleFutureCronSlot, w as resolveForcePreservedOneShotAtMs, x as resolveJobPayloadTextForMain, y as resolveJobErrorBackoffUntilMs, z as exactCronRunReceiptMatches } from "./jobs-scheduling-B5crY5k5.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-2vhyQrsJ.js";
import { a as systemOwnedDeclarationKeyNamespace, i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.js";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.js";
import { i as registerPendingCronSessionCleanup, r as locked, t as getPendingCronSessionCleanup } from "./locked-CTT1IBs7.js";
import { i as withCronMutationCommitHook, n as captureCronRunAdmissionTracker } from "./mutation-completion-VgHvK3W-.js";
import { a as normalizeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, o as summarizeCronRunDiagnostics } from "./run-diagnostics-CxdmZjJj.js";
import { a as preExecutionTimeoutErrorMessage, c as timeoutErrorMessage, i as normalizeCronRunErrorText, r as isSetupTimeoutErrorText, s as setupTimeoutErrorMessage, t as abortErrorMessage } from "./execution-errors-CAi_5P6z.js";
import { n as resolveCronJobEffectiveAgentId, r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-Bmn3FVPG.js";
import { S as repairCronRuntimeAuthorityRows, a as loadCronJobsStoreWithConfigJobs, d as saveCronJobsStoreChangesWithRevisionNative, m as saveCronJobsStoreWithRevisionNative, n as getCronJobsStoreRevision, o as noteCronJobsStoreCommit, p as saveCronJobsStoreWithRevision, s as removeStaleCronJobFamilyRows, u as saveCronJobsStoreChangesWithRevision, x as loadCronRuntimeAuthorities } from "./store-DmG8kbi1.js";
import { t as toPublicCronJob } from "./public-job-C0Jx9vVK.js";
import { o as writeCronJobScratch, r as readCronJobScratchState, t as deleteCronJobScratch } from "./scratch-store-DlkCwcOU.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-drfVuwaU.js";
import { c as failureNotificationDeliveryFromJobState, d as maybeEmitFailureRecovery, f as resolveFailureAlert, g as resolveConfiguredChannelsForValidation, h as cronPatchTouchesDeliveryResolution, i as declarativeFields, l as finalizeCronFailureNotifications, m as assertTimeScheduleSatisfiable, n as applyJobPatch, o as normalizeCronTaskRunJobId, p as assertSupportedJobSpec, r as createJob, t as applyDeclarativeJobSpec, u as maybeEmitFailureAlert } from "./jobs-D3058b1O.js";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.js";
import { t as resolveCronRunErrorReason } from "./run-error-reason-DNLAHB_J.js";
import { a as reconcileRuntimeAuthority, c as resolveCronJobMessageToolAuthorityInputs, i as reconcileCronChannelRequesterAuthority, n as cronJobMessageActionAuthorityInputsEqual, r as cronJobMessageToolAuthorityInputsEqual, s as resolveCronJobMessageActionAuthorityInputs, t as consumeRuntimeAuthorityMutationOptions } from "./jobs-tool-policy-CMdT4WwT.js";
import { i as registerActiveCronTaskRun, o as trackActiveCronTaskRunSettlement } from "./active-run-cancellation-CX3A7Ug0.js";
import { n as isHeartbeatTaskCronJob } from "./heartbeat-task-COuIxTk1.js";
import { n as deleteCronSessionViaGateway } from "./session-cleanup-BF26KEyq.js";
import { t as resolveCronAgentSessionKey } from "./session-key-D3GhyJ-X.js";
import { c as retainGatewayDeviceRevocation } from "./device-revocation-BGfJjW3h.js";
import { r as enqueueCommandInLane } from "./command-queue-BKEY7Dlw.js";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { MessagePort, isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import { deserialize } from "node:v8";
import pMap, { pMapSkip } from "p-map";
//#region src/cron/service/foreign-receipt-monitor.ts
const CRON_FOREIGN_RECEIPT_RECHECK_MS = 2e3;
const monitors = /* @__PURE__ */ new WeakMap();
function monitor(state) {
	let current = monitors.get(state);
	if (!current) {
		current = {
			byJobId: /* @__PURE__ */ new Map(),
			waiters: /* @__PURE__ */ new Map(),
			timer: null
		};
		monitors.set(state, current);
	}
	return current;
}
function arm(state) {
	const current = monitor(state);
	const reconcile = current.reconcile;
	if (state.stopped || current.timer || current.byJobId.size === 0 || !reconcile) return;
	current.timer = setTimeout(() => {
		runInDetachedAsyncContext(() => {
			current.timer = null;
			(state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(reconcile) : reconcile()).catch((error) => {
				state.deps.log.warn({ err: String(error) }, "cron: foreign receipt reconciliation failed");
			}).finally(() => arm(state));
		});
	}, CRON_FOREIGN_RECEIPT_RECHECK_MS);
	current.timer.unref?.();
}
function configureForeignReceiptMonitor(state, reconcile) {
	monitor(state).reconcile = reconcile;
	arm(state);
}
function enrollForeignReceipt(state, receipt) {
	monitor(state).byJobId.set(receipt.jobId, receipt);
	arm(state);
}
function listForeignReceipts(state) {
	return [...monitor(state).byJobId.values()].toSorted((left, right) => left.jobId.localeCompare(right.jobId));
}
function waitForForeignReceipt(state, jobId, signal) {
	if (state.stopped || signal.aborted) return Promise.resolve(false);
	const current = monitor(state);
	if (!current.byJobId.has(jobId)) return Promise.resolve(true);
	return new Promise((resolve) => {
		const waiters = current.waiters.get(jobId) ?? /* @__PURE__ */ new Set();
		const finish = (settled) => {
			signal.removeEventListener("abort", abort);
			waiters.delete(finish);
			if (waiters.size === 0) current.waiters.delete(jobId);
			resolve(settled);
		};
		const abort = () => finish(false);
		waiters.add(finish);
		current.waiters.set(jobId, waiters);
		signal.addEventListener("abort", abort, { once: true });
		if (signal.aborted) abort();
	});
}
function removeForeignReceipt(state, jobId) {
	const current = monitor(state);
	current.byJobId.delete(jobId);
	for (const finish of current.waiters.get(jobId) ?? []) finish(true);
}
function stopForeignReceiptMonitor(state) {
	const current = monitor(state);
	if (current.timer) {
		clearTimeout(current.timer);
		current.timer = null;
	}
	current.byJobId.clear();
	current.reconcile = void 0;
	for (const waiters of current.waiters.values()) for (const finish of waiters) finish(false);
}
function resumeForeignReceiptMonitor(state) {
	arm(state);
}
//#endregion
//#region src/cron/service/run-admission-capacity.ts
function resolveRunConcurrency() {
	return 8;
}
function acquireCronRunSlot(state) {
	state.runAdmission.active += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		state.runAdmission.active -= 1;
		dispatchWaiters(state);
	};
}
function dispatchWaiters(state) {
	const admission = state.runAdmission;
	if (state.stopped) {
		cancelCronRunAdmissionWaiters(state);
		return;
	}
	const maxConcurrentRuns = resolveRunConcurrency();
	while (admission.active < maxConcurrentRuns) {
		const waiter = admission.waiters.shift();
		if (!waiter) break;
		waiter(acquireCronRunSlot(state));
	}
	if (admission.active < maxConcurrentRuns && admission.waiters.length === 0) {
		const listener = admission.capacityListener;
		admission.capacityListener = null;
		if (listener) queueMicrotask(listener);
	}
}
/**
* Acquire only the slots currently available to scheduled work. Unlike the
* waiter-based path used by direct runs, this never retains a timer batch while
* the pool is saturated.
*/
function tryAcquireCronRunSlots(state, requested) {
	if (state.stopped || requested <= 0 || state.runAdmission.waiters.length > 0) return [];
	const available = Math.max(0, resolveRunConcurrency() - state.runAdmission.active);
	return Array.from({ length: Math.min(requested, available) }, () => acquireCronRunSlot(state));
}
/** Keep the first wake-up until capacity release consumes or cancellation clears it. */
function setCronRunCapacityListener(state, listener) {
	state.runAdmission.capacityListener ??= listener;
}
async function acquireCronRunAdmission(state, signal) {
	const admission = state.runAdmission;
	if (state.stopped || signal?.aborted) return null;
	if (admission.waiters.length === 0 && admission.active < resolveRunConcurrency()) return acquireCronRunSlot(state);
	return await new Promise((resolve) => {
		const settle = (release) => {
			signal?.removeEventListener("abort", cancel);
			resolve(release);
		};
		const cancel = () => {
			const index = admission.waiters.indexOf(settle);
			if (index < 0) return;
			admission.waiters.splice(index, 1);
			settle(null);
			dispatchWaiters(state);
		};
		admission.waiters.push(settle);
		signal?.addEventListener("abort", cancel, { once: true });
		if (signal?.aborted) cancel();
	});
}
/** Wake queued work on stop so each caller can release its durable reservation. */
function cancelCronRunAdmissionWaiters(state) {
	state.runAdmission.capacityListener = null;
	const waiters = state.runAdmission.waiters.splice(0);
	for (const waiter of waiters) waiter(null);
}
/** Apply one service-level cap to every cron execution source. Queue waiters
* keep their job reservation, then recheck scheduler state before execution.
*/
async function runWithCronAdmission(state, execute, acquiredRelease, signal) {
	const release = acquiredRelease ?? await acquireCronRunAdmission(state, signal);
	if (!release) return { kind: "stopped" };
	try {
		return {
			kind: "admitted",
			value: await execute()
		};
	} finally {
		release();
	}
}
//#endregion
//#region src/cron/service/state.ts
/** Builds event context only when a closed notification fact exists. */
function cronFailureNotificationEventContext(failureNotificationDetail) {
	return failureNotificationDetail ? { failureNotificationDetail } : void 0;
}
/** Creates mutable cron service state with a concrete clock dependency. */
function createCronServiceState(deps) {
	const defaultAgentId = deps.defaultAgentId ?? (deps.resolveDefaultAgentId ? void 0 : "main");
	return {
		deps: {
			...deps,
			defaultAgentId,
			nowMs: deps.nowMs ?? (() => Date.now())
		},
		store: null,
		durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
		timer: null,
		running: false,
		activeTimerTicks: 0,
		stopped: false,
		lifecycleGeneration: 0,
		schedulingPaused: false,
		schedulerStarted: false,
		activeManualRunJobIds: /* @__PURE__ */ new Set(),
		manualSetupTimeoutNotified: false,
		runAdmission: {
			active: 0,
			waiters: [],
			capacityListener: null
		},
		queuedRunReservationsByJobId: /* @__PURE__ */ new Map(),
		op: Promise.resolve(),
		warnedDisabled: false,
		warnedInvalidPersistedJobKeys: /* @__PURE__ */ new Set(),
		pendingQuarantineConfigJobs: [],
		lastQuarantineFailureWarnKey: null,
		storeLoadedAtMs: null
	};
}
/** Dispatches a cron event without letting subscriber errors escape scheduler work. */
function emit(state, evt, context) {
	try {
		const publicEvent = evt.job ? {
			...evt,
			job: toPublicCronJob(evt.job)
		} : evt;
		if (context) state.deps.onEvent?.(publicEvent, context);
		else state.deps.onEvent?.(publicEvent);
	} catch {}
}
function isImmediateCronRunMode(mode) {
	return mode === "force" || mode === "if-enabled";
}
//#endregion
//#region src/cron/service/runtime-publication.ts
function durableNextRunsFromJobs(jobs) {
	return new Map(jobs.map((job) => [job.id, job.state.nextRunAtMs]));
}
function publishDurableNextRunChanges(params) {
	const previous = params.state.durableNextRunAtMsByJobId;
	const next = params.stateOnly ? new Map(previous) : durableNextRunsFromJobs(params.storeJobs);
	if (params.stateOnly) {
		const currentJobsById = new Map(params.storeJobs.map((job) => [job.id, job]));
		for (const jobId of previous.keys()) {
			const job = currentJobsById.get(jobId);
			if (job) next.set(jobId, job.state.nextRunAtMs);
		}
	}
	const changedJobs = params.storeJobs.filter((job) => {
		if (!previous.has(job.id) || !next.has(job.id)) return false;
		return previous.get(job.id) !== next.get(job.id);
	});
	params.state.durableNextRunAtMsByJobId = next;
	for (const job of changedJobs) {
		if (job.id === params.suppressScheduledJobId) continue;
		emit(params.state, {
			jobId: job.id,
			action: "scheduled",
			job,
			nextRunAtMs: job.state.nextRunAtMs
		});
	}
}
/** Publishes scheduled-row changes after a targeted runtime transaction commits. */
function publishCronRuntimeRows(state) {
	if (!state.store) return;
	publishDurableNextRunChanges({
		state,
		storeJobs: state.store.jobs,
		stateOnly: false
	});
}
//#endregion
//#region src/cron/service/runtime-store.ts
/** Applies committed target rows locally without copying any unrelated store snapshot. */
function applyCronRuntimeRowsToState(state, jobs, deletedJobIds = [], opts) {
	if (!state.store) return;
	const jobsById = new Map([...jobs].map((job) => [job.id, job]));
	const deleted = new Set(deletedJobIds);
	const residentJobIds = new Set(state.store.jobs.map((job) => job.id));
	const residentJobs = state.store.jobs.filter((job) => !deleted.has(job.id)).map((job) => jobsById.get(job.id) ?? job);
	const importedJobs = [...jobsById.values()].filter((job) => !residentJobIds.has(job.id) && !deleted.has(job.id));
	state.store.jobs = [...residentJobs, ...importedJobs];
	if (opts?.publish !== false) publishCronRuntimeRows(state);
}
/** Commits runtime-owned job rows from authoritative values read under SQLite's write lock. */
function commitCronRuntimeRows(params) {
	const storeKey = cronStoreKey(params.state.deps.storePath);
	const jobIds = new Set(params.jobIds);
	const committed = runAssistantStateWriteTransaction(({ db }) => {
		const rows = loadCronRows(db, storeKey, jobIds, { includeGrantDefinitionProjection: true });
		const rowsByJobId = new Map(rows.map((row) => [row.job_id, row]));
		const loadedJobs = loadedCronStoreFromRows(rows).store.jobs;
		const { repairJobIds } = loadCronRuntimeAuthorities({
			db,
			storeKey,
			jobs: loadedJobs
		});
		if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
			db,
			storeKey,
			jobs: loadedJobs,
			jobIds: repairJobIds
		});
		const jobs = new Map(loadedJobs.map((job) => [job.id, job]));
		const mutation = params.mutate({
			database: db,
			jobs
		});
		const upsertJobIds = [...new Set(mutation.upsertJobIds ?? [])].toSorted();
		const deleteJobIds = [...new Set(mutation.deleteJobIds ?? [])].toSorted();
		const runHooks = mutation.runHooks !== false;
		if (runHooks) params.transactionHooks?.beforeWrite?.(db);
		for (const jobId of deleteJobIds) deleteCronJobRowInDatabase(db, storeKey, jobId);
		for (const jobId of upsertJobIds) {
			const row = rowsByJobId.get(jobId);
			const job = jobs.get(jobId);
			if (row && job && !deleteJobIds.includes(jobId)) upsertCronJobRow(db, storeKey, job, row.sort_order, { knownExistingRow: row });
		}
		if (runHooks) params.transactionHooks?.afterWrite?.(db);
		return {
			changed: upsertJobIds.length > 0 || deleteJobIds.length > 0,
			runHooks,
			value: mutation.value
		};
	}, {}, { operationLabel: params.operationLabel });
	if (committed.runHooks) params.transactionHooks?.afterCommit?.();
	if (committed.changed) noteCronJobsStoreCommit(storeKey);
	return committed.value;
}
//#endregion
//#region src/cron/service/runtime-mutation.ts
/** One settlement owner serves typed cron mutations; callbacks and database handles stay local. */
async function runCronRuntimeMutation(params) {
	const nonce = randomUUID();
	let settlement;
	let native;
	let bytes;
	let published = false;
	const assertCurrent = () => {
		params.context.admission.assertCurrent();
		params.assertCurrent();
	};
	const publishCommitted = () => {
		const committed = native?.committed?.facts;
		if (published || !isRecord(committed) || committed.nonce !== nonce) return;
		if (!bytes) throw new Error("Committed cron mutation lost its retained outcome");
		const outcome = deserialize(bytes);
		published = true;
		bytes = void 0;
		params.publish(outcome);
	};
	try {
		await runAssistantStateWorkerOperation(params.context, async (scope) => {
			try {
				const command = {
					type: params.type,
					input: {
						...params.input,
						nonce
					}
				};
				if ((await scope.execute(command)).nonce !== nonce) throw new Error("Cron mutation returned a different operation nonce");
			} finally {
				await settlement;
				publishCommitted();
			}
		}, {
			assertCurrent,
			createAdmission(retained) {
				settlement = retained.settled;
				let phase = "transaction";
				let preparation;
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					const facts = request.facts;
					const port = isRecord(facts) && facts.preparationPort instanceof MessagePort ? facts.preparationPort : void 0;
					try {
						assertCurrent();
						if (!isRecord(facts) || facts.nonce !== nonce || request.stage !== phase) throw new Error("Cron mutation differs from its retained transaction owner");
						if (request.stage === "transaction") {
							if (!port) throw new Error("Cron mutation has no policy preparation port");
							preparation = params.prepare(facts.preparation);
							port.postMessage(preparation.value, []);
							phase = "commit";
						} else {
							if (!(facts.bytes instanceof Uint8Array) || !preparation) throw new Error("Cron mutation has no prepared outcome");
							preparation.assertCurrent();
							bytes = facts.bytes;
							phase = "settling";
						}
					} finally {
						port?.close();
					}
					if (!grant()) throw new Error("Cron mutation admission expired");
				});
				native = admission;
				return {
					nativeLocations: [params.context.admission.databasePath],
					admission
				};
			}
		});
		if (!published) throw new Error("Cron mutation did not publish a committed outcome");
	} finally {
		await settlement;
		publishCommitted();
		bytes = void 0;
	}
}
//#endregion
//#region src/cron/service/wake.ts
/** Manual cron wake helper for queueing system events into sessions. */
/** Keeps safety notices with their creator and limits failure routes to explicit origins. */
function enqueueCronNotification(state, job, text, kind) {
	const sessionKey = kind === "failure-alert" ? resolveCronDeliverySessionKey(job) : job.sessionKey;
	const agentId = normalizeOptionalAgentId(job.agentId) ?? normalizeOptionalAgentId(parseAgentSessionKey(sessionKey)?.agentId) ?? normalizeOptionalAgentId(state.deps.resolveDefaultAgentId?.()) ?? normalizeOptionalAgentId(state.deps.defaultAgentId);
	const deliveryContext = sessionKey || kind === "auto-disabled" && agentId ? state.deps.resolveOriginDeliveryContext?.({
		agentId,
		sessionKey
	}) : void 0;
	state.deps.enqueueSystemEvent(text, {
		agentId,
		sessionKey,
		contextKey: `cron:${job.id}:${kind}`,
		...deliveryContext ? { deliveryContext } : {}
	});
	if (kind === "auto-disabled" || job.wakeMode === "now" || sessionKey) state.deps.requestHeartbeat({
		source: "notifications-event",
		intent: "immediate",
		reason: "wake",
		agentId,
		sessionKey
	});
}
/** Enqueues a manual cron wake event and optionally pokes the targeted heartbeat loop. */
function wake(state, opts) {
	const text = opts.text.trim();
	if (!text) return { ok: false };
	const sessionKey = opts.sessionKey?.trim() || void 0;
	const agentId = opts.agentId?.trim() || void 0;
	if (sessionKey && isSubagentSessionKey(sessionKey)) return {
		ok: false,
		reason: "unwakeable-session-key"
	};
	const originDeliveryContext = sessionKey || agentId ? state.deps.resolveOriginDeliveryContext?.({
		sessionKey,
		agentId
	}) : void 0;
	const enqueueOpts = sessionKey || agentId ? {
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {},
		...originDeliveryContext ? { deliveryContext: originDeliveryContext } : {}
	} : void 0;
	state.deps.enqueueSystemEvent(text, enqueueOpts);
	if (opts.mode === "now" || sessionKey) state.deps.requestHeartbeat({
		source: "manual",
		intent: "immediate",
		reason: "wake",
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {}
	});
	return { ok: true };
}
//#endregion
//#region src/cron/service/notification-dispatch.ts
/** Sends committed cron notifications through the live host and records delivery. */
function dispatchCronNotification(state, notification) {
	if (notification.kind === "auto-disabled") enqueueCronNotification(state, notification.job, notification.text, notification.kind);
	else transportFailureAlert(state, notification);
}
const FAILURE_ALERT_ERROR_MAX_LENGTH = 1e3;
/** Writes one settled transport fact while the exact alert cycle still owns the row. */
async function recordFailureAlertOutcome(state, cycle, outcome) {
	let ownsCycle = false;
	try {
		return await locked(state, async () => {
			if (state.stopped || state.lifecycleGeneration !== cycle.lifecycleGeneration) return "stale";
			const context = captureAssistantStateWorkerContext();
			const storeKey = cronStoreKey(state.deps.storePath);
			let result = "stale";
			await runCronRuntimeMutation({
				context,
				type: "cron.recordFailureAlertOutcome",
				input: {
					storeKey,
					jobId: cycle.jobId,
					runAtMs: cycle.runAtMs,
					alertAtMs: cycle.alertAtMs,
					notificationId: cycle.notificationId,
					outcome: {
						...outcome,
						error: outcome.error ? truncateUtf16Safe(formatErrorMessage(outcome.error), FAILURE_ALERT_ERROR_MAX_LENGTH) : void 0
					}
				},
				assertCurrent() {
					if (state.stopped || state.lifecycleGeneration !== cycle.lifecycleGeneration) {
						ownsCycle = false;
						throw new Error("Cron failure-alert owner retired");
					}
				},
				prepare(facts) {
					ownsCycle = facts.ownsCycle;
					return {
						value: {},
						assertCurrent() {}
					};
				},
				publish(committed) {
					if (committed.job) {
						noteCronJobsStoreCommit(storeKey);
						applyCronRuntimeRowsToState(state, [committed.job], [], { publish: false });
						result = "recorded";
					}
				}
			});
			return result;
		});
	} catch (err) {
		state.deps.log.warn({
			jobId: cycle.jobId,
			err: formatErrorMessage(err)
		}, "cron: failed to record failure-alert outcome");
		return ownsCycle ? "persistence-failed" : "stale";
	}
}
function transportFailureAlert(state, params) {
	const jobId = params.job.id;
	const alertAtMs = params.job.state.lastFailureAlertAtMs;
	const lifecycleGeneration = state.lifecycleGeneration;
	const notificationId = params.job.state.lastFailureNotificationId;
	const runAtMs = params.job.state.lastRunAtMs;
	if (!state.deps.sendCronFailureAlert) {
		enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert");
		return;
	}
	state.deps.sendCronFailureAlert({
		job: params.job,
		payload: params.payload,
		runAtMs: params.runAtMs,
		channel: params.route.channel,
		to: params.route.to,
		mode: params.route.mode,
		accountId: params.route.accountId,
		threadId: params.route.threadId,
		...params.route.alternateRoute ? { inheritSessionThread: false } : {},
		onDeliverySettled: async (outcome) => {
			if (await recordFailureAlertOutcome(state, {
				jobId,
				alertAtMs,
				runAtMs,
				lifecycleGeneration,
				notificationId
			}, outcome) !== "stale" && outcome.status === "not-delivered") enqueueCronNotification(state, params.job, params.payload.text ?? "", "failure-alert");
		}
	}).catch((err) => {
		state.deps.log.warn({
			jobId: params.job.id,
			err: String(err)
		}, "cron: failure alert delivery failed");
	});
}
//#endregion
//#region src/cron/service/store.ts
/** Loads, normalizes, quarantines, and persists cron service store state. */
const loadedCronStoreRevisions = /* @__PURE__ */ new WeakMap();
function invalidateStaleNextRunOnScheduleChange(params) {
	const previousJob = params.previousJobsById.get(params.hydrated.id);
	if (!previousJob || cronSchedulingInputsEqual(previousJob, params.hydrated)) return;
	params.hydrated.state ??= {};
	params.hydrated.state.nextRunAtMs = void 0;
	params.hydrated.state.startupCatchupAtMs = void 0;
	params.hydrated.state.pacedNextRunAtMs = void 0;
	params.hydrated.state.forcePreservedNextRunAtMs = cronSchedulingInputsEqual({
		...previousJob,
		enabled: params.hydrated.enabled
	}, params.hydrated) ? resolveForcePreservedOneShotAtMs(params.hydrated) : void 0;
}
function warnInvalidPersistedCronJob(params) {
	const jobId = typeof params.raw.id === "string" ? params.raw.id : void 0;
	const dedupeKey = jobId ?? `index:${params.index}`;
	if (params.state.warnedInvalidPersistedJobKeys.has(dedupeKey)) return;
	params.state.warnedInvalidPersistedJobKeys.add(dedupeKey);
	params.state.deps.log.warn({
		storePath: params.state.deps.storePath,
		jobId,
		jobIndex: params.index,
		reason: params.reason
	}, "cron: quarantined invalid persisted job and skipped it from runtime");
}
function isValidatedCronJob(value) {
	return getInvalidPersistedCronJobReason(value) === null;
}
/** Loads and normalizes the cron store, quarantining invalid persisted rows before runtime use. */
async function ensureLoaded(state, opts) {
	if (state.store && !opts?.forceReload) {
		const loadedRevision = loadedCronStoreRevisions.get(state);
		if (loadedRevision === void 0 || loadedRevision === getCronJobsStoreRevision(state.deps.storePath)) return;
	}
	const previousJobsById = /* @__PURE__ */ new Map();
	for (const job of state.store?.jobs ?? []) previousJobsById.set(job.id, job);
	const loadedRevision = getCronJobsStoreRevision(state.deps.storePath);
	const loaded = await loadCronJobsStoreWithConfigJobs(state.deps.storePath);
	const loadNowMs = state.deps.nowMs();
	const loadedJobs = (loaded.store.jobs ?? []).filter(isRecord);
	const jobs = [];
	const durableNextRunAtMsByJobId = /* @__PURE__ */ new Map();
	const quarantinedConfigJobs = [...loaded.invalidConfigRows];
	for (const [index, raw] of loadedJobs.entries()) {
		const rawConfigJob = loaded.configJobs[index] ?? structuredClone(raw);
		const sourceIndex = loaded.configJobIndexes[index] ?? index;
		const runtimeEntry = loaded.configJobRuntimeEntries[index];
		normalizeCronJobIdentityFields(raw);
		const rawInvalidReason = getInvalidPersistedCronJobReason(raw);
		let normalized;
		try {
			normalized = normalizeCronJobInput(raw);
		} catch (error) {
			if (!isInvalidCronSessionTargetIdError(error)) throw error;
			normalized = null;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				jobId: typeof raw.id === "string" ? raw.id : void 0
			}, "cron: job has invalid persisted sessionTarget; run testclaw doctor --fix to repair");
		}
		const hydratedRaw = normalized ?? raw;
		let invalidReason = rawInvalidReason ?? getInvalidPersistedCronJobReason(hydratedRaw);
		const hydratedSchedule = isRecord(hydratedRaw.schedule) ? hydratedRaw.schedule : {};
		const hydratedIsValid = !invalidReason && isValidatedCronJob(hydratedRaw);
		if (hydratedIsValid && hydratedRaw.enabled && hydratedSchedule.kind === "every") try {
			assertTimeScheduleSatisfiable({
				...hydratedRaw,
				state: {}
			}, loadNowMs, computeJobNextRunAtMs);
		} catch {
			invalidReason = "unsatisfiable-schedule";
		}
		if (invalidReason) {
			const quarantineEntry = {
				sourceIndex,
				reason: invalidReason,
				job: rawConfigJob
			};
			const runtimeState = runtimeEntry?.state ?? raw.state;
			if (runtimeState && typeof runtimeState === "object" && !Array.isArray(runtimeState)) quarantineEntry.state = structuredClone(runtimeState);
			const updatedAtMs = runtimeEntry?.updatedAtMs ?? raw.updatedAtMs;
			if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs)) quarantineEntry.updatedAtMs = updatedAtMs;
			if (typeof runtimeEntry?.scheduleIdentity === "string") quarantineEntry.scheduleIdentity = runtimeEntry.scheduleIdentity;
			quarantinedConfigJobs.push(quarantineEntry);
			warnInvalidPersistedCronJob({
				state,
				raw,
				index: sourceIndex,
				reason: invalidReason
			});
			continue;
		}
		if (!hydratedIsValid) continue;
		const hydrated = hydratedRaw;
		jobs.push(hydrated);
		durableNextRunAtMsByJobId.set(hydrated.id, hydrated.state.nextRunAtMs);
		invalidateStaleNextRunOnScheduleChange({
			previousJobsById,
			hydrated
		});
	}
	state.store = {
		version: 1,
		jobs
	};
	state.durableNextRunAtMsByJobId = durableNextRunAtMsByJobId;
	state.storeLoadedAtMs = loadNowMs;
	loadedCronStoreRevisions.set(state, loadedRevision);
	if (quarantinedConfigJobs.length > 0 && !opts?.deferQuarantinePersist) {
		quarantinedConfigJobs.sort((left, right) => left.sourceIndex - right.sourceIndex);
		state.pendingQuarantineConfigJobs = quarantinedConfigJobs;
		try {
			if (await persist(state)) state.deps.log.warn({
				storePath: state.deps.storePath,
				quarantinedJobs: quarantinedConfigJobs.length
			}, "cron: sanitized active cron store after quarantining malformed persisted jobs");
		} catch (error) {
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: error instanceof Error ? error.message : String(error)
			}, "cron: failed to sanitize malformed persisted jobs after quarantine; continuing with quarantined in-memory view");
		}
	}
}
/** Loads authoritative passive state without discarding enabled-scheduler transients. */
async function ensureLoadedForOperation(state) {
	await ensureLoaded(state, {
		forceReload: !state.deps.cronEnabled,
		deferQuarantinePersist: !state.deps.cronEnabled
	});
	if (!state.deps.cronEnabled) {
		state.pendingQuarantineConfigJobs = [];
		state.lastQuarantineFailureWarnKey = null;
	}
}
/** Emits the cron-disabled warning once per service state. */
function warnIfDisabled(state, action) {
	if (state.deps.cronEnabled) return;
	if (state.warnedDisabled) return;
	state.warnedDisabled = true;
	state.deps.log.warn({
		enabled: false,
		action,
		storePath: state.deps.storePath
	}, "cron: scheduler disabled; jobs will not run automatically");
}
/** Persists cron rows and pending quarantine records in one SQLite transaction. */
function persist(state, opts) {
	return persistUsing(state, opts, saveCronJobsStoreWithRevision);
}
async function persistUsing(state, opts, save) {
	const store = state.store;
	if (!store) return false;
	const quarantine = state.pendingQuarantineConfigJobs.length > 0 ? {
		entries: state.pendingQuarantineConfigJobs,
		nowMs: state.deps.nowMs()
	} : void 0;
	const stateOnly = !quarantine && opts?.stateOnly === true;
	let revision;
	try {
		revision = (await save(state.deps.storePath, store, {
			quarantine,
			stateOnly,
			transactionHooks: opts?.transactionHooks
		})).revision;
	} catch (error) {
		if (!quarantine || error instanceof CronRunReceiptConflictError || error instanceof CronRunReceiptRevisionError) throw error;
		const errorMessage = error instanceof Error ? error.message : String(error);
		const warnKey = `${state.deps.storePath}\0${errorMessage}`;
		if (state.lastQuarantineFailureWarnKey !== warnKey) {
			state.lastQuarantineFailureWarnKey = warnKey;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: errorMessage
			}, "cron: failed to quarantine malformed persisted jobs; skipping active store sanitization");
		}
		return false;
	}
	loadedCronStoreRevisions.set(state, revision);
	if (quarantine) {
		state.pendingQuarantineConfigJobs = [];
		state.lastQuarantineFailureWarnKey = null;
	}
	publishDurableNextRunChanges({
		state,
		storeJobs: store.jobs,
		stateOnly,
		suppressScheduledJobId: opts?.suppressScheduledJobId
	});
	runPostPersistCronNotifications(state, opts?.postPersistNotifications);
	return true;
}
/**
* Notifications run after the durable commit; one throwing notify (e.g. an
* auto-disable notice for a removed agent) must not drop its siblings or
* masquerade as a store-write failure — at startup that keeps the whole
* scheduler down.
*/
function runPostPersistCronNotifications(state, notifications) {
	for (const notification of notifications ?? []) try {
		dispatchCronNotification(state, notification);
	} catch (err) {
		state.deps.log.warn({ error: err instanceof Error ? err.message : String(err) }, "cron: post-persist notification failed");
	}
}
/** Best-effort scratch pruning after the owning job deletions are durable. */
function pruneCronJobScratchAfterCommit(state, committedJobIds) {
	for (const jobId of committedJobIds) try {
		deleteCronJobScratch(state.deps.storePath, jobId);
	} catch (error) {
		state.deps.log.warn({
			jobId,
			err: String(error)
		}, "cron: post-commit scratch cleanup failed");
	}
}
/** Captures the live cron state that must stay aligned with the durable store. */
function snapshotStoreForRollback(state) {
	return {
		store: state.store ? structuredClone(state.store) : null,
		durableNextRunAtMsByJobId: new Map(state.durableNextRunAtMsByJobId)
	};
}
function persistOrRestore(state, snapshot, opts = {}) {
	return persistOrRestoreUsing(state, snapshot, opts, {
		save: saveCronJobsStoreWithRevision,
		saveChanges: saveCronJobsStoreChangesWithRevision
	});
}
/** Retain the current host turn from caller guard/capture through the native commit. */
function persistNativeOrRestore(state, snapshot, opts = {}) {
	return persistOrRestoreUsing(state, snapshot, opts, {
		save: saveCronJobsStoreWithRevisionNative,
		saveChanges: saveCronJobsStoreChangesWithRevisionNative
	});
}
async function persistOrRestoreUsing(state, snapshot, opts, persistence) {
	try {
		if (!state.deps.cronEnabled && snapshot.store && state.store) {
			const committed = await persistence.saveChanges(state.deps.storePath, snapshot.store, state.store, {
				...opts.preserveConcurrentAdds ? { preserveConcurrentAdds: true } : {},
				...opts.transactionHooks ? { transactionHooks: opts.transactionHooks } : {}
			});
			state.store = committed.value;
			state.storeLoadedAtMs = state.deps.nowMs();
			loadedCronStoreRevisions.set(state, committed.revision);
			publishDurableNextRunChanges({
				state,
				storeJobs: state.store.jobs,
				stateOnly: false,
				suppressScheduledJobId: opts.suppressScheduledJobId
			});
			runPostPersistCronNotifications(state, opts.postPersistNotifications);
			return;
		}
		if (!await persistUsing(state, opts, persistence.save)) throw new Error("cron: durable store write did not complete");
	} catch (err) {
		state.store = snapshot.store;
		state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
		throw err;
	}
}
//#endregion
//#region src/cron/store/run-receipt-execution-binding.ts
/** Binds the exact admitted execution without changing the receipt lifecycle. */
async function bindCronRunReceiptExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureAssistantStateWorkerContext(params.options);
	const input = {
		handle: { ...params.handle },
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runAssistantStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./testclaw-state-worker-store-C-YrKqH_.js"), import("./sqlite-worker-store-DHnDUYmC.js")]);
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.bindReceiptExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/cron/task-run-event-codec.ts
/** Write-side cron codec: converts a finished service event into a run-history entry.
* Kept separate from task-run-detail.ts so the read/history codec stays free of the
* agents failover tree (which transitively pulls the sandbox module graph). */
/** Uses execution timing for one timestamp shared by ledger and legacy dual-write paths. */
function resolveCronRunEndedAt(event, fallbackTs) {
	if (typeof event.runAtMs === "number" && Number.isFinite(event.runAtMs) && typeof event.durationMs === "number" && Number.isFinite(event.durationMs)) return event.runAtMs + event.durationMs;
	return fallbackTs;
}
/** Builds the legacy run-history record from one finished service event. */
function cronRunLogEntryFromEvent(event, fallbackTs, errorClassification) {
	const errorReason = resolveCronRunErrorReason(event.error, event.provider, errorClassification);
	return {
		ts: resolveCronRunEndedAt(event, fallbackTs),
		jobId: event.jobId,
		action: "finished",
		status: event.status,
		completionStatus: event.completionStatus,
		error: event.error,
		errorReason,
		summary: event.summary,
		diagnostics: event.diagnostics,
		delivered: event.delivered,
		deliveryStatus: event.deliveryStatus,
		deliveryError: event.deliveryError,
		deliverySuppressionReason: event.deliverySuppressionReason,
		failureNotificationDelivery: event.failureNotificationDelivery,
		delivery: event.delivery,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		runId: event.runId,
		runAtMs: event.runAtMs,
		durationMs: event.durationMs,
		nextRunAtMs: event.nextRunAtMs,
		triggerFired: event.triggerFired,
		model: event.model,
		provider: event.provider,
		usage: event.usage
	};
}
//#endregion
//#region src/cron/service/task-ledger.ts
/** Progress summary shown while a detached task ledger row represents an active automation run. */
const CRON_TASK_RUNNING_PROGRESS_SUMMARY = "Running automation.";
//#endregion
//#region src/cron/service/task-runs.ts
/** Detached task-ledger integration for cron runs. */
function requireCronAgentId(agentId) {
	if (!agentId?.trim()) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return normalizeAgentId(agentId);
}
function resolveCurrentDefaultAgentId$1(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
/** Carries exact admission into the first post-admission owner lifecycle phase. */
function createCronOwnerExecutionIdentityAdmission(params) {
	const ownerBinding = createExecutionStartedOwnerBinding(async (admitted) => {
		const { taskId, flowId } = params;
		try {
			if (!admitted.executionIdentityToken) return;
			const assertCurrent = resolveAdmittedRunActiveAssertion(admitted);
			if (!assertCurrent) throw new Error("Cron execution authority closed before owner binding");
			const context = captureAssistantStateWorkerContext();
			const receiptResult = await bindCronRunReceiptExecution({
				admitted,
				handle: params.runReceipt,
				context,
				assertCurrent
			});
			const taskResult = taskId ? isRetainedExecutionOwnerBinding(receiptResult) ? await bindTaskRunExecution({
				admitted,
				taskId,
				context,
				assertCurrent
			}) : receiptResult : void 0;
			const flowParentResult = taskId ? taskResult : receiptResult;
			const flowResult = flowId ? isRetainedExecutionOwnerBinding(receiptResult) && isRetainedExecutionOwnerBinding(flowParentResult) ? await bindTaskFlowExecution({
				admitted,
				flowId,
				context,
				assertCurrent
			}) : flowParentResult : void 0;
			if ([
				receiptResult,
				taskResult,
				flowResult
			].some((result) => result === "mismatch" || result === "missing")) params.state.deps.log.warn({
				receiptResult,
				taskResult,
				flowResult
			}, "cron: exact execution identity binding was not retained");
		} catch (error) {
			params.state.deps.log.warn({ error }, "cron: failed to retain exact execution identity binding");
		}
	});
	return {
		ingress: {
			kind: "schedule",
			boundary: "cron.isolated-agent",
			state: "present"
		},
		onPostAdmission: ownerBinding.onPostAdmission,
		onExecutionStarted: ownerBinding.onExecutionStarted
	};
}
/** Updates an active cron task with the exact transcript identity reported by its runner. */
function tryUpdateCronTaskRunSession(state, taskRunId, sessionKey) {
	const childSessionKey = sessionKey?.trim();
	if (!taskRunId || !childSessionKey) return;
	try {
		if (recordTaskRunProgressByRunIdCore({
			runId: taskRunId,
			runtime: "cron",
			childSessionKey
		}).length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger session was not updated");
	} catch (error) {
		state.deps.log.warn({
			runId: taskRunId,
			error
		}, "cron: failed to update task ledger session");
	}
}
function tryCreateCronTaskRunHandle(params) {
	const runId = createCronTaskRunId(params.job.id, params.startedAt, params.runReceipt?.receiptId, params.publicRunId);
	return tryCreateCronTaskRunRecord({
		state: params.state,
		job: params.job,
		jobId: params.job.id,
		startedAt: params.startedAt,
		runId
	}) ?? { runId };
}
function createCronTaskRunId(jobId, startedAt, receiptId, publicRunId) {
	const receipt = receiptId?.trim();
	const publicId = publicRunId?.trim();
	const discriminator = receipt || publicId || randomUUID();
	const publicSuffix = publicId && publicId !== discriminator ? `:${publicId}` : "";
	return `${createCronExecutionId(jobId, startedAt)}:${discriminator}${publicSuffix}`;
}
function receiptIdFromCronTaskRunId(taskRunId, jobId, startedAt) {
	const prefix = `${createCronExecutionId(jobId, startedAt)}:`;
	if (!taskRunId?.startsWith(prefix)) return;
	return taskRunId.slice(prefix.length).split(":", 1)[0] || void 0;
}
function findLatestCronTaskRunForRecoveryFromRecords(records, jobId, startedAt, storeKey, receiptId) {
	const executionRunId = createCronExecutionId(jobId, startedAt);
	const prefix = `${executionRunId}:`;
	const receiptRunId = receiptId ? `${prefix}${receiptId}` : void 0;
	return records.filter((task) => {
		if (task.runtime !== "cron" || task.sourceId !== jobId) return false;
		const taskStoreKey = cronTaskRecordStoreKey(task);
		if (receiptRunId) return taskStoreKey === storeKey && (task.runId === receiptRunId || task.runId?.startsWith(`${receiptRunId}:`));
		if (taskStoreKey === void 0) return task.runId === executionRunId;
		return taskStoreKey === storeKey && (task.runId === executionRunId || task.runId?.startsWith(prefix));
	}).toSorted((left, right) => Number(left.endedAt !== void 0) - Number(right.endedAt !== void 0) || resolveCronTaskRecordTimestamp(right) - resolveCronTaskRecordTimestamp(left) || right.createdAt - left.createdAt || right.taskId.localeCompare(left.taskId))[0];
}
function finalizedCronTaskRun(task, jobId) {
	if (task?.runtime !== "cron" || task.sourceId !== jobId || task.endedAt === void 0) return;
	const triggerEval = cronTaskRecordToTriggerEval(task);
	const entry = cronTaskRecordToRunLogEntry(task) ?? (task.status === "succeeded" && triggerEval?.fired === false ? {
		ts: task.endedAt,
		jobId,
		action: "finished",
		status: "ok",
		...task.startedAt === void 0 ? {} : {
			runAtMs: task.startedAt,
			durationMs: Math.max(0, task.endedAt - task.startedAt)
		}
	} : void 0);
	if (!entry?.status) return;
	const scriptResult = cronTaskRecordToScriptRunResult(task);
	return {
		entry: {
			...entry,
			status: entry.status
		},
		...scriptResult ? { scriptResult } : {},
		...triggerEval ? { triggerEval } : {}
	};
}
/** Re-reads task recovery facts on the caller's exact SQLite transaction. */
function findCronTaskRunRecoveryInDatabase(params) {
	const task = findLatestCronTaskRunForRecoveryFromRecords(listTaskRecordsByRuntimeSourceIdInDatabase(params.database, "cron", params.jobId), params.jobId, params.startedAt, params.storeKey, params.receiptId);
	const finalized = finalizedCronTaskRun(task, params.jobId);
	const receiptId = receiptIdFromCronTaskRunId(task?.runId, params.jobId, params.startedAt);
	return {
		...task?.runId ? { taskRunId: task.runId } : {},
		...receiptId ? { receiptId } : {},
		...finalized ? { finalized } : {}
	};
}
function tryCreateCronTaskRunRecord(params) {
	try {
		const childSessionKey = params.childSessionKey;
		const agentId = params.ownerlessRun ? void 0 : params.job ? resolveCronJobEffectiveAgentId(params.job, resolveCurrentDefaultAgentId$1(params.state)) : childSessionKey ? resolveAgentIdFromSessionKey(childSessionKey, resolveCurrentDefaultAgentId$1(params.state)) : requireCronAgentId(resolveCurrentDefaultAgentId$1(params.state));
		const task = createRunningTaskRunCore({
			runtime: "cron",
			taskKind: CRON_TASK_KIND,
			sourceId: params.jobId,
			ownerKey: "",
			scopeKind: "system",
			childSessionKey,
			agentId,
			runId: params.runId,
			label: params.job?.name,
			task: params.job?.name || params.jobId,
			deliveryStatus: "not_applicable",
			notifyPolicy: "silent",
			startedAt: params.startedAt,
			lastEventAt: params.startedAt,
			progressSummary: CRON_TASK_RUNNING_PROGRESS_SUMMARY,
			detail: { storeKey: cronStoreKey(params.state.deps.storePath) }
		});
		if (!task) {
			params.state.deps.log.warn({ jobId: params.jobId }, "cron: task ledger record was not persisted");
			return;
		}
		return {
			runId: params.runId,
			taskId: task.taskId,
			...task.parentFlowId ? { flowId: task.parentFlowId } : {}
		};
	} catch (error) {
		params.state.deps.log.warn({
			jobId: params.jobId,
			error
		}, "cron: failed to create task ledger record");
		return;
	}
}
/** Finalizes executions that intentionally do not produce a run-history row. */
function tryFinishCronTaskRunWithoutHistory(state, result) {
	if (!result.taskRunId) return;
	const error = result.status !== "ok" && result.error !== void 0 ? normalizeCronRunErrorText(result.error) : void 0;
	const quietTriggerEval = result.triggerEval?.fired === false ? {
		...result.triggerEval,
		fired: false
	} : void 0;
	try {
		finalizeTaskRunByRunIdCore({
			runId: result.taskRunId,
			runtime: "cron",
			status: cronRunStatusToTaskStatus({
				status: result.status,
				completionStatus: quietTriggerEval ? "succeeded" : result.completionStatus,
				error
			}),
			endedAt: result.endedAt,
			lastEventAt: result.endedAt,
			error,
			terminalSummary: result.summary,
			childSessionKey: result.childSessionKey ?? result.sessionKey ?? null,
			...quietTriggerEval ? { detail: cronQuietTriggerTaskDetail(cronStoreKey(state.deps.storePath), quietTriggerEval) } : {}
		});
	} catch (cause) {
		state.deps.log.warn({
			runId: result.taskRunId,
			jobStatus: result.status,
			error: cause
		}, "cron: failed to update task ledger record");
	}
}
/** Finalizes the authoritative task row, creating one for terminal-only cron events. */
function tryFinishCronTaskRun(state, result) {
	const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs(), result.errorClassification);
	const startedAt = entry.runAtMs ?? entry.ts;
	const candidateRunId = result.taskRunId ?? createCronTaskRunId(entry.jobId, startedAt, entry.runId);
	try {
		const existingCandidate = findTaskByRunId(candidateRunId);
		const created = existingCandidate?.runtime === "cron" ? void 0 : tryCreateCronTaskRunRecord({
			state,
			job: result.job ?? result.event.job,
			jobId: entry.jobId,
			startedAt,
			runId: candidateRunId,
			childSessionKey: entry.sessionKey,
			ownerlessRun: result.ownerlessRun
		});
		const taskRunId = existingCandidate?.runtime === "cron" ? candidateRunId : created?.runId;
		if (!taskRunId) return;
		const storeKey = cronStoreKey(state.deps.storePath);
		const legacyRecoveryRunId = createCronExecutionId(entry.jobId, startedAt);
		const detail = cronRunLogEntryToTaskDetail(entry, {
			storeKey,
			...result.scriptResult ? { scriptResult: result.scriptResult } : {},
			...result.triggerEval ? { triggerEval: result.triggerEval } : {}
		});
		const finalize = (runId, status = cronRunStatusToTaskStatus(entry)) => finalizeTaskRunByRunIdCore({
			runId,
			runtime: "cron",
			status,
			endedAt: entry.ts,
			lastEventAt: entry.ts,
			...status === "cancelled" ? {} : {
				error: entry.error,
				clearError: entry.error === void 0,
				terminalSummary: entry.summary ?? null,
				preserveTerminalSummary: true
			},
			childSessionKey: entry.sessionKey ?? null,
			detail
		});
		let updated = finalize(taskRunId);
		if (updated.length === 0) {
			const existing = findTaskByRunId(taskRunId);
			if (existing?.runtime === "cron" && existing.status === "cancelled") updated = finalize(taskRunId, "cancelled");
			else if (existing?.runtime === "cron" && (existing.status === "lost" || cronTaskRecordStoreKey(existing) === storeKey && cronTaskRecordToRunLogEntry(existing) === null || existing.detail === void 0 && existing.runId === legacyRecoveryRunId)) {
				const recovered = finalizeTaskRunById({
					taskId: existing.taskId,
					status: cronRunStatusToTaskStatus(entry),
					childSessionKey: entry.sessionKey ?? null,
					endedAt: entry.ts,
					lastEventAt: entry.ts,
					error: entry.error,
					terminalSummary: entry.summary ?? null,
					preserveTerminalSummary: true,
					detail
				});
				updated = recovered ? [recovered] : [];
			} else if (existing?.runtime === "cron") updated = finalize(taskRunId);
			else {
				const recreated = tryCreateCronTaskRunRecord({
					state,
					job: result.job ?? result.event.job,
					jobId: entry.jobId,
					startedAt,
					runId: taskRunId,
					childSessionKey: entry.sessionKey,
					ownerlessRun: result.ownerlessRun
				});
				if (recreated) updated = finalize(recreated.runId);
			}
		}
		if (updated.length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger record was not finalized");
	} catch (error) {
		state.deps.log.warn({
			runId: candidateRunId,
			jobStatus: entry.status,
			error
		}, "cron: failed to update task ledger record");
	}
}
//#endregion
//#region src/cron/service/timer-execution-timeout.ts
const MAX_CRON_TIMER_DELAY_MS = 6e4;
/**
* Minimum gap between consecutive fires of the same cron job.  This is a
* safety net that prevents spin-loops when `computeJobNextRunAtMs` returns
* a value within the same second as the just-completed run.  The guard
* is intentionally generous (2 s) so it never masks a legitimate schedule
* but always breaks an infinite re-trigger cycle.  (See #17821)
*/
const MIN_REFIRE_GAP_MS = 2e3;
/** Payloads that execute outside the main session own cancellable task-run state. */
function runsDetachedFromMainSession(job) {
	return job.sessionTarget !== "main" || job.payload.kind === "script";
}
function resolveMainSessionCronDeliveryContext(state, job) {
	const targetSessionKey = job.sessionKey?.trim();
	if (!targetSessionKey) return;
	const explicitAgentId = job.agentId?.trim();
	const agentId = normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(targetSessionKey, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId));
	const storePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
	if (!storePath) return;
	try {
		const sessionEntry = loadSessionEntryReadOnly({
			agentId,
			sessionKey: targetSessionKey,
			storePath
		});
		return deliveryContextFromSession(sessionEntry);
	} catch {
		return;
	}
}
//#endregion
//#region src/cron/service/timer-outcome-events.ts
/** Records a terminal task/event fact before the fallible runtime-row commit. */
function emitCronOutcomeForJob(state, job, result) {
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) return;
	recordCronOutcomeForJob(state, job, result);
	emitCronOutcomeEventForJob(state, job, result);
}
function createCronOutcomeEvent(job, result) {
	return {
		jobId: job.id,
		action: "finished",
		job,
		status: result.status,
		completionStatus: result.completionStatus,
		error: result.error,
		summary: result.summary,
		diagnostics: result.diagnostics,
		delivered: job.state.lastDelivered,
		deliveryStatus: job.state.lastDeliveryStatus,
		deliveryError: job.state.lastDeliveryError,
		deliverySuppressionReason: job.state.deliverySuppressionReason,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
		delivery: result.delivery,
		sessionId: result.sessionId,
		sessionKey: result.sessionKey,
		runAtMs: result.startedAt,
		durationMs: job.state.lastDurationMs,
		nextRunAtMs: job.state.nextRunAtMs,
		...result.triggerEval?.fired ? { triggerFired: true } : {},
		model: result.model,
		provider: result.provider,
		usage: result.usage
	};
}
function recordCronOutcomeForJob(state, job, result) {
	const event = createCronOutcomeEvent(job, result);
	tryFinishCronTaskRun(state, {
		taskRunId: result.taskRunId,
		job,
		event,
		errorClassification: result.errorClassification,
		scriptResult: {
			scriptStateChanged: result.scriptStateChanged,
			scriptState: result.scriptState
		},
		...result.triggerEval ? { triggerEval: result.triggerEval } : {}
	});
}
function emitCronOutcomeEventForJob(state, job, result) {
	emit(state, createCronOutcomeEvent(job, result), cronFailureNotificationEventContext(result.failureNotificationDetail));
}
//#endregion
//#region src/cron/retry-hint.ts
const SERVER_ERROR_PATTERN = /\b(?:https?|status(?:[ _]code)?|response(?:[ _]code)?|http(?:[ _]status)?)\b[\s:=#"']{0,4}5\d{2}\b|\b5\d{2}\b[\s:)\].,-]*(?:internal server error|server error|bad gateway|service unavailable|gateway time-?out)\b|\binternal server error\b|\bbad gateway\b|\bservice unavailable\b|\bgateway time-?out\b|\b5xx\b|^\s*5\d{2}\s*$/i;
const RATE_LIMIT_PATTERN = /\b(?:https?(?:\/\d(?:\.\d)?)?|status(?:[ _-]?code)?|response(?:[ _-]?code)?|http(?:[ _-]?status)?)\b[\s:=#"'(]{0,6}429\b|\b(?:provider\s+)?api[ _-]?error\b[\s:=#"'(]{0,6}429\b|\b(?:requested\s+)?url\s+returned\s+error\b[\s:=#"'(]{0,6}429\b|\b429\b[\s:)\].,-]*(?:rate[_ -]?limit(?:ed|ing)?(?:[_ -](?:error|exceeded|reached))?|too many requests|resource has been exhausted|quota(?:\s+(?:exceeded|exhausted|depleted|reached))?)\b|\brate[_ -]?limit(?:ed|ing)?(?:[_ -](?:error|exceeded|reached))?\b|\btoo many requests\b|\bresource has been exhausted\b|\btokens per day\b|^\s*429\s*$/i;
const SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN = /^(?:(?:CronSessionLifecycleClaimError|Error): )?Session "[^"\n]+" (?:changed|was deleted) while starting work\. Retry\.$/;
const TRANSIENT_PATTERNS = {
	rate_limit: RATE_LIMIT_PATTERN,
	overloaded: /^\s*529(?:\s*$|[\s:)\].,-]*(?:api\b.*\bbusy\b|(?:please\s+)?try\s+again\b))|\b(?:https?(?:\/\d(?:\.\d)?)?|status(?:[ _-]?code)?|response(?:[ _-]?code)?|http(?:[ _-]?status)?|(?:provider\s+)?api[ _-]?error|(?:requested\s+)?url\s+returned\s+error)\b[\s:=#"'(]{0,6}529\b|\boverloaded(?:_error)?\b|high demand|temporar(?:ily|y) overloaded|capacity exceeded/i,
	network: /(network|fetch failed|socket|econnreset|econnrefused|eai_again|enetdown|ehostunreach|ehostdown|enetreset|enetunreach|epipe)/i,
	timeout: /(timeout|timed out|stalled before execution start|etimedout)/i,
	server_error: SERVER_ERROR_PATTERN
};
/** Classifies cron execution errors against the configured retryable transient categories. */
function resolveCronExecutionRetryHint(input) {
	const { error, retryOn, classifiedReason, executionStarted } = input;
	if (!error || typeof error !== "string") return { retryable: false };
	if (SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN.test(error)) return { retryable: executionStarted !== true };
	const keys = retryOn?.length ? retryOn : Object.keys(TRANSIENT_PATTERNS);
	const classified = classifiedReason ?? void 0;
	if (classified) return keys.includes(classified) ? {
		retryable: true,
		category: classified
	} : { retryable: false };
	for (const key of keys) if (TRANSIENT_PATTERNS[key]?.test(error)) return {
		retryable: true,
		category: key
	};
	return { retryable: false };
}
//#endregion
//#region src/cron/service/timer-trigger.ts
/** Default max retries for cron jobs on transient errors (#24355). */
const DEFAULT_MAX_TRANSIENT_RETRIES = 3;
/** Rejects outcome-generated schedule timestamps before they can persist or arm a timer. */
function resolveNextRunAtMsOrDisable(params) {
	const nextRunAtMs = asDateTimestampMs(params.candidate);
	if (nextRunAtMs !== void 0 && nextRunAtMs > 0) return nextRunAtMs;
	autoDisableCronJob({
		job: params.job,
		reason: "schedule-errors",
		atMs: params.state.deps.nowMs(),
		consecutiveErrors: 1,
		deferredNotifications: params.deferredNotifications
	});
}
/** Persists non-busy trigger evaluation state without touching payload-run history. */
function applyTriggerEvaluationState(job, triggerEval, evaluatedAtMs) {
	if (triggerEval.busy) return;
	job.state.lastTriggerEvalAtMs = evaluatedAtMs;
	job.state.triggerEvalCount = (job.state.triggerEvalCount ?? 0) + 1;
	if (triggerEval.stateChanged) job.state.triggerState = triggerEval.state;
	if (triggerEval.fired) job.state.lastTriggerFireAtMs = evaluatedAtMs;
}
/** Persists fired/error trigger metadata and disarms successful once triggers. */
function applyTriggerRunResult(job, result, opts) {
	if (!result.triggerEval || opts?.triggerOwnership === "stale") return;
	applyTriggerEvaluationState(job, result.status === "ok" ? result.triggerEval : {
		...result.triggerEval,
		stateChanged: false,
		state: void 0
	}, result.endedAt);
	if (opts?.scheduleOwnership !== "stale" && result.triggerEval.fired && job.trigger?.once === true && result.status === "ok") {
		if (job.schedule.kind === "stream") job.state.streamSourceIdentity = createCronStreamSourceIdentity();
		job.enabled = false;
		job.state.nextRunAtMs = void 0;
	}
}
function resolveCronNextRunWithLowerBound(params) {
	if (params.naturalNext === void 0) {
		params.state.deps.log.warn({
			jobId: params.job.id,
			jobName: params.job.name
		}, "cron: next run unresolved; clearing schedule to avoid a refire loop");
		return;
	}
	return resolveNextRunAtMsOrDisable({
		state: params.state,
		job: params.job,
		candidate: Math.max(params.naturalNext, params.lowerBoundMs),
		deferredNotifications: params.deferredNotifications
	});
}
function resolveTransientCronRetryDecision(params) {
	if (params.errorClassification?.kind === "permanent") return {
		retryable: false,
		consecutiveErrors: params.consecutiveErrors ?? 0,
		reason: "permanent error"
	};
	const retryHint = resolveCronExecutionRetryHint({
		error: params.error,
		retryOn: void 0,
		classifiedReason: params.errorClassification?.kind === "reason" ? params.errorClassification.reason : params.lastErrorReason,
		executionStarted: params.executionStarted
	});
	const consecutiveErrors = params.consecutiveErrors ?? 0;
	if (!retryHint.retryable) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "permanent error"
	};
	if (consecutiveErrors > DEFAULT_MAX_TRANSIENT_RETRIES) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveErrors,
		retryCategory: retryHint.category,
		backoffMs: errorBackoffMs(consecutiveErrors, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, DEFAULT_MAX_TRANSIENT_RETRIES)),
		reason: "transient retry"
	};
}
function resolveDisabledHeartbeatOneShotRetryDecision(params) {
	const consecutiveSkipped = params.consecutiveSkipped ?? 0;
	if (consecutiveSkipped > DEFAULT_MAX_TRANSIENT_RETRIES) return {
		retryable: false,
		consecutiveSkipped,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveSkipped,
		backoffMs: errorBackoffMs(consecutiveSkipped, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, DEFAULT_MAX_TRANSIENT_RETRIES)),
		reason: "disabled heartbeat retry"
	};
}
function normalizeQueuedSystemEventHandle(result) {
	if (typeof result === "boolean") return { accepted: result };
	if (result && typeof result === "object") return {
		accepted: result.accepted !== false,
		...result.remove ? { remove: result.remove } : {}
	};
	return { accepted: true };
}
function removeQueuedSystemEventHandle(state, job, queued) {
	if (!queued.accepted || !queued.remove) return;
	try {
		queued.remove();
	} catch (err) {
		state.deps.log.warn({
			jobId: job.id,
			jobName: job.name,
			err
		}, "cron: failed to remove undelivered main-session system event");
	}
}
function shouldRetryDisabledHeartbeatOneShot(job, result) {
	return job.schedule.kind === "at" && job.sessionTarget === "main" && job.wakeMode === "now" && result.status === "skipped" && result.error === "disabled";
}
function isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun) {
	if (!isJobEnabled(job) || typeof nextRun !== "number" || typeof lastRun !== "number" || nextRun <= lastRun) return false;
	if (lastRunStatus === "error") return true;
	return lastRunStatus === "skipped" && job.sessionTarget === "main" && job.wakeMode === "now" && job.state.lastError === "disabled";
}
function resolveDeliveryState(params) {
	const primaryDeliveryPlan = resolveCronDeliveryPlan(params.job);
	const primaryDeliveryRequested = primaryDeliveryPlan.requested;
	const noFailureNotification = { status: "not-requested" };
	if (params.delivered === true && (params.runStatus !== "error" || params.delivery?.delivered === true)) return {
		delivered: true,
		status: "delivered",
		failureNotification: noFailureNotification
	};
	if (!primaryDeliveryRequested) {
		if (primaryDeliveryPlan.mode === "webhook" && params.deliveryAttempted === true) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			failureNotification: noFailureNotification
		};
		return {
			status: "not-requested",
			failureNotification: noFailureNotification
		};
	}
	if (params.runStatus === "error") {
		if (params.delivered !== void 0) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			deliverySuppressionReason: params.deliverySuppressionReason,
			failureNotification: noFailureNotification
		};
		return {
			status: "unknown",
			error: params.error,
			failureNotification: noFailureNotification
		};
	}
	if (params.delivered === false) return {
		delivered: false,
		status: "not-delivered",
		error: params.error,
		deliverySuppressionReason: params.deliverySuppressionReason,
		failureNotification: { status: "not-requested" }
	};
	return {
		status: "unknown",
		failureNotification: { status: "not-requested" }
	};
}
//#endregion
//#region src/cron/service/timer-outcomes.ts
/** Checks both the admitted schedule and edits that may have returned to its original value. */
function resolveCronRunScheduleOwnership(params) {
	return typeof params.currentJob.state.runningScheduleChangeId === "string" || params.activeJobMarker?.scheduleMutated === true || !cronSchedulingInputsEqual(params.admittedJob, params.currentJob) ? "stale" : "current";
}
/** Keeps trigger state owned by the exact script/once definition that evaluated it. */
function resolveCronRunTriggerOwnership(params) {
	return params.activeJobMarker?.triggerMutated === true || params.admittedJob.trigger?.script !== params.currentJob.trigger?.script || params.admittedJob.trigger?.once !== params.currentJob.trigger?.once ? "stale" : "current";
}
function assignNextRunAtMs(params) {
	const nextRunAtMs = resolveNextRunAtMsOrDisable(params);
	params.job.state.nextRunAtMs = nextRunAtMs;
	return nextRunAtMs;
}
/** Applies run outcome state, delivery state, backoff/next-run scheduling, and delete-after-run policy. */
function applyJobResult(state, job, result, opts) {
	const scheduleNextRun = (candidate) => assignNextRunAtMs({
		state,
		job,
		candidate,
		deferredNotifications: opts.deferredNotifications
	});
	const previousScheduleState = {
		enabled: job.enabled,
		nextRunAtMs: job.state.nextRunAtMs,
		pacedNextRunAtMs: job.state.pacedNextRunAtMs,
		forcePreservedNextRunAtMs: job.state.forcePreservedNextRunAtMs
	};
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	job.state.lastRunAtMs = result.startedAt;
	job.state.lastRunStatus = result.status;
	job.state.lastStatus = result.status;
	job.state.lastDurationMs = Math.max(0, result.endedAt - result.startedAt);
	job.state.lastError = result.error;
	job.state.lastDiagnostics = normalizeCronRunDiagnostics(result.diagnostics);
	job.state.lastDiagnosticSummary = summarizeCronRunDiagnostics(job.state.lastDiagnostics);
	job.state.lastErrorReason = result.status === "error" && typeof result.error === "string" ? resolveCronRunErrorReason(result.error, result.provider, result.errorClassification) : void 0;
	if (result.status === "error") state.deps.log.warn({
		jobId: job.id,
		jobName: job.name,
		error: result.error,
		diagnosticsSummary: job.state.lastDiagnosticSummary
	}, "cron: job run returned error status");
	const deliveryState = result.deliveryState ?? resolveDeliveryState({
		job,
		runStatus: result.status,
		delivery: result.delivery,
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		error: result.deliveryError ?? result.error,
		deliverySuppressionReason: result.deliverySuppressionReason
	});
	job.state.lastDelivered = deliveryState.delivered;
	job.state.lastDeliveryStatus = deliveryState.status;
	job.state.deliverySuppressionReason = deliveryState.deliverySuppressionReason;
	job.state.lastDeliveryError = deliveryState.error;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "not-requested";
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.updatedAtMs = result.endedAt;
	const completionStatus = result.completionStatus ?? resolveAdmittedCronCompletionStatus(job, result.status, deliveryState.status, deliveryState.deliverySuppressionReason);
	const previousConsecutiveErrors = job.state.consecutiveErrors ?? 0;
	const computeNaturalNext = (restartInterval) => {
		try {
			return restartInterval && job.schedule.kind === "every" ? computeNextRunAtMs(job.schedule, result.endedAt) : computeJobNextRunAtMs(job, result.endedAt);
		} catch (err) {
			recordScheduleComputeError({
				state,
				job,
				err,
				deferredNotifications: opts.deferredNotifications
			});
			return;
		}
	};
	const alertConfig = resolveFailureAlert(state, job);
	if (result.status === "error") {
		job.state.consecutiveErrors = (job.state.consecutiveErrors ?? 0) + 1;
		job.state.consecutiveSkipped = 0;
	} else if (result.status === "skipped") {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = (job.state.consecutiveSkipped ?? 0) + 1;
		if (alertConfig?.includeSkipped && !opts.replay) maybeEmitFailureAlert(state, {
			job,
			alertConfig,
			status: "skipped",
			error: result.error,
			runAtMs: result.startedAt,
			consecutiveCount: job.state.consecutiveSkipped,
			deferredNotifications: opts.deferredNotifications
		});
	} else {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = 0;
		if (completionStatus === "succeeded") job.state.lastFailureAlertAtMs = void 0;
	}
	const scheduleOwnershipAtMs = opts.scheduleOwnershipAtMs ?? result.startedAt;
	const oneShotOccurrenceAtMs = resolveManualOneShotOccurrenceAtMs(job, scheduleOwnershipAtMs);
	const preserveOneShotSchedule = opts.scheduleMode === "preserve" && oneShotOccurrenceAtMs !== void 0;
	const ownsSchedule = opts.scheduleOwnership !== "stale";
	const isOneShotSchedule = job.schedule.kind === "at" || job.schedule.kind === "on-exit";
	const shouldDelete = ownsSchedule && isOneShotSchedule && !preserveOneShotSchedule && job.deleteAfterRun === true && completionStatus === "succeeded";
	let autoDisableNotificationOwnsFailure = false;
	const applyReplaySchedule = () => {
		const nextRunAtMs = job.state.autoDisabled ? void 0 : opts.replaySchedule?.nextRunAtMs;
		job.state.nextRunAtMs = nextRunAtMs === void 0 ? void 0 : scheduleNextRun(nextRunAtMs);
	};
	const finish = () => {
		if (opts.replaySchedule && job.schedule.kind !== "at") applyReplaySchedule();
		finalizeCronFailureNotifications(state, {
			job,
			alertConfig,
			result,
			completionStatus,
			autoDisableNotificationOwnsFailure,
			replay: opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
		return shouldDelete;
	};
	if (!ownsSchedule) {
		job.enabled = previousScheduleState.enabled;
		job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
		job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = previousScheduleState.forcePreservedNextRunAtMs;
	} else if (!shouldDelete) {
		if (preserveOneShotSchedule) {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = oneShotOccurrenceAtMs;
		} else if (opts.replaySchedule && job.schedule.kind === "at") {
			applyReplaySchedule();
			job.enabled = job.state.nextRunAtMs !== void 0;
		} else if (job.schedule.kind === "at" && isJobEnabled(job)) {
			if (shouldRetryDisabledHeartbeatOneShot(job, result)) {
				const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({
					cronConfig: state.deps.cronConfig,
					consecutiveSkipped: job.state.consecutiveSkipped
				});
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) state.deps.log.info({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						backoffMs: retryDecision.backoffMs,
						nextRunAtMs: job.state.nextRunAtMs
					}, "cron: scheduling one-shot retry after disabled heartbeat");
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						reason: retryDecision.reason
					}, "cron: disabling one-shot job after disabled heartbeat retries");
				}
			} else if (result.status === "ok" || result.status === "skipped") {
				job.enabled = false;
				job.state.nextRunAtMs = void 0;
			} else if (result.status === "error") {
				const retryDecision = resolveTransientCronRetryDecision({
					cronConfig: state.deps.cronConfig,
					error: result.error,
					errorClassification: result.errorClassification,
					lastErrorReason: job.state.lastErrorReason,
					executionStarted: result.executionStarted,
					consecutiveErrors: job.state.consecutiveErrors
				});
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) state.deps.log.info({
						jobId: job.id,
						jobName: job.name,
						consecutiveErrors: retryDecision.consecutiveErrors,
						backoffMs: retryDecision.backoffMs,
						nextRunAtMs: job.state.nextRunAtMs,
						retryCategory: retryDecision.retryCategory
					}, "cron: scheduling one-shot retry after transient error");
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveErrors: retryDecision.consecutiveErrors,
						error: result.error,
						reason: retryDecision.reason,
						retryCategory: retryDecision.retryCategory
					}, "cron: disabling one-shot job after error");
				}
			}
		} else if (opts.scheduleMode === "preserve") {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = previousScheduleState.nextRunAtMs;
		} else if (result.status === "error" && isJobEnabled(job) && maybeAutoDisableCronJobAfterRunFailure({
			job,
			atMs: result.endedAt,
			deferredNotifications: opts.deferredNotifications
		})) {
			autoDisableNotificationOwnsFailure = true;
			state.deps.log.error({
				jobId: job.id,
				name: job.name,
				consecutiveErrors: job.state.consecutiveErrors,
				error: result.error
			}, "cron: auto-disabled job after consecutive run failures");
		} else if (result.status === "error" && isJobEnabled(job)) {
			const retryDecision = resolveTransientCronRetryDecision({
				cronConfig: state.deps.cronConfig,
				error: result.error,
				errorClassification: result.errorClassification,
				lastErrorReason: job.state.lastErrorReason,
				executionStarted: result.executionStarted,
				consecutiveErrors: job.state.consecutiveErrors
			});
			let normalNext;
			let normalNextComputed = false;
			const computeNormalNext = () => {
				if (!normalNextComputed) {
					normalNext = computeNaturalNext(retryDecision.retryable || previousConsecutiveErrors > 0);
					normalNextComputed = true;
				}
				return normalNext;
			};
			if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
				normalNext = computeNormalNext();
				if (normalNext === void 0) {} else {
					const retryNextRunAtMs = scheduleNextRun(result.endedAt + retryDecision.backoffMs);
					if (retryNextRunAtMs === void 0) return finish();
					if (retryNextRunAtMs < normalNext) {
						state.deps.log.info({
							jobId: job.id,
							jobName: job.name,
							consecutiveErrors: retryDecision.consecutiveErrors,
							backoffMs: retryDecision.backoffMs,
							nextRunAtMs: job.state.nextRunAtMs,
							normalNextRunAtMs: normalNext,
							retryCategory: retryDecision.retryCategory
						}, "cron: scheduling recurring retry after transient error");
						return finish();
					}
				}
			}
			const backoff = errorBackoffMs(job.state.consecutiveErrors ?? 1, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			normalNext = computeNormalNext();
			if (normalNext === void 0 && job.schedule.kind === "every") {
				scheduleNextRun(void 0);
				return finish();
			}
			const backoffNext = scheduleNextRun(result.endedAt + backoff);
			if (backoffNext === void 0) return finish();
			job.state.nextRunAtMs = job.schedule.kind === "cron" ? resolveCronNextRunWithLowerBound({
				state,
				job,
				naturalNext: normalNext,
				lowerBoundMs: backoffNext,
				deferredNotifications: opts.deferredNotifications
			}) : normalNext !== void 0 ? Math.max(normalNext, backoffNext) : backoffNext;
			state.deps.log.info({
				jobId: job.id,
				consecutiveErrors: job.state.consecutiveErrors,
				backoffMs: backoff,
				nextRunAtMs: job.state.nextRunAtMs
			}, "cron: applying error backoff");
		} else if (isJobEnabled(job) && result.status === "ok" && job.pacing !== void 0 && result.nextCheck !== void 0) {
			const pacedNextRunAtMs = resolvePacedNextRunAtMs({
				nowMs: result.endedAt,
				delayMs: result.nextCheck.delayMs,
				pacing: job.pacing
			});
			const nextRunAtMs = scheduleNextRun(job.trigger ? Math.max(pacedNextRunAtMs ?? NaN, result.endedAt + Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs())) : pacedNextRunAtMs);
			job.state.pacedNextRunAtMs = nextRunAtMs;
		} else if (isJobEnabled(job)) {
			const naturalNext = computeNaturalNext(previousConsecutiveErrors > 0);
			if (job.schedule.kind === "cron") {
				const minNext = result.endedAt + Math.max(MIN_REFIRE_GAP_MS, job.trigger ? resolveCronTriggerMinIntervalMs() : 0);
				job.state.nextRunAtMs = resolveCronNextRunWithLowerBound({
					state,
					job,
					naturalNext,
					lowerBoundMs: minNext,
					deferredNotifications: opts.deferredNotifications
				});
			} else {
				const triggerNext = naturalNext !== void 0 && job.trigger ? Math.max(naturalNext, result.endedAt + resolveCronTriggerMinIntervalMs()) : naturalNext;
				job.state.nextRunAtMs = triggerNext;
				if (triggerNext !== void 0 || job.schedule.kind === "every") scheduleNextRun(triggerNext);
			}
		} else job.state.nextRunAtMs = void 0;
	}
	return finish();
}
/** Commits payload-script state only after the complete cron run succeeds. */
function applyScriptRunResult(job, result, opts) {
	if (opts?.triggerOwnership !== "stale" && result.status === "ok" && result.scriptStateChanged === true) job.state.triggerState = result.scriptState;
}
/** Applies a quiet trigger tick without mutating normal run-history state. */
function applyTriggerNoFireResult(state, job, result, opts) {
	const previousNextRunAtMs = job.state.nextRunAtMs;
	const previousPacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const previousForcePreservedNextRunAtMs = job.state.forcePreservedNextRunAtMs;
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.updatedAtMs = result.endedAt;
	if (!result.triggerEval.busy && opts.triggerOwnership !== "stale") {
		job.state.consecutiveErrors = 0;
		job.state.scheduleErrorCount = 0;
		applyTriggerEvaluationState(job, result.triggerEval, result.endedAt);
		maybeEmitFailureRecovery({
			job,
			alertConfig: resolveFailureAlert(state, job),
			triggerOnly: true,
			replay: opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
	}
	if (opts.scheduleMode === "immediate-preserve" || opts.scheduleMode === "stale-preserve") {
		job.state.nextRunAtMs = previousNextRunAtMs;
		job.state.pacedNextRunAtMs = previousPacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = opts.scheduleMode === "immediate-preserve" ? previousNextRunAtMs : previousForcePreservedNextRunAtMs;
		return;
	}
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	try {
		const naturalNext = computeJobNextRunAtMs(job, result.endedAt);
		const floorMs = Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs());
		job.state.nextRunAtMs = naturalNext;
		if (naturalNext !== void 0 || job.schedule.kind === "every") assignNextRunAtMs({
			state,
			job,
			candidate: naturalNext === void 0 ? void 0 : Math.max(naturalNext, result.endedAt + floorMs),
			deferredNotifications: opts.deferredNotifications
		});
	} catch (err) {
		recordScheduleComputeError({
			state,
			job,
			err,
			deferredNotifications: opts.deferredNotifications
		});
	}
}
function applyOutcomeToStoredJob(state, result, opts) {
	const store = state.store;
	if (!store) {
		tryFinishCronTaskRunWithoutHistory(state, result);
		return;
	}
	const jobs = store.jobs;
	const job = jobs.find((entry) => entry.id === result.jobId);
	if (!job || result.activeJobMarker?.jobRemoved === true) {
		if (result.status === "ok" && result.triggerEval?.fired === false) {
			tryFinishCronTaskRunWithoutHistory(state, result);
			return;
		}
		applyJobResult(state, result.job, result, {
			scheduleOwnership: "stale",
			deferredNotifications: opts.deferredNotifications
		});
		emitCronOutcomeForJob(state, result.job, result);
		state.deps.log.info({
			jobId: result.jobId,
			status: result.status
		}, "cron: finalized run after job was removed during execution");
		return;
	}
	if (applyOutcomeToAuthoritativeJob(state, job, result, opts)) {
		store.jobs = jobs.filter((entry) => entry.id !== job.id);
		return job;
	}
}
/** Applies one outcome to a row already re-read under the runtime write transaction. */
function applyOutcomeToAuthoritativeJob(state, job, result, opts) {
	const scheduleOwnership = resolveCronRunScheduleOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	const triggerOwnership = opts.triggerStateRetired ? "stale" : resolveCronRunTriggerOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) {
		applyTriggerNoFireResult(state, job, {
			startedAt: result.startedAt,
			endedAt: result.endedAt,
			triggerEval: result.triggerEval
		}, {
			scheduleMode: scheduleOwnership === "stale" ? "stale-preserve" : opts.request?.preserveCadence ? "immediate-preserve" : "advance",
			triggerOwnership,
			deferredNotifications: opts.deferredNotifications
		});
		if (!opts.request) job.state.startupCatchupAtMs = void 0;
		if (!opts.request && scheduleOwnership === "current") job.state.pacedNextRunAtMs = void 0;
		return false;
	}
	const shouldDelete = applyJobResult(state, job, result, {
		scheduleMode: opts.request?.preserveCadence && scheduleOwnership === "current" ? "preserve" : "advance",
		scheduleOwnership,
		scheduleOwnershipAtMs: opts.request?.scheduleOwnershipAtMs,
		deferredNotifications: opts.deferredNotifications
	});
	applyTriggerRunResult(job, result, {
		scheduleOwnership,
		triggerOwnership
	});
	applyScriptRunResult(job, result, { triggerOwnership });
	if (opts.request) {
		if (job.schedule.kind === "stream") job.state.nextRunAtMs = void 0;
	} else job.state.startupCatchupAtMs = void 0;
	if (opts.emit !== false) emitCronOutcomeForJob(state, job, result);
	return shouldDelete;
}
//#endregion
//#region src/cron/service/run-owner.ts
/** Records ownerless scheduled attempts before one invalid job can block batch admission. */
function skipCronJobsWithoutOwners(state, candidates, nowMs, opts) {
	const resolveOwnerAgentId = (job) => tryResolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId);
	const unresolved = new Map(candidates.filter((job) => !resolveOwnerAgentId(job)).map((job) => [job.id, job]));
	if (unresolved.size === 0) return candidates;
	const notifications = [];
	const skipped = commitCronRuntimeRows({
		state,
		jobIds: unresolved.keys(),
		operationLabel: "cron.unresolved-owner",
		mutate: ({ database, jobs }) => {
			const committed = [];
			const rejected = [];
			for (const [jobId, job] of jobs) {
				const planned = unresolved.get(jobId);
				if (!planned || job.enabled !== planned.enabled || job.state.nextRunAtMs !== planned.state.nextRunAtMs || job.state.lastRunAtMs !== planned.state.lastRunAtMs || job.state.lastRunStatus !== planned.state.lastRunStatus || resolveCronJobConfigRevision(job) !== resolveCronJobConfigRevision(planned) || hasActiveCronRun(job) || findActiveCronRunReceiptInDatabase({
					database,
					storePath: state.deps.storePath,
					jobId
				}) || resolveOwnerAgentId(job)) {
					if (planned) rejected.push(job);
					continue;
				}
				applyJobResult(state, job, {
					status: "skipped",
					completionStatus: "failed",
					error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE,
					executionStarted: false,
					startedAt: nowMs,
					endedAt: nowMs
				}, {
					deferredNotifications: notifications,
					scheduleMode: opts?.scheduleMode,
					scheduleOwnershipAtMs: opts?.manualRun?.scheduleOwnershipAtMs
				});
				committed.push(job);
			}
			return {
				upsertJobIds: committed.map((job) => job.id),
				value: {
					committed,
					rejected
				}
			};
		}
	});
	applyCronRuntimeRowsToState(state, skipped.committed);
	for (const job of skipped.committed) {
		state.deps.log.warn({
			jobId: job.id,
			error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE
		}, "cron: skipping job with unresolved owner");
		emitOwnerlessFinished(state, job, nowMs, opts?.manualRun);
	}
	if (opts?.manualRun) for (const job of skipped.rejected) emitOwnerlessFinished(state, job, nowMs, opts.manualRun);
	runPostPersistCronNotifications(state, notifications);
	return candidates.filter((job) => !unresolved.has(job.id));
}
function emitOwnerlessFinished(state, job, nowMs, manualRun) {
	const event = {
		jobId: job.id,
		action: "finished",
		job,
		status: "skipped",
		completionStatus: "failed",
		error: CRON_AGENT_SELECTION_REQUIRED_MESSAGE,
		runId: manualRun?.runId,
		runAtMs: nowMs,
		durationMs: 0,
		nextRunAtMs: job.state.nextRunAtMs,
		deliveryStatus: job.state.lastDeliveryStatus,
		deliveryError: job.state.lastDeliveryError
	};
	tryFinishCronTaskRun(state, {
		event,
		ownerlessRun: true
	});
	emit(state, event);
	if (manualRun?.terminalTracker) manualRun.terminalTracker.emitted = true;
}
//#endregion
//#region src/cron/store/run-receipt-trigger-state.ts
const RETIREMENTS_TABLE = "cron_run_trigger_state_retirements";
function query(database) {
	return getNodeSqliteKysely(database);
}
function stateWriterQuery(database, handle) {
	return query(database).selectFrom("cron_run_receipts").where("cron_run_receipts.receipt_id", "=", handle.receiptId).where("cron_run_receipts.store_key", "=", handle.storeKey).where("cron_run_receipts.job_id", "=", handle.jobId).where("cron_run_receipts.started_at_ms", "=", handle.startedAtMs);
}
function ensureRetirementsTable(database) {
	if (tableExists(database, RETIREMENTS_TABLE)) return;
	const start = TESTCLAW_STATE_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${RETIREMENTS_TABLE} (`);
	const end = TESTCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start);
	if (start < 0 || end < start) throw new Error("Assistant cron run trigger-state retirement schema is missing.");
	database.exec(TESTCLAW_STATE_SCHEMA_SQL.slice(start, end + 10));
}
/** Retires the exact pending state writer in the acknowledged edit's transaction. */
function retireCronRunTriggerStateInDatabase(params) {
	const { database, handle } = params;
	const receipt = executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).select(["receipt_id", "started_at_ms"]));
	if (!receipt) return;
	const job = loadedCronStoreFromRows(loadCronRows(database, handle.storeKey, /* @__PURE__ */ new Set([handle.jobId]))).store.jobs[0];
	if (job?.state.runningAtMs !== receipt.started_at_ms || job.state.runningReceiptId !== void 0 && job.state.runningReceiptId !== receipt.receipt_id) return;
	ensureRetirementsTable(database);
	executeSqliteQuerySync(database, query(database).insertInto(RETIREMENTS_TABLE).values({ receipt_id: receipt.receipt_id }).onConflict((conflict) => conflict.column("receipt_id").doNothing()));
}
/** Reads retirement after write admission without changing execution authority. */
function isCronRunTriggerStateRetiredInDatabase(params) {
	const { database, handle } = params;
	if (!tableExists(database, RETIREMENTS_TABLE)) return false;
	return executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).innerJoin(RETIREMENTS_TABLE, `${RETIREMENTS_TABLE}.receipt_id`, "cron_run_receipts.receipt_id").select("cron_run_receipts.receipt_id")) !== void 0;
}
//#endregion
//#region src/cron/service/run-receipts.ts
function currentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
function resolveCronRunReceiptAgentId(state, job) {
	return resolveCronJobEffectiveAgentId(job, currentDefaultAgentId(state));
}
function resolveAgentId(state) {
	return (job) => resolveCronRunReceiptAgentId(state, job);
}
/** Both admission paths bind message permissions from the same canonical occurrence. */
function markServiceCronJobActive(state, job, runReceipt) {
	return markCronJobActive(job.id, {
		agentId: runReceipt.agentId,
		declarationKey: job.declarationKey,
		preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(job),
		isMessageActionAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageToolAuthorityInputs
		}),
		isMessageSourceAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageActionAuthorityInputs
		})
	});
}
/** Retains admission's permission facts while consulting the existing canonical receipt owner. */
function createServiceCronRunMessageAuthorityChecker(params) {
	const expected = params.resolveInputs(params.job);
	if (!expected) return;
	const { state, handle } = params;
	const admittedEnabled = isJobEnabled(params.job);
	return () => {
		let current;
		try {
			current = readCronRunReceiptCurrentJob({
				handle,
				resolveAgentId: resolveAgentId(state),
				isAgentAvailable: state.deps.isAgentAvailable
			});
		} catch (error) {
			if (error instanceof CronRunReceiptRevisionError) return false;
			throw error;
		}
		return current !== void 0 && (!admittedEnabled || isJobEnabled(current)) && isDeepStrictEqual(expected, params.resolveInputs(current));
	};
}
function prepareServiceCronRunReceiptClaim(params) {
	return prepareCronRunReceiptClaim({
		storePath: params.state.deps.storePath,
		job: params.job,
		agentId: resolveCronRunReceiptAgentId(params.state, params.job),
		startedAtMs: params.startedAtMs,
		requestRunId: params.requestRunId
	});
}
function claimServiceCronRunReceiptInDatabase(state, database, prepared) {
	return claimCronRunReceiptInDatabase({
		database,
		prepared,
		resolveAgentId: resolveAgentId(state)
	});
}
function activateServiceCronRunReceiptInDatabase(state, database, handle, startedAtMs) {
	return activateCronRunReceiptInDatabase({
		database,
		handle,
		startedAtMs,
		resolveAgentId: resolveAgentId(state)
	});
}
function cronRunReceiptOwnerMutationHooks(params) {
	const prepared = prepareCronRunReceiptAdjudication({
		storePath: params.state.deps.storePath,
		jobId: params.jobId,
		nowMs: params.state.deps.nowMs()
	});
	return { beforeWrite: (database) => {
		adjudicateActiveCronRunReceiptInDatabase({
			database,
			jobId: params.jobId,
			prepared,
			finishedAtMs: params.state.deps.nowMs()
		});
	} };
}
function cronRunReceiptMutationHooks(params) {
	const ownerHooks = params.ownerChanged ? cronRunReceiptOwnerMutationHooks(params) : void 0;
	if (!ownerHooks && !params.triggerStateChanged && !params.scheduleChangedJob && !params.messageActionAuthorityChanged && !params.messageSourceAuthorityChanged) return;
	return {
		...ownerHooks,
		beforeWrite: (database) => {
			if (params.scheduleChangedJob) {
				if (loadedCronStoreFromRows(loadCronRows(database, cronStoreKey(params.state.deps.storePath), /* @__PURE__ */ new Set([params.jobId]))).store.jobs[0]?.state.runningAtMs !== void 0) params.scheduleChangedJob.state.runningScheduleChangeId = randomUUID();
				else delete params.scheduleChangedJob.state.runningScheduleChangeId;
			}
			if (params.triggerStateChanged) retireServiceCronRunTriggerStateInDatabase({
				...params,
				database
			});
			ownerHooks?.beforeWrite?.(database);
		},
		afterCommit: () => {
			ownerHooks?.afterCommit?.();
			if (params.messageActionAuthorityChanged) noteActiveCronJobMessageActionAuthorityMutation(params.jobId);
			if (params.messageSourceAuthorityChanged) noteActiveCronJobMessageSourceAuthorityMutation(params.jobId);
			if (params.scheduleChangedJob) noteActiveCronJobScheduleMutation(params.jobId);
		}
	};
}
function retireServiceCronRunTriggerStateInDatabase(params) {
	const { database, jobId } = params;
	const storePath = params.state.deps.storePath;
	const active = findActiveCronRunReceiptInDatabase({
		database,
		storePath,
		jobId
	});
	if (active) {
		retireCronRunTriggerStateInDatabase({
			database,
			handle: active
		});
		return;
	}
	const storeKey = cronStoreKey(storePath);
	const job = loadedCronStoreFromRows(loadCronRows(database, storeKey, /* @__PURE__ */ new Set([jobId]))).store.jobs[0];
	const startedAtMs = job?.state.runningAtMs;
	if (!job || startedAtMs === void 0) return;
	const receiptId = job.state.runningReceiptId ?? findCronTaskRunRecoveryInDatabase({
		database,
		jobId,
		storeKey,
		startedAt: startedAtMs
	}).receiptId;
	if (receiptId) retireCronRunTriggerStateInDatabase({
		database,
		handle: {
			receiptId,
			storeKey,
			jobId,
			startedAtMs
		}
	});
}
function assertServiceCronRunReceiptCurrent(state, handle, activeJobMarker) {
	assertCronRunReceiptCurrent({
		handle,
		resolveAgentId: resolveAgentId(state),
		isAgentAvailable: state.deps.isAgentAvailable,
		allowMissingJob: activeJobMarker?.jobId === handle.jobId && isCronSelfRemovalCurrent(activeJobMarker)
	});
}
function resolveCronRunReceiptTerminalStatus(status, triggerFired) {
	if (status === "ok") return triggerFired === false ? "skipped" : "ok";
	return status === "skipped" ? "skipped" : "error";
}
function logReceiptFinishError(state, handle, error) {
	state.deps.log.warn({
		jobId: handle.jobId,
		err: String(error)
	}, "cron: failed to finalize run receipt after execution settlement");
}
function finishReceiptAfterCommit(state, terminal) {
	try {
		finishCronRunReceipt(terminal);
	} catch (error) {
		logReceiptFinishError(state, terminal.handle, error);
	}
}
function trackServiceCronRunReceiptSettlement(params) {
	trackCronRunReceiptSettlement({
		handle: params.handle,
		settlement: params.settlement,
		onFinishError: (error) => logReceiptFinishError(params.state, params.handle, error)
	});
}
function cronRunReceiptPersistHooks(params) {
	const terminal = params.terminal ? {
		handle: params.handle,
		status: resolveCronRunReceiptTerminalStatus(params.terminal.status, params.terminal.triggerFired),
		finishedAtMs: params.terminal.finishedAtMs,
		error: params.terminal.error
	} : void 0;
	const deferTerminal = terminal && isCronRunReceiptSettlementPending(params.handle);
	return {
		beforeWrite: (database) => {
			const unavailableError = describeUnavailableCronAgent(params.handle.agentId);
			const recordsUnavailableGuard = terminal?.status === "error" && params.terminal?.disposition === "owner-unavailable";
			if (params.state.deps.isAgentAvailable?.(params.handle.agentId) === false && !recordsUnavailableGuard) throw new CronRunReceiptRevisionError(params.handle.receiptId, unavailableError, "owner-unavailable");
			if (params.allowMissingJob) assertCronRunReceiptOwnedInDatabase({
				database,
				handle: params.handle
			});
			else assertCronRunReceiptCurrentInDatabase({
				database,
				handle: params.handle,
				resolveAgentId: resolveAgentId(params.state)
			});
		},
		...terminal && !deferTerminal ? { afterWrite: (database) => {
			finishCronRunReceiptInDatabase({
				database,
				...terminal
			});
		} } : {},
		...terminal && deferTerminal ? { afterCommit: () => finishReceiptAfterCommit(params.state, terminal) } : {}
	};
}
function cronRunReceiptSupersedeHooks(params) {
	const terminal = {
		handle: params.handle,
		status: "superseded",
		finishedAtMs: params.finishedAtMs,
		error: params.error
	};
	if (isCronRunReceiptSettlementPending(params.handle)) return { afterCommit: () => finishReceiptAfterCommit(params.state, terminal) };
	return { afterWrite: (database) => {
		finishCronRunReceiptInDatabase({
			database,
			...terminal
		});
	} };
}
function supersedeServiceCronRunReceipt(handle, finishedAtMs, error) {
	finishCronRunReceipt({
		handle,
		status: "superseded",
		finishedAtMs,
		error
	});
}
//#endregion
//#region src/cron/service/agent-watchdog.ts
const CRON_TIMEOUT_CLEANUP_GUARD_MS = 2e4;
const CRON_AGENT_SETUP_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS = 1e3;
const CRON_AGENT_PHASE_WATCHDOG_STAGE = {
	runner_entered: "pre_execution",
	workspace: "pre_execution",
	runtime_plugins: "pre_execution",
	before_agent_reply: "execution",
	model_resolution: "pre_execution",
	auth: "pre_execution",
	context_engine: "pre_execution",
	attempt_dispatch: "execution",
	context_assembled: "execution",
	turn_accepted: "execution",
	process_spawned: "execution",
	tool_execution_started: "execution",
	assistant_output_started: "execution",
	model_call_started: "execution"
};
/** Tracks isolated-agent setup/execution progress and fires the correct cron timeout reason. */
function createCronAgentWatchdog(params) {
	let state = params.deferUntilRunner ? "waiting_for_runner" : "executing";
	let timeoutId;
	let setupTimeoutId;
	let preExecutionTimeoutId;
	let activeExecution;
	let observedLaneWait = false;
	let waitingForLane = false;
	const setTimedOut = (reason) => {
		if (state === "timed_out" || state === "disposed") return;
		state = "timed_out";
		params.triggerTimeout(reason);
	};
	const startTimeout = () => {
		if (timeoutId || state === "disposed") return;
		timeoutId = setTimeout(() => {
			setTimedOut(timeoutErrorMessage(activeExecution));
		}, params.jobTimeoutMs);
	};
	const clearSetupTimeout = () => {
		if (!setupTimeoutId) return;
		clearTimeout(setupTimeoutId);
		setupTimeoutId = void 0;
	};
	const startSetupTimeout = () => {
		if (setupTimeoutId || state !== "waiting_for_runner" || waitingForLane) return;
		setupTimeoutId = setTimeout(() => {
			if (state === "waiting_for_runner" && !waitingForLane) setTimedOut(setupTimeoutErrorMessage(activeExecution));
		}, CRON_AGENT_SETUP_WATCHDOG_MS);
	};
	const clearPreExecutionTimeout = () => {
		if (!preExecutionTimeoutId) return;
		clearTimeout(preExecutionTimeoutId);
		preExecutionTimeoutId = void 0;
	};
	const isWaitingForExecution = () => state === "waiting_for_initial_progress" || state === "waiting_for_fallback_execution";
	const startPreExecutionTimeout = () => {
		if (preExecutionTimeoutId || !isWaitingForExecution()) return;
		preExecutionTimeoutId = setTimeout(() => {
			if (isWaitingForExecution()) setTimedOut(preExecutionTimeoutErrorMessage(activeExecution));
		}, resolveCronAgentPreExecutionWatchdogMs(params.jobTimeoutMs));
	};
	const noteExecutionProgress = (info) => {
		if (!info) return;
		activeExecution = {
			...activeExecution,
			...info
		};
		const stage = info.phase ? CRON_AGENT_PHASE_WATCHDOG_STAGE[info.phase] : void 0;
		if (state === "waiting_for_initial_progress" && info.phase !== void 0 && info.phase !== "runner_entered" || state === "waiting_for_fallback_execution" && stage === "execution") {
			state = "executing";
			clearPreExecutionTimeout();
		}
	};
	return {
		start: () => {
			if (params.deferUntilRunner) {
				startSetupTimeout();
				return;
			}
			startTimeout();
		},
		replaceTimeout: (timeoutMs) => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = timeoutMs !== void 0 && state !== "timed_out" && state !== "disposed" ? setTimeout(() => setTimedOut(timeoutErrorMessage(activeExecution)), timeoutMs) : void 0;
		},
		noteLaneWait: () => {
			if (state === "waiting_for_runner") {
				observedLaneWait = true;
				waitingForLane = true;
				clearSetupTimeout();
			}
		},
		noteLaneAdmitted: () => {
			if (state === "waiting_for_runner") {
				observedLaneWait = false;
				waitingForLane = false;
				startSetupTimeout();
			}
		},
		noteRunnerStarted: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			clearSetupTimeout();
			startTimeout();
			if (info?.isFallback === true) {
				clearPreExecutionTimeout();
				state = "waiting_for_fallback_execution";
			} else if (state === "waiting_for_runner") state = "waiting_for_initial_progress";
			noteExecutionProgress(info);
			startPreExecutionTimeout();
		},
		notePhase: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			noteExecutionProgress(info);
		},
		activeExecution: () => activeExecution,
		observedLaneWait: () => observedLaneWait,
		dispose: () => {
			state = "disposed";
			if (timeoutId) clearTimeout(timeoutId);
			clearSetupTimeout();
			clearPreExecutionTimeout();
		}
	};
}
/** Joins timeout cleanup and command settlement without wedging the cron lane. */
async function settleTimedOutCronRun(state, job, timeoutMs, execution, commandSettlement) {
	const cleanupPromise = state.deps.cleanupTimedOutAgentRun?.({
		job,
		timeoutMs,
		execution
	});
	if (!cleanupPromise && !commandSettlement) return;
	let settleTimer;
	const cleanup = cleanupPromise?.catch((err) => {
		state.deps.log.warn({
			jobId: job.id,
			err: String(err)
		}, "cron: timed-out agent cleanup failed");
	});
	const settleTimeout = new Promise((resolve) => {
		settleTimer = setTimeout(resolve, CRON_TIMEOUT_CLEANUP_GUARD_MS);
	});
	try {
		await Promise.race([Promise.allSettled([cleanup, commandSettlement]), settleTimeout]);
	} finally {
		if (settleTimer) clearTimeout(settleTimer);
	}
}
function resolveCronAgentPreExecutionWatchdogMs(jobTimeoutMs) {
	return Math.max(CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS, Math.min(CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS, Math.floor(jobTimeoutMs / 2)));
}
//#endregion
//#region src/cron/service/timeout-policy.ts
/** Resolves cron job wall-clock timeout policy. */
/**
* Maximum wall-clock time for a single job execution. Acts as a safety net
* on top of per-provider/per-agent timeouts to prevent one stuck job from
* wedging the entire cron lane.
*/
const DEFAULT_JOB_TIMEOUT_MS = 6e5;
/**
* Agent turns can legitimately run much longer than generic cron jobs.
* Use a larger safety ceiling when no explicit timeout is set.
*/
const AGENT_TURN_SAFETY_TIMEOUT_MS = 36e5;
/** Resolves the wall-clock timeout for a cron job, including explicit detached-run overrides. */
function resolveCronJobTimeoutMs(job) {
	const configuredTimeoutMs = (job.payload.kind === "agentTurn" || job.payload.kind === "command" || job.payload.kind === "script") && typeof job.payload.timeoutSeconds === "number" ? finiteSecondsToTimerSafeMilliseconds(job.payload.timeoutSeconds) ?? 0 : void 0;
	if (configuredTimeoutMs === void 0) return job.payload.kind === "agentTurn" ? AGENT_TURN_SAFETY_TIMEOUT_MS : DEFAULT_JOB_TIMEOUT_MS;
	return configuredTimeoutMs <= 0 ? void 0 : configuredTimeoutMs;
}
//#endregion
//#region src/cron/script-failure.ts
function classifyCronScriptFailure(code) {
	if (code === "timeout") return {
		kind: "reason",
		reason: "timeout"
	};
	if (code === "runtime_unavailable") return {
		kind: "reason",
		reason: "server_error"
	};
	return { kind: "permanent" };
}
/** Authors matched retry policy and safe notification detail from one closed code. */
function cronScriptFailureMetadata(source, code) {
	return {
		errorClassification: classifyCronScriptFailure(code),
		failureNotificationDetail: {
			kind: "script-failure",
			source,
			code
		}
	};
}
//#endregion
//#region src/cron/service/timer-execution.ts
/** Executes a cron job without mutating persisted job state. */
async function executeJobCore(state, job, abortSignal, options) {
	const resolveAbortError = () => ({
		status: "error",
		error: abortErrorMessage(abortSignal)
	});
	if (abortSignal?.aborted) return resolveAbortError();
	const execTargetRecoveryError = resolveCronToolsAllowExecTargetRecoveryError({
		jobId: job.id,
		requirement: job.toolsAllowExecTargetRequirement,
		execTarget: job.toolsAllowExecTarget
	});
	if (execTargetRecoveryError) return {
		status: "error",
		error: execTargetRecoveryError,
		diagnostics: createCronRunDiagnosticsFromError("cron-preflight", execTargetRecoveryError, { nowMs: state.deps.nowMs })
	};
	if (options?.streamScheduleKey !== void 0 || options?.streamSourceIdentity !== void 0) {
		const currentKey = job.schedule.kind === "stream" ? cronStreamScheduleKey(job.schedule) : void 0;
		if (options.streamScheduleKey === void 0 || options.streamSourceIdentity === void 0 || currentKey !== options.streamScheduleKey || job.state.streamSourceIdentity !== options.streamSourceIdentity) return {
			status: "skipped",
			error: "stream batch source no longer current"
		};
	}
	let effectiveJob = job;
	let triggerEval;
	if (job.trigger) {
		const evaluator = state.deps.evaluateCronTrigger;
		if (!evaluator) return {
			status: "error",
			error: "cron trigger evaluator is unavailable",
			...cronScriptFailureMetadata("trigger", "runtime_unavailable")
		};
		const evaluation = await evaluator({
			job,
			script: job.trigger.script,
			state: job.state.triggerState,
			streamBatch: options?.streamBatch,
			abortSignal,
			executionIdentity: options?.executionIdentity
		});
		if (abortSignal?.aborted) return resolveAbortError();
		if (evaluation.kind === "busy") {
			state.deps.log.debug({ jobId: job.id }, "cron: trigger evaluation skipped while busy");
			return {
				status: "ok",
				triggerEval: {
					fired: false,
					stateChanged: false,
					busy: true
				}
			};
		}
		if (evaluation.kind === "error") return {
			status: "error",
			error: `cron trigger evaluation failed (${evaluation.code}): ${evaluation.error}`,
			...cronScriptFailureMetadata("trigger", evaluation.code),
			triggerEval: {
				fired: false,
				stateChanged: false
			}
		};
		const stateChanged = Object.hasOwn(evaluation, "state");
		triggerEval = {
			fired: evaluation.fire,
			stateChanged,
			...stateChanged ? { state: evaluation.state } : {}
		};
		if (!evaluation.fire) return {
			status: "ok",
			triggerEval
		};
		if (evaluation.message !== void 0) effectiveJob = {
			...job,
			payload: appendCronPayloadText(job.payload, evaluation.message)
		};
	}
	options?.assertRunCurrent?.();
	options?.onPayloadExecutionStarted?.();
	if (effectiveJob.payload.kind === "script") {
		const result = await executeScriptCronJob(state, effectiveJob, abortSignal, options);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (options?.streamBatch !== void 0) effectiveJob = {
		...effectiveJob,
		payload: appendCronPayloadText(effectiveJob.payload, options.streamBatch)
	};
	const heartbeatTask = isHeartbeatTaskCronJob(effectiveJob) ? effectiveJob : void 0;
	if (effectiveJob.payload.kind === "heartbeat" || heartbeatTask) {
		const agentId = resolveCronJobEffectiveAgentId(effectiveJob, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
		const heartbeatWake = heartbeatTask ? {
			source: "interval",
			intent: "task",
			reason: `heartbeat-task:${heartbeatTask.id}`,
			agentId,
			tasks: [{
				jobId: heartbeatTask.id,
				name: heartbeatTask.name,
				prompt: heartbeatTask.payload.text
			}]
		} : {
			source: "interval",
			intent: "scheduled",
			reason: "interval",
			agentId,
			scheduledEveryMs: effectiveJob.schedule.kind === "every" ? effectiveJob.schedule.everyMs : void 0
		};
		const heartbeatWaitLifecycle = options?.onHeartbeatExecutionStarted?.(heartbeatWake);
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(options?.activeJobMarker, options?.owningCronLaneTaskMarker);
		let heartbeatResult;
		try {
			heartbeatResult = await (state.deps.requestHeartbeatAndWait?.(heartbeatWake, {
				...abortSignal ? { abortSignal } : {},
				...heartbeatWaitLifecycle
			}) ?? {
				status: "failed",
				reason: "heartbeat wake settlement unavailable"
			});
		} finally {
			releaseHeartbeatWait();
		}
		if (abortSignal?.aborted) return resolveAbortError();
		const result = heartbeatResult.status === "ran" ? {
			status: "ok",
			summary: heartbeatTask ? "heartbeat task completed" : "heartbeat completed"
		} : heartbeatResult.status === "failed" ? {
			status: "error",
			error: `heartbeat failed: ${heartbeatResult.reason}`
		} : {
			status: "skipped",
			error: `heartbeat skipped: ${heartbeatResult.reason}`
		};
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (effectiveJob.sessionTarget === "main") {
		const result = await executeMainSessionCronJob(state, effectiveJob, abortSignal, options?.onHeartbeatExecutionStarted, options?.activeJobMarker, options?.owningCronLaneTaskMarker);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	const result = await executeDetachedCronJob(state, effectiveJob, abortSignal, options);
	return triggerEval ? {
		...result,
		triggerEval
	} : result;
}
async function executeMainSessionCronJob(state, job, abortSignal, onHeartbeatExecutionStarted, activeJobMarker, owningCronLaneTaskMarker) {
	const text = resolveJobPayloadTextForMain(job);
	if (!text) return {
		status: "skipped",
		error: job.payload.kind === "systemEvent" ? "main job requires non-empty systemEvent text" : "main job requires payload.kind=\"systemEvent\""
	};
	const agentId = resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
	const deliveryContext = resolveMainSessionCronDeliveryContext(state, job);
	const queuedSystemEvent = normalizeQueuedSystemEventHandle(state.deps.enqueueSystemEvent(text, {
		agentId,
		contextKey: `cron:${job.id}`,
		...deliveryContext ? { deliveryContext } : {}
	}));
	const heartbeatWake = {
		source: "cron",
		intent: job.wakeMode === "now" ? "immediate" : "event",
		reason: `cron:${job.id}`,
		agentId,
		heartbeat: { target: "last" }
	};
	const removeQueuedSystemEvent = () => removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
	if (job.wakeMode === "now" && state.deps.requestHeartbeatAndWait) {
		const heartbeatWaitLifecycle = onHeartbeatExecutionStarted?.(heartbeatWake);
		const waitStartedAt = state.deps.nowMs();
		const releaseHeartbeatWait = markCronJobWaitingForHeartbeat(activeJobMarker, owningCronLaneTaskMarker);
		let handedOff = false;
		let heartbeatResult;
		try {
			heartbeatResult = await state.deps.requestHeartbeatAndWait(heartbeatWake, {
				abortSignal,
				...heartbeatWaitLifecycle,
				stopWaitingOnRetry: (result, retryAtMs) => {
					const remainingMs = 12e4 - (state.deps.nowMs() - waitStartedAt);
					handedOff = result.reason === "cron-in-progress" || remainingMs <= 0 || retryAtMs - Date.now() > remainingMs;
					return handedOff;
				}
			});
		} catch (error) {
			removeQueuedSystemEvent();
			throw error;
		} finally {
			releaseHeartbeatWait();
		}
		if (abortSignal?.aborted) {
			removeQueuedSystemEvent();
			return {
				status: "error",
				error: timeoutErrorMessage()
			};
		}
		if (handedOff || heartbeatResult.status === "ran") return {
			status: "ok",
			summary: text
		};
		removeQueuedSystemEvent();
		return {
			status: heartbeatResult.status === "skipped" ? "skipped" : "error",
			error: heartbeatResult.reason,
			summary: text
		};
	}
	if (abortSignal?.aborted) {
		removeQueuedSystemEvent();
		return {
			status: "error",
			error: timeoutErrorMessage()
		};
	}
	state.deps.requestHeartbeat(heartbeatWake);
	return {
		status: "ok",
		summary: text
	};
}
async function executeDetachedCronJob(state, job, abortSignal, options) {
	const interrupted = () => {
		const error = abortErrorMessage(abortSignal);
		return {
			status: "error",
			error,
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
		};
	};
	if (job.payload.kind === "command") {
		if (!state.deps.runCommandJob) {
			const error = "cron command runner is not configured";
			return {
				status: "skipped",
				error,
				diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
					severity: "warn",
					nowMs: state.deps.nowMs
				})
			};
		}
		const res = await state.deps.runCommandJob({
			job,
			abortSignal
		});
		if (abortSignal?.aborted && !(abortSignal.reason instanceof Error && abortSignal.reason.name === "TimeoutError" && res.failureNotificationDetail?.kind === "command-timeout" && res.failureNotificationDetail.mode === "wall-clock")) return interrupted();
		return {
			status: res.status,
			error: res.error,
			errorClassification: res.errorClassification,
			deliveryError: res.deliveryError,
			deliverySuppressionReason: res.deliverySuppressionReason,
			deliveryState: res.deliveryState,
			summary: res.summary,
			delivered: res.delivered,
			deliveryAttempted: res.deliveryAttempted,
			delivery: res.delivery,
			diagnostics: res.diagnostics,
			failureNotificationDetail: res.failureNotificationDetail
		};
	}
	if (job.payload.kind !== "agentTurn") {
		const error = "isolated job requires payload.kind=\"agentTurn\" or \"command\"";
		return {
			status: "skipped",
			error,
			diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
				severity: "warn",
				nowMs: state.deps.nowMs
			})
		};
	}
	if (abortSignal?.aborted) return interrupted();
	const res = await state.deps.runIsolatedAgentJob({
		job,
		admissionSource: job.owner?.sessionKey || job.owner?.accountId || job.scheduledToolPolicy?.mode === "account" || job.payload.externalContentSource || job.toolsAllowProvenance?.channelRequester || job.toolsAllowProvenance && job.toolsAllowProvenance.callerOrigin?.kind !== "local" ? "requester-schedule" : "operator-schedule",
		message: job.payload.message,
		abortSignal,
		onExecutionStarted: options?.onExecutionStarted,
		onExecutionPhase: options?.onExecutionPhase,
		onLaneWait: options?.onLaneWait,
		executionIdentity: options?.executionIdentity
	});
	if (abortSignal?.aborted) return interrupted();
	return {
		status: res.status,
		error: res.error,
		errorClassification: res.errorClassification,
		executionStarted: res.executionStarted,
		deliveryError: res.deliveryError,
		deliverySuppressionReason: res.deliverySuppressionReason,
		deliveryState: res.deliveryState,
		nextCheck: res.nextCheck,
		summary: res.summary,
		delivered: res.delivered,
		deliveryAttempted: res.deliveryAttempted,
		delivery: res.delivery,
		sessionId: res.sessionId,
		sessionKey: res.sessionKey,
		diagnostics: res.diagnostics,
		failureNotificationDetail: res.failureNotificationDetail,
		model: res.model,
		provider: res.provider,
		usage: res.usage
	};
}
async function executeScriptCronJob(state, job, abortSignal, options) {
	if (state.deps.cronConfig?.triggers?.enabled === false) return {
		status: "error",
		error: "cron script payload execution is disabled because the operator set cron.triggers.enabled: false; remove it or set it to true to allow unattended scripts"
	};
	if (!state.deps.runScriptJob) return {
		status: "error",
		error: "cron script payload executor is unavailable",
		...cronScriptFailureMetadata("payload", "runtime_unavailable")
	};
	const result = await state.deps.runScriptJob({
		job,
		streamBatch: options?.streamBatch,
		abortSignal,
		executionIdentity: options?.executionIdentity
	});
	if (!isCronActiveJobMarkerCurrent(options?.activeJobMarker)) return {
		status: "error",
		error: "Gateway restarting."
	};
	if (abortSignal?.aborted) return {
		status: "error",
		error: abortErrorMessage(abortSignal)
	};
	options?.assertRunCurrent?.();
	if (result.status !== "ok") return result;
	if (result.nextCheck && !job.pacing) return {
		status: "error",
		error: "cron script payload returned nextCheck, but this job has no pacing bounds",
		...cronScriptFailureMetadata("payload", "invalid_input")
	};
	const notify = result.notify?.trim() ? result.notify : void 0;
	if (job.sessionTarget === "main" && notify || result.wake) {
		const agentId = resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId);
		const deliveryContext = job.sessionTarget === "main" ? resolveMainSessionCronDeliveryContext(state, job) : void 0;
		const eventOptions = {
			agentId,
			...deliveryContext ? { deliveryContext } : {}
		};
		if (job.sessionTarget === "main" && notify) state.deps.enqueueSystemEvent(notify, {
			...eventOptions,
			contextKey: `cron:${job.id}:script`
		});
		if (result.wake) {
			if (job.sessionTarget !== "main" || !notify) state.deps.enqueueSystemEvent(notify ?? `script job ${job.name} completed`, {
				...eventOptions,
				contextKey: `cron:${job.id}:script-wake`
			});
			state.deps.requestHeartbeat({
				source: result.wake === "now" ? "notifications-event" : "cron",
				intent: result.wake === "now" ? "immediate" : "event",
				reason: result.wake === "now" ? "wake" : `cron:${job.id}:script`,
				agentId
			});
		}
	}
	return {
		status: "ok",
		...notify ? { summary: notify } : {},
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		deliveryError: result.deliveryError,
		deliverySuppressionReason: result.deliverySuppressionReason,
		deliveryState: result.deliveryState,
		delivery: result.delivery,
		nextCheck: result.nextCheck,
		scriptStateChanged: result.stateChanged === true,
		...result.stateChanged === true ? { scriptState: result.state } : {}
	};
}
/** Clears the currently armed cron timer. */
function stopTimer(state) {
	if (state.timer) clearTimeout(state.timer);
	state.timer = null;
}
//#endregion
//#region src/cron/service/timer-job-runner.interruption.ts
function withPrimaryWebhookTrace(params) {
	const plan = resolveCronDeliveryPlan(params.job);
	const intended = params.result.delivery?.intended ?? {
		to: plan.to,
		source: "explicit"
	};
	return {
		...params.result,
		deliveryState: {
			status: params.delivered ? "delivered" : "not-delivered",
			delivered: params.delivered,
			error: params.error,
			deliverySuppressionReason: params.deliverySuppressionReason,
			failureNotification: { status: "not-requested" }
		},
		delivered: params.delivered,
		deliverySuppressionReason: params.deliverySuppressionReason,
		deliveryAttempted: params.deliverySuppressionReason === void 0,
		...params.error ? { deliveryError: params.error } : { deliveryError: void 0 },
		delivery: {
			...params.result.delivery,
			intended,
			delivered: params.delivered,
			resolved: {
				to: plan.to,
				source: "explicit",
				ok: params.delivered,
				...params.error ? { error: params.error } : {}
			}
		}
	};
}
function withPrimaryWebhookInterruption(params) {
	return resolveCronDeliveryPlan(params.job).mode === "webhook" && params.result.triggerEval?.fired !== false ? withPrimaryWebhookTrace({
		...params,
		delivered: false
	}) : params.result;
}
function resolveInterruptedRunProgress(params) {
	if (params.progress.settledDeliveryResult) return params.progress.settledDeliveryResult;
	if (params.progress.completedCoreResult) return withPrimaryWebhookInterruption({
		job: params.job,
		result: params.progress.completedCoreResult,
		error: params.error
	});
}
//#endregion
//#region src/cron/service/timer-job-runner.ts
async function deliverPrimaryWebhook(state, job, result, abortSignal, progress, assertRunCurrent) {
	const settle = (settledResult) => {
		progress.settledDeliveryResult ??= settledResult;
		return progress.settledDeliveryResult;
	};
	if (resolveCronDeliveryPlan(job).mode !== "webhook" || result.triggerEval?.fired === false) return result;
	const undelivered = (error, deliverySuppressionReason) => withPrimaryWebhookTrace({
		job,
		result,
		delivered: false,
		error,
		deliverySuppressionReason
	});
	if (result.status !== "error" && !(typeof result.summary === "string" && result.summary.trim())) return settle(undelivered(void 0, "empty"));
	if (!state.deps.sendCronWebhook) return undelivered("cron webhook delivery is unavailable");
	const interruptionError = () => {
		const reason = abortErrorMessage(abortSignal);
		return abortSignal.reason instanceof Error && abortSignal.reason.name === "TimeoutError" ? `cron webhook delivery timed out: ${reason}` : `cron webhook delivery cancelled: ${reason}`;
	};
	if (abortSignal.aborted) return undelivered(interruptionError());
	assertRunCurrent?.();
	const startedAt = job.state.runningAtMs;
	const deliveredResult = withPrimaryWebhookTrace({
		job,
		result,
		delivered: true
	});
	try {
		await state.deps.sendCronWebhook({
			job,
			abortSignal,
			onDeliveryAccepted: () => {
				settle(deliveredResult);
			},
			event: {
				jobId: job.id,
				action: "finished",
				job,
				...typeof startedAt === "number" ? { runAtMs: startedAt } : {},
				...typeof startedAt === "number" ? { durationMs: Math.max(0, state.deps.nowMs() - startedAt) } : {},
				status: result.status,
				error: result.error,
				summary: result.summary,
				diagnostics: result.diagnostics,
				delivered: true,
				deliveryStatus: "delivered",
				delivery: deliveredResult.delivery,
				sessionId: result.sessionId,
				sessionKey: result.sessionKey,
				model: result.model,
				provider: result.provider,
				usage: result.usage
			}
		});
		if (progress.settledDeliveryResult) return progress.settledDeliveryResult;
		if (abortSignal.aborted) return undelivered(interruptionError());
		return settle(deliveredResult);
	} catch (error) {
		if (progress.settledDeliveryResult) return progress.settledDeliveryResult;
		const deliveryError = abortSignal.aborted ? interruptionError() : formatErrorMessage(error);
		state.deps.log.warn({
			jobId: job.id,
			err: deliveryError
		}, "cron: webhook delivery failed");
		return settle(undelivered(deliveryError));
	}
}
/** Executes cron job core logic with the configured wall-clock timeout and watchdog cleanup. */
async function executeJobCoreWithTimeoutUnfinalized(state, job, opts) {
	const runAbortController = new AbortController();
	const progress = {};
	let commandSettlement;
	const assertRunCurrent = opts?.runReceipt ? () => assertServiceCronRunReceiptCurrent(state, opts.runReceipt, opts.activeJobMarker) : void 0;
	const operatorCancellationMarker = Symbol("cron-operator-cancelled");
	const operatorCancellation = createDeferredCore();
	const createInterruptionOutcome = async (interruption, execution, watchdog) => {
		const error = interruption === "cancelled" ? abortErrorMessage(runAbortController.signal) : interruption.reason;
		const deliveryError = `cron webhook delivery ${interruption === "cancelled" ? "cancelled" : "timed out"}: ${error}`;
		const settled = resolveInterruptedRunProgress({
			progress,
			job,
			error: deliveryError
		});
		if (settled) return settled;
		if (interruption !== "cancelled") {
			await settleTimedOutCronRun(state, job, interruption.timeoutMs, execution, commandSettlement);
			if (commandSettlement) {
				const settledAfterCleanup = resolveInterruptedRunProgress({
					progress,
					job,
					error: deliveryError
				});
				if (settledAfterCleanup) return settledAfterCleanup;
			}
		}
		const isolatedAgentSetupTimeout = interruption !== "cancelled" && job.sessionTarget === "isolated" && isSetupTimeoutErrorText(error) && !watchdog?.observedLaneWait() ? {
			error,
			timeoutMs: CRON_AGENT_SETUP_WATCHDOG_MS,
			otherCronJobsActiveAtTimeout: false
		} : void 0;
		return withPrimaryWebhookInterruption({
			job,
			result: {
				status: "error",
				error,
				...execution && {
					provider: execution.provider,
					model: execution.model,
					sessionId: execution.sessionId,
					sessionKey: execution.sessionKey
				},
				...isolatedAgentSetupTimeout ? { isolatedAgentSetupTimeout } : {},
				diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
			},
			error: deliveryError
		});
	};
	const reservation = opts?.runReceipt ? state.queuedRunReservationsByJobId.get(job.id) : void 0;
	if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker) || opts?.runReceipt && (reservation?.runReceipt.receiptId !== opts.runReceipt.receiptId || reservation.lifecycleGeneration !== state.lifecycleGeneration)) {
		runAbortController.abort("Gateway restarting.");
		return await createInterruptionOutcome("cancelled");
	}
	const detachedPayload = runsDetachedFromMainSession(job);
	const releaseCronTaskRun = detachedPayload || job.trigger ? registerActiveCronTaskRun({
		runId: opts?.runId ?? `cron-active:${job.id}`,
		controller: runAbortController,
		activeJobMarker: opts?.activeJobMarker,
		onCancel: () => operatorCancellation.resolve(operatorCancellationMarker)
	}) : void 0;
	const jobTimeoutMs = resolveCronJobTimeoutMs(job);
	try {
		const timeout = createDeferredCore();
		const deferTimeoutUntilExecutionStart = job.sessionTarget !== "main" && job.payload.kind === "agentTurn";
		const watchdog = jobTimeoutMs === void 0 ? void 0 : createCronAgentWatchdog({
			deferUntilRunner: deferTimeoutUntilExecutionStart,
			jobTimeoutMs,
			triggerTimeout: (reason) => {
				if (!runAbortController.signal.aborted) {
					const timeoutError = new Error(reason);
					timeoutError.name = "TimeoutError";
					runAbortController.abort(timeoutError);
				}
				timeout.resolve({
					timeoutMs: jobTimeoutMs,
					reason
				});
			}
		});
		let untimedExecution;
		const accumulateExecution = (info) => {
			if (info) untimedExecution = {
				...untimedExecution,
				...info
			};
		};
		const noteLaneState = (info) => {
			if (info?.waiting === false) {
				watchdog?.noteLaneAdmitted();
				return;
			}
			watchdog?.noteLaneWait();
		};
		const noteRunnerStarted = (info) => {
			if (watchdog) watchdog.noteRunnerStarted(info);
			else accumulateExecution(info);
			tryUpdateCronTaskRunSession(state, opts?.runId, info?.sessionKey);
		};
		const trackExecution = !watchdog || deferTimeoutUntilExecutionStart;
		const resolveHeartbeatTimeoutMs = state.deps.resolveHeartbeatTimeoutMs;
		const executionIdentity = opts?.executionIdentity;
		const coreOptions = {
			activeJobMarker: opts?.activeJobMarker,
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
			streamBatch: opts?.streamBatch,
			streamScheduleKey: opts?.streamScheduleKey,
			streamSourceIdentity: opts?.streamSourceIdentity,
			onPayloadExecutionStarted: detachedPayload ? void 0 : releaseCronTaskRun,
			onExecutionStarted: trackExecution ? noteRunnerStarted : void 0,
			onExecutionPhase: trackExecution ? watchdog?.notePhase ?? accumulateExecution : void 0,
			onLaneWait: watchdog && deferTimeoutUntilExecutionStart ? noteLaneState : void 0,
			onHeartbeatExecutionStarted: watchdog && resolveHeartbeatTimeoutMs ? (heartbeat) => {
				const heartbeatTimeoutMs = resolveHeartbeatTimeoutMs(heartbeat);
				return {
					onAttemptStarted: () => watchdog.replaceTimeout(heartbeatTimeoutMs),
					onQueued: () => watchdog.replaceTimeout(void 0)
				};
			} : void 0,
			assertRunCurrent,
			executionIdentity: executionIdentity && {
				...executionIdentity,
				onPostAdmission: (context) => {
					bindCronJobAdmittedRun(opts?.activeJobMarker, context, runAbortController.signal);
					return executionIdentity.onPostAdmission?.(context);
				}
			}
		};
		watchdog?.start();
		const corePromise = executeJobCore(state, job, runAbortController.signal, coreOptions);
		commandSettlement = job.payload.kind === "command" ? corePromise : void 0;
		const runPromise = corePromise.then(async (result) => {
			progress.completedCoreResult = result;
			return await deliverPrimaryWebhook(state, job, result, runAbortController.signal, progress, assertRunCurrent);
		});
		if (opts?.runReceipt) trackServiceCronRunReceiptSettlement({
			state,
			handle: opts.runReceipt,
			settlement: runPromise
		});
		trackActiveCronTaskRunSettlement(runPromise, runAbortController.signal, opts?.runReceipt?.agentId ?? opts?.activeJobMarker?.agentId);
		runPromise.catch((err) => {
			if (runAbortController.signal.aborted) state.deps.log.warn({
				jobId: job.id,
				err: String(err)
			}, `cron: job core rejected after abort: ${abortErrorMessage(runAbortController.signal)}`);
		});
		try {
			const first = await Promise.race([
				runPromise,
				timeout.promise,
				operatorCancellation.promise
			]);
			if (first === operatorCancellationMarker) return await createInterruptionOutcome("cancelled", watchdog?.activeExecution() ?? untimedExecution);
			return "status" in first ? first : await createInterruptionOutcome(first, watchdog?.activeExecution(), watchdog);
		} finally {
			watchdog?.dispose();
		}
	} finally {
		releaseCronTaskRun?.();
	}
}
function authorCronRunCompletion(_state, job, result) {
	const deliveryState = result.deliveryState ?? resolveDeliveryState({
		job,
		runStatus: result.status,
		delivery: result.delivery,
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		error: result.deliveryError ?? result.error,
		deliverySuppressionReason: result.deliverySuppressionReason
	});
	return {
		...result,
		deliveryState,
		completionStatus: resolveAdmittedCronCompletionStatus(job, result.status, deliveryState.status, deliveryState.deliverySuppressionReason)
	};
}
/** Authors completion after execution and primary delivery have both settled. */
async function executeJobCoreWithTimeout(state, job, opts) {
	return authorCronRunCompletion(state, job, await executeJobCoreWithTimeoutUnfinalized(state, job, opts));
}
//#endregion
//#region src/cron/service/timer-runnable.ts
/**
* Reports whether a cron job's last completed occurrence is older than its previous
* effective slot, which is how restart catch-up detects a missed run once
* nextRunAtMs has already advanced past it.
*/
function hasMissedCronSlotSinceLastRun(job, nowMs) {
	const lastTriggerEvalAtMs = job.trigger ? job.state.lastTriggerEvalAtMs : void 0;
	const lastRunAtMs = lastTriggerEvalAtMs === void 0 ? job.state.lastRunAtMs : Math.max(job.state.lastRunAtMs ?? lastTriggerEvalAtMs, lastTriggerEvalAtMs);
	const nextRunAtMs = job.state.nextRunAtMs;
	if (typeof lastRunAtMs !== "number" || !Number.isFinite(lastRunAtMs) || hasPendingCronTriggerInterval(job, nowMs) || hasScheduledNextRunAtMs(nextRunAtMs) && job.state.pacedNextRunAtMs === nextRunAtMs && nowMs < nextRunAtMs) return false;
	let previousRunAtMs;
	try {
		previousRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
	} catch {
		return false;
	}
	if (typeof previousRunAtMs !== "number" || !Number.isFinite(previousRunAtMs) || previousRunAtMs <= lastRunAtMs) return false;
	const activatedAtMs = job.state.scheduleActivatedAtMs;
	if (typeof activatedAtMs !== "number" || !Number.isFinite(activatedAtMs)) return true;
	return previousRunAtMs > activatedAtMs;
}
function isRunnableJob(params) {
	const { job, nowMs } = params;
	if (!job.state) job.state = {};
	if (!isJobEnabled(job) || !isTimeScheduledJob(job)) return false;
	if (params.skipJobIds?.has(job.id)) return false;
	if (hasActiveCronRun(job)) return false;
	const next = job.state.nextRunAtMs;
	if (hasScheduledNextRunAtMs(next) && nowMs < next && (!params.allowCronMissedRunByLastRun || job.state.startupCatchupAtMs === next)) return false;
	const lastRunStatus = resolveJobLastRunStatus(job);
	if (params.skipAtIfAlreadyRan && job.schedule.kind === "at" && lastRunStatus) {
		if (hasScheduledNextRunAtMs(next) && job.state.startupCatchupAtMs === next) return nowMs >= next;
		const lastRun = job.state.lastRunAtMs;
		const nextRun = job.state.nextRunAtMs;
		if (typeof lastRun === "number" && typeof nextRun === "number" && nextRun > lastRun && parseAbsoluteTimeMs(job.schedule.at) === nextRun) return nowMs >= nextRun;
		if (isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun)) return typeof nextRun === "number" && nowMs >= nextRun;
		return false;
	}
	if (isErrorBackoffPending(job, nowMs, lastRunStatus)) return false;
	if (hasScheduledNextRunAtMs(next) && nowMs >= next) {
		const lastRunAtMs = job.state.lastRunAtMs;
		if (!(params.allowCronMissedRunByLastRun && job.schedule.kind === "cron" && (lastRunStatus === "ok" || lastRunStatus === "skipped") && typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs) && lastRunAtMs >= next)) return true;
		let latestRunAtMs;
		try {
			latestRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
		} catch {
			return false;
		}
		return typeof latestRunAtMs === "number" && latestRunAtMs > lastRunAtMs;
	}
	if (!params.allowCronMissedRunByLastRun || job.schedule.kind !== "cron") return false;
	return hasMissedCronSlotSinceLastRun(job, nowMs);
}
function isErrorBackoffPending(job, nowMs, lastRunStatus) {
	if (job.schedule.kind === "at" || lastRunStatus !== "error") return false;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return backoffUntilMs !== void 0 && nowMs < backoffUntilMs;
}
function collectRunnableJobs(state, nowMs, opts) {
	if (!state.store) return [];
	return state.store.jobs.filter((job) => isRunnableJob({
		state,
		job,
		nowMs,
		skipJobIds: opts?.skipJobIds,
		skipAtIfAlreadyRan: opts?.skipAtIfAlreadyRan,
		allowCronMissedRunByLastRun: opts?.allowCronMissedRunByLastRun
	}));
}
//#endregion
//#region src/cron/service/run-admission.ts
function matchesOnExitSchedule(job, schedule) {
	return job.schedule.kind === "on-exit" && job.schedule.command === schedule.command && job.schedule.cwd === schedule.cwd;
}
/** Track a persisted marker through shared admission and payload execution. */
function reserveQueuedCronRun(state, jobId, reservationAt, opts) {
	const identity = {};
	state.queuedRunReservationsByJobId.set(jobId, {
		identity,
		lifecycleGeneration: state.lifecycleGeneration,
		markerAtMs: reservationAt,
		runReceipt: opts.runReceipt,
		preserveWhenDisabled: opts?.preserveWhenDisabled === true,
		...opts.onExit ? { onExit: true } : {}
	});
	return identity;
}
function releaseQueuedCronRun(state, jobId, identity) {
	if (state.queuedRunReservationsByJobId.get(jobId)?.identity !== identity) return false;
	state.queuedRunReservationsByJobId.delete(jobId);
	return true;
}
function isQueuedCronRunReservationCurrent(state, jobId, identity) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	return reservation?.identity === identity && reservation.lifecycleGeneration === state.lifecycleGeneration;
}
/** Durably clears reservations still owned by this process. Ownership stays
* held through commit; after one retry it is dropped for restart repair. */
async function cleanupQueuedCronRunReservations(params) {
	const { state, reservations } = params;
	const attempt = async () => {
		await locked(state, async () => {
			const postPersistNotifications = [];
			const committedJobs = commitCronRuntimeRows({
				state,
				jobIds: reservations.map((reservation) => reservation.jobId),
				operationLabel: "cron.run-reservation-cleanup",
				transactionHooks: params.transactionHooks,
				mutate: ({ database, jobs }) => {
					const committed = [];
					for (const reservation of reservations) {
						const ownership = state.queuedRunReservationsByJobId.get(reservation.jobId);
						if (ownership?.identity !== reservation.reservationIdentity) continue;
						if (!params.transactionHooks) finishCronRunReceiptInDatabase({
							database,
							handle: ownership.runReceipt,
							status: "skipped",
							finishedAtMs: state.deps.nowMs(),
							error: "cron reservation released before completion"
						});
						const job = jobs.get(reservation.jobId);
						if (!job) continue;
						const queuedMatches = ownership.markerAtMs === job.state.queuedAtMs;
						const runningMatches = ownership.markerAtMs === job.state.runningAtMs;
						if (!queuedMatches && !runningMatches) continue;
						if (params.restoreLastError !== false && ownership.activationPreviousLastError) job.state.lastError = ownership.activationPreviousLastError.value;
						if (queuedMatches) delete job.state.queuedAtMs;
						if (runningMatches) {
							delete job.state.runningAtMs;
							delete job.state.runningReceiptId;
							delete job.state.runningScheduleChangeId;
						}
						if (params.recompute && job.enabled && job.state.nextRunAtMs === void 0) recomputeJobNextRunAtMs({
							state,
							job,
							nowMs: state.deps.nowMs(),
							deferredNotifications: postPersistNotifications
						});
						committed.push(job);
					}
					return {
						upsertJobIds: committed.map((job) => job.id),
						value: committed
					};
				}
			});
			runPostPersistCronNotifications(state, postPersistNotifications);
			applyCronRuntimeRowsToState(state, committedJobs);
			for (const reservation of reservations) {
				const ownership = state.queuedRunReservationsByJobId.get(reservation.jobId);
				if (ownership?.identity === reservation.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
				releaseQueuedCronRun(state, reservation.jobId, reservation.reservationIdentity);
			}
		});
	};
	try {
		await attempt();
	} catch {
		try {
			await attempt();
		} catch (error) {
			for (const reservation of reservations) {
				const ownership = state.queuedRunReservationsByJobId.get(reservation.jobId);
				if (ownership?.identity === reservation.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
				releaseQueuedCronRun(state, reservation.jobId, reservation.reservationIdentity);
			}
			throw error;
		}
	}
}
/** Supersedes one activated run and releases only its exact durable marker.
* Receipt terminalization shares the marker transaction, so no successor can
* enter between dropping the fence and repairing scheduling state. */
async function supersedeActivatedCronRun(params) {
	try {
		await cleanupQueuedCronRunReservations({
			state: params.state,
			reservations: [params],
			recompute: "maintenance",
			transactionHooks: cronRunReceiptSupersedeHooks({
				state: params.state,
				handle: params.runReceipt,
				finishedAtMs: params.state.deps.nowMs(),
				error: params.reason
			})
		});
	} finally {
		releaseLocalCronRunReceiptOwnership(params.runReceipt);
	}
}
/** Persists queued markers only while no gateway owns an active run receipt.
* Each retry re-reads and updates only pending rows, so excluded foreign jobs
* can advance without a stale full-store snapshot overwriting their state.
*/
async function persistQueuedCronRunReservations(params) {
	const candidates = skipCronJobsWithoutOwners(params.state, [...params.candidates], params.reservedAtMs, {
		...params.scheduleMode ? { scheduleMode: params.scheduleMode } : {},
		...params.manualRun ? { manualRun: params.manualRun } : {}
	});
	const pendingJobs = new Map(candidates.map((job) => [job.id, structuredClone(job)]));
	const preparedClaims = new Map([...pendingJobs].map(([jobId, job]) => [jobId, prepareServiceCronRunReceiptClaim({
		state: params.state,
		job: params.manualRun?.onExit ? {
			...job,
			enabled: false
		} : job,
		startedAtMs: params.reservedAtMs,
		requestRunId: params.manualRun?.runId
	})]));
	while (pendingJobs.size > 0) {
		const replacedReceipts = [];
		let reservationCommitted = false;
		try {
			const committedReservations = commitCronRuntimeRows({
				state: params.state,
				jobIds: pendingJobs.keys(),
				operationLabel: "cron.run-reservation",
				transactionHooks: params.manualRun ? withCronMutationCommitHook("cron.run") : void 0,
				mutate: ({ database, jobs }) => {
					(params.manualRun?.commitGuard ?? params.manualRun?.onExit?.commitGuard)?.();
					const jobIds = [...pendingJobs.keys()].toSorted();
					for (const jobId of jobIds) if (!params.state.queuedRunReservationsByJobId.has(jobId)) adjudicateActiveCronRunReceiptInDatabase({
						database,
						jobId,
						prepared: preparedClaims.get(jobId),
						finishedAtMs: params.reservedAtMs
					});
					const committed = [];
					for (const jobId of jobIds) {
						const job = jobs.get(jobId);
						const planned = pendingJobs.get(jobId);
						if (!job || !planned || job.enabled !== planned.enabled || !params.immediateJobIds?.has(jobId) && job.state.nextRunAtMs !== planned.state.nextRunAtMs || job.state.lastRunAtMs !== planned.state.lastRunAtMs || job.state.lastRunStatus !== planned.state.lastRunStatus || job.state.queuedAtMs !== void 0 || job.state.runningAtMs !== void 0 || resolveCronJobConfigRevision(job) !== resolveCronJobConfigRevision(planned)) continue;
						committed.push(job);
					}
					const reservations = committed.map((job) => {
						const prior = params.state.queuedRunReservationsByJobId.get(job.id)?.runReceipt;
						if (prior) {
							finishCronRunReceiptInDatabase({
								database,
								handle: prior,
								status: "superseded",
								finishedAtMs: params.reservedAtMs,
								error: "cron reservation replaced before activation"
							});
							replacedReceipts.push(prior);
						}
						return {
							job,
							runReceipt: claimServiceCronRunReceiptInDatabase(params.state, database, preparedClaims.get(job.id))
						};
					});
					const ownershipAtMs = params.manualRun?.scheduleOwnershipAtMs ?? params.reservedAtMs;
					for (const { job } of reservations) {
						if (params.manualRun?.onExit) {
							job.enabled = false;
							job.updatedAtMs = params.reservedAtMs;
							job.state.scheduleActivatedAtMs = params.reservedAtMs;
							delete job.state.nextRunAtMs;
							delete job.state.startupCatchupAtMs;
							delete job.state.pacedNextRunAtMs;
							delete job.state.forcePreservedNextRunAtMs;
						} else if (params.scheduleMode === "preserve") retainManualOneShotOccurrence(job, ownershipAtMs);
						job.state.queuedAtMs = params.reservedAtMs;
					}
					return {
						upsertJobIds: committed.map((job) => job.id),
						runHooks: reservations.length > 0,
						value: reservations
					};
				}
			});
			reservationCommitted = true;
			for (const receipt of replacedReceipts) releaseLocalCronRunReceiptOwnership(receipt);
			const firstReservation = committedReservations[0];
			if (params.manualRun?.onExit && firstReservation) {
				const { job, runReceipt } = firstReservation;
				params.manualRun.onExit.onReserved(job, runReceipt);
				applyCronRuntimeRowsToState(params.state, [job]);
				emit(params.state, {
					jobId: job.id,
					action: "updated",
					job,
					nextRunAtMs: job.state.nextRunAtMs
				});
				return committedReservations;
			}
			const committedJobs = committedReservations.map(({ job }) => job);
			if (params.state.stopped) {
				const committedById = new Map(committedJobs.map((job) => [job.id, job]));
				if (params.state.store) params.state.store.jobs = params.state.store.jobs.map((job) => committedById.get(job.id) ?? job);
				return committedReservations;
			}
			await ensureLoaded(params.state, { forceReload: true }).catch(() => applyCronRuntimeRowsToState(params.state, committedJobs));
			const receiptByJobId = new Map(committedReservations.map(({ job, runReceipt }) => [job.id, runReceipt]));
			const reloadedReservations = (params.state.store?.jobs ?? []).filter((job) => receiptByJobId.has(job.id)).map((job) => ({
				job,
				runReceipt: receiptByJobId.get(job.id)
			}));
			const reloadedJobIds = new Set(reloadedReservations.map(({ job }) => job.id));
			for (const reservation of committedReservations) {
				if (reloadedJobIds.has(reservation.job.id)) continue;
				finishCronRunReceipt({
					handle: reservation.runReceipt,
					status: "skipped",
					finishedAtMs: params.state.deps.nowMs(),
					error: "cron reservation job disappeared before local handoff"
				});
			}
			return reloadedReservations;
		} catch (error) {
			if (reservationCommitted) throw error;
			for (const prepared of preparedClaims.values()) releaseLocalCronRunReceiptOwnership(prepared.handle);
			if (!(error instanceof CronRunReceiptConflictError)) throw error;
			enrollForeignReceipt(params.state, error.candidate);
			pendingJobs.delete(error.candidate.jobId);
		}
	}
	await ensureLoaded(params.state, { forceReload: true });
	return [];
}
async function activateQueuedCronRun(params) {
	const { state, job, reservationIdentity } = params;
	const startedAt = state.deps.nowMs();
	const reservation = state.queuedRunReservationsByJobId.get(job.id);
	const runReceipt = reservation?.runReceipt;
	if (!reservation || reservation.identity !== reservationIdentity || !runReceipt) return { kind: "fenced" };
	const activation = (() => {
		try {
			return commitCronRuntimeRows({
				state,
				jobIds: [job.id],
				operationLabel: "cron.run-activation",
				mutate: ({ database, jobs }) => {
					params.commitGuard?.();
					const current = jobs.get(job.id);
					const markerAtMs = state.queuedRunReservationsByJobId.get(job.id)?.markerAtMs;
					if (!current || markerAtMs === void 0 || current.state.queuedAtMs !== markerAtMs || params.onExitSchedule && !matchesOnExitSchedule(current, params.onExitSchedule)) return {
						value: void 0,
						runHooks: false
					};
					const previousLastError = current.state.lastError;
					const value = [
						current,
						activateServiceCronRunReceiptInDatabase(state, database, runReceipt, startedAt),
						previousLastError
					];
					delete current.state.queuedAtMs;
					current.state.runningAtMs = startedAt;
					current.state.runningReceiptId = runReceipt.receiptId;
					delete current.state.runningScheduleChangeId;
					current.state.lastError = void 0;
					return {
						value,
						upsertJobIds: [current.id]
					};
				}
			});
		} catch (error) {
			if (error instanceof CronRunReceiptConflictError) enrollForeignReceipt(state, error.candidate);
			else if (!(error instanceof CronRunReceiptRevisionError)) throw error;
			return;
		}
	})();
	if (!activation) return { kind: "fenced" };
	const [activatedJob, activatedReceipt, previousLastError] = activation;
	applyCronRuntimeRowsToState(state, [activatedJob]);
	if (reservation?.identity === reservationIdentity) {
		reservation.markerAtMs = startedAt;
		reservation.runReceipt = activatedReceipt;
		reservation.activationPreviousLastError = { value: previousLastError };
	}
	if (!state.stopped && reservation.lifecycleGeneration === state.lifecycleGeneration) return {
		kind: "activated",
		job: activatedJob,
		startedAt,
		runReceipt: activatedReceipt
	};
	params.onUnavailable?.();
	try {
		const restoredJob = commitCronRuntimeRows({
			state,
			jobIds: [job.id],
			operationLabel: "cron.run-activation-unavailable",
			transactionHooks: cronRunReceiptPersistHooks({
				state,
				handle: activatedReceipt,
				terminal: {
					status: "skipped",
					finishedAtMs: state.deps.nowMs(),
					error: "cron service stopped"
				}
			}),
			mutate: ({ jobs }) => {
				const current = jobs.get(job.id);
				if (!current || current.state.runningAtMs !== startedAt) return { value: void 0 };
				current.state.lastError = previousLastError;
				delete current.state.runningAtMs;
				delete current.state.runningReceiptId;
				delete current.state.runningScheduleChangeId;
				return {
					value: current,
					upsertJobIds: [current.id]
				};
			}
		});
		if (restoredJob) applyCronRuntimeRowsToState(state, [restoredJob]);
	} catch (error) {
		await params.onUnavailableRollbackError?.();
		throw error;
	} finally {
		releaseLocalCronRunReceiptOwnership(activatedReceipt);
	}
	releaseQueuedCronRun(state, job.id, reservationIdentity);
	return {
		kind: "unavailable",
		reason: "stopped"
	};
}
async function executeQueuedCronRun(params) {
	const { state } = params;
	const executeAdmitted = async () => {
		const started = await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			if (params.isUnavailable?.() || state.stopped) {
				params.onUnavailable?.();
				return;
			}
			const job = state.store?.jobs.find((entry) => entry.id === params.jobId);
			if (!job || !isQueuedCronRunReservationCurrent(state, params.jobId, params.reservationIdentity) || job.state.queuedAtMs !== params.reservedAtMs) {
				const ownership = state.queuedRunReservationsByJobId.get(params.jobId);
				if (job && ownership?.identity === params.reservationIdentity && job.state.queuedAtMs === params.reservedAtMs) {
					await params.onNotRunnable(job);
					return;
				}
				if (ownership?.identity === params.reservationIdentity) try {
					finishCronRunReceipt({
						handle: ownership.runReceipt,
						status: "skipped",
						finishedAtMs: state.deps.nowMs(),
						error: "cron reservation fenced by concurrent mutation"
					});
				} catch {}
				releaseQueuedCronRun(state, params.jobId, params.reservationIdentity);
				return;
			}
			const runnableJob = structuredClone(job);
			delete runnableJob.state.queuedAtMs;
			if (!isRunnableJob({
				state,
				job: runnableJob,
				nowMs: state.deps.nowMs(),
				...params.runnableOptions
			})) {
				await params.onNotRunnable(job);
				return;
			}
			const activation = await activateQueuedCronRun({
				state,
				job,
				reservationIdentity: params.reservationIdentity,
				onUnavailable: params.onUnavailable
			});
			if (activation.kind !== "activated") return;
			params.onActivated?.();
			const executionJob = structuredClone(activation.job);
			executionJob.state.runningAtMs = activation.startedAt;
			executionJob.state.lastError = void 0;
			return {
				executionJob,
				taskRun: tryCreateCronTaskRunHandle({
					state,
					job: executionJob,
					startedAt: activation.startedAt,
					runReceipt: activation.runReceipt
				}),
				startedAt: activation.startedAt,
				runReceipt: activation.runReceipt,
				activeJobMarker: markServiceCronJobActive(state, activation.job, activation.runReceipt)
			};
		});
		if (!started) return;
		const { executionJob, taskRun, activeJobMarker } = started;
		const taskRunId = taskRun?.runId;
		emit(state, {
			jobId: executionJob.id,
			action: "started",
			job: executionJob,
			runAtMs: started.startedAt
		});
		const base = {
			jobId: params.jobId,
			job: executionJob,
			taskRunId,
			activeJobMarker,
			reservationIdentity: params.reservationIdentity,
			startedAt: started.startedAt,
			runReceipt: started.runReceipt
		};
		let outcome;
		try {
			const result = await executeJobCoreWithTimeout(state, executionJob, {
				runId: taskRunId,
				activeJobMarker,
				runReceipt: started.runReceipt,
				executionIdentity: createCronOwnerExecutionIdentityAdmission({
					state,
					runReceipt: started.runReceipt,
					taskId: taskRun?.taskId,
					flowId: taskRun?.flowId
				})
			});
			outcome = {
				...base,
				...result,
				endedAt: state.deps.nowMs()
			};
		} catch (error) {
			const receiptSettlementDisposition = error instanceof CronRunReceiptRevisionError && error.reason === "owner-unavailable" ? "owner-unavailable" : void 0;
			const errorText = error instanceof CronRunReceiptRevisionError ? error.message : normalizeCronRunErrorText(error);
			params.onSetupError?.(executionJob, errorText);
			outcome = {
				...base,
				...authorCronRunCompletion(state, executionJob, {
					status: "error",
					error: errorText,
					diagnostics: createCronRunDiagnosticsFromError("cron-setup", errorText, { nowMs: state.deps.nowMs })
				}),
				...receiptSettlementDisposition ? { receiptSettlementDisposition } : {},
				endedAt: state.deps.nowMs()
			};
		}
		return {
			outcome,
			handled: await params.onCompleted?.(outcome) === true
		};
	};
	const admission = await runWithCronAdmission(state, executeAdmitted, params.admissionRelease).catch(async (error) => {
		await cleanupQueuedCronRunReservations({
			state,
			reservations: [{
				jobId: params.jobId,
				reservationIdentity: params.reservationIdentity
			}],
			recompute: "maintenance"
		});
		throw error;
	});
	if (admission.kind === "stopped") return { kind: "stopped" };
	if (!admission.value) return { kind: "skipped" };
	return {
		kind: "completed",
		...admission.value
	};
}
//#endregion
//#region src/cron/service/startup-run-repair.ts
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
//#endregion
//#region src/cron/service/run-recovery-events.ts
function emitInterruptedCronRun(state, interrupted) {
	const job = state.store?.jobs.find((entry) => entry.id === interrupted.jobId);
	const event = {
		jobId: interrupted.jobId,
		action: "finished",
		job,
		status: "error",
		completionStatus: "failed",
		error: STARTUP_INTERRUPTED_ERROR,
		delivered: false,
		deliveryStatus: "unknown",
		deliveryError: STARTUP_INTERRUPTED_ERROR,
		failureNotificationDelivery: job ? failureNotificationDeliveryFromJobState(job) : void 0,
		runAtMs: interrupted.runAtMs,
		durationMs: interrupted.durationMs,
		nextRunAtMs: job?.state.nextRunAtMs
	};
	tryFinishCronTaskRun(state, {
		taskRunId: interrupted.taskRunId,
		job,
		event
	});
	emit(state, event);
}
//#endregion
//#region src/cron/service/run-recovery.ts
var RetiredCronRecoveryError = class extends Error {
	constructor() {
		super("Cron recovery owner retired");
	}
};
function recoveryAuthority(state, context, signal, isCurrent) {
	const generation = state.lifecycleGeneration;
	return () => {
		context.admission.assertCurrent();
		if (state.stopped || state.lifecycleGeneration !== generation || signal?.aborted || isCurrent?.() === false) throw new RetiredCronRecoveryError();
	};
}
async function observeRecoveryProposals(state, context, proposals, assertCurrent) {
	if (proposals.length === 0) return [];
	const command = {
		type: "cron.observeRunRecovery",
		storeKey: cronStoreKey(state.deps.storePath),
		proposals
	};
	assertCurrent();
	let result = await executeExistingAssistantStateRead({}, command);
	assertCurrent();
	if (!result || result.ok && result.type === command.type && result.observation.kind === "schema-uninitialized") {
		const assertSchemaCurrent = () => {
			context.admission.assertCurrent();
			assertCurrent();
		};
		const { createSqliteWorkerWriteAdmission } = await import("./sqlite-worker-store-DHnDUYmC.js");
		await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type: "cron.initializeRunReceipts",
			input: {}
		}), {
			assertCurrent: assertSchemaCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertSchemaCurrent, [context.admission.databasePath])
		});
		assertCurrent();
		result = await executeExistingAssistantStateRead({}, command);
		assertCurrent();
	}
	if (!result?.ok || result.type !== command.type || result.observation.kind !== "observed") throw new Error("Cron recovery observation did not return its admitted receipt snapshot");
	return result.observation.proposals;
}
function observedRecoveryResult(state, proposal, observed) {
	const receipt = observed.receipt;
	if (!receipt) return;
	if (!proposal.receipt || !exactCronRunReceiptMatches(receipt, proposal.receipt)) return {
		kind: "superseded",
		receipt
	};
	return isCronRunReceiptOwnerStale(receipt, state.deps.nowMs()) ? void 0 : {
		kind: "live",
		receipt
	};
}
async function repairRecoveryProposal(state, context, proposal, mode, assertOwnerCurrent, publish) {
	const input = {
		storeKey: cronStoreKey(state.deps.storePath),
		proposal: structuredClone(proposal),
		mode
	};
	let retired = false;
	try {
		await runCronRuntimeMutation({
			context,
			type: "cron.repairRun",
			input,
			assertCurrent() {
				try {
					assertOwnerCurrent();
				} catch (error) {
					retired = error instanceof RetiredCronRecoveryError;
					throw error;
				}
			},
			prepare(routing) {
				if (routing.id !== proposal.jobId) throw new Error("Cron recovery policy differs from its admitted job");
				const receiptIsStale = () => proposal.receipt ? isCronRunReceiptOwnerStale(proposal.receipt, state.deps.nowMs()) : true;
				const cronConfig = structuredClone(state.deps.cronConfig);
				const value = {
					proposedReceiptIsStale: receiptIsStale(),
					nowMs: state.deps.nowMs(),
					cronConfig,
					failureAlert: resolveFailureAlert({ deps: { cronConfig } }, routing)
				};
				return {
					value,
					assertCurrent() {
						if (value.proposedReceiptIsStale !== receiptIsStale() || !isDeepStrictEqual(value.cronConfig, state.deps.cronConfig) || !isDeepStrictEqual(value.failureAlert, resolveFailureAlert(state, routing))) throw new Error("Cron recovery policy or receipt ownership changed before commit");
					}
				};
			},
			publish(outcome) {
				if (outcome.result.kind === "repaired") noteCronJobsStoreCommit(input.storeKey);
				publish(outcome.result);
				for (const entry of outcome.logs) state.deps.log[entry.level](entry.fields, entry.message);
			}
		});
	} catch (error) {
		if (retired) throw new RetiredCronRecoveryError();
		throw error;
	}
}
/** Observe the whole batch before any repair; committed candidates publish before a later await fails. */
async function recoverCronRunProposals(state, targets, options) {
	const context = captureAssistantStateWorkerContext();
	const assertCurrent = recoveryAuthority(state, context, options.signal, options.isCurrent);
	try {
		const observed = await observeRecoveryProposals(state, context, targets, assertCurrent);
		const repairs = [];
		for (let index = 0; index < observed.length; index += 1) {
			const current = observed[index];
			const target = targets[index];
			const proposal = target.receipt ? target : current;
			const result = observedRecoveryResult(state, proposal, current);
			if (result) options.onRecovery(proposal, result);
			else repairs.push(proposal);
		}
		for (const proposal of repairs) {
			assertCurrent();
			await repairRecoveryProposal(state, context, proposal, options.mode ?? "reclaim", assertCurrent, (result) => options.onRecovery(proposal, result));
		}
	} catch (error) {
		if (!(error instanceof RetiredCronRecoveryError)) throw error;
	}
}
//#endregion
//#region src/cron/service/schedule-maintenance.ts
/** Schedules authoritative rows in the worker without clearing live process ownership. */
async function recomputeUnownedCronSchedules(state, opts) {
	const context = captureAssistantStateWorkerContext();
	const generation = state.lifecycleGeneration;
	const storeKey = cronStoreKey(state.deps.storePath);
	let outcome;
	await runCronRuntimeMutation({
		context,
		type: "cron.scheduleUnowned",
		input: {
			storeKey,
			options: opts ? { ...opts } : void 0
		},
		assertCurrent() {
			if (state.lifecycleGeneration !== generation) throw new Error("Cron schedule maintenance owner retired");
		},
		prepare({ jobIds }) {
			const owners = jobIds.map((jobId) => ({
				jobId,
				active: isCronJobActive(jobId),
				reservation: state.queuedRunReservationsByJobId.get(jobId)
			}));
			const ownership = owners.map(({ jobId, active, reservation }) => ({
				jobId,
				active,
				reservation: reservation ? {
					markerAtMs: reservation.markerAtMs,
					preserveWhenDisabled: reservation.preserveWhenDisabled
				} : void 0
			}));
			return {
				value: {
					nowMs: opts?.nowMs ?? state.deps.nowMs(),
					ownership
				},
				assertCurrent() {
					for (let index = 0; index < owners.length; index += 1) {
						const owner = owners[index];
						const prepared = ownership[index];
						const current = state.queuedRunReservationsByJobId.get(owner.jobId);
						if (owner.active !== isCronJobActive(owner.jobId) || current !== owner.reservation || current?.markerAtMs !== prepared.reservation?.markerAtMs || current?.preserveWhenDisabled !== prepared.reservation?.preserveWhenDisabled) throw new Error("Cron schedule ownership changed before commit");
					}
				}
			};
		},
		publish(committed) {
			outcome = committed;
			if (committed.changed) noteCronJobsStoreCommit(storeKey);
			applyCronRuntimeRowsToState(state, committed.jobs);
			runPostPersistCronNotifications(state, committed.notifications);
			for (const entry of committed.logs) state.deps.log[entry.level](entry.fields, entry.message);
		}
	});
	if (!outcome) throw new Error("Cron schedule maintenance did not publish its committed rows");
	return outcome;
}
//#endregion
//#region src/cron/session-reaper.ts
/** Prunes expired per-run cron sessions and archives unreferenced transcripts. */
const DEFAULT_RETENTION_MS = 864e5;
/** Minimum interval between reaper sweeps (avoid running every timer tick). */
const MIN_SWEEP_INTERVAL_MS = 3e5;
const lastSweepAtMsByTarget = /* @__PURE__ */ new Map();
function reaperTargetKey(agentId, storePath) {
	return `${normalizeAgentId(agentId)}\0${path.resolve(storePath)}`;
}
/** Resolves cron run-session retention; `false` disables pruning, bad strings fall back safely. */
function resolveRetentionMs(cronConfig) {
	if (cronConfig?.sessionRetention === false) return null;
	const raw = cronConfig?.sessionRetention;
	if (typeof raw === "string" && raw.trim()) try {
		const ms = parseDurationMs(raw.trim(), { defaultUnit: "h" });
		if (ms <= 0) return null;
		return ms;
	} catch {
		return DEFAULT_RETENTION_MS;
	}
	return DEFAULT_RETENTION_MS;
}
/** Removes the reusable base session whose owning isolated cron job was deleted. */
async function removeCronJobBaseSession(params) {
	const sessionKey = resolveCronAgentSessionKey({
		agentId: params.agentId,
		sessionKey: `cron:${params.jobId}`
	});
	const existing = loadExactSessionEntryReadOnly({
		storePath: params.sessionStorePath,
		sessionKey
	})?.entry;
	if (!existing) return false;
	const sessionId = existing.sessionId.trim();
	if (sessionId) return await deleteCronSessionViaGateway({
		agentSessionKey: sessionKey,
		sessionId,
		lifecycleRevision: existing.lifecycleRevision,
		sessionUpdatedAt: existing.updatedAt
	});
	return (await applySessionEntryLifecycleMutation({
		agentId: params.agentId,
		storePath: params.sessionStorePath,
		removals: [{
			sessionKey,
			archiveRemovedTranscript: true,
			expectedEntry: existing
		}]
	})).removedEntries > 0;
}
/**
* Sweeps completed isolated cron run sessions while preserving base cron sessions.
*
* Run outside the cron service `locked()` section: cleanup acquires session
* lifecycle and writer ownership, so nesting the queues can deadlock timer ticks.
*/
async function sweepCronRunSessions(params) {
	const retentionMs = resolveRetentionMs(params.cronConfig);
	if (retentionMs === null) return {
		swept: false,
		pruned: 0
	};
	const now = params.nowMs ?? Date.now();
	const storePath = params.sessionStorePath;
	const targetKey = reaperTargetKey(params.agentId, storePath);
	const lastSweepAtMs = lastSweepAtMsByTarget.get(targetKey) ?? 0;
	if (now >= lastSweepAtMs && now - lastSweepAtMs < MIN_SWEEP_INTERVAL_MS) return {
		swept: false,
		pruned: 0
	};
	lastSweepAtMsByTarget.set(targetKey, now);
	let pruned = 0;
	let transcriptCleanupError;
	try {
		if (params.isAgentAvailable?.(params.agentId) === false) {
			params.log.debug({ agentId: params.agentId }, "cron-reaper: skipped unavailable agent");
			return {
				swept: false,
				pruned: 0
			};
		}
		const cutoff = now - retentionMs;
		let pendingMediaSessionKeys;
		const removals = [];
		for (const { sessionKey, entry } of await readExpiredCronRunEntriesInWorker({
			agentId: params.agentId,
			storePath,
			updatedBefore: cutoff
		})) {
			if (entry.cronRunContinuation) {
				pendingMediaSessionKeys ??= buildPendingGeneratedMediaSessionKeySet();
				if (pendingMediaSessionKeys.has(sessionKey) || hasDescendantRunAwaitingSettle(sessionKey)) continue;
			}
			if (entry.sessionId && isCompetingSessionWorkAdmissionActive(storePath, [sessionKey, entry.sessionId])) continue;
			removals.push({
				sessionKey,
				expectedEntry: entry,
				...entry.sessionId ? { expectedSessionId: entry.sessionId } : {},
				expectedUpdatedAt: entry.updatedAt,
				archiveRemovedTranscript: true
			});
		}
		if (removals.length > 0) {
			const archiveRetentionMs = resolveMaintenanceConfig().resetArchiveRetentionMs;
			const result = await applySessionEntryLifecycleMutation({
				agentId: params.agentId,
				storePath,
				removals,
				beforeCommitInTransaction: () => {
					for (const removal of removals) if (removal.expectedEntry?.cronRunContinuation && hasDescendantRunAwaitingSettle(removal.sessionKey)) throw new Error(`Cannot prune cron run continuation while subagents await settlement for ${removal.sessionKey}`);
				},
				...archiveRetentionMs == null ? {} : { cleanupArchivedTranscripts: {
					rules: [{
						reason: "deleted",
						olderThanMs: archiveRetentionMs
					}],
					nowMs: now
				} },
				captureArtifactCleanupError: true
			});
			pruned = result.removedEntries;
			transcriptCleanupError = result.artifactCleanupError;
		}
	} catch (err) {
		params.log.warn({ err: String(err) }, "cron-reaper: failed to sweep session store");
		return {
			swept: false,
			pruned: 0
		};
	}
	if (transcriptCleanupError) params.log.warn({ err: formatErrorMessage(transcriptCleanupError) }, "cron-reaper: transcript cleanup failed");
	if (pruned > 0) params.log.info({
		pruned,
		retentionMs
	}, `cron-reaper: pruned ${pruned} expired cron run session(s)`);
	return {
		swept: true,
		pruned
	};
}
/** Resets per-target reaper throttles between tests. */
function resetReaperThrottle() {
	lastSweepAtMsByTarget.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.cronSessionReaperTestApi")] = { resetReaperThrottle };
//#endregion
//#region src/cron/service/timer-capacity-recheck.ts
/** Tracks capacity-triggered child ticks without leaking the parent timer lifecycle. */
function createCronCapacityRecheckTracker(requestRecheck, requestRecheckAfterClose) {
	let pendingActivations = 0;
	let activationsAllowRecheck = true;
	let activationGateResolved = false;
	let activationGateAllowsRecheck = false;
	let closed = false;
	let resolveActivationGate;
	const activationGate = new Promise((resolve) => {
		resolveActivationGate = resolve;
	});
	const trackedRechecks = /* @__PURE__ */ new Set();
	const runInParentContext = AsyncLocalStorage.snapshot();
	const resolveActivationGateOnce = (allowRecheck) => {
		if (activationGateResolved) return;
		activationGateResolved = true;
		activationGateAllowsRecheck = allowRecheck;
		resolveActivationGate(allowRecheck);
	};
	return {
		initializeActivations(count, allowRecheckWhenEmpty = false) {
			pendingActivations = count;
			if (count === 0) resolveActivationGateOnce(allowRecheckWhenEmpty);
		},
		settleActivation(allowRecheck) {
			if (activationGateResolved) return;
			activationsAllowRecheck &&= allowRecheck;
			pendingActivations -= 1;
			if (pendingActivations === 0) resolveActivationGateOnce(activationsAllowRecheck);
		},
		request() {
			if (closed) {
				if (activationGateAllowsRecheck) requestRecheckAfterClose();
				return;
			}
			const recheck = activationGate.then(async (allowRecheck) => {
				if (allowRecheck) await runInParentContext(requestRecheck);
			});
			trackedRechecks.add(recheck);
			recheck.finally(() => trackedRechecks.delete(recheck));
		},
		abort() {
			closed = true;
			resolveActivationGateOnce(false);
		},
		async drain() {
			while (trackedRechecks.size > 0) await Promise.all(trackedRechecks);
		}
	};
}
//#endregion
//#region src/cron/service/timer-notifications.ts
function maybeNotifyIsolatedAgentSetupTimeout(state, result) {
	const signal = result.isolatedAgentSetupTimeout;
	if (!signal) return false;
	const notify = state.deps.onIsolatedAgentSetupTimeout;
	if (!notify) return false;
	const logFailure = (err) => {
		state.deps.log.warn({
			jobId: result.job.id,
			err: String(err)
		}, "cron: isolated setup timeout handler failed");
	};
	try {
		Promise.resolve(notify({
			job: result.job,
			error: signal.error,
			timeoutMs: signal.timeoutMs
		})).catch(logFailure);
		return true;
	} catch (err) {
		logFailure(err);
		return false;
	}
}
//#endregion
//#region src/cron/service/timer-outcome-finalization.ts
/** Finalizes cron task rows and active markers after timer outcome persistence. */
/** Coalesces terminal cron writes without holding an execution admission slot. */
function createCompletedCronRunOutcomeDrain(state, opts) {
	const pendingOutcomes = [];
	const finalizedOutcomes = [];
	let drainPromise;
	let drainFailure;
	const startDrain = () => {
		if (drainPromise || pendingOutcomes.length === 0) return;
		drainPromise = Promise.resolve().then(async () => {
			while (pendingOutcomes.length > 0) {
				const completed = pendingOutcomes.splice(0);
				try {
					finalizedOutcomes.push(...await finalizeCompletedCronRunOutcomes(state, completed, opts));
				} catch (error) {
					drainFailure ??= { error };
				}
			}
		}).catch((error) => {
			drainFailure ??= { error };
		}).finally(() => {
			drainPromise = void 0;
			if (pendingOutcomes.length > 0) startDrain();
		});
	};
	return {
		enqueue(outcome) {
			pendingOutcomes.push(outcome);
			startDrain();
		},
		async flush() {
			for (;;) {
				const pendingDrain = drainPromise;
				if (!pendingDrain) break;
				await pendingDrain;
			}
			if (drainFailure) throw drainFailure.error;
			return finalizedOutcomes.splice(0);
		}
	};
}
/** Durably finalizes finished work without waiting for unrelated cron runs. */
async function finalizeCompletedCronRunOutcomes(state, outcomes, opts) {
	if (outcomes.length === 0) return [];
	let finalizedOutcomes = [];
	let finalizationSucceeded = false;
	const canPublish = (outcome) => !(state.stopped && opts?.discardWhenStopped) && isCronActiveJobMarkerCurrent(outcome.activeJobMarker);
	try {
		await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			for (const outcome of outcomes) if (outcome.status !== "ok" || outcome.triggerEval?.fired !== false) {
				const taskJob = structuredClone(state.store?.jobs.find((job) => job.id === outcome.jobId) ?? outcome.job);
				applyOutcomeToAuthoritativeJob(state, taskJob, outcome, {
					deferredNotifications: [],
					emit: false
				});
				recordCronOutcomeForJob(state, taskJob, outcome);
			}
			finalizedOutcomes = outcomes.filter((outcome) => outcome.runReceipt || canPublish(outcome));
			if (finalizedOutcomes.length === 0) {
				finalizationSucceeded = true;
				return;
			}
			const postPersistNotifications = [];
			const receiptHooks = finalizedOutcomes.filter((outcome) => outcome.runReceipt).map((outcome) => cronRunReceiptPersistHooks({
				state,
				handle: outcome.runReceipt,
				allowMissingJob: outcome.activeJobMarker?.jobRemoved === true || !state.store?.jobs.some((job) => job.id === outcome.jobId),
				terminal: {
					status: outcome.status,
					...outcome.triggerEval ? { triggerFired: outcome.triggerEval.fired } : {},
					finishedAtMs: outcome.endedAt,
					error: outcome.error,
					...outcome.receiptSettlementDisposition ? { disposition: outcome.receiptSettlementDisposition } : {}
				}
			}));
			const transactionHooks = receiptHooks.length > 0 ? {
				beforeWrite: (database) => {
					for (const hooks of receiptHooks) hooks.beforeWrite?.(database);
				},
				afterWrite: (database) => {
					for (const hooks of receiptHooks) hooks.afterWrite?.(database);
				},
				afterCommit: () => {
					for (const hooks of receiptHooks) hooks.afterCommit?.();
				}
			} : void 0;
			const committed = commitCronRuntimeRows({
				state,
				jobIds: finalizedOutcomes.map((outcome) => outcome.jobId),
				operationLabel: "cron.run-finalization",
				transactionHooks,
				mutate: ({ database, jobs }) => {
					const upsertedJobs = [];
					const removedJobs = [];
					const eventPlans = [];
					for (const outcome of finalizedOutcomes) {
						const job = jobs.get(outcome.jobId);
						if (!job || outcome.activeJobMarker?.jobRemoved === true) {
							eventPlans.push({ outcome });
							continue;
						}
						if (applyOutcomeToAuthoritativeJob(state, job, outcome, {
							deferredNotifications: postPersistNotifications,
							emit: false,
							triggerStateRetired: outcome.runReceipt && isCronRunTriggerStateRetiredInDatabase({
								database,
								handle: outcome.runReceipt
							})
						})) removedJobs.push(job);
						else upsertedJobs.push(job);
						eventPlans.push({
							outcome,
							job: structuredClone(job)
						});
					}
					return {
						deleteJobIds: removedJobs.map((job) => job.id),
						upsertJobIds: upsertedJobs.map((job) => job.id),
						value: {
							eventPlans,
							removedJobs,
							upsertedJobs
						}
					};
				}
			});
			applyCronRuntimeRowsToState(state, committed.upsertedJobs, committed.removedJobs.map((job) => job.id), { publish: false });
			for (const outcome of finalizedOutcomes) {
				if (outcome.status === "ok" && outcome.triggerEval?.fired === false) tryFinishCronTaskRunWithoutHistory(state, outcome);
				if (!canPublish(outcome)) state.durableNextRunAtMsByJobId.set(outcome.jobId, state.store?.jobs.find((job) => job.id === outcome.jobId)?.state.nextRunAtMs);
			}
			finalizedOutcomes = finalizedOutcomes.filter(canPublish);
			finalizationSucceeded = true;
			if (finalizedOutcomes.length === 0) {
				runPostPersistCronNotifications(state, postPersistNotifications);
				return;
			}
			const publishedJobIds = new Set(finalizedOutcomes.map((outcome) => outcome.jobId));
			for (const plan of committed.eventPlans) {
				if (!publishedJobIds.has(plan.outcome.jobId)) continue;
				if (plan.job) emitCronOutcomeEventForJob(state, plan.job, plan.outcome);
				else applyOutcomeToStoredJob(state, plan.outcome, { deferredNotifications: postPersistNotifications });
			}
			runPostPersistCronNotifications(state, postPersistNotifications);
			for (const removedJob of committed.removedJobs) if (publishedJobIds.has(removedJob.id)) emit(state, {
				jobId: removedJob.id,
				action: "removed",
				job: removedJob
			});
			publishCronRuntimeRows(state);
			try {
				await recomputeUnownedCronSchedules(state, opts?.repairFutureCronNextRunAtMs === false ? { repairFutureCronNextRunAtMs: false } : void 0);
			} catch (error) {
				state.deps.log.warn({ err: String(error) }, "cron: post-finalization schedule maintenance failed");
			}
		});
		finalizationSucceeded ||= finalizedOutcomes.length > 0;
		return finalizedOutcomes;
	} catch (error) {
		if (error instanceof CronRunReceiptRevisionError) {
			const stale = outcomes.find((outcome) => outcome.runReceipt?.receiptId === error.receiptId);
			if (stale?.runReceipt) {
				if (isCronActiveJobMarkerCurrent(stale.activeJobMarker)) {
					if (stale.reservationIdentity) await supersedeActivatedCronRun({
						state,
						jobId: stale.jobId,
						reservationIdentity: stale.reservationIdentity,
						runReceipt: stale.runReceipt,
						reason: error.message
					});
					else supersedeServiceCronRunReceipt(stale.runReceipt, state.deps.nowMs(), error.message);
					tryFinishCronTaskRunWithoutHistory(state, {
						taskRunId: stale.taskRunId,
						status: "skipped",
						error: error.message,
						endedAt: state.deps.nowMs()
					});
				}
				return await finalizeCompletedCronRunOutcomes(state, outcomes.filter((outcome) => outcome !== stale), opts);
			}
		}
		throw error;
	} finally {
		for (const outcome of outcomes) {
			if (outcome.reservationIdentity) releaseQueuedCronRun(state, outcome.jobId, outcome.reservationIdentity);
			if (opts?.clearOnFailure !== false || finalizationSucceeded) clearCronJobActive(outcome.jobId, outcome.activeJobMarker);
			if (outcome.runReceipt) releaseLocalCronRunReceiptOwnership(outcome.runReceipt);
		}
	}
}
//#endregion
//#region src/cron/service/timer-scheduler.ts
/** Arms the cron timer for the next wake or a maintenance recheck. */
function armTimer(state) {
	if (state.timer) clearTimeout(state.timer);
	state.timer = null;
	if (state.stopped || state.schedulingPaused || state.startupCatchup) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler stopped");
		return;
	}
	if (!state.deps.cronEnabled) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler disabled");
		return;
	}
	const { nextWakeAtMs: nextAt, jobCount, enabledCount } = summarizeCronJobSchedule(state);
	if (!nextAt) {
		const withNextRun = 0;
		if (enabledCount > 0) {
			armRunningRecheckTimer(state);
			state.deps.log.debug({
				jobCount,
				enabledCount,
				withNextRun,
				delayMs: MAX_CRON_TIMER_DELAY_MS
			}, "cron: timer armed for maintenance recheck");
			return;
		}
		state.deps.log.debug({
			jobCount,
			enabledCount,
			withNextRun
		}, "cron: armTimer skipped - no jobs with nextRunAtMs");
		return;
	}
	const now = state.deps.nowMs();
	const delay = Math.max(nextAt - now, 0);
	const clampedDelay = Math.min(delay === 0 ? MIN_REFIRE_GAP_MS : delay, MAX_CRON_TIMER_DELAY_MS);
	setCronTimer(state, clampedDelay);
	state.deps.log.debug({
		nextAt,
		nextAtIso: formatTimestamp(new Date(nextAt), { style: "long" }),
		delayMs: clampedDelay,
		clamped: delay > MAX_CRON_TIMER_DELAY_MS
	}, "cron: timer armed");
}
function armRunningRecheckTimer(state) {
	if (state.stopped || state.schedulingPaused) return;
	if (state.timer) clearTimeout(state.timer);
	setCronTimer(state, MAX_CRON_TIMER_DELAY_MS);
}
function setCronTimer(state, delayMs) {
	state.timer = setTimeout(() => {
		runInDetachedAsyncContext(() => {
			onTimer(state).catch((err) => {
				state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
			});
		});
	}, delayMs);
}
/** Consume a released slot without routing overdue work through the refire floor. */
function requestImmediateCronRecheck(state) {
	if (state.stopped || state.schedulingPaused || !state.deps.cronEnabled) return;
	if (state.timer) {
		clearTimeout(state.timer);
		state.timer = null;
	}
	return onTimer(state).catch((err) => {
		state.deps.log.error({ err: String(err) }, "cron: immediate capacity recheck failed");
	});
}
function requestIndependentImmediateCronRecheck(state) {
	return runInDetachedAsyncContext(() => requestImmediateCronRecheck(state));
}
/** Handles one cron timer tick under the process-wide root work admission. */
async function onTimer(state) {
	const lifecycleGeneration = state.lifecycleGeneration;
	let admission;
	try {
		admission = await beginGatewayRootWorkAdmissionWhenOpen("cron:timer-tick");
	} catch (err) {
		if (err instanceof GatewayDrainingError) return;
		throw err;
	}
	try {
		if (state.lifecycleGeneration === lifecycleGeneration) {
			const run = () => onAdmittedTimer(state);
			await admission.run(() => state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(run) : run());
		}
	} finally {
		admission.release();
	}
}
/** Loads due jobs, reserves them, executes, persists, and re-arms. */
async function onAdmittedTimer(state) {
	if (state.stopped || state.schedulingPaused || state.startupCatchup) return;
	const generation = state.lifecycleGeneration;
	state.running = true;
	state.activeTimerTicks += 1;
	armRunningRecheckTimer(state);
	const capacityRechecks = createCronCapacityRecheckTracker(() => requestImmediateCronRecheck(state), () => requestIndependentImmediateCronRecheck(state));
	let allowEmptyCapacityRecheck = false;
	try {
		const dueJobs = await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			if (state.stopped || state.startupCatchup || state.lifecycleGeneration !== generation) {
				state.deps.log.warn({}, "cron: due job reservation skipped - scheduler unavailable");
				return [];
			}
			const proposals = (state.store?.jobs ?? []).filter((job) => job.state.queuedAtMs !== void 0 || job.state.runningAtMs !== void 0).map((job) => ({
				jobId: job.id,
				queuedAtMs: job.state.queuedAtMs,
				runningAtMs: job.state.runningAtMs
			}));
			let repaired = false;
			const interruptedRuns = [];
			try {
				await recoverCronRunProposals(state, proposals, {
					isCurrent: () => !state.startupCatchup && state.lifecycleGeneration === generation,
					onRecovery(_proposal, result) {
						if (result.kind === "repaired") {
							repaired = true;
							runPostPersistCronNotifications(state, result.notifications);
							if (result.interrupted) interruptedRuns.push(result.interrupted);
						} else if (result.receipt && result.receipt.ownerPid !== process.pid) enrollForeignReceipt(state, result.receipt);
					}
				});
			} finally {
				if (repaired) await ensureLoaded(state, { forceReload: true });
				for (const interrupted of interruptedRuns) emitInterruptedCronRun(state, interrupted);
			}
			if (state.stopped || state.startupCatchup || state.lifecycleGeneration !== generation) return [];
			const dueCheckNow = state.deps.nowMs();
			const due = skipCronJobsWithoutOwners(state, collectRunnableJobs(state, dueCheckNow), dueCheckNow);
			if (due.length === 0) {
				if (!state.store?.jobs.some((job) => needsCronTimerMaintenance(job, dueCheckNow))) return [];
				await recomputeUnownedCronSchedules(state, {
					recomputeExpired: true,
					nowMs: dueCheckNow,
					repairFutureCronNextRunAtMs: state.store.jobs.some((job) => isStaleFutureCronSlot(job, dueCheckNow))
				});
				return [];
			}
			const admissionReleases = tryAcquireCronRunSlots(state, due.length);
			const admittedDue = due.slice(0, admissionReleases.length);
			if (admittedDue.length < due.length) {
				setCronRunCapacityListener(state, admittedDue.length > 0 ? () => capacityRechecks.request() : () => void requestIndependentImmediateCronRecheck(state));
				allowEmptyCapacityRecheck = admittedDue.length > 0;
			}
			if (admittedDue.length === 0) return [];
			const now = state.deps.nowMs();
			try {
				const reservedDue = (await persistQueuedCronRunReservations({
					state,
					candidates: admittedDue,
					reservedAtMs: now
				})).map(({ job, runReceipt }, index) => ({
					id: job.id,
					job,
					reservedAtMs: now,
					reservationIdentity: reserveQueuedCronRun(state, job.id, now, { runReceipt }),
					releaseAdmission: admissionReleases[index]
				}));
				if (reservedDue.length === 0 && allowEmptyCapacityRecheck) {
					const stillDue = new Set(collectRunnableJobs(state, state.deps.nowMs()).map((job) => job.id));
					allowEmptyCapacityRecheck = admittedDue.some((job) => !stillDue.has(job.id));
				}
				for (const releaseAdmission of admissionReleases.slice(reservedDue.length)) releaseAdmission();
				return reservedDue;
			} catch (error) {
				for (const releaseAdmission of admissionReleases) releaseAdmission();
				throw error;
			}
		});
		if (state.lifecycleGeneration === generation) {
			if (state.runAdmission.capacityListener) armRunningRecheckTimer(state);
			else armTimer(state);
		}
		const concurrency = Math.min(resolveRunConcurrency(), Math.max(1, dueJobs.length));
		capacityRechecks.initializeActivations(dueJobs.length, allowEmptyCapacityRecheck);
		const completedOutcomeDrain = createCompletedCronRunOutcomeDrain(state);
		const claimedIndexes = /* @__PURE__ */ new Set();
		let reservationReleaseError;
		let setupTimeoutNotified = false;
		let stopAdmittingDueJobs = false;
		const releaseUnclaimedDueJobReservationsWithRetry = async () => {
			const unclaimed = dueJobs.filter((_, index) => !claimedIndexes.has(index));
			const reservations = unclaimed.map((due) => ({
				jobId: due.id,
				reservationIdentity: due.reservationIdentity
			}));
			try {
				await cleanupQueuedCronRunReservations({
					state,
					reservations,
					recompute: "maintenance"
				});
			} finally {
				for (const due of unclaimed) due.releaseAdmission();
			}
		};
		if (state.stopped || state.lifecycleGeneration !== generation) {
			capacityRechecks.abort();
			if (dueJobs.length > 0) await releaseUnclaimedDueJobReservationsWithRetry();
			return;
		}
		let completedResults;
		let batchExecutionError;
		try {
			completedResults = await pMap(dueJobs, async (due, index) => {
				let initialActivationSettled = false;
				const settleThisInitialActivation = (allowRecheck) => {
					if (initialActivationSettled) return;
					initialActivationSettled = true;
					capacityRechecks.settleActivation(allowRecheck);
				};
				if (stopAdmittingDueJobs || state.stopped) {
					stopAdmittingDueJobs = true;
					settleThisInitialActivation(false);
					return pMapSkip;
				}
				try {
					const execution = await executeQueuedCronRun({
						state,
						jobId: due.id,
						reservedAtMs: due.reservedAtMs,
						reservationIdentity: due.reservationIdentity,
						admissionRelease: due.releaseAdmission,
						isUnavailable: () => stopAdmittingDueJobs,
						onUnavailable: () => {
							stopAdmittingDueJobs = true;
						},
						onActivated: () => {
							claimedIndexes.add(index);
							settleThisInitialActivation(true);
						},
						onNotRunnable: async () => {
							const committedJob = commitCronRuntimeRows({
								state,
								jobIds: [due.id],
								operationLabel: "cron.skipped-reservation-cleanup",
								mutate: ({ database, jobs }) => {
									const current = jobs.get(due.id);
									const ownership = state.queuedRunReservationsByJobId.get(due.id);
									if (!current || ownership?.identity !== due.reservationIdentity || ownership.markerAtMs !== current.state.queuedAtMs) return { value: void 0 };
									finishCronRunReceiptInDatabase({
										database,
										handle: ownership.runReceipt,
										status: "skipped",
										finishedAtMs: state.deps.nowMs(),
										error: "cron scheduled reservation became ineligible"
									});
									delete current.state.queuedAtMs;
									return {
										upsertJobIds: [current.id],
										value: current
									};
								}
							});
							if (committedJob) applyCronRuntimeRowsToState(state, [committedJob]);
							const ownership = state.queuedRunReservationsByJobId.get(due.id);
							if (ownership?.identity === due.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
							releaseQueuedCronRun(state, due.id, due.reservationIdentity);
						},
						onSetupError: (job, errorText) => {
							state.deps.log.warn({
								jobId: due.id,
								jobName: job.name,
								timeoutMs: resolveCronJobTimeoutMs(job) ?? null
							}, `cron: job failed: ${errorText}`);
						},
						onCompleted: async (result) => {
							if (!result.isolatedAgentSetupTimeout) {
								completedOutcomeDrain.enqueue(result);
								return true;
							}
							let finalizedResults;
							try {
								finalizedResults = await finalizeCompletedCronRunOutcomes(state, [result], { clearOnFailure: false });
							} catch {
								return false;
							}
							if (finalizedResults.length > 0 && !setupTimeoutNotified && maybeNotifyIsolatedAgentSetupTimeout(state, result)) {
								setupTimeoutNotified = true;
								stopAdmittingDueJobs = true;
								try {
									await releaseUnclaimedDueJobReservationsWithRetry();
								} catch (err) {
									reservationReleaseError = err;
								}
							}
							return true;
						}
					});
					if (execution.kind === "stopped") {
						stopAdmittingDueJobs = true;
						return pMapSkip;
					}
					if (execution.kind === "skipped") {
						settleThisInitialActivation(!stopAdmittingDueJobs && !state.stopped);
						return pMapSkip;
					}
					if (execution.handled) return pMapSkip;
					return execution.outcome;
				} catch (error) {
					stopAdmittingDueJobs = true;
					batchExecutionError ??= error;
					return pMapSkip;
				} finally {
					settleThisInitialActivation(false);
				}
			}, {
				concurrency,
				stopOnError: false
			});
		} catch (error) {
			let finalizationError;
			try {
				await completedOutcomeDrain.flush();
			} catch (drainError) {
				finalizationError = drainError;
			}
			await releaseUnclaimedDueJobReservationsWithRetry();
			if (finalizationError) throw finalizationError instanceof Error ? finalizationError : new Error(formatErrorMessage(finalizationError));
			throw error instanceof AggregateError && error.errors.length > 0 ? error.errors[0] : error;
		}
		let postBatchError = reservationReleaseError;
		try {
			await completedOutcomeDrain.flush();
		} catch (error) {
			postBatchError ??= error;
			stopAdmittingDueJobs = true;
		}
		if (stopAdmittingDueJobs) try {
			await releaseUnclaimedDueJobReservationsWithRetry();
		} catch (error) {
			postBatchError ??= error;
		}
		if (completedResults.length > 0) {
			const finalizedResults = await finalizeCompletedCronRunOutcomes(state, completedResults);
			for (const result of finalizedResults) if (!setupTimeoutNotified && result.isolatedAgentSetupTimeout && maybeNotifyIsolatedAgentSetupTimeout(state, result)) {
				setupTimeoutNotified = true;
				break;
			}
		}
		if (postBatchError) throw postBatchError instanceof Error ? postBatchError : new Error(formatErrorMessage(postBatchError));
		if (batchExecutionError) throw batchExecutionError instanceof Error ? batchExecutionError : new Error(formatErrorMessage(batchExecutionError));
	} finally {
		capacityRechecks.abort();
		await capacityRechecks.drain();
		try {
			if (state.lifecycleGeneration === generation && (state.deps.resolveSessionStorePath || state.deps.sessionStorePath)) {
				const configuredDefaultAgentId = (state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId)?.trim();
				const defaultAgentId = configuredDefaultAgentId ? normalizeAgentId(configuredDefaultAgentId) : void 0;
				const reaperAgentIds = new Set((state.deps.resolveSessionStoreAgentIds?.() ?? []).map(normalizeAgentId));
				const resolveJobAgentId = (job) => {
					if (typeof job.agentId === "string" && job.agentId.trim()) return normalizeAgentId(job.agentId);
					try {
						return resolveAgentIdFromSessionKey(job.sessionKey, defaultAgentId);
					} catch {
						return;
					}
				};
				for (const job of state.store?.jobs ?? []) {
					const agentId = resolveJobAgentId(job);
					if (agentId) reaperAgentIds.add(agentId);
				}
				if (defaultAgentId) reaperAgentIds.add(defaultAgentId);
				if (reaperAgentIds.size > 0) {
					const nowMs = state.deps.nowMs();
					for (const agentId of reaperAgentIds) {
						const storePath = state.deps.resolveSessionStorePath ? state.deps.resolveSessionStorePath(agentId) : state.deps.sessionStorePath;
						if (!storePath) continue;
						try {
							await sweepCronRunSessions({
								agentId,
								cronConfig: state.deps.cronConfig,
								sessionStorePath: storePath,
								isAgentAvailable: state.deps.isAgentAvailable,
								nowMs,
								log: state.deps.log
							});
						} catch (err) {
							state.deps.log.warn({
								err: String(err),
								storePath
							}, "cron: session reaper sweep failed");
						}
					}
				}
			}
		} catch (err) {
			state.deps.log.warn({ err: String(err) }, "cron: session reaper preparation failed");
		} finally {
			state.activeTimerTicks = Math.max(0, state.activeTimerTicks - 1);
			state.running = state.activeTimerTicks > 0;
			if (!state.running && state.lifecycleGeneration === generation) armTimer(state);
		}
	}
}
//#endregion
//#region src/cron/service/timer-catchup.ts
function collectStartupCatchupJobs(state, nowMs, opts) {
	if (!state.store) return [];
	const missed = [];
	const skippedJobIds = [];
	const postPersistNotifications = [];
	const committedJobs = commitCronRuntimeRows({
		state,
		jobIds: state.store.jobs.map((job) => job.id),
		operationLabel: "cron.startup-schedules",
		mutate: ({ database, jobs }) => {
			const committed = [];
			for (const job of jobs.values()) {
				if (!isJobEnabled(job) || opts?.skipJobIds?.has(job.id) || hasActiveCronRun(job) || findActiveCronRunReceiptInDatabase({
					database,
					storePath: state.deps.storePath,
					jobId: job.id
				})) continue;
				const backoffUntilMs = job.schedule.kind === "cron" ? resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) : void 0;
				if (backoffUntilMs !== void 0 && nowMs < backoffUntilMs && hasMissedCronSlotSinceLastRun(job, nowMs) && job.state.nextRunAtMs !== backoffUntilMs) {
					job.state.nextRunAtMs = backoffUntilMs;
					committed.push(job);
					continue;
				}
				if (!isRunnableJob({
					state,
					job,
					nowMs,
					skipAtIfAlreadyRan: true,
					allowCronMissedRunByLastRun: true
				})) continue;
				if (state.deps.cronConfig?.skipMissedJobs && (job.schedule.kind === "cron" || job.schedule.kind === "every")) {
					if (recomputeJobNextRunAtMs({
						state,
						job,
						nowMs,
						deferredNotifications: postPersistNotifications
					})) committed.push(job);
					skippedJobIds.push(job.id);
				} else missed.push(job);
			}
			return {
				upsertJobIds: committed.map((job) => job.id),
				value: committed
			};
		}
	});
	runPostPersistCronNotifications(state, postPersistNotifications);
	applyCronRuntimeRowsToState(state, committedJobs);
	if (skippedJobIds.length > 0) state.deps.log.info({
		count: skippedJobIds.length,
		jobIds: skippedJobIds
	}, "cron: skipped missed recurring jobs after restart");
	return missed;
}
function commitStartupCatchupRows(params) {
	const postPersistNotifications = [];
	const deferredJobs = params.deferredJobs ?? [];
	const reservationByJobId = new Map(params.reservations.map((reservation) => [reservation.jobId, reservation]));
	const deferredByJobId = new Map(deferredJobs.map((deferred) => [deferred.jobId, deferred]));
	const baseNow = params.state.deps.nowMs();
	let offset = params.staggerMs ?? 0;
	const committedJobs = commitCronRuntimeRows({
		state: params.state,
		jobIds: [...reservationByJobId.keys(), ...deferredByJobId.keys()],
		operationLabel: "cron.startup-catchup-state",
		mutate: ({ database, jobs }) => {
			const committed = [];
			for (const [jobId, job] of jobs) {
				let changed = false;
				const reservation = reservationByJobId.get(jobId);
				const ownership = params.state.queuedRunReservationsByJobId.get(jobId);
				if (reservation && ownership?.identity === reservation.reservationIdentity) {
					finishCronRunReceiptInDatabase({
						database,
						handle: ownership.runReceipt,
						status: "skipped",
						finishedAtMs: params.state.deps.nowMs(),
						error: "cron startup reservation abandoned before completion"
					});
					if (ownership.activationPreviousLastError) job.state.lastError = ownership.activationPreviousLastError.value;
					if (ownership.markerAtMs === job.state.queuedAtMs) {
						delete job.state.queuedAtMs;
						changed = true;
					}
					if (ownership.markerAtMs === job.state.runningAtMs) {
						delete job.state.runningAtMs;
						delete job.state.runningReceiptId;
						delete job.state.runningScheduleChangeId;
						changed = true;
					}
				}
				const deferred = deferredByJobId.get(jobId);
				if (deferred && isJobEnabled(job) && job.state.queuedAtMs === void 0 && job.state.runningAtMs === void 0 && job.state.nextRunAtMs === deferred.nextRunAtMs && job.state.lastRunAtMs === deferred.lastRunAtMs && job.state.lastRunStatus === deferred.lastRunStatus && job.state.scheduleActivatedAtMs === deferred.scheduleActivatedAtMs && job.createdAtMs === deferred.createdAtMs && job.payload.kind === deferred.payloadKind && deferred.scheduleIdentity !== void 0 && tryCronScheduleIdentity(job) === deferred.scheduleIdentity && !findActiveCronRunReceiptInDatabase({
					database,
					storePath: params.state.deps.storePath,
					jobId
				})) {
					const candidate = typeof deferred.delayMs === "number" ? baseNow + deferred.delayMs + offset - (params.staggerMs ?? 0) : baseNow + offset;
					const runAtMs = resolveNextRunAtMsOrDisable({
						state: params.state,
						job,
						candidate,
						deferredNotifications: postPersistNotifications
					});
					job.state.nextRunAtMs = runAtMs;
					job.state.startupCatchupAtMs = runAtMs;
					offset += params.staggerMs ?? 0;
					changed = true;
				}
				if (changed) committed.push(job);
			}
			return {
				upsertJobIds: committed.map((job) => job.id),
				value: committed
			};
		}
	});
	runPostPersistCronNotifications(params.state, postPersistNotifications);
	applyCronRuntimeRowsToState(params.state, committedJobs);
	for (const reservation of params.reservations) {
		const ownership = params.state.queuedRunReservationsByJobId.get(reservation.jobId);
		if (ownership?.identity === reservation.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
		releaseQueuedCronRun(params.state, reservation.jobId, reservation.reservationIdentity);
	}
}
async function releaseStartupCatchupReservationsAfterFailure(state, plan, outcomes) {
	const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
	await cleanupQueuedCronRunReservations({
		state,
		reservations: plan.candidates.filter((candidate) => !startedJobIds.has(candidate.jobId)),
		recompute: "startup-overflow"
	});
}
/** Runs or defers missed startup jobs using restart catch-up limits. */
async function runMissedJobs(state, opts) {
	if (state.stopped) return;
	const catchup = {};
	state.startupCatchup = catchup;
	try {
		const plan = await planStartupCatchup(state, opts);
		if (plan.candidates.length === 0 && plan.deferredJobs.length === 0) return;
		const completedOutcomeDrain = createCompletedCronRunOutcomeDrain(state, {
			discardWhenStopped: true,
			repairFutureCronNextRunAtMs: false
		});
		const execution = await executeStartupCatchupPlan(state, plan, completedOutcomeDrain);
		let finalizedOutcomes;
		try {
			let completedOutcomes;
			try {
				completedOutcomes = await completedOutcomeDrain.flush();
			} catch (drainError) {
				await applyStartupCatchupOutcomes(state, plan, execution.outcomes);
				throw drainError;
			}
			finalizedOutcomes = await applyStartupCatchupOutcomes(state, plan, completedOutcomes);
		} catch (finalizationError) {
			try {
				await releaseStartupCatchupReservationsAfterFailure(state, plan, execution.outcomes);
			} catch (cleanupError) {
				state.deps.log.warn({ err: String(cleanupError) }, execution.ok ? "cron: failed to release startup catch-up reservations after finalization error" : "cron: failed to release startup catch-up reservations after execution error");
			}
			throw execution.ok ? finalizationError : execution.error;
		}
		for (const outcome of finalizedOutcomes) maybeNotifyIsolatedAgentSetupTimeout(state, outcome);
		if (!execution.ok) throw execution.error;
	} finally {
		if (state.startupCatchup === catchup) state.startupCatchup = void 0;
	}
}
async function planStartupCatchup(state, opts) {
	const maxImmediate = Math.max(0, state.deps.maxMissedJobsPerRestart ?? 5);
	return locked(state, async () => {
		await ensureLoaded(state);
		if (state.stopped || !state.store) return {
			candidates: [],
			deferredJobs: []
		};
		const now = state.deps.nowMs();
		const missed = skipCronJobsWithoutOwners(state, collectStartupCatchupJobs(state, now, { skipJobIds: opts?.skipJobIds }), now);
		if (missed.length === 0) return {
			candidates: [],
			deferredJobs: []
		};
		const sorted = missed.toSorted((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0));
		const deferredAgentJobs = [];
		const startupEligible = [];
		for (const job of sorted) {
			const waitsForAgent = job.payload.kind === "agentTurn" || job.payload.kind === "heartbeat" || isHeartbeatTaskCronJob(job) || job.sessionTarget === "main" && job.payload.kind === "systemEvent" && job.wakeMode === "now";
			(opts?.deferAgentWork && waitsForAgent ? deferredAgentJobs : startupEligible).push(job);
		}
		const startupCandidates = startupEligible.slice(0, maxImmediate);
		const deferredOverflow = startupEligible.slice(maxImmediate);
		const deferredAgentDelayMs = Math.max(0, state.deps.startupDeferredMissedAgentJobDelayMs ?? 12e4);
		const deferredJob = (job, delayMs) => ({
			jobId: job.id,
			...delayMs === void 0 ? {} : { delayMs },
			scheduleIdentity: tryCronScheduleIdentity(job),
			createdAtMs: job.createdAtMs,
			payloadKind: job.payload.kind,
			scheduleActivatedAtMs: job.state.scheduleActivatedAtMs,
			nextRunAtMs: job.state.nextRunAtMs,
			lastRunAtMs: job.state.lastRunAtMs,
			lastRunStatus: job.state.lastRunStatus
		});
		const deferred = [...deferredOverflow.map((job) => deferredJob(job)), ...deferredAgentJobs.map((job) => deferredJob(job, deferredAgentDelayMs))];
		if (deferred.length > 0) state.deps.log.info({
			immediateCount: startupCandidates.length,
			deferredCount: deferred.length,
			totalMissed: missed.length
		}, "cron: staggering missed jobs to prevent gateway overload");
		if (deferredAgentJobs.length > 0) state.deps.log.info({
			count: deferredAgentJobs.length,
			jobIds: deferredAgentJobs.map((job) => job.id),
			delayMs: deferredAgentDelayMs
		}, "cron: deferring missed agent jobs until after gateway startup");
		if (startupCandidates.length > 0) state.deps.log.info({
			count: startupCandidates.length,
			jobIds: startupCandidates.map((j) => j.id)
		}, "cron: running missed jobs after restart");
		return {
			candidates: (await persistQueuedCronRunReservations({
				state,
				candidates: startupCandidates,
				reservedAtMs: now
			})).map(({ job, runReceipt }) => ({
				jobId: job.id,
				job,
				reservedAtMs: now,
				reservationIdentity: reserveQueuedCronRun(state, job.id, now, { runReceipt })
			})),
			deferredJobs: deferred
		};
	});
}
async function executeStartupCatchupPlan(state, plan, completedOutcomeDrain) {
	const outcomes = [];
	try {
		for (const candidate of plan.candidates) {
			if (state.stopped) break;
			const execution = await executeQueuedCronRun({
				state,
				jobId: candidate.jobId,
				reservedAtMs: candidate.reservedAtMs,
				reservationIdentity: candidate.reservationIdentity,
				runnableOptions: {
					skipAtIfAlreadyRan: true,
					allowCronMissedRunByLastRun: true
				},
				onNotRunnable: async () => {
					commitStartupCatchupRows({
						state,
						reservations: [candidate]
					});
				}
			});
			if (execution.kind === "stopped") break;
			if (execution.kind === "completed") {
				outcomes.push(execution.outcome);
				completedOutcomeDrain.enqueue(execution.outcome);
			}
		}
	} catch (error) {
		return {
			ok: false,
			outcomes,
			error
		};
	}
	return {
		ok: true,
		outcomes
	};
}
async function applyStartupCatchupOutcomes(state, plan, outcomes) {
	const staggerMs = Math.max(0, state.deps.missedJobStaggerMs ?? 5e3);
	await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		if (!state.store) return;
		const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
		const pendingReleases = plan.candidates.filter((candidate) => !startedJobIds.has(candidate.jobId));
		if (state.stopped || outcomes.length === 0 && plan.deferredJobs.length === 0) {
			if (pendingReleases.length > 0) commitStartupCatchupRows({
				state,
				reservations: pendingReleases
			});
			return;
		}
		commitStartupCatchupRows({
			state,
			reservations: pendingReleases,
			deferredJobs: plan.deferredJobs,
			staggerMs
		});
		await recomputeUnownedCronSchedules(state, { repairFutureCronNextRunAtMs: false });
	});
	return outcomes;
}
//#endregion
//#region src/cron/service/timer.ts
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.cronTimerTestApi")] = { onTimer };
//#endregion
//#region src/cron/service/ops-lifecycle.ts
function applyRecoveryResult(params) {
	const { state, proposal, result } = params;
	if (result.kind === "live") {
		enrollForeignReceipt(state, result.receipt);
		params.skipJobIds?.add(proposal.jobId);
		return false;
	}
	if (result.kind === "superseded") {
		if (result.receipt) {
			enrollForeignReceipt(state, result.receipt);
			params.skipJobIds?.add(proposal.jobId);
		} else removeForeignReceipt(state, proposal.jobId);
		return true;
	}
	removeForeignReceipt(state, proposal.jobId);
	runPostPersistCronNotifications(state, result.notifications);
	if (result.interrupted) params.interruptedRuns.push(result.interrupted);
	if (result.skipStartupCatchup) params.skipJobIds?.add(proposal.jobId);
	return true;
}
async function reconcileForeignRunReceipts(state) {
	let schedulingChanged = false;
	const interruptedRuns = [];
	await locked(state, async () => {
		if (state.stopped) return;
		const proposals = listForeignReceipts(state).map((receipt) => {
			const job = state.store?.jobs.find((entry) => entry.id === receipt.jobId);
			return {
				jobId: receipt.jobId,
				queuedAtMs: job?.state.queuedAtMs,
				runningAtMs: job?.state.runningAtMs,
				runningReceiptId: job?.state.runningReceiptId,
				receipt
			};
		});
		try {
			await recoverCronRunProposals(state, proposals, { onRecovery(proposal, result) {
				schedulingChanged = applyRecoveryResult({
					state,
					proposal,
					result,
					interruptedRuns
				}) || schedulingChanged;
			} });
		} finally {
			if (schedulingChanged) {
				await ensureLoaded(state, { forceReload: true });
				for (const interrupted of interruptedRuns) emitInterruptedCronRun(state, interrupted);
			}
		}
	});
	if (schedulingChanged && state.schedulerStarted) armTimer(state);
}
/** Waits for receipt retirement without reserving a run or extending its timeout response. */
async function waitForRunSettlement(state, jobId, signal) {
	const generation = state.lifecycleGeneration;
	while (true) {
		const result = await racePromiseWithAbortSignal(locked(state, async () => {
			if (signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			await ensureLoaded(state);
			if (signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			const job = state.store?.jobs.find((entry) => entry.id === jobId);
			const proposal = {
				jobId,
				queuedAtMs: job?.state.queuedAtMs,
				runningAtMs: job?.state.runningAtMs
			};
			let recovery;
			let changed = false;
			const interruptedRuns = [];
			try {
				await recoverCronRunProposals(state, [proposal], {
					signal,
					onRecovery(observed, recovered) {
						recovery = recovered;
						changed = applyRecoveryResult({
							state,
							proposal: observed,
							result: recovered,
							interruptedRuns
						});
					}
				});
			} finally {
				if (changed) {
					await ensureLoaded(state, { forceReload: true });
					for (const interrupted of interruptedRuns) emitInterruptedCronRun(state, interrupted);
					if (state.schedulerStarted) armTimer(state);
				}
			}
			if (!recovery || signal.aborted || state.stopped || state.lifecycleGeneration !== generation) return { settled: false };
			if (recovery.kind === "repaired" || !recovery.receipt) return { settled: true };
			configureForeignReceiptMonitor(state, async () => await reconcileForeignRunReceipts(state));
			return { waiting: waitForForeignReceipt(state, jobId, signal) };
		}), signal).catch((error) => {
			if (signal.aborted && isAbortError(error)) return { settled: false };
			throw error;
		});
		if ("settled" in result) return result.settled;
		if (!await result.waiting) return false;
	}
}
/** Starts the cron service, atomically repairs abandoned runs, and arms scheduling. */
async function start(state) {
	state.stopped = false;
	const generation = state.lifecycleGeneration;
	stopForeignReceiptMonitor(state);
	configureForeignReceiptMonitor(state, async () => await reconcileForeignRunReceipts(state));
	if (!state.deps.cronEnabled) {
		state.deps.log.info({ enabled: false }, "cron: disabled");
		return;
	}
	const skipJobIds = /* @__PURE__ */ new Set();
	await locked(state, async () => {
		const interruptedRuns = [];
		await ensureLoaded(state);
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		if (state.deps.legacyDefaultAgentId) {
			const rewritten = await materializeLegacyDefaultCronJobOwners({
				storePath: state.deps.storePath,
				legacyDefaultAgentId: state.deps.legacyDefaultAgentId
			});
			if (rewritten > 0) {
				state.deps.log.info({
					storePath: state.deps.storePath,
					rewritten
				}, "cron: assigned legacy jobs to the retained owner");
				await ensureLoaded(state, { forceReload: true });
			}
		}
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		const proposals = [];
		for (const job of state.store?.jobs ?? []) {
			job.state ??= {};
			if (typeof job.state.queuedAtMs === "number") proposals.push({
				jobId: job.id,
				queuedAtMs: job.state.queuedAtMs
			});
			if (typeof job.state.runningAtMs === "number") proposals.push({
				jobId: job.id,
				runningAtMs: job.state.runningAtMs
			});
		}
		try {
			await recoverCronRunProposals(state, proposals, {
				mode: "startup",
				onRecovery(proposal, result) {
					applyRecoveryResult({
						state,
						proposal,
						result,
						interruptedRuns,
						skipJobIds
					});
				}
			});
		} finally {
			if (proposals.length > 0) await ensureLoaded(state, { forceReload: true });
			for (const interrupted of interruptedRuns) emitInterruptedCronRun(state, interrupted);
		}
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		if (listForeignReceipts(state).length > 0) await recomputeUnownedCronSchedules(state);
	});
	if (state.stopped || state.lifecycleGeneration !== generation) return;
	await runMissedJobs(state, {
		skipJobIds: skipJobIds.size > 0 ? skipJobIds : void 0,
		deferAgentWork: true
	});
	await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		if (listForeignReceipts(state).length === 0) await recomputeUnownedCronSchedules(state, { recomputeExpired: true });
		if (state.stopped || state.lifecycleGeneration !== generation) return;
		armTimer(state);
		resumeForeignReceiptMonitor(state);
		state.deps.log.info({
			enabled: true,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: nextWakeAtMs(state) ?? null
		}, "cron: started");
	});
}
/** Stops the cron service timer without mutating persisted job state. */
function stop(state) {
	state.lifecycleGeneration += 1;
	state.stopped = true;
	cancelCronRunAdmissionWaiters(state);
	state.schedulerStarted = false;
	stopForeignReceiptMonitor(state);
	stopTimer(state);
}
/** Temporarily stops automatic ticks without running startup recovery on resume. */
function pauseScheduling(state) {
	state.schedulingPaused = true;
	stopTimer(state);
}
function resumeScheduling(state) {
	if (!state.schedulingPaused) return;
	state.schedulingPaused = false;
	if (!state.schedulerStarted) return;
	try {
		armTimer(state);
		resumeForeignReceiptMonitor(state);
	} catch (err) {
		state.schedulingPaused = true;
		stopTimer(state);
		throw err;
	}
}
//#endregion
//#region src/cron/service/jobs-mutation.ts
/** Completes a canonical job edit before authority rebinding and persistence. */
/** Keep the harness-owned immutable envelope intact when copying mutable job fields. */
function cloneCronJobForMutation(job) {
	const { runtimeAuthority, ...mutableJob } = job;
	return {
		...structuredClone(mutableJob),
		...runtimeAuthority ? { runtimeAuthority } : {}
	};
}
function reconcileStreamSourceIdentity(job, nextJob) {
	if (nextJob.schedule.kind !== "stream") {
		nextJob.state.streamSourceIdentity = void 0;
		return;
	}
	const sourceChanged = job.schedule.kind !== "stream" || cronStreamScheduleKey(job.schedule) !== cronStreamScheduleKey(nextJob.schedule) || isJobEnabled(job) !== isJobEnabled(nextJob);
	const currentIdentity = job.schedule.kind === "stream" ? job.state.streamSourceIdentity : void 0;
	nextJob.state.streamSourceIdentity = sourceChanged || !currentIdentity ? createCronStreamSourceIdentity() : currentIdentity;
}
function finalizeUpdatedJob(params) {
	const { job, nextJob, now } = params;
	if (nextJob.schedule.kind === "every") {
		const anchor = nextJob.schedule.anchorMs;
		if (typeof anchor !== "number" || !Number.isFinite(anchor)) {
			const fallbackAnchorMs = (job.schedule.kind === "every" && job.schedule.everyMs === nextJob.schedule.everyMs && typeof job.schedule.anchorMs === "number" && Number.isFinite(job.schedule.anchorMs) ? job.schedule.anchorMs : void 0) ?? (params.scheduleChanged ? now : typeof nextJob.createdAtMs === "number" && Number.isFinite(nextJob.createdAtMs) ? nextJob.createdAtMs : now);
			nextJob.schedule = {
				...nextJob.schedule,
				anchorMs: Math.max(0, Math.floor(fallbackAnchorMs))
			};
		}
	}
	reconcileStreamSourceIdentity(job, nextJob);
	const previousScript = job.payload.kind === "script" ? job.payload.script : void 0;
	const nextScript = nextJob.payload.kind === "script" ? nextJob.payload.script : void 0;
	if (!isDeepStrictEqual(job.trigger, nextJob.trigger) || previousScript !== nextScript) for (const field of [
		"triggerState",
		"triggerEvalCount",
		"lastTriggerEvalAtMs",
		"lastTriggerFireAtMs"
	]) if (params.explicitTriggerState && Object.hasOwn(params.explicitTriggerState, field)) Object.assign(nextJob.state, { [field]: params.explicitTriggerState[field] });
	else delete nextJob.state[field];
	const schedulingInputsChanged = params.schedulingInputsRequested && !cronSchedulingInputsEqual(job, nextJob);
	if (params.scheduleChanged && nextJob.schedule.kind === "cron" && !isJobEnabled(nextJob)) computeJobNextRunAtMs({
		...nextJob,
		enabled: true
	}, now);
	nextJob.updatedAtMs = now;
	if (schedulingInputsChanged) {
		nextJob.state.scheduleActivatedAtMs = now;
		nextJob.state.startupCatchupAtMs = void 0;
		nextJob.state.pacedNextRunAtMs = void 0;
		nextJob.state.forcePreservedNextRunAtMs = cronSchedulingInputsEqual({
			...job,
			enabled: nextJob.enabled
		}, nextJob) ? resolveForcePreservedOneShotAtMs(job) : void 0;
		if (isJobEnabled(nextJob)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
		else {
			nextJob.state.nextRunAtMs = void 0;
			nextJob.state.queuedAtMs = void 0;
			if (!isCronJobActive(nextJob.id)) {
				Object.assign(nextJob.state, {
					runningAtMs: void 0,
					runningReceiptId: void 0
				});
				delete nextJob.state.runningScheduleChangeId;
			}
		}
	} else if (isJobEnabled(nextJob) && !hasScheduledNextRunAtMs(nextJob.state.nextRunAtMs)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
	if (nextJob.state.runningAtMs !== job.state.runningAtMs) delete nextJob.state.runningReceiptId;
}
//#endregion
//#region src/cron/service/ops-shared.ts
/** Shared cron operation invariants used across lifecycle, CRUD, and manual runs. */
/** Resolves the effective agent using explicit job identity before configured defaults. */
function resolveEffectiveJobAgentId(job, defaultAgentId) {
	return resolveCronJobEffectiveAgentId(job, defaultAgentId);
}
function markManualCronJobActive(state, job, runReceipt) {
	state.activeManualRunJobIds.add(job.id);
	return markServiceCronJobActive(state, job, runReceipt);
}
function clearManualCronJobActive(state, jobId, activeJobMarker) {
	state.activeManualRunJobIds.delete(jobId);
	clearCronJobActive(jobId, activeJobMarker);
	if (state.activeManualRunJobIds.size === 0) state.manualSetupTimeoutNotified = false;
}
function maybeNotifyManualIsolatedSetupTimeout(state, result) {
	if (!result.isolatedAgentSetupTimeout || state.manualSetupTimeoutNotified) return false;
	const notified = maybeNotifyIsolatedAgentSetupTimeout(state, result);
	state.manualSetupTimeoutNotified ||= notified;
	return notified;
}
async function ensureLoadedForRead(state) {
	await ensureLoadedForOperation(state);
	if (!state.store || state.schedulerStarted) return;
	await recomputeUnownedCronSchedules(state);
}
/** Resolves the current configured default agent without caching reloadable state. */
function resolveCurrentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId;
}
/** Returns whether a stream event still belongs to the job's current logical source. */
function ownsStreamSource(job, streamScheduleKey, streamSourceIdentity) {
	return job.schedule.kind === "stream" && cronStreamScheduleKey(job.schedule) === streamScheduleKey && job.state.streamSourceIdentity === streamSourceIdentity;
}
//#endregion
//#region src/cron/service/ops-mutations.ts
const RETRY_ADD_AFTER_SESSION_CLEANUP = /* @__PURE__ */ new Error("retry add after session cleanup");
/** Cancels only caller-corroborated definitions while the durable lifecycle fence holds. */
async function quiesceJobs(state, jobs, commitGuard) {
	await locked(state, async () => {
		await ensureLoadedForOperation(state);
		for (const expected of jobs) {
			const job = state.store?.jobs.find((candidate) => candidate.id === expected.id);
			if (!job || resolveCronJobConfigRevision(job) !== expected.revision) throw new Error(`Cron job ${expected.id} changed before cancellation.`);
		}
		commitGuard();
		for (const job of jobs) requestActiveCronJobCancellation(job.id, "Claw agent removal.");
	});
}
async function persistUpdatedJob(params) {
	const { state, snapshot, previousJob, nextJob, persistStore } = params;
	const reservation = state.queuedRunReservationsByJobId.get(nextJob.id);
	const preservesOnExitRearm = reservation?.onExit === true && reservation.lifecycleGeneration === state.lifecycleGeneration && reservation.markerAtMs === previousJob.state.queuedAtMs && previousJob.schedule.kind === "on-exit" && !previousJob.enabled && nextJob.enabled && resolveCronJobConfigRevision(previousJob) === resolveCronJobConfigRevision({
		...nextJob,
		enabled: false
	});
	if (nextJob.state.queuedAtMs !== void 0 && !preservesOnExitRearm && resolveCronJobConfigRevision(previousJob) !== resolveCronJobConfigRevision(nextJob)) delete nextJob.state.queuedAtMs;
	if (state.store) {
		const index = state.store.jobs.findIndex((entry) => entry.id === nextJob.id);
		if (index >= 0) state.store.jobs[index] = nextJob;
	}
	const defaultAgentId = resolveCurrentDefaultAgentId(state);
	const ownerChanged = resolveEffectiveJobAgentId(previousJob, defaultAgentId) !== resolveEffectiveJobAgentId(nextJob, defaultAgentId);
	const triggerStateChanged = !isDeepStrictEqual(previousJob.trigger, nextJob.trigger) || !isDeepStrictEqual(previousJob.state.triggerState, nextJob.state.triggerState) || (previousJob.payload.kind === "script" || nextJob.payload.kind === "script") && !isDeepStrictEqual(previousJob.payload, nextJob.payload);
	const scheduleChanged = !cronSchedulingInputsEqual(previousJob, nextJob);
	const messageActionAuthorityChanged = isJobEnabled(previousJob) && !isJobEnabled(nextJob) || !cronJobMessageToolAuthorityInputsEqual(previousJob, nextJob);
	const messageSourceAuthorityChanged = !cronJobMessageActionAuthorityInputsEqual(previousJob, nextJob) || triggerStateChanged && Boolean(resolveCronAuthenticatedChannelRequester(previousJob) || resolveCronAuthenticatedChannelRequester(nextJob) || resolveCronAuthenticatedCallerOrigin(previousJob) || resolveCronAuthenticatedCallerOrigin(nextJob));
	await persistStore(state, snapshot, {
		suppressScheduledJobId: nextJob.id,
		transactionHooks: withCronMutationCommitHook(params.mutationMethod, cronRunReceiptMutationHooks({
			state,
			jobId: nextJob.id,
			ownerChanged,
			triggerStateChanged,
			messageActionAuthorityChanged,
			messageSourceAuthorityChanged,
			...scheduleChanged ? { scheduleChangedJob: nextJob } : {}
		}))
	});
	if (isJobEnabled(previousJob) && !isJobEnabled(nextJob)) requestActiveCronJobCancellation(nextJob.id, "Cron job disabled by operator.");
	if (triggerStateChanged) noteActiveCronJobTriggerMutation(nextJob.id);
	armTimer(state);
	emit(state, {
		jobId: nextJob.id,
		action: "updated",
		job: nextJob,
		nextRunAtMs: nextJob.state.nextRunAtMs
	});
}
/** Adds or converges a declaration-keyed cron job inside one store lock and write transaction. */
async function add(state, input, opts) {
	let pendingSessionCleanup;
	return await locked(state, async () => {
		warnIfDisabled(state, "add");
		if (input.payload.kind === "heartbeat" && opts?.systemOwned !== true) throw new Error("system-owned payloads cannot be created by cron clients");
		const declarationKey = normalizeOptionalString(input.declarationKey);
		const systemOwnedDeclarationNamespace = systemOwnedDeclarationKeyNamespace(declarationKey);
		if (systemOwnedDeclarationNamespace && opts?.systemOwned !== true) throw new Error(`cron declarationKey namespace "${systemOwnedDeclarationNamespace}" is system-owned; jobs cannot be created with it`);
		await ensureLoadedForOperation(state);
		const agentId = resolveEffectiveJobAgentId(input, resolveCurrentDefaultAgentId(state));
		if (state.deps.isAgentAvailable?.(agentId) === false) throw new Error(describeUnavailableCronAgent(agentId));
		const normalizedId = normalizeOptionalString(input.id);
		if (input.id !== void 0 && !normalizedId) throw new Error("cron job id must not be blank");
		if (normalizedId) {
			normalizeCronTaskRunJobId(normalizedId);
			pendingSessionCleanup = getPendingCronSessionCleanup(state, normalizedId);
			if (pendingSessionCleanup) throw RETRY_ADD_AFTER_SESSION_CLEANUP;
		}
		const normalizedInput = normalizedId ? {
			...input,
			id: normalizedId
		} : input;
		const matches = declarationKey ? state.store?.jobs.filter((job) => job.declarationKey === declarationKey && (opts?.matchesExisting?.(job) ?? true)) ?? [] : [];
		if (matches.length > 1) throw new Error(`cron declarationKey is ambiguous within caller scope: ${declarationKey}`);
		const existing = matches[0];
		const configuredChannels = await resolveConfiguredChannelsForValidation(state);
		const persistStore = opts?.commitGuard !== void 0 || opts?.captureRuntimeAuthority !== void 0 ? persistNativeOrRestore : persistOrRestore;
		if (existing) {
			const now = state.deps.nowMs();
			const nextJob = cloneCronJobForMutation(existing);
			applyDeclarativeJobSpec(nextJob, normalizedInput, {
				defaultAgentId: state.deps.defaultAgentId,
				enabledExplicit: opts?.enabledExplicit === true,
				nowMs: now,
				cronConfig: state.deps.cronConfig,
				scheduledToolPolicy: opts?.scheduledToolPolicy,
				toolsAllowProvenance: opts?.toolsAllowProvenance,
				toolsAllowExecTarget: opts?.toolsAllowExecTarget,
				configuredChannels
			});
			finalizeUpdatedJob({
				job: existing,
				nextJob,
				now,
				schedulingInputsRequested: true,
				scheduleChanged: !isDeepStrictEqual(existing.schedule, nextJob.schedule),
				explicitTriggerState: normalizedInput.state
			});
			const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
			reconcileRuntimeAuthority({
				job: nextJob,
				...runtimeAuthorityMutation,
				explicitlyMutatesToolsAllow: normalizedInput.payload.toolsAllow !== void 0
			});
			reconcileCronChannelRequesterAuthority({
				job: nextJob,
				previousJob: existing,
				toolsAllowProvenance: opts?.toolsAllowProvenance,
				reauthorize: true
			});
			const includeEnabled = opts?.enabledExplicit === true;
			if (isDeepStrictEqual(declarativeFields(existing, includeEnabled), declarativeFields(nextJob, includeEnabled))) return {
				...existing,
				created: false,
				updated: false,
				job: existing
			};
			await persistUpdatedJob({
				state,
				snapshot: snapshotStoreForRollback(state),
				previousJob: existing,
				nextJob,
				persistStore,
				mutationMethod: "cron.add"
			});
			return {
				...nextJob,
				created: false,
				updated: true,
				job: nextJob
			};
		}
		if (normalizedId && state.store?.jobs.some((job) => job.id === normalizedId)) throw new Error(`cron job already exists: ${normalizedId}`);
		const explicitOwnerAgentId = normalizeOptionalAgentId(normalizedInput.agentId) ?? parseAgentSessionKey(normalizeOptionalString(normalizedInput.sessionKey))?.agentId;
		const retainedLegacyAgentId = normalizeOptionalAgentId(state.deps.legacyDefaultAgentId);
		const creationInput = !explicitOwnerAgentId && retainedLegacyAgentId === agentId ? {
			...normalizedInput,
			agentId
		} : normalizedInput;
		const snapshot = snapshotStoreForRollback(state);
		const job = createJob(state, creationInput, {
			scheduledToolPolicy: opts?.scheduledToolPolicy,
			toolsAllowProvenance: opts?.toolsAllowProvenance,
			toolsAllowExecTarget: opts?.toolsAllowExecTarget,
			configuredChannels
		});
		if (opts?.createdActor) job.createdActor = structuredClone(opts.createdActor);
		if (opts?.skillLibrarySelections) job.skillLibrarySelections = structuredClone(opts.skillLibrarySelections);
		const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
		reconcileRuntimeAuthority({
			job,
			...runtimeAuthorityMutation,
			explicitlyMutatesToolsAllow: normalizedInput.payload.toolsAllow !== void 0
		});
		reconcileCronChannelRequesterAuthority({
			job,
			toolsAllowProvenance: opts?.toolsAllowProvenance
		});
		state.store?.jobs.push(job);
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance(state, { deferredNotifications: postPersistNotifications });
		await persistStore(state, snapshot, {
			postPersistNotifications,
			suppressScheduledJobId: job.id,
			transactionHooks: withCronMutationCommitHook("cron.add")
		});
		armTimer(state);
		state.deps.log.info({
			jobId: job.id,
			jobName: job.name,
			nextRunAtMs: job.state.nextRunAtMs,
			schedulerNextWakeAtMs: nextWakeAtMs(state) ?? null,
			timerArmed: state.timer !== null,
			cronEnabled: state.deps.cronEnabled
		}, "cron: job added");
		emit(state, {
			jobId: job.id,
			action: "added",
			job,
			nextRunAtMs: job.state.nextRunAtMs
		});
		return declarationKey ? {
			...job,
			created: true,
			job
		} : job;
	}).catch(async (error) => {
		if (error !== RETRY_ADD_AFTER_SESSION_CLEANUP || !pendingSessionCleanup) throw error;
		await pendingSessionCleanup;
		return await add(state, input, opts);
	});
}
/** Prunes an owned job family from obsolete store partitions after active-store convergence. */
async function removeStaleJobFamily(state, family, opts) {
	return await locked(state, async () => {
		await ensureLoadedForOperation(state);
		opts?.commitGuard?.();
		return removeStaleCronJobFamilyRows(state.deps.storePath, family);
	});
}
async function updateLoadedJob(params) {
	const { state, id, patch, precondition, opts } = params;
	warnIfDisabled(state, "update");
	if (patch.payload?.kind === "heartbeat") throw new Error("system-owned payloads cannot be patched by cron clients");
	await ensureLoadedForOperation(state);
	const job = findJobOrThrow(state, id);
	if (isSystemMonitorDeclaration(job.declarationKey)) throw new Error("system-owned monitor jobs cannot be edited by cron clients");
	const now = state.deps.nowMs();
	const configuredChannels = cronPatchTouchesDeliveryResolution(patch) ? await resolveConfiguredChannelsForValidation(state) : void 0;
	await precondition?.(structuredClone(job), now);
	const nextJob = cloneCronJobForMutation(job);
	applyJobPatch(nextJob, patch, {
		defaultAgentId: resolveCurrentDefaultAgentId(state),
		scheduleValidationNowMs: now,
		cronConfig: state.deps.cronConfig,
		scheduledToolPolicy: opts?.scheduledToolPolicy,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		toolsAllowExecTarget: opts?.toolsAllowExecTarget,
		configuredChannels
	});
	if (patch.agentId !== void 0) {
		const agentId = resolveEffectiveJobAgentId(nextJob, resolveCurrentDefaultAgentId(state));
		if (state.deps.isAgentAvailable?.(agentId) === false) throw new Error(describeUnavailableCronAgent(agentId));
	}
	finalizeUpdatedJob({
		job,
		nextJob,
		now,
		schedulingInputsRequested: patch.schedule !== void 0 || patch.enabled !== void 0 || "trigger" in patch || "pacing" in patch,
		scheduleChanged: patch.schedule !== void 0,
		explicitTriggerState: patch.state
	});
	const persistStore = precondition !== void 0 || opts?.commitGuard !== void 0 || opts?.captureRuntimeAuthority !== void 0 ? persistNativeOrRestore : persistOrRestore;
	const runtimeAuthorityMutation = consumeRuntimeAuthorityMutationOptions(opts);
	reconcileRuntimeAuthority({
		job: nextJob,
		...runtimeAuthorityMutation,
		explicitlyMutatesToolsAllow: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow")
	});
	reconcileCronChannelRequesterAuthority({
		job: nextJob,
		previousJob: job,
		toolsAllowProvenance: opts?.toolsAllowProvenance,
		reauthorize: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow"),
		reauthorizeCallerOrigin: patch.payload !== void 0 && Object.hasOwn(patch.payload, "toolsAllow")
	});
	await persistUpdatedJob({
		state,
		snapshot: snapshotStoreForRollback(state),
		previousJob: job,
		nextJob,
		persistStore,
		mutationMethod: "cron.update"
	});
	return nextJob;
}
/** Updates a cron job patch in-place, recomputes affected schedule state, and persists it. */
async function update(state, id, patch, opts) {
	return await locked(state, async () => await updateLoadedJob({
		state,
		id,
		patch,
		opts
	}));
}
/** Updates a cron job only after a store-locked caller precondition passes. */
async function updateWithPrecondition(state, id, patch, precondition, opts) {
	return await locked(state, async () => await updateLoadedJob({
		state,
		id,
		patch,
		precondition,
		opts
	}));
}
/** Removes a cron job by id and re-arms the timer when the in-memory store changes. */
async function remove(state, id, opts) {
	let sessionCleanup;
	const result = await locked(state, async () => {
		warnIfDisabled(state, "remove");
		const previousStore = state.store;
		await ensureLoadedForOperation(state);
		if (!state.store) return {
			ok: false,
			removed: false
		};
		const removedJob = state.store.jobs.find((j) => j.id === id);
		if (!removedJob) {
			if (state.store !== previousStore) armTimer(state);
			return {
				ok: true,
				removed: false
			};
		}
		if (isSystemMonitorDeclaration(removedJob.declarationKey) && opts?.systemOwned !== true) throw new Error("system-owned monitor jobs cannot be removed by cron clients");
		const persistStore = opts?.commitGuard ? persistNativeOrRestore : persistOrRestore;
		opts?.commitGuard?.();
		const snapshot = snapshotStoreForRollback(state);
		state.store.jobs = state.store.jobs.filter((j) => j.id !== id);
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance(state, { deferredNotifications: postPersistNotifications });
		await persistStore(state, snapshot, {
			postPersistNotifications,
			suppressScheduledJobId: id,
			transactionHooks: withCronMutationCommitHook("cron.remove")
		});
		const activeMarker = noteActiveCronJobRemoval(id, opts?.commitGuard);
		const agentId = resolveEffectiveJobAgentId(removedJob, resolveCurrentDefaultAgentId(state));
		const sessionStorePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
		if (sessionStorePath && (removedJob.sessionTarget === "isolated" || removedJob.sessionTarget === "current")) {
			let finish;
			const done = new Promise((resolve) => {
				finish = resolve;
			});
			const release = registerPendingCronSessionCleanup(state, id, done, agentId);
			sessionCleanup = {
				activeMarker,
				agentId,
				sessionStorePath,
				done,
				finish,
				release
			};
		}
		pruneCronJobScratchAfterCommit(state, [id]);
		armTimer(state);
		emit(state, {
			jobId: id,
			action: "removed",
			job: removedJob
		});
		return {
			ok: true,
			removed: true
		};
	});
	if (!sessionCleanup) return result;
	const { activeMarker, agentId, sessionStorePath, finish, release } = sessionCleanup;
	const cleanup = async () => {
		try {
			if (await locked(state, async () => {
				await ensureLoaded(state);
				return !state.store?.jobs.some((job) => job.id === id);
			})) await removeCronJobBaseSession({
				agentId,
				jobId: id,
				sessionStorePath
			});
			return;
		} catch (error) {
			const message = `Cron job ${id} was removed, but session cleanup failed: ${String(error)}. Use testclaw sessions list --json, then testclaw sessions delete to retry.`;
			state.deps.log.warn({
				jobId: id,
				err: message
			}, "cron: session cleanup failed");
			return message;
		} finally {
			release();
			finish();
		}
	};
	if (activeMarker) {
		onCronJobInactive(activeMarker, () => void cleanup());
		return {
			...result,
			sessionCleanup: "pending"
		};
	}
	const cleanupError = await cleanup();
	if (cleanupError) throw new Error(cleanupError);
	return result;
}
/** Remove one agent's jobs while holding the cron lock across an external roster commit. */
async function removeAgentJobsTransactional(state, agentId, commit) {
	return await locked(state, async () => {
		warnIfDisabled(state, "remove agent jobs");
		await ensureLoadedForOperation(state);
		const id = normalizeOptionalAgentId(agentId);
		if (!id || !state.store) return await commit();
		const defaultAgentId = resolveCurrentDefaultAgentId(state);
		const removedJobs = state.store.jobs.filter((job) => resolveEffectiveJobAgentId(job, defaultAgentId) === id);
		if (removedJobs.length === 0) return await commit();
		const snapshot = snapshotStoreForRollback(state);
		state.store.jobs = state.store.jobs.filter((job) => resolveEffectiveJobAgentId(job, defaultAgentId) !== id);
		const postPersistNotifications = [];
		recomputeNextRunsForMaintenance(state, { deferredNotifications: postPersistNotifications });
		await persistOrRestore(state, snapshot);
		let result;
		try {
			result = await commit();
		} catch (error) {
			if (error instanceof AgentDeletionCommitUncertainError) {
				runPostPersistCronNotifications(state, postPersistNotifications);
				armTimer(state);
				for (const job of removedJobs) noteActiveCronJobRemoval(job.id);
				pruneCronJobScratchAfterCommit(state, removedJobs.map((job) => job.id));
				for (const job of removedJobs) emit(state, {
					jobId: job.id,
					action: "removed",
					job
				});
				throw error;
			}
			try {
				if (state.deps.cronEnabled) {
					state.store = snapshot.store;
					state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
					if (!await persist(state)) throw new Error("cron: rollback store write did not complete", { cause: error });
				} else {
					const deletedSnapshot = snapshotStoreForRollback(state);
					state.store = snapshot.store;
					state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
					await persistOrRestore(state, deletedSnapshot, { preserveConcurrentAdds: true });
				}
				armTimer(state);
			} catch (rollbackError) {
				throw new AgentDeletionAuthorityRollbackError([error, rollbackError], `cron: failed to roll back agent job deletion for ${id}`, { cause: error });
			}
			throw error;
		}
		runPostPersistCronNotifications(state, postPersistNotifications);
		for (const job of removedJobs) noteActiveCronJobRemoval(job.id);
		pruneCronJobScratchAfterCommit(state, removedJobs.map((job) => job.id));
		armTimer(state);
		for (const job of removedJobs) emit(state, {
			jobId: job.id,
			action: "removed",
			job
		});
		return result;
	});
}
//#endregion
//#region src/cron/list-snapshot-revision.ts
function resolveCronListSnapshotRevision(jobs) {
	return `sha256:${sha256Base64Url(stableStringify(jobs))}`;
}
//#endregion
//#region src/cron/service/list-page-sort.ts
function sortCronJobs(jobs, sortBy, sortDir) {
	const dir = sortDir === "desc" ? -1 : 1;
	let compareNames;
	return jobs.sort((a, b) => {
		let cmp = 0;
		if (sortBy === "name") {
			const aName = typeof a.name === "string" ? a.name : "";
			const bName = typeof b.name === "string" ? b.name : "";
			compareNames ??= new Intl.Collator(void 0, { sensitivity: "base" }).compare;
			cmp = compareNames(aName, bName);
		} else if (sortBy === "updatedAtMs") cmp = a.updatedAtMs - b.updatedAtMs;
		else {
			const aNext = a.state.nextRunAtMs;
			const bNext = b.state.nextRunAtMs;
			if (typeof aNext === "number" && typeof bNext === "number") cmp = aNext - bNext;
			else if (typeof aNext === "number" || typeof bNext === "number") return typeof aNext === "number" ? -1 : 1;
		}
		if (cmp !== 0) return cmp * dir;
		const aId = typeof a.id === "string" ? a.id : "";
		const bId = typeof b.id === "string" ? b.id : "";
		return aId.localeCompare(bId);
	});
}
//#endregion
//#region src/cron/service/ops-run-preparation.ts
function emitCronRunFinished(state, evt, tracker, taskRunId, details) {
	const event = {
		...evt,
		completionStatus: evt.completionStatus ?? resolveCronCompletionStatus({
			status: evt.status,
			deliveryStatus: evt.deliveryStatus
		})
	};
	tryFinishCronTaskRun(state, {
		taskRunId,
		job: evt.job,
		event,
		errorClassification: details?.errorClassification,
		...details?.scriptResult ? { scriptResult: details.scriptResult } : {},
		...details?.triggerEval ? { triggerEval: details.triggerEval } : {}
	});
	emit(state, event, cronFailureNotificationEventContext(details?.failureNotificationDetail));
	if (tracker) tracker.emitted = true;
}
function admitsStreamSourceRun(job, streamScheduleKey, streamSourceIdentity) {
	if (streamScheduleKey === void 0 && streamSourceIdentity === void 0) return true;
	return streamScheduleKey !== void 0 && streamSourceIdentity !== void 0 && isJobEnabled(job) && ownsStreamSource(job, streamScheduleKey, streamSourceIdentity);
}
function skipInvalidPersistedManualRun(params) {
	const postPersistNotifications = [];
	const endedAt = params.state.deps.nowMs();
	const errorText = normalizeCronRunErrorText(params.error);
	const diagnostics = createCronRunDiagnosticsFromError("cron-preflight", errorText, {
		severity: "warn",
		nowMs: params.state.deps.nowMs
	});
	const configRevision = resolveCronJobConfigRevision(params.job);
	applyJobResult(params.state, params.job, {
		status: "skipped",
		completionStatus: "failed",
		error: errorText,
		diagnostics,
		startedAt: endedAt,
		endedAt
	}, {
		scheduleMode: isImmediateCronRunMode(params.mode) ? "preserve" : "advance",
		deferredNotifications: postPersistNotifications
	});
	const committedJob = commitCronRuntimeRows({
		state: params.state,
		jobIds: [params.job.id],
		operationLabel: "cron.invalid-manual-run",
		mutate: ({ jobs }) => {
			const current = jobs.get(params.job.id);
			if (!current || resolveCronJobConfigRevision(current) !== configRevision) return { value: void 0 };
			current.enabled = params.job.enabled;
			current.updatedAtMs = params.job.updatedAtMs;
			current.state = structuredClone(params.job.state);
			return {
				upsertJobIds: [current.id],
				value: current
			};
		}
	});
	if (!committedJob) {
		armTimer(params.state);
		return;
	}
	applyCronRuntimeRowsToState(params.state, [committedJob]);
	emitCronRunFinished(params.state, {
		jobId: params.job.id,
		action: "finished",
		job: params.job,
		status: "skipped",
		error: errorText,
		diagnostics,
		runId: params.runId,
		runAtMs: endedAt,
		durationMs: params.job.state.lastDurationMs,
		nextRunAtMs: params.job.state.nextRunAtMs,
		deliveryStatus: params.job.state.lastDeliveryStatus,
		deliveryError: params.job.state.lastDeliveryError,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(params.job)
	}, params.terminalTracker);
	runPostPersistCronNotifications(params.state, postPersistNotifications);
	armTimer(params.state);
}
async function recomputeManualRunPreflight(state, id, mode) {
	await recomputeUnownedCronSchedules(state, {
		...isImmediateCronRunMode(mode) ? { preserveExpiredPacedNextRunJobId: id } : {},
		skipScheduleErrorHandling: true
	});
}
async function inspectManualRunPreflight(state, id, mode, opts) {
	warnIfDisabled(state, "run");
	await ensureLoaded(state);
	opts?.commitGuard?.();
	if (state.stopped) return {
		ok: true,
		ran: false,
		reason: "stopped"
	};
	await recomputeManualRunPreflight(state, id, mode);
	opts?.commitGuard?.();
	if (state.stopped) return {
		ok: true,
		ran: false,
		reason: "stopped"
	};
	const job = opts?.onExit ? state.store?.jobs.find((entry) => entry.id === id) : findJobOrThrow(state, id);
	if (!job || opts?.onExit && !matchesOnExitSchedule(job, opts.onExit.schedule)) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	if (opts?.onExit && (!isJobEnabled(job) || job.state.autoDisabled)) return {
		ok: true,
		ran: false,
		reason: "disabled"
	};
	if (mode === "if-enabled" && (!isJobEnabled(job) || job.state.autoDisabled)) return {
		ok: true,
		ran: false,
		reason: "disabled"
	};
	if (!admitsStreamSourceRun(job, opts?.streamScheduleKey, opts?.streamSourceIdentity)) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	try {
		assertSupportedJobSpec(job);
	} catch (error) {
		skipInvalidPersistedManualRun({
			state,
			job,
			mode,
			runId: opts?.runId,
			terminalTracker: opts?.terminalTracker,
			error
		});
		return {
			ok: true,
			ran: false,
			reason: "invalid-spec"
		};
	}
	if (hasActiveCronRun(job)) return {
		ok: true,
		ran: false,
		reason: "already-running"
	};
	const now = state.deps.nowMs();
	if (!isJobDue(job, now, { forced: isImmediateCronRunMode(mode) })) return {
		ok: true,
		ran: false,
		reason: "not-due"
	};
	return {
		ok: true,
		runnable: true,
		job
	};
}
async function inspectManualRunDisposition(state, id, mode, opts) {
	const result = await locked(state, () => inspectManualRunPreflight(state, id, mode, opts));
	if (!result.ok) return result;
	if ("reason" in result) return result;
	return {
		ok: true,
		runnable: true
	};
}
async function prepareManualRun(state, id, mode, opts) {
	return await locked(state, async () => {
		const preflight = await inspectManualRunPreflight(state, id, mode, opts);
		if (!preflight.ok || "reason" in preflight) return preflight;
		const { job } = preflight;
		opts?.commitGuard?.();
		const reservationAt = state.deps.nowMs();
		if (!isJobDue(job, reservationAt, { forced: isImmediateCronRunMode(mode) })) return {
			ok: true,
			ran: false,
			reason: "not-due"
		};
		const internalTracker = opts?.terminalTracker ?? { emitted: false };
		const onExit = opts?.onExit;
		let reservationIdentity;
		let reserved;
		try {
			[reserved] = await persistQueuedCronRunReservations({
				state,
				candidates: [job],
				...isImmediateCronRunMode(mode) ? { immediateJobIds: /* @__PURE__ */ new Set([job.id]) } : {},
				reservedAtMs: reservationAt,
				...isImmediateCronRunMode(mode) ? { scheduleMode: "preserve" } : {},
				manualRun: {
					runId: opts?.runId,
					commitGuard: opts?.commitGuard,
					terminalTracker: internalTracker,
					scheduleOwnershipAtMs: opts?.scheduleOwnershipAtMs,
					...onExit ? { onExit: {
						commitGuard: onExit.commitGuard,
						onReserved: (reservedJob, runReceipt) => {
							reservationIdentity = reserveQueuedCronRun(state, reservedJob.id, reservationAt, {
								runReceipt,
								preserveWhenDisabled: true,
								onExit: true
							});
							onExit.onReserved();
						}
					} } : {}
				}
			});
		} catch (error) {
			if (reservationIdentity) await releasePreparedManualReservationWithRetry(state, {
				jobId: job.id,
				reservationIdentity
			});
			throw error;
		}
		if (!reserved) {
			if (internalTracker.emitted) return {
				ok: true,
				ran: false,
				reason: "ownerless"
			};
			return {
				ok: true,
				ran: false,
				reason: "already-running"
			};
		}
		const reservedJob = reserved.job;
		reservationIdentity ??= reserveQueuedCronRun(state, reservedJob.id, reservationAt, {
			runReceipt: reserved.runReceipt,
			preserveWhenDisabled: mode === "force" && !isJobEnabled(job)
		});
		if (state.stopped) {
			try {
				await releasePreparedManualReservationWithRetry(state, {
					jobId: reservedJob.id,
					reservationIdentity
				});
			} catch (error) {
				releaseQueuedCronRun(state, job.id, reservationIdentity);
				throw error;
			}
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		return {
			ok: true,
			ran: true,
			jobId: reservedJob.id,
			runId: opts?.runId,
			terminalTracker: opts?.terminalTracker,
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
			commitGuard: opts?.commitGuard,
			reservationAt,
			scheduleOwnershipAtMs: opts?.scheduleOwnershipAtMs ?? reservationAt,
			reservationIdentity,
			wasEnabled: opts?.onExit ? false : isJobEnabled(job),
			...onExit ? { onExit } : {},
			...opts?.payload ? { payload: structuredClone(opts.payload) } : {},
			...opts?.evaluateTrigger ? { evaluateTrigger: true } : {},
			...opts?.streamBatch !== void 0 ? { streamBatch: opts.streamBatch } : {},
			...opts?.streamScheduleKey !== void 0 ? { streamScheduleKey: opts.streamScheduleKey } : {},
			...opts?.streamSourceIdentity !== void 0 ? { streamSourceIdentity: opts.streamSourceIdentity } : {},
			...opts?.onTriggerDisposition ? { onTriggerDisposition: opts.onTriggerDisposition } : {}
		};
	});
}
async function activatePreparedManualRun(state, prepared, mode) {
	return await locked(state, async () => {
		await ensureLoaded(state, { forceReload: true });
		prepared.commitGuard?.();
		prepared.onExit?.commitGuard();
		if (state.stopped) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		const job = state.store?.jobs.find((entry) => entry.id === prepared.jobId);
		if (!job) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (mode === "if-enabled" && (!isJobEnabled(job) || job.state.autoDisabled)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "disabled"
			};
		}
		if (!isQueuedCronRunReservationCurrent(state, prepared.jobId, prepared.reservationIdentity) || job.state.queuedAtMs !== prepared.reservationAt) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (prepared.onExit && !matchesOnExitSchedule(job, prepared.onExit.schedule)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		if (!admitsStreamSourceRun(job, prepared.streamScheduleKey, prepared.streamSourceIdentity)) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		const dueProbe = structuredClone(job);
		delete dueProbe.state.queuedAtMs;
		if (prepared.wasEnabled && !isJobEnabled(job) || !isJobDue(dueProbe, state.deps.nowMs(), { forced: isImmediateCronRunMode(mode) })) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		try {
			assertSupportedJobSpec(job);
		} catch (error) {
			skipInvalidPersistedManualRun({
				state,
				job,
				mode,
				runId: prepared.runId,
				terminalTracker: prepared.terminalTracker,
				error
			});
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "invalid-spec"
			};
		}
		const activation = await activateQueuedCronRun({
			state,
			job,
			reservationIdentity: prepared.reservationIdentity,
			commitGuard: prepared.commitGuard ?? prepared.onExit?.commitGuard,
			onExitSchedule: prepared.onExit?.schedule,
			onUnavailableRollbackError: async () => {
				await releasePreparedManualReservationWithRetry(state, prepared);
			}
		});
		if (activation.kind === "unavailable") return {
			ok: true,
			ran: false,
			reason: activation.reason
		};
		if (activation.kind === "fenced") {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "already-running"
			};
		}
		prepared.onExit?.commitGuard();
		const { job: activatedJob, startedAt } = activation;
		const payload = prepared.onExit?.payload?.(structuredClone(activatedJob)) ?? prepared.payload;
		emit(state, {
			jobId: activatedJob.id,
			action: "started",
			job: activatedJob,
			runAtMs: startedAt
		});
		const taskRun = tryCreateCronTaskRunHandle({
			state,
			job: activatedJob,
			startedAt,
			runReceipt: activation.runReceipt,
			publicRunId: prepared.runId
		});
		const taskRunId = taskRun?.runId;
		const activeJobMarker = markManualCronJobActive(state, activatedJob, activation.runReceipt);
		const admittedJob = structuredClone(activatedJob);
		if (prepared.onExit) admittedJob.enabled = false;
		const executionJob = structuredClone({
			...activatedJob,
			payload: payload ?? activatedJob.payload
		});
		if (isImmediateCronRunMode(mode)) {
			executionJob.state.nextRunAtMs = prepared.scheduleOwnershipAtMs;
			executionJob.trigger = prepared.evaluateTrigger ? executionJob.trigger : void 0;
		}
		return {
			...prepared,
			startedAt,
			runId: prepared.runId ?? taskRunId,
			taskRunId,
			taskId: taskRun?.taskId,
			flowId: taskRun?.flowId,
			activeJobMarker,
			admittedJob,
			executionJob,
			runReceipt: activation.runReceipt
		};
	});
}
async function releasePreparedManualReservation(state, prepared) {
	if (state.queuedRunReservationsByJobId.get(prepared.jobId)?.identity !== prepared.reservationIdentity) return;
	const committedJob = commitCronRuntimeRows({
		state,
		jobIds: [prepared.jobId],
		operationLabel: "cron.manual-reservation-cleanup",
		mutate: ({ database, jobs }) => {
			const job = jobs.get(prepared.jobId);
			const ownership = state.queuedRunReservationsByJobId.get(prepared.jobId);
			if (ownership?.identity !== prepared.reservationIdentity) return { value: void 0 };
			finishCronRunReceiptInDatabase({
				database,
				handle: ownership.runReceipt,
				status: "skipped",
				finishedAtMs: state.deps.nowMs(),
				error: "cron manual reservation abandoned before completion"
			});
			if (!job) return { value: void 0 };
			const queuedMatches = ownership.markerAtMs === job.state.queuedAtMs;
			const runningMatches = ownership.markerAtMs === job.state.runningAtMs;
			if (!queuedMatches && !runningMatches) return { value: void 0 };
			if (ownership.activationPreviousLastError) job.state.lastError = ownership.activationPreviousLastError.value;
			if (queuedMatches) delete job.state.queuedAtMs;
			if (runningMatches) {
				delete job.state.runningAtMs;
				delete job.state.runningReceiptId;
				delete job.state.runningScheduleChangeId;
			}
			return {
				upsertJobIds: [job.id],
				value: job
			};
		}
	});
	if (committedJob) applyCronRuntimeRowsToState(state, [committedJob]);
	const ownership = state.queuedRunReservationsByJobId.get(prepared.jobId);
	if (ownership?.identity === prepared.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
	releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
}
async function releasePreparedManualReservationWithRetry(state, prepared) {
	try {
		await releasePreparedManualReservation(state, prepared);
	} catch {
		try {
			await releasePreparedManualReservation(state, prepared);
		} catch (error) {
			const ownership = state.queuedRunReservationsByJobId.get(prepared.jobId);
			if (ownership?.identity === prepared.reservationIdentity) releaseLocalCronRunReceiptOwnership(ownership.runReceipt);
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			throw error;
		}
	}
}
async function releasePreparedManualReservationAfterReloadWithRetry(state, prepared) {
	await cleanupQueuedCronRunReservations({
		state,
		reservations: [prepared],
		restoreLastError: false
	});
}
//#endregion
//#region src/cron/service/ops-read.ts
/** Returns cron service status after a read-only maintenance pass. */
async function status(state) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const sqlitePath = resolveAssistantStateSqlitePath();
		return {
			enabled: state.deps.cronEnabled,
			triggersEnabled: state.deps.cronConfig?.triggers?.enabled !== false,
			storePath: sqlitePath,
			storage: "sqlite",
			sqlitePath,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: state.deps.cronEnabled ? nextWakeAtMs(state) ?? null : null
		};
	});
}
/** Lists cron jobs sorted by next run time, excluding disabled jobs unless requested. */
async function list(state, opts) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const includeDisabled = opts?.includeDisabled === true;
		return sortCronJobs((state.store?.jobs ?? []).filter((j) => includeDisabled || isJobEnabled(j)), "nextRunAtMs", "asc");
	});
}
/** Reads one cron job by id without advancing due schedules. */
async function readJob(state, id) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		return state.store?.jobs.find((job) => job.id === id);
	});
}
/** Reads one job's private scratch state after proving the job exists in this store. */
async function readScratch(state, id) {
	return await locked(state, async () => {
		await ensureLoaded(state);
		findJobOrThrow(state, id);
		return readCronJobScratchState(state.deps.storePath, id);
	});
}
/** Writes or clears one job's private scratch under the cron mutation lock. */
async function writeScratch(state, id, params) {
	return await locked(state, async () => {
		await ensureLoaded(state);
		findJobOrThrow(state, id);
		params.commitGuard?.();
		return writeCronJobScratch({
			storePath: state.deps.storePath,
			jobId: id,
			content: params.content,
			expectedRevision: params.expectedRevision,
			sourceSha256: params.sourceSha256,
			nowMs: state.deps.nowMs()
		});
	});
}
/** Record a terminal failure from a scheduler-owned event source. */
async function recordExternalFailure(state, id, error, statePatch, source) {
	await locked(state, async () => {
		await ensureLoaded(state);
		const job = findJobOrThrow(state, id);
		if (source && !ownsStreamSource(job, source.scheduleKey, source.identity)) return;
		const postPersistNotifications = [];
		const now = state.deps.nowMs();
		assertCronJobStateTimestamps(statePatch);
		const committedJob = commitCronRuntimeRows({
			state,
			jobIds: [id],
			operationLabel: "cron.external-failure",
			mutate: ({ jobs }) => {
				const current = jobs.get(id);
				if (!current || source && !ownsStreamSource(current, source.scheduleKey, source.identity)) return { value: void 0 };
				const sourceIdentity = current.state.streamSourceIdentity;
				Object.assign(current.state, statePatch);
				current.state.streamSourceIdentity = sourceIdentity;
				current.state.consecutiveErrors = Math.max(current.state.consecutiveErrors ?? 0, 4);
				applyJobResult(state, current, {
					status: "error",
					error,
					executionStarted: false,
					startedAt: now,
					endedAt: now
				}, { deferredNotifications: postPersistNotifications });
				current.state.nextRunAtMs = void 0;
				emitCronRunFinished(state, {
					jobId: current.id,
					action: "finished",
					job: current,
					status: "error",
					error,
					runAtMs: now,
					durationMs: 0,
					failureNotificationDelivery: failureNotificationDeliveryFromJobState(current)
				});
				return {
					upsertJobIds: [current.id],
					value: current
				};
			}
		});
		runPostPersistCronNotifications(state, postPersistNotifications);
		if (committedJob) applyCronRuntimeRowsToState(state, [committedJob]);
		armTimer(state);
	});
}
/** Atomically persist owner state only while its logical stream source still matches. */
async function updateExternalState(state, id, streamScheduleKey, streamSourceIdentity, statePatch) {
	return await locked(state, async () => {
		await ensureLoaded(state);
		assertCronJobStateTimestamps(statePatch);
		const committedJob = commitCronRuntimeRows({
			state,
			jobIds: [id],
			operationLabel: "cron.external-state",
			mutate: ({ jobs }) => {
				const job = jobs.get(id);
				if (!job || !ownsStreamSource(job, streamScheduleKey, streamSourceIdentity)) return { value: void 0 };
				const sourceIdentity = job.state.streamSourceIdentity;
				Object.assign(job.state, statePatch);
				job.state.streamSourceIdentity = sourceIdentity;
				return {
					upsertJobIds: [job.id],
					value: job
				};
			}
		});
		if (committedJob) applyCronRuntimeRowsToState(state, [committedJob]);
		return committedJob !== void 0;
	});
}
/** Retire a logical stream source before teardown that has no job-definition mutation. */
async function retireExternalStreamSource(state, id, streamScheduleKey, streamSourceIdentity) {
	return await locked(state, async () => {
		await ensureLoaded(state);
		const nextIdentity = createCronStreamSourceIdentity();
		const committedJob = commitCronRuntimeRows({
			state,
			jobIds: [id],
			operationLabel: "cron.retire-stream-source",
			mutate: ({ jobs }) => {
				const job = jobs.get(id);
				if (!job || !ownsStreamSource(job, streamScheduleKey, streamSourceIdentity)) return { value: void 0 };
				job.state.streamSourceIdentity = nextIdentity;
				return {
					upsertJobIds: [job.id],
					value: job
				};
			}
		});
		if (!committedJob) return;
		applyCronRuntimeRowsToState(state, [committedJob]);
		return nextIdentity;
	});
}
/** Persist the owner's monotonic loss counters across stream schedule replacement. */
async function updateExternalCounters(state, id, counters) {
	await locked(state, async () => {
		await ensureLoaded(state);
		const committedJob = commitCronRuntimeRows({
			state,
			jobIds: [id],
			operationLabel: "cron.external-counters",
			mutate: ({ jobs }) => {
				const job = jobs.get(id);
				if (!job || job.schedule.kind !== "stream") return { value: void 0 };
				job.state.streamDroppedBatches = Math.max(job.state.streamDroppedBatches ?? 0, counters.streamDroppedBatches ?? 0);
				job.state.streamCoalescedBatches = Math.max(job.state.streamCoalescedBatches ?? 0, counters.streamCoalescedBatches ?? 0);
				return {
					upsertJobIds: [job.id],
					value: job
				};
			}
		});
		if (committedJob) applyCronRuntimeRowsToState(state, [committedJob]);
	});
}
function resolveEnabledFilter(opts) {
	if (opts?.enabled === "all" || opts?.enabled === "enabled" || opts?.enabled === "disabled") return opts.enabled;
	return opts?.includeDisabled ? "all" : "enabled";
}
function resolveScheduleKindFilter(opts) {
	if (opts?.scheduleKind === "all" || opts?.scheduleKind === "at" || opts?.scheduleKind === "every" || opts?.scheduleKind === "cron" || opts?.scheduleKind === "on-exit" || opts?.scheduleKind === "stream") return opts.scheduleKind;
	return "all";
}
function resolveLastRunStatusFilter(opts) {
	if (opts?.lastRunStatus === "all" || opts?.lastRunStatus === "ok" || opts?.lastRunStatus === "error" || opts?.lastRunStatus === "skipped" || opts?.lastRunStatus === "unknown") return opts.lastRunStatus;
	return "all";
}
function resolveTriggerFilter(opts) {
	if (opts?.trigger === "all" || opts?.trigger === "conditional" || opts?.trigger === "unconditional") return opts.trigger;
	return "all";
}
const SLOW_LIST_PAGE_MS = 1e3;
/** Lists a filtered, sorted, bounded page of cron jobs for CLI/RPC callers. */
async function listPage(state, opts, matchesJob) {
	const startedAt = performance.now();
	let enteredAt;
	let finishedAt;
	let sourceCount;
	let result;
	try {
		return await locked(state, async () => {
			enteredAt = performance.now();
			try {
				await ensureLoadedForRead(state);
				const query = normalizeLowercaseStringOrEmpty(opts?.query);
				const enabledFilter = resolveEnabledFilter(opts);
				const scheduleKindFilter = resolveScheduleKindFilter(opts);
				const lastRunStatusFilter = resolveLastRunStatusFilter(opts);
				const triggerFilter = resolveTriggerFilter(opts);
				const sortBy = opts?.sortBy ?? "nextRunAtMs";
				const sortDir = opts?.sortDir ?? "asc";
				const requestedAgentId = normalizeOptionalAgentId(opts?.agentId);
				const source = state.store?.jobs ?? [];
				sourceCount = source.length;
				const sortedJobs = sortCronJobs(source.filter((job) => {
					if (enabledFilter === "enabled" && !isJobEnabled(job)) return false;
					if (enabledFilter === "disabled" && isJobEnabled(job)) return false;
					if (requestedAgentId && tryResolveCronJobEffectiveAgentId(job, resolveCurrentDefaultAgentId(state)) !== requestedAgentId) return false;
					if (scheduleKindFilter !== "all" && job.schedule.kind !== scheduleKindFilter) return false;
					if (lastRunStatusFilter !== "all" && (resolveJobLastRunStatus(job) ?? "unknown") !== lastRunStatusFilter) return false;
					if (triggerFilter === "conditional" && !job.trigger) return false;
					if (triggerFilter === "unconditional" && job.trigger) return false;
					if (query) {
						if (!normalizeLowercaseStringOrEmpty([
							job.id,
							job.name,
							job.description ?? "",
							job.agentId ?? "",
							...job.displayName ? [job.displayName] : []
						].join(" ")).includes(query)) return false;
					}
					return !matchesJob || matchesJob(job);
				}), sortBy, sortDir);
				const snapshotRevision = resolveCronListSnapshotRevision(sortedJobs);
				const total = sortedJobs.length;
				const offset = Math.max(0, Math.min(total, Math.floor(opts?.offset ?? 0)));
				const defaultLimit = total === 0 ? 50 : total;
				const limit = Math.max(1, Math.min(200, Math.floor(opts?.limit ?? defaultLimit)));
				const jobs = structuredClone(sortedJobs.slice(offset, offset + limit));
				const nextOffset = offset + jobs.length;
				return result = {
					jobs,
					snapshotRevision,
					total,
					offset,
					limit,
					hasMore: nextOffset < total,
					nextOffset: nextOffset < total ? nextOffset : null
				};
			} finally {
				finishedAt = performance.now();
			}
		});
	} finally {
		const completedAt = performance.now();
		const elapsedMs = completedAt - startedAt;
		if (elapsedMs >= SLOW_LIST_PAGE_MS) try {
			state.deps.log.warn({
				operation: "cron.listPage",
				pid: process.pid,
				threadId,
				isMainThread,
				elapsedMs: Math.round(elapsedMs),
				waitToCallbackMs: enteredAt === void 0 ? void 0 : Math.round(enteredAt - startedAt),
				callbackMs: enteredAt === void 0 || finishedAt === void 0 ? void 0 : Math.round(finishedAt - enteredAt),
				completionDelayMs: finishedAt === void 0 ? void 0 : Math.round(completedAt - finishedAt),
				sourceCount,
				matchedCount: result?.total,
				returnedCount: result?.jobs.length,
				outcome: result ? "ok" : "error",
				thresholdMs: SLOW_LIST_PAGE_MS
			}, "cron: slow list page");
		} catch {}
	}
}
//#endregion
//#region src/cron/service/ops-run.ts
let nextManualRunId = 1;
async function finishPreparedManualRun(state, prepared, mode) {
	const executionJob = prepared.executionJob;
	const startedAt = prepared.startedAt;
	const jobId = prepared.jobId;
	const taskRunId = prepared.taskRunId;
	const runId = prepared.runId;
	let finalized = false;
	let supersedeReason;
	let receiptSettlementDisposition;
	try {
		let coreResult;
		try {
			coreResult = await executeJobCoreWithTimeout(state, executionJob, {
				runId: taskRunId,
				activeJobMarker: prepared.activeJobMarker,
				owningCronLaneTaskMarker: prepared.owningCronLaneTaskMarker,
				streamBatch: prepared.streamBatch,
				streamScheduleKey: prepared.streamScheduleKey,
				streamSourceIdentity: prepared.streamSourceIdentity,
				runReceipt: prepared.runReceipt,
				executionIdentity: createCronOwnerExecutionIdentityAdmission({
					state,
					runReceipt: prepared.runReceipt,
					taskId: prepared.taskId,
					flowId: prepared.flowId
				})
			});
		} catch (err) {
			if (err instanceof CronRunReceiptRevisionError && err.reason === "owner-unavailable") receiptSettlementDisposition = "owner-unavailable";
			coreResult = authorCronRunCompletion(state, executionJob, {
				status: "error",
				error: err instanceof CronRunReceiptRevisionError ? err.message : normalizeCronRunErrorText(err)
			});
		}
		if (prepared.onTriggerDisposition) {
			const disposition = coreResult.triggerEval?.busy ? "busy" : coreResult.status === "error" ? "error" : coreResult.status !== "ok" ? "dropped" : !executionJob.trigger ? "fired" : coreResult.triggerEval?.fired ? "fired" : "dropped";
			prepared.onTriggerDisposition(disposition);
		}
		const endedAt = state.deps.nowMs();
		const triggerSkipped = coreResult.status === "ok" && coreResult.triggerEval?.fired === false;
		const outcome = {
			...coreResult,
			jobId,
			job: prepared.admittedJob,
			taskRunId,
			activeJobMarker: prepared.activeJobMarker,
			runReceipt: prepared.runReceipt,
			startedAt,
			endedAt
		};
		const outcomeOptions = {
			emit: false,
			request: {
				preserveCadence: isImmediateCronRunMode(mode),
				scheduleOwnershipAtMs: prepared.scheduleOwnershipAtMs
			}
		};
		const emitMissingTerminal = (required = false) => {
			const tracker = prepared.terminalTracker;
			if (!tracker && !required || tracker?.emitted) return;
			const job = prepared.activeJobMarker?.jobRemoved === true ? executionJob : state.store?.jobs.find((entry) => entry.id === jobId);
			emitCronRunFinished(state, {
				jobId,
				action: "finished",
				job,
				status: triggerSkipped ? "skipped" : coreResult.status,
				completionStatus: triggerSkipped ? "failed" : coreResult.completionStatus,
				error: triggerSkipped ? "queued manual run skipped: trigger condition not met" : coreResult.error,
				deliveryError: coreResult.deliveryState.error,
				deliverySuppressionReason: coreResult.deliveryState.deliverySuppressionReason,
				summary: triggerSkipped ? void 0 : coreResult.summary,
				diagnostics: coreResult.diagnostics,
				delivered: coreResult.deliveryState.delivered,
				deliveryStatus: coreResult.deliveryState.status,
				delivery: coreResult.delivery,
				sessionId: coreResult.sessionId,
				sessionKey: coreResult.sessionKey,
				runId,
				runAtMs: startedAt,
				durationMs: Math.max(0, endedAt - startedAt),
				nextRunAtMs: job?.state.nextRunAtMs,
				model: coreResult.model,
				provider: coreResult.provider,
				usage: coreResult.usage
			}, tracker, taskRunId, {
				errorClassification: triggerSkipped ? void 0 : coreResult.errorClassification,
				failureNotificationDetail: triggerSkipped ? void 0 : coreResult.failureNotificationDetail
			});
		};
		const finishRemovedRun = () => {
			finishCronRunReceipt({
				handle: prepared.runReceipt,
				status: resolveCronRunReceiptTerminalStatus(triggerSkipped ? "skipped" : coreResult.status, coreResult.triggerEval?.fired),
				finishedAtMs: endedAt,
				error: coreResult.error
			});
			finalized = true;
			emitMissingTerminal(true);
		};
		if (prepared.activeJobMarker?.jobRemoved === true) {
			finishRemovedRun();
			return;
		}
		let notifySetupTimeout = coreResult.isolatedAgentSetupTimeout !== void 0;
		await locked(state, async () => {
			await ensureLoaded(state, { forceReload: true });
			const job = state.store?.jobs.find((entry) => entry.id === jobId);
			if (prepared.activeJobMarker?.jobRemoved === true || !job) {
				notifySetupTimeout = false;
				finishRemovedRun();
				return;
			}
			const postPersistNotifications = [];
			if (!triggerSkipped) {
				const taskJob = structuredClone(job);
				applyOutcomeToAuthoritativeJob(state, taskJob, outcome, {
					...outcomeOptions,
					deferredNotifications: []
				});
				recordCronOutcomeForJob(state, taskJob, {
					...outcome,
					job: executionJob
				});
			}
			let removedJob;
			try {
				const committed = commitCronRuntimeRows({
					state,
					jobIds: [jobId],
					operationLabel: "cron.manual-run-finalization",
					transactionHooks: cronRunReceiptPersistHooks({
						state,
						handle: prepared.runReceipt,
						terminal: {
							status: triggerSkipped ? "skipped" : coreResult.status,
							finishedAtMs: endedAt,
							error: coreResult.error,
							...receiptSettlementDisposition ? { disposition: receiptSettlementDisposition } : {}
						}
					}),
					mutate: ({ database, jobs }) => {
						const current = jobs.get(jobId);
						if (!current) return { value: void 0 };
						const removed = applyOutcomeToAuthoritativeJob(state, current, outcome, {
							...outcomeOptions,
							triggerStateRetired: isCronRunTriggerStateRetiredInDatabase({
								database,
								handle: prepared.runReceipt
							}),
							deferredNotifications: postPersistNotifications
						});
						return {
							...removed ? { deleteJobIds: [jobId] } : { upsertJobIds: [jobId] },
							value: {
								job: structuredClone(current),
								removed
							}
						};
					}
				});
				if (!committed) return;
				removedJob = committed.removed ? committed.job : void 0;
				runPostPersistCronNotifications(state, postPersistNotifications);
				applyCronRuntimeRowsToState(state, committed.removed ? [] : [committed.job], committed.removed ? [jobId] : [], { publish: false });
				if (triggerSkipped) tryFinishCronTaskRunWithoutHistory(state, {
					taskRunId,
					status: coreResult.status,
					error: coreResult.error,
					endedAt,
					summary: coreResult.summary,
					childSessionKey: coreResult.sessionKey,
					triggerEval: coreResult.triggerEval
				});
				if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
					finalized = true;
					return;
				}
				if (!triggerSkipped) emitCronRunFinished(state, {
					...createCronOutcomeEvent(committed.job, outcome),
					runId
				}, prepared.terminalTracker, taskRunId, {
					triggerEval: coreResult.triggerEval,
					scriptResult: {
						scriptStateChanged: coreResult.scriptStateChanged,
						scriptState: coreResult.scriptState
					},
					errorClassification: coreResult.errorClassification,
					failureNotificationDetail: coreResult.failureNotificationDetail
				});
				publishCronRuntimeRows(state);
				await recomputeUnownedCronSchedules(state, {
					recomputeExpired: true,
					...isImmediateCronRunMode(mode) ? { preserveExpiredPacedNextRunJobId: jobId } : {}
				});
			} catch (error) {
				if (error instanceof CronRunReceiptRevisionError) {
					if (isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) supersedeReason = error.message;
					notifySetupTimeout = false;
					return;
				}
				throw error;
			}
			if (removedJob) emit(state, {
				jobId: removedJob.id,
				action: "removed",
				job: removedJob
			});
			finalized = true;
		});
		if (supersedeReason) await supersedeActivatedCronRun({
			state,
			jobId,
			reservationIdentity: prepared.reservationIdentity,
			runReceipt: prepared.runReceipt,
			reason: supersedeReason
		});
		if (notifySetupTimeout && isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) maybeNotifyManualIsolatedSetupTimeout(state, {
			jobId,
			job: executionJob,
			isolatedAgentSetupTimeout: coreResult.isolatedAgentSetupTimeout
		});
		if (finalized && isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) armTimer(state);
		emitMissingTerminal();
	} finally {
		releaseLocalCronRunReceiptOwnership(prepared.runReceipt);
		try {
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
		} finally {
			clearManualCronJobActive(state, jobId, prepared.activeJobMarker);
		}
	}
}
/** Runs a cron job manually, reserving it under lock before executing outside the lock. */
async function run(state, id, mode, opts) {
	const execute = async () => {
		const prepared = await prepareManualRun(state, id, mode, opts);
		if (!prepared.ok || !prepared.ran) return prepared;
		return await executePreparedManualRun(state, prepared, mode);
	};
	return await (opts?.streamBatch !== void 0 && state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
}
/** Consumes an observed exit only when its payload owns the durable reservation. */
async function runOnExit(state, id, opts) {
	const generation = state.lifecycleGeneration;
	const execute = async () => {
		const commitGuard = () => {
			if (opts.signal.aborted || state.stopped || generation !== state.lifecycleGeneration) throw createAbortError("cron on-exit admission cancelled");
			opts.commitGuard();
		};
		try {
			while (await waitForRunSettlement(state, id, opts.signal)) {
				commitGuard();
				const prepared = await prepareManualRun(state, id, "force", {
					onExit: {
						...opts,
						commitGuard
					},
					commitGuard
				});
				if (!prepared.ok || !prepared.ran) {
					if (prepared.ok && prepared.reason === "already-running") continue;
					return prepared;
				}
				return await executePreparedManualRun(state, prepared, "force");
			}
		} catch (error) {
			if (!isAbortError(error)) throw error;
		}
		return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
	};
	return await (state.deps.runSchedulerOwned ? state.deps.runSchedulerOwned(execute) : execute());
}
async function executePreparedManualRun(state, prepared, mode, onActivationSettled) {
	const admission = await runWithCronAdmission(state, async () => {
		let activeRun;
		try {
			activeRun = await activatePreparedManualRun(state, prepared, mode);
		} catch (error) {
			try {
				await locked(state, async () => {
					await releasePreparedManualReservationWithRetry(state, prepared);
				});
			} catch (cleanupError) {
				state.deps.log.warn({
					jobId: prepared.jobId,
					err: String(cleanupError)
				}, "cron: failed to release manual run reservation after activation error");
			}
			throw error;
		} finally {
			onActivationSettled?.();
		}
		if (!activeRun.ran) return activeRun;
		await finishPreparedManualRun(state, activeRun, mode);
		return {
			ok: true,
			ran: true
		};
	}, void 0, prepared.onExit?.signal);
	if (admission.kind === "stopped") {
		await releasePreparedManualReservationAfterReloadWithRetry(state, prepared);
		return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
	}
	return admission.value;
}
/** Acknowledges queued manual work only after its durable reservation exists. */
async function enqueueRun(state, id, mode, opts) {
	const disposition = await inspectManualRunDisposition(state, id, mode, opts);
	if (!disposition.ok || !("runnable" in disposition && disposition.runnable)) return disposition;
	const scheduleOwnershipAtMs = state.deps.nowMs();
	const runId = `manual:${id}:${scheduleOwnershipAtMs}:${nextManualRunId++}`;
	const terminalTracker = { emitted: false };
	const releaseCallerAuthority = retainGatewayDeviceRevocation(opts?.commitGuard);
	const acceptance = createDeferredCore();
	const trackCallerWork = captureCronRunAdmissionTracker();
	const activationSettled = createDeferredCore();
	let accepted = false;
	const acceptQueue = () => {
		if (!accepted && trackCallerWork) trackCallerWork(() => activationSettled.promise).catch((error) => {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(error)
			}, "cron: queued manual admission tracking failed");
		});
		accepted = true;
		acceptance.resolve({
			ok: true,
			enqueued: true,
			runId
		});
	};
	let queuedRun;
	try {
		queuedRun = runWithGatewayIndependentRootWorkContinuation(async () => {
			opts?.commitGuard?.();
			const prepared = await prepareManualRun(state, id, mode, {
				runId,
				scheduleOwnershipAtMs,
				terminalTracker,
				commitGuard: opts?.commitGuard
			});
			if (!prepared.ok || !prepared.ran) {
				acceptance.resolve(prepared);
				return prepared;
			}
			let dispatched = false;
			try {
				opts?.commitGuard?.();
				return await enqueueCommandInLane("cron", async (owningCronLaneTaskMarker) => {
					acceptQueue();
					dispatched = true;
					const result = await executePreparedManualRun(state, {
						...prepared,
						owningCronLaneTaskMarker
					}, mode, activationSettled.resolve);
					if (result.ok && "ran" in result && !result.ran) {
						if (result.reason !== "invalid-spec" && result.reason !== "ownerless") {
							const finishedAt = state.deps.nowMs();
							const job = state.store?.jobs.find((entry) => entry.id === id);
							emitCronRunFinished(state, {
								jobId: id,
								action: "finished",
								job,
								status: "skipped",
								error: `queued manual run skipped before execution: ${result.reason}`,
								runId,
								runAtMs: finishedAt,
								durationMs: 0,
								nextRunAtMs: job?.state.nextRunAtMs
							}, terminalTracker);
						}
						state.deps.log.info({
							jobId: id,
							runId,
							reason: result.reason
						}, "cron: queued manual run skipped before execution");
					}
					return result;
				}, {
					onQueued: acceptQueue,
					warnAfterMs: 5e3,
					onWait: (waitMs, queuedAhead) => {
						state.deps.log.warn({
							jobId: id,
							runId,
							waitMs,
							queuedAhead
						}, "cron: queued manual run waiting for an execution slot");
					}
				});
			} finally {
				if (!dispatched) try {
					await releasePreparedManualReservationAfterReloadWithRetry(state, prepared);
				} catch (cleanupError) {
					state.deps.log.warn({
						jobId: id,
						err: String(cleanupError)
					}, "cron: failed to release manual reservation after queue rejection");
				}
			}
		}, "cron:manual-run");
	} catch (error) {
		activationSettled.resolve();
		releaseCallerAuthority?.();
		throw error;
	}
	queuedRun.catch((err) => {
		if (!accepted) {
			acceptance.reject(err);
			return;
		}
		if (terminalTracker.emitted) {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(err)
			}, "cron: queued manual run failed after emitting its terminal event");
			return;
		}
		const finishedAt = state.deps.nowMs();
		const job = state.store?.jobs.find((entry) => entry.id === id);
		emitCronRunFinished(state, {
			jobId: id,
			action: "finished",
			job,
			status: "error",
			error: normalizeCronRunErrorText(err),
			runId,
			runAtMs: finishedAt,
			durationMs: 0,
			nextRunAtMs: job?.state.nextRunAtMs
		}, terminalTracker);
		state.deps.log.error({
			jobId: id,
			runId,
			err: String(err)
		}, "cron: queued manual run background execution failed");
	}).finally(() => {
		activationSettled.resolve();
		releaseCallerAuthority?.();
	});
	return await acceptance.promise;
}
/** Enqueues manual wake text through the cron wake API. */
function wakeNow(state, opts) {
	return wake(state, opts);
}
//#endregion
//#region src/cron/service.ts
/** Public cron service facade that owns mutable scheduler state and delegates to locked ops. */
var CronService = class {
	constructor(deps) {
		this.startInProgress = 0;
		this.startState = null;
		this.state = createCronServiceState(deps);
	}
	async start() {
		const generation = this.state.lifecycleGeneration;
		const pending = this.startState;
		if (pending) {
			try {
				await pending.promise;
			} catch (err) {
				if (pending.generation === generation) throw err;
			}
			if (pending.generation === generation) return;
			await this.start();
			return;
		}
		const promise = this.startOnce(generation);
		this.startState = {
			generation,
			promise
		};
		try {
			await promise;
		} finally {
			if (this.startState?.promise === promise) this.startState = null;
		}
	}
	async startOnce(generation) {
		this.startInProgress += 1;
		this.state.schedulerStarted = false;
		try {
			const start$1 = () => start(this.state);
			await (this.state.deps.runSchedulerOwned ? this.state.deps.runSchedulerOwned(start$1) : start$1());
			if (generation !== this.state.lifecycleGeneration) {
				stop(this.state);
				return;
			}
			this.state.schedulerStarted = !this.state.stopped;
		} finally {
			this.startInProgress -= 1;
		}
	}
	stop() {
		stop(this.state);
	}
	pauseScheduling() {
		pauseScheduling(this.state);
	}
	resumeScheduling() {
		resumeScheduling(this.state);
	}
	getSuspensionBlockerCount() {
		return this.startInProgress;
	}
	async status() {
		return await status(this.state);
	}
	async list(opts) {
		return await list(this.state, opts);
	}
	async listPage(opts, matchesJob) {
		return await listPage(this.state, opts, matchesJob);
	}
	async add(input, opts) {
		return await add(this.state, input, opts);
	}
	async removeStaleJobFamily(family, opts) {
		return await removeStaleJobFamily(this.state, family, opts);
	}
	async update(id, patch, opts) {
		return await update(this.state, id, patch, opts);
	}
	async updateWithPrecondition(id, patch, precondition, opts) {
		return await updateWithPrecondition(this.state, id, patch, precondition, opts);
	}
	async remove(id, opts) {
		return await remove(this.state, id, opts);
	}
	async removeAgentJobsTransactional(agentId, commit) {
		return await removeAgentJobsTransactional(this.state, agentId, commit);
	}
	async quiesceJobs(jobs, commitGuard) {
		await quiesceJobs(this.state, jobs, commitGuard);
	}
	async run(id, mode, opts) {
		return await run(this.state, id, mode, opts);
	}
	async runOnExit(id, opts) {
		return await runOnExit(this.state, id, opts);
	}
	async enqueueRun(id, mode, opts) {
		const result = await enqueueRun(this.state, id, mode, opts);
		if (result.ok && "runnable" in result) throw new Error("cron enqueueRun returned unresolved runnable disposition");
		return result;
	}
	getJob(id) {
		return this.state.store?.jobs.find((job) => job.id === id);
	}
	/** In-memory job snapshot; undefined until the store is loaded. */
	getLoadedJobs() {
		return this.state.store?.jobs;
	}
	async readJob(id) {
		return await readJob(this.state, id);
	}
	async readScratch(id) {
		return await readScratch(this.state, id);
	}
	async writeScratch(id, params) {
		return await writeScratch(this.state, id, params);
	}
	async recordExternalFailure(id, error, statePatch, source) {
		await recordExternalFailure(this.state, id, error, statePatch, source);
	}
	async updateExternalState(id, streamScheduleKey, streamSourceIdentity, statePatch) {
		return await updateExternalState(this.state, id, streamScheduleKey, streamSourceIdentity, statePatch);
	}
	async retireExternalStreamSource(id, streamScheduleKey, streamSourceIdentity) {
		return await retireExternalStreamSource(this.state, id, streamScheduleKey, streamSourceIdentity);
	}
	async updateExternalCounters(id, counters) {
		await updateExternalCounters(this.state, id, counters);
	}
	getDefaultAgentId() {
		return this.state.deps.resolveDefaultAgentId ? this.state.deps.resolveDefaultAgentId() : this.state.deps.defaultAgentId;
	}
	wake(opts) {
		return wakeNow(this.state, opts);
	}
};
//#endregion
export { cronScriptFailureMetadata as n, CronService as t };
