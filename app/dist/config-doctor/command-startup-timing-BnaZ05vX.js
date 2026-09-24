import { i as measureGatewayBootstrapStep } from "./startup-trace-6G1pu5mk.js";
//#region src/cli/command-startup-timing.ts
let diagnosticsTimelineModulePromise;
function hasDiagnosticsTimelinePath(env) {
	return Boolean(env.TESTCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim());
}
function loadDiagnosticsTimelineModule() {
	diagnosticsTimelineModulePromise ??= import("./diagnostics-timeline-C2iWaeMY.js");
	return diagnosticsTimelineModulePromise;
}
/** Measures command-specific work hidden inside Commander parse/action dispatch. */
async function measureCliCommandStartup(stage, run, options = {}) {
	const env = options.env ?? process.env;
	const tracedRun = stage.startsWith("doctor.config-preflight.") ? run : () => measureGatewayBootstrapStep(`cli.command.${stage}`, run);
	if (!hasDiagnosticsTimelinePath(env)) return await tracedRun();
	const { measureDiagnosticsTimelineSpan } = await loadDiagnosticsTimelineModule();
	return await measureDiagnosticsTimelineSpan("cli.command-startup", tracedRun, {
		config: options.config,
		env,
		phase: "cli.command-startup",
		attributes: { stage }
	});
}
//#endregion
export { measureCliCommandStartup as t };
