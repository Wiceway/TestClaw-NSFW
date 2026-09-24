import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
//#region src/channels/plugins/media-limits.d.ts
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
declare function resolveChannelMediaMaxBytes(params: {
  cfg: TestclawConfig;
  resolveChannelLimitMb: (params: {
    cfg: TestclawConfig;
    accountId: string;
  }) => number | undefined;
  accountId?: string | null;
}): number | undefined;
//#endregion
export { resolveChannelMediaMaxBytes as t };