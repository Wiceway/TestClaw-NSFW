import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { p as normalizeTrimmedStringList } from "./string-normalization-DsCfAx8q.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { t as CONFIG_DIR } from "./utils-BfoJTy8l.js";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-BEuqweC1.js";
import { s as isDefaultStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { p as resolveWorkspaceSkillDirectories } from "./refresh-state-BDy7E0zV.js";
import { t as resolveWorkshopSkillsDir } from "./skills-root-KReIJMyw.js";
import { a as resolvePluginSkillsDir, o as resolveSkillsUserHomeDir } from "./local-loader-XE0ssODL.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-C3EWU8xB.js";
import { i as resolvePluginSkillRootsFromMetadata, r as resolvePluginSkillRoots } from "./plugin-skills-C7XFWmHw.js";
import path from "node:path";
//#region src/skills/loading/skill-entry-metadata-path.ts
const SKILL_SOURCE_ORIGIN_FILENAME = "source-origin.json";
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = `.testclaw/${SKILL_SOURCE_ORIGIN_FILENAME}`;
//#endregion
//#region src/skills/loading/workspace-skill-sources.ts
/** Gateway-installed sources stay local; only workspace-owned files cross the boundary. */
function splitSkillSourcePlan(plan) {
	const isWorkspaceOwned = (root) => root.tier === "workspace" || (root.tier === "managed" || root.tier === "extra") && !plan.pluginSkillRoots.some((plugin) => plugin.dir === root.dir) && isPathInside(plan.workspaceDir, root.dir);
	const roots = plan.roots.map((root, order) => ({
		...root,
		order
	}));
	const gatewayRoots = roots.filter((root) => !isWorkspaceOwned(root));
	const workspaceRoots = roots.filter(isWorkspaceOwned);
	return {
		gatewayRoots,
		gatewayPlan: {
			...plan,
			roots: gatewayRoots
		},
		workspacePlan: {
			...plan,
			roots: workspaceRoots,
			pluginSkillRoots: [],
			pluginSkillsDir: void 0,
			bundledSkillsDir: void 0,
			stateDir: void 0,
			userHomeDir: void 0,
			managedSkillsDir: workspaceRoots.find((root) => root.tier === "managed")?.dir ?? path.join(plan.workspaceDir, "skills")
		}
	};
}
function resolveCustodianSkillAgentId(config, agentId, workspaceOnly = false) {
	const owner = config ? tryResolveAmbientOwnerAgentId(config) : void 0;
	return !workspaceOnly && agentId && owner && normalizeAgentId(agentId) === owner ? owner : void 0;
}
/** Source selection and precedence are shared by local discovery and provisioned remote discovery. */
function resolveWorkspaceSkillSourcePlan(workspaceDir, opts) {
	const workspaceOnly = opts?.workspaceOnly === true;
	const userHomeDir = resolveSkillsUserHomeDir();
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolvePluginSkillsDir();
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const bundledSkillsDir = workspaceOnly ? void 0 : opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const pluginParams = {
		workspaceDir,
		config: opts?.config,
		pluginSkillsDir
	};
	const pluginSkillRoots = workspaceOnly ? [] : opts?.pluginMetadataSnapshot ? resolvePluginSkillRootsFromMetadata({
		...pluginParams,
		metadataSnapshot: opts.pluginMetadataSnapshot
	}) : resolvePluginSkillRoots(pluginParams);
	const roots = [];
	if (!workspaceOnly) {
		roots.push(...normalizeTrimmedStringList(opts?.config?.skills?.load?.extraDirs ?? []).map((dir) => ({
			dir: resolveUserPath(dir),
			source: "testclaw-extra",
			tier: "extra"
		})));
		roots.push(...pluginSkillRoots.map((root) => ({
			...root,
			source: "testclaw-extra",
			tier: "extra"
		})));
		if (bundledSkillsDir) {
			roots.push({
				dir: bundledSkillsDir,
				source: "testclaw-bundled",
				tier: "bundled"
			});
			if (resolveCustodianSkillAgentId(opts?.config, opts?.agentId)) roots.push({
				dir: path.join(path.dirname(bundledSkillsDir), "custodian-skills"),
				source: "testclaw-custodian",
				tier: "bundled"
			});
		}
		if (opts?.config && opts.agentId) roots.push({
			dir: resolveWorkshopSkillsDir(opts.config, opts.agentId),
			source: "testclaw-workshop",
			tier: "workshop"
		});
		roots.push({
			dir: managedSkillsDir,
			source: "testclaw-managed",
			tier: "managed"
		});
		if (isDefaultStateDir()) roots.push({
			dir: path.resolve(userHomeDir ?? ".", ".agents", "skills"),
			source: "agents-skills-personal",
			tier: "personal"
		});
	}
	roots.push(...resolveWorkspaceSkillDirectories(workspaceDir, workspaceOnly).map(({ dir, source }) => ({
		dir,
		source,
		tier: "workspace"
	})));
	return {
		roots,
		allowSymlinkTargets: normalizeTrimmedStringList(opts?.config?.skills?.load?.allowSymlinkTargets ?? []).map((dir) => resolveUserPath(dir)),
		pluginSkillsDir,
		pluginSkillRoots,
		managedSkillsDir,
		bundledSkillsDir,
		stateDir: CONFIG_DIR,
		userHomeDir,
		workspaceDir
	};
}
//#endregion
export { SKILL_SOURCE_ORIGIN_RELATIVE_PATH as a, SKILL_SOURCE_ORIGIN_FILENAME as i, resolveWorkspaceSkillSourcePlan as n, splitSkillSourcePlan as r, resolveCustodianSkillAgentId as t };
