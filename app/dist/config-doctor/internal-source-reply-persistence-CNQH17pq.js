import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { t as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { F as readTranscriptEventId, I as readTranscriptEventMessage, b as findTranscriptEvent } from "./session-accessor.sqlite-transcript-store-BX2GNujg.js";
import { a as isAssistantDeliveryMirrorAssistantMessage } from "./transcript-only-testclaw-assistant-DMb_WNdn.js";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-CW-keGmb.js";
import { at as readActiveTranscriptEntryAnchor, b as sessionMatchesExpectedTranscriptTurn, v as persistSessionTranscriptTurn } from "./session-accessor-DMf92PxK.js";
import { s as resolveSessionEntrySelection } from "./session-accessor.entry-BGyeftoC.js";
import "./sessions-4kX-llHk.js";
import { c as readAssistantDisplayContent, l as retainAssistantModelContent, t as appendAssistantMessageToSessionTranscript } from "./transcript-scRUtjvw.js";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-BTFaeVES.js";
import { n as readClawHubRecommendations } from "./clawhub-recommendations-yHhGdOvB.js";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-DesoaaBV.js";
import { d as prepareOutgoingMediaFromReplyPayload, i as attachManagedOutgoingMediaToMessage, p as removeManagedOutgoingMediaBlocks, s as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-zsBlEbdP.js";
//#region src/gateway/internal-source-reply-persistence.ts
const internalSourceReplyPersistenceLeases = createKeyedFifoLeaseRegistry(Symbol.for("testclaw.internalSourceReplyPersistenceLeases"));
async function completePersistedInternalSourceReply(params) {
	if (!params.expectedSessionId || !params.idempotencyKey) return false;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const scope = {
		agentId: params.agentId,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey,
		storePath
	};
	scope.sessionKey = resolveSessionEntrySelection(scope).normalizedKey;
	const expected = {
		expectedSessionId: params.expectedSessionId,
		...getOwnedSessionTranscriptWriterFence({ sessionKey: scope.sessionKey })
	};
	const found = await findTranscriptEvent(scope, (event) => {
		const message = readTranscriptEventMessage(event);
		return message?.idempotencyKey === params.idempotencyKey && isAssistantDeliveryMirrorAssistantMessage(message);
	});
	if (!found) return false;
	const messageId = readTranscriptEventId(found.event);
	const message = readTranscriptEventMessage(found.event);
	if (!messageId || !message) throw new Error("Internal source reply transcript identity is unavailable");
	const assertCurrentReplay = (entryId) => {
		if (!sessionMatchesExpectedTranscriptTurn(loadExactSessionEntry(scope), expected) || !readActiveTranscriptEntryAnchor({
			...scope,
			entryId
		})) throw new Error("Internal source reply no longer owns the active transcript");
	};
	const replay = await persistSessionTranscriptTurn(scope, {
		config: params.cfg,
		...expected,
		messages: [{
			eventId: messageId,
			message,
			idempotencyLookup: "scan",
			shouldAppendInTransaction: () => {
				assertCurrentReplay(messageId);
				return true;
			}
		}],
		touchSessionEntry: false,
		updateMode: "file-only",
		publishWhen: "always",
		onMessageCommitted: (result) => {
			assertCurrentReplay(result.messageId);
			attachSourceReplyMedia(result);
		}
	});
	if (replay.rejectedReason || replay.messages.length === 0) throw new Error("Internal source reply no longer owns the active transcript");
	return true;
}
function attachSourceReplyMedia(result) {
	const message = result.message;
	const blocks = readAssistantDisplayContent(message).filter((block) => block.type !== "text" && block.type !== "clawhub");
	if (blocks.length > 0 && !attachManagedOutgoingMediaToMessage({
		messageId: result.messageId,
		blocks
	})) throw new Error("Internal source reply media ownership could not be persisted");
}
/** Persist the private WebChat source reply before its successful tool result becomes visible. */
async function persistInternalSourceReply(params) {
	const leaseKey = params.idempotencyKey ? JSON.stringify([
		params.agentId ?? "",
		params.sessionKey,
		params.expectedSessionId ?? "",
		params.idempotencyKey
	]) : void 0;
	const lease = leaseKey ? internalSourceReplyPersistenceLeases.reserve([leaseKey]) : void 0;
	await lease?.wait();
	try {
		if (await completePersistedInternalSourceReply(params)) return;
		const media = prepareOutgoingMediaFromReplyPayload(params.payload);
		const mediaBlocks = await createManagedOutgoingMediaBlocks({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			items: media,
			localRoots: getAgentScopedMediaLocalRootsForSources({
				cfg: params.cfg,
				agentId: params.agentId,
				mediaSources: media.map((item) => item.url)
			})
		});
		let committed = false;
		try {
			const content = [
				...readClawHubRecommendations(params.payload.channelData),
				...params.payload.text ? [{
					type: "text",
					text: params.payload.text
				}] : [],
				...mediaBlocks
			];
			const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: params.sessionKey });
			const appended = await appendAssistantMessageToSessionTranscript({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
				...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
				...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
				content: retainAssistantModelContent(content),
				displayContent: content,
				mediaUrls: media.map((item) => item.url),
				idempotencyKey: params.idempotencyKey,
				runId: params.runId,
				...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
					kind: "message-tool-source-reply",
					final: params.sourceReplyFinal,
					...params.toolCallId ? { toolCallId: params.toolCallId } : {},
					...params.sourceTurnId ? { sourceTurnId: params.sourceTurnId } : {}
				} } : {},
				config: params.cfg,
				onMessageCommitted: (result) => {
					committed = result.appended;
					attachSourceReplyMedia(result);
				}
			});
			if (!appended.ok) throw new Error(`Internal source reply persistence failed: ${appended.reason}`);
		} finally {
			if (!committed) await removeManagedOutgoingMediaBlocks({
				blocks: mediaBlocks,
				messageId: null
			});
		}
	} finally {
		lease?.release();
	}
}
//#endregion
export { persistInternalSourceReply };
