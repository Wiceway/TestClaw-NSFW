import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-h34f2oK3.mjs";
import { n as hasBundledChannelPackageState } from "./package-state-probes-C7wAr5hu.mjs";
import { r as resolveChannelConfigRecord, t as hasMeaningfulChannelConfigShallow } from "./channel-configured-shared-BghsMSOi.mjs";
//#region src/config/channel-configured.ts
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
function isChannelConfigured(cfg, channelId, env = process.env) {
	if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) return true;
	if (hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId,
		cfg,
		env
	})) return true;
	const plugin = getBootstrapChannelPlugin(channelId);
	return Boolean(plugin?.config?.hasConfiguredState?.({
		cfg,
		env
	}));
}
//#endregion
export { isChannelConfigured as t };
