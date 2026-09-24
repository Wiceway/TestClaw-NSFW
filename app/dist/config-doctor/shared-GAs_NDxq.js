import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-DaCUjVXa.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { a as resolveGatewayService } from "./service-lSBwGN47.js";
//#region src/cli/gateway-cli/shared.ts
function renderGatewayServiceStopHints(env = process.env) {
	const profile = env.TESTCLAW_PROFILE;
	switch (process.platform) {
		case "darwin": return [`Tip: ${formatCliCommand("testclaw gateway stop")}`, `Or: launchctl bootout gui/$UID/${resolveGatewayLaunchAgentLabel(profile)}`];
		case "linux": return [`Tip: ${formatCliCommand("testclaw gateway stop")}`, `Or: systemctl --user stop ${resolveGatewaySystemdServiceName(profile)}.service`];
		case "win32": return [`Tip: ${formatCliCommand("testclaw gateway stop")}`, `Or: schtasks /End /TN "${resolveGatewayWindowsTaskName(profile)}"`];
		default: return [`Tip: ${formatCliCommand("testclaw gateway stop")}`];
	}
}
async function maybeExplainGatewayServiceStop() {
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch {
		loaded = null;
	}
	if (loaded === false) return;
	defaultRuntime.error(loaded ? `Gateway service appears ${service.loadedText}. Stop it first.` : "Gateway service status unknown; if supervised, stop it first.");
	for (const hint of renderGatewayServiceStopHints()) defaultRuntime.error(hint);
}
//#endregion
export { maybeExplainGatewayServiceStop };
