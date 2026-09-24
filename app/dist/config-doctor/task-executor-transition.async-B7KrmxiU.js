import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { M as isEquivalentTaskRecord, P as matchesTaskPersistenceReceipt } from "./task-registry.store.kernel-Bnd9Ls7p.js";
import { p as runTaskRegistryWorkerMutation, t as assertTaskRegistryOwnerCurrent, w as tasks } from "./task-registry-state-D1tTILHR.js";
import { n as flushTaskActivity, t as clearTaskActivity } from "./task-registry-activity-Bt8oaIsz.js";
import { d as retainTaskMutationFlowEffects, n as maybeDeliverTaskTerminalUpdate, t as maybeDeliverTaskStateChangeUpdate, u as finishTaskMutation } from "./task-registry-delivery-CS6BEm5t.js";
//#region src/tasks/task-executor-transition.async.ts
const log = createSubsystemLogger("tasks/executor");
/** Acknowledging a row does not mean its publication and required effects have settled. */
async function settleTaskRecordTransitionAsync(creation, command, assertCurrent) {
	const { context, store, flowStore, assertStores } = creation;
	const { taskId } = command.input;
	assertCurrent();
	if (command.type === "tasks.settleUnstarted" || command.type === "tasks.finalizeActive") {
		const { expectedTask } = command.input;
		try {
			assertTaskRegistryOwnerCurrent(context, store);
			const projected = tasks.get(taskId);
			if (projected && matchesTaskPersistenceReceipt(projected, expectedTask)) flushTaskActivity(taskId);
		} catch (error) {
			log.warn("Retained task transition no longer owns the active activity projection", {
				taskId,
				error
			});
		}
	}
	assertCurrent();
	const scope = { taskId };
	let committed = null;
	let flowHookEntered = false;
	let flowEffectsSettled = true;
	let publicationFailed = false;
	const settled = await runTaskRegistryWorkerMutation({
		scope,
		admission: context.admission,
		readIdentity: "preserved",
		taskRowsWritten: () => committed?.persisted ?? false,
		publicationRecords: () => new Map(committed ? [[committed.task.taskId, committed.task]] : []),
		beforeObservers: async () => {
			flowHookEntered = true;
			if (committed && (command.type !== "tasks.bindRunOwner" || committed.persisted)) {
				const current = tasks.get(taskId);
				if (committed.becomesTerminal && current && isEquivalentTaskRecord(current, committed.task)) clearTaskActivity(taskId);
				flowEffectsSettled = await finishTaskMutation(context, store, flowStore, taskId, {
					operation: "update",
					assertCurrent: assertStores
				});
			}
		},
		onPublicationError: () => {
			publicationFailed = true;
		},
		forcePublish: () => command.type === "tasks.bindRunOwner" && !committed?.persisted ? void 0 : committed?.task
	}, async () => {
		const result = await store.runInitialMutationAsync(context, command, assertCurrent);
		committed = result;
		return result;
	}, () => store.loadMutationSnapshotAsync(context, scope));
	if (!flowHookEntered && settled && (command.type !== "tasks.bindRunOwner" || settled.persisted)) retainTaskMutationFlowEffects(context, store, flowStore, settled.task, "update");
	if (settled?.deliver && settled.task.deliveryStatus !== "not_applicable") try {
		assertTaskRegistryOwnerCurrent(context, store);
		const observePublication = (publication) => {
			publication.catch((error) => {
				log.warn("Committed task transition could not complete delivery publication", {
					taskId,
					error
				});
			});
		};
		observePublication(maybeDeliverTaskStateChangeUpdate(settled.task, settled.nextEvent));
		observePublication(maybeDeliverTaskTerminalUpdate(taskId));
	} catch (error) {
		log.warn("Committed task transition could not admit delivery publication", {
			taskId,
			error
		});
	}
	return {
		receipt: settled,
		publicationSettled: flowHookEntered && flowEffectsSettled && !publicationFailed
	};
}
//#endregion
export { settleTaskRecordTransitionAsync as t };
