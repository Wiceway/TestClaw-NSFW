import { n as getPluginRegistryForContext } from "./gateway-request-scope-Cys5l4an.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-6R-akBzy.mjs";
import { i as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-7VQK4Dfr.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-qnzjJGRt.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BdghSFzd.mjs";
import { a as loadFacadeModuleAtLocationSync } from "./facade-loader-3P08DQEB.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
//#region src/plugins/runtime/runtime-web-channel-plugin.ts
function readColdPluginRecords() {
	let config;
	try {
		config = getRuntimeConfig();
	} catch {
		config = {};
	}
	return resolvePluginMetadataSnapshot({ config }).plugins;
}
/** Package-root embedding API; runtime instances and cold callers share the public-surface loader. */
async function monitorWebChannel(...args) {
	const registry = getPluginRegistryForContext();
	const matches = (registry ? registry.plugins.filter((record) => record.status === "loaded") : readColdPluginRecords()).flatMap((record) => {
		const pluginRoot = record.rootDir;
		if (!pluginRoot) return [];
		const resolve = (artifactBasename) => resolvePluginRootPublicSurfacePath({
			pluginRoot,
			pluginId: record.id,
			entrySource: record.source,
			artifactBasename
		});
		const modulePath = resolve("runtime-api.js");
		return modulePath && resolve("light-runtime-api.js") ? [{
			record,
			modulePath,
			pluginRoot
		}] : [];
	});
	if (matches.length !== 1) throw new Error(matches.length ? `plugin runtime boundary is ambiguous for entries [light-runtime-api, runtime-api]: ${matches.map(({ record }) => record.id).join(", ")}` : "web channel plugin runtime is unavailable: missing plugin that provides light-runtime-api and runtime-api");
	const { record, modulePath, pluginRoot } = matches[0];
	const owner = registry?.plugins.find((entry) => entry === record);
	const instance = owner ? getPluginInstance(owner) : void 0;
	if (owner && !instance) throw new Error(`Plugin ${owner.id} has no runtime module owner`);
	const loaded = loadFacadeModuleAtLocationSync({
		location: {
			modulePath,
			boundaryRoot: pluginRoot,
			pluginId: record.id
		},
		boundary: {
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: record.origin,
				rootDir: pluginRoot
			})
		}
	});
	return (instance?.wrap(loaded) ?? loaded).monitorWebChannel(...args);
}
//#endregion
export { monitorWebChannel };
