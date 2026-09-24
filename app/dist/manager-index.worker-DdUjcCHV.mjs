import { n as serveWorkerTasks } from "./worker-task-server-B4qQGSM6.mjs";
import "./worker-task-server-C4Plhoo5.mjs";
import { t as prepareMemoryIndexChunks } from "./manager-index-preparation-D915y2RM.mjs";
//#region extensions/memory-core/src/memory/manager-index.worker.ts
serveWorkerTasks((input) => {
	const task = input;
	if (task.kind === "prepare") return {
		kind: "prepared",
		value: prepareMemoryIndexChunks(task.input)
	};
	throw new Error("Invalid memory indexing task");
});
//#endregion
export {};
