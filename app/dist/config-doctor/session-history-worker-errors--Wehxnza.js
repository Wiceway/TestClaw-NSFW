import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.js";
import { n as retainAssistantStateWorkerErrorPayload, t as hydrateAssistantStateWorkerError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-Dw0_36rK.js";
import { i as SessionTranscriptReadFenceError, n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-D01U6hs1.js";
//#region src/config/sessions/session-history-worker-errors.ts
/** A later display reset may leave this failed visibility lookup unconsumed. */
var SessionHistoryDeltaPreparationError = class extends Error {
	constructor(partial, cause) {
		super("Session history visibility preparation failed", { cause });
		this.partial = partial;
	}
};
function unwrapSessionTranscriptWorkerReply(reply) {
	if (reply.ok) return reply.value;
	if (reply.error.kind === "delta-visibility") throw new SessionHistoryDeltaPreparationError(reply.error.partial);
	if (reply.error.kind === "read-error") {
		const error = new Error(reply.error.message);
		retainAssistantStateWorkerErrorPayload(error, reply.error.payload);
		throw hydrateAssistantStateWorkerError(error, { includeOrdinary: true });
	}
	if (reply.error.kind === "storage") throw new SessionTranscriptStorageUnavailableError(reply.error.reason);
	if (reply.error.kind === "cold") throw new SessionTranscriptColdError(reply.error.sessionId);
	if (reply.error.kind === "projection") throw new SessionTranscriptProjectionUnavailableError(reply.error.sessionId);
	if (reply.error.kind === "syntax") throw new SyntaxError(reply.error.message);
	throw new SessionTranscriptReadFenceError(reply.error.message);
}
/** Keep read and cleanup failures together through the worker error graph. */
function sessionHistoryCleanupError(error, cleanupError, stage) {
	return new AggregateError([error, cleanupError], `${coerceErrorMessage(error)}; ${stage} failed: ${coerceErrorMessage(cleanupError)}`, { cause: cleanupError });
}
//#endregion
export { sessionHistoryCleanupError as n, unwrapSessionTranscriptWorkerReply as r, SessionHistoryDeltaPreparationError as t };
