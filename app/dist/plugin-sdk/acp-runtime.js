import { i as isAcpRuntimeError, n as AcpRuntimeError } from "../errors-CORCgWnv.mjs";
import "../errors-6egNnljU.mjs";
import { i as consumeAcpTurnStream, n as testing$1, t as getAcpSessionManager } from "../manager-9PTAMEgf.mjs";
import { a as unregisterAcpRuntimeBackend, i as testing$2, n as registerAcpRuntimeBackend, r as requireAcpRuntimeBackend, t as getAcpRuntimeBackend } from "../registry-BJwFpINI.mjs";
import { n as readAcpSessionEntry } from "../session-meta-BQlidMSn.mjs";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "../policy-B08ImHW_.mjs";
import { t as tryDispatchAcpReplyHook } from "../acpx-RvOpjl9U.mjs";
//#region src/plugin-sdk/acp-runtime.ts
function resolveAcpSessionAvailability(params) {
	const policyError = resolveAcpDispatchPolicyError(params.config) ?? resolveAcpAgentPolicyError(params.config, params.agentId);
	if (policyError) return {
		available: false,
		message: policyError.message
	};
	try {
		requireAcpRuntimeBackend(params.backendId);
		return { available: true };
	} catch (error) {
		return {
			available: false,
			message: error instanceof Error ? error.message : "ACP runtime backend is unavailable."
		};
	}
}
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
const testing = new Proxy({}, {
	get(_target, prop, receiver) {
		if (Reflect.has(testing$1, prop)) return Reflect.get(testing$1, prop, receiver);
		return Reflect.get(testing$2, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop);
	},
	ownKeys() {
		return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(testing$1), ...Reflect.ownKeys(testing$2)]));
	},
	getOwnPropertyDescriptor(_target, prop) {
		if (Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop)) return {
			configurable: true,
			enumerable: true
		};
	}
});
//#endregion
export { AcpRuntimeError, testing as __testing, testing, consumeAcpTurnStream, getAcpRuntimeBackend, getAcpSessionManager, isAcpRuntimeError, readAcpSessionEntry, registerAcpRuntimeBackend, requireAcpRuntimeBackend, resolveAcpSessionAvailability, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend };
