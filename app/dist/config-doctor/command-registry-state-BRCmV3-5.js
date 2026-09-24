import { y as requireActivePluginRegistry } from "./runtime-B980B6n3.js";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-Dxjy7ctc.js";
//#region src/plugins/agent-prompt-surface-kind.ts
/** Normalizes legacy prompt surface names to current Assistant surface names. */
function normalizeAgentPromptSurfaceKind(surface) {
	return surface === "pi_main" ? "testclaw_main" : surface;
}
//#endregion
//#region src/plugins/command-registry-state.ts
function isTrustedReservedCommandOwner(command) {
	return command.ownership === "reserved";
}
function canExposeSenderIsOwner(command) {
	return Array.isArray(command.requiredScopes) && command.requiredScopes.length > 0 || command.trustedOwnerStatusExposure === true;
}
function listRegisteredPluginAgentPromptGuidance(params) {
	const lines = [];
	const seen = /* @__PURE__ */ new Set();
	const commands = listRegisteredPluginCommands(requireActivePluginRegistry()).toSorted((left, right) => {
		if (left.pluginId !== right.pluginId) return left.pluginId < right.pluginId ? -1 : 1;
		return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
	});
	for (const command of commands) for (const entry of command.agentPromptGuidance ?? []) {
		const trimmed = resolveAgentPromptGuidanceTextForSurface(entry, {
			surface: params?.surface ? normalizeAgentPromptSurfaceKind(params.surface) : void 0,
			includeLegacyGlobalGuidance: params?.includeLegacyGlobalGuidance ?? true
		});
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		lines.push(trimmed);
	}
	return lines;
}
function resolveAgentPromptGuidanceTextForSurface(entry, params) {
	if (typeof entry === "string") return params.includeLegacyGlobalGuidance ? entry.trim() : void 0;
	const text = entry.text.trim();
	if (!params.surface) return text;
	if (!entry.surfaces || entry.surfaces.length === 0) return params.includeLegacyGlobalGuidance ? text : void 0;
	return entry.surfaces.includes(params.surface) ? text : void 0;
}
//#endregion
export { normalizeAgentPromptSurfaceKind as i, isTrustedReservedCommandOwner as n, listRegisteredPluginAgentPromptGuidance as r, canExposeSenderIsOwner as t };
