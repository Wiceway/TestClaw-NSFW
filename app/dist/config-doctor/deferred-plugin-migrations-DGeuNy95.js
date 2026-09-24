import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { b as testClawStateDatabaseCache } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { T as string, b as object, d as array, g as literal } from "./schemas-D6YHSiZI.js";
import { l as withExistingAssistantStateDatabaseCurrentReadOnly, r as isArtifactPreservingStateRead, s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { N as withSharedStateWriteCoordinator, c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { s as invalidateSuccessfulMigrationCheckpointsInTransaction } from "./startup-migration-checkpoint-DnvPNuHL.js";
import { a as recordLegacyMigrationRun } from "./state-migrations.receipts-DhnDtGid.js";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/deferred-plugin-migrations.ts
const RUN_PREFIX = "deferred-plugin-migration:";
const deferredPluginMigrationSchema = object({
	pluginId: string().min(1),
	reason: string().min(1),
	command: string().min(1),
	requiresStateMigration: literal(true).optional(),
	requiresDoctorInspection: literal(true).optional(),
	configPaths: array(array(string().min(1)).min(1)).optional(),
	validationExcludedPaths: array(array(string().min(1)).min(1)).optional()
});
var DeferredPluginMigrationConflictError = class extends Error {
	constructor(pending) {
		super("Plugin migration obligations changed while their inputs were being prepared. Retained inputs remain protected; run \"testclaw doctor --fix\" after the other repair finishes.");
		this.name = "DeferredPluginMigrationConflictError";
		this.pending = pending;
	}
};
/** Missing metadata cannot release inputs already claimed by an unfinished migration. */
function mergeDeferredPluginMigration(previous, current) {
	const mergePaths = (before = [], after = []) => [...new Map([...before, ...after].map((segments) => [JSON.stringify(segments), segments])).values()];
	const configPaths = mergePaths(previous?.configPaths, current.configPaths);
	const validationExcludedPaths = mergePaths(previous?.validationExcludedPaths, current.validationExcludedPaths);
	return {
		pluginId: current.pluginId,
		reason: current.reason,
		command: current.command,
		...previous?.requiresStateMigration || current.requiresStateMigration ? { requiresStateMigration: true } : {},
		...previous?.requiresDoctorInspection || current.requiresDoctorInspection ? { requiresDoctorInspection: true } : {},
		...configPaths.length > 0 ? { configPaths } : {},
		...validationExcludedPaths.length > 0 ? { validationExcludedPaths } : {}
	};
}
function readPendingMigrationRows(database) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("migration_runs").select(["id", "report_json"]).where("id", "like", `${RUN_PREFIX}%`).where("status", "=", "pending").orderBy("id")).rows;
}
function pendingMigrationRecords(rows) {
	return rows.map((row) => deferredPluginMigrationSchema.parse(JSON.parse(row.report_json)));
}
function readPendingMigrationRecords(database) {
	return tableExists(database, "migration_runs") ? pendingMigrationRecords(readPendingMigrationRows(database)) : [];
}
function assertPendingGeneration(current, expected) {
	if (!isDeepStrictEqual(current, expected)) throw new DeferredPluginMigrationConflictError(current);
}
function readDeferredPluginMigrations(options = {}) {
	return (options.artifactPreservingReadOnly === false ? withExistingAssistantStateDatabaseReadOnly : withExistingAssistantStateDatabaseArtifactPreservingReadOnly)(({ db }) => readPendingMigrationRecords(db), options) ?? [];
}
/** Keep asynchronous config inspection off the main thread without creating state. */
async function readDeferredPluginMigrationsAsync(options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	context.admission.assertCurrent();
	const pending = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "plugins.deferredMigrations.read",
		input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return pending ?? [];
}
async function readDeferredPluginMigrationCompletionsAsync(options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	context.admission.assertCurrent();
	const completed = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "plugins.deferredMigrations.completions.read",
		input: void 0
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return completed ?? [];
}
/** Bind asynchronous settlement to the same pending records, including newly added owners. */
function assertDeferredPluginMigrationsCurrent(params) {
	withDeferredPluginMigrationsCurrent(params, () => void 0);
}
/** Keep competing obligation writers excluded until synchronous input publication finishes. */
function withDeferredPluginMigrationsCurrent(params, publish) {
	const databasePath = resolveAssistantStateSqlitePath(params.env);
	const existing = testClawStateDatabaseCache.getAssistantStateDatabaseIfOpenAtPath(databasePath);
	return withSharedStateWriteCoordinator({
		databasePath,
		existing: existing?.db
	}, () => {
		if (params.expectedPending.length === 0 && !existing?.db.isTransaction) {
			if (!withExistingAssistantStateDatabaseCurrentReadOnly(({ db }) => readPendingMigrationRecords(db), params)?.length) return publish();
		}
		return runAssistantStateWriteTransaction(({ db }) => {
			const pending = pendingMigrationRecords(readPendingMigrationRows(db));
			if (!isDeepStrictEqual(pending, params.expectedPending) && params.onConflict) return params.onConflict(pending);
			assertPendingGeneration(pending, params.expectedPending);
			return publish();
		}, { env: params.env }, { operationLabel: "state.plugin-migration-input-publication" });
	});
}
function formatDeferredPluginMigration(pending, env = process.env) {
	const retry = pending.command === "testclaw doctor --fix" ? "" : ", then \"testclaw doctor --fix\"";
	const next = isTruthyEnvValue(env.TESTCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.TESTCLAW_UPDATE_POST_CORE_CONVERGENCE) ? `Let the current update or repair finish. If this warning remains afterward, run "${pending.command}"${retry} to retry the upgrade.` : `Run "${pending.command}"${retry} to retry the upgrade.`;
	return `Plugin "${pending.pluginId}" data/settings upgrade is unfinished: ${pending.reason} Your existing data and settings have been kept. ${next}`;
}
/** Only the migration owner can resolve a pending record after its work completes. */
function recordDeferredPluginMigrations(params) {
	if (params.pending.length === 0 && !params.resolvedPluginIds?.length) return;
	const pendingById = new Map(params.pending.map((pending) => [pending.pluginId, deferredPluginMigrationSchema.parse(pending)]));
	const transitions = runAssistantStateWriteTransaction(({ db }) => {
		const currentRows = readPendingMigrationRows(db);
		if (params.expectedPending) assertPendingGeneration(pendingMigrationRecords(currentRows), params.expectedPending);
		const rows = new Map(currentRows.map((row) => [row.id, row]));
		const deferred = [];
		const resolved = [];
		const now = Date.now();
		for (const current of pendingById.values()) {
			const runId = `${RUN_PREFIX}${current.pluginId}`;
			const previous = rows.get(runId);
			const pending = mergeDeferredPluginMigration(previous ? deferredPluginMigrationSchema.parse(JSON.parse(previous.report_json)) : void 0, current);
			const reportJson = JSON.stringify(pending);
			if (previous?.report_json === reportJson) continue;
			recordLegacyMigrationRun(db, {
				runId,
				startedAt: now,
				finishedAt: null,
				status: "pending",
				reportJson,
				upsert: true
			});
			deferred.push(pending);
		}
		for (const pluginId of new Set(params.resolvedPluginIds)) {
			const runId = `${RUN_PREFIX}${pluginId}`;
			const previous = rows.get(runId);
			if (pendingById.has(pluginId) || !previous) continue;
			recordLegacyMigrationRun(db, {
				runId,
				startedAt: now,
				finishedAt: now,
				status: "completed",
				reportJson: previous.report_json,
				upsert: true
			});
			resolved.push(pluginId);
		}
		if (deferred.length > 0) invalidateSuccessfulMigrationCheckpointsInTransaction(db);
		return {
			deferred,
			resolved,
			pending: pendingMigrationRecords(readPendingMigrationRows(db))
		};
	}, { env: params.env }, { operationLabel: "state.plugin-migration-deferral" });
	const log = createSubsystemLogger("state-migrations");
	for (const pending of transitions.deferred) log.warn(formatDeferredPluginMigration(pending, params.env), {
		pluginId: pending.pluginId,
		reason: pending.reason,
		action: pending.command,
		status: "pending"
	});
	for (const pluginId of transitions.resolved) log.info(`Deferred state migration completed for plugin "${pluginId}".`, {
		pluginId,
		status: "completed"
	});
	return transitions.pending;
}
//#endregion
export { readDeferredPluginMigrationCompletionsAsync as a, recordDeferredPluginMigrations as c, mergeDeferredPluginMigration as i, withDeferredPluginMigrationsCurrent as l, assertDeferredPluginMigrationsCurrent as n, readDeferredPluginMigrations as o, formatDeferredPluginMigration as r, readDeferredPluginMigrationsAsync as s, DeferredPluginMigrationConflictError as t };
