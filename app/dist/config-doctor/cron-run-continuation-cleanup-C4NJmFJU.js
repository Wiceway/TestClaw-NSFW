import { S as parseCronRunScopeSuffix, c as resolveAgentIdFromSessionKey } from "./session-key-AvQIavYt.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-CFq48PcN.js";
import "./session-accessor-DMf92PxK.js";
import { r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-DroV7NMI.js";
import { c as hasDescendantRunAwaitingSettle } from "./subagent-registry-read-DD46xgBs.js";
import { a as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-saQ8mgsA.js";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-DeSSrS9n.js";
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
