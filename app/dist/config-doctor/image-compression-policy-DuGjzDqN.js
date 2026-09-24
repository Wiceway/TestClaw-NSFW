import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { a as resolvePluginCapabilityProviders } from "./capability-provider-runtime-CPQMqvB3.js";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
import { t as resolveImageCapableConfigProviderIds } from "./config-provider-models-C4gvrjuU.js";
//#region src/media-understanding/provider-registry.ts
function mergeProviderIntoRegistry(registry, provider, registryKey = provider.id) {
	const normalizedKey = normalizeMediaProviderId(registryKey);
	const existing = registry.get(normalizedKey);
	const merged = existing ? {
		...existing,
		...provider,
		capabilities: provider.capabilities ?? existing.capabilities,
		defaultModels: provider.defaultModels ?? existing.defaultModels,
		autoPriority: provider.autoPriority ?? existing.autoPriority,
		nativeDocumentInputs: provider.nativeDocumentInputs ?? existing.nativeDocumentInputs,
		documentModels: provider.documentModels ?? existing.documentModels
	} : provider;
	registry.set(normalizedKey, merged);
}
/** Builds the media-understanding provider registry from plugin capabilities and config providers. */
function buildMediaUnderstandingRegistry(overrides, cfg, preparedProviders) {
	const registry = /* @__PURE__ */ new Map();
	const providers = preparedProviders ?? resolvePluginCapabilityProviders({
		key: "mediaUnderstandingProviders",
		cfg
	});
	for (const provider of providers) mergeProviderIntoRegistry(registry, provider);
	for (const normalizedKey of resolveImageCapableConfigProviderIds(cfg)) if (!registry.has(normalizedKey)) mergeProviderIntoRegistry(registry, {
		id: normalizedKey,
		capabilities: ["image"]
	});
	if (overrides) for (const [key, provider] of Object.entries(overrides)) mergeProviderIntoRegistry(registry, provider, key);
	return registry;
}
/** Looks up a media-understanding provider using the same id normalization as registry builds. */
function getMediaUnderstandingProvider(id, registry) {
	return registry.get(normalizeMediaProviderId(id));
}
//#endregion
//#region src/media-understanding/image-runtime.ts
const loadImageRuntime = createLazyRuntimeModule(() => import("./image-BuIgeXcu.js"));
const bindImageRuntime = createLazyRuntimeMethodBinder(loadImageRuntime);
/** Describes one image through the configured media runtime. */
const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModelCore);
/** Describes multiple images through the configured media runtime. */
const describeImagesWithModel = bindImageRuntime((runtime) => runtime.describeImagesWithModelCore);
bindImageRuntime((runtime) => runtime.describeImageWithModelPayloadTransformCore);
bindImageRuntime((runtime) => runtime.describeImagesWithModelPayloadTransformCore);
//#endregion
//#region src/agents/image-compression-policy.ts
const resolveModelAsyncDefault = async (...args) => {
	const { resolveModelAsync } = await import("./model-Bkiu6p3A.js");
	return await resolveModelAsync(...args);
};
/** Resolves the authoritative image limits for one selected provider/model. */
async function resolveImageCompressionModelPolicy(params) {
	const resolveModelAsync = params.deps?.resolveModelAsync ?? resolveModelAsyncDefault;
	async function resolvePolicyWithHooks(skipProviderRuntimeHooks) {
		try {
			return (await resolveModelAsync(params.provider, params.model, params.agentDir, params.cfg, {
				abortSignal: params.abortSignal,
				allowBundledStaticCatalogFallback: true,
				skipProviderRuntimeHooks,
				skipAgentDiscovery: true,
				workspaceDir: params.workspaceDir,
				...params.preparedModelRuntime ? { preparedModelRuntime: params.preparedModelRuntime } : {}
			})).model?.mediaInput?.image ?? {};
		} catch {
			params.abortSignal?.throwIfAborted();
			return {};
		}
	}
	const staticPolicy = await resolvePolicyWithHooks(true);
	if (typeof staticPolicy.maxSidePx === "number" || typeof staticPolicy.maxPixels === "number") return staticPolicy;
	return {
		...await resolvePolicyWithHooks(false),
		...staticPolicy
	};
}
//#endregion
export { getMediaUnderstandingProvider as a, buildMediaUnderstandingRegistry as i, describeImageWithModel as n, describeImagesWithModel as r, resolveImageCompressionModelPolicy as t };
