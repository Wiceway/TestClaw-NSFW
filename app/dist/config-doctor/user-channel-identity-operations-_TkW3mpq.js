import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import "./sqlite-post-commit-Cresg45I.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as getActiveAssistantStateDatabaseReadSnapshot, t as executeExistingAssistantStateRead, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import "./testclaw-state-db-BAeysXj_.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import "./user-profile-constants-DfyZS95p.js";
import { i as UserChannelIdentitySchema } from "./users-CCWv9A_K.js";
import { h as selectStoredGitHubIdentities } from "./user-profile-list-CfxnGEeA.js";
import { D as emitUserProfilesChanged, E as captureUserProfileAuthorityRead, O as fenceUserProfileMutationAuthority, _ as userProfilesDb, f as selectResolvedUserProfileMetadataById, j as publishUserProfileAliasChange, v as UserProfileNotFoundError, y as UserProfileOwnerError } from "./user-profiles-internal-CUEKVOsi.js";
import { Check } from "typebox/value";
//#region src/state/user-profiles-tailscale-login.ts
/** Classify Tailscale's documented email or email-ish LoginName representation. */
function classifyTailscaleLogin(login) {
	const normalized = login.trim();
	const separator = normalized.lastIndexOf("@");
	if (separator <= 0 || separator === normalized.length - 1) return { kind: "invalid" };
	const subject = normalized.slice(0, separator);
	const suffix = normalized.slice(separator + 1);
	return suffix.includes(".") ? {
		kind: "email",
		email: normalized
	} : {
		kind: "provider",
		provider: suffix.toLowerCase(),
		subject: subject.toLowerCase()
	};
}
//#endregion
//#region src/state/user-channel-identities.ts
const CHANNEL_IDENTITY_PROVIDER = "channel.identity";
var UserChannelIdentityConflictError = class extends Error {
	constructor() {
		super("channel identity is linked to another profile; unlink it from that profile first");
		this.name = "UserChannelIdentityConflictError";
	}
};
function userChannelIdentitySubject(identity) {
	if (!Check(UserChannelIdentitySchema, identity)) throw new TypeError("invalid channel identity");
	return JSON.stringify([
		identity.channelId,
		identity.accountId,
		identity.senderId
	]);
}
function selectLink(db, subject) {
	return executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_identities").select("profile_id").where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("subject", "=", subject));
}
function hasIdentityTables(db) {
	return tableExists(db, "user_profiles") && tableExists(db, "user_profile_identities");
}
/** Reads the current person and login grant subjects; channel links never become login aliases. */
function resolveUserChannelIdentityInDatabase(db, identity) {
	const subject = userChannelIdentitySubject(identity);
	return runSqliteDeferredTransactionSync(db, () => {
		if (!hasIdentityTables(db)) return;
		const link = selectLink(db, subject);
		const profile = link ? selectResolvedUserProfileMetadataById(db, link.profile_id) : void 0;
		if (!profile || profile.id === "gateway-owner") return;
		const kysely = userProfilesDb(db);
		const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profile.id).orderBy("email", "asc")).rows.map(({ email }) => email);
		const loginEmails = emails.filter((email) => {
			const login = classifyTailscaleLogin(email);
			return login.kind !== "provider" || login.provider !== "github";
		});
		const providerLogins = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_identities").select(["provider", "subject"]).where("profile_id", "=", profile.id).where("canonical_login", "is", null)).rows.filter((row) => row.provider !== "github" && row.provider !== "github-attribution" && !row.provider.includes(".")).map((row) => `${row.subject}@${row.provider}`);
		const githubLogins = selectStoredGitHubIdentities(db, [profile.id]).get(profile.id)?.accounts.map((account) => `${account.login.toLowerCase()}@github`) ?? [];
		return {
			profileId: profile.id,
			role: profile.role ?? null,
			emails,
			loginIdentities: [.../* @__PURE__ */ new Set([
				...loginEmails,
				...providerLogins,
				...githubLogins
			])].toSorted()
		};
	});
}
function resolveUserChannelIdentity(identity, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => resolveUserChannelIdentityInDatabase(db, identity), options);
}
//#endregion
//#region src/state/user-channel-identity-operations.ts
function captureAuthorityContext(options) {
	if (getActiveAssistantStateDatabaseReadSnapshot(options)) throw new Error("Profile authority requires live state, not a discovery snapshot");
	return captureAssistantStateWorkerContext(options);
}
function unwrapIdentityResult(result, profileId) {
	if (result.ok) return result.value;
	switch (result.kind) {
		case "conflict": throw new UserChannelIdentityConflictError();
		case "not-found": throw new UserProfileNotFoundError(profileId);
		case "owner": throw new UserProfileOwnerError(result.code);
	}
	throw new Error("Unsupported channel identity result");
}
async function listCanonicalUserChannelIdentities(profileId, options = {}) {
	const reply = await executeExistingAssistantStateRead(options, {
		type: "userProfiles.channelIdentity.list",
		profileId
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "userProfiles.channelIdentity.list") throw new Error("Channel identity reader returned an unexpected result");
	return unwrapIdentityResult(reply.result, profileId);
}
async function changeCanonicalUserChannelIdentity(action, profileId, identity, options = {}) {
	const capturedIdentity = { ...identity };
	const subject = userChannelIdentitySubject(capturedIdentity);
	const assertCurrent = options.assertCurrent;
	const context = captureAssistantStateWorkerContext(options);
	return unwrapIdentityResult(await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "userProfiles.channelIdentity.change",
		input: {
			action,
			profileId,
			identity: capturedIdentity
		}
	}), {
		assertCurrent,
		createAdmission: (operation) => {
			let fence;
			const admission = createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit" || !isRecord(request.facts) || request.facts.kind !== "channel-identity" || request.facts.subject !== subject) throw new Error("Channel identity mutation requires exact transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				if (request.stage === "commit") fence ??= fenceUserProfileMutationAuthority(context.admission, {
					profiles: [],
					identities: [],
					channels: [subject]
				});
				grant();
			});
			operation.settled.then((settlement) => {
				const committed = admission.committed;
				if (committed && isRecord(committed.facts) && committed.facts.kind === "channel-identity" && committed.facts.subject === subject) {
					publishUserProfileAliasChange();
					emitUserProfilesChanged();
				}
				fence?.settle(settlement.kind !== "unknown");
			});
			return {
				admission,
				nativeLocations: [context.admission.databasePath]
			};
		}
	}), profileId);
}
/** Qualify worker-read facts against the same physical profile owner's mutation lifetime. */
async function prepareUserChannelIdentityAuthority(identity, options = {}) {
	const capturedIdentity = { ...identity };
	const subject = userChannelIdentitySubject(capturedIdentity);
	const context = captureAuthorityContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const read = await captureUserProfileAuthorityRead(context.admission, subject);
		const reply = await executeExistingAssistantStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.channelIdentity.resolve",
			identity: capturedIdentity
		});
		context.admission.assertCurrent();
		if (!reply) return;
		if (!reply.ok || reply.type !== "userProfiles.channelIdentity.resolve") throw new Error("Channel authority reader returned an unexpected result");
		if (!reply.linked) return;
		const isCurrent = read.bind(reply.linked.profileId);
		if (isCurrent) return {
			linked: reply.linked,
			isCurrent
		};
	}
	throw new Error("Profile authority changed while preparing the channel request");
}
async function prepareUserProfileRoleAuthority(profileId, options = {}) {
	return prepareUserProfileAuthority(profileId, options, "authority");
}
async function prepareUserProfileSelectionAuthority(profileId, options = {}) {
	const prepared = await prepareUserProfileAuthority(profileId, options, "identity");
	return prepared && {
		profileId: prepared.profileId,
		isCurrent: prepared.isCurrent
	};
}
async function prepareUserProfileAuthority(profileId, options, dependency) {
	const context = captureAuthorityContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const read = await captureUserProfileAuthorityRead(context.admission, void 0, dependency);
		const reply = await executeExistingAssistantStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.authority.resolve",
			profileId
		});
		context.admission.assertCurrent();
		if (!reply) return;
		if (!reply.ok || reply.type !== "userProfiles.authority.resolve") throw new Error("Profile authority reader returned an unexpected result");
		if (!reply.profile) return;
		const isCurrent = read.bind([profileId, reply.profile.profileId]);
		if (isCurrent) return {
			...reply.profile,
			isCurrent
		};
	}
	throw new Error("Profile authority changed while preparing the administrative request");
}
//#endregion
export { prepareUserProfileSelectionAuthority as a, classifyTailscaleLogin as c, prepareUserProfileRoleAuthority as i, listCanonicalUserChannelIdentities as n, UserChannelIdentityConflictError as o, prepareUserChannelIdentityAuthority as r, resolveUserChannelIdentity as s, changeCanonicalUserChannelIdentity as t };
