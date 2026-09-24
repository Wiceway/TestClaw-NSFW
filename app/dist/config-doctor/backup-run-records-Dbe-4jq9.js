import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/state/backup-run-records.contract.ts
const BACKUP_RUN_ERROR_MAX_LENGTH = 1200;
//#endregion
//#region src/state/backup-run-records.ts
function boundedText(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? truncateUtf16Safe(trimmed, maxLength) : void 0;
}
function parseBackupRun(row) {
	if (row.status !== "ok" && row.status !== "failed") return;
	let manifest;
	try {
		manifest = JSON.parse(row.manifest_json);
	} catch {
		return;
	}
	if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) return;
	const value = manifest;
	if (value.kind !== "archive" && value.kind !== "sqlite-snapshot" && value.kind !== "git") return;
	return {
		id: row.id,
		createdAt: row.created_at,
		archivePath: row.archive_path,
		status: row.status,
		kind: value.kind,
		...typeof value.target === "string" ? { target: value.target } : {},
		...typeof value.error === "string" ? { error: value.error } : {},
		...value.pushFailed === true ? { pushFailed: true } : {}
	};
}
/** Record one best-effort backup outcome in the shared bounded operational log. */
async function recordBackupRunOutcome(params) {
	const databasePath = resolveAssistantStateSqlitePath(params.env ?? process.env);
	if (!existsSync(databasePath)) return;
	const context = captureAssistantStateWorkerContext({
		path: databasePath,
		env: params.env
	});
	const manifest = JSON.stringify({
		kind: params.kind,
		...boundedText(params.target, 512) ? { target: boundedText(params.target, 512) } : {},
		...boundedText(params.error, 1200) ? { error: boundedText(params.error, BACKUP_RUN_ERROR_MAX_LENGTH) } : {},
		...params.pushFailed === true ? { pushFailed: true } : {}
	});
	const row = {
		id: randomUUID(),
		created_at: params.createdAt ?? Date.now(),
		archive_path: params.archivePath,
		status: params.status,
		manifest_json: manifest
	};
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "backup.recordOutcome",
		input: row
	}), { existingOnly: true });
}
function readBackupRun(database, status) {
	if (!tableExists(database, "backup_runs")) return;
	let query = getNodeSqliteKysely(database).selectFrom("backup_runs").selectAll();
	if (status) query = query.where("status", "=", status);
	const row = executeSqliteQueryTakeFirstSync(database, query.orderBy("created_at", "desc").orderBy("id", "desc").limit(1));
	return row ? parseBackupRun(row) : void 0;
}
/** Read backup freshness without creating or repairing an absent state database. */
async function readBackupRunFreshness(env) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => ({
		latest: readBackupRun(db),
		latestOk: readBackupRun(db, "ok")
	}), {
		env,
		path: resolveAssistantStateSqlitePath(env)
	}) ?? {};
}
/** Archive parents are the fallback scratch roots when TMPDIR overlaps a source. */
function readBackupArchiveDirectories(env) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "backup_runs")) return [];
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("backup_runs").selectAll()).rows;
		return [...new Set(rows.flatMap((row) => {
			const record = parseBackupRun(row);
			return record?.kind === "archive" && path.isAbsolute(record.archivePath) ? [path.dirname(record.archivePath)] : [];
		}))];
	}, {
		env,
		path: resolveAssistantStateSqlitePath(env)
	}) ?? [];
}
//#endregion
export { BACKUP_RUN_ERROR_MAX_LENGTH as i, readBackupRunFreshness as n, recordBackupRunOutcome as r, readBackupArchiveDirectories as t };
