import { I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore } from "./argv-zmtAhw2-.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { i as buildCommandGroupEntries } from "./register.subclis-core-JzJVJ2CC.js";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-C15pbKDo.js";
//#region src/cli/program/command-registry-core.ts
const coreEntrySpecs = [
	[["setup", "crestodian"], async (program) => (await import("./register.setup-DrmU5XK4.js")).registerSetupCommand(program)],
	[["onboard"], async (program) => (await import("./register.onboard-ePFBUUP2.js")).registerOnboardCommand(program)],
	[["configure"], async (program) => (await import("./register.configure-C5g9Bh2Q.js")).registerConfigureCommand(program)],
	[["config"], async (program) => (await import("./config-cli-DkgNPOXO.js")).registerConfigCli(program)],
	[["claws"], async (program) => (await import("./claws-cli-CCga3o7L.js")).registerClawsCli(program)],
	[["backup"], async (program) => (await import("./register.backup-D8r87Npn.js")).registerBackupCommand(program)],
	[["database"], async (program) => (await import("./register.database-92SrosW2.js")).registerDatabaseCommand(program)],
	[["migrate"], async (program) => (await import("./register.migrate-CZ4k01td.js")).registerMigrateCommand(program)],
	[["audit"], async (program) => (await import("./register.audit-DXZSWGtX.js")).registerAuditCommand(program)],
	[[
		"doctor",
		"triage",
		"dashboard",
		"reset",
		"uninstall"
	], async (program, ctx) => (await import("./register.maintenance-C6SSzyBn.js")).registerMaintenanceCommands(program, ctx)],
	[["message"], async (program, ctx) => (await import("./register.message-DmjoqZXr.js")).registerMessageCommands(program, ctx)],
	[["mcp"], async (program) => (await import("./mcp-cli-o6xPpeYC.js")).registerMcpCli(program)],
	[["transcripts"], async (program) => (await import("./register.transcripts-w_zYgKC6.js")).registerTranscriptsCli(program)],
	[["agent"], async (program, ctx) => (await import("./register.agent-turn-Bud7xTaI.js")).registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions })],
	[["agents"], async (program) => (await import("./register.agent-C-gkqfsg.js")).registerAgentsCommands(program)],
	[[
		"status",
		"health",
		"sessions",
		"tasks"
	], async (program) => (await import("./register.status-health-sessions-DGpDqLhs.js")).registerStatusHealthSessionsCommands(program)]
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
