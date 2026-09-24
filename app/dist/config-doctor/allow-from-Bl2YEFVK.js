import { d as normalizeStringEntries } from "./string-normalization-DsCfAx8q.js";
/**
* Parses an access-group allowFrom entry and returns the referenced group name.
*/
function parseAccessGroupAllowFromEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed.startsWith("accessGroup:")) return null;
	const name = trimmed.slice(12).trim();
	return name.length > 0 ? name : null;
}
/**
* Merges configured DM allowFrom entries with pairing-store sender ids when policy allows it.
*/
function mergeDmAllowFromSources(params) {
	const storeEntries = params.dmPolicy === "allowlist" || params.dmPolicy === "open" ? [] : params.storeAllowFrom ?? [];
	return normalizeStringEntries([...params.allowFrom ?? [], ...storeEntries]);
}
/**
* Resolves the allowFrom entries used for group chats, optionally falling back to DM policy.
*/
function resolveGroupAllowFromSources(params) {
	const explicitGroupAllowFrom = Array.isArray(params.groupAllowFrom) && params.groupAllowFrom.length > 0 ? params.groupAllowFrom : void 0;
	const scoped = explicitGroupAllowFrom ? explicitGroupAllowFrom : params.fallbackToAllowFrom === false ? [] : params.allowFrom ?? [];
	return normalizeStringEntries(scoped);
}
//#endregion
export { parseAccessGroupAllowFromEntry as n, resolveGroupAllowFromSources as r, mergeDmAllowFromSources as t };
