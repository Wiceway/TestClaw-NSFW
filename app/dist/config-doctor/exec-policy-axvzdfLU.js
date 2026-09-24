import { f as resolveExecPolicyForMode } from "./exec-approvals-core-BW9WjMmv.js";
import "./exec-approvals-9hAP-z4b.js";
//#region src/infra/exec-policy.ts
function applyExecPolicyLayer(base, layer) {
	if (!layer) return base;
	if (layer.mode) return {
		...base,
		mode: layer.mode,
		...resolveExecPolicyForMode(layer.mode)
	};
	if (layer.security !== void 0 || layer.ask !== void 0) {
		const { mode: _mode, ...baseWithoutMode } = base;
		return {
			...baseWithoutMode,
			security: layer.security ?? base.security,
			ask: layer.ask ?? base.ask
		};
	}
	return base;
}
//#endregion
export { applyExecPolicyLayer as t };
