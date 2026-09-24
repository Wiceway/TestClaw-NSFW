import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-Dm8T0OhW.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CuzkxMsN.mjs";
import { l as resolveSessionStorePathCore } from "./paths-D1bkI3aW.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { c as inferUniqueProviderFromConfiguredModels, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DIVgwazZ.mjs";
import { S as resolveSubagentModelFallbacksOverride, u as resolveAgentModelFallbacksOverride, x as resolveSubagentModelConfigSelectionResult } from "./agent-scope-_30Scclc.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Djxkz5Qa.mjs";
import { s as isCliProvider } from "./model-selection-7SY54ACM.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-HTO-lu8E.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-C1qee2f5.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-BoGMxzI3.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-C1PlyYHm.mjs";
import { n as SKILL_WORKSHOP_MAINTENANCE_TOOLS, t as SKILL_WORKSHOP_MAINTENANCE_PROMPT } from "./maintenance-prompt-zOCiE9ju.mjs";
import { r as SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX } from "./system-owned-declaration-CIFRO5mv.mjs";
import { n as resolveHeartbeatSchedulerSeed, t as resolveHeartbeatPhaseMs } from "./heartbeat-schedule-Dsj5ECQu.mjs";
import { a as partitionSystemMonitors } from "./heartbeat-monitor-De71CTMV.mjs";
import { r as supportsCronExecutionRoot } from "./execution-root-runtime-DSaHRVG3.mjs";
import { r as resolveCronAgentConfigFromSnapshot } from "./run-config-wCDg5a6u.mjs";
import "./heartbeat-runner-BbdBnWU_.mjs";
//#region src/cron/skill-collection-review-monitor.ts
/** Canonical projection from skill workshop config to system-owned cron jobs. */
const SKILL_COLLECTION_REVIEW_EVERY_MS = 6048e5;
const SKILL_COLLECTION_REVIEW_NO_ROOTED_RUNTIME_REASON = "no-rooted-runtime";
/** Returns undefined when static config cannot prove the full runtime chain. */
function hasEligibleSkillCollectionReviewRuntime(cfg, agentId, manifestPlugins) {
	const normalization = {
		manifestPlugins,
		allowPluginNormalization: false
	};
	const agentConfig = resolveAgentConfig(cfg, agentId);
	const { cfgWithAgentDefaults } = resolveCronAgentConfigFromSnapshot({
		config: cfg,
		agentConfigOverride: agentConfig
	});
	const defaultRef = resolveDefaultModelForAgent({
		cfg: cfgWithAgentDefaults,
		agentId,
		...normalization
	});
	const selection = resolveSubagentModelConfigSelectionResult({
		cfg,
		agentId,
		agentConfigOverride: agentConfig
	});
	const selectedRaw = selection ? resolvePrimaryStringValue(selection.raw) : void 0;
	const aliasIndex = buildModelAliasIndex({
		cfg,
		agentId,
		defaultProvider: defaultRef.provider,
		...normalization
	});
	const selected = selectedRaw ? resolveModelRefFromString({
		cfg,
		agentId,
		aliasIndex,
		...normalization,
		raw: selectedRaw,
		defaultProvider: !selectedRaw.includes("/") ? inferUniqueProviderFromConfiguredModels({
			cfg,
			agentId,
			model: selectedRaw,
			manifestPlugins
		}) ?? defaultRef.provider : defaultRef.provider
	})?.ref : defaultRef;
	if (!selected) return;
	const agentModel = agentConfig?.model;
	const defaultFallbacks = (typeof agentModel === "string" && resolveAgentModelPrimaryValue(agentModel) === resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ? resolveAgentModelFallbackValues(cfgWithAgentDefaults.agents?.defaults?.model) : resolveAgentModelFallbacksOverride(cfgWithAgentDefaults, agentId)) ?? resolveAgentModelFallbackValues(cfgWithAgentDefaults.agents?.defaults?.model);
	const chains = [{
		selected,
		fallbacksOverride: (selection?.source === "subagent" || selection?.source === "default-subagent" ? resolveSubagentModelFallbacksOverride(cfgWithAgentDefaults, agentId) : defaultFallbacks) ?? defaultFallbacks
	}, {
		selected: defaultRef,
		fallbacksOverride: defaultFallbacks
	}];
	const eligibility = new Set(chains.map((chain) => {
		if (chain.fallbacksOverride.some((raw) => !resolveModelRefFromString({
			cfg: cfgWithAgentDefaults,
			agentId,
			aliasIndex,
			...normalization,
			raw,
			defaultProvider: chain.selected.provider
		}))) return;
		const candidates = resolveModelCandidateChain({
			cfg: cfgWithAgentDefaults,
			...normalization,
			agentId,
			provider: chain.selected.provider,
			model: chain.selected.model,
			requestedRouteResolution: "resolved",
			fallbacksOverride: chain.fallbacksOverride
		});
		if (candidates.length === 0) return;
		return candidates.some((candidate) => {
			const policy = resolveAvailableAgentHarnessPolicy({
				mode: "projection",
				config: cfgWithAgentDefaults,
				provider: candidate.provider,
				modelId: candidate.model,
				agentId
			});
			const executionProvider = resolveCliRuntimeExecutionProvider({
				cfg: cfgWithAgentDefaults,
				provider: candidate.provider,
				modelId: candidate.model,
				agentId
			}) ?? candidate.provider;
			return policy.runtimeSource === "implicit" || policy.runtime === "auto" || supportsCronExecutionRoot(policy.runtime, isCliProvider(executionProvider, cfgWithAgentDefaults));
		});
	}));
	return eligibility.has(true) ? true : eligibility.has(void 0) ? void 0 : false;
}
function skillCollectionReviewMonitorAgentId(job) {
	const key = job.declarationKey;
	if (!key?.startsWith("skill-collection-review:")) return;
	return key.slice(24) || void 0;
}
function hasStoredExecutionPreference(cfg, agentId, jobId) {
	try {
		const entry = loadSessionEntryReadOnly({
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
			sessionKey: resolveCronAgentSessionKey({
				sessionKey: `cron:${jobId}`,
				agentId,
				mainKey: cfg.session?.mainKey,
				cfg
			}),
			readConsistency: "latest"
		});
		return Boolean(entry?.modelOverride || entry?.agentRuntimeOverride);
	} catch {
		return true;
	}
}
/** One system-owned review job per configured agent and its Workshop directory. */
function* resolveSkillCollectionReviewMonitorSpecs(cfg, jobs, options = {}) {
	const schedulerSeed = resolveHeartbeatSchedulerSeed(options.schedulerSeed);
	const { retained } = partitionSystemMonitors(jobs, skillCollectionReviewMonitorAgentId);
	const workshopEnabled = resolveSkillWorkshopConfig(cfg).autonomous.mode === "auto";
	const manifestPlugins = getCurrentPluginMetadataSnapshot({
		config: cfg,
		allowWorkspaceScopedSnapshot: true
	}) ?? [];
	for (const agentId of listAgentIds(cfg)) {
		const configuredEligibility = hasEligibleSkillCollectionReviewRuntime(cfg, agentId, manifestPlugins);
		const existing = retained.get(agentId);
		const hasEligibleRuntime = configuredEligibility === false && existing && hasStoredExecutionPreference(cfg, agentId, existing.id) ? void 0 : configuredEligibility;
		const enabled = workshopEnabled && hasEligibleRuntime !== false;
		yield {
			agentId,
			input: {
				declarationKey: `${SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX}${agentId}`,
				name: `skill-collection-review-${agentId}`,
				displayName: workshopEnabled && hasEligibleRuntime === false ? `[${SKILL_COLLECTION_REVIEW_NO_ROOTED_RUNTIME_REASON}] Skill collection review (${agentId})` : `Skill collection review (${agentId})`,
				agentId,
				enabled,
				schedule: {
					kind: "every",
					everyMs: SKILL_COLLECTION_REVIEW_EVERY_MS,
					anchorMs: resolveHeartbeatPhaseMs({
						schedulerSeed,
						agentId,
						intervalMs: SKILL_COLLECTION_REVIEW_EVERY_MS
					})
				},
				payload: {
					kind: "agentTurn",
					message: SKILL_WORKSHOP_MAINTENANCE_PROMPT,
					toolsAllow: [...SKILL_WORKSHOP_MAINTENANCE_TOOLS]
				},
				sessionTarget: "isolated",
				delivery: { mode: "none" },
				wakeMode: "next-heartbeat"
			}
		};
	}
}
//#endregion
export { skillCollectionReviewMonitorAgentId as n, resolveSkillCollectionReviewMonitorSpecs as t };
