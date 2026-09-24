import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-_nFH9T9d.js";
import { S as parseStrictPositiveInteger } from "./number-coercion-0M4tZV2c.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { p as resolveAmbientOwnerAgentId } from "./agent-scope-config-BEuqweC1.js";
import { a as writeRuntimeJson } from "./runtime-kM7jday_.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { n as resolveMessageBroadcastAccountPlan, r as validateExplicitMessageAccountSelection } from "./message-account-selection-C8JpXtCj.js";
import { f as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-CdV9gKy0.js";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-BPz1joQd.js";
import { t as resolveMessageSecretScope } from "./message-secret-scope-DCOPoi57.js";
import { n as resolveMessageActionOutcome, t as resolveMessageActionMessageId } from "./message-action-contracts-BsHpR9u1.js";
import { n as runMessageAction } from "./message-action-runner-BJK_e511.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-BwEX74oR.js";
import { r as formatCliJsonFailure } from "./failure-output-B62fEQHE.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-LPy_iaVf.js";
import { r as withProgress } from "./progress-47BE6b88.js";
//#region src/commands/message.ts
/** CLI entrypoint for channel message actions. */
function buildMessageCliJson(result) {
	const messageId = resolveMessageActionMessageId(result.payload);
	const sendResult = result.kind === "send" ? result.sendResult : void 0;
	const outcome = resolveMessageActionOutcome(result);
	return {
		...result.kind === "broadcast" ? { ok: outcome.ok } : !outcome.ok ? {
			...formatCliJsonFailure(outcome.error),
			...sendResult ? { deliveryStatus: sendResult.deliveryStatus } : {},
			...outcome.sentBeforeError ? { sentBeforeError: true } : {}
		} : {},
		action: result.action,
		channel: result.channel,
		dryRun: result.dryRun,
		handledBy: result.handledBy,
		...messageId ? { messageId } : {},
		payload: result.payload
	};
}
/** Resolves config/secrets, runs a channel message action, then renders JSON or text. */
async function messageCommand(opts, deps, runtime) {
	const loadedRaw = getRuntimeConfig();
	const actionInput = (normalizeOptionalString(opts.action) ?? "") || "send";
	const normalizedActionInput = normalizeLowercaseStringOrEmpty(actionInput);
	const scope = resolveMessageSecretScope({
		channel: opts.channel,
		target: opts.target,
		targets: opts.targets,
		accountId: opts.accountId
	});
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg: loadedRaw,
		channel: scope.channel,
		accountId: opts.accountId,
		checkResolvedAccount: false
	});
	if (explicitAccountId) {
		scope.accountId = explicitAccountId;
		opts.accountId = explicitAccountId;
	}
	const broadcastAccountPlan = normalizedActionInput === "broadcast" && !scope.channel && explicitAccountId ? resolveMessageBroadcastAccountPlan({
		cfg: loadedRaw,
		accountId: explicitAccountId
	}) : void 0;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: loadedRaw,
		channel: scope.channel,
		...broadcastAccountPlan ? { channels: broadcastAccountPlan.secretChannels } : {},
		accountId: scope.accountId
	});
	const { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "message",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {},
		runtime,
		autoEnable: true
	});
	const agentId = resolveAmbientOwnerAgentId(cfg, void 0, {
		surface: "message CLI",
		hint: `Run ${formatCliCommand("testclaw config set agents.defaults.systemAgent.agentId <id>")} with a configured agent ID.`
	});
	const actionMatch = CHANNEL_MESSAGE_ACTION_NAMES.find((name) => normalizeLowercaseStringOrEmpty(name) === normalizedActionInput);
	if (!actionMatch) throw new Error(`Unknown message action "${actionInput}". Use one of ${CHANNEL_MESSAGE_ACTION_NAMES.join(", ")}. Example: ${formatCliCommand("testclaw message send --channel <channel> --target <id> --text <message>")}.`);
	const action = actionMatch;
	const outboundDeps = createOutboundSendDeps(deps);
	const run = async () => await runMessageAction({
		cfg,
		action,
		params: opts,
		deps: outboundDeps,
		agentId,
		senderIsOwner: opts.senderIsOwner !== false,
		conversationReadOrigin: "direct-operator",
		broadcastAccountPlan,
		gateway: {
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		}
	});
	const json = opts.json === true;
	const dryRun = opts.dryRun === true;
	const result = !json && !dryRun && (action === "send" || action === "poll") ? await withProgress({
		label: action === "poll" ? "Sending poll..." : "Sending...",
		indeterminate: true,
		enabled: true
	}, run) : await run();
	if (json) {
		writeRuntimeJson(runtime, buildMessageCliJson(result));
		return result;
	}
	const { formatMessageCliText } = await import("./message-format-CS0xBpZX.js");
	const displayLimit = parseStrictPositiveInteger(opts.limit);
	for (const line of formatMessageCliText(result, { displayLimit })) runtime.log(line);
	return result;
}
//#endregion
export { messageCommand };
