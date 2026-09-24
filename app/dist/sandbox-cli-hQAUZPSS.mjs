import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-DLBW8fmc.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
//#region src/cli/sandbox-cli.ts
const SANDBOX_EXAMPLES = {
	main: [
		["testclaw sandbox list", "List all sandbox containers."],
		["testclaw sandbox list --browser", "List only browser containers."],
		["testclaw sandbox recreate --all", "Recreate all containers."],
		["testclaw sandbox recreate --session main", "Recreate a specific session."],
		["testclaw sandbox recreate --agent mybot", "Recreate agent containers."],
		["testclaw sandbox explain", "Explain effective sandbox config."]
	],
	list: [
		["testclaw sandbox list", "List all sandbox containers."],
		["testclaw sandbox list --browser", "List only browser containers."],
		["testclaw sandbox list --json", "JSON output."]
	],
	recreate: [
		["testclaw sandbox recreate --all", "Recreate all containers."],
		["testclaw sandbox recreate --session main", "Recreate a specific session."],
		["testclaw sandbox recreate --agent mybot", "Recreate a specific agent (includes sub-agents)."],
		["testclaw sandbox recreate --browser --all", "Recreate only browser containers."],
		["testclaw sandbox recreate --all --force", "Skip confirmation."]
	],
	explain: [
		["testclaw sandbox explain", "Show effective sandbox config."],
		["testclaw sandbox explain --session agent:main:main", "Explain a specific session."],
		["testclaw sandbox explain --agent work", "Explain an agent sandbox."],
		["testclaw sandbox explain --json", "JSON output."]
	]
};
function registerSandboxCli(program) {
	const sandbox = program.command("sandbox").description("Manage sandbox containers (Docker-based agent isolation)").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(SANDBOX_EXAMPLES.main)}\n`).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/sandbox", "docs.testclaw.ai/cli/sandbox")}\n`).action(() => {
		sandbox.help({ error: true });
	});
	sandbox.command("list").description("List sandbox containers and their status").option("--json", "Output result as JSON", false).option("--browser", "List browser containers only", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(SANDBOX_EXAMPLES.list)}\n\n${theme.heading("Output includes:")}\n${theme.muted("- Container name and status (running/stopped)")}\n${theme.muted("- Docker image and whether it matches current config")}\n${theme.muted("- Age (time since creation)")}\n${theme.muted("- Idle time (time since last use)")}\n${theme.muted("- Associated session/agent ID")}`).action(async (opts) => {
		const { sandboxListCommand } = await import("./sandbox-T8bxADZD.mjs");
		await runCommandWithRuntime(defaultRuntime, () => sandboxListCommand({
			browser: Boolean(opts.browser),
			json: Boolean(opts.json)
		}, defaultRuntime));
	});
	sandbox.command("recreate").description("Remove containers to force recreation with updated config").option("--all", "Recreate all sandbox containers", false).option("--session <key>", "Recreate container for specific session").option("--agent <id>", "Recreate containers for specific agent").option("--browser", "Only recreate browser containers", false).option("--force", "Skip confirmation prompt", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(SANDBOX_EXAMPLES.recreate)}\n\n${theme.heading("Why use this?")}\n${theme.muted("After updating Docker images or sandbox configuration, existing containers continue running with old settings.")}\n${theme.muted("This command removes them so they'll be recreated automatically with current config when next needed.")}\n\n${theme.heading("Filter options:")}\n${theme.muted("  --all          Remove all sandbox containers")}\n${theme.muted("  --session      Remove container for specific session key")}\n${theme.muted("  --agent        Remove containers for agent (includes agent:id:* variants)")}\n\n${theme.heading("Modifiers:")}\n${theme.muted("  --browser      Only affect browser containers (not regular sandbox)")}\n${theme.muted("  --force        Skip confirmation prompt")}`).action(async (opts) => {
		const { sandboxRecreateCommand } = await import("./sandbox-T8bxADZD.mjs");
		await runCommandWithRuntime(defaultRuntime, () => sandboxRecreateCommand({
			all: Boolean(opts.all),
			session: opts.session,
			agent: opts.agent,
			browser: Boolean(opts.browser),
			force: Boolean(opts.force)
		}, defaultRuntime));
	});
	sandbox.command("explain").description("Explain effective sandbox/tool policy for a session/agent").option("--session <key>", "Session key to inspect (defaults to agent main)").option("--agent <id>", "Agent id to inspect (defaults to derived agent)").option("--json", "Output result as JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(SANDBOX_EXAMPLES.explain)}\n`).action(async (opts) => {
		const { sandboxExplainCommand } = await import("./sandbox-explain-DuWm1Y69.mjs");
		await runCommandWithRuntime(defaultRuntime, () => sandboxExplainCommand({
			session: opts.session,
			agent: opts.agent,
			json: Boolean(opts.json)
		}, defaultRuntime));
	});
}
//#endregion
export { registerSandboxCli };
