import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./src-D9uQ497Z.js";
import { t as safeParseJson } from "./json-coercion-AulM0PZ6.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { C as resolveOAuthDir, E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { i as resolveRegisteredAgentIdForDir } from "./agent-dir-registry-DyxBacoA.js";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { K as tableExists, U as readExistingAgentSchemaMeta } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { r as sha256HexPrefixCore } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-vvtahMcf.js";
import { s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-Bm4Vx3bT.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { r as writeConfigMachineState } from "./config-machine-state-write-BsrY8iFO.js";
import { P as assertExistingAgentSchemaOwner } from "./testclaw-agent-db-schema-helpers-BWt3HuU6.js";
import { f as runAssistantAgentWriteTransaction, m as withAssistantAgentDatabaseAsync } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-fcqqlXn0.js";
import { S as resolveSharedMainAuthAgentDir, _ as readSharedAuthKvCell, c as resolveSharedAuthStorePath, d as SHARED_STATE_STATE_KEY, f as SHARED_STORE_STATE_KEY, g as inspectAuthProfileJsonCell, h as inspectAgentAuthProfileJsonCellReadOnly, l as PRIMARY_ROW_KEY$1, m as getAgentAuthProfileKysely, o as resolveSharedAuthStoreOwnership, p as deleteAuthProfileJsonCell, r as noteCommittedSharedAuthStoreOwnership, u as SHARED_AUTH_STORE_STATE_KEY, v as writeAuthProfileJsonCell, x as isMissingDatabasePath, y as acquireAuthProfileReadDatabase } from "./path-resolve-C56x-mXN.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/legacy-source-files.ts
function resolveLegacyOAuthPath(env = process.env) {
	return path.join(resolveOAuthDir(env), "oauth.json");
}
function resolveLegacySourceAgentDir(agentDir, env = process.env) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir(env);
}
/** Capture the fixed legacy candidates before the producer's environment can change. */
function resolveLegacyAuthProfileSourceCandidates(params) {
	const agentDir = resolveLegacySourceAgentDir(params.agentDir, params.env);
	const candidates = [
		{
			kind: "auth-profiles",
			path: path.join(agentDir, "auth-profiles.json")
		},
		{
			kind: "auth-state",
			path: path.join(agentDir, "auth-state.json")
		},
		{
			kind: "legacy-auth",
			path: path.join(agentDir, "auth.json")
		}
	];
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	if (path.resolve(agentDir) === path.resolve(sharedMainDir)) candidates.push({
		kind: "legacy-oauth",
		path: resolveLegacyOAuthPath(params.env)
	});
	return candidates;
}
/** Detect retired files by name; only migration diagnostics may inspect provider metadata. */
function listLegacyAuthProfileSources(params) {
	return resolveLegacyAuthProfileSourceCandidates(params).filter((candidate) => fs.existsSync(candidate.path));
}
function listLegacyAuthProfileArchives(params) {
	const candidates = /* @__PURE__ */ new Map();
	for (const agentDir of params.agentDirs) {
		candidates.set(path.join(agentDir, "auth-profiles.json"), "auth-profiles");
		candidates.set(path.join(agentDir, "auth-state.json"), "auth-state");
		candidates.set(path.join(agentDir, "auth.json"), "legacy-auth");
	}
	candidates.set(resolveLegacyOAuthPath(params.env), "legacy-oauth");
	const archives = [];
	for (const [sourcePath, kind] of candidates) {
		const directory = path.dirname(sourcePath);
		const baseName = path.basename(sourcePath);
		const migratedPrefix = `${baseName}.migrated-`;
		const priorImportPrefix = `${baseName}.sqlite-import.`;
		let entries;
		try {
			entries = fs.readdirSync(directory);
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.startsWith(migratedPrefix) || entry.startsWith(priorImportPrefix) && entry.endsWith(".bak")) archives.push({
			kind,
			path: path.join(directory, entry)
		});
	}
	return archives;
}
//#endregion
//#region src/agents/auth-profiles/shared-store-bootstrap.ts
const PRIMARY_ROW_KEY = "primary";
const SHARED_AUTH_STORE_MIGRATION_KIND = "shared-auth-store-state-db";
const inspectedLegacySharedAuthOwnerships = /* @__PURE__ */ new WeakSet();
const freshSharedAuthStoreHandoffs = /* @__PURE__ */ new Set();
/** Runtime views follow only this producer's proven empty-store relocation. */
function registerFreshSharedAuthStoreHandoff(handoff) {
	freshSharedAuthStoreHandoffs.add(handoff);
	return () => freshSharedAuthStoreHandoffs.delete(handoff);
}
var SharedAuthStoreSourceInspectionError = class extends Error {
	constructor(sourcePath, operation, cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		super(`Cannot ${operation} legacy shared auth database ${sourcePath}: ${detail}`, { cause });
		this.code = "SHARED_AUTH_STORE_SOURCE_UNREADABLE";
		this.action = "testclaw doctor --fix";
		this.name = "SharedAuthStoreSourceInspectionError";
		this.sourcePath = sourcePath;
	}
};
function inspectSharedAuthLegacySourceFile(sourcePath) {
	let entry;
	try {
		entry = fs.lstatSync(sourcePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return { status: "missing" };
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "inspect", error);
	}
	let target = entry;
	if (entry.isSymbolicLink()) try {
		target = fs.statSync(sourcePath);
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "resolve", error);
	}
	if (!target.isFile()) throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", /* @__PURE__ */ new Error("path is not a regular file"));
	return {
		status: "present",
		size: target.size
	};
}
function readSharedAuthLegacyRowsFromDatabase(database) {
	const db = getNodeSqliteKysely(database);
	return {
		store: tableExists(database, "auth_profile_store") ? executeSqliteQueryTakeFirstSync(database, db.selectFrom("auth_profile_store").select(["store_json", "updated_at"]).where("store_key", "=", PRIMARY_ROW_KEY)) ?? null : null,
		state: tableExists(database, "auth_profile_state") ? executeSqliteQueryTakeFirstSync(database, db.selectFrom("auth_profile_state").select(["state_json", "updated_at"]).where("state_key", "=", PRIMARY_ROW_KEY)) ?? null : null
	};
}
function inspectSharedAuthLegacyRowsReadOnly(sourcePath, behavior = {}) {
	if (inspectSharedAuthLegacySourceFile(sourcePath).status === "missing") return {
		store: null,
		state: null
	};
	let prepared;
	try {
		prepared = behavior.artifactPreservingReadOnly ? prepareSqliteReadOnlyLocationSync(sourcePath) : void 0;
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", error);
	}
	try {
		let database;
		try {
			database = openNodeSqliteDatabase(prepared?.location ?? sourcePath, { readOnly: true });
		} catch (error) {
			throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", error);
		}
		try {
			return readSharedAuthLegacyRowsFromDatabase(database);
		} catch (error) {
			throw new SharedAuthStoreSourceInspectionError(sourcePath, "read", error);
		} finally {
			database.close();
		}
	} finally {
		prepared?.cleanup();
	}
}
function hasPendingSharedAuthCleanup(env, sourcePath, behavior = {}) {
	return (behavior.artifactPreservingReadOnly ? withExistingAssistantStateDatabaseArtifactPreservingReadOnly : withExistingAssistantStateDatabaseReadOnly)(({ db: database }) => {
		if (behavior.artifactPreservingReadOnly && !tableExists(database, "migration_sources")) return false;
		const db = getNodeSqliteKysely(database);
		const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("migration_sources").select("source_key").where("migration_kind", "=", SHARED_AUTH_STORE_MIGRATION_KIND).where("source_path", "=", sourcePath).where("removed_source", "=", 0).limit(1));
		return Boolean(row);
	}, { env }) ?? false;
}
function initializeFreshSharedAuthStore(env) {
	const ownership = resolveSharedAuthStoreOwnership(env);
	if (ownership.location === "state-db" || inspectedLegacySharedAuthOwnerships.has(ownership)) return;
	const sourcePath = path.join(resolveSharedMainAuthAgentDir(env), "testclaw-agent.sqlite");
	try {
		if (listLegacyAuthProfileSources({ env }).length > 0) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
		const rows = inspectSharedAuthLegacyRowsReadOnly(sourcePath);
		if (rows.store || rows.state || hasPendingSharedAuthCleanup(env, sourcePath)) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
	} catch {
		inspectedLegacySharedAuthOwnerships.add(ownership);
		return;
	}
	writeConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { location: "state-db" }, { env });
	noteCommittedSharedAuthStoreOwnership({ location: "state-db" }, env);
	const handoff = {
		previousSharedDatabasePath: sourcePath,
		sharedDatabasePath: resolveSharedAuthStorePath(env),
		env
	};
	for (const publish of freshSharedAuthStoreHandoffs) publish(handoff);
}
function prepareFreshSharedAuthStoreWrite(params) {
	const isSharedWrite = params.agentDir === void 0 || params.allowExplicitMain && path.resolve(resolveUserPath(params.agentDir, params.env)) === path.resolve(resolveSharedMainAuthAgentDir(params.env));
	if (isSharedWrite) initializeFreshSharedAuthStore(params.env);
	return isSharedWrite;
}
//#endregion
//#region src/agents/auth-profiles/sqlite.ts
/**
* SQLite persistence adapter for auth profile secrets and runtime state.
* The public helpers expose raw JSON payloads so normalization stays in the
* store/state layers that own compatibility rules.
*/
function resolveAuthProfileStoreOwner(database, env = process.env) {
	const prepared = authProfileTransactions.get(database)?.owner;
	if (prepared) return prepared;
	if (!("agentId" in database)) return {
		databasePath: database.path,
		sharedDatabasePath: database.path,
		location: "state-db"
	};
	return {
		...prepareAuthProfileSharedOwner(env),
		databasePath: database.path
	};
}
function prepareAuthProfileSharedOwner(env) {
	const preparedEnv = cloneEnvWithPlatformSemantics(env);
	preparedEnv.TESTCLAW_STATE_DIR = resolveStateDir(preparedEnv);
	return {
		env: preparedEnv,
		sharedDatabasePath: resolveSharedAuthStorePath(preparedEnv),
		location: resolveSharedAuthStoreOwnership(preparedEnv).location
	};
}
const authProfileTransactions = /* @__PURE__ */ new WeakMap();
function inferAgentIdFromDir(agentDir) {
	const normalized = path.normalize(agentDir);
	if (path.basename(normalized) === "agent") {
		const parent = path.basename(path.dirname(normalized));
		if (parent) return parent;
	}
	return `custom-${sha256HexPrefixCore(normalized, 12)}`;
}
function resolveAuthProfileDatabaseOptions(agentDir, env = process.env) {
	const pathname = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
	if (!agentDir && resolveSharedAuthStoreOwnership(env).location === "state-db") return {
		kind: "shared-state",
		path: pathname,
		env
	};
	const dir = path.dirname(pathname);
	return {
		kind: "agent",
		agentId: resolveRegisteredAgentIdForDir(dir) ?? inferAgentIdFromDir(dir),
		path: pathname,
		env
	};
}
/** Filename-only consumers do not need reverse agent ownership discovery. */
function resolveAuthProfileDatabasePath(agentDir) {
	return agentDir ? path.join(resolveUserPath(agentDir), "testclaw-agent.sqlite") : resolveSharedAuthStorePath();
}
/** Resolves the durable agent owner expected for an auth-profile database. */
function resolveAuthProfileDatabaseOwnerId(agentDir) {
	const target = resolveAuthProfileDatabaseOptions(agentDir);
	if (target.kind !== "agent") throw new Error("agent auth database unexpectedly resolved to shared state");
	return target.agentId;
}
/** Resolves the SQLite database and sidecar paths used by auth profiles. */
function resolveAuthProfileDatabaseFilePaths(agentDir) {
	return resolveSqliteDatabaseFilePaths(resolveAuthProfileDatabasePath(agentDir));
}
function parseJsonCell(raw) {
	if (!raw) return null;
	return safeParseJson(raw) ?? null;
}
function resolveAuthProfileDatabaseKind(agentDir, database) {
	if (database && "agentId" in database) return "agent";
	if (database && "path" in database) return "shared-state";
	return resolveAuthProfileDatabaseOptions(agentDir).kind;
}
/** Validate selected-agent ownership without requiring a current session schema. */
function assertAuthProfileStoreAgentOwner(agentDir, agentId) {
	const pathname = resolveAuthProfileDatabasePath(agentDir);
	const acquired = acquireAuthProfileReadDatabase(pathname);
	if (acquired.status === "missing") return;
	if (acquired.status === "unreadable") throw new Error(`Unable to read agent auth database ${pathname}.`);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(acquired.db), normalizeAgentId(agentId), pathname);
}
function inspectAuthProfileJsonCellReadOnly(databaseTarget, target) {
	if (databaseTarget.kind === "shared-state") try {
		return withExistingAssistantStateDatabaseReadOnly(({ db }) => inspectAuthProfileJsonCell(db, target, "shared-state"), {
			path: databaseTarget.path,
			...databaseTarget.env ? { env: databaseTarget.env } : {}
		}) ?? {
			status: "missing",
			reason: "database"
		};
	} catch {
		return isMissingDatabasePath(databaseTarget.path) ? {
			status: "missing",
			reason: "database"
		} : { status: "unreadable" };
	}
	return inspectAgentAuthProfileJsonCellReadOnly(databaseTarget.path, target);
}
/** Distinguishes an absent auth row from a present store that could not be read. */
function inspectPersistedAuthProfileStoreRaw(agentDir, database) {
	if (database) return inspectAuthProfileJsonCell(database.db, "store", resolveAuthProfileDatabaseKind(agentDir, database));
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(agentDir), "store");
}
/** Distinguishes an absent auth-state row from state that could not be read. */
function inspectPersistedAuthProfileStateRaw(agentDir, database) {
	if (database) return inspectAuthProfileJsonCell(database.db, "state", resolveAuthProfileDatabaseKind(agentDir, database));
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(agentDir), "state");
}
/** Inspect the shared store for an explicit state root without projecting it to an agent dir. */
function inspectPersistedSharedAuthProfileStoreRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "store");
}
/** Inspect shared runtime state for an explicit state root. */
function inspectPersistedSharedAuthProfileStateRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "state");
}
/** Reads the raw persisted secrets-store payload without coercing the schema. */
function readPersistedAuthProfileStoreRaw(agentDir, database) {
	if (database) {
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(readSharedAuthKvCell(database.db, SHARED_STORE_STATE_KEY));
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getAgentAuthProfileKysely(database.db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY$1))?.store_json);
	}
	const result = inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(agentDir), "store");
	return result.status === "readable" ? result.raw : null;
}
/** Reads the raw persisted runtime-state payload without coercing the schema. */
function readPersistedAuthProfileStateRaw(agentDir, database) {
	if (database) {
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(readSharedAuthKvCell(database.db, SHARED_STATE_STATE_KEY));
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getAgentAuthProfileKysely(database.db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY$1))?.state_json);
	}
	const result = inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(agentDir), "state");
	return result.status === "readable" ? result.raw : null;
}
/** Read the shared credential row for an explicit state root. */
function readPersistedSharedAuthProfileStoreRaw(env) {
	const result = inspectPersistedSharedAuthProfileStoreRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Read the shared runtime-state row for an explicit state root. */
function readPersistedSharedAuthProfileStateRaw(env) {
	const result = inspectPersistedSharedAuthProfileStateRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Writes the raw persisted secrets-store payload inside the auth database. */
function writePersistedAuthProfileStoreRaw(payload, agentDir, database) {
	const kind = resolveAuthProfileDatabaseKind(agentDir, database);
	const write = (target) => writeAuthProfileJsonCell(target.db, "store", kind, payload);
	if (database) write(database);
	else runAuthProfileWriteTransaction(agentDir, write);
}
/** Deletes the persisted secrets-store row while leaving runtime state intact. */
function deletePersistedAuthProfileStoreRaw(agentDir, database) {
	const kind = resolveAuthProfileDatabaseKind(agentDir, database);
	const remove = (target) => deleteAuthProfileJsonCell(target.db, "store", kind);
	if (database) remove(database);
	else runAuthProfileWriteTransaction(agentDir, remove);
}
/** Writes or deletes the persisted runtime-state payload. */
function writePersistedAuthProfileStateRaw(payload, agentDir, database) {
	const kind = resolveAuthProfileDatabaseKind(agentDir, database);
	const write = (target) => payload ? writeAuthProfileJsonCell(target.db, "state", kind, payload) : deleteAuthProfileJsonCell(target.db, "state", kind);
	if (database) write(database);
	else runAuthProfileWriteTransaction(agentDir, write);
}
function prepareAuthProfileWriteTransaction(agentDir, options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	if (!options.env && options.stateDir) {
		env.TESTCLAW_STATE_DIR = options.stateDir;
		env.TESTCLAW_AGENT_DIR = void 0;
	}
	env.TESTCLAW_STATE_DIR = resolveStateDir(env);
	return {
		databaseTarget: resolveAuthProfileDatabaseOptions(prepareFreshSharedAuthStoreWrite({
			agentDir,
			allowExplicitMain: options.sharedStoreWrite === true,
			env
		}) ? void 0 : agentDir, env),
		sharedOwner: prepareAuthProfileSharedOwner(env)
	};
}
/** Runs an auth-profile database write transaction for store/state updates. */
function runAuthProfileWriteTransaction(agentDir, operation, options = {}) {
	return runPreparedAuthProfileWriteTransaction(prepareAuthProfileWriteTransaction(agentDir, options), operation);
}
/** Queue the physical agent owner; relocated shared-state auth retains its own coordinator. */
async function runAuthProfileWriteTransactionAsync(agentDir, operation, options = {}) {
	const prepared = prepareAuthProfileWriteTransaction(agentDir, options);
	const { databaseTarget } = prepared;
	if (databaseTarget.kind === "shared-state") return runPreparedAuthProfileWriteTransaction(prepared, operation);
	const assertCurrent = () => {
		if (resolveSharedAuthStorePath(prepared.sharedOwner.env) !== prepared.sharedOwner.sharedDatabasePath || resolveSharedAuthStoreOwnership(prepared.sharedOwner.env).location !== prepared.sharedOwner.location) throw new Error("Auth profile shared owner changed before write admission");
	};
	return runAssistantAgentWriteAdmission(databaseTarget, () => withAssistantAgentDatabaseAsync(databaseTarget, () => runPreparedAuthProfileWriteTransaction(prepared, operation), assertCurrent), true);
}
function runPreparedAuthProfileWriteTransaction({ databaseTarget, sharedOwner }, operation) {
	const run = (database) => {
		const previous = authProfileTransactions.get(database);
		const context = previous ?? { owner: {
			...sharedOwner,
			databasePath: database.path
		} };
		authProfileTransactions.set(database, context);
		try {
			return operation(database, context.owner);
		} finally {
			if (!previous) authProfileTransactions.delete(database);
		}
	};
	if (databaseTarget.kind === "agent") return runAssistantAgentWriteTransaction(run, databaseTarget);
	const { env } = databaseTarget;
	const database = openAssistantStateDatabase({
		env,
		path: databaseTarget.path
	});
	return runAssistantStateWriteTransaction(run, {
		env,
		database
	});
}
//#endregion
export { resolveLegacyOAuthPath as A, inspectSharedAuthLegacyRowsReadOnly as C, listLegacyAuthProfileArchives as D, registerFreshSharedAuthStoreHandoff as E, listLegacyAuthProfileSources as O, hasPendingSharedAuthCleanup as S, readSharedAuthLegacyRowsFromDatabase as T, runAuthProfileWriteTransaction as _, inspectPersistedAuthProfileStoreRaw as a, writePersistedAuthProfileStoreRaw as b, prepareAuthProfileWriteTransaction as c, readPersistedSharedAuthProfileStateRaw as d, readPersistedSharedAuthProfileStoreRaw as f, resolveAuthProfileStoreOwner as g, resolveAuthProfileDatabasePath as h, inspectPersistedAuthProfileStateRaw as i, resolveLegacyAuthProfileSourceCandidates as k, readPersistedAuthProfileStateRaw as l, resolveAuthProfileDatabaseOwnerId as m, deletePersistedAuthProfileStoreRaw as n, inspectPersistedSharedAuthProfileStateRaw as o, resolveAuthProfileDatabaseFilePaths as p, inspectAuthProfileJsonCellReadOnly as r, inspectPersistedSharedAuthProfileStoreRaw as s, assertAuthProfileStoreAgentOwner as t, readPersistedAuthProfileStoreRaw as u, runAuthProfileWriteTransactionAsync as v, inspectSharedAuthLegacySourceFile as w, SharedAuthStoreSourceInspectionError as x, writePersistedAuthProfileStateRaw as y };
