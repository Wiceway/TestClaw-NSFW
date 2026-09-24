import { n as resolveLaunchAgentLabel } from "./launchd-label--1tgJye2.js";
import { p as assertNoSystemLaunchDaemonOwnership } from "./launchd-service-files-BGzLaAYg.js";
import { n as formatLaunchAgentGuiSessionError, s as launchAgentPlistExists } from "./launchd-runtime-CoXJr0nG.js";
import { a as repairLaunchAgentBootstrap } from "./launchd-D7dcSeIP.js";
//#region src/cli/daemon-cli/launchd-recovery.ts
const LAUNCH_AGENT_RECOVERY_MESSAGE = "Gateway LaunchAgent was installed but not loaded; re-bootstrapped launchd service.";
/** Re-bootstrap an installed but unloaded LaunchAgent after a daemon start/restart command. */
async function recoverInstalledLaunchAgent(params) {
	if (process.platform !== "darwin") return null;
	const env = params.env ?? process.env;
	await assertNoSystemLaunchDaemonOwnership(resolveLaunchAgentLabel(env));
	if (!await launchAgentPlistExists(env).catch(() => false)) return null;
	const repaired = await repairLaunchAgentBootstrap({ env }).catch(() => ({
		ok: false,
		status: "bootstrap-failed"
	}));
	if (!repaired.ok) {
		if (repaired.status === "system-launchdaemon-conflict" || repaired.status === "system-launchdaemon-unverifiable") throw new Error(repaired.detail);
		if (repaired.status === "gui-session-unavailable") {
			const actionHint = params.result === "started" ? "testclaw gateway start" : "testclaw gateway restart";
			throw new Error(formatLaunchAgentGuiSessionError({
				detail: repaired.detail,
				domain: repaired.domain,
				actionHint
			}));
		}
		return null;
	}
	return {
		result: params.result,
		loaded: true,
		message: LAUNCH_AGENT_RECOVERY_MESSAGE
	};
}
//#endregion
export { recoverInstalledLaunchAgent as t };
