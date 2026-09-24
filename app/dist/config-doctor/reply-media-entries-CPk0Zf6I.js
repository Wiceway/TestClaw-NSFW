import { r as hasEncodedFileUrlSeparator } from "./local-file-access-CJf584nJ.js";
import { T as setReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-Ds4kei43.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/media/media-reference-comparison.ts
const PATH_PARENT_SEGMENT_RE = /(?:^|[\\/])\.\.(?:[\\/]|$)/u;
const FORWARD_NETWORK_PATH_PREFIX_RE = /^\/\//u;
const FILE_URL_PREFIX_RE = /^file:(?:\/\/)?/iu;
const FILE_URL_LOCAL_NETWORK_KEY_PREFIX = "\0file-url-local-network:";
function normalizeAbsoluteLocalPath(value) {
	if (!path.isAbsolute(value) || PATH_PARENT_SEGMENT_RE.test(value) || FORWARD_NETWORK_PATH_PREFIX_RE.test(value)) return value;
	return path.normalize(value);
}
function normalizeFileUrlLocalPath(value) {
	if (!value.startsWith("//")) return normalizeAbsoluteLocalPath(value);
	const normalized = PATH_PARENT_SEGMENT_RE.test(value) ? value : `//${path.normalize(value.slice(2))}`;
	return `${FILE_URL_LOCAL_NETWORK_KEY_PREFIX}${normalized}`;
}
function normalizeMalformedLocalFileUrl(value) {
	const remainder = value.replace(FILE_URL_PREFIX_RE, "");
	let localPath;
	if (remainder.startsWith("/")) localPath = remainder;
	else if (/^localhost(?:\/|$)/iu.test(remainder)) localPath = remainder.slice(9);
	else return;
	if (process.platform === "win32" && /^\/[a-z]:[\\/]/iu.test(localPath)) localPath = localPath.slice(1);
	return normalizeFileUrlLocalPath(localPath);
}
/** Canonicalizes equivalent local media references without resolving the filesystem. */
function normalizeMediaReferenceForComparison(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (!FILE_URL_PREFIX_RE.test(trimmed)) return normalizeAbsoluteLocalPath(trimmed);
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "file:") {
			if (hasEncodedFileUrlSeparator(parsed.pathname)) return trimmed;
			const windows = process.platform === "win32" && (parsed.hostname !== "" || /^\/[a-z]:[\\/]/iu.test(parsed.pathname));
			return normalizeFileUrlLocalPath(fileURLToPath(parsed, { windows }));
		}
	} catch {}
	return normalizeMalformedLocalFileUrl(trimmed) ?? trimmed;
}
//#endregion
//#region src/infra/outbound/reply-media-entries.ts
function mediaReferenceKeys(urls) {
	return [...new Set(urls.map(normalizeMediaReferenceForComparison).filter(Boolean))];
}
/** Record an accepted modifier decision without retaining a stale media snapshot. */
function recordReplyPayloadMediaSelectionChange(previousMediaUrls, payload) {
	const previous = mediaReferenceKeys(previousMediaUrls);
	const selected = mediaReferenceKeys(collectReplyMediaEntries(payload).map(({ url }) => url));
	return previous.length === selected.length && previous.every((url, index) => url === selected[index]) ? payload : setReplyPayloadMetadata(payload, { replyMediaSelectionChanged: true });
}
/** Preserve attachment associations before media URLs are filtered or deduplicated. */
function collectReplyMediaEntries(payload, projectedMediaUrls) {
	const sourcesByReference = getReplyPayloadMetadata(payload)?.replyMediaSourceUrls;
	const withSourceUrls = (entry) => {
		const sourceUrls = sourcesByReference?.get(normalizeMediaReferenceForComparison(entry.url));
		return sourceUrls?.length ? {
			...entry,
			sourceUrls: [...sourceUrls]
		} : entry;
	};
	const attachmentByReference = /* @__PURE__ */ new Map();
	const positionalAttachments = [];
	for (const attachment of payload.attachments ?? []) {
		const reference = normalizeMediaReferenceForComparison(attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath ?? "");
		if (reference && !attachmentByReference.has(reference)) attachmentByReference.set(reference, attachment);
		positionalAttachments.push(reference ? void 0 : attachment);
	}
	const mediaUrlCount = payload.mediaUrls?.length ?? 0;
	const mediaEntries = [...(payload.mediaUrls ?? []).map((url, index) => ({
		url,
		attachment: attachmentByReference.get(normalizeMediaReferenceForComparison(url)) ?? positionalAttachments[index]
	})), ...typeof payload.mediaUrl === "string" ? [{
		url: payload.mediaUrl,
		attachment: attachmentByReference.get(normalizeMediaReferenceForComparison(payload.mediaUrl)) ?? positionalAttachments[mediaUrlCount]
	}] : []];
	if (!projectedMediaUrls) return mediaEntries.map(withSourceUrls);
	const attachmentByUrl = new Map(attachmentByReference);
	for (const { url, attachment } of mediaEntries) {
		const key = normalizeMediaReferenceForComparison(url);
		if (key && attachment && !attachmentByUrl.has(key)) attachmentByUrl.set(key, attachment);
	}
	return projectedMediaUrls.map((url) => withSourceUrls({
		url,
		attachment: attachmentByUrl.get(normalizeMediaReferenceForComparison(url))
	}));
}
//#endregion
export { recordReplyPayloadMediaSelectionChange as n, normalizeMediaReferenceForComparison as r, collectReplyMediaEntries as t };
