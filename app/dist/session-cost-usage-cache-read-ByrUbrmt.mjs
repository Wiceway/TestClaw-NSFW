import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DSeyJ5Sb.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { i as isTransientSqliteError } from "./unhandled-rejections-C1I3eiY5.mjs";
import { i as readSessionCostUsageRefreshLockInDatabase } from "./session-cost-usage-cache.kernel-B4_je1Ft.mjs";
//#region src/infra/session-cost-usage-cache-read.ts
/** File-backed calls belong to the transcript worker; incognito retains its process-held owner. */
function readSessionCostUsageCache(options, request) {
	try {
		const result = withAssistantAgentDatabaseReadOnly((database) => ({
			kind: request.kind,
			value: readSessionCostUsageRefreshLockInDatabase(database.db)
		}), {
			...options,
			env: cloneEnvWithPlatformSemantics(options.env ?? process.env)
		});
		if (result.found) return result.value;
	} catch (error) {
		if (!isTransientSqliteError(error)) throw error;
	}
	return {
		kind: request.kind,
		value: null
	};
}
//#endregion
export { readSessionCostUsageCache };
