import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-TFRevCb_.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DCABr_1E.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-BM_e7CiR.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-CQrIlHvH.mjs";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-I2MKxREg.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-BaMdTvHU.mjs";
import { t as buildSessionPreviewItems } from "./session-display-projection-CiXC2kqR.mjs";
import { t as readRecentSessionTranscriptHistoryEvents } from "./session-accessor.sqlite-history-events-BdEPy7lb.mjs";
import { t as SessionManager } from "./session-manager-C2b3eEj2.mjs";
import { n as readBoundedSessionPreviewItemsAsync, t as readBoundedSessionPreviewItems } from "./session-transcript-preview-reader-BS8HJmaw.mjs";
//#region src/gateway/session-transcript-preview.ts
/** Durable previews share the history reader; incognito SQLite stays with its process owner. */
async function readSessionPreviewItemsFromTranscriptAsync(scope, maxItems, maxChars, view = "display") {
	const target = prepareSessionTranscriptReadTargetCore(scope);
	if (view === "model-context") {
		const { agentId, sessionKey, storePath } = target;
		const sessionId = scope.sessionId;
		if (!agentId || !sessionKey || !storePath) throw new Error("Model-context preview requires an exact session target");
		const modelTarget = captureSessionTranscriptTargetBinding({
			agentId,
			sessionId,
			sessionKey,
			storePath,
			...scope.env ? { env: scope.env } : {}
		});
		return await readBoundedSessionPreviewItemsAsync(maxItems, async (maxEvents, maxBytes) => {
			let truncated = false;
			const manager = await SessionManager.openBoundedAsync(modelTarget, {
				maxEvents,
				maxBytes,
				onTruncated: () => {
					truncated = true;
				}
			});
			return {
				items: buildSessionPreviewItems(manager.buildSessionContext().messages, maxItems, maxChars, view),
				hasOlderEvents: truncated
			};
		});
	}
	const readScope = {
		agentId: target.agentId,
		sessionId: scope.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath,
		...scope.env ? { env: scope.env } : {},
		...scope.sessionEntry ? { sessionEntry: { sessionId: scope.sessionEntry.sessionId } } : {}
	};
	const resolved = resolveSqliteTranscriptReadScope(readScope);
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveAssistantAgentSqlitePath(options);
	if (isIncognitoAssistantAgentSqlitePath(databasePath, options)) return readSessionDisplayPreviewItems(readScope, maxItems, maxChars);
	const entryValidationKey = target.entryValidationScope ? resolveSqliteScope({
		agentId: resolved.agentId,
		sessionKey: target.entryValidationScope.sessionKey
	}).sessionKey : void 0;
	const admission = resolveSessionTranscriptReadFence(resolved);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-BAoz2J15.mjs");
	try {
		return await withSessionHistoryWorkerDatabase(options, (owner) => owner.readPreview({
			target: {
				agentId: resolved.agentId,
				sessionId: resolved.sessionId,
				sessionKey: entryValidationKey ?? resolved.sessionKey,
				...entryValidationKey !== void 0 ? { entryValidationKey } : {}
			},
			...scope.env ? { env: scope.env } : {},
			maxItems,
			maxChars,
			...admission ? { admission: { ...admission } } : {}
		}));
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
			...options,
			preferredSessionId: resolved.sessionId
		});
		throw error;
	}
}
function readSessionDisplayPreviewItems(scope, maxItems, maxChars) {
	const target = resolveSessionTranscriptReadTarget(scope);
	return readBoundedSessionPreviewItems(maxItems, (maxEvents, maxBytes) => {
		const page = readRecentSessionTranscriptHistoryEvents(toTranscriptReadScope(target), {
			maxBytes,
			maxLines: maxEvents,
			maxMessages: maxEvents
		});
		return {
			items: buildSessionPreviewItems(page.events.map((entry) => asOptionalRecord(entry.event)?.message), maxItems, maxChars),
			hasOlderEvents: page.totalMessages > page.events.length
		};
	});
}
//#endregion
export { readSessionPreviewItemsFromTranscriptAsync as t };
