import { n as isNodeRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { E as string, d as array, f as boolean, l as _enum, x as object } from "./schemas-qz0osXyE.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-B1vQapv6.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-BddaUUYf.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CmSZ7pz0.mjs";
//#region src/commands/triage-doctor.ts
const triageDoctorReportSchema = object({
	ok: boolean(),
	findings: array(object({
		severity: _enum([
			"error",
			"warning",
			"info"
		]),
		message: string()
	}))
});
async function validateTriageDoctor(params) {
	const { installRoot, env, signal, redaction } = params;
	const entrypoint = await resolveGatewayInstallEntrypoint(installRoot);
	signal.throwIfAborted();
	if (!entrypoint) throw new Error("The installed Assistant entrypoint is unavailable.");
	const doctorCommand = await runUtf8CommandWithTimeout([
		isNodeRuntime(process.execPath) ? process.execPath : "node",
		entrypoint,
		"doctor",
		"--lint",
		"--json",
		"--severity-min",
		"error"
	], {
		cwd: installRoot,
		baseEnv: {},
		env,
		input: "",
		signal,
		killProcessTree: true,
		maxOutputBytes: {
			stdout: 1048576,
			stderr: 16384
		},
		terminateOnOutputLimit: true
	});
	signal.throwIfAborted();
	if (doctorCommand.termination !== "exit" || doctorCommand.outputLimitExceeded) throw new Error("Doctor lint did not complete within its execution or output budget.");
	const doctorReport = triageDoctorReportSchema.parse(JSON.parse(doctorCommand.stdout));
	const errors = doctorReport.findings.filter((finding) => finding.severity === "error");
	if (errors.length === 0 && (doctorCommand.code !== 0 || !doctorReport.ok)) throw new Error("Doctor lint failed without reporting an error finding.");
	return {
		ok: errors.length === 0,
		score: errors.length === 0 ? 0 : -errors.length,
		summary: errors.length === 0 ? "Doctor lint reports no errors." : `${errors.length} Doctor lint error(s): ${errors.slice(0, 3).map((finding) => redactSupportString(finding.message, redaction, { maxLength: 200 })).join("; ")}`
	};
}
//#endregion
export { validateTriageDoctor };
