import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
//#region src/state/testclaw-agent-db-metadata.ts
/** Read ownership metadata without loading runtime schema or migration owners. */
function readExistingAgentSchemaMeta(db) {
	if (!tableExists(db, "schema_meta")) return null;
	const row = db.prepare("SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	if (!row) return null;
	return {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
}
//#endregion
export { readExistingAgentSchemaMeta as t };
