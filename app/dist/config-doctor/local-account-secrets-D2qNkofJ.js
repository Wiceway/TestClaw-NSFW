import { a as resolveAgentDir } from "./agent-scope-config-BEuqweC1.js";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DTssNCAN.js";
import "./agent-scope-BiRi-Smp.js";
import "./config-CiBXBfE2.js";
import { t as assertAuthProfileStoreAgentOwner } from "./sqlite-C9aIS6tB.js";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-3FPGpNUN.js";
//#region src/cli/capability-cli/local-account-secrets.ts
/**
* Prepare the selected agent's account-owned SecretRefs for one standalone local
* capability run. Every agent-scoped local runner calls this before provider auth.
*/
async function prepareLocalCapabilityAccountSecrets(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	assertAuthProfileStoreAgentOwner(agentDir, params.agentId);
	if (getActiveSecretsRuntimeConfigSnapshot()) return;
	const secretsRuntime = await import("./runtime-BBBvZ8cN.js");
	const snapshot = await secretsRuntime.prepareSecretsRuntimeSnapshot({
		config: getRuntimeConfigSourceSnapshot() ?? params.cfg,
		assignmentConfig: params.cfg,
		agentDirs: [agentDir],
		includeConfigRefs: false,
		allowUnavailableSecretOwners: true
	});
	secretsRuntime.activateSecretsRuntimeSnapshot(snapshot);
}
//#endregion
export { prepareLocalCapabilityAccountSecrets as t };
