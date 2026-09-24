import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { ii as validateSessionsActivitySummaryEnsureParams } from "./src-BNV0SJoP.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqKjnbl9.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-CmhrS9-1.mjs";
import { _ as resolveSessionSharingTarget, n as authorizeIncognitoSessionTarget, s as authorizeSessionSharingTarget } from "./session-sharing-policy-gt4OMoUR.mjs";
import { O as prepareSessionSharing } from "./session-sharing-ByqW1ZoJ.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
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
