import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-CsUjLuei.js";
import { v as resolveGatewayPort } from "./paths-DeOFr7iP.js";
import { c as readConfigFileSnapshot } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-TdJ-hIgC.js";
import { t } from "./i18n-BgYW2H_X.js";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.js";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-C9rqkiyC.js";
import { t as resolveGatewayRunOptions } from "./run-options-2SIBzr_r.js";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.js";
import { p as waitForGatewayReachable } from "./onboard-helpers-CO30s3pJ.js";
import { n as createQuickstartNotePrompter } from "./setup-apply-CApOVL5Y.js";
import { n as runBrowserHatchHandoff } from "./onboard-browser-handoff-DY4w7mjB.js";
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
		const gateway = (deps.runGateway ?? (await import("./run-T91702Bk.js")).runGatewayCommand)(resolveGatewayRunOptions({}), getGatewayRunRuntimeHooks());
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
		const [{ resolveConfiguredSetupModelForAgent }, { resolveSystemAgentOnboardingTarget }] = await Promise.all([import("./utility-model-CkYA544q.js"), import("./onboard-agent-target-FQoB8WU6.js")]);
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
