import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CuzkxMsN.mjs";
import { i as buildModelAliasIndex } from "./model-selection-shared-DIVgwazZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Djxkz5Qa.mjs";
import "./model-selection-7SY54ACM.mjs";
//#region src/auto-reply/reply/directive-handling.defaults.ts
/** Resolve default provider/model plus alias index for directive parsing. */
function resolveDefaultModel(params) {
	const manifestPlugins = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	});
	const mainModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins
	});
	const defaultProvider = mainModel.provider;
	return {
		defaultProvider,
		defaultModel: mainModel.model,
		aliasIndex: buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider,
			agentId: params.agentId,
			manifestPlugins
		})
	};
}
//#endregion
export { resolveDefaultModel as t };
