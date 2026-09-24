import { S as isSubagentSessionKey, y as isAcpSessionKey } from "./session-key-C_bfgyCp.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Djxkz5Qa.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BykPyYhf.mjs";
import "./message-channel-C5zrzt0f.mjs";
import { r as detectRuntimeShell } from "./shell-utils-DoC1Sfpw.mjs";
import "./model-selection-7SY54ACM.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-B-12bRQs.mjs";
import { i as prepareActiveNodeContext } from "./active-node-context-Chc0tKJ6.mjs";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-D8cwk9dF.mjs";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-DUkGuN0U.mjs";
import { t as getMachineDisplayName } from "./machine-name-weRwShhY.mjs";
import { t as buildSystemPromptParams } from "./system-prompt-params-QRdUBVTd.mjs";
import os from "node:os";
//#region src/agents/prompt-surface.ts
/** Maps a session key to the prompt surface used for tool guidance and runtime behavior. */
function resolveAgentPromptSurfaceForSessionKey(sessionKey) {
	if (sessionKey && isAcpSessionKey(sessionKey)) return "acp_backend";
	return sessionKey && isSubagentSessionKey(sessionKey) ? "subagent" : "testclaw_main";
}
//#endregion
//#region src/agents/runtime-prompt.ts
async function resolveAgentRuntimePrompt(params) {
	const runtimeChannel = normalizeMessageChannel(params.channel);
	const channelPromptContext = {
		cfg: params.config,
		channel: runtimeChannel,
		accountId: params.accountId
	};
	const runtimeCapabilities = collectRuntimeChannelCapabilities(channelPromptContext);
	const reactionGuidance = runtimeChannel && params.config ? resolveChannelReactionGuidance(channelPromptContext) : void 0;
	const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints(channelPromptContext) : void 0;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	const machineName = await getMachineDisplayName();
	await prepareActiveNodeContext();
	return {
		...buildSystemPromptParams({
			config: params.config,
			agentId: params.agentId,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			...Object.hasOwn(params, "preparedRepoRoot") ? { preparedRepoRoot: params.preparedRepoRoot } : {},
			...Object.hasOwn(params, "preparedGitCoauthorPrompt") ? { preparedGitCoauthorPrompt: params.preparedGitCoauthorPrompt } : {},
			runtime: {
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				host: machineName,
				os: resolveRuntimeOsLabel(),
				arch: os.arch(),
				node: process.version,
				model: params.model,
				defaultModel: `${defaultModel.provider}/${defaultModel.model}`,
				shell: detectRuntimeShell(),
				channel: runtimeChannel,
				chatType: params.chatType,
				capabilities: runtimeCapabilities
			}
		}),
		runtimeChannel,
		runtimeCapabilities,
		reactionGuidance,
		messageToolHints
	};
}
//#endregion
export { resolveAgentPromptSurfaceForSessionKey as n, resolveAgentRuntimePrompt as t };
