import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-Cys5l4an.mjs";
import { l as getActivePluginRegistry } from "./runtime-D1tHq7F4.mjs";
//#region src/channels/plugins/registry-loader.ts
/**
* Creates a lazy loader that resolves one value from the authoritative channel registry.
*/
function createChannelRegistryLoader(resolveValue) {
	return async (id) => {
		const resolveFromRegistry = (registry) => {
			const pluginEntry = registry?.channels.find((entry) => entry.plugin.id === id);
			return pluginEntry ? resolveValue(pluginEntry) : void 0;
		};
		return resolveFromRegistry(getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry());
	};
}
//#endregion
export { createChannelRegistryLoader as t };
