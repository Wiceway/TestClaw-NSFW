import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import "./boundary-path-BBHaqzpY.js";
import "./agent-scope-config-BEuqweC1.js";
import "./paths-DeOFr7iP.js";
import { D as isValidSecretRef, a as coerceSecretRef, d as parseEnvTemplateSecretRef, h as DEFAULT_SECRET_PROVIDER_ALIAS } from "./types.secrets-K95Dlap_.js";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-Dzv8ad-5.js";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-B8YMBgKQ.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./repair-BgK-Q2lS.js";
import "node:fs";
import "node:path";
//#region src/plugins/provider-auth-helpers.ts
function buildEnvSecretRef(id) {
	return {
		source: "env",
		provider: DEFAULT_SECRET_PROVIDER_ALIAS,
		id
	};
}
function resolveProviderDefaultEnvSecretRef(provider, config) {
	const envVar = getProviderEnvVarsCore(provider, {
		...config ? { config } : {},
		includeUntrustedWorkspacePlugins: false
	})?.find((candidate) => candidate.trim().length > 0);
	if (!envVar) throw new Error(`Provider "${provider}" does not have a default env var mapping for secret-input-mode=ref.`);
	return buildEnvSecretRef(envVar);
}
function resolveApiKeySecretInput(provider, input, options) {
	if (input !== null && typeof input === "object") {
		const coercedRef = coerceSecretRef(input);
		if (!coercedRef || !isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	if (options?.secretInputMode === "plaintext") return normalizeSecretInput(input);
	const coercedRef = coerceSecretRef(input);
	if (coercedRef) {
		if (!isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	const normalized = normalizeSecretInput(input);
	const inlineEnvRef = parseEnvTemplateSecretRef(normalized, DEFAULT_SECRET_PROVIDER_ALIAS);
	if (inlineEnvRef) return inlineEnvRef;
	if (options?.secretInputMode === "ref") return resolveProviderDefaultEnvSecretRef(provider, options.config);
	return normalized;
}
function buildApiKeyCredential(provider, input, metadata, options) {
	const secretInput = resolveApiKeySecretInput(provider, input, options);
	if (typeof secretInput === "string") return {
		type: "api_key",
		provider,
		key: secretInput,
		...metadata ? { metadata } : {}
	};
	return {
		type: "api_key",
		provider,
		keyRef: secretInput,
		...metadata ? { metadata } : {}
	};
}
function applyAuthProfileConfig(cfg, params) {
	const profiles = {
		...cfg.auth?.profiles,
		[params.profileId]: {
			provider: params.provider,
			mode: params.mode,
			...params.email ? { email: params.email } : {},
			...params.displayName ? { displayName: params.displayName } : {}
		}
	};
	const next = {
		...cfg,
		auth: {
			...cfg.auth,
			profiles
		}
	};
	const configuredProfiles = Object.entries(cfg.auth?.profiles ?? {});
	const orderEntries = Object.entries(cfg.auth?.order ?? {});
	const preferProfileFirst = params.preferProfileFirst ?? true;
	if (orderEntries.length === 0 && (!preferProfileFirst || !configuredProfiles.some(([profileId, profile]) => profileId !== params.profileId && profile.mode !== params.mode))) return next;
	const normalizedProvider = resolveProviderIdForAuth(params.provider, {
		config: cfg,
		storedCredential: true
	});
	const matchesProvider = (provider, storedCredential = false) => resolveProviderIdForAuth(provider, {
		config: cfg,
		storedCredential
	}) === normalizedProvider;
	const matchingOrderEntries = orderEntries.filter(([provider]) => matchesProvider(provider));
	let providerOrder;
	if (matchingOrderEntries.length > 0) {
		const existingOrder = uniqueStrings(matchingOrderEntries.flatMap(([, order]) => order));
		providerOrder = preferProfileFirst ? [params.profileId, ...existingOrder.filter((profileId) => profileId !== params.profileId)] : existingOrder.includes(params.profileId) ? existingOrder : [...existingOrder, params.profileId];
	} else if (preferProfileFirst) {
		const peers = configuredProfiles.filter(([, profile]) => matchesProvider(profile.provider, true));
		if (peers.some(([profileId, profile]) => profileId !== params.profileId && profile.mode !== params.mode)) providerOrder = [params.profileId, ...peers.map(([profileId]) => profileId).filter((profileId) => profileId !== params.profileId)];
	}
	if (providerOrder) next.auth.order = {
		...Object.fromEntries(orderEntries.filter(([provider]) => !matchesProvider(provider))),
		[normalizedProvider]: providerOrder
	};
	return next;
}
/** Returns true when config still names a removed auth profile. */
function configReferencesAuthProfile(cfg, profileId) {
	return Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((order) => order.includes(profileId)) || Object.values(cfg.models?.providers ?? {}).some((provider) => provider.apiKey === profileId);
}
/**
* Drops a profile from `auth.profiles`, every `auth.order` list, and provider-entry
* `apiKey` references. An emptied provider order is deleted rather than left as
* `[]`, because an authored empty order is a hard "select no profiles" instruction.
*/
function removeAuthProfileConfig(cfg, profileId) {
	if (!configReferencesAuthProfile(cfg, profileId)) return cfg;
	const authReferencesProfile = Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((providerOrder) => providerOrder.includes(profileId));
	const profiles = Object.fromEntries(Object.entries(cfg.auth?.profiles ?? {}).filter(([id]) => id !== profileId));
	const order = Object.entries(cfg.auth?.order ?? {}).reduce((acc, [providerId, providerOrder]) => {
		const next = providerOrder.filter((id) => id !== profileId);
		if (next.length > 0 || next.length === providerOrder.length) acc[providerId] = next;
		return acc;
	}, {});
	const { order: _droppedOrder, ...auth } = cfg.auth ?? {};
	const providers = Object.fromEntries(Object.entries(cfg.models?.providers ?? {}).map(([providerId, provider]) => {
		if (provider.apiKey !== profileId) return [providerId, provider];
		const { apiKey: _droppedApiKey, ...nextProvider } = provider;
		return [providerId, nextProvider];
	}));
	return {
		...cfg,
		...authReferencesProfile ? { auth: {
			...auth,
			profiles,
			...Object.keys(order).length > 0 ? { order } : {}
		} } : {},
		...cfg.models?.providers ? { models: {
			...cfg.models,
			providers
		} } : {}
	};
}
//#endregion
export { removeAuthProfileConfig as i, buildApiKeyCredential as n, configReferencesAuthProfile as r, applyAuthProfileConfig as t };
