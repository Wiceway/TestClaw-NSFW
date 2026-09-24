import "./kysely-sync-CICmT-bh.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { T as string, b as object } from "./schemas-D6YHSiZI.js";
import { a as withArtifactPreservingStateReads, t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Cg9RiSzs.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { t as runExistingAssistantStateWriteTransaction } from "./testclaw-state-db-existing-write-E11MVdlx.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { a as recordedUpdateRunDrivers, s as inspectUpdateRunDriver, t as inspectUpdateRepairDriverAdmission } from "./update-run-activity-Bjglr3ln.js";
import { i as persistRun, o as updateRunLedgerSchema, s as upsertStep } from "./update-run-write-B_JenWiI.js";
import { a as readUpdateRunRecord, n as hasStoredUpdateRecovery } from "./update-run-read.kernel-8MZChvyU.js";
import { i as updateRunStepsFromResultStep } from "./update-run-step-Bl6FePhX.js";
import { n as createGatewayRestartDeadline, t as GatewayRestartDeadlineError } from "./restart-health-deadline-feUBrfG1.js";
import { a as INTERRUPTED_UPDATE_SETTLE_TIMEOUT_MS } from "./restart-health.constants-ChgW7WtU.js";
import "node:util";
//#region src/infra/update-run-interruption-store.ts
const installedUpdateCandidateSchema = object({
	version: string().trim().min(1).max(1024),
	buildId: string().trim().min(1).max(96)
});
function readInstalledUpdateCandidate(run) {
	const receipt = run.steps.find((step) => step.step === "finalize:installed-candidate" && step.status === "completed");
	if (!receipt?.detail) return;
	try {
		const parsed = installedUpdateCandidateSchema.safeParse(JSON.parse(receipt.detail));
		return parsed.success ? parsed.data : void 0;
	} catch {
		return;
	}
}
function canSettleInterruptedUpdate(run) {
	const abandoned = run.status === "failed" && run.reason === "abandoned";
	if (!(run.status === "running" && run.phase === "verifying" && !run.reason) && !abandoned) return false;
	const drivers = recordedUpdateRunDrivers(run);
	return drivers.length > 0 && drivers.every((driver) => inspectUpdateRunDriver(driver) === "dead") && run.repair.length === 0 && run.steps.some((step) => step.step === "post-update verification" && step.status === "completed") && !run.steps.some((step) => step.step === "driver:identity-unavailable" || step.step === "reconcile:acknowledged" || step.step === "package rollback" || step.step === "previous generation restoration" || step.status === "failed" && !(abandoned && (step.step === "reconcile:abandoned" || step.step === "verifying" && !step.detail && !step.failureFacts?.length))) && readInstalledUpdateCandidate(run) !== void 0;
}
//#endregion
//#region src/infra/update-run-interruption-worker.ts
async function readInterruptedUpdateCandidateAsync(options) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingAssistantStateRead(options, { type: "updateRuns.interruptedCandidate" }));
	if (!reply) return;
	if (!reply.ok || reply.type !== "updateRuns.interruptedCandidate") throw new Error("Unexpected interrupted update lookup result");
	return reply.run;
}
function persistInterruptedUpdateObservationAsync(context, input, signal) {
	const assertCurrent = () => {
		context.admission.assertCurrent();
		signal?.throwIfAborted();
	};
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "updateRuns.reconcileInterrupted",
		input
	}), {
		existingOnly: true,
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/infra/update-run-interruption.ts
const CANDIDATE_STEP = "finalize:installed-candidate";
/** Shipped parents can terminate the post-core child as soon as its result appears. */
function recordPostCoreUpdateEvidence(runId, input, options = {}) {
	runExistingAssistantStateWriteTransaction(({ db }) => {
		const run = readUpdateRunRecord(db, runId);
		if (!run || run.status !== "running" || inspectUpdateRepairDriverAdmission([run], runId).kind !== "continuation") throw new Error("Cannot verify a live parent for the inherited update history.");
		const candidate = installedUpdateCandidateSchema.safeParse(input.candidate);
		for (const step of input.doctorLint ? updateRunStepsFromResultStep(input.doctorLint) : []) upsertStep(run, step);
		if (candidate.success && !hasStoredUpdateRecovery(db, runId)) upsertStep(run, {
			step: CANDIDATE_STEP,
			status: "completed",
			endedAtMs: Date.now(),
			detail: JSON.stringify(candidate.data)
		});
		for (const [index, detail] of input.warnings.entries()) upsertStep(run, {
			step: `warning:finalize:plugins:${index}`,
			status: "completed",
			endedAtMs: Date.now(),
			detail
		});
		persistRun(db, run, options);
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run"
	});
}
/** Correct only a proven interrupted completion; all other terminal outcomes remain immutable. */
async function reconcileInterruptedUpdateRuns(input = {}) {
	const env = { ...input.env ?? process.env };
	const options = {
		env,
		path: resolveAssistantStateSqlitePath(env)
	};
	const expected = await readInterruptedUpdateCandidateAsync(options);
	const candidate = expected ? readInstalledUpdateCandidate(expected) : void 0;
	if (!expected || !candidate || !canSettleInterruptedUpdate(expected)) return [];
	const managed = expected.steps.some((step) => step.step === "restarting" && step.status === "completed");
	let observation = {
		outcome: "skipped-unmanaged",
		elapsedMs: 0,
		phase: "ownership"
	};
	let cleanup;
	if (managed) {
		const deadline = createGatewayRestartDeadline({
			timeoutMs: INTERRUPTED_UPDATE_SETTLE_TIMEOUT_MS,
			signal: input.signal
		});
		try {
			observation = await deadline.run(async () => {
				const { observeInterruptedUpdateGateway } = await deadline.read("setup:health-module", () => import("./update-run-interruption-health-DI4T7OVi.js"));
				return await observeInterruptedUpdateGateway(candidate, {
					...input,
					env,
					deadline
				});
			});
		} catch (error) {
			input.signal?.throwIfAborted();
			observation = {
				outcome: hasCommandProcessCleanupError(error) ? "cleanup-unknown" : error instanceof GatewayRestartDeadlineError ? "timed-out" : "unverified",
				elapsedMs: Math.round(deadline.elapsedMs()),
				phase: deadline.expiredPhase ?? deadline.phase
			};
		} finally {
			cleanup = deadline.cleanup;
			observation.cleanup = deadline.cleanupStatus;
			observation.timeout = deadline.timeout;
			deadline.dispose();
		}
	}
	input.signal?.throwIfAborted();
	const context = captureAssistantStateWorkerContext(options);
	const record = async (captured, observed) => {
		const detail = `Interrupted update settle probe: ${observed.outcome} after ${observed.elapsedMs} ms during ${observed.phase}.` + (observed.waitOutcome ? ` Health wait: ${observed.waitOutcome}.` : "") + (observed.timeout ? ` Deadline timed-out after ${observed.timeout.elapsedMs} ms during ${observed.timeout.phase}.` : "") + (observed.cleanup === "unknown" ? " Command cleanup failed: could not confirm that owned work stopped; cleanup outcome unknown. Check testclaw update status before recovery." : observed.cleanup === "pending" ? " Command cleanup is still pending; cleanup outcome unknown. Completion is not verified." : observed.verification ? " Installed and serving candidate verified." : managed ? " Continuing without verified completion; will retry. Check testclaw update status." : " No completed managed-service restart was recorded; probing skipped.");
		const result = await persistInterruptedUpdateObservationAsync(context, {
			expected: captured,
			detail,
			verification: observed.verification,
			cleanup: observed.cleanup
		}, input.signal);
		if (result?.accepted || observed.cleanup === "unknown") console.warn(`[testclaw] ${detail}`);
		return result;
	};
	const recorded = record(expected, observation);
	if (observation.cleanup === "pending" && cleanup) cleanup.then(async (outcome) => {
		const initial = await recorded;
		if (!initial?.accepted || !initial.run) return;
		await record(initial.run, {
			...observation,
			outcome: outcome === "unknown" ? "cleanup-unknown" : observation.outcome,
			cleanup: outcome,
			verification: void 0
		});
	}).catch(() => {
		console.warn("[testclaw] Command cleanup outcome unknown; interrupted update cleanup could not be recorded. Check testclaw update status before recovery.");
	});
	const result = await recorded;
	return result?.accepted && result.run && observation.verification ? [result.run] : [];
}
//#endregion
export { recordPostCoreUpdateEvidence as n, readInstalledUpdateCandidate as r, reconcileInterruptedUpdateRuns as t };
