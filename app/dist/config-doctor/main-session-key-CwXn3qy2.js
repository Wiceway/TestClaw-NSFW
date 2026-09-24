import { n as buildAgentMainSessionKey } from "./session-key-C0UQClgw.js";
import "./session-key-AvQIavYt.js";
//#region src/config/sessions/main-session-key.ts
/** Resolves the configured main session identity for one agent and session scope. */
function resolveCanonicalMainSessionKey(params) {
	return params.sessionScope === "global" ? "global" : buildAgentMainSessionKey(params);
}
//#endregion
export { resolveCanonicalMainSessionKey as t };
