import "./config-DqAgdhnz.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import "./runs-CgiowlON.mjs";
import "./sessions-QjbxjKuh.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-DoAnlrSa.mjs";
import "./server-plugin-in-process-dispatch-DLEJEMN0.mjs";
import "./session-transcript-readers-DgYp6UTC.mjs";
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
/**
* Runtime dependency barrel for subagent announcement/output collection.
*
* Keeping these imports behind one module lets tests replace gateway/session
* IO without changing the announce logic itself.
*/
function readSubagentSessionEntry(storePath, sessionKey) {
	return loadSessionEntry({
		storePath,
		sessionKey
	});
}
const callSubagentLifecycleGateway = (request) => bindGatewayLifecycleRequest()(request);
//#endregion
export { readSubagentSessionEntry as n, callSubagentLifecycleGateway as t };
