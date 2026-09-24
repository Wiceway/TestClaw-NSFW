import "../fs-safe-defaults-Bdy88awN.js";
import { RootWalkEntry, RootWalkEntry as RootWalkEntry$1, RootWalkOptions, RootWalkOptions as RootWalkOptions$1 } from "@testclaw/fs-safe/root";
//#region src/infra/root-walk.d.ts
export declare function walkRootDirectory(rootDir: string, relativePath: string, options: RootWalkOptions$1): AsyncGenerator<RootWalkEntry$1>;
//#endregion
export type { RootWalkEntry, RootWalkOptions };