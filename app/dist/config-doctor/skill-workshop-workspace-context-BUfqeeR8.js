import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/bootstrap-mode.ts
function isHeartbeatLifecycleRunKind(runKind) {
	return runKind === "heartbeat";
}
/** Resolve the bootstrap mode for one agent run. */
function resolveBootstrapMode(params) {
	if (!params.bootstrapPending) return "none";
	if (isHeartbeatLifecycleRunKind(params.runKind) || params.runKind === "cron") return "none";
	if (!params.isPrimaryRun || !params.isInteractiveUserFacing) return "none";
	if (!params.hasBootstrapFileAccess) return "limited";
	return params.isCanonicalWorkspace ? "full" : "limited";
}
//#endregion
//#region src/agents/skill-workshop-workspace-context.ts
const canonicalSkillWorkspace = new AsyncLocalStorage();
function runWithCanonicalSkillWorkspace(canonicalWorkspaceDir, run) {
	return canonicalWorkspaceDir ? canonicalSkillWorkspace.run(canonicalWorkspaceDir, run) : run();
}
function getCanonicalSkillWorkspace() {
	return canonicalSkillWorkspace.getStore();
}
//#endregion
export { resolveBootstrapMode as i, runWithCanonicalSkillWorkspace as n, isHeartbeatLifecycleRunKind as r, getCanonicalSkillWorkspace as t };
