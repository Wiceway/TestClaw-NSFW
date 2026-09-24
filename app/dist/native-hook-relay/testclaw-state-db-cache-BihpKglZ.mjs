import { i as extractErrorCode, o as toErrorObject, t as formatErrorMessage } from "./errors-DJXn3WOc.mjs";
import { H as TESTCLAW_SQLITE_BUSY_TIMEOUT_MS, V as TESTCLAW_DATABASE_SCHEMA_DOCS_URL, _ as kyselyByDatabase, a as resolveAssistantStateSqliteDir, b as registerNodeSqliteKyselyQueryErrorHandler, d as readSqliteUserVersion, f as StartupMaintenanceRequiredError, g as installStatementInvalidation, h as executeWithCachedStatement, l as createNewerSqliteSchemaVersionError, p as clearNodeSqliteKyselyCacheForDatabase, u as isSqliteSchemaVersionError, v as queryErrorHandlerByDatabase } from "./testclaw-state-db.paths-Bcv76PAw.mjs";
import { M as asOptionalObjectRecord, P as isRecord, a as isPathInside, b as MAX_TIMER_TIMEOUT_MS, d as sameFileIdentity, g as resolveRequiredOsHomeDir, s as normalizeWindowsPathPreservingCase, u as sameFileContentsSync } from "./utils-CTn0cI82.mjs";
import { A as resolvePathViaExistingAncestorSync$1, O as hasErrnoCode, d as resolveGlobalSingleton, u as resolveGlobalSet } from "./redact-CTzbrAJ7.mjs";
import { n as compareValidSemver } from "./semver-BiH_OTew.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as getChildLogger, s as resolvePreferredAssistantTmpDir, t as createSubsystemLogger } from "./subsystem-i5AY27Kl.mjs";
import { createRequire } from "node:module";
import fsSync, { chmodSync, closeSync, existsSync, openSync, realpathSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path, { posix } from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { realpath, stat } from "node:fs/promises";
import { copyFileDescriptorSync, readFileWindowFullySync } from "@testclaw/fs-safe/advanced";
import { normalizeWindowsPathForComparison } from "@testclaw/fs-safe/path";
import { hash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, getEnvironmentData, isMainThread, setEnvironmentData, threadId } from "node:worker_threads";
import "node:util";
import { sha256FileSync } from "@testclaw/fs-safe/durability";
import "node:buffer";
import { setImmediate } from "node:timers/promises";
import { probeTreeClone } from "@testclaw/fs-safe/copy";
import { InsertQueryNode, Kysely, SelectQueryNode, SqliteDialect, sql } from "kysely";
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region src/infra/crypto-digest.ts
/** Matches the streaming helper's symlink-following path contract. */
function sha256FileSync$1(filePath) {
	const descriptor = openSync(filePath, "r");
	try {
		return sha256FileSync(descriptor).digest;
	} finally {
		closeSync(descriptor);
	}
}
//#endregion
//#region src/infra/sqlite-post-commit.ts
const pendingPublications = resolveGlobalSingleton(Symbol.for("testclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("testclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(db, error) {
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	for (const state of rolledBackState.toReversed()) state.rollback(error);
}
/** Nested rollback restores staged state and discards observers; savepoints wait for outer commit. */
function withSqlitePostCommitPublications(db, transaction) {
	const nested = db.isTransaction;
	const publications = nested ? pendingPublications.get(db) : [];
	const transactionState = nested ? pendingTransactionState.get(db) : [];
	const publicationStart = publications?.length ?? 0;
	const stateStart = transactionState?.length ?? 0;
	if (!nested && publications && transactionState) {
		pendingPublications.set(db, publications);
		pendingTransactionState.set(db, transactionState);
	}
	let result;
	try {
		result = transaction();
	} catch (error) {
		publications?.splice(publicationStart);
		const rolledBackState = transactionState?.splice(stateStart) ?? [];
		for (const state of rolledBackState.toReversed()) state.rollback(error);
		throw error;
	} finally {
		if (!nested) {
			pendingPublications.delete(db);
			pendingTransactionState.delete(db);
		}
	}
	if (!nested) {
		for (const state of transactionState ?? []) state.commit();
		for (const state of transactionState ?? []) state.prepareObservers?.();
		for (const publish of publications ?? []) publish();
	}
	return result;
}
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "TESTCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
//#endregion
//#region node-version.mjs
const NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const NODE_RELEASE_FLOORS = [{
	major: 24,
	minor: 16,
	patch: 0
}, {
	major: 26,
	minor: 1,
	patch: 0
}];
NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
`${NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ").replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")}`;
/** Parses an anchored release SemVer, allowing a leading v and valid build metadata. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) ? version : null;
}
function isNodeVersionAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`;
}
renderProcessNodeVersionCheck();
//#endregion
//#region node-sqlite.mjs
function probeSqlite(DatabaseSync) {
	const result = {
		available: false,
		version: null,
		text: false,
		blob: false,
		json: false
	};
	let database;
	try {
		database = new DatabaseSync(":memory:");
		result.available = true;
		const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
		result.version = typeof version === "string" ? version : null;
		const text = "a\0b\0";
		const bytes = Buffer.from(text, "utf8");
		const json = JSON.stringify({ value: text });
		database.exec("CREATE TABLE probe (text_value TEXT, blob_value BLOB, json_value TEXT)");
		database.prepare("INSERT INTO probe VALUES (?, ?, ?)").run(text, bytes, json);
		const row = database.prepare("SELECT text_value, blob_value, json_value FROM probe").get();
		result.text = typeof row?.text_value === "string" && row.text_value.length === 4 && Buffer.from(row.text_value, "utf8").equals(bytes);
		result.blob = row?.blob_value instanceof Uint8Array && Buffer.from(row.blob_value).equals(bytes);
		result.json = row?.json_value === json && JSON.parse(row.json_value).value === text;
	} catch (error) {
		result.error = error instanceof Error ? error.message : String(error);
	} finally {
		database?.close();
	}
	return result;
}
function isSqliteWalResetSafeVersion(value) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.trim());
	if (!match) return false;
	const [major, minor, patch] = match.slice(1).map(Number);
	if (![
		major,
		minor,
		patch
	].every(Number.isSafeInteger)) return false;
	return major > 3 || major === 3 && (minor > 51 || minor === 51 && patch >= 3 || minor === 50 && patch >= 7 || minor === 44 && patch >= 6);
}
`${probeSqlite.toString()}`;
//#endregion
//#region src/infra/bun-sqlite-library.ts
const WORKER_SELECTION_KEY = "testclaw.bunSqliteLibrarySelection";
function probeLibrary(path) {
	const { dlopen, FFIType } = createRequire(import.meta.url)("bun:ffi");
	const library = dlopen(path, {
		sqlite3_libversion: {
			args: [],
			returns: FFIType.cstring
		},
		sqlite3_compileoption_used: {
			args: [FFIType.cstring],
			returns: FFIType.i32
		}
	});
	try {
		return {
			version: String(library.symbols.sqlite3_libversion()),
			extensionLoadingSupported: library.symbols.sqlite3_compileoption_used(Buffer.from("OMIT_LOAD_EXTENSION\0")) === 0
		};
	} finally {
		library.close();
	}
}
function selectLibrary(path) {
	const { Database } = createRequire(import.meta.url)("bun:sqlite");
	Database.setCustomSQLite(path);
}
function createSelector(deps) {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (deps.env.TESTCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!deps.isBun || deps.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "TESTCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = deps.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		for (const path of candidates) {
			let probe;
			try {
				try {
					probe = deps.probe(path);
				} catch (error) {
					throw deps.exists(path) ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) continue;
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				deps.select(path);
			} catch (error) {
				failure = selectionError(path, error);
				throw failure;
			}
			selection = {
				source: override === void 0 ? "discovered" : "env",
				path,
				version: probe.version,
				extensionLoadingSupported: true
			};
			return selection;
		}
		selection = { source: "runtime" };
		return selection;
	};
}
function selectionError(path, error) {
	return new Error(`Cannot use SQLite library ${path}: ${error instanceof Error ? error.message : String(error)}. Fix or unset TESTCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`, { cause: error });
}
function inheritedSelection() {
	const value = getEnvironmentData(WORKER_SELECTION_KEY);
	if (value === void 0) return;
	if (value !== null && typeof value === "object" && !Array.isArray(value)) {
		const source = "source" in value ? value.source : void 0;
		if (source === "runtime") return { source: "runtime" };
		const path = "path" in value ? value.path : void 0;
		const version = "version" in value ? value.version : void 0;
		const extensionLoadingSupported = "extensionLoadingSupported" in value ? value.extensionLoadingSupported : void 0;
		if ((source === "env" || source === "discovered") && typeof path === "string" && typeof version === "string" && extensionLoadingSupported === true) return {
			source,
			path,
			version,
			extensionLoadingSupported: true
		};
	}
	throw new Error("Invalid inherited SQLite library selection");
}
function createRuntimeSelector() {
	const isBun = Boolean(process.versions.bun);
	const sharedLibrary = isBun && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	if (inherited) return () => inherited;
	const select = createSelector({
		isBun,
		platform: process.platform,
		env: process.env,
		exists: existsSync,
		probe: probeLibrary,
		select: selectLibrary
	});
	let published = false;
	return (options) => {
		const selection = select(options);
		if (sharedLibrary && isMainThread && !published) {
			setEnvironmentData(WORKER_SELECTION_KEY, Object.freeze({ ...selection }));
			published = true;
		}
		return selection;
	};
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	const dependencies = options?.internals;
	return (dependencies ? dependencies.selector ??= createSelector(dependencies) : resolveGlobalSingleton(Symbol.for("testclaw.bunSqliteLibrarySelection"), createRuntimeSelector))(options);
}
//#endregion
//#region src/infra/sqlite-reader-lifecycle.ts
const readerOwners = resolveGlobalSingleton(Symbol.for("testclaw.sqliteReaderOwners"), () => new AsyncLocalStorage());
const activeReaders = resolveGlobalSingleton(Symbol.for("testclaw.sqliteActiveReaders"), () => ({
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map()
}));
const connections = resolveGlobalSingleton(Symbol.for("testclaw.sqliteReaderConnections"), () => ({
	nextId: 0,
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map(),
	finalizer: new FinalizationRegistry((connection) => forgetConnection(connection))
}));
/** The same Windows file can arrive with a namespaced or differently cased path. */
function sqliteReaderDatabasePathKey(databasePath) {
	const resolved = path.resolve(databasePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function boundedOperation(operation) {
	return (operation.trim() || "sqlite reader").slice(0, 120);
}
function captureSqliteReaderOwner() {
	const owner = readerOwners.getStore();
	return owner ? { ...owner } : void 0;
}
function currentOwner(fallbackOperation, capturedOwner) {
	const inherited = capturedOwner ?? readerOwners.getStore();
	return {
		operation: boundedOperation(inherited?.operation ?? fallbackOperation),
		ownerKind: inherited?.ownerKind ?? (isMainThread ? "main" : "worker"),
		...inherited?.actorId !== void 0 ? { actorId: inherited.actorId } : {}
	};
}
function connectionFor(database) {
	let connection = connections.byDatabase.get(database);
	if (!connection) {
		const now = Date.now();
		const location = database.location();
		connection = {
			id: ++connections.nextId,
			path: location ? sqliteReaderDatabasePathKey(location) : void 0,
			database: new WeakRef(database),
			owner: currentOwner("sqlite connection"),
			openedAtMs: now
		};
		connections.byDatabase.set(database, connection);
		if (connection.path) {
			const entries = connections.byPath.get(connection.path) ?? /* @__PURE__ */ new Map();
			entries.set(connection.id, connection);
			connections.byPath.set(connection.path, entries);
		}
		connections.finalizer.register(database, connection, connection);
	}
	return connection;
}
/** Forget observations only; explicit reader custody belongs to its caller. */
function forgetConnection(connection) {
	if (connection.path) {
		const entries = connections.byPath.get(connection.path);
		entries?.delete(connection.id);
		if (entries?.size === 0) connections.byPath.delete(connection.path);
	}
	const database = connection.database.deref();
	if (database && connections.byDatabase.get(database) === connection) connections.byDatabase.delete(database);
	connections.finalizer.unregister(connection);
}
/** Register weak metadata without replacing native methods or acquiring lifecycle custody. */
function registerSqliteReaderConnection(database) {
	if (database.isOpen) connectionFor(database);
}
function retainSqliteReader(database, fallbackOperation, capturedOwner) {
	const connection = connectionFor(database);
	const now = Date.now();
	const reader = {
		...currentOwner(fallbackOperation, capturedOwner),
		kind: "iterator",
		connectionId: connection.id,
		threadId,
		startedAtMs: now,
		lastProgressAtMs: now
	};
	const token = Symbol(reader.operation);
	const databaseReaders = activeReaders.byDatabase.get(database) ?? /* @__PURE__ */ new Map();
	databaseReaders.set(token, reader);
	activeReaders.byDatabase.set(database, databaseReaders);
	const databasePath = connection.path;
	const pathReaders = databasePath ? activeReaders.byPath.get(databasePath) ?? /* @__PURE__ */ new Map() : void 0;
	pathReaders?.set(token, reader);
	if (databasePath && pathReaders) activeReaders.byPath.set(databasePath, pathReaders);
	let released = false;
	return {
		progress() {
			if (!released) reader.lastProgressAtMs = Date.now();
		},
		release() {
			if (released) return;
			released = true;
			databaseReaders.delete(token);
			if (databaseReaders.size === 0) {
				if (activeReaders.byDatabase.get(database) === databaseReaders) activeReaders.byDatabase.delete(database);
			}
			pathReaders?.delete(token);
			if (databasePath && pathReaders?.size === 0 && activeReaders.byPath.get(databasePath) === pathReaders) activeReaders.byPath.delete(databasePath);
		}
	};
}
function diagnostics(readers) {
	const now = Date.now();
	return [...readers].map((reader) => {
		const diagnostic = {
			operation: reader.operation,
			ownerKind: reader.ownerKind,
			kind: reader.kind,
			connectionId: reader.connectionId,
			threadId: reader.threadId,
			ageMs: Math.max(0, now - reader.startedAtMs),
			idleMs: Math.max(0, now - reader.lastProgressAtMs)
		};
		if (reader.actorId !== void 0) diagnostic.actorId = reader.actorId;
		return diagnostic;
	}).toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8);
}
/** Observed local activity is diagnostic evidence, not proof of which connection owns a WAL lock. */
function readSqliteReaderDiagnosticsForPath(databasePath) {
	const key = sqliteReaderDatabasePathKey(databasePath);
	const entries = connections.byPath.get(key);
	const localConnections = [];
	const now = Date.now();
	for (const connection of entries?.values() ?? []) {
		const database = connection.database.deref();
		if (!database?.isOpen) {
			forgetConnection(connection);
			continue;
		}
		const location = database.location();
		if (!location || sqliteReaderDatabasePathKey(location) !== key) {
			forgetConnection(connection);
			continue;
		}
		const readers = activeReaders.byDatabase.get(database);
		localConnections.push({
			...connection.owner,
			connectionId: connection.id,
			threadId,
			ageMs: Math.max(0, now - connection.openedAtMs),
			transactionOpen: database.isTransaction,
			trackedReaders: readers?.size ?? 0
		});
	}
	const readers = activeReaders.byPath.get(key);
	return {
		scope: "current-thread",
		blockingOwner: "unknown",
		nativeStatements: "unobserved",
		threadId,
		observedAtMs: now,
		connectionCount: localConnections.length,
		readerCount: readers?.size ?? 0,
		connections: localConnections.toSorted((left, right) => right.trackedReaders - left.trackedReaders || Number(right.transactionOpen) - Number(left.transactionOpen)).slice(0, 8),
		activeReaders: diagnostics(readers?.values() ?? [])
	};
}
//#endregion
//#region src/infra/warning-filter.ts
const warningFilterKey = Symbol.for("testclaw.warning-filter");
/** Returns whether a process warning matches a known noisy runtime/dependency warning. */
function shouldIgnoreWarning(warning) {
	if (warning.code === "DEP0040" && warning.message?.includes("punycode")) return true;
	if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) return true;
	if (warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature")) return true;
	return false;
}
function normalizeWarningArgs(args) {
	const warningArg = args[0];
	const secondArg = args[1];
	const thirdArg = args[2];
	let name;
	let code;
	let message;
	if (warningArg instanceof Error) {
		name = warningArg.name;
		message = warningArg.message;
		code = warningArg.code;
	} else if (typeof warningArg === "string") message = warningArg;
	if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
		const options = secondArg;
		if (typeof options.type === "string") name = options.type;
		if (typeof options.code === "string") code = options.code;
	} else {
		if (typeof secondArg === "string") name = secondArg;
		if (typeof thirdArg === "string") code = thirdArg;
	}
	return {
		name,
		code,
		message
	};
}
/** Installs the global process warning filter once for the current JS realm. */
function installProcessWarningFilter() {
	const state = resolveGlobalSingleton(warningFilterKey, () => ({ installed: false }));
	if (state.installed) return;
	const originalEmitWarning = process.emitWarning.bind(process);
	const wrappedEmitWarning = ((...args) => {
		if (shouldIgnoreWarning(normalizeWarningArgs(args))) return;
		if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
			const warning = args[0];
			const emitted = Object.assign(new Error(warning.message), {
				name: warning.name,
				code: warning.code
			});
			process.emit("warning", emitted);
			return;
		}
		Reflect.apply(originalEmitWarning, process, args);
	});
	process.emitWarning = wrappedEmitWarning;
	state.installed = true;
}
//#endregion
//#region src/infra/node-sqlite.ts
const require$1 = createRequire(import.meta.url);
let validatedSqliteModule;
function resolveSqliteFilesystemPath(pathname) {
	if (process.platform !== "win32") return pathname;
	return path.toNamespacedPath(path.resolve(pathname));
}
function resolveNodeSqliteLocation(location) {
	if (location === "" || location === ":memory:" || location.startsWith("file:")) return location;
	return resolveSqliteFilesystemPath(location);
}
/** Preserve native Windows path prefixes before adding SQLite URI parameters. */
function resolveSqliteFileUriPath(pathname, platform) {
	if (platform === "win32") {
		const namespacedPath = path.win32.toNamespacedPath(path.win32.resolve(pathname));
		return `file:${encodeURIComponent(namespacedPath)}`;
	}
	return pathToFileURL(path.resolve(pathname)).href;
}
/** Open an existing writable database without SQLite's create-if-missing flag. */
function resolveExistingSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=rw`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`Assistant requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.16.0+ or 26.1.0+ before retrying."}`);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule === sqlite) return;
	const database = new sqlite.DatabaseSync(":memory:");
	try {
		const row = database.prepare("SELECT sqlite_version() AS version").get();
		const version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		compareValidSemver(version, "3.45.0");
		database.prepare("SELECT sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()?.omitted;
		validatedSqliteModule = sqlite;
	} finally {
		database.close();
	}
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		ensureSqliteLibrarySelected();
		const sqlite = require$1("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Open node:sqlite through Assistant's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const database = options === void 0 ? new sqlite.DatabaseSync(resolvedLocation) : new sqlite.DatabaseSync(resolvedLocation, options);
	registerSqliteReaderConnection(database);
	return database;
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.testclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code === "EROFS") return hasRestrictivePermissions(target);
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/sqlite-error-diagnostics.ts
const inspectionOperations = resolveGlobalSingleton(Symbol.for("testclaw.sqliteInspectionOperations"), () => /* @__PURE__ */ new WeakMap());
const nativeOpenFailures = resolveGlobalSingleton(Symbol.for("testclaw.sqliteNativeOpenFailures"), () => /* @__PURE__ */ new WeakSet());
function markSqliteNativeOpenFailure(error) {
	if (error !== null && typeof error === "object") nativeOpenFailures.add(error);
}
/** Record the native effect without changing its error or tagging surrounding authority checks. */
function withSqliteNativeOpen(open) {
	try {
		return open();
	} catch (error) {
		markSqliteNativeOpenFailure(error);
		throw error;
	}
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
function withSqliteInspectionOperation(operation, run) {
	try {
		return run();
	} catch (error) {
		throw markSqliteInspectionOperation(error, operation);
	}
}
const SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const SQLITE_BUSY_RESULT_CODE = 5;
const SQLITE_LOCKED_RESULT_CODE = 6;
const SQLITE_CORRUPT_RESULT_CODE = 11;
const SQLITE_NOTADB_RESULT_CODE = 26;
const SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
function sqliteErrorCode(error) {
	const code = asOptionalObjectRecord(error)?.code;
	return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
	const errcode = asOptionalObjectRecord(error)?.errcode;
	return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
	const errcode = sqliteExtendedResultCode(error);
	return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
	const code = sqliteErrorCode(error);
	if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
/** Report proven file damage (corrupt page or non-database header), not transient failure. */
function isSqliteCorruptionError(error) {
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_CORRUPT_RESULT_CODE || primaryCode === SQLITE_NOTADB_RESULT_CODE;
}
//#endregion
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/infra/sqlite-busy-timeout.ts
const lockFailureReportingByDatabase = /* @__PURE__ */ new WeakMap();
function normalizeSqliteNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function readSqliteBusyTimeout(database) {
	const row = database.prepare("PRAGMA busy_timeout").get();
	const value = row?.busy_timeout ?? row?.timeout;
	return typeof value === "bigint" ? Number(value) : Number(value ?? 0);
}
function setSqliteBusyTimeout(database, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	database.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs}`);
}
function shouldReportSqliteLockFailure(database) {
	return lockFailureReportingByDatabase.get(database) !== "suppress";
}
/** Run with a temporary busy policy; restore early when write admission finishes. */
function runWithSqliteBusyTimeout(database, busyTimeoutMs, operation, options = {}) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	const previousBusyTimeoutMs = readSqliteBusyTimeout(database);
	const previousLockFailureReporting = lockFailureReportingByDatabase.get(database);
	if (options.lockFailureReporting) lockFailureReportingByDatabase.set(database, options.lockFailureReporting);
	if (previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, normalizedTimeoutMs);
	const restore = () => {
		if (database.isOpen && previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, previousBusyTimeoutMs);
		if (previousLockFailureReporting) lockFailureReportingByDatabase.set(database, previousLockFailureReporting);
		else lockFailureReportingByDatabase.delete(database);
	};
	try {
		return operation(restore);
	} finally {
		restore();
	}
}
//#endregion
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("testclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
const transactionLog = createSubsystemLogger("sqlite/transaction");
const writeAdmissionServices = resolveGlobalSingleton(Symbol.for("testclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
const writeAdmissionLocations = /* @__PURE__ */ new WeakMap();
function writeAdmissionLocation(database) {
	const cached = writeAdmissionLocations.get(database);
	if (cached !== void 0) return cached;
	const location = database.location();
	const canonical = location === null ? null : normalizeWriteAdmissionLocation(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
}
function normalizeWriteAdmissionLocation(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !path.win32.isAbsolute(normalized) ? location : normalized;
}
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeWriteAdmissionLocation))].map((location) => {
		const services = writeAdmissionServices.get(location) ?? /* @__PURE__ */ new Set();
		const retained = () => service();
		services.add(retained);
		writeAdmissionServices.set(location, services);
		return {
			location,
			services,
			retained
		};
	});
	return () => {
		for (const { location, services, retained } of registrations) {
			services.delete(retained);
			if (services.size === 0 && writeAdmissionServices.get(location) === services) writeAdmissionServices.delete(location);
		}
	};
}
/** Native coordinator waits must keep the same worker's current-authority grants serviceable. */
function sqliteWriteAdmissionServicesForLocation(location) {
	return writeAdmissionServices.get(normalizeWriteAdmissionLocation(location));
}
function execNativeBegin(db, diagnostics) {
	const startedAt = Date.now();
	diagnostics.nativeAttempts += 1;
	try {
		db.exec("BEGIN IMMEDIATE");
	} finally {
		diagnostics.nativeMs += Date.now() - startedAt;
	}
}
function beginImmediateTransaction(db, diagnostics) {
	const location = writeAdmissionServices.size > 0 ? writeAdmissionLocation(db) : null;
	const services = location === null ? void 0 : writeAdmissionServices.get(location);
	if (!services) {
		execNativeBegin(db, diagnostics);
		return;
	}
	const deadline = performance.now() + readSqliteBusyTimeout(db);
	while (true) try {
		runWithSqliteBusyTimeout(db, Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))), () => execNativeBegin(db, diagnostics));
		return;
	} catch (error) {
		if (!isSqliteLockError(error) || performance.now() >= deadline) throw error;
		for (const service of services) {
			const startedAt = Date.now();
			diagnostics.serviceCalls += 1;
			try {
				service();
			} finally {
				diagnostics.serviceMs += Date.now() - startedAt;
			}
		}
		if (performance.now() >= deadline) throw error;
	}
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
function slowBusyWaitThresholdMs(options) {
	if (options?.busyTimeoutMs === void 0 || options.busyTimeoutMs <= 0) return DEFAULT_SLOW_BUSY_WAIT_MS;
	return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, options.busyTimeoutMs);
}
function slowTransactionHoldThresholdMs(options) {
	return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
	return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction hold", {
		async: false,
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		threadId,
		thresholdMs: slowTransactionHoldThresholdMs(params.options)
	});
}
/** The lifecycle lock precedes BEGIN, so transaction hold diagnostics cannot see this wait. */
function logSlowSqliteCoordinatorWait(elapsedMs, options) {
	if (!isMainThread || elapsedMs <= 100) return;
	transactionLogger(void 0).warn("slow SQLite coordinator lock wait", {
		async: false,
		database: options.databaseLabel,
		elapsedMs,
		isMainThread,
		operation: options.operationLabel,
		pid: process.pid,
		threadId,
		thresholdMs: 100
	});
}
function logSlowTransactionStep(params) {
	if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction step", {
		async: false,
		...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		step: params.step,
		threadId,
		...beginAdmissionLogFields(params.beginAdmission)
	});
}
function beginAdmissionLogFields(diagnostics) {
	return diagnostics ? { beginAdmission: {
		nativeAttempts: diagnostics.nativeAttempts,
		nativeMs: diagnostics.nativeMs,
		serviceCalls: diagnostics.serviceCalls,
		serviceMs: diagnostics.serviceMs
	} } : {};
}
function execTimedTransactionStep(params) {
	const startedAt = Date.now();
	const beginAdmission = params.sql === "BEGIN IMMEDIATE" ? {
		nativeAttempts: 0,
		nativeMs: 0,
		serviceCalls: 0,
		serviceMs: 0
	} : void 0;
	try {
		if (beginAdmission) beginImmediateTransaction(params.db, beginAdmission);
		else params.db.exec(params.sql);
		const elapsedMs = Date.now() - startedAt;
		logSlowTransactionStep({
			beginAdmission,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db)) {
			const sqliteErrcode = sqliteExtendedResultCode(error);
			const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
			transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
				async: false,
				...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
				...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
				code: sqliteErrorCode(error),
				elapsedMs,
				failureKind: "lock-contention",
				isMainThread,
				...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
				pid: process.pid,
				...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
				...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
				step: params.step,
				threadId,
				...beginAdmissionLogFields(beginAdmission)
			});
		}
		throw error;
	}
}
function beginTransaction(db, options, mode) {
	execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
}
function commitImmediateTransaction(db, options) {
	execTimedTransactionStep({
		db,
		options,
		sql: "COMMIT",
		step: "commit"
	});
}
function discardUnsafeConnection(db, error) {
	db[abortedTransactionSymbol] ??= { error };
	discardSqliteTransactionState(db, error);
	clearNodeSqliteKyselyCacheForDatabase(db);
	try {
		db.close();
	} catch {}
}
function abortImmediateTransaction(db, error) {
	if (db[abortedTransactionSymbol]) return;
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	assertTransactionUsable(db);
	if (db.isTransaction) {
		db.exec("SAVEPOINT testclaw_tx_nested");
		try {
			const result = operation();
			assertSyncTransactionResult(result);
			assertTransactionUsable(db);
			db.exec("RELEASE SAVEPOINT testclaw_tx_nested");
			return result;
		} catch (error) {
			const failure = db[abortedTransactionSymbol];
			if (failure) throw failure.error;
			try {
				db.exec("ROLLBACK TO SAVEPOINT testclaw_tx_nested");
				db.exec("RELEASE SAVEPOINT testclaw_tx_nested");
			} catch {
				discardUnsafeConnection(db, error);
			}
			throw error;
		}
	}
	beginTransaction(db, options, mode);
	const transactionStartedAt = Date.now();
	try {
		const result = operation();
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(() => commitImmediateTransaction(db, options)));
		else commitImmediateTransaction(db, options);
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error);
		assertTransactionUsable(db);
		throw error;
	} finally {
		try {
			logSlowTransactionHold({
				elapsedMs: Date.now() - transactionStartedAt,
				options
			});
		} catch {}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "deferred", options);
}
/** Pin an implicit read snapshot without requiring transaction-control authorization. */
function runSqlitePinnedReadSnapshotSync(db, operation) {
	return executeWithCachedStatement(db, "PRAGMA schema_version", [], (statement) => {
		const snapshot = statement.iterate();
		try {
			if (snapshot.next().done) throw new Error("SQLite schema version query returned no row");
			return operation();
		} finally {
			snapshot.return?.();
		}
	});
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "immediate", options);
}
//#endregion
//#region src/infra/sqlite-coordinator.ts
const SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("testclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
});
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fsSync.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fsSync.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		if ((stats.mode & 4095) !== 448) applyPrivateModeSync(directoryPath, 448);
		const secured = fsSync.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
const coordinatorPool = resolveGlobalSingleton(Symbol.for("testclaw.sqliteCoordinatorPool"), () => ({
	runInCoordinatorPoolContext: AsyncLocalStorage.snapshot(),
	idleCoordinators: /* @__PURE__ */ new Map(),
	failedIdleCloses: /* @__PURE__ */ new Map(),
	exitCloseRegistered: false,
	closeOnExit: closeIdleCoordinatorsOnExit
}), () => closeIdleCoordinatorPool(), "close-only");
const { runInCoordinatorPoolContext, idleCoordinators, failedIdleCloses } = coordinatorPool;
function updateCoordinatorExitClose() {
	const needed = idleCoordinators.size > 0 || failedIdleCloses.size > 0;
	if (needed && !coordinatorPool.exitCloseRegistered) process.once("exit", coordinatorPool.closeOnExit);
	else if (!needed && coordinatorPool.exitCloseRegistered) process.removeListener("exit", coordinatorPool.closeOnExit);
	coordinatorPool.exitCloseRegistered = needed;
}
function takeIdleCoordinator(location) {
	const idle = idleCoordinators.get(location);
	if (idle) {
		idleCoordinators.delete(location);
		clearTimeout(idle.timer);
		updateCoordinatorExitClose();
	}
	return idle;
}
function closeIdleCoordinatorDatabase(database, location) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (database.isOpen) failedIdleCloses.set(database, location);
		else failedIdleCloses.delete(database);
		updateCoordinatorExitClose();
	}
}
function closeIdleCoordinatorsOnExit() {
	const databases = new Map(failedIdleCloses);
	for (const [location] of idleCoordinators) {
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch {}
}
function closeIdleCoordinatorPool(include = () => true) {
	const databases = new Map([...failedIdleCloses].filter(([, location]) => include(location)));
	for (const [location] of idleCoordinators) {
		if (!include(location)) continue;
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	const errors = [];
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Idle SQLite coordinator cleanup failed");
}
function readCoordinatorIdentity(location) {
	try {
		const identity = fsSync.lstatSync(location, { bigint: true });
		return identity.isFile() && identity.dev !== 0n && identity.ino !== 0n ? identity : void 0;
	} catch {
		return;
	}
}
function matchesCoordinatorIdentity(left, right) {
	return right !== void 0 && sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid;
}
function retainIdleCoordinator(location, database, identity) {
	const previous = takeIdleCoordinator(location);
	if (previous) closeIdleCoordinatorDatabase(previous.database, location);
	const timer = runInCoordinatorPoolContext(() => setTimeout(() => {
		if (idleCoordinators.get(location)?.timer !== timer) return;
		const idle = takeIdleCoordinator(location);
		if (!idle) return;
		try {
			closeIdleCoordinatorDatabase(idle.database, location);
		} catch (error) {
			process.emitWarning(new SqliteCoordinatorError("Idle SQLite coordinator close failed", error));
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	idleCoordinators.set(location, {
		database,
		identity,
		timer
	});
	updateCoordinatorExitClose();
	return true;
}
function tryAcquireSqliteCoordinator(location, mode, options) {
	const busyTimeoutMs = Math.max(0, Math.trunc(options.busyTimeoutMs ?? 0));
	const reusableLocation = location !== "" && location !== ":memory:" && !location.startsWith("file:") ? path.resolve(location) : void 0;
	const poolLocation = reusableLocation && (options.keepAlive || idleCoordinators.has(reusableLocation)) ? reusableLocation : void 0;
	const before = poolLocation ? readCoordinatorIdentity(poolLocation) : void 0;
	const idle = poolLocation ? takeIdleCoordinator(poolLocation) : void 0;
	const reused = idle && matchesCoordinatorIdentity(idle.identity, before) ? idle : void 0;
	if (poolLocation && idle && !reused) closeIdleCoordinatorDatabase(idle.database, poolLocation);
	const database = reused?.database ?? withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let identity;
	try {
		const services = mode === "exclusive" ? sqliteWriteAdmissionServicesForLocation(location) : void 0;
		const deadline = performance.now() + busyTimeoutMs;
		for (;;) {
			const attemptTimeout = services ? Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))) : busyTimeoutMs;
			try {
				database.exec(`PRAGMA busy_timeout = ${attemptTimeout}; PRAGMA journal_mode = MEMORY; ${mode === "exclusive" ? "BEGIN EXCLUSIVE;" : "BEGIN; SELECT rootpage FROM sqlite_schema LIMIT 1;"}`);
				break;
			} catch (error) {
				if (!services || !isSqliteLockError(error) || performance.now() >= deadline) throw error;
				for (const service of services) service();
			}
		}
		if (poolLocation && before) {
			if (matchesCoordinatorIdentity(before, readCoordinatorIdentity(poolLocation))) identity = before;
			else if (reused) throw new SqliteCoordinatorError("SQLite coordinator changed during acquisition");
		}
	} catch (error) {
		if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
		else database.close();
		if (isSqliteLockError(error)) return null;
		throw error;
	}
	let released = false;
	return {
		get closed() {
			return released || !database.isOpen;
		},
		release: (releaseOptions) => {
			if (released || !database.isOpen) return;
			const errors = [];
			if (database.isTransaction) try {
				database.exec("ROLLBACK");
				if (poolLocation && database.isTransaction) throw new SqliteCoordinatorError("SQLite coordinator rollback left its transaction open");
			} catch (error) {
				errors.push(error);
			}
			let retained = false;
			if (errors.length === 0 && options.keepAlive && releaseOptions?.keepAlive !== false && poolLocation && identity && !failedIdleCloses.has(database)) try {
				retained = retainIdleCoordinator(poolLocation, database, identity);
			} catch (error) {
				errors.push(error);
			}
			if (!retained && database.isOpen) try {
				if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
				else database.close();
			} catch (error) {
				errors.push(error);
			}
			released = retained || !database.isOpen;
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite coordinator rollback and close both failed");
		}
	};
}
/** Hold a raw exclusive transaction until release for cross-process coordination. */
function tryAcquireExclusiveSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "exclusive", options);
}
/** Retain a read lock for a live handle; no rows or journal files are written. */
function tryAcquireSharedSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "shared", options);
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
function resolveGatewaySchemaFencePath(params) {
	return resolveLifecycleCoordinatorPath("gateway-lifecycle", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
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
//#endregion
//#region src/infra/sqlite-worker-identity.ts
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${file.dev}:${file.ino}`,
		canonicalPath
	};
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = realpathSync(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const missing = [];
	let ancestor = resolvedPath;
	while (true) try {
		const canonicalPath = path.join(realpathSync(ancestor), ...missing);
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		missing.unshift(path.basename(ancestor));
		const parent = path.dirname(ancestor);
		if (parent === ancestor) throw error;
		ancestor = parent;
	}
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat(databasePath, { bigint: true }).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat(canonicalPath, { bigint: true }), canonicalPath);
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = path.join(await realpath(ancestor), ...missing);
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		missing.unshift(path.basename(ancestor));
		const parent = path.dirname(ancestor);
		if (parent === ancestor) throw error;
		ancestor = parent;
	}
}
function assertExistingDatabaseIdentity(databasePath, expected) {
	const file = statSync(databasePath, { bigint: true });
	if (!file.isFile() || `file:${file.dev}:${file.ino}` !== expected) throw new Error("SQLite database file identity changed before existing-only open");
}
//#endregion
//#region src/state/testclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
function isStateDatabaseReadAdmissionInvalidatedError(error) {
	return extractErrorCode(error) === STATE_DATABASE_READ_ADMISSION_INVALIDATED;
}
const maintenanceResources = resolveGlobalSingleton(Symbol.for("testclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getAssistantDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
function isAssistantDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeAssistantDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getAssistantDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createAssistantStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const known = (pathname) => {
		const resolvedPath = path.resolve(pathname);
		return [...records.values()].find((record) => record.paths.has(resolvedPath));
	};
	const overlaps = (left, right) => left.identity.key === right.identity.key || [...left.paths].some((pathname) => right.paths.has(pathname));
	const isSealed = (record) => [...seals].some((held) => held.record === void 0 || overlaps(held.record, record));
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("Assistant state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || record.paths.has(identity.canonicalPath) || isSealed(record)) return record;
		if ([...record.paths].some((pathname) => inspectDatabasePathIdentitySync(pathname)?.key === identity.key)) return record;
		invalidate(record);
		forget(record);
	};
	const resolve = (pathname, preparedIdentity) => {
		const resolvedPath = path.resolve(pathname);
		const cached = known(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) {
				records.delete(record.identity.key);
				record.identity = identity;
				records.set(identity.key, record);
			}
		}
		if (!record) {
			record = {
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: {}
			};
			records.set(identity.key, record);
		}
		record.paths.add(resolvedPath).add(identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const cached = known(pathname);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(pathname);
		return identity ? resolve(pathname, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) current.generation = {};
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const forget = (record) => {
		if (!isSealed(record) && records.get(record.identity.key) === record) records.delete(record.identity.key);
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		publish(pathname) {
			const resolvedPath = path.resolve(pathname);
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = known(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					records.delete(previous.identity.key);
					previous.identity = identity;
					records.set(identity.key, previous);
					record = previous;
				} else {
					invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			record.paths.add(resolvedPath).add(identity.canonicalPath);
			return identity;
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const databasePath = path.resolve(pathname);
			const record = resolve(databasePath);
			assertOpen(record);
			const generation = record.generation;
			return {
				databasePath,
				get identity() {
					return record.identity;
				},
				assertCurrent() {
					assertOpen(record);
					if (records.get(record.identity.key) !== record || record.generation !== generation) throw new StateDatabaseReadAdmissionInvalidatedError("Assistant state database read admission changed");
				}
			};
		},
		holdExclusion(pathname) {
			const record = resolve(pathname);
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = {
					seal: seal(record),
					retained: /* @__PURE__ */ new Set()
				};
				attempts.set(record, attempt);
			}
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Assistant state resource drainage failed", errors[0]);
				const retired = retireNative(record?.identity);
				attempts.delete(record);
				seals.delete(current.seal);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						seals.delete(entry.seal);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Maps the borrowed-descriptor digest to Assistant's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function assertRegularFile(stat) {
	if (!stat.isFile()) throw new Error("SQLite generation target must be a regular file");
}
function sameFileState(left, right) {
	return sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
function fingerprintFile(pathname) {
	const fd = fsSync.openSync(pathname, "r");
	try {
		const before = fsSync.fstatSync(fd, { bigint: true });
		assertRegularFile(before);
		const { sha256 } = hashFileDescriptorSync(fd);
		const after = fsSync.fstatSync(fd, { bigint: true });
		const current = fsSync.statSync(pathname, { bigint: true });
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
		fsSync.closeSync(fd);
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
	const startedAt = performance$1.now();
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
			diagnostics.integrityGateMs = Math.floor(performance$1.now() - startedAt);
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
	const startedAt = timing ? performance$1.now() : 0;
	try {
		assertSqliteIntegrity(check.database, check.databaseLabel);
	} finally {
		if (timing) timing.syncElapsedMs = performance$1.now() - startedAt;
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
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readStableSqliteFileGeneration(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			for (;;) {
				const failure = failures.get(resolvedPath);
				if (!failure?.generation) return failure?.error;
				const current = await isCurrentGeneration(resolvedPath, failure.generation);
				if (failures.get(resolvedPath) !== failure) continue;
				if (!current) {
					failures.delete(resolvedPath);
					return;
				}
				return failure.error;
			}
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			if (generation && !generationMatchesPath(resolvedPath, generation)) {
				failures.delete(resolvedPath);
				return false;
			}
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
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
function sqliteFileBytes(pathname) {
	try {
		return fsSync.statSync(pathname).size;
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
		return fsSync.statSync(pathname, { bigint: true });
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
		descriptors = fsSync.readdirSync(PROC_SELF_FD_PATH);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		let linkedPath;
		try {
			linkedPath = fsSync.readlinkSync(descriptorPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		let descriptor;
		try {
			descriptor = fsSync.fstatSync(Number(descriptorName), { bigint: true });
		} catch (error) {
			if (hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		try {
			if (fsSync.readlinkSync(descriptorPath) !== linkedPath) continue;
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
		fsSync.writeSync(2, `${JSON.stringify({
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
const log$1 = createSubsystemLogger("infra/sqlite-wal");
const runInSqliteMaintenanceContext = AsyncLocalStorage.snapshot();
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
	return normalizedTimeoutMs;
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
			stats = fsSync.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fsSync.realpathSync(current);
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
			value: parseProcMountInfoEntries(fsSync.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
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
			return isWindowsUncPath(path.win32.normalize(fsSync.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fsSync.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		const filesystemType = fsSync.statfsSync(checkedPaths.canonicalPath).type;
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
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fsSync.existsSync(options.databasePath) ? fsSync.realpathSync.native(options.databasePath) : void 0;
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
						log$1.warn("SQLite WAL split-brain detection disabled", {
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
//#region src/infra/kysely-sync.ts
const nodeVersion = parseNodeReleaseVersion(process.versions.node);
const supportsRepreparedAll = !process.versions.bun && (nodeVersion?.major === 24 && isNodeVersionAtLeast(nodeVersion, {
	major: 24,
	minor: 20,
	patch: 0
}) || isNodeVersionAtLeast(nodeVersion, {
	major: 26,
	minor: 6,
	patch: 0
}));
const compileOnlySqliteDialect = new SqliteDialect({ database: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
} });
function getNodeSqliteKysely(db) {
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
function throwSqliteIteratorCleanupError(error) {
	throw toErrorObject(error, "SQLite iterator cleanup failed");
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery, firstRowOnly = false, parameters = compiledQuery.parameters) {
	try {
		const sql = compiledQuery.sql;
		installStatementInvalidation(db);
		return executeWithCachedStatement(db, sql, parameters, (statement) => {
			if (firstRowOnly && SelectQueryNode.is(compiledQuery.query)) {
				const row = statement.get(...parameters);
				return { rows: row === void 0 ? [] : [row] };
			}
			if (SelectQueryNode.is(compiledQuery.query) || statement.columns().length > 0) {
				if (supportsRepreparedAll) return { rows: statement.all(...parameters) };
				const iterator = statement.iterate(...parameters);
				const reader = retainSqliteReader(db, "kysely eager query");
				let cleanupError;
				let failed = false;
				let failure;
				const rows = [];
				try {
					for (const row of iterator) {
						reader.progress();
						rows.push(row);
					}
				} catch (error) {
					failed = true;
					failure = error;
				}
				try {
					iterator.return?.();
				} catch (error) {
					cleanupError = error;
				}
				reader.release();
				if (failed) throw toErrorObject(failure, "SQLite query failed");
				if (cleanupError !== void 0) throw toErrorObject(cleanupError, "SQLite query cleanup failed");
				return { rows };
			}
			statement.setReadBigInts(true);
			let outcome;
			try {
				outcome = statement.run(...parameters);
			} finally {
				statement.setReadBigInts(false);
			}
			const { changes, lastInsertRowid } = outcome;
			const result = {
				numAffectedRows: BigInt(changes),
				rows: []
			};
			if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
				...result,
				insertId: BigInt(lastInsertRowid)
			};
			return result;
		});
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Compile fixed SQL and fresh bindings without taking ownership of a native statement. */
function compileSqliteQueryBindings(build) {
	const bindings = /* @__PURE__ */ new Map();
	const compiled = build((read) => {
		const marker = Symbol("sqlite-query-parameter");
		bindings.set(marker, read);
		return sql`${marker}`;
	}).compile();
	const readers = compiled.parameters.map((value) => bindings.get(value) ?? (() => value));
	return {
		compiled,
		bind: (params) => readers.map((read) => read(params))
	};
}
/** Compile a fixed query once; bind fresh values through the normal sync executor on each call. */
function prepareSqliteQuerySync(db, build) {
	const { compiled, bind } = compileSqliteQueryBindings(build);
	return (params) => executeCompiledSqliteQuerySync(db, compiled, false, bind(params));
}
/** Compile and lazily iterate a Kysely query synchronously against node:sqlite. */
function iterateSqliteQuerySync(db, query) {
	const owner = captureSqliteReaderOwner();
	return (function* () {
		const compiledQuery = query.compile();
		try {
			const statement = db.prepare(compiledQuery.sql);
			if (!SelectQueryNode.is(compiledQuery.query) && statement.columns().length === 0) return;
			const parameters = compiledQuery.parameters;
			const iterator = statement.iterate(...parameters);
			const reader = retainSqliteReader(db, "kysely iterator", owner);
			let cleanupError;
			let failed = false;
			try {
				for (const row of iterator) {
					reader.progress();
					yield row;
				}
			} catch (error) {
				failed = true;
				throw toErrorObject(error, "SQLite iterator failed");
			} finally {
				try {
					iterator.return?.();
				} catch (error) {
					cleanupError = error;
				}
				reader.release();
				if (!failed && cleanupError !== void 0) throwSqliteIteratorCleanupError(cleanupError);
			}
		} catch (error) {
			reportNodeSqliteKyselyQueryError(db, error);
			throw error;
		}
	})();
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile(), true).rows[0];
}
//#endregion
//#region src/infra/sqlite-schema-sql.ts
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"CHECK",
	"FOREIGN",
	"PRIMARY",
	"UNIQUE"
]);
/** Select canonical DDL without opening a database or changing its installation lifecycle. */
function extractSqliteTableSchema(schema, table, options = {}) {
	const start = schema.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
	const endMarker = options.endMarker ?? "\n) STRICT;";
	const end = schema.indexOf(endMarker, start);
	if (start < 0 || end < start) throw new Error(options.errorMessage ?? `Canonical schema markers are missing for ${table}`);
	return schema.slice(start, end + (options.includeEndMarker === false ? 0 : endMarker.length));
}
function readTableConstraintKeyword(sql, first) {
	let token = first;
	if (token.keyword === "CONSTRAINT") {
		const name = readSqlToken(sql, token.end);
		token = name ? readSqlToken(sql, name.end) : null;
	}
	return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
	let index = start;
	while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
	const char = sql[index];
	if (!char) return null;
	if (char === "\"" || char === "`") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	if (char === "[") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	let end = index;
	while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
	const raw = sql.slice(index, end);
	return {
		end,
		keyword: raw.toUpperCase(),
		raw
	};
}
function normalizeSqlIdentifier(identifier) {
	if (identifier.startsWith("\"") && identifier.endsWith("\"")) return identifier.slice(1, -1).replaceAll("\"\"", "\"").toLowerCase();
	if (identifier.startsWith("`") && identifier.endsWith("`")) return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
	if (identifier.startsWith("[") && identifier.endsWith("]")) return identifier.slice(1, -1).toLowerCase();
	return identifier.toLowerCase();
}
function normalizeSchemaSql(sql) {
	if (sql === null) return null;
	return normalizeSqlWhitespace(sql).replace(/;\s*$/u, "").trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
	const items = [];
	let depth = 0;
	let start = 0;
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
		index += 1;
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		if (sql[index] === character) return index;
		index += 1;
	}
	return -1;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	let index = open;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
		index += 1;
	}
	throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
	let normalized = "";
	let pendingSpace = false;
	const segments = /[^\s'"`[/-]+|\s+|./gsu;
	let segment;
	while (segment = segments.exec(sql)) {
		const index = segment.index;
		const char = segment[0][0] ?? "";
		const quoted = skipSqlQuoted(sql, index, char);
		if (quoted !== index) {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += sql.slice(index, quoted);
			pendingSpace = false;
			segments.lastIndex = quoted;
			continue;
		}
		const comment = skipSqlComment(sql, index);
		if (comment !== index) {
			pendingSpace = true;
			segments.lastIndex = comment;
			continue;
		}
		if (/\s/u.test(char)) pendingSpace = true;
		else {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += segment[0];
			pendingSpace = false;
		}
	}
	return normalized.trim();
}
function quoteSqliteIdentifier$1(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function skipSqlQuotedOrComment(sql, index) {
	const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
	return quoted !== index ? quoted : skipSqlComment(sql, index);
}
function skipSqlQuoted(sql, index, quote) {
	if (quote !== "'" && quote !== "\"" && quote !== "`" && quote !== "[") return index;
	const closingQuote = quote === "[" ? "]" : quote;
	let cursor = index + 1;
	while (cursor < sql.length) {
		if (sql[cursor] !== closingQuote) {
			cursor += 1;
			continue;
		}
		if (quote !== "[" && sql[cursor + 1] === closingQuote) {
			cursor += 2;
			continue;
		}
		return cursor + 1;
	}
	return sql.length;
}
function skipSqlComment(sql, index) {
	if (sql.startsWith("--", index)) {
		const newline = sql.indexOf("\n", index + 2);
		return newline === -1 ? sql.length : newline + 1;
	}
	if (sql.startsWith("/*", index)) {
		const close = sql.indexOf("*/", index + 2);
		return close === -1 ? sql.length : close + 2;
	}
	return index;
}
//#endregion
//#region src/infra/sqlite-schema-contract-assembly.ts
function createSqliteTableContract(tableName, table, tableList, indexes, triggers) {
	const normalizedTriggers = triggers.map((trigger) => ({
		name: trigger.name,
		sql: normalizeSchemaSql(trigger.sql)
	}));
	const normalizedTableSql = table.sql?.startsWith("CREATE TABLE ") ? null : normalizeSchemaSql(table.sql);
	const isVirtualTable = normalizedTableSql !== null && /^CREATE VIRTUAL TABLE /iu.test(normalizedTableSql);
	return {
		definition: isVirtualTable ? null : parseTableDefinition(table.sql, tableName),
		indexes,
		strict: tableList.strict,
		triggers: normalizedTriggers,
		virtualTableSql: isVirtualTable ? normalizedTableSql : null,
		withoutRowid: tableList.wr
	};
}
function createSqliteIndexContract(index, schemaSql, rows) {
	const terms = rows.map(({ cid, coll, desc, key, name, seqno }) => ({
		coll,
		desc,
		key,
		kind: sqliteIndexTermKind(cid),
		name,
		seqno
	}));
	return {
		name: index.name.startsWith("sqlite_autoindex_") ? null : index.name,
		origin: index.origin,
		partial: index.partial,
		sql: normalizeSchemaSql(schemaSql),
		terms,
		unique: index.unique
	};
}
function sqliteIndexTermKind(cid) {
	return cid === -2 ? "expression" : cid === -1 ? "rowid" : "column";
}
function parseTableDefinition(sql, tableName) {
	if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
	const open = findSqlCharacter(sql, "(");
	if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
	const close = findSqlClosingParenthesis(sql, open);
	const columns = /* @__PURE__ */ new Map();
	const constraints = [];
	for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
		const definition = normalizeSqlWhitespace(rawDefinition);
		if (!definition) continue;
		const token = readSqlToken(definition, 0);
		if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
		if (readTableConstraintKeyword(definition, token)) {
			constraints.push(definition);
			continue;
		}
		const columnName = normalizeSqlIdentifier(token.raw);
		if (columns.has(columnName)) throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
		columns.set(columnName, definition);
	}
	return {
		columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
		constraints: constraints.toSorted()
	};
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
function defaultIssueMessage(code, objectName) {
	const tableName = objectName.split(".", 1)[0];
	switch (code) {
		case "missing-table": return `missing table ${objectName}`;
		case "missing-column":
		case "unexpected-column":
		case "column-definition-drift": return `column definitions differ for ${tableName}`;
		case "table-constraint-drift": return `table constraints differ for ${objectName}`;
		case "table-definition-drift": return `table definition differs for ${objectName}`;
		case "missing-or-drifted-index": return `missing or drifted index ${objectName}`;
		case "unexpected-unique-index": return `unexpected unique index ${objectName}`;
		case "missing-or-drifted-trigger": return `missing or drifted trigger ${objectName}`;
		case "unexpected-trigger": return `unexpected trigger ${objectName}`;
		case "virtual-table-definition-drift": return `virtual table definition differs for ${objectName}`;
		case "table-options-drift": return `table options differ for ${objectName}`;
	}
	throw new Error("Unsupported SQLite schema issue code", { cause: code });
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const isColumnIssue = (issue) => issue.code === "column-definition-drift" || issue.code === "missing-column" || issue.code === "unexpected-column";
	const columnIssueTables = new Set(issues.filter(isColumnIssue).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}; run testclaw doctor --fix to repair it.`);
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
const schemaContractCache = /* @__PURE__ */ new Map();
/** Reuse actual table facts only within one unchanged read transaction on this connection. */
function createSqliteTableContractReader(database) {
	const tables = /* @__PURE__ */ new Map();
	return (tableName) => {
		if (!tables.has(tableName)) tables.set(tableName, collectSqliteTableContract(database, tableName));
		return tables.get(tableName);
	};
}
/**
* Require every object from one committed schema while allowing unrelated
* tables and indexes that do not replace a canonical object.
*/
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}, readTable) {
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility, readTable);
	if (issues.length > 0) throwSqliteSchemaMismatches(databaseLabel, legacySqliteSchemaIssueMessages(issues));
}
/** Collect stable, machine-readable differences from one committed schema. */
function collectSqliteSchemaIssues(database, schemaSql, compatibility = {}, readTable) {
	return runSqlitePinnedReadSnapshotSync(database, () => collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable));
}
function collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable) {
	const expected = getSqliteSchemaContract(schemaSql);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		const actualTable = readTable ? readTable(tableName) : collectSqliteTableContract(database, tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		const actualIndexFingerprints = new Set(actualTable.indexes.map((index) => JSON.stringify(index)));
		const expectedIndexFingerprints = /* @__PURE__ */ new Set();
		for (const expectedIndex of expectedTable.indexes) {
			const fingerprint = JSON.stringify(expectedIndex);
			expectedIndexFingerprints.add(fingerprint);
			if (!actualIndexFingerprints.has(fingerprint)) {
				const objectName = expectedIndex.name ?? tableName;
				if (expectedIndex.name && allowedMissingIndexes.has(expectedIndex.name) && !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'index' AND name = ? COLLATE NOCASE LIMIT 1").get(expectedIndex.name)) continue;
				add("missing-or-drifted-index", objectName, `missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
			}
		}
		for (const actualIndex of actualTable.indexes) if (actualIndex.unique === 1 && !expectedIndexFingerprints.has(JSON.stringify(actualIndex))) add("unexpected-unique-index", actualIndex.name ?? tableName, `unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
		const optionalCanonicalTriggerGroups = collectOptionalCanonicalTriggerGroups(database, compatibility, tableName);
		const optionalCanonicalTriggers = optionalCanonicalTriggerGroups.flatMap((group) => group.triggers);
		const allowedMissingCanonicalTriggers = optionalCanonicalTriggerGroups.filter((group) => group.optional).flatMap((group) => group.triggers);
		for (const expectedTrigger of expectedTable.triggers) {
			if (allowedMissingCanonicalTriggers.some((canonicalTrigger) => canonicalTrigger.name === expectedTrigger.name)) continue;
			if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, expectedTrigger))) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!expectedTable.triggers.some((expectedTrigger) => isEqualTrigger(actualTrigger, expectedTrigger)) && !optionalCanonicalTriggers.some((canonicalTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("unexpected-trigger", actualTrigger.name);
		if (actualTable.virtualTableSql !== expectedTable.virtualTableSql) add("virtual-table-definition-drift", tableName);
		if (actualTable.strict !== expectedTable.strict || actualTable.withoutRowid !== expectedTable.withoutRowid) add("table-options-drift", tableName);
	}
	return issues;
}
/** Require stable canonical tables before a version-specific additive migration. */
function assertSqliteSchemaTablesPresent(database, databaseLabel, schemaSql, options = {}) {
	const allowedMissingTables = new Set(options.allowedMissingTables ?? []);
	const requiredTables = getCanonicalSqliteTableNames(schemaSql).filter((tableName) => !allowedMissingTables.has(tableName));
	const missingTables = [];
	const batchSize = 500;
	for (let offset = 0; offset < requiredTables.length; offset += batchSize) {
		const tables = requiredTables.slice(offset, offset + batchSize);
		const expected = tables.map((_table, ordinal) => `(${ordinal}, ?)`).join(", ");
		const present = database.prepare(`WITH expected(ordinal, name) AS (VALUES ${expected})
         SELECT ordinal FROM expected
         WHERE EXISTS (
           SELECT 1 FROM main.sqlite_schema
           WHERE type = 'table' AND name = expected.name LIMIT 1
         )`).all(...tables);
		const presentOrdinals = new Set(present.map((row) => row.ordinal));
		for (const [ordinal, tableName] of tables.entries()) if (!presentOrdinals.has(ordinal)) missingTables.push(`missing table ${tableName}`);
	}
	if (missingTables.length > 0) throwSqliteSchemaMismatches(databaseLabel, missingTables);
}
/** Return every explicit named index owned by one committed schema. */
function getCanonicalSqliteNamedIndexContracts(schemaSql) {
	const schema = getSqliteSchemaContract(schemaSql);
	const indexes = [];
	for (const [tableName, table] of schema) for (const fingerprint of table.indexes) {
		if (fingerprint.name === null || fingerprint.sql === null || fingerprint.origin !== "c") continue;
		indexes.push({
			definition: readCanonicalIndexDefinition(fingerprint),
			fingerprint,
			name: fingerprint.name,
			tableName,
			unique: fingerprint.unique === 1
		});
	}
	return indexes;
}
/** Return every table owned by one committed schema. */
function getCanonicalSqliteTableNames(schemaSql) {
	return [...getSqliteSchemaContract(schemaSql).keys()];
}
/** Inspect one explicit main-schema index using the canonical schema fingerprint shape. */
function collectSqliteNamedIndexContract(database, indexName) {
	const row = database.prepare(`
      SELECT tbl_name FROM (
        SELECT name, sql, tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?
      )
    `).get(indexName);
	if (!row || typeof row.tbl_name !== "string") return;
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier$1(row.tbl_name)})`).all()?.find((candidate) => candidate.name === indexName);
	return index ? collectSqliteIndexContract(database, index) : void 0;
}
function collectOptionalCanonicalTriggerGroups(database, compatibility, tableName) {
	return (compatibility.optionalCanonicalTriggerGroups ?? []).filter((group) => group.tableName === tableName).map((group) => ({
		optional: !group.optionalWhenTableMissing || !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(group.optionalWhenTableMissing),
		triggers: group.triggers.map((trigger) => ({
			name: trigger.name,
			sql: normalizeOptionalCanonicalTriggerSql(trigger.sql)
		}))
	}));
}
function normalizeOptionalCanonicalTriggerSql(sql) {
	return normalizeSchemaSql(sql)?.replace(/^(CREATE TRIGGER) main\./iu, "$1 ") ?? null;
}
function getSqliteSchemaContract(schemaSql) {
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function collectCanonicalSqliteFacts(database) {
	const tableOptions = database.prepare("PRAGMA table_list").all();
	if (tableOptions.some((row) => {
		const name = row.name.toLowerCase();
		return name === "pragma_index_list" || name === "pragma_index_xinfo";
	})) return;
	const indexes = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      i.name, i.origin, i.partial, i."unique", d.sql
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    LEFT JOIN sqlite_schema AS d ON d.type = 'index' AND d.name = i.name
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
  `).all();
	const terms = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      x.seqno, x.cid, x.name, x."desc", x.coll, x."key"
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    CROSS JOIN pragma_index_xinfo(i.name) AS x
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
    ORDER BY t.rowid, i.seq, x.seqno
  `).all();
	const triggers = database.prepare(`
    SELECT tbl_name, name, sql FROM sqlite_schema WHERE type = 'trigger' ORDER BY tbl_name, name
  `).all();
	return {
		tableOptions,
		indexes: groupCanonicalRows(indexes, (row) => row.table_id),
		terms: groupCanonicalRows(terms, (row) => row.table_id),
		triggers: groupCanonicalRows(triggers, (row) => row.tbl_name)
	};
}
function groupCanonicalRows(rows, key) {
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = key(row);
		const group = groups.get(name);
		if (group) group.push(row);
		else groups.set(name, [row]);
	}
	return groups;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		const rows = database.prepare(`
          SELECT CAST(rowid AS TEXT) AS table_id, name, sql
          FROM sqlite_schema
          WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `).all();
		if (rows.length === 0) return /* @__PURE__ */ new Map();
		const facts = collectCanonicalSqliteFacts(database);
		if (!facts) return new Map(rows.map((table) => [table.name, collectSqliteTableContractFromRow(database, table.name, table)]));
		return new Map(rows.map((table) => {
			const tableList = facts.tableOptions.find((entry) => entry.name === table.name);
			if (!tableList) throw new Error(`Could not inspect SQLite table options for ${table.name}.`);
			const termsByIndex = groupCanonicalRows(facts.terms.get(table.table_id) ?? [], (term) => term.index_seq);
			const indexes = (facts.indexes.get(table.table_id) ?? []).map((index) => createSqliteIndexContract(index, index.sql, termsByIndex.get(index.index_seq) ?? [])).toSorted(compareJson);
			return [table.name, createSqliteTableContract(table.name, table, tableList, indexes, facts.triggers.get(table.name) ?? [])];
		}));
	} finally {
		database.close();
	}
}
function readCanonicalIndexDefinition(index) {
	if (index.name === null || index.sql === null) throw new Error("Canonical SQLite named index is missing its schema definition.");
	const prefix = (index.unique === 1 ? /^CREATE\s+UNIQUE\s+INDEX\s+/iu : /^CREATE\s+INDEX\s+/iu).exec(index.sql);
	if (!prefix) throw new Error(`Canonical SQLite index ${index.name} has an unreadable definition.`);
	const name = readSqlToken(index.sql, prefix[0].length);
	if (!name || normalizeSqlIdentifier(name.raw) !== index.name.toLowerCase()) throw new Error(`Canonical SQLite index ${index.name} has an unexpected schema name.`);
	const definition = index.sql.slice(name.end).trim();
	if (!/^ON\s+/iu.test(definition)) throw new Error(`Canonical SQLite index ${index.name} has an unreadable target.`);
	return definition;
}
function collectSqliteTableContract(database, tableName) {
	const table = executeWithCachedStatement(database, "SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName));
	if (!table) return;
	return collectSqliteTableContractFromRow(database, tableName, table);
}
function collectSqliteTableContractFromRow(database, tableName, table) {
	const quotedTable = quoteSqliteIdentifier$1(tableName);
	const tableList = database.prepare(`PRAGMA table_list(${quotedTable})`).all().find((entry) => entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	return createSqliteTableContract(tableName, table, tableList, database.prepare(`PRAGMA index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index)).toSorted(compareJson), executeWithCachedStatement(database, `
          SELECT name, sql
          FROM sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `, [tableName], (statement) => statement.all(tableName)));
}
function compareTableDefinitions(tableName, actual, expected, compatibility, allowCompatibleAdditiveColumns) {
	const issues = [];
	const add = (code, objectName) => {
		issues.push(createSqliteSchemaIssue(code, objectName));
	};
	if (!actual || !expected) {
		if (actual !== expected) add("table-definition-drift", tableName);
		return issues;
	}
	const allowedMissingColumns = new Set(compatibility.allowedMissingColumns ?? []);
	for (const [columnName, definition] of actual.columns) if (!expected.columns.has(columnName)) {
		if (allowCompatibleAdditiveColumns && compatibility.allowCompatibleAdditiveColumns && isCompatibleAdditiveColumnDefinition(definition)) continue;
		add("unexpected-column", `${tableName}.${columnName}`);
	}
	for (const [columnName, expectedDefinition] of expected.columns) {
		const objectName = `${tableName}.${columnName}`;
		const actualDefinition = actual.columns.get(columnName);
		if (actualDefinition === void 0) {
			if (!allowedMissingColumns.has(objectName)) add("missing-column", objectName);
			continue;
		}
		if (actualDefinition === expectedDefinition) continue;
		if (!(compatibility.allowedColumnDefinitions?.[objectName] ?? []).some((definition) => normalizeSqlWhitespace(definition) === actualDefinition)) add("column-definition-drift", objectName);
	}
	if (JSON.stringify(actual.constraints) !== JSON.stringify(expected.constraints)) add("table-constraint-drift", tableName);
	return issues;
}
const SQLITE_STRICT_DATATYPES = /* @__PURE__ */ new Set([
	"ANY",
	"BLOB",
	"INT",
	"INTEGER",
	"REAL",
	"TEXT"
]);
function isCompatibleAdditiveColumnDefinition(definition) {
	const name = readSqlToken(definition, 0);
	const type = name ? readSqlToken(definition, name.end) : null;
	return Boolean(type?.keyword && SQLITE_STRICT_DATATYPES.has(type.keyword) && definition.slice(type.end).trim().length === 0);
}
function collectSqliteIndexContract(database, index) {
	const row = executeWithCachedStatement(database, "SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = ?", [index.name], (statement) => statement.get(index.name));
	const terms = database.prepare(`PRAGMA index_xinfo(${quoteSqliteIdentifier$1(index.name)})`).all();
	return createSqliteIndexContract(index, typeof row?.sql === "string" ? row.sql : null, terms);
}
function isEqualTrigger(left, right) {
	return left.name === right.name && left.sql === right.sql;
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
function readSqliteSchemaCookie(database) {
	return database.prepare("PRAGMA schema_version").get()?.schema_version;
}
//#endregion
//#region src/infra/sqlite-strict.ts
const DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS = 5e3;
const STRICT_MIGRATION_TABLE_PREFIX = "__testclaw_strict_migration_";
const SQLITE_ROWID_ALIASES = [
	"_rowid_",
	"rowid",
	"oid"
];
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function readMainTableList(db) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_"));
}
function readTableColumns(db, tableName) {
	return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
	return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
		if (typeof row.name !== "string" || row.name.length === 0) throw new Error(`SQLite table ${tableName} has an invalid column name`);
		return row.name;
	});
}
function readTableRowidModel(db, tableName, tableRow) {
	if (Number(tableRow.wr ?? 0) === 1) return {
		alias: null,
		storage: "without-rowid"
	};
	const columns = readTableColumns(db, tableName);
	const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
	const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
	const primaryKeyType = primaryKeyColumns[0]?.type;
	if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) return {
		alias: null,
		storage: "integer-primary-key"
	};
	const declaredNames = new Set(columns.flatMap((column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []));
	const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
	if (!alias) throw new Error(`SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`);
	return {
		alias,
		storage: "implicit"
	};
}
function readCanonicalStrictTables(schemaSql) {
	const canonical = openNodeSqliteDatabase(":memory:");
	try {
		canonical.exec(schemaSql);
		const tables = readMainTableList(canonical).filter((row) => row.type === "table");
		const nonStrict = tables.flatMap((row) => Number(row.strict ?? 0) === 1 || typeof row.name !== "string" ? [] : [row.name]);
		if (nonStrict.length > 0) throw new Error(`Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`);
		return tables.map((row) => {
			if (typeof row.name !== "string") throw new Error("Canonical SQLite schema contains an unnamed table");
			const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
			if (typeof schemaRow?.sql !== "string") throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
			const rowidModel = readTableRowidModel(canonical, row.name, row);
			return {
				columns: readVisibleColumns(canonical, row.name),
				createSql: schemaRow.sql,
				name: row.name,
				rowidAlias: rowidModel.alias,
				rowidStorage: rowidModel.storage,
				usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
			};
		}).toSorted((left, right) => left.name.localeCompare(right.name));
	} finally {
		canonical.close();
	}
}
function rewriteCreateTableName(createSql, replacementName) {
	const openingParen = createSql.indexOf("(");
	if (openingParen === -1) throw new Error("Canonical SQLite table CREATE statement has no column list");
	return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
	return db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')").all().flatMap((row) => {
		if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) return [];
		return [{
			name: row.name,
			sql: row.sql,
			type: row.type
		}];
	}).toSorted((left, right) => {
		const typeOrder = {
			view: 0,
			index: 1,
			trigger: 2
		};
		return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
	});
}
function readAutoincrementHighWater(db, tableName) {
	if (!db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'").get()) return null;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
	if (row === void 0) return null;
	const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
	if (!normalized) throw new Error(`SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`);
	return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
	if (previousHighWater === null) return;
	const currentHighWater = readAutoincrementHighWater(db, tableName);
	const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(tableName, restored);
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
	const current = new Set(currentColumns);
	const canonical = new Set(canonicalColumns);
	const missing = canonicalColumns.filter((column) => !current.has(column));
	const extra = currentColumns.filter((column) => !canonical.has(column));
	if (missing.length === 0 && extra.length === 0) return;
	const details = [missing.length > 0 ? `missing ${missing.join(", ")}` : "", extra.length > 0 ? `extra ${extra.join(", ")}` : ""].filter(Boolean).join("; ");
	throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
	const row = db.prepare("PRAGMA foreign_keys").get();
	return Number(row?.foreign_keys ?? 0) === 1;
}
/**
* Rebuild canonical non-STRICT tables inside the caller's transaction.
* Foreign-key enforcement must be disabled before BEGIN; integrity is checked
* before this function returns so any bad row or relationship rolls back.
*/
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
	if (!db.isTransaction) throw new Error("SQLite STRICT schema migration requires an active transaction");
	const canonicalTables = readCanonicalStrictTables(schemaSql);
	db.exec(schemaSql);
	const currentTableRows = new Map(readMainTableList(db).filter((row) => row.type === "table" && typeof row.name === "string").map((row) => [row.name, row]));
	const tablesToMigrate = canonicalTables.filter((table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1);
	if (tablesToMigrate.length === 0) return { migratedTables: [] };
	if (readForeignKeysEnabled(db)) throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
	const preservedObjects = readPreservedSchemaObjects(db, new Set(tablesToMigrate.map((table) => table.name)));
	for (const object of preservedObjects) if (object.type === "trigger") db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
	for (const object of preservedObjects) if (object.type === "view") db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
	for (const [index, table] of tablesToMigrate.entries()) {
		const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
		if (currentTableRows.has(migrationTable)) throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
		const currentColumns = readVisibleColumns(db, table.name);
		assertMatchingColumns(table.name, currentColumns, table.columns);
		const currentTableRow = currentTableRows.get(table.name);
		if (!currentTableRow) throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
		const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
		if (currentRowidModel.storage !== table.rowidStorage) throw new Error(`SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`);
		const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
		db.exec(rewriteCreateTableName(table.createSql, migrationTable));
		const columns = table.columns.map(quoteSqliteIdentifier);
		if (table.rowidAlias) columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
		const copyColumns = columns.join(", ");
		try {
			db.exec(`INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`);
		} catch (error) {
			throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
		}
		db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
		db.exec(`ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`);
		restoreAutoincrementHighWater(db, table.name, previousHighWater);
	}
	db.exec(schemaSql);
	const findObject = db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1");
	for (const object of preservedObjects) if (!findObject.get(object.type, object.name)) db.exec(object.sql);
	assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
	return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
/** Atomically upgrade Assistant-owned tables described by a canonical STRICT schema. */
function migrateSqliteSchemaToStrict(db, schemaSql, options = {}) {
	if (db.isTransaction) throw new Error("SQLite STRICT schema migration cannot start inside a transaction");
	const foreignKeysWereEnabled = readForeignKeysEnabled(db);
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options), {
			busyTimeoutMs: options.busyTimeoutMs ?? DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS,
			databaseLabel: options.databaseLabel,
			operationLabel: "sqlite.strict-schema-migration"
		});
	} finally {
		if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = ON;");
	}
}
[
	"insert",
	"update",
	"delete"
].map((event) => ({
	name: `memory_index_chunks_revision_after_${event}`,
	sql: `CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${event}
    AFTER ${event.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`
}));
//#endregion
//#region src/state/testclaw-agent-schema.ts
const TESTCLAW_AGENT_SCHEMA_SQL = "-- Session storage doctrine: session_nodes.entry_json is the canonical logical-session\n-- record. Promoted session_nodes columns are query indexes projected only by the\n-- session entry writer; session_windows and their children own transcript generations.\n-- Legacy ACP provenance is private import evidence carried with its logical session.\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_nodes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  current_session_id TEXT NOT NULL,\n  entry_json TEXT NOT NULL,\n  legacy_acp_migration_json TEXT,\n  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),\n  updated_at INTEGER NOT NULL,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  created_at INTEGER,\n  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),\n  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),\n  created_actor_id TEXT,\n  owner_actor_type TEXT,\n  owner_actor_id TEXT,\n  owner_assigned_by_type TEXT,\n  owner_assigned_by_id TEXT,\n  owner_assigned_at INTEGER,\n  project_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  fork_source_session_key TEXT,\n  fork_source_session_id TEXT,\n  fork_source_entry_id TEXT,\n  label TEXT,\n  display_name TEXT,\n  category TEXT,\n  icon TEXT,\n  pinned_at INTEGER,\n  archived_at INTEGER,\n  last_read_at INTEGER,\n  last_interaction_at INTEGER,\n  last_activity_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at\n  ON session_nodes(updated_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at\n  ON session_nodes(last_interaction_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label\n  ON session_nodes(label, session_key)\n  WHERE label IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key\n  ON session_nodes(parent_session_key, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by\n  ON session_nodes(spawned_by, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status\n  ON session_nodes(status, session_key)\n  WHERE status IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at\n  ON session_nodes(archived_at, session_key)\n  WHERE archived_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active\n  ON session_nodes(session_key)\n  WHERE archived_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id\n  ON session_nodes(current_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending\n  ON session_nodes(session_key)\n  WHERE entry_valid = 0;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid\n  ON session_nodes(session_key)\n  WHERE entry_valid != 1;\n\nCREATE TABLE IF NOT EXISTS session_participants (\n  session_key TEXT NOT NULL,\n  identity_namespace TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  contribution_count INTEGER NOT NULL,\n  first_prompted_at INTEGER,\n  last_prompted_at INTEGER,\n  PRIMARY KEY (session_key, identity_namespace, actor_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_key_contract (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  main_key TEXT NOT NULL,\n  canonical_ready TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nINSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert\nAFTER INSERT ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update\nAFTER UPDATE OF entry_json ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update\nAFTER UPDATE OF current_session_id, updated_at ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TABLE IF NOT EXISTS session_windows (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  previous_session_id TEXT,\n  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),\n  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  transcript_updated_at INTEGER DEFAULT NULL,\n  transcript_observed_at INTEGER DEFAULT NULL,\n  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),\n  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),\n  plugin_owner_id TEXT,\n  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),\n  started_at INTEGER,\n  ended_at INTEGER,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),\n  channel TEXT,\n  account_id TEXT,\n  primary_conversation_id TEXT,\n  model_provider TEXT,\n  model TEXT,\n  agent_harness_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  display_name TEXT,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at\n  ON session_windows(updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key\n  ON session_windows(session_key, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at\n  ON session_windows(created_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation\n  ON session_windows(primary_conversation_id, updated_at DESC, session_id)\n  WHERE primary_conversation_id IS NOT NULL;\n\n-- No foreign key: node triggers settle key renames and deletion even while a\n-- maintenance owner has disabled foreign-key enforcement.\nCREATE TABLE IF NOT EXISTS session_canonical_validation_pending (\n  session_key TEXT NOT NULL PRIMARY KEY\n) STRICT;\n\n-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's\n-- conflict policy, including writers that predate this validation projection.\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert\nAFTER INSERT ON session_nodes\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT NEW.session_key\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update\nAFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,\n  parent_session_key, spawned_by, fork_source_session_key ON session_nodes\nWHEN OLD.session_key IS NOT NEW.session_key\n  OR OLD.current_session_id IS NOT NEW.current_session_id\n  OR OLD.entry_json IS NOT NEW.entry_json\n  OR OLD.entry_valid IS NOT NEW.entry_valid\n  OR OLD.parent_session_key IS NOT NEW.parent_session_key\n  OR OLD.spawned_by IS NOT NEW.spawned_by\n  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key\nBEGIN\n  DELETE FROM session_canonical_validation_pending\n  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT NEW.session_key\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete\nAFTER DELETE ON session_nodes\nBEGIN\n  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert\nAFTER INSERT ON session_windows\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id = NEW.session_id\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update\nAFTER UPDATE OF session_id, session_key ON session_windows\nWHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete\nAFTER DELETE ON session_windows\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id = OLD.session_id\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert\nAFTER INSERT ON session_key_contract\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update\nAFTER UPDATE OF main_key ON session_key_contract\nWHEN OLD.main_key IS NOT NEW.main_key\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete\nAFTER DELETE ON session_key_contract\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TABLE IF NOT EXISTS conversations (\n  conversation_id TEXT NOT NULL PRIMARY KEY,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),\n  peer_id TEXT NOT NULL,\n  delivery_target TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  thread_id TEXT,\n  native_channel_id TEXT,\n  native_direct_user_id TEXT,\n  label TEXT,\n  metadata_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup\n  ON conversations(channel, account_id, kind, peer_id, thread_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity\n  ON conversations(\n    channel,\n    account_id,\n    kind,\n    peer_id,\n    IFNULL(parent_conversation_id, ''),\n    IFNULL(thread_id, '')\n  );\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_updated\n  ON conversations(updated_at DESC, conversation_id);\n\nCREATE TABLE IF NOT EXISTS conversation_deliveries (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),\n  conversation_id TEXT NOT NULL,\n  source_session_key TEXT,\n  message_hash TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),\n  prepared_message_id TEXT,\n  platform_message_id TEXT,\n  queue_id TEXT,\n  rejection_error TEXT,\n  reply_message_id TEXT,\n  reply_to_id TEXT,\n  reply_thread_id TEXT,\n  reply_text TEXT,\n  reply_timestamp INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  CHECK (\n    (status = 'rejected' AND rejection_error IS NOT NULL) OR\n    (status != 'rejected' AND rejection_error IS NULL)\n  ),\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply\n  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)\n  WHERE status IN ('queued', 'sent', 'replied');\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated\n  ON conversation_deliveries(updated_at DESC, operation_id);\n\nCREATE TABLE IF NOT EXISTS session_conversations (\n  session_id TEXT NOT NULL,\n  conversation_id TEXT NOT NULL,\n  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),\n  route_context_json TEXT,\n  first_seen_at INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, conversation_id, role),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\n-- Older same-version writers preserve the envelope while updating the association.\nCREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update\nAFTER UPDATE OF role, last_seen_at ON session_conversations\nWHEN NEW.route_context_json IS OLD.route_context_json\nBEGIN\n  UPDATE session_conversations\n  SET route_context_json = NULL\n  WHERE session_id = NEW.session_id\n    AND conversation_id = NEW.conversation_id\n    AND role = NEW.role;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation\n  ON session_conversations(conversation_id, last_seen_at DESC, session_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary\n  ON session_conversations(session_id)\n  WHERE role = 'primary';\n\nCREATE TABLE IF NOT EXISTS session_members (\n  session_key TEXT NOT NULL,\n  identity_id TEXT NOT NULL,\n  added_by TEXT NOT NULL,\n  added_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, identity_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_members_identity\n  ON session_members(identity_id, session_key);\n\nCREATE TABLE IF NOT EXISTS session_suggestions (\n  id TEXT PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  author_id TEXT NOT NULL,\n  author_label TEXT,\n  text TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),\n  dispatch_token TEXT,\n  dispatch_started_at INTEGER,\n  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),\n  CHECK (\n    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)\n    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)\n  ),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created\n  ON session_suggestions(session_key, state, created_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created\n  ON session_suggestions(author_id, created_at, id);\n\nCREATE TABLE IF NOT EXISTS board_tabs (\n  session_key TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0),\n  chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  PRIMARY KEY (session_key, tab_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS board_widgets (\n  session_key TEXT NOT NULL,\n  name TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT,\n  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),\n  html BLOB,\n  descriptor_json TEXT,\n  sha256 TEXT NOT NULL,\n  view_generation TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 1),\n  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),\n  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),\n  position INTEGER NOT NULL CHECK (position >= 0),\n  manifest TEXT NOT NULL DEFAULT '{}',\n  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),\n  granted_sha TEXT,\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, name),\n  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,\n  CHECK (\n    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR\n    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR\n    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position\n  ON board_widgets(session_key, tab_id, position);\n\nCREATE TABLE IF NOT EXISTS session_progress_cards (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  markdown TEXT,\n  steps_json TEXT,\n  revision INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS heartbeat_outcomes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  run_session_key TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),\n  summary TEXT NOT NULL,\n  response_reason TEXT,\n  priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),\n  next_check TEXT,\n  task_names_json TEXT,\n  wake_source TEXT,\n  wake_reason TEXT,\n  occurred_at INTEGER NOT NULL,\n  context_run_id TEXT,\n  context_claimed_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS message_tool_run_outcomes (\n  id INTEGER PRIMARY KEY,\n  run_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),\n  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),\n  occurred_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred\n  ON message_tool_run_outcomes(occurred_at DESC, id DESC);\n\n-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.\n-- They intentionally have no session FK; bounded retention belongs to the operation owner.\nCREATE TABLE IF NOT EXISTS session_goal_operations (\n  session_key TEXT NOT NULL,\n  operation_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  request_fingerprint TEXT NOT NULL,\n  result_json TEXT NOT NULL,\n  expires_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, operation_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry\n  ON session_goal_operations(expires_at);\n\nCREATE TABLE IF NOT EXISTS transcript_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT,\n  created_at INTEGER NOT NULL,\n  event_zstd BLOB,\n  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),\n  navigation_json TEXT,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (\n    (event_json IS NOT NULL AND event_zstd IS NULL)\n    OR (\n      event_json IS NULL AND event_zstd IS NOT NULL\n      AND event_utf8_bytes IS NOT NULL\n      AND event_utf8_bytes BETWEEN 1 AND 4194304\n      AND length(event_zstd) BETWEEN 1 AND 4194304\n      AND navigation_json IS NOT NULL\n    )\n  ),\n  CHECK (\n    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(\n      octet_length(navigation_json) <= 16384\n      AND json_type(navigation_json, '$.version') = 'integer'\n      AND json_extract(navigation_json, '$.version') = 1\n      AND json_type(navigation_json, '$.report') = 'object'\n      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')\n      AND json_type(navigation_json, '$.navigation') = 'object'\n      AND json_type(navigation_json, '$.reset') = 'object'\n      AND json_type(navigation_json, '$.model') = 'object'\n      AND json_type(navigation_json, '$.modelBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'\n      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,\n      0) ELSE 0 END\n  )\n) STRICT;\n\n-- Canonical cold-tier owner for reclaimed transcript generations. The derived\n-- .deleted/.reset file may be recreated from this row after a crash.\nCREATE TABLE IF NOT EXISTS session_transcript_archives (\n  session_id TEXT NOT NULL,\n  generation TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),\n  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),\n  archive_blob BLOB NOT NULL,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  archive_name TEXT NOT NULL UNIQUE,\n  created_at INTEGER NOT NULL,\n  published_at INTEGER,\n  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),\n  last_publish_attempt_at INTEGER,\n  last_publish_error TEXT,\n  PRIMARY KEY (session_id, generation),\n  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending\n  ON session_transcript_archives(created_at, session_id, generation)\n  WHERE published_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention\n  ON session_transcript_archives(created_at, session_id, generation);\n\nCREATE TABLE IF NOT EXISTS session_transcript_cold_archives (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  archive_name TEXT NOT NULL UNIQUE,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  event_count INTEGER NOT NULL CHECK (event_count >= 1),\n  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),\n  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),\n  last_seq INTEGER NOT NULL,\n  archived_at INTEGER NOT NULL,\n  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),\n  archive_blob BLOB,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),\n  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS trajectory_runtime_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  run_id TEXT,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run\n  ON trajectory_runtime_events(session_id, run_id, seq)\n  WHERE run_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS acp_parent_stream_events (\n  session_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, run_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run\n  ON acp_parent_stream_events(run_id, seq);\n\nCREATE TABLE IF NOT EXISTS transcript_event_identities (\n  session_id TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_type TEXT,\n  parent_id TEXT,\n  message_idempotency_key TEXT,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, event_id),\n  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency\n  ON transcript_event_identities(session_id, message_idempotency_key)\n  WHERE message_idempotency_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence\n  ON transcript_event_identities(session_id, seq);\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent\n  ON transcript_event_identities(session_id, parent_id)\n  WHERE parent_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence\n  ON transcript_event_identities(session_id, event_type, seq DESC);\n\nCREATE TABLE IF NOT EXISTS context_engine_turn_outbox (\n  advancement_key TEXT NOT NULL PRIMARY KEY,\n  engine_id TEXT NOT NULL,\n  owner_plugin_id TEXT,\n  session_id TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  attempt_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine\n  ON context_engine_turn_outbox(engine_id, created_at);\n\nCREATE TABLE IF NOT EXISTS cache_entries (\n  scope TEXT NOT NULL,\n  key TEXT NOT NULL,\n  value_json TEXT,\n  blob BLOB,\n  expires_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_expiry\n  ON cache_entries(scope, expires_at, key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_updated\n  ON cache_entries(scope, updated_at DESC, key);\n\nCREATE TABLE IF NOT EXISTS auth_profile_store (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS auth_profile_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  state_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_meta (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_sources (\n  id INTEGER PRIMARY KEY,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  hash TEXT NOT NULL,\n  mtime REAL NOT NULL,\n  size INTEGER NOT NULL,\n  UNIQUE (path, source)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunks (\n  chunk_rowid INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  start_line INTEGER NOT NULL,\n  end_line INTEGER NOT NULL,\n  hash TEXT NOT NULL,\n  model TEXT NOT NULL,\n  text TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (\n  chunk_id TEXT PRIMARY KEY,\n  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),\n  triggers TEXT,\n  project_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (\n  chunk_id TEXT PRIMARY KEY,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),\n  observed_at INTEGER NOT NULL,\n  supersedes_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_entry_origins (\n  entry_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  observed_at INTEGER NOT NULL,\n  PRIMARY KEY (entry_key, agent_id, session_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_session_tombstones (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  reason TEXT NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_embedding_cache (\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  provider_key TEXT NOT NULL,\n  hash TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  dims INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (provider, model, provider_key, hash)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_state (\n  id INTEGER PRIMARY KEY CHECK (id = 1),\n  revision INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS standing_intents (\n  intent_key INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  description TEXT NOT NULL,\n  trigger_keywords TEXT NOT NULL,\n  trigger_embedding TEXT,\n  channel_scope TEXT,\n  sender_scope TEXT,\n  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),\n  expires_at INTEGER NOT NULL,\n  max_fires INTEGER NOT NULL CHECK (max_fires > 0),\n  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),\n  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),\n  last_fired_at INTEGER,\n  created_at INTEGER NOT NULL,\n  source_session_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle\n  ON standing_intents(status, expires_at, last_fired_at);\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_scope\n  ON standing_intents(status, channel_scope, sender_scope);\n\nCREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(\n  trigger_keywords,\n  content = 'standing_intents',\n  content_rowid = 'intent_key',\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert\nAFTER INSERT ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete\nAFTER DELETE ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update\nAFTER UPDATE OF trigger_keywords ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TABLE IF NOT EXISTS session_transcript_index_state (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  indexed_seq INTEGER NOT NULL,\n  leaf_event_id TEXT,\n  needs_rebuild INTEGER NOT NULL DEFAULT 0,\n  active_event_count INTEGER NOT NULL DEFAULT 0,\n  active_message_count INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_transcript_active_events (\n  session_id TEXT NOT NULL,\n  active_position INTEGER NOT NULL CHECK (active_position >= 0),\n  event_seq INTEGER NOT NULL,\n  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),\n  context_eligible INTEGER,\n  PRIMARY KEY (session_id, active_position),\n  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq\n  ON session_transcript_active_events(session_id, event_seq);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages\n  ON session_transcript_active_events(session_id, message_position)\n  WHERE message_position IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending\n  ON session_transcript_active_events(session_id)\n  WHERE context_eligible IS NULL;\n\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(\n  text,\n  session_id UNINDEXED,\n  message_id UNINDEXED,\n  role UNINDEXED,\n  timestamp UNINDEXED,\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TABLE IF NOT EXISTS session_transcript_fts_rows (\n  id INTEGER PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  message_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message\n  ON session_transcript_fts_rows(session_id, message_id);\n\nCREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete\nAFTER DELETE ON session_transcript_fts_rows\nBEGIN\n  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;\nEND;\n\nINSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert\nAFTER INSERT ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update\nAFTER UPDATE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete\nAFTER DELETE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert\nAFTER INSERT ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update\nAFTER UPDATE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete\nAFTER DELETE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at\n  ON memory_embedding_cache(updated_at);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_sources_source\n  ON memory_index_sources(source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source\n  ON memory_index_chunks(path, source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path\n  ON memory_index_chunks(path);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source\n  ON memory_index_chunks(source);\n\n-- Accepted input stays outside the active transcript until its exact turn owns execution.\nCREATE TABLE IF NOT EXISTS session_pending_inputs (\n  seq INTEGER PRIMARY KEY AUTOINCREMENT,\n  input_id TEXT NOT NULL UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  message_json TEXT NOT NULL,\n  lifecycle_generation TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),\n  accepted_at INTEGER NOT NULL,\n  consumed_event_id TEXT,\n  UNIQUE (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session\n  ON session_pending_inputs(session_key, session_id, seq DESC);\n\n-- Processing completion is separate from input consumption; neither schedules replay.\nCREATE TABLE IF NOT EXISTS session_input_completions (\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  outcome_json TEXT NOT NULL,\n  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),\n  completed_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n";
//#endregion
//#region src/state/testclaw-agent-db-additive-columns.ts
const SESSION_OWNER_COLUMN_DEFINITIONS = [
	{
		columnName: "owner_actor_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_actor_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_at",
		dataType: "INTEGER",
		tableName: "session_nodes"
	}
];
const LEGACY_ACP_MIGRATION_COLUMN_DEFINITION = {
	columnName: "legacy_acp_migration_json",
	dataType: "TEXT",
	tableName: "session_nodes"
};
const CANONICAL_READY_COLUMN_DEFINITION = {
	columnName: "canonical_ready",
	dataType: "TEXT",
	tableName: "session_key_contract"
};
const FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	...SESSION_OWNER_COLUMN_DEFINITIONS,
	LEGACY_ACP_MIGRATION_COLUMN_DEFINITION,
	CANONICAL_READY_COLUMN_DEFINITION
];
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
//#endregion
//#region src/state/testclaw-agent-board-schema.ts
const TESTCLAW_AGENT_BOARD_SCHEMA_SQL = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_SQL, "board_tabs", {
	endMarker: "CREATE TABLE IF NOT EXISTS session_progress_cards (",
	includeEndMarker: false,
	errorMessage: "Assistant agent board schema markers are missing from the canonical schema."
});
const TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL = TESTCLAW_AGENT_SCHEMA_SQL.replace(TESTCLAW_AGENT_BOARD_SCHEMA_SQL, "");
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, "session_progress_cards", {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "Assistant agent progress-card schema markers are missing."
});
TESTCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
[...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`)];
resolveGlobalSingleton(Symbol.for("testclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
//#endregion
//#region src/state/testclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearAssistantAgentDatabaseValidationCache());
resolveGlobalSingleton(Symbol.for("testclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function invalidateAssistantAgentDatabaseValidation(pathname, identity = validatedPaths.get(path.resolve(pathname))?.validation?.identity) {
	const resolved = path.resolve(pathname);
	const paths = /* @__PURE__ */ new Set([resolved]);
	if (identity) {
		for (const [candidate, entry] of validatedPaths) if (entry.validation?.identity === identity) paths.add(candidate);
	}
	for (const candidate of paths) {
		const entry = validatedPaths.get(candidate);
		const validation = entry?.validation;
		if (validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
		validatedPaths.set(candidate, {
			agentId: entry?.agentId,
			validation,
			integrityVerified: false,
			revoked: true
		});
	}
}
function clearAssistantAgentDatabaseValidationCache(rootPath) {
	for (const pathname of validatedPaths.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) {
		invalidateAssistantAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
//#region src/state/testclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "AssistantQuarantineReadCleanupError";
const AssistantQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("testclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "Assistant quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/testclaw-quarantine-store.ts
const TESTCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const TESTCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
function createAssistantDatabaseVerificationError(kind, pathname, storedError) {
	const error = /* @__PURE__ */ new Error(`Assistant ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run testclaw doctor --fix to clear the quarantine. See ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteIntegrityError";
	return error;
}
function resolveQuarantineStorePath(env) {
	return path.join(resolveAssistantStateSqliteDir(env), "testclaw-quarantine.sqlite");
}
function readQuarantineSchemaVersion(database, storePath) {
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`Assistant quarantine store ${storePath} has an invalid schema version.`);
	return userVersion;
}
/** Read one authoritative quarantine decision without creating the store. */
function readAssistantDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	if (!existsSync(storePath)) return;
	const database = openNodeSqliteDatabase(storePath);
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		throw new AssistantQuarantineReadCleanupError("error" in outcome ? [outcome.error, closeError] : [closeError], "value" in outcome ? outcome.value : void 0);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Reject a known state quarantine while retaining best-effort metadata admission. */
function assertAssistantStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure) {
	let quarantineFailure;
	try {
		quarantineFailure = readAssistantDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof AssistantQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof AssistantQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) throw quarantineFailure;
}
function readQuarantineDecision(database, pathname, storePath) {
	database.exec(`PRAGMA busy_timeout = ${TESTCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === 0) return;
	if (userVersion > TESTCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`Assistant quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || row.verified_generation !== void 0 && row.verified_generation !== null && typeof row.verified_generation !== "string") throw new Error(`Assistant quarantine store ${storePath} contains an invalid row.`);
	if (typeof row.verified_generation === "string") {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(row.verified_generation);
		} catch {
			throw new Error(`Assistant quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readStableSqliteFileGeneration(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readAssistantDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readAssistantDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof AssistantQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = createAssistantDatabaseVerificationError(kind, pathname, quarantine.reason);
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
//#endregion
//#region src/state/testclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const retain = (database, readOnly = false) => {
		const scope = getAssistantDatabaseMaintenanceScope();
		scope?.assertAdmission();
		operations.assertOpen(database.path);
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Assistant state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("Assistant state database native owner is retiring");
		if (!readOnly) observeAssistantDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isAssistantDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			retainFailedClose: () => operations.retainFailed(database)
		});
		scope?.own(reference, "shared-references", () => reference.release());
		return reference;
	};
	const findReadDatabase = (pathname) => {
		getAssistantDatabaseMaintenanceScope()?.assertAdmission();
		operations.assertOpen(pathname);
		const database = state.cachedDatabases.get(path.resolve(pathname));
		return database?.db.isOpen ? database : void 0;
	};
	const retainReadReference = (database) => {
		const reference = retain(database, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeAssistantDatabaseMaintenanceResource(database.db);
			},
			release() {
				reference.release();
				operations.touch(database);
			}
		};
	};
	return {
		retain: (database) => retain(database),
		retainForIndependentRead(pathname) {
			const database = findReadDatabase(pathname);
			return database ? retainReadReference(database) : void 0;
		},
		borrowForRead(pathname) {
			const database = findReadDatabase(pathname);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`Assistant state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	return { release() {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0 || !owner.retirement) {
			released = true;
			return;
		}
		owner.retiring = true;
		try {
			owner.retirement.retire();
		} catch (error) {
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		released = true;
	} };
}
//#endregion
//#region src/state/testclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && (database.db.isTransaction || borrowers.get(database.db)?.references.size || idleReferences.get(database.db)?.size)) {
					touch(database);
					return;
				}
				retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("Assistant state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/state/testclaw-state-db-handle.ts
const handleLeases = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseHandleLeases"), () => /* @__PURE__ */ new WeakMap());
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Only native open failure with a released lease is an ordinary read failure. */
function openTrackedStateDatabaseResult(pathname, options) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		handleLeases.set(database, lease);
		return {
			status: "available",
			database
		};
	} catch (error) {
		lease.release();
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (!database.isOpen) {
			handleLeases.get(database)?.release();
			handleLeases.delete(database);
		}
	}
}
var AssistantStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `Assistant state database schema migration required (${kind}) at ${pathname}; run testclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "AssistantStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeAssistantStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new AssistantStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
//#region src/state/testclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQueries = /* @__PURE__ */ new WeakMap();
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db) {
	const published = readSqliteUserVersion(db);
	if (!tableExists(db, "config_machine_state")) return published;
	let query = contentVersionQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY));
		contentVersionQueries.set(db, query);
	}
	const row = query().rows[0];
	if (!row) return published;
	const contentVersion = JSON.parse(row.value_json);
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new Error(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return Math.max(published, contentVersion);
}
/** Cold migration planning checks physical content; admission still uses the recorded version. */
function readStateSchemaMigrationVersion(db) {
	const version = readStateSchemaContentVersion(db);
	if (version !== 16) return version;
	const reviewWorkspace = tableHasColumn(db, "skill_workshop_collection_reviews", "workspace_dir");
	const proposalWorkspace = tableHasColumn(db, "skill_workshop_proposals", "workspace_dir");
	const releasedClaim = tableHasColumn(db, "skill_workshop_proposals", "claim_released_time");
	if (!reviewWorkspace && !proposalWorkspace && !releasedClaim) return version;
	const missingAttribution = reviewWorkspace && !proposalWorkspace;
	const issues = collectSqliteSchemaIssues(db, `
    CREATE TABLE skill_workshop_collection_reviews (
      review_id TEXT NOT NULL PRIMARY KEY,
      ${reviewWorkspace ? "workspace_dir" : "owner_agent_id"} TEXT NOT NULL,
      backup_id TEXT NOT NULL,
      create_time INTEGER NOT NULL,
      kept_names_json TEXT NOT NULL,
      written_names_json TEXT NOT NULL,
      dropped_json TEXT NOT NULL
    ) STRICT;
    CREATE TABLE skill_workshop_proposals (
      proposal_id TEXT NOT NULL PRIMARY KEY,
      record_json TEXT NOT NULL,
      owner_agent_id TEXT,
      ${proposalWorkspace ? "workspace_dir TEXT NOT NULL," : ""}
      kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),
      status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      draft_hash TEXT NOT NULL,
      origin_agent_id TEXT,
      origin_session_key TEXT,
      origin_run_id TEXT,
      origin_message_id TEXT,
      applied_at TEXT,
      rejected_at TEXT,
      quarantined_at TEXT,
      stale_at TEXT,
      status_reason TEXT
      ${releasedClaim ? ", claim_released_time INTEGER" : ""}
    ) STRICT;
  `, {
		allowedMissingTables: ["skill_workshop_collection_reviews"],
		allowedColumnDefinitions: {
			"skill_workshop_collection_reviews.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"],
			"skill_workshop_proposals.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"]
		}
	});
	if (!missingAttribution && issues.length === 0) return 15;
	throw new Error("Unrecognized Skill Workshop ownership schema; cannot apply the schema 16 migration.");
}
function assertSupportedStateSchemaVersion(db, pathname) {
	try {
		const userVersion = readSqliteUserVersion(db);
		const contentVersion = userVersion > 18 ? userVersion : readStateSchemaContentVersion(db);
		if (contentVersion > 18) throw createNewerSqliteSchemaVersionError("Assistant state database", pathname, contentVersion, 18);
		return userVersion;
	} catch (error) {
		throw normalizeAssistantStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/state/testclaw-state-db-runtime-failure.ts
/** Runtime validation uses the cache's existing handles, version counters, and terminal latch. */
function createAssistantStateDatabaseRuntimeFailureOwner(owner) {
	const readDataVersion = (database) => {
		let statement = owner.statements.get(database);
		if (!statement) {
			statement = database.db.prepare("PRAGMA data_version");
			owner.statements.set(database, statement);
		}
		const row = statement.get();
		if (typeof row?.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
		return row.data_version;
	};
	return {
		closeTerminalFailure(pathname, error) {
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		recordPublishedVersion: (database) => {
			owner.dataVersions.set(database.db, readDataVersion(database));
		},
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const latched = owner.latch.get(resolvedPath);
			if (latched) return latched;
			const cached = owner.cachedDatabases.get(resolvedPath);
			if (!cached?.db.isOpen) return;
			try {
				const dataVersion = readDataVersion(cached);
				if (owner.dataVersions.get(cached.db) === dataVersion) return;
				assertSupportedStateSchemaVersion(cached.db, resolvedPath);
				owner.dataVersions.set(cached.db, dataVersion);
				return;
			} catch (error) {
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(cached);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(resolvedPath, failure);
				return failure;
			}
		}
	};
}
//#endregion
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
//#endregion
//#region src/infra/windows-private-directory.ts
const require = createRequire(import.meta.url);
let creators;
function loadPrivatePathCreators() {
	const koffi = require("koffi");
	const kernel32 = koffi.load("kernel32.dll");
	const advapi32 = koffi.load("advapi32.dll");
	const attributes = koffi.struct({
		length: "uint32_t",
		descriptor: "void *",
		inheritHandle: "int32_t"
	});
	const getLastError = kernel32.func("uint32_t __stdcall GetLastError()");
	const getCurrentProcess = kernel32.func("void * __stdcall GetCurrentProcess()");
	const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
	const localFree = kernel32.func("void * __stdcall LocalFree(void *memory)");
	const openToken = advapi32.func("int32_t __stdcall OpenProcessToken(void *process, uint32_t access, _Out_ void **token)");
	const getTokenInformation = advapi32.func("int32_t __stdcall GetTokenInformation(void *token, int32_t informationClass, _Out_ void *information, uint32_t length, _Out_ uint32_t *required)");
	const convertSid = advapi32.func("int32_t __stdcall ConvertSidToStringSidW(void *sid, _Out_ void **text)");
	const convertDescriptor = advapi32.func("int32_t __stdcall ConvertStringSecurityDescriptorToSecurityDescriptorW(str16 text, uint32_t revision, _Out_ void **descriptor, void *size)");
	const createDirectory = kernel32.func("__stdcall", "CreateDirectoryW", "int32_t", ["str16", koffi.pointer(attributes)]);
	const createFile = kernel32.func("__stdcall", "CreateFileW", "void *", [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(attributes),
		"uint32_t",
		"uint32_t",
		"void *"
	]);
	const failure = (operation) => {
		const errorCode = getLastError();
		return Object.assign(/* @__PURE__ */ new Error(`${operation} failed (Win32 error ${errorCode})`), {
			code: errorCode === 80 || errorCode === 183 ? "EEXIST" : "EIO",
			errno: errorCode
		});
	};
	const withPrivateAttributes = (inherit, operation) => {
		const token = [null];
		const sidText = [null];
		const descriptor = [null];
		if (!openToken(getCurrentProcess(), 8, token)) throw failure("OpenProcessToken");
		try {
			const required = [0];
			getTokenInformation(token[0], 1, null, 0, required);
			if (getLastError() !== 122 || required[0] === 0) throw failure("GetTokenInformation(size)");
			const user = Buffer.alloc(required[0]);
			if (!getTokenInformation(token[0], 1, user, user.length, required)) throw failure("GetTokenInformation");
			if (!convertSid(koffi.decode(user, "void *"), sidText)) throw failure("ConvertSidToStringSidW");
			const sid = koffi.decode(sidText[0], "char16_t", -1);
			const flags = inherit ? "OICI" : "";
			const sddl = `O:${sid}D:P(A;${flags};FA;;;${sid})(A;${flags};FA;;;SY)(A;${flags};FA;;;BA)`;
			if (!convertDescriptor(sddl, 1, descriptor, null)) throw failure("ConvertStringSecurityDescriptorToSecurityDescriptorW");
			return operation({
				length: koffi.sizeof(attributes),
				descriptor: descriptor[0],
				inheritHandle: 0
			});
		} finally {
			if (descriptor[0] !== null) localFree(descriptor[0]);
			if (sidText[0] !== null) localFree(sidText[0]);
			closeHandle(token[0]);
		}
	};
	return {
		directory: (directoryPath) => withPrivateAttributes(true, (security) => {
			if (!createDirectory(path.toNamespacedPath(path.resolve(directoryPath)), security)) throw failure(`CreateDirectoryW(${directoryPath})`);
		}),
		file: (filePath) => withPrivateAttributes(false, (security) => {
			const resolved = path.toNamespacedPath(path.resolve(filePath));
			const handle = createFile(resolved, 3221225472, 3, security, 1, 128, null);
			if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
			try {
				return fsSync.openSync(resolved, fsSync.constants.O_RDWR | (fsSync.constants.O_NOFOLLOW ?? 0));
			} finally {
				closeHandle(handle);
			}
		})
	};
}
function createPrivateWindowsDirectory(directoryPath) {
	creators ??= loadPrivatePathCreators();
	creators.directory(directoryPath);
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredAssistantTmpDir({
		preferredDir: path.join(cacheRoot, "testclaw"),
		tmpdir: () => cacheRoot
	});
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") return fsSync.mkdtempSync(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
resolveGlobalSet(Symbol.for("testclaw.signalExitBarriers"), "close-and-restart");
resolveGlobalSet(Symbol.for("testclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("testclaw.signalExitFinalizers"), "close-and-restart");
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
}
//#endregion
//#region src/infra/sqlite-staging-token.ts
const SQLITE_STAGING_TOKEN_FILES = [
	"owner.sqlite",
	"owner.sqlite-journal",
	"owner.sqlite-wal",
	"owner.sqlite-shm"
];
var SqliteStagingRetiredError = class extends Error {
	constructor() {
		super("SQLite snapshot parent retired; aborting snapshot allocation");
	}
};
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fsSync.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fsSync.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	const existingIdentity = existing ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(existing ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		const currentToken = readIdentity(location, "file");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino || tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isOpen) return acquireSqliteStagingToken(directory, "reclaim");
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		assertIdentity();
		const version = readVersion();
		if (version !== (retired ? 1 : 0)) {
			retired = version === 1;
			throw new SqliteStagingRetiredError();
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "testclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^testclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
const pendingTokenReleases = /* @__PURE__ */ new Map();
function releaseTokens(directory, tokens) {
	const pending = pendingTokenReleases.get(directory) ?? /* @__PURE__ */ new Set();
	const failures = [];
	for (const token of tokens) try {
		token();
		pending.delete(token);
	} catch (error) {
		pending.add(token);
		failures.push(error);
	}
	if (pending.size) pendingTokenReleases.set(directory, pending);
	else pendingTokenReleases.delete(directory);
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
/** A failed native close retains its actual handle until retry, even after commit or unlink. */
function drainPendingSqliteSnapshotTokens(directory) {
	releaseTokens(directory, pendingTokenReleases.get(directory) ?? []);
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	drainPendingSqliteSnapshotTokens(directory);
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(directory, tokens.filter((token) => token !== options.token));
	if (!fsSync.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true, parentFenced = false) {
		const stat = fsSync.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) {
			const unfinishedAllocation = parentFenced && tokenMarker.test(path.basename(current)) && fsSync.readdirSync(current).length === 0;
			tokens.push(current === directory && options.token ? options.token.beginRetirement() : unfinishedAllocation ? acquireSqliteStagingToken(current, "reclaim", { allowMissing: true }) : acquireSqliteSnapshotToken(current, "reclaim"));
		}
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fsSync.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fsSync.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"testclaw",
					"testclaw-state",
					"testclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "testclaw")) throw new Error("Unrecognized snapshot directory");
				const allocationParent = layout === "testclaw" ? path.dirname(current) : current;
				const child = inspect(location, cutoff, childLayout, lock, nested && (layout === "" || layout === "testclaw") && isSqliteSnapshotStagingName(path.basename(allocationParent)));
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "testclaw-state/state" ? /^testclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
const pendingTempDirectoryCleanup = /* @__PURE__ */ new Map();
let cleanupExitHandlerInstalled = false;
const activeSnapshotWork = /* @__PURE__ */ new Map();
let pendingSignalCleanup;
function snapshotDirectory(directory) {
	let owner = pendingTempDirectoryCleanup.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		pendingTempDirectoryCleanup.set(directory, owner);
	}
	return owner;
}
function cleanupSnapshotOperations() {
	pendingSignalCleanup ??= (async () => {
		const directories = pendingTempDirectoryCleanup.keys();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const directory = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		pendingSignalCleanup = void 0;
	});
	return pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSignalExitFinalizer(cleanupSnapshotOperations);
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	if (!cleanupExitHandlerInstalled) {
		cleanupExitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of pendingTempDirectoryCleanup.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupSnapshotOperations);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory) {
	drainPendingSqliteSnapshotTokens(directory);
	const owner = pendingTempDirectoryCleanup.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseAsync) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fsSync.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) fsSync.rmSync(file, tempDirectoryRemovalOptions);
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	try {
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				const owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fsSync.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	try {
		const owner = pendingTempDirectoryCleanup.get(tempDir);
		assertSnapshotReadersRetired(owner);
		if (owner?.releaseAsync) {
			owner.retirementStarted = true;
			await (owner.retiring ??= owner.releaseAsync().then(() => {
				owner.releaseAsync = void 0;
				owner.retired = true;
			}).finally(() => {
				owner.retiring = void 0;
			}));
		}
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			for (const file of retirement?.payload ?? []) await retainSnapshotWork(fsSync.promises.rm(file, tempDirectoryRemovalOptions));
			if (retirement) {
				retirement.retire();
				const current = snapshotDirectory(tempDir);
				current.release = void 0;
				current.retired = true;
			}
			await retainSnapshotWork(fsSync.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let reported = false;
	const reportFailure = (error) => {
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) active = false;
		else if (requireCleanup) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`);
		return removed;
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending) return requireCleanup ? complete(false) : false;
			if (!active) return true;
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (pending) return pending;
			if (!active) return Promise.resolve(true);
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function snapshotRetryDelayMs(attempt) {
	if (attempt + 1 >= 10) return 0;
	return Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
}
function waitForSnapshotRetrySync(attempt) {
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
function stagingParent(root) {
	const parent = path.basename(root) === "testclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
/** A private reader protects its bytes independently of the staging child. */
function acquireSqliteSnapshotReadToken(directory) {
	return acquireSqliteSnapshotToken(directory, "read");
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false) {
	markSqliteInspectionOperation(cause, "snapshot");
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		if (allocation || ["ENOSPC", "EDQUOT"].includes(code ?? "") || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			const message = `${cause instanceof Error ? cause.message : String(cause)}${typeof errcode === "number" ? ` (SQLite errcode=${errcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}: free disk space/quota or set XDG_CACHE_HOME to a writable filesystem`;
			return new Error(message, { cause });
		}
		error = error.cause;
	}
	return cause;
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const parentDirectory = stagingParent(root);
	const parent = parentDirectory ? acquireSqliteSnapshotToken(parentDirectory, "read") : void 0;
	let directory;
	try {
		directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `testclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	} finally {
		parent?.();
	}
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
	const copy = fsSync.openSync(destination, "r");
	try {
		const stat = fsSync.fstatSync(copy);
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
		fsSync.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function copySqliteWalPrefixSync(source, destination, copyMain, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	copyMain();
	const walBytes = fsSync.fstatSync(source).size;
	if (!Number.isSafeInteger(walBytes) || walBytes < generation.length) return false;
	const target = fsSync.openSync(destination, "wx", 384);
	try {
		const buffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, walBytes));
		for (let position = 0; position < walBytes;) {
			const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
			if (readFileWindowFullySync(source, window, position) !== window.length) return false;
			if (position === 0 && !window.subarray(0, generation.length).equals(generation)) return false;
			for (let offset = 0; offset < window.length;) {
				const written = fsSync.writeSync(target, window, offset, window.length - offset, position + offset);
				if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
				offset += written;
			}
			position += window.length;
		}
		fsSync.fsyncSync(target);
	} finally {
		fsSync.closeSync(target);
	}
	return verifyMainCopy() && matchesCapturedWalPrefix(source, destination, walBytes) && readWalGeneration(source)?.equals(generation) === true;
}
//#endregion
//#region src/infra/sqlite-source-handle.ts
function withSqliteSourceHandle(pathname, operation) {
	return runWithSqliteCoordinator(acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}), "SQLite source read", operation);
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const SQLITE_HEADER_BYTES = 20;
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
		return fsSync.statSync(pathname, { bigint: true });
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
		descriptor = fsSync.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fsSync.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fsSync.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fsSync.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fsSync.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fsSync.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fsSync.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fsSync.openSync(targetPath, "wx", 384);
		copyFileDescriptorSync(source.descriptor, target);
		fsSync.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fsSync.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fsSync.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath) {
	const source = openPinnedFile(sourcePath);
	let copy;
	try {
		copy = fsSync.openSync(copyPath, "r");
		if (!fsSync.fstatSync(copy).isFile()) return false;
		const equal = sameFileContentsSync(source.descriptor, copy);
		assertPinnedIdentityUnchanged(source);
		return equal;
	} finally {
		try {
			if (copy !== void 0) fsSync.closeSync(copy);
		} finally {
			fsSync.closeSync(source.descriptor);
		}
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fsSync.rmSync(targetPath, { force: true });
	fsSync.renameSync(sourcePath, targetPath);
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fsSync.openSync(journalPath, "r");
	try {
		const size = fsSync.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fsSync.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fsSync.closeSync(descriptor);
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
	fsSync.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fsSync.openSync(snapshotPath, "r+");
	try {
		fsSync.fsyncSync(descriptor);
	} finally {
		fsSync.closeSync(descriptor);
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
		if (fsSync.existsSync(staged)) fsSync.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot()) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fsSync.chmodSync(tempDir, 448);
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
				fsSync.closeSync(wal.descriptor);
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
function prepareReadOnlySourceSyncInProcess(pathname, stagingRoot) {
	const canonicalPath = fsSync.realpathSync.native(pathname);
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
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) {
	return withSqliteSourceHandle(pathname, () => prepareReadOnlySourceSyncInProcess(pathname, stagingRoot));
}
resolveGlobalSingleton(Symbol.for("testclaw.sqliteSnapshotFlights"), () => /* @__PURE__ */ new Map());
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("testclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
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
//#endregion
//#region src/state/testclaw-state-db-snapshot-owner.ts
function createAssistantStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "testclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("Assistant state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const testClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("testclaw.stateSnapshotOwners"), createAssistantStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/testclaw-state-db-cache.ts
const stateDatabaseLifecycle = resolveGlobalSingleton(Symbol.for("testclaw.stateDatabaseLifecycle"), () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	cachedDataVersionStatements: /* @__PURE__ */ new WeakMap(),
	cachedDataVersions: /* @__PURE__ */ new WeakMap(),
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => runtimeFailures.closeTerminalFailure(pathname, error) }),
	asyncResources: createAssistantStateDatabaseAsyncLifecycle()
}), () => closeAssistantStateDatabaseAsync());
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, cachedDataVersionStatements, cachedDataVersions, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainAssistantStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireAssistantStateDatabaseHandle);
function notifyAssistantStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyAssistantStateDatabaseClosed(database) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
}
function requireAssistantStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const runtimeFailures = createAssistantStateDatabaseRuntimeFailureOwner({
	cachedDatabases,
	statements: cachedDataVersionStatements,
	dataVersions: cachedDataVersions,
	latch: terminalOpenLatch,
	evict: evictCachedAssistantStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyAssistantStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyAssistantStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerAssistantStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireAssistantStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeAssistantStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getAssistantDatabaseMaintenanceScope()?.own(database.db, "shared-handles", () => {
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) retireAssistantStateDatabaseHandle(database, false);
	});
}
function closeUnpublishedAssistantStateDatabaseHandle(database) {
	const errors = closeAssistantStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainAssistantStateDatabase, borrowForRead: borrowAssistantStateDatabaseForAsyncRead, retainForIndependentRead: retainAssistantStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname) {
		assertAssistantStateDatabaseOpenAllowed(pathname);
		assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireAssistantStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeAssistantStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeAssistantStateDatabaseHandle(database, options), `Assistant state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	const errors = [];
	testClawStateSnapshotOwners.release(database.db);
	try {
		database.walMaintenance?.close(options);
	} catch (error) {
		errors.push(error);
	}
	try {
		clearNodeSqliteKyselyCacheForDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeTrackedStateDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	let cleanupPending = false;
	if (!database.db.isOpen) try {
		database.afterClose?.();
	} catch (error) {
		errors.push(error);
		cleanupPending = true;
	}
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyAssistantStateDatabaseClosed(database);
	closeAssistantStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictAssistantStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedAssistantStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishAssistantStateDatabase(database) {
	const { db, path: pathname } = database;
	const identity = asyncResources.publish(pathname);
	databaseIdentities.set(db, identity);
	runtimeFailures.recordPublishedVersion(database);
	cachedDatabases.set(pathname, database);
	touchStateDatabase(database);
	testClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyAssistantStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedAssistantStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedAssistantStateDatabase(pathname) {
	getAssistantDatabaseMaintenanceScope()?.assertAdmission();
	assertExistingAssistantStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	const runtimeFailure = runtimeFailures.get(pathname);
	if (runtimeFailure) throw runtimeFailure;
	const database = cachedDatabases.get(path.resolve(pathname));
	if (database && borrowers.get(database.db)?.retiring) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
	if (database) touchStateDatabase(database);
	return database;
}
function getAssistantStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedAssistantStateDatabase(pathname);
	observeAssistantDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedAssistantStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeAssistantStateDatabaseHandle(database);
	notifyAssistantStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale Assistant state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordAssistantStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearAssistantStateDatabaseOpenFailure(pathname) {
	const resolvedPath = path.resolve(pathname);
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyAssistantStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getAssistantStateDatabaseTerminalFailureAsync(context) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (_path, generation) => {
		const { inspectAssistantStateDatabase } = await import("./testclaw-state-worker-store-pA5vzL_U.mjs");
		const matches = await inspectAssistantStateDatabase(context, {
			type: "database.generationMatches",
			input: { generation }
		});
		if (matches === void 0) throw new Error("Recorded shared-state database generation is unavailable");
		return matches;
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertAssistantStateDatabaseOpenAllowed(pathname) {
	const identity = asyncResources.identity(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	const resolvedPath = path.resolve(pathname);
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`Assistant state database native borrower cleanup is pending: ${pathname}`);
}
function recordAssistantStateDatabaseLifecycleOpenError(pathname, error) {
	notifyAssistantStateDatabaseLifecycle({
		kind: "open-error",
		path: path.resolve(pathname),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertAssistantStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertAssistantStateDatabaseOpenAllowed(pathname);
	assertAssistantStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure);
}
/** Explicit retirement can checkpoint WAL and must join the lifecycle writer gate. */
function retireAssistantStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	const { busyTimeoutMs = TESTCLAW_SQLITE_BUSY_TIMEOUT_MS, ...closeOptions } = options ?? {};
	const coordinator = borrowedOwner?.closeCoordinator ?? acquireStateDatabaseCoordinator({
		databasePath: database.path,
		busyTimeoutMs,
		keepAlive: false
	});
	if (borrowedOwner) borrowedOwner.closeCoordinator = coordinator;
	try {
		runWithSqliteCoordinator(coordinator, "state database retirement", () => {
			const wasCached = cachedDatabases.get(database.path)?.db === database.db;
			if (retireAdmission) asyncResources.invalidate(database.path);
			const errors = closeAssistantStateDatabaseHandle(database, closeOptions);
			if (wasCached && retireAdmission) try {
				notifyAssistantStateDatabaseClosed(database);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, `Assistant state database cleanup failed for ${database.path}.`);
		});
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	} finally {
		if (borrowedOwner && coordinator.closed) borrowedOwner.closeCoordinator = void 0;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireAssistantStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireAssistantStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "Assistant state database cleanup failed.");
	return found;
}
/** Close one cached shared state database handle by exact pathname. */
function closeAssistantStateDatabaseByPath(pathname, options) {
	return retireAssistantStateDatabaseHandles(path.resolve(pathname), options, asyncResources.identity(pathname));
}
/** Close all cached shared state database handles. */
function closeAssistantStateDatabase(options) {
	retireAssistantStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
function registerAssistantStateDatabaseAsyncResource(resource) {
	return asyncResources.register(resource);
}
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureAssistantStateDatabaseReadAdmission = asyncResources.capture;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishAssistantStateDatabaseWorkerAdmission(admission) {
	admission.assertCurrent();
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeAssistantStateDatabaseAsync(options) {
	await asyncResources.close(void 0, () => retireAssistantStateDatabaseHandles(void 0, options));
}
/** Test whether a cached shared state database handle is still open, optionally at one path. */
function isAssistantStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
function closeAssistantStateDatabaseForTest() {
	closeAssistantStateDatabase();
	terminalOpenLatch.clearAll();
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const testClawStateDatabaseCache = {
	assertAssistantStateDatabaseFreshOpenAllowedAtPath,
	assertAssistantStateDatabaseOpenAllowed,
	clearAssistantStateDatabaseOpenFailure,
	closeAssistantStateDatabase,
	closeAssistantStateDatabaseByPath,
	closeAssistantStateDatabaseForTest,
	closeAssistantStateDatabaseHandle,
	closeUnpublishedAssistantStateDatabaseHandle,
	closeStaleCachedAssistantStateDatabase,
	evictCachedAssistantStateDatabase,
	evictAssistantStateDatabaseAfterCorruption,
	getCachedAssistantStateDatabase,
	getAssistantStateDatabaseRuntimeFailure: runtimeFailures.get,
	getAssistantStateDatabaseIfOpenAtPath,
	getKnownAssistantStateDatabaseIdentity: asyncResources.knownIdentity,
	isAssistantStateDatabaseOpen,
	publishAssistantStateDatabase,
	recordAssistantStateDatabaseOpenFailure,
	recordAssistantStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
//#endregion
export { createSqliteWalReclamationResult as $, sha256Hex as $t, tablePrimaryKeyColumns as A, throwSqliteLifecycleErrors as At, readSqliteSchemaCookie as B, runWithSqliteBusyTimeout as Bt, normalizeAssistantStateSchemaReadError as C, withStateSchemaFence as Ct, ensureColumn as D, createSqliteLifecycleAggregateError as Dt, DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME as E, SqliteCoordinatorError as Et, collectSqliteNamedIndexContract as F, runSqliteDeferredTransactionSync as Ft, executeSqliteQuerySync as G, withSqliteNativeOpen as Gt, quoteSqliteIdentifier$1 as H, SQLITE_IDLE_HANDLE_TTL_MS as Ht, collectSqliteSchemaIssues as I, runSqliteImmediateTransactionSync as It, iterateSqliteQuerySync as J, resolveExistingSqliteFileUri as Jt, executeSqliteQueryTakeFirstSync as K, applyPrivateModeSync as Kt, createSqliteTableContractReader as L, runSqlitePinnedReadSnapshotSync as Lt, migrateSqliteSchemaToStrictInTransaction as M, assertTransactionUsable as Mt, assertSqliteSchemaContains as N, logSlowSqliteCoordinatorWait as Nt, tableExists as O, ensurePrivateSqliteCoordinatorDirectory as Ot, assertSqliteSchemaTablesPresent as P, retainSqliteWriteAdmissionService as Pt, runInSqliteMaintenanceContext as Q, sha256FileSync$1 as Qt, getCanonicalSqliteNamedIndexContracts as R, normalizeSqliteNonNegativeInteger as Rt, AssistantStateDatabaseSchemaMigrationRequiredError as S, withStateDatabaseCoordinatorRuntimeDirectory as St, openTrackedStateDatabaseResult as T, StateSchemaMutationConflictError as Tt, splitSqlList as U, isSqliteLockError as Ut, extractSqliteTableSchema as V, setSqliteBusyTimeout as Vt, compileSqliteQueryBindings as W, markSqliteNativeOpenFailure as Wt, configureSqlitePreSchemaPragmas as X, isGatewayExternallySupervised as Xt, configureSqliteConnectionPragmas as Y, ensureSqliteLibrarySelected as Yt, registerSqliteCacheExitClose as Z, withSqlitePostCommitPublications as Zt, recordExistingAssistantStateSchemaDatabase as _, hasStateDatabaseSourceExclusion as _t, registerAssistantStateDatabaseAsyncResource as a, isTerminalSqliteIntegrityError as at, readStateSchemaContentVersion as b, tryCreateGatewaySchemaFenceDelegate as bt, testClawStateDatabaseCache as c, StateDatabaseReadAdmissionInvalidatedError as ct, createSqliteSnapshotStagingDirectorySync as d, observeAssistantDatabaseMaintenanceResource as dt, sha256HexPrefixCore as en, coerceRequiredSqliteNumber as et, SqliteSnapshotCleanupError as f, assertExistingDatabaseIdentity as ft, isExistingAssistantStateSchema as g, captureStateDatabaseCoordinatorRuntime as gt, getExistingAssistantStateSchemaPath as h, acquireStateDatabaseCoordinator as ht, recordAssistantStateDatabaseOpenFailure as i, assertSqliteTableIntegrity as it, migrateSqliteSchemaToStrict as j, tryAcquireExclusiveSqliteCoordinator as jt, tableHasColumn as k, runWithSqliteCoordinator as kt, prepareSqliteReadOnlyLocationSyncInProcess as l, getAssistantDatabaseMaintenanceScope as lt, removeTempDirectory as m, readDatabasePathIdentitySync as mt, getAssistantStateDatabaseTerminalFailureAsync as n, decodeMountInfoPath as nt, registerAssistantStateDatabaseLifecycleListener as o, runSqliteIntegrityOperationSync as ot, adoptPreparedLocation as p, readDatabasePathIdentity as pt, getNodeSqliteKysely as q, openNodeSqliteDatabase as qt, publishAssistantStateDatabaseWorkerAdmission as r, assertSqliteIntegrity as rt, retainAssistantStateDatabaseForIdle as s, sqliteIntegrityCheckSteps as st, captureAssistantStateDatabaseReadAdmission as t, normalizeSqliteNumber as tt, acquireSqliteSnapshotReadToken as u, isStateDatabaseReadAdmissionInvalidatedError as ut, CONTENT_VERSION_KEY as v, resolveStateDatabaseCoordinatorPath as vt, openTrackedStateDatabase as w, StateDatabaseCoordinatorContentionError as wt, readStateSchemaMigrationVersion as x, tryCreateStateLifecycleDelegate as xt, assertSupportedStateSchemaVersion as y, resolveStateLifecycleRuntimeDirectory as yt, getCanonicalSqliteTableNames as z, readSqliteBusyTimeout as zt };
