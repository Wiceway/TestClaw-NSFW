import { w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { a as resolveAgentDir, l as resolveAgentOperationAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import { k as setRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dti8jFIP.mjs";
import "./agent-scope-_30Scclc.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-DBxaTVGF.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-G1LpD3Dj.mjs";
import { p as listProfilesForProvider } from "./order-BnTFWeei.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-CZ_l0ERR.mjs";
import "./auth-profiles-3zYAJqiZ.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-DLBW8fmc.mjs";
import { t as emitJsonOrText } from "./output-CB4SXVdl.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-BF4T7bWV.mjs";
//#region src/cli/capability-cli/shared.ts
function registerLocalProvidersCommand(parent, description, collect, format) {
	parent.command("providers").description(description).option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const result = await collect(cfg, resolveCapabilityProviderAgentId(cfg, resolveCapabilityAgentOption(command, opts.agent)));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, format);
		});
	});
}
function resolveTransport(opts) {
	if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
	if (opts.local) {
		if (!opts.supported.includes("local")) throw new Error("This command does not support --local.");
		return "local";
	}
	if (opts.gateway) {
		if (!opts.supported.includes("gateway")) throw new Error("This command does not support --gateway.");
		return "gateway";
	}
	return opts.defaultTransport;
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function resolveSelectedProviderFromModelRef(modelRef) {
	return resolveModelRefOverride(modelRef).provider;
}
function resolveCapabilityProviderAgentId(cfg, rawAgentId, surface = "inference provider inspection") {
	const requestedAgentId = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requestedAgentId) throw new Error("--agent must not be blank");
	const agentId = resolveAgentOperationAgentId(cfg, requestedAgentId, {
		surface,
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	});
	return resolveConfiguredAgentId(cfg, agentId);
}
function resolveCapabilityAgentOption(command, rawAgentId) {
	return typeof rawAgentId === "string" ? rawAgentId : inheritOptionFromParent(command, "agent");
}
function getAuthProfileIdsForProvider(cfg, providerId, agentId) {
	const agentDir = resolveAgentDir(cfg, agentId);
	const store = loadAuthProfileStoreForRuntime(agentDir);
	return listProfilesForProvider(store, providerId);
}
function providerHasGenericConfig(params) {
	const modelsProviders = params.cfg.models?.providers ?? {};
	const pluginEntries = params.cfg.plugins?.entries ?? {};
	const ttsProviders = params.cfg.tts?.providers ?? {};
	const envConfigured = (params.envVars ?? getProviderEnvVarsCore(params.providerId, {
		config: params.cfg,
		includeUntrustedWorkspacePlugins: false
	})).some((envVar) => Boolean(process.env[envVar]?.trim()));
	return (params.agentId ? getAuthProfileIdsForProvider(params.cfg, params.providerId, params.agentId).length > 0 : false) || hasOwnKeys(modelsProviders[params.providerId]) || hasOwnKeys(pluginEntries[params.providerId]?.config) || hasOwnKeys(ttsProviders[params.providerId]) || envConfigured;
}
function resolveModelRefOverride(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return {};
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return { model: trimmed };
	return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
}
function requireProviderModelOverride(raw) {
	const resolved = resolveModelRefOverride(raw);
	if (!raw?.trim()) return;
	if (!resolved.provider || !resolved.model) throw new Error("Model overrides must use the form <provider/model>.");
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
function parseOptionalFiniteNumber(raw, label) {
	if (raw === void 0) return;
	const value = parseStrictFiniteNumber(raw);
	if (value === void 0) throw new Error(`${label} must be a finite number`);
	return value;
}
function parseOptionalPositiveInteger(raw, label) {
	if (raw === void 0) return;
	const value = parseStrictPositiveInteger(raw);
	if (value === void 0) throw new Error(`${label} must be a positive integer`);
	return value;
}
function parseOptionalTimeoutMs(raw) {
	if (raw === void 0) return;
	return parseTimeoutMsWithFallback(raw, 0, { invalidType: "error" });
}
async function resolveLocalCapabilityRuntimeConfig(params) {
	const cfg = params.config ?? getRuntimeConfig();
	const { effectiveConfig } = await resolveCommandConfigWithSecrets({
		config: cfg,
		commandName: params.commandName,
		targetIds: params.targetIds,
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {},
		...params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {},
		...params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {},
		runtime: defaultRuntime,
		autoEnable: true
	});
	pinRuntimeConfigSnapshot(effectiveConfig);
	return effectiveConfig;
}
function pinRuntimeConfigSnapshot(config) {
	const sourceConfig = getRuntimeConfigSourceSnapshot();
	if (sourceConfig) setRuntimeConfigSnapshot(config, sourceConfig);
	else setRuntimeConfigSnapshot(config);
}
//#endregion
export { providerHasGenericConfig as a, resolveCapabilityAgentOption as c, resolveModelRefOverride as d, resolveSelectedProviderFromModelRef as f, pinRuntimeConfigSnapshot as i, resolveCapabilityProviderAgentId as l, parseOptionalPositiveInteger as n, registerLocalProvidersCommand as o, resolveTransport as p, parseOptionalTimeoutMs as r, requireProviderModelOverride as s, parseOptionalFiniteNumber as t, resolveLocalCapabilityRuntimeConfig as u };
