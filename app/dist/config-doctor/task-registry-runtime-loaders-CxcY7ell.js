import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.js";
//#region src/tasks/task-registry-runtime-loaders.ts
const deliveryRuntimeLoader = createLazyPromiseLoader(() => import("./task-registry-delivery-runtime-BMFPyZRD.js"), { cacheRejections: true });
const controlRuntimeLoader = createLazyPromiseLoader(() => import("./task-registry-control.runtime-DRkPh_7d.js"), { cacheRejections: true });
function loadTaskRegistryDeliveryRuntime() {
	return deliveryRuntimeLoader.load();
}
function loadTaskRegistryControlRuntime() {
	return controlRuntimeLoader.load();
}
//#endregion
export { loadTaskRegistryDeliveryRuntime as i, deliveryRuntimeLoader as n, loadTaskRegistryControlRuntime as r, controlRuntimeLoader as t };
