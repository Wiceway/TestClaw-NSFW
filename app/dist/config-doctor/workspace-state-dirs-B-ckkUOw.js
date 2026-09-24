import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { d as resolveAgentWorkspaceDir, j as listAgentIds, r as resolveAgentConfig } from "./agent-scope-config-BEuqweC1.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-CQnl6qMy.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-D08lnQbi.js";
import { c as assertWorkspaceStateMigrationReady } from "./workspace-legacy-state-DnXOnp9G.js";
import { i as resolveSandboxConfigForAgent } from "./config-2b4YAeh9.js";
import { r as resolveSandboxWorkspaceLayoutPaths } from "./shared-BS_-7NdN.js";
import os from "node:os";
import path from "node:path";
//#region src/agents/workspace-state-dirs.ts
/** Select configured workspaces and active sandbox copies for migration and readiness. */
async function listWorkspaceStateDirs(params) {
	const dirs = new Set(listAgentWorkspaceDirs(params.cfg, params.env));
	const agentWorkspaces = [];
	let sessionAccessor;
	for (const agentId of listAgentIds(params.cfg)) {
		if (readAgentDatabaseAdmissionRefusal(agentId, { env: params.env })) continue;
		const sandbox = resolveSandboxConfigForAgent(params.cfg, agentId);
		if (sandbox.mode === "off" || sandbox.workspaceAccess === "rw") continue;
		const configuredWorkspaceRoot = resolveAgentConfig(params.cfg, agentId)?.sandbox?.workspaceRoot ?? params.cfg.agents?.defaults?.sandbox?.workspaceRoot;
		const workspaceRoot = resolveUserPath(configuredWorkspaceRoot ?? path.join(params.stateDir, "sandboxes"), params.env, params.homedir);
		let sessionKeys = [];
		if (sandbox.scope === "session") {
			sessionAccessor ??= await import("./session-accessor-BeRUNjQG.js");
			sessionKeys = await sessionAccessor.listSessionEntryKeysReadOnly({
				agentId,
				env: params.env,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
					agentId,
					env: params.env
				})
			});
		}
		agentWorkspaces.push({
			agentId,
			sandbox,
			workspaceRoot,
			sessionKeys: sessionKeys.filter((sessionKey) => {
				const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
				return !sessionAgentId || sessionAgentId === agentId;
			})
		});
	}
	if (agentWorkspaces.length === 0) return [...dirs];
	const { resolveSandboxRuntimeStatusesForPersistedSessions } = await import("./runtime-status-DoaTFURC.js");
	const runtimeGroups = resolveSandboxRuntimeStatusesForPersistedSessions(agentWorkspaces.map(({ agentId, sessionKeys }) => ({
		cfg: params.cfg,
		env: params.env,
		agentId,
		sessionKeys
	})));
	for (const [index, { agentId, sandbox, workspaceRoot }] of agentWorkspaces.entries()) {
		if (sandbox.scope === "shared") {
			dirs.add(workspaceRoot);
			continue;
		}
		if (sandbox.scope === "agent") {
			const layout = resolveSandboxWorkspaceLayoutPaths({
				cfg: {
					...sandbox,
					workspaceRoot
				},
				agentId,
				rawSessionKey: `agent:${agentId}:main`,
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId, params.env)
			});
			dirs.add(layout.sandboxWorkspaceDir);
			continue;
		}
		for (const runtime of expectDefined(runtimeGroups[index], "sandbox runtime group")) {
			if (!runtime.sandboxed) continue;
			const layout = resolveSandboxWorkspaceLayoutPaths({
				cfg: {
					...sandbox,
					workspaceRoot
				},
				agentId,
				rawSessionKey: runtime.sessionKey,
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId, params.env)
			});
			dirs.add(layout.sandboxWorkspaceDir);
		}
	}
	return [...dirs];
}
/** Refuse completion before channels accept work that a workspace cannot execute. */
async function assertConfiguredWorkspaceStateReady(params) {
	const env = params.env ?? process.env;
	const homedir = os.homedir;
	const workspaceDirs = await listWorkspaceStateDirs({
		cfg: params.cfg,
		env,
		homedir,
		stateDir: resolveStateDir(env, homedir)
	});
	if (params.operation === "doctor" && workspaceDirs.length > 0) {
		const { readWorkspaceStateSnapshot } = await import("./workspace-state-store-DFmbon2F.js");
		for (const workspaceDir of workspaceDirs) await readWorkspaceStateSnapshot(workspaceDir, {
			env,
			readOnly: true
		});
	}
	assertWorkspaceStateMigrationReady({
		...params,
		workspaceDirs,
		env,
		homedir
	});
}
//#endregion
export { listWorkspaceStateDirs as n, assertConfiguredWorkspaceStateReady as t };
