import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseStrictPositiveInteger, x as parseStrictNonNegativeInteger } from "./number-coercion-0M4tZV2c.js";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-hLL0vTIh.js";
import "./agent-scope-BiRi-Smp.js";
//#region src/memory-host-sdk/dreaming.ts
const DEFAULT_MEMORY_DREAMING_ENABLED = true;
const DEFAULT_MEMORY_DREAMING_TIMEZONE = void 0;
const DEFAULT_MEMORY_DREAMING_VERBOSE_LOGGING = false;
const DEFAULT_MEMORY_DREAMING_STORAGE_MODE = "separate";
const DEFAULT_MEMORY_DREAMING_SEPARATE_REPORTS = false;
const DEFAULT_MEMORY_DREAMING_PLUGIN_ID = "memory-core";
const MANAGED_MEMORY_DREAMING_CRON_NAME = "Memory Dreaming Promotion";
const MANAGED_MEMORY_DREAMING_CRON_TAG = "[managed-by=memory-core.short-term-promotion]";
const MEMORY_DREAMING_SYSTEM_EVENT_TEXT = "__testclaw_memory_core_short_term_promotion_dream__";
const DEFAULT_MEMORY_LIGHT_DREAMING_LOOKBACK_DAYS = 2;
const DEFAULT_MEMORY_LIGHT_DREAMING_LIMIT = 100;
const DEFAULT_MEMORY_LIGHT_DREAMING_DEDUPE_SIMILARITY = .9;
const DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE = .75;
const DEFAULT_MEMORY_DEEP_DREAMING_MAX_AGE_DAYS = 30;
const DEFAULT_MEMORY_DEEP_DREAMING_MAX_PRIOR_ENTRY_LOSS_FRACTION = .25;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_ENABLED = true;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_TRIGGER_BELOW_HEALTH = .35;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_LOOKBACK_DAYS = 30;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MAX_CANDIDATES = 20;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MIN_CONFIDENCE = .9;
const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_AUTO_WRITE_MIN_CONFIDENCE = .97;
const DEFAULT_MEMORY_REM_DREAMING_LOOKBACK_DAYS = 7;
const DEFAULT_MEMORY_REM_DREAMING_LIMIT = 10;
const DEFAULT_MEMORY_REM_DREAMING_MIN_PATTERN_STRENGTH = .75;
const DEFAULT_MEMORY_DREAMING_SPEED = "balanced";
const DEFAULT_MEMORY_DREAMING_THINKING = "medium";
const DEFAULT_MEMORY_DREAMING_BUDGET = "medium";
const DEFAULT_MEMORY_LIGHT_DREAMING_SOURCES = [
	"daily",
	"sessions",
	"recall"
];
const DEFAULT_MEMORY_DEEP_DREAMING_SOURCES = [
	"daily",
	"memory",
	"sessions",
	"logs",
	"recall"
];
const DEFAULT_MEMORY_REM_DREAMING_SOURCES = [
	"memory",
	"daily",
	"deep"
];
function normalizeScore(value, fallback) {
	const normalized = normalizeStringifiedOptionalString(value);
	if (typeof value === "string" && !normalized) return fallback;
	const num = typeof value === "string" ? Number(normalized) : Number(value);
	if (!Number.isFinite(num) || num < 0 || num > 1) return fallback;
	return num;
}
function normalizeStringArray(value, allowed, fallback) {
	if (!Array.isArray(value)) return [...fallback];
	const allowedSet = new Set(allowed);
	const normalized = [];
	for (const entry of value) {
		const normalizedEntry = normalizeOptionalLowercaseString(entry);
		if (!normalizedEntry || !allowedSet.has(normalizedEntry)) continue;
		if (!normalized.includes(normalizedEntry)) normalized.push(normalizedEntry);
	}
	return normalized.length > 0 ? normalized : [...fallback];
}
function normalizeStorageMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "inline" || normalized === "separate" || normalized === "both") return normalized;
	return DEFAULT_MEMORY_DREAMING_STORAGE_MODE;
}
function normalizeSpeed(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "fast" || normalized === "balanced" || normalized === "slow") return normalized;
}
function normalizeThinking(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "low" || normalized === "medium" || normalized === "high") return normalized;
}
function normalizeBudget(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "cheap" || normalized === "medium" || normalized === "expensive") return normalized;
}
function resolveExecutionConfig(value, fallback) {
	const record = asNullableRecord(value);
	const maxOutputTokens = parseStrictPositiveInteger(record?.maxOutputTokens);
	const timeoutMs = parseStrictPositiveInteger(record?.timeoutMs);
	const temperatureRaw = record?.temperature;
	const temperature = typeof temperatureRaw === "number" && Number.isFinite(temperatureRaw) && temperatureRaw >= 0 ? Math.min(2, temperatureRaw) : void 0;
	const model = normalizeOptionalString(record?.model) ?? fallback.model;
	return {
		speed: normalizeSpeed(record?.speed) ?? fallback.speed,
		thinking: normalizeThinking(record?.thinking) ?? fallback.thinking,
		budget: normalizeBudget(record?.budget) ?? fallback.budget,
		...model ? { model } : {},
		...typeof maxOutputTokens === "number" ? { maxOutputTokens } : {},
		...typeof temperature === "number" ? { temperature } : {},
		...typeof timeoutMs === "number" ? { timeoutMs } : {}
	};
}
function resolveMemoryDreamingPluginId(cfg) {
	const root = asNullableRecord(cfg);
	const plugins = asNullableRecord(root?.plugins);
	const slots = asNullableRecord(plugins?.slots);
	const configuredSlot = normalizeOptionalString(slots?.memory);
	if (configuredSlot && normalizeLowercaseStringOrEmpty(configuredSlot) !== "none") return configuredSlot;
	return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}
function resolveMemoryDreamingPluginConfig(cfg) {
	const root = asNullableRecord(cfg);
	const plugins = asNullableRecord(root?.plugins);
	const entries = asNullableRecord(plugins?.entries);
	const pluginId = resolveMemoryDreamingPluginId(cfg);
	const memoryPlugin = asNullableRecord(entries?.[pluginId]);
	return asNullableRecord(memoryPlugin?.config) ?? void 0;
}
function resolveMemoryDreamingConfig(params) {
	const dreaming = asNullableRecord(params.pluginConfig?.dreaming);
	const frequency = normalizeOptionalString(dreaming?.frequency) ?? "0 3 * * *";
	const timezone = normalizeOptionalString(dreaming?.timezone) ?? normalizeOptionalString(params.cfg?.agents?.defaults?.userTimezone) ?? DEFAULT_MEMORY_DREAMING_TIMEZONE;
	const storage = asNullableRecord(dreaming?.storage);
	const execution = asNullableRecord(dreaming?.execution);
	const phases = asNullableRecord(dreaming?.phases);
	const topLevelModel = normalizeOptionalString(dreaming?.model);
	const defaultExecution = resolveExecutionConfig(execution?.defaults, {
		speed: DEFAULT_MEMORY_DREAMING_SPEED,
		thinking: DEFAULT_MEMORY_DREAMING_THINKING,
		budget: DEFAULT_MEMORY_DREAMING_BUDGET,
		...topLevelModel ? { model: topLevelModel } : {}
	});
	const light = asNullableRecord(phases?.light);
	const deep = asNullableRecord(phases?.deep);
	const rem = asNullableRecord(phases?.rem);
	const deepRecovery = asNullableRecord(deep?.recovery);
	const maxAgeDays = parseStrictPositiveInteger(deep?.maxAgeDays);
	const maxPromotedSnippetTokens = parseStrictPositiveInteger(deep?.maxPromotedSnippetTokens);
	return {
		enabled: parseBoolean(dreaming?.enabled) ?? DEFAULT_MEMORY_DREAMING_ENABLED,
		frequency,
		...timezone ? { timezone } : {},
		verboseLogging: parseBoolean(dreaming?.verboseLogging) ?? DEFAULT_MEMORY_DREAMING_VERBOSE_LOGGING,
		storage: {
			mode: normalizeStorageMode(storage?.mode),
			separateReports: parseBoolean(storage?.separateReports) ?? DEFAULT_MEMORY_DREAMING_SEPARATE_REPORTS
		},
		execution: { defaults: defaultExecution },
		phases: {
			light: {
				enabled: parseBoolean(light?.enabled) ?? true,
				cron: frequency,
				lookbackDays: parseStrictNonNegativeInteger(light?.lookbackDays) ?? DEFAULT_MEMORY_LIGHT_DREAMING_LOOKBACK_DAYS,
				limit: parseStrictNonNegativeInteger(light?.limit) ?? DEFAULT_MEMORY_LIGHT_DREAMING_LIMIT,
				dedupeSimilarity: normalizeScore(light?.dedupeSimilarity, DEFAULT_MEMORY_LIGHT_DREAMING_DEDUPE_SIMILARITY),
				sources: normalizeStringArray(light?.sources, [
					"daily",
					"sessions",
					"recall"
				], DEFAULT_MEMORY_LIGHT_DREAMING_SOURCES),
				execution: resolveExecutionConfig(light?.execution, {
					...defaultExecution,
					speed: "fast",
					thinking: "low",
					budget: "cheap"
				})
			},
			deep: {
				enabled: parseBoolean(deep?.enabled) ?? true,
				cron: frequency,
				limit: parseStrictNonNegativeInteger(deep?.limit) ?? 10,
				minScore: normalizeScore(deep?.minScore, DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE),
				minRecallCount: parseStrictNonNegativeInteger(deep?.minRecallCount) ?? 3,
				minUniqueQueries: parseStrictNonNegativeInteger(deep?.minUniqueQueries) ?? 3,
				recencyHalfLifeDays: parseStrictNonNegativeInteger(deep?.recencyHalfLifeDays) ?? 14,
				...typeof maxAgeDays === "number" ? { maxAgeDays } : { maxAgeDays: DEFAULT_MEMORY_DEEP_DREAMING_MAX_AGE_DAYS },
				maxPromotedSnippetTokens: maxPromotedSnippetTokens ?? 160,
				maxPriorEntryLossFraction: normalizeScore(deep?.maxPriorEntryLossFraction, DEFAULT_MEMORY_DEEP_DREAMING_MAX_PRIOR_ENTRY_LOSS_FRACTION),
				sources: normalizeStringArray(deep?.sources, [
					"daily",
					"memory",
					"sessions",
					"logs",
					"recall"
				], DEFAULT_MEMORY_DEEP_DREAMING_SOURCES),
				recovery: {
					enabled: parseBoolean(deepRecovery?.enabled) ?? DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_ENABLED,
					triggerBelowHealth: normalizeScore(deepRecovery?.triggerBelowHealth, DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_TRIGGER_BELOW_HEALTH),
					lookbackDays: parseStrictNonNegativeInteger(deepRecovery?.lookbackDays) ?? DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_LOOKBACK_DAYS,
					maxRecoveredCandidates: parseStrictNonNegativeInteger(deepRecovery?.maxRecoveredCandidates) ?? DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MAX_CANDIDATES,
					minRecoveryConfidence: normalizeScore(deepRecovery?.minRecoveryConfidence, DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MIN_CONFIDENCE),
					autoWriteMinConfidence: normalizeScore(deepRecovery?.autoWriteMinConfidence, DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_AUTO_WRITE_MIN_CONFIDENCE)
				},
				execution: resolveExecutionConfig(deep?.execution, {
					...defaultExecution,
					speed: "balanced",
					thinking: "high",
					budget: "medium"
				})
			},
			rem: {
				enabled: parseBoolean(rem?.enabled) ?? true,
				cron: frequency,
				lookbackDays: parseStrictNonNegativeInteger(rem?.lookbackDays) ?? DEFAULT_MEMORY_REM_DREAMING_LOOKBACK_DAYS,
				limit: parseStrictNonNegativeInteger(rem?.limit) ?? DEFAULT_MEMORY_REM_DREAMING_LIMIT,
				minPatternStrength: normalizeScore(rem?.minPatternStrength, DEFAULT_MEMORY_REM_DREAMING_MIN_PATTERN_STRENGTH),
				sources: normalizeStringArray(rem?.sources, [
					"memory",
					"daily",
					"deep"
				], DEFAULT_MEMORY_REM_DREAMING_SOURCES),
				execution: resolveExecutionConfig(rem?.execution, {
					...defaultExecution,
					speed: "slow",
					thinking: "high",
					budget: "expensive"
				})
			}
		}
	};
}
function resolveMemoryDeepDreamingConfig(params) {
	const resolved = resolveMemoryDreamingConfig(params);
	return {
		...resolved.phases.deep,
		enabled: resolved.enabled && resolved.phases.deep.enabled,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		verboseLogging: resolved.verboseLogging,
		storage: resolved.storage
	};
}
function resolveMemoryLightDreamingConfig(params) {
	const resolved = resolveMemoryDreamingConfig(params);
	return {
		...resolved.phases.light,
		enabled: resolved.enabled && resolved.phases.light.enabled,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		verboseLogging: resolved.verboseLogging,
		storage: resolved.storage
	};
}
function resolveMemoryRemDreamingConfig(params) {
	const resolved = resolveMemoryDreamingConfig(params);
	return {
		...resolved.phases.rem,
		enabled: resolved.enabled && resolved.phases.rem.enabled,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		verboseLogging: resolved.verboseLogging,
		storage: resolved.storage
	};
}
function resolveMemoryDreamingWorkspaces(cfg, options = {}) {
	const agentIds = listAgentIds(cfg);
	if (agentIds.length === 0) agentIds.push(resolveDefaultAgentId(cfg));
	const byWorkspace = /* @__PURE__ */ new Map();
	const addWorkspace = (workspaceDirRaw, agentIdRaw) => {
		const workspaceDir = workspaceDirRaw?.trim();
		if (!workspaceDir) return;
		const agentId = normalizeOptionalLowercaseString(agentIdRaw) || resolveDefaultAgentId(cfg);
		const key = resolveWorkspaceStateIdentity(workspaceDir).workspacePath;
		const existing = byWorkspace.get(key);
		if (existing) {
			if (!existing.agentIds.includes(agentId)) existing.agentIds.push(agentId);
			return;
		}
		byWorkspace.set(key, {
			workspaceDir,
			agentIds: [agentId]
		});
	};
	for (const agentId of agentIds) addWorkspace(resolveAgentWorkspaceDir(cfg, agentId, options.env), agentId);
	const primaryWorkspaceDir = options.primaryWorkspaceDir?.trim();
	if (primaryWorkspaceDir) addWorkspace(primaryWorkspaceDir, options.primaryAgentId ?? resolveDefaultAgentId(cfg));
	return [...byWorkspace.values()];
}
//#endregion
export { resolveMemoryDeepDreamingConfig as a, resolveMemoryDreamingPluginId as c, resolveMemoryRemDreamingConfig as d, MEMORY_DREAMING_SYSTEM_EVENT_TEXT as i, resolveMemoryDreamingWorkspaces as l, MANAGED_MEMORY_DREAMING_CRON_NAME as n, resolveMemoryDreamingConfig as o, MANAGED_MEMORY_DREAMING_CRON_TAG as r, resolveMemoryDreamingPluginConfig as s, DEFAULT_MEMORY_DREAMING_PLUGIN_ID as t, resolveMemoryLightDreamingConfig as u };
