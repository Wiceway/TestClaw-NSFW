import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-DLBW8fmc.mjs";
//#region src/cli/models-cli.runtime.ts
function runModelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function resolveModelAgentOption(command, opts) {
	return resolveOptionFromCommand(command, "agent") ?? (typeof opts?.agent === "string" ? opts.agent : void 0);
}
function rejectAgentScopedModelCommand(command, commandName) {
	if (resolveOptionFromCommand(command, "agent") === void 0) return;
	throw new Error(`testclaw models ${commandName} does not support --agent; it is global and never agent-scoped. Remove --agent, or run ${formatCliCommand("testclaw agents list")} and set the per-agent model in agent config.`);
}
//#endregion
export { defaultRuntime, rejectAgentScopedModelCommand, resolveModelAgentOption, runModelsCommand };
