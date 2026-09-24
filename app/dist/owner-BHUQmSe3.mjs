import { d as resolveAgentWorkspaceDir, l as resolveAgentOperationAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./agent-scope-_30Scclc.mjs";
//#region src/commands/channel-setup/owner.ts
/** Validate the selected operation owner before using its workspace for discovery. */
function resolveChannelSetupOwner(cfg, requestedAgentId) {
	const requested = requestedAgentId?.trim();
	if (requestedAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const agentId = resolveConfiguredAgentId(cfg, requested ?? resolveAgentOperationAgentId(cfg, void 0, {
		surface: "channel plugin discovery",
		hint: "Pass --agent <id> to channels commands or set agents.defaults.systemAgent.agentId."
	}));
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	};
}
//#endregion
export { resolveChannelSetupOwner as t };
