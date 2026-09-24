import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { h as captureStateDatabaseCoordinatorRuntime } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { C as isExistingAssistantStateSchema, S as getExistingAssistantStateSchemaPath, r as captureAssistantStateDatabaseReadAdmission } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/testclaw-state-worker-context.ts
/** Capture host facts before asynchronous work, without opening SQLite. */
function captureAssistantStateWorkerContext(options = {}) {
	const env = options.env ?? process.env;
	const environment = {
		TESTCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { TESTCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	const databasePath = path.resolve(options.path ?? resolveAssistantStateSqlitePath(environment));
	isExistingAssistantStateSchema(databasePath);
	const existingSchemaPath = getExistingAssistantStateSchemaPath();
	const admission = captureAssistantStateDatabaseReadAdmission(databasePath);
	let runInCapturedSchemaScope;
	if (existingSchemaPath !== void 0) {
		const inCapturedScope = AsyncLocalStorage.snapshot();
		const assertCurrent = admission.assertCurrent;
		admission.assertCurrent = () => {
			assertCurrent();
			inCapturedScope(getExistingAssistantStateSchemaPath);
		};
		runInCapturedSchemaScope = (operation) => inCapturedScope(() => {
			admission.assertCurrent();
			return operation();
		});
	}
	return {
		maintenanceScope: getAssistantDatabaseMaintenanceScope(),
		admission,
		environment,
		coordinatorRuntime: captureStateDatabaseCoordinatorRuntime(),
		existingSchemaPath,
		runInCapturedSchemaScope
	};
}
//#endregion
export { captureAssistantStateWorkerContext as t };
