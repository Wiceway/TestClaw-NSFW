import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { a as getSessionKysely, n as cloneSessionEntry } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { o as readExactSessionEntryRow, r as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import { r as projectSessionSharingEntry } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D8rnGIu3.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-BKBM7n1O.mjs";
import { bt as sqliteSessionEntriesEqual, f as writeSessionEntry, n as deleteLegacySessionEntryRows } from "./session-accessor.sqlite-entry-store-Ct1v5fIu.mjs";
import { r as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-2RyZJSfV.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-read.ts
function readSessionEntryReplacementLabelOwnerKeys(database, label) {
	return label === void 0 ? [] : executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("label", "=", label).orderBy("session_key")).rows.map((row) => row.session_key);
}
function selectReplacementKeys(database, params, labelOwnerKeys) {
	if (params.statuses) {
		if (params.statuses.length === 0) return [];
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("status", "in", params.statuses);
		if (params.sessionKeys) query = query.where("session_key", "in", sqliteStringSet(params.sessionKeys));
		return executeSqliteQuerySync(database.db, query).rows.map((row) => row.session_key).toSorted((left, right) => left.localeCompare(right));
	}
	if (params.sessionKeys) return uniqueStrings([...params.sessionKeys, ...labelOwnerKeys]);
	assertCanonicalSqliteSessionKeysCurrent(database);
	return [...iterateSessionEntryKeys(database)];
}
/** Detached entries and their CAS bytes must come from the same admitted read snapshot. */
function readSessionEntryReplacementState(database, params) {
	const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
	const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
	const labelOwnerKeys = readSessionEntryReplacementLabelOwnerKeys(database, params.includeLabelOwners);
	const selected = selectReplacementKeys(database, params, labelOwnerKeys);
	const expectedRows = /* @__PURE__ */ new Map();
	const readPrepared = selected.length > 1 ? prepareExactSessionEntryRowReads(database, selected) : void 0;
	return {
		entries: selected.flatMap((sessionKey) => {
			const row = readPrepared ? readPrepared(sessionKey) : readExactSessionEntryRow(database, sessionKey);
			if (!row) {
				if (!selectedKeys || selectedStatuses) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
				return [];
			}
			if (selectedStatuses && (!row.entry.status || !selectedStatuses.has(row.entry.status))) return [];
			expectedRows.set(sessionKey, row);
			return [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}];
		}),
		expectedRows,
		labelOwnerKeys
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-state.ts
/** Receipts carry only publication facts, never saved prompts or maintenance payloads. */
function prepareSessionEntryReplacementPublication(result) {
	return {
		kind: "session-entry-replacements",
		membershipInvalidatedKeys: result.membershipInvalidatedKeys,
		previous: new Map([...result.previous].map(([key, entry]) => [key, {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		}])),
		current: new Map([...result.current].map(([key, entry]) => [key, projectSessionSharingEntry(entry)])),
		changedKeys: [.../* @__PURE__ */ new Set([
			...result.previous.keys(),
			...result.current.keys(),
			...result.maintenancePlans.flatMap((plan) => plan.archivedSessionKeys)
		])]
	};
}
/** One SQL owner serves admitted worker writes and the native rollback exception. */
function commitSessionEntryReplacementsInDatabase(database, input, assertCommitAllowed) {
	if (input.includeLabelOwners !== void 0 && JSON.stringify(readSessionEntryReplacementLabelOwnerKeys(database, input.includeLabelOwners)) !== JSON.stringify(input.labelOwnerKeys)) throw new Error("SQLite session label owners changed before replacement");
	const transactionEntries = /* @__PURE__ */ new Map();
	for (const sessionKey of input.validationKeys) {
		const transactionRow = readExactSessionEntryRow(database, sessionKey);
		const expectedRow = input.expectedRows.get(sessionKey);
		if (transactionRow?.row.entry_json !== expectedRow?.row.entry_json || !sqliteSessionEntriesEqual(transactionRow?.entry, expectedRow?.entry)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
		if (transactionRow) transactionEntries.set(sessionKey, transactionRow.entry);
	}
	assertCommitAllowed();
	const previous = /* @__PURE__ */ new Map();
	const current = /* @__PURE__ */ new Map();
	const membershipInvalidatedKeys = [];
	for (const replacement of input.replacements) {
		const sourceEntries = [replacement.sessionKey, ...replacement.previousSessionKeys ?? []].flatMap((sessionKey) => {
			const entry = transactionEntries.get(sessionKey);
			return entry ? [{
				entry,
				sessionKey
			}] : [];
		});
		const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
		for (const { entry, sessionKey } of sourceEntries) previous.set(sessionKey, entry);
		const written = writeSessionEntry(database, replacement.sessionKey, cloneSessionEntry(replacement.entry), {
			...input.consumePendingReset ? { consumePendingReset: true } : {},
			previousEntry: selectedBefore ?? null,
			canonicalPreviousEntry: transactionEntries.get(replacement.sessionKey) ?? null
		});
		deleteLegacySessionEntryRows(database, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, { rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId });
		if (replacement.previousSessionKeys?.some((key) => key !== replacement.sessionKey)) membershipInvalidatedKeys.push(replacement.sessionKey);
		current.set(replacement.sessionKey, written);
	}
	const maintenance = input.maintenance;
	const preservation = maintenance?.preservation;
	return {
		previous,
		current,
		maintenancePlans: [maintenance && preservation ? applySessionEntryMaintenanceInDatabase(database, maintenance, () => preservation) : emptySessionEntryMaintenancePlan()],
		membershipInvalidatedKeys
	};
}
//#endregion
export { prepareSessionEntryReplacementPublication as n, readSessionEntryReplacementState as r, commitSessionEntryReplacementsInDatabase as t };
