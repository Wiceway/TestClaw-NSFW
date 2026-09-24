import "./agent-scope-config-Dm8T0OhW.mjs";
import "./model-selection-shared-DIVgwazZ.mjs";
import "./agent-scope-_30Scclc.mjs";
import "./model-selection-config-Djxkz5Qa.mjs";
import "./provider-auth-aliases-B97WkfGj.mjs";
import "./model-auth-markers-Bml4Y1AZ.mjs";
import "./model-catalog-C8yXMb21.mjs";
import "./auth-profiles-3zYAJqiZ.mjs";
import "./model-auth-CKUa9upL.mjs";
import "./model-selection-7SY54ACM.mjs";
import { t as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-thinking-default-Dd64mhRt.mjs";
import { d as readPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-iMxpdaVw.mjs";
import "./identity-D5GWLt72.mjs";
import "./common-C3p8rD5A.mjs";
import "./embedded-agent-utils-CdSWuRNq.mjs";
import "./embedded-agent-block-chunker-DbTWI0tH.mjs";
import "./tts-lJe96pNh.mjs";
import "./identity-avatar-D1ICZmg0.mjs";
import "./agent-scope-runtime-CqxE7uYg.mjs";
import "./agent-command-T6yt8zQG.mjs";
//#region src/plugin-sdk/agent-runtime.ts
/** Preserves the public SDK's writable default while internal catalog reads stay passive. */
async function loadPreparedModelCatalog(params = {}) {
	return await readPreparedModelCatalog({
		...params,
		readOnly: params.readOnly ?? false
	});
}
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
async function loadModelCatalog(params = {}) {
	const { agentId, agentDir, cacheOnly, config, env, readOnly, refreshFullCatalog, workspaceDir } = params;
	const preparedParams = {
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...config ? { config } : {},
		...env ? { env } : {},
		...readOnly !== void 0 ? { readOnly } : {},
		...refreshFullCatalog !== void 0 ? { refreshFullCatalog } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
	if (cacheOnly) return getPreparedModelCatalogSnapshot(preparedParams)?.entries ?? [];
	return await loadPreparedModelCatalog(preparedParams);
}
function resolveThinkingDefaultWithRuntimeCatalog(params) {
	const { loadModelCatalog: loadRuntimeCatalog, ...rest } = params;
	return resolveThinkingDefaultWithRuntimeCatalogCore({
		...rest,
		loadRuntimeCatalog
	});
}
//#endregion
export { loadPreparedModelCatalog as n, resolveThinkingDefaultWithRuntimeCatalog as r, loadModelCatalog as t };
