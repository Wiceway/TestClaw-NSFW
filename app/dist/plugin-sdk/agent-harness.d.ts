import { Dc as SandboxToolPolicy, Fa as AgentHarness, J as createCodexAppServerToolResultExtensionRunner, Lc as TrustedSubagentCompletionHandoff, Zn as createTestclawCodingTools, _r as resolveActiveEmbeddedRunSessionId, bc as AgentToolResultMiddlewareEvent, dt as disposeRegisteredAgentHarnesses, fr as abortAndDrainEmbeddedAgentRun, i as EmbeddedRunAttemptParamsV2, pr as abortEmbeddedAgentRun, q as createAgentToolResultMiddlewareRunner, r as EmbeddedRunAttemptParams, so as AgentHarnessV2, th as ScheduledToolPolicyContext, vc as AgentToolResultMiddleware, wc as TestclawAgentToolResult } from "../agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { xt as InputProvenance } from "../templating-Cj1bgdNt.js";
import { n as AnyAgentTool } from "../common-EnjBtVXq.js";
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  webSearchEnabled?: boolean;
  config?: TestclawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  runtimeToolAllowlist?: string[];
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
export declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type TestclawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createTestclawCodingTools, disposeRegisteredAgentHarnesses, resolveActiveEmbeddedRunSessionId };