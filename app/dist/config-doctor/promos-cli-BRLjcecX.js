import { r as theme } from "./theme-DLJw9KCD.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
//#region src/cli/promos-cli.ts
function registerPromosCli(program) {
	const promos = program.command("promos").description("Discover and claim promotional model offers from ClawHub").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/promos", "docs.testclaw.ai/cli/promos")}\n`);
	promos.command("list").description("List active promotions").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosListCommand } = await import("./list-DXke4twL.js");
			await promosListCommand(opts, defaultRuntime);
		});
	});
	promos.command("claim").description("Claim a promotion: set up provider auth and register its models").argument("<slug>", "Promotion slug from `testclaw promos list`").option("--api-key <key>", "Provider API key for non-interactive setup").option("--set-default", "Set the promotion's suggested model as default without asking", false).action(async (slug, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosClaimCommand } = await import("./claim-BDmLnG-_.js");
			await promosClaimCommand(slug, opts, defaultRuntime);
		});
	});
}
//#endregion
export { registerPromosCli };
