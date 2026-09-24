import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./agent-scope-config-Dm8T0OhW.mjs";
import { o as classifySessionKeyShape } from "./session-key-C_bfgyCp.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { r as isSameFixedSessionStoreConfig, t as isPerAgentSessionStoreConfig } from "./session-store-config-BSU3oxEG.mjs";
//#region src/config/sessions/session-store-owner.ts
/** Preserves a retired fixed-store owner as an explicit unavailable state. */
function resolvePersistedSessionStoreOwner(config) {
	if (isPerAgentSessionStoreConfig(config.session?.store)) return { kind: "none" };
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	if (!persistedAgentId) return { kind: "none" };
	const agentId = normalizeAgentId(persistedAgentId);
	return listAgentIds(config).some((configuredAgentId) => normalizeAgentId(configuredAgentId) === agentId) ? {
		kind: "configured",
		agentId
	} : {
		kind: "retired",
		agentId
	};
}
/** Applies fixed-store ownership only to keys without an agent-qualified namespace. */
function resolvePersistedSessionStoreOwnerForKey(config, sessionKey) {
	return classifySessionKeyShape(sessionKey) === "legacy_or_alias" ? resolvePersistedSessionStoreOwner(config) : { kind: "none" };
}
/** Applies fixed-store ownership only when the concrete write target is that configured store. */
function resolvePersistedSessionStoreOwnerForTarget(params) {
	const owner = resolvePersistedSessionStoreOwnerForKey(params.config, params.sessionKey);
	if (owner.kind === "none" || !params.storePath) return owner;
	return isSameFixedSessionStoreConfig(params.config.session?.store, params.storePath, params.env ?? process.env) ? owner : { kind: "none" };
}
//#endregion
export { resolvePersistedSessionStoreOwnerForKey as n, resolvePersistedSessionStoreOwnerForTarget as r, resolvePersistedSessionStoreOwner as t };
