import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as findForeignLaunchdJobs } from "./launchd-foreign-jobs-DgWquJS9.js";
import { t as readGatewayForcedRestartSummary } from "./restart-storm-CK0EnyYR.js";
//#region src/cli/daemon-cli/status.launchd.ts
/** Live launchd job diagnostics shared by shallow and deep Gateway status. */
async function gatherLaunchdJobDiagnostics(env, deep) {
	const diagnostics = {};
	const stale = deep ? await import("./launchd-13qYcvzA.js").then(({ findStaleAssistantUpdateLaunchdJobs }) => findStaleAssistantUpdateLaunchdJobs(env)).catch(() => []) : [];
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
