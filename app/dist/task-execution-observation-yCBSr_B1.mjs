import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { A as parseAgentSessionKey } from "./session-key-C_bfgyCp.mjs";
import { c as getAgentRunContext, p as hasLiveAgentRunContext } from "./agent-run-registry-DmVqATcC.mjs";
import { E as readTaskBackingInstance, G as resolveTaskAgentId } from "./task-registry.store.kernel-CTpG8C0S.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { r as getTaskActivitySnapshot } from "./task-registry-activity-CD1JyNcp.mjs";
import { c as sanitizeTaskStatusText } from "./task-status-D8Q1DzVF.mjs";
import { n as isBackgroundExecTask } from "./background-exec-task-contract-DDYMoYd-.mjs";
import { s as getActiveBackgroundExecSession } from "./bash-process-registry-H3slo6SX.mjs";
import { t as getSubagentExecutionObservation } from "./subagent-execution-observation-BvwYgbN9.mjs";
import { t as isAgentRunWaitingForCapacity } from "./agent-run-capacity-wait-200mt_93.mjs";
//#region src/tasks/task-execution-observation.ts
function sanitizeOptionalTaskText(value) {
	return sanitizeTaskStatusText(value, { maxChars: 120 }) || void 0;
}
function observeCliExecution(task) {
	if (task.runtime !== "cli" || !task.runId) return;
	const context = getAgentRunContext(task.runId);
	const sessionKey = task.childSessionKey ?? (task.scopeKind === "session" ? task.ownerKey : void 0);
	if (!context || !sessionKey || context.sessionKey !== sessionKey || !hasLiveAgentRunContext(task.runId)) return;
	const agentId = context.agentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	const taskAgentId = resolveTaskAgentId(task);
	if (taskAgentId && (!agentId || normalizeAgentId(agentId) !== normalizeAgentId(taskAgentId))) return;
	return isAgentRunWaitingForCapacity(task.runId) ? "queued" : "running";
}
/** One runtime observation for Gateway inspection and model-facing task controls. */
function getTaskExecutionObservation(task) {
	const activity = getTaskActivitySnapshot(task.taskId);
	const fixedState = task.status === "lost" ? "unknown" : isTerminalTaskStatus(task.status) ? "finished" : task.status === "queued" && task.runtime !== "subagent" ? "queued" : void 0;
	if (fixedState) return {
		state: fixedState,
		...activity?.lastActivityAt !== void 0 ? { lastActivityAt: activity.lastActivityAt } : {}
	};
	if (isBackgroundExecTask(task)) {
		const process = task.sourceId ? getActiveBackgroundExecSession(task.sourceId) : void 0;
		if (!process || process.startedAt !== task.startedAt || process.sessionKey !== task.ownerKey) return { state: "unknown" };
		const finalizing = process.finalizing || process.processActivity?.resultSettled;
		return {
			state: finalizing ? "waiting" : "running",
			...finalizing ? { wait: { kind: "external" } } : {},
			lastActivityAt: Math.max(process.processActivity?.lastOutputAtMs ?? process.startedAt, activity?.lastActivityAt ?? 0)
		};
	}
	const backing = readTaskBackingInstance(task.detail);
	const registeredExecution = task.runtime === "subagent" && task.runId && task.childSessionKey ? getSubagentExecutionObservation({
		taskRunId: task.runId,
		childSessionKey: task.childSessionKey,
		...backing?.runtime === "subagent" ? { generation: backing.generation } : {}
	}) : void 0;
	const nativeExecution = registeredExecution ? {
		state: registeredExecution.state,
		...registeredExecution.wait ? { wait: registeredExecution.wait } : {}
	} : void 0;
	const currentActivity = backing?.runtime === "subagent" && !registeredExecution || registeredExecution && activity?.executionRunId !== registeredExecution.executionRunId ? void 0 : activity;
	const execution = nativeExecution ?? {
		state: currentActivity?.executionState ?? observeCliExecution(task) ?? "unknown",
		...currentActivity?.executionWait ? { wait: currentActivity.executionWait } : {}
	};
	if (execution.state === "running" && (currentActivity?.executionState || currentActivity?.executionWait)) {
		execution.state = currentActivity.executionState ?? "waiting";
		execution.wait = currentActivity.executionWait;
	}
	if (activity?.lastActivityAt !== void 0) execution.lastActivityAt = activity.lastActivityAt;
	const currentToolName = sanitizeOptionalTaskText(currentActivity?.currentTool?.name);
	if (execution.state === "running" && currentToolName && currentActivity?.currentTool) execution.currentTool = {
		name: currentToolName,
		startedAt: currentActivity.currentTool.startedAt
	};
	if (execution.wait?.dependencies) execution.wait.dependencies = execution.wait.dependencies.slice(0, 100).map((dependency) => Object.assign({}, dependency, { label: sanitizeOptionalTaskText(dependency.label) }));
	return execution;
}
//#endregion
export { getTaskExecutionObservation as t };
