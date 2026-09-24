import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-C_bfgyCp.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-BtCcPgOj.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-_30Scclc.mjs";
import { I as compareTasksNewestFirst, J as selectTaskRecordsForOwnerTree, N as cloneTaskRecord, V as listTasksFromIndex, Y as selectTaskRecordsWithAncestors } from "./task-registry.store.kernel-CTpG8C0S.mjs";
import { S as taskIdsInScope, f as getTaskRegistryProcessState, g as matchesScope } from "./task-registry.process-state-BEDk3knf.mjs";
import { i as getTaskRegistryStore } from "./task-registry.store-D0H1rtOf.mjs";
import { A as listPendingTaskRegistryEventTaskIds, D as captureTaskRegistryReadFence, k as hasPendingTaskRegistryEvents, l as prepareTaskRegistryProjectionAsync, s as ensureTaskRegistryReadyAsync, t as assertTaskRegistryOwnerCurrent, w as tasks, x as taskIdsByRelatedSessionKey, y as taskIdsByOwnerKey } from "./task-registry-state-C_3mxHYW.mjs";
import { n as isTaskFlowCancellationPending } from "./task-cancellation-state-phnfX7Hr.mjs";
//#region src/tasks/task-session-identity.ts
/** Retained rows with unresolved owners stay inaccessible without hiding other tasks. */
function resolveTaskSessionAgentId(sessionKey, agentId, cfg) {
	const knownAgentId = normalizeOptionalString(agentId) ?? parseAgentSessionKey(sessionKey)?.agentId;
	if (knownAgentId || !sessionKey || !cfg) return knownAgentId;
	try {
		return resolveSessionAgentId({
			sessionKey,
			config: typeof cfg === "function" ? cfg() : cfg
		});
	} catch {
		return;
	}
}
async function resolveTaskSessionAgentIdAsync(sessionKey, agentId, readConfig) {
	const knownAgentId = resolveTaskSessionAgentId(sessionKey, agentId);
	if (knownAgentId || !sessionKey) return knownAgentId;
	try {
		return resolveTaskSessionAgentId(sessionKey, agentId, await readConfig());
	} catch {
		return;
	}
}
function taskMatchesRelatedSession(task, sessionKey, sessionAgentId, cfg) {
	if (!sessionKey) return true;
	return [
		{
			key: task.requesterSessionKey,
			agentId: task.requesterAgentId
		},
		{
			key: task.childSessionKey,
			agentId: task.agentId
		},
		{
			key: task.ownerKey,
			agentId: task.requesterAgentId
		}
	].some((candidate) => {
		if (normalizeOptionalString(candidate.key) !== sessionKey) return false;
		if (!sessionAgentId) return true;
		return resolveTaskSessionAgentId(candidate.key, candidate.agentId, cfg) === sessionAgentId;
	});
}
//#endregion
//#region src/tasks/task-registry-read.ts
function isTaskRegistryReadScopeCurrent(field, value) {
	const { projection } = getTaskRegistryProcessState();
	const observed = /* @__PURE__ */ new Set();
	const intersects = (scope, pending) => {
		const facts = [
			tasks.get(scope.taskId),
			...pending?.published.values() ?? [],
			...pending?.publication?.records.values() ?? [],
			pending?.readEventTarget?.()
		];
		return scope[field] === value || facts.some((fact) => fact?.[field]?.trim() === value) || scope[field] === void 0 && facts.every((fact) => !fact?.[field]);
	};
	for (const pending of projection.pending) {
		observed.add(pending.scope);
		if (pending.readIdentity !== "preserved" && intersects(pending.scope, pending)) return false;
	}
	return [...projection.dirtyScopes].every((scope) => observed.has(scope) || !intersects(scope));
}
function isTaskRegistryReadCurrent(taskId, mode) {
	const { projection } = getTaskRegistryProcessState();
	if (projection.pending.size === 0 && projection.dirtyScopes.size === 0) return true;
	const task = tasks.get(taskId);
	const currentScopes = /* @__PURE__ */ new Set();
	for (const pending of projection.pending) {
		if (mode === "identity" && pending.readIdentity === "preserved") {
			currentScopes.add(pending.scope);
			continue;
		}
		const creation = mode === "identity" && typeof pending.readIdentity === "object" && pending.readIdentity.kind === "creation" ? pending.readIdentity : void 0;
		if ((creation ? creation.taskId === taskId || Boolean(creation.runId && (task?.runId?.trim() === creation.runId || pending.published.get(taskId)?.runId?.trim() === creation.runId)) : pending.scope.taskId === taskId || pending.published.has(taskId) || task && matchesScope(task, pending.scope)) || pending.publication?.records.has(taskId)) return false;
		if (creation) currentScopes.add(pending.scope);
	}
	for (const scope of projection.dirtyScopes) if (!currentScopes.has(scope) && (scope.taskId === taskId || task && matchesScope(task, scope))) return false;
	return true;
}
function canReadResidentTaskMetadata() {
	const { projection } = getTaskRegistryProcessState();
	if (projection.dirty || !hasPendingTaskRegistryEvents()) return false;
	const preserved = /* @__PURE__ */ new Set();
	for (const pending of projection.pending) {
		if (pending.readIdentity !== "preserved") return false;
		preserved.add(pending.scope);
	}
	return [...projection.dirtyScopes].every((scope) => preserved.has(scope));
}
/** External readers join a fixed accepted prefix; persistence preparation must never use this fence. */
async function prepareTaskRegistryReadOwner(context = captureAssistantStateWorkerContext(), store = getTaskRegistryStore(), pendingMutations = []) {
	const fence = captureTaskRegistryReadFence(context.admission);
	const mutations = pendingMutations.flatMap((pending) => {
		const settlement = pending.readSettlement;
		return settlement?.store === store && settlement.databaseKey === context.admission.identity.key ? [settlement.promise] : [];
	});
	const errors = (await Promise.allSettled([
		ensureTaskRegistryReadyAsync(context),
		fence,
		...mutations
	])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Task read preparation failed", errors[0]);
	const assertCurrent = () => assertTaskRegistryOwnerCurrent(context, store);
	assertCurrent();
	return {
		context,
		store,
		assertCurrent
	};
}
/** Page requests join their initial mutation cohort and accepted events while retries refresh rows. */
function createTaskRegistryReadPreparation() {
	let owner;
	return async () => {
		if (owner) {
			const store = getTaskRegistryStore();
			assertTaskRegistryOwnerCurrent(owner.context, store);
			if (store !== owner.store) owner = void 0;
		}
		if (!owner) owner = await prepareTaskRegistryReadOwner(captureAssistantStateWorkerContext(), getTaskRegistryStore(), [...getTaskRegistryProcessState().projection.pending]);
		return prepareTaskRegistryRead(owner);
	};
}
async function prepareTaskRegistryRead(owner) {
	const { context, store, assertCurrent: assertOwnerCurrent } = owner ?? await prepareTaskRegistryReadOwner();
	assertOwnerCurrent();
	await ensureTaskRegistryReadyAsync(context);
	assertOwnerCurrent();
	if (!canReadResidentTaskMetadata() && !await prepareTaskRegistryProjectionAsync(context, store, 3)) return;
	const assertCurrent = () => {
		assertOwnerCurrent();
		if (getTaskRegistryProcessState().projection.dirty) throw new Error("Task registry read projection is no longer ready");
	};
	assertCurrent();
	const isTaskCurrent = (taskId) => {
		assertCurrent();
		return isTaskRegistryReadCurrent(taskId.trim(), "identity");
	};
	const readScope = (field, value, ids) => {
		assertCurrent();
		if (!isTaskRegistryReadScopeCurrent(field, value)) throw new Error("Task registry read candidate scope requires preparation");
		return [...ids].flatMap((taskId) => {
			if (!isTaskCurrent(taskId)) throw new Error("Task registry read identity requires preparation");
			const task = tasks.get(taskId);
			return task ? [cloneTaskRecord(task)] : [];
		});
	};
	return {
		assertOwnerCurrent,
		assertCurrent,
		isTaskCurrent,
		isTaskSettled(taskId) {
			assertCurrent();
			return !hasPendingTaskRegistryEvents(taskId) && isTaskRegistryReadCurrent(taskId, "settled");
		},
		isChildSessionCurrent(childSessionKey) {
			assertCurrent();
			return isTaskRegistryReadScopeCurrent("childSessionKey", childSessionKey.trim());
		},
		hasPendingTasksForFlow(flowId) {
			assertCurrent();
			const { projection, taskIdsByParentFlowId } = getTaskRegistryProcessState();
			const intersects = (scope, pending) => {
				const targetId = pending?.readEventTarget?.()?.taskId ?? scope.taskId;
				const facts = [
					...[.../* @__PURE__ */ new Set([...taskIdsInScope(scope), targetId])].flatMap((taskId) => {
						const task = tasks.get(taskId);
						return task ? [task] : [];
					}),
					...[...pending?.published.values() ?? []].flatMap((task) => task ? [task] : []),
					...pending?.publication?.records.values() ?? []
				];
				if (scope.flowId === flowId || facts.some((task) => task.parentFlowId?.trim() === flowId)) return true;
				return !scope.flowId && !facts.some((task) => task.taskId === targetId);
			};
			const pendingScopes = /* @__PURE__ */ new Set();
			for (const pending of projection.pending) {
				pendingScopes.add(pending.scope);
				if (intersects(pending.scope, pending)) return true;
			}
			for (const scope of projection.dirtyScopes) if (!pendingScopes.has(scope) && intersects(scope)) return true;
			for (const taskId of listPendingTaskRegistryEventTaskIds()) {
				const facts = [tasks.get(taskId), ...[...projection.pending].flatMap((pending) => [pending.published.get(taskId), pending.publication?.records.get(taskId)])].filter((task) => task !== void 0);
				if (facts.length === 0 || facts.some((task) => task.parentFlowId?.trim() === flowId)) return true;
			}
			return [...taskIdsByParentFlowId.get(flowId) ?? []].some((taskId) => {
				const task = tasks.get(taskId);
				return task !== void 0 && isTaskFlowCancellationPending(task);
			});
		},
		getTaskById(taskId) {
			if (!isTaskCurrent(taskId)) throw new Error("Task registry read identity requires preparation");
			const task = tasks.get(taskId.trim());
			return task ? cloneTaskRecord(task) : void 0;
		},
		getTasksByRunId(runId) {
			const normalized = runId.trim();
			return readScope("runId", normalized, getTaskRegistryProcessState().taskIdsByRunId.get(normalized) ?? []);
		},
		listTaskRecordsForChildSessionKey(childSessionKey) {
			const normalized = childSessionKey.trim();
			return readScope("childSessionKey", normalized, taskIdsByRelatedSessionKey.get(normalized) ?? []);
		},
		listTaskRecordsWithAncestors(taskIds, isRootTask) {
			assertCurrent();
			return selectTaskRecordsWithAncestors(tasks, getTaskRegistryProcessState().taskIdsByChildSessionKey, taskIds, isRootTask).map((task) => {
				if (!isTaskCurrent(task.taskId)) throw new Error("Task registry read identity requires preparation");
				return cloneTaskRecord(task);
			});
		},
		listTaskRecordsForOwnerTree(rootOwnerKeys) {
			assertCurrent();
			return selectTaskRecordsForOwnerTree(tasks, taskIdsByOwnerKey, rootOwnerKeys).map((task) => {
				if (!isTaskCurrent(task.taskId)) throw new Error("Task registry read identity requires preparation");
				return cloneTaskRecord(task);
			});
		},
		listTasksForRelatedSessionKey(sessionKey, sessionAgentId) {
			assertCurrent();
			const key = normalizeOptionalString(sessionKey);
			if (!key) return [];
			return listTasksFromIndex(tasks, taskIdsByRelatedSessionKey, key).filter((task) => {
				if (!isTaskCurrent(task.taskId)) throw new Error("Task registry read identity requires preparation");
				return taskMatchesRelatedSession(task, key, sessionAgentId);
			});
		},
		listTasksForAgentId(agentId) {
			assertCurrent();
			const lookup = agentId.trim();
			if (!lookup) return [];
			return [...tasks.values()].filter((task) => task.agentId?.trim() === lookup).map((task) => {
				if (!isTaskCurrent(task.taskId)) throw new Error("Task registry read identity requires preparation");
				return cloneTaskRecord(task);
			}).toSorted(compareTasksNewestFirst);
		}
	};
}
//#endregion
export { resolveTaskSessionAgentIdAsync as a, resolveTaskSessionAgentId as i, prepareTaskRegistryRead as n, taskMatchesRelatedSession as o, prepareTaskRegistryReadOwner as r, createTaskRegistryReadPreparation as t };
