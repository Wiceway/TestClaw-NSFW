import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-_nFH9T9d.js";
import { _ as assertGatewayCliMessageContext, h as isImplicitLocalGatewayTarget, o as callGateway } from "./call-CY0v-3Uc.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DwgFcs6p.js";
import { r as withProgress } from "./progress-47BE6b88.js";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-DtBdcXur.js";
//#region src/cli/gateway-rpc.runtime.ts
const DEFAULT_GATEWAY_RPC_TIMEOUT_MS = 3e4;
async function isImplicitLocalGatewayTargetFromCliRuntime(opts) {
	return await isImplicitLocalGatewayTarget({
		config: opts.config,
		url: opts.url,
		localPortOverride: resolveGatewayLocalPortOverride(opts)
	});
}
async function callGatewayFromCliRuntime(method, opts, params, extra) {
	assertGatewayCliMessageContext(method, params);
	const localPortOverride = resolveGatewayLocalPortOverride(opts);
	const showProgress = extra?.progress ?? opts.json !== true;
	const timeoutMs = extra?.timeoutMs !== void 0 ? extra.timeoutMs : opts.timeout === null ? null : parseTimeoutMsWithFallback(opts.timeout, extra?.defaultTimeoutMs ?? DEFAULT_GATEWAY_RPC_TIMEOUT_MS, { invalidType: "error" });
	return await withProgress({
		label: extra?.label ?? `Gateway ${method}`,
		indeterminate: true,
		enabled: showProgress
	}, async () => await callGateway({
		config: opts.config,
		url: opts.url,
		expectUrl: opts.expectUrl,
		token: opts.token,
		password: opts.password,
		method,
		params,
		deviceIdentity: extra?.deviceIdentity,
		expectFinal: extra?.expectFinal ?? Boolean(opts.expectFinal),
		scopes: extra?.scopes,
		useStoredDeviceAuth: extra?.useStoredDeviceAuth,
		requiredStoredDeviceAuthScopes: extra?.requiredStoredDeviceAuthScopes,
		requireLocalBackendSharedAuth: extra?.requireLocalBackendSharedAuth,
		sharedStateMode: extra?.sharedStateMode,
		signal: extra?.signal,
		timeoutMs,
		localPortOverride,
		clientName: extra?.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
		mode: extra?.mode ?? GATEWAY_CLIENT_MODES.CLI
	}));
}
//#endregion
export { callGatewayFromCliRuntime, isImplicitLocalGatewayTargetFromCliRuntime };
