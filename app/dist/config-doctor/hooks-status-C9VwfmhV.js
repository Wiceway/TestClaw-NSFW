import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BEuqweC1.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B7K42D1p.js";
import "./agent-scope-BiRi-Smp.js";
import { rn as validateHooksStatusParams } from "./validator-registry-Dpl5QmuY.js";
import { l as getActivePluginRegistry } from "./runtime-B980B6n3.js";
import { t as loadWorkspaceHookEntries } from "./workspace-cv0iCWyR.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-CQMVVg1V.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-Dsqtwjpe.js";
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
