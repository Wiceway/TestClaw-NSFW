import { c as normalizeProviderModelIdWithRuntime, o as normalizeModelRef } from "./model-ref-shared-_U0IEbGF.js";
import { S as allowsPluginModelNormalization, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-YvCZW05m.js";
import "./model-selection-osPTiirn.js";
//#region src/agents/command/model-ref.ts
function normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext) {
	return normalizeModelRef(provider, model, {
		...modelManifestContext,
		allowPluginNormalization: allowsPluginModelNormalization({
			cfg,
			provider,
			model
		})
	});
}
function parseAgentCommandModelRef(cfg, agentId, raw, defaultProvider, modelManifestContext) {
	const parsed = resolveModelRefFromString({
		cfg,
		agentId,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg,
			agentId,
			defaultProvider,
			...modelManifestContext,
			allowPluginNormalization: false
		}),
		...modelManifestContext,
		allowPluginNormalization: false
	})?.ref;
	if (!parsed || !allowsPluginModelNormalization({
		cfg,
		...parsed
	})) return parsed ?? null;
	return {
		provider: parsed.provider,
		model: normalizeProviderModelIdWithRuntime({
			provider: parsed.provider,
			context: {
				provider: parsed.provider,
				modelId: parsed.model
			}
		}) ?? parsed.model
	};
}
//#endregion
export { parseAgentCommandModelRef as n, normalizeAgentCommandModelRef as t };
