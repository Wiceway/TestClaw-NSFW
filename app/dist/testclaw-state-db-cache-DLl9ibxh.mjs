import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { r as isPathInside } from "./path-guards-0NKGHIHl.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { l as registerNodeSqliteKyselyQueryErrorHandler, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { i as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { i as isSqliteCorruptionError, p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-g2PTirPA.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as throwSqliteLifecycleErrors, i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-BtCcPgOj.mjs";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-BboyngJR.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-36gEREe5.mjs";
import { c as acquireStateDatabaseHandleExclusion, l as acquireStateDatabaseHandleLease, s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-CDYF24uv.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as registerLiveSqliteSnapshotOwner } from "./sqlite-live-snapshot-BbYpnZbv.mjs";
import { i as getAssistantDatabaseMaintenanceScope, o as isAssistantDatabaseMaintenanceResourceOwned, r as createAssistantStateDatabaseAsyncLifecycle, s as observeAssistantDatabaseMaintenanceResource } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import { d as readStableSqliteFileGeneration, f as sameSqliteFileGeneration, i as confirmSqliteFileIntegrity } from "./sqlite-integrity-BSZQ5Avg.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { t as assertAssistantStateDatabaseNotQuarantined } from "./testclaw-quarantine-store-BgTM1lrX.mjs";
import { n as assertSupportedStateSchemaVersion } from "./testclaw-state-db-schema-version-DOTBthQx.mjs";
import { t as assertExistingAssistantStateSchemaCacheAdmission } from "./testclaw-state-db-schema-policy-BQ7bZxNb.mjs";
import path from "node:path";
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readStableSqliteFileGeneration(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			for (;;) {
				const failure = failures.get(resolvedPath);
				if (!failure?.generation) return failure?.error;
				const current = await isCurrentGeneration(resolvedPath, failure.generation);
				if (failures.get(resolvedPath) !== failure) continue;
				if (!current) {
					failures.delete(resolvedPath);
					return;
				}
				return failure.error;
			}
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			if (generation && !generationMatchesPath(resolvedPath, generation)) {
				failures.delete(resolvedPath);
				return false;
			}
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const retain = (database, readOnly = false) => {
		const scope = getAssistantDatabaseMaintenanceScope();
		scope?.assertAdmission();
		operations.assertOpen(database.path);
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Assistant state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("Assistant state database native owner is retiring");
		if (!readOnly) observeAssistantDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isAssistantDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			retainFailedClose: () => operations.retainFailed(database)
		});
		scope?.own(reference, "shared-references", () => reference.release());
		return reference;
	};
	const findReadDatabase = (pathname) => {
		getAssistantDatabaseMaintenanceScope()?.assertAdmission();
		operations.assertOpen(pathname);
		const database = state.cachedDatabases.get(path.resolve(pathname));
		return database?.db.isOpen ? database : void 0;
	};
	const retainReadReference = (database) => {
		const reference = retain(database, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeAssistantDatabaseMaintenanceResource(database.db);
			},
			release() {
				reference.release();
				operations.touch(database);
			}
		};
	};
	return {
		retain: (database) => retain(database),
		retainForIndependentRead(pathname) {
			const database = findReadDatabase(pathname);
			return database ? retainReadReference(database) : void 0;
		},
		borrowForRead(pathname) {
			const database = findReadDatabase(pathname);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`Assistant state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	return { release() {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0 || !owner.retirement) {
			released = true;
			return;
		}
		owner.retiring = true;
		try {
			owner.retirement.retire();
		} catch (error) {
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		released = true;
	} };
}
//#endregion
//#region src/state/testclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && (database.db.isTransaction || borrowers.get(database.db)?.references.size || idleReferences.get(database.db)?.size)) {
					touch(database);
					return;
				}
				retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("Assistant state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-handle.ts
const handleLeases = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseHandleLeases"), () => /* @__PURE__ */ new WeakMap());
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Only native open failure with a released lease is an ordinary read failure. */
function openTrackedStateDatabaseResult(pathname, options) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		handleLeases.set(database, lease);
		return {
			status: "available",
			database
		};
	} catch (error) {
		lease.release();
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (!database.isOpen) {
			handleLeases.get(database)?.release();
			handleLeases.delete(database);
		}
	}
}
//#endregion
//#region src/state/testclaw-state-db-runtime-failure.ts
/** Runtime validation uses the cache's existing handles, version counters, and terminal latch. */
function createAssistantStateDatabaseRuntimeFailureOwner(owner) {
	const readDataVersion = (database) => {
		let statement = owner.statements.get(database);
		if (!statement) {
			statement = database.db.prepare("PRAGMA data_version");
			owner.statements.set(database, statement);
		}
		const row = statement.get();
		if (typeof row?.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
		return row.data_version;
	};
	return {
		closeTerminalFailure(pathname, error) {
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		recordPublishedVersion: (database) => {
			owner.dataVersions.set(database.db, readDataVersion(database));
		},
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const latched = owner.latch.get(resolvedPath);
			if (latched) return latched;
			const cached = owner.cachedDatabases.get(resolvedPath);
			if (!cached?.db.isOpen) return;
			try {
				const dataVersion = readDataVersion(cached);
				if (owner.dataVersions.get(cached.db) === dataVersion) return;
				assertSupportedStateSchemaVersion(cached.db, resolvedPath);
				owner.dataVersions.set(cached.db, dataVersion);
				return;
			} catch (error) {
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(cached);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(resolvedPath, failure);
				return failure;
			}
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-snapshot-owner.ts
function createAssistantStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "testclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("Assistant state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const testClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("testclaw.stateSnapshotOwners"), createAssistantStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/testclaw-state-db-cache.ts
const stateDatabaseLifecycle = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseLifecycle"), () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	cachedDataVersionStatements: /* @__PURE__ */ new WeakMap(),
	cachedDataVersions: /* @__PURE__ */ new WeakMap(),
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => runtimeFailures.closeTerminalFailure(pathname, error) }),
	asyncResources: createAssistantStateDatabaseAsyncLifecycle()
}), () => closeAssistantStateDatabaseAsync());
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, cachedDataVersionStatements, cachedDataVersions, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainAssistantStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireAssistantStateDatabaseHandle);
function notifyAssistantStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyAssistantStateDatabaseClosed(database) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
}
function requireAssistantStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const runtimeFailures = createAssistantStateDatabaseRuntimeFailureOwner({
	cachedDatabases,
	statements: cachedDataVersionStatements,
	dataVersions: cachedDataVersions,
	latch: terminalOpenLatch,
	evict: evictCachedAssistantStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyAssistantStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyAssistantStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerAssistantStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeAssistantStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getAssistantDatabaseMaintenanceScope()?.own(database.db, "shared-handles", () => {
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) retireAssistantStateDatabaseHandle(database, false);
	});
}
function closeUnpublishedAssistantStateDatabaseHandle(database) {
	const errors = closeAssistantStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainAssistantStateDatabase, borrowForRead: borrowAssistantStateDatabaseForAsyncRead, retainForIndependentRead: retainAssistantStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname) {
		assertAssistantStateDatabaseOpenAllowed(pathname);
		assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireAssistantStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeAssistantStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeAssistantStateDatabaseHandle(database, options), `Assistant state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	const errors = [];
	testClawStateSnapshotOwners.release(database.db);
	try {
		database.walMaintenance?.close(options);
	} catch (error) {
		errors.push(error);
	}
	try {
		clearNodeSqliteKyselyCacheForDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeTrackedStateDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	let cleanupPending = false;
	if (!database.db.isOpen) try {
		database.afterClose?.();
	} catch (error) {
		errors.push(error);
		cleanupPending = true;
	}
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyAssistantStateDatabaseClosed(database);
	closeAssistantStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictAssistantStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedAssistantStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishAssistantStateDatabase(database) {
	const { db, path: pathname } = database;
	const identity = asyncResources.publish(pathname);
	databaseIdentities.set(db, identity);
	runtimeFailures.recordPublishedVersion(database);
	cachedDatabases.set(pathname, database);
	touchStateDatabase(database);
	testClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyAssistantStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedAssistantStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedAssistantStateDatabase(pathname) {
	getAssistantDatabaseMaintenanceScope()?.assertAdmission();
	assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	const runtimeFailure = runtimeFailures.get(pathname);
	if (runtimeFailure) throw runtimeFailure;
	const database = cachedDatabases.get(path.resolve(pathname));
	if (database && borrowers.get(database.db)?.retiring) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
	if (database) touchStateDatabase(database);
	return database;
}
function getAssistantStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedAssistantStateDatabase(pathname);
	observeAssistantDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeAssistantStateDatabaseHandle(database);
	notifyAssistantStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale Assistant state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordAssistantStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearAssistantStateDatabaseOpenFailure(pathname) {
	const resolvedPath = path.resolve(pathname);
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyAssistantStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getAssistantStateDatabaseTerminalFailureAsync(context) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (_path, generation) => {
		const { inspectAssistantStateDatabase } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
		const matches = await inspectAssistantStateDatabase(context, {
			type: "database.generationMatches",
			input: { generation }
		});
		if (matches === void 0) throw new Error("Recorded shared-state database generation is unavailable");
		return matches;
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertAssistantStateDatabaseOpenAllowed(pathname) {
	const identity = asyncResources.identity(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	const resolvedPath = path.resolve(pathname);
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
}
function recordAssistantStateDatabaseLifecycleOpenError(pathname, error) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "open-error",
		path: path.resolve(pathname),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertAssistantStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertAssistantStateDatabaseOpenAllowed(pathname);
	assertAssistantStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure);
}
/** Explicit retirement can checkpoint WAL and must join the lifecycle writer gate. */
function retireAssistantStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	const { busyTimeoutMs = TESTCLAW_SQLITE_BUSY_TIMEOUT_MS, ...closeOptions } = options ?? {};
	const coordinator = borrowedOwner?.closeCoordinator ?? acquireStateDatabaseCoordinator({
		databasePath: database.path,
		busyTimeoutMs,
		keepAlive: false
	});
	if (borrowedOwner) borrowedOwner.closeCoordinator = coordinator;
	try {
		runWithSqliteCoordinator(coordinator, "state database retirement", () => {
			const wasCached = cachedDatabases.get(database.path)?.db === database.db;
			if (retireAdmission) asyncResources.invalidate(database.path);
			const errors = closeAssistantStateDatabaseHandle(database, closeOptions);
			if (wasCached && retireAdmission) try {
				notifyAssistantStateDatabaseClosed(database);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, `Assistant state database cleanup failed for ${database.path}.`);
		});
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	} finally {
		if (borrowedOwner && coordinator.closed) borrowedOwner.closeCoordinator = void 0;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireAssistantStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireAssistantStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "Assistant state database cleanup failed.");
	return found;
}
/** Close one cached shared state database handle by exact pathname. */
function closeAssistantStateDatabaseByPath(pathname, options) {
	return retireAssistantStateDatabaseHandles(path.resolve(pathname), options, asyncResources.identity(pathname));
}
/** Close all cached shared state database handles. */
function closeAssistantStateDatabase(options) {
	retireAssistantStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
function registerAssistantStateDatabaseAsyncResource(resource) {
	return asyncResources.register(resource);
}
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureAssistantStateDatabaseReadAdmission = asyncResources.capture;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishAssistantStateDatabaseWorkerAdmission(admission) {
	admission.assertCurrent();
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Drain worker resources before native checkpoint/close at one exact path. */
function closeAssistantStateDatabaseByPathAsync(pathname, options) {
	const resolvedPath = path.resolve(pathname);
	return asyncResources.close(resolvedPath, (identity) => retireAssistantStateDatabaseHandles(resolvedPath, options, identity));
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeAssistantStateDatabaseAsync(options) {
	await asyncResources.close(void 0, () => retireAssistantStateDatabaseHandles(void 0, options));
}
/** Test whether a cached shared state database handle is still open, optionally at one path. */
function isAssistantStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/** Report the live owner's last observation without opening or querying SQLite. */
function readAssistantStateWalHealth() {
	const database = cachedDatabases.get(path.resolve(resolveAssistantStateSqlitePath()));
	return database?.db.isOpen ? database.walMaintenance.health : void 0;
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
function closeAssistantStateDatabaseForTest() {
	closeAssistantStateDatabase();
	terminalOpenLatch.clearAll();
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const testClawStateDatabaseCache = {
	assertAssistantStateDatabaseFreshOpenAllowedAtPath,
	assertAssistantStateDatabaseOpenAllowed,
	clearAssistantStateDatabaseOpenFailure,
	closeAssistantStateDatabase,
	closeAssistantStateDatabaseByPath,
	closeAssistantStateDatabaseForTest,
	closeAssistantStateDatabaseHandle,
	closeUnpublishedAssistantStateDatabaseHandle,
	closeStaleCachedAssistantStateDatabase,
	evictCachedAssistantStateDatabase,
	evictAssistantStateDatabaseAfterCorruption,
	getCachedAssistantStateDatabase,
	getAssistantStateDatabaseRuntimeFailure: runtimeFailures.get,
	getAssistantStateDatabaseIfOpenAtPath,
	getKnownAssistantStateDatabaseIdentity: asyncResources.knownIdentity,
	isAssistantStateDatabaseOpen,
	publishAssistantStateDatabase,
	recordAssistantStateDatabaseOpenFailure,
	recordAssistantStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
/** Drain local cached owners before excluding participating foreign handles for file removal. */
async function acquireAssistantStateDatabaseFileExclusion(pathname) {
	const databasePath = path.resolve(pathname);
	const releaseAdmission = asyncResources.holdExclusion(databasePath);
	let lifecycle;
	let handles;
	try {
		await closeAssistantStateDatabaseByPathAsync(databasePath);
		lifecycle = acquireStateDatabaseCoordinator({
			databasePath,
			busyTimeoutMs: 0
		});
		handles = acquireStateDatabaseHandleExclusion({
			databasePath,
			busyTimeoutMs: 0
		});
	} catch (error) {
		lifecycle?.release();
		releaseAdmission();
		throw error;
	}
	const closeWriter = (errors) => {
		const database = cachedDatabases.get(databasePath);
		if (database) try {
			handles.runWithCanonicalWrites(handles.assertCurrent, () => {
				errors.push(...closeAssistantStateDatabaseHandle(database));
			});
			notifyAssistantStateDatabaseClosed(database);
		} catch (error) {
			errors.push(error);
		}
	};
	return {
		assertCurrent: handles.assertCurrent,
		runWithSourceReads: handles.runWithSourceReads,
		async bindCaptured(assertCurrent, operation) {
			const errors = [];
			let result;
			try {
				result = handles.runWithCanonicalWrites(assertCurrent, operation);
			} catch (error) {
				errors.push(error);
			}
			closeWriter(errors);
			if (result !== void 0) {
				errors.push(/* @__PURE__ */ new Error("checkpoint binding must complete synchronously with undefined"));
				try {
					await Promise.resolve(result);
				} catch (error) {
					errors.push(error);
				}
			}
			try {
				assertCurrent();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "checkpoint binding or writer closure failed", errors[0]);
		},
		release: () => {
			try {
				handles.release();
			} finally {
				lifecycle?.release();
				releaseAdmission();
			}
		}
	};
}
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmAssistantStateDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	await closeAssistantStateDatabaseByPathAsync(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
//#endregion
export { closeTrackedStateDatabase as C, createSqliteTerminalOpenLatch as E, testClawStateDatabaseCache as S, openTrackedStateDatabaseResult as T, registerAssistantStateDatabaseLifecycleListener as _, closeAssistantStateDatabase as a, retainAssistantStateDatabaseForIdle as b, closeAssistantStateDatabaseByPathAsync as c, getAssistantStateDatabaseTerminalFailureAsync as d, isAssistantStateDatabaseOpen as f, registerAssistantStateDatabaseAsyncResource as g, recordAssistantStateDatabaseOpenFailure as h, clearAssistantStateDatabaseOpenFailure as i, closeAssistantStateDatabaseForTest as l, readAssistantStateWalHealth as m, borrowAssistantStateDatabaseForAsyncRead as n, closeAssistantStateDatabaseAsync as o, publishAssistantStateDatabaseWorkerAdmission as p, captureAssistantStateDatabaseReadAdmission as r, closeAssistantStateDatabaseByPath as s, acquireAssistantStateDatabaseFileExclusion as t, confirmAssistantStateDatabaseIntegrity as u, requireAssistantStateDatabaseIdentity as v, openTrackedStateDatabase as w, retainAssistantStateDatabaseForIndependentRead as x, retainAssistantStateDatabase as y };
