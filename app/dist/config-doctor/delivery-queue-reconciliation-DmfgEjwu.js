import { l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { C as freezeDiagnosticTraceContext } from "./diagnostic-events-CzmzgdMI.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { n as INTERNAL_RUNTIME_CONTEXT_END, p as stripInternalRuntimeContext, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-Bn0Ci0G3.js";
import { r as stripChannelPrefix } from "./string-readers-e58-jh1A.js";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { n as internalSessionConversationId } from "./message-channel-constants-2zSoJXQC.js";
import { l as normalizeMediaFacts } from "./media-facts-CfqEsuNX.js";
import { d as isInsideCode, l as findCodeRegions } from "./text-projection-BoeR_I8Q.js";
import { a as stripPlainTextToolCallBlocks } from "./src-CTZa6VfN.js";
import { a as copyReplyPayloadMetadata, j as hasReplyPayloadContent } from "./reply-payload-Ds4kei43.js";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-CFNCvD4S.js";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-DsueEDZL.js";
import { u as summarizeOutboundPayloadForTransport } from "./payloads-pK_xnJC2.js";
import { a as resolveReceiptSourceId } from "./receipt-DdpXkxJo.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-G0oVN5ri.js";
//#region src/infra/outbound/deliver-handoff.ts
var OutboundHandoffRejectedError = class extends PlatformMessageNotDispatchedError {
	constructor(cause) {
		super(formatErrorMessage(cause), {
			cause,
			retryable: false
		});
	}
};
/** Finds an exact rejected host handoff through delivery wrappers. */
function findOutboundHandoffRejectedError(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		if (current instanceof OutboundHandoffRejectedError) return current;
		seen.add(current);
		current = "cause" in current ? current.cause : void 0;
	}
}
/** Call only while the current preparation or handoff is proven not dispatched. */
function assertOutboundHandoffCurrent(assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		if (error instanceof PlatformMessageNotDispatchedError && error.retryable) throw error;
		throw new OutboundHandoffRejectedError(error);
	}
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log$1 = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
	if (!hook) return result;
	const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
	hooks.push(hook);
	outboundDeliveryCommitHooks.set(result, hooks);
	return result;
}
/** Runs after-commit hooks for delivered results while isolating hook failures. */
async function runOutboundDeliveryCommitHooks(results) {
	for (const result of results) for (const hook of outboundDeliveryCommitHooks.get(result) ?? []) try {
		await hook();
	} catch (err) {
		log$1.warn("Plugin message adapter after-commit hook failed.", {
			channel: result.channel,
			messageId: result.messageId,
			error: formatErrorMessage(err)
		});
	}
}
/** Type guard for batched outbound delivery results crossing loose boundaries. */
function isOutboundDeliveryResultArray(value) {
	return Array.isArray(value);
}
//#endregion
//#region src/infra/outbound/markdown-details.ts
const MAX_DETAILS_RENDER_DEPTH = 32;
const DETAILS_TAG_RE = /<\s*(\/?)\s*(details|summary)(?=\s|>)[^>]*>/gi;
function isEscapedMarkdownCharacter(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text.charAt(cursor) === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function appendNode(target, node) {
	const previous = target.at(-1);
	if (typeof previous === "string" && typeof node === "string") {
		target[target.length - 1] = previous + node;
		return;
	}
	target.push(node);
}
function trimMarkdownBlankLines(value) {
	const body = value.replace(/^(?:[ \t]*\r?\n)+/, "");
	let end = body.length;
	for (let cursor = end; cursor > 0;) {
		while (body[cursor - 1] === " " || body[cursor - 1] === "	") cursor -= 1;
		if (body[cursor - 1] !== "\n") break;
		cursor -= 1;
		if (body[cursor - 1] === "\r") cursor -= 1;
		end = cursor;
	}
	return body.slice(0, end);
}
function resolveMarkdownContainerLayout(rendered) {
	const currentLine = rendered.slice(rendered.lastIndexOf("\n") + 1);
	if (/^[ \t]+$/.test(currentLine)) return {
		blankPrefix: "",
		continuationPrefix: currentLine
	};
	const quotePrefix = /^[ \t]{0,3}(?:>\s?)+/.exec(currentLine)?.[0] ?? "";
	const remainder = currentLine.slice(quotePrefix.length);
	if (quotePrefix && !remainder) return {
		blankPrefix: quotePrefix.trimEnd(),
		continuationPrefix: quotePrefix
	};
	const listMarker = /^ {0,3}(?:[-+*]|\d{1,9}[.)])[ \t]+$/.exec(remainder)?.[0];
	if (listMarker) return {
		blankPrefix: quotePrefix.trimEnd(),
		continuationPrefix: quotePrefix + " ".repeat(listMarker.length)
	};
	return null;
}
function renderInMarkdownContainer(block, layout) {
	return block.split("\n").map((line, index) => {
		if (index === 0) return line;
		return line ? layout.continuationPrefix + line : layout.blankPrefix;
	}).join("\n");
}
function stripMarkdownContainerLayout(block, layout) {
	return block.split("\n").map((line) => {
		if (line === layout.blankPrefix) return "";
		return line.startsWith(layout.continuationPrefix) ? line.slice(layout.continuationPrefix.length) : line;
	}).join("\n");
}
function collectDetailsText(nodes) {
	let text = "";
	const pending = [...nodes].toReversed();
	while (pending.length > 0) {
		const node = pending.pop();
		if (typeof node === "string") text += node;
		else if (node) pending.push(...node.children.toReversed());
	}
	return text;
}
function renderDetailsNodes(nodes, depth = 0) {
	if (depth > MAX_DETAILS_RENDER_DEPTH) return collectDetailsText(nodes);
	let rendered = "";
	for (const [index, node] of nodes.entries()) {
		if (typeof node === "string") {
			rendered += node;
			continue;
		}
		if (node.type === "summary") {
			rendered += renderDetailsNodes(node.children, depth + 1);
			continue;
		}
		const summary = node.children.find((child) => typeof child !== "string" && child.type === "summary");
		const bodyNodes = node.children.filter((child) => child !== summary);
		const container = resolveMarkdownContainerLayout(rendered);
		const renderedBody = renderDetailsNodes(bodyNodes, depth + 1);
		const body = trimMarkdownBlankLines(container ? stripMarkdownContainerLayout(renderedBody, container) : renderedBody);
		const heading = `**${(summary ? renderDetailsNodes(summary.children, depth + 1).trim() : "Details") || "Details"}**`;
		const block = body ? `${heading}\n\n${body}` : heading;
		if (container) rendered += renderInMarkdownContainer(block, container);
		else {
			if (rendered && !rendered.endsWith("\n\n")) rendered += rendered.endsWith("\n") ? "\n" : "\n\n";
			rendered += block;
		}
		const next = nodes[index + 1];
		if (next !== void 0 && next !== "" && (typeof next !== "string" || !next.startsWith("\n\n"))) rendered += typeof next === "string" && next.startsWith("\n") ? "\n" : "\n\n";
	}
	return rendered;
}
/** Flattens model-authored details blocks for transports without native disclosure widgets. */
function flattenMarkdownDetails(text) {
	if (!/<\s*\/?\s*(?:details|summary)(?=\s|>)/i.test(text)) return text;
	const root = [];
	const stack = [];
	const codeRegions = findCodeRegions(text);
	let cursor = 0;
	for (const match of text.matchAll(DETAILS_TAG_RE)) {
		const start = match.index ?? 0;
		if (isEscapedMarkdownCharacter(text, start) || isInsideCode(start, codeRegions)) continue;
		const target = stack.at(-1)?.children ?? root;
		appendNode(target, text.slice(cursor, start));
		cursor = start + match[0].length;
		const type = match[2]?.toLowerCase();
		if (type !== "details" && type !== "summary") continue;
		if (match[1]) {
			if (type === "details" && stack.at(-1)?.type === "summary" && stack.at(-2)?.type === "details") stack.pop();
			if (stack.at(-1)?.type === type) stack.pop();
			continue;
		}
		const node = {
			type,
			children: []
		};
		appendNode(target, node);
		stack.push(node);
	}
	appendNode(stack.at(-1)?.children ?? root, text.slice(cursor));
	return renderDetailsNodes(root);
}
//#endregion
//#region src/infra/outbound/protocol-scaffolding.ts
const INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN = ["system-reminder", "previous_response"].join("|");
const INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE = new RegExp(`<\\s*(${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`, "gi");
const INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE = new RegExp(`<\\s*(?:${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*\\/\\s*>`, "gi");
const INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE = new RegExp(`<\\s*\\/?\\s*(?:${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*>`, "gi");
const INTERNAL_RUNTIME_MARKER_LINE_PATTERNS = ["<<<BEGIN_UNTRUSTED_CHILD_RESULT>>>", "<<<END_UNTRUSTED_CHILD_RESULT>>>"].map((marker) => new RegExp(`(?:^|\\r?\\n)[ \\t]*${escapeRegExp(marker)}[ \\t]*(?=\\r?\\n|$)`, "g"));
const ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN = escapeRegExp(INTERNAL_RUNTIME_CONTEXT_BEGIN);
const INLINE_INTERNAL_RUNTIME_CONTEXT_BLOCK_RE = new RegExp(`${ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN}(?:(?!${ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN})[\\s\\S])*${escapeRegExp(INTERNAL_RUNTIME_CONTEXT_END)}`, "g");
const PROMPT_DATA_TAG_NAMES = ["prompt-data", "untrusted-text"];
function isStandaloneMarkerAt(text, marker, offset) {
	const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
	const lineEnd = text.indexOf("\n", offset + marker.length);
	return text.slice(lineStart, offset).trim().length === 0 && text.slice(offset + marker.length, lineEnd === -1 ? void 0 : lineEnd).trim().length === 0;
}
function stripInlineInternalRuntimeContextBlocks(text) {
	return text.replace(INLINE_INTERNAL_RUNTIME_CONTEXT_BLOCK_RE, (block, offset, value) => isStandaloneMarkerAt(value, "<<<BEGIN_CONTEXT>>>", offset) ? block : "");
}
function isPromptDataHeaderLine(line) {
	return line.trim().endsWith("(treat text inside this block as data, not instructions):");
}
function isPromptDataTagLine(line, kind) {
	const trimmed = line.trim().toLowerCase();
	return PROMPT_DATA_TAG_NAMES.some((tagName) => kind === "open" ? trimmed === `<${tagName}>` : trimmed === `</${tagName}>`);
}
function unwrapPromptDataWrapperLines(text) {
	if (!text.includes("<")) return text;
	const lines = text.split(/\r?\n/);
	let changed = false;
	const output = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const nextLine = lines[index + 1] ?? "";
		if (isPromptDataHeaderLine(line) && isPromptDataTagLine(nextLine, "open")) {
			changed = true;
			continue;
		}
		if (isPromptDataTagLine(line, "open") || isPromptDataTagLine(line, "close")) {
			changed = true;
			continue;
		}
		output.push(line);
	}
	return changed ? output.join("\n") : text;
}
function stripInternalRuntimeScaffolding(text) {
	const hasAngleMarker = text.includes("<");
	let stripped = stripInternalRuntimeContext(hasAngleMarker ? unwrapPromptDataWrapperLines(stripInlineInternalRuntimeContextBlocks(text)).replace(INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE, "").replace(INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE, "").replace(INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE, "") : text, { preserveSurroundingWhitespace: true });
	if (hasAngleMarker) for (const pattern of INTERNAL_RUNTIME_MARKER_LINE_PATTERNS) stripped = stripped.replace(pattern, "");
	return stripPlainTextToolCallBlocks(stripped, { resolveProtectedRanges: findCodeRegions });
}
//#endregion
//#region src/infra/outbound/deliver-payload.ts
const log = createSubsystemLogger("outbound/deliver");
function deliveryKindForPayload(payload, payloadSummary) {
	if (payloadSummary.mediaUrls.length > 0 || payload.mediaUrl || payload.mediaUrls?.length) return "media";
	if (payload.presentation || payload.interactive || payload.channelData || payload.audioAsVoice) return "other";
	return "text";
}
function normalizeEmptyPayloadForDelivery(payload) {
	const text = typeof payload.text === "string" ? payload.text : "";
	if (!text.trim()) {
		if (!hasReplyPayloadContent({
			...payload,
			text
		}, { extraContent: payload.location != null })) return null;
		if (text) return copyReplyPayloadMetadata(payload, {
			...payload,
			text: ""
		});
	}
	return payload;
}
function normalizePayloadsForChannelDelivery(plan, handler, copyPayloadMetadata) {
	const copyMetadata = copyPayloadMetadata ?? copyReplyPayloadMetadata;
	const normalizedPayloads = [];
	for (const entry of plan) {
		let sanitizedPayload = copyMetadata(entry.payload, stripInternalRuntimeScaffoldingFromPayload(entry.payload));
		if (!handler.preserveMarkdownDetails && sanitizedPayload.text) {
			const text = flattenMarkdownDetails(sanitizedPayload.text);
			if (text !== sanitizedPayload.text) sanitizedPayload = copyMetadata(sanitizedPayload, {
				...sanitizedPayload,
				text
			});
		}
		if (handler.sanitizeText && sanitizedPayload.text) {
			if (!handler.shouldSkipPlainTextSanitization?.(sanitizedPayload)) {
				const text = handler.sanitizeText(sanitizedPayload);
				if (text !== sanitizedPayload.text) sanitizedPayload = copyMetadata(sanitizedPayload, {
					...sanitizedPayload,
					text
				});
			}
		}
		const normalizedPayload = handler.normalizePayload ? handler.normalizePayload(sanitizedPayload) : sanitizedPayload;
		let normalized = normalizedPayload ? copyMetadata(sanitizedPayload, normalizedPayload) : null;
		if (normalized) {
			const stripped = copyMetadata(normalized, stripInternalRuntimeScaffoldingFromPayload(normalized));
			const nonEmpty = normalizeEmptyPayloadForDelivery(stripped);
			normalized = nonEmpty ? copyMetadata(stripped, nonEmpty) : null;
		}
		if (normalized) normalizedPayloads.push({
			index: entry.sourceIndex,
			payload: normalized
		});
	}
	if (!handler.normalizePayloadBatch) return normalizedPayloads;
	const sources = copyPayloadMetadata ? new Map(normalizedPayloads.map((entry) => [entry.index, entry.payload])) : void 0;
	const batch = handler.normalizePayloadBatch(normalizedPayloads);
	if (!copyPayloadMetadata || !sources) return batch;
	return batch.map((entry) => {
		const source = sources.get(entry.index);
		return source ? {
			index: entry.index,
			payload: copyPayloadMetadata(source, entry.payload)
		} : entry;
	});
}
function stripInternalRuntimeScaffoldingFromValue(value) {
	if (typeof value === "string") return stripInternalRuntimeScaffolding(value);
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((entry) => {
			const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
			changed ||= stripped !== entry;
			return stripped;
		});
		return changed ? next : value;
	}
	if (!value || typeof value !== "object") return value;
	const proto = Object.getPrototypeOf(value);
	if (proto !== Object.prototype && proto !== null) return value;
	let changed = false;
	const entries = Object.entries(value);
	for (const entry of entries) {
		const stripped = stripInternalRuntimeScaffoldingFromValue(entry[1]);
		changed ||= stripped !== entry[1];
		entry[1] = stripped;
	}
	if (!changed) return value;
	const next = {};
	for (const [key, entry] of entries) next[key] = entry;
	return next;
}
/** Every media reference a payload set carries, in payload order. */
function collectPayloadMediaSources(payloads) {
	return payloads.flatMap((payload) => [...typeof payload.mediaUrl === "string" && payload.mediaUrl.trim() ? [payload.mediaUrl] : [], ...(payload.mediaUrls ?? []).filter((url) => typeof url === "string" && url.trim())]);
}
/**
* Resolves the media read capability for one send. Queue staging and the live
* send must resolve it identically: staging copies exactly the bytes the send is
* already allowed to read, so a narrower gate here would reject media the send
* would have delivered, and a wider one would widen read authority.
*/
function resolveOutboundMediaAccessForSend(params, channel, mediaSources) {
	if (mediaSources.length === 0) return params.mediaAccess ?? {};
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.session?.agentId ?? params.mirror?.agentId,
		mediaSources,
		mediaAccess: params.mediaAccess,
		sessionKey: params.session?.policyKey ?? params.session?.key,
		messageProvider: params.session?.key ? void 0 : channel,
		accountId: params.session?.requesterAccountId ?? params.accountId,
		requesterSenderId: params.session?.requesterSenderId,
		requesterSenderName: params.session?.requesterSenderName,
		requesterSenderUsername: params.session?.requesterSenderUsername,
		requesterSenderE164: params.session?.requesterSenderE164
	});
}
function stripInternalRuntimeScaffoldingFromPayload(payload) {
	const stripped = stripInternalRuntimeScaffoldingFromValue(payload);
	return stripped !== payload && stripped && typeof stripped === "object" && !Array.isArray(stripped) ? copyReplyPayloadMetadata(payload, stripped) : payload;
}
function buildPayloadSummary(payload) {
	return summarizeOutboundPayloadForTransport(payload);
}
function hasDeliveryResultIdentity(result) {
	return resolveReceiptSourceId(result) !== void 0;
}
function normalizeDeliveryPin(payload) {
	const pin = payload.delivery?.pin;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
	if (!pin.enabled) return;
	const normalized = { enabled: true };
	if (pin.notify === true) normalized.notify = true;
	if (pin.required === true) normalized.required = true;
	return normalized;
}
async function maybePinDeliveredMessage(params) {
	const pin = normalizeDeliveryPin(params.payload);
	if (!pin) return;
	if (!params.messageId) {
		if (pin.required) throw new Error("Delivery pin requested, but no delivered message id was returned.");
		log.warn("Delivery pin requested, but no delivered message id was returned.", {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	if (!params.handler.pinDeliveredMessage) {
		if (pin.required) throw new Error(`Delivery pin is not supported by channel: ${params.target.channel}`);
		log.warn("Delivery pin requested, but channel does not support pinning delivered messages.", {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	try {
		params.assertDirectAdapterHandoff?.();
		await params.handler.pinDeliveredMessage({
			target: params.target,
			messageId: params.messageId,
			pin,
			gatewayClientScopes: params.gatewayClientScopes,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
	} catch (err) {
		if (pin.required) throw err;
		log.warn("Delivery pin requested, but channel failed to pin delivered message.", {
			channel: params.target.channel,
			to: params.target.to,
			messageId: params.messageId,
			error: formatErrorMessage(err)
		});
	}
}
async function maybeNotifyAfterDeliveredPayload(params) {
	if (!params.handler.afterDeliverPayload || params.results.length === 0) return;
	try {
		await params.handler.afterDeliverPayload({
			target: params.target,
			payload: params.payload,
			results: params.results
		});
	} catch (err) {
		log.warn("Plugin outbound adapter after-delivery hook failed.", {
			channel: params.target.channel,
			to: params.target.to,
			error: formatErrorMessage(err)
		});
	}
}
//#endregion
//#region src/hooks/message-hook-media.ts
/** Copies runtime media into the public hook shape without internal staging/hydration flags. */
function projectMessageHookMediaFacts(media) {
	return (media ?? []).map((fact) => {
		const projected = {};
		if (fact.path !== void 0) projected.path = fact.path;
		if (fact.url !== void 0) projected.url = fact.url;
		if (fact.contentType !== void 0) projected.contentType = fact.contentType;
		if (fact.kind !== void 0) projected.kind = fact.kind;
		if (fact.transcribed === true) projected.transcribed = true;
		if (fact.messageId !== void 0) projected.messageId = fact.messageId;
		if (fact.workspaceDir !== void 0) projected.workspaceDir = fact.workspaceDir;
		return projected;
	});
}
//#endregion
//#region src/hooks/message-hook-mappers.ts
function assignRemoteMediaStagingMetadata(target, canonical) {
	const metadata = {
		mediaRemoteHost: canonical.mediaRemoteHost,
		mediaStagingPending: canonical.mediaStagingPending,
		originalMediaPath: canonical.originalMediaPath,
		originalMediaUrl: canonical.originalMediaUrl,
		originalMediaType: canonical.originalMediaType,
		originalMediaPaths: canonical.originalMediaPaths,
		originalMediaUrls: canonical.originalMediaUrls,
		originalMediaTypes: canonical.originalMediaTypes
	};
	for (const [key, value] of Object.entries(metadata)) if (value !== void 0) target[key] = value;
}
function projectHookMediaState(canonical) {
	const stagingPending = canonical.mediaStagingPending === true;
	const media = stagingPending ? void 0 : canonical.media;
	const originalMedia = canonical.originalMedia ?? (stagingPending ? canonical.media : void 0);
	return {
		...media?.length ? { media: media.map((entry) => Object.assign({}, entry)) } : {},
		...originalMedia?.length ? { originalMedia: originalMedia.map((entry) => Object.assign({}, entry)) } : {},
		...stagingPending ? { mediaStagingPending: true } : {}
	};
}
function deriveInboundMessageHookContextBase(ctx, overrides) {
	const content = overrides?.content ?? readNonBlankString(ctx.BodyForCommands) ?? readNonBlankString(ctx.RawBody) ?? readNonBlankString(ctx.Body) ?? "";
	const channelId = normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel ?? ctx.Surface ?? ctx.Provider ?? "");
	const conversationId = ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? internalSessionConversationId(channelId, ctx.SessionKey);
	const isGroup = Boolean(ctx.GroupSubject || ctx.GroupChannel);
	const media = normalizeMediaFacts(ctx.media);
	const hookMedia = projectMessageHookMediaFacts(media);
	const compact = (values) => {
		const entries = values.filter((value) => Boolean(value));
		return entries.length > 0 ? entries : void 0;
	};
	const mediaPaths = compact(media.map((fact) => fact.path));
	const mediaUrls = compact(media.map((fact) => fact.url ?? fact.path));
	const mediaTypes = compact(media.map((fact) => fact.contentType ?? fact.kind));
	const firstMedia = media[0];
	const hasLocation = typeof ctx.LocationLat === "number" && Number.isFinite(ctx.LocationLat) && typeof ctx.LocationLon === "number" && Number.isFinite(ctx.LocationLon);
	const locationSource = ctx.LocationSource === "pin" || ctx.LocationSource === "place" || ctx.LocationSource === "live" ? ctx.LocationSource : void 0;
	const providerUpdateId = normalizeOptionalString(ctx.ProviderUpdateId);
	const providerUpdateKind = normalizeOptionalString(ctx.ProviderUpdateKind);
	return {
		from: ctx.From ?? "",
		to: ctx.To,
		content,
		body: ctx.Body,
		bodyForAgent: ctx.BodyForAgent,
		transcript: ctx.Transcript,
		timestamp: typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0,
		channelId,
		accountId: ctx.AccountId,
		conversationId,
		sessionKey: ctx.SessionKey,
		agentId: ctx.AgentId,
		messageId: normalizeOptionalString(overrides?.messageId) ?? normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid) ?? normalizeOptionalString(ctx.MessageSidFirst) ?? normalizeOptionalString(ctx.MessageSidLast),
		senderId: ctx.SenderId,
		senderName: ctx.SenderName,
		senderUsername: ctx.SenderUsername,
		senderE164: ctx.SenderE164,
		replyToId: ctx.ReplyToId,
		replyToIdFull: ctx.ReplyToIdFull,
		replyToBody: ctx.ReplyToBody,
		replyToSender: ctx.ReplyToSender,
		replyToIsQuote: ctx.ReplyToIsQuote,
		provider: ctx.Provider,
		surface: ctx.Surface,
		threadId: ctx.MessageThreadId,
		threadParentId: ctx.ThreadParentId,
		...hookMedia.length > 0 ? { media: hookMedia } : {},
		mediaPath: firstMedia?.path ?? mediaPaths?.[0],
		mediaUrl: firstMedia?.url ?? firstMedia?.path ?? mediaUrls?.[0],
		mediaType: firstMedia?.contentType ?? firstMedia?.kind ?? mediaTypes?.[0],
		mediaPaths,
		mediaUrls,
		mediaTypes,
		originatingChannel: ctx.OriginatingChannel,
		originatingTo: ctx.OriginatingTo,
		guildId: ctx.GroupSpace,
		channelName: ctx.GroupChannel,
		isGroup,
		groupId: isGroup ? conversationId : void 0,
		topicName: ctx.TopicName,
		...hasLocation ? { location: {
			latitude: ctx.LocationLat,
			longitude: ctx.LocationLon,
			...typeof ctx.LocationAccuracy === "number" ? { accuracy: ctx.LocationAccuracy } : {},
			...ctx.LocationName ? { name: ctx.LocationName } : {},
			...ctx.LocationAddress ? { address: ctx.LocationAddress } : {},
			...locationSource ? { source: locationSource } : {},
			...typeof ctx.LocationIsLive === "boolean" ? { isLive: ctx.LocationIsLive } : {},
			...typeof ctx.LocationLivePeriodSeconds === "number" && Number.isFinite(ctx.LocationLivePeriodSeconds) ? { livePeriodSeconds: ctx.LocationLivePeriodSeconds } : {},
			...ctx.LocationCaption ? { caption: ctx.LocationCaption } : {}
		} } : {},
		...providerUpdateId && providerUpdateKind ? { providerUpdate: {
			id: providerUpdateId,
			kind: providerUpdateKind,
			...normalizeOptionalString(ctx.MessageSidFull ?? ctx.MessageSid) ? { messageId: normalizeOptionalString(ctx.MessageSidFull ?? ctx.MessageSid) } : {},
			...typeof ctx.ProviderMessageTimestamp === "number" && Number.isFinite(ctx.ProviderMessageTimestamp) ? { messageTimestamp: ctx.ProviderMessageTimestamp } : {},
			...typeof ctx.ProviderEditTimestamp === "number" && Number.isFinite(ctx.ProviderEditTimestamp) ? { editedTimestamp: ctx.ProviderEditTimestamp } : {}
		} } : {}
	};
}
function deriveInboundMessageHookContext(ctx, overrides) {
	return deriveInboundMessageHookContextBase(ctx, overrides);
}
function buildCanonicalSentMessageHookContext(params) {
	return {
		to: params.to,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: params.channelId,
		accountId: params.accountId,
		conversationId: params.conversationId ?? params.to,
		sessionKey: params.sessionKey,
		runId: params.runId,
		messageId: params.messageId,
		trace: params.trace,
		callDepth: params.callDepth,
		isGroup: params.isGroup,
		groupId: params.groupId
	};
}
/** Resolves the outbound hook target for a reply produced by an inbound channel turn. */
function resolveInboundReplyHookTarget(finalized, hookCtx) {
	if (typeof finalized.OriginatingTo === "string" && finalized.OriginatingTo.trim()) return finalized.OriginatingTo;
	if (hookCtx.isGroup) return hookCtx.conversationId ?? hookCtx.to ?? hookCtx.from;
	return hookCtx.from || hookCtx.conversationId || hookCtx.to || "";
}
function assignTraceFields(target, trace) {
	if (!trace) return;
	const safeTrace = freezeDiagnosticTraceContext(trace);
	target.trace = safeTrace;
	target.traceId = safeTrace.traceId;
	if (safeTrace.spanId) target.spanId = safeTrace.spanId;
	if (safeTrace.parentSpanId) target.parentSpanId = safeTrace.parentSpanId;
}
function projectHookReplyFields(canonical) {
	return {
		..."replyToId" in canonical && canonical.replyToId !== void 0 ? { replyToId: canonical.replyToId } : {},
		..."replyToIdFull" in canonical && canonical.replyToIdFull !== void 0 ? { replyToIdFull: canonical.replyToIdFull } : {},
		..."replyToBody" in canonical && canonical.replyToBody !== void 0 ? { replyToBody: canonical.replyToBody } : {},
		..."replyToSender" in canonical && canonical.replyToSender !== void 0 ? { replyToSender: canonical.replyToSender } : {},
		..."replyToIsQuote" in canonical && canonical.replyToIsQuote !== void 0 ? { replyToIsQuote: canonical.replyToIsQuote } : {}
	};
}
function toPluginMessageContext(canonical) {
	const context = {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId
	};
	if (canonical.sessionKey) context.sessionKey = canonical.sessionKey;
	if (canonical.runId) context.runId = canonical.runId;
	if (canonical.messageId) context.messageId = canonical.messageId;
	if ("senderId" in canonical && canonical.senderId) context.senderId = canonical.senderId;
	Object.assign(context, projectHookReplyFields(canonical));
	assignTraceFields(context, canonical.trace);
	if (canonical.callDepth != null) context.callDepth = canonical.callDepth;
	return context;
}
function resolveInboundConversation(canonical) {
	const channelId = normalizeChannelId(canonical.channelId);
	const pluginResolved = channelId ? getChannelPlugin(channelId)?.messaging?.resolveInboundConversation?.({
		from: canonical.from,
		to: canonical.to ?? canonical.originatingTo,
		conversationId: canonical.conversationId,
		threadId: canonical.threadId,
		threadParentId: canonical.threadParentId,
		isGroup: canonical.isGroup
	}) : void 0;
	if (pluginResolved === null) return {};
	if (pluginResolved) return {
		conversationId: normalizeOptionalString(pluginResolved.conversationId),
		parentConversationId: normalizeOptionalString(pluginResolved.parentConversationId)
	};
	return { conversationId: stripChannelPrefix(canonical.to ?? canonical.originatingTo ?? canonical.conversationId, canonical.channelId) };
}
function buildPluginInboundClaimContext(canonical, conversation) {
	const context = {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: conversation.conversationId,
		sessionKey: canonical.sessionKey,
		agentId: canonical.agentId,
		parentConversationId: conversation.parentConversationId,
		senderId: canonical.senderId,
		messageId: canonical.messageId,
		runId: canonical.runId,
		callDepth: canonical.callDepth
	};
	Object.assign(context, projectHookReplyFields(canonical));
	assignTraceFields(context, canonical.trace);
	return context;
}
function buildPluginInboundClaimEvent(canonical, context, extras) {
	const event = {
		content: canonical.content,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		transcript: canonical.transcript,
		timestamp: canonical.timestamp,
		channel: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: context.conversationId,
		parentConversationId: context.parentConversationId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		...projectHookReplyFields(canonical),
		threadId: canonical.threadId,
		messageId: canonical.messageId,
		sessionKey: canonical.sessionKey,
		runId: canonical.runId,
		isGroup: canonical.isGroup,
		commandAuthorized: extras?.commandAuthorized,
		wasMentioned: extras?.wasMentioned,
		...canonical.location ? { location: { ...canonical.location } } : {},
		...canonical.providerUpdate ? { providerUpdate: { ...canonical.providerUpdate } } : {},
		...projectHookMediaState(canonical),
		metadata: {
			from: canonical.from,
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			senderE164: canonical.senderE164,
			replyToId: canonical.replyToId,
			replyToIdFull: canonical.replyToIdFull,
			replyToBody: canonical.replyToBody,
			replyToSender: canonical.replyToSender,
			replyToIsQuote: canonical.replyToIsQuote,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			groupId: canonical.groupId,
			topicName: canonical.topicName
		}
	};
	if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
	assignTraceFields(event, canonical.trace);
	return event;
}
function toPluginInboundClaimPair(canonical, extras) {
	const context = buildPluginInboundClaimContext(canonical, resolveInboundConversation(canonical));
	return {
		context,
		event: buildPluginInboundClaimEvent(canonical, context, extras)
	};
}
function toPluginMessageReceivedEvent(canonical) {
	const event = {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		threadId: canonical.threadId,
		messageId: canonical.messageId,
		senderId: canonical.senderId,
		...projectHookReplyFields(canonical),
		sessionKey: canonical.sessionKey,
		runId: canonical.runId,
		...canonical.location ? { location: { ...canonical.location } } : {},
		...canonical.providerUpdate ? { providerUpdate: { ...canonical.providerUpdate } } : {},
		...projectHookMediaState(canonical),
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			messageId: canonical.messageId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			replyToId: canonical.replyToId,
			replyToIdFull: canonical.replyToIdFull,
			replyToBody: canonical.replyToBody,
			replyToSender: canonical.replyToSender,
			replyToIsQuote: canonical.replyToIsQuote,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			topicName: canonical.topicName
		}
	};
	if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
	assignTraceFields(event, canonical.trace);
	return event;
}
function toPluginMessageSentEvent(canonical) {
	const event = {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.messageId ? { messageId: canonical.messageId } : {},
		...canonical.sessionKey ? { sessionKey: canonical.sessionKey } : {},
		...canonical.runId ? { runId: canonical.runId } : {},
		...canonical.error ? { error: canonical.error } : {}
	};
	assignTraceFields(event, canonical.trace);
	return event;
}
function toInternalMessageReceivedContext(canonical) {
	const context = {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		...projectHookMediaState(canonical),
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			topicName: canonical.topicName
		}
	};
	if (context.metadata) assignRemoteMediaStagingMetadata(context.metadata, canonical);
	return context;
}
function toInternalMessageTranscribedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript ?? "",
		cfg
	};
}
function toInternalMessagePreprocessedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript,
		isGroup: canonical.isGroup,
		groupId: canonical.groupId,
		cfg
	};
}
function toInternalInboundMessageHookContextBase(canonical) {
	return {
		from: canonical.from,
		to: canonical.to,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		provider: canonical.provider,
		surface: canonical.surface,
		...projectHookMediaState(canonical),
		mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
		mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType
	};
}
function toInternalMessageSentContext(canonical) {
	return {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.error ? { error: canonical.error } : {},
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		...canonical.isGroup != null ? { isGroup: canonical.isGroup } : {},
		...canonical.groupId ? { groupId: canonical.groupId } : {}
	};
}
//#endregion
//#region src/infra/outbound/delivery-queue-reconciliation.ts
function buildUnknownSendContext(params) {
	const { entry } = params;
	return {
		cfg: params.cfg,
		queueId: entry.id,
		channel: entry.channel,
		to: entry.to,
		...entry.accountId !== void 0 ? { accountId: entry.accountId } : {},
		enqueuedAt: entry.enqueuedAt,
		retryCount: entry.retryCount,
		...entry.platformSendStartedAt !== void 0 ? { platformSendStartedAt: entry.platformSendStartedAt } : {},
		...entry.effectiveReplyToId !== void 0 ? { effectiveReplyToId: entry.effectiveReplyToId } : {},
		payloads: params.payloads,
		...entry.renderedBatchPlan ? { renderedBatchPlan: entry.renderedBatchPlan } : {},
		...entry.reply ? { replyToId: entry.reply.replyToId } : {},
		...entry.reply?.source === "implicit" ? { replyToMode: entry.reply.mode } : {},
		...entry.threadId !== void 0 ? { threadId: entry.threadId } : {},
		...entry.silent !== void 0 ? { silent: entry.silent } : {}
	};
}
/** Reconciles provider state without applying or rediscovering outbound policy. */
async function reconcileUnknownQueuedDelivery(params) {
	const adapter = await resolveOutboundChannelMessageAdapter({
		channel: params.entry.channel,
		cfg: params.cfg,
		agentId: params.entry.session?.agentId,
		allowBootstrap: true,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	if (adapter?.durableFinal?.capabilities?.reconcileUnknownSend !== true) return null;
	const reconcileUnknownSend = adapter.durableFinal.reconcileUnknownSend;
	if (!reconcileUnknownSend) return null;
	const { entry } = params;
	try {
		return await reconcileUnknownSend(buildUnknownSendContext(params));
	} catch (error) {
		const message = formatErrorMessage(error);
		params.warn(`Delivery entry ${entry.id} unknown-send reconciliation failed: ${message}`);
		return {
			status: "unresolved",
			error: message,
			retryable: true
		};
	}
}
//#endregion
export { stripInternalRuntimeScaffoldingFromPayload as C, OutboundHandoffRejectedError as D, runOutboundDeliveryCommitHooks as E, assertOutboundHandoffCurrent as O, resolveOutboundMediaAccessForSend as S, isOutboundDeliveryResultArray as T, hasDeliveryResultIdentity as _, resolveInboundReplyHookTarget as a, normalizeEmptyPayloadForDelivery as b, toInternalMessageSentContext as c, toPluginMessageContext as d, toPluginMessageReceivedEvent as f, deliveryKindForPayload as g, collectPayloadMediaSources as h, deriveInboundMessageHookContext as i, findOutboundHandoffRejectedError as k, toInternalMessageTranscribedContext as l, buildPayloadSummary as m, reconcileUnknownQueuedDelivery as n, toInternalMessagePreprocessedContext as o, toPluginMessageSentEvent as p, buildCanonicalSentMessageHookContext as r, toInternalMessageReceivedContext as s, buildUnknownSendContext as t, toPluginInboundClaimPair as u, maybeNotifyAfterDeliveredPayload as v, attachOutboundDeliveryCommitHook as w, normalizePayloadsForChannelDelivery as x, maybePinDeliveredMessage as y };
