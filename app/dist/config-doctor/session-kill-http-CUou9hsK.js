import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-D0hbLMo0.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DlmWzvmc.js";
import "./session-utils-DyRtmfj4.js";
import { r as killSubagentRunAdmin } from "./subagent-control-kill-EhT6TBS6.js";
import "./subagent-control-Br4s_G56.js";
import { d as resolveTrustedHttpOperatorScopes, r as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-C8sXVcwB.js";
import { c as sendJson, l as sendMethodNotAllowed, s as sendInvalidRequest, u as sendMissingScopeForbidden } from "./http-common-B6Aa-Wrt.js";
import "./http-utils-mwsAlJoy.js";
//#region src/gateway/session-kill-http.ts
function resolveSessionKeyFromPath(pathname) {
	const match = pathname.match(/^\/sessions\/([^/]+)\/kill$/);
	if (!match) return { matched: false };
	try {
		const decoded = decodeURIComponent(match[1] ?? "").trim();
		if (!decoded) return {
			error: "invalid-session-key",
			matched: true
		};
		return {
			matched: true,
			sessionKey: decoded
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
async function handleSessionKillHttpRequest(req, res, opts) {
	const cfg = opts.cfg ?? getRuntimeConfig();
	const url = new URL(req.url ?? "/", "http://localhost");
	const sessionKeyResolution = resolveSessionKeyFromPath(url.pathname);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		cfg,
		trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback
	});
	if (!requestAuth) return true;
	const requestedScopes = resolveTrustedHttpOperatorScopes(req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, requestedScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, url.searchParams.get("agentId") ?? void 0);
	if (!requestedAgent.ok) {
		sendInvalidRequest(res, requestedAgent.error.message);
		return true;
	}
	const { entry, canonicalKey } = loadGatewaySessionEntry(sessionKey, { agentId: requestedAgent.agentId });
	if (!entry) {
		sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		return true;
	}
	const result = await killSubagentRunAdmin({
		cfg,
		sessionKey: canonicalKey,
		agentId: requestedAgent.agentId
	}, { assertCurrent: requestAuth.assertCurrent });
	if (result.found && result.error) {
		sendJson(res, 503, {
			ok: false,
			error: {
				type: "unavailable",
				message: result.error
			}
		});
		return true;
	}
	sendJson(res, 200, {
		ok: true,
		killed: result.killed
	});
	return true;
}
//#endregion
export { handleSessionKillHttpRequest };
