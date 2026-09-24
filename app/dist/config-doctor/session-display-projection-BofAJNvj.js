import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-CmXfSSBe.js";
import { n as isSuppressedControlReplyText } from "./control-reply-text-DBCNOdDS.js";
import { n as stripEnvelope } from "./user-envelope-display-DgOC6gaR.js";
import "./chat-sanitize-BBZ5h27-.js";
//#region packages/normalization-core/src/markdown-plain-text.ts
/**
* Flattens Markdown into a single line of readable plain text.
*
* For one-line surfaces that render text verbatim — session-list previews,
* sidebar narration — where unrendered syntax like `[title](url)` would leak
* to the user. Lossy by design: it drops fenced code entirely and keeps only
* link/image text, so it must not be used where the Markdown is rendered.
*/
function flattenMarkdownToPlainText(text) {
	return text.replace(/```[\s\S]*?```/g, " ").replace(/```/g, " ").replace(/`([^`]*)`/g, "$1").replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, "").replace(/(\*{1,2})(?=\S)([\s\S]*?\S)\1/g, "$2").replace(/(^|[^\p{L}\p{N}])(_{1,2})(?=\S)([\s\S]*?\S)\2(?![\p{L}\p{N}])/gu, "$1$3").replace(/~~(?=\S)([\s\S]*?\S)~~/g, "$1").replace(/\s+/g, " ").trim();
}
//#endregion
//#region src/gateway/session-display-projection.ts
const SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS = 240;
const SESSION_DISPLAY_PROJECTION_MAX_CHARS = 800;
function extractUserText(message) {
	if (typeof message.content === "string") return message.content;
	if (Array.isArray(message.content)) {
		const parts = message.content.flatMap((block) => {
			const entry = asOptionalRecord(block);
			if (!entry) return [];
			return (entry.type === "text" || entry.type === "input_text") && typeof entry.text === "string" ? [entry.text] : [];
		});
		if (parts.length > 0) return parts.join("\n");
	}
	return typeof message.text === "string" ? message.text : void 0;
}
/** Projects text after model-context selection, or applies ordinary display visibility. */
function projectSessionDisplayMessage(message, options = {}) {
	const entry = asOptionalRecord(message);
	if (!entry || options.view !== "model-context" && entry.display === false) return null;
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	if (role !== "user" && role !== "assistant") return null;
	let text = (role === "assistant" ? extractAssistantPhaseText(entry) : extractUserText(entry))?.trim();
	if (!text || role === "assistant" && isSuppressedControlReplyText(text)) return null;
	if (role === "user") text = stripEnvelope(text).trim();
	if (options.flattenMarkdown) text = flattenMarkdownToPlainText(text);
	if (!text) return null;
	const requestedMaxChars = options.maxChars ?? SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS;
	const limit = Math.min(SESSION_DISPLAY_PROJECTION_MAX_CHARS, Math.max(20, Math.floor(requestedMaxChars)));
	return {
		role,
		text: text.length <= limit ? text : `${truncateUtf16Safe(text, limit - 3)}...`
	};
}
function buildSessionPreviewItems(messages, maxItems, maxChars, view = "display") {
	const items = [];
	for (let index = messages.length - 1; index >= 0 && items.length < maxItems; index -= 1) {
		const projected = projectSessionDisplayMessage(messages[index], {
			maxChars,
			view
		});
		if (!projected) continue;
		items.push(projected);
	}
	return items.toReversed();
}
//#endregion
export { projectSessionDisplayMessage as n, flattenMarkdownToPlainText as r, buildSessionPreviewItems as t };
