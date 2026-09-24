import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Cd3PE_mG.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-C1Oo_dIV.mjs";
import { c as createPluginInstallRecordMap, m as setPluginInstallRecordMapEntry } from "./installed-plugin-record-match-BHy1WTe7.mjs";
import { l as resolveTrustedSourceLinkedOfficialNpmSpec, s as resolveTrustedSourceLinkedOfficialClawHubSpec } from "./official-external-install-records-D7XocVyD.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-B3jp6YYf.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-Ch_lPBIJ.mjs";
import { r as runPluginPayloadSmokeCheck } from "./payload-verification-DwdZCO8d.mjs";
//#region src/plugins/active-payload-verification.ts
/** Runs the static payload check without repair, installs, or network access. */
async function runActivePluginPayloadSmokeCheck(params) {
	return await runPluginPayloadSmokeCheck({
		records: filterRecordsToActive(params),
		env: params.env
	});
}
/** Selects the installed records covered by update/startup payload verification. */
function filterRecordsToActive(params) {
	const env = params.env ?? process.env;
	const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
	const ownership = params.cfg.plugins?.load?.paths?.length ? createInstalledPluginOwnershipResolver(loadInstalledPluginIndex({
		config: params.cfg,
		installRecords: params.records,
		env
	}), env) : void 0;
	const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
		config: params.cfg,
		installRecords: params.records,
		env
	});
	const filtered = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(params.records)) {
		if (!record || typeof record !== "object") continue;
		const update = ownership?.resolveUpdate(pluginId);
		if (sourceBundledIds.has(pluginId) || update?.ok && update.value.kind === "operator-managed") continue;
		if (resolveEffectiveEnableState({
			id: pluginId,
			origin: "global",
			config: normalizedPluginConfig,
			rootConfig: params.cfg
		}).enabled) {
			setPluginInstallRecordMapEntry(filtered, pluginId, record);
			continue;
		}
		const officialNpm = resolveTrustedSourceLinkedOfficialNpmSpec({
			pluginId,
			record
		});
		const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubSpec({
			pluginId,
			record
		});
		if (officialNpm || officialClawHub) setPluginInstallRecordMapEntry(filtered, pluginId, record);
	}
	return filtered;
}
//#endregion
export { runActivePluginPayloadSmokeCheck as n, filterRecordsToActive as t };
