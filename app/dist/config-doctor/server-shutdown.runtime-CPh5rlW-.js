//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime-BdbV4LRu.js"),
		import("./hook-runner-global-CLbfwcJS.js"),
		import("./session-change-event-Cc9wFd1x.js"),
		import("./mcp-http-Dy_vwazs.js"),
		import("./task-registry.maintenance-P4upkH0H.js"),
		import("./main-session-restart-recovery-DFejmYDb.js"),
		import("./agent-bundle-lsp-runtime-BkMWsxXG.js"),
		import("./embeddings-provider-lifetime-DB1JND0F.js"),
		import("./gmail-watcher-DMhtJQ9Z.js"),
		import("./code-mode-state-BtQqqbMG.js"),
		import("./provider-transport-dispatcher-pool-Bup0y7TP.js"),
		import("./runtime-DTvaNGCC.js"),
		import("./plugin-cache-BVyF3Tvv.js")
	]);
	await prepareActivePluginRegistryShutdown();
	return {
		prepareGatewayClose,
		completeGatewayClose,
		drainActiveSessionsForShutdown,
		runGatewayClosePrelude,
		runGlobalGatewayStopSafely,
		flushPendingSessionsChangedEvents,
		closeMcpLoopbackServer,
		stopTaskRegistryMaintenance,
		markRestartAbortedMainSessions,
		disposeAllBundleLspRuntimes,
		drainRetainedOpenAiEmbeddingProviders,
		stopGmailWatcher,
		disposeAllCodeModeRuns,
		closeProviderTransportDispatcherPool,
		waitForPluginCacheRetirement
	};
}
//#endregion
export { prepareGatewayShutdownRuntime };
