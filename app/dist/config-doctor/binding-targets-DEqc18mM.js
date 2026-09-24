import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as resolveGlobalMap } from "./global-singleton-DmdlcXls.js";
import "./errors-cp9Var1Z.js";
//#region src/channels/plugins/stateful-target-drivers.ts
const registeredStatefulBindingTargetDrivers = resolveGlobalMap(Symbol.for("testclaw.statefulBindingTargetDrivers"), "plugin-registry");
function listStatefulBindingTargetDrivers() {
	return [...registeredStatefulBindingTargetDrivers.values()];
}
function registerStatefulBindingTargetDriver(driver) {
	const id = driver.id.trim();
	if (!id) throw new Error("Stateful binding target driver id is required");
	const normalized = {
		...driver,
		id
	};
	if (registeredStatefulBindingTargetDrivers.get(id)) return () => {};
	registeredStatefulBindingTargetDrivers.set(id, normalized);
	return () => {
		if (registeredStatefulBindingTargetDrivers.get(id) === normalized) registeredStatefulBindingTargetDrivers.delete(id);
	};
}
function resolveStatefulBindingTargetBySessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	for (const driver of listStatefulBindingTargetDrivers()) {
		const bindingTarget = driver.resolveTargetBySessionKey?.({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		if (bindingTarget) return {
			driver,
			bindingTarget
		};
	}
	return null;
}
//#endregion
//#region src/channels/plugins/stateful-target-builtins.ts
/**
* Built-in stateful binding target registration.
*
* Lazily registers ACP target drivers so non-ACP channel flows avoid ACP runtime imports.
*/
const loadAcpStatefulTargetDriverModule = createLazyRuntimeModule(() => import("./acp-stateful-target-driver-oyNenk8-.js"));
async function ensureStatefulTargetBuiltinsRegistered() {
	try {
		const { acpStatefulBindingTargetDriver } = await loadAcpStatefulTargetDriverModule();
		registerStatefulBindingTargetDriver(acpStatefulBindingTargetDriver);
	} catch (error) {
		loadAcpStatefulTargetDriverModule.clear();
		throw error;
	}
}
//#endregion
//#region src/channels/plugins/binding-targets.ts
/**
* Resets a stateful configured binding target in place when its driver supports reset.
*/
async function resetConfiguredBindingTargetInPlace(params) {
	let resolved = resolveStatefulBindingTargetBySessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!resolved) {
		await ensureStatefulTargetBuiltinsRegistered();
		resolved = resolveStatefulBindingTargetBySessionKey({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
	}
	if (!resolved?.driver.resetInPlace) return {
		ok: false,
		skipped: true
	};
	return await resolved.driver.resetInPlace({
		...params,
		bindingTarget: resolved.bindingTarget
	});
}
//#endregion
export { resetConfiguredBindingTargetInPlace as t };
