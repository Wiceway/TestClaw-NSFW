import "./src-D9uQ497Z.js";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-AulM0PZ6.js";
import { n as buildAgentMainSessionKey } from "./session-key-C0UQClgw.js";
import { c as resolveAgentIdFromSessionKey, k as parseAgentSessionKey, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { H as normalizeSqliteNumber, W as ensureColumn } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { N as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP, P as SESSION_WATCH_PROVENANCE_EXPLICIT } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation, t as executeAssistantStateWorker } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { C as captureSessionWatcherStorePaths, T as resolvePhysicalSessionStorePath, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { n as isSystemEventStoreCurrent } from "./system-event-ownership-CyoXvClm.js";
import "./session-accessor-DMf92PxK.js";
import { t as classifySessionKind } from "./classify-session-kind-CarVk-L6.js";
import { n as enqueueSystemEvent, x as requestSessionEventWake } from "./system-events-BUr4KJmI.js";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/session-state-event-kinds.ts
const SESSION_CREATED_NOTICE_CONTEXT_PREFIX = "session-created:";
const NOTIFY_BY_SESSION_STATE_EVENT_KIND = {
	created: false,
	human_direct_message: true,
	upstream_missing: true,
	adopted: false,
	goal_changed: true,
	run_completed: false,
	run_failed: false,
	child_spawned: false,
	compacted: false
};
//#endregion
//#region src/sessions/session-upstream-links.kernel.ts
function parseJson(value) {
	if (value === null) return null;
	return safeParseJson(value) ?? null;
}
function rowToSessionUpstreamLink(row) {
	return {
		sessionKey: row.session_key,
		agentId: row.agent_id,
		catalogId: row.catalog_id,
		hostId: row.host_id,
		threadId: row.thread_id,
		upstreamKind: row.upstream_kind,
		upstreamRef: parseJson(row.upstream_ref_json),
		marker: parseJson(row.last_marker_json),
		...row.last_scanned_at === null ? {} : { lastScannedAt: normalizeSqliteNumber(row.last_scanned_at) ?? 0 },
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0
	};
}
//#endregion
//#region src/sessions/session-state-events.kernel.ts
function rowToSessionStateEvent(row) {
	const payload = row.payload_json ? safeParseJsonRecord(row.payload_json) : void 0;
	return {
		sequence: normalizeSqliteNumber(row.sequence) ?? 0,
		sessionKey: row.session_key,
		...row.session_id ? { sessionId: row.session_id } : {},
		agentId: row.agent_id,
		kind: row.kind,
		actorType: row.actor_type,
		...row.actor_id ? { actorId: row.actor_id } : {},
		...row.run_id ? { runId: row.run_id } : {},
		occurredAt: normalizeSqliteNumber(row.occurred_at) ?? 0,
		summary: row.summary,
		...payload ? { payload } : {}
	};
}
const SESSION_STATE_RETENTION_MS = 2592e6;
const SESSION_STATE_MAX_ROWS = 5e4;
const watcherSchemas = /* @__PURE__ */ new WeakSet();
function ensureWatcherStoreColumn(db) {
	if (watcherSchemas.has(db)) return;
	ensureColumn(db, "session_watch_cursors", "watcher_store_path TEXT");
	deferSqlitePostCommitPublication(db, () => watcherSchemas.add(db));
}
function isNotifiableWatcherKey(watcherSessionKey) {
	return parseAgentSessionKey(watcherSessionKey) != null;
}
function getSessionStateKysely(db) {
	return getNodeSqliteKysely(db);
}
function normalizeOptionalSqliteNumber(value) {
	return value === void 0 ? void 0 : normalizeSqliteNumber(value);
}
function bindSessionStateEvent(input, occurredAt) {
	return {
		dedupe_key: input.dedupeKey ?? null,
		session_key: input.sessionKey,
		session_id: input.sessionId ?? null,
		agent_id: input.agentId,
		kind: input.kind,
		actor_type: input.actorType,
		actor_id: input.actorId ?? null,
		run_id: input.runId ?? null,
		occurred_at: occurredAt,
		summary: input.summary,
		payload_json: input.payload ? JSON.stringify(input.payload) : null
	};
}
function readCursor(db, watcherSessionKey, targetSessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
}
function readMaterialCursors(db, watcherSessionKeys, targetSessionKey) {
	if (watcherSessionKeys.length <= 1 || watcherSessionKeys.some((key) => !key.isWellFormed())) return;
	const cursors = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < watcherSessionKeys.length; offset += 500) {
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().where("target_session_key", "=", targetSessionKey).where("watcher_session_key", "in", watcherSessionKeys.slice(offset, offset + 500))).rows;
		for (const row of rows) cursors.set(row.watcher_session_key, row);
	}
	return cursors;
}
function isAmbientGroupWatchCursor(row) {
	return row?.provenance === SESSION_WATCH_PROVENANCE_AMBIENT_GROUP;
}
function upsertSeedCursor(params) {
	ensureWatcherStoreColumn(params.db);
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		watcher_store_path: params.watcherStorePath ?? null,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		provenance: params.provenance ?? "explicit",
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		watcher_store_path: params.watcherStorePath ?? null,
		provenance: params.provenance ?? "explicit",
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
}
function updateMaterialCursor(params) {
	const { current } = params;
	const watcherStorePath = current ? current.watcher_store_path ?? null : params.watcherStorePath ?? null;
	const lastSeen = normalizeOptionalSqliteNumber(current?.last_seen_sequence) ?? 0;
	if (current && params.watcherStorePath !== void 0 && params.watcherStorePath !== watcherStorePath) return {
		lastSeenSequence: lastSeen,
		queueOnly: false,
		watcherStorePath: null
	};
	ensureWatcherStoreColumn(params.db);
	const notified = normalizeOptionalSqliteNumber(current?.notified_sequence) ?? 0;
	const frozenNotified = notified === lastSeen ? params.sequence : notified;
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		watcher_store_path: watcherStorePath,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: lastSeen,
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		provenance: SESSION_WATCH_PROVENANCE_EXPLICIT,
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
	return {
		lastSeenSequence: lastSeen,
		queueOnly: isAmbientGroupWatchCursor(current),
		watcherStorePath
	};
}
const SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS = 864e5;
function clampSessionStateOccurredAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value)) return now;
	return Math.min(Math.max(value, now - SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS), now);
}
/** The caller owns one synchronous transaction for the event, head, and cursors. */
function recordSessionStateEventInDatabase(db, input, now) {
	const occurredAt = clampSessionStateOccurredAt(input.occurredAt, now);
	const notices = [];
	const insert = executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_events").values(bindSessionStateEvent(input, occurredAt)).onConflict((conflict) => conflict.column("dedupe_key").doNothing()));
	const insertedSequence = insert.insertId ? Number(insert.insertId) : void 0;
	if (insertedSequence === void 0) {
		if (!input.dedupeKey) return { notices };
		return {
			row: executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("dedupe_key", "=", input.dedupeKey)),
			notices
		};
	}
	executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_heads").values({
		session_key: input.sessionKey,
		agent_id: input.agentId,
		last_sequence: insertedSequence,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["session_key", "agent_id"]).doUpdateSet({
		last_sequence: insertedSequence,
		updated_at: now
	})));
	const registeredWatcherKeys = NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] ? executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("target_session_key", "=", input.sessionKey)).rows.map((row) => row.watcher_session_key) : [];
	const watcherSessionKeys = [.../* @__PURE__ */ new Set([...input.watcherSessionKeys ?? [], ...registeredWatcherKeys])].filter((key) => Boolean(key) && isNotifiableWatcherKey(key));
	const cursors = NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] && watcherSessionKeys.length > 1 ? readMaterialCursors(db, watcherSessionKeys.filter((key) => key !== input.actorId), input.sessionKey) : void 0;
	for (const watcherSessionKey of watcherSessionKeys) {
		if (input.kind === "child_spawned") {
			upsertSeedCursor({
				db,
				watcherSessionKey,
				watcherStorePath: input.watcherStorePaths?.[watcherSessionKey],
				targetSessionKey: input.sessionKey,
				sequence: insertedSequence,
				now
			});
			continue;
		}
		if (!NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] || input.actorId === watcherSessionKey) continue;
		const materialCursor = updateMaterialCursor({
			db,
			current: cursors ? cursors.get(watcherSessionKey) : readCursor(db, watcherSessionKey, input.sessionKey),
			watcherSessionKey,
			watcherStorePath: input.watcherStorePaths?.[watcherSessionKey],
			targetSessionKey: input.sessionKey,
			sequence: insertedSequence,
			now
		});
		notices.push({
			watcherSessionKey,
			watcherStorePath: materialCursor.watcherStorePath,
			targetSessionKey: input.sessionKey,
			lastSeenSequence: materialCursor.lastSeenSequence,
			queueOnly: materialCursor.queueOnly
		});
	}
	return {
		row: executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("sequence", "=", insertedSequence)),
		notices
	};
}
/** The caller owns the transaction and schedules retention after notice publication. */
function pruneSessionStateEventsInDatabase(db, now) {
	const kysely = getSessionStateKysely(db);
	const stampPrunedWatermarks = (predicate) => {
		let query = kysely.selectFrom("session_state_events").select(["session_key", "agent_id"]).select((eb) => eb.fn.max("sequence").as("max_sequence")).groupBy(["session_key", "agent_id"]);
		if (predicate.occurredBefore !== void 0) query = query.where("occurred_at", "<", predicate.occurredBefore);
		if (predicate.sequenceAtOrBelow !== void 0) query = query.where("sequence", "<=", predicate.sequenceAtOrBelow);
		const rows = executeSqliteQuerySync(db, query).rows;
		for (let offset = 0; offset < rows.length; offset += 100) {
			const selections = rows.slice(offset, offset + 100).map((row) => kysely.selectNoFrom((eb) => [
				eb.val(row.session_key).as("session_key"),
				eb.val(row.agent_id).as("agent_id"),
				eb.val(normalizeSqliteNumber(row.max_sequence) ?? 0).as("max_sequence")
			]));
			executeSqliteQuerySync(db, kysely.with("pruned", () => selections[0].unionAll(selections.slice(1))).with("watermarks", (qb) => qb.selectFrom("pruned").select(["session_key", "agent_id"]).select((eb) => eb.fn.max("max_sequence").as("max_sequence")).groupBy(["session_key", "agent_id"])).updateTable("session_state_heads").from("watermarks").set((eb) => ({
				pruned_max_sequence: eb.ref("watermarks.max_sequence"),
				updated_at: now
			})).whereRef("session_state_heads.session_key", "=", "watermarks.session_key").whereRef("session_state_heads.agent_id", "=", "watermarks.agent_id").whereRef("session_state_heads.pruned_max_sequence", "<", "watermarks.max_sequence"));
		}
	};
	const retentionCutoff = now - SESSION_STATE_RETENTION_MS;
	stampPrunedWatermarks({ occurredBefore: retentionCutoff });
	executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("occurred_at", "<", retentionCutoff));
	const sequenceCutoff = normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select("sequence").orderBy("sequence", "desc").offset(SESSION_STATE_MAX_ROWS).limit(1))?.sequence);
	if (sequenceCutoff !== void 0) {
		stampPrunedWatermarks({ sequenceAtOrBelow: sequenceCutoff });
		executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("sequence", "<=", sequenceCutoff));
	}
	const cursorCutoff = now - SESSION_STATE_RETENTION_MS;
	executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("updated_at", "<", cursorCutoff));
}
//#endregion
//#region src/sessions/session-state-notices.ts
/** Stale-state notice text, coalescing keys, and watcher eligibility. */
const SESSION_STATE_CONTEXT_PREFIX = "session-state:";
const SESSION_STATE_WAKE_COALESCE_MS = 2e4;
function encodeNoticeTarget(sessionKey) {
	return Buffer.from(sessionKey, "utf8").toString("hex");
}
function decodeSessionStateNoticeContextKey(contextKey) {
	if (!contextKey.startsWith(SESSION_STATE_CONTEXT_PREFIX)) return;
	const encoded = contextKey.slice(14);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function sessionStateNoticeText(targetSessionKey, lastSeenSequence) {
	return `Session "${targetSessionKey}" changed (other actor). Reconcile before acting: session_status sessionKey "${targetSessionKey}" changesSince ${lastSeenSequence}.`;
}
function shouldWakeWatcher(watcherSessionKey) {
	return !isSubagentSessionKey(watcherSessionKey);
}
function enqueueSessionStateNotice(params) {
	enqueueSystemEvent(sessionStateNoticeText(params.targetSessionKey, params.lastSeenSequence), {
		sessionKey: params.watcherSessionKey,
		sessionStorePath: params.watcherStorePath ?? null,
		contextKey: `${SESSION_STATE_CONTEXT_PREFIX}${encodeNoticeTarget(params.targetSessionKey)}`,
		...params.queueOnly ? { replace: true } : {}
	});
	if (params.queueOnly) return;
	if (!shouldWakeWatcher(params.watcherSessionKey)) return;
	requestSessionEventWake({
		source: "session-state",
		intent: "immediate",
		reason: `session-state:${params.targetSessionKey}`,
		sessionKey: params.watcherSessionKey,
		sessionStorePath: params.watcherStorePath ?? null,
		coalesceMs: SESSION_STATE_WAKE_COALESCE_MS
	});
}
//#endregion
//#region src/sessions/session-upstream-links.ts
const log$1 = createSubsystemLogger("sessions/upstream-links");
function getSessionUpstreamKysely(db) {
	return getNodeSqliteKysely(db);
}
function upsertSessionUpstreamLink(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		return runAssistantStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const written = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).insertInto("session_upstream_links").values({
				session_key: input.sessionKey,
				agent_id: input.agentId,
				catalog_id: input.catalogId,
				host_id: input.hostId,
				thread_id: input.threadId,
				upstream_kind: input.upstreamKind,
				upstream_ref_json: JSON.stringify(input.upstreamRef),
				last_marker_json: JSON.stringify(input.marker),
				last_scanned_at: null,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => options.ifAbsent ? conflict.columns(["session_key", "agent_id"]).doNothing() : conflict.columns(["session_key", "agent_id"]).doUpdateSet((eb) => {
				const sourceChanged = eb.or([
					eb("session_upstream_links.thread_id", "!=", eb.ref("excluded.thread_id")),
					eb("session_upstream_links.host_id", "!=", eb.ref("excluded.host_id")),
					eb("session_upstream_links.upstream_kind", "!=", eb.ref("excluded.upstream_kind")),
					eb("session_upstream_links.upstream_ref_json", "!=", eb.ref("excluded.upstream_ref_json"))
				]);
				return {
					agent_id: input.agentId,
					catalog_id: input.catalogId,
					host_id: input.hostId,
					thread_id: input.threadId,
					upstream_kind: input.upstreamKind,
					upstream_ref_json: JSON.stringify(input.upstreamRef),
					last_marker_json: eb.case().when(sourceChanged).then(JSON.stringify(input.marker)).else(eb.ref("session_upstream_links.last_marker_json")).end(),
					last_scanned_at: eb.case().when(sourceChanged).then(null).else(eb.ref("session_upstream_links.last_scanned_at")).end(),
					updated_at: now
				};
			}))).numAffectedRows === 1n;
			options.assertCommitAllowed?.();
			return written;
		}, options);
	} catch (error) {
		if (options.ifAbsent) throw error;
		log$1.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
function readSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		const { db } = openAssistantStateDatabase(options);
		const row = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
		return row ? rowToSessionUpstreamLink(row) : void 0;
	} catch (error) {
		log$1.warn(`failed to read session upstream link: ${String(error)}`);
		return;
	}
}
function updateSessionUpstreamLinkMarker(sessionKey, agentId, marker, options = {}) {
	const now = options.now ?? Date.now();
	try {
		let updated = false;
		runAssistantStateWriteTransaction(({ db }) => {
			let query = getSessionUpstreamKysely(db).updateTable("session_upstream_links").set({
				last_marker_json: JSON.stringify(marker),
				last_scanned_at: now,
				updated_at: now
			}).where("session_key", "=", sessionKey).where("agent_id", "=", agentId);
			if (options.expectedUpdatedAt !== void 0) query = query.where("updated_at", "=", options.expectedUpdatedAt);
			updated = executeSqliteQuerySync(db, query).numAffectedRows === 1n;
		}, options);
		return updated;
	} catch (error) {
		log$1.warn(`failed to update session upstream marker: ${String(error)}`);
		return false;
	}
}
function deleteSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		return runAssistantStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const kysely = getSessionUpstreamKysely(db);
			if (options.expected) {
				const row = executeSqliteQuerySync(db, kysely.selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
				if (!row) return "absent";
				if (!isDeepStrictEqual(rowToSessionUpstreamLink(row), options.expected)) return "changed";
			}
			executeSqliteQuerySync(db, kysely.deleteFrom("session_upstream_links").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			options.assertCommitAllowed?.();
			return "deleted";
		}, options);
	} catch (error) {
		if (options.expected) throw error;
		log$1.warn(`failed to delete session upstream link: ${String(error)}`);
		return;
	}
}
async function listWatchedSessionUpstreamLinks(options = {}) {
	const grouped = /* @__PURE__ */ new Map();
	try {
		const links = await executeAssistantStateWorker(captureAssistantStateWorkerContext(options), {
			type: "sessionUpstream.listWatched",
			input: void 0
		});
		const keyCounts = /* @__PURE__ */ new Map();
		for (const link of links) keyCounts.set(link.sessionKey, (keyCounts.get(link.sessionKey) ?? 0) + 1);
		for (const link of links) {
			if ((keyCounts.get(link.sessionKey) ?? 0) > 1) {
				log$1.warn(`skipping ambiguous upstream links for ${link.sessionKey}: multiple agents adopt the same key`);
				continue;
			}
			const catalogLinks = grouped.get(link.catalogId) ?? [];
			catalogLinks.push(link);
			grouped.set(link.catalogId, catalogLinks);
		}
	} catch (error) {
		log$1.warn(`failed to list watched session upstream links: ${String(error)}`);
	}
	return grouped;
}
//#endregion
//#region src/sessions/session-state-events.ts
/** Best-effort durable signal log for session state changes. */
const SESSION_STATE_PRUNE_INTERVAL_MS = 36e5;
const log = createSubsystemLogger("sessions/state-events");
let lastPruneAt = 0;
let prunePending = false;
/** Classify the actor once at producer boundaries; missing provenance is interactive human input. */
function classifySessionStateActor(opts) {
	if (opts.inputProvenance?.kind === "inter_session") return {
		actorType: "agent",
		...opts.inputProvenance.sourceSessionKey ? { actorId: opts.inputProvenance.sourceSessionKey } : {}
	};
	if (opts.inputProvenance?.kind === "internal_system" || (opts.internalEvents?.length ?? 0) > 0 || opts.sessionEffects === "internal") return { actorType: "system" };
	return {
		actorType: "human",
		...opts.humanActorId ? { actorId: opts.humanActorId } : {}
	};
}
/** Append a signal-log event without allowing signaling failure to fail the originating action. */
function recordSessionStateEvent(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		const ownedInput = {
			...input,
			watcherStorePaths: input.watcherStorePaths ?? captureSessionWatcherStorePaths(input.watcherSessionKeys, options.env)
		};
		const result = runAssistantStateWriteTransaction(({ db }) => recordSessionStateEventInDatabase(db, ownedInput, now), options);
		for (const notice of result.notices) enqueueSessionStateNotice(notice);
		if (!prunePending && now - lastPruneAt > SESSION_STATE_PRUNE_INTERVAL_MS) pruneSessionStateEvents({
			...options,
			now
		});
		return result.row ? rowToSessionStateEvent(result.row) : void 0;
	} catch (error) {
		log.warn(`failed to record session state event: ${String(error)}`);
		return;
	}
}
/** Return the durable signal-log head for one session; degrades to 0 on read failure. */
function getSessionStateVersion(sessionKey, agentId, options = {}) {
	try {
		const { db } = openAssistantStateDatabase(options);
		return normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", sessionKey).where("agent_id", "=", agentId))?.last_sequence) ?? 0;
	} catch (error) {
		log.warn(`failed to read session state version: ${String(error)}`);
		return 0;
	}
}
/** Batch durable signal-log heads for session-list enrichment, keyed agent → session key. */
function getSessionStateVersions(refs, options = {}) {
	const keys = [...new Set(refs.map((ref) => ref.sessionKey).filter(Boolean))];
	if (keys.length === 0) return {};
	const byAgent = {};
	try {
		const { db } = openAssistantStateDatabase(options);
		for (let offset = 0; offset < keys.length; offset += 500) {
			const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select([
				"session_key",
				"agent_id",
				"last_sequence"
			]).where("session_key", "in", keys.slice(offset, offset + 500))).rows;
			for (const row of rows) (byAgent[row.agent_id] ??= {})[row.session_key] = normalizeSqliteNumber(row.last_sequence) ?? 0;
		}
	} catch (error) {
		log.warn(`failed to read session state versions: ${String(error)}`);
	}
	return byAgent;
}
/** List retained signal-log events after a version without advancing watcher cursors. */
function listSessionStateEventsSince(sessionKey, agentId, afterSequence, limit = 200, options = {}) {
	try {
		const boundedLimit = Math.max(1, Math.min(200, Math.floor(limit)));
		const { db } = openAssistantStateDatabase(options);
		const kysely = getSessionStateKysely(db);
		const rows = executeSqliteQuerySync(db, kysely.selectFrom("session_state_events").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId).where("sequence", ">", afterSequence).orderBy("sequence", "asc").limit(boundedLimit + 1)).rows;
		const earliest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select((eb) => eb.fn.min("sequence").as("sequence")).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const headRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_heads").select(["last_sequence", "pruned_max_sequence"]).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const head = normalizeOptionalSqliteNumber(headRow?.last_sequence) ?? 0;
		const prunedMax = normalizeOptionalSqliteNumber(headRow?.pruned_max_sequence) ?? 0;
		const earliestAvailableSequence = normalizeOptionalSqliteNumber(earliest?.sequence) ?? (head > 0 ? head + 1 : 0);
		return {
			events: rows.slice(0, boundedLimit).map(rowToSessionStateEvent),
			truncated: rows.length > boundedLimit,
			earliestAvailableSequence,
			historyGap: afterSequence < prunedMax
		};
	} catch (error) {
		log.warn(`failed to list session state events: ${String(error)}`);
		return {
			events: [],
			truncated: false,
			earliestAvailableSequence: 0,
			historyGap: false
		};
	}
}
/** Ack only the frozen notice watermark; advancing to head would lose an interleaved event. */
function acknowledgeSessionStateNotices(watcherSessionKey, targetSessionKeys, options = {}) {
	const now = options.now ?? Date.now();
	const followups = [];
	try {
		runAssistantStateWriteTransaction(({ db }) => {
			for (const targetSessionKey of new Set(targetSessionKeys)) {
				const row = readCursor(db, watcherSessionKey, targetSessionKey);
				if (!row || !isSystemEventStoreCurrent(watcherSessionKey, row.watcher_store_path ?? null)) continue;
				const notified = normalizeSqliteNumber(row.notified_sequence) ?? 0;
				const material = normalizeSqliteNumber(row.material_sequence) ?? 0;
				const nextNotified = material > notified ? material : notified;
				executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({
					last_seen_sequence: notified,
					notified_sequence: nextNotified,
					updated_at: now
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
				if (material > notified) followups.push({
					watcherSessionKey,
					watcherStorePath: row.watcher_store_path ?? null,
					targetSessionKey,
					lastSeenSequence: notified,
					queueOnly: isAmbientGroupWatchCursor(row)
				});
			}
		}, options);
		for (const followup of followups) enqueueSessionStateNotice(followup);
	} catch (error) {
		log.warn(`failed to acknowledge session state notices: ${String(error)}`);
	}
}
/** Reset parent-side assumptions while retaining target history across session incarnations. */
function handleSessionStateSessionReset(sessionKey, options = {}) {
	try {
		runAssistantStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getSessionStateKysely(db).deleteFrom("session_watch_cursors").where("watcher_session_key", "=", sessionKey));
		}, options);
	} catch (error) {
		log.warn(`failed to reset session state cursors: ${String(error)}`);
	}
}
/** Delete all signal-log and cursor state owned by a deleted session key. */
function handleSessionStateSessionDeleted(sessionKey, agentId, options = {}) {
	deleteSessionUpstreamLink(sessionKey, agentId, options);
	try {
		runAssistantStateWriteTransaction(({ db }) => {
			const kysely = getSessionStateKysely(db);
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_heads").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where((eb) => eb.or([eb("watcher_session_key", "=", sessionKey), eb("target_session_key", "=", sessionKey)])));
		}, options);
	} catch (error) {
		log.warn(`failed to delete session state history: ${String(error)}`);
	}
}
function sessionExists(sessionKey, env) {
	try {
		return Boolean(loadSessionEntryReadOnly({
			sessionKey,
			clone: false,
			env
		}));
	} catch {
		return false;
	}
}
/** Re-materialize pending notices after the in-memory queue is lost on restart. */
function sweepSessionStateWatchNotices(options = {}) {
	const now = options.now ?? Date.now();
	try {
		const { db } = openAssistantStateDatabase(options);
		const pendingRows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().whereRef("material_sequence", ">", "last_seen_sequence")).rows.filter((row) => sessionExists(row.watcher_session_key, options.env));
		runAssistantStateWriteTransaction(({ db: writeDb }) => {
			for (const row of pendingRows) executeSqliteQuerySync(writeDb, getSessionStateKysely(writeDb).updateTable("session_watch_cursors").set({
				notified_sequence: row.material_sequence,
				updated_at: now
			}).where("watcher_session_key", "=", row.watcher_session_key).where("target_session_key", "=", row.target_session_key));
		}, options);
		for (const row of pendingRows) enqueueSessionStateNotice({
			watcherSessionKey: row.watcher_session_key,
			watcherStorePath: row.watcher_store_path ?? null,
			targetSessionKey: row.target_session_key,
			lastSeenSequence: normalizeSqliteNumber(row.last_seen_sequence) ?? 0,
			queueOnly: isAmbientGroupWatchCursor(row)
		});
		pruneSessionStateEvents({
			...options,
			now
		});
	} catch (error) {
		log.warn(`failed to sweep session state notices: ${String(error)}`);
	}
}
/** Enforce bounded retained history without regressing durable per-session heads. */
function pruneSessionStateEvents(options = {}) {
	const now = options.now ?? Date.now();
	try {
		runAssistantStateWriteTransaction(({ db }) => pruneSessionStateEventsInDatabase(db, now), options);
		lastPruneAt = now;
	} catch (error) {
		log.warn(`failed to prune session state history: ${String(error)}`);
	}
}
/** Record one successful compaction from the two concrete v1 owners. */
function recordSessionCompacted(params) {
	if (!params.sessionKey) return;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "compacted",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `compacted:${params.operationId}`,
		summary: "session compacted"
	});
}
/** Async producers settle the existing worker's event, notices, and bounded maintenance together. */
async function recordSessionStateEventAsync(input, options = {}) {
	try {
		const context = captureAssistantStateWorkerContext(options);
		const now = options.now ?? Date.now();
		const event = structuredClone({
			...input,
			watcherStorePaths: input.watcherStorePaths ?? captureSessionWatcherStorePaths(input.watcherSessionKeys, options.env)
		});
		const expectedUpstream = options.expectedUpstream && structuredClone(options.expectedUpstream);
		return await runAssistantStateWorkerOperation(context, async (scope) => {
			const recorded = await scope.execute({
				type: "sessionState.record",
				input: {
					event,
					now,
					onlyIfWatched: options.onlyIfWatched,
					expectedUpstream
				}
			});
			for (const notice of recorded.notices) enqueueSessionStateNotice(notice);
			if (recorded.row && !prunePending && now - lastPruneAt > SESSION_STATE_PRUNE_INTERVAL_MS) {
				prunePending = true;
				try {
					await scope.execute({
						type: "sessionState.prune",
						input: { now }
					});
					lastPruneAt = Math.max(lastPruneAt, now);
				} catch (error) {
					log.warn(`failed to prune session state history: ${String(error)}`);
				} finally {
					prunePending = false;
				}
			}
			return recorded.row ? rowToSessionStateEvent(recorded.row) : void 0;
		}, {
			assertCurrent: options.assertCurrent,
			createAdmission: () => ({
				nativeLocations: [context.admission.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Session signal mutation requires transaction admission");
					context.admission.assertCurrent();
					options.assertCurrent?.();
					grant();
				})
			})
		});
	} catch (error) {
		try {
			log.warn(`failed to record session state event: ${String(error)}`);
		} catch {}
		return;
	}
}
/** Record a persisted goal mutation using lineage already available at the session-store seam. */
async function recordSessionGoalChanged(params) {
	const watcherSessionKey = params.entry.spawnedBy ?? params.entry.parentSessionKey;
	await recordSessionStateEventAsync({
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "goal_changed",
		actorType: params.actor?.type ?? "system",
		...params.actor?.id ? { actorId: params.actor.id } : {},
		summary: params.summary,
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	});
}
/** List durable ambient-group targets owned by one watcher; failures grant nothing. */
function listAmbientGroupWatchTargets(watcherSessionKey, options = {}) {
	try {
		const { db } = openAssistantStateDatabase(options);
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("target_session_key").where("watcher_session_key", "=", watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP)).rows;
		return new Set(rows.map((row) => row.target_session_key));
	} catch (error) {
		log.warn(`failed to list ambient group watch targets: ${String(error)}`);
		return /* @__PURE__ */ new Set();
	}
}
/** Register an explicit watcher (e.g. a sessions_send coordinator) for a target session. */
function registerSessionStateWatch(params, options = {}) {
	if (params.watcherSessionKey === params.targetSessionKey || !isNotifiableWatcherKey(params.watcherSessionKey)) return false;
	const now = options.now ?? Date.now();
	try {
		const watcherStorePath = resolvePhysicalSessionStorePath({
			sessionKey: params.watcherSessionKey,
			env: options.env
		});
		let registered = false;
		runAssistantStateWriteTransaction(({ db }) => {
			const existing = readCursor(db, params.watcherSessionKey, params.targetSessionKey);
			if (existing?.watcher_store_path === watcherStorePath) {
				if (existing.provenance !== "explicit") executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({ provenance: SESSION_WATCH_PROVENANCE_EXPLICIT }).where("watcher_session_key", "=", params.watcherSessionKey).where("target_session_key", "=", params.targetSessionKey));
				registered = true;
				return;
			}
			const agentId = params.targetAgentId ?? resolveAgentIdFromSessionKey(params.targetSessionKey);
			const head = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.targetSessionKey).where("agent_id", "=", agentId));
			upsertSeedCursor({
				db,
				watcherSessionKey: params.watcherSessionKey,
				watcherStorePath,
				targetSessionKey: params.targetSessionKey,
				sequence: normalizeOptionalSqliteNumber(head?.last_sequence) ?? 0,
				now
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register session state watch: ${String(error)}`);
		return false;
	}
}
/** Register the agent's main session to observe one routed group session. */
function registerMainSessionGroupWatch(params, options = {}) {
	if (classifySessionKind(params.sessionKey, params.entry) !== "group") return false;
	const watcherSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	if (params.sessionKey === watcherSessionKey) return false;
	const now = options.now ?? Date.now();
	try {
		const watcherStorePath = resolvePhysicalSessionStorePath({
			sessionKey: watcherSessionKey,
			env: options.env
		});
		const { db: readDb } = openAssistantStateDatabase(options);
		if (readCursor(readDb, watcherSessionKey, params.sessionKey)?.watcher_store_path === watcherStorePath) return true;
		let registered = false;
		runAssistantStateWriteTransaction(({ db }) => {
			if (readCursor(db, watcherSessionKey, params.sessionKey)?.watcher_store_path === watcherStorePath) {
				registered = true;
				return;
			}
			const sequence = normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.sessionKey).where("agent_id", "=", params.agentId))?.last_sequence) ?? 0;
			upsertSeedCursor({
				db,
				watcherSessionKey,
				watcherStorePath,
				targetSessionKey: params.sessionKey,
				sequence,
				now,
				provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register ambient group watch: ${String(error)}`);
		return false;
	}
}
async function recordSessionHumanDirectMessage(params, options = {}) {
	const watcherSessionKey = params.entry?.spawnedBy ?? params.entry?.parentSessionKey;
	if (params.actor.actorType !== "human") return;
	return recordSessionStateEventAsync({
		sessionKey: params.sessionKey,
		sessionId: params.entry?.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "human_direct_message",
		actorType: "human",
		...params.actor.actorId ? { actorId: params.actor.actorId } : {},
		runId: params.runId,
		...params.dedupeKey ? { dedupeKey: params.dedupeKey } : {},
		summary: `human message via ${params.channel?.trim() || "unknown"}`,
		payload: params.payload,
		...params.occurredAt === void 0 ? {} : { occurredAt: params.occurredAt },
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	}, {
		...options,
		onlyIfWatched: !watcherSessionKey
	});
}
/** Seed the parent cursor at the child-spawn version. */
function recordSubagentSpawned(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: params.agentId,
		kind: "child_spawned",
		actorType: "agent",
		actorId: params.requesterSessionKey,
		runId: params.childRunId,
		dedupeKey: `child-spawned:${params.childRunId}`,
		summary: "child session spawned",
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
const SUBAGENT_TERMINAL_SUMMARY = {
	ok: "child run completed",
	error: "child run failed",
	timeout: "child run timed out",
	cancelled: "child run cancelled"
};
/** Project an already-normalized subagent terminal outcome into the signal log. */
function recordSubagentTerminalState(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
		kind: params.outcomeStatus === "ok" ? "run_completed" : "run_failed",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `run-terminal:${params.runId}`,
		summary: SUBAGENT_TERMINAL_SUMMARY[params.outcomeStatus],
		...params.outcomeStatus === "ok" ? {} : { payload: { outcome: params.outcomeStatus } },
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
//#endregion
export { upsertSessionUpstreamLink as C, updateSessionUpstreamLinkMarker as S, SESSION_CREATED_NOTICE_CONTEXT_PREFIX as T, registerSessionStateWatch as _, handleSessionStateSessionDeleted as a, listWatchedSessionUpstreamLinks as b, listSessionStateEventsSince as c, recordSessionHumanDirectMessage as d, recordSessionStateEvent as f, registerMainSessionGroupWatch as g, recordSubagentTerminalState as h, getSessionStateVersions as i, recordSessionCompacted as l, recordSubagentSpawned as m, classifySessionStateActor as n, handleSessionStateSessionReset as o, recordSessionStateEventAsync as p, getSessionStateVersion as r, listAmbientGroupWatchTargets as s, acknowledgeSessionStateNotices as t, recordSessionGoalChanged as u, sweepSessionStateWatchNotices as v, decodeSessionStateNoticeContextKey as w, readSessionUpstreamLink as x, deleteSessionUpstreamLink as y };
