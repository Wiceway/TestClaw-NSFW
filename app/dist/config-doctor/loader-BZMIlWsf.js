import { r as loadAssistantPlugins } from "./loader-runtime-load-B2ergWe-.js";
import "./active-runtime-registry-CRb0op67.js";
//#region src/plugins/loader.ts
/** Stable public facade for plugin loading and runtime-registry resolution. */
/** Loads a caller-owned registry value without changing the process-wide active registry. */
function loadPluginRegistryHandle(options = {}) {
	return loadAssistantPlugins({
		...options,
		activate: false
	});
}
/** Collects CLI descriptors through the same validation and instance owner as runtime loading. */
async function loadAssistantPluginCliRegistry(options = {}) {
	return loadAssistantPlugins({
		...options,
		mode: "cli-metadata",
		activate: false
	});
}
/** Loads and installs the registry owned by a process composition root. */
function loadAndActivateRootPluginRegistry(options = {}) {
	return loadAssistantPlugins({
		...options,
		activate: true
	});
}
//#endregion
export { loadPluginRegistryHandle as n, loadAssistantPluginCliRegistry as r, loadAndActivateRootPluginRegistry as t };
