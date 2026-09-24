import { M as resolveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { n as resolveEffectiveHomeDir, t as normalizeHomeDirValue } from "./home-dir-C72ougzi.js";
import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-D465IUx2.js";
import { i as resolveRequiredHomeDir, o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { d as pathExists$1 } from "./fs-safe-CZ3jhUUr.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/infra/config-dir.ts
/** Resolves the Assistant config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.TESTCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const configPath = env.TESTCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath(configPath, env, homedir));
	return path.join(resolveRequiredHomeDir(env, homedir), ".testclaw");
}
//#endregion
//#region src/infra/home-display.ts
/** Replace an absolute home path with its display prefix without clipping sibling paths. */
function shortenPathWithHome(input, { home, prefix }) {
	if (input === home) return prefix;
	if (input.startsWith(`${home}/`) || input.startsWith(`${home}\\`)) return `${prefix}${input.slice(home.length)}`;
	if (process.platform === "win32" && path.win32.isAbsolute(input) && isPathInside(home, input)) {
		const relative = path.win32.relative(normalizeWindowsPathPreservingCase(home), normalizeWindowsPathPreservingCase(input));
		return path.win32.join(prefix, relative);
	}
	return input;
}
//#endregion
//#region src/infra/plain-object.ts
/**
* Config merge/patch accepts only `[object Object]` values, excluding Date/Map/Set/class instances.
* The stricter prototype contract prevents host objects from being merged as authored config.
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
//#endregion
//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function computeBackoff(policy, attempt) {
	const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
	const jitter = base * policy.jitter * Math.random();
	return Math.min(policy.maxMs, Math.round(base + jitter));
}
function computeBackoffSchedule(scheduleMs, attempt) {
	const index = Math.min(attempt - 1, scheduleMs.length - 1);
	return attempt <= 0 ? 0 : scheduleMs[index] ?? 0;
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
	if (!Number.isFinite(ms) || ms <= 0) return;
	const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS);
	await new Promise((resolve, reject) => {
		let settled = false;
		let timer = null;
		const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
		const onAbort = () => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			timer = null;
			cleanup();
			const error = new Error("aborted", { cause: abortSignal?.reason ?? /* @__PURE__ */ new Error("aborted") });
			error.name = "AbortError";
			reject(error);
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		timer = setTimeout(() => {
			settled = true;
			cleanup();
			timer = null;
			resolve();
		}, delayMs);
		if (options.ref === false) timer.unref?.();
		if (abortSignal?.aborted) onAbort();
	});
}
var RetrySupervisor = class {
	constructor(policy, maxAttempts = Number.POSITIVE_INFINITY) {
		this.policy = policy;
		this.maxAttempts = maxAttempts;
		this.attempts = 0;
		this.initialMs = policy.initialMs;
	}
	reset(initialMs = this.policy.initialMs) {
		this.cancel();
		this.attempts = 0;
		this.initialMs = initialMs;
		this.nextDelayOverrideMs = void 0;
	}
	cancel(reason = /* @__PURE__ */ new Error("retry cancelled")) {
		this.pendingAbort?.abort(reason);
		this.pendingAbort = void 0;
	}
	next(abortSignal) {
		const override = this.nextDelayOverrideMs;
		this.nextDelayOverrideMs = void 0;
		if (override === void 0 && ++this.attempts > Math.ceil(this.maxAttempts)) return;
		const attempt = Math.max(this.attempts, 1);
		const delayMs = override ?? computeBackoff({
			...this.policy,
			initialMs: this.initialMs
		}, attempt);
		this.cancel();
		const pendingAbort = new AbortController();
		this.pendingAbort = pendingAbort;
		return {
			attempt,
			delayMs,
			signal: abortSignal ? AbortSignal.any([pendingAbort.signal, abortSignal]) : pendingAbort.signal
		};
	}
};
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
const defaultSleep = async (ms) => {
	let remainingMs = ms;
	do {
		const delayMs = Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		remainingMs -= delayMs;
	} while (remainingMs > 0);
};
function clampNumber$1(value, fallback, min, max) {
	const next = Number.isFinite(value) ? value : void 0;
	if (next === void 0) return fallback;
	return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(Number.isFinite(value) ? value : fallback));
}
function resolveRetryDelayMs(value) {
	const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0;
	return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	const fraction = Number.isFinite(value) ? value : void 0;
	return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(clampNumber$1(overrides?.minDelayMs, defaults.minDelayMs, 0));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(clampNumber$1(overrides?.maxDelayMs, defaults.maxDelayMs, 0))),
		jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
	};
}
function applyJitter(delayMs, jitter, mode, random) {
	if (jitter === "full") {
		if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (.5 + random() * .5)));
		return Math.max(0, Math.ceil(delayMs * (1 + random())));
	}
	if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
	const fraction = random();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createRetryRunner(runtime = {}) {
	const runtimeSleep = runtime.sleep ?? defaultSleep;
	const runtimeRandom = runtime.random ?? Math.random;
	const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
	return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
		const attemptErrors = [];
		if (typeof attemptsOrOptions === "number") {
			const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
			for (let index = 0; index < attempts; index += 1) try {
				return await fn();
			} catch (err) {
				attemptErrors.push(err);
				if (index === attempts - 1) break;
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
			}
			throw createFailure(attemptErrors);
		}
		const options = attemptsOrOptions;
		const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
		const maxAttempts = resolved.attempts;
		const minDelayMs = resolved.minDelayMs;
		const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
		const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(clampNumber$1(options.retryAfterMaxDelayMs, maxDelayMs, 0)));
		const random = options.random ?? runtimeRandom;
		const sleep = options.sleep ?? runtimeSleep;
		const shouldRetry = options.shouldRetry ?? (() => true);
		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
			return await fn();
		} catch (err) {
			attemptErrors.push(err);
			if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
			const context = {
				attempt,
				maxAttempts,
				err,
				label: options.label
			};
			const retryAfterMs = options.retryAfterMs?.(err);
			const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
			const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
			const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
			const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
			const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
			let delay = Math.min(baseDelay, delayCap);
			const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
			const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
			delay = applyJitter(delay, resolved.jitter, wantsPositiveDraw ? "positive" : "symmetric", random);
			delay = Math.min(Math.max(delay, minDelayMs), delayCap);
			await options.onRetry?.({
				...context,
				delayMs: delay
			});
			if (delay > 0) await sleep(delay);
		}
		throw createFailure(attemptErrors);
	};
}
createRetryRunner();
//#endregion
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms, signal) {
	const delayMs = resolveTimerTimeoutMs(ms, 0, 0);
	if (signal) {
		if (signal.aborted) return Promise.reject(createAbortError("aborted", { cause: signal.reason ?? /* @__PURE__ */ new Error("aborted") }));
		return sleepWithAbort(delayMs, signal);
	}
	return new Promise((resolve) => {
		setTimeout(resolve, delayMs);
	});
}
//#endregion
//#region src/utils.ts
/** Creates a directory tree if it does not already exist. */
async function ensureDir(dir) {
	await fs.promises.mkdir(dir, { recursive: true });
}
/** Clamps a number to an inclusive min/max range. */
function clampNumber(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
/** Floors a number before clamping it to an inclusive min/max range. */
function clampInt(value, min, max) {
	return clampNumber(Math.floor(value), min, max);
}
/** Alias for clampNumber (shorter, more common name) */
const clamp = clampNumber;
/**
* Safely parse JSON, returning null on error instead of throwing.
*/
function tryParseJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
function normalizeE164(number) {
	const digits = number.replace(/^[a-z][a-z0-9-]*:/i, "").trim().replace(/\D/g, "");
	return digits ? `+${digits}` : "";
}
/** Resolves the effective Assistant home directory, if one can be determined. */
function resolveHomeDir() {
	return resolveEffectiveHomeDir(process.env, os.homedir);
}
function resolveHomeDisplayPrefix() {
	const home = resolveHomeDir();
	if (!home) return;
	if (normalizeHomeDirValue(process.env.TESTCLAW_HOME)) return {
		home,
		prefix: "$TESTCLAW_HOME"
	};
	return {
		home,
		prefix: "~"
	};
}
/** Replaces the leading home directory in a path with `~` or `$TESTCLAW_HOME`. */
function shortenHomePath(input) {
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	return shortenPathWithHome(input, display);
}
/** Replaces all effective-home occurrences inside a diagnostic string. */
function shortenHomeInString(input) {
	if (!input) return input;
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	if (process.platform === "win32") return input.replace(new RegExp(escapeRegExp(display.home), "giu"), display.prefix);
	return input.split(display.home).join(display.prefix);
}
/** Shortens a path for display without changing non-home paths. */
function displayPath(input) {
	return shortenHomePath(input);
}
/** Shortens home paths embedded in arbitrary display text. */
function displayString(input) {
	return shortenHomeInString(input);
}
let CONFIG_DIR = resolveConfigDir();
function pinConfigDir(env = process.env) {
	CONFIG_DIR = resolveConfigDir(env);
	return CONFIG_DIR;
}
/**
* Check if a file or directory exists at the given path.
*/
async function pathExists(targetPath) {
	return await pathExists$1(targetPath);
}
//#endregion
export { shortenPathWithHome as C, isPlainObject as S, computeBackoff as _, displayPath as a, sleepWithAbort as b, normalizeE164 as c, resolveHomeDir as d, shortenHomeInString as f, RetrySupervisor as g, sleep as h, clampNumber as i, pathExists as l, tryParseJson as m, clamp as n, displayString as o, shortenHomePath as p, clampInt as r, ensureDir as s, CONFIG_DIR as t, pinConfigDir as u, computeBackoffSchedule as v, resolveConfigDir as w, toRetryError as x, createRetryRunner as y };
