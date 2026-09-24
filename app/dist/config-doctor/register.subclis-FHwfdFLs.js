import { v as getSubCliEntriesCore } from "./argv-zmtAhw2-.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { i as buildCommandGroupEntries, n as registerSubCliByNameCore, r as registerSubCliCommandsCore } from "./register.subclis-core-JzJVJ2CC.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-C15pbKDo.js";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-DMu8hUxu.js";
//#region src/cli/program/register.subclis.ts
const completionEntries = buildCommandGroupEntries(getSubCliEntriesCore(), [[["completion"], async (program) => (await import("./completion-cli-DV7Sha7Z.js")).registerCompletionCli(program)]]);
/** Register one sub-CLI by name, including lazy command groups. */
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
	if (await registerSubCliByNameCore(program, name, argv, context)) return true;
	return registerCommandGroupByName(program, completionEntries, name);
}
/** Register sub-CLI commands according to eager/lazy startup policy. */
function registerSubCliCommands(program, argv = process.argv) {
	registerSubCliCommandsCore(program, argv);
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, completionEntries, {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { registerSubCliCommands as n, registerSubCliByName as t };
