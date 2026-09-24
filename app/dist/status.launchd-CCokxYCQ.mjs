import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { t as findForeignLaunchdJobs } from "./launchd-foreign-jobs-BS1g-Mkj.mjs";
import { t as readGatewayForcedRestartSummary } from "./restart-storm-Nt6KN7EJ.mjs";
//#region src/cli/daemon-cli/status.launchd.ts
/** Live launchd job diagnostics shared by shallow and deep Gateway status. */
async function gatherLaunchdJobDiagnostics(env, deep) {
	const diagnostics = {};
	const stale = deep ? await import("./launchd-oAoJgbmb.mjs").then(({ findStaleAssistantUpdateLaunchdJobs }) => findStaleAssistantUpdateLaunchdJobs(env)).catch(() => []) : [];
	if (stale.length) diagnostics.staleUpdateLaunchdJobs = stale;
	try {
		const jobs = await findForeignLaunchdJobs(env);
		if (jobs.length) {
			diagnostics.foreignLaunchdJobs = jobs;
			diagnostics.forcedRestartSummary = readGatewayForcedRestartSummary(env);
		}
	} catch (error) {
		diagnostics.foreignLaunchdInspectionError = formatErrorMessage(error);
	}
	return diagnostics;
}
//#endregion
export { gatherLaunchdJobDiagnostics };
