import { n as ok, t as err } from "./result-BQGgYouL.js";
import { T as resolveExpiresAtMsFromDurationMs } from "./number-coercion-0M4tZV2c.js";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { r as isSqliteCorruptionError } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { G as hasAssistantStateTablesBeyondStartupCheckpoint, H as normalizeSqliteNumber, V as coerceRequiredSqliteNumber } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-BppRXydv.js";
import { o as isTerminalSqliteIntegrityError } from "./error-utils-B4pDpAz2.js";
import { d as isAssistantStateDatabaseOpen, o as closeAssistantStateDatabaseAsync } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { H as resolveDatabasePath, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { n as retainAssistantStateWorkerErrorPayload, t as hydrateAssistantStateWorkerError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import "node:crypto";
import { toUSVString } from "node:util";
//#region src/plugin-state/plugin-state-store.types.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-state-store.kernel.ts
const MAX_PLUGIN_STATE_VALUE_BYTES = 1048576;
const RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX = "@retained.";
function isRetainedPluginStateNamespace(namespace) {
	return namespace.startsWith(RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX);
}
const PLUGIN_STATE_EXPIRY_BATCH_ROWS = 1024;
function createPluginStateError(params) {
	return new PluginStateStoreError(params.message, {
		code: params.code,
		operation: params.operation,
		...params.path ? { path: params.path } : {},
		cause: params.cause
	});
}
function resolvePluginStateExpiresAtMs(params) {
	if (params.ttlMs == null) return null;
	if (params.namespace && isRetainedPluginStateNamespace(params.namespace)) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: params.operation,
		message: "Retained plugin state does not accept a TTL.",
		path: params.path
	});
	const expiresAt = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: params.now });
	if (expiresAt === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: params.operation,
		message: "Plugin state ttlMs cannot produce a valid expiry timestamp.",
		...params.path ? { path: params.path } : {}
	});
	return expiresAt;
}
function parseStoredJson(raw, operation, databasePath) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw createPluginStateError({
			code: "PLUGIN_STATE_CORRUPT",
			operation,
			message: "Plugin state entry contains corrupt JSON.",
			path: databasePath,
			cause: error
		});
	}
}
function rowToEntry(row, operation, databasePath) {
	const expiresAt = normalizeSqliteNumber(row.expires_at);
	return {
		key: row.entry_key,
		value: parseStoredJson(row.value_json, operation, databasePath),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...expiresAt != null ? { expiresAt } : {}
	};
}
function getPluginStateKysely(db) {
	return getNodeSqliteKysely(db);
}
function bindPluginStateEntry(params) {
	return {
		plugin_id: params.pluginId,
		namespace: params.namespace,
		entry_key: params.key,
		value_json: params.valueJson,
		created_at: params.createdAt,
		expires_at: params.expiresAt
	};
}
const pluginStateUpsertQueries = /* @__PURE__ */ new WeakMap();
const pluginStateInsertIfAbsentQueries = /* @__PURE__ */ new WeakMap();
function upsertPluginStateEntry(db, row) {
	let query = pluginStateUpsertQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").values({
			plugin_id: parameter((value) => value.plugin_id),
			namespace: parameter((value) => value.namespace),
			entry_key: parameter((value) => value.entry_key),
			value_json: parameter((value) => value.value_json),
			created_at: parameter((value) => value.created_at),
			expires_at: parameter((value) => value.expires_at)
		}).onConflict((conflict) => conflict.columns([
			"plugin_id",
			"namespace",
			"entry_key"
		]).doUpdateSet({
			value_json: (eb) => eb.ref("excluded.value_json"),
			created_at: (eb) => eb.ref("excluded.created_at"),
			expires_at: (eb) => eb.ref("excluded.expires_at")
		})));
		pluginStateUpsertQueries.set(db, query);
	}
	query(row);
}
function insertPluginStateEntryIfAbsent(db, row) {
	let query = pluginStateInsertIfAbsentQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").orIgnore().values({
			plugin_id: parameter((value) => value.plugin_id),
			namespace: parameter((value) => value.namespace),
			entry_key: parameter((value) => value.entry_key),
			value_json: parameter((value) => value.value_json),
			created_at: parameter((value) => value.created_at),
			expires_at: parameter((value) => value.expires_at)
		}));
		pluginStateInsertIfAbsentQueries.set(db, query);
	}
	const result = query(row);
	return Number(result.numAffectedRows ?? 0) > 0;
}
const pluginStateEntryQueries = /* @__PURE__ */ new WeakMap();
const pluginStateEntryExistsQueries = /* @__PURE__ */ new WeakMap();
function hasPluginStateEntry(db, params) {
	let query = pluginStateEntryExistsQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => {
			const pluginId = parameter((value) => value.pluginId);
			const namespace = parameter((value) => value.namespace);
			const key = parameter((value) => value.key);
			const now = parameter((value) => value.now);
			return getPluginStateKysely(db).selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]));
		});
		pluginStateEntryExistsQueries.set(db, query);
	}
	return query(params).rows.length !== 0;
}
function selectPluginStateEntry(db, params) {
	let query = pluginStateEntryQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => {
			const pluginId = parameter((value) => value.pluginId);
			const namespace = parameter((value) => value.namespace);
			const key = parameter((value) => value.key);
			const now = parameter((value) => value.now);
			return getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
				"entry_key",
				"value_json",
				"created_at",
				"expires_at"
			]).where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]));
		});
		pluginStateEntryQueries.set(db, query);
	}
	return query(params).rows[0];
}
function iteratePluginStateEntries(db, params) {
	return iterateSqliteQuerySync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
		"entry_key",
		"value_json",
		"created_at",
		"expires_at"
	]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc"));
}
function selectPluginStateEntriesInKeyRange(db, params) {
	return executeSqliteQuerySync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
		"entry_key",
		"value_json",
		"created_at",
		"expires_at"
	]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", ">=", params.keyStartInclusive).where("entry_key", "<", params.keyEndExclusive).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("entry_key", params.order).limit(params.limit)).rows;
}
function deletePluginStateEntry(db, params) {
	const result = executeSqliteQuerySync(db, getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return Number(result.numAffectedRows ?? 0);
}
const pluginStateExpiryQueries = /* @__PURE__ */ new WeakMap();
function deleteExpiredPluginStateEntries(db, now, scope) {
	if (scope && isRetainedPluginStateNamespace(scope.namespace)) return 0;
	const kysely = getPluginStateKysely(db);
	if (scope) {
		let query = pluginStateExpiryQueries.get(db);
		if (!query) {
			query = prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("plugin_state_entries").select("expires_at").where("expires_at", "is not", null).where("expires_at", "<=", parameter((value) => value)).limit(1));
			pluginStateExpiryQueries.set(db, query);
		}
		if (query(now).rows.length === 0) return 0;
	}
	let expiredEntries = kysely.selectFrom("plugin_state_entries").select([
		"plugin_id",
		"namespace",
		"entry_key"
	]).where("expires_at", "is not", null).where("expires_at", "<=", now);
	expiredEntries = scope ? expiredEntries.where("plugin_id", "=", scope.pluginId).where("namespace", "=", scope.namespace) : expiredEntries.orderBy("expires_at", "asc");
	const result = executeSqliteQuerySync(db, kysely.deleteFrom("plugin_state_entries").where((expression) => expression(expression.refTuple("plugin_id", "namespace", "entry_key"), "in", expiredEntries.limit(PLUGIN_STATE_EXPIRY_BATCH_ROWS).$asTuple("plugin_id", "namespace", "entry_key"))));
	return Number(result.numAffectedRows ?? 0);
}
const pluginStateNamespaceCountQueries = /* @__PURE__ */ new WeakMap();
function countLivePluginStateNamespaceEntries(db, params) {
	let query = pluginStateNamespaceCountQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where("namespace", "=", parameter((value) => value.namespace)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))])));
		pluginStateNamespaceCountQueries.set(db, query);
	}
	const row = query(params).rows[0];
	return coerceRequiredSqliteNumber(row?.count ?? 0);
}
function lookupPluginStateEntry(store, params) {
	const row = selectPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now: Date.now()
	});
	return row ? parseStoredJson(row.value_json, "lookup", store.path) : void 0;
}
//#endregion
//#region src/plugin-state/plugin-state-store.retention.ts
const pluginStateCountQueries = /* @__PURE__ */ new WeakMap();
function countLivePluginStateEntries(db, params) {
	let query = pluginStateCountQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))])));
		pluginStateCountQueries.set(db, query);
	}
	const row = query(params).rows[0];
	return coerceRequiredSqliteNumber(row?.count ?? 0);
}
function deleteOldestPluginStateNamespaceEntries(db, params) {
	const kysely = getPluginStateKysely(db);
	const keys = kysely.selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "!=", params.protectedKey).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc").limit(params.limit);
	const result = executeSqliteQuerySync(db, kysely.deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys));
	return Number(result.numAffectedRows ?? 0);
}
function readPluginStateRetention(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => [eb.fn.countAll().as("namespace_count"), eb.fn.min("expires_at").as("next_expiry")]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])));
	return {
		namespaceCount: coerceRequiredSqliteNumber(row?.namespace_count ?? 0),
		nextExpiry: normalizeSqliteNumber(row?.next_expiry ?? null) ?? Infinity,
		now: params.now,
		sweepPending: true
	};
}
function enforcePostRegisterLimits(params) {
	if (isRetainedPluginStateNamespace(params.namespace)) return;
	if (params.maxEntries === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Bounded plugin state requires maxEntries."
	});
	if (params.overflowPolicy === "reject-new") return;
	const namespaceCount = params.retention?.namespaceCount ?? countLivePluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: params.now
	});
	if (namespaceCount <= params.maxEntries) return;
	const deleted = deleteOldestPluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		protectedKey: params.protectedKey,
		now: params.now,
		limit: namespaceCount - params.maxEntries
	});
	if (params.retention) params.retention.namespaceCount -= deleted;
}
function assertCanInsertPluginStateEntry(params) {
	if (isRetainedPluginStateNamespace(params.namespace)) return;
	if (params.maxEntries === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Bounded plugin state requires maxEntries."
	});
	if (params.overflowPolicy !== "reject-new") return;
	if ((params.retention?.namespaceCount ?? countLivePluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: params.now
	})) >= params.maxEntries) throw createPluginStateError({
		code: "PLUGIN_STATE_LIMIT_EXCEEDED",
		operation: "register",
		message: `Plugin state namespace ${params.namespace} for ${params.pluginId} reached its ${params.maxEntries}-row limit.`,
		path: params.store.path
	});
}
/** The caller owns the write transaction, including expiry cleanup and quota eviction. */
function registerPluginStateEntry(store, params, retention) {
	const now = Date.now();
	const expiresAt = resolvePluginStateExpiresAtMs({
		ttlMs: params.ttlMs,
		namespace: params.namespace,
		now,
		operation: "register",
		path: store.path
	});
	if (retention && (now < retention.now || now >= retention.nextExpiry)) Object.assign(retention, readPluginStateRetention(store.db, {
		...params,
		now
	}));
	if (!retention || retention.sweepPending) {
		const deleted = deleteExpiredPluginStateEntries(store.db, now, params);
		if (retention) retention.sweepPending = deleted === PLUGIN_STATE_EXPIRY_BATCH_ROWS;
	}
	const existing = retention || params.overflowPolicy === "reject-new" ? hasPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now
	}) : false;
	if (!existing) assertCanInsertPluginStateEntry({
		store,
		pluginId: params.pluginId,
		namespace: params.namespace,
		maxEntries: params.maxEntries,
		overflowPolicy: params.overflowPolicy,
		now,
		retention
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		valueJson: params.valueJson,
		createdAt: params.createdAtMs ?? now,
		expiresAt
	}));
	if (retention) {
		if (!existing) retention.namespaceCount += 1;
		retention.nextExpiry = Math.min(retention.nextExpiry, expiresAt ?? Infinity);
		retention.now = now;
	}
	enforcePostRegisterLimits({
		store,
		pluginId: params.pluginId,
		namespace: params.namespace,
		maxEntries: params.maxEntries,
		overflowPolicy: params.overflowPolicy,
		now,
		protectedKey: params.key,
		retention
	});
}
//#endregion
//#region src/plugin-state/plugin-state-store.comparison.ts
const COMPARISON_PATTERN = /^1:([a-f0-9]{64}):([a-f0-9]{64}|-)$/u;
function validatePluginStateComparison(value, operation) {
	const scope = (typeof value === "string" ? COMPARISON_PATTERN.exec(value) : null)?.[1];
	if (!scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		message: "Plugin state comparison must be an observation returned by this store."
	});
	return scope;
}
//#endregion
//#region src/plugin-state/plugin-store-validation.ts
const MAX_PLUGIN_STORE_NAMESPACE_BYTES = 128;
const MAX_PLUGIN_STORE_KEY_BYTES = 512;
const MAX_PLUGIN_STORE_JSON_BYTES = 65536;
const MAX_PLUGIN_STORE_JSON_DEPTH = 64;
const NAMESPACE_PATTERN = /^[a-z0-9][a-z0-9._-]*$/iu;
const textEncoder = new TextEncoder();
function createPluginStoreOptionPolicy(params) {
	const signatures = /* @__PURE__ */ new Map();
	return {
		resolveOverflowPolicy(value) {
			if (value === void 0 || value === "evict-oldest") return "evict-oldest";
			if (value === "reject-new") return value;
			throw params.invalid(`${params.label} overflowPolicy must be evict-oldest or reject-new`);
		},
		assertConsistent(pluginId, namespace, signature) {
			const key = `${pluginId}\0${namespace}`;
			const existing = signatures.get(key);
			if (!existing) {
				signatures.set(key, signature);
				return;
			}
			if (!(Object.entries(existing).every(([name, value]) => signature[name] === value) && Object.entries(signature).every(([name, value]) => existing[name] === value))) throw params.invalid(`${params.label} namespace ${namespace} for ${pluginId} was reopened with incompatible options`);
		},
		clear() {
			signatures.clear();
		}
	};
}
function assertMaxUtf8Bytes(params) {
	if (textEncoder.encode(params.value).byteLength > params.maxBytes) throw params.errors.invalid(`${params.label} must be <= ${params.maxBytes} bytes`);
}
function validatePluginStoreNamespace(params) {
	const trimmed = params.value.trim();
	if (!NAMESPACE_PATTERN.test(trimmed)) throw params.errors.invalid(`${params.label} namespace must be a safe path segment: ${params.value}`);
	assertMaxUtf8Bytes({
		label: `${params.label} namespace`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_NAMESPACE_BYTES,
		errors: params.errors
	});
	return trimmed;
}
function validatePluginStoreKey(params) {
	const trimmed = params.value.trim();
	if (!trimmed) throw params.errors.invalid(`${params.label} entry key must not be empty`);
	assertMaxUtf8Bytes({
		label: `${params.label} entry key`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_KEY_BYTES,
		errors: params.errors
	});
	return trimmed;
}
function validatePluginStorePositiveInteger(params) {
	if (!Number.isSafeInteger(params.value) || params.value < 1) throw params.errors.invalid(`${params.label} must be a positive safe integer`);
	return params.value;
}
function validateOptionalPluginStoreTtlMs(params) {
	const value = params.value;
	if (value == null) return;
	return validatePluginStorePositiveInteger({
		...params,
		value
	});
}
function assertPlainJsonValue(value, params) {
	if (params.depth > MAX_PLUGIN_STORE_JSON_DEPTH) throw params.errors.limit(`${params.label} nesting exceeds maximum depth of ${MAX_PLUGIN_STORE_JSON_DEPTH}`);
	if (value === null) return;
	const valueType = typeof value;
	if (valueType === "string" || valueType === "boolean") return;
	if (valueType === "number") {
		if (!Number.isFinite(value)) throw params.errors.invalid(`${params.label} at ${params.path} must be a finite number`);
		return;
	}
	if (valueType !== "object") throw params.errors.invalid(`${params.label} at ${params.path} must be JSON-serializable`);
	const objectValue = value;
	if (params.seen.has(objectValue)) throw params.errors.invalid(`${params.label} at ${params.path} must not contain circular references`);
	params.seen.add(objectValue);
	try {
		if (Array.isArray(value)) {
			for (let index = 0; index < value.length; index += 1) {
				if (!(index in value)) throw params.errors.invalid(`${params.label} array at ${params.path} must not be sparse`);
				assertPlainJsonValue(value[index], {
					...params,
					path: `${params.path}[${index}]`,
					depth: params.depth + 1
				});
			}
			return;
		}
		const prototype = Object.getPrototypeOf(objectValue);
		const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
		if (!prototype || Object.getPrototypeOf(prototype) !== null || typeof constructor !== "function" || Object.getOwnPropertyDescriptor(constructor, "prototype")?.value !== prototype || Function.prototype.toString.call(constructor) !== Function.prototype.toString.call(Object)) throw params.errors.invalid(`${params.label} object at ${params.path} must be a plain object`);
		const descriptorEntries = Object.entries(Object.getOwnPropertyDescriptors(objectValue));
		if (Object.getOwnPropertySymbols(objectValue).length > 0) throw params.errors.invalid(`${params.label} object at ${params.path} must not use symbol keys`);
		if (descriptorEntries.length !== Object.keys(objectValue).length) throw params.errors.invalid(`${params.label} object at ${params.path} must not use non-enumerable properties`);
		for (const [key, descriptor] of descriptorEntries) {
			if (descriptor.get || descriptor.set || !("value" in descriptor)) throw params.errors.invalid(`${params.label} object at ${params.path}.${key} must use data properties`);
			assertPlainJsonValue(descriptor.value, {
				...params,
				path: `${params.path}.${key}`,
				depth: params.depth + 1
			});
		}
	} finally {
		params.seen.delete(objectValue);
	}
}
function serializePluginStoreJson(params) {
	assertPlainJsonValue(params.value, {
		label: params.label,
		errors: params.errors,
		seen: /* @__PURE__ */ new WeakSet(),
		path: "value",
		depth: 0
	});
	const json = JSON.stringify(params.value);
	if (json === void 0) throw params.errors.invalid(`${params.label} must be JSON-serializable`);
	const maxBytes = params.maxBytes ?? MAX_PLUGIN_STORE_JSON_BYTES;
	if (textEncoder.encode(json).byteLength > maxBytes) throw params.errors.limit(`${params.label} exceeds ${maxBytes} byte limit`);
	return json;
}
//#endregion
//#region src/plugin-state/plugin-state-store.reads.ts
function lookupPluginStateEntries(store, params) {
	const now = Date.now();
	const rows = executeSqliteQuerySync(store.db, getPluginStateKysely(store.db).selectFrom("plugin_state_entries").select(["entry_key", "value_json"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", sqliteStringSet(params.keys)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]))).rows;
	const values = new Map(rows.map((row) => [row.entry_key, row.value_json]));
	return params.keys.map((key) => {
		const raw = values.get(toUSVString(key));
		try {
			return ok(raw === void 0 ? void 0 : parseStoredJson(raw, "lookup", store.path));
		} catch (error) {
			if (error instanceof PluginStateStoreError && error.code === "PLUGIN_STATE_CORRUPT") return err(error);
			throw error;
		}
	});
}
function listPluginStateEntries(store, params) {
	const rows = iteratePluginStateEntries(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: Date.now()
	});
	const entries = [];
	let decodeFailure;
	for (const row of rows) {
		if (decodeFailure) continue;
		try {
			entries.push(rowToEntry(row, "entries", store.path));
		} catch (error) {
			decodeFailure = { error };
		}
	}
	if (decodeFailure) throw decodeFailure.error;
	return entries;
}
function validatePluginStateKeyRange(params) {
	if (!Number.isSafeInteger(params.limit) || params.limit < 1) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range limit must be a positive safe integer."
	});
	if (typeof params.keyStartInclusive !== "string" || typeof params.keyEndExclusive !== "string" || Buffer.compare(Buffer.from(params.keyStartInclusive), Buffer.from(params.keyEndExclusive)) >= 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key range must have an increasing exclusive upper bound."
	});
	if (params.order !== void 0 && params.order !== "asc" && params.order !== "desc") throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range order must be asc or desc."
	});
}
//#endregion
//#region src/plugin-state/plugin-state-store.database.ts
function wrapPluginStateError(error, operation, fallbackCode, message, pathname = resolveAssistantStateSqlitePath(process.env)) {
	if (error instanceof PluginStateStoreError) return error;
	let publicMessage = message;
	if (fallbackCode === "PLUGIN_STATE_OPEN_FAILED") {
		if (isSqliteSchemaVersionError(error)) publicMessage += "\nThe state database uses a newer schema. Run an Assistant build that supports it.";
		else if (error instanceof Error && isTerminalSqliteIntegrityError(error)) publicMessage += "\nDatabase integrity verification failed. Restore or repair the state database, then run testclaw doctor --fix.";
	}
	return createPluginStateError({
		code: fallbackCode,
		operation,
		message: publicMessage,
		path: pathname,
		cause: error
	});
}
function openPluginStateDatabase(operation = "open", options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveAssistantStateSqlitePath(env);
	try {
		return openAssistantStateDatabase(options);
	} catch (error) {
		throw wrapPluginStateError(error, operation, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
	}
}
function isMissingPluginStateTableError(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: plugin_state_entries";
}
/** Read plugin state without joining the shared writable database lifecycle. */
function withPluginStateDatabaseReadOnly(operationName, operation, options = {}) {
	const pathname = resolveDatabasePath(options);
	let operationStarted = false;
	try {
		return withExistingAssistantStateDatabaseReadOnly(({ db, path }) => {
			operationStarted = true;
			try {
				return operation({
					db,
					path
				});
			} catch (error) {
				if (isMissingPluginStateTableError(error)) {
					if (!hasAssistantStateTablesBeyondStartupCheckpoint(db)) return;
				}
				throw error;
			}
		}, options);
	} catch (error) {
		if (!operationStarted) throw wrapPluginStateError(error, operationName, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
		throw error;
	}
}
function runWriteTransaction(operation, write, options = {}) {
	if (!isAssistantStateDatabaseOpen(resolveAssistantStateSqlitePath(options.env ?? process.env))) openPluginStateDatabase(operation, options);
	return runAssistantStateWriteTransaction(write, options);
}
//#endregion
//#region src/plugin-state/plugin-state-store.mutations.ts
function clearPluginStateNamespace(db, params) {
	executeSqliteQuerySync(db, getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
}
/** The caller owns the transaction containing admission, expiry cleanup, and insertion. */
function registerPluginStateEntryIfAbsent(store, params) {
	const now = Date.now();
	const expiresAt = resolvePluginStateExpiresAtMs({
		ttlMs: params.ttlMs,
		namespace: params.namespace,
		now,
		operation: "register",
		path: store.path
	});
	deleteExpiredPluginStateEntries(store.db, now, params);
	if (hasPluginStateEntry(store.db, {
		...params,
		now
	})) return false;
	deletePluginStateEntry(store.db, params);
	assertCanInsertPluginStateEntry({
		store,
		...params,
		now
	});
	if (!insertPluginStateEntryIfAbsent(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		valueJson: params.valueJson,
		createdAt: now,
		expiresAt
	}))) return false;
	enforcePostRegisterLimits({
		store,
		...params,
		now,
		protectedKey: params.key
	});
	return true;
}
/** Decode inside the caller's write transaction so corrupt JSON rolls back deletion. */
function consumePluginStateEntry(store, params) {
	const row = selectPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now: Date.now()
	});
	if (!row) return;
	deletePluginStateEntry(store.db, params);
	return parseStoredJson(row.value_json, "consume", store.path);
}
function envOptions(env) {
	return env ? { env } : {};
}
function readPluginState(operation, message, read, env) {
	const pathname = resolveAssistantStateSqlitePath(env ?? process.env);
	try {
		return withPluginStateDatabaseReadOnly(operation, read, envOptions(env));
	} catch (error) {
		throw wrapPluginStateError(error, operation, "PLUGIN_STATE_READ_FAILED", message, pathname);
	}
}
function writePluginState(operation, message, write, env) {
	try {
		return runWriteTransaction(operation, write, envOptions(env));
	} catch (error) {
		throw wrapPluginStateError(error, operation, operation === "consume" ? "PLUGIN_STATE_READ_FAILED" : "PLUGIN_STATE_WRITE_FAILED", message);
	}
}
function pluginStateRegister(params) {
	writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntry(store, params), params.env);
}
/** Prepared doctor rows only: validation and plugin-owned accessors run before BEGIN. */
function pluginStateImportBatch(params, entries) {
	if (entries.length === 0) return;
	if (entries.length > 500) throw new RangeError("Plugin state doctor import batch exceeds its row limit");
	try {
		const result = runWriteTransaction("register", (store) => {
			const retention = readPluginStateRetention(store.db, {
				...params,
				now: Date.now()
			});
			for (const entry of entries) try {
				runSqliteImmediateTransactionSync(store.db, () => registerPluginStateEntry(store, {
					...params,
					...entry
				}, retention));
			} catch (error) {
				if (!store.db.isOpen || !store.db.isTransaction || isSqliteCorruptionError(error)) throw error;
				return err(error);
			}
			return ok(void 0);
		}, envOptions(params.env));
		if (!result.ok) throw result.error;
	} catch (error) {
		throw wrapPluginStateError(error, "register", "PLUGIN_STATE_WRITE_FAILED", "Failed to register plugin state entry.");
	}
}
function pluginStateRegisterIfAbsent(params) {
	return writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntryIfAbsent(store, params), params.env);
}
function pluginStateUpdate(params) {
	return writePluginState("register", "Failed to update plugin state entry.", (store) => {
		const now = Date.now();
		deleteExpiredPluginStateEntries(store.db, now, {
			pluginId: params.pluginId,
			namespace: params.namespace
		});
		const existing = selectPluginStateEntry(store.db, {
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			now
		});
		const next = params.updateValueJson(existing ? parseStoredJson(existing.value_json, "lookup", store.path) : void 0);
		if (!next) return false;
		if (!existing) assertCanInsertPluginStateEntry({
			store,
			pluginId: params.pluginId,
			namespace: params.namespace,
			maxEntries: params.maxEntries,
			overflowPolicy: params.overflowPolicy,
			now
		});
		const expiresAt = resolvePluginStateExpiresAtMs({
			ttlMs: next.ttlMs,
			namespace: params.namespace,
			now,
			operation: "register",
			path: store.path
		});
		upsertPluginStateEntry(store.db, bindPluginStateEntry({
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			valueJson: next.valueJson,
			createdAt: now,
			expiresAt
		}));
		enforcePostRegisterLimits({
			store,
			pluginId: params.pluginId,
			namespace: params.namespace,
			maxEntries: params.maxEntries,
			overflowPolicy: params.overflowPolicy,
			now,
			protectedKey: params.key
		});
		return true;
	}, params.env);
}
function pluginStateLookup(params) {
	return readPluginState("lookup", "Failed to read plugin state entry.", (store) => lookupPluginStateEntry(store, params), params.env);
}
function pluginStateLookupMany(params) {
	if (params.keys.length === 0) return [];
	return readPluginState("lookup", "Failed to read plugin state entries.", (store) => lookupPluginStateEntries(store, params), params.env) ?? params.keys.map(() => ok(void 0));
}
function pluginStateConsume(params) {
	return writePluginState("consume", "Failed to consume plugin state entry.", (store) => consumePluginStateEntry(store, params), params.env);
}
function pluginStateDelete(params) {
	return writePluginState("delete", "Failed to delete plugin state entry.", ({ db }) => {
		return deletePluginStateEntry(db, params) > 0;
	}, params.env);
}
function pluginStateDeleteIf(params) {
	return writePluginState("delete", "Failed to conditionally delete plugin state entry.", ({ db, path: databasePath }) => {
		const row = selectPluginStateEntry(db, {
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			now: Date.now()
		});
		if (!row || !params.predicate(parseStoredJson(row.value_json, "delete", databasePath))) return false;
		return deletePluginStateEntry(db, params) > 0;
	}, params.env);
}
/** Deletes one bounded set of exact observed rows in a single synchronous transaction. */
function pluginStateDeleteEntriesIfUnchanged(params) {
	if (params.entries.length > 512) throw new RangeError(`Plugin state bulk deletion cannot exceed 512 entries.`);
	if (params.entries.length === 0) return {
		deleted: 0,
		changed: 0
	};
	const observed = params.entries.map(({ value: _value, ...entry }) => entry);
	return runWriteTransaction("delete", ({ db }) => {
		params.assertOwnedInTransaction(db);
		let deleted = 0;
		for (const entry of observed) {
			let query = getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", entry.key).where("value_json", "=", entry.valueJson).where("created_at", "=", entry.createdAt);
			query = entry.expiresAt === null ? query.where("expires_at", "is", null) : query.where("expires_at", "=", entry.expiresAt);
			deleted += Number(executeSqliteQuerySync(db, query).numAffectedRows ?? 0);
		}
		return {
			deleted,
			changed: observed.length - deleted
		};
	}, envOptions(params.env));
}
/** Doctor-only bounded raw read keeps malformed rows visible and preserves exact CAS bytes. */
function pluginStateDoctorEntriesInKeyRange(params) {
	if (!params.prefix || !Number.isSafeInteger(params.limit) || params.limit < 1 || params.limit > 512 || params.after !== void 0 && !params.after.startsWith(params.prefix)) throw new RangeError(`Plugin doctor state reads require a valid prefix and a limit of 1-512.`);
	return readPluginStateRowsInKeyRange({
		...params,
		keyStartInclusive: params.after === void 0 ? params.prefix : `${params.after}\0`,
		keyEndExclusive: `${params.prefix}\uffff`
	}, (row) => {
		const createdAt = normalizeSqliteNumber(row.created_at);
		const expiresAt = normalizeSqliteNumber(row.expires_at);
		const entry = {
			key: row.entry_key,
			valueJson: row.value_json,
			createdAt: createdAt ?? 0,
			expiresAt: expiresAt ?? null
		};
		if (!Number.isSafeInteger(createdAt) || (createdAt ?? -1) < 0 || row.expires_at !== null && !Number.isSafeInteger(expiresAt)) return entry;
		try {
			entry.value = JSON.parse(row.value_json);
		} catch {}
		return entry;
	});
}
function pluginStateCount(params) {
	return readPluginState("count", "Failed to count plugin state entries.", ({ db }) => countLivePluginStateNamespaceEntries(db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: Date.now()
	}), params.env) ?? 0;
}
function pluginStateEntries(params) {
	return readPluginState("entries", "Failed to list plugin state entries.", (store) => listPluginStateEntries(store, params), params.env) ?? [];
}
function readPluginStateRowsInKeyRange(params, mapRow) {
	validatePluginStateKeyRange(params);
	return readPluginState("entries", "Failed to list plugin state entries by key range.", ({ db, path: databasePath }) => selectPluginStateEntriesInKeyRange(db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		keyStartInclusive: params.keyStartInclusive,
		keyEndExclusive: params.keyEndExclusive,
		limit: params.limit,
		order: params.order ?? "asc",
		now: Date.now()
	}).map((row) => mapRow(row, databasePath)), params.env) ?? [];
}
function pluginStateClear(params) {
	writePluginState("clear", "Failed to clear plugin state namespace.", ({ db }) => clearPluginStateNamespace(db, params), params.env);
}
function getPluginStateCapacity(pluginId, env) {
	return {
		liveEntries: readPluginState("entries", "Failed to count plugin state entries.", ({ db }) => countLivePluginStateEntries(db, {
			pluginId,
			now: Date.now()
		}), env) ?? 0,
		maxEntries: Number.POSITIVE_INFINITY
	};
}
async function closePluginStateDatabaseAsync() {
	await closeAssistantStateDatabaseAsync();
}
//#endregion
//#region src/plugin-state/plugin-state-store.validation.ts
function invalidInput(message, operation = "register") {
	return new PluginStateStoreError(message, {
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation
	});
}
function validateNamespace(value, operation = "open") {
	return validatePluginStoreNamespace({
		value,
		label: "plugin state",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function requireBoundedOptions(options) {
	if (options.retention !== void 0 && options.retention !== "bounded") throw invalidInput("This plugin state operation requires a bounded store.", "open");
}
function validateKey(value, operation = "register") {
	return validatePluginStoreKey({
		value,
		label: "plugin state",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function validateMaxEntries(value) {
	if (!Number.isInteger(value) || value < 1) throw invalidInput("plugin state maxEntries must be an integer >= 1", "open");
	return value;
}
const optionPolicy = createPluginStoreOptionPolicy({
	label: "plugin state",
	invalid: (message) => invalidInput(message, "open")
});
function validateOptionalTtlMs(value, operation = "register") {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin state ttlMs",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function prepareRegisterParams(key, value, defaultTtlMs, opts, namespace) {
	const normalizedKey = validateKey(key, "register");
	const json = serializePluginStoreJson({
		value,
		label: "plugin state value",
		maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
		errors: {
			invalid: (message) => invalidInput(message, "register"),
			limit: (message) => new PluginStateStoreError(message, {
				code: "PLUGIN_STATE_LIMIT_EXCEEDED",
				operation: "register"
			})
		}
	});
	const ttlMs = validateOptionalTtlMs(opts?.ttlMs, "register") ?? defaultTtlMs;
	if (namespace && isRetainedPluginStateNamespace(namespace) && ttlMs !== void 0) throw invalidInput("Retained plugin state does not accept a TTL.");
	return {
		key: normalizedKey,
		valueJson: json,
		...ttlMs != null ? { ttlMs } : {}
	};
}
function prepareLookupKeys(keys) {
	if (keys.length > 1e4) throw invalidInput("plugin state lookupMany accepts at most 10000 keys", "lookup");
	return Array.from(keys, (key) => validateKey(key, "lookup"));
}
function prepareKeyedStoreOptions(pluginId, options) {
	const logicalNamespace = validateNamespace(options.namespace);
	if (options.retention === "retained") {
		if (options.maxEntries !== void 0 || options.overflowPolicy !== void 0 || options.defaultTtlMs !== void 0) throw invalidInput("Retained plugin state does not accept count, overflow or TTL options.", "open");
		return {
			pluginId,
			namespace: `${RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX}${logicalNamespace}`,
			maxEntries: void 0,
			overflowPolicy: "evict-oldest",
			env: options.env
		};
	}
	requireBoundedOptions(options);
	const namespace = logicalNamespace;
	const maxEntries = validateMaxEntries(options.maxEntries);
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
	const env = options.env;
	optionPolicy.assertConsistent(pluginId, namespace, {
		maxEntries,
		overflowPolicy,
		defaultTtlMs
	});
	return {
		pluginId,
		namespace,
		maxEntries,
		overflowPolicy,
		defaultTtlMs,
		env
	};
}
//#endregion
//#region src/plugin-state/plugin-state-worker-contract.ts
const pluginStateWorkerOperations = {
	"pluginState.appendJournal": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register sequenced plugin state journal entry."
	},
	"pluginState.entriesInKeyRange": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries by key range."
	},
	"pluginState.moveEntries": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to move plugin state entries."
	},
	"pluginState.observe": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to observe plugin state entry."
	},
	"pluginState.compareUpdate": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to update plugin state entry."
	},
	"pluginState.compareDelete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.register": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.registerIfAbsent": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.deleteIfEqual": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.lookup": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entry."
	},
	"pluginState.lookupMany": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entries."
	},
	"pluginState.consume": {
		operation: "consume",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to consume plugin state entry."
	},
	"pluginState.delete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to delete plugin state entry."
	},
	"pluginState.entries": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries."
	},
	"pluginState.count": {
		operation: "count",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to count plugin state entries."
	},
	"pluginState.clear": {
		operation: "clear",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to clear plugin state namespace."
	},
	"pluginState.sweep": {
		operation: "sweep",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to sweep expired plugin state entries."
	}
};
//#endregion
//#region src/plugin-state/plugin-state-worker-errors.ts
const errorConstructors = /* @__PURE__ */ new Map([
	["Error", Error],
	["TypeError", TypeError],
	["SyntaxError", SyntaxError],
	["RangeError", RangeError],
	["ReferenceError", ReferenceError],
	["URIError", URIError],
	["EvalError", EvalError]
]);
function restoreCause(value) {
	if (value && "canonical" in value) {
		const retained = /* @__PURE__ */ new Error("SQLite worker error cause");
		retainAssistantStateWorkerErrorPayload(retained, value.canonical);
		return hydrateAssistantStateWorkerError(retained);
	}
	const Constructor = value ? errorConstructors.get(value.name) ?? Error : Error;
	return value ? Object.assign(new Constructor(value.message, { cause: restoreCause(value.cause) }), {
		name: value.name,
		...value.code === void 0 ? {} : { code: value.code },
		...value.errcode === void 0 ? {} : { errcode: value.errcode }
	}) : void 0;
}
function restorePluginStateWorkerFailure(error) {
	return new PluginStateStoreError(error.message, {
		code: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path },
		cause: restoreCause(error.cause)
	});
}
//#endregion
//#region src/plugin-state/plugin-state-worker-client.ts
async function execute({ env, assertActive }, name, dispatch, missing, checks = {}) {
	const { assertCurrent, isObservation } = checks;
	const assertAdmission = assertCurrent ? () => {
		assertActive?.();
		assertCurrent();
	} : assertActive;
	assertAdmission?.();
	const databasePath = resolveAssistantStateSqlitePath(env ?? process.env);
	const description = pluginStateWorkerOperations[name];
	let dispatched = false;
	try {
		const context = captureAssistantStateWorkerContext({
			path: databasePath,
			env
		});
		const [{ runAssistantStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./testclaw-state-worker-store-C-YrKqH_.js"), import("./sqlite-worker-store-DHnDUYmC.js")]);
		const operation = async (scope) => {
			dispatched = true;
			const result = await dispatch(scope);
			if (!result.ok) throw restorePluginStateWorkerFailure(result.error);
			return result.value;
		};
		if (missing) {
			const result = await runAssistantStateWorkerOperation(context, operation, {
				existingOnly: true,
				assertCurrent: assertAdmission
			});
			assertActive?.();
			return result === void 0 ? missing() : result;
		}
		const result = await runAssistantStateWorkerOperation(context, operation, {
			assertCurrent: assertAdmission,
			requireStateLifecycle: true,
			createAdmission: createSqliteWorkerWriteAdmission(() => {
				context.admission.assertCurrent();
				assertAdmission?.();
			}, [databasePath])
		});
		if (isObservation?.(result)) assertAdmission?.();
		return result;
	} catch (error) {
		throw wrapPluginStateError(error, description.operation, dispatched ? description.code : "PLUGIN_STATE_OPEN_FAILED", dispatched ? description.message : "Failed to open the plugin state database.", databasePath);
	}
}
function registerPluginStateInWorker(params) {
	const { env, assertActive, assertCurrent, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.register", (scope) => scope.execute({
		type: "pluginState.register",
		input
	}), void 0, { assertCurrent });
}
function observePluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.observe", (scope) => scope.execute({
		type: "pluginState.observe",
		input
	}), void 0, { isObservation: () => true });
}
function comparePluginStateUpdateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.compareUpdate", (scope) => scope.execute({
		type: "pluginState.compareUpdate",
		input
	}), void 0, { isObservation: (result) => result.status === "conflict" });
}
function comparePluginStateDeleteInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.compareDelete", (scope) => scope.execute({
		type: "pluginState.compareDelete",
		input
	}), void 0, { isObservation: (result) => result.status === "conflict" });
}
function registerPluginStateIfAbsentInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.registerIfAbsent", (scope) => scope.execute({
		type: "pluginState.registerIfAbsent",
		input
	}));
}
function deletePluginStateIfEqualInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.deleteIfEqual", (scope) => scope.execute({
		type: "pluginState.deleteIfEqual",
		input
	}));
}
function lookupPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.lookup", (scope) => scope.execute({
		type: "pluginState.lookup",
		input
	}), () => void 0);
}
async function lookupManyPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	params.assertActive?.();
	if (input.keys.length === 0) return [];
	return (await execute({
		env,
		assertActive
	}, "pluginState.lookupMany", (scope) => scope.execute({
		type: "pluginState.lookupMany",
		input
	}), () => input.keys.map(() => ok(void 0)))).map((result) => result.ok ? result : err(restorePluginStateWorkerFailure(result.error)));
}
function consumePluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.consume", (scope) => scope.execute({
		type: "pluginState.consume",
		input
	}));
}
function deletePluginStateInWorker(params) {
	const { env, assertActive, assertCurrent, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.delete", (scope) => scope.execute({
		type: "pluginState.delete",
		input
	}), void 0, { assertCurrent });
}
function listPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.entries", (scope) => scope.execute({
		type: "pluginState.entries",
		input
	}), () => []);
}
function clearPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.clear", (scope) => scope.execute({
		type: "pluginState.clear",
		input
	}));
}
function sweepExpiredPluginStateEntriesInWorker(params = {}) {
	return execute(params, "pluginState.sweep", (scope) => scope.execute({
		type: "pluginState.sweep",
		input: void 0
	}));
}
function countPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.count", (scope) => scope.execute({
		type: "pluginState.count",
		input
	}), () => 0);
}
function listPluginStateInKeyRangeInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.entriesInKeyRange", (scope) => scope.execute({
		type: "pluginState.entriesInKeyRange",
		input
	}), () => []);
}
function movePluginStateEntriesInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.moveEntries", (scope) => scope.execute({
		type: "pluginState.moveEntries",
		input
	}));
}
//#endregion
//#region src/plugin-state/plugin-state-store.ts
function createKeyedStoreForPluginId(pluginId, options, assertActive) {
	const prepared = prepareKeyedStoreOptions(pluginId, options);
	const assertRetainedActive = options.retention === "retained" ? assertActive : void 0;
	const store = createSyncKeyedStore(prepared, assertRetainedActive);
	return {
		...createAsyncKeyedStore(prepared, assertRetainedActive, assertActive),
		withCurrent: ({ assertCurrent }) => {
			if (typeof assertCurrent !== "function") throw invalidInput("Plugin state action authority requires assertCurrent.");
			const assertBoundCurrent = () => {
				assertActive?.();
				assertCurrent();
			};
			assertBoundCurrent();
			return createAsyncKeyedStore(prepared, assertBoundCurrent);
		},
		update: async (...args) => store.update(...args),
		deleteIf: async (...args) => store.deleteIf(...args)
	};
}
function createAsyncKeyedStore(prepared, assertActive, assertRangeActive = assertActive) {
	const scope = {
		pluginId: prepared.pluginId,
		namespace: prepared.namespace,
		env: prepared.env,
		assertActive
	};
	return {
		observe: async (key) => {
			return await observePluginStateInWorker({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		compareAndApply: async (key, comparison, intent) => {
			if (intent?.operation !== "update" && intent?.operation !== "delete") throw invalidInput("Plugin state comparison requires an update or delete intent.");
			const operation = intent.operation === "update" ? "register" : "delete";
			const normalizedKey = validateKey(key, operation);
			validatePluginStateComparison(comparison, operation);
			const common = {
				...scope,
				key: normalizedKey,
				comparison,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy
			};
			let result;
			if (intent.operation === "update" && intent.action === "set") {
				const next = prepareRegisterParams(normalizedKey, intent.value, prepared.defaultTtlMs, { ttlMs: intent.ttlMs }, prepared.namespace);
				result = await comparePluginStateUpdateInWorker({
					...common,
					...next,
					operation: "update",
					action: "set"
				});
			} else if (intent.operation === "update" && intent.action === "keep") result = await comparePluginStateUpdateInWorker({
				...common,
				operation: "update",
				action: "keep"
			});
			else if (intent.operation === "delete" && (intent.action === "delete" || intent.action === "keep")) result = await comparePluginStateDeleteInWorker({
				...common,
				operation: "delete",
				action: intent.action
			});
			else throw invalidInput("Plugin state comparison has an invalid mutation action.", operation);
			return result;
		},
		register: async (key, value, opts) => {
			const entry = prepareRegisterParams(key, value, prepared.defaultTtlMs, opts, prepared.namespace);
			await registerPluginStateInWorker({
				...scope,
				...entry,
				assertCurrent: opts?.assertCurrent,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy
			});
		},
		registerIfAbsent: async (key, value, opts) => {
			const entry = prepareRegisterParams(key, value, prepared.defaultTtlMs, opts, prepared.namespace);
			return await registerPluginStateIfAbsentInWorker({
				...scope,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy,
				...entry
			});
		},
		deleteIfEqual: async (key, expected) => {
			const normalizedKey = validateKey(key, "delete");
			if (expected !== null && ![
				"string",
				"number",
				"boolean"
			].includes(typeof expected)) throw invalidInput("plugin state conditional deletion requires a JSON scalar", "delete");
			serializePluginStoreJson({
				value: expected,
				label: "plugin state comparison value",
				maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
				errors: {
					invalid: (message) => invalidInput(message, "delete"),
					limit: (message) => invalidInput(message, "delete")
				}
			});
			return await deletePluginStateIfEqualInWorker({
				...scope,
				key: normalizedKey,
				expected
			});
		},
		lookup: async (key) => {
			const normalizedKey = validateKey(key, "lookup");
			return await lookupPluginStateInWorker({
				...scope,
				key: normalizedKey
			});
		},
		lookupMany: async (keys) => {
			const normalizedKeys = prepareLookupKeys(keys);
			return await lookupManyPluginStateInWorker({
				...scope,
				keys: normalizedKeys
			});
		},
		consume: async (key) => {
			const normalizedKey = validateKey(key, "consume");
			return await consumePluginStateInWorker({
				...scope,
				key: normalizedKey
			});
		},
		delete: async (key, opts) => {
			const normalizedKey = validateKey(key, "delete");
			return await deletePluginStateInWorker({
				...scope,
				key: normalizedKey,
				assertCurrent: opts?.assertCurrent
			});
		},
		entries: async () => {
			return await listPluginStateInWorker(scope);
		},
		entriesInKeyRange: async (range) => {
			const params = {
				...scope,
				keyStartInclusive: range.keyStartInclusive,
				keyEndExclusive: range.keyEndExclusive,
				limit: range.limit,
				order: range.order,
				assertActive: assertRangeActive
			};
			validatePluginStateKeyRange(params);
			return await listPluginStateInKeyRangeInWorker(params);
		},
		moveEntriesFrom: async (source) => {
			assertActive?.();
			if (!isRetainedPluginStateNamespace(prepared.namespace)) throw invalidInput("Plugin state moves require a retained destination.");
			const sourceNamespace = validateNamespace(source.namespace, "register");
			if (source.entries.length > 1e4) throw invalidInput("Plugin state moves accept at most 10000 entries.");
			const targets = /* @__PURE__ */ new Set();
			const sources = /* @__PURE__ */ new Set();
			const entries = source.entries.map(({ sourceKey, targetKey }) => {
				const entry = {
					sourceKey: toUSVString(validateKey(sourceKey)),
					targetKey: toUSVString(validateKey(targetKey))
				};
				if (targets.has(entry.targetKey) || sources.has(entry.sourceKey)) throw invalidInput("Plugin state moves require unique source and target keys.");
				targets.add(entry.targetKey);
				sources.add(entry.sourceKey);
				return entry;
			});
			return movePluginStateEntriesInWorker({
				...scope,
				sourceNamespace,
				entries,
				assertActive
			});
		},
		count: async () => await countPluginStateInWorker(scope),
		clear: async () => {
			await clearPluginStateInWorker(scope);
		}
	};
}
function createSyncKeyedStoreForPluginId(pluginId, options) {
	requireBoundedOptions(options);
	return createSyncKeyedStore(prepareKeyedStoreOptions(pluginId, options));
}
function createSyncKeyedStore({ pluginId, namespace, maxEntries, overflowPolicy, defaultTtlMs, env }, assertActive) {
	const scope = {
		pluginId,
		namespace,
		env
	};
	const writeScope = {
		...scope,
		maxEntries,
		overflowPolicy
	};
	return {
		register(key, value, opts) {
			pluginStateRegister({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		registerIfAbsent(key, value, opts) {
			return pluginStateRegisterIfAbsent({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		update(key, updateValue, opts) {
			assertActive?.();
			if (isRetainedPluginStateNamespace(namespace) && opts?.ttlMs !== void 0) throw invalidInput("Retained plugin state does not accept a TTL.");
			const normalizedKey = validateKey(key, "register");
			return pluginStateUpdate({
				...writeScope,
				key: normalizedKey,
				updateValueJson: (current) => {
					const next = updateValue(current);
					assertActive?.();
					return next === void 0 ? void 0 : prepareRegisterParams(normalizedKey, next, defaultTtlMs, opts, namespace);
				}
			});
		},
		deleteIf(key, predicate) {
			assertActive?.();
			return pluginStateDeleteIf({
				...scope,
				key: validateKey(key, "delete"),
				predicate: (current) => {
					const result = predicate(current);
					assertActive?.();
					return result;
				}
			});
		},
		lookup(key) {
			return pluginStateLookup({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		lookupMany(keys) {
			return pluginStateLookupMany({
				...scope,
				keys: prepareLookupKeys(keys)
			});
		},
		consume(key) {
			return pluginStateConsume({
				...scope,
				key: validateKey(key, "consume")
			});
		},
		delete(key) {
			return pluginStateDelete({
				...scope,
				key: validateKey(key, "delete")
			});
		},
		entries() {
			return pluginStateEntries(scope);
		},
		count() {
			return pluginStateCount(scope);
		},
		clear() {
			pluginStateClear(scope);
		}
	};
}
/**
* Migration-only write path that preserves a legacy entry's original creation
* timestamp. Cap eviction removes the oldest `created_at` first, so imported
* rows must keep their real age instead of being stamped with the import time
* (which would let later live writes evict fresher pre-existing rows first).
* Not part of the plugin-facing store API.
*/
function registerMigratedPluginStateEntry(params) {
	if (!Number.isFinite(params.createdAtMs) || params.createdAtMs < 0) throw invalidInput("plugin state migration createdAtMs must be a non-negative finite number");
	const namespace = validateNamespace(params.namespace, "register");
	const maxEntries = validateMaxEntries(params.maxEntries);
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(params.overflowPolicy);
	const defaultTtlMs = validateOptionalTtlMs(params.defaultTtlMs);
	const prepared = prepareRegisterParams(params.key, params.value, defaultTtlMs, params.ttlMs != null ? { ttlMs: params.ttlMs } : void 0);
	pluginStateRegister({
		pluginId: params.pluginId,
		namespace,
		key: prepared.key,
		valueJson: prepared.valueJson,
		maxEntries,
		overflowPolicy,
		createdAtMs: Math.floor(params.createdAtMs),
		...params.env ? { env: params.env } : {},
		...prepared.ttlMs != null ? { ttlMs: prepared.ttlMs } : {}
	});
}
/** Opens an async plugin-state namespace for a non-core plugin id. */
function createPluginStateKeyedStore(pluginId, options, assertActive) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return createKeyedStoreForPluginId(pluginId, options, assertActive);
}
/**
* Named adapter for the plugin-state-sync-keyed-store compatibility contract.
* @deprecated Plugin runtimes should use api.runtime.state.openKeyedStore and
* await its operations. This sync adapter remains through the next Plugin SDK major.
*/
function createPluginStateSyncKeyedStore(pluginId, options) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return createSyncKeyedStoreForPluginId(pluginId, options);
}
/** Doctor-only import that preserves source age and remaining retention. */
function importPluginStateEntriesForDoctor(pluginId, options, entries) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	requireBoundedOptions(options);
	const preparedOptions = prepareKeyedStoreOptions(pluginId, options);
	let batch = [];
	const flush = () => {
		pluginStateImportBatch(preparedOptions, batch);
		batch = [];
	};
	for (const entry of entries) {
		try {
			if (!Number.isSafeInteger(entry.createdAt)) throw invalidInput("plugin state import createdAt must be a safe integer", "register");
			const prepared = prepareRegisterParams(entry.key, entry.value, preparedOptions.defaultTtlMs, entry.ttlMs != null ? { ttlMs: entry.ttlMs } : void 0);
			batch.push({
				...prepared,
				createdAtMs: entry.createdAt
			});
		} catch (error) {
			flush();
			throw error;
		}
		if (batch.length === 500) flush();
	}
	flush();
}
/** Opens an async plugin-state namespace for a trusted core owner id. */
function createCorePluginStateKeyedStore(options) {
	return createKeyedStoreForPluginId(options.ownerId, options);
}
/** Opens a sync plugin-state namespace for a trusted core owner id. */
function createCorePluginStateSyncKeyedStore(options) {
	return createSyncKeyedStoreForPluginId(options.ownerId, options);
}
//#endregion
export { validatePluginStorePositiveInteger as _, importPluginStateEntriesForDoctor as a, closePluginStateDatabaseAsync as c, pluginStateDoctorEntriesInKeyRange as d, createPluginStoreOptionPolicy as f, validatePluginStoreNamespace as g, validatePluginStoreKey as h, createPluginStateSyncKeyedStore as i, getPluginStateCapacity as l, validateOptionalPluginStoreTtlMs as m, createCorePluginStateSyncKeyedStore as n, registerMigratedPluginStateEntry as o, serializePluginStoreJson as p, createPluginStateKeyedStore as r, sweepExpiredPluginStateEntriesInWorker as s, createCorePluginStateKeyedStore as t, pluginStateDeleteEntriesIfUnchanged as u };
