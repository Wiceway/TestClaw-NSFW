import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.js";
//#region src/agents/code-mode-errors.ts
function isRuntimeInterruptedError(error) {
	return (error instanceof Error ? error.message : error) === "interrupted";
}
function codeModeFailureCode(error) {
	if (isRuntimeInterruptedError(error)) return "timeout";
	return error instanceof ToolInputError ? "invalid_input" : "internal_error";
}
function codeModeFailureMessage(error) {
	return isRuntimeInterruptedError(error) ? "code mode timeout exceeded" : formatErrorMessage(error);
}
function normalizeCodeModeTimeoutResult(result) {
	return result.status === "failed" && result.code === "timeout" && !String(result.error).includes("timeout exceeded") ? {
		...result,
		error: "code mode timeout exceeded"
	} : result;
}
var CodeModeHeadlessAbortError = class extends Error {
	constructor(message = "code mode execution aborted") {
		super(message);
		this.name = "CodeModeHeadlessAbortError";
	}
};
var CodeModeHeadlessTimeoutError = class extends Error {
	constructor(message = "code mode headless wall-clock timeout exceeded") {
		super(message);
		this.name = "CodeModeHeadlessTimeoutError";
	}
};
//#endregion
//#region src/agents/code-mode-worker-types.ts
const CODE_MODE_WORKER_WATCHDOG_GRACE_MS = 2e3;
//#endregion
export { codeModeFailureMessage as a, codeModeFailureCode as i, CodeModeHeadlessAbortError as n, normalizeCodeModeTimeoutResult as o, CodeModeHeadlessTimeoutError as r, CODE_MODE_WORKER_WATCHDOG_GRACE_MS as t };
