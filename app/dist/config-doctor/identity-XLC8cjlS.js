import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { o as resolveAgentEntry } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { n as resolveChannelAccountEntry } from "./account-lookup-CD9t104R.js";
//#region src/agents/identity.ts
/** Resolve the configured identity block for one agent. */
function resolveAgentIdentity(cfg, agentId) {
	return resolveAgentEntry(cfg, normalizeAgentId(agentId))?.identity;
}
/** Build the automatic `[name]` prefix for an agent identity. */
function resolveIdentityNamePrefix(cfg, agentId) {
	const name = resolveAgentIdentity(cfg, agentId)?.name?.trim();
	if (!name) return;
	return `[${name}]`;
}
/** Resolve the outbound message prefix, preserving explicit empty prefixes. */
function resolveMessagePrefix(cfg, agentId, opts) {
	const configured = opts?.configured;
	if (configured !== void 0) return configured;
	if (opts?.hasAllowFrom === true) return "";
	return resolveIdentityNamePrefix(cfg, agentId) ?? opts?.fallback ?? "[testclaw]";
}
/** Helper to extract a channel config value by dynamic key. */
function getChannelConfig(cfg, channel) {
	const value = cfg.channels?.[channel];
	return typeof value === "object" && value !== null ? value : void 0;
}
/** Resolve the optional response prefix, expanding `auto` to the identity name prefix. */
function resolveResponsePrefix(cfg, agentId, opts) {
	if (opts?.channel && opts?.accountId) {
		const accounts = getChannelConfig(cfg, opts.channel)?.accounts;
		const accountPrefix = resolveChannelAccountEntry(accounts, opts.accountId, opts.channel, (id) => id)?.responsePrefix;
		if (accountPrefix !== void 0) {
			if (accountPrefix === "auto") return resolveIdentityNamePrefix(cfg, agentId);
			return accountPrefix;
		}
	}
	if (opts?.channel) {
		const channelPrefix = getChannelConfig(cfg, opts.channel)?.responsePrefix;
		if (channelPrefix !== void 0) {
			if (channelPrefix === "auto") return resolveIdentityNamePrefix(cfg, agentId);
			return channelPrefix;
		}
	}
	const configured = cfg.messages?.responsePrefix;
	if (configured !== void 0) {
		if (configured === "auto") return resolveIdentityNamePrefix(cfg, agentId);
		return configured;
	}
}
/** Resolve message and response prefix values together for channel delivery. */
function resolveEffectiveMessagesConfig(cfg, agentId, opts) {
	return {
		messagePrefix: resolveMessagePrefix(cfg, agentId, {
			hasAllowFrom: opts?.hasAllowFrom,
			fallback: opts?.fallbackMessagePrefix
		}),
		responsePrefix: resolveResponsePrefix(cfg, agentId, {
			channel: opts?.channel,
			accountId: opts?.accountId
		})
	};
}
/** Resolve per-agent human-delay settings over global agent defaults. */
function resolveHumanDelayConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.humanDelay;
	const overrides = resolveAgentEntry(cfg, normalizeAgentId(agentId))?.humanDelay;
	if (!defaults && !overrides) return;
	return {
		mode: overrides?.mode ?? defaults?.mode,
		minMs: overrides?.minMs ?? defaults?.minMs,
		maxMs: overrides?.maxMs ?? defaults?.maxMs
	};
}
//#endregion
export { resolveResponsePrefix as i, resolveEffectiveMessagesConfig as n, resolveHumanDelayConfig as r, resolveAgentIdentity as t };
