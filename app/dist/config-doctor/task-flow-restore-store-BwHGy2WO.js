import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-olf_92pI.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { A as getTaskFlowRegistryStore, o as ensureTaskFlowRegistryReadyAsync, t as beginTaskFlowRegistryWorkerMutation } from "./task-flow-runtime-internal-CxdyhxyJ.js";
import { i as getTaskRegistryStore } from "./task-registry.store-Di0Stfa8.js";
//#region src/tasks/task-flow-restore-store.ts
/** Discovered flow writes enter the registry before admission; their receipts settle after task install. */
async function runTaskFlowRestoreWorkerOperation(context, command, consume) {
	const store = getTaskRegistryStore();
	const flowStore = getTaskFlowRegistryStore();
	const publications = [];
	const errors = [];
	let settlement;
	let reconciliation;
	let preparationFailure;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (getTaskRegistryStore() !== store || getTaskFlowRegistryStore() !== flowStore) throw new Error("Task-flow restore owner is no longer current");
	};
	const reconcileFlows = () => reconciliation ??= (async () => {
		await settlement;
		if (publications.length === 0) return;
		try {
			assertCurrent();
			await ensureTaskFlowRegistryReadyAsync(context);
			assertCurrent();
		} catch (error) {
			preparationFailure = { error };
			errors.push(error);
		}
		for (const settle of publications) await settle();
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Task-flow restore reconciliation failed", errors[0]);
	})();
	let outcome;
	try {
		outcome = {
			ok: true,
			value: await runAssistantStateWorkerOperation(context, async (scope) => consume(await scope.execute(command), reconcileFlows), {
				requireStateLifecycle: true,
				assertCurrent,
				createAdmission(retained) {
					settlement = retained.settled;
					assertCurrent();
					return {
						nativeLocations: [context.admission.databasePath],
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							assertCurrent();
							const facts = request.facts;
							if (request.stage !== "transaction" || !isRecord(facts) || facts.kind !== "task-restored-flow" || typeof facts.taskId !== "string" || !facts.taskId || typeof facts.flowId !== "string" || !facts.flowId || command.type === "flows.syncMirroredTask" && (facts.taskId !== command.input?.taskId || command.input?.expectedParentFlowId !== void 0 && facts.flowId !== command.input.expectedParentFlowId.trim())) throw new Error("Task-flow restore admission differs from its operation");
							const flowId = facts.flowId;
							publications.push(beginTaskFlowRegistryWorkerMutation({
								flowId,
								admission: context.admission,
								onPublicationError: (error) => errors.push(error)
							}, () => {
								if (preparationFailure) throw preparationFailure.error;
								assertCurrent();
								return flowStore.readFlowAsync(context, flowId);
							}));
							if (!grant()) throw new Error("Task-flow restore admission expired");
						})
					};
				}
			})
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	try {
		await reconcileFlows();
	} catch (error) {
		if (!outcome.ok && outcome.error !== error) throw createSqliteLifecycleAggregateError([outcome.error, error], "Task-flow restore failed during reconciliation", outcome.error);
		throw error;
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
export { runTaskFlowRestoreWorkerOperation };
