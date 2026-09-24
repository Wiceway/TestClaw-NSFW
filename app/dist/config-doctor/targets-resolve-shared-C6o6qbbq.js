import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import "./message-channel-constants-2zSoJXQC.js";
import { a as validateTargetProviderPrefix } from "./channel-target-prefix-DThej3BM.js";
import { s as resolveReservedTargetLiteral } from "./target-normalization-BzawVe0N.js";
import { a as missingTargetError, o as reservedTargetLiteralError } from "./target-errors-CmkAS9Ko.js";
import { t as mapAllowFromEntries } from "./channel-config-helpers-tX9QNb5l.js";
//#region src/infra/outbound/targets-resolve-shared.ts
function buildWebChatDeliveryError() {
	return /* @__PURE__ */ new Error(`Delivering to WebChat is not supported via \`${formatCliCommand("testclaw agent")}\`; use WhatsApp/Telegram or run with --deliver=false.`);
}
/**
* Resolves a target through a channel plugin or the generic fallback path.
*/
function resolveOutboundTargetWithPlugin(params) {
	if (params.target.channel === "webchat") return {
		ok: false,
		error: buildWebChatDeliveryError()
	};
	const plugin = params.plugin;
	if (!plugin) return params.onMissingPlugin?.();
	const allowFromRaw = params.target.allowFrom ?? (params.target.cfg && plugin.config.resolveAllowFrom ? plugin.config.resolveAllowFrom({
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const allowFrom = allowFromRaw ? mapAllowFromEntries(allowFromRaw) : void 0;
	const effectiveTo = params.target.to?.trim() || (params.target.cfg && plugin.config.resolveDefaultTo ? plugin.config.resolveDefaultTo({
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const targetPrefixError = validateTargetProviderPrefix({
		channel: params.target.channel,
		to: effectiveTo
	});
	if (targetPrefixError) return {
		ok: false,
		error: targetPrefixError
	};
	const hint = plugin.messaging?.targetResolver?.hint;
	if (params.target.mode !== "heartbeat") {
		const reservedLiteral = resolveReservedTargetLiteral({
			raw: effectiveTo,
			plugin
		});
		if (reservedLiteral) return {
			ok: false,
			error: reservedTargetLiteralError(plugin.meta.label ?? params.target.channel, reservedLiteral, hint)
		};
	}
	const resolveTarget = plugin.outbound?.resolveTarget;
	if (resolveTarget) return resolveTarget({
		cfg: params.target.cfg,
		to: effectiveTo,
		allowFrom,
		accountId: params.target.accountId ?? void 0,
		mode: params.target.mode ?? "explicit"
	});
	if (effectiveTo) return {
		ok: true,
		to: effectiveTo
	};
	return {
		ok: false,
		error: missingTargetError(plugin.meta.label ?? params.target.channel, hint)
	};
}
//#endregion
export { resolveOutboundTargetWithPlugin as t };
