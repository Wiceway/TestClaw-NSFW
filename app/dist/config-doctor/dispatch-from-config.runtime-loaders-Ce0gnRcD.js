import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
//#region src/auto-reply/reply/dispatch-from-config.runtime-loaders.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime-B3ou5GEk.js"));
const getReplyFromConfigRuntimeLoader = createLazyImportLoader(() => import("./get-reply-from-config.runtime-Qj0HCd5x.js"));
const abortRuntimeLoader = createLazyImportLoader(() => import("./abort.runtime-CFntJoJ4.js"));
const fastApproveRuntimeLoader = createLazyImportLoader(() => import("./fast-approve.runtime-Clr3qGif.js"));
const replyMediaPathsRuntimeLoader = createLazyImportLoader(() => import("./reply-media-paths.runtime-DPSFCtgY.js"));
const runtimePluginsLoader = createLazyImportLoader(() => import("./runtime-plugins-BgH1q0Nj.js"));
const preparedModelRuntimeLoader = createLazyImportLoader(() => import("./prepared-model-runtime-DBXu5YaT.js"));
function loadRouteReplyRuntime() {
	return routeReplyRuntimeLoader.load();
}
function loadGetReplyFromConfigRuntime() {
	return getReplyFromConfigRuntimeLoader.load();
}
function loadAbortRuntime() {
	return abortRuntimeLoader.load();
}
function loadFastApproveRuntime() {
	return fastApproveRuntimeLoader.load();
}
function loadReplyMediaPathsRuntime() {
	return replyMediaPathsRuntimeLoader.load();
}
function loadRuntimePlugins() {
	return runtimePluginsLoader.load();
}
function loadPreparedModelRuntime() {
	return preparedModelRuntimeLoader.load();
}
//#endregion
export { loadReplyMediaPathsRuntime as a, loadPreparedModelRuntime as i, loadFastApproveRuntime as n, loadRouteReplyRuntime as o, loadGetReplyFromConfigRuntime as r, loadRuntimePlugins as s, loadAbortRuntime as t };
