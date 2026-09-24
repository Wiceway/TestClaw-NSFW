import { r as theme } from "./theme-DLJw9KCD.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { t as registerQrCli } from "./qr-cli-D3ERB-dr.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	const clawbot = program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.testclaw.ai/cli/clawbot")}\n`);
	registerQrCli(clawbot);
}
//#endregion
export { registerClawbotCli };
