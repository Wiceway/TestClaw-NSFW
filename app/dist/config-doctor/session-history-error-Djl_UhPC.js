import { r as WorkerTaskError } from "./worker-task-pool-DdST9izh.js";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-D01U6hs1.js";
//#region src/gateway/session-history-error.ts
function resolveSessionHistoryUnavailableMessage(error) {
	if (isSessionTranscriptProjectionUnavailableError(error)) return "session history is rebuilding; retry shortly";
	if (!(error instanceof WorkerTaskError)) return;
	switch (error.code) {
		case "overloaded": return "session history is busy; retry shortly";
		case "unavailable": return "session history is temporarily unavailable; retry shortly";
		case "timeout": return "session history read timed out; retry shortly";
		default: return;
	}
}
//#endregion
export { resolveSessionHistoryUnavailableMessage as t };
