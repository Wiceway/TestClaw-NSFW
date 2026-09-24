import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { f as setSqliteBusyTimeout } from "./sqlite-transaction-C94DYooc.js";
import { E as withStateSchemaFence } from "./sqlite-live-snapshot-C0XwFcJs.js";
import "./testclaw-state-db-contract-CdyGtChZ.js";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BppRXydv.js";
import { n as SqliteRepairableForeignKeyError, r as assertSqliteIntegrity } from "./error-utils-B4pDpAz2.js";
import { A as closeTrackedStateDatabase, C as isExistingAssistantStateSchema, D as assertSupportedStateSchemaVersion, Gt as getCanonicalSqliteTableNames, Kt as readSqliteSchemaCookie, b as testClawStateDatabaseCache, j as openTrackedStateDatabase, x as assertAssistantStateSchemaRepairAllowed, zt as assertSqliteSchemaContains } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { R as assertAssistantStateDatabaseOwner, _ as assertExistingAssistantStateRuntimeSchema } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { a as assertAssistantStateWriteAllowed, f as runWithAssistantStateWriteAccess } from "./testclaw-state-ownership-B0rMwXgw.js";
import { M as runCoordinatedStateTransaction, N as withSharedStateWriteCoordinator, d as recoverOrphanTaskDeliveryRows } from "./testclaw-state-db-BAeysXj_.js";
import fs from "node:fs";
import path from "node:path";
//#region src/state/testclaw-state-db-existing-write.ts
/** Validate only the stable storage subset used by an existing-schema owner.
* This read neither repairs nor grants write authority; callers retain their
* actual handle, generation, lease and publication checks. */
function assertExistingAssistantStateSchema(db, pathname, schemaSql) {
	const version = assertSupportedStateSchemaVersion(db, pathname);
	assertAssistantStateDatabaseOwner(db, { pathname });
	const metadata = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "primary"));
	if (version < 1 || metadata?.schema_version !== version) throw new Error("Existing-state schema metadata is inconsistent.");
	assertSqliteIntegrity(db, pathname);
	assertSqliteSchemaContains(db, pathname, schemaSql);
	return version;
}
/** A synchronous write to an already-compatible, caller-owned schema subset.
* No database bootstrap, schema repair, journal-mode setup, cached publication or WAL timer.
* First-use owners may install their declared additive tables; existing objects
* must already match. This never opens or migrates the full runtime schema.
* The real handle and write coordinators cover open, transaction, and close.
*/
function runExistingAssistantStateWriteTransaction(operation, options, contract) {
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const env = options.env ?? process.env;
	const busyTimeoutMs = contract.busyTimeoutMs ?? 5e3;
	const pathname = path.resolve(options.path ?? resolveAssistantStateSqlitePath(env));
	const existingSchema = isExistingAssistantStateSchema(pathname);
	if (contract.recoverTaskDeliveryOrphans) assertAssistantStateSchemaRepairAllowed(pathname);
	const original = fs.lstatSync(pathname);
	if (!original.isFile()) throw new Error("Existing-state write requires a regular database file.");
	const assertSameFile = () => {
		const current = fs.lstatSync(pathname);
		if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino) throw new Error("Existing-state database generation changed.");
	};
	const write = () => withSharedStateWriteCoordinator({
		databasePath: pathname,
		busyTimeoutMs
	}, () => runWithAssistantStateWriteAccess({
		databasePath: pathname,
		env,
		busyTimeoutMs
	}, contract.operationLabel, () => {
		assertSameFile();
		testClawStateDatabaseCache.assertAssistantStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		const db = openTrackedStateDatabase(pathname, {
			existingOnly: true,
			...contract.recoverTaskDeliveryOrphans ? { enableForeignKeyConstraints: false } : {}
		});
		try {
			setSqliteBusyTimeout(db, busyTimeoutMs);
			return runCoordinatedStateTransaction(db, () => {
				assertSameFile();
				assertAssistantStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env
				});
				if (existingSchema) assertExistingAssistantStateRuntimeSchema(db, pathname);
				const validate = () => assertExistingAssistantStateSchema(db, pathname, contract.initializeAdditiveSchema ? "" : contract.schemaSql);
				let version;
				let recoveryChanges = [];
				try {
					version = validate();
				} catch (error) {
					if (!contract.recoverTaskDeliveryOrphans || !(error instanceof SqliteRepairableForeignKeyError)) throw error;
					recoveryChanges = recoverOrphanTaskDeliveryRows(db, pathname);
					version = validate();
				}
				if (contract.initializeAdditiveSchema) {
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, { allowedMissingTables: getCanonicalSqliteTableNames(contract.schemaSql) });
					db.exec(contract.schemaSql);
					assertSqliteSchemaContains(db, pathname, contract.schemaSql);
				}
				const schemaVersion = readSqliteSchemaCookie(db);
				const result = operation({
					db,
					path: pathname,
					recoveryChanges
				});
				assertSameFile();
				if (readSqliteUserVersion(db) !== version || readSqliteSchemaCookie(db) !== schemaVersion) throw new Error("Existing-state transaction cannot migrate schema.");
				if (contract.recoverTaskDeliveryOrphans) assertSqliteIntegrity(db, pathname);
				return result;
			}, {
				busyTimeoutMs,
				databaseLabel: pathname,
				operationLabel: contract.operationLabel
			});
		} finally {
			clearNodeSqliteKyselyCacheForDatabase(db);
			closeTrackedStateDatabase(db);
		}
	}));
	return contract.recoverTaskDeliveryOrphans ? withStateSchemaFence({ databasePath: pathname }, write) : write();
}
//#endregion
export { runExistingAssistantStateWriteTransaction as t };
