import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-_nFH9T9d.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { S as parseStrictPositiveInteger, u as asPositiveSafeInteger } from "./number-coercion-0M4tZV2c.js";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BBHaqzpY.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import "./session-key-AvQIavYt.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { o as readSessionTranscriptUpdateVersion, r as onInternalSessionTranscriptUpdate } from "./transcript-events-DSYwY5Fq.js";
import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-Dx_kHnY5.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-D0hbLMo0.js";
import { i as resolveSessionStoreKey } from "./session-store-key-DRl7Rrsc.js";
import { t as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS } from "./chat-display-projection.helpers-CRHULe2N.js";
import { r as readTranscriptMessageIdempotencyKey, t as attachAssistantTranscriptMeta } from "./session-transcript-entry-message-CmdK_pJw.js";
import { a as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-P5s__XmA.js";
import { s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-BpmBw41u.js";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DlmWzvmc.js";
import { v as resolveCurrentUserProfileDisplay } from "./session-utils-display-0bRfLd7U.js";
import { _ as resolveSessionSharingTarget } from "./session-sharing-policy-rVme8bnl.js";
import { E as createSessionListEntryFilter } from "./session-sharing-xa1VG8U2.js";
import "./session-utils-DyRtmfj4.js";
import { l as session_transcript_readers_exports } from "./session-transcript-readers-D3eaTHpA.js";
import { o as authorizeScopedGatewayHttpRequestOrReply, s as checkGatewayHttpRequestAuth, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-C8sXVcwB.js";
import { n as getHeader } from "./http-header-value-nMPtK0tB.js";
import { c as sendJson, l as sendMethodNotAllowed, m as setSseHeaders, s as sendInvalidRequest, t as SSE_CONTENT_TYPE, x as hasExplicitAcceptableMediaRange } from "./http-common-B6Aa-Wrt.js";
import "./http-utils-mwsAlJoy.js";
import { a as projectChatDisplayMessages, l as createSubagentCoordinationHistoryProjection, m as projectForwardedMessages, n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessagesWithState } from "./chat-display-projection-C8q6oDEf.js";
import { a as readChatHistoryMessageSeq, s as readIncrementalChatHistoryTail, t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-BELc1w8p.js";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-Djl_UhPC.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-history-snapshot.ts
/** Keep raw scan context inside the worker; only the completed page crosses isolates. */
async function readSessionHistorySnapshotKernel(params, options) {
	let rawMessages;
	let totalRawMessages;
	let transcriptPath;
	let projected;
	if (typeof params.limit !== "number") {
		const snapshot = await options.readers.readSessionMessagesWithSourceAsync(params.target, {
			mode: "full",
			reason: "session history cursor pagination",
			allowResetArchiveFallback: true,
			readOnly: options.readOnly
		});
		rawMessages = snapshot.messages;
		transcriptPath = snapshot.transcriptPath;
		projected = projectChatDisplayMessagesWithState(rawMessages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.maxChars ?? 8e3,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay }
		});
	} else {
		const cursorSeq = resolveCursorSeq(params.cursor);
		const tail = await readIncrementalChatHistoryTail({
			entry: params.target.sessionEntry,
			readScope: params.target,
			effectiveMaxChars: params.maxChars ?? 8e3,
			max: params.limit,
			maxBytes: getMaxChatHistoryMessagesBytes(),
			...cursorSeq === void 0 ? {} : { beforeSeq: cursorSeq },
			preserveProjectionContext: true,
			...options
		});
		projected = tail.projection;
		rawMessages = tail.rawMessages;
		totalRawMessages = tail.readPage.totalMessages;
		transcriptPath = tail.readPage.transcriptPath;
	}
	const rawHistoryMessages = toSessionHistoryMessages(rawMessages);
	const history = paginateSessionMessages(projected.messages, params.limit, params.cursor);
	if (typeof totalRawMessages === "number" && totalRawMessages > rawMessages.length && (!params.cursor || (readChatHistoryMessageSeq(rawHistoryMessages[0]) ?? 0) > 1)) {
		const firstSeq = readChatHistoryMessageSeq(history.messages[0] ?? rawHistoryMessages[0]);
		history.hasMore = true;
		if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
	}
	return {
		history,
		rawTranscriptSeq: totalRawMessages ?? readChatHistoryMessageSeq(rawHistoryMessages.at(-1)) ?? rawHistoryMessages.length,
		turnBoundaryPending: projected.turnBoundaryPending,
		assistantErrorPending: projected.assistantErrorPending,
		transcriptPath
	};
}
function resolveCursorSeq(cursor) {
	if (!cursor) return;
	const normalized = cursor.startsWith("seq:") ? cursor.slice(4) : cursor;
	if (!/^\d+$/.test(normalized)) return;
	const value = Number(normalized);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function toSessionHistoryMessages(messages) {
	return messages.filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message));
}
function buildPaginatedSessionHistory(params) {
	return {
		items: params.messages,
		messages: params.messages,
		hasMore: params.hasMore,
		...params.nextCursor ? { nextCursor: params.nextCursor } : {}
	};
}
function paginateSessionMessages(messages, limit, cursor) {
	const cursorSeq = resolveCursorSeq(cursor);
	let endExclusive = messages.length;
	if (typeof cursorSeq === "number") {
		endExclusive = messages.findIndex((message, index) => {
			const seq = readChatHistoryMessageSeq(message);
			if (typeof seq === "number") return seq >= cursorSeq;
			return index + 1 >= cursorSeq;
		});
		if (endExclusive < 0) endExclusive = messages.length;
	}
	let start = typeof limit === "number" && limit > 0 ? Math.max(0, endExclusive - limit) : 0;
	if (start > 0) {
		const pageSeqs = /* @__PURE__ */ new Set();
		let indexedStart = endExclusive;
		for (let index = start - 1; index >= 0; index--) {
			while (indexedStart > start) {
				const pageSeq = readChatHistoryMessageSeq(messages[--indexedStart]);
				if (pageSeq !== void 0) pageSeqs.add(pageSeq);
			}
			const seq = readChatHistoryMessageSeq(messages[index]);
			if (seq !== void 0 && pageSeqs.has(seq)) start = index;
		}
	}
	const paginatedMessages = messages.slice(start, endExclusive);
	const firstSeq = readChatHistoryMessageSeq(paginatedMessages[0]);
	return buildPaginatedSessionHistory({
		messages: paginatedMessages,
		hasMore: start > 0,
		...start > 0 && typeof firstSeq === "number" ? { nextCursor: String(firstSeq) } : {}
	});
}
//#endregion
//#region src/gateway/session-transcript-path.ts
const transcriptUpdatePaths = /* @__PURE__ */ new WeakMap();
const transcriptUpdateStorePaths = /* @__PURE__ */ new WeakMap();
/** Resolve a transcript file path into a stable comparison key. */
function resolveTranscriptPathForComparison(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return resolveRealpathOrAbsolute(trimmed);
}
/** Share path resolution across a normalized event's synchronous listener fan-out. */
function resolveTranscriptUpdatePathForComparison(update, source = "sessionFile") {
	const paths = source === "storePath" ? transcriptUpdateStorePaths : transcriptUpdatePaths;
	if (paths.has(update)) return paths.get(update);
	const resolved = resolveTranscriptPathForComparison(source === "storePath" ? update.target?.storePath : update.sessionFile);
	paths.set(update, resolved);
	return resolved;
}
//#endregion
//#region src/gateway/session-history-state.ts
async function readSessionHistorySnapshotAsync(params) {
	if (!params.target.storePath || params.target.sessionEntry?.incognito || isIncognitoSessionKey(params.target.sessionKey)) {
		const snapshot = await readSessionHistorySnapshotKernel(params, {
			readers: session_transcript_readers_exports,
			resolveCurrentUserProfileDisplay
		});
		const messages = projectForwardedMessages(snapshot.history.messages);
		return {
			...snapshot,
			history: {
				...snapshot.history,
				items: messages,
				messages
			}
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DN4pw2Js.js");
	const entry = params.target.sessionEntry;
	const snapshot = await readSessionHistoryPageInWorker({
		kind: "http",
		params: {
			...params,
			target: {
				...params.target,
				sessionEntry: entry ? {
					sessionId: entry.sessionId,
					updatedAt: entry.updatedAt,
					sessionStartedAt: entry.sessionStartedAt
				} : void 0
			}
		}
	});
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = projectForwardedMessages(snapshot.history.messages).map(project);
	return {
		...snapshot,
		history: {
			...snapshot.history,
			items: messages,
			messages
		}
	};
}
/** Tracks session-history SSE state and decides when inline appends are still valid. */
var SessionHistorySseState = class SessionHistorySseState {
	static fromSnapshot(params) {
		return new SessionHistorySseState(params);
	}
	constructor(params) {
		this.target = params.target;
		this.maxChars = params.maxChars ?? 8e3;
		this.limit = params.limit;
		this.cursor = params.cursor;
		const snapshot = params.snapshot;
		this.sentHistory = snapshot.history;
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(snapshot.transcriptPath);
	}
	snapshot() {
		return this.sentHistory;
	}
	retainRecentMessages(maxMessages) {
		if (this.sentHistory.messages.length <= maxMessages) return this.snapshot();
		const messages = this.sentHistory.messages.slice(-maxMessages);
		const firstSeq = readChatHistoryMessageSeq(messages[0]);
		this.sentHistory = buildPaginatedSessionHistory({
			messages,
			hasMore: true,
			...firstSeq !== void 0 ? { nextCursor: String(firstSeq) } : {}
		});
		return this.snapshot();
	}
	appendInlineMessage(update) {
		if (this.limit !== void 0 || this.cursor !== void 0) return null;
		const carriedSeq = asPositiveSafeInteger(update.messageSeq);
		if (carriedSeq !== void 0) {
			if (carriedSeq <= this.rawTranscriptSeq) return { shouldRefresh: true };
			this.rawTranscriptSeq = carriedSeq;
		} else this.rawTranscriptSeq += 1;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(update.message);
		let nextMessage = attachAssistantTranscriptMeta(update.message, {
			...typeof update.messageId === "string" ? { id: update.messageId } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			seq: this.rawTranscriptSeq
		});
		const hadPendingTurnBoundary = this.turnBoundaryPending;
		const subagentCoordination = this.target.storePath && !this.target.sessionEntry?.incognito && !isIncognitoSessionKey(this.target.sessionKey) ? createSessionHistorySubagentProjection(this.target, { deferSources: true }) : void 0;
		nextMessage = createSubagentCoordinationHistoryProjection(subagentCoordination)([nextMessage])[0];
		const nextProjection = projectChatDisplayMessagesWithState([nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			turnBoundaryPending: hadPendingTurnBoundary,
			assistantErrorPending: this.assistantErrorPending
		});
		this.turnBoundaryPending = nextProjection.turnBoundaryPending;
		this.assistantErrorPending = nextProjection.assistantErrorPending;
		if (nextProjection.assistantErrorRecoveryObserved) return { shouldRefresh: true };
		const projectedMessages = projectChatDisplayMessages([...this.sentHistory.messages, nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			resolveCurrentUserProfileDisplay
		});
		subagentCoordination?.assertCurrent?.();
		const projectedPrefix = projectedMessages.slice(0, this.sentHistory.messages.length);
		if (projectedMessages.length > this.sentHistory.messages.length && !isDeepStrictEqual(projectedPrefix, this.sentHistory.messages)) {
			this.sentHistory = buildPaginatedSessionHistory({
				messages: projectedMessages,
				hasMore: false
			});
			return { shouldRefresh: true };
		}
		if (projectedMessages.length > this.sentHistory.messages.length) {
			const addedMessages = projectedMessages.slice(this.sentHistory.messages.length);
			if (hadPendingTurnBoundary && !this.turnBoundaryPending) {
				const firstAdded = attachAssistantTranscriptMeta(addedMessages[0], { turnBoundary: true });
				addedMessages[0] = firstAdded;
				projectedMessages[this.sentHistory.messages.length] = firstAdded;
			}
			if (addedMessages.length > 1) {
				this.sentHistory = buildPaginatedSessionHistory({
					messages: projectedMessages,
					hasMore: false
				});
				return { shouldRefresh: true };
			}
			const projectedMessage = expectDefined(addedMessages[0], "projected inline message");
			const emittedMessage = readChatHistoryMessageSeq(projectedMessage) === void 0 ? attachAssistantTranscriptMeta(projectedMessage, { seq: this.rawTranscriptSeq }) : projectedMessage;
			this.sentHistory = buildPaginatedSessionHistory({
				messages: [...this.sentHistory.messages, emittedMessage],
				hasMore: false
			});
			return {
				message: emittedMessage,
				messageSeq: readChatHistoryMessageSeq(emittedMessage)
			};
		}
		if (nextProjection.messages.length === 0 && projectedMessages.length === this.sentHistory.messages.length) return null;
		this.sentHistory = buildPaginatedSessionHistory({
			messages: projectedMessages,
			hasMore: false
		});
		return { shouldRefresh: true };
	}
	shouldRefreshForTranscriptPath(updatePath) {
		const nextPath = normalizeTranscriptPathForComparison(updatePath);
		return Boolean(this.transcriptPath && nextPath && this.transcriptPath !== nextPath);
	}
	async refreshAsync() {
		const snapshot = await readSessionHistorySnapshotAsync({
			target: this.target,
			maxChars: this.maxChars,
			limit: this.limit,
			cursor: this.cursor
		});
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(snapshot.transcriptPath);
		this.sentHistory = snapshot.history;
		return snapshot.history;
	}
};
function normalizeTranscriptPathForComparison(filePath) {
	return typeof filePath === "string" ? resolveTranscriptPathForComparison(filePath) : void 0;
}
//#endregion
//#region src/gateway/sessions-history-http.ts
const log = createSubsystemLogger("gateway/sessions-history-sse");
const MAX_SESSION_HISTORY_LIMIT = 1e3;
function resolveSessionHistoryPath(url) {
	const match = url.pathname.match(/^\/sessions\/([^/]+)\/history$/);
	if (!match) return { matched: false };
	try {
		const sessionKey = normalizeOptionalString(decodeURIComponent(match[1] ?? ""));
		return sessionKey ? {
			matched: true,
			sessionKey
		} : {
			error: "invalid-session-key",
			matched: true
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
function shouldStreamSse(req) {
	return hasExplicitAcceptableMediaRange(getHeader(req, "accept"), SSE_CONTENT_TYPE);
}
function resolveLimit(url) {
	const raw = url.searchParams.get("limit");
	if (raw == null) return ok(void 0);
	const trimmed = raw.trim();
	const value = parseStrictPositiveInteger(trimmed);
	if (value !== void 0) return ok(Math.min(MAX_SESSION_HISTORY_LIMIT, value));
	if (/^\d+$/.test(trimmed) && /[1-9]/.test(trimmed)) return ok(MAX_SESSION_HISTORY_LIMIT);
	return err("limit must be a positive integer");
}
function sseWrite(res, event, payload) {
	res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
}
function resolveSessionHistoryHttpClient(requestAuth, scopes) {
	if (!requestAuth.authenticatedUserProfile) return null;
	return {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes
		},
		authenticatedUserProfile: requestAuth.authenticatedUserProfile
	};
}
/** Handle `/sessions/:sessionKey/history` JSON/SSE requests. */
async function handleSessionHistoryHttpRequest(req, res, opts) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const sessionKeyResolution = resolveSessionHistoryPath(url);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		operatorMethod: "chat.history",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg, requestAuth, operatorScopes } = authResult;
	let target;
	let entry;
	try {
		target = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: sessionKey,
			exactRead: true,
			readOnly: false
		});
		entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	} catch (error) {
		if (error?.code !== "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") throw error;
		sendJson(res, 409, {
			ok: false,
			error: {
				type: "migration_required",
				message: error instanceof Error ? error.message : String(error)
			}
		});
		return true;
	}
	const sendSessionNotFound = () => sendJson(res, 404, {
		ok: false,
		error: {
			type: "not_found",
			message: `Session not found: ${sessionKey}`
		}
	});
	const historyClient = resolveSessionHistoryHttpClient(requestAuth, operatorScopes);
	if (!entry?.sessionId || createSessionListEntryFilter({
		cfg,
		client: historyClient
	})?.(target.canonicalKey, entry) === false) {
		sendSessionNotFound();
		return true;
	}
	const limitResult = resolveLimit(url);
	if (!limitResult.ok) {
		sendInvalidRequest(res, limitResult.error);
		return true;
	}
	const limit = limitResult.value;
	const cursor = normalizeOptionalString(url.searchParams.get("cursor"));
	if (cursor !== void 0 && resolveCursorSeq(cursor) === void 0) {
		sendInvalidRequest(res, "cursor must be a positive integer");
		return true;
	}
	const effectiveMaxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
	const historyTarget = {
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	};
	const publishAuthorizedHistory = async (publish) => {
		const cfgLocal = getRuntimeConfig();
		const currentRequestAuth = await checkGatewayHttpRequestAuth({
			...opts,
			req,
			auth: opts.getResolvedAuth?.() ?? opts.auth,
			trustedProxies: cfgLocal.gateway?.trustedProxies,
			allowRealIpFallback: cfgLocal.gateway?.allowRealIpFallback,
			cfg: cfgLocal
		});
		if (!currentRequestAuth.ok || !requestAuth.hasCurrentClientAuthority()) return false;
		if (currentRequestAuth.requestAuth.authenticatedUserProfile?.profileId !== requestAuth.authenticatedUserProfile?.profileId) return false;
		const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, currentRequestAuth.requestAuth);
		if (!authorizeOperatorScopesForMethod("chat.history", requestedScopes).allowed) return false;
		const currentClient = resolveSessionHistoryHttpClient(currentRequestAuth.requestAuth, requestedScopes);
		const currentConfig = getRuntimeConfig();
		const currentTarget = resolveSessionSharingTarget({
			cfg: currentConfig,
			sessionKey: target.canonicalKey,
			agentId: target.agentId
		});
		if (currentTarget === null || currentTarget.agentId !== historyTarget.agentId || currentTarget.canonicalKey !== historyTarget.sessionKey || currentTarget.storePath !== historyTarget.storePath || currentTarget.entry.sessionId !== historyTarget.sessionId || currentTarget.entry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentTarget.entry.sessionStartedAt !== entry.sessionStartedAt || createSessionListEntryFilter({
			cfg: currentConfig,
			client: currentClient
		})?.(currentTarget.canonicalKey, currentTarget.entry) === false) return false;
		publish();
		return true;
	};
	const snapshotVersion = readSessionTranscriptUpdateVersion();
	let historySnapshot;
	try {
		historySnapshot = await readSessionHistorySnapshotAsync({
			cursor,
			target: historyTarget,
			limit,
			maxChars: effectiveMaxChars
		});
	} catch (error) {
		const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
		if (unavailableMessage === void 0) throw error;
		res.setHeader("Retry-After", "1");
		sendJson(res, 503, {
			ok: false,
			error: {
				type: "unavailable",
				message: unavailableMessage,
				retryable: true
			}
		});
		return true;
	}
	const stream = shouldStreamSse(req);
	if (!await publishAuthorizedHistory(() => {
		if (!stream) sendJson(res, 200, {
			sessionKey: target.canonicalKey,
			...historySnapshot.history
		});
	})) {
		sendSessionNotFound();
		return true;
	}
	if (!stream) return true;
	const historyStorePath = path.resolve(target.storePath);
	const historyLifecycleRevision = normalizeOptionalString(entry.lifecycleRevision);
	const historyDatabasePath = resolveTranscriptPathForComparison(target.readSource?.path);
	const transcriptCandidates = new Set(resolveSessionTranscriptCandidates(historyTarget.sessionId, target.storePath, void 0, target.agentId).map((candidate) => resolveTranscriptPathForComparison(candidate)).filter((candidate) => typeof candidate === "string"));
	const sseState = SessionHistorySseState.fromSnapshot({
		target: historyTarget,
		maxChars: effectiveMaxChars,
		limit,
		cursor,
		snapshot: historySnapshot
	});
	let streamStopped = false;
	let streamQueue = Promise.resolve();
	let pendingRefresh;
	const streamResources = {};
	function writeStreamHistory(snapshot) {
		sseWrite(res, "history", {
			sessionKey: target.canonicalKey,
			...snapshot
		});
		sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
	}
	async function publishStream(publish) {
		if (!await publishAuthorizedHistory(() => {
			if (!isStreamClosed()) publish();
		})) closeStream();
	}
	function releaseStreamResources() {
		if (streamStopped) return;
		streamStopped = true;
		if (streamResources.heartbeat) clearInterval(streamResources.heartbeat);
		if (streamResources.unsubscribe) streamResources.unsubscribe();
	}
	function detachStreamListeners() {
		req.off("close", handleRequestStreamClose);
		req.off("error", handleRequestStreamError);
		res.off("close", handleResponseStreamClose);
		res.off("finish", handleResponseStreamFinish);
		res.off("error", handleResponseStreamError);
	}
	function closeStream() {
		releaseStreamResources();
		if (!res.writableEnded && !res.destroyed) res.end();
	}
	function handleRequestStreamClose() {
		releaseStreamResources();
		req.off("close", handleRequestStreamClose);
		req.off("error", handleRequestStreamError);
	}
	function handleRequestStreamError(error) {
		log.warn("session history SSE request stream errored; closing stream", { error });
		closeStream();
	}
	function handleResponseStreamFinish() {
		releaseStreamResources();
		res.off("finish", handleResponseStreamFinish);
	}
	function handleResponseStreamClose() {
		releaseStreamResources();
		detachStreamListeners();
	}
	function handleResponseStreamError(error) {
		log.warn("session history SSE response stream errored; cleaning up stream", { error });
		releaseStreamResources();
	}
	const isStreamClosed = () => streamStopped || res.writableEnded || res.destroyed;
	req.on("close", handleRequestStreamClose);
	req.on("error", handleRequestStreamError);
	res.on("close", handleResponseStreamClose);
	res.on("finish", handleResponseStreamFinish);
	res.on("error", handleResponseStreamError);
	setSseHeaders(res);
	res.write("retry: 1000\n\n");
	if (isStreamClosed()) return true;
	const queueStreamWork = (work) => {
		streamQueue = streamQueue.then(() => isStreamClosed() ? void 0 : work()).catch((error) => {
			log.warn("session history SSE stream work failed; closing stream", { error });
			closeStream();
		});
	};
	const queueStreamRefresh = () => {
		if (pendingRefresh) return;
		const refresh = async () => {
			await publishStream(() => {
				if (pendingRefresh === refresh) pendingRefresh = void 0;
			});
			if (!isStreamClosed()) {
				const snapshot = await sseState.refreshAsync();
				await publishStream(() => writeStreamHistory(snapshot));
			}
		};
		pendingRefresh = refresh;
		queueStreamWork(refresh);
	};
	queueStreamWork(async () => {
		if (snapshotVersion !== readSessionTranscriptUpdateVersion()) await sseState.refreshAsync();
		await publishStream(() => writeStreamHistory(sseState.snapshot()));
	});
	streamResources.heartbeat = setInterval(() => {
		queueStreamWork(() => publishStream(() => res.write(": keepalive\n\n")));
	}, 15e3);
	streamResources.unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const updateTarget = update.target;
		const updateMatchesIdentity = updateTarget?.sessionId === historyTarget.sessionId && normalizeAgentId(updateTarget.agentId) === normalizeAgentId(target.agentId) && (updateTarget.sessionKey === historyTarget.sessionKey || resolveSessionStoreKey({
			cfg: getRuntimeConfig(),
			sessionKey: updateTarget.sessionKey,
			storeAgentId: target.agentId
		}) === historyTarget.sessionKey);
		const updateLifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
		if (updateTarget && !updateMatchesIdentity) return;
		const updatePath = resolveTranscriptUpdatePathForComparison(update);
		if (!updateMatchesIdentity && (!updatePath || !transcriptCandidates.has(updatePath))) return;
		if (updateLifecycleRevision !== historyLifecycleRevision || update.message === void 0 || limit !== void 0 || cursor !== void 0) {
			queueStreamRefresh();
			return;
		}
		const updateStorePath = updateTarget?.storePath ? path.resolve(updateTarget.storePath) : void 0;
		const updateMatchesStore = updateStorePath?.endsWith(".sqlite") ? historyDatabasePath !== void 0 && resolveTranscriptUpdatePathForComparison(update, "storePath") === historyDatabasePath : updateStorePath === historyStorePath;
		if (updateTarget?.sessionKey !== historyTarget.sessionKey || !updateMatchesStore) {
			queueStreamRefresh();
			return;
		}
		pendingRefresh = void 0;
		queueStreamWork(async () => {
			let refresh = false;
			await publishStream(() => {
				refresh = sseState.shouldRefreshForTranscriptPath(updatePath);
				if (refresh) return;
				const nextEvent = sseState.appendInlineMessage({
					message: update.message,
					messageId: update.messageId,
					messageSeq: update.messageSeq
				});
				refresh = nextEvent?.shouldRefresh === true;
				if (refresh || nextEvent?.message === void 0) return;
				sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
				sseWrite(res, "message", {
					sessionKey: target.canonicalKey,
					message: nextEvent.message,
					...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
					messageSeq: nextEvent.messageSeq
				});
			});
			if (refresh && !isStreamClosed()) {
				const snapshot = await sseState.refreshAsync();
				await publishStream(() => writeStreamHistory(snapshot));
			}
		});
	});
	return true;
}
//#endregion
export { handleSessionHistoryHttpRequest };
