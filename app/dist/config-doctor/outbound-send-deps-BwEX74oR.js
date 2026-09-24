import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
//#region src/infra/outbound/send-deps.ts
/**
* Builds historical dependency keys for channel send functions.
*/
function resolveLegacyOutboundSendDepKeys(channelId) {
	const compact = channelId.replace(/[^a-z0-9]+/gi, "");
	if (!compact) return [];
	const pascal = compact.charAt(0).toUpperCase() + compact.slice(1);
	const keys = /* @__PURE__ */ new Set();
	keys.add(`send${pascal}`);
	if (pascal.startsWith("I") && pascal.length > 1) keys.add(`sendI${pascal.slice(1)}`);
	if (pascal.startsWith("Ms") && pascal.length > 2) keys.add(`sendMS${pascal.slice(2)}`);
	return [...keys];
}
//#endregion
//#region src/cli/outbound-send-mapping.ts
function normalizeLegacyChannelStem(raw) {
	return normalizeLowercaseStringOrEmpty(raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").trim()).replace(/-/g, "");
}
function resolveChannelIdFromLegacySourceKey(key) {
	const match = key.match(/^sendMessage(.+)$/);
	if (!match) return;
	return normalizeLegacyChannelStem(match[1] ?? "") || void 0;
}
/**
* Pass CLI send sources through as-is — both CliOutboundSendSource and
* OutboundSendDeps are now channel-ID-keyed records.
*/
function createOutboundSendDepsFromCliSource(deps) {
	const outbound = { ...deps };
	for (const legacySourceKey of Object.keys(deps)) {
		const channelId = resolveChannelIdFromLegacySourceKey(legacySourceKey);
		if (!channelId) continue;
		const sourceValue = deps[legacySourceKey];
		if (sourceValue !== void 0 && outbound[channelId] === void 0) outbound[channelId] = sourceValue;
	}
	for (const channelId of Object.keys(outbound)) {
		const sourceValue = outbound[channelId];
		if (sourceValue === void 0) continue;
		for (const legacyDepKey of resolveLegacyOutboundSendDepKeys(channelId)) if (outbound[legacyDepKey] === void 0) outbound[legacyDepKey] = sourceValue;
	}
	return outbound;
}
//#endregion
//#region src/cli/outbound-send-deps.ts
/** Convert the broad CLI dependency bundle into the narrow outbound-send dependency shape. */
function createOutboundSendDeps(deps) {
	return createOutboundSendDepsFromCliSource(deps);
}
//#endregion
export { createOutboundSendDeps as t };
