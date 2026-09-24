import { t as isValidAgentId } from "./agent-id-C8MGgrNG.js";
import "./session-key-AvQIavYt.js";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import "./kysely-sync-CICmT-bh.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { f as setSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { M as configureSqliteReadOnlyPragmas } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BppRXydv.js";
import { r as assertSqliteIntegrity } from "./error-utils-B4pDpAz2.js";
import "./testclaw-state-db-cache-BxGqhkwE.js";
import { n as assertAssistantAgentCurrentRuntimeSchema } from "./testclaw-agent-db-schema-helpers-BWt3HuU6.js";
import { t as assertAssistantAgentDatabaseForMaintenance } from "./testclaw-agent-db-maintenance-DEefvrFC.js";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/testclaw-agent-schema-inspection.ts
/** Validate one consolidated agent copy using this release's exact maintenance reader.
* This never discovers, registers, migrates, or opens an ordinary runtime store.
*/
async function preflightAssistantAgentDatabasePath(databasePath, agentId) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "testclaw.agent-schema-preflight.v1",
		databasePath: resolvedPath,
		agentId,
		targetVersion: 23,
		requiresWrite: false,
		issues: []
	};
	let database;
	let foundVersion = null;
	let status = "indeterminate";
	try {
		if (!isValidAgentId(agentId) || agentId !== agentId.trim().toLowerCase()) throw new Error("Agent preflight requires an explicit canonical agent ID.");
		const inspectionPath = realpathSync.native(resolvedPath);
		if (inspectionPath !== resolvedPath || !statSync(inspectionPath).isFile()) throw new Error("Agent preflight requires a canonical regular copied database path.");
		if ([
			"-wal",
			"-shm",
			"-journal"
		].some((suffix) => existsSync(inspectionPath + suffix))) throw new Error("Agent preflight requires a consolidated snapshot with no SQLite sidecars.");
		database = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(inspectionPath), { readOnly: true });
		setSqliteBusyTimeout(database, TESTCLAW_SQLITE_BUSY_TIMEOUT_MS);
		configureSqliteReadOnlyPragmas(database);
		assertSqliteIntegrity(database, resolvedPath);
		foundVersion = readSqliteUserVersion(database);
		status = "incompatible";
		assertAssistantAgentDatabaseForMaintenance(database, {
			agentId,
			pathname: resolvedPath
		});
		assertAssistantAgentCurrentRuntimeSchema(database, {
			agentId,
			pathname: resolvedPath
		});
		return {
			...base,
			foundVersion,
			status: "exact"
		};
	} catch (error) {
		return {
			...base,
			foundVersion,
			status,
			reason: formatErrorMessage(error)
		};
	} finally {
		if (database) clearNodeSqliteKyselyCacheForDatabase(database);
		database?.close();
	}
}
//#endregion
export { preflightAssistantAgentDatabasePath };
