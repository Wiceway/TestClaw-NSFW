import { r as isPathInside } from "./path-guards-0NKGHIHl.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./session-key-C_bfgyCp.mjs";
import { n as listAgentEntries } from "./agent-roster-Cl9s4QHb.mjs";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-BZ9qYcsx.mjs";
import "./agent-scope-_30Scclc.mjs";
import { o as resolveSharedAuthStoreOwnership } from "./path-resolve-DhOkmnkh.mjs";
import { r as isSameAssistantAgentDatabasePath } from "./testclaw-agent-db-registry-XnPsrvLm.mjs";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-C3E6FnSL.mjs";
//#region src/agents/agent-delete-safety.ts
/** True when deleting this agent database would remove the legacy shared auth store. */
function isSharedAuthStoreOwner(params) {
	return params.ownership.location === "legacy-main" && isSameAssistantAgentDatabasePath(params.agentAuthDbPath, params.sharedAuthDbPath);
}
function formatSharedAuthStoreOwnerDeleteError(agentId) {
	return `Agent "${agentId}" owns the legacy shared auth store and cannot be deleted. Run testclaw doctor --fix to migrate shared auth, then retry.`;
}
function isInheritedAuthStoreOwner(cfg, agentId) {
	if (!cfg.agents?.defaults?.authInheritance?.agentId?.trim() && resolveSharedAuthStoreOwnership().location !== "legacy-main") return false;
	return agentId === normalizeAgentId(resolveLegacyInheritedAuthAgentId(cfg));
}
function workspacePathsOverlap(left, right) {
	const normalizedLeft = resolveCanonicalWorkspacePath(left.replaceAll("\0", ""));
	const normalizedRight = resolveCanonicalWorkspacePath(right.replaceAll("\0", ""));
	return isPathInside(normalizedRight, normalizedLeft) || isPathInside(normalizedLeft, normalizedRight);
}
/** Lists other agents whose workspaces overlap a candidate delete target. */
function findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir, env) {
	const entries = listAgentEntries(cfg);
	const normalizedAgentId = normalizeAgentId(agentId);
	const overlappingAgentIds = [];
	for (const entry of entries) {
		const otherAgentId = normalizeAgentId(entry.id);
		if (otherAgentId === normalizedAgentId) continue;
		if (workspacePathsOverlap(workspaceDir, resolveAgentWorkspaceDir(cfg, otherAgentId, env))) overlappingAgentIds.push(otherAgentId);
	}
	return overlappingAgentIds;
}
//#endregion
export { isSharedAuthStoreOwner as i, formatSharedAuthStoreOwnerDeleteError as n, isInheritedAuthStoreOwner as r, findOverlappingWorkspaceAgentIds as t };
