import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
//#region src/state/config-machine-state.ts
function normalizeConfigMachineStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function readConfigMachineStateRowInDatabase(database, key) {
	if (!tableExists(database, "config_machine_state")) return;
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", normalizeConfigMachineStateKey(key)));
}
function readConfigMachineStateWithMetadata(key, options = {}, behavior = {}) {
	const read = ({ db: database }) => {
		const row = readConfigMachineStateRowInDatabase(database, key);
		return row ? {
			value: JSON.parse(row.value_json),
			updatedAtMs: row.updated_at_ms
		} : void 0;
	};
	return behavior.artifactPreservingReadOnly ? withExistingAssistantStateDatabaseArtifactPreservingReadOnly(read, options) : withExistingAssistantStateDatabaseReadOnly(read, options);
}
function readConfigMachineState(key, options = {}, behavior = {}) {
	return readConfigMachineStateWithMetadata(key, options, behavior)?.value;
}
//#endregion
export { readConfigMachineState as n, readConfigMachineStateWithMetadata as r, normalizeConfigMachineStateKey as t };
