import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import "./session-key-AvQIavYt.js";
import { n as disposeNodeSqliteDependents } from "./kysely-sync-cache-state-C8TndyjF.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { c as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-coordinator-olf_92pI.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { f as setSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { F as runInSqliteMaintenanceContext, P as registerSqliteCacheExitClose, U as readExistingAgentSchemaMeta } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { i as getAssistantDatabaseMaintenanceScope, s as observeAssistantDatabaseMaintenanceResource } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { $ as findAssistantAgentDatabaseIdentity, P as clearAssistantAgentIntegrityVerification, Qt as createSqliteTerminalOpenLatch, et as isAssistantAgentDatabasePathCurrent, tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import "./testclaw-state-db-BAeysXj_.js";
import { F as assertSupportedAgentSchemaVersion } from "./testclaw-agent-db-schema-helpers-BWt3HuU6.js";
import { c as revokeAgentDatabaseResources, r as matchesAgentDatabaseClose, t as drainAgentDatabaseResources } from "./testclaw-agent-db-resources-vcN3N2Fz.js";
import { S as releaseAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-Bk2FCp74.js";
import { p as releaseAssistantAgentDatabaseLease } from "./testclaw-agent-db-lease-D4ARpQMO.js";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/state/testclaw-agent-db-lifecycle.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
const TESTCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
const cache = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseLifecycle"), () => ({
	databases: /* @__PURE__ */ new Map(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	incognito: /* @__PURE__ */ new WeakSet(),
	generation: 0,
	failures: /* @__PURE__ */ new Map(),
	leases: /* @__PURE__ */ new Map(),
	terminal: createSqliteTerminalOpenLatch({ closeByPath: (pathname) => closeAssistantAgentDatabaseByPath(pathname) }),
	unregisterExitClose: null,
	pending: /* @__PURE__ */ new Map(),
	activePending: /* @__PURE__ */ new Set(),
	retainedCloses: /* @__PURE__ */ new Set()
}));
/** Runtime reads and opens share the generation-aware process-local damage latch. */
function assertAgentDatabaseTerminalOpenAllowed(pathname) {
	const failure = cache.terminal.get(pathname);
	if (failure) throw failure;
}
function logResourceCloseFailure(pathname, error) {
	agentDbLog.warn("Agent database resource close failed", {
		path: pathname,
		error
	});
}
/** Each physical-open generator owns these checkpoints across any integrity await. */
function startAgentDatabaseOpenTiming(agentId, pathname, admissionMode, diagnostics) {
	const startedAt = performance.now();
	let elapsedMs = 0;
	const phaseDurationsMs = {
		open: 0,
		validation: 0,
		configuration: 0,
		schema: 0,
		registration: 0
	};
	return (phase) => {
		const completedMs = Math.floor(performance.now() - startedAt);
		phaseDurationsMs[phase] = completedMs - elapsedMs;
		elapsedMs = completedMs;
		if (phase === "registration" && elapsedMs >= TESTCLAW_AGENT_DB_SLOW_OPEN_MS) agentDbLog.warn("slow Assistant agent database open", {
			agentId,
			elapsedMs,
			path: pathname,
			pid: process.pid,
			threadId,
			isMainThread,
			admissionMode,
			phaseDurationsMs,
			...diagnostics,
			thresholdMs: TESTCLAW_AGENT_DB_SLOW_OPEN_MS
		});
	};
}
function retainFailedAgentDatabaseClose(agentId, pathname, close) {
	const retained = {
		agentId,
		path: pathname,
		close: () => {
			close();
			cache.retainedCloses.delete(retained);
		}
	};
	cache.retainedCloses.add(retained);
	getAssistantDatabaseMaintenanceScope()?.own(retained, "agent-handles", retained.close);
	cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeAssistantAgentDatabases);
}
function revokePendingAgentDatabaseOpen(pathname, expectedAgentId) {
	for (const pending of cache.activePending) if (pending.path === pathname && (expectedAgentId === void 0 || pending.agentId === expectedAgentId)) pending.controller.abort(/* @__PURE__ */ new Error(`Agent database open was revoked: ${pathname}`));
}
function retainAgentDatabase(db) {
	observeAssistantDatabaseMaintenanceResource(db);
	const borrowers = cache.borrowers.get(db) ?? /* @__PURE__ */ new Set();
	const borrower = {};
	borrowers.add(borrower);
	cache.borrowers.set(db, borrowers);
	return () => {
		if (borrowers.delete(borrower) && borrowers.size === 0) cache.idleTimers.get(db)?.refresh();
	};
}
/** Activity and final borrower release start the same idle window. */
function refreshAgentDatabaseIdleTimer(database) {
	if (cache.incognito.has(database)) return;
	const existing = cache.idleTimers.get(database.db);
	if (existing) {
		existing.refresh();
		return;
	}
	const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		if (cache.databases.get(database.path) !== database) {
			cache.idleTimers.delete(database.db);
			return;
		}
		if (database.db.isOpen && cache.borrowers.get(database.db)?.size) return;
		if (database.db.isOpen && database.db.isTransaction) {
			timer.refresh();
			return;
		}
		try {
			closeCachedAssistantAgentDatabase(database, { eviction: true });
			cache.databases.delete(database.path);
			cache.failures.delete(database.path);
			if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
				cache.unregisterExitClose?.();
				cache.unregisterExitClose = null;
			}
		} catch (error) {
			logResourceCloseFailure(database.path, error);
			timer.refresh();
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	cache.idleTimers.set(database.db, timer);
}
/** Dispose only this publication; a later admission at the same path is independent. */
function closeMaintenanceAgentDatabase(database) {
	if (cache.databases.get(database.path) !== database) return;
	closeCachedAssistantAgentDatabase(database);
	cache.databases.delete(database.path);
	cache.failures.delete(database.path);
	if (cache.incognito.has(database)) cache.generation += 1;
}
function closeCachedAssistantAgentDatabase(database, options = {}) {
	const lease = cache.leases.get(database.path);
	const alreadyClosed = !database.db.isOpen;
	const priorCheckpointError = database.walMaintenance.health?.state === "error";
	let clean;
	let retainRuntimeProof;
	try {
		disposeNodeSqliteDependents(database.db);
		if (database.walMaintenance.close(options.eviction ? { checkpointMode: "PASSIVE" } : void 0) && !cache.failures.has(database.path) && isAssistantAgentDatabasePathCurrent(database)) {
			const { identity } = readAssistantAgentDatabaseIdentity(database);
			if (typeof identity === "string") clean = {
				path: database.path,
				identity
			};
		}
		retainRuntimeProof = !cache.failures.has(database.path) && (alreadyClosed ? !priorCheckpointError : database.walMaintenance.health?.state === "blocked" && isAssistantAgentDatabasePathCurrent(database));
		if (database.db.isOpen) database.db.close();
	} catch (error) {
		if (lease) clearAssistantAgentIntegrityVerification(database.path, lease.env);
		throw error;
	}
	if (lease) {
		releaseAssistantAgentDatabaseLease(lease.leaseId, { env: lease.env }, clean ?? (retainRuntimeProof ? "uncheckpointed" : void 0));
		cache.leases.delete(database.path);
	}
	releaseAgentDeletionDatabaseCleanup(database);
	clearTimeout(cache.idleTimers.get(database.db));
	cache.idleTimers.delete(database.db);
}
/** Close one cached agent database identified by its exact resolved pathname. */
function closeAssistantAgentDatabaseByPath(pathname, expectedAgentId) {
	const resolvedPath = path.resolve(pathname);
	revokeAgentDatabaseResources({
		path: resolvedPath,
		agentId: expectedAgentId
	}, logResourceCloseFailure);
	revokePendingAgentDatabaseOpen(resolvedPath, expectedAgentId);
	for (const retained of cache.retainedCloses) if (retained.path === resolvedPath && (expectedAgentId === void 0 || retained.agentId === expectedAgentId)) retained.close();
	const database = cache.databases.get(resolvedPath);
	if (!database || expectedAgentId !== void 0 && database.agentId !== expectedAgentId) return false;
	const incognito = cache.incognito.has(database);
	closeCachedAssistantAgentDatabase(database);
	cache.databases.delete(resolvedPath);
	cache.failures.delete(resolvedPath);
	if (incognito) cache.generation += 1;
	if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
		cache.unregisterExitClose?.();
		cache.unregisterExitClose = null;
	}
	return true;
}
/**
* Converge a terminating worker's cached handle and durable lease without
* turning an already committed worker result into an operation failure.
* Callers own a bounded retry policy and must surface an unsettled result.
*/
function settleAssistantAgentDatabaseWorkerClose(pathname) {
	const resolvedPath = path.resolve(pathname);
	const errors = [];
	const database = cache.databases.get(resolvedPath);
	if (database) {
		try {
			closeCachedAssistantAgentDatabase(database);
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
		if (database.db.isOpen) try {
			database.db.close();
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
		if (!database.db.isOpen) {
			clearTimeout(cache.idleTimers.get(database.db));
			cache.idleTimers.delete(database.db);
			const incognito = cache.incognito.has(database);
			cache.databases.delete(resolvedPath);
			cache.failures.delete(resolvedPath);
			if (incognito) cache.generation += 1;
			if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
				cache.unregisterExitClose?.();
				cache.unregisterExitClose = null;
			}
		}
	}
	if (!cache.databases.get(resolvedPath)?.db.isOpen) {
		const lease = cache.leases.get(resolvedPath);
		if (lease) try {
			releaseAssistantAgentDatabaseLease(lease.leaseId, { env: lease.env });
			cache.leases.delete(resolvedPath);
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
	}
	return {
		errors,
		settled: !cache.databases.get(resolvedPath)?.db.isOpen && !cache.leases.has(resolvedPath)
	};
}
/** Commit receipts invalidate every current handle of the captured physical database. */
function invalidateAssistantAgentWritableProjections(databaseIdentity, invalidate) {
	for (const database of cache.databases.values()) if (findAssistantAgentDatabaseIdentity(database)?.identity === databaseIdentity) invalidate(database.db);
}
/** Close cached agent handles, optionally restricted to one runtime root. */
function closeAssistantAgentDatabases(rootPath) {
	revokeAgentDatabaseResources({ rootPath }, logResourceCloseFailure);
	for (const pathname of cache.pending.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) revokePendingAgentDatabaseOpen(pathname);
	for (const retained of cache.retainedCloses) if (rootPath === void 0 || isPathInside(rootPath, retained.path)) retained.close();
	for (const pathname of cache.databases.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) closeAssistantAgentDatabaseByPath(pathname);
}
/** Drain native opens before a lifecycle owner releases shared state or removes its root. */
async function closeAssistantAgentDatabasesAsync(rootPath) {
	for (const owner of cache.activePending) if (rootPath === void 0 || isPathInside(rootPath, owner.path)) revokePendingAgentDatabaseOpen(owner.path);
	await drainAgentDatabaseResources({ rootPath }, async () => {
		while (true) {
			const pending = [...cache.activePending].filter((owner) => rootPath === void 0 || isPathInside(rootPath, owner.path));
			if (pending.length === 0) break;
			for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path);
			await Promise.allSettled(pending.map((owner) => owner.promise));
		}
		closeAssistantAgentDatabases(rootPath);
	});
}
/** Drain the exact retained owner before deletion, quarantine, or file replacement. */
async function closeAssistantAgentDatabaseByPathAsync(pathname, expectedAgentId) {
	const selection = {
		path: path.resolve(pathname),
		agentId: expectedAgentId
	};
	revokePendingAgentDatabaseOpen(selection.path, expectedAgentId);
	return drainAgentDatabaseResources(selection, async () => {
		while (true) {
			const pending = [...cache.activePending].filter((owner) => matchesAgentDatabaseClose(selection, owner));
			if (pending.length === 0) break;
			for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path, expectedAgentId);
			await Promise.allSettled(pending.map((owner) => owner.promise));
		}
		return closeAssistantAgentDatabaseByPath(selection.path, expectedAgentId);
	});
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectAssistantAgentDatabaseOwner(pathname) {
	let db;
	try {
		const resolvedPath = path.resolve(pathname);
		const opened = cache.databases.get(resolvedPath);
		if (opened?.db.isOpen && !cache.failures.has(resolvedPath)) {
			assertSupportedAgentSchemaVersion(opened.db, pathname);
			refreshAgentDatabaseIdleTimer(opened);
			return {
				status: "owned",
				agentId: opened.agentId
			};
		}
		db = openNodeSqliteDatabase(pathname, { readOnly: true });
		setSqliteBusyTimeout(db, TESTCLAW_SQLITE_BUSY_TIMEOUT_MS);
		assertSupportedAgentSchemaVersion(db, pathname);
		const existing = readExistingAgentSchemaMeta(db);
		if (!existing) return { status: "unowned" };
		if (existing.role !== "agent" || !existing.agentId) return { status: "unreadable" };
		return {
			status: "owned",
			agentId: normalizeAgentId(existing.agentId)
		};
	} catch {
		return { status: "unreadable" };
	} finally {
		db?.close();
	}
}
/** Lists process-held incognito databases without opening new sentinel handles. */
function listOpenIncognitoAgentDatabases() {
	return [...cache.databases.values()].filter((database) => database.db.isOpen && cache.incognito.has(database)).map((database) => ({
		agentId: database.agentId,
		storePath: database.path
	})).toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.storePath.localeCompare(right.storePath));
}
/** Borrow committed process-held facts without opening or querying a private store. */
function getOpenIncognitoAgentDatabase(agentId, pathname) {
	const database = cache.databases.get(path.resolve(pathname));
	return database?.db.isOpen && database.agentId === normalizeAgentId(agentId) && cache.incognito.has(database) ? database : void 0;
}
/** Return the generation of process-held incognito database membership. */
function readOpenIncognitoAgentDatabaseGeneration() {
	return cache.generation;
}
/** Returns whether this exact process-held database is incognito/in-memory. */
function isIncognitoAssistantAgentDatabase(database) {
	return cache.incognito.has(database);
}
//#endregion
export { retainFailedAgentDatabaseClose as _, closeAssistantAgentDatabaseByPath as a, startAgentDatabaseOpenTiming as b, closeAssistantAgentDatabasesAsync as c, invalidateAssistantAgentWritableProjections as d, isIncognitoAssistantAgentDatabase as f, retainAgentDatabase as g, refreshAgentDatabaseIdleTimer as h, closeMaintenanceAgentDatabase as i, getOpenIncognitoAgentDatabase as l, readOpenIncognitoAgentDatabaseGeneration as m, cache as n, closeAssistantAgentDatabaseByPathAsync as o, listOpenIncognitoAgentDatabases as p, closeCachedAssistantAgentDatabase as r, closeAssistantAgentDatabases as s, assertAgentDatabaseTerminalOpenAllowed as t, inspectAssistantAgentDatabaseOwner as u, revokePendingAgentDatabaseOpen as v, settleAssistantAgentDatabaseWorkerClose as y };
