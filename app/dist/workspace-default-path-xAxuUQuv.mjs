import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BPqVt7Ps.mjs";
import { r as resolveProfileStateDir } from "./profile-utils-2yvqGZ0S.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import path from "node:path";
import os from "node:os";
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
export { resolveDefaultAgentWorkspaceDir as t };
