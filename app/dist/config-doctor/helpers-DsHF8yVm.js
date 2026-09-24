import { d as normalizeStringEntries } from "./string-normalization-DsCfAx8q.js";
import "./session-key-AvQIavYt.js";
import "./account-id-vE-dRkuP.js";
import "./account-lookup-CD9t104R.js";
//#region src/channels/plugins/helpers.ts
/**
* Channel plugin helper utilities.
*
* Resolves default accounts, pairing hints, delimited entries, and DM security policy views.
*/
function resolveChannelDefaultAccountId(params) {
	return params.plugin.config.defaultAccountId?.(params.cfg) ?? (params.accountIds ?? params.plugin.config.listAccountIds(params.cfg))[0] ?? "default";
}
function parseOptionalDelimitedEntries(value) {
	if (!value?.trim()) return;
	const parsed = normalizeStringEntries(value.split(/[\n,;]+/g));
	return parsed.length > 0 ? parsed : void 0;
}
//#endregion
export { resolveChannelDefaultAccountId as n, parseOptionalDelimitedEntries as t };
