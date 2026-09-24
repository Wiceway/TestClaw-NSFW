import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { t as readLegacyCompactionHistory } from "./legacy-compaction-history-3Lv-j3a5.js";
import { c as resolveSessionTranscriptActiveLeafEntryId } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.js";
import { n as getCliSessionBinding } from "./cli-session-binding-DqRmdzvi.js";
import { t as logLargePayload } from "./diagnostic-payload-BsvL7fUK.js";
import { c as isAssistantInternalReasoningContentType, l as isAssistantTextContentType, s as hasTranscriptMediaFacts } from "./chat-display-projection.helpers-CRHULe2N.js";
import { a as isToolResultContentType, n as isToolCallContentType, o as readToolErrorFlag, r as isToolErrorOutput } from "./tool-content-cVfI1kz1.js";
import { v as resolveCurrentUserProfileDisplay } from "./session-utils-display-0bRfLd7U.js";
import { a as readSessionMessagesAsync, l as session_transcript_readers_exports } from "./session-transcript-readers-D3eaTHpA.js";
import { a as extractChatToolResultCanvasPreview, i as extractChatHistoryBlockText, r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-DUPQnhOF.js";
import { f as isHeartbeatHistoryTurnBoundaryMessage, m as projectForwardedMessages, n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessagesWithState, t as createChatHistoryRecoveryProjection, u as dropPreSessionStartAnnouncePairs } from "./chat-display-projection-C8q6oDEf.js";
import { a as readTranscriptDisplayPosition } from "./transcript-image-artifacts-C8A64B_q.js";
import { a as readChatHistoryMessageSeq, i as readChatHistoryMessageId, n as capOffsetChatHistoryProjectedMessages, o as readChatHistoryRecoveryContext, r as dropChatHistoryOverreadContextMessage, s as readIncrementalChatHistoryTail, t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-BELc1w8p.js";
//#region src/gateway/server-methods/chat-history-budget.ts
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 131072;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
let chatHistoryOmittedEmitCount = 0;
function createChatHistoryActivityProjection(messages, activity = []) {
	const byId = new Map(activity.map((entry) => [entry.messageId, entry]));
	return new Map(messages.flatMap((message) => {
		const messageId = readChatHistoryMessageId(message);
		const entry = messageId ? byId.get(messageId) : void 0;
		const record = asOptionalRecord(message);
		const toolBearing = record && (isToolResultContentType(record.role) || record.role === "tool" || record.role === "function" || Array.isArray(record.content) && record.content.some((block) => {
			const type = asOptionalRecord(block)?.type;
			return isToolCallContentType(type) || isToolResultContentType(type);
		}));
		return entry && toolBearing ? [[message, entry]] : [];
	}));
}
function createChatHistoryByteCounter(activity) {
	const sizes = /* @__PURE__ */ new Map();
	const messageBytes = (message) => {
		const cached = sizes.get(message);
		if (cached !== void 0) return cached;
		const descriptor = activity?.get(message);
		const bytes = jsonUtf8Bytes(message) + (descriptor ? jsonUtf8Bytes(descriptor) + 1 : 0);
		sizes.set(message, bytes);
		return bytes;
	};
	return {
		messageBytes,
		framingBytes: (messages) => messages.some((message) => activity?.has(message)) ? 13 : 0,
		messagesBytes: (messages) => (messages.some((message) => activity?.has(message)) ? 15 : 2) + messages.reduce((bytes, message) => bytes + messageBytes(message), 0) + Math.max(0, messages.length - 1)
	};
}
function chatHistoryActivityBytes(activity) {
	return activity.length > 0 ? jsonUtf8Bytes({ activity }) - 1 : 0;
}
function hasHistoryToolPresentation(message, inheritedError) {
	return Boolean(asOptionalRecord(message.details) || (readToolErrorFlag(message) ?? inheritedError) === true || extractChatToolResultCanvasPreview(message));
}
function isPlainHistoryToolResult(message, inheritedError) {
	if (hasHistoryToolPresentation(message, inheritedError) || (readToolErrorFlag(message) ?? inheritedError ?? isToolErrorOutput(extractChatHistoryBlockText(message)))) return false;
	const content = message.content ?? message.text;
	return content === void 0 || typeof content === "string" || Array.isArray(content) && content.every((block) => {
		const entry = asOptionalRecord(block);
		return isAssistantTextContentType(entry?.type) && typeof entry?.text === "string";
	});
}
function isChatHistoryActivity(message) {
	const entry = asOptionalRecord(message);
	if (!entry || hasTranscriptMediaFacts(entry) || hasHistoryToolPresentation(entry)) return false;
	const metadata = asOptionalRecord(entry["__testclaw"]);
	if (metadata?.kind !== void 0 || metadata?.turnBoundary === true || metadata?.replyToId !== void 0 || metadata?.replyToPreview !== void 0 || entry.testclawDelivery !== void 0 || entry.stopReason === "error") return false;
	const role = normalizeLowercaseStringOrEmpty(entry.role);
	if (role === "toolresult" || role === "tool_result" || role === "tool" || role === "function") return isPlainHistoryToolResult(entry);
	if (role !== "assistant" && role !== "user" || typeof entry.text === "string" && entry.text.trim() || !Array.isArray(entry.content) || entry.content.length === 0) return false;
	return entry.content.every((block) => {
		const content = asOptionalRecord(block);
		if (!content) return false;
		return isToolResultContentType(content.type) ? isPlainHistoryToolResult(content, readToolErrorFlag(entry)) : !hasHistoryToolPresentation(content, readToolErrorFlag(entry)) && (isToolCallContentType(content.type) || isAssistantInternalReasoningContentType(content.type));
	});
}
function trimChatHistoryActivity(params) {
	const { messages, maxBytes, byteCounter } = params;
	let bytes = byteCounter.messagesBytes(messages);
	if (bytes <= maxBytes) return messages;
	let remaining = messages.length;
	return messages.filter((message) => {
		if (bytes <= maxBytes || !isChatHistoryActivity(message)) return true;
		bytes -= byteCounter.messageBytes(message) + (remaining > 1 ? 1 : 0);
		remaining -= 1;
		return false;
	});
}
function buildChatHistoryUnavailableSentinel() {
	return {
		role: "assistant",
		timestamp: Date.now(),
		content: [{
			type: "text",
			text: CHAT_HISTORY_UNAVAILABLE_SENTINEL
		}]
	};
}
function buildOversizedHistoryPlaceholder(message) {
	const entry = asOptionalRecord(message) ?? {};
	const role = typeof entry.role === "string" ? entry.role : "assistant";
	const timestamp = typeof entry.timestamp === "number" ? entry.timestamp : Date.now();
	const metadata = asOptionalRecord(entry["__testclaw"]) ?? {};
	const toolIdentity = Object.fromEntries([
		"toolCallId",
		"tool_call_id",
		"toolUseId",
		"tool_use_id",
		"toolName",
		"tool_name",
		"name"
	].filter((key) => typeof entry[key] === "string").map((key) => [key, entry[key]]));
	const isError = readToolErrorFlag(entry);
	const metadataId = typeof metadata.id === "string" ? metadata.id : void 0;
	const metadataSeq = typeof metadata.seq === "number" ? metadata.seq : void 0;
	const metadataIdempotencyKey = typeof metadata.idempotencyKey === "string" ? metadata.idempotencyKey : void 0;
	const turnBoundary = metadata.turnBoundary === true;
	const transcriptPosition = readTranscriptDisplayPosition(metadata.transcriptPosition);
	return {
		role,
		timestamp,
		content: [{
			type: "text",
			text: CHAT_HISTORY_OVERSIZED_PLACEHOLDER
		}],
		...toolIdentity,
		...isError !== void 0 ? { isError } : {},
		__testclaw: {
			...metadata.toolOutput ? { toolOutput: metadata.toolOutput } : {},
			...metadataId ? { id: metadataId } : {},
			...metadataSeq !== void 0 ? { seq: metadataSeq } : {},
			...metadataIdempotencyKey ? { idempotencyKey: metadataIdempotencyKey } : {},
			...turnBoundary ? { turnBoundary: true } : {},
			...transcriptPosition ? { transcriptPosition } : {},
			truncated: true,
			reason: "oversized"
		}
	};
}
function replaceOversizedChatHistoryMessages(params) {
	const { messages, maxSingleMessageBytes } = params;
	const byteCounter = params.byteCounter ?? createChatHistoryByteCounter();
	if (messages.length === 0) return {
		messages,
		replacedCount: 0
	};
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (byteCounter.messageBytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		const placeholder = buildOversizedHistoryPlaceholder(message);
		return byteCounter.messageBytes(placeholder) <= maxSingleMessageBytes ? placeholder : buildChatHistoryUnavailableSentinel();
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function reportOmittedChatHistory(params) {
	const { originalMessages, finalMessages, getNormalizedBytes, maxHistoryBytes, logDebug } = params;
	const survivors = new Set(finalMessages);
	let omittedCount = 0;
	for (const message of originalMessages) if (!survivors.has(message)) omittedCount += 1;
	if (omittedCount === 0) return 0;
	chatHistoryOmittedEmitCount += omittedCount;
	logLargePayload({
		surface: "gateway.chat.history",
		action: "truncated",
		bytes: getNormalizedBytes(),
		limitBytes: maxHistoryBytes,
		count: omittedCount,
		reason: "chat_history_budget"
	});
	logDebug(`chat.history omitted oversized payloads count=${omittedCount} total=${chatHistoryOmittedEmitCount}`);
	return omittedCount;
}
//#endregion
//#region src/gateway/server-methods/chat-history-page-kernel.ts
function resolveChatHistoryNextOffset(params) {
	let oldestSeq;
	let boundedSiblings = 0;
	for (const message of params.messages) {
		const seq = readChatHistoryMessageSeq(message);
		oldestSeq ??= seq;
		if (seq !== void 0 && seq === oldestSeq) boundedSiblings += 1;
	}
	if (oldestSeq === void 0) return params.offset + params.rawPageMessages;
	const recordOffset = params.totalMessages - oldestSeq + 1;
	const replayOffset = recordOffset - 1;
	if (replayOffset > params.offset) {
		let projectedSiblings = 0;
		for (const message of params.projected) if (readChatHistoryMessageSeq(message) === oldestSeq) {
			projectedSiblings += 1;
			if (projectedSiblings > boundedSiblings) return replayOffset;
		}
	}
	return Math.max(params.offset + 1, recordOffset);
}
function resolveChatHistoryActiveLeafEntryId(readPage) {
	if (readPage.transcriptSource !== "active") return null;
	if (Object.hasOwn(readPage, "activeLeafEntryId")) return readPage.activeLeafEntryId ?? null;
	return resolveSessionTranscriptActiveLeafEntryId(readPage.transcriptEvents ?? []) ?? null;
}
/** Preserve token metrics saved by pre-removal builds; new markers own their metrics. */
function enrichChatHistoryCompactionMarkers(messages, entry) {
	let checkpoints;
	try {
		checkpoints = readLegacyCompactionHistory(entry);
	} catch {
		return messages;
	}
	if (checkpoints.length === 0) return messages;
	const checkpointByEntryId = new Map(checkpoints.flatMap((checkpoint) => {
		const entryId = checkpoint.postCompaction.entryId;
		return entryId ? [[entryId, checkpoint]] : [];
	}));
	let changed = false;
	const enriched = messages.map((message) => {
		const record = asOptionalRecord(message);
		const metadata = asOptionalRecord(record?.["__testclaw"]);
		if (metadata?.kind !== "compaction" || typeof metadata.id !== "string") return message;
		const checkpoint = checkpointByEntryId.get(metadata.id);
		if (!checkpoint) return message;
		const tokensBefore = checkpoint.tokensBefore;
		const tokensAfter = checkpoint.tokensAfter;
		if (tokensBefore === void 0 && tokensAfter === void 0) return message;
		changed = true;
		return {
			...record,
			__testclaw: {
				...metadata,
				...tokensBefore !== void 0 ? { tokensBefore } : {},
				...tokensAfter !== void 0 ? { tokensAfter } : {}
			}
		};
	});
	return changed ? enriched : messages;
}
function resolveChatHistoryMessageGroup(messages, index, messageCost) {
	const seq = readChatHistoryMessageSeq(messages[index]);
	let start = index;
	let end = index + 1;
	let cost = messageCost(messages[index]);
	if (seq === void 0) return {
		start,
		end,
		cost
	};
	while (start > 0 && readChatHistoryMessageSeq(messages[start - 1]) === seq) {
		start -= 1;
		cost += messageCost(messages[start]);
	}
	while (end < messages.length && readChatHistoryMessageSeq(messages[end]) === seq) {
		cost += messageCost(messages[end]);
		end += 1;
	}
	return {
		start,
		end,
		cost
	};
}
function capChatHistoryAroundMessage(params) {
	const anchorIndex = params.messages.findIndex((message) => readChatHistoryMessageId(message) === params.messageId);
	if (anchorIndex === -1) return [];
	const messageCost = params.messageCost ?? (() => 1);
	const anchorGroup = resolveChatHistoryMessageGroup(params.messages, anchorIndex, messageCost);
	if (!(anchorGroup.cost <= params.maxCost)) return [params.messages[anchorIndex]];
	let { start, end, cost } = anchorGroup;
	let canGrowOlder = start > 0;
	let canGrowNewer = end < params.messages.length;
	while (canGrowOlder || canGrowNewer) {
		if (canGrowOlder) {
			const olderGroup = resolveChatHistoryMessageGroup(params.messages, start - 1, messageCost);
			if (cost + olderGroup.cost <= params.maxCost) {
				start = olderGroup.start;
				cost += olderGroup.cost;
			} else canGrowOlder = false;
		}
		canGrowOlder &&= start > 0;
		if (canGrowNewer) {
			const newerGroup = resolveChatHistoryMessageGroup(params.messages, end, messageCost);
			if (cost + newerGroup.cost <= params.maxCost) {
				end = newerGroup.end;
				cost += newerGroup.cost;
			} else canGrowNewer = false;
		}
		canGrowNewer &&= end < params.messages.length;
	}
	return params.messages.slice(start, end);
}
/** Assemble one page from admitted readers; host imports and profile discovery stay outside. */
async function readChatHistoryPageKernel(params, options) {
	const { entry, sessionId, storePath, sessionAgentId, canonicalKey, max, maxHistoryBytes, effectiveMaxChars, offset, messageId } = params;
	if (!sessionId || !storePath) {
		if (messageId) return { messages: [] };
		return {
			...(offset ?? 0) === 0 ? { activeLeafEntryId: null } : {},
			messages: [],
			...offset !== void 0 ? { responseOffset: offset } : {},
			pagination: {
				offset: offset ?? 0,
				totalMessages: 0,
				rawPageMessages: 0
			}
		};
	}
	const readScope = {
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: canonicalKey,
		storePath
	};
	const cliSessionId = options.cliSessionId;
	if ((offset !== void 0 || messageId) && !cliSessionId) {
		let pageOffset = offset ?? 0;
		let hasOverreadContext = false;
		let readPage;
		let incrementalTail;
		if (messageId) {
			const anchoredPage = await options.readers.readSessionMessagesAroundIdWithStatsAsync(readScope, {
				messageId,
				maxMessages: max,
				allowResetArchiveFallback: true,
				readOnly: options.readOnly
			});
			if (!anchoredPage.found) return { messages: [] };
			pageOffset = anchoredPage.offset;
			hasOverreadContext = anchoredPage.hasOverreadContext;
			readPage = anchoredPage;
		} else {
			incrementalTail = await readIncrementalChatHistoryTail({
				entry,
				readScope,
				effectiveMaxChars,
				max,
				maxBytes: maxHistoryBytes,
				offset: pageOffset,
				...options
			});
			readPage = incrementalTail.readPage;
		}
		const isTailPage = !messageId && pageOffset === 0;
		const overreadContextMessage = incrementalTail ? incrementalTail.overreadContextMessage : hasOverreadContext || readPage.messages.length > max ? readPage.messages[0] : void 0;
		const localMessages = incrementalTail ? incrementalTail.rawMessages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const rawPageMessages = incrementalTail ? incrementalTail.rawPageMessages : Math.min(max, Math.max(readPage.messages.length, readPage.totalMessages > pageOffset ? 1 : 0));
		const project = (messages) => projectChatDisplayMessagesWithState(messages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: effectiveMaxChars,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay },
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const projection = incrementalTail?.projection ?? project(localMessages);
		let projected = incrementalTail?.projected ?? projection.messages;
		const newestPageSeq = readChatHistoryMessageSeq(localMessages.at(-1));
		if (!incrementalTail && pageOffset > 0 && newestPageSeq !== void 0 && projection.assistantErrorPending) {
			const recoveryContext = await readChatHistoryRecoveryContext({
				messages: localMessages,
				createRecovery: (messages) => {
					const recovery = createChatHistoryRecoveryProjection({
						maxChars: effectiveMaxChars,
						subagentCoordination: options.readers.subagentCoordination
					});
					recovery.append(messages);
					return recovery;
				},
				readScope,
				readers: options.readers,
				displaySource: readPage.displaySource,
				maxBytes: maxHistoryBytes,
				readOnly: options.readOnly
			});
			if (recoveryContext.length > 0) projected = project([...localMessages, ...recoveryContext]).messages.filter((message) => (readChatHistoryMessageSeq(message) ?? Infinity) <= newestPageSeq);
		}
		const windowed = messageId ? capChatHistoryAroundMessage({
			messages: projected,
			messageId,
			maxCost: max
		}) : projected;
		if (messageId) return {
			messages: augmentChatHistoryWithCanvasBlocks(windowed),
			...projection.activity.length ? { activity: projection.activity } : {}
		};
		return {
			...isTailPage ? {
				activeLeafEntryId: resolveChatHistoryActiveLeafEntryId(readPage),
				...readPage.transcriptSource === "active" && readPage.deltaCursor && !incrementalTail?.projection.assistantErrorPending ? { deltaCursor: readPage.deltaCursor } : {}
			} : {},
			messages: augmentChatHistoryWithCanvasBlocks(windowed),
			...projection.activity.length ? { activity: projection.activity } : {},
			responseOffset: pageOffset,
			pagination: {
				offset: pageOffset,
				totalMessages: readPage.totalMessages,
				rawPageMessages
			}
		};
	}
	const incrementalTail = await readIncrementalChatHistoryTail({
		entry,
		readScope,
		effectiveMaxChars,
		max,
		maxBytes: maxHistoryBytes,
		offset,
		...options
	});
	const { readPage } = incrementalTail;
	const activeLeafEntryId = resolveChatHistoryActiveLeafEntryId(readPage);
	const buildTailPage = (messages) => {
		const windowedTailMessages = offset === void 0 ? messages.length > max ? messages.slice(-max) : messages : capOffsetChatHistoryProjectedMessages(messages, max);
		return {
			activeLeafEntryId,
			...readPage.transcriptSource === "active" && readPage.deltaCursor && !incrementalTail.projection.assistantErrorPending ? { deltaCursor: readPage.deltaCursor } : {},
			messages: augmentChatHistoryWithCanvasBlocks(windowedTailMessages),
			...incrementalTail.projection.activity.length ? { activity: incrementalTail.projection.activity } : {},
			pagination: {
				offset: offset ?? 0,
				totalMessages: readPage.totalMessages,
				rawPageMessages: incrementalTail.rawPageMessages
			}
		};
	};
	return options.readCliTailPage ? options.readCliTailPage({
		readScope,
		incrementalTail,
		activeLeafEntryId,
		buildTailPage
	}) : buildTailPage(incrementalTail.projected);
}
//#endregion
//#region src/gateway/server-methods/chat-history-pages.ts
function readCliIdentityProjectionKey(message) {
	const id = readChatHistoryMessageId(message);
	if (id) return `id:${id}`;
	const record = asOptionalRecord(message);
	const meta = asOptionalRecord(record?.["__testclaw"]);
	const position = readTranscriptDisplayPosition(meta?.transcriptPosition);
	if (!record || !position) return;
	return JSON.stringify([
		position,
		record.role,
		record.text,
		record.content
	]);
}
function projectCliIdentityOntoPagedMessages(params) {
	const importedMetaByKey = /* @__PURE__ */ new Map();
	for (const message of params.completeMessages) {
		const key = readCliIdentityProjectionKey(message);
		const meta = asOptionalRecord(asOptionalRecord(message)?.["__testclaw"]);
		if (key && meta) importedMetaByKey.set(key, meta);
	}
	return params.pagedMessages.map((message) => {
		const record = asOptionalRecord(message);
		const key = readCliIdentityProjectionKey(message);
		const importedMeta = key ? importedMetaByKey.get(key) : void 0;
		if (!record || !importedMeta) return message;
		const localMeta = asOptionalRecord(record["__testclaw"]);
		return {
			...record,
			__testclaw: {
				...localMeta,
				importedFrom: importedMeta.importedFrom,
				externalId: importedMeta.externalId,
				cliSessionId: importedMeta.cliSessionId
			}
		};
	});
}
async function readChatHistoryPage(params, signal) {
	signal?.throwIfAborted();
	if (!params.sessionId || !params.storePath || params.entry?.incognito || isIncognitoSessionKey(params.canonicalKey) || getCliSessionBinding(params.entry, "claude-cli")?.sessionId) {
		const page = await readChatHistoryPageLocal(params);
		return {
			...page,
			messages: refreshForwardedLabels(page.messages)
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DN4pw2Js.js");
	const page = await readSessionHistoryPageInWorker({
		kind: "rpc",
		params: {
			...params,
			sessionId: params.sessionId,
			storePath: params.storePath,
			entry: params.entry ? {
				sessionId: params.entry.sessionId,
				updatedAt: params.entry.updatedAt,
				sessionStartedAt: params.entry.sessionStartedAt
			} : void 0
		}
	}, signal);
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	return {
		...page,
		messages: refreshForwardedLabels(page.messages).map((message) => {
			const record = asOptionalRecord(message);
			return record ? project(record) : message;
		})
	};
}
function refreshForwardedLabels(messages) {
	return projectForwardedMessages(messages.filter((message) => asOptionalRecord(message) !== void 0));
}
async function readChatHistoryPageLocal(params) {
	const { entry, provider, effectiveMaxChars, offset, messageId, sessionId, storePath } = params;
	const cliSessionId = params.ignoreCliSessionImports ? void 0 : getCliSessionBinding(entry, "claude-cli")?.sessionId;
	const subagentCoordination = sessionId && storePath && !entry?.incognito && !isIncognitoSessionKey(params.canonicalKey) ? createSessionHistorySubagentProjection({
		agentId: params.sessionAgentId,
		sessionId,
		sessionKey: params.canonicalKey,
		storePath,
		sessionEntry: entry
	}) : void 0;
	const page = await readChatHistoryPageKernel(params, {
		readers: {
			...session_transcript_readers_exports,
			subagentCoordination
		},
		resolveCurrentUserProfileDisplay,
		...cliSessionId ? {
			cliSessionId,
			readCliTailPage: async ({ readScope, incrementalTail, activeLeafEntryId, buildTailPage }) => {
				const localMessagesWithBoundaryFilter = incrementalTail.rawMessages;
				const { readChatHistoryCliSessionImportSnapshot, resolveChatHistoryWithCliSessionImports } = await import("./cli-session-history-C5GjS_rK.js");
				const importedMessages = await readChatHistoryCliSessionImportSnapshot({
					entry,
					provider,
					localMessages: localMessagesWithBoundaryFilter
				});
				const cliHistory = resolveChatHistoryWithCliSessionImports({
					entry,
					provider,
					localMessages: localMessagesWithBoundaryFilter,
					preparedImportedMessages: importedMessages
				});
				if ((offset !== void 0 || messageId) && !cliHistory.imported) return readChatHistoryPageLocal({
					...params,
					ignoreCliSessionImports: true
				});
				if (cliHistory.expanded || messageId) {
					const completeLocalMessages = dropPreSessionStartAnnouncePairs(await readSessionMessagesAsync(readScope, {
						mode: "full",
						reason: "chat.history CLI import merge",
						allowResetArchiveFallback: true
					}), typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
					const completeCliHistory = resolveChatHistoryWithCliSessionImports({
						entry,
						provider,
						localMessages: completeLocalMessages,
						preparedImportedMessages: importedMessages
					});
					if (!completeCliHistory.imported) return readChatHistoryPageLocal({
						...params,
						ignoreCliSessionImports: true
					});
					const mergedMessages = dropPreSessionStartAnnouncePairs(completeCliHistory.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
					const { messages: displayMessages, activity } = projectChatDisplayMessagesWithState(mergedMessages, {
						subagentCoordination,
						includeCommentaryFallbacks: true,
						maxChars: effectiveMaxChars,
						resolveCurrentUserProfileDisplay
					});
					if (!completeCliHistory.expanded && !messageId) {
						const localPage = await readChatHistoryPageLocal({
							...params,
							ignoreCliSessionImports: true
						});
						return {
							...localPage,
							messages: projectCliIdentityOntoPagedMessages({
								pagedMessages: localPage.messages,
								completeMessages: displayMessages
							})
						};
					}
					if (messageId && !displayMessages.some((message) => readChatHistoryMessageId(message) === messageId)) return { messages: [] };
					return {
						activeLeafEntryId,
						messages: augmentChatHistoryWithCanvasBlocks(displayMessages),
						activity,
						completeCliImport: true,
						pagination: {
							offset: 0,
							totalMessages: mergedMessages.length,
							rawPageMessages: mergedMessages.length,
							exhausted: true
						}
					};
				}
				return buildTailPage(cliHistory.imported ? projectCliIdentityOntoPagedMessages({
					pagedMessages: incrementalTail.projected,
					completeMessages: cliHistory.messages
				}) : incrementalTail.projected);
			}
		} : {}
	});
	subagentCoordination?.assertCurrent?.();
	return page;
}
//#endregion
export { CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as a, createChatHistoryByteCounter as c, trimChatHistoryActivity as d, resolveChatHistoryNextOffset as i, replaceOversizedChatHistoryMessages as l, capChatHistoryAroundMessage as n, chatHistoryActivityBytes as o, enrichChatHistoryCompactionMarkers as r, createChatHistoryActivityProjection as s, readChatHistoryPage as t, reportOmittedChatHistory as u };
