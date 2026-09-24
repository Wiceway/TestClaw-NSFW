import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-Cys5l4an.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./agent-scope-_30Scclc.mjs";
import { ln as validateHooksStatusParams } from "./src-BNV0SJoP.mjs";
import { l as getActivePluginRegistry } from "./runtime-D1tHq7F4.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-DQeEb6rV.mjs";
import { t as buildWorkspaceHookStatus } from "./hooks-status-CD5s5v4p.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DePOhdT-.mjs";
//#region src/gateway/server-methods/hooks-status.ts
/** Gateway handler for the live hook status report. */
const hooksStatusHandlers = { "hooks.status": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateHooksStatusParams, "hooks.status", respond)) return;
	const config = context.getRuntimeConfig();
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: config,
		normalize: (value) => typeof value === "string" ? value.trim() || void 0 : void 0
	});
	if (!resolved) return;
	const workspaceDir = resolveAgentWorkspaceDir(config, resolved.agentId);
	const entries = [...(getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry())?.hooks.map((hook) => hook.entry) ?? [], ...loadWorkspaceHookEntries(workspaceDir, { config })];
	respond(true, buildWorkspaceHookStatus(workspaceDir, {
		config,
		entries
	}), void 0);
} };
//#endregion
export { hooksStatusHandlers };
