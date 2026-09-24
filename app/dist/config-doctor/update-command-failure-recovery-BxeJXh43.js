import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { n as createUpdateFailureFact } from "./update-failure-facts-CzM99Hgb.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { l as withCommandProcessScope } from "./exec-spawn-USR_FeKZ.js";
import { r as readPackageVersion } from "./package-json-CT4OsNvS.js";
import { s as readActiveGatewayLockPort } from "./gateway-lock-BdQ1BI9a.js";
import "./update-run-ledger-DLD5Q47c.js";
import { a as recordUpdateRunDiagnostics } from "./update-run-write-B_JenWiI.js";
import { r as getUpdateRun } from "./update-run-reader-CA3WJ8vB.js";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-D0Ix055V.js";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DuTNaN2c.js";
import { l as readManagedGatewayServiceForUpdate, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-CJ1UFeyr.js";
import { a as verifyUpdatedGateway, t as readFailedUpdateGatewayState } from "./update-command-verification-CA2hYAsZ.js";
import { t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-BGZUZuxB.js";
//#region src/cli/update-cli/update-command-failure-recovery.ts
/** Observe recovery after writers settle; this never starts or stops a Gateway. */
async function verifyUpdateFailureRecovery(params) {
	params.assertCurrent?.();
	const startedAt = Date.now();
	const result = params.result;
	const env = params.env ?? params.opts.run?.env ?? process.env;
	const root = params.root;
	const run = params.opts.run;
	const warnRecording = (message) => {
		params.assertCurrent?.();
		defaultRuntime.error(message);
		result.steps.push({
			name: "gateway recovery recording",
			command: "gateway verification",
			cwd: root,
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message
			}
		});
	};
	let recorded;
	try {
		recorded = run ? getUpdateRun(run.runId, { env: run.env }) : void 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		warnRecording(`Could not read update recovery history: ${formatErrorMessage(error)}`);
	}
	const constraint = recorded?.verification.recovery;
	const previousRecovery = constraint?.serviceRestartSafe === false ? constraint : result.recovery ?? constraint ?? void 0;
	result.recovery = previousRecovery;
	result.rollbackOutcome ??= recorded?.verification.rollbackOutcome ?? void 0;
	result.verification = {};
	const rollback = previousRecovery?.packageRollbackVerified;
	try {
		await withCommandProcessScope(async () => {
			if (params.serviceStopped) {
				try {
					result.verification = {
						...await readFailedUpdateGatewayState(params.opts.run, env),
						versionMatch: void 0,
						readyz: false,
						settled: false,
						channelsReady: false
					};
				} catch (error) {
					if (error instanceof UpdateCommandRecoveryPendingError || hasCommandProcessCleanupError(error)) throw error;
					params.assertCurrent?.();
					warnRecording(`Could not save Gateway recovery verification: ${formatErrorMessage(error)}`);
				}
				params.assertCurrent?.();
			}
			const version = await readPackageVersion(root);
			if (!version) throw new Error("The installed Gateway version could not be read for recovery verification.");
			const buildId = await readBuiltGatewayBuildId(root);
			const gatewayPort = await readActiveGatewayLockPort({
				env,
				requireInspection: true
			}) ?? await resolveUpdatedGatewayRestartPort({
				serviceEnv: env,
				serviceCommand: (await readManagedGatewayServiceForUpdate(env))?.command
			});
			params.assertCurrent?.();
			const validation = await verifyUpdatedGateway({
				result,
				opts: params.opts,
				purpose: "recovery",
				serviceEnv: env,
				gatewayPort,
				expectedVersion: version,
				expectedBuildId: buildId ?? void 0,
				timeoutMs: params.timeoutMs,
				assertCurrent: params.assertCurrent
			});
			params.assertCurrent?.();
			Object.assign(result, appendPluginUpdateWarnings(result, validation.pluginWarnings ?? []));
			const restartUnsafe = previousRecovery?.serviceRestartSafe === false;
			result.recovery = validation.ok && !restartUnsafe ? {
				serviceRestartSafe: true,
				version,
				...buildId ? { buildId } : {},
				...rollback ? { packageRollbackVerified: true } : {},
				service: "healthy"
			} : previousRecovery?.serviceRestartSafe ? {
				...previousRecovery,
				service: validation.stopReason ? void 0 : "failed",
				reason: validation.stopReason ?? validation.summary
			} : previousRecovery ?? {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			};
		});
	} catch (error) {
		if (error instanceof UpdateCommandRecoveryPendingError || hasCommandProcessCleanupError(error)) throw error;
		params.assertCurrent?.();
		const probeFailureStep = {
			name: "gateway recovery verification",
			command: "gateway verification",
			cwd: root,
			durationMs: Math.max(0, Date.now() - startedAt),
			exitCode: 1,
			failureFacts: [createUpdateFailureFact({
				check: "gateway-recovery",
				code: "gateway-probe-failed",
				message: formatErrorMessage(error)
			})]
		};
		const previousStep = result.steps.findIndex((step) => step.name === probeFailureStep.name);
		if (previousStep === -1) result.steps.push(probeFailureStep);
		else result.steps[previousStep] = probeFailureStep;
		result.recovery = previousRecovery?.serviceRestartSafe ? {
			...previousRecovery,
			service: void 0,
			reason: "gateway-probe-failed"
		} : previousRecovery ?? {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		};
	}
	if (run) {
		params.assertCurrent?.();
		result.recovery = recordUpdateRunDiagnostics(run.runId, () => {
			params.assertCurrent?.();
			return result;
		}, warnRecording, { env: run.env })?.verification.recovery ?? (!recorded && result.recovery?.serviceRestartSafe ? void 0 : result.recovery);
	}
	return result;
}
//#endregion
export { verifyUpdateFailureRecovery as t };
