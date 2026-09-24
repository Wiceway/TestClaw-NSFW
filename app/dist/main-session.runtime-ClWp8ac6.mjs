import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./io-B_AwfUDz.mjs";
import { s as resolveSystemMainSessionKey } from "./main-session-E7DOhW9Q.mjs";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
