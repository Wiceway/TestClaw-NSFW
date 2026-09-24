import { n as buildAgentMainSessionKey } from "./session-key-B8Cn8Xls.mjs";
import "./session-key-C_bfgyCp.mjs";
//#region src/config/sessions/main-session-key.ts
/** Resolves the configured main session identity for one agent and session scope. */
function resolveCanonicalMainSessionKey(params) {
	return params.sessionScope === "global" ? "global" : buildAgentMainSessionKey(params);
}
//#endregion
export { resolveCanonicalMainSessionKey as t };
