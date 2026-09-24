import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { n as TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL } from "./testclaw-agent-board-schema-BcoMl6kV.mjs";
//#region src/state/testclaw-agent-progress-card-schema.ts
const SESSION_PROGRESS_CARDS_TABLE = "session_progress_cards";
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, SESSION_PROGRESS_CARDS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "Assistant agent progress-card schema markers are missing."
});
const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL = TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
/** Ensure the additive progress-card table inside the caller's write transaction. */
function ensureAssistantAgentProgressCardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("progress-card schema ensure requires an active transaction");
	db.exec(AGENT_PROGRESS_CARD_SCHEMA_SQL);
}
//#endregion
export { ensureAssistantAgentProgressCardSchemaInTransaction as i, AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL as n, SESSION_PROGRESS_CARDS_TABLE as r, AGENT_PROGRESS_CARD_SCHEMA_SQL as t };
