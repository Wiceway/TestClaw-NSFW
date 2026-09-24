import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { o as resolveFreshSessionTotalTokens } from "./types-BhbLC9G7.js";
import "./session-accessor-DMf92PxK.js";
import { n as enqueueSystemEvent } from "./system-events-BUr4KJmI.js";
import { t as formatTokenCount } from "./token-format-BiVJ1Fri.js";
import "./sessions-4kX-llHk.js";
import { I as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-CKg3ezhN.js";
import { n as incrementCompactionCount } from "./session-updates-CCJm1HuY.js";
import { r as compactEmbeddedAgentSession } from "./embedded-agent-uuqhKrpU.js";
import "./status-CvnbnuL0.js";
import { n as formatContextUsageShort } from "./status-message-C7vIlfHm.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function resolveCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision ? current : void 0;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isEmbeddedAgentRunAbortableForCompaction, resolveCurrentSessionEntry, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
