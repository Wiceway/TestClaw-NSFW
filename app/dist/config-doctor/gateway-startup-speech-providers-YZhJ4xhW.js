import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { w as resolveConfigDir } from "./utils-BfoJTy8l.js";
import { D as withAgentRosterFactsBatch, k as listAgentEntries, r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { f as mergeDeep } from "./includes-Be6ircIw.js";
import { m as TtsAutoSchema } from "./zod-schema.core-D3dVE7Km.js";
import { n as readConfigMachineState } from "./config-machine-state-BiDCuNUZ.js";
import { o as resolveConfiguredTalkSpeechProviderId } from "./talk-Bog1VVrD.js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
new Set(TtsAutoSchema.options);
function isTtsAutoMode(value) {
	return TtsAutoSchema.safeParse(value).success;
}
/** Normalize an unknown value into a supported TTS auto mode. */
function normalizeTtsAutoMode(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized && isTtsAutoMode(normalized)) return normalized;
}
//#endregion
//#region src/tts/tts-config.ts
function resolveAgentTtsOverride(cfg, agentId) {
	if (!agentId) return;
	return resolveAgentConfig(cfg, agentId)?.tts;
}
function resolveTtsConfigContext(contextOrAgentId) {
	return typeof contextOrAgentId === "string" ? { agentId: contextOrAgentId } : contextOrAgentId ?? {};
}
function resolveRecordEntry(entries, id, normalize) {
	const normalizedId = normalizeOptionalString(id);
	if (!entries || !normalizedId) return;
	if (Object.hasOwn(entries, normalizedId)) return entries[normalizedId];
	const normalized = normalize(normalizedId);
	const key = Object.keys(entries).find((candidate) => normalize(candidate) === normalized);
	return key ? entries[key] : void 0;
}
function asTtsConfig(value) {
	return isRecord(value) ? value : void 0;
}
function resolveChannelConfig(cfg, channelId) {
	if (!isRecord(cfg.channels)) return;
	const normalizedChannelId = normalizeOptionalString(channelId);
	if (!normalizedChannelId) return;
	return asOptionalRecord(resolveRecordEntry(cfg.channels, normalizedChannelId, normalizeLowercaseStringOrEmpty));
}
function resolveChannelTtsOverride(cfg, context) {
	return asTtsConfig(resolveChannelConfig(cfg, context.channelId)?.tts);
}
function resolveAccountTtsOverride(cfg, context) {
	const channelConfig = resolveChannelConfig(cfg, context.channelId);
	const accountConfig = resolveRecordEntry(isRecord(channelConfig?.accounts) ? channelConfig.accounts : void 0, context.accountId, normalizeAccountId);
	return asTtsConfig(asOptionalRecord(accountConfig)?.tts);
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
	const context = resolveTtsConfigContext(contextOrAgentId);
	const base = cfg.tts ?? {};
	const agentOverride = resolveAgentTtsOverride(cfg, context.agentId);
	const channelOverride = resolveChannelTtsOverride(cfg, context);
	const accountOverride = resolveAccountTtsOverride(cfg, context);
	let merged = base;
	for (const override of [
		agentOverride,
		channelOverride,
		accountOverride
	]) merged = mergeDeep(merged, override ?? {});
	return merged;
}
/** Resolve the configured TTS mode, defaulting to final-answer synthesis. */
function resolveConfiguredTtsMode(cfg, contextOrAgentId) {
	return resolveEffectiveTtsConfig(cfg, contextOrAgentId).mode ?? "final";
}
function resolveTtsPrefsPathValue(prefsPath, machinePrefsPath) {
	if (prefsPath?.trim()) return resolveUserPath(prefsPath.trim());
	const envPath = process.env.TESTCLAW_TTS_PREFS?.trim();
	if (envPath) return resolveUserPath(envPath);
	if (machinePrefsPath?.trim()) return resolveUserPath(machinePrefsPath.trim());
	return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function readTtsPrefsAutoMode(prefsPath) {
	try {
		if (!existsSync(prefsPath)) return;
		const prefs = JSON.parse(readFileSync(prefsPath, "utf8"));
		const auto = normalizeTtsAutoMode(prefs.tts?.auto);
		if (auto) return auto;
		if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
	} catch {
		return;
	}
}
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
function shouldAttemptTtsPayload(params) {
	const sessionAuto = normalizeTtsAutoMode(params.ttsAuto);
	if (sessionAuto) return sessionAuto !== "off";
	const raw = resolveEffectiveTtsConfig(params.cfg, params);
	const scopedPrefsPath = raw.prefsPath;
	const prefsAuto = readTtsPrefsAutoMode(resolveTtsPrefsPathValue(scopedPrefsPath, readConfigMachineState("tts.prefsPath")));
	if (prefsAuto) return prefsAuto !== "off";
	const configuredAuto = normalizeTtsAutoMode(raw?.auto);
	if (configuredAuto) return configuredAuto !== "off";
	return raw?.enabled === true;
}
/** Return whether TTS directive markup should be stripped from user-visible text. */
function shouldCleanTtsDirectiveText(params) {
	if (!shouldAttemptTtsPayload(params)) return false;
	return resolveEffectiveTtsConfig(params.cfg, params).modelOverrides?.enabled !== false;
}
//#endregion
//#region src/plugins/gateway-startup-speech-providers.ts
const TTS_PROVIDER_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
	"auto",
	"enabled",
	"maxTextLength",
	"mode",
	"modelOverrides",
	"persona",
	"personas",
	"prefsPath",
	"provider",
	"providers",
	"summaryModel",
	"timeoutMs"
]);
/** Treats missing activation as enabled while honoring explicit false values. */
function isConfigActivationValueEnabled(value) {
	if (value === false) return false;
	if (isRecord(value) && value.enabled === false) return false;
	return true;
}
/** Normalizes configured TTS provider ids for startup plugin selection. */
function normalizeConfiguredSpeechProviderIdForStartup(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "edge" ? "microsoft" : normalized;
}
/** Resolves provider activation from both canonical providers maps and legacy root keys. */
function resolveProviderConfigActivation(ttsConfig, providerId) {
	let fromProviders;
	if (isRecord(ttsConfig.providers)) {
		for (const [key, providerConfig] of Object.entries(ttsConfig.providers)) if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId) fromProviders = isConfigActivationValueEnabled(providerConfig);
	}
	if (fromProviders !== void 0) return fromProviders;
	for (const [key, providerConfig] of Object.entries(ttsConfig)) {
		if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord(providerConfig)) continue;
		if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId) return isConfigActivationValueEnabled(providerConfig);
	}
}
function addProviderIfEnabled(target, ttsConfig, providerId) {
	const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
	if (!normalized) return;
	if (resolveProviderConfigActivation(ttsConfig, normalized) !== false) target.add(normalized);
}
function findActivePersona(ttsConfig) {
	const personaId = normalizeOptionalLowercaseString(typeof ttsConfig.persona === "string" ? ttsConfig.persona : void 0);
	if (!personaId || !isRecord(ttsConfig.personas)) return;
	for (const [id, persona] of Object.entries(ttsConfig.personas)) if (normalizeOptionalLowercaseString(id) === personaId && isRecord(persona)) return persona;
}
function addActivePersonaProvider(target, ttsConfig) {
	const persona = findActivePersona(ttsConfig);
	if (!persona) return;
	const provider = normalizeConfiguredSpeechProviderIdForStartup(persona.provider);
	if (!provider) return;
	const rootActivation = resolveProviderConfigActivation(ttsConfig, provider);
	if ((resolveProviderConfigActivation(persona, provider) ?? rootActivation) !== false) target.add(provider);
}
function addConfiguredTtsProviderIds(target, value) {
	if (!isRecord(value)) return;
	addProviderIfEnabled(target, value, value.provider);
	addActivePersonaProvider(target, value);
	if (isRecord(value.providers)) {
		for (const [providerId, providerConfig] of Object.entries(value.providers)) if (isConfigActivationValueEnabled(providerConfig)) addProviderIfEnabled(target, value, providerId);
	}
	for (const [key, providerConfig] of Object.entries(value)) {
		if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord(providerConfig)) continue;
		if (isConfigActivationValueEnabled(providerConfig)) addProviderIfEnabled(target, value, key);
	}
}
/** Collects active Talk and TTS provider ids across root, agent, channel, and plugin config. */
function collectConfiguredSpeechProviderIds(config) {
	const configured = /* @__PURE__ */ new Set();
	addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config));
	const talkProviderId = resolveConfiguredTalkSpeechProviderId(config);
	if (talkProviderId) configured.add(talkProviderId.toLowerCase());
	withAgentRosterFactsBatch(config, () => {
		for (const agent of listAgentEntries(config)) addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, { agentId: agent.id }));
	});
	const channels = config.channels;
	if (isRecord(channels)) for (const [channelId, channelConfig] of Object.entries(channels)) {
		if (!isRecord(channelConfig)) continue;
		addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, { channelId }));
		if (isRecord(channelConfig.voice)) addConfiguredTtsProviderIds(configured, channelConfig.voice.tts);
		if (isRecord(channelConfig.accounts)) for (const [accountId, accountConfig] of Object.entries(channelConfig.accounts)) {
			if (!isRecord(accountConfig)) continue;
			addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, {
				channelId,
				accountId
			}));
			if (isRecord(accountConfig.voice)) addConfiguredTtsProviderIds(configured, accountConfig.voice.tts);
		}
	}
	const pluginEntries = config.plugins?.entries;
	if (isRecord(pluginEntries)) {
		for (const entry of Object.values(pluginEntries)) if (isRecord(entry) && isRecord(entry.config)) addConfiguredTtsProviderIds(configured, entry.config.tts);
	}
	return configured;
}
//#endregion
export { shouldCleanTtsDirectiveText as a, shouldAttemptTtsPayload as i, resolveConfiguredTtsMode as n, normalizeTtsAutoMode as o, resolveEffectiveTtsConfig as r, collectConfiguredSpeechProviderIds as t };
