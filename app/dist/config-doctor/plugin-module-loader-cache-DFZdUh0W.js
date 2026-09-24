import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as isPathStrictlyInside, r as isPathInside } from "./path-guards-D465IUx2.js";
import { D as withPluginCache, O as getPluginSdkAliasFacts, k as getPluginSdkHostFacts, l as getPluginCacheRoot, o as getPluginCache, r as bindPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-CsUjLuei.js";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-QV2nsx8w.js";
import { i as resolveRequiredHomeDir } from "./home-dir-DjuHbd5R.js";
import { d as sameFileIdentity } from "./fs-safe-advanced-CBSOsiER.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { n as openPluginRootFileSync, t as isPathInside$1 } from "./path-safety-xYU8Js1N.js";
import { d as readPluginCacheDirectory, f as readPluginCacheFile, l as pluginCacheRealpathSync, o as parsePluginCacheJson, s as pluginCacheExistsSync, u as pluginCacheStatSync } from "./package-manifest-DmftnIsu.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { i as resolveAssistantDevSourceRoot } from "./dev-source-root--sPueI65.js";
import { c as supportsNativeModuleAliasHooks, i as isPluginSourceModulePath, l as tryNativeRequireJavaScriptModule, n as clearPluginModuleRequireCache, o as resolvePluginLoaderTryNative, t as PLUGIN_SOURCE_MODULE_EXTENSIONS, u as tryNativeRequireModule } from "./native-module-require-CyWupBwM.js";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.js";
import { t as getPluginInstance } from "./plugin-instance-scope-B1RUw70q.js";
import { r as getPluginRegistryState } from "./runtime-state-BotH0dTM.js";
import { i as getPluginRuntimeGatewayRequestScope, n as getPluginRegistryForContext } from "./gateway-request-scope-B7K42D1p.js";
import Module from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import os from "node:os";
import path from "node:path";
//#region src/shared/import-specifier.ts
/**
* On Windows, Node's ESM loader requires absolute paths to be expressed as
* file:// URLs. Raw drive-letter paths like C:\... are parsed as URL schemes.
*/
function toSafeImportPath(specifier) {
	if (process.platform !== "win32") return specifier;
	if (specifier.startsWith("file://")) return specifier;
	if (path.win32.isAbsolute(specifier)) return pathToFileURL(specifier, { windows: true }).href;
	return specifier;
}
//#endregion
//#region src/plugins/sdk-alias-normalization.ts
const JITI_NORMALIZED_ALIAS_SYMBOL = Symbol.for("pathe:normalizedAlias");
const JITI_ALIAS_ROOT_SENTINELS = /* @__PURE__ */ new Set([
	"/",
	"\\",
	void 0
]);
const JITI_CONCRETE_ALIAS_TARGET_PATTERN = /^(?:[A-Za-z]:[/\\]|[/\\])/;
function hasJitiNormalizedAliasMarker(aliasMap) {
	return Boolean(Reflect.get(aliasMap, JITI_NORMALIZED_ALIAS_SYMBOL));
}
function createJitiAliasContentCacheKey(aliasMap) {
	return Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}\0${value}`).join("\0");
}
function isConcreteJitiAliasTarget(target) {
	return typeof target === "string" && JITI_CONCRETE_ALIAS_TARGET_PATTERN.test(target);
}
function resolveJitiAliasTarget(aliasKey, aliasKeys, aliasMap) {
	let target = aliasMap[aliasKey];
	const seenTargets = /* @__PURE__ */ new Set();
	const seenAliasKeys = /* @__PURE__ */ new Set();
	while (target && !isConcreteJitiAliasTarget(target) && !seenTargets.has(target)) {
		seenTargets.add(target);
		let nextTarget;
		for (const candidateKey of aliasKeys) {
			if (candidateKey === aliasKey || aliasKey.startsWith(candidateKey) || !target.startsWith(candidateKey) || !JITI_ALIAS_ROOT_SENTINELS.has(target[candidateKey.length])) continue;
			if (seenAliasKeys.has(candidateKey)) return target;
			seenAliasKeys.add(candidateKey);
			nextTarget = aliasMap[candidateKey] + target.slice(candidateKey.length);
			break;
		}
		if (!nextTarget || nextTarget === target) break;
		target = nextTarget;
	}
	return target;
}
function normalizePluginLoaderAliasMapForJiti(aliasMap) {
	if (hasJitiNormalizedAliasMarker(aliasMap)) return aliasMap;
	const facts = getPluginSdkAliasFacts(getPluginCache().sdk, aliasMap);
	const cachedByInput = facts.normalizedJiti;
	if (cachedByInput) return cachedByInput;
	const cacheKey = createJitiAliasContentCacheKey(aliasMap);
	const normalizedJitiAliasMapCache = getPluginCache().sdk.normalizedJitiAliases;
	const cached = normalizedJitiAliasMapCache.get(cacheKey);
	if (cached) {
		facts.normalizedJiti = cached;
		return cached;
	}
	const aliasDepth = /* @__PURE__ */ new Map();
	const getAliasDepth = (key) => {
		const cachedDepth = aliasDepth.get(key);
		if (cachedDepth !== void 0) return cachedDepth;
		const depth = key.split("/").length;
		aliasDepth.set(key, depth);
		return depth;
	};
	const normalizedAliasMap = Object.fromEntries(Object.entries(aliasMap).toSorted(([left], [right]) => getAliasDepth(right) - getAliasDepth(left)));
	const aliasKeys = Object.keys(normalizedAliasMap);
	for (const aliasKey of aliasKeys) {
		const target = normalizedAliasMap[aliasKey];
		if (!target || isConcreteJitiAliasTarget(target)) continue;
		const resolvedTarget = resolveJitiAliasTarget(aliasKey, aliasKeys, normalizedAliasMap);
		if (resolvedTarget) normalizedAliasMap[aliasKey] = resolvedTarget;
	}
	Object.defineProperty(normalizedAliasMap, JITI_NORMALIZED_ALIAS_SYMBOL, {
		value: true,
		enumerable: false
	});
	normalizedJitiAliasMapCache.set(cacheKey, normalizedAliasMap);
	facts.normalizedJiti = normalizedAliasMap;
	return normalizedAliasMap;
}
//#endregion
//#region src/plugins/sdk-alias-workspace.ts
const WORKSPACE_PACKAGE_ALIAS_SUBPATHS = [
	["gateway-client", [
		"",
		"readiness",
		"timeouts",
		"websocket-data"
	]],
	["gateway-protocol", [
		"",
		"client-info",
		"connect-error-details",
		"frame-guards",
		"gateway-error-details",
		"restart-unavailable",
		"schema",
		"startup-unavailable",
		"version"
	]],
	["markdown-core", [
		"",
		"code-spans",
		"fences",
		"frontmatter",
		"ir",
		"render",
		"render-aware-chunking",
		"tables",
		"types"
	]],
	["media-generation-core", [
		"",
		"capability-model-ref",
		"catalog",
		"model-ref",
		"normalization"
	]],
	["retry", [""]],
	["terminal-core", [
		"",
		"ansi",
		"decorative-emoji",
		"health-style",
		"links",
		"note",
		"osc-progress",
		"palette",
		"progress-line",
		"prompt-select-styled",
		"prompt-select-styled-params",
		"prompt-style",
		"restore",
		"safe-text",
		"stream-writer",
		"table",
		"terminal-link",
		"theme"
	]],
	["net-policy", [
		"",
		"ip",
		"ipv4",
		"redact-sensitive-url",
		"url-protocol",
		"url-userinfo"
	]],
	["model-catalog-core", [
		"",
		"configured-model-refs",
		"model-catalog-refs",
		"model-catalog-normalize",
		"model-catalog-pricing",
		"model-catalog-types",
		"provider-id",
		"provider-model-id-normalization",
		"provider-model-id-normalize"
	]]
];
const WORKSPACE_PACKAGE_ALIAS_ENTRIES = WORKSPACE_PACKAGE_ALIAS_SUBPATHS.flatMap(([packageDir, subpaths]) => subpaths.map((subpath) => ({
	packageName: `@testclaw/${packageDir}`,
	packageDir,
	subpath,
	srcFile: `${subpath || "index"}.ts`,
	distFile: `${subpath || "index"}.mjs`
})));
const WORKSPACE_PACKAGE_EXPORT_DIRS = [
	"media-core",
	"normalization-core",
	"acp-core",
	"llm-core"
];
const WORKSPACE_PACKAGE_ALIAS_NAMES = /* @__PURE__ */ new Set([...WORKSPACE_PACKAGE_ALIAS_SUBPATHS.map(([name]) => `@testclaw/${name}`), ...WORKSPACE_PACKAGE_EXPORT_DIRS.map((name) => `@testclaw/${name}`)]);
const ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS = /* @__PURE__ */ new Set([
	"acp-core",
	"media-core",
	"normalization-core",
	"retry",
	"terminal-core"
]);
//#endregion
//#region src/plugins/sdk-alias.ts
const STARTUP_ARGV1 = process.argv[1];
function sdkHost(packageRoot) {
	return getPluginSdkHostFacts(getPluginCache().sdk, path.resolve(packageRoot));
}
function readSdkJsonFile(filePath) {
	const file = readPluginCacheFile({
		rootDir: path.dirname(filePath),
		relativePath: path.basename(filePath),
		rejectHardlinks: false
	});
	const parsed = file.ok ? parsePluginCacheJson(file) : void 0;
	return parsed?.ok ? parsed.value : null;
}
function sanitizeJitiCachePathSegment(value) {
	const normalized = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return normalized.length > 0 ? normalized : "unknown";
}
function resolveJitiFsCacheRoot() {
	const xdgCacheHome = process.env.XDG_CACHE_HOME?.trim();
	if (xdgCacheHome && path.isAbsolute(xdgCacheHome)) return xdgCacheHome;
	const homeDir = resolveRequiredHomeDir(process.env, os.homedir);
	if (process.platform === "win32") {
		const localAppData = process.env.LOCALAPPDATA?.trim();
		return localAppData && path.isAbsolute(localAppData) ? localAppData : path.join(homeDir, "AppData", "Local");
	}
	return process.platform === "darwin" ? path.join(homeDir, "Library", "Caches") : path.join(homeDir, ".cache");
}
function readJitiBooleanEnv(name, defaultValue) {
	if (!(name in process.env)) return defaultValue;
	try {
		return Boolean(JSON.parse(process.env[name] ?? ""));
	} catch {
		return defaultValue;
	}
}
function shouldUseJitiFsCache() {
	return readJitiBooleanEnv("JITI_FS_CACHE", readJitiBooleanEnv("JITI_CACHE", true));
}
function resolvePluginLoaderJitiNativeModules() {
	try {
		const configured = JSON.parse(process.env.JITI_NATIVE_MODULES ?? "[]");
		const nativeModules = Array.isArray(configured) ? configured.filter((entry) => typeof entry === "string") : [];
		return [.../* @__PURE__ */ new Set([...nativeModules, "testclaw"])];
	} catch {
		return ["testclaw"];
	}
}
function normalizeJitiAliasTargetPath(targetPath) {
	const canonicalPath = pluginCacheRealpathSync(targetPath) ?? targetPath;
	return process.platform === "win32" ? canonicalPath.replace(/\\/g, "/") : canonicalPath;
}
function resolveLoaderModulePath$1(params = {}) {
	return params.modulePath ?? fileURLToPath(params.moduleUrl ?? import.meta.url);
}
function readPluginSdkPackageJson(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.packageJson !== void 0) return facts.packageJson;
	const parsed = readSdkJsonFile(path.join(packageRoot, "package.json"));
	facts.packageJson = isRecord(parsed) ? {
		...typeof parsed.name === "string" ? { name: parsed.name } : {},
		...isRecord(parsed.exports) ? { exports: parsed.exports } : {},
		...typeof parsed.bin === "string" || isRecord(parsed.bin) ? { bin: parsed.bin } : {},
		...typeof parsed.version === "string" ? { version: parsed.version } : {}
	} : null;
	return facts.packageJson;
}
function resolveJitiCacheModulePath(params = {}) {
	if (params.modulePath?.startsWith("file://")) try {
		return fileURLToPath(params.modulePath);
	} catch {}
	return resolveLoaderModulePath$1(params);
}
function resolvePluginLoaderJitiFsCacheDir(params = {}) {
	const modulePath = resolveJitiCacheModulePath(params);
	const packageRoot = resolveLoaderPackageRoot({
		...params,
		modulePath
	}) ?? path.dirname(modulePath);
	const packageJsonPath = path.join(packageRoot, "package.json");
	const version = sanitizeJitiCachePathSegment(readPluginSdkPackageJson(packageRoot)?.version ?? "unknown");
	let installMarker = "no-package-json";
	const stat = pluginCacheStatSync(packageJsonPath);
	if (stat) installMarker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
	return path.join(resolveJitiFsCacheRoot(), "testclaw", "jiti", version, sanitizeJitiCachePathSegment(installMarker));
}
function resolvePluginLoaderJitiFsCacheOption(params = {}) {
	return shouldUseJitiFsCache() ? resolvePluginLoaderJitiFsCacheDir(params) : false;
}
function isSafePluginSdkSubpathSegment(subpath) {
	return /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(subpath);
}
function listPluginSdkSubpathsFromPackageJson(pkg) {
	return Object.keys(pkg.exports ?? {}).filter((key) => key.startsWith("./plugin-sdk/")).map((key) => key.slice(13)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath)).toSorted();
}
function hasTrustedAssistantRootIndicator(params) {
	const facts = sdkHost(params.packageRoot);
	if (facts.trustedRoot !== void 0) return facts.trustedRoot;
	const packageExports = params.packageJson.exports ?? {};
	if (!Object.keys(packageExports).some((key) => key.startsWith("./plugin-sdk/"))) return facts.trustedRoot = false;
	const hasCliEntryExport = Object.hasOwn(packageExports, "./cli-entry");
	const hasAssistantBin = typeof params.packageJson.bin === "string" && normalizeLowercaseStringOrEmpty(params.packageJson.bin).includes("testclaw") || typeof params.packageJson.bin === "object" && params.packageJson.bin !== null && typeof params.packageJson.bin.testclaw === "string";
	return facts.trustedRoot = hasCliEntryExport || hasAssistantBin || pluginCacheExistsSync(path.join(params.packageRoot, "testclaw.mjs"));
}
function readPluginSdkSubpathsFromPackageRoot(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.exportedSubpaths !== void 0) return facts.exportedSubpaths;
	const pkg = readPluginSdkPackageJson(packageRoot);
	if (!pkg) return facts.exportedSubpaths = null;
	if (!hasTrustedAssistantRootIndicator({
		packageRoot,
		packageJson: pkg
	})) return facts.exportedSubpaths = null;
	const subpaths = listPluginSdkSubpathsFromPackageJson(pkg);
	return facts.exportedSubpaths = subpaths.length > 0 ? subpaths : null;
}
function resolveTrustedAssistantRootFromArgvHint(params) {
	if (!params.argv1) return null;
	const packageRoot = resolveAssistantPackageRootSync({
		cwd: params.cwd,
		argv1: params.argv1
	});
	if (!packageRoot) return null;
	const packageJson = readPluginSdkPackageJson(packageRoot);
	if (!packageJson) return null;
	return hasTrustedAssistantRootIndicator({
		packageRoot,
		packageJson
	}) ? packageRoot : null;
}
function findNearestPluginSdkPackageRoot(startDir, maxDepth = 12) {
	let cursor = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		if (readPluginSdkSubpathsFromPackageRoot(cursor)) return cursor;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return null;
}
function resolveLoaderPackageRoot(params) {
	const cwd = params.cwd ?? path.dirname(params.modulePath);
	const fromModulePath = resolveAssistantPackageRootSync({ cwd });
	if (fromModulePath) return fromModulePath;
	const argv1 = params.argv1 ?? process.argv[1];
	const moduleUrl = params.moduleUrl ?? (params.modulePath ? void 0 : import.meta.url);
	return resolveAssistantPackageRootSync({
		cwd,
		...argv1 ? { argv1 } : {},
		...moduleUrl ? { moduleUrl } : {}
	});
}
function createPluginRuntimeModuleCandidateMap(packageRoot) {
	return {
		src: path.join(packageRoot, "src", "plugins", "runtime", "index.ts"),
		dist: path.join(packageRoot, "dist", "plugins", "runtime", "index.js")
	};
}
function appendPluginRuntimeModuleCandidates(candidates, packageRoot, orderedKinds) {
	const candidateMap = createPluginRuntimeModuleCandidateMap(packageRoot);
	for (const kind of orderedKinds) candidates.push(candidateMap[kind]);
}
function appendSiblingPluginRuntimeModuleCandidates(candidates, runtimeDir, orderedKinds) {
	const candidateMap = {
		src: path.join(runtimeDir, "index.ts"),
		dist: path.join(runtimeDir, "index.js")
	};
	for (const kind of orderedKinds) candidates.push(candidateMap[kind]);
}
function dedupeResolvedPaths(paths) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const candidate of paths) {
		const resolved = path.resolve(candidate);
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		deduped.push(resolved);
	}
	return deduped;
}
function listAncestorPluginRuntimeModuleCandidates(params) {
	const candidates = [];
	for (const start of params.starts) {
		if (!start) continue;
		let cursor = path.resolve(start);
		const maxDepth = params.maxDepth ?? 12;
		for (let i = 0; i < maxDepth; i += 1) {
			appendPluginRuntimeModuleCandidates(candidates, cursor, params.orderedKinds);
			const parent = path.dirname(cursor);
			if (parent === cursor) break;
			cursor = parent;
		}
	}
	return dedupeResolvedPaths(candidates);
}
function listArgvRuntimeFallbackStartDirs(argv1) {
	if (!argv1) return [];
	const normalized = path.resolve(argv1);
	const starts = [];
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		starts.push(path.join(nodeModulesDir, binName));
	}
	try {
		const resolved = pluginCacheRealpathSync(normalized);
		if (resolved && resolved !== normalized) starts.push(path.dirname(resolved));
	} catch {}
	starts.push(path.dirname(normalized));
	return dedupeResolvedPaths(starts);
}
function resolveDevSourceRootParam(params) {
	return params.devSourceRoot !== void 0 ? params.devSourceRoot : resolveAssistantDevSourceRoot(process.env);
}
function resolveLoaderPluginSdkPackageRoot(params) {
	const devSourceRoot = resolveDevSourceRootParam(params);
	if (devSourceRoot) return devSourceRoot;
	const cwd = params.cwd ?? path.dirname(params.modulePath);
	return (params.moduleUrl ? resolveAssistantPackageRootSync({ moduleUrl: params.moduleUrl }) : null) ?? resolveAssistantPackageRootSync({ cwd }) ?? resolveTrustedAssistantRootFromArgvHint({
		cwd,
		argv1: params.argv1
	}) ?? findNearestPluginSdkPackageRoot(path.dirname(params.modulePath)) ?? (params.cwd ? findNearestPluginSdkPackageRoot(params.cwd) : null) ?? findNearestPluginSdkPackageRoot(process.cwd());
}
function resolvePluginSdkAliasCandidateOrder(params) {
	if (params.pluginSdkResolution === "dist") return ["dist", "src"];
	if (params.pluginSdkResolution === "src") return ["src", "dist"];
	const normalizedModulePath = params.modulePath.replace(/\\/g, "/");
	const isDistRuntime = /\/dist(?:-runtime)?\//.test(normalizedModulePath);
	const isSourceRuntime = normalizedModulePath.includes("/src/");
	return isDistRuntime || !isSourceRuntime && params.isProduction ? ["dist", "src"] : ["src", "dist"];
}
const PLUGIN_SDK_PACKAGE_NAMES = ["testclaw/plugin-sdk", "@testclaw/plugin-sdk"];
const CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH = "codex-mcp-projection";
const CODEX_SESSION_TRANSCRIPT_PLUGIN_SDK_SUBPATH = "codex-session-transcript-runtime";
const NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH = "native-hook-relay-runtime";
const CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH = "ssrf-runtime-internal";
const PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS = /* @__PURE__ */ new Set([
	"agent-runtime-test-contracts",
	"channel-contract-testing",
	"channel-ingress-test-runtime",
	"channel-target-testing",
	"channel-test-helpers",
	"plugin-test-api",
	"plugin-test-contracts",
	"plugin-state-test-runtime",
	"plugin-test-runtime",
	"provider-http-test-mocks",
	"provider-test-contracts",
	"qa-channel",
	"qa-channel-protocol",
	"qa-lab",
	"qa-runtime",
	"reply-payload-testing",
	"sqlite-runtime-testing",
	"test-env",
	"test-fixtures",
	"test-live",
	"test-live-auth",
	"test-media-generation",
	"test-media-understanding",
	"test-node-mocks"
]);
const PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS = [
	{
		bundledPluginId: "codex",
		officialInstalledPackageName: "@testclaw/codex",
		allowPrivateQaCli: true,
		subpaths: [
			CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH,
			CODEX_SESSION_TRANSCRIPT_PLUGIN_SDK_SUBPATH,
			NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH
		]
	},
	{
		bundledPluginId: "ollama",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	},
	{
		bundledPluginId: "browser",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	},
	{
		bundledPluginId: "llama-cpp",
		officialInstalledPackageName: "@testclaw/llama-cpp-provider",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	}
];
const PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS = [
	".ts",
	".mts",
	".js",
	".mjs",
	".cts",
	".cjs"
];
const BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN = /^(?:api|runtime-api|test-api|.+-api)$/u;
const JS_STATIC_RELATIVE_DEPENDENCY_PATTERN = /(?:\bfrom\s*["']|\bimport\s*\(\s*["']|\brequire\s*\(\s*["'])(\.{1,2}\/[^"']+)["']/g;
function normalizePackageExportSubpath(exportKey) {
	if (exportKey === ".") return "";
	if (!exportKey.startsWith("./")) return null;
	const subpath = exportKey.slice(2);
	return subpath && !subpath.includes("..") ? subpath : null;
}
function resolvePackageExportImportPath(value) {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	return typeof record.import === "string" ? record.import : typeof record.default === "string" ? record.default : null;
}
function listRootPackagedWorkspacePackageAliasEntries(params) {
	const distRoot = path.join(params.packageRoot, "dist", params.packageDir);
	if (!pluginCacheExistsSync(distRoot)) return [];
	const entries = [];
	const visit = (dir, prefix = "") => {
		for (const entry of readPluginCacheDirectory(dir)) {
			const relativePath = prefix ? path.join(prefix, entry.name) : entry.name;
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				visit(fullPath, relativePath);
				continue;
			}
			if (!entry.isFile() || !relativePath.endsWith(".js")) continue;
			const normalizedRelativePath = relativePath.split(path.sep).join("/");
			const subpath = normalizedRelativePath === "index.js" ? "" : normalizedRelativePath.slice(0, -3);
			if (subpath.includes("..")) continue;
			entries.push({
				packageName: params.packageName,
				packageDir: params.packageDir,
				subpath,
				srcFile: `${subpath || "index"}.ts`,
				distFile: relativePath
			});
		}
	};
	visit(distRoot);
	return entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath));
}
function listWorkspacePackageExportAliasEntries(params) {
	const cache = sdkHost(params.packageRoot).workspaceExports;
	const key = `${params.packageName}\0${params.packageDir}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const packageJsonPath = path.join(params.packageRoot, "packages", params.packageDir, "package.json");
	const exports = readPluginSdkPackageJson(path.dirname(packageJsonPath))?.exports;
	if (!exports || typeof exports !== "object" || Array.isArray(exports)) {
		const entries = listRootPackagedWorkspacePackageAliasEntries(params);
		cache.set(key, entries);
		return entries;
	}
	const entries = [];
	for (const [exportKey, value] of Object.entries(exports)) {
		const subpath = normalizePackageExportSubpath(exportKey);
		const importPath = resolvePackageExportImportPath(value);
		if (subpath === null || !importPath?.startsWith("./dist/") || !importPath.endsWith(".mjs")) continue;
		const distFile = importPath.slice(7);
		const srcFile = distFile.replace(/\.mjs$/u, ".ts");
		entries.push({
			packageName: params.packageName,
			packageDir: params.packageDir,
			subpath,
			srcFile,
			distFile
		});
	}
	const result = entries.length > 0 ? entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath)) : listRootPackagedWorkspacePackageAliasEntries(params);
	cache.set(key, result);
	return result;
}
function isUsableDistPluginSdkArtifact(candidate) {
	const cache = getPluginCache().sdk.usableDistArtifacts;
	const cached = cache.get(candidate);
	if (cached !== void 0) return cached;
	const usable = checkDistPluginSdkArtifact(candidate);
	cache.set(candidate, usable);
	return usable;
}
function checkDistPluginSdkArtifact(candidate) {
	if (!pluginCacheExistsSync(candidate)) return false;
	switch (normalizeLowercaseStringOrEmpty(path.extname(candidate))) {
		case ".js":
		case ".mjs":
		case ".cjs": break;
		default: return true;
	}
	try {
		const source = fs.readFileSync(candidate, "utf-8");
		for (const match of source.matchAll(JS_STATIC_RELATIVE_DEPENDENCY_PATTERN)) {
			const specifier = match[1];
			if (!specifier || pluginCacheExistsSync(path.resolve(path.dirname(candidate), specifier))) continue;
			return false;
		}
	} catch {
		return false;
	}
	return true;
}
function readPrivateLocalOnlyPluginSdkSubpaths(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.privateSubpaths) return facts.privateSubpaths;
	const parsed = readSdkJsonFile(path.join(packageRoot, "scripts", "lib", "plugin-sdk-private-local-only-subpaths.json"));
	return facts.privateSubpaths = [.../* @__PURE__ */ new Set([
		CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH,
		NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH,
		CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH,
		...Array.isArray(parsed) ? parsed.filter((subpath) => typeof subpath === "string" && isSafePluginSdkSubpathSegment(subpath)) : []
	])];
}
function readBundledPluginPackageName(packageJsonPath) {
	const parsed = readPluginSdkPackageJson(path.dirname(packageJsonPath));
	const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
	return name.startsWith("@testclaw/") ? name : null;
}
function isBundledPluginPublicSurfaceSourceBasename(params) {
	if (params.basename === "test-api") return params.includePrivateQa;
	return BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN.test(params.basename);
}
function listBundledPluginPublicSurfaceSourceBasenames(params) {
	try {
		return readPluginCacheDirectory(params.extensionSourceRoot).filter((entry) => entry.isFile()).map((entry) => entry.name).flatMap((fileName) => {
			const ext = PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS.find((candidateExt) => fileName.endsWith(candidateExt));
			if (!ext) return [];
			const basename = fileName.slice(0, -ext.length);
			return isBundledPluginPublicSurfaceSourceBasename({
				basename,
				includePrivateQa: params.includePrivateQa
			}) ? [basename] : [];
		}).toSorted();
	} catch {
		return [];
	}
}
function resolveBundledPluginPublicSurfaceAliasTarget(params) {
	for (const kind of params.orderedKinds) {
		if (kind === "dist") {
			const candidate = path.join(params.packageRoot, "dist", "extensions", params.dirName, `${params.basename}.js`);
			if (pluginCacheExistsSync(candidate)) return candidate;
			continue;
		}
		for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
			const candidate = path.join(params.packageRoot, "extensions", params.dirName, `${params.basename}${ext}`);
			if (pluginCacheExistsSync(candidate)) return candidate;
		}
	}
	return null;
}
function resolveBundledPluginPackagePublicSurfaceAliasMap(context) {
	const { packageRoot, orderedKinds, includePrivateQa } = context;
	if (!packageRoot) return {};
	const cachedBundledPluginPublicSurfaceAliasMaps = sdkHost(packageRoot).bundledAliasesByMode;
	const cacheKey = `${packageRoot}::${orderedKinds.join(",")}::privateQa=${includePrivateQa ? "1" : "0"}`;
	const cached = cachedBundledPluginPublicSurfaceAliasMaps.get(cacheKey);
	if (cached) return cached;
	const extensionsRoot = path.join(packageRoot, "extensions");
	let extensionDirs;
	try {
		extensionDirs = readPluginCacheDirectory(extensionsRoot);
	} catch {
		cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, {});
		return {};
	}
	const aliasMap = {};
	for (const entry of extensionDirs) {
		if (!entry.isDirectory()) continue;
		const dirName = entry.name;
		const packageName = readBundledPluginPackageName(path.join(extensionsRoot, dirName, "package.json"));
		if (!packageName) continue;
		for (const basename of listBundledPluginPublicSurfaceSourceBasenames({
			extensionSourceRoot: path.join(extensionsRoot, dirName),
			includePrivateQa
		})) {
			const target = resolveBundledPluginPublicSurfaceAliasTarget({
				packageRoot,
				dirName,
				basename,
				orderedKinds
			});
			if (!target) continue;
			aliasMap[`${packageName}/${basename}.js`] = normalizeJitiAliasTargetPath(target);
		}
	}
	cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, aliasMap);
	return aliasMap;
}
function resolveWorkspacePackageAliasMap(context) {
	const { packageRoot, orderedKinds } = context;
	if (!packageRoot) return {};
	const cacheKey = `${packageRoot}::${orderedKinds.join(",")}`;
	const cachedWorkspacePackageAliasMaps = sdkHost(packageRoot).workspaceAliasesByMode;
	const cached = cachedWorkspacePackageAliasMaps.get(cacheKey);
	if (cached) return cached;
	const aliasMap = {};
	const workspacePackageAliasEntries = [...WORKSPACE_PACKAGE_ALIAS_ENTRIES, ...WORKSPACE_PACKAGE_EXPORT_DIRS.flatMap((packageDir) => listWorkspacePackageExportAliasEntries({
		packageRoot,
		packageName: `@testclaw/${packageDir}`,
		packageDir
	}))];
	for (const entry of workspacePackageAliasEntries) {
		const alias = entry.subpath ? `${entry.packageName}/${entry.subpath}` : entry.packageName;
		for (const kind of orderedKinds) {
			const candidate = (kind === "dist" ? [...ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS.has(entry.packageDir) ? [path.join(packageRoot, "dist", entry.packageDir, entry.distFile.replace(/\.mjs$/u, ".js"))] : [], path.join(packageRoot, "packages", entry.packageDir, "dist", entry.distFile)] : [path.join(packageRoot, "packages", entry.packageDir, "src", entry.srcFile)]).find((candidatePath) => pluginCacheExistsSync(candidatePath));
			if (candidate) {
				aliasMap[alias] = normalizeJitiAliasTargetPath(candidate);
				break;
			}
		}
	}
	cachedWorkspacePackageAliasMaps.set(cacheKey, aliasMap);
	return aliasMap;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpaths() {
	return process.env.TESTCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
function isBundledPluginModulePath(params) {
	const normalizedModulePath = path.resolve(params.modulePath);
	return [
		path.join(params.packageRoot, "extensions", params.pluginId),
		path.join(params.packageRoot, "dist", "extensions", params.pluginId),
		path.join(params.packageRoot, "dist-runtime", "extensions", params.pluginId)
	].some((root) => normalizedModulePath === root || normalizedModulePath.startsWith(`${root}${path.sep}`));
}
function isAnyBundledPluginModulePath(params) {
	const normalizedModulePath = path.resolve(params.modulePath);
	return [
		"extensions",
		path.join("dist", "extensions"),
		path.join("dist-runtime", "extensions")
	].map((segment) => path.join(params.packageRoot, segment)).some((root) => normalizedModulePath.startsWith(`${root}${path.sep}`));
}
function isOfficialInstalledPluginPackageRoot(params) {
	const [scope, name] = params.packageName.split("/");
	if (!scope || !name) return false;
	const segments = path.resolve(params.packageRoot).split(path.sep).filter(Boolean);
	const last = segments.at(-1);
	const packageScope = segments.at(-2);
	const nodeModules = segments.at(-3);
	return last === name && packageScope === scope && nodeModules === "node_modules";
}
function isOfficialInstalledPluginModulePath(params) {
	let cursor = path.dirname(path.resolve(params.modulePath));
	for (let depth = 0; depth < 12; depth += 1) {
		const packageJson = readPluginSdkPackageJson(cursor);
		if (packageJson) return packageJson.name === params.packageName && isOfficialInstalledPluginPackageRoot({
			packageRoot: cursor,
			packageName: params.packageName
		});
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return false;
}
function isTrustedPrivatePluginSdkOwnerPath(params) {
	if (isBundledPluginModulePath({
		packageRoot: params.packageRoot,
		modulePath: params.modulePath,
		pluginId: params.owner.bundledPluginId
	})) return true;
	return params.owner.officialInstalledPackageName ? isOfficialInstalledPluginModulePath({
		modulePath: params.modulePath,
		packageName: params.owner.officialInstalledPackageName
	}) : false;
}
function findPrivatePluginSdkSubpathOwners(subpath) {
	return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter((owner) => owner.subpaths.includes(subpath));
}
function listTrustedPrivatePluginSdkOwnerKeys(params) {
	return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter((owner) => isTrustedPrivatePluginSdkOwnerPath({
		...params,
		owner
	})).map((owner) => owner.bundledPluginId);
}
function resolvePrivatePluginSdkOwnerPackageRoot(params) {
	return resolveLoaderPackageRoot({
		modulePath: params.modulePath,
		argv1: params.argv1,
		moduleUrl: params.moduleUrl
	}) ?? params.aliasPackageRoot;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpath(context, subpath) {
	if (PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS.has(subpath)) return context.includePrivateQa;
	const owners = findPrivatePluginSdkSubpathOwners(subpath);
	if (owners.length === 0) return context.bundledPlugin || context.includePrivateQa;
	return owners.some((owner) => context.trustedPrivateOwners.includes(owner.bundledPluginId) || owner.allowPrivateQaCli && context.includePrivateQa);
}
function listDistPluginSdkArtifactSubpaths(packageRoot) {
	try {
		const distPluginSdkDir = path.join(packageRoot, "dist", "plugin-sdk");
		return new Set(readPluginCacheDirectory(distPluginSdkDir).filter((entry) => entry.isFile() && entry.name.endsWith(".js")).map((entry) => entry.name.slice(0, -3)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function pluginSdkAuthorityCacheKey(context) {
	return `${context.packageRoot}::privateQa=${context.includePrivateQa ? "1" : "0"}::privateOwners=${context.trustedPrivateOwners.join(",")}::bundled=${context.bundledPlugin ? "1" : "0"}`;
}
function listPluginSdkExportedSubpaths(context) {
	const { packageRoot } = context;
	if (!packageRoot) return [];
	const cacheKey = pluginSdkAuthorityCacheKey(context);
	const cachedPluginSdkExportedSubpaths = sdkHost(packageRoot).subpathsByOwner;
	const cached = cachedPluginSdkExportedSubpaths.get(cacheKey);
	if (cached) return cached;
	const subpaths = [.../* @__PURE__ */ new Set([...readPluginSdkSubpathsFromPackageRoot(packageRoot) ?? [], ...readPrivateLocalOnlyPluginSdkSubpaths(packageRoot).filter((subpath) => shouldIncludePrivateLocalOnlyPluginSdkSubpath(context, subpath))])].toSorted();
	cachedPluginSdkExportedSubpaths.set(cacheKey, subpaths);
	return subpaths;
}
function createPluginSdkScopedAliases(context) {
	const { packageRoot, orderedKinds } = context;
	const targets = new Map(listPluginSdkExportedSubpaths(context).map((subpath) => [subpath, void 0]));
	let distArtifacts;
	let aliasMap;
	const resolveSubpath = (subpath) => {
		if (!packageRoot || !targets.has(subpath)) return;
		const cachedTarget = targets.get(subpath);
		if (cachedTarget !== void 0) return cachedTarget ?? void 0;
		for (const kind of orderedKinds) {
			if (kind === "dist") {
				distArtifacts ??= listDistPluginSdkArtifactSubpaths(packageRoot);
				const candidate = path.join(packageRoot, "dist", "plugin-sdk", `${subpath}.js`);
				if (distArtifacts.has(subpath) && isUsableDistPluginSdkArtifact(candidate)) {
					targets.set(subpath, candidate);
					return candidate;
				}
				continue;
			}
			for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
				const candidate = path.join(packageRoot, "src", "plugin-sdk", `${subpath}${ext}`);
				if (pluginCacheExistsSync(candidate)) {
					targets.set(subpath, candidate);
					return candidate;
				}
			}
		}
		targets.set(subpath, null);
	};
	const buildAliasMap = () => {
		const aliases = {};
		for (const subpath of targets.keys()) {
			const target = resolveSubpath(subpath);
			if (!target) continue;
			for (const packageName of PLUGIN_SDK_PACKAGE_NAMES) aliases[`${packageName}/${subpath}`] = normalizeJitiAliasTargetPath(target);
		}
		return aliases;
	};
	return {
		resolveSubpath,
		getAliasMap: () => aliasMap ??= buildAliasMap()
	};
}
/** Captures host and private authority now; only complete artifact preparation is deferred. */
function preparePluginLoaderAliases(params) {
	const modulePath = path.resolve(params.modulePath);
	let hostModulePath = modulePath;
	if (params.moduleUrl) try {
		hostModulePath = fileURLToPath(params.moduleUrl);
	} catch {}
	const captured = {
		...params,
		modulePath,
		devSourceRoot: resolveDevSourceRootParam(params)
	};
	const packageRoot = resolveLoaderPluginSdkPackageRoot(captured);
	const ownerPackageRoot = packageRoot ? resolvePrivatePluginSdkOwnerPackageRoot({
		...captured,
		aliasPackageRoot: packageRoot
	}) : null;
	const context = {
		packageRoot,
		orderedKinds: resolvePluginSdkAliasCandidateOrder({
			modulePath: hostModulePath,
			isProduction: true,
			pluginSdkResolution: params.pluginSdkResolution
		}),
		includePrivateQa: shouldIncludePrivateLocalOnlyPluginSdkSubpaths(),
		trustedPrivateOwners: ownerPackageRoot ? listTrustedPrivatePluginSdkOwnerKeys({
			packageRoot: ownerPackageRoot,
			modulePath
		}) : [],
		bundledPlugin: ownerPackageRoot ? isAnyBundledPluginModulePath({
			packageRoot: ownerPackageRoot,
			modulePath
		}) : false
	};
	const cache = getPluginCache();
	const cacheKey = JSON.stringify(context);
	const cached = cache.sdk.contexts.get(cacheKey);
	if (cached) return cached;
	let sourceTransformAliasMap;
	let aliasMap;
	let sdkAliases;
	const getSdkAliases = () => sdkAliases ??= createPluginSdkScopedAliases(context);
	const getSourceTransformAliasMap = () => withPluginCache(cache, () => sourceTransformAliasMap ??= {
		...resolveBundledPluginPackagePublicSurfaceAliasMap(context),
		...resolveWorkspacePackageAliasMap(context)
	});
	const getAliasMap = () => withPluginCache(cache, () => aliasMap ??= {
		...getSourceTransformAliasMap(),
		...getSdkAliases().getAliasMap()
	});
	const prepared = {
		packageRoot,
		cacheKey,
		sdkRoots: packageRoot ? context.orderedKinds.map((kind) => {
			const root = path.join(packageRoot, kind, "plugin-sdk");
			return pluginCacheRealpathSync(root) ?? root;
		}) : [],
		getAliasMap,
		getSourceTransformAliasMap,
		resolveAlias: (specifier) => {
			if (!isPluginLoaderAliasSpecifier(specifier)) return;
			if (aliasMap) return aliasMap[specifier];
			return withPluginCache(cache, () => {
				const prefix = PLUGIN_SDK_PACKAGE_NAMES.find((name) => specifier.startsWith(`${name}/`));
				if (!prefix) return getAliasMap()[specifier];
				const target = getSdkAliases().resolveSubpath(specifier.slice(prefix.length + 1));
				return target ? normalizeJitiAliasTargetPath(target) : void 0;
			});
		}
	};
	cache.sdk.contexts.set(cacheKey, prepared);
	return prepared;
}
function isPluginLoaderAliasSpecifier(specifier) {
	const packageName = specifier.split("/", 2).join("/");
	const basename = specifier.slice(packageName.length + 1);
	return isPluginSdkAliasSpecifier(specifier) || WORKSPACE_PACKAGE_ALIAS_NAMES.has(packageName) || packageName.startsWith("@testclaw/") && !basename.includes("/") && basename.endsWith(".js") && BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN.test(basename.slice(0, -3));
}
function isPluginSdkAliasSpecifier(specifier) {
	return PLUGIN_SDK_PACKAGE_NAMES.some((prefix) => specifier.startsWith(`${prefix}/`));
}
function buildPluginLoaderAliasMap(modulePath, argv1 = STARTUP_ARGV1, moduleUrl, pluginSdkResolution = "auto", devSourceRoot) {
	return preparePluginLoaderAliases({
		modulePath,
		argv1,
		moduleUrl,
		pluginSdkResolution,
		devSourceRoot
	}).getAliasMap();
}
function resolvePluginRuntimeModulePathWithDiagnostics(params = {}) {
	const cache = getPluginCache().sdk.runtimeModules;
	const key = JSON.stringify([
		params.modulePath,
		params.argv1 ?? process.argv[1],
		params.cwd,
		params.moduleUrl,
		resolveDevSourceRootParam(params),
		params.pluginSdkResolution,
		process.cwd(),
		"production"
	]);
	const cached = cache.get(key);
	if (cached) return cached;
	const result = resolvePluginRuntimeModuleCandidates(params);
	cache.set(key, result);
	return result;
}
function resolvePluginRuntimeModuleCandidates(params) {
	let modulePath;
	let packageRoot = null;
	const candidates = [];
	try {
		modulePath = resolveLoaderModulePath$1(params);
		const orderedKinds = resolvePluginSdkAliasCandidateOrder({
			modulePath,
			isProduction: true,
			pluginSdkResolution: params.pluginSdkResolution
		});
		packageRoot = resolveDevSourceRootParam(params) ?? resolveLoaderPackageRoot({
			...params,
			modulePath
		});
		if (packageRoot) appendPluginRuntimeModuleCandidates(candidates, packageRoot, orderedKinds);
		else {
			const argv1 = params.argv1 ?? process.argv[1];
			candidates.push(...listAncestorPluginRuntimeModuleCandidates({
				starts: listArgvRuntimeFallbackStartDirs(argv1),
				orderedKinds
			}));
			appendSiblingPluginRuntimeModuleCandidates(candidates, path.join(path.dirname(modulePath), "runtime"), orderedKinds);
		}
		const dedupedCandidates = dedupeResolvedPaths(candidates);
		for (const candidate of dedupedCandidates) if (pluginCacheExistsSync(candidate)) return {
			modulePath,
			packageRoot,
			candidates: dedupedCandidates,
			resolvedPath: candidate
		};
	} catch (error) {
		return {
			modulePath,
			packageRoot,
			candidates: dedupeResolvedPaths(candidates),
			resolvedPath: null,
			error: formatErrorMessage(error)
		};
	}
	return {
		modulePath,
		packageRoot,
		candidates: dedupeResolvedPaths(candidates),
		resolvedPath: null
	};
}
function buildPluginLoaderJitiOptions(aliasMap, params = {}) {
	const hasAliases = Object.keys(aliasMap).length > 0;
	const jitiAliasMap = hasAliases ? normalizePluginLoaderAliasMapForJiti(aliasMap) : aliasMap;
	return {
		interopDefault: true,
		fsCache: resolvePluginLoaderJitiFsCacheOption(params),
		tryNative: true,
		nativeModules: resolvePluginLoaderJitiNativeModules(),
		extensions: [
			...PLUGIN_SOURCE_MODULE_EXTENSIONS,
			".js",
			".mjs",
			".cjs",
			".json"
		],
		...hasAliases ? { alias: jitiAliasMap } : {}
	};
}
function createPluginLoaderModuleCacheKey(params) {
	const facts = getPluginSdkAliasFacts(getPluginCache().sdk, params.aliasMap);
	const aliasMapKey = facts.moduleKey ??= createJitiAliasContentCacheKey(params.aliasMap);
	return `${params.tryNative ? "native" : "transform"}\0${aliasMapKey}`;
}
//#endregion
//#region src/plugins/plugin-sdk-native-resolver.ts
/** Installs native Node resolution aliases so plugins can import the Assistant SDK in dev and tests. */
const moduleWithResolver = Module;
const nodeResolveFilenameProperty = "_resolveFilename";
const INTERNAL_CORE_PACKAGE_ALIASES = [
	{
		packageName: "@testclaw/markdown-core",
		packageDir: "markdown-core",
		subpaths: [
			["", "index.ts"],
			["code-spans", "code-spans.ts"],
			["fences", "fences.ts"],
			["frontmatter", "frontmatter.ts"],
			["ir", "ir.ts"],
			["render", "render.ts"],
			["render-aware-chunking", "render-aware-chunking.ts"],
			["tables", "tables.ts"],
			["types", "types.ts"]
		]
	},
	{
		packageName: "@testclaw/ai",
		packageDir: "ai",
		subpaths: [
			["", "index.ts"],
			["providers", "providers.ts"],
			["transports", "transports.ts"],
			["diagnostics", path.join("utils", "diagnostics.ts")],
			["event-stream", path.join("utils", "event-stream.ts")],
			["types", "types.ts"],
			["validation", "validation.ts"],
			["internal/anthropic", path.join("internal", "anthropic.ts")],
			["internal/google-model-family", path.join("internal", "google-model-family.ts")],
			["internal/openai", path.join("internal", "openai.ts")],
			["internal/openai-responses-payload-policy", path.join("internal", "openai-responses-payload-policy.ts")],
			["internal/retry-after", path.join("internal", "retry-after.ts")],
			["internal/runtime", path.join("internal", "runtime.ts")],
			["internal/shared", path.join("internal", "shared.ts")],
			["internal/tool-schema", path.join("internal", "tool-schema.ts")]
		]
	},
	{
		packageName: "@testclaw/llm-core",
		packageDir: "llm-core",
		subpaths: [
			["", "index.ts"],
			["model-contracts/anthropic", path.join("model-contracts", "anthropic.ts")],
			["diagnostics", path.join("utils", "diagnostics.ts")],
			["event-stream", path.join("utils", "event-stream.ts")],
			["types", "types.ts"],
			["validation", "validation.ts"]
		]
	}
];
const INTERNAL_CORE_EXPORTED_PACKAGE_DIRS = [
	"media-core",
	"normalization-core",
	"acp-core"
];
const BUN_NATIVE_ALIAS_FILTER = new RegExp(`^(?:${[
	"testclaw/plugin-sdk",
	"@testclaw/plugin-sdk",
	...INTERNAL_CORE_PACKAGE_ALIASES.map((entry) => entry.packageName),
	...INTERNAL_CORE_EXPORTED_PACKAGE_DIRS.map((packageDir) => `@testclaw/${packageDir}`)
].map(escapeRegExp).join("|")})(?:/|$)`, "u");
let installed = false;
function resolveLoaderModulePath(options) {
	return options.modulePath ?? fileURLToPath(options.moduleUrl ?? import.meta.url);
}
function isNativeLoadableSdkTarget(targetPath) {
	switch (path.extname(targetPath)) {
		case ".cjs":
		case ".js":
		case ".mjs": return true;
		default: return isPluginSourceModulePath(targetPath);
	}
}
const normalizePathForBoundary = (targetPath) => pluginCacheRealpathSync(targetPath) ?? path.resolve(targetPath);
function findNearestPackageRoot(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const roots = getPluginCache().sdk.native.nearestPackageRoots;
	const cached = roots.get(normalizedModulePath);
	if (cached) return cached;
	let cursor = path.dirname(normalizedModulePath);
	for (let i = 0; i < 12; i += 1) {
		if (pluginCacheExistsSync(path.join(cursor, "package.json"))) {
			roots.set(normalizedModulePath, cursor);
			return cursor;
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	const fallback = path.dirname(normalizedModulePath);
	roots.set(normalizedModulePath, fallback);
	return fallback;
}
function findBundledPluginRoot(modulePath) {
	const resolvedModulePath = normalizePathForBoundary(modulePath);
	const packageRoot = normalizePathForBoundary(resolveLoaderPackageRootFromModulePath(modulePath));
	for (const relativeRoot of [
		"extensions",
		"dist/extensions",
		"dist-runtime/extensions"
	]) {
		const bundledRoot = path.join(packageRoot, relativeRoot);
		if (!isPathStrictlyInside(bundledRoot, resolvedModulePath)) continue;
		const [pluginId] = path.relative(bundledRoot, resolvedModulePath).split(path.sep);
		if (pluginId) return path.join(bundledRoot, pluginId);
	}
}
function resolveLoaderPackageRootFromModulePath(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const roots = getPluginCache().sdk.native.loaderPackageRoots;
	const cached = roots.get(normalizedModulePath);
	if (cached) return cached;
	let cursor = path.dirname(normalizedModulePath);
	for (let i = 0; i < 12; i += 1) {
		const packageJsonPath = path.join(cursor, "package.json");
		if (pluginCacheExistsSync(packageJsonPath)) {
			const facts = getPluginSdkHostFacts(getPluginCache().sdk, cursor);
			if (facts.nativePackage === void 0) try {
				const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
				facts.nativePackage = isRecord(parsed) ? {
					...typeof parsed.name === "string" ? { name: parsed.name } : {},
					hasAssistantBin: isRecord(parsed.bin) && typeof parsed.bin.testclaw === "string"
				} : null;
			} catch {
				facts.nativePackage = null;
			}
			if (facts.nativePackage?.name === "testclaw" || facts.nativePackage?.hasAssistantBin) {
				roots.set(normalizedModulePath, cursor);
				return cursor;
			}
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	const fallback = findNearestPackageRoot(modulePath);
	roots.set(normalizedModulePath, fallback);
	return fallback;
}
function resolveInternalCorePackageHostRoot(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const internalCorePackageHostRoots = getPluginCache().sdk.native.hostRoots;
	const cached = internalCorePackageHostRoots.get(normalizedModulePath);
	if (cached) return cached;
	const packageRoot = normalizePathForBoundary(resolveLoaderPackageRootFromModulePath(normalizedModulePath));
	internalCorePackageHostRoots.set(normalizedModulePath, packageRoot);
	return packageRoot;
}
function resolveAllowedParentRoot(modulePath) {
	const roots = getPluginCache().sdk.native.allowedParentRoots;
	const key = path.resolve(modulePath);
	const cached = roots.get(key);
	if (cached) return cached;
	const root = findBundledPluginRoot(modulePath) ?? findNearestPackageRoot(modulePath);
	roots.set(key, root);
	return root;
}
function resolveAllowedParentRoots(options) {
	const roots = /* @__PURE__ */ new Set();
	if (options.pluginModulePath) roots.add(normalizePathForBoundary(resolveAllowedParentRoot(options.pluginModulePath)));
	for (const root of options.allowedParentRoots ?? []) roots.add(normalizePathForBoundary(root));
	return [...roots];
}
function isWithinRoot(candidate, root) {
	return isPathInside(root, normalizePathForBoundary(candidate));
}
function resolveAliasTargetForParentUrl(request, parentUrl) {
	if (!parentUrl?.startsWith("file:") || !isPluginSdkAliasSpecifier(request) && !getPluginCache().sdk.native.aliases.has(request)) return;
	try {
		return resolveAliasTargetForParentPath(request, fileURLToPath(parentUrl));
	} catch {
		return;
	}
}
function resolveAliasTargetForParentPath(request, parentFilename) {
	const native = getPluginCache().sdk.native;
	if (parentFilename && isPluginSdkAliasSpecifier(request)) {
		let first;
		for (const [root, provider] of native.sdkProviders) {
			if (!isWithinRoot(parentFilename, root)) continue;
			provider.order ??= native.nextSdkProviderOrder++;
			const target = provider.resolveAlias(request.endsWith(".js") ? request.slice(0, -3) : request);
			if (target && isNativeLoadableSdkTarget(target) && (!first || provider.order < first.order)) first = {
				target,
				order: provider.order
			};
		}
		return first?.target;
	}
	const entries = native.aliases.get(request);
	if (!entries || !parentFilename) return;
	return entries.find((entry) => isWithinRoot(parentFilename, entry.parentRoot))?.target;
}
function listInternalCorePackageNativeAliases(packageRoot) {
	const parentRoots = [
		"src",
		"scripts",
		"packages",
		"test"
	].map((segment) => path.join(packageRoot, segment)).filter((candidate) => pluginCacheExistsSync(candidate)).map(normalizePathForBoundary);
	if (parentRoots.length === 0) return [];
	const aliases = [];
	const internalCorePackageAliases = [...INTERNAL_CORE_PACKAGE_ALIASES, ...INTERNAL_CORE_EXPORTED_PACKAGE_DIRS.map((packageDir) => ({
		packageName: `@testclaw/${packageDir}`,
		packageDir,
		subpaths: listWorkspacePackageExportAliasEntries({
			packageRoot,
			packageName: `@testclaw/${packageDir}`,
			packageDir
		}).map((entry) => [entry.subpath, entry.srcFile])
	}))];
	for (const entry of internalCorePackageAliases) for (const [subpath, srcFile] of entry.subpaths) {
		const request = subpath ? `${entry.packageName}/${subpath}` : entry.packageName;
		const target = path.join(packageRoot, "packages", entry.packageDir, "src", srcFile);
		if (pluginCacheExistsSync(target)) aliases.push({
			request,
			target,
			parentRoots
		});
	}
	return aliases;
}
function installResolver() {
	const native = getPluginCache().sdk.native;
	if (installed || !(native.aliases.size || native.sdkProviders.size)) return;
	const bun = globalThis.Bun;
	if (bun) bun.plugin({
		name: "testclaw-plugin-sdk-alias",
		setup(builder) {
			builder.onResolve({
				filter: BUN_NATIVE_ALIAS_FILTER,
				namespace: "file"
			}, ({ path: request, importer }) => {
				const target = resolveAliasTargetForParentPath(request, importer);
				return target ? {
					path: target,
					namespace: "file"
				} : void 0;
			});
		}
	});
	const previousResolveFilename = moduleWithResolver[nodeResolveFilenameProperty];
	if (!previousResolveFilename || !supportsNativeModuleAliasHooks()) {
		installed = Boolean(bun);
		return;
	}
	moduleWithResolver[nodeResolveFilenameProperty] = ((request, parent, isMain, options) => resolveAliasTargetForParentPath(request, parent?.filename) ?? previousResolveFilename(request, parent, isMain, options));
	moduleWithResolver.registerHooks?.({ resolve(specifier, context, nextResolve) {
		const aliasTarget = resolveAliasTargetForParentUrl(specifier, context.parentURL);
		const resolved = aliasTarget ? {
			shortCircuit: true,
			url: pathToFileURL(aliasTarget).href
		} : nextResolve(specifier, context);
		if (context.conditions.includes("import") && resolved.url.startsWith("file:")) {
			const filename = fileURLToPath(resolved.url);
			const sdkTarget = isPluginSdkAliasSpecifier(specifier) ? aliasTarget : Array.from(getPluginCache().sdk.contexts.values()).some(({ sdkRoots }) => sdkRoots.includes(path.dirname(filename))) ? resolveAliasTargetForParentUrl(`testclaw/plugin-sdk/${path.basename(filename, path.extname(filename))}`, context.parentURL) : void 0;
			if (sdkTarget && pathToFileURL(sdkTarget).href === resolved.url) Module.createRequire(import.meta.url)(sdkTarget);
		}
		return resolved;
	} });
	installed = true;
}
function registerNativeAlias(params) {
	const pluginSdkNativeAliases = getPluginCache().sdk.native.aliases;
	const entries = pluginSdkNativeAliases.get(params.request) ?? [];
	for (const parentRoot of params.parentRoots) {
		const existingIndex = entries.findIndex((entry) => entry.parentRoot === parentRoot);
		if (existingIndex !== -1) {
			entries[existingIndex] = {
				parentRoot,
				target: params.target
			};
			continue;
		}
		entries.push({
			parentRoot,
			target: params.target
		});
	}
	if (entries.length > 0) pluginSdkNativeAliases.set(params.request, entries);
}
function clearNativeAliasesForParentRoots(parentRoots) {
	if (parentRoots.length === 0) return;
	const parentRootSet = new Set(parentRoots);
	for (const root of parentRoots) getPluginCache().sdk.native.sdkProviders.delete(root);
	const pluginSdkNativeAliases = getPluginCache().sdk.native.aliases;
	for (const [request, entries] of pluginSdkNativeAliases) {
		const nextEntries = entries.filter((entry) => !parentRootSet.has(entry.parentRoot));
		if (nextEntries.length === 0) pluginSdkNativeAliases.delete(request);
		else pluginSdkNativeAliases.set(request, nextEntries);
	}
}
function registerInternalCorePackageNativeAliases(options) {
	const packageRoot = resolveInternalCorePackageHostRoot(resolveLoaderModulePath(options));
	const registeredInternalCorePackageHosts = getPluginCache().sdk.native.registeredHosts;
	if (registeredInternalCorePackageHosts.has(packageRoot)) return;
	for (const alias of listInternalCorePackageNativeAliases(packageRoot)) registerNativeAlias(alias);
	registeredInternalCorePackageHosts.add(packageRoot);
}
function installAssistantPluginSdkNativeResolver(options = {}) {
	const parentRoots = resolveAllowedParentRoots(options);
	clearNativeAliasesForParentRoots(parentRoots);
	const aliases = preparePluginLoaderAliases({
		modulePath: options.pluginModulePath ?? resolveLoaderModulePath(options),
		argv1: options.argv1 ?? process.argv[1],
		moduleUrl: options.moduleUrl ?? pathToFileURL(resolveLoaderModulePath(options)).href,
		pluginSdkResolution: options.pluginSdkResolution,
		devSourceRoot: options.devSourceRoot
	});
	const native = getPluginCache().sdk.native;
	for (const parentRoot of parentRoots) native.sdkProviders.set(parentRoot, { resolveAlias: aliases.resolveAlias });
	registerInternalCorePackageNativeAliases(options);
	installResolver();
}
function installAssistantInternalCorePackageNativeResolver(options = {}) {
	registerInternalCorePackageNativeAliases(options);
	installResolver();
	return [...getPluginCache().sdk.native.aliases.keys()].toSorted();
}
//#endregion
//#region src/plugins/runtime-context.ts
function isSourceInsideRecordRoot(record, rootDir, source, roots) {
	if (process.platform === "win32" || !path.isAbsolute(rootDir)) return isPathInside(rootDir, source);
	let prepared = roots.get(record);
	if (prepared?.rootDir !== rootDir) {
		const resolvedRootDir = path.resolve(rootDir);
		prepared = {
			rootDir,
			resolvedRootDir,
			prefix: resolvedRootDir.endsWith(path.sep) ? resolvedRootDir : resolvedRootDir + path.sep
		};
		roots.set(record, prepared);
	}
	return source === prepared.resolvedRootDir || source.startsWith(prepared.prefix);
}
/** Exact context identity disambiguates package siblings; a unique root works for host callers. */
function resolvePluginRuntimeRecord(params) {
	const root = params.pluginRoot ? getPluginCacheRoot(params.pluginRoot).rootDir : void 0;
	const source = params.modulePath ? path.resolve(params.modulePath) : void 0;
	const roots = getPluginCache().runtimeRecordRoots;
	const pluginId = params.pluginId ?? getPluginRegistryState()?.registrationContext?.pluginId ?? getPluginRuntimeGatewayRequestScope()?.pluginId;
	const records = getPluginRegistryForContext()?.plugins ?? [];
	const matchesSource = (record) => record.rootDir && (root ? getPluginCacheRoot(record.rootDir).rootDir === root : isSourceInsideRecordRoot(record, record.rootDir, source, roots) || getPluginInstance(record)?.hasModuleSource(source) === true);
	if (pluginId !== void 0) {
		const owner = records.find((record) => record.id === pluginId && matchesSource(record));
		if (owner) return owner;
	}
	let first;
	let count = 0;
	for (const record of records) {
		if (pluginId !== void 0 && record.id === pluginId || !matchesSource(record)) continue;
		first ??= record;
		count++;
	}
	if (count > 1 || params.pluginId && count) throw new Error(`Plugin public surface ${root ?? source} has ambiguous runtime ownership; specify its plugin id.`);
	return first;
}
//#endregion
//#region src/plugins/plugin-module-loader-cache.ts
/** Caches plugin module loaders and native-load stats for runtime/source module imports. */
const MAX_TRACKED_SOURCE_TRANSFORM_TARGETS = 24;
const pluginModuleLoaderStats = {
	calls: 0,
	nativeHits: 0,
	nativeMisses: 0,
	sourceTransformForced: 0,
	sourceTransformFallbacks: 0,
	sourceTransformTargets: /* @__PURE__ */ new Map()
};
function recordSourceTransformTarget(target) {
	const current = pluginModuleLoaderStats.sourceTransformTargets.get(target) ?? 0;
	pluginModuleLoaderStats.sourceTransformTargets.set(target, current + 1);
	if (pluginModuleLoaderStats.sourceTransformTargets.size <= MAX_TRACKED_SOURCE_TRANSFORM_TARGETS) return;
	const [leastUsedTarget] = [...pluginModuleLoaderStats.sourceTransformTargets].reduce((least, entry) => entry[1] < least[1] ? entry : least);
	pluginModuleLoaderStats.sourceTransformTargets.delete(leastUsedTarget);
}
/** Returns process-local plugin module loader stats for diagnostics and tests. */
function getPluginModuleLoaderStats() {
	const { sourceTransformTargets, ...stats } = pluginModuleLoaderStats;
	return {
		...stats,
		topSourceTransformTargets: [...sourceTransformTargets].toSorted((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])).slice(0, 8).map(([target, count]) => ({
			target,
			count
		}))
	};
}
function toSourceTransformImportPath(specifier) {
	if (process.platform === "win32" && path.isAbsolute(specifier)) return pathToFileURL(specifier).href;
	return toSafeImportPath(specifier);
}
function resolveAutomaticJitiTsconfig(loaderFilename) {
	const enabled = process.env.JITI_TSCONFIG_PATHS;
	if (enabled !== "1" && enabled !== "true") return;
	let directory = path.dirname(loaderFilename);
	while (true) {
		const config = path.join(directory, "tsconfig.json");
		if (fs.existsSync(config)) return config;
		const parent = path.dirname(directory);
		if (parent === directory) return;
		directory = parent;
	}
}
function createBunJitiImportCachePlugin(babel) {
	return { visitor: { Program: { exit(program) {
		const calls = [];
		program.traverse({ CallExpression(call) {
			if (call.node.callee.type === "Identifier" && call.node.callee.name === "jitiImport" && !call.scope.getBinding("jitiImport")) calls.push(call);
		} });
		if (calls.length === 0) return;
		const cache = program.scope.generateUidIdentifier("testclawJitiImports");
		const load = program.scope.generateUidIdentifier("testclawJitiImport");
		for (const call of calls) call.replaceWith(babel.types.callExpression(babel.types.identifier(load.name), call.node.arguments));
		program.unshiftContainer("body", babel.template.statements.ast(`
              var ${cache.name};
              function ${load.name}(specifier, ...args) {
                let entry = ${cache.name};
                while (entry) {
                  if (entry.specifier === specifier) {
                    return entry.pending;
                  }
                  entry = entry.next;
                }
                const pending = (async () => {
                  await 0;
                  return jitiImport(specifier, ...args);
                })();
                ${cache.name} = { specifier, pending, next: ${cache.name} };
                return pending;
              }
            `));
	} } } };
}
function preserveBunJitiDynamicImportResults(loader) {
	if (!process.versions.bun || typeof loader.options?.transform !== "function") return;
	const transform = loader.options.transform;
	loader.options.transform = (options) => transform({
		...options,
		babel: {
			...options.babel,
			plugins: [...Array.isArray(options.babel?.plugins) ? options.babel.plugins : [], createBunJitiImportCachePlugin]
		}
	});
}
function resolvePluginModuleLoaderCacheEntry(params) {
	const loaderFilename = toSafeImportPath(params.loaderFilename ?? params.modulePath);
	const tryNative = params.tryNative ?? resolvePluginLoaderTryNative(params.modulePath, params);
	const explicit = params.aliasMap ? { ...params.aliasMap } : void 0;
	const aliases = explicit ? {
		cacheKey: createPluginLoaderModuleCacheKey({
			tryNative,
			aliasMap: explicit
		}),
		getAliasMap: () => explicit,
		getSourceTransformAliasMap: () => explicit,
		resolveAlias: (specifier) => explicit[specifier]
	} : preparePluginLoaderAliases({
		modulePath: params.modulePath,
		argv1: params.argvEntry ?? process.argv[1],
		moduleUrl: params.importerUrl,
		devSourceRoot: params.devSourceRoot,
		pluginSdkResolution: params.pluginSdkResolution
	});
	const moduleConfigCacheKey = `${tryNative ? "native" : "transform"}\0${aliases.cacheKey}`;
	const lazyNativeAliasFallback = tryNative && typeof Module.registerHooks !== "function";
	const scopedCacheKey = `${loaderFilename}::${params.cacheScopeKey ? `${params.cacheScopeKey}::` : ""}${moduleConfigCacheKey}`;
	return {
		loaderFilename,
		getAliasMap: aliases.getAliasMap,
		resolveAlias: aliases.resolveAlias,
		tryNative,
		sourceTransformAliasMap: lazyNativeAliasFallback ? aliases.getSourceTransformAliasMap : void 0,
		scopedCacheKey
	};
}
function createPluginModuleLoader(params) {
	let loadWithSourceTransform;
	const getLoadWithSourceTransform = () => {
		if (loadWithSourceTransform) return loadWithSourceTransform;
		const jitiOptions = buildPluginLoaderJitiOptions(params.sourceTransformAliasMap?.() ?? params.getAliasMap(), { modulePath: params.loaderFilename });
		const automaticTsconfig = resolveAutomaticJitiTsconfig(params.loaderFilename);
		const jitiLoader = (params.createLoader ?? createJiti)(params.loaderFilename, {
			...jitiOptions,
			...automaticTsconfig ? { tsconfigPaths: automaticTsconfig } : {},
			virtualModules: new Proxy({}, {
				has(_target, key) {
					return typeof key === "string" && isPluginSdkAliasSpecifier(key) && Boolean(params.resolveAlias(key));
				},
				get(_target, key) {
					const target = typeof key === "string" ? params.resolveAlias(key) : void 0;
					if (!target) return;
					const native = tryNativeRequireModule(target, { aliasMap: params.resolveAlias });
					if (!native.ok) throw new Error(`Unable to load host Plugin SDK natively: ${target}. Use a supported native TypeScript loader for a source host, or rebuild the host SDK.`);
					return native.moduleExport;
				}
			}),
			tryNative: false
		});
		preserveBunJitiDynamicImportResults(jitiLoader);
		loadWithSourceTransform = (target) => jitiLoader(toSourceTransformImportPath(target));
		return loadWithSourceTransform;
	};
	return (target) => {
		const source = getPluginCacheSource(target, params.cache);
		const cached = source.variants.get(params.scopedCacheKey)?.exports;
		if (cached) return cached.value;
		const loaded = withPluginCache(params.cache, () => {
			pluginModuleLoaderStats.calls += 1;
			if (params.tryNative) {
				const native = tryNativeRequireJavaScriptModule(target, {
					aliasMap: params.resolveAlias,
					fallbackOnMissingDependency: true
				});
				if (native.ok) {
					pluginModuleLoaderStats.nativeHits += 1;
					return native.moduleExport;
				}
				pluginModuleLoaderStats.nativeMisses += 1;
				pluginModuleLoaderStats.sourceTransformFallbacks += 1;
			} else pluginModuleLoaderStats.sourceTransformForced += 1;
			recordSourceTransformTarget(target);
			return getLoadWithSourceTransform()(target);
		});
		source.variants.set(params.scopedCacheKey, { exports: { value: loaded } });
		return loaded;
	};
}
function getCachedPluginModuleLoader(params) {
	const cacheEntry = resolvePluginModuleLoaderCacheEntry(params);
	const cache = getPluginCache();
	const cached = cache.moduleLoaders.get(cacheEntry.scopedCacheKey);
	if (cached) return cached;
	installAssistantInternalCorePackageNativeResolver({ moduleUrl: params.importerUrl });
	const loader = createPluginModuleLoader({
		...cacheEntry,
		cache,
		...params.createLoader ? { createLoader: params.createLoader } : {}
	});
	cache.moduleLoaders.set(cacheEntry.scopedCacheKey, loader);
	return loader;
}
function resolvePublicSurfaceInstance(params) {
	if (!isPathInside$1(params.boundaryRoot, params.modulePath) && !isPathInside$1(getPluginCacheRoot(params.boundaryRoot).rootDir, params.modulePath)) throw new Error(`Unable to open ${params.surfaceLabel}: outside ${params.boundaryLabel}`);
	const owner = resolvePluginRuntimeRecord(params);
	const instance = owner ? getPluginInstance(owner) : void 0;
	if ((owner?.origin ?? params.origin) === "bundled" && (owner?.status !== "loaded" || instance?.hasModuleSource(params.modulePath) === void 0)) return;
	if (!owner || owner.status !== "loaded") {
		if (getPluginRuntimeGatewayRequestScope()?.pluginRegistry) throw new Error(`Plugin public surface ${params.modulePath} has no active runtime owner.`);
		return;
	}
	if (!instance) throw new Error(`Plugin ${owner.id} has no runtime module owner`);
	return instance;
}
/** Validates an entry once per generation without changing its module export shape. */
function preparePluginModule(params) {
	const cache = getPluginCache();
	let source = getPluginCacheSource(params.modulePath, cache);
	const boundaryKey = `${getPluginCacheRoot(params.boundaryRoot).rootDir}\0${params.rejectHardlinks}`;
	if (source.validatedBoundaries.has(boundaryKey)) return {
		source,
		modulePath: source.modulePath ?? params.modulePath
	};
	const opened = openPluginRootFileSync({
		filePath: params.modulePath,
		rootPath: params.boundaryRoot,
		boundaryLabel: params.boundaryLabel,
		rejectHardlinks: params.rejectHardlinks
	});
	if (!opened.ok) throw new Error(`Unable to open ${params.surfaceLabel}`, { cause: opened.error });
	fs.closeSync(opened.fd);
	if (!sameFileIdentity(opened.stat, fs.statSync(opened.path))) throw new Error(`${params.surfaceLabel} changed after validation`);
	const root = bindPluginCacheRoot(params.boundaryRoot, opened.rootRealPath);
	root.publicSurfaceBoundary ??= {
		boundaryLabel: params.boundaryLabel,
		rejectHardlinks: params.rejectHardlinks
	};
	cache.sourceAliases.set(path.resolve(params.modulePath), opened.path);
	source = getPluginCacheSource(opened.path, cache);
	source.modulePath = opened.path;
	source.validatedBoundaries.add(`${opened.rootRealPath}\0${params.rejectHardlinks}`);
	return {
		source,
		modulePath: opened.path
	};
}
/** Public artifacts and SDK facades share one validated module, including circular imports. */
function loadPluginPublicSurfaceModuleSync(params) {
	const instance = resolvePublicSurfaceInstance(params);
	if (instance) return instance.loadModule(params.modulePath);
	const { source, modulePath } = preparePluginModule(params);
	const cached = source.publicSurface?.exports;
	if (cached) return cached;
	const sentinel = {};
	const boundaryRoot = getPluginCacheRoot(params.boundaryRoot).rootDir;
	source.disposeModule ??= () => clearPluginModuleRequireCache(modulePath, boundaryRoot);
	source.publicSurface = { exports: sentinel };
	try {
		Object.assign(sentinel, params.loadModule(modulePath));
		return sentinel;
	} catch (error) {
		delete source.publicSurface;
		source.validatedBoundaries.clear();
		throw error;
	}
}
//#endregion
export { resolvePluginRuntimeRecord as a, buildPluginLoaderAliasMap as c, preparePluginLoaderAliases as d, resolveLoaderPackageRoot as f, preparePluginModule as i, buildPluginLoaderJitiOptions as l, toSafeImportPath as m, getPluginModuleLoaderStats as n, installAssistantInternalCorePackageNativeResolver as o, resolvePluginRuntimeModulePathWithDiagnostics as p, loadPluginPublicSurfaceModuleSync as r, installAssistantPluginSdkNativeResolver as s, getCachedPluginModuleLoader as t, isPluginSdkAliasSpecifier as u };
