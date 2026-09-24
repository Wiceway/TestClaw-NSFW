import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-DsCfAx8q.js";
import { r as getPackageManifestMetadata, s as pluginCacheExistsSync } from "./package-manifest-DmftnIsu.js";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-DoyVf_gu.js";
import { C as record, M as toJSONSchema, O as union, T as string, b as object, d as array, f as boolean, y as number } from "./schemas-D6YHSiZI.js";
import "./zod-schema.core-D3dVE7Km.js";
import { n as discoverAssistantPlugins } from "./discovery-2wVyQ2Ni.js";
import { r as loadPluginManifest } from "./manifest-DQTAOZoC.js";
import { u as tryReadJsonSync } from "./json-files-DAp75qfY.js";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-ChktiWq4.js";
import { f as resolveLoaderPackageRoot, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-DFZdUh0W.js";
import { t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./public-surface-runtime-C9tVCEsU.js";
import { i as normalizeBundledPluginStringList, n as collectBundledPluginRuntimeSidecarArtifacts, o as resolveBundledPluginScanDir, r as deriveBundledPluginIdHint, s as rewriteBundledPluginEntryToBuiltPath, t as collectBundledPluginPublicSurfaceArtifacts } from "./bundled-plugin-scan-DG08KzhJ.js";
import "./config-contract-matches-Cs06CSj_.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-By7XcmN-.js";
import "./plugin-registry-CgG2kJWa.js";
import { n as validateJsonSchemaValue, t as parseJsonSchemaIssuePath } from "./schema-validator-INI7m4wW.js";
import { o as ToolPolicySchema } from "./zod-schema.agent-runtime-7cR8p80k.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/channels/plugins/config-schema.ts
/**
* Channel config schema helpers.
*
* Builds common zod/JSON schema shapes and parses runtime config issues for channel plugins.
*/
/** Shared allowlist entry shape for channel sender/user ids. */
const AllowFromEntrySchema = union([string(), number()]);
/** Optional allowlist array used by channel config schema builders. */
const AllowFromListSchema = array(AllowFromEntrySchema).optional();
object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: record(string(), ToolPolicySchema).optional(),
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: AllowFromListSchema,
	systemPrompt: string().optional()
}).strict();
function cloneRuntimeIssue(issue) {
	const record = issue && typeof issue === "object" ? issue : {};
	const path = Array.isArray(record.path) ? record.path.filter((segment) => {
		const kind = typeof segment;
		return kind === "string" || kind === "number";
	}) : void 0;
	return {
		...record,
		...path ? { path } : {}
	};
}
function safeParseRuntimeSchema(schema, value) {
	const result = schema.safeParse(value);
	if (result.success) return {
		success: true,
		data: result.data
	};
	return {
		success: false,
		issues: result.error.issues.map((issue) => cloneRuntimeIssue(issue))
	};
}
function safeParseJsonSchema(schema, cacheKey, value) {
	const result = validateJsonSchemaValue({
		schema,
		cacheKey,
		value,
		applyDefaults: true
	});
	if (result.ok) return {
		success: true,
		data: result.value
	};
	return {
		success: false,
		issues: result.errors.map((issue) => ({
			path: parseJsonSchemaIssuePath(issue.path),
			message: issue.message
		}))
	};
}
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
function buildJsonChannelConfigSchema(schema, options) {
	return {
		schema,
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: options?.runtime ?? { safeParse: (value) => safeParseJsonSchema(schema, options?.cacheKey ?? "channel-config-schema:json", value) }
	};
}
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
function buildChannelConfigSchema(schema, options) {
	if ("_zod" in schema) return {
		schema: toJSONSchema(schema, {
			target: "draft-07",
			...options?.jsonSchemaMode ? { io: options.jsonSchemaMode } : {},
			unrepresentable: "any"
		}),
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
	return {
		schema: {
			type: "object",
			additionalProperties: true
		},
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
}
//#endregion
//#region src/plugins/bundled-channel-config-metadata.ts
/** Loads bundled channel config schema metadata from source or public surface modules. */
const SOURCE_CONFIG_SCHEMA_CANDIDATES = [
	path.join("src", "config-schema.ts"),
	path.join("src", "config-schema.js"),
	path.join("src", "config-schema.mts"),
	path.join("src", "config-schema.mjs"),
	path.join("src", "config-schema.cts"),
	path.join("src", "config-schema.cjs")
];
const PUBLIC_CONFIG_SURFACE_BASENAMES = ["channel-config-api"];
function isBuiltChannelConfigSchema(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return Boolean(candidate.schema && typeof candidate.schema === "object");
}
function isJsonSchemaConfigSurface(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	if (typeof candidate.safeParse === "function" || typeof candidate.toJSONSchema === "function") return false;
	return typeof candidate.type === "string" || Array.isArray(candidate.anyOf) || Array.isArray(candidate.oneOf) || Array.isArray(candidate.allOf) || Array.isArray(candidate.enum) || Object.hasOwn(candidate, "const");
}
function resolveConfigSchemaExport(imported) {
	for (const [name, value] of Object.entries(imported)) if (name.endsWith("ChannelConfigSchema") && isBuiltChannelConfigSchema(value)) return value;
	for (const [name, value] of Object.entries(imported)) {
		if (!name.endsWith("ConfigSchema") || name.endsWith("AccountConfigSchema")) continue;
		if (isBuiltChannelConfigSchema(value)) return value;
		if (isJsonSchemaConfigSurface(value)) return buildJsonChannelConfigSchema(value);
		if (value && typeof value === "object") return buildChannelConfigSchema(value);
	}
	for (const value of Object.values(imported)) if (isBuiltChannelConfigSchema(value)) return value;
	return null;
}
function getModuleLoader(modulePath) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		preferBuiltDist: true,
		loaderFilename: import.meta.url
	});
}
function resolveChannelConfigSchemaModulePath(pluginDir) {
	for (const relativePath of SOURCE_CONFIG_SCHEMA_CANDIDATES) {
		const candidate = path.join(pluginDir, relativePath);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
	for (const basename of PUBLIC_CONFIG_SURFACE_BASENAMES) for (const extension of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
		const candidate = path.join(pluginDir, `${basename}${extension}`);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
}
function loadChannelConfigSurfaceModuleSync(modulePath) {
	try {
		return resolveConfigSchemaExport(getModuleLoader(modulePath)(modulePath));
	} catch {
		return null;
	}
}
function resolvePackageChannelMeta(packageManifest, channelId) {
	const channelMeta = packageManifest?.channel;
	return channelMeta?.id?.trim() === channelId ? channelMeta : void 0;
}
function collectBundledChannelConfigsCore(params) {
	const channelIds = normalizeBundledPluginStringList(params.manifest.channels);
	const existingChannelConfigs = params.manifest.channelConfigs && Object.keys(params.manifest.channelConfigs).length > 0 ? { ...params.manifest.channelConfigs } : {};
	if (channelIds.length === 0) return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : void 0;
	const surfaceModulePath = resolveChannelConfigSchemaModulePath(params.pluginDir);
	const surface = surfaceModulePath ? loadChannelConfigSurfaceModuleSync(surfaceModulePath) : null;
	for (const channelId of channelIds) {
		const existing = existingChannelConfigs[channelId];
		const channelMeta = resolvePackageChannelMeta(params.packageManifest, channelId);
		const preferOver = normalizeBundledPluginStringList(channelMeta?.preferOver);
		const uiHints = surface?.uiHints || existing?.uiHints ? {
			...surface?.uiHints && Object.keys(surface.uiHints).length > 0 ? surface.uiHints : {},
			...existing?.uiHints && Object.keys(existing.uiHints).length > 0 ? existing.uiHints : {}
		} : void 0;
		if (!surface?.schema && !existing?.schema) continue;
		existingChannelConfigs[channelId] = {
			schema: surface?.schema ?? existing?.schema ?? {},
			...uiHints && Object.keys(uiHints).length > 0 ? { uiHints } : {},
			...surface?.runtime ?? existing?.runtime ? { runtime: surface?.runtime ?? existing?.runtime } : {},
			...normalizeOptionalString(existing?.label) ?? normalizeOptionalString(channelMeta?.label) ? { label: normalizeOptionalString(existing?.label) ?? normalizeOptionalString(channelMeta?.label) } : {},
			...normalizeOptionalString(existing?.description) ?? normalizeOptionalString(channelMeta?.blurb) ? { description: normalizeOptionalString(existing?.description) ?? normalizeOptionalString(channelMeta?.blurb) } : {},
			...existing?.preferOver?.length ? { preferOver: existing.preferOver } : preferOver.length > 0 ? { preferOver } : {},
			...existing?.commands ?? channelMeta?.commands ? { commands: existing?.commands ?? channelMeta?.commands } : {}
		};
	}
	return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : void 0;
}
//#endregion
//#region src/plugins/bundled-plugin-metadata.ts
const TESTCLAW_PACKAGE_ROOT = resolveLoaderPackageRoot({
	modulePath: fileURLToPath(import.meta.url),
	moduleUrl: import.meta.url
}) ?? fileURLToPath(new URL("../..", import.meta.url));
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
function readPackageManifest(pluginDir) {
	const packagePath = path.join(pluginDir, "package.json");
	return tryReadJsonSync(packagePath) ?? void 0;
}
function resolveBundledPluginMetadataScanDir(packageRoot, scanDir) {
	if (scanDir) return path.resolve(scanDir);
	return resolveBundledPluginScanDir({
		packageRoot,
		runningFromBuiltArtifact: RUNNING_FROM_BUILT_ARTIFACT
	});
}
function collectBundledPluginMetadata(resolvedScanDir, includeChannelConfigs, includeSyntheticChannelConfigs) {
	if (!resolvedScanDir || !fs.existsSync(resolvedScanDir)) return [];
	const entries = [];
	for (const dirName of fs.readdirSync(resolvedScanDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted((left, right) => left.localeCompare(right))) {
		const pluginDir = path.join(resolvedScanDir, dirName);
		const manifestResult = loadPluginManifest(pluginDir, false);
		if (!manifestResult.ok) continue;
		const packageJson = readPackageManifest(pluginDir);
		const packageManifest = getPackageManifestMetadata(packageJson);
		const extensions = normalizeBundledPluginStringList(packageManifest?.extensions);
		if (extensions.length === 0) continue;
		const sourceEntry = normalizeOptionalString(extensions[0]);
		const builtEntry = rewriteBundledPluginEntryToBuiltPath(sourceEntry);
		if (!sourceEntry || !builtEntry) continue;
		const setupSourcePath = normalizeOptionalString(packageManifest?.setupEntry);
		const setupSource = setupSourcePath && rewriteBundledPluginEntryToBuiltPath(setupSourcePath) ? {
			source: setupSourcePath,
			built: rewriteBundledPluginEntryToBuiltPath(setupSourcePath)
		} : void 0;
		const publicSurfaceArtifacts = collectBundledPluginPublicSurfaceArtifacts({
			pluginDir,
			sourceEntry,
			...setupSourcePath ? { setupEntry: setupSourcePath } : {}
		});
		const runtimeSidecarArtifacts = collectBundledPluginRuntimeSidecarArtifacts(publicSurfaceArtifacts);
		const channelConfigs = includeChannelConfigs && includeSyntheticChannelConfigs ? collectBundledChannelConfigsCore({
			pluginDir,
			manifest: manifestResult.manifest,
			packageManifest
		}) : manifestResult.manifest.channelConfigs;
		entries.push({
			dirName,
			idHint: deriveBundledPluginIdHint({
				entryPath: sourceEntry,
				manifestId: manifestResult.manifest.id,
				packageName: normalizeOptionalString(packageJson?.name),
				hasMultipleExtensions: extensions.length > 1
			}),
			source: {
				source: sourceEntry,
				built: builtEntry
			},
			...setupSource ? { setupSource } : {},
			...publicSurfaceArtifacts ? { publicSurfaceArtifacts } : {},
			...runtimeSidecarArtifacts ? { runtimeSidecarArtifacts } : {},
			...normalizeOptionalString(packageJson?.name) ? { packageName: normalizeOptionalString(packageJson?.name) } : {},
			...normalizeOptionalString(packageJson?.version) ? { packageVersion: normalizeOptionalString(packageJson?.version) } : {},
			...normalizeOptionalString(packageJson?.description) ? { packageDescription: normalizeOptionalString(packageJson?.description) } : {},
			...packageManifest ? { packageManifest } : {},
			manifest: {
				...manifestResult.manifest,
				...channelConfigs ? { channelConfigs } : {}
			}
		});
	}
	return entries;
}
/** Lists bundled plugin metadata from source or built package layouts. */
function listBundledPluginMetadata(params) {
	const resolvedScanDir = resolveBundledPluginMetadataScanDir(path.resolve(params?.rootDir ?? TESTCLAW_PACKAGE_ROOT), params?.scanDir ? path.resolve(params.scanDir) : void 0);
	const includeChannelConfigs = params?.includeChannelConfigs ?? !RUNNING_FROM_BUILT_ARTIFACT;
	const includeSyntheticChannelConfigs = params?.includeSyntheticChannelConfigs ?? includeChannelConfigs;
	return Object.freeze(collectBundledPluginMetadata(resolvedScanDir, includeChannelConfigs, includeSyntheticChannelConfigs));
}
/** Finds bundled plugin metadata by manifest id. */
function findBundledPluginMetadataById(pluginId, params) {
	return listBundledPluginMetadata(params).find((entry) => entry.manifest.id === pluginId);
}
//#endregion
//#region src/plugins/config-contracts.ts
/** Resolves plugin config contract metadata for scanners and secret/config policy checks. */
/** Resolve config contract metadata for plugin ids through the runtime registry and bundled fallback. */
function resolvePluginConfigContractsById(params) {
	const matches = /* @__PURE__ */ new Map();
	const pluginIds = normalizeSortedUniqueStringEntries(params.pluginIds);
	if (pluginIds.length === 0) return matches;
	const fallbackBundledPluginIds = new Set(normalizeSortedUniqueStringEntries(params.fallbackBundledPluginIds));
	const bundledContractFallbacks = /* @__PURE__ */ new Map();
	const snapshot = params.discovery ? void 0 : getGatewayPluginMetadataSnapshot();
	const findBundledConfigContracts = (pluginId) => {
		if (snapshot) return snapshot.bundledManifestRegistry?.plugins.find((plugin) => plugin.id === pluginId)?.configContracts;
		if (bundledContractFallbacks.has(pluginId)) return bundledContractFallbacks.get(pluginId);
		const discovery = params.discovery ?? discoverAssistantPlugins({
			workspaceDir: params.workspaceDir,
			env: params.env
		});
		const registry = loadPluginManifestRegistryCore({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			candidates: discovery.candidates.filter((candidate) => candidate.origin === "bundled"),
			diagnostics: discovery.diagnostics
		});
		for (const plugin of registry.plugins) bundledContractFallbacks.set(plugin.id, plugin.configContracts);
		if (bundledContractFallbacks.get(pluginId) === void 0) {
			const bundledMetadata = findBundledPluginMetadataById(pluginId, {
				includeChannelConfigs: false,
				includeSyntheticChannelConfigs: false
			});
			if (bundledMetadata?.manifest.configContracts) bundledContractFallbacks.set(pluginId, bundledMetadata.manifest.configContracts);
		}
		if (!bundledContractFallbacks.has(pluginId)) bundledContractFallbacks.set(pluginId, void 0);
		return bundledContractFallbacks.get(pluginId);
	};
	const resolvedPluginOrigins = /* @__PURE__ */ new Map();
	const registry = params.manifestRegistry ?? snapshot?.manifestRegistry ?? loadPluginManifestRegistryForPluginRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: true
	});
	for (const plugin of registry.plugins) {
		if (!pluginIds.includes(plugin.id)) continue;
		resolvedPluginOrigins.set(plugin.id, plugin.origin);
		if (!plugin.configContracts) continue;
		matches.set(plugin.id, {
			origin: plugin.origin,
			configContracts: plugin.configContracts
		});
	}
	if (params.fallbackToBundledMetadata ?? true) for (const pluginId of pluginIds) {
		const existing = matches.get(pluginId);
		if (existing && (params.fallbackToBundledMetadataForResolvedBundled && existing.origin === "bundled" || !params.manifestRegistry && fallbackBundledPluginIds.has(pluginId))) {
			const bundledConfigContracts = findBundledConfigContracts(pluginId);
			if (bundledConfigContracts) matches.set(pluginId, {
				origin: fallbackBundledPluginIds.has(pluginId) ? "bundled" : existing.origin,
				configContracts: {
					...bundledConfigContracts,
					...existing.configContracts,
					...bundledConfigContracts.secretInputs ? { secretInputs: bundledConfigContracts.secretInputs } : {}
				}
			});
			continue;
		}
		if (matches.has(pluginId)) continue;
		const resolvedOrigin = resolvedPluginOrigins.get(pluginId);
		if (resolvedOrigin && !(params.fallbackToBundledMetadataForResolvedBundled && resolvedOrigin === "bundled") && !fallbackBundledPluginIds.has(pluginId)) continue;
		if (params.manifestRegistry && resolvedOrigin && resolvedOrigin !== "bundled") continue;
		if (params.manifestRegistry && !fallbackBundledPluginIds.has(pluginId)) continue;
		const bundledConfigContracts = findBundledConfigContracts(pluginId);
		if (!bundledConfigContracts) continue;
		matches.set(pluginId, {
			origin: "bundled",
			configContracts: bundledConfigContracts
		});
	}
	return matches;
}
//#endregion
export { listBundledPluginMetadata as n, resolvePluginConfigContractsById as t };
