import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as asFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-Botgjsbr.js";
import "./boundary-path-BBHaqzpY.js";
import { a as resolveAgentDir } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { et as isAssistantAgentDatabasePathCurrent } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Bb3_IiBS.js";
import { n as retainAssistantStateWorkerErrorPayload, t as hydrateAssistantStateWorkerError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { C as parseSessionArchiveTimestamp, b as isSessionArchiveArtifactName, f as resolveSessionTranscriptsDirForAgent, k as materializeSessionArchiveForRead, s as resolveSessionFilePathCore, v as isPrimarySessionTranscriptFileName } from "./paths-ViQaz2td.js";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-Cg9RiSzs.js";
import { s as getAssistantAgentDatabaseIfOpen } from "./testclaw-agent-db-Ckg86YCZ.js";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-BYC4PoOZ.js";
import { r as listDurableSqliteTargetPathsForSessionStorePath, s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BANhXeoo.js";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { E as resolveSessionStorePathForScope, l as loadSessionEntryReadOnly, o as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { o as createMemoryTranscriptProjectionSource } from "./session-transcript-reconcile-Oplb6Sva.js";
import { J as readTranscriptStatsBatchFromDatabase, O as loadTranscriptEventsSync, Q as selectVisibleTranscriptEvents } from "./session-accessor.sqlite-transcript-store-BX2GNujg.js";
import "./run-with-concurrency-Dtu208ef.js";
import "./session-accessor-DMf92PxK.js";
import { p as UsageCostWorkerReplyError } from "./session-transcript-worker-resources-DFtewwRd.js";
import { r as withSessionCostUsageWorkerDatabases } from "./session-transcript-worker-runtime-CBtrr-9r.js";
import { c as hasRecordedUsageCost, u as normalizeUsage } from "./usage-C3K3M4jZ.js";
import { t as streamSessionTranscriptLines } from "./transcript-stream-DrcVdtB3.js";
import { t as calculateUsageCost } from "./usage-cost-Va5dwVFW.js";
import "./src-tM8aLYtL.js";
import { c as prepareModelPricingContext, o as resolveModelCostConfig, s as resolveModelCostConfigFingerprint } from "./usage-format-Bkf9MeNp.js";
import { n as isToolCallContentType } from "./tool-content-cVfI1kz1.js";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-DgOC6gaR.js";
import { n as restoreSessionColdTranscript } from "./session-cold-storage-CUhDSIaX.js";
import { a as readSessionCostUsageRollupBodyInDatabase, o as readSessionCostUsageRollupByteRowsInDatabase } from "./session-cost-usage-cache.kernel-ChEWsPR4.js";
import { n as isSessionCostUsageRefreshRunning, r as prepareSessionCostUsageRefreshLock } from "./session-cost-usage-cache.sqlite-DW5fCBah.js";
import fs from "node:fs";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/utils/transcript-tools.ts
const TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["tool_result", "tool_result_error"]);
/** Preserves call occurrences; a top-level legacy name can mirror the first matching block. */
const extractToolCallNames = (message) => {
	const toolName = normalizeOptionalString(message.toolName ?? message.tool_name);
	const names = toolName ? [toolName] : [];
	let unmatchedTopLevelName = toolName;
	const content = message.content;
	if (!Array.isArray(content)) return names;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		if (!isToolCallContentType(normalizeOptionalString(block.type))) continue;
		const name = normalizeOptionalString(block.name);
		if (name && name === unmatchedTopLevelName) unmatchedTopLevelName = void 0;
		else if (name) names.push(name);
	}
	return names;
};
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
const countToolResults = (message) => {
	const content = message.content;
	if (!Array.isArray(content)) return {
		total: 0,
		errors: 0
	};
	let total = 0;
	let errors = 0;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeLowercaseStringOrEmpty(block.type);
		if (!TOOL_RESULT_TYPES.has(type)) continue;
		total += 1;
		if (block.is_error === true) errors += 1;
	}
	return {
		total,
		errors
	};
};
//#endregion
//#region src/infra/session-cost-usage-pricing.ts
const normalizeUsageCostTotalOrigin = (value) => value === "provider-billed" ? value : void 0;
const extractCostBreakdown = (usageRaw) => {
	if (!usageRaw || typeof usageRaw !== "object") return;
	const cost = usageRaw.cost;
	if (!cost) return;
	const total = asFiniteNumber(cost.total);
	if (total === void 0 || total < 0) return;
	return {
		total,
		input: asFiniteNumber(cost.input),
		output: asFiniteNumber(cost.output),
		cacheRead: asFiniteNumber(cost.cacheRead),
		cacheWrite: asFiniteNumber(cost.cacheWrite),
		totalOrigin: normalizeUsageCostTotalOrigin(cost.totalOrigin)
	};
};
const parseTimestamp = (entry) => {
	const message = entry.message;
	const messageTimestamp = asFiniteNumber(message?.timestamp);
	if (messageTimestamp !== void 0) {
		const parsed = new Date(messageTimestamp);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
	const raw = entry.timestamp;
	if (typeof raw === "string") {
		const parsed = new Date(raw);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
};
const parseUsageCostTranscriptRecord = (entry) => {
	const message = entry.message;
	if (!message || typeof message !== "object") return null;
	const roleRaw = message.role;
	const role = roleRaw === "user" || roleRaw === "assistant" ? roleRaw : void 0;
	const isStandaloneToolResult = roleRaw === "tool" || roleRaw === "toolResult";
	if (!role && !isStandaloneToolResult) return null;
	const usageRaw = message.usage ?? entry.usage;
	const usage = usageRaw ? normalizeUsage(usageRaw) ?? void 0 : void 0;
	const provider = (typeof message.provider === "string" ? message.provider : void 0) ?? (typeof entry.provider === "string" ? entry.provider : void 0);
	const model = (typeof message.model === "string" ? message.model : void 0) ?? (typeof entry.model === "string" ? entry.model : void 0);
	const costBreakdown = extractCostBreakdown(usageRaw);
	const stopReason = typeof message.stopReason === "string" ? message.stopReason : void 0;
	const durationMs = asFiniteNumber(message.durationMs ?? entry.durationMs);
	return {
		message,
		role,
		timestamp: parseTimestamp(entry),
		durationMs,
		usage,
		costTotal: costBreakdown?.total,
		costBreakdown,
		provider,
		model,
		stopReason,
		toolNames: isStandaloneToolResult ? [] : extractToolCallNames(message),
		toolResultCounts: isStandaloneToolResult ? {
			total: 1,
			errors: message.isError === true || message.is_error === true ? 1 : 0
		} : countToolResults(message)
	};
};
const computeUsageTokenTotals = (usage) => {
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const componentTotal = input + output + cacheRead + cacheWrite;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		componentTotal,
		totalTokens: usage.total ?? componentTotal
	};
};
function needsUsageCostEstimate(entry) {
	return Boolean(entry?.usage) && !((entry?.costTotal ?? 0) > 0 || hasRecordedUsageCost(entry?.costBreakdown));
}
function applyUsageCostEstimate(entry, resolveCost) {
	const cost = resolveCost({
		provider: entry.provider,
		model: entry.model
	});
	const { totalTokens } = computeUsageTokenTotals(entry.usage);
	if (!cost && totalTokens > 0) {
		entry.costTotal = void 0;
		entry.costBreakdown = void 0;
	} else if (entry.costTotal === void 0 || totalTokens > 0) {
		const estimated = cost ? calculateUsageCost(entry.usage, cost) : void 0;
		entry.costBreakdown = estimated && Number.isFinite(estimated.total) ? estimated : void 0;
		entry.costTotal = entry.costBreakdown?.total;
	}
	return entry;
}
//#endregion
//#region src/infra/session-cost-usage-pricing-context.ts
async function resolveUsageCostPricingFingerprint(config, agentDir) {
	await prepareModelPricingContext(config);
	return resolveModelCostConfigFingerprint(config, agentDir);
}
function createUsageCostResolver(params) {
	const cache = /* @__PURE__ */ new Map();
	return ({ provider, model }) => {
		const key = `${provider ?? ""}\0${model ?? ""}`;
		if (cache.has(key)) return cache.get(key);
		const cost = resolveModelCostConfig({
			provider,
			model,
			config: params?.config,
			agentDir: params?.agentDir
		});
		cache.set(key, cost);
		return cost;
	};
}
/** Diagnostic readers prepare only when a record actually needs an estimate. */
async function parseUsageCostTranscriptEntryAsync(parsed, resolveCost, config) {
	const entry = parseUsageCostTranscriptRecord(parsed);
	if (!needsUsageCostEstimate(entry)) return entry;
	await prepareModelPricingContext(config);
	return applyUsageCostEstimate(entry, resolveCost);
}
//#endregion
//#region src/infra/session-cost-usage-worker-runtime.ts
const USAGE_COST_WORKER_TIMEOUT_MS = 3e5;
function prepareUsageCostWorker(params) {
	const agentId = normalizeAgentId(params.agentId);
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	env.TESTCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env,
		storePath: params.storePath ?? (params.sessionsDir ? path.join(params.sessionsDir, "sessions.json") : void 0)
	}, params.config);
	const databasePath = resolveAssistantAgentSqlitePath({
		agentId,
		env,
		path: params.databasePath
	});
	const databases = /* @__PURE__ */ new Map();
	const add = (options) => {
		const prepared = {
			...options,
			env,
			path: resolveAssistantAgentSqlitePath(options)
		};
		databases.set(JSON.stringify([prepared.agentId, prepared.path]), prepared);
	};
	add({
		agentId,
		path: databasePath,
		env
	});
	const targets = [{
		agentId,
		storePath
	}, ...listDurableSqliteTargetPathsForSessionStorePath(storePath).map((targetPath) => ({
		agentId,
		storePath: targetPath
	}))];
	for (const file of params.sessionFiles ?? []) {
		const marker = parseSqliteSessionFileMarker(file);
		if (marker) targets.push(marker);
	}
	const seen = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = JSON.stringify([target.agentId, target.storePath]);
		if (seen.has(key)) continue;
		seen.add(key);
		add(toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		})));
	}
	return {
		location: {
			agentId,
			databasePath,
			storePath,
			env: {
				...env,
				TESTCLAW_STATE_DIR: env.TESTCLAW_STATE_DIR
			}
		},
		config: params.config,
		agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentId),
		databases: [...databases.values()]
	};
}
function resolveUsageCostWorkerDayBucket(dayBucket) {
	return dayBucket ? { ...dayBucket } : {
		mode: "time-zone",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
	};
}
function restoreWorkerFailure(error, hostErrors) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	const restoredOrigins = /* @__PURE__ */ new Set();
	let result = error;
	for (const current of pending) {
		if (seen.has(current)) continue;
		seen.add(current);
		if (current instanceof UsageCostWorkerReplyError) {
			const failure = current.failure;
			const remote = new Error(failure.message);
			if (failure.error) retainAssistantStateWorkerErrorPayload(remote, failure.error);
			let restored = hydrateAssistantStateWorkerError(remote, { includeOrdinary: true });
			if (failure.hostOrigin !== void 0 && hostErrors.has(failure.hostOrigin)) {
				restoredOrigins.add(failure.hostOrigin);
				const original = hostErrors.get(failure.hostOrigin);
				restored = failure.hostFailureOnly ? original : withSqliteWorkerCleanupFailure(toErrorObject(original, "Usage cache host effect failed"), restored);
			}
			result = current === error ? restored : withSqliteWorkerCleanupFailure(toErrorObject(restored, "Usage cost worker failed"), result);
		}
		if (current instanceof Error && current.cause) pending.push(current.cause);
		if (current instanceof AggregateError) pending.push(...current.errors);
	}
	for (const [origin, failure] of hostErrors) if (!restoredOrigins.has(origin)) result = withSqliteWorkerCleanupFailure(toErrorObject(failure, "Usage cache host effect failed"), result);
	return result;
}
async function runUsageCostWorker(prepared, operation) {
	const location = structuredClone(prepared.location);
	const capturedOperation = structuredClone(operation);
	const signal = getAsyncWorkSignal();
	return withSessionCostUsageWorkerDatabases(prepared.databases, async (scope) => {
		const bindings = prepared.databases.map((options) => {
			const memory = isIncognitoAssistantAgentSqlitePath(options.path, options);
			return {
				options,
				memory,
				database: memory ? getAssistantAgentDatabaseIfOpen(options) : void 0,
				identity: memory ? void 0 : fs.statSync(options.path, {
					bigint: true,
					throwIfNoEntry: false
				})
			};
		});
		const cacheBinding = bindings.find((binding) => binding.options.agentId === location.agentId && binding.options.path === location.databasePath);
		if (!cacheBinding) throw new Error("Usage cache database has no captured owner");
		const assertBindingCurrent = (binding, admittedDatabase) => {
			const admittedCache = admittedDatabase && binding === cacheBinding && admittedDatabase.agentId === binding.options.agentId && admittedDatabase.path === binding.options.path && getAssistantAgentDatabaseIfOpen(binding.options) === admittedDatabase && isAssistantAgentDatabasePathCurrent(admittedDatabase);
			if (binding.memory) {
				const current = getAssistantAgentDatabaseIfOpen(binding.options);
				if (!binding.database && current && admittedCache) binding.database = current;
				if (current !== binding.database || binding.database && !binding.database.db.isOpen) throw new Error("Usage memory database changed during worker operation");
				return;
			}
			const current = fs.statSync(binding.options.path, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (!binding.identity && current && admittedCache) binding.identity = current;
			if (binding.identity ? !current || current.dev !== binding.identity.dev || current.ino !== binding.identity.ino : current !== void 0) throw new Error("Usage database changed during worker operation");
		};
		const assertCurrent = (admittedDatabase) => {
			scope.assertCurrent();
			signal?.throwIfAborted();
			for (const binding of bindings) if (binding !== cacheBinding) assertBindingCurrent(binding);
			assertBindingCurrent(cacheBinding, admittedDatabase);
		};
		const resolveBinding = (target) => {
			const options = toDatabaseOptions(resolveSqliteReadScope({
				...target,
				env: location.env
			}));
			const databasePath = resolveAssistantAgentSqlitePath(options);
			const binding = bindings.find((entry) => entry.options.agentId === options.agentId && entry.options.path === databasePath);
			if (!binding) throw new Error("Usage worker requested an unowned transcript database");
			return binding;
		};
		const memoryBinding = (target) => {
			const binding = resolveBinding(target);
			if (!binding.memory) throw new Error("Usage worker requested an unowned memory database");
			return binding;
		};
		const sources = /* @__PURE__ */ new Map();
		const pruneRows = [];
		scope.retainCleanup(async () => {
			for (const source of sources.values()) source.clear();
			sources.clear();
			pruneRows.length = 0;
		});
		const lock = capturedOperation.kind === "refresh" ? prepareSessionCostUsageRefreshLock(location.agentId, location.databasePath, {
			env: location.env,
			assertCurrent
		}) : void 0;
		if (lock) {
			scope.retainCleanup(lock.release);
			if (!await lock.acquire()) return { kind: "busy" };
		}
		assertCurrent();
		const workerOperation = capturedOperation.kind === "refresh" ? {
			...capturedOperation,
			pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir)
		} : capturedOperation;
		const resolveCost = createUsageCostResolver({
			config: prepared.config,
			agentDir: prepared.agentDir
		});
		const hostErrors = /* @__PURE__ */ new Map();
		let errorSequence = 0;
		try {
			const result = await scope.run({
				kind: "usage-cost",
				location,
				operation: workerOperation,
				databases: []
			}, {
				signal,
				beforeDispatch: assertCurrent,
				inputBytes: 2 * JSON.stringify({
					location,
					operation: workerOperation
				}).length,
				timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS,
				onRequest: async (value, context) => {
					const transferList = [];
					let reply;
					try {
						const assertRequestCurrent = () => {
							assertCurrent();
							context.signal.throwIfAborted();
						};
						assertRequestCurrent();
						if (!isRecord(value) || typeof value.kind !== "string") throw new Error("Invalid usage worker host request");
						const request = value;
						let output;
						switch (request.kind) {
							case "pricing":
								output = request.input.map(resolveCost);
								break;
							case "restore": {
								const binding = resolveBinding(request.input);
								await restoreSessionColdTranscript({
									...request.input,
									storePath: binding.options.path,
									env: location.env
								}, assertRequestCurrent);
								output = void 0;
								break;
							}
							case "memory-instances": {
								const binding = memoryBinding(request.input);
								output = binding.database ? listSessionTranscriptInstances({
									...request.input,
									storePath: binding.options.path,
									env: location.env,
									projection: "list"
								}).map(({ agentId, sessionId, updatedAtMs }) => ({
									agentId,
									sessionId,
									updatedAtMs
								})) : [];
								break;
							}
							case "memory-stats":
								output = request.input.map((marker) => {
									const binding = memoryBinding(marker);
									return binding.database ? readTranscriptStatsBatchFromDatabase(binding.database, [marker.sessionId])[0] : void 0;
								});
								break;
							case "memory-cache": {
								const binding = memoryBinding({
									agentId: location.agentId,
									storePath: location.databasePath
								});
								output = binding.database ? readSessionCostUsageRollupByteRowsInDatabase(binding.database.db, request.input.filePaths) : [];
								for (const row of output) {
									if (!(row.valueJson.buffer instanceof ArrayBuffer)) throw new TypeError("Usage cache row bytes are not transferable");
									transferList.push(row.valueJson.buffer);
								}
								break;
							}
							case "memory-transcript": {
								await setImmediate(void 0, { signal: context.signal });
								assertRequestCurrent();
								const binding = memoryBinding(request.input.marker);
								if (!binding.database) throw new Error("Usage memory transcript is no longer available");
								const key = JSON.stringify(request.input);
								let source = sources.get(key);
								if (!source) {
									source = createMemoryTranscriptProjectionSource(binding.database, binding.options, request.input);
									sources.set(key, source);
								}
								const frame = source.read(request.input.marker.sessionId);
								output = frame;
								if (frame.type === "source-frame") transferList.push(frame.bytes.buffer);
								break;
							}
							case "memory-cache-body": {
								const binding = memoryBinding({
									agentId: location.agentId,
									storePath: location.databasePath
								});
								const row = binding.database ? readSessionCostUsageRollupBodyInDatabase(binding.database.db, request.input) : void 0;
								const blob = row?.blob ? Uint8Array.from(row.blob) : null;
								output = row ? { blob } : void 0;
								if (blob) transferList.push(blob.buffer);
								break;
							}
							case "prune-row":
								if (!lock) throw new Error("Usage report cannot prune cache rows");
								pruneRows.push({
									key: request.input.key,
									valueJson: request.input.value,
									updatedAt: request.input.updatedAt
								});
								output = void 0;
								break;
							case "prune":
								if (!lock) throw new Error("Usage report cannot prune cache rows");
								await lock.pruneRows(pruneRows);
								pruneRows.length = 0;
								output = void 0;
								break;
							case "write":
								if (!lock) throw new Error("Usage report cannot write cache rows");
								output = await lock.writeRollup({
									rollupId: request.input.key,
									previousValueJson: request.input.previousValue,
									valueJson: request.input.value,
									blob: request.input.blob,
									updatedAt: request.input.updatedAt
								});
								break;
							default: throw new Error("Unknown usage worker host request");
						}
						assertRequestCurrent();
						reply = {
							ok: true,
							value: output
						};
					} catch (error) {
						const origin = ++errorSequence;
						hostErrors.set(origin, error);
						reply = {
							ok: false,
							origin,
							message: toErrorObject(error, "Usage host effect failed").message
						};
					}
					return {
						input: reply,
						transferList,
						timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS
					};
				}
			});
			assertCurrent();
			return result;
		} catch (error) {
			throw restoreWorkerFailure(error, hostErrors);
		}
	});
}
//#endregion
//#region src/infra/session-cost-usage-aggregation.ts
function resolveUsageCostCacheDatabasePath(agentId) {
	return resolveAssistantAgentSqlitePath({ agentId: normalizeAgentId(agentId) });
}
function resolveUsageCostAgentDir(config, agentId) {
	return resolveAgentDir(config ?? {}, agentId);
}
async function refreshCostUsageCacheForAgent(params) {
	const result = await runUsageCostWorker(prepareUsageCostWorker(params), {
		kind: "refresh",
		maxFiles: params.maxFiles,
		sessionsDir: params.sessionsDir,
		sessionFiles: params.sessionFiles,
		startMs: params.startMs,
		rebuildRows: params.rebuildRows
	});
	if (result.kind === "busy") return "busy";
	if (result.kind !== "refresh") throw new Error("Invalid usage refresh worker result");
	return "refreshed";
}
//#endregion
//#region src/infra/session-cost-usage-cache-runtime.ts
const USAGE_COST_REFRESH_RETRY_MIN_MS = 50;
const USAGE_COST_REFRESH_RETRY_MAX_MS = 5e3;
const logger = createSubsystemLogger("usage-cost-cache");
const usageCostRefreshes = /* @__PURE__ */ new Map();
function isUsageCostRefreshQueued(databasePath) {
	return usageCostRefreshes.get(getAsyncWorkSignal())?.has(databasePath) === true;
}
async function readCostUsageSummaryFromWorker(prepared, params) {
	const result = await runUsageCostWorker(prepared, {
		...params,
		kind: "summary",
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "summary" || !result.summary.cacheStatus) throw new Error("Usage worker returned an invalid aggregate summary");
	return {
		summary: result.summary,
		cacheStatus: result.summary.cacheStatus,
		invalidRows: result.invalidRows
	};
}
async function loadCostUsageSummary(params) {
	const now = Date.now();
	const defaultStart = new Date(now);
	defaultStart.setDate(defaultStart.getDate() - 29);
	const startMs = params.startMs ?? defaultStart.getTime();
	const endMs = params.endMs ?? now;
	const prepared = prepareUsageCostWorker(params);
	const { databasePath, storePath } = prepared.location;
	const result = await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath,
		storePath
	});
	const { summary, cacheStatus, invalidRows } = await readCostUsageSummaryFromWorker(prepared, {
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		startMs,
		endMs,
		dayBucket: params.dayBucket
	});
	if (invalidRows.length > 0) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		rebuildRows: invalidRows
	});
	if (result === "busy" || isUsageCostRefreshQueued(databasePath) || await isSessionCostUsageRefreshRunning(params.agentId, databasePath)) cacheStatus.status = "refreshing";
	summary.updatedAt = Date.now();
	return summary;
}
async function loadCostUsageSummaryFromCache(params) {
	const prepared = prepareUsageCostWorker(params);
	const { databasePath, storePath } = prepared.location;
	const request = {
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket
	};
	let snapshot = await readCostUsageSummaryFromWorker(prepared, request);
	if (params.requestRefresh !== false && snapshot.cacheStatus.staleFiles > 0) {
		if (params.refreshMode === "sync-when-empty" && snapshot.cacheStatus.cachedFiles === 0) {
			const result = await refreshCostUsageCacheForAgent({
				config: params.config,
				agentId: params.agentId,
				agentDir: prepared.agentDir,
				storePath,
				startMs: params.startMs,
				rebuildRows: snapshot.invalidRows
			});
			snapshot = await readCostUsageSummaryFromWorker(prepared, request);
			if (result === "refreshed" && snapshot.cacheStatus.staleFiles > 0) requestCostUsageCacheRefresh({
				config: params.config,
				agentId: params.agentId,
				storePath,
				rebuildRows: snapshot.invalidRows
			});
		} else requestCostUsageCacheRefresh({
			config: params.config,
			agentId: params.agentId,
			storePath,
			rebuildRows: snapshot.invalidRows
		});
	}
	if (isUsageCostRefreshQueued(databasePath) || await isSessionCostUsageRefreshRunning(params.agentId, databasePath)) snapshot.cacheStatus.status = "refreshing";
	snapshot.summary.updatedAt = Date.now();
	return snapshot.summary;
}
async function loadSessionCostSummariesFromCache(params) {
	const prepared = prepareUsageCostWorker({
		...params,
		sessionFiles: params.sessions.map((session) => session.sessionFile)
	});
	const { databasePath, storePath } = prepared.location;
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		sessions: params.sessions,
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	const { summaries, cacheStatus, staleSessionFiles } = result;
	const refreshRequested = params.requestRefresh !== false && staleSessionFiles.length > 0;
	if (refreshRequested) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		sessionFiles: staleSessionFiles,
		rebuildRows: result.invalidRows
	});
	const refreshRunning = await isSessionCostUsageRefreshRunning(params.agentId, databasePath);
	if (staleSessionFiles.length > 0 && (refreshRunning || refreshRequested)) cacheStatus.status = "refreshing";
	return {
		summaries,
		cacheStatus
	};
}
function requestCostUsageCacheRefresh(params) {
	const scopeSignal = getAsyncWorkSignal();
	if (scopeSignal?.aborted) return;
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	const refreshes = usageCostRefreshes.get(scopeSignal) ?? /* @__PURE__ */ new Map();
	const existing = refreshes.get(databasePath);
	if (existing) {
		mergeUsageCostRefreshRequest(existing, params);
		return;
	}
	const state = {
		agentId: params.agentId,
		config: params.config,
		databasePath,
		fullRefreshRequested: false,
		pendingSessionFiles: /* @__PURE__ */ new Set(),
		pendingRebuildRows: /* @__PURE__ */ new Map(),
		storePath: params.storePath
	};
	mergeUsageCostRefreshRequest(state, params);
	usageCostRefreshes.set(scopeSignal, refreshes);
	refreshes.set(databasePath, state);
	trackAsyncWork(() => runQueuedUsageCostRefresh(state, refreshes, scopeSignal));
}
function mergeUsageCostRefreshRequest(state, params) {
	state.config = params.config ?? state.config;
	state.agentId = params.agentId;
	state.storePath = params.storePath;
	for (const row of params.rebuildRows ?? []) state.pendingRebuildRows.set(row.key, row);
	if (!params.sessionFiles) {
		state.fullRefreshRequested = true;
		return;
	}
	for (const sessionFile of params.sessionFiles) state.pendingSessionFiles.add(sessionFile);
}
function waitForUsageCostRefresh(signal, delayMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(finish, delayMs);
		timer.unref?.();
		function finish() {
			clearTimeout(timer);
			signal?.removeEventListener("abort", finish);
			resolve();
		}
		signal?.addEventListener("abort", finish, { once: true });
		if (signal?.aborted) finish();
	});
}
async function runQueuedUsageCostRefresh(state, refreshes, signal) {
	let busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
	let retryDelayMs = 0;
	try {
		do {
			await waitForUsageCostRefresh(signal, retryDelayMs);
			if (signal?.aborted) return;
			retryDelayMs = 0;
			try {
				while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) {
					const fullRefreshRequested = state.fullRefreshRequested;
					const sessionFiles = fullRefreshRequested ? [] : [...state.pendingSessionFiles];
					const rebuildRows = [...state.pendingRebuildRows.values()];
					state.pendingRebuildRows.clear();
					if (!fullRefreshRequested) state.pendingSessionFiles.clear();
					state.fullRefreshRequested = false;
					const result = await refreshCostUsageCacheForAgent({
						config: state.config,
						agentId: state.agentId,
						databasePath: state.databasePath,
						storePath: state.storePath,
						sessionFiles: fullRefreshRequested ? void 0 : sessionFiles,
						rebuildRows
					});
					if (signal?.aborted) return;
					if (result === "busy") {
						for (const row of rebuildRows) if (!state.pendingRebuildRows.has(row.key)) state.pendingRebuildRows.set(row.key, row);
						if (fullRefreshRequested) state.fullRefreshRequested = true;
						else for (const sessionFile of sessionFiles) state.pendingSessionFiles.add(sessionFile);
						retryDelayMs = busyRetryDelayMs;
						busyRetryDelayMs = Math.min(busyRetryDelayMs * 2, USAGE_COST_REFRESH_RETRY_MAX_MS);
						break;
					}
					busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
				}
			} catch (error) {
				logger.warn(`background refresh failed: ${formatErrorMessage(error)}`, { error });
				if (signal?.aborted) return;
			}
		} while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0);
	} finally {
		refreshes.delete(state.databasePath);
		if (refreshes.size === 0) usageCostRefreshes.delete(signal);
	}
}
//#endregion
//#region src/infra/session-cost-usage-collection.ts
function formatCanonicalUsageCostSqliteMarker(marker, env) {
	const { path: storePath } = resolveSqliteTargetFromSessionStorePath(marker.storePath, {
		agentId: marker.agentId,
		env
	});
	return formatSqliteSessionFileMarker({
		...marker,
		storePath
	});
}
async function* readTranscriptRecords(filePath) {
	const marker = parseSqliteSessionFileMarker(filePath);
	if (marker) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-BtPaMmVG.js");
		await restoreSessionColdTranscript(marker);
		for (const event of selectVisibleTranscriptEvents(loadTranscriptEventsSync(marker))) if (isRecord(event)) yield event;
		return;
	}
	const transcriptPath = materializeSessionArchiveForRead(filePath);
	for await (const line of streamSessionTranscriptLines(transcriptPath)) try {
		const parsed = JSON.parse(line);
		if (isRecord(parsed)) yield parsed;
	} catch {}
}
async function* readTranscriptRecordsBestEffort(filePath) {
	try {
		yield* readTranscriptRecords(filePath);
	} catch (error) {
		if (parseSqliteSessionFileMarker(filePath)) throw error;
	}
}
function resolveExistingUsageSessionFile(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const target = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	if (target && completeTarget) {
		const targetKeyAgentId = parseAgentSessionKey(target.sessionKey)?.agentId;
		const targetKeyEntry = loadSessionEntryReadOnly({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			projection: "list"
		});
		if (sessionId !== void 0 && target.sessionId !== sessionId || target.agentId !== params.agentId || targetKeyAgentId && targetKeyAgentId !== target.agentId || targetKeyEntry && targetKeyEntry.sessionId !== target.sessionId) return;
		return formatCanonicalUsageCostSqliteMarker({
			agentId: target.agentId,
			sessionId: target.sessionId,
			storePath: target.storePath
		});
	}
	const legacySessionFile = params.sessionEntry?.sessionFile;
	const entryMarker = parseSqliteSessionFileMarker(typeof legacySessionFile === "string" ? legacySessionFile : void 0);
	const explicitMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const matchingEntryMarker = entryMarker && entryMarker.agentId === params.agentId && (!sessionId || entryMarker.sessionId === sessionId) ? entryMarker : void 0;
	const matchingExplicitMarker = explicitMarker && explicitMarker.agentId === params.agentId && (!sessionId || explicitMarker.sessionId === sessionId) ? explicitMarker : void 0;
	if (!matchingEntryMarker && explicitMarker && !matchingExplicitMarker) return;
	const sqliteMarker = matchingEntryMarker ?? matchingExplicitMarker;
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const targetKeyEntry = target?.sessionKey && sqliteMarker && !completeTarget ? loadSessionEntryReadOnly({
		agentId: sqliteMarker.agentId,
		sessionKey: target.sessionKey,
		storePath: sqliteMarker.storePath,
		projection: "list"
	}) : void 0;
	if (target && !completeTarget && sqliteMarker && (target.agentId && target.agentId !== sqliteMarker.agentId || target.sessionId && target.sessionId !== sqliteMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== sqliteMarker.agentId || target.sessionKey && targetKeyEntry?.sessionId !== sqliteMarker.sessionId || target.storePath && path.resolve(target.storePath) !== path.resolve(sqliteMarker.storePath))) return;
	if (sqliteMarker) return formatSqliteSessionFileMarker(sqliteMarker);
	if (entryMarker && !params.sessionFile) return;
	const candidate = params.sessionFile ?? (sessionId ? resolveSessionFilePathCore(sessionId, params.sessionEntry, { agentId: params.agentId }) : void 0);
	if (candidate && fs.existsSync(candidate)) return candidate;
	if (!sessionId) return candidate;
	try {
		const sessionsDir = candidate ? path.dirname(candidate) : resolveSessionTranscriptsDirForAgent(params.agentId);
		const baseFileName = `${sessionId}.jsonl`;
		const entries = fs.readdirSync(sessionsDir, { withFileTypes: true }).filter((entry) => {
			return entry.isFile() && (entry.name === baseFileName || entry.name.startsWith(`${baseFileName}.reset.`) || entry.name.startsWith(`${baseFileName}.deleted.`));
		});
		const primary = entries.find((entry) => entry.name === baseFileName);
		if (primary) return path.join(sessionsDir, primary.name);
		const latestArchive = entries.filter((entry) => isSessionArchiveArtifactName(entry.name)).map((entry) => entry.name).toSorted((a, b) => {
			const tsA = parseSessionArchiveTimestamp(a, "deleted") ?? parseSessionArchiveTimestamp(a, "reset") ?? 0;
			return (parseSessionArchiveTimestamp(b, "deleted") ?? parseSessionArchiveTimestamp(b, "reset") ?? 0) - tsA || b.localeCompare(a);
		})[0];
		return latestArchive ? path.join(sessionsDir, latestArchive) : candidate;
	} catch {
		return candidate;
	}
}
//#endregion
//#region src/infra/session-cost-usage-reporting.ts
const USAGE_COST_DIRECT_REFRESH_RETRY_MS = 25;
/**
* Scan all transcript files to discover sessions not in the session store.
* Returns basic metadata for each discovered session.
*/
async function discoverAllSessions(params) {
	const result = await runUsageCostWorker(prepareUsageCostWorker(params), {
		kind: "inventory",
		minMtimeMs: params.startMs
	});
	if (result.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	const discovered = /* @__PURE__ */ new Map();
	for (const file of result.files) {
		const { sourcePath: sessionFile, sessionId } = file;
		if (!sessionId) continue;
		const isPrimaryTranscript = file.kind === "sqlite" || isPrimarySessionTranscriptFileName(path.basename(sessionFile));
		const existing = discovered.get(sessionId);
		const existingIsPrimary = existing ? isPrimarySessionTranscriptFileName(path.basename(existing.sessionFile)) : false;
		if (!existing || isPrimaryTranscript && !existingIsPrimary || isPrimaryTranscript === existingIsPrimary && file.mtimeMs >= existing.mtime) discovered.set(sessionId, {
			sessionId,
			sessionFile,
			mtime: file.mtimeMs
		});
	}
	const sessions = Array.from(discovered.values());
	sessions.sort((a, b) => b.mtime - a.mtime);
	return sessions;
}
async function loadSessionCostSummary(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	const prepared = prepareUsageCostWorker({
		...params,
		sessionFiles: [sessionFile]
	});
	const inventory = await runUsageCostWorker(prepared, {
		kind: "inventory",
		sessionFiles: [sessionFile]
	});
	if (inventory.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	if (inventory.files.length === 0) return null;
	while (await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath: prepared.location.databasePath,
		sessionFiles: [sessionFile]
	}) === "busy") await new Promise((resolve) => {
		setTimeout(resolve, USAGE_COST_DIRECT_REFRESH_RETRY_MS);
	});
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		sessions: [{
			sessionId: params.sessionId,
			sessionFile
		}],
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	return result.summaries[0] ?? null;
}
async function loadSessionUsageTimeSeries(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	if (params.maxPoints !== void 0 && params.maxPoints !== null) {
		if (!Number.isFinite(params.maxPoints) || params.maxPoints <= 0) return {
			sessionId: params.sessionId,
			points: []
		};
	}
	let points = [];
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const record of readTranscriptRecords(sessionFile)) {
		const entry = await parseUsageCostTranscriptEntryAsync(record, resolveCost, params.config);
		const timestamp = entry?.timestamp?.getTime();
		if (!entry?.usage || !timestamp) continue;
		const { input, output, cacheRead, cacheWrite, totalTokens } = computeUsageTokenTotals(entry.usage);
		points.push({
			timestamp,
			input,
			output,
			cacheRead,
			cacheWrite,
			totalTokens,
			cost: entry.costTotal ?? 0
		});
	}
	points.sort((a, b) => a.timestamp - b.timestamp);
	const maxPoints = params.maxPoints ?? 100;
	if (points.length > maxPoints) {
		const step = Math.ceil(points.length / maxPoints);
		const downsampled = [];
		let bucket;
		let bucketSize = 0;
		for (const point of points) {
			if (!bucket || bucketSize === step) {
				bucket = {
					timestamp: point.timestamp,
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: 0
				};
				downsampled.push(bucket);
				bucketSize = 0;
			}
			bucket.timestamp = point.timestamp;
			bucket.input += point.input;
			bucket.output += point.output;
			bucket.cacheRead += point.cacheRead;
			bucket.cacheWrite += point.cacheWrite;
			bucket.totalTokens += point.totalTokens;
			bucket.cost += point.cost;
			bucketSize += 1;
		}
		points = downsampled;
	}
	let cumulativeTokens = 0;
	let cumulativeCost = 0;
	return {
		sessionId: params.sessionId,
		points: points.map((point) => {
			cumulativeTokens += point.totalTokens;
			cumulativeCost += point.cost;
			return Object.assign(point, {
				cumulativeTokens,
				cumulativeCost
			});
		})
	};
}
async function loadSessionLogs(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	const logs = [];
	if (params.limit !== void 0 && params.limit !== null) {
		if (!Number.isFinite(params.limit) || params.limit <= 0) return [];
	}
	const limit = params.limit ?? 50;
	const boundedLimit = Number.isInteger(limit);
	const retentionLimit = limit * 2;
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const parsed of readTranscriptRecordsBestEffort(sessionFile)) {
		let role;
		let content;
		try {
			const message = parsed.message;
			if (!message) continue;
			const recordRole = message.role;
			if (recordRole !== "user" && recordRole !== "assistant" && recordRole !== "tool" && recordRole !== "toolResult") continue;
			role = recordRole;
			const contentParts = [];
			const rawToolName = message.toolName ?? message.tool_name ?? message.name ?? message.tool;
			const toolName = normalizeOptionalString(rawToolName);
			if (role === "tool" || role === "toolResult") {
				contentParts.push(`[Tool: ${toolName ?? "tool"}]`);
				contentParts.push("[Tool Result]");
			}
			const rawContent = message.content;
			if (typeof rawContent === "string") contentParts.push(rawContent);
			else if (Array.isArray(rawContent)) {
				const contentText = rawContent.map((block) => {
					if (typeof block === "string") return block;
					const b = block;
					if (b.type === "text" && typeof b.text === "string") return b.text;
					if (isToolCallContentType(normalizeOptionalString(b.type))) return `[Tool: ${typeof b.name === "string" ? b.name : "unknown"}]`;
					if (b.type === "tool_result") return "[Tool Result]";
					return "";
				}).filter(Boolean).join("\n");
				if (contentText) contentParts.push(contentText);
			}
			const rawToolCalls = message.tool_calls ?? message.toolCalls ?? message.function_call ?? message.functionCall;
			const toolCalls = Array.isArray(rawToolCalls) ? rawToolCalls : rawToolCalls ? [rawToolCalls] : [];
			if (toolCalls.length > 0) for (const call of toolCalls) {
				const callObj = call;
				const directName = typeof callObj.name === "string" ? callObj.name : void 0;
				const fn = callObj.function;
				const fnName = typeof fn?.name === "string" ? fn.name : void 0;
				const name = directName ?? fnName ?? "unknown";
				contentParts.push(`[Tool: ${name}]`);
			}
			const rawText = contentParts.join("\n");
			content = role === "user" ? stripUserEnvelopeForDisplay(rawText).trim() : stripInboundMetadata(rawText.trim());
			if (!content) continue;
			const maxLen = 2e3;
			if (content.length > maxLen) content = truncateUtf16Safe(content, maxLen) + "…";
		} catch {
			continue;
		}
		const entry = await parseUsageCostTranscriptEntryAsync(parsed, resolveCost, params.config);
		const usage = role === "assistant" ? entry?.usage : void 0;
		logs.push({
			timestamp: entry?.timestamp?.getTime() ?? 0,
			role,
			content,
			tokens: usage ? computeUsageTokenTotals(usage).totalTokens : void 0,
			cost: usage ? entry?.costTotal : void 0
		});
		if (boundedLimit && logs.length > retentionLimit) {
			logs.sort((a, b) => a.timestamp - b.timestamp);
			logs.splice(0, logs.length - limit);
		}
	}
	if (boundedLimit) {
		logs.sort((a, b) => a.timestamp - b.timestamp);
		return logs.length > limit ? logs.slice(-limit) : logs;
	}
	const sortedLogs = logs.toSorted((a, b) => a.timestamp - b.timestamp);
	if (sortedLogs.length > limit) return sortedLogs.slice(-limit);
	return sortedLogs;
}
//#endregion
export { resolveExistingUsageSessionFile as a, loadSessionCostSummariesFromCache as c, loadSessionUsageTimeSeries as i, loadSessionCostSummary as n, loadCostUsageSummary as o, loadSessionLogs as r, loadCostUsageSummaryFromCache as s, discoverAllSessions as t };
