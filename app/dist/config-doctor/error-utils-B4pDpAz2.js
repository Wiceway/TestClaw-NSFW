import { d as toStringifiedError, o as formatErrorMessage$1 } from "./error-coercion-C787aVxk.js";
import { d as sameFileIdentity } from "./fs-safe-advanced-CBSOsiER.js";
import { b as redactToolPayloadText } from "./redact-myZeUWr_.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { r as isSqliteCorruptionError } from "./sqlite-error-diagnostics-E0F_10pq.js";
import { i as sameFileMutationFingerprint, n as hashFileDescriptorSync } from "./file-descriptor-BakyKUdY.js";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
//#region src/infra/sqlite-file-generation.ts
function readSqliteIntegrityFileIdentity(pathname, expected) {
	const current = fs.statSync(pathname, { bigint: true });
	if (!current.isFile() || expected && !sameFileIdentity(expected, current)) throw new Error(`SQLite source changed during integrity admission: ${pathname}`);
	return {
		dev: current.dev,
		ino: current.ino,
		size: current.size
	};
}
function assertRegularFile(stat) {
	if (!stat.isFile()) throw new Error("SQLite generation target must be a regular file");
}
function sameFileState(left, right) {
	return sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
function fingerprintFile(pathname) {
	const fd = fs.openSync(pathname, "r");
	try {
		const before = fs.fstatSync(fd, { bigint: true });
		assertRegularFile(before);
		const { sha256 } = hashFileDescriptorSync(fd);
		const after = fs.fstatSync(fd, { bigint: true });
		const current = fs.statSync(pathname, { bigint: true });
		if (!sameFileState(before, after) || !sameFileState(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		return {
			birthtimeNs: after.birthtimeNs,
			ctimeNs: after.ctimeNs,
			dev: after.dev,
			ino: after.ino,
			mtimeNs: after.mtimeNs,
			sha256,
			size: after.size
		};
	} finally {
		fs.closeSync(fd);
	}
}
function readOptionalFile(pathname) {
	try {
		return fingerprintFile(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readGeneration(pathname) {
	const database = fingerprintFile(pathname);
	const journal = readOptionalFile(`${pathname}-journal`);
	const wal = readOptionalFile(`${pathname}-wal`);
	return {
		database,
		...journal ? { journal } : {},
		...wal ? { wal } : {}
	};
}
function readStableSqliteFileGeneration(pathname) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return sameFileMutationFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal, right.wal);
}
function serializeFileFingerprint(fingerprint) {
	return {
		birthtimeNs: fingerprint.birthtimeNs.toString(),
		ctimeNs: fingerprint.ctimeNs.toString(),
		dev: fingerprint.dev.toString(),
		ino: fingerprint.ino.toString(),
		mtimeNs: fingerprint.mtimeNs.toString(),
		sha256: fingerprint.sha256,
		size: fingerprint.size.toString()
	};
}
function serializeSqliteFileGeneration(generation) {
	return JSON.stringify({
		database: serializeFileFingerprint(generation.database),
		...generation.journal ? { journal: serializeFileFingerprint(generation.journal) } : {},
		...generation.wal ? { wal: serializeFileFingerprint(generation.wal) } : {}
	});
}
function parseFileFingerprint(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file fingerprint must be an object");
	const fingerprint = value;
	for (const field of [
		"birthtimeNs",
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	]) if (typeof fingerprint[field] !== "string" || !/^-?\d+$/u.test(fingerprint[field])) throw new Error(`SQLite file fingerprint ${field} is invalid`);
	if (typeof fingerprint.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(fingerprint.sha256)) throw new Error("SQLite file fingerprint sha256 is invalid");
	return {
		birthtimeNs: BigInt(fingerprint.birthtimeNs),
		ctimeNs: BigInt(fingerprint.ctimeNs),
		dev: BigInt(fingerprint.dev),
		ino: BigInt(fingerprint.ino),
		mtimeNs: BigInt(fingerprint.mtimeNs),
		sha256: fingerprint.sha256,
		size: BigInt(fingerprint.size)
	};
}
function parseSqliteFileGeneration(serialized) {
	const value = JSON.parse(serialized);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file generation must be an object");
	const generation = value;
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
}
//#endregion
//#region src/infra/sqlite-integrity.ts
/** The gate includes the driver's check, awaited lifetime, and admission revalidation. */
function* sqliteIntegrityCheckSteps(database, databaseLabel, diagnostics) {
	const startedAt = performance.now();
	const check = {
		database,
		databaseLabel
	};
	if (diagnostics) {
		check.timing = {};
		delete diagnostics.integrityCheckSyncMs;
		delete diagnostics.integrityOutsideCheckMs;
		delete diagnostics.integrityWorkerCheckMs;
		delete diagnostics.integrityWorkerLifetimeMs;
		delete diagnostics.integrityOutsideWorkerMs;
	}
	try {
		yield check;
		if (diagnostics) diagnostics.integrityGateOutcome = "healthy";
	} catch (error) {
		if (diagnostics) diagnostics.integrityGateOutcome = "failed";
		throw error;
	} finally {
		if (diagnostics) {
			diagnostics.integrityGateMs = Math.floor(performance.now() - startedAt);
			if (check.timing?.syncElapsedMs !== void 0) {
				diagnostics.integrityCheckSyncMs = Math.floor(check.timing.syncElapsedMs);
				diagnostics.integrityOutsideCheckMs = diagnostics.integrityGateMs - diagnostics.integrityCheckSyncMs;
			}
			if (check.timing?.workerCheckElapsedMs !== void 0) diagnostics.integrityWorkerCheckMs = Math.floor(check.timing.workerCheckElapsedMs);
			if (check.timing?.workerLifetimeElapsedMs !== void 0) {
				diagnostics.integrityWorkerLifetimeMs = Math.floor(check.timing.workerLifetimeElapsedMs);
				diagnostics.integrityOutsideWorkerMs = diagnostics.integrityGateMs - diagnostics.integrityWorkerLifetimeMs;
			}
		}
	}
}
/** Measure only the calling driver's synchronous check, excluding admission and resumption. */
function runSqliteIntegrityCheckSync(check) {
	const timing = check.timing;
	const startedAt = timing ? performance.now() : 0;
	try {
		assertSqliteIntegrity(check.database, check.databaseLabel);
	} finally {
		if (timing) timing.syncElapsedMs = performance.now() - startedAt;
	}
}
/** Run the same admission steps synchronously when the caller cannot yield. */
function runSqliteIntegrityOperationSync(operation) {
	let step = operation.next();
	while (!step.done) {
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			step = operation.throw(error);
			continue;
		}
		step = operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run testclaw doctor --fix to preserve and repair these rows before retrying.`);
		this.name = "SqliteRepairableForeignKeyError";
		this.repair = {
			kind: "task-delivery-orphans",
			relation: "task_delivery_state.task_id",
			parentTable: "task_runs",
			orphanCount
		};
	}
};
/** Return whether a named integrity failure proves persistent database damage. */
function isTerminalSqliteIntegrityError(error) {
	if (error.name !== "SqliteIntegrityError") return false;
	if (!error.cause) return true;
	return isSqliteCorruptionError(error.cause);
}
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel, check = "integrity_check") {
	const integrityCheck = runSqliteCheck(database, databaseLabel, check);
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
/** Run integrity checks and preserve whether a failure proves persistent damage. */
function confirmSqliteIntegrity(database, databaseLabel) {
	try {
		assertSqliteIntegrity(database, databaseLabel);
		return { status: "healthy" };
	} catch (error) {
		return failedSqliteIntegrityConfirmation(error);
	}
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		try {
			initial = readStableSqliteFileGeneration(pathname);
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let database;
		try {
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		if (!sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation = confirmSqliteIntegrity(database, databaseLabel);
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		return bindSqliteIntegrityConfirmation(confirmation, final);
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function bindSqliteIntegrityConfirmation(confirmation, generation) {
	if (confirmation.status === "healthy") return {
		status: "healthy",
		generation
	};
	if (confirmation.terminal) return {
		...confirmation,
		generation,
		terminal: true
	};
	return {
		...confirmation,
		terminal: false
	};
}
function failedSqliteIntegrityConfirmation(error) {
	const normalized = toStringifiedError(error);
	return {
		status: "failed",
		error: normalized,
		terminal: isTerminalSqliteIntegrityError(normalized)
	};
}
function unboundSqliteIntegrityFailure(error) {
	return {
		status: "failed",
		error: toStringifiedError(error),
		terminal: false
	};
}
function closeSqliteDatabase(database) {
	try {
		database.close();
		return;
	} catch (error) {
		return toStringifiedError(error);
	}
}
/** Require table and associated index consistency before trusting indexed reads. */
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
	runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
	let rows;
	try {
		rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
	let violationCount = 0;
	let repairable = true;
	let taskDeliveryForeignKeyId;
	const violations = [];
	try {
		const statement = database.prepare("PRAGMA foreign_key_check;");
		statement.setReadBigInts(true);
		for (const violation of statement.iterate()) {
			violationCount += 1;
			retainSortedForeignKeyViolation(violations, violation);
			if (repairable) {
				if (violation.table === "task_delivery_state" && violation.parent === "task_runs") {
					taskDeliveryForeignKeyId ??= readTaskDeliveryCascadeForeignKeyId(database);
					repairable = violation.fkid === taskDeliveryForeignKeyId;
				} else repairable = false;
			}
		}
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
function createSqliteIntegrityError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	error.name = "SqliteIntegrityError";
	return error;
}
function retainSortedForeignKeyViolation(retained, violation) {
	retained.push(violation);
	retained.sort(compareSqliteForeignKeyViolations);
	if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
	const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
	if (tableOrder !== 0) return tableOrder;
	if (left.rowid === null || right.rowid === null) {
		if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
	} else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
	const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
	if (parentOrder !== 0) return parentOrder;
	if (left.fkid === right.fkid) return 0;
	return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
	const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
	return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
//#region packages/memory-host-sdk/src/host/error-utils.ts
/** Format memory-host errors through the canonical formatter and redaction policy. */
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactToolPayloadText });
}
//#endregion
export { confirmSqliteFileIntegrity as a, runSqliteIntegrityOperationSync as c, readSqliteIntegrityFileIdentity as d, readStableSqliteFileGeneration as f, assertSqliteTableIntegrity as i, sqliteIntegrityCheckSteps as l, serializeSqliteFileGeneration as m, SqliteRepairableForeignKeyError as n, isTerminalSqliteIntegrityError as o, sameSqliteFileGeneration as p, assertSqliteIntegrity as r, runSqliteIntegrityCheckSync as s, formatErrorMessage as t, parseSqliteFileGeneration as u };
