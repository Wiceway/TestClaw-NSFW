import { r as theme } from "./theme-DLJw9KCD.js";
import "./update-run-ledger-DLD5Q47c.js";
import "./update-run-write-B_JenWiI.js";
import "./update-run-reader-CA3WJ8vB.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { t as addGatewayServiceCommands } from "./register-service-commands-CqnYHllz.js";
import "./install-MtQD7qVf.js";
import "./update-requester-authority-NppA3WQu.js";
import "./lifecycle-DqQE7zvz.js";
import "./status-gtZT_x_X.js";
import "./update-managed-service-handoff-BuncpUGp.js";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	const daemon = program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.testclaw.ai/cli/gateway")}\n`);
	addGatewayServiceCommands(daemon, { statusDescription: "Show service install status + probe connectivity/capability" });
}
//#endregion
export { registerDaemonCli };
