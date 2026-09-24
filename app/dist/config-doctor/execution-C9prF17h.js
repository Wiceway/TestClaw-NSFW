import { S as createDiagnosticTraceContextFromActiveScope, k as runWithDiagnosticTraceContext } from "./diagnostic-events-CzmzgdMI.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.js";
import { n as deliveryContextKey, s as normalizeDeliveryContext } from "./delivery-context.shared-DQinGDrS.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { l as updateSessionEntry } from "./session-accessor.reset-Cl1Mir1u.js";
import { a as clearChannelHistoryIfEnabled } from "./history-DNG_z37D.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-scRUtjvw.js";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-BJDQV0nt.js";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-BPoweaKy.js";
import { n as withDispatchProcessedOutcomeSink } from "./dispatch-processed-outcome-CsQM_b9n.js";
import { t as isRecentOutboundMessageIdentity } from "./outbound-echo-DlyfqMBM.js";
//#region src/plugin-sdk/pair-loop-guard-runtime.ts
const DEFAULT_PRUNE_INTERVAL_MS = 6e4;
const KEY_SEPARATOR = "";
/** Default plugin-facing loop guard config before per-channel overrides. */
const DEFAULT_PAIR_LOOP_GUARD_CONFIG = {
	enabled: true,
	maxEventsPerWindow: 20,
	windowSeconds: 60,
	cooldownSeconds: 60
};
DEFAULT_PAIR_LOOP_GUARD_CONFIG.enabled, DEFAULT_PAIR_LOOP_GUARD_CONFIG.maxEventsPerWindow, DEFAULT_PAIR_LOOP_GUARD_CONFIG.windowSeconds * 1e3, DEFAULT_PAIR_LOOP_GUARD_CONFIG.cooldownSeconds * 1e3;
function positiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** Resolves runtime loop guard settings from config/defaults and the channel default-enabled gate. */
function resolvePairLoopGuardSettings(params) {
	const configuredEnabled = typeof params.config?.enabled === "boolean" ? params.config.enabled : typeof params.defaultsConfig?.enabled === "boolean" ? params.defaultsConfig.enabled : DEFAULT_PAIR_LOOP_GUARD_CONFIG.enabled;
	const maxEventsPerWindow = positiveInteger(params.config?.maxEventsPerWindow) ?? positiveInteger(params.defaultsConfig?.maxEventsPerWindow) ?? DEFAULT_PAIR_LOOP_GUARD_CONFIG.maxEventsPerWindow;
	const windowSeconds = positiveInteger(params.config?.windowSeconds) ?? positiveInteger(params.defaultsConfig?.windowSeconds) ?? DEFAULT_PAIR_LOOP_GUARD_CONFIG.windowSeconds;
	const cooldownSeconds = positiveInteger(params.config?.cooldownSeconds) ?? positiveInteger(params.defaultsConfig?.cooldownSeconds) ?? DEFAULT_PAIR_LOOP_GUARD_CONFIG.cooldownSeconds;
	return {
		enabled: params.defaultEnabled && configuredEnabled,
		maxEventsPerWindow,
		windowMs: windowSeconds * 1e3,
		cooldownMs: cooldownSeconds * 1e3
	};
}
function buildPairKey(params) {
	const lhs = params.senderId < params.receiverId ? params.senderId : params.receiverId;
	const rhs = params.senderId < params.receiverId ? params.receiverId : params.senderId;
	return [
		params.scopeId,
		params.conversationId,
		lhs,
		rhs
	].join(KEY_SEPARATOR);
}
function pruneRecentEvents(entry, nowMs, windowMs) {
	const cutoff = nowMs - windowMs;
	entry.recentEvents = entry.recentEvents.filter((event) => event.timestampMs > cutoff);
}
function countCurrentWindowEvents(entry, nowMs) {
	return entry.recentEvents.filter((event) => event.timestampMs <= nowMs).length;
}
/** Creates an in-memory pair-loop guard with bounded periodic pruning. */
function createPairLoopGuard(params) {
	const tracked = /* @__PURE__ */ new Map();
	const pruneIntervalMs = params?.pruneIntervalMs ?? DEFAULT_PRUNE_INTERVAL_MS;
	let nextPruneAtMs = 0;
	function pruneInactiveTrackedPairs(nowMs) {
		if (pruneIntervalMs <= 0 || nowMs < nextPruneAtMs) return;
		nextPruneAtMs = nowMs + pruneIntervalMs;
		for (const [key, entry] of tracked) {
			pruneRecentEvents(entry, nowMs, entry.windowMs);
			if (entry.recentEvents.length === 0 && entry.cooldownUntilMs <= nowMs) tracked.delete(key);
		}
	}
	function recordAndCheck(paramsLocal) {
		if (!paramsLocal.settings.enabled) return { suppressed: false };
		if (!paramsLocal.scopeId || !paramsLocal.conversationId || !paramsLocal.senderId || !paramsLocal.receiverId) return { suppressed: false };
		if (paramsLocal.senderId === paramsLocal.receiverId) return { suppressed: false };
		const maxEventsPerWindow = Math.floor(paramsLocal.settings.maxEventsPerWindow);
		const windowMs = Math.floor(paramsLocal.settings.windowMs);
		const cooldownMs = Math.floor(paramsLocal.settings.cooldownMs);
		if (maxEventsPerWindow <= 0 || windowMs <= 0 || cooldownMs <= 0) return { suppressed: false };
		const nowMs = paramsLocal.nowMs ?? Date.now();
		pruneInactiveTrackedPairs(nowMs);
		const key = buildPairKey(paramsLocal);
		let entry = tracked.get(key);
		if (!entry) {
			entry = {
				recentEvents: [],
				windowMs,
				cooldownStartedAtMs: 0,
				cooldownUntilMs: 0
			};
			tracked.set(key, entry);
		}
		entry.windowMs = windowMs;
		pruneRecentEvents(entry, nowMs, windowMs);
		const eventId = paramsLocal.eventId?.trim();
		if (eventId && entry.recentEvents.some((event) => event.eventId === eventId)) return { suppressed: false };
		if (entry.cooldownStartedAtMs <= nowMs && entry.cooldownUntilMs > nowMs) return {
			suppressed: true,
			cooldownUntilMs: entry.cooldownUntilMs
		};
		entry.recentEvents.push({
			timestampMs: nowMs,
			...eventId ? { eventId } : {}
		});
		if (countCurrentWindowEvents(entry, nowMs) > maxEventsPerWindow) {
			entry.cooldownStartedAtMs = nowMs;
			entry.cooldownUntilMs = nowMs + cooldownMs;
			entry.recentEvents = entry.recentEvents.filter((event) => event.timestampMs > nowMs);
			return {
				suppressed: true,
				cooldownUntilMs: entry.cooldownUntilMs
			};
		}
		return { suppressed: false };
	}
	return {
		recordAndCheck,
		clear: () => {
			tracked.clear();
			nextPruneAtMs = 0;
		},
		snapshot: () => Array.from(tracked.entries()).map(([key, entry]) => ({
			key,
			recentCount: entry.recentEvents.length,
			cooldownUntilMs: entry.cooldownUntilMs
		}))
	};
}
//#endregion
//#region src/channels/turn/bot-loop-protection.ts
const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 6e4 });
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
function recordChannelBotPairLoopAndCheckSuppression(params) {
	return channelBotPairLoopGuard.recordAndCheck({
		scopeId: params.scopeId,
		conversationId: params.conversationId,
		senderId: params.senderId,
		receiverId: params.receiverId,
		eventId: params.eventId,
		settings: resolvePairLoopGuardSettings({
			config: params.config,
			defaultsConfig: params.defaultsConfig,
			defaultEnabled: params.defaultEnabled
		}),
		nowMs: params.nowMs
	});
}
//#endregion
//#region src/channels/turn/dispatch-result.ts
const hasFinalSignal = (signals) => signals.fallbackDelivered === true || signals.deliverySummaryDelivered === true;
const hasVisibleSignal = (result, signals) => result?.observedReplyDelivery === true || signals.observedReplyDelivery === true || hasFinalSignal(signals);
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
	tool: 0,
	block: 0,
	final: 0
};
/** Returns whether a turn produced any visible reply delivery signal. */
function hasVisibleChannelTurnDispatchFromReceipt(result, signals = {}) {
	return result?.settledReceipt?.anyVisibleDelivered === true || hasVisibleSignal(result, signals);
}
function resolveChannelTurnDispatchCounts(result) {
	const counts = result?.settledReceipt?.counts;
	return counts ? {
		tool: counts.tool?.delivered ?? 0,
		block: counts.block?.delivered ?? 0,
		final: counts.final?.delivered ?? 0
	} : {
		...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
		...result?.counts
	};
}
function hasVisibleChannelTurnDispatch(result, signals = {}) {
	if (result?.settledReceipt) return hasVisibleChannelTurnDispatchFromReceipt(result, signals);
	return hasVisibleSignal(result, signals) || result?.queuedFinal === true || Object.values(resolveChannelTurnDispatchCounts(result)).some((count) => count > 0);
}
//#endregion
//#region src/channels/turn/pending-delivery-notice.ts
const PENDING_DELIVERY_NOTICE = "I couldn’t confirm whether my previous reply reached this chat, so I won’t resend it automatically. Please ask for any missing remainder.";
function noticeId(intentId) {
	return `main-session-restart-recovery:pending-final:${intentId}`;
}
async function deliverPendingDeliveryNotice(sessionKey, storePath) {
	const entry = loadSessionEntryReadOnly({
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const notice = entry?.pendingDeliveryNotice;
	const context = normalizeDeliveryContext(notice?.context);
	const runtime = getGatewayRecoveryRuntime();
	if (!entry || !runtime || !notice || notice.state !== "owed" || !context?.channel || !context.to || deliveryContextKey(context) !== deliveryContextKey(deliveryContextFromSession(entry))) return;
	const idempotencyKey = noticeId(notice.intentId);
	let delivered;
	try {
		delivered = !(await runtime.sendRecoveryNotice({
			channel: context.channel,
			to: context.to,
			accountId: context.accountId,
			threadId: context.threadId,
			text: PENDING_DELIVERY_NOTICE,
			idempotencyKey
		})).suppressed;
	} catch {
		const owner = await findDeliveryIntentOwner(idempotencyKey);
		if (owner?.status !== "completed" && owner?.status !== "failed") return;
		delivered = owner.status === "completed";
	}
	if (delivered && !(await appendAssistantMessageToSessionTranscript({
		sessionKey,
		storePath,
		expectedSessionId: entry.sessionId,
		text: PENDING_DELIVERY_NOTICE,
		idempotencyKey
	})).ok) return;
	await updateSessionEntry({
		sessionKey,
		storePath
	}, (current) => current.sessionId === entry.sessionId && current.pendingDeliveryNotice?.intentId === notice.intentId && current.pendingDeliveryNotice.state !== "acknowledged" ? {
		pendingDeliveryNotice: {
			...current.pendingDeliveryNotice,
			state: delivered ? "acknowledged" : "unresolved"
		},
		updatedAt: Date.now()
	} : null, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
//#region src/channels/turn/execution.ts
const NO_ADDITIONAL_DELIVERY_SIGNALS = {};
const log = createSubsystemLogger("channels/turn/execution");
function emit(params) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		...params.event
	});
}
function clearPendingHistoryAfterTurn(params) {
	if (!params?.isGroup || !params.historyKey || !params.historyMap || params.limit === void 0) return;
	clearChannelHistoryIfEnabled({
		historyMap: params.historyMap,
		historyKey: params.historyKey,
		limit: params.limit
	});
}
function resolveObserveOnlyDispatchResult(params) {
	return params.observeOnlyDispatchResult ?? {
		queuedFinal: false,
		counts: EMPTY_CHANNEL_TURN_DISPATCH_COUNTS
	};
}
function resolveRecordSessionKey(params) {
	const explicitSessionKey = params.record?.sessionKey;
	if (explicitSessionKey === void 0) return params.ctxPayload.SessionKey ?? params.routeSessionKey;
	const normalizedSessionKey = explicitSessionKey.trim();
	if (!normalizedSessionKey) throw new Error("Channel turn record.sessionKey must be non-empty.");
	if (normalizedSessionKey !== explicitSessionKey) throw new Error("Channel turn record.sessionKey must not include surrounding whitespace.");
	return explicitSessionKey;
}
function maybeWarnZeroCountVisibleDispatch(params) {
	if (params.admission?.kind === "observeOnly" || params.ctxPayload.InternalTurnSource !== void 0) return;
	const dispatchResult = params.dispatchResult;
	if (dispatchResult?.deferredToActiveRun) return;
	if (hasVisibleChannelTurnDispatch(dispatchResult, NO_ADDITIONAL_DELIVERY_SIGNALS)) return;
	const processed = params.processedOutcome;
	const cause = processed ? `${processed.outcome}${processed.reason ? `:${processed.reason}` : ""}` : void 0;
	log.warn(`visible channel turn dispatched with no queued reply payloads: channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.ctxPayload.SessionKey ?? params.routeSessionKey} cause=${cause ?? "unknown"}`);
	emit({
		...params,
		event: {
			stage: "dispatch",
			event: "warning",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: params.admission?.kind ?? "dispatch",
			reason: "zero-count-visible-dispatch"
		}
	});
}
function resolveBotLoopProtectionDrop(params) {
	if (!params.botLoopProtection) return;
	if (!recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) return;
	const admission = {
		kind: "drop",
		reason: "bot-loop-protection"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
}
function resolveOutboundEchoDrop(params) {
	const conversationId = [params.ctxPayload.NativeChannelId, params.ctxPayload.ChatId].find((value) => typeof value === "string" && value.trim().length > 0);
	if (!conversationId) return;
	const matchedMessageId = [
		params.messageId,
		params.ctxPayload.MessageSidFull,
		params.ctxPayload.MessageSid
	].find((messageId) => typeof messageId === "string" && isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		messageId
	}));
	const sourceId = params.outboundEchoSourceId?.trim();
	const matchesSource = sourceId ? isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		sourceId
	}) : false;
	if (!matchedMessageId && !matchesSource) return;
	const admission = {
		kind: "drop",
		reason: "outbound-echo"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId ?? matchedMessageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
}
async function runPreparedChannelTurnCore(params, options) {
	const trace = createDiagnosticTraceContextFromActiveScope();
	return await runWithDiagnosticTraceContext(trace, () => runPreparedChannelTurnCoreInTrace(params, options));
}
async function runPreparedChannelTurnCoreInTrace(params, options) {
	const admission = params.admission ?? { kind: "dispatch" };
	const outboundEchoDrop = resolveOutboundEchoDrop(params);
	if (outboundEchoDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("outboundEcho");
		return outboundEchoDrop;
	}
	const botLoopDrop = resolveBotLoopProtectionDrop(params);
	if (botLoopDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("botLoopProtection");
		return botLoopDrop;
	}
	try {
		const recordSessionKey = resolveRecordSessionKey(params);
		if (params.ctxPayload.SessionTranscriptContext) {
			const { mergeSessionTranscriptContext } = await import("./session-transcript-context.runtime-CvHEPBcS.js");
			await mergeSessionTranscriptContext({
				agentId: params.ctxPayload.AgentId,
				ctx: params.ctxPayload,
				sessionKey: recordSessionKey,
				storePath: params.storePath
			});
		}
		emit({
			...params,
			event: {
				stage: "record",
				event: "start",
				messageId: params.messageId,
				sessionKey: recordSessionKey,
				admission: admission.kind
			}
		});
		try {
			await params.recordInboundSession({
				storePath: params.storePath,
				sessionKey: recordSessionKey,
				ctx: params.ctxPayload,
				groupResolution: params.record?.groupResolution,
				createIfMissing: params.record?.createIfMissing,
				updateLastRoute: params.record?.updateLastRoute,
				onRecordError: params.record?.onRecordError ?? (() => void 0),
				trackSessionMetaTask: params.record?.trackSessionMetaTask
			});
			emit({
				...params,
				event: {
					stage: "record",
					event: "done",
					messageId: params.messageId,
					sessionKey: recordSessionKey,
					admission: admission.kind
				}
			});
			await params.afterRecord?.();
			await deliverPendingDeliveryNotice(recordSessionKey, params.storePath);
		} catch (err) {
			emit({
				...params,
				event: {
					stage: "record",
					event: "error",
					messageId: params.messageId,
					sessionKey: recordSessionKey,
					admission: admission.kind,
					error: err
				}
			});
			try {
				await params.onPreDispatchFailure?.(err);
			} catch {}
			throw err;
		}
		emit({
			...params,
			event: {
				stage: "dispatch",
				event: "start",
				messageId: params.messageId,
				sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
				admission: admission.kind
			}
		});
		let dispatchResult;
		try {
			if (admission.kind === "observeOnly" && !options.suppressObserveOnlyDispatch) await params.runDispatch();
			else if (admission.kind === "observeOnly") await params.runDispatchLifecycle?.onDispatchSkipped("observeOnly");
			let processedOutcome;
			if (admission.kind === "observeOnly") dispatchResult = resolveObserveOnlyDispatchResult(params);
			else ({result: dispatchResult, processedOutcome} = await withDispatchProcessedOutcomeSink(() => params.runDispatch()));
			maybeWarnZeroCountVisibleDispatch({
				...params,
				admission,
				dispatchResult,
				processedOutcome
			});
		} catch (err) {
			emit({
				...params,
				event: {
					stage: "dispatch",
					event: "error",
					messageId: params.messageId,
					sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
					admission: admission.kind,
					error: err
				}
			});
			throw err;
		}
		emit({
			...params,
			event: {
				stage: "dispatch",
				event: "done",
				messageId: params.messageId,
				sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
				admission: admission.kind
			}
		});
		return {
			admission,
			dispatched: true,
			ctxPayload: params.ctxPayload,
			routeSessionKey: params.routeSessionKey,
			dispatchResult
		};
	} finally {
		clearPendingHistoryAfterTurn(params.history);
	}
}
async function runPreparedChannelTurn(params) {
	return await runPreparedChannelTurnCore(params, { suppressObserveOnlyDispatch: true });
}
//#endregion
export { runPreparedChannelTurnCore as n, runPreparedChannelTurn as t };
