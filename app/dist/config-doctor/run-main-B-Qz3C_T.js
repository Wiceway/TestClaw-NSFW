import { n as consumeRootOptionToken, o as isValueToken } from "./cli-root-options-DSrEgsqR.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as sanitizeTerminalText } from "./safe-text-CXEZaOnt.js";
import { i as normalizeEnv, n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.js";
import { C as retirePluginCache, D as withPluginCache, a as createPluginCache, o as getPluginCache } from "./plugin-cache-CsUjLuei.js";
import { n as resolveHomeRelativePath } from "./home-dir-DjuHbd5R.js";
import { r as resolveProfileStateDir, t as isValidProfileName } from "./profile-utils-Dg5jvoU-.js";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS, c as isGatewayServiceEnv, l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-DaCUjVXa.js";
import { E as resolveStateDir, v as resolveGatewayPort } from "./paths-DeOFr7iP.js";
import { n as registerSignalExitBarrier, o as waitForSignalExitBarriers } from "./signal-exit-barrier-D8TPSn7h.js";
import { n as formatInvalidConfigDetails, t as createInvalidConfigError } from "./io.invalid-config-CKzyW0XS.js";
import { t as normalizeWebSocketProtocol } from "./websocket-protocol-MDxbNIbL.js";
import { a as isLoopbackAddress, u as isSecureWebSocketUrl } from "./net-DLTbz3sZ.js";
import { a as withCliCommandCleanup } from "./runtime-cleanup-scope-CotsKgC1.js";
import { n as shouldStartLocalOnboarding } from "./fresh-install-config-w1dJ7k_p.js";
import { A as resolveGatewayCatalogCommandPath, H as isMachineOutputStdoutTTY, I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore, O as consumeGatewayFastPathRootOptionToken, f as isSimpleCommandHelpInvocation, g as normalizeRootNoColorArgv, h as normalizeRootLogLevelArgv, j as resolveGatewayRunPreBootstrapOptions, k as consumeGatewayRunOptionToken, m as normalizeRootHelpTargetArgv, n as getCommandPathWithRootOptions, p as normalizeGeneratedHelpCommandArgv, v as getSubCliEntriesCore, y as getSubCliParentDefaultHelpCommands, z as getCoreCliParentDefaultHelpCommands } from "./argv-zmtAhw2-.js";
import { a as withConsoleLogsRoutedToStderrForJson, i as withConsoleLogsRoutedToStderr, n as hasJsonOutputFlag, r as isJsonOutputModeActive } from "./json-output-mode-DmDyOE8Z.js";
import { a as closeCliResources, n as requestExitAfterOneShotOutput, s as runCliDisposer } from "./one-shot-exit-B3PJYhQA.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
import { t as normalizeWindowsArgv } from "./windows-argv-Dl7Refj1.js";
import { r as createGatewayDispatchStartupTrace, t as configureGatewayStartupTraceConsoleFormatting } from "./startup-trace-6G1pu5mk.js";
import { n as resolveCliNetworkProxyPolicy, t as resolveCliCommandPathPolicy } from "./command-path-policy-qsL6oOFz.js";
import { r as shouldSkipPluginCommandRegistration, t as isReservedNonPluginCommandRoot } from "./command-registration-policy-DMu8hUxu.js";
import { t as tryRunGatewayServiceUpdateCapabilityProbe } from "./update-capability-BtZbpy6P.js";
import { a as scanCliRootOptions, i as takeCliRootOptionValue, n as parseCliContainerArgs, t as maybeRunCliInContainer } from "./container-target-DTEOCkYF.js";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-CSylzJYw.js";
import { existsSync } from "node:fs";
import process$1 from "node:process";
import os from "node:os";
import path from "node:path";
//#region src/cli/precomputed-help.ts
const PRECOMPUTED_COMMAND_HELP_NAMES = /* @__PURE__ */ new Set([
	"browser",
	"secrets",
	"nodes"
]);
const PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"config",
	"doctor",
	"gateway",
	"models",
	"plugins",
	"sessions",
	"tasks"
]);
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set(["-V", "--version"]);
const loadRootHelpLiveConfigModule$1 = async () => await import("./root-help-live-config-3Fhl79V0.js");
const loadRootHelpMetadataModule$1 = async () => await import("./root-help-metadata-BCFFf7h3.js");
function isPrecomputedSubcommandHelpName(value) {
	return PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS.has(value);
}
function resolvePrecomputedSubcommandHelpCommand(argv) {
	const args = argv.slice(2);
	let commandName = null;
	let sawHelp = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return null;
		if (VERSION_FLAGS.has(arg)) return null;
		if (!commandName) {
			const consumed = consumeRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg.startsWith("-") || !isPrecomputedSubcommandHelpName(arg)) return null;
			commandName = arg;
			continue;
		}
		if (HELP_FLAGS.has(arg)) {
			sawHelp = true;
			continue;
		}
		return null;
	}
	return commandName && sawHelp ? commandName : null;
}
function resolvePrecomputedCommandHelpName(argv) {
	if (!isSimpleCommandHelpInvocation(argv, PRECOMPUTED_COMMAND_HELP_NAMES)) return null;
	const commandPath = getCommandPathWithRootOptions(argv, 2);
	if (commandPath.length !== 1) return null;
	const [commandName] = commandPath;
	return commandName === "browser" || commandName === "secrets" || commandName === "nodes" ? commandName : null;
}
async function tryOutputPrecomputedCommandHelp(argv, deps = {}) {
	const env = deps.env ?? process.env;
	if (env.TESTCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	const commandName = resolvePrecomputedCommandHelpName(argv);
	const subcommandName = commandName ? null : resolvePrecomputedSubcommandHelpCommand(argv);
	if (subcommandName) return (deps.outputPrecomputedSubcommandHelpText ?? (await loadRootHelpMetadataModule$1()).outputPrecomputedSubcommandHelpText)(subcommandName);
	if (!commandName) return false;
	if (commandName === "nodes") {
		if (await (deps.loadRootHelpRenderOptionsForConfigSensitivePlugins ?? (await loadRootHelpLiveConfigModule$1()).loadRootHelpRenderOptionsForConfigSensitivePlugins)(env)) return false;
	}
	if (commandName === "browser") return (deps.outputPrecomputedBrowserHelpText ?? (await loadRootHelpMetadataModule$1()).outputPrecomputedBrowserHelpText)();
	if (commandName === "secrets") return (deps.outputPrecomputedSecretsHelpText ?? (await loadRootHelpMetadataModule$1()).outputPrecomputedSecretsHelpText)();
	return (deps.outputPrecomputedNodesHelpText ?? (await loadRootHelpMetadataModule$1()).outputPrecomputedNodesHelpText)();
}
//#endregion
//#region src/cli/profile.ts
function parseCliProfileArgs(argv) {
	let profile = null;
	let sawDev = false;
	const scanned = scanCliRootOptions(argv, ({ arg, args, index, out }) => {
		if (arg === "--dev") {
			if (resolveCliArgvInvocation(out).primary === "gateway") {
				out.push(arg);
				return { kind: "handled" };
			}
			if (profile && profile !== "dev") return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			return { kind: "handled" };
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			const next = args[index + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			const [primary, secondary] = resolveCliArgvInvocation(out).commandPath;
			if (primary === "qa" && secondary === "matrix") {
				out.push(arg);
				if (consumedNext && next !== void 0) out.push(next);
				return {
					kind: "handled",
					consumedNext
				};
			}
			if (sawDev) return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			if (!value) return {
				kind: "error",
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				kind: "error",
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			return {
				kind: "handled",
				consumedNext
			};
		}
		return { kind: "pass" };
	});
	if (!scanned.ok) return scanned;
	return {
		ok: true,
		profile,
		argv: scanned.argv
	};
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	const inheritedProfile = normalizeOptionalString(env.TESTCLAW_PROFILE) ?? "default";
	const existingStateDir = normalizeOptionalString(env.TESTCLAW_STATE_DIR);
	const existingConfigPath = normalizeOptionalString(env.TESTCLAW_CONFIG_PATH);
	const profileEnv = env;
	const inheritedProfileStateDir = resolveProfileStateDir(inheritedProfile, profileEnv, homedir);
	const selectedProfileStateDir = resolveProfileStateDir(profile, profileEnv, homedir);
	const switchesInheritedProfile = inheritedProfileStateDir !== selectedProfileStateDir;
	const inheritedSystemdServiceName = resolveGatewaySystemdServiceName(inheritedProfile);
	const inheritedServiceSelectors = {
		TESTCLAW_LAUNCHD_LABEL: [resolveGatewayLaunchAgentLabel(inheritedProfile)],
		TESTCLAW_SYSTEMD_UNIT: [inheritedSystemdServiceName, `${inheritedSystemdServiceName}.service`],
		TESTCLAW_WINDOWS_TASK_NAME: [resolveGatewayWindowsTaskName(inheritedProfile)]
	};
	const switchesInheritedProfileState = Boolean(existingStateDir && switchesInheritedProfile && resolveHomeRelativePath(existingStateDir, {
		env,
		homedir
	}) === inheritedProfileStateDir);
	const replacesInheritedProfileConfig = Boolean(switchesInheritedProfile && (!existingStateDir || switchesInheritedProfileState) && existingConfigPath && resolveHomeRelativePath(existingConfigPath, {
		env,
		homedir
	}) === path.join(inheritedProfileStateDir, "testclaw.json"));
	const inheritedManagedServiceSelectors = switchesInheritedProfile && isGatewayServiceEnv(env) && switchesInheritedProfileState && replacesInheritedProfileConfig;
	if (inheritedManagedServiceSelectors) for (const key of GATEWAY_SERVICE_SELECTOR_ENV_KEYS) delete env[key];
	env.TESTCLAW_PROFILE = profile;
	const retainedStateDir = inheritedManagedServiceSelectors ? void 0 : existingStateDir;
	const stateDir = retainedStateDir && !switchesInheritedProfileState ? retainedStateDir : selectedProfileStateDir;
	if (!retainedStateDir || switchesInheritedProfileState) env.TESTCLAW_STATE_DIR = stateDir;
	if (!inheritedManagedServiceSelectors && (!existingConfigPath || replacesInheritedProfileConfig)) env.TESTCLAW_CONFIG_PATH = path.join(stateDir, "testclaw.json");
	if (switchesInheritedProfile && !inheritedManagedServiceSelectors) for (const [key, inheritedValues] of Object.entries(inheritedServiceSelectors)) {
		const activeValue = normalizeOptionalString(env[key]);
		if (activeValue && inheritedValues.includes(activeValue)) delete env[key];
	}
	if (profile === "dev" && !env.TESTCLAW_GATEWAY_PORT?.trim()) env.TESTCLAW_GATEWAY_PORT = "19001";
}
//#endregion
//#region src/cli/run-main-plugin-cache.ts
/** Executable commands own their inventory until Gateway publication adopts it. */
function withCliPluginInvocation(gatewayRun, run) {
	return withCliCommandCleanup(gatewayRun, (cleanup) => {
		if (gatewayRun) return run();
		const cache = createPluginCache();
		cleanup?.pluginResources?.adopt({ async release() {
			if (cache.kind === "operation") {
				const result = await retirePluginCache(cache);
				if (result.failures.length > 0) throw new AggregateError(result.failures.map((failure) => failure.error), "CLI plugin inventory cleanup failed");
			}
		} });
		return withPluginCache(cache, () => run(cleanup));
	});
}
//#endregion
//#region src/cli/run-main-policy.ts
const ROOT_HELP_ALIASES = /* @__PURE__ */ new Set(["tools"]);
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
const BARE_PARENT_DEFAULT_HELP_COMMANDS = /* @__PURE__ */ new Set([...getCoreCliParentDefaultHelpCommands(), ...getSubCliParentDefaultHelpCommands()]);
function isBareParentDefaultHelpArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	const [primary, extra] = invocation.commandPath;
	return !invocation.hasHelpOrVersion && primary !== void 0 && extra === void 0 ? BARE_PARENT_DEFAULT_HELP_COMMANDS.has(primary) : false;
}
function rewriteUpdateFlagArgv(argv) {
	const updateIndex = argv.indexOf("--update");
	if (updateIndex === -1) return argv;
	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg || arg === "--") return argv;
		if (i === updateIndex) {
			const next = [...argv];
			next.splice(updateIndex, 1, "update");
			return next;
		}
		const consumed = consumeRootOptionToken(argv, i);
		if (consumed > 0) {
			i += consumed - 1;
			continue;
		}
		if (!arg.startsWith("-")) return argv;
	}
	return argv;
}
function shouldEnsureCliPath(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || shouldHandleBareRoot(argv) || isBareParentDefaultHelpArgv(argv)) return false;
	return resolveCliCommandPathPolicy(invocation.commandPath).ensureCliPath;
}
function shouldUseRootHelpFastPath(argv, env = process.env) {
	const invocation = resolveCliArgvInvocation(argv);
	return env.TESTCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH !== "1" && (invocation.isRootHelpInvocation || invocation.commandPath.length === 1 && ROOT_HELP_ALIASES.has(invocation.commandPath[0] ?? "") && invocation.hasHelpOrVersion || invocation.commandPath.length === 1 && invocation.commandPath[0] === "help" && invocation.hasHelpOrVersion);
}
function shouldUseSetupOnboardConfigureHelpFastPath(argv, env = process.env) {
	if (env.TESTCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	return isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS);
}
function shouldHandleBareRoot(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.commandPath.length === 0 && !invocation.hasHelpOrVersion;
}
function shouldStartProxyForCli(argv) {
	const policyArgv = rewriteUpdateFlagArgv(argv);
	const invocation = resolveCliArgvInvocation(policyArgv);
	const [primary] = invocation.commandPath;
	if (invocation.hasHelpOrVersion || !primary) return false;
	if (isBareParentDefaultHelpArgv(policyArgv)) return false;
	return resolveCliNetworkProxyPolicy(policyArgv) === "default";
}
function resolveMissingPluginCommandMessage(pluginId, config, options) {
	const normalizedPluginId = normalizeLowercaseStringOrEmpty(pluginId);
	if (!normalizedPluginId) return null;
	const allow = Array.isArray(config?.plugins?.allow) && config.plugins.allow.length > 0 ? config.plugins.allow.filter((entry) => typeof entry === "string").map((entry) => normalizeOptionalLowercaseString(entry)).filter(Boolean) : [];
	const commandAlias = options?.resolveCommandAliasOwner?.({
		command: normalizedPluginId,
		config
	});
	const parentPluginId = commandAlias?.pluginId;
	if (parentPluginId) {
		if (allow.length > 0 && !allow.includes(parentPluginId)) {
			if (parentPluginId === normalizedPluginId) return `The \`testclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
			return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${parentPluginId}" plugin. Add "${parentPluginId}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		}
		if (config?.plugins?.entries?.[parentPluginId]?.enabled === false) return `The \`testclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${parentPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin command surface.`;
		if (commandAlias.kind !== "runtime-slash" && commandAlias.enabledByDefault !== true && config?.plugins?.entries?.[parentPluginId]?.enabled !== true) return `The \`testclaw ${normalizedPluginId}\` command is provided by the "${parentPluginId}" plugin, but that bundled plugin is disabled by default. Run \`testclaw plugins enable ${parentPluginId}\` to enable that CLI surface.`;
		if (commandAlias.kind === "runtime-slash") return `"${normalizedPluginId}" is a runtime slash command (/${normalizedPluginId}), not a CLI command. It is provided by the "${parentPluginId}" plugin. ${commandAlias.cliCommand ? `Use \`testclaw ${commandAlias.cliCommand}\` for related CLI operations, or ` : "Use "}\`/${normalizedPluginId}\` in a chat session.`;
	}
	if (isReservedNonPluginCommandRoot(normalizedPluginId)) return null;
	const toolOwner = options?.resolveToolOwner?.({
		toolName: normalizedPluginId,
		config
	});
	if (toolOwner) {
		if (config?.plugins?.entries?.[toolOwner.pluginId]?.enabled !== false && (allow.length === 0 || allow.includes(toolOwner.pluginId))) {
			if (toolOwner.availability === "manifest-only") return `"${normalizedPluginId}" may be provided by the "${toolOwner.pluginId}" plugin as an agent tool, not a CLI subcommand. Run \`testclaw --help\` to see available CLI subcommands.`;
			return `"${normalizedPluginId}" is an agent tool available from the "${toolOwner.pluginId}" plugin, not a CLI subcommand. Use it from an agent turn (model tool-use), not the CLI. Run \`testclaw --help\` to see available CLI subcommands.`;
		}
	}
	if (allow.length > 0 && !allow.includes(normalizedPluginId)) {
		if (parentPluginId && allow.includes(parentPluginId)) return null;
		const cliCommandSurfaceOwner = options?.resolveCliCommandSurfaceOwner?.({
			command: normalizedPluginId,
			config
		});
		const normalizedCliCommandSurfaceOwner = normalizeOptionalLowercaseString(cliCommandSurfaceOwner);
		if (!normalizedCliCommandSurfaceOwner) return null;
		if (allow.includes(normalizedCliCommandSurfaceOwner)) return null;
		if (normalizedCliCommandSurfaceOwner !== normalizedPluginId) return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${normalizedCliCommandSurfaceOwner}" plugin. Add "${normalizedCliCommandSurfaceOwner}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		return `The \`testclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
	}
	if (config?.plugins?.entries?.[normalizedPluginId]?.enabled === false) return `The \`testclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${normalizedPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin CLI surface.`;
	return null;
}
//#endregion
//#region src/cli/run-main.ts
const CLI_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const UNKNOWN_COMMAND_DISPLAY_LIMIT = 128;
const loadRootHelpLiveConfigModule = async () => await import("./root-help-live-config-3Fhl79V0.js");
const loadRootHelpMetadataModule = async () => await import("./root-help-metadata-BCFFf7h3.js");
const loadLoggingModule = async () => await import("./console-CDCve2DY.js");
const loadCliRegistryLoaderModule = async () => await import("./cli-registry-loader-D2ssdqAW.js");
const loadManifestCommandAliasesRuntimeModule = async () => await import("./manifest-command-aliases.runtime-6ACO2h0f.js");
const loadProxyLifecycleModule = async () => await import("./proxy-lifecycle-Dk-8BO0j.js");
const loadProgressModule = async () => await import("./progress-_TAMuiGZ.js");
function isRemoteAgentDispatchInvocation(argv, primary) {
	return primary === "agent" && !argv.includes("--local");
}
function isGatewayRunFastPathArgv(argv) {
	if (resolveCliArgvInvocation(argv).hasHelpOrVersion) return false;
	const args = argv.slice(2);
	let sawGateway = false;
	let sawRun = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return false;
		if (!sawGateway) {
			const consumed = consumeGatewayFastPathRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg !== "gateway") return false;
			sawGateway = true;
			continue;
		}
		const rootConsumed = consumeGatewayFastPathRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		const consumed = consumeGatewayRunOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!sawRun && arg === "run") {
			sawRun = true;
			continue;
		}
		return false;
	}
	return sawGateway;
}
function isGatewayRunInvocationArgv(argv) {
	const commandPath = resolveGatewayCatalogCommandPath(argv);
	return commandPath?.length === 1 || commandPath?.length === 2 && commandPath[0] === "gateway" && commandPath[1] === "run";
}
async function tryRunGatewayRunFastPath(argv, startupTrace) {
	if (!isGatewayRunFastPathArgv(argv)) return false;
	const [{ Command }, { addGatewayRunCommand }, { VERSION }, { emitCliBanner }, { ensureCliExecutionBootstrap }, { defaultRuntime }] = await startupTrace.measure("gateway-run-imports", () => Promise.all([
		import("commander"),
		import("./run-command-CSFIwiQp.js"),
		import("./version-M0RNbBAa.js"),
		import("./banner-Bp57BvK8.js"),
		import("./command-execution-startup-DlAfiL6N.js"),
		import("./runtime-CkU4itJ9.js")
	]));
	const commandPath = resolveGatewayCatalogCommandPath(argv) ?? ["gateway"];
	const startupPolicy = resolveCliStartupPolicy({
		argv,
		commandPath,
		jsonOutputMode: hasJsonOutputFlag(argv)
	});
	if (!startupPolicy.hideBanner) emitCliBanner(VERSION, { argv });
	const program = new Command();
	program.name("testclaw");
	program.enablePositionalOptions();
	program.option("--no-color", "Disable ANSI colors", false);
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const beforeRun = async (opts) => {
		let beforeStateMigrations;
		let skipPristineStartupStateMigrations = false;
		let skipPristineCoreStateMigrations = false;
		if (!await startupTrace.measure("gateway-run-pre-bootstrap", async () => {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("./pre-bootstrap-DMSqx8mb.js");
			const prepared = await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			});
			if (prepared) {
				skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
				skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
				beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
					opts,
					runtime: defaultRuntime,
					...snapshot ? { snapshot } : {}
				});
			}
			return prepared;
		})) return;
		await startupTrace.measure("gateway-run-bootstrap", async () => {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				loadPlugins: false,
				...beforeStateMigrations ? { beforeStateMigrations } : {},
				...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
				...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
			});
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-DMSqx8mb.js");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		});
	};
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway"), { beforeRun }).command("run").description("Run the WebSocket Gateway (foreground)"), { beforeRun });
	const parseArgv = normalizeRootNoColorArgvForProgram(argv, program);
	try {
		await startupTrace.measure("gateway-run-parse", () => program.parseAsync(parseArgv), { timeline: false });
	} catch (error) {
		if (!isCommanderParseExit(error)) throw error;
		process$1.exitCode = error.exitCode;
	}
	return true;
}
async function resolveBareRootLaunchTarget(argv) {
	if (!shouldHandleBareRoot(argv)) return null;
	const { readConfigFileSnapshot } = await import("./config-fCohulPn.js");
	const snapshot = await readConfigFileSnapshot();
	if (await shouldStartLocalOnboarding(snapshot)) return { kind: "onboarding" };
	if (!snapshot.valid) return {
		kind: "onboarding",
		classic: true
	};
	return resolveConfiguredTuiLaunchTarget(snapshot.config ?? snapshot.sourceConfig, { hasConfiguredGateway: snapshot.sourceConfig.gateway !== void 0 });
}
async function resolveConfiguredTuiLaunchTarget(config, options) {
	const gatewayResolution = await resolveReachableGateway(config, options);
	if (gatewayResolution.kind === "configured" || gatewayResolution.kind === "reachable-unverified" || gatewayResolution.kind === "configured-unreachable") {
		const gateway = gatewayResolution.gateway;
		const target = {
			kind: "tui",
			local: false,
			config,
			gatewayUrl: gateway.url
		};
		if (gateway.token) target.token = gateway.token;
		if (gateway.password) target.password = gateway.password;
		if (gateway.tlsFingerprint) target.tlsFingerprint = gateway.tlsFingerprint;
		return target;
	}
	if (gatewayResolution.kind === "missing-configured-model") {
		if (gatewayResolution.gateway.remote) return {
			kind: "remote-gateway-inference",
			target: {
				config,
				gatewayUrl: gatewayResolution.gateway.url,
				...gatewayResolution.gateway.token ? { token: gatewayResolution.gateway.token } : {},
				...gatewayResolution.gateway.password ? { password: gatewayResolution.gateway.password } : {},
				...gatewayResolution.gateway.tlsFingerprint ? { tlsFingerprint: gatewayResolution.gateway.tlsFingerprint } : {}
			}
		};
		return { kind: "onboarding" };
	}
	const { listAgentIds, resolveAgentEffectiveModelPrimary } = await import("./agent-scope-BM4mAou3.js");
	if (!listAgentIds(config).some((agentId) => resolveAgentEffectiveModelPrimary(config, agentId))) return { kind: "onboarding" };
	return {
		kind: "tui",
		local: true
	};
}
function toReachableGateway(target, auth) {
	return {
		url: target.url,
		remote: target.scope === "remote",
		...auth.token ? { token: auth.token } : {},
		...auth.password ? { password: auth.password } : {},
		...target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}
	};
}
async function resolveReachableGateway(config, options) {
	const { targets, auth } = await resolveGatewayProbePlan(config);
	if (targets.length === 0) return { kind: "unreachable" };
	const { probeGatewayConfiguredModel } = await import("./onboard-helpers-Bfj0vknI.js");
	let missingModelGateway;
	let reachableUnverifiedGateway;
	let configuredGateway;
	for (const target of targets) {
		if (!isSafeGatewayProbeTarget(target)) continue;
		if (options.hasConfiguredGateway && !configuredGateway) configuredGateway = toReachableGateway(target, auth);
		const probeOptions = {
			url: target.url,
			...target.scope === "remote" ? { originScopedDeviceAuth: true } : {}
		};
		if (config.gateway?.remote?.edgeAuth) probeOptions.config = config;
		if (auth.token) probeOptions.token = auth.token;
		if (auth.password) probeOptions.password = auth.password;
		if (target.tlsFingerprint) probeOptions.tlsFingerprint = target.tlsFingerprint;
		if (target.preauthHandshakeTimeoutMs) probeOptions.preauthHandshakeTimeoutMs = target.preauthHandshakeTimeoutMs;
		const probe = await probeGatewayConfiguredModel(probeOptions);
		if (probe.kind === "configured") return {
			kind: "configured",
			gateway: toReachableGateway(target, auth)
		};
		if (probe.kind === "missing-configured-model") {
			missingModelGateway ??= toReachableGateway(target, auth);
			continue;
		}
		if (probe.kind === "reachable-unverified" && !reachableUnverifiedGateway) reachableUnverifiedGateway = toReachableGateway(target, auth);
	}
	if (missingModelGateway) return {
		kind: "missing-configured-model",
		gateway: missingModelGateway
	};
	if (reachableUnverifiedGateway) return {
		kind: "reachable-unverified",
		gateway: reachableUnverifiedGateway
	};
	if (configuredGateway) return {
		kind: "configured-unreachable",
		gateway: configuredGateway
	};
	return { kind: "unreachable" };
}
async function resolveGatewayProbePlan(config) {
	const remoteUrl = normalizeOptionalString(config.gateway?.remote?.url);
	if (normalizeOptionalString(config.gateway?.mode) === "remote" && remoteUrl) try {
		const { resolveGatewayClientBootstrap } = await import("./client-bootstrap-DL4cgFH6.js");
		const bootstrap = await resolveGatewayClientBootstrap({
			config,
			authPolicy: "probe",
			modeOverride: "remote",
			ignoreEnvUrlOverride: true
		});
		return {
			targets: [{
				url: bootstrap.url,
				scope: "remote",
				...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
			}],
			auth: bootstrap.auth
		};
	} catch {
		return {
			targets: [],
			auth: {}
		};
	}
	return resolveLocalGatewayProbeTargets(config);
}
function isSafeGatewayProbeTarget(target) {
	if (target.scope === "remote") return isSafeRemoteGatewayProbeUrl(target.url);
	return isSecureWebSocketUrl(target.url, { allowPrivateWs: process$1.env.TESTCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" });
}
function isSafeRemoteGatewayProbeUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackGatewayHost(parsed.hostname)) return true;
	return process$1.env.TESTCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" && isSecureWebSocketUrl(url, { allowPrivateWs: true });
}
function isLoopbackGatewayHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/\.+$/, "");
	if (normalized === "localhost") return true;
	const hostForIpCheck = normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized;
	return isLoopbackAddress(hostForIpCheck);
}
async function resolveLocalGatewayProbeTargets(config) {
	const [{ resolveControlUiLinks }, { resolveGatewayClientBootstrap }, { readActiveGatewayLockPort }] = await Promise.all([
		import("./control-ui-links-DBW_r-li.js"),
		import("./client-bootstrap-DL4cgFH6.js"),
		import("./gateway-lock-BPN_Sbg-.js")
	]);
	const gateway = config.gateway;
	const configuredPort = resolveGatewayPort(config);
	const port = (Boolean(normalizeOptionalString(process$1.env.TESTCLAW_GATEWAY_PORT)) ? void 0 : await readActiveGatewayLockPort()) ?? configuredPort;
	const connection = await resolveGatewayClientBootstrap({
		config,
		authPolicy: "probe",
		modeOverride: "local",
		ignoreEnvUrlOverride: true,
		localPortOverride: port
	});
	const baseParams = {
		port,
		basePath: gateway?.controlUi?.basePath,
		tlsEnabled: gateway?.tls?.enabled === true
	};
	const sharedTarget = {
		...connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {},
		...connection.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs } : {}
	};
	const loopbackTarget = {
		...sharedTarget,
		url: connection.url,
		scope: "local-loopback"
	};
	const bind = gateway?.bind;
	if (bind !== "tailnet" && bind !== "custom") return {
		targets: [loopbackTarget],
		auth: connection.auth
	};
	const configuredLinks = resolveControlUiLinks({
		...baseParams,
		bind,
		customBindHost: gateway?.customBindHost
	});
	return {
		targets: configuredLinks.wsUrl === connection.url ? [loopbackTarget] : [loopbackTarget, {
			...sharedTarget,
			url: configuredLinks.wsUrl,
			scope: "local-configured"
		}],
		auth: connection.auth
	};
}
function pauseNonTtyStdinForCliExit() {
	const stdin = process$1.stdin;
	if (stdin.isTTY) return;
	try {
		stdin.pause();
	} catch {}
}
function shouldLoadCliDotEnv(loadGlobalEnv, env = process$1.env) {
	const cwd = tryProcessCwd();
	if (cwd && existsSync(path.join(cwd, ".env"))) return true;
	return loadGlobalEnv && existsSync(path.join(resolveStateDir(env), ".env"));
}
function isAgentExecInvocation(commandPath) {
	return commandPath[0] === "agent" && commandPath[1] === "exec";
}
function isCommanderParseExit(error) {
	if (!error || typeof error !== "object") return false;
	const candidate = error;
	return typeof candidate.exitCode === "number" && Number.isInteger(candidate.exitCode) && typeof candidate.code === "string" && candidate.code.startsWith("commander.");
}
function findCommandOption(command, token) {
	const equalsIndex = token.indexOf("=");
	const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
	return command.options.find((option) => option.long === flag || option.short === flag);
}
function findSubcommand(command, name) {
	return command.commands.find((subcommand) => subcommand.name() === name || subcommand.aliases().includes(name));
}
function shouldOptionConsumeFollowingToken(option, token, next) {
	if (!option || token.includes("=")) return false;
	if (option.required) return true;
	return option.optional && isValueToken(next);
}
function resolveRootOptionRole(program, remainingArgs, optionIndex) {
	let command = program;
	let pendingValue = false;
	for (let index = 0; index < optionIndex; index += 1) {
		const arg = remainingArgs[index];
		if (!arg || arg === "--") return "root";
		if (pendingValue) {
			pendingValue = false;
			continue;
		}
		if (arg.startsWith("-")) {
			const option = findCommandOption(command, arg);
			if (!option && index === optionIndex - 1 && !arg.includes("=")) return "value";
			pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
			continue;
		}
		command = findSubcommand(command, arg) ?? command;
	}
	if (pendingValue) return "value";
	const arg = remainingArgs[optionIndex];
	return command !== program && arg !== void 0 && findCommandOption(command, arg) !== void 0 ? "command" : "root";
}
function normalizeRootNoColorArgvForProgram(argv, program) {
	return normalizeRootNoColorArgv(argv, { shouldPreserveNoColor: ({ remainingArgs, noColorIndex }) => resolveRootOptionRole(program, remainingArgs, noColorIndex) === "value" });
}
function normalizeRootLogLevelArgvForProgram(argv, program) {
	return normalizeRootLogLevelArgv(argv, { shouldPreserveLogLevel: ({ remainingArgs, logLevelIndex }) => resolveRootOptionRole(program, remainingArgs, logLevelIndex) !== "root" });
}
async function ensureCliEnvProxyDispatcher() {
	try {
		const { hasEnvHttpProxyAgentConfigured } = await import("./proxy-env-CIM9p868.js");
		if (!hasEnvHttpProxyAgentConfigured()) return;
		const { ensureGlobalUndiciEnvProxyDispatcher } = await import("./undici-global-dispatcher-CODZMq0f.js");
		ensureGlobalUndiciEnvProxyDispatcher();
	} catch {}
}
function isDebugProxyCaptureEnvEnabled(env = process$1.env) {
	return isTruthyEnvValue(env.TESTCLAW_DEBUG_PROXY_ENABLED) || isTruthyEnvValue(env.TESTCLAW_DEBUG_PROXY_REQUIRE);
}
function shouldBootstrapCliProxyBeforeFastPath(env = process$1.env) {
	if (isDebugProxyCaptureEnvEnabled(env)) return true;
	return CLI_PROXY_ENV_KEYS.some((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function isKnownBuiltInCommandRoot(primary) {
	return getCoreCliCommandNamesCore().includes(primary) || getSubCliEntriesCore().some((entry) => entry.name === primary);
}
function resolvesMachineOutput(descriptor, argv) {
	return descriptor.machineOutput?.({
		argv,
		stdoutIsTTY: isMachineOutputStdoutTTY()
	}) ?? false;
}
function resolveBuiltInMachineOutput(argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	if (!primary) return false;
	const descriptor = [...getCoreCliCommandDescriptors(), ...getSubCliEntriesCore()].find((entry) => entry.name === primary);
	return descriptor ? resolvesMachineOutput(descriptor, argv) : false;
}
async function resolvePluginMachineOutput(params) {
	const { primary } = resolveCliArgvInvocation(params.argv);
	if (!primary || isKnownBuiltInCommandRoot(primary)) return false;
	const { loadPluginCliDescriptors } = await loadCliRegistryLoaderModule();
	const descriptor = (await loadPluginCliDescriptors({
		cfg: params.config,
		env: process$1.env,
		primaryCommand: primary,
		session: params.session
	})).find((entry) => entry.name === primary);
	const resolveOutput = () => descriptor ? resolvesMachineOutput(descriptor, params.argv) : false;
	return params.session ? params.session.withCache(resolveOutput) : resolveOutput();
}
async function isPluginCliRoot(params) {
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		const ownerIds = await resolvePluginCliRootOwnerIds({
			cfg: params.config,
			env: process$1.env,
			primaryCommand: params.primary,
			session: params.session
		});
		return ownerIds === null ? null : ownerIds.length > 0;
	} catch {
		return null;
	}
}
function createAllowlistAgnosticCliLookupConfig(config) {
	if (!Array.isArray(config.plugins?.allow) || config.plugins.allow.length === 0) return config;
	return {
		...config,
		plugins: {
			...config.plugins,
			allow: []
		}
	};
}
async function resolveCliCommandSurfaceOwner(params) {
	const { resolveManifestCliCommandSurfaceOwner } = await loadManifestCommandAliasesRuntimeModule();
	const manifestOwner = resolveManifestCliCommandSurfaceOwner({
		command: params.primary,
		config: params.config,
		env: process$1.env
	});
	if (manifestOwner) return manifestOwner;
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		return (await resolvePluginCliRootOwnerIds({
			cfg: createAllowlistAgnosticCliLookupConfig(params.config),
			env: process$1.env,
			primaryCommand: params.primary
		}))?.[0];
	} catch {
		return;
	}
}
function resolveUnownedCliPrimaryCandidate(argv) {
	const { primary } = resolveCliArgvInvocation(rewriteUpdateFlagArgv(argv));
	if (!primary || primary === "help" || isReservedNonPluginCommandRoot(primary) || isKnownBuiltInCommandRoot(primary)) return null;
	return primary;
}
async function resolveUnownedCliPrimary(params) {
	const primary = resolveUnownedCliPrimaryCandidate(params.argv);
	if (!primary) return null;
	if (await isPluginCliRoot({
		primary,
		config: params.config,
		session: params.session
	}) !== false) return null;
	return primary;
}
async function resolveUnownedCliPrimaryError(params) {
	const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
	const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
	const pluginPolicyMessage = resolveMissingPluginCommandMessage(params.primary, params.config, {
		resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
		resolveToolOwner: resolveManifestToolOwner,
		resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
	});
	if (pluginPolicyMessage) return await createExpectedPluginPolicyError(pluginPolicyMessage);
	const sanitizedPrimary = sanitizeTerminalText(params.primary);
	const displayPrimary = sanitizedPrimary.length <= UNKNOWN_COMMAND_DISPLAY_LIMIT ? sanitizedPrimary : `${truncateUtf16Safe(sanitizedPrimary, 127)}…`;
	const { createCliUnknownCommandError } = await import("./error-output-CUj43SaG.js");
	return createCliUnknownCommandError(displayPrimary, {
		argv: params.argv,
		...displayPrimary === params.primary ? {} : { commandNames: [] }
	});
}
async function createExpectedPluginPolicyError(message) {
	const { ExpectedCliError } = await import("./failure-output-2IHf1cPf.js");
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, options = {}) {
	if (isDebugProxyCaptureEnvEnabled()) {
		const [{ initializeDebugProxyCapture, finalizeDebugProxyCapture }, { maybeWarnAboutDebugProxyCoverage }] = await startupTrace.measure("proxy-imports", () => Promise.all([import("./runtime-Cll3GO4O.js"), import("./coverage-BBVjsoTc.js")]));
		initializeDebugProxyCapture("cli");
		process$1.once("exit", () => {
			finalizeDebugProxyCapture();
		});
		maybeWarnAboutDebugProxyCoverage(void 0, (message) => console.warn(message));
	}
	if (options.ensureDispatcher !== false) await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
}
async function runCli(argv = process$1.argv, options = {}) {
	const runtimeRecoveryEnv = options.runtimeRecoveryEnv ?? { ...process$1.env };
	const originalArgv = normalizeWindowsArgv(argv);
	const builtInMachineOutput = resolveBuiltInMachineOutput(originalArgv);
	return await withConsoleLogsRoutedToStderrForJson(originalArgv, () => {
		const run = async (harnessCleanup) => {
			try {
				return await runCliWithPreparedOutputMode(originalArgv, {
					...options,
					runtimeRecoveryEnv,
					builtInMachineOutput,
					harnessCleanup
				});
			} catch (error) {
				if (isGatewayRunInvocationArgv(originalArgv) && !resolveCliArgvInvocation(originalArgv).hasHelpOrVersion) {
					const { handleGatewayStartupMaintenance } = await import("./startup-maintenance-D1EQGBiJ.js");
					if (await handleGatewayStartupMaintenance(error)) return;
				}
				throw error;
			} finally {
				const resources = harnessCleanup?.pluginResources;
				if (resources) {
					await runCliDisposer("plugin-registration-resources", async () => {
						try {
							await resources.release();
						} catch (error) {
							console.error(`Plugin CLI resource disposal failed: ${String(error)}`);
							throw error;
						}
					});
					pauseNonTtyStdinForCliExit();
				}
			}
		};
		return withCliPluginInvocation(isGatewayRunInvocationArgv(originalArgv), run);
	}, {
		machineOutput: builtInMachineOutput,
		restoreChanges: true,
		retainRoutingUntilProcessExit: options.retainConsoleRoutingUntilProcessExit
	});
}
async function runCliWithPreparedOutputMode(originalArgv, options) {
	const startupTrace = createGatewayDispatchStartupTrace(originalArgv, "cli.main");
	const earlyProfile = parseCliProfileArgs(originalArgv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	let consoleCaptureInstalled = false;
	const installConsoleCapture = async () => {
		if (consoleCaptureInstalled) return;
		const { enableConsoleCapture } = await loadLoggingModule();
		enableConsoleCapture();
		consoleCaptureInstalled = true;
	};
	const configureStartupTraces = async () => {
		await configureGatewayStartupTraceConsoleFormatting(startupTrace);
		if (options.additionalStartupTrace) await configureGatewayStartupTraceConsoleFormatting(options.additionalStartupTrace);
	};
	const parsedContainer = parseCliContainerArgs(originalArgv);
	if (!parsedContainer.ok) {
		await installConsoleCapture();
		await configureStartupTraces();
		throw new Error(parsedContainer.error);
	}
	const parsedProfile = parseCliProfileArgs(parsedContainer.argv);
	const containerTargetName = parsedContainer.container ?? normalizeOptionalString(process$1.env.TESTCLAW_CONTAINER) ?? null;
	const hasPreHelpValidationError = !parsedProfile.ok || containerTargetName !== null && parsedProfile.profile !== null;
	if (!originalInvocation.hasHelpOrVersion || containerTargetName !== null || hasPreHelpValidationError) await installConsoleCapture();
	if (!parsedProfile.ok) {
		await configureStartupTraces();
		throw new Error(parsedProfile.error);
	}
	if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
	if (containerTargetName && parsedProfile.profile) {
		await configureStartupTraces();
		throw new Error("--container cannot be combined with --profile/--dev");
	}
	let containerTarget;
	try {
		containerTarget = maybeRunCliInContainer(originalArgv);
	} catch (error) {
		await configureStartupTraces();
		throw error;
	}
	if (containerTarget.handled) {
		await configureStartupTraces();
		if (containerTarget.exitCode !== 0) process$1.exitCode = containerTarget.exitCode;
		return;
	}
	const normalizedArgv = rewriteUpdateFlagArgv(normalizeRootHelpTargetArgv(normalizeRootNoColorArgv(parsedProfile.argv)));
	const normalizedInvocation = resolveCliArgvInvocation(normalizedArgv);
	const isHelpOrVersionInvocation = normalizedInvocation.hasHelpOrVersion;
	const isGatewayRunInvocation = isGatewayRunInvocationArgv(normalizedArgv);
	const isDatabaseInvocation = normalizedInvocation.commandPath[0] === "database";
	const loadGlobalEnv = !isGatewayRunInvocation;
	startupTrace.mark("argv");
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("./runtime-guard-BZkm_6Rt.js");
	await assertSupportedRuntime(void 0, void 0, normalizedArgv, true, options.runtimeRecoveryEnv);
	if (await tryRunGatewayServiceUpdateCapabilityProbe(normalizedArgv)) return;
	if (!isHelpOrVersionInvocation && !isDatabaseInvocation && !isAgentExecInvocation(normalizedInvocation.commandPath) && shouldLoadCliDotEnv(loadGlobalEnv)) await startupTrace.measure("dotenv", async () => {
		if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
			const { loadGatewayDispatchCliDotEnv } = await import("./gateway-dispatch-dotenv-CE-tD6e8.js");
			await loadGatewayDispatchCliDotEnv({ quiet: true });
		} else {
			const { loadCliDotEnv } = await import("./dotenv-Bxg-PUHy.js");
			loadCliDotEnv({
				loadGlobalEnv,
				quiet: true
			});
		}
	});
	let doctorDatabasePreflight;
	if (!isHelpOrVersionInvocation && normalizedInvocation.primary === "doctor") {
		const { preflightUpdateDoctorCli } = await import("./doctor-update-schema-guard-BxI-VOeU.js");
		doctorDatabasePreflight = await preflightUpdateDoctorCli({ json: options.builtInMachineOutput });
	}
	await configureStartupTraces();
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) await startupTrace.measure("gateway-run-select-environment", async () => {
		const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([import("./pre-bootstrap-DMSqx8mb.js"), import("./runtime-CkU4itJ9.js")]);
		await selectGatewayRunEnvironment({
			opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
			runtime: defaultRuntime
		});
	});
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) {
		const { ensureAssistantCliOnPath } = await import("./path-env-DVhYllz4.js");
		ensureAssistantCliOnPath();
	}
	const mayContainBareSessionUrl = normalizedArgv.slice(2).some((arg) => arg.includes("://"));
	const bareSessionInvocation = !isHelpOrVersionInvocation && mayContainBareSessionUrl ? (await import("./session-ref-ByGSfGDh.js")).parseBareSessionInvocation(normalizedArgv) : null;
	let proxyHandle = null;
	let proxyStopPromise;
	let onSigterm = null;
	let onSigint = null;
	let onExit = null;
	let unregisterProxySignalExitBarrier = null;
	let bestEffortConfigPromise = null;
	let pluginCliSession;
	const getPluginCliSession = async () => {
		pluginCliSession ??= (await loadCliRegistryLoaderModule()).createPluginCliLoadSession(getPluginCache());
		return pluginCliSession;
	};
	const isolateProxyConfigEnv = isGatewayRunInvocation;
	const bestEffortConfigStartupPolicy = resolveCliStartupPolicy({
		argv: normalizedArgv,
		commandPath: normalizedInvocation.commandPath,
		jsonOutputMode: options.builtInMachineOutput || hasJsonOutputFlag(normalizedArgv),
		env: process$1.env
	});
	const useSourceOnlyBestEffortConfig = !await isCurrentRuntimeSupported() || normalizedInvocation.primary === "update" || normalizedInvocation.primary === "doctor";
	const readBestEffortCliConfig = async () => {
		if (!bestEffortConfigPromise) bestEffortConfigPromise = import("./io-CYktO81x.js").then(async (configIo) => {
			if (useSourceOnlyBestEffortConfig) return configIo.readSourceConfigBestEffort();
			const readOptions = {
				observe: false,
				...isolateProxyConfigEnv ? { isolateEnv: true } : {},
				...bestEffortConfigStartupPolicy.validateConfigOnly || isGatewayRunInvocation ? { pluginValidation: "core-only" } : { skipPluginValidation: true }
			};
			if (!resolveUnownedCliPrimaryCandidate(normalizedArgv)) return configIo.readBestEffortConfig(readOptions);
			const snapshot = await (await getPluginCliSession()).readConfig(() => configIo.readBestEffortConfigSnapshot(readOptions));
			if (snapshot.configDiagnostics) {
				const { path: configPath, issues } = snapshot.configDiagnostics;
				throw createInvalidConfigError(configPath, formatInvalidConfigDetails(issues));
			}
			return snapshot.config;
		});
		return await bestEffortConfigPromise;
	};
	const uninstallProxySignalHandlers = () => {
		if (onSigterm) {
			process$1.off("SIGTERM", onSigterm);
			onSigterm = null;
		}
		if (onSigint) {
			process$1.off("SIGINT", onSigint);
			onSigint = null;
		}
		if (onExit) {
			process$1.off("exit", onExit);
			onExit = null;
		}
	};
	const stopStartedProxy = () => {
		if (proxyStopPromise) return proxyStopPromise;
		unregisterProxySignalExitBarrier?.();
		unregisterProxySignalExitBarrier = null;
		uninstallProxySignalHandlers();
		const handle = proxyHandle;
		proxyHandle = null;
		const stop = async () => {
			if (handle) {
				const { stopProxy } = await loadProxyLifecycleModule();
				await stopProxy(handle);
			}
		};
		const resources = options.harnessCleanup?.pluginResources;
		proxyStopPromise = Promise.resolve().then(() => resources ? resources.runCleanup(stop) : stop());
		return proxyStopPromise;
	};
	const killStartedProxy = () => {
		const handle = proxyHandle;
		proxyHandle = null;
		handle?.kill("SIGTERM");
	};
	const installProxySignalHandlers = () => {
		if (!proxyHandle || onSigterm || onSigint || onExit) return;
		unregisterProxySignalExitBarrier = registerSignalExitBarrier(stopStartedProxy);
		const shutdown = (exitCode) => {
			waitForSignalExitBarriers().finally(() => {
				process$1.exit(exitCode);
			});
		};
		onSigterm = () => shutdown(143);
		onSigint = () => shutdown(130);
		onExit = () => killStartedProxy();
		process$1.once("SIGTERM", onSigterm);
		process$1.once("SIGINT", onSigint);
		process$1.once("exit", onExit);
	};
	const replaceStartedProxy = async (config) => {
		await stopStartedProxy();
		const { startProxy } = await loadProxyLifecycleModule();
		proxyHandle = await startProxy(config);
		proxyStopPromise = void 0;
		installProxySignalHandlers();
	};
	let uninstallGatewayRunRuntimeHooks = null;
	let unhandledRejectionHandlerInstalled = false;
	try {
		const startupTraces = [startupTrace, options.additionalStartupTrace].filter((trace) => Boolean(trace));
		if (!isDatabaseInvocation && (await Promise.all(startupTraces.map((trace) => trace.requiresDiagnosticsConfig()))).some(Boolean)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			await Promise.all(startupTraces.map((trace) => trace.configureDiagnosticsTimeline(config)));
		}
		if (!isHelpOrVersionInvocation && !bareSessionInvocation && normalizedInvocation.primary && !isKnownBuiltInCommandRoot(normalizedInvocation.primary)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (await withConsoleLogsRoutedToStderr(() => resolvePluginMachineOutput({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			}))) {
				const { routeLogsToStderr } = await loadLoggingModule();
				routeLogsToStderr();
			}
		}
		if (!isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (!bareSessionInvocation) {
				const unownedPrimary = await resolveUnownedCliPrimary({
					argv: normalizedArgv,
					config,
					session: pluginCliSession
				});
				if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
					argv: normalizedArgv,
					primary: unownedPrimary,
					config
				});
			}
			await replaceStartedProxy(config?.proxy ?? void 0);
		}
		if (!isHelpOrVersionInvocation && isGatewayRunInvocation) {
			const { installGatewayRunRuntimeHooks } = await import("./runtime-hooks-DrZePdac.js");
			uninstallGatewayRunRuntimeHooks = installGatewayRunRuntimeHooks({
				releaseManagedProxy: stopStartedProxy,
				refreshManagedProxy: replaceStartedProxy
			});
		}
		if (shouldUseRootHelpFastPath(normalizedArgv)) {
			const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await loadRootHelpLiveConfigModule();
			const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(process$1.env);
			if (!liveRootHelpOptions) {
				const { outputPrecomputedRootHelpText } = await loadRootHelpMetadataModule();
				if (outputPrecomputedRootHelpText()) return;
			}
			const { outputRootHelp } = await import("./root-help-D3D48gBB.js");
			await outputRootHelp(liveRootHelpOptions ?? void 0);
			return;
		}
		if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
		if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
			const { tryOutputSetupOnboardConfigureHelp } = await import("./setup-onboard-configure-help-fast-path-DvfvaH_6.js");
			if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
		}
		await installConsoleCapture();
		if (bareSessionInvocation) {
			if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
				console.error("Assistant TUI needs an interactive TTY. Use `testclaw agent --local ...` for automation.");
				process$1.exitCode = 1;
				return;
			}
			const { runTuiCliAction } = await import("./tui-cli-D9xsFPWL.js");
			await runTuiCliAction(bareSessionInvocation.target, bareSessionInvocation.options);
			return;
		}
		if (resolveUnownedCliPrimaryCandidate(normalizedArgv)) {
			const config = await readBestEffortCliConfig();
			const unownedPrimary = await resolveUnownedCliPrimary({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			});
			if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
				argv: normalizedArgv,
				primary: unownedPrimary,
				config
			});
		}
		const shouldRunBareRootCommand = shouldHandleBareRoot(normalizedArgv);
		if (shouldRunBareRootCommand) await ensureCliEnvProxyDispatcher();
		const bareRootLaunchTarget = shouldRunBareRootCommand ? await resolveBareRootLaunchTarget(normalizedArgv) : null;
		if (bareRootLaunchTarget) {
			if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("Remote Gateway inference setup needs an interactive TTY. Re-run `testclaw` in a terminal connected to this Gateway.");
					process$1.exitCode = 1;
					return;
				}
				const { runRemoteGatewayInferenceOnboarding } = await import("./onboard-remote-gateway-MSivX7eh.js");
				await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
				return;
			}
			if (bareRootLaunchTarget.kind === "onboarding") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error(bareRootLaunchTarget.classic ? "Assistant config is invalid. Run `testclaw doctor --fix` before onboarding." : "Onboarding needs an interactive TTY. Use `testclaw onboard --non-interactive --accept-risk ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { setupWizardCommand } = await import("./onboard-GNTfRdl-.js");
				await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
				return;
			}
			if (bareRootLaunchTarget.kind === "tui") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("Assistant TUI needs an interactive TTY. Use `testclaw agent --local ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { runTui } = await import("./tui-bWd0Ez5E.js");
				await runTui({
					...bareRootLaunchTarget.local ? {
						deliver: false,
						local: true
					} : {
						deliver: false,
						config: bareRootLaunchTarget.config,
						boundGateway: {
							url: bareRootLaunchTarget.gatewayUrl,
							...bareRootLaunchTarget.token ? { token: bareRootLaunchTarget.token } : {},
							...bareRootLaunchTarget.password ? { password: bareRootLaunchTarget.password } : {},
							...bareRootLaunchTarget.tlsFingerprint ? { tlsFingerprint: bareRootLaunchTarget.tlsFingerprint } : {}
						}
					},
					forceProcessExitOnReturn: true
				});
				return;
			}
		}
		const shouldUseCliEnvProxy = !isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv);
		const bootstrapProxyBeforeFastPath = shouldUseCliEnvProxy && shouldBootstrapCliProxyBeforeFastPath();
		if (isGatewayRunFastPathArgv(normalizedArgv)) {
			const { installUnhandledRejectionHandler } = await startupTrace.measure("unhandled-rejection-handler-import", () => import("./unhandled-rejections-D5CV54NP.js"));
			installUnhandledRejectionHandler();
			unhandledRejectionHandlerInstalled = true;
		}
		if (!bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation && !isDatabaseInvocation) await bootstrapCliProxyCaptureAndDispatcher(startupTrace, { ensureDispatcher: shouldUseCliEnvProxy });
		if (bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation) {
			const route = await startupTrace.measure("route-import", () => import("./route-CVlINRb2.js"));
			if (await startupTrace.measure("route", () => options.builtInMachineOutput ? route.tryRouteCli(normalizedArgv, { machineOutput: true }) : route.tryRouteCli(normalizedArgv), { timeline: false })) return;
		}
		let parseArgv = normalizeGeneratedHelpCommandArgv(normalizedArgv);
		const suppressStartupProgress = options.builtInMachineOutput || hasJsonOutputFlag(parseArgv);
		const { createCliProgress } = await loadProgressModule();
		const startupProgress = createCliProgress({
			label: "Loading Assistant CLI…",
			indeterminate: true,
			delayMs: 0,
			...suppressStartupProgress ? { enabled: false } : {}
		});
		let startupProgressStopped = false;
		const stopStartupProgress = () => {
			if (startupProgressStopped) return;
			startupProgressStopped = true;
			startupProgress.done();
		};
		try {
			const [{ buildProgram }, { formatUncaughtError }, { formatCliFailureLines, formatCliJsonFailure }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }, { defaultRuntime, restoreRuntimeTerminalState }] = await startupTrace.measure("core-imports", () => Promise.all([
				import("./program-jMHdG5W5.js"),
				import("./errors-DP1KnB17.js"),
				import("./failure-output-2IHf1cPf.js"),
				import("./fatal-error-hooks-DMH8gY71.js"),
				import("./unhandled-rejections-D5CV54NP.js"),
				import("./runtime-CkU4itJ9.js")
			]));
			const program = await startupTrace.measure("build-program", () => buildProgram({
				doctorDatabasePreflight,
				runtimeRecoveryEnv: options.runtimeRecoveryEnv
			}));
			await options.harnessCleanup?.pluginResources?.waitForRegistrations();
			if (!unhandledRejectionHandlerInstalled) installUnhandledRejectionHandler();
			process$1.on("uncaughtException", (error) => {
				if (isUncaughtExceptionHandled(error)) return;
				if (isBenignUncaughtExceptionError(error)) {
					console.warn("[testclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
					return;
				}
				if (isJsonOutputModeActive(normalizedArgv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
				for (const line of formatCliFailureLines({
					title: "Assistant hit an unexpected runtime error.",
					error,
					argv: normalizedArgv
				})) console.error(line);
				for (const message of runFatalErrorHooks({
					reason: "uncaught_exception",
					error
				})) console.error("[testclaw]", message);
				restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
				process$1.exit(1);
			});
			const invocation = resolveCliArgvInvocation(parseArgv);
			const { primary } = invocation;
			if (primary) await startupTrace.measure("register-primary", async () => {
				const { getProgramContext } = await import("./program-context-0cEmCohB.js");
				const ctx = getProgramContext(program);
				if (ctx) {
					const { registerCoreCliByName } = await import("./command-registry-DxIAEM9F.js");
					await registerCoreCliByName(program, ctx, primary);
				}
				const { registerSubCliByName } = await import("./register.subclis-BMiCItIe.js");
				await registerSubCliByName(program, primary, parseArgv);
			});
			const hasBuiltinPrimary = primary !== null && program.commands.some((command) => command.name() === primary || command.aliases().includes(primary));
			if (!shouldSkipPluginCommandRegistration({
				argv: parseArgv,
				primary,
				hasBuiltinPrimary
			})) {
				const config = await startupTrace.measure("register-plugin-commands", async () => {
					const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-BlRVi66K.js");
					const startupPolicy = resolveCliStartupPolicy({
						argv: parseArgv,
						commandPath: invocation.commandPath,
						jsonOutputMode: suppressStartupProgress
					});
					return await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
						mode: "lazy",
						primary,
						skipPluginValidation: startupPolicy.skipConfigGuard,
						session: await getPluginCliSession()
					});
				});
				if (primary && !program.commands.some((command) => command.name() === primary || command.aliases().includes(primary))) {
					const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
					const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner({
						primary,
						config
					});
					const missingPluginCommandMessage = resolveMissingPluginCommandMessage(primary, config, {
						resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
						resolveToolOwner: resolveManifestToolOwner,
						resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
					});
					if (missingPluginCommandMessage) throw await createExpectedPluginPolicyError(missingPluginCommandMessage);
				}
			}
			parseArgv = normalizeRootLogLevelArgvForProgram(normalizeRootNoColorArgvForProgram(parseArgv, program), program);
			stopStartupProgress();
			let completedHelpOrVersion = false;
			try {
				const resources = options.harnessCleanup?.pluginResources;
				await resources?.waitForRegistrations();
				pluginCliSession?.close();
				const parse = () => startupTrace.measure("parse", () => program.parseAsync(parseArgv), { timeline: false });
				await (resources ? resources.run(parse) : parse());
				await resources?.waitForRegistrations();
				completedHelpOrVersion = isHelpOrVersionInvocation;
			} catch (error) {
				if (!isCommanderParseExit(error)) throw error;
				if (isJsonOutputModeActive(parseArgv) && error.exitCode !== 0) throw error;
				process$1.exitCode = error.exitCode;
				completedHelpOrVersion = isHelpOrVersionInvocation && error.exitCode === 0;
			}
			if (completedHelpOrVersion) requestExitAfterOneShotOutput();
		} finally {
			stopStartupProgress();
		}
	} finally {
		pluginCliSession?.close();
		uninstallGatewayRunRuntimeHooks?.();
		const resources = options.harnessCleanup?.pluginResources;
		await runCliDisposer("managed-proxy", stopStartedProxy, resources?.runCleanup);
		await closeCliResources(options.harnessCleanup);
		if (!resources) pauseNonTtyStdinForCliExit();
	}
}
//#endregion
export { runCli };
