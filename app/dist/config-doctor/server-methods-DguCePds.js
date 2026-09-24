import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.js";
import { i as getPluginRuntimeGatewayRequestScope, l as withPluginRuntimeRegistryScope, r as getPluginRuntimeGatewayNodeAuthorities, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B7K42D1p.js";
import { d as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { f as withCanonicalSessionValidationDeferral } from "./session-canonical-key-Bxbtl4CI.js";
import { D as tryBeginGatewayPreparedRestartRootWorkAdmission, c as getGatewaySuspendAdmissionPhase, k as tryBeginGatewayRootWorkAdmission, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining } from "./gateway-work-admission-DJ5CkZgB.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape, r as missingScopeErrorShape } from "./error-codes-DQWjOSek.js";
import { n as GATEWAY_SUSPEND_UNAVAILABLE_REASON, t as GATEWAY_RESTART_UNAVAILABLE_REASON } from "./restart-unavailable-BK7ZMKEi.js";
import { _ as resolveSessionMethodScope, c as resolveLeastPrivilegeOperatorScopesForMethod, d as createCoreGatewayMethodDescriptors, f as isCoreGatewayMethodClassified, m as listCoreGatewayHandlerMethodNames, n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-D0hbLMo0.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { l as getActivePluginRegistry } from "./runtime-B980B6n3.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.js";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.js";
import { r as classifyGatewayStaleInstall } from "./stale-install-Cz6VHd9H.js";
import { a as sessionMutationTargetFields } from "./session-method-policy-Bf4wvoIc.js";
import { a as withSessionMutationCommitGuard, i as readGatewayRequestMutationAuthority, n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-EqzBBshC.js";
import { f as isGatewayAdmin, w as authorizeAuthenticatedProfileForMethod } from "./session-sharing-policy-rVme8bnl.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import { n as createExpectedProfileBinding } from "./expected-profile-DRRHY4tb.js";
import { o as resolveDirectIncognitoTargets, s as resolveDirectSessionTargets, t as resolveSessionMutationAuthorization } from "./session-sharing-xa1VG8U2.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-B1YxvgrA.js";
import { n as createGatewayMethodRegistry, r as createPluginGatewayMethodDescriptors, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-DgdBJANE.js";
import { t as canSelectQuestion } from "./question-access-DQ3ycYOU.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-D90Ep5US.js";
import { t as isTargetedNonSafeGatewayRestartRequest } from "./restart-request-BjmYpHlw.js";
import { r as retainSessionListForegroundWork } from "./session-projection-work-BRdVTUIE.js";
//#region src/gateway/server-methods/lazy-core-handlers.ts
const preparations = /* @__PURE__ */ new WeakMap();
/** Resolve forwarding wrappers without mistaking them for actual handler entry. */
async function prepareGatewayRequestHandler(handler, entry) {
	let preparedHandler = handler;
	let prepare = preparations.get(preparedHandler);
	while (prepare) {
		entry?.assertOpen();
		preparedHandler = await prepare();
		prepare = preparations.get(preparedHandler);
	}
	return preparedHandler;
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => {
		const forwarding = async (opts) => {
			const entry = opts.context.requestEntryLifetime?.enter(opts);
			try {
				const handler = await prepareGatewayRequestHandler(forwarding, entry);
				entry?.assertOpen();
				entry?.release();
				await handler(opts);
			} finally {
				entry?.release();
			}
		};
		preparations.set(forwarding, async () => {
			const handler = (await params.loadHandlers())[method];
			if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
			return handler;
		});
		return [method, forwarding];
	}));
}
//#endregion
//#region src/gateway/server-methods/core-handlers.ts
const CORE_GATEWAY_HANDLER_MODULES = {
	agent: () => import("./agent-Hv8akZNo.js").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-CfjNymvH.js").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-DK5TTNGl.js").then((module) => module.agentsHandlers),
	"claws-monitors": () => import("./claws-monitors-BA2wZoG_.js").then((module) => module.clawsMonitorHandlers),
	"claws-packages": () => import("./claws-packages-D8xAOVN4.js").then((module) => module.clawsPackageHandlers),
	"agents-workspace": () => import("./agents-workspace-BD-wDaOV.js").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-krUZZFiW.js").then((module) => module.artifactsHandlers),
	board: () => import("./board-B8y3muQh.js").then((module) => module.boardHandlers),
	audit: () => import("./audit-BkE9PY-Q.js").then((module) => module.auditHandlers),
	users: () => import("./users-j5GK7a5_.js").then((module) => module.usersHandlers),
	"users-mentionable": () => import("./users-mentionable-B8pa6Ta0.js").then((module) => module.usersMentionableHandlers),
	attach: () => import("./attach-CjbAyrw0.js").then((module) => module.attachHandlers),
	channels: () => import("./channels-CXHFgUBv.js").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-Bv-rW50f.js").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-BN-bCDhh.js").then((module) => module.chatHandlers),
	"chat-send": () => import("./chat-send-external-entry-C0pNg64h.js").then((module) => ({ "chat.send": module.handleDirectExternalChatSend })),
	"chat-abort": () => import("./chat-abort-handler-DILjOJFi.js").then((module) => ({ "chat.abort": module.handleChatAbortRequest })),
	commands: () => import("./commands-DrCgyx4p.js").then((module) => module.commandsHandlers),
	computer: () => import("./computer-bZKi7iBk.js").then((module) => module.computerHandlers),
	config: () => import("./config-Cz23agjv.js").then((module) => module.configHandlers),
	conversations: () => import("./conversations-Cw0TpHdT.js").then((module) => module.conversationHandlers),
	connect: () => import("./connect-BDMEmHqs.js").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-BM39B_iV.js").then((module) => module.controlUiHandlers),
	"plugins-control-ui": () => import("./plugins-control-ui-DmAfen1L.js").then((module) => module.pluginsControlUiHandlers),
	cron: () => import("./cron-C3zo7QjJ.js").then((module) => module.cronHandlers),
	devices: () => import("./devices-DC7V57NG.js").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-DmPgKJmv.js").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-D9GGx4CC.js").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-gdjDS1MQ.js").then((module) => module.createDoctorHandlers()),
	environments: () => import("./environments-BHJ6hzTH.js").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-BSLcBvKl.js").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-CpJo3Cy7.js").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-BYcyRko_.js").then((module) => module.fsHandlers),
	health: () => import("./health-zSviNndB.js").then((module) => module.healthHandlers),
	logs: () => import("./logs-BHtCVX_K.js").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-C0kawmwV.js").then((module) => module.memorySearchHandlers),
	mentions: () => import("./mentions-BOaVWFWT.js").then((module) => module.mentionHandlers),
	terminal: () => import("./terminal-CaqRIthl.js").then((module) => module.terminalHandlers),
	transcripts: () => import("./transcripts-Hee1LDfy.js").then((module) => module.transcriptsHandlers),
	"ui-command": () => import("./ui-command-CM53Bqsu.js").then((module) => module.uiCommandHandlers),
	themes: () => import("./themes-CzwYIIQM.js").then((module) => module.themeHandlers),
	"models-auth-status": () => import("./models-auth-status-CadrWfdh.js").then((module) => module.modelsAuthStatusHandlers),
	"models-auth-login": () => import("./models-auth-login-6B0Ds00l.js").then((module) => module.modelsAuthLoginHandlers),
	"mcp-auth-login": () => import("./mcp-auth-login-BA6Im3hm.js").then((module) => module.mcpAuthLoginHandlers),
	"models-auth-order": () => import("./models-auth-order-N4ggGE9p.js").then((module) => module.modelsAuthOrderHandlers),
	models: () => import("./models-ONxJqnS1.js").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-DY0uKn9l.js").then((module) => module.modelsProbeHandlers),
	"web-search": () => import("./web-search-D3JvwbZj.js").then((module) => module.webSearchHandlers),
	"native-hook-relay": () => import("./native-hook-relay-BdOByxDJ.js").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-BKU94h5z.js").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-BD_Rnc7B.js").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-BrNHFua7.js").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-DrDM6Szj.js").then((module) => module.pluginsHandlers),
	"plugins-mutations": () => import("./plugins-mutations-D7B_fE8F.js").then((module) => module.pluginMutationHandlers),
	projects: () => import("./projects-DZToxZTA.js").then((module) => module.projectsHandlers),
	portals: () => import("./portals-CiKaTLN2.js").then((module) => module.portalHandlers),
	"progress-card": () => import("./progress-card-DDXQ0BuL.js").then((module) => module.progressCardHandlers),
	migrations: () => import("./migrations-B9LcaW1t.js").then((module) => module.migrationsHandlers),
	push: () => import("./push-C5rnUXKL.js").then((module) => module.pushHandlers),
	restart: () => import("./restart-B1GUI3y3.js").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-0bNjzUIJ.js").then((module) => module.suspendHandlers),
	send: () => import("./send-BBDuR18g.js").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-9pCct1_y.js").then((module) => module.sessionsFilesHandlers),
	"sessions-github": () => import("./sessions-github-BbFO1yqI.js").then((module) => module.sessionsGitHubHandlers),
	"sessions-diff": () => import("./sessions-diff-Bof4Ag4p.js").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-XRWvtV8d.js").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-CYbO6dIq.js").then((module) => module.sessionCompactHandlers),
	"sessions-create": () => import("./sessions-create-ClJIT2UZ.js").then((module) => module.sessionCreateHandlers),
	"sessions-title": () => import("./sessions-title-_68tie0v.js").then((module) => module.sessionTitleHandlers),
	"sessions-recover": () => import("./sessions-recover-Bf2Vr6au.js").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-BCY_oT23.js").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-B2y0Vcrk.js").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-MT9RtUPi.js").then((module) => module.sessionGroupHandlers),
	"sessions-goal": () => import("./sessions-goal-B6AKv8Kd.js").then((module) => module.sessionGoalHandlers),
	"sessions-provider-review": () => import("./sessions-provider-review-BTtK3UDD.js").then((module) => module.sessionProviderReviewHandlers),
	"sessions-messaging": () => import("./sessions-messaging-yRwyCOGe.js").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-KYan5sNz.js").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-BcvVv-0T.js").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-CMlhLU_o.js").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-B6PUezeO.js").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions-D8U9-zrP.js").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-BBy9qmTJ.js").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-DaFrypFu.js").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-DYJF40c7.js").then((module) => module.sessionDiscussionHandlers),
	"session-activity-summary": () => import("./session-activity-summary-B0zAYEyD.js").then((module) => module.sessionActivitySummaryHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-ChrcpaOQ.js").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-Wfs_UKYk.js").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-C9VwfmhV.js").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-DvefOUH1.js").then((module) => module.skillsHandlers),
	system: () => import("./system-BO4wg_s1.js").then((module) => module.systemHandlers),
	talk: () => import("./handlers-D0NUiYd2.js").then((module) => module.talkHandlers),
	"talk-mode": () => import("./mode-CRq4JU76.js").then((module) => module.talkModeHandlers),
	tasks: () => import("./tasks-DsjOaVU3.js").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-BZKw8Ban.js").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-DctzwfHu.js").then((module) => module.toolsCatalogHandlers),
	"tools-github": () => import("./tools-github-DJTvUmiS.js").then((module) => module.toolsGitHubHandlers),
	"tools-effective": () => import("./tools-effective-DolAbcxY.js").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-tMuKI9FU.js").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-CaPPyLQ-.js").then((module) => module.mcpAppHandlers),
	canvas: () => import("./canvas-CTlJvcV4.js").then((module) => module.canvasHandlers),
	tts: () => import("./tts-B5vZh29C.js").then((module) => module.ttsHandlers),
	update: () => import("./update-Dkx54XDM.js").then((module) => module.updateHandlers),
	usage: () => import("./usage-C4p8jNCW.js").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-bbn44qa0.js").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-ByykANLV.js").then((module) => module.voicewakeHandlers),
	web: () => import("./web-DD1IW12w.js").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-zADAn5Yh.js").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-DHQsb90D.js").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-BG-nv9DL.js").then((module) => module.wizardHandlers)
};
const coreGatewayHandlers = Object.fromEntries(Array.from(listCoreGatewayHandlerMethodNames()).flatMap(([family, methods]) => Object.entries(createLazyCoreHandlers({
	methods,
	loadHandlers: createLazyPromise(CORE_GATEWAY_HANDLER_MODULES[family], { cacheRejections: true })
}))));
//#endregion
//#region src/gateway/server-methods.ts
function authorizeGatewayMethod(method, client, params, methodRegistry) {
	if (!client?.connect || method === "health") return { error: null };
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`) };
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`) };
	if (role === "node") return { error: null };
	if (method === "device.scopes.requestUpgrade" || method === "device.scopes.waitUpgrade") return { error: null };
	if (scopes.includes("operator.admin")) return { error: null };
	const registeredScope = methodRegistry.getScope(method);
	const scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes, resolveSessionMethodScope(method, params), method) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed) {
		const resolvedRequiredScopes = isOperatorScope(registeredScope) ? [registeredScope] : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
		return { error: missingScopeErrorShape({
			missingScope: scopeAuth.missingScope,
			requiredScopes: resolvedRequiredScopes.length > 0 ? resolvedRequiredScopes : [scopeAuth.missingScope]
		}) };
	}
	return {
		error: null,
		sessionScope: scopeAuth.sessionScope
	};
}
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
	"gateway.suspend.prepare",
	"gateway.suspend.status",
	"gateway.suspend.resume",
	"gateway.suspend.handoff"
]);
function runGatewayPendingWorkContinuation(params) {
	if (!isRecord(params.requestParams)) return null;
	const request = params.requestParams;
	if (params.client?.connect.role === "node") {
		if (params.admission !== "continuation" && getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining()) return null;
		const invokeId = params.method === "node.invoke.progress" ? request.invokeId : params.method === "node.invoke.result" ? request.id : void 0;
		if (typeof invokeId !== "string" || typeof request.nodeId !== "string") return null;
		return params.context.nodeRegistry.runPendingInvokeContinuation({
			invokeId,
			nodeId: request.nodeId,
			connId: params.client.connId,
			run: params.run
		});
	}
	if (params.admission === "continuation" || getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining() || params.client?.connect.role !== "operator" || typeof request.id !== "string") return null;
	if (params.method === "question.resolve" || params.method === "question.get") {
		const questionManager = params.context.questionManager;
		return questionManager && canSelectQuestion(questionManager, request.id, params.client) ? questionManager.runPendingContinuation(request.id, params.run) : null;
	}
	return (params.method === "exec.approval.resolve" ? params.context.execApprovalManager : params.method === "plugin.approval.resolve" ? params.context.pluginApprovalManager : params.method === "approval.resolve" ? request.kind === "exec" ? params.context.execApprovalManager : request.kind === "plugin" ? params.context.pluginApprovalManager : request.kind === "system-agent" ? params.context.systemAgentApprovalManager : void 0 : void 0)?.runPendingContinuation(request.id, params.run) ?? null;
}
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
	const gatewayPluginRegistry = getActivePluginRegistry();
	const gatewayPluginHandlers = gatewayPluginRegistry?.gatewayHandlers ?? {};
	const extraHandlerEntries = Object.entries(extraHandlers ?? {});
	const pluginMethodNames = new Set(Object.keys(gatewayPluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	for (const [method, extraHandler] of extraHandlerEntries) if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
	const auxHandlers = Object.fromEntries(extraHandlerEntries.filter(([method]) => !pluginMethodNames.has(method) && !isCoreGatewayMethodClassified(method)));
	return createGatewayMethodRegistry([
		...createCoreGatewayMethodDescriptors(coreDescriptorHandlers),
		...gatewayPluginRegistry ? createPluginGatewayMethodDescriptors(gatewayPluginRegistry) : [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: auxHandlers,
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	], gatewayPluginRegistry ?? void 0);
}
/** Applies the router-owned authorization fence before any transport or typed dispatch. */
async function authorizeGatewayRequestPreDispatch(params) {
	if (params.context.ensureSessionRowProjection) await params.context.ensureSessionRowProjection();
	while (true) {
		const scopeAuthorization = withPluginRuntimeRegistryScope(params.methodRegistry.pluginRegistry, () => authorizeGatewayMethod(params.method, params.client, params.requestParams, params.methodRegistry));
		if (scopeAuthorization.error) return { error: scopeAuthorization.error };
		const profileError = await authorizeAuthenticatedProfileForMethod({
			client: params.client,
			sessionScope: scopeAuthorization.sessionScope,
			requiresProfile: () => params.expectedProfileBinding !== void 0 || params.methodRegistry.requiresAuthenticatedProfile(params.method) || resolveDirectIncognitoTargets(params.method, params.requestParams).length > 0 || sessionMutationTargetFields(params.method).length > 0 && params.context.getRuntimeConfig().gateway?.roles !== void 0
		});
		if (profileError) return { error: profileError };
		try {
			params.expectedProfileBinding?.assertCurrent();
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		if (params.context.unavailableGatewayMethods?.has(params.method)) return { error: errorShape(ErrorCodes.UNAVAILABLE, `${params.method} unavailable during gateway startup`, {
			retryable: true,
			retryAfterMs: 500,
			details: {
				...gatewayStartupUnavailableDetails(),
				method: params.method
			}
		}) };
		if (params.method.startsWith("sessions.groups.")) {
			const { ensureSessionGroupCatalog } = await import("./session-group-catalog-6rhWsz3p.js");
			await ensureSessionGroupCatalog();
			const groupProjection = getSessionRowProjection(params.context);
			if (groupProjection) do
				await groupProjection.prepareMembership();
			while (groupProjection.needsMembershipPreparation());
			params.expectedProfileBinding?.assertCurrent();
		}
		const projection = params.method === "sessions.describe" && !isGatewayAdmin(params.client) ? getSessionRowProjection(params.context) : void 0;
		const authorizeSession = (sessionRowRead) => resolveSessionMutationAuthorization({
			client: params.client ?? null,
			method: params.method,
			requestParams: params.requestParams,
			context: params.context,
			sessionRowRead,
			sessionScope: scopeAuthorization.sessionScope
		});
		const preparedSessionMutation = projection ? await projection.withPreparedExactRows((cfg) => resolveDirectSessionTargets(params.method, params.requestParams).flatMap((target) => {
			const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
			return agent.ok ? [{
				key: target.sessionKey,
				agentId: agent.agentId
			}] : [];
		}), authorizeSession) : withCanonicalSessionValidationDeferral(() => authorizeSession());
		if (preparedSessionMutation.kind === "pending") {
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DPanEjQ8.js");
			await certifySessionCanonicalValidationPending(preparedSessionMutation.database);
			continue;
		}
		const sessionMutation = preparedSessionMutation.value;
		if (sessionMutation.error) return { error: sessionMutation.error };
		if (params.client?.connect.role === "node" && (!params.client.connId || !await params.context.nodeRegistry.isConnectionCurrentPairingState(params.client.connId))) return { error: errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed before request dispatch", {
			retryable: true,
			details: { code: "PAIRING_CHANGED" }
		}) };
		return {
			error: null,
			sessionScope: scopeAuthorization.sessionScope,
			...sessionMutation.authorization ? { sessionMutationAuthorization: sessionMutation.authorization } : {}
		};
	}
}
/** Runs admitted Gateway work inside the shared root and plugin request scopes. */
async function runWithGatewayRequestEnvelope(method, client, fn, options) {
	const rejectRateLimitedControlPlaneWrite = () => {
		if (!options.methodRegistry.isControlPlaneWrite(method)) return;
		const budget = consumeControlPlaneWriteBudget({
			client,
			method
		});
		if (budget.allowed) return;
		const actor = resolveControlPlaneActor(client);
		options.context.logGateway.warn(`control-plane write rate-limited method=${method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
		return errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
			retryable: true,
			retryAfterMs: budget.retryAfterMs,
			details: {
				method,
				limit: `30 per ${CONTROL_PLANE_RATE_LIMIT_WINDOW_MS / 1e3}s`
			}
		});
	};
	const isSuspendPrepare = method === "gateway.suspend.prepare";
	const preAdmissionRateLimitError = isSuspendPrepare ? rejectRateLimitedControlPlaneWrite() : void 0;
	if (preAdmissionRateLimitError) return await options.reject(preAdmissionRateLimitError);
	const rootWorkAdmission = options.admission === "continuation" ? null : tryBeginGatewayRootWorkAdmission(`ws:${method}`) ?? (method === "gateway.restart.request" && isTargetedNonSafeGatewayRestartRequest(options.requestParams) ? tryBeginGatewayPreparedRestartRootWorkAdmission() : null);
	if (!rootWorkAdmission) {
		const continuation = runGatewayPendingWorkContinuation({
			method,
			client,
			requestParams: options.requestParams,
			context: options.context,
			admission: options.admission,
			run: invokeWithRequestScope
		});
		if (continuation) return await continuation;
		if (options.admission === "continuation") return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway shutdown`));
	}
	if (isSuspendPrepare && rootWorkAdmission && !rootWorkAdmission.ownsRoot) return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
		retryable: true,
		retryAfterMs: 1e3,
		details: {
			method,
			reason: "nested-gateway-request"
		}
	}));
	const restartProgressRead = method === "update.runs.get" && getGatewayRestartDrainSignal().aborted && getGatewaySuspendAdmissionPhase() === "accepting";
	if (!rootWorkAdmission && !SUSPEND_CONTROL_METHODS.has(method) && !restartProgressRead) {
		const restartDraining = isGatewayRestartDraining();
		return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`, {
			retryable: true,
			retryAfterMs: 1e3,
			details: {
				method,
				reason: restartDraining ? GATEWAY_RESTART_UNAVAILABLE_REASON : GATEWAY_SUSPEND_UNAVAILABLE_REASON,
				phase: getGatewaySuspendAdmissionPhase()
			}
		}));
	}
	async function invokeWithRequestScope() {
		const postAdmissionRateLimitError = isSuspendPrepare ? void 0 : rejectRateLimitedControlPlaneWrite();
		if (postAdmissionRateLimitError) return await options.reject(postAdmissionRateLimitError);
		const releaseForegroundWork = retainSessionListForegroundWork();
		try {
			const pluginRegistry = options.methodRegistry.pluginRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
			return await withPluginRuntimeGatewayRequestScope({
				context: options.context,
				resolveGatewayContext: options.context.resolveGatewayContext,
				client,
				signal: options.signal,
				hasCurrentClientAuthority: options.hasCurrentClientAuthority,
				isWebchatConnect: options.isWebchatConnect,
				...client?.internal?.nodeInvokeStream ? getPluginRuntimeGatewayNodeAuthorities() : {},
				...pluginRegistry ? { pluginRegistry } : {}
			}, fn);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return await options.reject(error.error);
			const staleInstall = classifyGatewayStaleInstall(error);
			if (staleInstall) return await options.reject(staleInstall.error);
			throw error;
		} finally {
			releaseForegroundWork();
		}
	}
	if (!rootWorkAdmission) return await invokeWithRequestScope();
	try {
		return await rootWorkAdmission.run(invokeWithRequestScope);
	} finally {
		rootWorkAdmission.release();
	}
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts, diagnostics) {
	const { req, client, isWebchatConnect, context, signal, hasCurrentClientAuthority } = opts;
	const profileBinding = opts.expectedProfileBinding ?? (req.expectedProfileId === void 0 ? void 0 : await createExpectedProfileBinding(req.expectedProfileId, client, readGatewayRequestMutationAuthority(opts).assertLifetimeCurrent));
	const respond = profileBinding && !opts.expectedProfileBinding ? profileBinding.guardResponse(opts.respond) : opts.respond;
	const sessionMutationCommitGuard = profileBinding ? () => {
		profileBinding.assertCurrent();
		opts.sessionMutationCommitGuard?.();
	} : opts.sessionMutationCommitGuard;
	const entry = opts.requestEntry ?? context.requestEntryLifetime?.enter(opts);
	const releaseForegroundWork = retainSessionListForegroundWork();
	try {
		entry?.assertOpen();
		const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
		const authorization = await authorizeGatewayRequestPreDispatch({
			method: req.method,
			requestParams: req.params,
			client,
			context,
			methodRegistry,
			expectedProfileBinding: profileBinding
		});
		entry?.assertOpen();
		if (authorization.error) {
			respond(false, void 0, authorization.error);
			return;
		}
		const handler = methodRegistry.getHandler(req.method);
		if (!handler) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
			return;
		}
		const requestMutationAuthority = readGatewayRequestMutationAuthority(opts);
		const sessionMutationAuthorization = withSessionMutationCommitGuard(authorization.sessionMutationAuthorization, requestMutationAuthority.assertCurrent, profileBinding?.assertCurrent, requestMutationAuthority.assertAdmittedInputCurrent);
		const invokeHandler = async () => {
			const preparedHandler = await prepareGatewayRequestHandler(handler, entry);
			const handlerOptions = bindGatewayRequestHandlerMutationAuthority(opts, {
				req,
				params: req.params ?? {},
				client,
				isWebchatConnect,
				respond,
				context,
				signal,
				...hasCurrentClientAuthority ? { hasCurrentClientAuthority } : {},
				sessionMutationCommitGuard,
				sessionMutationAuthorization
			}, profileBinding, authorization.sessionScope);
			sessionMutationCommitGuard?.();
			entry?.assertOpen();
			if (signal?.aborted) return;
			entry?.release();
			profileBinding?.markInvoked();
			return diagnostics ? diagnostics.runHandler(() => preparedHandler(handlerOptions)) : preparedHandler(handlerOptions);
		};
		if (req.method === "question.get" || req.method === "question.resolve") {
			requestMutationAuthority.assertCurrent();
			profileBinding?.assertCurrent();
		}
		await runWithGatewayRequestEnvelope(req.method, client, invokeHandler, {
			context,
			isWebchatConnect,
			signal,
			hasCurrentClientAuthority,
			methodRegistry,
			requestParams: req.params,
			admission: opts.admission,
			reject: (error) => respond(false, void 0, error)
		});
	} finally {
		releaseForegroundWork();
		if (!opts.requestEntry) entry?.release();
	}
}
//#endregion
export { coreGatewayHandlers as a, runWithGatewayRequestEnvelope as i, createRequestGatewayMethodRegistry as n, handleGatewayRequest as r, authorizeGatewayRequestPreDispatch as t };
