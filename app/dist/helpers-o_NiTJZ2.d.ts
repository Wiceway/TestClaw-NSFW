import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import { D as ChannelSecurityDmPolicy } from "./types.core-DUehY8AL.js";
import "./types.plugin-YVpMGCxm.js";
//#region src/channels/plugins/helpers.d.ts
declare function formatPairingApproveHint(channelId: string): string;
declare function parseOptionalDelimitedEntries(value?: string): string[] | undefined;
declare function buildAccountScopedDmSecurityPolicy(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountId?: string | null;
  fallbackAccountId?: string | null;
  policy?: string | null;
  allowFrom?: Array<string | number> | null;
  defaultPolicy?: string;
  allowFromPathSuffix?: string;
  policyPathSuffix?: string;
  approveChannelId?: string;
  approveHint?: string;
  normalizeEntry?: (raw: string) => string;
  classifyEntryAuthentication?: ChannelSecurityDmPolicy["classifyEntryAuthentication"];
  inheritSharedDefaultsFromDefaultAccount?: boolean;
}): ChannelSecurityDmPolicy;
//#endregion
export { formatPairingApproveHint as n, parseOptionalDelimitedEntries as r, buildAccountScopedDmSecurityPolicy as t };