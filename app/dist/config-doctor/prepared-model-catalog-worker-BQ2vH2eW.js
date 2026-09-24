import "./src-D9uQ497Z.js";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { c as getPluginCacheRetirementSignal, d as getPluginMetadataSnapshotCache, x as retainPluginCache } from "./plugin-cache-CsUjLuei.js";
import { l as normalizePluginsConfig } from "./config-state-D4j-tzq3.js";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.js";
import { n as sha256Base64Url } from "./crypto-digest-BPwjfEnk.js";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.js";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B-Vaprol.js";
import { r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-DdST9izh.js";
import { t as createPluginSourceCaptureRoot } from "./plugin-source-capture-directory-CPoh62MZ.js";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-C37uqoxY.js";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-B2GL8yVx.js";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BG0XBpEU.js";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts } from "./resolution-facts-BNNyTRcj.js";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DFHRRtMK.js";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-BNBUeFnX.js";
import { f as hashRuntimeConfigValue } from "./runtime-snapshot-DTssNCAN.js";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-CudV4k5X.js";
import { n as dedupeByKey, r as indexFirstByKey } from "./provider-thinking-catalog-B0d_iUnw.js";
import { d as parseConfiguredModelVisibilityEntries, r as buildConfiguredModelCatalog, x as overlayCatalogMetadata } from "./model-selection-shared-YvCZW05m.js";
import { s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-_Hi_clcB.js";
import { t as _usingCtx } from "./usingCtx-E-VWE-jt.js";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-Dw-35-pc.js";
import { O as getPreparedMessageToolCatalog, f as getActivePluginRegistryWorkspaceDir, k as getPreparedMessageToolCatalogForRegistry, l as getActivePluginRegistry, p as getActivePluginRuntimeSubagentMode } from "./runtime-B980B6n3.js";
import { o as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-D9AW3Yaj.js";
import { h as cloneAuthProfileStore } from "./oauth-shared-BGXKQwtd.js";
import { c as mergeAuthProfileStores } from "./persisted-CmvE9bHt.js";
import { s as getPreparedRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-LZfHFeGe.js";
import { a as listRuntimePluginIdsFromRegistry, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-CRb0op67.js";
import { f as getPluginRegistryInspectionResources } from "./registry-Tav6IqeL.js";
import { a as setPluginRuntimeLoadContext, i as getReusablePluginRuntimeActivation, n as createPluginRuntimeLoaderLogger, r as getPluginRuntimeLoadContext } from "./load-context-WcpD8aSw.js";
import { l as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-DWsCgWGn.js";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.js";
import { i as resolvePreparedProviderStaticConfigs } from "./provider-discovery-Bfpchrcc.js";
import { B as discoverModelsFromCapturedSources, S as PreparedModelRuntimeBuildResources, T as completeConfiguredRuntimeModels, U as prepareAmbientAgentCredentialsForDiscovery, g as discardPreparedPluginGeneration, o as markPreparedModelCatalogFull, p as createPreparedPluginGeneration, x as retainPreparedPluginRegistry, z as discoverAuthStorageFacts } from "./prepared-model-runtime.full-catalog-D-4WACLM.js";
import { H as prepareSyntheticAuthWithProvider, o as captureProviderSyntheticAuthFacts } from "./provider-runtime-B3-FZB4p.js";
import { i as resolveRuntimeSyntheticAuthProviderRefs, t as listManifestSyntheticAuthProviderRefs } from "./synthetic-auth.runtime-1WTMeGiK.js";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-gE8saxs_.js";
import "./model-registry-UE0EOYQn.js";
import { t as buildInlineProviderModels } from "./model.inline-provider-BBK25OcC.js";
import { a as loadPersistedPluginModelCatalogsReadOnly, l as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-5YFea29o.js";
import { c as createStaticModelIdMatcher, n as createBundledStaticCatalogModelResolver, r as loadBundledProviderStaticCatalogContextModels } from "./model.static-catalog-BSz-_dUz.js";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-BzMigPHF.js";
import { a as prepareConfiguredRuntimeModels, n as collectPreparedModelRuntimeConfiguredRefs, o as prepareRuntimeCapabilityModels, r as collectPreparedModelRuntimeProviderIds, t as collectConfiguredProviderIdsNeedingStaticCatalog } from "./prepared-model-runtime.configured-C2ccdKs-.js";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-BlxUBe6z.js";
import { a as registerPreparedModelRuntimeClose } from "./prepared-model-runtime.lifecycle-D5VV7O0t.js";
import { n as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-DsAgPM8S.js";
import { n as captureClawInstallSchemaVersionFacts } from "./provenance-runtime-read-DdbCG8om.js";
import { t as prepareMediaCapabilityProviders } from "./capability-provider-runtime-CPQMqvB3.js";
import { t as prepareImplicitProviderStaticCatalog } from "./models-config.providers.implicit-DeFBvMPs.js";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-CUANypxi.js";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/agents/prepared-model-runtime.auth-store.ts
const defaultDeps = {
	loadDurable: (input) => ensureAuthProfileStoreWithoutExternalProfiles(input.agentDir, {
		allowKeychainPrompt: false,
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		readOnly: true
	}),
	loadPublished: (input) => getPreparedRuntimeAuthProfileStoreSnapshot(input.agentDir, input.inheritedAuthDir)
};
/** Merges runtime-only external auth over durable profiles for one replacement generation. */
function loadPreparedModelRuntimeAuthStore(input, deps = defaultDeps) {
	const published = deps.loadPublished(input);
	if (!published || published.runtimeExternalProfileIds === void 0 && published.runtimeExternalProfileIdsAuthoritative !== true) return;
	return mergeAuthProfileStores(deps.loadDurable(input), published);
}
//#endregion
//#region src/agents/prepared-model-runtime.agent-facts.ts
function prepareAgentFacts(input, catalogMode, ambientCredentials, additionalProviderIds = [], includeCredentialProviders = catalogMode === "live") {
	const env = input.env ?? process.env;
	const preparedStore = loadPreparedModelRuntimeAuthStore(input);
	const authFacts = discoverAuthStorageFacts(input.agentDir, {
		config: input.config,
		readOnly: true,
		ambientCredentials,
		...preparedStore ? { preparedStore } : {},
		...input.skipCredentials ? { skipCredentials: true } : {},
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {}
	});
	const credentials = authFacts.credentials;
	const templateAuthStorage = authFacts.authStorage;
	const rawConfiguredModelRefs = collectPreparedModelRuntimeConfiguredRefs(input.config, input.agentId, input.readOnly ? input.runtimePluginSelections : void 0);
	return {
		input,
		env,
		authStore: authFacts.store,
		templateAuthStorage,
		credentials,
		configuredModelRefs: rawConfiguredModelRefs.flatMap(({ value }) => {
			const ref = parseModelCatalogRef(value);
			return ref ? [ref] : [];
		}),
		providerIds: [.../* @__PURE__ */ new Set([
			...collectPreparedModelRuntimeProviderIds(input.config, credentials, includeCredentialProviders, rawConfiguredModelRefs, input.agentId),
			...parseConfiguredModelVisibilityEntries({
				cfg: input.config,
				agentId: input.agentId
			}).providerWildcards,
			...additionalProviderIds.map(normalizeProviderId).filter(Boolean)
		])].toSorted((left, right) => left.localeCompare(right))
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-catalog.ts
function createConfiguredModelCatalogSnapshot(params) {
	const replace = params.agentFacts.input.config.models?.mode === "replace";
	const keyOf = createModelCatalogIdentityKeyResolver();
	const runtimeEntries = (replace ? [] : params.configuredRuntimeModels).map(({ model }) => modelCatalogRowToEntry(model));
	const runtimeByIdentity = /* @__PURE__ */ new Map();
	for (const entry of runtimeEntries) {
		const key = keyOf(entry);
		const donors = runtimeByIdentity.get(key) ?? [];
		donors.push(entry);
		runtimeByIdentity.set(key, donors);
	}
	const catalog = [...replace ? [] : params.templateModelRegistry.getAll().map(modelCatalogRowToEntry), ...runtimeEntries];
	const catalogByIdentity = indexFirstByKey(catalog, keyOf);
	const configuredEntries = dedupeByKey([
		...buildConfiguredModelCatalog({
			cfg: params.agentFacts.input.config,
			catalog,
			manifestPlugins: params.workspaceFacts.pluginMetadataSnapshot
		}).map((entry) => {
			const key = keyOf(entry);
			const accepted = catalogByIdentity.get(key);
			if (!accepted || !modelTransportRoutesMatch(accepted, entry)) return entry;
			const donor = accepted.contextWindows ? accepted : runtimeByIdentity.get(key)?.find((candidate) => modelTransportRoutesMatch(candidate, accepted));
			return donor?.contextWindows ? overlayCatalogMetadata(entry, {
				...entry,
				contextWindows: donor.contextWindows,
				contextWindowDefault: donor.contextWindowDefault
			}) : entry;
		}),
		...runtimeEntries,
		...replace ? [] : params.agentFacts.configuredModelRefs.flatMap(({ provider, modelId }) => {
			const model = params.templateModelRegistry.find(provider, modelId);
			return model ? [modelCatalogRowToEntry(model)] : [];
		})
	], keyOf);
	return {
		entries: configuredEntries,
		routeVariants: configuredEntries,
		...runtimeEntries.length > 0 ? { staticEntries: runtimeEntries } : {}
	};
}
function prepareConfiguredRuntimeFacts(params) {
	return {
		templateModelRegistry: params.templateModelRegistry,
		modelCatalog: createConfiguredModelCatalogSnapshot(params),
		configuredRuntimeModels: params.configuredRuntimeModels,
		inlineProviderModels: params.workspaceFacts.inlineProviderModels
	};
}
/** Startup can expose captured rows; full refresh overlays only configured membership. */
function prepareCapturedRuntimeFacts(params) {
	const facts = prepareConfiguredRuntimeFacts(params);
	if (params.agentFacts.input.config.models?.mode === "replace") return facts;
	const entries = dedupeByKey([...facts.modelCatalog.entries, ...params.templateModelRegistry.getAll().map(modelCatalogRowToEntry)], createModelCatalogIdentityKeyResolver());
	return {
		...facts,
		modelCatalog: {
			...facts.modelCatalog,
			entries,
			routeVariants: entries
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-context.ts
const emptyPluginDiscovery = {
	candidates: [],
	diagnostics: []
};
/** Resolves and attaches the plugin facts owned by one prepared workspace generation. */
function prepareOwnedPluginLoadContext(input, env, registry, preparedMetadataSnapshot, preferBuiltPluginArtifacts = false, preparedRegistry) {
	const metadataSnapshot = preparedMetadataSnapshot ?? resolvePluginMetadataSnapshot({
		config: input.config,
		env,
		...input.workspaceDir ? {
			workspaceDir: input.workspaceDir,
			allowWorkspaceScopedCurrent: true
		} : {},
		...input.loadRuntimePlugins && input.runtimePluginSelections && input.workspaceDir ? { pluginIdScope: createAgentRuntimeMetadataPluginIdScope({
			config: input.config,
			workspaceDir: input.workspaceDir,
			selections: input.runtimePluginSelections
		}) } : {}
	});
	if (!registry) return metadataSnapshot;
	const { config } = input;
	const workspaceDir = metadataSnapshot.workspaceDir ?? input.workspaceDir;
	const preparedActivation = getReusablePluginRuntimeActivation(preparedRegistry ?? registry, {
		config,
		env,
		workspaceDir,
		metadataSnapshot
	});
	if (preparedActivation) {
		const targetContext = getPluginRuntimeLoadContext(registry);
		setPluginRuntimeLoadContext(registry, {
			...preparedActivation,
			rawConfig: config,
			env,
			workspaceDir,
			metadataSnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index),
			logger: targetContext?.logger ?? createPluginRuntimeLoaderLogger(),
			expectedSourceDigests: targetContext?.expectedSourceDigests,
			preferBuiltPluginArtifacts
		});
		return metadataSnapshot;
	}
	const discoverySnapshot = metadataSnapshot.discovery ? metadataSnapshot : {
		...metadataSnapshot,
		discovery: emptyPluginDiscovery
	};
	const context = {
		...resolvePluginRuntimeLoadContext({
			config,
			env,
			workspaceDir,
			metadataSnapshot: discoverySnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			preferBuiltPluginArtifacts
		}),
		metadataSnapshot
	};
	setPluginRuntimeLoadContext(registry, context);
	return metadataSnapshot;
}
//#endregion
//#region src/agents/prepared-model-runtime.inbound-registry.ts
function inboundRegistryIdentity(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true
	});
}
/** Groups model-selected workspace facts while keeping generic inbound identity narrower. */
function preparedModelRuntimeWorkspaceFactsKey(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		readOnly: input.readOnly === true,
		loadRuntimePlugins: input.loadRuntimePlugins === true,
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections?.map(({ provider, runtime }) => ({
			provider,
			runtime
		}))
	});
}
/** Loads generic plugin facts without acquiring model, catalog, or credential state. */
function loadPreparedInboundPluginRegistry(input, metadataSnapshot = prepareOwnedPluginLoadContext(input, input.env ?? process.env, void 0), configuredHarnessRuntimes, onPrimaryRegistry) {
	const activeRegistry = getActivePluginRegistry();
	const reusableGatewayRegistry = input.allowGatewaySubagentBinding === true && input.env === void 0 && getActivePluginRuntimeSubagentMode() === "gateway-bindable" && activeRegistry && getActivePluginRegistryWorkspaceDir() === metadataSnapshot.workspaceDir && getReusablePluginRuntimeActivation(activeRegistry, {
		config: input.config,
		env: process.env,
		workspaceDir: metadataSnapshot.workspaceDir,
		metadataSnapshot
	}) && listRuntimePluginIdsFromRegistry(activeRegistry).every(createRuntimePluginManifestLookup(activeRegistry, metadataSnapshot.manifestRegistry.plugins)) ? activeRegistry : void 0;
	const registry = reusableGatewayRegistry ?? loadAgentRuntimePluginRegistryHandle({
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		preferBuiltPluginArtifacts: true,
		configuredHarnessRuntimes
	}, onPrimaryRegistry);
	if (reusableGatewayRegistry) onPrimaryRegistry?.(reusableGatewayRegistry);
	prepareOwnedPluginLoadContext(input, input.env ?? process.env, registry, metadataSnapshot, true);
	return registry;
}
/** Creates one lifecycle-batch loader that shares exact generic registry identities. */
function createPreparedInboundRegistryLoader() {
	const registries = /* @__PURE__ */ new Map();
	return (input, metadataSnapshot, configuredHarnessRuntimes, onPrimaryRegistry) => {
		const key = inboundRegistryIdentity(input);
		const existing = registries.get(key);
		if (existing?.metadataSnapshot === metadataSnapshot) {
			onPrimaryRegistry?.(existing.primaryRegistry);
			return existing.registry;
		}
		let primaryRegistry;
		const registry = loadPreparedInboundPluginRegistry(input, metadataSnapshot, configuredHarnessRuntimes, (source) => {
			primaryRegistry = source;
		});
		primaryRegistry ??= registry;
		registries.set(key, {
			metadataSnapshot,
			registry,
			primaryRegistry
		});
		onPrimaryRegistry?.(primaryRegistry);
		return registry;
	};
}
/** Prepares distinct generic-inbound and model-selected registries for one workspace generation. */
function prepareWorkspacePluginRegistries(input, metadataSnapshot, retainRegistry, loadInboundRegistry, preferBuiltPluginArtifacts = false, reusableGeneration, getConfiguredHarnessRuntimes, basePluginIds, loadRuntimeRegistry = loadAgentRuntimePluginRegistryHandle, purpose) {
	if (purpose !== "model-catalog" && input.readOnly && !input.loadRuntimePlugins && !input.runtimePluginSelections) return {};
	let primaryRegistry;
	const inboundPluginRegistry = input.readOnly || purpose === "model-catalog" ? void 0 : reusableGeneration?.inboundPluginRegistry ?? loadInboundRegistry?.(input, metadataSnapshot, getConfiguredHarnessRuntimes?.(), (source) => {
		primaryRegistry = source;
	});
	const baseRegistry = reusableGeneration?.pluginRegistry ?? inboundPluginRegistry;
	for (const registry of /* @__PURE__ */ new Set([inboundPluginRegistry, baseRegistry])) if (registry) retainRegistry(registry);
	primaryRegistry ??= reusableGeneration?.mediaCapabilityProviderSource?.registry ?? baseRegistry;
	let loadedPrimaryRegistry;
	const runtimePluginRegistry = purpose === "model-catalog" || input.runtimePluginSelections || !baseRegistry ? loadRuntimeRegistry({
		...purpose === "model-catalog" ? { basePluginIds: basePluginIds ?? [] } : input.loadRuntimePlugins ? { basePluginIds: [] } : baseRegistry ? { basePluginIds: listRuntimePluginIdsFromRegistry(baseRegistry) } : basePluginIds !== void 0 ? { basePluginIds } : {},
		...reusableGeneration?.pluginRegistry ? { reusableRegistry: reusableGeneration.pluginRegistry } : {},
		config: input.config,
		env: input.env ?? process.env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		metadataSnapshot,
		...preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		selections: input.runtimePluginSelections,
		configuredHarnessRuntimes: getConfiguredHarnessRuntimes?.(),
		...purpose ? { purpose } : {}
	}, (source) => {
		loadedPrimaryRegistry = reusableGeneration && source === reusableGeneration.pluginRegistry ? reusableGeneration.mediaCapabilityProviderSource?.registry ?? source : source;
	}) : baseRegistry;
	const prepared = (registry) => {
		if (registry) retainRegistry(registry);
		return {
			runtimePluginRegistry: registry,
			primaryRegistry: registry === baseRegistry ? primaryRegistry ?? registry : loadedPrimaryRegistry ?? registry,
			...inboundPluginRegistry ? { inboundPluginRegistry } : {}
		};
	};
	return runtimePluginRegistry instanceof Promise ? runtimePluginRegistry.then(prepared) : prepared(runtimePluginRegistry);
}
//#endregion
//#region src/agents/prepared-model-runtime.oauth-providers.ts
function hasSameOAuthProviderGeneration(left, right) {
	return left.length === right.length && left.every((provider, index) => {
		const candidate = right[index];
		return candidate !== void 0 && provider.id === candidate.id && provider.name === candidate.name && provider.usesCallbackServer === candidate.usesCallbackServer && provider.login === candidate.login && provider.refreshToken === candidate.refreshToken && provider.getApiKey === candidate.getApiKey && provider.modifyModels === candidate.modifyModels;
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.synthetic-auth.ts
/** Synthetic-auth provider ref selection and prepared-catalog resolution for model-runtime builds. */
function scopeSyntheticAuthProviderRefs(refs, providerDiscoveryProviderIds) {
	if (!providerDiscoveryProviderIds) return [...refs];
	const scoped = new Set(providerDiscoveryProviderIds.map((id) => normalizeProviderId(id)));
	if (scoped.has("openai")) scoped.add("codex");
	return refs.filter((ref) => scoped.has(normalizeProviderId(ref)));
}
function listPreparedSyntheticAuthProviderRefs(providers) {
	return [...new Set(providers.flatMap((provider) => provider.resolveSyntheticAuth || provider.prepareSyntheticAuth ? [
		provider.id,
		...provider.aliases ?? [],
		...provider.hookAliases ?? []
	] : []))].toSorted((left, right) => left.localeCompare(right));
}
async function prepareSyntheticAuth(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const providerPlugin = params.providers.find((candidate) => [
		candidate.id,
		...candidate.aliases ?? [],
		...candidate.hookAliases ?? []
	].some((ref) => normalizeProviderId(ref) === normalizedProvider));
	const context = {
		config: params.config,
		provider: params.provider,
		providerConfig: Object.entries(params.config.models?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[1]
	};
	return providerPlugin ? await prepareSyntheticAuthWithProvider(providerPlugin, context, params) : void 0;
}
//#endregion
//#region src/agents/prepared-model-runtime.facts.ts
function prepareConfiguredModelFacts(config, pluginMetadataSnapshot) {
	return {
		inlineProviderModels: buildInlineProviderModels(config.models?.providers ?? {}, { providerMetadataOwners: pluginMetadataSnapshot.owners }),
		configuredCatalogEntries: buildConfiguredModelCatalog({
			cfg: config,
			manifestPlugins: pluginMetadataSnapshot
		})
	};
}
async function prepareWorkspaceBuildGroup(inputs, catalogMode, options = {}, loadInboundPluginRegistry, reusablePluginGeneration, preparedPluginMetadataSnapshot) {
	try {
		var _usingCtx$1 = _usingCtx();
		const input = inputs[0];
		if (!input) throw new Error("prepared model runtime workspace group is empty");
		const env = input.env ?? process.env;
		let workspacePluginIds = [];
		const reportStage = (stage) => options.onStage?.(`${stage}; agent ${input.agentId ?? "standalone"}` + (workspacePluginIds.length ? `; workspace plugins ${workspacePluginIds.join(", ")}` : ""));
		reportStage("workspace plugins");
		const pluginMetadataStartedAt = performance.now();
		const pluginMetadataSnapshot = preparedPluginMetadataSnapshot ?? reusablePluginGeneration?.pluginMetadataSnapshot ?? prepareOwnedPluginLoadContext(input, env, void 0);
		_usingCtx$1.u({ [Symbol.dispose]: retainPluginCache(getPluginMetadataSnapshotCache(pluginMetadataSnapshot)) });
		const pluginMetadataMs = reusablePluginGeneration ? 0 : performance.now() - pluginMetadataStartedAt;
		const runtimePluginStartedAt = performance.now();
		workspacePluginIds = pluginMetadataSnapshot.index.plugins.filter((plugin) => plugin.enabled && plugin.origin === "workspace").map((plugin) => plugin.pluginId);
		if (workspacePluginIds.length) reportStage("workspace plugins");
		const preferBuiltPluginArtifacts = reusablePluginGeneration?.preferBuiltPluginArtifacts ?? options.preferBuiltPluginArtifacts === true;
		const localResources = _usingCtx$1.a(new AsyncDisposableStack());
		const registryResources = options.registryResources ?? localResources.use(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry));
		registryResources.retainGeneration(reusablePluginGeneration);
		const preparingRegistries = prepareWorkspacePluginRegistries(input, pluginMetadataSnapshot, (registry) => registryResources.retainRegistry(registry), loadInboundPluginRegistry, preferBuiltPluginArtifacts, reusablePluginGeneration, options.getConfiguredHarnessRuntimes, options.basePluginIds, options.loadRuntimeRegistry, options.purpose);
		const { inboundPluginRegistry, runtimePluginRegistry, primaryRegistry } = preparingRegistries instanceof Promise ? await preparingRegistries : preparingRegistries;
		const reuseRuntimeFacts = reusablePluginGeneration && runtimePluginRegistry === reusablePluginGeneration.pluginRegistry;
		const resources = primaryRegistry && getPluginRegistryInspectionResources(primaryRegistry);
		const mediaCapabilityProviderSource = primaryRegistry && resources ? Object.freeze({
			registry: primaryRegistry,
			resources
		}) : void 0;
		const runtimePluginMs = performance.now() - runtimePluginStartedAt;
		prepareOwnedPluginLoadContext(input, env, runtimePluginRegistry, pluginMetadataSnapshot, preferBuiltPluginArtifacts, inboundPluginRegistry);
		let preparedGeneration;
		const prepare = async () => {
			options.assertCurrent?.(input);
			const matchesStaticModelId = createStaticModelIdMatcher({ manifestPlugins: pluginMetadataSnapshot });
			const mediaCapabilityProviders = reuseRuntimeFacts ? reusablePluginGeneration.mediaCapabilityProviders : input.readOnly || !runtimePluginRegistry ? void 0 : prepareMediaCapabilityProviders({
				cfg: input.config,
				pluginMetadataSnapshot,
				registry: runtimePluginRegistry
			});
			const messageToolCatalog = reuseRuntimeFacts ? reusablePluginGeneration.messageToolCatalog : runtimePluginRegistry ? getPreparedMessageToolCatalogForRegistry(runtimePluginRegistry) : catalogMode === "live" ? getPreparedMessageToolCatalog() : void 0;
			const resolveManifestStaticCatalogModel = createBundledStaticCatalogModelResolver({
				cfg: input.config,
				env,
				includeRuntimeDiscovery: true,
				metadataSnapshot: pluginMetadataSnapshot,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			});
			const configuredManifestModels = /* @__PURE__ */ new Map();
			const resolveConfiguredManifestModel = (lookup) => {
				const key = `${normalizeProviderId(lookup.provider)}\0${lookup.modelId.trim().toLowerCase()}`;
				if (configuredManifestModels.has(key)) return configuredManifestModels.get(key);
				const model = resolveManifestStaticCatalogModel(lookup);
				configuredManifestModels.set(key, model);
				return model;
			};
			const configuredProviders = new Set((options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean));
			const configuredModelRefs = [];
			for (const candidate of inputs) {
				await setImmediate();
				options.assertCurrent?.(candidate);
				const { config, agentId } = candidate;
				for (const provider of withAgentRosterFactsBatch(config, () => {
					const refs = collectPreparedModelRuntimeConfiguredRefs(config, agentId, candidate.readOnly ? candidate.runtimePluginSelections : void 0);
					configuredModelRefs.push(...refs);
					return [...collectPreparedModelRuntimeProviderIds(config, {}, false, refs, agentId), ...parseConfiguredModelVisibilityEntries({
						cfg: config,
						agentId
					}).providerWildcards];
				})) configuredProviders.add(provider);
			}
			const configuredProviderIds = [...configuredProviders].toSorted((left, right) => left.localeCompare(right));
			const staticCatalogProviderIds = [.../* @__PURE__ */ new Set([...collectConfiguredProviderIdsNeedingStaticCatalog({
				config: input.config,
				configuredModelRefs,
				matchesStaticModelId,
				resolveStaticCatalogModel: resolveConfiguredManifestModel
			}), ...(options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean)])].toSorted((left, right) => left.localeCompare(right));
			const staticProviderCatalogStartedAt = performance.now();
			reportStage("static provider catalog");
			let preparedStaticProviderCatalog = reuseRuntimeFacts ? reusablePluginGeneration.preparedStaticProviderCatalog : catalogMode === "static" ? await prepareImplicitProviderStaticCatalog({
				signal: options.signal,
				config: input.config,
				env,
				pluginMetadataSnapshot,
				providerDiscoveryProviderIds: configuredProviderIds,
				staticCatalogProviderIds,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			}) : void 0;
			if (catalogMode === "static" && reusablePluginGeneration && !reuseRuntimeFacts && runtimePluginRegistry?.providers.length) preparedStaticProviderCatalog = Object.freeze({
				entries: preparedStaticProviderCatalog?.entries ?? [],
				providers: Object.freeze([...new Map([...(preparedStaticProviderCatalog?.providers ?? []).map((provider) => [provider.id, provider]), ...runtimePluginRegistry.providers.map(({ provider }) => [provider.id, provider])]).values()])
			});
			const staticProviderCatalogMs = reuseRuntimeFacts ? 0 : performance.now() - staticProviderCatalogStartedAt;
			const preparedSyntheticAuthProviders = preparedStaticProviderCatalog?.providers ?? [];
			const ambientCredentialsStartedAt = performance.now();
			reportStage("ambient credentials");
			const ambientCredentials = await prepareAmbientAgentCredentialsForDiscovery({
				signal: options.signal,
				config: input.config,
				env,
				authoritativeSyntheticAuthProviderRefs: pluginMetadataSnapshot.owners.cliBackends.keys(),
				syntheticAuthProviderRefs: catalogMode === "static" ? scopeSyntheticAuthProviderRefs(listPreparedSyntheticAuthProviderRefs(preparedSyntheticAuthProviders), options.providerDiscoveryProviderIds) : scopeSyntheticAuthProviderRefs(resolveRuntimeSyntheticAuthProviderRefs({
					config: input.config,
					env,
					index: pluginMetadataSnapshot.index,
					registryDiagnostics: pluginMetadataSnapshot.registryDiagnostics,
					...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
				}), configuredProviderIds),
				...catalogMode === "static" ? { resolveSyntheticAuth: (provider) => prepareSyntheticAuth({
					signal: options.signal,
					config: input.config,
					env,
					workspaceDir: input.workspaceDir,
					provider,
					providers: preparedSyntheticAuthProviders
				}) } : {},
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			});
			const ambientCredentialsMs = performance.now() - ambientCredentialsStartedAt;
			const agentFactsStartedAt = performance.now();
			reportStage("agent facts");
			const agentBaseFacts = [];
			for (const candidate of inputs) {
				await setImmediate();
				options.assertCurrent?.(candidate);
				options.onBeforeAuthCapture?.(candidate);
				agentBaseFacts.push(withAgentRosterFactsBatch(candidate.config, () => prepareAgentFacts(candidate, catalogMode, ambientCredentials, options.providerDiscoveryProviderIds, options.includeCredentialProviders)));
			}
			const agentFactsMs = performance.now() - agentFactsStartedAt;
			const configuredProjectionStartedAt = performance.now();
			reportStage("configured model projection");
			const providerStaticModels = reusablePluginGeneration?.providerStaticModels ?? (catalogMode === "static" ? [] : await loadBundledProviderStaticCatalogContextModels({
				cfg: input.config,
				env,
				metadataSnapshot: pluginMetadataSnapshot,
				registeredProviders: runtimePluginRegistry?.providers,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			}));
			const { inlineProviderModels, configuredCatalogEntries } = reusablePluginGeneration ?? (options.getConfiguredModelFacts ?? prepareConfiguredModelFacts)(input.config, pluginMetadataSnapshot);
			const agentFacts = [];
			for (const facts of agentBaseFacts) {
				await setImmediate();
				options.assertCurrent?.(facts.input);
				const configuredRuntimeModels = prepareConfiguredRuntimeModels({
					config: facts.input.config,
					inlineProviderModels,
					configuredModelRefs: facts.configuredModelRefs,
					metadataSnapshot: pluginMetadataSnapshot,
					...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
					providerStaticModels,
					matchesStaticModelId,
					resolveStaticCatalogModel: resolveConfiguredManifestModel
				});
				const runtimeCapabilityModels = prepareRuntimeCapabilityModels({
					config: facts.input.config,
					agentId: facts.input.agentId,
					candidates: [...configuredCatalogEntries, ...configuredRuntimeModels.map(({ model, modelId, provider }) => ({
						...modelCatalogRowToEntry(model),
						id: modelId,
						provider
					}))],
					resolveRuntimeModel: resolveConfiguredManifestModel
				});
				const configuredGeneratedCatalogPluginIds = [...new Set((facts.input.config.models?.mode === "replace" ? [] : facts.providerIds).flatMap((provider) => {
					const pluginId = resolvePluginModelCatalogOwnerPluginId({
						providerId: provider,
						pluginMetadataSnapshot
					});
					return pluginId ? [pluginId] : [];
				}))].toSorted((left, right) => left.localeCompare(right));
				agentFacts.push({
					...facts,
					configuredRuntimeModels,
					runtimeCapabilityModels,
					configuredGeneratedCatalogPluginIds
				});
			}
			const configuredProjectionMs = performance.now() - configuredProjectionStartedAt;
			const pluginGeneration = createPreparedPluginGeneration({
				catalogMode,
				configuredCatalogEntries,
				inboundPluginRegistry,
				inlineProviderModels,
				mediaCapabilityProviders,
				mediaCapabilityProviderSource,
				messageToolCatalog,
				pluginMetadataSnapshot,
				preparedStaticProviderCatalog,
				providerStaticModels,
				preferBuiltPluginArtifacts,
				reusablePluginGeneration,
				runtimePluginRegistry
			});
			preparedGeneration = pluginGeneration;
			return {
				agentFacts,
				buildStats: {
					runtimePluginMs,
					pluginMetadataMs,
					staticProviderCatalogMs,
					ambientCredentialsMs,
					agentFactsMs,
					configuredProjectionMs
				},
				pluginGeneration
			};
		};
		try {
			const run = () => withPluginRuntimeGenerationScope({
				metadataSnapshot: pluginMetadataSnapshot,
				pluginRegistry: runtimePluginRegistry
			}, prepare);
			if (!mediaCapabilityProviderSource) return await run();
			const isSourceCurrent = capturePluginLifecycleAuthority(mediaCapabilityProviderSource.registry, void 0, { scopedRuntime: true });
			if (!isSourceCurrent?.()) throw new Error("Prepared media capability provider source is retired");
			const claim = mediaCapabilityProviderSource.resources.retain();
			let outcome;
			try {
				outcome = {
					ok: true,
					value: await run()
				};
			} catch (error) {
				outcome = {
					ok: false,
					error
				};
			}
			try {
				await claim.release();
			} catch (cleanupError) {
				outcome = {
					ok: false,
					error: outcome.ok ? cleanupError : new AggregateError([outcome.error, cleanupError], "Prepared construction and registration cleanup failed", { cause: outcome.error })
				};
			}
			if (!outcome.ok) throw outcome.error;
			if (!isSourceCurrent()) throw new Error("Prepared media capability provider source is retired");
			return outcome.value;
		} catch (error) {
			const cleanup = preparedGeneration ? [discardPreparedPluginGeneration(preparedGeneration)] : [];
			const failures = (await Promise.allSettled(cleanup)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError([error, ...failures], "Prepared plugin facts and cleanup failed", { cause: error });
			throw error;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
function captureModelsJsonContents(agentDir) {
	try {
		return fs.readFileSync(path.join(agentDir, "models.json"), "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
const fingerprintPreparedRuntimeFacts = (value) => sha256Base64Url(stableStringify(value));
/** Record discovery scope before config projection or auth-owner publication can replace it. */
function preparedModelInventoryKey(input) {
	const { models, auth, env } = input.config;
	const plugins = normalizePluginsConfig(input.config.plugins);
	for (const entry of Object.values(plugins.entries)) entry.config ??= {};
	return fingerprintPreparedRuntimeFacts({
		...input,
		config: {
			models,
			auth,
			env,
			plugins
		},
		env: input.env ?? process.env,
		runtimePluginSelections: void 0,
		order: getPreparedRuntimeAuthProfileStoreSnapshotCore(input.agentDir, input.inheritedAuthDir)?.order ?? {}
	});
}
async function prepareConfiguredRuntimeFactsBatch(params) {
	const catalogs = /* @__PURE__ */ new Map();
	let registryCount = 0;
	const staticProviderConfigs = resolvePreparedProviderStaticConfigs(params.pluginGeneration.preparedStaticProviderCatalog);
	const { pluginMetadataSnapshot } = params.pluginGeneration;
	const registries = params.registries ?? /* @__PURE__ */ new Map();
	let registriesBySource = registries.get(pluginMetadataSnapshot);
	if (!registriesBySource) {
		registriesBySource = /* @__PURE__ */ new Map();
		registries.set(pluginMetadataSnapshot, registriesBySource);
	}
	for (const facts of params.agentFacts) {
		await setImmediate();
		params.assertCurrent?.(facts.input);
		const modelsJsonContents = captureModelsJsonContents(facts.input.agentDir);
		const oauthProviders = facts.templateAuthStorage.getOAuthProviders();
		const pluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(facts.input.agentDir, facts.configuredGeneratedCatalogPluginIds);
		const key = fingerprintPreparedRuntimeFacts({
			config: hashRuntimeConfigValue(facts.input.config),
			sourceModels: projectConfigOntoRuntimeSourceSnapshot(facts.input.config).models,
			credentials: facts.credentials,
			modelsJsonContents,
			pluginCatalogs,
			staticProviderConfigs
		});
		const candidates = registriesBySource.get(key) ?? [];
		let prepared = candidates.find((candidate) => hasSameOAuthProviderGeneration(candidate.oauthProviders, oauthProviders));
		if (!prepared) {
			prepared = {
				oauthProviders,
				modelRegistry: discoverModelsFromCapturedSources(facts.templateAuthStorage, {
					config: facts.input.config,
					includePluginCatalogs: true,
					modelsJsonContents,
					pluginCatalogs,
					staticProviderConfigs,
					pluginMetadataSnapshot,
					...facts.input.workspaceDir ? { workspaceDir: facts.input.workspaceDir } : {}
				})
			};
			candidates.push(prepared);
			registriesBySource.set(key, candidates);
			registryCount += 1;
		}
		const templateModelRegistry = prepared.modelRegistry;
		const configuredRuntimeModels = completeConfiguredRuntimeModels(facts, params.pluginGeneration, templateModelRegistry);
		catalogs.set(facts.input, prepareCapturedRuntimeFacts({
			agentFacts: facts,
			workspaceFacts: params.pluginGeneration,
			templateModelRegistry,
			configuredRuntimeModels
		}));
	}
	return {
		catalogs,
		registryCount
	};
}
//#endregion
//#region src/agents/prepared-model-catalog-worker.ts
/** Runs complete model-catalog discovery outside the Gateway event loop. */
const PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS = 18e4;
const GATEWAY_CATALOG_WORKERS = 1;
const CATALOG_WORKER_HEAP_LIMIT_MB = 512;
const gatewayCatalog = resolveGlobalSingleton(Symbol.for("testclaw.gatewayModelCatalogPool"), () => ({}));
function getPreparedModelCatalogWorkerPoolSnapshot() {
	return gatewayCatalog.current?.pool.getSnapshot() ?? {
		maxWorkers: GATEWAY_CATALOG_WORKERS,
		workers: 0,
		workersCreated: 0,
		activeTasks: 0,
		pendingTasks: 0
	};
}
async function getGatewayCatalogPool(input, metadata, environmentFingerprint) {
	const cache = getPluginMetadataSnapshotCache(metadata);
	getPluginCacheRetirementSignal(cache).throwIfAborted();
	if (gatewayCatalog.rotating) {
		await gatewayCatalog.rotating;
		return getGatewayCatalogPool(input, metadata, environmentFingerprint);
	}
	if (gatewayCatalog.current?.recovery) {
		await gatewayCatalog.current.recovery;
		return getGatewayCatalogPool(input, metadata, environmentFingerprint);
	}
	if (gatewayCatalog.current?.cache === cache) {
		if (gatewayCatalog.current.envFingerprint === environmentFingerprint) return gatewayCatalog.current;
		if ([...gatewayCatalog.current.borrowers].some((borrower) => borrower.isCurrent())) throw new Error("Gateway catalog environment changed without retiring its plugin generation");
	}
	if (gatewayCatalog.current && [...gatewayCatalog.current.borrowers].some((borrower) => borrower.isCurrent())) throw new Error("Gateway catalog source generation changed before its previous owners retired");
	gatewayCatalog.rotating = (async () => {
		await gatewayCatalog.current?.close();
		const signal = getPluginCacheRetirementSignal(cache);
		signal.throwIfAborted();
		const env = input.input.env;
		const current = {
			cache,
			envFingerprint: environmentFingerprint,
			borrowers: /* @__PURE__ */ new Set(),
			recover: (error) => current.recovery ??= (async () => {
				const borrowers = [...current.borrowers];
				if (!signal.aborted) for (const borrower of borrowers) borrower.notifyRecovery(error);
				const stopping = borrowers.map((borrower) => borrower.stop(error));
				await current.close(error);
				await Promise.all(stopping);
				if (gatewayCatalog.current === current) gatewayCatalog.current = void 0;
				const { recoverPreparedModelRuntimeCatalogWorker } = await import("./prepared-model-runtime-DBXu5YaT.js");
				await recoverPreparedModelRuntimeCatalogWorker(borrowers);
			})(),
			close: async (error) => {
				signal.removeEventListener("abort", retire);
				await current.pool.close(error);
				current.validate = void 0;
				release();
			},
			validate: void 0,
			pool: new WorkerTaskPool({
				workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
				workerOptions: { resourceLimits: { maxOldGenerationSizeMb: CATALOG_WORKER_HEAP_LIMIT_MB } },
				maxWorkers: GATEWAY_CATALOG_WORKERS,
				idleTimeoutMs: 0,
				restartOnError: false,
				prepareWorker: () => {
					signal.throwIfAborted();
					const capture = createPluginSourceCaptureRoot(resolveStateDir(env), "testclaw-model-catalog-");
					return {
						releaseResources: capture.release,
						options: {
							workerData: {
								kind: "gateway",
								sourceCaptureDirectory: capture.directory,
								sourceCaptureManagedRoot: capture.managedRoot
							},
							env
						}
					};
				},
				validateResult: (result) => {
					const validate = current.validate;
					current.validate = void 0;
					validate?.(result);
				}
			})
		};
		const retire = () => {
			current.close(signal.reason).catch((error) => {
				process.emitWarning(`Gateway catalog worker failed to retire: ${String(error)}`);
			});
		};
		const release = registerPreparedModelRuntimeClose(async (error) => {
			await current.close(error);
			if (gatewayCatalog.current === current) gatewayCatalog.current = void 0;
		});
		signal.addEventListener("abort", retire, { once: true });
		gatewayCatalog.current = current;
	})();
	try {
		await gatewayCatalog.rotating;
	} finally {
		gatewayCatalog.rotating = void 0;
	}
	return getGatewayCatalogPool(input, metadata, environmentFingerprint);
}
var PreparedModelCatalogGenerationMismatchError = class extends Error {
	constructor(agentDir, generationFingerprint, reconstructedFingerprint) {
		super(`prepared model catalog worker reconstructed a different runtime generation for ${agentDir} (owner=${generationFingerprint} worker=${reconstructedFingerprint})`);
		this.agentDir = agentDir;
		this.generationFingerprint = generationFingerprint;
		this.reconstructedFingerprint = reconstructedFingerprint;
		this.name = "PreparedModelCatalogGenerationMismatchError";
	}
};
function fingerprintPreparedModelWorkerRequest(input, request) {
	return fingerprintPreparedRuntimeFacts([input.generationFingerprint, request]);
}
function fingerprintPreparedModelCatalogPlugins(snapshot) {
	return fingerprintPreparedRuntimeFacts({
		config: snapshot.configFingerprint ?? null,
		index: resolveInstalledManifestRegistryIndexFingerprint(snapshot.index),
		pluginIds: snapshot.pluginIds ?? null,
		policy: snapshot.policyHash,
		workspaceDir: snapshot.workspaceDir ?? null
	});
}
const immutableGenerationConfigFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintPreparedModelCatalogConfig(config) {
	const immutable = isDeeplyFrozenPlainData(config);
	const cached = immutable ? immutableGenerationConfigFingerprints.get(config) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = fingerprintPreparedRuntimeFacts(config);
	if (immutable) immutableGenerationConfigFingerprints.set(config, fingerprint);
	return fingerprint;
}
function fingerprintPreparedModelCatalogGeneration(params) {
	return fingerprintPreparedRuntimeFacts({
		input: {
			...params.input,
			config: fingerprintPreparedModelCatalogConfig(params.input.config)
		},
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(params.sourceConfigForSecrets),
		configResolutionFacts: params.configResolutionFacts,
		sourceConfigResolutionFacts: params.sourceConfigResolutionFacts,
		authStore: params.authStore,
		providerIds: params.providerIds,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts === true,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(params.pluginMetadataSnapshot)
	});
}
function createPreparedModelCatalogWorkerInput(params) {
	const source = params.agentFacts.input;
	const input = {
		...source.agentId ? { agentId: source.agentId } : {},
		agentDir: source.agentDir,
		...source.inheritedAuthDir ? { inheritedAuthDir: source.inheritedAuthDir } : {},
		...source.workspaceDir ? { workspaceDir: source.workspaceDir } : {},
		...source.readOnly ? { readOnly: true } : {},
		skipCredentials: true,
		env: { ...params.agentFacts.env },
		...source.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		...source.runtimePluginSelections ? { runtimePluginSelections: source.runtimePluginSelections } : {},
		config: source.config
	};
	const sourceConfigForSecrets = projectConfigOntoRuntimeSourceSnapshot(source.config);
	const configResolutionFacts = serializeConfigResolutionFacts(source.config);
	const sourceConfigResolutionFacts = getConfigResolutionFacts(source.config) === getConfigResolutionFacts(sourceConfigForSecrets) ? configResolutionFacts : serializeConfigResolutionFacts(sourceConfigForSecrets);
	const authStore = cloneAuthProfileStore(params.agentFacts.authStore);
	const providerIds = [...params.agentFacts.providerIds];
	const { normalizePluginId: _normalizePluginId, ...pluginMetadataSnapshot } = params.pluginMetadataSnapshot;
	return {
		kind: "catalog",
		generationFingerprint: fingerprintPreparedModelCatalogGeneration({
			input,
			sourceConfigForSecrets,
			configResolutionFacts,
			sourceConfigResolutionFacts,
			authStore,
			providerIds,
			preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		}),
		input,
		sourceConfigForSecrets,
		configResolutionFacts,
		sourceConfigResolutionFacts,
		authStore,
		providerIds,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts === true,
		pluginMetadataSnapshot
	};
}
function createPreparedModelCatalogWorker(params) {
	const workerInput = createPreparedModelCatalogWorkerInput(params);
	const metadataSnapshot = params.pluginMetadataSnapshot;
	const superseded = () => new PreparedModelRuntimePublicationSupersededError(`prepared model runtime catalog generation was superseded for ${workerInput.input.agentDir}`);
	let observingRetirement = false;
	let stoppedError;
	let releaseProcessLifetime;
	let expectedFingerprint;
	const captures = /* @__PURE__ */ new Map();
	const tasks = /* @__PURE__ */ new Map();
	const assertCurrent = () => {
		if (stoppedError) throw stoppedError;
		if (!params.isCurrent()) throw superseded();
	};
	const gatewayOwned = params.agentFacts.input.allowGatewaySubagentBinding === true && params.agentFacts.input.env === void 0;
	const environmentFingerprint = fingerprintPreparedRuntimeFacts(workerInput.input.env);
	let pool;
	let sharedOwner;
	const mismatch = (message) => new PreparedModelCatalogGenerationMismatchError(workerInput.input.agentDir, message.generationFingerprint, message.reconstructedFingerprint);
	const validate = (message) => {
		if (!gatewayOwned) assertCurrent();
		if (message.status === "generation-mismatch") throw mismatch(message);
		if (message.status === "ok" && message.generationFingerprint !== expectedFingerprint) throw new Error("prepared model catalog worker returned a stale generation");
	};
	const createPool = () => new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: CATALOG_WORKER_HEAP_LIMIT_MB } },
		maxWorkers: 1,
		idleTimeoutMs: 0,
		restartOnError: false,
		prepareWorker: () => {
			const capture = createPluginSourceCaptureRoot(resolveStateDir(workerInput.input.env), "testclaw-model-catalog-");
			return {
				releaseResources: capture.release,
				options: {
					workerData: {
						...workerInput,
						sourceCaptureDirectory: capture.directory,
						sourceCaptureManagedRoot: capture.managedRoot
					},
					env: workerInput.input.env
				}
			};
		},
		validateResult: validate
	});
	const stop = async (error) => {
		stoppedError ??= error;
		params.retirementSignal.removeEventListener("abort", retire);
		for (const controller of captures.keys()) controller.abort(stoppedError);
		await Promise.allSettled(captures.values());
		if (gatewayOwned) await Promise.allSettled(tasks.keys());
		else await pool?.close(stoppedError);
		sharedOwner?.borrowers.delete(borrower);
		releaseProcessLifetime?.();
		releaseProcessLifetime = void 0;
	};
	const retire = () => {
		queueMicrotask(() => {
			stop(superseded()).catch((error) => {
				process.emitWarning(`Prepared model catalog worker failed to retire: ${String(error)}`);
			});
		});
	};
	const borrower = {
		agentDir: workerInput.input.agentDir,
		isCurrent: params.isCurrent,
		notifyRecovery: (error) => {
			if (stoppedError || !params.isCurrent()) return;
			for (const task of tasks.values()) task.onRecovery?.(error);
		},
		stop
	};
	const request = async (command, onRecovery) => {
		let message;
		let requestPool;
		let pending;
		const task = {};
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(new WorkerTaskError("worker task timed out", "timeout")), PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
		try {
			assertCurrent();
			releaseProcessLifetime ??= registerPreparedModelRuntimeClose(stop);
			if (!observingRetirement) {
				observingRetirement = true;
				params.retirementSignal.addEventListener("abort", retire, { once: true });
				if (params.retirementSignal.aborted) retire();
			}
			const { input } = workerInput;
			const providerScope = [...workerInput.providerIds, ...command.providerIds ?? []];
			const capture = withPluginRuntimeGenerationScope({
				metadataSnapshot,
				pluginRegistry: params.pluginRegistry
			}, () => captureProviderSyntheticAuthFacts({
				config: input.config,
				env: input.env,
				workspaceDir: input.workspaceDir,
				providerRefs: command.kind === "catalog" && !command.providerIds ? [...listManifestSyntheticAuthProviderRefs(metadataSnapshot.index), ...workerInput.providerIds] : [...providerScope, ...scopeSyntheticAuthProviderRefs(listManifestSyntheticAuthProviderRefs(metadataSnapshot.index), providerScope)],
				signal: controller.signal
			}));
			captures.set(controller, capture);
			let syntheticAuth;
			try {
				syntheticAuth = await capture;
			} finally {
				captures.delete(controller);
			}
			controller.signal.throwIfAborted();
			const value = {
				...command,
				syntheticAuth
			};
			const shared = gatewayOwned ? await getGatewayCatalogPool(workerInput, metadataSnapshot, environmentFingerprint) : void 0;
			if (shared) {
				sharedOwner = shared;
				shared.borrowers.add(borrower);
			}
			requestPool = pool = shared?.pool ?? pool ?? createPool();
			pending = requestPool.run(() => {
				assertCurrent();
				task.onRecovery = onRecovery;
				const workerRequest = {
					...value,
					clawInstallSchemaVersions: captureClawInstallSchemaVersionFacts({ env: input.env })
				};
				expectedFingerprint = fingerprintPreparedModelWorkerRequest(workerInput, workerRequest);
				if (shared) shared.validate = validate;
				return shared ? {
					value: workerInput,
					request: workerRequest
				} : workerRequest;
			}, {
				timeoutMs: PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS,
				signal: controller.signal
			});
			tasks.set(pending, task);
			message = await pending;
			assertCurrent();
		} catch (error) {
			const failure = error instanceof Error ? error : new Error(String(error));
			if (failure instanceof WorkerTaskError && failure.code === "overloaded") throw failure;
			if (gatewayOwned && requestPool && !requestPool.isClosed && params.isCurrent()) {
				controller.abort(error);
				throw error;
			}
			if (gatewayOwned && sharedOwner && requestPool?.isClosed && !(failure instanceof PreparedModelRuntimePublicationSupersededError)) await sharedOwner.recover(failure).catch((recoveryError) => {
				process.emitWarning(`Gateway catalog recovery failed: ${String(recoveryError)}`);
			});
			if (!gatewayOwned && failure instanceof PreparedModelCatalogGenerationMismatchError) {
				if (pool === requestPool) pool = void 0;
				await requestPool?.close(failure);
				throw failure;
			}
			controller.abort(error);
			await stop(failure);
			throw error;
		} finally {
			task.onRecovery = void 0;
			if (pending) tasks.delete(pending);
			clearTimeout(timeout);
		}
		if (message.status === "failed") throw new Error(message.error);
		if (message.status === "generation-mismatch") throw mismatch(message);
		return message;
	};
	return {
		loadCatalog: async (providerIds, onRecovery) => {
			const message = await request({
				kind: "catalog",
				...providerIds ? { providerIds } : {}
			}, onRecovery);
			if (message.kind !== "catalog") throw new Error("prepared model catalog worker returned an auth refresh result");
			const modelCatalog = markPreparedModelCatalogFull(message.snapshot);
			setPreparedModelFullCatalogAuth(modelCatalog, {
				authStore: message.authStore,
				authModes: message.authModes,
				credentials: message.credentials,
				providerAuthLabels: message.providerAuthLabels
			});
			return {
				modelCatalog,
				configuredRuntimeModels: message.configuredRuntimeModels,
				runtimeModels: message.runtimeModels,
				providerExpiries: message.providerExpiries
			};
		},
		loadAuth: async ({ providerIds, profileIds }) => {
			const normalizedProviderIds = [...new Set(providerIds)].toSorted((left, right) => left.localeCompare(right));
			const normalizedProfileIds = profileIds ? [...new Set(profileIds)].toSorted((left, right) => left.localeCompare(right)) : void 0;
			const message = await request({
				kind: "auth-refresh",
				providerIds: normalizedProviderIds,
				...normalizedProfileIds ? { profileIds: normalizedProfileIds } : {}
			});
			if (message.kind !== "auth-refresh") throw new Error("prepared model auth refresh worker returned a catalog result");
			return {
				authStore: message.authStore,
				authModes: message.authModes,
				credentials: message.credentials
			};
		}
	};
}
//#endregion
export { prepareConfiguredRuntimeFacts as _, fingerprintPreparedModelWorkerRequest as a, fingerprintPreparedRuntimeFacts as c, prepareWorkspaceBuildGroup as d, preparedModelInventoryKey as f, preparedModelRuntimeWorkspaceFactsKey as g, loadPreparedInboundPluginRegistry as h, fingerprintPreparedModelCatalogGeneration as i, prepareConfiguredModelFacts as l, createPreparedInboundRegistryLoader as m, createPreparedModelCatalogWorker as n, getPreparedModelCatalogWorkerPoolSnapshot as o, scopeSyntheticAuthProviderRefs as p, createPreparedModelCatalogWorkerInput as r, captureModelsJsonContents as s, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS as t, prepareConfiguredRuntimeFactsBatch as u };
