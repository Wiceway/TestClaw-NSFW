import { n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { t as ensureColumn } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { E as SESSION_OWNER_COLUMN_DEFINITIONS } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { f as runAssistantAgentWriteTransaction } from "./testclaw-agent-db-DAdiee0a.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { c as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-status-DgteG5a_.mjs";
import { a as publishSessionEntryCacheInvalidation, m as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
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
