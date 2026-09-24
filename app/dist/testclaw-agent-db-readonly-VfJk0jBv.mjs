import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { c as registerNodeSqliteDisposeCallback, r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-DYoGrApI.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { o as runInSqliteMaintenanceContext } from "./sqlite-wal-36gEREe5.mjs";
import { i as readAssistantAgentDatabaseIdentity, r as isAssistantAgentDatabasePathCurrent, t as createAssistantAgentDatabaseClaim } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./testclaw-agent-db-schema-read-BlI6Qzh2.mjs";
import { s as getAssistantAgentDatabaseIfOpen, t as borrowAssistantAgentDatabase } from "./testclaw-agent-db-DAdiee0a.mjs";
import { i as withFreshAssistantAgentDatabaseReadOnly, n as openAssistantAgentDatabaseReadOnly, r as readAssistantAgentDatabase, t as hasAssistantAgentReadOnlySchema } from "./testclaw-agent-db-readonly-open-DCNTUAgw.mjs";
import { a as retainCachedAssistantAgentDatabaseReadOnly, o as withScopedAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-scope-Bobfc9dO.mjs";
//#region src/state/testclaw-agent-db-readonly-companion.ts
const log = createSubsystemLogger("state/agent-db");
const companions = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseReadOnlyCompanions"), () => /* @__PURE__ */ new WeakMap());
function matchesWriter(reader, writer) {
	return isAssistantAgentDatabasePathCurrent(writer) && isAssistantAgentDatabasePathCurrent(reader) && readAssistantAgentDatabaseIdentity(reader).identity === readAssistantAgentDatabaseIdentity(writer).identity;
}
/** Keep committed reads separate from the active writer without reopening per assertion. */
function withCommittedAssistantAgentDatabaseReadOnly(writer, operation, options) {
	let companion = companions.get(writer.db);
	if (companion?.active) return withFreshAssistantAgentDatabaseReadOnly(operation, options);
	if (companion && (!matchesWriter(companion.reader, writer) || companion.reader.db.isTransaction)) {
		companion.close();
		companion = void 0;
	}
	if (!companion && !isAssistantAgentDatabasePathCurrent(writer)) return withFreshAssistantAgentDatabaseReadOnly(operation, options);
	if (!companion) {
		const opened = openAssistantAgentDatabaseReadOnly(options);
		if (!opened.found) return opened;
		const reader = opened.database;
		let unregisterDispose = () => {};
		let idleTimer;
		const close = () => {
			if (reader.db.isOpen) reader.close();
			clearTimeout(idleTimer);
			if (companions.get(writer.db)?.reader === reader) companions.delete(writer.db);
			unregisterDispose();
		};
		try {
			if (!matchesWriter(reader, writer)) return readAssistantAgentDatabase(reader, operation);
			enableNodeSqliteKyselyStatementCache(reader.db);
			unregisterDispose = registerNodeSqliteDisposeCallback(writer.db, close);
			idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
				if (companions.get(writer.db)?.reader !== reader) return;
				try {
					close();
				} catch (error) {
					log.warn("Idle committed agent reader cleanup failed", {
						path: reader.path,
						error
					});
					idleTimer?.refresh();
				}
			}, SQLITE_IDLE_HANDLE_TTL_MS));
			idleTimer.unref();
			const next = {
				reader,
				active: false,
				close,
				idleTimer
			};
			companions.set(writer.db, next);
			companion = next;
		} finally {
			if (!companion) close();
		}
	}
	const owned = companion;
	try {
		if (!hasAssistantAgentReadOnlySchema(owned.reader)) {
			owned.close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		owned.idleTimer.refresh();
		owned.active = true;
		return readAssistantAgentDatabase(owned.reader, operation);
	} catch (error) {
		owned.close();
		throw error;
	} finally {
		owned.active = false;
		if (!owned.reader.db.isOpen || owned.reader.db.isTransaction || !matchesWriter(owned.reader, writer)) owned.close();
	}
}
//#endregion
//#region src/state/testclaw-agent-db-readonly.ts
/**
* Look up a process-held handle without adopting writer-side failures.
*
* Read-only reads are meant to survive a latched open failure or an ownership
* mismatch that only the writable lifecycle cares about; those callers fall
* back to a fresh connection, which reports the precise reason.
*/
function findOpenAgentDatabase(options) {
	try {
		return getAssistantAgentDatabaseIfOpen(options);
	} catch {
		return;
	}
}
/** Retain an existing store across awaits without materializing a writable database. */
function retainAssistantAgentDatabaseReadOnly(options) {
	const opened = findOpenAgentDatabase(options);
	if (opened && !opened.db.isTransaction) {
		const borrowed = borrowAssistantAgentDatabase(options);
		return {
			found: true,
			database: opened,
			claim: createAssistantAgentDatabaseClaim(opened, borrowed.release)
		};
	}
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveAssistantAgentSqlitePath({
		...options,
		agentId
	});
	return retainCachedAssistantAgentDatabaseReadOnly({
		...options,
		agentId,
		path: pathname
	});
}
/** Read agent state without creating, registering, migrating, or joining its writable lifecycle. */
function withAssistantAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveAssistantAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoAssistantAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) {
		const database = getAssistantAgentDatabaseIfOpen({
			...options,
			agentId
		});
		if (database && behavior.allowExtension) throw new Error("Extension-capable read-only access is unavailable for incognito databases.");
		return database ? readAssistantAgentDatabase(database, operation) : {
			found: false,
			reason: "database-missing"
		};
	}
	const processOpened = behavior.allowExtension ? void 0 : findOpenAgentDatabase({
		...options,
		agentId
	});
	if (processOpened?.db.isTransaction) return withCommittedAssistantAgentDatabaseReadOnly(processOpened, operation, {
		...options,
		agentId
	});
	const reusable = processOpened && !processOpened.db.isTransaction ? processOpened : void 0;
	if (!reusable) return withScopedAssistantAgentDatabaseReadOnly(operation, {
		...options,
		agentId,
		path: pathname
	}, behavior);
	const userVersion = assertSupportedAgentSchemaVersion(reusable.db, pathname);
	assertCanonicalAgentPersistenceVersion(reusable.db, pathname, userVersion);
	return readAssistantAgentDatabase(reusable, operation);
}
//#endregion
export { withAssistantAgentDatabaseReadOnly as n, retainAssistantAgentDatabaseReadOnly as t };
