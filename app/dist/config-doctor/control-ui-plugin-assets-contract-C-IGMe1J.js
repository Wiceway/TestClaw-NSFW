import { t as normalizeControlUiBasePath } from "./control-ui-shared-BiO6QP54.js";
//#region src/gateway/control-ui-plugin-assets-contract.ts
/** Reserved namespace for authenticated, immutable native plugin browser assets. */
function controlUiPluginAssetRoot(basePath) {
	return `${normalizeControlUiBasePath(basePath)}/__testclaw__/plugins/control-ui/`;
}
function controlUiPluginAssetPrefix(pluginId, basePath) {
	return `${controlUiPluginAssetRoot(basePath)}${encodeURIComponent(pluginId)}/`;
}
//#endregion
export { controlUiPluginAssetRoot as n, controlUiPluginAssetPrefix as t };
