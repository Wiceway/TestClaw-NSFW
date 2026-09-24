import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
//#region src/plugins/runtime-close-error.ts
const PluginRuntimeCloseRetainedError = resolveGlobalSingleton(Symbol.for("testclaw.pluginRuntimeCloseRetainedError"), () => class RetainedRuntimeError extends Error {
	constructor(cause) {
		super("Plugin runtime still owns resources; inspect cleanup failures before retrying Gateway close.", { cause });
		this.name = "PluginRuntimeCloseRetainedError";
	}
});
function hasRetainedPluginRuntimeCloseError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => candidate instanceof PluginRuntimeCloseRetainedError);
}
//#endregion
export { hasRetainedPluginRuntimeCloseError as n, PluginRuntimeCloseRetainedError as t };
