import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import "./fs-safe-defaults-BN1LgdZl.mjs";
import "./fs-safe-advanced-CXTPw96m.mjs";
import "./fs-safe-B1VkXzpu.mjs";
import "./path-guards-0NKGHIHl.mjs";
import "./redact-Db5P6nQB.mjs";
import "./errors-DNLGIg8_.mjs";
import "./replace-file-BKJ_RAaB.mjs";
import "./proxy-env-4XN7_MZW.mjs";
import "./ports-DS8C9XBB.mjs";
import "./ssrf-CA4JQHU2.mjs";
import "./private-file-store-Dn-eyd5t.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import "./dm-policy-shared-Ceyofg5t.mjs";
import "./file-access-runtime-BKC5Ymlf.mjs";
import { pathScope, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot } from "@testclaw/fs-safe/advanced";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	return truncateWithMarker(value, maxChars, {
		marker: "...",
		reserve: 3,
		trimEnd: true
	});
}
/**
* Build bounded, externally wrapped channel metadata for prompt context.
* Channel-provided labels can be user-controlled, so keep the result externally wrapped.
*/
function buildChannelMetadata(params) {
	const cleaned = params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS));
	const deduped = uniqueStrings(cleaned);
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	const truncated = truncateText(`${`Channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS);
	return wrapExternalContent(truncated, {
		source: "channel_metadata",
		includeWarning: false
	});
}
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
const buildUntrustedChannelMetadata = buildChannelMetadata;
//#endregion
export { buildUntrustedChannelMetadata as a, buildChannelMetadata as i, resolveExistingPathsWithinRoot as n, resolveStrictExistingPathsWithinRoot as r, pathScope as t };
