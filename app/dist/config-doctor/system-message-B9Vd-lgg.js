//#region src/infra/system-message.ts
const SYSTEM_MARK = "⚙️";
/** Prefix non-empty text as a system message without double-prefixing. */
function prefixSystemMessage(text) {
	const normalized = text.trim();
	if (!normalized || normalized.startsWith("⚙️")) return normalized;
	return `${SYSTEM_MARK} ${normalized}`;
}
//#endregion
export { prefixSystemMessage as n, SYSTEM_MARK as t };
