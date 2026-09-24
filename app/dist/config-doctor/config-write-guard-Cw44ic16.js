import { b as resolveIsConfigReadOnly, x as resolveIsNixMode } from "./paths-DeOFr7iP.js";
//#region src/config/config-write-guard.ts
/** Agent-first Nix install docs shown when runtime config writes are blocked. */
const NIX_TESTCLAW_AGENT_FIRST_URL = "https://github.com/testclaw/nix-testclaw#quick-start";
/** Public Assistant Nix overview shown with immutable-config errors. */
const NIX_OVERVIEW_URL = "https://docs.testclaw.ai/install/nix";
/** Error thrown when external management disables config mutation. */
var ConfigReadOnlyError = class extends Error {
	constructor(params = {}) {
		super([
			"Config is externally managed (`TESTCLAW_CONFIG_READONLY=1`), so Assistant treats testclaw.json as immutable.",
			...params.configPath ? [`Config path: ${params.configPath}`] : [],
			"Edit the config in your external deployment source, then redeploy or restart Assistant as needed."
		].join("\n"));
		this.code = "TESTCLAW_CONFIG_READONLY";
		this.name = "ConfigReadOnlyError";
	}
};
/** Error thrown when a mutating config path is attempted while Nix owns config state. */
var NixModeConfigMutationError = class extends Error {
	constructor(params = {}) {
		super(formatNixModeConfigMutationMessage(params));
		this.code = "TESTCLAW_NIX_MODE_CONFIG_IMMUTABLE";
		this.name = "NixModeConfigMutationError";
	}
};
/** Build the operator-facing immutable-config message for Nix-managed installs. */
function formatNixModeConfigMutationMessage(params = {}) {
	return [
		"Config is managed by Nix (`TESTCLAW_NIX_MODE=1`), so Assistant treats testclaw.json as immutable.",
		"This usually means nix-testclaw, the first-party Nix distribution, or another Nix-managed package set this mode.",
		...params.configPath ? [`Config path: ${params.configPath}`] : [],
		"Do not run setup, onboarding, testclaw update, plugin install/update/uninstall/enable, doctor repair/token-generation, or config set against this file.",
		"Edit the Nix source for this install instead. For nix-testclaw, edit `programs.testclaw.config` or `instances.<name>.config`, then rebuild with Home Manager or NixOS.",
		`Agent-first Nix setup: ${NIX_TESTCLAW_AGENT_FIRST_URL}`,
		`Assistant Nix overview: ${NIX_OVERVIEW_URL}`
	].join("\n");
}
/** Throw before side effects when the environment marks config as immutable. */
function assertConfigWriteAllowedInCurrentMode(params = {}) {
	if (!resolveIsConfigReadOnly(params.env)) return;
	throw createConfigMutationError(params);
}
/** Select deployment-specific guidance without enabling deployment-specific behavior. */
function createConfigMutationError(params = {}) {
	return resolveIsNixMode(params.env) ? new NixModeConfigMutationError(params) : new ConfigReadOnlyError(params);
}
//#endregion
export { createConfigMutationError as i, NixModeConfigMutationError as n, assertConfigWriteAllowedInCurrentMode as r, ConfigReadOnlyError as t };
