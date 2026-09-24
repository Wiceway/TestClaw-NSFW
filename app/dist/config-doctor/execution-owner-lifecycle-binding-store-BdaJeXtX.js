import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import "./testclaw-state-db-readonly-mjFl_Qah.js";
import "./execution-owner-binding-spQL-oQK.js";
//#region src/audit/execution-owner-lifecycle-binding-store.ts
const EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE = "execution_owner_lifecycle_bindings";
function lifecycleDb(db) {
	return getNodeSqliteKysely(db);
}
/** Removes exact owner metadata without allocating the opt-in table. */
function deleteExecutionOwnerLifecycleMetadata(params) {
	if (params.ownerIds.length === 0 || !tableExists(params.db, "execution_owner_lifecycle_bindings")) return;
	executeSqliteQuerySync(params.db, lifecycleDb(params.db).deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", params.ownerKind).where("owner_id", "in", params.ownerIds));
}
//#endregion
export { deleteExecutionOwnerLifecycleMetadata as t };
