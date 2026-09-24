import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveAgentIdFromSessionKey } from "./session-key-AvQIavYt.js";
import { r as resolveConcreteSessionStorePath } from "./paths-ViQaz2td.js";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CAHggmXg.js";
import { d as visitSessionTranscriptMessageEvents, i as readRecentSessionTranscriptMessageEvents } from "./session-accessor.sqlite-active-events-CuvrkABH.js";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-BQlRWMsR.js";
import { i as createSessionTranscriptUsageAccumulator, n as readLatestSessionUsageFromTranscriptFileAsync, r as aggregateSessionTranscriptUsage } from "./session-utils.fs-DhpLc_dd.js";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-Q36QmRyz.js";
import path from "node:path";
//#region src/gateway/session-transcript-usage.ts
function extractMessagePayloads(entries) {
	return entries.map((entry) => asOptionalRecord(entry.event)?.message);
}
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile, void 0);
	const target = resolveSessionTranscriptReadTarget(scope);
	const transcriptScope = toTranscriptReadScope(target);
	return readRestoredSessionTranscript(transcriptScope, () => {
		const usage = createSessionTranscriptUsageAccumulator();
		visitSessionTranscriptMessageEvents(transcriptScope, (entry) => {
			usage.add(asOptionalRecord(entry.event)?.message);
		});
		return usage.finish();
	});
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	const target = resolveSessionTranscriptReadTarget(scope);
	const page = readRecentSessionTranscriptMessageEvents(toTranscriptReadScope(target), {
		maxBytes: Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8388608)),
		maxLines: 1e3,
		maxMessages: 1e3
	});
	return aggregateSessionTranscriptUsage(extractMessagePayloads(page.events));
}
//#endregion
export { readRecentSessionUsageFromTranscript as n, readLatestSessionUsageFromTranscriptAsync as t };
