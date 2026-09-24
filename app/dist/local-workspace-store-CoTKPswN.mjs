import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
//#region src/gateway/worker-environments/local-workspace-store.ts
const table = "local_workspace_projections";
const query = (db) => getNodeSqliteKysely(db);
/** Local executions share the reconciliation engine, never a remote placement identity. */
function localWorkspaceStore(env = process.env) {
	const read = () => openAssistantStateDatabase({ env }).db;
	const getFrom = (db, id) => tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("worktree_id", "=", id)) : void 0;
	const get = (id) => getFrom(read(), id);
	return {
		get,
		revision(id) {
			const db = read();
			return tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select("revision").where("worktree_id", "=", id))?.revision : void 0;
		},
		create(row, assertCurrent) {
			return runAssistantStateWriteTransaction(({ db }) => {
				db.exec(extractSqliteTableSchema(TESTCLAW_STATE_SCHEMA_SQL, table));
				assertCurrent();
				if (getFrom(db, row.worktree_id)) throw new Error("Local workspace binding already exists");
				return executeSqliteQueryTakeFirstSync(db, query(db).insertInto(table).values({
					...row,
					revision: 0
				}).returningAll());
			}, { env });
		},
		update(row, patch, assertCurrent) {
			return runAssistantStateWriteTransaction(({ db }) => {
				assertCurrent();
				if (!Number.isSafeInteger(row.revision + 1)) throw new Error("Local workspace revision exhausted");
				const next = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
					...patch,
					revision: row.revision + 1
				}).where("worktree_id", "=", row.worktree_id).where("revision", "=", row.revision).returningAll());
				if (!next) throw new Error("Local workspace binding changed");
				return next;
			}, { env });
		},
		delete(row, assertCurrent) {
			runAssistantStateWriteTransaction(({ db }) => {
				assertCurrent();
				if (row.pending_ref || row.journal_json) throw new Error("Local workspace has unsettled edits");
				if (!executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom(table).where("worktree_id", "=", row.worktree_id).where("revision", "=", row.revision).returning("worktree_id"))) throw new Error("Local workspace binding changed");
			}, { env });
		}
	};
}
//#endregion
export { localWorkspaceStore as t };
