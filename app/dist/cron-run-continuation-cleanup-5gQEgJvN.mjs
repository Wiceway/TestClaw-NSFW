import { C as parseCronRunScopeSuffix, l as resolveAgentIdFromSessionKey } from "./session-key-C_bfgyCp.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { l as resolveSessionStorePathCore } from "./paths-D1bkI3aW.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-WwqMA2rD.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import { r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-CLkkNgWt.mjs";
import { c as hasDescendantRunAwaitingSettle } from "./subagent-registry-read-PBgGP-fW.mjs";
import { a as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-uRVY2RrR.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-loIz0kog.mjs";
//#region src/tasks/cron-run-continuation-cleanup.ts
/** Removes an idle exact-run continuation through the session lifecycle owner. */
function canRemoveCronRunContinuation(marker) {
	if (!marker || marker.basePersisted !== true) return false;
	if (marker.phase === "ready") return !marker.ownerRunId;
	if (marker.phase !== "continuing" || !marker.ownerRunId) return false;
	const ownerLifecycleGeneration = marker.ownerLifecycleGeneration?.trim();
	return Boolean(ownerLifecycleGeneration && ownerLifecycleGeneration !== getAgentEventLifecycleGeneration());
}
async function removeCronRunContinuationSessionIfIdle(sessionKey, settledDeliveryId, queueContext) {
	if (!parseCronRunScopeSuffix(sessionKey).runId || hasPendingGeneratedMediaTaskForSessionKey(sessionKey)) return;
	const pendingSessionDeliveries = await loadPendingSessionDeliveries(queueContext ?? captureAssistantStateWorkerContext());
	if (hasDescendantRunAwaitingSettle(sessionKey) || pendingSessionDeliveries.some((entry) => entry.sessionKey === sessionKey && entry.id !== settledDeliveryId && entry.settlementOutcome === void 0 && entry.acknowledgedAt === void 0)) return;
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const cfg = getRuntimeConfig();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const entry = loadSessionEntry({
		agentId,
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const marker = entry?.cronRunContinuation;
	if (!entry || !canRemoveCronRunContinuation(marker)) return;
	await deleteSessionEntryLifecycle({
		agentId,
		commitGuard: () => {
			if (hasDescendantRunAwaitingSettle(sessionKey)) throw new Error("cron run continuation still has unsettled subagents");
		},
		archiveTranscript: false,
		expectedEntry: entry,
		expectedLifecycleRevision: entry.lifecycleRevision,
		expectedSessionId: entry.sessionId,
		expectedUpdatedAt: entry.updatedAt,
		requireWriteSuccess: true,
		storePath,
		target: {
			canonicalKey: sessionKey,
			storeKeys: [sessionKey]
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
