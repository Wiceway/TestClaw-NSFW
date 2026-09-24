import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-source-capture-context.ts
const runInPluginSourceCaptureContext = resolveGlobalSingleton(Symbol.for("testclaw.pluginSourceCaptureContext"), () => AsyncLocalStorage.snapshot());
//#endregion
export { runInPluginSourceCaptureContext as t };
