import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { realpathSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/testclaw-state-db-schema-policy.ts
const schemaPolicies = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = path.resolve(pathname);
	try {
		return realpathSync.native(resolved);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return resolved;
		throw error;
	}
}
function withExistingAssistantStateSchema(options, run) {
	getExistingAssistantStateSchemaPath();
	const parent = schemaPolicies.scopes.getStore();
	const scope = {
		path: path.resolve(options.path),
		canonicalPath: canonicalPath(options.path),
		active: true
	};
	if (parent && parent.canonicalPath !== scope.canonicalPath) throw new Error("Existing shared-state schema admission cannot change its database path.");
	try {
		const result = schemaPolicies.scopes.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			scope.active = false;
		});
		scope.active = false;
		return result;
	} catch (error) {
		scope.active = false;
		throw error;
	}
}
function getExistingAssistantStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
	return scope?.path;
}
/** Check supplied and cached handles before exposing them to another admission policy. */
function isExistingAssistantStateSchema(pathname, database) {
	const scopedPath = getExistingAssistantStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const admittedPath = database && schemaPolicies.existingDatabases.get(database);
	const resolvedPath = path.resolve(pathname);
	const existing = scopedPath !== void 0 && (scopedPath === resolvedPath || scope?.canonicalPath === resolvedPath || scope?.canonicalPath === canonicalPath(resolvedPath));
	if (scopedPath && !existing) throw new Error(`Existing shared-state schema admission is bound to ${scopedPath}, not ${pathname}.`);
	if (admittedPath && (!existing || admittedPath !== scope?.canonicalPath)) throw new Error(`Shared-state database ${pathname} was admitted without schema repair; close its existing handle before ordinary admission.`);
	return existing;
}
function recordExistingAssistantStateSchemaDatabase(database, pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope || !isExistingAssistantStateSchema(pathname, database)) throw new Error("Existing shared-state schema admission requires its active path scope.");
	schemaPolicies.existingDatabases.set(database, scope.canonicalPath);
}
/** The cache owns the handle inventory, including owners retained after failed cleanup. */
function assertExistingAssistantStateSchemaCacheAdmission(pathname, cache) {
	const scopedPath = getExistingAssistantStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const requested = path.resolve(pathname);
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingAssistantStateSchema(pathname, db);
		}
	}
}
function assertAssistantStateSchemaRepairAllowed(pathname) {
	if (isExistingAssistantStateSchema(pathname)) throw new Error(`Shared-state schema repair is owned by the existing installation at ${pathname}; update that installation before retrying the managed node.`);
}
//#endregion
export { recordExistingAssistantStateSchemaDatabase as a, isExistingAssistantStateSchema as i, assertAssistantStateSchemaRepairAllowed as n, withExistingAssistantStateSchema as o, getExistingAssistantStateSchemaPath as r, assertExistingAssistantStateSchemaCacheAdmission as t };
