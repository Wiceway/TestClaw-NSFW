import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
//#region src/agents/core-tool-factory-descriptors.ts
/**
* Static identity for names that select core agent factory families before assembly.
*/
const CORE_TOOL_FACTORY_DESCRIPTORS = [
	{
		name: "edit",
		family: "base-coding"
	},
	{
		name: "read",
		family: "base-coding"
	},
	{
		name: "ls",
		family: "base-coding"
	},
	{
		name: "write",
		family: "base-coding"
	},
	{
		name: "apply_patch",
		family: "shell"
	},
	{
		name: "exec",
		family: "shell"
	},
	{
		name: "process",
		family: "shell"
	},
	{
		name: "agents_list",
		family: "testclaw"
	},
	{
		name: "agents_wait",
		family: "testclaw"
	},
	{
		name: "ask_user",
		family: "testclaw"
	},
	{
		name: "testclaw",
		family: "testclaw"
	},
	{
		name: "computer",
		family: "testclaw"
	},
	{
		name: "conversations_list",
		family: "testclaw"
	},
	{
		name: "conversations_send",
		family: "testclaw"
	},
	{
		name: "conversations_turn",
		family: "testclaw"
	},
	{
		name: AUTOMATIONS_TOOL_NAME,
		family: "testclaw"
	},
	{
		name: "screen",
		family: "testclaw"
	},
	{
		name: "theme",
		family: "testclaw"
	},
	{
		name: "secrets",
		family: "testclaw"
	},
	{
		name: "dashboard",
		family: "testclaw"
	},
	{
		name: "decision_evaluate",
		family: "testclaw"
	},
	{
		name: "gateway",
		family: "testclaw"
	},
	{
		name: "plugins",
		family: "testclaw"
	},
	{
		name: "get_goal",
		family: "testclaw"
	},
	{
		name: "github_identity_status",
		family: "testclaw"
	},
	{
		name: "github_publish",
		family: "testclaw"
	},
	{
		name: "heartbeat_respond",
		family: "testclaw"
	},
	{
		name: "view_image",
		family: "testclaw"
	},
	{
		name: "image_generate",
		family: "testclaw"
	},
	{
		name: "message",
		family: "testclaw"
	},
	{
		name: "mobile_ui",
		family: "testclaw"
	},
	{
		name: "music_generate",
		family: "testclaw"
	},
	{
		name: "nodes",
		family: "testclaw"
	},
	{
		name: "pdf",
		family: "testclaw"
	},
	{
		name: "session_status",
		family: "testclaw"
	},
	{
		name: "show_widget",
		family: "testclaw"
	},
	{
		name: "progress_card",
		family: "testclaw"
	},
	{
		name: "sessions",
		family: "testclaw"
	},
	{
		name: "sessions_history",
		family: "testclaw"
	},
	{
		name: "sessions_list",
		family: "testclaw"
	},
	{
		name: "sessions_search",
		family: "testclaw"
	},
	{
		name: "sessions_send",
		family: "testclaw"
	},
	{
		name: "sessions_spawn",
		family: "testclaw"
	},
	{
		name: "sessions_yield",
		family: "testclaw"
	},
	{
		name: "structured_output",
		family: "testclaw"
	},
	{
		name: "skill_workshop",
		family: "testclaw"
	},
	{
		name: "suggest_task",
		family: "testclaw"
	},
	{
		name: "create_goal",
		family: "testclaw"
	},
	{
		name: "subagents",
		family: "testclaw"
	},
	{
		name: "terminal",
		family: "testclaw"
	},
	{
		name: "portal",
		family: "testclaw"
	},
	{
		name: "transcripts",
		family: "testclaw"
	},
	{
		name: "tts",
		family: "testclaw"
	},
	{
		name: "update_goal",
		family: "testclaw"
	},
	{
		name: "dismiss_task",
		family: "testclaw"
	},
	{
		name: "video_generate",
		family: "testclaw"
	},
	{
		name: "web_fetch",
		family: "testclaw"
	},
	{
		name: "web_search",
		family: "testclaw"
	}
];
const CORE_TOOL_FACTORY_FAMILY_BY_NAME = new Map(CORE_TOOL_FACTORY_DESCRIPTORS.map(({ name, family }) => [name, family]));
function resolveCoreToolFactoryFamily(name) {
	return CORE_TOOL_FACTORY_FAMILY_BY_NAME.get(name);
}
function listCoreToolFactoryDescriptors() {
	return CORE_TOOL_FACTORY_DESCRIPTORS;
}
/**
* Core coding primitives (file + shell families). Tool-search compaction keeps
* these directly visible: hiding them behind search adds a lookup round-trip to
* nearly every coding turn.
*/
function isCoreCodingSurfaceToolName(name) {
	const family = CORE_TOOL_FACTORY_FAMILY_BY_NAME.get(name);
	return family === "base-coding" || family === "shell";
}
//#endregion
export { listCoreToolFactoryDescriptors as n, resolveCoreToolFactoryFamily as r, isCoreCodingSurfaceToolName as t };
