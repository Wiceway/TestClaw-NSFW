import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/secrets/ref-contract.ts
/** Shared SecretRef grammar and validation helpers for config, schema, SDK, and gateway parity. */
/** Provider alias used when a SecretRef omits a source-specific provider. */
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
/** Strict env-var id shape accepted for env-backed SecretRefs. */
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
/** Return whether an env SecretRef id is a supported uppercase environment variable name. */
function isValidEnvSecretRefId(value) {
	return ENV_SECRET_REF_ID_RE.test(value);
}
/** Narrow a value to the canonical SecretRef object shape. */
function isSecretRef(value) {
	if (!isRecord(value)) return false;
	if (Object.keys(value).length !== 3) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.provider === "string" && value.provider.trim().length > 0 && typeof value.id === "string" && value.id.trim().length > 0;
}
/**
* Runtime secret-reference grammar shared by config parsing, plugin SDK schemas,
* gateway parity checks, and resolver planning.
*/
const FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
/** Shared alias grammar for env/file/exec/store secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Builds the stable map key used to cache or compare resolved secret refs. */
function secretRefKey(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
function resolveDefaultSecretProviderAlias(config, source, options) {
	const configured = config.secrets?.defaults?.[source];
	if (configured?.trim()) return configured.trim();
	if (options?.preferFirstProviderForSource) {
		const providers = config.secrets?.providers;
		if (providers) {
			for (const [providerName, provider] of Object.entries(providers)) if (provider?.source === source) return providerName;
		}
	}
	return DEFAULT_SECRET_PROVIDER_ALIAS;
}
/** Builds an environment-backed gateway credential using its configured provider alias. */
function createGatewayEnvSecretRef(config, envVarName) {
	return {
		source: "env",
		provider: resolveDefaultSecretProviderAlias(config, "env", { preferFirstProviderForSource: true }),
		id: envVarName
	};
}
/** Whether a source-specific built-in provider owns this selected default alias. */
function isBuiltInDefaultSecretProviderRef(config, ref) {
	return config.secrets?.providers?.[ref.provider]?.source !== ref.source && (ref.source === "env" || ref.source === "store") && ref.provider === resolveDefaultSecretProviderAlias(config, ref.source);
}
/** Returns the configured provider source when a SecretRef selects an impossible pairing. */
function resolveSecretRefProviderSourceMismatch(config, ref) {
	const configuredSource = config.secrets?.providers?.[ref.provider]?.source;
	if (!configuredSource || configuredSource === ref.source || isBuiltInDefaultSecretProviderRef(config, ref)) return null;
	return configuredSource;
}
/** Validates file secret ref ids against the shared JSON-pointer-style contract. */
function isValidFileSecretRefId(value) {
	if (value === "value") return true;
	if (!value.startsWith("/")) return false;
	return value.slice(1).split("/").every((segment) => FILE_SECRET_REF_SEGMENT_PATTERN.test(segment));
}
/** Validates a secret provider alias against the shared config/gateway grammar. */
function isValidSecretProviderAlias(value) {
	return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}
/** Validates exec secret ref ids and reports why invalid ids failed. */
function validateExecSecretRefId(value) {
	if (!EXEC_SECRET_REF_ID_PATTERN.test(value)) return {
		ok: false,
		reason: "pattern"
	};
	for (const segment of value.split("/")) if (segment === "." || segment === "..") return {
		ok: false,
		reason: "traversal-segment"
	};
	return { ok: true };
}
/** Boolean convenience wrapper for callers that only need accept/reject behavior. */
function isValidExecSecretRefId(value) {
	return validateExecSecretRefId(value).ok;
}
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
function isValidSecretRef(ref) {
	if (!isSecretRef(ref)) return false;
	if (!isValidSecretProviderAlias(ref.provider)) return false;
	if (ref.source === "env") return isValidEnvSecretRefId(ref.id);
	if (ref.source === "file") return isValidFileSecretRefId(ref.id);
	if (ref.source === "store") return isValidEnvSecretRefId(ref.id);
	return isValidExecSecretRefId(ref.id);
}
/** Formats the user-facing validation message for rejected exec secret ref ids. */
function formatExecSecretRefIdValidationMessage() {
	return [
		"Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
		"and must not include \".\" or \"..\" path segments",
		"(example: \"vault/openai/api-key\" or \"aws/secret#json_key\")."
	].join(" ");
}
function normalizeAndGroupSecretRefs(refs) {
	if (refs.length === 0) return [];
	const uniqueRefs = /* @__PURE__ */ new Map();
	for (const ref of refs) {
		const id = ref.id.trim();
		if (!id) throw new Error("Secret reference id is empty.");
		if (!isValidSecretProviderAlias(ref.provider)) throw new Error(`Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "env" && !isValidEnvSecretRefId(id)) throw new Error(`Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "file" && !isValidFileSecretRefId(id)) throw new Error(`File secret reference id must be an absolute JSON pointer or "value" (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "store" && !isValidEnvSecretRefId(id)) throw new Error(`Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "exec" && !isValidExecSecretRefId(id)) throw new Error(`${formatExecSecretRefIdValidationMessage()} (ref: ${ref.source}:${ref.provider}:${id}).`);
		uniqueRefs.set(secretRefKey(ref), {
			...ref,
			id
		});
	}
	const grouped = /* @__PURE__ */ new Map();
	for (const ref of uniqueRefs.values()) {
		const key = `${ref.source}:${ref.provider}`;
		const existing = grouped.get(key);
		if (existing) {
			existing.refs.push(ref);
			continue;
		}
		grouped.set(key, {
			source: ref.source,
			providerName: ref.provider,
			refs: [ref]
		});
	}
	return [...grouped.values()];
}
//#endregion
//#region src/config/types.secrets.ts
/** Legacy env SecretRef marker retained for config migration/read compatibility. */
const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
/** Older env SecretRef marker retained for migration/read compatibility. */
const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
function isLegacySecretRefWithoutProvider(value) {
	if (!isRecord(value)) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.id === "string" && value.id.trim().length > 0 && value.provider === void 0;
}
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
	if (!match) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id: expectDefined(match[1], "types.secrets regex capture 1")
	};
}
/** Detect retired env SecretRef marker strings for migration and explicit rejection. */
function isLegacySecretRefEnvMarker(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:");
}
/** Parse legacy env SecretRef marker strings for config migration. */
function parseLegacySecretRefEnvMarker(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (!isLegacySecretRefEnvMarker(value)) return null;
	const trimmed = value.trim();
	const prefix = trimmed.startsWith("secretref-env:") ? LEGACY_SECRETREF_ENV_MARKER_PREFIX : trimmed.startsWith("__env__:") ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX : void 0;
	if (!prefix) return null;
	const id = trimmed.slice(prefix.length);
	if (!ENV_SECRET_REF_ID_RE.test(id)) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id
	};
}
/** Coerce canonical and env-shorthand secret inputs into a SecretRef.
* Retired string markers are parsed only by doctor migration above. */
function coerceSecretRef(value, defaults) {
	if (isSecretRef(value)) return value;
	if (isLegacySecretRefWithoutProvider(value)) {
		const provider = defaults?.[value.source] ?? "default";
		return {
			source: value.source,
			provider,
			id: value.id
		};
	}
	const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
	if (envTemplate) return envTemplate;
	return null;
}
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
function hasConfiguredSecretInput(value, defaults) {
	if (normalizeSecretInputString(value)) return true;
	return coerceSecretRef(value, defaults) !== null;
}
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
function normalizeSecretInputString(value) {
	return normalizeOptionalString(value);
}
function formatSecretRefLabel(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Error thrown when strict secret reads encounter a configured but unresolved SecretRef. */
var UnresolvedSecretInputError = class extends Error {
	constructor(params) {
		super(`${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`);
		this.name = "UnresolvedSecretInputError";
		this.path = params.path;
		this.ref = params.ref;
	}
};
/** Narrow errors from strict secret read sites without parsing user-facing messages. */
function isUnresolvedSecretInputError(value) {
	return value instanceof UnresolvedSecretInputError;
}
function createUnresolvedSecretInputError(params) {
	return new UnresolvedSecretInputError(params);
}
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
function assertSecretInputResolved(params) {
	const { ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	if (!ref) return;
	throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
}
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
function resolveSecretInputString(params) {
	const { explicitRef, ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	const normalized = normalizeSecretInputString(params.value);
	if (normalized && !explicitRef) return {
		status: "available",
		value: normalized,
		ref: null
	};
	if (!ref) return {
		status: "missing",
		value: void 0,
		ref: null
	};
	if ((params.mode ?? "strict") === "strict") throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
	return {
		status: "configured_unavailable",
		value: void 0,
		ref
	};
}
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
function normalizeResolvedSecretInputString(params) {
	const resolved = resolveSecretInputString({
		...params,
		mode: "strict"
	});
	if (resolved.status === "available") return resolved.value;
}
/** Resolve explicit `refValue` before inline secret references embedded in `value`. */
function resolveSecretInputRef(params) {
	const explicitRef = coerceSecretRef(params.refValue, params.defaults);
	const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
	return {
		explicitRef,
		inlineRef,
		ref: explicitRef ?? inlineRef
	};
}
//#endregion
export { resolveSecretRefProviderSourceMismatch as A, isValidEnvSecretRefId as C, isValidSecretRef as D, isValidSecretProviderAlias as E, validateExecSecretRefId as M, normalizeAndGroupSecretRefs as O, isSecretRef as S, isValidFileSecretRefId as T, SECRET_PROVIDER_ALIAS_PATTERN as _, coerceSecretRef as a, formatExecSecretRefIdValidationMessage as b, isUnresolvedSecretInputError as c, parseEnvTemplateSecretRef as d, parseLegacySecretRefEnvMarker as f, ENV_SECRET_REF_ID_RE as g, DEFAULT_SECRET_PROVIDER_ALIAS as h, assertSecretInputResolved as i, secretRefKey as j, resolveDefaultSecretProviderAlias as k, normalizeResolvedSecretInputString as l, resolveSecretInputString as m, LEGACY_SECRETREF_ENV_MARKER_PREFIX as n, hasConfiguredSecretInput as o, resolveSecretInputRef as p, UnresolvedSecretInputError as r, isLegacySecretRefEnvMarker as s, LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX as t, normalizeSecretInputString as u, SINGLE_VALUE_FILE_REF_ID as v, isValidExecSecretRefId as w, isBuiltInDefaultSecretProviderRef as x, createGatewayEnvSecretRef as y };
