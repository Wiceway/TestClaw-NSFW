import { t as note } from "./note-Dc3h_SGh.js";
import { n as sanitizeTerminalText } from "./safe-text-CXEZaOnt.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { o as isDefaultInstallIdentity } from "./paths-DeOFr7iP.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as formatForeignLaunchdJobs, r as repairForeignLaunchdJob, t as findForeignLaunchdJobs } from "./launchd-foreign-jobs-DgWquJS9.js";
import { t as readGatewayForcedRestartSummary } from "./restart-storm-CK0EnyYR.js";
import { a as isServiceRepairDeferred, l as shouldManageGatewayService, s as resolveServiceRepairPolicy } from "./doctor-service-repair-policy-BX5XfoFa.js";
//#region src/commands/doctor-foreign-launchd-jobs.ts
/** Reports foreign launchd jobs; only explicit Doctor repair may remove lifecycle jobs. */
async function noteMacForeignLaunchdJobs(options, runtime, env = process.env) {
	if (process.platform !== "darwin") return;
	let jobs;
	try {
		jobs = await findForeignLaunchdJobs(env);
	} catch (error) {
		note(`Could not inspect foreign launchd jobs: ${sanitizeTerminalText(formatErrorMessage(error))}. No jobs were removed.`, "Foreign launchd jobs (macOS)");
		return;
	}
	if (jobs.length === 0) return;
	const lines = [formatForeignLaunchdJobs(jobs)];
	const restarts = readGatewayForcedRestartSummary(env);
	if (restarts.count > 0) lines.push(`${restarts.count} external forced Gateway restart(s) in the last ${Math.round(restarts.windowMs / 6e4)} minutes. Listed lifecycle jobs may be responsible; this is not proof of attribution.`);
	const candidates = jobs.filter((job) => job.safeToRemove);
	if (candidates.length > 0) lines.push(`Run ${formatCliCommand("testclaw doctor --fix", env)} to remove confirmed stray Gateway lifecycle jobs.`);
	note(lines.join("\n"), "Foreign launchd jobs (macOS)");
	if (options.repair !== true || candidates.length === 0) return;
	if (!isDefaultInstallIdentity(env) || isServiceRepairDeferred(resolveServiceRepairPolicy(env)) || !await shouldManageGatewayService(env)) {
		runtime.log("Foreign launchd job repair skipped: this Doctor invocation does not own service repair or an update is in progress. No jobs were removed.");
		return;
	}
	for (const job of candidates) try {
		const result = await repairForeignLaunchdJob(job, env);
		runtime.log(result.removed ? result.detail : `Removal not confirmed for launchd job ${job.label}: ${result.detail}`);
	} catch (error) {
		runtime.log(`Removal not confirmed for launchd job ${job.label}: ${sanitizeTerminalText(formatErrorMessage(error))}`);
	}
}
//#endregion
export { noteMacForeignLaunchdJobs };
