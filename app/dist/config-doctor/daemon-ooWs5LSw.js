import { t as colorize } from "./theme-DLJw9KCD.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { _ as resolveNodeSystemdServiceName, h as resolveNodeLaunchAgentLabel, v as resolveNodeWindowsTaskName } from "./constants-DaCUjVXa.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-DwvUV8m_.js";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-D9NIqD52.js";
import { w as isSystemdUserServiceAvailable } from "./systemd-service-files-Bb2bJdgP.js";
import { i as resolveSystemdUserServiceAccount } from "./systemd-user-transport-CMfFfMtX.js";
import { a as loadNodeHostConfig } from "./config-B82fRBcN.js";
import { i as resolveGatewayDaemonRuntime, r as isGatewayDaemonRuntime } from "./daemon-runtime-CdTwKGNX.js";
import { r as resolveNodeProgramArguments } from "./program-args-BaIpixHc.js";
import { n as buildNodeServiceEnvironment } from "./service-env-B-wh41_X.js";
import { o as resolvePinnedDaemonRuntimePath } from "./runtime-paths-BbZZHa_q.js";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonRuntimeBinDir, t as emitDaemonInstallRuntimeWarning } from "./daemon-install-plan.shared-Ft_UqcO-.js";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-DDfb7tFI.js";
import { i as readSystemdUserLingerStatus } from "./systemd-Cdt1nBWS.js";
import { t as resolveNodeService } from "./node-service-CFkg373l.js";
import { c as buildPlatformServiceStartHints, s as buildPlatformRuntimeLogHints, t as formatRuntimeStatus } from "./runtime-format-Y5Pt4LHw.js";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-CdADK7a_.js";
import { c as projectDaemonServiceForJson, f as resolveRuntimeStatusColor, m as buildDaemonServiceSnapshot, n as createDaemonInstallActionContext, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage, y as installDaemonServiceAndEmit } from "./shared-B_VdJ7Da.js";
import { t as resolveNodeGatewayOptions } from "./gateway-options-Cm_ZqMLe.js";
//#region src/commands/node-daemon-install-helpers.ts
/** Managed node-host install plan builder. */
function buildNodeInstallEnvironmentValueSources() {
	return {
		TESTCLAW_GATEWAY_TOKEN: "file",
		TESTCLAW_GATEWAY_PASSWORD: "file",
		CF_ACCESS_CLIENT_ID: "file",
		CF_ACCESS_CLIENT_SECRET: "file"
	};
}
/** Builds launch arguments, environment, and metadata for a managed node-host service install. */
async function buildNodeInstallPlan(params) {
	const wrapperPath = params.wrapperPath ?? params.env["TESTCLAW_WRAPPER"];
	const { devMode, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		devMode: params.devMode,
		runtimePath: params.runtimePath,
		pinnedRuntimePath: params.pinnedRuntimePath,
		wrapperPath
	});
	const { programArguments, workingDirectory } = await resolveNodeProgramArguments({
		host: params.host,
		port: params.port,
		contextPath: params.contextPath,
		tls: params.tls,
		tlsFingerprint: params.tlsFingerprint,
		nodeId: params.nodeId,
		displayName: params.displayName,
		installedAppsSharing: params.installedAppsSharing,
		commands: params.commands,
		allCommands: params.allCommands,
		dev: devMode,
		runtime: params.runtime,
		runtimePath,
		wrapperPath
	});
	await emitDaemonInstallRuntimeWarning({
		env: params.env,
		runtime: params.runtime,
		programArguments,
		warn: params.warn,
		title: "Node daemon runtime"
	});
	return {
		programArguments,
		workingDirectory,
		environment: buildNodeServiceEnvironment({
			env: params.env,
			runtime: params.runtime,
			extraPathDirs: resolveDaemonRuntimeBinDir(runtimePath)
		}),
		environmentValueSources: buildNodeInstallEnvironmentValueSources(),
		description: "Assistant Node Host"
	};
}
//#endregion
//#region src/cli/node-cli/daemon.ts
function renderNodeServiceStartHints() {
	return buildPlatformServiceStartHints({
		installHint: formatCliCommand("testclaw node install"),
		startCommand: formatCliCommand("testclaw node start"),
		launchAgentPlistPath: `~/Library/LaunchAgents/${resolveNodeLaunchAgentLabel()}.plist`,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
function buildNodeRuntimeHints(env = process.env) {
	return buildPlatformRuntimeLogHints({
		env,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
/**
* Warns (does NOT auto-enable) when systemd user lingering is disabled.
* The installed user-level node service stops when the last SSH session ends
* unless `loginctl enable-linger <user>` has been run. Read-only: this never
* changes host state, matching the operator-consent policy used elsewhere.
*/
async function warnIfSystemdUserLingerDisabled(warn) {
	if (process.platform !== "linux") return;
	if (!await isSystemdUserServiceAvailable()) return;
	const user = resolveSystemdUserServiceAccount(process.env);
	if (!user) return;
	const status = await readSystemdUserLingerStatus({
		env: process.env,
		user
	});
	if (!status || status.linger === "yes") return;
	warn(`Systemd lingering is disabled for ${status.user}. The node service will stop when you log out. Run: sudo loginctl enable-linger ${status.user}`);
}
async function runNodeDaemonInstall(opts) {
	const { json, stdout, warnings, warn, emit, emitMessage, fail } = createDaemonInstallActionContext(opts.json);
	const installBlock = resolveDaemonInstallBlockMessage("node");
	if (installBlock) {
		fail(installBlock);
		return;
	}
	const config = await loadNodeHostConfig();
	let gatewayOptions;
	try {
		gatewayOptions = resolveNodeGatewayOptions(opts, config);
	} catch (error) {
		fail(error instanceof Error ? error.message : String(error));
		return;
	}
	const { host, port, contextPath, tls, tlsFingerprint, cloudflareAccess } = gatewayOptions;
	if (!Number.isFinite(port ?? NaN) || (port ?? 0) <= 0 || (port ?? 0) > 65535) {
		fail(opts.port !== void 0 ? formatInvalidPortOption("--port") : formatInvalidConfigPort("node.gateway.port"));
		return;
	}
	if (opts.tls === false && opts.tlsFingerprint !== void 0) {
		fail("--no-tls cannot be combined with --tls-fingerprint");
		return;
	}
	if (cloudflareAccess && tls !== true) {
		fail("Cloudflare Access credentials require --tls for the node Gateway connection");
		return;
	}
	const service = resolveNodeService();
	let existingServiceCommand;
	try {
		existingServiceCommand = await service.readCommand(process.env);
	} catch (error) {
		fail(`Node service inspection failed: ${formatErrorMessage(error)}`);
		return;
	}
	const existingManagedCommand = resolveManagedGatewayServiceCommand(existingServiceCommand);
	const installEnv = {
		...process.env,
		TESTCLAW_WRAPPER: process.env.TESTCLAW_WRAPPER ?? existingManagedCommand?.environment?.TESTCLAW_WRAPPER
	};
	let pinSnapshot;
	try {
		pinSnapshot = readDaemonRuntimePinForInstall({
			kind: "node",
			env: installEnv
		}, existingServiceCommand, opts.runtime !== void 0 || opts.runtimePath !== void 0);
	} catch (error) {
		fail(`Runtime pin inspection failed: ${formatErrorMessage(error)}`);
		return;
	}
	let pinnedRuntimePath = opts.runtimePath ?? (opts.runtime ? void 0 : pinSnapshot.pin?.path);
	const runtimeRaw = opts.runtime || resolveGatewayDaemonRuntime([pinnedRuntimePath ?? ""]);
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\" or \"bun\")");
		return;
	}
	try {
		if (!installEnv.TESTCLAW_WRAPPER?.trim() || opts.runtimePath !== void 0) pinnedRuntimePath = await resolvePinnedDaemonRuntimePath(pinnedRuntimePath, runtimeRaw, installEnv);
	} catch (error) {
		fail(`Invalid runtime pin: ${formatErrorMessage(error)}`);
		return;
	}
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		fail(`Node service check failed: ${formatErrorMessage(err)}`);
		return;
	}
	if (loaded && !opts.force) {
		await warnIfSystemdUserLingerDisabled(warn);
		emitMessage({
			ok: true,
			result: "already-installed",
			message: `Node service already ${service.loadedText}.`,
			service: buildDaemonServiceSnapshot(service, loaded),
			warnings: warnings.length ? warnings : void 0
		});
		if (!json) defaultRuntime.log(`Reinstall with: ${formatCliCommand("testclaw node install --force")}`);
		return;
	}
	const { programArguments, workingDirectory, environment, environmentValueSources, description } = await buildNodeInstallPlan({
		env: installEnv,
		host,
		port: port ?? 18789,
		contextPath,
		tls: Boolean(tls),
		tlsFingerprint,
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		installedAppsSharing: opts.shareInstalledApps,
		commands: opts.commands,
		allCommands: opts.allCommands,
		runtime: runtimeRaw,
		pinnedRuntimePath,
		warn
	});
	await installDaemonServiceAndEmit({
		serviceNoun: "Node",
		service,
		warnings,
		emit,
		fail,
		install: async () => {
			await service.install({
				runtimePinUpdate: {
					expected: pinSnapshot,
					pin: pinnedRuntimePath ? {
						runtime: runtimeRaw,
						path: pinnedRuntimePath
					} : void 0
				},
				env: installEnv,
				stdout,
				warn,
				programArguments,
				workingDirectory,
				environment,
				environmentValueSources,
				description
			});
		},
		onVerified: async () => {
			await warnIfSystemdUserLingerDisabled(warn);
		}
	});
}
async function runNodeDaemonUninstall(opts = {}) {
	return await runServiceUninstall({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts,
		stopBeforeUninstall: false,
		assertNotLoadedAfterUninstall: false
	});
}
async function runNodeDaemonStart(opts = {}) {
	return await runServiceStart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonRestart(opts = {}) {
	await runServiceRestart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonStop(opts = {}) {
	return await runServiceStop({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts
	});
}
async function runNodeDaemonStatus(opts = {}) {
	const json = Boolean(opts.json);
	const service = resolveNodeService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		const message = `Node service check failed: ${formatErrorMessage(error)}`;
		if (json) throw new Error(message, { cause: error });
		defaultRuntime.error(message);
		defaultRuntime.exit(1);
		return;
	}
	const [command, runtime] = await Promise.all([service.readCommand(process.env).catch(() => null), service.readRuntime(process.env).catch((err) => ({
		status: "unknown",
		detail: formatErrorMessage(err)
	}))]);
	const payload = { service: {
		...buildDaemonServiceSnapshot(service, loaded),
		command,
		runtime
	} };
	if (json) {
		defaultRuntime.writeJson({ service: projectDaemonServiceForJson(payload.service, { includeDefinitionPaths: true }) });
		return;
	}
	const { rich, label, accent, infoText, okText, warnText, errorText } = createCliStatusTextStyles();
	const serviceStatus = loaded ? okText(service.loadedText) : warnText(service.notLoadedText);
	defaultRuntime.log(`${label("Service:")} ${accent(service.label)} (${serviceStatus})`);
	if (command?.programArguments?.length) defaultRuntime.log(`${label("Command:")} ${infoText(command.programArguments.join(" "))}`);
	if (command?.sourcePath) defaultRuntime.log(`${label("Service file:")} ${infoText(command.sourcePath)}`);
	if (command?.workingDirectory) defaultRuntime.log(`${label("Working dir:")} ${infoText(command.workingDirectory)}`);
	const runtimeLine = formatRuntimeStatus(runtime);
	if (runtimeLine) {
		const runtimeColor = resolveRuntimeStatusColor(runtime?.status);
		defaultRuntime.log(`${label("Runtime:")} ${colorize(rich, runtimeColor, runtimeLine)}`);
	}
	if (!loaded) {
		defaultRuntime.log("");
		for (const hint of renderNodeServiceStartHints()) defaultRuntime.log(`${warnText("Start with:")} ${infoText(hint)}`);
		return;
	}
	const baseEnv = {
		...process.env,
		...command?.environment ?? void 0
	};
	const hintEnv = {
		...baseEnv,
		TESTCLAW_LOG_PREFIX: baseEnv.TESTCLAW_LOG_PREFIX ?? "node"
	};
	if (runtime?.missingUnit) {
		defaultRuntime.error(errorText("Service unit not found."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
		return;
	}
	if (runtime?.status === "stopped") {
		defaultRuntime.error(errorText("Service is loaded but not running."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
	}
}
//#endregion
export { runNodeDaemonStop as a, runNodeDaemonStatus as i, runNodeDaemonRestart as n, runNodeDaemonUninstall as o, runNodeDaemonStart as r, runNodeDaemonInstall as t };
