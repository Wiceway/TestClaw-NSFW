import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as isValidAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import "./kysely-sync-DUH0XYlR.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { a as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { d as readSqliteWriterAppVersion, u as readSqliteSchemaHeader } from "./sqlite-readonly-location-ManNE_ip.mjs";
import { t as readExistingAgentSchemaMeta } from "./testclaw-agent-db-metadata-Nf1EFGMj.mjs";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BboyngJR.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-36gEREe5.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-BSZQ5Avg.mjs";
import "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { n as canReuseAssistantAgentIntegrityVerification } from "./testclaw-quarantine-store-BgTM1lrX.mjs";
import { t as assertCanonicalAgentPersistenceVersion } from "./testclaw-agent-db-schema-read-BlI6Qzh2.mjs";
import { n as assertAssistantAgentCurrentRuntimeSchema, o as hasPendingCurrentVersionAgentDatabaseMigration } from "./testclaw-agent-db-schema-helpers-CYxrGCCh.mjs";
import { t as assertAssistantAgentDatabaseForMaintenance } from "./testclaw-agent-db-maintenance-50rOkGc_.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/testclaw-agent-schema-inspection.ts
/** All facts belong to the caller's single read transaction or private snapshot. */
function inspectAgentDatabaseSchema(database, input) {
	if (!input.verifyCurrentSchemaShape && !input.requireStartupMigrationReadiness) try {
		const { userVersion, ...header } = readSqliteSchemaHeader(database, input.inspectOwnership ? input.supportedVersion : void 0);
		return {
			version: userVersion,
			...header
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
	}
	const version = readSqliteUserVersion(database);
	const inspection = { version };
	let checkingShape = false;
	try {
		if (version > input.supportedVersion) {
			const writerAppVersion = readSqliteWriterAppVersion(database);
			return {
				version,
				...writerAppVersion ? { writerAppVersion } : {}
			};
		}
		if (input.inspectOwnership) inspection.agentSchemaMeta = readExistingAgentSchemaMeta(database);
		if (input.requireStartupMigrationReadiness) {
			if (!canReuseAssistantAgentIntegrityVerification(input.pathname, input.startupIntegrityVerification, version !== input.supportedVersion || hasPendingCurrentVersionAgentDatabaseMigration(database))) {
				assertSqliteIntegrity(database, input.pathname);
				inspection.integrityGateOutcome = "healthy";
			} else inspection.integrityGateOutcome = "cached";
			assertCanonicalAgentPersistenceVersion(database, input.pathname, version);
		}
		const agentId = input.agentId ?? (input.requireStartupMigrationReadiness ? readExistingAgentSchemaMeta(database)?.agentId : void 0);
		if (input.verifyCurrentSchemaShape && agentId != null && (!input.requireStartupMigrationReadiness || version > 0)) {
			checkingShape = true;
			assertAssistantAgentDatabaseForMaintenance(database, {
				agentId,
				pathname: input.pathname,
				allowStartupIndexRepair: input.requireStartupMigrationReadiness
			});
		}
		return inspection;
	} catch (error) {
		if (input.requireStartupMigrationReadiness && !checkingShape) return {
			...inspection,
			failure: toStringifiedError(error)
		};
		return {
			...inspection,
			reason: formatErrorMessage(error)
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
	}
}
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
export { preflightAssistantAgentDatabasePath as n, inspectAgentDatabaseSchema as t };
