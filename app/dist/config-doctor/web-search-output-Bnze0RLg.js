import "./src-D9uQ497Z.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { T as resolveExpiresAtMsFromDurationMs, _ as parseDateStringTimestampMs, a as asDateTimestampMs, o as asFiniteNumber, r as MAX_TIMER_TIMEOUT_SECONDS } from "./number-coercion-0M4tZV2c.js";
import { a as consumeResponseBytes } from "./http-response-body-BEF2-H0F.js";
import { t as decodeTextPrefix } from "./text-decoding-BtOrNLtL.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import "./types.secrets-K95Dlap_.js";
import { i as truncateSanitizedExternalContent, o as wrapWebContent } from "./external-content-CpqslxXH.js";
import "./provider-http-errors-BAwtNYrg.js";
import { Type } from "typebox";
//#region src/agents/tools/web-shared.ts
/**
* Shared web tool cache, timeout, and response helpers.
*
* Keeps web_fetch and web_search providers aligned on bounded IO and cache semantics.
*/
function resolveTimeoutSeconds(value, fallback) {
	return Math.min(MAX_TIMER_TIMEOUT_SECONDS, Math.max(1, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback)));
}
function resolveCacheTtlMs(value, fallbackMinutes) {
	return Math.round((typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallbackMinutes) * 6e4);
}
function normalizeCacheKey(value) {
	return value.trim();
}
function readCache(cache, key, ttlMs = Infinity) {
	const entry = cache.get(key);
	if (!entry || ttlMs <= 0) return null;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || now >= entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return now - entry.insertedAt < ttlMs ? {
		value: entry.value,
		cached: true
	} : null;
}
function writeCache(cache, key, value, ttlMs) {
	if (ttlMs <= 0) return;
	const now = Date.now();
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now });
	if (expiresAt === void 0) return;
	pruneMapToMaxSize(cache, 99);
	cache.set(key, {
		value,
		expiresAt,
		insertedAt: now
	});
}
const RESPONSE_CHARSET_SCAN_BYTES = 4096;
const latin1Decoder = new TextDecoder("latin1");
function normalizeCharset(value) {
	const normalized = value?.trim().replace(/^["']|["']$/g, "") ?? "";
	return normalized && normalized.length <= 64 && /^[A-Za-z0-9._:-]+$/.test(normalized) ? normalized : void 0;
}
function readCharsetParam(value) {
	const match = /(?:^|;)\s*charset\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i.exec(value ?? "");
	return normalizeCharset(match?.[1] ?? match?.[2] ?? match?.[3]);
}
function readAttribute(tag, name) {
	const target = name.toLowerCase();
	for (const match of tag.matchAll(/([A-Za-z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) if (match[1]?.toLowerCase() === target) return match[2] ?? match[3] ?? match[4] ?? "";
}
function shouldSniffDocumentCharset(contentType) {
	const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
	if (!mediaType) return true;
	return mediaType === "text/html" || mediaType === "application/xhtml+xml" || mediaType === "text/xml" || mediaType === "application/xml" || mediaType.endsWith("+xml");
}
function sniffCharset(contentType, bytes) {
	if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) return "utf-8";
	if (bytes[0] === 255 && bytes[1] === 254) return "utf-16le";
	if (bytes[0] === 254 && bytes[1] === 255) return "utf-16be";
	const declaredCharset = readCharsetParam(contentType);
	if (declaredCharset || !shouldSniffDocumentCharset(contentType)) return declaredCharset;
	const head = latin1Decoder.decode(bytes.subarray(0, Math.min(bytes.byteLength, RESPONSE_CHARSET_SCAN_BYTES)));
	const xmlEncoding = /<\?xml\s+[^>]*\bencoding\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(head);
	if (xmlEncoding) return normalizeCharset(xmlEncoding[1] ?? xmlEncoding[2]);
	for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
		const tag = match[0];
		const charset = normalizeCharset(readAttribute(tag, "charset"));
		if (charset) return charset;
		if (/^content-type$/i.test(readAttribute(tag, "http-equiv") ?? "")) {
			const contentCharset = readCharsetParam(readAttribute(tag, "content"));
			if (contentCharset) return contentCharset;
		}
	}
}
function concatBytes(parts, totalBytes) {
	if (parts.length === 1 && parts[0]?.byteLength === totalBytes) return parts[0];
	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const part of parts) {
		bytes.set(part, offset);
		offset += part.byteLength;
	}
	return bytes;
}
function responseContentType(res) {
	const headers = res.headers;
	return typeof headers?.get === "function" ? headers.get("content-type") : null;
}
function decodeResponseBytes(res, bytes, truncated = false) {
	const charset = sniffCharset(responseContentType(res), bytes);
	try {
		return decodeTextPrefix(bytes, {
			encoding: charset ?? "utf-8",
			truncated
		});
	} catch {
		return decodeTextPrefix(bytes, {
			encoding: "utf-8",
			truncated
		});
	}
}
async function readResponseText(res, options) {
	const maxBytesRaw = options?.maxBytes;
	const maxBytes = typeof maxBytesRaw === "number" && Number.isFinite(maxBytesRaw) && maxBytesRaw > 0 ? Math.floor(maxBytesRaw) : void 0;
	const body = res.body;
	if (maxBytes && body && typeof body === "object" && "getReader" in body && typeof body.getReader === "function") {
		const reader = body.getReader();
		let bytesRead = 0;
		let truncated = false;
		const parts = [];
		try {
			truncated = (await consumeResponseBytes({
				maxBytes,
				read: () => reader.read(),
				onChunk: (chunk) => {
					bytesRead += chunk.byteLength;
					parts.push(chunk);
				},
				onLimit: () => void 0
			})).truncated;
		} catch {
			truncated = true;
		} finally {
			if (truncated) reader.cancel().catch(() => void 0);
			try {
				reader.releaseLock();
			} catch {}
		}
		return {
			text: decodeResponseBytes(res, concatBytes(parts, bytesRead), truncated),
			truncated,
			bytesRead
		};
	}
	if (maxBytes) {
		if (res instanceof Response && res.body === null) return {
			text: "",
			truncated: false,
			bytesRead: 0
		};
		return {
			text: "",
			truncated: true,
			bytesRead: 0
		};
	}
	const readBytes = res.arrayBuffer;
	if (typeof readBytes === "function") try {
		const bytes = new Uint8Array(await readBytes.call(res));
		return {
			text: decodeResponseBytes(res, bytes),
			truncated: false,
			bytesRead: bytes.byteLength
		};
	} catch {}
	try {
		const text = await res.text();
		return {
			text,
			truncated: false,
			bytesRead: new TextEncoder().encode(text).byteLength
		};
	} catch {
		return {
			text: "",
			truncated: false,
			bytesRead: 0
		};
	}
}
createLazyImportLoader(() => import("./web-guarded-fetch-w1FFsTXl.js"));
//#endregion
//#region src/agents/tools/web-search-output.ts
/**
* Normalized `web_search` output contract.
*
* Every bundled or external provider payload is normalized at the core tool
* boundary into one of four closed branches (error / results / answer / raw).
* The boundary owns the untrusted-content envelope: provider prose is
* re-wrapped here unconditionally, so no provider-controlled metadata can
* spoof the trust marker and transport-specific extras never reach the model.
*/
const WebSearchExternalContentSchema = Type.Object({
	untrusted: Type.Literal(true),
	source: Type.Literal("web_search"),
	wrapped: Type.Literal(true),
	provider: Type.String()
}, { additionalProperties: false });
const WebSearchResultSchema = Type.Object({
	title: Type.String(),
	url: Type.String(),
	snippet: Type.Optional(Type.String()),
	published: Type.Optional(Type.String()),
	siteName: Type.Optional(Type.String())
}, { additionalProperties: false });
const WebSearchCitationSchema = Type.Object({
	url: Type.String(),
	title: Type.Optional(Type.String())
}, { additionalProperties: false });
const WebSearchOutputSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("error"),
		provider: Type.String(),
		error: Type.Literal("provider_error"),
		message: Type.String(),
		docs: Type.Optional(Type.String())
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("results"),
		provider: Type.String(),
		query: Type.String(),
		count: Type.Number(),
		tookMs: Type.Optional(Type.Number()),
		results: Type.Array(WebSearchResultSchema),
		externalContent: WebSearchExternalContentSchema,
		cached: Type.Optional(Type.Literal(true)),
		truncated: Type.Optional(Type.Literal(true))
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("answer"),
		provider: Type.String(),
		query: Type.String(),
		tookMs: Type.Optional(Type.Number()),
		content: Type.String(),
		citations: Type.Optional(Type.Array(WebSearchCitationSchema)),
		externalContent: WebSearchExternalContentSchema,
		cached: Type.Optional(Type.Literal(true)),
		truncated: Type.Optional(Type.Literal(true))
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("raw"),
		provider: Type.String(),
		data: Type.Unknown()
	}, { additionalProperties: false })
]);
const ENVELOPE_OPEN_RE = /^[ \t]*<<<EXTERNAL_UNTRUSTED_CONTENT id="[0-9a-f]+">>>[ \t]*\r?\n(?:Source: [^\n]*\r?\n---\r?\n)?/gmu;
const ENVELOPE_END_RE = /^[ \t]*<<<END_EXTERNAL_UNTRUSTED_CONTENT id="[0-9a-f]+">>>[ \t]*\r?\n?/gmu;
const WEB_SEARCH_OUTPUT_MAX_CHARS = 2e4;
const WEB_SEARCH_CITATION_MAX_COUNT = 20;
const WEB_SEARCH_CITATION_MAX_SCAN = 1e3;
function unwrapWebSearchOutputText(value) {
	return value.replace(ENVELOPE_OPEN_RE, "").replace(ENVELOPE_END_RE, "").trim();
}
function toHttpUrl(value) {
	if (value.length > 2048) return;
	try {
		const parsed = new URL(value);
		return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.href.length <= 2048 ? parsed.href : void 0;
	} catch {
		return;
	}
}
const PUBLISHED_RE = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+Z-]{0,20})?$/u;
function wrapProse(value, budget) {
	let inner = unwrapWebSearchOutputText(value);
	if (budget) {
		const bounded = truncateSanitizedExternalContent(inner, budget.remaining);
		budget.truncated ||= bounded.truncated;
		budget.remaining -= bounded.text.length;
		inner = bounded.text;
	}
	return inner.length === 0 ? "" : wrapWebContent(inner, "web_search");
}
function consumeUrlBudget(url, budget) {
	if (url.length > budget.remaining) {
		budget.truncated = true;
		return false;
	}
	budget.remaining -= url.length;
	return true;
}
function externalContentStamp(provider) {
	return {
		untrusted: true,
		source: "web_search",
		wrapped: true,
		provider
	};
}
function normalizeCitations(value, budget) {
	if (!Array.isArray(value)) return;
	const citations = [];
	let scanned = 0;
	for (const entry of value) {
		if (++scanned > WEB_SEARCH_CITATION_MAX_SCAN || citations.length >= WEB_SEARCH_CITATION_MAX_COUNT) {
			budget.truncated = true;
			break;
		}
		if (typeof entry === "string") {
			const url = toHttpUrl(entry);
			if (url && consumeUrlBudget(url, budget)) citations.push({ url });
			continue;
		}
		const url = isRecord(entry) && typeof entry.url === "string" ? toHttpUrl(entry.url) : void 0;
		if (!isRecord(entry) || !url || !consumeUrlBudget(url, budget)) continue;
		const citation = { url };
		if (typeof entry.title === "string") citation.title = entry.title;
		citations.push(citation);
	}
	return citations;
}
function snapshotProviderResult(result) {
	try {
		const serialized = JSON.stringify(result ?? {});
		const cloned = JSON.parse(serialized);
		return isRecord(cloned) ? cloned : {};
	} catch {
		return null;
	}
}
/** Normalizes every bundled or external provider payload at the core tool boundary. */
function normalizeWebSearchOutput(params) {
	const { provider } = params;
	const result = snapshotProviderResult(params.result);
	if (!result) return {
		kind: "error",
		provider,
		error: "provider_error",
		message: wrapProse("web_search provider returned a value that could not be normalized.")
	};
	const tookMs = asFiniteNumber(result.tookMs);
	const cached = result.cached === true ? true : void 0;
	const budget = {
		remaining: WEB_SEARCH_OUTPUT_MAX_CHARS,
		truncated: result.truncated === true
	};
	const query = params.query;
	if (Object.hasOwn(result, "error")) {
		const rawError = typeof result.error === "string" ? truncateUtf16Safe(result.error, 2e3) : truncateUtf16Safe(JSON.stringify(result.error) ?? "provider_error", 2e3);
		const rawMessage = typeof result.message === "string" ? result.message : rawError;
		const docs = typeof result.docs === "string" ? toHttpUrl(result.docs) : void 0;
		return {
			kind: "error",
			provider,
			error: "provider_error",
			message: wrapProse(rawMessage === rawError ? rawError : `${rawError}: ${rawMessage}`, {
				remaining: 4e3,
				truncated: false
			}),
			...docs ? { docs } : {}
		};
	}
	const rows = Array.isArray(result.results) ? result.results : void 0;
	const conformingRows = rows?.every((entry) => isRecord(entry) && typeof entry.title === "string" && typeof entry.url === "string" && toHttpUrl(entry.url) !== void 0);
	if (rows && conformingRows) {
		budget.truncated ||= rows.length > 10;
		const results = rows.slice(0, 10).flatMap((row) => {
			const url = toHttpUrl(row.url);
			return consumeUrlBudget(url, budget) ? [{
				row,
				url
			}] : [];
		}).map(({ row, url }) => {
			const snippet = typeof row.snippet === "string" ? row.snippet : typeof row.description === "string" ? row.description : Array.isArray(row.snippets) ? row.snippets.find((value) => typeof value === "string") : void 0;
			let published;
			if (typeof row.published === "string" && PUBLISHED_RE.test(row.published)) {
				const calendarDate = row.published.slice(0, 10);
				const timestamp = parseDateStringTimestampMs(calendarDate);
				if (timestamp !== void 0 && new Date(timestamp).toISOString().startsWith(calendarDate)) published = row.published;
			}
			const normalizedRow = {
				title: wrapProse(row.title, budget),
				url
			};
			if (snippet !== void 0) normalizedRow.snippet = wrapProse(snippet, budget);
			if (published !== void 0) normalizedRow.published = published;
			if (typeof row.siteName === "string") normalizedRow.siteName = wrapProse(row.siteName, budget);
			return normalizedRow;
		});
		return {
			kind: "results",
			provider,
			query,
			count: rows.length !== results.length ? results.length : asFiniteNumber(result.count) ?? results.length,
			...tookMs !== void 0 ? { tookMs } : {},
			results,
			externalContent: externalContentStamp(provider),
			...cached ? { cached } : {},
			...budget.truncated ? { truncated: true } : {}
		};
	}
	if (typeof result.content === "string") {
		const citations = normalizeCitations(result.citations, budget);
		const content = wrapProse(result.content, budget);
		for (const citation of citations ?? []) if (citation.title !== void 0) citation.title = wrapProse(citation.title, budget);
		return {
			kind: "answer",
			provider,
			query,
			...tookMs !== void 0 ? { tookMs } : {},
			content,
			...citations !== void 0 ? { citations } : {},
			externalContent: externalContentStamp(provider),
			...cached ? { cached } : {},
			...budget.truncated ? { truncated: true } : {}
		};
	}
	return {
		kind: "raw",
		provider,
		data: result
	};
}
//#endregion
export { readCache as a, resolveTimeoutSeconds as c, normalizeCacheKey as i, writeCache as l, normalizeWebSearchOutput as n, readResponseText as o, unwrapWebSearchOutputText as r, resolveCacheTtlMs as s, WebSearchOutputSchema as t };
