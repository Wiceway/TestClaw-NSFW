import { K as AgentModelEntryConfig, r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import { s as ConfigWriteOptions } from "./io-D98w0DmD.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import "./config-Q4A7ydl1.js";
import { S as ProviderModelRef } from "./model-selection-DBtA26GQ.js";
//#region src/config/logging.d.ts
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Emits the standard config-updated message through the active runtime logger. */
declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
//#endregion
//#region src/commands/models/shared.d.ts
/** Runtime config snapshot supplied to model config mutators. */
type UpdateConfigContext = {
  runtimeConfig: TestclawConfig;
  canonicalModelKeys?: ReadonlyMap<string, string | undefined>;
  restoreSourceEntry: (from: string, to: string, entry: AgentModelEntryConfig) => AgentModelEntryConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
declare function updateConfig(mutator: (cfg: TestclawConfig, context: UpdateConfigContext) => TestclawConfig | Promise<TestclawConfig>, selectModelRefs?: (cfg: TestclawConfig, context: UpdateConfigContext) => readonly (ProviderModelRef | undefined)[], beforeCommit?: () => void, writeOptions?: ConfigWriteOptions): Promise<TestclawConfig>;
//#endregion
export { logConfigUpdated as n, updateConfig as t };