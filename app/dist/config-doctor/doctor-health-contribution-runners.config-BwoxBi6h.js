import { b as resolveIsConfigReadOnly, x as resolveIsNixMode } from "./paths-DeOFr7iP.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { d as getUpdateDoctorConfigWriteAuthority, g as runUpdateDoctorIncludeWrite, h as recordUpdateDoctorConfigWriteRefusal, p as recordUpdateDoctorConfigMigration } from "./update-doctor-result-fRe8i0lu.js";
import { t as ConfigWritePostCommitError } from "./io.write-errors-CkSUVFNQ.js";
import { p as shouldSkipLegacyUpdateDoctorConfigWrite } from "./update-phase-B3ln2lPo.js";
import { n as recordUpdateModelRetirement } from "./update-deferred-model-retirement-CahiJZ1y.js";
import { i as resolveLegacyParentVersionOverride, n as resolveDoctorMode, t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-CBSGiBEj.js";
import fs from "node:fs";
import path from "node:path";
//#region src/flows/doctor-health-contribution-runners.config.ts
/** Removes queued retired profiles after any config references have been durably repaired. */
async function runRetiredAuthProfileCleanup(ctx) {
	const retiredAuthProfileCleanupPlans = ctx.configResult.retiredAuthProfileCleanupPlans;
	if (!retiredAuthProfileCleanupPlans?.length) return;
	const { removeAuthProfilesAcrossOwnerStores } = await import("./auth-profiles-TP6SVtjs.js");
	for (const plan of retiredAuthProfileCleanupPlans) if (!await removeAuthProfilesAcrossOwnerStores({
		...plan,
		cfg: ctx.cfg
	})) throw new Error(`Failed to remove retired auth profile "${plan.profileIds.join(", ")}".`);
	delete ctx.configResult.retiredAuthProfileCleanupPlans;
}
/** Returns false when persistence was refused or skipped, without authorizing dependent work. */
async function runWriteConfigHealth(ctx, options = {}) {
	if (ctx.configWriteError) throw ctx.configWriteError;
	if (ctx.configWriteRefusal) return false;
	const { applyWizardMetadata } = await import("./onboard-helpers-Bfj0vknI.js");
	const { ConfigMutationConflictError, readConfigFileSnapshot, transformConfigFile } = await import("./config-fCohulPn.js");
	const { collectChangedConfigPaths } = await import("./include-write-boundary-C-jY_LBK.js");
	const { hashConfigRaw } = await import("./io.read-helpers-BnmjcW-D.js");
	const { resolveConfigIncludeWriteBoundary } = await import("./mutate-BwKRVPH-.js");
	const { isDeepStrictEqual } = await import("node:util");
	const { getDeferredPluginMigrationConfigFacts, preserveDeferredPluginMigrationConfig } = await import("./deferred-plugin-migration-config-CYUcAL8V.js");
	const { createSubsystemLogger } = await import("./subsystem-DPQ0u-Ok.js");
	const { recordDoctorHealthWarnings } = await import("./doctor-health-contribution-DJAs8g6T.js");
	const { logConfigUpdated } = await import("./logging-wOZBH0iK.js");
	const { shortenHomePath } = await import("./utils-DJOF0N_1.js");
	const configResultWritePending = ctx.configResult.shouldWriteConfig === true && ctx.configResultWriteCommitted !== true;
	if (configResultWritePending || JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence)) {
		const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
		const { restoreDoctorConfigEnvRefs } = await import("./config-flow-steps-BGGzQ7o8.js");
		const { prepareCanonicalRosterBeforePluginInclude } = await import("./roster-include-write-DbsIcfL-.js");
		const rosterSnapshot = configResultWritePending && ctx.configResult.persistCanonicalAgentRoster && ctx.configResult.referenceSource?.installedPluginIdRecovery?.size ? await readConfigFileSnapshot({
			observe: false,
			skipPluginValidation: true
		}) : void 0;
		const rosterCandidate = rosterSnapshot ? prepareCanonicalRosterBeforePluginInclude({
			snapshot: rosterSnapshot,
			nextConfig: restoreDoctorConfigEnvRefs(ctx.cfg, ctx.configResult.referenceSource, ctx.configResult.explicitSetPaths),
			persistCanonicalAgentRoster: true,
			installedPluginIdRecovery: ctx.configResult.referenceSource?.installedPluginIdRecovery,
			explicitSetPaths: ctx.configResult.explicitSetPaths
		}) : void 0;
		if (rosterCandidate) ctx.configResult.skipWizardMetadataForIncludeWrite = true;
		if (ctx.configResult.skipWizardMetadataForIncludeWrite !== true) ctx.cfg = applyWizardMetadata(ctx.cfg, {
			command: "doctor",
			mode: resolveDoctorMode(ctx.cfg)
		});
		if (shouldSkipLegacyUpdateDoctorConfigWrite(ctx.env ?? process.env)) {
			ctx.runtime.log("Skipping doctor config write during legacy update handoff.");
			return false;
		}
		const legacyParentVersionOverride = resolveLegacyParentVersionOverride(ctx).lastTouchedVersionOverride;
		const { assertShippedPluginInstallConfigImportCurrent } = await import("./plugin-registry-migration-Bbo-pgXn.js");
		const { assertInstalledPluginIdRecoveryCurrent } = await import("./installed-plugin-id-recovery-DBO6ww4G.js");
		const installedPluginIdRecovery = ctx.configResult.referenceSource?.installedPluginIdRecovery;
		let committed;
		let rosterWriteCommitted = false;
		try {
			if (rosterCandidate && rosterSnapshot) {
				const rosterContext = {
					...ctx,
					cfg: rosterCandidate,
					cfgForPersistence: rosterSnapshot.sourceConfig,
					configResultWriteCommitted: false,
					configResult: {
						cfg: rosterCandidate,
						shouldWriteConfig: true,
						confirmedConfigSource: ctx.configResult.confirmedConfigSource,
						referenceSource: ctx.configResult.referenceSource,
						pluginInstallConfigImport: ctx.configResult.pluginInstallConfigImport,
						persistCanonicalAgentRoster: true,
						skipWizardMetadataForIncludeWrite: true,
						skipPluginValidationOnWrite: true,
						preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
						explicitSetPaths: ctx.configResult.explicitSetPaths?.filter(([key]) => key === "agents")
					}
				};
				try {
					if (!await runWriteConfigHealth(rosterContext, { runPostWriteRepairs: false })) {
						ctx.configWriteRefusal = rosterContext.configWriteRefusal;
						return false;
					}
				} finally {
					if (rosterContext.configWriteError) ctx.configWriteError = rosterContext.configWriteError;
					if (rosterContext.configResultWriteCommitted) {
						ctx.configResult.confirmedConfigSource = rosterContext.configResult.confirmedConfigSource;
						ctx.cfgForPersistence = rosterContext.cfgForPersistence;
						delete ctx.configResult.persistCanonicalAgentRoster;
						rosterWriteCommitted = true;
					}
				}
				const message = "Saved the canonical agent roster; include-owned plugin repairs remain pending.";
				recordUpdateDoctorConfigMigration(message);
				ctx.runtime.log(message);
				const savedRoster = await readConfigFileSnapshot({
					observe: false,
					skipPluginValidation: true
				});
				if (savedRoster.path !== ctx.configResult.confirmedConfigSource?.path || savedRoster.hash !== ctx.configResult.confirmedConfigSource?.hash) throw new ConfigMutationConflictError("config changed after Doctor saved its roster", { retryable: false });
				const { cloneConfigWithResolutionFacts } = await import("./resolution-facts-BwQTtlj7.js");
				const pendingPlugins = ctx.cfg.plugins;
				ctx.cfg = cloneConfigWithResolutionFacts(savedRoster.sourceConfig);
				ctx.cfg.plugins = pendingPlugins;
			}
			const confirmedConfigSource = ctx.configResult.confirmedConfigSource;
			if (!confirmedConfigSource?.hash) throw new ConfigMutationConflictError("Doctor config write has no source revision", { retryable: false });
			const { path, hash } = confirmedConfigSource;
			const nextConfig = restoreDoctorConfigEnvRefs(ctx.cfg, ctx.configResult.referenceSource, ctx.configResult.explicitSetPaths);
			const authority = getUpdateDoctorConfigWriteAuthority(ctx.configPath);
			const includeSnapshot = authority ? await readConfigFileSnapshot({
				skipPluginValidation: updateDoctorRun,
				observe: false
			}) : void 0;
			const includeBoundary = includeSnapshot && resolveConfigIncludeWriteBoundary({
				snapshot: includeSnapshot,
				nextConfig,
				persistCanonicalAgentRoster: configResultWritePending ? ctx.configResult.persistCanonicalAgentRoster : void 0,
				explicitSetPaths: ctx.configResult.explicitSetPaths
			});
			const includeWrite = includeBoundary ? includeSnapshot : void 0;
			let recoveryConfig = ctx.cfg;
			const persistConfig = (assertOwned) => transformConfigFile({
				baseHash: hash,
				transform: async (_current, { snapshot }) => {
					assertOwned?.();
					authority?.assertCurrent();
					assertShippedPluginInstallConfigImportCurrent(snapshot, ctx.configResult.pluginInstallConfigImport);
					recoveryConfig = snapshot.sourceConfig;
					await assertInstalledPluginIdRecoveryCurrent(recoveryConfig, installedPluginIdRecovery, ctx.env ?? process.env);
					authority?.assertCurrent();
					assertOwned?.();
					if (includeBoundary) {
						const currentBoundary = resolveConfigIncludeWriteBoundary({
							snapshot,
							nextConfig,
							persistCanonicalAgentRoster: configResultWritePending ? ctx.configResult.persistCanonicalAgentRoster : void 0,
							explicitSetPaths: ctx.configResult.explicitSetPaths
						});
						if (!isDeepStrictEqual(currentBoundary, includeBoundary)) throw new ConfigMutationConflictError("included config changed after Doctor prepared its repairs", { retryable: false });
					}
					return { nextConfig };
				},
				afterWrite: { mode: "auto" },
				writeOptions: {
					assertCurrent: () => {
						authority?.assertCurrent();
						assertOwned?.();
					},
					...installedPluginIdRecovery?.size ? { beforeCommit: async () => {
						authority?.assertCurrent();
						assertOwned?.();
						await assertInstalledPluginIdRecoveryCurrent(recoveryConfig, installedPluginIdRecovery, ctx.env ?? process.env);
						authority?.assertCurrent();
						assertOwned?.();
					} } : {},
					expectedConfigPath: path,
					auditOrigin: "doctor",
					allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
					skipPluginValidation: ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
					...ctx.configResult.explicitSetPaths ? { explicitSetPaths: ctx.configResult.explicitSetPaths } : {},
					persistCanonicalAgentRoster: configResultWritePending ? ctx.configResult.persistCanonicalAgentRoster : void 0,
					preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
					...legacyParentVersionOverride ? { lastTouchedVersionOverride: legacyParentVersionOverride } : {}
				}
			});
			const writeConfig = async () => {
				if (!installedPluginIdRecovery?.size) return await persistConfig();
				const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-BgfYl99h.js");
				return await withPluginLifecycleLease({
					env: ctx.env ?? process.env,
					assertCurrent: () => authority?.assertCurrent()
				}, (lease) => persistConfig(() => lease.assertOwned()));
			};
			if (includeWrite) {
				const keys = [...new Set(collectChangedConfigPaths(includeWrite.sourceConfig, ctx.cfg).paths.flatMap(([key]) => key === void 0 ? [] : [key]))].toSorted();
				committed = await runUpdateDoctorIncludeWrite(includeWrite.path, hashConfigRaw(includeWrite.raw), async () => {
					const warning = `Doctor include-owned keys ${keys.join(", ")}: promotion unavailable for include-owned configuration.`;
					recordDoctorHealthWarnings(ctx, [], [warning]);
					createSubsystemLogger("update").warn(warning);
					ctx.runtime.log(warning);
					return await writeConfig();
				});
			} else committed = await writeConfig();
		} catch (error) {
			if (error instanceof ConfigWritePostCommitError) {
				ctx.configWriteError = error;
				if (error.publication === "partial") delete ctx.configResult.confirmedConfigSource;
				throw error;
			}
			recordUpdateDoctorConfigWriteRefusal({
				reason: "config-write-refused",
				message: formatErrorMessage(error),
				keys: []
			});
			if (error instanceof ConfigMutationConflictError) {
				const { note } = await import("./note-Cda30Hq-.js");
				note(["The config changed after Doctor prepared these repairs.", rosterWriteCommitted ? "The canonical roster was saved; the remaining fixes were not written. Rerun \"testclaw doctor\" to review the current config." : "These config fixes were not written. Rerun \"testclaw doctor\" to review repairs for the current config."].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "config-conflict";
				return false;
			}
			const { isConfigIncludeOwnershipError, isConfigValidationFailedError } = await import("./io.write-errors-zL_kzdUZ.js");
			const unpersistedLine = ctx.configResultWriteCommitted === true || rosterWriteCommitted ? "Earlier config fixes were already saved; the remaining changes were not written." : "No config changes were written.";
			if (isConfigIncludeOwnershipError(error)) {
				const { note } = await import("./note-Cda30Hq-.js");
				const targets = error.includeTargets ?? [];
				const includedFile = targets.length === 0 ? "its included file" : `the included ${targets.length === 1 ? "file" : "files"} ${targets.join(", ")}`;
				note([`Doctor could not apply config fixes: ${error.message}`, `${unpersistedLine} Repair ${error.ownedConfigPath} in ${includedFile} by hand, then rerun "testclaw doctor --fix" for the remaining changes.`].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "include-ownership";
				return false;
			}
			if (isConfigValidationFailedError(error)) {
				const { note } = await import("./note-Cda30Hq-.js");
				const { formatConfigIssueLines } = await import("./issue-format-okewmkFG.js");
				note([
					"Doctor could not apply config fixes: the repaired config still fails validation.",
					...Array.isArray(error.issues) ? formatConfigIssueLines(error.issues, "-", { normalizeRoot: true }) : [error.message],
					`${unpersistedLine} Fix the value(s) above in ${shortenHomePath(ctx.configPath)} by hand, then rerun "testclaw doctor --fix".`
				].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "validation";
				return false;
			}
			const { isCronOwnerWriteRefusalError } = await import("./io.cron-owner-refusal-C2aCWi0L.js");
			if (!isCronOwnerWriteRefusalError(error)) throw error;
			const { note } = await import("./note-Cda30Hq-.js");
			note([
				error.message,
				rosterWriteCommitted ? "The canonical roster was saved; the remaining config repairs were not written." : "Doctor left the config unchanged, preserving any retained legacy owner for a later repair.",
				"Resolve the reported Gateway or cron-store condition, then rerun \"testclaw doctor --fix\"."
			].join("\n"), "Doctor warnings");
			ctx.configWriteRefusal = "cron-owner-safety";
			return false;
		}
		ctx.configResult.confirmedConfigSource = {
			path: committed.path,
			hash: committed.persistedHash
		};
		const pendingChangePanels = ctx.configResult.pendingChangePanels;
		if (pendingChangePanels?.length) {
			const { note } = await import("./note-Cda30Hq-.js");
			for (const panel of pendingChangePanels) {
				note(panel, "Doctor changes");
				for (const message of panel.split("\n")) recordUpdateDoctorConfigMigration(message);
			}
			delete ctx.configResult.pendingChangePanels;
		}
		ctx.cfgForPersistence = structuredClone(preserveDeferredPluginMigrationConfig({
			sourceConfig: committed.nextConfig,
			nextConfig: ctx.cfg,
			pending: getDeferredPluginMigrationConfigFacts(committed.nextConfig) ?? []
		}));
		if (ctx.configResult.shouldWriteConfig === true) ctx.configResultWriteCommitted = true;
		logConfigUpdated(ctx.runtime);
		const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
		if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath)) ctx.runtime.log(`Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`);
	}
	if (ctx.configResult.modelRetirementRepairRan === true) {
		recordUpdateModelRetirement("completed", ctx.env ?? process.env);
		delete ctx.configResult.modelRetirementRepairRan;
	}
	const billingWarnings = ctx.configResult.modelBillingRouteWarnings;
	if (billingWarnings?.length) {
		const { note } = await import("./note-Cda30Hq-.js");
		const log = createSubsystemLogger("doctor");
		note(billingWarnings.join("\n"), "Billing route changes");
		for (const warning of billingWarnings) log.warn(warning);
		recordDoctorHealthWarnings(ctx, [], billingWarnings);
		delete ctx.configResult.modelBillingRouteWarnings;
	}
	if (options.runPostWriteRepairs === false) return true;
	await runRetiredAuthProfileCleanup(ctx);
	if (ctx.configResult.retiredPhoneControlStateCleanupPending === true) {
		const { finalizeRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-BOpNm86L.js");
		const { note } = await import("./note-Cda30Hq-.js");
		const cleanup = await finalizeRetiredPhoneControlCleanup({ env: ctx.env ?? process.env });
		if (cleanup.changes.length > 0) note(cleanup.changes.join("\n"), "Doctor changes");
		if (cleanup.warnings.length > 0) note(cleanup.warnings.join("\n"), "Doctor warnings");
	}
	if (!ctx.prompter.shouldRepair && !ctx.configResult.openAICodexAuthProfileIdMap?.size && ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite !== true || ctx.postConfigWriteRepairsCommitted === true) return true;
	const { repairCronCodexModelRefsAfterConfigWrite } = await import("./legacy-repair-BGTWx1z8.js");
	const result = await repairCronCodexModelRefsAfterConfigWrite({
		cfg: ctx.cfg,
		migrateCodexModelRefs: ctx.prompter.shouldRepair || ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite === true,
		...ctx.configResult.retiredModelRefConfig ? { retiredModelRefConfig: ctx.configResult.retiredModelRefConfig } : {},
		repairRetiredModelRefs: ctx.prompter.shouldRepair,
		authProfileIdMap: ctx.configResult.openAICodexAuthProfileIdMap,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {}
	});
	ctx.postConfigWriteRepairsCommitted = true;
	const { note } = await import("./note-Cda30Hq-.js");
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
	return true;
}
/** Commits the finalized config-flow candidate before fallible health diagnostics start. */
async function runInitialConfigWriteHealth(ctx) {
	if (ctx.configResult.shouldWriteConfig !== true && !ctx.configResult.modelBillingRouteWarnings?.length && ctx.configResult.modelRetirementRepairRan !== true) return;
	await runWriteConfigHealth(ctx, { runPostWriteRepairs: false });
}
async function collectWriteConfigHealthFindings(ctx) {
	const findings = [];
	const configPath = ctx.configPath;
	const isNixMode = resolveIsNixMode(process.env);
	if (resolveIsConfigReadOnly(process.env)) findings.push({
		checkId: "core/doctor/write-config",
		severity: "warning",
		message: isNixMode ? "Doctor config writes are disabled because Assistant is running in Nix mode." : "Doctor config writes are disabled because config is externally managed.",
		...configPath ? { path: configPath } : {},
		requirement: "mutable-config-write-path",
		fixHint: isNixMode ? "Edit the Nix source for this install and rebuild; do not run doctor --fix against this config file." : "Edit the config in your external deployment source and redeploy; do not run doctor --fix against this config file."
	});
	if (!configPath) return findings;
	const configDirectory = path.dirname(configPath);
	const configPathExists = fs.existsSync(configPath);
	const existingParent = configPathExists ? configDirectory : findNearestExistingParent(configDirectory);
	if (!isDirectoryPath(existingParent)) {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: "Doctor cannot create the config directory because a path component is a file.",
			path: existingParent,
			target: configDirectory,
			requirement: "config-directory-path",
			fixHint: "Move the file blocking the config directory path before running doctor --fix."
		});
		return findings;
	}
	try {
		fs.accessSync(existingParent, fs.constants.W_OK | fs.constants.X_OK);
	} catch {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: configPathExists ? "Doctor cannot write config because the config directory is not writable." : "Doctor cannot create the config directory because the nearest existing parent is not writable.",
			path: existingParent,
			target: configPathExists ? configPath : configDirectory,
			requirement: "writable-config-directory",
			fixHint: "Make the existing config directory or parent directory writable before running doctor --fix."
		});
	}
	return findings;
}
function findNearestExistingParent(path$1) {
	let candidate = path$1;
	while (!pathEntryExists(candidate)) {
		const parent = path.dirname(candidate);
		if (parent === candidate) return candidate;
		candidate = parent;
	}
	return candidate;
}
function pathEntryExists(path) {
	if (fs.existsSync(path)) return true;
	try {
		fs.lstatSync(path);
		return true;
	} catch {
		return false;
	}
}
function isDirectoryPath(path) {
	try {
		return fs.statSync(path).isDirectory();
	} catch {
		return false;
	}
}
async function runFinalConfigValidationHealth(ctx) {
	const { readConfigFileSnapshot } = await import("./config-fCohulPn.js");
	const finalSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: isUpdateDoctorRun(ctx.env ?? process.env),
		preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys
	});
	if (finalSnapshot.exists && !finalSnapshot.valid) {
		ctx.runtime.error("Invalid config:");
		for (const issue of finalSnapshot.issues) ctx.runtime.error(`- ${issue.path || "<root>"}: ${issue.message}`);
	}
}
//#endregion
export { runWriteConfigHealth as a, runRetiredAuthProfileCleanup as i, runFinalConfigValidationHealth as n, runInitialConfigWriteHealth as r, collectWriteConfigHealthFindings as t };
