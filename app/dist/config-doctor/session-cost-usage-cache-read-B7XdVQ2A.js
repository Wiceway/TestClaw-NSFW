import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { i as isTransientSqliteError } from "./unhandled-rejections-416EmJLJ.js";
import { i as readSessionCostUsageRefreshLockInDatabase } from "./session-cost-usage-cache.kernel-ChEWsPR4.js";
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
