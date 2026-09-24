import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-Cys5l4an.mjs";
import { t as createWorkerSessionPlacementStore } from "./placement-store-CLPtA1_g.mjs";
//#region src/gateway/session-worker-placement-context.ts
const localPlacementState = resolveGlobalSingleton(Symbol.for("testclaw.localSessionWorkerPlacementContext"), () => ({}), (state) => {
	state.store = void 0;
});
/** Uses the live Gateway owner when present; embedded runtimes share the same lightweight DB. */
function resolveSessionWorkerPlacementContext(owner) {
	const gatewayContext = getPluginRuntimeGatewayRequestScope()?.context ?? owner;
	if (gatewayContext?.workerSessionPlacementService) return gatewayContext;
	localPlacementState.store ??= createWorkerSessionPlacementStore();
	return { workerSessionPlacementService: localPlacementState.store };
}
//#endregion
export { resolveSessionWorkerPlacementContext as t };
