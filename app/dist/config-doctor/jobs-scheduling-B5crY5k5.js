import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { a as asDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { n as formatErrorMessageWithCode } from "./errors-cp9Var1Z.js";
import { ft as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BrVKCISp.js";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-D08lnQbi.js";
import { t as deleteExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-BdaJeXtX.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { a as loadCronRows, o as loadedCronStoreFromRows } from "./row-codec-uVFeVvND.js";
import { a as createCronStreamSourceIdentity, c as resolveCronStreamBatching } from "./normalize-7Cb8d2VO.js";
import { n as normalizePayloadToSystemText } from "./normalize-CErIsKfn.js";
import { t as parseAbsoluteTimeMs } from "./parse-CUOktP0M.js";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-DsqI6EXS.js";
import { n as resolveCronStaggerMs } from "./stagger-Bgt59wxy.js";
import { f as isCronJobActive } from "./active-jobs-DhbrbXjH.js";
import { n as computePreviousRunAtMs, t as computeNextRunAtMs } from "./schedule-BBo1-jUf.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-2vhyQrsJ.js";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.js";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.js";
import crypto from "node:crypto";
import { toUSVString } from "node:util";
//#region src/cron/agent-availability.ts
function describeUnavailableCronAgent(agentId, env) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, { env });
	return refusal ? `${refusal.reason}\n${refusal.repairHint}` : `cron job agent is unavailable: ${agentId}`;
}
//#endregion
//#region src/cron/store/run-receipt-read.ts
function isReceiptStatus(value) {
	return value === "running" || value === "ok" || value === "error" || value === "skipped" || value === "interrupted" || value === "superseded";
}
function receiptFromRow(row) {
	if (!isReceiptStatus(row.status)) throw new Error(`invalid cron run receipt status ${row.status}`);
	return {
		receiptId: row.receipt_id,
		storeKey: row.store_key,
		jobId: row.job_id,
		configRevision: row.config_revision,
		agentId: row.agent_id,
		...row.request_run_id ? { requestRunId: row.request_run_id } : {},
		status: row.status,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		startedAtMs: row.started_at_ms,
		finishedAtMs: row.finished_at_ms,
		...row.error_text ? { error: row.error_text } : {}
	};
}
function receiptHandle(receipt) {
	return {
		receiptId: receipt.receiptId,
		storeKey: receipt.storeKey,
		jobId: receipt.jobId,
		configRevision: receipt.configRevision,
		agentId: receipt.agentId,
		ownerPid: receipt.ownerPid,
		ownerStartTime: receipt.ownerStartTime,
		startedAtMs: receipt.startedAtMs
	};
}
//#endregion
//#region src/cron/store/run-receipt-store.ts
const CRON_RUN_RECEIPT_SCHEMA_START = "CREATE TABLE IF NOT EXISTS cron_run_receipts (";
const CRON_RUN_RECEIPT_SCHEMA_END = "ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);";
const CRON_RUN_RECEIPT_TERMINAL_RETENTION = 64;
const CRON_RUN_RECEIPT_DELETE_BATCH_SIZE = 500;
const CRON_RUN_RECEIPT_FINISH_RETRY_MS = 1e3;
/** Recovery horizon for abandoned markers and unverifiable foreign receipts. */
const CRON_STUCK_RUN_MS = 72e5;
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const locallyOwnedReceipts = /* @__PURE__ */ new Set();
const pendingReceiptSettlements = /* @__PURE__ */ new Map();
const pendingReceiptFinishRetries = /* @__PURE__ */ new Map();
var CronRunReceiptConflictError = class extends Error {
	constructor(receipt) {
		super(`cron job ${receipt.jobId} is already running in process ${receipt.ownerPid}`);
		this.receipt = receipt;
		this.name = "CronRunReceiptConflictError";
		this.candidate = receiptHandle(receipt);
	}
};
var CronRunReceiptRevisionError = class extends Error {
	constructor(receiptId, message = "cron run configuration changed", reason = "revision-changed") {
		super(message);
		this.receiptId = receiptId;
		this.reason = reason;
		this.name = "CronRunReceiptRevisionError";
	}
};
function ensureCronRunReceiptSchema(database) {
	const start = TESTCLAW_STATE_SCHEMA_SQL.indexOf(CRON_RUN_RECEIPT_SCHEMA_START);
	const endMarker = TESTCLAW_STATE_SCHEMA_SQL.indexOf(CRON_RUN_RECEIPT_SCHEMA_END, start);
	if (start < 0 || endMarker < start) throw new Error("Assistant cron run receipt schema marker is missing.");
	database.exec(TESTCLAW_STATE_SCHEMA_SQL.slice(start, endMarker + 77));
}
function query(database) {
	return getNodeSqliteKysely(database);
}
function activeRow(db, key, jobId) {
	const find = () => {
		const active = query(db).selectFrom("cron_run_receipts").where("store_key", "=", key).where("status", "=", "running");
		return jobId === void 0 ? executeSqliteQuerySync(db, active.select("job_id")).rows : executeSqliteQueryTakeFirstSync(db, active.selectAll().where("job_id", "=", jobId));
	};
	try {
		return find();
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "no such table: cron_run_receipts") throw error;
		ensureCronRunReceiptSchema(db);
		return find();
	}
}
function withReceiptWrite(operationLabel, options, operation) {
	let initializedDatabase;
	const result = runAssistantStateWriteTransaction(({ db }) => {
		if (!initializedDatabases.has(db)) {
			ensureCronRunReceiptSchema(db);
			initializedDatabase = db;
		}
		return operation(db);
	}, options, { operationLabel });
	if (initializedDatabase) initializedDatabases.add(initializedDatabase);
	return result;
}
function currentJob(database, storeKey, jobId) {
	const rows = loadCronRows(database, storeKey, /* @__PURE__ */ new Set([jobId]));
	return loadedCronStoreFromRows(rows).store.jobs[0];
}
function sameOwner(left, right) {
	return left.receipt_id === right.receiptId && left.owner_pid === right.ownerPid && left.owner_start_time === right.ownerStartTime && left.started_at_ms === right.startedAtMs;
}
function observeOwner(row) {
	return {
		receiptId: row.receipt_id,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		startedAtMs: row.started_at_ms
	};
}
function ownerStale(owner, nowMs = Date.now()) {
	if (owner.ownerPid === process.pid) return !locallyOwnedReceipts.has(owner.receiptId);
	if (isPidDefinitelyDead(owner.ownerPid)) return true;
	const observedStartTime = getFileLockProcessStartTime(owner.ownerPid);
	if (owner.ownerStartTime !== null && observedStartTime !== null) return owner.ownerStartTime !== observedStartTime;
	return nowMs - owner.startedAtMs > CRON_STUCK_RUN_MS;
}
function validateCurrentJob(params) {
	const job = currentJob(params.database, params.handle.storeKey, params.handle.jobId);
	if (!job) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron job was removed");
	if (params.resolveAgentId(job) !== params.handle.agentId) throw new CronRunReceiptRevisionError(params.handle.receiptId);
	return job;
}
function pruneTerminalReceipts(database, storeKey, jobId, job) {
	const pendingReceiptId = job?.state.runningAtMs === void 0 ? void 0 : job.state.runningReceiptId;
	let terminalQuery = query(database).selectFrom("cron_run_receipts").select("receipt_id").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running");
	if (typeof pendingReceiptId === "string" && toUSVString(pendingReceiptId) === pendingReceiptId) terminalQuery = terminalQuery.orderBy((eb) => eb.case().when("receipt_id", "=", pendingReceiptId).then(1).else(0).end(), "desc");
	const terminalIds = executeSqliteQuerySync(database, terminalQuery.orderBy("finished_at_ms", "desc").orderBy("started_at_ms", "desc").orderBy("receipt_id", "desc").limit(-1).offset(CRON_RUN_RECEIPT_TERMINAL_RETENTION)).rows;
	for (let index = 0; index < terminalIds.length; index += CRON_RUN_RECEIPT_DELETE_BATCH_SIZE) {
		const receiptIds = terminalIds.slice(index, index + CRON_RUN_RECEIPT_DELETE_BATCH_SIZE).map((row) => row.receipt_id);
		deleteExecutionOwnerLifecycleMetadata({
			db: database,
			ownerKind: "cron",
			ownerIds: receiptIds
		});
		executeSqliteQuerySync(database, query(database).deleteFrom("cron_run_receipts").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running").where("receipt_id", "in", receiptIds));
	}
}
/** Prepares process liveness facts before the caller enters its commit transaction. */
function prepareCronRunReceiptAdjudication(params) {
	const storeKey = cronStoreKey(params.storePath);
	const observed = withReceiptWrite("cron.run-receipt.inspect", params.env ? { env: params.env } : {}, (database) => activeRow(database, storeKey, params.jobId));
	return {
		storeKey,
		...observed ? { observed: observeOwner(observed) } : {},
		observedStale: observed ? ownerStale(observeOwner(observed), params.nowMs) : false
	};
}
function prepareCronRunReceiptClaim(params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	if (ownerStartTime === null) throw new Error("cron run cannot acquire a durable fence without process start identity");
	const adjudication = prepareCronRunReceiptAdjudication({
		storePath: params.storePath,
		jobId: params.job.id,
		nowMs: params.startedAtMs,
		env: params.env
	});
	const storeKey = cronStoreKey(params.storePath);
	return {
		handle: {
			receiptId: crypto.randomUUID(),
			storeKey,
			jobId: params.job.id,
			configRevision: resolveCronJobConfigRevision(params.job),
			agentId: params.agentId,
			ownerPid: process.pid,
			ownerStartTime,
			startedAtMs: params.startedAtMs
		},
		...adjudication,
		...params.requestRunId ? { requestRunId: params.requestRunId } : {}
	};
}
/** Rechecks the owner and phase start so activation invalidates an age-based stale decision. */
function adjudicateActiveCronRunReceiptInDatabase(params) {
	const current = activeRow(params.database, params.prepared.storeKey, params.jobId);
	if (!current) return;
	if (params.prepared.observed && params.prepared.observedStale && sameOwner(current, params.prepared.observed)) {
		executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
			status: "interrupted",
			finished_at_ms: params.finishedAtMs,
			error_text: "cron: job interrupted because owner is unavailable"
		}).where("receipt_id", "=", current.receipt_id).where("status", "=", "running"));
		return;
	}
	throw new CronRunReceiptConflictError(receiptFromRow(current));
}
/** Claims the receipt inside the caller's synchronous cron-state transaction. */
function claimCronRunReceiptInDatabase(params) {
	const { handle } = params.prepared;
	if (handle.ownerStartTime === null) throw new Error("cron run cannot acquire a durable fence without process start identity");
	adjudicateActiveCronRunReceiptInDatabase({
		database: params.database,
		jobId: handle.jobId,
		prepared: params.prepared,
		finishedAtMs: handle.startedAtMs
	});
	const job = validateCurrentJob({
		database: params.database,
		handle,
		resolveAgentId: params.resolveAgentId
	});
	pruneTerminalReceipts(params.database, handle.storeKey, handle.jobId, job);
	executeSqliteQuerySync(params.database, query(params.database).insertInto("cron_run_receipts").values({
		receipt_id: handle.receiptId,
		store_key: handle.storeKey,
		job_id: handle.jobId,
		config_revision: handle.configRevision,
		agent_id: handle.agentId,
		request_run_id: params.prepared.requestRunId ?? null,
		status: "running",
		owner_pid: handle.ownerPid,
		owner_start_time: handle.ownerStartTime,
		started_at_ms: handle.startedAtMs,
		finished_at_ms: null,
		error_text: null
	}));
	const claimed = receiptHandle(receiptFromRow(activeRow(params.database, handle.storeKey, handle.jobId)));
	locallyOwnedReceipts.add(claimed.receiptId);
	return claimed;
}
function findActiveCronRunReceiptInDatabase(params) {
	const row = activeRow(params.database, cronStoreKey(params.storePath), params.jobId);
	return row ? receiptHandle(receiptFromRow(row)) : void 0;
}
function exactCronRunReceiptMatches(current, proposed) {
	return current?.receiptId === proposed.receiptId && current.ownerPid === proposed.ownerPid && current.ownerStartTime === proposed.ownerStartTime && current.storeKey === proposed.storeKey && current.jobId === proposed.jobId && current.startedAtMs === proposed.startedAtMs;
}
function isCronRunReceiptOwnerStale(candidate, nowMs = Date.now()) {
	return ownerStale(candidate, nowMs);
}
/** Synchronous transaction guard used immediately before a run side effect or state write. */
function assertCronRunReceiptOwnedInDatabase(params) {
	const current = activeRow(params.database, params.handle.storeKey, params.handle.jobId);
	if (!current || current.receipt_id !== params.handle.receiptId || current.owner_pid !== params.handle.ownerPid || current.owner_start_time !== params.handle.ownerStartTime) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron run fence is no longer current");
}
/** Synchronous transaction guard used immediately before a run side effect or state write. */
function assertCronRunReceiptCurrentInDatabase(params) {
	assertCronRunReceiptOwnedInDatabase(params);
	validateCurrentJob({
		database: params.database,
		handle: params.handle,
		resolveAgentId: params.resolveAgentId
	});
}
/** Advances a queued lease to its execution start inside the marker transaction. */
function activateCronRunReceiptInDatabase(params) {
	assertCronRunReceiptCurrentInDatabase(params);
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({ started_at_ms: params.startedAtMs }).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running"));
	return {
		...params.handle,
		startedAtMs: params.startedAtMs
	};
}
/** Reads the canonical definition under the same exact receipt check used by execution. */
function readCronRunReceiptCurrentJob(params) {
	if (params.isAgentAvailable && !params.isAgentAvailable(params.handle.agentId)) throw new CronRunReceiptRevisionError(params.handle.receiptId, describeUnavailableCronAgent(params.handle.agentId, params.env), "owner-unavailable");
	return withReceiptWrite("cron.run-receipt.assert-current", params.env ? { env: params.env } : {}, (database) => {
		assertCronRunReceiptOwnedInDatabase({
			database,
			handle: params.handle
		});
		return params.allowMissingJob ? void 0 : validateCurrentJob({
			database,
			...params
		});
	});
}
function assertCronRunReceiptCurrent(params) {
	readCronRunReceiptCurrentJob(params);
}
/** Keeps the durable lease live when timeout/cancel returns before the runner. */
function trackCronRunReceiptSettlement(params) {
	const receiptId = params.handle.receiptId;
	const pending = {
		releaseRequested: false,
		onFinishError: params.onFinishError
	};
	pendingReceiptSettlements.set(receiptId, pending);
	const settle = () => {
		if (pendingReceiptSettlements.get(receiptId) !== pending) return;
		pendingReceiptSettlements.delete(receiptId);
		if (pending.finish) try {
			finishCronRunReceipt(pending.finish);
		} catch (error) {
			pending.onFinishError(error);
		}
		else if (pending.releaseRequested) locallyOwnedReceipts.delete(receiptId);
	};
	params.settlement.then(settle, settle);
}
function isCronRunReceiptSettlementPending(handle) {
	return pendingReceiptSettlements.has(handle.receiptId);
}
function clearCronRunReceiptFinishRetry(receiptId) {
	const pending = pendingReceiptFinishRetries.get(receiptId);
	if (pending?.timer) clearTimeout(pending.timer);
	pendingReceiptFinishRetries.delete(receiptId);
}
function queueCronRunReceiptFinishRetry(finish) {
	const receiptId = finish.handle.receiptId;
	let pending = pendingReceiptFinishRetries.get(receiptId);
	if (!pending) {
		pending = {
			finish,
			timer: null
		};
		pendingReceiptFinishRetries.set(receiptId, pending);
	}
	if (pending.timer) return;
	pending.timer = setTimeout(() => {
		pending.timer = null;
		try {
			finishCronRunReceipt(pending.finish);
		} catch {}
	}, CRON_RUN_RECEIPT_FINISH_RETRY_MS);
	pending.timer.unref?.();
}
function finishCronRunReceipt(params) {
	const pending = pendingReceiptSettlements.get(params.handle.receiptId);
	if (pending) {
		pending.finish ??= params;
		return;
	}
	try {
		const result = withReceiptWrite("cron.run-receipt.finish", params.env ? { env: params.env } : {}, (database) => finishCronRunReceiptInDatabase({
			database,
			...params
		}));
		clearCronRunReceiptFinishRetry(params.handle.receiptId);
		locallyOwnedReceipts.delete(params.handle.receiptId);
		return result;
	} catch (error) {
		queueCronRunReceiptFinishRetry(params);
		throw error;
	}
}
/** Releases only this process's liveness proof after terminal persistence fails. */
function releaseLocalCronRunReceiptOwnership(handle) {
	const pending = pendingReceiptSettlements.get(handle.receiptId);
	if (pending) {
		pending.releaseRequested = true;
		return;
	}
	if (pendingReceiptFinishRetries.has(handle.receiptId)) return;
	locallyOwnedReceipts.delete(handle.receiptId);
}
/** Completes the exact active receipt inside its caller's cron-state transaction. */
function finishCronRunReceiptInDatabase(params) {
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
		status: params.status,
		finished_at_ms: params.finishedAtMs,
		error_text: params.error ?? null
	}).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running").where("owner_pid", "=", params.handle.ownerPid));
	pruneTerminalReceipts(params.database, params.handle.storeKey, params.handle.jobId, currentJob(params.database, params.handle.storeKey, params.handle.jobId));
	const row = executeSqliteQueryTakeFirstSync(params.database, query(params.database).selectFrom("cron_run_receipts").selectAll().where("receipt_id", "=", params.handle.receiptId));
	return row ? receiptFromRow(row) : void 0;
}
//#endregion
//#region src/cron/failure-notification-text.ts
const GENERIC_FAILURE_DETAIL = "Check automation history for details.";
const SCRIPT_FAILURE_COPY = {
	aborted: "was aborted",
	invalid_input: "received invalid input",
	runtime_unavailable: "runtime is unavailable",
	timeout: "timed out",
	output_limit_exceeded: "exceeded its output limit",
	snapshot_limit_exceeded: "exceeded its state limit",
	internal_error: "failed internally",
	tool_budget_exceeded: "exceeded its tool budget"
};
/** Renders only classified reasons or closed producer-authored failure facts. */
function cronFailureDetailLines(errorReason, failureNotificationDetail) {
	if (errorReason) return errorReason === "model_not_found" ? [
		`Cause: ${errorReason}`,
		"Run `testclaw doctor --fix` to repair provider-declared retired model references.",
		"Choose a supported model for this automation or remove its model override to use the agent default. If the agent default is unavailable, update it too."
	] : [`Cause: ${errorReason}`];
	if (!failureNotificationDetail) return [GENERIC_FAILURE_DETAIL];
	if (failureNotificationDetail.kind === "command-exit") return [`Cause: command exited with code ${failureNotificationDetail.exitCode}`];
	if (failureNotificationDetail.kind === "command-timeout") return [failureNotificationDetail.mode === "wall-clock" ? "Cause: command timed out" : "Cause: command stopped after producing no output"];
	const label = failureNotificationDetail.source === "payload" ? "automation script" : "trigger script";
	if (failureNotificationDetail.code === "plugin_reload_failed") return [
		"Cause: tools could not be refreshed after a plugin reload.",
		`The ${label} did not run. Automatic setup recovery failed.`,
		"Check automation history and plugin status, then retry the automation."
	];
	return [`Cause: ${label} ${SCRIPT_FAILURE_COPY[failureNotificationDetail.code]}`];
}
//#endregion
//#region src/cron/service/notification-intents.ts
function cronNotificationJob(job) {
	return {
		id: job.id,
		name: job.name,
		agentId: job.agentId,
		sessionTarget: job.sessionTarget,
		sessionKey: job.sessionKey,
		wakeMode: job.wakeMode,
		state: {
			lastRunAtMs: job.state.lastRunAtMs,
			lastFailureAlertAtMs: job.state.lastFailureAlertAtMs,
			lastFailureNotificationId: job.state.lastFailureNotificationId
		}
	};
}
//#endregion
//#region src/cron/service/auto-disable.ts
/** Shared state and owner-notification policy for cron auto-disable transitions. */
/**
* Run failures get more room than schedule errors (10 vs. 3) because provider
* and network errors are often transient, and restart-interrupted runs count too.
*/
const MAX_CONSECUTIVE_RUN_FAILURES = 10;
function autoDisableReasonLabel(reason) {
	return reason === "consecutive-failures" ? "run failures" : "schedule errors";
}
/** Records one canonical auto-disable fact and queues its owning-agent notification. */
function autoDisableCronJob(params) {
	const { job } = params;
	if (isSystemMonitorDeclaration(job.declarationKey)) return false;
	if (!job.enabled || job.state.autoDisabled) return false;
	job.enabled = false;
	job.state.nextRunAtMs = void 0;
	job.state.autoDisabled = {
		reason: params.reason,
		atMs: params.atMs,
		consecutiveErrors: params.consecutiveErrors
	};
	const name = truncateUtf16Safe((job.name || job.id).replace(/\s+/g, " ").trim(), 120);
	const errorReason = params.reason === "consecutive-failures" ? job.state.lastErrorReason : void 0;
	const text = [
		`⚠️ Automation "${name}" was auto-disabled after ${params.consecutiveErrors} consecutive ${autoDisableReasonLabel(params.reason)}.`,
		...cronFailureDetailLines(errorReason),
		`Fix the underlying cause, then run \`testclaw automations enable ${job.id}\` to re-enable it.`
	].join("\n");
	params.deferredNotifications.push({
		kind: "auto-disabled",
		job: cronNotificationJob(job),
		text
	});
	return true;
}
/** Auto-disables only time-based recurring jobs once their run-error streak reaches the limit. */
function maybeAutoDisableCronJobAfterRunFailure(params) {
	const consecutiveErrors = params.job.state.consecutiveErrors ?? 0;
	if (params.job.schedule.kind !== "cron" && params.job.schedule.kind !== "every" || consecutiveErrors < MAX_CONSECUTIVE_RUN_FAILURES) return false;
	return autoDisableCronJob({
		...params,
		reason: "consecutive-failures",
		consecutiveErrors
	});
}
//#endregion
//#region src/cron/service/one-shot-schedule.ts
/** Authored one-shot occurrence ownership across manual runs and scheduling. */
/** A manual run may retain the authored one-shot even while it has no runnable slot. */
function resolveForcePreservedOneShotAtMs(job) {
	const preserved = job.state.forcePreservedNextRunAtMs;
	return job.schedule.kind === "at" && asDateTimestampMs(preserved) !== void 0 && preserved === parseAbsoluteTimeMs(job.schedule.at) ? preserved : void 0;
}
/** Only future occurrences are borrowed; retry or pacing slots take precedence. */
function resolveManualOneShotOccurrenceAtMs(job, ownershipAtMs) {
	const occurrenceAtMs = job.schedule.kind === "at" ? job.state.nextRunAtMs ?? computeNextRunAtMs(job.schedule, ownershipAtMs) : void 0;
	return occurrenceAtMs !== void 0 && occurrenceAtMs > ownershipAtMs ? occurrenceAtMs : void 0;
}
/** Reservation owns this provenance before an enablement edit can make completion stale. */
function retainManualOneShotOccurrence(job, ownershipAtMs) {
	job.state.forcePreservedNextRunAtMs = resolveManualOneShotOccurrenceAtMs(job, ownershipAtMs) ?? job.state.forcePreservedNextRunAtMs;
}
/** Retained authored occurrences can recompute a missing runnable slot after enablement. */
function clearInvalidForcePreservedNextRun(job) {
	const preserved = job.state.forcePreservedNextRunAtMs;
	const retainsAuthoredOccurrence = job.state.nextRunAtMs === void 0 && resolveForcePreservedOneShotAtMs(job) !== void 0;
	if (preserved !== void 0 && !retainsAuthoredOccurrence && (asDateTimestampMs(preserved) === void 0 || preserved !== job.state.nextRunAtMs)) {
		job.state.forcePreservedNextRunAtMs = void 0;
		return true;
	}
	return false;
}
function computeOneShotNextRunAtMs(job, lastRunStatus) {
	const preserved = resolveForcePreservedOneShotAtMs(job);
	if (preserved !== void 0) return preserved;
	const atMs = job.schedule.kind === "at" ? parseAbsoluteTimeMs(job.schedule.at) : null;
	if (lastRunStatus === "ok" && job.state.lastRunAtMs) {
		if (atMs !== null && Number.isFinite(atMs) && atMs > job.state.lastRunAtMs) return atMs;
		return;
	}
	return atMs !== null && Number.isFinite(atMs) ? atMs : void 0;
}
//#endregion
//#region src/cron/service/trigger-interval.ts
function hasPendingCronTriggerInterval(job, nowMs) {
	const nextRunAtMs = asDateTimestampMs(job.state.nextRunAtMs);
	const lastActivityAtMs = Math.max(job.updatedAtMs, job.state.lastTriggerEvalAtMs ?? 0);
	return job.trigger !== void 0 && nextRunAtMs !== void 0 && nextRunAtMs > 0 && nowMs < nextRunAtMs && nextRunAtMs <= lastActivityAtMs + resolveCronTriggerMinIntervalMs();
}
//#endregion
//#region src/cron/service/jobs-scheduling.ts
/** Scheduling state and next-run computation for cron jobs. */
const staggerOffsetCache = /* @__PURE__ */ new Map();
const TIME_SCHEDULE_STATE_FIELDS = [
	"startupCatchupAtMs",
	"pacedNextRunAtMs",
	"forcePreservedNextRunAtMs",
	"nextRunAtMs"
];
function ownsCronRunMarker(ownership, jobId, markerAtMs, requireForce = false) {
	const reservation = ownership.reservations.get(jobId);
	return reservation?.markerAtMs === markerAtMs && (!requireForce || reservation.preserveWhenDisabled);
}
function normalizeStreamScheduleBounds(schedule) {
	if (schedule.kind !== "stream") return schedule;
	const resolved = resolveCronStreamBatching(schedule);
	return {
		...schedule,
		...schedule.batchMs !== void 0 ? { batchMs: resolved.batchMs } : {},
		...schedule.maxBatchBytes !== void 0 ? { maxBatchBytes: resolved.maxBatchBytes } : {}
	};
}
/** Default retry delays applied after consecutive cron execution errors. */
const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS = [
	3e4,
	6e4,
	3e5,
	9e5,
	36e5
];
function isFiniteTimestamp(value) {
	return asDateTimestampMs(value) !== void 0;
}
/** Returns whether a stored next-run timestamp is finite and schedulable. */
function hasScheduledNextRunAtMs(value) {
	return isFiniteTimestamp(value) && value > 0;
}
/** Resolves the newest persisted cron run status while older state is still readable. */
function resolveJobLastRunStatus(job) {
	return job.state.lastRunStatus ?? job.state.lastStatus;
}
/** Resolves the retry backoff delay for a one-based consecutive error count. */
function errorBackoffMs(consecutiveErrors, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	const idx = Math.min(consecutiveErrors - 1, scheduleMs.length - 1);
	return expectDefined(scheduleMs[Math.max(0, idx)], "schedule ms entry at math.max(0, idx)") ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS[0];
}
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
function resolveJobErrorBackoffUntilMs(job, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	if (resolveJobLastRunStatus(job) !== "error" || !isFiniteTimestamp(job.state.lastRunAtMs)) return;
	const consecutiveErrorsRaw = job.state.consecutiveErrors;
	const consecutiveErrors = typeof consecutiveErrorsRaw === "number" && Number.isFinite(consecutiveErrorsRaw) ? Math.max(1, Math.floor(consecutiveErrorsRaw)) : 1;
	const lastDurationMs = typeof job.state.lastDurationMs === "number" && Number.isFinite(job.state.lastDurationMs) ? Math.max(0, Math.floor(job.state.lastDurationMs)) : 0;
	const lastEndedAtMs = job.state.lastRunAtMs + lastDurationMs;
	return asDateTimestampMs(lastEndedAtMs + errorBackoffMs(consecutiveErrors, scheduleMs));
}
function resolveStableCronOffsetMs(jobId, staggerMs) {
	if (staggerMs <= 1) return 0;
	const cacheKey = `${staggerMs}:${jobId}`;
	const cached = staggerOffsetCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const offset = crypto.createHash("sha256").update(jobId).digest().readUInt32BE(0) % staggerMs;
	pruneMapToMaxSize(staggerOffsetCache, 4095);
	staggerOffsetCache.set(cacheKey, offset);
	return offset;
}
function computeStaggeredCronNextRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return computeNextRunAtMs(job.schedule, nowMs);
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computeNextRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const baseNext = computeNextRunAtMs(job.schedule, cursorMs);
		if (baseNext === void 0) return;
		const shifted = baseNext + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted > nowMs) return shifted;
		cursorMs = Math.max(cursorMs + 1, baseNext + 1e3);
	}
}
function computeStaggeredCronPreviousRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return;
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computePreviousRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const basePrevious = computePreviousRunAtMs(job.schedule, cursorMs);
		if (basePrevious === void 0) return;
		const shifted = basePrevious + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted <= nowMs) return shifted;
		cursorMs = Math.max(0, basePrevious - 1e3);
	}
}
function computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs) {
	const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
	const probeMs = nowMs + 1e3;
	if (!isFiniteTimestamp(probeMs)) return previous;
	const boundary = computeStaggeredCronPreviousRunAtMs(job, probeMs);
	if (isFiniteTimestamp(boundary) && boundary <= nowMs && (!isFiniteTimestamp(previous) || boundary > previous)) return boundary;
	return previous;
}
function isStaggeredCronRunAtMs(job, runAtMs) {
	if (job.schedule.kind !== "cron" || !isFiniteTimestamp(runAtMs)) return false;
	return computeStaggeredCronPreviousRunAtOrBeforeMs(job, runAtMs) === runAtMs;
}
function isStaleFutureCronSlot(job, nowMs) {
	const nextRun = job.state.nextRunAtMs;
	if (job.schedule.kind !== "cron" || !hasScheduledNextRunAtMs(nextRun) || nowMs >= nextRun || typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number") return false;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	if (backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRun <= backoffUntilMs || hasPendingCronTriggerInterval(job, nowMs)) return false;
	let naturalNext;
	try {
		naturalNext = computeStaggeredCronNextRunAtMs(job, nowMs);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(naturalNext) || nextRun === naturalNext) return false;
	let isScheduledSlot;
	try {
		isScheduledSlot = isStaggeredCronRunAtMs(job, nextRun);
	} catch {
		return false;
	}
	if (isScheduledSlot) return false;
	if (nextRun < naturalNext) return job.payload.kind !== "agentTurn";
	let followingNaturalNext;
	try {
		followingNaturalNext = computeStaggeredCronNextRunAtMs(job, naturalNext);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(followingNaturalNext)) return false;
	const naturalIntervalMs = followingNaturalNext - naturalNext;
	return naturalIntervalMs > 0 && nextRun >= followingNaturalNext + naturalIntervalMs;
}
function resolveEveryAnchorMs(params) {
	const coerced = coerceFiniteScheduleNumber(params.schedule.anchorMs);
	if (coerced !== void 0) return Math.max(0, Math.floor(coerced));
	if (isFiniteTimestamp(params.fallbackAnchorMs)) return Math.max(0, Math.floor(params.fallbackAnchorMs));
	return 0;
}
function hasInvalidExplicitEveryAnchor(schedule) {
	if (schedule.anchorMs === void 0) return false;
	const coerced = coerceFiniteScheduleNumber(schedule.anchorMs);
	return coerced === void 0 || coerced < 0;
}
/** Finds an in-memory cron job or throws the public unknown-id error. */
function findJobOrThrow(state, id) {
	const job = state.store?.jobs.find((j) => j.id === id);
	if (!job) throw new Error(`unknown cron job id: ${id}`);
	return job;
}
/** Returns the effective enabled flag, defaulting missing values to enabled. */
function isJobEnabled(job) {
	return job.enabled ?? true;
}
function isTimeScheduledJob(job) {
	return job.schedule.kind !== "on-exit" && job.schedule.kind !== "stream";
}
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
function computeJobNextRunAtMs(job, nowMs) {
	if (!isJobEnabled(job)) return;
	if (job.schedule.kind === "every") {
		if (hasInvalidExplicitEveryAnchor(job.schedule)) return;
		const everyMsRaw = coerceFiniteScheduleNumber(job.schedule.everyMs);
		if (everyMsRaw === void 0) return;
		const everyMs = Math.floor(everyMsRaw);
		if (everyMs < 1) return;
		const fallbackAnchorMs = isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs;
		const anchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs
		});
		const lastRunAtMs = job.state.lastRunAtMs;
		if (isFiniteTimestamp(lastRunAtMs) && lastRunAtMs >= anchorMs) {
			const nextFromLastRun = Math.floor(lastRunAtMs) + everyMs;
			if (!isFiniteTimestamp(nextFromLastRun)) return;
			if (nextFromLastRun > nowMs) return nextFromLastRun;
		}
		const next = computeNextRunAtMs({
			...job.schedule,
			everyMs,
			anchorMs
		}, nowMs);
		return isFiniteTimestamp(next) ? next : void 0;
	}
	if (job.schedule.kind === "at") return computeOneShotNextRunAtMs(job, resolveJobLastRunStatus(job));
	const next = computeStaggeredCronNextRunAtMs(job, nowMs);
	if (next === void 0 && job.schedule.kind === "cron") return computeStaggeredCronNextRunAtMs(job, Math.floor(nowMs / 1e3) * 1e3 + 1e3);
	return isFiniteTimestamp(next) ? next : void 0;
}
/** Computes the latest effective cron timestamp at or before the supplied time. */
function computeJobPreviousRunAtOrBeforeMs(job, nowMs) {
	if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
	return asDateTimestampMs(computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs));
}
/** Maximum consecutive schedule errors before auto-disabling a job. */
const MAX_SCHEDULE_ERRORS = 3;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
function recordScheduleComputeError(params) {
	const { state, job, err } = params;
	const errorCount = (job.state.scheduleErrorCount ?? 0) + 1;
	const errText = formatErrorMessageWithCode(err);
	job.state.scheduleErrorCount = errorCount;
	job.state.nextRunAtMs = void 0;
	job.state.lastError = `schedule error: ${errText}`;
	if (errorCount >= MAX_SCHEDULE_ERRORS) {
		autoDisableCronJob({
			job,
			reason: "schedule-errors",
			atMs: state.deps.nowMs(),
			consecutiveErrors: errorCount,
			deferredNotifications: params.deferredNotifications
		});
		state.deps.log.error({
			jobId: job.id,
			name: job.name,
			errorCount,
			err: errText
		}, "cron: auto-disabled job after repeated schedule errors");
	} else state.deps.log.warn({
		jobId: job.id,
		name: job.name,
		errorCount,
		err: errText
	}, "cron: failed to compute next run for job (skipping)");
	return true;
}
function normalizeJobTickState(params) {
	const { state, job, nowMs, ownership } = params;
	const { log } = state.deps;
	let changed = false;
	if (!job.state) {
		job.state = {};
		changed = true;
	}
	if (job.schedule.kind === "stream" && !job.state.streamSourceIdentity?.trim()) {
		job.state.streamSourceIdentity = createCronStreamSourceIdentity();
		changed = true;
	}
	if (job.schedule.kind === "every" && !hasInvalidExplicitEveryAnchor(job.schedule)) {
		const normalizedAnchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs: isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs
		});
		if (job.schedule.anchorMs !== normalizedAnchorMs) {
			job.schedule = {
				...job.schedule,
				anchorMs: normalizedAnchorMs
			};
			job.state.pacedNextRunAtMs = void 0;
			job.state.forcePreservedNextRunAtMs = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job) || !isTimeScheduledJob(job)) for (const key of TIME_SCHEDULE_STATE_FIELDS) {
		if (key === "forcePreservedNextRunAtMs" && resolveForcePreservedOneShotAtMs(job) !== void 0) continue;
		if (job.state[key] !== void 0) {
			job.state[key] = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job)) {
		if (job.state.queuedAtMs !== void 0 && !ownsCronRunMarker(ownership, job.id, job.state.queuedAtMs, true)) {
			job.state.queuedAtMs = void 0;
			changed = true;
		}
		if (job.state.runningAtMs !== void 0 && !ownsCronRunMarker(ownership, job.id, job.state.runningAtMs, true) && !ownership.isJobActive(job.id)) {
			Object.assign(job.state, {
				runningAtMs: void 0,
				runningReceiptId: void 0
			});
			delete job.state.runningScheduleChangeId;
			changed = true;
		}
		return {
			changed,
			skip: true
		};
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs) && job.state.nextRunAtMs !== void 0) {
		job.state.nextRunAtMs = void 0;
		changed = true;
	}
	changed = clearInvalidForcePreservedNextRun(job) || changed;
	const queuedAt = job.state.queuedAtMs;
	if (typeof queuedAt === "number" && Math.abs(nowMs - queuedAt) > 72e5 && !ownsCronRunMarker(ownership, job.id, queuedAt)) {
		log.warn({
			jobId: job.id,
			queuedAtMs: queuedAt
		}, "cron: clearing stuck queued marker");
		job.state.queuedAtMs = void 0;
		changed = true;
	}
	const runningAt = job.state.runningAtMs;
	if (typeof runningAt === "number" && Math.abs(nowMs - runningAt) > 72e5 && !ownsCronRunMarker(ownership, job.id, runningAt)) {
		log.warn({
			jobId: job.id,
			runningAtMs: runningAt
		}, "cron: clearing stuck running marker");
		Object.assign(job.state, {
			runningAtMs: void 0,
			runningReceiptId: void 0
		});
		delete job.state.runningScheduleChangeId;
		changed = true;
		const nextRun = job.state.nextRunAtMs;
		const lastRun = job.state.lastRunAtMs;
		const alreadyExecutedSlot = hasScheduledNextRunAtMs(nextRun) && isFiniteTimestamp(lastRun) && lastRun >= nextRun;
		return {
			changed,
			skip: !alreadyExecutedSlot
		};
	}
	return {
		changed,
		skip: false
	};
}
function recomputeJobNextRunAtMs(params) {
	let changed = false;
	try {
		let newNext = computeJobNextRunAtMs(params.job, params.nowMs);
		if (params.job.schedule.kind !== "at" && resolveJobLastRunStatus(params.job) === "error" && isFiniteTimestamp(params.job.state.lastRunAtMs)) {
			const backoffFloor = resolveJobErrorBackoffUntilMs(params.job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			if (newNext !== void 0) newNext = backoffFloor !== void 0 ? Math.max(newNext, backoffFloor) : newNext;
		}
		if (params.job.state.nextRunAtMs !== newNext) {
			params.job.state.nextRunAtMs = newNext;
			changed = true;
		}
		if (params.job.state.scheduleErrorCount) {
			params.job.state.scheduleErrorCount = void 0;
			changed = true;
		}
	} catch (err) {
		if (params.skipScheduleErrorHandling) return false;
		if (recordScheduleComputeError({
			state: params.state,
			job: params.job,
			err,
			deferredNotifications: params.deferredNotifications
		})) changed = true;
	}
	return changed;
}
function isExpiredCronScheduleRepairCandidate(job, nowMs, active) {
	const nextRunAtMs = job.state.nextRunAtMs;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return hasScheduledNextRunAtMs(nextRunAtMs) && nowMs >= nextRunAtMs && typeof job.state.queuedAtMs !== "number" && typeof job.state.runningAtMs !== "number" && !active && job.state.startupCatchupAtMs !== nextRunAtMs && job.state.forcePreservedNextRunAtMs !== nextRunAtMs && (isFiniteTimestamp(job.state.lastRunAtMs) && job.state.lastRunAtMs >= nextRunAtMs || backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRunAtMs < backoffUntilMs);
}
function needsCronTimerMaintenance(job, nowMs) {
	if (!isTimeScheduledJob(job)) return TIME_SCHEDULE_STATE_FIELDS.some((key) => job.state[key] !== void 0);
	return isExpiredCronScheduleRepairCandidate(job, nowMs, isCronJobActive(job.id)) || isStaleFutureCronSlot(job, nowMs) || isJobEnabled(job) && !hasScheduledNextRunAtMs(job.state.nextRunAtMs) && !hasActiveCronRun(job);
}
function recomputeSingleJobForMaintenance(state, job, opts, ownership) {
	const now = opts.nowMs ?? state.deps.nowMs();
	const tick = normalizeJobTickState({
		state,
		job,
		nowMs: now,
		ownership
	});
	let changed = tick.changed;
	if (tick.skip) return changed;
	const recomputeExpired = opts.recomputeExpired ?? false;
	const repairFutureCronNextRunAtMs = opts.repairFutureCronNextRunAtMs ?? true;
	const recomputeJob = () => recomputeJobNextRunAtMs({
		state,
		job,
		nowMs: now,
		deferredNotifications: opts.deferredNotifications,
		skipScheduleErrorHandling: opts.skipScheduleErrorHandling
	});
	const startupCatchupAtMs = job.state.startupCatchupAtMs;
	const pacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const nextRunAtMs = job.state.nextRunAtMs;
	const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && job.state.forcePreservedNextRunAtMs === nextRunAtMs;
	const hasPendingStartupCatchup = isFiniteTimestamp(startupCatchupAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && startupCatchupAtMs === nextRunAtMs;
	if (startupCatchupAtMs !== void 0 && !hasPendingStartupCatchup) {
		job.state.startupCatchupAtMs = void 0;
		changed = true;
	}
	const hasPendingPacedNextRun = isFiniteTimestamp(pacedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && pacedNextRunAtMs === nextRunAtMs && (now < pacedNextRunAtMs || opts.preserveExpiredPacedNextRunJobId === job.id);
	if (pacedNextRunAtMs !== void 0 && !hasPendingPacedNextRun) {
		job.state.pacedNextRunAtMs = void 0;
		changed = true;
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) changed = recomputeJob() || changed;
	else if (repairFutureCronNextRunAtMs && !hasPendingStartupCatchup && !hasPendingPacedNextRun && !hasForcePreservedNextRun && isStaleFutureCronSlot(job, now)) changed = recomputeJob() || changed;
	else if (recomputeExpired && isExpiredCronScheduleRepairCandidate(job, now, ownership.isJobActive(job.id))) changed = recomputeJob() || changed;
	return changed;
}
function recomputeNextRunsForMaintenance(state, opts) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) changed = recomputeSingleJobForMaintenance(state, job, opts, {
		reservations: state.queuedRunReservationsByJobId,
		isJobActive: isCronJobActive
	}) || changed;
	return changed;
}
/** Summarizes the resident job schedule in one pass for timer and status projections. */
function summarizeCronJobSchedule(state) {
	const jobs = state.store?.jobs ?? [];
	let nextWake;
	let jobCount = 0;
	let enabledCount = 0;
	for (const job of jobs) {
		jobCount += 1;
		const nextRun = job.state.nextRunAtMs;
		const hasNextRun = hasScheduledNextRunAtMs(nextRun);
		const rawEnabled = job.enabled;
		if (rawEnabled) enabledCount += 1;
		if ((rawEnabled ?? true) && isTimeScheduledJob(job) && hasNextRun) nextWake = nextWake === void 0 ? nextRun : Math.min(nextWake, nextRun);
	}
	return {
		jobCount,
		enabledCount,
		nextWakeAtMs: nextWake
	};
}
/** Returns the next enabled wake timestamp from the in-memory cron store. */
function nextWakeAtMs(state) {
	return summarizeCronJobSchedule(state).nextWakeAtMs;
}
/** Applies one canonical server-authored authority envelope to a tool-bearing job. */
function hasActiveCronRun(job) {
	return typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number" || isCronJobActive(job.id);
}
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
function isJobDue(job, nowMs, opts) {
	if (!job.state) job.state = {};
	if (hasActiveCronRun(job)) return false;
	if (opts.forced) return true;
	return isJobEnabled(job) && isTimeScheduledJob(job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs) && nowMs >= job.state.nextRunAtMs;
}
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
function resolveJobPayloadTextForMain(job) {
	if (job.payload.kind !== "systemEvent") return;
	const text = normalizePayloadToSystemText(job.payload);
	return text.trim() ? text : void 0;
}
//#endregion
export { cronFailureDetailLines as A, findActiveCronRunReceiptInDatabase as B, hasPendingCronTriggerInterval as C, autoDisableCronJob as D, retainManualOneShotOccurrence as E, assertCronRunReceiptCurrent as F, prepareCronRunReceiptAdjudication as G, finishCronRunReceiptInDatabase as H, assertCronRunReceiptCurrentInDatabase as I, releaseLocalCronRunReceiptOwnership as J, prepareCronRunReceiptClaim as K, assertCronRunReceiptOwnedInDatabase as L, CronRunReceiptRevisionError as M, activateCronRunReceiptInDatabase as N, maybeAutoDisableCronJobAfterRunFailure as O, adjudicateActiveCronRunReceiptInDatabase as P, claimCronRunReceiptInDatabase as R, summarizeCronJobSchedule as S, resolveManualOneShotOccurrenceAtMs as T, isCronRunReceiptOwnerStale as U, finishCronRunReceipt as V, isCronRunReceiptSettlementPending as W, describeUnavailableCronAgent as X, trackCronRunReceiptSettlement as Y, recordScheduleComputeError as _, findJobOrThrow as a, resolveJobLastRunStatus as b, isJobDue as c, isTimeScheduledJob as d, needsCronTimerMaintenance as f, recomputeNextRunsForMaintenance as g, recomputeJobNextRunAtMs as h, errorBackoffMs as i, CronRunReceiptConflictError as j, cronNotificationJob as k, isJobEnabled as l, normalizeStreamScheduleBounds as m, computeJobNextRunAtMs as n, hasActiveCronRun as o, nextWakeAtMs as p, readCronRunReceiptCurrentJob as q, computeJobPreviousRunAtOrBeforeMs as r, hasScheduledNextRunAtMs as s, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS as t, isStaleFutureCronSlot as u, resolveEveryAnchorMs as v, resolveForcePreservedOneShotAtMs as w, resolveJobPayloadTextForMain as x, resolveJobErrorBackoffUntilMs as y, exactCronRunReceiptMatches as z };
