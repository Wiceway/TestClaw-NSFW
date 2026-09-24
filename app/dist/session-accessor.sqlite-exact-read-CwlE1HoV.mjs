import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as iterateSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { i as readAssistantAgentDatabaseIdentity, r as isAssistantAgentDatabasePathCurrent } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-DAdiee0a.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { c as readQualifiedSessionEntryRow, l as readSessionEntryRow, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import { u as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
import { l as readWithCanonicalSessionAdmission, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D8rnGIu3.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-C-nUbtfm.mjs";
//#region src/config/sessions/session-accessor.sqlite-exact-read.ts
/** Resolves one exact canonical entry without materializing the store. */
function resolveSessionEntry(scope, options = {}) {
	const resolved = resolveSqliteScope(scope);
	if (options.databaseAgentId) resolved.databaseAgentId = options.databaseAgentId;
	const read = (database) => {
		const projection = options.readOnly ? options.projection : "full";
		const selected = options.keyFormat === "agent-qualified" ? readQualifiedSessionEntryRow(database, resolved.agentId, resolved.sessionKey, {
			allowCanonicalMove: options.allowCanonicalMove,
			projection
		}) : readSessionEntryRow(database, resolved.sessionKey, projection);
		return {
			existing: selected?.entry ?? void 0,
			legacyKeys: [],
			normalizedKey: selected?.row.session_key ?? resolved.sessionKey
		};
	};
	if (options.readOnly) {
		const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => read(database)), toDatabaseOptions(resolved));
		return result.found ? result.value : {
			existing: void 0,
			legacyKeys: [],
			normalizedKey: resolved.sessionKey
		};
	}
	return read(openAssistantAgentDatabase(toDatabaseOptions(resolved)));
}
/** Loads one exact persisted-key entry from the additive SQLite session store. */
function loadExactSessionEntry(scope) {
	return loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: [scope.sessionKey],
		readOnly: false
	})[0];
}
/** Reads exact candidates for one logical session through a single store admission. */
function loadExactSessionEntryCandidates(scope) {
	const sessionKeys = scope.sessionKeys.map((key) => key.trim()).filter(Boolean);
	const [sessionKey] = sessionKeys;
	if (!sessionKey) return [];
	const options = "readSource" in scope ? {
		agentId: scope.readSource.agentId,
		path: scope.readSource.path,
		...scope.env ? { env: scope.env } : {}
	} : toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey
	}));
	const read = (database) => {
		const physical = readAssistantAgentDatabaseIdentity(database);
		if (scope.expectedSource && (database.agentId !== scope.expectedSource.agentId || physical.identity !== scope.expectedSource.databaseIdentity || physical.birthtime !== scope.expectedSource.databaseBirthtime || !isAssistantAgentDatabasePathCurrent(database))) throw new Error("Captured session database changed before read");
		const entries = sessionKeys.flatMap((key) => {
			const entry = readExactSessionEntryRowValidated(database, key, scope.projection)?.entry;
			return entry ? [{
				sessionKey: key,
				entry
			}] : [];
		});
		scope.onReadSource?.({
			agentId: database.agentId,
			path: database.path
		}, {
			identity: physical.identity,
			birthtime: physical.birthtime
		});
		return entries;
	};
	if (!scope.readOnly) return read(openAssistantAgentDatabase(options));
	const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => read(database)), options);
	return result.found ? result.value : [];
}
const SESSION_ID_TRIM_CHARACTERS = "	\n\v\f\r \xA0            \u2028\u2029  　﻿";
/** Loads a visible current ID, falling back to legacy trimmed IDs only on an exact miss. */
function loadSessionEntryByIdReadOnly(scope) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const query = getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").orderBy("session_key");
		for (const trimLegacyId of [false, true]) {
			const matches = iterateSqliteQuerySync(database.db, trimLegacyId ? query.where((eb) => eb(eb.fn("trim", ["current_session_id", eb.val(SESSION_ID_TRIM_CHARACTERS)]), "=", scope.sessionId)) : query.where("current_session_id", "=", scope.sessionId));
			for (const { session_key: sessionKey } of matches) {
				if (isInternalSessionEffectsKey(sessionKey)) continue;
				const selected = readExactSessionEntryRowValidated(database, sessionKey, scope.projection);
				if (selected) return {
					sessionKey,
					entry: selected.entry
				};
			}
		}
	}), toDatabaseOptions(resolved));
	return result.found ? result.value : void 0;
}
/** Exact persisted-key probe on the read-only handle, for per-row hot paths. */
function loadExactSessionEntryReadOnly(scope) {
	return loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: [scope.sessionKey],
		readOnly: true
	})[0];
}
/** Probe the selected store without rerouting an incognito-shaped key to ephemeral state. */
function loadExactSessionEntryFromStoreReadOnly(scope) {
	const options = toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}));
	return loadExactSessionEntryCandidates({
		readSource: {
			...options,
			path: resolveAssistantAgentSqlitePath(options)
		},
		projection: scope.projection,
		readOnly: true,
		sessionKeys: [scope.sessionKey]
	})[0];
}
function groupExactSessionEntryReadRequests(scopes) {
	const results = [];
	const targetCache = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const sessionKeys = scope.sessionKeys.map((key) => key.trim()).filter(Boolean);
		const [sessionKey] = sessionKeys;
		if (!sessionKey) {
			results[index] = ok([]);
			continue;
		}
		try {
			const options = toDatabaseOptions(resolveSqliteScope({
				...scope,
				sessionKey
			}, targetCache));
			const groupKey = [
				options.agentId,
				resolveAssistantAgentSqlitePath(options),
				scope.projection ?? "full"
			].join("\0");
			const group = groups.get(groupKey) ?? {
				options,
				projection: scope.projection,
				requests: []
			};
			group.requests.push({
				index,
				sessionKeys
			});
			groups.set(groupKey, group);
		} catch (error) {
			results[index] = err(error);
		}
	}
	return {
		groups,
		results
	};
}
function loadExactSessionEntryCandidatesReadOnlyBatch(scopes) {
	const { groups, results } = groupExactSessionEntryReadRequests(scopes);
	for (const group of groups.values()) try {
		const read = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
			assertCanonicalSqliteSessionKeysCurrent(database);
			const source = {
				agentId: database.agentId,
				path: database.path
			};
			const grouped = readExactSessionEntryCandidatesInDatabase(database, group.requests.map((request) => request.sessionKeys), group.projection);
			for (const [ordinal, request] of group.requests.entries()) {
				const result = grouped[ordinal];
				results[request.index] = result;
				if (result.ok) scopes[request.index].onReadSource?.(source);
			}
		}), group.options);
		if (!read.found) {
			if (read.reason !== "database-missing") throw new SessionMetadataUnavailableError(read.reason);
			for (const { index } of group.requests) results[index] = ok([]);
		}
	} catch (error) {
		for (const { index } of group.requests) results[index] = err(error);
	}
	return scopes.map((_, index) => expectDefined(results[index], "exact session batch read result"));
}
//#endregion
export { loadExactSessionEntryReadOnly as a, loadExactSessionEntryFromStoreReadOnly as i, loadExactSessionEntryCandidates as n, loadSessionEntryByIdReadOnly as o, loadExactSessionEntryCandidatesReadOnlyBatch as r, resolveSessionEntry as s, loadExactSessionEntry as t };
