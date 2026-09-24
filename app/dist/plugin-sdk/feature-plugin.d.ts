import { As as TestclawPluginApi, Ms as TestclawPluginToolContext, Na as TestclawPluginDefinition, Pa as TestclawPluginConfigSchema, ad as PluginSessionActionContext, ic as PluginCommandResult, rc as PluginCommandContext } from "../agent-harness-runtime-DNhAy8yX.js";
import { d as AgentToolUpdateCallback } from "../types-DvaDucJM.js";
import { FeatureContract, FeatureEvent, FeatureEventName, FeatureInput, FeatureOperationName, FeatureOutput } from "./feature-contract.js";
//#region src/plugin-sdk/feature-plugin.d.ts
export type FeatureInvocationContext = {
  api: TestclawPluginApi;
} & ({
  source: "session-action";
  action: PluginSessionActionContext;
} | {
  source: "tool";
  tool: TestclawPluginToolContext;
  toolCallId: string;
  signal?: AbortSignal;
  onUpdate?: AgentToolUpdateCallback;
} | {
  source: "command";
  command: PluginCommandContext;
});
export type FeatureHandlers<C extends FeatureContract> = { [K in FeatureOperationName<C>]: (input: FeatureInput<C, K>, context: FeatureInvocationContext) => FeatureOutput<C, K> | Promise<FeatureOutput<C, K>>; };
export type FeatureEventEmitter<C extends FeatureContract> = {
  emit: <K extends FeatureEventName<C>>(event: K, payload: FeatureEvent<C, K>) => void;
};
export type FeatureCommandAdapter<C extends FeatureContract, K extends FeatureOperationName<C>> = {
  name: string;
  description?: string;
  parse: (context: PluginCommandContext) => FeatureInput<C, K>;
  format?: (output: FeatureOutput<C, K>, context: PluginCommandContext) => PluginCommandResult;
};
export type DefineFeaturePluginOptions<C extends FeatureContract> = {
  contract: C;
  name: string;
  description: string;
  /** Registration is synchronous; long-lived work belongs to api.registerService. */
  setup: (api: TestclawPluginApi, events: FeatureEventEmitter<C>) => FeatureHandlers<C>;
  commands?: Partial<{ [K in FeatureOperationName<C>]: FeatureCommandAdapter<C, K>; }>;
};
/** One implementation serves each declared surface without relaying through privileged RPC. */
export declare function defineFeaturePlugin<C extends FeatureContract>(definition: DefineFeaturePluginOptions<C>): Omit<{
  id: string;
  name: string;
  description: string;
  kind?: TestclawPluginDefinition["kind"];
  configSchema?: TestclawPluginConfigSchema | (() => TestclawPluginConfigSchema);
  reload?: TestclawPluginDefinition["reload"];
  nodeHostCommands?: TestclawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: TestclawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<TestclawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: TestclawPluginConfigSchema;
};
//#endregion