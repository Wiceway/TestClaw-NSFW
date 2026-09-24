import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-PRvzp9PM.mjs";
import { i as terminateStaleGatewayPids } from "./restart-stale-pids-CLokJIf8.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-DDSLXVaJ.mjs";
import { f as recordUpdateRunPhase } from "./update-run-ledger-CWjgjkCi.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BWH3Jzzo.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-DODQwMtT.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-DbNjnRg7.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-C_9Me3Ow.mjs";
import { _ as tryWriteCompletionCache } from "./shared-hPUQ-y6A.mjs";
import { o as installCompletion } from "./completion-runtime-Bq08T9nT.mjs";
import { t as createUpdateConfigSnapshot } from "./update-command-config-snapshot-lwby1wkA.mjs";
import { a as verifyUpdatedGateway, c as recoverLaunchAgentAndRecheckGatewayHealth, d as hasLoadedLaunchdKeepAliveSupervisor, f as DEFINITION_DENIAL, g as runUpdatedInstallGatewayCommand, m as isPackageManagerUpdateMode, n as recordFailedUpdateGatewayState, p as GatewayRestartHealthError, r as recordUpdateGatewayHealth } from "./update-command-verification-CdBQ4jOm.mjs";
import { t as CLI_NAME } from "./cli-name-CJ5c6edK.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { a as gatewayServiceCommandUsesRoot, i as assertGatewayServiceManagementAllowedForUpdate, p as resolveUpdatedGatewayRestartPort, u as resolveGatewayServiceManagementBlockMessageForUpdate } from "./update-command-service-plan-BvweOT5A.mjs";
import { s as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-maintenance-C6WxOSeg.mjs";
import { f as recordServiceReconciliationWarning, p as recordServiceReconciliationWarnings } from "./update-command-result-C1yfMxMf.mjs";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-BMG0W0m8.mjs";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/update-command-service.ts
function shouldPrepareUpdatedInstallRestart(params) {
	return params.requiresInstallRootRefresh === true || isPackageManagerUpdateMode(params.updateMode) || params.updateMode === "git" && params.serviceStoppedForUpdate ? params.serviceInstalled : params.serviceLoaded && (params.updateMode !== "git" || params.serviceMatchesUpdateRoot === true);
}
function resolvePostUpdateServiceStateReadEnv(params) {
	const fallbackEnv = params.processEnv ?? process.env;
	return params.updateMode === "git" || isPackageManagerUpdateMode(params.updateMode) ? params.preManagedServiceEnv ?? fallbackEnv : fallbackEnv;
}
async function tryInstallShellCompletion(opts) {
	try {
		await tryWriteCompletionCache(opts.root, opts.jsonMode);
	} catch (err) {
		if (!opts.jsonMode) {
			const completionCacheRefreshCommand = formatCliCommand("testclaw completion --write-state");
			defaultRuntime.log(theme.warn(`Completion cache update failed: ${formatErrorMessage(err)}. Update will continue; retry with: ${completionCacheRefreshCommand}`));
		}
	}
	if (opts.jsonMode || !process.stdin.isTTY) return;
	try {
		const status = await checkShellCompletionStatus(CLI_NAME);
		const generationOptions = { generationMode: "core-only" };
		if (status.usesSlowPattern) {
			defaultRuntime.log(theme.muted("Upgrading shell completion to cached version..."));
			if (!await ensureCompletionCacheExists("testclaw", generationOptions)) throw new Error("completion cache generation failed");
			await installCompletion(status.shell, true, CLI_NAME);
			return;
		}
		if (status.profileInstalled && !status.cacheExists) {
			defaultRuntime.log(theme.muted("Regenerating shell completion cache..."));
			if (!await ensureCompletionCacheExists("testclaw", generationOptions)) throw new Error("completion cache generation failed");
			return;
		}
		if (!status.profileInstalled && !opts.skipPrompt) {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Shell completion"));
			const shouldInstall = await confirm({
				message: stylePromptMessage(`Enable ${status.shell} shell completion for ${CLI_NAME}?`),
				initialValue: true
			});
			if (isCancel(shouldInstall) || !shouldInstall) {
				defaultRuntime.log(theme.muted(`Skipped. Run \`${formatCliCommand("testclaw completion --install")}\` later to enable.`));
				return;
			}
			if (!await ensureCompletionCacheExists("testclaw", generationOptions)) throw new Error("completion cache generation failed");
			await installCompletion(status.shell, false, CLI_NAME);
		}
	} catch (err) {
		const message = formatErrorMessage(err);
		defaultRuntime.log(theme.warn(`Shell completion refresh failed: ${message}. Update will continue. Resolve the reported error before retrying: ${formatCliCommand("testclaw completion --write-state --install")}`));
	}
}
async function maybeRestartService(params) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.opts.run !== run || run?.executorFence !== executor) throw new Error("Native restart lost its original update executor.");
		executor?.assertCurrent();
	};
	assertCurrent();
	const invocationEnv = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	const serviceEnv = resolveServiceRefreshEnv(params.serviceEnv ?? invocationEnv, params.invocationCwd);
	const recordPhase = (phase) => {
		assertCurrent();
		if (params.opts.run) recordUpdateRunPhase(params.opts.run.runId, phase, void 0, { env: params.opts.run.env });
	};
	const failed = async (outcome = "failed") => {
		recordPhase("verifying");
		await recordFailedUpdateGatewayState(params.opts.run, serviceEnv, assertCurrent);
		assertCurrent();
		return outcome;
	};
	if (params.shouldRestart) {
		const message = resolveGatewayServiceManagementBlockMessageForUpdate(invocationEnv) ?? resolveGatewayServiceManagementBlockMessageForUpdate(serviceEnv);
		if (message) {
			defaultRuntime.error(message);
			return await failed();
		}
	}
	let activation = {
		...params,
		invocationEnv,
		serviceEnv,
		assertCurrent,
		onWarnings: (warnings) => recordServiceReconciliationWarnings(params.result, warnings, run, assertCurrent)
	};
	const verdict = activation.serviceUpdateVerdict;
	let preserveDefinition = verdict?.kind === "unresolved" || verdict?.kind === "owned" && !verdict.refreshDefinition;
	if (params.definitionRecovery?.backup || params.definitionRecovery?.preserved) {
		activation.refreshServiceEnv = false;
		activation.serviceRuntimeRefreshRequired = false;
		preserveDefinition = true;
	}
	const requiresInstallRootRefresh = verdict?.kind === "owned" && verdict.requiresInstallRootRefresh;
	const isPackageUpdate = isPackageManagerUpdateMode(activation.result.mode);
	const canRestartUpdatedInstall = () => preserveDefinition || isPackageUpdate && (activation.refreshServiceEnv || activation.serviceInstallEnv === null || activation.requireRunningServiceAfterRestart);
	if (preserveDefinition && !params.definitionRecovery?.backup) defaultRuntime.error("Gateway service definition left unchanged; ask its deployment owner to repair stale metadata if needed.");
	if (activation.serviceMutationSkipMessage) {
		recordServiceReconciliationWarning(activation.result, activation.serviceEnv, activation.serviceMutationSkipMessage);
		return "ok";
	}
	const reconciliationPending = async () => {
		if (activation.requireRunningServiceAfterRestart) recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `The previous service installation was not restarted automatically because update state may have changed. Inspect \`${formatCliCommand("testclaw gateway status --deep", activation.serviceEnv)}\` before choosing a recovery installation.`);
		await recordFailedUpdateGatewayState(params.opts.run, activation.serviceEnv, assertCurrent);
		assertCurrent();
		return "reconciliation-pending";
	};
	let activationAccepted = false;
	let childReadinessPending = false;
	let updatedInstallRestartNeedsServiceRootProof = false;
	const verifyRestartedGateway = async (expectedGatewayVersion, expectedGatewayBuildId, opts = {}) => {
		recordPhase("verifying");
		const verification = await verifyUpdatedGateway({
			result: activation.result,
			opts: activation.opts,
			serviceEnv: activation.serviceEnv,
			gatewayPort: activation.gatewayPort,
			timeoutMs: activation.timeoutMs,
			nodeRunner: activation.nodeRunner,
			expectedVersion: expectedGatewayVersion,
			expectedBuildId: expectedGatewayBuildId,
			requireRunningService: opts.requireRunningService,
			health: opts.health,
			onVerified: params.onVerified,
			assertCurrent,
			recoverHealth: async (initialHealth, reinspect) => {
				assertCurrent();
				if (childReadinessPending || opts.recoverHealth === false) return {
					health: initialHealth,
					launchAgentRecovery: null
				};
				let health = initialHealth;
				if (!health.healthy && health.staleGatewayPids.length > 0) {
					if (!activation.opts.json) defaultRuntime.log(theme.warn(`Found stale gateway process(es) after restart: ${health.staleGatewayPids.join(", ")}. Cleaning up...`));
					const terminated = await terminateStaleGatewayPids(health.staleGatewayPids, {
						env: activation.serviceEnv,
						assertCurrent
					});
					assertCurrent();
					const currentOwner = readGatewayOwnerLease({ env: activation.serviceEnv });
					if (terminated.length > 0 && (!currentOwner || currentOwner.state === "dead") && (canRestartUpdatedInstall() || !isPackageUpdate)) activationAccepted = await runUpdatedInstallGatewayCommand(activation, "restart") === "accepted";
					health = await reinspect();
				}
				const recovery = await recoverLaunchAgentAndRecheckGatewayHealth({
					updateRun: params.opts.run,
					assertCurrent,
					preserveDefinition,
					health,
					service: resolveGatewayService(),
					port: activation.gatewayPort,
					timeoutMs: activation.timeoutMs,
					expectedVersion: expectedGatewayVersion,
					...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
					requirePluginHealth: false,
					env: activation.serviceEnv
				});
				assertCurrent();
				if (recovery.launchAgentRecovery?.attempted) activationAccepted = recovery.launchAgentRecovery.recovered;
				return recovery;
			}
		});
		assertCurrent();
		if (verification.stopReason === "still-starting" && activation.result.status !== "error") activation.result.reason = "still-starting";
		if (verification.stopReason === "gateway-readiness-pending" || verification.stopReason === "still-starting") return "readiness-pending";
		if (!verification.ok) params.onVerificationFailure?.(verification.summary);
		else if (verification.pluginWarnings?.length) params.onPluginWarnings?.(verification.pluginWarnings);
		return verification.ok ? "ok" : void 0;
	};
	if (activation.shouldRestart) {
		if ((requiresInstallRootRefresh || activation.serviceRuntimeRefreshRequired) && (!activation.refreshServiceEnv || activation.serviceInstallEnv === null)) {
			defaultRuntime.error("The updated installation requires a writable gateway service definition.");
			return await failed();
		}
		if (!activation.opts.json) {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Restarting service..."));
		}
		try {
			const expectedIdentity = activation.expectedGatewayIdentity ?? activation.result.after;
			let expectedGatewayVersion = normalizeOptionalString(expectedIdentity?.version);
			const expectedGatewayBuildId = normalizeOptionalString(expectedIdentity?.buildId);
			const canVerifyUpdatedGatewayByVersion = expectedGatewayVersion !== void 0 && expectedGatewayVersion !== normalizeOptionalString(activation.result.before?.version);
			let restarted = false;
			let refreshedGatewayHealth;
			if (activation.refreshServiceEnv && activation.serviceInstallEnv !== null) {
				try {
					recordPhase("restarting");
					await runUpdatedInstallGatewayCommand(activation, "install");
					if (expectedGatewayVersion && (isPackageUpdate || expectedGatewayBuildId) && !(process.platform === "win32" && requiresInstallRootRefresh)) {
						recordPhase("verifying");
						const service = resolveGatewayService();
						const supervisorKeepsAlive = await hasLoadedLaunchdKeepAliveSupervisor({
							service,
							env: activation.serviceEnv
						});
						assertCurrent();
						const health = await waitForGatewayHealthyRestart({
							service,
							port: activation.gatewayPort,
							timeoutMs: activation.timeoutMs,
							expectedVersion: expectedGatewayVersion,
							...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
							requirePluginHealth: false,
							env: activation.serviceEnv,
							requireRunningService: true,
							settle: { probes: 12 },
							supervisorKeepsAlive
						});
						assertCurrent();
						refreshedGatewayHealth = health.healthy || health.waitOutcome === "timeout" || health.waitOutcome === "still-starting" ? health : void 0;
						recordUpdateGatewayHealth(params.opts.run, health, activation.gatewayPort);
					}
				} catch (err) {
					if (hasCommandProcessCleanupError(err)) throw err;
					assertCurrent();
					if (err instanceof UpdateCommandRecoveryPendingError) throw err;
					const warning = `Failed to reconcile gateway service with ${activation.result.root ?? "the updated install"}: ${String(err)}. Run \`${formatCliCommand("testclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("testclaw gateway restart", activation.serviceEnv)}\`.`;
					recordServiceReconciliationWarning(activation.result, activation.serviceEnv, warning);
					if (activation.serviceRuntimeRefreshRequired) {
						params.onVerificationFailure?.("service-runtime-refresh-failed");
						throw err;
					}
					if (activation.definitionRecovery?.unverified) {
						params.onVerificationFailure?.("service-definition-rollback-unverified");
						throw err;
					}
					if (requiresInstallRootRefresh) return await reconciliationPending();
					if (DEFINITION_DENIAL.test(String(err))) {
						preserveDefinition = true;
						if (verdict?.kind !== "owned") throw err;
						const state = await readGatewayServiceState(resolveGatewayService(), {
							env: activation.serviceEnv,
							requireEffective: true,
							requireLoadedCommand: true,
							validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
							timeoutMs: activation.timeoutMs
						});
						assertCurrent();
						await revalidateManagedGatewayServiceAfterUpdate({
							state,
							root: activation.result.root ?? verdict.root,
							preManagedServiceStop: {
								serviceManagerUid: activation.serviceManagerUid,
								serviceEnv: activation.serviceEnv,
								serviceUpdateVerdict: {
									...verdict,
									refreshDefinition: false
								}
							}
						});
						assertCurrent();
						activation = {
							...activation,
							serviceEnv: state.env,
							gatewayPort: await resolveUpdatedGatewayRestartPort({
								serviceEnv: state.env,
								serviceCommand: state.command
							})
						};
						assertCurrent();
						expectedGatewayVersion = normalizeOptionalString(activation.result.after?.version);
					}
					if (isPackageUpdate) updatedInstallRestartNeedsServiceRootProof = !canVerifyUpdatedGatewayByVersion;
				}
				if (requiresInstallRootRefresh && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
					recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `Gateway service still points outside the updated install ${activation.result.root}. Run \`${formatCliCommand("testclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("testclaw gateway restart", activation.serviceEnv)}\`.`);
					return await reconciliationPending();
				}
			}
			if (refreshedGatewayHealth) return await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, {
				requireRunningService: true,
				health: refreshedGatewayHealth
			}) ?? await failed("restart-health-failed");
			if (canRestartUpdatedInstall() || !isPackageUpdate && !activation.skipLegacyServiceRestart) {
				if (!preserveDefinition) await createUpdateConfigSnapshot();
				recordPhase("restarting");
				const restart = await runUpdatedInstallGatewayCommand(activation, "restart").catch((error) => {
					if (!(error instanceof GatewayRestartHealthError)) throw error;
					childReadinessPending = true;
					defaultRuntime.error("Gateway is not ready yet; continuing update readiness verification.");
					return "accepted";
				});
				restarted = true;
				activationAccepted = restart === "accepted";
				if (updatedInstallRestartNeedsServiceRootProof && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
					if (!activation.opts.json) defaultRuntime.log(theme.warn("Gateway service did not point at the updated install after restart."));
					return await failed();
				}
			} else if (!activation.opts.json) defaultRuntime.log(theme.muted("Gateway: restart skipped (no installed service found)."));
			if (restarted || activation.requireRunningServiceAfterRestart) {
				const requireRunningService = updatedInstallRestartNeedsServiceRootProof || activation.requireRunningServiceAfterRestart;
				const restartHealthy = await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, { requireRunningService });
				if (!restartHealthy) {
					if (!activation.opts.json) defaultRuntime.log("");
					return await failed(activationAccepted ? "restart-health-failed" : "failed");
				}
				if (restartHealthy === "readiness-pending") return restartHealthy;
			}
			if (!activation.opts.json && restarted && !preserveDefinition) {
				defaultRuntime.log(theme.success("Daemon restarted successfully."));
				defaultRuntime.log("");
			}
		} catch (err) {
			if (hasCommandProcessCleanupError(err)) throw err;
			assertCurrent();
			if (err instanceof UpdateCommandRecoveryPendingError) throw err;
			if (err instanceof GatewayRestartHealthError && !updatedInstallRestartNeedsServiceRootProof) return await verifyRestartedGateway(normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.version), normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.buildId), {
				requireRunningService: true,
				recoverHealth: false
			}) ?? await failed("restart-health-failed");
			defaultRuntime.error(`Gateway: restart failed: ${String(err)}. Code update remains installed; a service stopped for update may still be stopped. Run \`${formatCliCommand("testclaw gateway status --deep", activation.serviceEnv)}\` and ask its service owner to restart it manually.`);
			return await failed();
		}
	} else if (!activation.opts.json) {
		defaultRuntime.log("");
		defaultRuntime.log(theme.muted("Gateway: restart skipped (--no-restart)."));
		if (activation.result.mode === "npm" || activation.result.mode === "pnpm") defaultRuntime.log(theme.muted(`Tip: Run \`${formatCliCommand("testclaw doctor", activation.serviceEnv)}\`, then \`${formatCliCommand("testclaw gateway restart", activation.serviceEnv)}\` to apply updates to a running gateway.`));
		else defaultRuntime.log(theme.muted(`Tip: Run \`${formatCliCommand("testclaw gateway restart", activation.serviceEnv)}\` to apply updates to a running gateway.`));
	}
	return "ok";
}
//#endregion
export { tryInstallShellCompletion as i, resolvePostUpdateServiceStateReadEnv as n, shouldPrepareUpdatedInstallRestart as r, maybeRestartService as t };
