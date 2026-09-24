import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, o as prepareSqliteQueryIterator, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { r as hasSqlitePostCommitScope } from "./sqlite-post-commit-Cresg45I.js";
import { V as coerceRequiredSqliteNumber } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { c as transcriptEventModelNavigationSql, l as transcriptEventNavigationSql, o as transcriptEventJsonSql, u as transcriptEventResetNavigationSql } from "./transcript-payload-BaqIXvVM.js";
import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { f as selectResetKeptEntries } from "./tool-result-pairing-9JojAaN6.js";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-Dw0_36rK.js";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Oplb6Sva.js";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { i as SessionTranscriptReadFenceError, n as SessionTranscriptStorageUnavailableError, s as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-D01U6hs1.js";
import { toUSVString } from "node:util";
import { sql } from "kysely";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark-read.ts
function prepareHotWatermarkQuery(database) {
	const db = getNodeSqliteKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectNoFrom((eb) => [eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId).as("max_seq"), eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation")]);
	});
}
const hotWatermarkQueries = /* @__PURE__ */ new WeakMap();
/** Reads hot append and rewrite tokens together on the caller's admitted connection. */
function readSessionTranscriptHotWatermark(database, sessionId) {
	let query = hotWatermarkQueries.get(database.db);
	if (!query) {
		query = prepareHotWatermarkQuery(database.db);
		hotWatermarkQueries.set(database.db, query);
	}
	const row = query(sessionId);
	return {
		generation: row?.generation ?? null,
		maxSeq: row?.max_seq ?? null
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-visible-cursor.ts
const VISIBLE_MESSAGE_CURSOR_VERSION = 1;
const DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES = 1e3;
const DEFAULT_VISIBLE_MESSAGE_MAX_BYTES = 1e6;
const MAX_VISIBLE_MESSAGE_MAX_MESSAGES = 1e4;
const MAX_VISIBLE_MESSAGE_MAX_BYTES = 67108864;
function normalizeVisibleMessageLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeVisibleMessageCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function createVisibleMessageCursor(params) {
	return {
		...params,
		lastEventSeq: -1,
		lastMessagePosition: -1,
		version: VISIBLE_MESSAGE_CURSOR_VERSION
	};
}
function parseVisibleMessageCursor(value) {
	if (value.length > 4096) return;
	try {
		const bytes = Buffer.from(value, "base64url");
		if (bytes.toString("base64url") !== value) return;
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (parsed.version !== VISIBLE_MESSAGE_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || typeof parsed.lastEventSeq !== "number" || !Number.isSafeInteger(parsed.lastEventSeq) || parsed.lastEventSeq < -1 || typeof parsed.lastMessagePosition !== "number" || !Number.isSafeInteger(parsed.lastMessagePosition) || parsed.lastMessagePosition < -1 || parsed.lastEventSeq === -1 !== (parsed.lastMessagePosition === -1)) return;
		const cursor = {
			agentId: parsed.agentId,
			generation: parsed.generation,
			sessionId: parsed.sessionId,
			lastEventSeq: parsed.lastEventSeq,
			lastMessagePosition: parsed.lastMessagePosition,
			version: parsed.version
		};
		return encodeVisibleMessageCursor(cursor) === value ? cursor : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-raw-delta-read.ts
const RAW_TRANSCRIPT_CURSOR_VERSION = 1;
const DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS = 1e3;
const DEFAULT_RAW_TRANSCRIPT_MAX_BYTES = 1e6;
const MAX_RAW_TRANSCRIPT_EVENTS = 1e4;
const MAX_RAW_TRANSCRIPT_BYTES = 67108864;
function encodeRawTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
/** Mint the raw-delta cursor for a generation-consistent transcript snapshot. */
function createTranscriptRawDeltaCursor(params) {
	return encodeRawTranscriptCursor({
		...params,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	});
}
function parseRawTranscriptCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== RAW_TRANSCRIPT_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastSeq) || (parsed.lastSeq ?? -2) < -1) return;
		return parsed;
	} catch {
		return;
	}
}
function bootstrapCursor(scope, generation) {
	return {
		agentId: scope.agentId,
		generation,
		lastSeq: -1,
		sessionId: scope.sessionId,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	};
}
/** Host adapters validate limits before acquiring a database handle. */
function normalizeRawDeltaLimits(limits) {
	return {
		maxEvents: normalizeVisibleMessageLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents"),
		maxBytes: normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes")
	};
}
/** Read inside the caller's validated projection snapshot on its exact connection. */
function readTranscriptRawDeltaFromProjection(projection, limits = {}) {
	const { maxEvents, maxBytes } = normalizeRawDeltaLimits(limits);
	const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	})?.beforeRawSeq;
	return readRawDeltaInTransaction(projection.database.db, projection.resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq, {
		generation: projection.generation,
		indexedSeq: projection.state.indexedSeq
	});
}
/** The caller owns this synchronous snapshot and any already-captured frontier. */
function readRawDeltaInTransaction(database, scope, encodedCursor, maxEvents, maxBytes, beforeEventSeq, snapshot) {
	const watermark = snapshot ? void 0 : readSessionTranscriptHotWatermark({ db: database }, scope.sessionId);
	const generation = snapshot ? snapshot.generation : watermark?.generation ?? void 0;
	if (generation === void 0) return { kind: "missing" };
	const initialCursor = bootstrapCursor(scope, generation);
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeRawTranscriptCursor(initialCursor),
		reason
	});
	const cursor = encodedCursor !== void 0 ? parseRawTranscriptCursor(encodedCursor) : initialCursor;
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== scope.sessionId) return reset("scope_mismatch");
	if (cursor.generation !== generation) return reset("generation_mismatch");
	const transcript = getNodeSqliteKysely(database).selectFrom("transcript_events").where("session_id", "=", scope.sessionId);
	const frontier = snapshot ? snapshot.indexedSeq : watermark?.maxSeq;
	const maxSeq = Math.min(coerceRequiredSqliteNumber(frontier ?? -1), beforeEventSeq === void 0 ? Number.POSITIVE_INFINITY : beforeEventSeq - 1);
	if (cursor.lastSeq > maxSeq) {
		if (beforeEventSeq !== void 0) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		return reset("invalid_cursor");
	}
	let serializedBytes = 0;
	let selectedCount = 0;
	let lastSeq = cursor.lastSeq;
	let hasMore = false;
	let requiredBytes;
	if (lastSeq < maxSeq) {
		const metadataQuery = transcript.select(["seq", sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")]).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).orderBy("seq", "asc");
		for (let batchSize = 32; lastSeq < maxSeq; batchSize *= 2) {
			const limit = Math.min(batchSize, maxEvents + 1 - selectedCount);
			const metadata = executeSqliteQuerySync(database, metadataQuery.where("seq", ">", lastSeq).limit(limit)).rows;
			for (const row of metadata) {
				const rowBytes = coerceRequiredSqliteNumber(row.serialized_bytes);
				if (selectedCount >= maxEvents || serializedBytes + rowBytes > maxBytes) {
					hasMore = true;
					if (selectedCount === 0) requiredBytes = rowBytes;
					break;
				}
				serializedBytes += rowBytes;
				selectedCount += 1;
				lastSeq = coerceRequiredSqliteNumber(row.seq);
			}
			if (hasMore || metadata.length < limit) break;
		}
	}
	const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(database, transcript.select([transcriptEventJsonSql(database).as("event_json"), "seq"]).where("seq", ">", cursor.lastSeq).where("seq", "<=", lastSeq).orderBy("seq", "asc")).rows.map((row) => ({
		event: JSON.parse(row.event_json),
		seq: coerceRequiredSqliteNumber(row.seq)
	}));
	return {
		kind: "page",
		cursor: encodeRawTranscriptCursor({
			...cursor,
			lastSeq
		}),
		events: rows,
		hasMore,
		...requiredBytes !== void 0 ? { requiredBytes } : {},
		serializedBytes
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection-read.ts
const EMPTY_PROJECTION_STATE = {
	activeEventCount: 0,
	activeMessageCount: 0,
	indexedSeq: -1,
	leafEventId: null,
	needsRebuild: false
};
function getActiveTranscriptKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function parseActiveTranscriptMessageRow(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		eventSeq: row.event_seq,
		seq: row.message_position + 1
	};
}
function selectMessageRows(database, sessionId, selection) {
	const query = getActiveTranscriptKysely(database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", sessionId).where("active.message_position", "is not", null).orderBy("active.message_position", "asc");
	return "positions" in selection ? query.where("active.message_position", "in", selection.positions.length <= 500 ? selection.positions : getActiveTranscriptKysely(database).selectFrom((eb) => eb.fn("json_each", [eb.val(JSON.stringify(selection.positions))]).as("requested")).select("requested.value")) : query.where("active.message_position", ">=", selection.start).where("active.message_position", "<", selection.endExclusive);
}
function selectMessagePayload(database, query) {
	return query.select([
		"active.event_seq",
		"active.message_position",
		transcriptEventJsonSql(database.db, "event").as("event_json")
	]);
}
function selectMessageMetadata(query) {
	return query.select(["active.message_position", sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")]).$narrowType();
}
function createMessageRangeReaders(database) {
	const metadata = (direction) => prepareSqliteQueryIterator(database.db, (parameter) => selectMessageMetadata(selectMessageRows(database, parameter((params) => params.sessionId), {
		start: parameter((params) => params.start),
		endExclusive: parameter((params) => params.endExclusive)
	}).clearOrderBy().orderBy("active.message_position", direction)));
	return {
		latest: prepareSqliteQueryTakeFirstSync(database.db, (parameter) => selectMessagePayload(database, selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		})).clearOrderBy().orderBy("active.message_position", "desc").limit(1)),
		messages: prepareSqliteQueryIterator(database.db, (parameter) => selectMessagePayload(database, selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		}))),
		metadata: metadata("asc"),
		metadataDescending: metadata("desc")
	};
}
const messageRangeReaders = /* @__PURE__ */ new WeakMap();
function getMessageRangeReaders(database) {
	let readers = messageRangeReaders.get(database.db);
	if (!readers) {
		readers = createMessageRangeReaders(database);
		messageRangeReaders.set(database.db, readers);
	}
	return readers;
}
function buildProjectionSnapshotQuery(database, sessionId) {
	const db = getActiveTranscriptKysely(database);
	const target = db.selectNoFrom(sessionId.as("session_id")).as("target");
	return db.selectFrom(target).leftJoin("session_transcript_index_state as state", "state.session_id", "target.session_id").leftJoin("transcript_rewrite_watermarks as watermark", "watermark.session_id", "target.session_id").select([
		"watermark.generation",
		"state.active_event_count",
		"state.active_message_count",
		"state.indexed_seq",
		"state.leaf_event_id",
		"state.needs_rebuild"
	]).select((eb) => [
		eb.selectFrom("transcript_events").select(({ fn }) => fn.max("seq").as("latest_seq")).whereRef("transcript_events.session_id", "=", "target.session_id").as("latest_seq"),
		eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").whereRef("session_transcript_cold_archives.session_id", "=", "target.session_id")).as("is_cold"),
		eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").whereRef("session_transcript_active_events.session_id", "=", "target.session_id").where("context_eligible", "is", null)).as("has_unclassified"),
		eb.not(eb.exists(eb.selectFrom("transcript_event_identities as identity").select("identity.seq").whereRef("identity.session_id", "=", "target.session_id").where("identity.seq", "=", eb.selectFrom("transcript_events as first_event").select("first_event.seq").whereRef("first_event.session_id", "=", "target.session_id").orderBy("first_event.seq", "asc").limit(1)))).as("has_unindexed_prefix")
	]);
}
const projectionSnapshotReaders = /* @__PURE__ */ new WeakMap();
function readProjectionSnapshot(database, sessionId) {
	let read = projectionSnapshotReaders.get(database.db);
	if (!read) {
		read = prepareSqliteQuerySync(database.db, (parameter) => buildProjectionSnapshotQuery(database, parameter((id) => id)));
		projectionSnapshotReaders.set(database.db, read);
	}
	const row = read(sessionId).rows[0];
	return {
		cold: Boolean(row.is_cold),
		generation: row.generation ?? void 0,
		hasUnclassified: Boolean(row.has_unclassified),
		hasUnindexedPrefix: Boolean(row.has_unindexed_prefix),
		latestSeq: row.latest_seq,
		...typeof row.indexed_seq === "number" ? { state: {
			activeEventCount: row.active_event_count ?? 0,
			activeMessageCount: row.active_message_count ?? 0,
			indexedSeq: row.indexed_seq,
			leafEventId: row.leaf_event_id,
			needsRebuild: row.needs_rebuild !== 0
		} } : {}
	};
}
/** Read one admitted connection without acquiring a writer or scheduling reconciliation. */
function readCurrentProjectionSnapshot(database, resolved, read) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const snapshot = readProjectionSnapshot(database, resolved.sessionId);
		if (snapshot.cold) throw new SessionTranscriptColdError(resolved.sessionId);
		if (snapshot.latestSeq === null) return {
			kind: "value",
			value: read({
				database,
				generation: snapshot.generation,
				hasUnindexedPrefix: false,
				resolved,
				state: EMPTY_PROJECTION_STATE
			})
		};
		if (snapshot.state && !snapshot.state.needsRebuild && snapshot.state.indexedSeq === snapshot.latestSeq && !snapshot.hasUnclassified) return {
			kind: "value",
			value: read({
				database,
				generation: snapshot.generation,
				hasUnindexedPrefix: snapshot.hasUnindexedPrefix,
				resolved,
				state: snapshot.state
			})
		};
		return { kind: "unavailable" };
	}, {
		databaseLabel: database.path,
		operationLabel: "sessions.history.read"
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
function withCurrentProjectionSnapshot(scope, read, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const readSnapshot = (database) => readCurrentProjectionSnapshot(database, resolved, read);
	const result = options.readOnly ? withAssistantAgentDatabaseReadOnly(readSnapshot, databaseOptions) : {
		found: true,
		value: readSnapshot(openAssistantAgentDatabase(databaseOptions))
	};
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	if (result.value.kind === "value") return result.value.value;
	if (!options.readOnly) startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-navigation.ts
function parseNavigation(eventJson) {
	const parsed = JSON.parse(eventJson);
	if (!isRecord(parsed)) return;
	const { type, id, parentId, targetId, appendParentId, appendMode, firstKeptEntryId, customType, display } = parsed;
	return {
		type,
		id,
		parentId,
		targetId,
		appendParentId,
		appendMode,
		firstKeptEntryId,
		customType,
		display
	};
}
function navigationCandidatesSql(event, candidate) {
	const match = candidate.key === "type" ? sql`member.value IN ('reset', 'compaction', 'custom_message')` : candidate.eventIds.length > 32 ? sql`1` : candidate.eventIds.length === 1 ? sql`instr(member.value, ${candidate.eventIds[0]}) > 0` : sql`EXISTS (SELECT 1 FROM json_each(${JSON.stringify(candidate.eventIds)}) AS requested
        WHERE instr(member.value, requested.value) > 0)`;
	return sql`CASE WHEN json_valid(${event}) THEN EXISTS (
      SELECT 1 FROM json_each(${event}) AS member
      WHERE member.key = ${candidate.key} AND member.type = 'text' AND ${match}
    ) ELSE 1 END`;
}
function canFilterEventIds(eventIds) {
	return eventIds !== void 0 && eventIds.every((id) => toUSVString(id) === id && !id.includes("\0"));
}
/** Exact legacy handoffs retained raw rows without creating identity ownership. */
function* iterateUnindexedTranscriptNavigation(projection, options = {}) {
	if (!projection.hasUnindexedPrefix || options.eventIds?.length === 0) return;
	const query = getActiveTranscriptKysely(projection.database).selectFrom("transcript_events as event").leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "event.session_id").onRef("identity.seq", "=", "event.seq")).select([
		"event.seq as event_seq",
		transcriptEventResetNavigationSql("event").as("event_json"),
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).where("event.session_id", "=", projection.resolved.sessionId).where("identity.seq", "is", null).$if(canFilterEventIds(options.eventIds), (filtered) => filtered.where(navigationCandidatesSql(transcriptEventNavigationSql("event"), {
		key: "id",
		eventIds: options.eventIds
	}))).$if(options.controlsOnly === true, (filtered) => filtered.where(navigationCandidatesSql(transcriptEventNavigationSql("event"), { key: "type" }))).where("event.seq", "<=", options.maxRawSeq ?? projection.state.indexedSeq).$if(options.afterRawSeq !== void 0, (filtered) => filtered.where("event.seq", ">", options.afterRawSeq)).orderBy("event.seq", "asc");
	for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
		const event = parseNavigation(row.event_json);
		if (event) yield {
			event_seq: row.event_seq,
			serialized_bytes: row.serialized_bytes,
			event
		};
	}
}
function* iterateUnindexedActiveTranscriptNavigation(projection, options = {}) {
	if (!projection.hasUnindexedPrefix || options.eventIds?.length === 0) return;
	const query = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select([
		"active.event_seq",
		"active.active_position",
		"active.message_position",
		transcriptEventResetNavigationSql("event").as("event_json"),
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.seq", "is", null).$if(canFilterEventIds(options.eventIds), (filtered) => filtered.where(navigationCandidatesSql(transcriptEventNavigationSql("event"), {
		key: "id",
		eventIds: options.eventIds
	}))).where("active.event_seq", "<=", options.maxRawSeq ?? projection.state.indexedSeq).$if(options.beforeActivePosition !== void 0, (filtered) => filtered.where("active.active_position", "<", options.beforeActivePosition)).orderBy("active.active_position", options.first ? "asc" : "desc");
	for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
		const event = parseNavigation(row.event_json);
		if (event) yield {
			event_seq: row.event_seq,
			active_position: row.active_position,
			message_position: row.message_position,
			serialized_bytes: row.serialized_bytes,
			event
		};
	}
}
/** Resolve display navigation without assigning identity or idempotency ownership. */
function findUnindexedActiveTranscriptEntry(projection, eventId) {
	for (const row of iterateUnindexedActiveTranscriptNavigation(projection, { eventIds: [eventId] })) if (typeof row.event.id === "string" && row.event.id.trim() === eventId) return row;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-window.ts
function isWindowBoundary(eventType, scope) {
	return eventType === "reset" || scope === "context" && eventType === "compaction";
}
const resetMessageWindowCache = /* @__PURE__ */ new Map();
const MAX_RESET_MESSAGE_WINDOW_CACHE = 64;
const MAX_CACHED_UNINDEXED_CONTROLS = 4096;
function cacheResetMessageWindow(key, entry) {
	resetMessageWindowCache.delete(key);
	resetMessageWindowCache.set(key, entry);
	pruneMapToMaxSize(resetMessageWindowCache, MAX_RESET_MESSAGE_WINDOW_CACHE);
}
/** Imported controls keep raw identity; resolve their active positions in each read snapshot. */
function readUnindexedHistoryControls(projection, beforeRawSeq) {
	if (!projection.hasUnindexedPrefix) return [];
	const coveredThrough = Math.min(projection.state.indexedSeq, (beforeRawSeq ?? Infinity) - 1);
	const snapshot = projection.unindexedHistoryControls;
	if (snapshot && snapshot.coveredThrough >= coveredThrough) return snapshot.coveredThrough === coveredThrough ? snapshot.rows : snapshot.rows.filter((row) => row.event_seq <= coveredThrough);
	const key = `${projection.database.path}\0${projection.resolved.sessionId}\0unindexed-controls`;
	const cacheable = !hasSqlitePostCommitScope(projection.database.db);
	const cached = cacheable ? resetMessageWindowCache.get(key) : void 0;
	const reusable = cached?.database === projection.database.db && "controls" in cached && cached.generation === projection.generation && cached.indexedSeq <= projection.state.indexedSeq ? cached : void 0;
	const controls = [...reusable?.controls ?? []];
	if (!reusable || reusable.indexedSeq < coveredThrough) {
		for (const row of iterateUnindexedTranscriptNavigation(projection, {
			afterRawSeq: reusable?.indexedSeq,
			maxRawSeq: coveredThrough,
			controlsOnly: true
		})) {
			const eventType = row.event.type;
			if (eventType === "reset" || eventType === "compaction" || eventType === "custom_message") controls.push(row);
		}
		if (cacheable) {
			if (controls.length <= MAX_CACHED_UNINDEXED_CONTROLS) cacheResetMessageWindow(key, {
				database: projection.database.db,
				generation: projection.generation,
				indexedSeq: coveredThrough,
				controls
			});
			else resetMessageWindowCache.delete(key);
		}
	}
	const eligible = new Map(controls.filter((row) => row.event_seq <= coveredThrough).map((row) => [row.event_seq, row]));
	const rows = eligible.size === 0 ? [] : executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom(sql`json_each(${JSON.stringify([...eligible.keys()])})`.as("requested")).crossJoin("session_transcript_active_events as active").leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as following", (join) => join.onRef("following.session_id", "=", "active.session_id").on((eb) => eb("following.active_position", "=", eb("active.active_position", "+", 1)))).select([
		"active.event_seq",
		"active.active_position",
		"active.message_position",
		"following.message_position as following_message_position"
	]).where("active.session_id", "=", projection.resolved.sessionId).whereRef("active.event_seq", "=", "requested.value").where("identity.seq", "is", null).orderBy("active.active_position", "asc")).rows.map((row) => Object.assign({}, eligible.get(row.event_seq), row));
	projection.unindexedHistoryControls = {
		coveredThrough,
		rows
	};
	return rows;
}
function readLatestActiveBoundaryMetadataByType(projection, eventType, beforeRawSeq) {
	const db = getActiveTranscriptKysely(projection.database);
	const indexed = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select([
		"active.active_position",
		"identity.event_type",
		"identity.seq"
	]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", eventType).$if(beforeRawSeq !== void 0, (query) => query.where("identity.seq", "<", beforeRawSeq)).orderBy("identity.seq", "desc").limit(1));
	let unindexed;
	for (const row of readUnindexedHistoryControls(projection, beforeRawSeq)) if (row.event.type === eventType && (beforeRawSeq === void 0 || row.event_seq < beforeRawSeq) && (!unindexed || row.event_seq > unindexed.event_seq)) unindexed = row;
	return unindexed && (!indexed || unindexed.event_seq > indexed.seq) ? {
		active_position: unindexed.active_position,
		event_type: eventType,
		seq: unindexed.event_seq
	} : indexed;
}
function readLatestActiveBoundaryMetadata(projection, scope, beforeRawSeq) {
	const reset = readLatestActiveBoundaryMetadataByType(projection, "reset", beforeRawSeq);
	if (scope === "history") return reset;
	const compaction = readLatestActiveBoundaryMetadataByType(projection, "compaction", beforeRawSeq);
	return reset && (!compaction || reset.seq > compaction.seq) ? reset : compaction;
}
function readBoundaryWindowFacts(projection, seq, scope) {
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("transcript_events").select([transcriptEventResetNavigationSql().as("event_json"), sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")]).where("session_id", "=", projection.resolved.sessionId).where("seq", "=", seq).limit(1));
	if (!row) throw new Error("Active transcript boundary is missing");
	const parsed = JSON.parse(row.event_json);
	if (!isWindowBoundary(parsed.type, scope)) throw new Error("Active transcript boundary has invalid payload");
	return {
		firstKeptEntryId: parsed.firstKeptEntryId,
		sizeBytes: row.serialized_bytes
	};
}
function findLatestResetMessageWindow(projection, scope, beforeRawSeq) {
	const db = getActiveTranscriptKysely(projection.database);
	const latestBoundary = readLatestActiveBoundaryMetadata(projection, scope, beforeRawSeq);
	if (!latestBoundary) return null;
	const boundary = readBoundaryWindowFacts(projection, latestBoundary.seq, scope);
	const postBoundaryMessagePosition = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("active_position", ">", latestBoundary.active_position).where("message_position", "is not", null).orderBy("active_position", "asc").limit(1))?.message_position ?? projection.state.activeMessageCount;
	const keptMessagePositions = [];
	const includesBoundary = latestBoundary.event_type === "compaction";
	let contextPrefixEventCount = includesBoundary ? 1 : 0;
	let contextPrefixSizeBytes = includesBoundary ? boundary.sizeBytes : 0;
	if (typeof boundary.firstKeptEntryId === "string") {
		const indexedFirstKept = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.active_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", boundary.firstKeptEntryId).where("active.active_position", "<", latestBoundary.active_position));
		let unindexedFirstKept;
		for (const row of iterateUnindexedActiveTranscriptNavigation(projection, {
			beforeActivePosition: indexedFirstKept?.active_position ?? latestBoundary.active_position,
			eventIds: [boundary.firstKeptEntryId],
			first: true
		})) if (row.event.id === boundary.firstKeptEntryId) {
			unindexedFirstKept = row;
			break;
		}
		const firstKept = unindexedFirstKept ?? indexedFirstKept;
		if (firstKept && firstKept.active_position < latestBoundary.active_position) {
			const candidateRows = iterateSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
				"active.message_position",
				sql`CASE WHEN json_valid(${transcriptEventNavigationSql("event")})
              THEN ${transcriptEventModelNavigationSql("event")}
              ELSE ${transcriptEventNavigationSql("event")} END`.as("event_json"),
				sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
			]).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">=", firstKept.active_position).where("active.active_position", "<", latestBoundary.active_position).where("active.message_position", "is not", null).$if(scope === "context" && latestBoundary.event_type !== "reset", (query) => query.where("active.context_eligible", "=", 1)).orderBy("active.active_position", "asc"));
			const candidates = [];
			for (const row of candidateRows) try {
				candidates.push({
					message_position: row.message_position,
					serialized_bytes: row.serialized_bytes,
					event: JSON.parse(row.event_json)
				});
			} catch {
				continue;
			}
			let keptRows = candidates;
			if (latestBoundary.event_type === "reset") {
				const keptEntries = new Set(selectResetKeptEntries(candidates.map((row) => row.event)));
				keptRows = candidates.filter((row) => keptEntries.has(row.event));
			}
			contextPrefixEventCount += keptRows.length;
			contextPrefixSizeBytes += keptRows.reduce((total, row) => total + row.serialized_bytes, 0);
			for (const row of keptRows) {
				if (row.message_position === null || row.event.type !== "message") continue;
				const role = row.event.message.role;
				if (scope === "context" || role === "user" || role === "assistant") keptMessagePositions.push(row.message_position);
			}
		}
	}
	return {
		boundarySeq: latestBoundary.seq,
		contextPrefixEventCount,
		keptMessagePositions,
		contextPrefixSizeBytes,
		postBoundaryMessagePosition,
		boundaryActivePosition: latestBoundary.active_position
	};
}
function resolveTranscriptBoundaryWindow(projection, scope = "history", beforeRawSeq) {
	if (beforeRawSeq !== void 0 || hasSqlitePostCommitScope(projection.database.db)) return findLatestResetMessageWindow(projection, scope, beforeRawSeq);
	const key = `${projection.database.path}\0${projection.resolved.sessionId}\0${scope}`;
	const cached = resetMessageWindowCache.get(key);
	const generation = projection.generation;
	if (cached?.database === projection.database.db && "window" in cached) {
		if (cached.generation === generation && cached.indexedSeq === projection.state.indexedSeq) return cached.window;
		if (cached.generation === generation && cached.window) {
			if (readLatestActiveBoundaryMetadata(projection, scope)?.seq === cached.window.boundarySeq) {
				cacheResetMessageWindow(key, {
					...cached,
					indexedSeq: projection.state.indexedSeq
				});
				return cached.window;
			}
		}
	}
	const window = findLatestResetMessageWindow(projection, scope);
	cacheResetMessageWindow(key, {
		database: projection.database.db,
		generation,
		indexedSeq: projection.state.indexedSeq,
		window
	});
	return window;
}
function selectActiveResetRows(projection) {
	return getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select("active.active_position").where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", "reset");
}
/** Closed interval (previous reset, this reset] for an active-path event outside the latest window. */
function resolveClosedResetInterval(projection, target) {
	let closing = target.eventType === "reset" ? { active_position: target.activePosition } : executeSqliteQueryTakeFirstSync(projection.database.db, selectActiveResetRows(projection).where("active.active_position", ">", target.activePosition).orderBy("active.active_position", "asc").limit(1));
	const unindexedResets = readUnindexedHistoryControls(projection).filter((row) => row.event.type === "reset");
	if (target.eventType !== "reset") {
		const unindexedClosing = unindexedResets.find((row) => row.active_position > target.activePosition);
		if (unindexedClosing && (!closing || unindexedClosing.active_position < closing.active_position)) closing = unindexedClosing;
	}
	if (!closing) return;
	let opening = executeSqliteQueryTakeFirstSync(projection.database.db, selectActiveResetRows(projection).where("active.active_position", "<", closing.active_position).orderBy("active.active_position", "desc").limit(1));
	const unindexedOpening = unindexedResets.findLast((row) => row.active_position < closing.active_position);
	if (unindexedOpening && (!opening || unindexedOpening.active_position > opening.active_position)) opening = unindexedOpening;
	return {
		startExclusiveActivePosition: opening?.active_position ?? -1,
		endInclusiveActivePosition: closing.active_position
	};
}
function resolveVisibleMessagePositions(projection) {
	const window = resolveTranscriptBoundaryWindow(projection);
	if (!window) return {
		kept: [],
		postStart: 0,
		total: projection.state.activeMessageCount
	};
	return {
		boundaryActivePosition: window.boundaryActivePosition,
		kept: window.keptMessagePositions,
		postStart: window.postBoundaryMessagePosition,
		total: window.keptMessagePositions.length + Math.max(0, projection.state.activeMessageCount - window.postBoundaryMessagePosition)
	};
}
function selectVisibleMessageRanges(projection, start, endExclusive) {
	const ranges = [];
	if (endExclusive <= start) return ranges;
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	for (let offset = boundedStart; offset < keptEnd; offset += 500) {
		const positions = visible.kept.slice(offset, Math.min(offset + 500, keptEnd));
		const ordinals = new Map(positions.map((position, index) => [position, offset + index]));
		ranges.push({
			positions,
			logicalPosition: (position) => ordinals.get(position)
		});
	}
	const logicalStart = Math.max(boundedStart, visible.kept.length);
	if (boundedEnd > logicalStart) {
		const rawStart = visible.postStart + logicalStart - visible.kept.length;
		ranges.push({
			start: rawStart,
			endExclusive: rawStart + boundedEnd - logicalStart,
			logicalPosition: (position) => logicalStart + position - rawStart
		});
	}
	return ranges;
}
function readVisibleMessageRange(projection, start, endExclusive) {
	return Array.from(iterateVisibleMessageRange(projection, start, endExclusive));
}
function* iterateVisibleMessageRange(projection, start, endExclusive) {
	for (const range of selectVisibleMessageRanges(projection, start, endExclusive)) {
		const rows = "positions" in range ? iterateSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, range))) : getMessageRangeReaders(projection.database).messages({
			sessionId: projection.resolved.sessionId,
			start: range.start,
			endExclusive: range.endExclusive
		});
		for (const row of rows) yield parseActiveTranscriptMessageRow(row);
	}
}
function hasUnindexedVisibleMessages(projection, start, endExclusive) {
	return selectVisibleMessageRanges(projection, start, endExclusive).some((range) => executeSqliteQueryTakeFirstSync(projection.database.db, selectMessageRows(projection.database, projection.resolved.sessionId, range).leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select("active.event_seq").where("identity.seq", "is", null).limit(1)) !== void 0);
}
/** Validate the whole selected history without materializing ordinary payloads in JavaScript. */
function assertVisibleMessageRangeJson(projection, start, endExclusive) {
	for (const range of selectVisibleMessageRanges(projection, start, endExclusive)) for (const row of iterateSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, range)).where((eb) => {
		const event = transcriptEventJsonSql(projection.database.db, "event");
		const enclosed = eb(eb.val("["), "||", eb(event, "||", eb.val("]")));
		return eb.or([eb(eb.fn("json_valid", [event]), "=", 0), eb(eb.fn("json_valid", [enclosed]), "=", 0)]);
	}))) parseActiveTranscriptMessageRow(row);
}
/** Byte-bounded tails can stop sizing at their first excluded predecessor. */
function* iterateVisibleMessageMetadata(projection, start, endExclusive, direction = "asc") {
	const ranges = selectVisibleMessageRanges(projection, start, endExclusive);
	for (const range of direction === "desc" ? ranges.toReversed() : ranges) {
		const rows = "positions" in range ? iterateSqliteQuerySync(projection.database.db, selectMessageMetadata(selectMessageRows(projection.database, projection.resolved.sessionId, range).clearOrderBy().orderBy("active.message_position", direction))) : getMessageRangeReaders(projection.database)[direction === "desc" ? "metadataDescending" : "metadata"]({
			sessionId: projection.resolved.sessionId,
			start: range.start,
			endExclusive: range.endExclusive
		});
		for (const row of rows) yield {
			message_position: row.message_position,
			serialized_bytes: row.serialized_bytes,
			logicalPosition: range.logicalPosition(row.message_position)
		};
	}
}
/** Reads logical transcript bytes, reusing cached retained-tail facts after resets. */
function readVisibleTranscriptStats(projection) {
	const window = resolveTranscriptBoundaryWindow(projection, "context");
	const base = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [eb.fn.count("active.event_seq").as("event_count"), sql`COALESCE(SUM(${transcriptEventReadBytesSql("event")} ), 0)
        + COUNT(*)`.as("size_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.context_eligible", "=", 1);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, window ? base.where("active.active_position", ">", window.boundaryActivePosition) : base);
	return {
		eventCount: (row?.event_count ?? 0) + (window?.contextPrefixEventCount ?? 0),
		sizeBytes: (row?.size_bytes ?? 0) + (window?.contextPrefixSizeBytes ?? 0)
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-events.ts
/** Reads every message event on the active path. Full callers remain intentionally O(output). */
function readSessionTranscriptMessageEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		return readVisibleMessageRange(projection, 0, resolveVisibleMessagePositions(projection).total);
	});
}
/** Reads the last active-path message without hydrating its historical ancestors. */
function readLatestSessionTranscriptMessageEvent(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const row = getMessageRangeReaders(projection.database).latest({
			sessionId: projection.resolved.sessionId,
			start: 0,
			endExclusive: fence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount
		});
		return row ? parseActiveTranscriptMessageRow(row) : void 0;
	});
}
/** Checks user control facts from an exact input on one active-path snapshot, without loading bodies. */
function everySessionTranscriptUserInputFrom(scope, idempotencyKey, accept) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const end = fence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount;
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.message_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.message_idempotency_key", "=", idempotencyKey).where("active.message_position", "is not", null).where("active.message_position", "<", end).limit(1));
		if (anchor?.message_position == null) return false;
		const postStart = resolveTranscriptBoundaryWindow(projection, "history", fence?.beforeRawSeq)?.postBoundaryMessagePosition ?? 0;
		if (anchor.message_position < postStart) return false;
		const query = selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: anchor.message_position,
			endExclusive: end
		}).select(sql`json_object('role', json_extract(${transcriptEventNavigationSql("event")}, '$.message.role'),
          'idempotencyKey', json_extract(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey'),
          '__testclaw', json_object('runId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.runId')),
          'provenance', json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance'))`.as("message_json")).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`, "=", "user");
		let seen = false;
		for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
			seen = true;
			if (!accept(JSON.parse(row.message_json))) return false;
		}
		return seen;
	});
}
/** Visits messages synchronously inside one active-path read snapshot. */
function visitSessionTranscriptMessageEvents(scope, visit) {
	withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		for (const entry of iterateVisibleMessageRange(projection, 0, visible.total)) visit(entry);
	});
}
/** Classifies one entry against the authoritative active path and leaf. */
function readSessionTranscriptActivePathEntryRelation(scope, entryId) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		if (projection.state.leafEventId === entryId || entryId === null) return projection.state.leafEventId === entryId ? "exact" : "off-path";
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("identity.seq").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", entryId).limit(1)) ? "ancestor" : "off-path";
	});
}
/** Reads a bounded context tail, preserving control facts but excluding display-only messages. */
function readRecentSessionTranscriptActiveEvents(scope, maxEvents) {
	return withRecentSessionTranscriptActiveEvents(scope, maxEvents, (visit) => {
		const events = [];
		visit((event) => events.push(event));
		return events.toReversed();
	});
}
/** Runs repeatable newest-first visits synchronously inside one context-tail snapshot. */
function withRecentSessionTranscriptActiveEvents(scope, maxEvents, read) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const limit = Math.max(0, Math.floor(Number.isFinite(maxEvents) ? maxEvents : 0));
		const query = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(transcriptEventJsonSql(projection.database.db, "event").as("event_json")).where("active.session_id", "=", projection.resolved.sessionId).where("active.context_eligible", "=", 1).orderBy("active.active_position", "desc").limit(limit);
		let active = true;
		try {
			return read((visitor) => {
				if (!active) throw new Error("Transcript visitor used outside its read snapshot");
				if (limit === 0) return;
				let parseError;
				for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
					let event;
					try {
						event = JSON.parse(row.event_json);
					} catch (error) {
						parseError = toErrorObject(error, "Transcript event JSON parsing failed");
						continue;
					}
					visitor(event);
				}
				if (parseError !== void 0) throw parseError;
			});
		} finally {
			active = false;
		}
	});
}
/** Reads logical transcript event count and JSONL byte size. */
function readSessionTranscriptActiveStats(scope) {
	return withCurrentProjectionSnapshot(scope, readVisibleTranscriptStats);
}
/** Reads one append-stable forward page from the materialized active-message projection. */
function readSessionTranscriptVisibleMessageDeltaCore(scope, limits = {}) {
	const maxMessages = normalizeVisibleMessageLimit(limits.maxMessages, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxMessages");
	const maxBytes = normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const transcriptFence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const generation = projection.generation;
		if (!generation) return { kind: "missing" };
		const initialCursor = createVisibleMessageCursor({
			agentId: projection.resolved.agentId,
			generation,
			sessionId: projection.resolved.sessionId
		});
		const reset = (reason) => ({
			kind: "reset",
			cursor: encodeVisibleMessageCursor(initialCursor),
			reason
		});
		const cursor = limits.cursor !== void 0 ? parseVisibleMessageCursor(limits.cursor) : initialCursor;
		if (!cursor) return reset("invalid_cursor");
		if (cursor.agentId !== projection.resolved.agentId || cursor.sessionId !== projection.resolved.sessionId) return reset("scope_mismatch");
		if (cursor.generation !== generation) return reset("generation_mismatch");
		if (transcriptFence !== void 0 && cursor.lastMessagePosition >= transcriptFence.beforeActiveMessagePosition) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		let startPosition = 0;
		if (cursor.lastEventSeq >= 0) {
			const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("event_seq", "=", cursor.lastEventSeq).where("message_position", "is not", null));
			if (anchor?.message_position === null || anchor?.message_position === void 0) return reset("anchor_missing");
			if (anchor.message_position !== cursor.lastMessagePosition) return reset("anchor_moved");
			startPosition = anchor.message_position + 1;
		}
		const metadata = executeSqliteQuerySync(projection.database.db, selectMessageMetadata(selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: startPosition,
			endExclusive: transcriptFence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount
		})).select("active.event_seq").limit(maxMessages + 1)).rows;
		let serializedBytes = 0;
		let selectedCount = 0;
		for (const row of metadata) {
			if (selectedCount >= maxMessages || serializedBytes + row.serialized_bytes > maxBytes) break;
			serializedBytes += row.serialized_bytes;
			selectedCount += 1;
		}
		const lastSelected = metadata[selectedCount - 1];
		const lastEventSeq = lastSelected?.event_seq ?? cursor.lastEventSeq;
		const lastMessagePosition = lastSelected?.message_position ?? cursor.lastMessagePosition;
		const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: startPosition,
			endExclusive: lastMessagePosition + 1
		})).leftJoin("session_transcript_active_events as parent_active", (join) => join.onRef("parent_active.session_id", "=", "active.session_id").on((eb) => eb("parent_active.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent_identity", (join) => join.onRef("parent_identity.session_id", "=", "parent_active.session_id").onRef("parent_identity.seq", "=", "parent_active.event_seq")).select("parent_identity.event_id as parent_id")).rows.map((row) => {
			const { event, eventSeq, seq } = parseActiveTranscriptMessageRow(row);
			return {
				event,
				eventSeq,
				parentId: row.parent_id,
				seq
			};
		});
		const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serialized_bytes : void 0;
		return {
			kind: "page",
			cursor: encodeVisibleMessageCursor({
				...cursor,
				lastEventSeq,
				lastMessagePosition
			}),
			events: rows,
			hasMore: selectedCount < metadata.length,
			...requiredBytes !== void 0 ? { requiredBytes } : {},
			serializedBytes
		};
	});
}
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			totalMessages: visible.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8388608));
		const candidates = iterateVisibleMessageMetadata(projection, Math.max(0, visible.total - Math.min(maxLines, maxMessages)), visible.total, "desc");
		let selectedStart = visible.total;
		let bytes = 0;
		for (const row of candidates) {
			if (selectedStart < visible.total && bytes + row.serialized_bytes > maxBytes) break;
			selectedStart = row.logicalPosition;
			bytes += row.serialized_bytes;
		}
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleMessageRange(projection, selectedStart, visible.total),
			totalMessages: visible.total
		};
	});
}
/** Reads a message page from either end with index range predicates, never OFFSET scanning. */
function readSessionTranscriptMessageEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const totalMessages = resolveVisibleMessagePositions(projection).total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = options.offsetFrom === "start" ? Math.min(totalMessages, offset + maxMessages) : totalMessages - offset;
		const start = options.offsetFrom === "start" ? offset : Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleMessageRange(projection, start, endExclusive),
			totalMessages
		};
	}, options);
}
/** Reads a tail page whose materialized event payloads fit a hard byte budget. */
function readSessionTranscriptBoundedMessageTailPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const snapshot = {
			boundarySeq: resolveTranscriptBoundaryWindow(projection)?.boundarySeq,
			generation: projection.generation,
			indexedSeq: projection.state.indexedSeq
		};
		const totalMessages = visible.total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxBytes = Math.max(0, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		const scannedMessages = endExclusive - start;
		if (scannedMessages === 0 || maxBytes === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			newestContiguousEventCount: 0,
			scannedMessages,
			serializedBytes: 0,
			snapshot,
			totalMessages
		};
		const metadata = Array.from(iterateVisibleMessageMetadata(projection, start, endExclusive));
		if (metadata.length !== scannedMessages) throw new Error("Active transcript bounded message page is incomplete");
		const selectedPositions = [];
		let newestContiguousEventCount;
		let serializedBytes = 0;
		for (let index = metadata.length - 1; index >= 0; index -= 1) {
			const row = metadata[index];
			if (serializedBytes + row.serialized_bytes > maxBytes) {
				newestContiguousEventCount ??= selectedPositions.length;
				continue;
			}
			selectedPositions.push(row.message_position);
			serializedBytes += row.serialized_bytes;
		}
		const events = selectedPositions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, { positions: selectedPositions }))).rows.map(parseActiveTranscriptMessageRow);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events,
			newestContiguousEventCount: newestContiguousEventCount ?? selectedPositions.length,
			scannedMessages,
			serializedBytes,
			snapshot,
			totalMessages
		};
	}, options);
}
//#endregion
export { readTranscriptRawDeltaFromProjection as A, iterateUnindexedActiveTranscriptNavigation as C, createTranscriptRawDeltaCursor as D, getActiveTranscriptKysely as E, normalizeVisibleMessageLimit as F, readSessionTranscriptHotWatermark as I, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES as M, MAX_VISIBLE_MESSAGE_MAX_BYTES as N, normalizeRawDeltaLimits as O, MAX_VISIBLE_MESSAGE_MAX_MESSAGES as P, findUnindexedActiveTranscriptEntry as S, withCurrentProjectionSnapshot as T, readUnindexedHistoryControls as _, readSessionTranscriptActivePathEntryRelation as a, resolveTranscriptBoundaryWindow as b, readSessionTranscriptMessageEventPage as c, visitSessionTranscriptMessageEvents as d, withRecentSessionTranscriptActiveEvents as f, iterateVisibleMessageRange as g, iterateVisibleMessageMetadata as h, readRecentSessionTranscriptMessageEvents as i, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES as j, readRawDeltaInTransaction as k, readSessionTranscriptMessageEvents as l, hasUnindexedVisibleMessages as m, readLatestSessionTranscriptMessageEvent as n, readSessionTranscriptActiveStats as o, assertVisibleMessageRangeJson as p, readRecentSessionTranscriptActiveEvents as r, readSessionTranscriptBoundedMessageTailPage as s, everySessionTranscriptUserInputFrom as t, readSessionTranscriptVisibleMessageDeltaCore as u, readVisibleMessageRange as v, iterateUnindexedTranscriptNavigation as w, resolveVisibleMessagePositions as x, resolveClosedResetInterval as y };
