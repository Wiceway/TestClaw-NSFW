import { c as normalizeOptionalLowercaseString, g as readStringValue, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./number-coercion-0M4tZV2c.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./boolean-DmBL0YJK.js";
import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { b as redactToolPayloadText } from "./redact-myZeUWr_.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { r as resolveModelExtraParamSources } from "./model-extra-params-OvC8BRDJ.js";
import { a as resolveProviderRequestPolicy } from "./provider-attribution-DVyJYen1.js";
import "./text-projection-BoeR_I8Q.js";
import "./src-CTZa6VfN.js";
import { p as resolveProviderRequestPolicyConfig, s as getModelProviderRequestRouteFacts } from "./provider-local-service-reconcile-DGJJw1a3.js";
import { n as ensureProviderRuntimePluginHandle, r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-AjNWsmeV.js";
import { t as log$1 } from "./logger-BFBxDn9c.js";
import "./event-stream-IPGDcRrP.js";
import { i as streamSimple } from "./stream-Dln_s4hO.js";
import "./ai-transport-runtime-host-DFJQ8meD.js";
import { a as resolveCodexNativeSearchActivation, i as patchCodexNativeWebSearchPayload, r as isNativeWebSearchAllowedByToolPolicy } from "./codex-native-web-search-core-BkUuHTlb.js";
import "@testclaw/ai/internal/openai-responses-payload-policy";
import { applyAnthropicEphemeralCacheControlMarkers, applyCompletionsAnthropicCacheControl, applyOpenAIResponsesPayloadPolicy, canonicalizeMaxTokensParam, detectOpenAICompletionsCompat, filterCodeModePayloadTools, flattenCompletionMessagesToStringContent, googleFlashSupportsMinimalThinking, isCodeModeModelVisibleToolName, readCodeModePayloadToolName, resolveAnthropicEphemeralCacheControl, resolveMaxTokensParam, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIResponsesPayloadPolicy, stripCompletionMessagesToRoleContent } from "@testclaw/ai/transports";
import "@testclaw/ai/internal/runtime";
import "@testclaw/ai/internal/shared";
import "@testclaw/ai/internal/anthropic";
import { codeModeToolSurfaceObserver } from "@testclaw/ai/internal/openai";
import { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel } from "@testclaw/ai/internal/google-model-family";
//#region src/llm/providers/stream-wrappers/anthropic-family-cache-semantics.ts
function isAnthropicModelRef(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).startsWith("anthropic/");
}
/** Matches Application Inference Profile ARNs across all AWS partitions with Bedrock. */
const BEDROCK_APP_INFERENCE_PROFILE_ARN_RE = /^arn:aws(-cn|-us-gov)?:bedrock:/;
function isAnthropicBedrockModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (normalized.includes("anthropic.claude") || normalized.includes("anthropic/claude")) return true;
	if (BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalized) && normalized.includes(":application-inference-profile/")) return (normalized.split(":application-inference-profile/")[1] ?? "").includes("claude");
	return false;
}
function isAnthropicFamilyCacheTtlEligible(params) {
	const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
	if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex") return true;
	if (normalizedProvider === "amazon-bedrock") return isAnthropicBedrockModel(params.modelId);
	return params.modelApi === "anthropic-messages";
}
function resolveAnthropicCacheRetentionFamily(params) {
	const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
	if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex") return "anthropic-direct";
	if (normalizedProvider === "amazon-bedrock" && params.hasExplicitCacheConfig && typeof params.modelId === "string") {
		if (isAnthropicBedrockModel(params.modelId)) return "anthropic-bedrock";
		if (BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalizeLowercaseStringOrEmpty(params.modelId)) && normalizeLowercaseStringOrEmpty(params.modelId).includes(":application-inference-profile/")) return "anthropic-bedrock";
	}
	if (normalizedProvider !== "amazon-bedrock" && params.hasExplicitCacheConfig && params.modelApi === "anthropic-messages") return "custom-anthropic-api";
}
//#endregion
//#region src/agents/embedded-agent-runner/prompt-cache-retention.ts
/**
* Resolves provider/model prompt-cache retention behavior.
*/
function parseCacheRetention(value) {
	return value === "none" || value === "short" || value === "long" ? value : void 0;
}
function isGooglePromptCacheEligible(params) {
	if (params.modelApi !== "google-generative-ai") return false;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(params.modelId);
	return normalizedModelId.startsWith("gemini-2.5") || normalizedModelId.startsWith("gemini-3");
}
function resolveCacheRetention(extraParams, provider, modelApi, modelId, compat, baseUrl) {
	const family = resolveAnthropicCacheRetentionFamily({
		provider,
		modelApi,
		modelId,
		hasExplicitCacheConfig: extraParams?.cacheRetention !== void 0 || extraParams?.cacheControlTtl !== void 0
	});
	const openAIEligible = (modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "openai-completions") && resolveOpenAIPromptCacheKeySupport({
		provider,
		api: modelApi,
		baseUrl,
		compat
	});
	const googleEligible = isGooglePromptCacheEligible({
		modelApi,
		modelId
	});
	const compatEligible = compat?.supportsPromptCacheKey === true || compat?.cacheControlFormat === "anthropic";
	if (!family && !googleEligible && !openAIEligible && !compatEligible && !(modelApi === "bedrock-converse-stream")) return;
	const newVal = parseCacheRetention(extraParams?.cacheRetention);
	if (newVal) return newVal;
	const legacy = extraParams?.cacheControlTtl;
	if (legacy === "5m" && (family || googleEligible)) return "short";
	if (legacy === "1h" && (family || googleEligible)) return "long";
	return family === "anthropic-direct" ? "short" : void 0;
}
//#endregion
//#region src/llm/providers/stream-wrappers/stream-payload-utils.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
function streamWithPayloadPatch(underlying, model, context, options, patchPayload) {
	const originalOnPayload = options?.onPayload;
	return underlying(model, context, {
		...options,
		onPayload: (payload) => {
			if (payload && typeof payload === "object") patchPayload(payload);
			return originalOnPayload?.(payload, model);
		}
	});
}
//#endregion
//#region src/agents/openai-text-verbosity.ts
/**
* OpenAI text verbosity normalization for provider-owned stream parameters.
*
* Invalid operator-supplied values are ignored with a warning instead of leaking into API payloads.
*/
function normalizeOpenAITextVerbosity(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "low" || normalized === "medium" || normalized === "high") return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAITextVerbosity(extraParams) {
	const raw = extraParams?.textVerbosity ?? extraParams?.text_verbosity;
	const normalized = normalizeOpenAITextVerbosity(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log$1.warn(`ignoring invalid OpenAI text verbosity param: ${rawSummary}`);
	}
	return normalized;
}
//#endregion
//#region src/logging/code-mode-diagnostic.ts
const MAX_NAMES = 24;
const MAX_NAME_LENGTH = 80;
function isCodeModeDiagnosticEnabled() {
	return isTruthyEnvValue(process.env.TESTCLAW_DEBUG_CODE_MODE);
}
function logCodeModeDiagnostic(log, boundary, fields) {
	if (!isCodeModeDiagnosticEnabled()) return;
	const bounded = Object.fromEntries(Object.entries(fields).map(([key, value]) => {
		if (Array.isArray(value)) {
			const names = [...new Set(value.map((name) => name.slice(0, MAX_NAME_LENGTH)))];
			names.sort((left, right) => left.localeCompare(right));
			return [key, names.slice(0, MAX_NAMES)];
		}
		return [key, typeof value === "string" ? value.slice(0, MAX_NAME_LENGTH) : value];
	}));
	log.info(redactToolPayloadText(`code-mode diagnostic ${JSON.stringify({
		boundary,
		...bounded
	})}`));
}
//#endregion
//#region src/llm/providers/stream-wrappers/openai.ts
const log = createSubsystemLogger("llm/providers/stream-wrappers");
function isCodeModeEnabled(config) {
	const tools = config?.tools;
	if (!tools || typeof tools !== "object") return false;
	const codeMode = tools.codeMode;
	if (codeMode === true) return true;
	return Boolean(codeMode && typeof codeMode === "object" && codeMode.enabled === true);
}
function filterCodeModePayloadHookResult(payload, nextPayload, visibleToolNames, allowedHostedToolTypes, observer) {
	const finalPayload = nextPayload === void 0 ? payload : nextPayload;
	filterCodeModePayloadTools(finalPayload, visibleToolNames, allowedHostedToolTypes, observer);
	return nextPayload === void 0 ? void 0 : finalPayload;
}
function resolveCodeModeVisibleToolNames(context) {
	if (!Array.isArray(context.tools)) return;
	const names = new Set(context.tools.map(readCodeModePayloadToolName).filter((name) => typeof name === "string"));
	return isCodeModeModelVisibleToolName("exec", names) && isCodeModeModelVisibleToolName("wait", names) ? names : void 0;
}
function shouldFlattenOpenAICompletionMessages(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return model.api === "openai-completions" && compat?.requiresStringContent === true;
}
function shouldStripOpenAICompletionTools(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return model.api === "openai-completions" && compat?.supportsTools === false;
}
function shouldStripOpenAICompletionMessageKeys(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return model.api === "openai-completions" && compat?.strictMessageKeys === true;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIResponsesContextManagementWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const policy = resolveOpenAIResponsesPayloadPolicy(model, {
			extraParams,
			enablePromptCacheStripping: true,
			enableServerCompaction: true,
			storeMode: "provider-policy"
		});
		if (policy.explicitStore === void 0 && !policy.useServerCompaction && !policy.shouldStripStore && !policy.shouldStripPromptCache && !policy.shouldStripDisabledReasoningPayload) return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		const replayResponsesItemIds = (policy.shouldStripStore ? false : policy.explicitStore) ?? options?.replayResponsesItemIds;
		const nextOptions = {
			...options,
			...replayResponsesItemIds === void 0 ? {} : { replayResponsesItemIds },
			onPayload: (payload) => {
				if (payload && typeof payload === "object") applyOpenAIResponsesPayloadPolicy(payload, policy);
				return originalOnPayload?.(payload, model);
			}
		};
		return underlying(model, context, nextOptions);
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIStringContentWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!shouldFlattenOpenAICompletionMessages(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (!Array.isArray(payloadObj.messages)) return;
			payloadObj.messages = flattenCompletionMessagesToStringContent(payloadObj.messages);
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsStrictMessageKeysWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!shouldStripOpenAICompletionMessageKeys(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (!Array.isArray(payloadObj.messages)) return;
			payloadObj.messages = stripCompletionMessagesToRoleContent(payloadObj.messages);
		});
	};
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsToolsCompatWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!shouldStripOpenAICompletionTools(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			delete payloadObj.tools;
			delete payloadObj.tool_choice;
			delete payloadObj.parallel_tool_calls;
		});
	};
}
/** @deprecated OpenAI Codex provider-owned stream helper; do not use from third-party plugins. */
function createCodexNativeWebSearchWrapper(baseStreamFn, params) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const codeModeSurfaceFromOptions = options?.testclawCodeModeToolSurface === true;
		const codeModeVisibleToolNames = resolveCodeModeVisibleToolNames(context);
		const resolveNativeSearchActivation = () => resolveCodexNativeSearchActivation({
			config: params.config,
			modelProvider: readStringValue(model.provider),
			modelApi: readStringValue(model.api),
			modelId: readStringValue(model.id),
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sandboxToolPolicy: params.sandboxToolPolicy,
			messageProvider: params.messageProvider,
			agentAccountId: params.agentAccountId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			agentDir: params.agentDir
		});
		if ((params.codeModeToolSurfaceEnabled === true || codeModeSurfaceFromOptions || isCodeModeEnabled(params.config)) && codeModeVisibleToolNames) {
			const allowedHostedToolTypes = options?.testclawCodeModeAllowedHostedToolTypes ?? /* @__PURE__ */ new Set();
			const activation = params.nativeWebSearchAllowedByToolPolicy === false ? void 0 : resolveNativeSearchActivation();
			if (activation?.state === "native_active") allowedHostedToolTypes.add("web_search");
			if (activation?.state === "native_active" || activation?.codexNativeEnabled) {
				const outcome = activation.state === "native_active" ? `activating (${activation.codexMode})` : `skipping (${activation.inactiveReason ?? "inactive"})`;
				log.debug(`${outcome} Codex native web search alongside code mode for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			}
			const originalOnPayload = options?.onPayload;
			const codeModeDiagnosticsEnabled = isCodeModeDiagnosticEnabled();
			const existingToolSurfaceObserver = codeModeToolSurfaceObserver.get(options);
			const existingToolSurfaceCollector = codeModeToolSurfaceObserver.getCollector(options);
			const observedBeforeToolIdentities = /* @__PURE__ */ new Set();
			const collectToolSurface = existingToolSurfaceCollector ?? (codeModeDiagnosticsEnabled ? ({ beforeToolIdentities }) => {
				for (const identity of beforeToolIdentities) observedBeforeToolIdentities.add(identity);
			} : void 0);
			let diagnosticEmitted = false;
			const observeToolSurface = existingToolSurfaceObserver ?? (codeModeDiagnosticsEnabled ? ({ beforeToolIdentities, afterToolIdentities }) => {
				for (const identity of beforeToolIdentities) observedBeforeToolIdentities.add(identity);
				if (diagnosticEmitted) return;
				diagnosticEmitted = true;
				const retained = new Set(afterToolIdentities);
				const allBeforeToolIdentities = [...observedBeforeToolIdentities];
				logCodeModeDiagnostic(log, "provider-tool-surface", {
					provider: readStringValue(model.provider),
					model: readStringValue(model.id),
					beforeToolIdentities: allBeforeToolIdentities,
					afterToolIdentities,
					removedToolIdentities: allBeforeToolIdentities.filter((identity) => !retained.has(identity))
				});
			} : void 0);
			const codeModeOptions = {
				...options,
				testclawCodeModeToolSurface: true,
				testclawCodeModeAllowedHostedToolTypes: allowedHostedToolTypes,
				onPayload: (payload) => {
					if (activation?.state === "native_active") patchCodexNativeWebSearchPayload({
						payload,
						config: params.config
					});
					filterCodeModePayloadHookResult(payload, void 0, codeModeVisibleToolNames, allowedHostedToolTypes, collectToolSurface);
					const nextPayload = originalOnPayload?.(payload, model);
					if (isPromiseLike(nextPayload)) return Promise.resolve(nextPayload).then((resolvedPayload) => filterCodeModePayloadHookResult(payload, resolvedPayload, codeModeVisibleToolNames, allowedHostedToolTypes, observeToolSurface));
					return filterCodeModePayloadHookResult(payload, nextPayload, codeModeVisibleToolNames, allowedHostedToolTypes, observeToolSurface);
				}
			};
			if (observeToolSurface && !existingToolSurfaceObserver) codeModeToolSurfaceObserver.set(codeModeOptions, observeToolSurface, collectToolSurface);
			return underlying(model, context, codeModeOptions);
		}
		if (params.nativeWebSearchAllowedByToolPolicy === false) {
			log.debug(`skipping Codex native web search (tool_policy_denied) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			return underlying(model, context, options);
		}
		const activation = resolveNativeSearchActivation();
		if (activation.state !== "native_active") {
			if (activation.codexNativeEnabled) log.debug(`skipping Codex native web search (${activation.inactiveReason ?? "inactive"}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
			return underlying(model, context, options);
		}
		log.debug(`activating Codex native web search (${activation.codexMode}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`);
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: (payload) => {
				const result = patchCodexNativeWebSearchPayload({
					payload,
					config: params.config
				});
				if (result.status === "payload_not_object") log.debug("Skipping Codex native web search injection because provider payload is not an object");
				else if (result.status === "native_tool_already_present") log.debug("Codex native web search tool already present in provider payload");
				else if (result.status === "injected") log.debug("Injected Codex native web search tool into provider payload");
				return originalOnPayload?.(payload, model);
			}
		});
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/google-thinking-payload.ts
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleThinkingRequiredModel(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).includes("gemini-2.5-pro");
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini25ThinkingBudgetModel(modelId) {
	return /(?:^|\/)gemini-2\.5-/.test(normalizeLowercaseStringOrEmpty(modelId));
}
/**
* Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function resolveGoogleGemini3ThinkingLevel(params) {
	if (typeof params.modelId !== "string") return;
	if (isGoogleGemini3ProModel(params.modelId)) {
		switch (params.thinkingLevel) {
			case "off":
			case "minimal":
			case "low": return "LOW";
			case "medium":
			case "high":
			case "max":
			case "xhigh": return "HIGH";
			case "adaptive": return;
			case void 0:
		}
		if (typeof params.thinkingBudget === "number") {
			if (params.thinkingBudget < 0) return;
			return params.thinkingBudget <= 2048 ? "LOW" : "HIGH";
		}
		return;
	}
	if (!isGoogleGemini3FlashModel(params.modelId)) return;
	const minimalLevel = googleFlashSupportsMinimalThinking(params.modelId) ? "MINIMAL" : "LOW";
	switch (params.thinkingLevel) {
		case "off":
		case "minimal": return minimalLevel;
		case "low": return "LOW";
		case "medium": return "MEDIUM";
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		case "adaptive": return;
		case void 0:
	}
	if (typeof params.thinkingBudget !== "number") return;
	if (params.thinkingBudget < 0) return;
	if (params.thinkingBudget <= 0) return minimalLevel;
	if (params.thinkingBudget <= 2048) return "LOW";
	if (params.thinkingBudget <= 8192) return "MEDIUM";
	return "HIGH";
}
/**
* Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function stripInvalidGoogleThinkingBudget(params) {
	if (params.thinkingConfig.thinkingBudget !== 0 || typeof params.modelId !== "string" || !isGoogleThinkingRequiredModel(params.modelId)) return false;
	delete params.thinkingConfig.thinkingBudget;
	return true;
}
function isGemma4Model(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).startsWith("gemma-4");
}
function mapThinkLevelToGemma4ThinkingLevel(thinkingLevel) {
	switch (thinkingLevel) {
		case "off": return;
		case "minimal":
		case "low": return "MINIMAL";
		case "medium":
		case "adaptive":
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		default: return;
	}
}
function normalizeGemma4ThinkingLevel(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toUpperCase()) {
		case "MINIMAL":
		case "LOW": return "MINIMAL";
		case "MEDIUM":
		case "HIGH": return "HIGH";
		default: return;
	}
}
/**
* Normalizes Google thinking config across SDK payload shapes before provider transport.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function sanitizeGoogleThinkingPayload(params) {
	if (!params.payload || typeof params.payload !== "object") return;
	const payloadObj = params.payload;
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.config,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.generationConfig,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
}
function sanitizeGoogleThinkingConfigContainer(params) {
	if (!params.container || typeof params.container !== "object") return;
	const configObj = params.container;
	const thinkingConfig = configObj.thinkingConfig;
	if (!thinkingConfig || typeof thinkingConfig !== "object") return;
	const thinkingConfigObj = thinkingConfig;
	if (typeof params.modelId === "string" && isGemma4Model(params.modelId)) {
		const normalizedThinkingLevel = normalizeGemma4ThinkingLevel(thinkingConfigObj.thinkingLevel);
		const explicitMappedLevel = mapThinkLevelToGemma4ThinkingLevel(params.thinkingLevel);
		const disabledViaBudget = typeof thinkingConfigObj.thinkingBudget === "number" && thinkingConfigObj.thinkingBudget <= 0;
		const hadThinkingBudget = thinkingConfigObj.thinkingBudget !== void 0;
		delete thinkingConfigObj.thinkingBudget;
		if (params.thinkingLevel === "off" || disabledViaBudget && explicitMappedLevel === void 0 && !normalizedThinkingLevel) {
			delete thinkingConfigObj.thinkingLevel;
			if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
			return;
		}
		const mappedLevel = explicitMappedLevel ?? normalizedThinkingLevel ?? (hadThinkingBudget ? "MINIMAL" : void 0);
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		return;
	}
	const thinkingBudget = thinkingConfigObj.thinkingBudget;
	if (params.thinkingLevel === "adaptive" && typeof params.modelId === "string" && isGoogleGemini25ThinkingBudgetModel(params.modelId)) {
		delete thinkingConfigObj.thinkingLevel;
		thinkingConfigObj.thinkingBudget = -1;
		return;
	}
	if (params.thinkingLevel === "adaptive" && typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
		delete thinkingConfigObj.thinkingBudget;
		delete thinkingConfigObj.thinkingLevel;
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
		const mappedLevel = resolveGoogleGemini3ThinkingLevel({
			modelId: params.modelId,
			thinkingLevel: params.thinkingLevel,
			thinkingBudget: typeof thinkingBudget === "number" ? thinkingBudget : void 0
		});
		delete thinkingConfigObj.thinkingBudget;
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (stripInvalidGoogleThinkingBudget({
		thinkingConfig: thinkingConfigObj,
		modelId: params.modelId
	})) {
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (typeof thinkingBudget !== "number" || thinkingBudget >= 0) return;
	delete thinkingConfigObj.thinkingBudget;
	if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
}
createLazyRuntimeModule(() => import("./stream-qMdf2GQz.js"));
"temperature top_p n presence_penalty frequency_penalty".split(" ");
//#endregion
//#region src/plugin-sdk/provider-stream-shared.ts
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
function createPayloadPatchStreamWrapper(baseStreamFn, patchPayload, wrapperOptions) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (wrapperOptions?.shouldPatch && !wrapperOptions.shouldPatch({
			model,
			context,
			options
		})) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => patchPayload({
			payload,
			model,
			context,
			options
		}));
	};
}
function isDisabledDeepSeekV4ThinkingLevel(thinkingLevel) {
	const normalized = typeof thinkingLevel === "string" ? thinkingLevel.toLowerCase() : "";
	return normalized === "off" || normalized === "none";
}
function resolveDeepSeekV4ReasoningEffort(thinkingLevel) {
	return thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
}
/** Normalizes assistant reasoning replay shared by OpenAI-compatible provider families. */
function normalizeOpenAICompatibleReasoningReplay(payload, params) {
	if (!Array.isArray(payload.messages)) return;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") continue;
		const record = message;
		if (!params.thinkingEnabled) {
			if (!params.stripAssistantMessagesOnly || record.role === "assistant") delete record.reasoning_content;
			continue;
		}
		if (record.role !== "assistant" || params.shouldBackfillAssistantMessage && !params.shouldBackfillAssistantMessage(record)) continue;
		if (!("reasoning_content" in record) || params.replaceNullReasoningContent && record.reasoning_content == null) record.reasoning_content = "";
	}
}
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
function createDeepSeekV4OpenAICompatibleThinkingWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	const resolveReasoningEffort = params.resolveReasoningEffort ?? resolveDeepSeekV4ReasoningEffort;
	return (model, context, options) => {
		if (!params.shouldPatchModel(model)) return underlying(model, context, options);
		const thinkingLevel = options?.reasoning ?? params.thinkingLevel;
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (isDisabledDeepSeekV4ThinkingLevel(thinkingLevel)) {
				payload.thinking = { type: "disabled" };
				delete payload.reasoning_effort;
				delete payload.reasoning;
				normalizeOpenAICompatibleReasoningReplay(payload, { thinkingEnabled: false });
				return;
			}
			payload.thinking = { type: "enabled" };
			payload.reasoning_effort = resolveReasoningEffort(thinkingLevel);
			normalizeOpenAICompatibleReasoningReplay(payload, {
				thinkingEnabled: true,
				shouldBackfillAssistantMessage: params.shouldBackfillAssistantReasoningContent
			});
		});
	};
}
function promoteThinkingOnlyFinalOutputToText(message) {
	if (!message || typeof message !== "object") return;
	const record = message;
	if (record.stopReason !== "stop" && record.stopReason !== "length") return;
	if (!Array.isArray(record.content) || record.content.length === 0) return;
	let hasVisibleText = false;
	let hasToolCall = false;
	let hasVisibleThinking = false;
	for (const block of record.content) {
		if (!block || typeof block !== "object") continue;
		const typedBlock = block;
		if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text.trim()) hasVisibleText = true;
		if (typedBlock.type === "toolCall" || typedBlock.type === "tool_use") hasToolCall = true;
		if (typedBlock.type === "thinking" && typeof typedBlock.thinking === "string" && typedBlock.thinking.trim()) hasVisibleThinking = true;
	}
	if (hasVisibleText || hasToolCall || !hasVisibleThinking) return;
	record.content = record.content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const typedBlock = block;
		if (typedBlock.type !== "thinking" || typeof typedBlock.thinking !== "string" || !typedBlock.thinking.trim()) return block;
		return {
			type: "text",
			text: typedBlock.thinking
		};
	});
}
function wrapThinkingOnlyFinalTextStream(stream) {
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		promoteThinkingOnlyFinalOutputToText(message);
		return message;
	};
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = function() {
		const iterator = originalAsyncIterator();
		return {
			async next() {
				const result = await iterator.next();
				if (!result.done && result.value && typeof result.value === "object") {
					const event = result.value;
					promoteThinkingOnlyFinalOutputToText(event.partial);
					promoteThinkingOnlyFinalOutputToText(event.message);
				}
				return result;
			},
			async return(value) {
				return iterator.return?.(value) ?? {
					done: true,
					value: void 0
				};
			},
			async throw(error) {
				return iterator.throw?.(error) ?? {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	};
	return stream;
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function createThinkingOnlyFinalTextWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (!params.shouldPatchModel(model)) return maybeStream;
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapThinkingOnlyFinalTextStream(stream));
		return wrapThinkingOnlyFinalTextStream(maybeStream);
	};
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingPayloadWrapper(baseStreamFn, thinkingLevel) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		if (model.api === "google-generative-ai") sanitizeGoogleThinkingPayload({
			payload,
			modelId: model.id,
			thinkingLevel
		});
	});
}
//#endregion
//#region src/llm/providers/stream-wrappers/minimax.ts
function isMinimaxAnthropicMessagesModel(model) {
	return model.api === "anthropic-messages" && (model.provider === "minimax" || model.provider === "minimax-portal");
}
function isMinimaxM3Model(model) {
	const modelId = typeof model.id === "string" ? model.id.trim() : "";
	return /^MiniMax-M3(\b|[-.])/i.test(modelId);
}
function resolvePositiveMaxTokens(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function createMinimaxThinkingDisabledWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!isMinimaxAnthropicMessagesModel(model)) return underlying(model, context, options);
		const isM3 = isMinimaxM3Model(model);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (isM3) {
				const thinkingType = asOptionalRecord(payload.thinking)?.type;
				if (thinkingLevel === void 0 && thinkingType === "disabled") delete payload.thinking;
				else if (thinkingLevel !== "off" && (thinkingType === "enabled" || thinkingType === "disabled")) {
					payload.thinking = { type: "adaptive" };
					const maxTokens = resolvePositiveMaxTokens(options?.maxTokens);
					if (maxTokens !== void 0) payload.max_tokens = maxTokens;
				}
			}
			if (!isM3 && payload.thinking === void 0) payload.thinking = { type: "disabled" };
		});
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/moonshot.ts
/** Detects SiliconFlow Pro models that require thinking=null instead of thinking="off". */
function shouldApplySiliconFlowThinkingOffCompat(params) {
	return params.provider === "siliconflow" && params.thinkingLevel === "off" && params.modelId.startsWith("Pro/");
}
/** Wraps Moonshot-compatible requests to rewrite SiliconFlow thinking-off payloads. */
function createSiliconFlowThinkingWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		if (payloadObj.thinking === "off") payloadObj.thinking = null;
	});
}
//#endregion
//#region src/llm/providers/stream-wrappers/proxy.ts
function resolveModelEndpointClass(model) {
	return getModelProviderRequestRouteFacts(model)?.capabilities.endpointClass ?? resolveProviderRequestPolicy({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		capability: "llm",
		transport: "stream"
	}).endpointClass;
}
/** @deprecated OpenRouter provider-owned stream helper; do not use from third-party plugins. */
function createOpenRouterSystemCacheWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const provider = readStringValue(model.provider);
		const modelId = readStringValue(model.id);
		const endpointClass = resolveModelEndpointClass(model);
		if (!modelId || !isAnthropicModelRef(modelId) || !(endpointClass === "openrouter" || endpointClass === "default" && normalizeOptionalLowercaseString(provider) === "openrouter")) return underlying(model, context, options);
		const isCompletions = model.api === "openai-completions";
		const cacheRetention = readCacheRetention(options?.cacheRetention) ?? readCacheRetention(extraParams?.cacheRetention);
		return streamWithPayloadPatch(underlying, model, context, isCompletions ? {
			...options,
			cacheRetention
		} : stripCacheRetentionOption(options), (payloadObj) => {
			(isCompletions ? applyCompletionsAnthropicCacheControl : applyAnthropicEphemeralCacheControlMarkers)(payloadObj, resolveAnthropicEphemeralCacheControl(readStringValue(model.baseUrl), cacheRetention) ?? null);
		});
	};
}
function readCacheRetention(value) {
	return value === "long" || value === "none" || value === "short" ? value : void 0;
}
function stripCacheRetentionOption(options) {
	if (!options || !Object.hasOwn(options, "cacheRetention")) return options;
	const { cacheRetention: _cacheRetention, ...rest } = options;
	return rest;
}
//#endregion
//#region src/agents/embedded-agent-runner/extra-params.ts
function requireBaseStreamFn(streamFn) {
	if (!streamFn) throw new Error("Cannot apply stream policy without a lifecycle-owned base stream.");
	return streamFn;
}
const REQUEST_SCOPED_EXTRA_PARAM_KEYS = /* @__PURE__ */ new Set([
	"response_format",
	"responseFormat",
	"stop"
]);
const GPT_PARALLEL_TOOL_CALLS_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses"
]);
/** True when a provider API accepts GPT parallel-tool-call payload settings. */
function supportsGptParallelToolCallsPayload(api) {
	return typeof api === "string" && GPT_PARALLEL_TOOL_CALLS_APIS.has(api);
}
/**
* Resolve provider-specific extra params from model config.
* Used to pass through stream params like temperature/maxTokens.
*/
function resolveExtraParams(params) {
	const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	const sources = [
		defaultParams,
		modelParams,
		agentModelParams,
		agentParams
	];
	const merged = Object.assign({}, ...sources);
	canonicalizeExtraParamAlias(merged, sources, ["parallel_tool_calls", "parallelToolCalls"]);
	canonicalizeExtraParamAlias(merged, [
		modelParams,
		agentModelParams,
		agentParams
	], ["text_verbosity", "textVerbosity"]);
	canonicalizeExtraParamAlias(merged, sources, ["response_format", "responseFormat"]);
	canonicalizeMaxTokensParam({
		merged,
		sources
	});
	canonicalizeExtraParamAlias(merged, sources, ["cached_content", "cachedContent"], "cachedContent");
	if (params.provider === "openrouter") canonicalizeOpenRouterResponseCacheParams(merged, sources);
	applyDefaultOpenAIGptRuntimeParams(params, merged);
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function resolveSupportedTransport(value) {
	return value === "sse" || value === "websocket" || value === "websocket-cached" || value === "auto" ? value : void 0;
}
function hasExplicitTransportSetting(settings) {
	return Object.hasOwn(settings, "transport");
}
function resolvePreparedExtraParams(params) {
	const resolvedExtraParams = params.resolvedExtraParams ?? resolveExtraParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	const override = stripRequestScopedExtraParams(sanitizeExtraParamsOverride(params.extraParamsOverride));
	const merged = {
		...sanitizeExtraParamsRecord(resolvedExtraParams),
		...override
	};
	canonicalizeMaxTokensParam({
		merged,
		sources: [resolvedExtraParams, override]
	});
	canonicalizeExtraParamAlias(merged, [resolvedExtraParams, override], ["cached_content", "cachedContent"], "cachedContent");
	if (params.provider === "openrouter") canonicalizeOpenRouterResponseCacheParams(merged, [resolvedExtraParams, override]);
	const { plugin } = ensureProviderRuntimePluginHandle({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHandle: params.providerRuntimeHandle ?? getModelProviderRuntimePluginHandle(params.model)
	});
	const context = {
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.provider,
		modelId: params.modelId,
		model: params.model,
		thinkingLevel: params.thinkingLevel
	};
	const prepared = plugin?.prepareExtraParams?.({
		...context,
		extraParams: merged
	}) ?? merged;
	const transportPatch = plugin?.extraParamsForTransport?.({
		...context,
		extraParams: prepared,
		transport: params.resolvedTransport ?? resolveSupportedTransport(prepared.transport)
	})?.patch;
	const result = transportPatch ? {
		...prepared,
		...transportPatch
	} : prepared;
	canonicalizeMaxTokensParam({
		merged: result,
		sources: [prepared, transportPatch ?? void 0]
	});
	return result;
}
function sanitizeExtraParamsRecord(value) {
	if (!value) return;
	return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "__proto__" && key !== "prototype" && key !== "constructor"));
}
function sanitizeExtraParamsOverride(value) {
	return value && Object.keys(value).length > 0 ? sanitizeExtraParamsRecord(Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0))) : void 0;
}
function stripRequestScopedExtraParams(value) {
	if (!value) return;
	const filtered = Object.fromEntries(Object.entries(value).filter(([key]) => !REQUEST_SCOPED_EXTRA_PARAM_KEYS.has(key)));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function hasRequestScopedExtraParams(value) {
	if (!value) return false;
	return [...REQUEST_SCOPED_EXTRA_PARAM_KEYS].some((key) => Object.hasOwn(value, key));
}
function shouldApplyDefaultOpenAIGptRuntimeParams(params) {
	if (params.provider !== "openai") return false;
	return /^gpt-5(?:[.-]|$)/i.test(params.modelId);
}
function applyDefaultOpenAIGptRuntimeParams(params, merged) {
	if (!shouldApplyDefaultOpenAIGptRuntimeParams(params)) return;
	if (!Object.hasOwn(merged, "parallel_tool_calls") && !Object.hasOwn(merged, "parallelToolCalls")) merged.parallel_tool_calls = true;
	if (!Object.hasOwn(merged, "text_verbosity") && !Object.hasOwn(merged, "textVerbosity")) merged.text_verbosity = "low";
}
function resolveAgentTransportOverride(params) {
	const globalSettings = params.settingsManager.getGlobalSettings();
	const projectSettings = params.settingsManager.getProjectSettings();
	if (hasExplicitTransportSetting(globalSettings) || hasExplicitTransportSetting(projectSettings)) return;
	return resolveSupportedTransport(params.effectiveExtraParams?.transport);
}
function resolveExplicitSettingsTransport(params) {
	const globalSettings = params.settingsManager.getGlobalSettings();
	const projectSettings = params.settingsManager.getProjectSettings();
	if (!hasExplicitTransportSetting(globalSettings) && !hasExplicitTransportSetting(projectSettings)) return;
	return resolveSupportedTransport(params.sessionTransport);
}
function normalizeStopSequences(value) {
	const list = typeof value === "string" ? [value] : Array.isArray(value) ? value : void 0;
	if (!list) return;
	const sequences = list.filter((item) => typeof item === "string" && item.length > 0);
	return sequences.length > 0 ? sequences : void 0;
}
function createStreamFnWithExtraParams(baseStreamFn, extraParams, provider, model) {
	if (!extraParams || Object.keys(extraParams).length === 0) return;
	if (Object.hasOwn(extraParams, "cacheRetention") && parseCacheRetention(extraParams.cacheRetention) === void 0) log$1.warn("ignoring invalid cacheRetention param; expected \"none\", \"short\", or \"long\"");
	const streamParams = {};
	if (typeof extraParams.temperature === "number") streamParams.temperature = extraParams.temperature;
	if (typeof extraParams.topP === "number") streamParams.topP = extraParams.topP;
	const maxTokens = resolveMaxTokensParam(extraParams);
	if (maxTokens !== void 0) streamParams.maxTokens = maxTokens;
	const resolvedResponseFormat = resolveAliasedParamValue([extraParams], "response_format", "responseFormat");
	if (resolvedResponseFormat && typeof resolvedResponseFormat === "object" && !Array.isArray(resolvedResponseFormat)) streamParams.responseFormat = resolvedResponseFormat;
	const transport = resolveSupportedTransport(extraParams.transport);
	if (transport) streamParams.transport = transport;
	else if (extraParams.transport != null) {
		const transportSummary = typeof extraParams.transport === "string" ? extraParams.transport : typeof extraParams.transport;
		log$1.warn(`ignoring invalid transport param: ${transportSummary}`);
	}
	const cachedContent = typeof extraParams.cachedContent === "string" ? extraParams.cachedContent : typeof extraParams.cached_content === "string" ? extraParams.cached_content : void 0;
	if (typeof cachedContent === "string" && cachedContent.trim()) streamParams.cachedContent = cachedContent.trim();
	const resolvedFrequencyPenalty = resolveAliasedParamValueFromKeys([extraParams], ["frequencyPenalty", "frequency_penalty"]);
	const resolvedPresencePenalty = resolveAliasedParamValueFromKeys([extraParams], ["presencePenalty", "presence_penalty"]);
	const resolvedSeed = extraParams.seed;
	if (typeof resolvedFrequencyPenalty === "number") streamParams.frequencyPenalty = resolvedFrequencyPenalty;
	if (typeof resolvedPresencePenalty === "number") streamParams.presencePenalty = resolvedPresencePenalty;
	if (typeof resolvedSeed === "number") streamParams.seed = resolvedSeed;
	const resolvedStop = normalizeStopSequences(extraParams.stop);
	if (resolvedStop) streamParams.stop = resolvedStop;
	const readCacheCompat = (m) => m?.api === "openai-completions" ? resolveOpenAICompletionsCompat(m) : m?.compat;
	if (log$1.isEnabled("debug")) {
		const initialCacheRetention = resolveCacheRetention(extraParams, provider, typeof model?.api === "string" ? model.api : void 0, typeof model?.id === "string" ? model.id : void 0, readCacheCompat(model), model?.baseUrl);
		if (Object.keys(streamParams).length > 0 || initialCacheRetention) {
			const debugParams = {
				...streamParams,
				cacheRetention: initialCacheRetention
			};
			log$1.debug(`creating streamFn wrapper with params: ${JSON.stringify(debugParams)}`);
		}
	}
	const underlying = requireBaseStreamFn(baseStreamFn);
	const wrappedStreamFn = (callModel, context, options) => {
		const cacheRetention = resolveCacheRetention(extraParams, provider, typeof callModel.api === "string" ? callModel.api : void 0, typeof callModel.id === "string" ? callModel.id : void 0, readCacheCompat(callModel), callModel.baseUrl);
		if (Object.keys(streamParams).length === 0 && !cacheRetention) return underlying(callModel, context, options);
		const effectiveCacheRetention = options?.cacheRetention ?? cacheRetention;
		return underlying(callModel, context, {
			...streamParams,
			...options,
			...effectiveCacheRetention ? { cacheRetention: effectiveCacheRetention } : {}
		});
	};
	return wrappedStreamFn;
}
function resolveAliasedParamValue(sources, snakeCaseKey, camelCaseKey) {
	return resolveAliasedParamValueFromKeys(sources, [snakeCaseKey, camelCaseKey]);
}
function resolveAliasedParamValueFromKeys(sources, keys) {
	let resolved = void 0;
	let seen = false;
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			if (!Object.hasOwn(source, key)) continue;
			resolved = source[key];
			seen = true;
			break;
		}
	}
	return seen ? resolved : void 0;
}
function canonicalizeExtraParamAlias(merged, sources, keys, canonical = keys[0]) {
	const resolved = resolveAliasedParamValueFromKeys(sources, keys);
	if (resolved !== void 0) {
		merged[canonical] = resolved;
		delete merged[keys[0] === canonical ? keys[1] : keys[0]];
	}
}
function applyCanonicalAliasedParamValue(params) {
	const resolved = resolveAliasedParamValueFromKeys(params.sources, params.keys);
	if (resolved === void 0) return;
	for (const key of params.keys) delete params.merged[key];
	params.merged[params.canonicalKey] = resolved;
}
function canonicalizeOpenRouterResponseCacheParams(merged, sources) {
	applyCanonicalAliasedParamValue({
		merged,
		sources,
		keys: ["responseCache", "response_cache"],
		canonicalKey: "responseCache"
	});
	applyCanonicalAliasedParamValue({
		merged,
		sources,
		keys: [
			"responseCacheTtlSeconds",
			"response_cache_ttl_seconds",
			"responseCacheTtl",
			"response_cache_ttl"
		],
		canonicalKey: "responseCacheTtlSeconds"
	});
	applyCanonicalAliasedParamValue({
		merged,
		sources,
		keys: ["responseCacheClear", "response_cache_clear"],
		canonicalKey: "responseCacheClear"
	});
}
function createParallelToolCallsWrapper(baseStreamFn, enabled) {
	const underlying = requireBaseStreamFn(baseStreamFn);
	return (model, context, options) => {
		if (!supportsGptParallelToolCallsPayload(model.api)) return underlying(model, context, options);
		log$1.debug(`applying parallel_tool_calls=${enabled} for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} api=${model.api}`);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			payloadObj.parallel_tool_calls = enabled;
		});
	};
}
function shouldStripOpenAICompletionsStore(model) {
	if (model.api !== "openai-completions") return false;
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return !(getModelProviderRequestRouteFacts(model)?.capabilities ?? resolveProviderRequestPolicyConfig({
		provider: typeof model.provider === "string" ? model.provider : void 0,
		api: model.api,
		baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : void 0,
		compat,
		capability: "llm",
		transport: "stream"
	}).capabilities).usesKnownNativeOpenAIRoute;
}
function createOpenAICompletionsStoreCompatWrapper(baseStreamFn) {
	const underlying = requireBaseStreamFn(baseStreamFn);
	return (model, context, options) => {
		if (!shouldStripOpenAICompletionsStore(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			delete payloadObj.store;
		});
	};
}
function sanitizeExtraBodyRecord(value) {
	return Object.fromEntries(Object.entries(sanitizeExtraParamsRecord(value) ?? {}).filter(([, entry]) => entry !== void 0));
}
function resolveExtraBodyRecord(value, param) {
	if (value === void 0 || value === null) return;
	if (typeof value !== "object" || Array.isArray(value)) {
		log$1.warn(`ignoring invalid ${param} param: ${typeof value === "string" ? value : typeof value}`);
		return;
	}
	const record = sanitizeExtraBodyRecord(value);
	return Object.keys(record).length > 0 ? record : void 0;
}
function createOpenAICompletionsChatTemplateKwargsWrapper(params) {
	const underlying = requireBaseStreamFn(params.baseStreamFn);
	return (model, context, options) => {
		if (model.api !== "openai-completions") return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			const existing = payloadObj.chat_template_kwargs;
			if (existing && typeof existing === "object" && !Array.isArray(existing)) {
				payloadObj.chat_template_kwargs = {
					...existing,
					...params.configured
				};
				return;
			}
			payloadObj.chat_template_kwargs = params.configured;
		});
	};
}
const FRAMEWORK_MANAGED_EXTRA_BODY_KEYS = /* @__PURE__ */ new Set([
	"messages",
	"model",
	"stream"
]);
function createOpenAICompletionsExtraBodyWrapper(baseStreamFn, extraBody) {
	const underlying = requireBaseStreamFn(baseStreamFn);
	return (model, context, options) => {
		if (model.api !== "openai-completions") return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			const clobberedManagedKeys = Object.keys(extraBody).filter((key) => Object.hasOwn(payloadObj, key) && FRAMEWORK_MANAGED_EXTRA_BODY_KEYS.has(key));
			if (clobberedManagedKeys.length > 0) log$1.warn(`extra_body overrides framework-managed request keys: ${clobberedManagedKeys.join(", ")}`);
			Object.assign(payloadObj, extraBody);
		});
	};
}
function applyPrePluginStreamWrappers(ctx) {
	const baseExtraParams = ctx.override && hasRequestScopedExtraParams(ctx.override) ? stripRequestScopedExtraParams(ctx.effectiveExtraParams) : ctx.effectiveExtraParams;
	const streamParams = ctx.override ? {
		...baseExtraParams,
		...ctx.override
	} : baseExtraParams;
	const wrappedStreamFn = createStreamFnWithExtraParams(ctx.agent.streamFn, streamParams, ctx.provider, ctx.model);
	if (wrappedStreamFn) {
		log$1.debug(`applying extraParams to agent streamFn for ${ctx.provider}/${ctx.modelId}`);
		ctx.agent.streamFn = wrappedStreamFn;
	}
	if (shouldApplySiliconFlowThinkingOffCompat({
		provider: ctx.provider,
		modelId: ctx.modelId,
		thinkingLevel: ctx.thinkingLevel
	})) {
		log$1.debug(`normalizing thinking=off to thinking=null for SiliconFlow compatibility (${ctx.provider}/${ctx.modelId})`);
		ctx.agent.streamFn = createSiliconFlowThinkingWrapper(ctx.agent.streamFn);
	}
}
function applyPostPluginStreamWrappers(ctx) {
	const streamParams = ctx.override ? {
		...ctx.effectiveExtraParams,
		...ctx.override
	} : ctx.effectiveExtraParams;
	ctx.agent.streamFn = createOpenRouterSystemCacheWrapper(ctx.agent.streamFn, streamParams);
	ctx.agent.streamFn = createOpenAIStringContentWrapper(ctx.agent.streamFn);
	ctx.agent.streamFn = createOpenAICompletionsStrictMessageKeysWrapper(ctx.agent.streamFn);
	ctx.agent.streamFn = createOpenAICompletionsToolsCompatWrapper(ctx.agent.streamFn);
	if (!ctx.providerWrapperHandled) {
		ctx.agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: ctx.agent.streamFn,
			thinkingLevel: ctx.thinkingLevel,
			shouldPatchModel: (model) => isDeepSeekV4OpenAICompatibleModel(model) && deepSeekV4NativeThinkingAllowedByCompat(model)
		});
		ctx.agent.streamFn = createDeepSeekV4NonNativeCompatSanitizerWrapper(ctx.agent.streamFn);
		ctx.agent.streamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
			baseStreamFn: ctx.agent.streamFn,
			thinkingLevel: ctx.thinkingLevel,
			shouldPatchModel: isMiMoReasoningOpenAICompatibleModel
		});
		ctx.agent.streamFn = createThinkingOnlyFinalTextWrapper({
			baseStreamFn: ctx.agent.streamFn,
			shouldPatchModel: isMiMoReasoningAsVisibleTextOpenAICompatibleModel
		});
		ctx.agent.streamFn = createGoogleThinkingPayloadWrapper(ctx.agent.streamFn, ctx.thinkingLevel);
		ctx.agent.streamFn = createOpenAIResponsesContextManagementWrapper(ctx.agent.streamFn, ctx.effectiveExtraParams);
	}
	ctx.agent.streamFn = createMinimaxThinkingDisabledWrapper(ctx.agent.streamFn, ctx.thinkingLevel);
	const configuredChatTemplateKwargs = resolveExtraBodyRecord(resolveAliasedParamValue([ctx.effectiveExtraParams, ctx.override], "chat_template_kwargs", "chatTemplateKwargs"), "chat_template_kwargs");
	if (configuredChatTemplateKwargs) ctx.agent.streamFn = createOpenAICompletionsChatTemplateKwargsWrapper({
		baseStreamFn: ctx.agent.streamFn,
		configured: configuredChatTemplateKwargs
	});
	const extraBody = resolveExtraBodyRecord(resolveAliasedParamValue([ctx.effectiveExtraParams, ctx.override], "extra_body", "extraBody"), "extra_body");
	if (extraBody) ctx.agent.streamFn = createOpenAICompletionsExtraBodyWrapper(ctx.agent.streamFn, extraBody);
	ctx.agent.streamFn = createOpenAICompletionsStoreCompatWrapper(ctx.agent.streamFn);
	const rawParallelToolCalls = resolveAliasedParamValue([ctx.effectiveExtraParams, ctx.override], "parallel_tool_calls", "parallelToolCalls");
	if (rawParallelToolCalls === void 0) return;
	if (typeof rawParallelToolCalls === "boolean") {
		ctx.agent.streamFn = createParallelToolCallsWrapper(ctx.agent.streamFn, rawParallelToolCalls);
		return;
	}
	if (rawParallelToolCalls === null) {
		log$1.debug("parallel_tool_calls suppressed by null override, skipping injection");
		return;
	}
	const summary = typeof rawParallelToolCalls === "string" ? rawParallelToolCalls : typeof rawParallelToolCalls;
	log$1.warn(`ignoring invalid parallel_tool_calls param: ${summary}`);
}
function normalizeDeepSeekV4CandidateId(modelId) {
	if (typeof modelId !== "string") return;
	const normalized = modelId.trim().toLowerCase();
	const suffixIndex = normalized.indexOf(":");
	return (suffixIndex === -1 ? normalized : normalized.slice(0, suffixIndex)).split("/").pop();
}
function isDeepSeekV4OpenAICompatibleModel(model) {
	return isDeepSeekV4OpenAICompletionsModel(model) && !isMicrosoftFoundryProviderId(model.provider);
}
function isDeepSeekV4OpenAICompletionsModel(model) {
	const normalizedModelId = normalizeDeepSeekV4CandidateId(model.id);
	return model.api === "openai-completions" && (normalizedModelId === "deepseek-v4-flash" || normalizedModelId === "deepseek-v4-pro");
}
function isMicrosoftFoundryProviderId(provider) {
	if (typeof provider !== "string") return false;
	const normalizedProvider = provider.trim().toLowerCase();
	return normalizedProvider === "microsoft-foundry" || normalizedProvider.startsWith("microsoft-foundry-");
}
/**
* The DeepSeek V4 wrapper emits the deepseek-native `thinking: { type }` wire
* format (plus `reasoning_effort`). Honor an explicit `compat.thinkingFormat`
* override that selects a different reasoning format: some OpenAI-compatible
* deployments — notably Azure AI Foundry DeepSeek V4 — reject the `thinking`
* parameter outright, even `thinking: { type: "disabled" }`. When no override
* exists, honor provider-level detection for non-native formats such as
* OpenRouter while keeping id-based fallback for unknown DeepSeek-compatible
* proxy routes.
*/
function deepSeekV4NativeThinkingAllowedByCompat(model) {
	const thinkingFormat = resolveDeepSeekV4ThinkingFormatOverride(model);
	return thinkingFormat === void 0 || thinkingFormat === "deepseek";
}
function resolveDeepSeekV4ThinkingFormatOverride(model) {
	const compat = model.compat;
	const configured = compat && typeof compat === "object" ? compat.thinkingFormat : void 0;
	if (typeof configured === "string") return configured;
	const detected = detectOpenAICompletionsCompat(model).defaults.thinkingFormat;
	return detected === "openrouter" || detected === "together" || detected === "zai" ? detected : void 0;
}
function createDeepSeekV4NonNativeCompatSanitizerWrapper(baseStreamFn) {
	if (!baseStreamFn) return;
	return (model, context, options) => {
		if (!shouldSanitizeDeepSeekV4NonNativeFields(model)) return baseStreamFn(model, context, options);
		return streamWithPayloadPatch(baseStreamFn, model, context, options, (payload) => {
			delete payload.thinking;
			stripDeepSeekV4ReasoningContent(payload);
		});
	};
}
function shouldSanitizeDeepSeekV4NonNativeFields(model) {
	return isDeepSeekV4OpenAICompletionsModel(model) && (isMicrosoftFoundryProviderId(model.provider) || !deepSeekV4NativeThinkingAllowedByCompat(model));
}
function stripDeepSeekV4ReasoningContent(payload) {
	if (!Array.isArray(payload.messages)) return;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") continue;
		delete message.reasoning_content;
	}
}
const MIMO_REASONING_OPENAI_COMPATIBLE_MODEL_IDS = /* @__PURE__ */ new Set([
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	...[
		"flash",
		"pro",
		"pro-ultraspeed"
	].map((variant) => `mimo-v2.6-${variant}`)
]);
const MIMO_REASONING_AS_VISIBLE_TEXT_MODEL_IDS = /* @__PURE__ */ new Set(["mimo-v2-pro", "mimo-v2-omni"]);
function isMiMoReasoningOpenAICompatibleModel(model) {
	const normalizedModelId = normalizeDeepSeekV4CandidateId(model.id);
	return model.api === "openai-completions" && normalizedModelId !== void 0 && MIMO_REASONING_OPENAI_COMPATIBLE_MODEL_IDS.has(normalizedModelId);
}
function isMiMoReasoningAsVisibleTextOpenAICompatibleModel(model) {
	const normalizedModelId = normalizeDeepSeekV4CandidateId(model.id);
	return model.api === "openai-completions" && normalizedModelId !== void 0 && MIMO_REASONING_AS_VISIBLE_TEXT_MODEL_IDS.has(normalizedModelId);
}
/**
* Apply extra params (like temperature) to an agent's streamFn.
* Also applies verified provider-specific request wrappers, such as OpenRouter attribution.
*/
function applyExtraParamsToAgent(agent, cfg, provider, modelId, extraParamsOverride, thinkingLevel, agentId, workspaceDir, model, agentDir, resolvedTransport, options) {
	const providerRuntimeHandle = ensureProviderRuntimePluginHandle({
		provider,
		modelId,
		config: cfg,
		workspaceDir,
		runtimeHandle: getModelProviderRuntimePluginHandle(model)
	});
	const resolvedExtraParams = resolveExtraParams({
		cfg,
		provider,
		modelId,
		agentId
	});
	const override = sanitizeExtraParamsOverride(extraParamsOverride);
	const effectiveExtraParams = options?.preparedExtraParams ?? resolvePreparedExtraParams({
		cfg,
		provider,
		modelId,
		extraParamsOverride,
		thinkingLevel,
		agentId,
		agentDir,
		workspaceDir,
		resolvedExtraParams,
		model,
		resolvedTransport,
		providerRuntimeHandle
	});
	const wrapperContext = {
		agent,
		cfg,
		provider,
		modelId,
		agentDir,
		workspaceDir,
		thinkingLevel,
		model,
		effectiveExtraParams,
		resolvedExtraParams,
		override
	};
	const providerStreamBase = agent.streamFn;
	const nativeWebSearchAllowedByToolPolicy = options?.nativeWebSearchPolicyContext ? isNativeWebSearchAllowedByToolPolicy({
		config: cfg,
		modelProvider: model?.provider,
		modelId: model?.id,
		agentId,
		...options.nativeWebSearchPolicyContext
	}) : void 0;
	const pluginWrappedStreamFn = providerRuntimeHandle.plugin?.wrapStreamFn?.({
		config: cfg,
		agentDir,
		workspaceDir,
		agentId,
		nativeWebSearchAllowedByToolPolicy,
		provider,
		modelId,
		extraParams: effectiveExtraParams,
		thinkingLevel,
		model,
		streamFn: providerStreamBase
	}) ?? void 0;
	agent.streamFn = pluginWrappedStreamFn ?? providerStreamBase;
	applyPrePluginStreamWrappers(wrapperContext);
	const providerWrapperHandled = pluginWrappedStreamFn !== void 0 && pluginWrappedStreamFn !== providerStreamBase;
	applyPostPluginStreamWrappers({
		...wrapperContext,
		providerWrapperHandled
	});
	return {
		effectiveExtraParams,
		nativeWebSearchAllowedByToolPolicy
	};
}
//#endregion
export { resolvePreparedExtraParams as a, logCodeModeDiagnostic as c, isGooglePromptCacheEligible as d, resolveCacheRetention as f, resolveExtraParams as i, resolveOpenAITextVerbosity as l, isAnthropicModelRef as m, resolveAgentTransportOverride as n, createCodexNativeWebSearchWrapper as o, isAnthropicFamilyCacheTtlEligible as p, resolveExplicitSettingsTransport as r, isCodeModeDiagnosticEnabled as s, applyExtraParamsToAgent as t, streamWithPayloadPatch as u };
