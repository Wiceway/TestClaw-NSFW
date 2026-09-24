import { T as tryResolveLegacyCompatibilityAgentId, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import "./agent-scope-BiRi-Smp.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-D0hbLMo0.js";
import { r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-C8sXVcwB.js";
import { c as sendJson, f as sendUnauthorized, l as sendMethodNotAllowed, s as sendInvalidRequest, u as sendMissingScopeForbidden } from "./http-common-B6Aa-Wrt.js";
import { n as TESTCLAW_MODEL_ID, s as isAssistantAgentModelId, t as TESTCLAW_DEFAULT_MODEL_ID, u as resolveAgentIdFromModel } from "./http-utils-mwsAlJoy.js";
//#region src/gateway/models-http.ts
function toOpenAiModel(id) {
	return {
		id,
		object: "model",
		created: 0,
		owned_by: "testclaw",
		permission: []
	};
}
function loadAgentModelIds() {
	const cfg = getRuntimeConfig();
	const ids = /* @__PURE__ */ new Set([TESTCLAW_MODEL_ID, TESTCLAW_DEFAULT_MODEL_ID]);
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	if (compatibilityAgentId) ids.add(`testclaw/${compatibilityAgentId}`);
	for (const agentId of listAgentIds(cfg)) ids.add(`testclaw/${agentId}`);
	return Array.from(ids);
}
function resolveRequestPath(req) {
	return new URL(req.url ?? "/", "http://localhost").pathname;
}
/** Handle OpenAI-compatible model list/detail requests, returning false for unrelated paths. */
async function handleOpenAiModelsHttpRequest(req, res, opts) {
	const requestPath = resolveRequestPath(req);
	if (requestPath !== "/v1/models" && !requestPath.startsWith("/v1/models/")) return false;
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	if (!requestAuth.hasCurrentClientAuthority()) {
		sendUnauthorized(res);
		return true;
	}
	const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForMethod("models.list", requestedScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const ids = loadAgentModelIds();
	if (requestPath === "/v1/models") {
		sendJson(res, 200, {
			object: "list",
			data: ids.map(toOpenAiModel)
		});
		return true;
	}
	const encodedId = requestPath.slice(11);
	if (!encodedId) {
		sendInvalidRequest(res, "Missing model id.");
		return true;
	}
	let decodedId;
	try {
		decodedId = decodeURIComponent(encodedId);
	} catch {
		sendInvalidRequest(res, "Invalid model id encoding.");
		return true;
	}
	if (!isAssistantAgentModelId(decodedId)) {
		sendInvalidRequest(res, "Invalid model id.");
		return true;
	}
	const normalizedModelId = decodedId.trim().toLowerCase();
	if (normalizedModelId !== "testclaw" && normalizedModelId !== "testclaw/default") {
		const cfg = getRuntimeConfig();
		const agentId = resolveAgentIdFromModel(decodedId, cfg);
		if (!agentId || !listAgentIds(cfg).includes(agentId)) {
			sendJson(res, 404, { error: {
				message: `Model '${decodedId}' not found.`,
				type: "invalid_request_error"
			} });
			return true;
		}
	}
	if (!ids.includes(decodedId)) {
		sendJson(res, 404, { error: {
			message: `Model '${decodedId}' not found.`,
			type: "invalid_request_error"
		} });
		return true;
	}
	sendJson(res, 200, toOpenAiModel(decodedId));
	return true;
}
//#endregion
export { handleOpenAiModelsHttpRequest };
