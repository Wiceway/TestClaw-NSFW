import { Mc as ExecSessionDefaults, jc as ExecPolicyOverrides } from "./agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import { K as SessionEntry } from "./templating-Cj1bgdNt.js";
import { b as PluginMetadataSnapshot } from "./io-D98w0DmD.js";
import { n as SkillCommandSpec } from "./types-BcLcdjLK.js";
//#region src/skills/discovery/chat-command-invocation.d.ts
/** Lists slash command names reserved by built-in chat commands and callers. */
declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
declare function resolveSkillCommandInvocation(params: {
  commandBodyNormalized: string;
  skillCommands: SkillCommandSpec[];
}): {
  command: SkillCommandSpec;
  args?: string;
  inline?: boolean;
} | null;
//#endregion
//#region src/skills/discovery/chat-commands.d.ts
type WorkspaceSkillCommandParams = {
  workspaceDir: string;
  cfg: TestclawConfig;
  agentId?: string;
  skillFilter?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
  includeAllowlistHidden?: boolean;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
/** Synchronous public SDK contract; remote workspace menus are deferred. */
declare function listSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams): SkillCommandSpec[];
type AgentSkillCommandParams = {
  cfg: TestclawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
};
/** Synchronous public SDK contract for native command consumers. */
declare function listSkillCommandsForAgents(params: AgentSkillCommandParams): SkillCommandSpec[];
//#endregion
export { resolveSkillCommandInvocation as i, listSkillCommandsForWorkspace as n, listReservedChatSlashCommandNames as r, listSkillCommandsForAgents as t };