import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as isStringOption } from "./string-readers-e58-jh1A.js";
import { i as INTERNAL_WAKE_TRANSCRIPT_PROMPTS } from "./heartbeat-CZVa2fL6.js";
import { t as normalizeChatType } from "./chat-type-VRUlDKAl.js";
//#region src/auto-reply/internal-turn-source.ts
/** Keep wake history compact while preserving the producer's actual event identity. */
function resolveInternalTurnTranscript(ctx) {
	const provenance = ctx.InputProvenance?.kind === "internal_system" ? ctx.InputProvenance : {
		kind: "internal_system",
		sourceTool: ctx.InternalTurnSource ?? "heartbeat"
	};
	const source = provenance.sourceTool ?? ctx.InternalTurnSource ?? "heartbeat";
	return {
		text: source === "heartbeat" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.heartbeat : source === "exec" || source === "exec-event" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.exec : source === "cron" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.cron : INTERNAL_WAKE_TRANSCRIPT_PROMPTS.event,
		provenance
	};
}
function legacyInternalTurnSource(value) {
	switch (value) {
		case "heartbeat": return "heartbeat";
		case "cron-event": return "cron";
		case "exec-event": return "exec";
		default: return;
	}
}
/** Fold shipped SDK source labels at ingress; runtime channels describe transport only. */
function normalizeInternalTurnContext(ctx) {
	const source = isStringOption(ctx.InternalTurnSource, [
		"heartbeat",
		"cron",
		"exec",
		"progress-card-refresh"
	]) ? ctx.InternalTurnSource : legacyInternalTurnSource(ctx.Provider);
	if (source) ctx.InternalTurnSource = source;
	else delete ctx.InternalTurnSource;
	for (const field of [
		"Provider",
		"Surface",
		"OriginatingChannel"
	]) if (legacyInternalTurnSource(ctx[field])) delete ctx[field];
}
//#endregion
//#region src/channels/conversation-label.ts
/**
* Conversation label resolver.
*
* Builds readable labels from inbound context while preserving useful id disambiguators.
*/
function extractConversationId(from) {
	const trimmed = normalizeOptionalString(from);
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	return parts.length > 0 ? parts[parts.length - 1] : trimmed;
}
function shouldAppendId(id) {
	if (/^[0-9]+$/.test(id)) return true;
	if (/^[^\s:@]+@[^\s:@]+$/.test(id)) return true;
	return false;
}
/**
* Resolves the most readable conversation label from normalized inbound message context.
*/
function resolveConversationLabel(ctx) {
	const explicit = normalizeOptionalString(ctx.ConversationLabel);
	if (explicit) return explicit;
	const threadLabel = normalizeOptionalString(ctx.ThreadLabel);
	if (threadLabel) return threadLabel;
	if (normalizeChatType(ctx.ChatType) === "direct") return normalizeOptionalString(ctx.SenderName) ?? normalizeOptionalString(ctx.From);
	const base = normalizeOptionalString(ctx.GroupChannel) || normalizeOptionalString(ctx.GroupSubject) || normalizeOptionalString(ctx.GroupSpace) || normalizeOptionalString(ctx.From) || "";
	if (!base) return;
	const id = extractConversationId(ctx.From);
	if (!id) return base;
	if (!shouldAppendId(id)) return base;
	if (base === id) return base;
	if (base.includes(id)) return base;
	if (normalizeLowercaseStringOrEmpty(base).includes(" id:")) return base;
	if (base.startsWith("#") || base.startsWith("@")) return base;
	return `${base} id:${id}`;
}
//#endregion
export { normalizeInternalTurnContext as n, resolveInternalTurnTranscript as r, resolveConversationLabel as t };
