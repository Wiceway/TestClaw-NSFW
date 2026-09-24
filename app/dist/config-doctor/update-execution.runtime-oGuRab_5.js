import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as theme } from "./theme-DLJw9KCD.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseStrictPositiveInteger } from "./number-coercion-0M4tZV2c.js";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.js";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-QV2nsx8w.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as VERSION } from "./version-BdHihr00.js";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.js";
import { s as resolveSqliteInspectionBudget } from "./sqlite-readonly-worker-B2DLf5L4.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { q as isUnfencedUpdateDriver } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { o as assertAssistantStateWriteAllowedAtPath } from "./testclaw-state-ownership-B0rMwXgw.js";
import { n as replaceFileAtomic } from "./replace-file-GThucKH8.js";
import { d as writeJson, l as tryReadJson, o as readJsonIfExists } from "./json-files-DAp75qfY.js";
import { T as setPluginInstallRecordMapEntry, a as loadInstalledPluginIndexInstallRecords, w as serializePluginInstallRecordMap, y as createPluginInstallRecordMap } from "./installed-plugin-record-match-DU0U5gm6.js";
import { g as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-CGWZEj0Z.js";
import { c as normalizeUpdateChannel } from "./update-channels-BBbFgcw3.js";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-BKl_GqCp.js";
import { a as hashConfigRaw, d as resolveConfigIncludesForRead, s as normalizeConfigIoDeps, u as resolveConfigForRead } from "./io.read-helpers-DjrAb5Uv.js";
import { n as UpdateFailureFactSchema } from "./update-run-schema-CfrM5CV3.js";
import { a as redactSupportDiagnosticLine, o as redactSupportString } from "./diagnostic-support-redaction-DgR7hMLl.js";
import { f as isVerifiedUpdateRollback, s as classifyUpdateOutcome } from "./update-outcome-Dj5_EBo1.js";
import { i as parseConfigFailureFacts, l as createUpdatePreflightFailure, n as createUpdateFailureFact, r as normalizeUpdateFailureFacts } from "./update-failure-facts-CzM99Hgb.js";
import { c as consumeUpdatePostInstallDoctorResult, f as normalizeUpdatePostInstallDoctorWarnings, r as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, s as collectUpdateDoctorFailureFacts, t as DoctorMaintenanceRefusalError, u as createUpdatePostInstallDoctorResultPath } from "./update-doctor-result-fRe8i0lu.js";
import { i as createManagedHandoffProcessIdentityReader } from "./update-managed-service-handoff-lease-BvLK_tcK.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-DYABQcWw.js";
import { c as readConfigFileSnapshot } from "./io.runtime-C0vFx1Ic.js";
import { c as withConfigMutationLock } from "./mutate-CFZDg_sD.js";
import "./config-CiBXBfE2.js";
import { a as runUtf8CommandWithTimeout, n as runExec } from "./exec-BXnQTpXR.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { l as withCommandProcessScope } from "./exec-spawn-USR_FeKZ.js";
import { r as getActiveManagedProxyUrl, t as getActiveManagedProxyLoopbackMode } from "./active-proxy-state-Cv_uMpbF.js";
import { r as registerManagedProxyGatewayLoopbackBypass } from "./proxy-lifecycle-COQ0mjG9.js";
import { r as restorePersistedInstalledPluginIndexIfCurrent } from "./installed-plugin-index-store-write-Bn0VUh5Y.js";
import { o as writePersistedInstalledPluginIndexInstallRecordsWithLease } from "./installed-plugin-index-records-NgkzYl8d.js";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DKTfQpId.js";
import { t as CLI_NAME } from "./cli-name-CJ5c6edK.js";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-qoN9ZO1h.js";
import { n as updateInstallRootsMatch, t as resolveUpdateInstallRoot } from "./update-install-root-Cdtzz5MM.js";
import { r as readPackageVersion } from "./package-json-CT4OsNvS.js";
import { s as resolveManagedGatewayServiceProcessEnv } from "./service-types-D9NIqD52.js";
import { f as ScheduledTaskAutoStartRecoveryError } from "./schtasks-COcnfadp.js";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-zvUg9jSi.js";
import { f as recordUpdateRunPhase, h as recordUpdateRunStep, y as UpdateRecoveryRequiredError } from "./update-run-ledger-DLD5Q47c.js";
import { r as getUpdateRun } from "./update-run-reader-CA3WJ8vB.js";
import { t as createUpdateDoctorConfigWarningStep } from "./update-doctor-config-BrLAVDg0.js";
import { i as updateRunStepsFromResultStep, n as isFailedUpdateStep, r as isUpdateGatewayReadinessPending } from "./update-run-step-Bl6FePhX.js";
import { t as UpdateSnapshotCapacityError } from "./update-snapshot-capacity-f5lT323M.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CRLdx-fN.js";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-lSBwGN47.js";
import { c as resolveManagedServiceUpdateFailureExitCode, d as normalizeControlPlaneUpdateResult, i as buildControlPlaneUpdateRestartHealthPendingResult, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV, r as UPDATE_RUN_ID_ENV, s as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-DsR_Dem9.js";
import { n as restoreGatewayServiceDefinitionBackup, r as verifyGatewayServiceDefinitionBackup } from "./service-definition-backup-C27IJDhE.js";
import { a as resolveManagedUpdateRequester, n as createManagedUpdateRequesterAuthority, r as createManagedUpdateRequesterContinuationAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-NppA3WQu.js";
import { n as parseAssistantSchemaVersions, t as parsePackageAssistantSchemaVersions } from "./testclaw-schema-versions-7gdJhvJg.js";
import { c as withOwnedManagedUpdateEnv, i as resolveServiceRefreshEnv, o as resolveUpdatedInstallCommandEnv, s as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv } from "./update-command-service-env-DYcjXvvU.js";
import { C as verifyPackageUpdateRecovery, o as canResolveRegistryVersionForPackageTarget } from "./update-runner-command-DRKLhVpa.js";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-DnU46Qxp.js";
import { a as requiresRetainedUpdateCommandOwner, c as withUpdateCommandExecutorChild, d as UpdateCommandRecoveryPendingError, r as captureUpdateCommandExecutorAuthority, s as withUpdateCommandExecutor } from "./update-command-executor-DuTNaN2c.js";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV, c as buildPostCoreHandoffEnv, n as POST_CORE_UPDATE_ENV, o as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV, r as POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV, s as POST_CORE_UPDATE_STARTED_AT_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-4DzUDiDA.js";
import { n as compareSemverStrings } from "./update-check-D4M5AA5a.js";
import { d as resolveGitInstallDir, l as parseUpdateTimeoutMs, n as UpdatePreMutationError, s as normalizeTag, v as resolveNodeRunner } from "./shared-BUgQgLm0.js";
import { a as parseUpdateDoctorLintReport, n as applyUpdateDoctorLintReport } from "./update-doctor-lint-ucnpJj2Y.js";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-D3NArm3X.js";
import { l as writeUpdateRunReportArtifact } from "./update-failure-report-artifact-CAapSyXZ.js";
import { r as loadUpdateRecovery, t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-yJ0TbWTp.js";
import { n as NativePackageRollbackError } from "./package-update-steps-D7b2liL3.js";
import { n as resolveUpdateDoctorExecutionPolicy } from "./update-runner-doctor-DoQcwses.js";
import { n as readUpdateConfigSnapshot } from "./update-command-config-snapshot-CBpP0KDp.js";
import { i as runPackageInstallUpdate, n as preparePackageDoctorContext, r as readPackageUpdateIdentity } from "./update-command-package-4wCnB9RO.js";
import { f as resolvePackageRuntimePreflight, i as assertGatewayServiceManagementAllowedForUpdate, n as GatewayServiceUpdateOwnershipError, p as resolveUpdatedGatewayRestartPort, s as isGatewayServiceManagementAllowedForUpdate, u as resolveGatewayServiceManagementBlockMessageForUpdate } from "./update-command-service-plan-CJ1UFeyr.js";
import { a as collectServiceInspectionFailureFacts, c as markControlPlaneUpdateRestartSentinelFailureBestEffort, g as resolveMutableUpdateFailure, h as resolveAutomaticUpdateTriage, i as UpdateCommandPendingRecoveryFailure, n as UpdateCommandFailure, p as recordUpdateResultNextAction, u as prepareUpdateServiceResult, v as writeControlPlaneUpdateRestartSentinelBestEffort } from "./update-command-result-CBXlnujV.js";
import { a as preparePostCorePluginConfig, i as persistValidatedDowngradeConfig, l as writePostCoreSourceConfigFile, n as normalizePluginInstallRecordMap, o as readPostCorePreUpdateSourceConfig, t as maybeRepairLegacyConfigForUpdateChannel } from "./update-command-config-IaaoLXkX.js";
import { i as parkForegroundUpdateForActivation, r as handoffUpdateFromGateway, t as formatUpdateAncestryBlockMessage } from "./update-command-handoff-D4ZQzt2T.js";
import { a as revalidateUpdateDatabaseContext, i as readUpdateCandidateSource, n as captureOwnedManagedUpdateContext } from "./update-command-managed-context-C0iYNXEp.js";
import { h as isUpdatedInstallGatewayExecutorSupported, i as verifyPreviousManagedGatewayForUpdate, l as observeOriginalManagedServiceRuntime, m as isPackageManagerUpdateMode, o as compensateOriginalManagedService, s as maybeRestartServiceAfterFailedMutableUpdate } from "./update-command-verification-CA2hYAsZ.js";
import { a as UpdateCommandAbort, i as shouldBlockMutableUpdateFromGatewayServiceEnv, n as maybeResumeWindowsTaskAutoStartAfterPackageUpdate, o as revalidateManagedGatewayServiceAfterUpdate, r as maybeStopManagedServiceBeforeMutableUpdate, t as createWindowsTaskAutoStartGuard } from "./update-command-service-maintenance-UY-WidjP.js";
import { a as collectPostCorePluginFailureFacts, i as collectPostCorePluginAdvisories, t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-BGZUZuxB.js";
import { a as shouldPrepareUpdatedInstallRestart, i as resolvePostUpdateServiceStateReadEnv, n as revalidateUpdateDatabaseContexts, o as tryInstallShellCompletion, r as maybeRestartService, t as inspectUpdateDatabaseContexts } from "./update-command-database-context-Cce3e3xq.js";
import { t as verifyUpdateFailureRecovery } from "./update-command-failure-recovery-BxeJXh43.js";
import { S as createUpdateCommandAuthority, a as recordUpdatePackageCompletion, c as resolveSettledUpdateCommandResult, i as publishUpdateCommandTerminalResult, t as deferUpdateCommandTerminalResult, u as captureUpdateCommandTerminalRecord } from "./update-command-terminal-DclZGDYR.js";
import { a as resolveUpdateStateContentVersion, i as readUpdateStateSchemaVersions, o as updateStateSchemaVersionsMatch } from "./update-candidate-state-CM0AfPoT.js";
import { t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-CahiJZ1y.js";
import { i as runUpdateFinalizationDoctorInFreshProcess, n as updatePluginsAfterCoreUpdate, r as completePostCorePluginUpdate, t as completeSourceUpdateRuntime } from "./update-command-runtime-DzJqUJ_S.js";
import { i as cleanupUpdateTemporaryDirectory, n as retireStandaloneGitWrapper, r as updateGitInstall } from "./update-command-git-DdlnzK61.js";
import { i as createPackageRuntimeRecovery, t as captureUpdateActivationSchemas } from "./update-command-schema-9zf9N36P.js";
import { t as preflightConfiguredNpmPluginTargets } from "./update-command-plugin-preflight-BL1kZG7d.js";
import { t as resolveUpdateFinalizationTimeoutMs } from "./update-finalization-budget-CnCs64RF.js";
import "./io.write-BfB62C_8.js";
import { t as prepareUpdateCandidateRehearsal } from "./update-candidate-rehearsal-DwYaBmF8.js";
import { n as recordPostCoreUpdateEvidence } from "./update-run-interruption-ChGJYvv5.js";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import JSON5 from "json5";
//#region src/infra/update-candidate-canary-process.ts
function launchCanary(params) {
	const { entry, args, env, capture } = params;
	params.assertCurrent?.();
	const child = spawn(params.nodeRunner ?? process.execPath, [entry, ...args], {
		cwd: params.root,
		env,
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	let stdout = "";
	let firstStderrLine;
	let cliReason;
	const captureStderr = (line) => {
		if (!line.trim()) return;
		const safe = redactSupportDiagnosticLine(line, {
			env,
			stateDir: params.stateDir
		});
		firstStderrLine ??= safe;
		if (line.startsWith("[testclaw] Reason: ")) cliReason ??= safe.replace(/^\[testclaw\] Reason: /u, "");
	};
	let stdoutBytes = 0;
	let outputExceeded = false;
	const flushers = [child.stdout, child.stderr].map((stream) => {
		stream.setEncoding("utf8");
		let pending = "";
		let droppingLine = false;
		stream.on("data", (chunk) => {
			let text = chunk;
			if (droppingLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				droppingLine = false;
			}
			pending += text;
			const lines = pending.split(/\r?\n/u);
			pending = lines.pop() ?? "";
			for (const line of lines) {
				if (stream === child.stderr) captureStderr(line);
				capture(line);
				params.onLine?.(line);
			}
			if (pending.length > 65536) {
				pending = "";
				droppingLine = true;
				if (stream === child.stderr) firstStderrLine ??= "[oversized log line omitted]";
				capture("[oversized log line omitted]");
			}
		});
		return () => {
			if (pending) {
				if (stream === child.stderr) captureStderr(pending);
				capture(pending);
				params.onLine?.(pending);
				pending = "";
			}
		};
	});
	child.stdout.on("data", (chunk) => {
		stdoutBytes += Buffer.byteLength(chunk);
		if (stdoutBytes <= 1048576) {
			stdout += chunk;
			params.onStdout?.(stdout);
		} else outputExceeded = true;
	});
	let exited = false;
	let processExited = false;
	return {
		child,
		result: new Promise((resolve) => {
			child.once("exit", (code) => {
				processExited = true;
				if (code !== 0) resolve(code);
			});
			child.once("error", (error) => {
				captureStderr(error.message);
				capture(error.message);
				exited = true;
				resolve(null);
			});
			child.once("close", (code) => {
				for (const flush of flushers) flush();
				exited = true;
				resolve(code);
			});
		}),
		closed: new Promise((resolve) => {
			child.once("close", () => resolve());
		}),
		hasExited: () => exited,
		processExited: () => processExited,
		stdout: () => stdout,
		firstStderrLine: () => cliReason ?? firstStderrLine,
		outputExceeded: () => outputExceeded
	};
}
async function waitBounded(promise, milliseconds, signal) {
	let timer;
	let abort;
	try {
		return await Promise.race([promise.then((value) => ({
			status: "completed",
			value
		})), new Promise((resolve) => {
			timer = setTimeout(() => resolve({ status: "deadline" }), Math.max(0, milliseconds));
			abort = () => resolve({ status: "aborted" });
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) abort();
		})]);
	} finally {
		clearTimeout(timer);
		if (abort) signal?.removeEventListener("abort", abort);
	}
}
async function terminateCanary(child, closed, deadline) {
	if (!child.pid) return true;
	const options = { detached: process.platform !== "win32" };
	const signal = (kind) => new Promise((resolve) => {
		signalProcessTree(child.pid, kind, {
			...options,
			onComplete: resolve
		});
	});
	const term = signal("SIGTERM");
	await waitBounded(Promise.all([term, closed]), Math.min(1e3, Math.max(0, deadline - Date.now())));
	return (await waitBounded(Promise.all([
		term,
		signal("SIGKILL"),
		closed
	]), Math.min(1e3, Math.max(0, deadline - Date.now())))).status === "completed";
}
//#endregion
//#region src/infra/update-candidate-canary-readiness.ts
/** Poll candidate control-plane endpoints under the existing managed loopback policy. */
async function waitForUpdateCandidateReadiness(params) {
	const deadline = new AbortController();
	const cancelDeadline = scheduleAbsoluteDeadline(params.workDeadline, () => deadline.abort());
	const signal = AbortSignal.any([deadline.signal, ...params.signal ? [params.signal] : []]);
	const assertRunning = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		if (params.hasExited()) throw new Error(params.getExitReason() ?? "The updated Gateway exited before it was ready");
	};
	try {
		for (const endpoint of ["startupz", "readyz"]) {
			params.onEndpoint(endpoint);
			const url = `http://127.0.0.1:${params.port}/${endpoint}`;
			const releaseBypass = registerManagedProxyGatewayLoopbackBypass(url);
			const proxy = getActiveManagedProxyLoopbackMode() === "proxy" ? getActiveManagedProxyUrl() : void 0;
			let failure;
			try {
				while (true) {
					assertRunning();
					if (Date.now() >= params.workDeadline) {
						if (!failure) throw new Error("Update validation deadline exceeded");
						params.capture(failure.message);
						return failure;
					}
					let outcome = "";
					let ready = false;
					try {
						const response = await fetch(url, { signal });
						outcome = `HTTP ${response.status}`;
						if (response.status === 200) {
							const payload = await response.json();
							ready = endpoint === "readyz" || isRecord(payload) && payload.status === "started";
							outcome += " (startup response not ready within the validation budget)";
						} else await response.body?.cancel();
					} catch (error) {
						outcome = `${outcome ? `${outcome}: ` : ""}${formatErrorMessageWithCode(error)}`;
					}
					assertRunning();
					if (ready && Date.now() < params.workDeadline) {
						params.capture(`${endpoint}: ${endpoint === "startupz" ? "started" : "ready"} (${Date.now() - params.started}ms)`);
						break;
					}
					if (!deadline.signal.aborted || !failure) {
						const detail = redactSupportDiagnosticLine(outcome, params);
						const nextStep = "Check Gateway logs and proxy.loopbackMode; rerun testclaw update.";
						failure = {
							message: redactSupportString(`Readiness probe ${url} failed: ${detail}${proxy ? ` (via proxy ${proxy.origin})` : ""}. ${nextStep}`, params),
							fact: createUpdateFailureFact({
								check: endpoint,
								code: "candidate-readiness-probe-failed",
								message: `Readiness probe ${endpoint} failed: ${detail}. ${nextStep}`
							}, params.env)
						};
					}
					await setTimeout$1(Math.min(100, Math.max(1, params.workDeadline - Date.now())), void 0, { signal: params.signal });
				}
			} finally {
				releaseBypass?.();
			}
		}
		return;
	} finally {
		cancelDeadline();
	}
}
//#endregion
//#region src/infra/update-candidate-canary.ts
/** Rehearse the exact candidate against private SQLite snapshots while the serving generation stays up. */
async function validateUpdateCandidateCanary(params) {
	const started = Date.now();
	let rehearsal;
	const sourceEnv = params.env ?? process.env;
	const logTail = [];
	const stepLogTail = [];
	let activeStep = {
		name: "candidate-runtime",
		command: "Checking update runtime"
	};
	let stepStartedAt = started;
	let activeLintStep;
	const steps = [];
	const cleanupRehearsal = async () => {
		if (!rehearsal) return;
		for (const directory of rehearsal.cleanupDirectories) await cleanupUpdateTemporaryDirectory({
			directory,
			root: params.root,
			name: directory === rehearsal.stateDir ? "candidate-state-cleanup" : "candidate-plugin-inventory-cleanup",
			onWarning: (step) => {
				steps.push(step);
				params.onStep?.(step);
			}
		});
	};
	let candidateSchemaVersions;
	let gatewayRestartCompletion = false;
	let doctorConfigWrites = false;
	let doctorConfigChanges = [];
	let listenerIsolation;
	let phase = "runtime";
	let env = { ...sourceEnv };
	const capture = (chunk) => {
		const safe = redactSupportString(String(chunk), {
			env,
			stateDir: params.stateDir
		}, { maxLength: 2e4 });
		const lines = safe.split(/\r?\n/u).filter(Boolean).map((line) => line.slice(-512));
		for (const tail of [logTail, stepLogTail]) {
			tail.push(...lines);
			tail.splice(0, Math.max(0, tail.length - 40));
		}
		return safe;
	};
	const launch = (entry, args, observers = {}) => launchCanary({
		...observers,
		entry,
		args,
		root: params.root,
		env,
		nodeRunner: params.nodeRunner,
		stateDir: params.stateDir,
		assertCurrent: params.assertCurrent,
		capture
	});
	const stopCanary = async (running, name, deadline) => {
		const cleanupStarted = Date.now();
		if (await terminateCanary(running.child, running.closed, deadline)) return true;
		const step = {
			name: `${name}-cleanup`,
			command: "SIGTERM, SIGKILL",
			cwd: params.root,
			durationMs: Date.now() - cleanupStarted,
			exitCode: null,
			advisory: {
				kind: "recoverable-maintenance",
				message: "Update cleanup deadline elapsed before process close and termination requests both completed. Update validation results are unchanged."
			}
		};
		steps.push(step);
		params.onStep?.(step);
		return false;
	};
	try {
		const entry = await resolveGatewayInstallEntrypoint(params.root);
		if (!entry) throw new Error("The update is missing its Gateway executable");
		const continuationEntry = path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath);
		try {
			await fs.lstat(continuationEntry);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
			const message = "This version uses the current updater to finish installation";
			const step = {
				name: "candidate-recovery",
				command: "--check",
				cwd: params.root,
				durationMs: Date.now() - started,
				exitCode: null,
				stdoutTail: message,
				advisory: {
					kind: "candidate-runtime-unavailable",
					message
				}
			};
			steps.push(step);
			params.onStep?.(step);
			return {
				status: "ok",
				phase,
				durationMs: Date.now() - started,
				logTail,
				steps
			};
		}
		if (!resolveUpdateDoctorExecutionPolicy({
			targetVersion: await readPackageVersion(params.root),
			allowGatewayServiceRepair: false
		}).fix) throw new Error("Cannot check migrations without changing the running service");
		phase = "snapshot";
		activeStep = {
			name: "candidate-state-snapshot",
			command: "Preparing update checks"
		};
		stepStartedAt = Date.now();
		rehearsal = await prepareUpdateCandidateRehearsal({
			candidateRoot: params.root,
			config: params.config,
			stateDir: params.stateDir,
			env: sourceEnv,
			nodeRunner: params.nodeRunner,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		const snapshotDuration = Date.now() - stepStartedAt;
		const snapshotStep = {
			...activeStep,
			cwd: params.root,
			durationMs: snapshotDuration,
			exitCode: 0,
			snapshotCapacity: rehearsal.snapshotCapacity
		};
		steps.push(snapshotStep);
		params.onStep?.(snapshotStep);
		env = { ...rehearsal.env };
		const { port, stateDir: copiedStateDir } = rehearsal;
		const doctorResultOptions = { tmpdir: () => copiedStateDir };
		listenerIsolation = {
			gateway: {
				host: "127.0.0.1",
				port
			},
			mcpAppSandbox: "disabled"
		};
		const commands = [
			{
				phase: "doctor",
				name: "candidate-doctor",
				args: [
					"doctor",
					"--fix",
					"--non-interactive",
					"--no-workspace-suggestions"
				]
			},
			{
				phase: "lint",
				name: "candidate-doctor-lint",
				args: [
					"doctor",
					"--lint",
					"--json",
					"--severity-min",
					"error"
				]
			},
			{
				phase: "config",
				name: "candidate-config",
				args: [
					"config",
					"validate",
					"--json"
				]
			},
			{
				phase: "plugins",
				name: "candidate-plugins",
				args: [
					"plugins",
					"list",
					"--json"
				]
			},
			{
				phase: "runtime",
				name: "candidate-recovery",
				entry: continuationEntry,
				args: ["--check"]
			}
		];
		const processBudget = resolveSqliteInspectionBudget("update validation", copiedStateDir, rehearsal.snapshotCapacity.sqliteBytes + (rehearsal.snapshotCapacity.pluginBytes ?? 0)).timeoutMs;
		const budget = Math.max(1, params.timeoutMs ?? processBudget);
		let deadline = 0;
		let workDeadline = 0;
		const startBudget = () => {
			deadline = Date.now() + budget;
			workDeadline = deadline - Math.min(2e3, Math.floor(budget / 10));
		};
		const remaining = () => {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			const milliseconds = workDeadline - Date.now();
			if (milliseconds <= 0) throw new Error("Update validation deadline exceeded");
			return milliseconds;
		};
		for (const command of commands) {
			phase = command.phase;
			activeLintStep = void 0;
			env.TESTCLAW_UPDATE_IN_PROGRESS = phase === "doctor" ? "1" : "0";
			activeStep = {
				name: command.name,
				command: command.args.join(" ")
			};
			stepStartedAt = Date.now();
			stepLogTail.length = 0;
			startBudget();
			remaining();
			const doctorResultPath = phase === "doctor" ? createUpdatePostInstallDoctorResultPath(doctorResultOptions) : void 0;
			env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV] = doctorResultPath;
			const configBeforeDoctor = doctorResultPath ? JSON5.parse(await fs.readFile(rehearsal.configPath, "utf8")) : void 0;
			let checksCompletedAt;
			const disposalWarnings = [];
			const running = launch(command.entry ?? entry, command.args, {
				onLine: (line) => {
					const plain = stripVTControlCharacters(line).trim();
					if (phase === "lint" && plain.startsWith("[warning] Doctor disposal")) disposalWarnings.push(redactSupportString(plain, {
						env,
						stateDir: params.stateDir
					}));
					if (phase === "doctor" && /^(?:└\s*)?Doctor complete\.$/u.test(plain)) checksCompletedAt ??= Date.now();
				},
				onStdout: (stdout) => {
					if (phase === "lint") try {
						parseUpdateDoctorLintReport(stdout);
						checksCompletedAt ??= Date.now();
					} catch {
						checksCompletedAt = void 0;
					}
				}
			});
			let code = null;
			let doctorAdvisory;
			let doctorReceipt = null;
			const pluginFailures = [];
			const pluginObservations = [];
			let timedOut = false;
			let timeoutMessage;
			let exitWarning;
			try {
				const outcome = await waitBounded(running.result, remaining(), params.signal);
				code = outcome.status === "completed" ? outcome.value : 1;
				timedOut = outcome.status === "deadline";
				if (timedOut) {
					const elapsed = Date.now() - stepStartedAt;
					const lintReport = phase === "lint" && checksCompletedAt !== void 0 && !running.outputExceeded() ? parseUpdateDoctorLintReport(running.stdout(), env) : void 0;
					const completed = checksCompletedAt !== void 0 && (phase === "doctor" || lintReport);
					timeoutMessage = `Update ${phase} checks phase timed out (${elapsed}ms)`;
					if (completed && checksCompletedAt !== void 0) {
						exitWarning = `Update ${phase} exit phase timed out after ${Date.now() - checksCompletedAt}ms (${elapsed}ms total); checks completed; ${running.processExited() ? "output pipes stayed open" : "process did not exit"}. Continuing with recorded check results.`;
						code = phase === "doctor" || lintReport && (lintReport.ok || lintReport.advisoryOnly) && !lintReport.failureFacts.length ? 0 : 1;
					}
				}
			} finally {
				await stopCanary(running, command.name, deadline);
				if (doctorResultPath) {
					doctorReceipt = await consumeUpdatePostInstallDoctorResult(doctorResultPath, doctorResultOptions);
					if (doctorReceipt?.status === "error") code = 1;
					doctorConfigChanges = doctorReceipt?.configChanges ?? [];
					if (!doctorReceipt?.configChanges && isRecord(configBeforeDoctor)) {
						const after = JSON5.parse(await fs.readFile(rehearsal.configPath, "utf8"));
						if (isRecord(after)) doctorConfigChanges = [.../* @__PURE__ */ new Set([...Object.keys(configBeforeDoctor), ...Object.keys(after)])].filter((key) => !isDeepStrictEqual(configBeforeDoctor[key], after[key])).toSorted().map((key) => ({
							kind: "key",
							key
						}));
					}
					if (code === 86 && doctorReceipt?.status === "advisory") doctorAdvisory = {
						kind: "recoverable-maintenance",
						message: doctorReceipt.advisory.details.join("\n")
					};
				}
			}
			activeLintStep = phase === "lint" ? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: running.child.exitCode,
				signal: running.child.signalCode,
				killed: running.child.killed,
				termination: timedOut ? "timeout" : running.child.signalCode ? "signal" : "exit",
				outputLimitExceeded: running.outputExceeded(),
				doctorLintFindings: []
			} : void 0;
			params.signal?.throwIfAborted();
			const lintReport = activeLintStep ? applyUpdateDoctorLintReport(activeLintStep, running.stdout(), code, env) : void 0;
			doctorAdvisory ??= activeLintStep?.advisory;
			if (code === 0 && phase === "plugins") {
				const fail = (message) => {
					code = 1;
					capture(message);
					if (pluginFailures.length < 5) {
						const fact = {
							check: "plugins",
							code: "candidate-plugins-failed",
							message
						};
						pluginFailures.push(createUpdateFailureFact(fact, env));
					}
				};
				const inventory = running.outputExceeded() ? void 0 : JSON.parse(running.stdout());
				const plugins = isRecord(inventory) && Array.isArray(inventory.plugins) ? inventory.plugins : void 0;
				const registry = isRecord(inventory) && isRecord(inventory.registry) ? inventory.registry : void 0;
				const diagnostics = [...isRecord(inventory) && Array.isArray(inventory.diagnostics) ? inventory.diagnostics : [], ...Array.isArray(registry?.diagnostics) ? registry.diagnostics : []];
				const failedPluginIds = /* @__PURE__ */ new Set();
				if (!plugins || plugins.some((plugin) => !isRecord(plugin) || typeof plugin.id !== "string")) fail("Plugin checks returned an invalid inventory");
				else {
					for (const plugin of plugins) if (isRecord(plugin) && plugin.status === "error" && typeof plugin.id === "string") failedPluginIds.add(plugin.id);
					for (const diagnostic of diagnostics) if (isRecord(diagnostic) && diagnostic.level === "error") {
						if (typeof diagnostic.pluginId !== "string") fail(typeof diagnostic.message === "string" ? diagnostic.message : "Plugin registry reported an unattributed error");
						else failedPluginIds.add(diagnostic.pluginId);
					}
					for (const pluginId of failedPluginIds) {
						const message = `Plugin "${pluginId}" could not be loaded during the update preview.`;
						pluginObservations.push(message);
						capture(message);
					}
				}
			}
			if (code === 0 && phase === "runtime") {
				const contract = running.outputExceeded() ? void 0 : JSON.parse(running.stdout());
				candidateSchemaVersions = parseAssistantSchemaVersions(contract);
				gatewayRestartCompletion = isRecord(contract) && contract.gatewayRestartCompletion === true;
				doctorConfigWrites = isRecord(contract) && contract.doctorConfigWrites === "pid-start-v1";
				if (!candidateSchemaVersions) {
					code = 1;
					capture("The update did not report its supported database versions");
				}
			}
			const step = activeLintStep ?? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: timedOut ? null : code,
				...timedOut ? { termination: "timeout" } : {}
			};
			if (doctorAdvisory) step.advisory = doctorAdvisory;
			else if (exitWarning && code === 0) step.advisory = {
				kind: "recoverable-maintenance",
				message: exitWarning
			};
			const lintWarnings = [...disposalWarnings, ...exitWarning ? [exitWarning] : []];
			if (lintWarnings.length) step.warnings = [...step.warnings ?? [], ...lintWarnings];
			if (code === 0 && pluginObservations.length > 0) step.stdoutTail = pluginObservations.join("\n");
			const failureMessage = timeoutMessage && !exitWarning ? timeoutMessage : `Update ${phase === "lint" ? "health check" : phase} failed`;
			if (code !== 0 && !doctorAdvisory) {
				let findings = doctorReceipt?.status === "error" ? doctorReceipt.failureFacts : pluginFailures;
				if (!findings?.length && lintReport) findings = lintReport.failureFacts;
				if (!findings?.length && phase === "config" && !running.outputExceeded()) findings = parseConfigFailureFacts(running.stdout(), env);
				step.failureFacts = findings?.length ? findings : [createUpdateFailureFact({
					check: phase,
					code: timedOut && !exitWarning ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
					message: timedOut ? failureMessage : running.firstStderrLine() ?? failureMessage
				}, env)];
			}
			steps.push(step);
			if (code !== 0 && !doctorAdvisory) throw new Error(failureMessage);
			params.onStep?.(step);
		}
		if (!candidateSchemaVersions) throw new Error("The update did not report its supported database versions");
		phase = "startup";
		activeStep = {
			name: "candidate-gateway-startup",
			command: "gateway run"
		};
		stepStartedAt = Date.now();
		stepLogTail.length = 0;
		startBudget();
		remaining();
		const running = launch(entry, [
			...[
				"gateway",
				"run",
				"--update-canary",
				"--bind",
				"loopback"
			],
			"--port",
			String(port)
		]);
		try {
			const probeFailure = await waitForUpdateCandidateReadiness({
				port,
				workDeadline,
				started,
				signal: params.signal,
				assertCurrent: params.assertCurrent,
				hasExited: running.hasExited,
				getExitReason: running.firstStderrLine,
				env,
				stateDir: params.stateDir,
				onEndpoint: (endpoint) => {
					phase = endpoint === "startupz" ? "startup" : "readiness";
				},
				capture
			});
			if (probeFailure) capture("Update checks reached their time limit; Gateway readiness remains unverified.");
			const step = {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: probeFailure ? null : 0,
				...probeFailure ? {
					advisory: {
						kind: "candidate-runtime-unavailable",
						message: probeFailure.message
					},
					failureFacts: [probeFailure.fact]
				} : {}
			};
			steps.push(step);
			params.onStep?.(step);
		} finally {
			await stopCanary(running, "candidate-gateway-startup", deadline);
		}
		return {
			status: "ok",
			phase,
			durationMs: Date.now() - started,
			logTail,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			...doctorConfigWrites ? { doctorConfigWrites } : {},
			...doctorConfigChanges.length ? { doctorConfigChanges } : {},
			listenerIsolation,
			steps
		};
	} catch (error) {
		const durationMs = Date.now() - stepStartedAt;
		const displayPhase = phase === "lint" ? "health" : phase;
		const failureLine = capture(`${displayPhase}: ${error instanceof Error ? error.message : String(error)} (${durationMs}ms)`);
		let failed = steps.at(-1);
		if (!failed || failed.exitCode === 0 && failed !== activeLintStep || failed.advisory) {
			failed = activeLintStep ?? {
				...activeStep,
				cwd: params.root,
				durationMs: Date.now() - stepStartedAt,
				exitCode: 1
			};
			steps.push(failed);
		}
		if (error instanceof UpdateSnapshotCapacityError) failed.snapshotCapacity = error.capacity;
		failed.failureFacts ??= [createUpdateFailureFact({
			check: phase === "readiness" ? "readyz" : phase === "startup" ? "startupz" : phase,
			code: phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
			message: error instanceof Error ? error.message : String(error)
		}, env)];
		const repeatsFact = failed.termination !== "timeout" && failed.failureFacts.some((fact) => failureLine === `${displayPhase}: ${fact.message} (${durationMs}ms)`);
		failed.stderrTail = stepLogTail.slice(0, repeatsFact ? -1 : void 0).join("\n");
		params.onStep?.(failed);
		return {
			status: "error",
			reason: failed.failureFacts.some((fact) => fact.code === "candidate-checks-timeout") ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : "runtime-verification-failed",
			phase,
			durationMs: Date.now() - started,
			logTail,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			...doctorConfigChanges.length ? { doctorConfigChanges } : {},
			listenerIsolation,
			steps
		};
	} finally {
		await cleanupRehearsal();
	}
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
//#region src/cli/update-cli/update-command-execution-guards.ts
/** Pin the invocation across parent work and the separately bound Doctor child. */
function createUpdateCommandExecutionGuards(opts, root) {
	const run = opts.run;
	const runId = run?.runId;
	let executor = run?.executorFence;
	const requester = run?.requesterAuthority;
	let stateHandedOff = false;
	const assertInvocation = () => {
		if (opts.recovery || !stateHandedOff) assertUpdateCommandRecoveryState(opts);
		if (opts.run !== run || run?.runId !== runId || run?.executorFence !== executor || run?.requesterAuthority !== requester || !stateHandedOff && requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
	};
	return {
		onStateHandoff: () => {
			stateHandedOff = true;
		},
		admitExecutor: (acquired) => {
			assertInvocation();
			if (!run || executor && acquired !== executor) throw new UpdateRequesterRevokedError();
			if (captureUpdateCommandExecutorAuthority(acquired, run.runId).installKey !== resolveUpdateInstallRoot(root)) throw new UpdateRequesterRevokedError();
			assertUpdateCommandRecoveryState(opts);
			run.executorFence = acquired;
			executor = acquired;
		},
		assertCurrent: () => {
			assertInvocation();
			executor?.assertCurrent();
		},
		assertBoundChildCurrent: assertInvocation
	};
}
//#endregion
//#region src/cli/update-cli/update-command-git-admission.ts
function recordInspectedGitTarget(run, target, assertCurrent) {
	assertCurrent();
	if (run) recordUpdateRunPhase(run.runId, "staging", { target: {
		kind: "git",
		sha: target.sha,
		version: target.version
	} }, { env: run.env });
	assertReadableGitTarget(target);
}
function assertReadableGitTarget(target) {
	if (target.metadataUnreadable) {
		const failure = createUpdatePreflightFailure("target-git-metadata", target.metadataUnreadable);
		throw new UpdatePreMutationError("target-metadata-preflight", failure.message, { failureFacts: failure.failureFacts });
	}
}
//#endregion
//#region src/cli/update-cli/update-command-execution.ts
async function executeMutableUpdate(params) {
	const { opts, updateStepTimeoutMs } = params;
	const inspectContexts = (roots) => inspectUpdateDatabaseContexts({
		...params,
		roots,
		expectedForeground: opts.run?.completionOwner === "gateway-restart" || void 0,
		updateInstallKind: params.updateInstallKind === "git" ? "git" : "package",
		jsonMode: Boolean(opts.json),
		timeoutMs: updateStepTimeoutMs
	});
	const originalRun = opts.run;
	const requesterAuthority = originalRun?.requesterAuthority;
	const { assertCurrent: assertExecutionCurrent, assertBoundChildCurrent, onStateHandoff, admitExecutor } = createUpdateCommandExecutionGuards(opts, params.root);
	const prepareMutableUpdate = async (env, activationTimeoutMs) => {
		assertExecutionCurrent();
		await params.prepareMutableUpdate(env, activationTimeoutMs, admitExecutor);
		assertExecutionCurrent();
	};
	const mode = params.updateInstallKind === "git" ? "git" : params.packageInstallTarget?.manager ?? "unknown";
	if (opts.recovery) throw new UpdatePreMutationError("rollback-state-unverified", "Full-state checkpoint recovery is deferred.");
	assertUpdateCommandRecovery(opts);
	const stagedPluginAdmission = params.updateInstallKind === "package" && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec ?? params.tag);
	let preManagedServiceStop;
	let ownedManagedUpdateContext;
	let admission;
	let gitContextPrepared = false;
	let admittedTargetSchemaVersions = params.packageTargetSchemaVersions;
	const recheckSchemas = async (versions) => {
		admission = await revalidateUpdateDatabaseContexts({
			...params,
			updateInstallKind: params.updateInstallKind === "git" ? "git" : "package",
			jsonMode: Boolean(opts.json),
			timeoutMs: updateStepTimeoutMs
		}, admission, versions);
		admittedTargetSchemaVersions = versions;
	};
	const preflightPlugins = async (targetVersion) => {
		await recheckSchemas(admittedTargetSchemaVersions);
		const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-C0gLLYyl.js");
		const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
		const warnings = await preflightConfiguredNpmPluginTargets({
			config: context.configSnapshot.sourceConfig,
			env: context.env,
			targetVersion,
			channel: params.channel,
			timeoutMs: params.updateStepTimeoutMs
		});
		await recheckSchemas(admittedTargetSchemaVersions);
		for (const warning of warnings) defaultRuntime[opts.json ? "error" : "log"](warning.message);
	};
	let recoveryEnv;
	let packageTransaction;
	const onTransaction = (transaction) => {
		packageTransaction = transaction;
	};
	let schemaVersions;
	let candidateSchemaVersions;
	let gatewayRestartCompletion = false;
	let previousSchemaVersions;
	let previousVerified = false;
	let originalManagedServiceRuntime;
	let observedGatewayStartupMs;
	let activationConfig;
	const onConfigSnapshot = (snapshot) => {
		activationConfig = snapshot;
	};
	let candidateFailureReason;
	let doctorConfigWrites = false;
	const doctorConfigChanges = [];
	let validatedConfigSnapshot;
	const getDoctorContext = () => preparePackageDoctorContext({
		capable: doctorConfigWrites,
		runId: originalRun?.runId,
		executorFence: originalRun?.executorFence,
		requester: requesterAuthority?.requester,
		inputHash: validatedConfigSnapshot?.hash,
		changes: doctorConfigChanges,
		assertCurrent: assertExecutionCurrent,
		assertBoundChildCurrent,
		onStateHandoff
	});
	const originalRecovery = () => params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, updateStepTimeoutMs) : verifyPackageUpdateRecovery(params.root);
	const gitMutationRoots = params.updateInstallKind === "git" ? params.switchToGit ? [params.root, resolveGitInstallDir()] : [params.root] : null;
	const stopManagedServiceBeforeMutableUpdate = async (mutationRoots = [params.root], phase = "prepare") => {
		if (admission?.foreground) return;
		if (params.updateInstallKind !== "package" && params.updateInstallKind !== "git") return;
		try {
			for (const mutationRoot of new Set(params.managedServiceRoot ? [params.managedServiceRoot] : mutationRoots)) {
				const serviceIdentity = preManagedServiceStop?.serviceIdentity;
				preManagedServiceStop = await maybeStopManagedServiceBeforeMutableUpdate({
					updateInstallKind: params.updateInstallKind,
					root: mutationRoot,
					handoffRoot: params.managedServiceRoot ? params.root : void 0,
					shouldRestart: params.shouldRestart,
					jsonMode: Boolean(opts.json),
					timeoutMs: updateStepTimeoutMs,
					phase,
					expectedService: admission?.services.get(mutationRoot),
					updateRun: opts.run,
					recovery: opts.recovery,
					onStopped: (state) => {
						preManagedServiceStop = {
							...state,
							...serviceIdentity ? { serviceIdentity } : {}
						};
					},
					handoffFromGateway: (state) => handoffUpdateFromGateway({
						state,
						root: params.managedServiceRoot ? params.root : mutationRoot,
						opts,
						tag: params.updateInstallKind === "package" && params.channel !== "extended-stable" ? normalizeTag(params.packageInstallSpec) ?? void 0 : void 0,
						mode,
						timeoutMs: updateStepTimeoutMs,
						devTarget: params.devTarget,
						nodeRunner: params.packageUpdateNodeRunner,
						invocationCwd: params.invocationCwd,
						stopProgress: params.stop
					})
				});
				if (serviceIdentity) preManagedServiceStop.serviceIdentity = serviceIdentity;
				if (preManagedServiceStop.windowsTaskAutoStartRecovery) params.recoveryState.windowsTaskAutoStartRecovery = preManagedServiceStop.windowsTaskAutoStartRecovery;
				if (preManagedServiceStop.stopped || preManagedServiceStop.serviceUpdateVerdict?.kind === "owned" || preManagedServiceStop.blockMessage || shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop }) || !preManagedServiceStop.inspected || !preManagedServiceStop.running || !params.shouldRestart) break;
			}
		} catch (err) {
			if (err instanceof ScheduledTaskAutoStartRecoveryError) {
				recoveryEnv = err.serviceEnv;
				params.recoveryState.triageTarget.env = err.serviceEnv;
				throw err;
			}
			if (err instanceof UpdateCommandAbort || err instanceof UpdatePreMutationError) throw err;
			if (err instanceof GatewayServiceUpdateOwnershipError) throw new UpdatePreMutationError("managed-service-preflight", err.message, { failureFacts: err.failureFacts });
			params.stop();
			throw new UpdatePreMutationError("managed-service-stop-failed", `Failed to stop managed gateway service before update: ${String(err)}`, { cause: err });
		}
		if (phase === "inspect" && preManagedServiceStop?.serviceUpdateVerdict?.kind === "foreign") preManagedServiceStop = void 0;
		try {
			ownedManagedUpdateContext = await captureOwnedManagedUpdateContext({
				stopState: preManagedServiceStop,
				processEnv: process.env,
				invocationCwd: params.invocationCwd
			});
			if (ownedManagedUpdateContext) params.recoveryState.triageTarget.env = ownedManagedUpdateContext.env;
		} catch (err) {
			params.stop();
			await maybeRestartServiceAfterFailedMutableUpdate({
				recovery: await originalRecovery(),
				originalManagedServiceRuntime,
				updateRun: opts.run,
				preManagedServiceStop,
				jsonMode: Boolean(opts.json),
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: updateStepTimeoutMs,
				invocationCwd: params.invocationCwd
			});
			throw new Error(`Failed to capture managed gateway update state: ${String(err)}`, { cause: err });
		}
		const inspectionFailure = { failureFacts: collectServiceInspectionFailureFacts(preManagedServiceStop?.serviceUpdateVerdict) };
		if (shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop })) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", [
				`${params.updateInstallKind === "git" ? "Git updates" : "Package updates"} cannot run from inside the gateway service process.`,
				"That path replaces the active Assistant dist tree while the live gateway may still lazy-load old chunks.",
				`Run \`${formatCliCommand("testclaw update")}\` from a terminal outside the gateway service.`
			].join("\n"), inspectionFailure);
		}
		if (preManagedServiceStop?.blockMessage) {
			params.stop();
			throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(preManagedServiceStop.blockMessage), inspectionFailure);
		}
	};
	let result;
	let failure;
	let mutationStarted = false;
	const validateCandidate = async (root) => {
		assertUpdateCommandRecovery(opts);
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		if (opts.run) recordUpdateRunPhase(opts.run.runId, "validating", void 0, { env: opts.run.env });
		const validate = async () => {
			try {
				if (params.updateInstallKind === "package") await recheckSchemas(parsePackageAssistantSchemaVersions(await tryReadJson(path.join(root, "package.json"))) ?? admittedTargetSchemaVersions);
				if (stagedPluginAdmission) {
					await preflightPlugins(await readPackageVersion(root));
					await prepareMutableUpdate(ownedManagedUpdateContext?.env ?? admission?.managedEnv);
				}
			} catch (error) {
				if (error instanceof UpdatePreMutationError) candidateFailureReason = error.reason;
				throw error;
			}
			if (params.shouldRestart && opts.run && preManagedServiceStop?.serviceUpdateVerdict?.kind === "owned") {
				const executor = opts.run.executorFence;
				if (!executor) throw new UpdatePreMutationError("target-native-unsupported", "Starting the update requires its original update process.");
				const supported = await isUpdatedInstallGatewayExecutorSupported({
					root,
					env: resolveUpdatedInstallCommandEnv({
						processEnv: env,
						invocationCwd: params.invocationCwd
					}),
					executor,
					timeoutMs: updateStepTimeoutMs,
					nodeRunner: params.packageUpdateNodeRunner
				});
				assertExecutionCurrent();
				if (!supported) {
					candidateFailureReason = "target-native-unsupported";
					throw new UpdatePreMutationError(candidateFailureReason, "Target runtime cannot fence update-owned native commands; refusing before Gateway stop or package activation.");
				}
			}
			const snapshot = validatedConfigSnapshot ?? await readUpdateCandidateSource(env, params.legacyConfigPlan);
			const validation = await validateUpdateCandidateCanary({
				root,
				config: snapshot.config,
				stateDir: resolveStateDir(env),
				env,
				assertCurrent: assertExecutionCurrent,
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: params.timeoutMs,
				onStep: (step) => params.progress?.onStepComplete?.({
					...step,
					index: 0,
					total: 0
				})
			});
			assertExecutionCurrent();
			doctorConfigChanges.push(...validation.doctorConfigChanges ?? []);
			if (validation.status === "ok") {
				validatedConfigSnapshot = snapshot;
				candidateSchemaVersions = validation.candidateSchemaVersions;
				gatewayRestartCompletion = validation.gatewayRestartCompletion === true;
				doctorConfigWrites = validation.doctorConfigWrites === true;
				observedGatewayStartupMs = validation.steps.find((step) => step.name === "candidate-gateway-startup" && step.exitCode === 0)?.durationMs;
			}
			return validation;
		};
		const validation = await validate();
		candidateFailureReason = validation.status === "error" ? validation.reason : void 0;
		if (validation.status === "ok" && !doctorConfigWrites && doctorConfigChanges.length) {
			const warning = createUpdateDoctorConfigWarningStep(root, doctorConfigChanges);
			validation.steps.push(warning);
			params.progress?.onStepComplete?.({
				...warning,
				index: 0,
				total: 0
			});
		}
		return validation.steps;
	};
	const beforeActivate = async (roots = [params.root]) => {
		assertExecutionCurrent();
		const env = ownedManagedUpdateContext?.env ?? opts.run?.env ?? process.env;
		const snapshot = await readUpdateCandidateSource(env, params.legacyConfigPlan);
		if (validatedConfigSnapshot?.hash !== void 0 && snapshot.hash !== validatedConfigSnapshot.hash) throw new UpdatePreMutationError("invalid-config", "Config changed during update checks; rerun the update before activating.");
		const config = snapshot.config;
		await recheckSchemas(admittedTargetSchemaVersions);
		const originalServiceVerdict = preManagedServiceStop?.serviceUpdateVerdict;
		const previousRoot = originalServiceVerdict?.kind === "owned" && originalServiceVerdict.requiresInstallRootRefresh ? originalServiceVerdict.root : params.root;
		({previousSchemaVersions, schemaVersions} = await captureUpdateActivationSchemas({
			root: previousRoot,
			env,
			config,
			run: opts.run,
			candidateSchemaVersions,
			gatewayRestartCompletion,
			timeoutMs: params.updateStepTimeoutMs
		}));
		if (preManagedServiceStop?.running && preManagedServiceStop.serviceUpdateVerdict?.kind === "owned") await verifyPreviousManagedGatewayForUpdate({
			root: previousRoot,
			config,
			env,
			opts,
			timeoutMs: params.timeoutMs,
			observedStartupMs: observedGatewayStartupMs,
			assertCurrent: assertExecutionCurrent,
			service: preManagedServiceStop,
			onVerification: (verified) => {
				previousVerified = verified;
			}
		});
		originalManagedServiceRuntime = params.shouldRestart ? await observeOriginalManagedServiceRuntime(params, preManagedServiceStop) : void 0;
		await recheckSchemas(admittedTargetSchemaVersions);
		assertExecutionCurrent();
		const activationTimeoutMs = params.timeoutMs === void 0 ? void 0 : await resolveUpdateFinalizationTimeoutMs(updateStepTimeoutMs, {
			env,
			databases: schemaVersions,
			observedStartupMs: observedGatewayStartupMs,
			pluginCount: Object.keys(config.plugins?.entries ?? {}).length,
			nodeRunner: params.packageUpdateNodeRunner
		});
		await parkForegroundUpdateForActivation(params, assertExecutionCurrent);
		await prepareMutableUpdate(env, activationTimeoutMs);
		assertExecutionCurrent();
		if (opts.run) recordUpdateRunPhase(opts.run.runId, "activating", void 0, { env: opts.run.env });
		await stopManagedServiceBeforeMutableUpdate(roots);
		await recheckSchemas(admittedTargetSchemaVersions);
		assertExecutionCurrent();
		preManagedServiceStop?.windowsTaskAutoStartRecovery?.beginMutation();
		mutationStarted = true;
		params.onActivation?.();
	};
	try {
		if (params.updateInstallKind === "package" || params.updateInstallKind === "git") admission = await inspectContexts(gitMutationRoots ?? [params.root]);
		if (params.updateInstallKind === "package") {
			if (!stagedPluginAdmission) await preflightPlugins(params.packageTargetVersion ?? null);
			await stopManagedServiceBeforeMutableUpdate(void 0, "inspect");
			if (!stagedPluginAdmission) await prepareMutableUpdate(admission?.managedEnv);
			const packageUpdate = {
				requirePackageReplacement: params.managedServiceRoot !== void 0,
				reapplyLocalOverrides: opts.reapplyLocalOverrides,
				root: params.root,
				installKind: params.installKind,
				tag: params.tag,
				installSpec: params.packageInstallSpec ?? void 0,
				timeoutMs: updateStepTimeoutMs,
				startedAt: params.startedAt,
				progress: params.progress,
				invocationCwd: params.invocationCwd,
				honorPackageRoot: params.managedServiceRootRedirect !== null || params.managedServiceRoot !== void 0 || params.managedServiceNodeRunner !== void 0,
				nodeRunner: params.packageUpdateNodeRunner,
				installEnv: params.packageInstallEnv,
				installTarget: params.packageInstallTarget,
				validateCandidate,
				beforeActivate,
				assertCurrent: assertExecutionCurrent,
				managedServiceEnv: preManagedServiceStop?.serviceEnv,
				onTransaction,
				onConfigSnapshot,
				getDoctorContext
			};
			await recheckSchemas(params.packageTargetSchemaVersions);
			result = params.stagedPackage ? await params.stagedPackage.run(packageUpdate) : await runPackageInstallUpdate(packageUpdate);
		} else result = await updateGitInstall({
			root: params.root,
			switchToGit: params.switchToGit,
			installKind: params.installKind,
			timeoutMs: params.timeoutMs,
			startedAt: params.startedAt,
			progress: params.progress,
			channel: params.channel,
			devTarget: params.devTarget,
			assertCurrent: assertExecutionCurrent,
			inspectGitTarget: async (target) => {
				recordInspectedGitTarget(opts.run, target, assertExecutionCurrent);
				await recheckSchemas(target.schemaVersions);
				if (!gitContextPrepared) {
					await stopManagedServiceBeforeMutableUpdate(gitMutationRoots ?? void 0, "inspect");
					await prepareMutableUpdate(admission?.managedEnv);
					gitContextPrepared = true;
				}
			},
			onTransaction,
			onConfigSnapshot,
			getDoctorContext,
			getManagedServiceEnv: () => ownedManagedUpdateContext?.env,
			getSnapshotSource: async () => {
				const env = ownedManagedUpdateContext?.env ?? admission?.managedEnv ?? opts.run?.env ?? process.env;
				return {
					config: (await readUpdateCandidateSource(env, params.legacyConfigPlan)).config,
					env
				};
			},
			jsonMode: Boolean(opts.json),
			invocationCwd: params.invocationCwd,
			nodeRunner: params.packageUpdateNodeRunner,
			validateCandidate: async (candidateRoot) => {
				const failed = (await validateCandidate(candidateRoot)).find(isFailedUpdateStep);
				if (failed) throw new UpdatePreMutationError(failed.name, failed.stderrTail ?? "Update checks failed.", { failureFacts: failed.failureFacts });
			},
			beforeGitMutation: async (target) => {
				assertReadableGitTarget(target);
				admittedTargetSchemaVersions = target.schemaVersions;
				await beforeActivate(gitMutationRoots ?? [params.root]);
			}
		});
	} catch (err) {
		params.stop();
		if (err instanceof UpdateCommandAbort && !hasCommandProcessCleanupError(err)) return null;
		({result, failure} = await resolveMutableUpdateFailure({
			cause: err,
			durationMs: Date.now() - params.startedAt,
			mode,
			root: params.root,
			originalRecovery,
			run: mutationStarted ? void 0 : params.opts.run
		}));
	}
	if (candidateFailureReason && result.status === "error") result.reason = candidateFailureReason;
	return {
		result,
		failure,
		mutationStarted,
		preManagedServiceStop,
		ownedManagedUpdateContext,
		recoveryEnv,
		packageTransaction,
		schemaVersions,
		candidateSchemaVersions,
		previousSchemaVersions,
		previousVerified,
		originalManagedServiceRuntime,
		activationConfig
	};
}
//#endregion
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
				const { assertManagedServiceUpdateHandoffRoot } = await import("./update-managed-service-handoff-CKjIm7yb.js");
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
			const { beginDoctorMaintenance } = await import("./doctor-maintenance-DDHokbbm.js");
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
//#region src/cli/update-cli/update-command-noop.ts
async function finishAlreadyCurrentUpdate(params) {
	await withOwnedManagedUpdateEnv(params.ownedManagedUpdateEnv, async () => {
		const result = {
			...params.result,
			after: {
				...params.result.after ?? params.result.before,
				version: params.result.after?.version ?? params.result.before?.version ?? await readPackageVersion(params.root)
			}
		};
		const inspection = {
			...params,
			roots: [params.root],
			updateInstallKind: params.result.mode === "git" ? "git" : "package",
			jsonMode: Boolean(params.opts.json),
			timeoutMs: params.updateStepTimeoutMs,
			expectedForeground: params.opts.run?.completionOwner === "gateway-restart" || void 0
		};
		const admission = await inspectUpdateDatabaseContexts(inspection);
		const service = admission.service;
		const canRefreshRuntime = params.shouldRestart && service?.serviceUpdateVerdict?.kind === "owned" && service.serviceUpdateVerdict.refreshDefinition;
		const runtime = await resolvePackageRuntimePreflight({
			...params,
			target: params.runtimeTarget,
			installedRoot: params.root,
			nodeRunner: params.packageUpdateNodeRunner,
			alreadyCurrent: true,
			service: admission.foreground ? void 0 : service ?? admission.services.get(params.root),
			sourceRoot: result.mode === "git" ? params.root : void 0,
			timeoutMs: params.updateStepTimeoutMs,
			runtimeRecovery: !service?.serviceNodeRunner || canRefreshRuntime ? createPackageRuntimeRecovery({
				root: params.root,
				opts: params.opts,
				timeoutMs: params.updateStepTimeoutMs
			}) : void 0
		});
		if (!runtime.ok) throw new UpdatePreMutationError("node-runtime-preflight", runtime.error, {
			failureFacts: runtime.failureFacts,
			recoverySteps: runtime.recoverySteps
		});
		const packageUpdateNodeRunner = runtime.value.nodeRunner;
		const context = admission.foreground ? admission.contexts[0] : admission.contexts.at(-1);
		const pluginWarnings = await preflightConfiguredNpmPluginTargets({
			config: context.configSnapshot.sourceConfig,
			env: context.env,
			targetVersion: result.after.version,
			channel: params.channel,
			timeoutMs: params.updateStepTimeoutMs
		});
		for (const warning of pluginWarnings) if (params.opts.json) defaultRuntime.error(warning.message);
		else defaultRuntime.log(warning.message);
		await inspectUpdateDatabaseContexts({
			...inspection,
			expectedServices: admission.services,
			expectedForeground: admission.foreground
		});
		await Promise.all(admission.contexts.map(revalidateUpdateDatabaseContext));
		let stopState;
		try {
			stopState = admission.foreground ? void 0 : await maybeStopManagedServiceBeforeMutableUpdate({
				...inspection,
				root: params.managedServiceRoot ?? params.root,
				handoffRoot: params.managedServiceRoot ? params.root : void 0,
				phase: "inspect",
				expectedService: admission.services.get(params.managedServiceRoot ?? params.root),
				updateRun: params.opts.run,
				handoffFromGateway: (state) => handoffUpdateFromGateway({
					state,
					root: params.root,
					mode: params.result.mode,
					opts: params.opts,
					tag: params.channel === "extended-stable" ? void 0 : params.packageInstallSpec && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec) ? params.packageInstallSpec : result.after.version ?? void 0,
					timeoutMs: params.updateStepTimeoutMs,
					nodeRunner: packageUpdateNodeRunner,
					invocationCwd: params.invocationCwd,
					stopProgress: params.stop
				})
			});
		} catch (error) {
			if (error instanceof UpdateCommandAbort) return;
			throw error;
		}
		if (process.platform === "linux" && stopState?.serviceUpdateVerdict?.kind === "owned" && !stopState.blockMessage) stopState = await maybeStopManagedServiceBeforeMutableUpdate({
			...inspection,
			root: params.managedServiceRoot ?? params.root,
			handoffRoot: params.managedServiceRoot ? params.root : void 0,
			phase: "refresh",
			expectedService: stopState,
			updateRun: params.opts.run
		});
		if (stopState && (stopState.blockMessage || shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop: stopState }))) throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(stopState.blockMessage ?? "Run testclaw update from a terminal outside the Gateway service before changing installed plugins."), { failureFacts: collectServiceInspectionFailureFacts(stopState.serviceUpdateVerdict) });
		await assertAssistantStateWriteAllowedAtPath({
			databasePath: resolveAssistantStateSqlitePath(context.env),
			env: context.env
		});
		const owned = await captureOwnedManagedUpdateContext({
			stopState,
			invocationCwd: params.invocationCwd
		});
		const env = owned?.env ?? context.env;
		let configSnapshot = owned?.configSnapshot ?? context.configSnapshot;
		const plan = params.legacyConfigPlan?.snapshot.path === configSnapshot.path ? params.legacyConfigPlan : void 0;
		const storedChannel = normalizeUpdateChannel((plan?.config ?? configSnapshot.config).update?.channel);
		const beforeRepair = configSnapshot;
		if (params.opts.channel && plan) configSnapshot = await withOwnedManagedUpdateEnv(env, () => withPluginLifecycleLease({}, () => maybeRepairLegacyConfigForUpdateChannel({
			configSnapshot,
			plan,
			jsonMode: Boolean(params.opts.json)
		})));
		if (!configSnapshot.valid) throw new Error("Update refused: the selected configuration is still invalid.");
		result.status = beforeRepair.raw !== configSnapshot.raw ? "ok" : "skipped";
		if (result.status === "ok") delete result.reason;
		else result.reason = "already-current";
		params.stop();
		await finishUpdate({
			...params,
			packageUpdateNodeRunner,
			serviceRuntimeRefreshRequired: Boolean(params.managedServiceRoot || runtime.value.replacedNodeRunner),
			result,
			storedChannel,
			coreAlreadyCurrent: true,
			mutationStarted: false,
			installKindChanged: false,
			downgradeRisk: false,
			preManagedServiceStop: stopState,
			ownedManagedUpdateEnv: env,
			configSnapshot,
			preUpdatePluginInstallRecords: owned?.pluginInstallRecords ?? {}
		});
	}).catch(async (error) => {
		if (error instanceof UpdatePreMutationError || error instanceof GatewayServiceUpdateOwnershipError) {
			await params.refuseUpdate(error instanceof UpdatePreMutationError ? error.reason : "managed-service-preflight", error.message, error.failureFacts, error instanceof UpdatePreMutationError ? error.recoverySteps : void 0);
			return;
		}
		throw error;
	});
}
//#endregion
//#region src/cli/update-cli/update-command-migrated.ts
/** Inspect private state copies without reopening migrated state through the previous runtime. */
async function inspectActivatedUpdateState(params) {
	const { result, root, schemaVersions, candidateSchemaVersions, env, config } = params;
	if (!schemaVersions) return;
	try {
		const current = await readUpdateStateSchemaVersions({
			stateDir: resolveStateDir(env),
			config,
			env,
			root: result.root ?? null,
			nodeRunner: params.packageUpdateNodeRunner,
			timeoutMs: params.timeoutMs
		});
		const shared = current.find((entry) => entry.path === resolveAssistantStateSqlitePath(env));
		const sharedVersion = shared ? resolveUpdateStateContentVersion(shared) : void 0;
		if (result.status === "ok" && candidateSchemaVersions && sharedVersion !== candidateSchemaVersions.state) {
			result.status = "error";
			result.reason = `${CLI_NAME} doctor`;
			result.steps.push({
				name: `${CLI_NAME} doctor`,
				command: `${CLI_NAME} doctor --fix`,
				cwd: result.root ?? root,
				durationMs: 0,
				exitCode: 1,
				stderrTail: `Shared state migration did not finish: expected schema ${candidateSchemaVersions.state}, found ${sharedVersion ?? "missing"}.`
			});
		}
		return updateStateSchemaVersionsMatch(schemaVersions, current, {
			sharedPath: resolveAssistantStateSqlitePath(env),
			candidateSchemaVersions
		}) ? void 0 : "state-migrated-no-rollback";
	} catch (error) {
		result.status = "error";
		result.reason = "rollback-state-unverified";
		result.steps.push({
			name: "state-schema-verification",
			command: "testclaw update",
			cwd: result.root ?? root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: formatErrorMessage(error)
		});
		return "rollback-state-unverified";
	}
}
/** After migration, only candidate code may reopen state or finish the run. */
async function continueMigratedUpdateInFreshProcess(params, bufferedSteps) {
	if (params.opts.recovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred.");
	const run = params.opts.run;
	if (!run) throw new Error("Migrated update continuation requires its admitted run.");
	const assertCurrent = createUpdateCommandFinalizationFence(params);
	assertCurrent();
	const windowsRecovery = params.preManagedServiceStop?.windowsTaskAutoStartRecovery;
	const result = params.result;
	const scratchDir = await fs.mkdtemp(path.join(os.tmpdir(), "testclaw-update-migrated-"));
	try {
		const root = result.root;
		if (!root) throw new Error("The active installation root is unknown; update finalization is unsafe.");
		const workerCommand = [params.packageUpdateNodeRunner ?? resolveNodeRunner(), path.join(root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath)];
		const workerEnv = {
			...stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv({ processEnv: params.ownedManagedUpdateEnv ?? run.env })),
			TESTCLAW_UPDATE_IN_PROGRESS: "1",
			TMPDIR: scratchDir,
			TMP: scratchDir,
			TEMP: scratchDir
		};
		if (run.executorFence || run.completionOwner) {
			assertCurrent();
			const requiresRetainedOwner = run.executorFence ? requiresRetainedUpdateCommandOwner(run.executorFence) : false;
			const check = await runUtf8CommandWithTimeout([...workerCommand, "--check"], {
				cwd: root,
				baseEnv: {},
				env: workerEnv,
				timeoutMs: params.updateStepTimeoutMs,
				killProcessTree: true,
				requireProcessTreeExtinction: true,
				killGraceMs: 500,
				maxOutputBytes: 65536
			});
			assertCurrent();
			let contract;
			try {
				contract = JSON.parse(check.stdout);
			} catch (cause) {
				throw new UpdateCommandRecoveryPendingError("Update live executor delegation capability could not be inspected.", { cause });
			}
			if (check.termination !== "exit" || check.code !== 0 || check.cleanup !== "normal" || !isRecord(contract) || run.executorFence && contract.executorDelegation !== "pid-start-v1" || requiresRetainedOwner && contract.retainedOwnerBinding !== true) throw new UpdateCommandRecoveryPendingError("Update runtime does not support live executor delegation; recovery remains pending.");
			if (run.completionOwner === "gateway-restart" && contract.gatewayRestartCompletion !== true) throw new UpdateCommandRecoveryPendingError("Candidate runtime cannot defer foreground update completion to Gateway restart; recovery remains pending.");
		}
		if (windowsRecovery && params.preManagedServiceStop) windowsRecovery.handoff(createWindowsTaskAutoStartGuard({
			root: result.root ?? params.root,
			before: params.preManagedServiceStop,
			timeoutMs: params.updateStepTimeoutMs
		}));
		const { packageTransaction: _transaction, preManagedServiceStop, ...serializable } = params;
		let stopState;
		if (preManagedServiceStop) {
			const { windowsTaskAutoStartRecovery: _windows, ...serializableStop } = preManagedServiceStop;
			stopState = serializableStop;
		}
		if (params.opts.timeout !== void 0) run.activationTimeoutMs ??= await resolveUpdateFinalizationTimeoutMs(params.updateStepTimeoutMs, {
			env: params.ownedManagedUpdateEnv ?? run.env,
			databases: params.schemaVersions,
			pluginCount: Object.keys(params.preUpdatePluginInstallRecords).length,
			nodeRunner: params.packageUpdateNodeRunner
		});
		const handoff = createUpdateTimeoutHandoff(params.opts.timeout, params.updateStepTimeoutMs);
		assertCurrent();
		const resultPath = path.join(scratchDir, "result.json");
		const { requesterAuthority, executorFence, ...runIdentity } = run;
		const input = {
			...handoff,
			params: {
				...serializable,
				opts: {
					...params.opts,
					timeout: handoff.timeout.serialized,
					run: {
						...runIdentity,
						...requesterAuthority ? { requesterAuthority: { requester: requesterAuthority.requester } } : {}
					}
				},
				rollbackBlockedReason: params.rollbackBlockedReason ?? "state-migrated-no-rollback",
				...preManagedServiceStop ? { preManagedServiceStop: stopState } : {}
			},
			bufferedSteps,
			...windowsRecovery ? { windowsTaskAutoStartSuspended: true } : {},
			resultPath
		};
		const runChild = (grant, bindChild) => runUtf8CommandWithTimeout(workerCommand, {
			cwd: root,
			baseEnv: {},
			env: workerEnv,
			input: JSON.stringify({
				...input,
				...grant ? { executor: grant } : {}
			}),
			beforeInput: bindChild,
			timeoutMs: run.activationTimeoutMs,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			killGraceMs: 500,
			maxOutputBytes: 1048576
		});
		const child = executorFence ? await withUpdateCommandExecutorChild(executorFence, root, runChild) : await runChild();
		if (child.stdout) process.stdout.write(child.stdout);
		if (child.stderr) process.stderr.write(child.stderr);
		const response = JSON.parse(await fs.readFile(resultPath, "utf8"));
		if (child.termination !== "exit" || child.code !== 0 || child.cleanup !== "normal" || executorFence && response.executorDelegation !== "pid-start-v1" || response.terminalRunId !== run.runId && !(run.completionOwner === "gateway-restart" && run.gatewayRestartRequired === true && response.restartRunId === run.runId && response.result.status === "ok") || response.result.runId !== run.runId || !Number.isInteger(response.exitCode)) throw new Error("Update finalization did not confirm the admitted run's terminal outcome.");
		try {
			await windowsRecovery?.complete(response.result.status === "ok" || isUpdateGatewayReadinessPending(response.result));
		} catch (cause) {
			throw new UpdateCommandFailure(response.result, response.exitCode || 1, `${response.result.reason ?? "Update failed"}; Windows task autostart compensation failed: ${formatErrorMessage(cause)}`, { cause });
		}
		const cleanupFailure = await recordUpdatePackageCompletion(params, response.result, assertCurrent);
		if (cleanupFailure) throw cleanupFailure;
		return {
			result: response.result,
			exitCode: response.exitCode,
			automaticTriage: response.automaticTriage
		};
	} catch (error) {
		if (error instanceof UpdateCommandRecoveryPendingError) throw error;
		try {
			await windowsRecovery?.complete(false);
		} catch (cause) {
			throw new AggregateError([error, cause], `Update finalization failed (${formatErrorMessage(error)}) and Windows task autostart compensation failed (${formatErrorMessage(cause)})`, { cause });
		}
		throw error;
	} finally {
		await fs.rm(scratchDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { continueMigratedUpdateInFreshProcess, executeMutableUpdate, finishAlreadyCurrentUpdate, finishUpdate, inspectActivatedUpdateState, resumePostCoreUpdate };
