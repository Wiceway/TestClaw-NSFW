import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-g2PTirPA.mjs";
import { t as readExistingAgentSchemaMeta } from "./testclaw-agent-db-metadata-Nf1EFGMj.mjs";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { a as registerAssistantAgentDatabaseIdentity, o as classifyAssistantAgentDatabaseReadError } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./testclaw-agent-db-schema-read-BlI6Qzh2.mjs";
import fs from "node:fs";
//#region src/state/testclaw-agent-db-readonly-open.ts
function readAssistantAgentDatabase(database, operation) {
	try {
		return {
			found: true,
			value: operation(database)
		};
	} catch (error) {
		throw sqlitePrimaryResultCode(error) === 1 ? classifyAssistantAgentDatabaseReadError(database.db, error) : error;
	}
}
/** Recheck committed admission facts before using an existing read-only connection. */
function hasAssistantAgentReadOnlySchema(database) {
	const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
	assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
	const schemaMeta = readExistingAgentSchemaMeta(database.db);
	if (!schemaMeta) return false;
	assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
	return true;
}
/** Fresh-only callers do not need the writable runtime's process-held connection cache. */
function withFreshAssistantAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const opened = openAssistantAgentDatabaseReadOnly(options, behavior);
	if (!opened.found) return opened;
	try {
		return readAssistantAgentDatabase(opened.database, operation);
	} finally {
		opened.database.close();
	}
}
/** Open one existing agent database without creating, registering, migrating, or adopting it. */
function openAssistantAgentDatabaseReadOnly(options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveAssistantAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoAssistantAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	if (!fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	const db = openNodeSqliteDatabase(pathname, {
		readOnly: true,
		timeout: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
		...behavior.allowExtension ? { allowExtension: true } : {}
	});
	let closed = false;
	const close = () => {
		if (closed) return;
		clearNodeSqliteKyselyCacheForDatabase(db);
		if (db.isOpen) db.close();
		closed = true;
	};
	try {
		registerAssistantAgentDatabaseIdentity(db);
		const database = {
			agentId,
			db,
			path: pathname,
			close
		};
		if (!hasAssistantAgentReadOnlySchema(database)) {
			close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		return {
			found: true,
			database
		};
	} catch (error) {
		close();
		throw error;
	}
}
//#endregion
export { withFreshAssistantAgentDatabaseReadOnly as i, openAssistantAgentDatabaseReadOnly as n, readAssistantAgentDatabase as r, hasAssistantAgentReadOnlySchema as t };
