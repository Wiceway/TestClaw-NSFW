import { p as resolveConfigPath } from "./paths-DvpAEtA8.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import path from "node:path";
//#region src/claws/monitor-cleanup-binding.ts
/** Claw files remain local; the serving monitor owner must use that same state and config. */
function resolveClawMonitorCleanupBinding(cronStorePath) {
	return {
		configPath: path.resolve(resolveConfigPath()),
		statePath: path.resolve(resolveAssistantStateSqlitePath()),
		cronStorePath: path.resolve(cronStorePath)
	};
}
//#endregion
export { resolveClawMonitorCleanupBinding as t };
