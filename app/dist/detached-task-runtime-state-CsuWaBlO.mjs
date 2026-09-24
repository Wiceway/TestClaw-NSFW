import { n as getPluginRegistryForContext } from "./gateway-request-scope-Cys5l4an.mjs";
import { a as capturePluginRegistryLifecycleEpoch, c as getPluginRecordRegistry, i as capturePluginLifecycleAuthority, p as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-7UsSBpcC.mjs";
import { y as requireActivePluginRegistry } from "./runtime-D1tHq7F4.mjs";
import { At as DetachedTaskRuntimeOwnerRetiredError } from "./task-registry.store.kernel-CTpG8C0S.mjs";
//#region src/tasks/detached-task-runtime-state.ts
function getRegisteredDetachedTaskLifecycleRuntime() {
	return requireActivePluginRegistry().detachedTaskRuntimes[0]?.runtime;
}
/** Core creation retains its activation; plugin work follows its exact live instance. */
function captureDetachedTaskRuntimeOwner() {
	const registry = requireActivePluginRegistry();
	const registration = registry.detachedTaskRuntimes[0];
	const runtime = registration?.runtime;
	const pluginId = registration?.pluginId;
	const record = registration ? registry.plugins.find((candidate) => candidate.id === pluginId) : void 0;
	const authority = record ? capturePluginLifecycleAuthority(getPluginRecordRegistry(registry, record), record) : void 0;
	const epoch = registration ? void 0 : capturePluginRegistryLifecycleEpoch(registry);
	return {
		runtime,
		assertCurrent() {
			if (registration) {
				const owner = record ? getPluginRecordRegistry(registry, record) : void 0;
				if (authority?.() && owner?.detachedTaskRuntimes.some((candidate) => candidate.pluginId === pluginId && candidate.runtime === runtime)) return;
			} else if (epoch && isPluginRegistryLifecycleEpochActive(registry, epoch) && getPluginRegistryForContext() === registry && registry.detachedTaskRuntimes[0] === void 0) return;
			throw new DetachedTaskRuntimeOwnerRetiredError();
		}
	};
}
//#endregion
export { getRegisteredDetachedTaskLifecycleRuntime as n, captureDetachedTaskRuntimeOwner as t };
