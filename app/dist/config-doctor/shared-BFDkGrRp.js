import { S as parseStrictPositiveInteger, y as parseStrictFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { a as resolveAgentDir, l as resolveAgentOperationAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-BEuqweC1.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-B8YMBgKQ.js";
import { k as setRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DTssNCAN.js";
import "./agent-scope-BiRi-Smp.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { D as listProfilesForProvider } from "./order-D7DJivFp.js";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-gE8saxs_.js";
import "./auth-profiles-pp6W0I8V.js";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.js";
import { t as emitJsonOrText } from "./output-D5mZF4lu.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-LPy_iaVf.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DwgFcs6p.js";
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
