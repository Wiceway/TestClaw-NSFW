import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import "./session-key-AvQIavYt.js";
import { a as iterateSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { et as isAssistantAgentDatabasePathCurrent, tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { r as SessionMetadataUnavailableError } from "./testclaw-quarantine-error-ChUHz7CU.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { c as readWithCanonicalSessionAdmission, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-Bxbtl4CI.js";
import { E as readSessionEntryRow, T as readQualifiedSessionEntryRow, u as readExactSessionEntryCandidatesInDatabase, w as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import crypto from "node:crypto";
//#region src/config/sessions/internal-session-key.ts
const INTERNAL_SESSION_EFFECTS_SEGMENT = "internal-session-effects";
const INTERNAL_SESSION_EFFECTS_REST_PREFIX = `${INTERNAL_SESSION_EFFECTS_SEGMENT}:`;
function normalizeInternalRunId(runId) {
	return `${runId.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 48) || "run"}-${crypto.createHash("sha256").update(runId).digest("hex").slice(0, 16)}`;
}
/** Resolves the hidden SQLite session identity owned by one internal-effects run. */
function resolveInternalSessionEffectsIdentity(params) {
	const suffix = normalizeInternalRunId(params.runId);
	const keySuffix = params.incognito ? `incognito-${suffix}` : suffix.startsWith("incognito-") ? `legacy-${suffix}` : suffix;
	return {
		sessionId: `${INTERNAL_SESSION_EFFECTS_SEGMENT}-${suffix}`,
		sessionKey: `agent:${normalizeAgentId(params.agentId)}:${INTERNAL_SESSION_EFFECTS_SEGMENT}:${keySuffix}`
	};
}
/** Returns true for SQLite entries that exist only to contain suppressed run effects. */
function isInternalSessionEffectsKey(sessionKey) {
	if (!sessionKey.startsWith("agent:")) return false;
	const agentEnd = sessionKey.indexOf(":", 6);
	return agentEnd >= 0 && sessionKey.startsWith(INTERNAL_SESSION_EFFECTS_REST_PREFIX, agentEnd + 1);
}
//#endregion
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
export { loadExactSessionEntryReadOnly as a, isInternalSessionEffectsKey as c, loadExactSessionEntryFromStoreReadOnly as i, resolveInternalSessionEffectsIdentity as l, loadExactSessionEntryCandidates as n, loadSessionEntryByIdReadOnly as o, loadExactSessionEntryCandidatesReadOnlyBatch as r, resolveSessionEntry as s, loadExactSessionEntry as t };
