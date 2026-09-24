import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-DhOkmnkh.mjs";
import { f as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-DkA7Mb_L.mjs";
import { l as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-DVRCAR25.mjs";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-BcqGAMZo.mjs";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-lc-t_YpV.mjs";
//#region src/gateway/model-auth-refresh.ts
async function refreshModelAuthStateAfterMutation(getRuntimeConfig, agentId) {
	reloadSharedAuthStoreOwnership();
	clearModelAuthStatusUsageCache();
	await refreshActiveProviderAuthRuntimeSnapshot();
	const config = getRuntimeConfig();
	const scope = resolveModelAuthAgentScope(config, agentId);
	if (!scope.ok) throw new Error(modelAuthAgentScopeError(scope).message);
	await prepareModelRuntimeSnapshot({
		config,
		agentId,
		agentDir: scope.agentDir
	});
}
//#endregion
export { refreshModelAuthStateAfterMutation as t };
