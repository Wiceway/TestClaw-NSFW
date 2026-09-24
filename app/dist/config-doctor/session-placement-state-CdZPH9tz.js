//#region packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
	return state !== void 0 && state !== "local" && state !== "reclaimed";
}
//#endregion
export { isCloudWorkerPlacementState as t };
