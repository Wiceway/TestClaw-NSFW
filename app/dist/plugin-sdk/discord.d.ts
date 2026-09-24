import { As as TestclawPluginApi, Du as emptyPluginConfigSchema, ui as PluginRuntime } from "../agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { O as ChannelStatusIssue, d as ChannelGroupContext, h as ChannelMessageActionAdapter, r as ChannelAccountSnapshot } from "../types.core-DUehY8AL.js";
import { S as MessageReceipt } from "../types-CDAau_ST.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { t as ChannelPlugin } from "../types.plugin-YVpMGCxm.js";
import { t as ChannelMessageActionName } from "../types.public-CFZVjq90.js";
import "../channel-contract-CLuI6RD3.js";
import { i as buildChannelConfigSchema } from "../config-schema-edRW2Mnr.js";
import { o as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../setup-helpers-CO8RKx0A.js";
import "../channel-core-ISUjGLd-.js";
import "../channel-outbound-DccACklF.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-BYQIQoZ4.js";
import { t as getChatChannelMeta } from "../channel-plugin-common-C4H6qdp5.js";
import { n as resolveConfiguredFromCredentialStatuses, t as projectCredentialSnapshotFields } from "../channel-status-I9FJ-UgB.js";
import { i as buildComputedAccountStatusSnapshot, s as buildTokenChannelStatusSummary } from "../status-helpers-CjQXU6d9.js";
import "../config-contracts-B8mO8f8m.js";
//#region src/plugin-sdk/discord.d.ts
/** Discord channel config shape for one account in Testclaw config. */
export type DiscordAccountConfig = NonNullable<NonNullable<TestclawConfig["channels"]>["discord"]>;
/** Component-message request accepted by the deprecated Discord SDK facade. */
export type DiscordComponentMessageSpec = {
  text?: string;
  reusable?: boolean;
  container?: {
    accentColor?: string | number;
    spoiler?: boolean;
  };
  blocks?: unknown[];
  modal?: unknown;
};
/** Built Discord component payload plus registration metadata. */
export type DiscordComponentBuildResult = {
  components: unknown[];
  entries: unknown[];
  modals: unknown[];
};
/** Send/edit options for Discord component messages. */
export type DiscordComponentSendOpts = {
  cfg: TestclawConfig;
  accountId?: string;
  replyTo?: string;
  files?: unknown;
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: unknown;
  chunkMode?: unknown;
  [key: string]: unknown;
};
/** Normalized Discord message result returned by component send/edit helpers. */
export type DiscordComponentSendResult = {
  messageId: string;
  channelId: string;
  receipt: MessageReceipt;
};
/** Resolved Discord account with token source metadata for status and runtime checks. */
export type ResolvedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  config: DiscordAccountConfig;
};
/** Normalized outbound target result for Discord channel ids and DM targets. */
export type DiscordOutboundTargetResolution = {
  ok: true;
  to: string;
} | {
  ok: false;
  error: Error;
};
/** Supported thread binding owners for Discord session routing. */
export type ThreadBindingTargetKind = "subagent" | "acp";
/** Persisted Discord thread-to-session binding record. */
export type ThreadBindingRecord = {
  accountId: string;
  threadId: string;
  channelId?: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  [key: string]: unknown;
};
type DirectoryConfigParams = {
  cfg: TestclawConfig;
  accountId?: string | null;
};
type BuildDiscordComponentMessage = (params: {
  spec: DiscordComponentMessageSpec;
  fallbackText?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
}) => DiscordComponentBuildResult;
type EditDiscordComponentMessage = (to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts) => Promise<DiscordComponentSendResult>;
type RegisterBuiltDiscordComponentMessage = (params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
}) => Promise<void>;
type DiscordApiFacadeModule = {
  collectDiscordStatusIssues: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
  buildDiscordComponentMessage: BuildDiscordComponentMessage;
  discordOnboardingAdapter?: NonNullable<ChannelPlugin<ResolvedDiscordAccount>["setup"]>;
  inspectDiscordAccount: (params: {
    cfg: TestclawConfig;
    accountId?: string | null;
  }) => unknown;
  listDiscordAccountIds: (cfg: TestclawConfig) => string[];
  listDiscordDirectoryGroupsFromConfig: (params: DirectoryConfigParams) => unknown[] | Promise<unknown[]>;
  listDiscordDirectoryPeersFromConfig: (params: DirectoryConfigParams) => unknown[] | Promise<unknown[]>;
  looksLikeDiscordTargetId: (raw: string) => boolean;
  normalizeDiscordMessagingTarget: (raw: string) => string | undefined;
  normalizeDiscordOutboundTarget: (to?: string) => DiscordOutboundTargetResolution;
  resolveDefaultDiscordAccountId: (cfg: TestclawConfig) => string;
  resolveDiscordAccount: (params: {
    cfg: TestclawConfig;
    accountId?: string | null;
  }) => ResolvedDiscordAccount;
  resolveDiscordGroupRequireMention: (params: ChannelGroupContext) => boolean | undefined;
  resolveDiscordGroupToolPolicy: (params: ChannelGroupContext) => unknown;
};
type DiscordRuntimeFacadeModule = {
  editDiscordComponentMessage: EditDiscordComponentMessage;
  registerBuiltDiscordComponentMessage: RegisterBuiltDiscordComponentMessage;
  autoBindSpawnedDiscordSubagent: (params: {
    cfg: TestclawConfig;
    accountId?: string;
    channel?: string;
    to?: string;
    threadId?: string | number;
    childSessionKey: string;
    agentId: string;
    label?: string;
    boundBy?: string;
  }) => Promise<ThreadBindingRecord | null>;
  collectDiscordAuditChannelIds: (params: {
    cfg: TestclawConfig;
    accountId?: string | null;
  }) => unknown;
  listThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
  }) => ThreadBindingRecord[];
  unbindThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
};
/** Lazy Discord setup adapter retained for deprecated subpath compatibility. */
export declare const discordOnboardingAdapter: {};
/** Collect Discord account status issues from account snapshots. */
export declare function collectDiscordStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[];
/** Build Discord component payloads without sending them. */
export declare const buildDiscordComponentMessage: DiscordApiFacadeModule["buildDiscordComponentMessage"];
/** Inspect one configured Discord account for setup/status output. */
export declare function inspectDiscordAccount(params: {
  cfg: TestclawConfig;
  accountId?: string | null;
}): unknown;
/** List configured Discord account ids from Testclaw config. */
export declare function listDiscordAccountIds(cfg: TestclawConfig): string[];
/** List Discord directory group records from static config. */
export declare function listDiscordDirectoryGroupsFromConfig(params: DirectoryConfigParams): unknown[] | Promise<unknown[]>;
/** List Discord directory peer records from static config. */
export declare function listDiscordDirectoryPeersFromConfig(params: DirectoryConfigParams): unknown[] | Promise<unknown[]>;
/** Check whether a raw value has Discord target-id shape. */
export declare function looksLikeDiscordTargetId(raw: string): boolean;
/** Normalize a Discord messaging target for send helpers. */
export declare function normalizeDiscordMessagingTarget(raw: string): string | undefined;
/** Normalize a Discord outbound target and return a typed error on failure. */
export declare function normalizeDiscordOutboundTarget(to?: string): DiscordOutboundTargetResolution;
/** Resolve the default Discord account id from config. */
export declare function resolveDefaultDiscordAccountId(cfg: TestclawConfig): string;
/** Resolve a Discord account config plus token source for runtime use. */
export declare function resolveDiscordAccount(params: {
  cfg: TestclawConfig;
  accountId?: string | null;
}): ResolvedDiscordAccount;
/** Resolve group mention policy for a Discord channel context. */
export declare function resolveDiscordGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
/** Resolve group tool policy for a Discord channel context. */
export declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): unknown;
/** Collect configured Discord audit channel ids for runtime status checks. */
export declare function collectDiscordAuditChannelIds(params: {
  cfg: TestclawConfig;
  accountId?: string | null;
}): unknown;
/** Edit an already-sent Discord component message. */
export declare const editDiscordComponentMessage: DiscordRuntimeFacadeModule["editDiscordComponentMessage"];
/** Await callback registration after Discord assigns the built component message its id. */
export declare const registerBuiltDiscordComponentMessage: DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"];
/** Bind a spawned subagent session to the current Discord thread when possible. */
export declare function autoBindSpawnedDiscordSubagent(params: {
  cfg?: TestclawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
/** List Discord thread bindings for a target session key. */
export declare function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
/** Remove Discord thread bindings for a target session key. */
export declare function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[];
//#endregion
export { type ChannelMessageActionAdapter, type ChannelMessageActionName, type ChannelPlugin, DEFAULT_ACCOUNT_ID, PAIRING_APPROVED_MESSAGE, type PluginRuntime, type TestclawConfig, type TestclawPluginApi, applyAccountNameToChannelSection, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, buildTokenChannelStatusSummary, emptyPluginConfigSchema, getChatChannelMeta, migrateBaseNameToDefaultAccount, normalizeAccountId, projectCredentialSnapshotFields, resolveConfiguredFromCredentialStatuses };