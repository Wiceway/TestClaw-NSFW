//#region packages/normalization-core/src/text-decoding.ts
/** Decodes a byte prefix without inventing a replacement character for a cut trailing sequence. */
function decodeTextPrefix(bytes, options = {}) {
	return new TextDecoder(options.encoding).decode(bytes, options.truncated ? { stream: true } : void 0);
}
//#endregion
export { decodeTextPrefix as t };
