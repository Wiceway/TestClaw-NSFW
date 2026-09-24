import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { c as trackAsyncWork } from "./async-work-scope-Botgjsbr.js";
import { b as redactToolPayloadText, l as redactModelVisibleSecrets, p as redactSecrets } from "./redact-myZeUWr_.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DVyJYen1.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-B5EyWEOm.js";
import { n as detectMime, t as FILE_TYPE_SNIFF_MAX_BYTES, u as normalizeMimeType } from "./mime-Bmg9gcyP.js";
import { u as swapSecretSentinelsInText } from "./sentinel-De2SwPfV.js";
import { s as getModelProviderRequestRouteFacts } from "./provider-local-service-reconcile-DGJJw1a3.js";
import { r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-gSti772c.js";
import { n as resolveModelRequestTimeoutMs, t as buildGuardedModelFetch } from "./provider-transport-fetch-Ly8BRMkD.js";
import { configureProviderErrorRedactor } from "@testclaw/ai/diagnostics";
import { configureAiTransportHost } from "@testclaw/ai";
//#region src/agents/openai-strict-tool-setting.ts
/**
* Strict tool-schema default resolution for native OpenAI-compatible routes.
*
* Compatible providers can support strict schemas without inheriting OpenAI's required default.
*/
function resolvesToNativeOpenAIStrictTools(model, transport) {
	const capabilities = getModelProviderRequestRouteFacts(model)?.capabilities ?? resolveProviderRequestCapabilities({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		capability: "llm",
		transport,
		modelId: readStringValue(model.id),
		compat: model.compat
	});
	if (!capabilities.usesKnownNativeOpenAIRoute) return false;
	return capabilities.provider === "openai" || capabilities.provider === "azure-openai" || capabilities.provider === "azure-openai-responses";
}
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
function resolveOpenAIStrictToolSetting(model, options) {
	if (resolvesToNativeOpenAIStrictTools(model, options?.transport ?? "stream")) return true;
	if (options?.supportsStrictMode) return false;
}
//#endregion
//#region src/media/anthropic-inline-images.ts
const ANTHROPIC_SUPPORTED_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
];
const ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES = 10485760;
const ANTHROPIC_MIME_PREFIX_BASE64_CHARS = 4 * Math.ceil(FILE_TYPE_SNIFF_MAX_BYTES / 3);
const ANTHROPIC_SUPPORTED_IMAGE_MIME_SET = new Set(ANTHROPIC_SUPPORTED_IMAGE_MIMES);
function isAnthropicSupportedImageMime(value) {
	return typeof value === "string" && ANTHROPIC_SUPPORTED_IMAGE_MIME_SET.has(value);
}
async function normalizeAnthropicInlineImage(block) {
	const canonicalData = canonicalizeBase64(block.data);
	const data = canonicalData ?? block.data.trim();
	const sniffData = canonicalData?.slice(0, ANTHROPIC_MIME_PREFIX_BASE64_CHARS) ?? data;
	const buffer = Buffer.from(sniffData, "base64");
	const declaredMime = normalizeMimeType(block.mimeType);
	const detectedMime = normalizeMimeType(await detectMime({ buffer }));
	if (isAnthropicSupportedImageMime(detectedMime)) return {
		data,
		mimeType: detectedMime
	};
	if (!detectedMime && isAnthropicSupportedImageMime(declaredMime)) return {
		data,
		mimeType: declaredMime
	};
	const convertToPng = detectedMime === "image/bmp";
	const conversionBuffer = sniffData.length === data.length ? buffer : Buffer.from(data, "base64");
	const { convertImageToJpeg, convertImageToPng } = await import("./image-ops-CMEZXyJ6.js");
	const normalizedBuffer = convertToPng ? await convertImageToPng(conversionBuffer) : await convertImageToJpeg(conversionBuffer);
	if (normalizedBuffer.byteLength > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Normalized Anthropic inline image exceeds the 10 MB decoded safety limit.");
	return {
		data: normalizedBuffer.toString("base64"),
		mimeType: convertToPng ? "image/png" : "image/jpeg"
	};
}
async function normalizeAnthropicInlineContentBlocks(content) {
	for (const block of content) {
		if (block.type !== "image") continue;
		if (estimateBase64DecodedBytes(block.data) > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline image exceeds the 10 MB decoded safety limit.");
	}
	const normalized = [];
	for (const block of content) {
		if (block.type !== "image") {
			normalized.push(block);
			continue;
		}
		normalized.push({
			...block,
			...await normalizeAnthropicInlineImage(block)
		});
	}
	return normalized;
}
//#endregion
//#region src/llm/ai-transport-host.ts
const transportLogBySubsystem = /* @__PURE__ */ new Map();
configureProviderErrorRedactor(redactSecrets);
function transportLog(subsystem) {
	let log = transportLogBySubsystem.get(subsystem);
	if (!log) {
		log = createSubsystemLogger(subsystem);
		transportLogBySubsystem.set(subsystem, log);
	}
	return log;
}
configureAiTransportHost({
	observePendingProviderWork: (pending) => {
		trackAsyncWork(() => pending).catch(() => {});
	},
	buildModelFetch: buildGuardedModelFetch,
	unwrapModelTransportSentinels: unwrapModelHeaderSentinelsForProviderEgress,
	resolveSecretSentinel: (value) => {
		const swapped = swapSecretSentinelsInText(value);
		const unknown = swapped.unknown[0];
		if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing to construct provider client`);
		return swapped.text;
	},
	redactModelVisibleSecrets,
	redactToolPayloadText,
	normalizeAnthropicInlineContentBlocks,
	resolveOpenAIStrictToolSetting,
	resolveModelRequestTimeoutMs: (model) => resolveModelRequestTimeoutMs(model, void 0),
	logDebug: (subsystem, build) => {
		const log = transportLog(subsystem);
		if (!log.isEnabled("debug", "any")) return;
		const entry = build();
		if (entry) log.debug(entry.message, entry.data);
	},
	logInfo: (subsystem, message, data) => transportLog(subsystem).info(message, data),
	logWarn: (subsystem, message, data) => transportLog(subsystem).warn(message, data)
});
//#endregion
export {};
