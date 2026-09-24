import "./fs-safe-defaults-BN1LgdZl.mjs";
import { movePathWithCopyFallback, replaceFileAtomic, replaceFileAtomicSync } from "@testclaw/fs-safe/atomic";
//#region src/infra/replace-file.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
const replaceFileAtomic$1 = replaceFileAtomic;
//#endregion
export { replaceFileAtomic$1 as n, replaceFileAtomicSync as r, movePathWithCopyFallback as t };
