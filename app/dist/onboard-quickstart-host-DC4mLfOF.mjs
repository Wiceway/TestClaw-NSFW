import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-CTGtP6hf.mjs";
import { v as resolveGatewayPort } from "./paths-DvpAEtA8.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-B6V2-rN8.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-Bu0nDBh8.mjs";
import { n as t } from "./i18n-DrbABx94.mjs";
import { p as waitForGatewayReachable } from "./onboard-helpers-BRZVRRpx.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-DMbzkBFI.mjs";
import { t as resolveGatewayRunOptions } from "./run-options-DmrtZArA.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { n as runBrowserHatchHandoff } from "./onboard-browser-handoff-DtqdrbO_.mjs";
//#region src/commands/onboard-quickstart-host.ts
/** Start the foreground Gateway with fresh plugin facts after onboarding installs. */
async function runQuickstartForegroundGateway(params, deps = {}) {
	return await withPluginCache(createPluginCache(), async () => {
		const { runtime } = params;
		const { config } = await (deps.readConfigSnapshot ?? readConfigFileSnapshot)();
		const links = resolveLocalControlUiProbeLinks({
			bind: config.gateway?.bind,
			port: resolveGatewayPort(config),
			customBindHost: config.gateway?.customBindHost,
			basePath: config.gateway?.controlUi?.basePath,
			tlsEnabled: config.gateway?.tls?.enabled === true
		});
		const credentials = await resolveGatewayCredentialsWithSecretInputs({
			config,
			modeOverride: "local"
		});
		const authMode = config.gateway?.auth?.mode ?? (credentials.password ? "password" : "token");
		const gateway = (deps.runGateway ?? (await import("./run-D2ZKVg7D.mjs")).runGatewayCommand)(resolveGatewayRunOptions({}), getGatewayRunRuntimeHooks());
		const stopped = gateway.then(() => null);
		const reachable = await Promise.race([stopped, (deps.waitForGateway ?? waitForGatewayReachable)({
			url: links.wsUrl,
			token: authMode === "token" ? credentials.token : void 0,
			password: authMode === "password" ? credentials.password : void 0,
			...resolveGatewayStartupTiming()
		})]);
		if (!reachable) return;
		if (reachable.ok) {
			const handoff = await Promise.race([stopped, (deps.runBrowserHandoff ?? runBrowserHatchHandoff)({
				config,
				prompter: createQuickstartNotePrompter(runtime),
				suppressTokenOutput: params.suppressTokenOutput,
				...params.agentId ? { agentId: params.agentId } : {}
			}).catch(() => ({ handedOff: false }))]);
			if (!handoff) return;
			if (!handoff.handedOff) runtime.log(t("wizard.guided.quickstartBrowserUnavailable"));
		} else runtime.log(t("wizard.guided.quickstartGatewayPending"));
		const dashboardUrl = new URL(links.httpUrl);
		const [{ resolveConfiguredSetupModelForAgent }, { resolveSystemAgentOnboardingTarget }] = await Promise.all([import("./utility-model-BXeVl6Jr.mjs"), import("./onboard-agent-target-GsKxXa-R.mjs")]);
		const setupOnly = resolveConfiguredSetupModelForAgent({
			cfg: config,
			agentId: params.agentId ?? resolveSystemAgentOnboardingTarget(config).agentId
		})?.modelTarget === "utility";
		if (setupOnly) {
			dashboardUrl.pathname = `${dashboardUrl.pathname.replace(/\/$/, "")}/custodian`;
			dashboardUrl.searchParams.set("onboarding", "1");
		} else if (params.agentId) dashboardUrl.searchParams.set("session", `agent:${params.agentId}:main`);
		runtime.log(t("wizard.guided.quickstartDashboard", { url: dashboardUrl.toString() }));
		runtime.log(t("wizard.guided.quickstartForeground"));
		runtime.log(t("wizard.guided.quickstartBackground"));
		runtime.log(t("wizard.guided.quickstartReopen"));
		if (setupOnly) runtime.log("Use testclaw setup for the setup assistant. Choose a primary model with testclaw onboard before regular agent chat.");
		await gateway;
	});
}
//#endregion
export { runQuickstartForegroundGateway };
