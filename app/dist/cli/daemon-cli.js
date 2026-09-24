import { t as formatDocsLink } from "../links-Dbd25H-p.mjs";
import { r as theme } from "../theme-DzaUZY4q.mjs";
import { t as addGatewayServiceCommands } from "../register-service-commands-CPB7Gpqg.mjs";
import { t as finishUpdateRun } from "../update-run-write-DLKbiRhE.mjs";
import { d as recordUpdateRunDiagnostic, g as recordUpdateRunVerification, h as recordUpdateRunStep, n as adoptUpdateRun } from "../update-run-ledger-CWjgjkCi.mjs";
import { r as getUpdateRun } from "../update-run-reader-DcJAE2Qr.mjs";
import { n as runDaemonInstall } from "../install-7HJ1p_GA.mjs";
import { i as prepareManagedUpdateRequesterIdentity, n as createManagedUpdateRequesterAuthority } from "../update-requester-authority-BqQG6ZV5.mjs";
import { a as isManagedUpdateRequesterOwner, i as runDaemonUninstall, n as runDaemonStart, o as waitForGatewayUpdateRecovery, r as runDaemonStop, t as runDaemonRestart } from "../lifecycle-BoCiDgYF.mjs";
import { t as runDaemonStatus } from "../status-B0FYdsPw.mjs";
import { t as assertForegroundUpdateOrigin } from "../update-managed-service-handoff-DcM1N6C8.mjs";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	const daemon = program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.testclaw.ai/cli/gateway")}\n`);
	addGatewayServiceCommands(daemon, { statusDescription: "Show service install status + probe connectivity/capability" });
}
//#endregion
export { addGatewayServiceCommands, adoptUpdateRun, assertForegroundUpdateOrigin, createManagedUpdateRequesterAuthority, finishUpdateRun, getUpdateRun, isManagedUpdateRequesterOwner, prepareManagedUpdateRequesterIdentity, recordUpdateRunDiagnostic, recordUpdateRunStep, recordUpdateRunVerification, registerDaemonCli, runDaemonInstall, runDaemonRestart, runDaemonStart, runDaemonStatus, runDaemonStop, runDaemonUninstall, waitForGatewayUpdateRecovery };
