import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CRW06h3K.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-Bar1ps-o.mjs";
import { i as readAssistantAgentDatabaseIdentity, r as isAssistantAgentDatabasePathCurrent } from "./testclaw-agent-db-identity-B2JyZwuj.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { o as readBoardSessionKeys } from "./sqlite-board-store.kernel-DHSbjnRz.mjs";
import { u as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-DuDIqgIP.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent, u as readWithCanonicalSessionReaderContinuation } from "./session-canonical-key-D8rnGIu3.mjs";
import { r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-B9D7i1nG.mjs";
import { S as readTranscriptHeaderFromDatabase } from "./session-accessor.sqlite-read-jqSNqbjI.mjs";
import { f as readSessionTranscriptWatermarkInDatabase, r as readSessionBackingFactsInDatabase } from "./session-accessor-CtBBLApI.mjs";
import { r as readSessionEntryReplacementState } from "./session-accessor.sqlite-replacement-state-FpKzS0HS.mjs";
import { u as resolveSessionLifecycleTimestamps } from "./lifecycle-DX3moz6p.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-LjKSv0AZ.mjs";
//#region src/config/sessions/session-entry-read.worker.ts
/** Full rows share a snapshot with lifecycle fallback; backing reads retain listing admission. */
function readExactSessionEntriesWithLifecycle(request) {
	const result = withAssistantAgentDatabaseReadOnly((database) => request.projection === "backing" ? {
		kind: "session-exact-entries",
		entries: readSessionBackingFactsInDatabase(database, request.sessionKeys, request.continuation),
		lifecycleTimestamps: {}
	} : withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		if (request.projection === "replacement") {
			const identity = readAssistantAgentDatabaseIdentity(database).identity;
			if (typeof identity !== "string" || !request.replacementSelection) throw new Error("Session replacement snapshot requires its durable owner and selection");
			const replacement = readSessionEntryReplacementState(database, request.replacementSelection);
			return {
				kind: "session-exact-entries",
				entries: replacement.entries,
				lifecycleTimestamps: {},
				replacement: {
					...replacement,
					databaseIdentity: identity
				}
			};
		}
		const selected = expectDefined(readExactSessionEntryCandidatesInDatabase(database, [request.sessionKeys], request.projection === "sharing" ? "list" : "full")[0], "exact session read result");
		if (!selected.ok) throw selected.error;
		if (request.projection === "sharing") {
			const { identity } = readAssistantAgentDatabaseIdentity(database);
			if (typeof identity !== "string") throw new Error("Private session facts require their process-held owner");
			return {
				kind: "session-exact-entries",
				entries: selected.value,
				lifecycleTimestamps: {},
				sharing: {
					source: {
						agentId: database.agentId,
						path: database.path
					},
					databaseIdentity: `file:${identity}`,
					members: selected.value.map(({ sessionKey }) => ({
						sessionKey,
						identityIds: listSessionMembersInDatabase(database, sessionKey).map((member) => member.identityId)
					}))
				}
			};
		}
		const entry = selected.value.find(({ sessionKey }) => sessionKey === request.lifecycleSessionKey)?.entry;
		const identity = request.includeAuthorization ? readAssistantAgentDatabaseIdentity(database) : void 0;
		if (identity && (typeof identity.identity !== "string" || !isAssistantAgentDatabasePathCurrent(database))) throw new Error("Session database physical identity changed");
		return {
			...identity && typeof identity.identity === "string" ? { databaseIdentity: {
				...identity,
				identity: identity.identity
			} } : {},
			...request.includeMembers ? { members: Object.fromEntries(selected.value.map(({ sessionKey }) => [sessionKey, listSessionMembersInDatabase(database, sessionKey)])) } : {},
			kind: "session-exact-entries",
			entries: selected.value,
			lifecycleTimestamps: resolveSessionLifecycleTimestamps({
				entry,
				agentId: database.agentId,
				sessionKey: request.lifecycleSessionKey,
				readHeader: (sessionId) => readTranscriptHeaderFromDatabase(database, sessionId)
			})
		};
	})), {
		...request.database,
		env: request.env
	});
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-exact-entries",
		entries: [],
		lifecycleTimestamps: {}
	};
}
/** Entry, board presence, and summary validity describe one committed snapshot. */
function readSessionRowDatabaseFacts(request) {
	if (request.sessionKeys.length > 64) throw new Error(`Session row facts support at most 64 keys`);
	if (request.sessionKeys.length === 0) return {
		kind: "session-row-facts",
		rows: []
	};
	const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const selected = expectDefined(readExactSessionEntryCandidatesInDatabase(database, [request.sessionKeys], "list")[0], "session row facts read result");
		if (!selected.ok) throw selected.error;
		return {
			kind: "session-row-facts",
			rows: selected.value.map(({ sessionKey, entry }) => {
				const facts = {
					sessionKey,
					entry,
					hasBoard: readBoardSessionKeys(database, sessionKey).length > 0
				};
				if (readSessionActivitySummary(entry)) facts.activitySummaryWatermark = readSessionTranscriptWatermarkInDatabase(database, entry.sessionId);
				return facts;
			})
		};
	}))), {
		...request.database,
		env: request.env
	});
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-row-facts",
		rows: []
	};
}
//#endregion
export { readExactSessionEntriesWithLifecycle, readSessionRowDatabaseFacts };
