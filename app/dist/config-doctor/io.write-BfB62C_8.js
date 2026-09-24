import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-C77De4yf.js";
import "./env-BrSJw7bv.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as isVerbose } from "./global-state-BAD7XgmL.js";
import { n as cloneEnvWithPlatformSemantics, s as createConfigRuntimeEnvBase } from "./config-env-vars-CGWZEj0Z.js";
import { A as resolveConfigSizeBaselineBytes, E as assertBaseSnapshotStillCurrent, F as stampConfigVersion, G as setBoundedConfigIoWarningEntry, I as tightenStateDirPermissionsIfNeeded, L as captureConfigWriteLockGuard, M as resolveConfigWriteBlockingReasons, N as resolveConfigWriteSuspiciousReasons, O as createGuardedConfigFileSystem, P as rollbackConfigFileWriteIfUnchanged, U as loggedConfigWarningFingerprints, V as recordConfigWriteMetadata, _ as warnIfJSON5CommentsWillBeStripped, j as resolveConfigStatMetadata, k as formatConfigArtifactTimestamp, l as logConfigWarningsOnce, t as hashConfigRevision } from "./io.snapshot-Dbj6l_ZW.js";
import { r as resolveKeyedAgentEntryIncludePreservation } from "./include-write-boundary-BQFqvtDj.js";
import { h as setConfigResolutionFacts } from "./resolution-facts-BNNyTRcj.js";
import { _ as preflightRuntimeSnapshotWrite } from "./runtime-snapshot-DTssNCAN.js";
import { l as withDeferredPluginMigrationsCurrent, o as readDeferredPluginMigrations } from "./deferred-plugin-migrations-DGeuNy95.js";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, o as setDeferredPluginMigrationConfigFacts, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-DVpsClIV.js";
import { _ as fingerprintConfigSnapshotAuthoredConfig, b as restoreConfigSnapshotAuditRecord, d as formatConfigOverwriteLogMessage, g as configSnapshotAuditRecordMatchesPath, i as appendConfigAuditRecord, l as createConfigWriteAuditRecordBase, o as capConfigAuditIssues, s as capConfigAuditPaths, u as finalizeConfigWriteAuditRecord, x as upsertConfigSnapshotAuditRecord, y as readLatestConfigSnapshotAuditRecord } from "./io.audit-OUHRrOvm.js";
import { a as hashConfigRaw, g as restoreAuthoredTildePathsForWrite, i as hasConfigMeta, m as resolveGatewayMode, n as containsConfigIncludeDirective, u as resolveConfigForRead } from "./io.read-helpers-DjrAb5Uv.js";
import { a as assertUpdateDoctorConfigInputHash, d as getUpdateDoctorConfigWriteAuthority, m as recordUpdateDoctorConfigWrite } from "./update-doctor-result-fRe8i0lu.js";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-Cw44ic16.js";
import { t as _usingCtx } from "./usingCtx-E-VWE-jt.js";
import { n as formatConfigIssueLines } from "./issue-format-DXdS88Yb.js";
import { a as validateConfigObjectRawWithPlugins } from "./io.snapshot-preparation-BEHQru7Z.js";
import { r as initializeNativeSessionCatalogPreferences } from "./native-session-catalog-config-CsOxp30J.js";
import { n as configWriteCommittedSnapshot, r as configWritePostCommitRollback, t as ConfigRuntimeRefreshError } from "./io.types-D9NyeYCQ.js";
import { r as createConfigValidationFailedError, t as ConfigWritePostCommitError } from "./io.write-errors-CkSUVFNQ.js";
import { a as resolvePersistCandidateForWrite } from "./io.write-prepare-CjIh0DG0.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-BV0Bgea0.js";
import { n as prepareConfigFileWrite } from "./backup-rotation-D2ENKycw.js";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-EH2IOawF.js";
import { b as resolveCronJobsStorePathFromConfig } from "./store-DmG8kbi1.js";
import { t as collectChangedPaths } from "./config-change-paths-DxLwgZgI.js";
import { t as prepareConfigWriteTopology } from "./io.write-topology-DYDyluP7.js";
import { n as prepareCronOwnerWriteRefusal } from "./io.cron-owner-refusal-C92zNSZa.js";
import path from "node:path";
//#region src/config/io.write.ts
async function writeConfigFileFromContext(context, cfg, writeOptions, readSnapshot) {
	const { deps, configPath } = context;
	let options = writeOptions;
	const sourceGuard = captureConfigWriteLockGuard(configPath);
	const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
	if (sourceGuard) {
		const original = options;
		options = {
			...options,
			assertConfigPathForWrite: () => {
				sourceGuard();
				original.assertConfigPathForWrite?.();
			},
			beforeCommit: async () => {
				await original.beforeCommit?.();
				sourceGuard();
			}
		};
	}
	options.assertConfigPathForWrite?.();
	assertConfigWriteAllowedInCurrentMode({
		configPath,
		env: deps.env
	});
	const unsetPaths = resolveManagedUnsetPathsForWrite(options.unsetPaths);
	const snapshotRead = options.baseSnapshot ? {
		snapshot: options.baseSnapshot,
		pluginMetadataSnapshot: options.basePluginMetadataSnapshot
	} : await readSnapshot();
	const snapshot = snapshotRead.snapshot;
	const deferredPluginMigrations = readDeferredPluginMigrations({ env: deps.env });
	const configForWrite = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: cfg,
		pending: deferredPluginMigrations,
		writeOptions: options
	});
	if (doctorAuthority) {
		sourceGuard?.();
		assertUpdateDoctorConfigInputHash(configPath, hashConfigRaw(snapshot.raw));
		options = {
			...options,
			baseSnapshot: snapshot
		};
	}
	if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
	const { nextConfig, clearedSessionStoreOwner, authoredConfig, authoredSourceConfig, authoredRuntimeConfig, explicitSetPaths, explicitSetValueSource, persistCanonicalAgentRoster, preserveLegacyAgentRoster, cronOwner } = prepareConfigWriteTopology({
		...snapshotRead,
		nextConfig: configForWrite,
		options,
		unsetPaths,
		env: deps.env,
		lowerPrecedenceEnv: deps.lowerPrecedenceEnv,
		homedir: deps.homedir
	});
	const inputBasis = {
		kind: options.inputBase ?? "runtime",
		config: options.inputBase === "source" ? authoredSourceConfig : authoredRuntimeConfig
	};
	const cronOwnerRefusal = cronOwner ? await prepareCronOwnerWriteRefusal(snapshot.config, {
		storePath: resolveCronJobsStorePathFromConfig(nextConfig, deps.env),
		...cronOwner,
		env: deps.env
	}) : void 0;
	let persistCandidate = authoredConfig;
	const changedPaths = /* @__PURE__ */ new Set();
	collectChangedPaths(inputBasis.config, authoredConfig, "", changedPaths);
	for (const changedPath of [...explicitSetPaths, ...options.unsetPaths ?? []]) {
		const normalizedPath = changedPath.filter((segment) => segment.length > 0).join(".");
		if (normalizedPath) changedPaths.add(normalizedPath);
	}
	const hasAuthoredIncludes = containsConfigIncludeDirective(snapshot.parsed);
	if (snapshot.valid || snapshot.exists && hasAuthoredIncludes) {
		const keyedAgentEntryIncludes = resolveKeyedAgentEntryIncludePreservation({
			configPath: snapshot.path,
			provenance: snapshot.includeProvenance
		});
		persistCandidate = resolvePersistCandidateForWrite({
			inputBasis,
			runtimeConfig: authoredRuntimeConfig,
			sourceConfig: authoredSourceConfig,
			sourceConfigValid: snapshot.valid,
			sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
			nextConfig: authoredConfig,
			rootAuthoredConfig: snapshot.parsed,
			agentRosterIncludeOwned: snapshot.agentRosterIncludeOwned,
			keyedAgentEntryIncludePaths: keyedAgentEntryIncludes?.includePaths,
			unsetPaths,
			explicitSetPaths,
			explicitSetValueSource,
			persistCanonicalAgentRoster,
			allowedAgentRosterRemovals: options.allowedAgentRosterRemovals,
			allowIncludeAncestorExplicitSetPaths: options.allowIncludeAncestorExplicitSetPaths,
			preserveLegacyAgentRoster
		});
	}
	const validationEnvBase = createConfigRuntimeEnvBase(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig, deps.env);
	const resolveValidationCandidate = (candidate) => {
		const config = applyUnsetPathsForWrite(candidate, unsetPaths);
		if (containsConfigIncludeDirective(config)) return context.resolveRuntimePreflightSourceConfig(config, void 0, void 0, validationEnvBase);
		const resolution = resolveConfigForRead(config, cloneEnvWithPlatformSemantics(validationEnvBase), deps.lowerPrecedenceEnv);
		setConfigResolutionFacts(resolution.resolvedConfigRaw, resolution.resolutionFacts);
		return resolution.resolvedConfigRaw;
	};
	const validationCandidate = resolveValidationCandidate(persistCandidate);
	const validateCandidate = (candidate) => {
		const result = validateConfigObjectRawWithPlugins(candidate, {
			...context.pathResolution,
			pluginValidation: options.skipPluginValidation ? "skip" : "full",
			semanticValidation: "strict",
			preservedLegacyRootKeys: options.preservedLegacyRootKeys,
			deferredPluginMigrations
		});
		if (!result.ok) throw createConfigValidationFailedError(result.issues);
		return result;
	};
	validateCandidate(validationCandidate);
	const validatedCandidate = validationCandidate;
	const previousSource = snapshot.authoredConfig ?? snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	const materialized = stampConfigVersion(snapshot.exists ? validatedCandidate : initializeNativeSessionCatalogPreferences(validatedCandidate), options.lastTouchedVersionOverride, snapshot.exists ? previousSource : null);
	persistCandidate = applyMergePatch(persistCandidate, createMergePatch(validationCandidate, materialized));
	const validated = validateCandidate(resolveValidationCandidate(persistCandidate));
	const previousWarningFingerprint = loggedConfigWarningFingerprints.get(configPath);
	options.assertConfigPathForWrite?.();
	const priorSnapshotAuditRecord = readLatestConfigSnapshotAuditRecord({
		env: deps.env,
		homedir: deps.homedir
	});
	options.assertConfigPathForWrite?.();
	await deps.fs.promises.mkdir(path.dirname(configPath), {
		recursive: true,
		mode: 448
	});
	await tightenStateDirPermissionsIfNeeded({
		configPath,
		env: deps.env,
		homedir: deps.homedir,
		fsModule: deps.fs,
		assertConfigPathForWrite: options.assertConfigPathForWrite
	});
	const tildeRestoredOutputConfig = restoreAuthoredTildePathsForWrite(persistCandidate, snapshot.parsed, void 0, deps.homedir());
	const outputConfig = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.parsed,
		nextConfig: applyUnsetPathsForWrite(tildeRestoredOutputConfig, unsetPaths),
		pending: deferredPluginMigrations
	});
	const stampedOutputConfig = stampConfigVersion(outputConfig, options.lastTouchedVersionOverride);
	rejectConfigNonFiniteNumbers(stampedOutputConfig);
	const json = JSON.stringify(stampedOutputConfig, null, 2).trimEnd().concat("\n");
	const nextHash = hashConfigRaw(json);
	const previousHash = hashConfigRaw(snapshot.raw);
	const changedPathCount = changedPaths.size;
	const previousBytes = typeof snapshot.raw === "string" ? Buffer.byteLength(snapshot.raw, "utf-8") : null;
	const sizeBaselineBytes = resolveConfigSizeBaselineBytes({
		raw: snapshot.raw,
		json5: deps.json5,
		lastTouchedVersionOverride: options.lastTouchedVersionOverride
	});
	const nextBytes = Buffer.byteLength(json, "utf-8");
	const previousStat = snapshot.exists ? await deps.fs.promises.stat(configPath).catch(() => null) : null;
	const hasMetaBefore = hasConfigMeta(snapshot.parsed);
	const hasMetaAfter = hasConfigMeta(stampedOutputConfig);
	const gatewayModeBefore = resolveGatewayMode(snapshot.resolved);
	const includeFileHashes = {};
	const includeFileTargets = {};
	const sourceConfigForPreflight = context.resolveRuntimePreflightSourceConfig(stampedOutputConfig, includeFileHashes, includeFileTargets, validationEnvBase);
	const committedRevision = hashConfigRevision(json, includeFileHashes, includeFileTargets);
	const gatewayModeAfter = resolveGatewayMode(sourceConfigForPreflight);
	const suspiciousReasons = resolveConfigWriteSuspiciousReasons({
		existsBefore: snapshot.exists,
		unreadableBefore: snapshot.readError != null,
		sizeBaselineBytes,
		nextBytes,
		hasMetaBefore,
		gatewayModeBefore,
		gatewayModeAfter
	});
	const readTestLogFlag = (name) => isVitestRuntimeEnv(deps.env) && deps.env[name] === "1";
	const logConfigOverwrite = () => {
		if (!snapshot.exists || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !readTestLogFlag("TESTCLAW_TEST_CONFIG_WRITE_LOG")) return;
		const testLog = readTestLogFlag("TESTCLAW_TEST_CONFIG_WRITE_LOG");
		if (!isVerbose() && deps.env.TESTCLAW_CONFIG_OVERWRITE_LOG !== "1" && !testLog) return;
		deps.logger.warn(formatConfigOverwriteLogMessage({
			configPath,
			previousHash: previousHash ?? null,
			nextHash,
			changedPathCount
		}));
	};
	const logConfigWriteAnomalies = () => {
		const testLog = readTestLogFlag("TESTCLAW_TEST_CONFIG_WRITE_LOG");
		if (suspiciousReasons.length === 0 || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !testLog) return;
		const visibleReasons = isVerbose() || deps.env.TESTCLAW_CONFIG_WRITE_ANOMALY_LOG === "1" || testLog ? suspiciousReasons : suspiciousReasons.filter((reason) => reason !== "missing-meta-before-write");
		if (visibleReasons.length > 0) deps.logger.warn(`Config write anomaly: ${configPath} (${visibleReasons.join(", ")})`);
	};
	const auditRecordBase = createConfigWriteAuditRecordBase({
		configPath,
		env: deps.env,
		existsBefore: snapshot.exists,
		previousHash: previousHash ?? null,
		nextHash,
		previousBytes,
		nextBytes,
		previousMetadata: resolveConfigStatMetadata(previousStat),
		changedPathCount,
		changedPaths: [...changedPaths],
		origin: options.auditOrigin,
		hasMetaBefore,
		hasMetaAfter,
		gatewayModeBefore,
		gatewayModeAfter,
		suspicious: suspiciousReasons
	});
	const appendWriteAudit = async (result, error, nextStat) => {
		options.assertConfigPathForWrite?.();
		await appendConfigAuditRecord({
			env: deps.env,
			homedir: deps.homedir,
			record: finalizeConfigWriteAuditRecord({
				base: auditRecordBase,
				result,
				err: error,
				nextMetadata: resolveConfigStatMetadata(nextStat ?? null)
			})
		});
	};
	const blockingReasons = resolveConfigWriteBlockingReasons(suspiciousReasons, options);
	if (blockingReasons.length > 0 && options.allowDestructiveWrite !== true) {
		const rejectedPath = `${configPath}.rejected.${formatConfigArtifactTimestamp((/* @__PURE__ */ new Date()).toISOString())}`;
		options.assertConfigPathForWrite?.();
		const rejectedSave = await deps.fs.promises.writeFile(rejectedPath, json, {
			encoding: "utf-8",
			mode: 384,
			flag: "wx"
		}).then(ok, err);
		const saveDetail = rejectedSave.ok ? `Rejected payload saved to ${rejectedPath}.` : `Rejected payload could not be saved to ${rejectedPath}: ${formatErrorMessage(rejectedSave.error)}.`;
		const message = `Config write rejected: ${configPath} (${blockingReasons.join(", ")}). ${saveDetail}`;
		const error = Object.assign(new Error(message), {
			code: "CONFIG_WRITE_REJECTED",
			...rejectedSave.ok ? { rejectedPath } : {},
			reasons: blockingReasons
		});
		deps.logger.warn(message);
		await appendWriteAudit("rejected", error);
		throw error;
	}
	await (options.preCommitRuntimePreflight ?? (async (sourceConfig) => {
		await preflightRuntimeSnapshotWrite({
			nextSourceConfig: sourceConfig,
			refreshOptions: options.runtimeRefresh,
			formatRefreshError: (error) => formatErrorMessage(error),
			createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config write blocked before committing ${configPath}: active SecretRef resolution failed: ${detail}`, { cause })
		});
	}))(sourceConfigForPreflight);
	const publication = { phase: "unpublished" };
	let restoreFile;
	let rollbackStatus = "not-restored";
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			options.assertConfigPathForWrite?.();
			if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
			options.assertConfigPathForWrite?.();
			await cronOwnerRefusal?.recheck();
			options.assertConfigPathForWrite?.();
			warnIfJSON5CommentsWillBeStripped({
				raw: snapshot.raw,
				filePath: configPath,
				warn: (message) => deps.logger.warn(message),
				skipOutputLogs: options.skipOutputLogs
			});
			const guardedFs = createGuardedConfigFileSystem(configPath, deps.fs, options.assertConfigPathForWrite, {
				snapshot,
				includeGraph: {
					hashes: includeFileHashes,
					targets: includeFileTargets
				},
				onRootRemoved: () => {
					publication.phase = "removed";
				},
				onRootPublished: () => {
					publication.phase = "published";
				}
			});
			restoreFile = (assertCurrent) => rollbackConfigFileWriteIfUnchanged({
				configPath,
				previousSnapshot: snapshot,
				committedHash: publication.phase === "removed" ? hashConfigRaw(null) : nextHash,
				fsModule: deps.fs,
				...guardedFs.captureRollbackProof(assertCurrent)
			});
			const preparedFile = _usingCtx$1.a(await prepareConfigFileWrite({
				configPath,
				content: json,
				previousRaw: snapshot.raw,
				fsModule: guardedFs.fileSystem,
				assertCurrent: guardedFs.assertCurrent
			}));
			await options.beforeCommit?.();
			const result = withDeferredPluginMigrationsCurrent({
				env: deps.env,
				expectedPending: deferredPluginMigrations
			}, () => {
				const published = preparedFile.publish();
				publication.phase = "published";
				return published;
			});
			options.assertConfigPathForWrite?.();
			publication.phase = "accepted";
			recordUpdateDoctorConfigWrite(configPath, previousHash, nextHash, snapshot.parsed, json);
			try {
				recordConfigWriteMetadata((/* @__PURE__ */ new Date()).toISOString(), options.lastTouchedVersionOverride);
			} catch (error) {
				deps.logger.warn(`Config metadata state update failed: ${formatErrorMessage(error)}`);
			}
			logConfigOverwrite();
			logConfigWriteAnomalies();
			await appendWriteAudit(result.method, void 0, await deps.fs.promises.stat(configPath).catch(() => null));
			options.assertConfigPathForWrite?.();
			if (configSnapshotAuditRecordMatchesPath(priorSnapshotAuditRecord, configPath) && priorSnapshotAuditRecord.rawHash !== previousHash) {
				const offlineChangedPaths = /* @__PURE__ */ new Set();
				collectChangedPaths(priorSnapshotAuditRecord.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
					env: deps.env,
					homedir: deps.homedir
				}), "", offlineChangedPaths);
				await appendConfigAuditRecord({
					env: deps.env,
					homedir: deps.homedir,
					record: {
						ts: (/* @__PURE__ */ new Date()).toISOString(),
						source: "config-io",
						event: "config.external",
						detectedBy: "write",
						configPath,
						previousHash: priorSnapshotAuditRecord.rawHash,
						nextHash: previousHash ?? null,
						valid: snapshot.valid,
						...snapshot.valid ? offlineChangedPaths.size > 0 ? { changedPaths: capConfigAuditPaths([...offlineChangedPaths]) } : { opaqueChange: true } : { issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true })) }
					}
				});
			}
			options.assertConfigPathForWrite?.();
			const writtenSnapshotAuditRecord = upsertConfigSnapshotAuditRecord({
				env: deps.env,
				homedir: deps.homedir,
				configPath,
				rawHash: nextHash,
				authoredConfig: stampedOutputConfig,
				expectedSnapshot: priorSnapshotAuditRecord
			});
			if (!options.skipPluginValidation) logConfigWarningsOnce({
				configPath,
				warnings: validated.warnings,
				logger: deps.logger
			});
			if (clearedSessionStoreOwner && !options.skipOutputLogs) deps.logger.warn("Cleared agents.defaults.sessionStore.agentId because session.store changed. Set that owner path explicitly to assign the destination store's owner.");
			setDeferredPluginMigrationConfigFacts(sourceConfigForPreflight, deferredPluginMigrations);
			return {
				persistedHash: nextHash,
				persistedConfig: stampedOutputConfig,
				persistedSourceConfig: sourceConfigForPreflight,
				[configWriteCommittedSnapshot]: {
					hash: committedRevision,
					sourceConfig: sourceConfigForPreflight
				},
				[configWritePostCommitRollback]: {
					restoreFile,
					restoreEffects: (assertCurrent) => {
						assertCurrent();
						restoreConfigSnapshotAuditRecord({
							env: deps.env,
							homedir: deps.homedir,
							snapshot: priorSnapshotAuditRecord,
							expectedSnapshot: writtenSnapshotAuditRecord
						});
						if (previousWarningFingerprint === void 0) loggedConfigWarningFingerprints.delete(configPath);
						else setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, configPath, previousWarningFingerprint);
					}
				}
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		let failure = error;
		if (restoreFile && (publication.phase === "removed" || publication.phase === "published")) try {
			rollbackStatus = await restoreFile(() => sourceGuard?.()) ? "restored" : "not-restored";
		} catch (rollbackError) {
			rollbackStatus = "unknown";
			failure = new AggregateError([error, rollbackError], `${formatErrorMessage(error)} Recovery failed: ${formatErrorMessage(rollbackError)}`);
		}
		try {
			try {
				sourceGuard?.();
			} catch (ownershipError) {
				if (ownershipError === error) throw error;
				throw new AggregateError([error, ownershipError], `Config write failed after source ownership changed: ${formatErrorMessage(error)}`, { cause: ownershipError });
			}
			try {
				writeOptions.assertConfigPathForWrite?.();
			} catch {
				throw error;
			}
			try {
				await appendWriteAudit("failed", error);
			} catch (auditError) {
				throw new AggregateError([error, auditError], `${formatErrorMessage(error)} Failure auditing failed: ${formatErrorMessage(auditError)}`, { cause: auditError });
			}
		} catch (failureDuringAudit) {
			failure = failureDuringAudit;
		}
		if (publication.phase === "unpublished") throw failure;
		throw new ConfigWritePostCommitError({
			configPath,
			rollbackStatus,
			cause: failure,
			publication: publication.phase === "removed" ? "partial" : "complete"
		});
	}
}
//#endregion
export { writeConfigFileFromContext as t };
