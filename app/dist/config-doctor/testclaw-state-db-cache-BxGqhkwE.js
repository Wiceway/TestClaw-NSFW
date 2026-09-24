import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { c as registerNodeSqliteDisposeCallback, i as executeWithCachedStatement, l as registerNodeSqliteKyselyQueryErrorHandler, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-C8TndyjF.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { i as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { a as throwSqliteLifecycleErrors, c as SQLITE_IDLE_HANDLE_TTL_MS, i as runWithSqliteCoordinator, l as applyPrivateModeSync, n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-olf_92pI.js";
import { f as withSqliteNativeOpen, r as isSqliteCorruptionError } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { a as runSqliteImmediateTransactionSync, o as runSqlitePinnedReadSnapshotSync } from "./sqlite-transaction-C94DYooc.js";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-Cresg45I.js";
import { F as runInSqliteMaintenanceContext, K as tableExists$2, P as registerSqliteCacheExitClose, W as ensureColumn, d as acquireStateDatabaseCoordinator, f as acquireStateDatabaseHandleExclusion, n as registerLiveSqliteSnapshotOwner, p as acquireStateDatabaseHandleLease, q as tableHasColumn } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { a as TESTCLAW_DATABASE_SCHEMA_DOCS_URL, o as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./testclaw-state-db-contract-CdyGtChZ.js";
import { t as VERSION } from "./version-BdHihr00.js";
import { a as readSqliteUserVersion, i as isSqliteSchemaVersionError, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-BppRXydv.js";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DewCyJy9.js";
import { i as getAssistantDatabaseMaintenanceScope, o as isAssistantDatabaseMaintenanceResourceOwned, r as createAssistantStateDatabaseAsyncLifecycle, s as observeAssistantDatabaseMaintenanceResource } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { a as confirmSqliteFileIntegrity, f as readStableSqliteFileGeneration, m as serializeSqliteFileGeneration, p as sameSqliteFileGeneration, r as assertSqliteIntegrity, u as parseSqliteFileGeneration } from "./error-utils-B4pDpAz2.js";
import { n as AssistantQuarantineReadCleanupError, r as SessionMetadataUnavailableError } from "./testclaw-quarantine-error-ChUHz7CU.js";
import { o as resolveAssistantStateSqliteDir, s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { r as normalizeAssistantStateSchemaReadError } from "./testclaw-state-db-schema-migration-required-eo_HqJ-U.js";
import { existsSync, mkdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readStableSqliteFileGeneration(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			for (;;) {
				const failure = failures.get(resolvedPath);
				if (!failure?.generation) return failure?.error;
				const current = await isCurrentGeneration(resolvedPath, failure.generation);
				if (failures.get(resolvedPath) !== failure) continue;
				if (!current) {
					failures.delete(resolvedPath);
					return;
				}
				return failure.error;
			}
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			if (generation && !generationMatchesPath(resolvedPath, generation)) {
				failures.delete(resolvedPath);
				return false;
			}
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region src/infra/sqlite-schema-sql.ts
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"CHECK",
	"FOREIGN",
	"PRIMARY",
	"UNIQUE"
]);
/** Select canonical DDL without opening a database or changing its installation lifecycle. */
function extractSqliteTableSchema(schema, table, options = {}) {
	const start = schema.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
	const endMarker = options.endMarker ?? "\n) STRICT;";
	const end = schema.indexOf(endMarker, start);
	if (start < 0 || end < start) throw new Error(options.errorMessage ?? `Canonical schema markers are missing for ${table}`);
	return schema.slice(start, end + (options.includeEndMarker === false ? 0 : endMarker.length));
}
function readTableConstraintKeyword(sql, first) {
	let token = first;
	if (token.keyword === "CONSTRAINT") {
		const name = readSqlToken(sql, token.end);
		token = name ? readSqlToken(sql, name.end) : null;
	}
	return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
	let index = start;
	while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
	const char = sql[index];
	if (!char) return null;
	if (char === "\"" || char === "`") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	if (char === "[") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	let end = index;
	while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
	const raw = sql.slice(index, end);
	return {
		end,
		keyword: raw.toUpperCase(),
		raw
	};
}
function normalizeSqlIdentifier(identifier) {
	if (identifier.startsWith("\"") && identifier.endsWith("\"")) return identifier.slice(1, -1).replaceAll("\"\"", "\"").toLowerCase();
	if (identifier.startsWith("`") && identifier.endsWith("`")) return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
	if (identifier.startsWith("[") && identifier.endsWith("]")) return identifier.slice(1, -1).toLowerCase();
	return identifier.toLowerCase();
}
function normalizeSchemaSql(sql) {
	if (sql === null) return null;
	return normalizeSqlWhitespace(sql).replace(/;\s*$/u, "").trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
	const items = [];
	let depth = 0;
	let start = 0;
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
		index += 1;
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		if (sql[index] === character) return index;
		index += 1;
	}
	return -1;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	let index = open;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
		index += 1;
	}
	throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
	let normalized = "";
	let pendingSpace = false;
	const segments = /[^\s'"`[/-]+|\s+|./gsu;
	let segment;
	while (segment = segments.exec(sql)) {
		const index = segment.index;
		const char = segment[0][0] ?? "";
		const quoted = skipSqlQuoted(sql, index, char);
		if (quoted !== index) {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += sql.slice(index, quoted);
			pendingSpace = false;
			segments.lastIndex = quoted;
			continue;
		}
		const comment = skipSqlComment(sql, index);
		if (comment !== index) {
			pendingSpace = true;
			segments.lastIndex = comment;
			continue;
		}
		if (/\s/u.test(char)) pendingSpace = true;
		else {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += segment[0];
			pendingSpace = false;
		}
	}
	return normalized.trim();
}
function quoteSqliteIdentifier$1(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function skipSqlQuotedOrComment(sql, index) {
	const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
	return quoted !== index ? quoted : skipSqlComment(sql, index);
}
function skipSqlQuoted(sql, index, quote) {
	if (quote !== "'" && quote !== "\"" && quote !== "`" && quote !== "[") return index;
	const closingQuote = quote === "[" ? "]" : quote;
	let cursor = index + 1;
	while (cursor < sql.length) {
		if (sql[cursor] !== closingQuote) {
			cursor += 1;
			continue;
		}
		if (quote !== "[" && sql[cursor + 1] === closingQuote) {
			cursor += 2;
			continue;
		}
		return cursor + 1;
	}
	return sql.length;
}
function skipSqlComment(sql, index) {
	if (sql.startsWith("--", index)) {
		const newline = sql.indexOf("\n", index + 2);
		return newline === -1 ? sql.length : newline + 1;
	}
	if (sql.startsWith("/*", index)) {
		const close = sql.indexOf("*/", index + 2);
		return close === -1 ? sql.length : close + 2;
	}
	return index;
}
//#endregion
//#region src/infra/sqlite-schema-contract-assembly.ts
function createSqliteTableContract(tableName, table, tableList, indexes, triggers) {
	const normalizedTriggers = triggers.map((trigger) => ({
		name: trigger.name,
		sql: normalizeSchemaSql(trigger.sql)
	}));
	const normalizedTableSql = table.sql?.startsWith("CREATE TABLE ") ? null : normalizeSchemaSql(table.sql);
	const isVirtualTable = normalizedTableSql !== null && /^CREATE VIRTUAL TABLE /iu.test(normalizedTableSql);
	return {
		definition: isVirtualTable ? null : parseTableDefinition(table.sql, tableName),
		indexes,
		strict: tableList.strict,
		triggers: normalizedTriggers,
		virtualTableSql: isVirtualTable ? normalizedTableSql : null,
		withoutRowid: tableList.wr
	};
}
function createSqliteIndexContract(index, schemaSql, rows) {
	const terms = rows.map(({ cid, coll, desc, key, name, seqno }) => ({
		coll,
		desc,
		key,
		kind: sqliteIndexTermKind(cid),
		name,
		seqno
	}));
	return {
		name: index.name.startsWith("sqlite_autoindex_") ? null : index.name,
		origin: index.origin,
		partial: index.partial,
		sql: normalizeSchemaSql(schemaSql),
		terms,
		unique: index.unique
	};
}
function sqliteIndexTermKind(cid) {
	return cid === -2 ? "expression" : cid === -1 ? "rowid" : "column";
}
function parseTableDefinition(sql, tableName) {
	if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
	const open = findSqlCharacter(sql, "(");
	if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
	const close = findSqlClosingParenthesis(sql, open);
	const columns = /* @__PURE__ */ new Map();
	const constraints = [];
	for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
		const definition = normalizeSqlWhitespace(rawDefinition);
		if (!definition) continue;
		const token = readSqlToken(definition, 0);
		if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
		if (readTableConstraintKeyword(definition, token)) {
			constraints.push(definition);
			continue;
		}
		const columnName = normalizeSqlIdentifier(token.raw);
		if (columns.has(columnName)) throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
		columns.set(columnName, definition);
	}
	return {
		columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
		constraints: constraints.toSorted()
	};
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
function defaultIssueMessage(code, objectName) {
	const tableName = objectName.split(".", 1)[0];
	switch (code) {
		case "missing-table": return `missing table ${objectName}`;
		case "missing-column":
		case "unexpected-column":
		case "column-definition-drift": return `column definitions differ for ${tableName}`;
		case "table-constraint-drift": return `table constraints differ for ${objectName}`;
		case "table-definition-drift": return `table definition differs for ${objectName}`;
		case "missing-or-drifted-index": return `missing or drifted index ${objectName}`;
		case "unexpected-unique-index": return `unexpected unique index ${objectName}`;
		case "missing-or-drifted-trigger": return `missing or drifted trigger ${objectName}`;
		case "unexpected-trigger": return `unexpected trigger ${objectName}`;
		case "virtual-table-definition-drift": return `virtual table definition differs for ${objectName}`;
		case "table-options-drift": return `table options differ for ${objectName}`;
	}
	throw new Error("Unsupported SQLite schema issue code", { cause: code });
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const isColumnIssue = (issue) => issue.code === "column-definition-drift" || issue.code === "missing-column" || issue.code === "unexpected-column";
	const columnIssueTables = new Set(issues.filter(isColumnIssue).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}; run testclaw doctor --fix to repair it.`);
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
const schemaContractCache = /* @__PURE__ */ new Map();
/** Reuse actual table facts only within one unchanged read transaction on this connection. */
function createSqliteTableContractReader(database) {
	const tables = /* @__PURE__ */ new Map();
	return (tableName) => {
		if (!tables.has(tableName)) tables.set(tableName, collectSqliteTableContract(database, tableName));
		return tables.get(tableName);
	};
}
/**
* Require every object from one committed schema while allowing unrelated
* tables and indexes that do not replace a canonical object.
*/
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}, readTable) {
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility, readTable);
	if (issues.length > 0) throwSqliteSchemaMismatches(databaseLabel, legacySqliteSchemaIssueMessages(issues));
}
/** Collect stable, machine-readable differences from one committed schema. */
function collectSqliteSchemaIssues(database, schemaSql, compatibility = {}, readTable) {
	return runSqlitePinnedReadSnapshotSync(database, () => collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable));
}
function collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable) {
	const expected = getSqliteSchemaContract(schemaSql);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		const actualTable = readTable ? readTable(tableName) : collectSqliteTableContract(database, tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		const actualIndexFingerprints = new Set(actualTable.indexes.map((index) => JSON.stringify(index)));
		const expectedIndexFingerprints = /* @__PURE__ */ new Set();
		for (const expectedIndex of expectedTable.indexes) {
			const fingerprint = JSON.stringify(expectedIndex);
			expectedIndexFingerprints.add(fingerprint);
			if (!actualIndexFingerprints.has(fingerprint)) {
				const objectName = expectedIndex.name ?? tableName;
				if (expectedIndex.name && allowedMissingIndexes.has(expectedIndex.name) && !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'index' AND name = ? COLLATE NOCASE LIMIT 1").get(expectedIndex.name)) continue;
				add("missing-or-drifted-index", objectName, `missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
			}
		}
		for (const actualIndex of actualTable.indexes) if (actualIndex.unique === 1 && !expectedIndexFingerprints.has(JSON.stringify(actualIndex))) add("unexpected-unique-index", actualIndex.name ?? tableName, `unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
		const optionalCanonicalTriggerGroups = collectOptionalCanonicalTriggerGroups(database, compatibility, tableName);
		const optionalCanonicalTriggers = optionalCanonicalTriggerGroups.flatMap((group) => group.triggers);
		const allowedMissingCanonicalTriggers = optionalCanonicalTriggerGroups.filter((group) => group.optional).flatMap((group) => group.triggers);
		for (const expectedTrigger of expectedTable.triggers) {
			if (allowedMissingCanonicalTriggers.some((canonicalTrigger) => canonicalTrigger.name === expectedTrigger.name)) continue;
			if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, expectedTrigger))) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!expectedTable.triggers.some((expectedTrigger) => isEqualTrigger(actualTrigger, expectedTrigger)) && !optionalCanonicalTriggers.some((canonicalTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("unexpected-trigger", actualTrigger.name);
		if (actualTable.virtualTableSql !== expectedTable.virtualTableSql) add("virtual-table-definition-drift", tableName);
		if (actualTable.strict !== expectedTable.strict || actualTable.withoutRowid !== expectedTable.withoutRowid) add("table-options-drift", tableName);
	}
	return issues;
}
/** Require stable canonical tables before a version-specific additive migration. */
function assertSqliteSchemaTablesPresent(database, databaseLabel, schemaSql, options = {}) {
	const allowedMissingTables = new Set(options.allowedMissingTables ?? []);
	const requiredTables = getCanonicalSqliteTableNames(schemaSql).filter((tableName) => !allowedMissingTables.has(tableName));
	const missingTables = [];
	const batchSize = 500;
	for (let offset = 0; offset < requiredTables.length; offset += batchSize) {
		const tables = requiredTables.slice(offset, offset + batchSize);
		const expected = tables.map((_table, ordinal) => `(${ordinal}, ?)`).join(", ");
		const present = database.prepare(`WITH expected(ordinal, name) AS (VALUES ${expected})
         SELECT ordinal FROM expected
         WHERE EXISTS (
           SELECT 1 FROM main.sqlite_schema
           WHERE type = 'table' AND name = expected.name LIMIT 1
         )`).all(...tables);
		const presentOrdinals = new Set(present.map((row) => row.ordinal));
		for (const [ordinal, tableName] of tables.entries()) if (!presentOrdinals.has(ordinal)) missingTables.push(`missing table ${tableName}`);
	}
	if (missingTables.length > 0) throwSqliteSchemaMismatches(databaseLabel, missingTables);
}
/** Return every explicit named index owned by one committed schema. */
function getCanonicalSqliteNamedIndexContracts(schemaSql) {
	const schema = getSqliteSchemaContract(schemaSql);
	const indexes = [];
	for (const [tableName, table] of schema) for (const fingerprint of table.indexes) {
		if (fingerprint.name === null || fingerprint.sql === null || fingerprint.origin !== "c") continue;
		indexes.push({
			definition: readCanonicalIndexDefinition(fingerprint),
			fingerprint,
			name: fingerprint.name,
			tableName,
			unique: fingerprint.unique === 1
		});
	}
	return indexes;
}
/** Return every table owned by one committed schema. */
function getCanonicalSqliteTableNames(schemaSql) {
	return [...getSqliteSchemaContract(schemaSql).keys()];
}
/** Inspect one explicit main-schema index using the canonical schema fingerprint shape. */
function collectSqliteNamedIndexContract(database, indexName) {
	const row = database.prepare(`
      SELECT tbl_name FROM (
        SELECT name, sql, tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?
      )
    `).get(indexName);
	if (!row || typeof row.tbl_name !== "string") return;
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier$1(row.tbl_name)})`).all()?.find((candidate) => candidate.name === indexName);
	return index ? collectSqliteIndexContract(database, index) : void 0;
}
function collectOptionalCanonicalTriggerGroups(database, compatibility, tableName) {
	return (compatibility.optionalCanonicalTriggerGroups ?? []).filter((group) => group.tableName === tableName).map((group) => ({
		optional: !group.optionalWhenTableMissing || !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(group.optionalWhenTableMissing),
		triggers: group.triggers.map((trigger) => ({
			name: trigger.name,
			sql: normalizeOptionalCanonicalTriggerSql(trigger.sql)
		}))
	}));
}
function normalizeOptionalCanonicalTriggerSql(sql) {
	return normalizeSchemaSql(sql)?.replace(/^(CREATE TRIGGER) main\./iu, "$1 ") ?? null;
}
function getSqliteSchemaContract(schemaSql) {
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function collectCanonicalSqliteFacts(database) {
	const tableOptions = database.prepare("PRAGMA table_list").all();
	if (tableOptions.some((row) => {
		const name = row.name.toLowerCase();
		return name === "pragma_index_list" || name === "pragma_index_xinfo";
	})) return;
	const indexes = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      i.name, i.origin, i.partial, i."unique", d.sql
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    LEFT JOIN sqlite_schema AS d ON d.type = 'index' AND d.name = i.name
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
  `).all();
	const terms = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      x.seqno, x.cid, x.name, x."desc", x.coll, x."key"
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    CROSS JOIN pragma_index_xinfo(i.name) AS x
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
    ORDER BY t.rowid, i.seq, x.seqno
  `).all();
	const triggers = database.prepare(`
    SELECT tbl_name, name, sql FROM sqlite_schema WHERE type = 'trigger' ORDER BY tbl_name, name
  `).all();
	return {
		tableOptions,
		indexes: groupCanonicalRows(indexes, (row) => row.table_id),
		terms: groupCanonicalRows(terms, (row) => row.table_id),
		triggers: groupCanonicalRows(triggers, (row) => row.tbl_name)
	};
}
function groupCanonicalRows(rows, key) {
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = key(row);
		const group = groups.get(name);
		if (group) group.push(row);
		else groups.set(name, [row]);
	}
	return groups;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		const rows = database.prepare(`
          SELECT CAST(rowid AS TEXT) AS table_id, name, sql
          FROM sqlite_schema
          WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `).all();
		if (rows.length === 0) return /* @__PURE__ */ new Map();
		const facts = collectCanonicalSqliteFacts(database);
		if (!facts) return new Map(rows.map((table) => [table.name, collectSqliteTableContractFromRow(database, table.name, table)]));
		return new Map(rows.map((table) => {
			const tableList = facts.tableOptions.find((entry) => entry.name === table.name);
			if (!tableList) throw new Error(`Could not inspect SQLite table options for ${table.name}.`);
			const termsByIndex = groupCanonicalRows(facts.terms.get(table.table_id) ?? [], (term) => term.index_seq);
			const indexes = (facts.indexes.get(table.table_id) ?? []).map((index) => createSqliteIndexContract(index, index.sql, termsByIndex.get(index.index_seq) ?? [])).toSorted(compareJson);
			return [table.name, createSqliteTableContract(table.name, table, tableList, indexes, facts.triggers.get(table.name) ?? [])];
		}));
	} finally {
		database.close();
	}
}
function readCanonicalIndexDefinition(index) {
	if (index.name === null || index.sql === null) throw new Error("Canonical SQLite named index is missing its schema definition.");
	const prefix = (index.unique === 1 ? /^CREATE\s+UNIQUE\s+INDEX\s+/iu : /^CREATE\s+INDEX\s+/iu).exec(index.sql);
	if (!prefix) throw new Error(`Canonical SQLite index ${index.name} has an unreadable definition.`);
	const name = readSqlToken(index.sql, prefix[0].length);
	if (!name || normalizeSqlIdentifier(name.raw) !== index.name.toLowerCase()) throw new Error(`Canonical SQLite index ${index.name} has an unexpected schema name.`);
	const definition = index.sql.slice(name.end).trim();
	if (!/^ON\s+/iu.test(definition)) throw new Error(`Canonical SQLite index ${index.name} has an unreadable target.`);
	return definition;
}
function collectSqliteTableContract(database, tableName) {
	const table = executeWithCachedStatement(database, "SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName));
	if (!table) return;
	return collectSqliteTableContractFromRow(database, tableName, table);
}
function collectSqliteTableContractFromRow(database, tableName, table) {
	const quotedTable = quoteSqliteIdentifier$1(tableName);
	const tableList = database.prepare(`PRAGMA table_list(${quotedTable})`).all().find((entry) => entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	return createSqliteTableContract(tableName, table, tableList, database.prepare(`PRAGMA index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index)).toSorted(compareJson), executeWithCachedStatement(database, `
          SELECT name, sql
          FROM sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `, [tableName], (statement) => statement.all(tableName)));
}
function compareTableDefinitions(tableName, actual, expected, compatibility, allowCompatibleAdditiveColumns) {
	const issues = [];
	const add = (code, objectName) => {
		issues.push(createSqliteSchemaIssue(code, objectName));
	};
	if (!actual || !expected) {
		if (actual !== expected) add("table-definition-drift", tableName);
		return issues;
	}
	const allowedMissingColumns = new Set(compatibility.allowedMissingColumns ?? []);
	for (const [columnName, definition] of actual.columns) if (!expected.columns.has(columnName)) {
		if (allowCompatibleAdditiveColumns && compatibility.allowCompatibleAdditiveColumns && isCompatibleAdditiveColumnDefinition(definition)) continue;
		add("unexpected-column", `${tableName}.${columnName}`);
	}
	for (const [columnName, expectedDefinition] of expected.columns) {
		const objectName = `${tableName}.${columnName}`;
		const actualDefinition = actual.columns.get(columnName);
		if (actualDefinition === void 0) {
			if (!allowedMissingColumns.has(objectName)) add("missing-column", objectName);
			continue;
		}
		if (actualDefinition === expectedDefinition) continue;
		if (!(compatibility.allowedColumnDefinitions?.[objectName] ?? []).some((definition) => normalizeSqlWhitespace(definition) === actualDefinition)) add("column-definition-drift", objectName);
	}
	if (JSON.stringify(actual.constraints) !== JSON.stringify(expected.constraints)) add("table-constraint-drift", tableName);
	return issues;
}
const SQLITE_STRICT_DATATYPES = /* @__PURE__ */ new Set([
	"ANY",
	"BLOB",
	"INT",
	"INTEGER",
	"REAL",
	"TEXT"
]);
function isCompatibleAdditiveColumnDefinition(definition) {
	const name = readSqlToken(definition, 0);
	const type = name ? readSqlToken(definition, name.end) : null;
	return Boolean(type?.keyword && SQLITE_STRICT_DATATYPES.has(type.keyword) && definition.slice(type.end).trim().length === 0);
}
function collectSqliteIndexContract(database, index) {
	const row = executeWithCachedStatement(database, "SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = ?", [index.name], (statement) => statement.get(index.name));
	const terms = database.prepare(`PRAGMA index_xinfo(${quoteSqliteIdentifier$1(index.name)})`).all();
	return createSqliteIndexContract(index, typeof row?.sql === "string" ? row.sql : null, terms);
}
function isEqualTrigger(left, right) {
	return left.name === right.name && left.sql === right.sql;
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
function readSqliteSchemaCookie(database) {
	return database.prepare("PRAGMA schema_version").get()?.schema_version;
}
//#endregion
//#region src/infra/sqlite-strict.ts
const DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS = 5e3;
const STRICT_MIGRATION_TABLE_PREFIX = "__testclaw_strict_migration_";
const SQLITE_ROWID_ALIASES = [
	"_rowid_",
	"rowid",
	"oid"
];
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function readMainTableList(db) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_"));
}
function readTableColumns(db, tableName) {
	return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
	return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
		if (typeof row.name !== "string" || row.name.length === 0) throw new Error(`SQLite table ${tableName} has an invalid column name`);
		return row.name;
	});
}
function readTableRowidModel(db, tableName, tableRow) {
	if (Number(tableRow.wr ?? 0) === 1) return {
		alias: null,
		storage: "without-rowid"
	};
	const columns = readTableColumns(db, tableName);
	const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
	const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
	const primaryKeyType = primaryKeyColumns[0]?.type;
	if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) return {
		alias: null,
		storage: "integer-primary-key"
	};
	const declaredNames = new Set(columns.flatMap((column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []));
	const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
	if (!alias) throw new Error(`SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`);
	return {
		alias,
		storage: "implicit"
	};
}
function readCanonicalStrictTables(schemaSql) {
	const canonical = openNodeSqliteDatabase(":memory:");
	try {
		canonical.exec(schemaSql);
		const tables = readMainTableList(canonical).filter((row) => row.type === "table");
		const nonStrict = tables.flatMap((row) => Number(row.strict ?? 0) === 1 || typeof row.name !== "string" ? [] : [row.name]);
		if (nonStrict.length > 0) throw new Error(`Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`);
		return tables.map((row) => {
			if (typeof row.name !== "string") throw new Error("Canonical SQLite schema contains an unnamed table");
			const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
			if (typeof schemaRow?.sql !== "string") throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
			const rowidModel = readTableRowidModel(canonical, row.name, row);
			return {
				columns: readVisibleColumns(canonical, row.name),
				createSql: schemaRow.sql,
				name: row.name,
				rowidAlias: rowidModel.alias,
				rowidStorage: rowidModel.storage,
				usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
			};
		}).toSorted((left, right) => left.name.localeCompare(right.name));
	} finally {
		canonical.close();
	}
}
function rewriteCreateTableName(createSql, replacementName) {
	const openingParen = createSql.indexOf("(");
	if (openingParen === -1) throw new Error("Canonical SQLite table CREATE statement has no column list");
	return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
	return db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')").all().flatMap((row) => {
		if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) return [];
		return [{
			name: row.name,
			sql: row.sql,
			type: row.type
		}];
	}).toSorted((left, right) => {
		const typeOrder = {
			view: 0,
			index: 1,
			trigger: 2
		};
		return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
	});
}
function readAutoincrementHighWater(db, tableName) {
	if (!db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'").get()) return null;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
	if (row === void 0) return null;
	const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
	if (!normalized) throw new Error(`SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`);
	return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
	if (previousHighWater === null) return;
	const currentHighWater = readAutoincrementHighWater(db, tableName);
	const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(tableName, restored);
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
	const current = new Set(currentColumns);
	const canonical = new Set(canonicalColumns);
	const missing = canonicalColumns.filter((column) => !current.has(column));
	const extra = currentColumns.filter((column) => !canonical.has(column));
	if (missing.length === 0 && extra.length === 0) return;
	const details = [missing.length > 0 ? `missing ${missing.join(", ")}` : "", extra.length > 0 ? `extra ${extra.join(", ")}` : ""].filter(Boolean).join("; ");
	throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
	const row = db.prepare("PRAGMA foreign_keys").get();
	return Number(row?.foreign_keys ?? 0) === 1;
}
/**
* Rebuild canonical non-STRICT tables inside the caller's transaction.
* Foreign-key enforcement must be disabled before BEGIN; integrity is checked
* before this function returns so any bad row or relationship rolls back.
*/
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
	if (!db.isTransaction) throw new Error("SQLite STRICT schema migration requires an active transaction");
	const canonicalTables = readCanonicalStrictTables(schemaSql);
	db.exec(schemaSql);
	const currentTableRows = new Map(readMainTableList(db).filter((row) => row.type === "table" && typeof row.name === "string").map((row) => [row.name, row]));
	const tablesToMigrate = canonicalTables.filter((table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1);
	if (tablesToMigrate.length === 0) return { migratedTables: [] };
	if (readForeignKeysEnabled(db)) throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
	const preservedObjects = readPreservedSchemaObjects(db, new Set(tablesToMigrate.map((table) => table.name)));
	for (const object of preservedObjects) if (object.type === "trigger") db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
	for (const object of preservedObjects) if (object.type === "view") db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
	for (const [index, table] of tablesToMigrate.entries()) {
		const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
		if (currentTableRows.has(migrationTable)) throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
		const currentColumns = readVisibleColumns(db, table.name);
		assertMatchingColumns(table.name, currentColumns, table.columns);
		const currentTableRow = currentTableRows.get(table.name);
		if (!currentTableRow) throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
		const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
		if (currentRowidModel.storage !== table.rowidStorage) throw new Error(`SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`);
		const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
		db.exec(rewriteCreateTableName(table.createSql, migrationTable));
		const columns = table.columns.map(quoteSqliteIdentifier);
		if (table.rowidAlias) columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
		const copyColumns = columns.join(", ");
		try {
			db.exec(`INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`);
		} catch (error) {
			throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
		}
		db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
		db.exec(`ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`);
		restoreAutoincrementHighWater(db, table.name, previousHighWater);
	}
	db.exec(schemaSql);
	const findObject = db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1");
	for (const object of preservedObjects) if (!findObject.get(object.type, object.name)) db.exec(object.sql);
	assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
	return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
/** Atomically upgrade Assistant-owned tables described by a canonical STRICT schema. */
function migrateSqliteSchemaToStrict(db, schemaSql, options = {}) {
	if (db.isTransaction) throw new Error("SQLite STRICT schema migration cannot start inside a transaction");
	const foreignKeysWereEnabled = readForeignKeysEnabled(db);
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options), {
			busyTimeoutMs: options.busyTimeoutMs ?? DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS,
			databaseLabel: options.databaseLabel,
			operationLabel: "sqlite.strict-schema-migration"
		});
	} finally {
		if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = ON;");
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-provenance.ts
const MEMORY_INDEX_CHUNK_PROVENANCE_TABLE = "memory_index_chunk_provenance";
const MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`;
const missingChunkIdsSql = `
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`;
function ensureMemoryChunkProvenance(db) {
	const ensure = () => {
		db.exec("DROP TRIGGER IF EXISTS memory_index_chunk_provenance_after_insert");
		db.exec(MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL);
		db.exec(`
      WITH missing AS MATERIALIZED (${missingChunkIdsSql}),
      affected AS MATERIALIZED (
        SELECT chunk.path, chunk.source
        FROM missing
        CROSS JOIN memory_index_chunks AS chunk ON chunk.id = missing.id
      )
      UPDATE memory_index_sources
      SET hash = ''
      WHERE EXISTS (
        SELECT 1
        FROM affected
        WHERE affected.path = memory_index_sources.path
          AND affected.source IS memory_index_sources.source
      );

      WITH missing AS MATERIALIZED (${missingChunkIdsSql})
      INSERT OR IGNORE INTO ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-recall.ts
const MEMORY_INDEX_CHUNKS_TABLE$1 = "memory_index_chunks";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${MEMORY_INDEX_CHUNKS_TABLE$1}(id) ON DELETE CASCADE
  ) STRICT;
`;
function readMemoryChunkColumns(db) {
	const rows = db.prepare(`PRAGMA table_info(${MEMORY_INDEX_CHUNKS_TABLE$1})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function tableExists$1(db, tableName) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(tableName));
}
function legacyRecallMetadataColumns(db) {
	const columns = readMemoryChunkColumns(db);
	return [
		"importance",
		"triggers",
		"project_key"
	].filter((column) => columns.has(column));
}
function hasLegacyMemoryRecallMetadataColumns(db) {
	return legacyRecallMetadataColumns(db).length > 0;
}
function ensureMemoryRecallMetadataSchema(db) {
	if (legacyRecallMetadataColumns(db).length === 0 && tableExists$1(db, "memory_index_chunk_recall_metadata")) return;
	const ensure = () => {
		db.exec(MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL);
		const columns = new Set(legacyRecallMetadataColumns(db));
		if (columns.size === 0) return;
		const importance = columns.has("importance") ? "importance" : "NULL";
		const triggers = columns.has("triggers") ? "triggers" : "NULL";
		const projectKey = columns.has("project_key") ? "project_key" : "NULL";
		db.exec(`
      INSERT INTO ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${importance}, ${triggers}, ${projectKey}
      FROM ${MEMORY_INDEX_CHUNKS_TABLE$1}
      WHERE ${importance} IS NOT NULL
         OR ${triggers} IS NOT NULL
         OR ${projectKey} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);
		for (const column of [
			"project_key",
			"triggers",
			"importance"
		]) if (columns.has(column)) db.exec(`ALTER TABLE ${MEMORY_INDEX_CHUNKS_TABLE$1} DROP COLUMN ${column}`);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-fts.ts
const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
/** Optional canonical triggers owned by the derived path FTS index. */
const MEMORY_PATH_FTS_TRIGGER_DEFINITIONS = [
	{
		name: "memory_index_paths_fts_after_insert",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_insert
      AFTER INSERT ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `
	},
	{
		name: "memory_index_paths_fts_after_update",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_update
      AFTER UPDATE OF id, path, source ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
        WHERE rowid = OLD.id;
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `
	},
	{
		name: "memory_index_paths_fts_after_delete",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_delete
      AFTER DELETE ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
        WHERE rowid = OLD.id;
      END;
    `
	}
];
/** Canonical chunks own the optional body index; every mutation addresses its rowid. */
const MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS = [
	{
		name: "memory_index_chunks_fts_after_insert",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_insert
      AFTER INSERT ON ${MEMORY_INDEX_CHUNKS_TABLE}
      BEGIN
        INSERT INTO ${MEMORY_INDEX_FTS_TABLE} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `
	},
	{
		name: "memory_index_chunks_fts_after_update",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_update
      AFTER UPDATE OF chunk_rowid, text, id, path, source, model, start_line, end_line ON ${MEMORY_INDEX_CHUNKS_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_FTS_TABLE} WHERE rowid = OLD.chunk_rowid;
        INSERT INTO ${MEMORY_INDEX_FTS_TABLE} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `
	},
	{
		name: "memory_index_chunks_fts_after_delete",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_delete
      AFTER DELETE ON ${MEMORY_INDEX_CHUNKS_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_FTS_TABLE} WHERE rowid = OLD.chunk_rowid;
      END;
    `
	}
];
function dropMemoryChunkFtsTriggers(db) {
	for (const trigger of MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS) db.exec(`DROP TRIGGER IF EXISTS main.${trigger.name}`);
}
function ensureMemoryChunkFtsTriggers(db) {
	for (const trigger of MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS) db.exec(trigger.sql);
}
function rebuildMemoryChunkFts(db, ftsTable) {
	db.exec(`
    DELETE FROM ${ftsTable};
    INSERT INTO ${ftsTable} (
      rowid, text, id, path, source, model, start_line, end_line
    )
    SELECT chunk_rowid, text, id, path, source, model, start_line, end_line
    FROM ${MEMORY_INDEX_CHUNKS_TABLE};
  `);
}
/** Drop the canonical source-to-path-FTS maintenance triggers. */
function dropMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(`DROP TRIGGER IF EXISTS main.${trigger.name}`);
}
/** Install the canonical source-to-path-FTS maintenance triggers. */
function ensureMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(trigger.sql);
}
const MEMORY_INDEX_CHUNKS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE} (
    chunk_rowid INTEGER PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'memory',
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    hash TEXT NOT NULL,
    model TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding BLOB NOT NULL,
    updated_at INTEGER NOT NULL
  ) STRICT;
`;
function buildMemoryEmbeddingCacheSchema(table) {
	return `
    CREATE TABLE IF NOT EXISTS ${table} (
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      provider_key TEXT NOT NULL,
      hash TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dims INTEGER,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (provider, model, provider_key, hash)
    ) STRICT;
  `;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-vector.ts
/** Persistent vectors use IEEE-754 binary64 in little-endian order on every host. */
function encodeMemoryEmbedding(embedding) {
	const bytes = new Uint8Array(embedding.length * 8);
	const view = new DataView(bytes.buffer);
	for (let index = 0; index < embedding.length; index += 1) {
		const coordinate = embedding[index];
		if (typeof coordinate !== "number" || !Number.isFinite(coordinate)) throw new Error("Memory embeddings require finite numeric coordinates");
		view.setFloat64(index * 8, coordinate, true);
	}
	return bytes;
}
/** Invalid derived vectors stay unusable; cache and indexing owners repair them. */
function decodeMemoryEmbedding(bytes) {
	if (bytes.byteLength % 8 !== 0) return [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const embedding = [];
	for (let offset = 0; offset < bytes.byteLength; offset += 8) {
		const coordinate = view.getFloat64(offset, true);
		if (!Number.isFinite(coordinate)) return [];
		embedding.push(coordinate);
	}
	return embedding;
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-storage-migration.ts
const LEGACY_CHUNK_SCHEMA = `
  CREATE TABLE IF NOT EXISTS memory_index_chunks (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'memory',
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    hash TEXT NOT NULL,
    model TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  ) STRICT;
`;
function legacyCacheSchema(table) {
	return `CREATE TABLE IF NOT EXISTS ${table} (
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_key TEXT NOT NULL,
    hash TEXT NOT NULL,
    embedding TEXT NOT NULL,
    dims INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (provider, model, provider_key, hash)
  ) STRICT;`;
}
const CHUNK_INDEXES = [
	{
		name: "idx_memory_index_chunks_path_source",
		columns: "path, source"
	},
	{
		name: "idx_memory_index_chunks_path",
		columns: "path"
	},
	{
		name: "idx_memory_index_chunks_source",
		columns: "source"
	}
];
const CHUNK_REVISION_TRIGGERS = [
	"insert",
	"update",
	"delete"
].map((event) => ({
	name: `memory_index_chunks_revision_after_${event}`,
	sql: `CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${event}
    AFTER ${event.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`
}));
const INLINE_RECALL_COLUMNS = [
	["importance", "importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)"],
	["triggers", "triggers TEXT"],
	["project_key", "project_key TEXT"]
];
function storageShape(db, table, chunks) {
	const tableColumns = columns(db, table);
	if (tableColumns.size === 0) return "absent";
	const shape = tableColumns.get("embedding") === "TEXT" ? "legacy" : tableColumns.get("embedding") === "BLOB" ? "binary" : void 0;
	if (!shape || chunks && tableColumns.has("chunk_rowid") !== (shape === "binary")) throw new Error(`Unsupported partial memory storage schema: ${table}`);
	let schema = chunks ? shape === "legacy" ? LEGACY_CHUNK_SCHEMA : MEMORY_INDEX_CHUNKS_SCHEMA_SQL : shape === "legacy" ? legacyCacheSchema(table) : buildMemoryEmbeddingCacheSchema(table);
	if (chunks) {
		const inline = INLINE_RECALL_COLUMNS.filter(([name]) => tableColumns.has(name));
		if (inline.length > 0) schema = schema.replace("updated_at INTEGER NOT NULL", `updated_at INTEGER NOT NULL,\n${inline.map(([, declaration]) => declaration).join(",\n")}`);
	}
	if (shape === "legacy" && db.prepare("SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?").get(table)?.strict === 0) schema = schema.replace(") STRICT;", ");");
	const indexes = chunks ? CHUNK_INDEXES : [{
		name: table === "memory_embedding_cache" ? "idx_memory_embedding_cache_updated_at" : "idx_embedding_cache_updated_at",
		columns: "updated_at"
	}];
	schema += indexes.map((index) => `CREATE INDEX ${index.name} ON ${table}(${index.columns});`).join("\n");
	assertSqliteSchemaContains(db, `memory storage ${table}`, schema, {
		allowCompatibleAdditiveColumns: shape === "binary",
		allowedMissingIndexes: indexes.map((index) => index.name),
		optionalCanonicalTriggerGroups: chunks ? [{
			tableName: table,
			triggers: CHUNK_REVISION_TRIGGERS
		}, ...shape === "binary" ? [{
			tableName: table,
			triggers: MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS
		}] : []] : []
	});
	if (shape === "legacy") assertKnownRebuildDependents(db, table, indexes.map((index) => index.name), chunks ? CHUNK_REVISION_TRIGGERS.map((trigger) => trigger.name) : []);
	return shape;
}
function assertKnownRebuildDependents(db, table, indexes, triggers) {
	const known = /* @__PURE__ */ new Set([...indexes, ...triggers]);
	const dependent = db.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(table, table).find((row) => row.tbl_name !== table || !known.has(String(row.name)));
	if (dependent) throw new Error(`Memory storage migration cannot rebuild unknown ${String(dependent.type)} ${String(dependent.name)} on ${table}`);
	for (const row of db.prepare("SELECT name FROM main.sqlite_schema WHERE type = 'table'").all()) {
		const name = String(row.name);
		const references = db.prepare(`PRAGMA main.foreign_key_list("${name.replaceAll("\"", "\"\"")}")`).all().filter((key) => key.table === table);
		const knownChild = table === "memory_index_chunks" && ["memory_index_chunk_provenance", "memory_index_chunk_recall_metadata"].includes(name);
		if (references.some((key) => !knownChild || key.from !== "chunk_id" || key.to !== "id" || key.on_delete !== "CASCADE" || key.on_update !== "NO ACTION")) throw new Error(`Memory storage migration cannot rebuild ${table} referenced by an unknown foreign key in ${name}`);
	}
}
function storageShapes(db, cacheTable) {
	return {
		chunks: storageShape(db, "memory_index_chunks", true),
		cache: storageShape(db, cacheTable, false)
	};
}
function assertBinaryEmbeddings(db, table) {
	if (db.prepare(`SELECT 1 FROM ${table} WHERE testclaw_memory_embedding_blob_valid(embedding) = 0 LIMIT 1`).get()) throw new Error(`Memory storage migration found invalid binary embeddings in ${table}`);
}
function legacyEmbedding(raw) {
	if (typeof raw !== "string") return;
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every((value) => typeof value === "number" && Number.isFinite(value)) ? parsed : void 0;
	} catch {
		return;
	}
}
/** Only migrations/imports interpret the retired JSON representation. */
function registerMemoryEmbeddingMigrationFunctions(db, renewAuthority) {
	let renewedAt = Number.NEGATIVE_INFINITY;
	const renew = () => {
		if (!renewAuthority) return;
		const now = performance.now();
		if (now - renewedAt >= 1e3) {
			renewAuthority();
			renewedAt = now;
		}
	};
	db.function("testclaw_memory_embedding_from_json", { deterministic: true }, (raw) => {
		renew();
		return encodeMemoryEmbedding(legacyEmbedding(raw) ?? []);
	});
	db.function("testclaw_memory_embedding_json_valid", { deterministic: true }, (raw) => {
		renew();
		return Number(legacyEmbedding(raw) !== void 0);
	});
	db.function("testclaw_memory_embedding_blob_valid", { deterministic: true }, (raw) => {
		renew();
		return Number(raw instanceof Uint8Array && raw.byteLength % 8 === 0 && decodeMemoryEmbedding(raw).length * 8 === raw.byteLength);
	});
}
function existingStorageObjects(db, table) {
	return db.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(table).map((row) => String(row.sql));
}
function columns(db, table) {
	return new Map(db.prepare("SELECT name, type FROM pragma_table_info(?)").all(table).map((row) => [String(row.name), String(row.type).toUpperCase()]));
}
/**
* Convert only memory storage, without provider calls. The agent migration owner
* supplies its admitted transaction with foreign keys disabled before BEGIN.
* Standalone/shadow index owners receive the same atomic conversion here.
*/
function migrateMemoryIndexStorage(db, options = {}) {
	const cacheTable = options.embeddingCacheTable ?? "memory_embedding_cache";
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(cacheTable)) throw new Error("Invalid memory embedding cache table identifier");
	const shapes = storageShapes(db, cacheTable);
	const migrateChunks = shapes.chunks === "legacy";
	const migrateCache = shapes.cache === "legacy";
	if (!migrateChunks && !migrateCache) return;
	const foreignKeys = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) !== 0;
	if (migrateChunks && foreignKeys && db.isTransaction) throw new Error("Memory storage migration requires foreign keys disabled before BEGIN");
	if (migrateChunks && foreignKeys) db.exec("PRAGMA foreign_keys = OFF");
	try {
		runSqliteImmediateTransactionSync(db, () => {
			const current = storageShapes(db, cacheTable);
			if (current.chunks !== shapes.chunks || current.cache !== shapes.cache) throw new Error("Memory storage schema changed before migration admission");
			registerMemoryEmbeddingMigrationFunctions(db, options.renewAuthority);
			const chunkObjects = migrateChunks ? existingStorageObjects(db, "memory_index_chunks") : [];
			const cacheObjects = migrateCache ? existingStorageObjects(db, cacheTable) : [];
			if (current.chunks === "binary") assertBinaryEmbeddings(db, "memory_index_chunks");
			if (current.cache === "binary") assertBinaryEmbeddings(db, cacheTable);
			if (migrateChunks) {
				ensureMemoryRecallMetadataSchema(db);
				db.exec(`
          UPDATE memory_index_sources SET hash = ''
          WHERE (path, source) IN (
            SELECT path, source FROM memory_index_chunks
            WHERE testclaw_memory_embedding_json_valid(embedding) = 0
          );
          INSERT INTO memory_index_meta (key, value)
          SELECT 'memory_vector_rebuild_v1', '1'
          WHERE EXISTS (
            SELECT 1 FROM memory_index_chunks
            WHERE testclaw_memory_embedding_json_valid(embedding) = 0
          )
          ON CONFLICT(key) DO UPDATE SET value = excluded.value;
        `);
				dropMemoryChunkFtsTriggers(db);
				db.exec(MEMORY_INDEX_CHUNKS_SCHEMA_SQL.replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE").replace("memory_index_chunks", "memory_index_chunks_storage_migration"));
				db.exec(`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 testclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks;
          DROP TABLE memory_index_chunks;
          ALTER TABLE memory_index_chunks_storage_migration RENAME TO memory_index_chunks;
        `);
				for (const sql of chunkObjects) db.exec(sql);
				if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("memory_index_chunks_fts")) {
					rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
					ensureMemoryChunkFtsTriggers(db);
				}
			}
			if (migrateCache) {
				const replacement = `${cacheTable}_storage_migration`;
				db.exec(buildMemoryEmbeddingCacheSchema(replacement).replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE"));
				db.exec(`
          INSERT INTO ${replacement} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
          SELECT rowid, provider, model, provider_key, hash,
                 testclaw_memory_embedding_from_json(embedding), dims, updated_at
          FROM ${cacheTable};
          DROP TABLE ${cacheTable};
          ALTER TABLE ${replacement} RENAME TO ${cacheTable};
        `);
				for (const sql of cacheObjects) db.exec(sql);
			}
			if (migrateChunks) {
				for (const table of ["memory_index_chunk_provenance", "memory_index_chunk_recall_metadata"]) if (columns(db, table).size > 0 && db.prepare(`PRAGMA foreign_key_check(${table})`).all().length > 0) throw new Error("Memory storage migration failed foreign key validation");
			}
		});
	} finally {
		if (options.renewAuthority) registerMemoryEmbeddingMigrationFunctions(db);
		if (migrateChunks && foreignKeys) db.exec("PRAGMA foreign_keys = ON");
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.ts
const LEGACY_MEMORY_INDEX_SOURCE_COLUMNS = [
	"path",
	"source",
	"hash",
	"mtime",
	"size"
];
const MEMORY_INDEX_SOURCE_COLUMNS = ["id", ...LEGACY_MEMORY_INDEX_SOURCE_COLUMNS];
const MEMORY_INDEX_SOURCE_COLUMN_TYPES = /* @__PURE__ */ new Map([
	["id", "INTEGER"],
	["path", "TEXT"],
	["source", "TEXT"],
	["hash", "TEXT"],
	["mtime", "REAL"],
	["size", "INTEGER"]
]);
function tableColumnInfo(db, tableName, schema = "main") {
	return db.prepare(`PRAGMA ${schema}.table_xinfo(${tableName})`).all().flatMap((row) => typeof row.name === "string" && typeof row.type === "string" ? [{
		name: row.name,
		type: row.type.toUpperCase(),
		notnull: Number(row.notnull ?? 0),
		pk: Number(row.pk ?? 0),
		defaultValue: typeof row.dflt_value === "string" ? row.dflt_value : null,
		hidden: Number(row.hidden ?? 0)
	}] : []);
}
function tableColumns(db, tableName, schema = "main") {
	return new Set(tableColumnInfo(db, tableName, schema).map((row) => row.name));
}
function tableHasExactColumns(db, tableName, expected, schema = "main") {
	const columns = tableColumns(db, tableName, schema);
	return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function tablePrimaryKeyColumns(db, tableName) {
	return tableColumnInfo(db, tableName).filter((row) => row.pk > 0).toSorted((left, right) => left.pk - right.pk).map((row) => row.name);
}
function tableHasPrimaryKey(db, tableName, expectedColumns) {
	const columns = tablePrimaryKeyColumns(db, tableName);
	return columns.length === expectedColumns.length && columns.every((column, index) => column === expectedColumns[index]);
}
function tableHasUniqueIndex(db, tableName, expectedColumns) {
	const indexes = db.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(tableName);
	if (indexes.length !== 1) return false;
	return indexes.some((index) => {
		if (typeof index.name !== "string" || Number(index.partial ?? 0) !== 0) return false;
		const columns = db.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(index.name).filter((row) => Number(row.key ?? 0) === 1);
		return columns.length === expectedColumns.length && columns.every((column, columnIndex) => Number(column.cid ?? -1) >= 0 && column.name === expectedColumns[columnIndex] && column.coll === "BINARY" && Number(column.sort_desc ?? 0) === 0);
	});
}
function tableHasNoDeclaredCollations(db, tableName) {
	const row = db.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(tableName);
	return typeof row?.sql === "string" && !/\bCOLLATE\b/iu.test(row.sql);
}
function tableHasCanonicalSourceColumnTypes(db) {
	return tableColumnInfo(db, MEMORY_INDEX_SOURCES_TABLE).every((column) => {
		const expectedType = MEMORY_INDEX_SOURCE_COLUMN_TYPES.get(column.name);
		const expectedDefault = column.name === "source" ? "'memory'" : null;
		if (column.type !== expectedType && !(column.name === "mtime" && column.type === "INTEGER") || column.defaultValue !== expectedDefault || column.hidden !== 0) return false;
		return true;
	});
}
function tableHasCanonicalSourceColumns(db) {
	return tableHasCanonicalSourceColumnTypes(db) && tableColumnInfo(db, "memory_index_sources").every((column) => {
		return column.name === "id" || column.notnull === 1;
	});
}
function tableHasLegacySourceColumns(db, hasPathPrimaryKey) {
	return tableHasCanonicalSourceColumnTypes(db) && tableColumnInfo(db, "memory_index_sources").every((column) => {
		return hasPathPrimaryKey && column.name === "path" || column.notnull === 1;
	});
}
function tableHasIntegerRowIdPrimaryKey(db) {
	if (tableColumnInfo(db, "memory_index_sources").find((column) => column.name === "id")?.type !== "INTEGER" || !tableHasPrimaryKey(db, "memory_index_sources", ["id"])) return false;
	return db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(MEMORY_INDEX_SOURCES_TABLE)?.found !== 1;
}
function tableExists(db, tableName) {
	return db.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(tableName)?.found === 1;
}
/** Upgrade canonical memory sources to stable integer identities. */
function migrateMemoryIndexSourcesIdentity(db) {
	if (!tableExists(db, "memory_index_sources")) return;
	if (tableHasExactColumns(db, "memory_index_sources", MEMORY_INDEX_SOURCE_COLUMNS)) {
		if (tableHasCanonicalSourceColumns(db) && tableHasIntegerRowIdPrimaryKey(db) && tableHasNoDeclaredCollations(db, "memory_index_sources") && tableHasUniqueIndex(db, "memory_index_sources", ["path", "source"])) return;
		throw new Error("canonical memory source identity schema is invalid");
	}
	if (!tableHasExactColumns(db, "memory_index_sources", LEGACY_MEMORY_INDEX_SOURCE_COLUMNS)) throw new Error("canonical memory source identity schema is invalid");
	const hasPathPrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path"]);
	const hasPathSourcePrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path", "source"]);
	if (!hasPathPrimaryKey && !hasPathSourcePrimaryKey) throw new Error("canonical memory source identity schema is invalid");
	if (!tableHasLegacySourceColumns(db, hasPathPrimaryKey)) throw new Error("canonical memory source identity schema is invalid");
	const rebuildsPathFts = tableExists(db, MEMORY_INDEX_PATHS_FTS_TABLE);
	db.exec("SAVEPOINT migrate_memory_index_sources_identity");
	try {
		dropMemoryPathFtsTriggers(db);
		db.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${MEMORY_INDEX_SOURCES_TABLE}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${MEMORY_INDEX_SOURCES_TABLE} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${MEMORY_INDEX_SOURCES_TABLE} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `);
		if (rebuildsPathFts) {
			db.exec(`
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE};
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        SELECT id, path, source FROM ${MEMORY_INDEX_SOURCES_TABLE};
      `);
			ensureMemoryPathFtsTriggers(db);
		}
		db.exec("RELEASE migrate_memory_index_sources_identity");
	} catch (err) {
		db.exec("ROLLBACK TO migrate_memory_index_sources_identity");
		db.exec("RELEASE migrate_memory_index_sources_identity");
		throw err;
	}
}
//#endregion
//#region src/state/testclaw-agent-schema.ts
const TESTCLAW_AGENT_SCHEMA_SQL = process.getBuiltinModule("node:fs").readFileSync(fileURLToPath(new URL("./testclaw-agent-schema.sql", import.meta.url)), "utf8");
//#endregion
//#region src/state/testclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
const ENSURED_DATABASES$2 = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive context-engine turn outbox on first use. */
function ensureContextEngineTurnOutboxSchema(db) {
	if (ENSURED_DATABASES$2.has(db)) return;
	const ensure = () => {
		db.exec(extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
			includeEndMarker: false,
			errorMessage: "Assistant context-engine turn outbox schema markers are missing."
		}));
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
	ENSURED_DATABASES$2.add(db);
}
//#endregion
//#region src/state/testclaw-agent-db-additive-columns.ts
const SESSION_OWNER_COLUMN_DEFINITIONS = [
	{
		columnName: "owner_actor_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_actor_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_at",
		dataType: "INTEGER",
		tableName: "session_nodes"
	}
];
const LEGACY_ACP_MIGRATION_COLUMN_DEFINITION = {
	columnName: "legacy_acp_migration_json",
	dataType: "TEXT",
	tableName: "session_nodes"
};
const CANONICAL_READY_COLUMN_DEFINITION = {
	columnName: "canonical_ready",
	dataType: "TEXT",
	tableName: "session_key_contract"
};
const FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	...SESSION_OWNER_COLUMN_DEFINITIONS,
	LEGACY_ACP_MIGRATION_COLUMN_DEFINITION,
	CANONICAL_READY_COLUMN_DEFINITION
];
//#endregion
//#region src/state/testclaw-agent-db-contract.ts
const TESTCLAW_AGENT_SCHEMA_VERSION = 23;
const SESSION_PARTICIPANTS_TABLE = "session_participants";
//#endregion
//#region src/state/testclaw-agent-goal-operations-schema.ts
const SESSION_GOAL_OPERATIONS_TABLE = "session_goal_operations";
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
/** First typed Goal use installs the additive receipt table, without a version bump. */
function ensureSessionGoalOperationsSchema(db) {
	if (ensuredDatabases.has(db)) return;
	const schema = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, SESSION_GOAL_OPERATIONS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS transcript_events (",
		includeEndMarker: false,
		errorMessage: "Assistant Goal operation schema markers are missing."
	});
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(schema);
	});
	ensuredDatabases.add(db);
}
//#endregion
//#region src/state/testclaw-agent-message-tool-outcome-schema.ts
const MESSAGE_TOOL_RUN_OUTCOMES_TABLE = "message_tool_run_outcomes";
const ENSURED_DATABASES$1 = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive outcome table on first use. */
function ensureMessageToolRunOutcomeSchema(db) {
	if (ENSURED_DATABASES$1.has(db)) return;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, MESSAGE_TOOL_RUN_OUTCOMES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS session_goal_operations (",
			includeEndMarker: false,
			errorMessage: "Assistant message-tool run outcome schema markers are missing."
		}));
	});
	ENSURED_DATABASES$1.add(db);
}
//#endregion
//#region src/state/testclaw-agent-pending-inputs-schema.ts
const SESSION_PENDING_INPUTS_TABLE = "session_pending_inputs";
const SESSION_INPUT_COMPLETIONS_TABLE = "session_input_completions";
const presentDatabases = /* @__PURE__ */ new WeakSet();
const completeDatabases = /* @__PURE__ */ new WeakSet();
const completionDatabases = /* @__PURE__ */ new WeakSet();
let absentDatabases = /* @__PURE__ */ new WeakSet();
/** Cache feature-table presence per connection; first use invalidates earlier absence checks. */
function hasSessionPendingInputsSchema(db) {
	if (presentDatabases.has(db)) return true;
	if (!db.isTransaction && absentDatabases.has(db)) return false;
	const present = Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(SESSION_PENDING_INPUTS_TABLE));
	if (!db.isTransaction) (present ? presentDatabases : absentDatabases).add(db);
	return present;
}
/** Lazily installs accepted-input custody without changing either schema version marker. */
function ensureSessionPendingInputsSchema(db) {
	if (completeDatabases.has(db)) return;
	const start = TESTCLAW_AGENT_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${SESSION_PENDING_INPUTS_TABLE} (`);
	if (start < 0) throw new Error("Assistant pending-input schema marker is missing.");
	const nested = db.isTransaction;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(TESTCLAW_AGENT_SCHEMA_SQL.slice(start, TESTCLAW_AGENT_SCHEMA_SQL.indexOf("-- Processing completion")));
		ensureColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id TEXT");
	});
	absentDatabases = /* @__PURE__ */ new WeakSet();
	if (!nested) {
		presentDatabases.add(db);
		completeDatabases.add(db);
	}
}
/** Completion tracking is opt-in; ordinary input admission does not create this table. */
function ensureSessionInputCompletionsSchema(db) {
	if (completionDatabases.has(db)) return;
	const start = TESTCLAW_AGENT_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS session_input_completions (");
	if (start < 0) throw new Error("Assistant input-completion schema marker is missing.");
	const nested = db.isTransaction;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(TESTCLAW_AGENT_SCHEMA_SQL.slice(start));
	});
	if (!nested) completionDatabases.add(db);
}
/** Existing same-version stores converge through Doctor/open; absent tables stay feature-local. */
function hasPendingInputConsumptionColumnMigration(db) {
	return hasSessionPendingInputsSchema(db) && !tableHasColumn(db, "session_pending_inputs", "consumed_event_id");
}
function ensurePendingInputConsumptionColumn(db) {
	ensureColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id TEXT");
}
/** Read-only callers can inspect pre-feature stores without installing schema. */
function hasPendingInputConsumptionColumn(db) {
	if (completeDatabases.has(db)) return true;
	const present = tableHasColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id");
	if (present && !db.isTransaction) completeDatabases.add(db);
	return present;
}
//#endregion
//#region src/state/testclaw-agent-board-schema.ts
const BOARD_WIDGETS_SCHEMA_START = "CREATE TABLE IF NOT EXISTS board_widgets (";
const BOARD_WIDGETS_MIGRATION_TABLE = "board_widgets_plugin_kind_migration_new";
const PLUGIN_CONTENT_KIND_CLAUSE_PATTERN = /content_kind\s+IN\s*\(\s*'html'\s*,\s*'mcp-app'\s*,\s*'plugin'\s*\)/iu;
const PLUGIN_PAYLOAD_BRANCH_PATTERN = /\s+OR\s+\(content_kind\s*=\s*'plugin'\s+AND\s+html\s+IS\s+NULL\s+AND\s+descriptor_json\s+IS\s+NOT\s+NULL\s+AND\s+view_generation\s+IS\s+NULL\)/iu;
const TESTCLAW_AGENT_BOARD_SCHEMA_SQL = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, "board_tabs", {
	endMarker: "CREATE TABLE IF NOT EXISTS session_progress_cards (",
	includeEndMarker: false,
	errorMessage: "Assistant agent board schema markers are missing from the canonical schema."
});
const AGENT_V14_BOARD_SCHEMA_SQL = TESTCLAW_AGENT_BOARD_SCHEMA_SQL;
const TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL = TESTCLAW_AGENT_SCHEMA_SQL.replace(TESTCLAW_AGENT_BOARD_SCHEMA_SQL, "");
function canonicalBoardWidgetsCreateSql() {
	return extractSqliteTableSchema(TESTCLAW_AGENT_BOARD_SCHEMA_SQL, "board_widgets", {
		endMarker: "CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position",
		includeEndMarker: false,
		errorMessage: "Assistant agent board widget schema markers are missing."
	}).trim();
}
function legacyBoardWidgetsCreateSql() {
	const canonical = canonicalBoardWidgetsCreateSql();
	const legacy = canonical.replace(PLUGIN_CONTENT_KIND_CLAUSE_PATTERN, "content_kind IN ('html', 'mcp-app')").replace(PLUGIN_PAYLOAD_BRANCH_PATTERN, "");
	if (legacy === canonical) throw new Error("Assistant agent board widget legacy schema derivation failed.");
	return legacy;
}
function normalizeBoardWidgetsCreateSql(sql) {
	return sql.replace(/^CREATE TABLE(?: IF NOT EXISTS)?\s+(?:board_widgets|"board_widgets"|`board_widgets`|\[board_widgets\])\s*\(/iu, "CREATE TABLE board_widgets (").replace(/\s+/gu, " ").replace(/;\s*$/u, "").trim();
}
/** Repair the v14 board constraint inside the caller's schema/write transaction. */
function ensureAssistantAgentBoardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("board schema ensure requires an active transaction");
	db.exec(TESTCLAW_AGENT_BOARD_SCHEMA_SQL);
	const row = db.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'board_widgets'").get();
	if (typeof row?.sql !== "string") throw new Error("Assistant agent board widget schema is missing after ensure.");
	const normalizedSchema = normalizeBoardWidgetsCreateSql(row.sql);
	if (normalizedSchema === normalizeBoardWidgetsCreateSql(canonicalBoardWidgetsCreateSql())) return;
	if (normalizedSchema !== normalizeBoardWidgetsCreateSql(legacyBoardWidgetsCreateSql())) throw new Error("Assistant agent board widget schema has an unsupported content-kind constraint.");
	if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(BOARD_WIDGETS_MIGRATION_TABLE)) throw new Error(`Assistant agent board migration table already exists: ${BOARD_WIDGETS_MIGRATION_TABLE}`);
	const migrationCreateSql = canonicalBoardWidgetsCreateSql().replace(BOARD_WIDGETS_SCHEMA_START, `CREATE TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} (`);
	db.exec(`
    ${migrationCreateSql}
    INSERT INTO ${BOARD_WIDGETS_MIGRATION_TABLE} (
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    )
    SELECT
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    FROM board_widgets;
    DROP TABLE board_widgets;
    ALTER TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} RENAME TO board_widgets;
  `);
	db.exec(TESTCLAW_AGENT_BOARD_SCHEMA_SQL);
}
//#endregion
//#region src/state/testclaw-agent-progress-card-schema.ts
const SESSION_PROGRESS_CARDS_TABLE = "session_progress_cards";
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, SESSION_PROGRESS_CARDS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "Assistant agent progress-card schema markers are missing."
});
const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL = TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
/** Ensure the additive progress-card table inside the caller's write transaction. */
function ensureAssistantAgentProgressCardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("progress-card schema ensure requires an active transaction");
	db.exec(AGENT_PROGRESS_CARD_SCHEMA_SQL);
}
//#endregion
//#region src/state/testclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE = "session_transcript_archives";
const ENSURED_DATABASES = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive canonical archive owner on first archive use. */
function ensureSessionTranscriptArchiveSchema(db) {
	if (ENSURED_DATABASES.has(db)) return;
	const ensure = () => {
		db.exec(extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, SESSION_TRANSCRIPT_ARCHIVES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (",
			includeEndMarker: false,
			errorMessage: "Assistant session transcript archive schema markers are missing."
		}));
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
	ENSURED_DATABASES.add(db);
}
//#endregion
//#region src/state/testclaw-agent-db-schema-compatibility.ts
const AGENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: [
		"memory_entry_origins",
		"memory_session_tombstones",
		MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,
		MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,
		CONTEXT_ENGINE_TURN_OUTBOX_TABLE,
		MESSAGE_TOOL_RUN_OUTCOMES_TABLE,
		SESSION_GOAL_OPERATIONS_TABLE,
		SESSION_PENDING_INPUTS_TABLE,
		SESSION_INPUT_COMPLETIONS_TABLE,
		SESSION_PARTICIPANTS_TABLE,
		SESSION_PROGRESS_CARDS_TABLE,
		SESSION_TRANSCRIPT_ARCHIVES_TABLE,
		"standing_intents",
		"standing_intents_fts",
		...[
			"standing_intents_fts_config",
			"standing_intents_fts_data",
			"standing_intents_fts_docsize",
			"standing_intents_fts_idx"
		]
	],
	allowedMissingColumns: [
		"session_pending_inputs.consumed_event_id",
		"session_transcript_active_events.context_eligible",
		"session_conversations.route_context_json",
		"standing_intents.creator_sender",
		...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`)
	],
	allowedColumnDefinitions: { "conversations.delivery_target": ["delivery_target TEXT NOT NULL DEFAULT ''"] },
	allowedMissingIndexes: [
		"idx_agent_transcript_context_pending",
		"idx_agent_session_nodes_label",
		"idx_agent_session_nodes_entry_not_valid"
	],
	optionalCanonicalTriggerGroups: [{
		tableName: "memory_index_chunks",
		triggers: MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS
	}, {
		tableName: MEMORY_INDEX_SOURCES_TABLE,
		triggers: MEMORY_PATH_FTS_TRIGGER_DEFINITIONS
	}]
};
//#endregion
//#region src/state/testclaw-agent-db-read-error.ts
/** Record schema-owner facts after a failed query or admission, never infer them from error prose. */
function classifyAssistantAgentDatabaseReadError(db, error) {
	try {
		const missingTables = collectSqliteSchemaIssues(db, TESTCLAW_AGENT_SCHEMA_SQL, AGENT_SCHEMA_COMPATIBILITY).filter((issue) => issue.code === "missing-table").map((issue) => issue.objectName);
		return missingTables.length > 0 ? new SessionMetadataUnavailableError("table-missing", { cause: error }, missingTables) : error;
	} catch {
		return error;
	}
}
//#endregion
//#region src/state/testclaw-agent-canonical-validation-schema.ts
const definitionsSql = `SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`;
const validatedSchemas = resolveGlobalSingleton(Symbol.for("testclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
function readDefinitions(database) {
	const definitions = /* @__PURE__ */ new Map();
	const rows = database.prepare(definitionsSql).all();
	for (const row of rows) {
		if (typeof row.name !== "string" || typeof row.sql !== "string") throw new Error("Session canonical validation schema has an unreadable definition");
		definitions.set(row.name, normalizeSchemaSql(row.sql));
	}
	return definitions;
}
function expectedDefinitions() {
	return resolveGlobalSingleton(Symbol.for("testclaw.agentCanonicalValidationSchemaDefinitions"), () => {
		const database = openNodeSqliteDatabase(":memory:");
		try {
			database.exec([
				extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, "session_nodes"),
				extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, "session_windows"),
				extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, "session_key_contract", {
					endMarker: "CREATE TABLE IF NOT EXISTS session_windows (",
					includeEndMarker: false
				}),
				canonicalSessionValidationSchemaSql()
			].join("\n"));
			return readDefinitions(database);
		} finally {
			database.close();
		}
	});
}
/** Require the exact invalidation group before an empty pending set can certify readiness. */
function assertCanonicalSessionValidationSchema(database) {
	const cookie = readSqliteSchemaCookie(database);
	if (typeof cookie !== "number") throw new Error("Session canonical validation schema version is unavailable");
	const cached = validatedSchemas.get(database);
	if (cached?.cookie === cookie) return;
	cached?.unregister();
	validatedSchemas.delete(database);
	const expected = expectedDefinitions();
	const actual = readDefinitions(database);
	for (const name of /* @__PURE__ */ new Set([...expected.keys(), ...actual.keys()])) if (expected.get(name) !== actual.get(name)) throw classifyAssistantAgentDatabaseReadError(database, /* @__PURE__ */ new Error(`Session canonical validation schema is missing or drifted: ${name}; run testclaw doctor --fix with the compatible build.`));
	if (readSqliteSchemaCookie(database) !== cookie) throw new Error("Session canonical validation schema changed during admission; retry the read");
	if (!database.isTransaction) {
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			validatedSchemas.delete(database);
			unregister();
		});
		validatedSchemas.set(database, {
			cookie,
			unregister
		});
	}
}
/** The schema owner installs this complete group before seeding pending keys. */
function canonicalSessionValidationSchemaSql(schema = TESTCLAW_AGENT_SCHEMA_SQL) {
	return extractSqliteTableSchema(schema, "session_canonical_validation_pending", {
		endMarker: "CREATE TABLE IF NOT EXISTS conversations (",
		includeEndMarker: false
	});
}
/** Historical migration preflights cannot require the schema-21 validation projection. */
function withoutCanonicalSessionValidationSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (")) return schema;
	return schema.replace(canonicalSessionValidationSchemaSql(schema), "");
}
//#endregion
//#region src/state/testclaw-agent-db-identity.ts
const identities = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Prepare physical and connection identity once at open; cached aliases are not resolved again. */
function registerAssistantAgentDatabaseIdentity(db) {
	const filename = db.location() ?? "";
	const file = filename ? statSync(filename, { bigint: true }) : void 0;
	const identity = file ? `${file.dev}:${file.ino}` : Symbol("incognito-agent-database");
	identities.set(db, {
		identity,
		birthtime: file?.birthtimeNs.toString(),
		incarnation: randomUUID(),
		filename
	});
}
/** Reuse facts captured at open; aliases must never be resolved again at a handoff. */
function readAssistantAgentDatabaseIdentity(database) {
	const prepared = findAssistantAgentDatabaseIdentity(database);
	if (prepared === void 0) throw new Error("Assistant agent database identity was not prepared at open");
	return prepared;
}
/** Raw diagnostic connections have no admitted physical identity. */
function findAssistantAgentDatabaseIdentity(database) {
	return identities.get(database.db);
}
/** A retained connection can outlive its pathname or be deserialized away from that file. */
function isAssistantAgentDatabasePathCurrent(database) {
	if (!database.db.isOpen) return false;
	const { identity, filename } = readAssistantAgentDatabaseIdentity(database);
	if (typeof identity === "symbol") return true;
	if (database.db.location() !== filename) return false;
	const current = statSync(database.path, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && identity === `${current.dev}:${current.ino}`;
}
function createAssistantAgentDatabaseClaim(database, release) {
	let released = false;
	const isCurrent = () => !released && database.db.isOpen;
	const { identity, incarnation } = readAssistantAgentDatabaseIdentity(database);
	return {
		identity,
		incarnation,
		isCurrent,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("Assistant agent database claim is no longer current");
		},
		release: () => {
			if (!released) {
				released = true;
				release();
			}
		}
	};
}
//#endregion
//#region src/state/testclaw-agent-canonical-validation-receipt.ts
const receiptSchemas = /* @__PURE__ */ new WeakSet();
function hasReceiptColumn(db) {
	if (receiptSchemas.has(db)) return true;
	const { tableName, columnName } = CANONICAL_READY_COLUMN_DEFINITION;
	const present = tableHasColumn(db, tableName, columnName);
	if (present && !db.isTransaction) receiptSchemas.add(db);
	return present;
}
function physicalReceipt(database) {
	const physical = findAssistantAgentDatabaseIdentity(database);
	if (!physical || typeof physical.identity !== "string" || !isAssistantAgentDatabasePathCurrent({
		...database,
		path: physical.filename
	})) return;
	return JSON.stringify([
		1,
		database.agentId,
		physical.identity,
		physical.birthtime
	]);
}
/** Canonical proof follows this file generation; it never certifies physical integrity. */
function hasPersistedAssistantAgentCanonicalValidation(database) {
	const receipt = physicalReceipt(database);
	if (!receipt || !hasReceiptColumn(database.db)) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("canonical_ready").where("id", "=", 1))?.canonical_ready === receipt;
}
//#endregion
//#region src/state/testclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearAssistantAgentDatabaseValidationCache());
const validationBindings = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function bindValidationLifetime(database, validation) {
	const current = validationBindings.get(database.db);
	if (!database.db.isOpen || current?.validation === validation) return;
	current?.unregister();
	const unregister = registerNodeSqliteDisposeCallback(database.db, (reason) => {
		if (reason === "replace") Atomics.store(new Int32Array(validation.valid), 0, 0);
		validationBindings.delete(database.db);
		unregister();
	});
	validationBindings.set(database.db, {
		validation,
		unregister
	});
}
function matchesValidation(database, validation) {
	return validation.agentId === database.agentId && validation.identity === findAssistantAgentDatabaseIdentity(database)?.identity && Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function hasRevokedValidation(pathname) {
	const previous = validatedPaths.get(path.resolve(pathname));
	return previous?.revoked === true || previous?.validation !== void 0 && Atomics.load(new Int32Array(previous.validation.valid), 0) !== 1;
}
function getAssistantAgentDatabaseValidation(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || !matchesValidation(database, entry.validation)) return;
	const validation = entry.validation;
	bindValidationLifetime(database, validation);
	return validation;
}
/** The receiving opener must adopt this proof against its own physical file identity. */
function getAssistantAgentDatabaseValidationForTransfer(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || entry.validation.agentId !== database.agentId || Atomics.load(new Int32Array(entry.validation.valid), 0) !== 1) return;
	return entry.validation;
}
/** Native admission supplies the checked file identity; no host SQLite handle is needed. */
function captureAssistantAgentDatabaseValidationTransfer(database) {
	const pathname = path.resolve(database.path);
	const existing = validatedPaths.get(pathname);
	const captured = existing?.agentId === database.agentId ? existing : {
		...existing,
		agentId: database.agentId,
		integrityVerified: existing?.integrityVerified ?? false
	};
	validatedPaths.set(pathname, captured);
	const capturedValidation = captured.validation;
	const wasValid = capturedValidation ? Atomics.load(new Int32Array(capturedValidation.valid), 0) : void 0;
	return (identity, received) => {
		if (validatedPaths.get(pathname) !== captured || capturedValidation && wasValid === 1 && Atomics.load(new Int32Array(capturedValidation.valid), 0) !== 1 || !isRecord(received) || received.agentId !== database.agentId || received.identity !== identity || !(received.valid instanceof SharedArrayBuffer) || received.valid.byteLength !== Int32Array.BYTES_PER_ELEMENT || Atomics.load(new Int32Array(received.valid), 0) !== 1 || !(received.canonicalReady instanceof SharedArrayBuffer) || received.canonicalReady.byteLength !== Int32Array.BYTES_PER_ELEMENT) return false;
		if (wasValid === 1 && captured.integrityVerified && captured.validation?.agentId === database.agentId && captured.validation?.identity === identity) return true;
		const validation = {
			agentId: database.agentId,
			identity,
			valid: received.valid,
			canonicalReady: received.canonicalReady
		};
		if (hasRevokedValidation(pathname)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
		invalidateAssistantAgentDatabaseValidation(pathname);
		validatedPaths.set(pathname, {
			validation,
			integrityVerified: true
		});
		return true;
	};
}
function canonicalValidationReceipt(database) {
	if (!database.db.isOpen || !findAssistantAgentDatabaseIdentity(database)) return;
	const pathname = database.path ?? database.db.location();
	if (!pathname) return;
	const validation = validatedPaths.get(path.resolve(pathname))?.validation;
	if (!validation || !matchesValidation({
		...database,
		path: pathname
	}, validation)) return;
	bindValidationLifetime({
		...database,
		path: pathname
	}, validation);
	return validation;
}
/** A clean pending table needs proof from this admitted physical generation. */
function hasAssistantAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (validation) return Atomics.load(new Int32Array(validation.canonicalReady), 0) === 1 && Atomics.load(new Int32Array(validation.valid), 0) === 1;
	const pathname = database.path ?? findAssistantAgentDatabaseIdentity(database)?.filename;
	if (!pathname || database.db.isTransaction || validatedPaths.get(path.resolve(pathname))?.validation !== void 0 || hasRevokedValidation(pathname) || !hasPersistedAssistantAgentCanonicalValidation(database)) return false;
	const canonical = createValidationReceipt({
		...database,
		path: pathname
	}, true);
	validatedPaths.set(path.resolve(pathname), {
		validation: canonical,
		integrityVerified: false
	});
	bindValidationLifetime({
		...database,
		path: pathname
	}, canonical);
	return true;
}
/** Publish successful canonical proof only when its outer transaction has committed. */
function markAssistantAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (!validation) return false;
	const publish = () => {
		if (Atomics.load(new Int32Array(validation.valid), 0) === 1) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	};
	if (database.db.isTransaction) return stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	});
	publish();
	return Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function adoptAssistantAgentDatabaseValidation(database, validation) {
	if (!matchesValidation(database, validation)) return false;
	if (getAssistantAgentDatabaseValidation(database)) return true;
	if (hasRevokedValidation(database.path)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
	invalidateAssistantAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return true;
}
function isAssistantAgentCanonicalStoreEmpty(database) {
	if (database.db.isTransaction || readSqliteUserVersion(database.db) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return database.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated === 0;
}
function createValidationReceipt(database, canonicalReady) {
	const { identity } = readAssistantAgentDatabaseIdentity(database);
	if (typeof identity !== "string") throw new Error("Only persistent agent databases retain integrity validation");
	const validation = {
		agentId: database.agentId,
		identity,
		valid: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
		canonicalReady: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	if (canonicalReady) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	Atomics.store(new Int32Array(validation.valid), 0, 1);
	return validation;
}
function setAssistantAgentDatabaseValidation(database) {
	const revoked = hasRevokedValidation(database.path);
	const validation = createValidationReceipt(database, isAssistantAgentCanonicalStoreEmpty(database) || !revoked && !database.db.isTransaction && hasPersistedAssistantAgentCanonicalValidation(database));
	invalidateAssistantAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return validation;
}
function invalidateAssistantAgentDatabaseValidation(pathname, identity = validatedPaths.get(path.resolve(pathname))?.validation?.identity) {
	const resolved = path.resolve(pathname);
	const paths = /* @__PURE__ */ new Set([resolved]);
	if (identity) {
		for (const [candidate, entry] of validatedPaths) if (entry.validation?.identity === identity) paths.add(candidate);
	}
	for (const candidate of paths) {
		const entry = validatedPaths.get(candidate);
		const validation = entry?.validation;
		if (validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
		validatedPaths.set(candidate, {
			agentId: entry?.agentId,
			validation,
			integrityVerified: false,
			revoked: true
		});
	}
}
function invalidateAssistantAgentDatabaseValidationsForAgent(agentId, removedPaths) {
	for (const pathname of removedPaths) invalidateAssistantAgentDatabaseValidation(pathname);
	for (const [pathname, entry] of validatedPaths) if (entry.validation?.agentId === agentId || entry.agentId === agentId) invalidateAssistantAgentDatabaseValidation(pathname);
}
function clearAssistantAgentDatabaseValidationCache(rootPath) {
	for (const pathname of validatedPaths.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) {
		invalidateAssistantAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
//#region src/state/testclaw-quarantine-store.ts
const TESTCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const TESTCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const TESTCLAW_QUARANTINE_DIR_MODE = 448;
const TESTCLAW_QUARANTINE_FILE_MODE = 384;
function resolveAgentIntegrityPath(pathname) {
	try {
		return realpathSync.native(pathname);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return path.resolve(pathname);
	}
}
/** The lease owner consumes this receipt under the shared writer admission. */
function readAssistantAgentIntegrityVerification(pathname, env = process.env, consume = false) {
	const read = (database) => {
		const query = getNodeSqliteKysely(database);
		const row = executeSqliteQueryTakeFirstSync(database, query.selectFrom("agent_integrity_verifications").selectAll().where("path", "=", resolveAgentIntegrityPath(pathname)));
		if (consume) {
			const current = statSync(pathname, {
				bigint: true,
				throwIfNoEntry: false
			});
			executeSqliteQuerySync(database, query.updateTable("agent_integrity_verifications").set({ clean_close: 0 }).where((eb) => eb.or([eb("path", "=", resolveAgentIntegrityPath(pathname)), ...current ? [eb.and([eb("dev", "=", String(current.dev)), eb("ino", "=", String(current.ino))])] : []])));
		}
		return row;
	};
	if (consume) return withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => read(database)));
	const storePath = resolveQuarantineStorePath(env);
	if (!existsSync(storePath)) return;
	let database;
	try {
		database = openNodeSqliteDatabase(storePath, { readOnly: true });
		return read(database);
	} catch {
		return;
	} finally {
		database?.close();
	}
}
function canReuseAssistantAgentIntegrityVerification(pathname, record, migrationPending) {
	if (migrationPending || !record || record.clean_close !== 1 || record.app_version !== VERSION || record.path !== resolveAgentIntegrityPath(pathname)) return false;
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && record.dev === String(current.dev) && record.ino === String(current.ino);
}
/** Record the lease owner's full check without certifying a clean close. */
function recordAssistantAgentIntegrityVerification(pathname, env, identity) {
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!current || identity !== `${current.dev}:${current.ino}`) return;
	const dev = String(current.dev);
	const ino = String(current.ino);
	withQuarantineWriter(env, (database) => {
		const query = getNodeSqliteKysely(database);
		executeSqliteQuerySync(database, query.insertInto("agent_integrity_verifications").values({
			path: resolveAgentIntegrityPath(pathname),
			dev,
			ino,
			app_version: VERSION,
			verified_at: Date.now(),
			clean_close: 0
		}).onConflict((conflict) => conflict.column("path").doUpdateSet({
			dev,
			ino,
			app_version: VERSION,
			verified_at: Date.now(),
			clean_close: 0
		})));
	});
}
/** Unclean disposal removes the proof that any surviving last closer could certify. */
function clearAssistantAgentIntegrityVerification(pathname, env = process.env, runtimeProof = "revoke") {
	if (runtimeProof === "revoke") invalidateAssistantAgentDatabaseValidation(pathname);
	withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => deleteAgentIntegrityVerification(database, pathname, runtimeProof)));
}
function deleteAgentIntegrityVerification(database, pathname, runtimeProof = "revoke") {
	const query = getNodeSqliteKysely(database);
	const stored = executeSqliteQueryTakeFirstSync(database, query.selectFrom("agent_integrity_verifications").select(["dev", "ino"]).where("path", "=", resolveAgentIntegrityPath(pathname)));
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (runtimeProof === "revoke") {
		for (const file of [stored, current]) if (file) invalidateAssistantAgentDatabaseValidation(pathname, `${file.dev}:${file.ino}`);
	}
	executeSqliteQuerySync(database, query.deleteFrom("agent_integrity_verifications").where((eb) => eb.or([eb("path", "=", resolveAgentIntegrityPath(pathname)), ...[stored, current].flatMap((file) => file ? [eb.and([eb("dev", "=", String(file.dev)), eb("ino", "=", String(file.ino))])] : [])])));
}
/** Only the last graceful lease release may publish cleanliness. */
function markAssistantAgentIntegrityClean(pathname, env, identity) {
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!current || identity !== `${current.dev}:${current.ino}`) return;
	withQuarantineWriter(env, (database) => {
		const query = getNodeSqliteKysely(database);
		executeSqliteQuerySync(database, query.updateTable("agent_integrity_verifications").set({ clean_close: 1 }).where("path", "=", resolveAgentIntegrityPath(pathname)).where("dev", "=", String(current.dev)).where("ino", "=", String(current.ino)).where("app_version", "=", VERSION));
	});
}
function createAssistantDatabaseVerificationError(kind, pathname, storedError) {
	const error = /* @__PURE__ */ new Error(`Assistant ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run testclaw doctor --fix to clear the quarantine. See ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteIntegrityError";
	return error;
}
function resolveQuarantineStorePath(env) {
	return path.join(resolveAssistantStateSqliteDir(env), "testclaw-quarantine.sqlite");
}
function ensureQuarantineStoreDirectory(storePath) {
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: TESTCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, TESTCLAW_QUARANTINE_DIR_MODE);
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA busy_timeout = ${TESTCLAW_QUARANTINE_BUSY_TIMEOUT_MS};
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion > TESTCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`Assistant quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion === TESTCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) {
		database.exec(`
      BEGIN IMMEDIATE;
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${TESTCLAW_QUARANTINE_SCHEMA_VERSION};
      COMMIT;
    `);
		return;
	}
	database.exec(`
    BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${TESTCLAW_QUARANTINE_SCHEMA_VERSION};
    COMMIT;
  `);
}
function readQuarantineSchemaVersion(database, storePath) {
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`Assistant quarantine store ${storePath} has an invalid schema version.`);
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	ensureQuarantineStoreDirectory(storePath);
	const database = openNodeSqliteDatabase(storePath);
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, TESTCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		database.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
      path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
      app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
      clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
    ) STRICT;`);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		if (database.isOpen) database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, TESTCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Read one authoritative quarantine decision without creating the store. */
function readAssistantDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	if (!existsSync(storePath)) return;
	const database = openNodeSqliteDatabase(storePath);
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		throw new AssistantQuarantineReadCleanupError("error" in outcome ? [outcome.error, closeError] : [closeError], "value" in outcome ? outcome.value : void 0);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Reject a known state quarantine while retaining best-effort metadata admission. */
function assertAssistantStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure) {
	let quarantineFailure;
	try {
		quarantineFailure = readAssistantDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof AssistantQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof AssistantQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) throw quarantineFailure;
}
function readQuarantineDecision(database, pathname, storePath) {
	database.exec(`PRAGMA busy_timeout = ${TESTCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === 0) return;
	if (userVersion > TESTCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`Assistant quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || row.verified_generation !== void 0 && row.verified_generation !== null && typeof row.verified_generation !== "string") throw new Error(`Assistant quarantine store ${storePath} contains an invalid row.`);
	if (typeof row.verified_generation === "string") {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(row.verified_generation);
		} catch {
			throw new Error(`Assistant quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readStableSqliteFileGeneration(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readAssistantDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readAssistantDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof AssistantQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = createAssistantDatabaseVerificationError(kind, pathname, quarantine.reason);
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
/** Persist one authoritative quarantine decision. */
function recordAssistantDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	try {
		return withQuarantineWriter(options.env ?? process.env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(path.resolve(options.path), options.kind, options.reason, Date.now(), VERSION, serializedGeneration);
			if (options.kind === "agent") deleteAgentIntegrityVerification(database, options.path);
			return true;
		}));
	} catch {
		return false;
	}
}
/** Clear one authoritative quarantine decision. */
function clearAssistantDatabaseQuarantine(pathname, options = {}) {
	const env = options.env ?? process.env;
	if (!existsSync(resolveQuarantineStorePath(env))) return true;
	try {
		return withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare("DELETE FROM quarantined_databases WHERE path = ?").run(path.resolve(pathname));
			deleteAgentIntegrityVerification(database, pathname);
			return true;
		}));
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/testclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const retain = (database, readOnly = false) => {
		const scope = getAssistantDatabaseMaintenanceScope();
		scope?.assertAdmission();
		operations.assertOpen(database.path);
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Assistant state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("Assistant state database native owner is retiring");
		if (!readOnly) observeAssistantDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isAssistantDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			retainFailedClose: () => operations.retainFailed(database)
		});
		scope?.own(reference, "shared-references", () => reference.release());
		return reference;
	};
	const findReadDatabase = (pathname) => {
		getAssistantDatabaseMaintenanceScope()?.assertAdmission();
		operations.assertOpen(pathname);
		const database = state.cachedDatabases.get(path.resolve(pathname));
		return database?.db.isOpen ? database : void 0;
	};
	const retainReadReference = (database) => {
		const reference = retain(database, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeAssistantDatabaseMaintenanceResource(database.db);
			},
			release() {
				reference.release();
				operations.touch(database);
			}
		};
	};
	return {
		retain: (database) => retain(database),
		retainForIndependentRead(pathname) {
			const database = findReadDatabase(pathname);
			return database ? retainReadReference(database) : void 0;
		},
		borrowForRead(pathname) {
			const database = findReadDatabase(pathname);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`Assistant state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	return { release() {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0 || !owner.retirement) {
			released = true;
			return;
		}
		owner.retiring = true;
		try {
			owner.retirement.retire();
		} catch (error) {
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		released = true;
	} };
}
//#endregion
//#region src/state/testclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && (database.db.isTransaction || borrowers.get(database.db)?.references.size || idleReferences.get(database.db)?.size)) {
					touch(database);
					return;
				}
				retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("Assistant state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-handle.ts
const handleLeases = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseHandleLeases"), () => /* @__PURE__ */ new WeakMap());
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Only native open failure with a released lease is an ordinary read failure. */
function openTrackedStateDatabaseResult(pathname, options) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		handleLeases.set(database, lease);
		return {
			status: "available",
			database
		};
	} catch (error) {
		lease.release();
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (!database.isOpen) {
			handleLeases.get(database)?.release();
			handleLeases.delete(database);
		}
	}
}
//#endregion
//#region src/state/testclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQueries = /* @__PURE__ */ new WeakMap();
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db) {
	const published = readSqliteUserVersion(db);
	if (!tableExists$2(db, "config_machine_state")) return published;
	let query = contentVersionQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY));
		contentVersionQueries.set(db, query);
	}
	const row = query().rows[0];
	if (!row) return published;
	const contentVersion = JSON.parse(row.value_json);
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new Error(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return Math.max(published, contentVersion);
}
/** Cold migration planning checks physical content; admission still uses the recorded version. */
function readStateSchemaMigrationVersion(db) {
	const version = readStateSchemaContentVersion(db);
	if (version !== 16) return version;
	const reviewWorkspace = tableHasColumn(db, "skill_workshop_collection_reviews", "workspace_dir");
	const proposalWorkspace = tableHasColumn(db, "skill_workshop_proposals", "workspace_dir");
	const releasedClaim = tableHasColumn(db, "skill_workshop_proposals", "claim_released_time");
	if (!reviewWorkspace && !proposalWorkspace && !releasedClaim) return version;
	const missingAttribution = reviewWorkspace && !proposalWorkspace;
	const issues = collectSqliteSchemaIssues(db, `
    CREATE TABLE skill_workshop_collection_reviews (
      review_id TEXT NOT NULL PRIMARY KEY,
      ${reviewWorkspace ? "workspace_dir" : "owner_agent_id"} TEXT NOT NULL,
      backup_id TEXT NOT NULL,
      create_time INTEGER NOT NULL,
      kept_names_json TEXT NOT NULL,
      written_names_json TEXT NOT NULL,
      dropped_json TEXT NOT NULL
    ) STRICT;
    CREATE TABLE skill_workshop_proposals (
      proposal_id TEXT NOT NULL PRIMARY KEY,
      record_json TEXT NOT NULL,
      owner_agent_id TEXT,
      ${proposalWorkspace ? "workspace_dir TEXT NOT NULL," : ""}
      kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),
      status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      draft_hash TEXT NOT NULL,
      origin_agent_id TEXT,
      origin_session_key TEXT,
      origin_run_id TEXT,
      origin_message_id TEXT,
      applied_at TEXT,
      rejected_at TEXT,
      quarantined_at TEXT,
      stale_at TEXT,
      status_reason TEXT
      ${releasedClaim ? ", claim_released_time INTEGER" : ""}
    ) STRICT;
  `, {
		allowedMissingTables: ["skill_workshop_collection_reviews"],
		allowedColumnDefinitions: {
			"skill_workshop_collection_reviews.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"],
			"skill_workshop_proposals.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"]
		}
	});
	if (!missingAttribution && issues.length === 0) return 15;
	throw new Error("Unrecognized Skill Workshop ownership schema; cannot apply the schema 16 migration.");
}
function assertSupportedStateSchemaVersion(db, pathname) {
	try {
		const userVersion = readSqliteUserVersion(db);
		const contentVersion = userVersion > 18 ? userVersion : readStateSchemaContentVersion(db);
		if (contentVersion > 18) throw createNewerSqliteSchemaVersionError("Assistant state database", pathname, contentVersion, 18);
		return userVersion;
	} catch (error) {
		throw normalizeAssistantStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/state/testclaw-state-db-runtime-failure.ts
/** Runtime validation uses the cache's existing handles, version counters, and terminal latch. */
function createAssistantStateDatabaseRuntimeFailureOwner(owner) {
	const readDataVersion = (database) => {
		let statement = owner.statements.get(database);
		if (!statement) {
			statement = database.db.prepare("PRAGMA data_version");
			owner.statements.set(database, statement);
		}
		const row = statement.get();
		if (typeof row?.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
		return row.data_version;
	};
	return {
		closeTerminalFailure(pathname, error) {
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		recordPublishedVersion: (database) => {
			owner.dataVersions.set(database.db, readDataVersion(database));
		},
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const latched = owner.latch.get(resolvedPath);
			if (latched) return latched;
			const cached = owner.cachedDatabases.get(resolvedPath);
			if (!cached?.db.isOpen) return;
			try {
				const dataVersion = readDataVersion(cached);
				if (owner.dataVersions.get(cached.db) === dataVersion) return;
				assertSupportedStateSchemaVersion(cached.db, resolvedPath);
				owner.dataVersions.set(cached.db, dataVersion);
				return;
			} catch (error) {
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(cached);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(resolvedPath, failure);
				return failure;
			}
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-schema-policy.ts
const schemaPolicies = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = path.resolve(pathname);
	try {
		return realpathSync.native(resolved);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return resolved;
		throw error;
	}
}
function withExistingAssistantStateSchema(options, run) {
	getExistingAssistantStateSchemaPath();
	const parent = schemaPolicies.scopes.getStore();
	const scope = {
		path: path.resolve(options.path),
		canonicalPath: canonicalPath(options.path),
		active: true
	};
	if (parent && parent.canonicalPath !== scope.canonicalPath) throw new Error("Existing shared-state schema admission cannot change its database path.");
	try {
		const result = schemaPolicies.scopes.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			scope.active = false;
		});
		scope.active = false;
		return result;
	} catch (error) {
		scope.active = false;
		throw error;
	}
}
function getExistingAssistantStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
	return scope?.path;
}
/** Check supplied and cached handles before exposing them to another admission policy. */
function isExistingAssistantStateSchema(pathname, database) {
	const scopedPath = getExistingAssistantStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const admittedPath = database && schemaPolicies.existingDatabases.get(database);
	const resolvedPath = path.resolve(pathname);
	const existing = scopedPath !== void 0 && (scopedPath === resolvedPath || scope?.canonicalPath === resolvedPath || scope?.canonicalPath === canonicalPath(resolvedPath));
	if (scopedPath && !existing) throw new Error(`Existing shared-state schema admission is bound to ${scopedPath}, not ${pathname}.`);
	if (admittedPath && (!existing || admittedPath !== scope?.canonicalPath)) throw new Error(`Shared-state database ${pathname} was admitted without schema repair; close its existing handle before ordinary admission.`);
	return existing;
}
function recordExistingAssistantStateSchemaDatabase(database, pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope || !isExistingAssistantStateSchema(pathname, database)) throw new Error("Existing shared-state schema admission requires its active path scope.");
	schemaPolicies.existingDatabases.set(database, scope.canonicalPath);
}
/** The cache owns the handle inventory, including owners retained after failed cleanup. */
function assertExistingAssistantStateSchemaCacheAdmission(pathname, cache) {
	const scopedPath = getExistingAssistantStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const requested = path.resolve(pathname);
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingAssistantStateSchema(pathname, db);
		}
	}
}
function assertAssistantStateSchemaRepairAllowed(pathname) {
	if (isExistingAssistantStateSchema(pathname)) throw new Error(`Shared-state schema repair is owned by the existing installation at ${pathname}; update that installation before retrying the managed node.`);
}
//#endregion
//#region src/state/testclaw-state-db-snapshot-owner.ts
function createAssistantStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "testclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("Assistant state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const testClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("testclaw.stateSnapshotOwners"), createAssistantStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/testclaw-state-db-cache.ts
const stateDatabaseLifecycle = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseLifecycle"), () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	cachedDataVersionStatements: /* @__PURE__ */ new WeakMap(),
	cachedDataVersions: /* @__PURE__ */ new WeakMap(),
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => runtimeFailures.closeTerminalFailure(pathname, error) }),
	asyncResources: createAssistantStateDatabaseAsyncLifecycle()
}), () => closeAssistantStateDatabaseAsync());
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, cachedDataVersionStatements, cachedDataVersions, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainAssistantStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireAssistantStateDatabaseHandle);
function notifyAssistantStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyAssistantStateDatabaseClosed(database) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
}
function requireAssistantStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const runtimeFailures = createAssistantStateDatabaseRuntimeFailureOwner({
	cachedDatabases,
	statements: cachedDataVersionStatements,
	dataVersions: cachedDataVersions,
	latch: terminalOpenLatch,
	evict: evictCachedAssistantStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyAssistantStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyAssistantStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerAssistantStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeAssistantStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getAssistantDatabaseMaintenanceScope()?.own(database.db, "shared-handles", () => {
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) retireAssistantStateDatabaseHandle(database, false);
	});
}
function closeUnpublishedAssistantStateDatabaseHandle(database) {
	const errors = closeAssistantStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainAssistantStateDatabase, borrowForRead: borrowAssistantStateDatabaseForAsyncRead, retainForIndependentRead: retainAssistantStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname) {
		assertAssistantStateDatabaseOpenAllowed(pathname);
		assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireAssistantStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeAssistantStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeAssistantStateDatabaseHandle(database, options), `Assistant state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	const errors = [];
	testClawStateSnapshotOwners.release(database.db);
	try {
		database.walMaintenance?.close(options);
	} catch (error) {
		errors.push(error);
	}
	try {
		clearNodeSqliteKyselyCacheForDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeTrackedStateDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	let cleanupPending = false;
	if (!database.db.isOpen) try {
		database.afterClose?.();
	} catch (error) {
		errors.push(error);
		cleanupPending = true;
	}
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyAssistantStateDatabaseClosed(database);
	closeAssistantStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictAssistantStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedAssistantStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishAssistantStateDatabase(database) {
	const { db, path: pathname } = database;
	const identity = asyncResources.publish(pathname);
	databaseIdentities.set(db, identity);
	runtimeFailures.recordPublishedVersion(database);
	cachedDatabases.set(pathname, database);
	touchStateDatabase(database);
	testClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyAssistantStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedAssistantStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedAssistantStateDatabase(pathname) {
	getAssistantDatabaseMaintenanceScope()?.assertAdmission();
	assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	const runtimeFailure = runtimeFailures.get(pathname);
	if (runtimeFailure) throw runtimeFailure;
	const database = cachedDatabases.get(path.resolve(pathname));
	if (database && borrowers.get(database.db)?.retiring) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
	if (database) touchStateDatabase(database);
	return database;
}
function getAssistantStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedAssistantStateDatabase(pathname);
	observeAssistantDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeAssistantStateDatabaseHandle(database);
	notifyAssistantStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale Assistant state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordAssistantStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearAssistantStateDatabaseOpenFailure(pathname) {
	const resolvedPath = path.resolve(pathname);
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyAssistantStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getAssistantStateDatabaseTerminalFailureAsync(context) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (_path, generation) => {
		const { inspectAssistantStateDatabase } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
		const matches = await inspectAssistantStateDatabase(context, {
			type: "database.generationMatches",
			input: { generation }
		});
		if (matches === void 0) throw new Error("Recorded shared-state database generation is unavailable");
		return matches;
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertAssistantStateDatabaseOpenAllowed(pathname) {
	const identity = asyncResources.identity(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	const resolvedPath = path.resolve(pathname);
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
}
function recordAssistantStateDatabaseLifecycleOpenError(pathname, error) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "open-error",
		path: path.resolve(pathname),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertAssistantStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertAssistantStateDatabaseOpenAllowed(pathname);
	assertAssistantStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure);
}
/** Explicit retirement can checkpoint WAL and must join the lifecycle writer gate. */
function retireAssistantStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	const { busyTimeoutMs = TESTCLAW_SQLITE_BUSY_TIMEOUT_MS, ...closeOptions } = options ?? {};
	const coordinator = borrowedOwner?.closeCoordinator ?? acquireStateDatabaseCoordinator({
		databasePath: database.path,
		busyTimeoutMs,
		keepAlive: false
	});
	if (borrowedOwner) borrowedOwner.closeCoordinator = coordinator;
	try {
		runWithSqliteCoordinator(coordinator, "state database retirement", () => {
			const wasCached = cachedDatabases.get(database.path)?.db === database.db;
			if (retireAdmission) asyncResources.invalidate(database.path);
			const errors = closeAssistantStateDatabaseHandle(database, closeOptions);
			if (wasCached && retireAdmission) try {
				notifyAssistantStateDatabaseClosed(database);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, `Assistant state database cleanup failed for ${database.path}.`);
		});
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	} finally {
		if (borrowedOwner && coordinator.closed) borrowedOwner.closeCoordinator = void 0;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireAssistantStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireAssistantStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "Assistant state database cleanup failed.");
	return found;
}
/** Close one cached shared state database handle by exact pathname. */
function closeAssistantStateDatabaseByPath(pathname, options) {
	return retireAssistantStateDatabaseHandles(path.resolve(pathname), options, asyncResources.identity(pathname));
}
/** Close all cached shared state database handles. */
function closeAssistantStateDatabase(options) {
	retireAssistantStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
function registerAssistantStateDatabaseAsyncResource(resource) {
	return asyncResources.register(resource);
}
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureAssistantStateDatabaseReadAdmission = asyncResources.capture;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishAssistantStateDatabaseWorkerAdmission(admission) {
	admission.assertCurrent();
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Drain worker resources before native checkpoint/close at one exact path. */
function closeAssistantStateDatabaseByPathAsync(pathname, options) {
	const resolvedPath = path.resolve(pathname);
	return asyncResources.close(resolvedPath, (identity) => retireAssistantStateDatabaseHandles(resolvedPath, options, identity));
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeAssistantStateDatabaseAsync(options) {
	await asyncResources.close(void 0, () => retireAssistantStateDatabaseHandles(void 0, options));
}
/** Test whether a cached shared state database handle is still open, optionally at one path. */
function isAssistantStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/** Report the live owner's last observation without opening or querying SQLite. */
function readAssistantStateWalHealth() {
	const database = cachedDatabases.get(path.resolve(resolveAssistantStateSqlitePath()));
	return database?.db.isOpen ? database.walMaintenance.health : void 0;
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
function closeAssistantStateDatabaseForTest() {
	closeAssistantStateDatabase();
	terminalOpenLatch.clearAll();
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const testClawStateDatabaseCache = {
	assertAssistantStateDatabaseFreshOpenAllowedAtPath,
	assertAssistantStateDatabaseOpenAllowed,
	clearAssistantStateDatabaseOpenFailure,
	closeAssistantStateDatabase,
	closeAssistantStateDatabaseByPath,
	closeAssistantStateDatabaseForTest,
	closeAssistantStateDatabaseHandle,
	closeUnpublishedAssistantStateDatabaseHandle,
	closeStaleCachedAssistantStateDatabase,
	evictCachedAssistantStateDatabase,
	evictAssistantStateDatabaseAfterCorruption,
	getCachedAssistantStateDatabase,
	getAssistantStateDatabaseRuntimeFailure: runtimeFailures.get,
	getAssistantStateDatabaseIfOpenAtPath,
	getKnownAssistantStateDatabaseIdentity: asyncResources.knownIdentity,
	isAssistantStateDatabaseOpen,
	publishAssistantStateDatabase,
	recordAssistantStateDatabaseOpenFailure,
	recordAssistantStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
/** Drain local cached owners before excluding participating foreign handles for file removal. */
async function acquireAssistantStateDatabaseFileExclusion(pathname) {
	const databasePath = path.resolve(pathname);
	const releaseAdmission = asyncResources.holdExclusion(databasePath);
	let lifecycle;
	let handles;
	try {
		await closeAssistantStateDatabaseByPathAsync(databasePath);
		lifecycle = acquireStateDatabaseCoordinator({
			databasePath,
			busyTimeoutMs: 0
		});
		handles = acquireStateDatabaseHandleExclusion({
			databasePath,
			busyTimeoutMs: 0
		});
	} catch (error) {
		lifecycle?.release();
		releaseAdmission();
		throw error;
	}
	const closeWriter = (errors) => {
		const database = cachedDatabases.get(databasePath);
		if (database) try {
			handles.runWithCanonicalWrites(handles.assertCurrent, () => {
				errors.push(...closeAssistantStateDatabaseHandle(database));
			});
			notifyAssistantStateDatabaseClosed(database);
		} catch (error) {
			errors.push(error);
		}
	};
	return {
		assertCurrent: handles.assertCurrent,
		runWithSourceReads: handles.runWithSourceReads,
		async bindCaptured(assertCurrent, operation) {
			const errors = [];
			let result;
			try {
				result = handles.runWithCanonicalWrites(assertCurrent, operation);
			} catch (error) {
				errors.push(error);
			}
			closeWriter(errors);
			if (result !== void 0) {
				errors.push(/* @__PURE__ */ new Error("checkpoint binding must complete synchronously with undefined"));
				try {
					await Promise.resolve(result);
				} catch (error) {
					errors.push(error);
				}
			}
			try {
				assertCurrent();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "checkpoint binding or writer closure failed", errors[0]);
		},
		release: () => {
			try {
				handles.release();
			} finally {
				lifecycle?.release();
				releaseAdmission();
			}
		}
	};
}
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmAssistantStateDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	await closeAssistantStateDatabaseByPathAsync(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
//#endregion
export { findAssistantAgentDatabaseIdentity as $, closeTrackedStateDatabase as A, ensureContextEngineTurnOutboxSchema as At, recordAssistantDatabaseQuarantine as B, assertSqliteSchemaTablesPresent as Bt, isExistingAssistantStateSchema as C, ensureMessageToolRunOutcomeSchema as Ct, assertSupportedStateSchemaVersion as D, TESTCLAW_AGENT_SCHEMA_VERSION as Dt, CONTENT_VERSION_KEY as E, SESSION_PARTICIPANTS_TABLE as Et, clearAssistantDatabaseQuarantine as F, hasLegacyMemoryRecallMetadataColumns as Ft, getAssistantAgentDatabaseValidation as G, getCanonicalSqliteTableNames as Gt, adoptAssistantAgentDatabaseValidation as H, collectSqliteSchemaIssues as Ht, markAssistantAgentIntegrityClean as I, ensureMemoryChunkProvenance as It, invalidateAssistantAgentDatabaseValidation as J, throwSqliteSchemaMismatches as Jt, getAssistantAgentDatabaseValidationForTransfer as K, readSqliteSchemaCookie as Kt, readAssistantAgentIntegrityVerification as L, migrateSqliteSchemaToStrict as Lt, openTrackedStateDatabaseResult as M, migrateMemoryIndexSourcesIdentity as Mt, canReuseAssistantAgentIntegrityVerification as N, migrateMemoryIndexStorage as Nt, readStateSchemaContentVersion as O, LEGACY_ACP_MIGRATION_COLUMN_DEFINITION as Ot, clearAssistantAgentIntegrityVerification as P, ensureMemoryRecallMetadataSchema as Pt, createAssistantAgentDatabaseClaim as Q, createSqliteTerminalOpenLatch as Qt, readAssistantDatabaseQuarantineFailure as R, migrateSqliteSchemaToStrictInTransaction as Rt, getExistingAssistantStateSchemaPath as S, hasSessionPendingInputsSchema as St, withExistingAssistantStateSchema as T, ensureSessionGoalOperationsSchema as Tt, captureAssistantAgentDatabaseValidationTransfer as U, createSqliteTableContractReader as Ut, resolveQuarantineStorePath as V, collectSqliteNamedIndexContract as Vt, clearAssistantAgentDatabaseValidationCache as W, getCanonicalSqliteNamedIndexContracts as Wt, markAssistantAgentCanonicalValidation as X, quoteSqliteIdentifier$1 as Xt, invalidateAssistantAgentDatabaseValidationsForAgent as Y, extractSqliteTableSchema as Yt, setAssistantAgentDatabaseValidation as Z, splitSqlList as Zt, requireAssistantStateDatabaseIdentity as _, ensurePendingInputConsumptionColumn as _t, closeAssistantStateDatabase as a, withoutCanonicalSessionValidationSchema as at, testClawStateDatabaseCache as b, hasPendingInputConsumptionColumn as bt, closeAssistantStateDatabaseForTest as c, SESSION_TRANSCRIPT_ARCHIVES_TABLE as ct, isAssistantStateDatabaseOpen as d, AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL as dt, isAssistantAgentDatabasePathCurrent as et, publishAssistantStateDatabaseWorkerAdmission as f, ensureAssistantAgentProgressCardSchemaInTransaction as ft, registerAssistantStateDatabaseLifecycleListener as g, SESSION_PENDING_INPUTS_TABLE as gt, registerAssistantStateDatabaseAsyncResource as h, SESSION_INPUT_COMPLETIONS_TABLE as ht, clearAssistantStateDatabaseOpenFailure as i, canonicalSessionValidationSchemaSql as it, openTrackedStateDatabase as j, TESTCLAW_AGENT_SCHEMA_SQL as jt, readStateSchemaMigrationVersion as k, SESSION_OWNER_COLUMN_DEFINITIONS as kt, confirmAssistantStateDatabaseIntegrity as l, ensureSessionTranscriptArchiveSchema as lt, recordAssistantStateDatabaseOpenFailure as m, ensureAssistantAgentBoardSchemaInTransaction as mt, borrowAssistantStateDatabaseForAsyncRead as n, registerAssistantAgentDatabaseIdentity as nt, closeAssistantStateDatabaseAsync as o, classifyAssistantAgentDatabaseReadError as ot, readAssistantStateWalHealth as p, AGENT_V14_BOARD_SCHEMA_SQL as pt, hasAssistantAgentCanonicalValidation as q, legacySqliteSchemaIssueMessages as qt, captureAssistantStateDatabaseReadAdmission as r, assertCanonicalSessionValidationSchema as rt, closeAssistantStateDatabaseByPathAsync as s, AGENT_SCHEMA_COMPATIBILITY as st, acquireAssistantStateDatabaseFileExclusion as t, readAssistantAgentDatabaseIdentity as tt, getAssistantStateDatabaseTerminalFailureAsync as u, AGENT_PROGRESS_CARD_SCHEMA_SQL as ut, retainAssistantStateDatabaseForIdle as v, ensureSessionInputCompletionsSchema as vt, recordExistingAssistantStateSchemaDatabase as w, SESSION_GOAL_OPERATIONS_TABLE as wt, assertAssistantStateSchemaRepairAllowed as x, hasPendingInputConsumptionColumnMigration as xt, retainAssistantStateDatabaseForIndependentRead as y, ensureSessionPendingInputsSchema as yt, recordAssistantAgentIntegrityVerification as z, assertSqliteSchemaContains as zt };
