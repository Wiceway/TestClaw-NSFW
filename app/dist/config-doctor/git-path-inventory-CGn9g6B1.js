import "./errors-cp9Var1Z.js";
import path from "node:path";
import "node:fs/promises";
//#region src/agents/worktrees/git-path-inventory.ts
function splitNullBuffer(input) {
	const bytes = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
	const fields = [];
	let start = 0;
	for (let index = 0; index < bytes.length; index++) {
		if (bytes[index] !== 0) continue;
		if (index > start) fields.push(bytes.subarray(start, index));
		start = index + 1;
	}
	if (start < bytes.length) fields.push(bytes.subarray(start));
	return fields;
}
/** Emits only nonempty batches using the existing soft count/byte thresholds. */
function* gitPathspecBatches(paths) {
	let offset = 0;
	while (offset < paths.length) {
		const batch = [];
		let bytes = 0;
		while (offset < paths.length && (batch.length === 0 || batch.length < 128 && bytes < 16384)) {
			const entry = paths[offset++];
			batch.push(entry);
			bytes += Buffer.byteLength(entry) + 1;
		}
		yield batch;
	}
}
function checkoutPathFromGitBytes(checkoutRoot, gitPath) {
	if (process.platform === "win32") return path.join(checkoutRoot, ...gitPath.toString("utf8").split("/"));
	return Buffer.concat([
		Buffer.from(checkoutRoot),
		Buffer.from(path.sep),
		gitPath
	]);
}
//#endregion
export { gitPathspecBatches as n, splitNullBuffer as r, checkoutPathFromGitBytes as t };
