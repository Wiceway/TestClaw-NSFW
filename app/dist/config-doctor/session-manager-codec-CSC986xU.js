import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./transcript-payload-BaqIXvVM.js";
import { f as selectSessionTranscriptLeafControlledPath } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { t as buildSessionContext$1 } from "./session-BKH3neS_.js";
import { i as logWarn } from "./logger-DgjIIHeT.js";
import { randomUUID } from "node:crypto";
import { stripCompactionReplayCheckpointInPlace } from "@testclaw/ai/transports";
//#region packages/agent-core/src/harness/session/uuid.ts
let lastTimestamp = -Infinity;
let sequence = 0;
function fillRandomBytes(bytes) {
	const crypto = globalThis.crypto;
	if (crypto?.getRandomValues) {
		crypto.getRandomValues(bytes);
		return;
	}
	for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
}
/** Generate a monotonic UUIDv7 string. */
function uuidv7() {
	const random = /* @__PURE__ */ new Uint8Array(16);
	fillRandomBytes(random);
	const timestamp = Date.now();
	if (timestamp > lastTimestamp) {
		sequence = new DataView(random.buffer, random.byteOffset + 6, 4).getUint32(0);
		lastTimestamp = timestamp;
	} else {
		sequence = sequence + 1 >>> 0;
		if (sequence === 0) lastTimestamp++;
	}
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	bytes[0] = lastTimestamp / 1099511627776 & 255;
	bytes[1] = lastTimestamp / 4294967296 & 255;
	bytes[2] = lastTimestamp / 16777216 & 255;
	bytes[3] = lastTimestamp / 65536 & 255;
	bytes[4] = lastTimestamp / 256 & 255;
	bytes[5] = lastTimestamp & 255;
	bytes[6] = 112 | sequence >>> 28 & 15;
	bytes[7] = sequence >>> 20 & 255;
	bytes[8] = 128 | sequence >>> 14 & 63;
	bytes[9] = sequence >>> 6 & 255;
	const randomLowBits = random.at(10);
	if (randomLowBits === void 0) throw new Error("UUID random buffer is shorter than 11 bytes");
	bytes[10] = (sequence & 63) << 2 | randomLowBits & 3;
	bytes.set(random.subarray(11), 11);
	return formatUuid(bytes);
}
function formatUuid(bytes) {
	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
	return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
//#endregion
//#region src/agents/sessions/session-manager-id.ts
function createManagedSessionId() {
	return uuidv7();
}
function generateSessionEntryId() {
	return randomUUID();
}
//#endregion
//#region src/agents/sessions/session-manager-codec.ts
function isTalkRealtimeVoiceEntry(entry) {
	if (entry.type !== "message" || entry.message.role !== "user" && entry.message.role !== "assistant") return false;
	const provenance = Reflect.get(entry.message, "provenance");
	return isRecord(provenance) && provenance.kind === "realtime_voice" && provenance.sourceChannel === "talk";
}
function isSessionContextMetadataEntry(entry) {
	return entry.type === "thinking_level_change" || entry.type === "model_change" || entry.type === "custom" || entry.type === "label" || entry.type === "session_info";
}
function migrateSessionFileEntryToCurrentVersion(entry, originalIndex, state) {
	if (state.sourceVersion < 2) {
		if (entry.type === "session") entry.version = 2;
		else {
			entry.id = state.createEntryId(originalIndex);
			entry.parentId = state.previousId;
			state.previousId = entry.id;
			if (entry.type === "compaction") {
				const compaction = entry;
				if (typeof compaction.firstKeptEntryIndex === "number") {
					const firstKeptEntryId = state.resolveOriginalEntryId?.(compaction.firstKeptEntryIndex);
					if (firstKeptEntryId) compaction.firstKeptEntryId = firstKeptEntryId;
					delete compaction.firstKeptEntryIndex;
				}
			}
		}
	}
	if (state.sourceVersion < 3) {
		if (entry.type === "session") entry.version = 3;
		else if (entry.type === "message" && entry.message) {
			const message = entry.message;
			if (message.role === "hookMessage") {
				message.role = "custom";
				message.customType ||= "hook";
			}
		}
	}
}
function migrateToCurrentVersion(entries, entriesByOriginalIndex) {
	const version = entries.find((entry) => entry.type === "session")?.version ?? 1;
	if (version >= 3) return false;
	const state = {
		createEntryId: generateSessionEntryId,
		previousId: null,
		resolveOriginalEntryId: (originalIndex) => {
			const targetEntry = entriesByOriginalIndex ? entriesByOriginalIndex[originalIndex] : entries[originalIndex];
			return targetEntry && targetEntry.type !== "session" ? targetEntry.id : void 0;
		},
		sourceVersion: version
	};
	for (const [index, entry] of entries.entries()) migrateSessionFileEntryToCurrentVersion(entry, index, state);
	return true;
}
function migrateSessionEntries(entries) {
	migrateToCurrentVersion(entries);
}
function parseSessionEntries(content) {
	return parseJsonlEntries(content);
}
function getLatestCompactionEntry(entries) {
	for (let index = entries.length - 1; index >= 0; index -= 1) {
		const entry = entries[index];
		if (entry.type === "reset") return null;
		if (entry.type === "compaction") return entry;
	}
	return null;
}
function buildSessionContext(entries, leafId, byIdInput) {
	let contextEntries = entries;
	let contextById = byIdInput;
	if (leafId === void 0) {
		const selectedEntries = selectSessionTranscriptLeafControlledPath(entries);
		if (selectedEntries !== void 0) {
			contextEntries = selectedEntries;
			contextById = void 0;
		}
	}
	let byId = contextById;
	if (!byId) {
		byId = /* @__PURE__ */ new Map();
		for (const entry of contextEntries) byId.set(entry.id, entry);
	}
	if (leafId === null) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	let leaf = leafId ? byId.get(leafId) : void 0;
	leaf ??= contextEntries.at(-1);
	if (!leaf) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	const path = [];
	const seen = /* @__PURE__ */ new Set();
	let current = leaf;
	while (current && !seen.has(current.id)) {
		seen.add(current.id);
		path.push(current);
		current = current.parentId ? byId.get(current.parentId) : void 0;
	}
	path.reverse();
	return buildSessionContext$1(path);
}
function parseJsonlEntries(content) {
	const entries = [];
	let skipped = 0;
	for (const line of content.trim().split("\n")) {
		if (!line.trim()) continue;
		try {
			entries.push(normalizeLoadedFileEntry(JSON.parse(line)));
		} catch {
			skipped += 1;
		}
	}
	if (skipped > 0) logWarn(`parseJsonlEntries: skipped ${skipped} malformed JSONL line(s) — ${entries.length} valid entries were loaded`);
	return entries;
}
function normalizeLoadedFileEntry(entry) {
	if (!isRecord(entry) || entry.type !== "message" || !isRecord(entry.message)) return entry;
	const message = entry.message;
	if ((message.role === "assistant" || message.role === "toolResult") && typeof message.content === "string") {
		message.content = [{
			type: "text",
			text: message.content
		}];
		stripCompactionReplayCheckpointInPlace(message);
	} else if (message.role === "toolResult" && isRecord(message.content)) message.content = [message.content];
	return entry;
}
//#endregion
export { migrateSessionEntries as a, normalizeLoadedFileEntry as c, generateSessionEntryId as d, uuidv7 as f, isTalkRealtimeVoiceEntry as i, parseSessionEntries as l, getLatestCompactionEntry as n, migrateSessionFileEntryToCurrentVersion as o, isSessionContextMetadataEntry as r, migrateToCurrentVersion as s, buildSessionContext as t, createManagedSessionId as u };
