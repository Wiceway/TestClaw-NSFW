import { n as readSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as closeAssistantStateDatabase } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { I as withSharedStateWriteCoordinator, c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
import { r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-cH9jrpMf.mjs";
import { _ as upsertTaskDeliveryStateInDatabase, c as listTaskRecordsByRuntimeSourceIdInDatabase, f as readTaskRegistryMutationSnapshotInDatabase, m as readTaskRegistrySnapshotIfReady, p as readTaskRegistrySnapshot, r as deleteTaskRowsWithDeliveryState, y as upsertTaskWithDeliveryStateInDatabase } from "./task-registry.store.kernel-CTpG8C0S.mjs";
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
	const [{ runAssistantStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./testclaw-state-worker-store-Cbw9_4QI.mjs"), import("./sqlite-worker-store-C0xC-XWX.mjs")]);
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
