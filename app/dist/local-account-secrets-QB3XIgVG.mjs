import { a as resolveAgentDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dti8jFIP.mjs";
import "./agent-scope-_30Scclc.mjs";
import "./config-DqAgdhnz.mjs";
import { t as assertAuthProfileStoreAgentOwner } from "./sqlite-BFln1N56.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-p_Glf0Cm.mjs";
//#region src/cli/capability-cli/local-account-secrets.ts
/**
* Prepare the selected agent's account-owned SecretRefs for one standalone local
* capability run. Every agent-scoped local runner calls this before provider auth.
*/
async function prepareLocalCapabilityAccountSecrets(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	assertAuthProfileStoreAgentOwner(agentDir, params.agentId);
	if (getActiveSecretsRuntimeConfigSnapshot()) return;
	const secretsRuntime = await import("./runtime-xnvnIymm.mjs");
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
