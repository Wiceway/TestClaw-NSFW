//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
/** Normalize provider ID before manifest-owned auth alias lookup. */
function normalizeProviderIdForAuth(provider) {
	return normalizeProviderId(provider);
}
function findNormalizedProviderValue(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	for (const [key, value] of Object.entries(entries)) if (normalizeProviderId(key) === providerKey) return value;
}
function findNormalizedProviderKey(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
//#endregion
export { normalizeLowercaseStringOrEmpty as a, normalizeProviderIdForAuth as i, findNormalizedProviderValue as n, normalizeOptionalString as o, normalizeProviderId as r, findNormalizedProviderKey as t };
