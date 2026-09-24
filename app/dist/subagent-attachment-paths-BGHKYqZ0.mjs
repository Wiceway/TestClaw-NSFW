import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import "./session-key-C_bfgyCp.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/subagents/subagent-attachment-paths.ts
const SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT = "/testclaw/attachments";
function resolveSubagentAttachmentRootDir(agentId, env = process.env) {
	return path.join(resolveStateDir(env), "attachments", "subagents", normalizeAgentId(agentId));
}
function resolveSubagentSessionAttachmentRootDir(params) {
	const sessionRef = createHash("sha256").update(params.childSessionKey).digest("hex").slice(0, 32);
	return path.join(resolveSubagentAttachmentRootDir(params.agentId, params.env), sessionRef);
}
/** Resolves a per-session attachment root only when a run identity is available. */
function subagentAttachmentRootForRun(agentId, childSessionKey) {
	return agentId && childSessionKey ? resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey
	}) : void 0;
}
function resolveSubagentAttachmentDir(agentId, childSessionKey, attachmentId, env) {
	return path.join(resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey,
		env
	}), attachmentId);
}
//#endregion
export { subagentAttachmentRootForRun as i, resolveSubagentAttachmentDir as n, resolveSubagentSessionAttachmentRootDir as r, SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT as t };
