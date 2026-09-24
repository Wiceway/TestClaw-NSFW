import { n as extractBalancedJsonPrefix } from "./balanced-json-DwnPOes0.js";
import "./src-D9uQ497Z.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
//#region src/system-agent/assistant-prompts.ts
/**
* Prompt construction and response parsing for Assistant's AI turns.
*
* The assistant carries the conversation (personality included) but can only
* touch the system through Assistant's typed command vocabulary; parsing
* stays deliberately narrow so free-form model text never executes directly.
*/
/** Timeout for one assistant turn on an external, potentially metered route. */
const SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS = 3e4;
/** Local startup stages can consume nearly 30s before dispatch; leave inference a real budget. */
const SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS = 12e4;
const SYSTEM_AGENT_UI_CONTEXT_GUIDANCE = " ";;
const SYSTEM_AGENT_SETUP_GOALS = " ";;
function formatSystemAgentSurfaceBoundary(handoffAction) {
	return `Surface boundary: this Assistant setup chat cannot run normal-agent slash commands such as \`/codex\`. Never tell the user to enter one here. If their task needs normal-agent tools or source edits, ${handoffAction}; say only that normal agent chat is opening, never that the task, conversation, or work has already transferred or begun.`;
}
/** Identity used only for the bounded, cached caretaker greeting turn. */
const SYSTEM_AGENT_GREETING_SYSTEM_PROMPT = [" "].join("\n");
/** Compact, deterministic facts payload for the metered greeting turn. */
function buildSystemAgentGreetingUserPrompt(params) {
	return JSON.stringify({
		config: {
			exists: params.overview.config.exists,
			valid: params.overview.config.valid
		},
		defaultAgentId: params.overview.defaultAgentId,
		defaultModel: params.overview.defaultModel ?? null,
		setupModel: params.overview.setupModel ?? null,
		utilityModel: params.overview.utilityModel ?? null,
		agents: params.overview.agents.map((agent) => ({
			id: agent.id,
			name: agent.name ?? null,
			isDefault: agent.isDefault,
			model: agent.model ?? null
		})),
		gateway: {
			reachable: params.overview.gateway.reachable,
			url: params.overview.gateway.url
		},
		updateAvailable: params.facts.updateAvailable,
		channelHealthAvailable: params.facts.channelHealth.available,
		degradedChannels: params.facts.channelHealth.degraded
	});
}
/** System prompt: persona plus the closed command vocabulary. */
const SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT = [" "].join("\n");
/** Setup-only facts stay constant for the verified route's lifetime. */
function buildSystemAgentSystemPrompt(setupModel) {
	if (!setupModel) return SYSTEM_AGENT_SYSTEM_PROMPT;
	return [
		`Current setup state: ${setupModel} is configured only for setup and utility tasks. No primary model is configured for regular agent chat.`,
		"To enable regular agent chat, the user must choose a primary model in Model Setup or run testclaw onboard. Restarting the Gateway cannot configure a missing primary. Continue helping with setup here; do not suggest a restart for this reason. Check gateway_status before claiming the Gateway is unavailable.",
		SYSTEM_AGENT_SYSTEM_PROMPT
	].join("\n\n");
}
const SYSTEM_AGENT_SYSTEM_PROMPT = [" "].join("\n");
const HISTORY_TURN_MAX_CHARS = 500;
function formatHistory(history) {
	if (!history || history.length === 0) return [];
	return [
		"Conversation so far:",
		...history.slice(-12).map((turn) => {
			const text = turn.text.length > HISTORY_TURN_MAX_CHARS ? `${truncateUtf16Safe(turn.text, HISTORY_TURN_MAX_CHARS)}…` : turn.text;
			return `${turn.role === "user" ? "User" : "Assistant"}: ${text}`;
		}),
		""
	];
}
/** Build the overview-grounded user prompt supplied to assistant planners. */
function buildSystemAgentAssistantUserPrompt(params) {
	const agents = params.overview.agents.map((agent) => {
		return `- ${[
			`id=${agent.id}`,
			agent.name ? `name=${agent.name}` : void 0,
			agent.workspace ? `workspace=${agent.workspace}` : void 0,
			agent.model ? `model=${agent.model}` : void 0,
			agent.isDefault ? "default=true" : void 0
		].filter(Boolean).join(", ")}`;
	}).join("\n");
	return [
		...formatHistory(params.history),
		`User request: ${params.input}`,
		"",
		...params.pendingOperation ? [`Pending proposal awaiting the user's yes: ${params.pendingOperation}`, ""] : [],
		`Default agent: ${params.overview.defaultAgentId}`,
		`Default model: ${params.overview.defaultModel ?? "not configured"}`,
		...params.overview.setupModel ? [`Setup model: ${params.overview.setupModel}`] : [],
		...params.overview.utilityModel ? [`Utility model: ${params.overview.utilityModel}`] : [],
		`Config valid: ${params.overview.config.valid}`,
		`Gateway reachable: ${params.overview.gateway.reachable}`,
		`Codex binary: ${params.overview.tools.codex.found ? "found" : "not found"}`,
		`Claude Code CLI: ${params.overview.tools.claude.found ? "found" : "not found"}`,
		`Gemini CLI: ${params.overview.tools.gemini.found ? "found" : "not found"}`,
		`OpenAI API key: ${params.overview.tools.apiKeys.openai ? "found" : "not found"}`,
		`Anthropic API key: ${params.overview.tools.apiKeys.anthropic ? "found" : "not found"}`,
		`Assistant docs: ${params.overview.references.docsPath ?? params.overview.references.docsUrl}`,
		`Assistant source: ${params.overview.references.sourcePath ?? params.overview.references.sourceUrl}`,
		params.overview.references.sourcePath ? "Source mode: local git checkout; inspect source directly when docs are insufficient." : "Source mode: package/install; use GitHub source when docs are insufficient.",
		"",
		"Agents:",
		agents || "- none"
	].join("\n");
}
/** Parse compact assistant JSON while ignoring surrounding explanatory text. */
function parseSystemAgentAssistantPlanText(rawText) {
	const text = rawText?.trim();
	if (!text) return null;
	const jsonText = extractBalancedJsonPrefix(text, { openers: ["{"] })?.json;
	if (!jsonText) return null;
	let parsed;
	try {
		parsed = JSON.parse(jsonText);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== "object") return null;
	const record = parsed;
	const command = typeof record.command === "string" ? record.command.trim() : "";
	const reply = typeof record.reply === "string" ? record.reply.trim() : "";
	if (!command && !reply) return null;
	return {
		...command ? { command } : {},
		...reply ? { reply } : {}
	};
}
//#endregion
export { buildSystemAgentAssistantUserPrompt as a, parseSystemAgentAssistantPlanText as c, SYSTEM_AGENT_GREETING_SYSTEM_PROMPT as i, SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT as n, buildSystemAgentGreetingUserPrompt as o, SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS as r, buildSystemAgentSystemPrompt as s, SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS as t };
