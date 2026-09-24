import { i as enqueueSystemEvent } from "./system-events-a6gEP3M4.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-CgiowlON.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-QjbxjKuh.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-bsluZ3tF.mjs";
import { n as incrementCompactionCount } from "./session-updates-BOvXQkm2.mjs";
import { n as formatContextUsageShort } from "./status-message-DnDHw-bh.mjs";
import "./status-Bd0j3iVC.mjs";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
