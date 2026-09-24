import { u as readSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { a as closeAssistantStateDatabase } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { N as withSharedStateWriteCoordinator, c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { n as executionOwnerBindingFromAdmission } from "./execution-owner-binding-spQL-oQK.js";
import { a as listTaskRecordsByRuntimeSourceIdInDatabase, c as readTaskRegistrySnapshot, f as upsertTaskWithDeliveryStateInDatabase, l as readTaskRegistrySnapshotIfReady, n as deleteTaskRowsWithDeliveryState, s as readTaskRegistryMutationSnapshotInDatabase, u as upsertTaskDeliveryStateInDatabase } from "./task-registry.store.kernel-Bnd9Ls7p.js";
//#region src/tasks/task-registry.store.sqlite.ts
let cachedDatabase = null;
function openTaskRegistryDatabase() {
	const database = openAssistantStateDatabase();
	const pathname = database.path;
	if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) return cachedDatabase;
	if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
	cachedDatabase = {
		db: database.db,
		path: pathname
	};
	return cachedDatabase;
}
function withWriteTransaction(write) {
	openTaskRegistryDatabase();
	runAssistantStateWriteTransaction((database) => write(database));
}
function loadTaskRegistryStateFromSqlite() {
	return readTaskRegistrySnapshot(openTaskRegistryDatabase());
}
function withTaskRegistrySqliteMutation(operation) {
	const database = openTaskRegistryDatabase();
	return withSharedStateWriteCoordinator({
		databasePath: database.path,
		existing: database.db,
		operationLabel: "task.mutation"
	}, operation);
}
/** A native compatibility caller joins already-granted worker writes before selecting rows. */
function settleTaskRegistrySqliteWrites(join) {
	const deadlineMs = performance.now() + readSqliteBusyTimeout(openTaskRegistryDatabase().db);
	runAssistantStateWriteTransaction(() => {}, void 0, { operationLabel: "task.event.settle" });
	join(deadlineMs);
}
function loadTaskRegistryMutationStateFromSqlite(scopes) {
	return readTaskRegistryMutationSnapshotInDatabase(openTaskRegistryDatabase().db, scopes);
}
/** Loads task records without creating or migrating shared state. */
function loadTaskRegistryStateFromSqliteReadOnly() {
	return loadTaskRegistryStateFromSqliteReadOnlyResult().snapshot;
}
/** Reads task state only when the existing database already has the canonical task shape. */
function loadTaskRegistryStateFromSqliteReadOnlyResult() {
	return withExistingAssistantStateDatabaseReadOnly(readTaskRegistrySnapshotIfReady) ?? {
		state: "ready",
		snapshot: {
			tasks: /* @__PURE__ */ new Map(),
			deliveryStates: /* @__PURE__ */ new Map()
		}
	};
}
/** Reads task rows for one runtime/source without restoring the process registry snapshot. */
function listTaskRegistryRecordsByRuntimeSourceIdFromSqlite(params) {
	const sourceId = params.sourceId?.trim();
	if (params.sourceId !== void 0 && !sourceId) return [];
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => listTaskRecordsByRuntimeSourceIdInDatabase(db, params.runtime, sourceId)) ?? [];
}
/** Binds only the exact task row selected before admission; runId is never a join key. */
async function bindTaskRunExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureAssistantStateWorkerContext(params.options);
	const input = {
		taskId: params.taskId,
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runAssistantStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./testclaw-state-worker-store-C-YrKqH_.js"), import("./sqlite-worker-store-DHnDUYmC.js")]);
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "tasks.bindExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function upsertTaskWithDeliveryStateToSqlite(params) {
	withWriteTransaction((database) => upsertTaskWithDeliveryStateInDatabase(database, params));
}
function deleteTaskAndDeliveryStateFromSqlite(taskId) {
	withWriteTransaction(({ db }) => {
		deleteTaskRowsWithDeliveryState(db, taskId);
	});
}
function upsertTaskDeliveryStateToSqlite(state) {
	withWriteTransaction(({ db }) => upsertTaskDeliveryStateInDatabase(db, state));
}
function closeTaskRegistryDatabase() {
	cachedDatabase = null;
	closeAssistantStateDatabase();
}
//#endregion
export { loadTaskRegistryMutationStateFromSqlite as a, loadTaskRegistryStateFromSqliteReadOnlyResult as c, upsertTaskWithDeliveryStateToSqlite as d, withTaskRegistrySqliteMutation as f, listTaskRegistryRecordsByRuntimeSourceIdFromSqlite as i, settleTaskRegistrySqliteWrites as l, closeTaskRegistryDatabase as n, loadTaskRegistryStateFromSqlite as o, deleteTaskAndDeliveryStateFromSqlite as r, loadTaskRegistryStateFromSqliteReadOnly as s, bindTaskRunExecution as t, upsertTaskDeliveryStateToSqlite as u };
