import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import "./agent-scope-config-BEuqweC1.js";
import "./paths-ViQaz2td.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import "./session-accessor-DMf92PxK.js";
import { t as getChatCommands } from "./commands-registry.data-C3W8E-Ao.js";
import "./commands-registry-list-CD-Rd_uT.js";
import { n as resolveTextCommand } from "./commands-registry-normalize-MoqXSr64.js";
import "./model-selection-osPTiirn.js";
import "./commands-text-routing-DQ8Efmfp.js";
//#region src/auto-reply/commands-registry.ts
function createNativeCommandNameMapper(provider, options) {
	const resolveNativeCommandName = !provider ? void 0 : (options?.includeBundledChannelFallback === false ? getLoadedChannelPlugin(provider) : getChannelPlugin(provider))?.commands?.resolveNativeCommandName;
	return (command) => {
		return [command.nativeName ? resolveNativeCommandName?.({
			commandKey: command.key,
			defaultName: command.nativeName
		}) ?? command.nativeName : void 0, ...command.nativeAliases ?? []].filter((name) => Boolean(name)).map((name) => ({
			name,
			normalizedName: normalizeOptionalLowercaseString(name)
		}));
	};
}
function supportsNativeProvider(command, provider) {
	if (!command.nativeProviders?.length) return true;
	const normalizedProvider = normalizeOptionalLowercaseString(provider);
	if (!normalizedProvider) return false;
	return command.nativeProviders.some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProvider);
}
/** Finds a command definition by provider-native command name or native alias. */
function findCommandByNativeName(name, provider, options) {
	const normalized = normalizeOptionalLowercaseString(name);
	if (!normalized) return;
	const mapNativeCommandNames = createNativeCommandNameMapper(provider, options);
	return getChatCommands().find((command) => command.scope !== "text" && supportsNativeProvider(command, provider) && mapNativeCommandNames(command).some(({ normalizedName }) => normalizedName === normalized));
}
/** Returns true only when the command owner permits handler work beside an active run. */
function isActiveRunSafeCommandTurn(params) {
	const { commandTurn } = params;
	if (commandTurn.kind !== "native" && commandTurn.kind !== "text-slash" || !commandTurn.authorized) return false;
	const command = commandTurn.kind === "native" ? commandTurn.commandName ? findCommandByNativeName(commandTurn.commandName, params.provider, { includeBundledChannelFallback: false }) : void 0 : (resolveTextCommand(commandTurn.body ?? "", params.cfg) ?? (commandTurn.commandName ? resolveTextCommand(`/${commandTurn.commandName}`, params.cfg) : null))?.command;
	return command?.activeRunSafe === true || command?.key === "login" && /^\/login\s+cancel$/iu.test(commandTurn.body?.trim() ?? "");
}
//#endregion
export { isActiveRunSafeCommandTurn as n, findCommandByNativeName as t };
