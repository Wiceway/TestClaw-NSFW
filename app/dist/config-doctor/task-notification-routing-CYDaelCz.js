import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as normalizeChatType } from "./chat-type-VRUlDKAl.js";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-BKwSd1kN.js";
import { n as getLoadedChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-DQinGDrS.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-9H_XKKih.js";
import "./message-channel-iCC7oIhe.js";
import { s as withSystemEventOwner } from "./system-event-ownership-CyoXvClm.js";
import { n as enqueueSystemEvent, x as requestSessionEventWake } from "./system-events-BUr4KJmI.js";
import "./task-registry.store.kernel-Bnd9Ls7p.js";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.js";
import { d as getTaskFlowById } from "./task-flow-runtime-internal-CxdyhxyJ.js";
import { _ as taskDeliveryStates } from "./task-registry-state-D1tTILHR.js";
import { p as getTasksByRunId } from "./task-registry.process-state-DBhKov6B.js";
import { i as resolveTaskSessionAgentId } from "./task-registry-read-BjHX4Kh8.js";
import { a as formatTaskStatusTitleText, c as sanitizeTaskStatusText, r as formatTaskStatusDetail } from "./task-status-BLVYcOWO.js";
import { p as isProgressCardRefreshInputProvenance } from "./input-provenance-DGaz_sh7.js";
import { c as resolveCommandTurnContext, i as isExplicitCommandTurn, s as resolveCommandBody } from "./command-turn-context-CmPEYNmV.js";
import { n as isControlCommandMessage } from "./command-detection-B0wcgFdq.js";
//#region src/tasks/task-executor-policy.ts
function resolveTaskDisplayTitle(task) {
	return formatTaskStatusTitleText(task.label?.trim() || (task.runtime === "acp" ? "ACP background task" : task.runtime === "subagent" ? "Subagent task" : task.task.trim() || "Background task"));
}
function resolveTaskRunLabel(task) {
	return task.runId ? ` (run ${task.runId.slice(0, 8)})` : "";
}
function formatTaskTerminalMessage(task, options = {}) {
	const title = resolveTaskDisplayTitle(task);
	const runLabel = resolveTaskRunLabel(task);
	if (task.status === "succeeded") {
		const isBlocked = task.terminalOutcome === "blocked";
		const summary = sanitizeTaskStatusText(task.terminalSummary, {
			errorContext: isBlocked,
			maxChars: isBlocked ? 120 : void 0
		});
		if (isBlocked) return summary ? `Background task blocked: ${title}${runLabel}. ${summary}` : `Background task blocked: ${title}${runLabel}.`;
		if (options.surface === "parent_session") {
			const reviewNext = "Next: parent will review/verify before calling it done.";
			return summary ? `Background task ready for review: ${title}${runLabel}. ${summary} ${reviewNext}` : `Background task ready for review: ${title}${runLabel}. ${reviewNext}`;
		}
		return summary ? `Background task done: ${title}${runLabel}. ${summary}` : `Background task done: ${title}${runLabel}.`;
	}
	if (task.status === "timed_out") return `Background task timed out: ${title}${runLabel}.`;
	if (task.status === "cancelled") {
		if (task.runtime === "subagent") return `Background task cancellation requested: ${title}${runLabel}.`;
		return `Background task cancelled: ${title}${runLabel}.`;
	}
	const detail = formatTaskStatusDetail(task);
	if (task.status === "lost") return `Background task lost: ${title}${runLabel}. ${detail || "Backing session disappeared."}`;
	return detail ? `Background task failed: ${title}${runLabel}. ${detail}` : `Background task failed: ${title}${runLabel}.`;
}
function shouldUseParentReviewTaskTerminalMessage(task) {
	return task.runtime === "acp" && task.status === "succeeded" && task.terminalOutcome !== "blocked" && Boolean(task.childSessionKey?.trim());
}
function formatTaskBlockedFollowupMessage(task) {
	if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return null;
	return `Task needs follow-up: ${resolveTaskDisplayTitle(task)}${resolveTaskRunLabel(task)}. ${sanitizeTaskStatusText(task.terminalSummary, {
		errorContext: true,
		maxChars: 120
	}) || "Task is blocked and needs follow-up."}`;
}
function formatTaskStateChangeMessage(task, event) {
	const title = resolveTaskDisplayTitle(task);
	if (event.kind === "running") return `Background task started: ${title}.`;
	if (event.kind === "progress") {
		const summary = sanitizeTaskStatusText(event.summary);
		return summary ? `Background task update: ${title}. ${summary}` : null;
	}
	return null;
}
//#endregion
//#region src/tasks/task-notification-policy.ts
function shouldAutoDeliverTaskTerminalUpdate(task) {
	if (task.notifyPolicy === "silent") return false;
	if (task.runtime === "subagent" && task.status !== "cancelled") return false;
	if (task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.") return false;
	if (!isTerminalTaskStatus(task.status)) return false;
	return task.deliveryStatus === "pending";
}
function shouldAutoDeliverTaskStateChange(task) {
	return task.notifyPolicy === "state_changes" && task.deliveryStatus === "pending" && !isTerminalTaskStatus(task.status);
}
function shouldSuppressDuplicateTerminalDelivery(params) {
	if (!params.task.runId?.trim()) return false;
	if (!(params.task.runtime === "acp" || params.task.runtime === "subagent" && params.task.status === "cancelled")) return false;
	if (params.task.runtime === "subagent" && params.peerDeliveryCovered) return true;
	return Boolean(params.preferredTaskId && params.preferredTaskId !== params.task.taskId);
}
//#endregion
//#region src/agents/reply-completion.ts
/** Returns true when a lifecycle turn must not redefine session-stable reply policy. */
function isSyntheticSourceReplyTurn(params) {
	return params.isHeartbeat === true || params.inputProvenance?.kind === "inter_session" || params.inputProvenance?.kind === "internal_system";
}
/** Resolve legacy runtime inputs once; explicit host requiredness always wins. */
function resolveReplyExpectation(params) {
	return params.terminalReplyExpectation ?? (isSyntheticSourceReplyTurn(params) || (params.allowEmptyAssistantReplyAsSilent ?? (params.trigger !== void 0 && params.trigger !== "user" && params.trigger !== "manual")) ? "optional" : "required");
}
/** Reconcile host policy with output/custody facts, never with a model's silence request. */
function resolveReplyCompletion(expectation, evidence) {
	return expectation === "required" ? {
		expectation,
		outcome: evidence === "empty" ? "missing" : evidence
	} : {
		expectation,
		outcome: evidence === "empty" ? "silent" : evidence
	};
}
/** Failure to observe a send is not proof that it is safe to generate or send another reply. */
async function observeReplyDelivery(observer, minimumAssistantMessageIndex, onError) {
	try {
		return await observer?.(minimumAssistantMessageIndex) ?? "missing";
	} catch (error) {
		onError(error);
		return "pending";
	}
}
//#endregion
//#region src/shared/silent-reply-policy.ts
const DEFAULT_SILENT_REPLY_POLICY = {
	direct: "disallow",
	group: "disallow",
	internal: "allow"
};
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
function classifySilentReplyConversationType(params) {
	if (params.conversationType) return params.conversationType;
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (normalizedSessionKey.includes(":group:") || normalizedSessionKey.includes(":channel:")) return "group";
	if (normalizedSessionKey.includes(":direct:") || normalizedSessionKey.includes(":dm:")) return "direct";
	if (normalizeLowercaseStringOrEmpty(params.surface) === "webchat") return "direct";
	return "internal";
}
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
function resolveSilentReplyPolicyFromPolicies(params) {
	if (params.conversationType === "direct") return "disallow";
	return params.surfacePolicy?.[params.conversationType] ?? params.defaultPolicy?.[params.conversationType] ?? DEFAULT_SILENT_REPLY_POLICY[params.conversationType];
}
//#endregion
//#region src/config/silent-reply.ts
function resolveSilentReplyConversationContext(params) {
	const conversationType = classifySilentReplyConversationType({
		sessionKey: params.sessionKey,
		surface: params.surface,
		conversationType: params.conversationType
	});
	const normalizedSurface = normalizeLowercaseStringOrEmpty(params.surface);
	const surface = normalizedSurface ? params.cfg?.surfaces?.[normalizedSurface] : void 0;
	return {
		conversationType,
		defaultPolicy: params.cfg?.agents?.defaults?.silentReply,
		surfacePolicy: surface?.silentReply
	};
}
/** Resolves the effective silent-reply settings for a routed conversation. */
function resolveSilentReplySettings(params) {
	return { policy: resolveSilentReplyPolicyFromPolicies(resolveSilentReplyConversationContext(params)) };
}
//#endregion
//#region src/auto-reply/command-turn-detection.ts
/** Fallback command-turn detection for mixed native/text channel metadata. */
function resolveVisibleMessageBody(input) {
	if (typeof input.rawText === "string") return input.rawText;
	return normalizeOptionalString(input.RawBody) ?? normalizeOptionalString(input.Body);
}
function resolveStructuredNormalFallbackBody(input) {
	const visibleBody = resolveVisibleMessageBody(input);
	if (!/^[!/]/.test(visibleBody ?? "")) return;
	return resolveCommandBody(input) ?? visibleBody;
}
function hasCommandSourceMetadata(input) {
	return input.CommandSource === "native" || input.CommandSource === "text" || input.CommandSource === "message";
}
/** Returns true when inbound metadata or command text identifies an explicit command turn. */
function isExplicitCommandTurnContext(input, cfg) {
	if (isExplicitCommandTurn(resolveCommandTurnContext(input))) return true;
	if (input.CommandSource === "native" || input.CommandSource === "text") return false;
	const fallbackBody = input.CommandTurn !== void 0 || hasCommandSourceMetadata(input) ? resolveStructuredNormalFallbackBody(input) : resolveCommandBody(input);
	return input.CommandAuthorized === true && isControlCommandMessage(fallbackBody, cfg, { botUsername: normalizeOptionalString(input.BotUsername) });
}
//#endregion
//#region src/auto-reply/reply/source-reply-delivery-mode.ts
/** Source-reply visibility and suppression policy for auto-reply delivery. */
function toSessionStableDeliveryModeContext(ctx) {
	return {
		ChatType: ctx.ChatType,
		Provider: ctx.Provider,
		Surface: ctx.Surface,
		ExplicitDeliverRoute: ctx.ExplicitDeliverRoute
	};
}
/** Returns true when the turn explicitly invoked a source-visible command. */
function isExplicitSourceReplyCommand(ctx, cfg) {
	return isExplicitCommandTurnContext(ctx, cfg);
}
/** Returns true for text slash commands that lack authorization metadata. */
function isUnauthorizedTextSlashCommand(ctx) {
	const commandTurn = resolveCommandTurnContext(ctx);
	return commandTurn.kind === "text-slash" && !commandTurn.authorized && (commandTurn.commandName !== void 0 || commandTurn.body?.trim().startsWith("/") === true);
}
function isInternalRoomEvent(ctx) {
	return ctx.InboundEventKind === "room_event" && isInternalSourceReplyChannel(ctx);
}
/** Returns true for internal message-channel turns that should remain local. */
function isInternalSourceReplyChannel(ctx) {
	const providerChannel = normalizeMessageChannel(ctx.Provider);
	const surfaceChannel = normalizeMessageChannel(ctx.Surface);
	return (providerChannel ?? surfaceChannel) === "webchat" && (surfaceChannel === "webchat" || !surfaceChannel) && ctx.ExplicitDeliverRoute !== true;
}
/** Resolves whether normal final text should auto-deliver or require the message tool. */
function resolveSourceReplyDeliveryMode(params) {
	if (params.strictMessageToolOnly === true) return "message_tool_only";
	if (params.ctx.InboundEventKind === "room_event" && !isInternalRoomEvent(params.ctx)) return "message_tool_only";
	if (params.requested && (params.requested !== "message_tool_only" || params.messageToolAvailable !== false)) return params.requested;
	if (isExplicitSourceReplyCommand(params.ctx, params.cfg)) return "automatic";
	const chatType = normalizeChatType(params.ctx.ChatType);
	if ((chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(params.ctx)) return "message_tool_only";
	let mode;
	if (chatType === "group" || chatType === "channel") mode = (params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies) === "message_tool" ? "message_tool_only" : "automatic";
	else mode = (params.cfg.messages?.visibleReplies ?? (isInternalSourceReplyChannel(params.ctx) ? "automatic" : params.defaultVisibleReplies)) === "message_tool" ? "message_tool_only" : "automatic";
	if (mode === "message_tool_only" && params.messageToolAvailable === false) return "automatic";
	return mode;
}
/** Selects reply requiredness at admission, preserving configured ambient group silence. */
function resolveSourceReplyExpectation(params) {
	if (isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	})) return "optional";
	if (isExplicitSourceReplyCommand(params.ctx, params.cfg)) return "required";
	if (params.ctx.InboundEventKind === "room_event") return "optional";
	const chatType = normalizeChatType(params.ctx.ChatType);
	if (classifySilentReplyConversationType({
		conversationType: chatType === "group" || chatType === "channel" ? "group" : chatType,
		sessionKey: params.ctx.SessionKey,
		surface: params.ctx.Surface ?? params.ctx.Provider
	}) === "group" && params.ctx.WasMentioned !== true && resolveSilentReplySettings({
		cfg: params.cfg,
		surface: params.ctx.Surface ?? params.ctx.Provider,
		conversationType: "group"
	}).policy === "allow") return "optional";
	return "required";
}
/** Resolves source delivery, hooks, lifecycle, and typing suppression flags. */
function resolveSourceReplyVisibilityPolicy(params) {
	const sourceReplyDeliveryMode = resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: params.ctx,
		requested: params.requested,
		strictMessageToolOnly: params.strictMessageToolOnly,
		messageToolAvailable: params.messageToolAvailable,
		defaultVisibleReplies: params.defaultVisibleReplies
	});
	const sessionStableSourceReplyDeliveryMode = !isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	}) && (params.requested !== void 0 || isExplicitSourceReplyCommand(params.ctx, params.cfg)) ? sourceReplyDeliveryMode : resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: toSessionStableDeliveryModeContext(params.ctx),
		messageToolAvailable: params.sessionStableMessageToolAvailable ?? params.messageToolAvailable,
		defaultVisibleReplies: params.defaultVisibleReplies
	});
	const sendPolicyDenied = params.sendPolicy === "deny";
	const progressRefresh = isProgressCardRefreshInputProvenance(params.ctx.InputProvenance);
	const suppressAutomaticSourceDelivery = progressRefresh || sourceReplyDeliveryMode === "message_tool_only";
	const suppressDelivery = sendPolicyDenied || suppressAutomaticSourceDelivery;
	const deliverySuppressionReason = sendPolicyDenied ? "sendPolicy: deny" : progressRefresh ? "progress card refresh" : suppressAutomaticSourceDelivery ? "sourceReplyDeliveryMode: message_tool_only" : "";
	return {
		sourceReplyDeliveryMode,
		sessionStableSourceReplyDeliveryMode,
		sendPolicyDenied,
		suppressAutomaticSourceDelivery,
		suppressDelivery,
		suppressHookUserDelivery: params.suppressAcpChildUserDelivery === true || suppressDelivery,
		suppressHookReplyLifecycle: progressRefresh || sendPolicyDenied || params.suppressAcpChildUserDelivery === true || params.explicitSuppressTyping === true || params.shouldSuppressTyping === true,
		suppressTyping: progressRefresh || sendPolicyDenied || params.explicitSuppressTyping === true || params.shouldSuppressTyping === true,
		deliverySuppressionReason
	};
}
//#endregion
//#region src/auto-reply/reply/completion-delivery-policy.ts
function resolveCompletionChatType(params) {
	const explicit = normalizeChatType(params.requesterEntry?.chatType ?? sessionDeliveryOrigin(params.requesterEntry)?.chatType);
	if (explicit) return explicit;
	for (const key of [params.targetRequesterSessionKey, params.requesterSessionKey]) {
		const derived = deriveSessionChatTypeFromKey(key);
		if (derived !== "unknown") return derived;
	}
	return inferCompletionChatTypeFromTarget(params.directOrigin?.to ?? params.requesterSessionOrigin?.to);
}
function completionRequiresMessageToolDelivery(params) {
	return resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: { ChatType: resolveCompletionChatType(params) },
		messageToolAvailable: params.messageToolAvailable
	}) === "message_tool_only";
}
/** Resolve transport authority for a durable, fixed-route agent completion. */
function resolveDurableCompletionDeliveryMode(sourceReplyDeliveryMode) {
	return sourceReplyDeliveryMode === "message_tool_only" ? "host_owned" : "automatic";
}
function shouldRouteCompletionThroughRequesterSession(sessionKey) {
	const chatType = deriveSessionChatTypeFromKey(sessionKey);
	return chatType === "group" || chatType === "channel";
}
function inferCompletionChatTypeFromTarget(to) {
	const normalized = to?.trim().toLowerCase();
	if (!normalized) return "unknown";
	if (normalized.startsWith("group:")) return "group";
	if (normalized.startsWith("channel:") || normalized.startsWith("thread:")) return "channel";
	if (normalized.startsWith("dm:") || normalized.startsWith("direct:") || normalized.startsWith("user:")) return "direct";
	return "unknown";
}
//#endregion
//#region src/channels/thread-addressing.ts
/** Returns the loaded channel's threading adapter without bundled fallback discovery. */
function getLoadedChannelThreadingAdapter(channel) {
	if (!channel) return;
	return getLoadedChannelPlugin(channel)?.threading;
}
/** Resolves where a loaded channel transport keeps thread identity. */
function resolveChannelThreadAddressing(channel) {
	return getLoadedChannelThreadingAdapter(channel)?.threadAddressing ?? "address";
}
function channelSupportsThreadDelivery(channel) {
	if (!channel) return false;
	return getLoadedChannelPlugin(channel)?.capabilities.threads === true;
}
//#endregion
//#region src/tasks/task-notification-routing.ts
function getPeerTasksForDelivery(task) {
	if (!task.runId?.trim()) return [];
	return getTasksByRunId(task.runId).filter((candidate) => candidate.runtime === task.runtime && candidate.scopeKind === task.scopeKind && (normalizeOptionalString(candidate.ownerKey) ?? "") === (normalizeOptionalString(task.ownerKey) ?? "") && (normalizeOptionalString(candidate.childSessionKey) ?? "") === (normalizeOptionalString(task.childSessionKey) ?? ""));
}
function resolveTaskDeliveryOwner(task, readFlow = getTaskFlowById) {
	if (task.scopeKind !== "session") return {};
	const flowId = task.parentFlowId?.trim();
	const candidate = flowId ? readFlow(flowId) : void 0;
	const flow = candidate && normalizeOptionalString(candidate.ownerKey) === normalizeOptionalString(task.ownerKey) ? candidate : void 0;
	return {
		sessionKey: task.ownerKey.trim(),
		agentId: resolveTaskSessionAgentId(task.ownerKey, task.requesterAgentId),
		requesterOrigin: normalizeDeliveryContext(flow?.requesterOrigin ?? taskDeliveryStates.get(task.taskId)?.requesterOrigin),
		...flow ? { flowId: flow.flowId } : {}
	};
}
function canDeliverTaskToRequesterOrigin(owner) {
	if (shouldRouteCompletionThroughRequesterSession(owner.sessionKey)) return false;
	return canDeliverToRequesterOrigin(owner.requesterOrigin);
}
function canDeliverToRequesterOrigin(origin) {
	const channel = origin?.channel?.trim();
	const to = origin?.to?.trim();
	return Boolean(channel && to && isDeliverableMessageChannel(channel));
}
function canDeliverParentReviewTaskToThreadOrigin(task, owner) {
	if (!shouldUseParentReviewTaskTerminalMessage(task)) return false;
	const origin = owner.requesterOrigin;
	const threadId = String(origin?.threadId ?? "").trim();
	return Boolean(threadId && channelSupportsThreadDelivery(origin?.channel) && canDeliverToRequesterOrigin(origin));
}
function queueTaskSystemEvent(task, text, owner, source = "background-task") {
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	const options = {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}${source === "background-task-blocked" ? ":blocked-followup" : ""}`,
		deliveryContext: owner.requesterOrigin
	};
	enqueueSystemEvent(text, owner.agentId ? withSystemEventOwner(options, owner.agentId) : options);
	requestSessionEventWake({
		source,
		intent: "immediate",
		reason: source,
		sessionKey: ownerKey,
		agentId: owner.agentId
	});
	return true;
}
function queueBlockedTaskFollowup(task, owner) {
	const followupText = formatTaskBlockedFollowupMessage(task);
	if (!followupText) return false;
	return queueTaskSystemEvent(task, followupText, owner, "background-task-blocked");
}
function resolveTaskStateChangeIdempotencyKey(params) {
	if (params.owner.flowId) return `flow-event:${params.owner.flowId}:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
	return `task-event:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
}
function resolveTaskTerminalIdempotencyKey(task, owner) {
	const prefix = owner.flowId ? `flow-terminal:${owner.flowId}` : "task-terminal";
	const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
	return `${prefix}:${task.taskId}:${task.status}:${outcome}`;
}
//#endregion
export { formatTaskTerminalMessage as A, resolveReplyCompletion as C, shouldSuppressDuplicateTerminalDelivery as D, shouldAutoDeliverTaskTerminalUpdate as E, formatTaskBlockedFollowupMessage as O, observeReplyDelivery as S, shouldAutoDeliverTaskStateChange as T, resolveSourceReplyDeliveryMode as _, queueBlockedTaskFollowup as a, resolveSilentReplySettings as b, resolveTaskStateChangeIdempotencyKey as c, resolveChannelThreadAddressing as d, completionRequiresMessageToolDelivery as f, isUnauthorizedTextSlashCommand as g, isInternalSourceReplyChannel as h, getPeerTasksForDelivery as i, shouldUseParentReviewTaskTerminalMessage as j, formatTaskStateChangeMessage as k, resolveTaskTerminalIdempotencyKey as l, isExplicitSourceReplyCommand as m, canDeliverTaskToRequesterOrigin as n, queueTaskSystemEvent as o, resolveDurableCompletionDeliveryMode as p, canDeliverToRequesterOrigin as r, resolveTaskDeliveryOwner as s, canDeliverParentReviewTaskToThreadOrigin as t, getLoadedChannelThreadingAdapter as u, resolveSourceReplyExpectation as v, resolveReplyExpectation as w, isSyntheticSourceReplyTurn as x, resolveSourceReplyVisibilityPolicy as y };
