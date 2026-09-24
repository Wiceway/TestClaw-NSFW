import { t as enableProviderPluginInConfig } from "../provider-enable-config-DJuy-FxN.mjs";
import { a as setProviderWebSearchPluginConfigValue, i as resolveProviderWebSearchPluginConfig, n as getTopLevelCredentialValue, o as setScopedCredentialValue, r as mergeScopedSearchConfig, s as setTopLevelCredentialValue, t as getScopedCredentialValue } from "../web-search-provider-config-CW8dwkHd.mjs";
import { t as createBaseWebSearchProviderContractFields } from "../provider-web-search-contract-fields-BW8B94oB.mjs";
//#region src/plugin-sdk/provider-web-search-contract.ts
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
function createWebSearchProviderContractFields(options) {
	const selectionPluginId = options.selectionPluginId;
	return {
		...createBaseWebSearchProviderContractFields(options),
		...selectionPluginId ? { applySelectionConfig: (config) => enableProviderPluginInConfig(config, selectionPluginId).config } : {}
	};
}
//#endregion
export { createWebSearchProviderContractFields, enableProviderPluginInConfig as enablePluginInConfig, getScopedCredentialValue, getTopLevelCredentialValue, mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig, setProviderWebSearchPluginConfigValue, setScopedCredentialValue, setTopLevelCredentialValue };
