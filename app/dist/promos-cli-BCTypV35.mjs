import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-DLBW8fmc.mjs";
//#region src/cli/promos-cli.ts
function registerPromosCli(program) {
	const promos = program.command("promos").description("Discover and claim promotional model offers from ClawHub").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/promos", "docs.testclaw.ai/cli/promos")}\n`);
	promos.command("list").description("List active promotions").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosListCommand } = await import("./list-D3_vitTE.mjs");
			await promosListCommand(opts, defaultRuntime);
		});
	});
	promos.command("claim").description("Claim a promotion: set up provider auth and register its models").argument("<slug>", "Promotion slug from `testclaw promos list`").option("--api-key <key>", "Provider API key for non-interactive setup").option("--set-default", "Set the promotion's suggested model as default without asking", false).action(async (slug, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosClaimCommand } = await import("./claim-CPsqhtrQ.mjs");
			await promosClaimCommand(slug, opts, defaultRuntime);
		});
	});
}
//#endregion
export { registerPromosCli };
