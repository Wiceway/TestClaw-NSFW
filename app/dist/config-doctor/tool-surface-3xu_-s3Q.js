//#region src/agents/harness/tool-surface.ts
/** Whether a plugin harness constructs Assistant tools inside its runtime. */
function agentHarnessBuildsAssistantTools(harnessId) {
	return harnessId === "codex" || harnessId === "copilot";
}
/** Whether the selected harness exposes Assistant's agent-tool surface. */
function agentHarnessExposesAssistantTools(harnessId) {
	return harnessId === "testclaw" || agentHarnessBuildsAssistantTools(harnessId);
}
//#endregion
export { agentHarnessExposesAssistantTools as n, agentHarnessBuildsAssistantTools as t };
