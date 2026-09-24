import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import "./utils-Dy46mFy2.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-Cl9s4QHb.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { M as parseLegacyBundledPluginPath, N as parsePackagedBundledPluginPath, j as normalizeBundledLookupPath, k as buildBundledPluginLoadPathAliases, l as findUninspectedPluginDiagnostic, t as discoverConfiguredPluginLoadPaths } from "./discovery-Beqghw38.mjs";
import "./agent-scope-_30Scclc.mjs";
import { a as resolveBundledPluginSources } from "./bundled-sources-Ch_lPBIJ.mjs";
import path from "node:path";
//#region src/commands/doctor/shared/bundled-plugin-load-paths.ts
function resolveBundledWorkspaceDir(cfg) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	return defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : void 0;
}
function isAssistantNodeModulesPackageRoot(packageRoot) {
	const normalized = normalizeBundledLookupPath(packageRoot);
	const packageDir = path.basename(normalized);
	const parentDir = path.basename(path.dirname(normalized));
	return packageDir === "testclaw" && parentDir === "node_modules";
}
/** Find configured plugin load paths that alias bundled plugins already shipped by Assistant. */
function scanBundledPluginLoadPathMigrations(cfg, env = process.env) {
	const plugins = asNullableRecord(cfg.plugins);
	const load = asNullableRecord(plugins?.load);
	const rawPaths = Array.isArray(load?.paths) ? load.paths : [];
	if (rawPaths.length === 0) return [];
	const bundled = resolveBundledPluginSources({
		workspaceDir: resolveBundledWorkspaceDir(cfg),
		env
	});
	if (bundled.size === 0) return [];
	const bundledPathMap = /* @__PURE__ */ new Map();
	const packagedBundledLeafMap = /* @__PURE__ */ new Map();
	for (const source of bundled.values()) {
		for (const alias of buildBundledPluginLoadPathAliases(source.localPath)) bundledPathMap.set(normalizeBundledLookupPath(alias.path), {
			pluginId: source.pluginId,
			toPath: source.localPath
		});
		const packaged = parsePackagedBundledPluginPath(source.localPath);
		if (packaged) packagedBundledLeafMap.set(normalizeBundledLookupPath(packaged.bundledLeaf), {
			pluginId: source.pluginId,
			toPath: source.localPath
		});
	}
	const { diagnostics } = discoverConfiguredPluginLoadPaths({
		loadPaths: rawPaths.filter((rawPath) => typeof rawPath === "string"),
		env
	});
	const hits = [];
	for (const rawPath of rawPaths) {
		if (typeof rawPath !== "string") continue;
		const normalized = normalizeBundledLookupPath(resolveUserPath(rawPath, env));
		if (findUninspectedPluginDiagnostic(diagnostics.filter((diagnostic) => diagnostic.source !== void 0 && normalizeBundledLookupPath(diagnostic.source) === normalized))) continue;
		const match = bundledPathMap.get(normalized);
		if (!match) {
			const oldPackaged = parsePackagedBundledPluginPath(normalized);
			const oldLegacy = oldPackaged ? null : parseLegacyBundledPluginPath(normalized);
			const oldPackageRoot = oldPackaged?.packageRoot ?? oldLegacy?.packageRoot;
			const oldBundledLeaf = oldPackaged?.bundledLeaf ?? oldLegacy?.bundledLeaf;
			const oldPackageMatch = oldPackageRoot && oldBundledLeaf && isAssistantNodeModulesPackageRoot(oldPackageRoot) ? packagedBundledLeafMap.get(normalizeBundledLookupPath(oldBundledLeaf)) : void 0;
			if (!oldPackageMatch) continue;
			hits.push({
				pluginId: oldPackageMatch.pluginId,
				fromPath: rawPath,
				toPath: oldPackageMatch.toPath,
				pathLabel: "plugins.load.paths"
			});
			continue;
		}
		hits.push({
			pluginId: match.pluginId,
			fromPath: rawPath,
			toPath: match.toPath,
			pathLabel: "plugins.load.paths"
		});
	}
	return hits;
}
/** Format user-facing warnings for redundant bundled plugin load path aliases. */
function collectBundledPluginLoadPathWarnings(params) {
	if (params.hits.length === 0) return [];
	const lines = params.hits.map((hit) => `- ${hit.pathLabel}: bundled plugin path "${hit.fromPath}" still aliases ${hit.pluginId}; Assistant loads the packaged bundled plugin from "${hit.toPath}".`);
	lines.push(`- Run "${params.doctorFixCommand}" to remove these redundant bundled plugin paths.`);
	return lines.map((line) => sanitizeForLog(line));
}
/** Remove redundant bundled plugin load path aliases while preserving unrelated custom paths. */
function maybeRepairBundledPluginLoadPaths(cfg, env = process.env) {
	const hits = scanBundledPluginLoadPathMigrations(cfg, env);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const paths = next.plugins?.load?.paths;
	if (!Array.isArray(paths)) return {
		config: cfg,
		changes: []
	};
	const removable = new Set(hits.map((hit) => normalizeBundledLookupPath(resolveUserPath(hit.fromPath, env))));
	const rewritten = [];
	for (const entry of paths) {
		if (typeof entry !== "string") {
			rewritten.push(entry);
			continue;
		}
		const resolved = normalizeBundledLookupPath(resolveUserPath(entry, env));
		if (removable.has(resolved)) continue;
		rewritten.push(entry);
	}
	next.plugins = {
		...next.plugins,
		load: {
			...next.plugins?.load,
			paths: rewritten
		}
	};
	return {
		config: next,
		changes: hits.map((hit) => `- plugins.load.paths: removed bundled ${hit.pluginId} path alias ${hit.fromPath}`)
	};
}
//#endregion
export { maybeRepairBundledPluginLoadPaths as n, scanBundledPluginLoadPathMigrations as r, collectBundledPluginLoadPathWarnings as t };
