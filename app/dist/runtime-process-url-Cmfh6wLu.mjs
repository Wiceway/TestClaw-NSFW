import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DEzGnZz9.mjs";
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
export { resolveRuntimeProcessEntrypointUrl as t };
