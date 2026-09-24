import "./fs-safe-defaults-Co7TOLqh.js";
import "./utils-BfoJTy8l.js";
import "./private-dir-mode-CfIQtph_.js";
import "node:path";
import { DEFAULT_SECRET_FILE_MAX_BYTES, readSecretFileSync } from "@testclaw/fs-safe/secret";
import "@testclaw/fs-safe";
//#region src/acp/secret-file.ts
/** Secret-file reader for ACP command-line credentials. */
const MAX_SECRET_FILE_BYTES = DEFAULT_SECRET_FILE_MAX_BYTES;
/** Reads an ACP secret file with the shared secret-file size and symlink policy. */
function readSecretFromFile(filePath, label) {
	return readSecretFileSync(filePath, label, {
		maxBytes: MAX_SECRET_FILE_BYTES,
		rejectSymlink: true
	});
}
//#endregion
export { readSecretFromFile as t };
