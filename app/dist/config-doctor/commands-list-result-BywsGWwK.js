import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-B7K42D1p.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { t as COMMAND_DESCRIPTION_MAX_LENGTH } from "./commands-CEBe4bfo.js";
import { y as requireActivePluginRegistry } from "./runtime-B980B6n3.js";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-Dxjy7ctc.js";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-jSFxBwiS.js";
import { r as listChatCommandsForConfig } from "./commands-registry-list-CD-Rd_uT.js";
import { i as resolveReadOnlyChannelCommandDefaults } from "./read-only-command-defaults-DZ31mAuF.js";
import "./commands-registry-CcaOl4qH.js";
import { i as prepareSkillCommandsForAgents } from "./chat-commands-CR-RojSE.js";
//#region src/plugins/command-specs.ts
function resolvePluginTextName(command) {
	return command.name.trim() || command.name;
}
function pluginNativeCommandsEnabled(providerName, options) {
	if (!providerName) return true;
	const commandDefaults = options.config ? resolveReadOnlyChannelCommandDefaults(providerName, {
		...options,
		config: options.config
	}) : void 0;
	return (getLoadedChannelPlugin(providerName)?.commands ?? commandDefaults)?.nativeCommandsAutoEnabled === true;
}
function getPluginCommandEntrySpecs(provider, options = {}) {
	const providerName = normalizeOptionalLowercaseString(provider);
	const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
	return listRegisteredPluginCommands(requireActivePluginRegistry()).map((cmd) => serializePluginCommandEntrySpec(cmd, providerName, nativeCommandsEnabled)).filter((spec) => spec !== null);
}
function getPluginCommandEntrySpecsFromRegistrations(commands, provider, options = {}) {
	const providerName = normalizeOptionalLowercaseString(provider);
	const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
	return commands.map((entry) => serializePluginCommandEntrySpec(entry.command, providerName, nativeCommandsEnabled)).filter((spec) => spec !== null);
}
function serializePluginCommandEntrySpec(cmd, provider, nativeCommandsEnabled) {
	if (!pluginCommandSupportsChannel(cmd, provider)) return null;
	const nativeName = nativeCommandsEnabled ? projectPluginCommandNativeMetadata(cmd, provider).name : void 0;
	return {
		name: resolvePluginTextName(cmd),
		description: cmd.description.trim(),
		acceptsArgs: cmd.acceptsArgs ?? false,
		...nativeName ? { nativeName } : {},
		...cmd.clientPresentation ? { clientPresentation: cmd.clientPresentation } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/commands-list-result.ts
function clampString(value, maxLength) {
	return value.length > maxLength ? truncateUtf16Safe(value, maxLength) : value;
}
function trimClampNonEmpty(value, maxLength) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	return clampString(trimmed, maxLength);
}
function clampDescription(value) {
	return clampString(value ?? "", COMMAND_DESCRIPTION_MAX_LENGTH);
}
function resolveNativeName(cmd, provider) {
	const baseName = cmd.nativeName ?? cmd.key;
	if (!provider || !cmd.nativeName) return baseName;
	return getChannelPlugin(provider)?.commands?.resolveNativeCommandName?.({
		commandKey: cmd.key,
		defaultName: cmd.nativeName
	}) ?? baseName;
}
function supportsNativeProvider(cmd, provider) {
	if (!cmd.nativeProviders?.length) return true;
	if (!provider) return true;
	return cmd.nativeProviders.some((candidate) => normalizeOptionalLowercaseString(candidate) === provider);
}
/** Resolves normalized text aliases, preserving slash-prefixed command names. */
function resolveTextAliases(cmd) {
	const seen = /* @__PURE__ */ new Set();
	const aliases = [];
	for (const alias of cmd.textAliases) {
		const trimmed = trimClampNonEmpty(alias, 200);
		if (!trimmed) continue;
		const exactAlias = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
		if (seen.has(exactAlias)) continue;
		seen.add(exactAlias);
		aliases.push(exactAlias);
		if (aliases.length >= 20) break;
	}
	if (aliases.length > 0) return aliases;
	return [`/${clampString(cmd.key, 200)}`];
}
/** Serializes a command argument into the bounded gateway protocol shape. */
function serializeArg(arg) {
	const isDynamic = typeof arg.choices === "function";
	const staticChoices = Array.isArray(arg.choices) ? arg.choices.slice(0, 50).map(normalizeChoice) : void 0;
	return {
		name: clampString(arg.name, 200),
		description: clampString(arg.description, 500),
		type: arg.type,
		...arg.required ? { required: true } : {},
		...staticChoices ? { choices: staticChoices } : {},
		...isDynamic ? { dynamic: true } : {}
	};
}
function normalizeChoice(choice) {
	if (typeof choice === "string") return {
		value: clampString(choice, 200),
		label: clampString(choice, 200)
	};
	return {
		value: clampString(choice.value, 200),
		label: clampString(choice.label, 200)
	};
}
function mapCommand(cmd, source, includeArgs, nameSurface, provider) {
	const shouldIncludeArgs = includeArgs && cmd.acceptsArgs && cmd.args?.length;
	const nativeName = cmd.scope === "text" ? void 0 : resolveNativeName(cmd, provider);
	const textAliases = cmd.scope !== "native" ? resolveTextAliases(cmd) : void 0;
	return {
		name: clampString(nameSurface === "text" ? textAliases?.[0]?.slice(1) ?? cmd.key : nativeName ?? cmd.key, 200),
		...nativeName ? { nativeName: clampString(nativeName, 200) } : {},
		...textAliases ? { textAliases } : {},
		description: clampDescription(cmd.description),
		...cmd.category ? { category: cmd.category === "docks" ? "tools" : cmd.category } : {},
		source,
		scope: cmd.scope,
		acceptsArgs: Boolean(cmd.acceptsArgs),
		...shouldIncludeArgs ? { args: cmd.args.slice(0, 20).map(serializeArg) } : {}
	};
}
/** Builds plugin command entries from text specs plus provider-native metadata. */
function buildPluginCommandEntries(params) {
	const gatewayRegistry = getPluginRegistryForContext();
	const pluginSpecs = gatewayRegistry ? getPluginCommandEntrySpecsFromRegistrations(gatewayRegistry.commands, params.provider, { config: params.cfg }) : getPluginCommandEntrySpecs(params.provider, { config: params.cfg });
	const eligibleSpecs = params.nameSurface === "native" ? pluginSpecs.filter((spec) => spec.nativeName) : pluginSpecs;
	const entries = [];
	for (const spec of eligibleSpecs) entries.push({
		name: clampString(params.nameSurface === "text" ? spec.name : spec.nativeName ?? spec.name, 200),
		...spec.nativeName ? { nativeName: clampString(spec.nativeName, 200) } : {},
		textAliases: [`/${clampString(spec.name, 200)}`],
		description: clampDescription(spec.description),
		source: "plugin",
		scope: "both",
		acceptsArgs: spec.acceptsArgs,
		...spec.clientPresentation ? { clientPresentation: spec.clientPresentation } : {}
	});
	return entries;
}
/** Builds the public commands.list payload for an agent/provider/scope view. */
async function buildCommandsListResult(params) {
	const includeArgs = params.includeArgs !== false;
	const scopeFilter = params.scope ?? "both";
	const nameSurface = scopeFilter === "text" ? "text" : "native";
	const provider = normalizeOptionalLowercaseString(params.provider);
	const skillCommands = await prepareSkillCommandsForAgents({
		cfg: params.cfg,
		agentIds: [params.agentId],
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey
	});
	const chatCommands = listChatCommandsForConfig(params.cfg, { skillCommands });
	const skillsByKey = new Map(skillCommands.map((skill) => [`skill:${skill.skillName}`, skill]));
	const commands = [];
	for (const cmd of chatCommands) {
		if (scopeFilter !== "both" && cmd.scope !== "both" && cmd.scope !== scopeFilter) continue;
		if (nameSurface === "native" && cmd.scope !== "text" && !supportsNativeProvider(cmd, provider)) continue;
		const skill = skillsByKey.get(cmd.key);
		commands.push({
			...mapCommand(cmd, skill ? "skill" : "native", includeArgs, nameSurface, provider),
			...skill ? {
				skillDisplayName: clampString(skill.displayName ?? skill.skillName, 200),
				skillModelVisible: skill.modelVisible !== false
			} : {}
		});
	}
	commands.push(...buildPluginCommandEntries({
		provider,
		nameSurface,
		cfg: params.cfg
	}));
	return { commands: commands.slice(0, 500) };
}
//#endregion
export { buildCommandsListResult as t };
