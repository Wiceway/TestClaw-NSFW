import { n as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-CPdmUycd.mjs";
import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import "./agent-scope-_30Scclc.mjs";
import { r as countPendingDeliveryQueueEntriesReadOnly } from "./delivery-queue-sqlite--DZfRz6l.mjs";
import "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-_msceLjK.mjs";
import { r as listLegacyDeliveryQueueArtifacts } from "./delivery-queue-legacy-files-DNIBi5Wk.mjs";
//#region src/commands/doctor-outbound-delivery.ts
/** Doctor owns the retired raw queue; current delivery recovery never prepares old payloads. */
async function migrateDoctorDeliveryQueues(params) {
	const stateEnv = {
		...params.env,
		TESTCLAW_STATE_DIR: params.stateDir
	};
	if (listLegacyDeliveryQueueArtifacts(params.stateDir).length === 0 && await countPendingDeliveryQueueEntriesReadOnly([
		"outbound",
		"outbound-legacy-preparing-v1",
		"outbound-prepared-migration-v1"
	], stateEnv) === 0) return {
		changes: [],
		warnings: []
	};
	return withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy delivery queues",
		releaseLabel: "Delivery queue",
		run: async (env) => {
			const { migrateLegacyDeliveryQueues } = await import("./state-migrations.storage-Bm7VB7LD.mjs");
			const imported = await migrateLegacyDeliveryQueues({ stateDir: params.stateDir });
			if (imported.warnings.length > 0 && imported.warningDisposition !== "recoverable") return imported;
			const { loadLegacyPendingDeliveries, loadPendingLegacyDeliveryPreparations, loadPendingDeliveryMigrations } = await import("./delivery-queue-storage-Cm9T3Iks.mjs");
			const legacy = loadLegacyPendingDeliveries(params.stateDir);
			const preparations = loadPendingLegacyDeliveryPreparations(params.stateDir);
			if (legacy.length === 0 && preparations.length === 0 && loadPendingDeliveryMigrations(params.stateDir).length === 0) return imported;
			const { migrateLegacyPendingOutboundDeliveries } = await import("./delivery-queue-migration-ChHvTrbl.mjs");
			const warnings = [...imported.warnings];
			const log = {
				info: (_message) => {},
				warn: (message) => warnings.push(message),
				error: (message) => warnings.push(message)
			};
			const migration = {
				cfg: params.cfg,
				stateDir: params.stateDir,
				log
			};
			const needsRuntime = legacy.length > 0 || preparations.some((entry) => entry.legacyPreparationState === "claimed");
			let result;
			if (needsRuntime) {
				const { loadGatewayStartupPluginPlanWithMetadata } = await import("./gateway-startup-plugin-loader-CZSaswxG.mjs");
				const { acquirePluginRegistryForInspection } = await import("./plugins/loader.js");
				const { createHookRunner } = await import("./hooks-Bres9jjZ.mjs");
				const { withPluginRegistryPreparationScope } = await import("./registry-lifecycle-BVgcmaTb.mjs");
				const { withPluginRuntimeRegistryScope } = await import("./gateway-request-scope-BlR4moZE.mjs");
				const workspaceDir = tryResolveConfiguredAgentWorkspaceDir(params.cfg);
				const { plan, metadataSnapshot } = loadGatewayStartupPluginPlanWithMetadata({
					config: params.cfg,
					workspaceDir,
					env
				});
				const maintenance = getAssistantDatabaseMaintenanceScope();
				if (!maintenance) throw new Error("Outbound migration requires its maintenance resource owner");
				let inspection;
				let acquisitionFailure;
				maintenance.own({}, "agent-resources", async () => {
					if (inspection) try {
						await inspection.release();
					} catch (error) {
						if (hasRetainedPluginRuntimeCloseError(error)) throw error;
					}
					else if (hasRetainedPluginRuntimeCloseError(acquisitionFailure)) throw acquisitionFailure;
				});
				try {
					inspection = await acquirePluginRegistryForInspection({
						config: params.cfg,
						activationSourceConfig: params.cfg,
						env,
						workspaceDir,
						onlyPluginIds: [...plan.pluginIds],
						manifestRegistry: metadataSnapshot.manifestRegistry,
						discovery: metadataSnapshot.discovery,
						channelPluginLoadIntent: "full",
						runtimeSideEffects: true,
						throwOnLoadError: true
					});
				} catch (error) {
					acquisitionFailure = error;
					if (hasRetainedPluginRuntimeCloseError(error)) throw error;
					return {
						changes: imported.changes,
						warnings: [...warnings, `Legacy outbound delivery preparation deferred: ${String(error)}. Run testclaw doctor --fix after repairing the plugin.`],
						warningDisposition: "recoverable"
					};
				}
				const registry = inspection.registry;
				try {
					result = await withPluginRegistryPreparationScope(registry, () => withPluginRuntimeRegistryScope(registry, () => migrateLegacyPendingOutboundDeliveries({
						...migration,
						hookRunner: createHookRunner(registry, {
							logger: log,
							catchErrors: true
						})
					})));
				} catch (error) {
					const failures = [error];
					try {
						await inspection.release();
					} catch (releaseError) {
						failures.push(releaseError);
					}
					if (failures.length > 1) throw new AggregateError(failures, "Outbound migration and plugin disposal failed", { cause: error });
					throw error;
				}
				await inspection.release();
			} else result = await migrateLegacyPendingOutboundDeliveries(migration);
			if (result.remaining > 0) warnings.push(`${result.remaining} legacy outbound deliveries still require preparation. Run testclaw doctor --fix to retry.`);
			return {
				changes: [...imported.changes, ...result.moved > 0 ? [`Prepared ${result.moved} legacy outbound deliveries for current queue recovery`] : []],
				warnings,
				warningDisposition: "recoverable"
			};
		}
	});
}
//#endregion
export { migrateDoctorDeliveryQueues };
