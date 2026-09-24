import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BboyngJR.mjs";
import { w as withStateSchemaFence } from "./sqlite-source-handle-CDYF24uv.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-BSZQ5Avg.mjs";
import { C as closeTrackedStateDatabase, S as testClawStateDatabaseCache, w as openTrackedStateDatabase } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { c as readSqliteSchemaCookie, s as getCanonicalSqliteTableNames, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BhQmGuZB.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { n as assertSupportedStateSchemaVersion } from "./testclaw-state-db-schema-version-DOTBthQx.mjs";
import { i as isExistingAssistantStateSchema, n as assertAssistantStateSchemaRepairAllowed } from "./testclaw-state-db-schema-policy-BQ7bZxNb.mjs";
import { D as assertAssistantStateDatabaseOwner, o as assertExistingAssistantStateRuntimeSchema } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { a as assertAssistantStateWriteAllowed, f as runWithAssistantStateWriteAccess } from "./testclaw-state-ownership-Czk4lNwX.mjs";
import { F as runCoordinatedStateTransaction, I as withSharedStateWriteCoordinator, d as recoverOrphanTaskDeliveryRows } from "./testclaw-state-db-BXFT1fUC.mjs";
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
