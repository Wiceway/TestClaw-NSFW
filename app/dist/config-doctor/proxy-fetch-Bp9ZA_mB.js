import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { i as logWarn } from "./logger-DgjIIHeT.js";
import { i as resolveEnvHttpProxyAgentOptions } from "./proxy-env-CrR_52p-.js";
import { a as loadUndiciRuntimeDeps, n as createHttp1EnvHttpProxyAgent } from "./undici-runtime-C7BaHvDY.js";
import { t as fetchWithPreparedRuntimeDispatcher } from "./runtime-fetch-BtfvGslA.js";
//#region src/infra/net/proxy-fetch.ts
/**
* Resolve a proxy-aware fetch from standard environment variables.
* Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
* Returns undefined when no proxy is configured.
* Gracefully returns undefined if the proxy URL is malformed.
*/
function resolveProxyFetchFromEnv(env = process.env) {
	const proxyOptions = resolveEnvHttpProxyAgentOptions(env);
	if (!proxyOptions) return;
	try {
		const runtimeDeps = loadUndiciRuntimeDeps();
		const agent = createHttp1EnvHttpProxyAgent(proxyOptions, void 0, env);
		return ((input, init) => fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, {
			...init,
			dispatcher: agent
		}));
	} catch (err) {
		logWarn(`Proxy env var set but agent creation failed — falling back to direct fetch: ${formatErrorMessage(err)}`);
		return;
	}
}
//#endregion
export { resolveProxyFetchFromEnv as t };
