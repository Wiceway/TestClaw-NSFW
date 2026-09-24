import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-BEuqweC1.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-BktfBCzh.js";
import { T as resolveExtraBootstrapPatterns, o as loadExtraBootstrapFilesWithDiagnostics } from "./workspace-_6eikbXk.js";
import { o as resolveBootstrapContextWithProjectedHookFiles } from "./bootstrap-files-BJqBxKbW.js";
import { r as resolveInternalHookSelection, t as isHookLoadable } from "./configured-TTtlZZ8F.js";
import { t as loadWorkspaceHookEntries } from "./workspace-cv0iCWyR.js";
//#region src/hooks/bundled/bootstrap-extra-files/declared-files.ts
/** Loads the extra bootstrap files the hook config declares for a workspace. */
async function loadDeclaredExtraBootstrapFiles(params) {
	const patterns = resolveExtraBootstrapPatterns(params.config);
	if (patterns.length === 0) return {
		files: [],
		diagnostics: []
	};
	return loadExtraBootstrapFilesWithDiagnostics(params.workspaceDir, patterns);
}
//#endregion
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
