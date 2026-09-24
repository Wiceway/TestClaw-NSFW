//#region src/shared/transcript-only-testclaw-assistant.ts
const TESTCLAW_TRANSCRIPT_ARTIFACT_API = "testclaw-transcript";
const TESTCLAW_TRANSCRIPT_ARTIFACT_PROVIDER = "testclaw";
const TESTCLAW_DELIVERY_MIRROR_MODEL = "delivery-mirror";
const CRON_DIRECT_DELIVERY_CONTEXT_KIND = "cron-direct-delivery-context";
const TRANSCRIPT_ONLY_TESTCLAW_ASSISTANT_MODELS = /* @__PURE__ */ new Set([TESTCLAW_DELIVERY_MIRROR_MODEL, "gateway-injected"]);
const TESTCLAW_DELIVERY_MIRROR_KINDS = /* @__PURE__ */ new Set([
	"channel-final",
	"channel-final-suppressed",
	"message-tool-source-reply",
	CRON_DIRECT_DELIVERY_CONTEXT_KIND
]);
function isAssistantDeliveryMirrorMarker(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const kind = value.kind;
	return typeof kind === "string" && TESTCLAW_DELIVERY_MIRROR_KINDS.has(kind);
}
function isTranscriptOnlyAssistantAssistantModel(provider, model) {
	return provider === "testclaw" && typeof model === "string" && TRANSCRIPT_ONLY_TESTCLAW_ASSISTANT_MODELS.has(model);
}
/**
* Returns true when the message is an Assistant-authored transcript artifact
* that must not be replayed to providers.
*
* Primary check: provider="testclaw" + model in known transcript-only set.
* Fallback: a valid testclawDeliveryMirror marker catches observed historical
* rows whose provider/model provenance was stripped (#99470).
*/
function isTranscriptOnlyAssistantAssistantMessage(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	const entry = message;
	if (entry.role !== "assistant") return false;
	if (isTranscriptOnlyAssistantAssistantModel(entry.provider, entry.model)) return true;
	return isAssistantDeliveryMirrorMarker(entry.testclawDeliveryMirror);
}
function isAssistantMessageToolMirrorAssistantMessage(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	const entry = message;
	return entry.role === "assistant" && entry.testclawMessageToolMirror !== void 0;
}
function isAssistantDeliveryMirrorAssistantMessage(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	const entry = message;
	return entry.role === "assistant" && entry.provider === "testclaw" && entry.model === "delivery-mirror";
}
//#endregion
export { isAssistantDeliveryMirrorAssistantMessage as a, isTranscriptOnlyAssistantAssistantModel as c, TESTCLAW_TRANSCRIPT_ARTIFACT_PROVIDER as i, TESTCLAW_DELIVERY_MIRROR_MODEL as n, isAssistantMessageToolMirrorAssistantMessage as o, TESTCLAW_TRANSCRIPT_ARTIFACT_API as r, isTranscriptOnlyAssistantAssistantMessage as s, CRON_DIRECT_DELIVERY_CONTEXT_KIND as t };
