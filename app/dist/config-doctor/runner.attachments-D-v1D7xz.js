import { l as normalizeMediaFacts } from "./media-facts-CfqEsuNX.js";
import { a as getSessionSafeDefaultMediaLocalRoots } from "./local-roots-BTFaeVES.js";
import { n as mergeInboundPathRoots } from "./inbound-path-policy-B9vq4qy9.js";
import { t as resolveChannelInboundAttachmentRoots } from "./channel-inbound-roots-BZW9RU0b.js";
import { a as normalizeAttachments } from "./attachments.normalize-DHlIwcUp.js";
import { t as MediaAttachmentCache } from "./attachments-96gpu64L.js";
import path from "node:path";
//#region src/media-understanding/runner.attachments.ts
/** Normalizes message context media fields for the media-understanding runner. */
function normalizeMediaAttachments(ctx) {
	const attachments = normalizeAttachments(ctx);
	return ctx.SkipStickerMediaUnderstanding ? attachments.filter((attachment) => attachment.index !== 0) : attachments;
}
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
function createMediaAttachmentCache(attachments, options) {
	return new MediaAttachmentCache(attachments, options);
}
function resolveMediaAttachmentLocalRoots(params) {
	const workspaceDirs = normalizeMediaFacts(params.ctx.media).flatMap((fact) => fact.workspaceDir ? [path.resolve(fact.workspaceDir)] : []);
	return mergeInboundPathRoots(getSessionSafeDefaultMediaLocalRoots(params.workspaceDir), workspaceDirs, params.workspaceDir ? [path.resolve(params.workspaceDir)] : void 0, resolveChannelInboundAttachmentRoots(params));
}
//#endregion
export { normalizeMediaAttachments as n, resolveMediaAttachmentLocalRoots as r, createMediaAttachmentCache as t };
