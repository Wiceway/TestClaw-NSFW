import { t as pruneMapToMaxSize } from "../map-size-CNcWiFKu.mjs";
import { t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS } from "../exec-approvals-core-BZ3ECkXD.mjs";
import { D as resolveExecApprovalRequestAllowedDecisions, E as resolveExecApprovalAllowedDecisions } from "../exec-approvals-authorization.kernel-DwCnJmG2.mjs";
import "../exec-approvals-BBEWVrGM.mjs";
import { t as isApprovalNotFoundError } from "../approval-errors-BPkaCbRr.mjs";
import { c as buildPluginApprovalExpiredMessage, l as buildPluginApprovalRequestMessage, n as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, r as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, u as buildPluginApprovalResolvedMessage } from "../plugin-approvals-CbE1CTiQ.mjs";
import { a as resolveApprovalApprovers, n as createResolvedApproverActionAuthAdapter } from "../approval-auth-helpers-BLMXNkCI.mjs";
import { t as matchesApprovalRequestFilters } from "../approval-request-filters-DiaNRI5r.mjs";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-DlQSsCnq.mjs";
import { a as buildExecApprovalPendingReplyPayload, m as getExecApprovalReplyMetadata, p as getExecApprovalApproverDmNoticeText } from "../exec-approval-reply-NU4MEJdw.mjs";
import { n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "../approval-client-helpers-dKDjnpyX.mjs";
import { n as doesApprovalRequestMatchChannelAccount } from "../approval-request-account-binding-BEDPCK6o.mjs";
import { i as resolveExecApprovalSessionTarget, r as resolveApprovalRequestSessionTarget, t as resolveApprovalRequestOriginTarget } from "../exec-approval-session-target-Cgp9aNUK.mjs";
import { n as createChannelNativeOriginTargetResolver, t as createChannelApproverDmTargetResolver } from "../approval-native-helpers-D3xz0ytj.mjs";
import { a as splitChannelApprovalCapability, i as createChannelApprovalCapability, n as createApproverRestrictedNativeApprovalCapability, t as createApproverRestrictedNativeApprovalAdapter } from "../approval-delivery-helpers-CDgbjTKi.mjs";
import { i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, r as buildPluginApprovalPendingReplyPayload, t as buildApprovalPendingReplyPayload } from "../approval-renderers-B8nwQEhK.mjs";
import { n as formatApprovalDecisionLabel, r as formatChannelApprovalResolvedLabel, t as buildSystemAgentApprovalResolvedText } from "../approval-terminal-DeXq_dWY.mjs";
import { t as createChannelNativeApprovalRuntime } from "../approval-native-runtime-DM0MSrqt.mjs";
import { t as resolveExecApprovalCommandDisplay } from "../exec-approval-command-display-CsJDbIM3.mjs";
import { randomBytes } from "node:crypto";
//#region src/plugin-sdk/approval-native-controls.ts
/** Own one plugin's process-local native controls through resolution and card updates. */
function createNativeApprovalControlRegistry(params) {
	const bindings = /* @__PURE__ */ new Map();
	const resolving = /* @__PURE__ */ new Set();
	const get = (token) => {
		const binding = bindings.get(token);
		if (!binding) return null;
		if (binding.expiresAtMs <= Date.now()) {
			bindings.delete(token);
			if (params.releaseClaimOnLookupExpiry) resolving.delete(token);
			return null;
		}
		return binding;
	};
	const complete = (token) => {
		const binding = bindings.get(token);
		resolving.delete(token);
		bindings.delete(token);
		if (binding) params.onComplete?.(binding);
	};
	return {
		createToken: () => randomBytes(18).toString("base64url"),
		register(binding) {
			if (binding.expiresAtMs <= Date.now()) return false;
			bindings.delete(binding.token);
			bindings.set(binding.token, binding);
			pruneMapToMaxSize(bindings, 1024);
			return true;
		},
		get,
		values: () => bindings.values(),
		pruneExpired(nowMs) {
			for (const [token, binding] of bindings) if (binding.expiresAtMs <= nowMs) {
				bindings.delete(token);
				resolving.delete(token);
			}
		},
		unregister(tokens) {
			for (const token of tokens) complete(token);
		},
		async settle(token, resolveAndUpdate) {
			const binding = get(token);
			if (!binding) return { kind: "missing" };
			if (resolving.has(token)) return { kind: "in-flight" };
			resolving.add(token);
			let result;
			try {
				result = await resolveAndUpdate(binding);
			} catch (error) {
				if (isApprovalNotFoundError(error)) {
					complete(token);
					return {
						kind: "not-found",
						binding
					};
				}
				resolving.delete(token);
				throw error;
			}
			complete(token);
			return {
				kind: "settled",
				binding,
				result
			};
		}
	};
}
//#endregion
export { DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, MAX_PLUGIN_APPROVAL_TIMEOUT_MS, buildApprovalPendingReplyPayload, buildApprovalResolvedReplyPayload, buildExecApprovalPendingReplyPayload, buildPluginApprovalExpiredMessage, buildPluginApprovalPendingReplyPayload, buildPluginApprovalRequestMessage, buildPluginApprovalResolvedMessage, buildPluginApprovalResolvedReplyPayload, buildSystemAgentApprovalResolvedText, createApproverRestrictedNativeApprovalAdapter, createApproverRestrictedNativeApprovalCapability, createChannelApprovalCapability, createChannelApproverDmTargetResolver, createChannelExecApprovalProfile, createChannelNativeApprovalRuntime, createChannelNativeOriginTargetResolver, createNativeApprovalControlRegistry, createResolvedApproverActionAuthAdapter, doesApprovalRequestMatchChannelAccount, formatApprovalDecisionLabel, formatApprovalDisplayPath, formatChannelApprovalResolvedLabel, getExecApprovalApproverDmNoticeText, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters, resolveApprovalApprovers, resolveApprovalRequestOriginTarget, resolveApprovalRequestSessionTarget, resolveExecApprovalAllowedDecisions, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions, resolveExecApprovalSessionTarget, splitChannelApprovalCapability };
