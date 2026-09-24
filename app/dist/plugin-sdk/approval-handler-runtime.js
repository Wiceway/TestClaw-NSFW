import { l as normalizeOptionalString } from "../string-coerce-CIXf7egm.mjs";
import { c as buildPluginApprovalExpiredMessage, u as buildPluginApprovalResolvedMessage } from "../plugin-approvals-CbE1CTiQ.mjs";
import { s as normalizeApprovalRequest } from "../approval-request-account-binding-BEDPCK6o.mjs";
import { t as resolveApprovalOverGateway } from "../approval-gateway-resolver-Bq9uSxWI.mjs";
import "../approval-gateway-runtime-BLGuDjmR.mjs";
import { n as createLazyChannelApprovalNativeRuntimeAdapter, t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "../approval-handler-adapter-runtime-D5eigP26.mjs";
import { n as buildApprovalResolvedReplyPayload } from "../approval-renderers-B8nwQEhK.mjs";
import { t as buildSystemAgentApprovalResolvedText } from "../approval-terminal-DeXq_dWY.mjs";
import { n as createChannelApprovalHandlerFromCapability, r as createChannelApprovalNativeRuntimeAdapter, t as createChannelApprovalHandler } from "../approval-handler-runtime-CveQsQKy.mjs";
//#region src/plugin-sdk/approval-handler-runtime.ts
/**
* Runtime SDK subpath for approval handler adapters and approval view text helpers.
*/
/** Builds channel-visible resolved approval text for every approval kind. */
function buildChannelApprovalResolvedText(params) {
	if (params.view.approvalKind === "system-agent") return buildSystemAgentApprovalResolvedText({
		...params.view,
		decision: params.resolved.decision
	});
	if (params.view.approvalKind === "plugin") return buildPluginApprovalResolvedMessage(params.resolved);
	const resolvedByText = params.resolved.resolvedBy ? ` Resolved by ${params.resolved.resolvedBy}.` : "";
	return buildApprovalResolvedReplyPayload({
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: `✅ Exec approval ${params.resolved.decision}.${resolvedByText} ID: ${params.request.id}`
	}).text ?? "";
}
/** Builds channel-visible expiration text for exec and plugin approvals. */
function buildChannelApprovalExpiredText(params) {
	const request = normalizeApprovalRequest(params.request);
	if (request.approvalKind === "system-agent") return "⏱️ Assistant change expired. No change was made.";
	if (request.approvalKind === "plugin") return buildPluginApprovalExpiredMessage(request);
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
	return normalizeOptionalString(params.plannedAccountId) ?? normalizeOptionalString(params.contextAccountId) ?? normalizeOptionalString(params.fallbackAccountId);
}
//#endregion
export { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY, buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalHandler, createChannelApprovalHandlerFromCapability, createChannelApprovalNativeRuntimeAdapter, createLazyChannelApprovalNativeRuntimeAdapter, resolveApprovalOverGateway, resolvePreparedApprovalAccountId };
