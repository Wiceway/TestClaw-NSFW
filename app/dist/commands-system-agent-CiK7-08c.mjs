import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-Cys5l4an.mjs";
import { r as logVerbose } from "./globals-CUJhO5PM.mjs";
import { l as readChannelContextGatewayContextResolver } from "./admission-evidence-D42R2X7S.mjs";
//#region src/auto-reply/reply/commands-system-agent.ts
const handleSystemAgentCommand = async (params, allowTextCommands) => {
	if (!allowTextCommands) return null;
	const host = (readChannelContextGatewayContextResolver(params.rootCtx ?? params.ctx) ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext)?.()?.hostLifecycle;
	const { extractSystemAgentRescueMessage, runSystemAgentRescueMessage } = await import("./system-agent/rescue-message.js");
	if (extractSystemAgentRescueMessage(params.command.commandBodyNormalized) === null) return null;
	if (!params.command.isAuthorizedSender) {
		logVerbose(`Ignoring /testclaw from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	return {
		shouldContinue: false,
		reply: { text: await runSystemAgentRescueMessage({
			cfg: params.cfg,
			command: params.command,
			commandBody: params.command.commandBodyNormalized,
			agentId: params.agentId,
			isGroup: params.isGroup,
			deps: {
				setupSurface: "gateway",
				gatewayHostLifecycle: host && { request: (action, assertCaller) => host.request(action, () => {
					params.commandInvocationSignal?.throwIfAborted();
					assertCaller();
				}) }
			}
		}) ?? "Assistant did not find a rescue request." }
	};
};
//#endregion
export { handleSystemAgentCommand as t };
