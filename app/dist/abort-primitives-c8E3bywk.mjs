import { n as resolveGlobalMap } from "./global-singleton-DmdlcXls.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeCommandBody } from "./commands-registry-normalize-D_t-v1PZ.mjs";
import { n as normalizeAbortTriggerText, t as isAbortTrigger } from "./abort-trigger-text-C2y5d1qM.mjs";
//#region src/auto-reply/reply/abort-primitives.ts
const ABORT_MEMORY = resolveGlobalMap(Symbol.for("testclaw.abortMemory"), "close-and-restart");
const ABORT_MEMORY_MAX = 2e3;
function isAbortRequestText(text, options) {
	if (!text) return false;
	const normalized = normalizeCommandBody(text, options).trim();
	if (!normalized) return false;
	const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
	return normalizedLower === "/stop" || normalizeAbortTriggerText(normalizedLower) === "/stop" || isAbortTrigger(normalizedLower);
}
function getAbortMemory(key) {
	const normalized = key.trim();
	if (!normalized) return;
	return ABORT_MEMORY.get(normalized);
}
function pruneAbortMemory() {
	if (ABORT_MEMORY.size <= ABORT_MEMORY_MAX) return;
	const excess = ABORT_MEMORY.size - ABORT_MEMORY_MAX;
	let removed = 0;
	for (const entryKey of ABORT_MEMORY.keys()) {
		ABORT_MEMORY.delete(entryKey);
		removed += 1;
		if (removed >= excess) break;
	}
}
function setAbortMemory(key, value) {
	const normalized = key.trim();
	if (!normalized) return;
	if (!value) {
		ABORT_MEMORY.delete(normalized);
		return;
	}
	if (ABORT_MEMORY.has(normalized)) ABORT_MEMORY.delete(normalized);
	ABORT_MEMORY.set(normalized, true);
	pruneAbortMemory();
}
//#endregion
export { isAbortRequestText as n, setAbortMemory as r, getAbortMemory as t };
