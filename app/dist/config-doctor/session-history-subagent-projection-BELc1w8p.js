import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { u as asPositiveSafeInteger } from "./number-coercion-0M4tZV2c.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { T as withStateDatabaseCoordinatorRuntimeDirectory } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { l as transcriptEventNavigationSql } from "./transcript-payload-BaqIXvVM.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-CUY4T9eg.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { y as withScopedAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-Ckg86YCZ.js";
import { c as readWithCanonicalSessionAdmission } from "./session-canonical-key-Bxbtl4CI.js";
import { C as readExactSessionEntryRow, w as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { s as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-D01U6hs1.js";
import { E as getActiveTranscriptKysely, T as withCurrentProjectionSnapshot, x as resolveVisibleMessagePositions } from "./session-accessor.sqlite-active-events-CuvrkABH.js";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-BTYyxviS.js";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-BAAmUJGD.js";
import { l as resolveTranscriptPageEnd } from "./session-utils.fs-DhpLc_dd.js";
import { l as resolveGatewaySessionStoreReadResults } from "./session-utils-store-lookup-BpmBw41u.js";
import { h as resolveVisibleHistoryRange, m as resolveVisibleHistoryProjection, p as resolveHistoryMessageSequence } from "./session-transcript-readers-D3eaTHpA.js";
import { c as createPreSessionStartAnnouncePairFilter, f as isHeartbeatHistoryTurnBoundaryMessage, o as projectChatDisplayMessagesWithState, p as isSubagentCoordinationHistoryInput, t as createChatHistoryRecoveryProjection, u as dropPreSessionStartAnnouncePairs } from "./chat-display-projection-C8q6oDEf.js";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-CSuPWqjp.js";
import { sql } from "kysely";
//#region src/gateway/session-history-tail.ts
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES = 8e3;
const SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES = 100;
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_CHUNK_MESSAGES = 400;
function readChatHistoryMessageId(message) {
	const id = asOptionalRecord(asOptionalRecord(message)?.["__testclaw"])?.id;
	return typeof id === "string" && id ? id : void 0;
}
function readChatHistoryMessageSeq(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__testclaw"]);
	return asPositiveSafeInteger(metadata?.seq);
}
function capOffsetChatHistoryProjectedMessages(messages, max) {
	if (messages.length <= max) return messages;
	const start = Math.max(0, messages.length - max);
	const boundarySeq = readChatHistoryMessageSeq(messages[start]);
	if (boundarySeq === void 0) return messages.slice(start);
	let safeStart = start;
	while (safeStart > 0 && readChatHistoryMessageSeq(messages[safeStart - 1]) === boundarySeq) safeStart--;
	return messages.slice(safeStart);
}
function dropChatHistoryOverreadContextMessage(messages, contextMessage) {
	if (contextMessage === void 0) return messages;
	const index = messages.indexOf(contextMessage);
	return index < 0 ? messages : [...messages.slice(0, index), ...messages.slice(index + 1)];
}
async function readAdjacentChatHistoryMessages(params) {
	const page = await params.readers.readSessionMessagesAroundIdWithStatsAsync(params.readScope, {
		messageId: params.anchorId,
		maxMessages: params.limit + 1,
		direction: params.direction,
		expectedReadWindow: params.expectedReadWindow,
		allowResetArchiveFallback: true,
		readOnly: params.readOnly
	});
	if (!page.found || page.displaySource !== params.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
	const anchorIndex = page.messages.findIndex((message) => readChatHistoryMessageId(message) === params.anchorId);
	if (anchorIndex < 0) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
	return params.direction === "newer" ? page.messages.slice(anchorIndex + 1, anchorIndex + 1 + params.limit) : page.messages.slice(Math.max(0, anchorIndex - params.limit), anchorIndex);
}
/** Resolve only the newer turn context a historical page needs to classify its pending error. */
async function readChatHistoryRecoveryContext(params) {
	const context = [];
	let recovery;
	let anchorId = readChatHistoryMessageId(params.messages.at(-1));
	let scannedBytes = 0;
	while (anchorId && context.length < SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES) {
		const chunkSize = Math.min(SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES, SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES - context.length);
		const newer = await readAdjacentChatHistoryMessages({
			anchorId,
			direction: "newer",
			limit: chunkSize,
			readScope: params.readScope,
			readers: params.readers,
			displaySource: params.displaySource,
			expectedReadWindow: params.expectedReadWindow,
			readOnly: params.readOnly
		});
		if (newer.length === 0) break;
		const previousContextLength = context.length;
		let boundaryReached = false;
		for (const message of newer) {
			scannedBytes += Buffer.byteLength(JSON.stringify(message), "utf8");
			if (scannedBytes > params.maxBytes) return context;
			context.push(message);
			if (asOptionalRecord(message)?.role === "user") {
				boundaryReached = true;
				break;
			}
		}
		if (boundaryReached) break;
		recovery ??= params.createRecovery(params.messages);
		recovery.append(context.slice(previousContextLength));
		if (!recovery.pending) break;
		anchorId = readChatHistoryMessageId(context.at(-1));
	}
	return context;
}
/** Scans indexed transcript records until one bounded visible history page is filled. */
async function readIncrementalChatHistoryTail(params) {
	const { resolveCurrentUserProfileDisplay } = params;
	let offset = params.offset ?? 0;
	const requestedBeforeSeq = params.beforeSeq;
	const rawHistoryWindowMessages = Math.max(1, Math.floor(params.max)) * 20 + 20;
	let initialMessages = requestedBeforeSeq !== void 0 ? Math.min(rawHistoryWindowMessages, Math.max(1, params.max)) : params.preserveProjectionContext && offset === 0 ? rawHistoryWindowMessages : Math.min(rawHistoryWindowMessages, Math.max(1, offset === 0 ? params.max * 3 : params.max));
	const readPage = offset === 0 && requestedBeforeSeq === void 0 ? await params.readers.readRecentSessionMessagesWithStatsAsync(params.readScope, {
		maxMessages: initialMessages + 1,
		maxLines: initialMessages + 1,
		maxBytes: Math.max(params.maxBytes * 2, 1048576),
		allowResetArchiveFallback: true,
		captureReadWindow: true,
		readOnly: params.readOnly
	}) : await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
		offset,
		...requestedBeforeSeq === void 0 ? {} : { beforeSeq: requestedBeforeSeq },
		maxMessages: initialMessages + 1,
		...requestedBeforeSeq !== void 0 && params.preserveProjectionContext ? { recentAtHead: {
			maxMessages: rawHistoryWindowMessages + 1,
			maxLines: rawHistoryWindowMessages + 1,
			maxBytes: Math.max(params.maxBytes * 2, 1048576)
		} } : {},
		allowResetArchiveFallback: true,
		captureReadWindow: true,
		readOnly: params.readOnly
	});
	const readWindow = readPage.readWindow;
	const availableMessages = resolveTranscriptPageEnd(readPage.totalMessages, {
		beforeSeq: requestedBeforeSeq,
		offset
	});
	const beforeSeq = availableMessages + 1;
	if (requestedBeforeSeq !== void 0) {
		offset = readPage.totalMessages - availableMessages;
		if (offset === 0 && params.preserveProjectionContext) initialMessages = rawHistoryWindowMessages;
	}
	const sessionStartedAt = typeof params.entry?.sessionStartedAt === "number" ? params.entry.sessionStartedAt : void 0;
	let rawPageMessages = Math.min(initialMessages, Math.max(readPage.messages.length, availableMessages > 0 ? 1 : 0));
	let overreadContextMessage = readPage.messages.length > initialMessages ? readPage.messages[0] : void 0;
	let rawMessages = dropChatHistoryOverreadContextMessage(readPage.messages, overreadContextMessage);
	let recoveryContext = offset === 0 ? [] : void 0;
	const newestPageSeq = readChatHistoryMessageSeq(rawMessages.at(-1));
	const filterWindowMessages = (messages, contextMessage) => sessionStartedAt === void 0 ? messages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(contextMessage === void 0 ? messages : [contextMessage, ...messages], sessionStartedAt), contextMessage);
	const project = (messages = rawMessages, contextMessage = overreadContextMessage, resolveProfileDisplay = true, newerContext = recoveryContext ?? []) => {
		const filteredRawMessages = filterWindowMessages(messages, contextMessage);
		const projection = projectChatDisplayMessagesWithState(newerContext.length > 0 ? [...filteredRawMessages, ...newerContext] : filteredRawMessages, {
			subagentCoordination: params.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.effectiveMaxChars,
			resolveCronJobName: params.resolveCronJobName,
			...resolveProfileDisplay && !params.deferProfileDisplay ? { resolveCurrentUserProfileDisplay } : {},
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(contextMessage)
		});
		if (newerContext.length > 0) projection.messages = projection.messages.filter((message) => (readChatHistoryMessageSeq(message) ?? Infinity) <= (newestPageSeq ?? -1));
		return {
			filteredRawMessages,
			projected: offset === 0 ? projection.messages.length > params.max ? projection.messages.slice(-params.max) : projection.messages : capOffsetChatHistoryProjectedMessages(projection.messages, params.max),
			projection
		};
	};
	const projectWindow = async () => {
		const result = project();
		if (recoveryContext !== void 0 || newestPageSeq === void 0 || !result.projection.assistantErrorPending) return result;
		recoveryContext = await readChatHistoryRecoveryContext({
			messages: result.filteredRawMessages,
			createRecovery: (messages) => {
				const recovery = createChatHistoryRecoveryProjection({
					subagentCoordination: params.readers.subagentCoordination,
					maxChars: params.effectiveMaxChars
				});
				if (sessionStartedAt === void 0) {
					recovery.append(messages);
					return recovery;
				}
				const filter = createPreSessionStartAnnouncePairFilter(sessionStartedAt);
				let contextRemoved = overreadContextMessage === void 0;
				const append = (chunk) => {
					const filtered = filter(chunk);
					const prepared = contextRemoved ? filtered : dropChatHistoryOverreadContextMessage(filtered, overreadContextMessage);
					contextRemoved ||= prepared.length !== filtered.length;
					recovery.append(prepared);
				};
				append(overreadContextMessage === void 0 ? messages : [overreadContextMessage, ...messages]);
				return {
					append,
					get pending() {
						return recovery.pending;
					}
				};
			},
			readScope: params.readScope,
			readers: params.readers,
			displaySource: readPage.displaySource,
			expectedReadWindow: readWindow,
			maxBytes: params.maxBytes,
			readOnly: params.readOnly
		});
		return project();
	};
	let result = await projectWindow();
	let estimatedVisibleMessages = result.projected.length;
	let projectionDirty = false;
	let scanLimit = rawHistoryWindowMessages;
	let scannedBytes = 0;
	const unmeasuredPages = [];
	let nextChunkMessages = SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES;
	while (rawPageMessages < availableMessages) {
		if (projectionDirty && estimatedVisibleMessages >= params.max) {
			result = await projectWindow();
			projectionDirty = false;
			estimatedVisibleMessages = result.projected.length;
		}
		if (result.projected.length >= params.max) break;
		if (rawPageMessages >= rawHistoryWindowMessages) scanLimit = rawHistoryWindowMessages + SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES;
		if (rawPageMessages >= scanLimit) break;
		const chunkMessages = Math.min(nextChunkMessages, scanLimit - rawPageMessages);
		const oldestId = readChatHistoryMessageId(rawMessages[0]);
		const page = offset > 0 && recoveryContext !== void 0 && oldestId ? {
			...readPage,
			messages: await readAdjacentChatHistoryMessages({
				anchorId: oldestId,
				direction: "older",
				limit: chunkMessages + 1,
				readScope: params.readScope,
				readers: params.readers,
				displaySource: readPage.displaySource,
				expectedReadWindow: readWindow,
				readOnly: params.readOnly
			})
		} : await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
			beforeSeq,
			offset: rawPageMessages,
			expectedReadWindow: readWindow,
			maxMessages: chunkMessages + 1,
			allowResetArchiveFallback: true,
			readOnly: params.readOnly
		});
		if (page.displaySource !== readPage.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
		if (page.messages.length === 0) break;
		const contextMessage = page.messages.length > chunkMessages ? page.messages[0] : void 0;
		const chunkRawMessages = dropChatHistoryOverreadContextMessage(page.messages, contextMessage);
		rawPageMessages += chunkRawMessages.length;
		rawMessages = chunkRawMessages.concat(rawMessages);
		overreadContextMessage = contextMessage;
		estimatedVisibleMessages += project(chunkRawMessages, contextMessage, false, []).projection.messages.length;
		projectionDirty = true;
		unmeasuredPages.push(page.messages);
		if (rawPageMessages > rawHistoryWindowMessages) {
			for (const messages of unmeasuredPages) scannedBytes += Buffer.byteLength(JSON.stringify(messages), "utf8");
			unmeasuredPages.length = 0;
			if (scannedBytes >= params.maxBytes) break;
		}
		nextChunkMessages = Math.min(nextChunkMessages * 2, SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_CHUNK_MESSAGES);
	}
	if (projectionDirty) result = await projectWindow();
	params.readers.subagentCoordination?.assertCurrent?.();
	return {
		overreadContextMessage,
		projected: result.projected,
		projection: result.projection,
		rawMessages: result.filteredRawMessages,
		rawPageMessages,
		readPage
	};
}
//#endregion
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
//#endregion
//#region src/gateway/session-history-subagent-projection.ts
/** Bind host-owned stores and retain their admission for one display operation. */
function createSessionHistorySubagentProjection(scope, options = {}) {
	const databaseOptions = toDatabaseOptions(resolveSqliteTranscriptReadScope(scope));
	const currentSource = {
		agentId: databaseOptions.agentId,
		path: resolveAssistantAgentSqlitePath(databaseOptions)
	};
	const context = captureAssistantStateWorkerContext();
	const sourceReads = prepareGatewaySessionStoreReadSources({
		cfg: getRuntimeConfig(),
		currentSource,
		env: process.env,
		registryPath: context.admission.databasePath,
		deferSources: options.deferSources
	});
	const bound = createBoundSessionHistorySubagentProjection((read) => withCurrentProjectionSnapshot(scope, read, { readOnly: true }), {
		path: context.admission.databasePath,
		environment: context.environment,
		coordinatorRuntime: context.coordinatorRuntime
	}, () => sourceReads.sources);
	const assertCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		sourceReads.assertCurrent();
	};
	const readCurrent = (read) => {
		assertCurrent();
		const result = read();
		assertCurrent();
		return result;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => readCurrent(() => bound.isSubagentSession(sessionKey)),
		isSubagentRunMessage: (runId, messageSeq) => readCurrent(() => bound.isSubagentRunMessage(runId, messageSeq))
	};
}
//#endregion
export { readChatHistoryMessageSeq as a, readChatHistoryMessageId as i, capOffsetChatHistoryProjectedMessages as n, readChatHistoryRecoveryContext as o, dropChatHistoryOverreadContextMessage as r, readIncrementalChatHistoryTail as s, createSessionHistorySubagentProjection as t };
