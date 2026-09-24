import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-C37uqoxY.js";
import { c as projectPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BG0XBpEU.js";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BGFdEPhx.js";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DrtuqGpN.js";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-D_D2_IUc.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { n as createPluginRuntimeLoaderLogger } from "./load-context-WcpD8aSw.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DCQ7FYwR.js";
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
