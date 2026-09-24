import { t as inspectReadOnlyChannelAccount } from "../read-only-account-inspect-Bqp6zmdL.mjs";
import { t as createRuntimeDirectoryLiveAdapter } from "../runtime-forwarders-t8JCdU2L.mjs";
import { a as listDirectoryEntriesFromSources, c as listDirectoryUserEntriesFromAllowFrom, d as listResolvedDirectoryEntriesFromSources, f as listResolvedDirectoryGroupEntriesFromMapKeys, i as createResolvedDirectoryEntriesLister, l as listDirectoryUserEntriesFromAllowFromAndMapKeys, m as toDirectoryEntries, n as collectNormalizedDirectoryIds, o as listDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom, r as createInspectedDirectoryEntriesLister, s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, t as applyDirectoryQueryAndLimit, u as listInspectedDirectoryEntriesFromSources } from "../directory-config-helpers-9zao9heL.mjs";
import { i as nullChannelDirectorySelf, n as createEmptyChannelDirectoryAdapter, r as emptyChannelDirectoryList, t as createChannelDirectoryAdapter } from "../directory-adapters-CwR372GJ.mjs";
//#region src/plugin-sdk/directory-runtime.ts
function resolveDirectoryAllowlistEntries(params) {
	return params.entries.map((input) => {
		const parsed = params.parseInput(input);
		if (parsed.id) return params.buildIdResolved({
			input,
			parsed,
			match: params.findById(params.lookup, parsed.id)
		});
		return params.resolveNonId({
			input,
			parsed,
			lookup: params.lookup
		}) ?? params.buildUnresolved(input);
	});
}
//#endregion
export { applyDirectoryQueryAndLimit, collectNormalizedDirectoryIds, createChannelDirectoryAdapter, createEmptyChannelDirectoryAdapter, createInspectedDirectoryEntriesLister, createResolvedDirectoryEntriesLister, createRuntimeDirectoryLiveAdapter, emptyChannelDirectoryList, inspectReadOnlyChannelAccount, listDirectoryEntriesFromSources, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, listInspectedDirectoryEntriesFromSources, listResolvedDirectoryEntriesFromSources, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom, nullChannelDirectorySelf, resolveDirectoryAllowlistEntries, toDirectoryEntries };
