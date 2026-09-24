#!/usr/bin/env node
import { existsSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
//#region src/index.ts
const packageRootUrl = new URL("../", import.meta.url);
if (!existsSync(new URL("entry.ts", import.meta.url)) && (existsSync(new URL(".testclaw-lifecycle-pending", packageRootUrl)) || existsSync(new URL("dist/testclaw-install-guard", packageRootUrl)))) {
	const { completePendingPackageLifecycle } = await import("./package-lifecycle-Bs5-F0MN.js");
	try {
		await completePendingPackageLifecycle({ packageRoot: fileURLToPath(packageRootUrl) });
	} catch (error) {
		throw new Error(`Assistant package lifecycle is incomplete. Reinstall with package scripts enabled, then retry. ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
}
const [{ formatCliFailureLines, formatCliJsonFailure, isExpectedCliError }, { isJsonOutputModeActive }, { runCliWithExitFinalization }, { withCliProcessScope }, { installDistEsmResolveFastPath }, { tryHandleRootVersionFastPath }, { formatUncaughtError }, { runFatalErrorHooks }, { isMainModule }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }] = await Promise.all([
	import("./failure-output-2IHf1cPf.js"),
	import("./json-output-mode-Dty1ic1n.js"),
	import("./one-shot-exit-B9FLk8nI.js"),
	import("./runtime-cleanup-scope-fl4awj9r.js"),
	import("./entry.esm-resolve-fast-path-Dn-aepRy.js"),
	import("./entry.version-fast-path-DWnK_cJ0.js"),
	import("./errors-DP1KnB17.js"),
	import("./fatal-error-hooks-DMH8gY71.js"),
	import("./is-main-DCeI9Mvk.js"),
	import("./unhandled-rejections-D5CV54NP.js")
]);
let applyTemplate;
let createDefaultDeps;
let deriveSessionKey;
let describePortOwner;
let ensureBinary;
let ensurePortAvailable;
let getReplyFromConfig;
let handlePortError;
let loadConfig;
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
let loadSessionStore;
let monitorWebChannel;
let normalizeE164;
let PortInUseError;
let promptYesNo;
let resolveSessionKey;
let resolveStorePath;
let runCommandWithTimeout;
let runExec;
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
let saveSessionStore;
let waitForever;
async function loadLegacyCliDeps() {
	const { runCli } = await import("./run-main-B-Qz3C_T.js");
	return { runCli };
}
async function runLegacyCliEntry(argv = process.argv, deps, options) {
	const { runCli } = deps ?? await loadLegacyCliDeps();
	await runCli(argv, options);
}
const isMain = isMainModule({ currentFile: fileURLToPath(import.meta.url) });
if (isMain) installDistEsmResolveFastPath(import.meta.url);
const handledRootVersion = isMain && tryHandleRootVersionFastPath(process.argv);
if (!isMain) ({applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, PortInUseError, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, waitForever} = await import("./library-DCZCTqjJ.js"));
if (isMain && !handledRootVersion) {
	const { defaultRuntime, restoreRuntimeTerminalState } = await import("./runtime-CkU4itJ9.js");
	installUnhandledRejectionHandler();
	process.on("uncaughtException", (error) => {
		if (isUncaughtExceptionHandled(error)) return;
		if (isBenignUncaughtExceptionError(error)) {
			console.warn("[testclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
			return;
		}
		if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
		for (const line of formatCliFailureLines({
			title: "Assistant hit an unexpected runtime error.",
			error,
			argv: process.argv
		})) console.error(line);
		for (const message of runFatalErrorHooks({
			reason: "uncaught_exception",
			error
		})) console.error("[testclaw]", message);
		restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
		process.exit(1);
	});
	runCliWithExitFinalization({
		run: () => withCliProcessScope(() => runLegacyCliEntry(process.argv, void 0, { retainConsoleRoutingUntilProcessExit: true })),
		onError: (err) => {
			if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(err));
			for (const line of formatCliFailureLines({
				title: "The CLI command failed.",
				error: err,
				argv: process.argv
			})) console.error(line);
			if (!isExpectedCliError(err)) for (const message of runFatalErrorHooks({
				reason: "legacy_cli_failure",
				error: err
			})) console.error("[testclaw]", message);
			restoreRuntimeTerminalState("legacy cli failure", { resumeStdinIfPaused: false });
			process.exitCode = 1;
		}
	});
}
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, runLegacyCliEntry, saveSessionStore, waitForever };
