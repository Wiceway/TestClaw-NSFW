import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-xAxuUQuv.mjs";
import "./workspace-default-BXyOxTqL.mjs";
import { o as resolveBootstrapContextWithProjectedHookFiles } from "./bootstrap-files-CXk1Bt0f.mjs";
import { t as loadDeclaredExtraBootstrapFiles } from "./declared-files-C0VEbrNa.mjs";
import { r as resolveInternalHookSelection, t as isHookLoadable } from "./configured-BOL7g-bU.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-DQeEb6rV.mjs";
//#region src/agents/bootstrap-files-diagnostics.ts
function isBundledExtraFilesHookSelected(config) {
	if (!config) return false;
	const selection = resolveInternalHookSelection(config);
	if (!selection.configured) return false;
	const discoveryDir = tryResolveConfiguredAgentWorkspaceDir(config) ?? resolveDefaultAgentWorkspaceDir();
	const selected = loadWorkspaceHookEntries(discoveryDir, { config }).find((entry) => entry.hook.name === "bootstrap-extra-files");
	return selected?.hook.source === "testclaw-bundled" && isHookLoadable({
		entry: selected,
		config,
		names: selection.names
	});
}
/** Projects fresh-start bundled declarations without importing or invoking hook handlers. */
async function resolveBootstrapContextForDiagnostics(params) {
	if (!isBundledExtraFilesHookSelected(params.config)) return resolveBootstrapContextWithProjectedHookFiles(params, []);
	const declared = await loadDeclaredExtraBootstrapFiles({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	return resolveBootstrapContextWithProjectedHookFiles(params, declared.files);
}
//#endregion
export { resolveBootstrapContextForDiagnostics as t };
