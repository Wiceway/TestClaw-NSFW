import { t as KeyedAsyncQueue } from "./keyed-async-queue-D2a98CpI.js";
//#region src/agents/models-config-state.ts
const MODELS_JSON_STATE_KEY = Symbol.for("testclaw.modelsJsonState");
const MODELS_JSON_STATE = (() => {
	const globalState = globalThis;
	if (!globalState[MODELS_JSON_STATE_KEY]) globalState[MODELS_JSON_STATE_KEY] = {
		writeQueue: new KeyedAsyncQueue(),
		readyCache: /* @__PURE__ */ new Map(),
		costCache: /* @__PURE__ */ new Map()
	};
	return globalState[MODELS_JSON_STATE_KEY];
})();
//#endregion
export { MODELS_JSON_STATE as t };
