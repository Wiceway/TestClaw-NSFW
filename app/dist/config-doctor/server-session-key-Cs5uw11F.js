import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { T as resolveExpiresAtMsFromDurationMs, a as asDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-BEuqweC1.js";
import { h as toAgentRequestSessionKey, k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import "./agent-scope-BiRi-Smp.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { c as getAgentRunContext } from "./agent-run-registry-DbPiDevk.js";
import { r as resolveSessionStoreIdentity } from "./session-store-key-DRl7Rrsc.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-Cf1GWEow.js";
import { at as loadCombinedSessionStoreForGatewayCore } from "./session-row-prepared-read-x3FXwbu8.js";
import "./session-utils-DyRtmfj4.js";
//#region src/gateway/server-session-key.ts
const RUN_LOOKUP_CACHE_LIMIT = 256;
const RUN_LOOKUP_MISS_TTL_MS = 1e3;
const resolvedSessionKeyByRunId = /* @__PURE__ */ new Map();
function runLookupCacheKey(runId, agentId) {
	return `${agentId}\0${runId}`;
}
function setResolvedSessionKeyCache(runId, agentId, sessionKey) {
	if (!runId) return;
	const cacheKey = runLookupCacheKey(runId, agentId);
	if (!resolvedSessionKeyByRunId.has(cacheKey) && resolvedSessionKeyByRunId.size >= RUN_LOOKUP_CACHE_LIMIT) pruneMapToMaxSize(resolvedSessionKeyByRunId, 255);
	let expiresAt = null;
	if (sessionKey === null) {
		const missExpiresAt = resolveExpiresAtMsFromDurationMs(RUN_LOOKUP_MISS_TTL_MS);
		if (missExpiresAt === void 0) return;
		expiresAt = missExpiresAt;
	}
	resolvedSessionKeyByRunId.set(cacheKey, {
		sessionKey,
		expiresAt
	});
}
function sessionKeyMatchesAgent(sessionKey, agentId, cfg) {
	if (cfg.session?.scope === "global" && sessionKey.trim().toLowerCase() === "global") return true;
	const normalizedAgentId = normalizeAgentId(agentId);
	if (!parseAgentSessionKey(sessionKey) && sessionKey.trim().toLowerCase().startsWith("agent:")) return false;
	try {
		return resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId
		}).agentId === normalizedAgentId;
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return false;
		throw error;
	}
}
function resolveRunSessionKeyForCaller(storeKey) {
	return toAgentRequestSessionKey(storeKey) ?? storeKey;
}
/** Resolves the caller-facing session key for an active or recently persisted run id. */
function resolveSessionKeyForRun(runId, opts = {}) {
	const cfg = getRuntimeConfig();
	const explicitAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const cached = getAgentRunContext(runId)?.sessionKey;
	if (!explicitAgentId && cached) return cached;
	const requestedAgentId = explicitAgentId ?? normalizeAgentId(resolveDefaultAgentId(cfg));
	const cacheAgentId = requestedAgentId;
	if (cached && sessionKeyMatchesAgent(cached, requestedAgentId, cfg)) {
		const sessionKey = resolveRunSessionKeyForCaller(cached);
		setResolvedSessionKeyCache(runId, cacheAgentId, sessionKey);
		return sessionKey;
	}
	const cacheKey = runLookupCacheKey(runId, cacheAgentId);
	const cachedLookup = resolvedSessionKeyByRunId.get(cacheKey);
	if (cachedLookup !== void 0) {
		if (cachedLookup.sessionKey !== null) return cachedLookup.sessionKey;
		const expiresAt = asDateTimestampMs(cachedLookup.expiresAt);
		const now = asDateTimestampMs(Date.now());
		if (expiresAt !== void 0 && now !== void 0 && expiresAt > now) return;
		resolvedSessionKeyByRunId.delete(cacheKey);
	}
	const { store } = loadCombinedSessionStoreForGatewayCore(cfg, { agentId: requestedAgentId });
	const matches = Object.entries(store).filter((entry) => entry[1]?.sessionId === runId && sessionKeyMatchesAgent(entry[0], requestedAgentId, cfg));
	const storeKey = resolvePreferredSessionKeyForSessionIdMatches(matches, runId);
	if (storeKey) {
		const sessionKey = resolveRunSessionKeyForCaller(storeKey);
		setResolvedSessionKeyCache(runId, cacheAgentId, sessionKey);
		return sessionKey;
	}
	setResolvedSessionKeyCache(runId, cacheAgentId, null);
}
/** Clears the run lookup cache for tests that mutate session stores. */
function resetResolvedSessionKeyForRunCacheForTest() {
	resolvedSessionKeyByRunId.clear();
}
//#endregion
export { resolveSessionKeyForRun as n, resetResolvedSessionKeyForRunCacheForTest as t };
