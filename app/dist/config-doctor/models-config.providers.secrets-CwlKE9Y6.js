import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as appendConfigPathSegment } from "./dot-path-CTxqU0U7.js";
import { a as coerceSecretRef, j as secretRefKey } from "./types.secrets-K95Dlap_.js";
import { f as resolveConfigSecretRef } from "./resolution-facts-BNNyTRcj.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DcNWEaY3.js";
import { l as isOAuthRefreshFence } from "./credential-state-5qP-kY45.js";
import { H as resolveAwsSdkEnvVarName, U as resolveDirectProviderCredentialMode } from "./loader-runtime-load-B2ergWe-.js";
import { D as listProfilesForProvider, a as resolveAuthProfileOrder } from "./order-D7DJivFp.js";
import { a as isKnownEnvApiKeyMarker, d as resolveOAuthApiKeyMarker, h as resolveNonEnvSecretRefApiKeyMarker, l as resolveEnvSecretRefHeaderValueMarker, o as isNonSecretApiKeyMarker, p as resolveProviderEnvAuthLookupMaps, u as resolveNonEnvSecretRefHeaderValueMarker } from "./model-auth-markers-B_eyfwDG.js";
import { t as resolveEnvApiKey } from "./model-auth-env-CFqXWkvA.js";
import { k as resolveProviderSyntheticAuthWithPlugin } from "./provider-runtime-B3-FZB4p.js";
//#region src/agents/models-config.providers.secret-helpers.ts
/**
* Resolves configured provider secrets from env, profiles, and SecretRefs.
*/
const ENV_VAR_NAME_RE = /^[A-Z_][A-Z0-9_]*$/;
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
function normalizeApiKeyConfig(value) {
	const trimmed = value.trim();
	return /^\$\{([A-Z0-9_]+)\}$/.exec(trimmed)?.[1] ?? trimmed;
}
/** Returns a concrete key for discovery, omitting placeholder markers and blanks. */
function toDiscoveryApiKey(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
	return trimmed;
}
/** Resolves which environment variable supplies a provider API key. */
function resolveEnvApiKeyVarName(provider, env = process.env, options = {}) {
	const resolved = resolveEnvApiKey(provider, env, options);
	if (!resolved) return;
	const match = /^(?:env: |shell env: )([A-Z0-9_]+)$/.exec(resolved.source);
	return match ? match[1] : void 0;
}
/** Resolves the AWS SDK API key env var used by Bedrock-style auth. */
function resolveAwsSdkApiKeyVarName(env = process.env) {
	return resolveAwsSdkEnvVarName(env);
}
function resolveEnvAuthEvidenceApiKeyMarker(provider, env) {
	const apiKey = resolveEnvApiKey(provider, env)?.apiKey?.trim();
	if (!apiKey || !isNonSecretApiKeyMarker(apiKey, { includeEnvVarName: false })) return;
	return apiKey;
}
/** Rewrites secret-backed provider headers to stable marker values. */
function normalizeHeaderValues(params) {
	const { headers } = params;
	if (!headers) return {
		headers,
		mutated: false
	};
	const source = params.source;
	const sourceHeaders = source ? source.config.models?.providers?.[source.providerKey]?.headers : void 0;
	let mutated = false;
	const nextHeaders = {};
	for (const [headerName, headerValue] of Object.entries(headers)) {
		const sourceValue = sourceHeaders?.[headerName];
		const input = source && sourceValue !== void 0 ? {
			config: source.config,
			path: appendConfigPathSegment(`${appendConfigPathSegment("models.providers", source.providerKey)}.headers`, headerName),
			value: sourceValue,
			defaults: source.config.secrets?.defaults
		} : void 0;
		const resolvedRef = input ? resolveConfigSecretRef(input) : coerceSecretRef(headerValue, params.secretDefaults);
		if (!resolvedRef || !resolvedRef.id.trim()) {
			nextHeaders[headerName] = headerValue;
			continue;
		}
		mutated = true;
		nextHeaders[headerName] = resolvedRef.source === "env" ? resolveEnvSecretRefHeaderValueMarker(resolvedRef.id) : resolveNonEnvSecretRefHeaderValueMarker(resolvedRef.source);
	}
	if (!mutated) return {
		headers,
		mutated: false
	};
	return {
		headers: nextHeaders,
		mutated: true
	};
}
/** Resolves an auth profile credential into provider apiKey/discovery values. */
function resolveApiKeyFromCredential(cred, env = process.env) {
	if (!cred) return;
	if (cred.type === "api_key") {
		const keyRef = coerceSecretRef(cred.keyRef);
		if (keyRef && keyRef.id.trim()) {
			if (keyRef.source === "env") {
				const envVar = keyRef.id.trim();
				return {
					apiKey: envVar,
					source: "env-ref",
					discoveryApiKey: toDiscoveryApiKey(env[envVar])
				};
			}
			return {
				apiKey: resolveNonEnvSecretRefApiKeyMarker(keyRef.source),
				source: "non-env-ref"
			};
		}
		if (cred.key?.trim()) return {
			apiKey: cred.key,
			source: "plaintext",
			discoveryApiKey: toDiscoveryApiKey(cred.key)
		};
		return;
	}
	if (cred.type === "token") {
		const tokenRef = coerceSecretRef(cred.tokenRef);
		if (tokenRef && tokenRef.id.trim()) {
			if (tokenRef.source === "env") {
				const envVar = tokenRef.id.trim();
				return {
					apiKey: envVar,
					source: "env-ref",
					discoveryApiKey: toDiscoveryApiKey(env[envVar])
				};
			}
			return {
				apiKey: resolveNonEnvSecretRefApiKeyMarker(tokenRef.source),
				source: "non-env-ref"
			};
		}
		if (cred.token?.trim()) return {
			apiKey: cred.token,
			source: "plaintext",
			discoveryApiKey: toDiscoveryApiKey(cred.token)
		};
	}
}
/** Resolves the first usable API key from matching auth profiles. */
function resolveApiKeyFromProfiles(params) {
	const ids = params.profileIds ?? listProfilesForProvider(params.store, params.provider);
	for (const id of ids) {
		const credential = params.store.profiles[id];
		if (!credential) continue;
		const resolved = resolveApiKeyFromCredential(credential, params.env);
		if (resolved) return {
			...resolved,
			profileId: id,
			mode: credential.type
		};
	}
}
/** Normalizes configured provider apiKey values and records providers backed by secret refs. */
function normalizeConfiguredProviderApiKey(params) {
	const configuredApiKey = params.sourceInput?.value ?? params.provider.apiKey;
	const configuredApiKeyRef = params.sourceInput ? resolveConfigSecretRef(params.sourceInput) : coerceSecretRef(configuredApiKey, params.secretDefaults);
	if (configuredApiKeyRef && configuredApiKeyRef.id.trim()) {
		const marker = configuredApiKeyRef.source === "env" ? configuredApiKeyRef.id.trim() : resolveNonEnvSecretRefApiKeyMarker(configuredApiKeyRef.source);
		params.secretRefManagedProviders?.add(params.providerKey);
		if (params.provider.apiKey === marker) return params.provider;
		return {
			...params.provider,
			apiKey: marker
		};
	}
	if (typeof configuredApiKey !== "string") return params.provider;
	const normalizedConfiguredApiKey = configuredApiKey.trim();
	if (isNonSecretApiKeyMarker(normalizedConfiguredApiKey)) params.secretRefManagedProviders?.add(params.providerKey);
	if (params.profileApiKey && params.profileApiKey.source !== "plaintext" && normalizedConfiguredApiKey === params.profileApiKey.apiKey) params.secretRefManagedProviders?.add(params.providerKey);
	if (normalizedConfiguredApiKey === params.provider.apiKey) return params.provider;
	return {
		...params.provider,
		apiKey: normalizedConfiguredApiKey
	};
}
/** Rewrites literal env-derived keys back to env variable names when provenance is clear. */
function normalizeResolvedEnvApiKey(params) {
	const currentApiKey = params.provider.apiKey;
	if (typeof currentApiKey !== "string" || !currentApiKey.trim() || ENV_VAR_NAME_RE.test(currentApiKey.trim())) return params.provider;
	const envVarName = resolveEnvApiKeyVarName(params.providerKey, params.env);
	if (!envVarName || params.env[envVarName] !== currentApiKey) return params.provider;
	params.secretRefManagedProviders?.add(params.providerKey);
	return {
		...params.provider,
		apiKey: envVarName
	};
}
/** Fills missing provider apiKey values from env, auth profiles, or AWS SDK auth. */
function resolveMissingProviderApiKey(params) {
	const hasModels = Array.isArray(params.provider.models) && params.provider.models.length > 0;
	const normalizedApiKey = normalizeOptionalSecretInput(params.provider.apiKey);
	const hasConfiguredApiKey = Boolean(normalizedApiKey || params.provider.apiKey);
	if (!hasModels || hasConfiguredApiKey) return params.provider;
	const authMode = params.provider.auth;
	if (params.providerApiKeyResolver && (!authMode || authMode === "aws-sdk")) {
		const resolvedApiKey = params.providerApiKeyResolver(params.env);
		if (resolvedApiKey) return {
			...params.provider,
			apiKey: resolvedApiKey
		};
	}
	if (authMode === "aws-sdk") {
		const awsEnvVar = resolveAwsSdkApiKeyVarName(params.env);
		if (!awsEnvVar) return params.provider;
		return {
			...params.provider,
			apiKey: awsEnvVar
		};
	}
	const fromEnv = resolveEnvApiKeyVarName(params.providerKey, params.env);
	const fromAuthEvidence = fromEnv ? void 0 : resolveEnvAuthEvidenceApiKeyMarker(params.providerKey, params.env);
	const apiKey = fromEnv ?? fromAuthEvidence ?? params.profileApiKey?.apiKey;
	if (!apiKey?.trim()) return params.provider;
	if (fromAuthEvidence || params.profileApiKey && params.profileApiKey.source !== "plaintext") params.secretRefManagedProviders?.add(params.providerKey);
	return {
		...params.provider,
		apiKey
	};
}
//#endregion
//#region src/agents/models-config.providers.secrets.ts
/**
* Provider auth resolution entry points used during model config generation.
* The resolvers return env/profile/config marker values so discovery can prove
* auth availability without writing secret material into generated config.
*/
function resolveAuthProfileStoreInput(input) {
	return typeof input === "function" ? input() : input;
}
function resolveCatalogAuthProfileOrder(params) {
	return resolveAuthProfileOrder({
		cfg: params.config,
		provider: params.provider,
		store: params.store,
		authAliasLookupParams: {
			config: params.config,
			env: params.env
		},
		cooldownScope: "all-models",
		readinessMode: "read-only"
	});
}
function resolveCatalogDirectAuthMode(config, provider) {
	const mode = resolveDirectProviderCredentialMode({
		cfg: config,
		provider,
		inferredMode: "api-key"
	});
	return mode === "oauth" || mode === "token" ? mode : "api_key";
}
/** Create a resolver over the credential map already selected for one lifecycle generation. */
function createProviderApiKeyResolverFromPreparedCredentials(env, credentials, config, workspaceDir) {
	const resolveConfiguredOrEnvironment = createProviderApiKeyResolver(env, {
		version: 1,
		profiles: {}
	}, config, void 0, workspaceDir);
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider) => {
		const authProvider = resolveProviderIdForAuthFromCaches(provider, getLookupCaches());
		const credential = credentials[authProvider];
		if (!credential) return resolveConfiguredOrEnvironment(provider);
		if (credential.type === "oauth") {
			if (isOAuthRefreshFence(credential)) return resolveConfiguredOrEnvironment(provider);
			return {
				apiKey: resolveOAuthApiKeyMarker(authProvider),
				discoveryApiKey: toDiscoveryApiKey(credential.access),
				mode: "oauth"
			};
		}
		if (credential.type === "token") {
			if (!credential.token.trim() || credential.expires !== void 0 && Date.now() >= credential.expires) return resolveConfiguredOrEnvironment(provider);
			return {
				apiKey: credential.token,
				discoveryApiKey: toDiscoveryApiKey(credential.token),
				mode: "token"
			};
		}
		if (!credential.key.trim()) return resolveConfiguredOrEnvironment(provider);
		return {
			apiKey: credential.key,
			discoveryApiKey: toDiscoveryApiKey(credential.key),
			mode: "api_key"
		};
	};
}
function createProviderAuthLookupCaches(env, config) {
	let caches;
	return () => {
		if (!caches) {
			const lookupMaps = resolveProviderEnvAuthLookupMaps({
				config,
				env
			});
			caches = {
				aliasMap: lookupMaps.aliasMap,
				candidateMap: lookupMaps.envCandidateMap,
				authEvidenceMap: lookupMaps.authEvidenceMap
			};
		}
		return caches;
	};
}
function resolveProviderIdForAuthFromCaches(provider, caches) {
	const normalized = normalizeProviderId(provider);
	if (!normalized) return normalized;
	return caches.aliasMap[normalized] ?? normalized;
}
/** Create a resolver that returns redacted API-key markers for provider discovery. */
function createProviderApiKeyResolver(env, authStoreInput, config, sourceConfigForSecrets, workspaceDir, syntheticAuthEnv = env) {
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider) => {
		const lookupCaches = getLookupCaches();
		const authProvider = resolveProviderIdForAuthFromCaches(provider, lookupCaches);
		const envVar = resolveEnvApiKeyVarName(authProvider, env, {
			aliasMap: lookupCaches.aliasMap,
			candidateMap: lookupCaches.candidateMap,
			authEvidenceMap: lookupCaches.authEvidenceMap
		});
		if (envVar) return {
			apiKey: envVar,
			discoveryApiKey: toDiscoveryApiKey(env[envVar]),
			mode: resolveCatalogDirectAuthMode(config, authProvider)
		};
		const fromConfig = resolveConfigBackedProviderAuth({
			provider: authProvider,
			config,
			env,
			sourceConfigForSecrets,
			workspaceDir,
			syntheticAuthEnv
		});
		if (fromConfig?.apiKey) return {
			apiKey: fromConfig.apiKey,
			discoveryApiKey: fromConfig.discoveryApiKey,
			mode: fromConfig.mode
		};
		const authStore = resolveAuthProfileStoreInput(authStoreInput);
		const fromProfiles = resolveApiKeyFromProfiles({
			provider: authProvider,
			store: authStore,
			env,
			profileIds: resolveCatalogAuthProfileOrder({
				config,
				env,
				provider,
				store: authStore
			})
		});
		return fromProfiles?.apiKey ? {
			apiKey: fromProfiles.apiKey,
			discoveryApiKey: fromProfiles.discoveryApiKey,
			profileId: fromProfiles.profileId,
			mode: fromProfiles.mode
		} : {
			apiKey: void 0,
			discoveryApiKey: void 0
		};
	};
}
/** Create a resolver that reports provider auth mode and provenance. */
function createProviderAuthResolver(env, authStoreInput, config, sourceConfigForSecrets, workspaceDir, syntheticAuthEnv = env) {
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider, options) => {
		const lookupCaches = getLookupCaches();
		const authProvider = resolveProviderIdForAuthFromCaches(provider, lookupCaches);
		const authStore = resolveAuthProfileStoreInput(authStoreInput);
		const excludedProfileIds = new Set(options?.excludeProfileIds);
		const ids = resolveCatalogAuthProfileOrder({
			config,
			env,
			provider,
			store: authStore
		});
		for (const id of ids) {
			if (excludedProfileIds.has(id)) continue;
			const cred = authStore.profiles[id];
			if (!cred) continue;
			if (cred.type === "oauth") {
				if (isOAuthRefreshFence(cred)) continue;
				return {
					apiKey: options?.oauthMarker,
					discoveryApiKey: toDiscoveryApiKey(cred.access),
					mode: "oauth",
					source: "profile",
					profileId: id
				};
			}
			const resolved = resolveApiKeyFromCredential(cred, env);
			if (!resolved) continue;
			return {
				apiKey: resolved.apiKey,
				discoveryApiKey: resolved.discoveryApiKey,
				mode: cred.type,
				source: "profile",
				profileId: id
			};
		}
		const envVar = resolveEnvApiKeyVarName(authProvider, env, {
			aliasMap: lookupCaches.aliasMap,
			candidateMap: lookupCaches.candidateMap,
			authEvidenceMap: lookupCaches.authEvidenceMap
		});
		if (envVar) return {
			apiKey: envVar,
			discoveryApiKey: toDiscoveryApiKey(env[envVar]),
			mode: resolveCatalogDirectAuthMode(config, authProvider),
			source: "env"
		};
		const fromConfig = resolveConfigBackedProviderAuth({
			provider: authProvider,
			config,
			env,
			sourceConfigForSecrets,
			workspaceDir,
			syntheticAuthEnv
		});
		if (fromConfig) return {
			apiKey: fromConfig.apiKey,
			discoveryApiKey: fromConfig.discoveryApiKey,
			mode: fromConfig.mode,
			source: "none"
		};
		return {
			apiKey: void 0,
			discoveryApiKey: void 0,
			mode: "none",
			source: "none"
		};
	};
}
function resolveConfigBackedProviderAuth(params) {
	const authProvider = params.provider;
	const mode = resolveCatalogDirectAuthMode(params.config, authProvider);
	const apiKeyPath = `${appendConfigPathSegment("models.providers", authProvider)}.apiKey`;
	const sourceRef = resolveConfigSecretRef({
		config: params.sourceConfigForSecrets,
		path: apiKeyPath,
		value: params.sourceConfigForSecrets?.models?.providers?.[authProvider]?.apiKey,
		defaults: params.sourceConfigForSecrets?.secrets?.defaults
	});
	if (sourceRef && sourceRef.source !== "env") {
		const discoveryApiKey = params.config?.models?.providers?.[authProvider]?.apiKey;
		if (typeof discoveryApiKey !== "string" || !discoveryApiKey.trim()) throw new SecretSurfaceUnavailableError({
			ownerKind: "provider",
			ownerId: authProvider,
			state: "unavailable",
			paths: [apiKeyPath],
			refKeys: [secretRefKey(sourceRef)],
			reason: "secret reference was not materialized by the active runtime"
		});
		return {
			apiKey: resolveNonEnvSecretRefApiKeyMarker(sourceRef.source),
			discoveryApiKey,
			mode
		};
	}
	const apiKey = resolveProviderSyntheticAuthWithPlugin({
		provider: authProvider,
		config: params.config,
		env: params.syntheticAuthEnv ?? params.env,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.config,
			provider: authProvider,
			providerConfig: params.config?.models?.providers?.[authProvider]
		}
	})?.apiKey?.trim();
	if (apiKey) return {
		apiKey: isNonSecretApiKeyMarker(apiKey) ? apiKey : resolveNonEnvSecretRefApiKeyMarker("file"),
		discoveryApiKey: toDiscoveryApiKey(apiKey),
		mode
	};
	const configuredProviderApiKey = (params.config?.models?.providers?.[authProvider])?.apiKey;
	const configuredApiKeyRef = resolveConfigSecretRef({
		config: params.config,
		path: apiKeyPath,
		value: configuredProviderApiKey,
		defaults: params.config?.secrets?.defaults
	});
	if (configuredApiKeyRef) {
		if (configuredApiKeyRef.source === "env") {
			const envVar = configuredApiKeyRef.id.trim();
			const envValue = params.env?.[envVar]?.trim();
			return envValue ? {
				apiKey: envVar,
				discoveryApiKey: toDiscoveryApiKey(envValue),
				mode
			} : void 0;
		}
		return {
			apiKey: resolveNonEnvSecretRefApiKeyMarker(configuredApiKeyRef.source),
			mode
		};
	}
	if (typeof configuredProviderApiKey !== "string") return;
	const configuredApiKey = configuredProviderApiKey.trim();
	if (!configuredApiKey) return;
	if (isKnownEnvApiKeyMarker(configuredApiKey)) {
		const envValue = params.env?.[configuredApiKey]?.trim();
		if (envValue) return {
			apiKey: configuredApiKey,
			discoveryApiKey: toDiscoveryApiKey(envValue),
			mode
		};
		return;
	}
	return {
		apiKey: configuredApiKey,
		discoveryApiKey: toDiscoveryApiKey(configuredApiKey),
		mode
	};
}
//#endregion
export { normalizeConfiguredProviderApiKey as a, resolveApiKeyFromProfiles as c, normalizeApiKeyConfig as i, resolveMissingProviderApiKey as l, createProviderApiKeyResolverFromPreparedCredentials as n, normalizeHeaderValues as o, createProviderAuthResolver as r, normalizeResolvedEnvApiKey as s, createProviderApiKeyResolver as t };
