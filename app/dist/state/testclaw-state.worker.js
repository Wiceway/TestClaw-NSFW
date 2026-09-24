import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
import { t as assertNoActiveSqliteReaders } from "../sqlite-reader-lifecycle-BYUk2TxG.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-Bar1ps-o.mjs";
import { S as testClawStateDatabaseCache, y as retainAssistantStateDatabase } from "../testclaw-state-db-cache-DLl9ibxh.mjs";
import { D as assertAssistantStateDatabaseOwner } from "../testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { n as readPluginMetadataStateRowSync } from "../installed-plugin-index-row-CPW_ybax.mjs";
import { r as openAssistantStateDatabase } from "../testclaw-state-db-BXFT1fUC.mjs";
import { i as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-CtlVF-ml.mjs";
import { i as loadOrCreateDeviceIdentity, r as loadDeviceIdentityIfPresent } from "../device-identity-DxW0pian.mjs";
import { t as getSqliteWorkerStateContext } from "../sqlite-worker-state-context-RvnlMnYc.mjs";
import { r as executeAssistantStateLeaseCommand, t as acquireAssistantStateLeaseInWorker } from "../testclaw-state-lease-worker-wOdjTAij.mjs";
//#region src/state/testclaw-state.worker.ts
const loadAgentCleanup = createLazyRuntimeModule(() => import("../testclaw-agent-execution-cleanup.worker-DS8VBmKH.mjs"));
let agentCleanup;
const loadRuntime = createLazyRuntimeModule(() => import("../testclaw-state-worker-runtime-DeC9hICm.mjs"));
let runtime;
function createSqliteWorkerBackend(_input, context) {
	if (context.preparation?.type === "deviceIdentity") loadOrCreateDeviceIdentity({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment,
		identityKey: context.preparation.identityKey
	});
	return createSharedStateWorkerBackend(context, openAssistantStateDatabase({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}));
}
function openExistingSqliteWorkerBackend(_input, context) {
	return createSharedStateWorkerBackend(context);
}
function createSharedStateWorkerBackend(context, initialDatabase) {
	let nativeDatabase = initialDatabase;
	let borrow = nativeDatabase ? retainAssistantStateDatabase(nativeDatabase) : void 0;
	let closed = false;
	const open = () => {
		if (!nativeDatabase) {
			const opened = openAssistantStateDatabase({
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			});
			borrow = retainAssistantStateDatabase(opened);
			nativeDatabase = opened;
		}
		if (!nativeDatabase.db.isOpen || testClawStateDatabaseCache.getCachedAssistantStateDatabase(nativeDatabase.path) !== nativeDatabase) throw new Error("Shared-state worker lost its retained native database");
		return openAssistantStateDatabase({
			database: nativeDatabase,
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		});
	};
	return {
		[SQLITE_WORKER_PREPARE_COMMAND](commandType) {
			if (commandType === "agentDatabases.releaseExitedLease") {
				if (agentCleanup) return;
				return loadAgentCleanup().then((loaded) => {
					agentCleanup = loaded;
				});
			}
			if (commandType === "plugins.metadata.read" || commandType === "database.inspectIdle" || commandType === "stateLease.acquire" || commandType === "deviceIdentity.read" || commandType === "deviceIdentity.load" || commandType === "stateLease.verify" || commandType === "stateLease.renew" || commandType === "stateLease.release") return;
			if (runtime) return runtime.prepareSharedStateCommand(commandType);
			return loadRuntime().then((loaded) => {
				runtime = loaded;
				return runtime.prepareSharedStateCommand(commandType);
			});
		},
		execute(command) {
			if (closed) throw new Error("Shared-state worker is closed");
			if (command.type === "deviceIdentity.read") return loadDeviceIdentityIfPresent({
				path: context.databasePath,
				identityKey: command.input.identityKey,
				env: getSqliteWorkerStateContext().environment
			});
			if (command.type === "deviceIdentity.load") try {
				return loadOrCreateDeviceIdentity({
					path: context.databasePath,
					identityKey: command.input.identityKey,
					env: getSqliteWorkerStateContext().environment
				});
			} finally {
				const database = testClawStateDatabaseCache.getCachedAssistantStateDatabase(context.databasePath);
				if (!nativeDatabase && database) {
					borrow = retainAssistantStateDatabase(database);
					nativeDatabase = database;
				}
			}
			if (command.type === "agentDatabases.releaseExitedLease") {
				if (!agentCleanup) throw new Error("Agent database cleanup runtime is not prepared");
				return agentCleanup.executeAgentDatabaseCleanupCommand(command, open(), getSqliteWorkerStateContext().environment);
			}
			if (command.type === "stateLease.acquire") return acquireAssistantStateLeaseInWorker(command.input, context.databasePath, open);
			if (command.type === "stateLease.verify" || command.type === "stateLease.renew" || command.type === "stateLease.release") return executeAssistantStateLeaseCommand(command, open());
			if (command.type === "plugins.metadata.read") return readPluginMetadataStateRowSync(command.input.selector, {
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			}, command.input.artifactPreservingReadOnly);
			if (command.type === "database.inspectIdle") {
				if (!nativeDatabase?.db.isOpen || testClawStateDatabaseCache.getCachedAssistantStateDatabase(nativeDatabase.path) !== nativeDatabase) return "retire";
				assertAssistantStateDatabaseOwner(nativeDatabase.db, { pathname: nativeDatabase.path });
				return nativeDatabase.walMaintenance.inspectIdle?.() ?? "retire";
			}
			if (!runtime) throw new Error("Shared-state worker command runtime is not prepared");
			return runtime.executeSharedStateCommand(command, context, open, nativeDatabase?.db.isOpen === true);
		},
		assertSettled() {
			if (nativeDatabase) {
				assertTransactionUsable(nativeDatabase.db);
				if (nativeDatabase.db.isOpen && nativeDatabase.db.isTransaction) throw new Error("Shared-state worker retained an unsettled transaction");
				if (nativeDatabase.db.isOpen) assertNoActiveSqliteReaders(nativeDatabase.db, "Shared-state worker");
			}
		},
		close() {
			closed = true;
			borrow?.release();
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
