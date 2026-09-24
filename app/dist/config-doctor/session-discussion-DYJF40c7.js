import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import "./plugin-instance-scope-B1RUw70q.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Ar as validateSessionDiscussionInfoResult, Mr as validateSessionDiscussionOpenResult, jr as validateSessionDiscussionOpenParams, kr as validateSessionDiscussionInfoParams } from "./validator-registry-Dpl5QmuY.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRl7Rrsc.js";
import { s as getActivePluginChannelRegistry } from "./runtime-B980B6n3.js";
import { t as formatForLog } from "./ws-log-CZGKk4Rg.js";
import { t as hasExplicitSessionName } from "./session-title-state-DS7JC3mN.js";
import { r as emitSessionsChanged } from "./session-change-event-CmKIAN5R.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-C5bHh15Q.js";
import { a as maybeGenerateSessionTitle } from "./dashboard-session-title-Bq6mnT9F.js";
createSubsystemLogger("plugins/session-discussion");
function getSessionDiscussionProvider() {
	return getActivePluginChannelRegistry()?.sessionDiscussionProviders.values().next().value?.provider;
}
//#endregion
//#region src/gateway/server-methods/session-discussion.ts
const DISCUSSION_TITLE_TIMEOUT_MS = 1e4;
async function maybeGenerateTitleBeforeDiscussionOpen(params) {
	try {
		const cfg = params.context.getRuntimeConfig();
		const resolved = loadAccessorSessionEntryForGatewayTarget({
			cfg,
			key: params.sessionKey,
			agentId: params.agentId
		});
		const { entry } = resolved;
		const sessionId = entry?.sessionId;
		if (!entry || !sessionId || hasExplicitSessionName(entry)) return;
		const observedTitleRequest = maybeGenerateSessionTitle({
			cfg,
			agentId: resolved.target.agentId,
			entry,
			sessionId,
			sessionKey: resolved.canonicalKey,
			storePath: resolved.storePath,
			userMessage: ""
		}).catch((error) => {
			params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
			return false;
		});
		let timeout;
		let persisted;
		try {
			persisted = await Promise.race([observedTitleRequest, new Promise((resolve) => {
				timeout = setTimeout(() => resolve(false), DISCUSSION_TITLE_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			clearTimeout(timeout);
		}
		if (persisted) emitSessionsChanged(params.context, {
			sessionKey: resolved.canonicalKey,
			agentId: resolved.target.agentId,
			reason: "chat.title"
		});
	} catch (error) {
		params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
	}
}
function sessionDiscussionHandler(operation) {
	const method = operation === "info" ? "session.discussion.info" : "session.discussion.open";
	const validateParams = operation === "info" ? validateSessionDiscussionInfoParams : validateSessionDiscussionOpenParams;
	const validateResult = operation === "info" ? validateSessionDiscussionInfoResult : validateSessionDiscussionOpenResult;
	return async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateParams, method, respond)) return;
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			if (operation === "open") await maybeGenerateTitleBeforeDiscussionOpen({
				context,
				sessionKey: params.sessionKey,
				agentId: requestedAgent.agentId
			});
			const sessionKey = resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: requestedAgent.agentId,
				sessionKey: params.sessionKey
			});
			const result = await provider[operation]({
				sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!validateResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid ${method} result: ${formatValidationErrors(validateResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	};
}
const sessionDiscussionHandlers = {
	"session.discussion.info": sessionDiscussionHandler("info"),
	"session.discussion.open": sessionDiscussionHandler("open")
};
//#endregion
export { sessionDiscussionHandlers };
