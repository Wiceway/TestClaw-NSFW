import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { i as resolveNormalizedRouteBindingMatch } from "./binding-scope-B5G3-w8D.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
//#region src/routing/bindings.ts
function listBindings(cfg) {
	return listRouteBindings(cfg);
}
function buildChannelAccountBindings(cfg) {
	const map = /* @__PURE__ */ new Map();
	for (const binding of listBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding, { includeImplicitDefaultAccount: true });
		if (!resolved) continue;
		const byAgent = map.get(resolved.channelId) ?? /* @__PURE__ */ new Map();
		const list = byAgent.get(resolved.agentId) ?? [];
		if (!list.includes(resolved.accountId)) list.push(resolved.accountId);
		byAgent.set(resolved.agentId, list);
		map.set(resolved.channelId, byAgent);
	}
	return map;
}
function resolvePreferredAccountId(params) {
	if (params.boundAccounts.length > 0) return expectDefined(params.boundAccounts[0], "bound accounts entry at 0");
	return params.defaultAccountId;
}
//#endregion
export { listBindings as n, resolvePreferredAccountId as r, buildChannelAccountBindings as t };
