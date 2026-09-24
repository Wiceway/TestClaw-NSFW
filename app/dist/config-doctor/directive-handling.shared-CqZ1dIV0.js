import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as buildModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-Dzv8ad-5.js";
import { c as isDiagnosticFlagEnabled } from "./diagnostics-timeline-DDShltPN.js";
import { D as hasSessionAutoModelSelection, E as hasSessionAutoModelFallbackProvenance, r as hasLegacyAutoFallbackWithoutOrigin } from "./agent-scope-BiRi-Smp.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BXJ-qR2p.js";
import { a as isInternalMessageChannel } from "./message-channel-iCC7oIhe.js";
import { a as applyModelOverrideToSessionEntry } from "./model-overrides-D92VyxpR.js";
import { t as isUserModelAuthProfileId } from "./user-model-account-id-DbXiF5Ev.js";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-CwdU8Hfw.js";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-hBkALjff.js";
import { i as SessionWorkStartInvalidatedError } from "./lifecycle-DpcRUIUy.js";
import { a as findPersistedAuthProfileCredential } from "./store-D9AW3Yaj.js";
import { r as resolveModelAliasFromPair } from "./model-selection-resolve-CGvmVFuO.js";
import { t as resolveAgentHarnessPolicy } from "./policy-DkYYnWfL.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-D7DJivFp.js";
import { n as ensureAuthProfileStore } from "./store-runtime-gE8saxs_.js";
import "./auth-profiles-pp6W0I8V.js";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-DeP2k_E2.js";
import { a as resolveReasoningDefault } from "./model-selection-osPTiirn.js";
import { o as resolveEffectiveAgentRuntime, r as needsThinkHydration } from "./thinking-runtime-DiGMOYgI.js";
import { r as resolveStoredModelOverrideCore, t as resolveDirectStoredModelOverride } from "./stored-model-overrides-CP51vjqV.js";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, o as sessionSnapshotChangesApplied, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Br9OMCio.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-DgHwp901.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-BZz9ZVdx.js";
import { n as prefixSystemMessage, t as SYSTEM_MARK } from "./system-message-B9Vd-lgg.js";
import { n as applyVerboseOverride, t as applyTraceOverride } from "./level-overrides-RhKvHfBy.js";
import { a as normalizeRuntimeRef, r as mergePreparedConfiguredCatalog, s as resolveRuntimeNormalization, t as findSelectedCatalogEntry } from "./model-runtime-normalization-CuvMcM31.js";
import { t as resolveModelDirectiveSelection } from "./model-selection-directive-xtfs0n2U.js";
import "./model-selection-context-BKg23xn9.js";
import { t as persistReplySessionEntry } from "./session-entry-persistence-Dmy5cvPD.js";
//#region src/auto-reply/reply/directive-handling.arguments.ts
function resolveInvalidExecDirectiveMessage(directives) {
	return directives.invalidExecHost ? `Unrecognized exec host "${directives.rawExecHost ?? ""}". Valid hosts: auto, sandbox, gateway, node.` : directives.invalidExecSecurity ? `Unrecognized exec security "${directives.rawExecSecurity ?? ""}". Valid: deny, allowlist, full.` : directives.invalidExecAsk ? `Unrecognized exec ask "${directives.rawExecAsk ?? ""}". Valid: off, on-miss, always.` : directives.invalidExecNode ? "Exec node requires a value." : void 0;
}
/** Rejects prose left over after canonical command-specific validation succeeds. */
function maybeHandleUnexpectedDirectiveArguments(directives) {
	const command = directives.command;
	const unconsumedArguments = command?.unconsumedArguments;
	if (!command || !unconsumedArguments) return;
	return { text: `Unexpected argument "${unconsumedArguments.trimStart().split(/\s+/, 1)[0] ?? unconsumedArguments}" for /${command.name}.` };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.auth-profile.ts
/** Resolves a user-selected auth profile override for the requested provider. */
function resolveProfileOverride(params) {
	const raw = normalizeOptionalString(params.rawProfile);
	if (!raw) return {};
	const requesterProfileId = params.requesterProfileId;
	const validateSelection = isUserModelAuthProfileId(raw) ? () => requesterProfileId && isUserModelAuthProfileOwner({
		profileId: requesterProfileId,
		authProfileId: raw
	}) ? void 0 : "Select a personal model account connected to your signed-in profile." : void 0;
	const selectionError = validateSelection?.();
	if (selectionError) return { error: selectionError };
	const profile = findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId: raw
	}) ?? ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[raw];
	if (!profile) return { error: `Auth profile "${raw}" not found.` };
	if (profile.provider !== params.provider) return { error: `Auth profile "${raw}" is for ${profile.provider}, not ${params.provider}.` };
	return {
		profileId: raw,
		...validateSelection ? { validateSelection } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/stored-model-override.ts
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
function isStaleHeartbeatAutoFallbackOverride(params) {
	if (params.isHeartbeat !== true || params.hasResolvedHeartbeatModelOverride === true) return false;
	if (params.storedOverride?.source !== "session") return false;
	const entry = params.sessionEntry;
	const recoveredAutoFallbackOverride = entry !== void 0 && entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry?.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	if (!entry) return false;
	const primaryProvider = params.primaryProvider ?? params.defaultProvider;
	const primaryModel = params.primaryModel ?? params.defaultModel;
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	if (originModel) return (normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) ?? params.defaultProvider) !== primaryProvider || originModel !== primaryModel;
	const noticeSelectedKey = normalizeOptionalString(entry.fallbackNotice?.selectedModel);
	return noticeSelectedKey ? noticeSelectedKey !== buildModelCatalogRef(primaryProvider, primaryModel) : (params.storedOverride.provider ?? params.defaultProvider) !== primaryProvider || params.storedOverride.model !== primaryModel;
}
//#endregion
//#region src/auto-reply/reply/model-selection.ts
/** Model selection state for reply runs, including catalog and override handling. */
const modelCatalogRuntimeLoader = createLazyImportLoader(() => import("./model-catalog.runtime-ITdC3QzL.js"));
const sessionPersistenceRuntimeLoader = createLazyImportLoader(() => import("./session-entry-persistence-CeOpDYsw.js"));
function loadPreparedModelCatalogRuntime() {
	return modelCatalogRuntimeLoader.load();
}
function loadSessionPersistenceRuntime() {
	return sessionPersistenceRuntimeLoader.load();
}
/** Resolves provider/model, allowlist, catalog, and thinking defaults for a reply run. */
async function createModelSelectionState(params) {
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", params.cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		console.log(`[model-selection] session=${params.sessionKey ?? "(no-session)"} stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	const { cfg, agentCfg, sessionEntry, sessionStore, sessionKey, parentSessionKey, storePath, defaultProvider, defaultModel } = params;
	const loadRuntimeCatalogSnapshot = async () => params.preparedModelCatalog ?? await (await loadPreparedModelCatalogRuntime()).loadPreparedModelCatalogSnapshot({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		readOnly: true
	});
	const runtimeModelNormalization = resolveRuntimeNormalization(cfg);
	let provider = params.provider;
	let model = params.model;
	const primaryProvider = params.primaryProvider ?? defaultProvider;
	const primaryModel = params.primaryModel ?? defaultModel;
	const hasOneTurnModelOverride = params.hasOneTurnModelOverride === true;
	const modelSelectionLocked = sessionEntry?.modelSelectionLocked === true;
	const agentEntry = params.agentId ? resolveAgentConfig(cfg, params.agentId) : void 0;
	let visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog: [],
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId,
		...runtimeModelNormalization
	});
	const hasAllowlist = !visibilityPolicy.allowAny;
	const hasConfiguredModels = Object.keys(agentCfg?.models ?? {}).length > 0 || Object.keys(agentEntry?.models ?? {}).length > 0;
	const defaultModelVisibleByWildcard = visibilityPolicy.allowsByWildcard({
		provider: defaultProvider,
		model: defaultModel
	});
	const configuredModelCatalog = mergePreparedConfiguredCatalog({
		configured: [...visibilityPolicy.configuredCatalog],
		prepared: params.preparedModelCatalog?.entries
	});
	const needsModelCatalog = params.hasModelDirective || hasAllowlist && visibilityPolicy.hasProviderWildcards && !defaultModelVisibleByWildcard;
	let allowedModelKeys = /* @__PURE__ */ new Set();
	let allowedModelCatalog = configuredModelCatalog;
	let modelCatalog = null;
	let catalogAuthoritative = true;
	let resetModelOverride = false;
	let resetModelOverrideRef;
	let resetModelOverrideReason;
	const directStoredModelOverride = resolveDirectStoredModelOverride({
		sessionEntry,
		defaultProvider,
		allowPluginNormalization: runtimeModelNormalization.allowPluginNormalization,
		manifestPlugins: runtimeModelNormalization.manifestPlugins
	});
	const primaryHarnessPolicy = resolveAgentHarnessPolicy({
		provider: primaryProvider,
		modelId: primaryModel,
		config: cfg,
		agentId: params.agentId,
		sessionKey
	});
	const directOverrideRef = directStoredModelOverride ? {
		provider: directStoredModelOverride.provider ?? defaultProvider,
		model: directStoredModelOverride.model
	} : void 0;
	const isStaleStoredOverride = (entry, override) => {
		const staleHeartbeatAutoFallbackOverride = isStaleHeartbeatAutoFallbackOverride({
			isHeartbeat: params.isHeartbeat,
			hasResolvedHeartbeatModelOverride: params.hasResolvedHeartbeatModelOverride,
			sessionEntry: entry,
			storedOverride: override,
			defaultProvider,
			defaultModel,
			primaryProvider: params.primaryProvider,
			primaryModel: params.primaryModel
		});
		const staleLegacyOpenAICodexAutoOverride = override?.source === "session" && entry?.modelOverrideSource === "auto" && normalizeProviderId(override.provider ?? "") === "openai" && normalizeProviderId(primaryProvider) === "openai" && primaryHarnessPolicy.runtime === "codex" && normalizeRuntimeRef("openai", override.model, runtimeModelNormalization).model === normalizeRuntimeRef("openai", primaryModel, runtimeModelNormalization).model;
		const staleLegacyAutoFallbackWithoutOrigin = override?.source === "session" && hasLegacyAutoFallbackWithoutOrigin(entry) && (params.provider !== (override.provider ?? defaultProvider) || params.model !== override.model);
		return staleHeartbeatAutoFallbackOverride || staleLegacyOpenAICodexAutoOverride || staleLegacyAutoFallbackWithoutOrigin;
	};
	const staleDirectStoredOverride = isStaleStoredOverride(sessionEntry, directStoredModelOverride);
	if (needsModelCatalog) {
		const catalogSnapshot = await loadRuntimeCatalogSnapshot();
		modelCatalog = catalogSnapshot.entries;
		catalogAuthoritative = catalogSnapshot.authoritative !== false;
		logStage("catalog-loaded", `entries=${modelCatalog.length} authoritative=${catalogAuthoritative}`);
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: modelCatalog,
			defaultProvider,
			defaultModel: {
				provider: defaultProvider,
				model: defaultModel
			},
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	} else if (hasAllowlist || hasConfiguredModels || configuredModelCatalog.length > 0) {
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: configuredModelCatalog,
			defaultProvider,
			defaultModel: {
				provider: defaultProvider,
				model: defaultModel
			},
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("configured-allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	}
	if (sessionEntry && sessionStore && sessionKey && directOverrideRef && !hasOneTurnModelOverride) {
		const key = buildModelCatalogRef(directOverrideRef.provider, directOverrideRef.model);
		const overrideAllowed = hasSessionAutoModelSelection(sessionEntry) || visibilityPolicy.allows(directOverrideRef);
		const shouldResetOverride = (staleDirectStoredOverride || !overrideAllowed) && !modelSelectionLocked;
		if (shouldResetOverride && !staleDirectStoredOverride && !catalogAuthoritative) {
			resetModelOverrideRef = key;
			resetModelOverrideReason = "temporarily-unavailable";
		} else if (shouldResetOverride) {
			const initialSessionEntry = { ...sessionEntry };
			const nextSessionEntry = { ...sessionEntry };
			const { updated } = applyModelOverrideToSessionEntry({
				entry: nextSessionEntry,
				selection: {
					provider: primaryProvider,
					model: primaryModel,
					isDefault: true
				},
				preserveAuthProfileOverride: staleDirectStoredOverride
			});
			let resetApplied = updated;
			if (updated) {
				if (storePath) {
					const { persistReplySessionEntry } = await loadSessionPersistenceRuntime();
					const persistence = await persistReplySessionEntry({
						storePath,
						sessionKey,
						initialEntry: initialSessionEntry,
						entry: nextSessionEntry
					});
					if (persistence.status === "lifecycle-invalidated") throw new SessionWorkStartInvalidatedError(persistence.error);
					const persistedEntry = persistence.entry;
					resetApplied = sessionModelOverrideChangesApplied({
						initial: initialSessionEntry,
						next: nextSessionEntry,
						current: persistedEntry
					});
					adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
				} else adoptPersistedSessionSnapshot(sessionEntry, nextSessionEntry);
				sessionStore[sessionKey] = sessionEntry;
			}
			resetModelOverride = resetApplied;
			if (resetApplied) {
				resetModelOverrideRef = key;
				resetModelOverrideReason = staleDirectStoredOverride ? "stale" : "disallowed";
			}
		}
	}
	if (staleDirectStoredOverride && params.provider === directOverrideRef?.provider && params.model === directOverrideRef.model) {
		provider = primaryProvider;
		model = primaryModel;
	}
	const storedOverride = resolveStoredModelOverrideCore({
		sessionEntry,
		sessionStore,
		sessionKey,
		parentSessionKey,
		defaultProvider,
		allowPluginNormalization: runtimeModelNormalization.allowPluginNormalization,
		manifestPlugins: runtimeModelNormalization.manifestPlugins
	});
	const skipStoredOverride = params.skipStoredModelOverride === true || hasOneTurnModelOverride || params.hasResolvedHeartbeatModelOverride === true || resetModelOverride && staleDirectStoredOverride && storedOverride?.source === "session";
	const usesStoredAutomaticSelection = !skipStoredOverride && storedOverride?.source === "session" && hasSessionAutoModelSelection(sessionEntry) && !isStaleStoredOverride(sessionEntry, storedOverride);
	if (storedOverride?.model && !skipStoredOverride) {
		const storedProvider = storedOverride.provider || defaultProvider;
		const storedRouteCataloged = Boolean(findSelectedCatalogEntry({
			catalog: modelCatalog ?? allowedModelCatalog,
			provider: storedProvider,
			model: storedOverride.model
		}));
		const normalizedStoredOverride = (storedOverride.routeResolution === "raw" && !storedRouteCataloged ? resolveModelAliasFromPair({
			cfg,
			provider: storedProvider,
			model: storedOverride.model,
			defaultProvider,
			aliasIndex: visibilityPolicy.selectionAliasIndex,
			...runtimeModelNormalization
		}) : null) ?? {
			provider: storedProvider,
			model: storedOverride.model
		};
		if (modelSelectionLocked || usesStoredAutomaticSelection || visibilityPolicy.allows(normalizedStoredOverride)) {
			provider = normalizedStoredOverride.provider;
			model = normalizedStoredOverride.model;
		}
	}
	if (!(params.hasModelDirective || hasOneTurnModelOverride || modelSelectionLocked || usesStoredAutomaticSelection)) {
		const allowedInitialSelection = visibilityPolicy.resolveSelection({
			provider,
			model,
			routeResolution: "resolved"
		});
		if (!allowedInitialSelection) {
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			throw new Error(`Configured default model "${buildModelCatalogRef(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
		}
		provider = allowedInitialSelection.provider;
		model = allowedInitialSelection.model;
	}
	if (!params.skipStoredModelOverride && sessionEntry && sessionStore && sessionKey && sessionEntry.authProfileOverride) {
		const { ensureAuthProfileStore } = await import("./auth-profiles.runtime-PHklKEz5.js");
		const store = ensureAuthProfileStore(params.agentId ? resolveAgentDir(cfg, params.agentId) : void 0, {
			allowKeychainPrompt: false,
			profileId: sessionEntry.authProfileOverride
		});
		logStage("auth-profile-store-loaded", `profiles=${Object.keys(store.profiles).length}`);
		const profile = store.profiles[sessionEntry.authProfileOverride];
		const authConfig = resolveModelProviderAuthConfig({
			config: cfg,
			provider,
			modelId: model
		});
		const harnessPolicy = resolveAgentHarnessPolicy({
			provider,
			modelId: model,
			config: cfg,
			agentId: params.agentId,
			sessionKey
		});
		const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
			provider,
			harnessRuntime: harnessPolicy.runtime,
			config: cfg
		}).map(normalizeProviderId);
		const overrideStillEligible = profile != null && acceptedAuthProviders.some((accepted) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: authConfig,
			provider: accepted,
			credential: profile
		}));
		const missingPersonalProfile = !profile && isUserModelAuthProfileId(sessionEntry.authProfileOverride);
		if (!overrideStillEligible && !missingPersonalProfile) await clearSessionAuthProfileOverride({
			agentId: params.agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
	}
	const buildThinkingCatalog = (catalog) => createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId,
		...runtimeModelNormalization
	}).catalog;
	const resolveThinkingSelection = (selection) => {
		const selected = findSelectedCatalogEntry({
			...selection,
			catalog: visibilityPolicy.catalog
		});
		return {
			...selection,
			agentRuntime: selection.agentRuntime ?? resolveEffectiveAgentRuntime({
				cfg,
				provider: selection.provider,
				modelId: selection.model,
				modelApi: selected?.api,
				modelBaseUrl: selected?.baseUrl,
				agentId: params.agentId,
				sessionKey,
				sessionEntry
			})
		};
	};
	const thinkingCatalogs = /* @__PURE__ */ new Map();
	const resolveThinkingCatalog = async (selection = {
		provider,
		model
	}) => {
		const { agentRuntime } = resolveThinkingSelection(selection);
		const key = JSON.stringify([
			selection.provider,
			selection.model,
			agentRuntime
		]);
		const cached = thinkingCatalogs.get(key);
		if (cached) return cached.length > 0 ? cached : void 0;
		let catalog = visibilityPolicy.catalog;
		if (needsThinkHydration(catalog, selection.provider, selection.model, agentRuntime)) {
			const { loadProviderScopedThinkingCatalog } = await loadPreparedModelCatalogRuntime();
			const preparedCatalog = await loadProviderScopedThinkingCatalog({
				config: cfg,
				agentId: params.agentId,
				provider: selection.provider,
				model: selection.model,
				agentRuntime
			});
			if (findSelectedCatalogEntry({
				catalog: preparedCatalog,
				...selection
			})) catalog = buildThinkingCatalog(preparedCatalog);
		}
		thinkingCatalogs.set(key, catalog);
		return catalog.length > 0 ? catalog : void 0;
	};
	const defaultThinkingLevels = /* @__PURE__ */ new Map();
	const resolveDefaultThinkingLevel = async (selection = {
		provider,
		model
	}) => {
		const thinkingSelection = resolveThinkingSelection(selection);
		const cacheKey = JSON.stringify([
			selection.provider,
			selection.model,
			thinkingSelection.agentRuntime
		]);
		const cached = defaultThinkingLevels.get(cacheKey);
		if (cached) return cached;
		const thinkingParams = {
			cfg,
			agentId: params.agentId,
			...thinkingSelection
		};
		const resolved = resolveConfiguredThinkingDefaultCore(thinkingParams) ?? resolveThinkingDefaultCore({
			...thinkingParams,
			catalog: await resolveThinkingCatalog(thinkingSelection)
		});
		defaultThinkingLevels.set(cacheKey, resolved);
		return resolved;
	};
	const hasConfiguredThinkingDefault = resolveConfiguredThinkingDefaultCore({
		cfg,
		agentId: params.agentId,
		provider,
		model
	}) !== void 0;
	const resolveDefaultReasoningLevel = async (selection = {
		provider,
		model
	}) => resolveReasoningDefault({
		provider: selection.provider,
		model: selection.model,
		catalog: await resolveThinkingCatalog(selection)
	});
	const selectedCatalogEntry = findSelectedCatalogEntry({
		catalog: visibilityPolicy.catalog,
		provider,
		model
	});
	return {
		provider,
		model,
		requestedRouteResolution: "resolved",
		modelPolicy: visibilityPolicy,
		allowedModelKeys,
		allowedModelCatalog,
		policyAliasIndex: visibilityPolicy.policyAliasIndex,
		resetModelOverride,
		resetModelOverrideRef,
		resetModelOverrideReason,
		modelPolicyConfigPath: visibilityPolicy.allowConfigPath ?? void 0,
		modelPolicyRepairConfigPath: visibilityPolicy.allowRepairConfigPath,
		resolveThinkingCatalog,
		resolveDefaultThinkingLevel,
		hasConfiguredThinkingDefault,
		resolveDefaultReasoningLevel,
		modelContextWindow: selectedCatalogEntry?.contextWindow,
		modelContextTokens: selectedCatalogEntry?.contextTokens
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model-selection.ts
/** Resolves /model directive selections and auth profile overrides. */
function resolveStoredNumericProfileModelDirective(params) {
	const trimmed = params.raw.trim();
	const lastSlash = trimmed.lastIndexOf("/");
	const profileDelimiter = trimmed.indexOf("@", lastSlash + 1);
	if (profileDelimiter <= 0) return null;
	const profileId = trimmed.slice(profileDelimiter + 1).trim();
	if (!/^\d{8}$/.test(profileId)) return null;
	const modelRaw = trimmed.slice(0, profileDelimiter).trim();
	if (!modelRaw) return null;
	const profile = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[profileId];
	if (!profile) return null;
	return {
		modelRaw,
		profileId,
		profileProvider: profile.provider
	};
}
/** Resolves the requested model/profile override from parsed inline directives. */
function resolveModelSelectionFromDirective(params) {
	if (!params.directives.hasModelDirective || !params.directives.rawModelDirective) {
		if (params.directives.rawModelProfile) return { errorText: "Auth profile override requires a model selection." };
		return {};
	}
	const raw = params.directives.rawModelDirective.trim();
	if (/^default$/i.test(raw)) return { modelSelection: {
		provider: params.defaultProvider,
		model: params.defaultModel,
		isDefault: true,
		resetToDefault: true
	} };
	const storedNumericProfile = params.directives.rawModelProfile === void 0 ? resolveStoredNumericProfileModelDirective({
		raw,
		agentDir: params.agentDir
	}) : null;
	const storedNumericProfileSelection = storedNumericProfile ? resolveModelDirectiveSelection({
		raw: storedNumericProfile.modelRaw,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		aliasIndex: params.aliasIndex,
		allowedModelKeys: params.allowedModelKeys,
		modelPolicy: params.modelPolicy,
		cfg: params.cfg,
		agentId: params.agentId,
		rawRuntime: params.directives.rawModelRuntime
	}) : null;
	const useStoredNumericProfile = Boolean(storedNumericProfileSelection?.selection) && resolveProviderIdForAuth(storedNumericProfileSelection?.selection?.provider ?? "", { config: params.cfg }) === resolveProviderIdForAuth(storedNumericProfile?.profileProvider ?? "", {
		config: params.cfg,
		storedCredential: true
	});
	const modelRaw = useStoredNumericProfile && storedNumericProfile ? storedNumericProfile.modelRaw : raw;
	if (/^[0-9]+$/.test(raw)) return { errorText: [
		"Numeric model selection is not supported in chat.",
		"",
		"Browse: /models or /models <provider>",
		"Switch: /model <provider/model>"
	].join("\n") };
	const resolved = resolveModelDirectiveSelection({
		raw: modelRaw,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		aliasIndex: params.aliasIndex,
		allowedModelKeys: params.allowedModelKeys,
		modelPolicy: params.modelPolicy,
		cfg: params.cfg,
		agentId: params.agentId,
		rawRuntime: params.directives.rawModelRuntime
	});
	if (resolved.error) return { errorText: resolved.error };
	const modelSelection = resolved.selection;
	let profileOverride;
	let validateAuthProfileSelection;
	const rawProfile = params.directives.rawModelProfile ?? (useStoredNumericProfile ? storedNumericProfile?.profileId : void 0);
	if (modelSelection && rawProfile) {
		const profileResolved = resolveProfileOverride({
			rawProfile,
			provider: modelSelection.provider,
			cfg: params.cfg,
			agentDir: params.agentDir,
			requesterProfileId: params.requesterProfileId
		});
		if (profileResolved.error) return { errorText: profileResolved.error };
		profileOverride = profileResolved.profileId;
		validateAuthProfileSelection = profileResolved.validateSelection;
	}
	return {
		modelSelection,
		profileOverride,
		...validateAuthProfileSelection ? { validateAuthProfileSelection } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.shared.ts
const DIRECTIVE_ACK_MESSAGES = {
	verbose: {
		off: "Verbose logging disabled.",
		on: "Verbose logging enabled.",
		full: "Verbose logging set to full."
	},
	trace: {
		off: "Trace disabled.",
		on: "Trace enabled. Warning: trace output may contain sensitive information.",
		raw: "Trace set to raw. Warning: trace output may contain sensitive information."
	},
	reasoning: {
		off: "Reasoning visibility disabled.",
		on: "Reasoning visibility enabled.",
		stream: "Reasoning stream enabled."
	},
	elevated: {
		off: "Elevated mode disabled.",
		on: "Elevated mode set to ask (approvals may still apply).",
		ask: "Elevated mode set to ask (approvals may still apply).",
		full: "Elevated mode set to full (auto-approve)."
	}
};
const formatDirectiveAck = (text) => {
	return prefixSystemMessage(text);
};
const formatOptionsLine = (options) => `Options: ${options}.`;
const withOptions = (line, options) => `${line}\n${formatOptionsLine(options)}`;
const formatElevatedRuntimeHint = () => `${SYSTEM_MARK} Runtime is direct; sandboxing does not apply.`;
const formatInternalExecPersistenceDeniedText = () => "Exec defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerbosePersistenceDeniedText = () => "Verbose defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerboseCurrentReplyOnlyText = () => "Verbose logging set for the current reply only.";
function formatModelSelectionScopeAck(params) {
	if (params.isDefault && !params.stickyModelSelectionTarget) return `Session model reset to configured default (${params.label}).`;
	const targetLabel = params.stickyModelSelectionTarget === "agent" ? "Agent default" : params.stickyModelSelectionTarget === "defaults" ? "Global default" : "Configured default";
	if (params.configuredDefaultUpdate === "requested") return `Model set to ${params.label} for this session. ${targetLabel} update requested.`;
	if (params.configuredDefaultUpdate === "skipped-immutable") return `Model set to ${params.label} for this session. ${targetLabel} unchanged because configuration is immutable.`;
	return `Model set to ${params.label} for this session only; configured default unchanged.`;
}
function canPersistSessionDirectiveDefaults(params) {
	const messageProvider = normalizeOptionalString(params.messageProvider);
	const surface = normalizeOptionalString(params.surface);
	const authoritativeChannel = messageProvider ?? surface;
	if (!authoritativeChannel) return true;
	if (isInternalMessageChannel(authoritativeChannel)) return params.gatewayClientScopes?.includes("operator.admin") === true;
	return params.commandAuthorized === true || params.senderIsOwner === true;
}
const SESSION_LEVEL_DIRECTIVE_FIELDS = [
	["hasThinkDirective", "thinkingLevel"],
	["hasFastDirective", "fastMode"],
	["hasVerboseDirective", "verboseLevel"],
	["hasTraceDirective", "traceLevel"],
	["hasReasoningDirective", "reasoningLevel"],
	["hasElevatedDirective", "elevatedLevel"]
];
const SESSION_EXEC_DIRECTIVE_FIELDS = ["execHost", "execNode"];
const SESSION_QUEUE_DIRECTIVE_FIELDS = [
	["queueMode", "queueMode"],
	["debounceMs", "queueDebounceMs"],
	["cap", "queueCap"],
	["dropPolicy", "queueDrop"]
];
/** Names explicit directive writes that snapshot equality cannot infer. */
function resolveDirectiveTouchedSessionFields(params) {
	const { directives } = params;
	const fields = /* @__PURE__ */ new Set();
	if (directives.hasModelDirective) for (const field of SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS) fields.add(field);
	if (!params.directiveOnly) return [...fields];
	for (const [directiveField, sessionField] of SESSION_LEVEL_DIRECTIVE_FIELDS) if (directives[directiveField] && (sessionField !== "verboseLevel" || params.allowPrivilegedPersistence)) fields.add(sessionField);
	if (directives.hasExecDirective && params.allowPrivilegedPersistence) {
		for (const field of SESSION_EXEC_DIRECTIVE_FIELDS) if (directives[field]) fields.add(field);
	}
	if (directives.hasQueueDirective) for (const [directiveField, sessionField] of SESSION_QUEUE_DIRECTIVE_FIELDS) {
		const value = directives[directiveField];
		if (directives.queueReset || typeof value === "number" || Boolean(value)) fields.add(sessionField);
	}
	return [...fields];
}
function rejectSessionDirectiveTransaction(persistenceState, errorText) {
	if (persistenceState) persistenceState.outcome = {
		kind: "rejected",
		errorText
	};
	return {
		text: errorText,
		isError: true
	};
}
/** Keeps the first informational/denied acknowledgement while validating the remaining hints. */
async function acknowledgeIgnoredSessionDirective(params) {
	if (!params.persistenceState) return params.reply;
	const { directives, ignoredDirective } = params;
	const remainingDirectives = ignoredDirective === "hasExecDirective" && directives.hasExecOptions ? {
		...directives,
		invalidExecHost: false,
		invalidExecSecurity: false,
		invalidExecAsk: false,
		invalidExecNode: false
	} : {
		...directives,
		[ignoredDirective]: false,
		...ignoredDirective === "hasThinkDirective" ? { clearThinkLevel: false } : {},
		...ignoredDirective === "hasFastDirective" ? { clearFastMode: false } : {},
		...ignoredDirective === "hasModelDirective" ? { rawModelProfile: void 0 } : {}
	};
	const siblingReply = await params.applyRemainingDirectives(remainingDirectives);
	if (params.persistenceState.outcome.kind === "rejected") return siblingReply ?? params.reply;
	return params.reply;
}
/** Applies canonical session settings while each caller retains its authorization boundaries. */
function applySessionDirectiveFields(params) {
	const { directives, sessionEntry } = params;
	let updated = false;
	const updateField = (field, value) => {
		sessionEntry[field] = value;
		updated = true;
	};
	if (directives.clearThinkLevel) {
		if (sessionEntry.thinkingLevel) {
			delete sessionEntry.thinkingLevel;
			updated = true;
		}
	} else if (directives.hasThinkDirective && directives.thinkLevel) updateField("thinkingLevel", directives.thinkLevel);
	if (directives.clearFastMode) {
		if (sessionEntry.fastMode !== void 0) {
			delete sessionEntry.fastMode;
			updated = true;
		}
	} else if (directives.hasFastDirective && directives.fastMode !== void 0) updateField("fastMode", directives.fastMode);
	if (directives.hasVerboseDirective && directives.verboseLevel && params.allowPrivilegedPersistence) {
		applyVerboseOverride(sessionEntry, directives.verboseLevel);
		updated = true;
	}
	if (directives.hasTraceDirective && directives.traceLevel) {
		applyTraceOverride(sessionEntry, directives.traceLevel);
		updated = true;
	}
	if (directives.hasReasoningDirective && directives.reasoningLevel) updateField("reasoningLevel", directives.reasoningLevel);
	if (directives.hasElevatedDirective && directives.elevatedLevel && params.allowElevatedPersistence) updateField("elevatedLevel", directives.elevatedLevel);
	if (directives.hasExecDirective && directives.hasExecOptions && params.allowPrivilegedPersistence) for (const field of SESSION_EXEC_DIRECTIVE_FIELDS) {
		const value = directives[field];
		if (value) updateField(field, value);
	}
	if (directives.hasQueueDirective && directives.queueReset) {
		for (const [, field] of SESSION_QUEUE_DIRECTIVE_FIELDS) delete sessionEntry[field];
		updated = true;
	} else if (directives.hasQueueDirective) for (const [directiveField, sessionField] of SESSION_QUEUE_DIRECTIVE_FIELDS) {
		const value = directives[directiveField];
		if (typeof value === "number" || value) updateField(sessionField, value);
	}
	return updated;
}
/** Commits a directive snapshot only when its touched fields still win the session transaction. */
async function persistSessionDirectiveSnapshot(params) {
	const { sessionEntry, sessionKey, sessionStore } = params;
	const persistence = await persistReplySessionEntry({
		storePath: params.storePath,
		sessionKey,
		initialEntry: params.initialEntry,
		entry: sessionEntry,
		reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending,
		requireModelSelectionUnlocked: params.hasModelSelection,
		touchedFields: params.touchedFields,
		validateCommit: params.validateCommit
	});
	if (persistence.status !== "current") {
		if (persistence.entry) {
			sessionStore[sessionKey] = persistence.entry;
			adoptPersistedSessionSnapshot(sessionEntry, persistence.entry);
		}
		if (persistence.status === "commit-rejected") return persistence;
		return { status: persistence.status === "model-selection-locked" ? persistence.status : "conflict" };
	}
	const persistedEntry = persistence.entry;
	sessionStore[sessionKey] = persistedEntry;
	const sessionChangesApplied = sessionSnapshotChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		touchedFields: params.touchedFields
	});
	const modelSelectionApplied = !params.hasModelSelection || sessionChangesApplied && sessionModelOverrideChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending
	});
	adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
	return { status: sessionChangesApplied && modelSelectionApplied ? "applied" : "conflict" };
}
const formatElevatedEvent = (level) => {
	if (level === "full") return "Elevated FULL - exec runs on host with auto-approval.";
	if (level === "ask" || level === "on") return "Elevated ASK - exec runs on host; approvals may still apply.";
	return "Elevated OFF - exec stays in sandbox.";
};
const formatReasoningEvent = (level) => {
	if (level === "stream") return "Reasoning STREAM - emit live <think>.";
	if (level === "on") return "Reasoning ON - include <think>.";
	return "Reasoning OFF - hide <think>.";
};
function enqueueModeSwitchEvents(params) {
	if (params.elevatedChanged) {
		const nextElevated = params.sessionEntry.elevatedLevel ?? "off";
		params.enqueueSystemEvent(formatElevatedEvent(nextElevated), {
			sessionKey: params.sessionKey,
			contextKey: "mode:elevated"
		});
	}
	if (params.reasoningChanged) {
		const nextReasoning = params.sessionEntry.reasoningLevel ?? "off";
		params.enqueueSystemEvent(formatReasoningEvent(nextReasoning), {
			sessionKey: params.sessionKey,
			contextKey: "mode:reasoning"
		});
	}
}
function formatElevatedUnavailableText(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	const failures = params.failures ?? [];
	if (failures.length > 0) lines.push(`Failing gates: ${failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.entries.*.tools.elevated.*");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`testclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { resolveModelSelectionFromDirective as _, enqueueModeSwitchEvents as a, maybeHandleUnexpectedDirectiveArguments as b, formatElevatedUnavailableText as c, formatInternalVerbosePersistenceDeniedText as d, formatModelSelectionScopeAck as f, withOptions as g, resolveDirectiveTouchedSessionFields as h, canPersistSessionDirectiveDefaults as i, formatInternalExecPersistenceDeniedText as l, rejectSessionDirectiveTransaction as m, acknowledgeIgnoredSessionDirective as n, formatDirectiveAck as o, persistSessionDirectiveSnapshot as p, applySessionDirectiveFields as r, formatElevatedRuntimeHint as s, DIRECTIVE_ACK_MESSAGES as t, formatInternalVerboseCurrentReplyOnlyText as u, createModelSelectionState as v, resolveInvalidExecDirectiveMessage as x, isStaleHeartbeatAutoFallbackOverride as y };
