import { tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
//#region src/state/testclaw-state-feature-schema.ts
/** Prepare canonical DDL without opening a database; each feature keeps its own handle cache. */
function createAssistantStateSchemaEnsurer(params) {
	const start = TESTCLAW_STATE_SCHEMA_SQL.indexOf(`\nCREATE TABLE IF NOT EXISTS ${params.table} (\n`);
	const endMarker = params.endMarker ?? "\n) STRICT;\n";
	const end = TESTCLAW_STATE_SCHEMA_SQL.indexOf(endMarker, start);
	if (start < 0 || end < start) throw new Error(`Canonical state schema markers are missing for ${params.table}`);
	const schema = TESTCLAW_STATE_SCHEMA_SQL.slice(start, end + endMarker.length);
	const ensuredDatabases = /* @__PURE__ */ new WeakSet();
	return (options = {}) => {
		const database = openAssistantStateDatabase(options);
		if (ensuredDatabases.has(database.db)) return;
		runAssistantStateWriteTransaction(({ db }) => {
			db.exec(schema);
		}, options, { operationLabel: params.operationLabel });
		ensuredDatabases.add(database.db);
	};
}
//#endregion
export { createAssistantStateSchemaEnsurer as t };
