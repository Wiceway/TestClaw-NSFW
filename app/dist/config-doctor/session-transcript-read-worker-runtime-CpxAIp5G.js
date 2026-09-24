import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-jRWDObfR.js";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.js";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B-Vaprol.js";
import { t as WorkerTaskPool } from "./worker-task-pool-DdST9izh.js";
import "./session-transcript-projection-error-D01U6hs1.js";
import { r as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors--Wehxnza.js";
//#region src/config/sessions/session-transcript-read-worker-runtime.ts
function prepareSqliteReadWorker() {
	ensureSqliteLibrarySelected();
	return { options: {} };
}
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
const modelContextReads = new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1
});
new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1,
	sharedCompute: true
});
const branchSummaries = new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1,
	sharedCompute: true
});
async function readSessionTranscriptModelContextAsync(target, admission, signal, through, limits) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "model-context",
		target,
		admission,
		through,
		limits
	}, {
		timeoutMs: 6e4,
		signal
	}));
	if (!("events" in value)) throw new Error("Session context worker returned a database target instead of context");
	return value;
}
async function resolveSessionSqliteTargetInWorker(input, signal) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "sqlite-target",
		...input
	}, {
		inputBytes: JSON.stringify(input).length * 2,
		timeoutMs: 6e4,
		signal
	}));
	if (!("target" in value)) throw new Error("Session context worker returned context instead of a database target");
	return value.target;
}
async function runSessionBranchSummaryWorkerRequest(request, signal) {
	return unwrapSessionTranscriptWorkerReply(await branchSummaries.run({
		kind: "branch-summaries",
		request
	}, {
		inputBytes: 2 * (request.database.agentId.length + request.database.path.length + request.databaseIdentity.length + request.sessionKey.length + request.sessionId.length + (request.lifecycleRevision?.length ?? 0)),
		timeoutMs: 6e4,
		signal
	}));
}
//#endregion
export { resolveSessionSqliteTargetInWorker as n, runSessionBranchSummaryWorkerRequest as r, readSessionTranscriptModelContextAsync as t };
