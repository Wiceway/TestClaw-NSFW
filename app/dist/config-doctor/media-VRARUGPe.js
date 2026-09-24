import "./mime-Bmg9gcyP.js";
import { l as normalizeMediaFacts, u as projectMediaFacts } from "./media-facts-CfqEsuNX.js";
import "./media-probe-CRmUkaqP.js";
import "./local-media-path-BTtsPPoc.js";
//#region src/channels/inbound-event/media.ts
/** Normalizes plugin-provided attachments into ordered runtime facts. */
function toInboundMediaFacts(media, defaults = {}) {
	return normalizeMediaFacts(media, defaults);
}
/** Projects facts into history without transient turn-only fields. */
function toHistoryMediaEntries(media, defaults = {}) {
	return toInboundMediaFacts(media, defaults).map((entry) => {
		const historyEntry = {
			path: entry.path,
			url: entry.url,
			contentType: entry.contentType,
			kind: entry.kind,
			messageId: entry.messageId
		};
		if (entry.durationMs) historyEntry.durationMs = entry.durationMs;
		if (entry.width) historyEntry.width = entry.width;
		if (entry.height) historyEntry.height = entry.height;
		return historyEntry;
	});
}
/**
* Builds the legacy singular/plural environment projection.
* @deprecated Pass ordered facts as `media`; use `toInboundMediaFacts` to normalize inputs.
*/
function buildChannelInboundMediaPayload(media) {
	return projectMediaFacts(media);
}
//#endregion
export { toHistoryMediaEntries as n, buildChannelInboundMediaPayload as t };
