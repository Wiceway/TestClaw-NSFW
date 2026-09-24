import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { o as resolveBundledPluginsDir } from "./bundled-dir-wAZIVp2F.js";
import { n as CHAT_CHANNEL_ORDER, o as listBundledChannelCatalogEntries } from "./ids-Bp7HxmUs.js";
import { t as buildManifestChannelMeta } from "./channel-meta-BgTks57p.js";
//#region src/channels/chat-meta-shared.ts
/**
* Built-in chat channel metadata builder.
*
* Converts bundled channel catalog entries into setup/status metadata records.
*/
const CHAT_CHANNEL_ID_SET = new Set(CHAT_CHANNEL_ORDER);
function toChatChannelMeta(params) {
	const label = normalizeOptionalString(params.channel.label);
	if (!label) throw new Error(`Missing label for bundled chat channel "${params.id}"`);
	return buildManifestChannelMeta({
		id: params.id,
		channel: params.channel,
		label,
		selectionLabel: normalizeOptionalString(params.channel.selectionLabel) || label,
		docsPath: normalizeOptionalString(params.channel.docsPath) || `/channels/${params.id}`,
		docsLabel: normalizeOptionalString(params.channel.docsLabel),
		blurb: normalizeOptionalString(params.channel.blurb) || "",
		detailLabel: normalizeOptionalString(params.channel.detailLabel),
		systemImage: normalizeOptionalString(params.channel.systemImage),
		arrayFieldMode: "non-empty"
	});
}
function buildChatChannelMetaById() {
	const entries = /* @__PURE__ */ new Map();
	for (const entry of listBundledChannelCatalogEntries()) {
		const rawId = normalizeOptionalString(entry.id);
		if (!rawId || !CHAT_CHANNEL_ID_SET.has(rawId)) continue;
		const id = rawId;
		entries.set(id, toChatChannelMeta({
			id,
			channel: entry.channel
		}));
	}
	return Object.freeze(Object.fromEntries(entries));
}
//#endregion
//#region src/channels/chat-meta.ts
let chatChannelMetaCache;
function getChatChannelMetaById() {
	const cacheKey = resolveBundledPluginsDir(process.env) ?? "";
	if (chatChannelMetaCache?.cacheKey !== cacheKey) chatChannelMetaCache = {
		cacheKey,
		metaById: buildChatChannelMetaById()
	};
	return chatChannelMetaCache.metaById;
}
/**
* Lists built-in chat channel metadata in configured display order.
*/
function listChatChannels() {
	const metaById = getChatChannelMetaById();
	return CHAT_CHANNEL_ORDER.map((id) => metaById[id]).filter((meta) => Boolean(meta));
}
/**
* Returns metadata for one built-in chat channel id.
*/
/** Drift-tolerant lookup: undefined when the id is missing from the bundled catalog. */
function findChatChannelMeta(id) {
	return getChatChannelMetaById()[id];
}
//#endregion
export { listChatChannels as n, findChatChannelMeta as t };
