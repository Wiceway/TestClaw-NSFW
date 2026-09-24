import { Bp as resolveProfilesUnavailableReason, Bu as findModelInCatalog, Fu as modelSupportsVision, Gp as loadAuthProfileStoreWithoutExternalProfiles, Ip as markAuthProfileBlockedUntil, Jp as findPersistedAuthProfileCredential, Kp as saveAuthProfileStore, Lp as clearExpiredCooldowns, Mp as resolveApiKeyForProviderCore, Nc as EmbeddedBlockChunker, Rp as isProfileInCooldown, Ts as ResolvedTtsConfig, Up as loadAuthProfileStoreForRuntime, Vp as ensureAuthProfileStore, Wp as loadAuthProfileStoreForSecretsRuntime, Xp as clearRuntimeAuthProfileStoreSnapshots, Yo as agentCommandFromIngress, Yp as resolvePersistedAuthProfileOwnerAgentDir, Zp as replaceRuntimeAuthProfileStoreSnapshots, _s as DEFAULT_PROVIDER, am as resolveAuthProfileOrder, bs as resolveTtsConfig, im as resolveAuthProfileEligibility, nm as refreshOAuthCredentialForRuntime, om as ProviderAuthAliasLookupParams, rm as resolveApiKeyForProfile, sm as resolveProviderIdForAuth, tm as listProfilesForProvider, vs as getTtsProvider, xs as resolveTtsPrefsPath, zp as resolveProfileUnusableUntilForDisplay } from "../agent-harness-runtime-DNhAy8yX.js";
import { d as AssistantMessage, r as TestclawConfig } from "../types.testclaw-C-wX50Nb.js";
import { b as PluginMetadataSnapshot } from "../io-D98w0DmD.js";
import { C as AuthProfileCredential, D as OAuthCredential, E as AuthProfileStore, T as AuthProfileFailureReason } from "../types-DUHHqvaV.js";
import { a as resolveAllowedModelRefCore, c as buildModelAliasIndex, g as ModelCatalogSnapshot, h as ModelCatalogEntry, i as resolveThinkingDefaultCore, l as resolveModelRefFromString, n as parseModelRef, r as resolveThinkingDefaultWithRuntimeCatalogCore, s as buildConfiguredModelCatalog, t as findNormalizedProviderValue, u as resolveDefaultModelForAgent } from "../model-selection-DBtA26GQ.js";
import { d as readStringArrayParam, l as readPositiveIntegerParam, m as jsonResult, p as readToolStringParam, s as readNonNegativeIntegerParam } from "../common-EnjBtVXq.js";
import { d as resolveDefaultAgentDir, f as resolveDefaultAgentId, l as resolveAgentDir, o as setAgentEffectiveModelPrimary, p as listAgentIds, r as resolveAgentEffectiveModelPrimary, s as resolveAgentConfig, u as resolveAgentWorkspaceDir } from "../agent-scope-DWFJMn77.js";
import { c as resolveAckReaction, d as resolveHumanDelayConfig, f as resolveIdentityNamePrefix, l as resolveAgentIdentity } from "../ack-reactions-GrV4bS7i.js";
import { n as resolveSessionAgentIdsCompatibility } from "../agent-scope-runtime-CcrxIhTk.js";
import { t as CODEX_APP_SERVER_AUTH_MARKER } from "../model-auth-markers-1ePEMiK3.js";
//#region src/agents/auth-profiles/paths.d.ts
/** Resolve the user-facing path for the database selected by the auth store loader. */
export declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
//#region src/agents/prepared-model-catalog.d.ts
type LoadPreparedModelCatalogParams = {
  agentId?: string;
  agentDir?: string;
  config?: TestclawConfig;
  readOnly?: boolean;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  providerDiscoveryProviderIds?: readonly string[];
  /** Explicitly requests full inventory acquisition; writable reads also replace completed data. */
  refreshFullCatalog?: boolean;
  /** Scoped read-only loads may run live discovery for the scoped providers only. */
  scopedLiveProviderDiscovery?: boolean;
  allowGatewaySubagentBinding?: boolean;
};
/** Returns the newest published catalog while expired inventory renews in the background. */
export declare function getPreparedModelCatalogSnapshot(params?: LoadPreparedModelCatalogParams): ModelCatalogSnapshot | undefined;
//#endregion
//#region src/agents/identity-avatar.d.ts
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
export declare function resolveAgentAvatar(cfg: TestclawConfig, agentId: string): AgentAvatarResolution;
//#endregion
//#region src/agents/embedded-agent-utils.d.ts
/** Extract sanitized assistant text across all text content blocks. */
declare function extractEmbeddedAssistantText(msg: AssistantMessage): string;
/** Format reasoning text for markdown-friendly channel surfaces. */
export declare function formatReasoningMessage(text: string): string;
//#endregion
//#region src/plugin-sdk/agent-runtime.d.ts
/** Preserves the public SDK's writable default while internal catalog reads stay passive. */
export declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
type LoadModelCatalogCompatibilityParams = LoadPreparedModelCatalogParams & {
  /** @deprecated Lifecycle publication owns refreshes; retained for source compatibility. */
  useCache?: boolean;
  /** @deprecated Use getPreparedModelCatalogSnapshot for new nonblocking readers. */
  cacheOnly?: boolean;
  /** @deprecated Plugin metadata belongs to the published lifecycle generation. */
  metadataSnapshot?: Omit<PluginMetadataSnapshot, "owners" | "declaredProviderOwners"> & {
    declaredProviderOwners?: PluginMetadataSnapshot["declaredProviderOwners"];
    owners: Omit<PluginMetadataSnapshot["owners"], "modelIdNormalizationPolicies" | "providerAuthContributions"> & Partial<Pick<PluginMetadataSnapshot["owners"], "modelIdNormalizationPolicies" | "providerAuthContributions">>;
  };
};
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
export declare function loadModelCatalog(params?: LoadModelCatalogCompatibilityParams): Promise<ModelCatalogEntry[]>;
export declare function resolveThinkingDefaultWithRuntimeCatalog(params: Omit<Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0], "loadRuntimeCatalog"> & {
  loadModelCatalog: Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0]["loadRuntimeCatalog"];
}): Promise<"adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh">;
//#endregion
export { type AgentAvatarResolution, type AuthProfileCredential, type AuthProfileFailureReason, type AuthProfileStore, CODEX_APP_SERVER_AUTH_MARKER, DEFAULT_PROVIDER, EmbeddedBlockChunker, type ModelCatalogEntry, type OAuthCredential, type ProviderAuthAliasLookupParams, type ResolvedTtsConfig, agentCommandFromIngress, buildConfiguredModelCatalog, buildModelAliasIndex, clearExpiredCooldowns, clearRuntimeAuthProfileStoreSnapshots, ensureAuthProfileStore, extractEmbeddedAssistantText as extractAssistantText, findModelInCatalog, findNormalizedProviderValue, findPersistedAuthProfileCredential, getTtsProvider, isProfileInCooldown, jsonResult, listAgentIds, listProfilesForProvider, loadAuthProfileStoreForRuntime, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles, markAuthProfileBlockedUntil, modelSupportsVision, parseModelRef, readNonNegativeIntegerParam, readPositiveIntegerParam, readStringArrayParam, readToolStringParam as readStringParam, refreshOAuthCredentialForRuntime, replaceRuntimeAuthProfileStoreSnapshots, resolveAckReaction, resolveAgentConfig, resolveAgentDir, resolveAgentEffectiveModelPrimary, resolveAgentIdentity, resolveAgentWorkspaceDir, resolveAllowedModelRefCore as resolveAllowedModelRef, resolveApiKeyForProfile, resolveApiKeyForProviderCore as resolveApiKeyForProvider, resolveAuthProfileEligibility, resolveAuthProfileOrder, resolveDefaultAgentDir, resolveDefaultAgentId, resolveDefaultModelForAgent, resolveHumanDelayConfig, resolveIdentityNamePrefix, resolveModelRefFromString, resolvePersistedAuthProfileOwnerAgentDir, resolveProfileUnusableUntilForDisplay, resolveProfilesUnavailableReason, resolveProviderIdForAuth, resolveSessionAgentIdsCompatibility as resolveSessionAgentIds, resolveThinkingDefaultCore as resolveThinkingDefault, resolveTtsConfig, resolveTtsPrefsPath, saveAuthProfileStore, setAgentEffectiveModelPrimary };