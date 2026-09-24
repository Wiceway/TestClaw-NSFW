import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-Cf1GWEow.js";
import { s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-BpmBw41u.js";
import { at as loadCombinedSessionStoreForGatewayCore } from "./session-row-prepared-read-x3FXwbu8.js";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DlmWzvmc.js";
import "./session-utils-DyRtmfj4.js";
//#region src/gateway/worker-environments/session-target.ts
function resolveWorkerSessionTarget(cfg, sessionId) {
	const { store, targetsBySessionKey } = loadCombinedSessionStoreForGatewayCore(cfg);
	const matches = Object.entries(store).filter(([, entry]) => entry.sessionId === sessionId);
	const selection = resolveSessionIdMatchSelection(matches, sessionId);
	if (selection.kind !== "selected") return;
	const agentId = expectDefined(targetsBySessionKey.get(selection.sessionKey), "worker session owner").agentId;
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: selection.sessionKey,
		agentId,
		clone: false,
		exactRead: true
	});
	const entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	if (!entry || entry.sessionId !== sessionId) return;
	return {
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: target.canonicalKey,
		sessionStore: target.store,
		storePath: target.storePath
	};
}
//#endregion
export { resolveWorkerSessionTarget as t };
