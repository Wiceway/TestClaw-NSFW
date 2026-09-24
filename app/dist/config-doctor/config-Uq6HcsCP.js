import { p as readCurrentConfigForResolution } from "./io.runtime-C0vFx1Ic.js";
import { t as resolveInstallAgentDir } from "./install-agent-dir-Bb_wxFL0.js";
import { join } from "node:path";
//#region src/agents/config.ts
/** Resolves per-user agent directories for CLI and runtime callers. */
/** Prepare one config, environment, and directory decision for a standalone SDK operation. */
function getAgentDirResolution(agentDir) {
	return resolveInstallAgentDir((env) => readCurrentConfigForResolution({ env }), { agentDir });
}
/** Standalone SDK default; configured sessions pass their resolved agentDir. */
function getAgentDir() {
	return getAgentDirResolution().directory.dir;
}
/** Get path to managed binaries directory (fd, rg) */
function getBinDir() {
	const directory = getAgentDirResolution().optionalDirectory;
	return directory ? join(directory.dir, "bin") : void 0;
}
//#endregion
export { getAgentDirResolution as n, getBinDir as r, getAgentDir as t };
