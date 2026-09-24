import { a as coerceSecretRef } from "./types.secrets-K95Dlap_.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { f as resolveConfigSecretRef } from "./resolution-facts-BNNyTRcj.js";
import { d as hasConfiguredPlaintextSecretValue } from "./runtime-shared-CzmRi8K6.js";
import { c as readSecretStoreValue, i as listSecretStoreEntries } from "./secret-store-VJmBcO-Y.js";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-DaO5ykFx.js";
import { o as isNonSecretApiKeyMarker } from "./model-auth-markers-B_eyfwDG.js";
//#region src/secrets/audit-store.ts
function findSecretStoreRedactedValueFindings(params) {
	return listSecretStoreEntries({
		scope: { kind: "team" },
		redactedOnly: true,
		database: params.database
	}).flatMap((entry) => {
		if (params.excludeNames?.has(entry.name)) return [];
		return [{
			name: entry.name,
			code: "PLACEHOLDER_VALUE",
			severity: "error",
			file: params.database.path ?? resolveAssistantStateSqlitePath(params.database.env),
			jsonPath: `secret_store_entries.${entry.name}`,
			message: `Secret store entry "${entry.name}" contains a redaction placeholder and is unavailable. Run testclaw doctor --fix to repair a store-backed Gateway token; replace other entries with real credentials.`
		}];
	});
}
function findSecretStorePlaintextResidueFindings(params) {
	const entries = listSecretStoreEntries({
		scope: { kind: "team" },
		database: params.database
	});
	if (entries.length === 0 || params.assignments.length === 0) return [];
	const namesByValue = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const result = readSecretStoreValue({
			scope: { kind: "team" },
			name: entry.name,
			database: params.database
		});
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND") continue;
			if (result.error.code === "SECRET_STORE_INVALID_NAME") throw new Error(result.error.message);
			throw new Error(result.error.message, { cause: result.error.cause });
		}
		const names = namesByValue.get(result.value);
		if (names) names.push(entry.name);
		else namesByValue.set(result.value, [entry.name]);
	}
	return params.assignments.flatMap((assignment) => (namesByValue.get(assignment.value) ?? []).map((name) => ({
		code: "STORE_PLAINTEXT_RESIDUE",
		severity: "warn",
		file: assignment.file,
		jsonPath: assignment.path,
		message: `${assignment.path} duplicates team secret store entry "${name}"; replace the plaintext with a store SecretRef.`
	})));
}
//#endregion
//#region src/secrets/config-secret-target.ts
/** Classifies authored config credentials for Doctor and secrets audit. */
function classifyConfigSecretTarget(config, target) {
	if (!target.entry.includeInAudit) return {
		ref: null,
		plaintext: false
	};
	const defaults = config.secrets?.defaults;
	const inlineRef = resolveConfigSecretRef({
		config,
		path: target.path,
		value: target.value,
		defaults,
		includeResolved: true
	});
	return {
		ref: coerceSecretRef(target.refValue, defaults) ?? inlineRef,
		plaintext: inlineRef === null && hasConfiguredPlaintextSecretValue(target.value, target.entry.expectedResolvedValue) && !(target.entry.id === "models.providers.*.headers.*" && !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "")) && !(target.entry.id === "models.providers.*.apiKey" && typeof target.value === "string" && isNonSecretApiKeyMarker(target.value))
	};
}
//#endregion
export { findSecretStorePlaintextResidueFindings as n, findSecretStoreRedactedValueFindings as r, classifyConfigSecretTarget as t };
