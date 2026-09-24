import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import "./sqlite-transaction-C94DYooc.js";
import { a as canonicalSessionValidationQuery, m as validateCanonicalSessionRow, s as hasCanonicalSessionValidationProjection } from "./session-canonical-key-Bxbtl4CI.js";
import "kysely";
//#region src/config/sessions/session-canonical-validation.ts
function hasPendingCanonicalSessionValidation(database) {
	return hasCanonicalSessionValidationProjection(database) && Boolean(executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_canonical_validation_pending").select("session_key").limit(1)));
}
function prepareCanonicalWriterQueries(database) {
	const db = getNodeSqliteKysely(database.db);
	return {
		pending: prepareSqliteQueryTakeFirstSync(database.db, (parameter) => db.selectFrom("session_canonical_validation_pending").select("session_key").where("session_key", "=", parameter((key) => key))),
		row: prepareSqliteQueryTakeFirstSync(database.db, (parameter) => canonicalSessionValidationQuery(database).where("session_nodes.session_key", "=", parameter((key) => key))),
		certify: prepareSqliteQuerySync(database.db, (parameter) => db.deleteFrom("session_canonical_validation_pending").where("session_key", "=", parameter((key) => key)))
	};
}
const canonicalWriterQueries = /* @__PURE__ */ new WeakMap();
/** Canonical writers certify their final row within their existing transaction. */
function certifyCanonicalSessionValidationRow(database, sessionKey) {
	if (!database.db.isTransaction || !hasCanonicalSessionValidationProjection(database)) return;
	let queries = canonicalWriterQueries.get(database.db);
	if (!queries) {
		queries = prepareCanonicalWriterQueries(database);
		canonicalWriterQueries.set(database.db, queries);
	}
	const pending = queries.pending(sessionKey);
	if (!pending) return;
	const row = queries.row(pending.session_key);
	if (row) validateCanonicalSessionRow(row);
	queries.certify(pending.session_key);
}
//#endregion
export { hasPendingCanonicalSessionValidation as n, certifyCanonicalSessionValidationRow as t };
