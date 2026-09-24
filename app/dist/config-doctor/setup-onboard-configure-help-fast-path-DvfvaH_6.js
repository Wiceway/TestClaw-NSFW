import { t as VERSION } from "./version-BdHihr00.js";
import { f as isSimpleCommandHelpInvocation } from "./argv-zmtAhw2-.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { t as configureProgramHelp } from "./help-BZhif6Eb.js";
import { Command, CommanderError } from "commander";
//#region src/cli/setup-onboard-configure-help-fast-path.ts
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
function resolveSetupOnboardConfigureHelpCommand(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.commandPath.length !== 1 || !isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS)) return null;
	const command = invocation.commandPath[0];
	return SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS.has(command) ? command : null;
}
async function registerHelpCommand(program, command) {
	if (command === "setup") {
		const { registerSetupCommand } = await import("./register.setup-DrmU5XK4.js");
		registerSetupCommand(program);
		return;
	}
	if (command === "onboard") {
		const { registerOnboardCommand } = await import("./register.onboard-ePFBUUP2.js");
		registerOnboardCommand(program);
		return;
	}
	const { registerConfigureCommand } = await import("./register.configure-C5g9Bh2Q.js");
	registerConfigureCommand(program);
}
async function tryOutputSetupOnboardConfigureHelp(argv) {
	const command = resolveSetupOnboardConfigureHelpCommand(argv);
	if (!command) return false;
	const program = new Command();
	program.enablePositionalOptions();
	program.exitOverride();
	configureProgramHelp(program, { programVersion: VERSION });
	await registerHelpCommand(program, command);
	try {
		await program.parseAsync(argv);
	} catch (error) {
		if (!(error instanceof CommanderError)) throw error;
		process.exitCode = error.exitCode;
	}
	return true;
}
//#endregion
export { tryOutputSetupOnboardConfigureHelp };
