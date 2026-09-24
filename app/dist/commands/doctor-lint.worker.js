import { r as defaultRuntime } from "../runtime-Dg6PE4Mj.mjs";
import { a as closeCliResources, r as runCliWithExitFinalization, s as runCliDisposer, t as exitCliAfterOutput } from "../one-shot-exit-lcRdrcHV.mjs";
import { a as withCliCommandCleanup, o as withCliProcessScope } from "../runtime-cleanup-scope-CM7nGuUs.mjs";
import { t as enableConsoleCapture } from "../console-CIWsc0DX.mjs";
import { E as string, T as strictObject, _ as literal, d as array, f as boolean } from "../schemas-qz0osXyE.mjs";
import { r as resolveUpdateRehearsalRoot } from "../update-rehearsal-paths-B5uAOKw6.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "../json-output-mode-M78iFCSh.mjs";
import { t as scrubDoctorErrorMessage } from "../doctor-error-message-CBAGGfGW.mjs";
//#region src/commands/doctor-lint-options.ts
const DoctorLintCliOptionsSchema = strictObject({
	json: boolean().optional(),
	severityMin: string().optional(),
	skipIds: array(string()).readonly().optional(),
	onlyIds: array(string()).readonly().optional(),
	allowExec: boolean().optional(),
	deep: boolean().optional(),
	includeAllChecks: boolean().optional(),
	updateReadiness: literal("post-plugin").optional()
});
//#endregion
//#region src/commands/doctor-lint.worker.ts
async function runDoctorLintWorker() {
	if (!resolveUpdateRehearsalRoot(process.env)) throw new Error("Doctor lint worker requires an isolated update rehearsal.");
	const chunks = [];
	let bytes = 0;
	for await (const chunk of process.stdin) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.length;
		if (bytes > 1048576) throw new Error("Doctor lint worker input exceeded its limit.");
		chunks.push(buffer);
	}
	const opts = DoctorLintCliOptionsSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
	if (opts.json !== true) throw new Error("Doctor lint worker requires JSON output.");
	enableConsoleCapture();
	await withCliProcessScope(() => withCliCommandCleanup(false, async (cleanup) => {
		let exitCode;
		try {
			const { runDoctorLintCliInProcess } = await import("../doctor-lint-BF2PEtd2.mjs");
			exitCode = await runDoctorLintCliInProcess(defaultRuntime, opts, true);
		} finally {
			await closeCliResources(cleanup);
			const resources = cleanup?.pluginResources;
			if (resources) await runCliDisposer("plugin-registration-resources", () => resources.release());
		}
		exitCliAfterOutput(defaultRuntime, exitCode);
	}));
}
withConsoleLogsRoutedToStderrForJson(process.argv, () => runCliWithExitFinalization({
	run: runDoctorLintWorker,
	onError: (error) => {
		process.stderr.write(`Doctor lint worker failed: ${scrubDoctorErrorMessage(error)}\n`);
		process.exitCode = 2;
	}
}), {
	machineOutput: true,
	retainRoutingUntilProcessExit: true
});
//#endregion
export {};
