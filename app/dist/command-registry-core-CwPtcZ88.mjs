import { I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore } from "./argv-Wc3zbgLD.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-Djh_Bdiy.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-Df5_Ehss.mjs";
import { i as buildCommandGroupEntries } from "./register.subclis-core-CpMbiwc2.mjs";
//#region src/cli/program/command-registry-core.ts
const coreEntrySpecs = [
	[["setup", "crestodian"], async (program) => (await import("./register.setup-KgShPU74.mjs")).registerSetupCommand(program)],
	[["onboard"], async (program) => (await import("./register.onboard-DKw4YI1m.mjs")).registerOnboardCommand(program)],
	[["configure"], async (program) => (await import("./register.configure-BY0AEDS9.mjs")).registerConfigureCommand(program)],
	[["config"], async (program) => (await import("./config-cli-daSbsV4P.mjs")).registerConfigCli(program)],
	[["claws"], async (program) => (await import("./claws-cli-Bt-_mfsU.mjs")).registerClawsCli(program)],
	[["backup"], async (program) => (await import("./register.backup-C2156jAZ.mjs")).registerBackupCommand(program)],
	[["database"], async (program) => (await import("./register.database-BPETMK2E.mjs")).registerDatabaseCommand(program)],
	[["migrate"], async (program) => (await import("./register.migrate-PiyeaoHS.mjs")).registerMigrateCommand(program)],
	[["audit"], async (program) => (await import("./register.audit-B2dmaeno.mjs")).registerAuditCommand(program)],
	[[
		"doctor",
		"triage",
		"dashboard",
		"reset",
		"uninstall"
	], async (program, ctx) => (await import("./register.maintenance-dO6lveX5.mjs")).registerMaintenanceCommands(program, ctx)],
	[["message"], async (program, ctx) => (await import("./register.message-D2Jfu5W_.mjs")).registerMessageCommands(program, ctx)],
	[["mcp"], async (program) => (await import("./mcp-cli-CM0pYRpe.mjs")).registerMcpCli(program)],
	[["transcripts"], async (program) => (await import("./register.transcripts-CPMjtah8.mjs")).registerTranscriptsCli(program)],
	[["agent"], async (program, ctx) => (await import("./register.agent-turn-DXKfdq2P.mjs")).registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions })],
	[["agents"], async (program) => (await import("./register.agent-Bs3t7uPf.mjs")).registerAgentsCommands(program)],
	[[
		"status",
		"health",
		"sessions",
		"tasks"
	], async (program) => (await import("./register.status-health-sessions-QCPKLOTP.mjs")).registerStatusHealthSessionsCommands(program)]
];
function resolveCoreCommandGroups(ctx) {
	const descriptors = getCoreCliCommandDescriptors();
	const visibleCommandNames = new Set(descriptors.map((descriptor) => descriptor.name));
	const visibleEntrySpecs = coreEntrySpecs.filter(([commandNames]) => commandNames.every((name) => visibleCommandNames.has(name)));
	return buildCommandGroupEntries(descriptors, visibleEntrySpecs, ctx);
}
function getCoreCliCompletionGroups(ctx) {
	const entries = resolveCoreCommandGroups(ctx);
	return getCoreCliCommandNamesCore().map((name) => findCommandGroupEntry(entries, name)).filter((entry, index, groups) => entry !== void 0 && entry !== groups[index - 1]);
}
async function registerCoreCliByName(program, ctx, name) {
	return registerCommandGroupByName(program, resolveCoreCommandGroups(ctx), name);
}
function registerCoreCliCommands(program, ctx, argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveCoreCommandGroups(ctx), {
		eager: false,
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { registerCoreCliByName as n, registerCoreCliCommands as r, getCoreCliCompletionGroups as t };
