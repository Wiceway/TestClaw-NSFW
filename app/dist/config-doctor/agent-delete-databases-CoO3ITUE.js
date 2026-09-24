import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { n as normalizeAgentDirRegistryPath, t as isPathOwnedByAnotherRegisteredAgent } from "./agent-dir-registry-DyxBacoA.js";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-Bm4Vx3bT.js";
import { a as resolveAssistantAgentSqlitePath, i as resolveIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-C3BvcqUT.js";
import "./agent-scope-BiRi-Smp.js";
import "./testclaw-agent-db-Ckg86YCZ.js";
import { a as assertNoAssistantAgentDatabaseLeases } from "./testclaw-agent-db-lease-D4ARpQMO.js";
import { o as closeAssistantAgentDatabaseByPathAsync, u as inspectAssistantAgentDatabaseOwner } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { i as listAssistantRegisteredAgentDatabases, r as invalidateRegisteredAgentDatabasesMemo } from "./testclaw-agent-db-registry-listing-DBxqeFUz.js";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BANhXeoo.js";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-D3qyHSfA.js";
import path from "node:path";
//#region src/agents/agent-delete-databases.ts
/** Destructive planning includes every registered owner, regardless of runtime schema readiness. */
function readAgentDeleteDatabaseRegistry(options = {}) {
	invalidateRegisteredAgentDatabasesMemo(options);
	return listAssistantRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	});
}
var AgentSharedStoreOwnerError = class extends Error {};
/** Check before journaling: retaining the file alone would still fence its shared owner. */
function assertAgentSessionStoreDeletionSafe(cfg, agentId, options = {}) {
	if (!cfg.session?.store?.trim()) return;
	const id = normalizeAgentId(agentId);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const registeredDatabases = readAgentDeleteDatabaseRegistry(options);
	for (const survivorId of listAgentIds(cfg)) {
		if (normalizeAgentId(survivorId) === id) continue;
		const storePath = resolveSessionStorePathCore(cfg.session.store, {
			agentId: survivorId,
			env: options.env
		});
		const target = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: survivorId,
			defaultAgentId,
			env: options.env,
			registeredDatabases
		});
		const owner = inspectAssistantAgentDatabaseOwner(target.path);
		if (owner.status === "owned" && owner.agentId === id) throw new AgentSharedStoreOwnerError(`Agent "${id}" owns the session database still used by agent "${survivorId}" and cannot be deleted. Keep this owner configured until shared history can be moved with a supported migration; no such migration is currently available.`);
	}
}
function resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId, env) {
	return [...new Set(registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) !== agentId).flatMap((entry) => resolveSqliteDatabaseFilePaths(entry.path)).map((pathname) => normalizeAgentDirRegistryPath(pathname, env)))];
}
function isPathOwnedBySurvivingAgent(cfg, agentId, pathname, survivingDatabaseFilePaths = [], env) {
	const canonicalPath = normalizeAgentDirRegistryPath(pathname, env);
	return isPathOwnedByAnotherRegisteredAgent({
		agentId,
		pathname,
		env
	}) || findOverlappingWorkspaceAgentIds(cfg, agentId, pathname, env).length > 0 || survivingDatabaseFilePaths.some((databasePath) => databasePath === canonicalPath || isPathInside(databasePath, canonicalPath) || isPathInside(canonicalPath, databasePath));
}
async function prepareAgentDeleteDatabases(cfg, agentId, agentDir, options = {}) {
	const registeredDatabases = readAgentDeleteDatabaseRegistry(options);
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId, options.env);
	const registeredDatabasePaths = /* @__PURE__ */ new Set([resolveAssistantAgentSqlitePath({
		agentId,
		env: options.env,
		path: path.join(agentDir, "testclaw-agent.sqlite")
	}), ...registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) === agentId).map((entry) => entry.path)]);
	for (const databasePath of registeredDatabasePaths) await closeAssistantAgentDatabaseByPathAsync(databasePath, agentId);
	await closeAssistantAgentDatabaseByPathAsync(resolveIncognitoAssistantAgentSqlitePath({
		agentId,
		env: options.env
	}), agentId);
	const databasePaths = [...registeredDatabasePaths].filter((pathname) => resolveSqliteDatabaseFilePaths(pathname).every((filePath) => !isPathOwnedBySurvivingAgent(cfg, agentId, filePath, survivingDatabaseFilePaths, options.env)));
	assertNoAssistantAgentDatabaseLeases(agentId, options);
	const fileGroups = databasePaths.map(resolveSqliteDatabaseFilePaths);
	const relocatedFileGroups = fileGroups.filter((fileGroup) => {
		const relative = path.relative(agentDir, fileGroup[0] ?? agentDir);
		return relative.startsWith("..") || path.isAbsolute(relative);
	});
	return {
		registrationPaths: [...registeredDatabasePaths],
		fileGroups,
		relocatedFileGroups
	};
}
//#endregion
export { readAgentDeleteDatabaseRegistry as a, prepareAgentDeleteDatabases as i, assertAgentSessionStoreDeletionSafe as n, resolveSurvivingDatabaseFilePaths as o, isPathOwnedBySurvivingAgent as r, AgentSharedStoreOwnerError as t };
