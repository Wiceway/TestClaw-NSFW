import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { t as openNodeSqliteDatabase } from "../../node-sqlite-DhoOHVHp.mjs";
import { r as tableExists } from "../../testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory } from "../../sqlite-source-handle-CDYF24uv.mjs";
import { u as runSqliteReadOnlyWorkerSync } from "../../sqlite-readonly-worker-6W33iy-a.mjs";
import { r as openAssistantStateReadConnection } from "../../testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-B4qQGSM6.mjs";
import { r as serializeCronLoadError, t as loadCronStoreFromDatabase } from "../../load.kernel-BfzE9-e-.mjs";
//#region src/cron/store/read-only.worker.ts
serveWorkerTasks(async (input, _channel, control) => {
	try {
		if (!isRecord(input) || typeof input.location !== "string" || typeof input.storeKey !== "string" || input.stagingRoot !== void 0 && typeof input.stagingRoot !== "string" || !isRecord(input.coordinatorRuntime) || typeof input.coordinatorRuntime.directory !== "string" || typeof input.coordinatorRuntime.keepAlive !== "boolean") throw new Error("Cron read-only worker requires a database location and store key");
		const { location, storeKey, stagingRoot } = input;
		const runtime = {
			directory: input.coordinatorRuntime.directory,
			keepAlive: input.coordinatorRuntime.keepAlive
		};
		return await control.runNativeSection(() => withStateDatabaseCoordinatorRuntimeDirectory(runtime, () => {
			const connection = stagingRoot ? openAssistantStateReadConnection(location, runSqliteReadOnlyWorkerSync(location, stagingRoot), void 0, stagingRoot) : void 0;
			const db = connection?.database.db ?? openNodeSqliteDatabase(location, { readOnly: true });
			try {
				return {
					ok: true,
					loaded: tableExists(db, "cron_jobs") ? loadCronStoreFromDatabase(db, storeKey) : void 0
				};
			} finally {
				if (connection) connection.close();
				else db.close();
			}
		}));
	} catch (error) {
		return {
			ok: false,
			error: serializeCronLoadError(error)
		};
	}
});
//#endregion
export {};
