import { a as throwSqliteLifecycleErrors } from "./sqlite-coordinator-BtCcPgOj.mjs";
import { r as readDatabasePathIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { s as invalidateAssistantAgentDatabaseValidation } from "./testclaw-agent-db-validation-cache-DBMmC7T_.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { d as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-arRyGxwp.mjs";
import { r as openAssistantStateWorkerCleanupStore } from "./testclaw-state-worker-store-CirfybVZ.mjs";
//#region src/state/testclaw-agent-execution-cleanup.ts
/** Release only this owner's prepared lease after the broker certifies native retirement. */
async function cleanupRetiredAgentDatabaseLease(params) {
	params.assertOwned();
	await params.stopped;
	params.assertOwned();
	if ((await readDatabasePathIdentity(params.lease.sharedStatePath)).key !== params.lease.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
	const context = {
		environment: params.context.environment,
		coordinatorRuntime: {
			...params.context.coordinatorRuntime,
			keepAlive: false
		},
		existingSchemaPath: params.context.existingSchemaPath
	};
	const store = await openAssistantStateWorkerCleanupStore(params.lease.sharedStatePath, context, () => params.assertOwned()).catch((error) => {
		if (error instanceof Error) {
			error.message += ` (leaseId=${params.lease.leaseId}, path=${params.lease.path})`;
			error.stack = `${error.name}: ${error.message}\n${error.stack ?? ""}`;
		}
		throw error;
	});
	if (!store) throw new Error("Retired agent cleanup lost its original shared database");
	const errors = [];
	try {
		await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type: "agentDatabases.releaseExitedLease",
			input: params.lease
		}), context, () => params.assertOwned(), () => ({
			nativeLocations: [params.lease.sharedStatePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				params.assertOwned();
				if (request.stage === "prepare" && request.facts === "agent-integrity-invalidated") invalidateAssistantAgentDatabaseValidation(params.lease.path);
				grant();
			})
		}));
	} catch (error) {
		errors.push(error);
	}
	try {
		await store.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retired agent lease cleanup and Worker close failed");
}
//#endregion
export { cleanupRetiredAgentDatabaseLease as t };
