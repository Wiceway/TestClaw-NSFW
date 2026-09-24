import { d as hasActiveBackgroundExecSession, u as getSession } from "./bash-process-registry-H3slo6SX.mjs";
import { t as getProcessSupervisor } from "./supervisor-DBtmUeXo.mjs";
//#region src/agents/bash-process-control.ts
function isBackgroundExecSessionActive(sessionId) {
	return hasActiveBackgroundExecSession(sessionId);
}
function cancelBackgroundExecSession(sessionId) {
	const session = getSession(sessionId);
	if (!session?.backgrounded || session.exited || session.finalizing) return false;
	const supervisor = getProcessSupervisor();
	if (!session.processActivity || session.processActivity.resultSettled) return false;
	supervisor.cancel(sessionId, "manual-cancel");
	session.cancellationRequested = true;
	return true;
}
//#endregion
export { isBackgroundExecSessionActive as n, cancelBackgroundExecSession as t };
