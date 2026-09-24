import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-zmtAhw2-.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-C15pbKDo.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-qsL6oOFz.js";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-DMu8hUxu.js";
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
const pluginCliLoader = createLazyImportLoader(() => import("./cli-BlRVi66K.js"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-CSFIwiQp.js");
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
	[["acp"], async (program) => (await import("./acp-cli-nQ-CZYmj.js")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-Dq9MYqw8.js")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./daemon-cli-Dk2gfiep.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-D98oInHS.js")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-23SQUwwq.js")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-mmDVpH2p.js")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-BRLjcecX.js")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-BVGQXX3T.js")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-C16S9gEi.js")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-DZVPZG2X.js")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-DUp01ELm.js")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-CZTn0f4j.js")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-Bej9C8gs.js")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-BPSAlIfg.js")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-40jbJiT-.js")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-BOs9vWZk.js")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-AU7DP0lI.js")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-sGOKoLH5.js")).registerSandboxCli(program)],
	[["fleet"], async (program) => (await import("./fleet-cli-BITCuOFW.js")).registerFleetCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-CLg6Hb1s.js")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-BO4ZycYf.js")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-D9xsFPWL.js")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-B0NS8h_F.js")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-BFIWxQgo.js")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli-BX4wQ0Pb.js")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-UlNpNf1x.js")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-COz0s9IM.js")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-DUCnpWqZ.js")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-DkIpC_je.js")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-CbMZ5HSx.js")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-DOCKH2oz.js")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./pairing-cli-9b_qRM0A.js")).registerPairingCli(program), "before");
	}],
	[["plugins"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./plugins-cli-C3WVip1S.js")).registerPluginsCli(program), "after");
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-Y949DGYD.js")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-tcBanOX6.js")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-DXRsIU2T.js")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-DfA6lBtQ.js")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-BIQjYP34.js")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-Cj8am8bf.js")).registerUpdateCli(program)]
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
