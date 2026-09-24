import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { d as resolveAgentWorkspaceDir, k as listAgentEntries } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-hLL0vTIh.js";
import "./agent-scope-BiRi-Smp.js";
import { r as isSameAssistantAgentDatabasePath } from "./testclaw-agent-db-registry-DgP56LUX.js";
import { o as resolveSharedAuthStoreOwnership } from "./path-resolve-C56x-mXN.js";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-DH8A5K-d.js";
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
