import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import "../config-contracts-B8mO8f8m.js";
//#region src/plugin-sdk/telegram-account.d.ts
/**
 * @deprecated Compatibility type for the `testclaw/plugin-sdk/telegram-account` facade.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export type TelegramAccountConfig = NonNullable<NonNullable<TestclawConfig["channels"]>["telegram"]>;
/**
 * @deprecated Compatibility type for the `testclaw/plugin-sdk/telegram-account` facade.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export type ResolvedTelegramAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "tokenFile" | "config" | "none";
  config: TelegramAccountConfig;
};
/**
 * @deprecated Compatibility facade for plugin code that needs Telegram account resolution.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export declare function resolveTelegramAccount(params: {
  cfg: TestclawConfig;
  accountId?: string | null;
}): ResolvedTelegramAccount;
//#endregion