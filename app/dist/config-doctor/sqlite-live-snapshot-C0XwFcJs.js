import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-0M4tZV2c.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { d as sameFileIdentity$1, u as sameFileContentsSync } from "./fs-safe-advanced-CBSOsiER.js";
import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-BBHaqzpY.js";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-C8TndyjF.js";
import { a as sqliteReaderDatabasePathKey, n as readSqliteReaderDiagnosticsForPath } from "./sqlite-reader-lifecycle-CHO49mcb.js";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as requireNodeSqlite, s as resolveSqliteFilesystemPath, t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError, o as tryAcquireExclusiveSqliteCoordinator, r as ensurePrivateSqliteCoordinatorDirectory, s as tryAcquireSharedSqliteCoordinator, t as SqliteCoordinatorError } from "./sqlite-coordinator-olf_92pI.js";
import { d as withSqliteInspectionOperation, i as isSqliteLockError } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { r as getChildLogger } from "./logger-DmjW9g94.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { a as runSqliteImmediateTransactionSync, d as runWithSqliteBusyTimeout, l as normalizeSqliteNonNegativeInteger, t as assertTransactionUsable } from "./sqlite-transaction-C94DYooc.js";
import { c as removeTempDirectoryAsync, n as adoptPreparedLocation, s as removeTempDirectory, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-CwtWaSiY.js";
import { n as createSqliteSnapshotStagingDirectory, o as sqliteSnapshotStagingError, r as createSqliteSnapshotStagingDirectorySync, u as resolvePrivateSqliteSnapshotStagingRoot } from "./sqlite-snapshot-staging-D3DC29Jr.js";
import "./testclaw-state-db-contract-CdyGtChZ.js";
import "./sqlite-user-version-BppRXydv.js";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.js";
import { r as sha256HexPrefixCore } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DewCyJy9.js";
import fs, { realpathSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { copyFileDescriptorSync, readFileWindowFullySync } from "@testclaw/fs-safe/advanced";
import { MessageChannel } from "node:worker_threads";
import { performance as performance$1 } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
import { probeTreeClone } from "@testclaw/fs-safe/copy";
//#region src/infra/sqlite-backup.ts
async function backupNodeSqliteDatabase(source, targetPath) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		return await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath));
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/state/testclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
	return tableHasColumns(db, tableName, [columnName]);
}
function tableHasColumns(db, tableName, columnNames) {
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	const existing = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return columnNames.every((columnName) => existing.has(columnName));
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	return executeWithCachedStatement(db, "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName))?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
/** Missing runtime tables are empty only before state grows beyond checkpoint bootstrap. */
function hasAssistantStateTablesBeyondStartupCheckpoint(db) {
	return db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name NOT IN ('schema_meta', 'state_leases') LIMIT 1").get() !== void 0;
}
//#endregion
//#region src/state/testclaw-agent-db-metadata.ts
/** Read ownership metadata without loading runtime schema or migration owners. */
function readExistingAgentSchemaMeta(db) {
	if (!tableExists(db, "schema_meta")) return null;
	const row = db.prepare("SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	if (!row) return null;
	return {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
}
//#endregion
//#region src/infra/sqlite-number.ts
const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
function coerceRequiredSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
/** Converts a SQLite number or safely representable bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
	if (typeof value === "bigint") {
		if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) return;
		return Number(value);
	}
	return typeof value === "number" ? value : void 0;
}
//#endregion
//#region src/infra/sqlite-wal-checkpoint.ts
const checkpointListeners = resolveGlobalSingleton(Symbol.for("testclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
/** Maintenance consumers receive observations after the checkpoint owner records its outcome. */
function onSqliteWalCheckpoint(listener) {
	checkpointListeners.add(listener);
	return () => {
		checkpointListeners.delete(listener);
	};
}
/** A relayed worker result adds host observations without claiming visibility into other threads. */
function observeSqliteWalCheckpointHealth(databasePath, health) {
	const { activeReaders: previousReaders, readerDiagnostics: previousDiagnostics, ...observation } = health;
	if (health.state === "complete") return observation;
	const { activeReaders, ...local } = readSqliteReaderDiagnosticsForPath(databasePath);
	return {
		...observation,
		activeReaders: [...(previousReaders ?? []).filter((reader) => reader.threadId !== local.threadId), ...activeReaders].toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8),
		readerDiagnostics: [...(previousDiagnostics ?? []).filter((diagnostic) => diagnostic.threadId !== local.threadId), local].slice(-8)
	};
}
function notifyCheckpoint(databasePath, snapshot) {
	for (const listener of checkpointListeners) try {
		listener({
			databasePath: sqliteReaderDatabasePathKey(databasePath),
			health: structuredClone(snapshot.health),
			observedAtNs: snapshot.observedAtNs
		});
	} catch {}
}
/** Worker result transport relays the recorded fact and returns its enriched diagnostic snapshot. */
function publishSqliteWalCheckpointObservation(databasePath, snapshot) {
	const observed = {
		health: observeSqliteWalCheckpointHealth(databasePath, snapshot.health),
		observedAtNs: snapshot.observedAtNs
	};
	notifyCheckpoint(databasePath, observed);
	return observed;
}
function sqliteFileBytes(pathname) {
	try {
		return fs.statSync(pathname).size;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function readCheckpointResult(row) {
	const [busy, logFrames, checkpointedFrames] = Object.values(row ?? {}).map((value) => normalizeSqliteNumber(typeof value === "number" || typeof value === "bigint" ? value : null));
	if (busy === void 0 || logFrames === void 0 || checkpointedFrames === void 0) throw new Error("SQLite returned an invalid WAL checkpoint result");
	return {
		busy,
		logFrames,
		checkpointedFrames
	};
}
/** The maintenance lifecycle owns this checkpoint result and its last observation. */
function createSqliteWalCheckpoint(options, journalSizeLimitBytes) {
	let snapshot;
	const checkpointObservation = () => ({
		state: "error",
		observedAtMs: Date.now(),
		walBytes: null,
		databaseBytes: null,
		logFrames: null,
		checkpointedFrames: null,
		lastCompletedAtMs: snapshot?.health.lastCompletedAtMs ?? null,
		consecutiveBlocked: 0,
		warning: true
	});
	const recordCheckpointError = (error, observation = checkpointObservation()) => {
		const failed = {
			...observation,
			observedAtMs: Date.now(),
			state: "error",
			consecutiveBlocked: 0,
			warning: true,
			error: formatErrorMessage(error)
		};
		snapshot = {
			observedAtNs: process.hrtime.bigint(),
			health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, failed) : failed
		};
		if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		options.onCheckpointError?.(error);
	};
	const recordCheckpoint = (mode, row) => {
		const observedAtNs = process.hrtime.bigint();
		const observation = checkpointObservation();
		let busy;
		let sizeError;
		try {
			const { busy: busyResult, logFrames, checkpointedFrames } = readCheckpointResult(row);
			busy = busyResult !== 0;
			observation.logFrames = logFrames;
			observation.checkpointedFrames = checkpointedFrames;
			observation.state = busy || checkpointedFrames < logFrames ? "blocked" : "complete";
			if (observation.state === "complete") observation.lastCompletedAtMs = observation.observedAtMs;
			else observation.consecutiveBlocked = (snapshot?.health.consecutiveBlocked ?? 0) + 1;
			if (options.databasePath) try {
				observation.databaseBytes = sqliteFileBytes(options.databasePath);
				observation.walBytes = sqliteFileBytes(`${options.databasePath}-wal`);
			} catch (error) {
				sizeError = error;
				observation.error = formatErrorMessage(error);
			}
			observation.warning = observation.state === "blocked" && (observation.consecutiveBlocked >= 2 || observation.walBytes !== null && observation.databaseBytes !== null && observation.walBytes > Math.max(2 * observation.databaseBytes, journalSizeLimitBytes));
			snapshot = {
				observedAtNs,
				health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, observation) : observation
			};
			if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		} catch (error) {
			recordCheckpointError(error, observation);
			return false;
		}
		if (observation.error !== void 0) options.onCheckpointError?.(sizeError);
		if (busy || observation.warning) {
			const label = options.databaseLabel ?? "sqlite database";
			options.onCheckpointError?.(/* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} ${busy ? "remained busy" : "blocked by a reader"}`));
		}
		return observation.state === "complete";
	};
	return {
		record: recordCheckpoint,
		recordError: recordCheckpointError,
		inspectIdle(row) {
			const { busy, logFrames, checkpointedFrames } = readCheckpointResult(row);
			return busy === 0 && logFrames >= 0 && checkpointedFrames >= 0 && checkpointedFrames <= logFrames;
		},
		get health() {
			return snapshot ? structuredClone(snapshot.health) : void 0;
		},
		get snapshot() {
			return snapshot ? structuredClone(snapshot) : void 0;
		}
	};
}
//#endregion
//#region src/infra/sqlite-wal-reclamation.ts
const VACUUM_UNIT_TARGET_MS = 25;
const vacuumPageBudgets = /* @__PURE__ */ new WeakMap();
function createSqliteWalReclamationResult() {
	return {
		checkpointCompleted: false,
		freePagesBefore: null,
		remainingFreePages: null,
		checkpointCalls: 0,
		checkpointIncomplete: 0,
		checkpointMs: 0,
		checkpointMaxMs: 0,
		queryMs: 0,
		vacuumMs: 0,
		vacuumPasses: 0,
		vacuumPagesRequested: 0
	};
}
/** One online unit never waits for readers or adds vacuum frames behind a blocked checkpoint. */
function reclaimSqliteWalFreePages(database, runCheckpoint, options) {
	const result = createSqliteWalReclamationResult();
	const checkpoint = () => {
		options.beforeMutation?.();
		const startedAt = performance$1.now();
		try {
			const completed = runCheckpoint(options.checkpointMode ?? "TRUNCATE");
			result.checkpointCompleted = completed;
			result.checkpointCalls++;
			result.checkpointIncomplete += Number(!completed);
			return completed;
		} finally {
			const elapsed = performance$1.now() - startedAt;
			result.checkpointMs += elapsed;
			result.checkpointMaxMs = Math.max(result.checkpointMaxMs, elapsed);
		}
	};
	const freePages = () => {
		const startedAt = performance$1.now();
		try {
			return Number(database.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
		} finally {
			result.queryMs += performance$1.now() - startedAt;
		}
	};
	return runWithSqliteBusyTimeout(database, 0, () => {
		if (!checkpoint()) return result;
		const before = freePages();
		result.freePagesBefore = before;
		result.remainingFreePages = before;
		if (!Number.isSafeInteger(before) || before <= 0) return result;
		const pages = Math.min(vacuumPageBudgets.get(database) ?? 8, before, options.maxPages ?? 512);
		if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error("SQLite page reclamation requires a positive integer page limit");
		const startedAt = performance$1.now();
		let entered = false;
		let completed = false;
		try {
			runSqliteImmediateTransactionSync(database, () => {
				entered = true;
				options.beforeMutation?.();
				result.vacuumPasses++;
				result.vacuumPagesRequested += pages;
				database.exec(`PRAGMA incremental_vacuum(${pages});`);
				options.onCommit?.();
			}, {
				busyTimeoutMs: 0,
				operationLabel: "incremental-vacuum"
			});
			completed = true;
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			return result;
		} finally {
			const elapsedMs = performance$1.now() - startedAt;
			result.vacuumMs += elapsedMs;
			if (completed) vacuumPageBudgets.set(database, Math.max(1, Math.min(512, pages * 2, Math.floor(pages * VACUUM_UNIT_TARGET_MS / Math.max(elapsedMs, .001)))));
		}
		options.afterCommit?.();
		if (checkpoint()) result.remainingFreePages = freePages();
		return result;
	});
}
//#endregion
//#region src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH = "/proc/self/fd";
const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE = "SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup";
function statSqliteSidecarTarget(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	let descriptors;
	try {
		descriptors = fs.readdirSync(PROC_SELF_FD_PATH);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		let linkedPath;
		try {
			linkedPath = fs.readlinkSync(descriptorPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		let descriptor;
		try {
			descriptor = fs.fstatSync(Number(descriptorName), { bigint: true });
		} catch (error) {
			if (hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		try {
			if (fs.readlinkSync(descriptorPath) !== linkedPath) continue;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const target = statSqliteSidecarTarget(sidecarPath);
		if (!isSqliteWalSidecarSplitBrain(descriptor, target)) continue;
		return {
			event: "sqlite_wal_sidecar_identity_mismatch",
			databasePath,
			descriptorDevice: descriptor.dev.toString(),
			descriptorInode: descriptor.ino.toString(),
			sidecarPath,
			...target ? {
				targetDevice: target.dev.toString(),
				targetInode: target.ino.toString()
			} : {}
		};
	}
}
function terminateForSqliteWalSplitBrain(splitBrain, databaseLabel) {
	try {
		fs.writeSync(2, `${JSON.stringify({
			level: "fatal",
			subsystem: "infra/sqlite-wal",
			message: SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE,
			...splitBrain,
			databaseLabel,
			pid: process.pid
		})}\n`);
	} catch {}
	try {
		process.kill(process.pid, "SIGKILL");
	} finally {
		process.abort();
	}
}
//#endregion
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("testclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
function registerSqliteWalWriteAdmission(database, admit) {
	admissions.set(database, { admit });
}
function cancelSqliteWalWriteAdmission(database) {
	admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, onError, pageBudget) {
	let pending;
	return () => {
		if (!pending) {
			const run = async () => {
				let remaining = pageBudget;
				while (remaining > 0) {
					let reclaimed = 0;
					const admitted = () => {
						reclaimed = operation(remaining);
					};
					const admission = admissions.get(database);
					if (admission) await admission.admit(admitted);
					else admitted();
					remaining -= reclaimed;
					if (reclaimed <= 0 || remaining <= 0) return;
					await setImmediate();
				}
			};
			pending = run().catch(onError).finally(() => {
				pending = void 0;
			});
		}
		return pending;
	};
}
/** Retained Workers drain timer work only while their parent grants write admission. */
function registerDeferredSqliteWalWriteAdmission(database) {
	const existing = admissions.get(database)?.flush;
	if (existing) return existing;
	let pending;
	const flush = (assertCurrent) => {
		const current = pending;
		pending = void 0;
		if (current) try {
			assertCurrent();
			current.operation();
			current.resolve();
		} catch (error) {
			current.reject(error);
		}
		if (database.isOpen && database.isTransaction) assertTransactionUsable(database);
	};
	admissions.set(database, {
		admit: (operation) => new Promise((resolve, reject) => {
			pending = {
				operation,
				resolve,
				reject
			};
		}),
		flush,
		cancel: () => {
			pending?.resolve();
			pending = void 0;
		}
	});
	return flush;
}
//#endregion
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1e3;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 18e5;
const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES = 67108864;
const LINUX_NFS_SUPER_MAGIC = 26985;
const LINUX_SMB_SUPER_MAGIC = 20859;
const LINUX_CIFS_SUPER_MAGIC = 4283649346;
const LINUX_SMB2_SUPER_MAGIC = 4266872130;
const LINUX_V9FS_SUPER_MAGIC = 16914839;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const MOUNT_COMMAND_TIMEOUT_MS = 1e3;
const NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"cifs",
	"smbfs",
	"smb2",
	"smb3"
]);
const CROSS_VM_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"virtiofs",
	"fuse.virtiofs",
	"9p",
	"9p2000.l"
]);
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
const log = createSubsystemLogger("infra/sqlite-wal");
const runInSqliteMaintenanceContext = AsyncLocalStorage.snapshot();
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
	return normalizedTimeoutMs;
}
/** Restrict inspection connections without changing journal or persistence policy. */
function configureSqliteReadOnlyPragmas(db) {
	db.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
	if (db.prepare("PRAGMA page_count").get()?.page_count === 0) db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
* Configure lock retry before inspecting or mutating a fresh database header.
* Concurrent first opens can otherwise fail before schema transactions begin.
*/
function configureSqlitePreSchemaPragmas(db, options = {}) {
	if (options.busyTimeoutMs !== void 0) configureSqliteBusyTimeout(db, options.busyTimeoutMs);
	enableIncrementalAutoVacuumForFreshDatabase(db);
}
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs.realpathSync(current);
		return {
			canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
			originalPath: stats.isDirectory() ? current : path.dirname(current)
		};
	}
}
function parseProcMountInfoEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const separator = line.indexOf(" - ");
		if (separator === -1) continue;
		const fields = line.slice(0, separator).split(" ");
		const suffixFields = line.slice(separator + 3).split(" ");
		const mountPoint = fields[4];
		const fsType = suffixFields[0];
		if (mountPoint && fsType) entries.push({
			mountPoint: decodeMountInfoPath(mountPoint),
			fsType,
			...suffixFields[1] ? { source: decodeMountInfoPath(suffixFields[1]) } : {}
		});
	}
	return entries;
}
function parseMountCommandEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
		if (linuxMatch) {
			const source = linuxMatch[1];
			const mountPoint = linuxMatch[2];
			const fsType = linuxMatch[3];
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
			continue;
		}
		const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (bsdMatch) {
			const source = bsdMatch[1];
			const mountPoint = bsdMatch[2];
			const fsType = bsdMatch[3];
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
		}
	}
	return entries;
}
function isMountCommandTimeout(error) {
	return error !== null && typeof error === "object" && "code" in error && error.code === "ETIMEDOUT";
}
function readMountEntries() {
	try {
		return {
			ok: true,
			value: parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
		};
	} catch {}
	try {
		return {
			ok: true,
			value: parseMountCommandEntries(String(process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
				killSignal: "SIGKILL",
				timeout: MOUNT_COMMAND_TIMEOUT_MS
			})))
		};
	} catch (error) {
		return isMountCommandTimeout(error) ? {
			ok: false,
			error: "timeout"
		} : {
			ok: true,
			value: []
		};
	}
}
function isPathWithinMount(targetPath, mountPoint) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedMountPoint = path.resolve(mountPoint);
	return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`);
}
function isSshfsMountSource(source) {
	if (!source) return false;
	const normalized = source.toLowerCase();
	return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
	const normalized = entry.fsType.toLowerCase();
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) return "rollback";
	if (CROSS_VM_FILESYSTEM_TYPES.has(normalized) || normalized.startsWith("9p")) return "rollback";
	if (normalized === "fuse.sshfs") return "unsupported";
	if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) return "unsupported";
	return "wal";
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
function combineMountEntryJournalPolicies(targetPaths) {
	const mountResult = readMountEntries();
	if (!mountResult.ok) {
		const [originalPath, canonicalPath] = targetPaths;
		if (process.platform === "darwin" && originalPath === canonicalPath) try {
			if (probeTreeClone(canonicalPath) === "apfs") return "wal";
		} catch {}
		return "rollback";
	}
	const policies = new Set(targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value)));
	if (policies.has("unsupported")) return "unsupported";
	return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
	return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
	return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
	if (process.platform === "win32") {
		const normalizedTargetPath = path.win32.normalize(targetPath);
		if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
		if (isWindowsDrivePath(normalizedTargetPath)) try {
			return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		const filesystemType = fs.statfsSync(checkedPaths.canonicalPath).type;
		if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC || filesystemType === LINUX_V9FS_SUPER_MAGIC) return "rollback";
	} catch {
		return combineMountEntryJournalPolicies(mountLookupPaths);
	}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
function readJournalModeResult(row) {
	if (!row || typeof row !== "object") return null;
	const record = row;
	const value = record.journal_mode ?? Object.values(record)[0];
	return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
	return db.prepare("PRAGMA database_list;").all().find((row) => row.name === "main")?.file === "";
}
function requireRollbackJournalMode(db, options) {
	const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
	if (journalMode !== "delete") {
		const label = options.databaseLabel ?? "sqlite database";
		const location = options.databasePath ? ` at ${options.databasePath}` : "";
		throw new Error(`${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`);
	}
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
	const deadline = performance$1.now() + retryTimeoutMs;
	let restoreBusyTimeout = false;
	try {
		while (true) try {
			db.exec("PRAGMA journal_mode = WAL;");
			const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode;").get());
			if (journalMode === "wal") return true;
			if (journalMode === "memory" && hasInMemoryMainDatabase(db)) return false;
			const label = options.databaseLabel ?? "sqlite database";
			const location = options.databasePath ? ` at ${options.databasePath}` : "";
			throw new Error(`${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`);
		} catch (error) {
			const remainingMs = Math.max(0, deadline - performance$1.now());
			if (!isSqliteLockError(error) || remainingMs <= 0) throw error;
			if (!restoreBusyTimeout) {
				configureSqliteBusyTimeout(db, 0);
				restoreBusyTimeout = true;
			}
			Atomics.wait(JOURNAL_MODE_RETRY_SLEEP, 0, 0, Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs));
		}
	} finally {
		if (restoreBusyTimeout) configureSqliteBusyTimeout(db, retryTimeoutMs);
	}
}
function enableMacosCheckpointFullfsync(db) {
	if (process.platform !== "darwin") return;
	try {
		db.exec("PRAGMA checkpoint_fullfsync = 1;");
	} catch {}
}
function refuseUnsupportedFilesystem(options) {
	const label = options.databaseLabel ?? "sqlite database";
	const location = options.databasePath ? ` at ${options.databasePath}` : "";
	throw new Error(`${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`);
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
	const busyTimeoutMs = options.busyTimeoutMs === void 0 ? 0 : configureSqliteBusyTimeout(db, options.busyTimeoutMs);
	const autoCheckpointPages = normalizeSqliteNonNegativeInteger(options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeSqliteNonNegativeInteger(options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") {
		requireRollbackJournalMode(db, options);
		return {
			checkpoint: () => true,
			reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
			close: () => true
		};
	}
	if (!enableWalJournalMode(db, busyTimeoutMs, options)) return {
		checkpoint: () => true,
		reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
		close: () => true
	};
	enableMacosCheckpointFullfsync(db);
	db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fs.existsSync(options.databasePath) ? fs.realpathSync.native(options.databasePath) : void 0;
	let invalidated = false;
	let splitBrainDetectionEnabled = Boolean(tripwireDatabasePath);
	let splitBrainDetectionWarningLogged = false;
	const checkpointOwner = createSqliteWalCheckpoint(options, DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);
	const runCheckpoint = (mode) => {
		try {
			return checkpointOwner.record(mode, db.prepare(`PRAGMA wal_checkpoint(${mode});`).get());
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
	const runMaintenance = (operation) => {
		if (invalidated) return false;
		try {
			return options.runMaintenance ? options.runMaintenance(operation) : operation();
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
	const checkpoint = () => runMaintenance(() => runCheckpoint(checkpointMode));
	const reclaimFreePages = (reclaimOptions = {}) => {
		let result;
		let failure;
		runMaintenance(() => {
			try {
				result = reclaimSqliteWalFreePages(db, runCheckpoint, reclaimOptions);
				return result.checkpointCompleted;
			} catch (error) {
				failure = { error };
				throw error;
			}
		});
		if (failure) throw failure.error;
		if (!result) throw new Error("SQLite page reclamation owner is unavailable");
		return {
			...result,
			checkpoint: checkpointOwner.snapshot
		};
	};
	let timer = null;
	const maintain = createSqliteWalMaintenanceScheduler(db, (maxPages) => {
		if (!timer || invalidated) return 0;
		let reclaimedPages = 0;
		runMaintenance(() => {
			const reclaimed = reclaimSqliteWalFreePages(db, runCheckpoint, {
				checkpointMode: periodicCheckpointMode,
				maxPages
			});
			const checkpointed = reclaimed.checkpointCompleted;
			if (checkpointed && reclaimed.freePagesBefore !== null && reclaimed.remainingFreePages !== null) reclaimedPages = Math.min(reclaimed.vacuumPagesRequested, reclaimed.freePagesBefore - reclaimed.remainingFreePages);
			if (checkpointed && periodicCheckpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) runWithSqliteBusyTimeout(db, 0, () => runCheckpoint("TRUNCATE"));
			return checkpointed;
		});
		return reclaimedPages;
	}, (error) => checkpointOwner.recordError(error), 512);
	if (timerIntervalMs > 0) {
		timer = runInSqliteMaintenanceContext(() => setInterval(() => {
			if (!timer || invalidated) return;
			if (tripwireDatabasePath && splitBrainDetectionEnabled) {
				let splitBrain;
				try {
					splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
				} catch (error) {
					splitBrainDetectionEnabled = false;
					if (!splitBrainDetectionWarningLogged) {
						splitBrainDetectionWarningLogged = true;
						log.warn("SQLite WAL split-brain detection disabled", {
							databaseLabel: options.databaseLabel,
							databasePath: tripwireDatabasePath,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				}
				if (splitBrain) {
					invalidated = true;
					if (timer) {
						clearInterval(timer);
						timer = null;
					}
					terminateForSqliteWalSplitBrain(splitBrain, options.databaseLabel);
				}
			}
			maintain();
		}, timerIntervalMs));
		timer.unref?.();
	}
	return {
		get health() {
			return checkpointOwner.health;
		},
		checkpoint,
		reclaimFreePages,
		inspectIdle: () => runMaintenance(() => checkpointOwner.inspectIdle(db.prepare("PRAGMA wal_checkpoint(PASSIVE);").get())) ? "healthy" : "retire",
		close: (closeOptions) => {
			clearInterval(timer ?? void 0);
			timer = null;
			cancelSqliteWalWriteAdmission(db);
			if (invalidated) return false;
			return runMaintenance(() => runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode));
		}
	};
}
let lastSqliteExitGroup;
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
	const { foreignKeys, synchronous, ...walOptions } = options;
	const maintenance = configureSqliteWalMaintenance(db, walOptions);
	try {
		if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
		if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
		return maintenance;
	} catch (error) {
		try {
			maintenance.close();
		} catch (closeError) {
			throw createSqliteLifecycleAggregateError([error, closeError], "SQLite connection pragma configuration and WAL maintenance cleanup both failed.", error);
		}
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-schema-header.ts
function readSqliteWriterAppVersion(database) {
	try {
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select("app_version").where("meta_key", "=", "primary").limit(1));
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function sourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("SQLite snapshot aborted");
}
async function sleepForSnapshot(ms, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		const timer = setTimeout(finish, ms);
		const abort = () => finish(signal ? abortReason(signal) : void 0);
		function finish(error) {
			clearTimeout(timer);
			signal?.removeEventListener("abort", abort);
			if (error) reject(error);
			else resolve();
		}
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
	});
}
function snapshotRetryDelayMs(attempt) {
	if (attempt + 1 >= 10) return 0;
	return Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
}
function waitForSnapshotRetrySync(attempt) {
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
async function waitForSnapshotRetry(attempt, signal) {
	signal?.throwIfAborted();
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) await sleepForSnapshot(delayMs, signal);
}
function createSnapshotAttemptReporter(pathname, attempt, started) {
	return (operation, outcome, prepared, error) => {
		try {
			getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
				attempt: attempt + 1,
				copiedBytes: prepared ? fs.statSync(prepared.location).size : 0,
				durationMs: Math.max(0, performance.now() - started),
				operation,
				outcome,
				sourceMainBytes: sourceFileSize(pathname),
				sourceWalBytes: sourceFileSize(`${pathname}-wal`),
				owner: "path-reader",
				errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
			}, "SQLite snapshot operation completed.");
		} catch {}
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-wal-prefix.ts
const WAL_HEADER_BYTES = 32;
const COPY_BUFFER_BYTES = 1048576;
function readWalGeneration(descriptor) {
	const header = Buffer.alloc(WAL_HEADER_BYTES);
	if (readFileWindowFullySync(descriptor, header, 0) !== header.length) return;
	const magic = header.readUInt32BE(0);
	return magic === 931071618 || magic === 931071619 ? header : void 0;
}
function matchesCapturedWalPrefix(source, destination, bytes) {
	const copy = fs.openSync(destination, "r");
	try {
		const stat = fs.fstatSync(copy);
		if (!stat.isFile() || stat.size !== bytes) return false;
		const sourceBuffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, bytes));
		const copyBuffer = Buffer.allocUnsafe(sourceBuffer.length);
		for (let position = 0; position < bytes; position += sourceBuffer.length) {
			const length = Math.min(sourceBuffer.length, bytes - position);
			const sourceWindow = sourceBuffer.subarray(0, length);
			const copyWindow = copyBuffer.subarray(0, length);
			if (readFileWindowFullySync(source, sourceWindow, position) !== length || readFileWindowFullySync(copy, copyWindow, position) !== length || !sourceWindow.equals(copyWindow)) return false;
		}
		return true;
	} finally {
		fs.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function copySqliteWalPrefixSync(source, destination, copyMain, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	copyMain();
	const walBytes = fs.fstatSync(source).size;
	if (!Number.isSafeInteger(walBytes) || walBytes < generation.length) return false;
	const target = fs.openSync(destination, "wx", 384);
	try {
		const buffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, walBytes));
		for (let position = 0; position < walBytes;) {
			const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
			if (readFileWindowFullySync(source, window, position) !== window.length) return false;
			if (position === 0 && !window.subarray(0, generation.length).equals(generation)) return false;
			for (let offset = 0; offset < window.length;) {
				const written = fs.writeSync(target, window, offset, window.length - offset, position + offset);
				if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
				offset += written;
			}
			position += window.length;
		}
		fs.fsyncSync(target);
	} finally {
		fs.closeSync(target);
	}
	return verifyMainCopy() && matchesCapturedWalPrefix(source, destination, walBytes) && readWalGeneration(source)?.equals(generation) === true;
}
//#endregion
//#region src/infra/state-database-coordinator-delegate.ts
function createCoordinatorDelegate(identity, live, retained, revoke, label) {
	let channel;
	let revoked = false;
	return {
		get port() {
			if (revoked) throw new SqliteCoordinatorError(`${label} is closed`);
			if (!channel) {
				channel = new MessageChannel();
				channel.port1.postMessage({
					...identity,
					live: live.buffer
				});
				channel.port1.unref();
			}
			return channel.port2;
		},
		get closed() {
			return revoked && retained.closed;
		},
		release() {
			if (!revoked) {
				revoked = true;
				revoke();
				channel?.port1.close();
				channel?.port2.close();
			}
			retained.release();
		}
	};
}
const lifecycleScopes = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseLifecycleDelegateScopes"), () => new AsyncLocalStorage());
function acquireDelegatedLifecycleCoordinator(coordinatorPath) {
	const delegate = lifecycleScopes.getStore()?.get(coordinatorPath);
	if (!delegate) return;
	if (!delegate.active) throw new SqliteCoordinatorError("State lifecycle delegate scope is closed");
	delegate.assertCurrent();
	let closed = false;
	return {
		path: coordinatorPath,
		get closed() {
			return closed;
		},
		release() {
			closed = true;
		}
	};
}
//#endregion
//#region src/infra/state-database-coordinator-errors.ts
const StateDatabaseCoordinatorContentionError = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseCoordinatorContentionError"), () => class CoordinatorContentionError extends SqliteCoordinatorError {
	constructor(family) {
		super(`another Assistant process owns ${family}`);
		this.family = family;
		this.name = "StateDatabaseCoordinatorContentionError";
	}
});
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("testclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends SqliteCoordinatorError {
	constructor(databasePath, cause) {
		super(`Assistant refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, cause);
		this.name = "StateSchemaMutationConflictError";
	}
});
//#endregion
//#region src/infra/state-database-coordinator-paths.ts
function resolveCoordinatorIdentityPath(pathname) {
	const normalized = path.resolve(pathname);
	try {
		const resolved = path.resolve(realpathSync.native(normalized));
		if (process.platform !== "win32" || resolved === normalized) return resolved;
	} catch {}
	return resolvePathViaExistingAncestorSync$1(normalized);
}
function resolveLifecycleCoordinatorBase(params) {
	const canonicalDatabasePath = resolveCoordinatorIdentityPath(params.databasePath);
	const canonicalRuntimeDirectory = resolveCoordinatorIdentityPath(params.runtimeDirectory);
	const suffix = params.uid === void 0 ? "testclaw-state-locks" : `testclaw-state-locks-${params.uid}`;
	return {
		directory: path.join(canonicalRuntimeDirectory, suffix),
		databaseHash: sha256HexPrefixCore(canonicalDatabasePath, 8)
	};
}
function buildLifecycleCoordinatorPath(family, base) {
	return path.join(base.directory, `${family}.${base.databaseHash}.lock.sqlite`);
}
function resolveLifecycleCoordinatorPath(family, params) {
	return buildLifecycleCoordinatorPath(family, resolveLifecycleCoordinatorBase(params));
}
//#endregion
//#region src/infra/state-database-coordinator.ts
const { heldCoordinators, sourceReadScopes, canonicalWriteScopes, coordinatorRuntimeDirectories, gatewaySchemaScopes } = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseCoordinator"), () => ({
	heldCoordinators: /* @__PURE__ */ new Map(),
	sourceReadScopes: new AsyncLocalStorage(),
	canonicalWriteScopes: new AsyncLocalStorage(),
	coordinatorRuntimeDirectories: new AsyncLocalStorage(),
	gatewaySchemaScopes: new AsyncLocalStorage()
}));
function resolveStateLifecycleRuntimeDirectory() {
	const captured = coordinatorRuntimeDirectories.getStore();
	if (captured !== void 0) return captured.directory;
	return process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "Assistant", "locks") : "/tmp";
}
/** Capture the directory owner's retention policy before crossing an async or worker boundary. */
function captureStateDatabaseCoordinatorRuntime() {
	const captured = coordinatorRuntimeDirectories.getStore();
	return captured ? { ...captured } : {
		directory: resolveStateLifecycleRuntimeDirectory(),
		keepAlive: true
	};
}
function withStateDatabaseCoordinatorRuntimeDirectory(runtime, operation) {
	const captured = typeof runtime === "string" ? {
		directory: runtime,
		keepAlive: false
	} : { ...runtime };
	return coordinatorRuntimeDirectories.run(captured, operation);
}
function resolveStateDatabaseCoordinatorPath(params) {
	return resolveLifecycleCoordinatorPath("state-lifecycle", params);
}
function acquireLifecycleCoordinator(family, params, { keepAlive = false, gatewayOwner = false } = {}) {
	const coordinatorPath = params.coordinatorPath ?? resolveLifecycleCoordinatorPath(family, {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	if (family === "state-lifecycle") {
		const delegate = acquireDelegatedLifecycleCoordinator(coordinatorPath);
		if (delegate) return delegate;
	}
	let held = heldCoordinators.get(coordinatorPath);
	if (held) {
		if (held.references === 0) throw new SqliteCoordinatorError(`${family} coordinator cleanup is pending; retry its close before reacquiring`);
		held.references += 1;
		held.keepAlive &&= keepAlive;
	} else {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(coordinatorPath), `${family} coordinator`);
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError(family);
		held = {
			coordinator,
			references: 1,
			keepAlive,
			gatewayOwners: 0,
			gatewayDelegates: /* @__PURE__ */ new Set()
		};
		heldCoordinators.set(coordinatorPath, held);
	}
	if (gatewayOwner) held.gatewayOwners += 1;
	const owner = held;
	let relinquished = false;
	let settled = false;
	return {
		path: coordinatorPath,
		get closed() {
			return settled || relinquished && owner.coordinator.closed;
		},
		release: () => {
			if (settled) return;
			if (!relinquished) {
				relinquished = true;
				if (gatewayOwner) {
					owner.gatewayOwners -= 1;
					if (owner.gatewayOwners === 0) for (const delegate of owner.gatewayDelegates) Atomics.store(delegate, 0, 0);
				}
				owner.references -= 1;
			}
			if (owner.references > 0) {
				settled = true;
				return;
			}
			try {
				owner.coordinator.release(owner.keepAlive ? void 0 : { keepAlive: false });
			} catch (error) {
				throw new SqliteCoordinatorError(`failed to release ${family} coordinator`, error);
			} finally {
				if (owner.coordinator.closed) {
					settled = true;
					if (heldCoordinators.get(coordinatorPath) === owner) heldCoordinators.delete(coordinatorPath);
				}
			}
		}
	};
}
function acquireGatewayLifecycleCoordinator(params) {
	return acquireLifecycleCoordinator("gateway-lifecycle", params, { gatewayOwner: true });
}
/** Maintenance lends schema access only to jobs admitted through its lexical resource scope. */
function acquireGatewayMaintenanceCoordinator(params) {
	const lease = acquireLifecycleCoordinator("gateway-lifecycle", params);
	return {
		...lease,
		get closed() {
			return lease.closed;
		},
		createSchemaFenceDelegate(target) {
			if (resolveGatewaySchemaFencePath(target) !== lease.path) return;
			if (lease.closed) throw new SqliteCoordinatorError("Gateway maintenance coordinator is closed");
			const retained = acquireLifecycleCoordinator("gateway-lifecycle", {
				...target,
				coordinatorPath: lease.path
			});
			const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
			Atomics.store(live, 0, 1);
			return createCoordinatorDelegate({
				actorId: target.actorId,
				coordinatorPath: lease.path
			}, live, retained, () => Atomics.store(live, 0, 0), "Gateway maintenance schema delegate");
		}
	};
}
function resolveGatewaySchemaFencePath(params) {
	return resolveLifecycleCoordinatorPath("gateway-lifecycle", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
}
/** Legacy cleanup must exclude new admission without borrowing a process-local owner. */
function tryAcquireGatewayLifecycleCleanupCoordinator(params) {
	const pathname = resolveGatewaySchemaFencePath(params);
	ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "gateway-lifecycle coordinator");
	return tryAcquireExclusiveSqliteCoordinator(pathname, { busyTimeoutMs: 0 });
}
/** True only while this process retains the native Gateway-role coordinator. */
function hasGatewayLifecycleCoordinator(params) {
	return (heldCoordinators.get(resolveGatewaySchemaFencePath(params))?.gatewayOwners ?? 0) > 0;
}
/** The broker owns this pin until backend close acknowledges or worker exit joins. */
function tryCreateGatewaySchemaFenceDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveGatewaySchemaFencePath(params);
	const owner = heldCoordinators.get(coordinatorPath);
	if (!owner || owner.gatewayOwners === 0) return;
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const retained = acquireLifecycleCoordinator("gateway-lifecycle", {
		...params,
		coordinatorPath
	});
	Atomics.store(live, 0, 1);
	owner.gatewayDelegates.add(live);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
		owner.gatewayDelegates.delete(live);
	}, "Gateway schema delegate");
}
/** Each broker job retains its parent's physical lifecycle lease through settlement. */
function tryCreateStateLifecycleDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	if (!heldCoordinators.has(coordinatorPath)) return;
	const retained = acquireStateDatabaseCoordinator({ databasePath: params.databasePath });
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	Atomics.store(live, 0, 1);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
	}, "State lifecycle delegate");
}
/** Borrow only a coordinator already owned by this process. The returned
* reference must remain held until the participating worker has exited. */
function retainHeldStateDatabaseCoordinator(databasePath) {
	const pathname = resolveStateDatabaseCoordinatorPath({
		databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	return heldCoordinators.has(pathname) ? acquireStateDatabaseCoordinator({
		databasePath,
		busyTimeoutMs: 0
	}) : void 0;
}
const shouldKeepStateCoordinatorAlive = (params) => params.keepAlive !== false && params.coordinatorPath === void 0 && params.runtimeDirectory === void 0 && (coordinatorRuntimeDirectories.getStore()?.keepAlive ?? true);
function acquireStateDatabaseCoordinator(params) {
	const keepAlive = shouldKeepStateCoordinatorAlive(params);
	const base = resolveLifecycleCoordinatorBase({
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const handlesPath = buildLifecycleCoordinatorPath("state-handles", base);
	const writeScope = canonicalWriteScopes.getStore()?.get(handlesPath);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return acquireLifecycleCoordinator("state-lifecycle", params, { keepAlive: shouldKeepStateCoordinatorAlive(params) });
	} else if (heldCoordinators.has(handlesPath)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return acquireLifecycleCoordinator("state-lifecycle", {
		...params,
		coordinatorPath: params.coordinatorPath ?? buildLifecycleCoordinatorPath("state-lifecycle", base)
	}, { keepAlive });
}
/** Fence schema mutation against another process's live Gateway owner. */
function withStateSchemaFence(params, operation) {
	const delegatePath = resolveGatewaySchemaFencePath(params);
	const delegate = gatewaySchemaScopes.getStore()?.get(delegatePath);
	if (delegate) {
		if (!delegate.active) throw new SqliteCoordinatorError("Gateway schema delegate scope is closed");
		delegate.assertCurrent();
		return runWithSqliteCoordinator({ release() {} }, "state schema mutation", operation);
	}
	let coordinator;
	try {
		coordinator = acquireLifecycleCoordinator("gateway-lifecycle", {
			...params,
			coordinatorPath: delegatePath,
			busyTimeoutMs: 0
		});
	} catch (error) {
		if (error instanceof StateDatabaseCoordinatorContentionError) throw new StateSchemaMutationConflictError(params.databasePath, error);
		throw error;
	}
	return runWithSqliteCoordinator(coordinator, "state schema mutation", operation);
}
function resolveStateDatabaseHandleReadContext(params) {
	const pathname = params.coordinatorPath ?? resolveLifecycleCoordinatorPath("state-handles", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const writeScope = canonicalWriteScopes.getStore()?.get(pathname);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return {
			pathname,
			scope: writeScope
		};
	}
	const sourceScope = sourceReadScopes.getStore()?.get(pathname);
	if (sourceScope?.active) {
		sourceScope.assertCurrent();
		return {
			pathname,
			scope: sourceScope
		};
	}
	if (heldCoordinators.has(pathname)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return {
		pathname,
		scope: void 0
	};
}
/** Validate the caller's local authority; the executing copy worker acquires the native lease. */
function assertStateDatabaseSourceReadContext(databasePath) {
	resolveStateDatabaseHandleReadContext({ databasePath });
}
/** A live cached connection excludes file publication, not other cached connections. */
function acquireStateDatabaseHandleLease(params) {
	const { pathname, scope } = resolveStateDatabaseHandleReadContext(params);
	if (scope) return scope.pin();
	return withSqliteInspectionOperation("coordinator", () => {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "state-handles coordinator");
		const coordinator = tryAcquireSharedSqliteCoordinator(pathname, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive: shouldKeepStateCoordinatorAlive(params)
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError("state-handles");
		return coordinator;
	});
}
/** Acquire only after closing local cached owners under the state lifecycle gate. */
function acquireStateDatabaseHandleExclusion(params) {
	const coordinator = acquireLifecycleCoordinator("state-handles", params);
	const owner = heldCoordinators.get(coordinator.path);
	if (!owner || owner.references !== 1) {
		coordinator.release();
		throw new StateDatabaseCoordinatorContentionError("state-handles");
	}
	let released = false;
	const assertCurrent = () => {
		if (released || heldCoordinators.get(coordinator.path) !== owner) throw new SqliteCoordinatorError("SQLite source exclusion is no longer current");
	};
	const pin = () => {
		assertCurrent();
		return acquireLifecycleCoordinator("state-handles", {
			...params,
			coordinatorPath: coordinator.path
		});
	};
	return {
		assertCurrent,
		release() {
			released = true;
			coordinator.release();
		},
		runWithCanonicalWrites(assertAuthority, operation) {
			const retained = pin();
			const scope = {
				active: true,
				assertCurrent: () => {
					assertCurrent();
					assertAuthority();
				},
				pin
			};
			const scopes = new Map(canonicalWriteScopes.getStore());
			scopes.set(coordinator.path, scope);
			try {
				return runWithSqliteCoordinator(retained, "SQLite binding write scope", () => {
					scope.assertCurrent();
					return { result: canonicalWriteScopes.run(scopes, operation) };
				}).result;
			} finally {
				scope.active = false;
			}
		},
		async runWithSourceReads(operation) {
			const retained = pin();
			const scope = {
				active: true,
				assertCurrent,
				pin
			};
			const scopes = new Map(sourceReadScopes.getStore());
			scopes.set(coordinator.path, scope);
			let result;
			try {
				result = await sourceReadScopes.run(scopes, () => operation(assertCurrent));
				assertCurrent();
			} catch (error) {
				scope.active = false;
				try {
					retained.release();
				} catch (releaseError) {
					throw createSqliteLifecycleAggregateError([error, releaseError], "SQLite excluded read and release both failed", error);
				}
				throw error;
			}
			scope.active = false;
			retained.release();
			return result;
		}
	};
}
function resolveSourceScopePath(databasePath) {
	return resolveLifecycleCoordinatorPath("state-handles", {
		databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
}
/** Only a live process-local exclusion owner may copy its already-drained source. */
function hasStateDatabaseSourceExclusion(databasePath) {
	const pathname = resolveSourceScopePath(databasePath);
	const scope = sourceReadScopes.getStore()?.get(pathname);
	if (!scope?.active) return false;
	scope.assertCurrent();
	return true;
}
/** Capture this exact excluded read interval before asynchronous preparation. */
function prepareStateDatabaseSourceExclusion(databasePath) {
	const pathname = resolveSourceScopePath(databasePath);
	const scope = sourceReadScopes.getStore()?.get(pathname);
	if (!scope) return;
	const assertCurrent = () => {
		if (!scope.active || sourceReadScopes.getStore()?.get(pathname) !== scope) throw new SqliteCoordinatorError("SQLite excluded read scope is closed or no longer current");
		scope.assertCurrent();
	};
	assertCurrent();
	return assertCurrent;
}
//#endregion
//#region src/infra/sqlite-source-handle.ts
function withSqliteSourceHandle(pathname, operation) {
	return runWithSqliteCoordinator(acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}), "SQLite source read", operation);
}
/** The executing source-copy child holds its own lease, including after parent loss. */
async function withSqliteSourceHandleAsync(pathname, operation) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	let result;
	try {
		result = await operation();
	} catch (error) {
		try {
			lease.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([error, releaseError], "SQLite source read and handle release both failed", error);
		}
		throw error;
	}
	lease.release();
	return result;
}
/** Revalidate every caller before it can join process-global snapshot work. */
function assertSqliteSourceReadAllowed(pathname) {
	acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}).release();
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const SQLITE_HEADER_BYTES = 20;
const SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS = 3e4;
const SQLITE_READONLY_RESULT_CODE = 8;
const SQLITE_RESULT_CODE_MASK = 255;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function sameSidecars(left, right) {
	return left.journal === right.journal && left.shm === right.shm && left.wal === right.wal;
}
function openPinnedFile(pathname) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity$1(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity$1(file.identity, opened) || !sameFileIdentity$1(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fs.openSync(targetPath, "wx", 384);
		copyFileDescriptorSync(source.descriptor, target);
		fs.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fs.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath) {
	const source = openPinnedFile(sourcePath);
	let copy;
	try {
		copy = fs.openSync(copyPath, "r");
		if (!fs.fstatSync(copy).isFile()) return false;
		const equal = sameFileContentsSync(source.descriptor, copy);
		assertPinnedIdentityUnchanged(source);
		return equal;
	} finally {
		try {
			if (copy !== void 0) fs.closeSync(copy);
		} finally {
			fs.closeSync(source.descriptor);
		}
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fs.rmSync(targetPath, { force: true });
	fs.renameSync(sourcePath, targetPath);
}
function isSqliteReadOnlyError(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		const details = current;
		if (typeof details.errcode === "number" && (details.errcode & SQLITE_RESULT_CODE_MASK) === SQLITE_READONLY_RESULT_CODE) return true;
		current = details.cause;
	}
	return false;
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs.openSync(journalPath, "r");
	try {
		const size = fs.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs.closeSync(descriptor);
	}
}
function recoverPrivateJournalCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fs.openSync(snapshotPath, "r+");
	try {
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs.existsSync(staged)) fs.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot()) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copied = copySqliteWalPrefixSync(wal.descriptor, `${snapshotPath}-wal`, () => copySourceFile(pathname, snapshotPath), () => sourceMatchesCopy(pathname, snapshotPath));
				assertPinnedIdentityUnchanged(wal);
				if (copied === false) throw new SqliteSourceChangedError(`SQLite WAL generation changed while copying: ${pathname}`);
				copiedWalPrefix = copied === true;
			} finally {
				fs.closeSync(wal.descriptor);
			}
		}
		const sidecarSuffixes = [...sidecars.journal ? ["-journal"] : [], ...sidecars.wal ? ["-wal"] : []];
		if (copiedWalPrefix) assertExpectedSidecars(pathname, sidecars);
		else if (sidecarSuffixes.length > 0) {
			for (const suffix of sidecarSuffixes) copySourceFile(`${pathname}${suffix}`, `${snapshotPath}${suffix}`);
			copySourceFile(pathname, snapshotPath);
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			copySourceFile(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			replaceFile(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw sqliteSnapshotStagingError(tempDir ?? stagingRoot, error, !tempDir);
	}
}
async function createStableReadOnlyCopy(pathname, journalMode, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	try {
		return createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw error;
	}
}
/** Native reads may create WAL-index files; callers need an isolated child or a private source. */
async function createOnlineReadOnlyBackup(pathname, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	const snapshotPath = path.join(tempDir, "database.sqlite.partial");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = withSqliteInspectionOperation("source", () => openNodeSqliteDatabase(pathname, { readOnly: true }));
		try {
			source.exec(`PRAGMA busy_timeout = ${SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF; BEGIN;`);
			source.prepare("PRAGMA schema_version;").get();
			await retainSnapshotWork(backupNodeSqliteDatabase(source, snapshotPath));
			source.exec("ROLLBACK;");
		} finally {
			if (source.isOpen) source.close();
		}
		const snapshot = openNodeSqliteDatabase(snapshotPath);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		const descriptor = fs.openSync(snapshotPath, "r+");
		try {
			fs.fsyncSync(descriptor);
		} finally {
			fs.closeSync(descriptor);
		}
		return publishPreparedCopy(tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw sqliteSnapshotStagingError(tempDir, error);
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
* In-process reads require drained source handles or a separate child: source
* close() must not release another live SQLite owner's POSIX locks.
*/
async function prepareReadOnlySourceInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const started = performance.now();
		const report = createSnapshotAttemptReporter(canonicalPath, attempt, started);
		let journalMode;
		try {
			journalMode = readSourceJournalMode(canonicalPath);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		if (journalMode === "empty") try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, journalMode, stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) {
				report("raw-copy", "error", void 0, error);
				throw error;
			}
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		const sidecars = readSourceSidecars(canonicalPath);
		if (journalMode !== "wal" || sidecars.wal && sidecars.shm) try {
			const prepared = await createOnlineReadOnlyBackup(canonicalPath, stagingRoot, signal);
			report("online-backup", "success", prepared);
			return prepared;
		} catch (error) {
			signal?.throwIfAborted();
			let currentMode;
			try {
				currentMode = readSourceJournalMode(canonicalPath);
			} catch (inspectionError) {
				if (!(inspectionError instanceof SqliteSourceChangedError)) throw inspectionError;
				lastChange = inspectionError;
				continue;
			}
			const currentSidecars = readSourceSidecars(canonicalPath);
			if (currentMode === "rollback" && currentSidecars.journal) {
				if (!isSqliteReadOnlyError(error)) throw error;
				try {
					const prepared = await createStableReadOnlyCopy(canonicalPath, "rollback", stagingRoot, signal);
					report("raw-copy", "success", prepared);
					return prepared;
				} catch (copyError) {
					if (!(copyError instanceof SqliteSourceChangedError)) throw copyError;
					lastChange = copyError;
					await waitForSnapshotRetry(attempt, signal);
					continue;
				}
			}
			if (currentMode !== "wal" || currentSidecars.wal && currentSidecars.shm) throw error;
			lastChange = error instanceof Error ? error : new Error(String(error));
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, "wal", stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
		}
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareReadOnlySourceSyncInProcess(pathname, stagingRoot) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath), void 0, stagingRoot);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	return withSqliteSourceHandleAsync(pathname, () => prepareReadOnlySourceInProcess(pathname, stagingRoot, signal));
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) {
	return withSqliteSourceHandle(pathname, () => prepareReadOnlySourceSyncInProcess(pathname, stagingRoot));
}
async function prepareSqliteReadOnlyLocationFromOwnedDatabase(database, assertCurrent, signal, cleanupMode) {
	signal?.throwIfAborted();
	assertCurrent();
	if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
	const directory = await createSqliteSnapshotStagingDirectory(void 0, false, signal, cleanupMode === "async");
	try {
		signal?.throwIfAborted();
		assertCurrent();
		if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
		const location = path.join(directory, "database.sqlite.partial");
		await retainSnapshotWork(backupNodeSqliteDatabase(database, location));
		signal?.throwIfAborted();
		assertCurrent();
		return publishPreparedCopy(directory);
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw createSqliteLifecycleAggregateError(errors, "Owned SQLite snapshot preparation and cleanup failed", error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("testclaw.sqliteSnapshotFlights"), () => /* @__PURE__ */ new Map());
async function waitForFlight(promise, signal, withdraw) {
	if (signal?.aborted) {
		withdraw();
		signal.throwIfAborted();
	}
	if (!signal) return promise;
	return await new Promise((resolve, reject) => {
		const release = () => signal.removeEventListener("abort", abort);
		const abort = () => {
			release();
			withdraw();
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("SQLite snapshot aborted"));
		};
		signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			release();
			resolve(value);
		}, (error) => {
			release();
			reject(error instanceof Error ? error : new Error(String(error)));
		});
		if (signal.aborted) abort();
	});
}
function cleanupUnleasedFlight(key, flight) {
	if (flight.waiters > 0 || flight.leases > 0) return;
	if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
	if (!flight.base) flight.controller.abort();
}
function releaseFlight(key, flight, asyncCleanup) {
	if (flight.leases > 1 || flight.waiters > 0) {
		flight.leases -= 1;
		return asyncCleanup ? Promise.resolve(true) : true;
	}
	const finish = (cleaned) => {
		if (cleaned) {
			flight.leases -= 1;
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
		}
		return cleaned;
	};
	return asyncCleanup ? flight.base.cleanupAsync().then(finish) : finish(flight.base.cleanup());
}
function leaseFlight(key, flight, base) {
	flight.leases += 1;
	let active = true;
	let pending;
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup: () => {
			if (!active) return true;
			if (pending) return false;
			const cleaned = releaseFlight(key, flight, false);
			active = !cleaned;
			return cleaned;
		},
		cleanupAsync: () => {
			if (!active) return pending ?? Promise.resolve(true);
			pending ??= releaseFlight(key, flight, true).then((cleaned) => {
				active = !cleaned;
				return cleaned;
			}).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
async function prepareSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flight = snapshotFlights.get(key);
	if (!flight) {
		const controller = new AbortController();
		const waitersDrained = createDeferredCore();
		const produced = Promise.resolve().then(() => producer(controller.signal, (error) => {
			flight.cleanupFailure ??= { error };
		}));
		flight = {
			controller,
			leases: 0,
			waiters: 0,
			promise: produced,
			settled: produced,
			finishWaiters: () => waitersDrained.resolve()
		};
		snapshotFlights.set(key, flight);
		flight.promise = produced.then((base) => {
			flight.base = base;
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
			return base;
		}, (error) => {
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
			throw error;
		});
		flight.settled = retainSnapshotWork(flight.promise.then(async (base) => {
			await waitersDrained.promise;
			if (flight.leases === 0) try {
				if (!await base.cleanupAsync()) throw new Error("SQLite orphan snapshot cleanup did not complete");
			} catch (error) {
				flight.cleanupFailure ??= { error };
				try {
					getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ cleanupRoot: base.cleanupRoot }, "SQLite orphan snapshot cleanup failed; retained for cleanup retry.");
				} catch {}
				throw error;
			}
			return base;
		}), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
		flight.settled.catch(() => void 0);
	}
	lifecycle?.trackProducer?.(flight.settled);
	flight.waiters += 1;
	let waiting = true;
	const withdraw = () => {
		if (!waiting) return;
		waiting = false;
		flight.waiters -= 1;
		if (flight.waiters === 0) flight.finishWaiters();
		cleanupUnleasedFlight(key, flight);
	};
	let outcome;
	try {
		const base = await waitForFlight(flight.promise, signal, withdraw);
		signal?.throwIfAborted();
		outcome = { value: leaseFlight(key, flight, base) };
	} catch (error) {
		outcome = { error };
	}
	withdraw();
	if (flight.waiters === 0 && flight.leases === 0 && !lifecycle?.trackProducer) try {
		await flight.settled;
	} catch {
		if (flight.cleanupFailure) throw flight.cleanupFailure.error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("testclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
function readSourceSizes(pathname) {
	const size = (candidate) => {
		try {
			const stat = fs.statSync(candidate);
			return stat.isFile() ? stat.size : 0;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return 0;
			throw error;
		}
	};
	return {
		sourceMainBytes: size(pathname),
		sourceWalBytes: size(`${pathname}-wal`)
	};
}
function emitLiveSnapshotTelemetry(fields, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
			...fields,
			errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
		}, "SQLite snapshot operation completed.");
	} catch {}
}
function registerLiveSqliteSnapshotOwner(options) {
	const identity = readDatabasePathIdentitySync(options.databasePath);
	const registration = {
		assertCurrent: options.assertCurrent,
		database: options.database,
		owner: options.owner
	};
	liveOwners.set(identity.key, registration);
	return () => {
		if (liveOwners.get(identity.key) === registration) liveOwners.delete(identity.key);
	};
}
function prepareSqliteSnapshotFromLiveOwner(databasePath, signal) {
	signal?.throwIfAborted();
	const identity = readDatabasePathIdentitySync(databasePath);
	const owner = liveOwners.get(identity.key);
	if (!owner) return;
	owner.assertCurrent();
	return prepareSingleFlightSqliteSnapshot(identity.canonicalPath, `live-owner:${owner.owner}`, async (flightSignal) => {
		const sizes = readSourceSizes(identity.canonicalPath);
		const started = performance.now();
		try {
			const prepared = await prepareSqliteReadOnlyLocationFromOwnedDatabase(owner.database, owner.assertCurrent, flightSignal);
			emitLiveSnapshotTelemetry({
				...sizes,
				attempt: 1,
				copiedBytes: fs.statSync(prepared.location).size,
				durationMs: Math.max(0, performance.now() - started),
				operation: "online-backup",
				outcome: "success",
				owner: owner.owner,
				waitMs: 0
			});
			return prepared;
		} catch (error) {
			emitLiveSnapshotTelemetry({
				...sizes,
				attempt: 1,
				copiedBytes: 0,
				durationMs: Math.max(0, performance.now() - started),
				operation: "online-backup",
				outcome: "error",
				owner: owner.owner,
				waitMs: 0
			}, error);
			throw error;
		}
	}, signal);
}
//#endregion
export { configureSqliteConnectionPragmas as A, publishSqliteWalCheckpointObservation as B, tryCreateGatewaySchemaFenceDelegate as C, StateDatabaseCoordinatorContentionError as D, withStateSchemaFence as E, runInSqliteMaintenanceContext as F, hasAssistantStateTablesBeyondStartupCheckpoint as G, normalizeSqliteNumber as H, registerDeferredSqliteWalWriteAdmission as I, tableHasColumns as J, tableExists as K, registerSqliteWalWriteAdmission as L, configureSqliteReadOnlyPragmas as M, configureSqliteWalMaintenance as N, StateSchemaMutationConflictError as O, registerSqliteCacheExitClose as P, createSqliteWalReclamationResult as R, tryAcquireGatewayLifecycleCleanupCoordinator as S, withStateDatabaseCoordinatorRuntimeDirectory as T, readExistingAgentSchemaMeta as U, coerceRequiredSqliteNumber as V, ensureColumn as W, backupNodeSqliteDatabase as X, tablePrimaryKeyColumns as Y, hasStateDatabaseSourceExclusion as _, prepareSqliteReadOnlyLocationInProcess as a, resolveStateLifecycleRuntimeDirectory as b, withSqliteSourceHandleAsync as c, acquireStateDatabaseCoordinator as d, acquireStateDatabaseHandleExclusion as f, hasGatewayLifecycleCoordinator as g, captureStateDatabaseCoordinatorRuntime as h, prepareSqliteReadOnlyLocationFromOwnedDatabase as i, configureSqlitePreSchemaPragmas as j, readSqliteWriterAppVersion as k, acquireGatewayLifecycleCoordinator as l, assertStateDatabaseSourceReadContext as m, registerLiveSqliteSnapshotOwner as n, prepareSqliteReadOnlyLocationSyncInProcess as o, acquireStateDatabaseHandleLease as p, tableHasColumn as q, prepareSingleFlightSqliteSnapshot as r, assertSqliteSourceReadAllowed as s, prepareSqliteSnapshotFromLiveOwner as t, acquireGatewayMaintenanceCoordinator as u, prepareStateDatabaseSourceExclusion as v, tryCreateStateLifecycleDelegate as w, retainHeldStateDatabaseCoordinator as x, resolveStateDatabaseCoordinatorPath as y, onSqliteWalCheckpoint as z };
