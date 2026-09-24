//#region packages/gateway-protocol/src/schema/terminal-constants.ts
/** Maximum size of one file staged through the operator terminal. */
const MAX_TERMINAL_UPLOAD_BYTES = 16777216;
/** Lifetime of terminal upload paths, including paths retained by an unfinished UI batch. */
const TERMINAL_UPLOAD_RETENTION_MS = 864e5;
/** Base64 expansion of MAX_TERMINAL_UPLOAD_BYTES. */
const MAX_TERMINAL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_TERMINAL_UPLOAD_BYTES / 3) * 4;
function base64Value(code) {
	if (code >= 65 && code <= 90) return code - 65;
	if (code >= 97 && code <= 122) return code - 71;
	if (code >= 48 && code <= 57) return code + 4;
	return code === 43 ? 62 : code === 47 ? 63 : -1;
}
function terminalUploadDecodedSize(contentBase64) {
	if (contentBase64.length === 0) return 0;
	const padding = contentBase64.endsWith("==") ? 2 : contentBase64.endsWith("=") ? 1 : 0;
	return Math.floor(contentBase64.length / 4) * 3 - padding;
}
/** Validates canonical padded base64, including zero-valued unused bits. */
function isCanonicalTerminalUploadBase64(contentBase64) {
	if (contentBase64.length > MAX_TERMINAL_UPLOAD_BASE64_LENGTH || contentBase64.length % 4 !== 0 || terminalUploadDecodedSize(contentBase64) > 16777216) return false;
	const padding = contentBase64.endsWith("==") ? 2 : contentBase64.endsWith("=") ? 1 : 0;
	const dataEnd = contentBase64.length - padding;
	for (let index = 0; index < dataEnd; index += 1) if (base64Value(contentBase64.charCodeAt(index)) < 0) return false;
	for (let index = dataEnd; index < contentBase64.length; index += 1) if (contentBase64.charCodeAt(index) !== 61) return false;
	if (padding > 0) {
		const finalValue = base64Value(contentBase64.charCodeAt(dataEnd - 1));
		if (finalValue < 0 || (finalValue & (padding === 2 ? 15 : 3)) !== 0) return false;
	}
	return true;
}
//#endregion
//#region src/shared/bounded-buffer.ts
var BoundedBuffer = class {
	constructor(capacity, overflow, measure = () => 1) {
		this.capacity = capacity;
		this.overflow = overflow;
		this.measure = measure;
		this.values = [];
		this.head = 0;
		this.size = 0;
		this.closed = false;
	}
	push(value) {
		if (this.closed) return false;
		const valueSize = this.measure(value);
		if (this.size + valueSize <= this.capacity) {
			this.values.push(value);
			this.size += valueSize;
			return true;
		}
		if (this.overflow.mode !== "drop-oldest") {
			this.closed = true;
			if (this.overflow.mode === "fail-closed") {
				this.drain();
				this.overflow.onOverflow();
			}
			return false;
		}
		this.values.push(value);
		this.size += valueSize;
		while (this.size > this.capacity && this.head < this.values.length - 1) {
			const oldest = this.values[this.head];
			this.size -= this.measure(oldest);
			this.values[this.head] = void 0;
			this.head += 1;
		}
		if (this.size > this.capacity) {
			const fitted = this.overflow.fit?.(value, this.capacity);
			this.values = fitted === void 0 ? [] : [fitted];
			this.head = 0;
			this.size = fitted === void 0 ? 0 : this.measure(fitted);
		} else if (this.head * 2 >= this.values.length) {
			this.values = this.values.slice(this.head);
			this.head = 0;
		}
		return true;
	}
	drain() {
		const values = this.head === 0 ? this.values : this.values.slice(this.head);
		this.values = [];
		this.head = 0;
		this.size = 0;
		return values;
	}
};
//#endregion
export { isCanonicalTerminalUploadBase64 as a, TERMINAL_UPLOAD_RETENTION_MS as i, MAX_TERMINAL_UPLOAD_BASE64_LENGTH as n, terminalUploadDecodedSize as o, MAX_TERMINAL_UPLOAD_BYTES as r, BoundedBuffer as t };
