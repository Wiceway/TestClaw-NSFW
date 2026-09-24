import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-C56x-mXN.js";
import { f as prepareModelRuntimeSnapshot } from "./prepared-model-runtime-CvkqszTA.js";
import { l as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-Cnu3jR-o.js";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-CTnvOLly.js";
import { t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-DfRd6a5V.js";
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
