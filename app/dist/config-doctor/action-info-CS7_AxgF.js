import { F as timestampMsToIsoString } from "./number-coercion-0M4tZV2c.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { u as resolveSubagentDisplayStatus } from "./subagent-run-liveness-D6t-uqkj.js";
import { c as sanitizeTaskStatusText } from "./task-status-BLVYcOWO.js";
import { a as findTaskByRunIdForOwner } from "./task-owner-access-BJlXTORc.js";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.js";
import { t as formatRunLabel } from "./subagents-utils-BBbCPRlY.js";
import { n as commandReply } from "./command-gates-B1twWQps.js";
import { n as formatTimeAgo } from "./format-relative-DYcw7YLb.js";
import { i as resolveSubagentEntryForToken } from "./shared-Djh50T-6.js";
//#region src/auto-reply/reply/commands-subagents/action-info.ts
function formatTimestampWithAge(valueMs) {
	if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) return "n/a";
	const timestamp = timestampMsToIsoString(valueMs);
	if (!timestamp) return "n/a";
	return `${timestamp} (${formatTimeAgo(Date.now() - valueMs, { fallback: "n/a" })})`;
}
function loadSubagentSessionEntry(params, childKey) {
	const parsed = parseAgentSessionKey(childKey);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: parsed?.agentId });
	return { entry: loadSessionEntryReadOnly({
		storePath,
		sessionKey: childKey,
		clone: false
	}) };
}
function handleSubagentsInfoAction(ctx) {
	const { params, requesterKey, readContext, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("ℹ️ Usage: /subagents info <id|#>");
	const targetResolution = resolveSubagentEntryForToken(readContext.list.view, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const run = targetResolution.entry;
	const { entry: sessionEntry } = loadSubagentSessionEntry(params, run.childSessionKey);
	const runtime = run.execution.startedAt && Number.isFinite(run.execution.startedAt) ? formatDurationCompact((run.execution.endedAt ?? Date.now()) - run.execution.startedAt) ?? "n/a" : "n/a";
	const outcomeError = sanitizeTaskStatusText(run.execution.outcome?.error, { errorContext: true });
	const outcome = run.execution.outcome ? `${run.execution.outcome.status}${outcomeError ? ` (${outcomeError})` : ""}` : "n/a";
	const linkedTask = findTaskByRunIdForOwner({
		runId: run.runId,
		callerOwnerKey: requesterKey,
		callerAgentId: params.agentId,
		config: params.cfg
	});
	const taskText = sanitizeTaskStatusText(run.task) || "n/a";
	const progressText = sanitizeTaskStatusText(linkedTask?.progressSummary);
	const taskSummaryText = sanitizeTaskStatusText(linkedTask?.terminalSummary, { errorContext: true });
	const taskErrorText = sanitizeTaskStatusText(linkedTask?.error, { errorContext: true });
	const lines = [
		"ℹ️ Subagent info",
		`Status: ${resolveSubagentDisplayStatus(run, readContext.list.pendingDescendants.get(run.childSessionKey) ?? 0)}`,
		`Label: ${formatRunLabel(run)}`,
		`Task: ${taskText}`,
		`Run: ${run.runId}`,
		linkedTask ? `TaskId: ${linkedTask.taskId}` : void 0,
		linkedTask ? `TaskStatus: ${linkedTask.status}` : void 0,
		`Session: ${run.childSessionKey}`,
		`SessionId: ${sessionEntry?.sessionId ?? "n/a"}`,
		`Runtime: ${runtime}`,
		`Created: ${formatTimestampWithAge(run.createdAt)}`,
		`Started: ${formatTimestampWithAge(run.execution.startedAt)}`,
		`Ended: ${formatTimestampWithAge(run.execution.endedAt)}`,
		`Cleanup: ${run.cleanup}`,
		run.archiveAtMs ? `Archive: ${formatTimestampWithAge(run.archiveAtMs)}` : void 0,
		run.cleanupHandled ? "Cleanup handled: yes" : void 0,
		`Outcome: ${outcome}`,
		progressText ? `Progress: ${progressText}` : void 0,
		taskSummaryText ? `Task summary: ${taskSummaryText}` : void 0,
		taskErrorText ? `Task error: ${taskErrorText}` : void 0,
		linkedTask ? `Delivery: ${linkedTask.deliveryStatus}` : void 0
	].filter(Boolean);
	return commandReply(lines.join("\n"));
}
//#endregion
export { handleSubagentsInfoAction };
