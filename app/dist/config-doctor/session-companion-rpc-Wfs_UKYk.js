import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { ai as validateSessionsCompanionResetParams, ii as validateSessionsCompanionAskParams, oi as validateSessionsCompanionStateParams } from "./validator-registry-Dpl5QmuY.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { i as resolveSessionStoreKey } from "./session-store-key-DRl7Rrsc.js";
import { _ as resolveSessionSharingTarget, d as hiddenSessionNotFound } from "./session-sharing-policy-rVme8bnl.js";
import { O as prepareSessionSharing } from "./session-sharing-xa1VG8U2.js";
import { t as SessionCompanionAskError } from "./session-companion-ask-BNFhUx2n.js";
//#region src/gateway/session-companion-rpc.ts
function resolveCompanionTarget(params, context) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) return requested;
	return {
		ok: true,
		agentId: requested.agentId,
		sessionKey: resolveSessionStoreKey({
			cfg,
			sessionKey: params.sessionKey,
			storeAgentId: requested.agentId
		})
	};
}
function companionTargetIsVisible(target, client, context) {
	if (client?.connId && context.isConnectionActive?.(client.connId) === false) return false;
	const cfg = context.getRuntimeConfig();
	const sharingTarget = resolveSessionSharingTarget({
		cfg,
		sessionKey: target.sessionKey,
		agentId: target.agentId
	});
	if (!sharingTarget) return cfg.gateway?.roles === void 0;
	return prepareSessionSharing({
		client,
		cfg
	}).entryFilter?.(sharingTarget.storeKey, sharingTarget.entry) !== false;
}
const sessionCompanionHandlers = {
	"sessions.companion.ask": async ({ params, respond, client, context, signal }) => {
		if (!validateSessionsCompanionAskParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.ask params: ${formatValidationErrors(validateSessionsCompanionAskParams.errors)}`));
			return;
		}
		const { sessionKey, agentId, question } = params;
		if (!question.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "question must contain non-whitespace text"));
			return;
		}
		if (!client?.connId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Side chat questions require a connected client."));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		if (!companionTargetIsVisible(target, client, context)) {
			respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
			return;
		}
		const assertSourceCurrent = () => {
			if (!companionTargetIsVisible(target, client, context)) throw new SessionCompanionAskError("session-missing", "Side chat is unavailable.");
		};
		try {
			respond(true, await context.sessionCompanion.ask({
				sessionKey: target.sessionKey,
				agentId: target.agentId,
				question,
				connId: client.connId,
				assertSourceCurrent,
				...signal ? { signal } : {}
			}));
		} catch (error) {
			if (!(error instanceof SessionCompanionAskError)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat could not answer right now."));
				return;
			}
			if (error.reason === "busy") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
					details: { code: GatewayErrorDetailCodes.SESSION_COMPANION_BUSY },
					retryable: true
				}));
				return;
			}
			const retryable = error.reason === "rate-limited" || error.reason === "context-unavailable";
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
				details: { reason: error.reason },
				retryable,
				...error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : {}
			}));
		}
	},
	"sessions.companion.state": ({ params, respond, client, context }) => {
		if (!validateSessionsCompanionStateParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.state params: ${formatValidationErrors(validateSessionsCompanionStateParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		if (!companionTargetIsVisible(target, client, context)) {
			respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
			return;
		}
		respond(true, context.sessionCompanion.state({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		}));
	},
	"sessions.companion.reset": ({ params, respond, context }) => {
		if (!validateSessionsCompanionResetParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.reset params: ${formatValidationErrors(validateSessionsCompanionResetParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		context.sessionCompanion.reset({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		});
		respond(true, { ok: true });
	}
};
//#endregion
export { sessionCompanionHandlers };
