import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-D6UoRfEi.mjs";
import "./update-run-ledger-CWjgjkCi.mjs";
import { r as getUpdateRun } from "./update-run-reader-DcJAE2Qr.mjs";
import { a as renderUpdateRunReport, c as updateRunReportInputFromSentinel } from "./update-run-report-BB6X6q4R.mjs";
import { t as readUpdateRunStatus } from "./update-run-status-BHLhnddK.mjs";
//#region src/commands/status-update-restart.ts
function renderStatusReport(run) {
	const report = renderUpdateRunReport(run);
	const reconciled = isAcknowledgedAbandonedUpdateRun(run);
	const message = run.status === "failed" && !reconciled ? run.steps.filter((step) => step.status === "failed").flatMap((step) => step.failureFacts ?? []).find((fact) => fact.message)?.message : void 0;
	return {
		...report,
		reconciled,
		headline: message ? `${report.headline} ${message}` : report.headline
	};
}
function readReport(payload) {
	return renderStatusReport((payload.stats?.runId ? getUpdateRun(payload.stats.runId) : void 0) ?? updateRunReportInputFromSentinel(payload));
}
function formatUpdateRestartStatusValue(payload, opts = {}) {
	if (!payload || payload.kind !== "update") return null;
	const { headline, reconciled } = readReport(payload);
	const format = reconciled ? opts.muted : payload.status === "error" ? opts.warn : payload.status === "ok" ? opts.ok : opts.muted;
	return format ? format(headline) : headline;
}
/** Keep recorded progress and history separate from the current installation's update check. */
function buildStatusUpdateRows(payload, opts = {}) {
	const history = readUpdateRunStatus();
	if ("runStatusError" in history) return [{
		Item: "Update run",
		Value: `Update run status unavailable: ${history.runStatusError}`
	}];
	const run = history.activeRun ?? history.lastRun;
	const rows = run ? [{
		Item: "Update run",
		Value: renderStatusReport(run).headline
	}] : [];
	if (history.runReconciliationError) rows.push({
		Item: "Update reconciliation",
		Value: `Update run reconciliation failed: ${history.runReconciliationError}`
	});
	for (const advisory of history.advisories ?? []) rows.push({
		Item: "Update advisory",
		Value: advisory.message
	});
	const restart = !run || payload?.stats?.runId !== run.runId ? formatUpdateRestartStatusValue(payload, opts) : null;
	return restart ? [...rows, {
		Item: "Update restart",
		Value: restart
	}] : rows;
}
function formatUpdateRestartActionLines(payload) {
	return payload?.kind === "update" ? readReport(payload).lines : [];
}
//#endregion
export { formatUpdateRestartActionLines as n, formatUpdateRestartStatusValue as r, buildStatusUpdateRows as t };
