import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { A as parseAgentSessionKey } from "./session-key-C_bfgyCp.mjs";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-DUH0XYlR.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory } from "./sqlite-source-handle-CDYF24uv.mjs";
import { u as transcriptEventNavigationSql } from "./transcript-payload-4tGRkf4_.mjs";
import { o as withScopedAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-scope-Bobfc9dO.mjs";
import { l as readSessionEntryRow, o as readExactSessionEntryRow, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import { l as readWithCanonicalSessionAdmission } from "./session-canonical-key-D8rnGIu3.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-BM_e7CiR.mjs";
import { i as readCurrentProjectionSnapshot, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-Va5SIRl2.mjs";
import { v as resolveVisibleMessagePositions } from "./session-accessor.sqlite-visible-cursor-Pf6cE4u6.mjs";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-CArwCLAv.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-C1C9rO5a.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CRXr1P1Q.mjs";
import { n as resolveGatewaySessionStoreReadResults } from "./session-utils-store-selection-REIu2JIa.mjs";
import { c as resolveHistoryMessageSequence, d as resolveVisibleHistoryRange, s as readTranscriptDisplayDeltaFromProjection, u as resolveVisibleHistoryProjection } from "./session-accessor.sqlite-history-query-BVn23SPt.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-dosxJqOy.mjs";
import { s as isSubagentCoordinationHistoryInput } from "./chat-display-projection.history-lS6Jhi42.mjs";
//#region src/config/sessions/session-accessor.sqlite-history-input-visibility.ts
const inputMessageJson = sql`json_object('role', json_extract(${transcriptEventNavigationSql("event")}, '$.message.role'),
    'idempotencyKey', json_extract(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey'),
    'provenance', json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance'),
    '__testclaw', json_object(
      'runId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.runId'),
      'steerTargetRunId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.steerTargetRunId')))`;
/** Resolve a run's hidden input and the first visible steer on its active transcript branch. */
function readSessionTranscriptRunInputVisibilityFromProjection(projection, params) {
	const db = getActiveTranscriptKysely(projection.database);
	resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	});
	const visible = resolveVisibleMessagePositions(projection);
	const history = resolveVisibleHistoryProjection(projection);
	const { messageEnd } = resolveVisibleHistoryRange(history, params.messageSeq - 1, params.messageSeq);
	const scannedThroughMessagePosition = messageEnd <= visible.kept.length ? visible.kept[messageEnd - 1] ?? -1 : visible.postStart + messageEnd - visible.kept.length - 1;
	const hidden = {
		hidden: true,
		scannedThroughMessageSeq: params.messageSeq,
		scannedThroughMessagePosition
	};
	const keptPositions = sql`(SELECT value FROM json_each(${JSON.stringify(visible.kept)}))`;
	const userInputs = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", inputMessageJson.as("message_json")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "<", projection.state.activeMessageCount).where((eb) => visible.kept.length > 0 ? eb.or([eb("active.message_position", ">=", visible.postStart), eb("active.message_position", "in", keptPositions)]) : eb("active.message_position", ">=", visible.postStart)).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`, "=", "user").$narrowType();
	let readAfter = params.previous?.scannedThroughMessagePosition;
	if (readAfter === void 0) {
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, userInputs.innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).where("identity.message_idempotency_key", "=", params.idempotencyKey).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.steerTargetRunId')`, "is", null).limit(1));
		if (!anchor || !params.isHiddenInput(JSON.parse(anchor.message_json))) return { hidden: false };
		readAfter = anchor.message_position;
	}
	const laterInputs = userInputs.where("active.message_position", ">", readAfter).where("active.message_position", "<=", scannedThroughMessagePosition).where((eb) => eb.or([eb(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.steerTargetRunId')`, "=", params.runId), eb(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.__testclaw.runId')`, "=", params.runId)])).orderBy("active.message_position", "asc");
	for (const row of iterateSqliteQuerySync(projection.database.db, laterInputs)) if (!params.isHiddenInput(JSON.parse(row.message_json))) {
		const firstVisibleMessageSeq = resolveHistoryMessageSequence(visible, history, row.message_position);
		return firstVisibleMessageSeq === void 0 ? { hidden: false } : {
			...hidden,
			firstVisibleMessageSeq
		};
	}
	return hidden;
}
//#endregion
//#region src/gateway/session-utils-store-readonly.ts
/** Auxiliary metadata never chooses one of several matching canonical source rows. */
function readGatewaySessionEntryFromSources(sessionKey, sources, current) {
	if (sources.length === 0) return;
	const selected = resolveGatewaySessionStoreReadResults({
		canonicalKey: sessionKey,
		scanTargets: [sessionKey],
		deferCanonicalValidation: true,
		reads: sources.map((source) => ({
			storePath: source.path,
			readSource: source
		})),
		readStore: ({ readSource }) => {
			if (current && readSource.path === current.source.path && readSource.agentId === current.source.agentId) return current.entry ? { [sessionKey]: current.entry } : {};
			try {
				const result = withScopedAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => readExactSessionEntryRowValidated(database, sessionKey, "list")?.entry), readSource);
				return result.found && result.value ? { [sessionKey]: result.value } : {};
			} catch {
				return {};
			}
		}
	});
	return selected.canonicalValidationError ? void 0 : selected.match?.entry;
}
//#endregion
//#region src/gateway/session-history-readonly-reader.ts
/** Source and run facts live only for one history operation, on its admitted database. */
function createBoundSessionHistorySubagentProjection(readSnapshot, stateDatabase, readSourceDatabases) {
	const sources = /* @__PURE__ */ new Map();
	const runs = /* @__PURE__ */ new Map();
	const readSource = (projection, sessionKey) => {
		const cached = sources.get(sessionKey);
		if (cached !== void 0) return cached;
		if (isSubagentSessionFromEntry(sessionKey, void 0)) {
			sources.set(sessionKey, true);
			return true;
		}
		const sourceAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		const sourceDatabases = readSourceDatabases();
		const ownSource = {
			agentId: projection.database.agentId,
			path: projection.database.path
		};
		const hasPreparedSource = Boolean(sourceAgentId && sourceDatabases && Object.hasOwn(sourceDatabases, sourceAgentId));
		const candidates = sourceAgentId && sourceDatabases && hasPreparedSource ? [...sourceDatabases[sourceAgentId] ?? []] : [];
		if (!sourceAgentId || sourceAgentId === projection.resolved.agentId || !hasPreparedSource) {
			if (!candidates.some((source) => source.agentId === ownSource.agentId && source.path === ownSource.path)) candidates.unshift(ownSource);
		}
		const ownCandidate = candidates.find((source) => source.agentId === ownSource.agentId && source.path === ownSource.path);
		const ownEntry = ownCandidate ? readExactSessionEntryRow(projection.database, sessionKey, "list")?.entry : void 0;
		const entry = readGatewaySessionEntryFromSources(sessionKey, candidates, {
			source: ownCandidate ?? ownSource,
			entry: ownEntry
		});
		let child = isSubagentSessionFromEntry(sessionKey, entry);
		if (!child && entry && (entry.parentSessionKey || entry.spawnedBy) && stateDatabase) {
			const acp = withStateDatabaseCoordinatorRuntimeDirectory(stateDatabase.coordinatorRuntime, () => readAcpSessionMetaForEntry({
				sessionKey,
				agentId: parseAgentSessionKey(sessionKey)?.agentId,
				entry,
				databasePath: stateDatabase.path,
				env: stateDatabase.environment
			}));
			child = isSubagentSessionFromEntry(sessionKey, entry, acp);
		}
		sources.set(sessionKey, child);
		return child;
	};
	return {
		isSubagentSession(sessionKey) {
			return sources.get(sessionKey) ?? readSnapshot((projection) => readSource(projection, sessionKey));
		},
		isSubagentRunMessage(runId, messageSeq) {
			if (messageSeq === void 0) return false;
			let visibility = runs.get(runId);
			if (!visibility || visibility.hidden && visibility.firstVisibleMessageSeq === void 0 && visibility.scannedThroughMessageSeq < messageSeq) {
				visibility = readSnapshot((projection) => readSessionTranscriptRunInputVisibilityFromProjection(projection, {
					idempotencyKey: buildRunUserTurnIdempotencyKey(runId),
					runId,
					messageSeq,
					previous: visibility?.hidden ? visibility : void 0,
					isHiddenInput: (message) => {
						const record = asOptionalRecord(message);
						return Boolean(record && isSubagentCoordinationHistoryInput(record, (key) => readSource(projection, key)));
					}
				}));
				runs.set(runId, visibility);
			}
			return visibility.hidden && (visibility.firstVisibleMessageSeq === void 0 || messageSeq < visibility.firstVisibleMessageSeq);
		}
	};
}
function createReadonlySessionHistoryReader(target) {
	const sourceDatabases = target.sourceDatabases;
	const readSnapshot = (read) => {
		const result = withScopedAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
			const entryValidationKey = target.entryValidationKey;
			if (entryValidationKey !== void 0) readSessionEntryRow(database, entryValidationKey);
			return readCurrentProjectionSnapshot(database, {
				agentId: target.transcript.agentId,
				sessionId: target.transcript.sessionId,
				sessionKey: target.transcript.sessionKey,
				databaseAgentId: target.database.agentId,
				path: target.database.path
			}, read);
		}), target.database);
		if (!result.found) throw new Error("Session transcript storage is unavailable; open the source gateway and retry.");
		if (result.value.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(target.transcript.sessionId);
		return result.value.value;
	};
	return {
		readTranscriptDisplayDelta: (limits) => readSnapshot((projection) => readTranscriptDisplayDeltaFromProjection(projection, limits)),
		...createSessionTranscriptReader({
			resolveTarget: async () => target.transcript,
			readSnapshot: async (_transcript, read) => readSnapshot(read)
		}),
		subagentCoordination: createBoundSessionHistorySubagentProjection(readSnapshot, target.stateDatabase, () => sourceDatabases)
	};
}
//#endregion
export { createReadonlySessionHistoryReader as n, createBoundSessionHistorySubagentProjection as t };
