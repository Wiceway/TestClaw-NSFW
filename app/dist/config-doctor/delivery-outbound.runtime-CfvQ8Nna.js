import { t as normalizeAnyChannelId } from "./registry-normalize-Gf2mwIhw.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-llHP5sCP.js";
import { n as enqueueSystemEvent } from "./system-events-BUr4KJmI.js";
import { t as buildOutboundSessionContext } from "./session-context-CoMMpo8u.js";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-Bh8w6d4a.js";
import "./runtime-2SLUijNh.js";
import { r as createChannelReplyTransform } from "./reply-transform-RgLq9qxY.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-BwEX74oR.js";
import { t as resolveAgentOutboundIdentity } from "./identity-DJO8OA6r.js";
//#region src/cron/isolated-agent/delivery-outbound.runtime.ts
function resolveCronChannelReplyTransform(params) {
	const channelId = normalizeAnyChannelId(params.channel) ?? params.channel;
	const messaging = getLoadedChannelPluginForRead(channelId)?.messaging;
	const transform = createChannelReplyTransform({
		...params,
		messaging
	});
	return transform ? { apply: transform } : void 0;
}
//#endregion
export { buildOutboundSessionContext, createOutboundSendDeps, durableMessageBatchMayHaveReachedRecipient, enqueueSystemEvent, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore };
