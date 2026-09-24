import { r as theme } from "./theme-DLJw9KCD.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { t as addTuiOptions } from "./tui-cli-options-5C6_KTVs.js";
//#region src/cli/resume-cli.ts
/** Register the Gateway-backed session resume command. */
function registerResumeCli(program) {
	const command = program.command("resume").description("Resume a recent Gateway session in the TUI").argument("[query]", "Session key, display name, or label").option("--handoff <payload>", "Opaque session handoff copied from the Control UI");
	addTuiOptions(command).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/resume", "docs.testclaw.ai/cli/resume")}\n`).action(async (query, opts) => {
		try {
			const { runResumeCommand } = await import("./resume-cli.runtime-COVvaHUS.js");
			await runResumeCommand(query, opts);
		} catch (error) {
			defaultRuntime.error(formatErrorMessage(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerResumeCli };
