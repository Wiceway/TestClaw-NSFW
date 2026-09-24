import "./fs-safe-defaults-Co7TOLqh.js";
import { n as replaceFileAtomic } from "./replace-file-GThucKH8.js";
import { createAsyncLock } from "@testclaw/fs-safe/advanced";
import { JsonFileReadError, readJson, readJsonIfExists, readJsonIfExists as readDurableJsonFile, readJsonSync, readRootJsonObjectSync as readRootJsonObjectSync$1, tryReadJson, tryReadJson as readJsonFile, tryReadJsonSync as tryReadJsonSync$1, writeJson, writeJson as writeJsonAtomic } from "@testclaw/fs-safe/json";
//#region src/infra/json-files.ts
/** Writes text through the repo atomic replace helper with durable fsync by default. */
async function writeTextAtomic(filePath, content, options) {
	const payload = options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content;
	await replaceFileAtomic({
		filePath,
		content: payload,
		mode: options?.mode ?? 384,
		dirMode: options?.dirMode ?? 511 & ~process.umask(),
		copyFallbackOnPermissionError: true,
		syncTempFile: options?.durable !== false,
		syncParentDir: options?.durable !== false,
		...options?.beforeRename ? { beforeRename: options.beforeRename } : {},
		...options?.tempPrefix ? { tempPrefix: options.tempPrefix } : {}
	});
}
//#endregion
export { readJsonFile as a, readRootJsonObjectSync$1 as c, writeJson as d, writeJsonAtomic as f, readJson as i, tryReadJson as l, createAsyncLock as n, readJsonIfExists as o, writeTextAtomic as p, readDurableJsonFile as r, readJsonSync as s, JsonFileReadError as t, tryReadJsonSync$1 as u };
