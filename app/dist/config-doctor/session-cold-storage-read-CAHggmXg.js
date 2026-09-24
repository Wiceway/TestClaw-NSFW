import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-Dw0_36rK.js";
//#region src/config/sessions/session-cold-storage-read.ts
/** The cold marker and hot rows must belong to one snapshot, including cached statement lookups. */
function readHotSessionTranscriptSnapshot(database, sessionId, purpose, read) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, sessionId);
		return read();
	}, { operationLabel: `session transcript ${purpose} read` });
}
/** A peer can archive after restoration settles but before the read completes. */
async function readRestoredSessionTranscript(scope, read, options) {
	options?.assertCurrent?.();
	if (options?.readOnly) return read();
	for (let restorations = 0;; restorations++) {
		options?.assertCurrent?.();
		try {
			return await read();
		} catch (error) {
			if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== scope.sessionId || restorations === 2) throw error;
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-BtPaMmVG.js");
			await restoreSessionColdTranscript(scope, options?.assertCurrent, options?.coldRead);
		}
	}
}
//#endregion
export { readRestoredSessionTranscript as n, readHotSessionTranscriptSnapshot as t };
