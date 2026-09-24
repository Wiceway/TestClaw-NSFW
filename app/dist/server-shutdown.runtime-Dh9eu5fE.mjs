//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-CwrkfSTa.mjs"),
		import("./mcp-http-BWmWdyJz.mjs"),
		import("./task-registry.maintenance-BqnFamvF.mjs"),
		import("./main-session-restart-recovery-B3GsU71S.mjs"),
		import("./agent-bundle-lsp-runtime-DvwFqWYI.mjs"),
		import("./embeddings-provider-lifetime-C51zdSSk.mjs"),
		import("./gmail-watcher-4hFSgMzD.mjs"),
		import("./code-mode-state-C9hFYtbW.mjs"),
		import("./provider-transport-dispatcher-pool-C4RoC5zb.mjs"),
		import("./runtime-CjlkJ-tl.mjs"),
		import("./plugin-cache-Ca9qkV4Q.mjs")
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
