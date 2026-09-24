import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { m as normalizeUniqueSingleOrTrimmedStringList, y as uniqueStrings } from "./string-normalization-DsCfAx8q.js";
import { O as hasAgentRosterProperty, k as listAgentEntries, r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { C as parseRawSessionConversationRef, T as parseThreadSessionSuffix, k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.js";
import { r as resolveProviderToolPolicy } from "./provider-tool-policy-3XzDEL5e.js";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-CvUcH_7-.js";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Cgem8hFf.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-BWFNWsJW.js";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BFaYCu9H.js";
import { b as registerRuntimeConfigSnapshotPreparer } from "./runtime-snapshot-DTssNCAN.js";
import { y as resolveSessionAgentIds } from "./agent-scope-BiRi-Smp.js";
import { n as getLoadedChannelPlugin } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import "./message-channel-iCC7oIhe.js";
import { i as logWarn } from "./logger-DgjIIHeT.js";
import { o as resolveSessionConversation } from "./delivery-info-B5Y1TlNL.js";
import { t as digestClawAgentConfig } from "./agent-config-digest-DebId5QK.js";
import { a as prepareClawInstallSchemaVersions, i as initializeCachedClawInstallSchemaVersions, o as readCachedClawInstallSchemaVersions, s as registerClawInstallSchemaVersionSnapshotListener } from "./provenance-runtime-read-DdbCG8om.js";
import { r as resolveChannelGroupToolsPolicy } from "./group-policy-DW27nR9p.js";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-CY8L5rVl.js";
import { a as resolveStoredSubagentInheritedToolDenylist, i as resolveStoredSubagentInheritedToolAllowlist, r as resolveStoredSubagentCapabilities, s as resolveSubagentCapabilityStore } from "./subagent-capabilities-9LXIvheU.js";
//#region src/claws/tool-policy-runtime.ts
const frozenToolAllowPolicies = /* @__PURE__ */ new WeakSet();
const preparedClawToolPolicies = /* @__PURE__ */ new WeakMap();
let preparedCandidates = [];
let preparedStateOptions = {};
const uninitializedStateError = /* @__PURE__ */ new Error("Assistant state database has not initialized Claw consent provenance.");
function markFrozenClawToolAllowPolicy(policy) {
	if (policy) frozenToolAllowPolicies.add(policy);
}
function isFrozenClawToolAllowPolicy(policy) {
	return policy ? frozenToolAllowPolicies.has(policy) : false;
}
function applyPreparedClawToolPolicyConsent() {
	const snapshot = readCachedClawInstallSchemaVersions(preparedStateOptions);
	for (const candidate of preparedCandidates) {
		if (snapshot.kind === "uninitialized") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: uninitializedStateError
			});
			continue;
		}
		if (snapshot.kind === "state-error") {
			if (snapshot.ownershipUnknown || snapshot.knownAgentIds.has(candidate.agentId)) preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: snapshot.error
			});
			else preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		const schemaVersionRead = snapshot.schemaVersions.get(candidate.agentId);
		if (!schemaVersionRead) {
			preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		if (schemaVersionRead.kind === "error") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: schemaVersionRead.error
			});
			continue;
		}
		if (schemaVersionRead.schemaVersion === "testclaw.clawInstallRecord.v2" && schemaVersionRead.agentConfigDigest !== candidate.agentConfigDigest) {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: /* @__PURE__ */ new Error("Claw agent configuration does not match its consent provenance.")
			});
			continue;
		}
		preparedClawToolPolicies.set(candidate.tools, { kind: schemaVersionRead.schemaVersion === "testclaw.clawInstallRecord.v2" ? "current" : "legacy" });
	}
}
function collectClawToolPolicyCandidates(config) {
	return listAgentEntries(config).flatMap((agent) => {
		const tools = agent.tools;
		return tools && (tools.profile || tools.allow?.length) ? [{
			agentId: agent.id,
			agentConfigDigest: digestClawAgentConfig(agent),
			tools
		}] : [];
	});
}
function replaceClawToolPolicyCandidates(candidates, stateOptions = {}) {
	for (const candidate of preparedCandidates) preparedClawToolPolicies.delete(candidate.tools);
	preparedCandidates = candidates;
	preparedStateOptions = stateOptions;
}
function prepareClawToolPolicyConsent(config) {
	replaceClawToolPolicyCandidates(collectClawToolPolicyCandidates(config));
	initializeCachedClawInstallSchemaVersions({
		...preparedStateOptions,
		artifactPreservingReadOnly: false
	});
	applyPreparedClawToolPolicyConsent();
}
async function prepareClawToolPolicyConsentAsync(config, context) {
	const preparedSchemaVersions = await prepareClawInstallSchemaVersions({
		env: context.env,
		artifactPreservingReadOnly: false
	});
	return () => {
		replaceClawToolPolicyCandidates(collectClawToolPolicyCandidates(config), { path: preparedSchemaVersions.path });
		preparedSchemaVersions.publish();
		applyPreparedClawToolPolicyConsent();
	};
}
registerClawInstallSchemaVersionSnapshotListener(() => applyPreparedClawToolPolicyConsent());
registerRuntimeConfigSnapshotPreparer(prepareClawToolPolicyConsent, { prepareAsync: prepareClawToolPolicyConsentAsync });
var ClawToolProfileConsentError = class extends Error {
	constructor(agentId, options = {}) {
		super(options.unboundedFullProfile ? `Claw-managed agent ${JSON.stringify(agentId)} uses the legacy unbounded full tool profile. Add an explicit tools.allow list to its package Assistant profile, then run \`testclaw claws update ${agentId}\` and approve the refreshed tool authority.` : `Claw-managed agent ${JSON.stringify(agentId)} uses a legacy dynamic tool policy. Run \`testclaw claws update ${agentId}\` and approve the refreshed tool authority before running it.`);
		this.name = "ClawToolProfileConsentError";
	}
};
var ClawToolProfileConsentStateError = class extends Error {
	constructor(agentId, cause) {
		super(`Cannot verify the installed tool authority for Claw-managed agent ${JSON.stringify(agentId)}. Repair the Assistant state database before running it.`, { cause });
		this.name = "ClawToolProfileConsentStateError";
	}
};
function resolveClawToolPolicyConsent(params) {
	if (!params.agentId || !params.ownsProfile && !params.hasAgentAllowlist) return { frozen: false };
	const prepared = params.agentTools ? preparedClawToolPolicies.get(params.agentTools) : void 0;
	if (!prepared) return { frozen: false };
	if (prepared.kind === "state-error") throw new ClawToolProfileConsentStateError(params.agentId, prepared.error);
	if (prepared.kind === "legacy" || params.ownsProfile && (params.profile !== "full" || !params.hasAgentAllowlist)) throw new ClawToolProfileConsentError(params.agentId, { unboundedFullProfile: prepared.kind === "legacy" && params.profile === "full" && !params.hasAgentAllowlist });
	return { frozen: params.hasAgentAllowlist };
}
//#endregion
//#region src/agents/agent-tools.policy.ts
/**
* Resolves sandbox tool policies for agents, providers, sub-agents, and group
* sessions. Keeps runtime tool filtering tied to canonical config, session
* provenance, and inherited sub-agent capabilities.
*/
/**
* Tools always denied for sub-agents regardless of depth.
* These are system-level or interactive tools that sub-agents should never use.
*/
const SUBAGENT_TOOL_DENY_ALWAYS = [
	"gateway",
	"agents_list",
	"testclaw",
	"session_status",
	"progress_card",
	AUTOMATIONS_TOOL_NAME,
	"message",
	"sessions_send",
	"conversations_list",
	"conversations_send",
	"conversations_turn"
];
/** Tools that only make sense for orchestrator sub-agents that can spawn children. */
const SUBAGENT_TOOL_DENY_LEAF = [
	"subagents",
	"sessions_list",
	"sessions_history",
	"sessions_search",
	"sessions_spawn"
];
function resolveSubagentDenyListForRole(role) {
	if (role === "leaf") return [...SUBAGENT_TOOL_DENY_ALWAYS, ...SUBAGENT_TOOL_DENY_LEAF];
	return [...SUBAGENT_TOOL_DENY_ALWAYS];
}
function mergeConfiguredSubagentAllow(allow, alsoAllow) {
	return allow && alsoAllow ? uniqueStrings([...allow, ...alsoAllow]) : allow;
}
/** Resolve sub-agent tool policy from stored session capabilities. */
function resolveSubagentToolPolicyForSession(cfg, sessionKey, opts) {
	const configured = cfg?.tools?.subagents?.tools;
	const store = resolveSubagentCapabilityStore(sessionKey, {
		cfg,
		store: opts?.store
	});
	const capabilities = resolveStoredSubagentCapabilities(sessionKey, {
		cfg,
		store
	});
	const allow = Array.isArray(configured?.allow) ? configured.allow : void 0;
	const alsoAllow = Array.isArray(configured?.alsoAllow) ? configured.alsoAllow : void 0;
	const deny = [...resolveSubagentDenyListForRole(capabilities.role), ...Array.isArray(configured?.deny) ? configured.deny : []];
	return {
		allow: mergeConfiguredSubagentAllow(allow, alsoAllow),
		deny
	};
}
/** Resolve the tool policy inherited from a parent sub-agent session. */
function resolveInheritedToolPolicyForSession(cfg, sessionKey, opts) {
	const inheritedToolAllow = resolveStoredSubagentInheritedToolAllowlist(sessionKey, {
		cfg,
		store: opts?.store
	});
	const inheritedToolDeny = resolveStoredSubagentInheritedToolDenylist(sessionKey, {
		cfg,
		store: opts?.store
	});
	if (inheritedToolAllow.length === 0 && inheritedToolDeny.length === 0) return;
	return {
		...inheritedToolAllow.length > 0 ? { allow: inheritedToolAllow } : {},
		...inheritedToolDeny.length > 0 ? { deny: inheritedToolDeny } : {}
	};
}
/** Resolve the shared profile, scope, extra, and sandbox policy layers. */
function resolveConfiguredToolPolicies(params) {
	const policies = [];
	const profile = params.agentTools?.profile ?? params.cfg.tools?.profile;
	const profileAlsoAllow = resolveExplicitProfileAlsoAllow(params.agentTools) ?? resolveExplicitProfileAlsoAllow(params.cfg.tools);
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow);
	if (profilePolicy) policies.push(profilePolicy);
	const globalPolicy = pickSandboxToolPolicy(params.cfg.tools ?? void 0);
	if (globalPolicy) policies.push(globalPolicy);
	const agentPolicy = pickSandboxToolPolicy(params.agentTools);
	if (agentPolicy) policies.push(agentPolicy);
	for (const policy of params.extraPolicies ?? []) if (policy) policies.push(policy);
	if (params.sandboxMode === "all") policies.push(resolveSandboxToolPolicyForAgent(params.cfg, params.agentId ?? void 0));
	return policies;
}
function collectUniqueStrings(values) {
	return normalizeUniqueSingleOrTrimmedStringList(values);
}
function buildScopedGroupIdCandidates(groupId) {
	const raw = groupId?.trim();
	if (!raw) return [];
	const topicSenderMatch = raw.match(/^(.+):topic:([^:]+):sender:([^:]+)$/i);
	if (topicSenderMatch) {
		const [, chatId, topicId] = topicSenderMatch;
		return collectUniqueStrings([
			raw,
			`${chatId}:topic:${topicId}`,
			chatId
		]);
	}
	const topicMatch = raw.match(/^(.+):topic:([^:]+)$/i);
	if (topicMatch) {
		const [, chatId, topicId] = topicMatch;
		return collectUniqueStrings([`${chatId}:topic:${topicId}`, chatId]);
	}
	const senderMatch = raw.match(/^(.+):sender:([^:]+)$/i);
	if (senderMatch) {
		const [, chatId] = senderMatch;
		return collectUniqueStrings([raw, chatId]);
	}
	return [raw];
}
function resolveGroupContextFromSessionKey(sessionKey) {
	const raw = (sessionKey ?? "").trim();
	if (!raw) return {};
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(raw);
	const conversationKey = threadId ? baseSessionKey : raw;
	const conversation = parseRawSessionConversationRef(conversationKey);
	if (conversation) {
		const resolvedConversation = resolveSessionConversation({
			channel: conversation.channel,
			kind: conversation.kind,
			rawId: conversation.rawId
		});
		return {
			channel: conversation.channel,
			groupIds: collectUniqueStrings([
				...buildScopedGroupIdCandidates(conversation.rawId),
				resolvedConversation?.id,
				resolvedConversation?.baseConversationId,
				...resolvedConversation?.parentConversationCandidates ?? []
			])
		};
	}
	const parts = (conversationKey ?? raw).split(":").filter(Boolean);
	let body = parts[0] === "agent" ? parts.slice(2) : parts;
	if (body[0] === "subagent") body = body.slice(1);
	if (body.length < 3) return {};
	const [channel, kind, ...rest] = body;
	if (kind !== "group" && kind !== "channel") return {};
	const groupId = rest.join(":").trim();
	if (!groupId) return {};
	return {
		channel: normalizeLowercaseStringOrEmpty(channel),
		groupIds: buildScopedGroupIdCandidates(groupId)
	};
}
function resolveTrustedGroupIdFromContexts(params) {
	const callerGroupId = (params.groupId ?? "").trim();
	if (!callerGroupId) return {
		groupId: params.groupId,
		dropped: false
	};
	const trustedGroupIds = collectUniqueStrings([...params.sessionContext.groupIds ?? [], ...params.spawnedContext.groupIds ?? []]);
	if (trustedGroupIds.length === 0) return {
		groupId: null,
		dropped: true
	};
	if (trustedGroupIds.includes(callerGroupId)) return {
		groupId: params.groupId,
		dropped: false
	};
	return {
		groupId: null,
		dropped: true
	};
}
/** Validate caller-supplied group ids against server-derived session context. */
function resolveTrustedGroupId(params) {
	return resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext: resolveGroupContextFromSessionKey(params.sessionKey),
		spawnedContext: resolveGroupContextFromSessionKey(params.spawnedBy)
	});
}
/** True when a server-derived session key names a group/channel conversation. */
function sessionKeyNamesGroupConversation(sessionKey) {
	return (resolveGroupContextFromSessionKey(sessionKey).groupIds?.length ?? 0) > 0;
}
function resolveExplicitProfileAlsoAllow(tools) {
	return Array.isArray(tools?.alsoAllow) ? tools.alsoAllow : void 0;
}
function profileAllowsGatewayConfigReads(profile, alsoAllow) {
	const policy = resolveToolProfilePolicy(profile);
	if (!policy?.allow || policy.allow.includes("*")) return true;
	const allow = normalizeUniqueSingleOrTrimmedStringList(alsoAllow);
	return allow.length > 0 && createToolPolicyMatcher({ allow })("gateway");
}
function hasExplicitToolSection(section) {
	return section !== void 0 && section !== null;
}
/** Detect removed implicit grants for migration warnings only (#47487). */
function detectImplicitProfileGrants(params) {
	const entries = [];
	if (hasExplicitToolSection(params.agentTools?.exec) || params.includeGlobalSections && hasExplicitToolSection(params.globalTools?.exec)) entries.push({
		section: "tools.exec",
		grants: ["exec", "process"]
	});
	if (hasExplicitToolSection(params.agentTools?.fs) || params.includeGlobalSections && hasExplicitToolSection(params.globalTools?.fs)) entries.push({
		section: "tools.fs",
		grants: [
			"read",
			"write",
			"edit"
		]
	});
	return entries;
}
/** Resolve the layered global, provider, agent, and profile tool policies. */
function resolveEffectiveToolPolicy(params) {
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	const agentId = params.config && (!hasAgentRosterProperty(params.config) || listAgentEntries(params.config).length > 0) ? resolveSessionAgentIds({
		config: params.config,
		agentId: explicitAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : explicitAgentId ?? parseAgentSessionKey(params.sessionKey)?.agentId;
	const agentConfig = params.config && agentId ? resolveAgentConfig(params.config, agentId) : void 0;
	const implicitDefaultTools = params.config ? (params.config.agents?.defaults)?.tools : void 0;
	const agentTools = agentConfig?.tools ?? (params.config && !hasAgentRosterProperty(params.config) ? implicitDefaultTools : void 0);
	const globalTools = params.config?.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileSource = agentTools?.profile ? "agent" : globalTools?.profile ? "global" : void 0;
	const providerPolicy = resolveProviderToolPolicy({
		byProvider: globalTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const agentProviderPolicy = resolveProviderToolPolicy({
		byProvider: agentTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const explicitProfileAlsoAllow = resolveExplicitProfileAlsoAllow(agentTools) ?? resolveExplicitProfileAlsoAllow(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	if (resolveClawToolPolicyConsent({
		agentTools,
		agentId,
		profile,
		ownsProfile: profileSource === "agent",
		hasAgentAllowlist: (agentPolicy?.allow?.length ?? 0) > 0
	}).frozen) markFrozenClawToolAllowPolicy(agentPolicy);
	const effectivePolicy = {
		agentId,
		globalPolicy: pickSandboxToolPolicy(globalTools),
		globalProviderPolicy: pickSandboxToolPolicy(providerPolicy),
		agentPolicy,
		agentProviderPolicy: pickSandboxToolPolicy(agentProviderPolicy),
		profile,
		providerProfile: agentProviderPolicy?.profile ?? providerPolicy?.profile,
		profileAlsoAllow: explicitProfileAlsoAllow ? uniqueStrings(explicitProfileAlsoAllow) : void 0,
		providerProfileAlsoAllow: Array.isArray(agentProviderPolicy?.alsoAllow) ? agentProviderPolicy?.alsoAllow : Array.isArray(providerPolicy?.alsoAllow) ? providerPolicy?.alsoAllow : void 0
	};
	const gatewayConfigReadAllowed = profileAllowsGatewayConfigReads(profile, effectivePolicy.profileAlsoAllow) && profileAllowsGatewayConfigReads(effectivePolicy.providerProfile, effectivePolicy.providerProfileAlsoAllow);
	if (profile) {
		const implicitGrants = detectImplicitProfileGrants({
			globalTools,
			agentTools,
			includeGlobalSections: profileSource === "global"
		});
		if (implicitGrants.length > 0) {
			const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), explicitProfileAlsoAllow);
			const matchesProfile = createToolPolicyMatcher(profilePolicy);
			const restrictionMatchers = [
				effectivePolicy.globalPolicy,
				effectivePolicy.globalProviderPolicy,
				effectivePolicy.agentPolicy,
				effectivePolicy.agentProviderPolicy,
				mergeAlsoAllowPolicy(resolveToolProfilePolicy(effectivePolicy.providerProfile), effectivePolicy.providerProfileAlsoAllow)
			].map((policy) => createToolPolicyMatcher(policy));
			const uncoveredEntries = implicitGrants.map((entry) => ({
				section: entry.section,
				grants: entry.grants.filter((toolName) => !matchesProfile(toolName) && restrictionMatchers.every((matches) => matches(toolName)))
			})).filter((entry) => entry.grants.length > 0);
			const uncovered = uncoveredEntries.flatMap((entry) => entry.grants);
			if (uncovered.length > 0) logWarn(`tools policy: profile "${profile}"${agentId ? ` (agent "${agentId}")` : ""} has configured tool sections (${uncoveredEntries.map((entry) => entry.section).join(" / ")}) that no longer implicitly widen the profile. Add alsoAllow: [${uncovered.map((toolName) => `"${toolName}"`).join(", ")}] explicitly if these tools should be available. See #47487.`);
		}
	}
	return {
		...effectivePolicy,
		gatewayConfigReadAllowed
	};
}
function unavailableScheduledAccount(accountId) {
	return {
		kind: "account-unavailable",
		accountId,
		message: `Scheduled account "${accountId}" is unavailable. Re-add it to the channel configuration, or recreate this automation from the intended account.`
	};
}
/** Resolve policy without conflating unavailable scheduled authority with intentional denial. */
function resolveGroupToolPolicyOutcome(params) {
	if (!params.config) return { kind: "resolved" };
	const sessionContext = resolveGroupContextFromSessionKey(params.sessionKey);
	const spawnedContext = resolveGroupContextFromSessionKey(params.spawnedBy);
	const trustedGroup = resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext,
		spawnedContext
	});
	const groupIds = collectUniqueStrings([
		...sessionContext.groupIds ?? [],
		...spawnedContext.groupIds ?? [],
		...buildScopedGroupIdCandidates(trustedGroup.groupId)
	]);
	const channelRaw = sessionContext.channel ?? spawnedContext.channel ?? params.messageProvider;
	const channel = normalizeMessageChannel(channelRaw);
	const accountId = normalizeAccountId(params.accountId);
	if (!channel) return params.requireConfiguredAccount && accountId !== "default" ? unavailableScheduledAccount(accountId) : { kind: "resolved" };
	let plugin;
	try {
		plugin = getLoadedChannelPlugin(channel);
	} catch {
		plugin = void 0;
	}
	if (params.requireConfiguredAccount && accountId !== "default") {
		let configured;
		try {
			configured = plugin?.config.listAccountIds(params.config).some((candidate) => normalizeAccountId(candidate) === accountId) === true;
		} catch {
			configured = false;
		}
		if (!configured) return unavailableScheduledAccount(accountId);
	}
	if (groupIds.length === 0) return { kind: "resolved" };
	for (const groupId of groupIds) {
		const toolsConfig = plugin?.groups?.resolveToolPolicy?.({
			cfg: params.config,
			groupId,
			groupChannel: trustedGroup.dropped ? null : params.groupChannel,
			groupSpace: trustedGroup.dropped ? null : params.groupSpace,
			accountId,
			senderPolicyMode: params.senderPolicyMode,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		});
		const policy = pickSandboxToolPolicy(toolsConfig);
		if (policy) return {
			kind: "resolved",
			policy
		};
	}
	const configTools = resolveChannelGroupToolsPolicy({
		cfg: params.config,
		channel,
		messageProvider: channel,
		groupId: groupIds[0],
		groupIdCandidates: groupIds.slice(1),
		accountId,
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	return {
		kind: "resolved",
		policy: pickSandboxToolPolicy(configTools)
	};
}
/** Tool-building callers must stop before exposing a surface with unavailable authority. */
function resolveGroupToolPolicy(params) {
	const outcome = resolveGroupToolPolicyOutcome(params);
	if (outcome.kind === "account-unavailable") throw new Error(outcome.message);
	return outcome.policy;
}
//#endregion
export { resolveSubagentToolPolicyForSession as a, isFrozenClawToolAllowPolicy as c, resolveInheritedToolPolicyForSession as i, resolveEffectiveToolPolicy as n, resolveTrustedGroupId as o, resolveGroupToolPolicy as r, sessionKeyNamesGroupConversation as s, resolveConfiguredToolPolicies as t };
