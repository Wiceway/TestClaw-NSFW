import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
//#region src/claws/provenance-runtime-read.kernel.ts
function readClawInstallSchemaVersionRows(db) {
	if (!tableExists(db, "claw_installs")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("claw_installs").select([
		"agent_id as agentId",
		"schema_version as schemaVersion",
		"agent_config_digest as agentConfigDigest"
	])).rows;
}
//#endregion
export { readClawInstallSchemaVersionRows as t };
