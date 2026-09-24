import { t as normalizeAnyChannelId } from "./registry-normalize-Gf2mwIhw.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-llHP5sCP.js";
import "./task-notification-routing-CYDaelCz.js";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-B3_0kD0S.js";
import { n as bindChannelReplyTransformOwner, t as applyChannelReplyTransform } from "./reply-transform-RgLq9qxY.js";
import { n as createReplyPrefixOptions } from "./reply-prefix-D7t9kJSs.js";
import { t as createTypingCallbacks } from "./typing-B0J6DlW0.js";
//#region src/channels/message/reply-pipeline.ts
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
export { createChannelReplyPipeline as t };
