import "./src-D9uQ497Z.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { j as resolvePositiveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { n as readResponseTextPrefix } from "./http-response-body-BEF2-H0F.js";
import { t as decodeTextPrefix } from "./text-decoding-BtOrNLtL.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-BfoJTy8l.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { o as shouldUseEnvHttpProxyForUrl } from "./proxy-env-CrR_52p-.js";
import "./fetch-timeout-uyK84wVM.js";
import "./http-body-C9nYeJpi.js";
import { i as fetchWithSsrFGuard, t as GUARDED_FETCH_MODE } from "./fetch-guard-BLzJd1EF.js";
import { a as createProviderHttpError, c as readProviderJsonResponse, i as createProviderErrorTextRedactor } from "./provider-http-errors-BAwtNYrg.js";
import { o as buildProviderRequestDispatcherPolicy, p as resolveProviderRequestPolicyConfig } from "./provider-local-service-reconcile-DGJJw1a3.js";
import { r as resolveProviderTransportSsrFPolicy } from "./provider-transport-fetch-Ly8BRMkD.js";
import { n as isTransientProviderHttpStatus, t as executeProviderOperationWithRetry } from "./operation-retry-cGT63yjp.js";
import "node:path";
//#region src/media-understanding/shared.ts
const DEFAULT_GUARDED_HTTP_TIMEOUT_MS = 6e4;
const MAX_AUDIT_CONTEXT_CHARS = 80;
function resolveGuardedHttpTimeoutMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return DEFAULT_GUARDED_HTTP_TIMEOUT_MS;
	return timeoutMs;
}
function sanitizeAuditContext(auditContext) {
	const cleaned = auditContext?.replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim();
	if (!cleaned) return;
	return truncateUtf16Safe(cleaned, MAX_AUDIT_CONTEXT_CHARS);
}
function resolveProviderHttpRequestConfigWithOriginTrustInternal(params) {
	const requestConfig = resolveProviderRequestPolicyConfig({
		provider: params.provider ?? "",
		baseUrl: params.baseUrl,
		defaultBaseUrl: params.defaultBaseUrl,
		capability: params.capability ?? "other",
		transport: params.transport ?? "http",
		callerHeaders: params.headers ? Object.fromEntries(new Headers(params.headers).entries()) : void 0,
		providerHeaders: params.defaultHeaders,
		precedence: "caller-wins",
		allowPrivateNetwork: params.allowPrivateNetwork,
		api: params.api,
		request: params.request
	});
	const headers = new Headers(requestConfig.headers);
	if (!requestConfig.baseUrl) throw new Error("Missing baseUrl: provide baseUrl or defaultBaseUrl");
	return {
		baseUrl: requestConfig.baseUrl,
		allowPrivateNetwork: requestConfig.allowPrivateNetwork,
		headers,
		dispatcherPolicy: buildProviderRequestDispatcherPolicy(requestConfig),
		trustConfiguredBaseUrlOrigin: requestConfig.trustConfiguredBaseUrlOrigin
	};
}
function resolveProviderHttpRequestConfig(params) {
	const resolved = resolveProviderHttpRequestConfigWithOriginTrustInternal(params);
	return {
		baseUrl: resolved.baseUrl,
		allowPrivateNetwork: resolved.allowPrivateNetwork,
		headers: resolved.headers,
		dispatcherPolicy: resolved.dispatcherPolicy
	};
}
function resolveProviderHttpRequestConfigWithOriginTrust(params) {
	return resolveProviderHttpRequestConfigWithOriginTrustInternal(params);
}
/**
* Decide whether to auto-upgrade a provider HTTP request into
* `TRUSTED_ENV_PROXY` mode based on the runtime environment.
*
* This is gated conservatively to avoid the SSRF bypasses the initial
* auto-upgrade path exposed (see testclaw#64974 review threads):
*
* 1. If the caller supplied an explicit `dispatcherPolicy` — custom proxy URL,
*    `proxyTls`, or `connect` options — do NOT override it. Trusted-env mode
*    builds an `EnvHttpProxyAgent` that would silently drop those overrides,
*    breaking enterprise proxy/mTLS configs.
*
* 2. Only auto-upgrade when `HTTP_PROXY` or `HTTPS_PROXY` (lower- or
*    upper-case) is configured for the target protocol. `ALL_PROXY` is
*    explicitly ignored by `EnvHttpProxyAgent`, so counting it would
*    auto-upgrade requests that then make direct connections while skipping
*    pinned-DNS/SSRF hostname checks.
*
* 3. If `NO_PROXY` would bypass the proxy for this target, do NOT auto-upgrade.
*    `EnvHttpProxyAgent` makes direct connections for `NO_PROXY` matches, but
*    in `TRUSTED_ENV_PROXY` mode `fetchWithSsrFGuard` skips
*    `resolvePinnedHostnameWithPolicy` — so those direct connections would
*    bypass SSRF protection. Keep strict mode for `NO_PROXY` matches.
*/
function shouldAutoUpgradeToTrustedEnvProxy(params) {
	if (params.dispatcherPolicy) return false;
	return shouldUseEnvHttpProxyForUrl(params.url);
}
async function fetchWithTimeoutGuarded(url, init, timeoutMs, fetchFn, options) {
	const resolvedMode = options?.mode ?? (shouldAutoUpgradeToTrustedEnvProxy({
		url,
		dispatcherPolicy: options?.dispatcherPolicy
	}) ? GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY : void 0);
	return await fetchWithSsrFGuard({
		url,
		fetchImpl: fetchFn,
		init,
		timeoutMs: resolveGuardedHttpTimeoutMs(timeoutMs),
		policy: options?.ssrfPolicy,
		lookupFn: options?.lookupFn,
		pinDns: options?.pinDns,
		dispatcherPolicy: options?.dispatcherPolicy,
		auditContext: sanitizeAuditContext(options?.auditContext),
		...resolvedMode ? { mode: resolvedMode } : {}
	});
}
function mergeGuardedRequestSsrfPolicy(params) {
	if (!params.ssrfPolicy) return params.allowPrivateNetwork ? { allowPrivateNetwork: true } : void 0;
	if (!params.allowPrivateNetwork) return params.ssrfPolicy;
	return {
		...params.ssrfPolicy,
		allowPrivateNetwork: true
	};
}
function resolveGuardedRequestOptions(params) {
	if (!params.allowPrivateNetwork && !params.ssrfPolicy && !params.dispatcherPolicy && params.pinDns === void 0 && !params.auditContext && params.mode === void 0) return;
	const ssrfPolicy = mergeGuardedRequestSsrfPolicy(params);
	return {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...params.pinDns !== void 0 ? { pinDns: params.pinDns } : {},
		...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
		...params.auditContext ? { auditContext: params.auditContext } : {},
		...params.mode !== void 0 ? { mode: params.mode } : {}
	};
}
async function postGuardedRequest(params) {
	const operation = async () => {
		params.init.signal?.throwIfAborted();
		const result = await fetchWithTimeoutGuarded(params.url, params.init, params.timeoutMs, params.fetchFn, params.guardedOptions);
		if (params.retryStage && isTransientProviderHttpStatus(result.response.status)) try {
			throw await createProviderHttpError(result.response, "provider POST request failed", { statusPrefix: "HTTP " });
		} finally {
			await result.release();
		}
		return result;
	};
	if (!params.retryStage) return await operation();
	return await executeProviderOperationWithRetry({
		provider: "provider-http",
		stage: params.retryStage,
		retry: params.retry,
		signal: params.init.signal ?? void 0,
		operation
	});
}
async function postJsonRequest(params) {
	return await postGuardedRequest({
		url: params.url,
		init: {
			method: "POST",
			headers: params.headers,
			body: JSON.stringify(params.body),
			...params.signal ? { signal: params.signal } : {}
		},
		timeoutMs: params.timeoutMs,
		fetchFn: params.fetchFn,
		guardedOptions: resolveGuardedRequestOptions(params),
		retryStage: params.retryStage,
		retry: params.retry
	});
}
//#endregion
//#region src/infra/http-error-body.ts
const errorBodyLog = createSubsystemLogger("http-error-body");
async function readResponseBodySnippet(response, limits) {
	const normalize = (text, truncated) => truncateUtf16Safe(limits.redact?.(text, { truncated }) ?? text, limits.maxChars);
	try {
		const body = response.body;
		if (!body || typeof body.getReader !== "function") {
			const text = await response.text();
			const encoded = new TextEncoder().encode(text);
			if (encoded.byteLength > limits.maxBytes) return normalize(decodeTextPrefix(encoded.subarray(0, limits.maxBytes), { truncated: true }), true);
			return normalize(text, false);
		}
		const prefix = await readResponseTextPrefix(response, limits.maxBytes);
		return normalize(prefix.text, prefix.truncated);
	} catch (err) {
		errorBodyLog.warn(`Failed to read response body snippet: ${formatErrorMessage(err)}`);
		return "";
	}
}
//#endregion
//#region src/agents/minimax-vlm.ts
/**
* Adapts MiniMax VLM image-understanding requests for agent image inputs.
*/
const MINIMAX_VLM_ERROR_BODY_MAX_BYTES = 8192;
const MINIMAX_VLM_ERROR_BODY_MAX_CHARS = 400;
const DEFAULT_MINIMAX_VLM_TIMEOUT_MS = 6e4;
function isMinimaxVlmProvider(provider) {
	const normalized = provider.trim().toLowerCase();
	return normalized === "minimax" || normalized === "minimax-cn" || normalized === "minimax-portal" || normalized === "minimax-portal-cn";
}
function isMinimaxVlmModel(provider, modelId) {
	return isMinimaxVlmProvider(provider) && modelId.trim() === "MiniMax-VL-01";
}
function isMinimaxCnProvider(provider) {
	const normalized = provider?.trim().toLowerCase();
	return normalized === "minimax-cn" || normalized === "minimax-portal-cn";
}
function resolveDefaultApiHost(provider) {
	return isMinimaxCnProvider(provider) ? "https://api.minimaxi.com" : "https://api.minimax.io";
}
function coerceApiHost(params) {
	const env = params.env ?? process.env;
	const defaultHost = resolveDefaultApiHost(params.provider);
	const raw = params.apiHost?.trim() || env.MINIMAX_API_HOST?.trim() || params.modelBaseUrl?.trim() || defaultHost;
	try {
		return new URL(raw).origin;
	} catch {}
	if (/^[a-z][a-z\d+.-]*:\/\//i.test(raw)) return defaultHost;
	try {
		return new URL(`https://${raw}`).origin;
	} catch {
		return defaultHost;
	}
}
function pickString(rec, key) {
	const v = rec[key];
	return typeof v === "string" ? v : "";
}
async function minimaxUnderstandImage(params) {
	const apiKey = normalizeSecretInput(params.apiKey);
	if (!apiKey) throw new Error("MiniMax VLM: apiKey required");
	const prompt = params.prompt.trim();
	if (!prompt) throw new Error("MiniMax VLM: prompt required");
	const imageDataUrl = params.imageDataUrl.trim();
	if (!imageDataUrl) throw new Error("MiniMax VLM: imageDataUrl required");
	if (!/^data:image\/(png|jpeg|webp);base64,/i.test(imageDataUrl)) throw new Error("MiniMax VLM: imageDataUrl must be a base64 data:image/(png|jpeg|webp) URL");
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy, trustConfiguredBaseUrlOrigin } = resolveProviderHttpRequestConfigWithOriginTrust({
		baseUrl: coerceApiHost({
			apiHost: params.apiHost,
			modelBaseUrl: params.modelBaseUrl,
			provider: params.provider
		}),
		defaultBaseUrl: resolveDefaultApiHost(params.provider),
		allowPrivateNetwork: params.allowPrivateNetwork,
		defaultHeaders: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"MM-API-Source": "Assistant"
		},
		request: params.request,
		provider: params.provider ?? "minimax",
		capability: "image",
		transport: "media-understanding"
	});
	const url = new URL("/v1/coding_plan/vlm", baseUrl).toString();
	const timeoutMs = resolvePositiveTimerTimeoutMs(params.timeoutMs, DEFAULT_MINIMAX_VLM_TIMEOUT_MS);
	const ssrfPolicy = resolveProviderTransportSsrFPolicy({
		baseUrl,
		url,
		allowPrivateNetwork,
		trustConfiguredBaseUrlOrigin
	});
	const guarded = await postJsonRequest({
		url,
		headers,
		body: {
			prompt,
			image_url: imageDataUrl
		},
		timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn: fetch,
		allowPrivateNetwork,
		ssrfPolicy,
		dispatcherPolicy,
		auditContext: "minimax-vlm"
	});
	const res = guarded.response;
	const redactErrorText = createProviderErrorTextRedactor({
		headers,
		request: params.request,
		defaultAuthHeader: "Authorization",
		defaultAuthPrefix: "Bearer "
	});
	try {
		const traceId = redactErrorText(res.headers.get("Trace-Id") ?? "");
		if (!res.ok) {
			const body = await readResponseBodySnippet(res, {
				maxBytes: MINIMAX_VLM_ERROR_BODY_MAX_BYTES,
				maxChars: MINIMAX_VLM_ERROR_BODY_MAX_CHARS,
				redact: redactErrorText
			});
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM request failed (${res.status} ${redactErrorText(res.statusText)}).${trace}${body ? ` Body: ${body}` : ""}`);
		}
		const responseLabel = traceId ? `MiniMax VLM response [Trace-Id=${traceId}]` : "MiniMax VLM response";
		const json = await readProviderJsonResponse(res, responseLabel);
		if (!isRecord(json)) {
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM response was not JSON.${trace}`);
		}
		const baseResp = isRecord(json.base_resp) ? json.base_resp : {};
		const code = typeof baseResp.status_code === "number" ? baseResp.status_code : -1;
		if (code !== 0) {
			const msg = redactErrorText((baseResp.status_msg ?? "").trim());
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM API error (${code})${msg ? `: ${msg}` : ""}.${trace}`);
		}
		const content = pickString(json, "content").trim();
		if (!content) {
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM returned no content.${trace}`);
		}
		return content;
	} finally {
		await guarded.release();
	}
}
//#endregion
export { fetchWithTimeoutGuarded as a, resolveProviderHttpRequestConfigWithOriginTrust as c, readResponseBodySnippet as i, isMinimaxVlmProvider as n, postJsonRequest as o, minimaxUnderstandImage as r, resolveProviderHttpRequestConfig as s, isMinimaxVlmModel as t };
