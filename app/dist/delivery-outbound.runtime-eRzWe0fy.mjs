import { t as normalizeAnyChannelId } from "./registry-normalize-DzsBlXGu.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-U-7eR7Vu.mjs";
import { i as enqueueSystemEvent } from "./system-events-a6gEP3M4.mjs";
import { t as buildOutboundSessionContext } from "./session-context-DaL_V0d6.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-Dwx0W5c0.mjs";
import "./runtime-iZMly06B.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-BCevJt90.mjs";
import { n as resolveAgentOutboundIdentity } from "./identity-BlxuPk7f.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
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
