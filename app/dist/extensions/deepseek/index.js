import { a as testclaw_plugin_default } from "./.setup/models-CSoHkBlA.mjs";
import { applyDeepSeekConfig } from "./onboard.js";
import { buildDeepSeekProvider } from "./provider-catalog.js";
import { createDeepSeekV4ThinkingWrapper } from "./stream.js";
import { resolveDeepSeekV4ThinkingProfile } from "./thinking.js";
import { readConfiguredProviderCatalogEntries } from "testclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "testclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "testclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "testclaw/plugin-sdk/provider-tools";
import { fetchDeepSeekUsage } from "testclaw/plugin-sdk/provider-usage";
//#region extensions/deepseek/index.ts
const PROVIDER_ID = "deepseek";
var deepseek_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "DeepSeek Provider",
	description: "Bundled DeepSeek provider plugin",
	manifest: testclaw_plugin_default,
	provider: {
		label: "DeepSeek",
		docsPath: "/providers/deepseek",
		manifestAuth: { applyConfig: applyDeepSeekConfig },
		catalog: {
			discoveryMode: "strict",
			buildProvider: buildDeepSeekProvider,
			buildStaticProvider: buildDeepSeekProvider,
			liveModelDiscovery: true
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		matchesContextOverflowError: ({ errorMessage }) => /\bdeepseek\b.*(?:input.*too long|context.*exceed)/i.test(errorMessage),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("deepseek"),
		wrapStreamFn: (ctx) => createDeepSeekV4ThinkingWrapper(ctx.streamFn, ctx.thinkingLevel),
		resolveThinkingProfile: ({ modelId }) => resolveDeepSeekV4ThinkingProfile(modelId),
		isModernModelRef: ({ modelId }) => Boolean(resolveDeepSeekV4ThinkingProfile(modelId)),
		resolveUsageAuth: async (ctx) => {
			const apiKey = ctx.resolveApiKeyFromConfigAndStore({ envDirect: [ctx.env.DEEPSEEK_API_KEY] });
			return apiKey ? { token: apiKey } : null;
		},
		fetchUsageSnapshot: async (ctx) => await fetchDeepSeekUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn)
	}
});
//#endregion
export { deepseek_default as default };
