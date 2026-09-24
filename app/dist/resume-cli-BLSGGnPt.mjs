import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as addTuiOptions } from "./tui-cli-options-5C6_KTVs.mjs";
//#region src/cli/resume-cli.ts
/** Register the Gateway-backed session resume command. */
function registerResumeCli(program) {
	const command = program.command("resume").description("Resume a recent Gateway session in the TUI").argument("[query]", "Session key, display name, or label").option("--handoff <payload>", "Opaque session handoff copied from the Control UI");
	addTuiOptions(command).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/resume", "docs.testclaw.ai/cli/resume")}\n`).action(async (query, opts) => {
		try {
			const { runResumeCommand } = await import("./resume-cli.runtime.js");
			await runResumeCommand(query, opts);
		} catch (error) {
			defaultRuntime.error(formatErrorMessage(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerResumeCli };
