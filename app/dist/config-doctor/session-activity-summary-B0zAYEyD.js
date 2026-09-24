import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { qr as validateSessionsActivitySummaryEnsureParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { r as hasOperatorBoundary } from "./operator-role-policy-gPgbkoHA.js";
import { _ as resolveSessionSharingTarget, n as authorizeIncognitoSessionTarget, s as authorizeSessionSharingTarget } from "./session-sharing-policy-rVme8bnl.js";
import { O as prepareSessionSharing } from "./session-sharing-xa1VG8U2.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
//#region src/gateway/server-methods/session-activity-summary.ts
const sessionActivitySummaryHandlers = { "sessions.activitySummary.ensure": ({ params, client, context, respond }) => {
	if (!assertValidParams(params, validateSessionsActivitySummaryEnsureParams, "sessions.activitySummary.ensure", respond)) return;
	const service = context.sessionActivitySummaries;
	if (!service) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Activity recaps are unavailable."));
		return;
	}
	const cfg = context.getRuntimeConfig();
	const sharing = prepareSessionSharing({
		client,
		cfg
	});
	const targets = [];
	for (const requested of params.sessions) {
		const agent = resolveRequestedSessionAgentId(cfg, requested.key, requested.agentId);
		if (!agent.ok) {
			respond(false, void 0, agent.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: requested.key,
			agentId: agent.agentId
		});
		if (!target || hasOperatorBoundary(client, cfg) && sharing.entryFilter?.(target.canonicalKey, target.entry) === false) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable."));
			return;
		}
		const error = authorizeIncognitoSessionTarget({
			client,
			sessionKey: requested.key,
			target
		}) ?? authorizeSessionSharingTarget({
			cfg,
			client,
			target
		});
		if (error) {
			respond(false, void 0, error);
			return;
		}
		targets.push({
			key: target.canonicalKey,
			agentId: target.agentId
		});
	}
	respond(true, { sessions: targets.map((target) => ({
		key: target.key,
		agentId: target.agentId,
		activitySummary: {
			...service.ensure(target),
			canEnsure: true
		}
	})) });
} };
//#endregion
export { sessionActivitySummaryHandlers };
