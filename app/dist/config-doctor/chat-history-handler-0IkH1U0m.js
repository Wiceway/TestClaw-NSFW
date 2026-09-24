import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { p as scopeLegacySessionKeyToAgent } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DDShltPN.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import "./agent-scope-BiRi-Smp.js";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-_Hi_clcB.js";
import { _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { i as jsonUtf8BytesOrInfinity } from "./json-utf8-bytes-fm9i4b7G.js";
import { a as isAssistantDeliveryMirrorAssistantMessage } from "./transcript-only-testclaw-assistant-DMb_WNdn.js";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CAHggmXg.js";
import { Ft as listSessionPendingInputs, Pt as listSessionPendingInputReceipts } from "./session-accessor-DMf92PxK.js";
import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-Dx_kHnY5.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { H as validateChatHistoryParams, q as validateChatStartupParams } from "./validator-registry-Dpl5QmuY.js";
import { n as CHAT_PENDING_INPUT_MESSAGE_PREFIX, t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C-H8nkgi.js";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { r as resolveSessionStoreIdentity } from "./session-store-key-DRl7Rrsc.js";
import { r as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors--Wehxnza.js";
import { i as readResidentUserProfileId } from "./user-profile-list-CfxnGEeA.js";
import { E as getSubagentSessionListReadSnapshotIdentity, M as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-read-DD46xgBs.js";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-hBkALjff.js";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-CRHULe2N.js";
import "./model-catalog-B6RrhAtj.js";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.js";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-D9Q3Q7vm.js";
import { S as resolveActiveEmbeddedRunHandleSessionId, w as resolveActiveEmbeddedRunOwner } from "./runs-CKg3ezhN.js";
import { t as capArrayByJsonBytes } from "./session-utils.fs-DhpLc_dd.js";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-CmdK_pJw.js";
import { n as resolveSessionModelRef } from "./session-model-ref-CFOEMtHG.js";
import { V as buildGatewaySessionRow, n as withReadySessionRows } from "./session-row-prepared-read-x3FXwbu8.js";
import { i as resolveGatewayModelThinkingProfile, t as getSessionDefaults } from "./session-utils-model-DNhbGjQT.js";
import { v as resolveCurrentUserProfileDisplay } from "./session-utils-display-0bRfLd7U.js";
import { d as hiddenSessionNotFound, f as isGatewayAdmin, y as resolveSessionVisibility } from "./session-sharing-policy-rVme8bnl.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-BmBhAZ5J.js";
import { o as resolveGatewayModelSelectionPolicy } from "./session-utils-list-DJslse42.js";
import "./session-sharing-xa1VG8U2.js";
import { i as prepareProjectedSessionPresentation } from "./session-list-read-result-B6v7cJRo.js";
import "./session-utils-DyRtmfj4.js";
import { f as readTranscriptDisplayDelta } from "./session-transcript-readers-D3eaTHpA.js";
import { i as resolveClaudeCliBindingSessionId } from "./cli-session-history-DgsmTnKz.js";
import { d as isAssistantTtsSupplementMessage, i as projectChatDisplayMessage, n as createCurrentUserProfileMessageProjector } from "./chat-display-projection-C8q6oDEf.js";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-C8A64B_q.js";
import { t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-BELc1w8p.js";
import { a as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, c as createChatHistoryByteCounter, d as trimChatHistoryActivity, i as resolveChatHistoryNextOffset, l as replaceOversizedChatHistoryMessages, n as capChatHistoryAroundMessage, o as chatHistoryActivityBytes, r as enrichChatHistoryCompactionMarkers, s as createChatHistoryActivityProjection, t as readChatHistoryPage, u as reportOmittedChatHistory } from "./chat-history-pages-BJeaPTZL.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-DRH4STOa.js";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-C4QnpCoW.js";
import { d as resolveInFlightRunSnapshot, o as projectInFlightRunSnapshot, r as boundInFlightRunSnapshotForChatHistory } from "./chat-abort-DEpgr_1N.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.js";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-Djl_UhPC.js";
import { a as prepareSessionWorkspaceIcon } from "./workspace-icon-http-yR7DnuSQ.js";
import { t as projectSessionMessagePayload } from "./session-transcript-message-NyfLnKYG.js";
import { n as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-Dyu2h4kE.js";
import { t as handleChatMetadataRequest } from "./chat-metadata-handler-mIfsXpRM.js";
//#region src/gateway/session-history-delta-visibility.ts
function isAppendOnlySessionHistoryDelta(delta) {
	return delta.kind === "page" && !delta.hasMore && !delta.events.some(({ event }) => {
		const type = asOptionalRecord(event)?.type;
		return type === "reset" || type === "compaction" || type === "leaf";
	});
}
function createPreparedSessionHistorySubagentProjection(facts, assertCurrent) {
	const sessions = new Map(facts.sessions);
	const runs = /* @__PURE__ */ new Map();
	for (const [runId, messageSeq, hidden] of facts.runMessages) {
		let messages = runs.get(runId);
		if (!messages) {
			messages = /* @__PURE__ */ new Map();
			runs.set(runId, messages);
		}
		messages.set(messageSeq, hidden);
	}
	const requireFact = (hidden, lookup) => {
		assertCurrent();
		if (hidden === void 0) {
			const failed = facts.failure?.lookup;
			if (facts.failure && (lookup.kind === "session" && failed?.kind === "session" && lookup.sessionKey === failed.sessionKey || lookup.kind === "run" && failed?.kind === "run" && lookup.runId === failed.runId && lookup.messageSeq === failed.messageSeq)) unwrapSessionTranscriptWorkerReply({
				ok: false,
				error: facts.failure.error
			});
			throw new Error("Session history visibility is unavailable; retry the request.");
		}
		return hidden;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => requireFact(sessions.get(sessionKey), {
			kind: "session",
			sessionKey
		}),
		isSubagentRunMessage: (runId, messageSeq) => requireFact(runs.get(runId)?.get(messageSeq), {
			kind: "run",
			runId,
			messageSeq
		})
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-delta.ts
const CHAT_HISTORY_DELTA_MAX_EVENTS = 200;
const CHAT_HISTORY_DELTA_MAX_BYTES = 1e6;
async function readChatHistoryDelta(params, signal) {
	signal?.throwIfAborted();
	if (params.incognito || isIncognitoSessionKey(params.sessionKey)) return readRestoredSessionTranscript(params.scope, () => readLocalChatHistoryDelta(params));
	const target = {
		...params.scope,
		sessionEntry: params.scope.sessionEntry ? { sessionId: params.scope.sessionEntry.sessionId } : void 0
	};
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DN4pw2Js.js");
	const result = await readSessionHistoryPageInWorker({
		kind: "delta",
		params: {
			target,
			limits: {
				cursor: params.cursor,
				maxBytes: Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES),
				maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
			}
		}
	}, signal);
	return projectChatHistoryDelta(params, result.delta, createPreparedSessionHistorySubagentProjection(result.subagentCoordination, result.assertCurrent));
}
function readLocalChatHistoryDelta(params) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	const result = readTranscriptDisplayDelta(params.scope, {
		cursor: params.cursor,
		maxBytes,
		maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
	});
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	return projectChatHistoryDelta(params, result, createSessionHistorySubagentProjection(params.scope));
}
function projectChatHistoryDelta(params, result, subagentCoordination) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	subagentCoordination.assertCurrent?.();
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	let projectionState = {
		assistantErrorPending: false,
		turnBoundaryPending: false
	};
	const projectCurrentUserProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = [];
	const activityMessages = [];
	let messagesBytes = 2;
	for (const row of result.events) {
		if (row.messageSeq === void 0) continue;
		const entryMessage = projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition);
		if (!entryMessage) continue;
		if (isAssistantDeliveryMirrorAssistantMessage(entryMessage) && asOptionalRecord(asOptionalRecord(entryMessage)?.testclawDeliveryMirror)?.kind === "channel-final") return { kind: "reset" };
		if (isAssistantTtsSupplementMessage(entryMessage)) return { kind: "reset" };
		const messageId = asOptionalRecord(row.event)?.id;
		const projected = projectSessionMessagePayload({
			agentId: params.agentId,
			historyDelta: true,
			message: entryMessage,
			...typeof messageId === "string" && messageId ? { messageId } : {},
			messageSeq: row.messageSeq,
			transcriptPosition: row.displayPosition,
			projectionState,
			projectCurrentUserProfile,
			subagentCoordination,
			sessionKey: params.sessionKey,
			sessionSnapshot: params.sessionSnapshot
		});
		if (projected.requiresHistoryReset) return { kind: "reset" };
		projectionState = projected.projectionState;
		if (projectionState.assistantErrorPending) return { kind: "reset" };
		if (projected.payload) {
			messagesBytes += jsonUtf8BytesOrInfinity(projected.payload) + (messages.length > 0 ? 1 : 0);
			if (messagesBytes > maxBytes) return { kind: "reset" };
			messages.push(projected.payload);
			if (typeof messageId === "string") activityMessages.push({
				messageId,
				message: entryMessage
			});
		}
	}
	subagentCoordination.assertCurrent?.();
	const activity = [...createChatHistoryActivityProjection(messages.map((envelope) => envelope.message), projectAgentHistoryActivity(activityMessages)).values()];
	const activityBytes = chatHistoryActivityBytes(activity);
	if (messagesBytes + activityBytes > maxBytes) return { kind: "reset" };
	return {
		activeLeafEntryId: result.activeLeafEntryId,
		deltaCursor: result.cursor,
		kind: "delta",
		activity,
		messages: composeTranscriptDisplay(messages, (envelope) => envelope.message),
		messagesBytes,
		activityBytes
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-recovery.ts
function resolveEmbeddedAgentRunRecoverySnapshot(params) {
	const sessionId = params.sessionId ?? resolveActiveEmbeddedRunHandleSessionId(params.canonicalSessionKey) ?? resolveActiveEmbeddedRunHandleSessionId(params.requestedSessionKey);
	if (!sessionId) return;
	const owner = resolveActiveEmbeddedRunOwner(sessionId);
	if (!owner) return;
	return projectInFlightRunSnapshot({
		chatRunState: params.chatRunState,
		runId: owner.runId,
		startedAtMs: owner.startedAtMs,
		sessionAbortable: true
	});
}
function respondChatHistoryUnavailable(method, respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, {
		details: { method },
		retryable: true,
		retryAfterMs: 250
	}));
}
//#endregion
//#region src/gateway/server-methods/chat-history-session-read.ts
/** Select and revalidate history metadata through its prepared row and sharing owners. */
async function prepareChatHistorySessionRead({ context, client, respond, signal, method, sessionKey, agentIdOverride, requestedSessionId, retainedSessionId }) {
	const rowProjection = getSessionRowProjection(context);
	if (!rowProjection) {
		respondChatHistoryUnavailable(method, respond, "session rows are initializing; reload the conversation");
		return;
	}
	const queries = (cfg) => {
		const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentIdOverride);
		if (!requested.ok) return [];
		const { canonicalKey, agentId } = resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId: requested.agentId
		});
		return [{
			key: canonicalKey,
			agentId
		}];
	};
	const selectSession = (read) => {
		const cfg = read.state.cfg;
		const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentIdOverride);
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const requestedIdentity = resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId: requested.agentId
		});
		const record = read.describe({
			key: requestedIdentity.canonicalKey,
			agentId: requestedIdentity.agentId
		});
		const identity = record ? {
			agentId: record.agentId,
			canonicalKey: record.key
		} : requestedIdentity;
		return {
			cfg,
			...identity,
			record,
			entry: record?.storedEntry ?? record?.entry,
			storePath: record?.storeTarget.storePath ?? resolveSessionStorePathCore(cfg.session?.store, { agentId: identity.agentId }),
			storeKeys: [identity.canonicalKey],
			store: {}
		};
	};
	const authorizeSharing = (current, read) => {
		const sharing = prepareProjectedSessionPresentation(read, client).sharing;
		if (current.entry ? sharing.entryFilter?.(current.canonicalKey, current.entry) === false : requestedSessionId && !retainedSessionId && !isGatewayAdmin(client)) {
			respond(false, void 0, hiddenSessionNotFound(current.canonicalKey));
			return;
		}
		return sharing;
	};
	const selectedSession = await measureDiagnosticsTimelineSpan(`gateway.${method}.session_entry`, () => withReadySessionRows(rowProjection, queries, (read) => {
		const selected = selectSession(read);
		return selected && authorizeSharing(selected, read) ? selected : void 0;
	}), {
		config: context.getRuntimeConfig(),
		phase: method
	});
	signal?.throwIfAborted();
	if (!selectedSession) return;
	let excluded;
	try {
		if (!selectedSession.entry && !isIncognitoSessionKey(sessionKey)) {
			excluded = await prepareSessionMutationFacts({
				cfg: selectedSession.cfg,
				sessionKey,
				agentId: selectedSession.agentId,
				allowMissing: true
			});
			signal?.throwIfAborted();
		}
		const { agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
		const entry = selectedSession.entry ? structuredClone(selectedSession.entry) : void 0;
		const readCurrentSharing = (read) => {
			const current = selectSession(read);
			if (!current) return;
			if (excluded) {
				let excludedEntry;
				try {
					excludedEntry = excluded.readCurrent(read.state.cfg).target?.entry;
				} catch (error) {
					if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
					respondChatHistoryUnavailable(method, respond, error.message);
					return;
				}
				if (excludedEntry) {
					if (authorizeSharing({
						...current,
						entry: excludedEntry
					}, read)) respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
					return;
				}
			}
			const currentEntry = current.entry;
			if (entry && (!currentEntry || current.agentId !== sessionAgentId || current.canonicalKey !== canonicalKey || current.storePath !== storePath || !retainedSessionId && (!read.describe({
				key: canonicalKey,
				agentId: sessionAgentId,
				storePath
			}, selectedSession.record) || currentEntry.sessionId !== entry.sessionId || currentEntry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentEntry.sessionStartedAt !== entry.sessionStartedAt))) {
				respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
				return;
			}
			const sharing = authorizeSharing(current, read);
			if (!sharing) return;
			return currentEntry ? {
				visibility: resolveSessionVisibility(currentEntry),
				sharingRole: sharing.roleForTarget({
					...current,
					entry: currentEntry,
					storeKey: current.canonicalKey
				})
			} : {};
		};
		if (excluded && !await withReadySessionRows(rowProjection, queries, readCurrentSharing)) {
			excluded.release();
			return;
		}
		signal?.throwIfAborted();
		return {
			selectedSession,
			entry,
			queries,
			readCurrentSharing,
			rowProjection,
			release: () => excluded?.release()
		};
	} catch (error) {
		excluded?.release();
		if (error instanceof SessionMutationFactsUnavailableError) {
			respondChatHistoryUnavailable(method, respond, error.message);
			return;
		}
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/chat-pending-inputs.ts
const PENDING_INPUT_DISPLAY_MAX_BYTES = 131072;
const PENDING_INPUT_CORRELATION_MAX_CHARS = 256;
function projectPendingInputMessage(input, maxChars, projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay)) {
	const projected = projectChatDisplayMessage(input.message, { maxChars });
	const message = projected ? projectProfile(projected) : void 0;
	if (!message) return;
	const metadata = { ...asOptionalRecord(message["__testclaw"]) };
	delete metadata.idempotencyKey;
	delete metadata.runId;
	return {
		...message,
		timestamp: input.acceptedAt,
		idempotencyKey: void 0,
		__testclaw: {
			...metadata,
			id: `${CHAT_PENDING_INPUT_MESSAGE_PREFIX}${input.id}`
		}
	};
}
function readChatPendingInputs(scope, options) {
	const page = listSessionPendingInputs(scope, {
		before: options.before,
		limit: Math.min(options.limit, 20)
	});
	const projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const visible = page.items.flatMap((input) => {
		const message = projectPendingInputMessage(input, options.maxChars, projectProfile);
		return message ? [{
			input,
			message
		}] : [];
	});
	const messages = replaceOversizedChatHistoryMessages({
		messages: visible.map(({ message }) => message),
		maxSingleMessageBytes: Math.floor(PENDING_INPUT_DISPLAY_MAX_BYTES / Math.max(page.items.length, 1))
	}).messages;
	return {
		...page,
		items: visible.map(({ input: item }, index) => {
			const display = {
				id: item.id,
				acceptedAt: item.acceptedAt,
				state: item.state,
				message: messages[index]
			};
			if (item.runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS) display.runId = item.runId;
			return display;
		})
	};
}
//#endregion
//#region src/gateway/server-methods/chat-startup-handler.ts
async function handleChatStartupRequest(opts, handleHistory, respondUnavailable) {
	if (!assertValidParams(opts.params, validateChatStartupParams, "chat.startup", opts.respond)) return;
	if ("sessionKey" in opts.params) {
		await handleHistory({
			...opts,
			method: "chat.startup"
		});
		return;
	}
	const connId = opts.client?.connId?.trim();
	if (connId) {
		opts.context.subscribeSessionEvents(connId);
		if (!opts.context.getSessionEventSubscriberConnIds().has(connId)) {
			opts.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "connection closed before chat startup"));
			return;
		}
	}
	const { shortId, slugHint, agentId, limit, maxBytes } = opts.params;
	const projection = getSessionRowProjection(opts.context);
	if (!projection) {
		respondUnavailable("chat.startup", opts.respond, "session rows are initializing; reload the conversation");
		return;
	}
	const resolution = resolveSessionKeyFromResolveParams({
		projection,
		client: opts.client,
		p: {
			shortId,
			slugHint,
			agentId,
			allowMissing: true
		}
	});
	if (!resolution.ok) {
		opts.respond(false, void 0, resolution.error);
		return;
	}
	if ("missing" in resolution || "ambiguous" in resolution) {
		opts.respond(true, { resolution: {
			ok: false,
			..."ambiguous" in resolution ? { candidates: resolution.candidates } : {}
		} });
		return;
	}
	await handleHistory({
		...opts,
		params: {
			sessionKey: resolution.key,
			agentId: resolution.agentId,
			limit,
			maxBytes
		},
		method: "chat.startup",
		respond: (ok, payload, error, meta) => opts.respond(ok, ok ? {
			...asOptionalRecord(payload),
			resolution
		} : payload, error, meta)
	});
}
//#endregion
//#region src/gateway/server-methods/chat-startup-requester.ts
/** Bind the requester to its source, then resolve merges when metadata is assembled. */
async function prepareChatStartupRequester(client) {
	let profileId = client?.authenticatedUserProfile?.profileId;
	const attachedProfileId = profileId;
	if (!profileId && (!client?.authenticatedUserId || client.authenticatedGitHubIdentitySync || client.authenticatedUserIsTailscaleProvider)) return () => void 0;
	const context = captureAssistantStateWorkerContext();
	const options = { path: context.admission.databasePath };
	const email = client?.authenticatedUserId;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (attachedProfileId ? client?.authenticatedUserProfile?.profileId !== attachedProfileId : client?.authenticatedUserProfile?.profileId || client?.authenticatedUserId !== email || client?.authenticatedGitHubIdentitySync || client?.authenticatedUserIsTailscaleProvider) throw new Error("Startup requester changed during metadata preparation");
	};
	if (!profileId && email) {
		const { ensureProfileIdForEmail } = await import("./user-profile-email-WpalLZve.js");
		profileId = await ensureProfileIdForEmail(email, options, assertCurrent);
	}
	return () => {
		assertCurrent();
		return profileId ? readResidentUserProfileId(profileId, options) : void 0;
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-handler.ts
async function handleChatHistoryRequest({ params, respond, client, context, method, signal, retainedSessionId }) {
	if (!assertValidParams(params, validateChatHistoryParams, method, respond)) return;
	const { sessionKey, limit, offset, cursor, messageId, sessionId: wireSessionId, maxChars, maxBytes, pendingBefore, inputRunIds } = params;
	const requestedSessionId = retainedSessionId ?? wireSessionId;
	if (offset !== void 0 && messageId !== void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "offset and messageId cannot be used together"));
		return;
	}
	if (cursor !== void 0 && (offset !== void 0 || messageId !== void 0)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cursor cannot be used with offset or messageId"));
		return;
	}
	if (wireSessionId !== void 0 && messageId === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId requires messageId"));
		return;
	}
	if (!getSubagentSessionListReadSnapshotIdentity()) await prepareOptionalSubagentSessionListReadCache();
	signal?.throwIfAborted();
	const selection = await prepareChatHistorySessionRead({
		context,
		client,
		respond,
		signal,
		method,
		sessionKey,
		agentIdOverride: normalizeOptionalChatText(params.agentId),
		requestedSessionId,
		retainedSessionId
	});
	if (!selection) return;
	try {
		const { selectedSession, entry, queries, readCurrentSharing, rowProjection } = selection;
		const { cfg, agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
		if (requestedSessionId) {
			const transcriptSessionKey = resolveSessionKeyBySessionId({
				agentId: sessionAgentId,
				sessionId: requestedSessionId,
				storePath
			});
			if (!transcriptSessionKey || scopeLegacySessionKeyToAgent({
				sessionKey: transcriptSessionKey,
				agentId: sessionAgentId
			}) !== scopeLegacySessionKeyToAgent({
				sessionKey: canonicalKey,
				agentId: sessionAgentId
			})) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId does not belong to sessionKey"));
				return;
			}
		}
		if (method === "chat.startup") prepareSessionWorkspaceIcon({
			sessionKey,
			agentId: sessionAgentId
		}).catch((error) => {
			context.logGateway.debug(`chat.startup continuing without a workspace icon: ${formatErrorMessage(error)}`);
		});
		const readStartupProjection = () => measureDiagnosticsTimelineSpan(`gateway.${method}.startup_projection`, async () => {
			try {
				return await context.readChatStartupProjection?.({
					agentId: sessionAgentId,
					sessionKey: canonicalKey,
					sessionEntry: entry,
					...method === "chat.startup" ? { readRequesterProfileId: await prepareChatStartupRequester(client) } : {},
					readPolicy: method === "chat.history" ? "ready" : "current"
				});
			} catch (error) {
				context.logGateway.debug(`${method} continuing without prepared startup projection: ${formatErrorMessage(error)}`);
				return;
			}
		}, {
			config: cfg,
			phase: method,
			attributes: { agentId: sessionAgentId }
		});
		const startupProjectionPromise = entry?.authProfileOverride?.trim() ? readStartupProjection() : void 0;
		const sessionId = requestedSessionId ?? entry?.sessionId;
		const historyEntry = requestedSessionId && requestedSessionId !== entry?.sessionId ? void 0 : entry;
		const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId, { allowPluginNormalization: false });
		const max = Math.min(CHAT_HISTORY_MAX_ENTRIES, typeof limit === "number" ? limit : 200);
		const maxHistoryBytes = Math.min(maxBytes ?? Infinity, getMaxChatHistoryMessagesBytes());
		const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(maxChars);
		const pendingInputs = sessionId && sessionId === entry?.sessionId ? readChatPendingInputs({
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId,
			storePath
		}, {
			before: pendingBefore,
			limit: max,
			maxChars: effectiveMaxChars
		}) : {
			items: [],
			total: 0
		};
		const inputReceipts = inputRunIds ? !messageId && sessionId && sessionId === entry?.sessionId ? listSessionPendingInputReceipts({
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId,
			storePath
		}, { runIds: inputRunIds }) : [] : void 0;
		const inputConsumptions = inputReceipts?.flatMap((receipt) => receipt.state === "consumed" ? [{
			runId: receipt.runId,
			consumedByEventId: receipt.consumedByEventId
		}] : []);
		let historyPage;
		try {
			historyPage = cursor ? { messages: [] } : await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
				entry: historyEntry,
				provider: resolvedSessionModel.provider,
				sessionId,
				storePath,
				sessionAgentId,
				canonicalKey,
				max,
				maxHistoryBytes,
				effectiveMaxChars,
				offset,
				messageId
			}, signal), {
				config: cfg,
				phase: method,
				attributes: {
					limit: max,
					hasMessageId: Boolean(messageId),
					hasOffset: offset !== void 0
				}
			});
		} catch (error) {
			const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
			if (unavailableMessage === void 0) throw error;
			respondChatHistoryUnavailable(method, respond, unavailableMessage);
			return;
		}
		const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry);
		const responseHistoryBytes = historyPage.completeCliImport ? getMaxChatHistoryMessagesBytes() : maxHistoryBytes;
		const activity = createChatHistoryActivityProjection(normalized, historyPage.activity);
		const byteCounter = createChatHistoryByteCounter(activity);
		const replaced = replaceOversizedChatHistoryMessages({
			byteCounter,
			messages: normalized,
			maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, getMaxChatHistoryMessagesBytes())
		});
		const prioritized = historyPage.completeCliImport && !messageId ? trimChatHistoryActivity({
			messages: replaced.messages,
			maxBytes: responseHistoryBytes,
			byteCounter
		}) : replaced.messages;
		const capped = messageId ? capChatHistoryAroundMessage({
			messages: prioritized,
			messageId,
			maxCost: responseHistoryBytes - 1 - byteCounter.framingBytes(prioritized),
			messageCost: (message) => byteCounter.messageBytes(message) + 1
		}) : capArrayByJsonBytes(prioritized, responseHistoryBytes - byteCounter.framingBytes(prioritized), byteCounter.messageBytes).items;
		const historyBudgetPreserved = replaced.replacedCount === 0 && capped.length === normalized.length && capped.every((message, index) => message === normalized[index]);
		const pagination = historyPage.pagination;
		const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
			messages: capped,
			totalMessages: pagination.totalMessages,
			offset: pagination.offset,
			rawPageMessages: pagination.rawPageMessages,
			projected: normalized
		});
		const hasMore = pagination !== void 0 && candidateNextOffset !== void 0 ? pagination.exhausted !== true && candidateNextOffset < pagination.totalMessages : void 0;
		reportOmittedChatHistory({
			originalMessages: normalized,
			finalMessages: capped,
			getNormalizedBytes: () => byteCounter.messagesBytes(normalized),
			maxHistoryBytes: responseHistoryBytes,
			logDebug: (message) => context.logGateway.debug(message)
		});
		const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
		const startupProjection = await (startupProjectionPromise ?? readStartupProjection());
		const startupMetadata = method === "chat.startup" ? startupProjection?.metadata : void 0;
		const { sessionModelCatalog, defaultModelCatalog } = startupProjection ?? {};
		const query = {
			key: canonicalKey,
			agentId: sessionAgentId,
			storePath
		};
		await (await withReadySessionRows(rowProjection, queries, (read) => {
			const currentSharing = readCurrentSharing(read);
			if (!currentSharing) return;
			const sessionInfo = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_info`, () => prepareProjectedSessionPresentation(read, client).snapshot(query).row ?? (entry ? void 0 : buildGatewaySessionRow({
				...selectedSession,
				key: canonicalKey,
				modelCatalog: sessionModelCatalog,
				rowContext: rowProjection.state.rowContext
			})), {
				config: cfg,
				phase: method
			});
			if (entry && !sessionInfo) {
				respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
				return;
			}
			if (sessionInfo) Object.assign(sessionInfo, currentSharing);
			const activeRunState = resolveVisibleActiveSessionRunState({
				context,
				requestedKey: sessionKey,
				canonicalKey,
				sessionId,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				defaultAgentId: compatibilityOwnerAgentId,
				includeTerminalPersistence: true
			});
			if (sessionInfo) sessionInfo.hasActiveRun = activeRunState.active;
			if (sessionInfo && activeRunState.runIds !== void 0) sessionInfo.activeRunIds = activeRunState.runIds;
			if (sessionInfo && activeRunState.active) sessionInfo.status = activeRunState.status ?? "running";
			const embeddedRecovery = resolveEmbeddedAgentRunRecoverySnapshot({
				chatRunState: context.chatRunState,
				requestedSessionKey: sessionKey,
				canonicalSessionKey: canonicalKey,
				sessionId
			});
			if (sessionInfo && Object.hasOwn(historyPage, "activeLeafEntryId")) sessionInfo.activeLeafEntryId = historyPage.activeLeafEntryId ?? null;
			const defaults = cursor === void 0 ? {
				...getSessionDefaults(cfg, defaultModelCatalog, {
					agentId: sessionAgentId,
					allowPluginNormalization: false,
					providerPolicySource: "active"
				}),
				modelSelectionTarget: resolveGatewayModelSelectionPolicy({
					callerScopes: client?.connect?.scopes ?? [],
					cfg
				}).target
			} : void 0;
			for (const [projection, catalog] of [[sessionInfo, sessionModelCatalog], [defaults, defaultModelCatalog]]) {
				if (!projection) continue;
				const provider = projection.modelProvider;
				const model = projection.model;
				if (typeof (catalog && provider && model ? findModelCatalogEntry(catalog, {
					provider,
					modelId: model
				}) : void 0)?.reasoning === "boolean" && provider && model) {
					Object.assign(projection, resolveGatewayModelThinkingProfile({
						cfg,
						agentId: sessionAgentId,
						provider,
						model,
						modelCatalog: catalog,
						agentRuntime: projection.agentRuntime?.id,
						sessionKey: projection === sessionInfo ? canonicalKey : void 0,
						providerPolicySource: "active"
					}));
					projection.thinkingOptions = projection.thinkingLevels?.map(({ label }) => label);
					continue;
				}
				delete projection.thinkingLevels;
				delete projection.thinkingOptions;
				projection.thinkingDefault = resolveAgentConfig(cfg, sessionAgentId)?.thinkingDefault ?? (provider && model ? resolveConfiguredThinkingDefaultCore({
					cfg,
					provider,
					model
				}) : cfg.agents?.defaults?.thinkingDefault);
			}
			const thinkingLevel = sessionInfo?.thinkingLevel ?? sessionInfo?.thinkingDefault ?? defaults?.thinkingDefault;
			const verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
			if (sessionInfo) sessionInfo.verboseLevel = verboseLevel;
			const inFlightRun = resolveInFlightRunSnapshot({
				chatAbortControllers: context.chatAbortControllers,
				chatRunState: context.chatRunState,
				requestedSessionKey: sessionKey,
				canonicalSessionKey: canonicalKey,
				agentId: sessionAgentId,
				defaultAgentId: compatibilityOwnerAgentId
			}) ?? embeddedRecovery;
			if (cursor !== void 0) return async () => {
				if (!sessionInfo || !sessionId || !storePath || resolveClaudeCliBindingSessionId(entry)) {
					respond(true, { kind: "reset" });
					return;
				}
				const sessionSnapshot = buildGatewaySessionSnapshot({
					sessionRow: sessionInfo,
					agentId: sessionAgentId,
					includeSession: true,
					activeRunState
				});
				let delta;
				try {
					delta = await readChatHistoryDelta({
						agentId: sessionAgentId,
						cursor,
						maxBytes: maxHistoryBytes,
						scope: {
							agentId: sessionAgentId,
							sessionEntry: entry,
							sessionId,
							sessionKey: canonicalKey,
							storePath
						},
						sessionKey: canonicalKey,
						sessionSnapshot,
						incognito: entry?.incognito
					}, signal);
				} catch (error) {
					const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
					if (unavailableMessage === void 0) throw error;
					respondChatHistoryUnavailable(method, respond, unavailableMessage);
					return;
				}
				return withReadySessionRows(rowProjection, queries, (publicationRead) => {
					const publicationSharing = readCurrentSharing(publicationRead);
					if (!publicationSharing) return;
					if (publicationSharing.visibility !== currentSharing.visibility || publicationSharing.sharingRole !== currentSharing.sharingRole) {
						respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
						return;
					}
					if (delta.kind === "reset") {
						respond(true, delta);
						return;
					}
					sessionInfo.activeLeafEntryId = delta.activeLeafEntryId;
					const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
						snapshot: inFlightRun,
						messages: delta.messages,
						getMessagesBytes: () => delta.messagesBytes,
						maxBytes: maxHistoryBytes - delta.activityBytes
					});
					respond(true, {
						kind: "delta",
						messages: delta.messages,
						...delta.activity.length > 0 ? { activity: delta.activity } : {},
						deltaCursor: delta.deltaCursor,
						pendingInputs,
						...inputReceipts ? {
							inputReceipts,
							inputConsumptions
						} : {},
						sessionInfo,
						...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
						...startupMetadata ? { metadata: startupMetadata } : {}
					});
				});
			};
			const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
				snapshot: inFlightRun,
				messages: capped,
				getMessagesBytes: () => byteCounter.messagesBytes(capped),
				maxBytes: responseHistoryBytes
			});
			respond(true, {
				sessionKey,
				sessionId,
				messages: composeTranscriptDisplay(capped),
				...capped.some((message) => activity.has(message)) ? { activity: capped.flatMap((message) => activity.get(message) ?? []) } : {},
				pendingInputs,
				...inputReceipts ? {
					inputReceipts,
					inputConsumptions
				} : {},
				...historyPage.deltaCursor ? { deltaCursor: historyPage.deltaCursor } : {},
				...historyPage.responseOffset !== void 0 ? { offset: historyPage.responseOffset } : {},
				...hasMore ? { nextOffset: candidateNextOffset } : {},
				...hasMore !== void 0 ? { hasMore } : {},
				...pagination !== void 0 ? { totalMessages: pagination.totalMessages } : {},
				...historyPage.completeCliImport && !hasMore && historyBudgetPreserved ? { completeSnapshot: true } : {},
				defaults,
				sessionInfo,
				thinkingLevel,
				fastMode: entry?.fastMode,
				toolOverrides: entry?.toolOverrides,
				verboseLevel,
				...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
				...startupMetadata ? { metadata: startupMetadata } : {}
			});
		}))?.();
	} finally {
		selection.release();
	}
}
const chatHistoryHandlers = {
	"chat.history": (opts) => handleChatHistoryRequest({
		...opts,
		method: "chat.history"
	}),
	"chat.startup": (opts) => handleChatStartupRequest(opts, handleChatHistoryRequest, respondChatHistoryUnavailable),
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
export { handleChatHistoryRequest as n, projectPendingInputMessage as r, chatHistoryHandlers as t };
