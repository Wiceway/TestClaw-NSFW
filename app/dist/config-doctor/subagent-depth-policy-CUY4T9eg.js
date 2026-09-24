import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { x as parseStrictNonNegativeInteger } from "./number-coercion-0M4tZV2c.js";
import { _ as getSubagentDepth } from "./session-key-AvQIavYt.js";
//#region packages/acp-core/src/session-interaction-mode.ts
function resolveAcpSessionInteractionMode(entry) {
	if (!entry?.acp) return "interactive";
	if (normalizeOptionalString(entry.spawnedBy) || normalizeOptionalString(entry.parentSessionKey)) return "parent-owned-background";
	return "interactive";
}
/** Returns true for ACP sessions delegated from a parent session instead of user-facing chat. */
function isParentOwnedBackgroundAcpSession(entry) {
	return resolveAcpSessionInteractionMode(entry) === "parent-owned-background";
}
/**
* Returns true when `entry` is a parent-owned background ACP session AND the
* given `requesterSessionKey` is the session that spawned/owns it. This is a
* strictly narrower check than {@link isParentOwnedBackgroundAcpSession}: the
* target must match *and* the caller must be the parent.
*
* Used to gate behaviors that only make sense for the parent↔own-child pair
* (e.g. skipping the A2A ping-pong flow in `sessions_send`), so that an
* unrelated session with broad visibility (e.g. `tools.sessions.visibility=all`)
* sending to the same target is still routed through the normal A2A path.
*/
function isRequesterParentOfBackgroundAcpSession(entry, requesterSessionKey) {
	if (!isParentOwnedBackgroundAcpSession(entry)) return false;
	const requester = normalizeOptionalString(requesterSessionKey);
	if (!requester) return false;
	const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
	const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
	return requester === spawnedBy || requester === parentSessionKey;
}
//#endregion
//#region src/agents/subagents/spawn/subagent-depth-policy.ts
function normalizeSpawnDepth(value) {
	if (typeof value === "number") return Number.isInteger(value) && value >= 0 ? value : void 0;
	if (typeof value === "string") return parseStrictNonNegativeInteger(value);
}
function getSubagentDepthFromEntryLookup(sessionKey, resolveEntry) {
	const raw = (sessionKey ?? "").trim();
	const fallbackDepth = getSubagentDepth(raw);
	if (!raw) return fallbackDepth;
	const visited = /* @__PURE__ */ new Set();
	const depthFromStore = (key) => {
		const normalizedKey = normalizeOptionalString(key);
		if (!normalizedKey) return;
		if (visited.has(normalizedKey)) return;
		visited.add(normalizedKey);
		const entry = resolveEntry(normalizedKey);
		const storedDepth = normalizeSpawnDepth(entry?.spawnDepth);
		if (storedDepth !== void 0) return storedDepth;
		const parentKey = normalizeOptionalString(entry?.spawnedBy);
		if (!parentKey) return;
		const parentDepth = depthFromStore(parentKey);
		if (parentDepth !== void 0) return parentDepth + 1;
		return getSubagentDepth(parentKey) + 1;
	};
	return depthFromStore(raw) ?? fallbackDepth;
}
/** Classifies coordination from the exact session entry and its canonical ACP metadata. */
function isSubagentSessionFromEntry(sessionKey, entry, acpMeta) {
	const spawnDepth = normalizeSpawnDepth(entry?.spawnDepth);
	return (spawnDepth === void 0 ? Boolean(normalizeOptionalString(entry?.spawnedBy)) || getSubagentDepth(sessionKey) > 0 : spawnDepth > 0) || isParentOwnedBackgroundAcpSession(entry ? {
		...entry,
		acp: acpMeta
	} : entry);
}
//#endregion
export { isRequesterParentOfBackgroundAcpSession as i, isSubagentSessionFromEntry as n, isParentOwnedBackgroundAcpSession as r, getSubagentDepthFromEntryLookup as t };
