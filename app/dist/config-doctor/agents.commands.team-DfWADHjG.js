import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as createAgentTeam } from "./agent-team-BGYJd1E-.js";
import { t as ExpectedCliError } from "./failure-output-B62fEQHE.js";
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
