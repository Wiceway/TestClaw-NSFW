import { a as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-pyrECV9q.js";
import { U as resolveActiveReplyRunOwnerForSignal } from "./reply-run-registry.registry-HFAU31nF.js";
import { T as resolveActiveEmbeddedRunOwnerByRunId, b as queueEmbeddedAgentMessageWithOutcomeAsync, n as abortEmbeddedAgentRun, x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-CKg3ezhN.js";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B6zm9PS3.js";
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
