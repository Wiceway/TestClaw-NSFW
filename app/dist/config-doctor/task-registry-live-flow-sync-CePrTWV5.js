import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as StateDatabaseCoordinatorContentionError } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
//#region src/tasks/task-registry-live-flow-sync.ts
/** This local refusal is benign only after the worker attests native settlement. */
var TaskFlowSelectionChanged = class extends Error {};
async function syncLiveTaskFlowWithWorker(context, params, authority) {
	const notSelected = new TaskFlowSelectionChanged("Task is no longer the live flow selection");
	let settlement;
	try {
		return await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type: "flows.syncLiveMirroredTask",
			input: params
		}), {
			requireStateLifecycle: true,
			assertCurrent: () => authority.assertCurrent(),
			createAdmission(retained) {
				settlement = retained.settled;
				authority.assertCurrent();
				let requested = false;
				return {
					nativeLocations: [context.admission.databasePath],
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						authority.assertCurrent();
						const facts = request.facts;
						if (requested || request.stage !== "transaction" || !isRecord(facts) || facts.kind !== "task-live-flow" || facts.taskId !== params.taskId || facts.flowId !== params.flowId || typeof facts.createdAt !== "number" || !Number.isFinite(facts.createdAt)) throw new Error("Live task-flow worker admission differs from its owner");
						requested = true;
						if (!authority.isSelected({
							...params,
							createdAt: facts.createdAt
						})) throw notSelected;
						authority.assertCurrent();
						if (!grant()) throw new Error("Live task-flow worker admission expired");
					})
				};
			}
		});
	} catch (error) {
		if (!settlement && error instanceof StateDatabaseCoordinatorContentionError) {
			authority.assertCurrent();
			return {
				kind: "retry",
				reason: "storage_contention"
			};
		}
		if (error === notSelected && (await settlement)?.kind === "completed") return { kind: "not-selected" };
		throw error;
	} finally {
		await settlement;
	}
}
//#endregion
export { syncLiveTaskFlowWithWorker };
