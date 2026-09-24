import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BbGKLJ4e.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { r as tableExists } from "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-CT69oJq4.mjs";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import { S as testClawStateDatabaseCache, v as requireAssistantStateDatabaseIdentity } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { a as resolveAssistantStateDirForDatabasePath, s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { a as markAssistantAgentIntegrityClean, c as recordAssistantAgentIntegrityVerification, o as readAssistantAgentIntegrityVerification, r as clearAssistantAgentIntegrityVerification } from "./testclaw-quarantine-store-BgTM1lrX.mjs";
import { a as withAssistantStateReadOnlyLocation, tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { c as runAssistantStateWriteTransaction, f as ensureAgentDatabaseLeaseSchema, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
import { t as runExistingAssistantStateWriteTransaction } from "./testclaw-state-db-existing-write-DCUyCVZ2.mjs";
import { a as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence } from "./agent-deletion-journal-DI5y0Fk0.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";
//#region src/state/testclaw-agent-db-existing-write.ts
const existingAgentLeaseSchema = [
	"schema_meta",
	"state_leases",
	"agent_database_leases"
].map((table) => extractSqliteTableSchema(TESTCLAW_STATE_SCHEMA_SQL, table, {
	endMarker: ") STRICT;",
	errorMessage: "Existing agent lease schema is unavailable."
})).join("\n");
function withExistingAgentLeaseWrite(maintenance, options, operation) {
	return runExistingAssistantStateWriteTransaction(({ db }) => {
		maintenance.assertOwnedInTransaction(db);
		const result = operation(db);
		maintenance.assertOwnedInTransaction(db);
		return result;
	}, options, {
		operationLabel: "agent.database.maintenance.admission",
		schemaSql: existingAgentLeaseSchema,
		busyTimeoutMs: 0
	});
}
//#endregion
//#region src/state/testclaw-agent-db-lease.ts
const AGENT_DATABASE_MAINTENANCE_LEASE = {
	scope: "core:agent-database-maintenance",
	key: "global"
};
var AssistantAgentDatabaseLeaseActiveError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "AssistantAgentDatabaseLeaseActiveError";
	}
};
const maintenanceAuthority = new AsyncLocalStorage();
/** Ordinary agent worker routing cannot borrow native maintenance authority. */
function hasAgentDatabaseMaintenanceAuthority() {
	return maintenanceAuthority.getStore() !== void 0;
}
function runWithAgentDatabaseMaintenanceAuthority(authority, databasePath, run) {
	const scope = getAssistantDatabaseMaintenanceScope();
	return maintenanceAuthority.run({
		authority,
		databasePath: path.resolve(databasePath),
		assertScopeCurrent: scope ? () => scope.assertAdmission() : void 0
	}, run);
}
/** Revalidate the held lease, including immediately before committing a versioned rebuild. */
function assertAgentDatabaseMaintenanceAuthority(expected) {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority || expected && authority !== expected) throw new Error("Agent identity migration requires stopped-writer maintenance; stop active agents and run testclaw doctor --fix.");
	authority.assertOwned();
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
}
/** Revalidate a maintenance owner when present, without requiring ordinary opens to hold one. */
function assertAgentDatabaseMaintenanceAuthorityIfPresent() {
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
	maintenanceAuthority.getStore()?.authority.assertOwned();
}
/** Raw maintenance writers share the captured state owner, including explicit-env Doctor runs. */
function invalidateAssistantAgentDatabaseIntegrityBeforeMutation(pathname, env) {
	const maintenance = maintenanceAuthority.getStore();
	maintenance?.authority.assertOwned();
	clearAssistantAgentIntegrityVerification(pathname, maintenance ? { TESTCLAW_STATE_DIR: resolveAssistantStateDirForDatabasePath(maintenance.databasePath) } : env);
}
/** Verify the maintenance owner and its independent heartbeat before a synchronous phase. */
function renewAgentDatabaseMaintenanceAuthorityIfPresent() {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority) return;
	if (!authority.renew) throw new Error("Agent database maintenance authority cannot renew its lease.");
	authority.renew();
}
function claimAssistantAgentDatabaseLease(params, leaseId = crypto.randomUUID(), onVerification) {
	const agentId = normalizeAgentId(params.agentId);
	const deletionFence = prepareAgentDeletionPathFence({
		agentId,
		path: params.path
	}, { env: params.env });
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	runAssistantStateWriteTransaction((database) => claimAgentDatabaseLeaseInDatabase(database, {
		leaseId,
		agentId,
		path: params.path,
		ownerPid: process.pid,
		ownerStartTime
	}, deletionFence, params.env, onVerification), { env: params.env });
	return leaseId;
}
function claimAgentDatabaseLeaseInDatabase(database, owner, deletionFence, env, onVerification) {
	ensureAgentDatabaseLeaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const maintenance = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("state_leases").select("owner").where("scope", "=", AGENT_DATABASE_MAINTENANCE_LEASE.scope).where("lease_key", "=", AGENT_DATABASE_MAINTENANCE_LEASE.key).where("expires_at", ">", Date.now()));
	const authority = maintenanceAuthority.getStore();
	if (maintenance || authority) throw new Error("Agent database maintenance is in progress; retry after testclaw doctor --fix completes.");
	assertAgentDeletionPathFence(database, deletionFence);
	let invalidated = false;
	for (const held of readAgentDatabaseLeases(database.db)) if (mayShareAgentDatabaseFile(held.path, owner.path) && isAgentDatabaseLeaseStale(held)) {
		clearAgentDatabaseLeaseVerifications(database.db, held.path, env);
		invalidated = true;
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "=", held.lease_id));
	}
	const hasLiveLease = hasAgentDatabasePathLease(database.db, owner.path);
	const hasOtherOwner = hasAgentDatabasePathLease(database.db, owner.path, owner);
	const verification = readAssistantAgentIntegrityVerification(owner.path, env, !hasLiveLease || hasOtherOwner);
	onVerification?.(verification && hasLiveLease ? {
		...verification,
		clean_close: 0
	} : verification, hasLiveLease && !hasOtherOwner, invalidated);
	executeSqliteQuerySync(database.db, db.insertInto("agent_database_leases").values({
		lease_id: owner.leaseId,
		agent_id: owner.agentId,
		path: owner.path,
		owner_pid: owner.ownerPid,
		owner_start_time: owner.ownerStartTime,
		opened_at: Date.now()
	}));
}
function releaseAssistantAgentDatabaseLease(leaseId, options = {}, closeOutcome) {
	const release = (database) => {
		const db = getNodeSqliteKysely(database);
		const held = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select("path").where("lease_id", "=", leaseId));
		if (held && (!closeOutcome || closeOutcome === "uncheckpointed")) clearAgentDatabaseLeaseVerifications(database, held.path, options.env, closeOutcome === "uncheckpointed" ? "retain" : "revoke");
		executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", leaseId));
		if (typeof closeOutcome === "object" && held?.path === closeOutcome.path && !hasAgentDatabasePathLease(database, closeOutcome.path)) markAssistantAgentIntegrityClean(closeOutcome.path, options.env ?? process.env, closeOutcome.identity);
	};
	const maintenance = maintenanceAuthority.getStore();
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveAssistantStateSqlitePath(options.env));
	if (maintenance?.databasePath === databasePath) return withExistingAgentLeaseWrite(maintenance.authority, options, release);
	runAssistantStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		release(database.db);
	}, options);
}
function agentDatabaseLeasePaths(database, excludedOwner) {
	let query = getNodeSqliteKysely(database).selectFrom("agent_database_leases").select("path").distinct();
	if (excludedOwner) {
		query = query.where("lease_id", "!=", excludedOwner.leaseId);
		if (excludedOwner.ownerStartTime !== null) query = query.where((eb) => eb.or([
			eb("owner_pid", "!=", excludedOwner.ownerPid),
			eb("owner_start_time", "is", null),
			eb("owner_start_time", "!=", excludedOwner.ownerStartTime)
		]));
	}
	return executeSqliteQuerySync(database, query).rows.map((row) => row.path);
}
function mayShareAgentDatabaseFile(left, right) {
	if (left === right) return true;
	try {
		const first = fs.statSync(left, {
			bigint: true,
			throwIfNoEntry: false
		});
		const second = fs.statSync(right, {
			bigint: true,
			throwIfNoEntry: false
		});
		return !first || !second || first.dev === second.dev && first.ino === second.ino;
	} catch {
		return true;
	}
}
function hasAgentDatabasePathLease(database, pathname, excludedOwner) {
	return agentDatabaseLeasePaths(database, excludedOwner).some((held) => mayShareAgentDatabaseFile(held, pathname));
}
/** Peer handles in one known process share integrity ownership, but retain separate close leases. */
function recordAssistantAgentDatabaseIntegrityVerified(leaseId, params, identity) {
	runAssistantStateWriteTransaction((database) => {
		assertAssistantAgentDatabaseLease(leaseId, params);
		if (!hasAgentDatabasePathLease(database.db, params.path, {
			leaseId,
			ownerPid: process.pid,
			ownerStartTime: getFileLockProcessStartTime(process.pid)
		})) recordAssistantAgentIntegrityVerification(params.path, params.env ?? process.env, identity);
	}, { env: params.env });
}
function clearAgentDatabaseLeaseVerifications(database, pathname, env = process.env, runtimeProof = "revoke") {
	for (const held of /* @__PURE__ */ new Set([pathname, ...agentDatabaseLeasePaths(database)])) if (mayShareAgentDatabaseFile(held, pathname)) clearAssistantAgentIntegrityVerification(held, env, runtimeProof);
}
/** An awaited open may consume its scan only while its original runtime claim survives. */
function assertAssistantAgentDatabaseLease(leaseId, params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	const database = openAssistantStateDatabase({ env: params.env });
	const db = getNodeSqliteKysely(database.db);
	const held = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", leaseId));
	if (!held || held.agent_id !== params.agentId || held.path !== params.path || held.owner_pid !== process.pid || held.owner_start_time !== null && ownerStartTime !== null && held.owner_start_time !== ownerStartTime) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
}
/** Preparation grants no access; claim repeats admission on the captured shared owner. */
function prepareAssistantAgentDatabaseWorkerLease(params, sharedDatabase, leaseId) {
	const database = {
		db: sharedDatabase.db,
		path: sharedDatabase.path,
		walMaintenance: sharedDatabase.walMaintenance
	};
	const identity = requireAssistantStateDatabaseIdentity(database);
	const assertCurrent = () => {
		if (!database.db.isOpen || requireAssistantStateDatabaseIdentity(database) !== identity) throw new Error("Prepared agent database lease lost its original shared owner");
	};
	assertCurrent();
	const ownerPid = process.pid;
	const receipt = Object.freeze({
		leaseId,
		agentId: normalizeAgentId(params.agentId),
		path: path.resolve(params.path),
		ownerPid,
		ownerStartTime: getFileLockProcessStartTime(ownerPid),
		sharedStatePath: database.path,
		sharedStateIdentity: identity.key
	});
	const options = {
		database,
		path: database.path,
		env: { ...params.env ?? process.env }
	};
	return {
		receipt,
		claim(onVerification) {
			assertCurrent();
			const deletionFence = prepareAgentDeletionPathFence({
				agentId: receipt.agentId,
				path: receipt.path
			}, options);
			runAssistantStateWriteTransaction((current) => {
				assertCurrent();
				claimAgentDatabaseLeaseInDatabase(current, receipt, deletionFence, options.env, onVerification);
			}, options);
			return receipt.leaseId;
		}
	};
}
/** Capture the exact admitted claim so its parent can finish cleanup after native Worker exit. */
function readAssistantAgentDatabaseWorkerLeaseReceiptFromClaim(leaseId, params) {
	assertAssistantAgentDatabaseLease(leaseId, params);
	const database = openAssistantStateDatabase({ env: params.env });
	const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", leaseId));
	if (!row) throw new Error("SQLite reclamation Worker lost its admitted lease receipt");
	return {
		leaseId,
		agentId: row.agent_id,
		path: row.path,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		sharedStatePath: database.path,
		sharedStateIdentity: readDatabasePathIdentitySync(database.path).key
	};
}
/** The caller owns the original shared transaction and has joined the exact native Worker exit. */
function releaseExitedAssistantAgentDatabaseLeaseInDatabase(database, receipt, onInvalidation) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", receipt.leaseId));
	if (!row) return;
	if (row.agent_id !== receipt.agentId || row.path !== receipt.path || row.owner_pid !== receipt.ownerPid || row.owner_start_time !== receipt.ownerStartTime) throw new Error("SQLite reclamation Worker lease cleanup receipt no longer matches");
	onInvalidation?.();
	clearAgentDatabaseLeaseVerifications(database, receipt.path, { TESTCLAW_STATE_DIR: resolveAssistantStateDirForDatabasePath(receipt.sharedStatePath) });
	executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", receipt.leaseId));
}
function readAgentDatabaseLeases(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"lease_id",
		"owner_pid",
		"owner_start_time",
		"path"
	])).rows;
}
function isAgentDatabaseLeaseStale(row) {
	if (isPidDefinitelyDead(row.owner_pid)) return true;
	const currentStartTime = getFileLockProcessStartTime(row.owner_pid);
	return row.owner_start_time !== null && currentStartTime !== null && row.owner_start_time !== currentStartTime;
}
/** Read-only diagnostic observation; an empty result never grants maintenance authority. */
function readActiveAssistantAgentDatabaseLeasesReadOnly(options = {}, openStateSchemaReadAdmission) {
	const pathname = path.resolve(options.path ?? resolveAssistantStateSqlitePath(options.env));
	try {
		fs.statSync(pathname);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	const cached = testClawStateDatabaseCache.isAssistantStateDatabaseOpen(pathname) ? testClawStateDatabaseCache.getAssistantStateDatabaseIfOpenAtPath(pathname) : void 0;
	const readActiveLeases = (db) => runWithSqliteBusyTimeout(db, 250, () => {
		if (!tableExists(db, "agent_database_leases")) return [];
		return readAgentDatabaseLeases(db).filter((row) => !isAgentDatabaseLeaseStale(row));
	});
	if (!cached) return withAssistantStateReadOnlyLocation(({ db }) => readActiveLeases(db), pathname, prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	const closeSchemaReadAdmission = openStateSchemaReadAdmission?.(cached.db);
	try {
		return readActiveLeases(cached.db);
	} finally {
		closeSchemaReadAdmission?.();
	}
}
/** Doctor holds both lifecycle coordinators before checking writers, without schema repair. */
function assertNoAssistantAgentDatabaseLeasesReadOnly(options = {}, openStateSchemaReadAdmission) {
	const [owner] = readActiveAssistantAgentDatabaseLeasesReadOnly(options, openStateSchemaReadAdmission);
	if (owner) throw new AssistantAgentDatabaseLeaseActiveError(`Agent ${owner.agent_id} database is still open in process ${owner.owner_pid}; stop that process before Doctor repair.`);
}
function assertNoAssistantAgentDatabaseLeases(agentIdRaw, options = {}) {
	if (options.schemaPolicy === "existing") {
		if (typeof agentIdRaw === "string") throw new Error("Existing-schema agent drainage requires a real maintenance owner.");
		return assertNoExistingAgentDatabaseLeases(agentIdRaw, options);
	}
	const maintenance = typeof agentIdRaw === "string" ? void 0 : agentIdRaw;
	const agentId = typeof agentIdRaw === "string" ? normalizeAgentId(agentIdRaw) : void 0;
	const rows = runAssistantStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		return readAgentDatabaseLeases(database.db);
	}, options);
	const staleLeaseIds = rows.filter(isAgentDatabaseLeaseStale).map((row) => row.lease_id);
	if (staleLeaseIds.length > 0) runAssistantStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		for (const row of rows.filter((candidate) => staleLeaseIds.includes(candidate.lease_id))) clearAgentDatabaseLeaseVerifications(database.db, row.path, options.env);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "in", staleLeaseIds));
	}, options);
	const staleLeaseIdSet = new Set(staleLeaseIds);
	for (const row of rows) {
		if (staleLeaseIdSet.has(row.lease_id)) continue;
		const deletionFence = agentId ? prepareAgentDeletionPathFence({
			agentId: row.agent_id,
			path: row.path,
			fenceAgentId: agentId
		}, options) : void 0;
		let leaseStillExists = false;
		runAssistantStateWriteTransaction((database) => {
			maintenance?.assertOwnedInTransaction(database.db);
			ensureAgentDatabaseLeaseSchema(database.db);
			const db = getNodeSqliteKysely(database.db);
			leaseStillExists = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_database_leases").select("lease_id").where("lease_id", "=", row.lease_id)) !== void 0;
			if (leaseStillExists && row.agent_id !== agentId && deletionFence) assertAgentDeletionPathFence(database, deletionFence);
		}, options);
		if (leaseStillExists && (!agentId || row.agent_id === agentId)) {
			const remediation = agentId ? "." : "; stop that process and rerun testclaw doctor --fix.";
			throw new AssistantAgentDatabaseLeaseActiveError(`Agent ${row.agent_id} database is still open in another process${remediation}`);
		}
	}
}
/** Stable existing rows can be drained before the candidate is allowed to migrate. */
function assertNoExistingAgentDatabaseLeases(maintenance, options) {
	withExistingAgentLeaseWrite(maintenance, options, (db) => {
		const query = getNodeSqliteKysely(db);
		const rows = executeSqliteQuerySync(db, query.selectFrom("agent_database_leases").select([
			"agent_id",
			"lease_id",
			"owner_pid",
			"owner_start_time",
			"path"
		])).rows;
		for (const row of rows) {
			const currentStart = getFileLockProcessStartTime(row.owner_pid);
			if (isPidDefinitelyDead(row.owner_pid) || row.owner_start_time !== null && currentStart !== null && row.owner_start_time !== currentStart) {
				clearAgentDatabaseLeaseVerifications(db, row.path, options.env);
				executeSqliteQuerySync(db, query.deleteFrom("agent_database_leases").where("lease_id", "=", row.lease_id));
			} else throw new AssistantAgentDatabaseLeaseActiveError(`Agent ${row.agent_id} database is still open in another process; stop that process and retry.`);
		}
	});
}
//#endregion
export { renewAgentDatabaseMaintenanceAuthorityIfPresent as _, assertNoAssistantAgentDatabaseLeases as a, claimAssistantAgentDatabaseLease as c, prepareAssistantAgentDatabaseWorkerLease as d, readActiveAssistantAgentDatabaseLeasesReadOnly as f, releaseAssistantAgentDatabaseLease as g, releaseExitedAssistantAgentDatabaseLeaseInDatabase as h, assertAgentDatabaseMaintenanceAuthorityIfPresent as i, hasAgentDatabaseMaintenanceAuthority as l, recordAssistantAgentDatabaseIntegrityVerified as m, AssistantAgentDatabaseLeaseActiveError as n, assertNoAssistantAgentDatabaseLeasesReadOnly as o, readAssistantAgentDatabaseWorkerLeaseReceiptFromClaim as p, assertAgentDatabaseMaintenanceAuthority as r, assertAssistantAgentDatabaseLease as s, AGENT_DATABASE_MAINTENANCE_LEASE as t, invalidateAssistantAgentDatabaseIntegrityBeforeMutation as u, runWithAgentDatabaseMaintenanceAuthority as v };
