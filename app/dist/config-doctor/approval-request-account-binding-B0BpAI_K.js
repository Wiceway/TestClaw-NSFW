import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { r as normalizeOptionalAccountId } from "./account-id-vE-dRkuP.js";
import { Q as compileSafeRegex, et as testRegexWithBoundedInput } from "./redact-myZeUWr_.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import "./message-channel-iCC7oIhe.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
//#region src/infra/approval-request-filters.ts
/** Matches session filters as literal substrings first, then bounded safe regexes. */
function matchesApprovalRequestSessionFilter(sessionKey, patterns) {
	return patterns.some((pattern) => {
		if (sessionKey.includes(pattern)) return true;
		const regex = compileSafeRegex(pattern);
		return regex ? testRegexWithBoundedInput(regex, sessionKey) : false;
	});
}
/**
* Applies optional approval request filters for agent ids and session keys.
* Agent id can be parsed from the session key only when the caller opts in.
*/
function matchesApprovalRequestFilters(params) {
	if (params.agentFilter?.length) {
		const explicitAgentId = normalizeOptionalString(params.request.agentId);
		const sessionAgentId = params.fallbackAgentIdFromSessionKey ? parseAgentSessionKey(params.request.sessionKey)?.agentId ?? void 0 : void 0;
		const agentId = explicitAgentId ?? sessionAgentId;
		if (!agentId || !params.agentFilter.includes(agentId)) return false;
	}
	if (params.sessionFilter?.length) {
		const sessionKey = normalizeOptionalString(params.request.sessionKey);
		if (!sessionKey || !matchesApprovalRequestSessionFilter(sessionKey, params.sessionFilter)) return false;
	}
	return true;
}
//#endregion
//#region src/infra/approval-types.ts
function deriveApprovalRequestKind(request) {
	const isSystemAgent = "proposalHash" in request.request && "sessionId" in request.request;
	if (isSystemAgent) return "system-agent";
	const isExec = "command" in request.request;
	if ([
		isSystemAgent,
		isExec,
		"title" in request.request && "description" in request.request
	].filter(Boolean).length !== 1) throw new Error("approval request payload does not identify exactly one owner");
	return isExec ? "exec" : "plugin";
}
function isExecApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "exec";
}
function isPluginApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "plugin";
}
function isSystemAgentApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "system-agent";
}
function hasExecApprovalKind(request) {
	return request.approvalKind === "exec";
}
function hasPluginApprovalKind(request) {
	return request.approvalKind === "plugin";
}
function normalizeApprovalRequest(request) {
	if (isExecApprovalRequest(request)) {
		if (hasExecApprovalKind(request)) return request;
		return {
			...request,
			approvalKind: "exec"
		};
	}
	if (isPluginApprovalRequest(request)) return hasPluginApprovalKind(request) ? request : {
		...request,
		approvalKind: "plugin"
	};
	if (isSystemAgentApprovalRequest(request)) return {
		...request,
		approvalKind: "system-agent"
	};
	throw new Error("approval request payload does not identify exactly one owner");
}
/** Resolve approval ownership from the typed request payload, never from id spelling. */
function resolveApprovalRequestKind(request) {
	return deriveApprovalRequestKind(request);
}
//#endregion
//#region src/infra/approval-request-account-binding.ts
function resolveApprovalForwardAccountIds(params) {
	const forwarding = resolveApprovalRequestKind(params.request) === "exec" ? params.cfg.approvals?.exec : params.cfg.approvals?.plugin;
	const channel = normalizeOptionalChannel(params.channel);
	if (!forwarding?.enabled || forwarding.mode !== "targets" && forwarding.mode !== "both") return [];
	if (!matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: forwarding.agentFilter,
		sessionFilter: forwarding.sessionFilter
	})) return [];
	return (forwarding.targets ?? []).flatMap((target) => {
		if (normalizeOptionalChannel(target.channel) !== channel) return [];
		const accountId = normalizeOptionalAccountId(target.accountId ?? params.defaultAccountId);
		return accountId ? [accountId] : [];
	});
}
function hasApprovalForwardTarget(params) {
	const forwarding = resolveApprovalRequestKind(params.request) === "exec" ? params.cfg.approvals?.exec : params.cfg.approvals?.plugin;
	if (!forwarding?.enabled || forwarding.mode !== "targets" && forwarding.mode !== "both" || !matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: forwarding.agentFilter,
		sessionFilter: forwarding.sessionFilter
	})) return false;
	const channel = normalizeOptionalChannel(params.channel);
	return (forwarding.targets ?? []).some((target) => normalizeOptionalChannel(target.channel) === channel);
}
/** Classifies whether native delivery has named channel-account owners. */
function classifyApprovalRequestChannelRoute(params) {
	if (!normalizeOptionalChannel(params.channel)) return "unbound";
	if (resolveApprovalRequestChannelAccountId(params)) return "bound-or-explicit";
	if (hasApprovalForwardTarget(params)) return "bound-or-explicit";
	return "unbound";
}
function normalizeOptionalChannel(value) {
	return normalizeMessageChannel(value);
}
/** Loads the persisted session entry referenced by an approval request, if still present. */
function resolvePersistedApprovalRequestSessionEntry(params) {
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? params.request.request.agentId ?? "main";
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	const entry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		clone: false
	});
	if (!entry) return null;
	return {
		sessionKey,
		entry
	};
}
function resolvePersistedApprovalRequestSessionBinding(params) {
	const persisted = resolvePersistedApprovalRequestSessionEntry(params);
	if (!persisted) return null;
	const { entry } = persisted;
	const origin = sessionDeliveryOrigin(entry);
	const context = deliveryContextFromSession(entry);
	const channel = normalizeOptionalChannel(context?.channel ?? origin?.provider);
	const accountId = normalizeOptionalAccountId(context?.accountId ?? origin?.accountId);
	return channel || accountId ? {
		channel,
		accountId
	} : null;
}
/** Resolves the account id an approval request belongs to for an optional channel filter. */
function resolveApprovalRequestAccountId(params) {
	const expectedChannel = normalizeOptionalChannel(params.channel);
	const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
	if (expectedChannel && turnSourceChannel && turnSourceChannel !== expectedChannel) return null;
	const turnSourceAccountId = normalizeOptionalAccountId(params.request.request.turnSourceAccountId);
	if (turnSourceAccountId) return turnSourceAccountId;
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
	const sessionChannel = sessionBinding?.channel;
	if (expectedChannel && sessionChannel && sessionChannel !== expectedChannel) return null;
	return sessionBinding?.accountId ?? null;
}
/** Resolves an approval request account only when the request can be routed to a channel. */
function resolveApprovalRequestChannelAccountId(params) {
	const expectedChannel = normalizeOptionalChannel(params.channel);
	if (!expectedChannel) return null;
	const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
	if (!turnSourceChannel || turnSourceChannel === expectedChannel) return resolveApprovalRequestAccountId(params);
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
	return sessionBinding?.channel === expectedChannel ? sessionBinding.accountId ?? null : null;
}
/** Selects the one channel account that owns a native approval request. */
function doesApprovalRequestSelectChannelAccount(params) {
	const accountId = normalizeOptionalAccountId(params.accountId) ?? normalizeOptionalAccountId(params.defaultAccountId);
	if (!accountId) return false;
	const boundAccountId = resolveApprovalRequestChannelAccountId(params);
	if (accountId === normalizeOptionalAccountId(boundAccountId)) return true;
	const forwardAccountIds = resolveApprovalForwardAccountIds(params);
	if (forwardAccountIds.includes(accountId)) return true;
	if (boundAccountId || forwardAccountIds.length > 0) return false;
	const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== normalizeOptionalChannel(params.channel)) return false;
	const eligibleAccountIds = params.eligibleAccountIds.map(normalizeOptionalAccountId).filter((candidate) => Boolean(candidate));
	return eligibleAccountIds.length === 1 && eligibleAccountIds[0] === accountId;
}
//#endregion
export { matchesApprovalRequestFilters as a, normalizeApprovalRequest as i, doesApprovalRequestSelectChannelAccount as n, resolvePersistedApprovalRequestSessionEntry as r, classifyApprovalRequestChannelRoute as t };
