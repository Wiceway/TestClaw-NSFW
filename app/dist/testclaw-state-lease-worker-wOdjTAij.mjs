import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CRW06h3K.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-Bar1ps-o.mjs";
import { o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as AssistantStateLeaseError, o as toAssistantStateLeaseVerificationError } from "./testclaw-state-lease-error-LeoKUUrG.mjs";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BXFT1fUC.mjs";
import { a as releaseAssistantStateLeaseInTransaction, o as renewAssistantStateLeaseInTransaction, r as readAssistantStateLeaseExpiry, t as acquireAssistantStateLeaseInTransaction } from "./testclaw-state-lease-store-D0QbC1Ab.mjs";
import { i as requestSqliteWorkerOperationAdmission, o as takeSqliteWorkerOperationAdmissionAttachment } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { r as leaseHeartbeatState } from "./testclaw-state-lease-heartbeat-shared-CRW-GXrj.mjs";
import { f as withLeaseWriteTransaction } from "./testclaw-state-lease-storage-DR9hdmgz.mjs";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-RvnlMnYc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/testclaw-state-lease-worker.ts
function takeLeaseExpiryObservation(identity) {
	const attachment = takeSqliteWorkerOperationAdmissionAttachment();
	if (!isRecord(attachment) || attachment.kind !== "state-lease-expiry" || !isDeepStrictEqual(attachment.identity, identity) || !(attachment.observation instanceof SharedArrayBuffer) || attachment.observation.byteLength !== (leaseHeartbeatState.startupPhase + 1) * BigInt64Array.BYTES_PER_ELEMENT) throw new Error("State lease worker requires its original expiry observation attachment");
	return new BigInt64Array(attachment.observation);
}
function publishLeaseExpiryObservation(shared, expiresAt) {
	if (Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.starting) Atomics.store(shared, leaseHeartbeatState.expiresAt, expiresAt);
}
function stageLeaseExpiryObservation(db, shared, expiresAt) {
	const value = BigInt(expiresAt ?? 0);
	if (!stageSqliteTransactionState(db, {
		stage() {},
		rollback() {},
		commit() {
			publishLeaseExpiryObservation(shared, value);
		}
	})) throw new Error("State lease expiry observation requires a coordinated transaction");
}
/** The live owner grants this exact transaction; the receipt alone grants nothing. */
function assertAssistantStateLeaseWorkerOwnedInTransaction(database, identity, purpose = "write", stage = "transaction") {
	if (!database.isTransaction) throw new Error("State lease worker ownership requires an active transaction");
	const readExpiry = () => {
		try {
			const expiresAt = readAssistantStateLeaseExpiry(database, identity);
			if (expiresAt === void 0) throw new AssistantStateLeaseError(`state lease ${identity.scope}/${identity.key} was lost`, { code: "TESTCLAW_STATE_LEASE_LOST" });
			return expiresAt;
		} catch (error) {
			throw toAssistantStateLeaseVerificationError(identity, error);
		}
	};
	const expiresAt = readExpiry();
	requestSqliteWorkerOperationAdmission({
		stage,
		facts: {
			kind: purpose === "write" ? "state-lease" : `state-lease-${purpose}`,
			identity,
			expiresAt
		}
	});
	return readExpiry();
}
function acquireAssistantStateLeaseInWorker(input, databasePath, open) {
	const { identity, leaseMs, operationLabel, schemaPolicy } = input;
	const shared = input.observeExpiry ? takeLeaseExpiryObservation(identity) : void 0;
	try {
		return withLeaseWriteTransaction({
			scope: "shared",
			schemaPolicy,
			options: {
				...schemaPolicy === "existing" ? {} : { database: open() },
				path: databasePath,
				env: getSqliteWorkerStateContext().environment
			}
		}, operationLabel, (db) => {
			const facts = {
				kind: "state-lease-acquire",
				identity
			};
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts
			});
			const result = acquireAssistantStateLeaseInTransaction(db, identity, leaseMs);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts
			});
			if (shared && result.kind === "acquired") stageLeaseExpiryObservation(db, shared, result.expiresAt);
			return result;
		}, TESTCLAW_SQLITE_BUSY_TIMEOUT_MS);
	} catch (cause) {
		throw new AssistantStateLeaseError("State lease acquisition could not complete", {
			code: "TESTCLAW_STATE_LEASE_STORAGE_FAILED",
			cause
		});
	}
}
function executeAssistantStateLeaseCommand(command, database) {
	if (command.type === "stateLease.verify") {
		const shared = takeLeaseExpiryObservation(command.input.identity);
		const expiresAt = runSqliteDeferredTransactionSync(database.db, () => assertAssistantStateLeaseWorkerOwnedInTransaction(database.db, command.input.identity, "verify"));
		publishLeaseExpiryObservation(shared, BigInt(expiresAt));
		return expiresAt;
	}
	const shared = command.type === "stateLease.renew" ? takeLeaseExpiryObservation(command.input.identity) : void 0;
	return runWithSqliteBusyTimeout(database.db, 0, () => runAssistantStateWriteTransaction(({ db }) => {
		if (command.type === "stateLease.renew") {
			assertAssistantStateLeaseWorkerOwnedInTransaction(db, command.input.identity, "renew");
			const expiresAt = renewAssistantStateLeaseInTransaction(db, command.input.identity, command.input.leaseMs);
			if (expiresAt === void 0) throw new AssistantStateLeaseError(`state lease ${command.input.identity.scope}/${command.input.identity.key} was lost`, { code: "TESTCLAW_STATE_LEASE_LOST" });
			assertAssistantStateLeaseWorkerOwnedInTransaction(db, command.input.identity, "renew", "commit");
			if (shared) stageLeaseExpiryObservation(db, shared, expiresAt);
			return expiresAt;
		}
		const facts = {
			kind: "state-lease-release",
			identity: command.input.identity
		};
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts
		});
		assertExistingDatabaseIdentity(database.path, command.input.databaseIdentity);
		releaseAssistantStateLeaseInTransaction(db, command.input.identity);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts
		});
		assertExistingDatabaseIdentity(database.path, command.input.databaseIdentity);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, {
		busyTimeoutMs: 0,
		operationLabel: command.input.operationLabel
	}));
}
//#endregion
export { assertAssistantStateLeaseWorkerOwnedInTransaction as n, executeAssistantStateLeaseCommand as r, acquireAssistantStateLeaseInWorker as t };
