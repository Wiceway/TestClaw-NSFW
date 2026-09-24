import { n as serveWorkerTasks } from "../../worker-task-server-B4qQGSM6.mjs";
import { n as readSessionPhysicalDiskUsage } from "../../disk-budget-files-dhFwYSDy.mjs";
//#region src/config/sessions/disk-budget.worker.ts
serveWorkerTasks((input) => {
	return readSessionPhysicalDiskUsage(input);
});
//#endregion
export {};
