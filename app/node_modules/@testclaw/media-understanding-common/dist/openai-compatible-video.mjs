//#region packages/media-understanding-common/src/openai-compatible-video.ts
/** Trim optional strings, falling back when empty. */
function resolveMediaUnderstandingString(value, fallback) {
	return value?.trim() || fallback;
}
/** Coerce text from OpenAI-compatible content or reasoning fields. */
function coerceOpenAiCompatibleVideoText(payload) {
	const message = payload.choices?.[0]?.message;
	if (!message) return null;
	if (typeof message.content === "string" && message.content.trim()) return message.content.trim();
	if (Array.isArray(message.content)) {
		const text = message.content.map((part) => part.text?.trim() ?? "").filter(Boolean).join("\n");
		if (text) return text;
	}
	if (typeof message.reasoning_content === "string" && message.reasoning_content.trim()) return message.reasoning_content.trim();
	return null;
}
/** Build an OpenAI-compatible request body with an inline data URL video. */
function buildOpenAiCompatibleVideoRequestBody(params) {
	return {
		model: params.model,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: params.prompt
			}, {
				type: "video_url",
				video_url: { url: `data:${params.mime};base64,${params.buffer.toString("base64")}` }
			}]
		}]
	};
}
//#endregion
export { buildOpenAiCompatibleVideoRequestBody, coerceOpenAiCompatibleVideoText, resolveMediaUnderstandingString };
