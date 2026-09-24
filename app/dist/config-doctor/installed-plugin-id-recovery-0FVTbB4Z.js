import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-CsUjLuei.js";
import { o as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-record-match-DU0U5gm6.js";
import { g as resolveOfficialExternalPluginLegacyIds, i as getOfficialExternalPluginCatalogEntryForPackage, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-D5I3lq6A.js";
import { s as resolvePluginManifestInstallOwner } from "./manifest-registry-ChktiWq4.js";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-BnrTQGU1.js";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DrtuqGpN.js";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-DVpsClIV.js";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.js";
import { t as _usingCtx } from "./usingCtx-E-VWE-jt.js";
import "./installed-plugin-index-records-NgkzYl8d.js";
import { o as migratePluginConfigId } from "./update-config-BrTt1cKp.js";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/installed-plugin-id-recovery.ts
async function resolveInstalledPluginIdOwners(config, env) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		return withPluginCache(cache, () => {
			const records = loadInstalledPluginIndexInstallRecordsSync({ env });
			const snapshot = resolveConfigWidePluginMetadataSnapshot({
				config,
				env,
				allowCurrent: false,
				installRecords: records
			});
			const claimants = /* @__PURE__ */ new Map();
			for (const plugin of snapshot.plugins) for (const legacyId of new Set(plugin.legacyPluginIds ?? [])) {
				const owners = claimants.get(legacyId);
				if (owners) owners.push(plugin);
				else claimants.set(legacyId, [plugin]);
			}
			const eligibleOwners = /* @__PURE__ */ new Map();
			for (const [legacyId, owners] of claimants) {
				const plugin = owners[0];
				if (owners.length !== 1 || !plugin || snapshot.byPluginId.has(legacyId) || Object.hasOwn(records, legacyId) || snapshot.diagnostics.some((diagnostic) => diagnostic.level === "error" || diagnostic.pluginId === legacyId || diagnostic.pluginId === plugin.id)) continue;
				const record = records[plugin.id];
				const installed = snapshot.index.plugins.find((entry) => entry.pluginId === plugin.id && entry.manifestPath === plugin.manifestPath);
				const official = plugin.packageName ? getOfficialExternalPluginCatalogEntryForPackage(plugin.packageName) : void 0;
				if (!record || !installed || plugin.trustedOfficialInstall !== true || resolvePluginManifestInstallOwner(plugin) !== plugin.id || !official || resolveOfficialExternalPluginId(official) !== plugin.id || !resolveOfficialExternalPluginLegacyIds(official).includes(legacyId)) continue;
				eligibleOwners.set(legacyId, {
					pluginId: plugin.id,
					rootDir: installed.rootDir,
					manifestHash: installed.manifestHash,
					packageHash: installed.packageJson?.hash,
					record: structuredClone(record)
				});
			}
			const candidateOwners = /* @__PURE__ */ new Map();
			for (const [legacyId, owners] of claimants) {
				const owner = owners[0];
				if (owner) candidateOwners.set(legacyId, owner.id);
			}
			for (const pluginId of Object.keys(records)) {
				const official = getOfficialExternalPluginCatalogEntry(pluginId);
				if (official && resolveOfficialExternalPluginId(official) === pluginId) {
					for (const legacyId of resolveOfficialExternalPluginLegacyIds(official)) if (!candidateOwners.has(legacyId)) candidateOwners.set(legacyId, pluginId);
				}
			}
			return {
				eligibleOwners,
				candidateOwners
			};
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Recover after install publication even when a previous config write lost its transient receipt. */
async function recoverInstalledPluginConfigIds(config, env, repair) {
	const { eligibleOwners, candidateOwners } = await resolveInstalledPluginIdOwners(config, env);
	const recovery = new Map(repair?.previousRecovery);
	for (const [legacyId, previous] of recovery) {
		const current = eligibleOwners.get(legacyId);
		if (current && repair?.repairedPluginIds.includes(previous.pluginId) && current.pluginId === previous.pluginId && current.rootDir === previous.rootDir && isDeepStrictEqual(current.record, repair.records[current.pluginId])) recovery.set(legacyId, current);
	}
	const changes = [];
	let nextConfig = config;
	for (const [legacyId, owner] of eligibleOwners) {
		const migrated = migratePluginConfigId(nextConfig, legacyId, owner.pluginId);
		if (migrated !== nextConfig) {
			recovery.set(legacyId, owner);
			changes.push(`Moved installed plugin config "${legacyId}" to "${owner.pluginId}".`);
			setDeferredPluginMigrationConfigFacts(migrated, getDeferredPluginMigrationConfigFacts(nextConfig));
			nextConfig = migrated;
		}
	}
	return {
		config: nextConfig,
		changes,
		notices: [...candidateOwners].flatMap(([legacyId, pluginId]) => !eligibleOwners.has(legacyId) && migratePluginConfigId(config, legacyId, pluginId) !== config ? [`Kept plugin config "${legacyId}": the installed replacement owner is not unambiguous. Resolve plugin discovery or install-record conflicts, then rerun Doctor.`] : []),
		recovery,
		preservePluginIds: [...candidateOwners.keys()]
	};
}
/** Called under the existing plugin lifecycle lease before the config writer publishes. */
async function assertInstalledPluginIdRecoveryCurrent(config, recovery, env) {
	if (!recovery?.size) return;
	const current = await resolveInstalledPluginIdOwners(config, env);
	for (const [legacyId, owner] of recovery) if (!isDeepStrictEqual(current.eligibleOwners.get(legacyId), owner)) throw new ConfigMutationConflictError(`Plugin ownership changed after Doctor prepared "${legacyId}" config recovery; rerun Doctor.`, { retryable: false });
}
//#endregion
export { recoverInstalledPluginConfigIds as n, assertInstalledPluginIdRecoveryCurrent as t };
