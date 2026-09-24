import { c as resolveAgentIdFromSessionKey } from "./session-key-AvQIavYt.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { r as resolveConcreteSessionStorePath } from "./paths-ViQaz2td.js";
import "./testclaw-agent-db-Ckg86YCZ.js";
import { g as toDatabaseOptions, m as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { E as resolveSessionStorePathForScope, _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { s as resolveSessionEntrySelection } from "./session-accessor.entry-BGyeftoC.js";
import { n as resolveSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-CGgZvou6.js";
//#region src/config/sessions/session-accessor.transcript-target.ts
/** Binds runtime storage without changing keys that raw ownership checks and read fences validate. */
function bindSessionTranscriptStoreScope(scope, config) {
	return {
		...scope,
		storePath: resolveSessionStorePathForScope({
			...scope,
			storePath: resolveConcreteSessionStorePath(scope.storePath)
		}, config)
	};
}
/** Resolves the canonical SQLite identity for runtime transcript access. */
async function resolveSessionTranscriptRuntimeTarget(scope, config, options = {}) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const { storePath } = bindSessionTranscriptStoreScope({
		...scope,
		agentId
	}, config);
	const persistedSessionKey = resolveSessionKeyBySessionId({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		storePath
	});
	const selected = persistedSessionKey && !options.keyFormat ? void 0 : resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey: persistedSessionKey ?? scope.sessionKey,
		storePath
	}, {
		readOnly: true,
		keyFormat: options.keyFormat,
		allowCanonicalMove: !persistedSessionKey
	});
	const sessionKey = persistedSessionKey ?? selected?.normalizedKey ?? scope.sessionKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		sessionKey,
		storePath,
		...options.keyFormat ? {
			selectedSessionId: selected?.existing?.sessionId ?? null,
			selectedLifecycleRevision: selected?.existing?.lifecycleRevision ?? null
		} : {}
	};
}
/** Resolves the physical agent database that owns one runtime transcript. */
function resolveSessionTranscriptDatabasePath(target) {
	const resolved = resolveSqliteTranscriptScope(target);
	return resolveAssistantAgentSqlitePath(toDatabaseOptions(resolved));
}
function resolveSessionTranscriptReadTarget(scope) {
	return resolveSessionTranscriptReadTargetCore(scope, resolveSessionStorePathForScope);
}
//#endregion
export { resolveSessionTranscriptRuntimeTarget as i, resolveSessionTranscriptDatabasePath as n, resolveSessionTranscriptReadTarget as r, bindSessionTranscriptStoreScope as t };
