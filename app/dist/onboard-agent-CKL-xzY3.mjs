import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { p as resolveAmbientOwnerAgentId, x as toAgentEntriesRecord } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./session-key-C_bfgyCp.mjs";
import { n as listAgentEntries } from "./agent-roster-Cl9s4QHb.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-C-WRgKDI.mjs";
import { p as resolveConfigSnapshotHash } from "./io.read-helpers-CchQKD1x.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-CBkn9eBZ.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-DIHH_X2V.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-DlIrLhpH.mjs";
import "./config-DqAgdhnz.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-mYM8fvAK.mjs";
import { n as createAgent, r as validateAgentIdInput } from "./agent-create-CcPRCTLK.mjs";
//#region src/commands/onboard-agent.ts
function validateFirstOnboardingAgentName(value) {
	const name = value?.trim();
	if (!name) return "Agent name is required.";
	const validation = validateAgentIdInput(name);
	return validation.ok ? void 0 : `${validation.message}. Choose another name.`;
}
function isInjectedMainRoster(config) {
	const roster = listAgentEntries(config);
	const entry = roster[0];
	return roster.length === 1 && entry?.id === "main" && Object.keys(entry).every((key) => key === "id");
}
function mergeOnboardingCandidate(params) {
	const proposalPatch = createMergePatch(params.base, params.candidate);
	const merged = applyMergePatch(params.currentRuntime, proposalPatch);
	const { list: _legacyList, ...agents } = merged.agents ?? {};
	return inheritLegacyDefaultAgentId(params.currentRuntime, {
		...merged,
		agents: {
			...agents,
			entries: toAgentEntriesRecord(listAgentEntries(params.currentRuntime))
		}
	});
}
async function ensureOnboardingAgent(params) {
	if (params.firstAgent) {
		const validationError = validateFirstOnboardingAgentName(params.firstAgent.name);
		if (validationError) throw new Error(validationError);
	}
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	let before = hasExpectedConfigHash ? await readConfigFileSnapshot() : void 0;
	if (before?.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid Assistant config.");
	if (before && (resolveConfigSnapshotHash(before) ?? null) !== params.expectedConfigHash) throw new Error("Assistant config changed before first-agent creation. Retry setup.");
	inheritLegacyDefaultAgentId(params.baseConfig ?? params.config, params.config);
	const hasCandidateRoster = listAgentEntries(params.config).length > 0 && (params.preserveCandidateRoster || !isInjectedMainRoster(params.config));
	if (params.firstAgent?.team) {
		before ??= await readConfigFileSnapshot();
		if (hasCandidateRoster || hasResolvedRosterBeforeMigrations(before)) throw new Error("The requested team was not created because an agent roster already exists. Use `testclaw agents team create` to add a team.");
	}
	if (hasCandidateRoster) return {
		config: params.config,
		configBase: params.baseConfig ?? params.config,
		agentId: resolveAmbientOwnerAgentId(params.config),
		bootstrapPending: false,
		createdAgent: false
	};
	before ??= await readConfigFileSnapshot();
	if (before.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid Assistant config.");
	const effective = before.config;
	const candidateBase = params.baseConfig ?? effective;
	if (before.exists && hasResolvedRosterBeforeMigrations(before)) return {
		config: mergeOnboardingCandidate({
			base: candidateBase,
			candidate: params.config,
			currentRuntime: effective
		}),
		configBase: effective,
		agentId: resolveAmbientOwnerAgentId(effective),
		bootstrapPending: false,
		createdAgent: false
	};
	const firstAgentName = params.firstAgent ? params.firstAgent.name.trim() : "main";
	const createOptions = {
		bootstrapFirstAgent: true,
		...hasExpectedConfigHash ? { expectedConfigHash: params.expectedConfigHash } : {},
		beforePersistentApply: params.beforePersistentApply
	};
	const created = params.firstAgent?.team ? await (await import("./agent-team-DZC2qsJn.mjs")).createAgentTeam({
		...createOptions,
		coordinator: firstAgentName,
		workspaceRoot: params.workspace
	}) : await createAgent({
		...createOptions,
		entry: {
			id: normalizeAgentId(firstAgentName),
			name: firstAgentName,
			workspace: params.workspace
		},
		bootstrapMain: normalizeAgentId(firstAgentName) === "main",
		skipBootstrap: params.config.agents?.defaults?.skipBootstrap,
		skipOptionalBootstrapFiles: params.config.agents?.defaults?.skipOptionalBootstrapFiles
	});
	if (created.status === "error") throw new Error(created.message);
	const createdTeam = "coordinatorId" in created;
	const after = await readConfigFileSnapshot();
	if (!after.valid) throw new Error("Agent creation wrote an invalid Assistant config.");
	if (created.configHash && after.hash !== created.configHash) throw new Error("Assistant config changed after first-agent creation. Retry setup.");
	const config = mergeOnboardingCandidate({
		base: candidateBase,
		candidate: params.config,
		currentRuntime: after.config
	});
	const sessionMigrationWarnings = (await migrateLegacyMainSessionKeys({
		cfg: after.config,
		mode: "detect"
	})).warnings;
	return {
		config,
		configBase: after.config,
		agentId: createdTeam ? created.coordinatorId : created.agentId,
		bootstrapPending: createdTeam ? false : created.bootstrapPending,
		createdAgentIds: createdTeam ? created.agents.map((agent) => agent.agentId) : [created.agentId],
		createdAgent: created.status === "created",
		...created.configHash ? { configHash: created.configHash } : {},
		...sessionMigrationWarnings.length > 0 ? { sessionMigrationWarnings } : {}
	};
}
//#endregion
export { validateFirstOnboardingAgentName as n, ensureOnboardingAgent as t };
