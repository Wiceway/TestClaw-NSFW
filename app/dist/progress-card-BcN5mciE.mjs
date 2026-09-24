import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { gr as validateProgressCardRefreshParams, hr as validateProgressCardPutParams, mr as validateProgressCardGetParams } from "./src-BNV0SJoP.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { f as runAssistantAgentWriteTransaction, m as withAssistantAgentDatabaseAsync } from "./testclaw-agent-db-DAdiee0a.mjs";
import { r as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-D_VtLORb.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-TFRevCb_.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { a as prepareSqliteTargetFromSessionStorePath, c as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CBM31t7c.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-CmhrS9-1.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-GnE6aqPA.mjs";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-Dvzu7WpB.mjs";
import { n as readSessionProgressCard, r as writeSessionProgressCard } from "./progress-card-store-Bdejf1qL.mjs";
import { r as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-HPHp5jil.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
import { n as captureGatewaySessionStoreScope, r as resolveGatewaySessionDatabase } from "./board-store-BBWttLR-.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-XuqiMPWH.mjs";
//#region src/gateway/progress-card-store.ts
const progressCardStore = {
	async get(sessionKey, agentId) {
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		const scope = captureGatewaySessionStoreScope(sessionKey, agentId);
		const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(scope.storePath);
		if (isIncognitoAssistantAgentSqlitePath(unsuffixed.path, {
			agentId: scope.agentId,
			env
		})) {
			const result = withAssistantAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, scope.sessionKey), {
				agentId: scope.agentId,
				path: unsuffixed.path,
				env
			});
			return result.found ? result.value : null;
		}
		const target = await prepareSqliteTargetFromSessionStorePath(scope.storePath, {
			agentId: scope.agentId,
			env
		});
		return await withSessionHistoryWorkerDatabase({
			agentId: target.agentId ?? scope.agentId,
			path: target.path,
			env
		}, (owner) => owner.readProgressCard({
			sessionKey: scope.sessionKey,
			env
		}));
	},
	async put(sessionKey, input, agentId) {
		const resolved = resolveGatewaySessionDatabase(sessionKey, agentId);
		const env = { ...process.env };
		env.TESTCLAW_STATE_DIR = resolveStateDir(env);
		const databaseOptions = {
			...resolved,
			env,
			path: resolveAssistantAgentSqlitePath({
				...resolved,
				env
			})
		};
		const assertCurrent = () => {
			input.assertCurrent?.();
			const current = resolveGatewaySessionDatabase(sessionKey, agentId);
			if (current.agentId !== resolved.agentId || current.path !== resolved.path || current.sessionKey !== resolved.sessionKey) throw new Error("progress-card session changed; retry");
		};
		assertCurrent();
		const result = await runAssistantAgentWriteAdmission(databaseOptions, () => withAssistantAgentDatabaseAsync(databaseOptions, () => runAssistantAgentWriteTransaction((database) => {
			assertCurrent();
			return writeSessionProgressCard(database.db, resolved.sessionKey, input);
		}, databaseOptions, { operationLabel: "progress-card.put" }), assertCurrent), true);
		return "card" in result ? result : { card: null };
	}
};
//#endregion
//#region src/gateway/server-methods/progress-card.ts
function resolveProgressCardSession(params, context, respond) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) {
		respond(false, void 0, requested.error);
		return;
	}
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey: params.sessionKey,
		storeAgentId: requested.agentId
	});
	return {
		sessionKey: canonicalKey,
		agentId: requested.agentId,
		scopeKey: sessionObserverScopeKey(canonicalKey, requested.agentId)
	};
}
function projectProgressCard(card, scopeKey) {
	return card ? {
		...card,
		sessionKey: scopeKey
	} : null;
}
function createProgressCardHandlers(store = progressCardStore) {
	return {
		"progressCard.refresh": async (invocation) => {
			const { params, respond, context, sessionMutationAuthorization } = invocation;
			if (!assertValidParams(params, validateProgressCardRefreshParams, "progressCard.refresh", respond)) return;
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			const readCard = async () => {
				sessionMutationAuthorization?.assertCurrent();
				const card = await store.get(session.sessionKey, session.agentId);
				sessionMutationAuthorization?.assertCurrent();
				return card;
			};
			const card = await readCard();
			if (!card) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "There is no progress card to refresh."));
				return;
			}
			const { requestProgressCardRefresh } = await import("./progress-card-refresh-BE3HexDg.mjs");
			invocation.sessionMutationCommitGuard?.();
			sessionMutationAuthorization?.assertCurrent();
			await requestProgressCardRefresh(invocation, session, card, params.idempotencyKey, readCard);
		},
		"progressCard.get": async ({ params, respond, context, sessionMutationAuthorization }) => {
			if (!assertValidParams(params, validateProgressCardGetParams, "progressCard.get", respond)) return;
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			sessionMutationAuthorization?.assertCurrent();
			try {
				const card = await store.get(session.sessionKey, session.agentId);
				sessionMutationAuthorization?.assertCurrent();
				respond(true, { card: projectProgressCard(card, session.scopeKey) }, void 0);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"progressCard.put": async (invocation) => {
			const { params, respond, context, sessionMutationAuthorization } = invocation;
			if (!assertValidParams(params, validateProgressCardPutParams, "progressCard.put", respond)) return;
			let input;
			try {
				input = normalizeProgressCardInput({
					markdown: params.markdown,
					plan: params.plan
				});
			} catch (error) {
				if (!(error instanceof ProgressCardInputError)) throw error;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			if (params.expectedRevision !== void 0 && (input.markdown || input.steps?.length)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "expectedRevision is only valid when clearing a card"));
				return;
			}
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			sessionMutationAuthorization?.assertCurrent();
			const assertCurrent = () => {
				invocation.signal?.throwIfAborted();
				invocation.sessionMutationCommitGuard?.();
				sessionMutationAuthorization?.assertCurrent();
			};
			try {
				const result = await store.put(session.sessionKey, {
					...input,
					expectedRevision: params.expectedRevision,
					assertCurrent
				}, session.agentId);
				assertCurrent();
				if (params.expectedRevision === void 0 || result.card === null) context.broadcast("progressCard.changed", {
					sessionKey: session.scopeKey,
					revision: result.card?.revision ?? null
				}, {
					sessionKeys: [session.sessionKey],
					agentId: session.agentId
				});
				respond(true, { card: projectProgressCard(result.card, session.scopeKey) }, void 0);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		}
	};
}
const progressCardHandlers = createProgressCardHandlers();
//#endregion
export { progressCardHandlers };
