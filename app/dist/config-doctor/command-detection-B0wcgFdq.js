import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Bb3_IiBS.js";
import { y as requireActivePluginRegistry } from "./runtime-B980B6n3.js";
import "./command-registry-state-BRCmV3-5.js";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-Dxjy7ctc.js";
import "./command-registration-v58T8CAu.js";
import { t as executeRegisteredPluginCommand } from "./plugin-command-execution-Cc67t_QW.js";
import { t as pluginCommandSupportsChannel } from "./plugin-command-metadata-jSFxBwiS.js";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-CD-Rd_uT.js";
import { t as normalizeCommandBody } from "./commands-registry-normalize-MoqXSr64.js";
import { t as isAbortTrigger } from "./abort-trigger-text-C537FIe9.js";
//#region src/plugins/plugin-command-matcher.ts
function matchesInvocationName(command, aliasScope, candidateName) {
	let matched = normalizeOptionalLowercaseString(command.name) === candidateName;
	if (aliasScope.kind === "all") {
		for (const alias of Object.values(command.nativeNames ?? {})) if (typeof alias === "string" && normalizeOptionalLowercaseString(alias) === candidateName) matched = true;
		return matched;
	}
	const provider = normalizeOptionalLowercaseString(aliasScope.provider);
	const providerAlias = provider ? command.nativeNames?.[provider] : void 0;
	const aliasName = typeof providerAlias === "string" ? providerAlias : command.nativeNames?.default;
	return normalizeOptionalLowercaseString(aliasName) === candidateName || matched;
}
function parsePluginInvocation(commandBody) {
	const commandMatch = commandBody.trim().match(/^\/\s*([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!commandMatch) return null;
	const key = normalizeLowercaseStringOrEmpty(`/${commandMatch[1]}`);
	return {
		keys: [.../* @__PURE__ */ new Set([
			key,
			key.replace(/_/g, "-"),
			key.replace(/-/g, "_")
		])],
		args: commandMatch[2]?.trim() || void 0
	};
}
function matchRegisteredPluginCommand(params) {
	const invocation = parsePluginInvocation(params.commandBody);
	if (!invocation) return null;
	const { keys, args } = invocation;
	for (const candidateKey of keys) {
		const candidateName = candidateKey.slice(1);
		const command = params.commands.find((candidate) => pluginCommandSupportsChannel(candidate, params.channel) && matchesInvocationName(candidate, params.aliasScope, candidateName));
		if (command) return args && !command.acceptsArgs ? null : {
			command,
			args
		};
	}
	return null;
}
//#endregion
//#region src/plugins/commands.ts
/** Match one compatibility command invocation against the current command registry. */
function matchPluginCommand(commandBody, options = {}) {
	const registry = requireActivePluginRegistry();
	return matchRegisteredPluginCommand({
		commands: listRegisteredPluginCommands(registry),
		commandBody,
		channel: options.channel,
		aliasScope: { kind: "all" }
	});
}
async function executePluginCommand(params) {
	return await executeRegisteredPluginCommand(requireActivePluginRegistry(), params);
}
/** List registered plugin commands for help and command discovery. */
function listPluginCommands() {
	return listRegisteredPluginCommands(requireActivePluginRegistry()).map((command) => ({
		name: command.name,
		description: command.description,
		pluginId: command.pluginId,
		acceptsArgs: command.acceptsArgs ?? false
	}));
}
//#endregion
//#region src/auto-reply/command-detection.ts
/** Command detectors used by inbound authorization and control-command routing. */
/** Returns true when text starts with a configured control command alias. */
function hasControlCommand(text, cfg, options) {
	if (!text) return false;
	const trimmed = text.trim();
	if (!trimmed) return false;
	const stripped = stripInboundMetadata(trimmed);
	if (!stripped) return false;
	const normalizedBody = normalizeCommandBody(stripped, options);
	if (!normalizedBody) return false;
	const lowered = normalizeLowercaseStringOrEmpty(normalizedBody);
	const commands = cfg ? listChatCommandsForConfig(cfg) : listChatCommands();
	for (const command of commands) for (const alias of command.textAliases) {
		const normalized = normalizeOptionalLowercaseString(alias);
		if (!normalized) continue;
		if (lowered === normalized) return true;
		if (command.acceptsArgs && lowered.startsWith(normalized)) {
			const nextChar = normalizedBody.charAt(normalized.length);
			if (nextChar && /\s/.test(nextChar)) return true;
		}
	}
	return false;
}
/** Returns true for exact control commands or abort triggers after metadata stripping. */
function isControlCommandMessage(text, cfg, options) {
	if (!text) return false;
	const trimmed = text.trim();
	if (!trimmed) return false;
	if (hasControlCommand(trimmed, cfg, options)) return true;
	const stripped = stripInboundMetadata(trimmed);
	const normalized = normalizeOptionalLowercaseString(normalizeCommandBody(stripped, options)) ?? "";
	return isAbortTrigger(normalized);
}
/** Returns true when a command starts a new transcript rather than resetting in place. */
function isSessionBoundaryCommandText(text, options) {
	const stripped = stripInboundMetadata(text?.trim() ?? "");
	const normalized = normalizeCommandBody(stripped, options);
	return /^\/(?:new|reset)(?:\s|$)/i.test(normalized) && !/^\/reset\s+soft(?:\s|$)/i.test(normalized);
}
/**
* Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
* can decide whether to compute CommandAuthorized for a message.
*
* This intentionally errs on the side of false positives; CommandAuthorized only gates
* command/directive execution, not normal chat replies.
*/
function hasInlineCommandTokens(text) {
	const body = text ?? "";
	if (!body.trim()) return false;
	return /(?:^|\s)[/!][a-z]/i.test(body);
}
function hasSpacedPluginCommand(text) {
	const commandBody = text?.match(/(?:^|\s)(\/\s+[a-z][\s\S]*)/i)?.[1];
	return commandBody ? matchPluginCommand(commandBody) !== null : false;
}
/** Returns true when a message may need command authorization metadata. */
function shouldComputeCommandAuthorized(text, cfg, options) {
	return isControlCommandMessage(text, cfg, options) || hasInlineCommandTokens(text) || hasSpacedPluginCommand(text);
}
//#endregion
export { executePluginCommand as a, matchRegisteredPluginCommand as c, shouldComputeCommandAuthorized as i, parsePluginInvocation as l, isControlCommandMessage as n, listPluginCommands as o, isSessionBoundaryCommandText as r, matchPluginCommand as s, hasControlCommand as t };
