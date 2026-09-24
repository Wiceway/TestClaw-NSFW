import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CRW06h3K.mjs";
import { a as closeAssistantStateDatabase } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
import { r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-cH9jrpMf.mjs";
import { _t as upsertTaskFlowRowInDatabase, ct as deleteTaskFlowRowInDatabase, ft as readTaskFlowRegistrySnapshot, gt as updateTaskFlowRecordInDatabase, mt as syncTaskMirroredFlowRecordInDatabase, st as bindTaskFlowRecord } from "./task-registry.store.kernel-CTpG8C0S.mjs";
//#region src/tasks/task-flow-registry.store.sqlite.ts
const log = createSubsystemLogger("tasks/task-flow-registry");
let cachedDatabase = null;
function openFlowRegistryDatabase() {
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
	const database = openFlowRegistryDatabase();
	runAssistantStateWriteTransaction(() => {
		write(database);
	});
}
function loadTaskFlowRegistryStateFromSqlite(flowIds) {
	return readTaskFlowRegistrySnapshot(openFlowRegistryDatabase().db, flowIds);
}
/** Loads task flows without creating or migrating shared state. */
function loadTaskFlowRegistryStateFromSqliteReadOnly() {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => readTaskFlowRegistrySnapshot(db)) ?? { flows: /* @__PURE__ */ new Map() };
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
	withWriteTransaction(({ db }) => {
		upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(flow));
	});
}
function syncTaskMirroredFlowInSqlite(task, preparePublication) {
	let committed;
	try {
		return runAssistantStateWriteTransaction(({ db }) => {
			const result = syncTaskMirroredFlowRecordInDatabase(db, task);
			const publication = preparePublication(result);
			stageSqliteTransactionState(db, {
				stage: publication.stage,
				rollback: publication.rollback,
				commit: () => {
					committed = result;
					publication.commit();
				}
			});
			return result;
		});
	} catch (error) {
		if (!committed) throw error;
		log.warn("Task-mirrored flow committed before cleanup failed", {
			taskId: task.taskId,
			flowId: task.parentFlowId,
			error
		});
		return committed;
	}
}
function updateTaskFlowRegistryRecordInSqlite(params, preparePublication) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const result = updateTaskFlowRecordInDatabase(db, params);
		if (result.applied || result.reason !== "invalid_patch") {
			const publication = preparePublication(result);
			stageSqliteTransactionState(db, {
				stage: publication.stage,
				rollback: publication.rollback,
				commit: publication.commit
			});
		}
		return result;
	});
}
/** Binds only the exact flow selected before admission; lifecycle settlement stays owner-native. */
async function bindTaskFlowExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureAssistantStateWorkerContext(params.options);
	const input = {
		flowId: params.flowId,
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runAssistantStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./testclaw-state-worker-store-Cbw9_4QI.mjs"), import("./sqlite-worker-store-C0xC-XWX.mjs")]);
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "flows.bindExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
	withWriteTransaction(({ db }) => deleteTaskFlowRowInDatabase(db, flowId));
}
function closeTaskFlowRegistryDatabase() {
	cachedDatabase = null;
	closeAssistantStateDatabase();
}
//#endregion
export { loadTaskFlowRegistryStateFromSqliteReadOnly as a, upsertTaskFlowRegistryRecordToSqlite as c, loadTaskFlowRegistryStateFromSqlite as i, closeTaskFlowRegistryDatabase as n, syncTaskMirroredFlowInSqlite as o, deleteTaskFlowRegistryRecordFromSqlite as r, updateTaskFlowRegistryRecordInSqlite as s, bindTaskFlowExecution as t };
