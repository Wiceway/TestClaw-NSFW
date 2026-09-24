import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as formatConcreteConfigPath, s as tokenizeConcreteConfigPath } from "./dot-path-CTxqU0U7.js";
import { j as secretRefKey } from "./types.secrets-K95Dlap_.js";
import { c as getConfigResolutionFacts, f as resolveConfigSecretRef } from "./resolution-facts-BNNyTRcj.js";
import { n as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as describeSecretResolutionOperatorRecovery } from "./resolve-errors-YgWEeepi.js";
import { r as resolveSecretRefValues } from "./resolve-DMtxtf08.js";
//#region src/gateway/resolve-configured-secret-input-string.ts
function buildUnresolvedReason(params) {
	if (params.style === "generic") return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
	if (params.kind === "non-string") return `${params.path} SecretRef resolved to a non-string value.`;
	if (params.kind === "empty") return `${params.path} SecretRef resolved to an empty value.`;
	return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
}
async function resolveConfiguredSecretInput(params) {
	const style = params.unresolvedReasonStyle ?? "generic";
	let configPath = params.path;
	if (typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null) try {
		configPath = formatConcreteConfigPath(tokenizeConcreteConfigPath(configPath).tokens, params.config);
	} catch {}
	const ref = resolveConfigSecretRef({
		config: params.config,
		path: configPath,
		value: params.value,
		defaults: params.config.secrets?.defaults
	});
	if (!ref) return {
		refConfigured: false,
		value: normalizeOptionalString(params.value)
	};
	const refLabel = `${ref.source}:${ref.provider}:${ref.id}`;
	try {
		const resolvedValue = (await resolveSecretRefValues([ref], {
			config: params.config,
			env: params.env,
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}
		})).get(secretRefKey(ref));
		if (typeof resolvedValue !== "string") return {
			refConfigured: true,
			unresolvedRefReason: buildUnresolvedReason({
				path: params.path,
				style,
				kind: "non-string",
				refLabel
			})
		};
		const trimmed = normalizeOptionalString(resolvedValue);
		if (!trimmed) return {
			refConfigured: true,
			unresolvedRefReason: buildUnresolvedReason({
				path: params.path,
				style,
				kind: "empty",
				refLabel
			})
		};
		return {
			refConfigured: true,
			value: trimmed
		};
	} catch (error) {
		const redactedValue = isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE";
		const operatorDiagnostic = style === "detailed" || redactedValue ? describeSecretResolutionOperatorDiagnostic(error) : void 0;
		const operatorRecovery = style === "detailed" || redactedValue ? describeSecretResolutionOperatorRecovery(error) : void 0;
		const unresolvedReason = buildUnresolvedReason({
			path: params.path,
			style,
			kind: "unresolved",
			refLabel
		});
		const operatorDetail = [operatorDiagnostic, operatorRecovery].filter(Boolean).join(". ");
		return {
			refConfigured: true,
			...redactedValue ? { unresolvedRefCode: "SECRET_REF_REDACTED_VALUE" } : {},
			unresolvedRefReason: operatorDetail ? `${unresolvedReason} ${operatorDetail}.` : unresolvedReason
		};
	}
}
async function resolveConfiguredSecretInputWithFallback(params) {
	const resolved = await resolveConfiguredSecretInput(params);
	const configValue = !resolved.refConfigured ? resolved.value : void 0;
	if (configValue) return {
		value: configValue,
		source: "config",
		secretRefConfigured: false
	};
	if (!resolved.refConfigured) {
		const fallback = normalizeOptionalString(params.readFallback?.());
		if (fallback) return {
			value: fallback,
			source: "fallback",
			secretRefConfigured: false
		};
		return { secretRefConfigured: false };
	}
	if (resolved.value) return {
		value: resolved.value,
		source: "secretRef",
		secretRefConfigured: true
	};
	return {
		unresolvedRefReason: resolved.unresolvedRefReason,
		...resolved.unresolvedRefCode ? { unresolvedRefCode: resolved.unresolvedRefCode } : {},
		secretRefConfigured: true
	};
}
async function resolveRequiredConfiguredSecretRefInputString(params) {
	const resolved = await resolveConfiguredSecretInput(params);
	if (!resolved.refConfigured) return;
	if (resolved.value) return resolved.value;
	throw new Error(resolved.unresolvedRefReason ?? `${params.path} resolved to an empty value.`);
}
//#endregion
export { resolveRequiredConfiguredSecretRefInputString as n, resolveConfiguredSecretInputWithFallback as t };
