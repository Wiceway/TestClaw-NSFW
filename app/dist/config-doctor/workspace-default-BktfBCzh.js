import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { i as resolveRequiredHomeDir } from "./home-dir-DjuHbd5R.js";
import { r as resolveProfileStateDir } from "./profile-utils-Dg5jvoU-.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import os from "node:os";
import path from "node:path";
//#region src/agents/workspace-default-path.ts
/**
* Default agent workspace resolver.
*
* Derives the process workspace directory from env, profile, and home-directory state.
*/
/** Resolve the default agent workspace directory from env/profile/home state. */
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const workspaceDir = env.TESTCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return path.resolve(workspaceDir);
	if (env.TESTCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env, homedir), "workspace");
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.TESTCLAW_PROFILE?.trim();
	if (profile && normalizeOptionalLowercaseString(profile) !== "default") return path.join(resolveProfileStateDir(profile, env, homedir), "workspace");
	return path.join(home, ".testclaw", "workspace");
}
//#endregion
//#region src/agents/workspace-default.ts
/** Default agent workspace directory for the current process environment. */
const DEFAULT_AGENT_WORKSPACE_DIR = resolveDefaultAgentWorkspaceDir();
//#endregion
export { resolveDefaultAgentWorkspaceDir as n, DEFAULT_AGENT_WORKSPACE_DIR as t };
