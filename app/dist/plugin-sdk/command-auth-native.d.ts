import { Gf as resolveCommandAuthorization, Ic as resolveFastModeState, Ju as formatFastModeCurrentStatus, Ru as resolveStoredModelOverride, Wf as CommandAuthorization, Xu as formatFastModeStatusValue, Yu as formatFastModeSourceSuffix, na as resolveCommandAuthorizedFromAuthorizers, qu as formatFastModeCommandOptions, ra as resolveControlCommandGate, yo as AgentRuntimePolicyScope } from "../agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { K as SessionEntry } from "../templating-Cj1bgdNt.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import "../model-selection-DBtA26GQ.js";
import { a as CommandArgsParsing, l as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-DCRSSKne.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-DVWXK9Yb.js";
import { S as listChatCommands, a as findCommandByNativeName, c as listNativeCommandSpecs, d as parseCommandArgs, f as resolveCommandArgChoices, i as canResolveCommandArgMenu, l as listNativeCommandSpecsForConfig, m as serializeCommandArgs, o as formatCommandArgMenuTitle, p as resolveCommandArgMenu, r as buildCommandTextFromArgs, v as maybeResolveTextAlias, y as normalizeCommandBody } from "../commands-registry-DDld6IVP.js";
import { n as resolveNativeCommandSessionTargets } from "../native-command-session-targets-DMWaiXSn.js";
import { n as ModelsProviderData } from "../commands-models-catalog-LzKu6q37.js";
import { t as listSkillCommandsForAgents } from "../chat-commands-C1q_ZAVb.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-9XADqC4z.js";
//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
export declare function resolveEffectiveAgentRuntime(params: {
  cfg: TestclawConfig;
  provider: string;
  modelId: string;
  modelApi?: string | null;
  modelBaseUrl?: unknown;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
} & AgentRuntimePolicyScope): string;
//#endregion
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, canResolveCommandArgMenu, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveFastModeState, resolveNativeCommandSessionTargets, resolveStoredModelOverride, serializeCommandArgs, shouldComputeCommandAuthorized };