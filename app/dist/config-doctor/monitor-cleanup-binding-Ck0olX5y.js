import { p as resolveConfigPath } from "./paths-DeOFr7iP.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
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
