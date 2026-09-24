import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
//#region src/infra/diagnostic-flags.d.ts
/** Resolves enabled diagnostic flags from config plus `TESTCLAW_DIAGNOSTICS` overrides. */
declare function resolveDiagnosticFlags(cfg?: TestclawConfig, env?: NodeJS.ProcessEnv): string[];
/** Matches one diagnostic flag against exact, wildcard, and namespace-enabled flags. */
declare function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean;
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
declare function isDiagnosticFlagEnabled(flag: string, cfg?: TestclawConfig, env?: NodeJS.ProcessEnv): boolean;
//#endregion
export { matchesDiagnosticFlag as n, resolveDiagnosticFlags as r, isDiagnosticFlagEnabled as t };