import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import "./plugin-instance-invocation-Cy1hZ4_T.js";
import "./plugin-instance-scope-B1RUw70q.js";
import "./registry-lifecycle-Dw-35-pc.js";
import "./runtime-B980B6n3.js";
import { i as replacePluginHttpRoutes, n as isPluginHttpRouteVisible } from "./http-route-owner-DD4ZuTuf.js";
import { t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-C139HDZP.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/http-registry.ts
const pluginHttpRouteRegistryScope = resolveGlobalSingleton(Symbol.for("testclaw.pluginHttpRouteRegistryScope"), () => new AsyncLocalStorage());
const routeOwners = resolveGlobalSingleton(Symbol.for("testclaw.pluginHttpRouteRetentionOwners"), () => /* @__PURE__ */ new WeakMap());
const leasedRoutes = resolveGlobalSingleton(Symbol.for("testclaw.pluginHttpRouteLeaseRetentions"), () => /* @__PURE__ */ new WeakMap());
function removeOwnedRoute(owner, successor) {
	owner.removeRoute();
	for (const handoff of owner.handoffs) {
		handoff.delete(owner);
		if (successor) {
			handoff.add(successor);
			successor.handoffs.add(handoff);
		}
	}
	owner.handoffs.clear();
	routeOwners.delete(owner.entry);
}
function retireUnheldRoute(owner) {
	if (owner.holders.size > 0) return;
	if (owner.handoffs.size === 0 || !isPluginHttpRouteVisible(owner.entry)) removeOwnedRoute(owner);
	else if (!owner.entry.handoff) {
		const previous = owner.entry;
		owner.entry = {
			...previous,
			handoff: true,
			handleUpgrade: void 0,
			handler: (_req, res) => {
				res.statusCode = 503;
				res.setHeader("Retry-After", "1");
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("plugin route is restarting; retry");
				return true;
			}
		};
		owner.removeRoute = replacePluginHttpRoutes(owner.registry, owner.entry, [previous], true);
		routeOwners.delete(previous);
		routeOwners.set(owner.entry, owner);
	}
}
/** Keep retired ingress retryable until a successor claims it or every replacement ends. */
function createPluginHttpRouteHandoff() {
	const routes = /* @__PURE__ */ new Set();
	return {
		park(lease) {
			for (const { owner } of leasedRoutes.get(lease) ?? []) if (isPluginHttpRouteVisible(owner.entry)) {
				routes.add(owner);
				owner.handoffs.add(routes);
			}
		},
		release() {
			for (const owner of routes) {
				owner.handoffs.delete(routes);
				retireUnheldRoute(owner);
			}
			routes.clear();
		}
	};
}
function hasSameRouteOwner(left, right) {
	return left.auth === right.auth && normalizeOptionalString(left.pluginId) === normalizeOptionalString(right.pluginId) && normalizeOptionalString(left.source) === normalizeOptionalString(right.source);
}
function adoptPluginHttpRouteHandoffs(previous, next) {
	if (previous === next) return;
	const transfers = previous.httpRoutes.flatMap((entry) => {
		const owner = routeOwners.get(entry);
		if (!owner || !entry.handoff) return [];
		const conflicts = findPluginHttpRouteRegistrationConflicts(next.httpRoutes, entry);
		if (conflicts.authOverlap || conflicts.canonicalMatches.some((route) => !hasSameRouteOwner(route, entry))) throw new Error(`plugin reload cannot replace HTTP route ownership at ${entry.path}`);
		return [{
			owner,
			replacement: conflicts.canonicalMatches[0]
		}];
	});
	for (const { owner, replacement } of transfers) {
		if (replacement === owner.entry) continue;
		if (replacement) removeOwnedRoute(owner, routeOwners.get(replacement));
		else {
			owner.removeRoute();
			owner.registry = next;
			owner.removeRoute = replacePluginHttpRoutes(next, owner.entry);
		}
	}
}
function withPluginHttpRouteRegistry(registry, run, lease) {
	const inherited = pluginHttpRouteRegistryScope.getStore()?.leases ?? [];
	const leases = lease && !inherited.includes(lease) ? [...inherited, lease] : inherited;
	return pluginHttpRouteRegistryScope.run({
		registry,
		leases
	}, run);
}
//#endregion
export { createPluginHttpRouteHandoff as n, withPluginHttpRouteRegistry as r, adoptPluginHttpRouteHandoffs as t };
