import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-DLBW8fmc.mjs";
import { n as CONFIGURE_WIZARD_SECTIONS } from "./configure.shared-DOWYdaU1.mjs";
//#region src/cli/program/register.configure.ts
/** Register the interactive `configure` command and section filter flag. */
function registerConfigureCommand(program) {
	program.command("configure").description("Interactive configuration for credentials, channels, gateway, and agent defaults").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/configure", "docs.testclaw.ai/cli/configure")}\n`).option("--section <section>", `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`, (value, previous) => [...previous, value], []).action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-DDLtJLJF.mjs");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { configureCommandFromSectionsArg } = await import("./configure.commands-t76IpJs2.mjs");
			await configureCommandFromSectionsArg(opts.section, defaultRuntime);
		});
	});
}
//#endregion
export { registerConfigureCommand };
