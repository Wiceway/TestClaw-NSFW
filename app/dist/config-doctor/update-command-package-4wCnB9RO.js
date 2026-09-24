import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { p as resolveConfigPath } from "./paths-DeOFr7iP.js";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.js";
import { a as hashConfigRaw } from "./io.read-helpers-DjrAb5Uv.js";
import { n as createUpdateFailureFact, r as normalizeUpdateFailureFacts } from "./update-failure-facts-CzM99Hgb.js";
import { c as consumeUpdatePostInstallDoctorResult, r as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, u as createUpdatePostInstallDoctorResultPath } from "./update-doctor-result-fRe8i0lu.js";
import { i as runCommandWithTimeout } from "./exec-BXnQTpXR.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { t as CLI_NAME } from "./cli-name-CJ5c6edK.js";
import { n as readPackageName, r as readPackageVersion } from "./package-json-CT4OsNvS.js";
import { i as getUpdateDoctorConfigFailureReason, r as formatUpdateDoctorConfigWriteRefusal } from "./update-doctor-config-BrLAVDg0.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CRLdx-fN.js";
import { a as resolveUpdateTargetEnv } from "./update-command-service-env-DYcjXvvU.js";
import { C as verifyPackageUpdateRecovery, _ as resolveGlobalInstallSpec, l as createGlobalInstallEnv, r as normalizeFallbackFailureReason, v as resolveGlobalInstallTarget } from "./update-runner-command-DRKLhVpa.js";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-D0Ix055V.js";
import { f as resolveGlobalManager, h as runUpdateStep, n as UpdatePreMutationError, v as resolveNodeRunner } from "./shared-BUgQgLm0.js";
import "./progress-CexvC1Oq.js";
import { c as failedPackageVerificationStep, l as markPackagePostInstallDoctorAdvisory, t as runGlobalPackageUpdateSteps } from "./package-update-steps-D7b2liL3.js";
import { n as resolveUpdateDoctorExecutionPolicy, t as buildUpdateDoctorEnv } from "./update-runner-doctor-DoQcwses.js";
import { n as readUpdateConfigSnapshot, t as createUpdateConfigSnapshot } from "./update-command-config-snapshot-CBpP0KDp.js";
import { r as withUpdateDoctorChild } from "./update-command-doctor-child-CczKS1rP.js";
import path from "node:path";
//#region src/cli/update-cli/update-command-package.ts
async function readPackageUpdateIdentity(root) {
	const [version, buildId] = await Promise.all([readPackageVersion(root), readBuiltGatewayBuildId(root)]);
	return {
		version,
		...buildId ? { buildId } : {}
	};
}
function preparePackageDoctorContext(params) {
	params.assertCurrent();
	if (!params.capable) return;
	if (!params.runId || !params.executorFence || params.inputHash === void 0) throw new Error("Validated Doctor requires its live update executor and captured config hash.");
	return {
		runId: params.runId,
		executorFence: params.executorFence,
		requester: params.requester,
		inputHash: params.inputHash ?? hashConfigRaw(null),
		changes: params.changes,
		assertCurrent: params.assertCurrent,
		assertBoundChildCurrent: params.assertBoundChildCurrent,
		onStateHandoff: params.onStateHandoff
	};
}
async function runPackageUpdateDoctor(params) {
	const context = params.getDoctorContext?.();
	context?.assertCurrent();
	const entryPath = await resolveGatewayInstallEntrypoint(params.root);
	if (!entryPath) return null;
	const doctorEnv = resolveUpdateTargetEnv({
		serviceEnv: params.managedServiceEnv,
		invocationCwd: params.invocationCwd
	});
	await createUpdateConfigSnapshot(doctorEnv);
	const candidateHostVersion = await readPackageVersion(params.root);
	const doctorResultPath = createUpdatePostInstallDoctorResultPath();
	const doctorPolicy = resolveUpdateDoctorExecutionPolicy({
		targetVersion: candidateHostVersion,
		allowGatewayServiceRepair: false
	});
	const doctorArgv = [params.nodeRunner ?? resolveNodeRunner(), ...context ? [path.join(params.root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath), "--doctor"] : [
		entryPath,
		"doctor",
		"--non-interactive",
		...doctorPolicy.fix ? ["--fix"] : []
	]];
	const doctorProgressInfo = {
		name: `${CLI_NAME} doctor`,
		command: doctorArgv.join(" "),
		index: 0,
		total: 0
	};
	params.progress?.onStepStart?.(doctorProgressInfo);
	const configSnapshot = params.onConfigSnapshot ? await readUpdateConfigSnapshot(resolveConfigPath(doctorEnv)) : void 0;
	const completeDoctorStep = async (doctorStep, doctorResult, failure) => {
		let completionFailure = failure;
		try {
			const refusal = doctorResult?.configWriteRefusal;
			const configWriteRefusal = refusal ? {
				...refusal,
				keys: [.../* @__PURE__ */ new Set([...refusal.keys, ...context?.changes.flatMap((change) => change.kind === "key" ? [change.key] : []) ?? []])].toSorted()
			} : void 0;
			Object.assign(doctorStep, markPackagePostInstallDoctorAdvisory({
				...doctorStep,
				...doctorResult?.configChanges?.length ? { configChanges: doctorResult.configChanges } : {},
				...doctorResult?.warnings?.length ? { warnings: doctorResult.warnings } : {},
				...configWriteRefusal ? {
					configWriteRefusal,
					stderrTail: formatUpdateDoctorConfigWriteRefusal(configWriteRefusal)
				} : {}
			}, doctorResult));
			if (configWriteRefusal) {
				doctorStep.failureFacts = normalizeUpdateFailureFacts([createUpdateFailureFact({
					check: "config",
					code: configWriteRefusal.reason,
					message: formatUpdateDoctorConfigWriteRefusal(configWriteRefusal)
				}), ...doctorStep.failureFacts ?? []]);
				delete doctorStep.advisory;
			}
			if (configSnapshot) {
				const { hash } = await readUpdateConfigSnapshot(configSnapshot.path);
				const doctorHash = doctorResult?.configHash;
				const doctorInputHash = doctorResult?.configInputHash;
				params.onConfigSnapshot?.({
					...configSnapshot,
					hash,
					doctorOwned: doctorInputHash === void 0 ? hash === configSnapshot.hash : doctorInputHash === configSnapshot.hash && hash === (doctorHash === "unchanged" ? doctorInputHash : doctorHash)
				});
			}
		} catch (error) {
			completionFailure = { error: completionFailure ? new AggregateError([completionFailure.error, error], "Doctor config attribution failed", { cause: error }) : error };
		}
		if (completionFailure) {
			Object.assign(doctorStep, failedPackageVerificationStep(params.root, completionFailure.error, doctorStep));
			delete doctorStep.advisory;
		}
		try {
			params.progress?.onStepComplete?.({
				...doctorProgressInfo,
				durationMs: doctorStep.durationMs,
				exitCode: doctorStep.exitCode,
				stdoutTail: doctorStep.stdoutTail,
				stderrTail: doctorStep.stderrTail,
				signal: doctorStep.signal,
				killed: doctorStep.killed,
				outputLimitExceeded: doctorStep.outputLimitExceeded,
				termination: doctorStep.termination,
				advisory: doctorStep.advisory,
				warnings: doctorStep.warnings,
				failureFacts: doctorStep.failureFacts,
				doctorLintFindings: doctorStep.doctorLintFindings,
				configChanges: doctorStep.configChanges,
				configWriteRefusal: doctorStep.configWriteRefusal
			});
		} catch (error) {
			if (completionFailure) throw new AggregateError([completionFailure.error, error], "Doctor progress reporting failed", { cause: error });
			throw error;
		}
		if (completionFailure) throw completionFailure.error;
		return doctorStep;
	};
	const completedSteps = [];
	const runDoctor = (runCommand) => runUpdateStep({
		name: `${CLI_NAME} doctor`,
		results: completedSteps,
		argv: doctorArgv,
		cwd: params.root,
		env: {
			...doctorEnv,
			...buildUpdateDoctorEnv({
				allowGatewayServiceRepair: false,
				allowGatewayActivation: false,
				deferConfiguredPluginInstallRepair: true,
				serviceRepairPolicy: doctorPolicy.serviceRepairPolicy,
				compatibilityHostVersion: candidateHostVersion
			}),
			[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]: doctorResultPath
		},
		timeoutMs: params.timeoutMs,
		...runCommand ? { runCommand } : {}
	});
	let outcome;
	try {
		outcome = { step: context ? await withUpdateDoctorChild({
			root: params.root,
			context: {
				...context,
				assertRequesterCurrent: context.assertBoundChildCurrent
			},
			input: {
				configInputHash: context.inputHash,
				repair: doctorPolicy.fix
			}
		}, runDoctor) : await runDoctor() };
		context?.assertCurrent();
	} catch (error) {
		outcome = { error };
	}
	try {
		if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
		const doctorResult = await consumeUpdatePostInstallDoctorResult(doctorResultPath);
		if ("error" in outcome) {
			const recorded = completedSteps.at(-1);
			if (!recorded) throw outcome.error;
			return await completeDoctorStep(recorded, doctorResult, outcome);
		}
		return await completeDoctorStep(outcome.step, doctorResult);
	} finally {
		params.results?.push(...completedSteps);
	}
}
/** Keep package staging open until its source owner publishes the validated checkout. */
async function prepareGitPackageExposure(params) {
	const prepared = createDeferredCore();
	const activation = createDeferredCore();
	const cancellation = /* @__PURE__ */ new Error("Source activation cancelled before global exposure");
	const completed = runGlobalPackageUpdateSteps({
		...params,
		beforeActivate: async () => {
			prepared.resolve();
			if (!await activation.promise) throw cancellation;
		}
	});
	const outcome = await Promise.race([prepared.promise.then(() => null), completed]);
	if (outcome) {
		const failure = outcome.failedStep;
		throw new UpdatePreMutationError(outcome.reason ?? (failure ? normalizeFallbackFailureReason(failure.name) : "source-exposure-preparation-failed"), failure?.stderrTail ?? "Global source exposure did not reach the activation gate", { failureFacts: failure?.failureFacts });
	}
	return {
		activate: () => {
			activation.resolve(true);
			return completed;
		},
		cancel: async () => {
			activation.resolve(false);
			try {
				return await completed;
			} catch (error) {
				if (error !== cancellation) throw error;
				return {
					steps: [],
					recovery: await verifyPackageUpdateRecovery(params.installTarget.packageRoot)
				};
			}
		}
	};
}
/** Retain one staged target while its runtime initializes a fresh profile. */
async function stagePackageInstallUpdate(params) {
	const staged = createDeferredCore();
	const continuation = createDeferredCore();
	let continued = false;
	let active;
	const requireActive = () => {
		if (!active) throw new Error("Staged update has not been admitted for activation.");
		return active;
	};
	const completed = runPackageInstallUpdate({
		...params,
		requirePackageReplacement: true,
		progress: {
			onStepStart: (step) => (active?.progress ?? params.progress)?.onStepStart?.(step),
			onStepComplete: (step) => (active?.progress ?? params.progress)?.onStepComplete?.(step),
			onHeartbeat: () => (active?.progress ?? params.progress)?.onHeartbeat?.()
		},
		validateCandidate: async (root) => {
			staged.resolve(root);
			active = await continuation.promise;
			if (!active) throw new Error("Fresh-state initialization stopped before package activation.");
			return await active.validateCandidate(root);
		},
		beforeActivate: () => requireActive().beforeActivate(),
		onTransaction: (transaction) => requireActive().onTransaction(transaction),
		onConfigSnapshot: (snapshot) => requireActive().onConfigSnapshot?.(snapshot)
	}, () => requireActive());
	const ready = await Promise.race([staged.promise.then((root) => ({ root })), completed.then((result) => ({ result }))]);
	if ("result" in ready) throw new UpdatePreMutationError(ready.result.reason ?? "package-staging-failed", ready.result.failedStep?.stderrTail ?? "Package staging did not produce a target runtime.", { failureFacts: ready.result.failedStep?.failureFacts });
	return {
		root: ready.root,
		async run(next) {
			if (continued) throw new Error("A staged update can be activated only once.");
			continued = true;
			continuation.resolve(next);
			return await completed;
		},
		async close() {
			if (!continued) {
				continued = true;
				continuation.resolve(void 0);
			}
			await completed;
		}
	};
}
async function runPackageInstallUpdate(params, resolveDoctorOptions = () => params) {
	const installEnv = params.installEnv ?? await createGlobalInstallEnv();
	let installTarget = params.installTarget;
	if (!installTarget) {
		const manager = await resolveGlobalManager({
			root: params.root,
			installKind: params.installKind,
			timeoutMs: params.timeoutMs
		});
		installTarget = await resolveGlobalInstallTarget({
			manager,
			runCommand: runCommandWithTimeout,
			timeoutMs: params.timeoutMs,
			pkgRoot: params.root,
			honorPackageRoot: params.honorPackageRoot === true
		});
	}
	const pkgRoot = installTarget.packageRoot;
	const packageName = (pkgRoot ? await readPackageName(pkgRoot) : await readPackageName(params.root)) ?? "testclaw";
	const installSpec = params.installSpec ?? resolveGlobalInstallSpec({
		packageName,
		tag: params.tag,
		env: installEnv
	});
	const before = pkgRoot ? await readPackageUpdateIdentity(pkgRoot) : { version: null };
	const packageUpdate = await runGlobalPackageUpdateSteps({
		localOverrides: {
			reapply: params.reapplyLocalOverrides === true,
			env: resolveUpdateTargetEnv({
				serviceEnv: params.managedServiceEnv,
				invocationCwd: params.invocationCwd
			})
		},
		validateCandidate: params.validateCandidate,
		beforeActivate: params.beforeActivate,
		assertCurrent: params.assertCurrent,
		onTransaction: params.onTransaction,
		installTarget,
		installSpec,
		packageName,
		packageRoot: pkgRoot,
		requirePackageReplacement: params.requirePackageReplacement === true || params.installKind === "git",
		runCommand: runCommandWithTimeout,
		timeoutMs: params.timeoutMs,
		...installEnv === void 0 ? {} : { env: installEnv },
		runStep: (stepParams) => runUpdateStep({
			...stepParams,
			progress: params.progress
		}),
		postVerifyStep: (root, results) => runPackageUpdateDoctor({
			...resolveDoctorOptions(),
			root,
			results
		})
	});
	const afterBuildId = packageUpdate.activePackageRoot ? await readBuiltGatewayBuildId(packageUpdate.activePackageRoot) : null;
	return {
		status: packageUpdate.reason === "already-current" ? "skipped" : packageUpdate.failedStep ? "error" : "ok",
		mode: installTarget.manager,
		root: packageUpdate.activePackageRoot ?? void 0,
		reason: getUpdateDoctorConfigFailureReason(packageUpdate.failedStep?.configWriteRefusal) ?? packageUpdate.reason ?? (packageUpdate.failedStep ? normalizeFallbackFailureReason(packageUpdate.failedStep.name) : void 0),
		before,
		after: {
			version: packageUpdate.afterVersion,
			...afterBuildId ? { buildId: afterBuildId } : {}
		},
		steps: packageUpdate.steps,
		failedStep: packageUpdate.failedStep ?? void 0,
		recovery: packageUpdate.recovery,
		localOverrides: packageUpdate.localOverrides,
		durationMs: Date.now() - params.startedAt
	};
}
//#endregion
export { runPackageUpdateDoctor as a, runPackageInstallUpdate as i, preparePackageDoctorContext as n, stagePackageInstallUpdate as o, readPackageUpdateIdentity as r, prepareGitPackageExposure as t };
