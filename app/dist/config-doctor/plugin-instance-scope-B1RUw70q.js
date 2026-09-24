import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-Cy1hZ4_T.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-instance-scope.ts
const pluginInstanceState = resolveGlobalSingleton(Symbol.for("testclaw.pluginInstanceState"), () => ({
	records: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
const pluginInvocationContext = resolveGlobalSingleton(Symbol.for("testclaw.pluginInvocationContext"), () => new AsyncLocalStorage());
function resolvePluginInstanceOwner(record, registry) {
	let owner = pluginInstanceState.records.get(record);
	if (!owner) {
		owner = {
			record,
			registry,
			revoked: false
		};
		pluginInstanceState.records.set(record, owner);
	}
	return owner;
}
/** Record and resource keys resolve the same owner through adoption and failed registration. */
function getPluginInstanceOwner(instance) {
	return pluginInstanceState.records.get(instance);
}
/** Direct SDK registrars retain the same owner as registrations made through api. */
function wrapCurrentPluginInstance(value, host) {
	const owner = pluginInstanceInvocation.getStore()?.instance;
	return owner ? owner.wrap(value) : host ? host(value) : value;
}
/** Teardown admission comes from the host owner, never a plugin method name. */
function runPluginCleanup(value, run) {
	const instance = pluginInstanceState.values.get(value);
	return instance ? instance.runCleanup(run) : run();
}
function getPluginInstance(record) {
	return pluginInstanceState.records.get(record)?.instance;
}
/** Exact owner of a callable public view; never inferred from a plugin id or path. */
function getPluginValueInstance(value) {
	return pluginInstanceState.values.get(value);
}
/** Host consumers retain the exact stream owner until their terminal work settles. */
function runPluginStreamConsumer(stream, consume) {
	const instance = getPluginValueInstance(stream);
	return instance ? instance.runConsumer(consume) : consume();
}
//#endregion
export { pluginInvocationContext as a, runPluginStreamConsumer as c, pluginInstanceState as i, wrapCurrentPluginInstance as l, getPluginInstanceOwner as n, resolvePluginInstanceOwner as o, getPluginValueInstance as r, runPluginCleanup as s, getPluginInstance as t };
