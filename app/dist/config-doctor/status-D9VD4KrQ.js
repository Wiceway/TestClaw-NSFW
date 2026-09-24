import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BO-LaDsQ.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-kM7jday_.js";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-_4Zh4Pjr.js";
import { o as callGateway } from "./call-CY0v-3Uc.js";
import { a as isExpectedCliError, n as formatCliFailureLines, o as isGatewayCredentialsCliError } from "./failure-output-B62fEQHE.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DwgFcs6p.js";
import { r as withProgress } from "./progress-47BE6b88.js";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-ChgW7WtU.js";
import { t as waitForGatewayDiagnostic } from "./gateway-diagnostic-readiness-BCOng2hG.js";
//#region src/commands/channels/status.ts
const loadChannelsStatusRuntime = createLazyRuntimeModule(() => import("./status.runtime-_08SJK2i.js"));
function redactGatewayUrlSecretsInText(text) {
	return text.replace(/\b(?:wss?|https?):\/\/[^\s"'<>]+/gi, (rawUrl) => {
		return redactSensitiveUrlLikeString(rawUrl);
	});
}
function formatChannelsStatusError(err) {
	return redactGatewayUrlSecretsInText(formatErrorMessage(err));
}
/** Query gateway channel status, falling back to config-only output when unavailable. */
async function channelsStatusCommand(opts, runtime = defaultRuntime) {
	const args = normalizeOptionalLowercaseString(opts.channel) === "all" ? {
		...opts,
		channel: void 0
	} : opts;
	const timeoutMs = parseTimeoutMsWithFallback(opts.timeout, DEFAULT_RESTART_HEALTH_TIMEOUT_MS, { invalidType: "error" });
	const statusLabel = opts.probe ? "Checking channel status (probe)…" : "Checking channel status…";
	if (opts.json !== true && !process.stderr.isTTY) runtime.log(statusLabel);
	try {
		const remainingMs = await waitForGatewayDiagnostic({
			timeoutMs,
			json: opts.json
		}, runtime);
		if (remainingMs === void 0) return;
		const payload = await withProgress({
			label: statusLabel,
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => {
			const params = {
				probe: Boolean(opts.probe),
				timeoutMs: remainingMs
			};
			if (args.channel) params.channel = args.channel;
			return await callGateway({
				method: "channels.status",
				params,
				timeoutMs: remainingMs,
				sharedStateMode: "read-only"
			});
		});
		if (opts.json) {
			writeRuntimeJson(runtime, payload);
			return;
		}
		const { formatGatewayChannelsStatusLines } = await loadChannelsStatusRuntime();
		runtime.log(formatGatewayChannelsStatusLines(payload).join("\n"));
	} catch (err) {
		const safeError = formatChannelsStatusError(err);
		const expectedError = isExpectedCliError(err);
		const gatewayAuthUnavailable = isGatewayCredentialsCliError(err) || isGatewaySecretRefUnavailableError(err);
		const expectedErrorOutput = expectedError ? formatCliFailureLines({
			title: "",
			error: err
		}).join("\n") : void 0;
		const { renderChannelsStatusFallback } = await loadChannelsStatusRuntime();
		await renderChannelsStatusFallback({
			opts: args,
			runtime,
			safeError,
			gatewayAuthUnavailable,
			expectedErrorOutput
		});
	}
}
//#endregion
export { channelsStatusCommand as t };
