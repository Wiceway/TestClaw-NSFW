import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-DjDZ0rlr.mjs";
import { s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-iKakm6L6.mjs";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-oPm4DEK2.mjs";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-BVoy_pJn.mjs";
import "./session-utils-CUcWGvVN.mjs";
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
