import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { x as parseStrictNonNegativeInteger } from "./number-coercion-0M4tZV2c.js";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-BZDacuc9.js";
import { n as stripToolMessages } from "./chat-history-text-56QpfA4M.js";
import { t as formatRunLabel } from "./subagents-utils-BBbCPRlY.js";
import { n as commandReply } from "./command-gates-B1twWQps.js";
import { i as resolveSubagentEntryForToken, n as formatLogLines } from "./shared-Djh50T-6.js";
//#region src/auto-reply/reply/commands-subagents/action-log.ts
async function handleSubagentsLogAction(ctx) {
	const { readContext, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("📜 Usage: /subagents log <id|#> [limit]");
	const includeTools = restTokens.some((token) => normalizeLowercaseStringOrEmpty(token) === "tools");
	const limitToken = restTokens.slice(1).find((token) => parseStrictNonNegativeInteger(token) !== void 0);
	const parsedLimit = parseStrictNonNegativeInteger(limitToken);
	const limit = parsedLimit === void 0 ? 20 : Math.min(200, Math.max(1, parsedLimit));
	const targetResolution = resolveSubagentEntryForToken(readContext.list.view, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const history = await bindAgentToolGatewayRequest({ hostedOnly: true })({
		method: "chat.history",
		params: {
			sessionKey: targetResolution.entry.childSessionKey,
			limit
		}
	});
	const rawMessages = Array.isArray(history?.messages) ? history.messages : [];
	const filtered = includeTools ? rawMessages : stripToolMessages(rawMessages);
	const lines = formatLogLines(filtered);
	const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
	if (lines.length === 0) return commandReply(`${header}\n(no messages)`);
	return commandReply([header, ...lines].join("\n"));
}
//#endregion
export { handleSubagentsLogAction };
