import { i as createEmptyTaskAuditSummary } from "./task-registry.audit.shared-2IJPSTDV.js";
import { t as addTaskAuditRecordSummary } from "./task-registry.audit-DR-Xyf3d.js";
//#region src/tasks/task-registry.summary.ts
function createEmptyTaskStatusCounts() {
	return {
		queued: 0,
		running: 0,
		succeeded: 0,
		failed: 0,
		timed_out: 0,
		cancelled: 0,
		lost: 0
	};
}
function createEmptyTaskRuntimeCounts() {
	return {
		subagent: 0,
		acp: 0,
		cli: 0,
		cron: 0
	};
}
function createEmptyTaskRegistrySummary() {
	return {
		total: 0,
		active: 0,
		terminal: 0,
		failures: 0,
		byStatus: createEmptyTaskStatusCounts(),
		byRuntime: createEmptyTaskRuntimeCounts()
	};
}
function addTaskRegistrySummaryCounts(summary, runtime, status, count) {
	summary.total += count;
	summary.byStatus[status] += count;
	summary.byRuntime[runtime] += count;
	if (status === "queued" || status === "running") summary.active += count;
	else summary.terminal += count;
	if (status === "failed" || status === "timed_out" || status === "lost") summary.failures += count;
}
function summarizeTaskRecords(records) {
	const summary = createEmptyTaskRegistrySummary();
	for (const task of records) addTaskRegistrySummaryCounts(summary, task.runtime, task.status, 1);
	return summary;
}
function createEmptyTaskStatusSummary() {
	return {
		tasks: createEmptyTaskRegistrySummary(),
		taskAudit: createEmptyTaskAuditSummary(),
		taskAuditRetainedLost: { count: 0 }
	};
}
function addTaskStatusSummaryRecord(summary, task, now) {
	addTaskRegistrySummaryCounts(summary.tasks, task.runtime, task.status, 1);
	if (addTaskAuditRecordSummary(summary.taskAudit, summary.taskAuditRetainedLost, task, now)) summary.tasks.failures -= 1;
}
//#endregion
export { summarizeTaskRecords as i, createEmptyTaskRegistrySummary as n, createEmptyTaskStatusSummary as r, addTaskStatusSummaryRecord as t };
