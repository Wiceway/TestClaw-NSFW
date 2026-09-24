import { b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-Wc3zbgLD.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-Djh_Bdiy.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-gVaqQ9_U.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DdLYwEu3.mjs";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-Df5_Ehss.mjs";
//#region src/cli/program/command-group-descriptors.ts
/** Bind descriptors and registration arguments without importing the command modules. */
function buildCommandGroupEntries(descriptors, specs, ...args) {
	const descriptorsByName = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
	return specs.map(([commandNames, register]) => ({
		names: commandNames,
		placeholders: commandNames.map((name) => {
			const descriptor = descriptorsByName.get(name);
			if (!descriptor) throw new Error(`Unknown command descriptor: ${name}`);
			return descriptor;
		}),
		register: (program) => register(program, ...args)
	}));
}
//#endregion
//#region src/cli/program/register.subclis-core.ts
const pluginCliLoader = createLazyImportLoader(() => import("./cli-CCZ9F1NS.mjs"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-Brh-MHWQ.mjs");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
	const invocation = resolveCliArgvInvocation(argv);
	const shouldRegisterPluginCommands = !invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
	if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
	await registerSubCli();
	if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
const entrySpecs = [
	[["acp"], async (program) => (await import("./acp-cli-DlOI9xBy.mjs")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-Hc57saPP.mjs")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./cli/daemon-cli.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-o4C9tvga.mjs")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-DaDzjFmN.mjs")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-OEsKB3kG.mjs")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-BCTypV35.mjs")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-DZMONcaL.mjs")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-VFekn1xQ.mjs")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-B_UaVa2g.mjs")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-DfQs6Zi9.mjs")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-BmXeHYkh.mjs")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-BHvN0x2t.mjs")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-CHhNVYQA.mjs")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-DGTwMx6T.mjs")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-CvEhXpUK.mjs")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-BgI5pmNk.mjs")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-hQAUZPSS.mjs")).registerSandboxCli(program)],
	[["fleet"], async (program) => (await import("./fleet-cli-BS9p_n8F.mjs")).registerFleetCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-M_wWlvZw.mjs")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-D-AsOGdR.mjs")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-CxYTV4BE.mjs")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-BLSGGnPt.mjs")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-DudpQc1B.mjs")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli-BlVOQMHG.mjs")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-vQhWLCoL.mjs")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-B6ZwQaUp.mjs")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-DN6FIbYp.mjs")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-B7c28SqU.mjs")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-D9W7H9HG.mjs")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-DXXr9Lve.mjs")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./pairing-cli-DN8Q4A4Y.mjs")).registerPairingCli(program), "before");
	}],
	[["plugins"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./plugins-cli-D2fR2dln.mjs")).registerPluginsCli(program), "after");
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-A3OTzVON.mjs")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-BsYhWGg9.mjs")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-BSByLYh4.mjs")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-DCpTvBgH.mjs")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-DIdkq-dU.mjs")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-C_5i3mC1.mjs")).registerUpdateCli(program)]
];
function resolveSubCliCommandGroups(argv, context = {}) {
	const descriptors = getSubCliEntriesCore();
	const descriptorNames = new Set(descriptors.map((descriptor) => descriptor.name));
	return buildCommandGroupEntries(descriptors, entrySpecs.filter(([commandNames]) => commandNames.every((name) => descriptorNames.has(name))), argv, context);
}
function getSubCliCompletionGroups(argv = process.argv) {
	const entries = resolveSubCliCommandGroups(argv, { purpose: "completion" });
	const groups = [];
	let previous;
	for (const { name } of getSubCliEntriesCore()) {
		const entry = findCommandGroupEntry(entries, name);
		if (entry && entry !== previous) groups.push({
			name,
			entry
		});
		previous = entry;
	}
	return groups;
}
async function registerSubCliByNameCore(program, name, argv = process.argv, context = {}) {
	if (shouldRegisterGatewayRunOnly(name, argv)) {
		await registerGatewayRunOnly(program);
		return true;
	}
	return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
function registerSubCliCommandsCore(program, argv = process.argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { buildCommandGroupEntries as i, registerSubCliByNameCore as n, registerSubCliCommandsCore as r, getSubCliCompletionGroups as t };
