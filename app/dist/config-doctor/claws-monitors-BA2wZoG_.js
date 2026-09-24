import { h as sleep } from "./utils-BfoJTy8l.js";
import { k as listAgentEntries } from "./agent-scope-config-BEuqweC1.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { T as string, b as object, d as array, g as literal, m as discriminatedUnion } from "./schemas-D6YHSiZI.js";
import "./agent-scope-BiRi-Smp.js";
import { r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BrVKCISp.js";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-Bk2FCp74.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { u as hasActiveCronJobsForAgent } from "./active-jobs-DhbrbXjH.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-2vhyQrsJ.js";
import { n as hasPendingCronSessionCleanupForAgent } from "./locked-CTT1IBs7.js";
import { o as reconcileToolsAllowAuthority } from "./jobs-tool-policy-CMdT4WwT.js";
import { r as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-CX3A7Ug0.js";
import { t as digestClawAgentConfig } from "./agent-config-digest-DebId5QK.js";
import { i as prepareAgentDeleteDatabases } from "./agent-delete-databases-CoO3ITUE.js";
import { n as cronJobReadView } from "./job-read-view-By-UmPG7.js";
import { T as readClawCronRefs, b as clawCronGatewayJobMatchesRef, d as readAttachedCronJobs, i as clawMonitorSnapshotSchema, t as clawMonitorCleanupBindingSchema } from "./monitor-cleanup-contract-CiKTi8HI.js";
import { a as readClawInstallRecord } from "./provenance-CjKT-Kxc.js";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-Ck0olX5y.js";
import { i as resolveHeartbeatMonitorPlan } from "./heartbeat-monitor-CxglsX0n.js";
import { t as resolveSkillCollectionReviewMonitorSpecs } from "./skill-collection-review-monitor-BdNNWxkN.js";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/run-receipt-drain.ts
/** A serving process cannot attest drainage while another receipt owner remains active. */
function hasActiveCronRunReceiptsForAgent(agentId) {
	const { db } = openAssistantStateDatabase();
	if (!tableExists(db, "cron_run_receipts")) return false;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cron_run_receipts").select(["owner_pid", "owner_start_time"]).distinct().where("status", "=", "running").where("agent_id", "=", agentId)).rows.some((owner) => {
		if (isPidDefinitelyDead(owner.owner_pid)) return false;
		const startedAt = getFileLockProcessStartTime(owner.owner_pid);
		return owner.owner_start_time === null || startedAt === null || owner.owner_start_time === startedAt;
	});
}
//#endregion
//#region src/gateway/server-methods/claws-monitors.ts
const text = string().min(1).max(4096);
const target = {
	agentId: text,
	binding: clawMonitorCleanupBindingSchema
};
const paramsSchema = discriminatedUnion("phase", [
	object({
		...target,
		phase: literal("inspect")
	}).strict(),
	object({
		phase: literal("quiesce"),
		...target,
		operationId: text,
		monitors: array(clawMonitorSnapshotSchema).max(2)
	}).strict(),
	object({
		...target,
		phase: literal("drain"),
		operationId: text
	}).strict()
]);
function desiredMonitorRevision(input, existing) {
	const desired = {
		...input,
		id: existing.id,
		createdAtMs: existing.createdAtMs,
		updatedAtMs: 0,
		enabled: input.enabled ?? true,
		state: {}
	};
	reconcileToolsAllowAuthority({
		job: desired,
		previouslyUsedToolRuntime: false,
		explicitlyMutatesToolsAllow: true
	});
	return resolveCronJobConfigRevision(desired);
}
function inspectMonitors(context, agentId, jobs) {
	const cfg = context.getRuntimeConfig();
	const specs = [...resolveHeartbeatMonitorPlan(cfg, jobs).specs, ...resolveSkillCollectionReviewMonitorSpecs(cfg, jobs)].filter((spec) => spec.agentId === agentId);
	const storeKey = cronStoreKey(context.cronStorePath);
	return readAttachedCronJobs(agentId, {}).flatMap((row) => {
		if (row.storeKey !== storeKey || row.agentId !== agentId || row.ownerAgentId !== null || !row.declarationKey || !row.revision) return [];
		const matchingJobs = jobs.filter((job) => job.declarationKey === row.declarationKey);
		const job = matchingJobs.length === 1 ? matchingJobs[0] : void 0;
		const spec = specs.find((entry) => entry.input.declarationKey === row.declarationKey)?.input;
		if (!job || !spec || job.id !== row.id || job.agentId !== agentId || job.owner || resolveCronJobConfigRevision(job) !== row.revision || desiredMonitorRevision(spec, job) !== row.revision) return [];
		return [{
			...row,
			agentId,
			ownerAgentId: null,
			declarationKey: row.declarationKey,
			revision: row.revision
		}];
	});
}
function assertDeletionFence(agentId, operationId, config) {
	const journal = readAgentDeletionJournal(agentId);
	const install = readClawInstallRecord(agentId);
	if (!journal || journal.operationId !== operationId || journal.cleanupCompleted) throw new Error("Claw removal no longer owns the serving Gateway's deletion fence.");
	const agent = listAgentEntries(config).find((entry) => entry.id === agentId);
	if (agent && digestClawAgentConfig(agent) !== install?.agentConfigDigest) throw new Error("The serving Gateway's Claw agent configuration changed after planning.");
	return journal;
}
function isDrained(context, agentId, requireConfigRemoval) {
	return (!requireConfigRemoval || context.isConfigReloadSettled() && !listAgentEntries(context.getRuntimeConfig()).some((agent) => agent.id === agentId)) && !hasActiveCronJobsForAgent(agentId) && getSuspensionVisibleCronTaskRunCount({ agentId }) === 0 && !hasPendingCronSessionCleanupForAgent(agentId) && !hasActiveCronRunReceiptsForAgent(agentId) && (!requireConfigRemoval || readAttachedCronJobs(agentId, {}).length === 0);
}
async function waitForDrain(context, agentId, requireConfigRemoval, assertCurrent) {
	const deadline = performance.now() + 5e3;
	do {
		assertCurrent();
		if (isDrained(context, agentId, requireConfigRemoval)) return;
		await sleep(50);
	} while (performance.now() < deadline);
	throw new Error("Gateway monitor cancellation, run drainage, or config convergence is incomplete; preview and retry Claw removal.");
}
const clawsMonitorHandlers = { "claws.monitors": async ({ params, respond, context }) => {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid Claw monitor cleanup parameters."));
		return;
	}
	const input = parsed.data;
	try {
		const cron = context.cron;
		const assertBinding = () => {
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath))) throw new Error("Gateway does not serve this Claw's config and scheduler state.");
			if (input.phase !== "drain" && (context.cron !== cron || !context.isConfigReloadSettled())) throw new Error("Gateway scheduler or configuration is changing; retry Claw removal.");
		};
		assertBinding();
		if (input.phase === "inspect") {
			const jobs = await cron.list({ includeDisabled: true });
			assertBinding();
			respond(true, { monitors: inspectMonitors(context, input.agentId, jobs) }, void 0);
			return;
		}
		const assertCurrent = () => {
			assertBinding();
			return assertDeletionFence(input.agentId, input.operationId, context.getRuntimeConfig());
		};
		assertCurrent();
		if (input.phase === "quiesce") {
			const jobs = await cron.list({ includeDisabled: true });
			assertCurrent();
			const monitors = inspectMonitors(context, input.agentId, jobs);
			if (!isDeepStrictEqual(monitors, input.monitors)) throw new Error("Config-owned monitors changed after removal planning.");
			const refs = readClawCronRefs(input.agentId);
			const attached = readAttachedCronJobs(input.agentId, {});
			const allowed = attached.map((row) => {
				const job = jobs.find((candidate) => candidate.id === row.id);
				if (!job || !row.revision || row.storeKey !== cronStoreKey(context.cronStorePath) || resolveCronJobConfigRevision(job) !== row.revision || !monitors.some((monitor) => isDeepStrictEqual(monitor, row)) && !refs.some((ref) => ref.status === "complete" && ref.schedulerJobId === row.id && clawCronGatewayJobMatchesRef(input.agentId, ref, cronJobReadView(job)))) throw new Error(`Independent or changed cron job ${row.id} still references the Claw agent.`);
				return {
					id: row.id,
					revision: row.revision
				};
			});
			await cron.quiesceJobs(allowed, () => {
				assertCurrent();
				if (!isDeepStrictEqual(readAttachedCronJobs(input.agentId, {}), attached) || !isDeepStrictEqual(readClawCronRefs(input.agentId), refs)) throw new Error("Attached scheduled work changed before monitor cancellation.");
			});
		}
		await waitForDrain(context, input.agentId, input.phase === "drain", assertCurrent);
		const journal = assertCurrent();
		if (!isDrained(context, input.agentId, input.phase === "drain")) throw new Error("Gateway cleanup state changed before drainage was acknowledged; retry Claw removal.");
		if (input.phase === "quiesce") {
			await prepareAgentDeleteDatabases(context.getRuntimeConfig(), input.agentId, journal.agentDir);
			assertCurrent();
		}
		respond(true, { drained: true }, void 0);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
	}
} };
//#endregion
export { clawsMonitorHandlers };
