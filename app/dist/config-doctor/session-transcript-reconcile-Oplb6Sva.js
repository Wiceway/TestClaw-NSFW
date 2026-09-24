import { n as ok, t as err } from "./result-BQGgYouL.js";
import { d as toStringifiedError } from "./error-coercion-C787aVxk.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./path-guards-D465IUx2.js";
import { v as computeBackoffSchedule } from "./utils-BfoJTy8l.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { l as transcriptEventNavigationSql, o as transcriptEventJsonSql } from "./transcript-payload-BaqIXvVM.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { t as sessionChanges } from "./session-row-changes-DN0Dk-5R.js";
import { f as runAssistantAgentWriteTransaction, m as withAssistantAgentDatabaseAsync, s as getAssistantAgentDatabaseIfOpen, t as borrowAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { f as isIncognitoAssistantAgentDatabase } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { a as getSessionKysely, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { i as isSessionTranscriptSideAppendEntry, n as isCanonicalSessionTranscriptEntry, p as selectSessionTranscriptTreePathNodes, r as isSessionTranscriptLeafControl, s as parseSessionTranscriptTreeEntry, t as transcriptEventReadBytesSql, u as scanSessionTranscriptTree } from "./session-transcript-read-bytes-DN8QSHRu.js";
import { a as runSessionTranscriptReconcileOperation, i as isSessionTranscriptReconcileGenerationCurrent, t as captureSessionTranscriptReconcileGeneration } from "./session-transcript-reconcile-pool-BiGz8T5b.js";
import { randomInt, randomUUID } from "node:crypto";
import { sql } from "kysely";
import { setImmediate, setTimeout } from "node:timers/promises";
//#region src/config/sessions/session-transcript-fts.ts
/** Insert both projection records in the caller's synchronous write transaction. */
function createSessionTranscriptFtsInserter(db, sessionId) {
	const kysely = getNodeSqliteKysely(db);
	const insertIdentity = prepareSqliteQuerySync(db, (parameter) => kysely.insertInto("session_transcript_fts_rows").values({
		session_id: sessionId,
		message_id: parameter((entry) => entry.messageId)
	}));
	const insertContent = prepareSqliteQuerySync(db, (parameter) => kysely.insertInto("session_transcript_fts").values({
		rowid: kysely.fn("last_insert_rowid", []),
		text: parameter((entry) => entry.text),
		session_id: sessionId,
		message_id: parameter((entry) => entry.messageId),
		role: parameter((entry) => entry.role),
		timestamp: parameter((entry) => entry.timestamp)
	}));
	return (entry) => {
		insertIdentity(entry);
		insertContent(entry);
	};
}
/** Indexed identities select the work; their delete trigger removes the matching FTS rows. */
function deleteSessionTranscriptFtsRowsInTransaction(db, sessionIds, options = {}) {
	const kysely = getNodeSqliteKysely(db);
	let selected = kysely.selectFrom("session_transcript_fts_rows").select("id");
	selected = typeof sessionIds === "string" ? selected.where("session_id", "=", sessionIds) : selected.where("session_id", "in", sqliteStringSet(sessionIds));
	if (options.messageIds) selected = selected.where("message_id", "in", options.messageIds.length <= 400 ? options.messageIds : sqliteStringSet(options.messageIds));
	if (options.maxRows !== void 0) selected = selected.limit(options.maxRows);
	return Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_fts_rows").where("id", "in", selected)).numAffectedRows ?? 0n);
}
//#endregion
//#region src/config/sessions/session-transcript-projection-append.ts
function readMessageText(message) {
	if (!isRecord(message) || message.role !== "user" && message.role !== "assistant") return;
	if (typeof message.content === "string") return message.content.trim() || void 0;
	if (typeof message.text === "string") return message.text.trim() || void 0;
	if (!Array.isArray(message.content)) return;
	const parts = message.content.flatMap((block) => {
		if (!isRecord(block) || block.type !== "text" && block.type !== "input_text" && block.type !== "output_text") return [];
		return typeof block.text === "string" && block.text.trim() ? [block.text] : [];
	});
	return parts.length > 0 ? parts.join("\n") : void 0;
}
/** Extracts the searchable user/assistant text from one transcript event. */
function extractTranscriptIndexEntry(event, fallbackTimestamp) {
	if (!isRecord(event) || event.type !== "message" || typeof event.id !== "string") return;
	const message = isRecord(event.message) ? event.message : void 0;
	const role = message?.role;
	const id = event.id.trim();
	if (!id || role !== "user" && role !== "assistant") return;
	const text = readMessageText(message);
	if (!text) return;
	const timestamp = typeof event.timestamp === "number" ? event.timestamp : typeof event.timestamp === "string" ? Date.parse(event.timestamp) : NaN;
	return {
		messageId: id,
		role,
		text,
		timestamp: Number.isFinite(timestamp) ? timestamp : fallbackTimestamp
	};
}
function hasTranscriptMessage(event) {
	return isRecord(event) && Object.hasOwn(event, "message") && event.message !== void 0;
}
/** Control facts still belong in bounded context acquisition, even without a replay message. */
function transcriptEventContextEligibility(event) {
	return isRecord(event) && isRecord(event.message) && event.message.excludeFromContext === true ? 0 : 1;
}
function shouldProjectActiveEvent(event) {
	return isRecord(event) && event.type !== "session" && (isCanonicalSessionTranscriptEntry(event) || parseSessionTranscriptTreeEntry(event) !== void 0 || hasTranscriptMessage(event));
}
/** Resolves one append against an already-complete projection without mutating storage. */
function prepareSessionTranscriptProjectionAppend(params) {
	const { cursor } = params;
	const treeEntry = parseSessionTranscriptTreeEntry(params.event);
	const isCanonicalEvent = isCanonicalSessionTranscriptEntry(params.event);
	const initializesProjection = cursor.indexedSeq === -1;
	if (params.seq !== cursor.indexedSeq + 1 || !initializesProjection && (isSessionTranscriptLeafControl(params.event) || isSessionTranscriptSideAppendEntry(params.event) || isCanonicalEvent && cursor.leafEventId === null && cursor.activeEventCount > 0 || !isCanonicalEvent && cursor.leafEventId !== null && shouldProjectActiveEvent(params.event) || treeEntry && treeEntry.parentId !== cursor.leafEventId)) return;
	const ftsRow = extractTranscriptIndexEntry(params.event, params.createdAt);
	const projectsActiveEvent = shouldProjectActiveEvent(params.event);
	const projectsMessage = projectsActiveEvent && hasTranscriptMessage(params.event);
	const activeRow = projectsActiveEvent ? {
		activePosition: cursor.activeEventCount,
		contextEligible: transcriptEventContextEligibility(params.event),
		eventSeq: params.seq,
		messagePosition: projectsMessage ? cursor.activeMessageCount : null
	} : void 0;
	return {
		...activeRow ? { activeRow } : {},
		cursor: {
			activeEventCount: cursor.activeEventCount + (projectsActiveEvent ? 1 : 0),
			activeMessageCount: cursor.activeMessageCount + (projectsMessage ? 1 : 0),
			indexedSeq: params.seq,
			leafEventId: params.eventId !== null && isCanonicalEvent ? params.eventId : cursor.leafEventId
		},
		...ftsRow ? { ftsRow } : {}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-projection-rebuild.ts
const PROJECTION_FINALIZE_TAIL_ROWS = 512;
const PROJECTION_FINALIZE_TAIL_BYTES = 262144;
function transcriptEventStoredByteLength() {
	return transcriptEventReadBytesSql().as("event_bytes");
}
function getProjectionKysely(db) {
	return getNodeSqliteKysely(db);
}
/** Older same-version writers can leave a current watermark over unclassified rows. */
function hasUnclassifiedSessionTranscriptEvents(db, sessionId) {
	return executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null).limit(1)) !== void 0;
}
function readCanonicalEventId(event) {
	if (!isCanonicalSessionTranscriptEntry(event) || typeof event.id !== "string") return null;
	return event.id.trim() || null;
}
function changesPriorProjectionVisibility(event) {
	return isCanonicalSessionTranscriptEntry(event) && event.type === "reset";
}
/** Streams projection payloads; only navigation metadata is retained for branch resolution. */
function visitSessionTranscriptProjection(db, sessionId, visitor) {
	const source = readProjectionSource(db, sessionId);
	return source ? visitProjectionSource(source, visitor) : void 0;
}
function readProjectionSource(db, sessionId) {
	const kysely = getProjectionKysely(db);
	const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows as session").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "session.session_id").select(["session.transcript_updated_at", "rewrite.generation"]).where("session.session_id", "=", sessionId));
	if (!session) return;
	const query = kysely.selectFrom("transcript_events").select([
		transcriptEventJsonSql(db).as("event_json"),
		"seq",
		"created_at"
	]).where("session_id", "=", sessionId);
	const read = prepareSqliteQuerySync(db, (parameter) => query.where("seq", "=", parameter((seq) => seq)));
	return {
		sessionId,
		transcriptGeneration: session.generation,
		transcriptUpdatedAt: session.transcript_updated_at,
		rows: (navigationOnly) => iterateSqliteQuerySync(db, (navigationOnly ? query.clearSelect().select([
			transcriptEventNavigationSql().as("event_json"),
			"seq",
			"created_at"
		]) : query).orderBy("seq", "asc")),
		row: (seq) => read(seq).rows[0]
	};
}
function visitProjectionSource(source, visitor) {
	let sourceIndexedSeq = -1;
	const tree = scanSessionTranscriptTree((function* () {
		for (const row of source.rows(true)) {
			sourceIndexedSeq = row.seq;
			const event = JSON.parse(row.event_json);
			const navigation = { seq: row.seq };
			if (isRecord(event)) {
				for (const key of [
					"type",
					"id",
					"parentId",
					"targetId",
					"appendParentId",
					"appendMode"
				]) if (Object.hasOwn(event, key)) navigation[key] = event[key];
			}
			yield navigation;
		}
	})());
	if (sourceIndexedSeq < 0) return;
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const rows = visiblePath.length > 0 ? (function* () {
		for (const node of visiblePath) {
			const row = source.row(node.entry.seq);
			if (row) yield row;
		}
	})() : tree.hasLeafControl ? [] : source.rows();
	let activeEventCount = 0;
	let activeMessageCount = 0;
	for (const row of rows) {
		const event = JSON.parse(row.event_json);
		const indexed = extractTranscriptIndexEntry(event, row.created_at);
		if (indexed) visitor.ftsRow(indexed);
		if (!shouldProjectActiveEvent(event)) continue;
		const projectsMessage = hasTranscriptMessage(event);
		visitor.activeRow({
			activePosition: activeEventCount++,
			contextEligible: transcriptEventContextEligibility(event),
			eventSeq: row.seq,
			messagePosition: projectsMessage ? activeMessageCount++ : null
		});
	}
	return {
		activeEventCount,
		activeMessageCount,
		leafEventId: tree.appendParentId,
		sessionId: source.sessionId,
		sourceHasInvalidLeafControl: tree.hasInvalidLeafControl,
		sourceIndexedSeq,
		sourceTranscriptGeneration: source.transcriptGeneration,
		sourceTranscriptUpdatedAt: source.transcriptUpdatedAt
	};
}
function readProjectionSourceSnapshot(db, sessionId) {
	const kysely = getProjectionKysely(db);
	const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows as session").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "session.session_id").select(["session.transcript_updated_at", "rewrite.generation"]).where("session.session_id", "=", sessionId));
	const latest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	return {
		generation: session?.generation ?? null,
		latestSeq: latest?.seq,
		transcriptUpdatedAt: session?.transcript_updated_at ?? null
	};
}
function sourceSnapshotMatches(snapshot, plan) {
	return snapshot.generation === plan.sourceTranscriptGeneration && snapshot.latestSeq === plan.sourceIndexedSeq && snapshot.transcriptUpdatedAt === plan.sourceTranscriptUpdatedAt;
}
function projectionTailFitsCatchUpBounds(db, plan, snapshot) {
	if (plan.sourceTranscriptGeneration === null || snapshot.generation !== plan.sourceTranscriptGeneration || snapshot.latestSeq === void 0 || snapshot.latestSeq < plan.sourceIndexedSeq) return false;
	const tailRowCount = snapshot.latestSeq - plan.sourceIndexedSeq;
	if (tailRowCount > PROJECTION_FINALIZE_TAIL_ROWS) return false;
	const sizeRows = executeSqliteQuerySync(db, getProjectionKysely(db).selectFrom("transcript_events").select(["seq", transcriptEventStoredByteLength()]).where("session_id", "=", plan.sessionId).where("seq", ">", plan.sourceIndexedSeq).orderBy("seq", "asc").limit(513)).rows;
	return sizeRows.length === tailRowCount && (sizeRows.at(-1)?.seq ?? plan.sourceIndexedSeq) === snapshot.latestSeq && sizeRows.reduce((total, row) => total + row.event_bytes, 0) <= PROJECTION_FINALIZE_TAIL_BYTES;
}
function projectionClaimIsOwned(db, sessionId, claimId) {
	const row = executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_index_state").select(["needs_rebuild", "updated_at"]).where("session_id", "=", sessionId));
	return row?.needs_rebuild !== 0 && row?.updated_at === claimId;
}
/** Claims a prepared snapshot. Later chunks publish only while this claim remains current. */
function claimPreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	const sourceSnapshot = readProjectionSourceSnapshot(db, plan.sessionId);
	if (!sourceSnapshotMatches(sourceSnapshot, plan) && (plan.sourceHasInvalidLeafControl || !projectionTailFitsCatchUpBounds(db, plan, sourceSnapshot))) return false;
	const kysely = getProjectionKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", plan.sessionId));
	if (current?.needs_rebuild === 0 && current.indexed_seq === sourceSnapshot.latestSeq && !hasUnclassifiedSessionTranscriptEvents(db, plan.sessionId)) return false;
	executeSqliteQuerySync(db, kysely.insertInto("session_transcript_index_state").values({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		session_id: plan.sessionId,
		updated_at: claimId
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		updated_at: claimId
	})));
	return true;
}
/** Deletes old rows in bounded rowid batches while the prepared claim is current. */
function deletePreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return {
		hasMore: false,
		owned: false
	};
	const kysely = getProjectionKysely(db);
	const active = Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("rowid", "in", kysely.selectFrom("session_transcript_active_events").select("rowid").where("session_id", "=", params.sessionId).limit(params.maxRowsPerTable))).numAffectedRows ?? 0n);
	const fts = deleteSessionTranscriptFtsRowsInTransaction(db, params.sessionId, { maxRows: params.maxRowsPerTable });
	return {
		hasMore: active === params.maxRowsPerTable || fts === params.maxRowsPerTable,
		owned: true
	};
}
/** Appends one bounded projection chunk while its claim remains current. */
function appendPreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return false;
	insertPreparedSessionTranscriptProjectionRows(db, params);
	return true;
}
function insertPreparedSessionTranscriptProjectionRows(db, params) {
	const kysely = getProjectionKysely(db);
	if (params.activeRows && params.activeRows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("session_transcript_active_events").values(params.activeRows.map((row) => ({
		active_position: row.activePosition,
		context_eligible: row.contextEligible,
		event_seq: row.eventSeq,
		message_position: row.messagePosition,
		session_id: params.sessionId
	}))));
	if (params.ftsRows && params.ftsRows.length > 0) {
		const insertFts = createSessionTranscriptFtsInserter(db, params.sessionId);
		for (const row of params.ftsRows) insertFts(row);
	}
}
function prepareProjectionTailCatchUp(db, plan, snapshot) {
	const latestSeq = snapshot.latestSeq;
	if (plan.sourceHasInvalidLeafControl || latestSeq === void 0 || !projectionTailFitsCatchUpBounds(db, plan, snapshot)) return;
	const rows = executeSqliteQuerySync(db, getProjectionKysely(db).selectFrom("transcript_events").select([
		transcriptEventJsonSql(db).as("event_json"),
		"seq",
		"created_at"
	]).where("session_id", "=", plan.sessionId).where("seq", ">", plan.sourceIndexedSeq).where("seq", "<=", latestSeq).orderBy("seq", "asc")).rows;
	const activeRows = [];
	const ftsRows = [];
	let cursor = {
		activeEventCount: plan.activeEventCount,
		activeMessageCount: plan.activeMessageCount,
		indexedSeq: plan.sourceIndexedSeq,
		leafEventId: plan.leafEventId
	};
	for (const row of rows) {
		const event = JSON.parse(row.event_json);
		if (changesPriorProjectionVisibility(event)) return;
		const append = prepareSessionTranscriptProjectionAppend({
			createdAt: row.created_at,
			cursor,
			event,
			eventId: readCanonicalEventId(event),
			seq: row.seq
		});
		if (!append) return;
		cursor = append.cursor;
		if (append.activeRow) activeRows.push(append.activeRow);
		if (append.ftsRow) ftsRows.push(append.ftsRow);
	}
	return {
		...plan,
		activeEventCount: cursor.activeEventCount,
		activeMessageCount: cursor.activeMessageCount,
		activeRows,
		ftsRows,
		leafEventId: cursor.leafEventId,
		sourceIndexedSeq: cursor.indexedSeq,
		sourceTranscriptUpdatedAt: snapshot.transcriptUpdatedAt
	};
}
/** Publishes one current snapshot, catching up a bounded append-only tail. */
function finalizePreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	if (!projectionClaimIsOwned(db, plan.sessionId, claimId)) return false;
	if (executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_active_events").select((eb) => eb.fn.countAll().as("count")).where("session_id", "=", plan.sessionId))?.count !== plan.activeEventCount || hasUnclassifiedSessionTranscriptEvents(db, plan.sessionId)) return false;
	const snapshot = readProjectionSourceSnapshot(db, plan.sessionId);
	const exactSnapshot = sourceSnapshotMatches(snapshot, plan);
	const catchUpPlan = exactSnapshot ? void 0 : prepareProjectionTailCatchUp(db, plan, snapshot);
	if (!exactSnapshot && !catchUpPlan) return false;
	const finalPlan = catchUpPlan ?? plan;
	if (catchUpPlan) insertPreparedSessionTranscriptProjectionRows(db, {
		activeRows: catchUpPlan.activeRows,
		ftsRows: catchUpPlan.ftsRows,
		sessionId: catchUpPlan.sessionId
	});
	executeSqliteQuerySync(db, getProjectionKysely(db).updateTable("session_transcript_index_state").set({
		active_event_count: finalPlan.activeEventCount,
		active_message_count: finalPlan.activeMessageCount,
		indexed_seq: finalPlan.sourceIndexedSeq,
		leaf_event_id: finalPlan.leafEventId,
		needs_rebuild: 0,
		updated_at: Date.now()
	}).where("session_id", "=", finalPlan.sessionId).where("needs_rebuild", "!=", 0).where("updated_at", "=", claimId));
	return true;
}
//#endregion
//#region src/config/sessions/session-transcript-index.ts
const SYNC_REBUILD_MAX_ROWS = 4e3;
const SYNC_REBUILD_MAX_BYTES = 4194304;
function getIndexKysely(db) {
	return getNodeSqliteKysely(db);
}
/** Size the old projection and incoming rows before their owning transaction mutates either. */
function shouldRebuildSessionTranscriptIndexSynchronously(db, sessionId, events = []) {
	if (events.length > 4e3) return false;
	const kysely = getIndexKysely(db);
	const stored = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom(kysely.selectFrom("transcript_events").select(transcriptEventReadBytesSql().as("event_bytes")).where("session_id", "=", sessionId).limit(SYNC_REBUILD_MAX_ROWS - events.length + 1).as("stored")).select((eb) => [eb.fn.countAll().as("event_count"), eb.fn.sum("stored.event_bytes").as("event_bytes")]));
	if ((stored?.event_count ?? 0) + events.length > 4e3) return false;
	let bytes = stored?.event_bytes ?? 0;
	if (bytes > 4194304) return false;
	for (const event of events) {
		bytes += Buffer.byteLength(JSON.stringify(event), "utf8");
		if (bytes > 4194304) return false;
	}
	return true;
}
function readSessionTranscriptProjectionState(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("session_transcript_index_state").select([
		"active_event_count",
		"active_message_count",
		"indexed_seq",
		"leaf_event_id",
		"needs_rebuild"
	]).where("session_id", "=", sessionId));
	if (!row) return;
	return {
		activeEventCount: row.active_event_count,
		activeMessageCount: row.active_message_count,
		indexedSeq: row.indexed_seq,
		leafEventId: row.leaf_event_id,
		needsRebuild: row.needs_rebuild !== 0
	};
}
function readLatestTranscriptSequence(db, sessionId) {
	return executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1))?.seq;
}
function sessionTranscriptIndexNeedsReconcile(db, sessionId) {
	const latestSeq = readLatestTranscriptSequence(db, sessionId);
	return latestSeq !== void 0 && sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq);
}
function sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq) {
	const state = readSessionTranscriptProjectionState(db, sessionId);
	return !state || state.needsRebuild || state.indexedSeq !== latestSeq || hasUnclassifiedSessionTranscriptEvents(db, sessionId);
}
function createWatermarkWriter(db, sessionId, updateExisting = false) {
	return prepareSqliteQuerySync(db, (parameter) => {
		const kysely = getIndexKysely(db);
		const values = {
			active_event_count: parameter((row) => row.activeEventCount),
			active_message_count: parameter((row) => row.activeMessageCount),
			indexed_seq: parameter((row) => row.indexedSeq),
			leaf_event_id: parameter((row) => row.leafEventId),
			needs_rebuild: parameter((row) => row.needsRebuild ? 1 : 0),
			updated_at: parameter((row) => row.updatedAt)
		};
		return updateExisting ? kysely.updateTable("session_transcript_index_state").set(values).where("session_id", "=", sessionId) : kysely.insertInto("session_transcript_index_state").values({
			session_id: sessionId,
			...values
		}).onConflict((conflict) => conflict.column("session_id").doUpdateSet(values));
	});
}
function createActiveEventInserter(db, sessionId) {
	return prepareSqliteQuerySync(db, (parameter) => getIndexKysely(db).insertInto("session_transcript_active_events").values({
		session_id: sessionId,
		active_position: parameter((row) => row.activePosition),
		context_eligible: parameter((row) => row.contextEligible),
		event_seq: parameter((row) => row.eventSeq),
		message_position: parameter((row) => row.messagePosition)
	}));
}
function deleteActiveEventRows(db, sessionId) {
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId));
}
/**
* In-transaction batch appender. Forward-indexes the event when it
* unambiguously extends the active branch and marks the session for rebuild
* otherwise. Runs inside the same write transaction as the event insert, so
* the index can never lag or tear relative to committed transcript rows.
* Retain only within a synchronous batch whose source cannot mutate this session.
*/
function createTranscriptIndexAppenderInTransaction(db, sessionId) {
	let watermark = readSessionTranscriptProjectionState(db, sessionId);
	let hasUnclassifiedEvents;
	let insertActiveEvent;
	let insertFts;
	let updateWatermark;
	return (params) => {
		if (!watermark) {
			if (params.seq !== 0) return true;
			const append = prepareSessionTranscriptProjectionAppend({
				...params,
				cursor: {
					activeEventCount: 0,
					activeMessageCount: 0,
					indexedSeq: -1,
					leafEventId: null
				}
			});
			if (!append) return true;
			applyForwardIndex(params.createdAt, append);
			return false;
		}
		if (watermark.needsRebuild) return true;
		if (hasUnclassifiedEvents ??= hasUnclassifiedSessionTranscriptEvents(db, sessionId)) {
			watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		const append = prepareSessionTranscriptProjectionAppend({
			...params,
			cursor: watermark
		});
		if (!append) {
			watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		applyForwardIndex(params.createdAt, append);
		return false;
	};
	function applyForwardIndex(createdAt, append) {
		if (append.ftsRow) {
			insertFts ??= createSessionTranscriptFtsInserter(db, sessionId);
			insertFts(append.ftsRow);
		}
		if (append.activeRow) {
			insertActiveEvent ??= createActiveEventInserter(db, sessionId);
			insertActiveEvent(append.activeRow);
		}
		const nextWatermark = {
			...append.cursor,
			needsRebuild: false,
			updatedAt: createdAt
		};
		(watermark ? updateWatermark ??= createWatermarkWriter(db, sessionId, true) : createWatermarkWriter(db, sessionId))(nextWatermark);
		watermark = nextWatermark;
	}
}
/** Marks one session for lazy rebuild without touching its FTS rows. */
function markSessionTranscriptIndexDirtyInTransaction(db, sessionId) {
	const now = Date.now();
	const watermark = readSessionTranscriptProjectionState(db, sessionId);
	const dirty = {
		activeEventCount: watermark?.activeEventCount ?? 0,
		activeMessageCount: watermark?.activeMessageCount ?? 0,
		indexedSeq: watermark?.indexedSeq ?? -1,
		leafEventId: watermark?.leafEventId ?? null,
		needsRebuild: true
	};
	createWatermarkWriter(db, sessionId)({
		...dirty,
		updatedAt: now
	});
	return dirty;
}
/** In-transaction delete hook: drops index rows alongside transcript rows. */
function deleteSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteSessionTranscriptFtsRowsInTransaction(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId));
}
/** Replaces only the derived rows affected by an exact raw transcript suffix mutation. */
function replaceSessionTranscriptIndexSuffixInTransaction(db, sessionId, params) {
	const kysely = getIndexKysely(db);
	const incremental = params.retainedActiveCount !== void 0;
	let retainedCount;
	if (incremental) retainedCount = params.retainedActiveCount;
	else {
		const previous = params.previous;
		if (!previous) throw new Error(`Missing previous transcript projection: ${sessionId}`);
		const currentRows = executeSqliteQuerySync(db, kysely.selectFrom("session_transcript_active_events").select([
			"active_position",
			"context_eligible",
			"event_seq",
			"message_position"
		]).where("session_id", "=", sessionId).where("event_seq", "<", params.unchangedBeforeSeq).orderBy("active_position", "asc")).rows;
		const sameRow = (current, expected) => current?.active_position === expected?.activePosition && current?.context_eligible === expected?.contextEligible && current?.event_seq === expected?.eventSeq && current?.message_position === expected?.messagePosition;
		const expectedCurrentRows = previous.activeRows.filter((row) => row.eventSeq < params.unchangedBeforeSeq);
		if (currentRows.length !== expectedCurrentRows.length || currentRows.some((row, index) => !sameRow(row, expectedCurrentRows[index]))) throw new Error(`Transcript projection changed before suffix replacement: ${sessionId}`);
		const prefixCount = params.next.activeRows.findIndex((row) => row.eventSeq >= params.unchangedBeforeSeq);
		retainedCount = prefixCount < 0 ? params.next.activeRows.length : prefixCount;
		if (retainedCount !== expectedCurrentRows.length || params.next.activeRows.slice(0, retainedCount).some((row, index) => !sameRow(currentRows[index], row))) throw new Error(`Transcript projection prefix changed before suffix replacement: ${sessionId}`);
	}
	const removedMessageIds = incremental ? params.removedMessageIds ?? [] : [...new Set(params.previous.activeRows.slice(retainedCount).flatMap((row) => row.ftsEntry ? [row.ftsEntry.messageId] : []))];
	if (removedMessageIds.length > 0) deleteSessionTranscriptFtsRowsInTransaction(db, sessionId, { messageIds: removedMessageIds });
	executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId).where("active_position", ">=", retainedCount));
	const insertActive = createActiveEventInserter(db, sessionId);
	const insertFts = createSessionTranscriptFtsInserter(db, sessionId);
	const rowsToInsert = incremental ? params.next.activeRows : params.next.activeRows.slice(retainedCount);
	for (const row of rowsToInsert) {
		insertActive(row);
		if (row.ftsEntry) insertFts(row.ftsEntry);
	}
	createWatermarkWriter(db, sessionId)({
		activeEventCount: params.next.activeRows.length + (incremental ? retainedCount : 0),
		activeMessageCount: params.next.activeMessageCount,
		indexedSeq: params.next.indexedSeq,
		leafEventId: params.next.leafEventId,
		needsRebuild: false,
		updatedAt: Date.now()
	});
}
/**
* Rebuilds one session's index from its full event set: drops existing FTS
* rows, indexes the resolved active branch, and resets the watermark to the
* same append parent the accessor's next append will resolve.
*/
function rebuildSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteSessionTranscriptFtsRowsInTransaction(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	const projection = visitSessionTranscriptProjection(db, sessionId, {
		activeRow: createActiveEventInserter(db, sessionId),
		ftsRow: createSessionTranscriptFtsInserter(db, sessionId)
	});
	if (!projection) return;
	createWatermarkWriter(db, sessionId)({
		activeEventCount: projection.activeEventCount,
		activeMessageCount: projection.activeMessageCount,
		indexedSeq: projection.sourceIndexedSeq,
		leafEventId: projection.leafEventId,
		needsRebuild: false,
		updatedAt: Date.now()
	});
}
/** Rebuilds one lagging projection under its current write transaction. */
function reconcileSessionTranscriptIndexInTransaction(db, sessionId) {
	const latestSeq = readLatestTranscriptSequence(db, sessionId);
	if (latestSeq === void 0) {
		deleteSessionTranscriptIndexInTransaction(db, sessionId);
		return false;
	}
	if (!sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq)) return false;
	rebuildSessionTranscriptIndexInTransaction(db, sessionId);
	return true;
}
function selectSessionsNeedingTranscriptIndexReconcile(db) {
	return getIndexKysely(db).selectFrom("session_windows").innerJoin("transcript_events as latest", (join) => join.onRef("latest.session_id", "=", "session_windows.session_id").on((eb) => eb("latest.seq", "=", eb.selectFrom("transcript_events as candidate").select("candidate.seq").whereRef("candidate.session_id", "=", "session_windows.session_id").orderBy("candidate.seq", "desc").limit(1)))).leftJoin("session_transcript_index_state as st", "st.session_id", "session_windows.session_id").select("session_windows.session_id").where((eb) => eb.or([
		eb(eb.fn.coalesce("st.needs_rebuild", eb.val(1)), "!=", 0),
		eb("latest.seq", ">", eb.fn.coalesce("st.indexed_seq", eb.val(-1))),
		eb.and([eb.exists(eb.selectFrom("session_transcript_active_events as any_pending").select("any_pending.session_id").where("any_pending.context_eligible", "is", null).limit(1)), eb.exists(eb.selectFrom("session_transcript_active_events as pending").select("pending.session_id").whereRef("pending.session_id", "=", "session_windows.session_id").where("pending.context_eligible", "is", null))])
	])).orderBy("session_windows.session_id");
}
/** Search needs only one pending session; the reconcile owner selects its complete work list. */
function hasSessionsNeedingTranscriptIndexReconcile(db) {
	return executeSqliteQueryTakeFirstSync(db, selectSessionsNeedingTranscriptIndexReconcile(db).limit(1)) !== void 0;
}
/**
* Sessions whose index needs reconcile work: flagged rebuilds, transcripts
* that gained rows without index state (doctor imports), and watermarks
* behind the newest row. Ordered for deterministic reconcile passes.
*/
function listSessionsNeedingTranscriptIndexReconcile(db) {
	return executeSqliteQuerySync(db, selectSessionsNeedingTranscriptIndexReconcile(db)).rows.flatMap((row) => typeof row.session_id === "string" ? [row.session_id] : []);
}
const transcriptIndexTables = [
	"session_transcript_active_events",
	"session_transcript_fts_rows",
	"session_transcript_index_state"
];
/** Orphan-only cleanup is independent of live sessions' projection watermarks. */
function hasOrphanedTranscriptIndexRows(db) {
	const kysely = getIndexKysely(db);
	return transcriptIndexTables.some((table) => executeSqliteQueryTakeFirstSync(db, kysely.selectFrom(table).select("session_id").where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()).limit(1)) !== void 0);
}
/** Drops index rows for sessions whose transcript rows are gone. */
function deleteOrphanedTranscriptIndexRowsInTransaction(db) {
	const kysely = getIndexKysely(db);
	for (const table of transcriptIndexTables) executeSqliteQuerySync(db, kysely.deleteFrom(table).where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()));
}
//#endregion
//#region src/config/sessions/session-transcript-reconcile-memory.ts
const SOURCE_FRAME_BYTES = 262144;
function readSnapshot(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows as window").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").select((eb) => [
		"window.transcript_updated_at",
		"rewrite.generation",
		eb.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1).as("max_seq")
	]).where("window.session_id", "=", sessionId));
	return row && row.max_seq !== null ? {
		sessionId,
		transcriptUpdatedAt: row.transcript_updated_at,
		maxSeq: row.max_seq,
		generation: row.generation
	} : void 0;
}
/** The parent alone owns memory state; a worker receives bytes, never its sentinel path. */
function createMemoryTranscriptProjectionSource(database, options, range) {
	const startAfterSeq = range?.afterSeq ?? -1;
	const throughSeq = range?.throughSeq;
	let snapshot;
	let afterSeq = startAfterSeq;
	let offset = 0;
	let row;
	const assertCurrentOwner = () => {
		if (!database.db.isOpen || getAssistantAgentDatabaseIfOpen(options) !== database) throw new Error("Incognito transcript database was disposed during reconciliation");
	};
	const snapshotMatches = (allowAppend = false) => {
		if (!snapshot) return false;
		const current = readSnapshot(database, snapshot.sessionId);
		if (!current || current.generation !== snapshot.generation) return false;
		if (allowAppend) return current.maxSeq >= snapshot.maxSeq;
		return current.maxSeq === snapshot.maxSeq && current.transcriptUpdatedAt === snapshot.transcriptUpdatedAt;
	};
	return {
		assertCurrentOwner,
		clear() {
			snapshot = void 0;
			row = void 0;
		},
		isCurrentPlan(plan) {
			return snapshot?.sessionId === plan.sessionId && snapshot.generation === plan.sourceTranscriptGeneration && snapshot.maxSeq === plan.sourceIndexedSeq && snapshot.transcriptUpdatedAt === plan.sourceTranscriptUpdatedAt && snapshotMatches();
		},
		read(sessionId) {
			assertCurrentOwner();
			return runSqliteDeferredTransactionSync(database.db, () => {
				if (snapshot?.sessionId !== sessionId) {
					snapshot = readSnapshot(database, sessionId);
					if (snapshot && throughSeq !== void 0) snapshot.maxSeq = throughSeq;
					row = void 0;
					afterSeq = startAfterSeq;
					offset = 0;
				}
				if (!snapshotMatches(throughSeq !== void 0)) {
					row = void 0;
					snapshot = void 0;
					return { type: "source-unavailable" };
				}
				if (!row) {
					let query = getSessionKysely(database.db).selectFrom("transcript_events").select([
						"seq",
						"created_at",
						sql`CAST(${transcriptEventJsonSql(database.db)} AS BLOB)`.as("bytes")
					]).where("session_id", "=", sessionId).where("seq", ">", afterSeq);
					if (throughSeq !== void 0) query = query.where("seq", "<=", throughSeq);
					row = executeSqliteQueryTakeFirstSync(database.db, query.orderBy("seq", "asc").limit(1));
					offset = 0;
				}
				if (!row) return {
					type: "source-end",
					snapshot
				};
				const bytes = Uint8Array.from(row.bytes.subarray(offset, offset + SOURCE_FRAME_BYTES));
				offset += bytes.byteLength;
				const frame = {
					type: "source-frame",
					seq: row.seq,
					createdAt: row.created_at,
					bytes,
					final: offset === row.bytes.byteLength
				};
				if (frame.final) {
					afterSeq = row.seq;
					row = void 0;
				}
				return frame;
			}, {
				databaseLabel: database.path,
				operationLabel: "sessions.transcript-index.memory-source"
			});
		}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-reconcile.ts
const log = createSubsystemLogger("sessions/transcript-index");
const PROJECTION_WRITE_CHUNK_ROWS = 512;
const PROJECTION_READY_POLL_MS = 10;
const RECONCILE_RETRY_BACKOFF_MS = [
	0,
	50,
	200,
	500,
	1e3
];
const runningReconciles = /* @__PURE__ */ new Map();
function prepareReconcileParams(params) {
	return {
		...params,
		env: { ...params.env ?? process.env },
		generation: captureSessionTranscriptReconcileGeneration()
	};
}
function reconcileKey(params) {
	return resolveAssistantAgentSqlitePath(params);
}
function captureMemorySource(params) {
	const database = getAssistantAgentDatabaseIfOpen(params);
	return database && isIncognitoAssistantAgentDatabase(database) ? createMemoryTranscriptProjectionSource(database, {
		...params,
		path: database.path
	}) : void 0;
}
function nextProjectionClaimId() {
	return -randomInt(1, 2 ** 47);
}
function continueProjectionWorker(worker, accepted) {
	worker.postMessage({
		accepted,
		type: "continue"
	}, []);
}
async function runProjectionWrite(databaseOptions, operationLabel, operation, memorySource) {
	return await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
		const write = () => {
			memorySource?.assertCurrentOwner();
			return runAssistantAgentWriteTransaction(operation, databaseOptions, { operationLabel });
		};
		return !isIncognitoAssistantAgentSqlitePath(databaseOptions.path, databaseOptions) && !getAssistantAgentDatabaseIfOpen(databaseOptions) ? withAssistantAgentDatabaseAsync(databaseOptions, write) : write();
	}, operationLabel);
}
async function claimPreparedSessionTranscriptProjection(databaseOptions, plan, memorySource) {
	const claimId = nextProjectionClaimId();
	if (!await runProjectionWrite(databaseOptions, "sessions.transcript-index.claim", (database) => (!memorySource || memorySource.isCurrentPlan(plan)) && claimPreparedSessionTranscriptProjectionInTransaction(database.db, plan, claimId), memorySource)) return;
	let deleteResult = {
		hasMore: true,
		owned: true
	};
	while (deleteResult.hasMore && deleteResult.owned) {
		deleteResult = await runProjectionWrite(databaseOptions, "sessions.transcript-index.delete-chunk", (database) => deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
			maxRowsPerTable: PROJECTION_WRITE_CHUNK_ROWS,
			sessionId: plan.sessionId,
			claimId
		}), memorySource);
		await setImmediate();
	}
	if (!deleteResult.owned) return;
	return {
		claimId,
		plan
	};
}
function decodeFtsChunk(chunk) {
	const decoder = new TextDecoder();
	return chunk.rows.map((row) => ({
		messageId: row.messageId,
		role: row.role,
		text: decoder.decode(chunk.textBytes.subarray(row.textByteOffset, row.textByteOffset + row.textByteLength)),
		timestamp: row.timestamp
	}));
}
async function appendPreparedProjectionChunk(databaseOptions, active, rows, memorySource) {
	const owned = await runProjectionWrite(databaseOptions, "activeRows" in rows ? "sessions.transcript-index.active-chunk" : "sessions.transcript-index.fts-chunk", (database) => appendPreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
		...rows,
		claimId: active.claimId,
		sessionId: active.plan.sessionId
	}), memorySource);
	await setImmediate();
	return owned;
}
async function finalizePreparedProjection(databaseOptions, active, memorySource) {
	return await runProjectionWrite(databaseOptions, "sessions.transcript-index.finalize", (database) => {
		const finalized = (!memorySource || memorySource.isCurrentPlan(active.plan)) && finalizePreparedSessionTranscriptProjectionInTransaction(database.db, active.plan, active.claimId);
		const session = finalized && executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", active.plan.sessionId));
		if (session) sessionChanges.emit({
			storePath: database.path,
			sessionKey: session.session_key
		}, database.db);
		return finalized;
	}, memorySource);
}
/** Prepares full trees off-thread, then commits bounded chunks through the runtime writer owner. */
async function reconcileSessionTranscriptIndexes(params) {
	const prepared = prepareReconcileParams(params);
	return runSessionTranscriptReconcileOperation(prepared.generation, (operation) => reconcilePreparedTranscriptIndexes(prepared, operation), isIncognitoAssistantAgentSqlitePath(reconcileKey(prepared), prepared) ? void 0 : {
		agentId: prepared.agentId,
		path: reconcileKey(prepared)
	});
}
async function reconcilePreparedTranscriptIndexes(params, operation) {
	operation.signal.throwIfAborted();
	const databasePath = resolveAssistantAgentSqlitePath(params);
	const databaseOptions = {
		agentId: params.agentId,
		env: params.env,
		path: databasePath
	};
	let releaseDatabase;
	const memorySource = captureMemorySource(databaseOptions);
	let memorySessionIds = [];
	try {
		if (!memorySource) {
			if (await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				try {
					const pending = withAssistantAgentDatabaseReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => hasSessionsNeedingTranscriptIndexReconcile(db) || hasOrphanedTranscriptIndexRows(db)), databaseOptions);
					return pending.found && !pending.value;
				} catch {
					return false;
				}
			}, "sessions.transcript-index.preflight")) return { reconciledSessions: 0 };
		}
		operation.signal.throwIfAborted();
		await runProjectionWrite(databaseOptions, "sessions.transcript-index.preflight", (database) => {
			deleteOrphanedTranscriptIndexRowsInTransaction(database.db);
			const sessionIds = listSessionsNeedingTranscriptIndexReconcile(database.db);
			if (sessionIds.length > 0) {
				releaseDatabase = borrowAssistantAgentDatabase(databaseOptions).release;
				if (memorySource) {
					const preferred = params.preferredSessionId;
					memorySessionIds = preferred && sessionIds.includes(preferred) ? [preferred, ...sessionIds.filter((sessionId) => sessionId !== preferred)] : sessionIds;
				}
			}
		}, memorySource);
		if (!releaseDatabase) return { reconciledSessions: 0 };
		const input = memorySource ? {
			mode: "memory",
			sessionIds: memorySessionIds
		} : {
			mode: "disk",
			leaseId: randomUUID(),
			agentId: params.agentId,
			path: databasePath,
			stateDir: resolveStateDir(params.env),
			externallySupervised: isGatewayExternallySupervised(params.env),
			...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
		};
		const task = operation.startTask(input);
		const worker = task.port;
		let handlingMessage;
		let terminalReceived = false;
		let outcome;
		try {
			const value = await new Promise((resolve, reject) => {
				let active;
				let reconciledSessions = 0;
				let settled = false;
				const settle = (finish) => {
					if (settled) return;
					settled = true;
					finish();
				};
				const handleMessage = async (message) => {
					if (message.type === "failed") {
						terminalReceived = true;
						settle(() => reject(new Error(message.error)));
						return;
					}
					if (message.type === "done") {
						terminalReceived = true;
						if (active) {
							settle(() => reject(/* @__PURE__ */ new Error("session transcript reconcile worker ended mid-plan")));
							return;
						}
						try {
							await runProjectionWrite(databaseOptions, "sessions.transcript-index.orphan-sweep", (database) => deleteOrphanedTranscriptIndexRowsInTransaction(database.db), memorySource);
						} catch (error) {
							settle(() => reject(toStringifiedError(error)));
							return;
						}
						settle(() => resolve({ reconciledSessions }));
						return;
					}
					try {
						if (message.type === "source-read") {
							if (!memorySource || !memorySessionIds.includes(message.sessionId)) throw new Error("session transcript worker requested an unavailable memory source");
							const frame = memorySource.read(message.sessionId);
							await setImmediate();
							worker.postMessage(frame, frame.type === "source-frame" ? [frame.bytes.buffer] : []);
							return;
						}
						if (message.type === "plan-start") {
							if (active) throw new Error("session transcript reconcile worker started overlapping plans");
							active = await claimPreparedSessionTranscriptProjection(databaseOptions, message.plan, memorySource);
							continueProjectionWorker(worker, active !== void 0);
							return;
						}
						if (!active || active.plan.sessionId !== message.sessionId) throw new Error("session transcript reconcile worker sent a chunk for no active plan");
						if (message.type === "plan-finish") {
							const finalized = await finalizePreparedProjection(databaseOptions, active, memorySource);
							active = void 0;
							if (finalized) reconciledSessions += 1;
							continueProjectionWorker(worker, finalized);
							return;
						}
						const owned = await appendPreparedProjectionChunk(databaseOptions, active, message.type === "active-chunk" ? { activeRows: message.rows } : { ftsRows: decodeFtsChunk(message.chunk) }, memorySource);
						if (!owned) active = void 0;
						continueProjectionWorker(worker, owned);
					} catch (error) {
						settle(() => reject(toStringifiedError(error)));
					}
				};
				worker.on("message", (message) => {
					if (settled || message.type === "lease-released" || message.type === "lease-release-failed") return;
					handlingMessage = handleMessage(message);
				});
				worker.once("messageerror", (error) => {
					settle(() => reject(toStringifiedError(error)));
				});
				task.completion.then(async () => {
					await task.closed;
					if (!terminalReceived) settle(() => reject(/* @__PURE__ */ new Error("session transcript worker task ended without a result")));
				}, (error) => settle(() => reject(toStringifiedError(error))));
			});
			outcome = ok(value);
		} catch (error) {
			outcome = err(error);
		}
		let plannerFailure;
		try {
			if (!terminalReceived) task.controller.abort();
			await handlingMessage;
			if (input.mode === "disk" && terminalReceived) worker.postMessage({ type: "release" }, []);
			const plannerRelease = await task.leaseRelease;
			if (input.mode === "disk") {
				let cleanup = plannerRelease;
				if (!cleanup.released && !cleanup.releaseFailed) {
					const releaseTask = operation.startTask({
						mode: "release",
						leaseId: input.leaseId,
						stateDir: input.stateDir,
						externallySupervised: input.externallySupervised
					});
					try {
						cleanup = await releaseTask.leaseRelease;
					} finally {
						releaseTask.port.close();
						releaseTask.port.removeAllListeners();
					}
				}
				if (cleanup.failure) throw cleanup.failure;
				if (outcome.ok && plannerRelease.failure) plannerFailure = plannerRelease.failure;
			}
		} catch (error) {
			const failure = new Error(`Transcript lease cleanup incomplete; restart Assistant before deleting this agent: ${toStringifiedError(error).message}`, { cause: error });
			if (input.mode === "disk") operation.retainLeaseForCleanup({
				mode: "release",
				leaseId: input.leaseId,
				stateDir: input.stateDir,
				externallySupervised: input.externallySupervised
			});
			throw outcome.ok ? failure : new AggregateError([outcome.error, failure], failure.message, { cause: failure });
		} finally {
			worker.close();
			worker.removeAllListeners();
		}
		if (!outcome.ok) throw outcome.error;
		if (plannerFailure) throw plannerFailure;
		return outcome.value;
	} finally {
		memorySource?.clear();
		releaseDatabase?.();
	}
}
/** Starts one deferred reconcile. No transcript rows are read on the caller's stack. */
function startSessionTranscriptIndexReconcile(input) {
	startPreparedSessionTranscriptIndexReconcile(prepareReconcileParams(input));
}
function startPreparedSessionTranscriptIndexReconcile(params) {
	if (!isSessionTranscriptReconcileGenerationCurrent(params.generation)) return;
	const key = reconcileKey(params);
	const running = runningReconciles.get(key);
	if (running?.generation === params.generation) {
		running.pending = true;
		running.preferredSessionId ??= params.preferredSessionId;
		return;
	}
	const state = {
		generation: params.generation,
		pending: false,
		...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
	};
	const memorySource = captureMemorySource(params);
	state.promise = runSessionTranscriptReconcileOperation(params.generation, (operation) => {
		state.signal = operation.signal;
		return setImmediate().then(async () => {
			let reconciledSessions = 0;
			let retryCount = 0;
			while (true) {
				operation.signal.throwIfAborted();
				memorySource?.assertCurrentOwner();
				state.pending = false;
				const preferredSessionId = state.preferredSessionId;
				delete state.preferredSessionId;
				const result = await reconcilePreparedTranscriptIndexes({
					...params,
					...preferredSessionId ? { preferredSessionId } : {}
				}, operation);
				reconciledSessions += result.reconciledSessions;
				if (state.pending) {
					retryCount += 1;
					await setTimeout(computeBackoffSchedule(RECONCILE_RETRY_BACKOFF_MS, retryCount));
					continue;
				}
				if (runningReconciles.get(key) === state) runningReconciles.delete(key);
				return { reconciledSessions };
			}
		});
	}, isIncognitoAssistantAgentSqlitePath(key, params) ? void 0 : {
		agentId: params.agentId,
		path: key
	}).catch(async (error) => {
		log.warn(`session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`);
		const shouldHandoff = state.pending;
		const preferredSessionId = state.preferredSessionId;
		if (runningReconciles.get(key) === state) runningReconciles.delete(key);
		if (shouldHandoff && state.signal && !state.signal.aborted && (!memorySource || captureMemorySource(params))) {
			startPreparedSessionTranscriptIndexReconcile({
				...params,
				...preferredSessionId ? { preferredSessionId } : {}
			});
			await waitForSessionTranscriptIndexReconcile(params);
		}
		return { reconciledSessions: 0 };
	});
	runningReconciles.set(key, state);
}
function isSessionTranscriptIndexReconcileRunning(params) {
	return runningReconciles.has(reconcileKey(params));
}
/** Test and maintenance wait hook for an already-scheduled reconcile. */
async function waitForSessionTranscriptIndexReconcile(params) {
	await runningReconciles.get(reconcileKey(params))?.promise;
}
/** Waits only until the requested session's scheduled projection rebuild settles. */
async function waitForSessionTranscriptProjection(scope, abortSignal) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = prepareReconcileParams(toDatabaseOptions(resolved));
	const key = reconcileKey(databaseOptions);
	const needsReconcile = () => {
		const pending = withAssistantAgentDatabaseReadOnly(({ db }) => sessionTranscriptIndexNeedsReconcile(db, resolved.sessionId), databaseOptions);
		return pending.found && pending.value;
	};
	let running = runningReconciles.get(key);
	while (running) {
		if (!running.signal?.aborted && !needsReconcile()) return;
		await setTimeout(PROJECTION_READY_POLL_MS, void 0, abortSignal ? { signal: abortSignal } : void 0);
		if (!runningReconciles.has(key) && running.signal?.aborted && isSessionTranscriptReconcileGenerationCurrent(running.generation) && needsReconcile()) startPreparedSessionTranscriptIndexReconcile({
			...databaseOptions,
			generation: running.generation,
			preferredSessionId: resolved.sessionId
		});
		running = runningReconciles.get(key);
	}
}
//#endregion
export { extractTranscriptIndexEntry as _, waitForSessionTranscriptProjection as a, transcriptEventContextEligibility as b, SYNC_REBUILD_MAX_ROWS as c, hasSessionsNeedingTranscriptIndexReconcile as d, markSessionTranscriptIndexDirtyInTransaction as f, shouldRebuildSessionTranscriptIndexSynchronously as g, sessionTranscriptIndexNeedsReconcile as h, waitForSessionTranscriptIndexReconcile as i, createTranscriptIndexAppenderInTransaction as l, replaceSessionTranscriptIndexSuffixInTransaction as m, reconcileSessionTranscriptIndexes as n, createMemoryTranscriptProjectionSource as o, reconcileSessionTranscriptIndexInTransaction as p, startSessionTranscriptIndexReconcile as r, SYNC_REBUILD_MAX_BYTES as s, isSessionTranscriptIndexReconcileRunning as t, deleteSessionTranscriptIndexInTransaction as u, hasTranscriptMessage as v, shouldProjectActiveEvent as y };
