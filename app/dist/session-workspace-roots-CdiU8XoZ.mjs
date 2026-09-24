import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./agent-scope-_30Scclc.mjs";
//#region src/gateway/session-workspace-roots.ts
/** One persisted workspace owner for file browsing, diff state, and media containment. */
function resolveSessionWorkspaceRoots(cfg, agentId, entry) {
	const spawnedCwd = normalizeOptionalString(entry.spawnedCwd);
	const spawnedWorkspaceDir = normalizeOptionalString(entry.spawnedWorkspaceDir);
	const configuredWorkspaceDir = spawnedCwd || spawnedWorkspaceDir ? void 0 : normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
	return {
		spawnedCwd,
		root: spawnedWorkspaceDir ?? spawnedCwd ?? configuredWorkspaceDir,
		diffCwd: spawnedCwd ?? spawnedWorkspaceDir ?? configuredWorkspaceDir
	};
}
//#endregion
export { resolveSessionWorkspaceRoots as t };
