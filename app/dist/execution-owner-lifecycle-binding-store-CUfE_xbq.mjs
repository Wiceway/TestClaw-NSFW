import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { t as classifyExecutionOwnerBinding } from "./execution-owner-binding-cH9jrpMf.mjs";
//#region src/audit/execution-owner-lifecycle-binding-store.ts
const EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE = "execution_owner_lifecycle_bindings";
const SCHEMA_START = `CREATE TABLE IF NOT EXISTS ${EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE} (`;
const SCHEMA_END = ") STRICT;";
function lifecycleDb(db) {
	return getNodeSqliteKysely(db);
}
/** Creates only the canonical additive metadata table at first admitted owner use. */
function ensureExecutionOwnerLifecycleBindingSchema(db) {
	if (tableExists(db, "execution_owner_lifecycle_bindings")) return;
	const start = TESTCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_START);
	const end = start < 0 ? -1 : TESTCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_END, start);
	if (start < 0 || end < start) throw new Error("Assistant execution owner lifecycle binding schema marker is missing.");
	db.exec(TESTCLAW_STATE_SCHEMA_SQL.slice(start, end + 9));
}
function classifyRetainedBinding(current, binding) {
	const state = classifyExecutionOwnerBinding({
		contextId: current.context_id,
		executionId: current.execution_id
	}, binding);
	return state === "unbound" ? "mismatch" : state;
}
/** Stores one exact admission identity after its canonical owner row has been revalidated. */
function bindExecutionOwnerLifecycleMetadata(params) {
	ensureExecutionOwnerLifecycleBindingSchema(params.db);
	const database = lifecycleDb(params.db);
	const current = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	if (current) return classifyRetainedBinding(current, params.binding);
	const inserted = executeSqliteQuerySync(params.db, database.insertInto(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).values({
		owner_kind: params.ownerKind,
		owner_id: params.ownerId,
		context_id: params.binding.contextId,
		execution_id: params.binding.executionId
	}).onConflict((conflict) => conflict.columns(["owner_kind", "owner_id"]).doNothing()));
	if (Number(inserted.numAffectedRows ?? 0n) === 1) return "bound";
	const raced = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	return raced ? classifyRetainedBinding(raced, params.binding) : "mismatch";
}
/** Removes exact owner metadata without allocating the opt-in table. */
function deleteExecutionOwnerLifecycleMetadata(params) {
	if (params.ownerIds.length === 0 || !tableExists(params.db, "execution_owner_lifecycle_bindings")) return;
	executeSqliteQuerySync(params.db, lifecycleDb(params.db).deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", params.ownerKind).where("owner_id", "in", params.ownerIds));
}
//#endregion
export { deleteExecutionOwnerLifecycleMetadata as n, bindExecutionOwnerLifecycleMetadata as t };
