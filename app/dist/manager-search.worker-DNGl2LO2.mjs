import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-DhoOHVHp.mjs";
import { c as MEMORY_INDEX_META_TABLE, f as MEMORY_INDEX_CHUNKS_TABLE, h as MEMORY_INDEX_SOURCES_TABLE } from "./memory-schema-B-dXjQ87.mjs";
import { n as openAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-open-DCNTUAgw.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { n as serveWorkerTasks } from "./worker-task-server-B4qQGSM6.mjs";
import "./memory-core-host-engine-knn-Wr3OW8bn.mjs";
import "./worker-task-server-C4Plhoo5.mjs";
import "./error-runtime-D9ido5oY.mjs";
import { a as readCuratedProjectMemoryCandidates, i as readCuratedMemoryTriggerCandidates } from "./engine-storage-DQ_7oPVF.mjs";
import "./memory-core-host-engine-storage-CKziHTXC.mjs";
import "./sqlite-runtime-CwbwzcAg.mjs";
import { c as readMemoryRecallData, h as buildFtsQuery, i as searchChunksByEmbedding, l as readMemoryRetrievalIndexState, m as bm25RankToScore, n as searchKeyword, r as searchPathKeyword } from "./manager-search-oymNk30e.mjs";
import "./memory-core-host-engine-schema-AQnU9E4G.mjs";
//#region extensions/memory-core/src/memory/manager-status-presence.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
/** Inspect existing memory tables without constructing or migrating a manager. */
function inspectMemoryIndexPresenceInWorker(databasePath) {
	let db;
	try {
		db = openNodeSqliteDatabase(databasePath, { readOnly: true });
		const builtInMemoryTableSets = [{
			meta: MEMORY_INDEX_META_TABLE,
			sources: MEMORY_INDEX_SOURCES_TABLE,
			chunks: MEMORY_INDEX_CHUNKS_TABLE
		}, {
			meta: "meta",
			sources: "files",
			chunks: "chunks"
		}];
		const builtInMemoryTables = builtInMemoryTableSets.flatMap(({ meta, sources, chunks }) => [
			meta,
			sources,
			chunks
		]);
		const tableNames = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${builtInMemoryTables.map(() => "?").join(", ")})`).all(...builtInMemoryTables).map((row) => row.name).filter((name) => typeof name === "string"));
		for (const tables of builtInMemoryTableSets) {
			if (tableNames.has(tables.meta) && db.prepare(`SELECT 1 AS ok FROM ${tables.meta} WHERE key = ? LIMIT 1`).get(MEMORY_INDEX_META_KEY)) return true;
			for (const tableName of [tables.sources, tables.chunks]) if (tableNames.has(tableName) && db.prepare(`SELECT 1 AS ok FROM ${tableName} LIMIT 1`).get()) return true;
		}
		return false;
	} catch {
		return false;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search.worker.ts
serveWorkerTasks(async (input) => {
	const request = input;
	if (request.kind === "presence") return {
		kind: "presence",
		present: inspectMemoryIndexPresenceInWorker(request.databasePath)
	};
	if (request.kind === "recall-metadata") {
		const result = withAssistantAgentDatabaseReadOnly(({ db }) => readMemoryRecallData(db, request), {
			agentId: request.agentId,
			path: request.databasePath
		});
		if (!result.found) throw new Error(`Memory search database unavailable: ${result.reason}`);
		return {
			kind: "recall-metadata",
			...result.value
		};
	}
	const opened = openAssistantAgentDatabaseReadOnly({
		agentId: request.agentId,
		path: request.databasePath
	});
	if (!opened.found) {
		if (opened.reason === "database-missing" && (request.kind === "index-state" || request.kind === "keyword" && request.includeIndexState)) {
			const state = {
				meta: null,
				hasIndexedChunks: false,
				hasFtsContent: false,
				vectorState: { state: "empty" }
			};
			return request.kind === "index-state" ? {
				kind: "index-state",
				state
			} : {
				kind: "keyword",
				indexState: state,
				body: { rows: [] },
				path: { rows: [] }
			};
		}
		throw new Error(`Memory search database unavailable: ${opened.reason}`);
	}
	const { db } = opened.database;
	try {
		if (request.kind === "index-state") return {
			kind: "index-state",
			state: readMemoryRetrievalIndexState(db)
		};
		if (request.kind === "curated") {
			const provenanceRepairPending = request.checkProvenanceRepair && executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_sources").select("hash").where("source", "=", "memory").where("hash", "=", "").limit(1)).rows.length > 0;
			return {
				kind: "curated",
				provenanceRepairPending,
				rows: provenanceRepairPending ? [] : request.projectsOnly ? readCuratedProjectMemoryCandidates(db, request.limit, request.activeProjectKeys ?? []) : readCuratedMemoryTriggerCandidates(db, request.limit, request.activeProjectKeys)
			};
		}
		if (request.kind === "vector") return {
			kind: "vector",
			rows: await searchChunksByEmbedding({
				...request.query,
				db
			})
		};
		const indexState = request.includeIndexState ? readMemoryRetrievalIndexState(db) : void 0;
		return {
			kind: "keyword",
			body: await searchKeyword({
				...request.query.body,
				db,
				buildFtsQuery,
				bm25RankToScore
			}).then((rows) => ({ rows })).catch((error) => ({
				rows: [],
				error: formatErrorMessage(error)
			})),
			path: await searchPathKeyword({
				...request.query.path,
				db,
				buildFtsQuery,
				bm25RankToScore
			}).then((rows) => ({ rows })).catch((error) => ({
				rows: [],
				error: formatErrorMessage(error)
			})),
			...indexState ? { indexState } : {}
		};
	} finally {
		opened.database.close();
	}
});
//#endregion
export {};
