import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { t as readExistingAgentSchemaMeta } from "./testclaw-agent-db-metadata-Nf1EFGMj.mjs";
import { a as readSqliteUserVersion, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-BboyngJR.mjs";
import "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { t as AssistantAgentDatabaseMediaMigrationRequiredError } from "./testclaw-agent-db-migration-required-C7_ERLHP.mjs";
//#region src/state/testclaw-agent-db-schema-read.ts
function assertSupportedAgentSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > 23) throw createNewerSqliteSchemaVersionError("Assistant agent database", pathname, userVersion, 23);
	return userVersion;
}
/** Readers may pass their immediate check; writers reread the version after integrity work. */
function assertCanonicalAgentPersistenceVersion(db, pathname, userVersion = readSqliteUserVersion(db)) {
	const hasApplicationSchema = userVersion === 0 && db.prepare("SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1").get();
	const isNewUnownedDatabase = userVersion === 0 && readExistingAgentSchemaMeta(db) === null && !hasApplicationSchema;
	if (userVersion < 17 && !isNewUnownedDatabase) throw new AssistantAgentDatabaseMediaMigrationRequiredError(pathname, userVersion);
	if (userVersion < 23 && !isNewUnownedDatabase) throw new Error(`Assistant agent database ${pathname} uses schema version ${userVersion}; stop active agents and run testclaw doctor --fix to migrate session identities before using it.`);
}
function assertExistingAgentSchemaOwner(existing, agentId, pathname) {
	if (!existing) return;
	if (existing.role !== "agent") throw new Error(`Assistant agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent.`);
	if (!existing.agentId) throw new Error(`Assistant agent database ${pathname} has no agent owner.`);
	if (normalizeAgentId(existing.agentId) !== agentId) throw new Error(`Assistant agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`);
}
//#endregion
export { assertExistingAgentSchemaOwner as n, assertSupportedAgentSchemaVersion as r, assertCanonicalAgentPersistenceVersion as t };
