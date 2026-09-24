import { a as writeRuntimeJson } from "./runtime-Dg6PE4Mj.mjs";
import { p as shortenHomePath } from "./utils-Dy46mFy2.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./session-key-C_bfgyCp.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-D6TB-oX3.mjs";
import { o as recordBackupOutcomeBestEffort, s as resolveBackupAgentRoot, u as resolveRequiredBackupPath } from "./backup-shared-Cj1DIKDr.mjs";
import { t as createLocalSqliteSnapshotProvider } from "./local-repository-vJZcor_R.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/backup-sqlite.ts
const TESTCLAW_SNAPSHOT_READ_OPTIONS = { allowedDatabaseRoles: ["global", "agent"] };
async function backupSqliteCreateCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	try {
		const database = await resolveSnapshotDatabase(options);
		const result = await createLocalSqliteSnapshotProvider({ repositoryPath }).create(database);
		const report = {
			ok: true,
			snapshotPath: result.ref.path,
			manifest: result.manifest
		};
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "sqlite-snapshot",
			archivePath: report.snapshotPath,
			status: "ok"
		});
		writeCreateResult(runtime, options, report);
		return report;
	} catch (error) {
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "sqlite-snapshot",
			archivePath: repositoryPath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
async function backupSqliteListCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	const report = {
		ok: true,
		repositoryPath,
		snapshots: await createLocalSqliteSnapshotProvider({
			repositoryPath,
			...TESTCLAW_SNAPSHOT_READ_OPTIONS
		}).list()
	};
	writeListResult(runtime, options, report);
	return report;
}
async function backupSqliteVerifyCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot, options.scratch);
	const verified = await resolved.provider.verify(resolved.ref);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		manifest: verified.manifest
	};
	writeVerifyResult(runtime, options, report);
	return report;
}
async function backupSqliteRestoreCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot);
	const targetPath = resolveRequiredBackupPath(options.target, "--target");
	const restored = await resolved.provider.restoreFresh(resolved.ref, targetPath);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		targetPath,
		manifest: restored.manifest
	};
	writeRestoreResult(runtime, options, report);
	return report;
}
async function resolveSnapshotDatabase(options) {
	const rawAgentId = options.agent?.trim();
	if (options.agent !== void 0 && !rawAgentId) throw new Error("--agent must not be blank");
	if (options.global === true && rawAgentId) throw new Error("Choose exactly one SQLite snapshot source: --global or --agent <id>.");
	if (options.global !== true && !rawAgentId) throw new Error("Choose a SQLite snapshot source: --global or --agent <id>.");
	if (options.global === true) {
		const selectedPath = resolveAssistantStateSqlitePath();
		assertNotUpdateCapturePath(selectedPath, resolveStateDir());
		return {
			path: await fs.realpath(selectedPath),
			identity: { role: "global" }
		};
	}
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const agentId = resolveConfiguredAgentId(config, normalizeAgentId(rawAgentId));
	const agentRoot = await resolveBackupAgentRoot(config, agentId);
	assertNotUpdateCapturePath(agentRoot.databasePath, resolveStateDir());
	return {
		path: await fs.realpath(agentRoot.databasePath),
		identity: {
			role: "agent",
			agentId
		}
	};
}
function resolveSnapshot(snapshot, scratch) {
	const snapshotPath = resolveRequiredBackupPath(snapshot, "<snapshot>");
	const repositoryPath = path.dirname(snapshotPath);
	const validationRootPath = scratch ? resolveRequiredBackupPath(scratch, "--scratch") : path.dirname(repositoryPath);
	return {
		provider: createLocalSqliteSnapshotProvider({
			repositoryPath,
			validationRootPath,
			...TESTCLAW_SNAPSHOT_READ_OPTIONS
		}),
		ref: { path: snapshotPath }
	};
}
function formatDatabaseIdentity(database) {
	if (database.role === "global") return "global";
	if (database.role === "agent") return `agent:${database.agentId}`;
	return database.id;
}
function writeCreateResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log([
		`SQLite snapshot created: ${shortenHomePath(report.snapshotPath)}`,
		`Database: ${formatDatabaseIdentity(report.manifest.database)}`,
		`Size: ${report.manifest.artifact.sizeBytes} bytes`
	].join("\n"));
}
function writeListResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	if (report.snapshots.length === 0) {
		runtime.log(`No SQLite snapshots in ${shortenHomePath(report.repositoryPath)}.`);
		return;
	}
	runtime.log(report.snapshots.map((snapshot) => `${snapshot.manifest.createdAt}  ${formatDatabaseIdentity(snapshot.manifest.database)}  ${snapshot.manifest.artifact.sizeBytes} bytes  ${shortenHomePath(snapshot.ref.path)}`).join("\n"));
}
function writeVerifyResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log(`SQLite snapshot verified: ${shortenHomePath(report.snapshotPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
}
function writeRestoreResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log(`SQLite snapshot restored: ${shortenHomePath(report.targetPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
}
//#endregion
export { backupSqliteCreateCommand, backupSqliteListCommand, backupSqliteRestoreCommand, backupSqliteVerifyCommand };
