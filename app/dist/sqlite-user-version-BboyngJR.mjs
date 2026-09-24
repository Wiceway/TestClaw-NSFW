import { r as resolveAssistantPackageRootSync } from "./testclaw-root-CayS889k.mjs";
import { c as resolveRuntimeServiceCommit, t as VERSION } from "./version-BnaMeO13.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { a as TESTCLAW_DATABASE_SCHEMA_DOCS_URL } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-C6kRvGBD.mjs";
//#region src/infra/sqlite-user-version.ts
const SQLITE_SCHEMA_VERSION_ERROR_NAME = "SqliteSchemaVersionError";
var SqliteSchemaVersionError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("newer-schema", message);
		this.name = SQLITE_SCHEMA_VERSION_ERROR_NAME;
	}
};
function isSqliteSchemaVersionError(error) {
	return error instanceof SqliteSchemaVersionError || error instanceof Error && error.name === SQLITE_SCHEMA_VERSION_ERROR_NAME;
}
function readSqliteUserVersion(db) {
	const row = executeWithCachedStatement(db, "PRAGMA user_version", [], (statement) => statement.get());
	return Number(row?.user_version ?? 0);
}
/**
* Name the refusing build from immutable loaded metadata, plus its install root.
* The path remains actionable when multiple installs share a version or build.
*/
function describeRunningAssistantBuild() {
	const commit = resolveRuntimeServiceCommit();
	const root = resolveAssistantPackageRootSync({ moduleUrl: import.meta.url });
	const identity = commit ? `Assistant ${VERSION} (${commit})` : `Assistant ${VERSION}`;
	return root ? `${identity} installed at ${root}` : identity;
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
	return new SqliteSchemaVersionError(`This Assistant build cannot open your existing data.
${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this build supports ${supportedVersion}.\nRefused by ${describeRunningAssistantBuild()}.\nUse a build that supports schema ${schemaVersion} or newer with this state directory. To use an older build, restore your pre-update backup created with testclaw backup create.\nSee ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
}
//#endregion
export { readSqliteUserVersion as a, isSqliteSchemaVersionError as i, createNewerSqliteSchemaVersionError as n, describeRunningAssistantBuild as r, SqliteSchemaVersionError as t };
