import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as registerQrCli } from "./qr-cli-B6H_-5Jg.mjs";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	const clawbot = program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.testclaw.ai/cli/clawbot")}\n`);
	registerQrCli(clawbot);
}
//#endregion
export { registerClawbotCli };
