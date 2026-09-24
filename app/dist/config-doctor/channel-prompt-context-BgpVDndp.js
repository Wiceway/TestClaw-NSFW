import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-BfoJTy8l.js";
import { s as markInboundContextLabel } from "./strip-inbound-meta-Bb3_IiBS.js";
import { t as normalizeInboundTextNewlines } from "./inbound-text-B6lb_yrL.js";
/** Hard cap for prompt-injected history windows. JSON-schema integer maximum is not a window. */
const MAX_PROMPT_HISTORY_LIMIT = 200;
/** Resolves one bounded observed-message window without rewriting saved configuration. */
function resolvePromptHistoryLimit(configured, fallback = 50) {
	const isSchemaMaximum = typeof configured === "number" && Number.isInteger(configured) && configured >= Number.MAX_SAFE_INTEGER;
	const selected = typeof configured === "number" && Number.isFinite(configured) && !isSchemaMaximum ? configured : fallback;
	return Number.isFinite(selected) ? Math.min(Math.max(0, Math.trunc(selected)), MAX_PROMPT_HISTORY_LIMIT) : 0;
}
//#endregion
//#region src/auto-reply/reply/channel-prompt-context.ts
/** Appends channel-supplied prompt context to the user-role body under a marked label. */
/**
* The fixed marker lets strippers recognize Assistant-injected context; it is not
* a trust guardrail. Trust guidance travels with each entry instead
* (`buildChannelMetadata` wraps entries in `wrapExternalContent`, whose SECURITY
* NOTICE carries the do-not-obey clause).
*/
function appendChannelPromptContext(base, channelPromptContext) {
	if (!Array.isArray(channelPromptContext) || channelPromptContext.length === 0) return base;
	const entries = channelPromptContext.map((entry) => normalizeInboundTextNewlines(entry)).filter((entry) => Boolean(entry));
	if (entries.length === 0) return base;
	return [base, [markInboundContextLabel("Context:"), ...entries].join("\n")].filter(Boolean).join("\n\n");
}
const MAX_CONTEXT_JSON_STRING_CHARS = 2e3;
function neutralizeMarkdownFences(value) {
	return value.replaceAll("```", "`​``");
}
function truncateContextJsonString(value) {
	if (value.length <= 2e3) return value;
	return `${truncateUtf16Safe(value, Math.max(0, 1986)).trimEnd()}…[truncated]`;
}
function sanitizeContextJsonValue(value) {
	if (typeof value === "string") return neutralizeMarkdownFences(truncateContextJsonString(value));
	if (Array.isArray(value)) return value.map((entry) => sanitizeContextJsonValue(entry));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeContextJsonValue(entry)]));
}
function formatContextJsonBlock(label, payload) {
	return [
		label,
		"```json",
		JSON.stringify(sanitizeContextJsonValue(payload)),
		"```"
	].join("\n");
}
/** Preserve a platform-selected window; legacy pending buffers keep their defensive tail cap. */
function selectInboundHistoryContext(ctx) {
	const history = Array.isArray(ctx.InboundHistory) ? ctx.InboundHistory : [];
	const recent = ctx.SessionTranscriptContext?.historyKind === "recent";
	const configuredLimit = ctx.SessionTranscriptContext?.historyLimit;
	const limit = recent && typeof configuredLimit === "number" && Number.isSafeInteger(configuredLimit) && configuredLimit >= 0 ? resolvePromptHistoryLimit(configuredLimit, 20) : 20;
	return {
		boundedHistory: limit > 0 ? history.slice(-limit) : [],
		historyLabel: recent ? "Recent chat history:" : "Chat history since last reply:",
		truncated: history.length > limit
	};
}
//#endregion
export { selectInboundHistoryContext as a, neutralizeMarkdownFences as i, appendChannelPromptContext as n, formatContextJsonBlock as r, MAX_CONTEXT_JSON_STRING_CHARS as t };
