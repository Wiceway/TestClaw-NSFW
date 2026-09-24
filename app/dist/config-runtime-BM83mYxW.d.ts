import { di as ResolveMarkdownTableModeParams } from "./agent-harness-runtime-DNhAy8yX.js";
import { L as ResolvedTalkConfig, R as TalkConfig, r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import { S as MarkdownTableMode, f as ContextVisibilityMode } from "./types.base-CA0_JvyZ.js";
import "./types.secrets-BR-Cncxg.js";
import "./templating-Cj1bgdNt.js";
import "./io-D98w0DmD.js";
import "./types-RdRiGrAp.js";
import "./config-Q4A7ydl1.js";
import "./agent-scope-DWFJMn77.js";
import "./group-policy--kcrwqE_.js";
import "./plugin-config-runtime-C6wLWA_9.js";
import "./shared-BTSrmP5Y.js";
import "./model-overrides-CaL-L9rH.js";
import "./context-visibility-CNXHuDNv.js";
import "./runtime-group-policy-8hMlgo_G.js";
import "./commands-CWL7apTh.js";
import "./resolve-configured-secret-input-string-B68cffqY.js";
//#region src/config/context-visibility.d.ts
type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      /**
       * Global default supplemental context visibility for channels without a local override.
       */
      contextVisibility?: ContextVisibilityMode;
    };
  };
};
/** Reads the global channel default supplemental context visibility mode. */
declare function resolveDefaultContextVisibility(cfg: ContextVisibilityDefaultsConfig): ContextVisibilityMode | undefined;
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
declare function resolveChannelContextVisibilityMode(params: {
  /** Full Testclaw config containing channel defaults and per-channel overrides. */
  cfg: TestclawConfig;
  /** Channel id whose visibility policy is being resolved. */
  channel: string;
  /** Optional channel account id used for account-specific overrides. */
  accountId?: string | null;
  /** Runtime adapter override that takes precedence over config-backed policy. */
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode;
//#endregion
//#region src/config/markdown-tables.d.ts
declare function resolveMarkdownTableMode(params: ResolveMarkdownTableModeParams): MarkdownTableMode;
//#endregion
//#region src/config/talk.d.ts
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
declare function resolveActiveTalkProviderConfig(talk: TalkConfig | undefined): ResolvedTalkConfig | undefined;
//#endregion
//#region src/config/dangerous-name-matching.d.ts
type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};
type DangerousNameMatchingResolverInput = {
  providerConfig?: DangerousNameMatchingConfig | null | undefined;
  accountConfig?: DangerousNameMatchingConfig | null | undefined;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
declare function resolveDangerousNameMatchingEnabled(input: DangerousNameMatchingResolverInput): boolean;
//#endregion
export { resolveChannelContextVisibilityMode as a, resolveMarkdownTableMode as i, resolveDangerousNameMatchingEnabled as n, resolveDefaultContextVisibility as o, resolveActiveTalkProviderConfig as r, isDangerousNameMatchingEnabled as t };