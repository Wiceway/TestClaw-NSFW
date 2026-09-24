import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as isAcpSessionKey, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { c as resolveSessionAbortTarget, s as markSessionAbortTarget } from "./session-accessor.reset-Cl1Mir1u.js";
import { t as getAcpSessionManager } from "./manager-CGVJjEnt.js";
import { f as listSubagentRunsForController } from "./subagent-registry-read-DD46xgBs.js";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-uAyTpLKT.js";
import "./sessions-4kX-llHk.js";
import { i as resolveCommandAuthorization } from "./command-auth-DG4f34BV.js";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-aQr2GWhq.js";
import { h as replyRunRegistry } from "./reply-run-registry.registry-HFAU31nF.js";
import "./reply-run-registry-Cvzq21q7.js";
import { n as abortEmbeddedAgentRun } from "./runs-CKg3ezhN.js";
import { t as clearSessionQueues } from "./cleanup-B5BDVG5r.js";
import "./queue-BPjvTktD.js";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B6zm9PS3.js";
import { t as killAllControlledSubagentRuns } from "./subagent-control-kill-EhT6TBS6.js";
import "./subagent-control-Br4s_G56.js";
import { a as resolveConversationBindingContextFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-DpEJ4z_3.js";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-BxM8jmK3.js";
import { r as setAbortMemory } from "./abort-primitives-WW-13sK4.js";
//#region src/auto-reply/reply/abort-operation.ts
function abortSessionRunTargetWithOutcome(params) {
	const sessionIds = /* @__PURE__ */ new Set();
	const key = normalizeOptionalString(params.key);
	let active = key ? replyRunRegistry.isActive(key) : false;
	if (key) {
		const activeSessionId = resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId) {
			active = true;
			sessionIds.add(activeSessionId);
		}
	}
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	let aborted = key ? replyRunRegistry.abort(key) : false;
	for (const sessionId of sessionIds) aborted = abortEmbeddedAgentRun(sessionId) || aborted;
	const retirement = !active || aborted ? Promise.all([...sessionIds].map((sessionId) => retireSessionMcpRuntime({
		sessionId,
		reason: "session-stop"
	}))).then(() => void 0) : void 0;
	return {
		active,
		aborted,
		retirement
	};
}
function resolveStoredSessionId(params) {
	const agentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	try {
		return loadSessionEntry({
			agentId,
			clone: false,
			sessionKey: params.sessionKey,
			storePath
		})?.sessionId;
	} catch {
		return;
	}
}
async function resolveBoundAcpAbortTargetSessionKey(params) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	return await resolveEffectiveResetTargetSessionKey({
		cfg: params.cfg,
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId,
		activeSessionKey: params.activeSessionKey,
		skipConfiguredFallbackWhenActiveSessionNonAcp: false,
		fallbackToActiveAcpWhenUnbound: false
	});
}
function normalizeRequesterSessionKey(cfg, key) {
	const cleaned = normalizeOptionalString(key);
	if (!cleaned) return;
	const { mainKey, alias } = resolveMainSessionAlias(cfg);
	return resolveInternalSessionKey({
		key: cleaned,
		alias,
		mainKey
	});
}
async function stopSubagentsForRequester(params) {
	const requesterKey = normalizeRequesterSessionKey(params.cfg, params.requesterSessionKey);
	if (!requesterKey) {
		await params.beforeKill?.();
		return {
			stopped: 0,
			failed: 0
		};
	}
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: requesterKey,
		fallbackAgentId: params.requesterAgentId
	});
	const result = await killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller: {
			controllerSessionKey: requesterKey,
			controllerAgentId,
			callerSessionKey: requesterKey,
			callerIsSubagent: isSubagentSessionKey(requesterKey),
			controlScope: "children"
		},
		runs: listSubagentRunsForController(requesterKey),
		suppressTaskDelivery: true,
		beforeKill: params.beforeKill
	});
	if (result.status === "error") logVerbose(`abort: failed to stop subagents for ${requesterKey}: ${result.error}`);
	if (result.killed > 0) logVerbose(`abort: stopped ${result.killed} subagent run(s) for ${requesterKey}`);
	return {
		stopped: result.killed,
		failed: result.status === "error" ? result.failed : 0
	};
}
async function executeFastAbortRequest(params, request) {
	const { ctx, cfg } = params;
	const { commandSessionKey, targetKey, resolveTargetAgentId } = request;
	const commandAuthorized = ctx.CommandAuthorized;
	const auth = resolveCommandAuthorization({
		ctx,
		cfg,
		commandAuthorized
	});
	if (!auth.isAuthorizedSender) return {
		handled: false,
		aborted: false
	};
	const agentId = resolveTargetAgentId();
	const abortKey = targetKey ?? auth.from ?? auth.to;
	const requesterSessionKey = targetKey ?? ctx.SessionKey ?? abortKey;
	if (targetKey) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const abortCutoffForTarget = (target) => shouldPersistAbortCutoff({
			commandSessionKey,
			targetSessionKey: target.sessionKey
		}) ? resolveAbortCutoffFromContext(ctx) : void 0;
		let resolvedAbortTarget = null;
		try {
			resolvedAbortTarget = resolveSessionAbortTarget({
				agentId,
				sessionKey: targetKey,
				storePath
			});
		} catch (error) {
			logVerbose(`abort: failed to resolve abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
		}
		const resolvedTargetKey = resolvedAbortTarget?.sessionKey ?? targetKey;
		const conversationBoundAcpTargetKey = commandSessionKey ? await resolveBoundAcpAbortTargetSessionKey({
			ctx,
			cfg,
			activeSessionKey: commandSessionKey
		}) : void 0;
		const boundAcpTargetKey = !isAcpSessionKey(resolvedTargetKey) ? conversationBoundAcpTargetKey : void 0;
		const abortTargetKeys = [resolvedTargetKey];
		if (boundAcpTargetKey && boundAcpTargetKey !== resolvedTargetKey) abortTargetKeys.push(boundAcpTargetKey);
		let aborted = false;
		let activeAbortRejected = false;
		const acpCancellations = [];
		try {
			const { stopped, failed } = await stopSubagentsForRequester({
				cfg,
				requesterSessionKey,
				requesterAgentId: agentId,
				beforeKill: () => {
					if (params.isCommandTargetCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
					try {
						const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
						const sessionIdsByKey = new Map(abortTargetKeys.map((abortTargetKey) => [abortTargetKey, replyRunRegistry.resolveSessionId(abortTargetKey) ?? (abortTargetKey === resolvedTargetKey ? resolvedAbortTarget?.sessionId : resolveStoredSessionId({
							cfg,
							sessionKey: abortTargetKey
						}))]));
						for (const abortTargetKey of abortTargetKeys) {
							const outcome = abortSessionRunTargetWithOutcome({
								key: abortTargetKey,
								sessionId: sessionIdsByKey.get(abortTargetKey)
							});
							if (outcome.retirement) acpCancellations.push(outcome.retirement);
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
						const sourceSessionId = sourceAbortKey ? replyRunRegistry.resolveSessionId(sourceAbortKey) ?? resolveStoredSessionId({
							cfg,
							sessionKey: sourceAbortKey
						}) : void 0;
						if (sourceAbortKey) {
							const outcome = abortSessionRunTargetWithOutcome({
								key: sourceAbortKey,
								sessionId: sourceSessionId
							});
							if (outcome.retirement) acpCancellations.push(outcome.retirement);
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
						const cleared = clearSessionQueues(abortTargetKeys.flatMap((abortTargetKey) => [abortTargetKey, sessionIdsByKey.get(abortTargetKey)]).concat(sourceAbortKey, sourceSessionId));
						if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
					} finally {
						const acpManager = getAcpSessionManager();
						for (const acpTargetKey of abortTargetKeys) {
							const resolution = acpManager.resolveSession({
								cfg,
								sessionKey: acpTargetKey,
								agentId: acpTargetKey === resolvedTargetKey ? agentId : void 0
							});
							if (resolution.kind === "none") continue;
							acpCancellations.push(acpManager.cancelSession({
								cfg,
								sessionKey: resolution.sessionKey,
								agentId: resolution.agentId,
								reason: "fast-abort"
							}).catch((error) => {
								logVerbose(`abort: ACP cancel failed for ${acpTargetKey}: ${formatErrorMessage(error)}`);
							}));
						}
					}
					return true;
				}
			});
			const rejectionReason = activeAbortRejected && !aborted ? "finalizing" : void 0;
			if (!rejectionReason) {
				let persistedAbortTarget = null;
				try {
					persistedAbortTarget = await markSessionAbortTarget({
						isCurrent: params.isCommandTargetCurrent,
						scope: {
							agentId,
							sessionKey: targetKey,
							storePath
						},
						resolveAbortCutoff: abortCutoffForTarget
					});
				} catch (error) {
					logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
				}
				if (persistedAbortTarget?.persisted === false) logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${persistedAbortTarget.persistenceError ?? "unknown error"}`);
				const abortMemoryKey = persistedAbortTarget?.sessionKey ?? resolvedAbortTarget?.sessionKey ?? abortKey;
				const hasAbortTargetEntry = Boolean(persistedAbortTarget?.entry ?? resolvedAbortTarget?.entry);
				if (persistedAbortTarget?.persisted !== true && abortMemoryKey && !hasAbortTargetEntry && params.isCommandTargetCurrent?.() !== false) setAbortMemory(abortMemoryKey, true);
			}
			return {
				handled: true,
				aborted,
				...rejectionReason ? { rejectionReason } : {},
				stoppedSubagents: stopped,
				failedSubagents: failed
			};
		} finally {
			await Promise.all(acpCancellations);
		}
	}
	if (abortKey) setAbortMemory(abortKey, true);
	const { stopped, failed } = await stopSubagentsForRequester({
		cfg,
		requesterSessionKey
	});
	return {
		handled: true,
		aborted: false,
		stoppedSubagents: stopped,
		failedSubagents: failed
	};
}
//#endregion
export { executeFastAbortRequest as n, stopSubagentsForRequester as r, abortSessionRunTargetWithOutcome as t };
