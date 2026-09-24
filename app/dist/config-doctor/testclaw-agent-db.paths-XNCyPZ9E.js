import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/state/testclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-testclaw-agent.sqlite";
var IncognitoAgentDatabasePathCollisionError = class extends Error {
	constructor(pathname) {
		super(`Incognito agent database sentinel path already exists: ${pathname}. This filename is reserved for in-memory incognito state; move or rename the file and retry.`);
		this.name = "IncognitoAgentDatabasePathCollisionError";
		this.path = pathname;
	}
};
function assertIncognitoAgentDatabasePathAvailable(pathname) {
	if (existsSync(pathname)) throw new IncognitoAgentDatabasePathCollisionError(pathname);
}
const agentSqlitePaths = /* @__PURE__ */ new Map();
const agentSqlitePathKeys = agentSqlitePaths.keys();
/** Resolve the SQLite file for one normalized agent id. */
function resolveAssistantAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	if (options.path != null) return path.resolve(options.path);
	const stateDir = resolveStateDir(options.env ?? process.env);
	const cacheKey = `${agentId}:${stateDir}`;
	const cached = agentSqlitePaths.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolved = path.resolve(stateDir, "agents", agentId, "agent", "testclaw-agent.sqlite");
	agentSqlitePaths.set(cacheKey, resolved);
	if (agentSqlitePaths.size > 256) {
		const oldest = agentSqlitePathKeys.next();
		if (!oldest.done) agentSqlitePaths.delete(oldest.value);
	}
	return resolved;
}
/** Resolve the lexical sentinel path that keys one agent's process-held incognito database. */
function resolveIncognitoAssistantAgentSqlitePath(options) {
	return path.join(path.dirname(resolveAssistantAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
/** Identify the reserved incognito sentinel without touching its filesystem path. */
function isIncognitoAssistantAgentSqlitePath(pathname, options) {
	const resolved = path.resolve(pathname);
	return path.basename(resolved) === "incognito-testclaw-agent.sqlite" && resolved === resolveIncognitoAssistantAgentSqlitePath(options);
}
//#endregion
export { resolveAssistantAgentSqlitePath as a, resolveIncognitoAssistantAgentSqlitePath as i, assertIncognitoAgentDatabasePathAvailable as n, isIncognitoAssistantAgentSqlitePath as r, INCOGNITO_AGENT_SQLITE_BASENAME as t };
