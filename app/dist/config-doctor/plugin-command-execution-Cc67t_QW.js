import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-DmdlcXls.js";
import { i as normalizeMainKey } from "./session-key-C0UQClgw.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-cXJW6Bip.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import { t as createDedupeCache } from "./dedupe-VrMVVK8W.js";
import { d as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-Gf2mwIhw.js";
import "./registry-CGwRo5Hv.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-llHP5sCP.js";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { l as stringifyRouteThreadId } from "./channel-route-CdiTAb2z.js";
import { V as withPluginCommandExecution } from "./runtime-B980B6n3.js";
import { n as isTrustedReservedCommandOwner, t as canExposeSenderIsOwner } from "./command-registry-state-BRCmV3-5.js";
import { t as isReservedCommandName } from "./command-registration-v58T8CAu.js";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-DThej3BM.js";
import { i as normalizeConversationTargetRef, n as buildChannelAccountKey } from "./current-conversation-binding-row-YDf7pu-e.js";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-plXMUrbM.js";
import { t as getSessionBindingService } from "./session-binding-service-CEhxAzP2.js";
import { t as pluginCommandSupportsChannel } from "./plugin-command-metadata-jSFxBwiS.js";
import crypto from "node:crypto";
//#region src/agents/session-agent-binding.ts
/**
* Session-to-agent binding resolver.
*
* Derives the trusted active agent from explicit agent ids, agent session keys, or configured main-session aliases.
*/
/**
* Resolve the trusted active agent bound to a host-owned session reference.
*/
function resolveBoundAgentIdForSession(params) {
	const config = params.config ?? {};
	const agentId = normalizeOptionalString(params.agentId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!agentId && !sessionKey) return;
	if (agentId) return resolveSessionAgentId({
		config,
		sessionKey,
		agentId
	});
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
	const loweredSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	const mainKey = normalizeMainKey(config.session?.mainKey);
	return Boolean(parseAgentSessionKey(sessionKey)?.agentId) || persistedOwner.kind !== "none" || loweredSessionKey === "main" || loweredSessionKey === mainKey ? resolveSessionAgentId({
		config,
		sessionKey
	}) : void 0;
}
//#endregion
//#region src/infra/outbound/conversation-id.ts
function resolveExplicitConversationTargetId(target) {
	for (const prefix of [
		"channel:",
		"conversation:",
		"group:",
		"room:",
		"dm:"
	]) if (normalizeLowercaseStringOrEmpty(target).startsWith(prefix)) return normalizeOptionalString(target.slice(prefix.length));
}
/**
* Chooses the best conversation id from an explicit thread id or outbound targets.
*/
function resolveConversationIdFromTargets(params) {
	const threadId = stringifyRouteThreadId(params.threadId);
	if (threadId) return threadId;
	for (const rawTarget of params.targets) {
		const target = normalizeOptionalString(rawTarget);
		if (!target) continue;
		const explicitConversationId = resolveExplicitConversationTargetId(target);
		if (explicitConversationId) return explicitConversationId;
		if (target.includes(":") && explicitConversationId === void 0) continue;
		const mentionMatch = target.match(/^<#(\d+)>$/);
		if (mentionMatch?.[1]) return mentionMatch[1];
		if (/^\d{6,}$/.test(target)) return target;
	}
}
//#endregion
//#region src/channels/plugins/thread-binding-api.ts
/**
* Bundled channel thread-binding public artifact loader.
*
* Reads lightweight thread placement and inbound conversation hooks without full plugin loading.
*/
function loadBundledChannelThreadBindingApi(channelId) {
	return loadOptionalBundledChannelPublicArtifact({
		channelId,
		artifactBasename: "thread-binding-api.js"
	});
}
function normalizeThreadBindingPlacement(value) {
	const normalized = normalizeOptionalString(typeof value === "string" ? value : void 0);
	return normalized === "current" || normalized === "child" ? normalized : void 0;
}
/**
* Resolves the default top-level thread-binding placement for a bundled channel.
*/
function resolveBundledChannelThreadBindingDefaultPlacement(channelId) {
	return normalizeThreadBindingPlacement(loadBundledChannelThreadBindingApi(channelId)?.defaultTopLevelPlacement);
}
/**
* Resolves inbound conversation refs from a bundled channel thread-binding artifact.
*/
function resolveBundledChannelThreadBindingInboundConversation(params) {
	const api = loadBundledChannelThreadBindingApi(params.channelId);
	if (typeof api?.resolveInboundConversation !== "function") return;
	return api.resolveInboundConversation({
		from: params.from,
		to: params.to,
		conversationId: params.conversationId,
		threadId: params.threadId,
		threadParentId: params.threadParentId,
		isGroup: params.isGroup
	});
}
//#endregion
//#region src/channels/conversation-resolution.ts
/**
* Canonical conversation resolution for command and inbound channel flows.
* This module turns channel targets, thread ids, aliases, and plugin hooks into stable binding ids.
*/
const CANONICAL_TARGET_PREFIXES = ["user:", "spaces/"];
function resolveChannelId(raw) {
	const normalizedRaw = normalizeOptionalString(raw);
	if (!normalizedRaw) return null;
	return normalizeAnyChannelId(normalizedRaw) ?? normalizeOptionalLowercaseString(normalizedRaw) ?? null;
}
function shouldDefaultParentConversationToSelf(plugin) {
	return plugin?.bindings?.selfParentConversationByDefault === true;
}
function normalizeResolutionTarget(params) {
	const conversationId = normalizeOptionalString(params.conversation?.conversationId);
	if (!conversationId) return null;
	const parentConversationId = normalizeOptionalString(params.conversation?.parentConversationId);
	const defaultParentToSelf = shouldDefaultParentConversationToSelf(params.plugin) && !params.threadId && !parentConversationId;
	const normalized = normalizeConversationTargetRef({
		conversationId,
		parentConversationId: defaultParentToSelf ? conversationId : parentConversationId
	});
	const normalizedParentConversationId = defaultParentToSelf ? normalized.conversationId : normalized.parentConversationId;
	return {
		channel: params.channel,
		accountId: params.accountId,
		conversationId: normalized.conversationId,
		...normalizedParentConversationId ? { parentConversationId: normalizedParentConversationId } : {},
		...params.threadId ? { threadId: params.threadId } : {}
	};
}
function resolveBindingAccountId(params) {
	return normalizeOptionalString(params.rawAccountId) || normalizeOptionalString(params.plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
function resolveFallbackConversationTargetId(params) {
	const { allowNumericTopicShorthand = false } = params;
	const target = normalizeOptionalString(params.rawTarget);
	if (!target) return;
	const withoutKind = stripOutboundTargetKindPrefix(target);
	const withoutTopic = params.preserveExplicitTopicSuffix && /:topic:/iu.test(withoutKind) ? withoutKind : stripTargetTopicSuffix(withoutKind, { allowNumericShorthand: allowNumericTopicShorthand });
	return resolveConversationIdFromTargets({ targets: [withoutTopic] }) ?? (withoutTopic !== target ? withoutTopic : void 0) ?? resolveConversationIdFromTargets({ targets: [target] });
}
function resolveChannelTargetId(params) {
	const target = normalizeOptionalString(params.target);
	if (!target) return;
	const messaging = params.plugin?.messaging;
	const lower = normalizeLowercaseStringOrEmpty(target);
	const channelPrefix = `${params.channel}:`;
	if (lower.startsWith(channelPrefix)) return resolveChannelTargetId({
		...params,
		target: target.slice(channelPrefix.length)
	});
	if (CANONICAL_TARGET_PREFIXES.some((prefix) => lower.startsWith(prefix))) return target;
	const prefixedChannel = resolveTargetPrefixedChannel(target);
	if (!prefixedChannel || prefixedChannel !== params.channel) {
		const explicitConversationId = resolveFallbackConversationTargetId({
			rawTarget: target,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		});
		if (explicitConversationId) return explicitConversationId;
	}
	const normalizedTarget = normalizeOptionalString(messaging?.normalizeTarget?.(target));
	if (normalizedTarget) {
		const withoutProvider = stripTargetProviderPrefix(normalizedTarget, params.channel);
		return resolveFallbackConversationTargetId({
			rawTarget: withoutProvider,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		}) || withoutProvider || normalizedTarget;
	}
	return target;
}
function buildThreadingContext(params) {
	const to = normalizeOptionalString(params.originatingTo) ?? normalizeOptionalString(params.fallbackTo);
	return {
		...to ? { To: to } : {},
		...params.from ? { From: params.from } : {},
		...params.chatType ? { ChatType: params.chatType } : {},
		...params.threadId ? { MessageThreadId: params.threadId } : {},
		...params.nativeChannelId ? { NativeChannelId: params.nativeChannelId } : {}
	};
}
/**
* Resolves whether top-level bindings default to the current conversation or a child thread.
*/
function resolveChannelDefaultBindingPlacement(rawChannel) {
	const channel = resolveChannelId(rawChannel);
	if (!channel) return;
	return getLoadedChannelPluginForRead(channel)?.conversationBindings?.defaultTopLevelPlacement ?? resolveBundledChannelThreadBindingDefaultPlacement(channel);
}
/** Explicit spawn discovery is separate from automatic command placement. */
function supportsThreadBindingSpawn(rawChannel) {
	const channel = resolveChannelId(rawChannel);
	if (!channel) return false;
	const placement = resolveChannelDefaultBindingPlacement(channel);
	return placement === "child" || placement === "current" && getLoadedChannelPluginForRead(channel)?.conversationBindings?.supportsCurrentConversationBinding === true;
}
/**
* Resolves command context into a canonical channel/account/conversation tuple.
*/
function resolveCommandConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = params.plugin ?? getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const commandParams = {
		accountId,
		threadId,
		threadParentId: normalizeOptionalString(params.threadParentId),
		senderId: normalizeOptionalString(params.senderId),
		sessionKey: normalizeOptionalString(params.sessionKey),
		parentSessionKey: normalizeOptionalString(params.parentSessionKey),
		from: normalizeOptionalString(params.from),
		chatType: normalizeOptionalString(params.chatType),
		originatingTo: params.originatingTo ?? void 0,
		commandTo: params.commandTo ?? void 0,
		fallbackTo: params.fallbackTo ?? void 0
	};
	const resolvedByProvider = plugin?.bindings?.resolveCommandConversation?.(commandParams);
	const providerResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: resolvedByProvider,
		threadId,
		plugin
	});
	if (providerResolution) return providerResolution;
	const focusedBinding = plugin?.threading?.resolveFocusedBinding?.({
		cfg: params.cfg,
		accountId,
		context: buildThreadingContext({
			fallbackTo: params.fallbackTo ?? void 0,
			originatingTo: params.originatingTo ?? void 0,
			threadId,
			from: normalizeOptionalString(params.from),
			chatType: normalizeOptionalString(params.chatType),
			nativeChannelId: normalizeOptionalString(params.nativeChannelId)
		})
	});
	const focusedResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: focusedBinding,
		threadId,
		plugin
	});
	if (focusedResolution) return focusedResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target
	});
	const baseConversationId = resolveTarget(params.originatingTo) ?? resolveTarget(params.commandTo) ?? resolveTarget(params.fallbackTo);
	const parentConversationId = resolveTarget(params.threadParentId) ?? (threadId && baseConversationId && baseConversationId !== threadId ? baseConversationId : void 0);
	const conversationId = threadId || baseConversationId;
	if (!conversationId) return null;
	return normalizeResolutionTarget({
		channel,
		accountId,
		conversation: {
			conversationId,
			parentConversationId
		},
		threadId,
		plugin
	});
}
/**
* Resolves inbound message context into the canonical binding conversation tuple.
*/
function resolveInboundConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const resolverParams = {
		from: normalizeOptionalString(params.from),
		to: normalizeOptionalString(params.to),
		conversationId: normalizeOptionalString(params.conversationId) ?? normalizeOptionalString(params.groupId) ?? normalizeOptionalString(params.to),
		threadId,
		threadParentId: stringifyRouteThreadId(params.threadParentId),
		isGroup: params.isGroup ?? true
	};
	const providerConversation = plugin?.messaging?.resolveInboundConversation?.(resolverParams);
	const providerResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: providerConversation,
		threadId,
		plugin
	});
	if (providerResolution || providerConversation === null) return providerResolution;
	const artifactConversation = resolveBundledChannelThreadBindingInboundConversation({
		channelId: channel,
		...resolverParams
	});
	const artifactResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: artifactConversation,
		threadId,
		plugin
	});
	if (artifactResolution || artifactConversation === null) return artifactResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target,
		preserveExplicitTopicSuffix: threadId == null
	});
	const parentConversationId = resolveTarget(params.threadParentId == null ? void 0 : String(params.threadParentId)) ?? resolveTarget(params.to) ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId);
	const genericConversationId = threadId ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId) ?? parentConversationId;
	if (!genericConversationId) return null;
	return normalizeResolutionTarget({
		channel,
		accountId,
		conversation: {
			conversationId: genericConversationId,
			parentConversationId: threadId != null ? parentConversationId : void 0
		},
		threadId,
		plugin
	});
}
//#endregion
//#region src/plugins/conversation-binding-metadata.ts
function isPluginOwnedBindingMetadata(metadata) {
	if (!metadata || typeof metadata !== "object") return false;
	const record = metadata;
	return record.pluginBindingOwner === "plugin" && typeof record.pluginId === "string" && typeof record.pluginRoot === "string";
}
function isPluginOwnedSessionBindingRecord(record) {
	return isPluginOwnedBindingMetadata(record?.metadata);
}
//#endregion
//#region src/plugins/conversation-binding-pending.ts
const PENDING_PLUGIN_BINDING_REQUEST_TTL_MS = 18e5;
const MAX_PENDING_PLUGIN_BINDING_REQUESTS = 512;
const pendingRequests = resolveGlobalMap(Symbol.for("testclaw.pluginBindingPendingRequests"), (requests) => {
	for (const entry of requests.values()) clearTimeout(entry.timeoutId);
	requests.clear();
});
function removePendingPluginBindingRequest(approvalId, expected) {
	const entry = pendingRequests.get(approvalId);
	if (!entry || expected && entry !== expected) return;
	pendingRequests.delete(approvalId);
	clearTimeout(entry.timeoutId);
}
function addPendingPluginBindingRequest(request) {
	const entry = {
		request,
		expiresAtMs: Date.now() + PENDING_PLUGIN_BINDING_REQUEST_TTL_MS,
		timeoutId: setTimeout(() => {
			removePendingPluginBindingRequest(request.id, entry);
		}, PENDING_PLUGIN_BINDING_REQUEST_TTL_MS)
	};
	entry.timeoutId.unref?.();
	pendingRequests.set(request.id, entry);
	while (pendingRequests.size > MAX_PENDING_PLUGIN_BINDING_REQUESTS) {
		const oldestId = pendingRequests.keys().next().value;
		if (oldestId === void 0) break;
		removePendingPluginBindingRequest(oldestId);
	}
}
//#endregion
//#region src/plugins/conversation-binding-session-key.ts
const PLUGIN_BINDING_SESSION_PREFIX = "plugin-binding";
function normalizeChannel(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function buildPluginBindingSessionKey(params) {
	const hash = crypto.createHash("sha256").update(JSON.stringify({
		pluginId: params.pluginId,
		channel: normalizeChannel(params.channel),
		accountId: params.accountId,
		conversationId: params.conversationId
	})).digest("hex").slice(0, 24);
	return `${PLUGIN_BINDING_SESSION_PREFIX}:${params.pluginId}:${hash}`;
}
//#endregion
//#region src/plugins/conversation-binding-state.ts
const log$1 = createSubsystemLogger("plugins/binding");
const pluginBindingGlobalState = resolveGlobalSingleton(Symbol.for("testclaw.plugins.binding.global-state"), () => ({
	fallbackNoticeBindingIds: createDedupeCache({
		ttlMs: 0,
		maxSize: 4096
	}),
	approvalsCache: null,
	operations: /* @__PURE__ */ new Set(),
	generation: 0
}), (state) => {
	if (state.resetting) return state.resetting;
	state.generation++;
	const clear = () => {
		state.fallbackNoticeBindingIds.clear();
		state.approvalsCache = null;
	};
	if (!state.operations.size && !state.approvalTail) {
		clear();
		return;
	}
	state.resetting = Promise.allSettled([...state.operations, ...state.approvalTail ? [state.approvalTail] : []]).then(() => {
		clear();
		state.resetting = void 0;
	});
	return state.resetting;
});
async function withPluginBindingApprovalOperation(run) {
	const state = pluginBindingGlobalState;
	const generation = state.generation;
	const assertCurrent = () => {
		if (state.resetting || state.generation !== generation) throw new Error("Plugin conversation binding operation closed. Retry the bind request.");
	};
	assertCurrent();
	let release;
	const retained = new Promise((resolve) => {
		release = resolve;
	});
	state.operations.add(retained);
	try {
		return await run(assertCurrent);
	} finally {
		state.operations.delete(retained);
		release();
	}
}
function buildApprovalScopeKey(params) {
	return [
		params.pluginRoot,
		normalizeChannel(params.channel),
		params.accountId.trim() || "default"
	].join("::");
}
function serializeApprovalOperation(run) {
	const state = pluginBindingGlobalState;
	const operation = (state.approvalTail ?? Promise.resolve()).then(run);
	const tail = operation.then(() => {}, () => {});
	state.approvalTail = tail;
	tail.then(() => {
		if (state.approvalTail === tail) state.approvalTail = void 0;
	});
	return operation;
}
async function getApprovals(context) {
	if (pluginBindingGlobalState.approvalsCache) return pluginBindingGlobalState.approvalsCache;
	let approvals;
	try {
		const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
		approvals = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type: "plugins.conversationBindingApprovals.read",
			input: void 0
		}));
	} catch (error) {
		log$1.warn(`plugin binding approvals load failed: ${String(error)}`);
		approvals = [];
	}
	return pluginBindingGlobalState.approvalsCache = { approvals };
}
function hasPersistentApproval(params) {
	const key = buildApprovalScopeKey(params);
	const context = captureAssistantStateWorkerContext();
	return serializeApprovalOperation(async () => (await getApprovals(context)).approvals.some((entry) => buildApprovalScopeKey(entry) === key));
}
//#endregion
//#region src/plugins/conversation-binding.ts
const log = createSubsystemLogger("plugins/binding");
const PLUGIN_BINDING_CUSTOM_ID_PREFIX = "pluginbind";
const LEGACY_CODEX_PLUGIN_SESSION_PREFIXES = ["testclaw-app-server:thread:", "testclaw-codex-app-server:thread:"];
function normalizeConversation(params) {
	return {
		channel: normalizeChannel(params.channel),
		accountId: params.accountId.trim() || "default",
		conversationId: params.conversationId.trim(),
		parentConversationId: normalizeOptionalString(params.parentConversationId),
		threadId: typeof params.threadId === "number" ? Math.trunc(params.threadId) : normalizeOptionalString(params.threadId?.toString())
	};
}
function normalizeBindingData(data) {
	if (!data || typeof data !== "object" || Array.isArray(data)) return;
	return { ...data };
}
function toConversationRef(params) {
	const normalized = normalizeConversation(params);
	const channelId = normalizeChannelId(normalized.channel);
	const resolvedConversationRef = channelId ? getChannelPlugin(channelId)?.conversationBindings?.resolveConversationRef?.({
		accountId: normalized.accountId,
		conversationId: normalized.conversationId,
		parentConversationId: normalized.parentConversationId,
		threadId: normalized.threadId
	}) : null;
	if (resolvedConversationRef?.conversationId?.trim()) return {
		channel: normalized.channel,
		accountId: normalized.accountId,
		conversationId: resolvedConversationRef.conversationId.trim(),
		...resolvedConversationRef.parentConversationId?.trim() ? { parentConversationId: resolvedConversationRef.parentConversationId.trim() } : {}
	};
	return {
		channel: normalized.channel,
		accountId: normalized.accountId,
		conversationId: normalized.conversationId,
		...normalized.parentConversationId ? { parentConversationId: normalized.parentConversationId } : {}
	};
}
function logPluginBindingLifecycleEvent(params) {
	const parts = [
		`plugin binding ${params.event}`,
		`plugin=${params.identity.pluginId}`,
		`root=${params.identity.pluginRoot}`,
		...params.decision ? [`decision=${params.decision}`] : [],
		`channel=${params.conversation.channel}`,
		`account=${params.conversation.accountId}`,
		`conversation=${params.conversation.conversationId}`
	];
	log.info(parts.join(" "));
}
function isLegacyPluginBindingRecord(params) {
	if (!params.record || isPluginOwnedBindingMetadata(params.record.metadata)) return false;
	const targetSessionKey = params.record.targetSessionKey.trim();
	return targetSessionKey.startsWith(`plugin-binding:`) || LEGACY_CODEX_PLUGIN_SESSION_PREFIXES.some((prefix) => targetSessionKey.startsWith(prefix));
}
function buildApprovalInteractiveReply(approvalId) {
	return { blocks: [{
		type: "buttons",
		buttons: [
			{
				label: "Allow once",
				value: buildPluginBindingApprovalCustomId(approvalId, "allow-once"),
				style: "success"
			},
			{
				label: "Always allow",
				value: buildPluginBindingApprovalCustomId(approvalId, "allow-always"),
				style: "primary"
			},
			{
				label: "Deny",
				value: buildPluginBindingApprovalCustomId(approvalId, "deny"),
				style: "danger"
			}
		]
	}] };
}
function createApprovalRequestId() {
	return crypto.randomBytes(9).toString("base64url");
}
function buildBindingMetadata(params) {
	return {
		pluginBindingOwner: "plugin",
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		pluginRoot: params.pluginRoot,
		summary: normalizeOptionalString(params.summary),
		detachHint: normalizeOptionalString(params.detachHint),
		data: normalizeBindingData(params.data),
		bindingAttemptId: normalizeOptionalString(params.bindingAttemptId)
	};
}
function toPluginConversationBinding(record) {
	if (!record || !isPluginOwnedBindingMetadata(record.metadata)) return null;
	const metadata = record.metadata;
	return {
		bindingId: record.bindingId,
		pluginId: metadata.pluginId,
		pluginName: metadata.pluginName,
		pluginRoot: metadata.pluginRoot,
		channel: record.conversation.channel,
		accountId: record.conversation.accountId,
		conversationId: record.conversation.conversationId,
		parentConversationId: record.conversation.parentConversationId,
		boundAt: record.boundAt,
		summary: metadata.summary,
		detachHint: metadata.detachHint,
		data: metadata.data
	};
}
function withConversationBindingContext(binding, conversation) {
	return {
		...binding,
		parentConversationId: conversation.parentConversationId,
		threadId: conversation.threadId
	};
}
function resolvePluginConversationBindingState(conversation) {
	const ref = toConversationRef(conversation);
	const record = getSessionBindingService().resolveByConversation(ref);
	return {
		ref,
		record,
		binding: toPluginConversationBinding(record),
		isLegacyForeignBinding: isLegacyPluginBindingRecord({ record })
	};
}
function resolveOwnedPluginConversationBinding(params) {
	const state = resolvePluginConversationBindingState(params.conversation);
	if (!state.binding || state.binding.pluginRoot !== params.pluginRoot) return null;
	return withConversationBindingContext(state.binding, params.conversation);
}
async function bindConversationNow(params) {
	const assertCurrent = params.assertCurrent;
	const ref = toConversationRef(params.conversation);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey) ?? buildPluginBindingSessionKey({
		pluginId: params.identity.pluginId,
		channel: ref.channel,
		accountId: ref.accountId,
		conversationId: ref.conversationId
	});
	const binding = toPluginConversationBinding(await getSessionBindingService().bind({
		targetSessionKey,
		targetKind: "session",
		conversation: ref,
		placement: "current",
		...assertCurrent ? { assertCurrent } : {},
		metadata: buildBindingMetadata({
			pluginId: params.identity.pluginId,
			pluginName: params.identity.pluginName,
			pluginRoot: params.identity.pluginRoot,
			summary: params.summary,
			detachHint: params.detachHint,
			data: params.data,
			bindingAttemptId: params.bindingAttemptId
		})
	}));
	if (!binding) throw new Error("plugin binding was created without plugin metadata");
	return withConversationBindingContext(binding, params.conversation);
}
function buildApprovalMessage(request) {
	const lines = [
		`Plugin bind approval required`,
		`Plugin: ${request.pluginName ?? request.pluginId}`,
		`Channel: ${request.conversation.channel}`,
		`Account: ${request.conversation.accountId}`
	];
	if (request.summary?.trim()) lines.push(`Request: ${request.summary.trim()}`);
	else lines.push("Request: Bind this conversation so future plain messages route to the plugin.");
	lines.push("Choose whether to allow this plugin to bind the current conversation.");
	return lines.join("\n");
}
function resolvePluginBindingDisplayName(binding) {
	return normalizeOptionalString(binding.pluginName) || binding.pluginId;
}
function buildDetachHintSuffix(detachHint) {
	const trimmed = detachHint?.trim();
	return trimmed ? ` To detach this conversation, use ${trimmed}.` : "";
}
function buildPluginBindingUnavailableText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} is not currently loaded. Routing this message to Assistant instead. If this started after an update, run "testclaw doctor --fix"; otherwise reinstall or enable the plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingDeclinedText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} did not handle this message. This conversation is still bound to that plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingErrorText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} hit an error handling this message. This conversation is still bound to that plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingFallbackNoticeKey(bindingId, scope) {
	const normalized = bindingId.trim();
	return normalized && scope ? JSON.stringify([buildChannelAccountKey(scope), normalized]) : normalized;
}
function hasShownPluginBindingFallbackNotice(bindingId, scope) {
	const normalized = buildPluginBindingFallbackNoticeKey(bindingId, scope);
	const cache = pluginBindingGlobalState.fallbackNoticeBindingIds;
	const shown = cache.peek(normalized);
	if (shown) cache.check(normalized);
	return shown;
}
function markPluginBindingFallbackNoticeShown(bindingId, scope) {
	pluginBindingGlobalState.fallbackNoticeBindingIds.check(buildPluginBindingFallbackNoticeKey(bindingId, scope));
}
function buildPendingReply(request) {
	return {
		text: buildApprovalMessage(request),
		interactive: buildApprovalInteractiveReply(request.id)
	};
}
function buildPluginBindingApprovalCustomId(approvalId, decision) {
	return `${PLUGIN_BINDING_CUSTOM_ID_PREFIX}:${encodeURIComponent(approvalId)}:${decision === "allow-once" ? "o" : decision === "allow-always" ? "a" : "d"}`;
}
function pluginBindingOwnershipConflict(state, pluginRoot) {
	if (state.record && !state.binding && !state.isLegacyForeignBinding) return "This conversation is already bound by core routing and cannot be claimed by a plugin.";
	if (state.binding && state.binding.pluginRoot !== pluginRoot) return `This conversation is already bound by plugin "${state.binding.pluginName ?? state.binding.pluginId}".`;
}
async function requestPluginConversationBinding(params) {
	const assertCallerCurrent = params.assertCurrent;
	const requestParams = {
		...params,
		binding: params.binding ? {
			...params.binding,
			data: normalizeBindingData(params.binding.data)
		} : void 0
	};
	return await withPluginBindingApprovalOperation(async (assertCurrent) => {
		const assertBindingCurrent = () => {
			assertCurrent();
			assertCallerCurrent?.();
		};
		assertBindingCurrent();
		const conversation = normalizeConversation(requestParams.conversation);
		let state = resolvePluginConversationBindingState(conversation);
		const initialConflict = pluginBindingOwnershipConflict(state, requestParams.pluginRoot);
		if (initialConflict) return {
			status: "error",
			message: initialConflict
		};
		const approved = state.binding ? false : await hasPersistentApproval({
			pluginRoot: requestParams.pluginRoot,
			channel: state.ref.channel,
			accountId: state.ref.accountId
		});
		assertBindingCurrent();
		if (!state.binding) {
			state = resolvePluginConversationBindingState(conversation);
			const conflict = pluginBindingOwnershipConflict(state, requestParams.pluginRoot);
			if (conflict) return {
				status: "error",
				message: conflict
			};
		}
		if (state.isLegacyForeignBinding) logPluginBindingLifecycleEvent({
			event: "migrating legacy record",
			identity: requestParams,
			conversation: state.ref
		});
		if (state.binding || approved) {
			const bound = await bindConversationNow({
				identity: requestParams,
				conversation,
				summary: requestParams.binding?.summary,
				detachHint: requestParams.binding?.detachHint,
				data: requestParams.binding?.data,
				...assertCallerCurrent ? { assertCurrent: assertBindingCurrent } : {}
			});
			logPluginBindingLifecycleEvent({
				event: state.binding ? "auto-refresh" : "auto-approved",
				identity: requestParams,
				conversation: state.ref
			});
			return {
				status: "bound",
				binding: bound
			};
		}
		const request = {
			id: createApprovalRequestId(),
			pluginId: requestParams.pluginId,
			pluginName: requestParams.pluginName,
			pluginRoot: requestParams.pluginRoot,
			conversation,
			requestedBySenderId: normalizeOptionalString(requestParams.requestedBySenderId),
			summary: normalizeOptionalString(requestParams.binding?.summary),
			detachHint: normalizeOptionalString(requestParams.binding?.detachHint),
			data: normalizeBindingData(requestParams.binding?.data)
		};
		assertBindingCurrent();
		addPendingPluginBindingRequest(request);
		logPluginBindingLifecycleEvent({
			event: "requested",
			identity: requestParams,
			conversation: state.ref
		});
		return {
			status: "pending",
			approvalId: request.id,
			reply: buildPendingReply(request)
		};
	});
}
async function getCurrentPluginConversationBinding(params) {
	return resolveOwnedPluginConversationBinding(params);
}
async function detachPluginConversationBinding(params) {
	const binding = resolveOwnedPluginConversationBinding(params);
	if (!binding) return { removed: false };
	await getSessionBindingService().unbind({
		bindingId: binding.bindingId,
		reason: "plugin-detach",
		scope: binding
	});
	logPluginBindingLifecycleEvent({
		event: "detached",
		identity: binding,
		conversation: binding
	});
	return { removed: true };
}
//#endregion
//#region src/plugins/plugin-command-execution.ts
/** Exact-registry plugin command execution shared by focused and compatibility runtimes. */
const MAX_ARGS_LENGTH = 4096;
const blockedCompaction = (reason) => ({
	compacted: false,
	reason
});
function sanitizeArgs(args) {
	if (!args) return;
	let sanitized = "";
	for (const char of truncateUtf16Safe(args, MAX_ARGS_LENGTH)) {
		const code = char.charCodeAt(0);
		if (!(code <= 31 && code !== 9 && code !== 10 || code === 127)) sanitized += char;
	}
	return sanitized;
}
function resolveBindingConversation(params) {
	const channelPlugin = params.registry.channels.find((entry) => entry.plugin.id === params.channel)?.plugin;
	if (!channelPlugin?.bindings?.resolveCommandConversation) return null;
	return resolveCommandConversationResolution({
		cfg: params.config,
		plugin: channelPlugin,
		channel: params.channel,
		accountId: params.accountId,
		threadId: params.messageThreadId,
		threadParentId: params.threadParentId,
		senderId: params.senderId,
		originatingTo: params.originatingTo ?? params.from,
		commandTo: params.to,
		fallbackTo: params.to ?? params.from
	});
}
function buildRuntimeContext(command, params, invocationSignal, assertOwnerCurrent) {
	const sessionKey = params.sessionKey?.trim();
	const agentId = resolveBoundAgentIdForSession({
		config: params.config,
		agentId: params.agentId,
		sessionKey
	});
	const compactCurrent = params.runtimeContext?.compactCurrent;
	if (!sessionKey && !agentId) return;
	return {
		llm: { complete: async (request) => {
			const { createRuntimeLlm } = await import("./runtime-llm.runtime-Br0yeFy8.js");
			return await createRuntimeLlm({
				getConfig: () => params.config,
				authority: {
					caller: {
						kind: "plugin",
						id: command.pluginId,
						name: command.pluginName
					},
					pluginIdForPolicy: command.pluginId,
					requiresBoundAgent: true,
					...sessionKey ? { sessionKey } : {},
					...agentId ? { agentId } : {},
					...params.authProfileId ? { preferredProfile: params.authProfileId } : {},
					allowAgentIdOverride: false,
					allowModelOverride: false,
					allowComplete: true
				}
			}).complete(request);
		} },
		...compactCurrent && params.sessionTarget ? { compactCurrent: async () => {
			if (invocationSignal.aborted) return blockedCompaction("command invocation closed");
			return await compactCurrent(invocationSignal, assertOwnerCurrent);
		} } : {}
	};
}
async function executeRegisteredPluginCommand(registry, params) {
	const assertAdmittedOwner = params.assertOwnerCurrent;
	const { command, args, senderId, channel, isAuthorizedSender, commandBody, config } = params;
	if (!pluginCommandSupportsChannel(command, channel)) {
		logVerbose(`Plugin command /${command.name} skipped on unsupported channel ${channel}`);
		return { continueAgent: true };
	}
	if (command.requireAuth !== false && !isAuthorizedSender) {
		logVerbose(`Plugin command /${command.name} blocked: unauthorized sender ${senderId || "<unknown>"}`);
		return { text: "⚠️ This command requires authorization." };
	}
	if (command.requiredScopes !== void 0 && !Array.isArray(command.requiredScopes)) {
		logVerbose(`Plugin command /${command.name} blocked: invalid requiredScopes configuration`);
		return { text: "⚠️ This command has invalid gateway scope configuration." };
	}
	const requiredScopes = command.requiredScopes ?? [];
	if (requiredScopes.find((scope) => !isOperatorScope(scope))) {
		logVerbose(`Plugin command /${command.name} blocked: unknown gateway scope`);
		return { text: "⚠️ This command has invalid gateway scope configuration." };
	}
	if (requiredScopes.length > 0) {
		const scopes = Array.isArray(params.gatewayClientScopes) ? new Set(params.gatewayClientScopes) : void 0;
		const hasAdmin = scopes?.has(ADMIN_SCOPE) === true;
		const missingScope = scopes ? requiredScopes.find((scope) => !hasAdmin && !scopes.has(scope)) : requiredScopes[0];
		if (missingScope && (scopes !== void 0 || params.senderIsOwner !== true)) {
			logVerbose(`Plugin command /${command.name} blocked: missing gateway scope ${missingScope}`);
			return { text: `⚠️ This command requires gateway scope: ${missingScope}.` };
		}
	}
	const bindingConversation = resolveBindingConversation({
		registry,
		config,
		channel,
		senderId,
		from: params.from,
		to: params.to,
		originatingTo: params.originatingTo,
		accountId: params.accountId,
		messageThreadId: params.messageThreadId,
		threadParentId: params.threadParentId
	});
	const trustedReservedOwner = isTrustedReservedCommandOwner(command) && command.ownership === "reserved" && isReservedCommandName(command.name) && command.pluginId === normalizeLowercaseStringOrEmpty(command.name);
	const senderIsOwner = canExposeSenderIsOwner(command) || trustedReservedOwner ? params.senderIsOwner : void 0;
	const commandInvocationAbort = new AbortController();
	const assertOwnerCurrent = senderIsOwner === true ? () => {
		if (commandInvocationAbort.signal.aborted) throw new Error("Plugin command invocation closed.");
		assertAdmittedOwner?.();
	} : void 0;
	const ctx = {
		senderId,
		channel,
		channelId: params.channelId,
		isAuthorizedSender,
		...senderIsOwner === void 0 ? {} : { senderIsOwner },
		...assertOwnerCurrent ? { assertOwnerCurrent } : {},
		gatewayClientScopes: params.gatewayClientScopes,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		args: sanitizeArgs(args),
		commandBody,
		config,
		from: params.from,
		to: params.to,
		accountId: bindingConversation?.accountId ?? params.accountId,
		messageThreadId: params.messageThreadId,
		threadParentId: params.threadParentId,
		diagnosticsSessions: params.diagnosticsSessions,
		runtimeContext: buildRuntimeContext(command, params, commandInvocationAbort.signal, assertOwnerCurrent),
		...trustedReservedOwner && params.diagnosticsUploadApproved !== void 0 ? { diagnosticsUploadApproved: params.diagnosticsUploadApproved } : {},
		...trustedReservedOwner && params.diagnosticsPreviewOnly !== void 0 ? { diagnosticsPreviewOnly: params.diagnosticsPreviewOnly } : {},
		...trustedReservedOwner && params.diagnosticsPrivateRouted !== void 0 ? { diagnosticsPrivateRouted: params.diagnosticsPrivateRouted } : {},
		requestConversationBinding: async (bindingParams) => {
			if (!command.pluginRoot || !bindingConversation) return {
				status: "error",
				message: "This command cannot bind the current conversation."
			};
			return requestPluginConversationBinding({
				pluginId: command.pluginId,
				pluginName: command.pluginName,
				pluginRoot: command.pluginRoot,
				requestedBySenderId: senderId,
				conversation: bindingConversation,
				binding: bindingParams,
				assertCurrent: assertOwnerCurrent
			});
		},
		detachConversationBinding: async () => command.pluginRoot && bindingConversation ? detachPluginConversationBinding({
			pluginRoot: command.pluginRoot,
			conversation: bindingConversation
		}) : { removed: false },
		getCurrentConversationBinding: async () => command.pluginRoot && bindingConversation ? getCurrentPluginConversationBinding({
			pluginRoot: command.pluginRoot,
			conversation: bindingConversation
		}) : null
	};
	try {
		if (requiredScopes.length > 0 && !Array.isArray(params.gatewayClientScopes)) assertOwnerCurrent?.();
		const execution = await withPluginCommandExecution(registry, () => command.handler(ctx));
		if (!execution.admitted) return { text: "⚠️ This command is no longer available after the plugin registry changed. Please try again." };
		const result = execution.value;
		logVerbose(`Plugin command /${command.name} executed successfully for ${senderId || "unknown"}`);
		if (!result || typeof result !== "object") {
			logVerbose(`Plugin command /${command.name} returned no reply payload`);
			return {};
		}
		return result;
	} catch (error) {
		logVerbose(`Plugin command /${command.name} error: ${error.message}`);
		return { text: "⚠️ Command failed. Please try again later." };
	} finally {
		commandInvocationAbort.abort("command invocation closed");
	}
}
//#endregion
export { buildPluginBindingUnavailableText as a, toPluginConversationBinding as c, resolveChannelDefaultBindingPlacement as d, resolveCommandConversationResolution as f, resolveBoundAgentIdForSession as g, resolveConversationIdFromTargets as h, buildPluginBindingErrorText as i, isPluginOwnedBindingMetadata as l, supportsThreadBindingSpawn as m, bindConversationNow as n, hasShownPluginBindingFallbackNotice as o, resolveInboundConversationResolution as p, buildPluginBindingDeclinedText as r, markPluginBindingFallbackNoticeShown as s, executeRegisteredPluginCommand as t, isPluginOwnedSessionBindingRecord as u };
