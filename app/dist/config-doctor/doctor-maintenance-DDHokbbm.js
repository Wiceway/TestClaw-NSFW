import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS, r as GATEWAY_SHUTDOWN_RESERVE_MS } from "./gateway-shutdown-budget-E5oPIr_h.js";
import { h as sleep } from "./utils-BfoJTy8l.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { o as isDefaultInstallIdentity } from "./paths-DeOFr7iP.js";
import { D as StateDatabaseCoordinatorContentionError, d as acquireStateDatabaseCoordinator, u as acquireGatewayMaintenanceCoordinator } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as createAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { n as openDoctorStateSchemaReadAdmission } from "./testclaw-state-db-doctor-schema-EMnpWWuV.js";
import { c as readStateLeaseProcessOwnerStatus } from "./testclaw-state-lease-store-DwGiGlp_.js";
import { f as acquireWithWait } from "./startup-migration-checkpoint-DnvPNuHL.js";
import { n as createUpdateFailureFact } from "./update-failure-facts-CzM99Hgb.js";
import { a as findServiceOwnershipRefusal, s as hasGatewayServiceStopUnsafeError } from "./service-inspection-error-B0LJdIzc.js";
import { i as UpdateDoctorError, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-fRe8i0lu.js";
import { o as readGatewayOwnerLease } from "./windows-port-pids-CMmtwDq4.js";
import { s as TICK_INTERVAL_MS } from "./server-constants-Dx_kHnY5.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { l as withCommandProcessScope, n as resolveCommandProcessSignal } from "./exec-spawn-USR_FeKZ.js";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-Dr7vDKEC.js";
import { n as probePortUsage } from "./ports-probe-CvtR_KAT.js";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-DsnfmfzB.js";
import { r as readPackageVersion } from "./package-json-CT4OsNvS.js";
import { n as GatewayServiceAuthorityError } from "./service-update-authority-I83SnBXH.js";
import { c as readLockPayload, d as resolveGatewayOwnerStatus, n as GatewayLockError, o as readActiveGatewayLockIdentity, u as resolveGatewayLockPaths } from "./gateway-lock-BdQ1BI9a.js";
import { t as inspectUpdateRepairDriverAdmission } from "./update-run-activity-Bjglr3ln.js";
import { m as recordUpdateRunRepairContinuation } from "./update-run-ledger-DLD5Q47c.js";
import { s as listUpdateRuns } from "./update-run-reader-CA3WJ8vB.js";
import { a as resolveGatewayService } from "./service-lSBwGN47.js";
import { r as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-DsR_Dem9.js";
import { s as inspectGatewayRestart } from "./restart-health-Cn_P9AI4.js";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-D0Ix055V.js";
import { p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-CJ1UFeyr.js";
import { c as resolveUpdateParentGatewayActivation, l as shouldManageGatewayService, n as assertDoctorServiceSelection, o as isServiceRepairExternallyManaged } from "./doctor-service-repair-policy-BX5XfoFa.js";
import { n as classifyDoctorMaintenanceRefusal, t as assertDoctorMaintenanceInspection } from "./doctor-maintenance-inspection-B2v-HzKY.js";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-B2VHBLHs.js";
import { n as recordUpdateDoctorRefusal, r as resolveUpdateDoctorGitRecovery, t as formatUpdateDoctorServiceStopRefusal } from "./doctor-update-refusal-DUanxYcm.js";
import os from "node:os";
import path from "node:path";
//#region src/infra/gateway-lock-legacy.ts
/** Published 2026.6.33 Gateways predate state-local locks and SQLite coordinators. */
async function readLegacyGatewayLockIdentity(env) {
	const uid = process.getuid?.();
	const lockDir = path.join(os.tmpdir(), uid === void 0 ? "testclaw" : `testclaw-${uid}`);
	const { configLockPath } = resolveGatewayLockPaths(env, lockDir);
	const payload = await readLockPayload(configLockPath, true).catch((cause) => {
		throw new GatewayLockError(`Legacy Gateway lock could not be read at ${configLockPath}; inspect that file as the Gateway service account before retrying maintenance.`, cause);
	});
	if (!payload) return;
	const state = await resolveGatewayOwnerStatus(payload.pid, payload, process.platform);
	return state === "dead" ? void 0 : {
		pid: payload.pid,
		state,
		path: configLockPath
	};
}
async function assertLegacyGatewayStoppedForMaintenance(env) {
	const owner = await readLegacyGatewayLockIdentity(env);
	if (owner) throw new GatewayLockError(`Legacy Gateway lock ${owner.path} still has a live or unverified owner (PID ${owner.pid}).`);
}
//#endregion
//#region src/commands/doctor-agent-lease-refusal.ts
function createDoctorAgentLeaseRefusal(env, cause) {
	const message = "Doctor could not enter maintenance. An agent database is in use. Stop other Assistant processes using this state, then retry the update.";
	return new DoctorMaintenanceRefusalError(message, {
		kind: "deferred",
		reason: "agent-database-in-use"
	}, {
		cause,
		failureFacts: [createUpdateFailureFact({
			check: "doctor",
			code: "agent-database-lease-active",
			message
		}, env)]
	});
}
async function preflightExternalDoctorAgentLease(env) {
	const { readActiveAssistantAgentDatabaseLeasesReadOnly } = await import("./testclaw-agent-db-lease-B5SIURC9.js");
	let activeAgentLease = false;
	try {
		activeAgentLease = readActiveAssistantAgentDatabaseLeasesReadOnly({ env }, openDoctorStateSchemaReadAdmission).length > 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
	}
	if (activeAgentLease) throw createDoctorAgentLeaseRefusal(env);
}
/** The caller holds both lifecycle coordinators; this check never opens a state writer. */
async function assertDoctorAgentLeaseAdmission(env) {
	const { assertNoAssistantAgentDatabaseLeasesReadOnly, AssistantAgentDatabaseLeaseActiveError } = await import("./testclaw-agent-db-lease-B5SIURC9.js");
	try {
		assertNoAssistantAgentDatabaseLeasesReadOnly({ env }, openDoctorStateSchemaReadAdmission);
	} catch (error) {
		if (error instanceof AssistantAgentDatabaseLeaseActiveError) throw createDoctorAgentLeaseRefusal(env, error);
		const { preflightAssistantDatabaseSchemas } = await import("./testclaw-database-preflight-D-1emagy.js");
		const unreadable = (await preflightAssistantDatabaseSchemas({
			env,
			scope: "state",
			openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
		})).indeterminate.find((database) => database.kind === "state");
		if (unreadable) throw new DoctorUnreadableStateDatabaseError(unreadable.path, unreadable.reason);
		throw error;
	}
}
//#endregion
//#region src/commands/doctor-maintenance-admission.ts
function resolveDoctorUpdateAdmission(env) {
	const inheritedRunId = env[UPDATE_RUN_ID_ENV]?.trim();
	const readAdmission = () => {
		const runs = listUpdateRuns({
			active: true,
			limit: 100,
			includeRunId: inheritedRunId
		}, { env }, openDoctorStateSchemaReadAdmission);
		const admission = inspectUpdateRepairDriverAdmission(runs, inheritedRunId);
		if (admission.kind === "conflict") throw new Error(admission.message);
		return admission;
	};
	const admission = readAdmission();
	let assertUpdateAdmissionCurrent = () => {
		readAdmission();
	};
	const continuation = admission.kind === "continuation" ? admission.run : admission.runs.find((run) => run.runId === inheritedRunId);
	if (continuation?.steps.some((step) => step.step === "finalize:repair-continuation")) assertUpdateAdmissionCurrent = () => {
		readAdmission();
		recordUpdateRunRepairContinuation(continuation.runId, inheritedRunId, { env });
	};
	return assertUpdateAdmissionCurrent;
}
//#endregion
//#region src/commands/doctor-maintenance-foreground.ts
async function acquireDoctorGatewayMaintenanceCoordinator(databasePath, env, params) {
	const updateRepair = isDoctorUpdateRepairMode(resolveDoctorRepairMode(params.options));
	let foreground;
	let ownerlessDeadlineMs;
	return await acquireWithWait({
		acquire: () => {
			params.assertCurrent?.();
			return acquireGatewayMaintenanceCoordinator({
				databasePath,
				busyTimeoutMs: 0
			});
		},
		shouldRetry: (error) => {
			if (!updateRepair || !params.assertCurrent || !(error instanceof StateDatabaseCoordinatorContentionError) || error.family !== "gateway-lifecycle") return false;
			params.assertCurrent();
			const current = readGatewayOwnerLease({
				env,
				current: true,
				openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
			});
			if (!foreground) {
				if (!current) {
					if (ownerlessDeadlineMs === void 0) {
						ownerlessDeadlineMs = performance.now() + GATEWAY_SHUTDOWN_RESERVE_MS;
						params.runtime.log("Waiting for Gateway state ownership cleanup to finish.");
					}
					return performance.now() < ownerlessDeadlineMs;
				}
				if (ownerlessDeadlineMs !== void 0) return false;
				if (current.state !== "live" || current.mode !== "foreground") return false;
				foreground = current;
				params.runtime.log("Waiting for the previous foreground Gateway to release state.");
			} else if (current && (current.owner !== foreground.owner || current.pid !== foreground.pid || current.startedAt !== foreground.startedAt || current.host !== foreground.host || current.mode !== "foreground")) return false;
			return readStateLeaseProcessOwnerStatus(foreground) === "live";
		},
		deadlineMs: Math.min(params.deadlineMs ?? Infinity, performance.now() + TICK_INTERVAL_MS + resolveGatewayRestartDeferralTimeoutMs() + GATEWAY_SERVICE_STOP_TIMEOUT_MS),
		pollIntervalMs: 100,
		maxPollIntervalMs: 1e3,
		sleep: (ms) => sleep(ownerlessDeadlineMs === void 0 ? ms : Math.min(ms, Math.max(0, ownerlessDeadlineMs - performance.now())))
	});
}
//#endregion
//#region src/commands/doctor-maintenance-stale-service.ts
function doctorGatewayMaintenanceError(params) {
	const restart = formatCliCommand("testclaw gateway restart", params.env);
	const next = `Run ${formatCliCommand("testclaw gateway status --deep", params.env)}; resolve the reported failure, then ${formatCliCommand("testclaw doctor --fix", params.env)} and ${restart}.`;
	const message = `Doctor ${params.phase} failed. ${params.detail} ${next}`;
	const failureFacts = [createUpdateFailureFact({
		check: params.phase,
		code: params.code,
		message: params.detail
	}, params.env), createUpdateFailureFact({
		check: params.phase,
		code: "stale-gateway-recovery-command",
		message: next
	}, params.env)];
	return params.phase === "gateway-stop" ? new DoctorMaintenanceRefusalError(message, {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	}, {
		cause: params.cause,
		failureFacts
	}) : new UpdateDoctorError(message, failureFacts, { cause: params.cause });
}
/** Identify predecessor code without requiring startup before offline migrations. */
async function inspectStaleDoctorGateway(params) {
	const { before, root, env } = params;
	const legacy = await readLegacyGatewayLockIdentity(env);
	if (!before.running && !legacy) return;
	const serviceEnv = before.serviceEnv ?? env;
	const service = resolveGatewayService();
	const [version, buildId, serviceCommand] = await Promise.all([
		readPackageVersion(root),
		readBuiltGatewayBuildId(root),
		service.readCommand(serviceEnv).catch(() => null)
	]);
	params.assertCurrent?.();
	if ((!version || !buildId) && !legacy) return;
	const port = await resolveUpdatedGatewayRestartPort({
		serviceEnv,
		serviceCommand
	});
	const health = legacy ? void 0 : await inspectGatewayRestart({
		service,
		port,
		env: serviceEnv,
		expectedVersion: version,
		expectedBuildId: buildId,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission,
		requirePluginHealth: false
	});
	params.assertCurrent?.();
	if (!(legacy || health?.buildIdMismatch?.actual != null || health?.versionMismatch || health?.probeError?.startsWith("gateway closed (1011): gateway message handler unavailable"))) return;
	const pid = legacy?.pid ?? before.servicePid ?? health?.runtime.pid;
	if (before.serviceUpdateVerdict?.kind !== "owned" || !before.serviceEnv || !before.running || legacy && (legacy.state !== "alive" || legacy.pid !== before.servicePid)) throw doctorGatewayMaintenanceError({
		env,
		phase: "gateway-stop",
		code: "stale-gateway-service-unverified",
		detail: `Gateway PID ${pid ?? "unknown"} is stale, but its managed service ownership is unverified. ${before.blockMessage ?? before.serviceMutationSkipMessage ?? ""}`
	});
	if (!version || !buildId) throw doctorGatewayMaintenanceError({
		env,
		phase: "gateway-stop",
		code: "stale-gateway-identity-unavailable",
		detail: "The installed candidate's build identity is unavailable."
	});
	return {
		version,
		buildId,
		pid,
		port
	};
}
async function assertStaleDoctorGatewayStopped(params) {
	const runtime = await resolveGatewayService().readRuntime(params.env);
	const port = await probePortUsage(params.stale.port);
	const legacy = await readLegacyGatewayLockIdentity(params.env);
	params.assertCurrent?.();
	if (runtime.status !== "stopped" || (runtime.pid ?? 0) > 0 || port !== "free" || legacy) throw new Error(`Stale Gateway PID ${params.stale.pid ?? "unknown"} did not stop: service=${runtime.status}, PID=${runtime.pid ?? "none"}, port ${params.stale.port}=${port}, legacy lock owner=${legacy?.pid ?? "none"}.`);
}
//#endregion
//#region src/commands/doctor-maintenance.ts
/** Coordinates explicit Doctor repair with the managed Gateway lifecycle. */
async function beginDoctorMaintenance(params) {
	if (!(params.options.repair === true || params.options.yes === true)) return;
	const env = {
		...process.env,
		...params.runId ? { [UPDATE_RUN_ID_ENV]: params.runId } : {}
	};
	const parentActivation = isDoctorUpdateRepairMode(resolveDoctorRepairMode(params.options)) ? resolveUpdateParentGatewayActivation(env) : void 0;
	let stopped;
	let stopDeadline;
	let serviceMaintenance;
	const coordinators = [];
	const warnings = [];
	const failureFacts = [];
	let repairStoresMayBeOpen = false;
	let retainStoppedInstallation = false;
	let resources;
	let inspectingActivation = false;
	let staleReplacement;
	let assertUpdateAdmissionCurrent;
	let authorityRefused = false;
	const assertAuthority = (assertion) => {
		try {
			assertion();
		} catch (error) {
			authorityRefused = true;
			throw error;
		}
	};
	const callerAssertCurrent = params.assertCurrent;
	const assertCallerCurrent = callerAssertCurrent ? () => assertAuthority(callerAssertCurrent) : void 0;
	let cleanupFailure;
	const settle = async (operation) => {
		if (cleanupFailure) throw cleanupFailure.error;
		try {
			return await withCommandProcessScope(operation);
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) cleanupFailure ??= { error };
			throw error;
		}
	};
	const databasePath = path.resolve(resolveAssistantStateSqlitePath(env));
	const acquireMaintenanceResources = async () => {
		if (resources) return;
		assertCallerCurrent?.();
		const owner = await acquireDoctorGatewayMaintenanceCoordinator(databasePath, env, {
			...params,
			assertCurrent: assertCallerCurrent,
			deadlineMs: stopDeadline
		});
		let stateOwner;
		try {
			assertCallerCurrent?.();
			stateOwner = acquireStateDatabaseCoordinator({
				databasePath,
				busyTimeoutMs: 250
			});
		} catch (error) {
			owner.release();
			throw error;
		}
		coordinators.push(owner, stateOwner);
		resources = createAssistantDatabaseMaintenanceScope(owner.createSchemaFenceDelegate, assertCallerCurrent);
	};
	const acquireStoppedMaintenanceResources = () => acquireWithWait({
		acquire: acquireMaintenanceResources,
		shouldRetry: (error) => stopped?.stopped === true && error instanceof StateDatabaseCoordinatorContentionError && error.family === "gateway-lifecycle",
		deadlineMs: stopDeadline ?? performance.now(),
		pollIntervalMs: 250,
		maxPollIntervalMs: 2e3
	});
	const releaseState = async () => {
		if (cleanupFailure) throw cleanupFailure.error;
		if (repairStoresMayBeOpen) {
			await resources?.close();
			repairStoresMayBeOpen = false;
		}
		for (const coordinator of coordinators.splice(0).toReversed()) coordinator.release();
	};
	const release = async (assertCustody) => {
		await settle(async () => {
			await releaseState();
			const recovery = stopped?.windowsTaskAutoStartRecovery;
			try {
				assertCustody?.();
				if (!retainStoppedInstallation) await settle(async () => {
					await serviceMaintenance?.maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopped, true);
				});
			} finally {
				if (!cleanupFailure) await settle(async () => {
					await recovery?.complete(!retainStoppedInstallation);
				});
			}
		});
	};
	const finish = async (initialConfig, assertCustody, writeConfig, assertRestoreAdmission = assertUpdateAdmissionCurrent) => {
		let cfg = initialConfig;
		await release(assertCustody);
		assertCustody?.();
		const before = stopped;
		const root = params.root;
		if (!before?.serviceEnv || !root) return;
		if (!before.stopped) {
			const verdict = before.serviceUpdateVerdict;
			if (verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) {
				const { inspectGatewayServiceInstallationDrift } = await import("./service-layout-Bf9GQulo.js");
				const drift = await inspectGatewayServiceInstallationDrift({ packageRootReal: verdict.root }, root);
				if (drift) {
					const { formatGatewayServiceInstallationDrift } = await import("./shared-MLd0BGkH.js");
					const message = formatGatewayServiceInstallationDrift(drift, void 0, before.serviceEnv, {
						stopped: true,
						port: before.servicePort
					});
					warnings.push(message);
					params.runtime.log(message);
				}
			}
			return;
		}
		try {
			const serviceEnv = before.serviceEnv;
			const [{ restoreDoctorGatewayService }, { resolveUpdatedGatewayRestartPort }, { renderRestartDiagnostics, waitForGatewayHealthyRestart }] = await Promise.all([
				import("./doctor-maintenance-restoration-DVxQbs8X.js"),
				import("./update-command-service-plan-Cr56kemH.js"),
				import("./restart-health-F7P1sb_p.js")
			]);
			const { service, state, cfg: restoredConfig } = await restoreDoctorGatewayService({
				before,
				serviceEnv,
				root,
				env,
				cfg,
				writeConfig,
				options: params.options,
				runtime: params.runtime,
				warnings,
				settle,
				assertCustody,
				assertRestoreAdmission,
				assertInstallationAdmission: assertUpdateAdmissionCurrent
			});
			cfg = restoredConfig;
			if (!state) return;
			const port = await resolveUpdatedGatewayRestartPort({
				config: cfg,
				serviceEnv: state.env,
				serviceCommand: state.command
			});
			const health = await settle(() => waitForGatewayHealthyRestart({
				service,
				port,
				env: state.env,
				requireRunningService: true,
				...staleReplacement ? {
					expectedVersion: staleReplacement.version,
					expectedBuildId: staleReplacement.buildId,
					requirePluginHealth: false
				} : {}
			}));
			if (health.waitOutcome === "still-starting") {
				const warning = renderRestartDiagnostics(health).join(" ");
				warnings.push(warning);
				params.runtime.log(warning);
				return;
			}
			if (!health.healthy) throw doctorGatewayMaintenanceError({
				env,
				phase: "gateway-restoration",
				code: "doctor-gateway-rpc-verification-failed",
				detail: `Doctor repaired state, but the managed Gateway did not become ready: ${renderRestartDiagnostics(health).join(" ")}.`
			});
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) {
				cleanupFailure ??= { error };
				throw error;
			}
			if (error instanceof GatewayServiceAuthorityError) {
				const { formatDaemonServiceInstallCommand } = await import("./shared-MLd0BGkH.js");
				const serviceEnv = before.serviceEnv;
				const outcome = error.outcome ?? "recovery-pending";
				const message = `Doctor could not finish Gateway installation or activation under its maintenance authority (${outcome}). ${outcome === "unchanged" ? "The previous service definition was left unchanged." : outcome === "restored" ? "The previous service definition was restored from its captured backup." : "Restoration was not verified; inspect the current service before replacing it."} Run \`${formatCliCommand("testclaw gateway status --deep", serviceEnv)}\`; after the active maintenance or update finishes, run \`${formatDaemonServiceInstallCommand(serviceEnv, before.servicePort)}\` from the active CLI. Reason: ${error.message}`;
				failureFacts.push(createUpdateFailureFact({
					check: "gateway-restoration",
					code: `${error.code}-${outcome}`,
					message
				}, serviceEnv));
				warnings.push(message);
				params.runtime.error(message);
				if (outcome === "recovery-pending") throw new UpdateDoctorError(message, failureFacts, { cause: error });
				return;
			}
			if (error instanceof UpdateDoctorError) throw error;
			throw doctorGatewayMaintenanceError({
				env,
				phase: "gateway-restoration",
				code: findServiceOwnershipRefusal(error)?.reason ?? "doctor-gateway-restoration-failed",
				detail: `The managed Gateway could not be restored after Doctor maintenance: ${String(error)}`,
				cause: error
			});
		}
		params.runtime.log("Gateway restarted and verified after Doctor repair.");
		if (staleReplacement) {
			const warning = `Warning: Replaced stale Gateway PID ${staleReplacement.pid ?? "unknown"} through its service manager; verified ${staleReplacement.version} build ${staleReplacement.buildId} after Doctor maintenance.`;
			warnings.push(warning);
			params.runtime.log(warning);
		}
	};
	const admitRepair = async () => {
		inspectingActivation = false;
		await assertLegacyGatewayStoppedForMaintenance(env);
		await acquireStoppedMaintenanceResources();
		assertUpdateAdmissionCurrent?.();
		await assertDoctorAgentLeaseAdmission(env);
		repairStoresMayBeOpen = true;
	};
	let admissionFailureHandled = false;
	const failAdmission = async (error, assertStopCustody) => {
		admissionFailureHandled = true;
		if (hasCommandProcessCleanupError(error)) throw error;
		try {
			if (stopped?.stopped) {
				try {
					await acquireStoppedMaintenanceResources();
				} catch (ownershipError) {
					const warning = ownershipError instanceof StateDatabaseCoordinatorContentionError && ownershipError.family === "gateway-lifecycle" ? `Warning: The stopped Gateway still owns gateway-lifecycle after the service stop deadline. Shared-state repair is unsafe while that writer remains active. Restoring its service; run ${formatCliCommand("testclaw gateway status --deep", env)}, then retry ${formatCliCommand("testclaw doctor --fix", env)} after shutdown completes.` : `Warning: Doctor could not reacquire maintenance ownership: ${String(ownershipError)} Restoring its service without repairing shared state.`;
					warnings.push(warning);
					params.runtime.log(warning);
				}
				const { readConfigFileSnapshot } = await import("./config-fCohulPn.js");
				await finish((await readConfigFileSnapshot({
					skipPluginValidation: true,
					observe: false
				})).config, assertStopCustody, void 0, assertStopCustody ?? assertUpdateAdmissionCurrent);
			} else await release();
		} catch (restoreError) {
			throw new AggregateError([error, restoreError], `${String(error)} ${String(restoreError)}`, { cause: restoreError });
		}
		resolveCommandProcessSignal()?.throwIfAborted();
		if (authorityRefused || error instanceof DoctorUnreadableStateDatabaseError) throw error;
		const refusal = error instanceof DoctorMaintenanceRefusalError ? error : new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. ${String(error)}${hasGatewayServiceStopUnsafeError(error) ? "" : ` Stop the Gateway service and other Assistant processes using this state, then run ${formatCliCommand("testclaw doctor --fix", env)} from an independent shell.`}`, classifyDoctorMaintenanceRefusal(error), {
			cause: error,
			...error instanceof UpdateDoctorError ? { failureFacts: error.failureFacts } : {}
		});
		const recovery = inspectingActivation ? await resolveUpdateDoctorGitRecovery({ root: params.root }) : void 0;
		if (recovery) {
			refusal.message += `\n${recovery.message}`;
			recordUpdateDoctorRefusal(refusal.message);
		}
		throw refusal;
	};
	try {
		await settle(async () => {
			const externallyManaged = isServiceRepairExternallyManaged();
			if (externallyManaged) await preflightExternalDoctorAgentLease(env);
			if (params.root && isDefaultInstallIdentity(env) && !externallyManaged && await shouldManageGatewayService(env)) {
				serviceMaintenance = await import("./update-command-service-maintenance-CLJPr2Yr.js");
				const { maybeStopManagedServiceBeforeMutableUpdate } = serviceMaintenance;
				inspectingActivation = true;
				const inspection = await maybeStopManagedServiceBeforeMutableUpdate({
					updateInstallKind: "package",
					root: params.root,
					shouldRestart: true,
					jsonMode: true,
					phase: "inspect"
				});
				assertDoctorMaintenanceInspection(inspection, env);
				if (inspection.serviceUpdateVerdict?.kind !== "absent" && inspection.offline !== true) assertAuthority(() => {
					const admitted = resolveDoctorUpdateAdmission(env);
					assertUpdateAdmissionCurrent = () => assertAuthority(admitted);
				});
				if (inspection.serviceUpdateVerdict?.kind === "owned" && inspection.serviceEnv) assertDoctorServiceSelection(env, inspection.serviceEnv);
				staleReplacement = await inspectStaleDoctorGateway({
					root: params.root,
					env,
					before: inspection,
					assertCurrent: assertUpdateAdmissionCurrent
				});
				if (parentActivation !== void 0 && !staleReplacement && inspection.serviceUpdateVerdict?.kind === "owned" && inspection.offline !== true) throw new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. Error: ${await formatUpdateDoctorServiceStopRefusal(inspection.serviceEnv ?? env)}`, {
					kind: "data-at-risk",
					reason: "gateway-state-unverified"
				});
				try {
					await acquireMaintenanceResources();
				} catch (error) {
					const gatewayOwner = readGatewayOwnerLease({
						env,
						current: true,
						openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
					});
					const legacyGatewayLock = gatewayOwner ? void 0 : await readActiveGatewayLockIdentity({
						env: inspection.serviceEnv ?? env,
						requireInspection: true
					});
					if (!inspection.running || !(gatewayOwner?.state === "live" && gatewayOwner.mode === "supervised" || inspection.servicePid !== void 0 && legacyGatewayLock?.pid === inspection.servicePid)) throw error;
				}
				if (inspection.serviceUpdateVerdict?.kind === "owned") {
					inspectingActivation = false;
					if (inspection.serviceEnv) assertDoctorServiceSelection(env, inspection.serviceEnv);
					if (parentActivation === void 0 || staleReplacement) {
						inspection.serviceUpdateVerdict.refreshDefinition = inspection.serviceUpdateVerdict.requiresInstallRootRefresh === true;
						const root = params.root;
						const { withGatewayServiceOperationLock } = await import("./service-operation-lock-9nzU31uP.js");
						await withGatewayServiceOperationLock(inspection.serviceEnv ?? env, async (assertStopCustody) => {
							let assertServiceCurrent = assertUpdateAdmissionCurrent;
							try {
								await settle(async () => {
									try {
										stopDeadline = performance.now() + GATEWAY_SERVICE_STOP_TIMEOUT_MS;
										stopped = await maybeStopManagedServiceBeforeMutableUpdate({
											updateInstallKind: "package",
											root,
											shouldRestart: true,
											jsonMode: true,
											expectedService: inspection,
											retainNativeIdentity: true,
											assertCurrent: () => assertServiceCurrent?.(),
											warn: (message) => {
												warnings.push(message);
												params.runtime.log(message);
											},
											onStopped: (before) => {
												stopped = before;
											}
										});
										assertDoctorMaintenanceInspection(stopped, env);
										if (stopped.serviceUpdateVerdict?.kind === "unavailable") {
											warnings.push(stopped.serviceUpdateVerdict.message);
											params.runtime.log(stopped.serviceUpdateVerdict.message);
										}
										if (staleReplacement && stopped.serviceEnv) await assertStaleDoctorGatewayStopped({
											stale: staleReplacement,
											env: stopped.serviceEnv,
											assertCurrent: assertUpdateAdmissionCurrent
										});
									} catch (error) {
										if (!staleReplacement || hasCommandProcessCleanupError(error)) throw error;
										throw doctorGatewayMaintenanceError({
											env,
											phase: "gateway-stop",
											code: "stale-gateway-stop-failed",
											detail: String(error),
											cause: error
										});
									}
									if (stopped?.stopped) params.runtime.log("Stopped the managed Gateway for Doctor repair.");
									await admitRepair();
									assertStopCustody();
								});
							} catch (error) {
								assertServiceCurrent = assertStopCustody;
								await failAdmission(error, assertStopCustody);
							}
						});
					}
				} else if (inspection.serviceUpdateVerdict?.kind === "unavailable") {
					warnings.push(inspection.serviceUpdateVerdict.message);
					params.runtime.log(inspection.serviceUpdateVerdict.message);
				} else if (inspection.serviceUpdateVerdict?.kind !== "absent") params.runtime.log("The stopped Gateway service was left unchanged; repairing Doctor's selected state only.");
			}
			if (!repairStoresMayBeOpen) await admitRepair();
			stopped?.windowsTaskAutoStartRecovery?.beginMutation();
			retainStoppedInstallation = stopped?.serviceUpdateVerdict?.kind === "owned" && stopped.serviceUpdateVerdict.requiresInstallRootRefresh === true;
		});
	} catch (error) {
		if (admissionFailureHandled) throw error;
		await failAdmission(error);
	}
	let custody = "held";
	const maintenance = {
		warnings,
		failureFacts,
		run: (operation) => resources.run(operation),
		releaseState: () => settle(releaseState),
		async release() {
			if (this !== maintenance) throw new Error("Gateway restoration requires its original live maintenance owner.");
			custody = "released";
			await release();
		},
		async finish(cfg, writeConfig) {
			if (cleanupFailure) throw cleanupFailure.error;
			const assertCustody = (expected = "restoring") => {
				if (this !== maintenance || custody !== expected) throw new Error("Gateway restoration requires its original live maintenance owner.");
			};
			assertCustody("held");
			custody = "restoring";
			try {
				await finish(cfg, assertCustody, writeConfig);
			} finally {
				custody = "released";
			}
		}
	};
	return maintenance;
}
//#endregion
export { beginDoctorMaintenance };
