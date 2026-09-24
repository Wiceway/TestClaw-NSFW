import { a as asOptionalRecord, c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.js";
import { _ as parseDateStringTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-DsCfAx8q.js";
import { n as sanitizeTerminalText } from "./safe-text-CXEZaOnt.js";
import { A as writeExternalFileWithinRoot, o as ensureAbsoluteDirectory } from "./fs-safe-CZ3jhUUr.js";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import { i as sha256File } from "./crypto-digest-BPwjfEnk.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { m as iterateAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Cg9RiSzs.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { t as createAssistantStateSchemaEnsurer } from "./testclaw-state-feature-schema-Du6iKbeX.js";
import { t as withAssistantStateLease } from "./testclaw-state-lease-C24liE0k.js";
import { i as TRANSCRIPTS_RESULT_MAX_BYTES, t as TRANSCRIPTS_EXPORT_MAX_BYTES } from "./transcripts-DaKHzsRn.js";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-wDsLTqFd.js";
import { constants } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import "node:util";
import { expressionBuilder } from "kysely";
//#region src/transcripts/store-errors.ts
var TranscriptsSummaryChangedError = class extends Error {
	constructor() {
		super("Transcript changed while generating notes; summarize it again.");
	}
};
var TranscriptSessionConflictError = class extends Error {
	constructor() {
		super("Transcript session ID conflicts with another capture on this date; use a new ID.");
		this.name = "TranscriptSessionConflictError";
	}
};
//#endregion
//#region src/transcripts/summary.ts
const ACTION_PATTERNS = /\b(todo|action|follow up|follow-up|assign|owner|next step|ship|fix|send|schedule)\b/i;
const DECISION_PATTERNS = /\b(decided|decision|we will|we'll|agreed|approved|go with|ship it)\b/i;
const RISK_PATTERNS = /\b(risk|blocked|blocker|concern|issue|problem|unknown|deadline|privacy|security)\b/i;
function firstSentences(utterances, limit) {
	const text = normalizeStringEntries(utterances.map((utterance) => utterance.text)).join(" ");
	const sentences = [];
	for (const match of text.matchAll(/[^.!?]+[.!?]?/g)) {
		sentences.push(match[0]);
		if (sentences.length >= limit) break;
	}
	return normalizeStringEntries(sentences).join(" ");
}
function collectMatches(utterances, pattern) {
	const matches = [];
	utterances.some((utterance) => {
		if (pattern.test(utterance.text)) {
			const line = formatSpeakerLine(utterance);
			if (line) matches.push(line);
		}
		return matches.length >= 12;
	});
	return matches;
}
function sanitizeUtterance(utterance) {
	const sanitized = {
		...utterance,
		text: sanitizeTerminalText(utterance.text)
	};
	if (utterance.speaker) sanitized.speaker = {
		...utterance.speaker,
		label: sanitizeTerminalText(utterance.speaker.label)
	};
	return sanitized;
}
function formatSpeakerLine(utterance) {
	const text = utterance.text.trim();
	if (!text) return "";
	const speaker = utterance.speaker?.label?.trim();
	return speaker ? `${speaker}: ${text}` : text;
}
/** Build a deterministic summary from transcript utterances. */
function summarizeTranscripts(params) {
	const title = sanitizeTerminalText(params.session.title ?? "").trim() || "Transcripts";
	const utterances = params.utterances.map(sanitizeUtterance).filter((utterance) => !isTranscriptArtifactText(utterance.text));
	const overview = firstSentences(utterances, 4) || "No transcript captured yet.";
	return {
		sessionId: params.session.sessionId,
		title,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		overview,
		participants: normalizeUniqueStringEntries(utterances.map((utterance) => utterance.speaker?.label ?? "")),
		source: "heuristic",
		transcript: utterances.map(formatSpeakerLine).filter(Boolean),
		decisions: collectMatches(utterances, DECISION_PATTERNS),
		actionItems: collectMatches(utterances, ACTION_PATTERNS),
		risks: collectMatches(utterances, RISK_PATTERNS),
		utteranceCount: params.utterances.length
	};
}
function renderList(items) {
	return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None captured";
}
/** Render a transcript summary as markdown for local artifacts. */
function renderTranscriptsMarkdown(summary) {
	return [
		`# ${summary.title}`,
		"",
		`Generated: ${summary.generatedAt}`,
		`Session: ${sanitizeTerminalText(summary.sessionId)}`,
		"",
		"## Overview",
		summary.overview,
		"",
		"## Participants",
		renderList(summary.participants ?? []),
		"",
		"## Decisions",
		renderList(summary.decisions),
		"",
		"## Action Items",
		renderList(summary.actionItems),
		"",
		"## Risks",
		renderList(summary.risks),
		"",
		"## Transcript",
		renderList(summary.transcript),
		"",
		`Transcript utterances: ${summary.utteranceCount}`
	].join("\n");
}
//#endregion
//#region src/transcripts/sqlite-schema.ts
const ensureMeetingTranscriptsSchema = createAssistantStateSchemaEnsurer({
	table: "meeting_transcript_sessions",
	endMarker: "  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n",
	operationLabel: "meeting-transcripts.schema.ensure"
});
const TRANSCRIPT_EXPORT_FILE_NAMES = /* @__PURE__ */ new Set([
	"metadata.json",
	"summary.json",
	"summary.md",
	"transcript.jsonl"
]);
function safeTranscriptPathSegment(value) {
	let segment = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
	if (!segment) return "session";
	if (segment.endsWith(".") || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu.test(segment)) segment = Buffer.from(segment, "utf8").toString("hex").match(/.{2}/gu).map((byte) => `%${byte.toUpperCase()}`).join("");
	if (segment.length > 255) {
		const suffix = `-${sha256Hex(value)}`;
		return `${segment.slice(0, 255 - suffix.length)}${suffix}`;
	}
	return segment;
}
function legacyTranscriptPathSegment(value) {
	return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "session";
}
function dateSegment(value) {
	return value?.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function transcriptSessionSelector(session) {
	return `${dateSegment(session.startedAt)}/${safeTranscriptPathSegment(session.sessionId)}`;
}
function legacyTranscriptSessionSelector(session) {
	const date = dateSegment(session.startedAt);
	const segment = legacyTranscriptPathSegment(session.sessionId);
	if (segment.length > 255) return;
	if (segment === ".") return date;
	if (segment === "..") return ".";
	return `${date}/${segment}`;
}
function transcriptSessionExportKey(session) {
	return transcriptSessionSelector(session).toLowerCase();
}
function normalizeExportText(value) {
	return value.endsWith("\n") ? value : `${value}\n`;
}
async function writeTranscriptArtifact(rootDir, fileName, content) {
	await writeExternalFileWithinRoot({
		rootDir,
		path: fileName,
		write: async (tempPath) => await fs$1.writeFile(tempPath, content, { mode: 384 })
	});
	return sha256Hex(content);
}
async function removeTranscriptArtifact(rootDir, fileName) {
	await removePathWithinRoot({
		rootDir,
		relativePath: fileName,
		force: true
	});
}
async function isCaseSensitiveDirectory(directory) {
	const probeName = `.testclaw-case-probe-${randomUUID().toLowerCase()}`;
	const probePath = path.join(directory, probeName);
	const alternatePath = path.join(directory, probeName.toUpperCase());
	await (await fs$1.open(probePath, "wx", 384)).close();
	try {
		try {
			await fs$1.access(alternatePath);
			return false;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
			throw error;
		}
	} finally {
		await fs$1.rm(probePath, { force: true });
	}
}
//#endregion
//#region src/transcripts/store-date-preparation.ts
/** Native Date parsing belongs to the caller: skills can temporarily change its timezone. */
function prepareTranscriptDateReader(assertOwner, databasePath) {
	const timezone = process.env.TZ;
	let usedCallerTimezone = false;
	const assertCurrent = () => {
		assertOwner();
		if (usedCallerTimezone && process.env.TZ !== timezone) throw new Error("Transcript timezone changed while reading; retry the read.");
	};
	return {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				const facts = request.facts;
				if (request.stage !== "prepare" || !isRecord(facts) || facts.kind !== "transcript-date" || typeof facts.value !== "string" || Buffer.byteLength(facts.value, "utf8") > 1048576 || !(facts.result instanceof SharedArrayBuffer) || facts.result.byteLength !== Float64Array.BYTES_PER_ELEMENT) throw new Error("Invalid transcript date preparation request");
				usedCallerTimezone = true;
				assertCurrent();
				new Float64Array(facts.result)[0] = parseDateStringTimestampMs(facts.value) ?? NaN;
				grant();
			})
		})
	};
}
//#endregion
//#region src/transcripts/store-sqlite.ts
function meetingTranscriptDb(db) {
	return getNodeSqliteKysely(db);
}
function meetingTranscriptSessionQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt);
}
function transcriptSummaryInputRevisionFromRow(row) {
	return JSON.stringify({
		next_utterance_seq: row.next_utterance_seq,
		title: row.title,
		source_json: row.source_json,
		metadata_json: row.metadata_json,
		stopped_at: row.stopped_at
	});
}
function readTranscriptSummaryInputRevision(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select([
		"next_utterance_seq",
		"title",
		"source_json",
		"metadata_json",
		"stopped_at"
	]));
	return row ? transcriptSummaryInputRevisionFromRow(row) : void 0;
}
function meetingTranscriptUtteranceQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_utterances").where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt);
}
function parseOptionalJsonRecord(value) {
	if (!value) return;
	return asOptionalRecord(JSON.parse(value));
}
function sessionFromRow(row) {
	const source = parseOptionalJsonRecord(row.source_json);
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	if (!source || typeof source.providerId !== "string") throw new Error(`invalid meeting transcript source for ${row.session_id}`);
	return {
		sessionId: row.session_id,
		source,
		startedAt: row.started_at,
		...row.title !== null ? { title: row.title } : {},
		...row.stopped_at !== null ? { stoppedAt: row.stopped_at } : {},
		...metadata ? { metadata } : {}
	};
}
function utteranceFromRow(row) {
	const speaker = row.speaker_label !== null ? {
		label: row.speaker_label,
		...row.speaker_id !== null ? { id: row.speaker_id } : {}
	} : void 0;
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	return {
		sessionId: row.session_id,
		text: row.text,
		...row.utterance_id !== null ? { id: row.utterance_id } : {},
		...row.started_at !== null ? { startedAt: row.started_at } : {},
		...row.ended_at !== null ? { endedAt: row.ended_at } : {},
		...speaker ? { speaker } : {},
		...row.final === null ? {} : { final: row.final === 1 },
		...metadata ? { metadata } : {}
	};
}
//#endregion
//#region src/transcripts/store-export-jsonl.ts
const TRANSCRIPT_EXPORT_ROW_BATCH_SIZE = 64;
async function writeTranscriptJsonlArtifact(params) {
	ensureMeetingTranscriptsSchema(params.databaseOptions);
	const database = openAssistantStateDatabase(params.databaseOptions);
	const sequenceHead = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptSessionQuery(database.db, params.session).select("next_utterance_seq"))?.next_utterance_seq;
	if (sequenceHead === void 0) throw new Error(`transcripts session not found: ${params.session.sessionId}`);
	const digest = createHash("sha256");
	await writeExternalFileWithinRoot({
		rootDir: params.sessionDir,
		path: "transcript.jsonl",
		write: async (tempPath) => {
			const handle = await fs$1.open(tempPath, "w", 384);
			try {
				let nextSequence = 0;
				while (nextSequence < sequenceHead) {
					const rows = executeSqliteQuerySync(database.db, meetingTranscriptUtteranceQuery(database.db, params.session).selectAll().where("sequence", ">=", nextSequence).where("sequence", "<", sequenceHead).orderBy("sequence", "asc").limit(TRANSCRIPT_EXPORT_ROW_BATCH_SIZE)).rows;
					if (rows.length === 0) break;
					nextSequence = rows.at(-1).sequence + 1;
					const lines = rows.map((row) => `${JSON.stringify(utteranceFromRow(row))}\n`);
					for (const line of lines) {
						await handle.writeFile(line);
						digest.update(line);
					}
				}
			} finally {
				await handle.close();
			}
		}
	});
	return digest.digest("hex");
}
//#endregion
//#region src/transcripts/store-export-state.ts
function parseTranscriptExportManifest(json) {
	const value = JSON.parse(json);
	if (!isStringRecord(value)) throw new TypeError("Invalid transcript export manifest: expected an object of strings.");
	return value;
}
function parseTranscriptPendingExports(json) {
	const value = JSON.parse(json);
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) throw new TypeError("Invalid pending transcript exports: expected an array of strings.");
	return new Set(value);
}
//#endregion
//#region src/transcripts/store-export-ownership.ts
async function transcriptArtifactsMatchOwner(sessionDir, artifacts, owner) {
	const manifest = parseTranscriptExportManifest(owner.export_manifest_json);
	const pending = parseTranscriptPendingExports(owner.export_pending_json);
	for (const { entry, canonicalName } of artifacts) {
		const artifactPath = path.join(sessionDir, entry.name);
		const stat = await fs$1.lstat(artifactPath);
		const expectedHash = manifest[canonicalName];
		if (stat.isSymbolicLink() || !stat.isFile() || pending.has(canonicalName) || !expectedHash || await sha256File(artifactPath) !== expectedHash) return false;
	}
	return artifacts.length > 0;
}
async function assertTranscriptExportPathAvailable(params) {
	const { collisions } = params;
	if (collisions.length <= 1) return;
	const ensured = await ensureAbsoluteDirectory(params.exportRootDir, {
		mode: 448,
		scopeLabel: "transcript export root"
	});
	if (!ensured.ok) throw ensured.error;
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return;
	let ownerSelector;
	try {
		const metadata = JSON.parse(await fs$1.readFile(path.join(params.exportRootDir, collisions[0].selector, "metadata.json"), "utf8"));
		ownerSelector = collisions.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt)?.selector;
	} catch (error) {
		if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
			if (!(error instanceof SyntaxError)) throw error;
		}
	}
	if (!ownerSelector) {
		const pendingOwners = collisions.filter((row) => parseTranscriptPendingExports(row.export_pending_json).has("metadata.json"));
		if (pendingOwners.length === 1) ownerSelector = pendingOwners[0]?.selector;
	}
	ownerSelector ??= params.selector;
	if (ownerSelector !== params.selector) throw new Error(`transcript export path collides case-insensitively with another session: ${path.join(params.exportRootDir, params.selector)}`);
}
async function hasAliasedCanonicalTranscriptExportPathOwner(params) {
	const { owners } = params;
	if (owners.length === 0) return false;
	try {
		await fs$1.access(params.exportRootDir);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
		throw error;
	}
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return false;
	const sessionDir = path.join(params.exportRootDir, params.selector);
	let entries;
	try {
		entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
		throw error;
	}
	const artifactCaseSensitive = await isCaseSensitiveDirectory(sessionDir);
	const artifacts = entries.flatMap((entry) => {
		const canonicalName = artifactCaseSensitive ? entry.name : entry.name.toLowerCase();
		return TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName) ? [{
			entry,
			canonicalName
		}] : [];
	});
	if (artifacts.length === 0) return true;
	let owner;
	const metadataArtifact = artifacts.find(({ canonicalName }) => canonicalName === "metadata.json");
	if (metadataArtifact) {
		const metadataPath = path.join(sessionDir, metadataArtifact.entry.name);
		const metadataStat = await fs$1.lstat(metadataPath);
		if (metadataStat.isSymbolicLink() || !metadataStat.isFile()) return false;
		let handle;
		try {
			handle = await fs$1.open(metadataPath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			const metadata = JSON.parse(await handle.readFile("utf8"));
			owner = owners.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt);
		} catch {
			return false;
		} finally {
			await handle?.close();
		}
	}
	if (!owner && !metadataArtifact) {
		const manifestMatches = [];
		for (const candidate of owners) if (await transcriptArtifactsMatchOwner(sessionDir, artifacts, candidate)) manifestMatches.push(candidate);
		owner = manifestMatches.length === 1 ? manifestMatches[0] : void 0;
	}
	return owner !== void 0 && await transcriptArtifactsMatchOwner(sessionDir, artifacts, owner);
}
//#endregion
//#region src/transcripts/store-read.ts
var TranscriptLibraryError = class extends Error {
	constructor(type, message, maxBytes) {
		super(message);
		this.type = type;
		this.maxBytes = maxBytes;
	}
};
function cursorScope(values) {
	return createHash("sha256").update(JSON.stringify(values)).digest("hex");
}
function encodeCursor(scope, position) {
	return Buffer.from(JSON.stringify([
		1,
		scope,
		...position
	])).toString("base64url");
}
function decodeCursor(cursor, scope) {
	if (cursor === void 0) return;
	try {
		if (cursor.length > 1048576 || !/^[A-Za-z0-9_-]+$/u.test(cursor)) throw new Error();
		const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (Array.isArray(value) && value[0] === 1 && value[1] === scope) return value.slice(2);
	} catch {}
	throw new TranscriptLibraryError("transcript_invalid_cursor", "Invalid transcript cursor; restart pagination with the current filters.");
}
function transcriptPageLimit(limit = 50, max = 100) {
	if (!Number.isInteger(limit) || limit < 1 || limit > max) throw new TranscriptLibraryError("transcript_invalid_filter", `Transcript page limit must be between 1 and ${max}.`);
	return limit;
}
function assertTranscriptByteLimit(text, maxBytes = TRANSCRIPTS_RESULT_MAX_BYTES, exporting = false) {
	assertTranscriptByteCount(Buffer.byteLength(text, "utf8"), maxBytes, exporting);
}
function assertTranscriptByteCount(bytes, maxBytes = TRANSCRIPTS_RESULT_MAX_BYTES, exporting = false) {
	if (bytes > maxBytes) throw new TranscriptLibraryError(exporting ? "transcript_export_too_large" : "transcript_result_too_large", exporting ? "Transcript exceeds the download limit; use a local transcript export." : "Transcript response exceeds the read limit; request a smaller page or use a local transcript export.", maxBytes);
}
function byteLimit(purpose) {
	return purpose === "legacy" ? void 0 : purpose === "export" ? TRANSCRIPTS_EXPORT_MAX_BYTES : TRANSCRIPTS_RESULT_MAX_BYTES;
}
function assertReadBytes(bytes, purpose) {
	const maxBytes = byteLimit(purpose);
	if (maxBytes !== void 0) assertTranscriptByteCount(bytes, maxBytes, purpose === "export");
}
function textBytes(...values) {
	const eb = expressionBuilder();
	const bytes = values.reduce((sum, value) => eb(sum, "+", eb.fn.coalesce(eb.fn("octet_length", [value]), eb.val(0))), eb.val(0));
	return eb.parens(bytes);
}
function boundedText(value, bytes, maxBytes) {
	if (maxBytes === void 0) return expressionBuilder().parens(value);
	return expressionBuilder().case().when(bytes, "<=", maxBytes).then(value).else("").end();
}
function readQuery(database, query, purpose = "page") {
	const eb = expressionBuilder(query);
	const notes = eb.selectFrom("meeting_transcript_summaries as notes").whereRef("notes.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("notes.session_started_at", "=", "meeting_transcript_sessions.started_at");
	const overview = notes.select((n) => n.fn("json_extract", [n.ref("notes.summary_json"), n.val("$.overview")]).as("overview")).$asScalar();
	const summarySource = notes.select((n) => n.fn("json_extract", [n.ref("notes.summary_json"), n.val("$.source")]).as("source")).$asScalar();
	const utterances = eb.selectFrom("meeting_transcript_utterances as u").whereRef("u.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("u.session_started_at", "=", "meeting_transcript_sessions.started_at");
	const speakers = utterances.select("u.speaker_label").where("u.speaker_label", "is not", null).where("u.speaker_label", "!=", "").groupBy("u.speaker_label").orderBy((u) => u.fn.min("u.sequence"), "asc");
	const participants = eb.selectFrom(speakers.as("speakers")).select((s) => s.fn("json_group_array", [s.ref("speakers.speaker_label")]).as("participants")).$asScalar();
	const lastAt = utterances.select((u) => u.fn.coalesce("u.ended_at", "u.started_at").as("at")).orderBy("u.sequence", "desc").limit(1).$asScalar();
	const identityBytes = textBytes(eb.ref("session_id"), eb.ref("started_at"), eb.ref("selector"));
	const bytes = textBytes(eb.ref("session_id"), eb.ref("started_at"), eb.ref("selector"), eb.ref("source_json"), eb.ref("metadata_json"), eb.ref("title"), eb.ref("stopped_at"), lastAt, overview, summarySource, participants);
	const maxBytes = byteLimit(purpose);
	const columns = (payloadBytes) => [
		boundedText(eb.ref("session_id"), identityBytes, maxBytes).as("session_id"),
		boundedText(eb.ref("started_at"), identityBytes, maxBytes).as("started_at"),
		boundedText(eb.ref("selector"), identityBytes, maxBytes).as("selector"),
		boundedText(eb.ref("source_json"), payloadBytes, maxBytes).as("source_json"),
		boundedText(eb.ref("metadata_json"), payloadBytes, maxBytes).as("metadata_json"),
		boundedText(eb.ref("title"), payloadBytes, maxBytes).as("title"),
		boundedText(eb.ref("stopped_at"), payloadBytes, maxBytes).as("stopped_at"),
		boundedText(lastAt, payloadBytes, maxBytes).as("last_utterance_at"),
		boundedText(overview, payloadBytes, maxBytes).as("overview"),
		boundedText(summarySource, payloadBytes, maxBytes).as("summary_source"),
		boundedText(participants, payloadBytes, maxBytes).as("participants_json"),
		eb.parens(payloadBytes).as("payload_bytes"),
		identityBytes.as("identity_bytes"),
		utterances.select((u) => u.fn.countAll().as("count")).$asScalar().as("utterance_count"),
		"updated_at_ms",
		eb.exists(notes.select("notes.session_id")).as("has_summary")
	];
	if (maxBytes === void 0) return query.select(columns(bytes));
	return meetingTranscriptDb(database).with((cte) => cte("read_sizes").materialized(), () => query.select([
		"session_id as read_session_id",
		"started_at as read_started_at",
		bytes.as("payload_bytes")
	])).selectFrom("read_sizes").innerJoin("meeting_transcript_sessions", (join) => join.onRef("meeting_transcript_sessions.session_id", "=", "read_sizes.read_session_id").onRef("meeting_transcript_sessions.started_at", "=", "read_sizes.read_started_at")).select((sizes) => columns(sizes.ref("read_sizes.payload_bytes")));
}
function transcriptReadEntryFromRow(row, purpose = "page") {
	assertReadBytes(row.payload_bytes, purpose);
	const session = sessionFromRow(row);
	const summarySource = row.summary_source === "model" || row.summary_source === "heuristic" ? row.summary_source : void 0;
	return {
		session,
		selector: row.selector,
		hasSummary: Boolean(row.has_summary),
		utteranceCount: row.utterance_count,
		participants: JSON.parse(row.participants_json ?? "[]"),
		overview: typeof row.overview === "string" ? row.overview : void 0,
		summarySource,
		updatedAt: new Date(row.updated_at_ms).toISOString(),
		lastUtteranceAt: row.last_utterance_at ?? null
	};
}
const dateReaders = /* @__PURE__ */ new WeakSet();
const dateParser = new AsyncLocalStorage();
function parseTranscriptDate(value) {
	return (dateParser.getStore() ?? parseDateStringTimestampMs)(value);
}
function registerTranscriptDateReader(database) {
	if (dateReaders.has(database)) return;
	database.function("testclaw_transcript_date_ms", (value) => parseTranscriptDate(value) ?? null);
	dateReaders.add(database);
}
function transcriptStartTime(startedAt) {
	const eb = expressionBuilder();
	return eb.case().when(eb.fn("octet_length", [startedAt]), "<=", TRANSCRIPTS_RESULT_MAX_BYTES).then(eb.fn("testclaw_transcript_date_ms", [startedAt])).end();
}
/** Chronological key selection scans candidates; filters never turn into ownership. */
function* iterateTranscriptReadEntries(database, options) {
	const limit = transcriptPageLimit(options.limit, 200);
	registerTranscriptDateReader(database);
	let query = meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions");
	if (options.session) query = query.where("session_id", "=", options.session.sessionId).where("started_at", "=", options.session.startedAt);
	if (options.offset !== void 0) query = query.offset(options.offset);
	if (options.providerId) query = query.where("provider_id", "=", options.providerId);
	if (options.accountId) {
		const accountId = options.accountId;
		query = query.where((eb) => eb(eb.fn("json_extract", [eb.ref("source_json"), eb.val("$.accountId")]), "=", accountId));
	}
	if (options.agentId) {
		const agentId = options.agentId;
		query = query.where((eb) => eb(eb.fn("json_extract", [eb.ref("metadata_json"), eb.val("$.agentId")]), "=", agentId));
	}
	if (options.startedAfter) {
		const startedAfter = parseTranscriptDate(options.startedAfter) ?? null;
		query = query.where((eb) => eb(transcriptStartTime(eb.ref("started_at")), ">=", startedAfter));
	}
	if (options.startedBefore) {
		const startedBefore = parseTranscriptDate(options.startedBefore) ?? null;
		query = query.where((eb) => eb(transcriptStartTime(eb.ref("started_at")), "<", startedBefore));
	}
	if (options.after) {
		const after = options.after;
		const afterTime = parseTranscriptDate(after.startedAt);
		query = query.where((eb) => {
			const time = transcriptStartTime(eb.ref("started_at"));
			const afterIdentity = eb(eb.refTuple("session_id", "started_at"), ">", eb.tuple(after.sessionId, after.startedAt));
			return afterTime === void 0 ? eb.and([eb(time, "is", null), afterIdentity]) : eb.or([
				eb(time, "<", afterTime),
				eb(time, "is", null),
				eb.and([eb(time, "=", afterTime), afterIdentity])
			]);
		});
	}
	if (options.query) {
		const search = options.query;
		query = query.where((eb) => {
			const matches = (field) => eb(eb.fn("instr", [eb.fn("lower", [field]), eb.fn("lower", [eb.val(search)])]), ">", 0);
			const fields = [
				eb.ref("title"),
				eb.ref("session_id"),
				eb.ref("provider_id"),
				...[
					"accountId",
					"guildId",
					"channelId",
					"threadTs",
					"fileId"
				].map((key) => eb.fn("json_extract", [eb.ref("source_json"), eb.val(`$.${key}`)]))
			];
			return eb.or([
				...fields.map(matches),
				eb.exists(eb.selectFrom("meeting_transcript_summaries as notes").select("notes.session_id").whereRef("notes.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("notes.session_started_at", "=", "meeting_transcript_sessions.started_at").where((notes) => notes.or([matches(notes.ref("notes.markdown")), matches(notes.fn("json_extract", [notes.ref("notes.summary_json"), notes.val("$.overview")]))]))),
				eb.exists(eb.selectFrom("meeting_transcript_utterances as utterance").select("utterance.session_id").whereRef("utterance.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("utterance.session_started_at", "=", "meeting_transcript_sessions.started_at").where((utterance) => matches(utterance.ref("utterance.text"))))
			]);
		});
	}
	const keys = query.select(["session_id", "started_at"]).orderBy((eb) => transcriptStartTime(eb.ref("started_at")), "desc").orderBy("session_id", "asc").orderBy("started_at", "asc").limit(limit + 1);
	const rows = iterateSqliteQuerySync(database, readQuery(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where((eb) => eb(eb.refTuple("session_id", "started_at"), "in", keys.$asTuple("session_id", "started_at")))).orderBy((eb) => transcriptStartTime(eb.ref("meeting_transcript_sessions.started_at")), "desc").orderBy("meeting_transcript_sessions.session_id", "asc").orderBy("meeting_transcript_sessions.started_at", "asc"));
	let count = 0;
	for (const row of rows) {
		if (count++ === limit) return true;
		yield transcriptReadEntryFromRow(row);
	}
	return false;
}
/** Selectors are unique; identity and payload bounds remain in the same SQLite statement. */
function readTranscriptEntry(database, selector, purpose = "page") {
	const row = executeSqliteQueryTakeFirstSync(database, readQuery(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("selector", "=", selector), purpose));
	if (!row) return;
	assertReadBytes(row.identity_bytes, purpose);
	return row.selector === selector ? transcriptReadEntryFromRow(row, purpose) : void 0;
}
function utteranceQuery(database, session, purpose) {
	return meetingTranscriptUtteranceQuery(database, session).select((eb) => {
		const maxBytes = byteLimit(purpose);
		const utteranceId = purpose === "legacy" ? eb.val(null) : eb.ref("utterance_id");
		const bytes = textBytes(utteranceId, eb.ref("started_at"), eb.ref("ended_at"), eb.ref("speaker_id"), eb.ref("speaker_label"), eb.ref("text"));
		return [
			boundedText(utteranceId, bytes, maxBytes).as("utterance_id"),
			boundedText(eb.ref("started_at"), bytes, maxBytes).as("started_at"),
			boundedText(eb.ref("ended_at"), bytes, maxBytes).as("ended_at"),
			boundedText(eb.ref("speaker_id"), bytes, maxBytes).as("speaker_id"),
			boundedText(eb.ref("speaker_label"), bytes, maxBytes).as("speaker_label"),
			boundedText(eb.ref("text"), bytes, maxBytes).as("text"),
			bytes.as("payload_bytes"),
			"sequence",
			"final"
		];
	});
}
function transcriptReadUtteranceFromRow(row) {
	return {
		sequence: row.sequence,
		id: row.utterance_id ?? void 0,
		startedAt: row.started_at ?? void 0,
		endedAt: row.ended_at ?? void 0,
		speakerId: row.speaker_id ?? void 0,
		speakerLabel: row.speaker_label ?? void 0,
		text: row.text,
		final: row.final === null ? void 0 : row.final === 1
	};
}
/** Omit the duplicated transcript inside SQLite before materializing the stored summary. */
function readStoredTranscriptNotes(database, session, purpose = "page") {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").select((eb) => {
		const summary = eb.fn("json_remove", [eb.ref("summary_json"), eb.val("$.transcript")]);
		const bytes = textBytes(summary, eb.ref("markdown"));
		return [
			boundedText(summary, bytes, byteLimit(purpose)).as("summary"),
			boundedText(eb.ref("markdown"), bytes, byteLimit(purpose)).as("markdown"),
			bytes.as("payload_bytes")
		];
	}).where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
	if (!row) return {};
	assertReadBytes(row.payload_bytes, purpose);
	let summary;
	if (row.summary) summary = JSON.parse(row.summary);
	return {
		summary,
		markdown: row.markdown ?? void 0
	};
}
function requireTranscriptReadEntry(database, selector, purpose) {
	const entry = readTranscriptEntry(database, selector, purpose);
	if (!entry) throw new TranscriptLibraryError("transcript_session_not_found", "Transcript not found; refresh the library and use its full selector.");
	return entry;
}
/** Stream canonical rows and notes in the caller's read snapshot without materializing files. */
function* iterateTranscriptExport(database, selector, includeNotes) {
	const entry = requireTranscriptReadEntry(database, selector, "export");
	for (const row of iterateSqliteQuerySync(database, utteranceQuery(database, entry.session, "export").orderBy("sequence", "asc"))) {
		assertTranscriptByteCount(row.payload_bytes, TRANSCRIPTS_EXPORT_MAX_BYTES, true);
		yield transcriptReadUtteranceFromRow(row);
	}
	return {
		entry,
		notes: includeNotes ? readStoredTranscriptNotes(database, entry.session, "export") : void 0
	};
}
//#endregion
//#region src/transcripts/store-sqlite-write.ts
function assertMeetingTranscriptSelectorAvailableInDatabase(database, session, selector) {
	const owner = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().where("selector", "=", selector));
	if (owner && (owner.session_id !== session.sessionId || owner.started_at !== session.startedAt)) throw new TranscriptSessionConflictError();
}
function writeMeetingTranscriptSessionInDatabase(database, params) {
	const { session, sessionValues, now, expectedInputRevision } = params;
	if (expectedInputRevision !== void 0 && readTranscriptSummaryInputRevision(database, session) !== expectedInputRevision) throw new TranscriptsSummaryChangedError();
	assertMeetingTranscriptSelectorAvailableInDatabase(database, session, sessionValues.selector);
	const previous = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
	if (previous) {
		const admittedMetadata = sessionFromRow(previous).metadata;
		let metadata = session.metadata ? { ...session.metadata } : void 0;
		if (admittedMetadata && Object.hasOwn(admittedMetadata, "sessionIdOrigin")) metadata = {
			...metadata,
			sessionIdOrigin: admittedMetadata.sessionIdOrigin
		};
		else if (metadata) delete metadata.sessionIdOrigin;
		sessionValues.metadata_json = metadata ? JSON.stringify(metadata) : null;
	}
	executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_sessions").values({
		session_id: session.sessionId,
		started_at: session.startedAt,
		...sessionValues,
		export_manifest_json: "{}",
		export_pending_json: "[]",
		next_utterance_seq: 0,
		created_at_ms: now,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.columns(["session_id", "started_at"]).doUpdateSet({
		...sessionValues,
		updated_at_ms: now
	})));
}
function updateMeetingTranscriptExportState(database, session, update) {
	const stored = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select(["export_manifest_json", "export_pending_json"]));
	executeSqliteQuerySync(database, meetingTranscriptDb(database).updateTable("meeting_transcript_sessions").set(update(stored)).where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt));
}
function updateMeetingTranscriptExportManifestInDatabase(database, session, exportedHashes, removedExports) {
	updateMeetingTranscriptExportState(database, session, (stored) => {
		const manifest = stored ? parseTranscriptExportManifest(stored.export_manifest_json) : {};
		const pending = stored ? parseTranscriptPendingExports(stored.export_pending_json) : /* @__PURE__ */ new Set();
		for (const fileName of removedExports) delete manifest[fileName];
		for (const fileName of [...Object.keys(exportedHashes), ...removedExports]) pending.delete(fileName);
		return {
			export_manifest_json: JSON.stringify({
				...manifest,
				...exportedHashes
			}),
			export_pending_json: JSON.stringify([...pending].toSorted())
		};
	});
}
function markMeetingTranscriptPendingExportsInDatabase(database, session, fileNames) {
	updateMeetingTranscriptExportState(database, session, (stored) => {
		if (!stored) throw new Error(`transcripts session not found: ${session.sessionId}`);
		const pending = parseTranscriptPendingExports(stored.export_pending_json);
		for (const fileName of fileNames) pending.add(fileName);
		return { export_pending_json: JSON.stringify([...pending].toSorted()) };
	});
}
//#endregion
//#region src/transcripts/store.ts
/** Canonical meeting-capture transcript store. Files are explicit exports only. */
var TranscriptsStore = class {
	constructor(exportRootDir, databaseOptions = {}) {
		this.exportRootDir = exportRootDir;
		this.databaseOptions = databaseOptions;
	}
	database() {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		return openAssistantStateDatabase(this.databaseOptions);
	}
	transaction(operationLabel, operation) {
		runAssistantStateWriteTransaction(operation, this.databaseOptions, { operationLabel });
	}
	sessionDir(session) {
		return path.join(this.exportRootDir, transcriptSessionSelector(session));
	}
	async readWorker(type, request) {
		const context = captureAssistantStateWorkerContext(this.databaseOptions);
		const input = structuredClone(request);
		input.readOnly = this.databaseOptions.readOnly;
		const preparation = type === "transcripts.readEntries" ? prepareTranscriptDateReader(context.admission.assertCurrent, context.admission.databasePath) : void 0;
		const result = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type,
			input
		}), preparation);
		context.admission.assertCurrent();
		preparation?.assertCurrent();
		if (!result.ok) throw new TranscriptLibraryError(result.error.type, result.error.message, result.error.maxBytes);
		return result.value;
	}
	entryFromSession(session, selector, hasSummary) {
		const sessionDir = this.sessionDir(session);
		return {
			session,
			sessionDir,
			selector,
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary
		};
	}
	async readExportOwnership(session) {
		const row = await this.readWorker("transcripts.exportOwnership", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
		return row ? {
			manifest: parseTranscriptExportManifest(row.export_manifest_json),
			pending: parseTranscriptPendingExports(row.export_pending_json)
		} : {
			manifest: {},
			pending: /* @__PURE__ */ new Set()
		};
	}
	async readSessionByIdentity({ sessionId, startedAt }) {
		return this.readWorker("transcripts.session", { params: { session: {
			sessionId,
			startedAt
		} } });
	}
	async expectedExportHashes(session) {
		const storedSession = await this.readSessionByIdentity(session);
		if (!storedSession) return {};
		const hashes = {
			"metadata.json": sha256Hex(`${JSON.stringify(storedSession, null, 2)}\n`),
			"transcript.jsonl": await this.readWorker("transcripts.exportDigest", { params: { session: {
				sessionId: storedSession.sessionId,
				startedAt: storedSession.startedAt
			} } })
		};
		const summary = await this.readSummary(storedSession);
		if (summary.summary) hashes["summary.json"] = sha256Hex(`${JSON.stringify(summary.summary, null, 2)}\n`);
		if (summary.markdown !== void 0) hashes["summary.md"] = sha256Hex(normalizeExportText(summary.markdown));
		return hashes;
	}
	updateExportManifest(session, exportedHashes, removedExports = /* @__PURE__ */ new Set()) {
		this.transaction("meeting-transcripts.export.record", ({ db }) => {
			updateMeetingTranscriptExportManifestInDatabase(db, session, exportedHashes, removedExports);
		});
	}
	markPendingExports(session, fileNames) {
		this.transaction("meeting-transcripts.export.pending", ({ db }) => {
			markMeetingTranscriptPendingExportsInDatabase(db, session, fileNames);
		});
	}
	async assertExportDestinationOwned(session, sessionDir = this.sessionDir(session)) {
		let entries;
		try {
			entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
			throw error;
		}
		const ownership = await this.readExportOwnership(session);
		const caseSensitive = await isCaseSensitiveDirectory(sessionDir);
		let expectedHashes;
		const repairedHashes = {};
		for (const entry of entries) {
			const canonicalName = caseSensitive ? entry.name : entry.name.toLowerCase();
			if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName)) continue;
			const filePath = path.join(sessionDir, entry.name);
			const stat = await fs$1.lstat(filePath);
			if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run testclaw doctor --fix`);
			const actualHash = await sha256File(filePath);
			if (ownership.manifest[canonicalName] === actualHash || ownership.pending.has(canonicalName)) continue;
			expectedHashes ??= await this.expectedExportHashes(session);
			if (expectedHashes[canonicalName] !== actualHash) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run testclaw doctor --fix`);
			repairedHashes[canonicalName] = actualHash;
		}
		if (Object.keys(repairedHashes).length > 0) this.updateExportManifest(session, repairedHashes);
	}
	async listSessionEntries() {
		return (await this.readWorker("transcripts.sessionEntries", { params: void 0 })).map(({ session, selector, hasSummary }) => this.entryFromSession(session, selector, hasSummary));
	}
	async *iterateReadEntries(options = {}) {
		return yield* iterateAssistantStateDatabaseReadOnly(this.database(), ({ db }) => iterateTranscriptReadEntries(db, options), this.databaseOptions.env);
	}
	async readEntry(selector, purpose = "page") {
		return this.readWorker("transcripts.entry", { params: {
			selector,
			purpose
		} });
	}
	async readLatestEntry() {
		return this.readWorker("transcripts.latest", { params: void 0 });
	}
	async readNotes(session, purpose = "page") {
		return this.readWorker("transcripts.notes", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			purpose
		} });
	}
	async readLibraryEntry(params) {
		return this.readWorker("transcripts.libraryEntry", { params });
	}
	async *iterateExport(selector, includeNotes) {
		return yield* iterateAssistantStateDatabaseReadOnly(this.database(), ({ db }) => iterateTranscriptExport(db, selector, includeNotes), this.databaseOptions.env);
	}
	async readRecentStoppedSession(source, stoppedAfter, stoppedBefore) {
		return this.readWorker("transcripts.recentStopped", { params: {
			source,
			stoppedAfter,
			stoppedBefore
		} });
	}
	async readSummaryInputRevision(session) {
		return this.readWorker("transcripts.summaryRevision", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
	}
	summaryScope(session) {
		return JSON.stringify([
			path.resolve(this.databaseOptions.path ?? resolveAssistantStateSqlitePath(this.databaseOptions.env)),
			session.sessionId,
			session.startedAt
		]);
	}
	async readSummarySnapshot(session, maxUtterances) {
		return this.readWorker("transcripts.summarySnapshot", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			maxUtterances
		} });
	}
	async listReadEntries(options) {
		return this.readWorker("transcripts.readEntries", { params: options });
	}
	async writeSession(session, condition) {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		const selector = transcriptSessionSelector(session);
		assertMeetingTranscriptSelectorAvailableInDatabase(this.database().db, session, selector);
		if (!await this.readSessionByIdentity(session) && !await hasAliasedCanonicalTranscriptExportPathOwner({
			selector: transcriptSessionSelector(session),
			exportRootDir: this.exportRootDir,
			owners: await this.readWorker("transcripts.exportPathOwners", { params: { exportKey: transcriptSessionExportKey(session) } })
		})) {
			await this.assertExportDestinationOwned(session);
			const legacySelector = legacyTranscriptSessionSelector(session);
			if (legacySelector !== void 0) {
				const legacySessionDir = path.join(this.exportRootDir, legacySelector);
				const legacyRow = this.readCanonicalSelectorRow(this.database().db, legacySelector);
				const legacyOwner = legacyRow ? sessionFromRow(legacyRow) : void 0;
				const legacyPathIsCanonical = legacyOwner !== void 0 && path.resolve(this.sessionDir(legacyOwner)) === path.resolve(legacySessionDir);
				if (path.resolve(legacySessionDir) !== path.resolve(this.sessionDir(session)) && !legacyPathIsCanonical) await this.assertExportDestinationOwned(session, legacySessionDir);
			}
		}
		const sessionValues = {
			selector,
			export_key: transcriptSessionExportKey(session),
			session_slug: safeTranscriptPathSegment(session.sessionId),
			provider_id: session.source.providerId,
			title: session.title ?? null,
			source_json: JSON.stringify(session.source),
			stopped_at: session.stoppedAt ?? null,
			metadata_json: session.metadata ? JSON.stringify(session.metadata) : null
		};
		const now = Date.now();
		this.transaction("meeting-transcripts.session.write", ({ db: database }) => {
			condition?.assertCurrent?.();
			writeMeetingTranscriptSessionInDatabase(database, {
				session,
				sessionValues,
				now,
				expectedInputRevision: condition?.expectedInputRevision
			});
		});
	}
	async readSession(sessionSelector) {
		return (await this.readSessionEntry(sessionSelector))?.session;
	}
	async readSessionEntry(sessionSelector) {
		const { qualified, unqualified } = await this.matchSessionEntries(sessionSelector);
		const entries = qualified.length ? qualified : unqualified;
		if (entries.length > 1) throw new Error(`multiple transcripts sessions match ${sessionSelector}; use one of: ${entries.map((entry) => entry.selector).join(", ")}`);
		const matched = entries[0];
		if (!matched) return;
		const { inputRevision: _inputRevision, ...entry } = matched;
		return entry;
	}
	readCanonicalSelectorRow(database, selector) {
		return executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().where("selector", "=", selector));
	}
	async matchSessionEntries(value) {
		const matches = await this.readWorker("transcripts.matches", { params: { value } });
		const entry = (matched) => ({
			...this.entryFromSession(matched.session, matched.selector, matched.hasSummary),
			inputRevision: matched.inputRevision
		});
		return {
			qualified: matches.qualified.map(entry),
			unqualified: matches.unqualified.map(entry)
		};
	}
	async appendUtteranceForSession(session, utterance, schedule) {
		const context = captureAssistantStateWorkerContext(this.databaseOptions);
		const metadataJson = utterance.metadata ? JSON.stringify(utterance.metadata) : null;
		const now = Date.now();
		const speaker = utterance.speaker;
		const input = {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			utterance: {
				id: utterance.id,
				startedAt: utterance.startedAt,
				endedAt: utterance.endedAt,
				speaker: speaker ? {
					id: speaker.id,
					label: speaker.label
				} : void 0,
				text: utterance.text,
				final: utterance.final
			},
			metadataJson,
			now,
			readOnly: this.databaseOptions.readOnly
		};
		const append = (assertOwner) => {
			const assertCurrent = () => {
				context.admission.assertCurrent();
				assertOwner?.();
			};
			return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
				type: "transcripts.append",
				input
			}), {
				assertCurrent,
				createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
			});
		};
		await (schedule ? schedule(append) : append());
	}
	async readUtterancesForSession(session, options = {}) {
		return this.readWorker("transcripts.utterances", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			maxUtterances: options.maxUtterances
		} });
	}
	async writeSummary(summary, session, condition) {
		const context = captureAssistantStateWorkerContext(this.databaseOptions);
		const identity = {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		};
		const intendedSummaryPath = path.join(this.sessionDir(session), "summary.md");
		const assertOwner = condition?.assertCurrent;
		const guard = condition ? {
			inputRevision: condition.guard.inputRevision,
			nextSequence: condition.guard.nextSequence,
			summaryRevision: condition.guard.summaryRevision,
			allowAppends: condition.guard.allowAppends
		} : void 0;
		const summaryJson = JSON.stringify(summary);
		const markdown = renderTranscriptsMarkdown(summary);
		const input = {
			session: identity,
			summaryValues: {
				generated_at: summary.generatedAt,
				summary_json: summaryJson,
				markdown,
				utterance_count: summary.utteranceCount
			},
			guard,
			readOnly: this.databaseOptions.readOnly
		};
		const assertCurrent = () => {
			context.admission.assertCurrent();
			assertOwner?.();
		};
		if (!(await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type: "transcripts.writeSummary",
			input
		}), {
			assertCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
		})).ok) throw new TranscriptsSummaryChangedError();
		return intendedSummaryPath;
	}
	async readSummary(session) {
		return this.readWorker("transcripts.summary", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
	}
	async materializeSessionArtifacts(sessionOrSelector, kind) {
		const session = typeof sessionOrSelector === "string" ? await this.readSession(sessionOrSelector) : await this.readSessionByIdentity(sessionOrSelector);
		if (!session) {
			const selector = typeof sessionOrSelector === "string" ? sessionOrSelector : sessionOrSelector.sessionId;
			throw new Error(`transcripts session not found: ${selector}`);
		}
		return await withAssistantStateLease({
			scope: "meeting-transcript.export",
			key: transcriptSessionExportKey(session),
			database: {
				scope: "shared",
				options: this.databaseOptions
			},
			leaseMs: 6e4,
			waitMs: 1e4,
			leaseLabel: "meeting transcript export lease",
			operationLabel: "meeting-transcripts.export.lease"
		}, async () => await this.materializeSessionArtifactsOwned(session, kind));
	}
	async materializeSessionArtifactsOwned(session, kind) {
		const sessionDir = this.sessionDir(session);
		const includeTranscript = kind === "all" || kind === "transcript";
		const includeSummary = kind === "all" || kind === "summary";
		const storedSummary = includeSummary ? await this.readSummary(session) : {};
		const exportedHashes = {};
		const removedExports = /* @__PURE__ */ new Set();
		await assertTranscriptExportPathAvailable({
			selector: transcriptSessionSelector(session),
			exportRootDir: this.exportRootDir,
			collisions: await this.readWorker("transcripts.exportPathCollisions", { params: { exportKey: transcriptSessionExportKey(session) } })
		});
		await this.assertExportDestinationOwned(session);
		const pendingFiles = [
			"metadata.json",
			...includeTranscript ? ["transcript.jsonl"] : [],
			...includeSummary ? ["summary.json", "summary.md"] : []
		];
		this.markPendingExports(session, pendingFiles);
		const ensured = await ensureAbsoluteDirectory(sessionDir, {
			mode: 448,
			scopeLabel: "transcript export directory"
		});
		if (!ensured.ok) throw ensured.error;
		exportedHashes["metadata.json"] = await writeTranscriptArtifact(sessionDir, "metadata.json", `${JSON.stringify(session, null, 2)}\n`);
		if (includeTranscript) exportedHashes["transcript.jsonl"] = await writeTranscriptJsonlArtifact({
			sessionDir,
			session,
			databaseOptions: this.databaseOptions
		});
		if (includeSummary) {
			const summaries = {
				"summary.json": storedSummary.summary ? `${JSON.stringify(storedSummary.summary, null, 2)}\n` : void 0,
				"summary.md": storedSummary.markdown === void 0 ? void 0 : normalizeExportText(storedSummary.markdown)
			};
			for (const [fileName, content] of Object.entries(summaries)) if (content === void 0) {
				await removeTranscriptArtifact(sessionDir, fileName);
				removedExports.add(fileName);
			} else exportedHashes[fileName] = await writeTranscriptArtifact(sessionDir, fileName, content);
		}
		this.updateExportManifest(session, exportedHashes, removedExports);
		return {
			sessionDir,
			metadataPath: path.join(sessionDir, "metadata.json"),
			transcriptPath: path.join(sessionDir, "transcript.jsonl"),
			summaryJsonPath: path.join(sessionDir, "summary.json"),
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary: storedSummary.summary !== void 0 || storedSummary.markdown !== void 0
		};
	}
};
//#endregion
export { TranscriptSessionConflictError as _, cursorScope as a, sessionFromRow as c, safeTranscriptPathSegment as d, transcriptSessionExportKey as f, summarizeTranscripts as g, renderTranscriptsMarkdown as h, assertTranscriptByteLimit as i, TRANSCRIPT_EXPORT_FILE_NAMES as l, ensureMeetingTranscriptsSchema as m, TranscriptLibraryError as n, decodeCursor as o, transcriptSessionSelector as p, assertTranscriptByteCount as r, encodeCursor as s, TranscriptsStore as t, normalizeExportText as u, TranscriptsSummaryChangedError as v };
