import { r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { w as parseSessionDeliveryRoute } from "./session-key-AvQIavYt.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-BWFNWsJW.js";
import "./agent-scope-BiRi-Smp.js";
import { i as resolveToolsBySender } from "./group-policy-DW27nR9p.js";
//#region src/agents/sender-tool-policy.ts
/**
* Sender-scoped sandbox tool policy resolver.
* Applies per-agent toolsBySender matches before global sender policy so
* channel delivery can narrow tool access by sender identity.
*/
/** Resolves sender-scoped sandbox tool policy, preferring agent config over global config. */
function resolveSenderToolPolicy(params) {
	const cfg = params.config;
	if (!cfg) return;
	const sender = {
		messageProvider: parseSessionDeliveryRoute(params.sessionKey)?.channel ?? params.messageProvider,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	};
	const agentTools = params.agentId && params.agentId.trim() ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const agentPolicy = resolveToolsBySender({
		toolsBySender: agentTools?.toolsBySender,
		...sender
	});
	if (agentPolicy) return pickSandboxToolPolicy(agentPolicy);
	const globalPolicy = resolveToolsBySender({
		toolsBySender: cfg.tools?.toolsBySender,
		...sender
	});
	return pickSandboxToolPolicy(globalPolicy);
}
//#endregion
export { resolveSenderToolPolicy as t };
