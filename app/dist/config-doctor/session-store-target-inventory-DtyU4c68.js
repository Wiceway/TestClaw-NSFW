import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { l as resolveSessionStorePathCore, n as resolveAgentsDirFromSessionStorePath } from "./paths-ViQaz2td.js";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-DabXpPmk.js";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-cXJW6Bip.js";
import { i as tryGetLegacyDefaultAgentId, r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-C3BvcqUT.js";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import "./session-accessor.sqlite-entry-store-BzD1qpup.js";
import { i as resolveCapturedSessionStorePath, n as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-DLysF7hk.js";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath, i as listSqliteTargetCandidatePathsForSessionStorePath, s as resolveSqliteTargetFromSessionStorePath, t as SessionStoreRegistryReadRequired } from "./session-sqlite-target-BANhXeoo.js";
import "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-BMYuBnL9.js";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-SATsXf4g.js";
import { c as resolveExistingAgentSessionStoreTargetsSync, f as listConfiguredSessionStoreAgentIds, p as dedupeSessionStoreTargetsBySqliteTarget, u as shouldSkipDiscoveryError } from "./targets-BxNVBaMw.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/targets-read-availability.ts
function resolveReadDefaultAgentId(cfg, targetAgentId) {
	const persistedOwner = resolvePersistedSessionStoreOwner(cfg);
	return persistedOwner.kind === "none" ? normalizeAgentId(targetAgentId) : persistedOwner.agentId;
}
function dedupeTargetsByStorePath(targets) {
	return [...new Map(targets.map((target) => [target.storePath, target])).values()];
}
function readSessionStoreTargetSnapshot(params) {
	const databasePath = params.readCandidates ? assertSessionStoreReadCandidate(params.sqlitePath, params.readCandidates) : params.sqlitePath;
	const cacheKey = path.resolve(params.sqlitePath);
	const cached = params.cache?.get(cacheKey);
	if (cached) return cached;
	let snapshot;
	if (!fs.existsSync(params.sqlitePath)) snapshot = {
		available: false,
		reason: "database-missing"
	};
	else try {
		const result = withAssistantAgentDatabaseReadOnly((database) => {
			const scopedAgentIds = /* @__PURE__ */ new Set();
			let hasUnscopedRow = false;
			for (const sessionKey of iterateSessionEntryKeys(database)) {
				const parsed = parseAgentSessionKey(sessionKey);
				if (parsed) scopedAgentIds.add(normalizeAgentId(parsed.agentId));
				else hasUnscopedRow = true;
			}
			return {
				databaseAgentId: params.databaseAgentId,
				databasePath,
				hasUnscopedRow,
				scopedAgentIds
			};
		}, {
			agentId: params.databaseAgentId,
			env: params.env,
			path: databasePath
		});
		snapshot = result.found ? {
			available: true,
			...result.value
		} : {
			available: false,
			reason: result.reason
		};
	} catch {
		snapshot = {
			available: false,
			reason: "read-failed"
		};
	}
	params.cache?.set(cacheKey, snapshot);
	return snapshot;
}
function resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, params) {
	const storeConfig = cfg.session?.store;
	const defaultAgentId = resolveReadDefaultAgentId(cfg, requested);
	const fixedTarget = {
		agentId: requested,
		storePath: resolveCapturedSessionStorePath(storeConfig, requested, env, params.readPaths)
	};
	try {
		const configuredTargets = listConfiguredSessionStoreAgentIds(cfg).map((configuredAgentId) => ({
			agentId: configuredAgentId,
			storePath: resolveCapturedSessionStorePath(storeConfig, configuredAgentId, env, params.readPaths)
		}));
		if (!configuredTargets.some((target) => normalizeAgentId(target.agentId) === requested)) configuredTargets.push(fixedTarget);
		const resolvedTarget = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, {
			agentId: requested,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		});
		const snapshot = readSessionStoreTargetSnapshot({
			cache: params.cache,
			databaseAgentId: normalizeAgentId(resolvedTarget.agentId ?? defaultAgentId),
			env,
			sqlitePath: resolvedTarget.path,
			readCandidates: params.readCandidates
		});
		if (!snapshot.available) return snapshot;
		if (snapshot.scopedAgentIds.has(requested)) {
			params.onResolvedTarget?.(fixedTarget, {
				agentId: snapshot.databaseAgentId,
				path: snapshot.databasePath
			});
			return {
				available: true,
				targets: [fixedTarget]
			};
		}
		if (!(resolvedTarget.shared === true || dedupeSessionStoreTargetsBySqliteTarget(configuredTargets, {
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		}).some((target) => normalizeAgentId(target.agentId) === requested))) return {
			available: false,
			reason: "read-failed"
		};
		const ownsUnscopedRows = snapshot.databaseAgentId === requested && snapshot.hasUnscopedRow;
		if (ownsUnscopedRows) params.onResolvedTarget?.(fixedTarget, {
			agentId: snapshot.databaseAgentId,
			path: snapshot.databasePath
		});
		return {
			available: true,
			targets: ownsUnscopedRows ? [fixedTarget] : []
		};
	} catch (error) {
		if (error instanceof SessionStoreRegistryReadRequired) throw error;
		return {
			available: false,
			reason: "read-failed"
		};
	}
}
/** Resolves every plausible store while preserving read availability and ownership. */
function resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	if (!isPerAgentSessionStoreConfig(cfg.session?.store)) return resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, params);
	const candidates = dedupeTargetsByStorePath([{
		agentId: requested,
		storePath: resolveCapturedSessionStorePath(cfg.session?.store, requested, env, params.readPaths)
	}, ...resolveExistingAgentSessionStoreTargetsSync(cfg, requested, {
		env,
		registeredDatabases: params.registeredDatabases,
		readCandidates: params.readCandidates,
		readPaths: params.readPaths
	})]);
	const targets = [];
	for (const target of candidates) {
		const defaultAgentId = resolveReadDefaultAgentId(cfg, target.agentId);
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		});
		const snapshot = readSessionStoreTargetSnapshot({
			cache: params.cache,
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			env,
			sqlitePath: resolved.path,
			readCandidates: params.readCandidates
		});
		if (!snapshot.available) {
			if (snapshot.reason === "database-missing") continue;
			return snapshot;
		}
		targets.push(target);
		params.onResolvedTarget?.(target, {
			agentId: snapshot.databaseAgentId,
			path: snapshot.databasePath
		});
	}
	if (targets.length === 0) return {
		available: false,
		reason: "database-missing"
	};
	return {
		available: true,
		targets
	};
}
//#endregion
//#region src/config/sessions/session-store-target-inventory.ts
function captureSessionStoreReadCandidates(storePath) {
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const candidates = /* @__PURE__ */ new Map();
	const add = (candidate) => candidates.set(JSON.stringify(candidate), candidate);
	if (!target.agentId && !target.shared) add(captureSessionStoreReadCandidate(target.path, "sibling-family"));
	add(captureSessionStoreReadCandidate(target.path));
	try {
		for (const candidate of listSqliteTargetCandidatePathsForSessionStorePath(storePath)) add(captureSessionStoreReadCandidate(candidate));
	} catch {}
	return [...candidates.values()];
}
/** Capture locators and bounded families without reading SQLite or assigning an owner. */
function prepareSessionStoreTargetInventory(cfg, inputAgentIds, inputEnv = process.env) {
	const env = cloneEnvWithPlatformSemantics(inputEnv);
	const stateDir = resolveStateDir(env);
	env.TESTCLAW_STATE_DIR = stateDir;
	const config = structuredClone(cfg);
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(cfg);
	retainLegacyDefaultAgentId(config, legacyDefaultAgentId);
	const agentIds = [...new Set(inputAgentIds.map(normalizeAgentId))];
	const configured = listConfiguredSessionStoreAgentIds(config);
	const paths = new Map([.../* @__PURE__ */ new Set([...agentIds, ...configured])].map((agentId) => [agentId, {
		configured: resolveSessionStorePathCore(config.session?.store, {
			agentId,
			env
		}),
		default: resolveSessionStorePathCore(void 0, {
			agentId,
			env
		})
	}]));
	const perAgent = isPerAgentSessionStoreConfig(config.session?.store);
	const retired = new Set(agentIds.filter((agentId) => !configured.includes(agentId)));
	const logicalPaths = new Set(agentIds.flatMap((agentId) => {
		const captured = paths.get(agentId);
		return perAgent ? [captured.configured, captured.default] : [captured.configured];
	}));
	if (perAgent && retired.size > 0) for (const agentId of configured) logicalPaths.add(paths.get(agentId).configured);
	const roots = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
	for (const value of paths.values()) {
		const root = resolveAgentsDirFromSessionStorePath(value.configured);
		if (root) roots.add(root);
	}
	if (perAgent) {
		if (retired.size > 0) for (const root of roots) try {
			for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(root, (name) => retired.has(normalizeAgentId(name)))) logicalPaths.add(path.join(sessionsDir, "sessions.json"));
		} catch (error) {
			if (!shouldSkipDiscoveryError(error)) throw error;
		}
	}
	const candidates = /* @__PURE__ */ new Map();
	const add = (candidate) => candidates.set(JSON.stringify(candidate), candidate);
	for (const storePath of logicalPaths) {
		const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
		if (agentIds.some((agentId) => isIncognitoAssistantAgentSqlitePath(target.path, {
			agentId,
			env
		}))) throw new Error("Incognito session discovery requires its process-held owner");
		for (const candidate of captureSessionStoreReadCandidates(storePath)) add(candidate);
	}
	return {
		config,
		legacyDefaultAgentId,
		agentIds,
		env: {
			...env,
			TESTCLAW_STATE_DIR: env.TESTCLAW_STATE_DIR
		},
		paths,
		candidates: [...candidates.values()]
	};
}
//#endregion
export { prepareSessionStoreTargetInventory as n, resolveExistingAgentSessionStoreTargetsReadOnlyResult as r, captureSessionStoreReadCandidates as t };
