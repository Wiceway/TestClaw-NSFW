import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DlmWzvmc.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import "./session-utils-DyRtmfj4.js";
//#region src/gateway/server-methods/chat-aborted-partial.ts
function withAbortedPartialPersistenceWarning(error, warning) {
	return warning ? {
		...error,
		message: `${error.message} ${warning}`
	} : error;
}
/** Retain a failed save when a later cancellation or terminal write also fails. */
function abortedPartialPersistenceError(error, warning) {
	if (!warning) return error;
	const message = `${formatErrorMessage(error)} ${warning}`;
	return error instanceof SessionMutationAuthorizationChangedError ? new SessionMutationAuthorizationChangedError({
		...error.error,
		message
	}) : new Error(message, { cause: error });
}
/** Capture before signaling cancellation, without loading asynchronous transcript writers. */
function captureAbortedPartial(params) {
	const { runId, abortOrigin } = params;
	try {
		const session = params.session ?? {
			ok: true,
			value: loadGatewaySessionEntry(params.sessionKey, params.agentId ? { agentId: params.agentId } : void 0)
		};
		if (!session.ok) throw session.error;
		const { cfg, storePath, entry, canonicalKey, agentId } = session.value;
		if (entry?.sessionId !== params.sessionId) throw new Error("Aborted partial transcript session changed before persistence");
		return {
			runId,
			abortOrigin,
			ok: true,
			value: {
				sessionKey: canonicalKey,
				sessionId: params.sessionId,
				expectedSessionId: params.sessionId,
				expectedLifecycleRevision: entry.lifecycleRevision ?? null,
				agentId,
				storePath,
				cfg,
				message: params.text,
				createIfMissing: true,
				idempotencyKey: `${runId}:assistant`,
				abortMeta: {
					aborted: true,
					origin: abortOrigin,
					runId
				}
			}
		};
	} catch (error) {
		return {
			runId,
			abortOrigin,
			ok: false,
			error
		};
	}
}
//#endregion
export { captureAbortedPartial as n, withAbortedPartialPersistenceWarning as r, abortedPartialPersistenceError as t };
