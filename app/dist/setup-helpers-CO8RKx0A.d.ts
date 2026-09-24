import { r as TestclawConfig, yn as ChannelAccountKeyPolicy } from "./types.testclaw-C-wX50Nb.js";
import { d as ChannelSetupAdapter, f as ChannelSetupInput } from "./manifest-registry-BbQfGHTp.js";
import "./types.core-DUehY8AL.js";
import "./types.adapters-8WMF_p63.js";
//#region src/channels/plugins/setup-promotion-helpers.d.ts
type ChannelSetupPromotionSurface = Pick<ChannelSetupAdapter, "accountKeyPolicy" | "configPromotion" | "singleAccountKeysToMove" | "namedAccountPromotionKeys" | "resolveSingleAccountPromotionTarget">;
//#endregion
//#region src/channels/plugins/setup-helpers.d.ts
declare function applyAccountNameToChannelSection(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
}): TestclawConfig;
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
declare function migrateBaseNameToDefaultAccount(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  alwaysUseAccounts?: boolean;
}): TestclawConfig;
/** Applies setup-time account naming and optional root-name migration in one step. */
declare function prepareScopedSetupConfig(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
  migrateBaseName?: boolean;
}): TestclawConfig;
/** Applies a setup patch using account-scoped config semantics. */
declare function applySetupAccountConfigPatch(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  accountId: string;
  patch: Record<string, unknown>;
}): TestclawConfig;
/** Creates a setup adapter that turns validated setup input into an account config patch. */
declare function createPatchedAccountSetupAdapter<Input extends {
  name?: string;
} = ChannelSetupInput>(params: {
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  validateInput?: ChannelSetupAdapter<Input>["validateInput"];
  buildPatch: (input: Input) => Record<string, unknown>;
}): ChannelSetupAdapter<Input>;
type SetupInputPresenceRequirement = {
  someOf: string[];
  message: string;
};
declare function createSetupInputPresenceValidator<Input extends {
  name?: string;
  useEnv?: boolean;
} = ChannelSetupInput>(params: {
  defaultAccountOnlyEnvError?: string;
  whenNotUseEnv?: SetupInputPresenceRequirement[];
  validate?: (params: {
    cfg: TestclawConfig;
    accountId: string;
    input: Input;
  }) => string | null;
}): NonNullable<ChannelSetupAdapter<Input>["validateInput"]>;
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
declare function createEnvPatchedAccountSetupAdapter(params: {
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  defaultAccountOnlyEnvError: string;
  missingCredentialError: string;
  hasCredentials: (input: ChannelSetupInput) => boolean;
  validateInput?: ChannelSetupAdapter["validateInput"];
  buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
declare function patchScopedAccountConfig(params: {
  cfg: TestclawConfig;
  channelKey: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  accountId: string;
  patch: Record<string, unknown>;
  accountPatch?: Record<string, unknown>;
  clearFields?: readonly string[];
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  scopeDefaultToAccounts?: boolean;
}): TestclawConfig;
/**
 * Promotes legacy single-account channel fields into the account map for multi-account setup.
 */
declare function moveSingleAccountChannelSectionToDefaultAccount(params: {
  cfg: TestclawConfig;
  channelKey: string;
  setupSurface?: ChannelSetupAdapter | ChannelSetupPromotionSurface;
}): TestclawConfig;
//#endregion
export { createSetupInputPresenceValidator as a, patchScopedAccountConfig as c, createPatchedAccountSetupAdapter as i, prepareScopedSetupConfig as l, applySetupAccountConfigPatch as n, migrateBaseNameToDefaultAccount as o, createEnvPatchedAccountSetupAdapter as r, moveSingleAccountChannelSectionToDefaultAccount as s, applyAccountNameToChannelSection as t, ChannelSetupPromotionSurface as u };