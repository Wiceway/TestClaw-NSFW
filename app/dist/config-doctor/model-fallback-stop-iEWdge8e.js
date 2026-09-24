import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
//#region src/agents/model-fallback-stop.ts
const modelFallbackStops = resolveGlobalSingleton(Symbol.for("testclaw.modelFallbackStops"), () => /* @__PURE__ */ new WeakSet());
function recordModelFallbackStop(error) {
	modelFallbackStops.add(error);
}
function isRecordedModelFallbackStop(error) {
	return error instanceof Error && modelFallbackStops.has(error);
}
//#endregion
export { recordModelFallbackStop as n, isRecordedModelFallbackStop as t };
