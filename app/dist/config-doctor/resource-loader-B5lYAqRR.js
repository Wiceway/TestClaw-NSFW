import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { O as resolveIntegerOption } from "./number-coercion-0M4tZV2c.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { S as isPlainObject } from "./utils-BfoJTy8l.js";
import { r as registerResolvedAgentDir } from "./agent-dir-registry-DyxBacoA.js";
import { a as isSensitiveFieldKey, h as redactSensitiveFieldValueWithConfig, o as prepareModelVisibleToolTextBlock, x as redactToolPayloadTextWithConfig, y as redactToolDetail } from "./redact-myZeUWr_.js";
import { c as copyCodeModeSourceAppendOptions, f as withCodeModeSourceAppend, n as resolveTranscriptLoggingConfig, s as copyCodeModeSourceAppend, t as redactTranscriptMessage, u as prepareCodeModeSourceAppend } from "./transcript-redact-C2CfuzTs.js";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-CvUcH_7-.js";
import "./tool-policy-BFaYCu9H.js";
import { a as projectModelThinkingCompat } from "./model-catalog-lookup-_Hi_clcB.js";
import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { s as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DSYwY5Fq.js";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-CriGFpOg.js";
import { b as publishTranscriptUpdate } from "./session-accessor.sqlite-generation-copy-DcJmL4R4.js";
import { a as getCodeModeExecBeforeHookMetadata, r as copyCodeModeControlToolIdentity, u as normalizeCodeModeExecBeforeHookParams } from "./code-mode-control-tools--dZmMBiE.js";
import { i as jsonUtf8BytesOrInfinity, n as firstEnumerableOwnKeys, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.js";
import { c as isTranscriptOnlyAssistantAssistantModel } from "./transcript-only-testclaw-assistant-DMb_WNdn.js";
import { f as withSessionMetadataPublication, p as withSessionTranscriptWriteAssertion, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-CW-keGmb.js";
import "./session-accessor-DMf92PxK.js";
import { a as createSessionEntryWithTranscript } from "./session-accessor.reset-Cl1Mir1u.js";
import { u as convertToLlm } from "./session-BKH3neS_.js";
import { o as applyInputProvenanceToUserMessage } from "./input-provenance-DGaz_sh7.js";
import { c as recordStructuredReplayTrustForToolCall, h as readInternalExecutionControl, i as isBeforeToolCallBlockedError, m as createInternalExecutionPreparer, n as finalizeBeforeToolCallExecutionParams, o as prepareBeforeToolCallExecutionParams, s as recordAdjustedParamsForToolCall, t as buildBlockedToolResult, v as consumeFinalClientVoiceToolConfirmation, y as runBeforeToolCallHook } from "./agent-tools.before-tool-call-BwZqazXs.js";
import { u as resolveThinkingDefaultForModel } from "./thinking-0TzFLcYt.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-B45lHO9j.js";
import { n as logError, t as logDebug } from "./logger-DgjIIHeT.js";
import { a as attachInternalToolExecutionPreparer, h as setInternalBeforeToolBatch, p as getInternalToolExecutionPreparer, t as acknowledgeInternalToolResult } from "./internal-hooks-A8m3oGkR.js";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.js";
import { i as AuthStorage, n as getModelRegistryRuntime, t as ModelRegistry } from "./model-registry-UE0EOYQn.js";
import { n as getAgentDirResolution } from "./config-Uq6HcsCP.js";
import { B as formatNoModelsAvailableMessage, D as findInitialModel, G as sanitizeCompactionReplayMessages, H as takeRuntimeUserTurnTranscriptContext, M as DEFAULT_THINKING_LEVEL, U as takeRuntimeUserTurnTranscriptRecorder, V as attachRuntimeUserTurnTranscriptRecorder, W as withRuntimeUserTurnTranscriptRecorder, _ as setSessionToolTextPreparer, ft as Agent, n as AgentSession, t as DefaultResourceLoader, w as SettingsManager } from "./resource-loader-BhZb0-S1.js";
import { n as bindStreamLlmRuntime } from "./model-runtime-binding-Dcvog-Jx.js";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.js";
import { h as isToolWrappedWithBeforeToolCallHook } from "./agent-tool-metadata-DkPGvtCv.js";
import { s as restorePreparedUserTurnOperationalMetaForRuntime } from "./user-turn-transcript.metadata-BAAmUJGD.js";
import { i as payloadTextResult } from "./common-Bkl7CqHm.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-DagGnkHf.js";
import { i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-Lx_h0EBk.js";
import { a as rewriteToolResultIds, n as extractToolResultId, t as extractToolCallsFromAssistant } from "./tool-call-id-DDGKoPAb.js";
import { r as sanitizeToolCallInputs, t as makeMissingToolResult } from "./session-transcript-repair-BNL2e-6A.js";
import { C as formatContextLimitTruncationNotice, d as truncateToolResultMessage } from "./tool-result-truncation-BJlekSxn.js";
import { n as getRawSessionAppendMessage, r as setRawSessionAppendMessage } from "./transcript-rewrite-D47uvetI.js";
import { n as SessionMetadataCommittedError, r as withSessionCompactionPersistence, t as SessionManager } from "./session-manager-B9vSB5Dk.js";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-BvxhBa55.js";
import { o as mergePreparedUserTurnMessageForRuntime } from "./user-turn-transcript.message-W5Lni2jm.js";
import "./user-turn-transcript-9nytJfWI.js";
import "./messages-DfCykjPA.js";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-C5tWDpxt.js";
import { a as readToolOperatorHint } from "./core-coding-tools-BdnK9ZeF.js";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { clampThinkingLevel } from "@testclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-runner/run/midturn-precheck.ts
/** Stable message used to identify synthetic mid-turn overflow errors in session cleanup. */
const MID_TURN_PRECHECK_ERROR_MESSAGE = "Context overflow: prompt too large for the model (mid-turn precheck).";
/**
* Internal control-flow signal thrown after a tool result makes the next prompt
* exceed budget. The attempt runner catches it and routes through the overflow
* recovery path instead of treating it as an ordinary provider failure.
*/
var MidTurnPrecheckSignal = class extends Error {
	constructor(request) {
		super(MID_TURN_PRECHECK_ERROR_MESSAGE);
		this.name = "MidTurnPrecheckSignal";
		this.request = request;
	}
};
/** Narrows unknown errors to the mid-turn overflow signal used by attempt cleanup. */
function isMidTurnPrecheckSignal(error) {
	return error instanceof MidTurnPrecheckSignal;
}
/** This local routing signal is not a provider response or durable conversation item. */
function isMidTurnPrecheckAssistantError(message) {
	return message?.role === "assistant" && message.stopReason === "error" && message.errorMessage === MID_TURN_PRECHECK_ERROR_MESSAGE;
}
//#endregion
//#region src/agents/session-tool-result-guard.payload.ts
/**
* Truncate oversized text content blocks in a tool result message.
* Returns the original message if under the limit, or a new message with
* truncated text blocks otherwise.
*/
function capToolResultSize(msg, maxChars) {
	if (msg.role !== "toolResult") return msg;
	return truncateToolResultMessage(msg, maxChars, {
		suffix: (truncatedChars) => formatContextLimitTruncationNotice(truncatedChars),
		minKeepChars: 2e3
	});
}
function resolveMaxToolResultChars(opts) {
	return resolveIntegerOption(opts?.maxToolResultChars, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, { min: 1 });
}
const MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES = 8192;
const MAX_PERSISTED_DETAIL_STRING_CHARS = 2e3;
const MAX_PERSISTED_DETAIL_SESSION_COUNT = 10;
const MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS = 200;
const MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS = 1024;
const MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS = 512;
const PERSISTED_DETAIL_REDACTION_BOUNDARY = "\0TESTCLAW_PERSISTED_DETAIL_BOUNDARY\0";
const PARTIAL_STRUCTURED_SECRET_VALUE_RE = /(?:["']?(?:api[-_]?key|apikey|token|secret|password|passwd|access[-_]?token|accesstoken|refresh[-_]?token|refreshtoken|auth[-_]?token|authtoken|client[-_]?secret|clientsecret|app[-_]?secret|appsecret|card[-_]?number|cardnumber|cvc|cvv)["']?\s*[:=]\s*["']?)(?!\*{3})(?=[^\s"',}\]]{8,})/i;
const PARTIAL_PRIVATE_KEY_BLOCK_RE = /-----BEGIN [A-Z0-9 ]*(?:PRIVATE KEY|OPENSSH PRIVATE KEY|RSA PRIVATE KEY|EC PRIVATE KEY|DSA PRIVATE KEY)-----/i;
function originalDetailsSizeFields(size) {
	return size.complete ? { originalDetailsBytes: size.bytes } : { originalDetailsBytesAtLeast: size.bytes };
}
function redactPersistedDetailString(value, maxChars = MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig) {
	if (value.length <= maxChars) return redactToolPayloadTextWithConfig(value, redactionConfig);
	const scan = `${sliceUtf16Safe(value, 0, maxChars)}${PERSISTED_DETAIL_REDACTION_BOUNDARY}${sliceUtf16Safe(value, maxChars, maxChars + MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS)}`;
	const redactedScan = redactToolPayloadTextWithConfig(scan, redactionConfig);
	const boundaryIndex = redactedScan.indexOf(PERSISTED_DETAIL_REDACTION_BOUNDARY);
	const redactedPrefix = boundaryIndex >= 0 ? redactedScan.slice(0, boundaryIndex) : "[Assistant persisted detail redacted: boundary marker removed]";
	const safePrefixChars = Math.max(0, maxChars - Math.min(maxChars, MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS));
	const initialPersistedPrefix = truncateUtf16Safe(redactedPrefix, safePrefixChars);
	const persistedPrefix = PARTIAL_STRUCTURED_SECRET_VALUE_RE.test(initialPersistedPrefix) || PARTIAL_PRIVATE_KEY_BLOCK_RE.test(initialPersistedPrefix) ? "[Assistant persisted detail redacted: partial secret span omitted]" : initialPersistedPrefix;
	return `${persistedPrefix}${persistedPrefix ? "\n" : ""}[Assistant persisted detail redacted: boundary overlap omitted]\n\n[Assistant persisted detail truncated: ${Math.max(0, value.length - maxChars)} original chars omitted]`;
}
function selectPersistedDetailRedactionKey(key, inheritedKey) {
	return isSensitiveFieldKey(key) ? key : inheritedKey;
}
function redactedOriginalDetailKeys(src, redactionConfig) {
	return firstEnumerableOwnKeys(src, 40).map((key) => redactToolPayloadTextWithConfig(key, redactionConfig));
}
function redactPersistedDetailValue(value, depth = 0, redactionKey, redactionConfig) {
	if (typeof value === "string") return redactionKey ? redactSensitiveFieldValueWithConfig(redactionKey, value, redactionConfig) : redactToolPayloadTextWithConfig(value, redactionConfig);
	if (redactionKey && (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")) return redactSensitiveFieldValueWithConfig(redactionKey, String(value), redactionConfig);
	const source = asOptionalObjectRecord(value);
	if (!source) return value;
	if (depth >= 8) return "[Assistant persisted detail redacted: max depth exceeded]";
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const redacted = redactPersistedDetailValue(item, depth + 1, redactionKey, redactionConfig);
			changed ||= redacted !== item;
			return redacted;
		});
		return changed ? next : value;
	}
	let changed = false;
	const next = {};
	for (const [key, field] of Object.entries(source)) {
		const redactedKey = redactToolPayloadTextWithConfig(key, redactionConfig);
		const redacted = redactPersistedDetailValue(field, depth + 1, selectPersistedDetailRedactionKey(key, redactionKey), redactionConfig);
		changed ||= redactedKey !== key || redacted !== field;
		next[redactedKey] = redacted;
	}
	return changed ? next : value;
}
function redactPersistedSummaryField(key, value, maxStringChars, redactionConfig) {
	if (typeof value === "string") return redactPersistedDetailString(value, maxStringChars, redactionConfig);
	return redactPersistedDetailValue(value, 0, selectPersistedDetailRedactionKey(key, void 0), redactionConfig);
}
function copyPersistedSummaryFields(params) {
	for (const key of params.keys) {
		const value = params.source[key];
		if (value !== void 0) params.target[key] = redactPersistedSummaryField(key, value, params.maxChars, params.redactionConfig);
	}
}
function sanitizePersistedSessionDetail(value, redactionConfig) {
	const src = asOptionalObjectRecord(value);
	if (!src) return value;
	const out = {};
	copyPersistedSummaryFields({
		target: out,
		source: src,
		keys: [
			"sessionId",
			"status",
			"pid",
			"startedAt",
			"endedAt",
			"runtimeMs",
			"cwd",
			"name",
			"truncated",
			"exitCode",
			"exitSignal"
		],
		maxChars: 500,
		redactionConfig
	});
	if (typeof src.command === "string") out.command = redactPersistedDetailString(src.command, 500, redactionConfig);
	return out;
}
function copyPersistedResultStateFields(out, src, maxStringChars, redactionConfig) {
	for (const key of [
		"disabled",
		"unavailable",
		"success"
	]) if (typeof src[key] === "boolean") out[key] = src[key];
	if (typeof src.error === "string" && src.error) out.error = redactPersistedDetailString(src.error, maxStringChars, redactionConfig);
	else if (src.error) out.error = true;
}
function buildPersistedDetailsFallback(src, originalSize, sanitizedBytes, redactionConfig) {
	const fallback = {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize)
	};
	if (sanitizedBytes !== void 0) fallback.sanitizedDetailsBytes = sanitizedBytes;
	if (src) {
		fallback.originalDetailKeys = redactedOriginalDetailKeys(src, redactionConfig);
		copyPersistedSummaryFields({
			target: fallback,
			source: src,
			keys: [
				"status",
				"sessionId",
				"pid",
				"exitCode",
				"exitSignal",
				"truncated",
				"spill",
				"fullOutputPath",
				"spilledChars",
				"spillTruncated"
			],
			maxChars: MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS,
			redactionConfig
		});
		copyPersistedResultStateFields(fallback, src, MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS, redactionConfig);
	}
	return fallback;
}
function enforcePersistedDetailsByteCap(value, originalDetails, originalSize, redactionConfig) {
	const sanitizedBytes = jsonUtf8BytesOrInfinity(value);
	if (sanitizedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return value;
	const fallback = isRecord(originalDetails) ? buildPersistedDetailsFallback(originalDetails, originalSize, sanitizedBytes, redactionConfig) : {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		sanitizedDetailsBytes: sanitizedBytes
	};
	if (jsonUtf8BytesOrInfinity(fallback) <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return fallback;
	return {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		sanitizedDetailsBytes: sanitizedBytes
	};
}
function sanitizeToolResultDetailsForPersistence(details, redactionConfig) {
	if (details === void 0 || details === null) return details;
	const originalSize = boundedJsonUtf8Bytes(details, MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES);
	if (originalSize.complete && originalSize.bytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return enforcePersistedDetailsByteCap(redactPersistedDetailValue(details, 0, void 0, redactionConfig), details, originalSize, redactionConfig);
	const src = asOptionalObjectRecord(details);
	if (!src) return enforcePersistedDetailsByteCap({
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		valueType: typeof details
	}, void 0, originalSize, redactionConfig);
	const out = {
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		originalDetailKeys: redactedOriginalDetailKeys(src, redactionConfig)
	};
	copyPersistedSummaryFields({
		target: out,
		source: src,
		keys: [
			"status",
			"sessionId",
			"pid",
			"startedAt",
			"endedAt",
			"cwd",
			"name",
			"exitCode",
			"exitSignal",
			"retryInMs",
			"total",
			"totalLines",
			"totalChars",
			"truncated",
			"spill",
			"fullOutputPath",
			"spilledChars",
			"spillTruncated",
			"truncation"
		],
		maxChars: MAX_PERSISTED_DETAIL_STRING_CHARS,
		redactionConfig
	});
	copyPersistedResultStateFields(out, src, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (typeof src.tail === "string") out.tail = redactPersistedDetailString(src.tail, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (Array.isArray(src.sessions)) {
		out.sessions = src.sessions.slice(0, MAX_PERSISTED_DETAIL_SESSION_COUNT).map((session) => sanitizePersistedSessionDetail(session, redactionConfig));
		if (src.sessions.length > MAX_PERSISTED_DETAIL_SESSION_COUNT) out.sessionsTruncated = src.sessions.length - MAX_PERSISTED_DETAIL_SESSION_COUNT;
	}
	return enforcePersistedDetailsByteCap(out, src, originalSize, redactionConfig);
}
function capToolResultForPersistence(msg, maxChars, redactionConfig) {
	const capped = capToolResultSize(msg, maxChars);
	if (capped.role !== "toolResult") return capped;
	const details = capped.details;
	const sanitizedDetails = sanitizeToolResultDetailsForPersistence(details, redactionConfig);
	return sanitizedDetails === details ? capped : {
		...capped,
		details: sanitizedDetails
	};
}
function normalizePersistedToolResultName(message, fallbackName, fallbackId) {
	if (message.role !== "toolResult") return message;
	const rawToolName = message.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	const normalizedFallback = normalizeOptionalString(fallbackName);
	const toolName = normalizedToolName ?? normalizedFallback ?? "unknown";
	const rawToolCallIdValue = message.toolCallId;
	const rawToolCallId = typeof rawToolCallIdValue === "string" ? rawToolCallIdValue : void 0;
	const toolCallId = rawToolCallId ?? normalizeOptionalString(fallbackId);
	const isError = typeof message.isError === "boolean" ? message.isError : false;
	if (rawToolName === toolName && rawToolCallId === toolCallId && message.isError === isError) return message;
	return {
		...message,
		...toolCallId ? { toolCallId } : {},
		toolName,
		isError
	};
}
//#endregion
//#region src/agents/session-tool-result-guard.transcript-seq.ts
function resolveEntryTranscriptSeq(sessionManager, entryId, seqByEntryId) {
	if (!entryId) return 0;
	const cached = seqByEntryId.get(entryId);
	if (cached !== void 0) return cached;
	let seq = 0;
	for (const entry of sessionManager.getBranch(entryId)) {
		if (entry.type === "message" || entry.type === "compaction") seq += 1;
		seqByEntryId.set(entry.id, seq);
	}
	return seqByEntryId.get(entryId);
}
function resolveAppendedMessageSeq(params) {
	if (typeof params.entryId !== "string") return;
	const parentSeq = resolveEntryTranscriptSeq(params.sessionManager, params.parentEntryId, params.seqByEntryId);
	if (parentSeq === void 0) return;
	const messageSeq = parentSeq + 1;
	params.seqByEntryId.set(params.entryId, messageSeq);
	return messageSeq;
}
//#endregion
//#region src/agents/session-tool-result-guard.ts
/**
* Session transcript guard for tool-call/result consistency.
*
* Caps large tool results, repairs missing results, applies redaction, and emits transcript update events.
*/
function isUserAgentMessage(message) {
	return message.role === "user";
}
function isTranscriptOnlyAssistantAssistantMessage(message) {
	if (!message || message.role !== "assistant") return false;
	const provider = normalizeOptionalString(message.provider) ?? "";
	const model = normalizeOptionalString(message.model) ?? "";
	return isTranscriptOnlyAssistantAssistantModel(provider, model);
}
function extractPendingAssistantToolCalls(message) {
	return message.role === "assistant" && message.stopReason !== "aborted" && message.stopReason !== "error" ? extractToolCallsFromAssistant(message) : [];
}
function clearsPendingToolCalls(message, toolCalls, allowSyntheticToolResults) {
	if (message.role === "toolResult") return false;
	return !(message.role === "custom" && "excludeFromContext" in message && message.excludeFromContext === true || message.role === "assistant" && toolCalls.length === 0 && isTranscriptOnlyAssistantAssistantMessage(message)) && (toolCalls.length === 0 || message.role !== "assistant") || !allowSyntheticToolResults && toolCalls.length > 0;
}
function installSessionToolResultGuard(sessionManager, opts) {
	const originalAppend = getRawSessionAppendMessage(sessionManager);
	const originalAppendWithTranscriptAnchor = sessionManager.appendMessageWithTranscriptAnchor.bind(sessionManager);
	const originalAppendWithTranscriptAnchorAsync = sessionManager.appendMessageWithTranscriptAnchorAsync.bind(sessionManager);
	setRawSessionAppendMessage(sessionManager, originalAppend);
	const pending = /* @__PURE__ */ new Map();
	const persistMessage = (message, sourceAppend) => {
		const transformer = opts?.transformMessageForPersistence;
		const persisted = transformer ? transformer(message) : message;
		copyCodeModeSourceAppend(message, persisted, sourceAppend);
		return persisted;
	};
	const persistToolResult = (message, meta) => {
		const transformer = opts?.transformToolResultForPersistence;
		return transformer ? transformer(message, meta) : message;
	};
	const allowSyntheticToolResults = opts?.allowSyntheticToolResults ?? true;
	const missingToolResultText = opts?.missingToolResultText;
	const beforeWrite = opts?.beforeMessageWriteHook;
	const toolResultTransformerMayMutate = opts?.transformToolResultForPersistence !== void 0;
	const redactionConfig = opts?.config?.logging;
	const maxToolResultChars = resolveMaxToolResultChars(opts);
	const transcriptSeqByEntryId = /* @__PURE__ */ new Map();
	let transcriptRunId = opts?.runId;
	let assistantErrorTranscript = opts?.assistantErrorTranscript;
	let suppressNextUserMessagePersistence = opts?.suppressNextUserMessagePersistence === true;
	const appendRequest = (request, append) => withRuntimeUserTurnTranscriptRecorder(request.message, (beforeFreshMessageCommit) => {
		const appendOptions = opts?.config || beforeFreshMessageCommit ? copyCodeModeSourceAppendOptions(request.options, {
			...request.options,
			...opts?.config ? { config: opts.config } : {},
			...beforeFreshMessageCommit ? { beforeFreshMessageCommit } : {}
		}) : request.options;
		return append(request.message, request.sourceAppend ? prepareCodeModeSourceAppend(appendOptions ?? {}, request.message, request.sourceAppend) : appendOptions);
	});
	const runSync = (operation) => {
		let next = operation.next();
		while (!next.done) next = operation.next(appendRequest(next.value, originalAppendWithTranscriptAnchor));
		return next.value;
	};
	const runAsync = async (operation) => {
		let next = operation.next();
		while (!next.done) next = operation.next(await appendRequest(next.value, originalAppendWithTranscriptAnchorAsync));
		return next.value;
	};
	const updatePending = (message, calls = extractPendingAssistantToolCalls(message)) => {
		const resultId = message.role === "toolResult" ? extractToolResultId(message) : null;
		if (resultId) pending.delete(resultId);
		for (const call of calls) pending.set(call.id, call.name);
	};
	const recordPendingReceipt = (entryId, message, viewWasSuperseded) => {
		if (!viewWasSuperseded) {
			updatePending(message);
			return;
		}
		const branch = sessionManager.getBranch();
		const committedIndex = branch.findIndex((entry) => entry.id === entryId);
		if (committedIndex < 0) return;
		for (let index = committedIndex; index < branch.length; index++) {
			const entry = branch[index];
			if (entry?.type !== "message") continue;
			const calls = extractPendingAssistantToolCalls(entry.message);
			if (clearsPendingToolCalls(entry.message, calls, allowSyntheticToolResults)) pending.clear();
			updatePending(entry.message, calls);
		}
	};
	function* appendMessageAndCacheTranscriptSeq(message, options, sourceAppend, acknowledgementSource = message) {
		const runOwnedMessage = attachSessionTranscriptRunId(message, transcriptRunId);
		copyCodeModeSourceAppend(message, runOwnedMessage, sourceAppend);
		const parentEntryId = sessionManager.getLeafId();
		const originalTarget = sessionManager.getSessionTarget();
		const { entryId, anchor, appended, lifecycleRevision, message: persistedMessage, viewWasSuperseded } = yield {
			message: runOwnedMessage,
			options,
			sourceAppend
		};
		const sessionTarget = anchor ? {
			agentId: anchor.agentId,
			sessionId: anchor.sessionId,
			sessionKey: anchor.sessionKey,
			storePath: anchor.storePath
		} : originalTarget;
		if (viewWasSuperseded) transcriptSeqByEntryId.clear();
		const persistedEntry = sessionManager.getEntry(entryId);
		const messageSeq = appended && sessionTarget && (!viewWasSuperseded || persistedEntry) ? resolveAppendedMessageSeq({
			sessionManager,
			entryId,
			parentEntryId: persistedEntry ? persistedEntry.parentId : parentEntryId,
			seqByEntryId: transcriptSeqByEntryId
		}) : void 0;
		acknowledgeInternalToolResult(acknowledgementSource);
		recordPendingReceipt(entryId, persistedMessage, viewWasSuperseded === true);
		if (!appended) return {
			entryId,
			message: persistedMessage,
			appended,
			...anchor ? { anchor } : {}
		};
		opts?.onMessagePersisted?.(persistedMessage);
		if (!sessionTarget) return {
			entryId,
			message: persistedMessage,
			appended,
			...anchor ? { anchor } : {}
		};
		return {
			entryId,
			appended,
			lifecycleRevision,
			message: persistedMessage,
			...anchor ? { anchor } : {},
			sessionTarget,
			messageSeq
		};
	}
	const originalAppendCompaction = sessionManager.appendCompaction.bind(sessionManager);
	const guardedAppendCompaction = ((...args) => {
		args[5] = {
			runId: transcriptRunId,
			...args[5]
		};
		return withSessionCompactionPersistence(sessionManager, opts?.withCompactionPersistence, () => originalAppendCompaction(...args));
	});
	/**
	* Run the before_message_write hook. Returns the (possibly modified) message,
	* or null if the message should be blocked.
	*/
	const applyBeforeWriteHook = (msg, sourceAppend) => {
		if (!beforeWrite) return {
			message: msg,
			changed: false
		};
		const result = beforeWrite({ message: msg }, sourceAppend);
		if (result?.block) return null;
		if (result?.message) return {
			message: result.message,
			changed: true
		};
		return {
			message: msg,
			changed: false
		};
	};
	function* flushPendingToolResultsOperation() {
		if (pending.size === 0) return;
		if (allowSyntheticToolResults) for (const [id, name] of pending.entries()) {
			const synthetic = makeMissingToolResult({
				toolCallId: id,
				toolName: name,
				text: missingToolResultText
			});
			const persistedSynthetic = persistMessage(synthetic);
			const transformed = persistToolResult(persistedSynthetic, {
				toolCallId: id,
				toolName: name,
				isSynthetic: true
			});
			const flushed = applyBeforeWriteHook(transformed);
			if (flushed) {
				const canonical = flushed.message.role === "toolResult" ? rewriteToolResultIds({
					message: flushed.message,
					resolveId: () => id
				}) : flushed.message;
				yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(canonical, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: persistedSynthetic !== synthetic || toolResultTransformerMayMutate || canonical !== flushed.message || flushed.changed });
			}
		}
		pending.clear();
	}
	const flushPendingToolResults = () => runSync(flushPendingToolResultsOperation());
	const clearPendingToolResults = () => {
		pending.clear();
	};
	function* guardedAppend(message, callerOptions, sourceAppend) {
		const callerInvalidatesCache = callerOptions?.invalidateSerializedPrefixCache === true;
		let nextMessage = message;
		if (message.role === "assistant") {
			const sanitized = sanitizeToolCallInputs([message], { allowedToolNames: opts?.allowedToolNames });
			if (sanitized.length === 0) {
				if (pending.size > 0) yield* flushPendingToolResultsOperation();
				return;
			}
			const sanitizedMessage = sanitized.at(0);
			if (!sanitizedMessage) return;
			nextMessage = sanitizedMessage;
			copyCodeModeSourceAppend(message, nextMessage, sourceAppend);
		}
		if (nextMessage.role === "toolResult") {
			const id = extractToolResultId(nextMessage);
			const toolName = id ? pending.get(id) : void 0;
			const normalizedToolResult = normalizePersistedToolResultName(nextMessage, toolName, id ?? void 0);
			const persistedToolResult = persistMessage(normalizedToolResult);
			const capped = capToolResultForPersistence(persistedToolResult, maxToolResultChars, redactionConfig);
			const transformed = persistToolResult(capped, {
				toolCallId: id ?? void 0,
				toolName,
				isSynthetic: false
			});
			const persisted = applyBeforeWriteHook(transformed);
			if (!persisted) return;
			return (yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(persisted.message, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: callerInvalidatesCache || persistedToolResult !== normalizedToolResult || toolResultTransformerMayMutate || persisted.changed }, void 0, message)).entryId;
		}
		const toolCalls = extractPendingAssistantToolCalls(nextMessage);
		if (pending.size > 0 && clearsPendingToolCalls(nextMessage, toolCalls, allowSyntheticToolResults)) yield* flushPendingToolResultsOperation();
		const transformedMessage = persistMessage(nextMessage, sourceAppend);
		const finalWrite = applyBeforeWriteHook(transformedMessage, sourceAppend);
		if (!finalWrite) {
			if (isUserAgentMessage(transformedMessage)) opts?.onUserMessageBlocked?.(transformedMessage);
			return;
		}
		let finalMessage = finalWrite.message;
		const finalRole = finalMessage.role;
		if (finalRole === "assistant" && toolCalls.length === 0 && opts?.suppressTranscriptOnlyAssistantPersistence === true) return;
		if (finalRole === "assistant" && assistantErrorTranscript && finalMessage.stopReason === "error") {
			const target = sessionManager.getSessionTarget();
			if (target) {
				const replayMessage = assistantErrorTranscript.record(finalMessage, target, message);
				if (!replayMessage) return;
				copyCodeModeSourceAppend(finalMessage, replayMessage, sourceAppend);
				finalMessage = replayMessage;
			}
		}
		if (isUserAgentMessage(finalMessage) && suppressNextUserMessagePersistence) {
			suppressNextUserMessagePersistence = false;
			opts?.onUserMessagePersistenceSuppressed?.(finalMessage);
			return;
		}
		const { anchor, appended, entryId: result, lifecycleRevision, message: persistedMessage, messageSeq, sessionTarget } = yield* appendMessageAndCacheTranscriptSeq(finalMessage, { invalidateSerializedPrefixCache: callerInvalidatesCache || transformedMessage !== nextMessage || finalWrite.changed || finalMessage !== finalWrite.message }, sourceAppend, message);
		if (sessionTarget) {
			const runId = resolveTerminalAssistantTranscriptRunId(persistedMessage, transcriptRunId);
			publishTranscriptUpdate(sessionTarget, {
				lifecycleRevision,
				message: persistedMessage,
				messageId: typeof result === "string" ? result : void 0,
				...messageSeq !== void 0 ? { messageSeq } : {},
				...runId ? { runId } : {}
			});
		}
		if (isUserAgentMessage(finalMessage) && isUserAgentMessage(persistedMessage)) opts?.onUserMessagePersisted?.(finalMessage, {
			...anchor ? { anchor } : {},
			appended,
			entryId: result,
			persistedMessage,
			...sessionTarget ? { sessionTarget } : {}
		});
		return result;
	}
	sessionManager.appendMessage = ((message, options) => withCodeModeSourceAppend(message, options, (sourceAppend) => runSync(guardedAppend(message, options, sourceAppend))));
	sessionManager.appendMessageAsync = (message, options) => withSessionManagerWrite(sessionManager, () => withCodeModeSourceAppend(message, options, (sourceAppend) => runAsync(guardedAppend(message, options, sourceAppend))));
	sessionManager.appendCompaction = guardedAppendCompaction;
	return {
		hasPendingToolResults: () => pending.size > 0,
		flushPendingToolResults,
		clearPendingToolResults,
		clearNextUserMessagePersistenceSuppression: () => {
			suppressNextUserMessagePersistence = false;
		},
		getPendingIds: () => Array.from(pending.keys()),
		setTranscriptRunId: (runId, errors) => {
			transcriptRunId = runId;
			assistantErrorTranscript = errors;
		}
	};
}
//#endregion
//#region src/agents/session-tool-result-guard-wrapper.ts
/**
* Apply the tool-result guard to a SessionManager exactly once and expose
* a flush method on the instance for easy teardown handling.
*/
function guardSessionManager(sessionManager, opts) {
	const guardedSessionManager = sessionManager;
	let prepareAssistantTranscriptMessage = opts?.trigger === "memory" ? void 0 : opts?.prepareAssistantTranscriptMessage;
	let skipBeforeMessageWriteHooks = opts?.skipBeforeMessageWriteHooks;
	let inputProvenance = opts?.inputProvenance;
	if (typeof guardedSessionManager.flushPendingToolResults === "function") {
		guardedSessionManager.setTranscriptRunContext?.(opts?.runId, prepareAssistantTranscriptMessage, skipBeforeMessageWriteHooks, opts?.assistantErrorTranscript, inputProvenance);
		return guardedSessionManager;
	}
	const hookRunner = getGlobalHookRunner();
	let pendingPreparedUserTurnMessage = opts?.preparedUserTurnMessage;
	const preparedUserReplayKey = opts?.preparedUserTurnTranscriptRecorder?.getPersistedMessage?.()?.idempotencyKey === pendingPreparedUserTurnMessage?.idempotencyKey ? pendingPreparedUserTurnMessage?.idempotencyKey : void 0;
	let queuedUserTurnTranscriptRecorder;
	const runtimeUserMessageByPersistedMessage = /* @__PURE__ */ new WeakMap();
	const beforeMessageWrite = (event, sourceAppend) => {
		if (isMidTurnPrecheckAssistantError(event.message)) return { block: true };
		const runtimeUserMessage = runtimeUserMessageByPersistedMessage.get(event.message);
		let message = event.message;
		let changed = false;
		const skipUserWriteHook = skipBeforeMessageWriteHooks || message.role === "user" && queuedUserTurnTranscriptRecorder?.getPendingInputMessage?.() !== void 0;
		if (!skipUserWriteHook && hookRunner?.hasHooks("before_message_write") || prepareAssistantTranscriptMessage) {
			const preparedMessage = message.role === "user" ? {
				...message,
				__testclaw: { ...Reflect.get(message, "__testclaw") }
			} : void 0;
			if (preparedMessage && (preparedMessage["__testclaw"].humanMentions !== void 0 || preparedMessage["__testclaw"].workContext !== void 0)) {
				preparedMessage.content = structuredClone(preparedMessage.content);
				preparedMessage["__testclaw"].humanMentions = structuredClone(preparedMessage["__testclaw"].humanMentions);
			}
			const next = runAgentHarnessBeforeMessageWriteHook({
				message,
				agentId: opts?.agentId,
				sessionKey: opts?.sessionKey,
				prepareAssistantTranscriptMessage,
				skipBeforeMessageWriteHooks: skipUserWriteHook
			});
			if (!next) {
				runtimeUserMessageByPersistedMessage.delete(event.message);
				queuedUserTurnTranscriptRecorder?.markBlocked();
				queuedUserTurnTranscriptRecorder = void 0;
				return { block: true };
			}
			message = restorePreparedUserTurnOperationalMetaForRuntime({
				runtimeMessage: next,
				preparedMessage
			});
			changed = true;
		}
		copyCodeModeSourceAppend(event.message, message, sourceAppend);
		const redacted = redactTranscriptMessage(message, opts?.config, sourceAppend);
		if (redacted !== message) {
			message = redacted;
			changed = true;
		}
		const projectedMessage = projectAgentHarnessTranscriptMessageForDisplay({
			hidden: opts?.trigger === "memory",
			inputProvenance,
			message
		});
		if (projectedMessage !== message) {
			copyCodeModeSourceAppend(message, projectedMessage, sourceAppend);
			message = projectedMessage;
			changed = true;
		}
		if (message.role !== "user" && queuedUserTurnTranscriptRecorder) {
			queuedUserTurnTranscriptRecorder.markBlocked();
			queuedUserTurnTranscriptRecorder = void 0;
		}
		if (message.role === "user" && queuedUserTurnTranscriptRecorder) {
			message = attachRuntimeUserTurnTranscriptRecorder(message, queuedUserTurnTranscriptRecorder);
			queuedUserTurnTranscriptRecorder = void 0;
		}
		if (runtimeUserMessage && message.role === "user") runtimeUserMessageByPersistedMessage.set(message, runtimeUserMessage);
		return changed ? { message } : void 0;
	};
	const transform = hookRunner?.hasHooks("tool_result_persist") ? (message, meta) => {
		return hookRunner.runToolResultPersist({
			toolName: meta.toolName,
			toolCallId: meta.toolCallId,
			message,
			isSynthetic: meta.isSynthetic
		}, {
			agentId: opts?.agentId,
			sessionKey: opts?.sessionKey,
			toolName: meta.toolName,
			toolCallId: meta.toolCallId
		})?.message ?? message;
	} : void 0;
	const guard = installSessionToolResultGuard(sessionManager, {
		sessionKey: opts?.sessionKey,
		agentId: opts?.agentId,
		runId: opts?.runId,
		transformMessageForPersistence: (message) => {
			queuedUserTurnTranscriptRecorder = void 0;
			const withProvenance = applyInputProvenanceToUserMessage(message, inputProvenance);
			const runtimeContext = takeRuntimeUserTurnTranscriptContext(message);
			if (message.role === "user" && preparedUserReplayKey !== void 0 && Reflect.get(runtimeContext?.message ?? message, "idempotencyKey") !== preparedUserReplayKey) pendingPreparedUserTurnMessage = void 0;
			const prepared = runtimeContext?.message ?? pendingPreparedUserTurnMessage;
			const recorder = runtimeContext?.recorder ?? (prepared !== void 0 && prepared === pendingPreparedUserTurnMessage ? opts?.preparedUserTurnTranscriptRecorder : void 0);
			if (message.role === "user") opts?.onUserMessagePreparingForPersistence?.(message, recorder, prepared);
			const merged = mergePreparedUserTurnMessageForRuntime({
				runtimeMessage: withProvenance,
				...prepared ? { preparedMessage: prepared } : {}
			});
			if (merged !== withProvenance) {
				queuedUserTurnTranscriptRecorder = recorder;
				if (!runtimeContext) pendingPreparedUserTurnMessage = void 0;
			}
			if (message.role === "user" && merged.role === "user") runtimeUserMessageByPersistedMessage.set(merged, message);
			return merged;
		},
		transformToolResultForPersistence: transform,
		allowSyntheticToolResults: opts?.allowSyntheticToolResults,
		missingToolResultText: opts?.missingToolResultText,
		allowedToolNames: opts?.allowedToolNames,
		beforeMessageWriteHook: beforeMessageWrite,
		config: opts?.config,
		maxToolResultChars: typeof opts?.contextWindowTokens === "number" ? resolveLiveToolResultMaxChars({ contextWindowTokens: opts.contextWindowTokens }) : void 0,
		suppressNextUserMessagePersistence: preparedUserReplayKey === void 0 && opts?.suppressNextUserMessagePersistence,
		suppressTranscriptOnlyAssistantPersistence: opts?.suppressTranscriptOnlyAssistantPersistence,
		assistantErrorTranscript: opts?.assistantErrorTranscript,
		onMessagePersisted: opts?.onMessagePersisted,
		withCompactionPersistence: opts?.withCompactionPersistence,
		onUserMessagePersisted: async (message, persistence) => {
			const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
			runtimeUserMessageByPersistedMessage.delete(message);
			takeRuntimeUserTurnTranscriptRecorder(message)?.markRuntimePersisted(persistence.persistedMessage, persistence.anchor, { appended: persistence.appended });
			await opts?.onUserMessagePersisted?.(persistence.persistedMessage, runtimeMessage);
		},
		onUserMessagePersistenceSuppressed: async (message) => {
			const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
			runtimeUserMessageByPersistedMessage.delete(message);
			await opts?.onUserMessagePersistenceSuppressed?.(message, runtimeMessage);
		},
		onUserMessageBlocked: opts?.onUserMessageBlocked
	});
	setSessionToolTextPreparer(guardedSessionManager, (block) => prepareModelVisibleToolTextBlock(block, resolveTranscriptLoggingConfig(opts?.config)));
	guardedSessionManager.hasPendingToolResults = guard.hasPendingToolResults;
	guardedSessionManager.flushPendingToolResults = guard.flushPendingToolResults;
	guardedSessionManager.clearPendingToolResults = guard.clearPendingToolResults;
	guardedSessionManager.clearNextUserMessagePersistenceSuppression = guard.clearNextUserMessagePersistenceSuppression;
	guardedSessionManager.setTranscriptRunContext = (runId, prepare, skipHooks, errors, provenance) => {
		guard.setTranscriptRunId(runId, errors);
		prepareAssistantTranscriptMessage = prepare;
		skipBeforeMessageWriteHooks = skipHooks;
		inputProvenance = provenance;
	};
	return guardedSessionManager;
}
//#endregion
//#region src/agents/agent-tool-definition-adapter.ts
/**
* Adapts runtime AgentTool objects into session ToolDefinition entries.
* Owns hook execution, client-tool delegation, result coercion, and safe
* logging for failed tool calls.
*/
const TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS = 600;
const TOOL_ERROR_EXEC_COMMAND_HASH_CHARS = 16;
const SENSITIVE_EXEC_ENV_VALUE = "[omitted exec env value]";
const EXEC_COMMAND_PARAM_KEYS = /* @__PURE__ */ new Set(["command", "cmd"]);
function describeToolExecutionError(err) {
	const operatorHint = readToolOperatorHint(err);
	if (err instanceof Error) return {
		message: err.message?.trim() ? err.message : String(err),
		stack: err.stack,
		...operatorHint ? { operatorHint } : {}
	};
	return { message: String(err) };
}
function serializeToolParams(value) {
	if (value === void 0) return "<undefined>";
	if (typeof value === "string") return value;
	if (value === null || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	try {
		const serialized = JSON.stringify(value);
		if (typeof serialized === "string") return serialized;
	} catch {}
	if (typeof value === "function") return value.name ? `[Function ${value.name}]` : "[Function anonymous]";
	if (typeof value === "symbol") return value.description ? `Symbol(${value.description})` : "Symbol()";
	return Object.prototype.toString.call(value);
}
function formatToolParamPreview(label, serialized) {
	const redacted = redactToolDetail(serialized);
	return `${label}=${sanitizeForConsole(redacted, TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS) ?? "<empty>"}`;
}
function kindForLog(value) {
	if (Array.isArray(value)) return "array";
	if (value === null) return "null";
	return typeof value;
}
function summarizeSensitiveValueForLog(params) {
	const serialized = serializeToolParams(params.value);
	return {
		omitted: true,
		reason: params.reason,
		type: kindForLog(params.value),
		chars: serialized.length,
		sha256: createHash("sha256").update(serialized).digest("hex").slice(0, TOOL_ERROR_EXEC_COMMAND_HASH_CHARS)
	};
}
function summarizeExecCommandForLog(command) {
	return summarizeSensitiveValueForLog({
		value: command,
		reason: "exec command may contain credentials"
	});
}
function sanitizeExecEnvForLog(value) {
	if (!isPlainObject(value)) return value === void 0 ? void 0 : "[omitted exec env]";
	return Object.fromEntries(Object.keys(value).toSorted().map((key) => [key, SENSITIVE_EXEC_ENV_VALUE]));
}
function sanitizeExecFailureParamsForLog(value) {
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (isPlainObject(parsed)) return sanitizeExecFailureParamsForLog(parsed);
	} catch {}
	if (!isPlainObject(value)) return summarizeSensitiveValueForLog({
		value,
		reason: "exec params may contain command credentials"
	});
	const sanitized = {};
	for (const [key, field] of Object.entries(value)) {
		if (EXEC_COMMAND_PARAM_KEYS.has(key)) {
			sanitized[key] = summarizeExecCommandForLog(field);
			continue;
		}
		if (key === "env") {
			sanitized[key] = sanitizeExecEnvForLog(field);
			continue;
		}
		sanitized[key] = field;
	}
	return sanitized;
}
function sanitizeToolFailureParamsForLog(toolName, value) {
	return toolName === "exec" ? sanitizeExecFailureParamsForLog(value) : value;
}
function describeToolFailureInputs(params) {
	const rawParams = sanitizeToolFailureParamsForLog(params.toolName, params.rawParams);
	const effectiveParams = sanitizeToolFailureParamsForLog(params.toolName, params.effectiveParams);
	const rawSerialized = serializeToolParams(rawParams);
	const parts = [formatToolParamPreview("raw_params", rawSerialized)];
	const effectiveSerialized = serializeToolParams(effectiveParams);
	if (effectiveSerialized !== rawSerialized) parts.push(formatToolParamPreview("effective_params", effectiveSerialized));
	return parts.join(" ");
}
function normalizeToolExecutionResult(params) {
	const { toolName, result } = params;
	if (result && typeof result === "object") {
		const record = result;
		if (Array.isArray(record.content)) return result;
		logDebug(`tools: ${toolName} returned non-standard result (missing content[]); coercing`);
		const safeDetails = ("details" in record ? record.details : record) ?? {
			status: "ok",
			tool: toolName
		};
		return payloadTextResult(safeDetails);
	}
	return payloadTextResult(result ?? {
		status: "ok",
		tool: toolName
	});
}
function buildToolExecutionErrorResult(params) {
	return jsonResult({
		status: "error",
		tool: params.toolName,
		error: params.message
	});
}
async function executeAdaptedToolOperation(params) {
	try {
		return normalizeToolExecutionResult({
			toolName: params.normalizedToolName,
			result: await params.run()
		});
	} catch (err) {
		if (params.signal?.aborted) throw err;
		if (isBeforeToolCallBlockedError(err)) {
			logDebug(`tools: ${params.normalizedToolName} blocked by before_tool_call: ${err.reason}`);
			return buildBlockedToolResult({
				reason: err.reason,
				toolCallId: params.toolCallId,
				runId: params.hookContext?.runId
			});
		}
		const described = describeToolExecutionError(err);
		if (described.stack && described.stack !== described.message) logDebug(`tools: ${params.normalizedToolName} failed stack:\n${described.stack}`);
		const inputPreview = describeToolFailureInputs({
			toolName: params.normalizedToolName,
			rawParams: params.rawParams,
			effectiveParams: params.getEffectiveParams()
		});
		const operatorHint = described.operatorHint ? ` ${described.operatorHint}` : "";
		logError(`[tools] ${params.normalizedToolName} failed: ${described.message}${operatorHint} ${inputPreview}`);
		return buildToolExecutionErrorResult({
			toolName: params.normalizedToolName,
			message: described.message
		});
	}
}
function attachAdapterExecutionPreparer(definition) {
	return attachInternalToolExecutionPreparer(definition, createInternalExecutionPreparer((params, control) => definition.execute(params.toolCallId, params.args, params.signal, params.onUpdate, control)));
}
const CLIENT_TOOL_NAME_CONFLICT_PREFIX = "client tool name conflict:";
/** Find client-hosted tool names that collide with runtime or sibling tools. */
function findClientToolNameConflicts(params) {
	const existingNormalized = /* @__PURE__ */ new Set();
	for (const name of params.existingToolNames ?? []) {
		const trimmed = name.trim();
		if (trimmed) existingNormalized.add(normalizeToolPolicyName(trimmed));
	}
	const conflicts = /* @__PURE__ */ new Set();
	const seenClientNames = /* @__PURE__ */ new Map();
	for (const tool of params.tools) {
		const rawName = (tool.function?.name ?? "").trim();
		if (!rawName) continue;
		const normalizedName = normalizeToolPolicyName(rawName);
		if (existingNormalized.has(normalizedName)) conflicts.add(rawName);
		const priorClientName = seenClientNames.get(normalizedName);
		if (priorClientName) {
			conflicts.add(priorClientName);
			conflicts.add(rawName);
			continue;
		}
		seenClientNames.set(normalizedName, rawName);
	}
	return Array.from(conflicts);
}
/** Build a recognizable error for rejecting conflicting client tool names. */
function createClientToolNameConflictError(conflicts) {
	return /* @__PURE__ */ new Error(`${CLIENT_TOOL_NAME_CONFLICT_PREFIX} ${conflicts.join(", ")}`);
}
/** Detect client tool conflict errors without depending on object identity. */
function isClientToolNameConflictError(err) {
	return err instanceof Error && err.message.startsWith(CLIENT_TOOL_NAME_CONFLICT_PREFIX);
}
/** Convert executable agent tools into session definitions with hook handling. */
function toToolDefinitions(tools, hookContext, abortSignal) {
	const resolveAbortSignal = (signal) => signal && abortSignal ? AbortSignal.any([signal, abortSignal]) : signal ?? abortSignal;
	return tools.map((tool) => {
		const name = tool.name || "tool";
		const normalizedName = normalizeToolPolicyName(name);
		const beforeHookWrapped = isToolWrappedWithBeforeToolCallHook(tool);
		const sourcePreparer = getInternalToolExecutionPreparer(tool);
		const definition = {
			name,
			label: tool.label ?? name,
			...tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
			...tool.resultContentSource ? { resultContentSource: tool.resultContentSource } : {},
			description: tool.description ?? "",
			parameters: tool.parameters,
			prepareArguments: tool.prepareArguments,
			executionMode: tool.executionMode,
			execute: async (...args) => {
				const [toolCallId, params, callSignal, onUpdate] = args;
				const signal = resolveAbortSignal(callSignal);
				signal?.throwIfAborted();
				const control = readInternalExecutionControl(args[4]);
				recordStructuredReplayTrustForToolCall(toolCallId, tool, hookContext?.runId);
				let executeParams = params;
				return await executeAdaptedToolOperation({
					toolCallId,
					normalizedToolName: normalizedName,
					rawParams: params,
					getEffectiveParams: () => executeParams,
					signal,
					hookContext,
					run: async () => {
						if (!beforeHookWrapped) {
							const preparedParams = await prepareBeforeToolCallExecutionParams({
								tool,
								params,
								...toolCallId ? { toolCallId } : {},
								...hookContext ? { ctx: hookContext } : {},
								...signal ? { signal } : {}
							});
							const hookParams = normalizeCodeModeExecBeforeHookParams({
								tool,
								params: preparedParams
							});
							const hookMetadata = getCodeModeExecBeforeHookMetadata({
								tool,
								params: preparedParams
							});
							const hookOutcome = await runBeforeToolCallHook({
								toolName: name,
								params: hookParams,
								...hookMetadata,
								toolCallId,
								ctx: hookContext,
								signal
							});
							if (hookOutcome.blocked) {
								if (hookOutcome.kind === "veto") return buildBlockedToolResult({
									reason: hookOutcome.reason,
									deniedReason: hookOutcome.deniedReason,
									toolCallId,
									runId: hookContext?.runId
								});
								throw new Error(hookOutcome.reason);
							}
							executeParams = finalizeBeforeToolCallExecutionParams({
								tool,
								preparedParams,
								hookParams,
								adjustedParams: hookOutcome.params,
								finalizerMode: "adapter"
							});
							const decision = control ? await control.pause(executeParams) : void 0;
							if (decision && !decision.launch) return {
								content: [],
								details: { status: "skipped" }
							};
							const voiceConfirmation = consumeFinalClientVoiceToolConfirmation({
								toolCallId,
								toolName: name,
								params: executeParams,
								ctx: hookContext
							});
							if (!voiceConfirmation.allowed) return buildBlockedToolResult({
								reason: voiceConfirmation.reason,
								deniedReason: "client-voice-confirmation",
								toolCallId,
								runId: hookContext?.runId
							});
							decision?.start?.();
							recordAdjustedParamsForToolCall(toolCallId, executeParams, hookContext?.runId);
						}
						return await tool.execute(toolCallId, executeParams, signal, onUpdate);
					}
				});
			}
		};
		copyCodeModeControlToolIdentity(tool, definition);
		if (!sourcePreparer) return beforeHookWrapped ? definition : attachAdapterExecutionPreparer(definition);
		return attachInternalToolExecutionPreparer(definition, async (params) => {
			const signal = resolveAbortSignal(params.signal);
			signal?.throwIfAborted();
			recordStructuredReplayTrustForToolCall(params.toolCallId, tool, hookContext?.runId);
			const settle = (run) => executeAdaptedToolOperation({
				toolCallId: params.toolCallId,
				normalizedToolName: normalizedName,
				rawParams: params.args,
				getEffectiveParams: () => params.args,
				signal,
				hookContext,
				run
			});
			const settleImmediate = async (outcome, dispose) => {
				try {
					return {
						kind: "immediate",
						outcome: {
							kind: "result",
							result: await settle(async () => {
								if (outcome.kind === "error") throw outcome.error;
								return outcome.result;
							}),
							isError: outcome.kind === "result" && outcome.isError
						},
						dispose
					};
				} catch (error) {
					return {
						kind: "immediate",
						outcome: {
							kind: "error",
							error
						},
						dispose
					};
				}
			};
			let prepared;
			try {
				prepared = await sourcePreparer({
					toolCallId: params.toolCallId,
					args: params.args,
					...signal ? { signal } : {},
					...params.onUpdate ? { onUpdate: params.onUpdate } : {}
				});
			} catch (error) {
				return await settleImmediate({
					kind: "error",
					error
				}, () => {});
			}
			if (prepared.kind === "immediate") return await settleImmediate(prepared.outcome, prepared.dispose);
			const ready = prepared;
			return {
				kind: "ready",
				args: ready.args,
				execute: (onImplementationStart) => {
					signal?.throwIfAborted();
					return settle(() => ready.execute(onImplementationStart));
				},
				dispose: ready.dispose
			};
		});
	});
}
function coerceParamsRecord(value, schema) {
	let record;
	if (isPlainObject(value)) record = value;
	else if (value === void 0 || value === null) record = {};
	else if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) record = {};
		else {
			let parsed;
			try {
				parsed = JSON.parse(trimmed);
			} catch {
				throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
			}
			if (parsed === null) record = {};
			else if (isPlainObject(parsed)) record = parsed;
			else throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
		}
	} else throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
	const missing = (Array.isArray(schema?.required) ? schema.required.filter((key) => typeof key === "string") : []).filter((key) => !Object.hasOwn(record, key));
	if (missing.length > 0) throw new ToolInputError(`Invalid client tool arguments: missing required ${missing.join(", ")}`);
	return record;
}
/** Convert client-hosted tools into pending session definitions. */
function toClientToolDefinitions(tools, onClientToolCall, hookContext) {
	return tools.map((tool) => {
		const func = tool.function;
		return attachAdapterExecutionPreparer({
			name: func.name,
			label: func.name,
			description: func.description ?? "",
			parameters: func.parameters,
			execute: async (...args) => {
				const [toolCallId, params, signal] = args;
				const control = readInternalExecutionControl(args[4]);
				if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.reserve?.(toolCallId, func.name);
				try {
					const initialParamsRecord = coerceParamsRecord(params, func.parameters);
					const outcome = await runBeforeToolCallHook({
						toolName: func.name,
						params: initialParamsRecord,
						toolCallId,
						ctx: hookContext,
						signal
					});
					if (outcome.blocked) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						if (outcome.kind === "veto") return buildBlockedToolResult({
							reason: outcome.reason,
							deniedReason: outcome.deniedReason,
							toolCallId,
							runId: hookContext?.runId
						});
						throw new Error(outcome.reason);
					}
					const adjustedParams = outcome.params;
					const paramsRecord = coerceParamsRecord(adjustedParams, func.parameters);
					const decision = control ? await control.pause(paramsRecord) : void 0;
					if (decision && !decision.launch) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						return {
							content: [],
							details: { status: "skipped" }
						};
					}
					const voiceConfirmation = consumeFinalClientVoiceToolConfirmation({
						toolCallId,
						toolName: func.name,
						params: paramsRecord,
						ctx: hookContext
					});
					if (!voiceConfirmation.allowed) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						return buildBlockedToolResult({
							reason: voiceConfirmation.reason,
							deniedReason: "client-voice-confirmation",
							toolCallId,
							runId: hookContext?.runId
						});
					}
					signal?.throwIfAborted();
					decision?.start?.();
					if (onClientToolCall) {
						if (typeof onClientToolCall === "function") onClientToolCall(func.name, paramsRecord);
						else onClientToolCall.complete(toolCallId, func.name, paramsRecord);
					}
				} catch (err) {
					if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
					if (err instanceof ToolInputError) return buildToolExecutionErrorResult({
						toolName: func.name,
						message: err.message
					});
					throw err;
				}
				return {
					...jsonResult({
						status: "pending",
						tool: func.name,
						message: "Tool execution delegated to client"
					}),
					terminate: true
				};
			}
		});
	});
}
//#endregion
//#region src/agents/sessions/telemetry.ts
/** Resolves whether install telemetry is enabled from env override or settings. */
function isInstallTelemetryEnabled(settingsManager, telemetryEnv = process.env.TESTCLAW_TELEMETRY) {
	return telemetryEnv !== void 0 ? isTruthyEnvValue(telemetryEnv) : settingsManager.getEnableInstallTelemetry();
}
//#endregion
//#region src/agents/sessions/sdk.ts
/**
* Agent session SDK factory.
*
* Selects models, wires built-in/custom tools, loads resources, and creates AgentSession instances.
*/
function createSessionPrepareNextTurnWithContext(getAgent) {
	let activeRunMessages;
	let effectiveModel;
	let effectiveThinkingLevel;
	let lastSessionModel;
	let lastSessionThinkingLevel;
	let lastSessionPrompt;
	let lastSessionTools = [];
	const sameTools = (left, right) => left.length === right.length && left.every((tool, index) => tool === right[index]);
	return async (turn, signal) => {
		const agent = getAgent();
		const firstTurnInRun = activeRunMessages !== turn.newMessages;
		if (firstTurnInRun) {
			activeRunMessages = turn.newMessages;
			effectiveModel = agent.state.model;
			effectiveThinkingLevel = agent.state.thinkingLevel;
		}
		const previousSnapshot = await agent.prepareNextTurn?.(signal);
		const sessionPrompt = agent.state.systemPrompt;
		const sessionTools = agent.state.tools;
		const sessionModelChanged = firstTurnInRun || agent.state.model !== lastSessionModel;
		const sessionThinkingChanged = firstTurnInRun || agent.state.thinkingLevel !== lastSessionThinkingLevel;
		const sessionPromptChanged = firstTurnInRun || sessionPrompt !== lastSessionPrompt;
		const sessionToolsChanged = firstTurnInRun || !sameTools(sessionTools, lastSessionTools);
		effectiveModel = previousSnapshot?.model ?? (sessionModelChanged ? agent.state.model : effectiveModel);
		effectiveThinkingLevel = previousSnapshot?.thinkingLevel ?? (sessionThinkingChanged ? agent.state.thinkingLevel : effectiveThinkingLevel);
		lastSessionModel = agent.state.model;
		lastSessionThinkingLevel = agent.state.thinkingLevel;
		lastSessionPrompt = sessionPrompt;
		lastSessionTools = sessionTools.slice();
		const nextContext = previousSnapshot?.context ? { ...previousSnapshot.context } : {
			...turn.context,
			systemPrompt: sessionPromptChanged ? sessionPrompt : turn.context.systemPrompt,
			tools: sessionToolsChanged ? sessionTools.slice() : turn.context.tools?.slice()
		};
		return {
			...previousSnapshot,
			context: nextContext,
			model: effectiveModel,
			thinkingLevel: effectiveThinkingLevel
		};
	};
}
function getAttributionHeaders(model, settingsManager) {
	if (!isInstallTelemetryEnabled(settingsManager)) return;
	const baseUrl = model.baseUrl ?? "";
	if (model.provider === "openrouter" || baseUrl.includes("openrouter.ai")) return {
		"HTTP-Referer": "https://testclaw.ai",
		"X-OpenRouter-Title": "Assistant",
		"X-OpenRouter-Categories": "cli-agent"
	};
	if (model.provider === "cloudflare-workers-ai" || model.provider === "cloudflare-ai-gateway" || baseUrl.includes("api.cloudflare.com") || baseUrl.includes("gateway.ai.cloudflare.com")) return { "User-Agent": "testclaw" };
}
/**
* Create an AgentSession with the specified options.
*
* @example
* ```typescript
* // Minimal - uses defaults
* const { session } = await createAgentSession();
*
* // With explicit model from the configured registry
* const model = ModelRegistry.create(AuthStorage.load()).find('anthropic', 'claude-opus-4-5');
* const { session } = await createAgentSession({
*   model,
*   thinkingLevel: 'high',
* });
*
* // Continue previous session
* const { session, modelFallbackMessage } = await createAgentSession({
*   continueSession: true,
* });
*
* // Full control
* const loader = new DefaultResourceLoader({
*   cwd: process.cwd(),
*   agentDir: getAgentDir(),
*   settingsManager: SettingsManager.create(),
* });
* await loader.reload();
* const { session } = await createAgentSession({
*   model: myModel,
*   tools: ["read", "bash"],
*   resourceLoader: loader,
*   sessionManager: SessionManager.inMemory(),
* });
* ```
*/
async function createAgentSession(options = {}) {
	return await createAgentSessionImpl(options);
}
/** Internal factory for temporary embedded sessions that do not own durable provider resources. */
async function createAgentSessionForEmbeddedRunner(options, internalOptions) {
	return await createAgentSessionImpl(options, internalOptions, false);
}
async function createAgentSessionImpl(options, internalOptions = {}, cleanupProviderSessionResourcesOnDispose = true) {
	const cwd = options.cwd ?? options.sessionManager?.getCwd() ?? process.cwd();
	const install = getAgentDirResolution(options.agentDir);
	const { dir: agentDir } = install.directory;
	if (options.agentDir === void 0 && install.directory.owner) registerResolvedAgentDir({
		agentId: install.directory.owner,
		agentDir,
		env: install.env
	});
	let resourceLoader = options.resourceLoader;
	const config = options.authStorage && options.modelRegistry ? void 0 : install.config;
	const authStorage = options.authStorage ?? AuthStorage.forAgent(agentDir, config);
	const modelRegistry = options.modelRegistry ?? ModelRegistry.create(authStorage, join(agentDir, "models.json"), {
		config,
		workspaceDir: cwd
	});
	const settingsManager = options.settingsManager ?? SettingsManager.create(cwd, agentDir);
	const sessionManager = options.sessionManager ?? await createDefaultSdkSessionManager(cwd, install);
	const initialTarget = sessionManager.getSessionTarget();
	const initialSessionId = sessionManager.getSessionId();
	const assertInitialSessionCurrent = () => {
		const current = sessionManager.getSessionTarget();
		if (sessionManager.getSessionId() !== initialSessionId || !sameSessionTranscriptTargetBinding(initialTarget, current)) throw new SessionTranscriptWriterClaimReboundError();
	};
	if (!resourceLoader) {
		resourceLoader = new DefaultResourceLoader({
			cwd,
			agentDir,
			settingsManager
		});
		await resourceLoader.reload();
		assertInitialSessionCurrent();
		modelRegistry.refresh();
	}
	const existingSession = sessionManager.buildSessionContext();
	const hasExistingSession = existingSession.messages.length > 0;
	const hasThinkingEntry = sessionManager.getBranch().some((entry) => entry.type === "thinking_level_change");
	let model = options.model;
	let modelFallbackMessage;
	if (!model && hasExistingSession && existingSession.model) {
		const restoredModel = modelRegistry.find(existingSession.model.provider, existingSession.model.modelId);
		if (restoredModel && modelRegistry.hasConfiguredAuth(restoredModel)) model = restoredModel;
		if (!model) modelFallbackMessage = `Could not restore model ${existingSession.model.provider}/${existingSession.model.modelId}`;
	}
	if (!model) {
		model = (await findInitialModel({
			scopedModels: [],
			isContinuing: hasExistingSession,
			defaultProvider: settingsManager.getDefaultProvider(),
			defaultModelId: settingsManager.getDefaultModel(),
			defaultThinkingLevel: settingsManager.getDefaultThinkingLevel(),
			modelRegistry
		})).model;
		if (!model) modelFallbackMessage = formatNoModelsAvailableMessage();
		else if (modelFallbackMessage) modelFallbackMessage += `. Using ${model.provider}/${model.id}`;
	}
	let thinkingLevel = options.thinkingLevel;
	const modelThinkingProvider = model?.api === "ollama" ? "ollama" : model?.provider;
	const modelThinkingCompat = model ? projectModelThinkingCompat(model.compat) : void 0;
	const modelThinkingDefault = (model && modelThinkingProvider ? resolveThinkingDefaultForModel({
		provider: modelThinkingProvider,
		model: model.id,
		catalog: [{
			provider: modelThinkingProvider,
			id: model.id,
			api: model.api,
			reasoning: model.reasoning,
			...model.params ? { params: model.params } : {},
			...modelThinkingCompat ? { compat: modelThinkingCompat } : {}
		}]
	}) : void 0) === "off" ? "off" : DEFAULT_THINKING_LEVEL;
	if (thinkingLevel === void 0 && hasExistingSession) thinkingLevel = hasThinkingEntry ? existingSession.thinkingLevel : settingsManager.getDefaultThinkingLevel() ?? modelThinkingDefault;
	if (thinkingLevel === void 0) thinkingLevel = settingsManager.getDefaultThinkingLevel() ?? modelThinkingDefault;
	if (!model) thinkingLevel = "off";
	else thinkingLevel = clampThinkingLevel(model, thinkingLevel);
	const defaultActiveToolNames = [
		"read",
		"bash",
		"edit",
		"write"
	];
	const customToolNames = options.customTools?.map((tool) => tool.name) ?? [];
	const allowedToolNames = options.tools ?? (options.noTools === "all" ? [] : void 0);
	const disableBuiltInTools = !options.tools && options.noTools === "builtin";
	const initialActiveToolNames = options.tools ? [...options.tools] : options.noTools === "all" ? [] : options.noTools === "builtin" ? customToolNames : defaultActiveToolNames;
	const convertToLlmWithBlockImages = (messages) => {
		const converted = convertToLlm(messages);
		if (!settingsManager.getBlockImages()) return converted;
		return converted.map((msg) => {
			if (msg.role === "user" || msg.role === "toolResult") {
				const content = msg.content;
				if (Array.isArray(content)) {
					if (content.some((c) => c.type === "image")) {
						const filteredContent = content.map((c) => c.type === "image" ? {
							type: "text",
							text: "Image reading is disabled."
						} : c).filter((c, i, arr) => {
							const previous = arr.at(i - 1);
							return !(c.type === "text" && c.text === "Image reading is disabled." && i > 0 && previous?.type === "text" && previous.text === "Image reading is disabled.");
						});
						return Object.assign({}, msg, { content: filteredContent });
					}
				}
			}
			return msg;
		});
	};
	const extensionRunnerRef = {};
	const runWithSessionWriteSettlement = async (run) => options.withSessionWriteSettlement ? await options.withSessionWriteSettlement(run) : await run();
	assertInitialSessionCurrent();
	const modelRegistryRuntime = getModelRegistryRuntime(modelRegistry);
	const agent = new Agent({
		initialState: {
			systemPrompt: "",
			model,
			thinkingLevel,
			tools: []
		},
		convertToLlm: convertToLlmWithBlockImages,
		streamFn: async (modelResult, context, optionsLocal) => {
			const auth = await modelRegistry.getApiKeyAndHeaders(modelResult);
			if (!auth.ok) throw new Error(auth.error);
			await import("./ai-transport-runtime-host-Dq7ICj1G.js");
			optionsLocal?.signal?.throwIfAborted();
			const providerRetrySettings = settingsManager.getProviderRetrySettings();
			const attributionHeaders = getAttributionHeaders(modelResult, settingsManager);
			return modelRegistryRuntime.llmRuntime.streamSimple(modelResult, context, {
				...optionsLocal,
				apiKey: auth.apiKey,
				timeoutMs: optionsLocal?.timeoutMs ?? providerRetrySettings.timeoutMs,
				maxRetryDelayMs: optionsLocal?.maxRetryDelayMs ?? providerRetrySettings.maxRetryDelayMs,
				headers: attributionHeaders || auth.headers || optionsLocal?.headers ? {
					...attributionHeaders,
					...auth.headers,
					...optionsLocal?.headers
				} : void 0
			});
		},
		onPayload: async (payload, modelValue) => {
			const runner = extensionRunnerRef.current;
			if (!runner?.hasHandlers("before_provider_request")) return payload;
			return await runWithSessionWriteSettlement(async () => await runner.emitBeforeProviderRequest(payload));
		},
		onResponse: async (response, modelLocal) => {
			const runner = extensionRunnerRef.current;
			if (!runner?.hasHandlers("after_provider_response")) return;
			await runWithSessionWriteSettlement(async () => await runner.emit({
				type: "after_provider_response",
				status: response.status,
				headers: response.headers
			}));
		},
		sessionId: initialSessionId,
		transformContext: async (messages) => {
			const runner = extensionRunnerRef.current;
			if (!runner) return messages;
			return runner.emitContext(messages);
		},
		resolveDeferredTool: options.resolveDeferredTool,
		prepareNextTurnWithContext: createSessionPrepareNextTurnWithContext(() => agent),
		steeringMode: settingsManager.getSteeringMode(),
		followUpMode: settingsManager.getFollowUpMode(),
		transport: settingsManager.getTransport(),
		thinkingBudgets: settingsManager.getThinkingBudgets(),
		maxRetryDelayMs: settingsManager.getProviderRetrySettings().maxRetryDelayMs
	});
	setInternalBeforeToolBatch(agent, internalOptions.beforeToolBatch);
	if (agent.streamFn) bindStreamLlmRuntime(agent.streamFn, modelRegistryRuntime.llmRuntime);
	let metadataCommit;
	const appendInitialMetadata = (change, append) => withSessionMetadataPublication(sessionManager, change, (commit) => {
		metadataCommit = commit;
	}, append);
	const appendInitialThinking = () => appendInitialMetadata({
		type: "thinking_level_change",
		thinkingLevel
	}, () => sessionManager.appendThinkingLevelChange(thinkingLevel));
	const initializeMetadata = () => {
		if (hasExistingSession && hasThinkingEntry) return Promise.resolve();
		return withSessionManagerWrite(sessionManager, async () => {
			assertInitialSessionCurrent();
			if (hasExistingSession) {
				await appendInitialThinking();
				assertInitialSessionCurrent();
			} else {
				if (model) {
					await appendInitialMetadata({
						type: "model_change",
						provider: model.provider,
						modelId: model.id
					}, () => sessionManager.appendModelChange(model.provider, model.id));
					assertInitialSessionCurrent();
				}
				await appendInitialThinking();
			}
		});
	};
	try {
		await (initialTarget ? withSessionTranscriptWriteAssertion(initialTarget, assertInitialSessionCurrent, initializeMetadata) : initializeMetadata());
		assertInitialSessionCurrent();
		if (hasExistingSession) agent.state.messages = sanitizeCompactionReplayMessages(existingSession.messages);
	} catch (cause) {
		if (cause instanceof SessionMetadataCommittedError || !metadataCommit) throw cause;
		throw new SessionMetadataCommittedError(metadataCommit.entry, metadataCommit.version, cause, metadataCommit.target);
	}
	return {
		session: new AgentSession({
			agent,
			sessionManager,
			settingsManager,
			cwd,
			resourceLoader,
			customTools: options.customTools,
			modelRegistry,
			initialActiveToolNames,
			allowedToolNames,
			disableBuiltInTools,
			extensionRunnerRef,
			sessionStartEvent: options.sessionStartEvent,
			withSessionWriteSettlement: options.withSessionWriteSettlement,
			contextOverflowRecoveryOwner: internalOptions.contextOverflowRecoveryOwner,
			cleanupProviderSessionResourcesOnDispose
		}),
		extensionsResult: resourceLoader.getExtensions(),
		modelFallbackMessage
	};
}
async function createDefaultSdkSessionManager(cwd, install) {
	const { dir: agentDir, owner: agentId } = install.directory;
	if (!agentId) throw new Error("Select an agent owner or provide a sessionManager before creating an SDK session.");
	const sessionId = randomUUID();
	const target = {
		agentId,
		sessionId,
		sessionKey: `agent:${agentId}:sdk:${sessionId}`,
		storePath: join(agentDir, "testclaw-agent.sqlite"),
		env: install.env
	};
	openAssistantAgentDatabase({
		agentId,
		env: install.env,
		path: target.storePath
	});
	const created = await createSessionEntryWithTranscript(target, () => ({
		ok: true,
		entry: {
			sessionId,
			updatedAt: Date.now()
		}
	}), { cwd });
	if (!created.ok) throw new Error(`Failed to initialize SDK session transcript: ${created.error}`);
	return SessionManager.open(target, cwd);
}
//#endregion
//#region src/agents/embedded-agent-runner/resource-loader.ts
/** Embedded sessions consume prepared resources, never ambient local discovery. */
function createEmbeddedAgentResourceLoader(options) {
	return new DefaultResourceLoader({
		...options,
		noExtensions: true,
		noSkills: true,
		noPromptTemplates: true,
		noThemes: true,
		noContextFiles: true,
		systemPrompt: "",
		appendSystemPrompt: []
	});
}
//#endregion
export { findClientToolNameConflicts as a, toToolDefinitions as c, isMidTurnPrecheckAssistantError as d, isMidTurnPrecheckSignal as f, createClientToolNameConflictError as i, guardSessionManager as l, createAgentSession as n, isClientToolNameConflictError as o, createAgentSessionForEmbeddedRunner as r, toClientToolDefinitions as s, createEmbeddedAgentResourceLoader as t, MidTurnPrecheckSignal as u };
