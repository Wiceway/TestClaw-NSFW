import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-C8MGgrNG.js";
import { g as resolveDefaultAgentId, j as listAgentIds, t as AgentSelectionRequiredError } from "./agent-scope-config-BEuqweC1.js";
import { n as buildAgentMainSessionKey } from "./session-key-C0UQClgw.js";
import { b as isCronSessionKey, v as isAcpSessionKey, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-VdnPfhqM.js";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-BotH0dTM.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./agent-scope-BiRi-Smp.js";
import { n as parseModelRef } from "./model-selection-normalize-DyxdaT9v.js";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-Wz3M4QhR.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CdLHwx3v.js";
import "./message-channel-iCC7oIhe.js";
import "./session-accessor-DMf92PxK.js";
import "./method-scopes-D0hbLMo0.js";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-DRl7Rrsc.js";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BGyeftoC.js";
import { a as isAgentHarnessSessionKey, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-Bbf-OONo.js";
import "./model-selection-osPTiirn.js";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-Cu8q_Suv.js";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-B4BzDaVD.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-BZz9ZVdx.js";
import { a as authorizeResolvedSessionMutation, p as isResolvedIncognitoSession } from "./session-sharing-policy-rVme8bnl.js";
import "./session-sharing-xa1VG8U2.js";
import "./http-auth-utils-C8sXVcwB.js";
import { n as getHeader } from "./http-header-value-nMPtK0tB.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/http-utils.ts
const TESTCLAW_MODEL_ID = "testclaw";
/** Default OpenAI-compatible model alias that targets the default Assistant agent. */
const TESTCLAW_DEFAULT_MODEL_ID = "testclaw/default";
var UnknownGatewayAgentError = class extends Error {
	constructor(agentId) {
		super(`Unknown agent '${agentId}'.`);
		this.agentId = agentId;
		this.name = "UnknownGatewayAgentError";
	}
};
var GatewaySessionKeyOverrideError = class extends Error {
	constructor() {
		super("`x-testclaw-session-key` cannot use reserved internal session namespaces.");
		this.name = "GatewaySessionKeyOverrideError";
	}
};
var InvalidGatewayModelError = class extends Error {
	constructor() {
		super("Invalid `model`. Use `testclaw` or `testclaw/<agentId>`.");
		this.name = "InvalidGatewayModelError";
	}
};
function isUnknownGatewayAgentError(err) {
	return err instanceof UnknownGatewayAgentError;
}
function isAgentSelectionRequiredError(err) {
	return err instanceof AgentSelectionRequiredError;
}
function isInvalidGatewayModelError(err) {
	return err instanceof InvalidGatewayModelError;
}
function isGatewaySessionKeyOverrideError(err) {
	return err instanceof GatewaySessionKeyOverrideError;
}
function assertKnownAgentId(agentId, cfg = getRuntimeConfig()) {
	if (!listAgentIds(cfg).includes(agentId)) throw new UnknownGatewayAgentError(agentId);
}
function resolveAgentIdFromHeader(req) {
	const raw = normalizeOptionalString(getHeader(req, "x-testclaw-agent-id")) || normalizeOptionalString(getHeader(req, "x-testclaw-agent")) || "";
	if (!raw) return;
	if (!isValidAgentId(raw)) throw new UnknownGatewayAgentError(raw);
	return normalizeAgentId(raw);
}
/** Resolves the target agent encoded by an OpenAI-compatible model id. */
function resolveAgentIdFromModel(model, cfg = getRuntimeConfig()) {
	const raw = model?.trim();
	if (!raw) return;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "testclaw" || lowered === "testclaw/default") return resolveDefaultAgentId(cfg);
	const agentId = (raw.match(/^testclaw[:/](?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i) ?? raw.match(/^agent:(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i))?.groups?.agentId;
	if (!agentId) return;
	return normalizeAgentId(agentId);
}
/** Checks Assistant routing-model syntax without resolving fleet ownership. */
function isAssistantAgentModelId(model) {
	const raw = model?.trim();
	if (!raw) return false;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "testclaw" || lowered === "testclaw/default") return true;
	return /^testclaw[:/][a-z0-9][a-z0-9_-]{0,63}$/i.test(raw) || /^agent:[a-z0-9][a-z0-9_-]{0,63}$/i.test(raw);
}
/** Validates and resolves the `x-testclaw-model` override for OpenAI-compatible requests. */
async function resolveOpenAiCompatModelOverride(params) {
	const requestModel = params.model?.trim();
	if (requestModel && !isAssistantAgentModelId(requestModel)) return { errorMessage: "Invalid `model`. Use `testclaw` or `testclaw/<agentId>`." };
	const raw = getHeader(params.req, "x-testclaw-model")?.trim();
	if (!raw) return {};
	const cfg = getRuntimeConfig();
	const defaultProvider = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId
	}).provider;
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromState();
	const modelManifestContext = { manifestPlugins: getCurrentPluginMetadataSnapshot({
		config: cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	}) };
	const parsed = parseModelRef(raw, defaultProvider, {
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	if (!parsed) return { errorMessage: "Invalid `x-testclaw-model`." };
	const catalog = await loadGatewayModelCatalog({ agentId: params.agentId });
	const policy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	const normalized = modelKey(parsed.provider, parsed.model);
	if (!policy.allows(parsed)) return { errorMessage: `Model '${normalized}' is not allowed for agent '${params.agentId}'.` };
	return { modelOverride: raw };
}
/** Resolves the request agent from headers, model alias, or the configured default. */
function resolveAgentIdForRequest(params) {
	const cfg = getRuntimeConfig();
	if (params.model?.trim() && !isAssistantAgentModelId(params.model)) throw new InvalidGatewayModelError();
	const fromHeader = resolveAgentIdFromHeader(params.req);
	if (fromHeader) {
		assertKnownAgentId(fromHeader, cfg);
		return fromHeader;
	}
	const fromModel = resolveAgentIdFromModel(params.model, cfg);
	if (fromModel) {
		assertKnownAgentId(fromModel, cfg);
		return fromModel;
	}
	return resolveDefaultAgentId(cfg);
}
function resolveSessionKey(params) {
	const explicit = getHeader(params.req, "x-testclaw-session-key")?.trim();
	if (explicit) {
		if (isReservedSessionKeyOverride(explicit, params.agentId)) throw new GatewaySessionKeyOverrideError();
		return explicit;
	}
	const user = params.user?.trim();
	const mainKey = user ? `${params.prefix}-user:${user}` : `${params.prefix}:${randomUUID()}`;
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey
	});
}
function isReservedSessionKeyOverride(sessionKey, agentId) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	const harnessLookupKey = sessionKey.startsWith("agent:") ? sessionKey : canonicalizeSessionKeyForAgent(agentId, sessionKey);
	const harnessEntry = isAgentHarnessSessionKey(sessionKey) ? resolveSessionEntryAccessTarget({
		cfg: getRuntimeConfig(),
		sessionKey: harnessLookupKey
	}).entry : void 0;
	const harnessKeyReserved = isAgentHarnessSessionKey(sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry));
	return lowered.startsWith("subagent:") || lowered.startsWith("cron:") || lowered.startsWith("acp:") || harnessKeyReserved || isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
/** Resolves gateway agent/session/channel context for OpenAI-compatible handlers. */
function resolveGatewayRequestContext(params) {
	const agentId = resolveAgentIdForRequest({
		req: params.req,
		model: params.model
	});
	return {
		agentId,
		sessionKey: resolveSessionKey({
			req: params.req,
			agentId,
			user: params.user,
			prefix: params.sessionPrefix
		}),
		messageChannel: params.useMessageChannelHeader ? normalizeMessageChannel(getHeader(params.req, "x-testclaw-message-channel")) ?? params.defaultMessageChannel : params.defaultMessageChannel
	};
}
function authorizeOpenAiCompatibleHttpSession(params) {
	const cfg = getRuntimeConfig();
	const authenticatedUserProfile = params.requestAuth.authenticatedUserProfile;
	const authorizationError = authorizeResolvedSessionMutation({
		cfg,
		client: createSyntheticPluginRuntimeClient({
			...authenticatedUserProfile ? { authenticatedUserProfile } : {},
			operatorRoleActor: params.requestAuth.operatorRoleActor,
			operatorAccessAuthority: params.requestAuth.operatorAccessAuthority,
			scopes: params.senderIsOwner ? [ADMIN_SCOPE] : []
		}),
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (authorizationError) return {
		allowed: false,
		message: authorizationError.message
	};
	if (!params.senderIsOwner && !authenticatedUserProfile && isResolvedIncognitoSession({
		cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	})) return {
		allowed: false,
		message: `missing scope: ${ADMIN_SCOPE}`
	};
	return { allowed: true };
}
//#endregion
export { isGatewaySessionKeyOverrideError as a, isUnknownGatewayAgentError as c, resolveGatewayRequestContext as d, resolveOpenAiCompatModelOverride as f, isAgentSelectionRequiredError as i, resolveAgentIdForRequest as l, TESTCLAW_MODEL_ID as n, isInvalidGatewayModelError as o, authorizeOpenAiCompatibleHttpSession as r, isAssistantAgentModelId as s, TESTCLAW_DEFAULT_MODEL_ID as t, resolveAgentIdFromModel as u };
