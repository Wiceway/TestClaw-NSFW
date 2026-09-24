import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { C as detectAssistantStateDatabaseSchemaMigrationsFromDatabase, H as resolveDatabasePath, s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
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
