import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-dUIuMpQR.mjs";
import "./tool-policy-6aEa6C7R.mjs";
import "./code-mode-control-tools-DJ5t_-Dq.mjs";
//#region src/agents/embedded-agent-runner/terminal-tool-failure.ts
/** Projects a safe Code Mode catalog miss into terminal metadata for operator diagnostics. */
const SAFE_MCP_CATALOG_MISS = /^(?:Error: )?Unknown tool id: MCP\.[A-Za-z0-9][A-Za-z0-9._-]*\. (?:Did you mean: [^\r\n]+\? )?Use (?:testclaw\.tools\.search to find a tool, testclaw\.tools\.describe to inspect it, then testclaw\.tools\.call|tools\.search to find a tool, tools\.describe to inspect it, then tools\.call) with the exact id or name\.$/;
const CODE_MODE_MCP_CATALOG_MISS_MESSAGE = "Code Mode could not resolve a configured MCP tool.";
/** Validates the only terminal tool failure fact safe to persist in cron history. */
function isEmbeddedRunTerminalToolFailure(value) {
	const failure = asOptionalObjectRecord(value);
	return failure?.source === "tool" && (failure.toolName === "exec" || failure.toolName === "wait") && failure.code === "UNKNOWN_TOOL_ID";
}
/**
* Preserves one strictly allowlisted Code Mode catalog-miss fact for cron
* history. All other tool errors stay on the existing generic presentation
* path.
*/
function resolveEmbeddedRunTerminalToolFailure(params) {
	const failure = params.lastToolError;
	const normalizedToolName = normalizeToolPolicyName(failure?.toolName ?? "");
	if (params.trigger !== "cron" || params.codeModeEngaged !== true || !failure || normalizedToolName !== "exec" && normalizedToolName !== "wait") return;
	const failureFirstLine = typeof failure.error === "string" ? failure.error.split(/\r?\n/, 1)[0] : void 0;
	if (!(failureFirstLine ? SAFE_MCP_CATALOG_MISS.exec(failureFirstLine) : null)) return;
	return {
		source: "tool",
		toolName: normalizedToolName,
		code: "UNKNOWN_TOOL_ID"
	};
}
//#endregion
export { isEmbeddedRunTerminalToolFailure as n, resolveEmbeddedRunTerminalToolFailure as r, CODE_MODE_MCP_CATALOG_MISS_MESSAGE as t };
