import { v as isAcpSessionKey, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Wz3M4QhR.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import "./message-channel-iCC7oIhe.js";
import { i as prepareActiveNodeContext } from "./active-node-context-Chc0tKJ6.js";
import { r as detectRuntimeShell } from "./shell-utils-Bvgm8qFu.js";
import "./model-selection-osPTiirn.js";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-CXOtoB1T.js";
import { i as resolveRuntimeOsLabel } from "./os-summary-B440lihS.js";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-DjoJtPWL.js";
import { t as getMachineDisplayName } from "./machine-name-SR6WYd4V.js";
import { t as buildSystemPromptParams } from "./system-prompt-params-QRdUBVTd.js";
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
