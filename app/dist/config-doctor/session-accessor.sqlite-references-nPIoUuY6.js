import { y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { _ as parseSessionEntryJson, x as sessionEntryMetadataJson } from "./session-canonical-key-Bxbtl4CI.js";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { c as isRecentSessionMaintenanceEntry, l as isSessionEntryDiskBudgetEvictable, t as readLegacyCompactionHistory } from "./legacy-compaction-history-3Lv-j3a5.js";
//#region src/config/sessions/session-accessor.sqlite-references.ts
/** Every transcript generation retained by one canonical logical-session record. */
function collectSessionStateIdsForEntry(entry) {
	const sessionIds = [];
	const add = (sessionId) => {
		const normalized = sessionId?.trim();
		if (normalized) sessionIds.push(normalized);
	};
	add(entry.sessionId);
	add(entry.previousSessionId);
	for (const sessionId of entry.usageFamilySessionIds ?? []) add(sessionId);
	for (const checkpoint of readLegacyCompactionHistory(entry)) {
		add(checkpoint.sessionId);
		add(checkpoint.preCompaction.sessionId);
		add(checkpoint.postCompaction.sessionId);
	}
	return uniqueStrings(sessionIds);
}
/** Retained logical owners protect generations absent from their entry references. */
function addRetainedWindowSessionReferences(database, sessionIds, excludedSessionKeys, candidateSessionIds, diskBudget) {
	let query = getSessionKysely(database.db).selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_windows.session_id",
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.updated_at",
		"session_nodes.pinned_at"
	]).$if(diskBudget !== void 0, (projection) => projection.select(sessionEntryMetadataJson)).where((eb) => eb.or([eb("session_nodes.archived_at", "is not", null), eb("session_nodes.pinned_at", "is not", null)]));
	if (candidateSessionIds) query = query.where("session_windows.session_id", "in", sqliteStringSet(candidateSessionIds));
	for (const row of iterateSqliteQuerySync(database.db, query)) {
		if (excludedSessionKeys.has(row.session_key)) continue;
		if (diskBudget && row.pinned_at === null && row.entry_json !== void 0 && isSessionEntryDiskBudgetEvictable({
			key: row.session_key,
			entry: parseSessionEntryJson({
				...row,
				entry_json: row.entry_json
			}) ?? void 0,
			preserveRecentMs: diskBudget.preserveRecentMs
		})) continue;
		sessionIds.add(row.session_id);
	}
}
function collectRecentSessionHistoryIds(params) {
	if (params.preserveRecentMs == null) return /* @__PURE__ */ new Set();
	const db = getNodeSqliteKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_nodes.current_session_id",
		"session_nodes.session_key",
		"session_nodes.updated_at",
		"session_windows.session_id"
	]).select((eb) => eb.case().when(eb(eb.selectFrom("pragma_encoding").select("encoding"), "=", "UTF-8")).then(sessionEntryMetadataJson.expression).else(eb.ref("session_nodes.entry_json")).end().as("entry_json"))).rows;
	return new Set(rows.flatMap((row) => {
		const entry = parseSessionEntryJson(row);
		return entry && isRecentSessionMaintenanceEntry({
			key: row.session_key,
			entry,
			preserveRecentMs: params.preserveRecentMs
		}) ? [row.session_id] : [];
	}));
}
function isRecentHistoricalSessionId(params) {
	if (params.preserveRecentMs == null) return false;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_nodes.current_session_id",
		"session_nodes.entry_json",
		"session_nodes.session_key",
		"session_nodes.updated_at"
	]).where("session_windows.session_id", "=", params.sessionId)).rows[0];
	if (!row) return false;
	const entry = parseSessionEntryJson(row);
	return Boolean(entry && isRecentSessionMaintenanceEntry({
		key: row.session_key,
		entry,
		preserveRecentMs: params.preserveRecentMs
	}));
}
//#endregion
export { isRecentHistoricalSessionId as i, collectRecentSessionHistoryIds as n, collectSessionStateIdsForEntry as r, addRetainedWindowSessionReferences as t };
