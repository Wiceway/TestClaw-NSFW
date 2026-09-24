import { o as getPluginCache } from "./plugin-cache-CTGtP6hf.mjs";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-CayS889k.mjs";
import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import "./utils-Dy46mFy2.mjs";
import { r as isPathInside } from "./path-guards-0NKGHIHl.mjs";
import { l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-DeB0I5Kl.mjs";
import { a as isSourceCheckoutRoot, i as isPluginInPackageBundledRoots } from "./bundled-dir-Bmn6z9c1.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an Assistant source checkout. */
const TESTCLAW_DEV_SOURCE_ROOT_ENV = "TESTCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		return typeof parsed.name === "string" ? parsed.name : null;
	} catch {
		return null;
	}
}
/** Resolves and validates the configured Assistant development source root. */
function resolveAssistantDevSourceRoot(env = process.env) {
	const rawRoot = env[TESTCLAW_DEV_SOURCE_ROOT_ENV]?.trim();
	if (!rawRoot) return null;
	const resolvedRoot = resolveUserPath(rawRoot, env);
	const roots = getPluginCache().sdk.devSourceRoots;
	if (roots.has(resolvedRoot)) return roots.get(resolvedRoot) ?? null;
	const realRoot = pluginCacheRealpathSync(resolvedRoot);
	const result = realRoot && readPackageName(path.join(realRoot, "package.json")) === "testclaw" && pluginCacheExistsSync(path.join(realRoot, "src")) && pluginCacheExistsSync(path.join(realRoot, "extensions")) ? realRoot : null;
	roots.set(resolvedRoot, result);
	return result;
}
/** Source builds own their bundled SDK consumers even without an explicit development selector. */
function resolveBundledPluginSourceRoot(env = process.env) {
	const selected = resolveAssistantDevSourceRoot(env);
	if (selected) return selected;
	const hostRoot = resolveAssistantPackageRootSync({ moduleUrl: import.meta.url });
	return hostRoot && isSourceCheckoutRoot(hostRoot) ? hostRoot : null;
}
function formatSourceBundledPluginNotice(pluginId) {
	return `Kept bundled plugin "${pluginId}" from the Assistant source build; the registry artifact has no matching host SDK build identity. Matching version strings do not establish SDK compatibility.`;
}
/** Prioritizes already-bundled candidates; the selector itself never grants provenance. */
function isBundledPluginInsideDevSourceRoot(params) {
	const devSourceRoot = resolveBundledPluginSourceRoot(params.env);
	if (!devSourceRoot) return false;
	if (!isPluginInPackageBundledRoots({
		packageRoot: devSourceRoot,
		rootDir: resolveUserPath(params.rootDir, params.env)
	})) return false;
	if (resolveAssistantDevSourceRoot(params.env)) return true;
	const hostRoot = pluginCacheRealpathSync(devSourceRoot);
	const pluginRoot = pluginCacheRealpathSync(resolveUserPath(params.rootDir, params.env));
	return Boolean(hostRoot && pluginRoot && ["dist", "dist-runtime"].some((tree) => isPathInside(path.join(hostRoot, tree, "extensions"), pluginRoot)));
}
//#endregion
export { resolveAssistantDevSourceRoot as i, isBundledPluginInsideDevSourceRoot as n, resolveBundledPluginSourceRoot as r, formatSourceBundledPluginNotice as t };
