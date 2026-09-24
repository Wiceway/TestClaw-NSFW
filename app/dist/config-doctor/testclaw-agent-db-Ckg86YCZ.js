import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import "./kysely-sync-CICmT-bh.js";
import { c as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { c as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-coordinator-olf_92pI.js";
import { u as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { a as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { A as configureSqliteConnectionPragmas, F as runInSqliteMaintenanceContext, I as registerDeferredSqliteWalWriteAdmission, L as registerSqliteWalWriteAdmission, P as registerSqliteCacheExitClose, R as createSqliteWalReclamationResult, U as readExistingAgentSchemaMeta, j as configureSqlitePreSchemaPragmas } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-BppRXydv.js";
import { i as getAssistantDatabaseMaintenanceScope, s as observeAssistantDatabaseMaintenanceResource } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { a as confirmSqliteFileIntegrity, c as runSqliteIntegrityOperationSync, o as isTerminalSqliteIntegrityError, s as runSqliteIntegrityCheckSync } from "./error-utils-B4pDpAz2.js";
import { $ as findAssistantAgentDatabaseIdentity, F as clearAssistantDatabaseQuarantine, G as getAssistantAgentDatabaseValidation, H as adoptAssistantAgentDatabaseValidation, J as invalidateAssistantAgentDatabaseValidation, Q as createAssistantAgentDatabaseClaim, R as readAssistantDatabaseQuarantineFailure, W as clearAssistantAgentDatabaseValidationCache, Z as setAssistantAgentDatabaseValidation, et as isAssistantAgentDatabasePathCurrent, nt as registerAssistantAgentDatabaseIdentity, ot as classifyAssistantAgentDatabaseReadError, tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import { r as quarantineOrphanedSqliteSidecars } from "./sqlite-files-Bm4Vx3bT.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath, n as assertIncognitoAgentDatabasePathAvailable, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import "./testclaw-state-db-BAeysXj_.js";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { F as assertSupportedAgentSchemaVersion, N as assertCanonicalAgentPersistenceVersion, P as assertExistingAgentSchemaOwner } from "./testclaw-agent-db-schema-helpers-BWt3HuU6.js";
import { i as matchesAgentDatabaseReadCandidatePath, s as registerAssistantAgentDatabaseSyncResource } from "./testclaw-agent-db-resources-vcN3N2Fz.js";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-D08lnQbi.js";
import { _ as assertAgentDeletionCleanupAliases, b as getAgentDeletionDatabaseCleanup, o as readAgentDeletionJournal, v as assertAgentDeletionDatabaseCleanupAccess, x as registerAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-Bk2FCp74.js";
import { a as ensureAgentSchema, d as withSqliteIntegrityWorkerScope, i as agentDatabaseIntegrityBeforeMutationSteps, l as ensureAssistantAgentDatabasePermissions, u as assertSqliteIntegrityInWorker } from "./testclaw-agent-db-maintenance-DEefvrFC.js";
import { a as assertNoAssistantAgentDatabaseLeases, c as claimAssistantAgentDatabaseLease, f as recordAssistantAgentDatabaseIntegrityVerified, h as runWithAgentDatabaseMaintenanceAuthority, l as hasAgentDatabaseMaintenanceAuthority, p as releaseAssistantAgentDatabaseLease, s as assertAssistantAgentDatabaseLease, t as AGENT_DATABASE_MAINTENANCE_LEASE } from "./testclaw-agent-db-lease-D4ARpQMO.js";
import { _ as retainFailedAgentDatabaseClose, a as closeAssistantAgentDatabaseByPath, b as startAgentDatabaseOpenTiming, c as closeAssistantAgentDatabasesAsync, g as retainAgentDatabase, h as refreshAgentDatabaseIdleTimer, i as closeMaintenanceAgentDatabase, n as cache, o as closeAssistantAgentDatabaseByPathAsync, r as closeCachedAssistantAgentDatabase, s as closeAssistantAgentDatabases, t as assertAgentDatabaseTerminalOpenAllowed, v as revokePendingAgentDatabaseOpen } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { a as unregisterAssistantAgentDatabase, i as registerAssistantAgentDatabase, r as isSameAssistantAgentDatabasePath } from "./testclaw-agent-db-registry-DgP56LUX.js";
import { n as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-fcqqlXn0.js";
import { t as requestAssistantAgentDatabaseQuickCheck } from "./testclaw-database-verify-BOvf_LXB.js";
import { t as withAssistantStateLease } from "./testclaw-state-lease-C24liE0k.js";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isMainThread } from "node:worker_threads";
//#region src/state/testclaw-agent-db-readonly-open.ts
function readAssistantAgentDatabase(database, operation) {
	try {
		return {
			found: true,
			value: operation(database)
		};
	} catch (error) {
		throw sqlitePrimaryResultCode(error) === 1 ? classifyAssistantAgentDatabaseReadError(database.db, error) : error;
	}
}
/** Recheck committed admission facts before using an existing read-only connection. */
function hasAssistantAgentReadOnlySchema(database) {
	const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
	assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
	const schemaMeta = readExistingAgentSchemaMeta(database.db);
	if (!schemaMeta) return false;
	assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
	return true;
}
/** Fresh-only callers do not need the writable runtime's process-held connection cache. */
function withFreshAssistantAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const opened = openAssistantAgentDatabaseReadOnly(options, behavior);
	if (!opened.found) return opened;
	try {
		return readAssistantAgentDatabase(opened.database, operation);
	} finally {
		opened.database.close();
	}
}
/** Open one existing agent database without creating, registering, migrating, or adopting it. */
function openAssistantAgentDatabaseReadOnly(options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveAssistantAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoAssistantAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	if (!fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	const db = openNodeSqliteDatabase(pathname, {
		readOnly: true,
		timeout: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
		...behavior.allowExtension ? { allowExtension: true } : {}
	});
	let closed = false;
	const close = () => {
		if (closed) return;
		clearNodeSqliteKyselyCacheForDatabase(db);
		if (db.isOpen) db.close();
		closed = true;
	};
	try {
		registerAssistantAgentDatabaseIdentity(db);
		const database = {
			agentId,
			db,
			path: pathname,
			close
		};
		if (!hasAssistantAgentReadOnlySchema(database)) {
			close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		return {
			found: true,
			database
		};
	} catch (error) {
		close();
		throw error;
	}
}
//#endregion
//#region src/state/testclaw-agent-db-readonly-scope.ts
const readOnlyScope = new AsyncLocalStorage();
const log = createSubsystemLogger("state/agent-db");
const retainedScopes = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseReadOnlyScopes"), () => ({
	paths: /* @__PURE__ */ new Map(),
	active: /* @__PURE__ */ new Set()
}));
/** One retained connection, revoked by its caller, database lifecycle, or idle expiry. */
var AssistantAgentDatabaseReadOnlyScope = class {
	constructor(cached = false) {
		this.cached = cached;
		this.borrowers = 0;
		this.closing = false;
	}
	get hasRetainedConnection() {
		return this.database !== void 0;
	}
	invalidateProjection(databaseIdentity, invalidate) {
		if (this.database && findAssistantAgentDatabaseIdentity(this.database)?.identity === databaseIdentity) invalidate(this.database.db);
	}
	closeIfIdle() {
		if (this.borrowers === 0 && (!this.database?.db.isOpen || !this.database.db.isTransaction)) this.discardConnection();
	}
	close() {
		this.closing = true;
		clearTimeout(this.idleTimer);
		this.idleTimer = void 0;
		this.database?.close();
		this.database = void 0;
		this.borrowers = 0;
		if (this.target && retainedScopes.paths.get(this.target.path) === this) retainedScopes.paths.delete(this.target.path);
		this.target = void 0;
		this.unregisterResource?.();
		this.unregisterResource = void 0;
		retainedScopes.active.delete(this);
		if (retainedScopes.active.size === 0) {
			retainedScopes.unregisterExit?.();
			retainedScopes.unregisterExit = void 0;
		}
		this.closing = false;
	}
	discardConnection() {
		const target = this.target;
		this.close();
		if (!this.cached) this.target = target;
	}
	touch() {
		if (!this.database) return;
		if (this.idleTimer) {
			this.idleTimer.refresh();
			return;
		}
		this.idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			this.idleTimer = void 0;
			try {
				this.closeIfIdle();
			} catch (error) {
				log.warn("Idle agent read-only database cleanup failed", {
					path: this.database?.path,
					error
				});
			} finally {
				this.touch();
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		this.idleTimer.unref();
	}
	run(target, operation) {
		if (this.target?.agentId !== target.agentId || this.target.path !== target.path) this.close();
		this.target = target;
		return readOnlyScope.run(this, operation);
	}
	matches(agentId, pathname) {
		return this.target?.agentId === agentId && this.target.path === pathname;
	}
	closeMatching(candidates) {
		const target = this.target;
		if (target && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, target.path))) this.close();
	}
	acquire(options) {
		if (this.database && !isAssistantAgentDatabasePathCurrent(this.database)) this.discardConnection();
		if (!this.database) {
			let opened;
			try {
				opened = openAssistantAgentDatabaseReadOnly(options);
			} catch (error) {
				this.discardConnection();
				throw error;
			}
			if (!opened.found) {
				this.discardConnection();
				return opened;
			}
			this.database = opened.database;
			this.target = {
				agentId: this.database.agentId,
				path: this.database.path
			};
			try {
				this.unregisterResource = registerAssistantAgentDatabaseSyncResource({
					...this.target,
					revoke: () => this.close(),
					close: () => this.close()
				});
				enableNodeSqliteKyselyStatementCache(this.database.db);
				retainedScopes.active.add(this);
				if (this.cached) retainedScopes.paths.set(this.database.path, this);
				retainedScopes.unregisterExit ??= registerSqliteCacheExitClose(() => {
					for (const scope of retainedScopes.active) scope.close();
				});
			} catch (error) {
				this.discardConnection();
				throw error;
			}
		} else if (!hasAssistantAgentReadOnlySchema(this.database)) {
			this.discardConnection();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		const requestedAgentId = normalizeAgentId(options.agentId);
		if (this.database.agentId !== requestedAgentId) throw new Error(`Assistant agent database ${this.database.path} belongs to agent ${this.database.agentId}; requested agent ${requestedAgentId}.`);
		observeAssistantDatabaseMaintenanceResource(this.unregisterResource);
		this.touch();
		return {
			found: true,
			database: this.database
		};
	}
	releaseBorrow(database) {
		if (this.database !== database) return;
		this.borrowers--;
		if (this.cached && this.borrowers === 0 && this.database && (!this.database.db.isOpen || this.database.db.isTransaction)) this.discardConnection();
		else this.touch();
	}
	assertUsable() {
		if (this.closing) throw new Error("Agent read-only database native cleanup is pending");
	}
	retain(options) {
		this.assertUsable();
		const opened = this.database?.db.isOpen && this.database.db.isTransaction ? openAssistantAgentDatabaseReadOnly(options) : this.acquire(options);
		if (!opened.found) return opened;
		const { database } = opened;
		const shared = database === this.database;
		if (shared) this.borrowers++;
		return {
			found: true,
			database,
			claim: createAssistantAgentDatabaseClaim(database, () => {
				if (shared) this.releaseBorrow(database);
				else database.close();
			})
		};
	}
	read(operation, options) {
		this.assertUsable();
		if (this.database?.db.isOpen && this.database.db.isTransaction) return withFreshAssistantAgentDatabaseReadOnly(operation, options);
		const opened = this.acquire(options);
		if (!opened.found) return opened;
		this.borrowers++;
		try {
			return readAssistantAgentDatabase(opened.database, operation);
		} catch (error) {
			if (this.cached && this.borrowers === 1) this.discardConnection();
			throw error;
		} finally {
			this.releaseBorrow(opened.database);
		}
	}
};
function cachedScope(options) {
	let scope = retainedScopes.paths.get(options.path);
	if (!scope) {
		scope = new AssistantAgentDatabaseReadOnlyScope(true);
		scope.run(options, () => {});
		retainedScopes.paths.set(options.path, scope);
	}
	return scope;
}
/** Committed worker receipts invalidate projections on retained readers without running SQL. */
function invalidateAssistantAgentReadOnlyProjections(databaseIdentity, invalidate) {
	for (const scope of retainedScopes.active) scope.invalidateProjection(databaseIdentity, invalidate);
}
/** Writable admission retires an idle reader before opening the same physical file. */
function closeIdleAssistantAgentDatabaseReadOnly(pathname) {
	retainedScopes.paths.get(pathname)?.closeIfIdle();
}
function retainCachedAssistantAgentDatabaseReadOnly(options) {
	return cachedScope(options).retain(options);
}
/** Reuse the caller's matching read scope, or this thread's idle-expiring reader. */
function withScopedAssistantAgentDatabaseReadOnly(operation, options, behavior = {}) {
	if (behavior.allowExtension) return withFreshAssistantAgentDatabaseReadOnly(operation, options, behavior);
	const scope = readOnlyScope.getStore();
	return (scope?.matches(options.agentId, options.path) ? scope : cachedScope(options)).read(operation, options);
}
//#endregion
//#region src/state/testclaw-agent-db-admission.ts
/** Refusal must unwind ownership without entering corruption repair or changing its caller error. */
function assertAgentDatabaseOpenAuthority(operation, assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		const refusal = new Error("Agent database open authority was refused", { cause: error });
		try {
			operation.throw(refusal);
		} catch (cleanupError) {
			if (cleanupError !== refusal) throw new AggregateError([error, cleanupError], `Agent database authority and cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`, { cause: cleanupError });
		}
		throw error;
	}
}
function assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent) {
	pending.controller.signal.throwIfAborted();
	assertAgentDatabaseAdmitted(database.agentId, { env: options.env });
	if (cache.databases.get(pending.path) !== database || !database.db.isOpen) throw new Error(`Agent database closed before its admitted operation: ${pending.path}`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	assertCurrent?.();
}
/** Bind both admission drivers to the canonical private database-open generator. */
function createAssistantAgentDatabaseAdmissionOwner(openSteps) {
	/** The initiating caller guards its physical open; each coalesced caller guards its own operation. */
	function withAssistantAgentDatabaseAsync(inputOptions, operation, assertCurrent) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent);
		const scope = getAssistantDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	function runAgentDatabaseAsync(inputOptions, operation, assertCurrent) {
		try {
			assertCurrent?.();
		} catch (error) {
			return Promise.reject(error);
		}
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveAssistantAgentSqlitePath({
			...options,
			agentId
		});
		const existing = cache.pending.get(pathname);
		if (existing?.agentId !== void 0 && existing.agentId !== agentId) return Promise.reject(/* @__PURE__ */ new Error(`Agent database ${pathname} is opening for ${existing.agentId}`));
		if (existing?.controller.signal.aborted) return existing.promise.then(() => withAssistantAgentDatabaseAsync(options, operation, assertCurrent), () => withAssistantAgentDatabaseAsync(options, operation, assertCurrent));
		const pending = existing ?? startAssistantAgentDatabaseAdmission(options, agentId, pathname, assertCurrent);
		pending.operations += 1;
		return pending.promise.then((database) => {
			assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent);
			observeAssistantDatabaseMaintenanceResource(database.db);
			return operation(database);
		}).finally(() => {
			pending.operations -= 1;
			if (!pending.operations) pending.releaseBorrow?.();
		});
	}
	/** Run on a Worker to keep its same-connection integrity check outside the parent writer. */
	function withAssistantAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const run = () => runAgentDatabaseAdmission(inputOptions, withAdmission, operation);
		const scope = getAssistantDatabaseMaintenanceScope();
		return scope ? scope.run(() => scope.track(run())) : run();
	}
	async function runAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveAssistantAgentSqlitePath({
			...options,
			agentId
		});
		const existing = cache.pending.get(pathname);
		if (existing) {
			if (existing.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${existing.agentId}`);
			try {
				await existing.promise;
			} catch (error) {
				if (!existing.controller.signal.aborted) throw error;
			}
			return withAssistantAgentDatabaseAdmission(options, withAdmission, operation);
		}
		const admission = createAssistantAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		pending.promise.catch(() => {});
		pending.operations += 1;
		const steps = openSteps(options, pending);
		let check;
		let failure;
		let suspended = false;
		try {
			while (true) {
				const outcome = await withAdmission(async (assertCurrent, validation) => {
					try {
						assertCurrent();
						assertAssistantAgentDatabaseAdmissionCurrent(options, pending, check?.database);
					} catch (error) {
						failure = { error: new Error(error instanceof Error ? error.message : String(error), { cause: error }) };
					}
					pending.validation = validation;
					suspended = false;
					const step = failure ? steps.throw(failure.error) : steps.next();
					if (!step.done) {
						suspended = true;
						return {
							done: false,
							check: step.value
						};
					}
					pending.releaseBorrow = retainAgentDatabase(step.value.db);
					admission.complete(step.value);
					const assertOperationCurrent = () => assertAgentDatabaseOperationCurrent(step.value, options, pending, assertCurrent);
					assertOperationCurrent();
					const flushMaintenance = isMainThread ? void 0 : registerDeferredSqliteWalWriteAdmission(step.value.db);
					flushMaintenance?.(assertOperationCurrent);
					const result = await operation(step.value);
					flushMaintenance?.(assertOperationCurrent);
					return {
						done: true,
						result
					};
				});
				if (outcome.done) return outcome.result;
				check = outcome.check;
				failure = void 0;
				try {
					pending.controller.signal.throwIfAborted();
					runSqliteIntegrityCheckSync(check);
				} catch (error) {
					failure = { error };
				}
			}
		} catch (error) {
			const failures = [error];
			if (suspended) {
				const cancellation = new Error(`Agent database admission failed: ${pathname}`, { cause: error });
				try {
					steps.throw(cancellation);
				} catch (cleanupError) {
					if (cleanupError !== cancellation) failures.push(cleanupError);
				}
			}
			const terminalFailure = failures.length === 1 ? error : new AggregateError(failures, "Agent database admission and cleanup failed", { cause: error });
			admission.fail(terminalFailure);
			throw terminalFailure;
		} finally {
			pending.operations -= 1;
			if (!pending.operations) pending.releaseBorrow?.();
		}
	}
	function createAssistantAgentDatabaseAdmission(agentId, pathname) {
		const completion = createDeferredCore();
		const pending = {
			agentId,
			path: pathname,
			controller: new AbortController(),
			promise: completion.promise,
			operations: 0
		};
		cache.pending.set(pathname, pending);
		cache.activePending.add(pending);
		const retire = () => {
			if (cache.pending.get(pathname) === pending) cache.pending.delete(pathname);
			cache.activePending.delete(pending);
		};
		return {
			pending,
			complete: (database) => {
				retire();
				if (pending.controller.signal.aborted || cache.databases.get(pathname) !== database || !database.db.isOpen) {
					const error = pending.controller.signal.reason ?? /* @__PURE__ */ new Error(`Agent database closed before admission completed: ${pathname}`);
					completion.reject(error);
					throw error;
				}
				completion.resolve(database);
			},
			fail: (error) => {
				retire();
				completion.reject(error);
			}
		};
	}
	function assertAssistantAgentDatabaseAdmissionCurrent(options, pending, database) {
		const pathname = pending.path;
		pending.controller.signal.throwIfAborted();
		assertAgentDatabaseAdmitted(pending.agentId, { env: options.env });
		if (cache.pending.get(pathname) !== pending) throw new Error(`Agent database open was replaced: ${pathname}`);
		getAgentDeletionDatabaseCleanup(options)?.assertCurrent();
		pending.assertHeld?.();
		if (database) {
			assertSupportedAgentSchemaVersion(database, pathname);
			assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(database), pending.agentId, pathname);
		}
	}
	function startAssistantAgentDatabaseAdmission(options, agentId, pathname, assertCurrent) {
		const admission = createAssistantAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		const operation = openSteps(options, pending);
		(async () => {
			assertAgentDatabaseOpenAuthority(operation, assertCurrent);
			let step = operation.next();
			while (!step.done) {
				const database = step.value.database;
				let failure;
				let failed = false;
				try {
					await assertSqliteIntegrityInWorker(pathname, TESTCLAW_SQLITE_BUSY_TIMEOUT_MS, pending.controller.signal, void 0, step.value.timing);
				} catch (error) {
					failure = error;
					failed = true;
				}
				assertAgentDatabaseOpenAuthority(operation, () => {
					assertAssistantAgentDatabaseAdmissionCurrent(options, pending, database);
					assertCurrent?.();
				});
				step = failed ? operation.throw(failure) : operation.next();
			}
			pending.releaseBorrow = retainAgentDatabase(step.value.db);
			return step.value;
		})().then(admission.complete, admission.fail).catch(admission.fail);
		return pending;
	}
	return {
		withAssistantAgentDatabaseAsync,
		withAssistantAgentDatabaseAdmission
	};
}
//#endregion
//#region src/state/testclaw-agent-db-maintenance-lease.ts
const activeMaintenance = new AsyncLocalStorage();
async function runMaintenanceScope(databasePath, owner, run, ancestors = []) {
	const scope = {
		databasePath,
		owner,
		ancestors,
		active: true,
		accepting: true,
		pending: [],
		ownership: ancestors[0]?.ownership ?? {}
	};
	const assertCurrent = () => {
		if (!scope.active || ancestors.some((parent) => !parent.active)) throw new Error("Agent database maintenance scope is closed");
		if (scope.ownership.failure) throw scope.ownership.failure.error;
		try {
			owner.assertOwned();
		} catch (error) {
			scope.ownership.failure = { error };
			throw error;
		}
	};
	const assertAdmission = () => {
		assertCurrent();
		if (!scope.accepting) throw new Error("Agent database maintenance admission is closed");
	};
	const track = (operation) => {
		scope.pending.push(operation);
		operation.catch(() => void 0);
		return operation;
	};
	const lease = {
		signal: owner.signal,
		assertOwned: assertCurrent,
		assertOwnedInTransaction(database) {
			assertCurrent();
			owner.assertOwnedInTransaction(database);
		},
		...owner.renew ? { renew() {
			assertAdmission();
			owner.renew();
		} } : {},
		...owner.withDatabaseFileExclusion ? { withDatabaseFileExclusion(operation, bind) {
			assertAdmission();
			return track(owner.withDatabaseFileExclusion(operation, bind));
		} } : {}
	};
	try {
		return await withSqliteIntegrityWorkerScope(assertCurrent, () => activeMaintenance.run(scope, () => runWithAgentDatabaseMaintenanceAuthority(lease, databasePath, async () => {
			let outcome;
			try {
				assertCurrent();
				outcome = { value: await run(lease) };
			} catch (error) {
				outcome = { error };
			}
			scope.accepting = false;
			const errors = "error" in outcome ? [outcome.error] : [];
			let joined = 0;
			while (joined < scope.pending.length) {
				const admitted = scope.pending.slice(joined);
				joined += admitted.length;
				for (const result of await Promise.allSettled(admitted)) if (result.status === "rejected" && !errors.includes(result.reason)) errors.push(result.reason);
			}
			try {
				assertCurrent();
			} catch (error) {
				if (!errors.includes(error)) errors.push(error);
			}
			if (errors.length > 1) throw new AggregateError(errors, "Agent maintenance and nested work failed", { cause: errors[0] });
			if (errors.length === 1) throw errors[0];
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		})));
	} finally {
		scope.active = false;
	}
}
/** Retain one real lease through nested Doctor work; serialized selectors grant no authority. */
function withAgentDatabaseMaintenanceLease(options, run) {
	const databasePath = path.resolve(resolveAssistantStateSqlitePath(options.env));
	const active = activeMaintenance.getStore();
	if (active) {
		if (!active.active || !active.accepting) return Promise.reject(/* @__PURE__ */ new Error("Agent database maintenance admission is closed"));
		if (active.databasePath !== databasePath) return Promise.reject(/* @__PURE__ */ new Error("Nested agent maintenance cannot switch its state database"));
		const admitted = runMaintenanceScope(databasePath, active.owner, run, [...active.ancestors, active]);
		active.pending.push(admitted);
		admitted.catch(() => void 0);
		return admitted;
	}
	return withAssistantStateLease({
		...AGENT_DATABASE_MAINTENANCE_LEASE,
		database: {
			scope: "shared",
			options,
			schemaPolicy: options.schemaPolicy
		},
		leaseMs: options.leaseMs ?? 6e4,
		waitMs: 5e3,
		prepareDatabase: true,
		heartbeat: "worker",
		leaseLabel: "agent database maintenance lease",
		operationLabel: "agent.database.maintenance.lease"
	}, (maintenance) => runMaintenanceScope(databasePath, maintenance, async (lease) => {
		await closeAssistantAgentDatabasesAsync();
		assertNoAssistantAgentDatabaseLeases(lease, options);
		clearAssistantAgentDatabaseValidationCache();
		return run(lease);
	}));
}
//#endregion
//#region src/state/testclaw-agent-db.ts
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmAssistantAgentDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	await closeAssistantAgentDatabaseByPathAsync(resolvedPath);
	invalidateAssistantAgentDatabaseValidation(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordAssistantAgentDatabaseOpenFailure(pathname, error, generation) {
	const recorded = cache.terminal.record(pathname, error, generation);
	if (recorded) invalidateAssistantAgentDatabaseValidation(pathname);
	return recorded;
}
/**
* Clear a terminal open failure after doctor rewrites the database file.
* Returns false when the persisted quarantine row survived; callers must
* surface that, or the next open re-quarantines the repaired file.
*/
function clearAssistantAgentDatabaseOpenFailure(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	const cleared = clearAssistantDatabaseQuarantine(resolvedPath, { env: options.env });
	cache.terminal.clear(resolvedPath);
	return cleared;
}
/** Open or return a cached per-agent database after schema and owner validation. */
function openAssistantAgentDatabase(options, preparedLease, onRegistrationCommitted) {
	const run = () => runSqliteIntegrityOperationSync(openAssistantAgentDatabaseSteps(options, void 0, preparedLease, onRegistrationCommitted));
	const scope = getAssistantDatabaseMaintenanceScope();
	return scope ? scope.run(run) : run();
}
const { withAssistantAgentDatabaseAsync, withAssistantAgentDatabaseAdmission } = createAssistantAgentDatabaseAdmissionOwner(openAssistantAgentDatabaseSteps);
function* openAssistantAgentDatabaseSteps(options, pending, preparedLease, onRegistrationCommitted) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveAssistantAgentSqlitePath(databaseOptions);
	getAgentDeletionDatabaseCleanup(databaseOptions)?.assertCurrent();
	const incognito = isIncognitoAssistantAgentSqlitePath(pathname, databaseOptions);
	const opened = getAssistantAgentDatabaseIfOpen(databaseOptions);
	if (opened) {
		if (preparedLease) throw new Error("A prepared Worker lease cannot adopt an existing agent database handle");
		return opened;
	}
	if (!pending) revokePendingAgentDatabaseOpen(pathname);
	const cached = cache.databases.get(pathname);
	const allowExtension = !process.permission && supportsNodeSqliteExtensionLoading();
	if (incognito) {
		assertIncognitoAgentDatabasePathAvailable(pathname);
		if (cached) {
			closeCachedAssistantAgentDatabase(cached);
			cache.databases.delete(pathname);
			cache.failures.delete(pathname);
		}
		const db = openNodeSqliteDatabase(":memory:", { allowExtension });
		db.enableLoadExtension(false);
		configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS });
		const walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: `testclaw-agent-incognito:${agentId}`,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		ensureAgentSchema(db, agentId, pathname);
		registerAssistantAgentDatabaseIdentity(db);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		cache.incognito.add(database);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeAssistantAgentDatabases);
		cache.databases.set(pathname, database);
		cache.generation += 1;
		getAssistantDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		return database;
	}
	quarantineOrphanedSqliteSidecars(pathname);
	assertAgentDatabaseTerminalOpenAllowed(pathname);
	const persistedFailure = readAssistantDatabaseQuarantineFailure("agent", pathname, { env: databaseOptions.env });
	if (persistedFailure) {
		recordAssistantAgentDatabaseOpenFailure(pathname, persistedFailure);
		throw persistedFailure;
	}
	if (cached) {
		closeCachedAssistantAgentDatabase(cached);
		cache.databases.delete(pathname);
		cache.failures.delete(pathname);
	}
	const leaseEnvironment = {
		TESTCLAW_STATE_DIR: resolveStateDir(options.env ?? process.env),
		...isGatewayExternallySupervised(options.env ?? process.env) ? { TESTCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	if (preparedLease && (preparedLease.receipt.agentId !== agentId || preparedLease.receipt.path !== pathname)) throw new Error("Prepared agent database lease belongs to another store");
	let verification;
	let hasLiveLease = false;
	const validation = pending?.validation ?? preparedLease?.validation;
	const captureVerification = (record, liveLease, invalidated) => {
		verification = record;
		hasLiveLease = liveLease;
		if (invalidated && validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
	};
	const leaseId = preparedLease ? preparedLease.claim(captureVerification) : claimAssistantAgentDatabaseLease({
		agentId,
		path: pathname,
		env: leaseEnvironment
	}, void 0, captureVerification);
	if (pending) pending.assertHeld = () => assertAssistantAgentDatabaseLease(leaseId, {
		agentId,
		path: pathname,
		env: leaseEnvironment
	});
	const diagnostics = {};
	const finishPhase = startAgentDatabaseOpenTiming(agentId, pathname, pending ? "async" : "sync", diagnostics);
	let openedDb;
	let openedDatabase;
	let openedWalMaintenance;
	try {
		ensureAssistantAgentDatabasePermissions(pathname, databaseOptions);
		closeIdleAssistantAgentDatabaseReadOnly(pathname);
		const db = openNodeSqliteDatabase(pathname, { allowExtension });
		db.enableLoadExtension(false);
		enableNodeSqliteKyselyStatementCache(db);
		openedDb = db;
		if (preparedLease) db.exec("PRAGMA temp_store = FILE");
		registerAssistantAgentDatabaseIdentity(db);
		finishPhase("open");
		const validationDatabase = {
			db,
			path: pathname,
			agentId
		};
		if (validation) adoptAssistantAgentDatabaseValidation(validationDatabase, validation);
		let isValidatedReopen = Boolean(getAssistantAgentDatabaseValidation(validationDatabase));
		const walMaintenance = yield* (function* () {
			let maintenance;
			try {
				db.exec(`PRAGMA busy_timeout = ${TESTCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
				assertSupportedAgentSchemaVersion(db, pathname);
				const existingSchema = readExistingAgentSchemaMeta(db);
				assertExistingAgentSchemaOwner(existingSchema, agentId, pathname);
				const requiresCurrentVersionConvergence = yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, diagnostics, verification, isValidatedReopen && hasLiveLease);
				if (isValidatedReopen && (!existingSchema || requiresCurrentVersionConvergence)) {
					invalidateAssistantAgentDatabaseValidation(pathname);
					isValidatedReopen = false;
				}
				assertCanonicalAgentPersistenceVersion(db, pathname);
				finishPhase("validation");
				configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS });
				maintenance = configureSqliteConnectionPragmas(db, {
					busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: `testclaw-agent:${agentId}`,
					databasePath: pathname,
					foreignKeys: true,
					synchronous: "NORMAL"
				});
				openedWalMaintenance = maintenance;
				finishPhase("configuration");
				if (!isValidatedReopen) ensureAgentSchema(db, agentId, pathname);
				finishPhase("schema");
				return maintenance;
			} catch (err) {
				maintenance?.close();
				if (db.isOpen) db.close();
				const current = cache.databases.get(pathname);
				if (!current || current.db === db) invalidateAssistantAgentDatabaseValidation(pathname);
				if (err instanceof Error && (isSqliteSchemaVersionError(err) || isTerminalSqliteIntegrityError(err))) recordAssistantAgentDatabaseOpenFailure(pathname, err);
				throw err;
			}
		})();
		ensureAssistantAgentDatabasePermissions(pathname, databaseOptions);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (hasAgentDatabaseMaintenanceAuthority()) throw new Error("Agent database maintenance is in progress; retry after testclaw doctor --fix completes.");
		const cleanup = registerAgentDeletionDatabaseCleanup(database, databaseOptions);
		if (cleanup) {
			const release = retainAgentDatabase(db);
			cleanup.registerClose(() => {
				release();
				if (cache.databases.get(database.path) === database) closeAssistantAgentDatabaseByPath(database.path, database.agentId);
				else if (database.db.isOpen) throw new Error("Agent deletion cleanup lost its database close owner.");
			});
		}
		if (!isValidatedReopen) {
			registerAssistantAgentDatabase({
				agentId,
				path: pathname,
				env: options.env
			}, onRegistrationCommitted);
			setAssistantAgentDatabaseValidation(database);
		}
		cache.terminal.clear(pathname);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeAssistantAgentDatabases);
		finishPhase("registration");
		cache.leases.set(pathname, {
			leaseId,
			env: leaseEnvironment
		});
		cache.databases.set(pathname, database);
		const identity = readAssistantAgentDatabaseIdentity(database).identity;
		if (diagnostics.integrityGateOutcome === "cached") {
			if (preparedLease) requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "agent-integrity-cached",
					lease: preparedLease.receipt
				}
			});
			else requestAssistantAgentDatabaseQuickCheck({
				path: pathname,
				env: leaseEnvironment
			});
		} else if (typeof identity === "string") recordAssistantAgentDatabaseIntegrityVerified(leaseId, {
			agentId,
			path: pathname,
			env: leaseEnvironment
		}, identity);
		refreshAgentDatabaseIdleTimer(database);
		if (isMainThread) {
			const writeOptions = {
				agentId,
				path: pathname,
				env: leaseEnvironment
			};
			registerSqliteWalWriteAdmission(db, (operation) => runAssistantAgentWriteAdmission(writeOptions, () => {
				if (findAssistantAgentDatabaseIfOpen(writeOptions) === database) operation();
			}));
		}
		getAssistantDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		return database;
	} catch (error) {
		let closeError;
		if (openedDatabase) try {
			closeCachedAssistantAgentDatabase(openedDatabase);
		} catch (caught) {
			closeError = caught;
		}
		if (openedDb?.isOpen) {
			if (pending && cache.databases.has(pathname) && cache.databases.get(pathname)?.db !== openedDb) {
				const retainedDb = openedDb;
				retainFailedAgentDatabaseClose(agentId, pathname, () => {
					openedWalMaintenance?.close();
					if (retainedDb.isOpen) retainedDb.close();
					releaseAssistantAgentDatabaseLease(leaseId, { env: leaseEnvironment });
				});
				throw error;
			}
			invalidateAssistantAgentDatabaseValidation(pathname);
			const retainedDatabase = openedDatabase ?? {
				agentId,
				db: openedDb,
				path: pathname,
				walMaintenance: openedWalMaintenance ?? {
					checkpoint: () => false,
					reclaimFreePages: createSqliteWalReclamationResult,
					close: () => false
				}
			};
			cache.databases.set(pathname, retainedDatabase);
			refreshAgentDatabaseIdleTimer(retainedDatabase);
			cache.leases.set(pathname, {
				leaseId,
				env: leaseEnvironment
			});
			cache.failures.set(pathname, closeError ?? error);
			getAssistantDatabaseMaintenanceScope()?.own(retainedDatabase.db, "agent-handles", () => closeMaintenanceAgentDatabase(retainedDatabase));
			cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeAssistantAgentDatabases);
		} else try {
			releaseAssistantAgentDatabaseLease(leaseId, { env: leaseEnvironment });
		} catch (releaseError) {
			retainFailedAgentDatabaseClose(agentId, pathname, () => releaseAssistantAgentDatabaseLease(leaseId, { env: leaseEnvironment }));
			throw releaseError;
		}
		throw closeError ?? error;
	}
}
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferAssistantAgentPostCommitPublication(database, publish) {
	return deferSqlitePostCommitPublication(database.db, publish);
}
function runAssistantAgentWriteTransaction(operation, options, transactionOptions = {}) {
	const database = openAssistantAgentDatabase(options);
	const enteredNestedTransaction = database.db.isTransaction;
	return withSqlitePostCommitPublications(database.db, () => runSqliteImmediateTransactionSync(database.db, () => {
		assertAgentDeletionDatabaseCleanupAccess(database, options);
		const operationResult = operation(database);
		if (!enteredNestedTransaction && !cache.incognito.has(database)) ensureAssistantAgentDatabasePermissions(database.path, options);
		return operationResult;
	}, {
		busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
		databaseLabel: database.path,
		...transactionOptions,
		operationLabel: transactionOptions.operationLabel ?? "agent.write",
		withCommit: getAgentDeletionDatabaseCleanup(options)?.withCommit
	}));
}
/** Retain the exact verified connection across awaits; explicit disposal still revokes it. */
function borrowAssistantAgentDatabase(options) {
	const { db } = openAssistantAgentDatabase(options);
	return {
		db,
		release: retainAgentDatabase(db)
	};
}
/** Return whether the exact cached agent database pathname is still open. */
function isAssistantAgentDatabaseOpen(pathname) {
	return cache.databases.get(path.resolve(pathname))?.db.isOpen === true;
}
/** Return the matching live cache entry without materializing a database. */
function getAssistantAgentDatabaseIfOpen(options) {
	const database = findAssistantAgentDatabaseIfOpen(options);
	if (database) refreshAgentDatabaseIdleTimer(database);
	return database;
}
function findAssistantAgentDatabaseIfOpen(options) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const pathname = resolveAssistantAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoAssistantAgentSqlitePath(pathname, options) && readAgentDeletionJournal(agentId, { env: options.env })) throw new Error(`Assistant agent database is unavailable while agent ${agentId} is deleted.`);
	const database = cache.databases.get(pathname);
	if (!database?.db.isOpen) {
		assertAgentDeletionCleanupAliases(options, isSameAssistantAgentDatabasePath);
		return;
	}
	if (cache.failures.has(pathname)) throw cache.failures.get(pathname);
	if (database.agentId !== agentId) throw new Error(`Assistant agent database ${pathname} is already open for agent ${database.agentId}; requested agent ${agentId}.`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	observeAssistantDatabaseMaintenanceResource(database.db);
	return database;
}
/** Pin only admitted native readers already present in captured discovery families. */
function retainAssistantAgentDatabaseReadCandidates(candidates, env) {
	const retained = [];
	const release = () => {
		for (const reader of retained.toReversed()) reader.release();
	};
	try {
		for (const database of cache.databases.values()) {
			if (!database.db.isOpen || database.db.isTransaction || cache.incognito.has(database) || !candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, database.path))) continue;
			let admitted;
			try {
				admitted = getAssistantAgentDatabaseIfOpen({
					agentId: database.agentId,
					path: database.path,
					env
				});
			} catch {
				continue;
			}
			if (admitted === database) retained.push({
				database,
				release: retainAgentDatabase(database.db)
			});
		}
		return {
			databases: retained.map(({ database }) => database),
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Close and unregister one unambiguous transient agent database by filesystem identity. */
function disposeAssistantAgentDatabaseByPath(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	for (const pendingPath of cache.pending.keys()) if (isSameAssistantAgentDatabasePath(pendingPath, resolvedPath)) revokePendingAgentDatabaseOpen(pendingPath);
	for (const retained of cache.retainedCloses) if (isSameAssistantAgentDatabasePath(retained.path, resolvedPath)) retained.close();
	invalidateAssistantAgentDatabaseValidation(resolvedPath);
	const matchingDatabases = [...cache.databases.values()].filter((candidate) => isSameAssistantAgentDatabasePath(candidate.path, resolvedPath));
	if (matchingDatabases.length > 1) return false;
	const database = matchingDatabases[0];
	if (database && cache.incognito.has(database)) return closeAssistantAgentDatabaseByPath(database.path);
	if (!database) return false;
	try {
		unregisterAssistantAgentDatabase({
			agentId: database.agentId,
			path: database.path,
			...options.env ? { env: options.env } : {}
		});
	} finally {
		closeAssistantAgentDatabaseByPath(database.path);
	}
	return true;
}
/** Release fixture handles and pathname trust before a test root is recreated. */
function closeAssistantAgentDatabasesForTest(rootPath) {
	closeAssistantAgentDatabases(rootPath);
	clearAssistantAgentDatabaseValidationCache(rootPath);
	cache.terminal.clearAll(rootPath);
}
//#endregion
export { withFreshAssistantAgentDatabaseReadOnly as C, readAssistantAgentDatabase as S, invalidateAssistantAgentReadOnlyProjections as _, deferAssistantAgentPostCommitPublication as a, hasAssistantAgentReadOnlySchema as b, isAssistantAgentDatabaseOpen as c, retainAssistantAgentDatabaseReadCandidates as d, runAssistantAgentWriteTransaction as f, AssistantAgentDatabaseReadOnlyScope as g, withAgentDatabaseMaintenanceLease as h, confirmAssistantAgentDatabaseIntegrity as i, openAssistantAgentDatabase as l, withAssistantAgentDatabaseAsync as m, clearAssistantAgentDatabaseOpenFailure as n, disposeAssistantAgentDatabaseByPath as o, withAssistantAgentDatabaseAdmission as p, closeAssistantAgentDatabasesForTest as r, getAssistantAgentDatabaseIfOpen as s, borrowAssistantAgentDatabase as t, recordAssistantAgentDatabaseOpenFailure as u, retainCachedAssistantAgentDatabaseReadOnly as v, openAssistantAgentDatabaseReadOnly as x, withScopedAssistantAgentDatabaseReadOnly as y };
