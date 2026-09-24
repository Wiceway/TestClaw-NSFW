import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { n as resolveChannelAccountEntry } from "./account-lookup-CD9t104R.js";
import "./helpers-DsHF8yVm.js";
import "./config-helpers-g-K2uUTt.js";
//#region src/channels/plugins/config-write-policy-shared.ts
/**
* Shared channel config-write policy helpers.
*
* Authorizes config writes by origin/target channel and account scope.
*/
function resolveChannelConfig(cfg, channelId) {
	if (!channelId) return;
	const channelConfig = cfg.channels?.[channelId];
	return channelConfig != null && typeof channelConfig === "object" && !Array.isArray(channelConfig) ? channelConfig : void 0;
}
function resolveChannelAccountConfig(channelConfig, channelId, accountId) {
	return resolveChannelAccountEntry(channelConfig.accounts, normalizeAccountId(accountId), channelId);
}
/**
* Resolves whether config writes are enabled for a channel/account scope.
*/
function resolveChannelConfigWritesShared(params) {
	const channelConfig = resolveChannelConfig(params.cfg, params.channelId);
	if (!channelConfig || !params.channelId) return true;
	return (resolveChannelAccountConfig(channelConfig, params.channelId, params.accountId)?.configWrites ?? channelConfig.configWrites) !== false;
}
/**
* Authorizes a channel-initiated config write against origin and target policy.
*/
function authorizeConfigWriteShared(params) {
	if (params.allowBypass) return { allowed: true };
	if (params.target?.kind === "ambiguous") return {
		allowed: false,
		reason: "ambiguous-target"
	};
	if (params.origin?.channelId && !resolveChannelConfigWritesShared({
		cfg: params.cfg,
		channelId: params.origin.channelId,
		accountId: params.origin.accountId
	})) return {
		allowed: false,
		reason: "origin-disabled",
		blockedScope: {
			kind: "origin",
			scope: params.origin
		}
	};
	const target = params.target;
	if (target && target.kind !== "global") {
		const scope = target.scope;
		if (scope.channelId && !resolveChannelConfigWritesShared({
			cfg: params.cfg,
			channelId: scope.channelId,
			accountId: scope.accountId
		})) return {
			allowed: false,
			reason: "target-disabled",
			blockedScope: {
				kind: "target",
				scope
			}
		};
	}
	return { allowed: true };
}
/**
* Resolves an explicit channel/account scope into a config write target.
*/
function resolveExplicitConfigWriteTargetShared(scope) {
	if (!scope.channelId) return { kind: "global" };
	const accountId = normalizeAccountId(scope.accountId);
	if (!accountId || accountId === "default") return {
		kind: "channel",
		scope: { channelId: scope.channelId }
	};
	return {
		kind: "account",
		scope: {
			channelId: scope.channelId,
			accountId
		}
	};
}
/**
* Infers the config write target from a config path.
*/
function resolveConfigWriteTargetFromPathShared(params) {
	if (params.path[0] !== "channels") return { kind: "global" };
	if (params.path.length < 2) return {
		kind: "ambiguous",
		scopes: []
	};
	const channelId = params.normalizeChannelId(params.path[1] ?? "");
	if (!channelId) return {
		kind: "ambiguous",
		scopes: []
	};
	if (params.path.length === 2) return {
		kind: "ambiguous",
		scopes: [{ channelId }]
	};
	if (params.path[2] !== "accounts") return {
		kind: "channel",
		scope: { channelId }
	};
	if (params.path.length < 4) return {
		kind: "ambiguous",
		scopes: [{ channelId }]
	};
	return resolveExplicitConfigWriteTargetShared({
		channelId,
		accountId: normalizeAccountId(params.path[3])
	});
}
/**
* Checks whether an internal admin client can bypass channel config write policy.
*/
function canBypassConfigWritePolicyShared(params) {
	return params.isInternalMessageChannel(params.channel) && params.gatewayClientScopes?.includes("operator.admin") === true;
}
/**
* Formats the user-facing denial message for a blocked config write.
*/
function formatConfigWriteDeniedMessageShared(params) {
	if (params.result.reason === "ambiguous-target") return "⚠️ Channel-initiated /config writes cannot replace channels, channel roots, or accounts collections. Use a more specific path or gateway operator.admin.";
	const blocked = params.result.blockedScope?.scope;
	return `⚠️ Config writes are disabled for ${blocked?.channelId ?? params.fallbackChannelId ?? "this channel"}. Set ${blocked?.channelId ? blocked.accountId ? `channels.${blocked.channelId}.accounts.${blocked.accountId}.configWrites=true` : `channels.${blocked.channelId}.configWrites=true` : params.fallbackChannelId ? `channels.${params.fallbackChannelId}.configWrites=true` : "channels.<channel>.configWrites=true"} to enable.`;
}
//#endregion
//#region src/channels/plugins/config-writes.ts
/**
* Channel config-write policy facade.
*
* Applies shared config write authorization to concrete Assistant channel config.
*/
function isInternalConfigWriteMessageChannel(channel) {
	return normalizeLowercaseStringOrEmpty(channel) === "webchat";
}
/**
* Authorizes a channel config write under origin and target policy.
*/
function authorizeConfigWrite(params) {
	return authorizeConfigWriteShared(params);
}
/**
* Resolves an explicit channel/account scope into a config write target.
*/
function resolveExplicitConfigWriteTarget(scope) {
	return resolveExplicitConfigWriteTargetShared(scope);
}
/**
* Infers the channel config write target from a config path.
*/
function resolveConfigWriteTargetFromPath(path) {
	return resolveConfigWriteTargetFromPathShared({
		path,
		normalizeChannelId: (raw) => normalizeLowercaseStringOrEmpty(raw)
	});
}
/**
* Checks whether a gateway client can bypass channel config write policy.
*/
function canBypassConfigWritePolicy(params) {
	return canBypassConfigWritePolicyShared({
		...params,
		isInternalMessageChannel: isInternalConfigWriteMessageChannel
	});
}
/**
* Formats the user-facing denial message for a blocked channel config write.
*/
function formatConfigWriteDeniedMessage(params) {
	return formatConfigWriteDeniedMessageShared(params);
}
//#endregion
//#region src/plugin-sdk/channel-config-helpers.ts
/** Coerce mixed allowlist config values into plain strings without trimming or deduping. */
function mapAllowFromEntries(allowFrom) {
	return (allowFrom ?? []).map((entry) => String(entry));
}
//#endregion
export { resolveConfigWriteTargetFromPath as a, formatConfigWriteDeniedMessage as i, authorizeConfigWrite as n, resolveExplicitConfigWriteTarget as o, canBypassConfigWritePolicy as r, mapAllowFromEntries as t };
