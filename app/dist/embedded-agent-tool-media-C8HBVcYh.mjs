import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-dUIuMpQR.mjs";
import "./tool-policy-6aEa6C7R.mjs";
import { o as readToolResultDetails } from "./tool-result-error-Ce9ky0UT.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-B7qgCBl4.mjs";
import { a as extractToolResultText } from "./embedded-agent-tool-results-DiQscj2f.mjs";
//#region src/agents/embedded-agent-tool-media.ts
/** Extracts and trust-filters media from embedded-agent tool results. */
function pushUniqueMessagingMediaUrl(urls, seen, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || seen.has(normalized)) return;
	seen.add(normalized);
	urls.push(normalized);
}
/** Collects messaging attachment references from tool-call arguments or result records. */
function collectMessagingMediaUrlsFromRecord(record) {
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const attachment = value;
		for (const candidate of [
			attachment.media,
			attachment.mediaUrl,
			attachment.path,
			attachment.filePath,
			attachment.fileUrl,
			attachment.url
		]) pushUniqueMessagingMediaUrl(urls, seen, candidate);
	};
	for (const candidate of [
		record.media,
		record.mediaUrl,
		record.path,
		record.filePath,
		record.fileUrl
	]) pushUniqueMessagingMediaUrl(urls, seen, candidate);
	if (Array.isArray(record.mediaUrls)) for (const mediaUrl of record.mediaUrls) pushUniqueMessagingMediaUrl(urls, seen, mediaUrl);
	if (Array.isArray(record.attachments)) for (const attachment of record.attachments) pushAttachment(attachment);
	return urls;
}
/** Collects messaging attachment references from a completed tool result. */
function collectMessagingMediaUrlsFromToolResult(result) {
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	const appendFromRecord = (value) => {
		if (!value || typeof value !== "object") return;
		for (const url of collectMessagingMediaUrlsFromRecord(value)) if (!seen.has(url)) {
			seen.add(url);
			urls.push(url);
		}
	};
	appendFromRecord(result);
	if (result && typeof result === "object") appendFromRecord(result.details);
	const outputText = extractToolResultText(result);
	if (outputText) try {
		appendFromRecord(JSON.parse(outputText));
	} catch {}
	return urls;
}
/** Extract an internal source-reply payload from a completed message tool result. */
const TRUSTED_TOOL_RESULT_MEDIA = /* @__PURE__ */ new Set([
	"agents_list",
	"apply_patch",
	"browser",
	"canvas",
	AUTOMATIONS_TOOL_NAME,
	"edit",
	"exec",
	"gateway",
	"view_image",
	"image_generate",
	"memory_get",
	"memory_search",
	"message",
	"music_generate",
	"nodes",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"sessions_send",
	"sessions_spawn",
	"subagents",
	"tts",
	"video_generate",
	"web_fetch",
	"web_search",
	"x_search",
	"write"
]);
const HTTP_URL_RE = /^https?:\/\//i;
function isCoreToolResultMediaTrustedName(toolName) {
	if (!toolName) return false;
	return TRUSTED_TOOL_RESULT_MEDIA.has(normalizeToolPolicyName(toolName));
}
function isExternalToolResult(result) {
	const details = readToolResultDetails(result);
	if (!details) return false;
	return typeof details.mcpServer === "string" || typeof details.mcpTool === "string";
}
function isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || isExternalToolResult(result)) return false;
	const registeredName = toolName.trim();
	if (registeredName && trustedLocalMediaToolNames?.has(registeredName) === true) return true;
	return isCoreToolResultMediaTrustedName(toolName);
}
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.embeddedSubscribeToolsTestApi")] = { isToolResultMediaTrusted };
function getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || !isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) || normalizeToolPolicyName(toolName) !== "tts") return;
	const media = readToolResultDetails(result)?.media;
	if (!media || typeof media !== "object" || Array.isArray(media)) return;
	return media.trustedLocalMedia === true ? getCoreTtsToolResultMediaUrls(result) : void 0;
}
function filterToolResultMediaUrls(toolName, mediaUrls, result, trustedLocalMediaToolNames) {
	if (mediaUrls.length === 0) return mediaUrls;
	const trustedOwnedTtsMediaUrls = getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames);
	if (isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames)) {
		if (trustedLocalMediaToolNames !== void 0) {
			const registeredName = toolName?.trim();
			if (!registeredName || !trustedLocalMediaToolNames.has(registeredName)) return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()) || trustedOwnedTtsMediaUrls?.includes(url.trim()));
		}
		return mediaUrls;
	}
	return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
}
function readToolResultDetailsMedia(result) {
	const details = readToolResultDetails(result);
	return details?.media && typeof details.media === "object" && !Array.isArray(details.media) ? details.media : void 0;
}
const REPLY_ATTACHMENT_METADATA_KEYS = /* @__PURE__ */ new Set([
	"type",
	"path",
	"url",
	"mediaUrl",
	"filePath",
	"mimeType",
	"name",
	"sizeBytes",
	"durationMs",
	"width",
	"height"
]);
function collectStructuredMedia(media) {
	const mediaUrls = [];
	const seen = /* @__PURE__ */ new Set();
	const attachmentsByUrl = /* @__PURE__ */ new Map();
	const pushString = (value, attachment) => {
		pushUniqueMessagingMediaUrl(mediaUrls, seen, value);
		const normalized = typeof value === "string" ? value.trim() : "";
		if (normalized && attachment && !attachmentsByUrl.has(normalized)) attachmentsByUrl.set(normalized, attachment);
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const record = value;
		const attachment = Object.fromEntries(Object.entries(record).filter(([key, entry]) => {
			if (!REPLY_ATTACHMENT_METADATA_KEYS.has(key)) return false;
			if (key === "type") return entry === "image" || entry === "audio" || entry === "video" || entry === "file";
			if (key === "width" || key === "height") return asPositiveFiniteNumber(entry) !== void 0;
			if (key === "sizeBytes" || key === "durationMs") return asNonNegativeFiniteNumber(entry) !== void 0;
			return typeof entry === "string";
		}));
		for (const key of [
			"media",
			"path",
			"url",
			"mediaUrl",
			"filePath",
			"fileUrl"
		]) pushString(record[key], attachment);
	};
	pushString(media.media);
	pushString(media.path);
	pushString(media.url);
	pushString(media.mediaUrl);
	pushString(media.filePath);
	pushString(media.fileUrl);
	if (Array.isArray(media.mediaUrls)) for (const value of media.mediaUrls) pushString(value);
	if (Array.isArray(media.attachments)) for (const attachment of media.attachments) pushAttachment(attachment);
	return {
		mediaUrls,
		...attachmentsByUrl.size > 0 ? { attachments: mediaUrls.map((url) => attachmentsByUrl.get(url) ?? {}) } : {}
	};
}
function isNonOutboundToolResultMedia(media) {
	return media.outbound === false;
}
function hasImageContentBlock(content) {
	for (const item of content) {
		if (!item || typeof item !== "object") continue;
		if (item.type === "image") return true;
	}
	return false;
}
function extractToolResultMediaArtifact(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const detailsMedia = readToolResultDetailsMedia(record);
	if (detailsMedia) {
		if (isNonOutboundToolResultMedia(detailsMedia)) return;
		const structuredMedia = collectStructuredMedia(detailsMedia);
		if (structuredMedia.mediaUrls.length > 0) return {
			...structuredMedia,
			...detailsMedia.audioAsVoice === true ? { audioAsVoice: true } : {},
			...detailsMedia.trustedLocalMedia === true ? { trustedLocalMedia: true } : {}
		};
	}
	const content = Array.isArray(record.content) ? record.content : null;
	if (!content) return;
	if (hasImageContentBlock(content)) {
		const details = record.details;
		const p = normalizeOptionalString(details?.path) ?? "";
		if (p) return { mediaUrls: [p] };
	}
}
//#endregion
export { isCoreToolResultMediaTrustedName as a, filterToolResultMediaUrls as i, collectMessagingMediaUrlsFromToolResult as n, extractToolResultMediaArtifact as r, collectMessagingMediaUrlsFromRecord as t };
