import "./session-key-AvQIavYt.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-vE-dRkuP.js";
import { f as resolveOfficialExternalChannelCompatibilityMigration } from "./official-external-plugin-catalog-D5I3lq6A.js";
import { n as LEGACY_CONFIG_MIGRATIONS } from "./legacy-BYmH9Ozt.js";
import { r as resolveChannelAccountKey } from "./account-lookup-CD9t104R.js";
import { t as writeChannelSection } from "./config-helpers-g-K2uUTt.js";
import { t as resolveSingleAccountPromotion } from "./setup-promotion-helpers-n21fyykq.js";
//#region src/commands/channel-setup/config-compatibility.ts
function normalizeExternalChannelSetupConfig(params) {
	const migrationId = resolveOfficialExternalChannelCompatibilityMigration(params.channel);
	if (!migrationId) return params.cfg;
	const migration = LEGACY_CONFIG_MIGRATIONS.find((candidate) => candidate.id === migrationId);
	if (!migration) throw new Error(`Official external channel ${params.channel} references unknown compatibility migration ${migrationId}`);
	const next = structuredClone(params.cfg);
	migration.apply(next, []);
	return next;
}
//#endregion
//#region src/channels/plugins/setup-helpers.ts
function getChannelSection(cfg, channelKey) {
	const section = cfg.channels?.[channelKey];
	return section && typeof section === "object" ? section : void 0;
}
function moveSingleAccountKeysIntoAccount(params) {
	const nextAccount = { ...params.baseAccount };
	const nextChannel = { ...params.channel };
	for (const key of params.keysToMove) {
		if (!(key in nextAccount)) {
			const value = params.channel[key];
			nextAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
		}
		delete nextChannel[key];
	}
	return writeChannelSection(params.cfg, params.channelKey, {
		...nextChannel,
		accounts: {
			...params.accounts,
			[params.targetAccountId]: nextAccount
		}
	});
}
function resolveSingleAccountPromotionTarget(params) {
	const accounts = params.channel.accounts ?? {};
	const resolveTargetKey = (accountId) => resolveChannelAccountKey(accounts, normalizeAccountId(accountId), params.channelKey, normalizeAccountId, params.setupSurface?.accountKeyPolicy);
	const pluginTarget = params.setupSurface?.resolveSingleAccountPromotionTarget?.({ channel: params.channel });
	if (pluginTarget?.trim()) return resolveTargetKey(pluginTarget) ?? normalizeAccountId(pluginTarget);
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId(params.channel.defaultAccount) : void 0;
	const namedAccounts = Object.keys(accounts).filter(Boolean);
	return resolveTargetKey(normalizedDefaultAccount ?? (namedAccounts.length === 1 ? namedAccounts[0] ?? "default" : "default")) ?? resolveTargetKey("default") ?? "default";
}
/**
* Promotes legacy single-account channel fields into the account map for multi-account setup.
*/
function moveSingleAccountChannelSectionToDefaultAccount(params) {
	const base = getChannelSection(params.cfg, params.channelKey);
	if (!base) return params.cfg;
	const accounts = base.accounts ?? {};
	const hasAccounts = Object.keys(accounts).length > 0;
	const promotion = resolveSingleAccountPromotion({
		channelKey: params.channelKey,
		channel: base,
		setupSurface: params.setupSurface,
		includeSetupKeys: true
	});
	if (promotion.kind === "preserve-root") return params.cfg;
	const { keysToMove } = promotion;
	if (hasAccounts && keysToMove.length === 0) return params.cfg;
	const targetAccountKey = hasAccounts ? resolveSingleAccountPromotionTarget({
		channel: base,
		channelKey: params.channelKey,
		setupSurface: params.setupSurface
	}) : DEFAULT_ACCOUNT_ID;
	return moveSingleAccountKeysIntoAccount({
		cfg: params.cfg,
		channelKey: params.channelKey,
		channel: base,
		accounts,
		keysToMove,
		targetAccountId: targetAccountKey,
		baseAccount: accounts[targetAccountKey]
	});
}
//#endregion
export { normalizeExternalChannelSetupConfig as n, moveSingleAccountChannelSectionToDefaultAccount as t };
