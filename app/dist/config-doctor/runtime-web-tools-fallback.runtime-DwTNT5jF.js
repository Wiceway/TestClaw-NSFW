import { t as resolvePluginWebFetchProviders } from "./web-fetch-providers.runtime-B-VayAvc.js";
import { t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime-qeQCUTdB.js";
//#region src/secrets/runtime-web-tools-fallback.runtime.ts
/** Lazy fallback provider discovery for web-tool secret metadata. */
/** Lazy-loaded provider discovery fallback used when public artifacts cannot prove the surface. */
const runtimeWebToolsFallbackProviders = {
	resolvePluginWebFetchProviders,
	resolvePluginWebSearchProviders
};
//#endregion
export { runtimeWebToolsFallbackProviders };
