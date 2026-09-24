import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getGatewayPluginMetadataSnapshot, r as getCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state-CEUlVPFu.mjs";
import { n as discoverAssistantPlugins } from "./discovery-Beqghw38.mjs";
import { i as resolveInstalledPluginIndexStorePath, n as resolvePluginTrust } from "./installed-plugin-record-match-BHy1WTe7.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-BZDPDRhI.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-BwXb5Ulg.mjs";
//#region src/plugins/channel-catalog-registry.ts
function listChannelCatalogEntries(params = {}) {
	let discovery = params.discovery;
	const installRecords = params.installRecords ?? (discovery ? void 0 : resolveInstallRecords(params));
	if (!discovery) discovery = discoverAssistantPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env,
		extraPaths: params.extraPaths,
		...installRecords && Object.keys(installRecords).length > 0 ? { installRecords } : {}
	});
	return discovery.candidates.flatMap((candidate) => {
		if (params.origin && candidate.origin !== params.origin) return [];
		const channel = candidate.packageManifest?.channel;
		if (!channel?.id) return [];
		const pluginId = normalizeOptionalString(candidate.bundledManifest?.id) ?? normalizeOptionalString(candidate.bundledManifestId) ?? normalizeOptionalString(candidate.packageManifest?.plugin?.id) ?? normalizeOptionalString(candidate.idHint);
		if (!pluginId) return [];
		return [{
			pluginId,
			...installRecords && resolvePluginTrust({
				pluginId,
				candidate,
				installRecords,
				env: params.env ?? process.env,
				registryPath: resolveInstalledPluginIndexStorePath({ env: params.env })
			}).reason === "trusted-official" ? { trustedOfficialInstall: true } : {},
			origin: candidate.origin,
			packageName: candidate.packageName,
			workspaceDir: candidate.workspaceDir,
			rootDir: candidate.rootDir,
			channel,
			...candidate.packageManifest?.install ? { install: candidate.packageManifest.install } : {}
		}];
	});
}
function resolveInstallRecords(params) {
	if (params.installRecords || params.origin === "bundled") return params.installRecords;
	const snapshot = getGatewayPluginMetadataSnapshot();
	if (snapshot && getCurrentPluginMetadataSnapshotState().envFingerprint === resolvePluginMetadataEnvFingerprint(params.env)) return snapshot.index.installRecords;
	try {
		return loadInstalledPluginIndexInstallRecordsSync(params.env ? { env: params.env } : {});
	} catch {
		return;
	}
}
//#endregion
export { listChannelCatalogEntries as t };
