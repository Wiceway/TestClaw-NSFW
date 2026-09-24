import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./session-key-AvQIavYt.js";
import { t as AssistantStateLeaseAcquisitionError } from "./testclaw-state-lease-error-LeoKUUrG.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Fr as validateSessionGitHubPublishParams, Ir as validateSessionGitHubStatusParams, Nr as validateSessionGitHubConfirmParams, Pr as validateSessionGitHubOptionsParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-BrVUu-N_.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DlmWzvmc.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import "./session-sharing-xa1VG8U2.js";
import "./session-utils-DyRtmfj4.js";
import { a as prepareCurrentGitHubPublicationOptionsIdentity } from "./github-publication-availability-DCPDRC4e.js";
import { n as GitHubPublicationKnownFailure } from "./github-publication-failure-BfGp2TaA.js";
import { t as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation-CZfnPR1A.js";
import { n as defineValidatedGatewayMethod } from "./validation-BZLpfukT.js";
import { t as captureGitHubPublicationRequester } from "./github-publication-requester-CAiHlvdD.js";
import { r as preparePersonalGitHubSessionAction, t as prepareGitHubPublicationOptionsRead } from "./github-personal-authorization-DV4x5FIr.js";
//#region src/gateway/server-methods/sessions-github.ts
const sessionGitHubFailureMessages = {
	"sessions.github.publish": "GitHub publication request failed",
	"sessions.github.options": "GitHub publication options are unavailable.",
	"sessions.github.status": "GitHub publication status is unavailable.",
	"sessions.github.confirm": "GitHub publication confirmation failed."
};
function defineSessionGitHubMethod(...[method, validate, handler]) {
	return defineValidatedGatewayMethod(method, validate, async (options) => {
		const { agentId, sessionKey } = options.params;
		const key = sessionKey ?? getGatewayToolCallerIdentity()?.sessionKey;
		if (agentId !== void 0 && key) {
			const owner = resolveRequestedSessionAgentId(options.context.getRuntimeConfig(), key, agentId);
			if (!owner.ok) {
				options.respond(false, void 0, owner.error);
				return;
			}
		}
		try {
			return await handler(options);
		} catch (error) {
			const publishing = method === "sessions.github.publish";
			if (publishing && error instanceof SessionMutationAuthorizationChangedError) throw error;
			const acquisition = error instanceof AssistantStateLeaseAcquisitionError ? error.outcome : void 0;
			const busy = error instanceof SessionWorkspaceReservationBusyError;
			const forbidden = acquisition ? acquisition.kind === "held" : !publishing && !busy;
			options.respond(false, void 0, errorShape(forbidden ? ErrorCodes.FORBIDDEN : ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : sessionGitHubFailureMessages[method], acquisition ? {
				retryable: acquisition.kind === "store-unavailable",
				details: { leaseAcquisition: acquisition }
			} : busy ? { retryable: true } : publishing && error instanceof GitHubPublicationKnownFailure && "idempotencyKey" in options.params && error.rejection?.idempotencyKey === options.params.idempotencyKey ? { details: error.rejection } : void 0));
		}
	});
}
const sessionsGitHubHandlers = {
	"sessions.github.publish": defineSessionGitHubMethod("sessions.github.publish", validateSessionGitHubPublishParams, async (options) => {
		const { params, respond, context, sessionMutationAuthorization } = options;
		const coordinator = context.githubPublicationService;
		if (!coordinator) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication is unavailable on this Gateway"));
			return;
		}
		const caller = getGatewayToolCallerIdentity();
		const sessionKey = caller?.sessionKey ?? params.sessionKey;
		if (!sessionKey || caller && params.sessionKey && params.sessionKey !== caller.sessionKey || caller && params.agentId && normalizeAgentId(params.agentId) !== normalizeAgentId(caller.agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session is invalid"));
			return;
		}
		const agentId = caller?.agentId ?? params.agentId;
		if (params.selection?.source === "personal") {
			if (!params.sessionKey) throw new Error("My GitHub publication requires an explicit session.");
			const action = preparePersonalGitHubSessionAction(options, {
				sessionKey: params.sessionKey,
				agentId
			});
			const result = await coordinator.requestPersonalForSession(params, action);
			action.assertCurrent();
			respond(true, result);
			return;
		}
		const loaded = loadGatewaySessionEntryReadOnly(sessionKey, agentId ? { agentId } : void 0);
		if (!loaded.entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session was not found"));
			return;
		}
		sessionMutationAuthorization?.assertCurrent();
		const session = {
			sessionKey: loaded.canonicalKey,
			agentId: caller?.agentId ?? loaded.agentId
		};
		const admitted = await captureGitHubPublicationRequester(options, session);
		try {
			const result = await coordinator.requestForSession({
				...params,
				...session,
				requester: admitted.requester,
				...caller?.operationalRunInstance?.runId ? { expectedRunId: caller.operationalRunInstance.runId } : {}
			});
			sessionMutationAuthorization?.assertCurrent();
			respond(true, result);
		} finally {
			admitted.release();
		}
	}),
	"sessions.github.options": defineSessionGitHubMethod("sessions.github.options", validateSessionGitHubOptionsParams, async (options) => {
		const read = prepareGitHubPublicationOptionsRead(options, options.params);
		const coordinator = options.context.githubPublicationService;
		if (!coordinator) {
			options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup."));
			return;
		}
		let shared = null;
		try {
			const identity = await prepareCurrentGitHubPublicationOptionsIdentity(read.session.agentId);
			shared = {
				source: identity.source,
				accountId: identity.account.accountId,
				login: identity.account.login
			};
		} catch {}
		const service = options.context.githubOAuthService?.personal;
		if (read.personal.kind === "eligible" && !service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const action = read.personal.kind === "eligible" ? read.personal.action : null;
		let personal = action ? await service.status(action) : null;
		const session = read.currentSession();
		const pendingPersonal = action ? await coordinator.personalPending(action, session) : null;
		read.currentSession();
		if (action && personal) personal = service.revalidateStatus(action, personal);
		const latestShared = coordinator.latestShared(session, options.params.idempotencyKey);
		read.currentSession();
		options.respond(true, {
			personal,
			shared,
			pendingPersonal,
			latestShared
		});
	}),
	"sessions.github.status": defineSessionGitHubMethod("sessions.github.status", validateSessionGitHubStatusParams, (options) => {
		const read = prepareGitHubPublicationOptionsRead(options, options.params);
		const service = options.context.githubPublicationService;
		if (!service) {
			options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup."));
			return;
		}
		const session = read.currentSession();
		const shared = service.sharedStatus(session, options.params.requestId);
		if (shared) {
			read.currentSession();
			options.respond(true, shared);
			return;
		}
		if (read.personal.kind !== "eligible") throw new Error("GitHub publication was not found for this session and caller.");
		const result = service.personalStatus(read.personal.action, session, options.params.requestId);
		read.currentSession();
		options.respond(true, result);
	}),
	"sessions.github.confirm": defineSessionGitHubMethod("sessions.github.confirm", validateSessionGitHubConfirmParams, async (options) => {
		const action = preparePersonalGitHubSessionAction(options, options.params);
		const service = options.context.githubPublicationService;
		if (!service) throw new Error("GitHub publication is unavailable.");
		const result = await service.confirmPersonal(options.params, action);
		action.assertCurrent();
		options.respond(true, result);
	})
};
//#endregion
export { sessionsGitHubHandlers };
