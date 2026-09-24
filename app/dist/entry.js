#!/usr/bin/env node
import { u as isRootHelpInvocation } from "./argv-Wc3zbgLD.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-L1ml5gbH.mjs";
import { n as parseCliContainerArgs, r as resolveCliContainerTarget } from "./container-target-BILBNY5T.mjs";
import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { n as requestExitAfterOneShotOutput, r as runCliWithExitFinalization } from "./one-shot-exit-lcRdrcHV.mjs";
import { t as tryOutputPrecomputedCommandHelp } from "./precomputed-help-CxskqH33.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-AGkj5Sfs.mjs";
import { a as isNativeHookRelayArgv, i as isForegroundGmailRunArgv, n as runCliRespawnPlan, o as isTerminalInteractiveRespawnArgv, r as runRespawnChildWithSignalBridge, s as shouldKeepNativeHookRelayInProcess, t as buildCliRespawnPlan } from "./entry.respawn-B3v17N2q.mjs";
import { o as withCliProcessScope } from "./runtime-cleanup-scope-CM7nGuUs.mjs";
import { i as normalizeEnv } from "./env-DiCPcdkM.mjs";
import { r as createGatewayDispatchStartupTrace, t as configureGatewayStartupTraceConsoleFormatting } from "./startup-trace-CP6CKAU0.mjs";
import { t as normalizeWindowsArgv } from "./windows-argv-C3HwI-HD.mjs";
import { t as enableOwnedNodeCompileCache } from "./node-compile-cache-env-0OHfnxdS.mjs";
import { t as attachChildProcessBridge } from "./child-process-bridge-CFJsa4sQ.mjs";
import { t as installDistEsmResolveFastPath } from "./entry.esm-resolve-fast-path-C_iXgKXc.mjs";
import { t as tryHandleRootVersionFastPath } from "./entry.version-fast-path-DVQsSMOP.mjs";
import { t as isMainModule } from "./is-main-CH4EEB_R.mjs";
import { r as ensureAssistantExecMarkerOnProcess } from "./testclaw-exec-env-O_MEx5Tv.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-Dz9JlDbu.mjs";
import { i as requestNodeHostLauncherBootstrap, n as isNodeHostLauncherChild, t as getManagedNodeHostStatePath } from "./launcher-client-CPNUVpML.mjs";
import { getCompileCacheDir } from "node:module";
import { existsSync, readFileSync, statSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { format } from "node:util";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";
//#region src/entry.compile-cache.ts
const COMPILE_CACHE_DISABLED_RESPAWNED_ENV = "TESTCLAW_COMPILE_CACHE_DISABLED_RESPAWNED";
function resolveEntryInstallRoot(entryFile) {
	const entryDir = path.dirname(entryFile);
	const entryParent = path.basename(entryDir);
	return entryParent === "dist" || entryParent === "src" ? path.dirname(entryDir) : entryDir;
}
function isSourceCheckoutInstallRoot(installRoot) {
	return existsSync(path.join(installRoot, ".git")) || existsSync(path.join(installRoot, "src", "entry.ts"));
}
function isNodeCompileCacheDisabled(env) {
	return env?.NODE_DISABLE_COMPILE_CACHE !== void 0;
}
function isNodeCompileCacheRequested(env) {
	return env?.NODE_COMPILE_CACHE !== void 0 && !isNodeCompileCacheDisabled(env);
}
function shouldEnableAssistantCompileCache(params) {
	return !isNodeCompileCacheDisabled(params.env) && !isSourceCheckoutInstallRoot(params.installRoot);
}
function sanitizeCompileCachePathSegment(value) {
	const normalized = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return normalized.length > 0 ? normalized : "unknown";
}
function readPackageVersion(packageJsonPath) {
	try {
		const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8"));
		if (parsed && typeof parsed === "object" && "version" in parsed && typeof parsed.version === "string" && parsed.version.trim().length > 0) return parsed.version;
	} catch {}
	return "unknown";
}
function resolveAssistantCompileCacheDirectory(params) {
	const env = params.env ?? process.env;
	const packageJsonPath = path.join(params.installRoot, "package.json");
	const version = sanitizeCompileCachePathSegment(readPackageVersion(packageJsonPath));
	let installMarker = "no-package-json";
	try {
		const stat = statSync(packageJsonPath);
		installMarker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
	} catch {}
	const baseDirectory = env.NODE_COMPILE_CACHE && !isNodeCompileCacheDisabled(env) ? env.NODE_COMPILE_CACHE : path.join(os.tmpdir(), "node-compile-cache");
	return path.join(baseDirectory, "testclaw", version, sanitizeCompileCachePathSegment(installMarker));
}
function buildAssistantCompileCacheRespawnPlan(params) {
	const env = params.env ?? process.env;
	const argv = process.argv;
	const platform = process.platform;
	if (platform !== "win32" && isForegroundGatewayRunArgv(argv)) return;
	if (isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform)) return;
	if (!isSourceCheckoutInstallRoot(params.installRoot)) return;
	if (env[COMPILE_CACHE_DISABLED_RESPAWNED_ENV] === "1") return;
	if (!params.compileCacheDir && !isNodeCompileCacheRequested(env)) return;
	const nextEnv = {
		...env,
		NODE_DISABLE_COMPILE_CACHE: "1",
		[COMPILE_CACHE_DISABLED_RESPAWNED_ENV]: "1"
	};
	delete nextEnv.NODE_COMPILE_CACHE;
	return {
		command: process.execPath,
		args: [
			...process.execArgv,
			params.currentFile,
			...argv.slice(2)
		],
		env: nextEnv,
		detachForProcessTree: platform !== "win32" && !isTerminalInteractiveRespawnArgv(argv)
	};
}
async function respawnWithoutAssistantCompileCacheIfNeeded(params) {
	const plan = buildAssistantCompileCacheRespawnPlan({
		currentFile: params.currentFile,
		installRoot: params.installRoot,
		compileCacheDir: getCompileCacheDir?.(),
		env: params.env
	});
	if (!plan) return false;
	const writeError = await params.prepareWriteError?.();
	runAssistantCompileCacheRespawnPlan(plan, writeError ? {
		spawn,
		attachChildProcessBridge,
		exit: process.exit.bind(process),
		writeError
	} : void 0);
	return true;
}
function runAssistantCompileCacheRespawnPlan(plan, runtime = {
	spawn,
	attachChildProcessBridge,
	exit: process.exit.bind(process),
	writeError: (message) => {
		process.stderr.write(message);
	}
}) {
	return runRespawnChildWithSignalBridge({
		command: plan.command,
		args: plan.args,
		env: plan.env,
		detachForProcessTree: plan.detachForProcessTree,
		runtime,
		onError: (error) => {
			return runtime.writeError(`[testclaw] Failed to respawn CLI without compile cache: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
		}
	});
}
function enableAssistantCompileCache(params) {
	if (!shouldEnableAssistantCompileCache(params)) return;
	try {
		enableOwnedNodeCompileCache(resolveAssistantCompileCacheDirectory(params));
	} catch {}
}
//#endregion
//#region src/entry.ts
const inheritedRuntimeEnv = { ...process.env };
const ENTRY_WRAPPER_PAIRS = [
	{
		wrapperBasename: "testclaw.mjs",
		entryBasename: "entry.js"
	},
	{
		wrapperBasename: "testclaw.mjs",
		entryBasename: "entry.mjs"
	},
	{
		wrapperBasename: "testclaw.js",
		entryBasename: "entry.js"
	}
];
const loadRootHelpLiveConfigModule = async () => await import("./root-help-live-config-DAXMFVrc.mjs");
const loadRootHelpMetadataModule = async () => await import("./root-help-metadata-DoWAQ8F9.mjs");
async function writeCapturedCliArgumentError(message) {
	const { loadCliDotEnv } = await import("./dotenv-DwbC6iDO.mjs");
	loadCliDotEnv({ quiet: true });
	await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
	const { enableConsoleCapture } = await import("./logging-o_xJfeqw.mjs");
	enableConsoleCapture();
	const [{ formatCliJsonFailure }, { isJsonOutputModeActive }] = await Promise.all([import("./failure-output-DfurnM-m.mjs"), import("./json-output-mode-B75Hie7Q.mjs")]);
	if (isJsonOutputModeActive(process.argv)) defaultRuntime.writeJson(formatCliJsonFailure(message));
	console.error(`[testclaw] ${message}`);
}
async function prepareCliDiagnosticBlockWriter() {
	const loadWriter = async () => {
		const { loadCliDotEnv } = await import("./dotenv-DwbC6iDO.mjs");
		loadCliDotEnv({ quiet: true });
		await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
		const { formatConsoleDiagnosticBlock } = await import("./json-console-line-DVN28Wiz.mjs");
		return (message, error) => {
			const formatted = error === void 0 ? message : format(message, error);
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message: formatted.endsWith("\n") ? formatted : `${formatted}\n`
			}));
		};
	};
	return gatewayEntryStartupTrace.enabled ? loadWriter() : async (message, error) => (await loadWriter())(message, error);
}
async function flushEntryStartupTraceForEarlyReturn(argv) {
	if (!gatewayEntryStartupTrace.enabled) return;
	const { loadCliDotEnvForEarlyDiagnostic } = await import("./dotenv-DwbC6iDO.mjs");
	await loadCliDotEnvForEarlyDiagnostic(argv);
	await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
}
function shouldForceReadOnlyAuthStore(argv) {
	const tokens = argv.slice(2).filter((token) => token.length > 0 && !token.startsWith("-"));
	for (let index = 0; index < tokens.length - 1; index += 1) if (tokens[index] === "secrets" && tokens[index + 1] === "audit") return true;
	return false;
}
const gatewayEntryStartupTrace = createGatewayDispatchStartupTrace(process.argv, "entry");
if (!isMainModule({
	currentFile: fileURLToPath(import.meta.url),
	wrapperEntryPairs: [...ENTRY_WRAPPER_PAIRS]
})) {} else {
	const entryFile = fileURLToPath(import.meta.url);
	const installRoot = resolveEntryInstallRoot(entryFile);
	installDistEsmResolveFastPath(import.meta.url);
	ensureAssistantExecMarkerOnProcess();
	installProcessWarningFilter();
	normalizeEnv();
	process.argv = normalizeWindowsArgv(process.argv);
	const earlyProfile = parseCliProfileArgs(process.argv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const startupEnv = { ...process.env };
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("./runtime-guard-D6Lf042s.mjs");
	if (!await isCurrentRuntimeSupported()) {
		const { loadCliDotEnv } = await import("./dotenv-DwbC6iDO.mjs");
		loadCliDotEnv({ quiet: true });
		await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
	}
	await assertSupportedRuntime(void 0, void 0, process.argv, false, inheritedRuntimeEnv);
	const { runNodeHostLauncher } = await import(new URL("../node-host-launcher.mjs", import.meta.url).href);
	if (await runNodeHostLauncher({
		entryPath: entryFile,
		packageRoot: installRoot
	})) process.exit(process.exitCode ?? 0);
	gatewayEntryStartupTrace.mark("bootstrap");
	if (!(!isNodeHostLauncherChild() && await respawnWithoutAssistantCompileCacheIfNeeded({
		currentFile: entryFile,
		installRoot,
		env: startupEnv,
		prepareWriteError: async () => {
			const writeError = await prepareCliDiagnosticBlockWriter();
			return (message) => writeError(message);
		}
	}))) {
		enableAssistantCompileCache({ installRoot });
		if (shouldForceReadOnlyAuthStore(process.argv)) process.env.TESTCLAW_AUTH_STORE_READONLY = "1";
		if (process.argv.includes("--no-color")) {
			process.env.NO_COLOR = "1";
			process.env.FORCE_COLOR = "0";
		}
		async function ensureCliRespawnReady() {
			const plan = buildCliRespawnPlan({ env: startupEnv });
			if (!plan) return false;
			if (isNodeHostLauncherChild()) {
				await requestNodeHostLauncherBootstrap({
					execArgv: plan.argv.slice(0, plan.argv.length - process.argv.length + 1),
					env: plan.env
				});
				process.exit(0);
			}
			const writeError = await prepareCliDiagnosticBlockWriter();
			runCliRespawnPlan(plan, void 0, writeError);
			return true;
		}
		if (!await ensureCliRespawnReady()) {
			await assertSupportedRuntime(void 0, void 0, process.argv, true, inheritedRuntimeEnv);
			process.title = "testclaw";
			const parsedContainer = parseCliContainerArgs(process.argv);
			if (!parsedContainer.ok) {
				await writeCapturedCliArgumentError(parsedContainer.error);
				process.exit(2);
			}
			const parsed = parseCliProfileArgs(parsedContainer.argv);
			if (!parsed.ok) {
				await writeCapturedCliArgumentError(parsed.error);
				process.exit(2);
			}
			const containerTargetName = resolveCliContainerTarget(process.argv);
			if (parsed.profile) {
				applyCliProfileEnv({ profile: parsed.profile });
				process.argv = parsed.argv;
			}
			if (containerTargetName && parsed.profile) {
				await writeCapturedCliArgumentError("--container cannot be combined with --profile/--dev");
				process.exit(2);
			}
			gatewayEntryStartupTrace.mark("argv");
			if (!tryHandleRootVersionFastPath(process.argv)) {
				const run = (finalize) => withCliProcessScope(() => runMainOrRootHelp(process.argv, { finalize }));
				const managedNodeStatePath = getManagedNodeHostStatePath();
				if (managedNodeStatePath) {
					const { withExistingAssistantStateSchema } = await import("./testclaw-state-db-schema-policy-DWyUcb2F.mjs");
					await withExistingAssistantStateSchema({ path: managedNodeStatePath }, async () => {
						const { openAssistantStateDatabase, closeAssistantStateDatabaseByPathAsync } = await import("./testclaw-state-db-CY_2In_s.mjs");
						openAssistantStateDatabase({ path: managedNodeStatePath });
						await run(async () => {
							await closeAssistantStateDatabaseByPathAsync(managedNodeStatePath);
						});
					});
				} else await run();
			}
		}
	}
}
async function tryHandleRootHelpFastPath(argv, deps = {}) {
	const env = deps.env ?? process.env;
	if (env.TESTCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1" || resolveCliContainerTarget(argv, env)) return false;
	if (!isRootHelpInvocation(argv)) return false;
	const handleError = deps.onError ?? (async (error) => {
		const detail = error instanceof Error ? error.stack ?? error.message : String(error);
		await (await prepareCliDiagnosticBlockWriter())(`[testclaw] Failed to display help: ${detail}\n`);
		process.exit(1);
	});
	try {
		const liveRootHelpOptions = await (deps.loadRootHelpRenderOptionsForConfigSensitivePlugins ?? (await loadRootHelpLiveConfigModule()).loadRootHelpRenderOptionsForConfigSensitivePlugins)(env);
		if (!liveRootHelpOptions) {
			if ((deps.outputPrecomputedRootHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedRootHelpText)()) return true;
		}
		await (deps.outputRootHelp ?? (await import("./root-help-OlpRusqP.mjs")).outputRootHelp)(liveRootHelpOptions ?? void 0);
		return true;
	} catch (error) {
		await handleError(error);
		return true;
	}
}
async function tryHandlePrecomputedCommandHelpFastPath(argv, deps = {}) {
	const env = deps.env ?? process.env;
	if (resolveCliContainerTarget(argv, env)) return false;
	try {
		return await tryOutputPrecomputedCommandHelp(argv, {
			...deps,
			env
		});
	} catch {
		return false;
	}
}
async function runMainOrRootHelp(argv, deps = {}) {
	let commandStarted = false;
	await runCliWithExitFinalization({
		finalize: deps.finalize,
		run: async () => {
			if (isNativeHookRelayArgv(argv) && !argv.includes("--help") && !argv.includes("-h")) {
				const { runNativeHookRelayCliFromArgv } = await import("./native-hook-relay-cli-DZwRxDI1.mjs");
				const exitCode = await runNativeHookRelayCliFromArgv(argv);
				process.exitCode = exitCode;
				requestExitAfterOneShotOutput(defaultRuntime, exitCode);
				return;
			}
			if (await tryHandleRootHelpFastPath(argv)) {
				await flushEntryStartupTraceForEarlyReturn(argv);
				return;
			}
			if (await tryHandlePrecomputedCommandHelpFastPath(argv)) {
				await flushEntryStartupTraceForEarlyReturn(argv);
				return;
			}
			const { runCli } = await gatewayEntryStartupTrace.measure("run-main-import", deps.loadRunCli ?? (() => import("./cli/run-main.js")));
			commandStarted = true;
			await runCli(argv, {
				additionalStartupTrace: gatewayEntryStartupTrace,
				runtimeRecoveryEnv: inheritedRuntimeEnv,
				retainConsoleRoutingUntilProcessExit: true
			});
		},
		onError: async (error) => {
			const { loadCliDotEnvForEarlyDiagnostic } = await import("./dotenv-DwbC6iDO.mjs");
			await loadCliDotEnvForEarlyDiagnostic(argv);
			await configureGatewayStartupTraceConsoleFormatting(gatewayEntryStartupTrace);
			const { enableConsoleCapture } = await import("./logging-o_xJfeqw.mjs");
			enableConsoleCapture();
			const [{ formatCliFailureLines, formatCliJsonFailure }, { isJsonOutputModeActive }] = await Promise.all([import("./failure-output-DfurnM-m.mjs"), import("./json-output-mode-B75Hie7Q.mjs")]);
			if (isJsonOutputModeActive(argv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
			for (const line of formatCliFailureLines({
				title: commandStarted ? "The CLI command failed." : "Could not start the CLI.",
				error,
				argv
			})) console.error(line);
			process.exitCode = 1;
		}
	});
}
//#endregion
export { runMainOrRootHelp, tryHandlePrecomputedCommandHelpFastPath, tryHandleRootHelpFastPath };
