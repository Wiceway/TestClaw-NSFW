import { r as isSqliteWalResetSafeVersion } from "./node-sqlite-BYuCrQql.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { r as registerSqliteReaderConnection } from "./sqlite-reader-lifecycle-CHO49mcb.js";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-jRWDObfR.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as compareValidSemver } from "./semver-BiH_OTew.js";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
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
const require = createRequire(import.meta.url);
let validatedSqliteModule;
let extensionLoadingSupported = false;
let jsonbSupported = false;
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
/** Build an immutable SQLite URI without losing the Windows long-path namespace. */
function resolveImmutableSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=ro&immutable=1`;
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
		jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = database.prepare("SELECT sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()?.omitted === 0;
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
		const sqlite = require("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Whether the loaded SQLite library supports native extensions. */
function supportsNodeSqliteExtensionLoading() {
	requireNodeSqlite();
	return extensionLoadingSupported;
}
/** JSONB is absent from the supported SQLite 3.44 maintenance line. */
function supportsNodeSqliteJsonb() {
	requireNodeSqlite();
	return jsonbSupported;
}
/** Open node:sqlite through Assistant's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const database = options === void 0 ? new sqlite.DatabaseSync(resolvedLocation) : new sqlite.DatabaseSync(resolvedLocation, options);
	registerSqliteReaderConnection(database);
	return database;
}
/** Compare versions only across reads on the same connection. */
function readSqliteDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
//#endregion
export { resolveImmutableSqliteFileUri as a, supportsNodeSqliteExtensionLoading as c, resolveExistingSqliteFileUri as i, supportsNodeSqliteJsonb as l, readSqliteDataVersion as n, resolveNodeSqliteLocation as o, requireNodeSqlite as r, resolveSqliteFilesystemPath as s, openNodeSqliteDatabase as t };
