import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-BfoJTy8l.js";
import { c as sanitizeTaskStatusText } from "./task-status-BLVYcOWO.js";
//#region src/auto-reply/reply/subagents-utils.ts
function resolveSubagentLabel(entry, fallback = "subagent") {
	return normalizeOptionalString(entry.label) || normalizeOptionalString(entry.task) || fallback;
}
function formatRunLabel(entry, options) {
	const raw = sanitizeTaskStatusText(resolveSubagentLabel(entry)) || "subagent";
	const maxLength = options?.maxLength ?? 72;
	if (!Number.isFinite(maxLength) || maxLength <= 0) return raw;
	return raw.length > maxLength ? `${truncateUtf16Safe(raw, maxLength).trimEnd()}…` : raw;
}
//#endregion
export { resolveSubagentLabel as n, formatRunLabel as t };
