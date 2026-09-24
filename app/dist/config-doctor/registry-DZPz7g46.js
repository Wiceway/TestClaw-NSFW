import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { i as AcpRuntimeError } from "./errors-YLABO4Pj.js";
//#region src/acp/runtime/registry.ts
const ACP_RUNTIME_REGISTRY_STATE_KEY = Symbol.for("testclaw.acpRuntimeRegistryState");
function resolveAcpRuntimeRegistryGlobalState() {
	const processStore = process;
	const existing = processStore[ACP_RUNTIME_REGISTRY_STATE_KEY];
	if (existing) globalThis[ACP_RUNTIME_REGISTRY_STATE_KEY] = existing;
	const created = resolveGlobalSingleton(ACP_RUNTIME_REGISTRY_STATE_KEY, () => ({ backendsById: /* @__PURE__ */ new Map() }), (state) => state.backendsById.clear(), "plugin-registry");
	processStore[ACP_RUNTIME_REGISTRY_STATE_KEY] = created;
	return created;
}
const ACP_BACKENDS_BY_ID = resolveAcpRuntimeRegistryGlobalState().backendsById;
function isBackendHealthy(backend) {
	if (!backend.healthy) return true;
	try {
		return backend.healthy();
	} catch {
		return false;
	}
}
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
function getAcpRuntimeBackend(id) {
	const normalized = normalizeOptionalLowercaseString(id) || "";
	if (normalized) return ACP_BACKENDS_BY_ID.get(normalized) ?? null;
	if (ACP_BACKENDS_BY_ID.size === 0) return null;
	for (const backend of ACP_BACKENDS_BY_ID.values()) if (isBackendHealthy(backend)) return backend;
	return ACP_BACKENDS_BY_ID.values().next().value ?? null;
}
/** Resolves a healthy backend or throws a typed ACP runtime error. */
function requireAcpRuntimeBackend(id) {
	const normalized = normalizeOptionalLowercaseString(id) || "";
	const backend = getAcpRuntimeBackend(normalized || void 0);
	if (!backend) throw new AcpRuntimeError("ACP_BACKEND_MISSING", "ACP runtime backend is not configured. Install and enable the acpx runtime plugin.");
	if (!isBackendHealthy(backend)) throw new AcpRuntimeError("ACP_BACKEND_UNAVAILABLE", "ACP runtime backend is currently unavailable. Try again in a moment.");
	if (normalized && backend.id !== normalized) throw new AcpRuntimeError("ACP_BACKEND_MISSING", `ACP runtime backend "${normalized}" is not registered.`);
	return backend;
}
//#endregion
export { requireAcpRuntimeBackend as n, getAcpRuntimeBackend as t };
