import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { i as normalizeMainKey } from "./session-key-B8Cn8Xls.mjs";
import { A as parseAgentSessionKey } from "./session-key-C_bfgyCp.mjs";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as readSqliteDataVersion } from "./node-sqlite-DhoOHVHp.mjs";
import { a as withSqlitePostCommitPublications, i as stageSqliteTransactionState } from "./sqlite-post-commit-CRW06h3K.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-Bar1ps-o.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BboyngJR.mjs";
import { n as findAssistantAgentDatabaseIdentity, r as isAssistantAgentDatabasePathCurrent } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { f as assertCanonicalSessionValidationSchema, i as getAssistantAgentDatabaseValidation, l as markAssistantAgentCanonicalValidation, o as hasAssistantAgentCanonicalValidation, t as adoptAssistantAgentDatabaseValidation } from "./testclaw-agent-db-validation-cache-DBMmC7T_.mjs";
import { i as parseSqliteSessionEntryRecord } from "./conversation-ref-8kIjGCCc.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-FtNy8CfS.mjs";
import { c as hasSqliteSessionOwnerColumns, l as projectSqliteSessionOwner, s as sessionEntryMetadataJson } from "./session-accessor.sqlite-status-DgteG5a_.mjs";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-BwXXB3sd.mjs";
//#region src/config/sessions/session-canonical-row.ts
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run testclaw doctor --fix`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
function canonicalSessionKeyMigrationRequiredError(detail) {
	return new SessionCanonicalKeyMigrationRequiredError(detail);
}
/** One validator serves full Doctor scans, pending rows, and final writer certification. */
function validateCanonicalSessionRow(row) {
	if (row.entry_json === "{}" && row.entry_valid === -1 && row.retained_window_id === row.current_session_id) return;
	const record = row.entry_valid === 1 ? parseSqliteSessionEntryRecord({
		entry_json: row.entry_json,
		current_session_id: row.current_session_id
	}) : null;
	if (!record) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
	const entry = projectCanonicalSessionEntryShape(record);
	if ((row.parent_session_key ?? void 0) !== (entry.parentSessionKey ?? entry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (entry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (entry.forkSource?.sessionKey ?? void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
	const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry);
	if (deliveryCanonicalKey !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
	const trimmed = row.session_key.trim();
	const parsed = parseAgentSessionKey(trimmed);
	if (row.session_key !== trimmed || normalizeStoreSessionKey(trimmed) !== trimmed || !parsed && trimmed !== "global" && trimmed !== "unknown") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${trimmed || row.session_key}`);
	for (const lineageKey of [
		row.parent_session_key,
		row.spawned_by,
		row.fork_source_session_key
	]) {
		if (!lineageKey) continue;
		const normalized = normalizeStoreSessionKey(lineageKey);
		const lineageParsed = parseAgentSessionKey(normalized);
		if (normalized !== lineageKey || !lineageParsed && normalized !== "global" && normalized !== "unknown") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${normalized || lineageKey}`);
	}
	return entry;
}
//#endregion
//#region src/config/sessions/session-canonical-validation-deferral.ts
const deferral = resolveGlobalSingleton(Symbol.for("testclaw.canonicalSessionValidationDeferral"), () => ({}));
var CanonicalSessionValidationDeferred = class extends Error {
	constructor() {
		super("Canonical session validation requires asynchronous readiness");
	}
};
/** Only initial asynchronous admission may defer; committed mutation guards stay synchronous. */
function deferCanonicalSessionValidation(database) {
	const scope = deferral.current;
	if (!scope) return;
	const pathname = database.db.location();
	if (!pathname) return;
	scope.pending ??= {
		agentId: database.agentId,
		path: pathname
	};
	throw new CanonicalSessionValidationDeferred();
}
function withCanonicalSessionValidationDeferral(read) {
	const previous = deferral.current;
	const scope = {};
	let asynchronousResult = false;
	deferral.current = scope;
	try {
		const value = read();
		if (isPromiseLike(value)) {
			asynchronousResult = true;
			Promise.resolve(value).catch(() => {});
			throw new Error("Canonical session validation deferral callbacks must remain synchronous");
		}
		if (scope.pending) return {
			kind: "pending",
			database: scope.pending
		};
		return {
			kind: "complete",
			value
		};
	} catch (error) {
		if (scope.pending && !asynchronousResult) return {
			kind: "pending",
			database: scope.pending
		};
		throw error;
	} finally {
		deferral.current = previous;
	}
}
//#endregion
//#region src/config/sessions/session-canonical-key.ts
const mainKeyReaders = /* @__PURE__ */ new WeakMap();
const readerAdmissions = resolveGlobalSingleton(Symbol.for("testclaw.canonicalSessionReaderAdmissions"), () => /* @__PURE__ */ new WeakMap());
const canonicalReadScope = resolveGlobalSingleton(Symbol.for("testclaw.canonicalSessionReadScope"), () => ({}));
/** Only first admission needs a shared snapshot; warm materialized reads keep their existing cost. */
function readWithCanonicalSessionAdmission(database, read) {
	if (database.db.isTransaction) return read();
	const previous = canonicalReadScope.current;
	const scope = { database: database.db };
	canonicalReadScope.current = scope;
	try {
		return read();
	} catch (error) {
		if (scope.snapshotRequired === void 0 || error !== scope.snapshotRequired) throw error;
	} finally {
		canonicalReadScope.current = previous;
	}
	return withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, read));
}
function rememberReaderAdmission(database, proof) {
	let cell = readerAdmissions.get(database);
	if (!cell) {
		cell = {
			committed: false,
			continuations: /* @__PURE__ */ new Set()
		};
		readerAdmissions.set(database, cell);
		const owned = cell;
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			revokeReaderContinuations(owned);
			readerAdmissions.delete(database);
			unregister();
		});
	}
	const owned = cell;
	const previous = owned.proof;
	const previouslyCommitted = owned.committed;
	if (database.isTransaction) {
		if (!stageSqliteTransactionState(database, {
			stage: () => {
				revokeReaderContinuations(owned);
				owned.proof = proof;
				owned.committed = false;
			},
			rollback: () => {
				if (readerAdmissions.get(database) === owned && owned.proof === proof) {
					revokeReaderContinuations(owned);
					owned.proof = previous;
					owned.committed = previouslyCommitted;
				}
			},
			commit: () => {
				if (readerAdmissions.get(database) === owned && owned.proof === proof) owned.committed = true;
			}
		})) {
			revokeReaderContinuations(owned);
			owned.proof = void 0;
			owned.committed = false;
		}
	} else {
		revokeReaderContinuations(owned);
		owned.proof = proof;
		owned.committed = true;
	}
}
function revokeReaderContinuations(cell) {
	for (const live of cell.continuations) Atomics.store(new Int32Array(live), 0, 0);
	cell.continuations.clear();
}
function isReaderContinuationLive(receipt) {
	return Atomics.load(new Int32Array(receipt.live), 0) === 1 && Atomics.load(new Int32Array(receipt.validation.valid), 0) === 1 && Atomics.load(new Int32Array(receipt.validation.canonicalReady), 0) === 1 === receipt.canonicalReady;
}
function matchesReaderContinuationDatabase(database, receipt) {
	const identity = findAssistantAgentDatabaseIdentity(database);
	return database.db.isOpen && database.agentId === receipt.agentId && identity?.identity === receipt.identity && identity.birthtime === receipt.birthtime && isAssistantAgentDatabasePathCurrent({
		db: database.db,
		path: database.path ?? identity.filename
	}) && receipt.validation.agentId === receipt.agentId && receipt.validation.identity === receipt.identity && isReaderContinuationLive(receipt);
}
/** Borrow only existing committed admission; capture never opens or queries SQLite. */
function captureCanonicalSessionReaderContinuation(database) {
	const cell = readerAdmissions.get(database.db);
	const proof = cell?.proof;
	if (!database.db.isOpen || database.db.isTransaction || !cell?.committed || !proof) return;
	const validation = getAssistantAgentDatabaseValidation(database);
	const identity = findAssistantAgentDatabaseIdentity(database);
	if (!validation || validation !== proof.physicalValidation || typeof identity?.identity !== "string") return;
	const receipt = {
		agentId: database.agentId,
		identity: identity.identity,
		birthtime: identity.birthtime,
		mainKey: proof.mainKey,
		canonicalReady: proof.canonicalReady,
		validation,
		live: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	Atomics.store(new Int32Array(receipt.live), 0, 1);
	const isCurrent = () => database.db.isOpen && !database.db.isTransaction && readerAdmissions.get(database.db) === cell && cell.proof === proof && cell.committed && getAssistantAgentDatabaseValidation(database) === validation && matchesReaderContinuationDatabase(database, receipt);
	if (!isCurrent()) return;
	cell.continuations.add(receipt.live);
	return {
		receipt,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("Canonical session reader continuation is no longer current");
		},
		release: () => {
			Atomics.store(new Int32Array(receipt.live), 0, 0);
			cell.continuations.delete(receipt.live);
		}
	};
}
/** Continue one retained reader without admitting unrelated reads on a pooled handle. */
function readWithCanonicalSessionReaderContinuation(database, receipt, read) {
	const identity = findAssistantAgentDatabaseIdentity(database);
	if (!receipt || database.db.isTransaction || !identity || !matchesReaderContinuationDatabase(database, receipt) || !adoptAssistantAgentDatabaseValidation({
		...database,
		path: database.path ?? identity.filename
	}, receipt.validation)) return readWithCanonicalSessionAdmission(database, read);
	const scope = {
		database: database.db,
		continuation: receipt
	};
	const assertCurrent = () => {
		if (scope.usedContinuation && !matchesReaderContinuationDatabase(database, receipt)) throw new Error("Canonical session reader continuation is no longer current");
	};
	const value = withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		const previous = canonicalReadScope.current;
		canonicalReadScope.current = scope;
		try {
			const result = read();
			assertCurrent();
			return result;
		} finally {
			canonicalReadScope.current = previous;
		}
	}));
	assertCurrent();
	return value;
}
function isCanonicalSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed || sessionKey !== trimmed) return false;
	if (normalizeStoreSessionKey(sessionKey) !== sessionKey) return false;
	const parsed = parseAgentSessionKey(trimmed);
	return trimmed === "global" || trimmed === "unknown" || parsed !== null && trimmed.startsWith(`agent:${parsed.agentId}:`);
}
function assertCanonicalSessionKeyWrite(sessionKey, expectedAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!isCanonicalSessionKey(sessionKey) || expectedAgentId && parsed && parsed.agentId !== normalizeAgentId(expectedAgentId)) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function readCanonicalSessionMainKey(database) {
	let read = mainKeyReaders.get(database.db);
	if (!read) {
		const query = prepareSqliteQueryTakeFirstSync(database.db, () => getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("main_key").where("id", "=", 1));
		read = () => query();
		mainKeyReaders.set(database.db, read);
	}
	return normalizeMainKey(read()?.main_key);
}
function assertCanonicalSessionEntryLineageWrite(entry) {
	const sessionKeys = [
		entry.parentSessionKey,
		entry.spawnedBy,
		entry.forkSource?.sessionKey
	].filter((sessionKey) => sessionKey !== void 0);
	if (sessionKeys.length === 0) return;
	for (const sessionKey of sessionKeys) assertCanonicalSessionKeyWrite(sessionKey);
}
/** Query shape shared by complete inventories and bounded canonical validation. */
function canonicalSessionValidationQuery(database, options = {}) {
	return getNodeSqliteKysely(database.db).selectFrom("session_nodes").leftJoin("session_windows as retained_window", (join) => join.onRef("retained_window.session_id", "=", "session_nodes.current_session_id").onRef("retained_window.session_key", "=", "session_nodes.session_key")).select([
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.entry_valid",
		"session_nodes.fork_source_session_key",
		"session_nodes.parent_session_key",
		"session_nodes.spawned_by",
		"retained_window.session_id as retained_window_id"
	]).select(options.fullEntries ? "session_nodes.entry_json" : sessionEntryMetadataJson).$if(Boolean(options.metadata), (query) => query.select("session_nodes.updated_at")).$if(Boolean(options.metadata) && hasSqliteSessionOwnerColumns(database.db), (query) => query.select([
		"session_nodes.owner_actor_type",
		"session_nodes.owner_actor_id",
		"session_nodes.owner_assigned_by_type",
		"session_nodes.owner_assigned_by_id",
		"session_nodes.owner_assigned_at"
	])).orderBy("session_nodes.session_key");
}
/** Older supported maintenance readers keep their existing full-validation path. */
function hasCanonicalSessionValidationProjection(database) {
	if (readSqliteUserVersion(database.db) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return true;
}
function scanCanonicalSqliteSessionEntries(database, visit, metadata) {
	let count = 0;
	for (const row of iterateSqliteQuerySync(database.db, canonicalSessionValidationQuery(database, {
		fullEntries: Boolean(visit),
		metadata: Boolean(metadata)
	}))) {
		metadata?.keys.push(row.session_key);
		const entry = validateCanonicalSessionRow(row);
		if (!entry) continue;
		if (metadata && entry.updatedAt === row.updated_at) {
			const { skillsSnapshot: _skills, systemPromptReport: _report, ...listEntry } = entry;
			metadata.entries.set(row.session_key, projectSqliteSessionOwner(listEntry, row));
		}
		visit?.({
			entry,
			sessionKey: row.session_key
		});
		count += 1;
	}
	return count;
}
function assertCanonicalSqliteSessionKeysCurrent(database, collectMetadata = false) {
	return validateCanonicalSqliteSessionKeys(database, collectMetadata).metadata;
}
/** Validate the root's database and key together within its synchronous writer transaction. */
function assertCanonicalSqliteSessionRootWrite(database, sessionKey) {
	validateCanonicalSqliteSessionKeys(database);
	assertCanonicalSessionKeyWrite(sessionKey);
}
function validateCanonicalSqliteSessionKeys(database, collectMetadata = false) {
	const incremental = hasCanonicalSessionValidationProjection(database);
	const identity = findAssistantAgentDatabaseIdentity(database);
	const pathname = database.path ?? identity?.filename;
	const physicalValidation = pathname ? getAssistantAgentDatabaseValidation({
		...database,
		path: pathname
	}) : void 0;
	const storedMainKey = readCanonicalSessionMainKey(database);
	const canonicalReady = hasAssistantAgentCanonicalValidation(database);
	const readScope = canonicalReadScope.current;
	const continuation = readScope?.database === database.db ? readScope.continuation : void 0;
	if (readScope && continuation && physicalValidation && continuation.mainKey === storedMainKey && continuation.canonicalReady === canonicalReady && matchesReaderContinuationDatabase(database, continuation)) {
		readScope.usedContinuation = true;
		return {};
	}
	const admitted = readerAdmissions.get(database.db)?.proof;
	if (admitted?.mainKey === storedMainKey && admitted.physicalValidation === physicalValidation && admitted.canonicalReady === canonicalReady) return {};
	if (readScope?.database === database.db && !database.db.isTransaction) {
		readScope.snapshotRequired ??= /* @__PURE__ */ new Error("Canonical session read requires an admission snapshot");
		throw readScope.snapshotRequired;
	}
	const remember = () => rememberReaderAdmission(database.db, {
		mainKey: storedMainKey,
		physicalValidation,
		canonicalReady: hasAssistantAgentCanonicalValidation(database)
	});
	if (incremental) {
		if (!(typeof identity?.identity === "symbol") && !canonicalReady) {
			deferCanonicalSessionValidation(database);
			const metadata = collectMetadata ? {
				dataVersion: readSqliteDataVersion(database.db),
				entries: /* @__PURE__ */ new Map(),
				keys: []
			} : void 0;
			scanCanonicalSqliteSessionEntries(database, void 0, metadata);
			markAssistantAgentCanonicalValidation(database);
			remember();
			return { metadata };
		}
		const pending = getNodeSqliteKysely(database.db).selectFrom("session_canonical_validation_pending").select("session_key");
		if (!executeSqliteQueryTakeFirstSync(database.db, pending.limit(1))) {
			remember();
			return {};
		}
		deferCanonicalSessionValidation(database);
		if (collectMetadata) {
			const metadata = {
				dataVersion: readSqliteDataVersion(database.db),
				entries: /* @__PURE__ */ new Map(),
				keys: []
			};
			scanCanonicalSqliteSessionEntries(database, void 0, metadata);
			remember();
			return { metadata };
		}
		const query = canonicalSessionValidationQuery(database).where("session_nodes.session_key", "in", pending);
		for (const row of iterateSqliteQuerySync(database.db, query)) validateCanonicalSessionRow(row);
		remember();
		return {};
	}
	const metadata = collectMetadata ? {
		dataVersion: readSqliteDataVersion(database.db),
		entries: /* @__PURE__ */ new Map(),
		keys: []
	} : void 0;
	scanCanonicalSqliteSessionEntries(database, void 0, metadata);
	remember();
	return { metadata };
}
function setCanonicalSqliteSessionMainKey(database, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey) return;
	executeSqliteQuerySync(database.db, db.insertInto("session_key_contract").values({
		id: 1,
		main_key: canonicalMainKey,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		main_key: canonicalMainKey,
		updated_at: Date.now()
	})));
	const admission = readerAdmissions.get(database.db);
	if (admission) {
		revokeReaderContinuations(admission);
		admission.proof = void 0;
		admission.committed = false;
	}
}
//#endregion
export { canonicalSessionValidationQuery as a, readCanonicalSessionMainKey as c, scanCanonicalSqliteSessionEntries as d, setCanonicalSqliteSessionMainKey as f, validateCanonicalSessionRow as h, assertCanonicalSqliteSessionRootWrite as i, readWithCanonicalSessionAdmission as l, canonicalSessionKeyMigrationRequiredError as m, assertCanonicalSessionKeyWrite as n, captureCanonicalSessionReaderContinuation as o, withCanonicalSessionValidationDeferral as p, assertCanonicalSqliteSessionKeysCurrent as r, hasCanonicalSessionValidationProjection as s, assertCanonicalSessionEntryLineageWrite as t, readWithCanonicalSessionReaderContinuation as u };
