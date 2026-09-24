import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { h as isFutureDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
//#region src/channels/message/outbound-echo-state.ts
const OUTBOUND_MESSAGE_IDENTITIES_KEY = Symbol.for("testclaw.outboundMessageIdentities");
function resolveState() {
	const globalStore = globalThis;
	const existing = globalStore[OUTBOUND_MESSAGE_IDENTITIES_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[OUTBOUND_MESSAGE_IDENTITIES_KEY] = created;
	return created;
}
const outboundMessageIdentities = resolveState();
//#endregion
//#region src/channels/message/outbound-echo.ts
function resolveIdentityKeys(identity) {
	const channel = normalizeLowercaseStringOrEmpty(identity.channel);
	const conversationId = identity.conversationId.trim();
	if (!channel || !conversationId) return [];
	const scope = [
		channel,
		normalizeAccountId(identity.accountId),
		conversationId
	];
	const keys = [];
	const messageId = identity.messageId?.trim();
	if (messageId) keys.push(JSON.stringify([
		...scope,
		"message",
		messageId
	]));
	const sourceId = identity.sourceId?.trim();
	if (sourceId) keys.push(JSON.stringify([
		...scope,
		"source",
		sourceId
	]));
	return keys;
}
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
function isRecentOutboundMessageIdentity(identity) {
	for (const key of resolveIdentityKeys(identity)) {
		const expiresAt = outboundMessageIdentities.get(key);
		if (expiresAt === void 0) continue;
		if (!isFutureDateTimestampMs(expiresAt)) {
			outboundMessageIdentities.delete(key);
			continue;
		}
		return true;
	}
	return false;
}
//#endregion
export { isRecentOutboundMessageIdentity as t };
