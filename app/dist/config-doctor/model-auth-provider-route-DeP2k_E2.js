import { a as resolveMergedModelProviderConfig, i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-CT8He4O9.js";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-Dzv8ad-5.js";
import { t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-Ba1j-tLo.js";
//#region src/agents/model-auth-provider-route.ts
/** Endpoint-conditioned aliases follow the selected model before any auth state mutation. */
function resolveModelProviderAuthConfig(params) {
	const modelBaseUrl = params.modelBaseUrl ?? (params.modelId ? findConfiguredProviderModel(resolveMergedModelProviderConfig(params.config, params.provider), params.provider, params.modelId, createProviderModelCatalogIdNormalizer(params.provider, params.metadataSnapshot))?.baseUrl?.trim() : void 0);
	if (typeof modelBaseUrl !== "string" || !modelBaseUrl) return params.config;
	const config = projectModelProviderConfig(params.config, params.provider, { baseUrl: modelBaseUrl });
	return resolveProviderIdForAuth(params.provider, params) === resolveProviderIdForAuth(params.provider, {
		...params,
		config
	}) ? params.config : config;
}
//#endregion
export { resolveModelProviderAuthConfig as t };
