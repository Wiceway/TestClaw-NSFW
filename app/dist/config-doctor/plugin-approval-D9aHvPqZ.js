import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as _usingCtx } from "./usingCtx-E-VWE-jt.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Mn as validatePluginApprovalRequestParams, Nn as validatePluginApprovalResolveParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRl7Rrsc.js";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-sb55IYxr.js";
import { t as sanitizeApprovalScope } from "./approval-scope-poevXELy.js";
import { c as resolvePluginApprovalTimeoutMs, l as truncatePluginApprovalDetail } from "./plugin-approvals-CuGmRDJW.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-CALBSp0F.js";
import { n as takeMcpToolApprovalBinding } from "./mcp-tool-approval-binding-EUXmUc0n.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { r as listVisiblePendingApprovalRequests } from "./approval-record-lookup-DvicMWoz.js";
import { a as handleApprovalResolve, c as registerPendingApprovalRecord, l as resolveApprovalDecisionParams, n as bindApprovalReviewerDeviceIds, o as handleApprovalWaitDecision, t as bindApprovalRequesterMetadata } from "./approval-shared-BS71rxnr.js";
import { t as createApprovalRequestAuthority } from "./approval-request-authority-Czhth0ff.js";
import { t as handlePendingPluginApprovalRequest } from "./plugin-approval-request-delivery-BPcNwYZb.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/plugin-approval.ts
/** Create plugin approval handlers backed by the shared approval manager. */
function createPluginApprovalHandlers(manager, opts) {
	return {
		"plugin.approval.list": async (options) => {
			try {
				var _usingCtx$1 = _usingCtx();
				const authority = _usingCtx$1.u(createApprovalRequestAuthority(options));
				const { respond, client, context } = options;
				const approvals = await listVisiblePendingApprovalRequests({
					authority,
					manager,
					client,
					approvalKind: "plugin",
					...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {}
				});
				authority.assertCurrent();
				respond(true, approvals, void 0);
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		},
		"plugin.approval.request": async ({ params, client, respond, context }) => {
			if (!assertValidParams(params, validatePluginApprovalRequestParams, "plugin.approval.request", respond)) return;
			const p = params;
			const twoPhase = p.twoPhase === true;
			const timeoutMs = resolvePluginApprovalTimeoutMs(p.timeoutMs);
			const trustedAgentRuntime = client?.internal?.agentRuntimeIdentity;
			if (trustedAgentRuntime && context.validateAgentRuntimeApprovalAuthority?.(trustedAgentRuntime) !== true) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime approval authority is no longer active"));
				return;
			}
			if (trustedAgentRuntime && !trustedAgentRuntime.approvalOwnerPluginId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "signed plugin approval owner is unavailable"));
				return;
			}
			const normalizeTrimmedString = (value) => normalizeOptionalString(value) || null;
			const rawSessionKey = normalizeOptionalString(trustedAgentRuntime?.sessionKey ?? p.sessionKey);
			const sessionOwner = rawSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), rawSessionKey, normalizeOptionalString(trustedAgentRuntime?.agentId ?? p.agentId)) : void 0;
			if (sessionOwner && !sessionOwner.ok) {
				respond(false, void 0, sessionOwner.error);
				return;
			}
			const sessionKey = rawSessionKey && sessionOwner?.ok ? resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: sessionOwner.agentId,
				sessionKey: rawSessionKey
			}) : null;
			const sanitizedTitle = sanitizeExecApprovalDisplayText(p.title);
			const sanitizedDescription = sanitizeExecApprovalWarningText(p.description);
			if (exceedsApprovalTextLimit(sanitizedTitle, 80) || exceedsApprovalTextLimit(sanitizedDescription, 512)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval title or description exceeds the display limit after sanitization"));
				return;
			}
			const rawDetail = normalizeTrimmedString(p.detail);
			const sanitizeMeta = (value) => normalizeTrimmedString(value) === null ? null : sanitizeExecApprovalDisplayText(normalizeTrimmedString(value));
			const request = {
				pluginId: trustedAgentRuntime?.approvalOwnerPluginId ?? sanitizeMeta(p.pluginId),
				title: sanitizedTitle,
				description: sanitizedDescription,
				scope: p.scope ? sanitizeApprovalScope(p.scope) : null,
				detail: rawDetail === null ? null : truncatePluginApprovalDetail(sanitizeExecApprovalWarningText(rawDetail)),
				severity: p.severity ?? null,
				toolName: sanitizeMeta(p.toolName),
				toolCallId: p.toolCallId ?? null,
				...trustedAgentRuntime && p.mcpTool ? { mcpTool: { ...p.mcpTool } } : {},
				...Array.isArray(p.allowedDecisions) ? { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: p.allowedDecisions }) } : {},
				agentId: trustedAgentRuntime?.agentId ?? (sessionOwner?.ok ? sessionOwner.agentId : sanitizeMeta(p.agentId)),
				sessionKey,
				runId: trustedAgentRuntime?.operationalRunInstance.runId ?? null,
				turnSourceChannel: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceChannel) : normalizeTrimmedString(p.turnSourceChannel),
				turnSourceTo: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceTo) : normalizeTrimmedString(p.turnSourceTo),
				turnSourceAccountId: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceAccountId) : normalizeTrimmedString(p.turnSourceAccountId),
				turnSourceThreadId: trustedAgentRuntime ? trustedAgentRuntime.turnSourceThreadId ?? null : p.turnSourceThreadId ?? null
			};
			const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
			if (trustedAgentRuntime) {
				record.agentRuntimeDelegatedAuthority = trustedAgentRuntime.delegatedAuthority;
				if (request.mcpTool && request.toolCallId) record.mcpToolApprovalActive = takeMcpToolApprovalBinding({
					authority: trustedAgentRuntime.delegatedAuthority,
					agentId: trustedAgentRuntime.agentId,
					toolCallId: request.toolCallId,
					...request.mcpTool
				});
			}
			if (trustedAgentRuntime?.executionIdentity && request.runId === trustedAgentRuntime.executionIdentity.runId) record.executionIdentityToken = trustedAgentRuntime.executionIdentity;
			bindApprovalRequesterMetadata({
				record,
				client
			});
			if (client?.internal?.approvalRuntime === true) bindApprovalReviewerDeviceIds({
				record,
				deviceIds: p.approvalReviewerDeviceIds
			});
			if (!await registerPendingApprovalRecord({
				manager,
				record,
				timeoutMs,
				respond,
				context
			})) return;
			await handlePendingPluginApprovalRequest({
				manager,
				record,
				respond,
				context,
				clientConnId: client?.connId,
				twoPhase,
				forwardRequest: opts?.forwarder?.handlePluginApprovalRequested?.bind(opts.forwarder),
				getIosPushDelivery: () => opts?.iosPushDelivery,
				source: "rpc"
			});
		},
		"plugin.approval.waitDecision": async (options) => {
			try {
				var _usingCtx3 = _usingCtx();
				const authority = _usingCtx3.u(createApprovalRequestAuthority(options));
				const { params, respond, client, context } = options;
				await handleApprovalWaitDecision({
					authority,
					manager,
					inputId: params.id,
					client,
					...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {},
					respond
				});
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		},
		"plugin.approval.resolve": async (options) => {
			try {
				var _usingCtx4 = _usingCtx();
				const authority = _usingCtx4.u(createApprovalRequestAuthority(options));
				const { params, respond, client, context } = options;
				const resolveParams = resolveApprovalDecisionParams({
					rawParams: params,
					validate: validatePluginApprovalResolveParams,
					methodName: "plugin.approval.resolve",
					respond
				});
				if (!resolveParams) return;
				const { inputId, decision, reviewer } = resolveParams;
				await handleApprovalResolve({
					approvalKind: "plugin",
					authority,
					manager,
					inputId,
					decision,
					respond,
					context,
					client,
					reviewer,
					exposeAmbiguousPrefixError: false,
					validateDecision: (snapshot) => resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request).includes(decision) ? null : {
						message: `${decision} is unavailable for this plugin approval`,
						details: { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request) }
					},
					forwardResolved: (resolvedEvent) => opts?.forwarder?.handlePluginApprovalResolved?.(resolvedEvent),
					forwardResolvedErrorLabel: "plugin approvals: forward resolve failed",
					extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved ? [{
						run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
						errorLabel: "plugin approvals: iOS push resolve failed"
					}] : void 0
				});
			} catch (_) {
				_usingCtx4.e = _;
			} finally {
				_usingCtx4.d();
			}
		}
	};
}
//#endregion
export { createPluginApprovalHandlers };
