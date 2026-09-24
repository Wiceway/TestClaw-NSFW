import { a as writeRuntimeJson } from "./runtime-Dg6PE4Mj.mjs";
import { p as shortenHomePath } from "./utils-Dy46mFy2.mjs";
import { i as normalizeConfigIssues } from "./issue-format-BQNShMey.mjs";
import { r as formatCliJsonFailure } from "./failure-output-BDwPHdmu.mjs";
//#region src/cli/config-validation-output.ts
/** Render one failure document; the caller retains its existing exit and recovery policy. */
function writeInvalidConfigCliJson(runtime, snapshot) {
	writeRuntimeJson(runtime, {
		...formatCliJsonFailure(`Assistant config is invalid: ${shortenHomePath(snapshot.path)}`),
		issues: normalizeConfigIssues(snapshot.issues)
	});
}
//#endregion
export { writeInvalidConfigCliJson };
