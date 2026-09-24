import { f as normalizeStringifiedEntries, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-C787aVxk.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { f as clampPositiveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { E as extractErrorHttpStatus } from "./redact-myZeUWr_.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BbfKzfAT.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { b as createAgentRunStaleLifecycleError, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-CFq48PcN.js";
import { b as sessionMatchesExpectedTranscriptTurn, y as buildRestartRecoveryExpectedState } from "./session-accessor-DMf92PxK.js";
import { l as updateSessionEntry } from "./session-accessor.reset-Cl1Mir1u.js";
import { a as hasRestartRecoveryTerminalRun, i as hasRestartRecoverySourceClaim, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-Bc2gwEgq.js";
import { a as isFailoverError } from "./error-D_GewJgV.js";
import { C as resolveProviderRequestFailureCopy, D as renderAssistantRequestFailureCopy, O as renderFormatErrorCopy, _ as renderHeartbeatRunFailureCopy, b as renderRateLimitReplyCopy, f as renderAuthProfileFailoverCopy, g as renderFailoverCodeUserCopy, m as renderCliTimeoutReplyCopy, n as GENERIC_EXTERNAL_RUN_FAILURE_TEXT, p as renderBillingReplyCopy, r as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, v as renderMissingApiKeyReplyCopy, w as classifyProviderRequestFacets, y as renderRateLimitOrOverloadedCopy } from "./user-copy-CP-Iqg-t.js";
import { a as buildOAuthRefreshFailureLoginCommand, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure, s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-DLQDPLGc.js";
import { i as isAgentHarnessPreflightError } from "./errors-Bd6GQRkh.js";
import { n as renderUserFacingText, r as sanitizeUserFacingText, t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-C09KOPqq.js";
import { T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, h as isReplyPayloadStatusNotice, s as getReplyPayloadMetadata, w as readReplyPayloadSourceOccurrence, x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-Ds4kei43.js";
import { B as isProviderAuthError } from "./loader-runtime-load-B2ergWe-.js";
import { i as shouldAttemptTtsPayload } from "./gateway-startup-speech-providers-YZhJ4xhW.js";
import { t as classifyFailoverReason } from "./classify-g_cTi4L9.js";
import { a as findCliTerminalStopError, i as describeFailoverError, o as findCliTimeoutError } from "./failover-error-D845uGox.js";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-DjGoA3IK.js";
import { a as hasOutboundReplyContent } from "./reply-payload-CPB05_Sy.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BsFA4sDv.js";
import { t as runAbortableTimeout } from "./with-timeout-CizoU_KI.js";
import "./embedded-agent-helpers-Cqdg7msJ.js";
import { v as RUN_STALE_TAKEOVER_MS } from "./diagnostic-run-activity-pyrECV9q.js";
import { g as resolveReplyDispatchErrorOutcome, o as prepareReplyPayloadForDispatcher, v as shouldRetryReplyDispatch } from "./reply-dispatcher-LuKlc50k.js";
import { et as beginReplyOperationFinalizationWork } from "./reply-run-registry.registry-HFAU31nF.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-Bn-3d1IG.js";
import { n as classifyCompactionReason } from "./compact-reasons-YKHfUYtS.js";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-wYoRaPUW.js";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-DesoaaBV.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/auto-reply/reply/reply-admission-ticket.ts
const REPLY_ADMISSION_TICKET = Symbol("testclaw.replyAdmissionTicket");
const replyAdmissionTickets = createKeyedFifoLeaseRegistry(Symbol.for("testclaw.replyAdmissionTickets"));
/** Briefly orders queue publication across a command's source and target sessions. */
function reserveReplyAdmissionTicket(sessionKeys) {
	return replyAdmissionTickets.reserve(normalizeStringifiedEntries(sessionKeys));
}
//#endregion
//#region src/auto-reply/reply/agent-runner-failure-reply.ts
function resolveReplyFailoverFacts(error, message) {
	const described = describeFailoverError(error);
	const rawError = described.rawError ?? message;
	const status = extractErrorHttpStatus(rawError)?.code ?? described.status;
	const reason = described.reason ?? classifyFailoverReason(rawError, { provider: described.provider });
	const classification = reason ? {
		kind: "reason",
		reason
	} : null;
	return {
		reason: classification?.kind === "reason" ? classification.reason : void 0,
		code: described.code,
		provider: described.provider,
		model: described.model,
		status,
		authMode: described.authMode,
		formatFailureText: reason === "format" ? renderFormatErrorCopy(rawError) : void 0,
		providerRequestError: resolveProviderRequestFailureCopy({
			classification,
			facet: classifyProviderRequestFacets({
				status,
				message: rawError
			}),
			status,
			technicalMessage: message
		})
	};
}
function readFallbackAttempts(error) {
	return isFailoverError(error) && Array.isArray(error.attempts) ? error.attempts : [];
}
function resolveReplyFailureSummary(params) {
	const attempts = params.attempts;
	let kind = params.reason;
	if (attempts?.length) {
		if (attempts.some((attempt) => attempt.reason === "billing")) kind = "billing";
		else if (attempts.every((attempt) => attempt.reason === "overloaded")) kind = "overloaded";
		else kind = attempts.every((attempt) => attempt.reason === "rate_limit" || attempt.reason === "overloaded") ? "rate_limit" : void 0;
	}
	if (kind !== "billing" && kind !== "rate_limit" && kind !== "overloaded") return;
	const failoverError = isFailoverError(params.error) ? params.error : void 0;
	const text = kind === "billing" ? renderBillingReplyCopy({
		attempts,
		provider: failoverError?.provider,
		model: failoverError?.model,
		authMode: failoverError?.authMode
	}) : kind === "overloaded" ? renderRateLimitOrOverloadedCopy({
		reason: kind,
		raw: params.message
	}) : renderRateLimitReplyCopy({
		message: params.message,
		reason: params.reason,
		attempts,
		provider: failoverError?.provider,
		cooldownExpiry: failoverError?.soonestCooldownExpiry,
		sanitizeText: (rawText) => sanitizeUserFacingText(rawText, { errorContext: true })
	});
	return {
		kind,
		text
	};
}
function collapseRepeatedFailureDetail(message) {
	const parts = message.split(/\s+\|\s+/u).map((part) => part.trim()).filter(Boolean);
	if (parts.length >= 2 && parts.every((part) => part === parts[0])) return expectDefined(parts[0], "parts entry at 0");
	return message.trim();
}
const EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS = 900;
const PREFLIGHT_COMPACTION_FAILURE_PREFIX = "Preflight compaction required but failed:";
function isNonDirectConversationContext(ctx) {
	const chatType = normalizeLowercaseStringOrEmpty(ctx.ChatType);
	return chatType === "group" || chatType === "channel";
}
function isVerboseFailureDetailEnabled(level) {
	return level === "on" || level === "full";
}
const CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE = /\bcodex app-server client closed before turn completed\b/iu;
const CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE = /\bcodex app-server turn idle timed out waiting for turn\/completed\b/iu;
const CODEX_SESSION_GENERATION_NOT_CURRENT_RE = /\bcodex session generation is no longer current\b/iu;
function buildCodexAppServerFailureText(message) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (CODEX_SESSION_GENERATION_NOT_CURRENT_RE.test(normalizedMessage)) return "⚠️ This Codex session changed before your message could run. Please send it again.";
	if (CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE.test(normalizedMessage)) return "⚠️ Codex app-server connection closed before this turn finished. Assistant retried once when the stdio turn was still replay-safe; please try again if this keeps happening.";
	if (CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE.test(normalizedMessage)) return "⚠️ Codex app-server stopped before confirming turn completion. Assistant did not replay the turn automatically because it may still be active; try again, or use /new if the session stays stuck.";
	return null;
}
/** Formats the reply shown when preflight compaction fails before a run. */
function buildPreflightCompactionFailureText(message, options) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (!normalizedMessage.startsWith(PREFLIGHT_COMPACTION_FAILURE_PREFIX)) return null;
	const reason = renderUserFacingText(normalizedMessage.slice(41), { errorContext: true }).trim().replace(/\s+/gu, " ");
	const isTimeout = classifyCompactionReason(reason) === "timeout";
	const reasonSuffix = options?.includeDetails && reason && !isTimeout ? ` Reason: ${reason}.` : "";
	return `${isTimeout ? "⚠️ Context is too large and auto-compaction timed out before it could finish." : "⚠️ Context is too large and auto-compaction could not recover this turn."}${reasonSuffix} Try again, use /compact, or use /new to start a fresh session.`;
}
function buildAuthProfileFailoverFailureText(error) {
	if (!isFailoverError(error) || !error.provider || !error.authProfileFailure) return null;
	return renderAuthProfileFailoverCopy({
		reason: error.reason,
		provider: error.provider,
		allInCooldown: error.authProfileFailure.allInCooldown,
		causeText: error.cause ? formatErrorMessage(error.cause).trim() : void 0,
		recoveryHint: buildProviderAuthRecoveryHint({ provider: error.provider })
	});
}
function resolveExternalRunFailureDetail(message) {
	const sanitized = message.trim().replace(/^⚠️\s*/u, "").replace(/\s+/gu, " ");
	return sanitized.length > EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS ? `${truncateUtf16Safe(sanitized, 899).trimEnd()}…` : sanitized || void 0;
}
function formatForwardedExternalRunFailureText(message) {
	const detail = resolveExternalRunFailureDetail(message);
	return detail ? `⚠️ Agent failed before reply: ${detail}${/[.!?]$/u.test(detail) ? "" : "."} Please try again, or use /new to start a fresh session.` : GENERIC_EXTERNAL_RUN_FAILURE_TEXT;
}
function hasLocalWorkerTimeoutCause(error) {
	let localTimeout = false;
	for (const candidate of collectErrorGraphCandidates(error, readErrorCauses)) {
		if (isFailoverError(candidate)) continue;
		const original = asOptionalObjectRecord(candidate);
		if (original?.status !== void 0 || original?.statusCode !== void 0) return false;
		localTimeout ||= readErrorName(candidate) === "WorkerTaskError" && extractErrorCode(candidate) === "timeout";
	}
	return localTimeout;
}
function buildExternalRunFailureReply(input, options) {
	const message = typeof input === "string" ? input : input.message;
	const error = typeof input === "string" ? void 0 : input.error;
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (isAgentHarnessPreflightError(error)) {
		const userMessage = renderAgentHarnessPreflightUserMessage(error);
		if (userMessage !== void 0) return {
			text: userMessage,
			isGenericRunnerFailure: false
		};
		const sanitizedMessage = sanitizeUserFacingText(normalizedMessage, { errorContext: true });
		return {
			text: options?.isHeartbeat ? renderHeartbeatRunFailureCopy(resolveExternalRunFailureDetail(sanitizedMessage)) : options?.includeDetails ? formatForwardedExternalRunFailureText(sanitizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isGenericRunnerFailure: !options?.isHeartbeat
		};
	}
	const failoverFacts = options?.failoverFacts ?? resolveReplyFailoverFacts(error ?? normalizedMessage, normalizedMessage);
	const failoverCodeCopy = renderFailoverCodeUserCopy(failoverFacts.code);
	if (failoverCodeCopy) return {
		text: failoverCodeCopy,
		isGenericRunnerFailure: false
	};
	const oauthRefreshFailure = classifyOAuthRefreshFailureError(error) ?? classifyOAuthRefreshFailure(normalizedMessage);
	const providerLoginRecovery = buildProviderLoginRecovery({
		provider: oauthRefreshFailure ? oauthRefreshFailure.provider ?? void 0 : failoverFacts.provider,
		oauthReason: oauthRefreshFailure?.reason,
		failoverReason: failoverFacts.reason,
		authMode: failoverFacts.authMode
	});
	if (oauthRefreshFailure) {
		const loginCommand = buildOAuthRefreshFailureLoginCommand(oauthRefreshFailure.provider, { profileId: options?.includeAuthProfileId ? oauthRefreshFailure.profileId : void 0 });
		const loginCommandMarkdown = formatOAuthRefreshFailureLoginCommandMarkdown(loginCommand);
		const providerText = oauthRefreshFailure.provider ? ` for ${oauthRefreshFailure.provider}` : "";
		const retryLoginHint = providerLoginRecovery ? "send `/login` from a private chat or Control UI session to choose a provider, or re-auth" : "re-auth";
		if (oauthRefreshFailure.reason) return {
			text: providerLoginRecovery ? `⚠️ ${providerLoginRecovery.hint} You can also re-auth with ${loginCommandMarkdown} on the gateway.` : `⚠️ Model login expired on the gateway${providerText}. Re-auth with ${loginCommandMarkdown} in a terminal, then try again.`,
			...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
			isGenericRunnerFailure: false
		};
		return {
			text: `⚠️ Model login failed on the gateway${providerText}. Please try again. If this keeps happening, ${retryLoginHint} with ${loginCommandMarkdown} in a terminal.`,
			isGenericRunnerFailure: false
		};
	}
	const authProfileFailoverFailure = buildAuthProfileFailoverFailureText(error);
	if (authProfileFailoverFailure) return {
		text: providerLoginRecovery ? `${providerLoginRecovery.hint}\n\n${authProfileFailoverFailure}` : authProfileFailoverFailure,
		...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
		isGenericRunnerFailure: false
	};
	const cliTerminalStopError = findCliTerminalStopError(error);
	if (cliTerminalStopError) return {
		text: renderUserFacingText(cliTerminalStopError.message, { errorContext: true }),
		isGenericRunnerFailure: false
	};
	const cliTimeoutError = findCliTimeoutError(error);
	const cliBackendTimeoutFailure = renderCliTimeoutReplyCopy({
		message: normalizedMessage,
		cliTimeout: cliTimeoutError?.cliTimeout,
		provider: cliTimeoutError?.provider,
		replayPrevented: options?.replayPrevented
	});
	if (cliBackendTimeoutFailure) return {
		text: cliBackendTimeoutFailure,
		isGenericRunnerFailure: false
	};
	const providerRequestError = failoverFacts.providerRequestError;
	if (providerRequestError) return {
		text: providerRequestError.userMessage,
		isGenericRunnerFailure: false
	};
	const authError = isProviderAuthError(error) ? error : void 0;
	const missingApiKeyFailure = renderMissingApiKeyReplyCopy(authError ? {
		provider: authError.provider,
		providerGuidance: authError.providerGuidance
	} : void 0);
	if (missingApiKeyFailure) return {
		text: missingApiKeyFailure,
		isGenericRunnerFailure: false
	};
	if (options?.isHeartbeat) {
		const detail = options.includeDetails ? resolveExternalRunFailureDetail(sanitizeUserFacingText(normalizedMessage, { errorContext: true })) : void 0;
		return {
			text: renderHeartbeatRunFailureCopy(detail),
			isGenericRunnerFailure: false
		};
	}
	const codexAppServerFailure = buildCodexAppServerFailureText(normalizedMessage);
	if (codexAppServerFailure) return {
		text: codexAppServerFailure,
		isGenericRunnerFailure: false
	};
	if (failoverFacts.reason === "timeout" && hasLocalWorkerTimeoutCause(error)) return {
		text: "A local worker task timed out. Please try again.",
		isGenericRunnerFailure: false
	};
	const classifiedFailure = failoverFacts.formatFailureText ?? renderAssistantRequestFailureCopy(failoverFacts);
	if (classifiedFailure) return {
		text: classifiedFailure,
		isGenericRunnerFailure: false
	};
	return {
		text: options?.includeDetails ? formatForwardedExternalRunFailureText(renderUserFacingText(normalizedMessage, { errorContext: true })) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: true
	};
}
function markAgentRunFailureReplyPayload(payload) {
	const marked = markReplyPayloadForSourceSuppressionDelivery(payload);
	if (!isSilentReplyText(marked.text, "NO_REPLY")) marked.isError = true;
	return marked;
}
function markPostCompactionModelFailurePayload(postCompactionModelFailure, payload) {
	return postCompactionModelFailure === true && payload.isError === true && isReplyPayloadTerminalContent(payload) && typeof payload.text === "string" ? setReplyPayloadMetadata(payload, { postCompactionModelFailure: true }) : payload;
}
function renderPostCompactionModelFailurePayload(payload) {
	return getReplyPayloadMetadata(payload)?.postCompactionModelFailure === true && typeof payload.text === "string" ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: `⚠️ Context compaction succeeded, but the later model request still failed. ${payload.text.replace(/^⚠️\s*/u, "")}`
	}) : payload;
}
/** Optional silence hides generic boilerplate, not guidance or the outcome of visible work. */
function resolveAgentRunFailureText(params) {
	return params.replyExpectation === "optional" && params.isGenericRunnerFailure && !params.visibleReplyDelivered ? SILENT_REPLY_TOKEN : params.text;
}
function buildTerminalAgentRunFailureReplyPayload(params) {
	return markAgentRunFailureReplyPayload({ text: resolveAgentRunFailureText({
		...params,
		text: params.isHeartbeat ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: !params.isHeartbeat
	}) });
}
function buildEmptyInteractiveReplyPayload(params) {
	if (params.completion.outcome !== "missing") return;
	return markAgentRunFailureReplyPayload({ text: "I finished the turn, but it did not produce a visible reply. Please try again, or start a new session if this keeps happening." });
}
/** Converts known agent-run failures into user-facing reply payloads. */
function buildKnownAgentRunFailureReplyPayload(params) {
	if (isAgentHarnessPreflightError(params.err)) {
		const reply = buildExternalRunFailureReply({
			message: params.err.message,
			error: params.err
		});
		return reply.isGenericRunnerFailure ? void 0 : markAgentRunFailureReplyPayload({ text: reply.text });
	}
	const message = formatErrorMessage(params.err);
	const failoverFacts = resolveReplyFailoverFacts(params.err, message);
	const failureSummary = resolveReplyFailureSummary({
		error: params.err,
		message,
		reason: failoverFacts.reason,
		attempts: readFallbackAttempts(params.err)
	});
	const knownFailureText = failureSummary?.kind === "billing" ? failureSummary.text : buildPreflightCompactionFailureText(message, { includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) }) ?? failureSummary?.text;
	const externalRunFailureReply = knownFailureText ? {
		text: knownFailureText,
		isGenericRunnerFailure: false
	} : buildExternalRunFailureReply({
		message,
		error: params.err
	}, {
		includeAuthProfileId: !isNonDirectConversationContext(params.sessionCtx),
		includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel),
		failoverFacts
	});
	if (externalRunFailureReply.isGenericRunnerFailure) return;
	return markAgentRunFailureReplyPayload({
		text: externalRunFailureReply.text,
		...externalRunFailureReply.presentation ? { presentation: externalRunFailureReply.presentation } : {}
	});
}
//#endregion
//#region src/auto-reply/reply/block-reply-delivery.ts
function hasBlockReplyDeliveryCustody(delivery) {
	return delivery.pending === true || delivery.outcome !== "delivered" && !shouldRetryReplyDispatch(delivery.outcome);
}
const deliveries = new AsyncLocalStorage();
function setBlockReplyDelivery(delivery, payload) {
	const context = deliveries.getStore();
	if (context) {
		context.settlement = delivery;
		context.payload = payload;
	}
}
function createBlockReplySource() {
	const fragments = [];
	let parserComplete = true;
	let pendingRuns = 0;
	let lastDelivery;
	let sequence = Promise.resolve();
	const isDelivered = (delivery) => delivery.outcome === "delivered" && !delivery.pending;
	const source = {
		get complete() {
			return parserComplete && pendingRuns === 0 && (!lastDelivery || isDelivered(lastDelivery));
		},
		get pending() {
			return pendingRuns > 0 || lastDelivery !== void 0 && hasBlockReplyDeliveryCustody(lastDelivery);
		},
		setComplete(complete) {
			parserComplete = complete;
		},
		run(send) {
			const outer = deliveries.getStore();
			if (outer) outer.source = source;
			pendingRuns++;
			let delivery = { outcome: "cancelled" };
			const context = {};
			const operation = sequence.then(() => {
				if (lastDelivery && !isDelivered(lastDelivery)) {
					delivery = lastDelivery;
					return;
				}
				return deliveries.run(context, send);
			});
			const settlement = operation.then(() => context.settlement ?? delivery).then((receipt) => {
				if (context.payload) {
					fragments.push({
						payload: context.payload,
						delivery: receipt
					});
					lastDelivery = receipt;
				}
				return receipt;
			}, (error) => {
				lastDelivery = { outcome: resolveReplyDispatchErrorOutcome(error) };
				return lastDelivery;
			}).finally(() => {
				pendingRuns--;
			});
			sequence = settlement.then(() => void 0);
			if (outer) outer.settlement = settlement;
			return operation;
		},
		settle: () => sequence.then(() => lastDelivery ?? { outcome: "delivered" }),
		recoverPartial(payload) {
			let text = payload.text;
			for (const fragment of fragments) {
				if (!isDelivered(fragment.delivery)) break;
				const prefix = fragment.payload.text?.trimStart();
				if (!prefix) continue;
				const remaining = text?.trimStart();
				if (!remaining?.startsWith(prefix)) break;
				text = remaining.slice(prefix.length);
			}
			return copyReplyPayloadMetadata(payload, {
				...payload,
				text: text || void 0
			});
		}
	};
	return source;
}
async function recoverBlockReplySources(payload, sources) {
	const receipts = await Promise.all(sources.map((source) => source.settle()));
	const delivery = sources.every((source) => source.complete) ? { outcome: "delivered" } : receipts.find(hasBlockReplyDeliveryCustody) ?? (sources.some((source) => source.pending) ? {
		outcome: "delivered-not-visible",
		pending: true
	} : void 0);
	if (delivery) return {
		payload: copyReplyPayloadMetadata(payload, {
			...payload,
			text: void 0
		}),
		delivery
	};
	return { payload: sources.reduce((remaining, source) => source.recoverPartial(remaining), payload) };
}
async function deliverBlockReply(send) {
	const context = {};
	await deliveries.run(context, send);
	const delivery = await context.settlement ?? { outcome: "delivered" };
	return context.source ? {
		...delivery,
		source: context.source
	} : delivery;
}
//#endregion
//#region src/auto-reply/reply/block-reply-coalescer.ts
/** Creates a text coalescer with idle and size-based flush behavior. */
function createBlockReplyCoalescer(params) {
	const { config, shouldAbort, onFlush } = params;
	const minChars = Math.max(1, Math.floor(config.minChars));
	const maxChars = Math.max(minChars, Math.floor(config.maxChars));
	const idleMs = Math.max(0, Math.floor(config.idleMs));
	const joiner = config.joiner ?? "";
	const flushOnEnqueue = config.flushOnEnqueue === true;
	let bufferText = "";
	let bufferSourceText;
	let bufferSourceRange;
	let bufferedPayload;
	let idleTimer;
	const clearIdleTimer = () => {
		if (!idleTimer) return;
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const resetBuffer = () => {
		bufferText = "";
		bufferSourceText = void 0;
		bufferSourceRange = void 0;
		bufferedPayload = void 0;
	};
	const scheduleIdleFlush = () => {
		if (idleMs <= 0) return;
		clearIdleTimer();
		idleTimer = setTimeout(() => {
			flush({ force: false });
		}, idleMs);
	};
	const flush = async (options) => {
		clearIdleTimer();
		if (shouldAbort()) {
			resetBuffer();
			return;
		}
		if (!bufferText || !bufferedPayload) return;
		if (!options?.force && !flushOnEnqueue && bufferText.length < minChars) {
			scheduleIdleFlush();
			return;
		}
		const payload = setReplyPayloadMetadata(copyReplyPayloadMetadata(bufferedPayload, {
			...bufferedPayload,
			text: bufferText
		}), {
			blockSourceText: bufferSourceText,
			blockSourceRange: bufferSourceRange
		});
		resetBuffer();
		await onFlush(payload);
	};
	const canMergeBufferedTextWithMedia = (payload) => Boolean(bufferText) && bufferedPayload !== void 0 && !flushOnEnqueue && !bufferedPayload.audioAsVoice && !payload.audioAsVoice && !payload.isReasoning && !payload.isCommentary && !isReplyPayloadStatusNotice(payload) && !bufferedPayload.isReasoning && !bufferedPayload.isCommentary && !isReplyPayloadStatusNotice(bufferedPayload) && (!payload.replyToId || bufferedPayload.replyToId === payload.replyToId);
	/** Merges buffered text into a media payload without changing media metadata. */
	const mergeBufferedTextWithMedia = (payload, text) => {
		const mergedText = text ? `${bufferText}${joiner}${text}` : bufferText;
		const sourceText = text ? getReplyPayloadMetadata(payload)?.blockSourceText : void 0;
		const sourceRange = text ? getReplyPayloadMetadata(payload)?.blockSourceRange : void 0;
		const mergedSourceText = bufferSourceText !== void 0 || sourceText !== void 0 ? (bufferSourceText ?? bufferText) + (sourceText ?? text) : void 0;
		const mergedSourceRange = bufferSourceRange && sourceRange ? [bufferSourceRange[0], sourceRange[1]] : bufferSourceRange ?? sourceRange;
		const mergedPayload = {
			...bufferedPayload,
			...payload,
			text: mergedText,
			replyToId: payload.replyToId ?? bufferedPayload?.replyToId,
			replyToCurrent: payload.replyToCurrent || bufferedPayload?.replyToCurrent,
			replyToTag: payload.replyToTag || bufferedPayload?.replyToTag
		};
		const metadataMergedPayload = copyReplyPayloadMetadata(bufferedPayload ?? mergedPayload, mergedPayload);
		resetBuffer();
		return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, metadataMergedPayload), {
			blockSourceText: mergedSourceText,
			blockSourceRange: mergedSourceRange
		});
	};
	const enqueue = (payload) => {
		if (shouldAbort()) return;
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasMedia = reply.hasMedia;
		const text = reply.text;
		const sourceText = getReplyPayloadMetadata(payload)?.blockSourceText;
		const sourceRange = getReplyPayloadMetadata(payload)?.blockSourceRange;
		const hasText = reply.hasText;
		if (hasMedia) {
			if (canMergeBufferedTextWithMedia(payload)) {
				onFlush(mergeBufferedTextWithMedia(payload, text));
				return;
			}
			flush({ force: true });
			onFlush(payload);
			return;
		}
		if (!hasText) return;
		if (flushOnEnqueue) {
			if (bufferText) flush({ force: true });
			bufferedPayload = payload;
			bufferText = text;
			bufferSourceText = sourceText;
			bufferSourceRange = sourceRange;
			flush({ force: true });
			return;
		}
		const replyToConflict = Boolean(bufferText && payload.replyToId && (!bufferedPayload?.replyToId || bufferedPayload.replyToId !== payload.replyToId));
		const visibilityConflict = bufferText && bufferedPayload && (bufferedPayload.isReasoning !== payload.isReasoning || bufferedPayload.isCommentary !== payload.isCommentary || bufferedPayload.isCompactionNotice !== payload.isCompactionNotice || bufferedPayload.isFallbackNotice !== payload.isFallbackNotice || isReplyPayloadStatusNotice(bufferedPayload) !== isReplyPayloadStatusNotice(payload));
		if (bufferText && (replyToConflict || bufferedPayload?.audioAsVoice !== payload.audioAsVoice || visibilityConflict)) flush({ force: true });
		if (!bufferText) bufferedPayload = payload;
		const nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
		if (nextText.length > maxChars) {
			if (bufferText) {
				flush({ force: true });
				bufferedPayload = payload;
				if (text.length >= maxChars) {
					onFlush(payload);
					return;
				}
				bufferText = text;
				bufferSourceText = sourceText;
				bufferSourceRange = sourceRange;
				scheduleIdleFlush();
				return;
			}
			onFlush(payload);
			return;
		}
		bufferSourceText = bufferSourceText !== void 0 || sourceText !== void 0 ? (bufferSourceText ?? bufferText) + (sourceText ?? text) : void 0;
		bufferSourceRange = bufferSourceRange && sourceRange ? [bufferSourceRange[0], sourceRange[1]] : bufferSourceRange ?? sourceRange;
		bufferText = nextText;
		if (bufferText.length >= maxChars) {
			flush({ force: true });
			return;
		}
		scheduleIdleFlush();
	};
	return {
		enqueue,
		flush,
		hasBuffered: () => Boolean(bufferText),
		stop: () => clearIdleTimer()
	};
}
//#endregion
//#region src/auto-reply/reply/block-reply-pipeline.ts
/** Buffers audio payloads so final delivery can preserve voice presentation. */
function createAudioAsVoiceBuffer(params) {
	let seenAudioAsVoice = false;
	return {
		onEnqueue: (payload) => {
			if (payload.audioAsVoice) seenAudioAsVoice = true;
		},
		shouldBuffer: (payload) => params.isAudioPayload(payload),
		finalize: (payload) => seenAudioAsVoice ? copyReplyPayloadMetadata(payload, {
			...payload,
			audioAsVoice: true
		}) : payload
	};
}
function createBlockReplyContentIdentity(payload) {
	const reply = resolveSendableOutboundReplyParts(payload);
	return {
		text: reply.trimmedText,
		mediaList: reply.mediaUrls,
		presentation: payload.presentation ?? null,
		presentationTextMode: payload.presentationTextMode ?? null,
		interactive: payload.interactive ?? null,
		channelData: payload.channelData ?? null,
		location: payload.location ?? null,
		videoAsNote: payload.videoAsNote === true
	};
}
/** Creates a stable duplicate key for a complete outbound payload. */
function createBlockReplyPayloadKey(payload) {
	return JSON.stringify({
		...createBlockReplyContentIdentity(payload),
		statusNotice: isReplyPayloadStatusNotice(payload),
		reasoning: payload.isReasoning === true,
		commentary: payload.isCommentary === true,
		assistantMessageIndex: getReplyPayloadMetadata(payload)?.assistantMessageIndex ?? null,
		replyToId: payload.replyToId ?? null
	});
}
/** Creates a duplicate key that ignores reply target for final suppression. */
function createBlockReplyContentKey(payload) {
	return JSON.stringify(createBlockReplyContentIdentity(payload));
}
function createIndexedBlockReplyContentKey(payload) {
	const contentKey = createBlockReplyContentKey(payload);
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	return assistantMessageIndex === void 0 ? contentKey : `${assistantMessageIndex}:${contentKey}`;
}
function resolveBlockReplyTimeoutMs(timeoutMs) {
	return clampPositiveTimerTimeoutMs(timeoutMs) ?? 0;
}
/** Creates the ordered block reply delivery pipeline for streamed payloads. */
function createBlockReplyPipeline(params) {
	const { onBlockReply, coalescing, buffer } = params;
	const timeoutMs = resolveBlockReplyTimeoutMs(params.timeoutMs);
	const sentKeys = /* @__PURE__ */ new Set();
	const sentContentKeys = /* @__PURE__ */ new Set();
	const sentMediaUrls = /* @__PURE__ */ new Set();
	const pendingKeys = /* @__PURE__ */ new Set();
	const seenKeys = /* @__PURE__ */ new Set();
	const bufferedPayloads = [];
	const blockAttemptsByMessage = /* @__PURE__ */ new Map();
	let bufferedAssistantMessageIndex;
	let sendChain = Promise.resolve();
	let aborted = false;
	let didStream = false;
	let didLogTimeout = false;
	const hasSeenOrQueuedPayloadKey = (payloadKey) => seenKeys.has(payloadKey) || sentKeys.has(payloadKey) || pendingKeys.has(payloadKey);
	const sourceOccurrenceKey = (payload) => {
		const occurrence = readReplyPayloadSourceOccurrence(payload);
		return occurrence ? JSON.stringify([
			occurrence.assistantMessageIndex,
			occurrence.sourceRange[0],
			occurrence.sourceRange[1],
			occurrence.sourceText
		]) : void 0;
	};
	const flushBufferedAssistantBlock = () => {
		bufferedAssistantMessageIndex = void 0;
		coalescer?.flush({ force: true });
	};
	const sendPayload = (payload, bypassSeenCheck = false) => {
		if (aborted) return;
		const payloadKey = createBlockReplyPayloadKey(payload);
		const contentKey = createBlockReplyContentKey(payload);
		const blockSourceText = getReplyPayloadMetadata(payload)?.blockSourceText;
		const occurrenceKey = sourceOccurrenceKey(payload);
		const dedupeKey = occurrenceKey ?? payloadKey;
		const carriesUnkeyedDistinctSource = blockSourceText !== void 0 && occurrenceKey === void 0;
		if (!bypassSeenCheck && !carriesUnkeyedDistinctSource) {
			if (seenKeys.has(dedupeKey)) return;
			seenKeys.add(dedupeKey);
		}
		if (occurrenceKey) seenKeys.add(payloadKey);
		if (!carriesUnkeyedDistinctSource && (sentKeys.has(dedupeKey) || pendingKeys.has(dedupeKey))) return;
		pendingKeys.add(dedupeKey);
		const isTerminalContent = isReplyPayloadTerminalContent(payload);
		const reply = resolveSendableOutboundReplyParts(payload);
		const attempt = {
			outcome: "cancelled",
			sourceText: blockSourceText ?? reply.trimmedText,
			contentKey,
			mediaUrls: reply.mediaUrls,
			terminal: isTerminalContent && hasOutboundReplyContent(payload, { trimText: true })
		};
		const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		const attempts = blockAttemptsByMessage.get(index) ?? [];
		attempts.push(attempt);
		blockAttemptsByMessage.set(index, attempts);
		const fallbackAbortController = new AbortController();
		let timeoutSignal;
		sendChain = sendChain.then(async () => {
			if (aborted) return false;
			attempt.outcome = "failed-deliver";
			attempt.pending = true;
			return await runAbortableTimeout(async (signal) => {
				timeoutSignal = signal;
				return await deliverBlockReply(() => onBlockReply(payload, {
					abortSignal: signal ?? fallbackAbortController.signal,
					timeoutMs
				}));
			}, timeoutMs || void 0, "block reply delivery");
		}).then((delivery) => {
			if (!delivery) return;
			Object.assign(attempt, delivery, { pending: delivery.pending === true });
			const isStatusNotice = isReplyPayloadStatusNotice(payload);
			if (delivery.outcome !== "delivered" || delivery.pending) return;
			if (delivery.source?.complete !== false) sentKeys.add(dedupeKey);
			if (isTerminalContent && delivery.source?.complete !== false) {
				if (attempt.terminal) attempt.terminalDeliveryConfirmed = true;
				sentContentKeys.add(contentKey);
				sentContentKeys.add(createIndexedBlockReplyContentKey(payload));
			}
			for (const mediaUrl of reply.mediaUrls) sentMediaUrls.add(mediaUrl);
			if (!isStatusNotice) didStream = true;
		}).catch((err) => {
			if (timeoutSignal?.aborted) {
				aborted = true;
				if (!didLogTimeout) {
					didLogTimeout = true;
					logVerbose(`block reply delivery timed out after ${timeoutMs}ms; skipping remaining block replies to preserve ordering`);
				}
				return;
			}
			attempt.outcome = resolveReplyDispatchErrorOutcome(err);
			attempt.pending = false;
			logVerbose(`block reply delivery failed: ${String(err)}`);
		}).finally(() => {
			pendingKeys.delete(dedupeKey);
		});
	};
	const coalescer = coalescing ? createBlockReplyCoalescer({
		config: coalescing,
		shouldAbort: () => aborted,
		onFlush: (payload) => {
			bufferedAssistantMessageIndex = void 0;
			sendPayload(payload, true);
		}
	}) : null;
	const bufferPayload = (payload) => {
		buffer?.onEnqueue?.(payload);
		if (!buffer?.shouldBuffer(payload)) return false;
		const payloadKey = createBlockReplyPayloadKey(payload);
		if (hasSeenOrQueuedPayloadKey(payloadKey)) return true;
		seenKeys.add(payloadKey);
		bufferedPayloads.push(payload);
		return true;
	};
	const flushBuffered = () => {
		if (!bufferedPayloads.length) return;
		for (const payload of bufferedPayloads) {
			const finalPayload = buffer?.finalize?.(payload) ?? payload;
			sendPayload(finalPayload, true);
		}
		bufferedPayloads.length = 0;
	};
	const enqueueCoalescedPayload = (payload) => {
		if (!coalescer) return;
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		if (assistantMessageIndex !== void 0 && bufferedAssistantMessageIndex !== void 0 && assistantMessageIndex !== bufferedAssistantMessageIndex && coalescer.hasBuffered()) flushBufferedAssistantBlock();
		const payloadKey = createBlockReplyPayloadKey(payload);
		const occurrenceKey = sourceOccurrenceKey(payload);
		const carriesUnkeyedDistinctSource = getReplyPayloadMetadata(payload)?.blockSourceText !== void 0 && occurrenceKey === void 0;
		const dedupeKey = occurrenceKey ?? payloadKey;
		if (!carriesUnkeyedDistinctSource && hasSeenOrQueuedPayloadKey(dedupeKey)) return;
		if (!carriesUnkeyedDistinctSource) seenKeys.add(dedupeKey);
		if (occurrenceKey) seenKeys.add(payloadKey);
		bufferedAssistantMessageIndex = assistantMessageIndex;
		coalescer.enqueue(payload);
	};
	const enqueue = (payload) => {
		if (aborted) return;
		if (bufferPayload(payload)) {
			flushBufferedAssistantBlock();
			return;
		}
		flushBuffered();
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasNonTextContent = hasOutboundReplyContent({
			...payload,
			text: void 0,
			mediaUrl: void 0,
			mediaUrls: void 0
		}, { trimText: true });
		if (reply.hasMedia && coalescer && !hasNonTextContent) {
			enqueueCoalescedPayload(payload);
			return;
		}
		if (reply.hasMedia || hasNonTextContent) {
			coalescer?.flush({ force: true });
			sendPayload(payload, false);
			return;
		}
		if (coalescer) {
			enqueueCoalescedPayload(payload);
			return;
		}
		sendPayload(payload, false);
	};
	const flush = async (options) => {
		await coalescer?.flush(options);
		bufferedAssistantMessageIndex = void 0;
		flushBuffered();
		await sendChain;
	};
	const stop = () => {
		coalescer?.stop();
	};
	const matchingAttempts = (payload) => {
		const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		return index === void 0 ? blockAttemptsByMessage.values() : [blockAttemptsByMessage.get(index) ?? []];
	};
	const normalizeSource = (text) => text.replace(/\s+/g, "");
	const matchesSource = (payload, attempts) => {
		const reply = resolveSendableOutboundReplyParts(payload);
		return !reply.hasMedia && Boolean(reply.trimmedText) && attempts.length > 0 && normalizeSource(attempts.map((attempt) => attempt.sourceText).join("")) === normalizeSource(reply.trimmedText);
	};
	return {
		enqueue,
		flush,
		stop,
		hasBuffered: () => coalescer?.hasBuffered() || bufferedPayloads.length > 0,
		didStream: () => didStream,
		didStreamTerminalReply: (minimumAssistantMessageIndex = 0) => {
			for (const [index, attempts] of blockAttemptsByMessage) if ((index ?? 0) >= minimumAssistantMessageIndex && attempts.some((attempt) => attempt.terminalDeliveryConfirmed === true)) return true;
			return false;
		},
		isAborted: () => aborted,
		hasSentExactPayload: (payload) => sentContentKeys.has(createIndexedBlockReplyContentKey(payload)),
		getSourceRecovery: (payload) => {
			const text = normalizeSource(resolveSendableOutboundReplyParts(payload).trimmedText);
			for (const group of matchingAttempts(payload)) {
				const attempts = group.filter((attempt) => attempt.terminal);
				if (text && normalizeSource(attempts.map((attempt) => attempt.sourceText).join("")) === text && attempts.some((attempt) => attempt.source?.complete === false)) return Array.from(new Set(attempts.flatMap((attempt) => attempt.source ?? [])));
			}
		},
		isFinalPayloadRetryBlocked: (payload) => {
			const contentKey = createBlockReplyContentKey(payload);
			const reply = resolveSendableOutboundReplyParts(payload);
			const text = normalizeSource(reply.trimmedText);
			const textOnly = !hasOutboundReplyContent({
				...payload,
				text: void 0
			});
			for (const group of matchingAttempts(payload)) {
				const attempts = group.filter((attempt) => attempt.terminal);
				const blocked = attempts.filter(hasBlockReplyDeliveryCustody);
				const sourcePrefix = normalizeSource(attempts.map((attempt) => attempt.sourceText).join(""));
				if (blocked.some((attempt) => attempt.contentKey === contentKey) || textOnly && blocked.length > 0 && sourcePrefix.length > 0 && text.startsWith(sourcePrefix)) return true;
			}
			return false;
		},
		hasSentPayload: (payload) => {
			const payloadKey = createIndexedBlockReplyContentKey(payload);
			if (sentContentKeys.has(payloadKey)) return true;
			if (!didStream) return false;
			for (const attempts of matchingAttempts(payload)) if (matchesSource(payload, attempts.filter((attempt) => attempt.terminal && attempt.outcome === "delivered" && !attempt.pending && attempt.source?.complete !== false))) return true;
			return false;
		},
		getSentMediaUrls: () => Array.from(sentMediaUrls),
		hasRetryBlockedDelivery: () => Array.from(blockAttemptsByMessage.values()).some((attempts) => attempts.some(hasBlockReplyDeliveryCustody)),
		hasRetryBlockedTerminalDelivery: (minimumAssistantMessageIndex = 0) => {
			for (const [index, attempts] of blockAttemptsByMessage) if ((index ?? 0) >= minimumAssistantMessageIndex && attempts.some((attempt) => attempt.terminal && hasBlockReplyDeliveryCustody(attempt))) return true;
			return false;
		},
		getRetryBlockedMediaUrls: () => Array.from(new Set(Array.from(blockAttemptsByMessage.values()).flatMap((attempts) => attempts.filter(hasBlockReplyDeliveryCustody).flatMap((attempt) => attempt.mediaUrls))))
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.payloads.ts
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime-CMfWJg8P.js"));
const NO_VISIBLE_REPLY_FALLBACK_TEXT = "⚠️ Assistant couldn't produce or deliver a reply. Please try again. If this keeps happening, ask the operator to check the gateway logs.";
function buildNoVisibleReplyFallbackText(runId) {
	const reference = normalizeOptionalString(runId);
	return reference && /^[a-z0-9][a-z0-9_-]{0,127}$/iu.test(reference) ? `${NO_VISIBLE_REPLY_FALLBACK_TEXT} Reference: ${reference}.` : NO_VISIBLE_REPLY_FALLBACK_TEXT;
}
const QUEUE_CAP_REJECTION_TEXT = "This message was not queued because the session queue is full. Please try again after the current response finishes.";
function shouldDeliverDespiteSourceReplySuppression(payload, state) {
	return state.suppressAutomaticSourceDelivery && !state.sendPolicyDenied && getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true && (state.ctx.InboundEventKind !== "room_event" || state.explicitCommandTurnCtx);
}
function hasExecApprovalPayload(payload) {
	return isRecord(payload.channelData?.execApproval);
}
function hasExecApprovalUnavailablePayload(payload) {
	return isRecord(payload.channelData?.execApprovalUnavailable);
}
function hasAskUserPayload(payload) {
	return isRecord(payload.channelData?.askUser);
}
function requiresDurableToolResultDelivery(payload) {
	return resolveSendableOutboundReplyParts(payload).hasMedia || hasExecApprovalPayload(payload) || hasExecApprovalUnavailablePayload(payload) || hasAskUserPayload(payload);
}
function createFinalDispatchPayloadDedupeKey(payload) {
	const metadata = getReplyPayloadMetadata(payload);
	return JSON.stringify({
		payload: {
			text: payload.text,
			mediaUrl: payload.mediaUrl,
			mediaUrls: payload.mediaUrls,
			trustedLocalMedia: payload.trustedLocalMedia,
			sensitiveMedia: payload.sensitiveMedia,
			presentation: payload.presentation,
			presentationTextMode: payload.presentationTextMode,
			delivery: payload.delivery,
			interactive: payload.interactive,
			btw: payload.btw,
			replyToId: payload.replyToId,
			replyToTag: payload.replyToTag,
			replyToCurrent: payload.replyToCurrent,
			audioAsVoice: payload.audioAsVoice,
			videoAsNote: payload.videoAsNote === true,
			location: payload.location,
			spokenText: payload.spokenText,
			ttsSupplement: payload.ttsSupplement,
			isError: payload.isError,
			isReasoning: payload.isReasoning,
			isCommentary: payload.isCommentary,
			isReasoningSnapshot: payload.isReasoningSnapshot,
			isCompactionNotice: payload.isCompactionNotice,
			isFallbackNotice: payload.isFallbackNotice,
			isStatusNotice: payload.isStatusNotice,
			channelData: payload.channelData
		},
		identity: {
			assistantMessageIndex: metadata?.assistantMessageIndex,
			assistantTranscriptOwned: metadata?.assistantTranscriptOwned,
			replyToIdExplicit: metadata?.replyToIdExplicit,
			replyDelivery: metadata?.replyDelivery,
			replyDeliverySource: metadata?.replyDeliverySource,
			sourceReplyTranscriptMirror: metadata?.sourceReplyTranscriptMirror
		}
	});
}
function formatSuppressedReplyPayloadForLog(reply) {
	const metadata = getReplyPayloadMetadata(reply);
	const text = normalizeOptionalString(reply.text);
	const textPreview = text ? truncateUtf16Safe(text.replace(/\s+/g, " "), 160) : void 0;
	const sendableParts = resolveSendableOutboundReplyParts(reply);
	const richParts = [
		reply.presentation ? "presentation" : void 0,
		reply.interactive ? "interactive" : void 0,
		reply.channelData ? "channelData" : void 0
	].filter(Boolean);
	return [
		`textChars=${text?.length ?? 0}`,
		`media=${sendableParts.mediaCount}`,
		`rich=${richParts.length ? richParts.join("|") : "none"}`,
		`error=${reply.isError === true}`,
		`beforeAgentRunBlocked=${metadata?.beforeAgentRunBlocked === true}`,
		`deliverDespiteSuppression=${metadata?.deliverDespiteSourceReplySuppression === true}`,
		textPreview ? `textPreview=${JSON.stringify(textPreview)}` : void 0
	].filter(Boolean).join(" ");
}
async function maybeApplyTtsToReplyPayload(params) {
	if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	const ttsPayload = await maybeApplyTtsToPayload(params);
	return ttsPayload === params.payload ? ttsPayload : copyReplyPayloadMetadata(params.payload, ttsPayload);
}
function createFinalizationAwareTtsPayloadApplier(params) {
	return async (ttsParams) => {
		const replyOperation = params.getReplyOperation();
		const finishFinalizationWork = replyOperation ? beginReplyOperationFinalizationWork(replyOperation, RUN_STALE_TAKEOVER_MS) : void 0;
		try {
			return await maybeApplyTtsToReplyPayload({
				...ttsParams,
				inboundAudio: params.hasInboundAudio()
			});
		} finally {
			finishFinalizationWork?.();
			replyOperation?.recordActivity();
		}
	};
}
/** Applies dispatcher normalization before TTS or transcript-visible side effects. */
function prepareReplyPayloadForSideEffects(dispatcher, kind, payload, state, onVisibleAccepted) {
	if (!payload) return null;
	const outcome = prepareReplyPayloadForDispatcher(dispatcher, kind, payload);
	if (outcome.kind === "deliver") {
		state.acceptedReplyPayload = true;
		if (outcome.payload.isReasoning !== true && outcome.payload.isCommentary !== true && hasOutboundReplyContent(outcome.payload, { trimText: true })) onVisibleAccepted?.();
		return outcome.payload;
	}
	state.channelTransformSuppressed ||= outcome.reason === "channel_transform";
	return null;
}
//#endregion
//#region src/auto-reply/reply/restart-recovery-claim.ts
/** Provider redelivery guard shared by ingress and the agent admission boundary. */
function isDuplicateRestartRecoverySource(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return Boolean(normalizedSourceTurnId && (hasRestartRecoveryTerminalRun(entry ?? void 0, normalizedSourceTurnId) || hasRestartRecoverySourceClaim(entry ?? void 0, normalizedSourceTurnId)));
}
async function retireTerminalRestartRecoverySourceClaim(params) {
	let didRetire = false;
	const retired = await updateSessionEntry({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (current) => {
		if (current.sessionId !== params.sessionId || current.status === "running" || current.restartRecoveryDeliveryReceiptState === "terminal-pending" || !hasRestartRecoverySourceClaim(current, params.sourceTurnId)) return null;
		didRetire = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true,
				terminalSourceRunId: params.sourceTurnId
			}),
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return didRetire ? retired ?? void 0 : void 0;
}
function createReplyRestartRecoveryClaimController(params) {
	let recoveryRunId = randomUUID();
	let recoverySourceRunId;
	let tracked = false;
	const persistAdmissionPatch = async (options) => {
		const expectedSessionState = buildRestartRecoveryExpectedState(options.entry);
		if (options.recorder && !options.recorder.hasPersisted()) {
			const result = await options.recorder.persistApproved({
				target: params.resolveUserTurnTarget?.({
					entry: options.entry,
					sessionId: options.sessionId,
					sessionKey: options.sessionKey,
					storePath: options.storePath
				}),
				expectedSessionId: options.sessionId,
				expectedSessionState,
				sessionLifecyclePatch: options.patch
			});
			if (!result?.sessionEntry) throw new Error("session changed before durable user-turn admission");
			return result.sessionEntry;
		}
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: options.storePath,
			sessionKey: options.sessionKey
		}, (current) => sessionMatchesExpectedTranscriptTurn({ entry: current }, {
			expectedSessionId: options.sessionId,
			expectedSessionState
		}) ? options.patch : null);
		if (!persisted) throw new Error("restart recovery claim changed before agent adoption");
		return persisted;
	};
	const persistUserTurnOnly = async (recorder, sessionId) => {
		if (!recorder || recorder.hasPersisted()) return;
		const entry = params.getEntry();
		const target = entry && params.sessionKey && params.storePath ? params.resolveUserTurnTarget?.({
			entry,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) : void 0;
		const result = await recorder.persistApproved({
			target,
			expectedSessionId: sessionId
		});
		if (!result) throw new Error("session changed before durable user-turn admission");
		if (result.sessionEntry) params.setEntry(result.sessionEntry);
	};
	const admitUserTurn = async (recorder) => {
		if (!params.sessionKey || !params.storePath) {
			await recorder?.persistApproved();
			return "admitted";
		}
		const sessionId = params.getSessionId();
		const entry = loadSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false,
			hydrateSkillPromptRefs: false
		}) ?? params.getEntry();
		if (!entry || entry.sessionId !== sessionId) throw new Error("session changed before durable user-turn admission");
		const admissionRunId = normalizeOptionalString(params.admissionRunId);
		const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
		const activeClaimRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
		const isExactRecoveryClaim = admissionRunId && activeClaimRunId === admissionRunId;
		if (sourceTurnId) {
			if (hasRestartRecoveryTerminalRun(entry, sourceTurnId)) return "duplicate-source";
			if (!isExactRecoveryClaim && hasRestartRecoverySourceClaim(entry, sourceTurnId)) {
				if (entry.status !== "running") {
					const retired = await retireTerminalRestartRecoverySourceClaim({
						agentId: params.agentId,
						sessionId,
						sessionKey: params.sessionKey,
						sourceTurnId,
						storePath: params.storePath
					});
					if (retired) params.setEntry(retired);
				}
				return "duplicate-source";
			}
		}
		if (recorder?.getPendingInputMessage?.() && !recorder.hasPersisted()) {
			const placement = resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([sessionId]).get(sessionId);
			if (placement && placement.state !== "local") return "admitted";
		}
		if (isExactRecoveryClaim) {
			if (entry.status !== "running" || entry.abortedLastRun === true) throw new Error("restart recovery claim changed before agent adoption");
			const preservesTerminalReceipt = entry.restartRecoveryDeliveryReceiptState === "terminal-pending";
			const adopted = await persistAdmissionPatch({
				entry,
				patch: {
					restartRecoveryBeforeAgentReplyState: void 0,
					...preservesTerminalReceipt ? {} : {
						restartRecoveryDeliveryReceiptState: void 0,
						restartRecoveryDeliveryToolCallId: void 0,
						restartRecoveryDeliveryRequestFingerprint: void 0
					},
					restartRecoverySourceIngress: entry.restartRecoverySourceIngress ?? "control-ui",
					updatedAt: Date.now()
				},
				recorder,
				sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
			params.setEntry(adopted);
			recoveryRunId = admissionRunId;
			recoverySourceRunId = normalizeOptionalString(adopted.restartRecoveryDeliverySourceRunId);
			tracked = true;
			return "admitted";
		}
		const deliveryContext = params.resolveDeliveryContext(entry);
		const recoverableDeliveryContext = deliveryContext && sourceTurnId ? deliveryContext : void 0;
		if (recoverableDeliveryContext) {
			const sourceMessage = recorder?.getPersistedMessage?.() ?? await recorder?.resolveMessage();
			const persistedSourceTurnId = normalizeOptionalString(sourceMessage?.idempotencyKey);
			if (!recorder || persistedSourceTurnId !== sourceTurnId) throw new Error("channel restart recovery requires source-keyed user-turn admission");
		}
		if (!recoverableDeliveryContext && !activeClaimRunId) {
			await persistUserTurnOnly(recorder, sessionId);
			return "admitted";
		}
		const updatedAt = Date.now();
		if (activeClaimRunId && (entry.abortedLastRun === true || entry.status === "running" || entry.restartRecoveryDeliveryReceiptState === "terminal-pending")) throw new Error("restart recovery claim changed before agent adoption");
		const retiredClaim = activeClaimRunId ? buildRestartRecoveryClaimCleanupPatch({
			entry,
			recordTerminalSource: true,
			terminalSourceRunId: normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId)
		}) : {};
		const patch = recoverableDeliveryContext ? {
			...retiredClaim,
			abortedLastRun: false,
			endedAt: void 0,
			restartRecoveryBeforeAgentReplyState: void 0,
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			restartRecoveryDeliveryContext: recoverableDeliveryContext,
			restartRecoveryDeliveryRequestFingerprint: void 0,
			restartRecoveryDeliveryRunId: recoveryRunId,
			restartRecoveryDeliverySourceRunId: sourceTurnId,
			restartRecoveryRequesterAccountId: sourceTurnId ? normalizeOptionalString(params.requesterAccountId) : void 0,
			restartRecoveryRequesterSenderId: sourceTurnId ? normalizeOptionalString(params.requesterSenderId) : void 0,
			restartRecoverySameChannelThreadRequired: sourceTurnId && params.sameChannelThreadRequired === true ? true : void 0,
			restartRecoverySourceIngress: sourceTurnId ? "channel" : void 0,
			restartRecoverySourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			runtimeMs: void 0,
			startedAt: updatedAt,
			status: "running",
			updatedAt
		} : {
			...retiredClaim,
			updatedAt
		};
		const persisted = await persistAdmissionPatch({
			entry,
			patch,
			recorder,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		params.setEntry(persisted);
		recoverySourceRunId = normalizeOptionalString(persisted.restartRecoveryDeliverySourceRunId);
		tracked = persisted.restartRecoveryDeliveryRunId === recoveryRunId;
		return "admitted";
	};
	const checkpointBeforeAgentReply = async ({ state, pendingFinalDelivery }) => {
		if (!tracked || !params.sessionKey || !params.storePath) return;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => current.sessionId === params.getSessionId() && current.restartRecoveryDeliveryRunId === recoveryRunId && current.restartRecoveryDeliverySourceRunId === recoverySourceRunId && current.restartRecoveryBeforeAgentReplyState === "pending" ? {
			restartRecoveryBeforeAgentReplyState: state,
			...pendingFinalDelivery ? {
				pendingFinalDelivery: {
					...pendingFinalDelivery.text ? {
						kind: "replayable",
						text: pendingFinalDelivery.text
					} : { kind: "transport-only" },
					createdAt: updatedAt,
					...pendingFinalDelivery.intentId ? { intentId: pendingFinalDelivery.intentId } : {},
					deliveries: pendingFinalDelivery.deliveries,
					...pendingFinalDelivery.context ? { context: pendingFinalDelivery.context } : {}
				},
				restartRecoveryForceSafeTools: true
			} : {},
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error("before_agent_reply checkpoint lost restart recovery ownership");
		params.setEntry(persisted);
	};
	const beginBeforeAgentReply = async () => {
		if (!tracked || !params.sessionKey || !params.storePath) return true;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (persistedCurrent) => persistedCurrent.sessionId === params.getSessionId() && persistedCurrent.restartRecoveryDeliveryRunId === recoveryRunId && persistedCurrent.restartRecoveryDeliverySourceRunId === recoverySourceRunId && persistedCurrent.restartRecoveryBeforeAgentReplyState === void 0 ? {
			restartRecoveryBeforeAgentReplyState: "pending",
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error("before_agent_reply start lost restart recovery ownership");
		params.setEntry(persisted);
		return true;
	};
	const clear = async () => {
		const lifecycleGeneration = params.lifecycleGeneration;
		if (!tracked || !params.sessionKey || !params.storePath || !lifecycleGeneration || params.isRestartAbort()) return;
		const persisted = await patchSessionEntryCore({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => {
			if (current.abortedLastRun === true && current.mainRestartRecovery !== void 0 || current.sessionId !== params.getSessionId() || current.restartRecoveryDeliveryRunId !== recoveryRunId) return null;
			if (current.restartRecoveryDeliveryReceiptState === "terminal-pending") {
				const endedAt = Date.now();
				return {
					...buildRestartRecoveryClaimCleanupPatch({
						entry: current,
						recordTerminalSource: true,
						terminalSourceRunId: recoverySourceRunId
					}),
					abortedLastRun: true,
					endedAt,
					lifecycleRunId: void 0,
					pendingFinalDelivery: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "failed",
					updatedAt: endedAt
				};
			}
			const preservesPendingFinal = current.pendingFinalDelivery !== void 0;
			const endedAt = current.restartRecoveryBeforeAgentReplyState === "handled-silent" && !preservesPendingFinal ? Date.now() : void 0;
			return {
				...buildRestartRecoveryClaimCleanupPatch({
					entry: current,
					recordTerminalSource: true,
					terminalSourceRunId: recoverySourceRunId
				}),
				...preservesPendingFinal ? {
					restartRecoveryBeforeAgentReplyState: current.restartRecoveryBeforeAgentReplyState,
					restartRecoverySourceIngress: current.restartRecoverySourceIngress,
					restartRecoveryForceSafeTools: current.restartRecoveryForceSafeTools
				} : {},
				...endedAt !== void 0 ? {
					abortedLastRun: false,
					endedAt,
					lifecycleRunId: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "done"
				} : {},
				updatedAt: endedAt ?? Date.now()
			};
		}, { assertCommitAllowed: () => {
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (params.isRestartAbort()) throw createAgentRunStaleLifecycleError();
		} });
		if (persisted) params.setEntry(persisted);
	};
	const isArmed = () => {
		if (!tracked || !params.sessionKey || !params.storePath) return false;
		return loadSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			clone: false,
			hydrateSkillPromptRefs: false
		})?.abortedLastRun === true || params.getEntry()?.abortedLastRun === true;
	};
	return {
		admitUserTurn,
		beginBeforeAgentReply,
		checkpointBeforeAgentReply,
		clear,
		isArmed
	};
}
//#endregion
//#region src/auto-reply/reply/commentary-progress-owner.ts
/** Freezes and registers one commentary owner for the current agent turn. */
function resolveTurnCommentaryProgressOwner(params) {
	const shouldDeliverCommentaryPayloads = params.commentaryPayloadsEnabled ? params.options?.shouldDeliverCommentaryPayloads : void 0;
	const frozenVerboseProgressVisibility = shouldDeliverCommentaryPayloads ? params.resolveVerboseProgressVisibility() : void 0;
	params.options?.onVerboseProgressVisibility?.(frozenVerboseProgressVisibility === void 0 ? params.resolveVerboseProgressVisibility : () => frozenVerboseProgressVisibility);
	const commentaryPayloadsEnabled = params.commentaryPayloadsEnabled && (shouldDeliverCommentaryPayloads?.() ?? true);
	return {
		commentaryPayloadsEnabled,
		draftOwnsCommentaryProgress: params.commentaryPayloadsEnabled && shouldDeliverCommentaryPayloads !== void 0 && !commentaryPayloadsEnabled
	};
}
//#endregion
export { isNonDirectConversationContext as A, setBlockReplyDelivery as C, buildKnownAgentRunFailureReplyPayload as D, buildExternalRunFailureReply as E, resolveAgentRunFailureText as F, resolveReplyFailoverFacts as I, resolveReplyFailureSummary as L, markAgentRunFailureReplyPayload as M, markPostCompactionModelFailurePayload as N, buildPreflightCompactionFailureText as O, renderPostCompactionModelFailurePayload as P, REPLY_ADMISSION_TICKET as R, recoverBlockReplySources as S, buildEmptyInteractiveReplyPayload as T, createBlockReplyContentKey as _, QUEUE_CAP_REJECTION_TEXT as a, deliverBlockReply as b, createFinalizationAwareTtsPayloadApplier as c, hasExecApprovalPayload as d, hasExecApprovalUnavailablePayload as f, createAudioAsVoiceBuffer as g, shouldDeliverDespiteSourceReplySuppression as h, retireTerminalRestartRecoverySourceClaim as i, isVerboseFailureDetailEnabled as j, buildTerminalAgentRunFailureReplyPayload as k, formatSuppressedReplyPayloadForLog as l, requiresDurableToolResultDelivery as m, createReplyRestartRecoveryClaimController as n, buildNoVisibleReplyFallbackText as o, prepareReplyPayloadForSideEffects as p, isDuplicateRestartRecoverySource as r, createFinalDispatchPayloadDedupeKey as s, resolveTurnCommentaryProgressOwner as t, hasAskUserPayload as u, createBlockReplyPipeline as v, buildAuthProfileFailoverFailureText as w, hasBlockReplyDeliveryCustody as x, createBlockReplySource as y, reserveReplyAdmissionTicket as z };
