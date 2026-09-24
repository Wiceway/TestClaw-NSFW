import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C2LdSyZM.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Cn as validateModelsListParams } from "./src-BNV0SJoP.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-DXLmfAVp.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DePOhdT-.mjs";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-B77IW0Bv.mjs";
import { n as resolveChatMetadataReadParams } from "./chat-metadata-handler-ri64sVv6.mjs";
import { i as projectSessionModelCatalog } from "./chat-metadata-session-projection-CbibKRj9.mjs";
import { t as buildModelsListResult } from "./models-list-result-9dU4U0fs.mjs";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateModelsListParams, "models.list", respond)) return;
	let scope;
	try {
		const scoped = Boolean(params.sessionKey || params.authProfileId);
		scope = scoped ? resolveChatMetadataReadParams(options, params) : void 0;
		if (scoped && !scope) return;
		const cfg = context.getRuntimeConfig();
		const resolved = scope ?? resolveAgentIdOrRespondError({
			rawAgentId: params.agentId ?? tryResolveAmbientOwnerAgentId(cfg),
			respond,
			cfg,
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		const result = await buildModelsListResult({
			source: {
				kind: "gateway",
				context
			},
			agentId: resolved.agentId,
			params,
			includeManualSelection: hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.MODEL_SELECTION_POLICY),
			requesterProfileId: scope?.requesterProfileId ?? resolveAuthenticatedProfileId(client),
			...scope ? { readScope: scope } : {}
		});
		scope?.draftAccountSelection?.assertCurrent();
		scope?.assertCurrent?.();
		respond(true, scope && params.view !== "provider-config" ? {
			...result,
			models: projectSessionModelCatalog(scope, result.models, context.getRuntimeConfig())
		} : result, void 0);
	} catch (error) {
		if (error instanceof PreparedModelRuntimePublicationSupersededError) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
				retryable: true,
				retryAfterMs: 0
			}));
			return;
		}
		if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
	} finally {
		scope?.release?.();
	}
} };
//#endregion
export { modelsHandlers };
