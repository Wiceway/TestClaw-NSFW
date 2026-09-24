import "./fs-safe-defaults-Co7TOLqh.js";
import { writeSiblingTempFile } from "@testclaw/fs-safe/advanced";
//#region src/infra/sibling-temp-file.ts
async function writeSiblingTempFile$1(options) {
	return await writeSiblingTempFile({
		...options,
		producerIsolation: "private-directory"
	});
}
//#endregion
export { writeSiblingTempFile$1 as t };
