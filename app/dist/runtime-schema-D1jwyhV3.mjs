import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DCdC43CA.mjs";
import { c as resolveChannelSchemaSelection, l as collectChannelSchemaMetadataCore, u as collectPluginSchemaMetadataCore } from "./io.snapshot-preparation-CMr7aQeD.mjs";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { t as buildConfigSchemaCore } from "./schema-BNuqdB8f.mjs";
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
