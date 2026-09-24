import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { m as DmPolicy } from "../types.base-CA0_JvyZ.js";
import "../types-RdRiGrAp.js";
import { d as ChannelSetupAdapter } from "../manifest-registry-BbQfGHTp.js";
import "../types.core-DUehY8AL.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import "../types.adapters-8WMF_p63.js";
import { t as ChannelSetupDmPolicy } from "../setup-wizard-types-CW2TaT9P.js";
//#region src/plugin-sdk/channel-dm-policy.d.ts
type DmPolicyAccountConfig = {
  dmPolicy?: DmPolicy;
  allowFrom?: ReadonlyArray<string | number> | null;
};
type ResolvedDmPolicyAccount<TConfig extends DmPolicyAccountConfig> = {
  accountId: string;
  config: TConfig;
};
type DmPolicyContext<TConfig extends DmPolicyAccountConfig> = {
  cfg: TestclawConfig;
  requestedAccountId?: string;
  account: ResolvedDmPolicyAccount<TConfig>;
};
type DmPolicyPatchContext<TConfig extends DmPolicyAccountConfig> = DmPolicyContext<TConfig> & {
  policy: DmPolicy;
  allowFrom?: string[];
};
type CreateChannelDmPolicyParams<TConfig extends DmPolicyAccountConfig> = {
  label: string;
  channel: ChannelId;
  policyKey?: string;
  allowFromKey?: string;
  policyPath?: string;
  allowFromPath?: string;
  resolveAccount: (cfg: TestclawConfig, accountId?: string) => ResolvedDmPolicyAccount<TConfig>;
  resolveConfigKeys?: (context: DmPolicyContext<TConfig>) => {
    policyKey: string;
    allowFromKey: string;
  };
  resolveAllowFrom?: (context: DmPolicyPatchContext<TConfig>) => string[] | undefined;
  buildPatch?: (context: DmPolicyPatchContext<TConfig>) => Record<string, unknown>;
  applyPatch?: (context: DmPolicyContext<TConfig> & {
    patch: Record<string, unknown>;
  }) => TestclawConfig;
  setupSurface?: ChannelSetupAdapter | (() => ChannelSetupAdapter);
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
/** Build an account-aware DM policy descriptor for channel setup flows. */
export declare function createChannelDmPolicy<TConfig extends DmPolicyAccountConfig>(params: CreateChannelDmPolicyParams<TConfig>): ChannelSetupDmPolicy & {
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
//#endregion