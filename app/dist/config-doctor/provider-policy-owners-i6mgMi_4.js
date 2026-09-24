import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { d as getPluginMetadataSnapshotCache, i as bindPluginMetadataSnapshotCache } from "./plugin-cache-CsUjLuei.js";
import { r as snapshotReaderSlot } from "./plugin-metadata-snapshot-readers-C5VWpIii.js";
import { createRequire } from "node:module";
//#region src/plugins/plugin-metadata-snapshot.runtime.ts
/**
* Lazy bridge for plugin metadata snapshot reads. The snapshot modules pull
* the control-plane context (installed-plugin index/kysely), which light
* shared modules and doctor closures must not cold-load at import time.
*
* The snapshot module registers its reader here at eval time, so any process
* that published or scoped a snapshot serves reads through the registered
* instance. The require fallback only covers cold processes that never loaded
* the metadata system (built code loads .js; source/jiti paths resolve .ts).
*/
const require = createRequire(import.meta.url);
function createModuleLoader(candidates) {
	let loaded;
	let attempted = false;
	return () => {
		if (loaded) return loaded;
		if (attempted) return null;
		attempted = true;
		for (const candidate of candidates) try {
			loaded = require(candidate);
			return loaded;
		} catch {}
		return null;
	};
}
const loadCurrentSnapshotModule = createModuleLoader(["./current-plugin-metadata-snapshot.js", "./current-plugin-metadata-snapshot.ts"]);
const loadSnapshotLoaderModule = createModuleLoader(["./plugin-metadata-snapshot.js", "./plugin-metadata-snapshot.ts"]);
/** Reads the current plugin metadata snapshot, loading the snapshot graph lazily. */
function getCurrentPluginMetadataSnapshotRuntime(params) {
	return (snapshotReaderSlot.getCurrentPluginMetadataSnapshot ?? loadCurrentSnapshotModule()?.getCurrentPluginMetadataSnapshot)?.(params) ?? void 0;
}
/** Publishes through the loaded lifecycle owner without waking a cold metadata system. */
function adoptCurrentPluginMetadataSnapshotIfAbsentRuntime(snapshot, options) {
	snapshotReaderSlot.adoptCurrentPluginMetadataSnapshotIfAbsent?.(snapshot, options);
}
/**
* Resolves a plugin metadata snapshot, or undefined when the metadata system
* is unavailable (cold test workers without a CJS TS hook); callers treat that
* as "no manifest policies exist".
*/
function resolvePluginMetadataSnapshotRuntime(params) {
	return (snapshotReaderSlot.resolvePluginMetadataSnapshot ?? loadSnapshotLoaderModule()?.resolvePluginMetadataSnapshot)?.(params);
}
//#endregion
//#region src/plugins/provider-policy-owners.ts
function pluginDeclaresProviderPolicyRef(plugin, normalizedProviderId) {
	if (!normalizedProviderId) return false;
	for (const provider of plugin.providers) if (normalizeProviderId(provider) === normalizedProviderId) return true;
	for (const provider of plugin.cliBackends) if (normalizeProviderId(provider) === normalizedProviderId) return true;
	if (plugin.contracts?.embeddingProviders) {
		for (const provider of plugin.contracts.embeddingProviders) if (normalizeProviderId(provider) === normalizedProviderId) return true;
	}
	return false;
}
function pluginOwnsProviderPolicyRef(plugin, normalizedProviderId) {
	if (pluginDeclaresProviderPolicyRef(plugin, normalizedProviderId)) return true;
	const aliases = plugin.providerAuthAliases;
	if (!aliases) return false;
	for (const rawAlias in aliases) {
		if (!Object.hasOwn(aliases, rawAlias)) continue;
		const rawTarget = aliases[rawAlias];
		if (typeof rawTarget === "string" && normalizeProviderId(rawAlias) === normalizedProviderId && pluginDeclaresProviderPolicyRef(plugin, normalizeProviderId(rawTarget))) return true;
	}
	return false;
}
function buildProviderPolicyOwnerIndex(registry) {
	const index = {
		bundled: /* @__PURE__ */ new Map(),
		trusted: /* @__PURE__ */ new Map()
	};
	for (const plugin of registry.plugins.toSorted((left, right) => left.id.localeCompare(right.id))) {
		if (plugin.origin !== "bundled" && plugin.trustedOfficialInstall !== true) continue;
		const refs = new Set([
			...plugin.providers,
			...plugin.cliBackends,
			...plugin.contracts?.embeddingProviders ?? [],
			...Object.keys(plugin.providerAuthAliases ?? {})
		].map(normalizeProviderId));
		for (const ref of refs) {
			if (!pluginOwnsProviderPolicyRef(plugin, ref)) continue;
			if (plugin.origin === "bundled" && !index.bundled.has(ref)) index.bundled.set(ref, plugin);
			if (plugin.trustedOfficialInstall === true) {
				const owners = index.trusted.get(ref) ?? [];
				owners.push(plugin);
				index.trusted.set(ref, owners);
			}
		}
	}
	return index;
}
/** Only snapshot finalization registers immutable registries with their owning generation. */
function registerProviderPolicyOwnerIndexes(snapshot, cache) {
	const indexes = cache.metadata.providerPolicyOwners;
	for (const registry of [snapshot, snapshot.manifestRegistry]) if (!indexes.has(registry)) {
		const shared = registry.plugins === snapshot.plugins ? indexes.get(snapshot) : void 0;
		indexes.set(registry, shared ?? buildProviderPolicyOwnerIndex(registry));
		bindPluginMetadataSnapshotCache(registry, cache);
	}
}
function resolveBundledProviderPolicyOwner(normalizedProviderId, registry) {
	const index = getPluginMetadataSnapshotCache(registry).metadata.providerPolicyOwners.get(registry);
	if (index) return index.bundled.get(normalizedProviderId) ?? null;
	let owner = null;
	for (const plugin of registry.plugins) {
		if (plugin.origin !== "bundled" || owner && owner.id.localeCompare(plugin.id) <= 0) continue;
		if (pluginOwnsProviderPolicyRef(plugin, normalizedProviderId)) owner = plugin;
	}
	return owner;
}
/** Lists trusted installed plugins that own a provider policy reference. */
function listTrustedExternalProviderPolicyOwners(providerId, registry) {
	const normalizedProviderId = normalizeProviderId(providerId);
	const index = getPluginMetadataSnapshotCache(registry).metadata.providerPolicyOwners.get(registry);
	if (index) return [...index.trusted.get(normalizedProviderId) ?? []];
	return registry.plugins.filter((plugin) => plugin.trustedOfficialInstall === true && pluginOwnsProviderPolicyRef(plugin, normalizedProviderId)).toSorted((left, right) => left.id.localeCompare(right.id));
}
/** Lists policy owners available from bundled code or trusted installed plugins. */
function listProviderPolicyOwners(providerId, registry) {
	const bundled = resolveBundledProviderPolicyOwner(normalizeProviderId(providerId), registry);
	const installed = listTrustedExternalProviderPolicyOwners(providerId, registry);
	return [.../* @__PURE__ */ new Set([...bundled ? [bundled] : [], ...installed])];
}
//#endregion
export { adoptCurrentPluginMetadataSnapshotIfAbsentRuntime as a, resolveBundledProviderPolicyOwner as i, listTrustedExternalProviderPolicyOwners as n, getCurrentPluginMetadataSnapshotRuntime as o, registerProviderPolicyOwnerIndexes as r, resolvePluginMetadataSnapshotRuntime as s, listProviderPolicyOwners as t };
