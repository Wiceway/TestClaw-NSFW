import { j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-cXJW6Bip.js";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { p as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-BzD1qpup.js";
import { E as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { s as readSessionMessagesPageWithStatsAsync } from "./session-transcript-readers-D3eaTHpA.js";
//#region src/gateway/control-ui-public-session-read.ts
function resolvePublicSessionShareScope(cfg, locator) {
	const parsed = parseAgentSessionKey(locator.sessionKey);
	const fixedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, locator.sessionKey);
	if (locator.sessionKey !== "global" && (!parsed || parsed.agentId !== locator.agentId || locator.sessionKey !== `agent:${parsed.agentId}:${parsed.rest}`) || fixedOwner.kind === "retired" || fixedOwner.kind === "configured" && fixedOwner.agentId !== locator.agentId || !listAgentIds(cfg).includes(locator.agentId) || isIncognitoSessionKey(locator.sessionKey)) return null;
	return {
		agentId: locator.agentId,
		sessionKey: locator.sessionKey,
		storePath: resolveSessionStorePathForScope(locator, cfg),
		projection: "list"
	};
}
function readAuthorizedEntry(scope, locator) {
	const entry = loadExactSessionEntryReadOnly(scope)?.entry;
	const share = resolveSessionPublicShare(entry);
	return share?.id === locator.shareId && share.sessionId === locator.sessionId ? entry : void 0;
}
function isPublicSessionShareActive(cfg, locator) {
	const scope = resolvePublicSessionShareScope(cfg, locator);
	return Boolean(scope && readAuthorizedEntry(scope, locator));
}
/** Only the exact published generation is readable; this grants no Gateway session authority. */
async function readPublicSessionShare(cfg, locator, options = {}) {
	const scope = resolvePublicSessionShareScope(cfg, locator);
	if (!scope) return null;
	const entry = readAuthorizedEntry(scope, locator);
	if (!entry) return null;
	const history = await readSessionMessagesPageWithStatsAsync({
		...scope,
		sessionId: locator.sessionId,
		sessionEntry: entry
	}, {
		offset: options.offset ?? 0,
		maxMessages: 100,
		maxBytes: 1048576,
		allowResetArchiveFallback: false
	});
	const current = readAuthorizedEntry(scope, locator);
	if (!current) return null;
	return {
		title: (current.label || current.displayName || "Shared session").trim() || "Shared session",
		messages: history.messages,
		totalMessages: history.totalMessages,
		truncated: history.omittedOversized === true,
		...history.olderOffset !== void 0 ? { olderOffset: history.olderOffset } : {}
	};
}
//#endregion
export { isPublicSessionShareActive, readPublicSessionShare };
