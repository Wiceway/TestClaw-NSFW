import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as TESTCLAW_STATE_SCHEMA_SQL } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { t as runExistingAssistantStateWriteTransaction } from "./testclaw-state-db-existing-write-DCUyCVZ2.mjs";
import { n as requireNodeWorkerProcessIdentity, t as inspectNodeWorkerProcessIdentity } from "./node-worker-process-identity-BeLySUX6.mjs";
import { n as readNodeWorkerLaunchReceipt } from "./node-worker-launch-store.kernel-BEsH7Y8_.mjs";
//#region src/node-host/node-worker-lineage-completion.ts
const COMPLETION_SCHEMA = ["node_worker_launches", "node_worker_launch_cleanup"].map((table) => extractSqliteTableSchema(TESTCLAW_STATE_SCHEMA_SQL, table)).join("\n");
/** The anchor records root exit and positive lineage EOF before extinguishing its own group. */
function recordNodeWorkerLineageSettled(binding) {
	const worker = requireNodeWorkerProcessIdentity(process.pid);
	return runExistingAssistantStateWriteTransaction(({ db }) => {
		const current = readNodeWorkerLaunchReceipt(db, binding.launchId);
		if (!current || current.state !== "running" || current.planHash !== binding.planHash || current.workerCleanupMode !== "owned-anchor" || current.container || current.supervisor.pid !== binding.supervisor.pid || current.supervisor.startTime !== binding.supervisor.startTime || current.worker?.pid !== worker.pid || current.worker.startTime !== worker.startTime || inspectNodeWorkerProcessIdentity(worker) !== "live") return false;
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("node_worker_launch_cleanup").set({ lineage_settled: 1 }).where("launch_id", "=", binding.launchId).where("cleanup_mode", "=", "owned-anchor")).numAffectedRows === 1n;
	}, {
		path: binding.databasePath,
		env: {
			...process.env,
			TESTCLAW_SUPERVISOR_MODE: binding.externallySupervised ? "external" : void 0
		}
	}, {
		schemaSql: COMPLETION_SCHEMA,
		operationLabel: "node-worker-launch.lineage-settled"
	});
}
//#endregion
export { recordNodeWorkerLineageSettled };
