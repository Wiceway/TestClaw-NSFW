import { n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { f as validateDeliveryCanonicalSessionEntry, o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import { a as selectSessionEntryRows, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DgteG5a_.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D8rnGIu3.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-C-nUbtfm.mjs";
import { n as readSessionGroupCatalogEntry } from "./session-group-catalog.kernel-DOrJCCip.mjs";
import { bt as sqliteSessionEntriesEqual, f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-Ct1v5fIu.mjs";
//#region src/config/sessions/session-group-categories.read.ts
function readSessionGroupCategoryKeys(database, name) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "list").orderBy("session_key")).rows.flatMap((row) => {
		if (isInternalSessionEffectsKey(row.session_key)) return [];
		const entry = parseSessionEntryJson(row, "list");
		if (!entry) return [];
		validateDeliveryCanonicalSessionEntry(row.session_key, entry);
		return entry.category?.trim() === name ? [row.session_key] : [];
	});
}
//#endregion
//#region src/config/sessions/session-group-categories.kernel.ts
function prepareSessionGroupCategoryMutation(database, name) {
	const rows = /* @__PURE__ */ new Map();
	for (const key of readSessionGroupCategoryKeys(database, name)) {
		const row = readExactSessionEntryRow(database, key);
		if (row?.entry.category?.trim() === name) rows.set(key, row);
	}
	return rows;
}
function applySessionGroupCategoryMutation(database, expected, to, env) {
	const current = /* @__PURE__ */ new Map();
	for (const [key, before] of expected) {
		const row = readExactSessionEntryRow(database, key);
		if (!row || row.row.entry_json !== before.row.entry_json || !sqliteSessionEntriesEqual(row.entry, before.entry)) throw new Error(`SQLite session entry changed before replacement for ${key}`);
		current.set(key, row);
	}
	assertSessionGroupCategoryDestination(to, env);
	for (const [key, row] of current) {
		const next = { ...row.entry };
		if (to === void 0) delete next.category;
		else next.category = to;
		writeSessionEntry(database, key, next, {
			canonicalPreviousEntry: row.entry,
			previousEntry: row.entry
		});
	}
	return [...current].map(([sessionKey, { entry }]) => ({
		sessionKey,
		sessionId: entry.sessionId
	}));
}
function assertSessionGroupCategoryDestination(to, env) {
	if (to !== void 0 && !withExistingAssistantStateDatabaseReadOnly(({ db }) => readSessionGroupCatalogEntry(db, to), { env })) throw new Error(`unknown session group: ${to}`);
}
//#endregion
export { assertSessionGroupCategoryDestination as n, prepareSessionGroupCategoryMutation as r, applySessionGroupCategoryMutation as t };
