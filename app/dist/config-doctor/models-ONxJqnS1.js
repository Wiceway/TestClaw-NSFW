import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-_nFH9T9d.js";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-BEuqweC1.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { fn as validateModelsListParams } from "./validator-registry-Dpl5QmuY.js";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-V7Ls9OGi.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-Dsqtwjpe.js";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-BE2IBRDA.js";
import { n as resolveChatMetadataReadParams } from "./chat-metadata-handler-mIfsXpRM.js";
import { i as projectSessionModelCatalog } from "./chat-metadata-session-projection-BNcFoik6.js";
import { t as buildModelsListResult } from "./models-list-result-CQ48jnMT.js";
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
