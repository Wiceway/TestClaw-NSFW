import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-C8MGgrNG.js";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-BEuqweC1.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { k as runWithDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess, w as getActiveDiagnosticTraceContext } from "./diagnostic-events-CzmzgdMI.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-cXJW6Bip.js";
import { M as listSessionEntriesReadOnly, x as withSessionEntryReadOnlyScope } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-Dw0_36rK.js";
import "./session-accessor-DMf92PxK.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Ii as validateSessionsResolveParams, Ri as validateSessionsSearchParams, Vi as validateSessionsStorageParams, ji as validateSessionsPreviewParams, li as validateSessionsDescribeParams, ni as validateSessionsCleanupParams, wi as validateSessionsListParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as resolveStoredSessionKeyForAgentStore, i as resolveSessionStoreKey, n as resolveSessionStoreAgentId } from "./session-store-key-DRl7Rrsc.js";
import { c as resolveExistingAgentSessionStoreTargetsSync, d as isConfiguredSessionStoreAgentId } from "./targets-BxNVBaMw.js";
import "./sessions-4kX-llHk.js";
import { n as runSessionsCleanup, o as serializeSessionCleanupResult } from "./cleanup-service-6dhbxTI6.js";
import { r as hasOperatorBoundary } from "./operator-role-policy-gPgbkoHA.js";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.js";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.js";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.js";
import { n as withReadySessionRows } from "./session-row-prepared-read-x3FXwbu8.js";
import { E as gatewayClientSessionCreator, _ as resolveSessionSharingTarget, c as canAccessIncognitoSession, f as isGatewayAdmin, h as prepareSessionSharingTargets, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-rVme8bnl.js";
import { a as filterSessionEntries, n as listProjectedSessions, r as prepareProjectedSessionList } from "./session-utils-list-DJslse42.js";
import { E as createSessionListEntryFilter } from "./session-sharing-xa1VG8U2.js";
import { i as prepareProjectedSessionPresentation } from "./session-list-read-result-B6v7cJRo.js";
import "./session-utils-DyRtmfj4.js";
import { t as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-D3eaTHpA.js";
import { n as searchSessionTranscripts } from "./session-transcript-search-rJkkIME1.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-DRH4STOa.js";
import { t as getSessionColdStorageStatus } from "./session-cold-storage-CUhDSIaX.js";
import { r as emitSessionsChanged } from "./session-change-event-CmKIAN5R.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { n as requestGatewaySessionColdStorageMaintenance, t as getSessionColdStorageMaintenanceStatus } from "./session-cold-storage-maintenance-CiWpiHTB.js";
import { t as readSessionPreviewItemsFromTranscriptAsync } from "./session-transcript-preview-B45F5ZfX.js";
import { d as sessionLog, s as requireSessionKey } from "./sessions-shared-C5bHh15Q.js";
import { isMainThread, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/server-methods/sessions-list-diagnostics.ts
const sessionListDiagnostics = channel("testclaw.session.list");
function startSessionListDiagnostics(respond, operation) {
	const logEnabled = areDiagnosticsEnabledForProcess() && sessionLog.isEnabled("warn");
	if (!logEnabled && !sessionListDiagnostics.hasSubscribers) return;
	let checkpoint = performance.now();
	const startedAt = checkpoint;
	const timing = createStageTimingTracker(() => checkpoint);
	const trace = getActiveDiagnosticTraceContext();
	let phase = "setup";
	const projection = {
		prepareSyncMs: 0,
		rowSyncMs: 0,
		yieldWaitMs: 0,
		yieldCount: 0,
		selectedRowCount: 0,
		dirtyRowCount: 0,
		materializedRowCount: 0,
		reusedRowCount: 0
	};
	let responseOutcome = "none";
	let cpuMetrics = {};
	const startSyncCpu = () => {
		if (!cpuMetrics) return;
		try {
			return process.threadCpuUsage();
		} catch {
			cpuMetrics = void 0;
			return;
		}
	};
	const finishSyncCpu = (metric, started) => {
		if (!started || !cpuMetrics) return;
		try {
			const used = process.threadCpuUsage(started);
			cpuMetrics[metric] = (cpuMetrics[metric] ?? 0) + (used.user + used.system) / 1e3;
		} catch {
			cpuMetrics = void 0;
		}
	};
	const mark = (next) => {
		checkpoint = performance.now();
		timing.mark(phase);
		phase = next;
	};
	return {
		trace,
		mark,
		startSyncCpu,
		finishSyncCpu,
		get projection() {
			return projection;
		},
		respond: ((...args) => {
			mark("response");
			responseOutcome = args[0] ? "ok" : "error";
			const responseCpu = startSyncCpu();
			try {
				return respond(...args);
			} catch (error) {
				responseOutcome = "threw";
				throw error;
			} finally {
				finishSyncCpu("responseThreadCpuMs", responseCpu);
				mark("handlerExit");
			}
		}),
		finish(handlerOutcome) {
			mark("handlerExit");
			const handlerElapsedMs = checkpoint - startedAt;
			const shouldLog = logEnabled && handlerElapsedMs >= 1e3 && areDiagnosticsEnabledForProcess();
			if (!shouldLog && !sessionListDiagnostics.hasSubscribers) return;
			try {
				const phaseDurationsMs = {};
				for (const stage of timing.snapshot().stages) phaseDurationsMs[stage.name] = (phaseDurationsMs[stage.name] ?? 0) + stage.durationMs;
				const fields = {
					operation,
					pid: process.pid,
					threadId,
					isMainThread,
					handlerElapsedMs: Math.round(handlerElapsedMs),
					phaseDurationsMs,
					...cpuMetrics,
					...projection ? Object.fromEntries(Object.entries(projection).map(([key, value]) => [key, Math.round(value)])) : {},
					handlerOutcome,
					responseOutcome
				};
				if (sessionListDiagnostics.hasSubscribers) sessionListDiagnostics.publish(fields);
				if (shouldLog) runWithDiagnosticTraceContext(trace, () => sessionLog.warn("slow session list", { ...fields }));
			} catch {}
		}
	};
}
function withSessionListDiagnostics(handler) {
	return async (args) => {
		const diagnostics = startSessionListDiagnostics(args.respond, args.req.method === "sessions.subscribe" ? "sessions.subscribe" : "sessions.list");
		let outcome = "returned";
		try {
			await handler(diagnostics ? {
				...args,
				respond: diagnostics.respond
			} : args, diagnostics);
		} catch (error) {
			outcome = "threw";
			throw error;
		} finally {
			diagnostics?.finish(outcome);
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-maintenance.ts
const sessionMaintenanceHandlers = {
	"sessions.storage.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsStorageParams, "sessions.storage.status", respond)) return;
		try {
			respond(true, {
				agents: await getSessionColdStorageStatus(context.getRuntimeConfig()),
				maintenance: getSessionColdStorageMaintenanceStatus(context.getRuntimeConfig)
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		}
	},
	"sessions.storage.run": async ({ params, respond, context, sessionMutationAuthorization, sessionMutationCommitGuard, signal, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validateSessionsStorageParams, "sessions.storage.run", respond)) return;
		try {
			const agents = await getSessionColdStorageStatus(context.getRuntimeConfig());
			signal?.throwIfAborted();
			sessionMutationCommitGuard?.();
			sessionMutationAuthorization?.assertCurrent();
			if (hasCurrentClientAuthority?.() === false) throw new Error("Transcript maintenance requester is no longer authorized");
			requestGatewaySessionColdStorageMaintenance(context.getRuntimeConfig);
			respond(true, {
				agents,
				maintenance: getSessionColdStorageMaintenanceStatus(context.getRuntimeConfig)
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		}
	},
	"sessions.cleanup": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCleanupParams, "sessions.cleanup", respond)) return;
		try {
			const { mode, appliedSummaries, failure } = await runSessionsCleanup({
				cfg: context.getRuntimeConfig(),
				opts: {
					agent: params.agent,
					allAgents: params.allAgents,
					enforce: params.enforce,
					activeKey: params.activeKey,
					fixMissing: params.fixMissing,
					fixDmScope: params.fixDmScope
				}
			});
			const result = serializeSessionCleanupResult({
				mode,
				dryRun: false,
				summaries: appliedSummaries,
				failure
			});
			if (failure) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, failure.message, { details: result }));
			else respond(true, result, void 0);
			for (const summary of appliedSummaries) {
				emitSessionsChanged(context, {
					reason: "cleanup",
					sessionKey: void 0
				});
				if (summary.wouldMutate) context.logGateway.debug(`sessions.cleanup applied ${summary.storePath}: ${summary.beforeCount} -> ${summary.afterCount}`);
			}
			if (failure?.lifecycleCommitted) emitSessionsChanged(context, {
				reason: "cleanup",
				sessionKey: void 0
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		}
	}
};
//#endregion
//#region src/gateway/server-methods/sessions-read-by-key.ts
const sessionByKeyReadHandlers = {
	"sessions.describe": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsDescribeParams, "sessions.describe", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		while (true) {
			const prepared = await projection.withPreparedExactRows((cfg) => {
				const agent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
				const denied = authorizeIncognitoSessionTarget({
					client: client ?? null,
					sessionKey: key,
					target: null
				});
				return agent.ok && !denied ? [{
					key,
					agentId: agent.agentId
				}] : [];
			}, (read) => {
				const requestedAgent = resolveRequestedSessionAgentId(read.state.cfg, key, params.agentId);
				if (!requestedAgent.ok) {
					respond(false, void 0, requestedAgent.error);
					return;
				}
				const query = {
					key,
					agentId: requestedAgent.agentId
				};
				const presentation = prepareProjectedSessionPresentation(read, client);
				const denied = presentation.authorizeDescription(query);
				if (denied) {
					respond(false, void 0, denied);
					return;
				}
				const record = read.describe(query);
				if (!record || presentation.sharing.sessionCap !== void 0 && presentation.sharing.entryFilter?.(record.key, record.entry) === false) {
					respond(true, { session: null });
					return;
				}
				respond(true, { session: presentation.present(record, params) });
			});
			if (prepared.kind === "complete") return;
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DPanEjQ8.js");
			await certifySessionCanonicalValidationPending(prepared.database);
		}
	},
	"sessions.get": async ({ params, respond, context, client, signal }) => {
		const p = params;
		const key = requireSessionKey(p.key ?? p.sessionKey, respond);
		if (!key) return;
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, Math.floor(p.limit)) : 200;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		const requestedAgent = () => resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, normalizeOptionalString(p.agentId));
		const queries = () => {
			const requested = requestedAgent();
			return requested.ok ? [{
				key,
				agentId: requested.agentId
			}] : [];
		};
		const selected = await withReadySessionRows(projection, queries, (read) => {
			const requested = requestedAgent();
			if (!requested.ok) {
				respond(false, void 0, requested.error);
				return;
			}
			const record = read.describe({
				key,
				agentId: requested.agentId
			});
			const cfg = context.getRuntimeConfig();
			const boundaryFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
				client,
				cfg
			}) : void 0;
			if (!record?.entry.sessionId || boundaryFilter?.(record.key, record.entry) === false) {
				respond(true, { messages: [] }, void 0);
				return;
			}
			return record;
		});
		if (!selected) return;
		const target = {
			agentId: selected.agentId,
			sessionEntry: { sessionId: selected.entry.sessionId },
			sessionId: selected.entry.sessionId,
			sessionKey: selected.key,
			storePath: selected.storeTarget.storePath
		};
		const limits = {
			maxMessages: limit,
			maxLines: limit * 20 + 20,
			allowResetArchiveFallback: true
		};
		const messages = selected.entry.incognito || isIncognitoSessionKey(selected.key) ? (await readRecentSessionMessagesWithStatsAsync(target, limits)).messages : await (await import("./session-history-worker-runtime-DN4pw2Js.js")).readSessionHistoryPageInWorker({
			kind: "recent",
			params: {
				target,
				...limits
			}
		}, signal);
		await withReadySessionRows(projection, queries, (read) => {
			const requested = requestedAgent();
			const current = requested.ok ? read.describe({
				key,
				agentId: requested.agentId
			}, selected) : void 0;
			const cfg = context.getRuntimeConfig();
			const boundaryFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
				client,
				cfg
			}) : void 0;
			if (!current || current.agentId !== selected.agentId || current.key !== selected.key || current.storeTarget.storePath !== selected.storeTarget.storePath || current.entry.sessionId !== target.sessionId || boundaryFilter?.(current.key, current.entry) === false) {
				respond(true, { messages: [] }, void 0);
				return;
			}
			respond(true, { messages }, void 0);
		});
	}
};
//#endregion
//#region src/gateway/server-methods/sessions-search-projected.ts
/** Search all selected resident metadata; only matching rows cross the wire. */
async function searchProjectedSessionTranscripts(params) {
	const projection = getSessionRowProjection(params.context);
	if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
	const select = () => {
		const { prepared, presentation, filters } = prepareProjectedSessionList({
			projection,
			opts: params.scope,
			context: params.context,
			client: params.client,
			now: Date.now()
		});
		const { entries } = withAgentRosterFactsBatch(prepared.cfg, () => runSynchronousWork(filterSessionEntries(filters)));
		const stores = /* @__PURE__ */ new Map();
		for (const [key] of entries) {
			const row = prepared.getTarget(key);
			if (!row) continue;
			const store = stores.get(row.storeTarget.storePath) ?? {
				target: row.storeTarget,
				rows: /* @__PURE__ */ new Map()
			};
			store.rows.set(row.key, row);
			stores.set(row.storeTarget.storePath, store);
		}
		return {
			stores,
			presentation
		};
	};
	const limit = params.limit ?? 10;
	for (let attempt = 0; attempt < 2; attempt++) {
		do
			await projection.ensureMaterialized();
		while (projection.needsMaterialization);
		const selected = select();
		const pages = await Promise.all([...selected.stores].map(async ([path, { target, rows }]) => ({
			path,
			page: await searchSessionTranscripts({
				...target,
				sessionKeys: [...rows.keys()],
				query: params.query,
				limit
			}, {
				agentId: target.agentId,
				path: target.storePath
			})
		})));
		if (getSessionRowProjection(params.context) !== projection) throw new Error("Session search owner changed while reading; retry the request");
		if (projection.needsMaterialization) continue;
		const current = select();
		if (selected.stores.size !== current.stores.size || [...selected.stores].some(([path, store]) => {
			const next = current.stores.get(path);
			return !next || store.target.agentId !== next.target.agentId || store.rows.size !== next.rows.size || [...store.rows].some(([key, row]) => next.rows.get(key)?.generation !== row.generation);
		})) continue;
		const hits = pages.flatMap(({ path, page }) => page.hits.flatMap((hit) => {
			const row = current.stores.get(path)?.rows.get(hit.sessionKey);
			return row ? [{
				hit,
				row
			}] : [];
		})).toSorted((left, right) => right.hit.score - left.hit.score || right.hit.timestamp - left.hit.timestamp || left.hit.messageId.localeCompare(right.hit.messageId));
		const matches = hits.slice(0, limit);
		const rows = new Set(matches.map((match) => match.row));
		projection.setArchivePageSize(rows.size);
		const sessions = [...rows].flatMap((target) => {
			const record = projection.describe({
				...target,
				storePath: target.storeTarget.storePath
			});
			const row = record && current.presentation.present(record);
			return row ? [row] : [];
		});
		const archivedTranscriptsExcluded = pages.reduce((count, { page }) => count + (page.archivedTranscriptsExcluded ?? 0), 0);
		params.onResult({
			results: matches.map((match) => match.hit),
			sessions,
			...pages.some(({ page }) => page.indexing) ? { indexing: true } : {},
			...archivedTranscriptsExcluded ? { archivedTranscriptsExcluded } : {},
			...hits.length > limit || pages.some(({ page }) => page.truncated) ? { truncated: true } : {}
		});
		return;
	}
	throw new Error("Session search scope changed while reading; retry the request");
}
//#endregion
//#region src/gateway/server-methods/sessions-search-scope.ts
function resolveSessionSearchScope(cfg, params) {
	const normalizedRequest = params.agentId === void 0 ? null : normalizeAgentIdStrict(params.agentId);
	if (normalizedRequest && !normalizedRequest.ok) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${params.agentId}"`)
	};
	const requestedAgentId = normalizedRequest?.value;
	const resolvedSessionKeys = params.sessionKeys ? [] : void 0;
	for (const sessionKey of params.sessionKeys ?? []) {
		const requestedAgent = requestedAgentId && !isConfiguredSessionStoreAgentId(cfg, requestedAgentId) && resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey).kind === "none" ? {
			ok: true,
			agentId: requestedAgentId
		} : resolveRequestedSessionAgentId(cfg, sessionKey, requestedAgentId);
		if (!requestedAgent.ok) return {
			ok: false,
			error: requestedAgent.error
		};
		resolvedSessionKeys?.push({
			sessionKey: requestedAgent.agentId ? resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId: requestedAgent.agentId,
				sessionKey
			}) : resolveSessionStoreKey({
				cfg,
				sessionKey
			}),
			agentId: requestedAgent.agentId
		});
	}
	const sessionKeys = resolvedSessionKeys?.map((resolved) => resolved.sessionKey);
	const agentIds = new Set(resolvedSessionKeys?.map((resolved) => resolved.agentId ? resolved.agentId : resolveSessionStoreAgentId(cfg, resolved.sessionKey)));
	if (agentIds.size > 1 || requestedAgentId && [...agentIds].some((agentId) => agentId !== requestedAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.search supports one agent per call")
	};
	let agentId = requestedAgentId ?? agentIds.values().next().value;
	if (!agentId) {
		const fallbackAgent = resolveRequestedSessionAgentId(cfg, "main");
		if (!fallbackAgent.ok) return {
			ok: false,
			error: fallbackAgent.error
		};
		agentId = fallbackAgent.agentId;
	}
	return {
		ok: true,
		agentId,
		configured: isConfiguredSessionStoreAgentId(cfg, agentId),
		requestedAgentId,
		sessionKeys
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-read.ts
const sessionReadHandlers = {
	"sessions.search": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsSearchParams, "sessions.search", respond)) return;
		const query = params.query.trim();
		if (!query) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must not be empty"));
			return;
		}
		if (params.scope !== void 0) {
			try {
				await searchProjectedSessionTranscripts({
					query,
					limit: params.limit,
					scope: params.scope,
					context,
					client: client ?? null,
					onResult: (result) => respond(true, result)
				});
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
			return;
		}
		const prepareSearch = () => {
			const cfg = context.getRuntimeConfig();
			const scope = resolveSessionSearchScope(cfg, params);
			if (!scope.ok) {
				respond(false, void 0, scope.error);
				return;
			}
			const { agentId, configured, requestedAgentId, sessionKeys } = scope;
			const restrictIncognito = Boolean(gatewayClientSessionCreator(client)) && !isGatewayAdmin(client);
			const roleVisibilityFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
				client,
				cfg
			}) : void 0;
			const restrictVisibility = restrictIncognito || Boolean(roleVisibilityFilter);
			const targetDiscoveryCache = /* @__PURE__ */ new Map();
			const canSearchSessionKey = (sessionKey, prepared) => {
				if (isIncognitoSessionKey(sessionKey) && !canAccessIncognitoSession({
					cfg,
					client: client ?? null,
					sessionKey,
					agentId
				})) return false;
				if (!roleVisibilityFilter) return true;
				if (prepared && !prepared.ok) throw prepared.error;
				const target = prepared ? prepared.value : resolveSessionSharingTarget({
					cfg,
					sessionKey,
					agentId,
					targetDiscoveryCache
				});
				return Boolean(target && roleVisibilityFilter(target.storeKey, target.entry));
			};
			if (requestedAgentId && !params.sessionKeys && configured) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId requires sessionKeys"));
				return;
			}
			const scopedSessionKeys = (configured ? sessionKeys : sessionKeys?.filter((sessionKey) => {
				return (requestedAgentId && (sessionKey === "global" || sessionKey === "unknown") ? requestedAgentId : resolveSessionStoreAgentId(cfg, sessionKey)) === agentId;
			}))?.filter((sessionKey) => canSearchSessionKey(sessionKey));
			const searchTargets = configured ? [{
				agentId,
				storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
			}] : resolveExistingAgentSessionStoreTargetsSync(cfg, agentId);
			if (!configured && (searchTargets.length === 0 || scopedSessionKeys?.length === 0)) {
				respond(true, { results: [] }, void 0);
				return;
			}
			return searchTargets.flatMap((target) => {
				const targetSessionKeys = scopedSessionKeys ?? (restrictVisibility ? withSessionEntryReadOnlyScope(target, () => {
					const keys = listSessionEntriesReadOnly({
						agentId: target.agentId,
						storePath: target.storePath,
						projection: "list",
						clone: false
					}).map((entry) => entry.sessionKey).filter((sessionKey) => {
						const parsed = parseAgentSessionKey(sessionKey);
						return !parsed || normalizeAgentId(parsed.agentId) === agentId;
					});
					const prepared = roleVisibilityFilter ? prepareSessionSharingTargets({
						cfg,
						targets: keys.filter((sessionKey) => !isIncognitoSessionKey(sessionKey)).map((sessionKey) => ({
							sessionKey,
							agentId
						}))
					}) : [];
					let ordinal = 0;
					return keys.filter((sessionKey) => {
						const sharing = roleVisibilityFilter && !isIncognitoSessionKey(sessionKey) ? prepared[ordinal++] : void 0;
						return canSearchSessionKey(sessionKey, sharing);
					});
				}) : void 0);
				if (targetSessionKeys?.length === 0) return [];
				return [{
					...target,
					query,
					limit: configured ? params.limit : 25,
					...targetSessionKeys ? { sessionKeys: targetSessionKeys } : {}
				}];
			});
		};
		try {
			for (let attempt = 0; attempt < 2; attempt++) {
				const requests = prepareSearch();
				if (!requests) return;
				const targetResults = await Promise.all(requests.map((request) => searchSessionTranscripts(request)));
				const current = prepareSearch();
				if (!current) return;
				if (JSON.stringify(current) !== JSON.stringify(requests)) continue;
				const archivedTranscriptsExcluded = targetResults.reduce((count, result) => count + (result.archivedTranscriptsExcluded ?? 0), 0);
				const limit = params.limit ?? 10;
				const sortedHits = targetResults.flatMap((result) => result.hits).toSorted((left, right) => right.score - left.score || right.timestamp - left.timestamp || left.messageId.localeCompare(right.messageId));
				const seenHits = /* @__PURE__ */ new Set();
				const hits = sortedHits.filter((hit) => {
					const identity = `${hit.sessionKey}\u0000${hit.sessionId}\u0000${hit.messageId}`;
					if (seenHits.has(identity)) return false;
					seenHits.add(identity);
					return true;
				});
				respond(true, {
					results: hits.slice(0, limit),
					...archivedTranscriptsExcluded ? { archivedTranscriptsExcluded } : {},
					...targetResults.some((result) => result.indexing) ? { indexing: true } : {},
					...targetResults.some((result) => result.truncated) || hits.length > limit ? { truncated: true } : {}
				});
				return;
			}
			throw new Error("Session search scope changed while reading; retry the request");
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"sessions.list": withSessionListDiagnostics(async (args, diagnostics) => {
		const { params, respond, client, context } = args;
		if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respond)) return;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		await listProjectedSessions({
			projection,
			opts: params,
			context,
			client,
			diagnostics,
			onResult: (result) => respond(true, result)
		});
	}),
	"sessions.preview": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsPreviewParams, "sessions.preview", respond)) return;
		const keys = (Array.isArray(params.keys) ? params.keys : []).map((key) => normalizeOptionalString(key ?? "")).filter((key) => Boolean(key)).slice(0, 64);
		const limit = params.limit ?? 12;
		const maxChars = params.maxChars ?? 240;
		if (keys.length === 0) {
			respond(true, {
				ts: Date.now(),
				previews: []
			}, void 0);
			return;
		}
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		const withPreviewRows = async (requestedKeys, consume) => {
			while (true) {
				const prepared = await projection.withPreparedExactRows((cfg) => requestedKeys.flatMap((key) => {
					const agent = resolveRequestedSessionAgentId(cfg, key);
					return agent.ok ? [{
						key,
						agentId: agent.agentId
					}] : [];
				}), consume);
				if (prepared.kind === "complete") return prepared.value;
				const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DPanEjQ8.js");
				await certifySessionCanonicalValidationPending(prepared.database);
			}
		};
		const previews = [];
		const buffered = [];
		for (const key of keys) {
			if (previews.length > 0) await setImmediate();
			const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			const preview = {
				key,
				status: "missing",
				items: []
			};
			previews.push(preview);
			try {
				const record = await withPreviewRows([key], (read) => {
					const cfg = context.getRuntimeConfig();
					const currentAgent = resolveRequestedSessionAgentId(cfg, key);
					if (!currentAgent.ok) return;
					const current = read.describe({
						key,
						agentId: currentAgent.agentId
					});
					const visibilityFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
						client,
						cfg
					}) : void 0;
					return current?.entry.sessionId && visibilityFilter?.(current.key, current.entry) !== false ? current : void 0;
				});
				if (!record) continue;
				buffered.push({
					preview,
					record,
					generation: record.generation,
					sessionId: record.entry.sessionId,
					lifecycleRevision: record.entry.lifecycleRevision
				});
				preview.items = await readSessionPreviewItemsFromTranscriptAsync({
					agentId: record.agentId,
					sessionEntry: record.entry,
					sessionId: record.entry.sessionId,
					sessionKey: record.key,
					storePath: record.storeTarget.storePath
				}, limit, maxChars);
				preview.status = preview.items.length > 0 ? "ok" : "empty";
			} catch (error) {
				preview.status = error instanceof SessionTranscriptColdError ? "cold" : "error";
			}
		}
		await withPreviewRows(buffered.map(({ preview }) => preview.key), (read) => {
			const cfg = context.getRuntimeConfig();
			const visibilityFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
				client,
				cfg
			}) : void 0;
			for (const previous of buffered) {
				const agent = resolveRequestedSessionAgentId(cfg, previous.preview.key);
				const current = agent.ok ? read.describe({
					key: previous.preview.key,
					agentId: agent.agentId
				}, previous.record) : void 0;
				if (!current || current.agentId !== previous.record.agentId || current.key !== previous.record.key || current.storeTarget.storePath !== previous.record.storeTarget.storePath || current.generation !== previous.generation || current.entry.sessionId !== previous.sessionId || current.entry.lifecycleRevision !== previous.lifecycleRevision || visibilityFilter?.(current.key, current.entry) === false) {
					previous.preview.status = "missing";
					previous.preview.items = [];
				}
			}
			respond(true, {
				ts: Date.now(),
				previews
			}, void 0);
		});
	},
	"sessions.resolve": ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsResolveParams, "sessions.resolve", respond)) return;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		const resolved = resolveSessionKeyFromResolveParams({
			projection,
			client,
			p: params
		});
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		if ("missing" in resolved) {
			respond(true, { ok: false }, void 0);
			return;
		}
		if ("ambiguous" in resolved) {
			respond(true, {
				ok: false,
				candidates: resolved.candidates
			}, void 0);
			return;
		}
		respond(true, resolved, void 0);
	},
	...sessionByKeyReadHandlers,
	...sessionMaintenanceHandlers
};
const sessionsListHandler = sessionReadHandlers["sessions.list"];
//#endregion
export { sessionsListHandler as n, sessionReadHandlers as t };
