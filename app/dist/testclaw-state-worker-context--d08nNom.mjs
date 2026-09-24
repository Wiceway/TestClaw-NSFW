import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { p as captureStateDatabaseCoordinatorRuntime } from "./sqlite-source-handle-CDYF24uv.mjs";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import { r as captureAssistantStateDatabaseReadAdmission } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { i as isExistingAssistantStateSchema, r as getExistingAssistantStateSchemaPath } from "./testclaw-state-db-schema-policy-BQ7bZxNb.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0zD4p1G.mjs";
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
