import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { o as getPluginCache } from "./plugin-cache-CsUjLuei.js";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-QV2nsx8w.js";
import { d as readPluginCacheDirectory, p as readPluginCacheJsonFile } from "./package-manifest-DmftnIsu.js";
import { o as resolveBundledPluginsDir } from "./bundled-dir-wAZIVp2F.js";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-BtlvWnLR.js";
import path from "node:path";
//#region src/channels/bundled-channel-catalog-read.ts
/**
* Bundled channel catalog reader.
*
* Loads channel metadata from generated package catalogs and bundled plugin package manifests.
*/
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function listPackageRoots() {
	return uniqueStrings([resolveAssistantPackageRootSync({ cwd: process.cwd() }), resolveAssistantPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry)));
}
function readBundledExtensionCatalogEntriesSync(pluginsDir) {
	if (!pluginsDir) return [];
	try {
		return readPluginCacheDirectory(pluginsDir).filter((entry) => entry.isDirectory()).flatMap((entry) => {
			const packageJsonPath = path.join(pluginsDir, entry.name, "package.json");
			const parsed = readPluginCacheJsonFile(packageJsonPath);
			return parsed.ok && isRecord(parsed.value) ? [parsed.value] : [];
		});
	} catch {
		return [];
	}
}
function readOfficialCatalogFileSync() {
	const bundledExternalEntries = BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.filter((entry) => typeof entry === "object" && entry !== null);
	for (const packageRoot of listPackageRoots()) {
		const candidate = path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH);
		const payload = readPluginCacheJsonFile(candidate);
		if (payload.ok && isRecord(payload.value)) {
			const entries = Array.isArray(payload.value.entries) ? payload.value.entries.filter((entry) => isRecord(entry)) : [];
			return [...bundledExternalEntries, ...entries];
		}
	}
	return bundledExternalEntries;
}
function isChannelCatalogEntryLike(entry) {
	return "testclaw" in entry;
}
function toBundledChannelEntry(entry) {
	const channel = isChannelCatalogEntryLike(entry) ? entry.testclaw?.channel : entry;
	const id = normalizeOptionalLowercaseString(channel?.id);
	if (!id || !channel) return null;
	return {
		id,
		channel,
		aliases: Array.isArray(channel.aliases) ? channel.aliases.map((alias) => normalizeOptionalLowercaseString(alias)).filter((alias) => Boolean(alias)) : [],
		order: typeof channel.order === "number" && Number.isFinite(channel.order) ? channel.order : Number.MAX_SAFE_INTEGER
	};
}
/**
* Lists bundled channel catalog entries from package manifests and generated catalog files.
*/
function listBundledChannelCatalogEntries() {
	const pluginsDir = resolveBundledPluginsDir();
	const catalogs = getPluginCache().metadata.bundledChannelCatalogs;
	const key = JSON.stringify([process.cwd(), pluginsDir]);
	const cached = catalogs.get(key);
	if (cached) return cached;
	const entries = /* @__PURE__ */ new Map();
	for (const entry of readBundledExtensionCatalogEntriesSync(pluginsDir)) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, channelEntry);
	}
	for (const entry of readOfficialCatalogFileSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
	}
	const catalog = Array.from(entries.values()).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
	catalogs.set(key, catalog);
	return catalog;
}
/** Finds bundled or generated channel metadata by id or alias. */
function findBundledChannelCatalogMetadata(channelId) {
	const normalized = normalizeOptionalLowercaseString(channelId);
	if (!normalized) return;
	return listBundledChannelCatalogEntries().find((entry) => entry.id === normalized || entry.aliases.includes(normalized))?.channel;
}
//#endregion
//#region src/channels/bundled-channel-ids.generated.ts
const GENERATED_BUNDLED_CHANNEL_IDS = [
	{
		channelId: "a2a",
		order: 75,
		label: "A2A"
	},
	{
		channelId: "buzz",
		order: 56,
		label: "Buzz"
	},
	{
		channelId: "clickclack",
		order: 85,
		label: "ClickClack"
	},
	{
		channelId: "discord",
		label: "Discord"
	},
	{
		channelId: "feishu",
		aliases: ["lark"],
		order: 35,
		label: "Feishu"
	},
	{
		channelId: "googlechat",
		aliases: ["gchat", "google-chat"],
		order: 55,
		label: "Google Chat"
	},
	{
		channelId: "imessage",
		aliases: ["imsg"],
		label: "iMessage"
	},
	{
		channelId: "irc",
		aliases: ["internet-relay-chat"],
		label: "IRC"
	},
	{
		channelId: "line",
		order: 75,
		label: "LINE"
	},
	{
		channelId: "matrix",
		order: 70,
		label: "Matrix"
	},
	{
		channelId: "mattermost",
		order: 65,
		label: "Mattermost"
	},
	{
		channelId: "msteams",
		aliases: ["teams"],
		order: 60,
		label: "Microsoft Teams"
	},
	{
		channelId: "nextcloud-talk",
		aliases: ["nc", "nc-talk"],
		order: 65,
		label: "Nextcloud Talk"
	},
	{
		channelId: "nostr",
		order: 55,
		label: "Nostr"
	},
	{
		channelId: "qa-channel",
		order: 999,
		configurable: false,
		label: "QA Channel"
	},
	{
		channelId: "raft",
		order: 72,
		label: "Raft"
	},
	{
		channelId: "reef",
		label: "Reef"
	},
	{
		channelId: "signal",
		label: "Signal"
	},
	{
		channelId: "slack",
		label: "Slack"
	},
	{
		channelId: "sms",
		order: 88,
		label: "SMS"
	},
	{
		channelId: "synology-chat",
		order: 90,
		label: "Synology Chat"
	},
	{
		channelId: "telegram",
		label: "Telegram"
	},
	{
		channelId: "tlon",
		order: 90,
		label: "Tlon"
	},
	{
		channelId: "twitch",
		aliases: ["twitch-chat"],
		label: "Twitch"
	},
	{
		channelId: "whatsapp",
		label: "WhatsApp"
	},
	{
		channelId: "zalo",
		aliases: ["zl"],
		order: 80,
		label: "Zalo"
	},
	{
		channelId: "zalouser",
		aliases: ["zlu"],
		order: 85,
		label: "Zalo Personal"
	}
];
//#endregion
//#region src/channels/ids.ts
/**
* Built-in chat channel ids and aliases.
*
* Derives canonical ids from generated bundled channel metadata with runtime catalog fallback.
*/
function listBundledChatChannelEntries() {
	return GENERATED_BUNDLED_CHANNEL_IDS.filter((entry) => entry.configurable !== false).map((entry) => ({
		id: normalizeOptionalLowercaseString(entry.channelId) ?? entry.channelId,
		aliases: entry.aliases ?? [],
		label: entry.label?.trim() || void 0,
		order: entry.order ?? Number.MAX_SAFE_INTEGER
	})).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id, "en", { sensitivity: "base" }));
}
const BUNDLED_CHAT_CHANNEL_ENTRIES = Object.freeze(listBundledChatChannelEntries());
const CHAT_CHANNEL_ID_SET = new Set(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Stable built-in channel order derived from generated bundled channel metadata.
*/
const CHAT_CHANNEL_ORDER = Object.freeze(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Alias retained for callers that still refer to chat channel ordering as channel ids.
*/
const CHANNEL_IDS = CHAT_CHANNEL_ORDER;
/**
* Maps configured built-in channel aliases to canonical chat channel ids.
*/
const CHAT_CHANNEL_ALIASES = Object.freeze(Object.fromEntries(BUNDLED_CHAT_CHANNEL_ENTRIES.flatMap((entry) => entry.aliases.map((alias) => [alias, entry.id]))));
/** Finds the generated operator-facing label for a built-in channel id or alias. */
function findChatChannelLabel(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return BUNDLED_CHAT_CHANNEL_ENTRIES.find((entry) => entry.id === resolved)?.label;
}
function normalizeRuntimeBundledChatChannelId(normalized) {
	for (const entry of listBundledChannelCatalogEntries()) if (entry.id === normalized || entry.aliases.includes(normalized)) return entry.id;
	return null;
}
/**
* Normalizes a raw chat channel id or alias to a known canonical built-in channel id.
*/
function normalizeChatChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return CHAT_CHANNEL_ID_SET.has(resolved) ? resolved : normalizeRuntimeBundledChatChannelId(normalized);
}
//#endregion
export { findBundledChannelCatalogMetadata as a, normalizeChatChannelId as i, CHAT_CHANNEL_ORDER as n, listBundledChannelCatalogEntries as o, findChatChannelLabel as r, CHANNEL_IDS as t };
