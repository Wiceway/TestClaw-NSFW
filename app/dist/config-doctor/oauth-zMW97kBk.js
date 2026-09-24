import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { C as positiveSecondsToSafeMilliseconds, M as resolveTimerTimeoutMs, T as resolveExpiresAtMsFromDurationMs } from "./number-coercion-0M4tZV2c.js";
import { i as readResponseWithLimit } from "./http-response-body-BEF2-H0F.js";
import "./errors-cp9Var1Z.js";
import "./http-body-C9nYeJpi.js";
import { n as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-BL3dBQkw.js";
import { t as startOAuthLoopbackCallbackServer } from "./oauth-loopback-callback-3FPfcH53.js";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.js";
//#region src/plugins/provider-runtime.errors.ts
const OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE = "OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE";
/** A known OAuth provider could not load its owning plugin or required auth hooks. */
var OAuthProviderConfiguredUnavailableError = class extends Error {
	constructor(providerId) {
		super(`OAuth provider "${providerId}" is configured but unavailable. Install or enable its owning plugin, then retry; run testclaw doctor for diagnostics.`);
		this.code = OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE;
		this.state = "configured-unavailable";
		this.name = "OAuthProviderConfiguredUnavailableError";
		this.providerId = providerId;
	}
};
//#endregion
//#region src/plugin-sdk/provider-oauth-runtime.ts
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" aria-hidden="true"><defs><linearGradient id="lobster-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><path fill="url(#lobster-gradient)" d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"/><path fill="url(#lobster-gradient)" d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"/><path fill="url(#lobster-gradient)" d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"/><path stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" d="M45 15 Q35 5 30 8"/><path stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" d="M75 15 Q85 5 90 8"/><circle cx="45" cy="35" r="6" fill="#050810"/><circle cx="75" cy="35" r="6" fill="#050810"/><circle cx="46" cy="34" r="2.5" fill="#00e5cc"/><circle cx="76" cy="34" r="2.5" fill="#00e5cc"/></svg>`;
function renderOAuthPage(options) {
	const title = escapeHtml(options.title);
	const heading = escapeHtml(options.heading);
	const message = escapeHtml(options.message);
	const details = options.details ? escapeHtml(options.details) : void 0;
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --text: #fafafa;
      --text-dim: #a1a1aa;
      --page-bg: #09090b;
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: var(--font-sans);
      text-align: center;
    }
    main {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      display: block;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      line-height: 1.15;
      font-weight: 650;
      color: var(--text);
    }
    p {
      margin: 0;
      line-height: 1.7;
      color: var(--text-dim);
      font-size: 15px;
    }
    .details {
      margin-top: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-dim);
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <main>
    <div class="logo">${LOGO_SVG}</div>
    <h1>${heading}</h1>
    <p>${message}</p>
    ${details ? `<div class="details">${details}</div>` : ""}
  </main>
</body>
</html>`;
}
/**
* Renders the local OAuth callback success page after provider authentication completes.
*/
function oauthSuccessHtml(message) {
	return renderOAuthPage({
		title: "Authentication successful",
		heading: "Authentication successful",
		message
	});
}
/**
* Renders the local OAuth callback error page without exposing raw credential material.
*/
function oauthErrorHtml(message, details) {
	return renderOAuthPage({
		title: "Authentication failed",
		heading: "Authentication failed",
		message,
		details
	});
}
function base64urlEncode(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]/g, "");
}
/** Generates an OAuth PKCE verifier and SHA-256 challenge using base64url encoding. */
async function generatePKCE() {
	const verifierBytes = /* @__PURE__ */ new Uint8Array(32);
	crypto.getRandomValues(verifierBytes);
	const verifier = base64urlEncode(verifierBytes);
	const data = new TextEncoder().encode(verifier);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return {
		verifier,
		challenge: base64urlEncode(new Uint8Array(hashBuffer))
	};
}
/** Generates a random base64url OAuth state value for CSRF protection. */
function generateBase64UrlOAuthState() {
	const stateBytes = /* @__PURE__ */ new Uint8Array(32);
	crypto.getRandomValues(stateBytes);
	return base64urlEncode(stateBytes);
}
/**
* Parses callback URLs, raw query strings, `code#state`, or plain pasted codes.
* Empty input returns an empty object so callers can keep prompting.
*/
function parseOAuthAuthorizationInput(input) {
	const value = input.trim();
	if (!value) return {};
	try {
		const url = new URL(value);
		return {
			code: url.searchParams.get("code") ?? void 0,
			state: url.searchParams.get("state") ?? void 0
		};
	} catch {}
	if (value.includes("#")) {
		const [code, state] = value.split("#", 2);
		return {
			code,
			state
		};
	}
	if (value.includes("code=")) {
		const params = new URLSearchParams(value);
		return {
			code: params.get("code") ?? void 0,
			state: params.get("state") ?? void 0
		};
	}
	return { code: value };
}
/** Converts provider `expires_in` seconds into safe positive milliseconds. */
function resolveOAuthTokenLifetimeMs(value) {
	return positiveSecondsToSafeMilliseconds(value);
}
/** Resolves provider token lifetime into an absolute expiry timestamp with optional refresh skew. */
function resolveOAuthTokenExpiresAt(value, options = {}) {
	const lifetimeMs = resolveOAuthTokenLifetimeMs(value);
	return lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs, {
		nowMs: options.nowMs,
		bufferMs: options.refreshSkewMs
	});
}
/**
* Creates the shared cancellation error used by abortable OAuth login flows.
*/
function createOAuthLoginCancelledError() {
	return /* @__PURE__ */ new Error("Login cancelled");
}
/** Throws the shared OAuth cancellation error when a login signal is already aborted. */
function throwIfOAuthLoginAborted(signal) {
	if (signal?.aborted) throw createOAuthLoginCancelledError();
}
/** Races a pending OAuth login step against the login abort signal and normalizes rejections. */
function withOAuthLoginAbort(promise, signal, onAbort) {
	if (!signal) return promise;
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			signal.removeEventListener("abort", abort);
		};
		const abort = () => {
			cleanup();
			onAbort?.();
			reject(createOAuthLoginCancelledError());
		};
		if (signal.aborted) {
			abort();
			return;
		}
		signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			cleanup();
			resolve(value);
		}, (error) => {
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
/** Combines a caller abort signal with a bounded timeout signal for OAuth HTTP requests. */
function buildOAuthRequestSignal(options) {
	const timeoutSignal = AbortSignal.timeout(resolveTimerTimeoutMs(options.timeoutMs, 0, 0));
	if (!options.signal) return timeoutSignal;
	return AbortSignal.any([options.signal, timeoutSignal]);
}
//#endregion
//#region src/llm/utils/oauth/anthropic.ts
/**
* Anthropic OAuth flow (Claude Pro/Max)
*
* NOTE: This module uses Node.js http.createServer for the OAuth callback server.
* It is only intended for CLI use, not browser environments.
*/
const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const AUTHORIZE_URL = "https://claude.ai/oauth/authorize";
const TOKEN_URL = "https://platform.claude.com/v1/oauth/token";
const DEFAULT_CALLBACK_HOST = "127.0.0.1";
const LOOPBACK_CALLBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1"
]);
const REDIRECT_URI = `http://localhost:53692/callback`;
const CALLBACK_TIMEOUT_MS = 3e5;
function resolveCallbackHost(env = process.env) {
	const host = env.TESTCLAW_OAUTH_CALLBACK_HOST?.trim() || DEFAULT_CALLBACK_HOST;
	if (!LOOPBACK_CALLBACK_HOSTS.has(host)) throw new Error("Anthropic OAuth callback host must be localhost, 127.0.0.1, or ::1");
	return host;
}
const SCOPES = "org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";
/** Max response body bytes for Anthropic OAuth token endpoint (16 MiB). */
const OAUTH_RESPONSE_MAX_BYTES = 16777216;
function formatErrorDetails(error) {
	if (error instanceof Error) {
		const details = [`${error.name}: ${error.message}`];
		const errorWithCode = error;
		if (errorWithCode.code) details.push(`code=${errorWithCode.code}`);
		if (errorWithCode.errno !== void 0) details.push(`errno=${String(errorWithCode.errno)}`);
		if (error.cause !== void 0) details.push(`cause=${formatErrorDetails(error.cause)}`);
		if (error.stack) details.push(`stack=${error.stack}`);
		return details.join("; ");
	}
	return String(error);
}
function formatTokenResponseParseContext(responseBody) {
	return `bodyBytes=${Buffer.byteLength(responseBody, "utf8")}`;
}
function parseTokenCredentials(responseBody, options) {
	let data;
	try {
		data = JSON.parse(responseBody);
	} catch (error) {
		throw new Error(`${options.invalidJsonMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}; details=${formatErrorDetails(error)}`, { cause: error });
	}
	if (!data || typeof data !== "object") throw new Error(`${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`);
	const record = data;
	const expires = resolveOAuthTokenExpiresAt(record.expires_in, { refreshSkewMs: 3e5 });
	if (typeof record.access_token !== "string" || !record.access_token || typeof record.refresh_token !== "string" || !record.refresh_token || expires === void 0) throw new Error(`${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`);
	return {
		refresh: record.refresh_token,
		access: record.access_token,
		expires
	};
}
async function startCallbackServer(expectedState) {
	if (typeof process === "undefined" || !process.versions?.node && !process.versions?.bun) throw new Error("Anthropic OAuth is only available in Node.js environments");
	const callback = await startOAuthLoopbackCallbackServer({
		redirectUrl: REDIRECT_URI,
		expectedState,
		timeoutMs: CALLBACK_TIMEOUT_MS,
		bindHostname: resolveCallbackHost(),
		renderSuccess: () => ({
			body: oauthSuccessHtml("Authorization received; return to the terminal while Assistant finishes."),
			contentType: "text/html; charset=utf-8"
		}),
		renderError: (message) => ({
			body: oauthErrorHtml(message),
			contentType: "text/html; charset=utf-8"
		})
	});
	return {
		cancelWait: () => void callback.close(),
		waitForCode: async () => {
			try {
				const result = await callback.waitForCallback();
				if (result.type === "oauth_error") throw new Error(`Anthropic OAuth error: ${result.error}`);
				return {
					code: result.code,
					state: result.state
				};
			} catch (error) {
				if (error instanceof Error && (error.message === "OAuth callback timeout" || error.message === "OAuth callback cancelled")) return null;
				throw error;
			}
		},
		close: callback.close
	};
}
async function postJson(url, body, options = {}) {
	const timeoutMs = options.timeoutMs ?? 3e4;
	throwIfOAuthLoginAborted(options.signal);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(body),
		signal: buildOAuthRequestSignal({
			signal: options.signal,
			timeoutMs
		})
	});
	const buffer = await readResponseWithLimit(response, OAUTH_RESPONSE_MAX_BYTES, { onOverflow: ({ size }) => /* @__PURE__ */ new Error(`Anthropic OAuth response too large: ${size} bytes`) });
	const responseBody = new TextDecoder().decode(buffer);
	if (!response.ok) throw new Error(`HTTP request failed. status=${response.status}; url=${url}; body=${responseBody}`);
	return responseBody;
}
async function exchangeAuthorizationCode(code, state, verifier, redirectUri, signal) {
	let responseBody;
	try {
		responseBody = await postJson(TOKEN_URL, {
			grant_type: "authorization_code",
			client_id: CLIENT_ID,
			code,
			state,
			redirect_uri: redirectUri,
			code_verifier: verifier
		}, { signal });
	} catch (error) {
		if (signal?.aborted) throw createOAuthLoginCancelledError();
		throw new Error(`Token exchange request failed. url=${TOKEN_URL}; redirect_uri=${redirectUri}; response_type=authorization_code; details=${formatErrorDetails(error)}`, { cause: error });
	}
	return parseTokenCredentials(responseBody, {
		invalidJsonMessage: "Token exchange returned invalid JSON.",
		invalidFieldsMessage: "Token exchange returned invalid token fields."
	});
}
/**
* Login with Anthropic OAuth (authorization code + PKCE)
*/
async function loginAnthropic(options) {
	throwIfOAuthLoginAborted(options.signal);
	const { verifier, challenge } = await generatePKCE();
	const expectedState = generateBase64UrlOAuthState();
	const server = await startCallbackServer(expectedState);
	let code;
	let state;
	try {
		throwIfOAuthLoginAborted(options.signal);
		const authParams = new URLSearchParams({
			code: "true",
			client_id: CLIENT_ID,
			response_type: "code",
			redirect_uri: REDIRECT_URI,
			scope: SCOPES,
			code_challenge: challenge,
			code_challenge_method: "S256",
			state: expectedState
		});
		options.onAuth({
			url: `${AUTHORIZE_URL}?${authParams.toString()}`,
			instructions: "Complete login in your browser. If the browser is on another machine, paste the final redirect URL here."
		});
		throwIfOAuthLoginAborted(options.signal);
		if (options.onManualCodeInput) {
			let manualInput;
			let manualError;
			const manualPromise = options.onManualCodeInput().then((input) => {
				manualInput = input;
				server.cancelWait();
			}).catch((err) => {
				manualError = err instanceof Error ? err : new Error(String(err));
				server.cancelWait();
			});
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (manualError) throw manualError;
			if (result?.code) {
				code = result.code;
				state = result.state;
			} else if (manualInput) {
				const parsed = parseOAuthAuthorizationInput(manualInput);
				if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
				code = parsed.code;
				state = parsed.state ?? expectedState;
			}
			if (!code) {
				await withOAuthLoginAbort(manualPromise, options.signal, server.cancelWait);
				if (manualError) throw toErrorObject(manualError, "Non-Error thrown");
				if (manualInput) {
					const parsed = parseOAuthAuthorizationInput(manualInput);
					if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
					code = parsed.code;
					state = parsed.state ?? expectedState;
				}
			}
		} else {
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (result?.code) {
				code = result.code;
				state = result.state;
			}
		}
		if (!code) {
			const parsed = parseOAuthAuthorizationInput(await withOAuthLoginAbort(options.onPrompt({
				message: "Paste the authorization code or full redirect URL:",
				placeholder: REDIRECT_URI
			}), options.signal, server.cancelWait));
			if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
			code = parsed.code;
			state = parsed.state ?? expectedState;
		}
		if (!code) throw new Error("Missing authorization code");
		if (!state) throw new Error("Missing OAuth state");
		options.onProgress?.("Exchanging authorization code for tokens...");
		return exchangeAuthorizationCode(code, state, verifier, REDIRECT_URI, options.signal);
	} finally {
		await server.close();
	}
}
/**
* Refresh Anthropic OAuth token
*/
async function refreshAnthropicToken(refreshToken) {
	let responseBody;
	try {
		responseBody = await postJson(TOKEN_URL, {
			grant_type: "refresh_token",
			client_id: CLIENT_ID,
			refresh_token: refreshToken
		});
	} catch (error) {
		throw new Error(`Anthropic token refresh request failed. url=${TOKEN_URL}; details=${formatErrorDetails(error)}`, { cause: error });
	}
	return parseTokenCredentials(responseBody, {
		invalidJsonMessage: "Anthropic token refresh returned invalid JSON.",
		invalidFieldsMessage: "Anthropic token refresh returned invalid token fields."
	});
}
const anthropicOAuthProvider = {
	id: "anthropic",
	name: "Anthropic (Claude Pro/Max)",
	usesCallbackServer: true,
	async login(callbacks) {
		return loginAnthropic({
			onAuth: callbacks.onAuth,
			onPrompt: callbacks.onPrompt,
			onProgress: callbacks.onProgress,
			onManualCodeInput: callbacks.onManualCodeInput,
			signal: callbacks.signal
		});
	},
	async refreshToken(credentials) {
		return refreshAnthropicToken(credentials.refresh);
	},
	getApiKey(credentials) {
		return credentials.access;
	}
};
//#endregion
//#region src/llm/utils/oauth/openai-chatgpt.ts
const OPENAI_CODEX_PROVIDER_ID = "openai";
function loadOpenAICodexOAuthFacade() {
	return loadActivatedBundledPluginPublicSurfaceModuleSync({
		dirName: "openai",
		artifactBasename: "api.js"
	});
}
function createLegacyRuntime(callbacks) {
	return {
		log: (message) => callbacks.onProgress?.(String(message)),
		error: (message) => callbacks.onProgress?.(String(message)),
		exit: (code) => {
			throw new Error(`exit:${code}`);
		}
	};
}
function createLegacyPrompter(callbacks) {
	const progress = {
		update: (message) => callbacks.onProgress?.(message),
		stop: (message) => {
			if (message) callbacks.onProgress?.(message);
		}
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message) => callbacks.onProgress?.(message),
		select: async (params) => params.options[0]?.value,
		multiselect: async (params) => params.initialValues ?? [],
		text: async (prompt) => {
			return await withOAuthLoginAbort(callbacks.onPrompt({
				message: prompt.message,
				placeholder: prompt.placeholder
			}), callbacks.signal);
		},
		confirm: async () => false,
		progress: () => progress
	};
}
async function refreshViaProviderRuntime(refreshToken) {
	const { refreshProviderOAuthCredentialWithPlugin } = await import("./provider-runtime.runtime-6USVCbaa.js");
	const refreshed = await refreshProviderOAuthCredentialWithPlugin({
		provider: OPENAI_CODEX_PROVIDER_ID,
		context: {
			type: "oauth",
			provider: OPENAI_CODEX_PROVIDER_ID,
			access: "",
			refresh: refreshToken,
			expires: 0
		}
	});
	if (!refreshed) return await loadOpenAICodexOAuthFacade().refreshOpenAICodexToken(refreshToken);
	const credentials = { ...refreshed };
	delete credentials.type;
	delete credentials.provider;
	return credentials;
}
/** Runs the ChatGPT/Codex OAuth login flow and returns normalized credentials. */
async function loginOpenAICodex(callbacks) {
	throwIfOAuthLoginAborted(callbacks.signal);
	const { loginOpenAICodexOAuth } = await import("./provider-openai-chatgpt-oauth-i9gkkHhu.js");
	const manualCodeInput = callbacks.onManualCodeInput;
	const onManualCodeInput = manualCodeInput ? async () => await withOAuthLoginAbort(manualCodeInput(), callbacks.signal) : void 0;
	const credentials = await withOAuthLoginAbort(loginOpenAICodexOAuth({
		prompter: createLegacyPrompter(callbacks),
		runtime: createLegacyRuntime(callbacks),
		isRemote: false,
		signal: callbacks.signal,
		onManualCodeInput,
		openUrl: async (url) => {
			throwIfOAuthLoginAborted(callbacks.signal);
			await callbacks.onAuth({ url });
		}
	}), callbacks.signal);
	if (!credentials) throw new Error("OpenAI Codex OAuth login did not return credentials.");
	return credentials;
}
/** Refreshes a ChatGPT/Codex OAuth token through the provider runtime or bundled facade. */
async function refreshOpenAICodexToken(refreshToken) {
	return await refreshViaProviderRuntime(refreshToken);
}
//#endregion
//#region src/llm/utils/oauth/index.ts
/**
* OAuth credential management for AI providers.
*
* This module handles login, token refresh, and credential storage
* for OAuth-based providers:
* - Anthropic (Claude Pro/Max)
* - provider plugins through their runtime auth hooks
*/
const BUILT_IN_OAUTH_PROVIDERS = [anthropicOAuthProvider, {
	id: OPENAI_CODEX_PROVIDER_ID,
	name: "ChatGPT Plus/Pro (Codex Subscription)",
	usesCallbackServer: true,
	async login(callbacks) {
		return await loginOpenAICodex(callbacks);
	},
	async refreshToken(credentials) {
		return await refreshOpenAICodexToken(credentials.refresh);
	},
	getApiKey(credentials) {
		return credentials.access;
	}
}];
async function resolveOAuthApiKey(provider, credentials) {
	let creds = credentials[provider.id];
	if (!creds) return null;
	if (Date.now() >= creds.expires) try {
		creds = await provider.refreshToken(creds);
	} catch (error) {
		throw new Error(`Failed to refresh OAuth token for ${provider.id}`, { cause: error });
	}
	return {
		newCredentials: creds,
		apiKey: provider.getApiKey(creds)
	};
}
/** Mutable OAuth provider registrations owned by one auth/session runtime. */
var OAuthProviderRegistry = class {
	constructor() {
		this.providers = /* @__PURE__ */ new Map();
		this.reset();
	}
	get(id) {
		return this.providers.get(id);
	}
	register(provider) {
		this.providers.set(provider.id, provider);
	}
	reset() {
		this.providers.clear();
		for (const provider of BUILT_IN_OAUTH_PROVIDERS) this.providers.set(provider.id, provider);
	}
	getAll() {
		return Array.from(this.providers.values());
	}
	async getApiKey(providerId, credentials) {
		const provider = this.get(providerId);
		if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
		return resolveOAuthApiKey(provider, credentials);
	}
};
/**
* Get a built-in OAuth provider by ID.
*/
function getOAuthProvider(id) {
	return BUILT_IN_OAUTH_PROVIDERS.find((provider) => provider.id === id);
}
/**
* Get all built-in OAuth providers.
*/
function getOAuthProviders() {
	return [...BUILT_IN_OAUTH_PROVIDERS];
}
/**
* Get API key for a provider from OAuth credentials.
* Automatically refreshes expired tokens.
*
* @returns API key string and updated credentials, or null if no credentials
* @throws Error if refresh fails
*/
async function getOAuthApiKey(providerId, credentials) {
	const provider = getOAuthProvider(providerId);
	if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
	return resolveOAuthApiKey(provider, credentials);
}
//#endregion
export { OAuthProviderConfiguredUnavailableError as i, getOAuthApiKey as n, getOAuthProviders as r, OAuthProviderRegistry as t };
