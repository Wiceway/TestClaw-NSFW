import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-_nFH9T9d.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { c as trackAsyncWork } from "./async-work-scope-Botgjsbr.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { c as resolveSessionFilePathOptions, s as resolveSessionFilePathCore } from "./paths-ViQaz2td.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import { n as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-BYC4PoOZ.js";
import { o as sessionCreatorProfileId } from "./session-entry-provenance-DvvCadpW.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.js";
import "./session-accessor-DMf92PxK.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Ui as validateSessionsUsageParams } from "./validator-registry-Dpl5QmuY.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRl7Rrsc.js";
import { I as readUserProfileVersion } from "./user-profiles-internal-CUEKVOsi.js";
import { o as operatorSessionCap } from "./operator-role-policy-gPgbkoHA.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-Cf1GWEow.js";
import { at as loadCombinedSessionStoreForGatewayCore } from "./session-row-prepared-read-x3FXwbu8.js";
import { t as listGatewayAgentsBasic } from "./agent-list-C7FjDSZV.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DlmWzvmc.js";
import { l as projectSessionActor, r as resolveGatewaySessionDisplayName } from "./session-utils-display-0bRfLd7U.js";
import { E as gatewayClientSessionCreator, f as isGatewayAdmin } from "./session-sharing-policy-rVme8bnl.js";
import { E as createSessionListEntryFilter } from "./session-sharing-xa1VG8U2.js";
import "./session-utils-DyRtmfj4.js";
import { a as resolveTimezone, i as resolveTimeZoneDayStartMs, t as createTimeZoneDayKeyFormatter } from "./format-datetime-CSLJIAzN.js";
import { n as cloneCostUsageTotals, r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.js";
import { a as resolveExistingUsageSessionFile, c as loadSessionCostSummariesFromCache, i as loadSessionUsageTimeSeries, r as loadSessionLogs, s as loadCostUsageSummaryFromCache, t as discoverAllSessions } from "./session-cost-usage-Dz1zUa0A.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { n as loadUsageStatusStaleWhileRevalidate } from "./models-auth-status-usage-cache-DfRd6a5V.js";
import fs from "node:fs";
//#region src/shared/usage-aggregates.ts
const UNKNOWN_USAGE_CREATOR_KEY = "[\"unknown\"]";
/** Builds a collision-free identity while preserving legacy missing-as-unknown grouping. */
function usageModelIdentity(provider, model) {
	return JSON.stringify([provider ?? "unknown", model ?? "unknown"]);
}
/** Extends the model identity with its calendar bucket without delimiter ambiguity. */
function usageDailyModelIdentity(date, provider, model) {
	return JSON.stringify([
		date,
		provider ?? "unknown",
		model ?? "unknown"
	]);
}
function createLatencyAccumulator() {
	return {
		count: 0,
		sum: 0,
		min: Number.POSITIVE_INFINITY,
		max: 0,
		p95Max: 0
	};
}
function mergeLatency(target, source) {
	target.count += source.count;
	target.sum += source.avgMs * source.count;
	target.min = Math.min(target.min, source.minMs);
	target.max = Math.max(target.max, source.maxMs);
	target.p95Max = Math.max(target.p95Max, source.p95Ms);
}
function summarizeLatency(value) {
	return {
		count: value.count,
		avgMs: value.count ? value.sum / value.count : 0,
		minMs: value.min === Number.POSITIVE_INFINITY ? 0 : value.min,
		maxMs: value.max,
		p95Ms: value.p95Max
	};
}
function mergeModelUsage(map, key, entry, model) {
	const existing = map.get(key) ?? {
		provider: entry.provider,
		model,
		count: 0,
		totals: createEmptyCostUsageTotals()
	};
	existing.count += entry.count;
	addCostUsageTotals(existing.totals, entry.totals);
	map.set(key, existing);
}
function mergeGroupedTotals(map, key, usage) {
	if (!key) return;
	const totals = map.get(key) ?? createEmptyCostUsageTotals();
	addCostUsageTotals(totals, usage);
	map.set(key, totals);
}
function compareModelUsage(left, right) {
	return right.totals.totalCost - left.totals.totalCost || right.totals.totalTokens - left.totals.totalTokens;
}
/** Shared accounting for gateway-wide results and filtered Control UI session rows. */
function createUsageAggregateAccumulator() {
	const totals = createEmptyCostUsageTotals();
	const messages = {
		total: 0,
		user: 0,
		assistant: 0,
		toolCalls: 0,
		toolResults: 0,
		errors: 0
	};
	const tools = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const providers = /* @__PURE__ */ new Map();
	const agents = /* @__PURE__ */ new Map();
	const channels = /* @__PURE__ */ new Map();
	const creators = /* @__PURE__ */ new Map();
	const days = /* @__PURE__ */ new Map();
	const costDays = /* @__PURE__ */ new Map();
	const dailyLatency = /* @__PURE__ */ new Map();
	const dailyModels = /* @__PURE__ */ new Map();
	const latency = createLatencyAccumulator();
	let sessionCount = 0;
	let longestSessionDurationMs = 0;
	function getDay(date) {
		let day = days.get(date);
		if (!day) {
			day = {
				date,
				tokens: 0,
				cost: 0,
				messages: 0,
				toolCalls: 0,
				errors: 0
			};
			days.set(date, day);
		}
		return day;
	}
	function add({ usage, agentId, channel, createdActor, creatorKey = UNKNOWN_USAGE_CREATOR_KEY }) {
		if (!usage) return;
		addCostUsageTotals(totals, usage);
		longestSessionDurationMs = Math.max(longestSessionDurationMs, usage.durationMs ?? 0);
		const countedSession = usage.firstActivity !== void 0 || (usage.messageCounts?.total ?? 0) > 0;
		if (countedSession) sessionCount += 1;
		if (usage.messageCounts) {
			messages.total += usage.messageCounts.total;
			messages.user += usage.messageCounts.user;
			messages.assistant += usage.messageCounts.assistant;
			messages.toolCalls += usage.messageCounts.toolCalls;
			messages.toolResults += usage.messageCounts.toolResults;
			messages.errors += usage.messageCounts.errors;
		}
		for (const tool of usage.toolUsage?.tools ?? []) tools.set(tool.name, (tools.get(tool.name) ?? 0) + tool.count);
		for (const entry of usage.modelUsage ?? []) {
			mergeModelUsage(models, usageModelIdentity(entry.provider, entry.model), entry, entry.model);
			mergeModelUsage(providers, entry.provider ?? "unknown", entry, void 0);
		}
		mergeGroupedTotals(agents, agentId, usage);
		mergeGroupedTotals(channels, channel, usage);
		const creator = creators.get(creatorKey) ?? {
			key: creatorKey,
			...createdActor ? { actor: createdActor } : {},
			totals: createEmptyCostUsageTotals(),
			sessionCount: 0,
			daily: /* @__PURE__ */ new Map(),
			sessionActivity: /* @__PURE__ */ new Map()
		};
		addCostUsageTotals(creator.totals, usage);
		if (countedSession) {
			creator.sessionCount += 1;
			const dates = [.../* @__PURE__ */ new Set([
				...usage.activityDates ?? [],
				...usage.dailyBreakdown?.map(({ date }) => date) ?? [],
				...usage.dailyMessageCounts?.map(({ date }) => date) ?? []
			])].toSorted();
			const key = JSON.stringify(dates);
			const activity = creator.sessionActivity.get(key) ?? {
				dates,
				sessionCount: 0
			};
			activity.sessionCount += 1;
			creator.sessionActivity.set(key, activity);
		}
		creators.set(creatorKey, creator);
		if (usage.latency && usage.latency.count > 0) mergeLatency(latency, usage.latency);
		for (const day of usage.dailyLatency ?? []) {
			const existing = dailyLatency.get(day.date) ?? createLatencyAccumulator();
			mergeLatency(existing, day);
			dailyLatency.set(day.date, existing);
		}
		for (const day of usage.dailyBreakdown ?? []) {
			const existing = getDay(day.date);
			existing.tokens += day.tokens;
			existing.cost += day.cost;
			mergeGroupedTotals(costDays, day.date, day);
			mergeGroupedTotals(creator.daily, day.date, day);
		}
		for (const day of usage.dailyMessageCounts ?? []) {
			const existing = getDay(day.date);
			existing.messages += day.total;
			existing.toolCalls += day.toolCalls;
			existing.errors += day.errors;
		}
		for (const day of usage.dailyModelUsage ?? []) {
			const key = usageDailyModelIdentity(day.date, day.provider, day.model);
			const existing = dailyModels.get(key) ?? {
				date: day.date,
				provider: day.provider,
				model: day.model,
				tokens: 0,
				cost: 0,
				count: 0
			};
			existing.tokens += day.tokens;
			existing.cost += day.cost;
			existing.count += day.count;
			dailyModels.set(key, existing);
		}
	}
	function finish() {
		const toolEntries = Array.from(tools, ([name, count]) => ({
			name,
			count
		})).toSorted((a, b) => b.count - a.count);
		return {
			sessionCount,
			...longestSessionDurationMs > 0 ? { longestSessionDurationMs } : {},
			messages,
			tools: {
				totalCalls: toolEntries.reduce((sum, { count }) => sum + count, 0),
				uniqueTools: tools.size,
				tools: toolEntries
			},
			byModel: Array.from(models.values()).toSorted(compareModelUsage),
			byProvider: Array.from(providers.values()).toSorted(compareModelUsage),
			byAgent: Array.from(agents, ([agentId, groupTotals]) => ({
				agentId,
				totals: groupTotals
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
			byChannel: Array.from(channels, ([channel, groupTotals]) => ({
				channel,
				totals: groupTotals
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
			byCreator: Array.from(creators.values(), ({ daily, sessionActivity, ...creator }) => ({
				...creator,
				daily: Array.from(daily, ([date, dayTotals]) => ({
					date,
					...dayTotals
				})).toSorted((a, b) => a.date.localeCompare(b.date)),
				sessionActivity: Array.from(sessionActivity.values()).toSorted((a, b) => a.dates.join(",").localeCompare(b.dates.join(",")))
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost || b.totals.totalTokens - a.totals.totalTokens || a.key.localeCompare(b.key)),
			costDaily: Array.from(costDays, ([date, groupTotals]) => ({
				date,
				...groupTotals
			})).toSorted((a, b) => a.date.localeCompare(b.date)),
			latency: latency.count > 0 ? summarizeLatency(latency) : void 0,
			dailyLatency: Array.from(dailyLatency, ([date, value]) => ({
				date,
				...summarizeLatency(value)
			})).toSorted((a, b) => a.date.localeCompare(b.date)),
			modelDaily: Array.from(dailyModels.values()).toSorted((a, b) => a.date.localeCompare(b.date) || b.cost - a.cost),
			daily: Array.from(days.values()).toSorted((a, b) => a.date.localeCompare(b.date))
		};
	}
	return {
		totals,
		add,
		finish
	};
}
//#endregion
//#region src/gateway/server-methods/usage-date-range.ts
const MAX_USAGE_DAYS = 36600;
const parseDateParts = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
	if (!match) return;
	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const monthIndex = Number(monthStr) - 1;
	const day = Number(dayStr);
	if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || !Number.isFinite(day)) return;
	const probe = new Date(Date.UTC(year, monthIndex, day));
	if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== monthIndex || probe.getUTCDate() !== day) return;
	return {
		year,
		monthIndex,
		day
	};
};
const shiftDateParts = (parts, days) => {
	const shifted = new Date(Date.UTC(parts.year, parts.monthIndex, parts.day + days));
	return {
		year: shifted.getUTCFullYear(),
		monthIndex: shifted.getUTCMonth(),
		day: shifted.getUTCDate()
	};
};
const datePartsToStartMs = (parts, interpretation) => {
	const { year, monthIndex, day } = parts;
	if (interpretation.mode === "gateway") return new Date(year, monthIndex, day).getTime();
	if (interpretation.mode === "time-zone") return resolveTimeZoneDayStartMs(formatDateParts(year, monthIndex, day), interpretation.timeZone);
	if (interpretation.mode === "utc-offset") return Date.UTC(year, monthIndex, day) - interpretation.utcOffsetMinutes * 60 * 1e3;
	return Date.UTC(year, monthIndex, day);
};
const datePartsToEndMs = (parts, interpretation) => {
	const lookaheadDays = interpretation.mode === "time-zone" ? 2 : 1;
	for (let daysAhead = 1; daysAhead <= lookaheadDays; daysAhead += 1) {
		const nextDayStartMs = datePartsToStartMs(shiftDateParts(parts, daysAhead), interpretation);
		if (nextDayStartMs !== void 0) return nextDayStartMs - 1;
	}
};
const findInvalidExplicitDate = (params) => {
	for (const field of ["startDate", "endDate"]) {
		const raw = params[field];
		if (raw === void 0 || raw === null || typeof raw === "string" && raw.trim() === "") continue;
		if (parseDateParts(raw) === void 0) return field;
	}
};
/**
* Parse a UTC offset string in the format UTC+H, UTC-H, UTC+HH, UTC-HH, UTC+H:MM, UTC-HH:MM.
* Returns the UTC offset in minutes (east-positive), or undefined if invalid.
*/
const parseUtcOffsetToMinutes = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^UTC([+-])(\d{1,2})(?::([0-5]\d))?$/.exec(raw.trim());
	if (!match) return;
	const sign = match[1] === "+" ? 1 : -1;
	const hours = Number(match[2]);
	const minutes = Number(match[3] ?? "0");
	const totalMinutes = sign * (hours * 60 + minutes);
	if (totalMinutes < -720 || totalMinutes > 840) return;
	return totalMinutes;
};
const resolveDateInterpretation = (params) => {
	if (params.mode === "gateway") return {
		ok: true,
		value: { mode: "gateway" }
	};
	if (params.mode === "specific") {
		const utcOffsetMinutes = parseUtcOffsetToMinutes(params.utcOffset);
		if (params.timeZone !== void 0 && params.timeZone !== null) {
			const requestedTimeZone = normalizeOptionalString(params.timeZone);
			const timeZone = requestedTimeZone ? resolveTimezone(requestedTimeZone) : void 0;
			if (!timeZone) {
				if (utcOffsetMinutes !== void 0) return {
					ok: true,
					value: {
						mode: "utc-offset",
						utcOffsetMinutes
					}
				};
				return {
					ok: false,
					error: "invalid timeZone: expected a valid IANA time zone"
				};
			}
			return {
				ok: true,
				value: {
					mode: "time-zone",
					timeZone,
					formatDayKey: createTimeZoneDayKeyFormatter(timeZone)
				}
			};
		}
		if (utcOffsetMinutes !== void 0) return {
			ok: true,
			value: {
				mode: "utc-offset",
				utcOffsetMinutes
			}
		};
		if (params.utcOffset != null && (typeof params.utcOffset !== "string" || params.utcOffset.trim() !== "")) return {
			ok: false,
			error: "invalid utcOffset: expected UTC-12:00 through UTC+14:00"
		};
	}
	return {
		ok: true,
		value: { mode: "utc" }
	};
};
const resolveDayBucket = (interpretation) => {
	if (interpretation.mode === "gateway") return;
	if (interpretation.mode === "time-zone") return {
		mode: "time-zone",
		timeZone: interpretation.timeZone
	};
	return {
		mode: "utc-offset",
		utcOffsetMinutes: interpretation.mode === "utc-offset" ? interpretation.utcOffsetMinutes : 0
	};
};
const getDateParts = (date, interpretation) => {
	if (interpretation.mode === "gateway") return {
		year: date.getFullYear(),
		monthIndex: date.getMonth(),
		day: date.getDate()
	};
	if (interpretation.mode === "time-zone") {
		const parts = parseDateParts(interpretation.formatDayKey(date));
		if (!parts) throw new Error("timezone formatter returned an invalid calendar day");
		return parts;
	}
	if (interpretation.mode === "utc-offset") {
		const shifted = new Date(date.getTime() + interpretation.utcOffsetMinutes * 60 * 1e3);
		return {
			year: shifted.getUTCFullYear(),
			monthIndex: shifted.getUTCMonth(),
			day: shifted.getUTCDate()
		};
	}
	return {
		year: date.getUTCFullYear(),
		monthIndex: date.getUTCMonth(),
		day: date.getUTCDate()
	};
};
const formatDateLabel = (ms, interpretation) => {
	const parts = getDateParts(new Date(ms), interpretation);
	return formatDateParts(parts.year, parts.monthIndex, parts.day);
};
const formatDateParts = (year, monthIndex, day) => `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const parseDays = (raw) => {
	const fromFinite = (n) => {
		if (!Number.isFinite(n)) return;
		return Math.min(Math.floor(n), MAX_USAGE_DAYS);
	};
	if (typeof raw === "number") return fromFinite(raw);
	if (typeof raw === "string" && raw.trim() !== "") return fromFinite(Number(raw));
};
const resolveRangeDays = (raw) => {
	if (raw === "all") return "all";
	if (raw === "7d") return 7;
	if (raw === "30d") return 30;
	if (raw === "90d") return 90;
	if (raw === "1y") return 365;
};
/**
* Get date range from params (startDate/endDate or days).
* Falls back to last 30 days if not provided.
*/
const resolveDateRange = (params, resolvedInterpretation) => {
	const invalidDate = findInvalidExplicitDate(params);
	if (invalidDate) return {
		ok: false,
		error: `invalid ${invalidDate}: expected a valid YYYY-MM-DD calendar date`
	};
	const now = /* @__PURE__ */ new Date();
	const interpretationResolution = resolvedInterpretation ? {
		ok: true,
		value: resolvedInterpretation
	} : resolveDateInterpretation(params);
	if (!interpretationResolution.ok) return interpretationResolution;
	const interpretation = interpretationResolution.value;
	const todayDateParts = getDateParts(now, interpretation);
	const todayEndMs = datePartsToEndMs(todayDateParts, interpretation);
	if (todayEndMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	const startDateParts = parseDateParts(params.startDate);
	const endDateParts = parseDateParts(params.endDate);
	if (startDateParts === void 0 !== (endDateParts === void 0)) return {
		ok: false,
		error: "startDate and endDate must be provided together"
	};
	if (startDateParts && endDateParts) {
		const startMs = datePartsToStartMs(startDateParts, interpretation);
		const endStartMs = datePartsToStartMs(endDateParts, interpretation);
		const endMs = datePartsToEndMs(endDateParts, interpretation);
		if (startMs === void 0 || endStartMs === void 0 || endMs === void 0) return {
			ok: false,
			error: "calendar day does not exist in requested time zone"
		};
		if (startMs > endStartMs) return {
			ok: false,
			error: "startDate must not be after endDate"
		};
		return {
			ok: true,
			value: {
				startMs,
				endMs
			}
		};
	}
	const rangeDays = resolveRangeDays(params.range);
	if (rangeDays === "all") return {
		ok: true,
		value: {
			startMs: 0,
			endMs: todayEndMs,
			includeUntimestamped: true
		}
	};
	const days = Math.max(1, rangeDays ?? parseDays(params.days) ?? 30);
	const startMs = datePartsToStartMs(shiftDateParts(todayDateParts, -(days - 1)), interpretation);
	if (startMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	return {
		ok: true,
		value: {
			startMs,
			endMs: todayEndMs
		}
	};
};
//#endregion
//#region src/gateway/server-methods/usage-cache.ts
const USAGE_CACHE_TTL_MS = 3e4;
const USAGE_CACHE_MAX = 256;
function setUsageCache(cache, cacheKey, entry) {
	if (!cache.has(cacheKey) && cache.size >= USAGE_CACHE_MAX) {
		let evictionKey = cache.keys().next().value;
		for (const [key, candidate] of cache) if (!candidate.inFlight) {
			evictionKey = key;
			break;
		}
		if (evictionKey !== void 0) cache.delete(evictionKey);
	}
	cache.set(cacheKey, entry);
}
async function loadUsageResultCached(params) {
	const { cache, cacheKey, configRef } = params;
	const candidate = cache.get(cacheKey);
	const cached = candidate?.configRef === configRef ? candidate : void 0;
	if (cached?.value && cached.updatedAt && Date.now() - cached.updatedAt < USAGE_CACHE_TTL_MS) return cached.value;
	if (cached?.inFlight) return cached.value && cached.updatedAt ? cached.value : await cached.inFlight;
	const entry = cached ?? { configRef };
	const inFlight = trackAsyncWork(() => params.load().then((value) => {
		if (cache.get(cacheKey) !== entry) return value;
		if (params.isComplete?.(value) ?? true) {
			entry.value = value;
			entry.updatedAt = Date.now();
		} else if (!entry.value) {
			entry.value = value;
			delete entry.updatedAt;
		}
		return value;
	}).catch((error) => {
		if (entry.value) return entry.value;
		throw error;
	}).finally(() => {
		const current = cache.get(cacheKey);
		if (current === entry && current.inFlight === inFlight) current.inFlight = void 0;
	}));
	entry.inFlight = inFlight;
	setUsageCache(cache, cacheKey, entry);
	return entry.value && entry.updatedAt ? entry.value : await inFlight;
}
//#endregion
//#region src/infra/session-cost-usage-rollup.ts
function mergeTools(target, tools) {
	for (const tool of tools) target.set(tool.name, (target.get(tool.name) ?? 0) + tool.count);
}
function mergeModels(target, models) {
	for (const model of models) {
		const modelRef = usageModelIdentity(model.provider, model.model);
		const existing = target.get(modelRef) ?? {
			provider: model.provider,
			model: model.model,
			count: 0,
			totals: createEmptyCostUsageTotals()
		};
		existing.count += model.count;
		addCostUsageTotals(existing.totals, model.totals);
		target.set(modelRef, existing);
	}
}
function addMessageCounts(target, source) {
	target.total += source.total;
	target.user += source.user;
	target.assistant += source.assistant;
	target.toolCalls += source.toolCalls;
	target.toolResults += source.toolResults;
	target.errors += source.errors;
}
function sortedModelUsage(models, sortByUsage = true) {
	if (models.size === 0) return;
	const values = Array.from(models.values());
	return sortByUsage ? values.toSorted((a, b) => {
		return b.totals.totalCost - a.totals.totalCost || b.totals.totalTokens - a.totals.totalTokens;
	}) : values;
}
function buildToolUsage(tools, sortTiesByName = true) {
	if (tools.size === 0) return;
	const entries = Array.from(tools, ([name, count]) => ({
		name,
		count
	})).toSorted((a, b) => b.count - a.count || (sortTiesByName ? a.name.localeCompare(b.name) : 0));
	return {
		totalCalls: entries.reduce((sum, entry) => sum + entry.count, 0),
		uniqueTools: entries.length,
		tools: entries
	};
}
function createDatedRowsAccumulator(add, options) {
	const rows = /* @__PURE__ */ new Map();
	const keyOf = options?.key ?? ((row) => row.quarterIndex === void 0 ? row.date : `${row.date}:${row.quarterIndex}`);
	const clone = options?.clone ?? ((row) => ({ ...row }));
	return {
		add(source) {
			for (const row of source ?? []) {
				const key = keyOf(row);
				const existing = rows.get(key);
				if (existing) add(existing, row);
				else rows.set(key, clone(row));
			}
		},
		finish() {
			return rows.size ? Array.from(rows.values()).toSorted((a, b) => a.date.localeCompare(b.date) || (a.quarterIndex ?? 0) - (b.quarterIndex ?? 0)) : void 0;
		}
	};
}
function mergeMessageCountSummaries(left, right) {
	if (!left) return right ? { ...right } : void 0;
	const counts = { ...left };
	if (right) addMessageCounts(counts, right);
	return counts;
}
function mergeLatencyStats(left, right) {
	if (!left && !right) return;
	const leftCount = left?.count ?? 0;
	const rightCount = right?.count ?? 0;
	const count = leftCount + rightCount;
	return {
		count,
		avgMs: count > 0 ? ((left?.avgMs ?? 0) * leftCount + (right?.avgMs ?? 0) * rightCount) / count : 0,
		p95Ms: Math.max(left?.p95Ms ?? 0, right?.p95Ms ?? 0),
		minMs: Math.min(left?.minMs ?? Number.POSITIVE_INFINITY, right?.minMs ?? Number.POSITIVE_INFINITY),
		maxMs: Math.max(left?.maxMs ?? 0, right?.maxMs ?? 0)
	};
}
function createSessionCostSummaryAccumulator(identity) {
	const target = {
		...createEmptyCostUsageTotals(),
		...identity
	};
	const activityDates = /* @__PURE__ */ new Set();
	const dailyBreakdown = createDatedRowsAccumulator((current, row) => {
		addCostUsageTotals(current, row);
		current.tokens += row.tokens;
		current.cost += row.cost;
	}, { clone: (row) => ({
		...row,
		...cloneCostUsageTotals(row)
	}) });
	const dailyMessageCounts = createDatedRowsAccumulator(addMessageCounts);
	const quarterMessages = createDatedRowsAccumulator(addMessageCounts);
	const quarterTokens = createDatedRowsAccumulator((current, row) => {
		current.input += row.input;
		current.output += row.output;
		current.cacheRead += row.cacheRead;
		current.cacheWrite += row.cacheWrite;
		current.totalTokens += row.totalTokens;
		current.totalCost += row.totalCost;
	});
	const dailyLatency = createDatedRowsAccumulator((current, row) => {
		const count = current.count + row.count;
		current.avgMs = count > 0 ? (current.avgMs * current.count + row.avgMs * row.count) / count : 0;
		current.count = count;
		current.p95Ms = Math.max(current.p95Ms, row.p95Ms);
		current.minMs = Math.min(current.minMs, row.minMs);
		current.maxMs = Math.max(current.maxMs, row.maxMs);
	});
	const dailyModels = createDatedRowsAccumulator((current, row) => {
		current.tokens += row.tokens;
		current.cost += row.cost;
		current.count += row.count;
	}, { key: (row) => usageDailyModelIdentity(row.date, row.provider, row.model) });
	return {
		add(source) {
			addCostUsageTotals(target, source);
			target.firstActivity = target.firstActivity === void 0 ? source.firstActivity : source.firstActivity === void 0 ? target.firstActivity : Math.min(target.firstActivity, source.firstActivity);
			target.lastActivity = target.lastActivity === void 0 ? source.lastActivity : source.lastActivity === void 0 ? target.lastActivity : Math.max(target.lastActivity, source.lastActivity);
			if (target.firstActivity !== void 0 && target.lastActivity !== void 0) target.durationMs = Math.max(0, target.lastActivity - target.firstActivity);
			for (const date of source.activityDates ?? []) activityDates.add(date);
			dailyBreakdown.add(source.dailyBreakdown);
			dailyMessageCounts.add(source.dailyMessageCounts);
			quarterMessages.add(source.utcQuarterHourMessageCounts);
			quarterTokens.add(source.utcQuarterHourTokenUsage);
			dailyLatency.add(source.dailyLatency);
			dailyModels.add(source.dailyModelUsage);
			target.messageCounts = mergeMessageCountSummaries(target.messageCounts, source.messageCounts);
			const tools = /* @__PURE__ */ new Map();
			mergeTools(tools, target.toolUsage?.tools ?? []);
			mergeTools(tools, source.toolUsage?.tools ?? []);
			target.toolUsage = buildToolUsage(tools, false);
			const models = /* @__PURE__ */ new Map();
			mergeModels(models, target.modelUsage ?? []);
			mergeModels(models, source.modelUsage ?? []);
			target.modelUsage = sortedModelUsage(models, false);
			target.latency = mergeLatencyStats(target.latency, source.latency);
		},
		finish() {
			if (activityDates.size) target.activityDates = Array.from(activityDates).toSorted();
			target.dailyBreakdown = dailyBreakdown.finish();
			target.dailyMessageCounts = dailyMessageCounts.finish();
			target.utcQuarterHourMessageCounts = quarterMessages.finish();
			target.utcQuarterHourTokenUsage = quarterTokens.finish();
			target.dailyLatency = dailyLatency.finish();
			target.dailyModelUsage = dailyModels.finish();
			return target;
		}
	};
}
//#endregion
//#region src/gateway/server-methods/usage-session-loading.ts
const USAGE_AGENT_LOAD_CONCURRENCY = 12;
async function runUsageAgentTasks(tasks) {
	const result = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_AGENT_LOAD_CONCURRENCY,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.results;
}
async function discoverAllSessionsForUsage(params) {
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const allSessions = (await runUsageAgentTasks((requestedAgentId ? [{ id: normalizeAgentId(requestedAgentId) }] : listGatewayAgentsBasic(params.config).agents).map((agent) => async () => {
		const agentId = normalizeAgentId(agent.id);
		return (await discoverAllSessions({
			agentId,
			startMs: params.startMs,
			endMs: params.endMs
		})).map((session) => Object.assign({}, session, { agentId }));
	}))).flat();
	allSessions.sort((a, b) => b.mtime - a.mtime);
	return allSessions;
}
function mergeUsageCacheStatus(target, source) {
	if (!target) return { ...source };
	const statusRank = {
		fresh: 0,
		partial: 1,
		stale: 2,
		refreshing: 3
	};
	return {
		status: statusRank[source.status] > statusRank[target.status] ? source.status : target.status,
		cachedFiles: target.cachedFiles + source.cachedFiles,
		pendingFiles: target.pendingFiles + source.pendingFiles,
		staleFiles: target.staleFiles + source.staleFiles,
		refreshedAt: target.refreshedAt === void 0 ? source.refreshedAt : source.refreshedAt === void 0 ? target.refreshedAt : Math.max(target.refreshedAt, source.refreshedAt)
	};
}
async function loadUsageSessionSummaries(params) {
	const { entries: mergedEntries, config, startMs, endMs, includeUntimestamped, dayBucket } = params;
	let cacheStatus;
	const usageByEntryIndex = Array.from({ length: mergedEntries.length }, () => null);
	const sessionsByAgent = /* @__PURE__ */ new Map();
	for (const [entryIndex, merged] of mergedEntries.entries()) for (const { sessionId, sessionFile } of merged.instances) {
		const agentSessions = sessionsByAgent.get(merged.agentId) ?? [];
		agentSessions.push({
			entryIndex,
			sessionId,
			sessionFile
		});
		sessionsByAgent.set(merged.agentId, agentSessions);
	}
	const agentLoads = await runUsageAgentTasks(Array.from(sessionsByAgent.entries()).map(([agentId, agentSessions]) => async () => ({
		agentSessions,
		loaded: await loadSessionCostSummariesFromCache({
			sessions: agentSessions,
			config,
			agentId,
			startMs,
			endMs,
			includeUntimestamped,
			dayBucket
		})
	})));
	for (const { agentSessions, loaded } of agentLoads) {
		cacheStatus = mergeUsageCacheStatus(cacheStatus, loaded.cacheStatus);
		let usage;
		for (const [index, summary] of loaded.summaries.entries()) {
			const session = expectDefined(agentSessions[index], "agent sessions entry at index");
			if (summary) {
				const merged = expectDefined(mergedEntries[session.entryIndex], "merged entries entry at session.entry index");
				usage ??= createSessionCostSummaryAccumulator({
					sessionId: merged.sessionId,
					sessionFile: merged.sessionFile
				});
				usage.add(summary);
			}
			if (usage && agentSessions[index + 1]?.entryIndex !== session.entryIndex) {
				usageByEntryIndex[session.entryIndex] = usage.finish();
				usage = void 0;
			}
		}
	}
	return {
		summaries: usageByEntryIndex,
		cacheStatus
	};
}
//#endregion
//#region src/gateway/server-methods/usage-result-cache.ts
const costUsageCache = /* @__PURE__ */ new Map();
const sessionsUsageCache = /* @__PURE__ */ new Map();
function usageDayBucketCacheKey(dayBucket) {
	return dayBucket ? dayBucket.mode === "time-zone" ? `time-zone:${dayBucket.timeZone}` : `utc-offset:${dayBucket.utcOffsetMinutes}` : "gateway";
}
function sessionsUsageCacheKey(params) {
	return JSON.stringify([
		params.agentScope === "all" ? "all" : `agent:${params.agentId}`,
		params.startMs,
		params.endMs,
		params.includeUntimestamped === true,
		usageDayBucketCacheKey(params.dayBucket),
		params.limit,
		params.groupingMode,
		params.specificKey,
		params.includeContextWeight,
		params.creatorKey,
		readUserProfileVersion(),
		...params.visibilityIdentity ? [params.visibilityIdentity] : []
	]);
}
async function loadSessionsUsageResultCached(params) {
	return await loadUsageResultCached({
		cache: sessionsUsageCache,
		cacheKey: sessionsUsageCacheKey(params),
		configRef: params.configRef,
		load: params.load,
		isComplete: (result) => !result.cacheStatus || result.cacheStatus.status === "fresh"
	});
}
async function loadCostUsageSummaryCached(params) {
	const allAgents = params.agentScope === "all";
	const agentId = allAgents ? void 0 : normalizeAgentId(params.agentId ?? resolveSessionAgentId({ config: params.config }));
	const dayBucketKey = usageDayBucketCacheKey(params.dayBucket);
	const cacheKey = `${allAgents ? "all" : `agent:${agentId}`}:${params.startMs}-${params.endMs}:${dayBucketKey}`;
	return await loadUsageResultCached({
		cache: costUsageCache,
		cacheKey,
		configRef: params.config,
		load: () => allAgents ? loadAllAgentCostUsageSummary({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config
		}) : loadCostUsageSummaryFromCache({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config,
			agentId: expectDefined(agentId, "non-aggregate usage agent id"),
			requestRefresh: true,
			refreshMode: "background"
		})
	});
}
async function loadAllAgentCostUsageSummary(params) {
	const summaries = await runUsageAgentTasks(listGatewayAgentsBasic(params.config).agents.map((agent) => normalizeAgentId(agent.id)).map((agentId) => () => loadCostUsageSummaryFromCache({
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket,
		config: params.config,
		agentId,
		requestRefresh: true,
		refreshMode: "background"
	})));
	const dailyByDate = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	let cacheStatus;
	let updatedAt = 0;
	let days = 0;
	for (const summary of summaries) {
		updatedAt = Math.max(updatedAt, summary.updatedAt);
		days = Math.max(days, summary.days);
		addCostUsageTotals(totals, summary.totals);
		if (summary.cacheStatus) cacheStatus = mergeUsageCacheStatus(cacheStatus, summary.cacheStatus);
		for (const day of summary.daily) {
			const entry = dailyByDate.get(day.date) ?? {
				date: day.date,
				...createEmptyCostUsageTotals()
			};
			addCostUsageTotals(entry, day);
			dailyByDate.set(day.date, entry);
		}
	}
	return {
		updatedAt,
		days,
		daily: Array.from(dailyByDate.values()).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals,
		...cacheStatus ? { cacheStatus } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/usage-session-selection.ts
var UsageSessionInvalidRequestError = class extends Error {};
function resolveSessionUsageTarget(key, config, agentIdHint) {
	const { canonicalKey, entry, storePath } = loadGatewaySessionEntryReadOnly(key, {
		...agentIdHint ? { agentId: agentIdHint } : {},
		projection: "list"
	});
	const parsed = parseAgentSessionKey(key);
	const agentId = parsed?.agentId ?? agentIdHint ?? resolveSessionAgentId({
		config,
		sessionKey: key
	});
	const sessionId = entry?.sessionId ?? parsed?.rest ?? key;
	const sessionFile = entry ? resolveExistingUsageSessionFile({
		agentId,
		sessionId,
		sessionTarget: {
			agentId,
			sessionId,
			sessionKey: canonicalKey,
			storePath
		}
	}) : resolveExistingUsageSessionFile({
		agentId,
		sessionId,
		sessionFile: resolveSessionFilePathCore(sessionId, void 0, resolveSessionFilePathOptions({
			storePath,
			agentId
		}))
	});
	return sessionFile ? {
		entry,
		agentId,
		sessionId,
		sessionFile
	} : void 0;
}
function usageSessionIdentity(agentId, sessionId) {
	return `${agentId}\0${sessionId}`;
}
function buildStoreBySessionIdentity(store, targetsBySessionKey) {
	const matchesByIdentity = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		if (!entry?.sessionId) continue;
		const agentId = expectDefined(targetsBySessionKey.get(key), "stored session owner").agentId;
		const identity = usageSessionIdentity(agentId, entry.sessionId);
		const matches = matchesByIdentity.get(identity) ?? [];
		matches.push([key, entry]);
		matchesByIdentity.set(identity, matches);
	}
	const storeByIdentity = /* @__PURE__ */ new Map();
	for (const [identity, matches] of matchesByIdentity) {
		const sessionId = expectDefined(matches[0], "stored session match")[1].sessionId;
		const preferredKey = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId);
		if (!preferredKey) continue;
		const preferredEntry = store[preferredKey];
		if (preferredEntry) storeByIdentity.set(identity, {
			key: preferredKey,
			entry: preferredEntry
		});
	}
	const familyMatches = /* @__PURE__ */ new Map();
	for (const { key, entry } of storeByIdentity.values()) {
		const agentId = expectDefined(targetsBySessionKey.get(key), "stored session owner").agentId;
		for (const sessionId of entry.usageFamilySessionIds ?? []) {
			const identity = usageSessionIdentity(agentId, sessionId);
			if (!storeByIdentity.has(identity)) {
				const candidates = familyMatches.get(identity) ?? {
					sessionId,
					matches: []
				};
				candidates.matches.push([key, entry]);
				familyMatches.set(identity, candidates);
			}
		}
	}
	const familyOwners = new Map(storeByIdentity);
	for (const [identity, { sessionId, matches }] of familyMatches) {
		const key = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId);
		if (key) familyOwners.set(identity, {
			key,
			entry: expectDefined(store[key], "family owner")
		});
	}
	return {
		storeByIdentity,
		familyOwners
	};
}
function withUsageGrouping(base, groupingMode, familyOwners, discoveredByIdentity) {
	const currentInstance = {
		sessionId: base.sessionId,
		sessionFile: base.sessionFile
	};
	if (groupingMode !== "family") return {
		...base,
		instances: [currentInstance]
	};
	const includedSessionIds = [...new Set([base.sessionId, ...base.storeEntry?.usageFamilySessionIds ?? []].map(normalizeOptionalString).filter((id) => Boolean(id)))].filter((id) => id === base.sessionId || familyOwners.get(usageSessionIdentity(base.agentId, id))?.entry.sessionId === base.sessionId);
	return {
		...base,
		instances: includedSessionIds.flatMap((id) => {
			const instance = id === base.sessionId ? currentInstance : discoveredByIdentity.get(usageSessionIdentity(base.agentId, id));
			return instance ? [instance] : [];
		}),
		scope: "family",
		sessionFamilyKey: base.storeEntry?.usageFamilyKey ?? base.key,
		currentSessionId: base.sessionId,
		includedSessionIds
	};
}
async function selectUsageSessions(params) {
	const { config, agentId: effectiveAgentId, specificKey, groupingMode, startMs, endMs, visibilityFilter } = params;
	const { store, targetsBySessionKey } = loadCombinedSessionStoreForGatewayCore(config, {
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		projection: "list"
	});
	const scopedStore = Object.fromEntries(Object.entries(store).filter(([key, entry]) => (!effectiveAgentId || targetsBySessionKey.get(key)?.agentId === effectiveAgentId) && (!visibilityFilter || visibilityFilter(key, entry))));
	const { storeByIdentity: storeBySessionIdentity, familyOwners } = buildStoreBySessionIdentity(scopedStore, targetsBySessionKey);
	const discoveredSessions = !specificKey || groupingMode === "family" ? await discoverAllSessionsForUsage({
		config,
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		startMs,
		endMs
	}) : [];
	const discoveredByIdentity = new Map(discoveredSessions.map((session) => [usageSessionIdentity(session.agentId, session.sessionId), session]));
	const now = Date.now();
	const mergedEntries = [];
	if (specificKey) {
		const scopedSpecificKey = resolveStoredSessionKeyForAgentStore({
			cfg: config,
			agentId: expectDefined(effectiveAgentId, "specific session owner"),
			sessionKey: specificKey
		});
		const scopedParsed = parseAgentSessionKey(scopedSpecificKey);
		const agentIdFromKey = scopedParsed?.agentId ?? expectDefined(effectiveAgentId, "specific session owner");
		const keyRest = scopedParsed?.rest ?? specificKey;
		const storeMatch = scopedStore[scopedSpecificKey] ? {
			key: scopedSpecificKey,
			entry: scopedStore[scopedSpecificKey]
		} : scopedStore[specificKey] ? {
			key: specificKey,
			entry: scopedStore[specificKey]
		} : null;
		const storeByIdMatch = storeBySessionIdentity.get(usageSessionIdentity(agentIdFromKey, keyRest)) ?? (keyRest !== specificKey ? storeBySessionIdentity.get(usageSessionIdentity(agentIdFromKey, specificKey)) : void 0) ?? null;
		const resolvedStoreKey = storeMatch?.key ?? storeByIdMatch?.key ?? scopedSpecificKey;
		const storeEntry = storeMatch?.entry ?? storeByIdMatch?.entry;
		if (visibilityFilter && !storeEntry) throw new UsageSessionInvalidRequestError(`Invalid session reference: ${specificKey}`);
		const sessionId = storeEntry?.sessionId ?? keyRest;
		let resolved;
		try {
			resolved = resolveSessionUsageTarget(resolvedStoreKey, config, agentIdFromKey);
			if (!resolved || resolved.agentId !== agentIdFromKey || resolved.sessionId !== sessionId) throw new Error("session target mismatch");
		} catch {
			throw new UsageSessionInvalidRequestError(`Invalid session reference: ${specificKey}`);
		}
		const { sessionFile } = resolved;
		let updatedAt;
		if (parseSqliteSessionFileMarker(sessionFile)) updatedAt = storeEntry?.updatedAt ?? now;
		else try {
			const stats = fs.statSync(sessionFile);
			if (stats.isFile()) updatedAt = storeEntry?.updatedAt ?? stats.mtimeMs;
		} catch {}
		if (updatedAt !== void 0) mergedEntries.push(withUsageGrouping({
			key: resolvedStoreKey,
			agentId: agentIdFromKey,
			sessionId,
			sessionFile,
			label: resolveGatewaySessionDisplayName(resolvedStoreKey, storeEntry),
			updatedAt,
			storeEntry
		}, groupingMode, familyOwners, discoveredByIdentity));
	} else {
		const selectedFamilies = /* @__PURE__ */ new Set();
		for (const discovered of discoveredSessions) {
			const identity = usageSessionIdentity(discovered.agentId, discovered.sessionId);
			const owner = (groupingMode === "family" ? familyOwners : storeBySessionIdentity).get(identity);
			if (!owner) {
				if (!visibilityFilter) mergedEntries.push({
					key: `agent:${discovered.agentId}:${discovered.sessionId}`,
					agentId: discovered.agentId,
					sessionId: discovered.sessionId,
					sessionFile: discovered.sessionFile,
					instances: [discovered],
					updatedAt: discovered.mtime,
					scope: "instance",
					creatorEntry: familyOwners.get(identity)?.entry
				});
				continue;
			}
			const { key, entry } = owner;
			const familyIdentity = usageSessionIdentity(discovered.agentId, key);
			if (selectedFamilies.has(familyIdentity)) continue;
			let sessionFile = discoveredByIdentity.get(usageSessionIdentity(discovered.agentId, entry.sessionId))?.sessionFile;
			if (!sessionFile) {
				const target = resolveSessionUsageTarget(key, config, discovered.agentId);
				if (!target || target.agentId !== discovered.agentId || target.sessionId !== entry.sessionId) throw new UsageSessionInvalidRequestError(`Invalid session reference: ${key}`);
				sessionFile = target.sessionFile;
			}
			mergedEntries.push(withUsageGrouping({
				key,
				agentId: discovered.agentId,
				sessionId: entry.sessionId,
				sessionFile,
				label: resolveGatewaySessionDisplayName(key, entry),
				updatedAt: entry.updatedAt ?? discovered.mtime,
				storeEntry: entry
			}, groupingMode, familyOwners, discoveredByIdentity));
			if (groupingMode === "family") selectedFamilies.add(familyIdentity);
		}
	}
	mergedEntries.sort((a, b) => b.updatedAt - a.updatedAt);
	for (const row of mergedEntries) {
		const target = targetsBySessionKey.get(row.key);
		if (!target) continue;
		row.contextTarget = {
			storeTarget: target.storeTarget,
			storedKey: target.storeKey ?? row.key
		};
	}
	return mergedEntries;
}
function loadUsageSessionContext(selected, visibilityFilter) {
	const contextRows = /* @__PURE__ */ new Map();
	for (const row of selected) {
		const target = row.contextTarget;
		if (target) {
			const rows = contextRows.get(target.storeTarget) ?? [];
			rows.push({
				row,
				storedKey: target.storedKey
			});
			contextRows.set(target.storeTarget, rows);
		}
	}
	for (const [target, rows] of contextRows) {
		const entries = new Map(loadExactSessionEntryCandidates({
			readOnly: true,
			readSource: {
				agentId: target.agentId,
				path: target.storePath
			},
			sessionKeys: rows.map(({ storedKey }) => storedKey)
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		for (const { row, storedKey } of rows) {
			const entry = entries.get(storedKey);
			if (entry?.sessionId === row.sessionId && (!visibilityFilter || visibilityFilter(row.key, entry))) row.contextWeight = entry.systemPromptReport;
		}
	}
}
//#endregion
//#region src/gateway/server-methods/usage.ts
function resolveSessionUsageFileOrRespond(params, detail, respond, config) {
	const key = normalizeOptionalString(params?.key);
	if (!key) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `key is required for ${detail}`));
		return null;
	}
	const sessionOwner = resolveRequestedSessionAgentId(config, key, normalizeOptionalString(params?.agentId));
	if (!sessionOwner.ok) {
		respond(false, void 0, sessionOwner.error);
		return null;
	}
	let resolved;
	try {
		resolved = resolveSessionUsageTarget(key, config, sessionOwner.agentId);
	} catch {
		resolved = void 0;
	}
	if (!resolved) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Invalid session key: ${key}`));
		return null;
	}
	return {
		config,
		key,
		...resolved
	};
}
function resolveUsageDateRangeOrRespond(params, respond) {
	const interpretation = resolveDateInterpretation(params);
	if (!interpretation.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, interpretation.error));
		return null;
	}
	const range = resolveDateRange(params, interpretation.value);
	if (!range.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, range.error));
		return null;
	}
	return {
		interpretation: interpretation.value,
		range: range.value
	};
}
function projectUsageCreator(session, profiles, config) {
	const entry = session.storeEntry ?? session.creatorEntry;
	const actor = entry?.createdActor;
	if (!actor) return { key: UNKNOWN_USAGE_CREATOR_KEY };
	const projected = projectSessionActor(actor, profiles, config, Boolean(sessionCreatorProfileId(actor)));
	if (!projected?.id && actor.type !== "system") return { key: UNKNOWN_USAGE_CREATOR_KEY };
	const identity = projected?.identity;
	const origin = sessionDeliveryOrigin(entry);
	const channel = sessionDeliveryChannel(entry);
	if (actor.type === "human" && actor.source !== "profile" && !channel) return { key: UNKNOWN_USAGE_CREATOR_KEY };
	return {
		key: identity?.type === "profile" ? JSON.stringify(["profile", identity.id]) : actor.type === "human" ? JSON.stringify([
			"human",
			actor.source,
			session.agentId,
			channel ?? null,
			origin?.accountId ?? null,
			projected?.id
		]) : actor.type === "agent" ? JSON.stringify([identity?.type ?? "agent", identity?.id ?? projected?.id]) : JSON.stringify(["system", projected?.id ?? null]),
		...projected ? { actor: projected } : {}
	};
}
const usageHandlers = {
	"usage.status": async ({ respond, context, client }) => {
		const coldRead = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.USAGE_REFRESHING) ? "refresh-marker" : void 0;
		respond(true, await loadUsageStatusStaleWhileRevalidate({
			config: context.getRuntimeConfig(),
			coldRead
		}), void 0);
	},
	"usage.cost": async ({ respond, params, context, client }) => {
		const dateRange = resolveUsageDateRangeOrRespond(params ?? {}, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		if (!isGatewayAdmin(client ?? null) && operatorSessionCap(client ?? null, config) === "none") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Aggregate usage includes sessions hidden by your operator role; ask an administrator to review Gateway-wide usage."));
			return;
		}
		const { startMs, endMs } = range;
		const agentId = normalizeOptionalString(params?.agentId);
		if (params?.agentScope === "all" && agentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope=all cannot be combined with agentId"));
			return;
		}
		const agentScope = params?.agentScope === "all" ? "all" : void 0;
		let effectiveAgentId = agentId;
		if (!agentScope && !effectiveAgentId) {
			const requestedAgent = resolveRequestedSessionAgentId(config, "main");
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			effectiveAgentId = requestedAgent.agentId;
		}
		respond(true, await loadCostUsageSummaryCached({
			startMs,
			endMs,
			dayBucket: resolveDayBucket(dateInterpretation),
			config,
			agentId: effectiveAgentId,
			agentScope
		}), void 0);
	},
	"sessions.usage": async ({ respond, params, context, client }) => {
		if (!assertValidParams(params, validateSessionsUsageParams, "sessions.usage", respond)) return;
		const p = params;
		const dateRange = resolveUsageDateRangeOrRespond(p, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		const sessionCap = operatorSessionCap(client ?? null, config);
		const visibilityFilter = sessionCap === "none" ? createSessionListEntryFilter({
			client: client ?? null,
			cfg: config
		}) : void 0;
		const profileId = gatewayClientSessionCreator(client ?? null)?.id;
		const visibilityIdentity = sessionCap && profileId ? `${profileId}:${sessionCap}` : void 0;
		const { startMs, endMs, includeUntimestamped } = range;
		const dayBucket = resolveDayBucket(dateInterpretation);
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? p.limit : 50;
		const includeContextWeight = p.includeContextWeight ?? false;
		const creatorKey = normalizeOptionalString(p.creatorKey);
		const specificKey = normalizeOptionalString(p.key) ?? null;
		const requestedAgentId = normalizeOptionalString(p.agentId);
		const requestedAllAgents = p.agentScope === "all";
		if (requestedAllAgents && (requestedAgentId || specificKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope=all cannot be combined with key or agentId"));
			return;
		}
		const specificSessionOwner = specificKey ? resolveRequestedSessionAgentId(config, specificKey, requestedAgentId) : void 0;
		if (specificSessionOwner && !specificSessionOwner.ok) {
			respond(false, void 0, specificSessionOwner.error);
			return;
		}
		const implicitAgent = !requestedAllAgents && !specificSessionOwner?.agentId && !requestedAgentId ? resolveRequestedSessionAgentId(config, "main") : void 0;
		if (implicitAgent && !implicitAgent.ok) {
			respond(false, void 0, implicitAgent.error);
			return;
		}
		const effectiveAgentId = requestedAllAgents ? void 0 : normalizeAgentId(specificSessionOwner?.agentId ?? requestedAgentId ?? implicitAgent?.agentId);
		const groupingMode = p.groupBy === "family" || p.includeHistorical === true ? "family" : "instance";
		let result;
		try {
			result = await loadSessionsUsageResultCached({
				configRef: config,
				...effectiveAgentId ? { agentId: effectiveAgentId } : { agentScope: "all" },
				startMs,
				endMs,
				includeUntimestamped,
				dayBucket,
				limit,
				groupingMode,
				specificKey,
				includeContextWeight,
				creatorKey,
				...visibilityIdentity ? { visibilityIdentity } : {},
				load: async () => {
					const now = Date.now();
					const visibleEntries = await selectUsageSessions({
						config,
						agentId: effectiveAgentId,
						specificKey,
						groupingMode,
						startMs,
						endMs,
						visibilityFilter
					});
					const profiles = /* @__PURE__ */ new Map();
					const creatorOptions = /* @__PURE__ */ new Map();
					const matchedEntries = visibleEntries.flatMap((entry) => {
						const creator = projectUsageCreator(entry, profiles, config);
						creatorOptions.set(creator.key, creator);
						return !creatorKey || creator.key === creatorKey ? [{
							entry,
							creator
						}] : [];
					});
					const mergedEntries = matchedEntries.map(({ entry }) => entry);
					const sessions = [];
					const accumulator = createUsageAggregateAccumulator();
					const { summaries: usageByEntryIndex, cacheStatus } = await loadUsageSessionSummaries({
						entries: mergedEntries,
						config,
						startMs,
						endMs,
						includeUntimestamped,
						dayBucket
					});
					loadUsageSessionContext(mergedEntries.slice(0, limit), visibilityFilter);
					for (const [entryIndex, { entry: merged, creator }] of matchedEntries.entries()) {
						const agentId = merged.agentId;
						const usage = usageByEntryIndex[entryIndex] ?? null;
						const channel = sessionDeliveryChannel(merged.storeEntry);
						const origin = sessionDeliveryOrigin(merged.storeEntry);
						const chatType = merged.storeEntry?.chatType ?? origin?.chatType;
						accumulator.add({
							usage,
							agentId,
							channel,
							creatorKey: creator.key,
							createdActor: creator.actor
						});
						if (entryIndex < limit) sessions.push({
							key: merged.key,
							label: merged.label,
							sessionId: merged.sessionId,
							scope: merged.scope ?? "instance",
							sessionFamilyKey: merged.sessionFamilyKey,
							currentSessionId: merged.currentSessionId,
							includedSessionIds: merged.includedSessionIds,
							historicalInstanceCount: merged.includedSessionIds?.length,
							updatedAt: merged.updatedAt,
							agentId,
							creatorKey: creator.key,
							createdActor: creator.actor,
							channel,
							chatType,
							origin,
							modelOverride: merged.storeEntry?.modelOverride,
							providerOverride: merged.storeEntry?.providerOverride,
							modelProvider: merged.storeEntry?.modelProvider,
							model: merged.storeEntry?.model,
							usage,
							hasContextWeight: Boolean(merged.contextWeight),
							contextWeight: includeContextWeight ? merged.contextWeight ?? null : void 0
						});
					}
					return {
						updatedAt: now,
						startDate: formatDateLabel(startMs, dateInterpretation),
						endDate: formatDateLabel(endMs, dateInterpretation),
						sessions,
						totals: accumulator.totals,
						aggregates: accumulator.finish(),
						creatorOptions: Array.from(creatorOptions.values()),
						cacheStatus
					};
				}
			});
		} catch (err) {
			if (err instanceof UsageSessionInvalidRequestError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, err.message));
				return;
			}
			throw err;
		}
		respond(true, result, void 0);
	},
	"sessions.usage.timeseries": async ({ respond, params, context }) => {
		const resolved = resolveSessionUsageFileOrRespond(params, "timeseries", respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, key, entry, agentId, sessionId, sessionFile } = resolved;
		const timeseries = await loadSessionUsageTimeSeries({
			sessionId,
			sessionEntry: entry,
			sessionFile,
			config,
			agentId,
			maxPoints: 200
		});
		if (!timeseries) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `No transcript found for session: ${key}`));
			return;
		}
		respond(true, timeseries, void 0);
	},
	"sessions.usage.logs": async ({ respond, params, context }) => {
		const limit = typeof params?.limit === "number" && Number.isFinite(params.limit) ? Math.min(params.limit, 1e3) : 200;
		const resolved = resolveSessionUsageFileOrRespond(params, "logs", respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, entry, agentId, sessionId, sessionFile } = resolved;
		respond(true, { logs: await loadSessionLogs({
			sessionId,
			sessionEntry: entry,
			sessionFile,
			config,
			agentId,
			limit
		}) ?? [] }, void 0);
	}
};
//#endregion
export { usageHandlers as t };
