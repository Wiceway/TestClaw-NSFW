import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as resolveAgentIdFromSessionKey } from "./session-key-AvQIavYt.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { n as getCliSessionBinding } from "./cli-session-binding-DqRmdzvi.js";
import "./sessions-4kX-llHk.js";
import { u as resolveSessionLifecycleTimestamps } from "./lifecycle-DpcRUIUy.js";
//#region src/config/sessions/reset-policy.ts
const DEFAULT_RESET_MODE = "none";
const DEFAULT_RESET_AT_HOUR = 4;
const DEFAULT_IDLE_MINUTES = 0;
/** Returns the most recent daily reset boundary for the supplied wall-clock time. */
function resolveDailyResetAtMs(now, atHour) {
	const hour = normalizeResetAtHour(atHour);
	const today = new Date(now).setHours(hour, 0, 0, 0);
	return now < today ? new Date(now).setHours(hour - 24, 0, 0, 0) : today;
}
/** Resolves the effective reset policy for direct, group, or thread sessions. */
function resolveSessionResetPolicy(params) {
	const sessionCfg = params.sessionCfg;
	const baseReset = params.resetOverride ?? sessionCfg?.reset;
	const typeReset = params.resetOverride ? void 0 : sessionCfg?.resetByType?.[params.resetType];
	const configured = Boolean(baseReset || typeReset);
	const inheritedTypeMode = typeReset && baseReset?.mode !== "none" ? baseReset?.mode : void 0;
	const mode = typeReset?.mode ?? inheritedTypeMode ?? (typeReset ? "daily" : void 0) ?? baseReset?.mode ?? (baseReset ? "daily" : DEFAULT_RESET_MODE);
	const atHour = normalizeResetAtHour(typeReset?.atHour ?? baseReset?.atHour ?? DEFAULT_RESET_AT_HOUR);
	const idleMinutesRaw = typeReset?.idleMinutes ?? baseReset?.idleMinutes;
	let idleMinutes;
	if (idleMinutesRaw != null) {
		const normalized = Math.floor(idleMinutesRaw);
		if (Number.isFinite(normalized)) idleMinutes = Math.max(normalized, 0);
	} else if (mode === "idle") idleMinutes = DEFAULT_IDLE_MINUTES;
	return {
		mode,
		atHour,
		idleMinutes,
		configured
	};
}
/** Evaluates whether a persisted session is still fresh under the resolved reset policy. */
function evaluateSessionFreshness(params) {
	if (params.updatedAt === 0) return { fresh: false };
	if (params.policy.mode === "none") return { fresh: true };
	const updatedAt = resolveTimestamp(params.updatedAt, params.now) ?? 0;
	const sessionStartedAt = resolveTimestamp(params.sessionStartedAt, params.now) ?? updatedAt;
	const lastInteractionAt = resolveTimestamp(params.lastInteractionAt, params.now) ?? sessionStartedAt;
	const dailyResetAt = params.policy.mode === "daily" ? resolveDailyResetAtMs(params.now, params.policy.atHour) : void 0;
	const idleExpiresAt = params.policy.idleMinutes != null && params.policy.idleMinutes > 0 ? lastInteractionAt + params.policy.idleMinutes * 6e4 : void 0;
	const staleDaily = dailyResetAt != null && sessionStartedAt < dailyResetAt;
	const staleIdle = idleExpiresAt != null && params.now > idleExpiresAt;
	const staleReason = staleDaily && staleIdle ? (dailyResetAt ?? Number.POSITIVE_INFINITY) <= (idleExpiresAt ?? Number.POSITIVE_INFINITY) ? "daily" : "idle" : staleIdle ? "idle" : staleDaily ? "daily" : void 0;
	return {
		fresh: !(staleDaily || staleIdle),
		dailyResetAt,
		idleExpiresAt,
		...staleReason ? { staleReason } : {}
	};
}
function resolveTimestamp(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	if (typeof now === "number" && Number.isFinite(now) && value > now) return;
	return value;
}
function normalizeResetAtHour(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_RESET_AT_HOUR;
	const normalized = Math.floor(value);
	if (!Number.isFinite(normalized)) return DEFAULT_RESET_AT_HOUR;
	if (normalized < 0) return 0;
	if (normalized > 23) return 23;
	return normalized;
}
//#endregion
//#region src/config/sessions/entry-freshness.ts
function hasProviderOwnedSession(entry) {
	const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
	return Boolean(provider && getCliSessionBinding(entry, provider));
}
/** Resolves one session entry's reset freshness using the runtime lifecycle rules. */
function resolveSessionEntryResetFreshness(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey, params.defaultAgentId);
	const sessionCfg = params.sessionCfg;
	const storePath = params.storePath ?? resolveSessionStorePathCore(sessionCfg?.store, {
		agentId,
		env: params.env
	});
	const entry = loadSessionEntryReadOnly({
		...params,
		agentId,
		storePath
	});
	const resetType = params.resetType;
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg,
		resetType,
		resetOverride: params.resetOverride
	});
	const lifecycleTimestamps = resolveSessionLifecycleTimestamps({
		entry,
		agentId,
		sessionKey: params.sessionKey,
		storePath
	});
	const base = {
		lifecycleTimestamps,
		resetPolicy,
		resetType
	};
	if (!entry) return {
		state: "missing",
		entry: void 0,
		freshness: void 0,
		...base
	};
	const freshness = resetPolicy.configured !== true && hasProviderOwnedSession(entry) ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: entry.updatedAt,
		sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
		lastInteractionAt: lifecycleTimestamps.lastInteractionAt,
		now: params.now ?? Date.now(),
		policy: resetPolicy
	});
	return {
		state: freshness.fresh ? "fresh" : "stale",
		entry,
		freshness,
		...base
	};
}
//#endregion
export { resolveSessionResetPolicy as i, resolveSessionEntryResetFreshness as n, evaluateSessionFreshness as r, hasProviderOwnedSession as t };
