import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DrtuqGpN.js";
import { c as resolveChannelSchemaSelection, l as collectChannelSchemaMetadataCore, u as collectPluginSchemaMetadataCore } from "./io.snapshot-preparation-BEHQru7Z.js";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { t as buildConfigSchemaCore } from "./schema-BVCio_OL.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
	return resolveConfigWidePluginManifestRegistry({
		config,
		env: env ?? process.env
	});
}
/** Builds one config schema from an exact manifest registry. */
function buildRuntimeConfigSchemaFromRegistry(registry, config) {
	return buildConfigSchemaCore({
		plugins: collectPluginSchemaMetadataCore(registry),
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	const config = getRuntimeConfig();
	return buildRuntimeConfigSchemaFromRegistry(loadManifestRegistry(config), config);
}
async function readBestEffortRuntimeConfigSchema() {
	const snapshot = await readConfigFileSnapshot({ observe: false });
	const config = snapshot.valid ? snapshot.sourceConfig : {
		agents: { list: [{ id: "main" }] },
		plugins: { enabled: true }
	};
	const registry = loadManifestRegistry(config);
	return buildConfigSchemaCore({
		plugins: snapshot.valid ? collectPluginSchemaMetadataCore(registry) : [],
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
//#endregion
export { loadGatewayRuntimeConfigSchema as n, readBestEffortRuntimeConfigSchema as r, buildRuntimeConfigSchemaFromRegistry as t };
