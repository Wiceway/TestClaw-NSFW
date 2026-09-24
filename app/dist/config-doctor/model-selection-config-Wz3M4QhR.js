import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.js";
import { r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime } from "./agent-scope-config-BEuqweC1.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.js";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-YvCZW05m.js";
import "./agent-scope-BiRi-Smp.js";
//#region src/agents/model-selection-config.ts
function resolveDefaultModelForAgent(params) {
	return resolveConfiguredModelRef({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return resolvePrimaryStringValue(agentConfig?.subagents?.model) ?? resolvePrimaryStringValue(params.cfg.agents?.defaults?.subagents?.model) ?? (params.includeAgentPrimary === false ? void 0 : resolvePrimaryStringValue(resolveAgentModelConfigForRuntime(agentConfig, params.modelRuntime)));
}
//#endregion
export { resolveSubagentConfiguredModelSelection as n, resolveDefaultModelForAgent as t };
