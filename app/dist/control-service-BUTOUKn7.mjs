import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-DkALZkTa.mjs";
import { t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import "./subsystem-Da3HERzA.mjs";
import "./config-D1wodu3O.mjs";
import { t as ensureBrowserControlAuth } from "./control-auth-BB--eKio.mjs";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-Dk_yKDYV.mjs";
import { a as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, o as withBrowserControlStart, r as getBrowserControlState } from "./browser-control-state-BzuzDm9_.mjs";
import { n as resolveBrowserPluginEnableState } from "./plugin-enabled-CTKsfTR2.mjs";
//#region extensions/browser/src/control-service.ts
/**
* Browser control service lifecycle for plugin-managed, in-process operation.
*/
const logService = createSubsystemLogger("browser").child("service");
async function startBrowserControlServiceUnlocked() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!resolveBrowserPluginEnableState(cfg).enabled) return null;
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-CYcsEO1n.mjs");
		await ensureExtensionRelayToken();
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service",
		onWarn: (message) => logService.warn(message)
	});
	if (hasExtensionProfiles) {
		const { startConfiguredExtensionRelays } = await getExtensionRelayModule();
		await startConfiguredExtensionRelays(state, (name) => resolveProfile(resolved, name), (message) => logService.warn(message));
	}
	logService.info(`Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`);
	return state;
}
/** Starts Browser control without binding the HTTP server when config enables it. */
async function startBrowserControlServiceFromConfig() {
	return await withBrowserControlStart(startBrowserControlServiceUnlocked);
}
/** Stops the in-process Browser control service runtime. */
async function stopBrowserControlService() {
	try {
		await stopBrowserControlRuntime({
			requestedBy: "service",
			onWarn: (message) => logService.warn(message)
		});
	} finally {
		const { disposeGatewayExtensionRelay } = await import("./gateway-relay-route-DfMMVRr0.mjs");
		disposeGatewayExtensionRelay();
		const { stopBrowserScreencasts } = await import("./session-BOxrh3-C.mjs");
		await stopBrowserScreencasts();
	}
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
