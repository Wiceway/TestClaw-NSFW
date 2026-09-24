import { a as asDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-Dzv8ad-5.js";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility, u as isPendingOAuthRefreshFence } from "./credential-state-5qP-kY45.js";
import { c as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-LZfHFeGe.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/profile-list.ts
/**
* Auth profile list helpers.
* Provides provider-compatible profile lookup and stable de-duplication used by
* ordering, repair, and profile mutation paths.
*/
/** Deduplicates profile ids while preserving first-seen order. */
function dedupeProfileIds(profileIds) {
	return uniqueStrings(profileIds);
}
/** Lists auth profile ids whose credential provider matches the requested provider. */
function listProfilesForProvider(store, provider) {
	const providerKey = resolveProviderIdForAuth(provider);
	return Object.entries(store.profiles).filter(([, cred]) => resolveProviderIdForAuth(cred.provider) === providerKey).map(([id]) => id);
}
function resolveSubscriptionAuthModeForProfiles(params) {
	for (const profileId of params.profileIds) {
		const type = profileId ? params.store.profiles[profileId]?.type : void 0;
		if (type === "oauth" || type === "token") return type;
	}
}
//#endregion
//#region src/agents/auth-profiles/setup-access.ts
const setupCredentialAccess = new AsyncLocalStorage();
/** Detached runtime work must not inherit a writer's temporary credential access. */
function runOutsideSetupCredentialAccess(run) {
	return setupCredentialAccess.exit(run);
}
function isSetupCredentialAccessible(params) {
	if (!params.credential.setup?.replacement) return true;
	const access = setupCredentialAccess.getStore();
	return Boolean(access?.isActive() && access.profileId === params.profileId && (params.agentDir === void 0 || access.agentDir === params.agentDir));
}
/** Reads only the exact, still-owned SecretRef materialization for the current setup operation. */
function getSetupCredentialRuntimeProfile(params) {
	const access = setupCredentialAccess.getStore();
	const runtime = access?.runtimeCredential;
	if (!access || !runtime || access.profileId !== params.profileId || access.agentDir !== params.agentDir) return;
	if (!access.isActive() || runtime.credentialsRevision !== getRuntimeAuthProfileStoreCredentialsRevision() || !isDeepStrictEqual(runtime.source, params.profile)) return null;
	return structuredClone(runtime.materialized);
}
/** Allows the selected replacement only while its setup operation remains active. */
async function withSetupCredentialAccess(params, run) {
	const parent = setupCredentialAccess.getStore();
	let active = true;
	return await setupCredentialAccess.run({
		profileId: params.profileId,
		agentDir: params.agentDir,
		runtimeCredential: params.runtimeCredential ? structuredClone(params.runtimeCredential) : parent?.profileId === params.profileId && parent.agentDir === params.agentDir ? parent.runtimeCredential : void 0,
		isActive: () => active && !params.signal?.aborted && (!parent || parent.isActive())
	}, async () => {
		try {
			return await run();
		} finally {
			active = false;
		}
	});
}
//#endregion
//#region src/agents/auth-profiles/usage-state.ts
/**
* Pure cooldown and unusable-window helpers for auth profile usage state.
* Mutation and persistence live in usage.ts; this module owns reusable state
* predicates used by rotation and failure handling.
*/
const FAILURE_REASON_PRIORITY = [
	"auth_permanent",
	"auth",
	"session_expired",
	"billing",
	"format",
	"model_not_found",
	"overloaded",
	"timeout",
	"rate_limit",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
];
const FAILURE_REASON_SET = new Set(FAILURE_REASON_PRIORITY);
function isAuthProfileFailureReason(reason) {
	return FAILURE_REASON_SET.has(reason);
}
/** Clears failure windows while preserving unrelated usage history. */
function resetAuthProfileFailureState(existing, overrides) {
	return {
		...existing,
		errorCount: 0,
		blockedUntil: void 0,
		blockedReason: void 0,
		blockedSource: void 0,
		blockedModel: void 0,
		blockedScope: void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0,
		disabledUntil: void 0,
		disabledReason: void 0,
		failureCounts: void 0,
		...overrides
	};
}
/** Returns true for providers whose auth-profile cooldowns are provider-managed. */
function isAuthCooldownBypassedForProvider(provider) {
	const normalized = normalizeProviderId(provider ?? "");
	return normalized === "openrouter" || normalized === "kilocode";
}
function resolveInlineProviderApiKeyUsageId(provider) {
	return `inline-api-key:${normalizeProviderId(provider)}`;
}
/** Reads inline-key health using the same identity and bypass policy as its writer. */
function readInlineProviderApiKeyUsage(store, provider) {
	const stats = isAuthCooldownBypassedForProvider(provider) ? void 0 : store.usageStats?.[resolveInlineProviderApiKeyUsageId(provider)];
	return {
		stats,
		unusableUntil: stats ? resolveProfileUnusableUntil(stats) : null
	};
}
/** Returns true when a failure should only cool down the failing model. */
function isModelScopedCooldownReason(reason) {
	return reason === "rate_limit" || reason === "timeout" || reason === "model_not_found";
}
/** Resolves the latest active blocked/cooldown/disabled timestamp for a profile. */
function resolveProfileUnusableUntil(stats, forModel) {
	const values = [
		isBlockScopedToDifferentModel(stats, forModel) ? void 0 : stats.blockedUntil,
		forModel === null && isModelScopedCooldownReason(stats.cooldownReason) && stats.cooldownModel ? void 0 : stats.cooldownUntil,
		stats.disabledUntil
	].map((value) => asDateTimestampMs(value)).filter((value) => value !== void 0 && value > 0);
	return values.length > 0 ? Math.max(...values) : null;
}
/** Returns true when an unusable timestamp is active at the supplied clock time. */
function isActiveUnusableWindow(until, now) {
	const timestamp = asDateTimestampMs(until);
	return timestamp !== void 0 && timestamp > 0 && now < timestamp;
}
function isBlockedWindowActiveForModel(stats, now, forModel) {
	return !isBlockScopedToDifferentModel(stats, forModel) && isActiveUnusableWindow(stats.blockedUntil, now);
}
function isBlockScopedToDifferentModel(stats, forModel) {
	return Boolean((forModel === null || forModel) && stats.blockedScope === "model" && stats.blockedModel && (forModel === null || stats.blockedModel !== forModel));
}
function isCooldownScopedToDifferentModel(stats, forModel) {
	return Boolean((forModel === null || forModel) && isModelScopedCooldownReason(stats.cooldownReason) && stats.cooldownModel && (forModel === null || stats.cooldownModel !== forModel));
}
function shouldBypassModelScopedCooldown(stats, now, forModel) {
	return isCooldownScopedToDifferentModel(stats, forModel) && !isBlockedWindowActiveForModel(stats, now, forModel) && !isActiveUnusableWindow(stats.disabledUntil, now);
}
/**
* Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
*/
function isProfileInCooldown(store, profileId, now, forModel) {
	if (isAuthCooldownBypassedForProvider(store.profiles[profileId]?.provider)) return false;
	const stats = store.usageStats?.[profileId];
	if (!stats) return false;
	const ts = now ?? Date.now();
	if (shouldBypassModelScopedCooldown(stats, ts, forModel)) return false;
	const unusableUntil = resolveProfileUnusableUntil(stats, forModel);
	return unusableUntil ? ts < unusableUntil : false;
}
/**
* Return the soonest `unusableUntil` timestamp (ms epoch) among the given
* profiles, or `null` when no profile has a recorded cooldown. Note: the
* returned timestamp may be in the past if the cooldown has already expired.
*/
function getSoonestCooldownExpiry(store, profileIds, options) {
	const ts = options?.now ?? Date.now();
	let soonest = null;
	let latestMatchingModelCooldown = null;
	for (const id of profileIds) {
		const stats = store.usageStats?.[id];
		if (!stats) continue;
		if (shouldBypassModelScopedCooldown(stats, ts, options?.forModel)) continue;
		const until = resolveProfileUnusableUntil(stats, options?.forModel);
		if (typeof until !== "number" || !Number.isFinite(until) || until <= 0) continue;
		if (options?.forModel && stats.cooldownReason === "rate_limit" && stats.cooldownModel === options.forModel && !isBlockedWindowActiveForModel(stats, ts, options.forModel) && !isActiveUnusableWindow(stats.disabledUntil, ts)) {
			latestMatchingModelCooldown = latestMatchingModelCooldown === null ? until : Math.max(latestMatchingModelCooldown, until);
			continue;
		}
		if (soonest === null || until < soonest) soonest = until;
	}
	if (soonest === null) return latestMatchingModelCooldown;
	if (latestMatchingModelCooldown === null) return soonest;
	return Math.min(soonest, latestMatchingModelCooldown);
}
/**
* Clear expired cooldowns from all profiles in the store.
*
* When `cooldownUntil` or `disabledUntil` has passed, the corresponding fields
* are removed. Most error counters reset so the profile gets a fresh start
* (circuit-breaker half-open -> closed). Rate-limit counters instead persist
* across failed half-open probes so missing provider reset times use capped
* exponential backoff; a successful request or manual clear resets them.
*
* `cooldownUntil` and `disabledUntil` are handled independently: if a profile
* has both and only one has expired, only that field is cleared.
*
* Mutates the in-memory store; disk persistence happens lazily on the next
* store write (e.g. `markAuthProfileSuccess` / `markAuthProfileFailure`), which
* matches the existing save pattern throughout the auth-profiles module.
*
* @returns `true` if any profile was modified.
*/
function clearExpiredCooldowns(store, now) {
	const usageStats = store.usageStats;
	if (!usageStats) return false;
	const ts = now ?? Date.now();
	let mutated = false;
	for (const [profileId, stats] of Object.entries(usageStats)) {
		if (!stats) continue;
		let profileMutated = false;
		const cooldownExpired = typeof stats.cooldownUntil === "number" && Number.isFinite(stats.cooldownUntil) && stats.cooldownUntil > 0 && ts >= stats.cooldownUntil;
		const blockedExpired = typeof stats.blockedUntil === "number" && Number.isFinite(stats.blockedUntil) && stats.blockedUntil > 0 && ts >= stats.blockedUntil;
		const disabledExpired = typeof stats.disabledUntil === "number" && Number.isFinite(stats.disabledUntil) && stats.disabledUntil > 0 && ts >= stats.disabledUntil;
		if (cooldownExpired) {
			stats.cooldownUntil = void 0;
			stats.cooldownReason = void 0;
			stats.cooldownClassification = void 0;
			stats.cooldownModel = void 0;
			profileMutated = true;
		}
		if (blockedExpired) {
			stats.blockedUntil = void 0;
			stats.blockedReason = void 0;
			stats.blockedSource = void 0;
			stats.blockedModel = void 0;
			stats.blockedScope = void 0;
			profileMutated = true;
		}
		if (disabledExpired) {
			stats.disabledUntil = void 0;
			stats.disabledReason = void 0;
			profileMutated = true;
		}
		if (profileMutated && !resolveProfileUnusableUntil(stats)) {
			stats.errorCount = 0;
			const rateLimitFailureCount = stats.failureCounts?.rate_limit;
			stats.failureCounts = rateLimitFailureCount ? { rate_limit: rateLimitFailureCount } : void 0;
		}
		if (profileMutated) {
			usageStats[profileId] = stats;
			mutated = true;
		}
	}
	return mutated;
}
/**
* Infer the most likely reason all candidate profiles are currently unavailable.
*
* We prefer explicit active `disabledReason` values (for example billing/auth)
* over generic cooldown buckets, then fall back to failure-count signals.
*/
function resolveProfilesUnavailableReason(params) {
	const now = params.now ?? Date.now();
	const scores = /* @__PURE__ */ new Map();
	const addScore = (reason, value) => {
		if (!FAILURE_REASON_SET.has(reason) || value <= 0 || !Number.isFinite(value)) return;
		scores.set(reason, (scores.get(reason) ?? 0) + value);
	};
	for (const profileId of params.profileIds) {
		const stats = params.store.usageStats?.[profileId];
		if (!stats) continue;
		if (isActiveUnusableWindow(stats.disabledUntil, now) && stats.disabledReason && FAILURE_REASON_SET.has(stats.disabledReason)) {
			addScore(stats.disabledReason, 1e3);
			continue;
		}
		if (isActiveUnusableWindow(stats.blockedUntil, now)) {
			addScore("rate_limit", 1e3);
			continue;
		}
		if (!isActiveUnusableWindow(stats.cooldownUntil, now)) continue;
		if (stats.cooldownReason && FAILURE_REASON_SET.has(stats.cooldownReason)) {
			addScore(stats.cooldownReason, 1e3);
			continue;
		}
		let recordedReason = false;
		for (const [reason, rawCount] of Object.entries(stats.failureCounts ?? {})) {
			const count = typeof rawCount === "number" ? rawCount : 0;
			if (!isAuthProfileFailureReason(reason) || count <= 0) continue;
			addScore(reason, count);
			recordedReason = true;
		}
		if (!recordedReason) addScore("unknown", 1);
	}
	let best = null;
	let bestScore = -1;
	for (const reason of FAILURE_REASON_PRIORITY) {
		const score = scores.get(reason);
		if (score !== void 0 && score > bestScore) {
			best = reason;
			bestScore = score;
		}
	}
	return best;
}
/** Resolves the display-facing unusable timestamp, honoring provider bypasses. */
function resolveProfileUnusableUntilForDisplay(store, profileId) {
	if (isAuthCooldownBypassedForProvider(store.profiles[profileId]?.provider)) return null;
	const stats = store.usageStats?.[profileId];
	if (!stats) return null;
	return resolveProfileUnusableUntil(stats);
}
//#endregion
//#region src/agents/auth-profiles/order.ts
/**
* Auth profile ordering and eligibility.
* Resolves configured/stored auth order, provider aliases, cooldowns, and
* profile compatibility for provider auth selection.
*/
function isAuthProfileRuntimeSettlementCandidate(params) {
	return params.eligibility.eligible || params.includePendingOAuthRefresh === true && params.eligibility.reasonCode === "expired" && params.credential?.type === "oauth" && isPendingOAuthRefreshFence(params.credential);
}
function isProfileProviderCompatibleWithAuthProvider(params) {
	return resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams,
		storedCredential: true
	}) === params.providerAuthKey;
}
/** Returns true when a stored credential can authenticate the requested provider. */
function isStoredCredentialCompatibleWithAuthProvider(params) {
	return isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: resolveProviderIdForAuth(params.provider, {
			config: params.cfg,
			...params.authAliasLookupParams
		}),
		provider: params.credential.provider
	});
}
function listProfilesCompatibleWithAuthProvider(params) {
	return Object.entries(params.store.profiles).filter(([, credential]) => isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: params.providerAuthKey,
		provider: credential.provider
	})).map(([profileId]) => profileId);
}
function resolveProviderAuthMode(cfg, provider) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	const auth = findNormalizedProviderValue(providers, provider)?.auth;
	return typeof auth === "string" ? auth : void 0;
}
function providerAllowsAwsSdkAuth(cfg, provider) {
	return resolveProviderAuthMode(cfg, provider) === "aws-sdk";
}
/** Returns true when config declares an aws-sdk auth profile for a provider. */
function isConfiguredAwsSdkAuthProfileForProvider(params) {
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (!profileConfig || profileConfig.mode !== "aws-sdk") return false;
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	if (resolveProviderIdForAuth(profileConfig.provider, {
		config: params.cfg,
		...params.authAliasLookupParams,
		storedCredential: true
	}) !== providerAuthKey) return false;
	return providerAllowsAwsSdkAuth(params.cfg, providerAuthKey);
}
/** Resolves whether a profile can be used for a provider right now. */
function resolveAuthProfileEligibility(params) {
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	const cred = params.store.profiles[params.profileId];
	if (!cred) {
		if (isConfiguredAwsSdkAuthProfileForProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			provider: params.provider,
			profileId: params.profileId
		})) return {
			eligible: true,
			reasonCode: "ok"
		};
		return {
			eligible: false,
			reasonCode: "profile_missing"
		};
	}
	if (!isSetupCredentialAccessible({
		profileId: params.profileId,
		credential: cred
	})) return {
		eligible: false,
		reasonCode: "setup_inactive"
	};
	if (!isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		provider: cred.provider
	})) return {
		eligible: false,
		reasonCode: "provider_mismatch"
	};
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (profileConfig) {
		if (!isProfileProviderCompatibleWithAuthProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			providerAuthKey,
			provider: profileConfig.provider
		})) return {
			eligible: false,
			reasonCode: "provider_mismatch"
		};
		if (profileConfig.mode !== cred.type) {
			if (!(profileConfig.mode === "oauth" && cred.type === "token")) return {
				eligible: false,
				reasonCode: "mode_mismatch"
			};
		}
	}
	const credentialEligibility = evaluateStoredCredentialEligibility({
		credential: cred,
		now: params.now
	});
	if (isAuthProfileRuntimeSettlementCandidate({
		credential: cred,
		eligibility: credentialEligibility,
		includePendingOAuthRefresh: params.includePendingOAuthRefresh
	})) return {
		eligible: true,
		reasonCode: "ok"
	};
	return {
		eligible: false,
		reasonCode: credentialEligibility.reasonCode
	};
}
/** Session pins lead the shared order without discarding its failover candidates. */
function prependAuthProfilePin(resolution, profileId) {
	return profileId ? {
		...resolution,
		profileIds: [profileId, ...resolution.profileIds.filter((id) => id !== profileId)]
	} : resolution;
}
/** Shares stored-over-config order precedence with CLI runtime selection. */
function resolveExplicitAuthOrderSelection(params) {
	const { storeOrder, configuredOrder, providerKey, providerAuthKey } = params;
	const stored = findNormalizedProviderValue(storeOrder, providerAuthKey) ?? findNormalizedProviderValue(storeOrder, providerKey);
	return {
		order: stored ?? findNormalizedProviderValue(configuredOrder, providerAuthKey) ?? findNormalizedProviderValue(configuredOrder, providerKey),
		fromStore: stored !== void 0
	};
}
/** Resolves ordered usable auth profiles plus whether an explicit order owns selection. */
function resolveAuthProfileOrderWithMetadata(params) {
	const { cfg, store, provider, preferredProfile, forModel } = params;
	const providerKey = normalizeProviderId(provider);
	const providerAuthKey = resolveProviderIdForAuth(provider, {
		config: cfg,
		...params.authAliasLookupParams
	});
	const now = Date.now();
	clearExpiredCooldowns(store, now);
	const { order: explicitOrder, fromStore: explicitOrderFromStore } = resolveExplicitAuthOrderSelection({
		storeOrder: store.order,
		configuredOrder: cfg?.auth?.order,
		providerKey,
		providerAuthKey
	});
	const explicitProfiles = cfg?.auth?.profiles ? Object.entries(cfg.auth.profiles).filter(([, profile]) => isProfileProviderCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		provider: profile.provider
	})).map(([profileId]) => profileId) : [];
	const storeProfiles = listProfilesCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		store,
		providerAuthKey
	});
	const baseOrder = explicitOrder ?? (explicitProfiles.length > 0 ? explicitProfiles : storeProfiles);
	if (baseOrder.length === 0) return {
		profileIds: [],
		hasExplicitOrder: explicitOrder !== void 0
	};
	const isValidProfile = (profileId) => {
		const eligibility = resolveAuthProfileEligibility({
			cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			store,
			provider,
			profileId,
			now,
			includePendingOAuthRefresh: params.includePendingOAuthRefresh
		});
		return eligibility.eligible || params.readinessMode === "read-only" && eligibility.reasonCode === "unresolved_ref";
	};
	let filtered = baseOrder.filter(isValidProfile);
	let repairedFallbackToStoreProfiles = false;
	const allBaseProfilesMissing = baseOrder.every((profileId) => !store.profiles[profileId]);
	if (filtered.length === 0 && allBaseProfilesMissing && (explicitOrderFromStore || explicitProfiles.length > 0)) {
		filtered = storeProfiles.filter(isValidProfile);
		repairedFallbackToStoreProfiles = true;
	}
	const deduped = dedupeProfileIds(filtered);
	const cooldownModel = params.cooldownScope === "all-models" ? null : forModel;
	const isInCooldown = (profileId) => isProfileInCooldown(store, profileId, now, cooldownModel);
	const unusableUntil = (profileId) => resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}, cooldownModel);
	if (explicitOrder && explicitOrder.length > 0 && !repairedFallbackToStoreProfiles) {
		const available = [];
		const inCooldown = [];
		for (const profileId of deduped) if (isInCooldown(profileId)) inCooldown.push({
			profileId,
			cooldownUntil: unusableUntil(profileId) ?? now
		});
		else available.push(profileId);
		const cooldownSorted = inCooldown.toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
		const ordered = [...available, ...cooldownSorted];
		if (preferredProfile && ordered.includes(preferredProfile)) return {
			profileIds: [preferredProfile, ...ordered.filter((e) => e !== preferredProfile)],
			hasExplicitOrder: true
		};
		return {
			profileIds: ordered,
			hasExplicitOrder: true
		};
	}
	const sorted = orderProfilesByMode(deduped, store, now, isInCooldown, unusableUntil);
	if (preferredProfile && sorted.includes(preferredProfile)) return {
		profileIds: [preferredProfile, ...sorted.filter((e) => e !== preferredProfile)],
		hasExplicitOrder: explicitOrder !== void 0
	};
	return {
		profileIds: sorted,
		hasExplicitOrder: explicitOrder !== void 0
	};
}
/** Resolves ordered usable auth profile ids for a provider. */
function resolveAuthProfileOrder(params) {
	return resolveAuthProfileOrderWithMetadata(params).profileIds;
}
function orderProfilesByMode(order, store, now, isInCooldown, unusableUntil) {
	const available = [];
	const inCooldown = [];
	for (const profileId of order) if (isInCooldown(profileId)) inCooldown.push(profileId);
	else available.push(profileId);
	const sorted = available.map((profileId) => {
		const profile = store.profiles[profileId];
		const type = profile?.type;
		return {
			profileId,
			typeScore: type === "oauth" ? 0 : type === "token" ? 1 : type === "api_key" ? 2 : 3,
			expiryScore: profile?.type === "oauth" && resolveTokenExpiryState(profile.expires, now) === "expired" ? 1 : 0,
			lastUsed: store.usageStats?.[profileId]?.lastUsed ?? 0
		};
	}).toSorted((a, b) => {
		if (a.typeScore !== b.typeScore) return a.typeScore - b.typeScore;
		if (a.expiryScore !== b.expiryScore) return a.expiryScore - b.expiryScore;
		return a.lastUsed - b.lastUsed;
	}).map((entry) => entry.profileId);
	const cooldownSorted = inCooldown.map((profileId) => ({
		profileId,
		cooldownUntil: unusableUntil(profileId) ?? now
	})).toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
	return [...sorted, ...cooldownSorted];
}
//#endregion
export { isSetupCredentialAccessible as C, listProfilesForProvider as D, dedupeProfileIds as E, resolveSubscriptionAuthModeForProfiles as O, getSetupCredentialRuntimeProfile as S, withSetupCredentialAccess as T, resetAuthProfileFailureState as _, resolveAuthProfileOrder as a, resolveProfileUnusableUntilForDisplay as b, clearExpiredCooldowns as c, isAuthCooldownBypassedForProvider as d, isBlockedWindowActiveForModel as f, readInlineProviderApiKeyUsage as g, isProfileInCooldown as h, resolveAuthProfileEligibility as i, getSoonestCooldownExpiry as l, isModelScopedCooldownReason as m, isStoredCredentialCompatibleWithAuthProvider as n, resolveAuthProfileOrderWithMetadata as o, isCooldownScopedToDifferentModel as p, prependAuthProfilePin as r, resolveExplicitAuthOrderSelection as s, isConfiguredAwsSdkAuthProfileForProvider as t, isActiveUnusableWindow as u, resolveInlineProviderApiKeyUsageId as v, runOutsideSetupCredentialAccess as w, resolveProfilesUnavailableReason as x, resolveProfileUnusableUntil as y };
