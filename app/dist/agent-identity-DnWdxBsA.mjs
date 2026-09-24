import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { o as classifySessionKeyShape } from "./session-key-C_bfgyCp.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-C2LdSyZM.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { t as validateAgentIdentityParams } from "./src-BNV0SJoP.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-CmhrS9-1.mjs";
import { o as resolveAssistantIdentity, r as resolveGatewayAssistantAvatar } from "./assistant-avatar-BlC0Axxe.mjs";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-D1ICZmg0.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
//#region src/gateway/server-methods/agent-identity.ts
const agentIdentityGetHandler = ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateAgentIdentityParams, "agent.identity.get", respond)) return;
	const agentIdRaw = normalizeOptionalString(params.agentId) ?? "";
	const sessionKeyRaw = normalizeOptionalString(params.sessionKey) ?? "";
	const cfg = context.getRuntimeConfig();
	let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (sessionKeyRaw) {
		if (classifySessionKeyShape(sessionKeyRaw) === "malformed_agent") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: malformed session key "${sessionKeyRaw}"`));
			return;
		}
		const resolved = resolveRequestedSessionAgentId(cfg, sessionKeyRaw, agentId);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		agentId = resolved.agentId;
	} else if (!agentId) {
		const resolved = resolveRequestedSessionAgentId(cfg, "main");
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		agentId = resolved.agentId;
	}
	const identity = resolveAssistantIdentity({
		cfg,
		agentId
	});
	const avatarProjection = resolveGatewayAssistantAvatar({
		cfg,
		identity,
		httpBasePath: client?.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI ? cfg.gateway?.controlUi?.basePath ?? "" : void 0
	});
	const avatarResolution = avatarProjection.resolution;
	respond(true, {
		...identity,
		avatar: avatarProjection.avatar,
		avatarSource: avatarResolution ? resolvePublicAgentAvatarSource(avatarResolution) : void 0,
		avatarStatus: avatarResolution?.kind,
		avatarReason: avatarResolution?.kind === "none" ? avatarResolution.reason : void 0
	}, void 0);
};
const agentIdentityHandlers = { "agent.identity.get": agentIdentityGetHandler };
//#endregion
export { agentIdentityHandlers };
