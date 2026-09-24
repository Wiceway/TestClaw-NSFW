import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { s as markInboundContextLabel } from "./strip-inbound-meta-Bb3_IiBS.js";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-B2GL8yVx.js";
import { _ as stripLegacyMediaContextFields, d as readPersistedMediaFacts, p as readRuntimePromptMediaFacts } from "./media-facts-CfqEsuNX.js";
import { n as extractAssistantTextForPhase } from "./chat-message-content-CmXfSSBe.js";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-C3K3M4jZ.js";
import { i as generateSecureToken } from "./secure-random-D2trnoZY.js";
import { r as formatContextJsonBlock } from "./channel-prompt-context-BgpVDndp.js";
import { c as hasInterSessionUserProvenance, n as INTER_SESSION_PROMPT_PREFIX_BASE } from "./input-provenance-DGaz_sh7.js";
import { a as bindsClaudeThinkingPrefix, c as resolveClaudeModelIdentity, d as resolveClaudeOpus5ModelIdentity } from "./anthropic-DBfWwdAm.js";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-AjNWsmeV.js";
import "./src-tM8aLYtL.js";
import { n as isGoogleModelApi, t as isAnthropicApi } from "./anthropic-api-B3aKJIhV.js";
import { t as buildInboundMediaNoteProjection } from "./media-note-DMU_fCWz.js";
import { t as buildLateMediaAttachedProjection } from "./user-turn-transcript.message-W5Lni2jm.js";
import "./user-turn-transcript-9nytJfWI.js";
import { i as hydratePromptMediaMessages } from "./images-0buMptZa.js";
import { o as extractAssistantVisibleText } from "./embedded-agent-utils-IEeCcNou.js";
import { i as toNormalizedUsage } from "./usage-accumulator-CIKTNR4i.js";
import path from "node:path";
//#region src/plugins/provider-replay-helpers.ts
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
function shouldDropClaudeThinkingBlocks(modelId, model) {
	const ref = {
		id: modelId,
		params: model?.params
	};
	const canonicalId = resolveClaudeModelIdentity(ref);
	const isClaude = canonicalId.startsWith("claude-") || resolveClaudeOpus5ModelIdentity(ref) !== void 0;
	const preservesThinking = resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:5|6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(canonicalId);
	return isClaude && !preservesThinking;
}
//#endregion
//#region src/agents/transcript-policy.ts
/**
* Transcript replay policy resolution.
* Combines provider plugin replay hooks with core transport fallbacks so chat
* history sanitization, tool IDs, thinking blocks, and turn validation align.
*/
const DEFAULT_TRANSCRIPT_POLICY = {
	sanitizeMode: "images-only",
	sanitizeToolCallIds: false,
	toolCallIdMode: void 0,
	duplicateToolCallIdStyle: void 0,
	preserveNativeAnthropicToolUseIds: false,
	repairToolUseResultPairing: true,
	preserveSignatures: false,
	appendOnlyRuntimeContext: false,
	sanitizeThoughtSignatures: void 0,
	dropThinkingBlocks: false,
	dropReasoningFromHistory: false,
	applyGoogleTurnOrdering: false,
	validateGeminiTurns: false,
	validateAnthropicTurns: false,
	allowSyntheticToolResults: false
};
function isOpenAiResponsesCompatibleApi(modelApi) {
	return modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
}
function isClaudeFamilyModelId(modelId) {
	const id = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|[./:_-])claude(?:$|[./:_-])/.test(id);
}
function modelDisablesReasoningEffort(model) {
	return (model?.compat)?.supportsReasoningEffort === false;
}
function shouldPreserveReasoningContentReplay(params) {
	return params.model?.reasoning === true || requiresReasoningContentReplay(params.modelId);
}
/**
* Provides a narrow replay-policy fallback for providers that do not have an
* owning runtime plugin.
*
* This exists to preserve generic custom-provider behavior. Bundled providers
* should express replay ownership through `buildReplayPolicy` instead.
*/
function buildUnownedProviderTransportReplayFallback(params) {
	const isGoogle = isGoogleModelApi(params.modelApi);
	const isAnthropic = isAnthropicApi(params.modelApi);
	const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
	const requiresOpenAiCompatibleToolIdSanitization = params.modelApi === "openai-completions" || params.modelApi === "openai-responses" || params.modelApi === "openai-chatgpt-responses" || params.modelApi === "azure-openai-responses";
	if (!isGoogle && !isAnthropic && !isStrictOpenAiCompatible && !requiresOpenAiCompatibleToolIdSanitization) return;
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const isClaudeOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi) ? isClaudeFamilyModelId(modelId) : false;
	return {
		...isGoogle || isAnthropic ? { sanitizeMode: "full" } : {},
		...isGoogle || isAnthropic || requiresOpenAiCompatibleToolIdSanitization ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict"
		} : {},
		...isAnthropic ? {
			preserveSignatures: true,
			appendOnlyRuntimeContext: bindsClaudeThinkingPrefix({
				id: modelId,
				params: params.model?.params
			})
		} : {},
		...isGoogle ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {},
		...isAnthropic && shouldDropClaudeThinkingBlocks(modelId, params.model) ? { dropThinkingBlocks: true } : {},
		...isAnthropic && modelDisablesReasoningEffort(params.model) ? { dropThinkingBlocks: true } : {},
		...isStrictOpenAiCompatible ? { dropReasoningFromHistory: !shouldPreserveReasoningContentReplay(params) } : {},
		...isGoogle || isStrictOpenAiCompatible ? { applyAssistantFirstOrderingFix: true } : {},
		...isGoogle || isStrictOpenAiCompatible ? { validateGeminiTurns: true } : {},
		...isAnthropic || isStrictOpenAiCompatible || isClaudeOpenAiResponses ? { validateAnthropicTurns: true } : {},
		...isGoogle || isAnthropic || isOpenAiResponsesCompatibleApi(params.modelApi) ? { allowSyntheticToolResults: true } : {}
	};
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-for-coding",
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code",
	"kimi-k2.7-code-highspeed",
	"kimi-k3",
	"kimi-k2-thinking",
	"kimi-k2-thinking-turbo",
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-flash",
	"mimo-v2.6-pro",
	"mimo-v2.6-pro-ultraspeed"
]);
function requiresReasoningContentReplay(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized) return false;
	const parts = normalized.split("/").filter(Boolean);
	const finalPart = parts[parts.length - 1] ?? normalized;
	const candidates = [finalPart];
	const colonParts = finalPart.split(":").filter(Boolean);
	if (colonParts.length > 1) candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
	return candidates.some((candidate) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(candidate));
}
function mergeTranscriptPolicy(policy, basePolicy = DEFAULT_TRANSCRIPT_POLICY) {
	if (!policy) return basePolicy;
	return {
		...basePolicy,
		...policy.sanitizeMode != null ? { sanitizeMode: policy.sanitizeMode } : {},
		...typeof policy.sanitizeToolCallIds === "boolean" ? { sanitizeToolCallIds: policy.sanitizeToolCallIds } : {},
		...policy.toolCallIdMode ? { toolCallIdMode: policy.toolCallIdMode } : {},
		...policy.duplicateToolCallIdStyle ? { duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle } : {},
		...typeof policy.preserveNativeAnthropicToolUseIds === "boolean" ? { preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds } : {},
		...typeof policy.repairToolUseResultPairing === "boolean" ? { repairToolUseResultPairing: policy.repairToolUseResultPairing } : {},
		...typeof policy.preserveSignatures === "boolean" ? { preserveSignatures: policy.preserveSignatures } : {},
		...typeof policy.appendOnlyRuntimeContext === "boolean" ? { appendOnlyRuntimeContext: policy.appendOnlyRuntimeContext } : {},
		...policy.sanitizeThoughtSignatures ? { sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures } : {},
		...typeof policy.dropThinkingBlocks === "boolean" ? { dropThinkingBlocks: policy.dropThinkingBlocks } : {},
		...typeof policy.dropReasoningFromHistory === "boolean" ? { dropReasoningFromHistory: policy.dropReasoningFromHistory } : {},
		...typeof policy.applyAssistantFirstOrderingFix === "boolean" ? { applyGoogleTurnOrdering: policy.applyAssistantFirstOrderingFix } : {},
		...typeof policy.validateGeminiTurns === "boolean" ? { validateGeminiTurns: policy.validateGeminiTurns } : {},
		...typeof policy.validateAnthropicTurns === "boolean" ? { validateAnthropicTurns: policy.validateAnthropicTurns } : {},
		...typeof policy.allowSyntheticToolResults === "boolean" ? { allowSyntheticToolResults: policy.allowSyntheticToolResults } : {}
	};
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
function canCacheTranscriptPolicy(params) {
	if (!params.config) return false;
	return !params.env || params.env === process.env;
}
function resolveTranscriptPolicyCacheKey(params) {
	return JSON.stringify({
		provider: params.provider,
		modelApi: params.modelApi ?? "",
		modelId: params.modelId ?? "",
		canonicalModelId: typeof params.model?.params?.canonicalModelId === "string" ? params.model.params.canonicalModelId : "",
		dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
		preservesReasoningContentReplay: params.model?.reasoning === true,
		workspaceDir: params.workspaceDir ?? "",
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	});
}
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const cacheConfig = canCacheTranscriptPolicy(params) ? params.config : void 0;
	const cacheKey = cacheConfig ? resolveTranscriptPolicyCacheKey({
		...params,
		provider,
		config: cacheConfig
	}) : void 0;
	if (cacheConfig && cacheKey) {
		const cached = transcriptPolicyCache.get(cacheConfig)?.get(cacheKey);
		if (cached) return cached;
	}
	const runtimePlugin = params.runtimeHandle?.plugin ?? (provider ? resolveProviderRuntimePlugin({
		provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0);
	const context = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		provider,
		modelId: params.modelId ?? "",
		modelApi: params.modelApi,
		model: params.model
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = buildReplayPolicy ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0) : mergeTranscriptPolicy(buildUnownedProviderTransportReplayFallback({
		modelApi: params.modelApi,
		modelId: params.modelId,
		model: params.model
	}));
	if (cacheConfig && cacheKey) {
		let configCache = transcriptPolicyCache.get(cacheConfig);
		if (!configCache) {
			configCache = /* @__PURE__ */ new Map();
			transcriptPolicyCache.set(cacheConfig, configCache);
		}
		configCache.set(cacheKey, policy);
	}
	return policy;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-block-type.ts
function isRunnerToolCallBlockType(type) {
	return type === "toolCall" || type === "toolUse" || type === "functionCall";
}
function isRunnerToolCallBlock(block) {
	return isRunnerToolCallBlockType(asOptionalObjectRecord(block)?.type);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-history.ts
/**
* Resolves user-message boundaries and transcript policy for an attempt.
* It may assume normalized attempt and session inputs are ready.
*/
const LEADING_TIMESTAMP_ENVELOPE_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
const CONVERSATION_INFO_LABEL = markInboundContextLabel("Conversation info:");
function splitLeadingTimestampEnvelope(text) {
	const envelope = text.match(LEADING_TIMESTAMP_ENVELOPE_RE)?.[0] ?? "";
	return {
		envelope,
		body: envelope ? text.slice(envelope.length) : text
	};
}
function readFirstUserText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.find((block) => {
		if (!block || typeof block !== "object") return false;
		const typedBlock = block;
		return typedBlock.type === "text" && typeof typedBlock.text === "string";
	})?.text;
}
function hasNonBlankUserText(content) {
	return typeof content === "string" ? Boolean(content.trim()) : Array.isArray(content) && content.some((block) => Boolean(readFirstUserText([block])?.trim()));
}
function contentMatchesTimestampOverride(content, override) {
	const text = readFirstUserText(content);
	return text !== void 0 && (text === override.text || text === override.alternateText);
}
function resolveUserTranscriptMessages(messages, contexts, override) {
	if (!contexts?.length) return;
	const resolved = Array.from({ length: messages.length }, () => void 0);
	const unusedContexts = new Set(contexts);
	const byRuntimeMessage = /* @__PURE__ */ new Map();
	for (const context of unusedContexts) {
		const bucket = byRuntimeMessage.get(context.runtimeMessage);
		if (bucket) bucket.push(context);
		else byRuntimeMessage.set(context.runtimeMessage, [context]);
	}
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user") continue;
		const context = byRuntimeMessage.get(message)?.shift();
		if (!context) continue;
		resolved[index] = context.transcriptMessage;
		unusedContexts.delete(context);
	}
	if (unusedContexts.size === 0) return resolved;
	const byTimestamp = /* @__PURE__ */ new Map();
	for (const context of unusedContexts) {
		const timestamp = context.runtimeMessage.timestamp;
		if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) continue;
		const bucket = byTimestamp.get(timestamp);
		if (bucket) bucket.push(context);
		else byTimestamp.set(timestamp, [context]);
	}
	const activeUserMessageIndex = findActiveUserMessageIndex(messages);
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user" || resolved[index]) continue;
		const timestamp = message.timestamp;
		const context = (typeof timestamp === "number" ? byTimestamp.get(timestamp) : void 0)?.find((candidate) => unusedContexts.has(candidate) && userMessageMatchesTranscriptContext(message, candidate, index === activeUserMessageIndex || typeof override?.runtimeTimestamp === "number" && override.runtimeTimestamp === timestamp ? override : void 0));
		if (!context) continue;
		resolved[index] = context.transcriptMessage;
		unusedContexts.delete(context);
	}
	return resolved;
}
function userMessageMatchesTranscriptContext(message, context, override) {
	if (message === context.runtimeMessage) return true;
	const messageTimestamp = message.timestamp;
	const runtimeTimestamp = context.runtimeMessage.timestamp;
	if (typeof messageTimestamp !== "number" || !Number.isFinite(messageTimestamp) || messageTimestamp !== runtimeTimestamp) return false;
	const messageContent = message.content;
	const runtimeContent = context.runtimeMessage.content;
	const messageText = readFirstUserText(messageContent);
	const runtimeText = readFirstUserText(runtimeContent);
	if (messageText !== void 0 && messageText === runtimeText) return true;
	if (messageText === void 0 && runtimeText === void 0 && Array.isArray(messageContent) && Array.isArray(runtimeContent) && stableStringify(messageContent) === stableStringify(runtimeContent)) return true;
	return Boolean(override && contentMatchesTimestampOverride(messageContent, override) && contentMatchesTimestampOverride(runtimeContent, override));
}
function normalizePersistedSenderValue(value) {
	if (typeof value !== "string") return;
	return value.replaceAll("\0", "").trim() || void 0;
}
function readPersistedSender(message) {
	const testclaw = Reflect.get(message, "__testclaw");
	if (!testclaw || typeof testclaw !== "object" || Array.isArray(testclaw)) return;
	const meta = testclaw;
	const sender = {
		id: normalizePersistedSenderValue(meta["senderId"]),
		name: normalizePersistedSenderValue(meta["senderName"]),
		username: normalizePersistedSenderValue(meta["senderUsername"])
	};
	if (Object.values(sender).every((value) => value === void 0)) return;
	return sender;
}
function formatPersistedSenderContext(sender) {
	return "";
}
function mergeSenderIntoLeadingConversationInfo(text, sender) {
	const { body, envelope } = splitLeadingTimestampEnvelope(text);
	const jsonPrefix = `${CONVERSATION_INFO_LABEL}\n\`\`\`json\n`;
	if (!body.startsWith(jsonPrefix)) return;
	const jsonEnd = body.indexOf("\n```", jsonPrefix.length);
	if (jsonEnd === -1) return;
	let payload;
	try {
		payload = JSON.parse(body.slice(jsonPrefix.length, jsonEnd));
	} catch {
		return;
	}
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return;
	const suffix = body.slice(jsonEnd + 4);
	return `${envelope}${formatContextJsonBlock(CONVERSATION_INFO_LABEL, {
		...payload,
		sender
	})}${suffix}`;
}
function prependContextToUserMessage(message, sender) {
	const context = formatPersistedSenderContext(sender);
	const content = message.content;
	if (typeof content === "string") {
		const { body, envelope } = splitLeadingTimestampEnvelope(content);
		if (body === context || body.startsWith(`${context}\n\n`)) return message;
		const merged = mergeSenderIntoLeadingConversationInfo(content, sender);
		if (merged !== void 0) return merged === content ? message : {
			...message,
			content: merged
		};
		return {
			...message,
			content: `${envelope}${body ? `${context}\n\n${body}` : context}`
		};
	}
	if (!Array.isArray(content)) return message;
	const textIndex = content.findIndex((block) => {
		if (!block || typeof block !== "object") return false;
		const textBlock = block;
		return textBlock.type === "text" && typeof textBlock.text === "string";
	});
	if (textIndex === -1) return {
		...message,
		content: [{
			type: "text",
			text: context
		}, ...content]
	};
	const textBlock = content[textIndex];
	const { body, envelope } = splitLeadingTimestampEnvelope(textBlock.text);
	if (body === context || body.startsWith(`${context}\n\n`)) return message;
	const merged = mergeSenderIntoLeadingConversationInfo(textBlock.text, sender);
	const nextContent = content.slice();
	nextContent[textIndex] = {
		...textBlock,
		text: merged ?? `${envelope}${body ? `${context}\n\n${body}` : context}`
	};
	return {
		...message,
		content: nextContent
	};
}
function hasInterSessionPromptPrefix(message) {
	const text = readFirstUserText(message.content);
	if (text === void 0) return false;
	return splitLeadingTimestampEnvelope(text).body.startsWith(INTER_SESSION_PROMPT_PREFIX_BASE);
}
function projectPersistedSenderContext(messages, transcriptMessages) {
	let changed = false;
	const nextMessages = messages.map((message, index) => {
		if (message.role !== "user") return message;
		const transcriptMessage = transcriptMessages?.[index] ?? message;
		if (hasInterSessionUserProvenance(message) || hasInterSessionUserProvenance(transcriptMessage) || hasInterSessionPromptPrefix(message) || hasInterSessionPromptPrefix(transcriptMessage)) return message;
		const sender = readPersistedSender(transcriptMessage);
		if (!sender) return message;
		const nextMessage = prependContextToUserMessage(message, sender);
		changed ||= nextMessage !== message;
		return nextMessage;
	});
	return changed ? nextMessages : messages;
}
function findActiveUserMessageIndex(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (!message) continue;
		if (message.role === "user") return index;
		if (message.role === "assistant" && !isToolCallAssistantMessage(message)) return -1;
	}
	return -1;
}
function isToolCallAssistantMessage(message) {
	if (message.role !== "assistant") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	return content.some((block) => {
		if (!block || typeof block !== "object") return false;
		const type = block.type;
		return isRunnerToolCallBlockType(type);
	});
}
/**
* Adapts the RuntimePlan model context to the legacy provider-runtime model
* shape used by transcript-policy fallbacks.
*/
function asProviderRuntimeModel(model) {
	return typeof model?.id === "string" ? model : void 0;
}
/**
* Resolves the transcript policy for an embedded attempt. RuntimePlan owns the
* policy when present; otherwise the older provider/config/env resolver remains
* the compatibility path for callers that have not produced a runtime plan yet.
*/
function resolveAttemptTranscriptPolicy(params) {
	return params.runtimePlan?.transcript.resolvePolicy(params.runtimePlanModelContext) ?? resolveTranscriptPolicy({
		modelApi: params.runtimePlanModelContext.modelApi,
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.runtimePlanModelContext.workspaceDir,
		env: params.env ?? process.env,
		model: asProviderRuntimeModel(params.runtimePlanModelContext.model)
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/history-image-prune.ts
/**
* Prunes already-processed image payloads from replayed prompt history.
*/
/** Replacement text for old image blocks that were already available to the model. */
const PRUNED_HISTORY_IMAGE_MARKER = "[image data removed - already processed by model]";
/** Replacement text for fact-owned late-media projections already processed by the model. */
const PRUNED_HISTORY_MEDIA_REFERENCE_MARKER = "[media reference removed - already processed by model]";
const LEGACY_MEDIA_ATTACHED_PATTERN = /\[media attached(?:\s+\d+\/\d+)?:\s*[^\]]+\]/gi;
const LEGACY_IMAGE_SOURCE_PATTERN = /\[Image:\s*source:\s*[^\]]+\]/gi;
const LEGACY_INBOUND_MEDIA_URI_PATTERN = /\bmedia:\/\/inbound\/[^\]\s/\\]+/g;
/**
* Number of most-recent completed turns whose preceding user/toolResult image
* blocks are kept intact. Counts all completed turns, not just image-bearing
* ones, so text-only turns consume the window.
*/
const PRESERVE_RECENT_COMPLETED_TURNS = 3;
function resolvePruneBeforeIndex(messages) {
	const completedTurnStarts = [];
	let currentTurnStart = -1;
	let currentTurnHasAssistantReply = false;
	for (let i = 0; i < messages.length; i++) {
		const role = messages[i]?.role;
		if (role === "user") {
			if (currentTurnStart >= 0 && currentTurnHasAssistantReply) {
				if (completedTurnStarts.length > PRESERVE_RECENT_COMPLETED_TURNS) completedTurnStarts.shift();
				completedTurnStarts.push(currentTurnStart);
			}
			currentTurnStart = i;
			currentTurnHasAssistantReply = false;
			continue;
		}
		if (role === "toolResult") {
			if (currentTurnStart < 0) currentTurnStart = i;
			continue;
		}
		if (role === "assistant" && currentTurnStart >= 0) currentTurnHasAssistantReply = true;
	}
	if (completedTurnStarts.length <= PRESERVE_RECENT_COMPLETED_TURNS) return -1;
	return completedTurnStarts.at(-3) ?? -1;
}
function resolveMessageMediaFacts(message) {
	const runtimeMedia = readRuntimePromptMediaFacts(message);
	if (runtimeMedia) return runtimeMedia;
	return readPersistedMediaFacts(message) ?? [];
}
function wasStructurallyMediaPruned(message) {
	const meta = Reflect.get(message, "__testclaw");
	return Boolean(meta) && typeof meta === "object" && !Array.isArray(meta) && meta.mediaImagePruned === true;
}
function replaceLegacyFactlessMediaText(text) {
	return text.replace(LEGACY_MEDIA_ATTACHED_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replace(LEGACY_IMAGE_SOURCE_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replace(LEGACY_INBOUND_MEDIA_URI_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
}
function normalizeMarkerIdentity(identity) {
	return identity.replaceAll("\\", "/");
}
function resolveWorkspaceRelativeMarkerAliases(fact) {
	if (!fact.path || !fact.workspaceDir || !path.isAbsolute(fact.path) || !path.isAbsolute(fact.workspaceDir)) return [];
	const relativePath = path.relative(fact.workspaceDir, fact.path);
	if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) return [];
	const normalizedRelativePath = normalizeMarkerIdentity(relativePath);
	return [normalizedRelativePath, `./${normalizedRelativePath}`];
}
function factOwnsMarkerIdentity(identity, media) {
	const normalizedIdentity = normalizeMarkerIdentity(identity);
	return media.some((fact) => {
		return [
			fact.path,
			fact.url,
			...resolveWorkspaceRelativeMarkerAliases(fact)
		].some((alias) => alias && normalizeMarkerIdentity(alias) === normalizedIdentity);
	});
}
function extractMediaAttachedIdentity(marker) {
	const content = marker.replace(/^\[media attached(?:\s+\d+\/\d+)?:\s*/i, "").slice(0, -1);
	const endIndexes = [content.lastIndexOf(" ("), content.indexOf(" | ")].filter((index) => index >= 0);
	const endIndex = endIndexes.length > 0 ? Math.min(...endIndexes) : content.length;
	return content.slice(0, endIndex).trim();
}
function replaceOwnedLegacyMediaMarkers(text, media) {
	return text.replace(LEGACY_MEDIA_ATTACHED_PATTERN, (marker) => factOwnsMarkerIdentity(extractMediaAttachedIdentity(marker), media) ? PRUNED_HISTORY_MEDIA_REFERENCE_MARKER : marker).replace(LEGACY_IMAGE_SOURCE_PATTERN, (marker) => {
		return factOwnsMarkerIdentity(marker.replace(/^\[Image:\s*source:\s*/i, "").slice(0, -1).trim(), media) ? PRUNED_HISTORY_MEDIA_REFERENCE_MARKER : marker;
	});
}
function replaceOwnedMediaProjection(text, media) {
	if (media.length === 0) return text;
	const projectionLines = /* @__PURE__ */ new Set();
	for (const facts of [media, ...media.map((fact) => [fact])]) {
		const projection = buildInboundMediaNoteProjection({ media: facts }).text;
		for (const line of projection?.split("\n") ?? []) if (line) projectionLines.add(line);
	}
	let redacted = text;
	for (const line of projectionLines) redacted = redacted.replaceAll(line, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
	for (const fact of media) for (const alias of [fact.path, fact.url].filter((value) => Boolean(value))) redacted = redacted.replaceAll(`[Image: source: ${alias}]`, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replaceAll(`[media attached: ${alias}]`, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
	return replaceOwnedLegacyMediaMarkers(redacted, media);
}
function cloneMessageWithContent(message, content, dropMedia = false, dropImageMetadata = dropMedia) {
	const clone = {
		...message,
		content
	};
	if (dropMedia) {
		delete clone.media;
		stripLegacyMediaContextFields(clone);
	}
	if (dropImageMetadata) {
		const meta = clone["__testclaw"];
		const nextMeta = meta && typeof meta === "object" && !Array.isArray(meta) ? { ...meta } : {};
		delete nextMeta.mediaImageBlockFactIndexes;
		delete nextMeta.mediaImageLayout;
		if (dropMedia) {
			delete nextMeta.media;
			nextMeta.mediaImagePruned = true;
		}
		if (Object.keys(nextMeta).length > 0) clone["__testclaw"] = nextMeta;
		else delete clone["__testclaw"];
	}
	return clone;
}
/** Prunes old image payloads and references before later LLM-boundary synthesis. */
function pruneProcessedHistoryImages(messages) {
	const pruneBeforeIndex = resolvePruneBeforeIndex(messages);
	if (pruneBeforeIndex < 0) return null;
	let prunedMessages = null;
	for (let i = 0; i < pruneBeforeIndex; i++) {
		const message = messages[i];
		if (!message || message.role !== "user" && message.role !== "toolResult") continue;
		const media = message.role === "user" ? resolveMessageMediaFacts(message) : [];
		const hasOwnedMedia = media.length > 0;
		const structuredMediaWasPruned = wasStructurallyMediaPruned(message);
		const lateMediaText = (message.role === "user" && !hasNonBlankUserText(message.content) ? buildLateMediaAttachedProjection(message) : void 0)?.media.map(() => PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).join("\n");
		const content = lateMediaText ? Array.isArray(message.content) ? [{
			type: "text",
			text: lateMediaText
		}, ...message.content] : lateMediaText : message.content;
		if (typeof content === "string") {
			const nextText = hasOwnedMedia ? replaceOwnedMediaProjection(content, media) : structuredMediaWasPruned ? content : replaceLegacyFactlessMediaText(content);
			if (nextText !== message.content || hasOwnedMedia) {
				prunedMessages ??= messages.slice();
				prunedMessages[i] = cloneMessageWithContent(message, nextText, hasOwnedMedia);
			}
			continue;
		}
		if (!Array.isArray(content)) continue;
		const contentLength = content.length;
		let nextContent = hasOwnedMedia || lateMediaText ? content.slice(0, contentLength) : void 0;
		let prunedImageBlock = false;
		for (let index = 0; index < contentLength; index += 1) {
			if (!(index in content)) continue;
			const block = content[index];
			let nextBlock;
			if (block?.type === "text" && typeof block.text === "string") {
				const text = hasOwnedMedia ? replaceOwnedMediaProjection(block.text, media) : structuredMediaWasPruned ? block.text : replaceLegacyFactlessMediaText(block.text);
				if (text !== block.text) nextBlock = {
					...block,
					text
				};
			} else if (block?.type === "image") {
				prunedImageBlock = true;
				nextBlock = {
					type: "text",
					text: PRUNED_HISTORY_IMAGE_MARKER
				};
			}
			if (nextBlock !== void 0) {
				nextContent ??= content.slice(0, contentLength);
				nextContent[index] = nextBlock;
			}
		}
		if (nextContent) {
			prunedMessages ??= messages.slice();
			prunedMessages[i] = cloneMessageWithContent(message, nextContent, hasOwnedMedia, hasOwnedMedia || prunedImageBlock);
		}
	}
	return prunedMessages;
}
/** Installs an agent context transform that prunes old image/media history before model input. */
function installHistoryImagePruneContextTransform(agent, mediaOptions) {
	const originalTransformContext = agent.transformContext;
	agent.transformContext = async (messages, signal) => {
		const prunedInput = pruneProcessedHistoryImages(messages) ?? messages;
		const hydratedInput = mediaOptions ? await hydratePromptMediaMessages(prunedInput, mediaOptions) : prunedInput;
		const transformed = originalTransformContext ? await originalTransformContext.call(agent, hydratedInput, signal) : hydratedInput;
		const sourceMessages = Array.isArray(transformed) ? transformed : hydratedInput;
		return pruneProcessedHistoryImages(sourceMessages) ?? sourceMessages;
	};
	return () => {
		agent.transformContext = originalTransformContext;
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/helpers.ts
/**
* Shared run helpers for retry limits, model reporting, and final text.
*/
const RUNTIME_AUTH_REFRESH_MARGIN_MS = 3e5;
const RUNTIME_AUTH_REFRESH_RETRY_MS = 6e4;
const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5e3;
const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "[redacted]";
function scrubAnthropicRefusalMagic(prompt) {
	if (!prompt.includes(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL)) return prompt;
	return prompt.replaceAll(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, ANTHROPIC_MAGIC_STRING_REPLACEMENT);
}
/** Anthropic's transport interprets this marker even for native-owned attempts. */
function resolveEmbeddedAttemptBasePrompt(params) {
	if (params.provider !== "anthropic") return params.prompt;
	return scrubAnthropicRefusalMagic(params.prompt);
}
function createRunRecoveryDiagId() {
	return `ovf-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
const BASE_RUN_RETRY_ITERATIONS = 24;
const RUN_RETRY_ITERATIONS_PER_PROFILE = 8;
const MIN_RUN_RETRY_ITERATIONS = 32;
const MAX_RUN_RETRY_ITERATIONS = 160;
function resolveMaxRunRetryIterations(profileCandidateCount) {
	const scaled = BASE_RUN_RETRY_ITERATIONS + Math.max(1, profileCandidateCount) * RUN_RETRY_ITERATIONS_PER_PROFILE;
	return Math.min(MAX_RUN_RETRY_ITERATIONS, Math.max(MIN_RUN_RETRY_ITERATIONS, scaled));
}
function resolveActiveErrorContext(params) {
	return resolveReportedModelRef(params);
}
function isEmbeddedHarnessProvider(provider) {
	return provider.trim().toLowerCase() === "testclaw";
}
function resolveReportedModelRef(params) {
	const assistantProvider = params.assistant?.provider?.trim();
	const assistantModel = params.assistant?.model?.trim();
	if (!assistantProvider) return {
		provider: params.provider,
		model: assistantModel || params.model
	};
	if (isEmbeddedHarnessProvider(assistantProvider)) return {
		provider: params.provider,
		model: params.model
	};
	return {
		provider: assistantProvider,
		model: assistantModel || params.model
	};
}
function resolveLatestCallUsage(params) {
	const currentAttempt = params.currentAttemptCandidates.find(hasNonzeroUsage);
	const carriedUsage = hasNonzeroUsage(params.carriedUsage) ? params.carriedUsage : void 0;
	const transcriptFallback = hasNonzeroUsage(params.transcriptFallback) ? params.transcriptFallback : void 0;
	return {
		currentAttempt,
		latest: currentAttempt ?? carriedUsage ?? transcriptFallback
	};
}
function normalizeAssistantUsageForContext(assistant) {
	if (assistant?.api === "cli" && assistant.usage && typeof assistant.usage === "object" && !Array.isArray(assistant.usage) && assistant.usage.contextUsage === void 0) return { contextUsage: { state: "unavailable" } };
	return normalizeUsage(assistant?.usage);
}
function buildUsageAgentMetaFields(params) {
	const usage = toNormalizedUsage(params.usageAccumulator);
	const latestUsage = normalizeUsage(params.latestUsage);
	const lastCallUsage = hasNonzeroUsage(latestUsage) ? latestUsage : hasNonzeroUsage(params.lastRunPromptUsage) ? params.lastRunPromptUsage : void 0;
	return {
		usage,
		lastCallUsage,
		promptTokens: deriveContextPromptTokens({ lastCallUsage }),
		...usage?.cost ? { costUsd: usage.cost.total } : {}
	};
}
/**
* Build agentMeta for error return paths, preserving accumulated usage so that
* session totalTokens reflects the actual context size rather than going stale.
* Without this, error returns omit usage and the session keeps whatever
* totalTokens was set by the previous successful run.
*/
function buildErrorAgentMeta(params) {
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: params.usageAccumulator,
		latestUsage: normalizeAssistantUsageForContext(params.currentAttemptAssistant),
		lastRunPromptUsage: params.lastRunPromptUsage
	});
	return {
		sessionId: params.sessionId,
		...params.sessionFile ? { sessionFile: params.sessionFile } : {},
		provider: params.provider,
		model: params.model,
		...params.credentialSource ? { credentialSource: params.credentialSource } : {},
		...params.contextTokens ? { contextTokens: params.contextTokens } : {},
		...params.contextTokens ? { contextTokensSource: "resolved" } : {},
		...usageMeta.usage ? { usage: usageMeta.usage } : {},
		...usageMeta.lastCallUsage ? { lastCallUsage: usageMeta.lastCallUsage } : {},
		...usageMeta.promptTokens ? { promptTokens: usageMeta.promptTokens } : {},
		...usageMeta.costUsd !== void 0 ? { costUsd: usageMeta.costUsd } : {}
	};
}
function resolveFinalAssistantVisibleText(lastAssistant) {
	if (!lastAssistant) return;
	return extractAssistantVisibleText(lastAssistant).trim() || void 0;
}
function resolveFinalAssistantRawText(lastAssistant) {
	if (!lastAssistant) return;
	return (extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" }) ?? extractAssistantTextForPhase(lastAssistant) ?? "").trim() || void 0;
}
//#endregion
export { splitLeadingTimestampEnvelope as C, resolveUserTranscriptMessages as S, resolveTranscriptPolicy as T, findActiveUserMessageIndex as _, buildUsageAgentMetaFields as a, readFirstUserText as b, resolveActiveErrorContext as c, resolveFinalAssistantVisibleText as d, resolveLatestCallUsage as f, pruneProcessedHistoryImages as g, installHistoryImagePruneContextTransform as h, buildErrorAgentMeta as i, resolveEmbeddedAttemptBasePrompt as l, resolveReportedModelRef as m, RUNTIME_AUTH_REFRESH_MIN_DELAY_MS as n, createRunRecoveryDiagId as o, resolveMaxRunRetryIterations as p, RUNTIME_AUTH_REFRESH_RETRY_MS as r, normalizeAssistantUsageForContext as s, RUNTIME_AUTH_REFRESH_MARGIN_MS as t, resolveFinalAssistantRawText as u, hasNonBlankUserText as v, isRunnerToolCallBlock as w, resolveAttemptTranscriptPolicy as x, projectPersistedSenderContext as y };
