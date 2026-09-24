import { n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { W as ensureColumn } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { kt as SESSION_OWNER_COLUMN_DEFINITIONS } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { f as runAssistantAgentWriteTransaction } from "./testclaw-agent-db-Ckg86YCZ.js";
import { S as hasSqliteSessionOwnerColumns } from "./session-canonical-key-Bxbtl4CI.js";
import { a as publishSessionEntryCacheInvalidation, m as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
//#region src/config/sessions/session-accessor.sqlite-owner.ts
function replaceSessionOwnerInTransaction(database, sessionKey, owner) {
	if (!hasSqliteSessionOwnerColumns(database.db)) {
		if (!owner?.actor.id) return false;
		for (const { columnName, dataType, tableName } of SESSION_OWNER_COLUMN_DEFINITIONS) ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	let updated = false;
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		updated = executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_nodes").set({
			owner_actor_type: owner?.actor.type ?? null,
			owner_actor_id: owner?.actor.id ?? null,
			owner_assigned_by_type: owner?.assignedBy?.type ?? null,
			owner_assigned_by_id: owner?.assignedBy?.id ?? null,
			owner_assigned_at: owner?.assignedAt ?? null
		}).where("session_key", "=", sessionKey)).numAffectedRows === 1n;
	});
	if (!updated) return false;
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: { kind: "unchanged" }
	}, writeGeneration);
	return true;
}
function assignSessionOwner(scope, params) {
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const owner = {
		actor: params.owner,
		assignedBy: params.assignedBy,
		assignedAt: params.assignedAt ?? Date.now()
	};
	return runAssistantAgentWriteTransaction((database) => {
		params.assertCurrent?.();
		return replaceSessionOwnerInTransaction(database, resolved.sessionKey, owner);
	}, options, { operationLabel: "sessions.assign-owner" }) ? owner : null;
}
//#endregion
export { replaceSessionOwnerInTransaction as n, assignSessionOwner as t };
