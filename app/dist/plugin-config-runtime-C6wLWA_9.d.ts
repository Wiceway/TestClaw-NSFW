import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import "./types-RdRiGrAp.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { t as PluginActivationConfigSourceLike } from "./config-activation-shared-BKSRzU_n.js";
import { t as NormalizedPluginsConfig$1 } from "./config-normalization-shared-C1Ntcstu.js";
//#region src/plugins/config-state.d.ts
type PluginActivationConfigSource = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: TestclawConfig;
} & PluginActivationConfigSourceLike<TestclawConfig>;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
declare const normalizePluginsConfig: (config?: TestclawConfig["plugins"]) => NormalizedPluginsConfig;
type EffectiveActivationParams = {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: TestclawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
  channelIds?: readonly string[];
};
declare const resolveEffectiveEnableState: (params: EffectiveActivationParams) => {
  enabled: boolean;
  reason?: string;
};
//#endregion
//#region src/infra/deep-merge.d.ts
type DeepMergeOptions = {
  arrays?: "replace" | "concat";
  undefinedValues?: "skip" | "replace";
};
/** Merge plain objects while preserving Testclaw's null, undefined, and array policies. */
declare function mergeDeep(base: unknown, override: unknown, options?: DeepMergeOptions): unknown;
//#endregion
//#region src/plugin-sdk/plugin-config-runtime.d.ts
/** Requires an already-resolved runtime config at plugin runtime boundaries. */
declare function requireRuntimeConfig(config: TestclawConfig, context: string): TestclawConfig;
/** Reads a plugin's object-shaped `plugins.entries[id].config` block from resolved config. */
declare function resolvePluginConfigObject(config: TestclawConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
/** Resolves live plugin config through a loader, falling back to startup config when unavailable. */
declare function resolveLivePluginConfigObject(runtimeConfigLoader: (() => TestclawConfig | undefined) | undefined, pluginId: string, startupPluginConfig?: Record<string, unknown>): Record<string, unknown> | undefined;
//#endregion
export { normalizePluginsConfig as a, mergeDeep as i, resolveLivePluginConfigObject as n, resolveEffectiveEnableState as o, resolvePluginConfigObject as r, requireRuntimeConfig as t };