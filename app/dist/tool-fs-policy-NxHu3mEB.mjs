import { r as resolveAgentConfig } from "./agent-scope-config-Dm8T0OhW.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-dUIuMpQR.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-DDlVID1U.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-CzCHnKV0.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-6aEa6C7R.mjs";
import "./agent-scope-_30Scclc.mjs";
import "./session-permission-exec-mode-DI2YC7nn.mjs";
//#region src/agents/tool-fs-policy.ts
function resolveToolFsConfig(params) {
	const cfg = params.cfg;
	const globalFs = cfg?.tools?.fs;
	return { workspaceOnly: (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)?.workspaceOnly ?? globalFs?.workspaceOnly };
}
function resolveEffectiveToolFsWorkspaceOnly(params) {
	return resolveToolFsConfig(params).workspaceOnly === true;
}
function resolveEffectiveToolFsRootExpansionAllowed(params) {
	if ((params.workspaceOnly ?? resolveToolFsConfig(params).workspaceOnly) === true) return false;
	const cfg = params.cfg;
	if (!cfg) return true;
	const agentTools = params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const globalTools = cfg.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileAlsoAllow = new Set(agentTools?.alsoAllow ?? globalTools?.alsoAllow ?? []);
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0);
	const globalPolicy = pickSandboxToolPolicy(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	return isToolAllowedByPolicies("read", [
		profilePolicy,
		globalPolicy,
		agentPolicy
	]);
}
//#endregion
export { resolveEffectiveToolFsWorkspaceOnly as n, resolveToolFsConfig as r, resolveEffectiveToolFsRootExpansionAllowed as t };
