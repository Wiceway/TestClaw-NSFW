import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-BYTH0TY5.mjs";
import { o as callGateway } from "./call-Cm2P5Cd6.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
import { a as isExpectedCliError, n as formatCliFailureLines, o as isGatewayCredentialsCliError } from "./failure-output-BDwPHdmu.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-G1LpD3Dj.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as waitForGatewayDiagnostic } from "./gateway-diagnostic-readiness-fA5QLuQt.mjs";
//#region src/commands/channels/status.ts
const loadChannelsStatusRuntime = createLazyRuntimeModule(() => import("./status.runtime-DwpcaYgn.mjs"));
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
