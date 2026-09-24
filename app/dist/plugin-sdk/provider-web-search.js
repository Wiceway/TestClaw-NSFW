import { t as formatCliCommand } from "../command-format-D2yOb8RI.mjs";
import { p as resolveSecretInputRef, u as normalizeSecretInputString } from "../types.secrets-B5xWSzLp.mjs";
import { n as enablePluginInConfig } from "../enable-D3u-sCIu.mjs";
import { n as normalizeSecretInput } from "../normalize-secret-input-Df_qhWv_.mjs";
import { n as readProviderEnvValue } from "../provider-credential-values-DSE2VVU-.mjs";
import { o as wrapWebContent } from "../external-content-CLufk6dK.mjs";
import { t as jsonResult } from "../tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam, l as readNonNegativeIntegerParam, p as readStringArrayParam, u as readNumberParam } from "../common-C3p8rD5A.mjs";
import { a as truncateWebFetchText, r as markdownToText } from "../web-fetch-utils-DnxqFjuE.mjs";
import { a as readResponseText, c as resolveTimeoutSeconds, i as readCache, l as writeCache, n as DEFAULT_TIMEOUT_SECONDS, o as resolveCacheTtlMs, r as normalizeCacheKey, s as resolvePositiveTimeoutSeconds, t as DEFAULT_CACHE_TTL_MINUTES } from "../web-shared-7z6bteLg.mjs";
import { _ as resolveSiteName, a as buildUnsupportedSearchFilterResponse, b as withTrustedWebSearchEndpoint, c as normalizeToIsoDate, d as postTrustedWebToolsJson, f as readCachedSearchPayload, g as resolveSearchTimeoutSeconds, h as resolveSearchCount, i as buildSearchCacheKey, l as parseIsoDateRange, m as resolveSearchCacheTtlMs, n as FRESHNESS_TO_RECENCY, o as isoToPerplexityDate, p as readConfiguredSecretString, r as MAX_SEARCH_COUNT, s as normalizeFreshness, t as DEFAULT_SEARCH_COUNT, u as parseWebSearchTimeFilters, v as throwWebSearchApiError, x as writeCachedSearchPayload, y as withSelfHostedWebSearchEndpoint } from "../web-search-provider-common-DW0yysWb.mjs";
import { i as withTrustedWebToolsEndpoint, n as withSelfHostedWebToolsEndpoint, r as withStrictWebToolsEndpoint } from "../web-guarded-fetch-y_gz6Ulh.mjs";
import { a as setProviderWebSearchPluginConfigValue, i as resolveProviderWebSearchPluginConfig, n as getTopLevelCredentialValue, o as setScopedCredentialValue, r as mergeScopedSearchConfig, s as setTopLevelCredentialValue, t as getScopedCredentialValue } from "../web-search-provider-config-CW8dwkHd.mjs";
//#region src/agents/tools/web-search-citation-redirect.ts
/**
* Citation redirect resolver for web search results.
*
* Follows provider citation redirect URLs through the strict web-tools network guard.
*/
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
	try {
		return await withStrictWebToolsEndpoint({
			url,
			init: { method: "HEAD" },
			timeoutMs: REDIRECT_TIMEOUT_MS
		}, async ({ finalUrl }) => finalUrl || url);
	} catch {
		return url;
	}
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
/**
* Web-search provider credential resolver.
*
* Reads config values, env-backed secret refs, and provider-specific environment variables.
*/
/**
* Resolves web-search provider credentials from config values, secret refs, or
* provider-specific environment variables.
*/
/** Returns the first usable credential for a web-search provider. */
function resolveWebSearchProviderCredential(params) {
	const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
	if (credentialRef) {
		if (credentialRef.source !== "env") return;
		const fromEnvRef = normalizeSecretInput(process.env[credentialRef.id]);
		if (fromEnvRef) return fromEnvRef;
		return;
	}
	const fromConfigRaw = normalizeSecretInputString(params.credentialValue);
	const fromConfig = normalizeSecretInput(fromConfigRaw);
	if (fromConfig) return fromConfig;
	for (const envVar of params.envVars) {
		const fromEnv = normalizeSecretInput(process.env[envVar]);
		if (fromEnv) return fromEnv;
	}
}
//#endregion
export { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_SEARCH_COUNT, DEFAULT_TIMEOUT_SECONDS, FRESHNESS_TO_RECENCY, MAX_SEARCH_COUNT, buildSearchCacheKey, buildUnsupportedSearchFilterResponse, enablePluginInConfig, formatCliCommand, getScopedCredentialValue, getTopLevelCredentialValue, isoToPerplexityDate, jsonResult, markdownToText, mergeScopedSearchConfig, normalizeCacheKey, normalizeFreshness, normalizeToIsoDate, parseIsoDateRange, parseWebSearchTimeFilters, postTrustedWebToolsJson, readCache, readCachedSearchPayload, readConfiguredSecretString, readNonNegativeIntegerParam, readNumberParam, readPositiveIntegerParam, readProviderEnvValue, readResponseText, readStringArrayParam, readToolStringParam as readStringParam, resolveCacheTtlMs, resolveCitationRedirectUrl, resolvePositiveTimeoutSeconds, resolveProviderWebSearchPluginConfig, resolveSearchCacheTtlMs, resolveSearchCount, resolveSearchTimeoutSeconds, resolveSiteName, resolveTimeoutSeconds, resolveWebSearchProviderCredential, setProviderWebSearchPluginConfigValue, setScopedCredentialValue, setTopLevelCredentialValue, throwWebSearchApiError, truncateWebFetchText as truncateText, withSelfHostedWebSearchEndpoint, withSelfHostedWebToolsEndpoint, withTrustedWebSearchEndpoint, withTrustedWebToolsEndpoint, wrapWebContent, writeCache, writeCachedSearchPayload };
