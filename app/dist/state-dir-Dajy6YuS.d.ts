//#region src/config/state-dir.d.ts
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via TESTCLAW_STATE_DIR.
 * Default: ~/.testclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
export { resolveStateDir as t };