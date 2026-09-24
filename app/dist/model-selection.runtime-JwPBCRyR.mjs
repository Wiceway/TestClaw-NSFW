import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BKb_FWeR.mjs";
import "./model-ref-shared-BJVdLDpP.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-Cir-JbRF.mjs";
import { n as resolvePluginProviderRegistryCore } from "./providers.runtime-6KetprzN.mjs";
//#region src/commands/models/model-selection.runtime.ts
/** Prepares only the provider owners needed by a model config mutation. */
function withModelCommandProviderRuntime(params, run) {
	const config = params.runtimeConfig;
	const env = process.env;
	const workspaceDir = tryResolveConfiguredAgentWorkspaceDir(config, env);
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config,
		env,
		workspaceDir
	});
	const providerRefs = /* @__PURE__ */ new Set();
	const modelRefs = /* @__PURE__ */ new Set();
	const selections = withPluginRuntimeGenerationScope({ metadataSnapshot }, params.selectModelRefs);
	for (const ref of selections) if (ref) {
		providerRefs.add(ref.provider);
		modelRefs.add(modelKey(ref.provider, ref.model));
	}
	const selected = providerRefs.size ? resolvePluginProviderRegistryCore({
		config,
		env,
		workspaceDir,
		pluginMetadataSnapshot: metadataSnapshot,
		providerRefs: [...providerRefs],
		modelRefs: [...modelRefs],
		registryScope: "exact",
		activate: false
	}) : void 0;
	return withPluginRuntimeGenerationScope({
		metadataSnapshot,
		pluginRegistry: selected?.registry
	}, run);
}
//#endregion
export { withModelCommandProviderRuntime };
