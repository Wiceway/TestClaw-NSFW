import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as SESSION_WRITE_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-DRJ9TkmC.mjs";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-D4lUc8aG.mjs";
import { i as getUserProfileListItem, s as resolveUserProfileId } from "./user-profiles-_UmAgioR.mjs";
import { p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BqKjnbl9.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CTsdHPbJ.mjs";
import { D as isGatewayClientProfilePending, k as isIneligiblePersonalGatewayCaller } from "./session-sharing-policy-gt4OMoUR.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-DXLmfAVp.mjs";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-B77IW0Bv.mjs";
//#region src/gateway/server-methods/users-model-account-access.ts
/** Capture human authority once; every later privileged use rechecks this exact connection. */
function prepareUserModelAccountAction(options, profileId, requiredScope = WRITE_SCOPE) {
	const { client, context } = options;
	const actor = resolveAuthenticatedProfileId(client);
	if (!actor) throw new ModelAccountConnectAuthorityError();
	const owner = getUserProfileListItem(profileId ?? actor).id;
	const assertCurrent = () => {
		if (!client?.connId || client.connect.role !== "operator" || isIneligiblePersonalGatewayCaller(client) || options.signal?.aborted || isGatewayClientProfilePending(client) || !context.getClientConnIds?.((current) => current === client).has(client.connId) || resolveUserProfileId(owner) !== owner || resolveAuthenticatedProfileId(client) !== actor) throw new ModelAccountConnectAuthorityError();
		const scope = actor === owner ? requiredScope : "operator.admin";
		const role = resolveOperatorRolePolicyForProfile(actor, context.getRuntimeConfig());
		if (![client.connect.scopes ?? [], ...role ? [role.scopes] : []].every((allowedScopes) => roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes
		}))) throw new ModelAccountConnectAuthorityError();
	};
	assertCurrent();
	return {
		owner,
		assertCurrent
	};
}
/** Preview and commit share the same self-owned selection; scope follows the requested action. */
function preparePersonalModelAccountSelection(options, authProfileId, requiredScope = "operator.write") {
	const action = prepareUserModelAccountAction(options, void 0, requiredScope);
	const assertCurrent = () => {
		action.assertCurrent();
		if (!isUserModelAuthProfileOwner({
			profileId: action.owner,
			authProfileId
		})) throw new ModelAccountConnectAuthorityError();
	};
	assertCurrent();
	return {
		owner: action.owner,
		authProfileId,
		assertCurrent
	};
}
/** New personal selections require the human owner; inherited pins need no new selection. */
function preparePersonalModelSelection(options, model) {
	const authProfileId = typeof model === "string" ? splitTrailingAuthProfile(model).profile : void 0;
	if (!authProfileId || !isUserModelAuthProfileId(authProfileId)) return;
	return preparePersonalModelAccountSelection(options, authProfileId);
}
/** Default use follows this creation's admitted scope; explicit account selection stays write-scoped. */
function prepareSessionModelAccountAccess(options, model) {
	const personalModelSelection = preparePersonalModelSelection(options, model);
	const { client } = options;
	return {
		personalModelSelection,
		personalAccountDefaults: !personalModelSelection && client?.connId && client.authenticatedUserProfile && !isIneligiblePersonalGatewayCaller(client) ? prepareUserModelAccountAction(options, void 0, readGatewayRequestMutationAuthority(options).sessionScope === "operator.sessions.write" ? SESSION_WRITE_SCOPE : WRITE_SCOPE) : void 0
	};
}
//#endregion
export { prepareUserModelAccountAction as i, preparePersonalModelSelection as n, prepareSessionModelAccountAccess as r, preparePersonalModelAccountSelection as t };
