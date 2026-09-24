import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import "./session-key-C_bfgyCp.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DSeyJ5Sb.mjs";
import "./kysely-sync-DUH0XYlR.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { c as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { a as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CRW06h3K.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-Bar1ps-o.mjs";
import { t as readExistingAgentSchemaMeta } from "./testclaw-agent-db-metadata-Nf1EFGMj.mjs";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-BboyngJR.mjs";
import { a as registerSqliteCacheExitClose, c as registerSqliteWalWriteAdmission, l as createSqliteWalReclamationResult, n as configureSqlitePreSchemaPragmas, s as registerDeferredSqliteWalWriteAdmission, t as configureSqliteConnectionPragmas } from "./sqlite-wal-36gEREe5.mjs";
import { i as getAssistantDatabaseMaintenanceScope, s as observeAssistantDatabaseMaintenanceResource } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import { a as isTerminalSqliteIntegrityError, i as confirmSqliteFileIntegrity, o as runSqliteIntegrityCheckSync, s as runSqliteIntegrityOperationSync } from "./sqlite-integrity-BSZQ5Avg.mjs";
import { a as registerAssistantAgentDatabaseIdentity, i as readAssistantAgentDatabaseIdentity } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { i as getAssistantAgentDatabaseValidation, r as clearAssistantAgentDatabaseValidationCache, s as invalidateAssistantAgentDatabaseValidation, t as adoptAssistantAgentDatabaseValidation, u as setAssistantAgentDatabaseValidation } from "./testclaw-agent-db-validation-cache-DBMmC7T_.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { i as clearAssistantDatabaseQuarantine, s as readAssistantDatabaseQuarantineFailure } from "./testclaw-quarantine-store-BgTM1lrX.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0zD4p1G.mjs";
import { r as quarantineOrphanedSqliteSidecars } from "./sqlite-files-BGzENJvG.mjs";
import { a as resolveAssistantAgentSqlitePath, n as assertIncognitoAgentDatabasePathAvailable, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import "./testclaw-state-db-BXFT1fUC.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { t as withAssistantStateLease } from "./testclaw-state-lease-BHZclfm3.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./testclaw-agent-db-schema-read-BlI6Qzh2.mjs";
import "./testclaw-agent-db-schema-helpers-CYxrGCCh.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CyLpJ2LV.mjs";
import { C as getAgentDeletionDatabaseCleanup, b as assertAgentDeletionCleanupAliases, o as readAgentDeletionJournal, w as registerAgentDeletionDatabaseCleanup, x as assertAgentDeletionDatabaseCleanupAccess } from "./agent-deletion-journal-DI5y0Fk0.mjs";
import { a as ensureAgentSchema, g as withSqliteIntegrityWorkerScope, h as assertSqliteIntegrityInWorker, i as agentDatabaseIntegrityBeforeMutationSteps, m as ensureAssistantAgentDatabasePermissions } from "./testclaw-agent-db-maintenance-50rOkGc_.mjs";
import { a as assertNoAssistantAgentDatabaseLeases, c as claimAssistantAgentDatabaseLease, g as releaseAssistantAgentDatabaseLease, l as hasAgentDatabaseMaintenanceAuthority, m as recordAssistantAgentDatabaseIntegrityVerified, s as assertAssistantAgentDatabaseLease, t as AGENT_DATABASE_MAINTENANCE_LEASE, v as runWithAgentDatabaseMaintenanceAuthority } from "./testclaw-agent-db-lease-gzW677CG.mjs";
import { i as matchesAgentDatabaseReadCandidatePath } from "./testclaw-agent-db-resources-hI09vxvz.mjs";
import { _ as retainAgentDatabase, a as closeAssistantAgentDatabaseByPath, c as closeAssistantAgentDatabasesAsync, g as refreshAgentDatabaseIdleTimer, i as closeMaintenanceAgentDatabase, n as cache, o as closeAssistantAgentDatabaseByPathAsync, r as closeCachedAssistantAgentDatabase, s as closeAssistantAgentDatabases, t as assertAgentDatabaseTerminalOpenAllowed, v as retainFailedAgentDatabaseClose, x as startAgentDatabaseOpenTiming, y as revokePendingAgentDatabaseOpen } from "./testclaw-agent-db-lifecycle-BQsqjh85.mjs";
import { n as closeIdleAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-scope-Bobfc9dO.mjs";
import { a as unregisterAssistantAgentDatabase, i as registerAssistantAgentDatabase, r as isSameAssistantAgentDatabasePath } from "./testclaw-agent-db-registry-XnPsrvLm.mjs";
import { r as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-D_VtLORb.mjs";
import { t as requestAssistantAgentDatabaseQuickCheck } from "./testclaw-database-verify-BC3BPcdE.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isMainThread } from "node:worker_threads";
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
export { deferAssistantAgentPostCommitPublication as a, isAssistantAgentDatabaseOpen as c, retainAssistantAgentDatabaseReadCandidates as d, runAssistantAgentWriteTransaction as f, withAgentDatabaseMaintenanceLease as h, confirmAssistantAgentDatabaseIntegrity as i, openAssistantAgentDatabase as l, withAssistantAgentDatabaseAsync as m, clearAssistantAgentDatabaseOpenFailure as n, disposeAssistantAgentDatabaseByPath as o, withAssistantAgentDatabaseAdmission as p, closeAssistantAgentDatabasesForTest as r, getAssistantAgentDatabaseIfOpen as s, borrowAssistantAgentDatabase as t, recordAssistantAgentDatabaseOpenFailure as u };
