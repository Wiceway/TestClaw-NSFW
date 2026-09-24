import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { H as matchesTaskPersistenceReceipt, N as cloneTaskRecord, j as captureTaskPersistenceReceipt, kt as DetachedTaskAssignmentUnsupportedError } from "./task-registry.store.kernel-CTpG8C0S.mjs";
import { n as getRegisteredDetachedTaskLifecycleRuntime, t as captureDetachedTaskRuntimeOwner } from "./detached-task-runtime-state-CsuWaBlO.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { o as ensureTaskFlowRegistryReadyAsync, w as runTaskFlowRegistryWorkerMutation } from "./task-flow-runtime-internal-BwKluq5j.mjs";
import { t as captureTaskExecutionOwner } from "./task-execution-owner-D_zpbgLF.mjs";
import { m as getTasksByRunScope } from "./task-registry.process-state-BEDk3knf.mjs";
import { D as captureTaskRegistryReadFence, l as prepareTaskRegistryProjectionAsync, p as runTaskRegistryWorkerMutation, s as ensureTaskRegistryReadyAsync } from "./task-registry-state-C_3mxHYW.mjs";
import { p as readTaskCreationEventTarget } from "./task-registry-create.operation-DFC156B0.mjs";
import { c as retainTaskMutationFlowEffects, o as captureTaskMutationContext, s as finishTaskMutation } from "./task-registry-delivery-C3faJa-V.mjs";
import { n as isOneTaskFlowEligible } from "./task-initial-flow.rules-CN3_Vug2.mjs";
import { C as retainTaskAgentEventLineage, S as getTaskRunOwner, m as transitionTaskRecordsByRunNative, r as cancelTaskById, x as captureTaskRunOwnerBinding } from "./task-registry-CM3JdjEZ.mjs";
import "./runtime-internal-CxjcW5l2.mjs";
import { t as settleTaskRecordTransitionAsync } from "./task-executor-transition.async-DdLIuYZ8.mjs";
import { a as createQueuedTaskRunCore, f as recordTaskRunProgressByRunIdCore, h as startTaskRunByRunIdCore, i as completeTaskRunByRunIdCore, l as finalizeTaskRunByRunIdCore, m as setDetachedTaskDeliveryStatusByRunIdCore, o as createRunningTaskRunCore, s as failTaskRunByRunIdCore } from "./task-executor-BZ-VFoyz.mjs";
import { n as findTaskByRunIdForStatus, s as listTasksForSessionKeyForStatus } from "./task-status-access-uRVY2RrR.mjs";
import crypto from "node:crypto";
//#region src/tasks/task-executor-terminal.async.ts
async function finalizeActiveTaskRun(creation, task, terminal, canSettle) {
	const { context, store, assertStores } = creation;
	const runId = task.runId;
	assertStores();
	if (!runId?.trim() || !canSettle(task)) return;
	const params = {
		status: terminal.status,
		endedAt: terminal.endedAt,
		error: terminal.error,
		terminalSummary: terminal.terminalSummary,
		runId,
		runtime: task.runtime,
		sessionKey: task.childSessionKey
	};
	await prepareTaskRegistryProjectionAsync(context, store);
	assertStores();
	if (!canSettle(task)) return;
	const selected = getTasksByRunScope(params).map((current) => ({
		task: cloneTaskRecord(current),
		receipt: captureTaskPersistenceReceipt(current),
		owner: getTaskRunOwner(current)
	}));
	for (const selection of selected) {
		assertStores();
		if (!canSettle(task)) break;
		const rowOwned = () => {
			const current = getTaskRunOwner(selection.task);
			return canSettle(selection.task) && (!current || current === selection.owner);
		};
		if (!rowOwned()) continue;
		const rowRefusal = /* @__PURE__ */ new Error("Active task row was adopted before settlement");
		const assertCurrent = () => {
			assertStores();
			if (!canSettle(task)) throw new Error("Active task finalization lost its original run owner");
			if (!rowOwned()) throw rowRefusal;
		};
		try {
			if (!(await settleTaskRecordTransitionAsync(creation, {
				type: "tasks.finalizeActive",
				input: {
					taskId: selection.receipt.taskId,
					expectedTask: selection.receipt,
					params,
					now: Date.now()
				}
			}, assertCurrent)).publicationSettled) break;
		} catch (error) {
			if (error !== rowRefusal) throw error;
			assertStores();
			if (!canSettle(task)) break;
		}
	}
}
//#endregion
//#region src/tasks/task-executor-create.async.ts
const log$1 = createSubsystemLogger("tasks/executor");
async function createRunningTaskRunCoreWithReceiptAsync(params, assertCurrent) {
	const lineage = { close() {} };
	try {
		const creation = await createTaskRun({
			...params,
			status: "running"
		}, assertCurrent, lineage);
		if (isTerminalTaskStatus(creation.task.status)) lineage.close();
		const receipt = createTaskRunReceipt(creation, lineage);
		let settlement;
		return {
			task: receipt.task,
			bindRunOwner: receipt.bindRunOwner,
			finalizeActive: receipt.finalizeActive,
			settleUnstarted(terminal, canSettle) {
				return settlement ??= receipt.settleUnstarted(terminal, canSettle).then((task) => task !== null);
			}
		};
	} catch (error) {
		lineage.close();
		throw error;
	}
}
async function createQueuedTaskRunCoreWithReceiptAsync(params, assertCurrent) {
	const receipt = createTaskRunReceipt(await createTaskRun({
		...params,
		status: "queued"
	}, assertCurrent));
	return {
		task: receipt.task,
		settleUnstarted: receipt.settleUnstarted
	};
}
function createTaskRunReceipt(creation, lineage) {
	const acknowledged = cloneTaskRecord(creation.task);
	const readAcknowledged = () => {
		if (lineage?.current) acknowledged.createdAt = lineage.current.createdAt;
		return acknowledged;
	};
	let settlement;
	return {
		task: cloneTaskRecord(acknowledged),
		async bindRunOwner(cancel, assertCurrent) {
			const binding = captureTaskRunOwnerBinding(captureTaskPersistenceReceipt(readAcknowledged()), cancel);
			const assertBindingCurrent = () => {
				creation.assertStores();
				assertCurrent();
				binding.assertCurrent();
			};
			assertBindingCurrent();
			const executionOwner = captureTaskExecutionOwner();
			while (true) {
				await captureTaskRegistryReadFence(creation.context.admission);
				assertBindingCurrent();
				const expectedTask = captureTaskPersistenceReceipt(readAcknowledged());
				const { receipt, publicationSettled } = await settleTaskRecordTransitionAsync(creation, {
					type: "tasks.bindRunOwner",
					input: {
						taskId: expectedTask.taskId,
						expectedTask,
						params: {
							runId: expectedTask.runId,
							executionOwner
						},
						now: Date.now()
					}
				}, assertBindingCurrent);
				assertBindingCurrent();
				if (!publicationSettled) throw new Error("Task run owner publication did not settle.");
				if (receipt) break;
				await captureTaskRegistryReadFence(creation.context.admission);
				assertBindingCurrent();
				if (matchesTaskPersistenceReceipt(readAcknowledged(), expectedTask)) throw new Error("Task no longer belongs to this live run.");
			}
			await captureTaskRegistryReadFence(creation.context.admission);
			assertBindingCurrent();
			const bound = binding.bind(captureTaskPersistenceReceipt(readAcknowledged()));
			return {
				owner: bound.owner,
				release() {
					bound.release();
					lineage?.close();
				}
			};
		},
		finalizeActive(terminal, canSettle) {
			return finalizeActiveTaskRun(creation, readAcknowledged(), terminal, canSettle).finally(() => lineage?.close());
		},
		settleUnstarted(terminal, canSettle) {
			return settlement ??= (async () => {
				if (lineage) await Promise.allSettled([captureTaskRegistryReadFence(creation.context.admission)]);
				return settleUnstartedTask(creation, readAcknowledged(), terminal, canSettle);
			})().finally(() => lineage?.close());
		}
	};
}
async function createTaskRun(params, assertCurrent, lineage) {
	const { context, store, flowStore, assertStores } = captureTaskMutationContext();
	const input = {
		params: structuredClone(params),
		taskId: crypto.randomUUID(),
		now: Date.now()
	};
	const assertCreationCurrent = () => {
		assertStores();
		assertCurrent?.();
	};
	assertCreationCurrent();
	await ensureTaskRegistryReadyAsync(context);
	assertCreationCurrent();
	if (input.params.parentFlowId?.trim()) {
		await ensureTaskFlowRegistryReadyAsync(context);
		assertCreationCurrent();
	}
	const scope = {
		taskId: input.taskId,
		flowId: input.params.parentFlowId?.trim(),
		runId: input.params.runId?.trim(),
		childSessionKey: input.params.childSessionKey?.trim()
	};
	let committed;
	let creationOwner;
	let flowHookEntered = false;
	if (lineage) lineage.close = retainTaskAgentEventLineage(context.admission, input.params.runId?.trim() ?? "", (previous, next) => {
		const original = lineage.current ?? readTaskCreationEventTarget(creationOwner?.committed?.facts, "tasks.createRecord", input.taskId) ?? committed?.task;
		if (original && matchesTaskPersistenceReceipt(original, previous)) lineage.current = captureTaskPersistenceReceipt(next);
	});
	const created = await runTaskRegistryWorkerMutation({
		scope,
		admission: context.admission,
		readIdentity: {
			kind: "creation",
			taskId: scope.taskId,
			runId: scope.runId
		},
		readEventTarget: () => readTaskCreationEventTarget(creationOwner?.committed?.facts, "tasks.createRecord", input.taskId),
		taskRowsWritten: () => committed?.persisted ?? false,
		publicationRecords: () => new Map(committed && committed.mutation !== "reused" ? [[committed.task.taskId, committed.task]] : []),
		beforeObservers: async () => {
			flowHookEntered = true;
			if (committed && committed.mutation !== "reused") await finishTaskMutation(context, store, flowStore, committed.task.taskId, {
				operation: committed.mutation === "created" ? "create" : "update",
				assertCurrent: assertStores
			});
		},
		forcePublish: () => committed?.mutation === "updated" ? committed.task : void 0
	}, async () => {
		const result = await store.runInitialMutationAsync(context, {
			type: "tasks.createRecord",
			input
		}, assertCreationCurrent, (owner) => {
			creationOwner = owner;
		});
		committed = result;
		return result;
	}, () => store.loadMutationSnapshotAsync(context, scope));
	if (!flowHookEntered && created.mutation !== "reused") retainTaskMutationFlowEffects(context, store, flowStore, created.task, created.mutation === "created" ? "create" : "update");
	return {
		task: await ensureSingleTaskFlowAsync(context, store, flowStore, created.task, input.params.requesterOrigin, assertCreationCurrent, assertStores),
		context,
		store,
		flowStore,
		assertStores
	};
}
/** Cleanup keeps its original target and exact task even after its run cannot activate. */
async function settleUnstartedTask(creation, task, terminal, canSettle) {
	creation.assertStores();
	if (!task.runId?.trim() || !canSettle(task)) return null;
	const assertCurrent = () => {
		creation.assertStores();
		if (!canSettle(task)) throw new Error("The unstarted task was adopted before cleanup admission");
	};
	const { receipt } = await settleTaskRecordTransitionAsync(creation, {
		type: "tasks.settleUnstarted",
		input: {
			taskId: task.taskId,
			expectedTask: captureTaskPersistenceReceipt(task),
			terminal: {
				status: terminal.status,
				endedAt: terminal.endedAt,
				error: terminal.error,
				terminalSummary: terminal.terminalSummary,
				suppressDelivery: terminal.suppressDelivery,
				lastEventAt: terminal.lastEventAt
			},
			now: Date.now()
		}
	}, assertCurrent);
	return receipt ? cloneTaskRecord(receipt.task) : null;
}
async function ensureSingleTaskFlowAsync(context, store, flowStore, task, requesterOrigin, assertCurrent, assertStores) {
	if (!isOneTaskFlowEligible(task)) return cloneTaskRecord(task);
	let createdFlow;
	let compensation;
	const compensate = () => compensation ??= (async () => {
		const flow = createdFlow;
		if (!flow) return;
		await runTaskFlowRegistryWorkerMutation({
			flowId: flow.flowId,
			admission: context.admission
		}, () => store.runInitialMutationAsync(context, {
			type: "flows.deleteUnlinkedForTask",
			input: {
				taskId: task.taskId,
				flow
			}
		}, assertStores), () => flowStore.readFlowAsync(context, flow.flowId));
	})();
	try {
		assertCurrent();
		await ensureTaskFlowRegistryReadyAsync(context);
		assertCurrent();
		const flowId = crypto.randomUUID();
		const created = await runTaskFlowRegistryWorkerMutation({
			flowId,
			admission: context.admission
		}, () => store.runInitialMutationAsync(context, {
			type: "flows.createForTask",
			input: {
				taskId: task.taskId,
				flowId,
				requesterOrigin
			}
		}, assertCurrent), () => flowStore.readFlowAsync(context, flowId));
		if (!created.created) return cloneTaskRecord(created.task ?? task);
		createdFlow = created.flow;
		const scope = {
			taskId: task.taskId,
			flowId
		};
		let linkResult;
		let flowHookEntered = false;
		const linked = await runTaskRegistryWorkerMutation({
			scope,
			admission: context.admission,
			publicationRecords: () => new Map(linkResult?.linked ? [[linkResult.task.taskId, linkResult.task]] : []),
			beforeObservers: async () => {
				flowHookEntered = true;
				if (linkResult?.linked) await finishTaskMutation(context, store, flowStore, task.taskId, {
					operation: "update",
					assertCurrent: assertStores
				});
			}
		}, async () => {
			const result = await store.runInitialMutationAsync(context, {
				type: "tasks.linkInitialFlow",
				input: {
					taskId: task.taskId,
					flow: created.flow,
					now: Date.now()
				}
			}, assertCurrent);
			linkResult = result;
			return result;
		}, () => store.loadMutationSnapshotAsync(context, scope));
		if (!flowHookEntered && linked.linked) retainTaskMutationFlowEffects(context, store, flowStore, linked.task, "update");
		if (!linked.linked) await compensate();
		return cloneTaskRecord(linked.task ?? task);
	} catch (error) {
		try {
			await compensate();
		} catch (cleanupError) {
			log$1.warn("Failed to settle the created one-task flow", {
				taskId: task.taskId,
				flowId: createdFlow?.flowId,
				error: cleanupError
			});
		}
		log$1.warn("Failed to create one-task flow for detached run", {
			taskId: task.taskId,
			runId: task.runId,
			error
		});
		return cloneTaskRecord(task);
	}
}
//#endregion
//#region src/tasks/detached-task-runtime.ts
const log = createSubsystemLogger("tasks/detached-runtime");
const DETACHED_TASK_RECOVERY_WARN_MS = 5e3;
function taskMatchesFindScope(task, params) {
	return task.runtime === params.runtime && task.childSessionKey === params.sessionKey && task.createdAt >= params.createdAtOrAfter && (params.createdBefore === void 0 || task.createdAt < params.createdBefore);
}
function taskMatchesFindIdentity(task, params) {
	return task.runtime === params.runtime && task.childSessionKey === params.sessionKey;
}
function findCoreTaskRun(params) {
	const direct = findTaskByRunIdForStatus(params.runId);
	if (direct && taskMatchesFindIdentity(direct, params)) return direct;
	if (params.allowSessionFallback !== true) return;
	return listTasksForSessionKeyForStatus(params.sessionKey).find((task) => taskMatchesFindScope(task, params));
}
const DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME = {
	createQueuedTaskRun: createQueuedTaskRunCore,
	createRunningTaskRun: createRunningTaskRunCore,
	startTaskRunByRunId: startTaskRunByRunIdCore,
	recordTaskRunProgressByRunId: recordTaskRunProgressByRunIdCore,
	finalizeTaskRunByRunId: finalizeTaskRunByRunIdCore,
	completeTaskRunByRunId: completeTaskRunByRunIdCore,
	failTaskRunByRunId: failTaskRunByRunIdCore,
	setDetachedTaskDeliveryStatusByRunId: setDetachedTaskDeliveryStatusByRunIdCore,
	findTaskRun: findCoreTaskRun,
	cancelDetachedTaskRunById: cancelTaskById
};
function getDetachedTaskLifecycleRuntime() {
	return getRegisteredDetachedTaskLifecycleRuntime() ?? DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME;
}
/** Exact settlement stays with the registered runtime; unsupported owners never fall through. */
function transitionTaskAssignment(params) {
	const owner = captureDetachedTaskRuntimeOwner();
	const assertCurrent = () => {
		owner.assertCurrent();
		params.assertCurrent();
	};
	assertCurrent();
	if (!owner.runtime) return transitionTaskRecordsByRunNative(params.transition, {
		expectedTask: params.expectedTask,
		assertCurrent
	});
	if (!owner.runtime.transitionTaskAssignment) throw new DetachedTaskAssignmentUnsupportedError();
	return owner.runtime.transitionTaskAssignment({
		...params,
		assertCurrent
	});
}
function createQueuedTaskRun(...args) {
	return getDetachedTaskLifecycleRuntime().createQueuedTaskRun(...args);
}
function createRunningTaskRun(...args) {
	return getDetachedTaskLifecycleRuntime().createRunningTaskRun(...args);
}
/** Compatibility adapter for shipped synchronous runtimes; retain the registered owner. */
function createWithLegacyDetachedTaskRuntime(admission, create) {
	admission.assertCurrent();
	return create();
}
function captureTaskCreationAdmission(assertOwnerCurrent, assertCurrent) {
	let active = true;
	return {
		admission: { assertCurrent() {
			if (!active) throw new Error("Detached task creation admission is closed.");
			assertCurrent?.();
			assertOwnerCurrent();
		} },
		close() {
			active = false;
		}
	};
}
/** Preserve synchronous V1 ordering while worker creation retains exact cleanup receipts. */
function prepareRunningTaskRun(params, assertCurrent) {
	const owner = captureDetachedTaskRuntimeOwner();
	const runtime = owner.runtime;
	owner.assertCurrent();
	if (!runtime) return {
		kind: "receipt",
		async create() {
			const { admission, close } = captureTaskCreationAdmission(owner.assertCurrent, assertCurrent);
			try {
				admission.assertCurrent();
				return await createRunningTaskRunCoreWithReceiptAsync(params, admission.assertCurrent);
			} finally {
				close();
			}
		}
	};
	const { admission, close } = captureTaskCreationAdmission(owner.assertCurrent, assertCurrent);
	try {
		const finalize = runtime.finalizeTaskRunByRunId;
		const complete = runtime.completeTaskRunByRunId;
		const fail = runtime.failTaskRunByRunId;
		return {
			kind: "legacy",
			task: createWithLegacyDetachedTaskRuntime(admission, () => runtime.createRunningTaskRun(params)),
			finalizeRun(terminal) {
				owner.assertCurrent();
				if (finalize) return finalize.call(runtime, terminal);
				return terminal.status === "succeeded" ? complete.call(runtime, terminal) : fail.call(runtime, {
					...terminal,
					status: terminal.status
				});
			}
		};
	} finally {
		close();
	}
}
function startTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().startTaskRunByRunId(...args);
}
function recordTaskRunProgressByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().recordTaskRunProgressByRunId(...args);
}
function finalizeTaskRunByRunId(params) {
	const runtime = getDetachedTaskLifecycleRuntime();
	if (runtime.finalizeTaskRunByRunId) return runtime.finalizeTaskRunByRunId(params);
	if (params.status === "succeeded") return runtime.completeTaskRunByRunId(params);
	return runtime.failTaskRunByRunId({
		...params,
		status: params.status
	});
}
function completeTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().completeTaskRunByRunId(...args);
}
function failTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().failTaskRunByRunId(...args);
}
function setDetachedTaskDeliveryStatusByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().setDetachedTaskDeliveryStatusByRunId(...args);
}
function findDetachedTaskRun(params) {
	const runtime = getDetachedTaskLifecycleRuntime();
	if (runtime.findTaskRun) try {
		return {
			lookup: "available",
			task: runtime.findTaskRun(params)
		};
	} catch (error) {
		log.warn("Detached task lookup failed", {
			runtime: params.runtime,
			runId: params.runId,
			error
		});
		return { lookup: "unavailable" };
	}
	const coreTask = findCoreTaskRun(params);
	return coreTask ? {
		lookup: "available",
		task: coreTask
	} : { lookup: "unavailable" };
}
async function tryRecoverTaskBeforeMarkLost(params) {
	const hook = getDetachedTaskLifecycleRuntime().tryRecoverTaskBeforeMarkLost;
	if (!hook) return { recovered: false };
	const startedAt = Date.now();
	try {
		const result = await hook(params);
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs >= DETACHED_TASK_RECOVERY_WARN_MS) log.warn("Detached task recovery hook was slow", {
			taskId: params.taskId,
			runtime: params.runtime,
			elapsedMs
		});
		if (result && typeof result.recovered === "boolean") return result;
		log.warn("Detached task recovery hook returned invalid result, proceeding with markTaskLost", {
			taskId: params.taskId,
			runtime: params.runtime,
			result
		});
		return { recovered: false };
	} catch (err) {
		log.warn("Detached task recovery hook threw, proceeding with markTaskLost", {
			taskId: params.taskId,
			runtime: params.runtime,
			elapsedMs: Date.now() - startedAt,
			error: err
		});
		return { recovered: false };
	}
}
//#endregion
export { finalizeTaskRunByRunId as a, prepareRunningTaskRun as c, startTaskRunByRunId as d, transitionTaskAssignment as f, failTaskRunByRunId as i, recordTaskRunProgressByRunId as l, createQueuedTaskRunCoreWithReceiptAsync as m, createQueuedTaskRun as n, findDetachedTaskRun as o, tryRecoverTaskBeforeMarkLost as p, createRunningTaskRun as r, getDetachedTaskLifecycleRuntime as s, completeTaskRunByRunId as t, setDetachedTaskDeliveryStatusByRunId as u };
