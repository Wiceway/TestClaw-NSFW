import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { b as isSessionArchiveArtifactName } from "./paths-ViQaz2td.js";
import { h as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal-Bk2FCp74.js";
import { a as unregisterAssistantAgentDatabase, n as isPersistentAssistantAgentDatabasePath, t as createAssistantAgentDatabasePathMatcher } from "./testclaw-agent-db-registry-DgP56LUX.js";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-SATsXf4g.js";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-DKFLGAzG.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.media-persistence-targets.ts
/** Discover maintenance targets without mutating the registry or creating stores. */
function discoverAgentDatabaseMigrationTargets(params) {
	const warnings = [];
	const externalWarnings = [];
	const retainedDeletions = params.retainedDeletions ?? readAgentDatabaseDeletionSnapshot(params.env)?.retainedDeletions ?? "unavailable";
	const classifyDeletion = createAgentDatabaseDeletionClassifier({
		...params,
		retainedDeletions
	});
	const failures = [];
	const registryRemovals = [];
	const sourceIdentities = /* @__PURE__ */ new Map();
	const failure = (pathname, reason) => {
		warnings.push(reason);
		failures.push({
			path: pathname,
			reason
		});
	};
	const discard = (candidate, change) => {
		if (candidate.source === "registry" && retainedDeletions !== "unavailable") registryRemovals.push({
			agentId: candidate.agentId,
			path: candidate.path,
			change
		});
	};
	const candidates = [
		...params.configuredAgentDatabaseTargets.map((target) => ({
			...target,
			source: "configured"
		})),
		...params.registeredAgentDatabases.map((entry) => ({
			...entry,
			source: "registry"
		})),
		...(retainedDeletions === "unavailable" ? [] : retainedDeletions).flatMap((entry) => entry.databasePaths.map((pathname) => ({
			agentId: entry.agentId,
			path: pathname,
			source: "disk"
		})))
	];
	const activeStateDir = resolveStateDir(params.env);
	const agentsDir = path.join(activeStateDir, "agents");
	try {
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
			const agentDir = path.dirname(sessionsDir);
			candidates.push({
				agentId: normalizeAgentId(path.basename(agentDir)),
				path: path.join(agentDir, "agent", "testclaw-agent.sqlite"),
				source: "disk"
			});
		}
	} catch (error) {
		failure(agentsDir, `Could not enumerate agent databases under ${agentsDir}: ${String(error)}`);
	}
	let activeStateDirRealPath;
	try {
		activeStateDirRealPath = fs.realpathSync.native(activeStateDir);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) failure(activeStateDir, `Could not resolve active state directory ${activeStateDir}: ${String(error)}`);
	}
	const configuredPathMatcher = createAssistantAgentDatabasePathMatcher();
	const targets = [];
	const seenPhysicalFiles = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const pathname = candidate.path;
		if (!isPersistentAssistantAgentDatabasePath(pathname, params.env)) {
			discard(candidate, `Removed archived or transient agent database registry entry ${pathname}.`);
			continue;
		}
		let realPath;
		try {
			realPath = fs.realpathSync.native(pathname);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) failure(pathname, `Could not resolve agent database ${pathname}: ${String(error)}`);
		}
		sourceIdentities.set(pathname, { realPath });
		const deletion = classifyDeletion(pathname, candidate.agentId);
		const isConfiguredPath = realPath !== void 0 && params.configuredAgentDatabaseTargets.some((configuredTarget) => {
			if (normalizeAgentId(configuredTarget.agentId) !== normalizeAgentId(candidate.agentId)) return false;
			try {
				return configuredPathMatcher(pathname, configuredTarget.path);
			} catch {
				return false;
			}
		});
		const isInsideActiveStateDir = Boolean(realPath && activeStateDirRealPath && (realPath === activeStateDirRealPath || isPathInside(activeStateDirRealPath, realPath)));
		if (realPath && !isInsideActiveStateDir && !isConfiguredPath && !deletion) {
			discard(candidate);
			const warning = `Skipped foreign agent database ${sanitizeForLog(pathname)}; it is outside the active state directory and is not a configured session store.`;
			warnings.push(warning);
			externalWarnings.push(warning);
			continue;
		}
		let stat;
		try {
			stat = fs.statSync(pathname, { bigint: true });
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) {
				failure(pathname, `Could not inspect ${candidate.source === "registry" ? "registered " : ""}agent database ${pathname}: ${String(error)}`);
				continue;
			}
		}
		if (!stat?.isFile()) {
			discard(candidate, `Removed missing agent database registry entry ${pathname}.`);
			if (candidate.source === "registry") warnings.push(`Skipped missing registered agent database ${pathname}.`);
			continue;
		}
		if (!realPath) {
			discard(candidate);
			failure(pathname, `Skipped agent database ${pathname}; its filesystem boundary is unresolved.`);
			continue;
		}
		const physicalFile = `${stat.dev}:${stat.ino}`;
		if (seenPhysicalFiles.has(physicalFile)) continue;
		if (deletion) {
			if (classifyDeletion(pathname)) {
				seenPhysicalFiles.add(physicalFile);
				warnings.push(`Held agent ${sanitizeForLog(deletion === "unavailable" ? candidate.agentId : deletion.agentId)} database ${sanitizeForLog(pathname)} (${deletion === "unavailable" ? "deletion journal unavailable" : "retained-by-deletion"}); run ${formatCliCommand("testclaw doctor --fix", params.env)} to inspect restoration.`);
			}
			continue;
		}
		seenPhysicalFiles.add(physicalFile);
		targets.push({
			...candidate,
			path: pathname,
			realPath
		});
	}
	return {
		targets,
		retainedDeletions,
		registryRemovals,
		warnings,
		externalWarnings,
		failures,
		sourceIdentities
	};
}
/** Migration alone owns cleanup of stale registry entries discovered above. */
function resolveAgentDatabaseMigrationTargets(params) {
	const snapshot = readAgentDatabaseDeletionSnapshot(params.env);
	const retainedDeletions = params.preparedDiscovery?.stateDir === resolveStateDir(params.env) && params.preparedDiscovery?.discovery.retainedDeletions === "unavailable" ? "unavailable" : snapshot?.retainedDeletions ?? "unavailable";
	const discovery = discoverAgentDatabaseMigrationTargets({
		...params,
		registeredAgentDatabases: snapshot?.registeredAgentDatabases ?? [],
		retainedDeletions
	});
	for (const removed of discovery.registryRemovals) {
		unregisterAssistantAgentDatabase({
			...removed,
			env: params.env
		});
		if (removed.change) params.changes.push(removed.change);
	}
	params.warnings.push(...discovery.warnings);
	return {
		targets: discovery.targets,
		recoverableWarningCount: discovery.failures.length > 0 ? 0 : discovery.warnings.length
	};
}
function listTranscriptArchives(directory) {
	let entries;
	try {
		entries = fs.readdirSync(directory, { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	return entries.filter((entry) => entry.isFile() && entry.name.includes(".jsonl.") && isSessionArchiveArtifactName(entry.name)).map((entry) => path.join(directory, entry.name));
}
//#endregion
export { listTranscriptArchives as n, resolveAgentDatabaseMigrationTargets as r, discoverAgentDatabaseMigrationTargets as t };
