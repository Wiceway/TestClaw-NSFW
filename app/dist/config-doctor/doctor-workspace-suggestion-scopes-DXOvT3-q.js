import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import "./agent-scope-BiRi-Smp.js";
//#region src/flows/doctor-workspace-suggestion-scopes.ts
/** Resolves every configured agent workspace while preserving invalid empty-roster failures. */
function resolveDoctorWorkspaceSuggestionScopes(cfg) {
	const listedAgentIds = listAgentIds(cfg);
	const agentIds = listedAgentIds.length > 0 ? listedAgentIds : [resolveDefaultAgentId(cfg)];
	const labelAgent = agentIds.length > 1;
	return agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
		labelAgent
	}));
}
//#endregion
export { resolveDoctorWorkspaceSuggestionScopes as t };
