import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-AvQIavYt.js";
import { i as executeWithCachedStatement, r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import "./semver-BiH_OTew.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import "./sqlite-error-diagnostics-E0F_10pq.js";
import { f as setSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { F as runInSqliteMaintenanceContext, P as registerSqliteCacheExitClose } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BppRXydv.js";
import "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { r as isArtifactPreservingStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { n as readConfigMachineState } from "./config-machine-state-BiDCuNUZ.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/shared-main-dir.ts
/** Resolve the shipped shared-main auth store, including its supported relocation. */
function resolveSharedMainAuthAgentDir(env = process.env) {
	const configured = env.TESTCLAW_AGENT_DIR?.trim();
	return configured ? resolveUserPath(configured, env) : path.join(resolveStateDir(env), "agents", LEGACY_IMPLICIT_AGENT_ID, "agent");
}
//#endregion
//#region src/agents/auth-profiles/sqlite-read-pool.ts
const AUTH_PROFILE_READ_HANDLE_CAP = 64;
const AUTH_PROFILE_READ_IDLE_MS = 18e5;
const authProfileReadDatabases = /* @__PURE__ */ new Map();
let unregisterReadHandleExitClose = null;
function closeAuthProfileReadDatabase(databasePath) {
	const pathname = path.resolve(databasePath);
	const entry = authProfileReadDatabases.get(pathname);
	if (!entry) return;
	clearNodeSqliteKyselyCacheForDatabase(entry.db);
	if (entry.db.isOpen) entry.db.close();
	clearTimeout(entry.idleTimer);
	entry.idleTimer = void 0;
	authProfileReadDatabases.delete(pathname);
	if (authProfileReadDatabases.size === 0) {
		unregisterReadHandleExitClose?.();
		unregisterReadHandleExitClose = null;
	}
}
/** Internal lifecycle close for scoped or all process-local pooled auth-profile readers. */
function closeAuthProfileReadPool(scope) {
	if (scope?.kind === "database") {
		closeAuthProfileReadDatabase(scope.databasePath);
		return;
	}
	if (scope?.kind === "root") {
		for (const pathname of authProfileReadDatabases.keys()) if (isPathInside(scope.rootPath, pathname)) closeAuthProfileReadDatabase(pathname);
		return;
	}
	for (const pathname of authProfileReadDatabases.keys()) closeAuthProfileReadDatabase(pathname);
}
function armReadHandleIdleClose(pathname, entry) {
	if (entry.idleTimer) {
		entry.idleTimer.refresh();
		return;
	}
	const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		if (authProfileReadDatabases.get(pathname) !== entry || entry.idleTimer !== timer) return;
		try {
			closeAuthProfileReadDatabase(pathname);
		} catch (error) {
			timer.refresh();
			process.emitWarning(`Failed to close idle auth profile reader: ${String(error)}`, { type: "AuthProfileReadPoolError" });
		}
	}, AUTH_PROFILE_READ_IDLE_MS));
	timer.unref();
	entry.idleTimer = timer;
}
function isMissingDatabasePath(pathname) {
	try {
		fs.statSync(pathname);
		return false;
	} catch (error) {
		return hasErrnoCode(error, "ENOENT");
	}
}
function acquireAuthProfileReadDatabase(pathname) {
	const resolvedPath = path.resolve(pathname);
	const cached = authProfileReadDatabases.get(resolvedPath);
	if (cached?.ready && cached.db.isOpen) {
		authProfileReadDatabases.delete(resolvedPath);
		authProfileReadDatabases.set(resolvedPath, cached);
		armReadHandleIdleClose(resolvedPath, cached);
		return {
			status: "readable",
			db: cached.db
		};
	}
	if (cached) closeAuthProfileReadDatabase(resolvedPath);
	for (const [pendingPath, entry] of authProfileReadDatabases) if (!entry.ready) closeAuthProfileReadDatabase(pendingPath);
	let db;
	try {
		db = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
	} catch {
		return isMissingDatabasePath(resolvedPath) ? { status: "missing" } : { status: "unreadable" };
	}
	const candidate = {
		db,
		ready: false
	};
	authProfileReadDatabases.set(resolvedPath, candidate);
	unregisterReadHandleExitClose ??= registerSqliteCacheExitClose(closeAuthProfileReadPool);
	armReadHandleIdleClose(resolvedPath, candidate);
	let readable = false;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, TESTCLAW_SQLITE_BUSY_TIMEOUT_MS);
		readable = readSqliteUserVersion(db) <= 23;
	} catch {}
	if (!readable) {
		closeAuthProfileReadDatabase(resolvedPath);
		return { status: "unreadable" };
	}
	try {
		while (authProfileReadDatabases.size > AUTH_PROFILE_READ_HANDLE_CAP) {
			const oldestPath = authProfileReadDatabases.keys().next().value;
			if (oldestPath === void 0) break;
			closeAuthProfileReadDatabase(oldestPath);
		}
	} catch (error) {
		try {
			closeAuthProfileReadDatabase(resolvedPath);
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Unable to close auth profile readers", { cause: closeError });
		}
		throw error;
	}
	candidate.ready = true;
	return {
		status: "readable",
		db
	};
}
//#endregion
//#region src/agents/auth-profiles/sqlite-json.ts
const PRIMARY_ROW_KEY = "primary";
const SHARED_STORE_STATE_KEY = "authProfiles.store";
const SHARED_STATE_STATE_KEY = "authProfiles.state";
const SHARED_AUTH_STORE_STATE_KEY = "auth.sharedStore";
function readSharedAuthKvCell(db, stateKey) {
	return executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey))?.value_json;
}
function getAgentAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function getSharedAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = databaseKind === "shared-state" ? "config_machine_state" : target === "store" ? "auth_profile_store" : "auth_profile_state";
	const schemaObject = executeWithCachedStatement(db, "SELECT type FROM sqlite_master WHERE name = ?", [tableName], (statement) => statement.get(tableName));
	if (!schemaObject) return {
		status: "missing",
		reason: "table"
	};
	return schemaObject.type === "table" ? null : { status: "unreadable" };
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	let raw;
	if (databaseKind === "shared-state") {
		const cell = readSharedAuthKvCell(db, target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY);
		if (cell === void 0) return {
			status: "missing",
			reason: "row"
		};
		raw = cell;
	} else if (target === "store") {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.store_json;
	} else {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.state_json;
	}
	try {
		return {
			status: "readable",
			raw: JSON.parse(raw)
		};
	} catch {
		return { status: "unreadable" };
	}
}
function inspectAgentAuthProfileJsonCellReadOnly(databasePath, target) {
	const acquired = acquireAuthProfileReadDatabase(databasePath);
	if (acquired.status === "missing") return {
		status: "missing",
		reason: "database"
	};
	if (acquired.status === "unreadable") return { status: "unreadable" };
	try {
		return inspectAuthProfileJsonCell(acquired.db, target, "agent");
	} catch {
		closeAuthProfileReadDatabase(databasePath);
		return { status: "unreadable" };
	}
}
/** Write one canonical auth cell on the caller's admitted transaction connection. */
function writeAuthProfileJsonCell(database, target, kind, payload) {
	const value = JSON.stringify(payload);
	const now = Date.now();
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).insertInto("config_machine_state").values({
		state_key: target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY,
		value_json: value,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: value,
		updated_at_ms: now
	})));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_store").values({
		store_key: PRIMARY_ROW_KEY,
		store_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		store_json: value,
		updated_at: now
	})));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_state").values({
		state_key: PRIMARY_ROW_KEY,
		state_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		state_json: value,
		updated_at: now
	})));
}
function deleteAuthProfileJsonCell(database, target, kind) {
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).deleteFrom("config_machine_state").where("state_key", "=", target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_state").where("state_key", "=", PRIMARY_ROW_KEY));
}
//#endregion
//#region src/agents/auth-profiles/path-resolve.ts
/**
* Auth profile path resolution.
* Centralizes canonical shared SQLite and cross-agent OAuth refresh lock paths.
*/
const SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT = 256;
function captureAuthProfileOwnerScope(env = process.env) {
	return {
		stateDir: path.resolve(resolveStateDir(env)),
		sharedMainDir: path.resolve(resolveSharedMainAuthAgentDir(env))
	};
}
const sharedAuthStoreOwnershipByDatabasePath = /* @__PURE__ */ new Map();
var InvalidSharedAuthStoreOwnershipError = class extends Error {
	constructor(value) {
		super(`Config machine state ${SHARED_AUTH_STORE_STATE_KEY} has an invalid shared auth store location (${JSON.stringify(value)}); run testclaw doctor --fix.`);
		this.code = "INVALID_SHARED_AUTH_STORE_OWNERSHIP";
		this.action = "testclaw doctor --fix";
		this.stateKey = SHARED_AUTH_STORE_STATE_KEY;
		this.name = "InvalidSharedAuthStoreOwnershipError";
	}
};
function parseSharedAuthStoreOwnership(value) {
	if (value === void 0) return { location: "legacy-main" };
	if (isRecord(value) && Object.keys(value).length === 1 && (value.location === "legacy-main" || value.location === "state-db")) return { location: value.location };
	throw new InvalidSharedAuthStoreOwnershipError(value);
}
/** Resolve the process-stable owner of the shared auth store. */
function resolveSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveAssistantStateSqlitePath(env));
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart Assistant.");
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, {
		env,
		path: databasePath
	}));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Fill the same process-stable owner cache without reading SQLite on the caller. */
async function resolveSharedAuthStoreOwnershipAsync(context) {
	const databasePath = context.admission.databasePath;
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	const value = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.sharedOwnership",
		input: { artifactPreserving: isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	const current = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (current) return current;
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart Assistant.");
	const ownership = parseSharedAuthStoreOwnership(value);
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Inspect copied state without pinning a runtime owner or changing SQLite artifacts. */
function inspectSharedAuthStoreOwnership(env = process.env) {
	return parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { env }, { artifactPreservingReadOnly: true }));
}
/** Update the process-stable cache after this process commits the ownership row. */
function noteCommittedSharedAuthStoreOwnership(ownership, env = process.env) {
	const databasePath = path.resolve(resolveAssistantStateSqlitePath(env));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
}
/** Reload shared auth ownership after an explicit out-of-process auth mutation. */
function reloadSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveAssistantStateSqlitePath(env));
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, {
		env,
		path: databasePath
	}));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Resolve the canonical shared auth database path. */
function resolveSharedAuthStorePath(env = process.env) {
	if (resolveSharedAuthStoreOwnership(env).location === "state-db") return resolveAssistantStateSqlitePath(env);
	return path.join(resolveSharedMainAuthAgentDir(env), "testclaw-agent.sqlite");
}
/**
* Resolve the path of the cross-agent, per-profile OAuth refresh coordination
* lock. The filename digests a JSON tuple of `[provider, profileId]` so it is
* filesystem-safe for arbitrary unicode/control-character inputs and always
* bounded in length. Tuple encoding makes it impossible to collide two distinct
* `(provider, profileId)` pairs by separator-sensitive string concatenation.
*
* This lock is the serialization point that prevents the `refresh_token_reused`
* storm when N agents share one OAuth profile (see issue #26322): every agent
* that attempts a refresh acquires this same file lock, so only one HTTP
* refresh is in-flight at a time and peers can adopt the resulting fresh
* credentials instead of racing against a single-use refresh token.
*
* The key intentionally includes `provider` so that two profiles that
* happen to share a `profileId` across providers (operator-renamed profile,
* test fixture, etc.) do not needlessly serialize against each other.
*/
function resolveOAuthRefreshLockPath(provider, profileId, env = process.env) {
	const safeId = `lock-${oauthLockPathDigest(JSON.stringify([provider, profileId]))}`;
	return path.join(resolveStateDir(env), "locks", "oauth-refresh", safeId);
}
function oauthLockPathDigest(value) {
	let left = 14695981039346656037n;
	let right = 11160318154034397263n;
	const prime = 1099511628211n;
	const mask = 18446744073709551615n;
	for (const byte of Buffer.from(value, "utf8")) {
		const octet = BigInt(byte);
		left = (left ^ octet) * prime & mask;
		right = (right ^ octet + 11400714819323198485n) * prime & mask;
	}
	return `${left.toString(16).padStart(16, "0")}${right.toString(16).padStart(16, "0")}`;
}
//#endregion
export { resolveSharedMainAuthAgentDir as S, readSharedAuthKvCell as _, resolveOAuthRefreshLockPath as a, closeAuthProfileReadPool as b, resolveSharedAuthStorePath as c, SHARED_STATE_STATE_KEY as d, SHARED_STORE_STATE_KEY as f, inspectAuthProfileJsonCell as g, inspectAgentAuthProfileJsonCellReadOnly as h, reloadSharedAuthStoreOwnership as i, PRIMARY_ROW_KEY as l, getAgentAuthProfileKysely as m, inspectSharedAuthStoreOwnership as n, resolveSharedAuthStoreOwnership as o, deleteAuthProfileJsonCell as p, noteCommittedSharedAuthStoreOwnership as r, resolveSharedAuthStoreOwnershipAsync as s, captureAuthProfileOwnerScope as t, SHARED_AUTH_STORE_STATE_KEY as u, writeAuthProfileJsonCell as v, isMissingDatabasePath as x, acquireAuthProfileReadDatabase as y };
