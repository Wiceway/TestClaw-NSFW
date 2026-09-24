import "./agent-harness-runtime-DNhAy8yX.js";
import { x as ChannelMeta } from "./types.core-DUehY8AL.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./types.plugin-YVpMGCxm.js";
import "./types.public-CFZVjq90.js";
import "./config-schema-edRW2Mnr.js";
import "./setup-helpers-CO8RKx0A.js";
import "./config-helpers-BXJSV8ds.js";
import "./helpers-o_NiTJZ2.js";
//#region src/channels/chat-meta-shared.d.ts
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
type ChatChannelMeta = ChannelMeta;
//#endregion
//#region src/channels/chat-meta.d.ts
/**
 * Returns metadata for one built-in chat channel id.
 * Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
 * violation; drift-tolerant core paths use findChatChannelMeta instead.
 */
declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
//#endregion
export { getChatChannelMeta as t };