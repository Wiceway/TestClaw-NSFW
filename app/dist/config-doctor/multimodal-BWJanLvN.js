/** All supported multimodal memory modalities in stable config order. */
const MEMORY_MULTIMODAL_MODALITIES = Object.keys({
	image: {
		labelPrefix: "Image file",
		extensions: [
			".jpg",
			".jpeg",
			".png",
			".webp",
			".gif",
			".heic",
			".heif"
		]
	},
	audio: {
		labelPrefix: "Audio file",
		extensions: [
			".mp3",
			".wav",
			".ogg",
			".opus",
			".m4a",
			".m2a",
			".aac",
			".flac"
		]
	}
});
/** Default max bytes for one multimodal memory file. */
const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10485760;
/** Normalize user modality selections to supported modalities. */
function normalizeMemoryMultimodalModalities(raw) {
	if (raw === void 0 || raw.includes("all")) return [...MEMORY_MULTIMODAL_MODALITIES];
	const normalized = /* @__PURE__ */ new Set();
	for (const value of raw) if (value === "image" || value === "audio") normalized.add(value);
	return Array.from(normalized);
}
/** Normalize user multimodal settings, including disabled-state empty modality list. */
function normalizeMemoryMultimodalSettings(raw) {
	const enabled = raw.enabled === true;
	const maxFileBytes = typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes) ? Math.max(1, Math.floor(raw.maxFileBytes)) : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
	return {
		enabled,
		modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
		maxFileBytes
	};
}
/** Return true when multimodal memory ingestion has at least one enabled modality. */
function isMemoryMultimodalEnabled(settings) {
	return settings.enabled && settings.modalities.length > 0;
}
//#endregion
export { normalizeMemoryMultimodalSettings as n, isMemoryMultimodalEnabled as t };
