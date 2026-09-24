import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Hi as validateSessionsTitlePrepareParams } from "./validator-registry-Dpl5QmuY.js";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-gPgbkoHA.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-V7Ls9OGi.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-Dsqtwjpe.js";
import { n as preparePersonalModelSelection } from "./users-model-account-access-C8BOE9Co.js";
import { o as prepareDashboardSessionTitle } from "./dashboard-session-title-Bq6mnT9F.js";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-q5ZCR7V4.js";
import { i as resolveSessionCreateModelSelection } from "./session-create-service-gg_MkWFR.js";
//#region src/gateway/server-methods/sessions-title.ts
const sessionTitleHandlers = { "sessions.title.prepare": async ({ params, respond, context, client, signal }) => {
	if (!assertValidParams(params, validateSessionsTitlePrepareParams, "sessions.title.prepare", respond)) return;
	const cfg = context.getRuntimeConfig();
	const agent = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg,
		normalize: normalizeOptionalString
	});
	if (!agent) return;
	const creationError = authorizeGatewaySessionCreation({
		cfg,
		client,
		agentId: agent.agentId
	});
	if (creationError) {
		respond(false, void 0, creationError);
		return;
	}
	if (params.model && params.catalogId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.title.prepare catalogId cannot include model"));
		return;
	}
	if (params.incognito || !params.message.trim() || params.message.trim().startsWith("/")) {
		respond(true, { title: null });
		return;
	}
	const catalog = params.catalogId ? resolveRegisteredCatalogCreateTarget(params.catalogId, agent.agentId, cfg) : void 0;
	if (catalog && !catalog.ok) {
		respond(true, { title: null });
		return;
	}
	try {
		const personalSelection = preparePersonalModelSelection({
			client,
			context,
			signal
		}, params.model);
		const assertCurrent = () => {
			personalSelection?.assertCurrent();
			const currentCreationError = authorizeGatewaySessionCreation({
				cfg: context.getRuntimeConfig(),
				client,
				agentId: agent.agentId
			});
			if (currentCreationError) throw new SessionMutationAuthorizationChangedError(currentCreationError);
		};
		const entry = resolveSessionCreateModelSelection(cfg, agent.agentId, catalog?.target ?? params.model);
		if (!entry) {
			respond(true, { title: null });
			return;
		}
		const title = await prepareDashboardSessionTitle({
			cfg,
			agentId: agent.agentId,
			entry,
			userMessage: params.message,
			abortSignal: signal,
			assertCurrent
		});
		assertCurrent();
		respond(true, { title });
	} catch (error) {
		const failure = error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof SessionMutationAuthorizationChangedError ? error.error : void 0;
		if (!failure) throw error;
		respond(false, void 0, failure);
	}
} };
//#endregion
export { sessionTitleHandlers };
