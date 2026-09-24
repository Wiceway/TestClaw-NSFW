import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import "./fs-safe-defaults-Co7TOLqh.js";
import { t as getFileLockProcessStartTime } from "./pid-alive-BrVKCISp.js";
import { n as isLockOwnerDefinitelyStale, r as shouldRemoveDeadOwnerOrExpiredLock, t as inspectStaleLockOwner } from "./stale-lock-file-ahAa355W.js";
import "node:fs/promises";
import { acquireFileLock } from "@testclaw/fs-safe/file-lock";
//#region src/plugin-sdk/file-lock.ts
/** Stable error code used when lock acquisition retries are exhausted. */
const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
const FILE_LOCK_MANAGER_KEY = "testclaw.plugin-sdk.file-lock";
let currentProcessStartTime;
function getCurrentProcessStartTime() {
	if (currentProcessStartTime === void 0) currentProcessStartTime = getFileLockProcessStartTime(process.pid);
	return currentProcessStartTime;
}
function createCurrentProcessLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const starttime = getCurrentProcessStartTime();
	if (starttime !== null) payload.starttime = starttime;
	return payload;
}
function asLockPayload(payload) {
	return asNullableRecord(payload);
}
function normalizeLockError(err, staleOwner = null) {
	if (err.code === "file_lock_timeout") throw Object.assign(new Error(err.message), {
		code: FILE_LOCK_TIMEOUT_ERROR_CODE,
		lockPath: err.lockPath ?? ""
	});
	if (err.code === "file_lock_stale") {
		const detail = staleOwner ? ` [${staleOwner.reason} pid=${staleOwner.pid} recorded-start=${staleOwner.recordedStarttime ?? "unknown"} observed-start=${staleOwner.observedStarttime ?? "unknown"}]` : "";
		throw Object.assign(/* @__PURE__ */ new Error(`${err.message}${detail}`), {
			code: FILE_LOCK_STALE_ERROR_CODE,
			lockPath: err.lockPath ?? ""
		});
	}
	throw err;
}
/** Acquire an owner-scoped process-local file lock backed by a `.lock` sidecar file. */
async function acquireFileLock$1(filePath, options) {
	options.assertResourceUnborrowed?.(filePath);
	const staleRecovery = options.staleRecovery ?? "remove-if-unchanged";
	let staleOwner = null;
	try {
		const lock = await acquireFileLock(filePath, {
			managerKey: FILE_LOCK_MANAGER_KEY,
			staleMs: options.stale,
			retry: options.retries,
			staleRecovery: staleRecovery === "remove-if-definitely-stale" ? "remove-if-unchanged" : staleRecovery,
			reentrantOwner: options.reentrantOwner,
			payload: () => {
				options.assertResourceUnborrowed?.(filePath);
				return createCurrentProcessLockPayload();
			},
			shouldReclaim: (params) => {
				if (staleRecovery === "fail-closed") {
					staleOwner = inspectStaleLockOwner({ payload: asLockPayload(params.payload) });
					return staleOwner !== null;
				}
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asLockPayload(params.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asLockPayload(params.payload),
					staleMs: params.staleMs,
					nowMs: params.nowMs
				});
			},
			...staleRecovery === "remove-if-unchanged" || staleRecovery === "remove-if-definitely-stale" ? { shouldRemoveStaleLock: (snapshot) => {
				options.assertResourceUnborrowed?.(snapshot.normalizedTargetPath);
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asLockPayload(snapshot.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asLockPayload(snapshot.payload),
					staleMs: options.stale
				});
			} } : {}
		});
		const targetPath = lock.lockPath.slice(0, -5);
		options.assertResourceUnborrowed?.(targetPath);
		return {
			lockPath: lock.lockPath,
			release: async () => {
				options.assertResourceUnborrowed?.(targetPath);
				await lock.release();
			}
		};
	} catch (err) {
		return normalizeLockError(err, staleOwner);
	}
}
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
async function withFileLock(filePath, options, fn) {
	const lock = await acquireFileLock$1(filePath, options);
	let outcome;
	try {
		outcome = { value: await fn() };
	} catch (error) {
		outcome = { error };
	}
	try {
		await lock.release();
	} catch (error) {
		if ("error" in outcome) throw new AggregateError([outcome.error, error], "File operation failed and lock release is unresolved", { cause: error });
		throw error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
export { acquireFileLock$1 as n, withFileLock as r, FILE_LOCK_TIMEOUT_ERROR_CODE as t };
