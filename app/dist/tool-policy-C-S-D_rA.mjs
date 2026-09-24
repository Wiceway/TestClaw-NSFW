import { l as normalizeToolPolicyName } from "./tool-policy-shared-dUIuMpQR.mjs";
import "./tool-policy-6aEa6C7R.mjs";
//#region src/agents/cli-runner/tool-policy.ts
/** Transport prefix CLI harnesses use for loopback Assistant MCP tool names. */
const TESTCLAW_MCP_TOOL_PREFIX = "mcp__testclaw__";
const GEMINI_TESTCLAW_MCP_TOOL_PREFIX = "mcp_testclaw_";
/** Strips the loopback MCP transport prefix so observers see gateway tool names. */
function stripAssistantMcpToolPrefix(toolName) {
	return toolName.startsWith(TESTCLAW_MCP_TOOL_PREFIX) ? toolName.slice(15) : toolName.startsWith(GEMINI_TESTCLAW_MCP_TOOL_PREFIX) ? toolName.slice(13) : toolName;
}
/** Match provider-native names against the canonical tool hook and policy ids. */
function normalizeCliToolName(toolName) {
	return normalizeToolPolicyName(toolName.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2"));
}
/** Keeps only explicit runtime caps for backend-owned exact translation. */
function resolveCliRuntimeToolsAllow(toolsAllow, _toolsAllowIsDefault) {
	if (toolsAllow === void 0) return;
	return toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { resolveCliRuntimeToolsAllow as n, stripAssistantMcpToolPrefix as r, normalizeCliToolName as t };
