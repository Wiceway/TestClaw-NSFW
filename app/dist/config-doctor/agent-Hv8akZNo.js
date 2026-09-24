import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DbPiDevk.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { n as validateAgentParams, r as validateAgentWaitParams } from "./validator-registry-Dpl5QmuY.js";
import { o as operatorSessionCap } from "./operator-role-policy-gPgbkoHA.js";
import { _ as resolveSessionSharingTarget, f as isGatewayAdmin } from "./session-sharing-policy-rVme8bnl.js";
import { E as createSessionListEntryFilter } from "./session-sharing-xa1VG8U2.js";
import { t as prepareAgentRequestPreflight } from "./agent-request-preflight-BaBQ5klU.js";
import { t as createAgentTurnService } from "./agent-turn-service-8FeZofvs.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { n as resolveAgentTurnRunObserver, t as captureAgentTurnPrincipal } from "./principal-DYaHcp-l.js";
//#region src/gateway/agent-turn/io.ts
function createAgentTurnIo(respond) {
	const emit = (frame, meta) => {
		if (meta === void 0) {
			respond(...frame);
			return;
		}
		respond(...frame, meta);
	};
	return {
		emitAcceptance: emit,
		emitFinal: emit
	};
}
//#endregion
//#region src/gateway/server-methods/agent-run-handler.ts
const agentRunHandler = async ({ params, respond, context, client, isWebchatConnect, hasCurrentClientAuthority, sessionMutationCommitGuard }) => {
	const assertAdmissionCurrent = () => {
		sessionMutationCommitGuard?.();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	};
	assertAdmissionCurrent();
	const io = createAgentTurnIo(respond);
	if (!assertValidParams(params, validateAgentParams, "agent", (ok, payload, error, meta) => io.emitAcceptance([
		ok,
		payload,
		error
	], meta))) return;
	const request = params;
	const principal = captureAgentTurnPrincipal(client);
	const preflight = prepareAgentRequestPreflight({
		request,
		context,
		client: principal,
		io
	});
	if (!preflight) return;
	const onRunObserved = resolveAgentTurnRunObserver({
		principal,
		registerToolEventRecipient: context.registerToolEventRecipient
	});
	await createAgentTurnService({
		context,
		isWebchatConnect
	}).startTurn({
		assertAdmissionCurrent,
		hasCurrentClientAuthority,
		preflight,
		principal,
		io,
		onRunObserved
	});
};
//#endregion
//#region src/gateway/server-methods/agent-wait.ts
const agentWaitHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateAgentWaitParams, "agent.wait", respond)) return;
	const gatewayClient = client ?? null;
	const prepared = createAgentTurnService({
		context,
		isWebchatConnect
	}).prepareWaitForTurn(params);
	const authorizeWait = (run) => {
		if (!gatewayClient?.authenticatedUserProfile || isGatewayAdmin(gatewayClient)) return true;
		const cfg = context.getRuntimeConfig();
		if (operatorSessionCap(gatewayClient, cfg) !== "none") return true;
		const target = run?.sessionKey ? resolveSessionSharingTarget({
			cfg,
			sessionKey: run.sessionKey,
			agentId: run.agentId
		}) : null;
		const visibilityFilter = createSessionListEntryFilter({
			client: gatewayClient,
			cfg
		});
		if (!target || run?.lifecycleGeneration !== getAgentRunLifecycleGeneration() || run?.sessionId !== void 0 && target.entry.sessionId !== run.sessionId || visibilityFilter?.(target.storeKey, target.entry) === false) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent run was not found"));
			return false;
		}
		return true;
	};
	if (!authorizeWait(prepared.session)) return;
	const observation = await prepared.wait();
	if (authorizeWait(observation.session)) respond(true, observation.result);
};
//#endregion
//#region src/gateway/server-methods/agent.ts
const agentHandlers = {
	agent: agentRunHandler,
	"agent.wait": agentWaitHandler
};
//#endregion
export { agentHandlers };
