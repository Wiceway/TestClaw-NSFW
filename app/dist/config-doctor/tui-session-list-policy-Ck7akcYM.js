import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import "./session-key-AvQIavYt.js";
import { t as readSessionListSelectionFacts } from "./session-list-target-B2V56Usa.js";
//#region src/tui/tui-session-list-policy.ts
const TUI_RECENT_SESSIONS_ACTIVE_MINUTES = 10080;
/** Exact metadata reads retain the session picker's discovery eligibility. */
function isListedTuiSession(session) {
	const { isCronRun, isPhantom } = readSessionListSelectionFacts(session.key, session);
	return !(session.archived || session.incognito || isIncognitoSessionKey(session.key) || isCronRun || isPhantom);
}
//#endregion
export { isListedTuiSession as n, TUI_RECENT_SESSIONS_ACTIVE_MINUTES as t };
