import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.js";
import { x as parseStrictNonNegativeInteger } from "./number-coercion-0M4tZV2c.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as emitFailoverEvent } from "./diagnostic-events-CzmzgdMI.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { i as isSilentReplyPayloadText } from "./tokens-BbfKzfAT.js";
import "./model-ref-shared-_U0IEbGF.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-YvCZW05m.js";
import { a as isFailoverError, t as FailoverError } from "./error-D_GewJgV.js";
import "./user-copy-CP-Iqg-t.js";
import { a as isMissingAgentHarnessError, i as isAgentHarnessPreflightError, s as resolveAgentHarnessPreflightOwner } from "./errors-Bd6GQRkh.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-D_hR_7b5.js";
import "./model-selection-resolve-CGvmVFuO.js";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-CCpduAoE.js";
import { O as resolveSubscriptionAuthModeForProfiles, u as isActiveUnusableWindow } from "./order-D7DJivFp.js";
import { a as isLikelyContextOverflowError, t as classifyFailoverReason } from "./classify-g_cTi4L9.js";
import { c as hasProviderRequestSizeCeiling, d as isNonProviderRuntimeCoordinationError, i as describeFailoverError, n as buildProviderReauthCommand, r as coerceToFailoverError } from "./failover-error-D845uGox.js";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-2WxNRofN.js";
import { a as hasVisibleAgentPayload } from "./message-visibility-C6u1cGtH.js";
import { l as hasCommittedOutboundDeliveryEvidence } from "./delivery-evidence-CDgoalBx.js";
import { a as recordFailedCandidateAttempt, c as resolveLiveSessionModelSwitchRedirectIndex, d as resolveNextFallbackCandidateIndex, f as runFallbackAttempt, g as logModelFallbackDecision, h as isModelFallbackDecisionLogEnabled, i as isTranscriptNotContinuableError, l as resolveModelFallbackCandidateAgentRuntime, m as throwFallbackFailureSummary, n as hasDifferentLiveSessionRuntimeSelection, o as resolveFallbackAuthScope, p as shouldDiscardDeferredSessionSuspension, s as resolveFallbackSoonestCooldownExpiry, t as appendFailedCandidateAttempt, u as resolveModelFallbackCandidateHarnessAuthPrecheck } from "./model-fallback-attempt-BPoUA1Sl.js";
import { o as suspendSession, r as resolveSessionSuspensionReason } from "./session-suspension-DjKGzDsr.js";
//#region src/agents/live-model-switch-error.ts
/** Control-flow error used to request a live session model switch. */
var LiveSessionModelSwitchError = class extends Error {
	constructor(selection) {
		super(`Live session model switch requested: ${selection.provider}/${selection.model}`);
		this.name = "LiveSessionModelSwitchError";
		this.provider = selection.provider;
		this.model = selection.model;
		this.agentRuntimeOverride = selection.agentRuntimeOverride;
		this.authProfileId = selection.authProfileId;
		this.authProfileIdSource = selection.authProfileIdSource;
	}
};
//#endregion
//#region src/agents/failover-policy.ts
/** Returns true when a failed model can be probed during cooldown. */
function shouldAllowCooldownProbeForReason(reason) {
	return reason === "billing" || shouldUseTransientCooldownProbeSlot(reason);
}
/** Returns true when a transient failure should consume a cooldown probe slot. */
function shouldUseTransientCooldownProbeSlot(reason) {
	return reason === "rate_limit" || reason === "overloaded" || reason === "unknown" || reason === "empty_response" || reason === "no_error_details" || reason === "unclassified" || reason === "timeout";
}
/** Returns true when a non-transient failure should leave transient probe budget intact. */
function shouldPreserveTransientCooldownProbeSlot(reason) {
	return reason === "model_not_found" || reason === "format" || reason === "auth" || reason === "auth_permanent" || reason === "session_expired" || reason === "tls_certificate";
}
//#endregion
//#region src/agents/fallback-skip-cache.ts
/**
* Session-scoped "known-bad candidate" cache for the model fallback chain.
*
* When explicitly enabled and a fallback candidate fails with a non-transient
* credential error (`auth` / `auth_permanent`), the chain can avoid retrying
* the same candidate on every subsequent turn until the user fixes their auth.
*
* This module records skip markers per `(sessionId, provider, model, authScope)`
* with a short TTL. The cache is intentionally in-memory only: a process
* restart clears it so a freshly-restarted gateway always tries every
* candidate at least once before deciding to skip again.
*
* The cache is global, not per-config, so any caller running fallbacks for the
* same `sessionId` shares the same skip set.
*/
/**
* Default time-to-live for a skip marker. Disabled by default so existing
* fallback retry behavior stays unchanged unless an operator opts in with
* TESTCLAW_FALLBACK_SKIP_TTL_MS.
*/
const DEFAULT_FALLBACK_SKIP_TTL_MS = 0;
const FALLBACK_SKIP_TTL_ENV = "TESTCLAW_FALLBACK_SKIP_TTL_MS";
const FALLBACK_SKIP_TTL_MIN_MS = 1e3;
const FALLBACK_SKIP_TTL_MAX_MS = 6e5;
function resolveConfiguredSkipTtlMs(env = process.env) {
	const raw = env[FALLBACK_SKIP_TTL_ENV];
	if (!raw) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	const trimmed = raw.trim();
	if (!trimmed) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	const parsed = parseStrictNonNegativeInteger(trimmed);
	if (parsed === void 0) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	if (parsed === 0) return 0;
	return Math.min(FALLBACK_SKIP_TTL_MAX_MS, Math.max(FALLBACK_SKIP_TTL_MIN_MS, parsed));
}
/**
* Minimum interval between two opportunistic global prunes. Keeps the
* worst-case cost of a hot write/check path amortized: even if a gateway
* tracks thousands of sessions, the cache is only walked every
* `GLOBAL_PRUNE_INTERVAL_MS`, not on every call.
*/
const GLOBAL_PRUNE_INTERVAL_MS = 5e3;
function getState() {
	const globalStore = globalThis;
	if (!globalStore.testclawFallbackSkipCacheState) {
		const buckets = globalStore.testclawFallbackSkipCache ?? /* @__PURE__ */ new Map();
		globalStore.testclawFallbackSkipCacheState = {
			buckets,
			lastGlobalPruneAtMs: 0
		};
		globalStore.testclawFallbackSkipCache = buckets;
	}
	return globalStore.testclawFallbackSkipCacheState;
}
function getBuckets() {
	return getState().buckets;
}
function sessionBucket(sessionId, create) {
	const buckets = getBuckets();
	let bucket = buckets.get(sessionId);
	if (!bucket && create) {
		bucket = /* @__PURE__ */ new Map();
		buckets.set(sessionId, bucket);
	}
	return bucket;
}
function candidateKey(provider, model, authScope) {
	return JSON.stringify([modelKey(provider, model), authScope?.trim() || null]);
}
function pruneExpired(bucket, now) {
	for (const [key, entry] of bucket.entries()) if (entry.expiresAtMs <= now) bucket.delete(key);
}
/**
* Walk every session bucket, drop expired markers, and remove buckets that
* end up empty. Called opportunistically from the hot write/check paths so
* stale buckets left behind by one-off sessions cannot accumulate across the
* gateway's lifetime — the per-bucket prune only fires when the same session
* is queried again, which is not guaranteed for short-lived sessions.
*/
function pruneAllExpired(now) {
	const state = getState();
	if (now - state.lastGlobalPruneAtMs < GLOBAL_PRUNE_INTERVAL_MS) return;
	state.lastGlobalPruneAtMs = now;
	for (const [sessionId, bucket] of state.buckets.entries()) {
		pruneExpired(bucket, now);
		if (bucket.size === 0) state.buckets.delete(sessionId);
	}
}
/**
* Record that `(sessionId, provider, model)` should be skipped for the
* configured TTL. Safe to call with falsy `sessionId` — the call becomes a
* no-op so callers do not need to guard themselves.
*/
function markFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const now = params.now ?? Date.now();
	const ttlMs = params.ttlMs ?? resolveConfiguredSkipTtlMs();
	if (ttlMs <= 0) return;
	pruneAllExpired(now);
	const bucket = sessionBucket(params.sessionId, true);
	if (!bucket) return;
	bucket.set(candidateKey(params.provider, params.model, params.authScope), {
		expiresAtMs: now + ttlMs,
		reason: params.reason
	});
}
/**
* Returns true when `(sessionId, provider, model)` has an unexpired skip
* marker. Expired entries are pruned as a side-effect so the cache does not
* grow unbounded.
*/
function isFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return false;
	const now = params.now ?? Date.now();
	pruneAllExpired(now);
	const bucket = sessionBucket(params.sessionId, false);
	if (!bucket) return false;
	pruneExpired(bucket, now);
	if (bucket.size === 0) {
		getBuckets().delete(params.sessionId);
		return false;
	}
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	return Boolean(entry && entry.expiresAtMs > now);
}
/**
* Look up the recorded skip reason for a `(sessionId, provider, model)`
* triple. Returns `undefined` when no unexpired marker exists. Used by the
* fallback chain to surface the original failure reason in observation logs.
*/
function getFallbackCandidateSkipReason(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const bucket = sessionBucket(params.sessionId, false);
	if (!bucket) return;
	const now = params.now ?? Date.now();
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	if (!entry || entry.expiresAtMs <= now) return;
	return entry.reason;
}
//#endregion
//#region src/agents/model-fallback-cooldown.ts
const lastProbeAttempt = /* @__PURE__ */ new Map();
const MIN_PROBE_INTERVAL_MS = 3e4;
const PROBE_MARGIN_MS = 12e4;
const PROBE_SCOPE_DELIMITER = "::";
const PROBE_STATE_TTL_MS = 864e5;
const MAX_PROBE_KEYS = 256;
function resolveProbeThrottleKey(provider, agentDir) {
	const scope = normalizeOptionalString(agentDir) ?? "";
	return scope ? `${scope}${PROBE_SCOPE_DELIMITER}${provider}` : provider;
}
function pruneProbeState(now) {
	for (const [key, ts] of lastProbeAttempt) if (!Number.isFinite(ts) || ts <= 0 || now - ts > PROBE_STATE_TTL_MS) lastProbeAttempt.delete(key);
}
function enforceProbeStateCap() {
	while (lastProbeAttempt.size > MAX_PROBE_KEYS) {
		let oldestKey = null;
		let oldestTs = Number.POSITIVE_INFINITY;
		for (const [key, ts] of lastProbeAttempt) if (ts < oldestTs) {
			oldestKey = key;
			oldestTs = ts;
		}
		if (!oldestKey) break;
		lastProbeAttempt.delete(oldestKey);
	}
}
function isProbeThrottleOpen(now, throttleKey) {
	pruneProbeState(now);
	return now - (lastProbeAttempt.get(throttleKey) ?? 0) >= MIN_PROBE_INTERVAL_MS;
}
function markProbeAttempt(now, throttleKey) {
	pruneProbeState(now);
	lastProbeAttempt.set(throttleKey, now);
	enforceProbeStateCap();
}
function hasActiveProviderRateLimitResetWindow(params) {
	return params.profileIds.some((profileId) => {
		const stats = params.authStore.usageStats?.[profileId];
		if (!stats || !isActiveUnusableWindow(stats.blockedUntil, params.now)) return false;
		if (stats.blockedReason !== "subscription_limit" || !stats.blockedSource) return false;
		return !stats.blockedModel || stats.blockedModel === params.model;
	});
}
function shouldProbePrimaryDuringCooldown(params) {
	if (!params.isPrimary || !isProbeThrottleOpen(params.now, params.throttleKey)) return false;
	if (!params.hasFallbackCandidates) return true;
	const soonest = params.authRuntime.getSoonestCooldownExpiry(params.authStore, params.profileIds, {
		now: params.now,
		forModel: params.model
	});
	if (params.reason === "rate_limit" && !hasActiveProviderRateLimitResetWindow({
		authStore: params.authStore,
		profileIds: params.profileIds,
		now: params.now,
		model: params.model
	})) return true;
	if (soonest === null || !Number.isFinite(soonest)) return true;
	return params.now >= soonest - PROBE_MARGIN_MS;
}
function resolveCooldownDecision(params) {
	const inferredReason = params.authRuntime.resolveProfilesUnavailableReason({
		store: params.authStore,
		profileIds: params.profileIds,
		now: params.now
	}) ?? "unknown";
	const shouldProbe = shouldProbePrimaryDuringCooldown({
		isPrimary: params.isPrimary,
		hasFallbackCandidates: params.hasFallbackCandidates,
		reason: inferredReason,
		now: params.now,
		throttleKey: params.probeThrottleKey,
		authRuntime: params.authRuntime,
		authStore: params.authStore,
		profileIds: params.profileIds,
		model: params.candidate.model
	});
	if (inferredReason === "auth" || inferredReason === "auth_permanent") return {
		type: "skip",
		reason: inferredReason,
		error: `Provider ${params.candidate.provider} has ${inferredReason} issue (skipping all models)`
	};
	if (inferredReason === "billing") {
		if (params.isPrimary && shouldProbe) return {
			type: "attempt",
			reason: inferredReason,
			markProbe: true
		};
		return {
			type: "suspend_session",
			reason: inferredReason
		};
	}
	if (!(params.isPrimary && (!params.requestedModel || shouldProbe) || !params.isPrimary && shouldUseTransientCooldownProbeSlot(inferredReason))) return {
		type: "suspend_session",
		reason: inferredReason
	};
	return {
		type: "attempt",
		reason: inferredReason,
		markProbe: params.isPrimary && shouldProbe
	};
}
//#endregion
//#region src/agents/model-fallback.types.ts
const MODEL_FALLBACK_SKIPPED_CODE = "MODEL_FALLBACK_SKIPPED";
//#endregion
//#region src/agents/model-fallback-runner.ts
const log = createSubsystemLogger("model-fallback");
const modelFallbackAuthRuntimeLoader = createLazyImportLoader(() => import("./auth-profiles.runtime-PHklKEz5.js"));
function flushDeferredSessionSuspension(state) {
	const pending = state.pending;
	if (!pending) return;
	state.pending = void 0;
	suspendSession(pending);
}
async function runWithModelFallback(params) {
	const deferredSuspension = {};
	try {
		const result = await runWithModelFallbackInternal(params, deferredSuspension);
		if (result.outcome === "exhausted") flushDeferredSessionSuspension(deferredSuspension);
		return result;
	} catch (err) {
		if (!shouldDiscardDeferredSessionSuspension({
			error: err,
			abortSignal: params.abortSignal
		})) flushDeferredSessionSuspension(deferredSuspension);
		throw err;
	}
}
async function runWithModelFallbackInternal(params, deferredSuspension) {
	const candidates = resolveModelCandidateChain({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		fallbacksOverride: params.fallbacksOverride,
		requestedRouteResolution: params.requestedRouteResolution,
		manifestPlugins: params.manifestPlugins
	});
	await params.prepareCandidateChain?.(candidates);
	const userLockedAuthProfileId = params.userLockedAuthProfileId?.trim() || void 0;
	const authRuntime = !params.skipAuthProfileRuntime && params.cfg && (userLockedAuthProfileId || hasAnyAuthProfileStoreSource(params.agentDir)) ? await modelFallbackAuthRuntimeLoader.load() : null;
	const authStore = authRuntime ? authRuntime.ensureAuthProfileStore(params.agentDir, {
		profileId: userLockedAuthProfileId,
		externalCli: externalCliDiscoveryScoped({
			config: params.cfg,
			allowKeychainPrompt: false,
			providerIds: candidates.map((candidate) => candidate.provider),
			...userLockedAuthProfileId ? { profileIds: [userLockedAuthProfileId] } : {}
		})
	}) : null;
	const attempts = [];
	const profileIdsByCandidate = /* @__PURE__ */ new Map();
	let lastError;
	let latestClassifiedResult;
	let exhaustionResult;
	const cooldownProbeUsedProviders = /* @__PURE__ */ new Set();
	const tlsFailedProviders = /* @__PURE__ */ new Set();
	const notifyFallbackStep = async (step) => {
		try {
			await params.onFallbackStep?.(step);
		} catch {
			log.warn("Model fallback observer failed; preserving execution outcome.");
		}
	};
	const observeDecision = async (decision) => {
		if (!params.onFallbackStep && !isModelFallbackDecisionLogEnabled()) return;
		const fallbackStep = logModelFallbackDecision(decision);
		if (fallbackStep) await notifyFallbackStep(fallbackStep);
	};
	const observeFailedCandidate = async (failedAttempt) => {
		if (!params.onFallbackStep && !isModelFallbackDecisionLogEnabled()) appendFailedCandidateAttempt(failedAttempt);
		else {
			const fallbackStep = recordFailedCandidateAttempt(failedAttempt);
			if (fallbackStep) await notifyFallbackStep(fallbackStep);
		}
		if (params.sessionId && failedAttempt.nextCandidate) {
			const described = describeFailoverError(failedAttempt.error);
			emitFailoverEvent({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				lane: params.lane,
				fromProvider: failedAttempt.candidate.provider,
				fromModel: failedAttempt.candidate.model,
				toProvider: failedAttempt.nextCandidate.provider,
				toModel: failedAttempt.nextCandidate.model,
				reason: described.reason ?? "unknown",
				cascadeDepth: failedAttempt.attempt - 1,
				suspended: false
			});
		}
	};
	const hasFallbackCandidates = candidates.length > 1;
	const requestedCandidate = candidates.find((candidate) => candidate.routeOrigin === "requested");
	const runAttribution = {
		sessionId: params.sessionId,
		lane: params.lane
	};
	const runObs = {
		runId: params.runId,
		...runAttribution,
		requestedProvider: params.provider,
		requestedModel: params.model,
		fallbackConfigured: hasFallbackCandidates
	};
	for (let i = 0; i < candidates.length; i += 1) {
		const candidate = candidates.at(i);
		if (!candidate) throw new Error(`Missing model fallback candidate at index ${i}`);
		if (tlsFailedProviders.has(candidate.provider)) continue;
		const candidateRef = {
			provider: candidate.provider,
			model: candidate.model
		};
		const nextCandidate = candidates[resolveNextFallbackCandidateIndex({
			candidates,
			currentIndex: i,
			excludedProviders: tlsFailedProviders
		})];
		const hasRemainingCandidate = nextCandidate !== void 0;
		const candidateHarnessAuth = await resolveModelFallbackCandidateHarnessAuthPrecheck({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			resolveAgentHarnessRuntimeOverride: params.resolveAgentHarnessRuntimeOverride,
			prepareAgentHarnessRuntime: params.prepareAgentHarnessRuntime,
			...candidate
		});
		const isPrimary = candidate.routeOrigin === "requested";
		const requestedModel = requestedCandidate !== void 0 && candidate.provider === requestedCandidate.provider && candidate.model === requestedCandidate.model;
		const attemptContext = {
			attempt: i + 1,
			total: candidates.length
		};
		const candObs = {
			...runObs,
			candidate,
			...attemptContext,
			nextCandidate,
			isPrimary,
			requestedModelMatched: requestedModel
		};
		const observeCandidateDecision = (decision, extra = {}) => observeDecision({
			decision,
			...candObs,
			...extra
		});
		const pushSkippedAttempt = (error, reason, authMode) => attempts.push({
			...candidateRef,
			error,
			reason,
			code: MODEL_FALLBACK_SKIPPED_CODE,
			authMode
		});
		const recordFailure = async (error, next) => {
			await observeFailedCandidate({
				attempts,
				...candObs,
				error,
				nextCandidate: next
			});
			await params.onError?.({
				...candidateRef,
				error,
				...attemptContext
			});
		};
		let candidateAuthProfileIds;
		let quotaRequiresAuthPreparation = false;
		let userLockedAuthProfileEligible = false;
		if (authRuntime && authStore) {
			userLockedAuthProfileEligible = userLockedAuthProfileId !== void 0 && authRuntime.resolveAuthProfileEligibility({
				cfg: params.cfg,
				store: authStore,
				provider: candidate.provider,
				profileId: userLockedAuthProfileId,
				includePendingOAuthRefresh: true
			}).eligible;
			let profileIds = authRuntime.resolveAuthProfileOrder({
				cfg: params.cfg,
				store: authStore,
				provider: candidate.provider,
				forModel: candidate.model,
				includePendingOAuthRefresh: true
			});
			if (userLockedAuthProfileEligible && userLockedAuthProfileId) profileIds = [.../* @__PURE__ */ new Set([userLockedAuthProfileId, ...profileIds])];
			quotaRequiresAuthPreparation = (await authRuntime.maybeReprobeWhamBlockedProfiles({
				store: authStore,
				profileIds,
				agentDir: params.agentDir,
				cfg: params.cfg,
				forModel: candidate.model
			}))?.requiresAuthPreparation === true;
			if (!candidateHarnessAuth.skipsProviderAuthCooldown) {
				candidateAuthProfileIds = profileIds;
				profileIdsByCandidate.set(candidate, candidateAuthProfileIds);
			}
		}
		const candidateAuthScope = resolveFallbackAuthScope({
			userLockedAuthProfileId: userLockedAuthProfileEligible ? userLockedAuthProfileId : void 0,
			profileIds: candidateAuthProfileIds
		});
		if (!isPrimary && params.sessionId) {
			if (isFallbackCandidateSkipped({
				sessionId: params.sessionId,
				...candidateRef,
				authScope: candidateAuthScope
			})) {
				const skipReason = getFallbackCandidateSkipReason({
					sessionId: params.sessionId,
					...candidateRef,
					authScope: candidateAuthScope
				}) ?? "auth";
				const reauthCommand = buildProviderReauthCommand(candidate.provider);
				const reauthHint = reauthCommand ? `run \`${reauthCommand}\` to re-authenticate` : "re-authenticate that provider";
				const error = `Skipping ${candidate.provider}/${candidate.model}: recent ${skipReason} failure in this session (${reauthHint})`;
				pushSkippedAttempt(error, skipReason);
				await observeCandidateDecision("skip_candidate", {
					reason: skipReason,
					error
				});
				continue;
			}
		}
		let runOptions;
		let attemptedDuringCooldown = false;
		let transientProbeProviderForAttempt = null;
		if (authRuntime && authStore && candidateAuthProfileIds && !quotaRequiresAuthPreparation && !candidateHarnessAuth.skipsProviderAuthCooldown) {
			const profileIds = candidateAuthProfileIds;
			const isAnyProfileAvailable = profileIds.some((id) => !authRuntime.isProfileInCooldown(authStore, id, void 0, candidate.model));
			if (profileIds.length > 0 && !isAnyProfileAvailable) {
				const now = Date.now();
				const probeThrottleKey = resolveProbeThrottleKey(candidate.provider, params.agentDir);
				const decision = resolveCooldownDecision({
					candidate,
					isPrimary,
					requestedModel,
					hasFallbackCandidates,
					now,
					probeThrottleKey,
					authRuntime,
					authStore,
					profileIds
				});
				const authMode = decision.reason === "billing" || decision.reason === "auth" || decision.reason === "auth_permanent" || decision.reason === "session_expired" ? resolveSubscriptionAuthModeForProfiles({
					store: authStore,
					profileIds
				}) : void 0;
				if (decision.type !== "attempt") {
					const error = decision.type === "skip" ? decision.error : `Provider ${candidate.provider} is in cooldown`;
					pushSkippedAttempt(error, decision.reason, authMode);
					if (decision.type === "suspend_session" && params.sessionId) {
						emitFailoverEvent({
							sessionId: params.sessionId,
							lane: params.lane,
							fromProvider: candidate.provider,
							fromModel: candidate.model,
							reason: decision.reason,
							suspended: !hasRemainingCandidate
						});
						if (!hasRemainingCandidate) {
							deferredSuspension.pending = void 0;
							suspendSession({
								cfg: params.cfg,
								agentId: params.agentId,
								agentDir: params.agentDir,
								sessionId: params.sessionId,
								reason: resolveSessionSuspensionReason(decision.reason),
								failedProvider: candidate.provider,
								failedModel: candidate.model
							});
						}
					}
					await observeCandidateDecision("skip_candidate", {
						reason: decision.reason,
						error,
						profileCount: profileIds.length
					});
					continue;
				}
				if (decision.markProbe) markProbeAttempt(now, probeThrottleKey);
				if (shouldAllowCooldownProbeForReason(decision.reason)) {
					const isTransientCooldownReason = shouldUseTransientCooldownProbeSlot(decision.reason);
					if (isTransientCooldownReason && cooldownProbeUsedProviders.has(candidate.provider)) {
						const error = `Provider ${candidate.provider} is in cooldown (probe already attempted this run)`;
						pushSkippedAttempt(error, decision.reason, authMode);
						await observeCandidateDecision("skip_candidate", {
							reason: decision.reason,
							error,
							profileCount: profileIds.length
						});
						continue;
					}
					runOptions = { allowTransientCooldownProbe: true };
					if (isTransientCooldownReason) transientProbeProviderForAttempt = candidate.provider;
				}
				attemptedDuringCooldown = true;
				await observeCandidateDecision("probe_cooldown_candidate", {
					reason: decision.reason,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					profileCount: profileIds.length
				});
			}
		}
		const attemptRun = await runFallbackAttempt({
			run: params.run,
			...candidate,
			attempts,
			captureHarnessPreflight: true,
			options: {
				...runOptions,
				isFinalFallbackAttempt: !hasRemainingCandidate,
				modelRoutingProvenance: {
					requestedProvider: params.provider,
					requestedModel: params.model,
					stage: isPrimary ? "initial" : "fallback",
					fallbackReason: isPrimary ? void 0 : attempts.at(-1)?.reason
				}
			},
			deferSessionSuspension: hasRemainingCandidate,
			onDeferredSessionSuspension: (suspension) => {
				deferredSuspension.pending = suspension;
			},
			classifyResult: params.classifyResult,
			...attemptContext,
			attribution: runAttribution,
			abortSignal: params.abortSignal
		});
		if ("success" in attemptRun) {
			if (!attemptRun.stopped && (i > 0 || attempts.length > 0 || attemptedDuringCooldown)) {
				await observeCandidateDecision("candidate_succeeded", { previousAttempts: attempts });
				const notFoundAttempt = i > 0 ? attempts.find((a) => a.reason === "model_not_found") : void 0;
				if (notFoundAttempt) log.warn(`Model "${sanitizeForLog(notFoundAttempt.provider)}/${sanitizeForLog(notFoundAttempt.model)}" not found. Fell back to "${sanitizeForLog(candidate.provider)}/${sanitizeForLog(candidate.model)}".`);
			}
			return attemptRun.success;
		}
		const err = attemptRun.error;
		if (isAgentHarnessPreflightError(err)) {
			const failedHarnessId = resolveAgentHarnessPreflightOwner(err);
			if (!failedHarnessId) throw err;
			let nextEligibleIndex = candidates.length;
			for (let index = i + 1; index < candidates.length; index += 1) {
				const next = candidates[index];
				if (!next || tlsFailedProviders.has(next.provider)) continue;
				if (resolveModelFallbackCandidateAgentRuntime({
					cfg: params.cfg,
					agentId: params.agentId,
					sessionKey: params.sessionKey,
					resolveAgentHarnessRuntimeOverride: params.resolveAgentHarnessRuntimeOverride,
					...next
				}).runtime !== failedHarnessId) {
					nextEligibleIndex = index;
					break;
				}
			}
			const nextEligibleCandidate = candidates[nextEligibleIndex];
			if (!nextEligibleCandidate) throw err;
			lastError = err;
			await recordFailure(err, nextEligibleCandidate);
			i = nextEligibleIndex - 1;
			continue;
		}
		if (!attemptRun.classifiedResult && params.canFallbackAfterError && !await params.canFallbackAfterError({
			...candidateRef,
			error: err,
			...attemptContext
		})) throw err;
		if (attemptRun.classifiedResult) latestClassifiedResult = attemptRun.classifiedResult;
		if (attemptRun.exhaustionResult && (!exhaustionResult || attemptRun.exhaustionResult.priority >= exhaustionResult.priority)) exhaustionResult = attemptRun.exhaustionResult;
		if (isNonProviderRuntimeCoordinationError(err) || isTranscriptNotContinuableError(err)) throw err;
		if (transientProbeProviderForAttempt) {
			const probeFailureReason = describeFailoverError(err).reason;
			if (!shouldPreserveTransientCooldownProbeSlot(probeFailureReason)) cooldownProbeUsedProviders.add(transientProbeProviderForAttempt);
		}
		const errMessage = formatErrorMessage(err);
		if (isLikelyContextOverflowError(errMessage) && !hasProviderRequestSizeCeiling(err)) throw err;
		if (isMissingAgentHarnessError(err)) throw err;
		const normalized = coerceToFailoverError(err, {
			...candidateRef,
			...runAttribution
		}) ?? err;
		if (err instanceof LiveSessionModelSwitchError) {
			if (hasDifferentLiveSessionRuntimeSelection({
				error: err,
				currentAgentHarnessRuntimeOverride: candidateHarnessAuth.agentHarnessRuntimeOverride
			})) throw err;
			const liveSwitchTargetIndex = resolveLiveSessionModelSwitchRedirectIndex({
				error: err,
				candidates,
				currentIndex: i
			});
			if (liveSwitchTargetIndex !== null) {
				i = liveSwitchTargetIndex - 1;
				continue;
			}
			const switchMsg = err.message;
			const switchNormalized = new FailoverError(switchMsg, {
				reason: "unknown",
				...candidateRef,
				...runAttribution
			});
			lastError = switchNormalized;
			await observeFailedCandidate({
				attempts,
				...candObs,
				error: switchNormalized
			});
			continue;
		}
		const isKnownFailover = isFailoverError(normalized);
		if (!isKnownFailover && !hasRemainingCandidate) throw err;
		if (isKnownFailover && !isPrimary && params.sessionId && (normalized.reason === "auth" || normalized.reason === "auth_permanent")) markFallbackCandidateSkipped({
			sessionId: params.sessionId,
			...candidateRef,
			authScope: normalized.profileId?.trim() || candidateAuthScope,
			reason: normalized.reason
		});
		if (isKnownFailover && normalized.reason === "tls_certificate") tlsFailedProviders.add(candidate.provider);
		const failedNextCandidateIndex = resolveNextFallbackCandidateIndex({
			candidates,
			currentIndex: i,
			excludedProviders: tlsFailedProviders
		});
		lastError = normalized;
		await recordFailure(normalized, candidates[failedNextCandidateIndex]);
		if (failedNextCandidateIndex > i + 1) i = failedNextCandidateIndex - 1;
	}
	if (exhaustionResult) {
		const selected = latestClassifiedResult && params.mergeExhaustedResult ? {
			...latestClassifiedResult,
			result: params.mergeExhaustedResult({
				latestResult: latestClassifiedResult.result,
				preferredResult: exhaustionResult.result
			})
		} : exhaustionResult;
		return {
			outcome: "exhausted",
			result: selected.result,
			provider: selected.provider,
			model: selected.model,
			attempts
		};
	}
	return throwFallbackFailureSummary({
		attempts,
		candidates,
		lastError,
		label: "models",
		formatAttempt: (attempt) => `${attempt.provider}/${attempt.model}: ${attempt.error}${attempt.reason ? ` (${attempt.reason})` : ""}`,
		soonestCooldownExpiry: resolveFallbackSoonestCooldownExpiry({
			authRuntime,
			userLockedAuthProfileId,
			agentDir: params.agentDir,
			cfg: params.cfg,
			profileIdsByCandidate
		}),
		attribution: {
			sessionId: params.sessionId,
			lane: params.lane
		},
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/embedded-cyber-failover.ts
const EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE = "OPENAI_CYBER_POLICY_REFUSAL";
const DEFAULT_EMBEDDED_CYBER_FAILOVER = {
	mode: "auto",
	model: "openai/gpt-daybreak-blue-latest",
	cooloffMs: 6e5
};
function resolveEmbeddedCyberFailoverConfig(cfg) {
	const configured = cfg?.agents?.defaults?.embeddedAgent?.cyberFailover;
	return {
		mode: configured?.mode ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.mode,
		model: configured?.model ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.model,
		cooloffMs: configured?.cooloffMs ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.cooloffMs
	};
}
function resolveEmbeddedCyberFailoverTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: "openai",
		manifestPlugins: params.manifestPlugins
	});
	return resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: params.raw,
		defaultProvider: "openai",
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	})?.ref ?? null;
}
function isReplaySafeEmbeddedOpenAiCyberRefusal(params) {
	const refusal = params.result.meta.agentMeta?.providerRefusal;
	return params.provider === "openai" && params.result.meta.agentMeta?.agentHarnessId === "testclaw" && params.result.meta.replayInvalid !== true && refusal?.provider === "openai" && refusal.category === "cyber";
}
/**
* True when the caller pinned this turn to exactly one model. `run-embedded-attempt`
* passes an explicit empty fallback override for a locked model selection, and
* `docs/concepts/model-failover.md` documents that as strict: no other model may
* serve the turn. Policy escalation honors that contract, so a locked session
* keeps a cyber refusal terminal until the operator unlocks the selection.
*/
function isEmbeddedModelSelectionStrict(selection) {
	return selection.fallbacksOverride !== void 0 && selection.fallbacksOverride.length === 0;
}
function isSameEmbeddedCyberFailoverTarget(current, target) {
	return modelKey(current.provider, current.model) === modelKey(target.provider, target.model);
}
function isEmbeddedCyberFailoverTargetUsable(result) {
	const hasErrorPayload = (result.payloads ?? []).some((payload) => payload.isError === true);
	return result.meta.aborted !== true && result.meta.error === void 0 && result.meta.agentMeta?.providerRefusal === void 0 && (!hasErrorPayload || hasVisibleAgentPayload(result, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false,
		includeSilentReplyPayloads: false
	}));
}
/**
* True when a failed escalation attempt already committed work that the caller
* must still see. A replay-safe initial refusal says nothing about the retry:
* the retry runs the same turn with tools enabled, so it can execute a tool or
* deliver output and only then error out. Restoring the original refusal
* wholesale in that case would drop the retry's replay verdict, delivery
* evidence, and terminal receipt, and would tell recovery consumers that
* nothing ran.
*/
function didEmbeddedCyberFailoverTargetCommitWork(result) {
	return result.meta.replayInvalid === true || hasCommittedOutboundDeliveryEvidence(result);
}
function isEmbeddedCyberFailoverTargetSkipped(params) {
	return isFallbackCandidateSkipped({
		sessionId: params.sessionId,
		provider: params.target.provider,
		model: params.target.model,
		authScope: params.authScope
	});
}
function recordEmbeddedCyberFailoverTargetUnavailable(params) {
	const authFailure = params.attempts.findLast((attempt) => attempt.reason === "auth" || attempt.reason === "auth_permanent");
	if (!authFailure) return;
	markFallbackCandidateSkipped({
		sessionId: params.sessionId,
		provider: params.target.provider,
		model: params.target.model,
		authScope: params.authScope,
		reason: authFailure.reason ?? "auth",
		ttlMs: params.cooloffMs
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/result-fallback-classifier.ts
/** Classifies embedded-agent run results for model fallback decisions. */
/**
* Classifies embedded-agent terminal results for model fallback decisions.
*
* The classifier only flags failed invisible outcomes or exact generic external-runner failure
* copy; delivered messages, deliberate silent replies, hook blocks, and aborts must not trigger
* another model attempt.
*/
function isEmbeddedAgentRunResult(value) {
	return Boolean(value && typeof value === "object" && "meta" in value && value.meta && typeof value.meta === "object");
}
/** Keeps final-candidate bookkeeping while surfacing the best trusted terminal payload. */
function mergeEmbeddedAgentRunResultForModelFallbackExhaustion(params) {
	const executionTrace = params.latestResult.meta.executionTrace;
	const filteredAttempts = executionTrace?.attempts?.filter((attempt) => attempt.result !== "success");
	const traceNeedsNormalization = executionTrace !== void 0 && (executionTrace.winnerProvider !== void 0 || executionTrace.winnerModel !== void 0 || filteredAttempts?.length !== executionTrace.attempts?.length);
	if (params.latestResult === params.preferredResult && !traceNeedsNormalization) return params.latestResult;
	return {
		...params.latestResult,
		payloads: params.preferredResult.payloads,
		meta: {
			...params.latestResult.meta,
			error: params.preferredResult.meta.error,
			...traceNeedsNormalization ? { executionTrace: {
				...executionTrace,
				winnerProvider: void 0,
				winnerModel: void 0,
				attempts: filteredAttempts?.length ? filteredAttempts : void 0
			} } : {}
		}
	};
}
function hasDeliberateSilentTerminalReply(result) {
	if (result.meta.error?.kind === "hook_block") return true;
	return [result.meta.finalAssistantRawText, result.meta.finalAssistantVisibleText].some((text) => typeof text === "string" && isSilentReplyPayloadText(text));
}
function hasDeliverableAssistantPayload(result) {
	const finalVisibleText = result.meta?.finalAssistantVisibleText;
	return typeof finalVisibleText === "string" && finalVisibleText.trim().length > 0 && !isSilentReplyPayloadText(finalVisibleText) || hasVisibleAgentPayload(result, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false,
		requireTerminalContent: true
	});
}
function hasNonTextVisiblePayloadContent(payload) {
	const { isError: _isError, text: _text, ...payloadWithoutText } = payload;
	return hasDeliverableAssistantPayload({ payloads: [payloadWithoutText] });
}
function classifyGenericExternalRunFailurePayload(params) {
	const payloads = params.result.payloads;
	if (!Array.isArray(payloads) || payloads.length !== 1) return null;
	const [payload] = payloads;
	const text = payload?.text;
	if (payload?.isError === true || payload?.isReasoning === true || typeof text !== "string" || text.trim() !== "⚠️ Something went wrong while processing your request. Please try again, or use /new to start a fresh session." || !payload || hasNonTextVisiblePayloadContent(payload)) return null;
	return {
		message: `${params.provider}/${params.model} ended with a generic external runner failure: ${text}`,
		reason: "format",
		code: "generic_external_run_failure",
		rawError: text
	};
}
function classifyHarnessResult(params) {
	switch (params.result.meta.agentHarnessResultClassification) {
		case "empty": return {
			message: `${params.provider}/${params.model} ended without a visible assistant reply`,
			reason: "format",
			code: "empty_result"
		};
		case "reasoning-only": return {
			message: `${params.provider}/${params.model} ended with reasoning only`,
			reason: "format",
			code: "reasoning_only_result"
		};
		case "planning-only": return {
			message: `${params.provider}/${params.model} ended with a structured plan but no final answer`,
			reason: "format",
			code: "planning_only_result"
		};
		default: return null;
	}
}
function classifyProviderErrorPayloadReason(errorText, provider) {
	if (!errorText.trim()) return null;
	const failoverReason = classifyFailoverReason(errorText, { provider });
	switch (failoverReason) {
		case "auth":
		case "auth_permanent":
		case "billing":
		case "rate_limit":
		case "server_error":
		case "overloaded":
		case "timeout": return failoverReason;
		default: return null;
	}
}
/** Returns a fallback classification when an embedded run failed without user-visible output. */
function classifyEmbeddedAgentRunResultForModelFallback(params) {
	if (!isEmbeddedAgentRunResult(params.result)) return null;
	if (params.result.meta.agentMeta?.providerRefusal?.category === "misalignment") return null;
	if (params.result.meta.intentionalTerminalCompletion === "tool-batch" || params.result.meta.aborted || params.hasDirectlySentBlockReply === true || params.hasBlockReplyPipelineOutput === true) return null;
	const incompleteTurn = params.result.meta.error?.kind === "incomplete_turn";
	const fallbackSafeIncompleteTurn = incompleteTurn && params.result.meta.error?.fallbackSafe === true;
	if (params.result.meta.replayInvalid === true && !fallbackSafeIncompleteTurn) return null;
	if (hasCommittedOutboundDeliveryEvidence(params.result)) return null;
	if (params.result.meta.error?.kind === "hook_block") return null;
	if (isReplaySafeEmbeddedOpenAiCyberRefusal({
		provider: params.provider,
		result: params.result
	})) return {
		message: `${params.provider}/${params.model} was refused by OpenAI cyber policy`,
		reason: "unknown",
		code: EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE,
		preserveResultOnExhaustion: true,
		preserveResultPriority: 100
	};
	if (incompleteTurn && !fallbackSafeIncompleteTurn) return null;
	const payloads = params.result.payloads ?? [];
	const genericExternalFailureClassification = classifyGenericExternalRunFailurePayload({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (genericExternalFailureClassification) return genericExternalFailureClassification;
	if (hasDeliverableAssistantPayload(params.result)) return null;
	if (fallbackSafeIncompleteTurn) return {
		message: payloads.find((payload) => payload.isError === true && typeof payload.text === "string")?.text ?? `${params.provider}/${params.model} ended with an incomplete terminal response`,
		reason: "format",
		code: "incomplete_result",
		preserveResultOnExhaustion: true,
		preserveResultPriority: params.result.meta.error?.terminalPresentation === true ? 1 : 0
	};
	const harnessClassification = classifyHarnessResult({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (harnessClassification) return harnessClassification;
	const errorText = payloads.filter((payload) => payload?.isError === true).map((payload) => typeof payload.text === "string" ? payload.text : "").join("\n");
	const failoverReason = classifyProviderErrorPayloadReason(errorText, params.provider);
	if (failoverReason) return {
		message: `${params.provider}/${params.model} ended with a provider error: ${errorText}`,
		reason: failoverReason,
		code: "embedded_error_payload",
		rawError: errorText
	};
	if (hasDeliberateSilentTerminalReply(params.result)) return null;
	if (errorText.trim()) return null;
	if (payloads.some((payload) => payload.isError === true && hasNonTextVisiblePayloadContent(payload))) return null;
	const assistantPayloads = payloads.filter((payload) => payload.isError !== true);
	if (assistantPayloads.length > 0 && assistantPayloads.every((payload) => payload.isReasoning === true)) return {
		message: `${params.provider}/${params.model} ended with reasoning only`,
		reason: "format",
		code: "reasoning_only_result"
	};
	return {
		message: `${params.provider}/${params.model} ended without a visible assistant reply`,
		reason: "format",
		code: "empty_result"
	};
}
//#endregion
export { isEmbeddedCyberFailoverTargetSkipped as a, isSameEmbeddedCyberFailoverTarget as c, resolveEmbeddedCyberFailoverTarget as d, runWithModelFallback as f, LiveSessionModelSwitchError as h, didEmbeddedCyberFailoverTargetCommitWork as i, recordEmbeddedCyberFailoverTargetUnavailable as l, shouldUseTransientCooldownProbeSlot as m, mergeEmbeddedAgentRunResultForModelFallbackExhaustion as n, isEmbeddedCyberFailoverTargetUsable as o, MODEL_FALLBACK_SKIPPED_CODE as p, EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE as r, isEmbeddedModelSelectionStrict as s, classifyEmbeddedAgentRunResultForModelFallback as t, resolveEmbeddedCyberFailoverConfig as u };
