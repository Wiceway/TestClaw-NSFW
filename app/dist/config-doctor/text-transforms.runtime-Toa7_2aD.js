import { n as getActiveRuntimePluginRegistry } from "./active-runtime-registry-CRb0op67.js";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-DZbBeQ88.js";
//#region src/plugins/text-transforms.runtime.ts
/** Resolves merged text transforms from the active runtime plugin registry. */
function resolveRuntimeTextTransforms() {
	const registry = getActiveRuntimePluginRegistry();
	const pluginTextTransforms = Array.isArray(registry?.textTransforms) ? registry.textTransforms.map((entry) => entry.transforms) : [];
	return mergePluginTextTransforms(...pluginTextTransforms);
}
//#endregion
export { resolveRuntimeTextTransforms as t };
