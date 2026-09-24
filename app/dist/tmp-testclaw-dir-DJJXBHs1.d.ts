//#region src/infra/tmp-testclaw-dir.d.ts
/** Preferred shared Testclaw temp root on POSIX systems when ownership and permissions are safe. */
declare const DEFAULT_POSIX_TMP_ROOT = "/tmp/testclaw";
type SecureDirStat = {
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  mode?: number;
  uid?: number;
};
/** Injectable filesystem/platform hooks for resolving the preferred temp root in tests. */
type ResolvePreferredTestclawTmpDirOptions = {
  accessSync?: (path: string, mode?: number) => void;
  chmodSync?: (path: string, mode: number) => void;
  getuid?: () => number | undefined;
  lstatSync?: (path: string) => SecureDirStat;
  mkdirSync?: (path: string, opts: {
    recursive: boolean;
    mode?: number;
  }) => void;
  platform?: NodeJS.Platform;
  preferredDir?: string;
  tmpdir?: () => string;
  warn?: (message: string) => void;
};
/** Resolves a safe Testclaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
declare function resolvePreferredTestclawTmpDir(options?: ResolvePreferredTestclawTmpDirOptions): string;
//#endregion
export { ResolvePreferredTestclawTmpDirOptions as n, resolvePreferredTestclawTmpDir as r, DEFAULT_POSIX_TMP_ROOT as t };