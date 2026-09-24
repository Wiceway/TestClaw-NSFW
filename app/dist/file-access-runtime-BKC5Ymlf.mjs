import "./fs-safe-advanced-CXTPw96m.mjs";
import { E as statRegularFileSync } from "./fs-safe-B1VkXzpu.mjs";
import "./path-guards-0NKGHIHl.mjs";
import "./boundary-file-read-u2SCs3-A.mjs";
import "./file-read-EjE8avWj.mjs";
import "./file-descriptor--ToewmB_.mjs";
import "./directory-durability-C18_733x.mjs";
import "./permissions-BpoR0No3.mjs";
import "./local-file-access-CpXUFBeT.mjs";
import "./file-range-DRbitcO_.mjs";
import "./fs-safe-remove-fOfd3fWw.mjs";
//#region src/plugin-sdk/file-access-runtime.ts
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
function fileExists(filePath) {
	try {
		return !statRegularFileSync(filePath).missing;
	} catch {
		return false;
	}
}
//#endregion
export { fileExists as t };
