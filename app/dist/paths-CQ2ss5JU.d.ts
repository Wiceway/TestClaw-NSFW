import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import "./types-RdRiGrAp.js";
//#region src/config/paths.d.ts
declare let STATE_DIR: string;
/**
 * Active config path (prefers existing config files).
 */
declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: TestclawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
export { resolveOAuthDir as i, resolveConfigPath as n, resolveGatewayPort as r, STATE_DIR as t };