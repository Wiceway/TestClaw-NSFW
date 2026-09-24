import "./src-CZ2wJvNB.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as executeExistingAssistantStateRead, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { i as legacyAcpDatabaseSessionKeys, l as selectAcpSessionRowForStoreEntry, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, s as resolveReadableAcpSessionRow } from "./session-meta-keys-CJLOjSom.mjs";
//#region src/acp/runtime/session-meta-readonly.ts
/** Each result stays bound to the entry lifecycle captured by the row reader. */
async function readAcpSessionMetaForEntries(params) {
	if (params.entries.length === 0) return [];
	const result = await executeExistingAssistantStateRead({
		env: params.env,
		path: params.databasePath
	}, {
		type: "acpSessions.metadata",
		entries: params.entries.map(({ sessionKey, agentId, entry }) => ({
			keys: [buildAcpDatabaseSessionKey(sessionKey, agentId), ...legacyAcpDatabaseSessionKeys(sessionKey, agentId, params.cfg)],
			legacyKey: resolveLegacyFreeAcpSessionKey(sessionKey),
			entry: {
				lifecycleRevision: entry.lifecycleRevision,
				sessionId: entry.sessionId,
				sessionStartedAt: entry.sessionStartedAt
			}
		}))
	});
	if (result === void 0) return params.entries.map(() => null);
	if (result.ok && result.type === "acpSessions.metadata") return result.rows.map((row) => row ? rowToAcpSessionMeta(row) : null);
	throw new Error("Unexpected ACP session metadata read result");
}
function rowToAcpSessionMeta(row) {
	const identity = safeParseJsonRecord(row.identity_json ?? "");
	const runtimeOptions = safeParseJsonRecord(row.runtime_options_json ?? "");
	return {
		backend: row.backend,
		agent: row.agent,
		runtimeSessionName: row.runtime_session_name,
		...identity ? { identity } : {},
		mode: row.mode === "oneshot" ? "oneshot" : "persistent",
		...runtimeOptions ? { runtimeOptions } : {},
		...row.cwd != null ? { cwd: row.cwd } : {},
		state: row.state === "running" || row.state === "error" ? row.state : "idle",
		lastActivityAt: row.last_activity_at,
		...row.last_error != null ? { lastError: row.last_error } : {}
	};
}
function readAcpSessionMetaForEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = withExistingAssistantStateDatabaseReadOnly(({ db }) => resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForStoreEntry(db, sessionKey, params.agentId, params.cfg, params.entry),
		entry: params.entry
	}), {
		env: params.env,
		path: params.databasePath
	});
	if (!row) return;
	return rowToAcpSessionMeta(row);
}
//#endregion
export { readAcpSessionMetaForEntry as n, rowToAcpSessionMeta as r, readAcpSessionMetaForEntries as t };
