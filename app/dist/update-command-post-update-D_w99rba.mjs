import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-CayS889k.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { t as VERSION } from "./version-BnaMeO13.mjs";
import { g as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-DSeyJ5Sb.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { I as isUnfencedUpdateDriver } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { n as replaceFileAtomic } from "./replace-file-BKJ_RAaB.mjs";
import { c as readJsonIfExists, h as writeJson } from "./json-files-BOBkrvx7.mjs";
import { c as createPluginInstallRecordMap, m as setPluginInstallRecordMapEntry, p as serializePluginInstallRecordMap } from "./installed-plugin-record-match-BHy1WTe7.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-BZDPDRhI.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-D-eqC5La.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-8IghgXkj.mjs";
import { a as hashConfigRaw, d as resolveConfigIncludesForRead, s as normalizeConfigIoDeps, u as resolveConfigForRead } from "./io.read-helpers-CchQKD1x.mjs";
import { n as UpdateFailureFactSchema } from "./update-run-schema-BbUizUqA.mjs";
import { f as isVerifiedUpdateRollback, s as classifyUpdateOutcome } from "./update-outcome-Dj5_EBo1.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-CQQBnbzM.mjs";
import { f as normalizeUpdatePostInstallDoctorWarnings, s as collectUpdateDoctorFailureFacts, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-Dn-wRvxN.mjs";
import { i as createManagedHandoffProcessIdentityReader } from "./update-managed-service-handoff-lease-jjPIEYC8.mjs";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-DzgSJvKU.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-DIHH_X2V.mjs";
import { c as withConfigMutationLock } from "./mutate-p35y2dNu.mjs";
import "./config-DqAgdhnz.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as runExec } from "./exec-BddaUUYf.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-DDSLXVaJ.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-D7QjtIL9.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CmSZ7pz0.mjs";
import { r as readPackageVersion } from "./package-json-CKAceI3K.mjs";
import { s as resolveManagedGatewayServiceProcessEnv } from "./service-types-D9NIqD52.mjs";
import { n as updateInstallRootsMatch, t as resolveUpdateInstallRoot } from "./update-install-root-Cdtzz5MM.mjs";
import { c as resolveManagedServiceUpdateFailureExitCode, d as normalizeControlPlaneUpdateResult, i as buildControlPlaneUpdateRestartHealthPendingResult, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV, r as UPDATE_RUN_ID_ENV, s as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-D9E1Aa9B.mjs";
import { i as updateRunStepsFromResultStep, r as isUpdateGatewayReadinessPending } from "./update-run-step-ClarIGqJ.mjs";
import { h as recordUpdateRunStep, y as UpdateRecoveryRequiredError } from "./update-run-ledger-CWjgjkCi.mjs";
import { r as getUpdateRun } from "./update-run-reader-DcJAE2Qr.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-DO9o1A6W.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BWH3Jzzo.mjs";
import { n as restoreGatewayServiceDefinitionBackup, r as verifyGatewayServiceDefinitionBackup } from "./service-definition-backup-g8u13obW.mjs";
import { a as resolveManagedUpdateRequester, n as createManagedUpdateRequesterAuthority, r as createManagedUpdateRequesterContinuationAuthority } from "./update-requester-authority-BqQG6ZV5.mjs";
import { c as withOwnedManagedUpdateEnv, i as resolveServiceRefreshEnv, s as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv } from "./update-command-service-env-DbNjnRg7.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { r as restorePersistedInstalledPluginIndexIfCurrent } from "./installed-plugin-index-store-write-P0EApttv.mjs";
import { o as writePersistedInstalledPluginIndexInstallRecordsWithLease } from "./installed-plugin-index-records-CTYgsrgw.mjs";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-Bun224Jd.mjs";
import { d as UpdateCommandRecoveryPendingError, s as withUpdateCommandExecutor } from "./update-command-executor-C_9Me3Ow.mjs";
import { C as createUpdateCommandAuthority, a as recordUpdatePackageCompletion, c as resolveSettledUpdateCommandResult, i as publishUpdateCommandTerminalResult, t as deferUpdateCommandTerminalResult, u as captureUpdateCommandTerminalRecord } from "./update-command-terminal-BZCyq7aD.mjs";
import { n as compareSemverStrings } from "./update-check-iRYMjMOk.mjs";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-C6CKVkpW.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-CkmD-Hkp.mjs";
import { l as parseUpdateTimeoutMs } from "./shared-hPUQ-y6A.mjs";
import { a as preparePostCorePluginConfig, i as persistValidatedDowngradeConfig, l as writePostCoreSourceConfigFile, n as normalizePluginInstallRecordMap, o as readPostCorePreUpdateSourceConfig } from "./update-command-config-CgomrYKI.mjs";
import { c as resolveUpdateStateContentVersion, o as readUpdateStateSchemaVersions, u as updateStateSchemaVersionsMatch } from "./update-candidate-state-JShE70Pv.mjs";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV, c as buildPostCoreHandoffEnv, n as POST_CORE_UPDATE_ENV, o as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV, r as POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV, s as POST_CORE_UPDATE_STARTED_AT_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-DOzeaUHK.mjs";
import { n as readUpdateConfigSnapshot } from "./update-command-config-snapshot-lwby1wkA.mjs";
import { i as runUpdateFinalizationDoctorInFreshProcess, n as updatePluginsAfterCoreUpdate, r as completePostCorePluginUpdate, t as completeSourceUpdateRuntime } from "./update-command-runtime-49WRijCo.mjs";
import { a as collectPostCorePluginFailureFacts, i as collectPostCorePluginAdvisories, t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-T3SfWaVR.mjs";
import { m as isPackageManagerUpdateMode, o as compensateOriginalManagedService, s as maybeRestartServiceAfterFailedMutableUpdate } from "./update-command-verification-CdBQ4jOm.mjs";
import { l as writeUpdateRunReportArtifact } from "./update-failure-report-artifact-CNC9-FvP.mjs";
import { n as recordPostCoreUpdateEvidence } from "./update-run-interruption-wD2E7fVQ.mjs";
import { n as NativePackageRollbackError } from "./package-update-steps-DnzimNpq.mjs";
import { r as readPackageUpdateIdentity } from "./update-command-package-ChL4Dwvp.mjs";
import { i as parkForegroundUpdateForActivation } from "./update-command-handoff-C-MQewiw.mjs";
import { i as assertGatewayServiceManagementAllowedForUpdate, n as GatewayServiceUpdateOwnershipError, p as resolveUpdatedGatewayRestartPort, s as isGatewayServiceManagementAllowedForUpdate, u as resolveGatewayServiceManagementBlockMessageForUpdate } from "./update-command-service-plan-BvweOT5A.mjs";
import { n as maybeResumeWindowsTaskAutoStartAfterPackageUpdate, r as maybeStopManagedServiceBeforeMutableUpdate, s as revalidateManagedGatewayServiceAfterUpdate, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-C6WxOSeg.mjs";
import { r as loadUpdateRecovery, t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-BgCTLAZE.mjs";
import { t as verifyUpdateFailureRecovery } from "./update-command-failure-recovery-D-8FJH8e.mjs";
import { n as retireStandaloneGitWrapper } from "./update-command-git-DCYuxMIB.mjs";
import { d as prepareUpdateServiceResult, g as resolveAutomaticUpdateTriage, i as UpdateCommandPendingRecoveryFailure, l as markControlPlaneUpdateRestartSentinelFailureBestEffort, m as recordUpdateResultNextAction, n as UpdateCommandFailure, y as writeControlPlaneUpdateRestartSentinelBestEffort } from "./update-command-result-C1yfMxMf.mjs";
import { i as tryInstallShellCompletion, n as resolvePostUpdateServiceStateReadEnv, r as shouldPrepareUpdatedInstallRestart, t as maybeRestartService } from "./update-command-service-C37jguzp.mjs";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
//#region src/infra/update-timeout-provenance.ts
/** Keep a compatibility allowance for shipped receivers and retain the caller's intent. */
function createUpdateTimeoutHandoff(operatorTimeout, fallbackTimeoutMs) {
	return {
		completionOwner: "parent",
		timeout: {
			version: 1,
			serialized: operatorTimeout ?? String(Math.ceil(fallbackTimeoutMs / 1e3)),
			operator: operatorTimeout ?? null
		}
	};
}
/** Unknown or mismatched private input cannot remove a shipped caller's deadline. */
function isOmittedUpdateTimeout(serialized, handoff) {
	if (!serialized || !parseStrictPositiveInteger(serialized) || !isRecord(handoff)) return false;
	const timeout = handoff.timeout;
	return handoff.completionOwner === "parent" && isRecord(timeout) && timeout.version === 1 && timeout.operator === null && timeout.serialized === serialized;
}
//#endregion
//#region src/cli/update-cli/update-command-post-core.ts
const POST_CORE_UPDATE_RESULT_POLL_MS = 100;
const POST_CORE_UPDATE_STOP_GRACE_MS = 1e3;
const POST_CORE_CONFIG_WRITER_MIN_VERSION = "2026.4.29";
async function postCoreUpdateParentOwnsCompletion(resultPath) {
	if (!resultPath) return false;
	return (await readJsonIfExists(path.join(path.dirname(resultPath), "handoff.json")))?.completionOwner === "parent";
}
/** Restore operator intent only when the private handoff matches this child command. */
async function resolvePostCoreUpdateOperatorOptions(params) {
	if (!params.resultPath || params.opts.timeout === void 0) return params.opts;
	const handoff = await readJsonIfExists(path.join(path.dirname(params.resultPath), "handoff.json"));
	if (!isOmittedUpdateTimeout(params.opts.timeout, handoff)) return params.opts;
	return {
		...params.opts,
		timeout: void 0
	};
}
async function writePostCoreUpdateFailureFile(filePath, error) {
	if (filePath) {
		const failureFacts = collectUpdateDoctorFailureFacts(error);
		const failure = sanitizeTriageUpdateFailure({ error: formatErrorMessage(error) }, {
			env: process.env,
			stateDir: resolveStateDir()
		});
		await writeJson(filePath, {
			status: "failed",
			error: failure.error,
			...failureFacts.length ? { failureFacts } : {}
		}, {
			trailingNewline: true,
			dirMode: 448
		});
	}
}
async function writePostCorePluginUpdateResultFile(filePath, result) {
	if (!filePath) return;
	await writeJson(filePath, result, {
		trailingNewline: true,
		dirMode: 448
	});
}
/** @internal exported for focused handoff contract tests. */
async function writePostCorePluginInstallRecordsFile(filePath, records) {
	await fs.writeFile(filePath, `${serializePluginInstallRecordMap(records)}\n`, "utf-8");
}
async function readPostCorePluginInstallRecordsFile(filePath) {
	if (!filePath) return;
	let raw;
	try {
		raw = await fs.readFile(filePath, "utf-8");
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return;
		throw new Error(`Unable to read plugin install records file: ${filePath}. Run testclaw doctor to inspect and repair plugin installation state.`, { cause: err });
	}
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error(`Malformed JSON in plugin install records file: ${filePath}. Run testclaw doctor to inspect and repair plugin installation state.`, { cause: err });
	}
	try {
		return normalizePluginInstallRecordMap(parsed);
	} catch (err) {
		throw new Error(`Invalid plugin install records in handoff file: ${filePath}. Run testclaw doctor to inspect and repair plugin installation state.`, { cause: err });
	}
}
async function execFileStdout(file, args) {
	return await runExec(file, args, {
		logOutput: false,
		timeoutMs: 1e3
	}).then(({ stdout }) => stdout, () => void 0);
}
async function readProcessStartTimeMs(pid) {
	if (!Number.isInteger(pid) || pid <= 0) return;
	const raw = process.platform === "win32" ? await execFileStdout("powershell.exe", [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		`[Console]::Out.Write((Get-Process -Id ${pid}).StartTime.ToUniversalTime().ToString("o"))`
	]) : await execFileStdout("ps", [
		"-o",
		"lstart=",
		"-p",
		String(pid)
	]);
	if (!raw) return;
	const parsed = Date.parse(raw.trim().replace(/\s+/g, " "));
	return Number.isFinite(parsed) ? parsed : void 0;
}
async function resolvePostCoreUpdateStartedAtMs(env) {
	const fromEnv = parseStrictPositiveInteger(env["TESTCLAW_UPDATE_POST_CORE_STARTED_AT_MS"] ?? "");
	if (fromEnv !== void 0) return fromEnv;
	return await readProcessStartTimeMs(process.ppid);
}
async function readPostCoreUpdateResultFile(filePath) {
	try {
		const parsed = await readJsonIfExists(filePath);
		if (parsed?.status === "failed" && typeof parsed.error === "string") {
			const facts = UpdateFailureFactSchema.array().safeParse(parsed.failureFacts);
			return {
				status: "failed",
				error: parsed.error,
				...facts.success && facts.data.length ? { failureFacts: normalizeUpdateFailureFacts(facts.data) } : {}
			};
		}
		if (parsed && typeof parsed === "object" && (parsed.status === "ok" || parsed.status === "warning" || parsed.status === "skipped" || parsed.status === "error")) return parsed;
	} catch {
		return;
	}
}
async function stopPostCoreUpdateChild(child) {
	if (process.platform === "win32" && child.pid) try {
		await runExec(getWindowsSystem32ExePath("taskkill.exe"), [
			"/PID",
			String(child.pid),
			"/T",
			"/F"
		], {
			logOutput: false,
			timeoutMs: 5e3
		});
		return;
	} catch {
		child.kill();
		return;
	}
	child.kill();
}
/**
* Returns the stdio mode for the post-core-update child process.
*
* Windows shells (PowerShell/CMD) wait for all processes that hold inherited console handles to
* exit before returning the prompt, even after the immediate child has exited.  Using "pipe" on
* Windows prevents the child (and any grandchildren it spawns) from ever receiving a reference to
* the parent's console handles, eliminating the terminal hang seen in #78445.
*
* @internal exported for testing
*/
function resolvePostCoreUpdateChildStdio(platform = process.platform, jsonMode = false) {
	return platform === "win32" || jsonMode ? "pipe" : "inherit";
}
/** @internal exported for focused handoff contract tests. */
function preparePostCorePluginInstallRecordsForFreshProcess(params) {
	if (!params.targetVersion) return params.records;
	const runtimeComparison = compareSemverStrings(VERSION, params.targetVersion);
	if (runtimeComparison === null || runtimeComparison <= 0) return params.records;
	let changed = false;
	const next = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(params.records)) {
		const installedVersion = record.resolvedVersion ?? record.version;
		const comparison = installedVersion ? compareSemverStrings(installedVersion, params.targetVersion) : null;
		if (record.source !== "npm" || comparison === null || comparison <= 0) {
			setPluginInstallRecordMapEntry(next, pluginId, record);
			continue;
		}
		const { resolvedSpec: _resolvedSpec, resolvedVersion: _resolvedVersion, ...rest } = record;
		setPluginInstallRecordMapEntry(next, pluginId, rest);
		changed = true;
	}
	return changed ? next : params.records;
}
async function continuePostCoreUpdateInFreshProcess(params) {
	const entryPath = await resolveGatewayInstallEntrypoint(params.root);
	if (!entryPath) return { resumed: false };
	const nodeRunner = params.nodeRunner ?? resolveNodeRunner();
	const baseEnv = stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env));
	if (params.opts.acceptCapabilities) {
		const { stdout } = await runExec(nodeRunner, [
			entryPath,
			"update",
			"--help"
		], {
			baseEnv,
			logOutput: false,
			timeoutMs: params.timeoutMs
		});
		if (!/^[\t ]*--accept-capabilities(?:[\t ]|$)/m.test(stripVTControlCharacters(stdout))) return { resumed: false };
	}
	const argv = [entryPath, "update"];
	if (params.opts.json) argv.push("--json");
	if (params.opts.restart === false) argv.push("--no-restart");
	if (params.opts.yes) argv.push("--yes");
	if (params.opts.acceptCapabilities) argv.push("--accept-capabilities");
	const handoff = createUpdateTimeoutHandoff(params.opts.timeout, params.timeoutMs);
	const serializedTimeout = handoff.timeout.serialized;
	argv.push("--timeout", serializedTimeout);
	const resultDir = await fs.mkdtemp(path.join(os.tmpdir(), "testclaw-update-post-core-"));
	const resultPath = path.join(resultDir, "plugins.json");
	const installRecordsPath = path.join(resultDir, "plugin-install-records.json");
	const sourceConfigPath = path.join(resultDir, "source-config.json");
	const postCoreHostVersion = await readPackageVersion(params.root);
	const pluginInstallRecords = preparePostCorePluginInstallRecordsForFreshProcess({
		records: params.pluginInstallRecords,
		targetVersion: postCoreHostVersion
	});
	let tentativePluginIndex;
	const restoreTentativePluginIndex = async () => {
		const tentative = tentativePluginIndex;
		if (!tentative) return;
		await withPluginLifecycleLease({}, async (lease) => {
			await restorePersistedInstalledPluginIndexIfCurrent(tentative.previous, tentative.revision, { lease });
		});
		tentativePluginIndex = void 0;
	};
	try {
		if (pluginInstallRecords && pluginInstallRecords !== params.pluginInstallRecords) await withPluginLifecycleLease({}, async (lease) => {
			tentativePluginIndex = await writePersistedInstalledPluginIndexInstallRecordsWithLease(pluginInstallRecords, {
				...params.preUpdateConfig ? { config: params.preUpdateConfig.sourceConfig } : {},
				lease
			});
		});
		await writePostCorePluginInstallRecordsFile(installRecordsPath, pluginInstallRecords);
		await writePostCoreSourceConfigFile(sourceConfigPath, params.preUpdateConfig);
		await writeJson(path.join(resultDir, "handoff.json"), handoff, { dirMode: 448 });
		const jsonMode = params.opts.json === true;
		const childStdio = resolvePostCoreUpdateChildStdio(process.platform, jsonMode);
		const handoffEnv = buildPostCoreHandoffEnv({
			baseEnv,
			compatHostVersion: postCoreHostVersion,
			requestedChannel: params.requestedChannel,
			sourceConfigPath: params.preUpdateConfig ? sourceConfigPath : void 0
		});
		const sentinelMeta = await readControlPlaneUpdateSentinelMeta(baseEnv);
		if (sentinelMeta?.root) {
			const sentinelPath = path.join(resultDir, "sentinel-meta.json");
			const sentinel = {
				version: 1,
				meta: {
					...sentinelMeta,
					root: resolveUpdateInstallRoot(params.root)
				}
			};
			await fs.writeFile(sentinelPath, JSON.stringify(sentinel), { mode: 384 });
			handoffEnv[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV] = sentinelPath;
		}
		const child = spawn(nodeRunner, argv, {
			stdio: childStdio,
			env: {
				...handoffEnv,
				TESTCLAW_UPDATE_IN_PROGRESS: "1",
				...params.opts.run ? { [UPDATE_RUN_ID_ENV]: params.opts.run.runId } : {},
				[POST_CORE_UPDATE_ENV]: "1",
				[POST_CORE_UPDATE_CHANNEL_ENV]: params.channel,
				[POST_CORE_UPDATE_RESULT_PATH_ENV]: resultPath,
				[POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV]: installRecordsPath,
				[POST_CORE_UPDATE_STARTED_AT_ENV]: String(params.updateStartedAtMs)
			}
		});
		if (childStdio === "pipe") {
			child.stdout?.pipe(jsonMode ? process.stderr : process.stdout);
			child.stderr?.pipe(process.stderr);
		}
		const childResult = await new Promise((resolve, reject) => {
			let closed = false;
			let exited = false;
			let committed;
			let childError;
			let terminationError;
			let termination = Promise.resolve();
			let forceStop;
			const resultPoll = setInterval(() => {
				readPostCoreUpdateResultFile(resultPath).then((pluginUpdate) => {
					if (closed || exited || committed || childError || !pluginUpdate || pluginUpdate.status === "failed") return;
					committed = pluginUpdate;
					tentativePluginIndex = void 0;
					clearInterval(resultPoll);
					if (process.platform !== "win32") {
						forceStop = setTimeout(() => {
							if (child.exitCode === null && child.signalCode === null) try {
								child.kill("SIGKILL");
							} catch (error) {
								terminationError = error;
							}
						}, POST_CORE_UPDATE_STOP_GRACE_MS);
						forceStop.unref();
					}
					termination = Promise.resolve().then(() => {
						if (!exited) return stopPostCoreUpdateChild(child);
					}).catch((error) => {
						terminationError = error;
					});
				}).catch(() => void 0);
			}, POST_CORE_UPDATE_RESULT_POLL_MS);
			child.once("error", (error) => {
				childError = error;
			});
			child.once("exit", () => {
				exited = true;
				clearInterval(resultPoll);
			});
			child.once("close", (code, signal) => {
				closed = true;
				clearInterval(resultPoll);
				clearTimeout(forceStop);
				termination.then(async () => {
					const finalResult = committed ?? await readPostCoreUpdateResultFile(resultPath);
					if (finalResult && finalResult.status !== "failed") {
						tentativePluginIndex = void 0;
						resolve({
							kind: "plugin-update",
							pluginUpdate: finalResult
						});
					} else if (terminationError) reject(new Error("Post-core writer termination failed", { cause: terminationError }));
					else if (childError) reject(childError);
					else if (signal) reject(/* @__PURE__ */ new Error(`post-update process terminated by signal ${signal}`));
					else resolve({
						kind: "exit",
						exitCode: code ?? 1
					});
				}).catch(reject);
			});
		});
		const postCoreResult = childResult.kind === "plugin-update" ? childResult.pluginUpdate : await readPostCoreUpdateResultFile(resultPath);
		const exitCode = childResult.kind === "exit" ? childResult.exitCode : 0;
		if (postCoreResult?.status === "failed") {
			await restoreTentativePluginIndex();
			return {
				resumed: false,
				exitCode: exitCode || 1,
				error: postCoreResult.error,
				...postCoreResult.failureFacts ? { failureFacts: postCoreResult.failureFacts } : {}
			};
		}
		const pluginUpdate = postCoreResult;
		if (exitCode !== 0) {
			if (pluginUpdate) return {
				resumed: true,
				pluginUpdate
			};
			await restoreTentativePluginIndex();
			return {
				resumed: false,
				exitCode
			};
		}
		return {
			resumed: true,
			...pluginUpdate ? { pluginUpdate } : {}
		};
	} catch (error) {
		try {
			await restoreTentativePluginIndex();
		} catch (rollbackError) {
			throw new Error("Post-core update failed and could not restore the previous plugin index", { cause: rollbackError });
		}
		throw error;
	} finally {
		await fs.rm(resultDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
function shouldResumePostCoreUpdateInFreshProcess(params) {
	const { result } = params;
	if (result.status !== "ok" || params.downgradeRisk && (compareSemverStrings(result.after?.version ?? "", POST_CORE_CONFIG_WRITER_MIN_VERSION) ?? -1) < 0) return false;
	if (params.installKindChanged === true || isPackageManagerUpdateMode(result.mode)) return true;
	if (result.mode !== "git") return false;
	const beforeSha = normalizeOptionalString(result.before?.sha);
	const afterSha = normalizeOptionalString(result.after?.sha);
	if (beforeSha && afterSha && beforeSha !== afterSha) return true;
	const beforeVersion = normalizeOptionalString(result.before?.version);
	const afterVersion = normalizeOptionalString(result.after?.version);
	return Boolean(beforeVersion && afterVersion && beforeVersion !== afterVersion);
}
//#endregion
//#region src/cli/update-cli/update-command-resume.ts
async function resumePostCoreUpdate(params) {
	try {
		const env = { ...process.env };
		const runId = env[UPDATE_RUN_ID_ENV]?.trim();
		let parent;
		let parentError;
		if (runId && !params.opts.run) try {
			parent = createManagedHandoffProcessIdentityReader({ env }).processIdentity(process.ppid);
		} catch (error) {
			parentError = error;
		}
		const opts = await resolvePostCoreUpdateOperatorOptions({
			opts: params.opts,
			resultPath: process.env[POST_CORE_UPDATE_RESULT_PATH_ENV]
		});
		const resumed = {
			...params,
			opts
		};
		const parentOwnsCompletion = await postCoreUpdateParentOwnsCompletion(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV]);
		const record = runId && !params.opts.run && !parentOwnsCompletion ? getUpdateRun(runId, { env }) : void 0;
		if (runId && !params.opts.run && !parentOwnsCompletion && !record) throw new UpdateCommandRecoveryPendingError("Post-core update run is unavailable; resume cannot verify its owner.");
		let completed;
		if (runId && record && isUnfencedUpdateDriver(record.before.version)) {
			if (!parent) throw new UpdateCommandRecoveryPendingError("Legacy package parent identity is unavailable.", { cause: parentError });
			const inPostCore = (current) => current?.status === "running" && current.steps.findLast((entry) => entry.step === "testclaw doctor")?.status === "completed" && current.steps.findLast((entry) => entry.step === "post-update verification")?.status === "in_progress";
			const root = resolveUpdateInstallRoot(params.root);
			const executingRoot = resolveAssistantPackageRootSync({ moduleUrl: import.meta.url });
			if (!inPostCore(record) || !executingRoot || resolveUpdateInstallRoot(executingRoot) !== root) throw new UpdateCommandRecoveryPendingError("Legacy post-core update does not match its running installation.");
			const meta = await readControlPlaneUpdateSentinelMeta(env);
			const managedHandoff = env.TESTCLAW_UPDATE_RUN_HANDOFF === "1" || Boolean(meta?.handoffId || meta?.root);
			if (meta?.runId && meta.runId !== runId || managedHandoff && (!meta?.runId || !meta.handoffId || !meta.root)) throw new UpdateCommandRecoveryPendingError("Legacy managed post-core handoff is incomplete or names another update run.");
			if (meta?.handoffId && meta.root) {
				const { assertManagedServiceUpdateHandoffRoot } = await import("./update-managed-service-handoff-CcGc5GeR.mjs");
				await assertManagedServiceUpdateHandoffRoot({
					expectedRoot: meta.root,
					root,
					executingRoot,
					postCore: true
				});
			}
			completed = await withUpdateCommandExecutor(runId, async (executor) => {
				const fence = await executor.enter(root);
				const requester = resolveManagedUpdateRequester(record.origin.requester);
				const requesterAuthority = requester?.authorizationSource?.startsWith("profile:") ? await createManagedUpdateRequesterContinuationAuthority(requester, {
					runId,
					executor: fence
				}, env) : requester ? await createManagedUpdateRequesterAuthority(requester, env) : void 0;
				fence.assertCurrent();
				const current = getUpdateRun(runId, { env });
				if (!inPostCore(current) || current?.createdAtMs !== record.createdAtMs) throw new UpdateCommandRecoveryPendingError("Legacy post-core update changed during admission.");
				return await resumePostCoreUpdateInternal({
					...resumed,
					opts: {
						...opts,
						run: {
							runId,
							env,
							executorFence: fence,
							...requesterAuthority ? { requesterAuthority } : {}
						}
					}
				});
			}, {
				legacyPackageParent: parent,
				...meta?.handoffId && meta.root ? { legacyPackageHandoff: {
					handoffId: meta.handoffId,
					root: meta.root
				} } : {}
			});
		} else completed = await resumePostCoreUpdateInternal(resumed);
		const { pluginUpdate, result, assertRequesterCurrent } = completed;
		assertRequesterCurrent();
		if (process.env["TESTCLAW_UPDATE_POST_CORE_RESULT_PATH"]) await writePostCorePluginUpdateResultFile(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV], pluginUpdate);
		if (params.opts.json && !process.env["TESTCLAW_UPDATE_POST_CORE_RESULT_PATH"]) defaultRuntime.writeJson(result);
	} catch (error) {
		await writePostCoreUpdateFailureFile(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV], error).catch((writeError) => defaultRuntime.error(`Could not save post-update failure: ${String(writeError)}`));
		throw error;
	}
	defaultRuntime.exit(0);
}
async function resumePostCoreUpdateInternal(params) {
	const runId = process.env[UPDATE_RUN_ID_ENV]?.trim();
	const postCoreUpdate = process.env[POST_CORE_UPDATE_ENV] === "1";
	const { assertCurrent, assertRequesterCurrent } = createUpdateCommandAuthority({ opts: params.opts }, "Post-core update");
	assertCurrent?.();
	if (params.channel !== "stable" && params.channel !== "extended-stable" && params.channel !== "beta" && params.channel !== "dev") throw new Error("Missing post-core update channel context.");
	const channel = params.channel;
	const requestedChannelInput = process.env["TESTCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL"]?.trim() ?? "";
	const requestedChannel = requestedChannelInput ? normalizeUpdateChannel(requestedChannelInput) : null;
	if (requestedChannelInput && !requestedChannel) throw new Error("Invalid post-core requested update channel context.");
	process.env.TESTCLAW_COMPATIBILITY_HOST_VERSION = await readPackageVersion(params.root) ?? VERSION;
	assertCurrent?.();
	const parentOwnsCompletion = await postCoreUpdateParentOwnsCompletion(process.env[POST_CORE_UPDATE_RESULT_PATH_ENV]);
	assertCurrent?.();
	let maintenance;
	let outcome;
	let producedPluginUpdate;
	try {
		outcome = { pluginUpdate: await withCommandProcessScope(async () => {
			const doctorWarnings = [];
			const recordDoctorWarnings = (additionalWarnings = []) => {
				const warnings = [...additionalWarnings, ...doctorWarnings.map((warning) => warning.message)];
				if (!postCoreUpdate || !runId || warnings.length === 0) return;
				try {
					recordPostCoreUpdateEvidence(runId, { warnings });
				} catch (error) {
					defaultRuntime.error(`Post-core update evidence could not be saved: ${formatErrorMessage(error)} Update completion may require Doctor verification.`);
				}
			};
			const onDoctorWarnings = (warnings) => {
				doctorWarnings.push(...warnings.map((message) => ({
					reason: "doctor-advisory",
					message,
					guidance: ["Run `testclaw doctor --fix` after repairing the plugin."]
				})));
				recordDoctorWarnings();
			};
			const { beginDoctorMaintenance } = await import("./doctor-maintenance-CPmpF8J5.mjs");
			assertCurrent?.();
			maintenance = await beginDoctorMaintenance({
				root: parentOwnsCompletion ? null : params.root,
				options: {
					repair: true,
					nonInteractive: true,
					json: params.opts.json
				},
				runtime: {
					...defaultRuntime,
					log: defaultRuntime.error
				},
				...params.opts.run ? { assertCurrent } : {}
			});
			assertCurrent?.();
			await maintenance?.releaseState();
			await withPluginLifecycleLease({ assertCurrent }, async (lease) => {
				await completeSourceUpdateRuntime({
					root: params.root,
					timeoutMs: params.timeoutMs,
					lease,
					beforePersistentEffect: assertCurrent
				});
			});
			assertCurrent?.();
			if (!parentOwnsCompletion) {
				const warning = await runUpdateFinalizationDoctorInFreshProcess({
					opts: params.opts,
					phase: "post-plugin",
					assertCurrent,
					root: params.root,
					yes: params.opts.yes === true,
					json: params.opts.json === true,
					timeoutMs: params.timeoutMs,
					onWarnings: onDoctorWarnings
				});
				if (warning) {
					doctorWarnings.push(warning);
					recordDoctorWarnings();
				}
			}
			const configSnapshot = await readConfigFileSnapshot({
				skipPluginValidation: true,
				suppressFutureVersionWarning: true,
				observe: false
			});
			const updateStartedAtMs = await resolvePostCoreUpdateStartedAtMs(process.env);
			const preUpdateSourceConfig = await readPostCorePreUpdateSourceConfig({
				sourceConfigPath: process.env[POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV],
				currentSnapshot: configSnapshot,
				updateStartedAtMs
			});
			const parentPluginInstallRecords = await readPostCorePluginInstallRecordsFile(process.env[POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV]);
			assertCurrent?.();
			let { pluginUpdate } = await convergePostCoreUpdatePlugins({
				...params,
				channel,
				requestedChannel,
				preUpdateConfig: preUpdateSourceConfig,
				parentPluginInstallRecords,
				updateStartedAtMs: process.env["TESTCLAW_UPDATE_POST_CORE_STARTED_AT_MS"]?.trim() ? updateStartedAtMs : void 0,
				assertCurrent
			});
			producedPluginUpdate = pluginUpdate;
			if (!parentOwnsCompletion) {
				pluginUpdate = (await completePostCorePluginUpdate({
					root: params.root,
					opts: params.opts,
					pluginUpdate,
					freshDoctorRequired: pluginUpdate.changed,
					assertCurrent,
					yes: params.opts.yes === true,
					json: params.opts.json === true,
					timeoutMs: params.timeoutMs,
					onWarnings: onDoctorWarnings
				})).pluginUpdate;
				recordDoctorWarnings(collectPostCorePluginAdvisories(pluginUpdate));
			}
			const finalSnapshot = await readConfigFileSnapshot({ observe: false });
			assertCurrent?.();
			await persistValidatedDowngradeConfig(finalSnapshot, assertCurrent);
			assertCurrent?.();
			return doctorWarnings.length ? {
				...pluginUpdate,
				status: pluginUpdate.status === "error" ? "error" : "warning",
				warnings: [...pluginUpdate.warnings ?? [], ...doctorWarnings]
			} : pluginUpdate;
		}) };
	} catch (error) {
		outcome = error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred" ? { pluginUpdate: {
			...producedPluginUpdate ?? {
				changed: false,
				sync: {
					changed: false,
					switchedToBundled: [],
					switchedToNpm: [],
					warnings: [],
					errors: []
				},
				npm: {
					changed: false,
					outcomes: []
				},
				integrityDrifts: []
			},
			status: "warning",
			warnings: [...producedPluginUpdate?.warnings ?? [], {
				reason: "doctor-advisory",
				message: error.message,
				guidance: ["After other Assistant processes release state, run `testclaw doctor --fix`."]
			}]
		} } : { error };
	}
	if (maintenance && !("error" in outcome && hasCommandProcessCleanupError(outcome.error))) {
		const owned = maintenance;
		const failures = "error" in outcome ? [outcome.error] : [];
		for (const restore of [async () => owned.finish((await readConfigFileSnapshot({
			skipPluginValidation: true,
			observe: false
		})).config), () => owned.release()]) {
			if (failures.some(hasCommandProcessCleanupError)) break;
			try {
				await withCommandProcessScope(restore);
			} catch (error) {
				if (!failures.includes(error)) failures.push(error);
			}
		}
		if (failures.length) outcome = { error: failures.length === 1 ? failures[0] : new AggregateError(failures, "Post-core update and service restoration failed", { cause: failures[0] }) };
	}
	if ("error" in outcome) throw outcome.error;
	const { pluginUpdate } = outcome;
	assertCurrent?.();
	const result = {
		status: pluginUpdate.status === "error" ? "error" : "ok",
		mode: "unknown",
		root: params.root,
		runId,
		steps: pluginUpdate.doctorLint ? [pluginUpdate.doctorLint] : [],
		durationMs: 0,
		postUpdate: { plugins: pluginUpdate }
	};
	if (postCoreUpdate && runId) try {
		recordPostCoreUpdateEvidence(runId, {
			candidate: pluginUpdate.status !== "error" ? await readPackageUpdateIdentity(params.root) : void 0,
			warnings: collectPostCorePluginAdvisories(pluginUpdate),
			doctorLint: pluginUpdate.doctorLint
		});
		if (!parentOwnsCompletion && pluginUpdate.doctorLint) {
			const reportPath = await writeUpdateRunReportArtifact({
				result,
				detached: true,
				report: { markdown: "Post-plugin Doctor diagnostics; update completion is pending with the parent updater." }
			});
			defaultRuntime.error(`Post-plugin Doctor report (update completion pending): ${reportPath}`);
		}
	} catch (error) {
		defaultRuntime.error(`Post-core update evidence could not be saved: ${formatErrorMessage(error)} Update completion may require Doctor verification.`);
	}
	assertCurrent?.();
	return {
		pluginUpdate,
		result,
		assertRequesterCurrent
	};
}
/** Shared plugin producer; entry points retain runtime preparation and completion ownership. */
async function convergePostCoreUpdatePlugins(params) {
	const { assertCurrent } = params;
	assertCurrent?.();
	return await withPluginLifecycleLease({ assertCurrent }, async () => {
		const preparedConfig = await preparePostCorePluginConfig({
			requestedChannel: params.requestedChannel,
			preUpdateConfig: params.preUpdateConfig,
			suppressFutureVersionWarning: true,
			observe: false,
			assertCurrent
		});
		const currentPluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
		const persistedPluginIndex = params.parentPluginInstallRecords ? await readPersistedInstalledPluginIndex() : null;
		assertCurrent?.();
		const pluginInstallRecords = Object.keys(currentPluginInstallRecords).length > 0 || Boolean(persistedPluginIndex && params.updateStartedAtMs !== void 0 && persistedPluginIndex.generatedAtMs >= params.updateStartedAtMs) ? currentPluginInstallRecords : params.parentPluginInstallRecords ?? currentPluginInstallRecords;
		const pluginUpdate = await updatePluginsAfterCoreUpdate({
			root: params.root,
			channel: params.channel,
			...preparedConfig,
			json: params.opts.json,
			acceptCapabilities: params.opts.acceptCapabilities,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: parseUpdateTimeoutMs(params.opts.timeout) ?? null,
			pluginInstallRecords,
			assertCurrent
		});
		assertCurrent?.();
		return {
			pluginUpdate,
			configSnapshot: preparedConfig.configSnapshot
		};
	});
}
//#endregion
//#region src/cli/update-cli/update-command-convergence.ts
async function convergeUpdatePlugins(params) {
	const assertCurrent = params.assertCurrent ?? params.opts.run?.executorFence?.assertCurrent;
	assertCurrent?.();
	const postUpdateRoot = params.result.root ?? params.root;
	const failedTargetRuntime = () => ({
		...params.result,
		status: "error",
		reason: "post-core-update-failed",
		recovery: params.result.recovery?.serviceRestartSafe === false ? params.result.recovery : {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		}
	});
	const preUpdateConfig = params.configSnapshot.valid ? {
		sourceConfig: params.configSnapshot.sourceConfig,
		authoredConfig: isRecord(params.configSnapshot.parsed) ? params.configSnapshot.parsed : params.configSnapshot.sourceConfig
	} : void 0;
	const postUpdateInstalledVersion = await readPackageVersion(postUpdateRoot);
	assertCurrent?.();
	const versionComparison = postUpdateInstalledVersion && VERSION ? compareSemverStrings(VERSION, postUpdateInstalledVersion) : null;
	const runtimeRootChanged = !updateInstallRootsMatch(params.previousInstallRoot ?? params.root, postUpdateRoot);
	const retainedDifferentRuntime = params.coreAlreadyCurrent === true && (runtimeRootChanged || versionComparison !== null && versionComparison !== 0);
	const shouldResumePostCoreInFreshProcess = (!params.coreAlreadyCurrent || retainedDifferentRuntime) && !params.candidateRuntime && shouldResumePostCoreUpdateInFreshProcess({
		result: retainedDifferentRuntime ? {
			...params.result,
			status: "ok",
			before: {
				...params.result.before,
				version: VERSION
			},
			after: {
				...params.result.after,
				version: postUpdateInstalledVersion
			}
		} : params.result,
		downgradeRisk: params.downgradeRisk || versionComparison !== null && versionComparison > 0,
		installKindChanged: params.installKindChanged || retainedDifferentRuntime && runtimeRootChanged
	});
	let postUpdateConfigSnapshot;
	if (params.requestedChannel && params.configSnapshot.valid && params.requestedChannel !== params.storedChannel && !params.opts.json) {
		const verb = shouldResumePostCoreInFreshProcess ? "will be set" : "set";
		defaultRuntime.log(theme.muted(`Update channel ${verb} to ${params.requestedChannel}.`));
	}
	if (params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
		step: "post-update verification",
		status: "in_progress",
		startedAtMs: Date.now()
	}, { env: params.opts.run.env });
	return await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => {
		const previousCompatibilityHostVersion = process.env.TESTCLAW_COMPATIBILITY_HOST_VERSION;
		const compatibilityHostVersion = params.candidateRuntime ? postUpdateInstalledVersion ?? VERSION : versionComparison != null && versionComparison > 0 ? postUpdateInstalledVersion : null;
		if (compatibilityHostVersion) process.env.TESTCLAW_COMPATIBILITY_HOST_VERSION = compatibilityHostVersion;
		try {
			let postCorePluginUpdate;
			const doctorWarnings = [];
			const collectDoctorWarnings = (warnings) => {
				doctorWarnings.push(...warnings);
			};
			let targetRuntimeConverged = false;
			let maintenanceDeferred = false;
			if (shouldResumePostCoreInFreshProcess) {
				if (retainedDifferentRuntime && params.opts.run?.completionOwner === "gateway-restart") {
					await params.beforeDoctor?.();
					assertCurrent?.();
				}
				const freshProcessResult = await continuePostCoreUpdateInFreshProcess({
					root: postUpdateRoot,
					channel: params.channel,
					requestedChannel: params.requestedChannel,
					opts: params.opts,
					pluginInstallRecords: params.preUpdatePluginInstallRecords,
					updateStartedAtMs: params.startedAt,
					timeoutMs: params.updateStepTimeoutMs,
					nodeRunner: params.packageUpdateNodeRunner,
					preUpdateConfig
				});
				assertCurrent?.();
				if (freshProcessResult.exitCode !== void 0) return {
					resultWithPostUpdate: {
						...failedTargetRuntime(),
						...freshProcessResult.failureFacts?.length ? { steps: [...params.result.steps, {
							name: "post-update verification",
							command: "testclaw update",
							cwd: postUpdateRoot,
							durationMs: 0,
							exitCode: freshProcessResult.exitCode,
							stderrTail: freshProcessResult.error,
							failureFacts: freshProcessResult.failureFacts
						}] } : {}
					},
					detail: freshProcessResult.error,
					cancelled: freshProcessResult.exitCode === 130 || freshProcessResult.exitCode === 143
				};
				targetRuntimeConverged = freshProcessResult.resumed;
				postCorePluginUpdate = freshProcessResult.pluginUpdate;
			}
			if (retainedDifferentRuntime && !params.candidateRuntime && !targetRuntimeConverged) return {
				resultWithPostUpdate: failedTargetRuntime(),
				detail: "The installed target could not resume plugin convergence. Run testclaw update using the installed target executable."
			};
			const runtimeStartedAt = Date.now();
			const runtime = targetRuntimeConverged ? { changed: false } : await withPluginLifecycleLease({ assertCurrent }, (lease) => completeSourceUpdateRuntime({
				root: postUpdateRoot,
				timeoutMs: params.updateStepTimeoutMs,
				lease,
				beforePersistentEffect: assertCurrent,
				beforePublication: params.beforeRuntimePublication
			}));
			const runtimeDurationMs = Math.max(0, Date.now() - runtimeStartedAt);
			assertCurrent?.();
			if (!targetRuntimeConverged) {
				const phase = await convergePostCoreUpdatePlugins({
					root: postUpdateRoot,
					channel: params.channel,
					requestedChannel: params.requestedChannel,
					opts: params.opts,
					timeoutMs: params.updateStepTimeoutMs,
					preUpdateConfig,
					...params.candidateRuntime ? {
						parentPluginInstallRecords: params.preUpdatePluginInstallRecords,
						updateStartedAtMs: params.startedAt
					} : {},
					assertCurrent
				});
				postCorePluginUpdate = phase.pluginUpdate;
				postUpdateConfigSnapshot = phase.configSnapshot;
			}
			assertCurrent?.();
			if (postCorePluginUpdate && (!params.coreAlreadyCurrent || postCorePluginUpdate.changed || hasDeferredUpdateModelRetirement())) {
				const producedPluginUpdate = postCorePluginUpdate;
				const completedPluginUpdate = await completePostCorePluginUpdate({
					root: postUpdateRoot,
					opts: params.opts,
					...params.candidateRuntime ? { doctorConfigWrites: true } : {},
					pluginUpdate: producedPluginUpdate,
					freshDoctorRequired: producedPluginUpdate.changed,
					beforeDoctor: params.beforeDoctor,
					assertCurrent,
					yes: params.opts.yes === true,
					json: params.opts.json === true,
					timeoutMs: params.updateStepTimeoutMs,
					onWarnings: collectDoctorWarnings,
					...params.packageUpdateNodeRunner ? { nodeRunner: params.packageUpdateNodeRunner } : {}
				}).catch((error) => {
					if (!(error instanceof DoctorMaintenanceRefusalError) || error.refusal.kind !== "deferred") throw error;
					maintenanceDeferred = true;
					postCorePluginUpdate = {
						...producedPluginUpdate,
						status: "warning"
					};
					if (!doctorWarnings.includes(error.message)) collectDoctorWarnings([error.message]);
				});
				assertCurrent?.();
				if (completedPluginUpdate) {
					postCorePluginUpdate = completedPluginUpdate.pluginUpdate;
					postUpdateConfigSnapshot = completedPluginUpdate.configSnapshot;
				}
			} else if (params.candidateRuntime) postUpdateConfigSnapshot = await readConfigFileSnapshot({ observe: false });
			assertCurrent?.();
			if (!maintenanceDeferred && params.candidateRuntime && postUpdateConfigSnapshot) {
				await persistValidatedDowngradeConfig(postUpdateConfigSnapshot, assertCurrent);
				assertCurrent?.();
			}
			const resultWithPostUpdate = {
				...params.result,
				steps: [...params.result.steps, ...runtime.changed ? [{
					name: "source runtime publication",
					command: "testclaw update",
					cwd: postUpdateRoot,
					durationMs: runtimeDurationMs,
					exitCode: 0
				}] : []],
				...postCorePluginUpdate ? {
					status: postCorePluginUpdate.status === "error" ? "error" : params.result.status,
					...postCorePluginUpdate.status === "error" ? { reason: "post-update-plugins" } : {},
					postUpdate: {
						...params.result.postUpdate,
						plugins: postCorePluginUpdate
					}
				} : {}
			};
			const failureFacts = postCorePluginUpdate ? collectPostCorePluginFailureFacts(postCorePluginUpdate) : [];
			if (failureFacts.length) resultWithPostUpdate.steps.push({
				name: "post-update verification",
				command: "testclaw plugins update",
				cwd: postUpdateRoot,
				durationMs: 0,
				exitCode: 1,
				failureFacts
			});
			resultWithPostUpdate.steps.push(...normalizeUpdatePostInstallDoctorWarnings(doctorWarnings).map((message, index) => ({
				name: `post-plugin-doctor-warning-${index + 1}`,
				command: "testclaw doctor --fix",
				cwd: postUpdateRoot,
				durationMs: 0,
				exitCode: 0,
				advisory: {
					kind: "package-post-install-doctor",
					message
				}
			})));
			resultWithPostUpdate.steps.push(...collectPostCorePluginAdvisories(postCorePluginUpdate).map((message, index) => ({
				name: `finalize:plugins:${index}`,
				command: "testclaw plugins update",
				cwd: postUpdateRoot,
				durationMs: 0,
				exitCode: 0,
				advisory: {
					kind: "recoverable-maintenance",
					message
				}
			})));
			if (params.coreAlreadyCurrent && resultWithPostUpdate.status !== "error" && (runtime.changed || postCorePluginUpdate?.changed || retainedDifferentRuntime && params.opts.run?.gatewayRestartRequired || params.requestedChannel !== null && params.requestedChannel !== params.storedChannel)) {
				resultWithPostUpdate.status = "ok";
				delete resultWithPostUpdate.reason;
			}
			if (params.opts.run) {
				for (const step of resultWithPostUpdate.steps.flatMap(updateRunStepsFromResultStep)) if (step.step.startsWith("warning:")) recordUpdateRunStep(params.opts.run.runId, step, { env: params.opts.run.env });
				recordUpdateRunStep(params.opts.run.runId, {
					step: "post-update verification",
					status: postCorePluginUpdate?.status === "error" ? "failed" : "completed",
					endedAtMs: Date.now(),
					...failureFacts.length ? { failureFacts } : {}
				}, { env: params.opts.run.env });
			}
			return {
				resultWithPostUpdate,
				postUpdateConfigSnapshot
			};
		} finally {
			if (compatibilityHostVersion) {
				if (previousCompatibilityHostVersion === void 0) delete process.env.TESTCLAW_COMPATIBILITY_HOST_VERSION;
				else process.env.TESTCLAW_COMPATIBILITY_HOST_VERSION = previousCompatibilityHostVersion;
			}
		}
	});
}
//#endregion
//#region src/cli/update-cli/update-command-post-update-maintenance.ts
/** Shell integration changes follow settled restart and health recovery. */
async function completePostUpdateMaintenance(params, result, assertCurrent, context) {
	await tryInstallShellCompletion({
		root: context.root,
		jsonMode: Boolean(params.opts.json),
		skipPrompt: Boolean(params.opts.yes)
	});
	if (!params.installKindChanged || result.mode === "git") return;
	const retirement = await retireStandaloneGitWrapper({
		previousRoot: params.previousInstallRoot ?? params.root,
		assertCurrent
	});
	if (!retirement.error) return;
	defaultRuntime.error(retirement.error);
	await markControlPlaneUpdateRestartSentinelFailureBestEffort({
		...context.sentinel,
		reason: "wrapper-retirement-failed"
	});
	return {
		result: {
			...result,
			status: "error",
			reason: "wrapper-retirement-failed"
		},
		detail: retirement.error
	};
}
async function resumePostUpdateWindowsAutoStart(params, result, stopped) {
	await maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopped, true, stopped ? createWindowsTaskAutoStartGuard({
		root: result.recovery?.packageRollbackVerified && stopped.serviceUpdateVerdict?.kind === "owned" ? stopped.serviceUpdateVerdict.root : result.root ?? params.root,
		before: stopped,
		timeoutMs: params.updateStepTimeoutMs
	}) : void 0);
}
//#endregion
//#region src/cli/update-cli/update-command-recovery.ts
/** Refuse retained recovery before any package-only effects or diagnostic writes. */
function assertUpdateCommandRecovery(opts) {
	opts.run?.executorFence?.assertCurrent();
	assertUpdateCommandRecoveryState(opts);
}
function assertUpdateCommandRecoveryState(opts) {
	if (opts.recovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
	if (opts.run) {
		const current = loadUpdateRecovery(opts.run.runId, { env: opts.run.env });
		if (current) throw new UpdateRecoveryRequiredError(current);
	}
}
/** Package-only finalization cannot adopt a retained full-state claim. */
async function assertUpdateCommandPackageFinalization(params) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.opts.run !== run || run?.executorFence !== executor) throw new UpdateCommandRecoveryPendingError("Package finalization lost its original executor.");
		executor?.assertCurrent();
	};
	try {
		assertCurrent();
		if (params.opts.recovery) throw new Error("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
		const env = params.ownedManagedUpdateEnv ?? params.opts.run?.env;
		const targetPath = resolveAssistantStateSqlitePath(env);
		await assertUpdateRecoveryAdmission({
			env,
			path: targetPath
		});
		assertCurrent();
		if (run && resolveAssistantStateSqlitePath(run.env) !== targetPath) {
			await assertUpdateRecoveryAdmission({ env: run.env });
			assertCurrent();
		}
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(params.result, formatErrorMessage(cause), { cause });
	}
}
/** Hold the originally admitted executor through package finalization awaits. */
function createUpdateCommandFinalizationFence(params) {
	const originalRun = params.opts.run;
	const executor = originalRun?.executorFence;
	const assertCurrent = () => {
		try {
			if (params.opts.run !== originalRun || originalRun?.executorFence !== executor) throw new Error("Package finalization lost its original executor.");
			executor?.assertCurrent();
		} catch (cause) {
			throw new UpdateCommandPendingRecoveryFailure(params.result, formatErrorMessage(cause), { cause });
		}
	};
	return assertCurrent;
}
//#endregion
//#region src/cli/update-cli/update-command-restart-context.ts
async function prepareUpdateRestart(params, restartConfigSnapshot) {
	let refreshGatewayServiceEnv = false;
	let gatewayServiceEnv;
	let gatewayServiceInstallEnv;
	let serviceManagerUid = params.preManagedServiceStop?.serviceManagerUid;
	let serviceUpdateVerdict = params.preManagedServiceStop?.serviceUpdateVerdict;
	let skipLegacyServiceRestart = serviceUpdateVerdict?.kind === "absent";
	const serviceStateReadEnv = resolveServiceRefreshEnv(resolvePostUpdateServiceStateReadEnv({
		updateMode: params.result.mode,
		processEnv: process.env,
		preManagedServiceEnv: params.preManagedServiceStop?.serviceEnv
	}), params.invocationCwd);
	let serviceMutationAllowed = params.preManagedServiceStop?.serviceMutationAllowed !== false && isGatewayServiceManagementAllowedForUpdate(process.env) && isGatewayServiceManagementAllowedForUpdate(serviceStateReadEnv);
	let serviceMutationSkipMessage = !serviceMutationAllowed ? params.preManagedServiceStop?.serviceMutationSkipMessage ?? resolveGatewayServiceManagementBlockMessageForUpdate(process.env) ?? resolveGatewayServiceManagementBlockMessageForUpdate(serviceStateReadEnv) : void 0;
	let gatewayPort = await resolveUpdatedGatewayRestartPort({
		config: restartConfigSnapshot.valid ? restartConfigSnapshot.config : void 0,
		processEnv: process.env,
		serviceEnv: params.ownedManagedUpdateEnv
	});
	if (params.shouldRestart && serviceMutationAllowed && !skipLegacyServiceRestart) try {
		const serviceState = await readGatewayServiceState(resolveGatewayService(), {
			env: serviceStateReadEnv,
			requireEffective: true,
			requireLoadedCommand: true,
			validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
			timeoutMs: params.updateStepTimeoutMs
		});
		serviceUpdateVerdict = await revalidateManagedGatewayServiceAfterUpdate({
			state: serviceState,
			root: params.result.root ?? params.root,
			preManagedServiceStop: params.preManagedServiceStop,
			allowInstallRootChange: true
		});
		gatewayServiceEnv = serviceState.env;
		serviceManagerUid ??= serviceState.runtime?.systemd?.managerUid;
		skipLegacyServiceRestart = serviceUpdateVerdict.kind === "foreign" || serviceUpdateVerdict.kind === "absent";
		if (serviceUpdateVerdict.kind === "unavailable") {
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = serviceUpdateVerdict.message;
		} else if (serviceUpdateVerdict.kind === "foreign") {
			serviceMutationAllowed = false;
			serviceMutationSkipMessage = "Gateway service management skipped: the service belongs to a different Assistant installation and was left untouched.";
		} else if (!skipLegacyServiceRestart && shouldPrepareUpdatedInstallRestart({
			updateMode: params.result.mode,
			serviceInstalled: serviceState.installed,
			serviceLoaded: serviceState.loadState.status === "loaded",
			serviceStoppedForUpdate: params.preManagedServiceStop?.stopped,
			serviceMatchesUpdateRoot: serviceUpdateVerdict.kind === "owned",
			requiresInstallRootRefresh: serviceUpdateVerdict.kind === "owned" && serviceUpdateVerdict.requiresInstallRootRefresh
		})) {
			gatewayServiceInstallEnv = resolveManagedGatewayServiceProcessEnv(serviceState.command, params.ownedManagedUpdateEnv ?? process.env);
			if (gatewayServiceInstallEnv) gatewayServiceInstallEnv = stripGatewayServiceMarkerEnv(gatewayServiceInstallEnv);
			refreshGatewayServiceEnv = serviceUpdateVerdict.kind === "owned" && serviceUpdateVerdict.refreshDefinition;
			if (serviceUpdateVerdict.kind === "owned" && gatewayServiceInstallEnv === null) {
				refreshGatewayServiceEnv = false;
				serviceUpdateVerdict = {
					...serviceUpdateVerdict,
					refreshDefinition: false
				};
			}
		}
		gatewayPort = await resolveUpdatedGatewayRestartPort({
			config: restartConfigSnapshot.valid ? restartConfigSnapshot.config : void 0,
			serviceEnv: gatewayServiceEnv,
			serviceCommand: serviceUpdateVerdict.kind === "unresolved" || serviceUpdateVerdict.kind === "owned" && (!serviceUpdateVerdict.refreshDefinition || serviceUpdateVerdict.requiresInstallRootRefresh && restartConfigSnapshot.config.gateway?.port === void 0) ? serviceState.command : void 0
		});
	} catch (err) {
		if (params.preManagedServiceStop?.stopped) {
			const message = err instanceof GatewayServiceUpdateOwnershipError ? formatErrorMessage(err) : "Stopped gateway service could not be revalidated; inspect it before restarting manually.";
			throw new GatewayServiceUpdateOwnershipError(message, err);
		}
		serviceMutationAllowed = false;
		serviceMutationSkipMessage = "Code update completed; gateway service management skipped because its current ownership could not be inspected. Run `testclaw gateway status --deep` before restarting it manually.";
	}
	if (params.serviceRuntimeRefreshRequired && (!serviceMutationAllowed || !refreshGatewayServiceEnv || gatewayServiceInstallEnv === null)) throw new GatewayServiceUpdateOwnershipError("Replacing the unsupported Gateway Node requires a writable service definition and a reproducible service environment. Ask its deployment owner to refresh the service before retrying.", void 0);
	return {
		refreshGatewayServiceEnv,
		gatewayServiceEnv,
		gatewayServiceInstallEnv,
		serviceUpdateVerdict,
		serviceManagerUid,
		skipLegacyServiceRestart,
		serviceStateReadEnv,
		serviceMutationAllowed,
		serviceMutationSkipMessage,
		gatewayPort
	};
}
//#endregion
//#region src/cli/update-cli/update-command-rollback.ts
/** Restores the previous generation only while schemas and activation-owned config stay intact. */
async function rollbackFailedUpdate(params) {
	const { preManagedServiceStop: before, packageTransaction, opts } = params;
	const run = opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (opts.run !== run || run?.executorFence !== executor) throw new Error("Package rollback lost its original executor.");
		executor?.assertCurrent();
	};
	const env = before?.serviceEnv ?? opts.run?.env ?? process.env;
	if (!opts.recovery) try {
		assertCurrent();
		const targetPath = resolveAssistantStateSqlitePath(env);
		await assertUpdateRecoveryAdmission({
			env,
			path: targetPath
		});
		assertCurrent();
		if (opts.run && resolveAssistantStateSqlitePath(opts.run.env) !== targetPath) {
			await assertUpdateRecoveryAdmission({ env: opts.run.env });
			assertCurrent();
		}
	} catch (error) {
		return {
			result: {
				...params.result,
				status: "error",
				recovery: {
					serviceRestartSafe: false,
					reason: "runtime-verification-failed"
				}
			},
			rolledBack: false,
			pendingRecoveryReason: formatErrorMessage(error)
		};
	}
	if (opts.recovery) return {
		result: {
			...params.result,
			status: "error",
			recovery: {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			}
		},
		rolledBack: false,
		pendingRecoveryReason: "Full-state checkpoint recovery is deferred; the retained record and artifacts were left unchanged."
	};
	if (params.originalManagedServiceRuntime) return compensateOriginalManagedService(params, assertCurrent);
	let result = params.result;
	const config = params.configSnapshot.sourceConfigBeforeMigrations ?? params.configSnapshot.sourceConfig;
	const configSnapshot = params.activationConfig ?? {
		path: params.configSnapshot.path,
		raw: params.configSnapshot.raw,
		hash: hashConfigRaw(params.configSnapshot.raw)
	};
	const recoveryEnv = {
		...env,
		[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV]: "1"
	};
	const port = before?.stopped ? before.servicePort ?? await resolveUpdatedGatewayRestartPort({
		config,
		serviceEnv: env
	}) : void 0;
	const failed = (reason) => ({
		result: {
			...result,
			status: "error",
			rollbackOutcome: result.rollbackOutcome ?? {
				status: "not-attempted",
				reason
			},
			reason: result.recovery?.serviceRestartSafe === true && result.recovery.packageRollbackVerified ? params.result.reason ?? reason : reason
		},
		rolledBack: false,
		stoppedForRollback
	});
	const stateUnchanged = async () => {
		assertCurrent();
		const baseline = params.schemaVersions;
		const current = await readUpdateStateSchemaVersions({
			stateDir: resolveStateDir(env),
			config,
			env,
			root: result.root ?? null,
			nodeRunner: params.nodeRunner,
			timeoutMs: params.timeoutMs
		});
		assertCurrent();
		const sharedPath = resolveAssistantStateSqlitePath(env);
		if (baseline === void 0 || !updateStateSchemaVersionsMatch(baseline, current, {
			sharedPath,
			candidateSchemaVersions: params.candidateSchemaVersions
		})) return false;
		const baselineVersions = new Map(baseline.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
		for (const entry of current) {
			const version = resolveUpdateStateContentVersion(entry);
			if (version === null || baselineVersions.get(entry.path) != null) continue;
			const kind = entry.path === sharedPath ? "state" : "agent";
			const supported = params.previousSchemaVersions?.[kind];
			if (supported === void 0 || version > supported) throw new Error(`Automatic rollback refused: newly created ${kind} database ${entry.path} uses schema ${version}; retained previous package support is ${supported ?? "unknown"}. Keep the update installed.`);
		}
		await assertConfigUnchanged();
		assertCurrent();
		return true;
	};
	let stoppedForRollback;
	let failureReason = "rollback-state-unverified";
	const assertConfigUnchanged = async () => {
		assertCurrent();
		let unchanged = params.activationConfig?.doctorOwned !== false && (await readUpdateConfigSnapshot(configSnapshot.path)).hash === configSnapshot.hash;
		if (unchanged && params.configSnapshot.includedPaths?.length) {
			const deps = normalizeConfigIoDeps({ env: { ...env } });
			const included = resolveConfigIncludesForRead(params.configSnapshot.parsed, params.configSnapshot.path, deps);
			unchanged = isDeepStrictEqual(config, resolveConfigForRead(included, deps.env).resolvedConfigRaw);
		}
		assertCurrent();
		if (!unchanged) {
			failureReason = "state-migrated-no-rollback";
			const detail = `Configuration ${configSnapshot.path} or its included files changed after activation; automatic rollback was refused to preserve those edits.`;
			result = {
				...result,
				steps: [...result.steps, {
					name: "config-rollback",
					command: "restore pre-update config",
					cwd: params.previousRoot,
					durationMs: 0,
					exitCode: 1,
					stderrTail: detail
				}]
			};
			throw new Error(detail);
		}
	};
	const stop = async () => {
		assertCurrent();
		failureReason = "service-revalidation-failed";
		const stopped = await withOwnedManagedUpdateEnv(recoveryEnv, () => maybeStopManagedServiceBeforeMutableUpdate({
			updateRun: opts.run,
			updateInstallKind: "package",
			root: result.root ?? params.previousRoot,
			shouldRestart: true,
			jsonMode: opts.json === true,
			expectedService: before,
			allowInstallRootChange: packageTransaction !== void 0,
			timeoutMs: params.timeoutMs
		}));
		assertCurrent();
		if (stopped.serviceEnv) {
			stopped.serviceEnv = { ...stopped.serviceEnv };
			delete stopped.serviceEnv[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
		}
		stopped.windowsTaskAutoStartRecovery ??= before?.windowsTaskAutoStartRecovery;
		stoppedForRollback = stopped;
		if (stopped.blockMessage || stopped.serviceMutationAllowed === false || stopped.running && !stopped.stopped) throw new Error(stopped.blockMessage ?? "Update service could not be stopped safely.");
		return stopped;
	};
	try {
		assertCurrent();
		if (params.rollbackBlockedReason) return failed(params.rollbackBlockedReason);
		if (params.definitionRecovery.unverified) return failed("service-definition-rollback-unverified");
		if (!params.schemaVersions) return failed("rollback-state-unverified");
		if (!await stateUnchanged()) return failed("state-migrated-no-rollback");
		await packageTransaction?.assertRollbackSafe?.();
		assertCurrent();
		const definitionBackup = params.definitionRecovery.backup;
		const restoreGeneration = async (assertNativeCurrent) => {
			const assertRestorationCurrent = () => {
				assertCurrent();
				assertNativeCurrent();
			};
			if (definitionBackup) failureReason = "service-definition-rollback-unverified";
			const command = definitionBackup ? await resolveGatewayService().readCommand(recoveryEnv, { requireEffective: true }) : void 0;
			if (definitionBackup && !command) throw new Error("Service definition cannot be inspected for backup restoration.");
			const definition = definitionBackup && command ? {
				env: recoveryEnv,
				command,
				receipt: definitionBackup,
				assertCurrent: assertRestorationCurrent
			} : void 0;
			if (definition) await verifyGatewayServiceDefinitionBackup(definition);
			assertRestorationCurrent();
			const stopped = before?.stopped ? await stop() : void 0;
			const restore = async () => {
				failureReason = "rollback-state-unverified";
				if (!await stateUnchanged()) return failed("state-migrated-no-rollback");
				failureReason = "source-rollback-failed";
				if (!packageTransaction) throw new Error("The retained package transaction is unavailable.");
				assertRestorationCurrent();
				result.rollbackOutcome = {
					status: "failed",
					reason: "Previous generation restoration did not complete"
				};
				const { activePackageRoot, ...restored } = await packageTransaction.rollback(assertCurrent);
				result = {
					...result,
					root: activePackageRoot ?? void 0,
					after: void 0,
					steps: [...result.steps, restored]
				};
				assertRestorationCurrent();
				if (restored.exitCode === 0) {
					result.after = result.before;
					result.recovery = {
						serviceRestartSafe: false,
						packageRollbackVerified: true,
						reason: "runtime-verification-failed"
					};
				} else if (activePackageRoot) {
					result.after = await readPackageUpdateIdentity(activePackageRoot);
					assertRestorationCurrent();
				}
				if (opts.run) recordUpdateRunStep(opts.run.runId, {
					step: "package rollback",
					status: restored.exitCode === 0 ? "completed" : "failed",
					endedAtMs: Date.now(),
					...restored.reason ? { detail: restored.stderrTail ?? restored.reason } : {}
				}, { env: opts.run.env });
				if (restored.exitCode !== 0) return failed(restored.reason ?? "source-rollback-failed");
				failureReason = "rollback-state-unverified";
				if (configSnapshot.hash === hashConfigRaw(configSnapshot.raw)) await assertConfigUnchanged();
				else {
					await assertConfigUnchanged();
					assertRestorationCurrent();
					if (configSnapshot.raw === null) await fs.rm(configSnapshot.path, { force: true });
					else await replaceFileAtomic({
						filePath: configSnapshot.path,
						content: configSnapshot.raw,
						mode: 384,
						preserveExistingMode: false,
						beforeRename: async () => {
							await assertConfigUnchanged();
							assertRestorationCurrent();
						}
					});
				}
				assertRestorationCurrent();
			};
			const refused = configSnapshot.hash === hashConfigRaw(configSnapshot.raw) ? await restore() : await withOwnedManagedUpdateEnv(env, () => withConfigMutationLock({ lockPath: configSnapshot.path }, restore));
			assertRestorationCurrent();
			if (refused) return {
				refused,
				stopped
			};
			if (definition) {
				failureReason = "service-definition-rollback-unverified";
				await restoreGatewayServiceDefinitionBackup(definition);
				assertRestorationCurrent();
			}
			return { stopped };
		};
		const restoration = definitionBackup ? await withGatewayServiceOperationLock(recoveryEnv, restoreGeneration) : await restoreGeneration(assertCurrent);
		if (restoration.refused) return restoration.refused;
		result.rollbackOutcome = {
			status: "succeeded",
			reason: "Previous package and configuration restored"
		};
		const { stopped } = restoration;
		if (!stopped || port === void 0) return {
			result,
			rolledBack: false
		};
		const originalVerdict = before?.serviceUpdateVerdict;
		const restoresDifferentService = originalVerdict?.kind === "owned" && originalVerdict.requiresInstallRootRefresh;
		const serviceRoot = restoresDifferentService ? originalVerdict.root : params.previousRoot;
		const serviceIdentity = restoresDifferentService ? before?.serviceIdentity : result.before;
		if (!params.previousVerified || !serviceIdentity?.version) return failed("previous-version-unverified");
		if (restoresDifferentService && !isDeepStrictEqual(await readPackageUpdateIdentity(serviceRoot), serviceIdentity)) return failed("previous-version-unverified");
		assertCurrent();
		const restoredService = restoresDifferentService ? {
			...stopped,
			serviceUpdateVerdict: {
				...originalVerdict,
				refreshDefinition: false,
				requiresInstallRootRefresh: false
			},
			serviceEnv: before?.serviceEnv,
			serviceNodeRunner: before?.serviceNodeRunner,
			servicePort: before?.servicePort,
			serviceIdentity: before?.serviceIdentity,
			serviceManagerUid: before?.serviceManagerUid
		} : stopped;
		failureReason = "service-revalidation-failed";
		await maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopped, true, createWindowsTaskAutoStartGuard({
			root: serviceRoot,
			before: restoredService,
			timeoutMs: params.timeoutMs
		}), assertCurrent);
		assertCurrent();
		const nodeRunner = before?.serviceNodeRunner ?? params.nodeRunner;
		const state = await readGatewayServiceState(resolveGatewayService(), {
			env: recoveryEnv,
			requireEffective: true,
			requireLoadedCommand: true,
			validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
			timeoutMs: params.timeoutMs
		});
		let verdict = await revalidateManagedGatewayServiceAfterUpdate({
			state,
			root: serviceRoot,
			preManagedServiceStop: restoredService
		});
		if (verdict.kind === "owned") verdict = {
			...verdict,
			refreshDefinition: false,
			requiresInstallRootRefresh: false
		};
		assertCurrent();
		stoppedForRollback = {
			...restoredService,
			serviceUpdateVerdict: verdict
		};
		result.recovery = {
			serviceRestartSafe: true,
			packageRollbackVerified: true,
			version: serviceIdentity.version,
			reason: "gateway-verification-incomplete",
			...serviceIdentity.buildId ? { buildId: serviceIdentity.buildId } : {}
		};
		assertCurrent();
		if (opts.run) recordUpdateRunStep(opts.run.runId, {
			step: "previous generation restoration",
			status: "completed",
			endedAtMs: Date.now()
		}, { env: opts.run.env });
		failureReason = "restart-unhealthy";
		let verificationFailure;
		let verifiedAtMs;
		const restartOutcome = await maybeRestartService({
			shouldRestart: true,
			result,
			opts,
			refreshServiceEnv: false,
			expectedGatewayIdentity: {
				version: serviceIdentity.version,
				...serviceIdentity.buildId ? { buildId: serviceIdentity.buildId } : {}
			},
			serviceUpdateVerdict: verdict,
			serviceManagerUid: before?.serviceManagerUid,
			serviceEnv: recoveryEnv,
			serviceInstallEnv: before?.serviceDefinitionEnv,
			gatewayPort: port,
			requireRunningServiceAfterRestart: true,
			timeoutMs: params.timeoutMs,
			nodeRunner,
			invocationCwd: params.invocationCwd,
			onVerified: (at) => {
				verifiedAtMs = at;
			},
			onVerificationFailure: (reason) => {
				verificationFailure = reason;
			}
		});
		assertCurrent();
		const healthy = restartOutcome === "ok";
		return {
			result: {
				...result,
				recovery: {
					...result.recovery,
					service: healthy ? "healthy" : restartOutcome === "readiness-pending" || verificationFailure === "timeout" ? void 0 : verificationFailure || restartOutcome === "restart-health-failed" ? "failed" : void 0,
					reason: healthy ? void 0 : verificationFailure ?? (restartOutcome === "readiness-pending" ? "gateway-readiness-pending" : restartOutcome === "failed" ? "restart-failed" : "restart-unhealthy")
				}
			},
			rolledBack: healthy,
			stoppedForRollback,
			...verifiedAtMs === void 0 ? {} : { verifiedAtMs }
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		const detail = formatErrorMessage(error);
		try {
			assertCurrent();
		} catch (cause) {
			return {
				result: {
					...result,
					status: "error",
					recovery: {
						serviceRestartSafe: false,
						reason: "runtime-verification-failed"
					}
				},
				rolledBack: false,
				stoppedForRollback,
				pendingRecoveryReason: formatErrorMessage(cause)
			};
		}
		if (error instanceof NativePackageRollbackError) failureReason = error.reason;
		assertCurrent();
		const step = {
			name: "package rollback",
			command: "restore previous generation",
			cwd: params.previousRoot,
			durationMs: 0,
			exitCode: 1,
			stderrTail: detail,
			warnings: failureReason === "service-definition-rollback-unverified" ? [detail] : []
		};
		if (step.warnings.length) result.steps.push(step);
		if (run) {
			const endedAtMs = Date.now();
			for (const row of updateRunStepsFromResultStep(step)) recordUpdateRunStep(run.runId, {
				...row,
				detail,
				endedAtMs
			}, { env: run.env });
		}
		return failed(failureReason);
	}
}
//#endregion
//#region src/cli/update-cli/update-command-terminal-publication.ts
function completeUpdateCommandResult(params, result) {
	return normalizeControlPlaneUpdateResult({
		...result,
		...result.status === "error" && result.reason !== "update-activation-timeout" && params.rollbackBlockedReason ? { reason: params.rollbackBlockedReason } : {},
		durationMs: Math.max(0, Date.now() - params.startedAt)
	});
}
async function publishSettledUpdateCommandResult(params, state, onTerminalRecord) {
	const settled = await resolveSettledUpdateCommandResult(params, state.pendingResult, state.failure, state.terminalRecord);
	const result = completeUpdateCommandResult(params, settled.result);
	result.recovery = settled.settlementFailed ? void 0 : result.recovery;
	const reporting = state.readReportingState();
	const reportDowntime = !settled.settlementFailed && reporting.pendingRestartAtMs === void 0;
	if (reporting.notify) await reporting.notify(result);
	const { rolledBack, completedDowntimeMs } = state.readReportingState();
	return publishUpdateCommandTerminalResult(params, result, {
		rolledBack: rolledBack && !settled.settlementFailed,
		downtimeMs: reportDowntime ? completedDowntimeMs : void 0,
		captured: settled.captured
	}, onTerminalRecord);
}
function createPostUpdateFailureResult(params, error) {
	const message = formatErrorMessage(error);
	const failureFacts = collectUpdateDoctorFailureFacts(error);
	return {
		message,
		result: {
			...params.result,
			status: "error",
			reason: "post-update-failed",
			steps: [...params.result.steps, {
				name: "post-update verification",
				command: "testclaw update",
				cwd: params.result.root ?? params.root,
				durationMs: Math.max(0, Date.now() - params.startedAt),
				exitCode: 1,
				stderrTail: message,
				...failureFacts.length ? { failureFacts } : {}
			}]
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-post-update.ts
async function finishUpdate(params, { candidateRuntime = false } = {}) {
	const definitionRecovery = {};
	const fence = createUpdateCommandFinalizationFence(params);
	const assertCurrent = params.opts.run?.requesterAuthority ? createUpdateCommandAuthority({
		opts: params.opts,
		assertCurrent: fence
	}).assertCurrent : fence;
	const parkForegroundOrigin = () => parkForegroundUpdateForActivation(params, assertCurrent);
	const sentinelOptions = {
		meta: params.controlPlaneUpdateSentinelMeta,
		jsonMode: Boolean(params.opts.json),
		env: params.opts.run?.env ?? params.ownedManagedUpdateEnv
	};
	assertCurrent();
	await assertUpdateCommandPackageFinalization(params);
	assertCurrent();
	const shouldRestart = prepareUpdateServiceResult(params);
	let gateway = "preserve";
	let triageAllowed = true;
	const createFailure = (result, exitCode = 1, detail, options) => new UpdateCommandFailure(result, exitCode, detail, {
		...options,
		automaticTriage: triageAllowed ? resolveAutomaticUpdateTriage(result, detail, {
			...params,
			gateway
		}) : void 0
	});
	let rollbackAttempted = false;
	let rollbackStopState;
	const currentServiceStop = () => rollbackStopState ?? params.preManagedServiceStop;
	let rolledBack = false;
	let originalServiceRecoveryHandled = false;
	let completedDowntimeMs = params.coreAlreadyCurrent ? 0 : void 0;
	let pendingRestartAtMs = params.preManagedServiceStop?.stoppedAtMs ?? params.controlPlaneUpdateSentinelMeta?.serviceStoppedAtMs;
	const recordVerifiedDowntime = (verifiedAtMs) => {
		if (pendingRestartAtMs !== void 0) {
			completedDowntimeMs = (completedDowntimeMs ?? 0) + Math.max(0, verifiedAtMs - pendingRestartAtMs);
			pendingRestartAtMs = void 0;
		}
	};
	assertCurrent();
	recordUpdateResultNextAction(params, params.result);
	let pendingResult = params.result;
	let terminalRecord;
	let pendingNotify = true;
	const writeRestartSentinel = (result) => writeControlPlaneUpdateRestartSentinelBestEffort({
		...sentinelOptions,
		result
	});
	const publishFinalResult = (failure, onTerminalRecord) => publishSettledUpdateCommandResult(params, {
		pendingResult,
		failure,
		terminalRecord,
		readReportingState: () => ({
			notify: pendingNotify ? writeRestartSentinel : void 0,
			rolledBack,
			pendingRestartAtMs,
			completedDowntimeMs
		})
	}, onTerminalRecord);
	const deferredTerminal = deferUpdateCommandTerminalResult(params.opts.run, publishFinalResult);
	const recoverFailedResult = async (initialResult, initialRecoverService) => {
		assertCurrent();
		let result = initialResult;
		let recoverService = initialRecoverService;
		if (result.status === "error" && (params.packageTransaction || params.rollbackBlockedReason || params.originalManagedServiceRuntime) && !rollbackAttempted && !isUpdateGatewayReadinessPending(result)) {
			rollbackAttempted = true;
			const rollback = await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, () => rollbackFailedUpdate({
				result,
				previousRoot: params.root,
				packageTransaction: params.packageTransaction,
				rollbackBlockedReason: params.rollbackBlockedReason,
				schemaVersions: params.schemaVersions,
				candidateSchemaVersions: params.candidateSchemaVersions,
				previousSchemaVersions: params.previousSchemaVersions,
				previousVerified: params.previousVerified,
				originalManagedServiceRuntime: params.originalManagedServiceRuntime,
				allowGatewayRestart: params.shouldRestart,
				configSnapshot: params.configSnapshot,
				activationConfig: params.activationConfig,
				opts: params.opts,
				preManagedServiceStop: params.preManagedServiceStop,
				timeoutMs: params.updateStepTimeoutMs,
				nodeRunner: params.packageUpdateNodeRunner,
				invocationCwd: params.invocationCwd,
				definitionRecovery
			}));
			if (params.originalManagedServiceRuntime && rollback.pendingRecoveryReason) throw new UpdateCommandPendingRecoveryFailure(rollback.result, rollback.pendingRecoveryReason);
			result = rollback.result;
			originalServiceRecoveryHandled = rollback.originalServiceRecovery !== void 0;
			rollbackStopState = rollback.stoppedForRollback;
			rolledBack = rollback.rolledBack;
			pendingRestartAtMs ??= rollbackStopState?.stoppedAtMs;
			if (rollback.verifiedAtMs !== void 0) recordVerifiedDowntime(rollback.verifiedAtMs);
			recoverService = false;
		}
		if (result.status === "error" && params.rollbackBlockedReason) {
			result = {
				...result,
				reason: params.rollbackBlockedReason
			};
			recoverService = false;
		} else if (result.status === "error" && params.result.status === "ok" && !params.packageTransaction && params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
			step: "package rollback",
			status: "skipped",
			endedAtMs: Date.now(),
			detail: "No retained previous package transaction is available; automatic package restoration was not attempted."
		}, { env: params.opts.run.env });
		if (isUpdateGatewayReadinessPending(result)) {
			triageAllowed = false;
			return {
				result,
				recoverService: false
			};
		}
		return {
			result,
			recoverService
		};
	};
	const reportResult = async (initialResult, initialRecoverService = false, initialRestoreFailure, notify = true) => {
		const { result, recoverService } = await recoverFailedResult(initialResult, initialRecoverService);
		assertCurrent();
		let restoreFailure = initialRestoreFailure;
		let finalResult = completeUpdateCommandResult(params, result);
		const serviceVerdict = currentServiceStop()?.serviceUpdateVerdict;
		let root = finalResult.recovery?.packageRollbackVerified && serviceVerdict?.kind === "owned" ? serviceVerdict.root : finalResult.root ?? params.root;
		pendingResult = finalResult;
		pendingNotify = notify;
		if (!restoreFailure) try {
			if (!rolledBack && finalResult.status !== "ok" && !isUpdateGatewayReadinessPending(finalResult) && finalResult.recovery?.serviceRestartSafe !== true) await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(false);
			else await resumePostUpdateWindowsAutoStart(params, finalResult, currentServiceStop());
		} catch (cause) {
			restoreFailure = { cause };
		}
		if (restoreFailure) {
			rolledBack = false;
			try {
				await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(false);
			} catch (cause) {
				restoreFailure = { cause: new AggregateError([restoreFailure.cause, cause], `Windows task restoration and compensation failed: ${formatErrorMessage(restoreFailure.cause)}; ${formatErrorMessage(cause)}`) };
			}
			defaultRuntime.error(`Failed to restore Windows Scheduled Task autostart: ${String(restoreFailure.cause)}`);
			finalResult.status = "error";
			finalResult.reason = result.status === "error" ? result.reason : "windows-task-autostart-restore-failed";
			finalResult.recovery = {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			};
			finalResult.steps = finalResult.steps.concat({
				name: "windows-task-autostart-recovery",
				command: "testclaw update",
				cwd: finalResult.root ?? params.root,
				durationMs: 0,
				exitCode: 1,
				stderrTail: formatErrorMessage(restoreFailure.cause)
			});
		}
		const completedBeforeCleanup = deferredTerminal ? await captureUpdateCommandTerminalRecord(params, finalResult, assertCurrent) : void 0;
		assertCurrent();
		recordUpdateResultNextAction(params, finalResult, completedBeforeCleanup?.record);
		if (notify && recoverService) {
			pendingNotify = false;
			await writeRestartSentinel(finalResult);
		}
		if (recoverService && finalResult.recovery?.serviceRestartSafe === true) {
			const service = await maybeRestartServiceAfterFailedMutableUpdate({
				recovery: result.recovery,
				originalManagedServiceRuntime: params.originalManagedServiceRuntime,
				updateRun: params.opts.run,
				preManagedServiceStop: params.preManagedServiceStop,
				jsonMode: Boolean(params.opts.json),
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: params.updateStepTimeoutMs,
				invocationCwd: params.invocationCwd
			});
			if (service && !params.originalManagedServiceRuntime) {
				root = serviceVerdict && "root" in serviceVerdict ? serviceVerdict.root : root;
				finalResult.recovery = {
					...finalResult.recovery,
					service
				};
				if (service === "healthy" && params.shouldRestart) gateway = "verify-running";
				if (service === "failed") {
					finalResult.status = "error";
					try {
						await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(false);
					} catch (cause) {
						return await reportResult(finalResult, false, { cause }, false);
					}
				}
			}
		}
		await currentServiceStop()?.windowsTaskAutoStartRecovery?.complete(rolledBack || isUpdateGatewayReadinessPending(finalResult) || finalResult.status === "ok" || finalResult.recovery?.serviceRestartSafe === true && finalResult.recovery.service === "healthy");
		assertCurrent();
		const cleanupFailure = await recordUpdatePackageCompletion(params, finalResult, assertCurrent);
		assertCurrent();
		finalResult = cleanupFailure?.result ?? finalResult;
		if ((finalResult.status === "error" || cleanupFailure) && !originalServiceRecoveryHandled) {
			finalResult = await verifyUpdateFailureRecovery({
				result: finalResult,
				root,
				opts: params.opts,
				env: currentServiceStop()?.serviceEnv ?? params.ownedManagedUpdateEnv,
				timeoutMs: params.updateStepTimeoutMs,
				serviceStopped: !rolledBack && currentServiceStop()?.stopped,
				assertCurrent
			});
			assertCurrent();
			triageAllowed &&= !isUpdateGatewayReadinessPending(finalResult);
			rolledBack &&= isVerifiedUpdateRollback(finalResult);
		}
		pendingResult = completeUpdateCommandResult(params, finalResult);
		terminalRecord = deferredTerminal ? await captureUpdateCommandTerminalRecord(params, pendingResult, assertCurrent) : void 0;
		assertCurrent();
		const reportedResult = deferredTerminal ? pendingResult : await publishFinalResult();
		if (cleanupFailure) {
			const { detail } = cleanupFailure;
			throw new UpdateCommandFailure(reportedResult, 1, detail, { cause: cleanupFailure });
		}
		if (restoreFailure) {
			const priorDetail = [result.reason, params.failure?.detail].filter(Boolean).join(": ");
			const detail = `${priorDetail ? `${priorDetail}; ` : ""}Windows Scheduled Task autostart recovery failed: ` + formatErrorMessage(restoreFailure.cause);
			const cause = params.failure ? new AggregateError([params.failure.cause, restoreFailure.cause], detail, { cause: restoreFailure.cause }) : restoreFailure.cause;
			throw createFailure(reportedResult, resolveManagedServiceUpdateFailureExitCode(reportedResult), detail, { cause });
		}
		return reportedResult;
	};
	const restoreWindowsAutoStart = async (result) => {
		try {
			await resumePostUpdateWindowsAutoStart(params, result, currentServiceStop());
		} catch (cause) {
			await reportResult(result, false, { cause });
		}
	};
	try {
		if (params.result.status === "error" || params.result.recovery?.serviceRestartSafe === false) {
			const reported = await reportResult({
				...params.result,
				status: "error"
			}, params.result.recovery?.serviceRestartSafe === true);
			throw createFailure(reported, resolveManagedServiceUpdateFailureExitCode(reported), params.failure?.detail, params.failure);
		}
		if (params.result.status === "skipped" && !params.coreAlreadyCurrent) {
			const reported = await reportResult(params.result, params.result.recovery?.serviceRestartSafe === true);
			throw createFailure(reported, classifyUpdateOutcome(reported) === "failed" ? resolveManagedServiceUpdateFailureExitCode(reported) : 0);
		}
		const postUpdateRoot = params.result.root ?? params.root;
		const convergePlugins = async (beforeDoctor) => {
			const convergence = await convergeUpdatePlugins({
				...params,
				beforeDoctor: beforeDoctor ?? parkForegroundOrigin,
				beforeRuntimePublication: parkForegroundOrigin,
				assertCurrent,
				candidateRuntime
			});
			if (convergence.resultWithPostUpdate.status === "error") {
				triageAllowed = !convergence.cancelled;
				const reported = await reportResult(convergence.resultWithPostUpdate);
				throw createFailure(reported, resolveManagedServiceUpdateFailureExitCode(reported), convergence.detail);
			}
			return convergence;
		};
		const deferPluginConvergence = shouldRestart && params.coreAlreadyCurrent === true && params.preManagedServiceStop?.serviceUpdateVerdict?.kind === "owned";
		let resultWithPostUpdate = params.result;
		let postUpdateConfigSnapshot;
		if (!deferPluginConvergence) {
			({resultWithPostUpdate, postUpdateConfigSnapshot} = await convergePlugins());
			if (params.coreAlreadyCurrent) return await reportResult(resultWithPostUpdate);
		}
		const restartConfigSnapshot = postUpdateConfigSnapshot ?? await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => readConfigFileSnapshot({
			observe: false,
			skipPluginValidation: true,
			suppressFutureVersionWarning: true
		}));
		let restartContext;
		try {
			restartContext = await prepareUpdateRestart({
				...params,
				shouldRestart,
				result: resultWithPostUpdate
			}, restartConfigSnapshot);
		} catch (error) {
			const message = error instanceof GatewayServiceUpdateOwnershipError ? error.message : formatErrorMessage(error);
			defaultRuntime.error(message);
			const reported = await reportResult({
				...resultWithPostUpdate,
				status: "error",
				reason: "service-revalidation-failed"
			});
			throw createFailure(reported, resolveManagedServiceUpdateFailureExitCode(reported), message, { cause: error });
		}
		const notifyRestart = () => writeRestartSentinel(buildControlPlaneUpdateRestartHealthPendingResult(resultWithPostUpdate));
		if (!params.coreAlreadyCurrent) {
			await notifyRestart();
			await restoreWindowsAutoStart(resultWithPostUpdate);
		}
		let verificationFailure = "restart-unhealthy";
		const restart = async () => {
			const restarted = await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => maybeRestartService({
				originalManagedServiceRuntime: params.originalManagedServiceRuntime,
				shouldRestart: shouldRestart && restartContext.serviceMutationAllowed,
				result: resultWithPostUpdate,
				opts: params.opts,
				refreshServiceEnv: restartContext.refreshGatewayServiceEnv,
				definitionRecovery,
				serviceUpdateVerdict: restartContext.serviceUpdateVerdict,
				serviceManagerUid: restartContext.serviceManagerUid,
				serviceRuntimeRefreshRequired: params.serviceRuntimeRefreshRequired,
				serviceEnv: restartContext.gatewayServiceEnv,
				serviceInstallEnv: restartContext.gatewayServiceInstallEnv,
				gatewayPort: restartContext.gatewayPort,
				invocationCwd: params.invocationCwd,
				nodeRunner: params.packageUpdateNodeRunner,
				skipLegacyServiceRestart: restartContext.skipLegacyServiceRestart,
				requireRunningServiceAfterRestart: currentServiceStop()?.stopped === true,
				serviceMutationSkipMessage: restartContext.serviceMutationSkipMessage,
				timeoutMs: params.updateStepTimeoutMs,
				onVerificationFailure: (reason) => {
					verificationFailure = reason;
				},
				onPluginWarnings: (warnings) => {
					resultWithPostUpdate = appendPluginUpdateWarnings(resultWithPostUpdate, warnings);
				},
				onVerified: recordVerifiedDowntime
			}));
			if (restarted !== "failed" && restarted !== "restart-health-failed") return restarted === "ok";
			triageAllowed = restartContext.serviceMutationAllowed;
			if (restarted === "restart-health-failed" && params.shouldRestart && restartContext.serviceMutationAllowed && (params.preManagedServiceStop?.running !== false || params.preManagedServiceStop.stopped) && !restartContext.skipLegacyServiceRestart) gateway = "verify-running";
			const failure = {
				...resultWithPostUpdate,
				status: "error",
				reason: verificationFailure,
				recovery: {
					serviceRestartSafe: false,
					reason: "runtime-verification-failed"
				}
			};
			const recovered = await recoverFailedResult(failure, false);
			if (recovered.result.status !== "ok") {
				await markControlPlaneUpdateRestartSentinelFailureBestEffort({
					...sentinelOptions,
					reason: recovered.result.reason ?? verificationFailure
				});
				const reported = await reportResult(recovered.result, false, void 0, false);
				throw createFailure(reported, resolveManagedServiceUpdateFailureExitCode(reported));
			}
			resultWithPostUpdate = recovered.result;
			return true;
		};
		if (!params.coreAlreadyCurrent) await restart();
		if (deferPluginConvergence) {
			({resultWithPostUpdate, postUpdateConfigSnapshot} = await convergePlugins(async () => {
				const before = currentServiceStop();
				if (!before) throw new Error("Plugin maintenance lost its update service owner.");
				await before.windowsTaskAutoStartRecovery?.complete(true);
				const stopped = await maybeStopManagedServiceBeforeMutableUpdate({
					updateRun: params.opts.run,
					updateInstallKind: resultWithPostUpdate.mode === "git" ? "git" : "package",
					root: postUpdateRoot,
					shouldRestart: true,
					jsonMode: Boolean(params.opts.json),
					expectedService: before,
					phase: "prepare",
					timeoutMs: params.updateStepTimeoutMs,
					onStopped: (state) => {
						rollbackStopState = state;
						pendingRestartAtMs ??= state.stoppedAtMs;
					}
				});
				rollbackStopState = stopped;
				before.windowsTaskAutoStartRecovery = stopped.windowsTaskAutoStartRecovery;
				if (stopped.blockMessage || !stopped.stopped) throw new Error(stopped.blockMessage ?? "Gateway could not be parked for plugin maintenance.");
				stopped.windowsTaskAutoStartRecovery?.beginMutation();
				pendingRestartAtMs ??= stopped.stoppedAtMs;
			}));
			const requiresInstallRootRefresh = restartContext.serviceUpdateVerdict?.kind === "owned" && restartContext.serviceUpdateVerdict.requiresInstallRootRefresh;
			if (resultWithPostUpdate.postUpdate?.plugins?.changed || params.serviceRuntimeRefreshRequired || requiresInstallRootRefresh) {
				restartContext = await prepareUpdateRestart({
					...params,
					result: resultWithPostUpdate,
					shouldRestart,
					preManagedServiceStop: currentServiceStop()
				}, postUpdateConfigSnapshot ?? restartConfigSnapshot);
				pendingRestartAtMs ??= Date.now();
				if (!params.serviceRuntimeRefreshRequired && !requiresInstallRootRefresh) restartContext.refreshGatewayServiceEnv = false;
				await notifyRestart();
				await restoreWindowsAutoStart(resultWithPostUpdate);
				const reconciled = await restart();
				if (requiresInstallRootRefresh && reconciled && resultWithPostUpdate.status === "skipped") {
					resultWithPostUpdate.status = "ok";
					delete resultWithPostUpdate.reason;
				}
			}
			return await reportResult(resultWithPostUpdate);
		}
		const maintenanceFailure = await completePostUpdateMaintenance(params, resultWithPostUpdate, assertCurrent, {
			root: postUpdateRoot,
			sentinel: sentinelOptions
		});
		if (maintenanceFailure) throw createFailure(await reportResult(maintenanceFailure.result, false, void 0, false), 1, maintenanceFailure.detail);
		return await reportResult(resultWithPostUpdate);
	} catch (error) {
		if (params.originalManagedServiceRuntime && error instanceof UpdateCommandRecoveryPendingError) throw new UpdateCommandPendingRecoveryFailure(pendingResult, formatErrorMessage(error), { cause: error });
		if (error instanceof UpdateCommandFailure || hasCommandProcessCleanupError(error)) throw error;
		const { result, message } = createPostUpdateFailureResult(params, error);
		defaultRuntime.error(`Post-update verification failed: ${message}`);
		const reported = await reportResult(result);
		throw createFailure(reported, resolveManagedServiceUpdateFailureExitCode(reported), message, { cause: error });
	}
}
//#endregion
export { resumePostCoreUpdate as a, createUpdateCommandFinalizationFence as i, assertUpdateCommandRecovery as n, createUpdateTimeoutHandoff as o, assertUpdateCommandRecoveryState as r, isOmittedUpdateTimeout as s, finishUpdate as t };
