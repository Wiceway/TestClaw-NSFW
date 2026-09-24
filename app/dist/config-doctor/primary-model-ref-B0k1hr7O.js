import "./defaults-BbU4k6fu.js";
import { s as resolveAgentModelPrimaryValue } from "./model-input-t8h5WyR1.js";
import { n as parseModelRef } from "./model-selection-normalize-DyxdaT9v.js";
//#region src/commands/doctor/shared/primary-model-ref.ts
function resolveDoctorPrimaryModelRef(cfg, agentModel) {
	const raw = resolveAgentModelPrimaryValue(agentModel) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-6-astra";
	return parseModelRef(raw, "openai", { allowPluginNormalization: false }) ?? {
		provider: "openai",
		model: "gpt-6-astra"
	};
}
//#endregion
export { resolveDoctorPrimaryModelRef as t };
