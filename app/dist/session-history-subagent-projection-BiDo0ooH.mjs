import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-DGwPGE_D.mjs";
import { t as createBoundSessionHistorySubagentProjection } from "./session-history-readonly-reader-DTfkcL6J.mjs";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-ENI63DQX.mjs";
//#region src/gateway/session-history-subagent-projection.ts
/** Bind host-owned stores and retain their admission for one display operation. */
function createSessionHistorySubagentProjection(scope, options = {}) {
	const databaseOptions = toDatabaseOptions(resolveSqliteTranscriptReadScope(scope));
	const currentSource = {
		agentId: databaseOptions.agentId,
		path: resolveAssistantAgentSqlitePath(databaseOptions)
	};
	const context = captureAssistantStateWorkerContext();
	const sourceReads = prepareGatewaySessionStoreReadSources({
		cfg: getRuntimeConfig(),
		currentSource,
		env: process.env,
		registryPath: context.admission.databasePath,
		deferSources: options.deferSources
	});
	const bound = createBoundSessionHistorySubagentProjection((read) => withCurrentProjectionSnapshot(scope, read, { readOnly: true }), {
		path: context.admission.databasePath,
		environment: context.environment,
		coordinatorRuntime: context.coordinatorRuntime
	}, () => sourceReads.sources);
	const assertCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		sourceReads.assertCurrent();
	};
	const readCurrent = (read) => {
		assertCurrent();
		const result = read();
		assertCurrent();
		return result;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => readCurrent(() => bound.isSubagentSession(sessionKey)),
		isSubagentRunMessage: (runId, messageSeq) => readCurrent(() => bound.isSubagentRunMessage(runId, messageSeq))
	};
}
//#endregion
export { createSessionHistorySubagentProjection as t };
