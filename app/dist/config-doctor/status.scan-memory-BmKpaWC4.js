import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C_fSkqnL.js";
import { r as resolveSharedMemoryStatusSnapshot } from "./status.scan.shared-BcGyBrtu.js";
//#region src/commands/status.scan-memory.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime-nMWkNXQ9.js"));
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
