import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-DUH0XYlR.mjs";
import { b as findSessionTranscriptHeader, h as projectSessionTranscriptReportFacts, m as decodeSessionTranscriptReportFacts, s as transcriptEventJsonSql, v as assertCurrentSessionTranscriptHeader } from "./transcript-payload-4tGRkf4_.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { k as applyAssistantDeliveryDirectives } from "./session-accessor.sqlite-read-jqSNqbjI.mjs";
import { a as ensureTranscriptHeader, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-oZ7bC7_7.mjs";
import { r as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-write-guard-BUjHzNXo.mjs";
import { t as SessionEntryNavigation } from "./session-entry-navigation-CAZMqpL-.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.kernel.ts
var TranscriptReportNavigation = class extends SessionEntryNavigation {
	constructor(rows) {
		super();
		for (const { seq, facts } of rows) switch (facts.kind) {
			case "canonical":
				this.appendCanonicalNavigationEntry({
					...facts.entry,
					parentId: facts.entry.parentId ?? null,
					seq
				}, facts.hasParentId);
				break;
			case "leaf":
				this.appendOpaqueNavigationRecord({
					...facts.entry,
					type: "leaf"
				});
				break;
			case "link": this.appendOpaqueNavigationRecord(facts);
		}
		this.finishNavigation();
	}
	facts() {
		return {
			appendParentId: this.appendParentId,
			path: this.getBranch()
		};
	}
};
function readReportBranch(database, sessionId) {
	function rows() {
		return iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select((eb) => [
			"seq",
			"event_json",
			eb.fn("json_extract", [eb.ref("navigation_json"), eb.val("$.report")]).as("report_json")
		]).where("session_id", "=", sessionId).orderBy("seq", "asc"));
	}
	function compressedFacts(reportJson) {
		const facts = reportJson === null ? void 0 : decodeSessionTranscriptReportFacts(JSON.parse(reportJson));
		if (!facts) throw new Error("Invalid compressed transcript report facts");
		return facts;
	}
	let hasRows = false;
	const header = findSessionTranscriptHeader((function* () {
		for (const row of rows()) {
			hasRows = true;
			if (row.event_json !== null) yield JSON.parse(row.event_json);
			else compressedFacts(row.report_json);
		}
	})());
	if (hasRows) assertCurrentSessionTranscriptHeader(header);
	return new TranscriptReportNavigation((function* () {
		for (const row of rows()) yield {
			seq: row.seq,
			facts: row.event_json === null ? compressedFacts(row.report_json) : projectSessionTranscriptReportFacts(JSON.parse(row.event_json))
		};
	})()).facts();
}
function latestCustomReport(database, sessionId, branch, customTypes) {
	for (const entry of branch.path.toReversed()) {
		if (entry.type !== "custom_message" || entry.customType === void 0 || !customTypes.includes(entry.customType)) continue;
		const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", entry.seq));
		const record = row ? JSON.parse(row.event_json) : void 0;
		if (isRecord(record)) return {
			customType: entry.customType,
			content: record.content,
			details: record.details
		};
	}
}
function prepareTranscriptReportSelection(database, resolved, selection) {
	const branch = readReportBranch(database, resolved.sessionId);
	const suppressed = selection.kind === "assistant" ? branch.path.some((entry) => entry.assistantResponseId === selection.responseId) : selection.suppressWhenAssistantRun !== void 0 && branch.path.some((entry) => entry.assistantRunId === selection.suppressWhenAssistantRun);
	return {
		appendParentId: branch.appendParentId,
		suppressed,
		latest: selection.kind === "custom" && !suppressed ? latestCustomReport(database, resolved.sessionId, branch, selection.customTypes) : void 0
	};
}
/** Serialize the final envelope here so user-owned toJSON methods run once before transfer. */
function prepareCustomTranscriptReport(selected, appendParentId) {
	const eventJson = JSON.stringify({
		type: "custom_message",
		...selected,
		id: randomUUID(),
		parentId: appendParentId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (eventJson === void 0) throw new Error("Session transcript report serialization did not produce an event");
	return {
		kind: "custom",
		eventJson
	};
}
function appendSelectedTranscriptReportInTransaction(database, resolved, appendParentId, report, projection, preparedMessage) {
	if (report.kind === "assistant") {
		appendTranscriptMessageInTransaction(database, resolved, {
			message: preparedMessage?.persistedMessage ?? applyAssistantDeliveryDirectives(report.message),
			parentId: appendParentId
		}, preparedMessage, projection);
		return;
	}
	ensureTranscriptHeader(database, resolved, void 0);
	const event = JSON.parse(report.eventJson);
	if (!appendTranscriptEventInTransaction(database, resolved, event, {
		...projection,
		eventJson: report.eventJson
	})) throw new Error("Session transcript report was not appended");
}
//#endregion
export { prepareCustomTranscriptReport as n, prepareTranscriptReportSelection as r, appendSelectedTranscriptReportInTransaction as t };
