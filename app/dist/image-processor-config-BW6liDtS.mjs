import { n as resolvePreferredAssistantTmpDir } from "./tmp-testclaw-dir-DCm0nmdl.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-MH8LviEm.mjs";
import { createRastermill } from "rastermill";
//#region src/media/image-processor-config.ts
/** Shared input/output pixel cap for Rastermill-backed image operations. */
const MAX_IMAGE_INPUT_PIXELS = 25e6;
function createLocalImageProcessor(execution, limits = {
	inputPixels: MAX_IMAGE_INPUT_PIXELS,
	outputPixels: MAX_IMAGE_INPUT_PIXELS
}) {
	return createRastermill({
		execution,
		limits,
		temp: {
			rootDir: resolvePreferredAssistantTmpDir(),
			prefix: "testclaw-img-"
		},
		commandResolver: (command) => resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" })
	});
}
//#endregion
export { createLocalImageProcessor as n, MAX_IMAGE_INPUT_PIXELS as t };
