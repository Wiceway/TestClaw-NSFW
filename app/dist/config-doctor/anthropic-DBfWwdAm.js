//#region packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase() ?? "";
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
const CLAUDE_FABLE_5_THINKING_PROFILE = {
	levels: [
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "max" }
	],
	defaultLevel: "medium",
	preserveWhenCatalogReasoningFalse: true
};
const CLAUDE_SONNET_5_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high"
};
const CLAUDE_OPUS_5_THINKING_PROFILE = CLAUDE_SONNET_5_THINKING_PROFILE;
const CLAUDE_OPUS_55_THINKING_PROFILE = CLAUDE_FABLE_5_THINKING_PROFILE;
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
function resolveClaudeModelIdentity(ref) {
	const normalized = normalizeClaudeModelId((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id);
	return /(?:^|[-/])(claude-[^/]+)$/.exec(normalized)?.[1] ?? normalized;
}
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeFable5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeMythos5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/**
* Prefix-bound thinking requires append-only runtime context. Extend this list
* only with live replay proof for the model (Mythos 5.1 remains unproven).
*/
function bindsClaudeThinkingPrefix(ref) {
	return resolveClaudeOpus55ModelIdentity(ref) !== void 0 || /^claude-fable-5-1(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity(ref));
}
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
function requiresClaudeMandatoryAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus55ModelIdentity(ref) !== void 0 || resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeSonnet5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
function resolveClaudeOpus5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const opus55Identity = resolveClaudeOpus55ModelIdentity(ref);
	if (opus55Identity) return opus55Identity;
	if (normalized === "opus" || normalized === "opus-5") return "claude-opus-5";
	const match = /(?:^|-)claude-opus-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
function resolveClaudeOpus55ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "opus" || normalized === "opus-5-5") return "claude-opus-5-5";
	return /^claude-opus-5-5(?=$|[^a-z0-9])/.test(normalized) ? normalized : void 0;
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model has a native 1M-token context window. */
function supportsClaude1MContext(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8)|sonnet-5)(?=$|[^a-z0-9])/.test(modelId);
}
//#endregion
export { bindsClaudeThinkingPrefix as a, resolveClaudeModelIdentity as c, resolveClaudeOpus5ModelIdentity as d, resolveClaudeSonnet5ModelIdentity as f, supportsClaudeNativeXhighEffort as h, CLAUDE_SONNET_5_THINKING_PROFILE as i, resolveClaudeMythos5ModelIdentity as l, supportsClaudeAdaptiveThinking as m, CLAUDE_OPUS_55_THINKING_PROFILE as n, requiresClaudeMandatoryAdaptiveThinking as o, supportsClaude1MContext as p, CLAUDE_OPUS_5_THINKING_PROFILE as r, resolveClaudeFable5ModelIdentity as s, CLAUDE_FABLE_5_THINKING_PROFILE as t, resolveClaudeOpus55ModelIdentity as u };
