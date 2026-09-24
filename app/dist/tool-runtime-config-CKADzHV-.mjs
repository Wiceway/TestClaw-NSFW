import { E as selectApplicableRuntimeConfig, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dti8jFIP.mjs";
import "./config-DqAgdhnz.mjs";
//#region src/agents/tool-runtime-config.ts
function resolveAgentRuntimeToolConfig(inputConfig) {
	const runtimeConfig = getRuntimeConfigSnapshot() ?? void 0;
	if (!runtimeConfig) return inputConfig;
	if (!inputConfig || inputConfig === runtimeConfig) return runtimeConfig;
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
	if (!runtimeSourceConfig) return inputConfig;
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig,
		runtimeSourceConfig
	});
}
//#endregion
export { resolveAgentRuntimeToolConfig as t };
