import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-bPVTthUw.js";
import { a as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-record-match-DU0U5gm6.js";
import { C as NpmChannelResolutionError, k as resolveNpmInstallSpecsForUpdateChannel } from "./official-external-plugin-catalog-D5I3lq6A.js";
import { d as resolveRegistryUpdateChannel } from "./update-channels-BBbFgcw3.js";
import { t as checkMinHostVersion } from "./min-host-version-Dtz5PZuE.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { l as withCommandProcessScope } from "./exec-spawn-USR_FeKZ.js";
import { s as resolveNpmSpecMetadata } from "./install-source-utils-DHWsIfEL.js";
import "./installed-plugin-index-records-NgkzYl8d.js";
import { i as readInstalledPackageManifest } from "./package-update-utils-CT9vtHYv.js";
import { c as withOwnedManagedUpdateEnv } from "./update-command-service-env-DYcjXvvU.js";
import { t as collectConfiguredNpmPluginTargets } from "./missing-configured-plugin-install.targets-CkN9qk9x.js";
//#region src/cli/update-cli/update-command-plugin-preflight.ts
function incompatibleRequirement(metadata, targetVersion, installed = false) {
	const api = resolvePackagePluginApiRange(metadata);
	if (api.ok && api.range && !satisfiesPluginApiRange(targetVersion, api.range)) return `plugin API ${api.range}`;
	const install = isRecord(metadata) && isRecord(metadata.install) ? metadata.install : void 0;
	const host = checkMinHostVersion({
		currentVersion: targetVersion,
		minHostVersion: install?.minHostVersion,
		allowLegacyBareSemver: installed
	});
	return !host.ok && host.kind === "incompatible" ? `Assistant ${host.requirement.raw}` : void 0;
}
/** Report unavailable replacements without vetoing the core package update. */
async function preflightConfiguredNpmPluginTargets(params) {
	return await withCommandProcessScope(async () => {
		const targetVersion = params.targetVersion;
		if (!targetVersion) return [];
		return await withOwnedManagedUpdateEnv(params.env, async () => {
			const warnings = [];
			const installRecords = await loadInstalledPluginIndexInstallRecords({ env: params.env });
			const targets = await collectConfiguredNpmPluginTargets({
				...params,
				targetVersion,
				installRecords,
				channel: resolveRegistryUpdateChannel({
					configChannel: params.channel,
					currentVersion: targetVersion
				})
			});
			for (const target of targets) {
				const record = installRecords[target.pluginId];
				const manifest = record?.installPath ? readInstalledPackageManifest(record.installPath) : void 0;
				const requirement = incompatibleRequirement(manifest?.testclaw, targetVersion, true);
				if (!requirement || typeof manifest?.version !== "string") continue;
				let requiredSpec = target.spec;
				let failure;
				try {
					const selected = await resolveNpmInstallSpecsForUpdateChannel({
						...target,
						timeoutMs: params.timeoutMs
					});
					requiredSpec = selected.installSpec;
					const resolution = selected.npmResolution ? {
						ok: true,
						metadata: selected.npmResolution
					} : await resolveNpmSpecMetadata({
						spec: requiredSpec,
						timeoutMs: params.timeoutMs
					});
					if (!resolution.ok) failure = resolution.category === "metadata-env" ? `registry could not be reached: ${resolution.error}` : resolution.error;
					else {
						const candidateRequirement = incompatibleRequirement(resolution.metadata.packageAssistant, targetVersion);
						if (!candidateRequirement) continue;
						failure = `resolved plugin requires ${candidateRequirement}`;
					}
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					if (!(error instanceof NpmChannelResolutionError)) throw error;
					failure = `registry could not be reached: ${formatErrorMessage(error)}`;
				}
				warnings.push({
					pluginId: target.pluginId,
					reason: `Installed ${manifest.version} requires ${requirement}; ${requiredSpec}: ${failure}`,
					message: `Plugin "${target.pluginId}" update availability could not be confirmed; the core update can continue.`,
					guidance: []
				});
			}
			return warnings;
		});
	});
}
//#endregion
export { preflightConfiguredNpmPluginTargets as t };
