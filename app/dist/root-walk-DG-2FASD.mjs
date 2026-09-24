import "./fs-safe-defaults-BN1LgdZl.mjs";
import { root } from "@testclaw/fs-safe/root";
//#region src/infra/root-walk.ts
async function* walkRootDirectory(rootDir, relativePath, options) {
	yield* (await root(rootDir)).walk(relativePath, options);
}
//#endregion
export { walkRootDirectory as t };
