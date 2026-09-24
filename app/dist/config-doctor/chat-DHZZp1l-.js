import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.js";
import { It as readSessionPendingInput } from "./session-accessor-DMf92PxK.js";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-Dx_kHnY5.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { J as validateChatToolTitlesParams, U as validateChatInjectParams, W as validateChatMessageGetParams } from "./validator-registry-Dpl5QmuY.js";
import { n as CHAT_PENDING_INPUT_MESSAGE_PREFIX } from "./chat-history-constants-C-H8nkgi.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import "./sessions-4kX-llHk.js";
import { d as resolveSessionWorkStartError } from "./lifecycle-DpcRUIUy.js";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-CRHULe2N.js";
import { i as loadGatewaySessionEntryReadOnly, r as loadGatewaySessionEntry } from "./session-utils-store-DlmWzvmc.js";
import { v as resolveCurrentUserProfileDisplay } from "./session-utils-display-0bRfLd7U.js";
import { d as hiddenSessionNotFound } from "./session-sharing-policy-rVme8bnl.js";
import { E as createSessionListEntryFilter } from "./session-sharing-xa1VG8U2.js";
import "./session-utils-DyRtmfj4.js";
import { i as readSessionMessagesAroundIdWithStatsAsync, n as readSessionMessageByIdAsync } from "./session-transcript-readers-D3eaTHpA.js";
import { t as formatForLog } from "./ws-log-CZGKk4Rg.js";
import { r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-DUPQnhOF.js";
import { i as projectChatDisplayMessage, r as isPendingAssistantError, u as dropPreSessionStartAnnouncePairs } from "./chat-display-projection-C8q6oDEf.js";
import { i as readChatHistoryMessageId } from "./session-history-subagent-projection-BELc1w8p.js";
import { t as readChatHistoryPage } from "./chat-history-pages-BJeaPTZL.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.js";
import { t as appendAssistantTranscriptMessage } from "./chat-transcript-persistence-ktNucwhe.js";
import { r as projectPendingInputMessage, t as chatHistoryHandlers } from "./chat-history-handler-0IkH1U0m.js";
import { c as resolveGlobalAwareNodeChatDeliveryKeys, l as sendGlobalAwareNodeChatPayload } from "./chat-broadcast-CdoOe3x7.js";
//#region src/gateway/server-methods/chat-message-get-handler.ts
async function isChatMessageIdVisibleAfterHistoryFilters(params) {
	if (isPendingAssistantError(params.message)) return (await readChatHistoryPage({
		entry: params.sessionEntry,
		provider: void 0,
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionAgentId: params.agentId,
		canonicalKey: params.sessionKey,
		max: 1,
		maxHistoryBytes: MAX_PAYLOAD_BYTES,
		effectiveMaxChars: MAX_PAYLOAD_BYTES,
		offset: void 0,
		messageId: params.messageId,
		ignoreCliSessionImports: true
	})).messages.some((message) => readChatHistoryMessageId(message) === params.messageId);
	if (params.sessionStartedAt === void 0) return true;
	const { messages } = await readSessionMessagesAroundIdWithStatsAsync({
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		maxMessages: 1,
		messageId: params.messageId,
		...params.allowResetArchiveFallback === true ? { allowResetArchiveFallback: true } : {}
	});
	return dropPreSessionStartAnnouncePairs(messages, params.sessionStartedAt).some((message) => readChatHistoryMessageId(message) === params.messageId);
}
const chatMessageGetHandlers = { "chat.message.get": async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateChatMessageGetParams, "chat.message.get", respond)) return;
	const { sessionKey, messageId, maxChars } = params;
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, agentIdOverride);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const session = loadGatewaySessionEntryReadOnly(sessionKey, { agentId: requestedAgentId }, cfg);
	const { agentId: sessionAgentId, storePath, entry, canonicalKey } = session;
	const sessionId = entry?.sessionId;
	if (!sessionId) {
		respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		return;
	}
	const canReadSession = (current) => {
		if (!current.entry || current.agentId !== session.agentId || current.canonicalKey !== canonicalKey || current.storePath !== storePath || current.entry.sessionId !== sessionId || current.entry.lifecycleRevision !== entry.lifecycleRevision) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session changed while reading history; reload the conversation", { retryable: true }));
			return false;
		}
		if (createSessionListEntryFilter({
			client,
			cfg: current.cfg
		})?.(current.canonicalKey, current.entry) === false) {
			respond(false, void 0, hiddenSessionNotFound(canonicalKey));
			return false;
		}
		return true;
	};
	if (!canReadSession(session)) return;
	const effectiveMaxChars = typeof maxChars === "number" ? maxChars : Math.min(MAX_PAYLOAD_BYTES, 1e6);
	if (messageId.startsWith("pending:")) {
		const pending = readSessionPendingInput({
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId,
			storePath
		}, messageId.slice(CHAT_PENDING_INPUT_MESSAGE_PREFIX.length));
		if (!pending) {
			respond(true, {
				ok: false,
				unavailableReason: "not_found"
			});
			return;
		}
		const message = projectPendingInputMessage(pending, effectiveMaxChars);
		if (!message) {
			respond(true, {
				ok: false,
				unavailableReason: "not_visible"
			});
			return;
		}
		respond(true, jsonUtf8Bytes(message) > 26213376 ? {
			ok: false,
			unavailableReason: "oversized"
		} : {
			ok: true,
			message
		});
		return;
	}
	const resolved = await readSessionMessageByIdAsync({
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	}, messageId, { allowResetArchiveFallback: true });
	const visible = resolved.found && await isChatMessageIdVisibleAfterHistoryFilters({
		sessionId,
		storePath,
		sessionEntry: entry,
		sessionKey,
		agentId: sessionAgentId,
		message: resolved.message,
		messageId,
		sessionStartedAt: typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0,
		allowResetArchiveFallback: true
	});
	if (!canReadSession(loadGatewaySessionEntryReadOnly(sessionKey, {
		agentId: requestedAgentId,
		clone: false,
		projection: "list"
	}))) return;
	if (!visible) {
		respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		return;
	}
	if (resolved.oversized) {
		respond(true, {
			ok: false,
			unavailableReason: "oversized"
		});
		return;
	}
	const projectedMessage = resolved.message ? projectChatDisplayMessage(resolved.message, {
		maxChars: effectiveMaxChars,
		resolveCurrentUserProfileDisplay
	}) : void 0;
	const projected = projectedMessage ? augmentChatHistoryWithCanvasBlocks([projectedMessage])[0] : void 0;
	if (!projected) {
		respond(true, {
			ok: false,
			unavailableReason: "not_visible"
		});
		return;
	}
	respond(true, jsonUtf8Bytes(projected) > 26213376 ? {
		ok: false,
		unavailableReason: "oversized"
	} : {
		ok: true,
		message: projected
	});
} };
//#endregion
//#region src/gateway/server-methods/chat.ts
const chatHandlers = {
	...chatHistoryHandlers,
	...chatMessageGetHandlers,
	"chat.toolTitles": async ({ params, respond }) => {
		if (!assertValidParams(params, validateChatToolTitlesParams, "chat.toolTitles", respond)) return;
		respond(true, {
			titles: {},
			disabled: true
		});
	},
	"chat.inject": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChatInjectParams, "chat.inject", respond)) return;
		const p = params;
		const rawSessionKey = p.sessionKey;
		const agentIdOverride = normalizeOptionalChatText(p.agentId);
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, rawSessionKey, agentIdOverride);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const sessionLoadOptions = { agentId: requestedAgent.agentId };
		const { agentId, storePath, entry, canonicalKey: sessionKey } = loadGatewaySessionEntry(rawSessionKey, sessionLoadOptions, cfg);
		const sessionId = entry?.sessionId;
		if (!sessionId || !storePath) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session not found"));
			return;
		}
		let appended;
		try {
			const admission = await beginSessionWorkAdmission({
				scope: storePath,
				identities: [sessionKey, sessionId],
				assertAllowed: () => {
					const latestEntry = loadGatewaySessionEntry(rawSessionKey, sessionLoadOptions).entry;
					if (!latestEntry) throw new Error(`Session "${sessionKey}" was deleted while starting work. Retry.`);
					if (latestEntry.sessionId !== sessionId) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
					const archivedError = resolveSessionWorkStartError(sessionKey, latestEntry);
					if (archivedError) throw new Error(archivedError);
				}
			});
			try {
				appended = await admission.run(async () => await appendAssistantTranscriptMessage({
					sessionKey,
					message: p.message,
					label: p.label,
					sessionId,
					storePath,
					agentId,
					createIfMissing: true,
					cfg
				}));
			} finally {
				admission.release();
			}
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
			return;
		}
		if (!appended.ok || !appended.messageId || !appended.message) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to write transcript: ${appended.error ?? "unknown error"}`));
			return;
		}
		const message = projectChatDisplayMessage(appended.message, { maxChars: resolveEffectiveChatHistoryMaxChars() });
		const chatPayload = {
			runId: `inject-${appended.messageId}`,
			sessionKey,
			...agentId ? { agentId } : {},
			seq: 0,
			state: "final",
			message
		};
		context.broadcast("chat", chatPayload, { sessionKeys: resolveGlobalAwareNodeChatDeliveryKeys({
			cfg,
			sessionKey,
			agentId
		}) });
		sendGlobalAwareNodeChatPayload({
			context,
			sessionKey,
			agentId,
			event: "chat",
			payload: chatPayload
		});
		respond(true, {
			ok: true,
			messageId: appended.messageId
		});
	}
};
//#endregion
export { chatHandlers as t };
