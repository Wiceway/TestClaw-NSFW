import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as runPluginStreamConsumer } from "./plugin-instance-scope-B1RUw70q.js";
import { l as isSyntheticMissingToolResult, n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY } from "./tool-result-pairing-9JojAaN6.js";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DVyJYen1.js";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-BL3dBQkw.js";
import { a as attachModelProviderRequestTransport, c as getModelProviderRequestTransport, l as inheritModelProviderRequestRouteFacts, p as resolveProviderRequestPolicyConfig, s as getModelProviderRequestRouteFacts } from "./provider-local-service-reconcile-DGJJw1a3.js";
import { f as wrapProviderSimpleCompletionStreamFn, r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-AjNWsmeV.js";
import { M as resolveProviderTransportTurnStateWithPlugin, O as resolveProviderStreamFn } from "./provider-runtime-B3-FZB4p.js";
import { o as getModelProviderLocalService, t as attachModelProviderLocalService } from "./provider-local-service-WdtMjVxb.js";
import { n as repairToolUseResultPairing } from "./session-transcript-repair-BNL2e-6A.js";
import "./ai-transport-host-dW4GPCYL.js";
import { t as event_stream_exports } from "./event-stream-IPGDcRrP.js";
import { n as buildStreamErrorAssistantMessage } from "./stream-message-shared-DXRciV40.js";
import { FAILED_ASSISTANT_REPLAY_TEXT, isReasoningOnlyLengthAssistantTurn, projectCopilotRequestFacts, resolveFailedAssistantReplay } from "@testclaw/ai/internal/shared";
import { configureAiTransportHost, getAiTransportHost } from "@testclaw/ai";
import { resolveModelBoundThinkingReplayMode } from "@testclaw/ai/internal/anthropic";
//#region src/agents/anthropic-vertex-stream.ts
/**
* Anthropic Vertex stream facade.
* Keeps Vertex-specific provider implementation in the bundled provider plugin
* while core imports a small stable factory.
*/
function loadAnthropicVertexStreamFacade() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "anthropic-vertex",
		artifactBasename: "api.js"
	});
}
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
function createAnthropicVertexStreamFnForModel(model, env = process.env) {
	return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
//#endregion
//#region src/agents/copilot-dynamic-headers.ts
/**
* Builds GitHub Copilot provider compatibility headers from message content.
*/
/** Return true when Copilot should receive its vision request header. */
function hasCopilotVisionInput(messages) {
	return projectCopilotRequestFacts(messages, "nested").hasImages;
}
/** Build per-request Copilot headers, including initiator and vision flags. */
function buildCopilotDynamicHeaders(params) {
	return {
		"x-initiator": projectCopilotRequestFacts(params.messages, "nested", params.hasImages).initiator,
		...params.hasImages ? { "Copilot-Vision-Request": "true" } : {}
	};
}
//#endregion
//#region src/agents/custom-api-registry.ts
const CUSTOM_API_SOURCE_PREFIX = "testclaw-custom-api:";
/** Returns the registry source id used for a custom API stream function. */
function getCustomApiRegistrySourceId(api) {
	return `${CUSTOM_API_SOURCE_PREFIX}${api}`;
}
function adaptCustomStream(model, stream) {
	if (!(stream instanceof Promise)) return stream;
	const adapted = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			await runPluginStreamConsumer(stream, async () => {
				const resolved = await stream;
				for await (const event of resolved) adapted.push(event);
				adapted.end(await resolved.result());
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			const message = buildStreamErrorAssistantMessage({
				model,
				errorMessage
			});
			adapted.push({
				type: "error",
				reason: "error",
				error: message
			});
		}
	})();
	return adapted;
}
/** Registers a custom API stream function when no provider already owns it. */
function ensureCustomApiRegistered(registry, api, streamFn) {
	if (registry.getApiProvider(api)) return false;
	registry.registerApiProvider({
		api,
		stream: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options)),
		streamSimple: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options))
	}, getCustomApiRegistrySourceId(api));
	return true;
}
//#endregion
//#region src/agents/transport-message-transform.ts
/**
* Normalizes transcript messages before provider transport replay. It drops
* unsafe failed turns, maps tool-call ids across model boundaries, and fills
* strict provider tool-result gaps when supported.
*/
const SYNTHETIC_TOOL_RESULT_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"testclaw-anthropic-messages-transport",
	"bedrock-converse-stream",
	"google-generative-ai",
	"testclaw-google-generative-ai-transport",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses",
	"testclaw-openai-responses-transport",
	"testclaw-openai-chatgpt-responses-transport",
	"testclaw-azure-openai-responses-transport"
]);
const OPENAI_RESPONSES_ABORTED_OUTPUT_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses",
	"testclaw-openai-responses-transport",
	"testclaw-openai-chatgpt-responses-transport",
	"testclaw-azure-openai-responses-transport"
]);
function defaultAllowSyntheticToolResults(modelApi) {
	return SYNTHETIC_TOOL_RESULT_APIS.has(modelApi);
}
/** Transforms transcript messages into a provider-safe replay context. */
function transformTransportMessages(messages, model, normalizeToolCallId, options) {
	const allowSyntheticToolResults = defaultAllowSyntheticToolResults(model.api);
	const syntheticToolResultText = OPENAI_RESPONSES_ABORTED_OUTPUT_APIS.has(model.api) ? "aborted" : "No result provided";
	const toolCallIdMap = /* @__PURE__ */ new Map();
	let hasCrossModelAsyncCalls = false;
	const transformed = messages.map((msg) => {
		if (msg.role === "user") return msg;
		if (msg.role === "toolResult") {
			const result = isSyntheticMissingToolResult(msg) && (msg.content.length !== 1 || msg.content[0]?.type !== "text" || msg.content[0].text !== syntheticToolResultText) ? {
				...msg,
				content: [{
					type: "text",
					text: syntheticToolResultText
				}],
				details: {
					...isRecord(msg.details) ? msg.details : {},
					[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true
				}
			} : msg;
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			return normalizedId && normalizedId !== msg.toolCallId ? {
				...result,
				toolCallId: normalizedId
			} : result;
		}
		if (msg.role !== "assistant") return msg;
		const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
			source: {
				provider: msg.provider,
				api: msg.api,
				modelId: msg.model,
				responseModelId: msg.responseModel
			},
			target: {
				provider: model.provider,
				api: model.api,
				modelId: model.id,
				modelParams: model.params
			}
		});
		const isSameModel = modelBoundThinkingReplayMode === "preserve" || msg.provider === model.provider && msg.api === model.api && msg.model === model.id;
		const sourceContent = Array.isArray(msg.content) ? msg.content : msg.content != null && typeof msg.content === "object" ? [msg.content] : [];
		const content = [];
		for (const block of sourceContent) {
			if (block.type === "thinking") {
				if (modelBoundThinkingReplayMode === "drop") continue;
				if (block.redacted) {
					if (isSameModel) content.push(block);
					continue;
				}
				if (isSameModel && block.thinkingSignature) {
					content.push(block);
					continue;
				}
				if (!block.thinking.trim()) continue;
				content.push(isSameModel ? block : {
					type: "text",
					text: block.thinking
				});
				continue;
			}
			if (block.type === "text") {
				content.push(isSameModel ? block : {
					type: "text",
					text: block.text
				});
				continue;
			}
			if (block.type !== "toolCall") {
				content.push(block);
				continue;
			}
			let normalizedToolCall = block;
			if (!isSameModel && block.async) {
				hasCrossModelAsyncCalls = true;
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.async;
			}
			if (!isSameModel && block.thoughtSignature && options?.preserveCrossModelToolCallThoughtSignature !== true) {
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.thoughtSignature;
			}
			if ((!isSameModel || options?.normalizeSameModelToolCallIds === true) && normalizeToolCallId) {
				const normalizedId = normalizeToolCallId(block.id, model, msg);
				if (normalizedId !== block.id) {
					toolCallIdMap.set(block.id, normalizedId);
					normalizedToolCall = {
						...normalizedToolCall,
						id: normalizedId
					};
				}
			}
			content.push(normalizedToolCall);
		}
		return {
			...msg,
			content
		};
	});
	const requiresPairing = allowSyntheticToolResults || hasCrossModelAsyncCalls;
	let replayLength = 0;
	transformed.forEach((msg, index) => {
		const original = messages[index];
		let replayMessage = msg;
		if (original) {
			if (isReasoningOnlyLengthAssistantTurn(original)) return;
			switch (resolveFailedAssistantReplay(original, { pairingAware: requiresPairing })) {
				case "drop": return;
				case "marker": replayMessage = {
					...msg,
					content: [{
						type: "text",
						text: FAILED_ASSISTANT_REPLAY_TEXT
					}]
				};
			}
		}
		transformed[replayLength++] = replayMessage;
	});
	transformed.length = replayLength;
	if (!requiresPairing) return transformed;
	return repairToolUseResultPairing(transformed, {
		erroredAssistantResultPolicy: "drop",
		missingToolResultText: syntheticToolResultText,
		preserveUnframedToolResults: options?.preserveUnframedToolResults
	}).messages;
}
//#endregion
//#region src/agents/ai-transport-runtime-host.ts
let configured = false;
/** Installs the agent and plugin ports only on paths that execute provider runtime. */
function configureAiTransportRuntimeHost() {
	if (configured) return;
	const host = getAiTransportHost();
	configureAiTransportHost({
		...host,
		plugin: {
			...host.plugin,
			resolveProviderStream: (params) => resolveProviderStreamFn({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					config: params.context.config,
					model: params.context.model
				}
			}),
			resolveTransportTurnState: (params) => resolveProviderTransportTurnStateWithPlugin({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					model: params.context.model
				}
			}),
			wrapSimpleCompletionStream: (params) => wrapProviderSimpleCompletionStreamFn({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					config: params.context.config,
					model: params.context.model
				}
			}),
			createAnthropicVertexStream: createAnthropicVertexStreamFnForModel
		},
		buildCopilotDynamicHeaders: (messages) => buildCopilotDynamicHeaders({
			messages,
			hasImages: hasCopilotVisionInput(messages)
		}),
		resolveProviderRequestCapabilities: (input) => getModelProviderRequestRouteFacts(input.model ?? {})?.capabilities ?? resolveProviderRequestCapabilities(input),
		resolveProviderRequestHeaders: (input) => resolveProviderRequestPolicyConfig({
			...input,
			routeFacts: getModelProviderRequestRouteFacts(input.model ?? {}),
			capability: "llm",
			transport: "stream"
		}).headers,
		requiresManagedTransport: (model) => {
			const request = getModelProviderRequestTransport(model);
			return Boolean(request?.proxy || request?.tls || getModelProviderLocalService(model));
		},
		inheritManagedTransport: (source, target) => inheritModelProviderRequestRouteFacts(source, attachModelProviderLocalService(attachModelProviderRequestTransport(target, getModelProviderRequestTransport(source)), getModelProviderLocalService(source))),
		transformTransportMessages,
		registerCustomApi: ensureCustomApiRegistered
	});
	configured = true;
}
configureAiTransportRuntimeHost();
//#endregion
export { createAnthropicVertexStreamFnForModel as a, hasCopilotVisionInput as i, ensureCustomApiRegistered as n, buildCopilotDynamicHeaders as r, configureAiTransportRuntimeHost as t };
