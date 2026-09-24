import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { r as findChatChannelLabel } from "./ids-Bp7HxmUs.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import { t as getChannelPlugin } from "./registry-PMJLv7Nh.js";
import { n as resolveChannelApprovalCapability } from "./plugins-23wkyULy.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import "./message-channel-iCC7oIhe.js";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
import { t as isApprovalNotFoundError } from "./approval-errors-Bzw_-cAg.js";
import { t as getGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-D4y_Snaq.js";
import { l as requireGatewayClientScope } from "./command-gates-B1twWQps.js";
import { t as resolveChannelAccountId } from "./channel-context-DHMMpjL-.js";
import { n as withOperatorApprovalsGatewayClient } from "./operator-approvals-client-DaUjT3SK.js";
//#region src/infra/approval-gateway-resolver.ts
async function resolveApprovalOverGateway(params) {
	const approvalKind = params.approvalKind;
	const resolveMethod = params.resolveMethod;
	const canonicalKind = approvalKind === "exec" || approvalKind === "plugin" || approvalKind === "system-agent" ? approvalKind : null;
	const legacyMethod = resolveMethod === "exec" || resolveMethod === "plugin" ? resolveMethod : null;
	const hasCanonicalKind = canonicalKind !== null;
	const hasLegacyMethod = legacyMethod !== null;
	const allowPluginFallback = params.allowPluginFallback;
	const gatewayRuntime = params.gatewayRuntime;
	if (approvalKind !== void 0) {
		if (!hasCanonicalKind || resolveMethod !== void 0 || allowPluginFallback !== void 0) throw new Error("canonical approval resolution requires exactly one valid owner kind");
	} else if (resolveMethod !== void 0 && !hasLegacyMethod || allowPluginFallback !== void 0 && typeof allowPluginFallback !== "boolean" || gatewayRuntime !== void 0) throw new Error("legacy approval resolution requires valid routing options");
	if (params.decision !== "allow-once" && params.decision !== "allow-always" && params.decision !== "deny") throw new Error("approval resolution requires a valid decision");
	const approvalId = params.approvalId;
	if (typeof approvalId !== "string" || !isWellFormedApprovalId(approvalId)) throw new Error("approval resolution requires an approval id");
	const senderId = params.senderId?.trim();
	const channel = params.channel?.trim();
	const accountId = params.accountId?.trim();
	if (Boolean(channel || accountId || senderId) && (!channel || !accountId || !senderId)) throw new Error("channel approval resolution requires channel, account, and sender identity");
	const reviewer = channel && accountId && senderId ? {
		channel,
		accountId,
		senderId
	} : void 0;
	const channelLabel = channel ? findChatChannelLabel(channel) ?? channel : void 0;
	const clientDisplayName = params.clientDisplayName ?? (channelLabel ? `${channelLabel} approval (${senderId ?? "unknown"})` : `Approval (${senderId ?? "unknown"})`);
	const canonicalGatewayRuntime = params.gatewayRuntime;
	if (canonicalGatewayRuntime && canonicalKind) return await canonicalGatewayRuntime.request("approval.resolve", {
		id: approvalId,
		kind: canonicalKind,
		decision: params.decision,
		...reviewer ? { reviewer } : {}
	}, { clientDisplayName });
	const requestWithClient = async (gatewayClient) => {
		if (hasCanonicalKind) {
			const resolveParams = {
				id: approvalId,
				kind: canonicalKind,
				decision: params.decision,
				...reviewer ? { reviewer } : {}
			};
			return await gatewayClient.request("approval.resolve", resolveParams);
		}
		const requestLegacyResolve = async (method) => {
			await gatewayClient.request(method, {
				id: approvalId,
				decision: params.decision,
				...reviewer ? { reviewer } : {}
			});
		};
		if (legacyMethod === "plugin" || !legacyMethod && approvalId.startsWith("plugin:")) {
			await requestLegacyResolve("plugin.approval.resolve");
			return;
		}
		try {
			await requestLegacyResolve("exec.approval.resolve");
		} catch (error) {
			if (allowPluginFallback !== true || !isApprovalNotFoundError(error)) throw error;
			await requestLegacyResolve("plugin.approval.resolve");
		}
	};
	const scopedGatewayRuntime = getGatewayNativeApprovalRuntime();
	const result = scopedGatewayRuntime ? await requestWithClient({ request: async (method, requestParams) => await scopedGatewayRuntime.request(method, requestParams, { clientDisplayName }) }) : await withOperatorApprovalsGatewayClient({
		config: params.cfg,
		gatewayUrl: params.gatewayUrl,
		clientDisplayName
	}, requestWithClient);
	return hasCanonicalKind ? result : void 0;
}
//#endregion
//#region src/plugin-sdk/approval-auth-helpers.ts
const IMPLICIT_SAME_CHAT_APPROVAL_AUTHORIZATION = Symbol("testclaw.implicitSameChatApprovalAuthorization");
/**
* Checks whether an authorization result came from the implicit same-chat
* fallback instead of an explicitly configured approver allowlist.
*/
function isImplicitSameChatApprovalAuthorization(result) {
	return Boolean(result && result[IMPLICIT_SAME_CHAT_APPROVAL_AUTHORIZATION]);
}
//#endregion
//#region src/infra/channel-approval-auth.ts
/** Resolves whether a chat `/approve` command is authorized by channel-specific approval policy. */
function resolveApprovalCommandAuthorization(params) {
	const channel = normalizeMessageChannel(params.channel);
	if (!channel) return {
		authorized: true,
		explicit: false
	};
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	const resolved = approvalCapability?.authorizeActorAction?.({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: params.senderId,
		action: "approve",
		approvalKind: params.kind
	});
	if (!resolved) return {
		authorized: true,
		explicit: false
	};
	const implicitSameChatAuthorization = isImplicitSameChatApprovalAuthorization(resolved);
	const availability = approvalCapability?.getActionAvailabilityState?.({
		cfg: params.cfg,
		accountId: params.accountId,
		action: "approve",
		approvalKind: params.kind
	});
	return {
		authorized: resolved.authorized,
		reason: resolved.reason,
		explicit: resolved.authorized ? !implicitSameChatAuthorization && availability?.kind !== "disabled" : true
	};
}
//#endregion
//#region src/auto-reply/reply/commands-approve.ts
const COMMAND_REGEX = /^\/?approve(?:\s|$)/i;
const FOREIGN_COMMAND_MENTION_REGEX = /^\/approve@([^\s]+)(?:\s|$)/i;
const DECISION_ALIASES = {
	allow: "allow-once",
	once: "allow-once",
	"allow-once": "allow-once",
	allowonce: "allow-once",
	always: "allow-always",
	"allow-always": "allow-always",
	allowalways: "allow-always",
	deny: "deny",
	reject: "deny",
	block: "deny"
};
const APPROVE_USAGE_TEXT = "Usage: /approve <id> <decision> (see the pending approval message for available decisions)";
function parseApproveCommand(raw) {
	const trimmed = raw.trim();
	if (FOREIGN_COMMAND_MENTION_REGEX.test(trimmed)) return {
		ok: false,
		error: "❌ This /approve command targets a different Telegram bot."
	};
	const commandMatch = trimmed.match(COMMAND_REGEX);
	if (!commandMatch) return null;
	const rest = trimmed.slice(commandMatch[0].length).trim();
	if (!rest) return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
	const tokens = rest.split(/\s+/).filter(Boolean);
	if (tokens.length < 2) return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
	const first = normalizeLowercaseStringOrEmpty(tokens[0]);
	const second = normalizeLowercaseStringOrEmpty(tokens[1]);
	const firstDecision = Object.hasOwn(DECISION_ALIASES, first) ? DECISION_ALIASES[first] : void 0;
	if (firstDecision) return {
		ok: true,
		decision: firstDecision,
		id: tokens.slice(1).join(" ").trim()
	};
	const secondDecision = Object.hasOwn(DECISION_ALIASES, second) ? DECISION_ALIASES[second] : void 0;
	if (secondDecision) return {
		ok: true,
		decision: secondDecision,
		id: expectDefined(tokens[0], "tokens entry at 0")
	};
	return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
}
function buildResolvedByLabel(params) {
	return `${params.command.channel}:${params.command.senderId ?? "unknown"}`;
}
function formatApprovalSubmitError(error) {
	return formatErrorMessage(error);
}
function resolveAuthorizedApprovalKinds(params) {
	return [...params.execAuthorization.authorized ? ["exec"] : [], ...params.pluginAuthorization.authorized ? ["plugin"] : []];
}
function resolveApprovalAuthorizationError(params) {
	return params.execAuthorization.reason ?? params.pluginAuthorization.reason ?? "❌ You are not authorized to approve this request.";
}
async function handleApproveCommandFromContext(params, allowTextCommands) {
	if (!allowTextCommands) return null;
	const normalized = params.command.commandBodyNormalized;
	const parsed = parseApproveCommand(normalized);
	if (!parsed) return null;
	if (!parsed.ok) return {
		shouldContinue: false,
		reply: { text: parsed.error }
	};
	const effectiveAccountId = resolveChannelAccountId({
		cfg: params.cfg,
		ctx: params.ctx,
		command: params.command
	});
	const execApprovalAuthorization = resolveApprovalCommandAuthorization({
		cfg: params.cfg,
		channel: params.command.channel,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		kind: "exec"
	});
	const pluginApprovalAuthorization = resolveApprovalCommandAuthorization({
		cfg: params.cfg,
		channel: params.command.channel,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		kind: "plugin"
	});
	const hasExplicitApprovalAuthorization = execApprovalAuthorization.explicit && execApprovalAuthorization.authorized || pluginApprovalAuthorization.explicit && pluginApprovalAuthorization.authorized;
	if (!params.command.isAuthorizedSender && !hasExplicitApprovalAuthorization) {
		logVerbose(`Ignoring /approve from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	const missingScope = requireGatewayClientScope(params, {
		label: "/approve",
		allowedScopes: ["operator.approvals", "operator.admin"],
		missingText: "❌ /approve requires operator.approvals for gateway clients."
	});
	if (missingScope) return missingScope;
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(params.command.channel));
	const commandBehaviors = /* @__PURE__ */ new Map();
	for (const approvalKind of ["exec", "plugin"]) commandBehaviors.set(approvalKind, approvalCapability?.resolveApproveCommandBehavior?.({
		cfg: params.cfg,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		approvalKind
	}));
	const blockedCommandResult = () => {
		const replyBehavior = Array.from(commandBehaviors.values()).find((behavior) => behavior?.kind === "reply");
		if (replyBehavior?.kind === "reply") return {
			shouldContinue: false,
			reply: { text: replyBehavior.text }
		};
		if (Array.from(commandBehaviors.values()).some((behavior) => behavior?.kind === "ignore")) return { shouldContinue: false };
		return null;
	};
	const resolvedBy = buildResolvedByLabel(params);
	const callApprovalMethod = async (resolveMethod) => {
		await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: parsed.id,
			decision: parsed.decision,
			...approvalCapability?.authorizeActorAction ? {
				channel: params.command.channel,
				accountId: effectiveAccountId,
				senderId: params.command.senderId
			} : {},
			resolveMethod,
			clientDisplayName: `Chat approval (${resolvedBy})`
		});
	};
	const methods = resolveAuthorizedApprovalKinds({
		execAuthorization: execApprovalAuthorization,
		pluginAuthorization: pluginApprovalAuthorization
	}).filter((approvalKind) => {
		const behavior = commandBehaviors.get(approvalKind);
		return !behavior || behavior.kind === "allow";
	});
	if (methods.length === 0) {
		const blocked = blockedCommandResult();
		if (blocked) return blocked;
		return {
			shouldContinue: false,
			reply: { text: resolveApprovalAuthorizationError({
				execAuthorization: execApprovalAuthorization,
				pluginAuthorization: pluginApprovalAuthorization
			}) }
		};
	}
	for (const [index, method] of methods.entries()) try {
		await callApprovalMethod(method);
		break;
	} catch (error) {
		const isLastMethod = index === methods.length - 1;
		if (!isApprovalNotFoundError(error)) return {
			shouldContinue: false,
			reply: { text: `❌ Failed to submit approval: ${formatApprovalSubmitError(error)}` }
		};
		if (isLastMethod) {
			const blocked = blockedCommandResult();
			if (blocked) return blocked;
			return {
				shouldContinue: false,
				reply: { text: `❌ Failed to submit approval: ${formatApprovalSubmitError(error)}` }
			};
		}
	}
	return {
		shouldContinue: false,
		reply: { text: `✅ Approval ${parsed.decision} submitted for ${parsed.id}.` }
	};
}
const handleApproveCommand = async (params, allowTextCommands) => await handleApproveCommandFromContext(params, allowTextCommands);
//#endregion
export { handleApproveCommandFromContext as n, handleApproveCommand as t };
