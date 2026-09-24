import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { n as SkillCommandSpec } from "../types-BcLcdjLK.js";
//#region src/auto-reply/command-status-builders.d.ts
/** Builds the compact slash-command help text shown by `/help`. */
export declare function buildHelpMessage(cfg?: TestclawConfig): string;
/** Options for rendering `/commands` output for a specific channel surface. */
type CommandsMessageOptions = {
  page?: number;
  surface?: string;
  forcePaginatedList?: boolean;
};
/** Rendered `/commands` text plus pagination metadata for channel-native lists. */
type CommandsMessageResult = {
  text: string;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};
/** Builds `/commands` text, returning only the rendered message body. */
export declare function buildCommandsMessage(cfg?: TestclawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): string;
/** Builds `/commands` text and pagination metadata for surfaces with native list controls. */
export declare function buildCommandsMessagePaginated(cfg?: TestclawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): CommandsMessageResult;
//#endregion
export type { CommandsMessageOptions, CommandsMessageResult };