import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { a as writeRuntimeJson } from "./runtime-kM7jday_.js";
import { i as normalizeConfigIssues } from "./issue-format-DXdS88Yb.js";
import { r as formatCliJsonFailure } from "./failure-output-B62fEQHE.js";
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
