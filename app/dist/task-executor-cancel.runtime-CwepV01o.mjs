import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { n as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state-CsuWaBlO.mjs";
import { r as getTaskById } from "./task-registry-query-BjzJF9UR.mjs";
import { _ as prepareTaskCancellationRead, g as prepareTaskCancellationControl, n as assertTaskCancellationReadyById, r as cancelTaskById } from "./task-registry-CM3JdjEZ.mjs";
import "./runtime-internal-CxjcW5l2.mjs";
//#region src/tasks/task-executor-cancel.runtime.ts
async function cancelDetachedTaskRunByIdCore(params) {
	for (let pending = prepareTaskCancellationRead(); pending; pending = prepareTaskCancellationRead()) await pending;
	const task = getTaskById(params.taskId);
	const registeredRuntime = getRegisteredDetachedTaskLifecycleRuntime();
	try {
		prepareTaskCancellationControl(task)?.assertCurrent();
	} catch (error) {
		return {
			found: task !== void 0,
			cancelled: false,
			reason: formatErrorMessage(error),
			...task ? { task } : {}
		};
	}
	if (task) try {
		assertTaskCancellationReadyById(task.taskId);
	} catch (error) {
		return {
			found: true,
			cancelled: false,
			reason: formatErrorMessage(error),
			task
		};
	}
	if (registeredRuntime) {
		const cancelled = await registeredRuntime.cancelDetachedTaskRunById(params);
		if (cancelled.found) return cancelled;
	}
	return cancelTaskById(params);
}
//#endregion
export { cancelDetachedTaskRunByIdCore };
