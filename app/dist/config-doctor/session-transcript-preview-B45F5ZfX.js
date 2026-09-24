import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import "./testclaw-agent-db-Ckg86YCZ.js";
import "./session-canonical-key-Bxbtl4CI.js";
import "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-CriGFpOg.js";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Oplb6Sva.js";
import { o as resolveSessionTranscriptReadFence, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-D01U6hs1.js";
import "./session-accessor.sqlite-active-events-CuvrkABH.js";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-CGgZvou6.js";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-BQlRWMsR.js";
import { t as SessionManager } from "./session-manager-B9vSB5Dk.js";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-Q36QmRyz.js";
import { t as buildSessionPreviewItems } from "./session-display-projection-BofAJNvj.js";
import { d as readRecentSessionTranscriptHistoryEvents } from "./session-transcript-readers-D3eaTHpA.js";
//#region src/gateway/session-transcript-preview-reader.ts
function previewReadLimits(maxItems) {
	const initialMaxEvents = Math.min(256, Math.max(64, Math.ceil(maxItems) * 4));
	return [{
		maxEvents: initialMaxEvents,
		maxBytes: 1048576
	}, {
		maxEvents: Math.min(2048, Math.max(1024, initialMaxEvents * 8, Math.ceil(maxItems))),
		maxBytes: 8388608
	}];
}
/** Share the same bounded widening for display and canonical model-context previews. */
function readBoundedSessionPreviewItems(maxItems, readPage) {
	let items = [];
	for (const { maxEvents, maxBytes } of previewReadLimits(maxItems)) {
		const page = readPage(maxEvents, maxBytes);
		items = page.items;
		if (items.length >= maxItems || !page.hasOlderEvents) break;
	}
	return items;
}
async function readBoundedSessionPreviewItemsAsync(maxItems, readPage) {
	let items = [];
	for (const { maxEvents, maxBytes } of previewReadLimits(maxItems)) {
		const page = await readPage(maxEvents, maxBytes);
		items = page.items;
		if (items.length >= maxItems || !page.hasOlderEvents) break;
	}
	return items;
}
//#endregion
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
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-C1vb1UkM.js");
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
