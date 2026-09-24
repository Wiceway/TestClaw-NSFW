import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { o as asFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { k as formatProviderRefusalText } from "./redact-myZeUWr_.js";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { i as nestedToolActivityContent, o as readNestedToolActivity } from "./transcript-redact-C2CfuzTs.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import "./internal-runtime-context-Bn0Ci0G3.js";
import { t as HEARTBEAT_PROMPT } from "./heartbeat-CZVa2fL6.js";
import { a as readSessionTranscriptRunId } from "./transcript-events-DSYwY5Fq.js";
import { n as estimateBase64DecodedBytes } from "./base64-B5EyWEOm.js";
import { a as isAssistantDeliveryMirrorAssistantMessage, o as isAssistantMessageToolMirrorAssistantMessage, s as isTranscriptOnlyAssistantAssistantMessage } from "./transcript-only-testclaw-assistant-DMb_WNdn.js";
import { l as resolveAssistantMessagePhase, o as parseAssistantTextSignature, s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-CmXfSSBe.js";
import "./gateway-error-details-D4L8ZwC-.js";
import { D as renderAssistantRequestFailureCopy, k as renderRecordedAssistantFailureCopy } from "./user-copy-CP-Iqg-t.js";
import { h as normalizeInputProvenance, m as isSubagentCoordinationInputProvenance, u as isCompletionReportInputProvenance, v as stripInterSessionPromptPrefixForDisplay } from "./input-provenance-DGaz_sh7.js";
import { s as projectAssistantDisplayContent } from "./transcript-scRUtjvw.js";
import { h as getCronStoreKysely } from "./row-codec-uVFeVvND.js";
import { y as resolveCronJobsStorePath } from "./store-DmG8kbi1.js";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken } from "./control-reply-text-DBCNOdDS.js";
import { _ as stripPrivateToolCallContextForDisplay, a as hasAssistantDisplayableNonTextContent, c as isAssistantInternalReasoningContentType, d as isEmptyTextOnlyContent, f as isForwardedUserMessage, g as stripAssistantMediaDirectivesForDisplay, h as shouldPreserveAssistantControlReplyText, i as extractProjectedText, l as isAssistantTextContentType, n as asRoleContentMessage, o as hasAssistantNonTextContent, p as isProjectedForwardedMessage, r as extractAssistantTextForSilentCheck, s as hasTranscriptMediaFacts, t as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, u as isCronRunMessage, v as takeAssistantManagedMediaUrlsForDisplay, y as truncateChatHistoryText } from "./chat-display-projection.helpers-CRHULe2N.js";
import { i as buildRunUserTurnIdempotencyKey, l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-BAAmUJGD.js";
import { a as parseInboundMediaUri, n as buildInboundMediaUriFromPath } from "./media-reference-DHQmzlyp.js";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-D9Q3Q7vm.js";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-DnlQaNru.js";
import { n as stripEnvelopeFromMessages } from "./chat-sanitize-BBZ5h27-.js";
import { c as messageHasToolResultShape, i as extractChatHistoryBlockText, l as projectToolResultDetails, o as isToolHistoryBlockType, s as isToolResultHistoryBlockType } from "./chat-display-projection.canvas-DUPQnhOF.js";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.js";
import { n as projectTranscriptImageArtifacts } from "./transcript-image-artifacts-C8A64B_q.js";
import { createHash } from "node:crypto";
import { toUSVString } from "node:util";
import { STREAM_ERROR_FALLBACK_TEXT } from "@testclaw/ai/internal/shared";
//#region src/cron/store/job-name.ts
/** Read display metadata without loading payloads or running cron store repairs. */
function createCronJobNameResolver(jobIds) {
	let names;
	return (jobId) => {
		if (!names) {
			const storePath = resolveCronJobsStorePath();
			names = withExistingAssistantStateDatabaseReadOnly(({ db }) => {
				if (!tableExists(db, "cron_jobs")) return /* @__PURE__ */ new Map();
				const rows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select(["job_id", "name"]).where("store_key", "=", storePath).where("job_id", "in", sqliteStringSet(jobIds))).rows;
				return new Map(rows.map((row) => [row.job_id, normalizeOptionalString(row.name)]));
			}) ?? /* @__PURE__ */ new Map();
		}
		return names.get(toUSVString(jobId));
	};
}
//#endregion
//#region src/gateway/chat-display-projection.history.ts
function isSubagentCoordinationHistoryInput(message, isSubagentSession) {
	if (message.role !== "user") return false;
	const provenance = normalizeInputProvenance(message.provenance);
	if (isSubagentCoordinationInputProvenance(provenance)) return true;
	return Boolean(provenance?.kind === "inter_session" && provenance.sourceTool === "sessions_send" && provenance.sourceSessionKey && isSubagentSession?.(provenance.sourceSessionKey));
}
/** Keep coordination in the model transcript while projecting only human-facing outcomes. */
function createSubagentCoordinationHistoryProjection(resolver) {
	const hiddenInputKeys = /* @__PURE__ */ new Set();
	const visibleInputKeys = /* @__PURE__ */ new Set();
	const visibleSteerRunIds = /* @__PURE__ */ new Set();
	return (messages) => {
		resolver?.assertCurrent?.();
		const projected = messages.map((message) => {
			const record = asOptionalRecord(message);
			if (!record) return message;
			const metadata = asOptionalRecord(record["__testclaw"]);
			if (isSubagentCoordinationHistoryInput(record, resolver?.isSubagentSession)) {
				const inputKey = record.idempotencyKey ?? metadata?.idempotencyKey;
				if (typeof inputKey === "string" && !metadata?.steerTargetRunId) hiddenInputKeys.add(inputKey);
				return record.display === false ? record : {
					...record,
					display: false
				};
			}
			const runId = readSessionTranscriptRunId(record);
			if (record.role === "user") {
				const inputKey = record.idempotencyKey ?? metadata?.idempotencyKey;
				if (typeof inputKey === "string") visibleInputKeys.add(inputKey);
				const steerTargetRunId = metadata?.steerTargetRunId ?? runId;
				if (typeof steerTargetRunId === "string") visibleSteerRunIds.add(steerTargetRunId);
				return message;
			}
			if (record.display === false) return message;
			if ((record.role === "assistant" || record.role === "toolResult" || record.role === "custom") && runId && !visibleSteerRunIds.has(runId) && (hiddenInputKeys.has(buildRunUserTurnIdempotencyKey(runId)) || !visibleInputKeys.has(buildRunUserTurnIdempotencyKey(runId)) && resolver?.isSubagentRunMessage(runId, typeof metadata?.seq === "number" ? metadata.seq : void 0))) return {
				...record,
				display: false
			};
			return message;
		});
		resolver?.assertCurrent?.();
		return projected;
	};
}
function readTtsSupplementMarker(message) {
	const marker = asOptionalRecord(message.testclawTtsSupplement);
	if (!marker) return;
	const textSha256 = typeof marker.textSha256 === "string" && marker.textSha256.trim() ? marker.textSha256.trim() : void 0;
	const spokenText = typeof marker.spokenText === "string" && marker.spokenText.trim() ? marker.spokenText.trim() : void 0;
	return textSha256 || spokenText ? {
		textSha256,
		spokenText
	} : void 0;
}
function readAssistantTtsSupplementMarker(message) {
	const marker = readTtsSupplementMarker(message);
	if (!marker || asRoleContentMessage(message)?.role !== "assistant") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	let hasSupplementBlock = false;
	for (const block of content) {
		const record = asOptionalRecord(block);
		if (!record) continue;
		if (record.type !== "text") {
			hasSupplementBlock = true;
			continue;
		}
		const text = typeof record.text === "string" ? record.text.trim() : "";
		if (text && text !== "Audio reply") return;
	}
	return hasSupplementBlock ? marker : void 0;
}
/** Recognize stored supplements using the same display content as full history. */
function isAssistantTtsSupplementMessage(message) {
	const record = asOptionalRecord(message);
	return record !== void 0 && readAssistantTtsSupplementMarker(projectAssistantDisplayContent(record)) !== void 0;
}
function readTtsSupplementTargetText(message) {
	return asRoleContentMessage(message)?.role === "assistant" && !isProjectedForwardedMessage(message) && !readTtsSupplementMarker(message) ? extractProjectedText(message.content ?? message.text).trim() : "";
}
function mergeTtsSupplementContent(target, supplement) {
	const supplementBlocks = Array.isArray(supplement.content) ? supplement.content.filter((block) => {
		const record = asOptionalRecord(block);
		return record !== void 0 && record.type !== "text";
	}) : [];
	if (supplementBlocks.length === 0) return target;
	const targetContent = target.content;
	if (Array.isArray(targetContent)) return {
		...target,
		content: [...targetContent, ...supplementBlocks]
	};
	const targetText = extractProjectedText(targetContent ?? target.text).trim();
	return {
		...target,
		content: [...targetText ? [{
			type: "text",
			text: targetText
		}] : [], ...supplementBlocks]
	};
}
function mergeTtsSupplementMessages(messages) {
	if (!messages.some(readAssistantTtsSupplementMarker)) return messages;
	const targetTexts = [];
	const targetHashes = [];
	const merged = [];
	let changed = false;
	for (const message of messages) {
		const marker = readAssistantTtsSupplementMarker(message);
		if (marker) {
			let targetIndex = -1;
			for (let i = merged.length - 1; i >= 0; i--) {
				const candidate = merged[i];
				if (!candidate) continue;
				const text = targetTexts[i] ??= readTtsSupplementTargetText(candidate);
				if (text && (marker.textSha256 && (targetHashes[i] ??= createHash("sha256").update(text).digest("hex")) === marker.textSha256 || marker.spokenText && text === marker.spokenText)) {
					targetIndex = i;
					break;
				}
			}
			if (targetIndex >= 0) {
				merged[targetIndex] = mergeTtsSupplementContent(expectDefined(merged[targetIndex], "merged entry at target index"), message);
				targetTexts[targetIndex] = targetHashes[targetIndex] = void 0;
				changed = true;
				continue;
			}
		}
		merged.push(message);
	}
	return changed ? merged : messages;
}
function isSubagentAnnounceInterSessionUserMessage(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	if (provenance?.kind === "inter_session" && (provenance.sourceTool === "subagent_announce" || provenance.sourceTool === "subagent_settle")) return true;
	const text = extractProjectedText(message.content ?? message.text);
	return text.includes("[Inter-session message]") && text.includes("sourceTool=subagent_announce");
}
function readChatHistoryRecordTimestampMs(message) {
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__testclaw"]);
	return asFiniteNumber(meta?.recordTimestampMs) ?? asFiniteNumber(asOptionalRecord(message)?.timestamp);
}
function isSubagentAnnounceInterSessionUserChatHistoryMessage(message) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "user") return false;
	const provenance = normalizeInputProvenance(record.provenance);
	if (provenance?.kind === "inter_session" && (provenance.sourceTool === "subagent_announce" || provenance.sourceTool === "subagent_settle")) return true;
	const text = extractChatHistoryBlockText(record);
	return typeof text === "string" && text.includes("[Inter-session message]") && text.includes("sourceTool=subagent_announce");
}
function isChatHistoryAssistantMessage(message) {
	return asOptionalRecord(message)?.role === "assistant";
}
function createPreSessionStartAnnouncePairFilter(sessionStartedAt) {
	let precedingAnnounce = false;
	return (messages) => {
		if (sessionStartedAt === void 0 || messages.length === 0) return messages;
		let changed = false;
		const kept = [];
		for (const current of messages) {
			if (precedingAnnounce) {
				precedingAnnounce = false;
				const ts = isChatHistoryAssistantMessage(current) ? readChatHistoryRecordTimestampMs(current) : void 0;
				if (typeof ts === "number" && ts < sessionStartedAt) {
					changed = true;
					continue;
				}
			}
			if (isSubagentAnnounceInterSessionUserChatHistoryMessage(current)) {
				const ts = readChatHistoryRecordTimestampMs(current);
				if (typeof ts === "number" && ts < sessionStartedAt) {
					precedingAnnounce = true;
					changed = true;
					continue;
				}
			}
			kept.push(current);
		}
		return changed ? kept : messages;
	};
}
function dropPreSessionStartAnnouncePairs(messages, sessionStartedAt) {
	return createPreSessionStartAnnouncePairFilter(sessionStartedAt)(messages);
}
function isDisplayHiddenProjectedMessage(message) {
	if (message.display === false) return true;
	return message.role === "custom" && message.customType === "runtime.context";
}
function shouldHideProjectedHistoryMessage(message, roleContent, heartbeatUser) {
	if (isDisplayHiddenProjectedMessage(message)) return true;
	if (isProjectedForwardedMessage(message)) return false;
	if (!roleContent) return false;
	if (roleContent.role === "user" && isCompletionReportInputProvenance(message.provenance)) return true;
	if (roleContent.role === "user" && isSubagentAnnounceInterSessionUserMessage(message)) return true;
	if (roleContent.role === "user" && isEmptyTextOnlyContent(message.content ?? message.text) && !hasTranscriptMediaFacts(message)) return true;
	if (roleContent.role === "assistant" && isEmptyTextOnlyContent(message.content ?? message.text)) return false;
	return heartbeatUser || isHeartbeatOkResponse(roleContent);
}
/** Identifies the hidden native input that starts a heartbeat-driven turn. */
function isHeartbeatHistoryTurnBoundaryMessage(message) {
	const record = asOptionalRecord(message);
	if (!record || isForwardedUserMessage(record)) return false;
	const roleContent = asRoleContentMessage(record);
	return roleContent?.role === "user" && isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT);
}
function attachProjectedTurnBoundary(message) {
	const metadata = asOptionalRecord(message["__testclaw"]);
	if (metadata?.turnBoundary === true) return message;
	return {
		...message,
		__testclaw: {
			...metadata,
			turnBoundary: true
		}
	};
}
function canCarryProjectedTurnBoundary(message) {
	return Boolean(message && message.role !== "system" && message.role !== "custom");
}
function testclawAssistantModel(message) {
	return message.role === "assistant" && message.provider === "testclaw" && typeof message.model === "string" ? message.model : void 0;
}
function displayTextForDuplicateCheck(message) {
	const text = extractProjectedText(message.content ?? message.text).trim();
	return text ? text : void 0;
}
function isDuplicateAcpGatewayInjectedMessage(current, previousVisible) {
	if (!previousVisible) return false;
	if (testclawAssistantModel(previousVisible) !== "acp-runtime" || testclawAssistantModel(current) !== "gateway-injected") return false;
	if (hasAssistantNonTextContent(previousVisible) || hasAssistantNonTextContent(current)) return false;
	const previousText = displayTextForDuplicateCheck(previousVisible);
	const currentText = displayTextForDuplicateCheck(current);
	return Boolean(previousText && currentText && previousText === currentText);
}
function isDuplicateChannelFinalDeliveryMirror(current, previousVisible) {
	if (!previousVisible || !isAssistantDeliveryMirrorAssistantMessage(current)) return false;
	const deliveryMirror = asOptionalRecord(current.testclawDeliveryMirror);
	if (deliveryMirror?.kind !== "channel-final") return false;
	if (asRoleContentMessage(previousVisible)?.role !== "assistant") return false;
	if (isAssistantDeliveryMirrorAssistantMessage(previousVisible)) return false;
	if (isProjectedForwardedMessage(previousVisible)) return false;
	const previousMeta = asOptionalRecord(previousVisible["__testclaw"]);
	if (typeof deliveryMirror.sourceAssistantMessageId === "string") {
		if (!deliveryMirror.sourceAssistantMessageId || deliveryMirror.sourceAssistantMessageId !== previousMeta?.id || hasAssistantDisplayableNonTextContent(previousVisible) || hasAssistantNonTextContent(current) || hasTranscriptMediaFacts(previousVisible) || hasTranscriptMediaFacts(current)) return false;
		const previousText = extractAssistantPhaseText(previousVisible)?.trim();
		const currentText = extractAssistantPhaseText(current)?.trim();
		return Boolean(previousText && currentText && previousText === currentText);
	}
	if (typeof previousMeta?.mirrorIdentity !== "string" || !previousMeta.mirrorIdentity.trim()) return false;
	if (hasAssistantNonTextContent(previousVisible) || hasAssistantNonTextContent(current)) return false;
	const previousText = displayTextForDuplicateCheck(previousVisible);
	const currentText = displayTextForDuplicateCheck(current);
	return Boolean(previousText && currentText && previousText === currentText);
}
function toProjectedMessages(messages) {
	return messages.flatMap((message) => {
		const record = asOptionalRecord(message);
		return record ? [projectAssistantDisplayContent(record)] : [];
	});
}
function filterVisibleProjectedHistoryMessages(messages, turnBoundaryPending = false) {
	if (messages.length === 0) return {
		messages,
		turnBoundaryPending
	};
	let pendingTurnBoundary = turnBoundaryPending;
	let changed = false;
	const visible = [];
	for (let i = 0; i < messages.length; i++) {
		const current = messages[i];
		if (!current) continue;
		const currentRoleContent = asRoleContentMessage(current);
		const heartbeatUser = Boolean(currentRoleContent && isHeartbeatUserMessage(currentRoleContent, HEARTBEAT_PROMPT));
		const next = heartbeatUser ? messages[i + 1] : void 0;
		const nextRoleContent = next ? asRoleContentMessage(next) : null;
		if (next && nextRoleContent && isHeartbeatOkResponse(nextRoleContent) && !isProjectedForwardedMessage(next)) {
			changed = true;
			pendingTurnBoundary = true;
			i++;
			continue;
		}
		if (shouldHideProjectedHistoryMessage(current, currentRoleContent, heartbeatUser)) {
			changed = true;
			pendingTurnBoundary ||= heartbeatUser && !isForwardedUserMessage(current);
			continue;
		}
		if (isDuplicateAcpGatewayInjectedMessage(current, messages[i - 1]) || isDuplicateChannelFinalDeliveryMirror(current, messages[i - 1])) {
			changed = true;
			continue;
		}
		if (pendingTurnBoundary && canCarryProjectedTurnBoundary(currentRoleContent)) {
			visible.push(attachProjectedTurnBoundary(current));
			pendingTurnBoundary = false;
			changed = true;
		} else visible.push(current);
	}
	return {
		messages: changed ? visible : messages,
		turnBoundaryPending: pendingTurnBoundary
	};
}
function stripPromptPrefixFromContent(content, strip) {
	if (typeof content === "string") return strip(content);
	if (!Array.isArray(content)) return content;
	return content.map((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return block;
		const record = block;
		if (typeof record.text !== "string") return block;
		const stripped = strip(record.text);
		return stripped === record.text ? block : {
			...record,
			text: stripped
		};
	});
}
function readForwardedSender(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	const sourceSessionKey = provenance?.sourceSessionKey;
	const parsed = parseAgentSessionKey(sourceSessionKey);
	return {
		sourceSessionKey,
		agentId: parsed?.agentId,
		jobId: isCronRunMessage(message) ? provenance?.jobId : parsed?.rest.match(/^cron:([^:]+):run:[^:]+$/u)?.[1]
	};
}
function resolveForwardedSenderSession(message, resolveCronJobName) {
	const { sourceSessionKey, agentId, jobId } = readForwardedSender(message);
	const label = jobId ? resolveCronJobName(jobId) ?? "Automation" : void 0;
	return sourceSessionKey ? {
		sessionKey: sourceSessionKey,
		...agentId ? { agentId } : {},
		...label ? { label } : {}
	} : void 0;
}
function projectForwardedMessages(messages, resolveCronJobName) {
	const resolve = resolveCronJobName ?? createCronJobNameResolver(messages.flatMap((message) => {
		if (!isForwardedUserMessage(message) && !isProjectedForwardedMessage(message)) return [];
		const jobId = readForwardedSender(message).jobId;
		return jobId ? [jobId] : [];
	}));
	const names = /* @__PURE__ */ new Map();
	const resolveName = (jobId) => {
		if (!names.has(jobId)) names.set(jobId, resolve(jobId));
		return names.get(jobId);
	};
	let changed = false;
	const projected = messages.map((message) => {
		if (!isForwardedUserMessage(message) && !isProjectedForwardedMessage(message)) return message;
		const senderSession = resolveForwardedSenderSession(message, resolveName);
		if (message.role === "assistant") {
			if (asOptionalRecord(message.senderSession)?.label === senderSession?.label) return message;
			changed = true;
			return {
				...message,
				senderSession,
				senderLabel: `Forwarded from ${senderSession?.label ?? senderSession?.agentId}`
			};
		}
		changed = true;
		const cronRun = isCronRunMessage(message);
		const prefix = normalizeInputProvenance(message.provenance)?.sourcePromptPrefix;
		const strip = cronRun ? (text) => prefix && text.startsWith(prefix) ? text.slice(prefix.length).replace(/^ /u, "") : text : stripInterSessionPromptPrefixForDisplay;
		const next = {
			...message,
			role: "assistant",
			...cronRun ? { __testclaw: {
				...asOptionalRecord(message["__testclaw"]),
				turnBoundary: true
			} } : {},
			senderLabel: senderSession?.label || senderSession?.agentId ? `Forwarded from ${senderSession.label ?? senderSession.agentId}` : "Forwarded agent message",
			...senderSession ? { senderSession } : {}
		};
		if ("content" in next) next.content = stripPromptPrefixFromContent(next.content, strip);
		if (typeof next.text === "string") next.text = strip(next.text);
		return next;
	});
	return changed ? projected : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.commentary.ts
function projectAssistantCommentaryFallbacks(message, maxChars) {
	if (!message || typeof message !== "object") return {
		fallbacks: [],
		message
	};
	const entry = asOptionalRecord(message);
	if (!entry || entry.role !== "assistant" || !Array.isArray(entry.content) || entry.stopReason === "error" || typeof entry.errorMessage === "string") return {
		fallbacks: [],
		message
	};
	const transcriptMeta = asOptionalRecord(entry["__testclaw"]);
	const commentaryBlocks = new Set(readAssistantTextBlocksForPhase(entry, "commentary"));
	const transcriptId = typeof transcriptMeta?.id === "string" ? transcriptMeta.id.trim() : typeof entry.id === "string" ? entry.id.trim() : void 0;
	const groups = [];
	const commentaryContent = /* @__PURE__ */ new Set();
	let projectedUnphasedText = false;
	let group;
	for (const block of entry.content) {
		const content = asOptionalRecord(block);
		if (!content) continue;
		if (!isAssistantTextContentType(content.type)) {
			if (group && [
				"image",
				"audio",
				"video",
				"attachment",
				"attachment_error"
			].includes(String(content.type))) {
				group.content.push(content);
				group.sourceBlocks.push(block);
			}
			continue;
		}
		const signature = parseAssistantTextSignature(content);
		const text = typeof content.text === "string" ? content.text : "";
		const providerItemId = signature?.id?.trim();
		const itemId = providerItemId || transcriptId;
		if (!commentaryBlocks.has(block) || !itemId) {
			group = void 0;
			continue;
		}
		if (group?.itemId !== itemId) {
			group = {
				itemId,
				providerKeyed: Boolean(providerItemId),
				content: [],
				text: [],
				sourceBlocks: []
			};
			groups.push(group);
		}
		group.providerKeyed ||= Boolean(providerItemId);
		if (signature?.phase !== "commentary") group.sourceBlocks.push(block);
		if (text.trim()) {
			group.content.push({
				type: "text",
				text
			});
			group.text.push(text);
		}
	}
	const fallbacks = groups.flatMap(({ itemId, providerKeyed, content, text, sourceBlocks }) => {
		const hasMedia = content.some((block) => block.type !== "text");
		if (content.length === 0 || !providerKeyed && !hasMedia) return [];
		for (const block of sourceBlocks) {
			commentaryContent.add(block);
			projectedUnphasedText ||= isAssistantTextContentType(asOptionalRecord(block)?.type);
		}
		const projected = truncateChatHistoryText(text.join("\n"), maxChars);
		const projectedMeta = projected.truncated ? {
			...transcriptMeta,
			truncated: true,
			reason: typeof transcriptMeta?.reason === "string" ? transcriptMeta.reason : "display-cap"
		} : transcriptMeta ? { ...transcriptMeta } : void 0;
		return [{
			role: "assistant",
			content,
			...typeof entry.timestamp === "number" ? { timestamp: entry.timestamp } : {},
			testclawStreamFallback: {
				replacementText: projected.text,
				source: "segment",
				itemId
			},
			...projectedMeta ? { __testclaw: projectedMeta } : {}
		}];
	});
	if (commentaryContent.size === 0) return {
		fallbacks,
		message
	};
	const remaining = {
		...entry,
		content: entry.content.filter((block) => !commentaryContent.has(block))
	};
	if (projectedUnphasedText && Array.isArray(remaining.content) && remaining.content.some((block) => isToolHistoryBlockType(asOptionalRecord(block)?.type))) {
		remaining.content = remaining.content.filter((block) => !commentaryBlocks.has(block));
		delete remaining.phase;
	}
	return {
		fallbacks,
		message: remaining
	};
}
//#endregion
//#region src/gateway/chat-display-projection.sanitize.ts
const MEDIA_PRIVATE_FIELDS = [
	"data",
	"blob",
	"path",
	"file",
	"filePath",
	"localPath"
];
const MEDIA_REFERENCE_FIELDS = [
	"url",
	"openUrl",
	"image_url",
	"audio_url",
	"video_url"
];
const MEDIA_FACT_PRIVATE_FIELDS = ["workspaceDir", ...MEDIA_PRIVATE_FIELDS.filter((field) => field !== "path")];
function projectChatHistoryMediaReference(value) {
	if (typeof value !== "string") return;
	const reference = value.trim();
	if (/^\/(?:api\/chat\/media\/outgoing|media|__testclaw__)\//u.test(reference)) return reference.split(/[?#]/u, 1)[0];
	try {
		if (/^media:/iu.test(reference)) return parseInboundMediaUri(reference)?.normalizedSource;
		const url = new URL(reference);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		url.username = url.password = url.search = url.hash = "";
		return url.toString();
	} catch {
		return;
	}
}
function projectChatHistoryMediaBlock(entry, fact = false) {
	if (!fact && (typeof entry.type !== "string" || !/^(?:image|audio|video)$/u.test(entry.type))) return false;
	const media = entry;
	const hasTopLevelPayload = typeof media.data === "string" || typeof media.blob === "string";
	const source = fact ? void 0 : asOptionalRecord(media.source);
	const projectedSource = source ? { ...source } : void 0;
	const records = [media, ...projectedSource ? [projectedSource] : []];
	if (projectedSource) media.source = projectedSource;
	const privateFields = fact ? MEDIA_FACT_PRIVATE_FIELDS : MEDIA_PRIVATE_FIELDS;
	const referenceFields = fact ? ["path", "url"] : MEDIA_REFERENCE_FIELDS;
	const sourceIsReference = !source && (!fact || typeof media.source !== "string" || /^(?:[a-z][a-z0-9+.-]*:|~?[\\/])|[\\/]/iu.test(media.source));
	let encodedPayload;
	for (const record of records) {
		let omitted = false;
		const payload = typeof record.data === "string" ? record.data : record.blob;
		if (encodedPayload === void 0 && typeof payload === "string") encodedPayload = payload;
		for (const field of privateFields) {
			if (!Object.hasOwn(record, field)) continue;
			delete record[field];
			omitted = true;
		}
		const recordReferences = record === media && sourceIsReference ? [...referenceFields, "source"] : referenceFields;
		for (const field of recordReferences) {
			if (!Object.hasOwn(record, field)) continue;
			const projected = (fact ? buildInboundMediaUriFromPath(String(record[field])) : void 0) ?? projectChatHistoryMediaReference(record[field]);
			record[field] = projected;
			if (projected === void 0) {
				delete record[field];
				omitted = true;
			}
		}
		if (!fact && omitted) {
			if (record === media || media.type !== "image") record.omitted = true;
			if (record === media || media.type !== "audio") media.omitted = true;
		}
	}
	if (!fact && encodedPayload !== void 0) (media.type === "audio" && !hasTopLevelPayload && projectedSource ? projectedSource : media).bytes = estimateBase64DecodedBytes(encodedPayload);
	return true;
}
function projectChatHistoryAttachmentBlock(entry) {
	if (entry.type !== "attachment") return false;
	const attachment = asOptionalRecord(entry.attachment);
	if (!attachment) return false;
	const projected = { ...attachment };
	for (const field of MEDIA_PRIVATE_FIELDS) delete projected[field];
	const url = projectChatHistoryMediaReference(projected.url);
	if (!url) delete projected.url;
	else projected.url = url;
	entry.attachment = projected;
	return true;
}
function projectChatHistoryMediaFacts(value) {
	return Array.isArray(value) ? value.map((fact) => {
		const projected = { ...asOptionalRecord(fact) };
		projectChatHistoryMediaBlock(projected, true);
		return projected;
	}) : void 0;
}
function sanitizeChatHistoryContentBlock(block, opts) {
	if (!block || typeof block !== "object") return {
		block,
		changed: false,
		truncated: false
	};
	const entry = { ...block };
	let changed = stripPrivateToolCallContextForDisplay(entry);
	let truncated = false;
	const preserveExactToolPayload = opts?.preserveExactToolPayload === true || isToolHistoryBlockType(entry.type);
	const maxChars = opts?.maxChars ?? 8e3;
	if (isToolResultHistoryBlockType(entry.type) && "details" in entry) {
		const projectedDetails = projectToolResultDetails(entry.details, maxChars);
		if (projectedDetails.details) entry.details = projectedDetails.details;
		else delete entry.details;
		changed = true;
		truncated ||= projectedDetails.truncated;
	}
	if (preserveExactToolPayload && Array.isArray(entry.content)) {
		const text = entry.content.flatMap((item) => {
			const value = asOptionalRecord(item)?.text;
			return typeof value === "string" ? [value] : [];
		}).join("\n");
		if (entry.text === text) {
			delete entry.text;
			changed = true;
		}
		const content = entry.content.map((item) => sanitizeChatHistoryContentBlock(item, {
			preserveExactToolPayload: true,
			maxChars
		}));
		if (content.some((item) => item.changed)) {
			entry.content = content.map((item) => item.block);
			changed = true;
		}
		truncated ||= content.some((item) => item.truncated);
	}
	for (const field of ["text", "content"]) {
		if (typeof entry[field] !== "string") continue;
		const res = truncateChatHistoryText(entry[field], maxChars, preserveExactToolPayload);
		entry[field] = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (typeof entry.partialJson === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.partialJson, maxChars);
		entry.partialJson = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (typeof entry.arguments === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.arguments, maxChars);
		entry.arguments = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (typeof entry.thinking === "string") {
		const res = truncateChatHistoryText(entry.thinking, maxChars);
		entry.thinking = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if ("thinkingSignature" in entry) {
		delete entry.thinkingSignature;
		changed = true;
	}
	if ("testclawReasoningReplay" in entry) {
		delete entry.testclawReasoningReplay;
		changed = true;
	}
	const mediaChanged = projectChatHistoryMediaBlock(entry);
	const attachmentChanged = projectChatHistoryAttachmentBlock(entry);
	changed ||= mediaChanged || attachmentChanged;
	return {
		block: changed ? entry : block,
		changed,
		truncated
	};
}
function sanitizeAssistantPhasedContentBlocks(content) {
	if (!content.some((block) => {
		if (!block || typeof block !== "object") return false;
		const entry = block;
		return isAssistantTextContentType(entry.type) && parseAssistantTextSignature(entry)?.phase;
	})) return {
		content,
		changed: false
	};
	const filtered = content.filter((block) => {
		if (!block || typeof block !== "object") return true;
		const entry = block;
		if (!isAssistantTextContentType(entry.type)) return true;
		return parseAssistantTextSignature(entry)?.phase === "final_answer";
	});
	return {
		content: filtered,
		changed: filtered.length !== content.length
	};
}
function projectAssistantMixedToolContent(content, maxChars) {
	if (!content.some((block) => {
		if (!block || typeof block !== "object") return false;
		return isToolHistoryBlockType(block.type);
	})) return null;
	let hasVisibleText = false;
	const projectedContent = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const entry = block;
		if (!isAssistantTextContentType(entry.type)) {
			projectedContent.push(block);
			continue;
		}
		if (parseAssistantTextSignature(entry)?.phase === "commentary") continue;
		if (typeof entry.text !== "string" || !entry.text.trim()) continue;
		const truncated = truncateChatHistoryText(entry.text, maxChars);
		if (truncated.text.trim()) {
			projectedContent.push({
				type: "text",
				text: truncated.text
			});
			hasVisibleText = true;
		}
	}
	return hasVisibleText ? {
		content: projectedContent,
		changed: true
	} : null;
}
const COST_FIELDS = [
	"input",
	"output",
	"cacheRead",
	"cacheWrite",
	"total"
];
const USAGE_FIELDS = [
	"input",
	"output",
	"total",
	"totalTokens",
	"inputTokens",
	"outputTokens",
	"promptTokens",
	"completionTokens",
	"cacheRead",
	"cacheWrite",
	"cache_read_input_tokens",
	"cache_creation_input_tokens",
	"input_tokens",
	"output_tokens",
	"prompt_tokens",
	"completion_tokens",
	"total_tokens"
];
function sanitizeNumericMetadata(raw, fields) {
	if (!raw || typeof raw !== "object") return;
	const record = raw;
	const projected = {};
	for (const key of fields) {
		const value = asFiniteNumber(record[key]);
		if (value !== void 0) projected[key] = value;
	}
	if (fields === USAGE_FIELDS && "cost" in record && record.cost != null && typeof record.cost === "object") {
		const cost = sanitizeNumericMetadata(record.cost, COST_FIELDS);
		if (cost) projected.cost = cost;
	}
	return Object.keys(projected).length > 0 ? projected : void 0;
}
function projectWorkspaceConflictDetails(entry) {
	if (entry.role !== "custom" || entry.customType !== "cloud-workspace-conflict") return;
	const details = asOptionalRecord(entry.details);
	if (!details || !Array.isArray(details.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || !/^refs\/testclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef) || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length)) return;
	try {
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	} catch {
		return;
	}
}
function sanitizeChatHistoryMessage(message, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS) {
	if (!message || typeof message !== "object") return {
		message,
		changed: false
	};
	const entry = { ...message };
	let changed = false;
	let truncated = false;
	if ("providerReplay" in entry) {
		delete entry.providerReplay;
		changed = true;
	}
	const testClawMeta = asOptionalRecord(entry["__testclaw"]);
	if (testClawMeta && ("upstreamUserText" in testClawMeta || "media" in testClawMeta)) {
		const projectedMeta = { ...testClawMeta };
		delete projectedMeta.upstreamUserText;
		if ("media" in projectedMeta) {
			projectedMeta.media = projectChatHistoryMediaFacts(projectedMeta.media);
			if (projectedMeta.media === void 0) delete projectedMeta.media;
		}
		if (Object.keys(projectedMeta).length > 0) entry["__testclaw"] = projectedMeta;
		else delete entry["__testclaw"];
		changed = true;
	}
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	const managedMedia = takeAssistantManagedMediaUrlsForDisplay(entry, role);
	changed ||= managedMedia.changed;
	const preserveExactToolPayload = role === "toolresult" || role === "tool_result" || role === "tool" || role === "function" || typeof entry.toolName === "string" || typeof entry.tool_name === "string" || typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string";
	if ("details" in entry) {
		const conflictDetails = projectWorkspaceConflictDetails(entry);
		const toolResultDetails = !conflictDetails && messageHasToolResultShape(entry) ? projectToolResultDetails(entry.details, maxChars) : void 0;
		const projectedDetails = conflictDetails ?? toolResultDetails?.details;
		if (projectedDetails) entry.details = projectedDetails;
		else delete entry.details;
		changed = true;
		truncated ||= toolResultDetails?.truncated === true;
	}
	if (entry.role !== "assistant") {
		if ("usage" in entry) {
			delete entry.usage;
			changed = true;
		}
		if ("cost" in entry) {
			delete entry.cost;
			changed = true;
		}
	} else {
		if ("usage" in entry) {
			const sanitized = sanitizeNumericMetadata(entry.usage, USAGE_FIELDS);
			if (sanitized) entry.usage = sanitized;
			else delete entry.usage;
			changed = true;
		}
		if ("cost" in entry) {
			const sanitized = sanitizeNumericMetadata(entry.cost, COST_FIELDS);
			if (sanitized) entry.cost = sanitized;
			else delete entry.cost;
			changed = true;
		}
	}
	const stripAssistantControlTokens = role === "assistant" && !shouldPreserveAssistantControlReplyText(entry);
	if (typeof entry.content === "string") {
		const controlStripped = stripAssistantControlTokens ? stripAssistantMediaDirectivesForDisplay(stripSuppressedControlReplyToken(entry.content), managedMedia.urls) : entry.content;
		changed ||= controlStripped !== entry.content;
		const res = truncateChatHistoryText(controlStripped, maxChars, preserveExactToolPayload);
		entry.content = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	} else if (Array.isArray(entry.content)) {
		const content = entry.content;
		const commentary = asOptionalRecord(entry.testclawStreamFallback)?.source === "segment";
		let remainingText = maxChars;
		let updated;
		for (let index = 0; index < content.length; index++) {
			const rawBlock = commentary ? asOptionalRecord(content[index]) : void 0;
			const rawText = rawBlock && isAssistantTextContentType(rawBlock.type) && typeof rawBlock.text === "string" ? rawBlock.text : void 0;
			if (rawText !== void 0 && remainingText <= 0) {
				updated ??= content.slice();
				updated[index] = void 0;
				truncated ||= rawText.length > 0;
				continue;
			}
			const sanitized = sanitizeChatHistoryContentBlock(content[index], {
				preserveExactToolPayload,
				maxChars: rawText === void 0 ? maxChars : remainingText
			});
			if (rawText !== void 0) remainingText -= rawText.length + 1;
			const contentBlock = stripAssistantControlTokens ? asOptionalRecord(sanitized.block) : void 0;
			if (contentBlock && isAssistantTextContentType(contentBlock.type) && typeof contentBlock.text === "string") {
				const text = stripAssistantMediaDirectivesForDisplay(stripSuppressedControlReplyToken(contentBlock.text), managedMedia.urls);
				if (text !== contentBlock.text) {
					sanitized.block = {
						...contentBlock,
						text
					};
					sanitized.changed = true;
				}
			}
			if (sanitized.changed) {
				updated ??= content.slice();
				updated[index] = sanitized.block;
			}
			truncated ||= sanitized.truncated;
		}
		if (updated) {
			entry.content = commentary ? updated.filter((block) => block !== void 0) : updated;
			changed = true;
		}
		if (entry.role === "assistant" && Array.isArray(entry.content)) {
			const mixedToolContent = projectAssistantMixedToolContent(entry.content, maxChars);
			if (mixedToolContent) {
				entry.content = mixedToolContent.content;
				if (entry.phase === "commentary") delete entry.phase;
				changed = true;
			} else {
				const sanitizedPhases = sanitizeAssistantPhasedContentBlocks(entry.content);
				if (sanitizedPhases.changed) {
					entry.content = sanitizedPhases.content;
					changed = true;
				}
			}
		}
	}
	if (typeof entry.text === "string") {
		const controlStripped = stripAssistantControlTokens ? stripAssistantMediaDirectivesForDisplay(stripSuppressedControlReplyToken(entry.text), managedMedia.urls) : entry.text;
		changed ||= controlStripped !== entry.text;
		const res = truncateChatHistoryText(controlStripped, maxChars, preserveExactToolPayload);
		entry.text = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (truncated) {
		const meta = asOptionalRecord(entry["__testclaw"]);
		entry["__testclaw"] = {
			...meta,
			truncated: true,
			reason: typeof meta?.reason === "string" ? meta.reason : "display-cap"
		};
		changed = true;
	}
	return {
		message: changed ? entry : message,
		changed
	};
}
function hasAssistantMixedToolVisibleText(message) {
	if (!message || typeof message !== "object") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	let hasToolHistoryBlock = false;
	let hasText = false;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const entry = block;
		if (isToolHistoryBlockType(entry.type)) hasToolHistoryBlock = true;
		if (isAssistantTextContentType(entry.type) && typeof entry.text === "string" && entry.text.trim()) hasText = true;
	}
	return hasToolHistoryBlock && hasText;
}
function shouldDropAssistantHistoryMessage(message) {
	if (!message || typeof message !== "object") return false;
	const entry = message;
	if (entry.role !== "assistant") return false;
	if (isProjectedForwardedMessage(entry)) return false;
	if (resolveAssistantMessagePhase(message) === "commentary") return !hasAssistantMixedToolVisibleText(message);
	const text = extractAssistantTextForSilentCheck(message);
	if (text === void 0 || !isSuppressedControlReplyText(text)) return false;
	return !hasAssistantDisplayableNonTextContent(message);
}
function sanitizeChatHistoryMessages(messages, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, opts) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = [];
	for (const original of messages) {
		let message = original;
		if (opts?.includeCommentaryFallbacks === true) {
			const projection = projectAssistantCommentaryFallbacks(message, maxChars);
			message = projection.message;
			changed ||= message !== original;
			for (const commentary of projection.fallbacks) {
				changed = true;
				const hasMediaFacts = hasTranscriptMediaFacts(asOptionalRecord(commentary) ?? {});
				if (!hasMediaFacts && shouldDropAssistantHistoryMessage(commentary)) continue;
				const projected = sanitizeChatHistoryMessage(commentary, maxChars);
				if (hasMediaFacts || !shouldDropAssistantHistoryMessage(projected.message)) next.push(projected.message);
			}
		}
		if (shouldDropAssistantHistoryMessage(message)) {
			changed = true;
			continue;
		}
		const res = sanitizeChatHistoryMessage(message, maxChars);
		changed ||= res.changed;
		if (res.changed && shouldDropAssistantHistoryMessage(res.message)) {
			changed = true;
			continue;
		}
		next.push(res.message);
	}
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.core.ts
/** Keep profile display reads local to one history page or event projection operation. */
function createCurrentUserProfileMessageProjector(resolveDisplay) {
	const displayBySenderId = /* @__PURE__ */ new Map();
	return (message) => {
		if (message.role !== "user") return message;
		const metadata = asOptionalRecord(message["__testclaw"]);
		if (!metadata) return message;
		const identity = readTranscriptSenderIdentity(metadata.senderIdentity);
		if (identity?.type !== "profile") return message;
		const senderId = identity.id;
		let display = displayBySenderId.get(senderId);
		if (!display) {
			display = resolveDisplay(senderId);
			displayBySenderId.set(senderId, display);
		}
		if (display.kind === "unresolved") return message;
		if (metadata.senderProfileAvatarUrl === display.avatarUrl && identity.id === display.profileId) return message;
		return {
			...message,
			__testclaw: {
				...metadata,
				senderIdentity: {
					type: "profile",
					id: display.profileId
				},
				senderProfileAvatarUrl: display.avatarUrl
			}
		};
	};
}
function projectCurrentUserProfileAvatars(messages, resolveDisplay) {
	if (!resolveDisplay) return messages;
	const project = createCurrentUserProfileMessageProjector(resolveDisplay);
	let changed = false;
	const projected = messages.map((message) => {
		const row = project(message);
		changed ||= row !== message;
		return row;
	});
	return changed ? projected : messages;
}
function getAssistantErrorFallbackText(message) {
	return formatProviderRefusalText(message) ?? renderAssistantRequestFailureCopy({
		storageFailure: classifyGatewayStorageFailure(message),
		code: typeof message.errorCode === "string" ? message.errorCode : void 0
	}) ?? renderRecordedAssistantFailureCopy(message) ?? "The agent run failed before producing a reply.";
}
function sanitizeAssistantErrorDisplayMessage(message) {
	const { content, ...envelope } = message;
	let next = sanitizeChatHistoryMessage(envelope, Number.MAX_SAFE_INTEGER).message;
	if (Array.isArray(content)) {
		let firstTextBlock = true;
		next.content = content.flatMap((block) => {
			const sanitized = sanitizeChatHistoryContentBlock(block, { maxChars: Number.MAX_SAFE_INTEGER }).block;
			if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) return [sanitized];
			const entry = sanitized;
			if (isAssistantInternalReasoningContentType(entry.type)) return [];
			if (!firstTextBlock || !isAssistantTextContentType(entry.type)) return [sanitized];
			firstTextBlock = false;
			if (typeof entry.text !== "string" || !entry.text.startsWith(STREAM_ERROR_FALLBACK_TEXT)) return [sanitized];
			const replyText = entry.text.slice(STREAM_ERROR_FALLBACK_TEXT.length);
			return replyText ? [{
				...entry,
				text: replyText
			}] : [];
		});
	} else next.content = typeof content === "string" && content.startsWith(STREAM_ERROR_FALLBACK_TEXT) ? content.slice(STREAM_ERROR_FALLBACK_TEXT.length) : content;
	if (typeof next.text === "string" && next.text.startsWith(STREAM_ERROR_FALLBACK_TEXT)) next.text = next.text.slice(STREAM_ERROR_FALLBACK_TEXT.length);
	if (renderAssistantRequestFailureCopy({ code: typeof message.errorCode === "string" ? message.errorCode : void 0 }) ?? renderRecordedAssistantFailureCopy(message)) {
		next = sanitizeChatHistoryMessage(next, Number.MAX_SAFE_INTEGER).message;
		if (shouldDropAssistantHistoryMessage(next)) {
			next.content = [];
			delete next.text;
			delete next.phase;
		}
		const displayContent = Array.isArray(next.content) ? [...next.content] : typeof next.content === "string" ? [{
			type: "text",
			text: next.content
		}] : [];
		const prependText = (text) => {
			const alreadyPresent = displayContent.some((block) => {
				const entry = asOptionalRecord(block);
				return entry && isAssistantTextContentType(entry.type) && typeof entry.text === "string" && entry.text.includes(text);
			});
			if (!text || alreadyPresent) return;
			const textIndex = displayContent.findIndex((block) => {
				const entry = asOptionalRecord(block);
				return entry && isAssistantTextContentType(entry.type) && typeof entry.text === "string";
			});
			const previous = textIndex >= 0 ? asOptionalRecord(displayContent[textIndex]) : void 0;
			if (previous) displayContent[textIndex] = {
				...previous,
				text: [text, previous.text].filter(Boolean).join("\n\n")
			};
			else displayContent.push({
				type: "text",
				text
			});
		};
		if (typeof next.text === "string") prependText(next.text);
		prependText(getAssistantErrorFallbackText(message));
		next.content = displayContent;
		delete next.text;
	}
	delete next.diagnostics;
	delete next.errorBody;
	delete next.errorCode;
	delete next.errorMessage;
	delete next.errorType;
	return next;
}
function isPureStreamErrorFallbackAssistantMessage(message) {
	if (message.role !== "assistant" || message.stopReason !== "error") return false;
	const text = extractAssistantTextForSilentCheck(message);
	return text !== void 0 && text.trim() === STREAM_ERROR_FALLBACK_TEXT && !hasAssistantNonTextContent(message) && !hasTranscriptMediaFacts(message);
}
function hasVisibleAssistantDisplayContent(message) {
	if (message.role !== "assistant" || message.display === false || isPureStreamErrorFallbackAssistantMessage(message)) return false;
	const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
	if (shouldDropAssistantHistoryMessage(sanitized)) return false;
	if (hasAssistantDisplayableNonTextContent(sanitized) || hasTranscriptMediaFacts(sanitized)) return true;
	return hasVisibleAssistantReplyText(sanitized);
}
function hasVisibleAssistantReplyText(message) {
	return [...Array.isArray(message.content) ? message.content.flatMap((block) => {
		const entry = asOptionalRecord(block);
		return isAssistantTextContentType(entry?.type) ? [entry?.text] : [];
	}) : [message.content], message.text].some((text) => {
		if (typeof text !== "string") return false;
		const visible = text.trim();
		return visible.length > 0 && visible !== STREAM_ERROR_FALLBACK_TEXT && !isSuppressedControlReplyText(visible);
	});
}
function isPendingAssistantError(value) {
	const message = asOptionalRecord(value);
	return message?.role === "assistant" && message.display !== false && message.stopReason === "error" && (isPureStreamErrorFallbackAssistantMessage(message) || Boolean(readSessionTranscriptRunId(message)) && !hasAssistantDisplayableNonTextContent(message) && !hasVisibleAssistantDisplayContent(message));
}
function createRecoveredAssistantErrorProjection(initialPending = false) {
	const messages = [];
	let unseenPending = initialPending;
	let recoveryObserved = false;
	let pendingIndexes = [];
	const repairedIndexes = /* @__PURE__ */ new Set();
	return {
		append(message) {
			const index = messages.length;
			messages.push(message);
			if (message.role === "user") {
				unseenPending = false;
				pendingIndexes = [];
				return;
			}
			if (isPendingAssistantError(message)) {
				pendingIndexes.push(index);
				return;
			}
			if (!unseenPending && pendingIndexes.length === 0 || !hasVisibleAssistantDisplayContent(message)) return;
			recoveryObserved ||= unseenPending;
			unseenPending = false;
			const completedRunId = (message.stopReason === "stop" || message.stopReason === "length") && !isTranscriptOnlyAssistantAssistantMessage(message) ? readSessionTranscriptRunId(message) : void 0;
			pendingIndexes = pendingIndexes.filter((pendingIndex) => {
				const failedRunId = readSessionTranscriptRunId(messages[pendingIndex]);
				if (failedRunId && failedRunId !== completedRunId) return true;
				repairedIndexes.add(pendingIndex);
				recoveryObserved = true;
				return false;
			});
		},
		get pending() {
			return unseenPending || pendingIndexes.length > 0;
		},
		result() {
			return {
				messages: repairedIndexes.size > 0 ? messages.filter((_, index) => !repairedIndexes.has(index)) : messages.slice(),
				pending: unseenPending || pendingIndexes.length > 0,
				recoveryObserved
			};
		}
	};
}
function projectEmptyAssistantErrorMessages(messages) {
	let changed = false;
	const projected = messages.map((message) => {
		if (message.role !== "assistant" || message.stopReason !== "error") return message;
		if (hasAssistantDisplayableNonTextContent(message) || hasTranscriptMediaFacts(message)) {
			changed = true;
			return sanitizeAssistantErrorDisplayMessage(message);
		}
		const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
		if (!shouldDropAssistantHistoryMessage(sanitized) && hasVisibleAssistantReplyText(sanitized)) {
			changed = true;
			return sanitizeAssistantErrorDisplayMessage(message);
		}
		changed = true;
		const next = {
			...sanitized,
			content: [{
				type: "text",
				text: getAssistantErrorFallbackText(message)
			}]
		};
		delete next.diagnostics;
		delete next.errorBody;
		delete next.errorCode;
		delete next.errorMessage;
		delete next.errorType;
		delete next.phase;
		delete next.text;
		return next;
	});
	return changed ? projected : messages;
}
function prepareChatHistoryRecoveryMessages(messages, options) {
	const projectedMessages = messages.map((original) => {
		const message = projectTranscriptImageArtifacts(original);
		const entry = asOptionalRecord(message);
		if (entry?.role === "custom" && entry.customType === "run-failed-before-reply") {
			const runId = normalizeOptionalString(asOptionalRecord(entry.details)?.runId);
			if (runId) return {
				...entry,
				__testclaw: {
					...asOptionalRecord(entry["__testclaw"]),
					runId
				}
			};
		}
		const activity = readNestedToolActivity(message);
		if (!activity) return message;
		const [call, result] = nestedToolActivityContent(activity);
		const sanitized = sanitizeChatHistoryMessage({
			...result,
			role: "toolResult"
		}, options?.maxChars ?? 8e3).message;
		return {
			...asOptionalRecord(message),
			runId: activity.details.runId,
			__testclaw: {
				...asOptionalRecord(asOptionalRecord(message)?.["__testclaw"]),
				runId: activity.details.runId
			},
			content: [call, sanitized]
		};
	});
	return options?.stripEnvelope === false ? projectedMessages : stripEnvelopeFromMessages(projectedMessages);
}
function createChatHistoryRecoveryProjection(options) {
	const projectCoordination = createSubagentCoordinationHistoryProjection(options?.subagentCoordination);
	const recovery = createRecoveredAssistantErrorProjection(options?.assistantErrorPending);
	return {
		append(messages) {
			const projected = projectCoordination(prepareChatHistoryRecoveryMessages(messages, options));
			for (const message of toProjectedMessages(projected)) if (!isAssistantMessageToolMirrorAssistantMessage(message)) recovery.append(message);
		},
		get pending() {
			return recovery.pending;
		},
		result() {
			return recovery.result();
		}
	};
}
function projectChatHistoryRecovery(messages, options) {
	const projection = createChatHistoryRecoveryProjection(options);
	projection.append(messages);
	return projection.result();
}
function projectChatDisplayMessagesWithState(messages, options) {
	options?.subagentCoordination?.assertCurrent?.();
	const recoveredErrors = projectChatHistoryRecovery(messages, options);
	const projectedErrors = projectEmptyAssistantErrorMessages(recoveredErrors.messages);
	const activity = options?.activity === false ? [] : projectAgentHistoryActivity(messages.flatMap((message) => {
		const messageId = asOptionalRecord(asOptionalRecord(message)?.["__testclaw"])?.id;
		return typeof messageId === "string" ? [{
			messageId,
			message
		}] : [];
	}));
	const sanitizedMessages = toProjectedMessages(sanitizeChatHistoryMessages(projectedErrors, Number.MAX_SAFE_INTEGER, { includeCommentaryFallbacks: options?.includeCommentaryFallbacks }));
	const commentaryFallbacksObserved = options?.includeCommentaryFallbacks === true && sanitizedMessages.some((message) => asOptionalRecord(message.testclawStreamFallback)?.source === "segment");
	const filtered = filterVisibleProjectedHistoryMessages(projectForwardedMessages(sanitizedMessages, options?.resolveCronJobName), options?.turnBoundaryPending);
	const result = {
		activity,
		messages: projectCurrentUserProfileAvatars(sanitizeChatHistoryMessages(mergeTtsSupplementMessages(filtered.messages), options?.maxChars ?? 8e3), options?.resolveCurrentUserProfileDisplay),
		turnBoundaryPending: filtered.turnBoundaryPending,
		assistantErrorPending: recoveredErrors.pending,
		assistantErrorRecoveryObserved: recoveredErrors.recoveryObserved
	};
	if (commentaryFallbacksObserved) result.commentaryFallbacksObserved = true;
	options?.subagentCoordination?.assertCurrent?.();
	return result;
}
function projectChatDisplayMessages(messages, options) {
	return projectChatDisplayMessagesWithState(messages, {
		...options,
		activity: false
	}).messages;
}
function projectChatDisplayMessage(message, options) {
	return projectChatDisplayMessages([message], options)[0];
}
//#endregion
export { projectChatDisplayMessages as a, createPreSessionStartAnnouncePairFilter as c, isAssistantTtsSupplementMessage as d, isHeartbeatHistoryTurnBoundaryMessage as f, projectChatDisplayMessage as i, createSubagentCoordinationHistoryProjection as l, projectForwardedMessages as m, createCurrentUserProfileMessageProjector as n, projectChatDisplayMessagesWithState as o, isSubagentCoordinationHistoryInput as p, isPendingAssistantError as r, sanitizeChatHistoryMessages as s, createChatHistoryRecoveryProjection as t, dropPreSessionStartAnnouncePairs as u };
