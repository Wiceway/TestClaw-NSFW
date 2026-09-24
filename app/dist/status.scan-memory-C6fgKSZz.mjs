import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { t as resolveMemorySearchConfig } from "./memory-search-Ce1r7tzD.mjs";
import { r as resolveSharedMemoryStatusSnapshot } from "./status.scan.shared-Ccxefyw2.mjs";
//#region src/commands/status.scan-memory.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
/** Returns the owning agent database path for built-in memory. */
function resolveDefaultMemoryDatabasePath(agentId) {
	return resolveAssistantAgentSqlitePath({ agentId });
}
/** Resolves memory index/cache status for the current status scan. */
async function resolveStatusMemoryStatusSnapshot(params) {
	const { getMemorySearchManager } = await statusScanDepsRuntimeModuleLoader.load();
	return await resolveSharedMemoryStatusSnapshot({
		cfg: params.cfg,
		agentStatus: params.agentStatus,
		memoryPlugin: params.memoryPlugin,
		resolveMemoryConfig: resolveMemorySearchConfig,
		getMemorySearchManager,
		requireDefaultDatabasePath: params.requireDefaultDatabasePath
	});
}
//#endregion
export { resolveDefaultMemoryDatabasePath, resolveStatusMemoryStatusSnapshot };
