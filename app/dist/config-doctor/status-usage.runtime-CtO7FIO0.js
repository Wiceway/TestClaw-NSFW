import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { a as resolveAgentDir, m as resolveConfiguredAgentId, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import "./agent-scope-BiRi-Smp.js";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Wz3M4QhR.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BXJ-qR2p.js";
import { t as resolveAgentHarnessPolicy } from "./policy-DkYYnWfL.js";
import "./model-selection-osPTiirn.js";
import { i as shouldUseCodexSyntheticUsageForRuntime, n as mergeUsageSummaries, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-Bk_Pw2OU.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-BQIySxNz.js";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-79QWx1W2.js";
//#region src/commands/status-usage.runtime.ts
const providerUsageLoader = createLazyImportLoader(() => import("./provider-usage-kRyIdD5T.js"));
function shouldUseConfiguredCodexSyntheticUsage(params) {
	const configuredDefault = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId: params.agentId,
		allowPluginNormalization: false
	});
	const policy = resolveAgentHarnessPolicy({
		config: params.config,
		agentId: params.agentId,
		provider: configuredDefault.provider,
		modelId: configuredDefault.model
	});
	if (!shouldUseCodexSyntheticUsageForRuntime({
		provider: configuredDefault.provider,
		effectiveHarness: policy.runtime
	})) return false;
	const authLabel = resolveModelAuthLabel({
		provider: configuredDefault.provider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: configuredDefault.provider,
			harnessRuntime: policy.runtime,
			config: params.config
		}),
		cfg: params.config,
		agentDir: params.agentDir,
		includeExternalProfiles: false
	});
	return resolveUsageCredentialType(authLabel) !== "api_key";
}
/** Loads provider usage for status output from an explicit or ambient system-agent scope. */
async function resolveStatusUsageSummary(params) {
	const { loadProviderUsageSummary } = await providerUsageLoader.load();
	const rawAgentId = params.agentId?.trim();
	if (params.agentId !== void 0 && !rawAgentId) throw new Error("--agent must not be blank");
	const agentId = rawAgentId ? normalizeAgentId(rawAgentId) : void 0;
	if (agentId) resolveConfiguredAgentId(params.config, agentId);
	let resolvedAgentId = agentId;
	let agentDir = params.agentDir;
	if (!agentDir) {
		resolvedAgentId ??= resolveAmbientOwnerAgentId(params.config, void 0, {
			surface: "status usage credentials",
			hint: "Set agents.defaults.systemAgent.agentId."
		});
		agentDir = resolveAgentDir(params.config, resolvedAgentId);
	}
	const usage = await loadProviderUsageSummary({
		timeoutMs: resolveStatusGatewayProbeTimeoutMs(params),
		config: params.config,
		agentDir
	});
	if (!shouldUseConfiguredCodexSyntheticUsage({
		config: params.config,
		agentDir,
		agentId: resolvedAgentId
	})) return usage;
	const codexUsage = await loadProviderUsageSummary({
		timeoutMs: resolveStatusGatewayProbeTimeoutMs(params),
		providers: ["openai"],
		auth: [buildCodexSyntheticUsageAuth()],
		config: params.config,
		agentDir
	});
	return mergeUsageSummaries(usage, codexUsage);
}
//#endregion
export { resolveStatusUsageSummary };
