import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import "./utils-Dy46mFy2.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-Bmn6z9c1.mjs";
import { i as resolveAssistantDevSourceRoot } from "./dev-source-root-D5sHRqMW.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-Cd1lenii.mjs";
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
