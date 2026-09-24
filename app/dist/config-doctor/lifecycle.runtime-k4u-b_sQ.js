import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { a as rewritePnpmVersionedAssistantEntryPath } from "./testclaw-root-QV2nsx8w.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { _ as rotateAgentEventLifecycleGeneration } from "./agent-events-CFq48PcN.js";
import { r as reloadTaskRuntimeStateFromStore } from "./runtime-internal-CtpnHnDF.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { E as waitForActiveCronJobs, T as resetCronActiveJobs, t as advanceCronActiveJobGeneration } from "./active-jobs-DhbrbXjH.js";
import { a as retireActiveCronTaskRunTracking, s as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "./active-run-cancellation-CX3A7Ug0.js";
import { f as markGatewayDraining, m as resetAllLanes } from "./command-queue-BKEY7Dlw.js";
import { a as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-pyrECV9q.js";
import { s as writeDiagnosticStabilityBundleForFailureSync } from "./diagnostic-stability-bundle-C_tTgtXb.js";
import { n as abortEmbeddedAgentRun } from "./runs-CKg3ezhN.js";
import { n as listActiveEmbeddedRunSessionIds } from "./active-run-projections-B6zm9PS3.js";
import { E as writeRestartSentinelIfUnchanged, g as readRestartSentinelReadOnly, m as markUpdateRestartSentinelFailure } from "./restart-sentinel-NcxkaoWW.js";
import { a as markGatewayRestartHandled, c as resetGatewayRestartStateForInProcessRestart, g as abortPendingChannelReloads, i as isGatewayRestartExternallyAllowed, l as rollbackGatewayRestartSignalAdmission, n as consumeGatewayRestartIntent, o as peekGatewayRestartReason, p as triggerAssistantRestart, s as requestGatewayRestartWithSignalAdmission, t as consumeGatewayRestartAuthorization, u as scheduleGatewayRestart } from "./restart-BjZoWnnd.js";
import { n as resolveGatewayRestartDrainTimeoutMs } from "./restart-budget-DsnfmfzB.js";
import { n as consumeGatewayRestartIntentPayloadSync, r as consumeGatewayRestartIntentSync } from "./restart-intent-CHYElIGm.js";
import { c as isWindowsTaskSupervisorChildArgument, l as readWindowsTaskSupervisorRestartExitCode } from "./windows-task-supervisor-contract-BzWmAmHJ.js";
import { n as scheduleDetachedLaunchdRestartHandoff } from "./launchd-restart-handoff-vJnJWotT.js";
import { i as detectRespawnSupervisor, n as detectGatewayRespawnSupervisor, r as detectGatewayRespawnSupervisorIdentity } from "./supervisor-markers-Cm1H0Euq.js";
import { n as waitForGatewayHealthyRestart } from "./restart-health-Cn_P9AI4.js";
import { i as writeGatewayRestartHandoffSync } from "./restart-handoff-BwQ2z-mN.js";
import { a as claimManagedServiceUpdateHandoff, f as requestManagedServiceUpdateHandoffPark, i as captureForegroundUpdateHandoffStop, o as commitManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff, s as completeForegroundUpdateHandoffAfterClose, u as isForegroundUpdateHandoff } from "./update-managed-service-handoff-BuncpUGp.js";
import { r as waitForGatewayActiveWork, t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-BHiqes-3.js";
import { o as resetGatewaySuspendCoordinatorForLifecycleRestart } from "./gateway-suspend-coordinator-6MOFY0oz.js";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
function resolveGatewayRestartDecision() {
	if (isTruthyEnvValue(process.env.TESTCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		reason: "no-respawn"
	};
	const supervisor = detectGatewayRespawnSupervisor(process.env);
	if (supervisor) return {
		mode: "supervised",
		supervisor
	};
	return {
		mode: "disabled",
		reason: "unmanaged",
		detail: process.platform === "win32" ? "win32: detached respawn unsupported without Scheduled Task markers" : isContainerEnvironment() ? "container: use in-process restart to keep PID 1 alive" : "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Attempt to restart this process with a fresh PID.
* - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
* - TESTCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
* - unmanaged environments: caller should keep in-process restart behavior so
*   custom supervisors keep tracking the same gateway PID
*/
function restartGatewayProcessWithFreshPid(opts = {}) {
	const decision = opts.decision ?? resolveGatewayRestartDecision();
	if (decision.mode === "disabled") return decision.reason === "no-respawn" ? { mode: "disabled" } : {
		mode: "disabled",
		detail: decision.detail
	};
	const { supervisor } = decision;
	if (supervisor === "launchd") {
		const handoff = scheduleDetachedLaunchdRestartHandoff({
			mode: "start-after-exit",
			waitForPid: process.pid
		});
		return handoff.ok ? {
			mode: "supervised",
			handoffSpawned: handoff.value
		} : {
			mode: "failed",
			detail: handoff.error
		};
	}
	if (supervisor === "schtasks") {
		if (process.argv.some(isWindowsTaskSupervisorChildArgument)) {
			const exitCode = readWindowsTaskSupervisorRestartExitCode(process.argv);
			if (exitCode === void 0) return {
				mode: "failed",
				detail: "Windows task supervisor restart marker is missing or invalid"
			};
			return {
				mode: "supervised",
				exitCode
			};
		}
		const restart = triggerAssistantRestart();
		if (!restart.ok) return {
			mode: "failed",
			detail: restart.detail ?? `${restart.method} restart failed`
		};
	}
	return { mode: "supervised" };
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* The caller resolves supervisor ownership first; this path is only for an
* unmanaged process whose installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	const decision = opts.decision ?? resolveGatewayRestartDecision();
	if (decision.mode === "disabled" && decision.reason === "no-respawn") return {
		mode: "disabled",
		detail: "TESTCLAW_NO_RESPAWN"
	};
	try {
		const [entryArg, ...entryArgs] = process.argv.slice(1);
		const args = [
			...process.execArgv,
			...entryArg ? [rewritePnpmVersionedAssistantEntryPath(entryArg)] : [],
			...entryArgs
		];
		const child = spawn(process.execPath, args, {
			env: opts.env ? {
				...process.env,
				...opts.env
			} : process.env,
			detached: true,
			stdio: "inherit"
		});
		child.on("error", () => {});
		child.unref();
		return {
			mode: "spawned",
			pid: child.pid ?? void 0,
			child
		};
	} catch (err) {
		return {
			mode: "failed",
			detail: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region src/cli/gateway-cli/lifecycle.runtime.ts
async function stopGatewayManagedProviderLocalServices() {
	const { hasManagedProviderLocalServices } = await import("./provider-runtime-lifecycle-BpYe1F11.js");
	if (!hasManagedProviderLocalServices()) return;
	const { stopManagedProviderLocalServices } = await import("./provider-local-service-CMikTzfv.js");
	await stopManagedProviderLocalServices();
}
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, cancelManagedServiceUpdateHandoff, captureForegroundUpdateHandoffStop, claimManagedServiceUpdateHandoff, commitManagedServiceUpdateHandoff, completeForegroundUpdateHandoffAfterClose, consumeGatewayRestartAuthorization, consumeGatewayRestartIntent, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, createGatewayActiveWorkSnapshot, detectGatewayRespawnSupervisor, detectGatewayRespawnSupervisorIdentity, detectRespawnSupervisor, getDiagnosticSessionActivitySnapshot, isForegroundUpdateHandoff, isGatewayRestartExternallyAllowed, listActiveEmbeddedRunSessionIds, markGatewayDraining, markGatewayRestartHandled, markUpdateRestartSentinelFailure, peekGatewayRestartReason, readRestartSentinelReadOnly, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, requestManagedServiceUpdateHandoffPark, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDecision, resolveGatewayRestartDrainTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewayRestart, stopGatewayManagedProviderLocalServices, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForGatewayActiveWork, waitForGatewayHealthyRestart, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync, writeRestartSentinelIfUnchanged };
