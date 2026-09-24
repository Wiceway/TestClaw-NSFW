import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { b as reloadTaskFlowRegistryFromStoreAsync, o as ensureTaskFlowRegistryReadyAsync } from "./task-flow-runtime-internal-BwKluq5j.mjs";
import { d as reloadTaskRegistryFromStoreAsync, s as ensureTaskRegistryReadyAsync } from "./task-registry-state-C_3mxHYW.mjs";
import "./task-registry-read-DngJsjhC.mjs";
import "./task-registry-query-BjzJF9UR.mjs";
import "./task-registry-CM3JdjEZ.mjs";
//#region src/tasks/runtime-internal.ts
/** Read a task view without creating state or refreshing the synchronous projections. */
async function findTaskViewByRunIdAsync(runId, assertCurrent) {
	assertCurrent();
	const lookup = runId.trim();
	if (!lookup) return;
	const context = captureAssistantStateWorkerContext();
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
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
