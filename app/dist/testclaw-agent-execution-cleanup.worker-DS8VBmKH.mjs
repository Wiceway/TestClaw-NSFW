import { v as requireAssistantStateDatabaseIdentity } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BXFT1fUC.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { h as releaseExitedAssistantAgentDatabaseLeaseInDatabase } from "./testclaw-agent-db-lease-gzW677CG.mjs";
//#region src/state/testclaw-agent-execution-cleanup.worker.ts
function executeAgentDatabaseCleanupCommand(command, database, env) {
	runAssistantStateWriteTransaction((current) => {
		if (current.path !== command.input.sharedStatePath || requireAssistantStateDatabaseIdentity(current).key !== command.input.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
		releaseExitedAssistantAgentDatabaseLeaseInDatabase(current.db, command.input, () => requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: "agent-integrity-invalidated"
		}));
	}, {
		database,
		path: database.path,
		env
	});
}
//#endregion
export { executeAgentDatabaseCleanupCommand };
