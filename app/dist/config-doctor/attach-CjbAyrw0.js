import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as asRecord } from "./record-coerce-DItp3I4t.js";
import { l as asPositiveFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import "./session-accessor-DMf92PxK.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { i as resolveSessionStoreKey } from "./session-store-key-DRl7Rrsc.js";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BGyeftoC.js";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-Bbf-OONo.js";
import "./session-utils-DyRtmfj4.js";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-DzYsDWAV.js";
import { i as mintAttachGrant, l as revokeAttachGrant } from "./mcp-grant-store-Da84_Og8.js";
import { n as ensureMcpLoopbackServer } from "./mcp-http-66JXjXi3.js";
//#region src/gateway/server-methods/attach.ts
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = asRecord(params);
		const cfg = context.getRuntimeConfig();
		const requestedSessionKey = normalizeOptionalString(grantParams.sessionKey) ?? "main";
		const requestedAgent = resolveRequestedSessionAgentId(cfg, requestedSessionKey, normalizeOptionalString(grantParams.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const storageSessionKey = resolveSessionStoreKey({
			cfg,
			sessionKey: requestedSessionKey,
			storeAgentId: requestedAgent.agentId
		});
		const sessionKey = parseAgentSessionKey(storageSessionKey) ? storageSessionKey : `agent:${requestedAgent.agentId}:${storageSessionKey}`;
		const harnessEntry = isAgentHarnessSessionKey(storageSessionKey) ? resolveSessionEntryAccessTarget({
			cfg,
			sessionKey: storageSessionKey
		}).entry : void 0;
		if (isAgentHarnessSessionKey(storageSessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(storageSessionKey, harnessEntry))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
			return;
		}
		await ensureMcpLoopbackServer();
		const runtime = getActiveMcpLoopbackRuntime();
		if (!runtime) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "mcp loopback server unavailable"));
			return;
		}
		const grant = mintAttachGrant({
			sessionKey,
			ttlMs: asPositiveFiniteNumber(grantParams.ttlMs)
		});
		respond(true, {
			sessionKey: grant.sessionKey,
			token: grant.token,
			expiresAtMs: grant.expiresAtMs,
			mcpConfig: createMcpAttachGrantServerConfig(runtime.port),
			env: { TESTCLAW_MCP_TOKEN: grant.token }
		});
	},
	"attach.revoke": async ({ params, respond }) => {
		const token = normalizeOptionalString(asRecord(params).token);
		if (!token) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "token is required"));
			return;
		}
		respond(true, { revoked: revokeAttachGrant(token) });
	}
};
//#endregion
export { attachHandlers };
