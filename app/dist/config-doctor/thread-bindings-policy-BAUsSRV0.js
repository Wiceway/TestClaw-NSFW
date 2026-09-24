import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as asNonNegativeFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-0M4tZV2c.js";
import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { d as resolveChannelDefaultBindingPlacement } from "./plugin-command-execution-Cc67t_QW.js";
//#region src/channels/thread-bindings-policy.ts
const DEFAULT_THREAD_BINDING_IDLE_HOURS = 24;
const DEFAULT_THREAD_BINDING_MAX_AGE_HOURS = 0;
function normalizeChannelId(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
/** Returns true when top-level commands should spawn in a child thread by default. */
function supportsAutomaticThreadBindingSpawn(channel) {
	return resolveChannelDefaultBindingPlacement(channel) === "child";
}
function normalizeThreadBindingHours(raw) {
	return asNonNegativeFiniteNumber(raw);
}
function resolveThreadBindingHoursMs(raw, fallbackHours) {
	const hours = normalizeThreadBindingHours(raw) ?? fallbackHours;
	const durationMs = Math.floor(hours * 60 * 60 * 1e3);
	if (!Number.isFinite(durationMs) || durationMs < 0) return 0;
	return Math.min(durationMs, MAX_DATE_TIMESTAMP_MS);
}
/** Resolves thread-binding idle timeout with channel/account override before session default. */
function resolveThreadBindingIdleTimeoutMs(params) {
	return resolveThreadBindingHoursMs(params.channelIdleHoursRaw, normalizeThreadBindingHours(params.sessionIdleHoursRaw) ?? DEFAULT_THREAD_BINDING_IDLE_HOURS);
}
/** Resolves thread-binding max age with channel/account override before session default. */
function resolveThreadBindingMaxAgeMs(params) {
	return resolveThreadBindingHoursMs(params.channelMaxAgeHoursRaw, normalizeThreadBindingHours(params.sessionMaxAgeHoursRaw) ?? DEFAULT_THREAD_BINDING_MAX_AGE_HOURS);
}
function resolveChannelThreadBindings(params) {
	const channelConfig = params.cfg.channels?.[params.channel];
	const accountConfig = channelConfig?.accounts?.[params.accountId];
	return {
		root: channelConfig?.threadBindings,
		account: accountConfig?.threadBindings
	};
}
function normalizeSpawnContext(value) {
	return value === "isolated" || value === "fork" ? value : void 0;
}
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
function resolveThreadBindingSpawnPolicy(params) {
	const channel = normalizeChannelId(params.channel);
	const accountId = normalizeAccountId(params.accountId);
	const { root, account } = resolveChannelThreadBindings({
		cfg: params.cfg,
		channel,
		accountId
	});
	return {
		channel,
		accountId,
		enabled: asBoolean(account?.enabled) ?? asBoolean(root?.enabled) ?? asBoolean(params.cfg.session?.threadBindings?.enabled) ?? true,
		spawnEnabled: asBoolean(account?.spawnSessions) ?? asBoolean(root?.spawnSessions) ?? asBoolean(params.cfg.session?.threadBindings?.spawnSessions) ?? true,
		defaultSpawnContext: normalizeSpawnContext(account?.defaultSpawnContext) ?? normalizeSpawnContext(root?.defaultSpawnContext) ?? normalizeSpawnContext(params.cfg.session?.threadBindings?.defaultSpawnContext) ?? "fork"
	};
}
/** Resolves idle timeout for a concrete channel/account config scope. */
function resolveThreadBindingIdleTimeoutMsForChannel(params) {
	const { root, account } = resolveThreadBindingChannelScope(params);
	return resolveThreadBindingIdleTimeoutMs({
		channelIdleHoursRaw: account?.idleHours ?? root?.idleHours,
		sessionIdleHoursRaw: params.cfg.session?.threadBindings?.idleHours
	});
}
/** Resolves max age for a concrete channel/account config scope. */
function resolveThreadBindingMaxAgeMsForChannel(params) {
	const { root, account } = resolveThreadBindingChannelScope(params);
	return resolveThreadBindingMaxAgeMs({
		channelMaxAgeHoursRaw: account?.maxAgeHours ?? root?.maxAgeHours,
		sessionMaxAgeHoursRaw: params.cfg.session?.threadBindings?.maxAgeHours
	});
}
function resolveThreadBindingChannelScope(params) {
	const channel = normalizeChannelId(params.channel);
	const accountId = normalizeAccountId(params.accountId);
	return resolveChannelThreadBindings({
		cfg: params.cfg,
		channel,
		accountId
	});
}
/** Formats the user-facing error for disabled thread bindings. */
function formatThreadBindingDisabledError(params) {
	return `Thread bindings are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.enabled=true to override for this account, or session.threadBindings.enabled=true globally).`;
}
/** Formats the user-facing error for disabled thread-bound session spawning. */
function formatThreadBindingSpawnDisabledError(params) {
	return `Thread-bound session spawns are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.spawnSessions=true to enable).`;
}
//#endregion
export { resolveThreadBindingSpawnPolicy as a, resolveThreadBindingMaxAgeMsForChannel as i, formatThreadBindingSpawnDisabledError as n, supportsAutomaticThreadBindingSpawn as o, resolveThreadBindingIdleTimeoutMsForChannel as r, formatThreadBindingDisabledError as t };
