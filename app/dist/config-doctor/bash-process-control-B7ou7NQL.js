import { d as hasActiveBackgroundExecSession, u as getSession } from "./bash-process-registry-D03BGdo6.js";
import { t as getProcessSupervisor } from "./supervisor-CZKOD-vs.js";
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
