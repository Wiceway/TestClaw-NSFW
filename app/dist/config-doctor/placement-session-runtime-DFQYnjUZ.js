import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { _ as resolveEffectiveAgentDir } from "./agent-scope-config-BEuqweC1.js";
import { a as captureRuntimeStateEnvironment } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import "./agent-runtime-id-BAFC9Iwe.js";
import { b as resolveSessionAgentIdsStrict } from "./agent-scope-BiRi-Smp.js";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-Bbf-OONo.js";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.js";
import { n as getRegisteredAgentHarness } from "./registry-DEnV0Kfy.js";
import { s as isCliProvider } from "./model-selection-osPTiirn.js";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-DH8A5K-d.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DwpwjGzF.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BUc95NVY.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DiGMOYgI.js";
import { r as resolveStoredModelOverrideCore } from "./stored-model-overrides-CP51vjqV.js";
import { r as resolveSessionModelRefCore } from "./session-model-ref-CFOEMtHG.js";
import { s as resolveGatewaySessionStoreTargetWithStore, t as createGatewaySessionEntryReader } from "./session-utils-store-lookup-BpmBw41u.js";
//#region src/agents/harness/session-runtime-ownership.ts
/** Reads private ownership for a caller-supplied authoritative session, never a pin heuristic. */
function readSessionRuntimeOwnership(params) {
	const entry = params.sessionEntry;
	const sessionId = entry?.sessionId;
	const harnessId = resolveSessionPinnedHarnessId(entry);
	if (!sessionId || !harnessId) return;
	const harness = getRegisteredAgentHarness(harnessId)?.harness;
	if (!harness?.resolveSessionRuntimeOwnership) return;
	const { config, agentId, sessionKey, storePath } = params;
	let active = true;
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (!active || getRegisteredAgentHarness(harnessId)?.harness !== harness || entry?.sessionId !== sessionId || resolveSessionPinnedHarnessId(entry) !== harnessId) throw new AgentHarnessPreflightError("Native session ownership changed while reading its runtime. Reattach the original native session before retrying.");
	};
	try {
		assertCurrent();
		const ownership = harness.resolveSessionRuntimeOwnership({
			config,
			agentId,
			sessionId,
			sessionKey,
			storePath,
			readPreviousSessionId: () => {
				assertCurrent();
				const key = sessionKey?.trim();
				if (!key) return;
				const { sessionAgentId } = resolveSessionAgentIdsStrict({
					config,
					agentId,
					sessionKey
				});
				const current = loadSessionEntryReadOnly({
					agentId: sessionAgentId,
					sessionKey: key,
					storePath: storePath?.trim() || resolveSessionStorePathCore(config?.session?.store, { agentId: sessionAgentId }),
					hydrateSkillPromptRefs: false,
					readConsistency: "latest"
				});
				assertCurrent();
				return current?.sessionId === sessionId ? current.previousSessionId : void 0;
			},
			assertCurrent
		});
		assertCurrent();
		return ownership ? {
			...ownership,
			...ownership.modelRef ? { modelRef: { ...ownership.modelRef } } : {}
		} : void 0;
	} finally {
		active = false;
	}
}
//#endregion
//#region src/gateway/session-utils-model-selection.ts
function resolveSessionSelectedModelRef(params) {
	const ownership = readSessionRuntimeOwnership({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.source.entry
	});
	if (ownership?.modelRef) return {
		...ownership.modelRef,
		storedOverrideSource: null
	};
	const defaultKey = JSON.stringify([normalizeAgentId(params.agentId), params.allowPluginNormalization !== false]);
	let configuredDefault = params.rowContext?.configuredDefaultModelByAgent.get(defaultKey);
	if (!configuredDefault) {
		configuredDefault = resolveSessionModelRefCore(params.cfg, void 0, params.agentId, {
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
		params.rowContext?.configuredDefaultModelByAgent.set(defaultKey, configuredDefault);
	}
	const storedOverride = resolveStoredModelOverrideCore({
		loadSessionEntry: params.source.readSourceEntry,
		sessionEntry: params.source.entry,
		sessionKey: params.sessionKey,
		parentSessionKey: params.source.entry?.parentSessionKey,
		defaultProvider: configuredDefault.provider,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	if (!storedOverride) return {
		...configuredDefault,
		storedOverrideSource: null
	};
	return {
		provider: storedOverride.provider ?? configuredDefault.provider,
		model: storedOverride.model,
		storedOverrideSource: storedOverride.source
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-capabilities.ts
/** Returns the bounded placement contract declared by one active agent runtime. */
function resolveWorkerPlacementCapabilities(runtime) {
	const runtimeId = runtime.trim();
	if (runtimeId === "testclaw") return {
		executionMode: "worker-turn",
		devicePlacement: {
			requiredNodeCommands: [],
			consumesWorkerSlot: true
		}
	};
	const placement = getRegisteredAgentHarness(runtimeId)?.harness.cloudPlacement;
	if (!placement) return {};
	const requirement = placement.devicePlacement;
	if (!requirement) return { executionMode: placement.mode };
	const requiredNodeCommands = [...new Set(requirement.requiredNodeCommands)].toSorted();
	if (requiredNodeCommands.length > 32 || requiredNodeCommands.some((command) => command.length === 0 || command.length > 128 || command.trim() !== command)) return { executionMode: placement.mode };
	return {
		executionMode: placement.mode,
		devicePlacement: {
			requiredNodeCommands,
			consumesWorkerSlot: requirement.consumesWorkerSlot
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
	const { provider, model } = resolveSessionSelectedModelRef({
		...params,
		source: {
			entry: params.entry,
			readSourceEntry: (key) => {
				const target = resolveGatewaySessionStoreTargetWithStore({
					...params,
					key: params.sessionKey,
					clone: false,
					readOnly: true,
					exactRead: true
				});
				return createGatewaySessionEntryReader({
					...target,
					cfg: params.cfg
				})(key);
			}
		}
	});
	return resolveWorkerPlacementModelRuntime({
		...params,
		provider,
		model
	});
}
function resolveWorkerPlacementModelRuntime(params) {
	const sessionRuntimeOverride = resolveSessionRuntimeOverrideForProvider(params);
	const pinnedHarnessId = resolveSessionPinnedHarnessId(params.entry);
	const pinnedCliRuntime = !(pinnedHarnessId !== void 0 && pinnedHarnessId === sessionRuntimeOverride) && sessionRuntimeOverride && isCliProvider(sessionRuntimeOverride, params.cfg, params.metadataSnapshot) ? sessionRuntimeOverride : void 0;
	const cliExecutionProvider = pinnedCliRuntime ?? (sessionRuntimeOverride ? void 0 : resolveCliRuntimeExecutionProvider({
		...params,
		modelId: params.model,
		authProfileId: params.entry.authProfileOverride,
		preparedAuthDirectories: {
			env: params.preparedEnvironment ?? captureRuntimeStateEnvironment(),
			get agentDir() {
				return resolveEffectiveAgentDir(params.cfg, params.agentId, { env: this.env });
			},
			get inheritedAuthDir() {
				return resolveEffectiveAgentDir(params.cfg, resolveLegacyInheritedAuthAgentId(params.cfg), { env: this.env });
			}
		}
	}));
	return pinnedCliRuntime !== void 0 || !sessionRuntimeOverride && isCliProvider(cliExecutionProvider ?? params.provider, params.cfg, params.metadataSnapshot) ? cliExecutionProvider ?? params.provider : resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	});
}
function resolveWorkerPlacementExecutionMode(runtime) {
	return resolveWorkerPlacementCapabilities(runtime).executionMode;
}
function resolveWorkerPlacementSessionRuntimeCapabilities(params) {
	return resolveWorkerPlacementCapabilities(resolveWorkerPlacementSessionRuntime(params));
}
function projectWorkerPlacementAgentRuntime(runtime) {
	const { source, ...identity } = runtime;
	const { executionMode, devicePlacement } = resolveWorkerPlacementCapabilities(runtime.id);
	return {
		...identity,
		cloudPlacementSupported: executionMode !== void 0,
		...executionMode ? { cloudPlacementExecutionMode: executionMode } : {},
		...devicePlacement ? { devicePlacement } : {},
		devicePlacementSupported: devicePlacement !== void 0,
		source
	};
}
//#endregion
export { resolveWorkerPlacementSessionRuntimeCapabilities as a, readSessionRuntimeOwnership as c, resolveWorkerPlacementSessionRuntime as i, resolveWorkerPlacementExecutionMode as n, resolveWorkerPlacementCapabilities as o, resolveWorkerPlacementModelRuntime as r, resolveSessionSelectedModelRef as s, projectWorkerPlacementAgentRuntime as t };
