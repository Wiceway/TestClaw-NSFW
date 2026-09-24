//#region src/tasks/task-retention.ts
/** Default retention for terminal task records before maintenance prunes them. */
const DEFAULT_TASK_RETENTION_MS = 6048e5;
const LOST_TASK_RETENTION_MS = 864e5;
function resolveTaskRetentionMs(status) {
	return status === "lost" ? LOST_TASK_RETENTION_MS : DEFAULT_TASK_RETENTION_MS;
}
function resolveTaskCleanupAfter(task) {
	return (task.endedAt ?? task.lastEventAt ?? task.createdAt) + resolveTaskRetentionMs(task.status);
}
function resolveEffectiveTaskCleanupAfter(task) {
	const statusCleanupAfter = resolveTaskCleanupAfter(task);
	if (typeof task.cleanupAfter !== "number") return statusCleanupAfter;
	return task.status === "lost" ? Math.min(task.cleanupAfter, statusCleanupAfter) : task.cleanupAfter;
}
//#endregion
export { resolveTaskCleanupAfter as n, resolveEffectiveTaskCleanupAfter as t };
