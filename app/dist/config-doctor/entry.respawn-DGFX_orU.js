import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-4Mrfvtkv.js";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { n as getCommandPathWithRootOptions } from "./argv-zmtAhw2-.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { t as normalizeWindowsArgv } from "./windows-argv-Dl7Refj1.js";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-DL8VNVWw.js";
import "./child-process-bridge-CFJsa4sQ.js";
import "node:child_process";
import path from "node:path";
//#region src/cli/respawn-policy.ts
const INTERACTIVE_TTY_COMMANDS = /* @__PURE__ */ new Set([
	"tui",
	"terminal",
	"chat"
]);
/** Gmail owns a shutdown grace period longer than the generic respawn wrapper allows. */
function isForegroundGmailRunArgv(argv) {
	return getCommandPathWithRootOptions(argv, 3).join(" ") === "webhooks gmail run";
}
function isNativeHookRelayArgv(argv) {
	const { commandPath } = resolveCliArgvInvocation(argv);
	return commandPath[0] === "hooks" && commandPath[1] === "relay";
}
function shouldKeepNativeHookRelayInProcess(argv, platform) {
	return platform !== "win32" && isNativeHookRelayArgv(argv);
}
function isInteractiveTtyCommandArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.primary !== null && INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
function isTerminalInteractiveRespawnArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion) return false;
	return invocation.primary === null || INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
/** Returns whether CLI startup should avoid the general respawn wrapper for this argv. */
function shouldSkipRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	const isGatewayStatus = invocation.commandPath.length === 2 && invocation.commandPath[0] === "gateway" && invocation.commandPath[1] === "status";
	return invocation.hasHelpOrVersion || isInteractiveTtyCommandArgv(argv) || isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform) || isGatewayStatus || invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv);
}
/** Returns whether startup-environment respawn should be skipped without suppressing TUI respawn policy. */
function shouldSkipStartupEnvironmentRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.hasHelpOrVersion || isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform) || invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv);
}
//#endregion
//#region src/entry.respawn.ts
const EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
const TESTCLAW_NODE_OPTIONS_READY = "TESTCLAW_NODE_OPTIONS_READY";
const TESTCLAW_NODE_EXTRA_CA_CERTS_READY = "TESTCLAW_NODE_EXTRA_CA_CERTS_READY";
const WINDOWS_STACK_SIZE_FLAG = "--stack-size=8192";
function pathModuleForPlatform(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
function resolveCliRespawnCommand(params) {
	const basename = pathModuleForPlatform(params.platform ?? process.platform).basename(params.execPath).toLowerCase();
	if (basename === "volta-shim" || basename === "volta-shim.exe") return "node";
	return params.execPath;
}
function hasExperimentalWarningSuppressed(params = {}) {
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const nodeOptions = env.NODE_OPTIONS ?? "";
	if (nodeOptions.includes(EXPERIMENTAL_WARNING_FLAG) || nodeOptions.includes("--no-warnings")) return true;
	return execArgv.some((arg) => arg === EXPERIMENTAL_WARNING_FLAG || arg === "--no-warnings");
}
function hasStackSizeConfigured(execArgv) {
	return execArgv.some((arg) => arg === "--stack-size" || arg.startsWith("--stack-size=") || arg === "--stack_size" || arg.startsWith("--stack_size="));
}
function buildCliRespawnPlan(params = {}) {
	const argv = params.argv ?? process.argv;
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const execPath = params.execPath ?? process.execPath;
	const platform = params.platform ?? process.platform;
	const normalizedArgv = platform === "win32" ? normalizeWindowsArgv(argv, {
		platform,
		execPath
	}) : argv;
	if (shouldSkipStartupEnvironmentRespawnForArgv(normalizedArgv, platform) || isTruthyEnvValue(env.TESTCLAW_NO_RESPAWN)) return null;
	const childEnv = { ...env };
	if (!readNonBlankString(childEnv.NODE_EXTRA_CA_CERTS)) delete childEnv.NODE_EXTRA_CA_CERTS;
	const childExecArgv = [...execArgv];
	let needsRespawn = false;
	if (platform === "win32") {
		if (!hasStackSizeConfigured(childExecArgv)) {
			childExecArgv.unshift(WINDOWS_STACK_SIZE_FLAG);
			needsRespawn = true;
		}
		if (!needsRespawn) return null;
		return {
			command: resolveCliRespawnCommand({
				execPath,
				platform
			}),
			argv: [...childExecArgv, ...normalizedArgv.slice(1)],
			env: childEnv,
			detachForProcessTree: false
		};
	}
	const autoNodeExtraCaCerts = params.autoNodeExtraCaCerts ?? resolveNodeStartupTlsEnvironment({
		env,
		execPath,
		includeDarwinDefaults: false
	}).NODE_EXTRA_CA_CERTS;
	if (autoNodeExtraCaCerts && !isTruthyEnvValue(env[TESTCLAW_NODE_EXTRA_CA_CERTS_READY]) && !childEnv.NODE_EXTRA_CA_CERTS) {
		childEnv.NODE_EXTRA_CA_CERTS = autoNodeExtraCaCerts;
		childEnv[TESTCLAW_NODE_EXTRA_CA_CERTS_READY] = "1";
		needsRespawn = true;
	}
	if (!shouldSkipRespawnForArgv(argv, platform) && !isTruthyEnvValue(env[TESTCLAW_NODE_OPTIONS_READY]) && !hasExperimentalWarningSuppressed({
		env,
		execArgv
	})) {
		childEnv[TESTCLAW_NODE_OPTIONS_READY] = "1";
		childExecArgv.unshift(EXPERIMENTAL_WARNING_FLAG);
		needsRespawn = true;
	}
	if (!needsRespawn) return null;
	return {
		command: resolveCliRespawnCommand({
			execPath,
			platform
		}),
		argv: [...childExecArgv, ...argv.slice(1)],
		env: childEnv,
		detachForProcessTree: !isTerminalInteractiveRespawnArgv(argv)
	};
}
//#endregion
export { buildCliRespawnPlan as t };
