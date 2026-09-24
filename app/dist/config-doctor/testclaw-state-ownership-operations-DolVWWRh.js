import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { N as configureSqliteWalMaintenance } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { r as assertSqliteIntegrity } from "./error-utils-B4pDpAz2.js";
import { H as resolveDatabasePath, L as assertAssistantStateDatabaseForMaintenance } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import { c as inspectAssistantStateOwnershipFromDatabase, d as runWithAssistantStateOwnershipCoordinator, i as AssistantStateOwnershipMetadataError, t as STATE_SUPERVISION_KEY, u as normalizeAssistantStateManagerId } from "./testclaw-state-ownership-B0rMwXgw.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
//#region src/state/testclaw-state-ownership-operations.ts
function requireOwnershipCheckpoint(walMaintenance, databasePath) {
	if (!walMaintenance.checkpoint()) throw new Error(`External ownership was committed for ${databasePath}, but its WAL checkpoint failed. Retry the same ownership claim before activating the supervisor.`);
}
function claimOwnershipRow(database, databasePath, managerId, repairMalformed) {
	let current = null;
	try {
		current = inspectAssistantStateOwnershipFromDatabase(database, databasePath);
	} catch (error) {
		if (!repairMalformed || !(error instanceof AssistantStateOwnershipMetadataError)) throw error;
	}
	if (current) {
		if (current.managerId !== managerId) throw new Error(`Assistant shared state is already claimed by external manager ${current.managerId}; manager ${managerId} cannot replace that durable ownership.`);
		return current;
	}
	const ownership = {
		version: 1,
		mode: "external",
		managerId,
		claimedAt: Date.now()
	};
	const valueJson = JSON.stringify(ownership);
	const stateDb = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, stateDb.insertInto("config_machine_state").values({
		state_key: STATE_SUPERVISION_KEY,
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	})));
	return ownership;
}
function repairMalformedOwnershipClaim(databasePath, managerId) {
	return runWithAssistantStateOwnershipCoordinator(databasePath, "malformed state ownership repair/checkpoint", () => {
		const database = openNodeSqliteDatabase(databasePath);
		let walMaintenance;
		try {
			database.exec(`PRAGMA busy_timeout = ${TESTCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSqliteIntegrity(database, databasePath);
			assertAssistantStateDatabaseForMaintenance(database, { pathname: databasePath });
			walMaintenance = configureSqliteWalMaintenance(database, {
				busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
				checkpointIntervalMs: 0,
				checkpointMode: "TRUNCATE",
				databaseLabel: "Assistant shared state ownership",
				databasePath
			});
			const ownership = runSqliteImmediateTransactionSync(database, () => {
				assertAssistantStateDatabaseForMaintenance(database, { pathname: databasePath });
				return claimOwnershipRow(database, databasePath, managerId, true);
			}, {
				busyTimeoutMs: TESTCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: databasePath,
				operationLabel: "state.ownership.repair"
			});
			requireOwnershipCheckpoint(walMaintenance, databasePath);
			return ownership;
		} finally {
			walMaintenance?.close({ checkpointMode: "PASSIVE" });
			clearNodeSqliteKyselyCacheForDatabase(database);
			database.close();
		}
	});
}
/** Claim durable shared-state write ownership for the active external supervisor. */
function claimAssistantStateOwnership(managerId, options = {}) {
	const env = options.env ?? process.env;
	if (!isGatewayExternallySupervised(env)) throw new Error("Claiming external shared-state ownership requires TESTCLAW_SUPERVISOR_MODE=external.");
	const normalizedManagerId = normalizeAssistantStateManagerId(managerId);
	try {
		const database = openAssistantStateDatabase(options);
		return runWithAssistantStateOwnershipCoordinator(database.path, "state ownership claim/checkpoint", () => {
			const ownership = runAssistantStateWriteTransaction(({ db, path: databasePath }) => claimOwnershipRow(db, databasePath, normalizedManagerId, false), {
				...options,
				database
			}, { operationLabel: "state.ownership.claim" });
			requireOwnershipCheckpoint(database.walMaintenance, database.path);
			return ownership;
		});
	} catch (error) {
		if (!(error instanceof AssistantStateOwnershipMetadataError)) throw error;
		const ownership = repairMalformedOwnershipClaim(resolveDatabasePath(options), normalizedManagerId);
		openAssistantStateDatabase(options);
		return ownership;
	}
}
//#endregion
export { claimAssistantStateOwnership };
