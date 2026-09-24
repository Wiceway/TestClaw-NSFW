import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as resolveGlobalMap } from "./global-singleton-DmdlcXls.js";
import { d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { c as resolveAgentIdFromSessionKey, f as sanitizeAgentId } from "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { r as sha256HexPrefixCore } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-B7K42D1p.js";
import { c as resolveAgentExplicitModelPrimary } from "./agent-scope-BiRi-Smp.js";
import { n as parseModelRef } from "./model-selection-normalize-DyxdaT9v.js";
import { n as getLoadedChannelPluginEntryById } from "./registry-loaded-llHP5sCP.js";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-hBkALjff.js";
import { r as listConfiguredBindings } from "./bindings-CI-O7TMQ.js";
import { a as pickFirstExistingAgentId } from "./resolve-route-BBuGiPPu.js";
//#region src/acp/persistent-bindings.types.ts
/** Normalizes binding mode, defaulting to persistent sessions. */
function normalizeMode(value) {
	return normalizeOptionalLowercaseString(value) === "oneshot" ? "oneshot" : "persistent";
}
/** Extracts supported ACP binding config keys from unknown plugin config. */
function normalizeBindingConfig(raw) {
	if (!raw || typeof raw !== "object") return {};
	const shape = raw;
	const mode = normalizeOptionalString(shape.mode);
	return {
		mode: mode ? normalizeMode(mode) : void 0,
		cwd: normalizeOptionalString(shape.cwd),
		backend: normalizeOptionalString(shape.backend),
		label: normalizeOptionalString(shape.label)
	};
}
function buildBindingHash(params) {
	return sha256HexPrefixCore(`${params.channel}:${params.accountId}:${params.conversationId}`, 16);
}
/** Builds the stable generated ACP session key for a configured binding. */
function buildConfiguredAcpSessionKey(spec) {
	const hash = buildBindingHash({
		channel: spec.channel,
		accountId: spec.accountId,
		conversationId: spec.conversationId
	});
	return `agent:${sanitizeAgentId(spec.agentId)}:acp:binding:${spec.channel}:${spec.accountId}:${hash}`;
}
/** Converts a configured ACP binding spec into an outbound session binding record. */
function toConfiguredAcpBindingRecord(spec) {
	return {
		bindingId: `config:acp:${spec.channel}:${spec.accountId}:${spec.conversationId}`,
		targetSessionKey: buildConfiguredAcpSessionKey(spec),
		targetKind: "session",
		conversation: {
			channel: spec.channel,
			accountId: spec.accountId,
			conversationId: spec.conversationId,
			parentConversationId: spec.parentConversationId
		},
		status: "active",
		boundAt: 0,
		metadata: {
			source: "config",
			mode: spec.mode,
			agentId: spec.agentId,
			...spec.acpAgentId ? { acpAgentId: spec.acpAgentId } : {},
			label: spec.label,
			...spec.model ? { model: spec.model } : {},
			...spec.thinking ? { thinking: spec.thinking } : {},
			...spec.backend ? { backend: spec.backend } : {},
			...spec.cwd ? { cwd: spec.cwd } : {}
		}
	};
}
/** Parses generated configured-binding session keys back to channel/account identity. */
function parseConfiguredAcpSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed.startsWith("agent:")) return null;
	const rest = trimmed.slice(trimmed.indexOf(":") + 1);
	const nextSeparator = rest.indexOf(":");
	if (nextSeparator === -1) return null;
	const tokens = rest.slice(nextSeparator + 1).split(":");
	if (tokens.length !== 5 || tokens[0] !== "acp" || tokens[1] !== "binding") return null;
	const channel = normalizeOptionalLowercaseString(tokens[2]);
	if (!channel) return null;
	return {
		channel,
		accountId: normalizeAccountId(tokens[3] ?? "default")
	};
}
function resolveConfiguredAcpBindingSpecFromRecord(record) {
	if (record.targetKind !== "session") return null;
	const conversationId = record.conversation.conversationId.trim();
	if (!conversationId) return null;
	const agentId = normalizeOptionalString(record.metadata?.agentId) ?? resolveAgentIdFromSessionKey(record.targetSessionKey);
	if (!agentId) return null;
	return {
		channel: record.conversation.channel,
		accountId: normalizeAccountId(record.conversation.accountId),
		conversationId,
		parentConversationId: normalizeOptionalString(record.conversation.parentConversationId),
		agentId,
		acpAgentId: normalizeOptionalString(record.metadata?.acpAgentId),
		mode: normalizeMode(record.metadata?.mode),
		model: normalizeOptionalString(record.metadata?.model),
		thinking: normalizeOptionalString(record.metadata?.thinking),
		cwd: normalizeOptionalString(record.metadata?.cwd),
		backend: normalizeOptionalString(record.metadata?.backend),
		label: normalizeOptionalString(record.metadata?.label)
	};
}
//#endregion
//#region src/channels/plugins/acp-configured-binding-consumer.ts
/**
* ACP configured binding consumer.
*
* Converts channel configured-binding rules into persistent ACP binding records.
*/
function resolveAgentRuntimeAcpDefaults(params) {
	const ownerAgentId = normalizeLowercaseStringOrEmpty(params.ownerAgentId);
	const agent = resolveAgentConfig(params.cfg, ownerAgentId);
	if (!agent || agent.runtime?.type !== "acp") return {};
	return {
		acpAgentId: normalizeOptionalString(agent.runtime.acp?.agent),
		mode: normalizeOptionalString(agent.runtime.acp?.mode),
		cwd: normalizeOptionalString(agent.runtime.acp?.cwd),
		backend: normalizeOptionalString(agent.runtime.acp?.backend)
	};
}
function resolveConfiguredBindingWorkspaceCwd(params) {
	if (normalizeOptionalString(resolveAgentConfig(params.cfg, params.agentId)?.workspace)) return resolveAgentWorkspaceDir(params.cfg, params.agentId);
	if (normalizeOptionalString(params.cfg.agents?.defaults?.workspace)) return resolveAgentWorkspaceDir(params.cfg, params.agentId);
}
function buildAcpTargetFactory(params) {
	if (params.binding.type !== "acp") return null;
	const runtimeDefaults = resolveAgentRuntimeAcpDefaults({
		cfg: params.cfg,
		ownerAgentId: params.agentId
	});
	const bindingOverrides = normalizeBindingConfig(params.binding.acp);
	const mode = normalizeMode(bindingOverrides.mode ?? runtimeDefaults.mode);
	const model = resolveAgentExplicitModelPrimary(params.cfg, params.agentId);
	const modelRef = model ? parseModelRef(model, "") : null;
	const thinking = resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault ?? (modelRef ? resolveConfiguredThinkingDefaultCore({
		cfg: params.cfg,
		...modelRef
	}) : params.cfg.agents?.defaults?.thinkingDefault);
	const cwd = bindingOverrides.cwd ?? runtimeDefaults.cwd ?? resolveConfiguredBindingWorkspaceCwd({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const backend = bindingOverrides.backend ?? runtimeDefaults.backend;
	const label = bindingOverrides.label;
	const acpAgentId = normalizeOptionalString(runtimeDefaults.acpAgentId);
	return {
		driverId: "acp",
		materialize: ({ accountId, conversation }) => {
			const spec = {
				channel: params.channel,
				accountId,
				conversationId: conversation.conversationId,
				parentConversationId: conversation.parentConversationId,
				agentId: params.agentId,
				acpAgentId,
				mode,
				model,
				thinking,
				cwd,
				backend,
				label
			};
			return {
				record: toConfiguredAcpBindingRecord(spec),
				statefulTarget: {
					kind: "stateful",
					driverId: "acp",
					sessionKey: buildConfiguredAcpSessionKey(spec),
					agentId: params.agentId,
					...label ? { label } : {}
				}
			};
		}
	};
}
/**
* Configured binding consumer that materializes ACP persistent or oneshot targets.
*/
const acpConfiguredBindingConsumer = {
	id: "acp",
	supports: (binding) => binding.type === "acp",
	buildTargetFactory: (params) => buildAcpTargetFactory({
		cfg: params.cfg,
		binding: params.binding,
		channel: params.channel,
		agentId: params.agentId
	}),
	parseSessionKey: ({ sessionKey }) => parseConfiguredAcpSessionKey(sessionKey),
	matchesSessionKey: ({ sessionKey, materializedTarget }) => materializedTarget.record.targetSessionKey === sessionKey
};
//#endregion
//#region src/channels/plugins/configured-binding-consumers.ts
const registeredConfiguredBindingConsumers = resolveGlobalMap(Symbol.for("testclaw.configuredBindingConsumers"), "plugin-registry");
/**
* Lists registered configured binding consumers in registration order.
*/
function listConfiguredBindingConsumers() {
	return [...registeredConfiguredBindingConsumers.values()];
}
/**
* Finds the first configured binding consumer that supports a raw binding rule.
*/
function resolveConfiguredBindingConsumer(binding) {
	for (const consumer of listConfiguredBindingConsumers()) if (consumer.supports(binding)) return consumer;
	return null;
}
/**
* Registers a configured binding consumer idempotently by trimmed id.
*/
function registerConfiguredBindingConsumer(consumer) {
	const id = consumer.id.trim();
	if (!id) throw new Error("Configured binding consumer id is required");
	if (registeredConfiguredBindingConsumers.get(id)) return;
	registeredConfiguredBindingConsumers.set(id, {
		...consumer,
		id
	});
}
//#endregion
//#region src/channels/plugins/configured-binding-builtins.ts
/**
* Configured binding built-in registration.
*
* Registers core configured binding consumers exactly when the registry needs them.
*/
/**
* Registers configured binding consumers bundled with core.
*/
function ensureConfiguredBindingBuiltinsRegistered() {
	registerConfiguredBindingConsumer(acpConfiguredBindingConsumer);
}
//#endregion
//#region src/channels/plugins/binding-provider.ts
/**
* Returns the configured binding provider exposed by a channel plugin, when present.
*/
function resolveChannelConfiguredBindingProvider(plugin) {
	return plugin?.bindings;
}
//#endregion
//#region src/channels/plugins/configured-binding-compiler.ts
/**
* Configured binding compiler.
*
* Compiles config rules into channel/provider-specific binding registry entries.
*/
function resolveConfiguredBindingAdapter(channel) {
	const normalized = normalizeOptionalLowercaseString(channel);
	if (!normalized) return null;
	const plugin = getLoadedChannelPluginEntryById(normalized, getPluginRegistryForContext() ?? void 0)?.plugin;
	const provider = resolveChannelConfiguredBindingProvider(plugin);
	if (!plugin || !provider || !provider.compileConfiguredBinding || !provider.matchInboundConversation) return null;
	return {
		channel: plugin.id,
		provider
	};
}
function resolveCompiledBindingRegistry(cfg) {
	const rulesByChannel = /* @__PURE__ */ new Map();
	for (const binding of listConfiguredBindings(cfg)) {
		const consumer = resolveConfiguredBindingConsumer(binding);
		if (!consumer) continue;
		const bindingConversationId = normalizeOptionalString(binding.match?.peer?.id);
		if (!bindingConversationId) continue;
		const resolvedChannel = resolveConfiguredBindingAdapter(binding.match.channel);
		if (!resolvedChannel) continue;
		const target = resolvedChannel.provider.compileConfiguredBinding({
			binding,
			conversationId: bindingConversationId
		});
		if (!target) continue;
		const agentId = pickFirstExistingAgentId(cfg, binding.agentId ?? "main");
		const targetFactory = consumer.buildTargetFactory({
			cfg,
			binding,
			channel: resolvedChannel.channel,
			agentId,
			target,
			bindingConversationId
		});
		if (!targetFactory) continue;
		const rule = {
			channel: resolvedChannel.channel,
			accountPattern: normalizeOptionalString(binding.match.accountId),
			binding,
			bindingConversationId,
			target,
			agentId,
			provider: resolvedChannel.provider,
			targetFactory
		};
		const existing = rulesByChannel.get(rule.channel);
		if (existing) existing.push(rule);
		else rulesByChannel.set(rule.channel, [rule]);
	}
	return { rulesByChannel };
}
//#endregion
//#region src/channels/plugins/configured-binding-match.ts
/**
* Configured binding matching helpers.
*
* Matches compiled binding rules against inbound conversations and materializes targets.
*/
/**
* Ranks account pattern matches for configured binding rules.
*/
function resolveAccountMatchPriority(match, actual) {
	const trimmed = (match ?? "").trim();
	if (!trimmed) return actual === "default" ? 2 : 0;
	if (trimmed === "*") return 1;
	return normalizeAccountId(trimmed) === actual ? 2 : 0;
}
/**
* Normalizes a raw channel id into a configured-binding channel id.
*/
function resolveCompiledBindingChannel(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	return normalized ? normalized : null;
}
/**
* Converts an outbound conversation ref into configured-binding match input.
*/
function toConfiguredBindingConversationRef(conversation) {
	const channel = resolveCompiledBindingChannel(conversation.channel);
	const conversationId = conversation.conversationId.trim();
	if (!channel || !conversationId) return null;
	return {
		channel,
		accountId: normalizeAccountId(conversation.accountId),
		conversationId,
		parentConversationId: normalizeOptionalString(conversation.parentConversationId)
	};
}
/**
* Materializes a configured binding record from the winning rule and conversation.
*/
function materializeConfiguredBindingRecord(params) {
	return params.rule.targetFactory.materialize({
		accountId: normalizeAccountId(params.accountId),
		conversation: params.conversation
	});
}
/**
* Resolves the best configured binding rule for a conversation.
*/
function resolveMatchingConfiguredBinding(params) {
	if (!params.conversation) return null;
	let bestMatch = null;
	let bestAccountPriority = 0;
	let bestMatchPriority = 0;
	for (const rule of params.rules) {
		const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, params.conversation.accountId);
		if (accountMatchPriority === 0) continue;
		const match = rule.provider.matchInboundConversation({
			binding: rule.binding,
			compiledBinding: rule.target,
			conversationId: params.conversation.conversationId,
			parentConversationId: params.conversation.parentConversationId
		});
		if (!match) continue;
		const matchPriority = match.matchPriority ?? 0;
		if (!bestMatch || accountMatchPriority > bestAccountPriority || accountMatchPriority === bestAccountPriority && matchPriority > bestMatchPriority) {
			bestMatch = {
				rule,
				match
			};
			bestAccountPriority = accountMatchPriority;
			bestMatchPriority = matchPriority;
		}
	}
	return bestMatch;
}
//#endregion
//#region src/channels/plugins/configured-binding-session-lookup.ts
/**
* Resolves a configured binding record from a stateful target session key.
*/
function resolveConfiguredBindingRecordBySessionKeyFromRegistry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	for (const consumer of listConfiguredBindingConsumers()) {
		const parsed = consumer.parseSessionKey?.({ sessionKey });
		if (!parsed) continue;
		const channel = resolveCompiledBindingChannel(parsed.channel);
		if (!channel) continue;
		const rules = params.registry.rulesByChannel.get(channel);
		if (!rules || rules.length === 0) continue;
		let wildcardMatch = null;
		for (const rule of rules) {
			if (rule.targetFactory.driverId !== consumer.id) continue;
			const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, parsed.accountId);
			if (accountMatchPriority === 0) continue;
			const materializedTarget = materializeConfiguredBindingRecord({
				rule,
				accountId: parsed.accountId,
				conversation: rule.target
			});
			if (consumer.matchesSessionKey?.({
				sessionKey,
				compiledBinding: rule,
				accountId: parsed.accountId,
				materializedTarget
			}) ?? materializedTarget.record.targetSessionKey === sessionKey) {
				if (accountMatchPriority === 2) return materializedTarget;
				wildcardMatch = materializedTarget;
			}
		}
		if (wildcardMatch) return wildcardMatch;
	}
	return null;
}
//#endregion
//#region src/channels/plugins/configured-binding-registry.ts
function resolveMaterializedConfiguredBinding(params) {
	const conversation = toConfiguredBindingConversationRef(params.conversation);
	if (!conversation) return null;
	const rules = resolveCompiledBindingRegistry(params.cfg).rulesByChannel.get(conversation.channel);
	if (!rules || rules.length === 0) return null;
	const resolved = resolveMatchingConfiguredBinding({
		rules,
		conversation
	});
	if (!resolved) return null;
	return {
		conversation,
		resolved,
		materializedTarget: materializeConfiguredBindingRecord({
			rule: resolved.rule,
			accountId: conversation.accountId,
			conversation: resolved.match
		})
	};
}
/** Compile plugin binding rules before publishing a config or plugin generation. */
function validateConfiguredBindings(cfg) {
	ensureConfiguredBindingBuiltinsRegistered();
	resolveCompiledBindingRegistry(cfg);
}
/**
* Resolves a configured binding record from explicit channel/account/conversation ids.
*/
function resolveConfiguredBindingRecord(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	return resolveMaterializedConfiguredBinding({
		cfg: params.cfg,
		conversation: {
			channel: params.channel,
			accountId: params.accountId,
			conversationId: params.conversationId,
			parentConversationId: params.parentConversationId
		}
	})?.materializedTarget ?? null;
}
/**
* Resolves the full configured binding match, including compiled rule and match diagnostics.
*/
function resolveConfiguredBinding(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	const resolved = resolveMaterializedConfiguredBinding(params);
	if (!resolved) return null;
	return {
		conversation: resolved.conversation,
		compiledBinding: resolved.resolved.rule,
		match: resolved.resolved.match,
		...resolved.materializedTarget
	};
}
/**
* Resolves a configured binding record by the stateful target session key.
*/
function resolveConfiguredBindingRecordBySessionKey(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	return resolveConfiguredBindingRecordBySessionKeyFromRegistry({
		registry: resolveCompiledBindingRegistry(params.cfg),
		sessionKey: params.sessionKey
	});
}
//#endregion
export { buildConfiguredAcpSessionKey as a, validateConfiguredBindings as i, resolveConfiguredBindingRecord as n, normalizeBindingConfig as o, resolveConfiguredBindingRecordBySessionKey as r, resolveConfiguredAcpBindingSpecFromRecord as s, resolveConfiguredBinding as t };
