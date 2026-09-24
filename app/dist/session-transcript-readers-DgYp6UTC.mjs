import { n as __exportAll } from "./rolldown-runtime-B000p9w_.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isIncognitoSessionKey } from "./session-key-B8Cn8Xls.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C_bfgyCp.mjs";
import { r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DCABr_1E.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-DGwPGE_D.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-BDowgQjd.mjs";
import { d as visitSessionTranscriptMessageEvents, u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-CM5yNO6K.mjs";
import { t as attachAssistantTranscriptMeta } from "./session-transcript-entry-message-B9L4-NZg.mjs";
import { t as capArrayByJsonBytes } from "./session-utils.fs-nfOUufcZ.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-BaMdTvHU.mjs";
import { n as readSessionTranscriptHistoryEventCount } from "./session-accessor.sqlite-history-events-BdEPy7lb.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-dosxJqOy.mjs";
//#region src/gateway/session-transcript-readers.ts
var session_transcript_readers_exports = /* @__PURE__ */ __exportAll({
	attachAssistantTranscriptMeta: () => attachAssistantTranscriptMeta,
	capArrayByJsonBytes: () => capArrayByJsonBytes,
	readRecentSessionMessagesWithStatsAsync: () => readRecentSessionMessagesWithStatsAsync,
	readSessionMessageByIdAsync: () => readSessionMessageByIdAsync,
	readSessionMessageCountAsync: () => readSessionMessageCountAsync,
	readSessionMessagesAroundIdWithStatsAsync: () => readSessionMessagesAroundIdWithStatsAsync,
	readSessionMessagesAsync: () => readSessionMessagesAsync,
	readSessionMessagesMatchingIdAsync: () => readSessionMessagesMatchingIdAsync,
	readSessionMessagesPageWithStatsAsync: () => readSessionMessagesPageWithStatsAsync,
	readSessionMessagesWithSourceAsync: () => readSessionMessagesWithSourceAsync,
	readSessionTranscriptVisibleMessageDeltaCore: () => readSessionTranscriptVisibleMessageDeltaCore,
	visitSessionMessagesAsync: () => visitSessionMessagesAsync
});
const sessionTranscriptReader = createSessionTranscriptReader({
	resolveTarget: resolveTranscriptReadTarget,
	readSnapshot: async (target, read, options) => {
		const scope = toTranscriptReadScope(target);
		return readRestoredSessionTranscript(scope, () => withCurrentProjectionSnapshot(scope, read, options), options);
	}
});
const { readSessionMessagesAsync, readSessionMessagesWithSourceAsync, readSessionMessageByIdAsync, readRecentSessionMessagesWithStatsAsync, readSessionMessagesPageWithStatsAsync, readSessionMessagesAroundIdWithStatsAsync } = sessionTranscriptReader;
/** Keep exact membership and its full-history validation in the admitted history worker. */
async function readSessionMessagesMatchingIdAsync(scope, messageId) {
	if (isIncognitoSessionKey(scope.sessionKey) || scope.storePath && isIncognitoAssistantAgentSqlitePath(scope.storePath, {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	})) return sessionTranscriptReader.readSessionMessagesMatchingIdAsync(scope, messageId);
	const { bindSessionTranscriptStoreScope } = await import("./session-accessor.transcript-target-DxavwZzp.mjs");
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-Nv1a0-vL.mjs");
	const target = bindSessionTranscriptStoreScope(scope);
	return readSessionHistoryPageInWorker({
		kind: "message-lookup",
		params: {
			target: {
				agentId: target.agentId,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				storePath: target.storePath,
				sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0
			},
			messageId
		}
	});
}
/** Visits raw message payloads within the SQLite read snapshot. */
async function visitSessionMessagesAsync(scope, visit) {
	const transcriptScope = toTranscriptReadScope(await resolveTranscriptReadTarget(scope));
	return readRestoredSessionTranscript(transcriptScope, () => {
		let count = 0;
		visitSessionTranscriptMessageEvents(transcriptScope, (entry) => {
			const message = asOptionalRecord(entry.event)?.message;
			if (message !== void 0) {
				visit(message, entry.seq);
				count += 1;
			}
		});
		return count;
	});
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const target = await resolveTranscriptReadTarget(scope);
	const transcriptScope = toTranscriptReadScope(target);
	const readCount = () => readRestoredSessionTranscript(transcriptScope, () => readSessionTranscriptHistoryEventCount(transcriptScope));
	try {
		return await readCount();
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(transcriptScope);
		return await readCount();
	}
}
//#endregion
export { readSessionMessagesAsync as a, readSessionMessagesWithSourceAsync as c, readSessionMessagesAroundIdWithStatsAsync as i, session_transcript_readers_exports as l, readSessionMessageByIdAsync as n, readSessionMessagesMatchingIdAsync as o, readSessionMessageCountAsync as r, readSessionMessagesPageWithStatsAsync as s, readRecentSessionMessagesWithStatsAsync as t, visitSessionMessagesAsync as u };
