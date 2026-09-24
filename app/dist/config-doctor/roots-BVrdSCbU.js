import { d as normalizeStringEntries } from "./string-normalization-DsCfAx8q.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { o as resolveBundledPluginsDir } from "./bundled-dir-wAZIVp2F.js";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths--_w6GXvW.js";
import { i as resolveAssistantDevSourceRoot } from "./dev-source-root--sPueI65.js";
import path from "node:path";
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
	const env = params.env ?? process.env;
	const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
	return {
		stock: resolveBundledPluginsDir(env),
		global: resolveDefaultPluginExtensionsDir(env),
		workspace: workspaceRoot ? path.join(workspaceRoot, ".testclaw", "extensions") : void 0
	};
}
function resolvePluginCacheInputs(params) {
	const env = params.env ?? process.env;
	return {
		roots: resolvePluginSourceRoots({
			workspaceDir: params.workspaceDir,
			env
		}),
		loadPaths: normalizeStringEntries((params.loadPaths ?? []).filter((entry) => typeof entry === "string")).map((entry) => resolveUserPath(entry, env)),
		devSourceRoot: resolveAssistantDevSourceRoot(env)
	};
}
//#endregion
export { resolvePluginSourceRoots as n, resolvePluginCacheInputs as t };
