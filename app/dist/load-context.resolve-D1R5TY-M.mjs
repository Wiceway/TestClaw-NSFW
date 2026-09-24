import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-Cd3PE_mG.mjs";
import { c as projectPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BdghSFzd.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-Pav3HV_U.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DCdC43CA.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-BdcJztaZ.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { n as createPluginRuntimeLoaderLogger } from "./load-context-CEKyQMyt.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-Mga9Up7v.mjs";
//#region src/plugins/runtime/load-context.resolve.ts
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
function resolvePluginRuntimeLoadContext(options) {
	const env = options?.env ?? process.env;
	const rawConfig = options?.config ?? getRuntimeConfig();
	const rawWorkspaceDir = resolvePluginControlPlaneWorkspace({
		config: rawConfig,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const metadataSnapshot = options?.metadataSnapshot ?? (options?.manifestRegistry !== void 0 ? void 0 : options?.workspaceDir === void 0 ? projectPluginMetadataSnapshot(resolveConfigWidePluginMetadataSnapshot({
		config: rawConfig,
		env
	}), options?.onlyPluginIds) : resolvePluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: rawWorkspaceDir,
		allowWorkspaceScopedCurrent: true,
		...options?.onlyPluginIds !== void 0 ? { pluginIds: options.onlyPluginIds } : {}
	}));
	const manifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	const activationSourceConfig = resolvePluginActivationSourceConfig({
		config: rawConfig,
		activationSourceConfig: options?.activationSourceConfig
	});
	const autoEnabled = applyPluginAutoEnable({
		config: rawConfig,
		env,
		manifestRegistry,
		discovery: metadataSnapshot?.discovery
	});
	const config = autoEnabled.config;
	const workspaceDir = resolvePluginControlPlaneWorkspace({
		config,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const installRecords = metadataSnapshot ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index) : void 0;
	return {
		rawConfig,
		config,
		activationSourceConfig,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir,
		env,
		logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
		...manifestRegistry ? { manifestRegistry } : {},
		...metadataSnapshot ? { metadataSnapshot } : {},
		installRecords,
		preferBuiltPluginArtifacts: options?.preferBuiltPluginArtifacts,
		expectedSourceDigests: options?.expectedSourceDigests
	};
}
//#endregion
export { resolvePluginRuntimeLoadContext as t };
