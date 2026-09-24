import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BXFT1fUC.mjs";
import { a as loadCronRows, m as upsertCronJobRow, o as loadedCronStoreFromRows } from "./row-codec-CnO-HkKY.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-BEtR7T_p.mjs";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-RvnlMnYc.mjs";
import { v as listActiveCronRunReceiptJobIdsInDatabase } from "./run-receipt-store-DXrCBni7.mjs";
import { _ as recomputeSingleJobForMaintenance } from "./jobs-scheduling-AWV-TSXl.mjs";
import { n as retainCronRuntimeMutationOutcome, t as prepareCronRuntimeMutation } from "./runtime-mutation.worker-CrLDrPet.mjs";
//#region src/cron/store/runtime-maintenance.worker.ts
function scheduleUnownedCronJobsInWorker(database, input) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const rows = loadCronRows(db, input.storeKey);
		const decoded = loadedCronStoreFromRows(rows).store.jobs;
		const activeJobIds = listActiveCronRunReceiptJobIdsInDatabase(db, input.storeKey);
		const jobsById = new Map(decoded.map((job) => [job.id, job]));
		const preparation = prepareCronRuntimeMutation("cron.scheduleUnowned", input.nonce, { jobIds: decoded.map((job) => job.id) });
		const reservations = new Map(preparation.ownership.flatMap((owner) => owner.reservation ? [[owner.jobId, owner.reservation]] : []));
		const active = new Set(preparation.ownership.filter((owner) => owner.active).map((owner) => owner.jobId));
		const outcome = {
			changed: false,
			jobs: [],
			notifications: [],
			logs: []
		};
		const record = (level) => (fields, message) => {
			outcome.logs.push({
				level,
				fields,
				message
			});
		};
		const state = { deps: {
			nowMs: () => preparation.nowMs,
			log: {
				debug: record("debug"),
				info: record("info"),
				warn: record("warn"),
				error: record("error")
			}
		} };
		for (const row of rows) {
			const job = jobsById.get(row.job_id);
			if (!job || activeJobIds.has(row.job_id)) continue;
			if (recomputeSingleJobForMaintenance(state, job, {
				...input.options,
				nowMs: preparation.nowMs,
				deferredNotifications: outcome.notifications
			}, {
				reservations,
				isJobActive: (jobId) => active.has(jobId)
			})) {
				upsertCronJobRow(db, input.storeKey, job, row.sort_order);
				outcome.jobs.push(job);
				outcome.changed = true;
			}
		}
		return retainCronRuntimeMutationOutcome("cron.scheduleUnowned", db, input.nonce, outcome);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.schedule-unowned" });
}
function recordCronFailureAlertOutcomeInWorker(database, input) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const row = loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([input.jobId]))[0];
		const job = row ? loadedCronStoreFromRows([row]).store.jobs[0] : void 0;
		const jobs = job ? [job] : [];
		const { repairJobIds } = loadCronRuntimeAuthorities({
			db,
			storeKey: input.storeKey,
			jobs
		});
		if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
			db,
			storeKey: input.storeKey,
			jobs,
			jobIds: repairJobIds
		});
		const ownsCycle = job !== void 0 && job.state.lastRunAtMs === input.runAtMs && job.state.lastFailureAlertAtMs === input.alertAtMs && job.state.lastFailureNotificationId === input.notificationId && job.state.lastFailureNotificationDeliveryStatus === "unknown";
		prepareCronRuntimeMutation("cron.recordFailureAlertOutcome", input.nonce, { ownsCycle });
		if (job && row && ownsCycle) {
			job.state.lastFailureNotificationDelivered = input.outcome.delivered;
			job.state.lastFailureNotificationDeliveryStatus = input.outcome.status;
			job.state.lastFailureNotificationDeliveryError = input.outcome.error;
			upsertCronJobRow(db, input.storeKey, job, row.sort_order);
		}
		return retainCronRuntimeMutationOutcome("cron.recordFailureAlertOutcome", db, input.nonce, { job: ownsCycle ? job : void 0 });
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.failure-alert-outcome" });
}
//#endregion
export { recordCronFailureAlertOutcomeInWorker, scheduleUnownedCronJobsInWorker };
