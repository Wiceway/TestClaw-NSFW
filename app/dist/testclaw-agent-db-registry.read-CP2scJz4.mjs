import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { i as resolveAssistantRegisteredAgentDatabasePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { f as detectAssistantStateDatabaseSchemaMigrationsFromDatabase } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
//#region src/state/testclaw-agent-db-registry.read.ts
/** Read durable registrations from an already opened live or captured database. */
function readAssistantAgentDatabaseRegistryRows(database, pathname) {
	const db = getNodeSqliteKysely(database);
	const registryTable = executeSqliteQueryTakeFirstSync(database, db.selectFrom("sqlite_master").select("type").where("name", "=", "agent_databases"));
	if (!registryTable) return [];
	if (registryTable.type !== "table") throw new Error(`Assistant state database ${pathname} has an invalid agent registry.`);
	return executeSqliteQuerySync(database, db.selectFrom("agent_databases").selectAll().orderBy("agent_id", "asc").orderBy("path", "asc")).rows;
}
function readAgentDatabasePreflightTargets(database, registryPath) {
	return readAssistantAgentDatabaseRegistryRows(database, registryPath).flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: resolveAssistantRegisteredAgentDatabasePath(registryPath, row.path)
	}] : []);
}
function readRegisteredAgentDatabaseRows(database, pathname, artifactPreserving) {
	const schemaMigrations = detectAssistantStateDatabaseSchemaMigrationsFromDatabase(database, pathname);
	if (!artifactPreserving && schemaMigrations.length > 0) throw new Error(`Assistant state database ${pathname} has a legacy agent database registry schema; run testclaw doctor --fix to migrate it.`);
	return readAssistantAgentDatabaseRegistryRows(database, pathname).map((row) => ({
		agentId: normalizeAgentId(row.agent_id),
		path: resolveAssistantRegisteredAgentDatabasePath(pathname, row.path),
		schemaVersion: row.schema_version,
		lastSeenAt: row.last_seen_at,
		sizeBytes: row.size_bytes
	}));
}
//#endregion
export { readRegisteredAgentDatabaseRows as n, readAssistantAgentDatabaseRegistryRows as r, readAgentDatabasePreflightTargets as t };
