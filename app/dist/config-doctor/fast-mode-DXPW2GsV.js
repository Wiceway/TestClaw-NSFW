import { a as normalizeFastMode } from "./string-coerce-CIXf7egm.js";
import { r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import "./agent-scope-BiRi-Smp.js";
import "./thinking.shared-DJ5AX7RA.js";
import { r as resolveModelExtraParamSources } from "./model-extra-params-OvC8BRDJ.js";
import { c as resolveFastModeModelAutoOnSeconds } from "./fast-mode-B_XB5FSo.js";
//#region src/agents/fast-mode.ts
/** Resolve the effective fast-mode setting and its source. */
function resolveFastModeState(params) {
	const { modelParams, agentModelParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider: params.provider,
		modelId: params.model,
		agentId: params.agentId
	});
	const fastAutoOnSeconds = resolveFastModeModelAutoOnSeconds({
		...params,
		modelParamSources: [agentModelParams, modelParams]
	});
	let mode = normalizeFastMode(params.sessionEntry?.fastMode);
	let source = "session";
	if (mode === void 0) {
		mode = normalizeFastMode(params.agentId && params.cfg ? resolveAgentConfig(params.cfg, params.agentId)?.fastModeDefault : void 0);
		source = "agent";
	}
	if (mode === void 0) {
		const configuredRaw = agentModelParams?.fastMode ?? agentModelParams?.fast_mode ?? modelParams?.fastMode ?? modelParams?.fast_mode;
		mode = normalizeFastMode(configuredRaw);
		source = "config";
	}
	return {
		mode: mode ?? false,
		enabled: mode === "auto" || mode === true,
		source: mode === void 0 ? "default" : source,
		fastAutoOnSeconds
	};
}
//#endregion
export { resolveFastModeState as t };
