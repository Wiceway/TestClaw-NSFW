import { I as resolveTimestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as redactIdentifier } from "./node-crypto-B8Y3L7k8.mjs";
import { a as prepareTranscriptPayloadForReuse } from "./transcript-payload-4tGRkf4_.mjs";
import { n as assertOwnedTranscriptWriteCommit, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-DD1eJxQX.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-DBEv8hMW.mjs";
import { g as toDatabaseOptions, m as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import { S as consumeSessionPendingInput, j as resolveSessionPendingInputAppend } from "./session-accessor.sqlite-entry-store-Ct1v5fIu.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-lHKSo6QB.mjs";
import { C as readTranscriptIdentityByEventId, F as resolveTranscriptMessageAppendParent, N as isTranscriptEntryOnActivePathInTransaction } from "./session-accessor.sqlite-read-jqSNqbjI.mjs";
import { a as isAssistantDeliveryMirrorAssistantMessage } from "./transcript-only-testclaw-assistant-DMb_WNdn.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-Cvvo_Q35.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-DmnyZK9x.mjs";
import { a as ensureTranscriptHeader, c as readTranscriptMessageByScopedIdempotencyKey, l as redactTranscriptMessageForStorage, s as readTranscriptMessageByEventId, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-oZ7bC7_7.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-message-append.ts
var TranscriptTurnAdmissionConflictError = class extends Error {
	constructor(idempotencyKey) {
		super(`Transcript idempotency key "${idempotencyKey}" conflicts with the admitted message.`);
		this.name = "TranscriptTurnAdmissionConflictError";
	}
};
function messagesMatchForIdempotentReplay(stored, candidate) {
	const storedDelivery = isRecord(stored) ? stored.testclawDelivery : void 0;
	const legacyMediaMirror = isRecord(stored) && isAssistantDeliveryMirrorAssistantMessage(stored) && stored.api === "testclaw-transcript" && (storedDelivery === void 0 || isRecord(storedDelivery) && !Object.hasOwn(storedDelivery, "mediaUrls"));
	const serializedShape = (message, projectLegacyMedia = false) => {
		if (!isRecord(message)) return message;
		const { timestamp: _timestamp, ...stable } = message;
		if (projectLegacyMedia && isRecord(stable.testclawDelivery) && Array.isArray(stable.testclawDelivery.mediaUrls) && stable.testclawDelivery.mediaUrls.every((url) => typeof url === "string")) {
			const { mediaUrls: _mediaUrls, ...delivery } = stable.testclawDelivery;
			if (storedDelivery === void 0 && Object.keys(delivery).length === 0) delete stable.testclawDelivery;
			else stable.testclawDelivery = delivery;
		}
		const serialized = JSON.stringify(stable);
		return serialized === void 0 ? void 0 : JSON.parse(serialized);
	};
	return isDeepStrictEqual(serializedShape(stored), serializedShape(candidate, legacyMediaMirror));
}
function serializePreparedMessageEvent(envelope, messageJson) {
	return `${JSON.stringify(envelope).slice(0, -1)},"message":${messageJson}}`;
}
/** SessionManager owns a detached JSON message and retains this preparation across retries. */
function prepareTranscriptMessageAppend(options, candidate) {
	if (!isRecord(options.message) || options.message.role !== "assistant" && options.message.role !== "toolResult") return;
	const message = redactTranscriptMessageForStorage(options.message, options);
	const messageJson = JSON.stringify(canonicalizePersistedUserMessageMedia(message).message);
	const prepared = {
		messageJson,
		persistedMessage: JSON.parse(messageJson)
	};
	if (!candidate) return prepared;
	const eventJson = serializePreparedMessageEvent(candidate.envelope, messageJson);
	const read = withAssistantAgentDatabaseReadOnly(({ db }) => prepareTranscriptPayloadForReuse(db, eventJson, {
		...candidate.envelope,
		message: prepared.persistedMessage
	}), toDatabaseOptions(resolveSqliteTranscriptScope(candidate.scope)));
	return read.found ? {
		...prepared,
		physicalPayload: read.value
	} : prepared;
}
function appendTranscriptMessageInTransaction(database, resolved, options, preparedMessage, projection) {
	const pending = resolveSessionPendingInputAppend(database, resolved, options.message);
	if (pending && readSessionEntryRow(database, resolved.sessionKey)?.entry.sessionId !== resolved.sessionId) throw new Error("Pending input session changed before transcript promotion");
	const serializeForStorage = (message) => preparedMessage?.persistedMessage ?? (options.messageAlreadyRedacted ? message : redactTranscriptMessageForStorage(message, options));
	const readAnchor = (params) => readActiveTranscriptEntryAnchorInTransaction({
		database,
		resolved,
		entryId: params.messageId,
		message: params.message
	});
	const existingAppendResult = (found) => {
		const anchor = readAnchor(found);
		if (pending) {
			if (found.messageId !== pending.inputId || !messagesMatchForIdempotentReplay(found.message, pending.message)) throw new TranscriptTurnAdmissionConflictError(pending.inputId);
			if (!anchor && !isTranscriptEntryOnActivePathInTransaction(database, resolved.sessionId, found.messageId)) throw new Error("Pending input is no longer active in its admitted transcript");
			consumeSessionPendingInput(database, pending);
		}
		return {
			appended: false,
			...anchor ? { anchor } : {},
			effectiveParentId: readTranscriptIdentityByEventId(database, resolved.sessionId, found.messageId)?.parentId ?? null,
			message: found.message,
			messageId: found.messageId
		};
	};
	const idempotencyKey = readMessageIdempotencyKey(options.message);
	if (idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, serializeForStorage(options.message))) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	if (pending?.alreadyPromoted && !pending.stageRelocation) {
		const committed = readTranscriptMessageByEventId(database, resolved, pending.inputId);
		if (!committed) throw new Error("Pending input custody ended before transcript promotion");
		return existingAppendResult(committed);
	}
	const prepared = pending ? pending.message : options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(options.message) : options.message;
	if (prepared === void 0) return;
	const messageId = pending && !pending.alreadyPromoted ? pending.inputId : options.eventId ?? randomUUID();
	const now = options.now ?? Date.now();
	const finalMessage = pending ? prepared : serializeForStorage(prepared);
	if (!pending) options.beforeFreshMessageCommit?.();
	ensureTranscriptHeader(database, resolved, options.cwd);
	const parentId = resolveTranscriptMessageAppendParent(database, resolved.sessionId, options);
	const event = {
		type: "message",
		id: messageId,
		parentId: parentId ?? null,
		...options.appendMode ? { appendMode: options.appendMode } : {},
		timestamp: resolveTimestampMsToIsoString(now),
		message: preparedMessage?.persistedMessage ?? finalMessage
	};
	let eventJson;
	if (preparedMessage) {
		const { message: _message, ...envelope } = event;
		eventJson = serializePreparedMessageEvent(envelope, preparedMessage.messageJson);
	}
	const appended = appendTranscriptEventInTransaction(database, resolved, event, {
		...projection,
		eventJson,
		preparedPayload: preparedMessage?.physicalPayload,
		idempotencyKeyMode: options.idempotencyLookup === "caller-checked" ? "relocate-owner" : options.idempotencyLookup === "scan-assistant" ? "preserve-owner" : "dedupe"
	});
	if (!appended && idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	if (!appended) {
		const existing = readTranscriptMessageByEventId(database, resolved, messageId);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey ?? `event:${messageId}`);
			return existingAppendResult(existing);
		}
	}
	if (!appended) throw new Error(`SQLite transcript append did not insert message ${messageId}.`);
	const persistedMessage = preparedMessage?.persistedMessage ?? JSON.parse(appended).message;
	const anchor = readAnchor({
		message: persistedMessage,
		messageId
	});
	if (pending) {
		if (pending.stageRelocation) pending.stageRelocation(messageId);
		else consumeSessionPendingInput(database, pending);
	}
	return {
		appended: true,
		...anchor ? { anchor } : {},
		effectiveParentId: parentId ?? null,
		message: persistedMessage,
		messageId
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write-guard.ts
function resolveTranscriptAppendRefusal(entry, resolved, scope) {
	if (entry && entry.sessionId === resolved.sessionId && (scope.expectedLifecycleRevision === void 0 || entry.lifecycleRevision === scope.expectedLifecycleRevision) && (scope.expectedWriterRunId === void 0 || entry.activeWriterRunId === scope.expectedWriterRunId)) return;
	const identity = {
		agentIdHash: redactIdentifier(resolved.agentId),
		expectedSessionIdHash: redactIdentifier(resolved.sessionId),
		sessionKeyHash: redactIdentifier(resolved.sessionKey)
	};
	if (!entry) return {
		...identity,
		code: "session-entry-missing"
	};
	return {
		...identity,
		actualSessionIdHash: redactIdentifier(entry.sessionId),
		code: "session-rebound"
	};
}
function assertLockedTranscriptWriteAllowed(database, resolved, scope) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const fencedScope = {
		...scope,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey
	};
	assertOwnedTranscriptWriteCommit(fencedScope);
	if (fencedScope.expectedLifecycleRevision === void 0 && fencedScope.expectedWriterRunId === void 0) return;
	const fresh = readSessionEntryRow(database, resolved.sessionKey);
	const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
	if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
	return fresh?.entry;
}
//#endregion
export { prepareTranscriptMessageAppend as i, resolveTranscriptAppendRefusal as n, appendTranscriptMessageInTransaction as r, assertLockedTranscriptWriteAllowed as t };
