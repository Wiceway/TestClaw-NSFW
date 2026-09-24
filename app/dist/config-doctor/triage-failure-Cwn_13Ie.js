import { n as resolveAssistantPackageRoot } from "./testclaw-root-QV2nsx8w.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { t as ExitError } from "./runtime-kM7jday_.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import { o as redactSupportString } from "./diagnostic-support-redaction-DgR7hMLl.js";
import { i as withConsoleLogsRoutedToStderr } from "./json-output-mode-DmDyOE8Z.js";
import { i as detectRespawnSupervisor } from "./supervisor-markers-Cm1H0Euq.js";
import { o as commitManagedServiceUpdateHandoff, p as startManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff } from "./update-managed-service-handoff-BuncpUGp.js";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-PVjhuNzO.js";
import { n as createEmbeddedStateSignalBridge } from "./embedded-state-lock-Cmsuw2kU.js";
import { i as resolveTriageEntrypoint, n as continueTriageInFreshProcess, r as queueManagedUpdateTriage } from "./triage-continuation-BzyiAfBY.js";
import { t as renderTriagePrompt } from "./triage-prompt-D5kcy9EC.js";
import { realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/commands/triage-failure.ts
/** Failure owners retain their exit/result; triage only supplies a bounded repair attempt. */
async function triageAfterFailure(runtime, failure, signal, updateResultPath) {
	if (process.env.TESTCLAW_SHELL === "exec" || process.env.CODEX_THREAD_ID || isGatewayExternallySupervised() || signal?.aborted) return;
	const bridge = createEmbeddedStateSignalBridge();
	const cancellation = signal ? AbortSignal.any([signal, bridge.signal]) : bridge.signal;
	const redaction = {
		env: process.env,
		stateDir: resolveStateDir()
	};
	const boundedFailure = {
		...failure,
		phase: failure.phase.slice(0, 120),
		error: scrubDoctorErrorMessage(redactSupportString(failure.error, redaction, { maxLength: 800 })),
		...failure.expectedVersion ? { expectedVersion: failure.expectedVersion.slice(0, 100) } : {}
	};
	const previousShell = process.env.TESTCLAW_SHELL;
	process.env.TESTCLAW_SHELL = "exec";
	const diagnosticRuntime = {
		log: (...args) => runtime.error(...args),
		error: (...args) => runtime.error(...args),
		exit: (code) => {
			throw new ExitError(code);
		}
	};
	const collectDiagnostics = async () => {
		const { triageCommand } = await import("./triage-D6Fsqswv.js");
		await triageCommand(diagnosticRuntime, {}, {
			failure: boundedFailure,
			signal: cancellation,
			diagnosticOnly: true
		});
	};
	let managedStartup = false;
	try {
		await withConsoleLogsRoutedToStderr(async () => {
			const resolvedRoot = failure.installationRoot ?? await resolveAssistantPackageRoot({ argv1: process.argv[1] });
			if (!resolvedRoot) throw new Error("installed CLI root is unavailable; run testclaw triage manually");
			const root = realpathSync(resolvedRoot);
			boundedFailure.installationRoot = root;
			const supervisor = failure.kind === "gateway-startup" ? detectRespawnSupervisor(process.env, process.platform, { includeLinuxAssistantGatewayServiceMarker: true }) : null;
			managedStartup = Boolean(supervisor);
			if (!supervisor) {
				const commandArgv = [...await resolveTriageEntrypoint(root), ...failure.kind === "update" && updateResultPath ? ["--update-result", updateResultPath] : []];
				cancellation.throwIfAborted();
				if (failure.kind === "update" && await queueManagedUpdateTriage(boundedFailure, commandArgv, cancellation)) runtime.error("Automatic triage queued after managed update settlement; inspect the handoff log for its result.");
				else await continueTriageInFreshProcess({
					root,
					commandArgv,
					failure: boundedFailure,
					signal: cancellation,
					output: (output) => runtime.error(redactSupportString(output, redaction, { maxLength: 32768 }))
				});
				return;
			}
			if (supervisor === "systemd") {
				const [nodeRunner, entrypoint] = await resolveTriageEntrypoint(root);
				cancellation.throwIfAborted();
				const result = await startManagedServiceUpdateHandoff({
					root,
					supervisor,
					restartDrainTimeoutMs: 0,
					meta: {},
					action: {
						kind: "triage",
						failure: boundedFailure,
						nodeRunner,
						entrypoint
					}
				});
				if (result.status === "started") {
					const identity = {
						kind: "managed-update-handoff",
						handoffId: result.handoffId,
						installRoot: result.installRoot
					};
					if (cancellation.aborted || !await commitManagedServiceUpdateHandoff(identity) || cancellation.aborted) {
						await cancelManagedServiceUpdateHandoff(identity);
						throw new Error("automatic triage admission cancelled or lost");
					}
				}
				runtime.error(`Automatic triage ${result.status === "started" ? "admitted" : "already owned"}; diagnostics: ${result.logPath}`);
				return;
			}
			runtime.error("Automatic managed recovery is unavailable on this supervisor; saved diagnostics and manual triage remain available.");
			await collectDiagnostics();
		});
	} catch (error) {
		const reason = scrubDoctorErrorMessage(redactSupportString(error instanceof Error ? error.message : String(error), redaction));
		runtime.error(`Automatic triage could not complete: ${reason}. Run \`testclaw triage\` manually.`);
		if (managedStartup && !cancellation.aborted) try {
			await collectDiagnostics();
		} catch {
			runtime.error("Managed triage diagnostics could not complete; retain the original failure and run testclaw triage manually.");
		}
		if (failure.kind === "update" && failure.installationRoot && !cancellation.aborted) {
			const outputDir = path.join(redaction.stateDir, "logs", "support");
			const promptPath = path.join(outputDir, `testclaw-triage-failure-${Date.now()}-${process.pid}.md`);
			try {
				await fs$1.mkdir(outputDir, {
					recursive: true,
					mode: 448
				});
				await fs$1.writeFile(promptPath, renderTriagePrompt({
					findings: [],
					bundle: {
						kind: "unavailable",
						reason
					},
					redaction,
					failure: boundedFailure
				}), { mode: 384 });
				runtime.error(`Saved failure diagnostics: ${promptPath}. Run testclaw triage manually after repairing the installed CLI.`);
			} catch {
				runtime.error("Failure diagnostics could not be saved; retain the original update error and run testclaw triage manually.");
			}
		}
	} finally {
		bridge.dispose();
		if (previousShell === void 0) delete process.env.TESTCLAW_SHELL;
		else process.env.TESTCLAW_SHELL = previousShell;
	}
	runtime.error("Original failure retained; inspect the triage verification evidence before retrying.");
}
//#endregion
export { triageAfterFailure as t };
