import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { n as runExec } from "./exec-BXnQTpXR.js";
//#region src/infra/binaries.ts
async function ensureBinary(name, exec = runExec, runtime = defaultRuntime) {
	await exec("which", [name]).catch(() => {
		runtime.error(`Missing required binary: ${name}. Please install it.`);
		runtime.exit(1);
	});
}
//#endregion
export { ensureBinary };
