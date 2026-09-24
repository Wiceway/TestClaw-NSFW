import { a as handleTrustedInternalChatSend } from "./chat-send-handler-DFw7rk4R.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Pi as validateSessionsRecoverParams } from "./validator-registry-Dpl5QmuY.js";
import { g as resolveOperatorSessionCreation } from "./operator-role-policy-gPgbkoHA.js";
import { a as withSessionMutationCommitGuard, i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-EqzBBshC.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-xa1VG8U2.js";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.js";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-wYoRaPUW.js";
import { n as emitSessionArchived, r as emitSessionsChanged } from "./session-change-event-CmKIAN5R.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-CC8O7V7B.js";
import { n as recoverGatewaySession } from "./session-recovery-service-6XINLLzz.js";
//#region src/gateway/server-methods/session-recovery-continuation.ts
const RECOVERY_CONTINUATION_TEXT = "Continue from the recovered transcript and finish the interrupted work.";
/** Starts the fixed recovery continuation as trusted system input. */
async function launchSessionRecoveryContinuation(params) {
	let outcome;
	try {
		const destination = resolveSessionMutationAuthorization({
			client: params.client,
			context: params.context,
			method: "chat.send",
			requestParams: {
				agentId: params.agentId,
				sessionKey: params.sessionKey
			},
			expectedTarget: {
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				storePath: params.storePath
			},
			sessionScope: params.sessionScope
		});
		if (destination.error) return {
			status: "rejected",
			error: destination.error
		};
		const destinationAuthorization = withSessionMutationCommitGuard(destination.authorization, params.commitGuard, void 0);
		if (!destinationAuthorization) return {
			status: "rejected",
			error: errorShape(ErrorCodes.UNAVAILABLE, "Continuation authorization was not prepared.")
		};
		await handleTrustedInternalChatSend({
			req: params.req,
			params: {
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				sessionId: params.sessionId,
				message: formatSystemTurnPrompt(RECOVERY_CONTINUATION_TEXT),
				idempotencyKey: params.idempotencyKey,
				deliver: false,
				suppressCommandInterpretation: true,
				systemInputProvenance: {
					kind: "internal_system",
					sourceSessionKey: params.sessionKey,
					sourceTool: "sessions.recover"
				}
			},
			respond: (ok, payload, error) => {
				const response = payload;
				const runId = ok && response && typeof response.runId === "string" ? response.runId.trim() : "";
				outcome = ok && runId ? {
					status: "started",
					runId
				} : {
					status: "rejected",
					error: error ?? errorShape(ErrorCodes.UNAVAILABLE, "Continuation was not started.")
				};
			},
			context: params.context,
			client: params.client,
			...params.hasCurrentClientAuthority ? { hasCurrentClientAuthority: params.hasCurrentClientAuthority } : {},
			isWebchatConnect: () => false,
			sessionMutationAuthorization: destinationAuthorization
		}, params.commitGuard ? async () => {
			params.commitGuard?.();
			return true;
		} : void 0);
	} catch (error) {
		outcome = {
			status: "rejected",
			error: error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Continuation authority check failed.")
		};
	}
	return outcome ?? {
		status: "rejected",
		error: errorShape(ErrorCodes.UNAVAILABLE, "Continuation returned no outcome.")
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-recover.ts
const sessionRecoverHandlers = { "sessions.recover": async (options) => {
	const { req, params, respond, client, context, hasCurrentClientAuthority, sessionMutationAuthorization } = options;
	if (!assertValidParams(params, validateSessionsRecoverParams, "sessions.recover", respond)) return;
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const commitGuard = authority.commitGuard || sessionMutationAuthorization ? () => {
		authority.commitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
	} : void 0;
	const creation = resolveOperatorSessionCreation(client);
	const recovered = await recoverGatewaySession({
		cfg: context.getRuntimeConfig(),
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		...creation.actor ? { actor: creation.actor } : {},
		...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
		...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
		authorizedPluginId: client?.internal?.pluginRuntimeOwnerId,
		...commitGuard ? { commitGuard } : {},
		workerPlacementContext: resolveSessionWorkerPlacementContext(context),
		launchContinuation: async (continuation) => await launchSessionRecoveryContinuation({
			...continuation,
			client,
			...commitGuard ? { commitGuard } : {},
			context,
			...hasCurrentClientAuthority ? { hasCurrentClientAuthority } : {},
			req,
			sessionScope: readGatewayRequestMutationAuthority(options).sessionScope
		})
	}).catch((error) => authority.handleClosedError(error));
	if (!recovered) return;
	if (!recovered.ok) {
		respond(false, void 0, recovered.error);
		return;
	}
	if (recovered.sourceKey !== recovered.successorKey) emitSessionArchived(context, recovered.sourceKey, recovered.sourceKey === "global" ? recovered.agentId : void 0);
	emitSessionsChanged(context, {
		sessionKey: recovered.successorKey,
		reason: recovered.created ? "create" : "recovery",
		...recovered.successorKey === "global" ? { agentId: recovered.agentId } : {}
	});
	respond(true, {
		ok: true,
		key: recovered.successorKey,
		sessionId: recovered.successorEntry.sessionId,
		continuation: recovered.continuation
	}, void 0);
} };
//#endregion
export { sessionRecoverHandlers };
