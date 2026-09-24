import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-BTtONgO0.js";
import fs from "node:fs";
import path from "node:path";
//#region src/cli/gateway-dispatch-dotenv.ts
/** Load only the env files needed before dispatching a command through the gateway. */
async function loadGatewayDispatchCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd && fs.existsSync(path.join(cwd, ".env"))) {
		const { loadCliDotEnv } = await import("./dotenv-Bxg-PUHy.js");
		loadCliDotEnv({ quiet });
		return;
	}
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
//#endregion
export { loadGatewayDispatchCliDotEnv };
