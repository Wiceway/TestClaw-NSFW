import { a as loadInstalledPluginIndexWithDiscovery } from "./installed-plugin-index-C37uqoxY.js";
import { o as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-record-match-DU0U5gm6.js";
import { r as resolvePluginSetupProviderCore } from "./setup-registry-D6x-qZ5V.js";
import { r as resolvePluginProvidersCore } from "./providers.runtime-CJ_q5m-V.js";
import { n as resolveProviderPluginChoiceCore, r as runProviderModelSelectedHookCore } from "./provider-wizard-DJJsaJe2.js";
//#region src/plugins/provider-auth-choice.runtime.ts
/** Runtime wrapper for provider plugin wizard choice resolution. */
function resolveProviderPluginChoice(...args) {
	return resolveProviderPluginChoiceCore(...args);
}
/** Runtime wrapper for provider model-selected hook dispatch. */
function runProviderModelSelectedHook(...args) {
	return runProviderModelSelectedHookCore(...args);
}
/** Runtime wrapper for registered model provider discovery. */
function resolvePluginProviders(params, preparedInstallRecords) {
	if (!preparedInstallRecords) return resolvePluginProvidersCore(params);
	const pluginMetadataSnapshot = loadInstalledPluginIndexWithDiscovery({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		installRecords: {
			...loadInstalledPluginIndexInstallRecordsSync({ env: params.env }),
			...preparedInstallRecords
		}
	});
	return resolvePluginProvidersCore({
		...params,
		pluginMetadataSnapshot
	});
}
/** Runtime wrapper for plugin setup-provider discovery. */
function resolvePluginSetupProvider(...args) {
	return resolvePluginSetupProviderCore(...args);
}
//#endregion
export { runProviderModelSelectedHook as i, resolvePluginSetupProvider as n, resolveProviderPluginChoice as r, resolvePluginProviders as t };
