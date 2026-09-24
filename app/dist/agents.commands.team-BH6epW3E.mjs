import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { p as shortenHomePath } from "./utils-Dy46mFy2.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { t as ExpectedCliError } from "./failure-output-BDwPHdmu.mjs";
import { t as createAgentTeam } from "./agent-team-C1naVs1C.mjs";
//#region src/commands/agents.commands.team.ts
async function agentsTeamCreateCommand(opts, runtime = defaultRuntime) {
	const result = await createAgentTeam(opts);
	if (result.status === "error") throw new ExpectedCliError({
		message: result.message,
		humanOutput: result.message,
		machineOutput: result.message
	});
	const note = result.ambientOwnerId !== result.coordinatorId ? `ambient owner stays ${result.ambientOwnerId}; talk to the coordinator by name` : void 0;
	const agents = result.agents.map(({ agentId, name, workspace, agentDir }) => ({
		agentId,
		name,
		workspace,
		agentDir
	}));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			coordinatorId: result.coordinatorId,
			agents,
			ambientOwnerId: result.ambientOwnerId,
			...note ? { note } : {}
		});
		return;
	}
	runtime.log(`Created team with coordinator "${result.coordinatorId}":`);
	for (const agent of agents) runtime.log(`- ${agent.agentId}: ${shortenHomePath(agent.workspace)}`);
	if (note) runtime.log(note);
	runtime.log(`Talk to the coordinator: ${formatCliCommand(`testclaw agent --agent ${result.coordinatorId} --message "Describe your task"`)}`);
}
//#endregion
export { agentsTeamCreateCommand };
