//#region packages/model-catalog-core/src/model-catalog-refs.ts
/** Parse a strict provider/model reference without normalizing either segment. */
function parseProviderModelRef(value) {
	const trimmed = value.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) return null;
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	return provider && model ? {
		provider,
		model
	} : null;
}
//#endregion
//#region packages/media-generation-core/src/model-ref.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
function parseGenerationModelRef(raw) {
	return raw === void 0 ? null : parseProviderModelRef(raw);
}
//#endregion
export { parseGenerationModelRef as t };
