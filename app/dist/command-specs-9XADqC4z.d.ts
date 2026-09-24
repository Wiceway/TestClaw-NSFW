import "./agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
//#region src/plugins/command-specs.d.ts
type PluginCommandSpecOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: TestclawConfig;
};
declare function getPluginCommandSpecs(provider?: string, options?: PluginCommandSpecOptions): Array<{
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
}>;
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
declare function listProviderPluginCommandSpecs(provider?: string): Array<{
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
}>;
//#endregion
export { listProviderPluginCommandSpecs as n, getPluginCommandSpecs as t };