import { r as normalizeAgentIdStrict } from "./agent-id-C8MGgrNG.js";
import { a as resolveAgentDir, g as resolveDefaultAgentId, j as listAgentIds, t as AgentSelectionRequiredError } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import "./agent-scope-BiRi-Smp.js";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
//#region src/gateway/server-methods/model-auth-agent-scope.ts
/** Resolves model-auth RPC scope without letting explicit garbage reach the default store. */
function resolveModelAuthAgentScope(cfg, requestedAgentId) {
	if (requestedAgentId === void 0 || requestedAgentId === "") {
		let defaultAgentId;
		try {
			defaultAgentId = resolveDefaultAgentId(cfg, {
				surface: "model auth",
				hint: "Pass agentId to select a configured agent."
			});
		} catch (error) {
			if (!(error instanceof AgentSelectionRequiredError)) throw error;
			return {
				ok: false,
				agentId: "",
				error: errorShape(ErrorCodes.INVALID_REQUEST, error.message)
			};
		}
		return {
			ok: true,
			agentId: defaultAgentId,
			agentDir: resolveAgentDir(cfg, defaultAgentId)
		};
	}
	if (typeof requestedAgentId !== "string") return {
		ok: false,
		agentId: requestedAgentId === null ? "null" : typeof requestedAgentId
	};
	const rawAgentId = requestedAgentId.trim();
	if (!rawAgentId) return {
		ok: false,
		agentId: requestedAgentId
	};
	const normalized = normalizeAgentIdStrict(rawAgentId);
	if (!normalized.ok || !listAgentIds(cfg).includes(normalized.value)) return {
		ok: false,
		agentId: rawAgentId
	};
	const agentId = normalized.value;
	return {
		ok: true,
		agentId,
		agentDir: resolveAgentDir(cfg, agentId)
	};
}
function modelAuthAgentScopeError(scope) {
	return scope.error ?? unknownModelAuthAgentIdError(scope.agentId);
}
function unknownModelAuthAgentIdError(agentId) {
	const details = {
		code: GatewayErrorDetailCodes.UNKNOWN_AGENT_ID,
		agentId
	};
	return errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${agentId}"`, { details });
}
//#endregion
export { resolveModelAuthAgentScope as n, modelAuthAgentScopeError as t };
