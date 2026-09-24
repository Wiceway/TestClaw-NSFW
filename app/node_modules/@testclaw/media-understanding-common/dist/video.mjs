import { DEFAULT_VIDEO_MAX_BASE64_BYTES } from "./defaults.mjs";
//#region packages/media-understanding-common/src/video.ts
/** Estimate base64 size for a byte count. */
function estimateBase64Size(bytes) {
	return Math.ceil(bytes / 3) * 4;
}
/** Resolve video base64 byte limit from raw byte limit and global cap. */
function resolveVideoMaxBase64Bytes(maxBytes) {
	const expanded = estimateBase64Size(maxBytes);
	return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
//#endregion
export { estimateBase64Size, resolveVideoMaxBase64Bytes };
