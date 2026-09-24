import { t as normalizeAnyChannelId } from "./registry-normalize-DzsBlXGu.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-U-7eR7Vu.mjs";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-D3Apdk4j.mjs";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-zTk_d7bG.mjs";
import { n as bindChannelReplyTransformOwner, t as applyChannelReplyTransform } from "./reply-transform-BCevJt90.mjs";
import { n as createReplyPrefixOptions } from "./reply-prefix-iVHU5oBr.mjs";
import { t as createTypingCallbacks } from "./typing-C8rPbA2A.mjs";
//#region src/channels/message/reply-pipeline.ts
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
function resolveChannelSourceReplyDeliveryMode(params) {
	return resolveSourceReplyDeliveryMode(params);
}
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
function createChannelReplyPipeline(params) {
	const channelId = params.channel ? normalizeAnyChannelId(params.channel) ?? params.channel : void 0;
	let plugin;
	let pluginMessagingResolved = false;
	const resolvePluginMessaging = () => {
		if (pluginMessagingResolved) return plugin?.messaging;
		pluginMessagingResolved = true;
		plugin = channelId ? getLoadedChannelPluginForRead(channelId) : void 0;
		return plugin?.messaging;
	};
	const transformPluginReply = (payload) => {
		const messaging = resolvePluginMessaging();
		if (messaging?.transformReplyPayload) bindChannelReplyTransformOwner(transformPluginReply, messaging, params.accountId);
		return applyChannelReplyTransform({
			messaging,
			payload,
			cfg: params.cfg,
			accountId: params.accountId
		});
	};
	const transformReplyPayload = params.transformReplyPayload ? params.transformReplyPayload : channelId ? transformPluginReply : void 0;
	const prefixOptions = createReplyPrefixOptions({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId
	});
	return {
		...prefixOptions,
		resolveResponsePrefix: () => resolveResponsePrefixTemplate(prefixOptions.responsePrefix, prefixOptions.responsePrefixContextProvider()),
		...transformReplyPayload ? { transformReplyPayload } : {},
		...params.typingCallbacks ? { typingCallbacks: params.typingCallbacks } : params.typing ? { typingCallbacks: createTypingCallbacks(params.typing) } : {}
	};
}
//#endregion
export { resolveChannelSourceReplyDeliveryMode as n, createChannelReplyPipeline as t };
