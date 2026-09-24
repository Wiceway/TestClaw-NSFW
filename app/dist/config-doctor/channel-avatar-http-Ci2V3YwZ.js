import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.js";
import { l as readMediaBuffer } from "./store-CiT93cXA.js";
import { o as resolveInboundMediaReference } from "./media-reference-DHQmzlyp.js";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-CZsTEX7b.js";
import "./control-ui-contract-qsmKbQXB.js";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-C8sXVcwB.js";
import { l as sendMethodNotAllowed, y as respondNotFound } from "./http-common-B6Aa-Wrt.js";
import "./http-utils-mwsAlJoy.js";
import { o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-CnGLFdEg.js";
//#region src/gateway/channel-avatar-http.ts
const CHANNEL_AVATAR_CACHE_MAX_ENTRIES = 128;
const channelAvatarCache = /* @__PURE__ */ new Map();
const getSessionStoreModule = createLazyRuntimeModule(() => import("./session-utils-store-h2-b9XJn.js"));
function touchChannelAvatarCache(sessionKey, reference) {
	const cached = channelAvatarCache.get(sessionKey);
	if (!cached || cached.reference !== reference) return;
	channelAvatarCache.delete(sessionKey);
	channelAvatarCache.set(sessionKey, cached);
	return cached.image;
}
async function loadChannelAvatar(sessionKey, reference) {
	const cached = touchChannelAvatarCache(sessionKey, reference);
	if (cached) return cached;
	const resolved = await resolveInboundMediaReference(reference);
	if (!resolved) return;
	const stored = await readMediaBuffer(resolved.id, "inbound", HTTP_IMAGE_MAX_BYTES);
	const image = await resolveHttpImageRepresentation(resolved.id, stored.buffer);
	if (!image) return;
	channelAvatarCache.delete(sessionKey);
	channelAvatarCache.set(sessionKey, {
		reference,
		image
	});
	pruneMapToMaxSize(channelAvatarCache, CHANNEL_AVATAR_CACHE_MAX_ENTRIES);
	return image;
}
/** Serves the current channel-avatar snapshot for an owner-visible session. */
async function handleChannelAvatarHttpRequest(req, res, opts) {
	const pathname = req.url ? new URL(req.url, "http://localhost").pathname : void 0;
	const parsed = parseControlUiResourcePath("channelAvatar", pathname, opts.basePath);
	if (!parsed.matched) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestAuth = await authorizeControlUiSessionOwnerReadRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	if (!parsed.value) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let reference;
	try {
		const { entry } = (await getSessionStoreModule()).loadGatewaySessionEntryReadOnly(parsed.value, { clone: false });
		reference = sessionDeliveryOrigin(entry)?.avatar;
	} catch {}
	requestAuth.assertCurrent();
	if (!reference) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let image;
	try {
		image = await loadChannelAvatar(parsed.value, reference);
	} catch {}
	requestAuth.assertCurrent();
	if (!image) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image,
		filename: "channel-avatar"
	});
	return true;
}
//#endregion
export { handleChannelAvatarHttpRequest };
