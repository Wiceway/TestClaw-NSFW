import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { f as listTasksForOwnerKey } from "./task-registry-query-R9q--_2Z.js";
import "./runtime-internal-CtpnHnDF.js";
import { m as getInternalToolResultProvenance, s as attachInternalToolResultProvenance } from "./internal-hooks-A8m3oGkR.js";
//#region src/agents/tools/tts-tool-result-provenance.ts
const coreTtsMediaByProvenance = /* @__PURE__ */ new WeakMap();
const coreTtsProvenanceByAttemptResult = /* @__PURE__ */ new WeakMap();
function markCoreTtsToolResult(result, mediaUrls) {
	const provenance = {};
	coreTtsMediaByProvenance.set(provenance, Object.freeze([...mediaUrls]));
	return attachInternalToolResultProvenance(result, provenance);
}
function getCoreTtsToolResultMediaUrls(result) {
	if (typeof result !== "object" || result === null) return;
	const provenance = getInternalToolResultProvenance(result);
	return provenance ? coreTtsMediaByProvenance.get(provenance) : void 0;
}
function markCoreTtsAttemptResult(result, mediaUrls, operationalRunInstance) {
	coreTtsProvenanceByAttemptResult.set(result, Object.freeze({
		mediaUrls: Object.freeze([...mediaUrls]),
		operationalRunInstance
	}));
	return result;
}
/** Transfer only built-in TTS provenance; callers cannot mint delivery authority. */
function transferCoreTtsToolResultProvenance(toolResult, attemptResult, eligibleMediaUrls, operationalRunInstance) {
	const toolMediaUrls = getCoreTtsToolResultMediaUrls(toolResult);
	if (!toolMediaUrls) return attemptResult;
	const eligible = new Set(eligibleMediaUrls.map((url) => url.trim()));
	const transferred = toolMediaUrls.filter((url) => eligible.has(url.trim()));
	if (transferred.length === 0) return attemptResult;
	const existing = coreTtsProvenanceByAttemptResult.get(attemptResult)?.mediaUrls ?? [];
	return markCoreTtsAttemptResult(attemptResult, [.../* @__PURE__ */ new Set([...existing, ...transferred])], operationalRunInstance);
}
/** Core lifecycle copies preserve attestation; plugin-created result copies stay untrusted. */
function copyCoreTtsAttemptResultProvenance(source, target) {
	const provenance = coreTtsProvenanceByAttemptResult.get(source);
	if (provenance) coreTtsProvenanceByAttemptResult.set(target, provenance);
	return target;
}
function getCoreTtsAttemptResultMediaUrls(result, deliveredMediaUrls, operationalRunInstance) {
	const provenance = coreTtsProvenanceByAttemptResult.get(result);
	if (!provenance || provenance.operationalRunInstance !== operationalRunInstance) return [];
	const delivered = new Set(deliveredMediaUrls?.map((url) => url.trim()));
	return provenance.mediaUrls.filter((url) => delivered.has(url.trim()));
}
//#endregion
//#region src/agents/session-async-task-status.ts
/**
* Session async-task lookup helpers for avoiding duplicate long-running work
* and reporting the active task back through tool/status metadata.
*/
const DEFAULT_ACTIVE_STATUSES = /* @__PURE__ */ new Set(["queued", "running"]);
/** Find the active queued/running task that matches a session and optional filters. */
function findActiveSessionTask(params) {
	const normalizedSessionKey = normalizeOptionalString(params.sessionKey);
	if (!normalizedSessionKey) return;
	const statuses = params.statuses ?? DEFAULT_ACTIVE_STATUSES;
	const taskKind = normalizeOptionalString(params.taskKind);
	const taskLabel = normalizeOptionalString(params.task);
	const sourceIdPrefix = normalizeOptionalString(params.sourceIdPrefix);
	const matches = listTasksForOwnerKey(normalizedSessionKey).filter((task) => {
		if (task.scopeKind !== "session") return false;
		if (params.runtime && task.runtime !== params.runtime) return false;
		if (!statuses.has(task.status)) return false;
		if (taskKind && task.taskKind !== taskKind) return false;
		if (taskLabel) {
			if (normalizeOptionalString(task.task) !== taskLabel) return false;
		}
		if (sourceIdPrefix) {
			const sourceId = normalizeOptionalString(task.sourceId) ?? "";
			if (sourceId !== sourceIdPrefix && !sourceId.startsWith(`${sourceIdPrefix}:`)) return false;
		}
		return true;
	});
	if (matches.length === 0) return;
	return matches.find((task) => task.status === "running") ?? matches[0];
}
/** Build tool details that point callers at the already-active async task. */
function buildSessionAsyncTaskStatusDetails(task) {
	return {
		async: true,
		active: true,
		existingTask: true,
		status: task.status,
		task: {
			taskId: task.taskId,
			...task.runId ? { runId: task.runId } : {}
		},
		...task.taskKind ? { taskKind: task.taskKind } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.sourceId ? { sourceId: task.sourceId } : {}
	};
}
//#endregion
export { getCoreTtsToolResultMediaUrls as a, transferCoreTtsToolResultProvenance as c, getCoreTtsAttemptResultMediaUrls as i, findActiveSessionTask as n, markCoreTtsAttemptResult as o, copyCoreTtsAttemptResultProvenance as r, markCoreTtsToolResult as s, buildSessionAsyncTaskStatusDetails as t };
