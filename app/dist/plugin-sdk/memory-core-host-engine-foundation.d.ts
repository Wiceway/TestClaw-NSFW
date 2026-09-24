import { r as TestclawConfig, zt as MemorySearchConfig } from "../types.testclaw-C-wX50Nb.js";
import { a as onInternalSessionTranscriptUpdate, r as resolveSessionTranscriptsDirForAgent } from "../paths-DT3a_kQX.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import "../config-Q4A7ydl1.js";
import { t as resolveStateDir } from "../state-dir-Dajy6YuS.js";
import "../paths-CQ2ss5JU.js";
import { o as resolveUserPath } from "../home-dir-QeDmch_s.js";
import { n as truncateUtf16Safe } from "../utf16-slice-C5Uh1nl-.js";
import { V as root } from "../fs-safe-DV1eMxCt.js";
import { c as resolveAgentContextLimits, l as resolveAgentDir, u as resolveAgentWorkspaceDir } from "../agent-scope-DWFJMn77.js";
import { n as resolveMemorySearchConfig, r as resolveMemorySearchSyncConfig, t as ResolvedMemorySearchConfig } from "../memory-search-COU3D-pL.js";
import "@testclaw/fs-safe/advanced";
import "@testclaw/fs-safe/root";
import { isPathInside } from "@testclaw/fs-safe/path";
import "@testclaw/fs-safe/walk";
//#region src/shared/global-singleton.d.ts
type GlobalSingletonLifecycle = "close-and-restart" | "close-only" | "plugin-registry";
type GlobalSingletonReset<T> = (value: T) => void | Promise<void>;
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
export declare function resolveGlobalSingleton<T>(key: symbol, create: () => T, reset?: GlobalSingletonReset<T>, lifecycle?: GlobalSingletonLifecycle): T;
//#endregion
export { type MemorySearchConfig, type ResolvedMemorySearchConfig, type TestclawConfig, createSubsystemLogger, isPathInside, onInternalSessionTranscriptUpdate, resolveAgentContextLimits, resolveAgentDir, resolveAgentWorkspaceDir, resolveMemorySearchConfig, resolveMemorySearchSyncConfig, resolveSessionTranscriptsDirForAgent, resolveStateDir, resolveUserPath, root, truncateUtf16Safe };