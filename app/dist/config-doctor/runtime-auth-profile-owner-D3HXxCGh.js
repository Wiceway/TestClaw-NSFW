import { c as resolveSharedAuthStorePath } from "./path-resolve-C56x-mXN.js";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-C9aIS6tB.js";
//#region src/secrets/runtime-auth-profile-owner.ts
/** Stable SecretRef owner identity for one agent-scoped auth profile. */
/** Tuple encoding distinguishes agents and avoids path/profile separator collisions. */
function resolveAuthProfileSecretOwnerId(params) {
	const storePath = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath();
	return JSON.stringify([storePath, params.profileId]);
}
//#endregion
export { resolveAuthProfileSecretOwnerId as t };
