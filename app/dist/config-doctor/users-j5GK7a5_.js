import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Ao as validateUsersAuthConnectStatusParams, Bo as validateUsersListChannelIdentitiesParams, Do as validateUsersAuthConnectCancelParams, Eo as validateUsersAuthConnectAnswerParams, Fo as validateUsersGitHubStatusParams, Go as validateUsersPrefsSetParams, Ho as validateUsersListParams, Io as validateUsersLinkAuthProfileParams, Jo as validateUsersSetAvatarParams, Ko as validateUsersSelectModelAccountParams, Lo as validateUsersLinkChannelIdentityParams, Mo as validateUsersGitHubAuthorizePollParams, No as validateUsersGitHubAuthorizeStartParams, Oo as validateUsersAuthConnectCatalogParams, Po as validateUsersGitHubDisconnectParams, Qo as validateUsersUnlinkChannelIdentityParams, Ro as validateUsersLinkEmailParams, Vo as validateUsersListModelAccountsParams, Wo as validateUsersPrefsGetParams, Xo as validateUsersSetRoleParams, Yo as validateUsersSetDisplayNameParams, Zo as validateUsersUnlinkAuthProfileParams, jo as validateUsersGitHubAuthorizeCancelParams, ko as validateUsersAuthConnectStartParams, qo as validateUsersSelfParams, zo as validateUsersListAuthLinksParams } from "./validator-registry-Dpl5QmuY.js";
import { t as getUserProfileDisplay } from "./user-profile-list-CfxnGEeA.js";
import { v as UserProfileNotFoundError, y as UserProfileOwnerError } from "./user-profiles-internal-CUEKVOsi.js";
import { a as setAvatar, c as listProfiles, n as getUserProfileListItem, o as setDisplayName } from "./user-profiles-oLBI9gsy.js";
import { n as listCanonicalUserChannelIdentities, o as UserChannelIdentityConflictError, t as changeCanonicalUserChannelIdentity } from "./user-channel-identity-operations-_TkW3mpq.js";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-3FPGpNUN.js";
import { i as invalidateOperatorRolePolicy } from "./operator-role-policy-gPgbkoHA.js";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-kVVlCuV_.js";
import { C as authenticatedProfileUnavailableError, D as isGatewayClientProfilePending } from "./session-sharing-policy-rVme8bnl.js";
import { v as resolveSystemGitHubIdentityStatus } from "./github-tool-identity-Cf0A2owp.js";
import { a as setCanonicalUserProfileRole, i as linkCanonicalUserProfileEmail } from "./user-profile-writes-D-scdUZS.js";
import { n as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-BZLpfukT.js";
import { r as setCanonicalUserPreferences, t as getCanonicalUserPreferences } from "./user-preferences-Dh-ozXlt.js";
import { n as ModelAccountConnectInputError, t as ModelAccountConnectAuthorityError } from "./model-account-connect-V7Ls9OGi.js";
import { n as requireProfileMutationAccess, r as resolveAuthenticatedProfileId, t as prepareUserProfileAdministration } from "./users-profile-access-BE2IBRDA.js";
import { i as prepareUserModelAccountAction } from "./users-model-account-access-C8BOE9Co.js";
import { n as preparePersonalGitHubAction } from "./github-personal-authorization-DV4x5FIr.js";
import { t as publishUserPreferencesChanged } from "./user-preference-events-GTfzshI_.js";
import { t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-QHozGwry.js";
//#region src/gateway/server-methods/users-auth-connect.ts
function runConnectRequest(options, profileId, run, requiredScope = "operator.write") {
	const fail = (error) => {
		const responseError = error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof ModelAccountConnectInputError || error instanceof UserProfileNotFoundError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message) : errorShape(ErrorCodes.UNAVAILABLE, "Model account connect is unavailable right now; try again shortly.");
		options.respond(false, void 0, responseError);
	};
	try {
		const action = prepareUserModelAccountAction(options, profileId, requiredScope);
		const service = options.context.modelAccountConnectService;
		if (!service) throw new Error("Model-account service is not running.");
		const result = run(service, action);
		if (result instanceof Promise) return result.then((value) => options.respond(true, value)).catch(fail);
		options.respond(true, result);
	} catch (error) {
		fail(error);
	}
}
const usersAuthConnectHandlers = {
	"users.listAuthLinks": defineValidatedGatewayMethod("users.listAuthLinks", validateUsersListAuthLinksParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.listLinks(action), "operator.read")),
	"users.linkAuthProfile": defineValidatedGatewayMethod("users.linkAuthProfile", validateUsersLinkAuthProfileParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.link(action, options.params.authProfileId), "operator.admin")),
	"users.unlinkAuthProfile": defineValidatedGatewayMethod("users.unlinkAuthProfile", validateUsersUnlinkAuthProfileParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.unlink(action, options.params.provider))),
	"users.listModelAccounts": defineValidatedGatewayMethod("users.listModelAccounts", validateUsersListModelAccountsParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.list(action, options.params.cursor), "operator.read")),
	"users.selectModelAccount": defineValidatedGatewayMethod("users.selectModelAccount", validateUsersSelectModelAccountParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.select(action, options.params.authProfileId))),
	"users.authConnect.start": defineValidatedGatewayMethod("users.authConnect.start", validateUsersAuthConnectStartParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.start(action, options.params.provider, options.params.method))),
	"users.authConnect.answer": defineValidatedGatewayMethod("users.authConnect.answer", validateUsersAuthConnectAnswerParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.answer(action, options.params.connectId, options.params.stepId, options.params.value))),
	"users.authConnect.status": defineValidatedGatewayMethod("users.authConnect.status", validateUsersAuthConnectStatusParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.status(action, options.params.connectId))),
	"users.authConnect.cancel": defineValidatedGatewayMethod("users.authConnect.cancel", validateUsersAuthConnectCancelParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.cancel(action, options.params.connectId))),
	"users.authConnect.catalog": defineValidatedGatewayMethod("users.authConnect.catalog", validateUsersAuthConnectCatalogParams, (options) => runConnectRequest(options, options.params.profileId, (service, action) => service.catalog(action)))
};
//#endregion
//#region src/gateway/server-methods/users-channel-identities.ts
function identityError(error) {
	return errorShape(error instanceof UserChannelIdentityConflictError || error instanceof UserProfileNotFoundError || error instanceof UserProfileOwnerError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
const usersChannelIdentityHandlers = {
	"users.linkChannelIdentity": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateUsersLinkChannelIdentityParams, "users.linkChannelIdentity", respond)) return;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			const result = await changeCanonicalUserChannelIdentity("link", params.profileId, params.identity, { assertCurrent });
			if (result.kind !== "linked") throw new Error("Channel identity mutation returned an unexpected result");
			respond(true, result.link);
		} catch (error) {
			respond(false, void 0, identityError(error));
		}
	},
	"users.unlinkChannelIdentity": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateUsersUnlinkChannelIdentityParams, "users.unlinkChannelIdentity", respond)) return;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			const result = await changeCanonicalUserChannelIdentity("unlink", params.profileId, params.identity, { assertCurrent });
			if (result.kind !== "unlinked") throw new Error("Channel identity mutation returned an unexpected result");
			respond(true, { removed: result.removed });
		} catch (error) {
			respond(false, void 0, identityError(error));
		}
	},
	"users.listChannelIdentities": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateUsersListChannelIdentitiesParams, "users.listChannelIdentities", respond)) return;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			const links = await listCanonicalUserChannelIdentities(params.profileId);
			assertCurrent();
			respond(true, { links });
		} catch (error) {
			respond(false, void 0, identityError(error));
		}
	}
};
//#endregion
//#region src/gateway/server-methods/users-github.ts
function runPersonalGitHub(options, fallbackError, run) {
	const fail = (error) => options.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error instanceof Error ? error.message : fallbackError));
	try {
		const action = preparePersonalGitHubAction(options);
		const service = options.context.githubOAuthService?.personal;
		if (!service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const result = run(action, service);
		if (result instanceof Promise) return result.then((value) => {
			action.assertCurrent();
			options.respond(true, value);
		}).catch(fail);
		options.respond(true, result);
	} catch (error) {
		fail(error);
	}
}
const usersGitHubHandlers = {
	"users.github.status": defineValidatedGatewayMethod("users.github.status", validateUsersGitHubStatusParams, (options) => runPersonalGitHub(options, "My GitHub is unavailable.", async (action, service) => {
		const config = options.context.getRuntimeConfig();
		const system = await resolveSystemGitHubIdentityStatus({
			config,
			sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? config
		});
		return {
			personal: await service.status(action),
			system
		};
	})),
	"users.github.authorize.start": defineValidatedGatewayMethod("users.github.authorize.start", validateUsersGitHubAuthorizeStartParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => service.startAuthorization(action))),
	"users.github.authorize.poll": defineValidatedGatewayMethod("users.github.authorize.poll", validateUsersGitHubAuthorizePollParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => service.pollAuthorization(action, options.params.requestId))),
	"users.github.authorize.cancel": defineValidatedGatewayMethod("users.github.authorize.cancel", validateUsersGitHubAuthorizeCancelParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => ({ cancelled: service.cancelAuthorization(action, options.params.requestId) }))),
	"users.github.disconnect": defineValidatedGatewayMethod("users.github.disconnect", validateUsersGitHubDisconnectParams, (options) => runPersonalGitHub(options, "My GitHub disconnect failed.", (action, service) => {
		service.disconnect(action);
		return { disconnected: true };
	}))
};
//#endregion
//#region src/gateway/server-methods/users.ts
function refreshConnectedProfile(context, profile, display = getUserProfileDisplay(profile.id)) {
	context.refreshConnectedUserProfile?.({
		...display,
		updatedAt: profile.updatedAt
	});
	return display;
}
function decodeBase64(value) {
	const trimmed = value.trim();
	if (!trimmed || trimmed.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(trimmed)) return;
	return Buffer.from(trimmed, "base64");
}
function profileError(error) {
	if (error instanceof UserProfileNotFoundError || error instanceof UserProfileOwnerError) return errorShape(ErrorCodes.INVALID_REQUEST, error.message);
	return errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
const usersHandlers = {
	...usersAuthConnectHandlers,
	...usersChannelIdentityHandlers,
	...usersGitHubHandlers,
	"users.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateUsersListParams, "users.list", respond)) return;
		respond(true, { profiles: await listProfiles() });
	},
	"users.self": async ({ client, params, respond }) => {
		if (!assertValidParams(params, validateUsersSelfParams, "users.self", respond)) return;
		if (!client?.authenticatedUserId && !client?.authenticatedUserProfile) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "users.self requires an authenticated user"));
			return;
		}
		try {
			if (client.authenticatedGitHubIdentitySync) try {
				await client.authenticatedGitHubIdentitySync();
			} catch {}
			const profileId = resolveAuthenticatedProfileId(client);
			if (!profileId) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { profile: getUserProfileListItem(profileId) });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.get": async ({ client, params, respond }) => {
		if (!assertValidParams(params, validateUsersPrefsGetParams, "users.prefs.get", respond)) return;
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const preferences = await getCanonicalUserPreferences(profileId, params.keys);
			if (!preferences) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, {
				status: "ok",
				entries: preferences.entries
			}, void 0);
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.set": async ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateUsersPrefsSetParams, "users.prefs.set", respond)) return;
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const result = await setCanonicalUserPreferences(profileId, params.entries, { expectedEntries: params.expectedEntries });
			if (!result) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			if (!result.ok) {
				if (result.error.code === "conflict") {
					respond(true, { status: "conflict" }, void 0);
					return;
				}
				if (result.error.code === "profile-key-limit") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `users.prefs.set exceeds the ${result.error.limit}-key profile limit (current count: ${result.error.currentCount})`, { details: {
						code: GatewayErrorDetailCodes.USER_PREFS_LIMIT_EXCEEDED,
						limit: result.error.limit,
						currentCount: result.error.currentCount
					} }));
					return;
				}
				const key = "key" in result.error ? ` for ${result.error.key}` : "";
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid users.prefs.set entry${key}: ${result.error.code}`));
				return;
			}
			respond(true, { status: "ok" }, void 0);
			publishUserPreferencesChanged(context, result.value.profileId, Object.keys(params.entries));
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.linkEmail": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersLinkEmailParams, "users.linkEmail", respond)) return;
		const email = params.email.trim();
		if (!email) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "email must not be empty"));
			return;
		}
		const targetProfileId = params.targetProfileId;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			const { profile, display } = await linkCanonicalUserProfileEmail(email, targetProfileId, { assertCurrent });
			refreshConnectedProfile(context, profile, display);
			broadcastChatMetadataChanged(context);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setDisplayName": ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateUsersSetDisplayNameParams, "users.setDisplayName", respond)) return;
		try {
			if (!requireProfileMutationAccess(client, params.profileId, respond)) return;
			const profile = setDisplayName(params.profileId, params.displayName);
			refreshConnectedProfile(context, profile);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setRole": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersSetRoleParams, "users.setRole", respond)) return;
		const { profileId, role } = params;
		const isConfiguredRole = () => {
			const definitions = context.getRuntimeConfig().gateway?.roles?.definitions;
			return role === null || definitions !== void 0 && Object.hasOwn(definitions, role);
		};
		const unknownRoleMessage = `unknown operator role "${role}"; define it under gateway.roles.definitions before assigning it`;
		if (!isConfiguredRole()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, unknownRoleMessage));
			return;
		}
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			holdGatewayPolicyResponse(respond);
			respond(true, { profile: await setCanonicalUserProfileRole(profileId, role, {
				assertCurrent: () => {
					assertCurrent();
					if (!isConfiguredRole()) throw new Error(unknownRoleMessage);
				},
				onCommitted: (canonicalProfileId) => {
					invalidateOperatorRolePolicy(canonicalProfileId);
					context.disconnectClientsForUserProfile?.(canonicalProfileId);
				}
			}) });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setAvatar": ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateUsersSetAvatarParams, "users.setAvatar", respond)) return;
		const bytes = decodeBase64(params.avatarBase64);
		if (!bytes) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "avatarBase64 must be base64"));
			return;
		}
		try {
			if (!requireProfileMutationAccess(client, params.profileId, respond)) return;
			const result = setAvatar(params.profileId, bytes, params.mime);
			if (!result.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.error.code));
				return;
			}
			const display = refreshConnectedProfile(context, result.value);
			respond(true, {
				profile: result.value,
				avatarRevision: display.avatarRevision
			});
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	}
};
//#endregion
export { usersHandlers };
