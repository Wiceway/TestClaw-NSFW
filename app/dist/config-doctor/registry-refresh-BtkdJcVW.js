import { D as withPluginCache, a as createPluginCache, p as getScopedPluginCache } from "./plugin-cache-CsUjLuei.js";
import { o as isGatewayPluginMetadataSnapshotActive } from "./current-plugin-metadata-state-DoyVf_gu.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as tracePluginLifecyclePhaseAsync } from "./discovery-2wVyQ2Ni.js";
import { a as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-record-match-DU0U5gm6.js";
import { r as createManagedRuntimeEnvBase } from "./io.read-helpers-DjrAb5Uv.js";
import { r as formatConfigIssueSummary } from "./issue-format-DXdS88Yb.js";
import { t as createConfigIO } from "./io.factory-D6Qm5I9o.js";
import "./installed-plugin-index-records-NgkzYl8d.js";
import { t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-qoN9ZO1h.js";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-BDdBc3eO.js";
//#region src/plugins/registry-refresh.ts
/** Refresh inventory from the committed file, including deferred runtime changes. */
async function refreshPluginRegistryAfterConfigMutation(params) {
	const owner = params.lease;
	let authorityRefusal;
	const assertAuthority = (assert) => {
		if (authorityRefusal) throw authorityRefusal.error;
		try {
			assert();
		} catch (error) {
			authorityRefusal = { error };
			throw error;
		}
	};
	const lease = owner ? {
		...owner,
		assertOwned: () => assertAuthority(() => owner.assertOwned()),
		assertOwnedInTransaction: (database) => assertAuthority(() => owner.assertOwnedInTransaction(database))
	} : void 0;
	lease?.assertOwned();
	try {
		const scoped = getScopedPluginCache();
		const cache = params.reason === "policy-changed" && hasPluginLifecycleLease() && !isGatewayPluginMetadataSnapshotActive() && scoped?.kind === "operation" ? scoped : createPluginCache();
		await withPluginCache(cache, async () => {
			const installRecords = params.installRecords ?? await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords({
				...params.env ? { env: params.env } : {},
				...lease ? { filePath: lease.databasePath } : {}
			}), { command: params.traceCommand ?? "registry-refresh" });
			lease?.assertOwned();
			await tracePluginLifecyclePhaseAsync("registry refresh", async () => {
				const snapshot = await createConfigIO({
					configPath: params.configPath,
					env: createManagedRuntimeEnvBase(params.env),
					observe: false,
					pluginValidation: "core-only"
				}).readConfigFileSnapshot();
				lease?.assertOwned();
				if (!snapshot.valid) throw new Error(`Config invalid: ${formatConfigIssueSummary(snapshot.issues)}`);
				return refreshPluginRegistry({
					config: snapshot.runtimeConfig,
					reason: params.reason,
					installRecords,
					...params.policyPluginIds ? { policyPluginIds: params.policyPluginIds } : {},
					...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
					...params.env ? { env: params.env } : {},
					...lease ? {
						filePath: lease.databasePath,
						lease
					} : {}
				});
			}, {
				command: params.traceCommand ?? "registry-refresh",
				reason: params.reason
			});
		});
	} catch (error) {
		lease?.assertOwned();
		params.logger?.warn?.(`Plugin registry refresh failed: ${formatErrorMessage(error)}`);
	}
	lease?.assertOwned();
	if (params.invalidateRuntimeCache !== false) await invalidatePluginRuntimeDiscoveryAfterConfigMutation({
		...params,
		assertCurrent: lease ? () => lease.assertOwned() : void 0
	});
}
async function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params) {
	let clearPluginRegistryLoadCache;
	try {
		({clearPluginRegistryLoadCache} = await import("./loader-DvGnwzCF.js"));
	} catch (error) {
		params.assertCurrent?.();
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
		return;
	}
	params.assertCurrent?.();
	try {
		clearPluginRegistryLoadCache();
	} catch (error) {
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { refreshPluginRegistryAfterConfigMutation as n, invalidatePluginRuntimeDiscoveryAfterConfigMutation as t };
