import "./src-D9uQ497Z.js";
import { a as asOptionalRecord, o as asRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-AulM0PZ6.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { t as expandHomePrefix } from "./home-dir-DjuHbd5R.js";
import { w as resolveConfigDir } from "./utils-BfoJTy8l.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-jRWDObfR.js";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { c as removeTempDirectoryAsync, l as retainSnapshotTempDirectory, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-CwtWaSiY.js";
import { K as tableExists, _ as hasStateDatabaseSourceExclusion, h as captureStateDatabaseCoordinatorRuntime, p as acquireStateDatabaseHandleLease, v as prepareStateDatabaseSourceExclusion } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as createSqliteSnapshotStagingDirectory } from "./sqlite-snapshot-staging-D3DC29Jr.js";
import { n as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DewCyJy9.js";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-vvtahMcf.js";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { h as registerAssistantStateDatabaseAsyncResource, r as captureAssistantStateDatabaseReadAdmission } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { r as isArtifactPreservingStateRead, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D7HyHM3A.js";
import { t as WorkerTaskPool } from "./worker-task-pool-DdST9izh.js";
import { n as retainAssistantStateWorkerErrorPayload, t as hydrateAssistantStateWorkerError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as readConfigMachineState } from "./config-machine-state-BiDCuNUZ.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-DpBAOoda.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { a as loadCronRows, g as tryParseJsonObject, i as fingerprintCronJobRows, l as readCronJobsFingerprint, m as upsertCronJobRow, n as deleteCronJobRowInDatabase, o as loadedCronStoreFromRows, p as updateCronRuntimeRows, r as deleteStaleCronJobFamilyRows, t as assertCronStoreCanPersist, u as replaceCronRows } from "./row-codec-uVFeVvND.js";
import { i as normalizeCronScheduledToolPolicy } from "./scheduled-tool-policy-CQE6r880.js";
import { o as normalizeCronRuntimeAuthority } from "./tools-allow-provenance-DohE6dbm.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-2vhyQrsJ.js";
import { n as cronJobUsesToolRuntime } from "./tools-allow-CyVpemxZ.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/load-error.ts
function restoreCronLoadError(value) {
	const error = Object.assign(new Error(value.message), {
		name: value.name,
		...value.code === void 0 ? {} : { code: value.code }
	});
	if (value.sharedState) retainAssistantStateWorkerErrorPayload(error, value.sharedState);
	return hydrateAssistantStateWorkerError(error, { includeOrdinary: true });
}
//#endregion
//#region src/cron/store/runtime-authority-store.ts
/** Downgrade-stable persistence for runtime-private cron authority. */
const CRON_RUNTIME_AUTHORITY_TABLE = "cron_job_runtime_authorities";
const CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION = 1;
const CRON_RUNTIME_AUTHORITY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  authority_json TEXT,
  authority_input_fingerprint TEXT,
  recovery_required INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id),
  FOREIGN KEY (store_key, job_id)
    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,
  CHECK (recovery_required IN (0, 1)),
  CHECK (
    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)
    OR
    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)
  )
) STRICT;
`;
function getCronAuthorityKysely(db) {
	return getNodeSqliteKysely(db);
}
function normalizedToolsAllow(job) {
	const toolsAllow = job.payload.toolsAllow;
	return toolsAllow === void 0 ? null : [...toolsAllow].toSorted();
}
function normalizedToolsAllowProvenance(value) {
	return value?.version === 1 && value.source === "final-executable-surface" ? {
		version: 1,
		source: "final-executable-surface"
	} : null;
}
/** Binds authority to only the canonical inputs that can change its authorization meaning. */
function cronRuntimeAuthorityInputFingerprint(job) {
	const scheduledToolPolicy = normalizeCronScheduledToolPolicy(job.scheduledToolPolicy) ?? null;
	const canonical = {
		version: CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION,
		usesToolRuntime: cronJobUsesToolRuntime(job),
		toolsAllow: normalizedToolsAllow(job),
		toolsAllowIsDefault: job.payload.toolsAllowIsDefault === true,
		scheduledToolPolicy,
		toolsAllowProvenance: normalizedToolsAllowProvenance(job.toolsAllowProvenance)
	};
	return `v${CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION}:${createHash("sha256").update(JSON.stringify(canonical), "utf8").digest("hex")}`;
}
/** Creates the additive table only when authority state is first persisted. */
function ensureCronRuntimeAuthorityTable(db) {
	db.exec(CRON_RUNTIME_AUTHORITY_SCHEMA_SQL);
}
function loadCronRuntimeAuthorityRows(db, storeKey, jobIds) {
	if (!tableExists(db, CRON_RUNTIME_AUTHORITY_TABLE)) return [];
	return executeSqliteQuerySync(db, getCronAuthorityKysely(db).selectFrom("cron_job_runtime_authorities").selectAll().where("store_key", "=", storeKey).where("job_id", "in", sqliteStringSet([...jobIds]))).rows;
}
function applyCronRuntimeAuthorityRow(job, row) {
	delete job.runtimeAuthority;
	delete job.runtimeAuthorityRecoveryRequired;
	if (row.recovery_required === 1) {
		job.runtimeAuthorityRecoveryRequired = true;
		return "ok";
	}
	const authority = normalizeCronRuntimeAuthority(safeParseJson(row.authority_json ?? ""));
	if (!authority || row.authority_input_fingerprint !== cronRuntimeAuthorityInputFingerprint(job)) {
		job.runtimeAuthorityRecoveryRequired = true;
		return "repair";
	}
	job.runtimeAuthority = authority;
	return "ok";
}
/** Applies stored authority only when its authorization inputs still match exactly. */
function loadCronRuntimeAuthorities(params) {
	const jobsById = new Map(params.jobs.map((job) => [job.id, job]));
	const repairJobIds = [];
	for (const row of loadCronRuntimeAuthorityRows(params.db, params.storeKey, jobsById.keys())) {
		const job = jobsById.get(row.job_id);
		if (!job) continue;
		if (applyCronRuntimeAuthorityRow(job, row) === "repair") repairJobIds.push(job.id);
	}
	return { repairJobIds };
}
function writeRecoveryRow(db, storeKey, jobId) {
	executeSqliteQuerySync(db, getCronAuthorityKysely(db).insertInto("cron_job_runtime_authorities").values({
		store_key: storeKey,
		job_id: jobId,
		authority_json: null,
		authority_input_fingerprint: null,
		recovery_required: 1
	}).onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet({
		authority_json: null,
		authority_input_fingerprint: null,
		recovery_required: 1
	})));
}
/** Revalidates downgrade-detected drift before retiring stale authority durably. */
function repairCronRuntimeAuthorityRows(params) {
	if (!tableExists(params.db, CRON_RUNTIME_AUTHORITY_TABLE)) return false;
	const requested = new Set(params.jobIds);
	const jobsById = new Map(params.jobs.map((job) => [job.id, job]));
	let repaired = false;
	for (const row of loadCronRuntimeAuthorityRows(params.db, params.storeKey, requested)) {
		if (!requested.has(row.job_id)) continue;
		const job = jobsById.get(row.job_id);
		if (!job) continue;
		if (applyCronRuntimeAuthorityRow(job, row) === "repair") {
			writeRecoveryRow(params.db, params.storeKey, job.id);
			repaired = true;
		}
	}
	return repaired;
}
/** Reconciles child rows inside the same transaction as their owning cron rows. */
function replaceCronRuntimeAuthorityRows(params) {
	if (!params.jobs.some((job) => job.runtimeAuthority || job.runtimeAuthorityRecoveryRequired === true) && !tableExists(params.db, CRON_RUNTIME_AUTHORITY_TABLE)) return;
	ensureCronRuntimeAuthorityTable(params.db);
	const database = getCronAuthorityKysely(params.db);
	const existingRowsByJobId = params.preserveExistingForJobIds ? new Map(loadCronRuntimeAuthorityRows(params.db, params.storeKey, params.jobs.map((job) => job.id)).map((row) => [row.job_id, row])) : void 0;
	for (const job of params.jobs) {
		if (params.preserveExistingForJobIds?.has(job.id)) {
			const existingRow = existingRowsByJobId?.get(job.id);
			if (existingRow) {
				if (applyCronRuntimeAuthorityRow(job, existingRow) === "repair") writeRecoveryRow(params.db, params.storeKey, job.id);
				continue;
			}
			if (!params.writeMissingForJobIds?.has(job.id)) continue;
		}
		if (job.runtimeAuthorityRecoveryRequired === true) {
			writeRecoveryRow(params.db, params.storeKey, job.id);
			continue;
		}
		const authority = normalizeCronRuntimeAuthority(job.runtimeAuthority);
		if (authority) {
			const authorityJson = JSON.stringify(authority);
			const authorityInputFingerprint = cronRuntimeAuthorityInputFingerprint(job);
			executeSqliteQuerySync(params.db, database.insertInto("cron_job_runtime_authorities").values({
				store_key: params.storeKey,
				job_id: job.id,
				authority_json: authorityJson,
				authority_input_fingerprint: authorityInputFingerprint,
				recovery_required: 0
			}).onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet({
				authority_json: authorityJson,
				authority_input_fingerprint: authorityInputFingerprint,
				recovery_required: 0
			})));
			continue;
		}
		executeSqliteQuerySync(params.db, database.deleteFrom("cron_job_runtime_authorities").where("store_key", "=", params.storeKey).where("job_id", "=", job.id));
	}
}
//#endregion
//#region src/cron/store/load.kernel.ts
function isRetiredCollectionReview(row) {
	return row.payload_kind === "skillCollectionReview" || asRecord(tryParseJsonObject(row.job_json)?.payload).kind === "skillCollectionReview";
}
function loadCronStoreFromDatabase(database, storeKey, writer) {
	let rows = loadCronRows(database, storeKey);
	const retiredIds = new Set(rows.filter(isRetiredCollectionReview).map((row) => row.job_id));
	if (!writer) rows = rows.filter((row) => !retiredIds.has(row.job_id));
	else if (retiredIds.size > 0) {
		if (writer.write((db) => {
			const current = loadCronRows(db, storeKey, retiredIds).filter(isRetiredCollectionReview);
			for (const row of current) deleteCronJobRowInDatabase(db, storeKey, row.job_id);
			return current.length;
		}, "cron.retire-collection-review") > 0) writer.committed();
		rows = loadCronRows(database, storeKey);
	}
	const loaded = loadedCronStoreFromRows(rows);
	if (rows.length > 0) {
		const authority = loadCronRuntimeAuthorities({
			db: database,
			storeKey,
			jobs: loaded.store.jobs
		});
		if (writer) repairLoadedCronRuntimeAuthority(writer, {
			storeKey,
			jobIds: authority.repairJobIds
		});
	}
	return !writer ? loaded : {
		...loaded,
		jobsFingerprint: fingerprintCronJobRows(rows)
	};
}
function repairLoadedCronRuntimeAuthority(writer, params) {
	if (params.jobIds.length === 0) return;
	if (writer.write((db) => {
		const rows = loadCronRows(db, params.storeKey, new Set(params.jobIds));
		if (rows.length === 0) return false;
		const loaded = loadedCronStoreFromRows(rows);
		return repairCronRuntimeAuthorityRows({
			db,
			storeKey: params.storeKey,
			jobs: loaded.store.jobs,
			jobIds: params.jobIds
		});
	}, "cron.runtime-authority-repair")) writer.committed();
}
//#endregion
//#region src/cron/store/config-state.ts
function readCronStoreStatePath(env = process.env) {
	const value = readConfigMachineState("cron.store", { env });
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
//#region src/cron/store/paths.ts
function resolveDefaultCronDir(env) {
	return path.join(resolveConfigDir(env), "cron");
}
function resolveDefaultCronStorePath(env) {
	return path.join(resolveDefaultCronDir(env), "jobs.json");
}
/** Resolves the cron jobs store path, expanding home-relative user input. */
function resolveCronJobsStorePath(storePath, env = process.env, stateEnv = env) {
	const selected = storePath?.trim() || readCronStoreStatePath(stateEnv);
	if (selected) {
		const raw = selected.trim();
		if (raw.startsWith("~")) return path.resolve(expandHomePrefix(raw, { env }));
		return path.resolve(raw);
	}
	return resolveDefaultCronStorePath(env);
}
/** Resolves the active cron partition from runtime config and environment. */
function resolveCronJobsStorePathFromConfig(cfg, env = process.env, stateEnv = env) {
	const store = asOptionalRecord(cfg.cron)?.store;
	return resolveCronJobsStorePath(typeof store === "string" ? store : void 0, env, stateEnv);
}
//#endregion
//#region src/cron/store/quarantine.ts
/** Durable malformed-cron recovery records stored in the shared SQLite database. */
function cronQuarantineScope(storePath) {
	return `cron.quarantine:${cronStoreKey(storePath)}`;
}
function cronQuarantineEntryKey(entry) {
	const identity = JSON.stringify({
		sourceIndex: entry.sourceIndex,
		reason: entry.reason,
		job: entry.job ?? null,
		raw: entry.raw ?? null,
		state: entry.state ?? null,
		updatedAtMs: entry.updatedAtMs ?? null,
		scheduleIdentity: entry.scheduleIdentity ?? null
	});
	return createHash("sha256").update(identity).digest("hex");
}
/** Deletes quarantine rows inside the caller-owned SQLite transaction. */
function deleteCronQuarantinedJobsFromDatabase(params) {
	if (params.entries.length === 0) return;
	const scope = cronQuarantineScope(params.storePath);
	for (const entry of params.entries) executeSqliteQuerySync(params.database, getNodeSqliteKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", cronQuarantineEntryKey(entry)));
}
/** Reads quarantined cron rows without creating or migrating a state database. */
function loadCronQuarantinedJobs(storePath, env = process.env) {
	const scope = cronQuarantineScope(storePath);
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => JSON.parse(row.payload_json)), { env }) ?? [];
}
/** Writes recovery records into the caller-owned SQLite transaction when provided. */
function saveCronQuarantinedJobs(params) {
	if (params.entries.length === 0) return;
	const store = createSqliteAuditRecordStore({
		scope: cronQuarantineScope(params.storePath),
		maxEntries: Number.MAX_SAFE_INTEGER,
		...params.database ? { database: params.database } : {}
	});
	const records = params.entries.map((entry) => {
		const quarantinedAtMs = "quarantinedAtMs" in entry ? entry.quarantinedAtMs : params.nowMs;
		return {
			key: cronQuarantineEntryKey(entry),
			value: {
				...entry,
				quarantinedAtMs
			},
			createdAt: quarantinedAtMs
		};
	});
	store.registerLegacyMany(records);
}
//#endregion
//#region src/cron/store/save-error.ts
var CronJobsStoreChangedError = class extends Error {
	constructor(storePath) {
		super(`Cron store at ${storePath} changed after it was read; reload it before writing`);
		this.name = "CronJobsStoreChangedError";
	}
};
function restoreCronSaveError(error) {
	return error.kind === "store-changed" ? new CronJobsStoreChangedError(error.storePath) : restoreCronLoadError(error.error);
}
//#endregion
//#region src/cron/store/save.kernel.ts
function mergeCronRuntimeChanges(previous, next, current) {
	const merged = structuredClone(current);
	for (const key of /* @__PURE__ */ new Set([...Object.keys(previous), ...Object.keys(next)])) {
		if (isDeepStrictEqual(Reflect.get(previous, key), Reflect.get(next, key))) continue;
		if (Object.hasOwn(next, key)) Reflect.set(merged, key, structuredClone(Reflect.get(next, key)));
		else Reflect.deleteProperty(merged, key);
	}
	if (previous.runningAtMs !== next.runningAtMs) merged.runningReceiptId = next.runningAtMs === current.runningAtMs ? current.runningReceiptId : next.runningReceiptId;
	return merged;
}
function mergeCronRuntimeAuthority(previous, next, current) {
	const merged = { ...next };
	const source = !isDeepStrictEqual(previous.runtimeAuthority, next.runtimeAuthority) || previous.runtimeAuthorityRecoveryRequired !== next.runtimeAuthorityRecoveryRequired ? next : current;
	if (source.runtimeAuthority) merged.runtimeAuthority = source.runtimeAuthority;
	else delete merged.runtimeAuthority;
	if (source.runtimeAuthorityRecoveryRequired === true) merged.runtimeAuthorityRecoveryRequired = true;
	else delete merged.runtimeAuthorityRecoveryRequired;
	return merged;
}
function prepareCronStoreChanges(previous, next) {
	const previousById = new Map(previous.jobs.map((job) => [job.id, job]));
	const nextById = new Map(next.jobs.map((job) => [job.id, job]));
	return {
		previousById,
		nextById,
		changedIds: new Set([.../* @__PURE__ */ new Set([...previousById.keys(), ...nextById.keys()])].filter((jobId) => !isDeepStrictEqual(previousById.get(jobId), nextById.get(jobId))))
	};
}
/** Applies prepared changes inside the caller's synchronous write transaction. */
function saveCronStoreChangesInDatabase(db, storeKey, resolvedStorePath, prepared, opts, hooks) {
	const { previousById, nextById, changedIds } = prepared;
	const rows = loadCronRows(db, storeKey);
	const rowsById = new Map(rows.map((row) => [row.job_id, row]));
	const currentJobs = loadedCronStoreFromRows(rows).store.jobs;
	const authority = loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs: currentJobs
	});
	if (authority.repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs: currentJobs,
		jobIds: authority.repairJobIds
	});
	const currentById = new Map(currentJobs.map((job) => [job.id, job]));
	hooks?.beforeWrite?.(db);
	let nextSortOrder = rows.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;
	for (const jobId of changedIds) {
		const before = previousById.get(jobId);
		const after = nextById.get(jobId);
		const current = currentById.get(jobId);
		if (before && current && resolveCronJobConfigRevision(current) !== resolveCronJobConfigRevision(before)) throw new CronJobsStoreChangedError(resolvedStorePath);
		if (!after) {
			if (current) deleteCronJobRowInDatabase(db, storeKey, jobId);
			currentById.delete(jobId);
			continue;
		}
		if (before) {
			if (!current) throw new CronJobsStoreChangedError(resolvedStorePath);
		} else if (current && opts?.preserveConcurrentAdds) continue;
		else if (current) throw new CronJobsStoreChangedError(resolvedStorePath);
		const merged = current ? {
			...mergeCronRuntimeAuthority(before ?? after, after, current),
			state: mergeCronRuntimeChanges(before?.state ?? {}, after.state, current.state),
			updatedAtMs: Math.max(after.updatedAtMs, current.updatedAtMs)
		} : after;
		const persisted = upsertCronJobRow(db, storeKey, merged, rowsById.get(jobId)?.sort_order ?? nextSortOrder++);
		replaceCronRuntimeAuthorityRows({
			db,
			storeKey,
			jobs: [persisted]
		});
		currentById.set(jobId, persisted);
	}
	hooks?.afterWrite?.(db);
	return {
		version: 1,
		jobs: [...currentById.values()]
	};
}
function replaceCronStoreRowsInDatabase(db, storeKey, store, preserveRuntimeState) {
	const replaced = replaceCronRows(db, storeKey, store, { preserveRuntimeState });
	replaceCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs: replaced.jobs,
		preserveExistingForJobIds: preserveRuntimeState ? replaced.existingJobIds : void 0,
		writeMissingForJobIds: preserveRuntimeState ? replaced.legacyAuthorityJobIds : void 0
	});
}
function isCronRuntimeOnlySave(opts) {
	return opts?.stateOnly === true && !opts.quarantine?.entries.length && !opts.deleteQuarantineEntries?.length;
}
/** Persists a validated store inside the caller's synchronous write transaction. */
function saveCronStoreInDatabase(database, storeKey, store, opts, hooks) {
	const stateOnly = isCronRuntimeOnlySave(opts);
	hooks?.beforeWrite?.(database.db);
	if (opts?.quarantine?.entries.length) saveCronQuarantinedJobs({
		storePath: storeKey,
		entries: opts.quarantine.entries,
		nowMs: opts.quarantine.nowMs,
		database
	});
	if (opts?.deleteQuarantineEntries?.length) deleteCronQuarantinedJobsFromDatabase({
		database: database.db,
		storePath: storeKey,
		entries: opts.deleteQuarantineEntries
	});
	if (stateOnly) {
		updateCronRuntimeRows(database.db, storeKey, store);
		hooks?.afterWrite?.(database.db);
		return;
	}
	replaceCronStoreRowsInDatabase(database.db, storeKey, store, opts?.preserveRuntimeState === true);
	hooks?.afterWrite?.(database.db);
}
//#endregion
//#region src/cron/store/read-only.ts
function emptyLoadedCronStore() {
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
/** Loads cron jobs from existing SQLite state without creating or migrating it. */
async function loadCronJobsStoreWithConfigJobsReadOnly(storePath, env = process.env) {
	const statePath = resolveAssistantStateSqlitePath(env);
	if (!fs.existsSync(statePath)) return emptyLoadedCronStore();
	const storeKey = cronStoreKey(storePath);
	const preserveArtifacts = isArtifactPreservingStateRead();
	const assertExcluded = hasStateDatabaseSourceExclusion(statePath) ? prepareStateDatabaseSourceExclusion(statePath) : void 0;
	const coordinatorRuntime = captureStateDatabaseCoordinatorRuntime();
	const admission = !assertExcluded ? captureAssistantStateDatabaseReadAdmission(statePath) : void 0;
	const identity = admission?.identity ?? inspectDatabasePathIdentitySync(statePath);
	const canonicalPath = identity?.canonicalPath ?? path.resolve(statePath);
	const maintenance = getAssistantDatabaseMaintenanceScope();
	ensureSqliteLibrarySelected();
	const environment = { ...process.env };
	const environmentBytes = Object.entries(environment).reduce((bytes, [key, value]) => bytes + Buffer.byteLength(key) + Buffer.byteLength(value ?? ""), 0);
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("cronReadOnly"),
		workerOptions: { env: environment },
		maxWorkers: 1,
		sharedCompute: true
	});
	const controller = new AbortController();
	const producerSettled = createDeferredCore();
	let sourcePin;
	let prepared;
	let stagingRoot;
	let releaseSnapshot;
	let workerStopped = false;
	let cleaned = false;
	let cleanupPending;
	const cleanup = () => {
		if (cleaned) return Promise.resolve();
		return cleanupPending ??= (async () => {
			if (!workerStopped) {
				await pool.close();
				workerStopped = true;
			}
			await producerSettled.promise;
			releaseSnapshot?.();
			releaseSnapshot = void 0;
			if (prepared) {
				if (!await prepared.cleanupAsync()) throw new Error("Cron read-only state snapshot cleanup failed.");
				prepared = void 0;
			}
			if (stagingRoot) {
				if (!await removeTempDirectoryAsync(stagingRoot)) throw new Error("Cron read-only state snapshot cleanup failed.");
				stagingRoot = void 0;
			}
			sourcePin?.release();
			sourcePin = void 0;
			cleaned = true;
			unregister();
		})().finally(() => {
			cleanupPending = void 0;
		});
	};
	const resource = { async close(target) {
		if (!target || target.key === identity?.key || target.canonicalPath === canonicalPath) {
			controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed"));
			await cleanup();
		}
	} };
	const unregister = registerAssistantStateDatabaseAsyncResource(resource);
	const run = async () => {
		let loaded = emptyLoadedCronStore();
		try {
			maintenance?.own(resource, "shared-resources", () => resource.close());
			sourcePin = assertExcluded ? acquireStateDatabaseHandleLease({ databasePath: statePath }) : void 0;
			if (assertExcluded && preserveArtifacts) {
				prepared = prepareSqliteReadOnlyLocationSync(statePath);
				releaseSnapshot = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
			}
			if (preserveArtifacts && !assertExcluded) {
				stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, controller.signal, true);
				releaseSnapshot = retainSnapshotTempDirectory(stagingRoot);
			}
			const location = prepared?.location ?? statePath;
			controller.signal.throwIfAborted();
			assertExcluded?.();
			admission?.assertCurrent();
			const result = await pool.run({
				location,
				storeKey,
				stagingRoot,
				coordinatorRuntime
			}, {
				signal: controller.signal,
				inputBytes: Buffer.byteLength(location) + Buffer.byteLength(storeKey) + Buffer.byteLength(stagingRoot ?? "") + Buffer.byteLength(coordinatorRuntime.directory) + environmentBytes
			});
			if (!result.ok) throw restoreCronLoadError(result.error);
			loaded = result.loaded ?? loaded;
		} finally {
			producerSettled.resolve();
			await cleanup();
		}
		controller.signal.throwIfAborted();
		assertExcluded?.();
		admission?.assertCurrent();
		return loaded;
	};
	return await retainSnapshotWork(run(), () => controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed")));
}
//#endregion
//#region src/cron/store.ts
/** Public cron store load/save API backed entirely by shared SQLite state. */
const MAX_TRACKED_CRON_STORE_REVISIONS = 64;
const STALE_CRON_STORE_REVISION = -1;
const cronStoreRevisions = /* @__PURE__ */ new Map();
let nextCronStoreRevision = 0;
/** Reads the process-local committed revision for one canonical SQLite partition. */
function getCronJobsStoreRevision(storePath) {
	return cronStoreRevisions.get(cronStoreKey(storePath)) ?? nextCronStoreRevision;
}
function noteCronJobsStoreCommit(storeKey) {
	cronStoreRevisions.delete(storeKey);
	cronStoreRevisions.set(storeKey, ++nextCronStoreRevision);
	pruneMapToMaxSize(cronStoreRevisions, MAX_TRACKED_CRON_STORE_REVISIONS);
}
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
async function loadCronJobsStoreWithConfigJobs(storePath) {
	const storeKey = cronStoreKey(storePath);
	const context = captureAssistantStateWorkerContext();
	let received = false;
	try {
		return await runAssistantStateWorkerOperation(context, async (scope) => {
			const result = await scope.execute({
				type: "cron.loadMutable",
				input: { storeKey }
			});
			received = true;
			for (let index = 0; index < result.repairCommits; index += 1) noteCronJobsStoreCommit(storeKey);
			if (!result.ok) {
				if (result.repairCommits === 0) noteCronJobsStoreCommit(storeKey);
				throw restoreCronLoadError(result.error);
			}
			return result.loaded;
		});
	} catch (error) {
		if (!received) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
function loadMutableCronStore(storePath) {
	const database = openAssistantStateDatabase();
	const storeKey = cronStoreKey(path.resolve(storePath));
	return loadCronStoreFromDatabase(database.db, storeKey, {
		write: (operation, operationLabel) => runAssistantStateWriteTransaction(({ db }) => operation(db), { database }, { operationLabel }),
		committed: () => noteCronJobsStoreCommit(storeKey)
	});
}
function assertCronJobsStoreUnchanged(db, storePath, expectedJobsFingerprint) {
	const resolvedStorePath = path.resolve(storePath);
	if (readCronJobsFingerprint(db, cronStoreKey(resolvedStorePath)) !== expectedJobsFingerprint) throw new CronJobsStoreChangedError(resolvedStorePath);
}
/** Removes an owned declarative job family left under obsolete absolute store keys. */
function removeStaleCronJobFamilyRows(storePath, family) {
	const activeStoreKey = cronStoreKey(path.resolve(storePath));
	return runAssistantStateWriteTransaction(({ db }) => deleteStaleCronJobFamilyRows(db, activeStoreKey, family), {}, { operationLabel: "cron.job-family-adoption" });
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
	return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
/** Synchronously loads only the persisted cron job store payload. */
function loadCronJobsStoreSync(storePath) {
	return loadMutableCronStore(storePath).store;
}
function publishCronStoreSaveRevision(storeKey, observedRevision) {
	const unchanged = getCronJobsStoreRevision(storeKey) === observedRevision;
	noteCronJobsStoreCommit(storeKey);
	return unchanged ? nextCronStoreRevision : STALE_CRON_STORE_REVISION;
}
function commitCronStoreNative(storeKey, operation, hooks, operationLabel) {
	const observedRevision = getCronJobsStoreRevision(storeKey);
	let committed = false;
	try {
		const value = runAssistantStateWriteTransaction((database) => {
			const result = operation(database);
			deferSqlitePostCommitPublication(database.db, () => {
				committed = true;
			});
			return result;
		}, {}, operationLabel ? { operationLabel } : void 0);
		hooks?.afterCommit?.();
		return {
			value,
			revision: publishCronStoreSaveRevision(storeKey, observedRevision)
		};
	} catch (error) {
		if (committed) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
async function saveCronStoreWithWorker(storeKey, operation) {
	const observedRevision = getCronJobsStoreRevision(storeKey);
	const context = captureAssistantStateWorkerContext();
	let received = false;
	try {
		return await runAssistantStateWorkerOperation(context, async (scope) => {
			const result = await operation(scope);
			received = true;
			const revision = result.committed || !result.ok ? publishCronStoreSaveRevision(storeKey, observedRevision) : observedRevision;
			if (!result.ok) throw restoreCronSaveError(result.error);
			return {
				value: result.value,
				revision
			};
		});
	} catch (error) {
		if (!received) noteCronJobsStoreCommit(storeKey);
		throw error;
	}
}
/** Internal synchronous entry for callers whose authority callbacks must not yield before commit. */
function saveCronJobsStoreChangesWithRevisionNative(storePath, previous, next, opts) {
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return {
		value: previous,
		revision: getCronJobsStoreRevision(storeKey)
	};
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, ({ db }) => saveCronStoreChangesInDatabase(db, storeKey, storeKey, prepared, options, transactionHooks), transactionHooks, "cron.config-mutation");
}
/** Commits scheduler-disabled CRUD rows and retains this operation's revision fact. */
async function saveCronJobsStoreChangesWithRevision(storePath, previous, next, opts) {
	if (opts?.transactionHooks) return saveCronJobsStoreChangesWithRevisionNative(storePath, previous, next, opts);
	assertCronStoreCanPersist(next);
	const storeKey = cronStoreKey(path.resolve(storePath));
	const prepared = prepareCronStoreChanges(previous, next);
	if (prepared.changedIds.size === 0) return {
		value: previous,
		revision: getCronJobsStoreRevision(storeKey)
	};
	const { transactionHooks: _hooks, ...options } = opts ?? {};
	const input = structuredClone({
		storeKey,
		changes: prepared,
		options
	});
	return await saveCronStoreWithWorker(storeKey, (scope) => scope.execute({
		type: "cron.saveChanges",
		input
	}));
}
/** Commits only scheduler-disabled CRUD rows against authoritative SQLite state. */
async function saveCronJobsStoreChanges(storePath, previous, next, opts) {
	return (await saveCronJobsStoreChangesWithRevision(storePath, previous, next, opts)).value;
}
/** Internal synchronous entry preserving the caller's consumed guard/capture window. */
function saveCronJobsStoreWithRevisionNative(storePath, store, opts) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (!isCronRuntimeOnlySave(opts)) assertCronStoreCanPersist(store);
	const { transactionHooks, ...options } = opts ?? {};
	return commitCronStoreNative(storeKey, (database) => {
		saveCronStoreInDatabase(database, storeKey, store, options, transactionHooks);
	}, transactionHooks);
}
/** Persist cron data and return only this operation's publication revision. */
async function saveCronJobsStoreWithRevision(storePath, store, opts) {
	if (opts?.transactionHooks) return saveCronJobsStoreWithRevisionNative(storePath, store, opts);
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (!isCronRuntimeOnlySave(opts)) assertCronStoreCanPersist(store);
	const { transactionHooks: _hooks, ...options } = opts ?? {};
	const input = structuredClone({
		storeKey,
		store,
		options
	});
	return await saveCronStoreWithWorker(storeKey, (scope) => scope.execute({
		type: "cron.save",
		input
	}));
}
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
async function saveCronJobsStore(storePath, store, opts) {
	await saveCronJobsStoreWithRevision(storePath, store, opts);
}
/** Atomically acquire doctor migration metadata and replace cron rows only for the winner. */
async function saveCronJobsStoreWithMetadata(storePath, store, acquireMetadata, opts) {
	const resolvedStorePath = path.resolve(storePath);
	const storeKey = cronStoreKey(resolvedStorePath);
	assertCronStoreCanPersist(store);
	const committed = runAssistantStateWriteTransaction((database) => {
		if (!acquireMetadata(database.db)) return false;
		if (opts?.quarantine?.entries.length) saveCronQuarantinedJobs({
			storePath: resolvedStorePath,
			entries: opts.quarantine.entries,
			nowMs: opts.quarantine.nowMs,
			database
		});
		if (opts?.deleteQuarantineEntries?.length) deleteCronQuarantinedJobsFromDatabase({
			database: database.db,
			storePath: resolvedStorePath,
			entries: opts.deleteQuarantineEntries
		});
		replaceCronStoreRowsInDatabase(database.db, storeKey, store, opts?.preserveRuntimeState === true);
		return true;
	});
	if (committed) noteCronJobsStoreCommit(storeKey);
	return committed;
}
//#endregion
export { repairCronRuntimeAuthorityRows as S, loadCronQuarantinedJobs as _, loadCronJobsStoreWithConfigJobs as a, resolveCronJobsStorePathFromConfig as b, saveCronJobsStore as c, saveCronJobsStoreChangesWithRevisionNative as d, saveCronJobsStoreWithMetadata as f, CronJobsStoreChangedError as g, loadCronJobsStoreWithConfigJobsReadOnly as h, loadCronJobsStoreSync as i, saveCronJobsStoreChanges as l, saveCronJobsStoreWithRevisionNative as m, getCronJobsStoreRevision as n, noteCronJobsStoreCommit as o, saveCronJobsStoreWithRevision as p, loadCronJobsStore as r, removeStaleCronJobFamilyRows as s, assertCronJobsStoreUnchanged as t, saveCronJobsStoreChangesWithRevision as u, saveCronQuarantinedJobs as v, loadCronRuntimeAuthorities as x, resolveCronJobsStorePath as y };
