import { r as isPathInside } from "./path-guards-0NKGHIHl.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { n as normalizeAgentDirRegistryPath, t as isPathOwnedByAnotherRegisteredAgent } from "./agent-dir-registry-CQCroiny.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-C-WRgKDI.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BGzENJvG.mjs";
import { a as resolveAssistantAgentSqlitePath, i as resolveIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { l as resolveSessionStorePathCore } from "./paths-D1bkI3aW.mjs";
import "./agent-scope-_30Scclc.mjs";
import { a as assertNoAssistantAgentDatabaseLeases } from "./testclaw-agent-db-lease-gzW677CG.mjs";
import { o as closeAssistantAgentDatabaseByPathAsync, u as inspectAssistantAgentDatabaseOwner } from "./testclaw-agent-db-lifecycle-BQsqjh85.mjs";
import "./testclaw-agent-db-DAdiee0a.mjs";
import { i as listAssistantRegisteredAgentDatabases, r as invalidateRegisteredAgentDatabasesMemo } from "./testclaw-agent-db-registry-listing-bY5cRH88.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CBM31t7c.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-g2qQuMJc.mjs";
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
