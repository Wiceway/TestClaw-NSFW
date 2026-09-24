import { t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { f as detectAssistantStateDatabaseSchemaMigrationsFromDatabase, j as resolveDatabasePath } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { existsSync } from "node:fs";
//#region src/state/testclaw-state-db-schema-discovery.ts
function detectAssistantStateDatabaseSchemaMigrations(options = {}, behavior = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return [];
	if (behavior.artifactPreservingReadOnly) return withExistingAssistantStateDatabaseArtifactPreservingReadOnly(({ db }) => detectAssistantStateDatabaseSchemaMigrationsFromDatabase(db, pathname), {
		...options,
		path: pathname
	}) ?? [];
	const db = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		return detectAssistantStateDatabaseSchemaMigrationsFromDatabase(db, pathname);
	} finally {
		db.close();
	}
}
//#endregion
export { detectAssistantStateDatabaseSchemaMigrations as t };
