import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-_nFH9T9d.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { r as theme } from "./theme-DLJw9KCD.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-B2-iW6Co.js";
import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { T as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import "./agent-scope-BiRi-Smp.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import { a as transformConfigFile } from "./mutate-CFZDg_sD.js";
import "./config-CiBXBfE2.js";
import { t as setSafeTimeout } from "./timer-delay-Rn6cuteb.js";
import { n as loadGatewayStartupPluginPlanWithMetadata } from "./gateway-startup-plugin-loader-JMYqALcD.js";
import "./channel-plugin-ids-Dx2OaRnh.js";
import { r as resolveHookEntries } from "./policy-CborS2Xj.js";
import { t as loadWorkspaceHookEntries } from "./workspace-cv0iCWyR.js";
import { s as withPluginDiagnosticsReport } from "./status-CzhzPQAa.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-u16wtyJo.js";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure, t as ExpectedCliError } from "./failure-output-B62fEQHE.js";
import { t as resolveOptionFromCommand } from "./cli-utils-BOBTfPOr.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DwgFcs6p.js";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-B3PJYhQA.js";
import { i as canFallbackToImplicitLocalGateway } from "./gateway-rpc-D4qc8nHD.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-CQMVVg1V.js";
import { i as renderNativeHookRelayUnavailableResponse, n as invokeNativeHookRelayBridge, r as isNativeHookRelayBridgeStaleRegistrationError } from "./native-hook-relay-client-DXyNelWq.js";
//#region src/shared/string-sample.ts
/**
* Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
* This intentionally formats for humans, not for machine parsing.
*/
/** Formats a bounded comma-separated sample of string entries with a hidden-count suffix. */
function summarizeStringEntries(params) {
	const entries = params.entries ?? [];
	if (entries.length === 0) return params.emptyText ?? "";
	const rawLimit = params.limit ?? 6;
	const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.floor(rawLimit)) : 6;
	const sample = entries.slice(0, limit);
	const suffix = entries.length > sample.length ? ` (+${entries.length - sample.length})` : "";
	return `${sample.join(", ")}${suffix}`;
}
//#endregion
//#region src/cli/hooks-cli.format.ts
function formatHookStatus(hook) {
	if (hook.loadable) return theme.success("✓ ready");
	if (!hook.enabledByConfig) return theme.warn(decorativePrefix("⏸", "disabled"));
	return theme.error(`✗ ${formatHookBlockedStatusReason(hook)}`);
}
function formatHookBlockedStatusReason(hook) {
	return hook.blockedReason && hook.blockedReason !== "missing requirements" ? hook.blockedReason : "missing";
}
function formatHookInfoBlockedStatusReason(hook) {
	const reason = hook.blockedReason && hook.blockedReason !== "missing requirements" ? hook.blockedReason : "missing requirements";
	return reason ? `${reason[0]?.toUpperCase() ?? ""}${reason.slice(1)}` : reason;
}
function formatHookName(hook) {
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const name = theme.command(hook.name);
	return emoji ? `${emoji} ${name}` : name;
}
function formatHookSource(hook) {
	if (!hook.managedByPlugin) return hook.source;
	return `plugin:${hook.pluginId ?? "unknown"}`;
}
const HOOK_REQUIREMENT_GROUPS = [
	["bins", "Binaries"],
	["anyBins", "Any binary"],
	["env", "Environment"],
	["config", "Config"],
	["os", "OS"]
];
function formatHookMissingRequirements(hook, itemLimit) {
	const formatEntries = (entries) => itemLimit === void 0 ? entries.join(", ") : summarizeStringEntries({
		entries,
		limit: itemLimit
	});
	return HOOK_REQUIREMENT_GROUPS.filter(([key]) => hook.missing[key].length > 0).map(([key]) => `${key}: ${formatEntries(hook.missing[key])}`);
}
function formatHookMissingSummary(hook, itemLimit) {
	const missing = formatHookMissingRequirements(hook, itemLimit);
	if (hook.enabledByConfig && hook.blockedReason && hook.blockedReason !== "missing requirements") missing.unshift(hook.blockedReason);
	return missing.join("; ");
}
function formatHooksList(report, opts) {
	const hooks = opts.eligible ? report.hooks.filter((h) => h.loadable) : report.hooks;
	if (opts.json) {
		const jsonReport = {
			workspaceDir: report.workspaceDir,
			managedHooksDir: report.managedHooksDir,
			hooks: hooks.map((h) => ({
				name: h.name,
				description: h.description,
				emoji: h.emoji,
				eligible: h.loadable,
				disabled: !h.enabledByConfig,
				enabledByConfig: h.enabledByConfig,
				requirementsSatisfied: h.requirementsSatisfied,
				loadable: h.loadable,
				blockedReason: h.blockedReason,
				source: h.source,
				pluginId: h.pluginId,
				events: h.events,
				unknownEvents: h.unknownEvents,
				homepage: h.homepage,
				missing: h.missing,
				managedByPlugin: h.managedByPlugin
			}))
		};
		return JSON.stringify(jsonReport, null, 2);
	}
	if (hooks.length === 0) return opts.eligible ? `No eligible hooks found. Run \`${formatCliCommand("testclaw hooks list")}\` to see all hooks.` : "No hooks found.";
	const eligible = hooks.filter((h) => h.loadable);
	const tableWidth = getTerminalTableWidth();
	const rows = hooks.map((hook) => ({
		Status: formatHookStatus(hook),
		Hook: formatHookName(hook),
		Description: theme.muted(hook.description),
		Source: formatHookSource(hook),
		Missing: opts.verbose ? theme.warn(formatHookMissingSummary(hook)) : ""
	}));
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		{
			key: "Hook",
			header: "Hook",
			minWidth: 18,
			flex: true
		},
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		{
			key: "Source",
			header: "Source",
			minWidth: 12,
			flex: true
		}
	];
	if (opts.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	const lines = [];
	lines.push(`${theme.heading("Hooks")} ${theme.muted(`(${eligible.length}/${hooks.length} ready)`)}`);
	lines.push(renderTable({
		width: tableWidth,
		columns,
		rows
	}).trimEnd());
	return lines.join("\n");
}
function formatHookInfo(hook, hookName, opts) {
	if (!hook) {
		if (opts.json) {
			const failure = formatCliJsonFailure(`Hook "${hookName}" not found.`);
			return JSON.stringify({
				...failure,
				hook: hookName
			}, null, 2);
		}
		return `Hook "${hookName}" not found. Run \`${formatCliCommand("testclaw hooks list")}\` to see available hooks.`;
	}
	if (opts.json) return JSON.stringify({
		...hook,
		eligible: hook.loadable,
		disabled: !hook.enabledByConfig
	}, null, 2);
	const lines = [];
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const status = hook.loadable ? theme.success("✓ Ready") : !hook.enabledByConfig ? theme.warn(decorativePrefix("⏸", "Disabled")) : theme.error(`✗ ${formatHookInfoBlockedStatusReason(hook)}`);
	lines.push(`${emoji ? `${emoji} ` : ""}${theme.heading(hook.name)} ${status}`);
	lines.push("");
	lines.push(hook.description);
	lines.push("");
	lines.push(theme.heading("Details:"));
	if (hook.managedByPlugin) lines.push(`${theme.muted("  Source:")} ${hook.source} (${hook.pluginId ?? "unknown"})`);
	else lines.push(`${theme.muted("  Source:")} ${hook.source}`);
	lines.push(`${theme.muted("  Path:")} ${shortenHomePath(hook.filePath)}`);
	lines.push(`${theme.muted("  Handler:")} ${shortenHomePath(hook.handlerPath)}`);
	if (hook.homepage) lines.push(`${theme.muted("  Homepage:")} ${hook.homepage}`);
	if (hook.events.length > 0) lines.push(`${theme.muted("  Events:")} ${hook.events.join(", ")}`);
	if (hook.unknownEvents.length > 0) lines.push(theme.warn(`  ⚠ Event${hook.unknownEvents.length === 1 ? "" : "s"} not emitted by core (likely typo): ${hook.unknownEvents.join(", ")}`));
	if (hook.managedByPlugin) lines.push(theme.muted("  Managed by plugin; enable/disable via hooks CLI not available."));
	if (hook.blockedReason) lines.push(`${theme.muted("  Blocked reason:")} ${hook.blockedReason}`);
	const requirementGroups = HOOK_REQUIREMENT_GROUPS.filter(([key]) => hook.requirements[key].length > 0);
	if (requirementGroups.length > 0) {
		lines.push("");
		lines.push(theme.heading("Requirements:"));
		const formatStatus = (value, satisfied) => satisfied ? theme.success(`✓ ${value}`) : theme.error(`✗ ${value}`);
		for (const [key, label] of requirementGroups) {
			const required = hook.requirements[key];
			const missing = hook.missing[key];
			let requirementStatus;
			if (key === "anyBins" || key === "os") requirementStatus = formatStatus(`(${key === "anyBins" ? "any of: " : ""}${required.join(", ")})`, missing.length === 0);
			else if (key === "config") requirementStatus = hook.configChecks.map((check) => formatStatus(check.path, check.satisfied)).join(", ");
			else requirementStatus = required.map((value) => formatStatus(value, !missing.includes(value))).join(", ");
			lines.push(`${theme.muted(`  ${label}:`)} ${requirementStatus}`);
		}
	}
	return lines.join("\n");
}
function formatHooksCheck(report, opts) {
	const eligible = report.hooks.filter((h) => h.loadable);
	const notEligible = report.hooks.filter((h) => !h.loadable);
	if (opts.json) return JSON.stringify({
		total: report.hooks.length,
		eligible: eligible.length,
		notEligible: notEligible.length,
		hooks: {
			eligible: eligible.map((h) => h.name),
			notEligible: notEligible.map((h) => ({
				name: h.name,
				blockedReason: h.blockedReason,
				missing: h.missing
			}))
		}
	}, null, 2);
	const lines = [];
	lines.push(theme.heading("Hooks Status"));
	lines.push("");
	lines.push(`${theme.muted("Total hooks:")} ${report.hooks.length}`);
	lines.push(`${theme.success("Ready:")} ${eligible.length}`);
	lines.push(`${theme.warn("Not ready:")} ${notEligible.length}`);
	if (notEligible.length > 0) {
		lines.push("");
		lines.push(theme.heading("Hooks not ready:"));
		for (const hook of notEligible) {
			const reasons = formatHookMissingRequirements(hook);
			if (hook.blockedReason && hook.blockedReason !== "missing requirements") reasons.unshift(hook.blockedReason);
			const emoji = hook.emoji ?? decorativeEmoji("🔗");
			lines.push(`  ${emoji ? `${emoji} ` : ""}${hook.name} - ${reasons.join("; ")}`);
		}
	}
	return lines.join("\n");
}
//#endregion
//#region src/cli/native-hook-relay-cli.ts
const MAX_NATIVE_HOOK_STDIN_BYTES = 1048576;
var NativeHookRelayDeadlineError = class extends Error {
	constructor(timeoutMs) {
		super(`native hook relay timed out after ${timeoutMs}ms`);
		this.name = "NativeHookRelayDeadlineError";
	}
};
/** Run one native hook relay invocation from stdin JSON to stdout/stderr response streams. */
async function runNativeHookRelayCli(opts, deps = {}) {
	const stdin = deps.stdin ?? process.stdin;
	const stdout = deps.stdout ?? process.stdout;
	const stderr = deps.stderr ?? process.stderr;
	const invokeBridge = deps.invokeBridge ?? invokeNativeHookRelayBridge;
	const callGatewayFn = deps.callGateway ?? callGatewayLazy;
	const provider = readRequiredOption(opts.provider, "provider");
	const relayId = readRequiredOption(opts.relayId, "relay-id");
	const generation = opts.generation?.trim() || void 0;
	const event = readRequiredOption(opts.event, "event");
	let timeoutMs;
	try {
		timeoutMs = parseTimeoutMsWithFallback(opts.timeout, 5e3);
	} catch (error) {
		writeText(stderr, formatRelayCliError("invalid native hook timeout", error));
		return 1;
	}
	const deadline = createNativeHookRelayDeadline(timeoutMs);
	try {
		let rawPayload;
		try {
			const rawInput = await readStreamText(stdin, MAX_NATIVE_HOOK_STDIN_BYTES, deadline);
			rawPayload = rawInput.trim() ? JSON.parse(rawInput) : null;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			writeText(stderr, formatRelayCliError("failed to read native hook input", error));
			return 1;
		}
		try {
			const remainingMs = remainingNativeHookRelayDeadlineMs(deadline);
			const response = await withNativeHookRelayDeadline(deadline, invokeBridge({
				provider,
				relayId,
				stateDbPath: opts.stateDb?.trim() || void 0,
				generation,
				event,
				rawPayload,
				registrationTimeoutMs: Math.min(100, remainingMs),
				timeoutMs: remainingMs
			}));
			writeText(stdout, response.stdout);
			writeText(stderr, response.stderr);
			return response.exitCode;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			if (isNativeHookRelayBridgeStaleRegistrationError(error)) {
				writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
				return writeNativeHookRelayUnavailableResponse({
					stdout,
					stderr,
					opts,
					provider,
					event
				});
			}
		}
		try {
			const response = await withNativeHookRelayDeadline(deadline, callGatewayFn({
				method: "nativeHook.invoke",
				params: {
					provider,
					relayId,
					generation,
					event,
					rawPayload
				},
				timeoutMs: remainingNativeHookRelayDeadlineMs(deadline),
				signal: deadline.signal,
				scopes: [ADMIN_SCOPE]
			}));
			writeText(stdout, response.stdout);
			writeText(stderr, response.stderr);
			return response.exitCode;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
			return writeNativeHookRelayUnavailableResponse({
				stdout,
				stderr,
				opts,
				provider,
				event
			});
		}
	} finally {
		deadline.dispose();
	}
}
async function callGatewayLazy(opts) {
	const { callGateway } = await import("./call-BUB0AMHV.js");
	return await callGateway(opts);
}
function readRequiredOption(value, name) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new Error(`Missing required option --${name}`);
}
async function readStreamText(stream, maxBytes, deadline) {
	const chunks = [];
	let total = 0;
	const abortRead = () => {
		destroyReadableStream(stream, createNativeHookRelayDeadlineError(deadline));
	};
	deadline.signal.addEventListener("abort", abortRead, { once: true });
	try {
		throwIfNativeHookRelayDeadlineExpired(deadline);
		for await (const chunk of stream) {
			throwIfNativeHookRelayDeadlineExpired(deadline);
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			total += buffer.byteLength;
			if (total > maxBytes) throw new Error(`native hook input exceeds ${maxBytes} bytes`);
			chunks.push(buffer);
		}
		throwIfNativeHookRelayDeadlineExpired(deadline);
		return Buffer.concat(chunks, total).toString("utf8");
	} catch (error) {
		if (isNativeHookRelayDeadlineError(error) || deadline.signal.aborted) throw createNativeHookRelayDeadlineError(deadline);
		throw error;
	} finally {
		deadline.signal.removeEventListener("abort", abortRead);
	}
}
function writeText(stream, value) {
	if (value) stream.write(value);
}
function formatRelayCliError(prefix, error) {
	return `${prefix}: ${error instanceof Error ? error.message : String(error)}\n`;
}
function createNativeHookRelayDeadline(timeoutMs) {
	const controller = new AbortController();
	const timer = setSafeTimeout(() => controller.abort(), timeoutMs);
	timer.unref?.();
	return {
		expiresAtMs: performance.now() + timeoutMs,
		signal: controller.signal,
		timeoutMs,
		dispose: () => clearTimeout(timer)
	};
}
function createNativeHookRelayDeadlineError(deadline) {
	return new NativeHookRelayDeadlineError(deadline.timeoutMs);
}
function isNativeHookRelayDeadlineError(error) {
	return error instanceof Error && error.name === "NativeHookRelayDeadlineError";
}
function remainingNativeHookRelayDeadlineMs(deadline) {
	const remainingMs = deadline.expiresAtMs - performance.now();
	if (remainingMs <= 0 || deadline.signal.aborted) throw createNativeHookRelayDeadlineError(deadline);
	return Math.max(1, remainingMs);
}
function throwIfNativeHookRelayDeadlineExpired(deadline) {
	remainingNativeHookRelayDeadlineMs(deadline);
}
function destroyReadableStream(stream, error) {
	const destroy = stream.destroy;
	if (typeof destroy === "function") {
		destroy.call(stream, error);
		return;
	}
	stream.pause();
}
async function withNativeHookRelayDeadline(deadline, promise) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		const cleanup = () => deadline.signal.removeEventListener("abort", abort);
		const abort = () => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(createNativeHookRelayDeadlineError(deadline));
		};
		deadline.signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			if (settled) return;
			if (deadline.signal.aborted || deadline.expiresAtMs <= performance.now()) {
				abort();
				return;
			}
			settled = true;
			cleanup();
			resolve(value);
		}, (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(error instanceof Error ? error : new Error(String(error)));
		});
		if (deadline.signal.aborted || deadline.expiresAtMs <= performance.now()) abort();
	});
}
function writeNativeHookRelayUnavailableResponse(params) {
	const response = renderNativeHookRelayUnavailableResponse({
		provider: params.provider,
		event: params.event,
		preToolUseUnavailable: params.opts.preToolUseUnavailable,
		message: params.message ?? "Native hook relay unavailable"
	});
	writeText(params.stdout, response.stdout);
	writeText(params.stderr, response.stderr);
	return response.exitCode;
}
function writeNativeHookRelayDeadlineResponse(params) {
	writeText(params.stderr, formatRelayCliError("native hook relay timed out", params.error));
	return writeNativeHookRelayUnavailableResponse({
		stdout: params.stdout,
		stderr: params.stderr,
		opts: params.opts,
		provider: params.provider,
		event: params.event,
		message: "Native hook relay timed out"
	});
}
//#endregion
//#region src/cli/hooks-cli.ts
const GATEWAY_HOOKS_STATUS_TIMEOUT_MS = 1500;
function resolveHooksReportTarget(config, rawAgentId) {
	const requested = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const requestedAgentId = requested ? normalizeAgentId(requested) : void 0;
	if (requestedAgentId) resolveConfiguredAgentId(config, requestedAgentId);
	const agentId = requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config, {
		surface: "hooks status reporting",
		hint: "Pass --agent <id> to select a configured agent."
	});
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
async function withHooksReport(config, target, consume) {
	const workspaceDir = target.workspaceDir;
	const workspaceEntries = loadWorkspaceHookEntries(workspaceDir, { config });
	const startup = loadGatewayStartupPluginPlanWithMetadata({
		config,
		workspaceDir,
		env: process.env
	});
	return withPluginDiagnosticsReport({
		config,
		workspaceDir,
		onlyPluginIds: startup.plan.pluginIds,
		metadataSnapshot: startup.metadataSnapshot
	}, (pluginReport) => {
		const pluginEntries = pluginReport.hooks.map((hook) => hook.entry);
		const entries = resolveHookEntries([...pluginEntries, ...workspaceEntries]);
		return consume(buildWorkspaceHookStatus(workspaceDir, {
			config,
			entries
		}));
	});
}
async function loadHooksReport(agentId, consume) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const target = resolveHooksReportTarget(config, agentId);
	const { callGateway } = await import("./call-BUB0AMHV.js");
	let report;
	try {
		report = await callGateway({
			config,
			method: "hooks.status",
			params: { agentId: target.agentId },
			timeoutMs: GATEWAY_HOOKS_STATUS_TIMEOUT_MS,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config,
			error,
			legacyMethod: "hooks.status",
			legacyAgentId: true
		})) throw error;
		return withHooksReport(config, target, consume);
	}
	return consume(report);
}
function resolveHooksAgentOption(command) {
	return resolveOptionFromCommand(command, "agent");
}
function resolveHookSelection(report, hookName) {
	const nameMatches = report.hooks.filter((hook) => hook.name === hookName);
	const matches = nameMatches.length > 0 ? nameMatches : report.hooks.filter((hook) => hook.hookKey === hookName);
	if (matches.length > 1) {
		const candidates = summarizeStringEntries({
			entries: matches.map((hook) => `${hook.name} (${hook.hookKey})`),
			limit: 5
		});
		throw new Error(`Hook "${hookName}" is ambiguous; matches: ${candidates}. Use a unique hook name or hook key.`);
	}
	return matches[0];
}
function writeHooksOutput(value, json) {
	if (json) {
		defaultRuntime.writeStdout(value);
		return;
	}
	defaultRuntime.log(value);
}
async function runOneShotHooksCliAction(action, failureOwner = "command") {
	const result = await action().catch((err) => {
		rethrowExpectedCliError(err);
		const message = formatErrorMessage(err);
		const humanOutput = `${theme.error("Error:")} ${message}`;
		if (failureOwner === "root") throw new ExpectedCliError({
			message,
			humanOutput,
			machineOutput: message
		});
		defaultRuntime.error(humanOutput);
		defaultRuntime.exit(1);
		throw new Error("unreachable");
	});
	requestExitAfterOneShotOutput(defaultRuntime, typeof result === "number" ? result : 0);
}
async function setHookEnabled(hookName, enabled, agentId) {
	const committed = await transformConfigFile({ transform: (config) => withHooksReport(config, resolveHooksReportTarget(config, agentId), (report) => {
		const hook = resolveHookSelection(report, hookName);
		if (!hook) throw new Error(`Hook "${hookName}" not found. Run \`${formatCliCommand("testclaw hooks list")}\` to see available hooks.`);
		if (hook.managedByPlugin) throw new Error(`Hook "${hookName}" is managed by plugin "${hook.pluginId ?? "unknown"}" and cannot be enabled/disabled.`);
		if (enabled && !hook.requirementsSatisfied) {
			const missing = formatHookMissingSummary(hook, 3);
			const installHint = hook.install.length ? ` Install options: ${summarizeStringEntries({
				entries: hook.install.map((option) => option.label),
				limit: 3
			})}.` : "";
			throw new Error(`Hook "${hookName}" is not eligible; missing ${missing}.${installHint} Run \`${formatCliCommand(`testclaw hooks info ${hookName}`)}\` for details.`);
		}
		const entries = { ...config.hooks?.internal?.entries };
		entries[hook.hookKey] = {
			...entries[hook.hookKey],
			enabled
		};
		return {
			nextConfig: {
				...config,
				hooks: {
					...config.hooks,
					internal: {
						...config.hooks?.internal,
						...enabled ? { enabled: true } : {},
						entries
					}
				}
			},
			result: {
				name: hook.name,
				emoji: hook.emoji
			}
		};
	}) });
	const selectedHook = expectDefined(committed.result, "hook mutation result");
	const prefix = enabled ? `${theme.success("✓")} Enabled hook:` : theme.warn(decorativePrefix("⏸", "Disabled hook:"));
	const name = selectedHook.emoji ? `${selectedHook.emoji} ${theme.command(selectedHook.name)}` : decorativePrefix("🔗", theme.command(selectedHook.name));
	defaultRuntime.log(`${prefix} ${name}`);
}
function registerHooksCli(program) {
	const hooks = program.command("hooks").description("Manage internal agent hooks").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/hooks", "docs.testclaw.ai/cli/hooks")}\n`);
	const hasJsonOutput = (opts) => Boolean(opts?.json || hooks.opts().json);
	hooks.hook("preAction", (_thisCommand, actionCommand) => {
		const parentAgent = hooks.opts().agent;
		if (parentAgent !== void 0 && !parentAgent.trim()) throw new Error("--agent must not be blank");
		if (parentAgent && actionCommand !== hooks && !(/* @__PURE__ */ new Set([
			"list",
			"info",
			"check",
			"enable",
			"disable"
		])).has(actionCommand.name())) throw new Error(`testclaw hooks ${actionCommand.name()} does not support --agent; the option only selects an owner for read-only hook reports.`);
	});
	hooks.command("list").description("List all hooks").option("--agent <id>", "Agent id to inspect").option("--eligible", "Show only eligible hooks", false).option("--json", "Output as JSON", false).option("-v, --verbose", "Show more details including missing requirements", false).action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		writeHooksOutput(await loadHooksReport(resolveHooksAgentOption(command), (report) => formatHooksList(report, {
			...opts,
			json
		})), json);
	}, "root"));
	hooks.command("info <name>").description("Show detailed information about a hook").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(async (name, opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		const result = await loadHooksReport(resolveHooksAgentOption(command), (report) => {
			const hook = resolveHookSelection(report, name);
			return {
				output: formatHookInfo(hook, name, {
					...opts,
					json
				}),
				exitCode: hook ? 0 : 1
			};
		});
		writeHooksOutput(result.output, json);
		return result.exitCode;
	}, "root"));
	hooks.command("check").description("Check hooks eligibility status").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		writeHooksOutput(await loadHooksReport(resolveHooksAgentOption(command), (report) => formatHooksCheck(report, {
			...opts,
			json
		})), json);
	}, "root"));
	hooks.command("enable <name>").description("Enable a hook").option("--agent <id>", "Agent id whose workspace to inspect").action(async (name, _opts, command) => runOneShotHooksCliAction(async () => {
		await setHookEnabled(name, true, resolveHooksAgentOption(command));
	}));
	hooks.command("disable <name>").description("Disable a hook").option("--agent <id>", "Agent id whose workspace to inspect").action(async (name, _opts, command) => runOneShotHooksCliAction(async () => {
		await setHookEnabled(name, false, resolveHooksAgentOption(command));
	}));
	hooks.command("relay", { hidden: true }).description("Internal native harness hook relay").requiredOption("--provider <provider>", "Native harness provider").requiredOption("--relay-id <id>", "Native hook relay id").option("--state-db <path>", "Shared state database path").option("--generation <generation>", "Native hook relay registration generation").requiredOption("--event <event>", "Native hook event").option("--pre-tool-use-unavailable <mode>", "PreToolUse fallback mode when the originating relay is unavailable").option("--timeout <ms>", "Gateway timeout in ms", "5000").action(async (opts) => runOneShotHooksCliAction(() => runNativeHookRelayCli(opts)));
	hooks.command("install").description("Deprecated: install a hook pack via `testclaw plugins install`").argument("<path-or-spec>", "Path to a hook pack or npm package spec").option("-l, --link", "Link a local path instead of copying", false).option("--pin", "Record npm installs as exact resolved <name>@<version>", false).option("--force", "Confirm non-ClawHub sources and overwrite an existing hook pack", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (raw, opts) => {
		const { runPluginInstallCommand } = await import("./plugins-install-command-DXvX3Ig-.js");
		defaultRuntime.log(theme.warn("`testclaw hooks install` is deprecated; use `testclaw plugins install`."));
		await runPluginInstallCommand({
			raw,
			opts,
			allowInstallPolicyWarningPrompt: true,
			invalidateRuntimeCache: false
		});
	});
	hooks.command("update").description("Deprecated: update hook packs via `testclaw plugins update`").argument("[id]", "Hook pack id (omit with --all)").option("--all", "Update all tracked hooks", false).option("--dry-run", "Show what would change without writing", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (id, opts) => {
		const { runPluginUpdateCommand } = await import("./plugins-update-command-CqpFgodg.js");
		defaultRuntime.log(theme.warn("`testclaw hooks update` is deprecated; use `testclaw plugins update`."));
		await runPluginUpdateCommand({
			ids: id ? [id] : [],
			opts
		});
	});
	hooks.action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		writeHooksOutput(await loadHooksReport(resolveHooksAgentOption(command), (report) => formatHooksList(report, {
			...opts,
			json
		})), json);
	}, "root"));
}
//#endregion
export { registerHooksCli };
