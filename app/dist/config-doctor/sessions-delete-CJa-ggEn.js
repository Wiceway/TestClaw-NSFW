import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { S as tryResolveAgentOperationAgentId } from "./agent-scope-config-BEuqweC1.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-cXJW6Bip.js";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import "./session-accessor-DMf92PxK.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { ci as validateSessionsDeleteParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as isAgentHarnessSessionKey } from "./agent-harness-session-key-Bbf-OONo.js";
import { o as rollbackPluginOwnedSessionEntryLifecycle, r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-DroV7NMI.js";
import { s as isModelSelectionLocked } from "./model-overrides-D92VyxpR.js";
import { a as handleSessionStateSessionDeleted } from "./session-state-events-CHD4f1I_.js";
import "./sessions-4kX-llHk.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-DpcRUIUy.js";
import { i as loadGatewaySessionEntryReadOnly, r as loadGatewaySessionEntry } from "./session-utils-store-DlmWzvmc.js";
import { a as prepareSessionWorkerPlacementRetirement } from "./session-placement-lifecycle-Bsc-2bR7.js";
import "./session-utils-DyRtmfj4.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-CdomsX5F.js";
import { r as emitSessionsChanged } from "./session-change-event-CmKIAN5R.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { c as resolveGatewaySessionTargetFromKey, i as loadAccessorSessionEntryForGatewayTarget, n as isAgentMainSessionKey, o as loadSessionsRuntimeModule, s as requireSessionKey } from "./sessions-shared-C5bHh15Q.js";
import { r as removeSessionWorktree } from "./session-worktree-lifecycle-D8RJmK_D.js";
import { n as prepareSessionLifecycleDrain, t as SessionLifecycleWorkspaceRecoveryError } from "./sessions-lifecycle-drain-D0AAlVvx.js";
//#region src/gateway/server-methods/sessions-delete.ts
var SessionDeletionError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
const sessionDeleteHandlers = { "sessions.delete": async ({ params, respond, client, context, sessionMutationAuthorization }) => {
	if (!assertValidParams(params, validateSessionsDeleteParams, "sessions.delete", respond)) return;
	const p = params;
	const key = requireSessionKey(p.key, respond);
	if (!key) return;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
	const compatibilityDefaultAgentId = tryResolveAgentOperationAgentId(cfg);
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	const protectedGlobalAgentId = persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : compatibilityDefaultAgentId;
	const explicitlySelectedGlobalAgentId = normalizeOptionalString(p.agentId) ?? parseAgentSessionKey(key)?.agentId;
	const isSelectedNonDefaultGlobal = target.canonicalKey === "global" && explicitlySelectedGlobalAgentId !== void 0 && normalizeAgentId(explicitlySelectedGlobalAgentId) !== protectedGlobalAgentId;
	const isMainSession = target.canonicalKey !== "global" && isAgentMainSessionKey(cfg, target.canonicalKey);
	if ((target.canonicalKey === "global" || isMainSession) && !isSelectedNonDefaultGlobal) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Cannot delete the main session (${target.canonicalKey}).`));
		return;
	}
	const deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
	const initialDeleteEntry = loadGatewaySessionEntry(key, { agentId: requestedAgentId }).entry;
	const expectedSessionId = p.expectedSessionId?.trim();
	const expectedLifecycleRevision = p.expectedLifecycleRevision?.trim();
	const sessionChangedError = () => errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before deletion. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
	const resolveEntryError = (entry) => {
		const deletablePluginOwnedSession = normalizeOptionalString(entry?.pluginOwnerId) !== void 0 && entry?.agentHarnessId === void 0 && !isAgentHarnessSessionKey(target.canonicalKey);
		if (isModelSelectionLocked(entry) && !deletablePluginOwnedSession) return errorShape(ErrorCodes.INVALID_REQUEST, "This session cannot be deleted while model selection is locked.");
		if (p.archivedOnly === true && entry?.archivedAt === void 0) return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`);
		if (expectedSessionId && entry?.sessionId !== expectedSessionId || expectedLifecycleRevision && entry?.lifecycleRevision !== expectedLifecycleRevision) return sessionChangedError();
		return resolvePluginSessionOwnershipError({
			action: "delete",
			entry,
			key: target.canonicalKey,
			pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
		});
	};
	const initialError = resolveEntryError(initialDeleteEntry);
	if (initialError) {
		respond(false, void 0, initialError);
		return;
	}
	const { cleanupSessionBeforeMutation, emitGatewaySessionEndPluginHook, emitSessionUnboundLifecycleEvent } = await loadSessionsRuntimeModule();
	const assertCurrent = () => {
		sessionMutationAuthorization?.assertCurrent();
		const current = loadGatewaySessionEntryReadOnly(key, { agentId: requestedAgentId });
		if (current.storePath !== storePath || current.canonicalKey !== target.canonicalKey || current.entry?.sessionId !== initialDeleteEntry?.sessionId || current.entry?.lifecycleRevision !== initialDeleteEntry?.lifecycleRevision) throw new SessionDeletionError(sessionChangedError());
		const error = resolveEntryError(current.entry);
		if (error) throw new SessionDeletionError(error);
		return current;
	};
	const deleteLifecycleIdentities = [
		target.canonicalKey,
		key,
		...target.storeKeys,
		initialDeleteEntry?.sessionId,
		expectedSessionId
	];
	let drain;
	let deletedWorktreeId;
	let worktreePreserved;
	const deleteCurrent = async () => {
		try {
			const current = assertCurrent();
			try {
				drain = await prepareSessionLifecycleDrain({
					action: "delete",
					authorize: assertCurrent,
					beforeCancel: () => {
						if (p.expectedSessionUpdatedAt !== void 0 && assertCurrent().entry?.updatedAt !== p.expectedSessionUpdatedAt) throw new SessionDeletionError(sessionChangedError());
					},
					context,
					storePath,
					sessionKeys: Array.from(/* @__PURE__ */ new Set([
						key,
						target.canonicalKey,
						...target.storeKeys
					])),
					sessionId: current.entry?.sessionId,
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					defaultAgentId: compatibilityDefaultAgentId,
					lifecycleIdentities: deleteLifecycleIdentities.filter((identity) => Boolean(identity))
				});
			} catch (error) {
				assertCurrent();
				if (error instanceof SessionDeletionError) throw error;
				if (error instanceof SessionLifecycleWorkspaceRecoveryError) throw new SessionDeletionError(error.error);
				throw new SessionDeletionError(errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} could not safely stop before deletion: ${formatErrorMessage(error)} Retry after active work or worker recovery finishes.`, { retryable: true }));
			}
			return await runExclusiveSessionLifecycleMutation({
				scope: storePath,
				identities: deleteLifecycleIdentities,
				prepare: async () => drain?.handoffToMutation(),
				finalize: async () => drain?.release(),
				run: async () => {
					const { entry, legacyKey, canonicalKey } = assertCurrent();
					const retirement = prepareSessionWorkerPlacementRetirement({
						context,
						sessionId: entry?.sessionId
					});
					const commitGuard = () => {
						assertCurrent();
						retirement.assertCurrent();
						if (drain?.hasAuthoritativeWork()) throw new SessionDeletionError(errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`, { retryable: true }));
					};
					commitGuard();
					const mutationCleanupError = await cleanupSessionBeforeMutation({
						cfg,
						key,
						target,
						entry,
						legacyKey,
						canonicalKey,
						reason: "session-delete",
						assertCurrent: commitGuard
					});
					if (mutationCleanupError) throw new SessionDeletionError(mutationCleanupError);
					const postCleanupTarget = loadAccessorSessionEntryForGatewayTarget({
						key,
						cfg,
						agentId: requestedAgentId
					});
					const postCleanupEntry = postCleanupTarget.entry;
					deletedWorktreeId = normalizeOptionalString(postCleanupEntry?.worktree?.id);
					commitGuard();
					const pluginOwnerId = normalizeOptionalString(postCleanupEntry?.pluginOwnerId);
					const incognito = postCleanupEntry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
					const deletionParams = {
						agentId: target.agentId,
						archiveTranscript: incognito ? false : deleteTranscript,
						commitGuard,
						deleteDeliveryArtifacts: true,
						deleteTranscriptWithoutArchive: incognito,
						expectedEntry: postCleanupEntry,
						expectedLifecycleRevision,
						expectedSessionId: initialDeleteEntry?.sessionId ?? null,
						expectedUpdatedAt: postCleanupEntry?.updatedAt,
						storePath,
						target: {
							canonicalKey: target.canonicalKey,
							storeKeys: target.storeKeys
						}
					};
					const result = postCleanupEntry && pluginOwnerId && isModelSelectionLocked(postCleanupEntry) ? await rollbackPluginOwnedSessionEntryLifecycle({
						...deletionParams,
						expectedEntry: postCleanupEntry,
						expectedPluginOwnerId: pluginOwnerId,
						target: {
							canonicalKey: postCleanupTarget.target.canonicalKey,
							storeKeys: postCleanupTarget.target.storeKeys
						}
					}) : await deleteSessionEntryLifecycle(deletionParams);
					if (result.expectedEntryMismatch) throw new SessionDeletionError(sessionChangedError());
					if (result.deleted) {
						retirement.retire();
						emitGatewaySessionEndPluginHook({
							cfg,
							sessionKey: target.canonicalKey ?? key,
							sessionId: result.deletedSessionId,
							storePath,
							agentId: target.agentId,
							reason: "deleted",
							archivedTranscripts: result.archivedTranscripts
						});
						await emitSessionUnboundLifecycleEvent({
							targetSessionKey: target.canonicalKey ?? key,
							reason: "session-delete",
							emitHooks: p.emitLifecycleHooks !== false
						});
						const deletedSessionKey = target.canonicalKey ?? key;
						handleSessionStateSessionDeleted(deletedSessionKey, requestedAgentId);
						worktreePreserved = await removeSessionWorktree({
							id: deletedWorktreeId,
							sessionKey: deletedSessionKey,
							reason: "session-delete"
						});
					}
					return result;
				}
			});
		} finally {
			drain?.release();
		}
	};
	const deletion = await deleteCurrent().catch((error) => {
		if (!(error instanceof SessionDeletionError)) throw error;
		respond(false, void 0, error.error);
	});
	if (!deletion) return;
	const deleted = deletion.deleted;
	const archived = deletion.archivedTranscripts.map((entryLocal) => entryLocal.archivedPath);
	respond(true, {
		ok: true,
		key: target.canonicalKey,
		deleted,
		archived,
		...worktreePreserved ? { worktreePreserved } : {}
	}, void 0);
	if (deleted) {
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			sessionId: deletion.deletedSessionId,
			agentId: target.agentId,
			reason: "delete"
		});
		emitSessionsChanged(context, { reason: "delete" });
	}
} };
//#endregion
export { sessionDeleteHandlers as t };
