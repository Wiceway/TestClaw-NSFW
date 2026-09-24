import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { t as normalizeChatType } from "./chat-type-VRUlDKAl.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-Gf2mwIhw.js";
import "./registry-CGwRo5Hv.js";
import { t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { u as getLoadedChannelThreadingAdapter } from "./task-notification-routing-CYDaelCz.js";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, h as isReplyPayloadStatusNotice } from "./reply-payload-Ds4kei43.js";
import { n as resolveChannelAccountEntry } from "./account-lookup-CD9t104R.js";
import { C as isSingleUseReplyToMode } from "./reply-payload-CPB05_Sy.js";
//#region src/auto-reply/reply/reply-threading.ts
/** Reply threading policy helpers for channel replies and status notices. */
function normalizeReplyToModeChatType(chatType) {
	return chatType === "direct" || chatType === "group" || chatType === "channel" ? chatType : void 0;
}
/** Resolve configured reply-to mode from channel and chat-type config. */
function resolveConfiguredReplyToMode(cfg, channel, chatType, accountId) {
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	if (!provider) return "all";
	const channelConfig = cfg.channels?.[provider];
	const normalizedAccountId = accountId?.trim();
	const accountConfig = normalizedAccountId ? resolveChannelAccountEntry(channelConfig?.accounts, normalizeAccountId(normalizedAccountId), provider, normalizeAccountId) : void 0;
	const normalizedChatType = normalizeReplyToModeChatType(chatType);
	if (normalizedChatType) {
		const accountMode = accountConfig?.replyToModeByChatType?.[normalizedChatType] ?? accountConfig?.replyToMode;
		if (accountMode !== void 0) return accountMode;
		const scopedMode = channelConfig?.replyToModeByChatType?.[normalizedChatType];
		if (scopedMode !== void 0) return scopedMode;
	}
	return accountConfig?.replyToMode ?? channelConfig?.replyToMode ?? "all";
}
/** Resolve reply-to mode using channel threading adapter override when present. */
function resolveReplyToModeWithThreading(cfg, threading, params = {}) {
	return threading?.resolveReplyToMode?.({
		cfg,
		accountId: params.accountId,
		chatType: params.chatType
	}) ?? resolveConfiguredReplyToMode(cfg, params.channel, params.chatType, params.accountId);
}
/** Resolve effective reply-to mode for a channel/account/chat tuple. */
function resolveReplyToMode(cfg, channel, accountId, chatType) {
	const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
	if (!normalizedAccountId) return resolveConfiguredReplyToMode(cfg, channel, chatType);
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	return resolveReplyToModeWithThreading(cfg, provider ? getChannelPlugin(provider)?.threading : void 0, {
		channel,
		accountId: normalizedAccountId,
		chatType
	});
}
/** Resolve the account that routed reply delivery will use when none is explicit. */
function resolveReplyDeliveryAccountId(cfg, channel, accountId) {
	const explicitAccountId = normalizeOptionalLowercaseString(accountId);
	if (explicitAccountId) return explicitAccountId;
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	if (!provider) return;
	const plugin = getChannelPlugin(provider);
	if (!plugin) return;
	const configuredDefault = normalizeOptionalLowercaseString(plugin.config.defaultAccountId?.(cfg));
	if (configuredDefault) return configuredDefault;
	const channelConfiguredDefault = normalizeOptionalLowercaseString(cfg.channels?.[provider]?.defaultAccount);
	if (channelConfiguredDefault) return channelConfiguredDefault;
	return plugin.config.listAccountIds(cfg).map((listedAccountId) => normalizeOptionalLowercaseString(listedAccountId)).find((listedAccountId) => Boolean(listedAccountId)) ?? "default";
}
/** Build the canonical reply policy context consumed by delivery adapters. */
function createReplyDeliveryContext(replyToMode, chatType) {
	const normalizedChatType = normalizeChatType(chatType ?? void 0);
	return {
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		replyToMode
	};
}
function suppressReplyTarget(payload) {
	return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: void 0,
		replyToCurrent: false,
		replyToTag: false
	}), { replyTargetSuppressed: true });
}
/** Create a payload filter that strips reply targets according to reply-to mode. */
function createReplyToModeFilter(mode, opts = {}) {
	let hasThreaded = false;
	const apply = (payload, preview = false) => {
		const isStatusNotice = isReplyPayloadStatusNotice(payload);
		if (!payload.replyToId) return payload;
		if (mode === "off") {
			const isExplicit = Boolean(payload.replyToTag) || Boolean(payload.replyToCurrent);
			if (opts.allowExplicitReplyTagsWhenOff && isExplicit && !isStatusNotice) return payload;
			return copyReplyPayloadMetadata(payload, {
				...payload,
				replyToId: void 0,
				replyToCurrent: payload.replyToCurrent === true ? false : payload.replyToCurrent
			});
		}
		if (mode === "all") return payload;
		if (isSingleUseReplyToMode(mode) && hasThreaded) {
			if (isStatusNotice) return payload;
			return suppressReplyTarget(payload);
		}
		if (isSingleUseReplyToMode(mode) && !isStatusNotice && !preview) hasThreaded = true;
		return payload;
	};
	return Object.assign((payload) => apply(payload), { preview: (payload) => apply(payload, true) });
}
/** Resolve whether implicit current-message replies are allowed under threading policy. */
function resolveImplicitCurrentMessageReplyAllowance(mode, policy) {
	const implicitCurrentMessage = policy?.implicitCurrentMessage ?? "default";
	if (implicitCurrentMessage === "allow") return true;
	if (implicitCurrentMessage === "deny") return false;
	return mode !== "batched";
}
/** Create a reply-to filter using channel-specific explicit-tag defaults. */
function createReplyToModeFilterForChannel(mode, channel) {
	const normalized = normalizeOptionalLowercaseString(channel);
	const adapter = getLoadedChannelThreadingAdapter(normalized);
	return createReplyToModeFilter(mode, { allowExplicitReplyTagsWhenOff: adapter?.allowExplicitReplyTagsWhenOff ?? adapter?.allowTagsWhenOff ?? Boolean(normalized) });
}
//#endregion
export { resolveReplyToMode as a, resolveReplyDeliveryAccountId as i, createReplyToModeFilterForChannel as n, resolveImplicitCurrentMessageReplyAllowance as r, createReplyDeliveryContext as t };
