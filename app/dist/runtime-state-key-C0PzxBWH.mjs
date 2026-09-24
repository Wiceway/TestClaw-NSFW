//#region src/plugins/runtime-state-key.ts
/** Process-global symbol shared by every plugin registry runtime projection. */
const PLUGIN_REGISTRY_STATE = Symbol.for("testclaw.pluginRegistryState");
//#endregion
export { PLUGIN_REGISTRY_STATE as t };
