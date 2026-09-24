import { r as theme } from "./theme-DLJw9KCD.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
import { n as CONFIGURE_WIZARD_SECTIONS } from "./configure.shared-D19oJpwn.js";
//#region src/cli/program/register.configure.ts
/** Register the interactive `configure` command and section filter flag. */
function registerConfigureCommand(program) {
	program.command("configure").description("Interactive configuration for credentials, channels, gateway, and agent defaults").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/configure", "docs.testclaw.ai/cli/configure")}\n`).option("--section <section>", `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`, (value, previous) => [...previous, value], []).action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-CkU4itJ9.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { configureCommandFromSectionsArg } = await import("./configure.commands-NAQTDn8i.js");
			await configureCommandFromSectionsArg(opts.section, defaultRuntime);
		});
	});
}
//#endregion
export { registerConfigureCommand };
