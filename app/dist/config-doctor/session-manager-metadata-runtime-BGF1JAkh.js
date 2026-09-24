import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-olf_92pI.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.js";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B-Vaprol.js";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-CW-keGmb.js";
import { t as openAssistantAgentSqliteWorkerStore } from "./testclaw-agent-worker-store-f5L-lhBP.js";
//#region src/agents/sessions/session-manager-metadata-runtime.ts
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionManagerMetadata);
const log = createSubsystemLogger("agents/session-metadata");
/** Each command settles and unbinds before the next; the enclosing manager keeps its FIFO turn. */
async function withSessionMetadataWorker(options, database, assertCurrent, operation) {
	const worker = await openAssistantAgentSqliteWorkerStore(options, database.db, {
		moduleUrl,
		input: void 0
	});
	let result;
	try {
		result = {
			ok: true,
			value: await operation({ execute: (command, commandOptions) => worker.run(async (scope) => {
				const reply = await scope.execute(command, commandOptions);
				if (!reply.ok) throw new SessionTranscriptWriterClaimReboundError(reply.refusal);
				return reply.value;
			}, assertCurrent) })
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		await worker.close();
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Session metadata operation and cleanup failed", result.error);
		try {
			log.warn(`Session metadata completed before cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	}
	if (!result.ok) throw result.error;
	return result.value;
}
//#endregion
export { withSessionMetadataWorker };
