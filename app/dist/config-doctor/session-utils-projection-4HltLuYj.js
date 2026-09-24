import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as asNonNegativeFiniteNumber, l as asPositiveFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { a as captureRuntimeStateEnvironment } from "./paths-DeOFr7iP.js";
import { l as resolveSessionStorePathCore, r as resolveConcreteSessionStorePath } from "./paths-ViQaz2td.js";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-_Hi_clcB.js";
import { j as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-DbPiDevk.js";
import { n as isTerminalSessionStatus } from "./types-BhbLC9G7.js";
import { s as shouldKeepSubagentRunChildLink } from "./subagent-run-liveness-D6t-uqkj.js";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-DD46xgBs.js";
import { r as readAcpSessionMeta } from "./session-meta-8OGO7A4a.js";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-BTYyxviS.js";
import "./sessions-4kX-llHk.js";
import { o as resolveModelCostConfig, t as estimateAggregateUsageCost } from "./usage-format-Bkf9MeNp.js";
import { t as resolveSessionModelIdentityRef } from "./session-model-ref-CFOEMtHG.js";
import { t as deriveGoalSessionTitle } from "./derive-goal-session-title-Cl-2aSma.js";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "./agent-runtime-metadata-DQ-tvmad.js";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-DYz0eh2W.js";
import { n as readRecentSessionUsageFromTranscript } from "./session-transcript-usage-DDJrpEQY.js";
import { r as resolveWorkerPlacementModelRuntime } from "./placement-session-runtime-DFQYnjUZ.js";
//#region src/gateway/session-utils-contracts.ts
function createSessionRowModelCacheKey(provider, model) {
	return `${normalizeLowercaseStringOrEmpty(provider)}\0${normalizeOptionalString(model) ?? ""}`;
}
//#endregion
//#region src/gateway/session-utils-core.ts
function deriveSessionTitle(entry, firstUserMessage, externalDisplayName) {
	if (!entry) return;
	const label = normalizeOptionalString(entry.label);
	if (label) return label;
	const displayName = normalizeOptionalString(externalDisplayName) ?? normalizeOptionalString(entry.displayName);
	if (displayName) return displayName;
	const subject = normalizeOptionalString(entry.subject);
	if (subject) return subject;
	const goalTitle = deriveGoalSessionTitle(firstUserMessage);
	if (goalTitle) return goalTitle;
}
function prepareSessionTitleRead(entry, displayName, opts) {
	if (!entry?.sessionId || !(opts.includeDerivedTitles || opts.includeLastMessage)) return;
	const derivedTitle = opts.includeDerivedTitles ? deriveSessionTitle(entry, void 0, displayName) : void 0;
	return {
		derivedTitle,
		needsTranscript: opts.includeLastMessage || !derivedTitle
	};
}
function resolvePositiveNumber(value) {
	return asPositiveFiniteNumber(value);
}
function resolveModelCostConfigCached(provider, model, cfg, rowContext) {
	if (!rowContext) return resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	const key = createSessionRowModelCacheKey(provider, model);
	if (rowContext.modelCostConfigByModelRef.has(key)) return rowContext.modelCostConfigByModelRef.get(key);
	const value = resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	rowContext.modelCostConfigByModelRef.set(key, value);
	return value;
}
function resolveEstimatedSessionCostUsd(params) {
	const explicitCostUsd = asNonNegativeFiniteNumber(params.explicitCostUsd ?? params.entry?.estimatedCostUsd);
	if (explicitCostUsd !== void 0) return explicitCostUsd;
	const input = resolvePositiveNumber(params.entry?.inputTokens);
	const output = resolvePositiveNumber(params.entry?.outputTokens);
	const cacheRead = resolvePositiveNumber(params.entry?.cacheRead);
	const cacheWrite = resolvePositiveNumber(params.entry?.cacheWrite);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	const cost = resolveModelCostConfigCached(params.provider, params.model, params.cfg, params.rowContext);
	if (!cost) return;
	const estimated = estimateAggregateUsageCost({
		usage: {
			...input !== void 0 ? { input } : {},
			...output !== void 0 ? { output } : {},
			...cacheRead !== void 0 ? { cacheRead } : {},
			...cacheWrite !== void 0 ? { cacheWrite } : {}
		},
		cost
	});
	return asNonNegativeFiniteNumber(estimated);
}
const STALE_STORE_ONLY_CHILD_LINK_MS = 36e5;
function isFinitePositiveTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function shouldKeepStoreOnlyChildLink(entry, now) {
	if (isTerminalSessionStatus(entry.status) || isFinitePositiveTimestamp(entry.endedAt)) {
		const endedAt = isFinitePositiveTimestamp(entry.endedAt) ? entry.endedAt : entry.updatedAt;
		return isFinitePositiveTimestamp(endedAt) && now - endedAt <= 18e5;
	}
	return entry.status === "running" || isFinitePositiveTimestamp(entry.startedAt) || isFinitePositiveTimestamp(entry.updatedAt) && now - entry.updatedAt <= STALE_STORE_ONLY_CHILD_LINK_MS;
}
/** Resolve navigation owners from canonical existence and current run liveness. */
function resolveSessionChildOwners(params) {
	const { key, entry, now, subagentRuns } = params;
	const latest = subagentRuns.getDisplaySubagentRun(key);
	if (!(params.hasActiveRun || (latest ? shouldKeepSubagentRunChildLink(latest, {
		activeDescendants: subagentRuns.countActiveDescendantRuns(key),
		now
	}) : shouldKeepStoreOnlyChildLink(entry, now)))) return [];
	const controller = latest ? normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey) : normalizeOptionalString(entry.spawnedBy);
	const parent = normalizeOptionalString(entry.parentSessionKey);
	return [.../* @__PURE__ */ new Set([controller, parent])].filter((owner) => owner !== void 0 && owner !== key);
}
/** Index only canonical children; retained run results cannot create session links. */
function* buildStoreChildSessionLinksWork(params, shouldYield) {
	const children = /* @__PURE__ */ new Map();
	if (params.keys.length === 0) return children;
	const parents = new Set(params.keys);
	for (const key of Object.keys(params.store)) {
		if (shouldYield?.()) yield;
		const entry = params.store[key];
		if (!entry) continue;
		const runs = params.subagentRunsByChildSessionKey.get(key.trim()) ?? [];
		const owners = /* @__PURE__ */ new Set([
			...runs.map((run) => normalizeOptionalString(run.controllerSessionKey) || normalizeOptionalString(run.requesterSessionKey)),
			normalizeOptionalString(entry.spawnedBy),
			normalizeOptionalString(entry.parentSessionKey)
		]);
		for (const owner of owners) if (owner && owner !== key && parents.has(owner)) {
			const siblings = children.get(owner) ?? [];
			siblings.push({
				key,
				entry
			});
			children.set(owner, siblings);
		}
	}
	return children;
}
//#endregion
//#region src/gateway/session-utils-projection.ts
function buildSessionListRowMetadataContext(params) {
	const subagentRuns = params.subagentRuns ?? buildSubagentSessionListReadIndex(params.now, params.sessionKeys);
	const projectedAgentRuns = params.projectedAgentRuns ?? buildProjectedAgentRunIndex();
	const catalogEntries = /* @__PURE__ */ new WeakMap();
	const runtimeEntries = /* @__PURE__ */ new WeakMap();
	return {
		subagentRuns,
		projectedAgentRuns,
		projectedSubagentActivity: buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns),
		subagentRunsByChildSessionKey: subagentRuns.runsByChildSessionKey,
		configuredDefaultModelByAgent: /* @__PURE__ */ new Map(),
		thinkingFactsByModelRef: /* @__PURE__ */ new Map(),
		findModelCatalogEntry: (catalog, query) => {
			let entries = catalogEntries.get(catalog);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				catalogEntries.set(catalog, entries);
			}
			const key = createSessionRowModelCacheKey(query.provider, query.modelId);
			if (!entries.has(key)) entries.set(key, findModelCatalogEntry(catalog, query));
			return entries.get(key);
		},
		selectModelCatalogRuntimeEntry: (selection) => {
			let entries = runtimeEntries.get(selection.routeVariants);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				runtimeEntries.set(selection.routeVariants, entries);
			}
			const key = `${selection.runtimeId}\0${createSessionRowModelCacheKey(selection.entry.provider, selection.entry.id)}`;
			let selected = entries.get(key);
			if (!selected) {
				selected = selectModelCatalogRuntimeEntry(selection);
				entries.set(key, selected);
			}
			return selected;
		},
		displayModelIdentityByKey: /* @__PURE__ */ new Map(),
		modelCostConfigByModelRef: /* @__PURE__ */ new Map(),
		userProfileIdentityById: params.userProfileIdentityById ?? /* @__PURE__ */ new Map()
	};
}
/** Prepare follow-up ancestor membership with the indexes, outside per-row presentation. */
function buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns) {
	const active = /* @__PURE__ */ new Set();
	for (const key of iterateProjectedAgentRunSessionKeys(projectedAgentRuns)) {
		const run = subagentRuns.latestRunsByChildSessionKey.get(key);
		if (!run) continue;
		let requester = run.requesterSessionKey;
		while (requester && !active.has(requester)) {
			active.add(requester);
			requester = subagentRuns.latestRunsByChildSessionKey.get(requester)?.requesterSessionKey ?? "";
		}
	}
	return active;
}
function resolveTranscriptUsageFallbacks(params) {
	const { entry, agentId } = params;
	const fallbacks = /* @__PURE__ */ new Map();
	let snapshot;
	for (const fallbackModelRef of new Set(params.fallbackModelRefs)) {
		fallbacks.set(fallbackModelRef, null);
		if (!entry?.sessionId) continue;
		const resolvedModel = resolveSessionModelIdentityRef(params.cfg, entry, agentId, fallbackModelRef, { allowPluginNormalization: params.allowPluginNormalization });
		if (params.freshTotalTokens !== void 0 && resolveEstimatedSessionCostUsd({
			cfg: params.cfg,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			entry,
			rowContext: params.rowContext
		}) !== void 0) continue;
		if (snapshot === void 0) {
			const storePath = resolveConcreteSessionStorePath(params.storePath) ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
			try {
				snapshot = readRecentSessionUsageFromTranscript({
					agentId: params.storeAgentId ?? agentId,
					sessionEntry: entry,
					sessionId: entry.sessionId,
					sessionKey: params.key,
					storePath
				}, typeof params.maxTranscriptBytes === "number" ? params.maxTranscriptBytes : 262144);
			} catch {
				snapshot = null;
			}
		}
		if (snapshot) {
			const estimatedCostUsd = resolveEstimatedSessionCostUsd({
				cfg: params.cfg,
				provider: snapshot.modelProvider ?? resolvedModel.provider,
				model: snapshot.model ?? resolvedModel.model,
				explicitCostUsd: snapshot.costUsd,
				entry: snapshot,
				rowContext: params.rowContext
			});
			fallbacks.set(fallbackModelRef, {
				totalTokens: resolvePositiveNumber(snapshot.totalTokens),
				totalTokensFresh: snapshot.totalTokensFresh === true,
				estimatedCostUsd
			});
		}
	}
	return fallbacks;
}
/** Runtime ownership is independent of whether the model itself can change. */
function resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta) {
	return entry?.modelSelectionLocked === true || acpMeta != null;
}
function resolveGatewaySessionRuntimeProjection(params) {
	const { cfg, agentId, sessionKey, entry } = params;
	const acpMeta = entry?.acp ?? (params.preparedAcpMeta !== void 0 ? params.preparedAcpMeta ?? void 0 : entry ? readAcpSessionMetaForEntry({
		cfg,
		sessionKey,
		agentId,
		entry
	}) : readAcpSessionMeta({
		sessionKey,
		agentId
	}));
	const agentRuntime = resolveCurrentSessionAgentRuntimeMetadata({
		cfg: params.cfg,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		provider: params.provider,
		model: params.model,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	});
	if (agentRuntime.id === "auto" && entry) agentRuntime.id = resolveWorkerPlacementModelRuntime({
		...params,
		entry,
		preparedEnvironment: params.rowContext ? params.rowContext.workerPlacementEnvironment ??= captureRuntimeStateEnvironment() : void 0
	});
	return {
		acpMeta,
		agentRuntime,
		runtimeSelectionLocked: resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta)
	};
}
//#endregion
export { resolveTranscriptUsageFallbacks as a, isFinitePositiveTimestamp as c, resolvePositiveNumber as d, resolveSessionChildOwners as f, resolveGatewaySessionRuntimeSelectionLocked as i, prepareSessionTitleRead as l, buildSessionListRowMetadataContext as n, buildStoreChildSessionLinksWork as o, createSessionRowModelCacheKey as p, resolveGatewaySessionRuntimeProjection as r, deriveSessionTitle as s, buildProjectedSubagentActivity as t, resolveEstimatedSessionCostUsd as u };
