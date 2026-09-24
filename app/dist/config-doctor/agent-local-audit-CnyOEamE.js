import { t as configureExecutionDecisionWorkSink } from "./execution-decision-work-DA3KjYw9.js";
import { i as hasExecutionIdentityAdmissionSink, t as configureExecutionIdentityAdmissionSink } from "./execution-identity-admission-B6Lrfbks.js";
import { t as configureRuntimeActionDecisionSink } from "./runtime-action-decision-BeNeE26k.js";
import { t as createAuditEventRecorder } from "./audit-recorder-BheIq13q.js";
//#region src/commands/agent-local-audit.ts
/** Direct-local agent audit writer lifecycle shared by CLI entrypoints. */
/** Own one direct-process writer unless a surrounding runtime already owns it. */
function startAgentLocalAuditWriter(config, options = {}) {
	if (hasExecutionIdentityAdmissionSink()) return;
	const recorder = createAuditEventRecorder({
		getConfig: () => config,
		...options.stateDir ? { stateDir: options.stateDir } : {}
	});
	const clearAdmissionSink = configureExecutionIdentityAdmissionSink(recorder.recordExecutionIdentity);
	const clearDecisionWorkSink = configureExecutionDecisionWorkSink(recorder.recordExecutionDecisionWork);
	const clearRuntimeActionSink = configureRuntimeActionDecisionSink(recorder.recordExecutionDecision);
	return async () => {
		clearRuntimeActionSink();
		clearDecisionWorkSink();
		clearAdmissionSink();
		await recorder.stop();
	};
}
//#endregion
export { startAgentLocalAuditWriter };
