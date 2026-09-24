import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
import { t as resolveConversationLabel } from "../conversation-label-HUbz4wLk.mjs";
import { a as registerSessionBindingAdapter, o as testing, s as unregisterSessionBindingAdapter, t as getSessionBindingService } from "../session-binding-service-Bi4qYPkN.mjs";
import { a as buildPluginBindingResolvedText, d as parsePluginBindingApprovalCustomId, n as buildPluginBindingApprovalCustomId, p as resolvePluginConversationBindingApproval } from "../conversation-binding-BzujlTXm.mjs";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-Ceyofg5t.mjs";
import { t as recordInboundSession } from "../session-B4HxgGZT.mjs";
import { t as buildPairingReply } from "../pairing-messages-KnmmBInU.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "../pairing-store-CDP5xkHN.mjs";
import { n as resolveThreadBindingLifecycle } from "../thread-binding-lifecycle-Cj9qM4Hm.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, i as resolveThreadBindingIdleTimeoutMs, l as resolveThreadBindingsEnabled, n as formatThreadBindingSpawnDisabledError, o as resolveThreadBindingMaxAgeMs, r as resolveThreadBindingEffectiveExpiresAt, s as resolveThreadBindingMaxAgeMsForChannel, t as formatThreadBindingDisabledError } from "../thread-bindings-policy-toE2K7ZV.mjs";
import { i as resolveThreadBindingThreadName, n as resolveThreadBindingFarewellText, r as resolveThreadBindingIntroText, t as formatThreadBindingDurationLabel } from "../thread-bindings-messages-Br2Pei4z.mjs";
import { n as createStaticReplyToModeResolver, r as createTopLevelChannelReplyToModeResolver, t as createScopedAccountReplyToModeResolver } from "../threading-helpers-CMXJIj4M.mjs";
import "../channel-access-compat-B01k35iO.mjs";
import { i as resolveRuntimeConversationBindingRoute, r as resolveConfiguredBindingRoute, t as ensureConfiguredBindingRouteReady } from "../binding-routing-DxomN5UI.mjs";
import { t as resolveThreadBindingConversationIdFromBindingId } from "../thread-binding-id-BkjTVQEq.mjs";
import { t as resolvePairingIdLabel } from "../pairing-labels-M4JGK-dY.mjs";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("../inbound.runtime-zQaQaVWk.mjs"));
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordInboundSessionMeta({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { buildPairingReply, buildPluginBindingApprovalCustomId, buildPluginBindingResolvedText, createScopedAccountReplyToModeResolver, createStaticReplyToModeResolver, createTopLevelChannelReplyToModeResolver, ensureConfiguredBindingRouteReady, formatThreadBindingDisabledError, formatThreadBindingDurationLabel, formatThreadBindingSpawnDisabledError, getSessionBindingService, parsePluginBindingApprovalCustomId, readChannelAllowFromStore, recordInboundSession, recordInboundSessionMetaSafe, registerSessionBindingAdapter, resolveConfiguredBindingRoute, resolveConversationLabel, resolvePairingIdLabel, resolvePinnedMainDmOwnerFromAllowlist, resolvePluginConversationBindingApproval, resolveRuntimeConversationBindingRoute, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingEffectiveExpiresAt, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMs, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingIntroText, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMs, resolveThreadBindingMaxAgeMsForChannel, resolveThreadBindingSpawnPolicy, resolveThreadBindingThreadName, resolveThreadBindingsEnabled, testing, unregisterSessionBindingAdapter, upsertChannelPairingRequest };
