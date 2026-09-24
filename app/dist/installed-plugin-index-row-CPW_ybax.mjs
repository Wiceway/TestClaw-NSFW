import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
//#region src/plugins/installed-plugin-index-row.ts
const INSTALLED_PLUGIN_INDEX_STATE_KEY = "plugins.installedIndex";
/** Shared inspection commands use the same existing-only, artifact-preserving reader. */
function readPluginMetadataStateRowSync(selector, databaseOptions, artifactPreservingReadOnly = false) {
	const row = readPluginMetadataStateRowsSync([selector === "installed-index" ? INSTALLED_PLUGIN_INDEX_STATE_KEY : "plugins.bundledDiscovery"], databaseOptions, artifactPreservingReadOnly)[0];
	return row ? { value_json: row.value_json } : void 0;
}
/** Acquire related metadata facts from the same prepared database bytes. */
function readPluginMetadataStateRowsSync(stateKeys, databaseOptions, artifactPreservingReadOnly = false) {
	const read = ({ db }) => {
		if (!tableExists(db, "config_machine_state")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "in", stateKeys)).rows;
	};
	return (artifactPreservingReadOnly ? withExistingAssistantStateDatabaseArtifactPreservingReadOnly(read, databaseOptions) : withExistingAssistantStateDatabaseReadOnly(read, databaseOptions)) ?? [];
}
//#endregion
export { readPluginMetadataStateRowSync as n, readPluginMetadataStateRowsSync as r, INSTALLED_PLUGIN_INDEX_STATE_KEY as t };
