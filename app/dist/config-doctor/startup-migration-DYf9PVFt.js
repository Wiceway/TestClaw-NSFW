import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { i as normalizeMainKey } from "./session-key-C0UQClgw.js";
import "./session-key-AvQIavYt.js";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-dhosRuFE.js";
import "./testclaw-state-db-cache-BxGqhkwE.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { c as isAssistantAgentDatabaseOpen, m as withAssistantAgentDatabaseAsync } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-D08lnQbi.js";
import { h as readAgentDatabaseDeletionSnapshot, o as readAgentDeletionJournal } from "./agent-deletion-journal-Bk2FCp74.js";
import { o as closeAssistantAgentDatabaseByPathAsync } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { i as listAssistantRegisteredAgentDatabases } from "./testclaw-agent-db-registry-listing-DBxqeFUz.js";
import "./testclaw-agent-db-registry-DgP56LUX.js";
import { d as setCanonicalSqliteSessionMainKey } from "./session-canonical-key-Bxbtl4CI.js";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BANhXeoo.js";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import "./testclaw-database-preflight-agent-scheduler-CaS-PCeV.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.js";
import { a as resolveAllAgentSessionStoreTargetsSync, l as resolveSessionStoreTargets, s as resolveConfiguredAgentDatabaseTargets } from "./targets-BxNVBaMw.js";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-Dr7vDKEC.js";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-DKFLGAzG.js";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-B4MbmhK3.js";
import { c as listLegacySessionTranscriptFiles, d as shouldFilterLegacySessionRecordsByTarget, l as readLegacySessionStoreEntries, s as isLegacySessionRecordOwnedByTarget } from "./session-sqlite-transcript-verification-DCxUiGYw.js";
import { s as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-D5oLJcfK.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/migration-required.ts
/** Legacy history requires an explicit Doctor import, never automatic failure triage. */
var SessionStoreMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("legacy-session-store", message);
		this.name = "SessionStoreMigrationRequiredError";
	}
};
//#endregion
//#region src/config/sessions/session-canonical-key-read.ts
/** Checks the startup contract without joining the writable database lifecycle. */
function isCanonicalSqliteSessionMainKeyCurrent(options, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const result = withAssistantAgentDatabaseReadOnly((database) => {
		const db = getNodeSqliteKysely(database.db);
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "primary"))?.schema_version !== 23) return false;
		return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey;
	}, options);
	return result.found && result.value;
}
//#endregion
//#region src/config/sessions/startup-migration.ts
function assertSessionStoreMigrationComplete(params) {
	const env = params.env ?? process.env;
	const readOptions = {
		env,
		registeredDatabases: params.registeredDatabases
	};
	const targets = (params.targets ?? resolveAllAgentSessionStoreTargetsSync(params.cfg, readOptions)).filter((target) => !target.agentId || !readAgentDatabaseAdmissionRefusal(target.agentId, { env }));
	const legacyRootStore = path.join(resolveStateDir(env), "sessions", "sessions.json");
	const legacyTargets = fs.existsSync(legacyRootStore) ? resolveSessionStoreTargets(params.cfg, { allAgents: true }, readOptions).map((target) => ({
		agentId: target.agentId,
		sqlitePath: resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			...readOptions
		}).path,
		storePath: legacyRootStore
	})) : [];
	const sources = [...legacyTargets.length > 0 ? legacyTargets : [{ storePath: legacyRootStore }], ...targets];
	const sourcesByPath = /* @__PURE__ */ new Map();
	for (const target of sources) {
		const sourcePath = path.resolve(target.storePath);
		sourcesByPath.set(sourcePath, [...sourcesByPath.get(sourcePath) ?? [], target]);
	}
	const legacySources = [...sourcesByPath].filter(([storePath]) => !storePath.endsWith(".sqlite") && fs.existsSync(storePath));
	if (legacySources.length === 0) return;
	const deletionSnapshot = readAgentDatabaseDeletionSnapshot(env);
	const classifyDeletion = deletionSnapshot && createAgentDatabaseDeletionClassifier({
		env,
		retainedDeletions: deletionSnapshot.retainedDeletions,
		registeredAgentDatabases: deletionSnapshot.registeredAgentDatabases,
		configuredAgentDatabaseTargets: resolveConfiguredAgentDatabaseTargets(params.cfg, readOptions)
	});
	const legacyStore = legacySources.find(([storePath, candidates]) => {
		const owners = /* @__PURE__ */ new Map();
		for (const target of candidates) {
			if (!target.agentId) return true;
			const destination = target.sqlitePath ?? resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				...readOptions
			}).path;
			const deletion = classifyDeletion?.(storePath, target.agentId) ?? classifyDeletion?.(destination, target.agentId);
			const retained = deletion !== void 0 && deletion !== "unavailable";
			owners.set(`${target.agentId}\0${destination}`, {
				target: {
					...target,
					agentId: target.agentId
				},
				destination,
				retained,
				imported: !retained && readDeferredPluginSessionImport({
					cfg: params.cfg,
					target: {
						...target,
						agentId: target.agentId
					},
					sqlitePath: destination,
					env,
					purpose: "readiness"
				}) !== void 0
			});
		}
		if ([...owners.values()].every(({ target, retained, imported }) => (imported || retained) && !shouldFilterLegacySessionRecordsByTarget(target))) return false;
		const issues = [];
		const source = readLegacySessionStoreEntries({ storePath }, issues);
		if (issues.some((issue) => issue.code !== "entry_invalid") || !source.bytes) return [...owners.values()].some(({ imported, retained }) => !imported && !retained);
		const required = new Set(source.entries.length === 0 ? owners.values() : []);
		for (const sessionKey of [...source.entries.map((entry) => entry.sessionKey), ...issues.flatMap((issue) => issue.sessionKey ? [issue.sessionKey] : [])]) {
			const matches = [...owners.values()].filter(({ target }) => !shouldFilterLegacySessionRecordsByTarget(target) || isLegacySessionRecordOwnedByTarget(params.cfg, target, sessionKey));
			if (matches.length !== 1) return true;
			required.add(matches[0]);
		}
		let hasUnindexedHistory;
		return [...required].some(({ target, destination, retained, imported }) => {
			if (imported || retained && (source.entries.length > 0 || !shouldFilterLegacySessionRecordsByTarget(target))) return false;
			if (source.entries.length === 0 && !fs.existsSync(destination)) {
				hasUnindexedHistory ??= listLegacySessionTranscriptFiles(path.dirname(storePath)).length > 0;
				if (!hasUnindexedHistory) return false;
			}
			return true;
		});
	})?.[0];
	if (legacyStore) throw new SessionStoreMigrationRequiredError(params.operation === "doctor" ? formatDoctorStateRepairFailure(`Legacy session store requires migration at ${legacyStore}`, "Repair the retained source using the migration report's named file and validation error, preserving the original history.") : `Legacy session store requires migration: ${legacyStore}. Run "${formatCliCommand("testclaw doctor --fix", env)}" against the same state/config before starting Assistant.`);
}
/** Maintains existing stores, optionally handing each live database to its runtime owner. */
async function runSessionStartupMigration(params) {
	params.assertCurrent?.();
	const env = params.env ?? process.env;
	const resolveTargets = params.deps?.resolveAllAgentSessionStoreTargetsSync ?? resolveAllAgentSessionStoreTargetsSync;
	const admittedTargets = () => resolveTargets(params.cfg, { env }).filter((target) => (!params.agentIds || params.agentIds.has(target.agentId)) && !readAgentDatabaseAdmissionRefusal(target.agentId, { env }));
	const targets = admittedTargets();
	assertSessionStoreMigrationComplete({
		cfg: params.cfg,
		env,
		targets
	});
	const result = await (params.deps?.migrateLegacyMainSessionKeys ?? migrateLegacyMainSessionKeys)({
		cfg: params.cfg,
		env,
		mode: "detect"
	});
	params.assertCurrent?.();
	if (result.warnings.length > 0) params.log.warn(`session: retired main-agent session migration warnings:\n${result.warnings.map((warning) => `- ${warning}`).join("\n")}`);
	const databases = /* @__PURE__ */ new Set();
	const registeredDatabases = new Set(listAssistantRegisteredAgentDatabases({ env }).map((entry) => `${entry.agentId}\0${entry.path}`));
	const tasks = targets.map((target) => async () => {
		params.assertCurrent?.();
		const options = toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		}));
		const databasePath = resolveAssistantAgentSqlitePath(options);
		if (databases.has(databasePath) || !fs.existsSync(databasePath)) return;
		databases.add(databasePath);
		const deletion = readAgentDeletionJournal(options.agentId, { env });
		if (deletion) {
			params.log.info(`session: skipping deleted agent database for ${options.agentId} (${deletion.cleanupCompleted ? "cleanup complete" : "cleanup pending; retry agent deletion"})`);
			return;
		}
		const alreadyOpen = isAssistantAgentDatabaseOpen(databasePath);
		let handedOff = false;
		try {
			try {
				const mainKey = params.cfg.session?.mainKey;
				if (!registeredDatabases.has(`${options.agentId}\0${databasePath}`) || !isCanonicalSqliteSessionMainKeyCurrent(options, mainKey)) await withAssistantAgentDatabaseAsync(options, (database) => setCanonicalSqliteSessionMainKey(database, mainKey), params.assertCurrent);
			} catch (error) {
				params.assertCurrent?.();
				params.log.warn(`session: SQLite startup maintenance failed for ${target.agentId}; continuing: ${String(error)}`);
			}
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DPanEjQ8.js");
			const { withSqliteCanonicalValidationWorker } = await import("./session-accessor.sqlite-reclamation-worker-BVmBBFc_.js");
			params.assertCurrent?.();
			await withSqliteCanonicalValidationWorker((withWorker) => certifySessionCanonicalValidationPending(options, withWorker, params.assertCurrent));
			params.assertCurrent?.();
			if (params.handoffDatabase) {
				params.assertCurrent?.();
				await params.handoffDatabase(options);
				params.assertCurrent?.();
				handedOff = true;
			}
		} finally {
			if (!alreadyOpen && !handedOff) await closeAssistantAgentDatabaseByPathAsync(databasePath);
		}
	});
	const { withSqliteCanonicalValidationWorkerPool } = await import("./session-accessor.sqlite-canonical-worker-pool-B6KjpT0V.js");
	await withSqliteCanonicalValidationWorkerPool(env, async () => {
		const { hasError, firstError } = await runTasksWithConcurrency({
			tasks,
			limit: 2,
			errorMode: "stop"
		});
		if (hasError) throw firstError;
	});
	params.assertCurrent?.();
}
//#endregion
export { runSessionStartupMigration as n, assertSessionStoreMigrationComplete as t };
