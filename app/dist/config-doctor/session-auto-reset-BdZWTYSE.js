import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BEuqweC1.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-BYC4PoOZ.js";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-DJ5CkZgB.js";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CyoXvClm.js";
import "./session-accessor-DMf92PxK.js";
import { o as peekSystemEventEntries, t as consumeSelectedSystemEventEntries } from "./system-events-BUr4KJmI.js";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-BxqiEtdk.js";
import { t as clearEmbeddedSessionPromptStates } from "./session-prompt-state-DrtDfyMQ.js";
import { i as clearReplyRunForResetBySessionId } from "./reply-run-registry.registry-HFAU31nF.js";
import "./reply-run-registry-Cvzq21q7.js";
import { t as clearSessionQueues } from "./cleanup-B5BDVG5r.js";
import { n as killSessionSubagentRuns } from "./subagent-control-kill-EhT6TBS6.js";
//#region src/auto-reply/reply/session-reset-cleanup.ts
/** Clears reset-related queues and system events for session keys. */
var SessionResetCleanupError = class extends Error {};
/** Bind runtime cleanup to the parent incarnation accepted before asynchronous work. */
function createSessionResetCleanupGuard(params) {
	const sessionId = params.expectedSession?.sessionId;
	const lifecycleRevision = params.expectedSession?.lifecycleRevision;
	return () => {
		params.assertCurrent?.();
		const current = loadExactSessionEntryReadOnly({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false
		})?.entry;
		if (current?.sessionId !== sessionId || current?.lifecycleRevision !== lifecycleRevision) throw new SessionResetCleanupError("Reset did not complete because the session changed before cleanup. Retry /reset.");
	};
}
/** Reset must report unfinished child cleanup before committing a fresh conversation. */
async function stopSessionResetSubagents(params) {
	try {
		params.assertCurrent();
		const result = await killSessionSubagentRuns(params);
		params.assertCurrent();
		if (result.status === "error") throw new Error(result.error);
	} catch (cause) {
		if (cause instanceof SessionResetCleanupError) throw cause;
		throw new SessionResetCleanupError("Reset did not complete because some subagent tasks could not be stopped. Inspect the remaining tasks and retry /reset.", { cause });
	}
}
/** Clears queued follow-ups and pending system events visible to the resetting agent. */
function clearSessionResetRuntimeState(keys, opts) {
	clearEmbeddedSessionPromptStates(keys);
	const cleared = clearSessionQueues(keys);
	let systemEventsCleared = 0;
	for (const key of cleared.keys) {
		const owner = parseAgentSessionKey(key)?.agentId;
		if (owner && owner !== normalizeAgentId(opts.agentId)) continue;
		const queueKey = resolveSystemEventQueueKey(key, opts.agentId);
		const removed = consumeSelectedSystemEventEntries(queueKey, peekSystemEventEntries(queueKey));
		systemEventsCleared += removed.length;
	}
	if (opts.activeReplySessionId) clearReplyRunForResetBySessionId(opts.activeReplySessionId);
	return {
		...cleared,
		systemEventsCleared
	};
}
//#endregion
//#region src/hooks/session-auto-reset.ts
function isSessionAutoResetReason(reason) {
	return reason === "daily" || reason === "idle";
}
function hasSessionAutoResetListeners() {
	return hasInternalHookListeners("session", "auto-reset");
}
function emitSessionAutoResetHook(params) {
	if (!isSessionAutoResetReason(params.reason) || !hasSessionAutoResetListeners()) return;
	const marker = parseSqliteSessionFileMarker(params.sessionFile);
	const agentId = params.agentId ?? marker?.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const event = createInternalHookEvent("session", "auto-reset", params.sessionKey, {
		cfg: params.cfg,
		agentId,
		workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId),
		storePath: params.storePath ?? marker?.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		sessionEntry: {
			sessionId: params.sessionId,
			sessionFile: params.sessionFile
		},
		reason: params.reason,
		transcriptArchived: params.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey,
		previousSessionMemory: params.previousSessionMemory
	});
	runWithGatewayDetachedWorkContinuation(() => triggerInternalHook(event), "hooks:session-auto-reset").catch((error) => {
		logVerbose(`session:auto-reset hook failed: ${String(error)}`);
	});
}
//#endregion
export { clearSessionResetRuntimeState as a, SessionResetCleanupError as i, hasSessionAutoResetListeners as n, createSessionResetCleanupGuard as o, isSessionAutoResetReason as r, stopSessionResetSubagents as s, emitSessionAutoResetHook as t };
