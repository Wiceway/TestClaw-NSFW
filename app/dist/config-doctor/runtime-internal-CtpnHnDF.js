import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { b as reloadTaskFlowRegistryFromStoreAsync, o as ensureTaskFlowRegistryReadyAsync } from "./task-flow-runtime-internal-CxdyhxyJ.js";
import { d as reloadTaskRegistryFromStoreAsync, s as ensureTaskRegistryReadyAsync } from "./task-registry-state-D1tTILHR.js";
import "./task-registry-read-BjHX4Kh8.js";
import "./task-registry-lFPM6OHy.js";
import "./task-registry-query-R9q--_2Z.js";
//#region src/tasks/runtime-internal.ts
/** Read a task view without creating state or refreshing the synchronous projections. */
async function findTaskViewByRunIdAsync(runId, assertCurrent) {
	assertCurrent();
	const lookup = runId.trim();
	if (!lookup) return;
	const context = captureAssistantStateWorkerContext();
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	const task = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "tasks.findByRunId",
		input: { runId: lookup }
	}), {
		existingOnly: true,
		assertCurrent
	});
	context.admission.assertCurrent();
	assertCurrent();
	return task;
}
async function ensureTaskRuntimeStateReady() {
	const context = captureAssistantStateWorkerContext();
	await ensureTaskFlowRegistryReadyAsync(context);
	context.admission.assertCurrent();
	await ensureTaskRegistryReadyAsync(context);
}
async function reloadTaskRuntimeStateFromStore() {
	const context = captureAssistantStateWorkerContext();
	await reloadTaskFlowRegistryFromStoreAsync(context);
	context.admission.assertCurrent();
	await reloadTaskRegistryFromStoreAsync(context);
}
//#endregion
export { findTaskViewByRunIdAsync as n, reloadTaskRuntimeStateFromStore as r, ensureTaskRuntimeStateReady as t };
