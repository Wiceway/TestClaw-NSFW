import { t as formatErrorMessage } from "../errors-DNLGIg8_.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "../automations-tool-name-DBMZPbPL.mjs";
import { o as isToolAllowedByPolicies } from "../tool-policy-match-DDlVID1U.mjs";
import { r as getRuntimeConfig } from "../io.runtime-DIHH_X2V.mjs";
import "../config-DqAgdhnz.mjs";
import { n as resolveRequesterToolPolicies } from "../requester-tool-policy-DlNBcTxG.mjs";
import { t as createCronTool } from "../cron-tool-Cs_K09D0.mjs";
import { a as resolveToolsMcpAgentId, i as TESTCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, n as createToolsMcpServer, o as resolveToolsMcpAgentSessionKey, s as resolveToolsMcpSessionContext, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-DRHTEoQU.mjs";
import { t as createSystemAgentTool } from "../system-agent-tool-BuN2UvhQ.mjs";
import { c as resolveAssistantToolsMcpToolSelection, i as TESTCLAW_TOOLS_MCP_TOOLS_ENV, o as resolveAssistantToolsMcpSystemAgentApproval, r as TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, s as resolveAssistantToolsMcpSystemAgentSurface } from "../testclaw-tools-serve-config-D1ZejKhr.mjs";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/testclaw-tools-serve.ts
/**
* Standalone MCP server for selected built-in Assistant tools.
*
* Run via: node --import tsx src/mcp/testclaw-tools-serve.ts
* Or: bun src/mcp/testclaw-tools-serve.ts
*/
function resolveAssistantToolsMcpAgentSessionKey(env = process.env) {
	return resolveToolsMcpAgentSessionKey(env);
}
function resolveAssistantToolsForMcp(params = {}) {
	const selection = params.tools ?? resolveAssistantToolsMcpToolSelection();
	const agentSessionKey = (params.agentSessionKey ?? resolveAssistantToolsMcpAgentSessionKey())?.trim();
	const tools = selection.map((tool) => {
		if (tool === "testclaw") return createSystemAgentTool({
			agentId: params.agentId,
			surface: params.systemAgentSurface ?? resolveAssistantToolsMcpSystemAgentSurface(),
			...resolveAssistantToolsMcpSystemAgentApproval()
		});
		if (!agentSessionKey) throw new Error(`${TESTCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} is required`);
		const context = resolveToolsMcpSessionContext({
			agentSessionKey,
			agentId: params.agentId
		});
		return createCronTool({
			agentSessionKey,
			agentId: context.agentId,
			config: params.config ?? getRuntimeConfig(),
			creatorToolAllowlist: [{ name: AUTOMATIONS_TOOL_NAME }]
		});
	});
	if (!agentSessionKey) return tools;
	const requesterPolicies = resolveRequesterToolPolicies({
		config: params.config ?? getRuntimeConfig(),
		agentId: params.agentId,
		sessionKey: agentSessionKey,
		senderPolicyMode: "never"
	});
	return tools.filter((tool) => isToolAllowedByPolicies(tool.name, [
		requesterPolicies.groupPolicy,
		requesterPolicies.senderPolicy,
		requesterPolicies.subagentPolicy,
		requesterPolicies.inheritedToolPolicy
	]));
}
function createAssistantToolsMcpServer(params = {}) {
	const tools = params.tools ?? resolveAssistantToolsForMcp();
	return createToolsMcpServer({
		name: "testclaw-tools",
		tools
	});
}
async function serveAssistantToolsMcp() {
	const server = createAssistantToolsMcpServer({ tools: resolveAssistantToolsForMcp({ agentId: resolveToolsMcpAgentId() }) });
	await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) serveAssistantToolsMcp().catch((err) => {
	process.stderr.write(`testclaw-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { TESTCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, TESTCLAW_TOOLS_MCP_TOOLS_ENV, resolveAssistantToolsForMcp, resolveAssistantToolsMcpAgentSessionKey };
