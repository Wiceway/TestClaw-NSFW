import { Cu as registerMemoryCapability, Su as listActiveMemoryPublicArtifacts, bu as clearMemoryPluginState, lu as MemoryPromptSectionBuilder, ou as MemoryPluginCapability, su as MemoryPluginPublicArtifact, wu as registerMemoryCorpusSupplement, xu as getMemoryCapabilityRegistration, yu as buildMemoryPromptSection } from "../agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-DT3a_kQX.js";
import "../config-Q4A7ydl1.js";
import { f as resolveDefaultAgentId } from "../agent-scope-DWFJMn77.js";
import { t as resolveSessionAgentIdCompatibility } from "../agent-scope-runtime-CcrxIhTk.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
export declare function listMemoryHostPublicArtifacts(params: {
  cfg: TestclawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentIdCompatibility as resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };