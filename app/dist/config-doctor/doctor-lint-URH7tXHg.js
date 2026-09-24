import { N as tryResolveDefaultAgentId, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DeOFr7iP.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CwtWaSiY.js";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-vvtahMcf.js";
import { s as closeAssistantStateDatabaseByPathAsync } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { a as withArtifactPreservingStateReads, o as withDisposableAssistantStateReads, p as withAssistantStateDatabaseReadSnapshot } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as AssistantStateLeaseAcquisitionError } from "./testclaw-state-lease-error-LeoKUUrG.js";
import { a as withPluginInstallRoots, i as resolvePluginInstallRoots } from "./install-root-context-Dj6kLnap.js";
import { t as captureRuntimeConfig } from "./runtime-source-projection-CudV4k5X.js";
import "./agent-scope-BiRi-Smp.js";
import { o as readDeferredPluginMigrations } from "./deferred-plugin-migrations-DGeuNy95.js";
import { o as maybeLoadDotEnvForConfig } from "./io.read-helpers-DjrAb5Uv.js";
import { t as createConfigIO } from "./io.factory-D6Qm5I9o.js";
import { c as readConfigFileSnapshot, d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-SMf2br4D.js";
import { t as UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX } from "./update-doctor-lint-ucnpJj2Y.js";
import { c as isPostCoreConvergencePass, l as isUpdateDoctorLintPass } from "./update-phase-B3ln2lPo.js";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-PVjhuNzO.js";
import { i as parseHealthFindingSeverity, n as healthFindingMeetsSeverity, r as isHealthCheckEnabledByDefault, t as HEALTH_FINDING_SEVERITY_RANK } from "./health-checks-B3n_-tw2.js";
import { n as writeJsonResult } from "./doctor-lint-output-B0DvKaKH.js";
import { n as configValidationIssuesToHealthFindings } from "./doctor-config-validation-findings-D7tAFYfr.js";
import { a as listHealthChecks, i as listExtensionHealthChecksForDoctor } from "./health-check-registry-AvzmSJIz.js";
import { n as resolveDoctorUpdateBudget, t as admitDoctorUpdateInspection } from "./doctor-update-budget-DeAFpcVB.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/flows/doctor-lint-flow.ts
/** Runs selected health checks in lint mode and returns sorted findings. */
async function runDoctorLintChecks(ctx, opts = {}) {
	const all = opts.checks ?? listHealthChecks();
	const skip = opts.skipIds instanceof Set ? opts.skipIds : new Set(opts.skipIds ?? []);
	const only = opts.onlyIds instanceof Set ? opts.onlyIds : new Set(opts.onlyIds ?? []);
	const allIds = new Set(all.map((check) => check.id));
	const includeDefaultDisabled = opts.includeAllChecks === true;
	const selected = all.filter((c) => {
		if (only.size > 0 && !only.has(c.id)) return false;
		if (only.size === 0 && !includeDefaultDisabled && !isHealthCheckEnabledByDefault(c)) return false;
		if (skip.has(c.id)) return false;
		return true;
	});
	const findings = [];
	for (const id of only) {
		let message;
		if (!allIds.has(id)) message = `Unknown health check id selected by --only: ${id}.`;
		else if (selected.length === 0 && skip.has(id)) message = `Health check ${id} cannot be selected by --only and excluded by --skip.`;
		else continue;
		findings.push({
			checkId: "core/doctor/lint-selection",
			severity: "error",
			message,
			path: id
		});
	}
	for (const check of selected) try {
		const out = await check.detect(ctx);
		for (const f of out) findings.push(f);
	} catch (err) {
		const aborted = err instanceof AssistantStateLeaseAcquisitionError && err.outcome.kind === "aborted" ? err.outcome : void 0;
		findings.push({
			checkId: check.id,
			severity: aborted ? "info" : "error",
			...aborted ? { errorCode: "TESTCLAW_STATE_LEASE_ABORTED" } : {},
			message: aborted ? `state lease inspection not performed: aborted after ${aborted.elapsedMs} ms by the caller's signal` : `health check threw: ${scrubDoctorErrorMessage(err)}`
		});
	}
	findings.sort(compareFindings);
	return {
		findings,
		checksRun: selected.length,
		checksSkipped: all.length - selected.length
	};
}
/** Internal update gate selection; public Doctor lint remains selector-driven. */
function selectUpdateReadinessChecks(checks, phase) {
	return checks.filter((check) => "updateReadiness" in check && check.updateReadiness === phase);
}
function compareFindings(a, b) {
	const sevDelta = HEALTH_FINDING_SEVERITY_RANK[b.severity] - HEALTH_FINDING_SEVERITY_RANK[a.severity];
	if (sevDelta !== 0) return sevDelta;
	const idDelta = a.checkId.localeCompare(b.checkId);
	if (idDelta !== 0) return idDelta;
	return (a.path ?? "").localeCompare(b.path ?? "");
}
/** Converts findings to a process exit code using the requested minimum severity. */
function exitCodeFromFindings(findings, severityMin = "warning") {
	return findings.some((f) => healthFindingMeetsSeverity(f, severityMin)) ? 1 : 0;
}
//#endregion
//#region src/commands/doctor-lint.ts
/** CLI entrypoint for non-mutating doctor lint health checks. */
const RUNTIME_TOOL_SCHEMA_CHECK_ID = "core/doctor/runtime-tool-schemas";
const PROJECT_CLONE_SHAPE_CHECK_ID = "core/doctor/project-clone-shape";
const SKILLS_READINESS_CHECK_ID = "core/doctor/skills-readiness";
const AUTH_PROFILE_CHECK_ID = "core/doctor/auth-profiles";
var DoctorLintStateSnapshotError = class extends Error {
	constructor(cause) {
		super(`Doctor lint could not prepare a private plugin-state snapshot: ${scrubDoctorErrorMessage(cause)}`, { cause });
		this.name = "DoctorLintStateSnapshotError";
	}
};
function detectMode(opts) {
	if (opts.json === true) return "json";
	return process.stdout.isTTY ? "human" : "json";
}
/**
* Runs registered doctor health checks in human or JSON mode and returns the lint exit code.
*
* Invalid config is reported before regular health checks because most checks need a parsed config
* and workspace root.
*/
async function runDoctorLintCli(runtime, opts) {
	if (runtime === defaultRuntime && opts.json && resolveUpdateRehearsalRoot(process.env)) {
		const { hasCliProcessScope } = await import("./runtime-cleanup-scope-fl4awj9r.js");
		if (hasCliProcessScope()) {
			const { runUpdateDoctorLintProcess } = await import("./doctor-lint-process-PdnOOHVy.js");
			return runUpdateDoctorLintProcess(opts, (await resolveDoctorUpdateBudget({
				cfg: {},
				env: process.env
			}))?.disposalDeadlineMs);
		}
	}
	return runDoctorLintCliInProcess(runtime, opts);
}
/** The rehearsal worker keeps its private state alive after publishing the check result. */
async function runDoctorLintCliInProcess(runtime, opts, reportBeforeDisposal = false) {
	let reported;
	const report = (execution) => {
		execution.writeOutput();
		reported = execution;
	};
	try {
		const execution = await withArtifactPreservingStateReads(() => prepareDoctorLintExecution(runtime, opts, reportBeforeDisposal ? report : void 0));
		if (!reported) report(execution);
		else for (const warning of execution.cleanupWarnings ?? []) runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${warning.message}`);
		return execution.exitCode;
	} catch (error) {
		if (!reported) throw error;
		runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${scrubDoctorErrorMessage(error)}`);
		return reported.exitCode;
	}
}
/** Collect advisory doctor findings without writing output or repairing operator state. */
async function collectDoctorFindings(runtime) {
	return (await withArtifactPreservingStateReads(() => prepareDoctorLintExecution(runtime, { severityMin: "info" }))).findings;
}
async function prepareDoctorLintExecution(runtime, opts, onChecksComplete) {
	const sevMin = opts.severityMin === void 0 ? "warning" : parseHealthFindingSeverity(opts.severityMin);
	if (sevMin === null) throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
	maybeLoadDotEnvForConfig(process.env);
	const sourceEnv = { ...process.env };
	if (resolveUpdateRehearsalRoot(sourceEnv) && !opts.onlyIds?.length) {
		const snapshot = await createConfigIO({
			env: sourceEnv,
			observe: false,
			pluginValidation: "core-only"
		}).readConfigFileSnapshot();
		if (snapshot.valid) {
			const budget = await resolveDoctorUpdateBudget({
				cfg: snapshot.config,
				env: sourceEnv
			});
			if (budget && !admitDoctorUpdateInspection(budget, "agent", [{
				id: "core/doctor/lint-inspection",
				label: "Doctor lint inspection"
			}])) {
				const warnings = [...budget.deferred.values()];
				return {
					exitCode: 0,
					findings: warnings,
					writeOutput() {
						if (detectMode(opts) === "json") writeJsonResult({
							ok: true,
							checksRun: 0,
							checksSkipped: 0,
							findings: [],
							warnings
						});
						else for (const finding of warnings) {
							runtime.log(`[warning] ${finding.checkId} [${finding.errorCode}]: ${finding.message}`);
							runtime.log(finding.fixHint ?? "Run `testclaw doctor` after activation.");
						}
					}
				};
			}
		}
	}
	const cleanupWarnings = isUpdateDoctorLintPass(sourceEnv) ? [] : void 0;
	const run = () => prepareDoctorLintStateExecution(runtime, opts, sevMin, sourceEnv, cleanupWarnings, onChecksComplete);
	if (opts.onlyIds?.length) return await run();
	let execution;
	try {
		return await withAssistantStateDatabaseReadSnapshot(async () => execution = await run(), { env: sourceEnv });
	} catch (error) {
		if (!execution || !cleanupWarnings || !(error instanceof SqliteSnapshotCleanupError)) throw error;
		recordSnapshotCleanupWarning(cleanupWarnings);
		return execution;
	}
}
async function prepareDoctorLintStateExecution(runtime, opts, sevMin, sourceEnv, cleanupWarnings, onChecksComplete) {
	const updateReadiness = isPostCoreConvergencePass(sourceEnv) ? "post-plugin" : void 0;
	const effectiveOpts = updateReadiness ? {
		...opts,
		updateReadiness
	} : opts;
	const { resolveBundledHealthCheckPluginStateMode } = await import("./bundled-health-checks-lunVyRMP.js");
	const pluginStateMode = resolveBundledHealthCheckPluginStateMode(effectiveOpts);
	let coreChecks;
	const deferredCheckIds = /* @__PURE__ */ new Set();
	if (resolveUpdateRehearsalRoot(sourceEnv) && !updateReadiness && !opts.onlyIds?.length) {
		const { resolveDoctorContributionHealthChecks } = await import("./doctor-health-contributions-wRpdbW3i.js");
		coreChecks = await resolveDoctorContributionHealthChecks();
		for (const check of coreChecks) if ((check.updateWork?.kind === "inspection" || check.updateWork?.kind === "standalone") && (opts.includeAllChecks === true || isHealthCheckEnabledByDefault(check)) && !opts.skipIds?.includes(check.id)) deferredCheckIds.add(check.id);
	}
	const prepareRuntimeValidation = !deferredCheckIds.has(RUNTIME_TOOL_SCHEMA_CHECK_ID) && (pluginStateMode === "isolated" || !effectiveOpts.onlyIds?.length || effectiveOpts.onlyIds.includes(RUNTIME_TOOL_SCHEMA_CHECK_ID));
	const readConfigSnapshot = async (deferredPluginMigrations) => {
		const io = pluginStateMode === "direct" ? {
			readConfigFileSnapshot,
			readConfigFileSnapshotWithPluginMetadata
		} : createConfigIO({
			env: sourceEnv,
			configPath: resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv)),
			observe: false,
			pluginValidation: pluginStateMode === "deferred" ? "core-only" : void 0,
			deferredPluginMigrations
		});
		return pluginStateMode === "deferred" || !prepareRuntimeValidation ? io.readConfigFileSnapshot({ observe: false }) : (await io.readConfigFileSnapshotWithPluginMetadata({
			observe: false,
			prepareValidation: "runtime"
		})).snapshot;
	};
	const stateView = {
		coreChecks,
		deferredCheckIds,
		cleanupWarnings,
		pluginMetadataEnv: sourceEnv,
		sourceEnv,
		readConfigSnapshot,
		runWithPluginStateSnapshot: async (run) => withReadOnlyPluginStateSnapshot(sourceEnv, run, cleanupWarnings)
	};
	if (pluginStateMode !== "isolated" && !onChecksComplete) return await executeDoctorLint(runtime, effectiveOpts, sevMin, stateView);
	let checksReported = false;
	try {
		return await stateView.runWithPluginStateSnapshot(async (pluginMetadataEnv) => {
			const pending = readDeferredPluginMigrations({ env: pluginMetadataEnv });
			const disposals = [];
			try {
				const execution = await executeDoctorLint(runtime, effectiveOpts, sevMin, {
					...stateView,
					pluginMetadataEnv,
					readConfigSnapshot: () => readConfigSnapshot(pending),
					runWithPluginStateSnapshot: async (run) => run(pluginMetadataEnv),
					deferInspectionDisposal: onChecksComplete ? (dispose) => disposals.push(dispose) : void 0
				});
				onChecksComplete?.(execution);
				checksReported = onChecksComplete !== void 0;
				return execution;
			} finally {
				for (const dispose of disposals) try {
					await dispose();
				} catch (error) {
					runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${scrubDoctorErrorMessage(error)}`);
				}
			}
		});
	} catch (error) {
		if (checksReported || !(error instanceof DoctorLintStateSnapshotError)) throw error;
		return createStateSnapshotFailureExecution(runtime, effectiveOpts, sevMin, error);
	}
}
async function executeDoctorLint(runtime, opts, sevMin, stateView) {
	const snapshot = await stateView.readConfigSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-BAn61WUC.js");
		const runtimeFindings = await collectNodeRuntimeFindings(stateView.sourceEnv);
		const findings = [...configValidationIssuesToHealthFindings(snapshot.issues), ...runtimeFindings];
		const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
		return {
			exitCode: exitCodeFromFindings(findings, sevMin),
			findings: visible,
			cleanupWarnings: stateView.cleanupWarnings,
			writeOutput() {
				if (detectMode(opts) === "json") {
					writeJsonResult({
						ok: false,
						checksRun: 1,
						checksSkipped: 0,
						findings: visible
					});
					return;
				}
				runtime.error("doctor --lint: config file exists but does not parse cleanly.");
				for (const issue of snapshot.issues) {
					const issuePath = issue.path || "<root>";
					runtime.error(`- ${issuePath}: ${issue.message}`);
				}
				for (const finding of runtimeFindings.filter((entry) => healthFindingMeetsSeverity(entry, sevMin))) runtime.error(finding.fixHint ? `${finding.message}\n${finding.fixHint}` : finding.message);
			}
		};
	}
	const cfg = captureRuntimeConfig(snapshot.config);
	const sourceEnv = { ...stateView.sourceEnv };
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const ctx = {
		mode: "lint",
		runtime,
		cfg,
		cwd: defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : process.cwd(),
		env: sourceEnv,
		allowExecSecretRefs: opts.allowExec === true,
		...snapshot.path !== void 0 ? { configPath: snapshot.path } : {}
	};
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-lunVyRMP.js");
	const availabilityFindings = registerBundledHealthChecks({
		cfg,
		cwd: ctx.cwd,
		env: stateView.pluginMetadataEnv,
		runWithPluginStateSnapshot: stateView.runWithPluginStateSnapshot,
		updateReadiness: opts.updateReadiness
	});
	const registeredExtensionChecks = listExtensionHealthChecksForDoctor([], availabilityFindings);
	const onlyRegisteredExtensionChecks = opts.onlyIds !== void 0 && opts.onlyIds.length > 0 && opts.onlyIds.every((id) => registeredExtensionChecks.some((check) => check.id === id));
	let coreChecks = onlyRegisteredExtensionChecks ? [] : stateView.coreChecks;
	if (!coreChecks) {
		const { resolveDoctorContributionHealthChecks } = await import("./doctor-health-contributions-wRpdbW3i.js");
		coreChecks = await resolveDoctorContributionHealthChecks();
	}
	const extensionChecks = onlyRegisteredExtensionChecks ? registeredExtensionChecks : listExtensionHealthChecksForDoctor(coreChecks, availabilityFindings);
	const runWithPrivateStateSnapshot = async (run) => await stateView.runWithPluginStateSnapshot(async () => await run());
	const runWithSourceState = async (run) => opts.updateReadiness ? run() : withDoctorLintStateEnv(sourceEnv, run);
	const coreCtx = {
		...ctx,
		env: opts.updateReadiness ? stateView.pluginMetadataEnv : sourceEnv,
		lintConfigSnapshot: snapshot,
		deep: opts.deep === true,
		runWithPrivateStateSnapshot,
		runWithSourceState,
		deferInspectionDisposal: stateView.deferInspectionDisposal
	};
	const checks = [...coreChecks.map((check) => withCoreLintContext(check, coreCtx, availabilityFindings)), ...extensionChecks];
	const result = await runDoctorLintChecks(ctx, {
		checks: opts.updateReadiness ? selectUpdateReadinessChecks(checks, opts.updateReadiness) : checks,
		includeAllChecks: opts.updateReadiness !== void 0 || opts.includeAllChecks === true,
		skipIds: [...opts.skipIds ?? [], ...stateView.deferredCheckIds ?? []],
		...opts.onlyIds && opts.onlyIds.length > 0 ? { onlyIds: opts.onlyIds } : {}
	});
	const detectedFindings = [...result.findings, ...coreChecks.filter((check) => stateView.deferredCheckIds?.has(check.id)).map((check) => ({
		checkId: check.id,
		source: "doctor",
		severity: "warning",
		errorCode: "update-inspection-deferred",
		requirement: "update-validation-scope",
		message: "Advisory inspection deferred until after update activation; required migration, config, plugin, and Gateway readiness checks remain enabled.",
		fixHint: `Run \`testclaw doctor --lint --only ${check.id}\` after activation to complete this inspection.`
	}))];
	const advisoryChecks = new Set(coreChecks.filter((check) => check.updateWork?.kind === "inspection" || check.updateWork?.kind === "standalone").map((check) => check.id));
	const findings = isUpdateDoctorLintPass(stateView.sourceEnv) ? detectedFindings.map((finding) => finding.severity === "error" && advisoryChecks.has(finding.checkId) ? {
		...finding,
		severity: "warning"
	} : finding) : detectedFindings;
	const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
	const warnings = findings.filter((finding) => !healthFindingMeetsSeverity(finding, sevMin) && (finding.errorCode === "TESTCLAW_STATE_LEASE_ABORTED" || isUpdateDoctorLintPass(stateView.sourceEnv) && finding.severity === "warning"));
	const exitCode = exitCodeFromFindings(findings, sevMin);
	return {
		exitCode,
		findings: visible,
		cleanupWarnings: stateView.cleanupWarnings,
		writeOutput() {
			if (detectMode(opts) === "json") {
				writeJsonResult({
					ok: exitCode === 0,
					checksRun: result.checksRun,
					checksSkipped: result.checksSkipped,
					findings: visible,
					warnings: [...warnings, ...stateView.cleanupWarnings ?? []]
				});
				return;
			}
			const displayed = [
				...visible,
				...warnings,
				...stateView.cleanupWarnings ?? []
			];
			process.stdout.write(`doctor --lint: ran ${result.checksRun} check(s), ${displayed.length} finding(s)\n`);
			if (displayed.length === 0) {
				process.stdout.write("  no findings\n");
				return;
			}
			for (const f of displayed) {
				const where = f.path !== void 0 ? ` ${f.path}` : "";
				const line = f.line !== void 0 ? `:${f.line}` : "";
				process.stdout.write(`  [${f.severity}] ${f.checkId}${where}${line} - ${f.message}\n`);
				if (f.fixHint !== void 0) process.stdout.write(`    fix: ${f.fixHint}\n`);
			}
		}
	};
}
async function withReadOnlyPluginStateSnapshot(sourceEnv, run, cleanupWarnings) {
	const sourceDatabasePath = resolveAssistantStateSqlitePath(sourceEnv);
	let cleanup;
	let privateRoot;
	let prepared;
	try {
		if (fs.existsSync(sourceDatabasePath)) {
			prepared = prepareSqliteReadOnlyLocationSync(sourceDatabasePath);
			privateRoot = path.dirname(prepared.location);
			cleanup = prepared.cleanupAsync;
		} else {
			privateRoot = fs.mkdtempSync(path.join(os.tmpdir(), "testclaw-doctor-lint-state-"));
			cleanup = async () => {
				try {
					await fs.promises.rm(privateRoot, {
						force: true,
						recursive: true
					});
					return true;
				} catch {
					return false;
				}
			};
		}
	} catch (error) {
		throw new DoctorLintStateSnapshotError(error);
	}
	const privateStateDir = path.join(privateRoot, "testclaw-state");
	const privateDatabasePath = resolveAssistantStateSqlitePath({
		...sourceEnv,
		TESTCLAW_STATE_DIR: privateStateDir
	});
	const privateEnv = {
		...sourceEnv,
		TESTCLAW_CONFIG_PATH: resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv)),
		TESTCLAW_STATE_DIR: privateStateDir
	};
	return await withDoctorLintStateEnv(privateEnv, async () => {
		let outcome;
		let runStarted = false;
		try {
			fs.mkdirSync(path.dirname(privateDatabasePath), {
				recursive: true,
				mode: 448
			});
			if (prepared) for (const suffix of [
				"",
				"-journal",
				"-shm",
				"-wal"
			]) {
				const sourcePath = `${prepared.location}${suffix}`;
				if (fs.existsSync(sourcePath)) fs.renameSync(sourcePath, `${privateDatabasePath}${suffix}`);
			}
			const installRoots = resolvePluginInstallRoots(sourceEnv);
			outcome = {
				ok: true,
				value: await withDisposableAssistantStateReads(privateDatabasePath, () => withPluginInstallRoots({
					...installRoots,
					stateDir: privateStateDir
				}, async () => {
					runStarted = true;
					return await run(privateEnv);
				}))
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		}
		try {
			await closeAssistantStateDatabaseByPathAsync(privateDatabasePath);
			if (!await cleanup()) {
				const message = "Temporary doctor lint state snapshot cleanup did not complete.";
				if (!cleanupWarnings) throw new Error(message);
				recordSnapshotCleanupWarning(cleanupWarnings);
			}
		} catch (error) {
			throw new DoctorLintStateSnapshotError(error);
		}
		if (!outcome.ok) throw runStarted ? outcome.error : new DoctorLintStateSnapshotError(outcome.error);
		return outcome.value;
	});
}
function recordSnapshotCleanupWarning(warnings) {
	warnings.push({
		checkId: "core/doctor/lint-state-inspection",
		severity: "warning",
		requirement: "temporary-snapshot-cleanup",
		message: "Temporary doctor lint state snapshot cleanup did not complete.",
		fixHint: "Rerun `testclaw doctor --lint` after the update to check snapshot cleanup."
	});
}
async function withDoctorLintStateEnv(env, run) {
	const stateDir = resolveStateDir(env);
	const overrides = {
		TESTCLAW_CONFIG_PATH: resolveConfigPath(env, stateDir),
		TESTCLAW_STATE_DIR: stateDir
	};
	const previous = Object.keys(overrides).map((key) => [key, process.env[key]]);
	Object.assign(process.env, overrides);
	try {
		return await run();
	} finally {
		for (const [key, value] of previous) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
}
async function createStateSnapshotFailureExecution(runtime, opts, sevMin, error) {
	const finding = {
		checkId: "core/doctor/lint-state-inspection",
		severity: "error",
		source: "doctor",
		target: "plugin-state",
		requirement: "read-only-plugin-state-inspection",
		message: `Doctor lint could not inspect plugin state without mutating the live state database (${scrubDoctorErrorMessage(error.cause ?? error)}).`,
		fixHint: "Keep the current Gateway running, resolve the state database inspection error, then rerun this check."
	};
	const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-BAn61WUC.js");
	const findings = [finding, ...await collectNodeRuntimeFindings()];
	const visible = findings.filter((entry) => healthFindingMeetsSeverity(entry, sevMin));
	return {
		exitCode: exitCodeFromFindings(findings, sevMin),
		findings: visible,
		writeOutput() {
			if (detectMode(opts) === "json") {
				writeJsonResult({
					ok: false,
					checksRun: 0,
					checksSkipped: 0,
					findings: visible
				});
				return;
			}
			for (const entry of visible) {
				runtime.error(`doctor --lint: ${entry.message}`);
				if (entry.fixHint) runtime.error(`fix: ${entry.fixHint}`);
			}
		}
	};
}
function withCoreLintContext(check, ctx, availabilityFindings) {
	return {
		...check,
		detect(_ctx, scope) {
			const detect = async () => [...await check.detect(ctx, scope), ...availabilityFindings.filter((finding) => finding.checkId === check.id)];
			if (check.id === SKILLS_READINESS_CHECK_ID) return ctx.runWithPrivateStateSnapshot(() => ctx.runWithSourceState(detect));
			if (check.id === RUNTIME_TOOL_SCHEMA_CHECK_ID || check.id === PROJECT_CLONE_SHAPE_CHECK_ID) return ctx.runWithPrivateStateSnapshot(detect);
			return check.id === AUTH_PROFILE_CHECK_ID ? ctx.runWithSourceState(detect) : detect();
		}
	};
}
//#endregion
export { collectDoctorFindings, runDoctorLintCli };
