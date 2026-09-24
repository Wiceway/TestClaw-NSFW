import { r as TestclawConfig, yn as ChannelAccountKeyPolicy } from "./types.testclaw-C-wX50Nb.js";
//#region src/channels/plugins/config-helpers.d.ts
/**
 * Updates an account enabled flag in a channel config section.
 */
declare function setAccountEnabledInConfigSection(params: {
  cfg: TestclawConfig;
  sectionKey: string;
  accountId: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  enabled: boolean;
  allowTopLevel?: boolean;
}): TestclawConfig;
/**
 * Deletes one account from a channel config section, pruning empty channel/accounts objects.
 */
declare function deleteAccountFromConfigSection(params: {
  cfg: TestclawConfig;
  sectionKey: string;
  accountId: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  clearBaseFields?: string[];
}): TestclawConfig;
/**
 * Clears selected fields from one account entry and reports whether configured data was removed.
 */
declare function clearAccountEntryFields<TAccountEntry extends object>(params: {
  accounts?: Record<string, TAccountEntry>;
  channelId?: string;
  accountId: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  fields: string[];
  isValueSet?: (value: unknown) => boolean;
  markClearedOnFieldPresence?: boolean;
}): {
  nextAccounts?: Record<string, TAccountEntry>;
  changed: boolean;
  cleared: boolean;
};
/** Clear plugin-selected account fields and prune only the config branches changed by cleanup. */
declare function clearAccountFieldsFromConfigSection(params: {
  cfg: TestclawConfig;
  sectionKey: string;
  accountId: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  fields: string[];
  markClearedOnFieldPresence?: boolean;
}): {
  nextConfig: TestclawConfig;
  changed: boolean;
  cleared: boolean;
};
//#endregion
export { setAccountEnabledInConfigSection as i, clearAccountFieldsFromConfigSection as n, deleteAccountFromConfigSection as r, clearAccountEntryFields as t };