import { t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.js";
import { n as classifyFailoverSignal } from "./classify-g_cTi4L9.js";
import { a as shouldRetryFailoverSignal, n as extractFailoverHttpStatus } from "./retry-evidence-r2MRZSDb.js";
import { WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE, resolveResponsesOutputIdentityRetry } from "@testclaw/ai/diagnostics";
//#region packages/llm-core/src/types.ts
/** Stable error codes for provider outcomes that cannot be replayed safely. */
const PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE = "PROVIDER_POST_DISPATCH_AMBIGUITY";
const PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE = "PROVIDER_FAILURE_WITH_OUTPUT";
/** Pre-dispatch argument rejection; callers still enforce output and effect guards. */
const MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE = "malformed_tool_call_arguments";
//#endregion
//#region src/llm/utils/retry.ts
const TERMINAL_ASSISTANT_ERROR_CODES = /* @__PURE__ */ new Set([
	PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE,
	PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE,
	WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE
]);
/**
* Preserve structured terminal outcomes before text classification.
* Replay must not duplicate output or override refusals and permanent transport failures.
*/
function isTerminalAssistantError(message) {
	return Boolean(message?.errorCode && TERMINAL_ASSISTANT_ERROR_CODES.has(message.errorCode)) || message != null && resolveResponsesOutputIdentityRetry(message) === "stop" || isProviderRefusalAssistantError(message);
}
/** Classify transient provider/transport failures for session retries. */
function isRetryableAssistantError(message) {
	if (message.stopReason !== "error" || !message.errorMessage || isTerminalAssistantError(message)) return false;
	if (resolveResponsesOutputIdentityRetry(message) === "retry") return true;
	const errorMessage = message.errorMessage.trim();
	const status = extractFailoverHttpStatus(errorMessage);
	const signal = {
		message: errorMessage,
		provider: message.provider,
		code: message.errorCode,
		errorType: message.errorType,
		...status === void 0 ? {} : { status }
	};
	const classification = classifyFailoverSignal(signal);
	return shouldRetryFailoverSignal({
		classification,
		signal
	});
}
//#endregion
export { PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE as i, isTerminalAssistantError as n, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE as r, isRetryableAssistantError as t };
