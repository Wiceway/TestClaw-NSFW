import { f as isAssistantStateDatabaseOpen, i as clearAssistantStateDatabaseOpenFailure } from "./testclaw-state-db-cache-DLl9ibxh.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { i as clearAssistantDatabaseQuarantine } from "./testclaw-quarantine-store-BgTM1lrX.mjs";
import { E as assertAssistantStateDatabaseForMaintenance } from "./testclaw-state-db-read-connection-BvrNnfuu.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BGzENJvG.mjs";
import { a as assertAssistantStateWriteAllowed, f as runWithAssistantStateWriteAccess } from "./testclaw-state-ownership-Czk4lNwX.mjs";
import { P as ensureAssistantStatePermissions } from "./testclaw-state-db-BXFT1fUC.mjs";
import { i as withDoctorSqliteMaintenanceLock } from "./doctor-sqlite-maintenance-lock-nvy0KFQA.mjs";
import { n as compactDoctorSqliteFile } from "./doctor-sqlite-compact-DsXiLEod.mjs";
import fs from "node:fs";
//#region src/commands/doctor-state-sqlite-compact.ts
/** Explicit doctor maintenance for the canonical shared state SQLite database. */
/** Compact only the canonical shared state database resolved for this invocation. */
async function runDoctorStateSqliteCompact(options = {}, deps = {}) {
	const env = options.env ?? process.env;
	const sqlitePath = resolveAssistantStateSqlitePath(env);
	const stat = readCanonicalStateDatabaseStat(sqlitePath);
	if (!stat) return {
		mode: "compact",
		path: sqlitePath,
		reason: "missing",
		skipped: true
	};
	if (!stat.isFile()) throw new Error(`Canonical Assistant state database is not a regular file: ${sqlitePath}`);
	return await (deps.withMaintenanceLock ?? withDoctorSqliteMaintenanceLock)({
		env,
		operation: "state SQLite compaction",
		protectedPaths: resolveSqliteDatabaseFilePaths(sqlitePath),
		run: () => runWithAssistantStateWriteAccess({
			databasePath: sqlitePath,
			env
		}, "state SQLite compaction", () => {
			if (isAssistantStateDatabaseOpen()) throw new Error("The shared Assistant state database is already open in this process. Stop Assistant and retry.");
			return {
				...compactDoctorSqliteFile({
					afterSuccess: () => {
						if (!clearAssistantDatabaseQuarantine(sqlitePath, { env })) throw new Error(`Assistant state database ${sqlitePath} was compacted, but its persisted quarantine record could not be cleared. Rerun testclaw doctor --fix so the database is not refused again.`);
						clearAssistantStateDatabaseOpenFailure(sqlitePath);
						ensureAssistantStatePermissions(sqlitePath, env);
					},
					...deps.busyTimeoutMs !== void 0 ? { busyTimeoutMs: deps.busyTimeoutMs } : {},
					sqlitePath,
					validateBeforeMutation: (database) => {
						assertAssistantStateWriteAllowed({
							database,
							databasePath: sqlitePath,
							env
						});
						assertAssistantStateDatabaseForMaintenance(database, { pathname: sqlitePath });
					}
				}),
				mode: "compact",
				path: sqlitePath,
				skipped: false
			};
		})
	});
}
function readCanonicalStateDatabaseStat(sqlitePath) {
	try {
		return fs.lstatSync(sqlitePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
//#endregion
export { runDoctorStateSqliteCompact };
