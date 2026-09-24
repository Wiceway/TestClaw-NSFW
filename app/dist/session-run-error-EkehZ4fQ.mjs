import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-Db5P6nQB.mjs";
import { p as withSessionTranscriptWriteAssertion } from "./transcript-write-context-DD1eJxQX.mjs";
import { c as appendSessionTranscriptReport, l as appendSessionTranscriptReportNative } from "./session-accessor-CtBBLApI.mjs";
import { n as renderUserFacingText } from "./user-facing-text-BzXrOtrH.mjs";
//#region src/sessions/session-run-error.ts
const SESSION_RUN_ERROR_MAX_CHARS = 160;
const RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE = "run-failed-before-reply";
function sanitizeSessionRunError(error) {
	const text = renderUserFacingText(error, { errorContext: true }).replace(/\s+/g, " ").trim();
	return redactSensitiveText(text, { mode: "tools" });
}
/** Shared failure receipt; optional settlement joins the receipt's synchronous transaction. */
async function recordGatewaySessionRunFailure(params) {
	const { runId } = params;
	const error = truncateUtf16Safe(sanitizeSessionRunError(params.error), 512) || "unknown error";
	const append = params.settleStartupSession ? appendSessionTranscriptReportNative : appendSessionTranscriptReport;
	const result = await withSessionTranscriptWriteAssertion(params.target, () => params.assertCommitAllowed?.(), () => append(params.target, {
		kind: "custom",
		customTypes: [RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE],
		suppressWhenAssistantRun: runId,
		selectReport: (latest) => {
			params.assertCommitAllowed?.();
			params.settleStartupSession?.();
			params.assertCommitAllowed?.();
			if (isRecord(latest?.details) && latest.details.runId === runId) return;
			return {
				customType: RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE,
				content: `This turn ended before a reply: ${error}`,
				display: true,
				details: {
					runId,
					error
				}
			};
		}
	}));
	if (!result.ok) throw new Error(`Failed run notice could not be appended: ${result.error.code}`);
}
function resolveSessionRunError(outcome, status) {
	if (status !== "failed" && status !== "timeout" || typeof outcome.error !== "string" || !outcome.error.trim()) return;
	const error = sanitizeSessionRunError(outcome.error);
	if (error.length <= SESSION_RUN_ERROR_MAX_CHARS) return error || void 0;
	return `${sliceUtf16Safe(error, 0, Math.floor(155 / 3)).trimEnd()} ... ${sliceUtf16Safe(error, -104).trimStart()}`;
}
//#endregion
export { resolveSessionRunError as n, recordGatewaySessionRunFailure as t };
