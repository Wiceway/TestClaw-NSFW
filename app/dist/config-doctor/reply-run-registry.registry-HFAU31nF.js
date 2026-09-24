import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { n as collectErrorGraphCandidates, u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { M as resolveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import "./gateway-request-scope-B7K42D1p.js";
import { s as hasGatewayContextOwner } from "./gateway-context-binding-Cy-ZcQj8.js";
import { c as getAgentRunContext } from "./agent-run-registry-DbPiDevk.js";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-CFq48PcN.js";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.js";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-CfqEsuNX.js";
import { d as isAgentRunSupersededAbortReason, o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Ig3BzvZQ.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-W8hF63QN.js";
import { n as readPersistedMediaImageLayout } from "./prompt-image-metadata-BH4KznPL.js";
import { a as getDiagnosticSessionActivitySnapshot, d as markDiagnosticRunProgress, y as resolveRunStaleThresholdMs } from "./diagnostic-run-activity-pyrECV9q.js";
import { n as createMessageInjectionAuthority, t as MessageInjectionAuthorityError } from "./message-injection-authority-CJuS3j6I.js";
import { i as QuestionDispatchUnsupportedError, n as QuestionAnswerUnconfirmedError, r as QuestionDispatchRefusedError } from "./gateway-question-dispatch-CJ9HdZ2q.js";
import { h as resolveActiveEmbeddedRunRecoveryBlocker } from "./run-state-CMPhJukD.js";
//#region src/auto-reply/reply/reply-run-finalization-lease.ts
const REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS = 6e4;
function formatReplyOperationResult(result) {
	if (!result) return "none";
	return "code" in result ? `${result.kind}:${result.code}` : result.kind;
}
const activeLeases = /* @__PURE__ */ new Set();
const activeSettleTimers = /* @__PURE__ */ new Set();
const leasesByOwner = /* @__PURE__ */ new WeakMap();
function createReplyRunSettleTimer(params) {
	let timer;
	const settleTimer = {
		clear() {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
			activeSettleTimers.delete(settleTimer);
		},
		renew(timeoutMs) {
			settleTimer.clear();
			timer = setTimeout(() => {
				timer = void 0;
				activeSettleTimers.delete(settleTimer);
				if (params.canExpire()) params.onExpire();
			}, resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			timer.unref?.();
			activeSettleTimers.add(settleTimer);
		},
		scheduleOnce(timeoutMs) {
			if (!timer) settleTimer.renew(timeoutMs);
		}
	};
	return settleTimer;
}
function createReplyRunFinalizationLease(params) {
	let finalizing = false;
	let defaultDeadlineMs = 0;
	const workDeadlinesMs = /* @__PURE__ */ new Map();
	const settleTimer = createReplyRunSettleTimer({
		canExpire: () => finalizing && params.canExpire(),
		onExpire: params.onExpire
	});
	const schedule = () => {
		const workDeadlineMs = Math.max(0, ...workDeadlinesMs.values());
		const deadlineMs = Math.max(defaultDeadlineMs, workDeadlineMs);
		settleTimer.renew(Math.max(1, deadlineMs - Date.now()));
	};
	const recordActivity = () => {
		params.onActivity();
		if (finalizing) {
			defaultDeadlineMs = Date.now() + REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS;
			params.onFinalizationProgress();
			schedule();
		}
	};
	const lease = {
		begin() {
			if (!params.canExpire()) return;
			finalizing = true;
			activeLeases.add(lease);
			recordActivity();
		},
		beginWork(timeoutMs) {
			const workId = Symbol("reply-finalization-work");
			workDeadlinesMs.set(workId, Date.now() + resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			recordActivity();
			let active = true;
			return () => {
				if (!active) return;
				active = false;
				workDeadlinesMs.delete(workId);
				if (finalizing) schedule();
			};
		},
		clear() {
			finalizing = false;
			defaultDeadlineMs = 0;
			workDeadlinesMs.clear();
			settleTimer.clear();
			activeLeases.delete(lease);
			leasesByOwner.delete(params.owner);
		},
		recordActivity
	};
	leasesByOwner.set(params.owner, lease);
	return lease;
}
function beginReplyOperationFinalizationWork(owner, timeoutMs) {
	return leasesByOwner.get(owner)?.beginWork(timeoutMs) ?? (() => void 0);
}
function resetReplyRunSettleTimersForTesting() {
	for (const lease of activeLeases) lease.clear();
	activeLeases.clear();
	for (const timer of activeSettleTimers) timer.clear();
	activeSettleTimers.clear();
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.contracts.ts
const replyMessageInjectionTargetOperation = Symbol("replyMessageInjectionTargetOperation");
const replyRunInterruptTargetOperation = Symbol("replyRunInterruptTargetOperation");
const REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS = 15e3;
const REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS = 6e4;
var ReplyRunAlreadyActiveError = class extends Error {
	constructor(sessionKey) {
		super(`Reply run already active for ${sessionKey}`);
		this.name = "ReplyRunAlreadyActiveError";
	}
};
var ReplyRunFollowupAdmissionBlockedError = class extends Error {
	constructor(sessionKey) {
		super(`Reply follow-up admission is blocked for ${sessionKey}`);
		this.name = "ReplyRunFollowupAdmissionBlockedError";
	}
};
var ReplyRunSuccessorAdmissionBlockedError = class extends Error {
	constructor(sessionKey) {
		super(`Reply successor admission is blocked for ${sessionKey}`);
		this.name = "ReplyRunSuccessorAdmissionBlockedError";
	}
};
//#endregion
//#region src/media/prompt-image-input.ts
/** Stored images require vision; facts already replaced by text descriptions do not. */
function hasPromptImageInput(input) {
	const message = input?.userTurnTranscriptRecorder?.message;
	const suppressed = message ? readPersistedMediaImageLayout(message)?.suppressedFactIndexes : void 0;
	const needsImageBytes = (fact) => isImageMediaFact(fact) && fact.hydrationSuppressed !== true;
	return Boolean(input?.images?.length || input?.imageOrder?.length || input?.media?.some(needsImageBytes) || message && readPersistedMediaFacts(message)?.some((fact, index) => needsImageBytes(fact) && !suppressed?.includes(index)));
}
const replyRunState = resolveGlobalSingleton(Symbol.for("testclaw.replyRunRegistry"), () => ({
	activeRunsByKey: /* @__PURE__ */ new Map(),
	activeSessionIdsByKey: /* @__PURE__ */ new Map(),
	activeKeysBySessionId: /* @__PURE__ */ new Map(),
	waitKeysBySessionId: /* @__PURE__ */ new Map(),
	waitersByKey: /* @__PURE__ */ new Map(),
	followupAdmissionBarriersByKey: /* @__PURE__ */ new Map(),
	successorAdmissionBarriersByKey: /* @__PURE__ */ new Map(),
	sourceTurnByKey: /* @__PURE__ */ new Map(),
	evictOperationByOperation: /* @__PURE__ */ new WeakMap(),
	executionStartedOperations: /* @__PURE__ */ new WeakSet(),
	lifecycleAdmissionByOperation: /* @__PURE__ */ new WeakMap()
}));
const lifecycleAdmissionByOperation = replyRunState.lifecycleAdmissionByOperation ??= /* @__PURE__ */ new WeakMap();
replyRunState.followupAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
replyRunState.successorAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
replyRunState.sourceTurnByKey ??= /* @__PURE__ */ new Map();
function resolveReplyOperationAgentId(sessionKey, agentId) {
	const owner = normalizeOptionalString(agentId) ?? parseAgentSessionKey(sessionKey)?.agentId;
	return owner ? normalizeAgentId(owner) : void 0;
}
function prepareReplyRunKeyUpdate(operation, nextSessionKey, agentId, stateCleared) {
	const nextKey = normalizeOptionalString(nextSessionKey);
	if (!nextKey) throw new Error("Reply operations require a canonical sessionKey");
	const nextAgentId = resolveReplyOperationAgentId(nextKey, agentId) ?? operation.agentId;
	if (nextKey === operation.key && nextAgentId === operation.agentId) return;
	if (operation.result || stateCleared || operation.phase !== "queued") throw new Error(`Cannot rekey reply operation ${operation.key} in phase ${operation.phase}`);
	const targetOwner = replyRunState.activeRunsByKey.get(nextKey);
	if (targetOwner && targetOwner !== operation) throw new ReplyRunAlreadyActiveError(nextKey);
	if (replyRunState.successorAdmissionBarriersByKey.has(nextKey)) throw new ReplyRunSuccessorAdmissionBlockedError(nextKey);
	return {
		sessionKey: nextKey,
		agentId: nextAgentId
	};
}
const clearReplyOperationByOperation = replyRunState.clearOperationByOperation ??= /* @__PURE__ */ new WeakMap();
const evictReplyOperationByOperation = replyRunState.evictOperationByOperation ?? (replyRunState.evictOperationByOperation = /* @__PURE__ */ new WeakMap());
function createUserAbortError() {
	return createAbortError("Reply operation aborted by user");
}
function registerWaitSessionId(sessionKey, sessionId) {
	replyRunState.waitKeysBySessionId.set(sessionId, sessionKey);
}
function clearWaitSessionIds(sessionKey) {
	for (const [sessionId, mappedKey] of replyRunState.waitKeysBySessionId) if (mappedKey === sessionKey) replyRunState.waitKeysBySessionId.delete(sessionId);
}
function notifyReplyRunEnded(sessionKey) {
	const waiters = replyRunState.waitersByKey.get(sessionKey);
	if (!waiters || waiters.size === 0) return;
	replyRunState.waitersByKey.delete(sessionKey);
	for (const waiter of waiters) waiter.finish(true);
}
function resolveReplyRunForCurrentSessionId(sessionId) {
	const normalizedSessionId = normalizeOptionalString(sessionId);
	if (!normalizedSessionId) return;
	const sessionKey = replyRunState.activeKeysBySessionId.get(normalizedSessionId);
	if (!sessionKey) return;
	return replyRunState.activeRunsByKey.get(sessionKey);
}
function resolveReplyRunWaitKey(sessionId) {
	const normalizedSessionId = normalizeOptionalString(sessionId);
	if (!normalizedSessionId) return;
	return replyRunState.activeKeysBySessionId.get(normalizedSessionId) ?? replyRunState.waitKeysBySessionId.get(normalizedSessionId);
}
function isReplyRunCompacting(operation) {
	if (operation.phase === "preflight_compacting" || operation.phase === "memory_flushing") return true;
	if (operation.phase !== "running") return false;
	return getAttachedBackend(operation)?.isCompacting?.() ?? false;
}
function isReplyOperationPreBackendPhase(phase) {
	return phase === "queued" || phase === "waiting_for_deferred_maintenance" || phase === "waiting_for_global_lane";
}
const attachedBackendByOperation = /* @__PURE__ */ new WeakMap();
const executionStartedOperations = replyRunState.executionStartedOperations ?? (replyRunState.executionStartedOperations = /* @__PURE__ */ new WeakSet());
function markReplyOperationExecutionStarted(operation) {
	executionStartedOperations.add(operation);
}
function hasReplyOperationExecutionStarted(operation) {
	return executionStartedOperations.has(operation);
}
const abortFrozenOperations = /* @__PURE__ */ new WeakSet();
const operationsByUpstreamAbortSignal = /* @__PURE__ */ new WeakMap();
const retainStateUntilCompleteOperations = /* @__PURE__ */ new WeakSet();
const afterClearByOperation = /* @__PURE__ */ new WeakMap();
const successorBarrierStartsByOperation = /* @__PURE__ */ new WeakMap();
const successorBarrierGroupsByOperation = /* @__PURE__ */ new WeakMap();
const expireReplyOperationByOperation = /* @__PURE__ */ new WeakMap();
function getAttachedBackend(operation) {
	return attachedBackendByOperation.get(operation);
}
function expireStaleReplyOperation(operation, reason, options) {
	return expireReplyOperationByOperation.get(operation)?.(reason, options) ?? false;
}
function forceClearReplyOperation(operation, cause) {
	if (replyRunState.activeRunsByKey.get(operation.key) !== operation) return false;
	const clearState = clearReplyOperationByOperation.get(operation);
	if (!clearState) return false;
	operation.fail("run_failed", cause);
	clearState();
	return true;
}
function hasCommittedReplyOperationOutcome(operation) {
	return !operation.result && abortFrozenOperations.has(operation);
}
function isReplyOperationAbortable(operation) {
	if (operation.result || abortFrozenOperations.has(operation)) return false;
	const backend = getAttachedBackend(operation);
	if (!backend?.isAbortable) return true;
	try {
		return backend.isAbortable();
	} catch {
		return false;
	}
}
function isReplyRunAbortableForSignal(signal) {
	const operation = operationsByUpstreamAbortSignal.get(signal);
	return operation ? isReplyOperationAbortable(operation) : true;
}
/** Resolve only the live operation admitted with this exact upstream signal. */
function resolveActiveReplyRunOwnerForSignal(signal) {
	const operation = operationsByUpstreamAbortSignal.get(signal);
	if (!operation) return;
	const { key: sessionKey, sessionId } = operation;
	const isCurrent = () => !signal.aborted && !operation.result && operation.key === sessionKey && operation.sessionId === sessionId && replyRunState.activeRunsByKey.get(sessionKey) === operation;
	if (!isCurrent()) return;
	return {
		sessionId,
		sessionKey,
		abort: () => isCurrent() && operation.abortByUser()
	};
}
/** Keep terminal state registered until the operation owner exits via complete(). */
function retainReplyOperationUntilComplete(operation) {
	retainStateUntilCompleteOperations.add(operation);
}
/** Queue-first compatibility adapter for shipped Plugin SDK/embedded handles. */
function runAfterReplyOperationClear(operation, afterClear) {
	const afterClearState = afterClearByOperation.get(operation);
	if (!afterClearState?.barrier && replyRunState.activeRunsByKey.get(operation.key) !== operation) {
		const barrier = replyRunState.followupAdmissionBarriersByKey.get(operation.key);
		const source = barrier?.sources.get(lifecycleAdmissionByOperation.get(operation)?.databaseIdentity);
		if (barrier && source) {
			barrier.settled.then(() => afterClear(source.sessionId));
			return;
		}
		afterClear(operation.sessionId);
		return;
	}
	const state = afterClearState ?? { callbacks: /* @__PURE__ */ new Set() };
	state.callbacks.add(afterClear);
	afterClearByOperation.set(operation, state);
}
function isReplyOperationAbortedForRestart(operation) {
	return operation.result?.kind === "aborted" && operation.result.code === "aborted_for_restart";
}
function mergeReplyRunAdmissionSource(source, previous) {
	if (previous && !isReplyOperationAbortedForRestart(previous.operation) && previous.databaseIdentity === source.databaseIdentity && source.sessionIds.has(previous.sessionId)) {
		for (const id of source.sessionIds) previous.sessionIds.add(id);
		return Object.assign(previous, source, { sessionIds: previous.sessionIds });
	}
	return source;
}
function resolveReplyRunAdmissionSource(operation, sessionId, previous) {
	return mergeReplyRunAdmissionSource({
		sessionId,
		sessionIds: operation.captureOwnedSessionIds(),
		operation,
		databaseIdentity: lifecycleAdmissionByOperation.get(operation)?.databaseIdentity
	}, previous);
}
function registerReplyRunAdmissionBarrier(barriersByKey, sessionKey, sessionId, barrier, operation) {
	const previous = barriersByKey.get(sessionKey);
	const source = resolveReplyRunAdmissionSource(operation, sessionId, previous?.sources.get(lifecycleAdmissionByOperation.get(operation)?.databaseIdentity));
	const sources = new Map(previous?.sources);
	sources.set(source.databaseIdentity, source);
	const settled = previous ? Promise.all([previous.settled, barrier]).then(() => void 0) : barrier;
	const entry = {
		settled,
		source,
		sources
	};
	barriersByKey.set(sessionKey, entry);
	settled.then(() => {
		if (barriersByKey.get(sessionKey) === entry) barriersByKey.delete(sessionKey);
	});
	return entry;
}
/** Fence successor admission until owner handoff started at slot clear settles. */
function registerReplyOperationSuccessorBarrier(params) {
	const settlement = createDeferredCore();
	const barriers = /* @__PURE__ */ new Set();
	for (const sessionKey of new Set(params.sessionKeys.map(normalizeOptionalString))) if (sessionKey) barriers.add(registerReplyRunAdmissionBarrier(replyRunState.successorAdmissionBarriersByKey, sessionKey, params.sessionId, settlement.promise, params.operation));
	let started = false;
	const start = () => {
		if (started) return;
		started = true;
		try {
			Promise.resolve(params.start()).then(() => settlement.resolve(void 0), () => {});
		} catch {}
	};
	if (replyRunState.activeRunsByKey.get(params.operation.key) !== params.operation) {
		start();
		return;
	}
	const groups = successorBarrierGroupsByOperation.get(params.operation) ?? /* @__PURE__ */ new Set();
	groups.add({
		registrationKey: params.operation.key,
		barriers
	});
	successorBarrierGroupsByOperation.set(params.operation, groups);
	const starts = successorBarrierStartsByOperation.get(params.operation) ?? /* @__PURE__ */ new Set();
	starts.add(start);
	successorBarrierStartsByOperation.set(params.operation, starts);
}
function startReplyOperationSuccessorBarriers(operation) {
	const starts = successorBarrierStartsByOperation.get(operation);
	successorBarrierStartsByOperation.delete(operation);
	successorBarrierGroupsByOperation.delete(operation);
	if (!starts) return;
	for (const start of starts) start();
}
function updateSuccessorAdmissionSessionId(operation, sessionId) {
	for (const group of successorBarrierGroupsByOperation.get(operation) ?? []) {
		if (group.registrationKey !== operation.key) continue;
		for (const barrier of group.barriers) resolveReplyRunAdmissionSource(operation, sessionId, barrier.source);
	}
}
function isReplyRunSuccessorAdmissionBlocked(sessionKey) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return Boolean(normalizedSessionKey && !replyRunState.activeRunsByKey.has(normalizedSessionKey) && replyRunState.successorAdmissionBarriersByKey.has(normalizedSessionKey));
}
function flushReplyOperationAfterClear(operation, sessionId) {
	const state = afterClearByOperation.get(operation);
	if (!state) return;
	afterClearByOperation.delete(operation);
	for (const callback of state.callbacks) callback(sessionId);
}
function waitForReplyBarrierSettlement(barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	return new Promise((resolve) => {
		let settled = false;
		let timer;
		const finish = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve();
		};
		const schedule = (delayMs, callback) => {
			timer = setTimeout(callback, delayMs);
			timer.unref?.();
		};
		if (typeof timeout === "number") schedule(resolveTimerTimeoutMs(timeout, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS), finish);
		else {
			const startedAt = Date.now();
			const maxTimeoutMs = resolveTimerTimeoutMs(timeout.maxTimeoutMs, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS);
			const checkOwnerActivity = () => {
				const remainingMs = maxTimeoutMs - (Date.now() - startedAt);
				if (remainingMs <= 0) {
					finish();
					return;
				}
				let shouldExtend;
				try {
					shouldExtend = timeout.shouldExtend();
				} catch {
					finish();
					return;
				}
				if (!shouldExtend) {
					finish();
					return;
				}
				schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, remainingMs), checkOwnerActivity);
			};
			schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, maxTimeoutMs), checkOwnerActivity);
		}
		Promise.resolve(barrier).then(finish, finish);
	});
}
function registerFollowupAdmissionBarrier(operation, barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const entry = registerReplyRunAdmissionBarrier(replyRunState.followupAdmissionBarriersByKey, operation.key, operation.sessionId, waitForReplyBarrierSettlement(barrier, timeout), operation);
	const afterClear = afterClearByOperation.get(operation) ?? { callbacks: /* @__PURE__ */ new Set() };
	afterClear.barrier = entry;
	afterClearByOperation.set(operation, afterClear);
	return entry;
}
function updateFollowupAdmissionSessionId(operation) {
	const sources = replyRunState.followupAdmissionBarriersByKey.get(operation.key)?.sources;
	const databaseIdentity = lifecycleAdmissionByOperation.get(operation)?.databaseIdentity;
	const source = sources?.get(databaseIdentity);
	if (sources && source) sources.set(databaseIdentity, resolveReplyRunAdmissionSource(operation, operation.sessionId, source));
}
function clearReplyRunState(params) {
	if (replyRunState.activeRunsByKey.get(params.sessionKey) !== params.operation) {
		if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey && replyRunState.activeSessionIdsByKey.get(params.sessionKey) !== params.sessionId) replyRunState.activeKeysBySessionId.delete(params.sessionId);
		return;
	}
	replyRunState.activeRunsByKey.delete(params.sessionKey);
	replyRunState.activeSessionIdsByKey.delete(params.sessionKey);
	replyRunState.sourceTurnByKey.delete(params.sessionKey);
	if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey) replyRunState.activeKeysBySessionId.delete(params.sessionId);
	clearWaitSessionIds(params.sessionKey);
	notifyReplyRunEnded(params.sessionKey);
}
function markReplyRunDiagnosticProgress(params) {
	markDiagnosticRunProgress({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		reason: params.reason
	});
}
function isReplyRunRecoveryBlocked(operation) {
	const backend = getAttachedBackend(operation);
	const blocker = !operation.result && backend ? resolveActiveEmbeddedRunRecoveryBlocker(operation.sessionId, backend) : void 0;
	return blocker === "human_input_wait" || blocker === "runtime_owned_wait";
}
function isReplyRunEvidenceStale(operation) {
	const recoveryBlocked = isReplyRunRecoveryBlocked(operation);
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: operation.sessionId,
		sessionKey: operation.key
	});
	return !operation.result && operation.phase !== "waiting_for_global_lane" && Date.now() - operation.lastActivityAtMs > resolveRunStaleThresholdMs(activity, Date.now() - operation.lastActivityAtMs) && !recoveryBlocked;
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.message-injection.ts
function resolveReplyBackendQueueMessageMismatch(backend, options, authority) {
	if (options?.isInboundUserMessage === true) {
		const runContext = backend.runId ? getAgentRunContext(backend.runId) : void 0;
		if (runContext?.isControlUiVisible === false && runContext.projectSessionMessages === false) return "input_visibility_mismatch";
		const activeFingerprint = normalizeOptionalString(backend.toolAuthorityFingerprint ?? authority?.toolAuthorityFingerprint);
		const incomingFingerprint = normalizeOptionalString(options.toolAuthorityFingerprint);
		if (!activeFingerprint || !incomingFingerprint || activeFingerprint !== incomingFingerprint) return "tool_authority_mismatch";
	}
	if (options?.terminalReplyExpectation !== void 0 && options.terminalReplyExpectation !== (backend.terminalReplyExpectation ?? "required")) return "reply_expectation_mismatch";
	if (hasPromptImageInput(options) && backend.supportsQueueMessageImages !== true) return "image_input_unsupported";
	if (options?.sourceReplyDeliveryMode === "message_tool_only" && backend.sourceReplyDeliveryMode !== "message_tool_only") return "source_reply_delivery_mode_mismatch";
	if (options !== void 0 && Object.hasOwn(options, "taskSuggestionDeliveryMode") && options?.taskSuggestionDeliveryMode !== backend.taskSuggestionDeliveryMode) return "task_suggestion_delivery_mode_mismatch";
}
function resolveReplyBackendMessageInjection(backend, canInject, sourceBound) {
	const guarded = backend.messageInjectionV2;
	if (guarded?.version === 2) {
		const assertCurrent = createMessageInjectionAuthority(canInject);
		const authorityKind = sourceBound ? "source-bound" : "run";
		return {
			isAvailable: () => guarded.isAvailable(),
			queueMessage: (text, options) => guarded.queueMessage(text, options, assertCurrent, authorityKind),
			claimPendingUserInputAnswer: guarded.claimPendingUserInputAnswer ? (text, options) => guarded.claimPendingUserInputAnswer(text, options, assertCurrent, authorityKind) : void 0,
			cancelPendingUserInput: guarded.cancelPendingUserInput ? (resolvedBy) => guarded.cancelPendingUserInput(resolvedBy, assertCurrent, authorityKind) : void 0
		};
	}
	if (sourceBound) {
		createMessageInjectionAuthority(canInject)();
		return;
	}
	if (backend.messageInjection) {
		const injection = backend.messageInjection;
		return {
			isAvailable: () => injection.isAvailable(),
			queueMessage: (text, options) => injection.queueMessage(text, options),
			claimPendingUserInputAnswer: backend.claimPendingUserInputAnswer?.bind(backend),
			cancelPendingUserInput: backend.cancelPendingUserInput?.bind(backend)
		};
	}
	if (!backend.queueMessage) return;
	return {
		claimPendingUserInputAnswer: backend.claimPendingUserInputAnswer?.bind(backend),
		cancelPendingUserInput: backend.cancelPendingUserInput?.bind(backend),
		isAvailable: () => {
			if (backend.isStopped) return !backend.isStopped();
			return true;
		},
		queueMessage: (text, options) => options ? backend.queueMessage(text, options) : backend.queueMessage(text)
	};
}
function resolveReplyMessageInjectionRejection(params) {
	const { operation } = params;
	if (!operation || replyRunState.activeRunsByKey.get(operation.key) !== operation) return { reason: "no_active_run" };
	if (operation.result || operation.phase !== "running") return { reason: "not_running" };
	if (isReplyRunEvidenceStale(operation)) return { reason: "stale_run" };
	const backend = getAttachedBackend(operation);
	const canInject = () => {
		params.assertCurrent?.();
		return replyRunState.activeRunsByKey.get(operation.key) === operation && !operation.result && operation.phase === "running" && getAttachedBackend(operation) === backend;
	};
	const injection = backend ? resolveReplyBackendMessageInjection(backend, canInject, params.assertCurrent !== void 0) : void 0;
	if (!backend || !injection) return { reason: "injection_unavailable" };
	try {
		if (!injection.isAvailable()) return { reason: "injection_unavailable" };
	} catch (error) {
		return {
			reason: "injection_unavailable",
			errorMessage: String(error)
		};
	}
	const mismatch = resolveReplyBackendQueueMessageMismatch(backend, params.options, operation);
	const activeFingerprint = normalizeOptionalString(backend.toolAuthorityFingerprint ?? operation.toolAuthorityFingerprint);
	const pendingInputAuthorityProven = activeFingerprint !== void 0 && normalizeOptionalString(params.options?.pendingInputAuthorityFingerprint) === activeFingerprint;
	const hiddenPendingInputAuthorized = mismatch === "input_visibility_mismatch" && params.options?.isInboundUserMessage === true && backend.messageInjectionV2?.version === 2 && activeFingerprint !== void 0 && (pendingInputAuthorityProven || normalizeOptionalString(params.options.toolAuthorityFingerprint) === activeFingerprint);
	if ((mismatch === "tool_authority_mismatch" && pendingInputAuthorityProven || hiddenPendingInputAuthorized) && params.allowPendingUserInputAnswer !== false && !hasPromptImageInput(params.options) && injection.claimPendingUserInputAnswer) return {
		backend,
		injection: {
			isAvailable: () => true,
			queueMessage: async (text, options) => {
				if (!await injection.claimPendingUserInputAnswer?.(text, options)) throw new Error("pending user input was not accepted");
			}
		}
	};
	return mismatch ? {
		reason: mismatch,
		backend,
		cancelPendingUserInput: mismatch !== "input_visibility_mismatch" || hiddenPendingInputAuthorized ? injection.cancelPendingUserInput : void 0
	} : {
		backend,
		injection
	};
}
function resolveReplyMessageInjectionFailure(error, params) {
	const { assertCurrent, accepted } = params;
	const candidates = collectErrorGraphCandidates(error, (current) => [current.cause]);
	const unsupported = candidates.findLast((candidate) => candidate instanceof QuestionDispatchUnsupportedError);
	const unconfirmed = candidates.findLast((candidate) => candidate instanceof QuestionAnswerUnconfirmedError);
	if (unconfirmed) return {
		status: "indeterminate",
		errorMessage: unconfirmed.message
	};
	const refusal = candidates.findLast((candidate) => candidate instanceof MessageInjectionAuthorityError || (assertCurrent !== void 0 || unsupported !== void 0) && (candidate instanceof QuestionDispatchRefusedError && !(candidate instanceof QuestionDispatchUnsupportedError) || candidate instanceof SessionPendingInputCustodyError));
	if (unsupported && !refusal && !accepted) {
		try {
			assertCurrent?.();
		} catch (sourceError) {
			return {
				status: "failed",
				error: toErrorObject(sourceError, "Message source authority is no longer current")
			};
		}
		return {
			status: "rejected",
			reason: "injection_unavailable"
		};
	}
	const authorityError = refusal ?? unsupported;
	if (authorityError instanceof MessageInjectionAuthorityError || authorityError instanceof QuestionDispatchRefusedError || authorityError instanceof SessionPendingInputCustodyError) return {
		status: "failed",
		error: authorityError instanceof MessageInjectionAuthorityError && authorityError.cause instanceof Error ? authorityError.cause : authorityError
	};
}
function beginReplyMessageInjectionTarget(target, text, options) {
	const operation = target[replyMessageInjectionTargetOperation];
	const { toolAuthorityOverlay, assertCurrent, allowPendingUserInputAnswer, ...backendOptions } = options ?? {};
	const projectedToolAuthorityFingerprint = toolAuthorityOverlay ? operation.projectToolAuthorityFingerprint(toolAuthorityOverlay) : backendOptions.toolAuthorityFingerprint;
	const queueOptions = options ? {
		...backendOptions,
		...toolAuthorityOverlay ? { toolAuthorityFingerprint: projectedToolAuthorityFingerprint } : {}
	} : void 0;
	const resolved = resolveReplyMessageInjectionRejection({
		operation,
		options: queueOptions,
		allowPendingUserInputAnswer,
		assertCurrent
	});
	if (!("injection" in resolved)) {
		const immediateRejection = {
			status: "rejected",
			reason: resolved.reason,
			...resolved.errorMessage ? { errorMessage: resolved.errorMessage } : {}
		};
		const cancelPendingImage = options?.isInboundUserMessage === true && hasPromptImageInput(options) && (resolved.reason === "tool_authority_mismatch" || resolved.reason === "input_visibility_mismatch" || resolved.reason === "image_input_unsupported") ? resolved.cancelPendingUserInput : void 0;
		let outcome = Promise.resolve(immediateRejection);
		if (cancelPendingImage) {
			const onCancellationError = (error) => {
				const failure = resolveReplyMessageInjectionFailure(error, {
					assertCurrent,
					accepted: false
				});
				if (!failure) throw error;
				return failure;
			};
			try {
				outcome = Promise.resolve(cancelPendingImage("image-reply")).then(() => immediateRejection, onCancellationError);
			} catch (error) {
				outcome = Promise.resolve(onCancellationError(error));
			}
		}
		return {
			targetRunId: target.runId,
			acceptance: outcome.then((result) => result.status === "indeterminate", () => false),
			outcome
		};
	}
	const targetRunId = normalizeOptionalString(resolved.backend.runId);
	const userTurnTranscriptRecorder = queueOptions?.userTurnTranscriptRecorder;
	const acceptance = createDeferredCore();
	let acceptanceSettled = false;
	const settleAcceptance = (accepted) => {
		if (acceptanceSettled) return;
		acceptanceSettled = true;
		acceptance.resolve(accepted);
		queueOptions?.onQueueAccepted?.(accepted);
	};
	const runtimeQueueOptions = {
		...queueOptions,
		...allowPendingUserInputAnswer === false ? { isInboundUserMessage: false } : {},
		onQueueAccepted: (accepted) => {
			if (accepted) settleAcceptance(true);
		}
	};
	const failed = (error) => {
		const outcome = resolveReplyMessageInjectionFailure(error, {
			assertCurrent,
			accepted: acceptanceSettled
		}) ?? {
			status: "rejected",
			reason: "runtime_rejected",
			errorMessage: String(error)
		};
		settleAcceptance(outcome.status === "indeterminate");
		return outcome;
	};
	let queued;
	try {
		queued = resolved.injection.queueMessage(text, runtimeQueueOptions);
	} catch (error) {
		return {
			targetRunId,
			acceptance: acceptance.promise,
			outcome: Promise.resolve(failed(error))
		};
	}
	const outcome = queued.then(async (result) => {
		settleAcceptance(true);
		if (targetRunId && queueOptions?.waitForTranscriptCommit === true && result?.transcriptCommit !== "unconfirmed") await userTurnTranscriptRecorder?.confirmSteerTargetRunIdForPersistence?.(targetRunId);
		return result ? {
			status: "accepted",
			result
		} : { status: "accepted" };
	}, failed);
	return {
		targetRunId,
		acceptance: acceptance.promise,
		outcome
	};
}
/** Finalize adoption and cleanup on the captured operation without rediscovery. */
async function finalizeReplyMessageInjectionAttempt(params) {
	const outcome = await params.attempt.outcome;
	if (outcome.status === "failed") throw outcome.error;
	if (outcome.status === "rejected") return {
		status: "rejected",
		outcome,
		targetRunId: params.attempt.targetRunId
	};
	params.onOutcome?.(outcome.status);
	if (outcome.status === "indeterminate") {
		let adoptionError;
		try {
			await params.onAdopted?.();
		} catch (error) {
			adoptionError = error;
		}
		return {
			status: "indeterminate",
			outcome,
			targetRunId: params.attempt.targetRunId,
			adoptionError
		};
	}
	recordAcceptedReplyMessageInjectionTarget(params.target, { inboundAudio: params.inboundAudio });
	let aborted = outcome.result?.transcriptCommit === "unconfirmed" && params.abortOnUnconfirmedTranscript !== false;
	if (aborted) abortReplyMessageInjectionTarget(params.target);
	let adoptionError;
	try {
		await params.onAdopted?.();
	} catch (error) {
		adoptionError = error;
		if (params.shouldAbortOnAdoptionError?.(error)) {
			abortReplyMessageInjectionTarget(params.target);
			aborted = true;
		}
	}
	return {
		status: "accepted",
		outcome,
		targetRunId: params.attempt.targetRunId,
		aborted,
		...adoptionError === void 0 ? {} : { adoptionError }
	};
}
/** Abort only the operation captured by this target; never a same-key successor. */
function abortReplyMessageInjectionTarget(target) {
	return target[replyMessageInjectionTargetOperation].abortByUser();
}
/** Record accepted input on the exact operation without rediscovering its session slot. */
function recordAcceptedReplyMessageInjectionTarget(target, options) {
	const operation = target[replyMessageInjectionTargetOperation];
	operation.recordActivity();
	if (options?.inboundAudio === true) operation.markAcceptedSteeredInboundAudio();
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.operation.ts
function createReplyOperation(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionKey) throw new Error("Reply operations require a canonical sessionKey");
	if (!sessionId) throw new Error("Reply operations require a sessionId");
	if (params.respectFollowupAdmissionBarrier && replyRunState.followupAdmissionBarriersByKey.has(sessionKey)) throw new ReplyRunFollowupAdmissionBlockedError(sessionKey);
	if (replyRunState.activeRunsByKey.has(sessionKey)) throw new ReplyRunAlreadyActiveError(sessionKey);
	if (replyRunState.successorAdmissionBarriersByKey.has(sessionKey)) throw new ReplyRunSuccessorAdmissionBlockedError(sessionKey);
	const controller = new AbortController();
	let currentSessionKey = sessionKey;
	let currentSessionId = sessionId;
	let currentAgentId = resolveReplyOperationAgentId(sessionKey, params.agentId);
	let phase = "queued";
	let phaseBeforeGlobalLaneWait;
	let staleExpiryReason;
	let result = null;
	let stateCleared = false;
	let pendingClearBarrier;
	let retainFailureUntilComplete = false;
	let terminalRecovery = false;
	let acceptedSteeredInboundAudio = false;
	let toolAuthorityFingerprint;
	let toolAuthoritySnapshot;
	let toolAuthorityRoute;
	const ownerSettlement = createDeferredCore();
	let ownerCompletionBarrier;
	const settleOwner = () => {
		const pending = ownerCompletionBarrier;
		if (!pending) {
			ownerSettlement.resolve(void 0);
			return;
		}
		pending.then(() => pending === ownerCompletionBarrier ? ownerSettlement.resolve(void 0) : settleOwner());
	};
	const startedAtMs = Date.now();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	let lastActivityAtMs = startedAtMs;
	const upstreamAbortSignal = params.upstreamAbortSignal;
	let upstreamAbortHandler;
	const detachUpstreamAbort = () => {
		if (!upstreamAbortHandler) return;
		upstreamAbortSignal?.removeEventListener("abort", upstreamAbortHandler);
		upstreamAbortHandler = void 0;
	};
	const ownedSessionIds = /* @__PURE__ */ new Set([sessionId]);
	const recordActivity = () => {
		lastActivityAtMs = Date.now();
	};
	const setResult = (next) => {
		result = next;
		recordActivity();
	};
	const clearState = (afterClearBarrier, followupAdmissionBarrierTimeout) => {
		if (stateCleared) return;
		stateCleared = true;
		terminalSettleTimer.clear();
		finalizationLease.clear();
		expireReplyOperationByOperation.delete(operation);
		evictReplyOperationByOperation.delete(operation);
		clearReplyOperationByOperation.delete(operation);
		detachUpstreamAbort();
		const registeredBarrier = afterClearBarrier ? registerFollowupAdmissionBarrier(operation, afterClearBarrier, followupAdmissionBarrierTimeout) : pendingClearBarrier;
		pendingClearBarrier = void 0;
		updateFollowupAdmissionSessionId(operation);
		startReplyOperationSuccessorBarriers(operation);
		markReplyRunDiagnosticProgress({
			sessionKey: currentSessionKey,
			sessionId: currentSessionId,
			reason: "reply_operation:ended"
		});
		clearReplyRunState({
			sessionKey: currentSessionKey,
			sessionId: currentSessionId,
			operation
		});
		if (!registeredBarrier) {
			flushReplyOperationAfterClear(operation, currentSessionId);
			return;
		}
		registeredBarrier.settled.then(() => flushReplyOperationAfterClear(operation, registeredBarrier.source.sessionId));
	};
	const abortInternally = (reason) => {
		if (!controller.signal.aborted) controller.abort(reason);
	};
	const scheduleTerminalSettle = () => {
		if (stateCleared) return;
		terminalSettleTimer.scheduleOnce(REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS);
	};
	const abortOperation = (reason, abortReason, abortedCode) => {
		const phaseBeforeAbort = phase;
		if (!result) {
			setResult({
				kind: "aborted",
				code: abortedCode
			});
			detachUpstreamAbort();
		}
		phase = "aborted";
		abortInternally(abortReason);
		try {
			getAttachedBackend(operation)?.cancel(reason);
		} finally {
			if (isReplyOperationPreBackendPhase(phaseBeforeAbort) && !retainStateUntilCompleteOperations.has(operation)) clearState();
			else scheduleTerminalSettle();
		}
	};
	const operation = {
		get key() {
			return currentSessionKey;
		},
		get sessionId() {
			return currentSessionId;
		},
		get agentId() {
			return currentAgentId;
		},
		turnKind: params.turnKind ?? "visible",
		lifecycleGeneration,
		get routeThreadId() {
			return params.routeThreadId;
		},
		get originatingLeafEntryId() {
			return params.originatingLeafEntryId;
		},
		abortSignal: controller.signal,
		get resetTriggered() {
			return params.resetTriggered;
		},
		get terminalRecovery() {
			return terminalRecovery;
		},
		get acceptedSteeredInboundAudio() {
			return acceptedSteeredInboundAudio;
		},
		get toolAuthorityFingerprint() {
			return toolAuthorityFingerprint;
		},
		get toolAuthorityRoute() {
			return toolAuthorityRoute;
		},
		get phase() {
			return phase;
		},
		get result() {
			return result;
		},
		get staleExpiryReason() {
			return staleExpiryReason;
		},
		get startedAtMs() {
			return startedAtMs;
		},
		get lastActivityAtMs() {
			return lastActivityAtMs;
		},
		hasOwnedSessionId(candidateSessionId) {
			const normalizedSessionId = normalizeOptionalString(candidateSessionId);
			return normalizedSessionId ? ownedSessionIds.has(normalizedSessionId) : false;
		},
		captureOwnedSessionIds() {
			return new Set(ownedSessionIds);
		},
		recordActivity() {
			finalizationLease.recordActivity();
		},
		setPhase(next) {
			if (result) return;
			recordActivity();
			phase = next;
		},
		markWaitingForDeferredMaintenance() {
			if (result || phase !== "queued") return;
			phase = "waiting_for_deferred_maintenance";
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "deferred_maintenance:waiting"
			});
		},
		markDeferredMaintenanceWaitEnded() {
			if (result || phase !== "waiting_for_deferred_maintenance") return;
			phase = "queued";
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "deferred_maintenance:wait_ended"
			});
		},
		markWaitingForGlobalLane() {
			if (result || phase !== "queued" && phase !== "running") return;
			phaseBeforeGlobalLaneWait = phase;
			phase = "waiting_for_global_lane";
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "global_lane:waiting"
			});
		},
		markGlobalLaneWaitEnded() {
			if (result || phase !== "waiting_for_global_lane") return;
			phase = phaseBeforeGlobalLaneWait ?? "queued";
			phaseBeforeGlobalLaneWait = void 0;
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "global_lane:wait_ended"
			});
		},
		markTerminalRecovery() {
			terminalRecovery = true;
		},
		markAcceptedSteeredInboundAudio() {
			acceptedSteeredInboundAudio = true;
		},
		bindToolAuthoritySnapshot(snapshot) {
			if (result || toolAuthoritySnapshot && toolAuthoritySnapshot !== snapshot) throw new Error("Reply operation cannot change tool authority after admission");
			if (toolAuthoritySnapshot) return;
			const fingerprint = normalizeOptionalString(snapshot.fingerprint());
			if (!fingerprint) throw new Error("Reply operation tool authority fingerprint is required");
			toolAuthoritySnapshot = snapshot;
			toolAuthorityFingerprint = fingerprint;
		},
		projectToolAuthorityFingerprint(overlay) {
			if (result || !toolAuthoritySnapshot || !toolAuthorityRoute) return;
			try {
				return normalizeOptionalString(toolAuthoritySnapshot.project(overlay, toolAuthorityRoute));
			} catch {
				return;
			}
		},
		bindToolAuthorityRoute(route) {
			if (result || !toolAuthoritySnapshot || replyRunState.activeRunsByKey.get(currentSessionKey) !== operation) throw new Error("Reply operation has no active tool authority snapshot");
			const provider = normalizeOptionalString(route.provider);
			const model = normalizeOptionalString(route.model);
			if (!provider || !model) throw new Error("Reply operation tool authority route is required");
			const preparedRoute = {
				provider,
				model
			};
			const fingerprint = toolAuthoritySnapshot.fingerprint(preparedRoute);
			toolAuthorityRoute = preparedRoute;
			toolAuthorityFingerprint = fingerprint;
			return fingerprint;
		},
		updateSessionId(nextSessionId) {
			if (result) return;
			const normalizedNextSessionId = normalizeOptionalString(nextSessionId);
			if (!normalizedNextSessionId || normalizedNextSessionId === currentSessionId) return;
			recordActivity();
			if (replyRunState.activeKeysBySessionId.has(normalizedNextSessionId) && replyRunState.activeKeysBySessionId.get(normalizedNextSessionId) !== currentSessionKey) throw new Error(`Cannot rebind reply operation ${currentSessionKey} to active session ${normalizedNextSessionId}`);
			replyRunState.activeKeysBySessionId.delete(currentSessionId);
			registerWaitSessionId(currentSessionKey, currentSessionId);
			currentSessionId = normalizedNextSessionId;
			ownedSessionIds.add(currentSessionId);
			updateFollowupAdmissionSessionId(operation);
			updateSuccessorAdmissionSessionId(operation, currentSessionId);
			replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			registerWaitSessionId(currentSessionKey, currentSessionId);
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "reply_operation:session_updated"
			});
		},
		updateSessionKey(nextSessionKey, agentId) {
			const update = prepareReplyRunKeyUpdate(operation, nextSessionKey, agentId, stateCleared);
			if (!update) return;
			recordActivity();
			currentAgentId = update.agentId;
			if (update.sessionKey === currentSessionKey) return;
			const previousKey = currentSessionKey;
			replyRunState.activeRunsByKey.delete(previousKey);
			replyRunState.activeSessionIdsByKey.delete(previousKey);
			currentSessionKey = update.sessionKey;
			replyRunState.activeRunsByKey.set(currentSessionKey, operation);
			replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			for (const ownedSessionId of ownedSessionIds) if (replyRunState.waitKeysBySessionId.get(ownedSessionId) === previousKey) replyRunState.waitKeysBySessionId.set(ownedSessionId, currentSessionKey);
			notifyReplyRunEnded(previousKey);
			markReplyRunDiagnosticProgress({
				sessionKey: currentSessionKey,
				sessionId: currentSessionId,
				reason: "reply_operation:session_key_adopted"
			});
		},
		attachBackend(handle) {
			if (result) {
				handle.cancel(result.kind === "aborted" ? result.code === "aborted_for_restart" ? "restart" : result.code === "aborted_for_supersession" ? "superseded" : "user_abort" : "superseded");
				return;
			}
			recordActivity();
			const backendToolAuthorityFingerprint = normalizeOptionalString(handle.toolAuthorityFingerprint);
			if (backendToolAuthorityFingerprint) toolAuthorityFingerprint = backendToolAuthorityFingerprint;
			attachedBackendByOperation.set(operation, handle);
			if (controller.signal.aborted) handle.cancel("superseded");
		},
		detachBackend(handle) {
			if (getAttachedBackend(operation) === handle) attachedBackendByOperation.delete(operation);
		},
		freezeAbort() {
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			finalizationLease.begin();
		},
		retainFailureUntilComplete() {
			retainFailureUntilComplete = true;
		},
		ownerSettlement: ownerSettlement.promise,
		complete() {
			if (!result) {
				setResult({ kind: "completed" });
				phase = "completed";
			}
			clearState();
			settleOwner();
		},
		completeThen(afterClear) {
			runAfterReplyOperationClear(operation, afterClear);
			operation.complete();
		},
		completeWithAfterClearBarrier(barrier, timeoutMs) {
			const completed = Promise.resolve(barrier).then(() => {}, () => {});
			ownerCompletionBarrier = ownerCompletionBarrier ? Promise.all([ownerCompletionBarrier, completed]).then(() => {}) : completed;
			if (!result) {
				setResult({ kind: "completed" });
				phase = "completed";
			}
			clearState(barrier, timeoutMs);
			settleOwner();
		},
		fail(code, cause) {
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			finalizationLease.clear();
			if (!result) {
				setResult({
					kind: "failed",
					code,
					cause
				});
				phase = "failed";
			}
			if (!retainFailureUntilComplete && !retainStateUntilCompleteOperations.has(operation)) clearState();
			else scheduleTerminalSettle();
		},
		abortByUser() {
			if (!isReplyOperationAbortable(operation)) return false;
			abortOperation("user_abort", createUserAbortError(), "aborted_by_user");
			return true;
		},
		abortForRestart() {
			if (!isReplyOperationAbortable(operation)) return false;
			abortOperation("restart", createAgentRunRestartAbortError(), "aborted_for_restart");
			return true;
		},
		supersede(beforeSupersede) {
			const abortFrozen = abortFrozenOperations.has(operation);
			if (result || stateCleared || !abortFrozen && !isReplyOperationAbortable(operation)) return false;
			beforeSupersede?.();
			if (abortFrozen) {
				setResult({
					kind: "aborted",
					code: "aborted_for_supersession"
				});
				phase = "aborted";
				scheduleTerminalSettle();
				return true;
			}
			abortOperation("superseded", createAgentRunSupersededAbortError(), "aborted_for_supersession");
			return true;
		}
	};
	clearReplyOperationByOperation.set(operation, clearState);
	expireReplyOperationByOperation.set(operation, (reason, options) => {
		if (replyRunState.activeRunsByKey.get(currentSessionKey) !== operation || reason !== "finalization_stalled" && hasCommittedReplyOperationOutcome(operation)) return false;
		if (!result) {
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			staleExpiryReason = reason;
			setResult({
				kind: "failed",
				code: "run_stalled"
			});
			phase = "failed";
		}
		const logStaleTakeoverRelease = () => {
			diagnosticLogger.warn(`reply run stale takeover: forced release sessionKey=${currentSessionKey} reason=${reason} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
		};
		if (options?.afterClearBarrier) pendingClearBarrier = registerFollowupAdmissionBarrier(operation, options.afterClearBarrier, options.followupAdmissionBarrierTimeout);
		const backend = getAttachedBackend(operation);
		let cancelFailed = false;
		try {
			backend?.cancel("superseded");
		} catch (error) {
			cancelFailed = true;
			diagnosticLogger.warn(`reply run stale takeover cancel failed: sessionKey=${currentSessionKey} reason=${reason} owner=${stateCleared ? "completed" : "retained"} error=${String(error)}`);
		}
		abortInternally(createAbortError("Reply operation expired as stale"));
		if (stateCleared) {
			logStaleTakeoverRelease();
			return true;
		}
		if (!cancelFailed) diagnosticLogger.warn(`reply run stale takeover retained: sessionKey=${currentSessionKey} reason=${reason} owner=awaiting_terminal_completion backend=${backend ? "attached" : "pending"}`);
		scheduleTerminalSettle();
		return false;
	});
	const finalizationLease = createReplyRunFinalizationLease({
		owner: operation,
		canExpire: () => !stateCleared && !result && replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		onActivity: recordActivity,
		onFinalizationProgress: () => markReplyRunDiagnosticProgress({
			sessionKey: currentSessionKey,
			sessionId: currentSessionId,
			reason: "reply_operation:finalizing_progress"
		}),
		onExpire: () => {
			diagnosticLogger.warn(`reply run finalization settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
			if (expireReplyOperationByOperation.get(operation)?.("finalization_stalled") === false && replyRunState.activeRunsByKey.get(currentSessionKey) === operation) forceClearReplyOperation(operation);
		}
	});
	const terminalSettleTimer = createReplyRunSettleTimer({
		canExpire: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		onExpire: () => {
			diagnosticLogger.warn(`reply run terminal settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
			clearState();
		}
	});
	evictReplyOperationByOperation.set(operation, () => {
		if (stateCleared) return;
		if (!result) {
			setResult({
				kind: "aborted",
				code: "aborted_for_restart"
			});
			phase = "aborted";
		}
		abortInternally(createAgentRunRestartAbortError());
		let cancelError;
		let cancelFailed = false;
		try {
			getAttachedBackend(operation)?.cancel("restart");
		} catch (error) {
			cancelFailed = true;
			cancelError = error;
			diagnosticLogger.warn(`reply run lifecycle eviction cancel failed: sessionKey=${currentSessionKey} error=${String(error)}`);
		} finally {
			clearState();
		}
		if (cancelFailed) throw cancelError;
	});
	replyRunState.activeRunsByKey.set(sessionKey, operation);
	replyRunState.activeSessionIdsByKey.set(sessionKey, currentSessionId);
	replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
	registerWaitSessionId(sessionKey, currentSessionId);
	markReplyRunDiagnosticProgress({
		sessionKey,
		sessionId: currentSessionId,
		reason: "reply_operation:queued"
	});
	if (upstreamAbortSignal) {
		operationsByUpstreamAbortSignal.set(upstreamAbortSignal, operation);
		const abortFromUpstream = () => {
			if (result) return;
			const restart = isAgentRunRestartAbortReason(upstreamAbortSignal.reason);
			const superseded = isAgentRunSupersededAbortReason(upstreamAbortSignal.reason);
			abortOperation(restart ? "restart" : superseded ? "superseded" : "user_abort", upstreamAbortSignal.reason, restart ? "aborted_for_restart" : superseded ? "aborted_for_supersession" : "aborted_by_user");
		};
		if (upstreamAbortSignal.aborted) abortFromUpstream();
		else {
			upstreamAbortHandler = abortFromUpstream;
			upstreamAbortSignal.addEventListener("abort", upstreamAbortHandler, { once: true });
		}
	}
	return operation;
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.registry.ts
async function waitForReplyOperationOwnerSettlement(operation, timeoutMs) {
	const settlement = operation.ownerSettlement;
	if (!settlement) return true;
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 100, 100);
	let timer;
	const settled = await Promise.race([settlement.then(() => true), new Promise((resolve) => {
		timer = setTimeout(() => resolve(false), resolvedTimeoutMs);
		timer.unref?.();
	})]);
	if (timer) clearTimeout(timer);
	return settled;
}
function expireStaleReplyRunBySessionId(sessionId, reason, options) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? expireStaleReplyOperation(operation, reason, options) : false;
}
function markReplyOperationGlobalLaneWaitProgress(operation) {
	if (operation.result || operation.phase !== "waiting_for_global_lane") return;
	markReplyRunDiagnosticProgress({
		sessionKey: operation.key,
		sessionId: operation.sessionId,
		reason: "global_lane:waiting"
	});
}
function isReplyRunEvidenceStaleBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? isReplyRunEvidenceStale(operation) : false;
}
const replyRunRegistry = {
	begin(params) {
		return createReplyOperation(params);
	},
	get(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeRunsByKey.get(normalizedSessionKey);
	},
	isActive(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return false;
		return replyRunState.activeRunsByKey.has(normalizedSessionKey);
	},
	bindSourceTurnId(operation, sourceTurnId) {
		if (replyRunState.activeRunsByKey.get(operation.key) !== operation || operation.result || operation.abortSignal.aborted) return;
		replyRunState.sourceTurnByKey.set(operation.key, sourceTurnId);
	},
	getSourceTurnId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.sourceTurnByKey.get(normalizedSessionKey);
	},
	resolveCurrentMessageInjectionTarget(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		const operation = this.get(sessionKey);
		const resolved = resolveReplyMessageInjectionRejection({ operation });
		const backend = "injection" in resolved ? resolved.backend : void 0;
		if (!operation || !backend || !normalizedSessionKey) return;
		const sourceTurnId = replyRunState.sourceTurnByKey.get(normalizedSessionKey);
		return {
			[replyMessageInjectionTargetOperation]: operation,
			...backend.runId ? { runId: backend.runId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		};
	},
	resolveCurrentInterruptTarget(sessionKey) {
		const operation = this.get(sessionKey);
		return operation ? { [replyRunInterruptTargetOperation]: operation } : void 0;
	},
	abort(sessionKey) {
		const operation = this.get(sessionKey);
		if (!operation) return false;
		return operation.abortByUser();
	},
	waitForIdle(sessionKey, timeoutMs, opts) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey || !replyRunState.activeRunsByKey.has(normalizedSessionKey)) return Promise.resolve(true);
		if (opts?.signal?.aborted) return Promise.resolve(false);
		return new Promise((resolve) => {
			const waiters = replyRunState.waitersByKey.get(normalizedSessionKey) ?? /* @__PURE__ */ new Set();
			let abortHandler;
			let settled = false;
			const waiter = { finish: (ended) => {
				if (settled) return;
				settled = true;
				waiters.delete(waiter);
				if (waiters.size === 0) replyRunState.waitersByKey.delete(normalizedSessionKey);
				if (waiter.timer) clearTimeout(waiter.timer);
				if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
				resolve(ended);
			} };
			if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) waiter.timer = setTimeout(() => waiter.finish(false), resolveTimerTimeoutMs(timeoutMs, 100, 100));
			if (opts?.signal) {
				abortHandler = () => waiter.finish(false);
				opts.signal.addEventListener("abort", abortHandler, { once: true });
			}
			waiters.add(waiter);
			replyRunState.waitersByKey.set(normalizedSessionKey, waiters);
			if (!replyRunState.activeRunsByKey.has(normalizedSessionKey)) waiter.finish(true);
		});
	},
	resolveSessionId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeSessionIdsByKey.get(normalizedSessionKey);
	}
};
/** Abort and await only the captured operation; a same-key successor is never rediscovered. */
async function interruptReplyRunTarget(target, timeoutMs = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const operation = target[replyRunInterruptTargetOperation];
	return {
		aborted: operation.abortByUser(),
		settled: await waitForReplyOperationOwnerSettlement(operation, timeoutMs)
	};
}
function resolveActiveReplyRunSessionId(sessionKey) {
	return replyRunRegistry.resolveSessionId(sessionKey);
}
/** Cancels the current reply backend only when its native run identity matches exactly. */
function supersedeReplyRunByRunId(runId, beforeCancel) {
	const expectedRunId = normalizeOptionalString(runId);
	if (!expectedRunId) return false;
	for (const operation of replyRunState.activeRunsByKey.values()) {
		const backend = getAttachedBackend(operation);
		if (normalizeOptionalString(backend?.runId) !== expectedRunId) continue;
		return operation.supersede(beforeCancel);
	}
	return false;
}
function resolveActiveReplyRunThreadId(sessionKey) {
	return replyRunRegistry.get(sessionKey)?.routeThreadId;
}
function isReplyRunActiveForSessionId(sessionId) {
	return resolveReplyRunForCurrentSessionId(sessionId) !== void 0;
}
function isReplyRunAbortableForCompaction(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return Boolean(operation && !isReplyOperationPreBackendPhase(operation.phase));
}
function abortReplyRunBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation) return false;
	return operation.abortByUser();
}
function resolveActiveReplyOperationForSessionId(sessionId) {
	return resolveReplyRunForCurrentSessionId(sessionId);
}
function forceClearReplyRunBySessionId(sessionId, cause) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? forceClearReplyOperation(operation, cause) : false;
}
function clearReplyRunForResetBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation || isReplyOperationPreBackendPhase(operation.phase)) return;
	try {
		operation.abortForRestart();
	} finally {
		if (replyRunState.activeRunsByKey.get(operation.key) === operation) operation.complete();
	}
}
function waitForReplyRunEndBySessionId(sessionId, timeoutMs) {
	const waitKey = resolveReplyRunWaitKey(sessionId);
	if (!waitKey) return Promise.resolve(true);
	return replyRunRegistry.waitForIdle(waitKey, timeoutMs);
}
async function waitForReplyRunAdmissionBarrier(params) {
	const deadline = typeof params.timeoutMs === "number" ? Date.now() + resolveTimerTimeoutMs(params.timeoutMs, params.minimumTimeoutMs, params.minimumTimeoutMs) : void 0;
	const sources = /* @__PURE__ */ new Map();
	while (true) {
		if (params.signal?.aborted) return { settled: false };
		const barrier = params.barriersByKey.get(params.sessionKey);
		if (!barrier) return {
			settled: true,
			...sources.size ? { sources: [...sources.values()] } : {}
		};
		const remainingMs = deadline === void 0 ? void 0 : deadline - Date.now();
		if (remainingMs !== void 0 && remainingMs <= 0) return { settled: false };
		let timer;
		let abortHandler;
		const outcome = await Promise.race([
			barrier.settled.then(() => true),
			...remainingMs !== void 0 ? [new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), Math.max(1, remainingMs));
				timer.unref?.();
			})] : [],
			...params.signal ? [new Promise((resolve) => {
				abortHandler = () => resolve(false);
				params.signal?.addEventListener("abort", abortHandler, { once: true });
				if (params.signal?.aborted) abortHandler();
			})] : []
		]);
		if (timer) clearTimeout(timer);
		if (abortHandler) params.signal?.removeEventListener("abort", abortHandler);
		if (!outcome) return { settled: false };
		for (const [identity, source] of barrier.sources) sources.set(identity, mergeReplyRunAdmissionSource({
			...source,
			sessionIds: new Set(source.sessionIds)
		}, sources.get(identity)));
	}
}
async function waitForReplyRunFollowupAdmission(sessionKey, timeoutMs, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return normalizedSessionKey ? await waitForReplyRunAdmissionBarrier({
		barriersByKey: replyRunState.followupAdmissionBarriersByKey,
		minimumTimeoutMs: 100,
		sessionKey: normalizedSessionKey,
		signal: opts?.signal,
		timeoutMs
	}) : { settled: true };
}
async function waitForReplyRunSuccessorAdmission(sessionKey, timeoutMs, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return normalizedSessionKey ? await waitForReplyRunAdmissionBarrier({
		barriersByKey: replyRunState.successorAdmissionBarriersByKey,
		minimumTimeoutMs: 0,
		sessionKey: normalizedSessionKey,
		signal: opts?.signal,
		timeoutMs
	}) : { settled: true };
}
function abortReplyRuns(operations, opts, isCurrent) {
	let aborted = 0;
	for (const operation of operations) {
		if (isCurrent && !isCurrent(operation)) continue;
		if (opts.mode === "compacting" && !isReplyRunCompacting(operation)) continue;
		try {
			if (operation.abortForRestart()) aborted += 1;
		} catch (error) {
			if (operation.result?.kind === "aborted" && operation.result.code === "aborted_for_restart") aborted += 1;
			opts.onAbortError?.(operation.sessionId, error);
		}
	}
	return aborted;
}
function abortActiveReplyRuns(opts) {
	return abortReplyRuns(replyRunState.activeRunsByKey.values(), opts) > 0;
}
/** Snapshot before durable marking; never cancel another instance or a replacement after the await. */
function captureGatewayReplyRunRestartAbort(resolveGatewayContext) {
	const operations = Array.from(replyRunState.activeRunsByKey.values()).filter((operation) => hasGatewayContextOwner(operation, resolveGatewayContext));
	return (onAbortError) => abortReplyRuns(operations, {
		mode: "all",
		onAbortError
	}, (operation) => replyRunState.activeRunsByKey.get(operation.key) === operation && operation.lifecycleGeneration !== void 0 && isAgentEventLifecycleGenerationCurrent(operation.lifecycleGeneration) && hasGatewayContextOwner(operation, resolveGatewayContext));
}
function getActiveReplyRunCount() {
	return replyRunState.activeRunsByKey.size;
}
function listActiveReplyRunSessionIds() {
	return [...replyRunState.activeSessionIdsByKey.values()];
}
function listActiveReplyRunSessionKeys() {
	return [...replyRunState.activeSessionIdsByKey.keys()];
}
function evictPriorLifecycleReplyRuns() {
	const errors = [];
	for (const operation of replyRunState.activeRunsByKey.values()) {
		if (operation.lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(operation.lifecycleGeneration)) continue;
		const evict = evictReplyOperationByOperation.get(operation);
		if (evict) {
			try {
				evict();
			} catch (error) {
				errors.push(error);
				try {
					clearReplyRunState({
						sessionKey: operation.key,
						sessionId: operation.sessionId,
						operation
					});
				} catch (clearError) {
					errors.push(clearError);
				}
			}
			continue;
		}
		try {
			if (!operation.abortForRestart()) errors.push(/* @__PURE__ */ new Error(`Stale reply operation was not abortable: ${operation.key}`));
		} catch (error) {
			errors.push(error);
		}
		try {
			operation.complete();
		} catch (error) {
			errors.push(error);
		}
		try {
			clearReplyRunState({
				sessionKey: operation.key,
				sessionId: operation.sessionId,
				operation
			});
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to abort stale reply runs");
}
registerAgentEventLifecycleRotationHandler("reply-runs", evictPriorLifecycleReplyRuns);
const replyRunRegistryTestApi = { resetReplyRunRegistry() {
	for (const [sessionKey, sessionId] of replyRunState.activeSessionIdsByKey) markReplyRunDiagnosticProgress({
		sessionKey,
		sessionId,
		reason: "reply_operation:registry_reset"
	});
	replyRunState.activeRunsByKey.clear();
	replyRunState.activeSessionIdsByKey.clear();
	replyRunState.activeKeysBySessionId.clear();
	replyRunState.waitKeysBySessionId.clear();
	replyRunState.sourceTurnByKey.clear();
	resetReplyRunSettleTimersForTesting();
	for (const waiters of replyRunState.waitersByKey.values()) for (const waiter of waiters) waiter.finish(false);
	replyRunState.waitersByKey.clear();
	replyRunState.followupAdmissionBarriersByKey.clear();
	replyRunState.successorAdmissionBarriersByKey.clear();
} };
if (process.env.VITEST === "true" || false) globalThis[Symbol.for("testclaw.replyRunRegistryTestApi")] = replyRunRegistryTestApi;
//#endregion
export { ReplyRunSuccessorAdmissionBlockedError as $, getAttachedBackend as A, mergeReplyRunAdmissionSource as B, waitForReplyRunSuccessorAdmission as C, resolveReplyBackendQueueMessageMismatch as D, finalizeReplyMessageInjectionAttempt as E, isReplyRunEvidenceStale as F, retainReplyOperationUntilComplete as G, registerReplyOperationSuccessorBarrier as H, isReplyRunRecoveryBlocked as I, hasPromptImageInput as J, runAfterReplyOperationClear as K, isReplyRunSuccessorAdmissionBlocked as L, hasReplyOperationExecutionStarted as M, isReplyOperationAbortedForRestart as N, expireStaleReplyOperation as O, isReplyRunAbortableForSignal as P, ReplyRunFollowupAdmissionBlockedError as Q, lifecycleAdmissionByOperation as R, waitForReplyRunFollowupAdmission as S, beginReplyMessageInjectionTarget as T, resolveActiveReplyRunOwnerForSignal as U, operationsByUpstreamAbortSignal as V, resolveReplyRunForCurrentSessionId as W, REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS as X, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS as Y, ReplyRunAlreadyActiveError as Z, resolveActiveReplyRunSessionId as _, expireStaleReplyRunBySessionId as a, waitForReplyOperationOwnerSettlement as b, interruptReplyRunTarget as c, isReplyRunEvidenceStaleBySessionId as d, beginReplyOperationFinalizationWork as et, listActiveReplyRunSessionIds as f, resolveActiveReplyOperationForSessionId as g, replyRunRegistry as h, clearReplyRunForResetBySessionId as i, hasCommittedReplyOperationOutcome as j, forceClearReplyOperation as k, isReplyRunAbortableForCompaction as l, markReplyOperationGlobalLaneWaitProgress as m, abortReplyRunBySessionId as n, forceClearReplyRunBySessionId as o, listActiveReplyRunSessionKeys as p, waitForReplyBarrierSettlement as q, captureGatewayReplyRunRestartAbort as r, getActiveReplyRunCount as s, abortActiveReplyRuns as t, isReplyRunActiveForSessionId as u, resolveActiveReplyRunThreadId as v, createReplyOperation as w, waitForReplyRunEndBySessionId as x, supersedeReplyRunByRunId as y, markReplyOperationExecutionStarted as z };
