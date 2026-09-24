import { N as resolveActiveReplyRunOwnerForSignal } from "./reply-run-registry.state-0DtmpREE.mjs";
import { a as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-CdSzto1l.mjs";
import { T as resolveActiveEmbeddedRunOwnerByRunId, b as queueEmbeddedAgentMessageWithOutcomeAsync, n as abortEmbeddedAgentRun, x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-CgiowlON.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-BihqvttO.mjs";
//#region src/talk/agent-run-control.runtime.ts
const realtimeVoiceControlRuntime = {
	abortEmbeddedAgentRun,
	queueEmbeddedAgentMessageWithOutcomeAsync,
	queueGuardedEmbeddedAgentMessageWithOutcomeAsync,
	resolveActiveEmbeddedRunOwnerByRunId,
	resolveActiveEmbeddedRunSessionId,
	resolveActiveReplyRunOwnerForSignal,
	getDiagnosticSessionActivitySnapshot
};
//#endregion
export { realtimeVoiceControlRuntime };
