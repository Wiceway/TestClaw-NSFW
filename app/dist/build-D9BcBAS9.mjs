import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BaiqOb60.mjs";
import { o as hasReplyPayloadContent } from "./payload-Bcra-CYh.mjs";
import { d as resolveProviderRuntimePluginHandle, s as resolveProviderFollowupFallbackRoute } from "./provider-hook-runtime-VNdazVeu.mjs";
import { A as resolveProviderSystemPromptContribution, j as resolveProviderTextTransforms, z as transformProviderSystemPrompt } from "./provider-runtime-v9pi62W8.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-BxdJcx2E.mjs";
import { a as resolvePreparedExtraParams } from "./extra-params-dXtlD4eQ.mjs";
import { h as resolveTranscriptPolicy } from "./helpers-CjdWAoft.mjs";
import { i as normalizeProviderToolSchemas, r as logProviderToolSchemaDiagnostics } from "./tools-Cwa6aQWm.mjs";
import { t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-CPShl8md.mjs";
//#region src/agents/runtime-plan/build.ts
function asAssistantConfig(value) {
	return asOptionalRecord(value);
}
function asProviderRuntimeModel(value) {
	return value !== void 0 ? value : void 0;
}
function resolvePreparedMetadataSnapshot(params) {
	return params.metadataSnapshot;
}
function resolvePreparedProviderRuntimeHandle(params) {
	if (params.providerRuntimeHandle?.prepared === true && params.providerRuntimeHandle.provider === params.provider && params.providerRuntimeHandle.modelId === params.modelId && params.providerRuntimeHandle.workspaceDir === params.workspaceDir) return params.providerRuntimeHandle;
	const metadataSnapshot = resolvePreparedMetadataSnapshot(params);
	return {
		...resolveProviderRuntimePluginHandle({
			provider: params.provider,
			modelId: params.modelId,
			config: asAssistantConfig(params.config),
			workspaceDir: params.workspaceDir,
			env: process.env,
			...metadataSnapshot ? { pluginMetadataSnapshot: metadataSnapshot } : {}
		}),
		modelId: params.modelId,
		prepared: true
	};
}
/** Build delivery-specific runtime decisions for one provider/model. */
function buildAgentRuntimeDeliveryPlan(params) {
	const config = asAssistantConfig(params.config);
	const providerRuntimeHandle = resolvePreparedProviderRuntimeHandle(params);
	return {
		isSilentPayload(payload) {
			return isSilentReplyPayloadText(payload.text, "NO_REPLY") && !hasReplyPayloadContent({
				...payload,
				text: void 0
			}, { trimText: true });
		},
		resolveFollowupRoute(routeParams) {
			return resolveProviderFollowupFallbackRoute({
				provider: params.provider,
				config,
				workspaceDir: params.workspaceDir,
				runtimeHandle: providerRuntimeHandle,
				context: {
					config,
					agentDir: params.agentDir,
					workspaceDir: params.workspaceDir,
					provider: params.provider,
					modelId: params.modelId,
					payload: routeParams.payload,
					originatingChannel: routeParams.originatingChannel,
					originatingTo: routeParams.originatingTo,
					originRoutable: routeParams.originRoutable,
					dispatcherAvailable: routeParams.dispatcherAvailable
				}
			});
		}
	};
}
/** Build the complete runtime plan for an embedded agent attempt. */
function buildAgentRuntimePlan(params) {
	const config = asAssistantConfig(params.config);
	const model = asProviderRuntimeModel(params.model);
	const modelApi = params.modelApi ?? params.model?.api ?? void 0;
	const transport = params.resolvedTransport;
	const toolPlanningMetadataSnapshot = resolvePreparedMetadataSnapshot(params);
	const preparedPlanning = toolPlanningMetadataSnapshot ? { metadataSnapshot: toolPlanningMetadataSnapshot } : void 0;
	const providerRuntimeHandleForPlugins = resolvePreparedProviderRuntimeHandle(params);
	const auth = params.preparedAuthPlan ?? buildAgentRuntimeAuthPlan({
		provider: params.provider,
		modelId: params.modelId,
		authProfileProvider: params.authProfileProvider,
		authProfileMode: params.authProfileMode,
		sessionAuthProfileId: params.sessionAuthProfileId,
		sessionAuthProfileSource: params.sessionAuthProfileSource,
		sessionAuthProfileCandidateIds: params.sessionAuthProfileCandidateIds,
		modelRoute: params.modelRoute,
		config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: toolPlanningMetadataSnapshot,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding
	});
	const resolvedRef = {
		provider: params.provider,
		modelId: params.modelId,
		...modelApi ? { modelApi } : {},
		...params.harnessId ? { harnessId: params.harnessId } : {},
		...transport ? { transport } : {}
	};
	const toolContext = {
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins,
		modelId: params.modelId,
		modelApi,
		model
	};
	const resolveToolContext = (overrides) => ({
		...toolContext,
		...overrides?.workspaceDir !== void 0 ? { workspaceDir: overrides.workspaceDir } : {},
		...overrides?.modelApi !== void 0 ? { modelApi: overrides.modelApi } : {},
		...overrides?.model !== void 0 ? { model: asProviderRuntimeModel(overrides.model) } : {}
	});
	const resolveTranscriptRuntimePolicy = (overrides) => resolveTranscriptPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config,
		workspaceDir: overrides?.workspaceDir ?? params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins,
		modelApi: overrides?.modelApi ?? modelApi,
		model: asProviderRuntimeModel(overrides?.model) ?? model
	});
	const resolveTransportExtraParams = (overrides = {}) => resolvePreparedExtraParams({
		cfg: config,
		provider: params.provider,
		modelId: params.modelId,
		agentDir: params.agentDir,
		workspaceDir: overrides.workspaceDir ?? params.workspaceDir,
		extraParamsOverride: overrides.extraParamsOverride ?? params.extraParamsOverride,
		thinkingLevel: overrides.thinkingLevel ?? params.thinkingLevel,
		agentId: overrides.agentId ?? params.agentId,
		model: asProviderRuntimeModel(overrides.model) ?? model,
		resolvedTransport: overrides.resolvedTransport ?? transport,
		providerRuntimeHandle: providerRuntimeHandleForPlugins
	});
	let memoizedTranscriptPolicy;
	let memoizedTransportExtraParams;
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins
	});
	return {
		resolvedRef,
		providerRuntimeHandle: providerRuntimeHandleForPlugins,
		auth,
		prompt: {
			provider: params.provider,
			modelId: params.modelId,
			textTransforms: providerTextTransforms,
			resolveSystemPromptContribution(context) {
				return resolveProviderSystemPromptContribution({
					provider: params.provider,
					config,
					workspaceDir: context.workspaceDir ?? params.workspaceDir,
					runtimeHandle: providerRuntimeHandleForPlugins,
					context: {
						...context,
						config: asAssistantConfig(context.config)
					}
				});
			},
			transformSystemPrompt(context) {
				return transformProviderSystemPrompt({
					provider: params.provider,
					config,
					workspaceDir: context.workspaceDir ?? params.workspaceDir,
					runtimeHandle: providerRuntimeHandleForPlugins,
					context: {
						...context,
						config: asAssistantConfig(context.config)
					}
				});
			}
		},
		tools: {
			preparedPlanning,
			normalize(tools, overrides) {
				return normalizeProviderToolSchemas({
					...resolveToolContext(overrides),
					tools
				});
			},
			logDiagnostics(tools, overrides) {
				logProviderToolSchemaDiagnostics({
					...resolveToolContext(overrides),
					tools
				});
			}
		},
		transcript: {
			get policy() {
				return memoizedTranscriptPolicy ??= resolveTranscriptRuntimePolicy();
			},
			resolvePolicy: resolveTranscriptRuntimePolicy
		},
		delivery: buildAgentRuntimeDeliveryPlan({
			...params,
			providerRuntimeHandle: providerRuntimeHandleForPlugins
		}),
		outcome: { classifyRunResult: classifyEmbeddedAgentRunResultForModelFallback },
		transport: {
			get extraParams() {
				return memoizedTransportExtraParams ??= resolveTransportExtraParams();
			},
			resolveExtraParams: resolveTransportExtraParams
		},
		observability: {
			resolvedRef: `${params.provider}/${params.modelId}`,
			provider: params.provider,
			modelId: params.modelId,
			...modelApi ? { modelApi } : {},
			...params.harnessId ? { harnessId: params.harnessId } : {},
			...auth.forwardedAuthProfileId ? { authProfileId: auth.forwardedAuthProfileId } : {},
			...transport ? { transport } : {}
		}
	};
}
//#endregion
export { buildAgentRuntimePlan as n, resolvePreparedProviderRuntimeHandle as r, buildAgentRuntimeDeliveryPlan as t };
