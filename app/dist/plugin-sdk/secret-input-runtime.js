import { i as getPluginRuntimeGatewayRequestScope } from "../gateway-request-scope-Cys5l4an.mjs";
import { i as parseConcreteConfigPathTokens, n as formatConcreteConfigPath } from "../dot-path-BSC76DAI.mjs";
import { c as isSecretRef } from "../ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, l as normalizeResolvedSecretInputString, m as resolveSecretInputString, o as hasConfiguredSecretInput, u as normalizeSecretInputString } from "../types.secrets-B5xWSzLp.mjs";
import { s as getAuthoredConfigSecretRef } from "../resolution-facts-CSuKIPux.mjs";
import { n as resolveConfiguredSecretInputWithFallback, r as resolveRequiredConfiguredSecretRefInputString, t as resolveConfiguredSecretInputString } from "../resolve-configured-secret-input-string-BvjjZH3j.mjs";
import { r as assertSecretOwnerAvailable, u as isSecretOwnerAvailable } from "../runtime-degraded-state-C2v6LD8h.mjs";
import { l as getActiveSecretsRuntimeSnapshotRevisionState, o as getActiveSecretsRuntimeConfigSnapshot } from "../runtime-state-p_Glf0Cm.mjs";
//#region src/secrets/prepared-plugin-input.ts
/** Read a manifest-prepared capability credential. Never resolves a cold reference or environment. */
function getPreparedPluginSecretInput(pluginId, path) {
	const revision = getActiveSecretsRuntimeSnapshotRevisionState();
	if (getPluginRuntimeGatewayRequestScope()?.pluginId !== pluginId) return { revision };
	const snapshot = getActiveSecretsRuntimeConfigSnapshot();
	if (!snapshot?.configRefsPrepared || snapshot.config.plugins?.enabled === false || snapshot.config.plugins?.entries?.[pluginId]?.enabled === false) return { revision };
	const tokens = [
		"plugins",
		"entries",
		pluginId,
		"config",
		...parseConcreteConfigPathTokens(path)
	];
	const fullPath = formatConcreteConfigPath(tokens);
	if (!isSecretOwnerAvailable("capability", fullPath)) return { revision };
	const read = (root) => {
		let value = root;
		for (const token of tokens) {
			if (!value || typeof value !== "object" || !Object.hasOwn(value, token)) return;
			value = Reflect.get(value, token);
		}
		return value;
	};
	const source = read(snapshot.sourceConfig);
	if (!coerceSecretRef(source, snapshot.sourceConfig.secrets?.defaults) && !getAuthoredConfigSecretRef(snapshot.sourceConfig, fullPath)) return { revision };
	const value = read(snapshot.config);
	return typeof value === "string" && value.trim() ? {
		value,
		revision
	} : { revision };
}
//#endregion
//#region src/plugin-sdk/secret-input-runtime.ts
/**
* Runtime SDK subpath for secret input normalization and configured secret resolution.
*/
/** Reject use of a manifest-owned plugin capability whose startup secret is unavailable. */
function assertPluginCapabilitySecretAvailable(ownerId) {
	assertSecretOwnerAvailable("capability", ownerId);
}
//#endregion
export { assertPluginCapabilitySecretAvailable, coerceSecretRef, getPreparedPluginSecretInput, hasConfiguredSecretInput, isSecretRef, normalizeResolvedSecretInputString, normalizeSecretInputString, resolveConfiguredSecretInputString, resolveConfiguredSecretInputWithFallback, resolveRequiredConfiguredSecretRefInputString, resolveSecretInputString };
