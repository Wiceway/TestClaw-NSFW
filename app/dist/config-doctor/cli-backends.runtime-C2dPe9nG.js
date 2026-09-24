import { n as getPluginRegistryForContext } from "./gateway-request-scope-B7K42D1p.js";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-Dw-35-pc.js";
//#region src/plugins/cli-backends.runtime.ts
function resolveRuntimeCliBackends(mode) {
	const registry = getPluginRegistryForContext();
	return (registry && !isPluginRegistryRetired(registry) ? registry.cliBackends : []).map((entry) => mode === "metadata" ? {
		id: entry.backend.id,
		modelProvider: entry.backend.modelProvider,
		subscriptionAuthDispatch: entry.backend.subscriptionAuthDispatch,
		pluginId: entry.pluginId
	} : Object.assign({}, entry.backend, {
		pluginId: entry.pluginId,
		builtWithAssistantVersion: entry.builtWithAssistantVersion
	}));
}
//#endregion
export { resolveRuntimeCliBackends as t };
