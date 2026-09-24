import { n as ok, t as err } from "./result-BQGgYouL.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { n as readSqliteDataVersion } from "./node-sqlite-9ThoWRzf.js";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-Cresg45I.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { $ as findAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { t as sessionChanges } from "./session-row-changes-DN0Dk-5R.js";
import { S as readAssistantAgentDatabase, _ as invalidateAssistantAgentReadOnlyProjections } from "./testclaw-agent-db-Ckg86YCZ.js";
import { d as invalidateAssistantAgentWritableProjections } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { S as hasSqliteSessionOwnerColumns, _ as parseSessionEntryJson, p as canonicalSessionKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent, w as readSqliteSessionOwner, y as selectSessionEntryRows } from "./session-canonical-key-Bxbtl4CI.js";
import { t as SessionParticipantIdentitySchema } from "./session-participant-HHyv8kPN.js";
import { o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-BKQU6sPT.js";
import { toUSVString } from "node:util";
import { Compile } from "typebox/schema";
//#region src/config/sessions/session-participant-identity.ts
let identityValidator;
function participantIdentityNamespace(identity) {
	if (identity.type === "profile" || identity.type === "agent") return JSON.stringify({ type: identity.type });
	if (identity.type === "remote") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		domain: identity.domain,
		idKind: identity.idKind
	});
	if (identity.type === "observation") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		accountId: identity.accountId,
		senderKind: identity.senderKind
	});
	return JSON.stringify({
		type: identity.type,
		actorType: identity.actorType,
		source: identity.source
	});
}
function readParticipantIdentity(namespace, id) {
	const parsed = JSON.parse(namespace);
	if (isRecord(parsed)) {
		const identity = {
			...parsed,
			id
		};
		if ((identityValidator ??= Compile(SessionParticipantIdentitySchema)).Check(identity)) return identity;
	}
	throw new Error("Session participant identity is invalid; run testclaw doctor --fix.");
}
/** Inputs/aliases sum; retried cross-store copies retain the largest recorded aggregate. */
function mergeParticipantAggregate(current, incoming, mode) {
	if (!current) return incoming;
	return {
		contribution_count: mode === "sum" ? current.contribution_count + incoming.contribution_count : Math.max(current.contribution_count, incoming.contribution_count),
		first_prompted_at: current.first_prompted_at === null || incoming.first_prompted_at === null ? null : Math.min(current.first_prompted_at, incoming.first_prompted_at),
		last_prompted_at: current.last_prompted_at === null ? incoming.last_prompted_at : incoming.last_prompted_at === null ? current.last_prompted_at : Math.max(current.last_prompted_at, incoming.last_prompted_at)
	};
}
//#endregion
//#region src/config/sessions/session-participant-prepared-read.ts
let preparedRead;
/** Only synchronous materialization borrows facts; transaction authority always reads its owner. */
function withPreparedSessionParticipants(read, consume) {
	const previous = preparedRead;
	preparedRead = read;
	try {
		const value = consume();
		if (isPromiseLike(value)) {
			Promise.resolve(value).catch(() => {});
			throw new Error("Prepared participant consumers must remain synchronous");
		}
		return value;
	} finally {
		preparedRead = previous;
	}
}
function readPreparedSessionParticipants(database, sessionKey) {
	if (!preparedRead || database.isTransaction) return;
	const identity = findAssistantAgentDatabaseIdentity({ db: database })?.identity;
	if (identity === void 0) return;
	const projection = preparedRead(identity, sessionKey);
	return projection && {
		...projection.participants ? { participants: projection.participants.map(({ identity: participantIdentity }) => ({ identity: { ...participantIdentity } })) } : {},
		...projection.participantCount === void 0 ? {} : { participantCount: projection.participantCount }
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-projection.ts
function selectParticipantRows(database) {
	return getNodeSqliteKysely(database).selectFrom("session_participants").selectAll().orderBy("session_key").orderBy("first_prompted_at").orderBy("actor_id").orderBy("identity_namespace");
}
function prepareSingleSessionParticipantQuery(database) {
	return prepareSqliteQuerySync(database, (parameter) => selectParticipantRows(database).where("session_key", "=", parameter((sessionKey) => sessionKey)));
}
const singleSessionParticipantQueries = /* @__PURE__ */ new WeakMap();
function readParticipantRows(database, sessionKeys) {
	const sessionKey = sessionKeys?.length === 1 ? sessionKeys[0] : void 0;
	if (sessionKey !== void 0) {
		let query = singleSessionParticipantQueries.get(database);
		if (!query) {
			query = prepareSingleSessionParticipantQuery(database);
			singleSessionParticipantQueries.set(database, query);
		}
		return query(sessionKey).rows;
	}
	let query = selectParticipantRows(database);
	if (sessionKeys) query = query.where("session_key", "in", sqliteStringSet(sessionKeys));
	return executeSqliteQuerySync(database, query).rows;
}
function readParticipantRecord(row) {
	return {
		identity: readParticipantIdentity(row.identity_namespace, row.actor_id),
		contributionCount: row.contribution_count,
		firstPromptedAt: row.first_prompted_at,
		lastPromptedAt: row.last_prompted_at
	};
}
function participantRecordsBySessionKey(database, sessionKeys) {
	const records = /* @__PURE__ */ new Map();
	if (!tableExists(database, "session_participants")) return records;
	for (const row of readParticipantRows(database, sessionKeys)) {
		const participants = records.get(row.session_key) ?? [];
		participants.push(readParticipantRecord(row));
		records.set(row.session_key, participants);
	}
	return records;
}
function participantProjection(records) {
	if (records.length === 0) return {};
	return {
		participants: records.map(({ identity }) => ({ identity })),
		participantCount: records.length
	};
}
function withProjectedParticipants(entry, records) {
	return records.length ? {
		...entry,
		...participantProjection(records)
	} : entry;
}
function readSqliteSessionParticipantProjection(database, sessionKey) {
	return readPreparedSessionParticipants(database, sessionKey) ?? participantProjection(participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
function projectSqliteSessionParticipants(database, sessionKey, entry) {
	const prepared = readPreparedSessionParticipants(database, sessionKey);
	if (prepared) return prepared.participants ? {
		...entry,
		...prepared
	} : entry;
	return withProjectedParticipants(entry, participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
/** Acquire one fresh cohort lazily, then decode only the requested session's participants. */
function prepareSqliteSessionParticipantProjection(database, sessionKeys) {
	let rowsByKey;
	let acquisitionFailed = false;
	return (sessionKey, entry) => {
		const prepared = readPreparedSessionParticipants(database, sessionKey);
		if (prepared) return prepared.participants ? {
			...entry,
			...prepared
		} : entry;
		if (!rowsByKey && !acquisitionFailed) try {
			const rows = tableExists(database, "session_participants") ? readParticipantRows(database, sessionKeys) : [];
			rowsByKey = /* @__PURE__ */ new Map();
			for (const row of rows) {
				const participants = rowsByKey.get(row.session_key) ?? [];
				participants.push(row);
				rowsByKey.set(row.session_key, participants);
			}
		} catch {
			acquisitionFailed = true;
		}
		if (acquisitionFailed) return projectSqliteSessionParticipants(database, sessionKey, entry);
		return withProjectedParticipants(entry, (rowsByKey?.get(sessionKey) ?? []).map(readParticipantRecord));
	};
}
function projectSqliteSessionParticipantsBatch(database, entries) {
	const prepared = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of entries) {
		const projection = readPreparedSessionParticipants(database, sessionKey);
		if (!projection) break;
		prepared.set(sessionKey, projection.participants ? {
			...entry,
			...projection
		} : entry);
	}
	if (prepared.size === entries.size) return prepared;
	const records = participantRecordsBySessionKey(database, [...entries.keys()]);
	const projected = new Map(entries);
	for (const [sessionKey, participants] of records) {
		const entry = entries.get(sessionKey);
		if (entry) projected.set(sessionKey, withProjectedParticipants(entry, participants));
	}
	return projected;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-projection.ts
function loadSessionEntrySnapshot(database, projection = "list", prepared, fullEntryKeys, retainFullEntry, deferParticipants = false) {
	const metadata = !fullEntryKeys && prepared && prepared.dataVersion === readSqliteDataVersion(database.db) ? prepared : void 0;
	const parsedEntries = metadata?.entries ?? /* @__PURE__ */ new Map();
	const keys = metadata?.keys ?? [];
	if (!metadata) for (const row of iterateSqliteQuerySync(database.db, selectSessionEntryRows(database, projection, fullEntryKeys ? [...fullEntryKeys] : []).select("updated_at").orderBy("session_key"))) {
		keys.push(row.session_key);
		const entry = parseSessionEntryJson(row, fullEntryKeys?.has(row.session_key) ? "full" : projection);
		if (entry) {
			if (retainFullEntry && !retainFullEntry(row.session_key, entry)) {
				delete entry.skillsSnapshot;
				delete entry.systemPromptReport;
			}
			parsedEntries.set(row.session_key, entry);
		}
	}
	return {
		entries: deferParticipants ? parsedEntries : projectSqliteSessionParticipantsBatch(database.db, parsedEntries),
		keys
	};
}
function readSessionEntrySideMetadata(database, sessionKey) {
	const ownerRow = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] : void 0;
	const owner = ownerRow ? readSqliteSessionOwner(ownerRow) : void 0;
	return {
		...owner ? { owner } : {},
		...readSqliteSessionParticipantProjection(database.db, sessionKey)
	};
}
function projectSessionEntryCacheUpdate(sourceEntry, sideMetadata) {
	const { skillsSnapshot: _skills, systemPromptReport: _report, ...metadata } = sourceEntry;
	const parsedEntry = parseSessionEntryJson({ entry_json: JSON.stringify(metadata) });
	return parsedEntry ? {
		...parsedEntry,
		...sideMetadata
	} : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-read.ts
function prepareExactSessionEntryQueries(database) {
	const db = getNodeSqliteKysely(database);
	const metadataQueries = /* @__PURE__ */ new Map();
	return {
		row: prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_nodes").selectAll().where("session_key", "=", parameter((key) => key))),
		json: prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", parameter((key) => key))),
		metadata: (key) => {
			const ownerColumns = hasSqliteSessionOwnerColumns(database);
			let query = metadataQueries.get(ownerColumns);
			if (!query) {
				query = prepareSqliteQueryTakeFirstSync(database, (parameter) => selectSessionEntryRows({ db: database }, "list", [], ownerColumns).select(["current_session_id", "updated_at"]).select((eb) => eb.cast("session_nodes.rowid", "text").as("rowid")).where("session_key", "=", parameter((value) => value)));
				metadataQueries.set(ownerColumns, query);
			}
			return query(key);
		}
	};
}
const exactSessionEntryQueries = /* @__PURE__ */ new WeakMap();
function getExactSessionEntryQueries(database) {
	let queries = exactSessionEntryQueries.get(database);
	if (!queries) {
		queries = prepareExactSessionEntryQueries(database);
		exactSessionEntryQueries.set(database, queries);
	}
	return queries;
}
function parseReadableSessionEntryData(database, row, projection) {
	const parsed = parseSessionEntryJson(row, projection);
	if (parsed) return parsed;
	if (row.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key)) : void 0) return null;
	throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
}
function validateDeliveryCanonicalSessionEntry(sessionKey, entry) {
	if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${sessionKey}`);
	return entry;
}
/** Decodes a fresh owned entry, including its nested JSON, owner and participant values. */
function parseReadableSqliteSessionEntryRow(database, row, projection = "full") {
	const parsed = parseReadableSessionEntryData(database, row, projection);
	return parsed ? validateDeliveryCanonicalSessionEntry(row.session_key, projectSqliteSessionParticipants(database.db, row.session_key, parsed)) : null;
}
/** Decode supplied rows in caller order while sharing their lazy participant acquisition. */
function prepareSqliteSessionEntryRowDecoder(database, rows, projection = "full") {
	const projectParticipants = prepareSqliteSessionParticipantProjection(database.db, rows.filter((row) => row.entry_json !== "{}").map((row) => row.session_key));
	return (row) => {
		const parsed = parseReadableSessionEntryData(database, row, projection);
		return parsed ? validateDeliveryCanonicalSessionEntry(row.session_key, projectParticipants(row.session_key, parsed)) : null;
	};
}
/** Projects one selected row set without repeating participant reads for each entry. */
function parseReadableSqliteSessionEntryRows(database, rows, projection = "full") {
	const parsedEntries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const entry = parseReadableSessionEntryData(database, row, projection);
		if (entry) parsedEntries.set(row.session_key, entry);
	}
	if (parsedEntries.size === 0) return [];
	return [...projectSqliteSessionParticipantsBatch(database.db, parsedEntries)].map(([sessionKey, entry]) => ({
		sessionKey,
		entry: validateDeliveryCanonicalSessionEntry(sessionKey, entry)
	}));
}
function readSessionEntryRow(database, sessionKey, projection = "full") {
	return scanSessionEntryRows(database, sessionKey, projection)?.selected;
}
/**
* Reads the selected row plus every raw row the lookup scanned. A write transaction that must
* prove this logical row is unchanged can re-read and compare the raw rows instead of decoding
* the entry JSON again.
*/
function readSessionEntryRowScan(database, sessionKey) {
	return scanSessionEntryRows(database, sessionKey, "full");
}
function scanSessionEntryRows(database, sessionKey, projection) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const lookupKeys = collectSessionEntryLookupKeys(database, sessionKey);
	const firstLookupKey = lookupKeys[0];
	if (firstLookupKey === void 0) return;
	let rows;
	if (lookupKeys.length === 1) {
		const queries = getExactSessionEntryQueries(database.db);
		const row = projection === "list" ? queries.metadata(firstLookupKey) : queries.row(firstLookupKey);
		rows = row ? [row] : [];
	} else {
		const query = projection === "list" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll();
		rows = executeSqliteQuerySync(database.db, query.where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
	}
	let selected;
	for (const row of rows) {
		const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
		if (!entry || row.session_key !== sessionKey.trim()) continue;
		selected = {
			entry,
			row
		};
	}
	return {
		lookupKeys,
		rows,
		selected
	};
}
function readExactSessionEntryRow(database, sessionKey, projection = "full") {
	const row = projection === "list" ? getExactSessionEntryQueries(database.db).metadata(sessionKey) : getExactSessionEntryQueries(database.db).row(sessionKey);
	if (!row) return;
	const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
	return entry ? {
		entry,
		row
	} : void 0;
}
/** Capture exact rows once; failed cohort acquisition retains single-key error isolation. */
function prepareExactSessionEntryRowReads(database, sessionKeys, projection = "full") {
	let rows;
	try {
		const query = projection === "list" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll();
		rows = executeSqliteQuerySync(database.db, query.where("session_key", "in", sqliteStringSet(sessionKeys))).rows;
	} catch {
		return (sessionKey) => readExactSessionEntryRow(database, sessionKey, projection);
	}
	const byKey = new Map(rows.map((row) => [row.session_key, row]));
	const decodeRow = prepareSqliteSessionEntryRowDecoder(database, rows, projection);
	return (sessionKey) => {
		const row = byKey.get(toUSVString(sessionKey));
		if (!row) return;
		const entry = decodeRow(row);
		return entry ? {
			entry,
			row
		} : void 0;
	};
}
function readExactSessionEntryJson(database, sessionKey) {
	return getExactSessionEntryQueries(database.db).json(sessionKey)?.entry_json;
}
function readExactSessionEntryRowValidated(database, sessionKey, projection = "full") {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readExactSessionEntryRow(database, sessionKey, projection);
}
/** Select a physical row while refusing any other admitted spelling. */
function readSessionEntryTargetRow(database, target, options = {}) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const queries = getExactSessionEntryQueries(database.db);
	const rows = target.storeKeys.flatMap((key) => {
		const row = options.projection === "list" ? queries.metadata(key.trim()) : queries.row(key.trim());
		if (!row) return [];
		const entry = parseReadableSqliteSessionEntryRow(database, row, options.projection);
		return entry || options.guardRetainedWindows ? [{
			entry,
			row
		}] : [];
	});
	if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
	const selected = rows[0];
	if (selected && selected.row.session_key !== target.canonicalKey && !options.allowCanonicalMove) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
	return selected;
}
/** Only sentinel aliases share a logical identity with a different physical key. */
function readQualifiedSessionEntryRow(database, agentId, sessionKey, options = {}) {
	const parsed = parseAgentSessionKey(sessionKey);
	const sentinel = parsed?.rest ?? sessionKey;
	if (agentId !== database.agentId || parsed && parsed.agentId !== agentId || sentinel !== "global" && sentinel !== "unknown") return readSessionEntryRow(database, sessionKey, options.projection);
	return readSessionEntryTargetRow(database, {
		canonicalKey: sessionKey,
		storeKeys: [sentinel, `agent:${agentId}:${sentinel}`]
	}, {
		...options,
		guardRetainedWindows: true
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-revision.ts
const sessionNodesGenerationTrackerSchemaVersions = /* @__PURE__ */ new WeakMap();
function ensureSessionNodesGenerationTracker(database) {
	const schemaRow = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("pragma_schema_version").select("schema_version"));
	if (typeof schemaRow?.schema_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA schema_version");
	const trackedSchemaVersion = sessionNodesGenerationTrackerSchemaVersions.get(database);
	if (trackedSchemaVersion === schemaRow.schema_version) return;
	const hasParticipants = tableExists(database, "session_participants");
	database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS testclaw_session_nodes_cache_generation (id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1), generation INTEGER NOT NULL) STRICT;
    INSERT OR IGNORE INTO testclaw_session_nodes_cache_generation (id, generation) VALUES (1, 0);
    ${trackedSchemaVersion === void 0 ? "" : "UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1;"}
    DROP TRIGGER IF EXISTS testclaw_session_nodes_cache_generation_insert;
    DROP TRIGGER IF EXISTS testclaw_session_nodes_cache_generation_update;
    DROP TRIGGER IF EXISTS testclaw_session_nodes_cache_generation_delete;
    CREATE TEMP TRIGGER testclaw_session_nodes_cache_generation_insert
      AFTER INSERT ON main.session_nodes BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER testclaw_session_nodes_cache_generation_update
      AFTER UPDATE ON main.session_nodes BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER testclaw_session_nodes_cache_generation_delete
      AFTER DELETE ON main.session_nodes BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    DROP TRIGGER IF EXISTS testclaw_session_participants_cache_generation_insert;
    DROP TRIGGER IF EXISTS testclaw_session_participants_cache_generation_update;
    DROP TRIGGER IF EXISTS testclaw_session_participants_cache_generation_delete;
    ${hasParticipants ? `
    CREATE TEMP TRIGGER testclaw_session_participants_cache_generation_insert
      AFTER INSERT ON main.session_participants BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER testclaw_session_participants_cache_generation_update
      AFTER UPDATE ON main.session_participants BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER testclaw_session_participants_cache_generation_delete
      AFTER DELETE ON main.session_participants BEGIN UPDATE testclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    ` : ""}
  `);
	if (!database.isTransaction) sessionNodesGenerationTrackerSchemaVersions.set(database, schemaRow.schema_version);
	else {
		const version = schemaRow.schema_version;
		stageSqliteTransactionState(database, {
			stage: () => sessionNodesGenerationTrackerSchemaVersions.set(database, version),
			rollback: () => sessionNodesGenerationTrackerSchemaVersions.delete(database),
			commit: () => {}
		});
	}
}
function readSessionNodesGeneration(database) {
	ensureSessionNodesGenerationTracker(database);
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).withSchema("temp").selectFrom("testclaw_session_nodes_cache_generation").select("generation").where("id", "=", 1));
	if (typeof row?.generation !== "number") throw new Error("SQLite session_nodes cache generation is unavailable");
	return row.generation;
}
function readSessionEntryCacheValidityToken(database) {
	return {
		dataVersion: readSqliteDataVersion(database),
		sessionNodesGeneration: readSessionNodesGeneration(database)
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.sessionNodesGeneration === right.sessionNodesGeneration;
}
//#endregion
//#region src/config/sessions/session-sharing-store.kernel.ts
function listSessionMembersInDatabase(database, sessionKey) {
	return executeSqliteQuerySync(database.db, getSessionMemberKysely(database).selectFrom("session_members").select([
		"identity_id",
		"added_by",
		"added_at"
	]).where("session_key", "=", sessionKey).orderBy("identity_id")).rows.map((row) => ({
		identityId: row.identity_id,
		addedBy: row.added_by,
		addedAt: row.added_at
	}));
}
function getSessionMemberKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function hasSessionMemberInDatabase(database, sessionKey, normalizedIdentityId) {
	return Boolean(executeSqliteQueryTakeFirstSync(database.db, getSessionMemberKysely(database).selectFrom("session_members").select("identity_id").where("session_key", "=", sessionKey).where("identity_id", "=", normalizedIdentityId)));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
const preparedSharingReads = resolveGlobalSingleton(Symbol.for("testclaw.preparedSessionSharingReads"), () => /* @__PURE__ */ new Map());
const preparedSharingChanges = resolveGlobalSingleton(Symbol.for("testclaw.preparedSessionSharingChanges"), () => /* @__PURE__ */ new WeakSet());
const pendingSessionEntryPublications = resolveGlobalSingleton(Symbol.for("testclaw.pendingSessionEntryPublications"), () => /* @__PURE__ */ new Map());
function recordCommittedSessionEntryPublication(database, sessionKey, entry) {
	const identity = findAssistantAgentDatabaseIdentity(database)?.identity;
	if (typeof identity !== "string") return;
	for (const pending of pendingSessionEntryPublications.get(`file:${identity}\0${sessionKey}`) ?? []) pending.superseded.set(sessionKey, entry ? {
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision
	} : void 0);
}
/** Private owner metadata follows the original event object without changing its public fields. */
function isPreparedSessionSharingChange(change) {
	return preparedSharingChanges.has(change);
}
function emitPreparedSessionSharingChange(database, sessionKey, agentId = database.agentId, facts) {
	const change = {
		agentId,
		storePath: database.path,
		sessionKey,
		...facts ? { facts } : { factsInvalidated: true }
	};
	preparedSharingChanges.add(change);
	sessionChanges.emit(change, database.db);
}
function projectSessionSharingEntry(entry) {
	return {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		lifecycleRevision: entry.lifecycleRevision,
		visibility: entry.visibility,
		incognito: entry.incognito,
		createdActor: entry.createdActor ? { ...entry.createdActor } : void 0,
		sandbox: entry.sandbox
	};
}
/** The existing entry writer advances retained facts before any commit observer can reenter. */
function retainPreparedSessionSharingFacts(params) {
	const key = `${params.databaseIdentity}\0${params.sessionKey}`;
	const read = { facts: {
		entry: params.entry,
		membership: params.membership
	} };
	const reads = preparedSharingReads.get(key) ?? /* @__PURE__ */ new Set();
	reads.add(read);
	preparedSharingReads.set(key, reads);
	let active = true;
	return {
		readCurrent: () => [...pendingSessionEntryPublications.get(key) ?? []].some((pending) => !pending.settled && (!pending.superseded.has(params.sessionKey) || pending.membershipInvalidated.has(params.sessionKey))) ? void 0 : read.facts,
		release: () => {
			if (!active) return;
			active = false;
			read.facts = void 0;
			reads.delete(read);
			if (reads.size === 0 && preparedSharingReads.get(key) === reads) preparedSharingReads.delete(key);
		}
	};
}
function retainedSharingReads(database, sessionKey) {
	const identity = findAssistantAgentDatabaseIdentity(database)?.identity;
	return typeof identity === "string" ? preparedSharingReads.get(`file:${identity}\0${sessionKey}`) : void 0;
}
const incognitoSharingEntries = resolveGlobalSingleton(Symbol.for("testclaw.incognitoSessionSharingEntries"), () => /* @__PURE__ */ new WeakMap());
function readCommittedIncognitoSessionSharing(database, sessionKey) {
	return incognitoSharingEntries.get(database)?.get(sessionKey);
}
function publishSessionSharingMemberChange(database, sessionKey, member, agentId = database.agentId) {
	publishTrackedCacheUpdate(database, () => {
		const update = (facts) => {
			if (facts.entry?.sessionId !== member.sessionId) return facts;
			const membership = new Set(facts.membership);
			if (member.present) membership.add(member.identityId);
			else membership.delete(member.identityId);
			return {
				...facts,
				membership
			};
		};
		for (const read of retainedSharingReads(database, sessionKey) ?? []) if (read.facts) read.facts = update(read.facts);
		if (!database.db.location()) {
			const current = incognitoSharingEntries.get(database.db)?.get(sessionKey);
			if (current) incognitoSharingEntries.get(database.db)?.set(sessionKey, update(current));
		}
	});
	emitPreparedSessionSharingChange(database, sessionKey, agentId, member);
}
/** Commit-driven projections borrow owner memory; ordinary reads still validate SQLite. */
function readCommittedSessionEntryCache(database) {
	return sessionEntryCaches.get(database)?.entries;
}
/** A settled worker with an unknown write outcome cannot publish a trustworthy field patch. */
function discardCommittedSessionEntryCache(database) {
	sessionEntryCaches.delete(database);
}
/** Reuse only complete, current metadata; exact reads still own misses and invalid rows. */
function readCachedExactSessionEntries(database, sessionKeys) {
	const cached = sessionEntryCaches.get(database.db);
	if (!cached || database.db.isTransaction) return;
	const keys = [...new Set(sessionKeys.map(toUSVString))];
	if (keys.some((key) => !cached.entries.has(key))) return;
	const validityToken = cached.validityToken;
	try {
		if (!cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db))) return;
		const rows = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at"
		]).where("session_key", "in", sqliteStringSet(keys))).rows;
		if (rows.length !== keys.length) return;
		const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
		const entries = /* @__PURE__ */ new Map();
		for (const sessionKey of new Set(sessionKeys)) {
			const key = toUSVString(sessionKey);
			const row = rowsByKey.get(key);
			const entry = cached.entries.get(key);
			if (!row || !entry || entry.sessionId !== row.current_session_id || entry.updatedAt !== row.updated_at) return;
			entries.set(sessionKey, validateDeliveryCanonicalSessionEntry(key, structuredClone(entry)));
		}
		return sessionEntryCaches.get(database.db) === cached && cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db)) ? entries : void 0;
	} catch {
		return;
	}
}
/** Decode one admitted physical store without changing exact per-request error isolation. */
function readExactSessionEntryCandidatesInDatabase(database, requests, projection) {
	const entries = /* @__PURE__ */ new Map();
	const keys = [...new Set(requests.flat())];
	const cachedEntries = projection === "list" ? readCachedExactSessionEntries(database, keys) : void 0;
	let readPrepared;
	if (cachedEntries) readPrepared = (sessionKey) => cachedEntries.get(sessionKey);
	else {
		const readRows = prepareExactSessionEntryRowReads(database, keys, projection);
		readPrepared = (sessionKey) => readRows(sessionKey)?.entry;
	}
	const readEntry = (sessionKey) => {
		const cached = entries.get(sessionKey);
		if (cached) return cached;
		let result;
		try {
			const entry = readAssistantAgentDatabase(database, () => readPrepared(sessionKey)).value;
			result = ok(entry ? {
				sessionKey,
				entry
			} : void 0);
		} catch (error) {
			result = err(error);
		}
		entries.set(sessionKey, result);
		return result;
	};
	return requests.map((sessionKeys) => {
		const matches = [];
		for (const sessionKey of sessionKeys) {
			const entry = readEntry(sessionKey);
			if (!entry.ok) return err(entry.error);
			if (entry.value) matches.push(entry.value);
		}
		return ok(matches);
	});
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const before = sessionEntryCaches.has(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	write();
	if (before === void 0) return;
	return {
		before,
		after: readSessionNodesGeneration(database.db)
	};
}
function readSessionEntryCache(database, options) {
	const projection = options.retainFullEntry ? "full" : options.projection;
	const prepared = assertCanonicalSqliteSessionKeysCurrent(database, projection !== "full" && !options.fullEntryKeys);
	if (!options.cache || options.deferParticipants || options.fullEntryKeys || options.retainFullEntry || options.latest || projection === "full" || database.db.isTransaction) return loadSessionEntrySnapshot(database, projection, prepared, options.fullEntryKeys ? new Set(options.fullEntryKeys) : void 0, options.retainFullEntry, options.deferParticipants);
	const validityToken = readSessionEntryCacheValidityToken(database.db);
	const cached = sessionEntryCaches.get(database.db);
	if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
	const next = {
		...loadSessionEntrySnapshot(database, options.projection, prepared),
		validityToken
	};
	sessionEntryCaches.set(database.db, next);
	return next;
}
function publishTrackedCacheUpdate(database, publish) {
	if (stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	})) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runAssistantAgentWriteTransaction for cache publication");
	publish();
}
function advanceSessionEntryCacheGeneration(cached, writeGeneration) {
	if (cached.validityToken.sessionNodesGeneration === writeGeneration.before) cached.validityToken = {
		...cached.validityToken,
		sessionNodesGeneration: writeGeneration.after
	};
}
function publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) {
	if (!sessionEntryCaches.get(database.db)) return;
	const { sessionKey } = update;
	let sideMetadata;
	let entry;
	try {
		sideMetadata = readSessionEntrySideMetadata(database, sessionKey);
		entry = update.entry ? projectSessionEntryCacheUpdate(update.entry, sideMetadata) : void 0;
	} catch {
		publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		let publishedEntry = entry;
		const currentEntry = cached.entries.get(sessionKey);
		if (!update.entry && currentEntry && sideMetadata) {
			const { owner: _owner, participants: _participants, participantCount: _count, ...metadata } = currentEntry;
			publishedEntry = {
				...metadata,
				...sideMetadata
			};
		}
		if (!publishedEntry) {
			sessionEntryCaches.delete(database.db);
			return;
		}
		if (!cached.entries.has(sessionKey) && !cached.keys.includes(sessionKey)) cached.keys = [...cached.keys, sessionKey].toSorted();
		cached.entries.set(sessionKey, publishedEntry);
		advanceSessionEntryCacheGeneration(cached, writeGeneration);
	});
	return sideMetadata;
}
function publishSessionEntryCacheInvalidation(database, update, writeGeneration) {
	let facts = update.facts;
	const sharingUnchanged = facts?.kind === "unchanged" || facts?.kind === "participants" || facts?.kind === "category";
	const incognito = !database.db.location();
	const sharingEntry = update.entry ? projectSessionSharingEntry(update.entry) : void 0;
	if (!sharingUnchanged) publishTrackedCacheUpdate(database, () => {
		recordCommittedSessionEntryPublication(database, update.sessionKey, sharingEntry);
		for (const read of retainedSharingReads(database, update.sessionKey) ?? []) {
			const previous = read.facts;
			read.facts = sharingEntry && previous?.entry && previous.entry.sessionId === sharingEntry.sessionId && previous.entry.lifecycleRevision === sharingEntry.lifecycleRevision ? {
				entry: sharingEntry,
				membership: previous.membership
			} : void 0;
		}
	});
	if (incognito && !sharingUnchanged) {
		let current;
		try {
			const entry = update.entry ?? readExactSessionEntryRow(database, update.sessionKey, "list")?.entry;
			current = entry ? {
				entry: projectSessionSharingEntry(entry),
				membership: new Set(listSessionMembersInDatabase(database, update.sessionKey).map((member) => member.identityId))
			} : void 0;
		} catch {}
		publishTrackedCacheUpdate(database, () => {
			let entries = incognitoSharingEntries.get(database.db);
			if (!entries && current) {
				entries = /* @__PURE__ */ new Map();
				incognitoSharingEntries.set(database.db, entries);
			}
			if (current) entries?.set(update.sessionKey, current);
			else entries?.delete(update.sessionKey);
		});
	}
	if (writeGeneration) {
		const metadata = publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration);
		if (facts?.kind === "participants" && metadata) facts = {
			kind: "participants",
			projection: {
				participants: metadata.participants,
				participantCount: metadata.participantCount
			}
		};
	} else publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
	emitPreparedSessionSharingChange(database, update.sessionKey, database.agentId, facts);
}
/** The category worker publishes only its changed field; native freshness tokens still expose other commits. */
function publishSessionEntryCacheCategoryUpdate(database, rows, category) {
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		for (const { sessionKey, sessionId } of rows) {
			const current = cached?.entries.get(sessionKey);
			if (!current || current.sessionId !== sessionId) continue;
			const next = { ...current };
			if (category === void 0) delete next.category;
			else next.category = category;
			cached?.entries.set(sessionKey, next);
		}
	});
}
/** Final-grant custody fences old facts until native settlement, independently of result delivery. */
function retainSessionEntryWorkerPublication(params) {
	const owner = {
		superseded: /* @__PURE__ */ new Map(),
		membershipInvalidated: /* @__PURE__ */ new Set(),
		settled: false
	};
	let keys = [];
	const identityKey = `file:${params.databaseIdentity}`;
	let pending = false;
	return {
		begin(sessionKeys, membershipInvalidatedKeys) {
			if (pending) return;
			keys = [...new Set(sessionKeys)];
			owner.membershipInvalidated = new Set(membershipInvalidatedKeys);
			pending = true;
			for (const sessionKey of keys) {
				const key = `${identityKey}\0${sessionKey}`;
				const owners = pendingSessionEntryPublications.get(key) ?? /* @__PURE__ */ new Set();
				owners.add(owner);
				pendingSessionEntryPublications.set(key, owners);
			}
		},
		settle(receipt, unknown) {
			if (!pending) return;
			const current = (sessionKey) => !owner.superseded.has(sessionKey);
			const currentIdentity = (sessionKey) => {
				if (current(sessionKey)) return true;
				const native = owner.superseded.get(sessionKey);
				const committed = receipt?.current.get(sessionKey);
				return native !== void 0 && committed !== void 0 && native.sessionId === committed.sessionId && native.lifecycleRevision === committed.lifecycleRevision;
			};
			const membershipInvalidated = new Set(receipt ? receipt.membershipInvalidatedKeys.filter(currentIdentity) : unknown ? owner.membershipInvalidated : []);
			const changed = [.../* @__PURE__ */ new Set([...(receipt?.changedKeys ?? (unknown ? keys : [])).filter(current), ...membershipInvalidated])];
			if (changed.length) {
				invalidateAssistantAgentWritableProjections(params.databaseIdentity, (database) => sessionEntryCaches.delete(database));
				invalidateAssistantAgentReadOnlyProjections(params.databaseIdentity, (database) => sessionEntryCaches.delete(database));
			}
			const changes = [];
			for (const sessionKey of changed) {
				const sharingEntry = receipt?.current.get(sessionKey);
				for (const read of preparedSharingReads.get(`${identityKey}\0${sessionKey}`) ?? []) {
					const previous = read.facts;
					read.facts = !membershipInvalidated.has(sessionKey) && sharingEntry && previous?.entry && previous.entry.sessionId === sharingEntry.sessionId && previous.entry.lifecycleRevision === sharingEntry.lifecycleRevision ? {
						entry: sharingEntry,
						membership: previous.membership
					} : void 0;
				}
				const change = {
					agentId: params.agentId,
					storePath: params.storePath,
					sessionKey,
					factsInvalidated: true
				};
				if (receipt) preparedSharingChanges.add(change);
				changes.push(change);
			}
			owner.settled = true;
			try {
				sessionChanges.emitBatch(changes);
				return receipt ? {
					previous: new Map([...receipt.previous].filter(([key]) => currentIdentity(key))),
					current: new Map([...receipt.current].filter(([key]) => currentIdentity(key)))
				} : void 0;
			} finally {
				for (const sessionKey of keys) {
					const key = `${identityKey}\0${sessionKey}`;
					const owners = pendingSessionEntryPublications.get(key);
					owners?.delete(owner);
					if (owners?.size === 0) pendingSessionEntryPublications.delete(key);
				}
				pending = false;
			}
		}
	};
}
/** Refresh participant projections without reloading unchanged session-entry JSON. */
function publishSessionEntryCacheParticipantUpdate(database, sessionKey, params) {
	const { writeGeneration, projectionChanged } = params;
	if (!projectionChanged) {
		if (writeGeneration) publishTrackedCacheUpdate(database, () => {
			const cached = sessionEntryCaches.get(database.db);
			if (cached) advanceSessionEntryCacheGeneration(cached, writeGeneration);
		});
		return;
	}
	let facts = { kind: "participants" };
	if (!writeGeneration) try {
		facts = {
			kind: "participants",
			projection: readSqliteSessionParticipantProjection(database.db, sessionKey)
		};
	} catch {}
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts
	}, writeGeneration);
}
//#endregion
export { participantRecordsBySessionKey as A, readExactSessionEntryRow as C, readSessionEntryRowScan as D, readSessionEntryRow as E, participantIdentityNamespace as F, projectSqliteSessionParticipantsBatch as M, withPreparedSessionParticipants as N, readSessionEntryTargetRow as O, mergeParticipantAggregate as P, readExactSessionEntryJson as S, readQualifiedSessionEntryRow as T, listSessionMembersInDatabase as _, publishSessionEntryCacheInvalidation as a, prepareExactSessionEntryRowReads as b, readCommittedIncognitoSessionSharing as c, readSessionEntryCache as d, retainPreparedSessionSharingFacts as f, hasSessionMemberInDatabase as g, getSessionMemberKysely as h, publishSessionEntryCacheCategoryUpdate as i, projectSqliteSessionParticipants as j, validateDeliveryCanonicalSessionEntry as k, readCommittedSessionEntryCache as l, trackSessionEntryCacheWrite as m, isPreparedSessionSharingChange as n, publishSessionEntryCacheParticipantUpdate as o, retainSessionEntryWorkerPublication as p, projectSessionSharingEntry as r, publishSessionSharingMemberChange as s, discardCommittedSessionEntryCache as t, readExactSessionEntryCandidatesInDatabase as u, parseReadableSqliteSessionEntryRow as v, readExactSessionEntryRowValidated as w, prepareSqliteSessionEntryRowDecoder as x, parseReadableSqliteSessionEntryRows as y };
