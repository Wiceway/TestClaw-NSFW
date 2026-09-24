import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-g2PTirPA.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { T as StateDatabaseCoordinatorContentionError } from "./sqlite-source-handle-CDYF24uv.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { f as withAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { n as AssistantStateLeaseError, o as toAssistantStateLeaseVerificationError } from "./testclaw-state-lease-error-LeoKUUrG.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { c as runAssistantStateWriteTransaction, l as runWithAssistantStateBusyTimeout, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
import { a as releaseAssistantStateLeaseInTransaction, o as renewAssistantStateLeaseInTransaction, r as readAssistantStateLeaseExpiry } from "./testclaw-state-lease-store-D0QbC1Ab.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-arRyGxwp.mjs";
import "./backoff-CszdOMiF.mjs";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import { t as runExistingAssistantStateWriteTransaction } from "./testclaw-state-db-existing-write-DCUyCVZ2.mjs";
import path from "node:path";
//#region src/state/testclaw-state-lease-storage.ts
const leaseSchema = ["schema_meta", "state_leases"].map((table) => extractSqliteTableSchema(TESTCLAW_STATE_SCHEMA_SQL, table, {
	endMarker: ") STRICT;",
	errorMessage: "Existing lease schema is unavailable."
})).join("\n");
function prepareLeaseDatabase(database) {
	if (database.schemaPolicy !== "existing") runWithAssistantStateBusyTimeout(() => void 0, database.options ?? {}, 0);
}
function resolveLeaseDatabasePath(database) {
	return database.schemaPolicy === "existing" ? path.resolve(database.options?.path ?? resolveAssistantStateSqlitePath(database.options?.env)) : openAssistantStateDatabase(database.options).path;
}
function readLeaseDatabase(database, operation) {
	return database.schemaPolicy === "existing" ? withAssistantStateDatabaseReadOnly(({ db }) => operation(db), database.options) : operation(openAssistantStateDatabase(database.options).db);
}
async function acquireLease(database, input, assertCurrent, signal) {
	if (database.options?.readOnly) throw new Error("State lease acquisition requires writable storage");
	if (database.schemaPolicy === "existing" && database.options?.database) throw new Error("Existing-state writes require their own tracked writable connection.");
	const opened = database.schemaPolicy === "existing" ? void 0 : openAssistantStateDatabase(database.options);
	const context = captureAssistantStateWorkerContext({
		...database.options,
		path: opened?.path ?? resolveLeaseDatabasePath(database)
	});
	const assertAdmission = () => {
		context.admission.assertCurrent();
		assertCurrent();
		if (opened?.db.isTransaction) throw new AssistantStateLeaseError("State lease acquisition requires no active transaction", { code: "TESTCLAW_STATE_LEASE_INVALID_INPUT" });
	};
	const result = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "stateLease.acquire",
		input: {
			...input,
			schemaPolicy: database.schemaPolicy
		}
	}, { signal }), {
		existingOnly: database.schemaPolicy === "existing",
		assertCurrent: assertAdmission,
		createAdmission: createSqliteWorkerWriteAdmission(assertAdmission, [context.admission.databasePath])
	});
	if (!result) throw new Error("State lease acquisition requires an existing database");
	return result;
}
function withLeaseWriteTransaction(database, operationLabel, operation, busyTimeoutMs = 0) {
	if (database.schemaPolicy === "existing") return runExistingAssistantStateWriteTransaction(({ db }) => operation(db), database.options ?? {}, {
		operationLabel,
		busyTimeoutMs,
		schemaSql: leaseSchema
	});
	const stateDatabase = openAssistantStateDatabase(database.options);
	const run = () => runAssistantStateWriteTransaction(({ db }) => operation(db), {
		...database.options,
		database: stateDatabase
	}, {
		operationLabel,
		busyTimeoutMs
	});
	return runWithSqliteBusyTimeout(stateDatabase.db, busyTimeoutMs, run);
}
const STATE_LEASE_WRITE_BACKOFF = {
	initialMs: 25,
	maxMs: 250,
	factor: 1.5,
	jitter: .25
};
const RELEASE_RETRY_TIMEOUT_MS = 2e3;
function isAssistantStateLeaseWriteContention(error) {
	return isSqliteLockError(error) || error instanceof StateDatabaseCoordinatorContentionError && error.family === "state-lifecycle";
}
function renewAssistantStateLease(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel, (db) => {
		const expiresAt = renewAssistantStateLeaseInTransaction(db, params, params.leaseMs);
		if (expiresAt === void 0) throw new AssistantStateLeaseError(`${params.leaseLabel} ${params.scope}/${params.key} was lost`, { code: "TESTCLAW_STATE_LEASE_LOST" });
		return expiresAt;
	});
}
function assertAssistantStateLeaseOwnedInDatabase(database, params) {
	const expiresAt = readAssistantStateLeaseExpiry(database, params);
	if (expiresAt === void 0) throw new AssistantStateLeaseError(`${params.leaseLabel} ${params.scope}/${params.key} was lost`, { code: "TESTCLAW_STATE_LEASE_LOST" });
	return expiresAt;
}
function verifyAssistantStateLeaseOwnership(params) {
	try {
		if (params.transaction) return assertAssistantStateLeaseOwnedInDatabase(params.transaction, params);
		if (!params.database) throw new Error("state lease ownership check requires a database");
		return readLeaseDatabase(params.database, (db) => assertAssistantStateLeaseOwnedInDatabase(db, params));
	} catch (error) {
		throw toAssistantStateLeaseVerificationError(params, error);
	}
}
function releaseAssistantStateLease(params) {
	withLeaseWriteTransaction(params.database, params.operationLabel, (db) => releaseAssistantStateLeaseInTransaction(db, params));
}
async function releaseAssistantStateLeaseBestEffort(params, execute) {
	const deadline = performance.now() + RELEASE_RETRY_TIMEOUT_MS;
	let attempt = 0;
	while (true) try {
		if (execute) await execute();
		else releaseAssistantStateLease(params);
		return;
	} catch (error) {
		const now = performance.now();
		if (!isAssistantStateLeaseWriteContention(error) || now >= deadline) {
			if (execute) throw error;
			return;
		}
		attempt += 1;
		await sleepWithAbort(Math.min(deadline - now, computeBackoff(STATE_LEASE_WRITE_BACKOFF, attempt)));
	}
}
//#endregion
export { prepareLeaseDatabase as a, releaseAssistantStateLeaseBestEffort as c, verifyAssistantStateLeaseOwnership as d, withLeaseWriteTransaction as f, isAssistantStateLeaseWriteContention as i, renewAssistantStateLease as l, acquireLease as n, readLeaseDatabase as o, assertAssistantStateLeaseOwnedInDatabase as r, releaseAssistantStateLease as s, STATE_LEASE_WRITE_BACKOFF as t, resolveLeaseDatabasePath as u };
