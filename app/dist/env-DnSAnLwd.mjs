import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import process$1 from "node:process";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createAmbientNodeProxyAgent } from "@testclaw/proxyline";
//#region src/proxy-capture/paths.ts
function resolveDebugProxyRootDir(env = process.env) {
	return path.join(resolveStateDir(env), "debug-proxy");
}
/** @deprecated Capture storage now lives in the shared state database. */
function resolveDebugProxyDbPath(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}
/** @deprecated Capture payloads now live in the shared state database. */
function resolveDebugProxyBlobDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "blobs");
}
function resolveDebugProxyCertDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "certs");
}
//#endregion
//#region src/proxy-capture/env.ts
const TESTCLAW_DEBUG_PROXY_ENABLED = "TESTCLAW_DEBUG_PROXY_ENABLED";
const TESTCLAW_DEBUG_PROXY_URL = "TESTCLAW_DEBUG_PROXY_URL";
const TESTCLAW_DEBUG_PROXY_CERT_DIR = "TESTCLAW_DEBUG_PROXY_CERT_DIR";
const TESTCLAW_DEBUG_PROXY_SESSION_ID = "TESTCLAW_DEBUG_PROXY_SESSION_ID";
const TESTCLAW_DEBUG_PROXY_REQUIRE = "TESTCLAW_DEBUG_PROXY_REQUIRE";
let cachedImplicitSessionId;
function isTruthy(value) {
	return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveDebugProxySettings(env = process$1.env) {
	const enabled = isTruthy(env[TESTCLAW_DEBUG_PROXY_ENABLED]);
	const sessionId = (env[TESTCLAW_DEBUG_PROXY_SESSION_ID]?.trim() || void 0) ?? (cachedImplicitSessionId ??= randomUUID());
	return {
		enabled,
		required: isTruthy(env[TESTCLAW_DEBUG_PROXY_REQUIRE]),
		proxyUrl: env[TESTCLAW_DEBUG_PROXY_URL]?.trim() || void 0,
		dbPath: resolveDebugProxyDbPath(env),
		blobDir: resolveDebugProxyBlobDir(env),
		certDir: env[TESTCLAW_DEBUG_PROXY_CERT_DIR]?.trim() || resolveDebugProxyCertDir(env),
		sessionId,
		sourceProcess: "testclaw"
	};
}
function resolveEnabledDebugProxySettings(resolved) {
	if (!(resolved?.enabled ?? isTruthy(process$1.env[TESTCLAW_DEBUG_PROXY_ENABLED]))) return;
	return resolved ?? resolveDebugProxySettings();
}
function applyDebugProxyEnv(env, params) {
	return {
		...env,
		[TESTCLAW_DEBUG_PROXY_ENABLED]: "1",
		[TESTCLAW_DEBUG_PROXY_REQUIRE]: "1",
		[TESTCLAW_DEBUG_PROXY_URL]: params.proxyUrl,
		[TESTCLAW_DEBUG_PROXY_CERT_DIR]: params.certDir ?? resolveDebugProxyCertDir(env),
		[TESTCLAW_DEBUG_PROXY_SESSION_ID]: params.sessionId,
		HTTP_PROXY: params.proxyUrl,
		HTTPS_PROXY: params.proxyUrl,
		ALL_PROXY: params.proxyUrl
	};
}
function createDebugProxyWebSocketAgent(settings) {
	if (!settings.enabled || !settings.proxyUrl) return;
	return createAmbientNodeProxyAgent({
		protocol: "https",
		env: {
			HTTP_PROXY: settings.proxyUrl,
			HTTPS_PROXY: settings.proxyUrl,
			ALL_PROXY: void 0,
			NO_PROXY: void 0,
			http_proxy: void 0,
			https_proxy: void 0,
			all_proxy: void 0,
			no_proxy: void 0
		}
	});
}
function resolveEffectiveDebugProxyUrl(configuredProxyUrl) {
	const explicit = configuredProxyUrl?.trim();
	if (explicit) return explicit;
	return resolveEnabledDebugProxySettings()?.proxyUrl;
}
//#endregion
export { resolveEnabledDebugProxySettings as a, resolveEffectiveDebugProxyUrl as i, createDebugProxyWebSocketAgent as n, resolveDebugProxySettings as r, applyDebugProxyEnv as t };
