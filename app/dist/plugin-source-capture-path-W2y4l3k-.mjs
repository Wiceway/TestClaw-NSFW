//#region src/plugins/plugin-source-capture-path.ts
const PLUGIN_SOURCE_CAPTURE_PREFIX = "testclaw-plugin-build-";
function isLegacyPluginSourceCaptureName(name) {
	return name.startsWith("testclaw-plugin-build-") || name.startsWith("testclaw-model-catalog-");
}
//#endregion
export { isLegacyPluginSourceCaptureName as n, PLUGIN_SOURCE_CAPTURE_PREFIX as t };
