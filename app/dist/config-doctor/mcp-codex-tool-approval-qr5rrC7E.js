import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/agents/mcp-codex-tool-approval.ts
const APPROVAL_MODES = /* @__PURE__ */ new Set([
	"auto",
	"prompt",
	"approve"
]);
function normalizeApprovalMode(value) {
	return typeof value === "string" && APPROVAL_MODES.has(value) ? value : void 0;
}
function isAssistantLoopbackServer(name, server) {
	return name === "testclaw" && typeof server.url === "string" && /^https?:\/\/(?:127\.0\.0\.1|localhost):\d+\/mcp(?:[?#].*)?$/.test(server.url);
}
/** Mirrors the approval default projected into Codex native MCP config. */
function resolveProjectedMcpCodexToolApprovalMode(serverName, server, projectedServer, toolName) {
	const codex = server.codex && typeof server.codex === "object" && !Array.isArray(server.codex) ? server.codex : {};
	const projectedTools = isRecord(projectedServer?.tools) ? projectedServer.tools : void 0;
	return normalizeApprovalMode((toolName && isRecord(projectedTools?.[toolName]) ? projectedTools[toolName] : void 0)?.approval_mode) ?? normalizeApprovalMode(codex.defaultToolsApprovalMode) ?? normalizeApprovalMode(codex.default_tools_approval_mode) ?? normalizeApprovalMode(projectedServer?.default_tools_approval_mode) ?? (isAssistantLoopbackServer(serverName, server) ? "approve" : void 0);
}
function normalizeMcpCodexToolAnnotations(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const record = value;
	const result = {};
	for (const key of [
		"readOnlyHint",
		"destructiveHint",
		"idempotentHint",
		"openWorldHint"
	]) if (typeof record[key] === "boolean") result[key] = record[key];
	return result;
}
function formatMcpCodexApprovalRemedy(serverName) {
	return `Run testclaw mcp configure ${serverName && /^[\w.][\w.-]{0,127}$/.test(serverName) ? serverName : "<server>"} --approval approve for a trusted server, or change the session permission mode.`;
}
//#endregion
export { normalizeMcpCodexToolAnnotations as n, resolveProjectedMcpCodexToolApprovalMode as r, formatMcpCodexApprovalRemedy as t };
