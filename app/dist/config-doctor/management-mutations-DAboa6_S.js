import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { s as normalizePluginId } from "./config-state-D4j-tzq3.js";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-DoyVf_gu.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { N as hashStableJson } from "./discovery-2wVyQ2Ni.js";
import { s as readPersistedInstalledPluginIndexInstallRecords } from "./installed-plugin-record-match-DU0U5gm6.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-DV-j2dZ7.js";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-DYuUiFfw.js";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BGFdEPhx.js";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-ZdEHfkF8.js";
import { r as isBundledManifestOwner } from "./manifest-owner-policy-Dt6NEkjE.js";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-Cw44ic16.js";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.js";
import { t as setPluginEnabledInConfig } from "./toggle-config-eGjVPDvR.js";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-DjwcTjEX.js";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-C0vFx1Ic.js";
import { r as replaceConfigFile } from "./mutate-CFZDg_sD.js";
import "./config-CiBXBfE2.js";
import "./installed-plugin-index-records-NgkzYl8d.js";
import { o as isDefaultClawHubBaseUrl } from "./clawhub-client-B_Cd834b.js";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-qoN9ZO1h.js";
import { a as resolvePluginCapabilityConsent } from "./capability-consent-CFggQgL_.js";
import { r as selectInstallMutationWriteOptions } from "./install-config-mutation-Dku3vFY4.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-BtkdJcVW.js";
import { i as resolveManagedPluginInstallRequest } from "./install-source-plan-D511dvMe.js";
import { o as loadOfficialCatalog } from "./management-catalog-DUNRbtfo.js";
import { t as collectChangedPaths } from "./config-change-paths-DxLwgZgI.js";
import { o as reportClawHubPluginInstallTelemetry } from "./clawhub-packages-x4Df95OW.js";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-CzYV44dS.js";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-BEQvs7Po.js";
import { a as resolvePluginInstallRequestContext, n as loadConfigForInstall, t as PluginInstallConfigError } from "./install-config-BxK2YN0K.js";
import { r as capturePluginRuntimeApplications, t as PluginInstallPersistedError } from "./lifecycle-XIqTC5za.js";
import { n as readPluginRuntimeConfig, t as readPluginMutationSnapshot } from "./management-config-Bgph2T5O.js";
import { i as refreshManagedPluginMetadata, n as listManagedPlugins, r as loadFreshManagedPluginMetadata } from "./management-service-ElkYjC0H.js";
import { t as applySlotSelectionForPlugin } from "./slot-selection-Tq90Y_Bc.js";
//#region src/plugins/management-mutations.ts
function withManagedPluginMutation(params, run) {
	return withPluginLifecycleLease({
		env: params.env ?? process.env,
		signal: params.signal
	}, (lease) => {
		const beforePersistentApply = () => {
			params.signal?.throwIfAborted();
			lease.assertOwned();
			params.beforePersistentApply?.();
		};
		beforePersistentApply();
		return run(beforePersistentApply);
	});
}
function throwInstallFailure(result) {
	const unavailable = !result.code || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE || result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE;
	throw new ManagedPluginLifecycleError(result.error, {
		kind: unavailable ? "unavailable" : "invalid-request",
		code: result.code,
		version: result.version,
		warning: result.warning,
		installPolicyWarning: result.installPolicyWarning,
		installRejected: true,
		installSource: result.installSource
	});
}
/** Install a ClawHub or curated official plugin through the canonical install pipeline. */
async function installManagedPlugin(params) {
	try {
		assertConfigWriteAllowedInCurrentMode({ env: params.env });
	} catch (error) {
		throw new ManagedPluginLifecycleError(formatErrorMessage(error), { cause: error });
	}
	const { installManagedPluginSource } = await import("./management-install-BESEDX4a.js");
	const env = params.env ?? process.env;
	return await withManagedPluginMutation(params, async (beforePersistentApply) => {
		const performInstall = async () => {
			const configuredClawHubUrl = env.TESTCLAW_CLAWHUB_URL ?? env.CLAWHUB_URL;
			const officialCatalog = params.request.source === "official" || params.request.source === "clawhub" && (!configuredClawHubUrl || isDefaultClawHubBaseUrl(configuredClawHubUrl)) ? await loadOfficialCatalog() : { entries: [] };
			const warnings = [];
			const request = resolveManagedPluginInstallRequest(params.request, officialCatalog.entries);
			const planned = resolvePluginInstallRequestContext({
				source: request.source,
				rawSpec: request.source === "local" ? request.path : request.source === "npm-pack" ? `npm-pack:${request.archivePath}` : request.source === "bundled" ? request.bundledSource.localPath : request.source === "marketplace" ? request.plugin : request.spec,
				...request.source === "marketplace" ? { marketplace: request.marketplace } : {},
				installKind: "plugin"
			});
			if (!planned.ok) throw new ManagedPluginLifecycleError(planned.error);
			const snapshot = params.snapshot ?? await loadConfigForInstall(planned.request).catch((error) => {
				if (!(error instanceof PluginInstallConfigError)) throw error;
				throw new ManagedPluginLifecycleError(error.message, {
					code: PLUGIN_INSTALL_ERROR_CODE.CONFIG_MUTATION_BLOCKED,
					installRejected: true,
					...request.source === "official" && request.installSources?.[0] ? { installSource: request.installSources[0] } : {},
					cause: error
				});
			});
			beforePersistentApply();
			if (request.source === "local" && request.link) request.successMessage = `Linked plugin path: ${shortenHomePath(request.path)}`;
			if (request.source === "clawhub" && params.confirmInstall) request.confirmInstall = params.confirmInstall;
			const captured = params.applyRuntime ? capturePluginRuntimeApplications(params.applyRuntime) : void 0;
			const installed = await installManagedPluginSource({
				applyRuntime: captured?.applyRuntime,
				deferRuntime: params.deferRuntime,
				beforePersistentApply,
				request,
				snapshot,
				env,
				logger: {
					...params.logger,
					warn: (message) => {
						warnings.push(message);
						params.logger?.warn?.(message);
					}
				},
				onCapabilityConsent: params.onCapabilityConsent,
				beforePersistentEffect: params.beforePersistentEffect,
				...params.request.acknowledgeCapabilities ? { acknowledgeCapabilities: params.request.acknowledgeCapabilities } : {},
				...params.request.acknowledgeInstallPolicyWarning ? { safetyOverrides: { onInstallPolicyWarning: async () => ({ status: "approved" }) } } : params.safetyOverrides ? { safetyOverrides: params.safetyOverrides } : {},
				invalidateRuntimeCache: params.invalidateRuntimeCache ?? false,
				runtime: { log: () => {} }
			});
			if (!installed.ok) return throwInstallFailure(installed);
			try {
				warnings.push(...installed.warnings ?? []);
				if (params.request.source === "clawhub" && installed.clawhub) {
					if (!params.clawManaged && installed.clawhub.version) markClawPackageIndependentlyOwned({
						kind: "plugin",
						source: "clawhub",
						ref: installed.clawhub.clawhubPackage,
						version: installed.clawhub.version
					});
					await reportClawHubPluginInstallTelemetry({
						baseUrl: installed.clawhub.clawhubUrl,
						packageName: installed.clawhub.clawhubPackage,
						version: installed.clawhub.version
					}).catch(() => void 0);
				}
				const workspace = resolvePluginControlPlaneWorkspace({
					config: installed.config,
					env
				});
				if (workspace.diagnostic && !getProcessGatewayPluginMetadataSnapshot()) warnings.push(workspace.diagnostic.message);
				const installedMetadata = refreshManagedPluginMetadata({
					config: installed.config,
					env
				});
				const catalog = await listManagedPlugins({
					config: installed.config,
					env,
					officialCatalog,
					metadata: installedMetadata
				});
				const installedOwnership = createInstalledPluginOwnershipResolver(installedMetadata.index, env).resolvePackage(installed.pluginId);
				if (!installedOwnership.ok) throw new ManagedPluginLifecycleError(installedOwnership.error);
				const installedPluginIds = installedOwnership.value.pluginIds;
				const representativePluginId = installedPluginIds[0];
				const plugin = catalog.plugins.find((entry) => entry.id === representativePluginId);
				if (!plugin) throw new ManagedPluginLifecycleError(`installed plugin missing from refreshed registry: ${installed.pluginId}`);
				return {
					plugin,
					...captured?.application ? { application: captured.application } : {},
					...installedPluginIds.length > 1 || warnings.length > 0 ? { warnings: [...installedPluginIds.length > 1 ? [`Installed package "${installed.pluginId}" with plugin entries: ${installedPluginIds.join(", ")}.`] : [], ...new Set(warnings)] } : {}
				};
			} catch (error) {
				throw new PluginInstallPersistedError(installed.pluginId, error);
			}
		};
		return params.request.source === "clawhub" && !params.clawManaged ? await withClawPackageLifecycleLease({
			kind: "plugin",
			source: "clawhub",
			ref: params.request.packageName
		}, performInstall) : await performInstall();
	});
}
/** Commit plugin policy without requiring the management catalog's hosted projection. */
async function mutateManagedPluginEnabled(params) {
	const env = params.env ?? process.env;
	const cli = params.caller === "cli";
	const preserveAllowlist = cli || params.allowlistPolicy === "preserve";
	return await withManagedPluginMutation(params, async (beforePersistentApply) => {
		if (cli) assertConfigWriteAllowedInCurrentMode({ env });
		const snapshot = cli ? await readConfigFileSnapshotForWrite().then(({ snapshot: file, writeOptions }) => ({
			config: file.sourceConfig,
			baseHash: file.hash,
			writeOptions: selectInstallMutationWriteOptions(writeOptions)
		})) : await readPluginMutationSnapshot(env, beforePersistentApply);
		const metadata = loadFreshManagedPluginMetadata(snapshot.config, env);
		const pluginId = cli ? normalizePluginId(params.pluginId) : metadata.normalizePluginId(params.pluginId.trim());
		const installedPlugin = metadata.index.plugins.find((plugin) => plugin.pluginId === pluginId);
		if (!installedPlugin) return {
			status: "missing",
			pluginId
		};
		const resolveConsent = async () => {
			if (params.enabled && (params.applyRuntime || !installedPlugin.enabled || params.requestCapabilityConsent || params.acknowledgeCapabilities)) await resolvePluginCapabilityConsent({
				config: snapshot.config,
				env,
				pluginId,
				acknowledge: params.acknowledgeCapabilities,
				onCapabilityConsent: params.onCapabilityConsent,
				beforePersistentApply,
				metadata
			});
		};
		if (!preserveAllowlist) await resolveConsent();
		let next = snapshot.config;
		const slotWarnings = [];
		let policyPluginId = pluginId;
		if (params.enabled) {
			if (!preserveAllowlist && (next.plugins?.allow?.length ?? 0) > 0) next = ensurePluginAllowlisted(next, pluginId);
			const enableResult = enableExplicitlySelectedPluginInConfig(next, pluginId, { updateChannelConfig: false });
			if (!enableResult.enabled) return {
				status: "blocked",
				pluginId,
				reason: enableResult.reason
			};
			if (preserveAllowlist) await resolveConsent();
			next = enableResult.config;
			policyPluginId = enableResult.pluginId;
			const slotMetadata = cli && !isBundledManifestOwner(installedPlugin) ? void 0 : metadata;
			beforePersistentApply();
			const slotResult = await applySlotSelectionForPlugin(next, pluginId, slotMetadata, beforePersistentApply);
			next = slotResult.config;
			slotWarnings.push(...slotResult.warnings);
		} else next = setPluginEnabledInConfig(next, pluginId, false, { updateChannelConfig: false });
		const changedPaths = /* @__PURE__ */ new Set();
		collectChangedPaths(snapshot.config, next, "", changedPaths);
		const write = await replaceConfigFile({
			sourceConfig: next,
			baseHash: snapshot.baseHash,
			writeOptions: {
				...snapshot.writeOptions,
				assertConfigPathForWrite: () => {
					snapshot.writeOptions.assertConfigPathForWrite?.();
					beforePersistentApply();
				},
				...cli || params.applyRuntime ? { explicitSetPaths: [[
					"plugins",
					"entries",
					policyPluginId
				]] } : {},
				...params.applyRuntime ? { afterWrite: {
					mode: "none",
					reason: "plugin lifecycle applies runtime"
				} } : {}
			}
		});
		const registryWarnings = [];
		await refreshPluginRegistryAfterConfigMutation({
			configPath: write.path,
			env,
			reason: "policy-changed",
			invalidateRuntimeCache: false,
			policyPluginIds: [policyPluginId],
			logger: { warn: (message) => registryWarnings.push(message) }
		});
		return {
			write,
			policyPluginId,
			status: "committed",
			pluginId,
			config: next,
			changedPaths: [...changedPaths].filter(Boolean).toSorted(),
			warnings: cli ? [...registryWarnings, ...slotWarnings] : [...slotWarnings, ...registryWarnings]
		};
	});
}
/** Persist desired policy and project the committed candidate into the management catalog. */
async function setManagedPluginEnabled(params) {
	const env = params.env ?? process.env;
	return await withManagedPluginMutation(params, async (beforePersistentApply) => {
		const result = await mutateManagedPluginEnabled({
			...params,
			caller: "management"
		});
		if (result.status !== "committed") throw new ManagedPluginLifecycleError(result.status === "missing" ? `plugin not installed: ${params.pluginId}` : `plugin "${result.pluginId}" could not be enabled (${result.reason ?? "unknown reason"})`);
		const metadata = refreshManagedPluginMetadata({
			config: result.config,
			env
		});
		const application = await params.applyRuntime?.({
			config: result.config,
			write: result.write,
			pluginIds: [result.policyPluginId],
			reason: params.enabled ? "enable" : "disable",
			assertInvokerOwned: beforePersistentApply
		});
		const plugin = (await listManagedPlugins({
			config: result.config,
			env,
			metadata
		})).plugins.find((entry) => entry.id === result.pluginId);
		if (!plugin) throw new ManagedPluginLifecycleError(`updated plugin missing from refreshed registry: ${result.pluginId}`);
		return {
			plugin,
			changedPaths: result.changedPaths,
			...application ? { application } : {},
			...result.warnings.length > 0 ? { warnings: result.warnings } : {}
		};
	});
}
/** Reload the selected installed package through the running Gateway's lifecycle owner. */
async function reloadManagedPlugin(params) {
	const env = params.env ?? process.env;
	return await withManagedPluginMutation(params, async (beforePersistentApply) => {
		const config = await readPluginRuntimeConfig();
		const metadata = loadFreshManagedPluginMetadata(config, env);
		const targets = params.plugins;
		const hasInstallPreconditions = targets.some((target) => target.installHash !== void 0);
		const resolveTargets = () => {
			beforePersistentApply();
			const records = hasInstallPreconditions ? readPersistedInstalledPluginIndexInstallRecords({ env }) : void 0;
			const resolver = createInstalledPluginOwnershipResolver(metadata.index, env);
			return targets.map((target) => {
				const pluginId = metadata.normalizePluginId(target.pluginId.trim());
				const ownership = resolver.resolveReload(pluginId);
				if (!ownership.ok || ownership.value.kind === "orphan") throw new ManagedPluginLifecycleError(ownership.ok ? `plugin not installed: ${pluginId}` : ownership.error);
				const ownedPluginIds = ownership.value.pluginIds;
				let install;
				if (target.installHash !== void 0) {
					const owner = ownership.value.installOwner;
					if (!owner || !records?.[owner] || hashStableJson(records[owner]) !== target.installHash) throw new ManagedPluginLifecycleError(`Plugin ${pluginId} changed after the installation batch. Inspect it before reloading.`);
					install = {
						id: owner,
						hash: target.installHash
					};
				}
				const sourceDigests = target.sourceDigests ?? {};
				if (Object.keys(sourceDigests).some((id) => !ownedPluginIds.includes(id))) throw new ManagedPluginLifecycleError(`Source expectations for ${pluginId} include a different package owner`);
				return {
					pluginId,
					pluginIds: ownedPluginIds,
					sourceDigests,
					install
				};
			});
		};
		for (const pluginId of new Set(resolveTargets().flatMap((target) => target.pluginIds))) await resolvePluginCapabilityConsent({
			config,
			env,
			pluginId,
			metadata,
			acknowledge: params.acknowledgeCapabilities,
			beforePersistentApply
		});
		const resolved = resolveTargets();
		const pluginIds = [...new Set(resolved.flatMap((target) => target.pluginIds))].toSorted();
		const expected = /* @__PURE__ */ new Map();
		for (const target of resolved) for (const [id, digest] of Object.entries(target.sourceDigests)) {
			if (expected.has(id) && expected.get(id) !== digest) throw new ManagedPluginLifecycleError(`Conflicting source expectations for ${id}`);
			expected.set(id, digest);
		}
		return {
			pluginIds: resolved.map((target) => target.pluginId),
			application: await params.applyRuntime({
				config,
				pluginIds,
				reason: "reload",
				...expected.size ? { expectedSourceDigests: Object.fromEntries(expected) } : {},
				...resolved.every((target) => target.install !== void 0) ? { expectedInstallHashes: Object.fromEntries(resolved.flatMap(({ install }) => install ? [[install.id, install.hash]] : [])) } : {},
				assertInvokerOwned: beforePersistentApply
			})
		};
	});
}
/** Apply an explicit metadata refresh under the same cross-process lifecycle lease. */
async function refreshManagedPlugins(params) {
	const env = params.env ?? process.env;
	return await withManagedPluginMutation(params, async (beforePersistentApply) => {
		const config = await readPluginRuntimeConfig();
		beforePersistentApply();
		refreshManagedPluginMetadata({
			config,
			env
		});
		return { application: await params.applyRuntime({
			config,
			pluginIds: [],
			reason: "metadata",
			assertInvokerOwned: beforePersistentApply
		}) };
	});
}
//#endregion
export { setManagedPluginEnabled as a, reloadManagedPlugin as i, mutateManagedPluginEnabled as n, refreshManagedPlugins as r, installManagedPlugin as t };
