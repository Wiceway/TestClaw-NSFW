import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as getActiveAssistantStateDatabaseReadSnapshot, t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import { A as emitUserProfilesChanged, F as publishUserProfileAliasChange, S as UserProfileOwnerError, j as fenceUserProfileMutationAuthority, k as captureUserProfileAuthorityRead, x as UserProfileNotFoundError } from "./user-profiles-internal-BfnkNaNn.mjs";
import { a as userChannelIdentitySubject, t as UserChannelIdentityConflictError } from "./user-channel-identities-0WnmwY41.mjs";
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
export { prepareUserProfileSelectionAuthority as a, prepareUserProfileRoleAuthority as i, listCanonicalUserChannelIdentities as n, prepareUserChannelIdentityAuthority as r, changeCanonicalUserChannelIdentity as t };
