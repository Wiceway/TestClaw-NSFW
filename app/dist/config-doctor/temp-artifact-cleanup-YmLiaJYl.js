import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.js";
import fs from "node:fs/promises";
//#region src/infra/temp-artifact-cleanup.ts
const log = createSubsystemLogger("infra:temp-artifacts");
function removeTemporaryArtifacts(directory, owner) {
	return runBestEffortCleanup({
		cleanup: () => fs.rm(directory, {
			recursive: true,
			force: true
		}),
		onError: (error) => log.warn(truncateUtf16Safe(formatErrorMessage(`${owner} cleanup failed; files may remain in ${directory}. After the worker or session stops, check permissions and remove the retained directory: ${formatErrorMessage(error)}`), 1024))
	});
}
//#endregion
export { removeTemporaryArtifacts as t };
