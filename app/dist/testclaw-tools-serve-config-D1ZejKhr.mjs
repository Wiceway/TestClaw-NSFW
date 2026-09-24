import { r as resolveAssistantPackageRootSync } from "./testclaw-root-CayS889k.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
//#region src/mcp/testclaw-tools-serve-config.ts
/**
* Shared contract between the testclaw-tools MCP stdio entry and the callers
* that inject it into CLI harness runs. Keep this module free of MCP SDK and
* tool-runtime imports so CLI-runner prepare paths can build server configs
* without loading the server.
*/
const TESTCLAW_TOOLS_MCP_TOOLS_ENV = "TESTCLAW_TOOLS_MCP_TOOLS";
const TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV = "TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE";
const TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV = "TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED";
const TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV = "TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL";
const APPROVAL_ARMED_OPERATOR_ONLY_VALUE = "operator-only";
const TESTCLAW_TOOLS_MCP_TOOL_IDS = ["cron", "testclaw"];
function isAssistantToolsMcpToolId(value) {
	return TESTCLAW_TOOLS_MCP_TOOL_IDS.includes(value);
}
/** Parse the served tool selection; the default stays cron for acpx bridges. */
function resolveAssistantToolsMcpToolSelection(env = process.env) {
	const raw = env[TESTCLAW_TOOLS_MCP_TOOLS_ENV]?.trim();
	if (!raw) return ["cron"];
	const entries = raw.split(",").map((entry) => entry.trim()).filter(Boolean);
	const selection = entries.filter(isAssistantToolsMcpToolId);
	if (selection.length === 0 || selection.length !== entries.length) throw new Error(`${TESTCLAW_TOOLS_MCP_TOOLS_ENV} must be a comma list of: ${TESTCLAW_TOOLS_MCP_TOOL_IDS.join(", ")}`);
	return selection;
}
/** Parse the Assistant surface for served testclaw tools; defaults to cli. */
function resolveAssistantToolsMcpSystemAgentSurface(env = process.env) {
	const raw = env[TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV]?.trim();
	if (!raw || raw === "cli") return "cli";
	if (raw === "gateway") return "gateway";
	throw new Error(`${TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV} must be "cli" or "gateway"`);
}
/**
* Reconstruct per-turn approval state for the served testclaw tool. The
* stdio server runs out of process, so the host passes the armed bit and the
* pending proposal hash through env; the host mirrors transitions back from
* tool events (see mirrorSystemAgentToolStateFromEvents in agent-turn.ts).
*/
function resolveAssistantToolsMcpSystemAgentApproval(env = process.env) {
	const pendingProposal = env[TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV]?.trim();
	const armedValue = env[TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV]?.trim();
	return {
		approvalArmed: armedValue === "1",
		proposalRef: pendingProposal ? { current: pendingProposal } : {},
		...armedValue === APPROVAL_ARMED_OPERATOR_ONLY_VALUE ? { operatorApprovalOnly: true } : {}
	};
}
function resolveTsxImportSpecifier() {
	try {
		return createRequire(import.meta.url).resolve("tsx");
	} catch {
		return "tsx";
	}
}
function resolveAssistantToolsServeCommand() {
	const packageRoot = resolveAssistantPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!packageRoot) throw new Error("testclaw-tools MCP: could not resolve the Assistant package root");
	const distEntry = path.join(packageRoot, "dist", "mcp", "testclaw-tools-serve.js");
	if (fs.existsSync(distEntry)) return {
		command: process.execPath,
		args: [distEntry]
	};
	const sourceEntry = path.join(packageRoot, "src", "mcp", "testclaw-tools-serve.ts");
	if (!fs.existsSync(sourceEntry)) throw new Error(`testclaw-tools MCP: no serve entry under ${packageRoot}`);
	if (process.versions.bun) return {
		command: process.execPath,
		args: [sourceEntry]
	};
	return {
		command: process.execPath,
		args: [
			"--import",
			resolveTsxImportSpecifier(),
			sourceEntry
		]
	};
}
/**
* Assistant CLI-harness runs get exactly one MCP server: this stdio entry
* serving the ring-zero testclaw tool. The server keeps the "testclaw" name
* so backend tool pre-approvals (e.g. Claude's --allowedTools mcp__testclaw__*)
* apply without per-backend argument surgery.
*/
function buildSystemAgentToolsMcpServerConfig(options) {
	const entry = resolveAssistantToolsServeCommand();
	const pendingProposal = options.proposalRef?.current;
	return { mcpServers: { testclaw: {
		command: entry.command,
		args: options.agentId ? [
			...entry.args,
			"--testclaw-agent-id",
			options.agentId
		] : entry.args,
		env: {
			[TESTCLAW_TOOLS_MCP_TOOLS_ENV]: "testclaw",
			[TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV]: options.surface,
			...options.operatorApprovalOnly === true ? { [TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV]: APPROVAL_ARMED_OPERATOR_ONLY_VALUE } : options.approvalArmed === true ? { [TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV]: "1" } : {},
			...pendingProposal ? { [TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV]: pendingProposal } : {}
		}
	} } };
}
//#endregion
export { buildSystemAgentToolsMcpServerConfig as a, resolveAssistantToolsMcpToolSelection as c, TESTCLAW_TOOLS_MCP_TOOLS_ENV as i, TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV as n, resolveAssistantToolsMcpSystemAgentApproval as o, TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV as r, resolveAssistantToolsMcpSystemAgentSurface as s, TESTCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV as t };
