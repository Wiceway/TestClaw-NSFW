import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { A as parseAgentSessionKey, b as isCronRunSessionKey } from "./session-key-C_bfgyCp.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CRW06h3K.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-Bar1ps-o.mjs";
import { r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-FtNy8CfS.mjs";
import { g as toDatabaseOptions, n as cloneSessionEntry, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { d as readSessionEntryCache } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
import { m as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-D8rnGIu3.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-C-nUbtfm.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-list.read.ts
/**
* Lists session entries without opening the agent database writable.
* Transient lock errors propagate: only the caller knows whether "empty" is an
* acceptable degradation (health snapshots) or hides real state (migration detection).
*/
function listSessionEntriesReadOnly(scope = {}, options = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withAssistantAgentDatabaseReadOnly((database) => listSqliteSessionEntriesFromDatabase(database, resolved, scope, options), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
function listSqliteSessionEntriesFromDatabase(database, resolved, scope, options = {}) {
	if (scope.expiredCronRuns) {
		const { agentId, updatedBefore } = scope.expiredCronRuns;
		const requestedOwner = normalizeAgentId(agentId);
		return withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
			const selectedKeys = /* @__PURE__ */ new Set();
			const snapshot = readSessionEntryCache(database, {
				cache: false,
				retainFullEntry: (sessionKey, entry) => {
					const selected = isCronRunSessionKey(sessionKey) && normalizeAgentId(parseAgentSessionKey(sessionKey).agentId) === requestedOwner && !((entry.updatedAt ?? 0) >= updatedBefore);
					if (selected) selectedKeys.add(sessionKey);
					return selected;
				}
			});
			return Array.from(iterateSessionEntriesForListing(snapshot, false, selectedKeys));
		}));
	}
	const projection = scope.projection ?? "full";
	const cache = !isIncognitoAssistantAgentSqlitePath(database.path, {
		agentId: database.agentId,
		env: resolved.env
	});
	const snapshot = readSessionEntryCache(database, {
		cache,
		latest: scope.readConsistency === "latest",
		projection,
		deferParticipants: options.deferParticipants
	});
	return Array.from(iterateSessionEntriesForListing(snapshot, projection === "list" && scope.clone !== false, scope.sessionKeys ? new Set(scope.sessionKeys) : void 0));
}
/** Applies the listing visibility and canonical-key contract to an owned snapshot. */
function* iterateSessionEntriesForListing(snapshot, cloneEntries = false, sessionKeys) {
	for (const sessionKey of snapshot.keys) {
		if (isInternalSessionEffectsKey(sessionKey)) continue;
		const entry = snapshot.entries.get(sessionKey);
		if (!entry) continue;
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
		if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		if (sessionKeys && !sessionKeys.has(sessionKey)) continue;
		yield {
			sessionKey,
			entry: cloneEntries ? cloneSessionEntry(entry) : entry
		};
	}
}
//#endregion
export { listSessionEntriesReadOnly as n, listSqliteSessionEntriesFromDatabase as r, iterateSessionEntriesForListing as t };
