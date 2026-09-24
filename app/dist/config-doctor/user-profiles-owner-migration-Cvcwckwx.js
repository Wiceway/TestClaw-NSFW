import { n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.js";
import { r as publishUserProfilesChange } from "./user-profile-list-CfxnGEeA.js";
import { M as publishUserProfileAuthorityChange, N as publishUserProfileIdentityChange, _ as userProfilesDb, f as selectResolvedUserProfileMetadataById, j as publishUserProfileAliasChange } from "./user-profiles-internal-CUEKVOsi.js";
import { t as readGatewayOwnerProfileRows } from "./user-profiles-owner-CZrEU2Tw.js";
//#region src/state/user-profiles-owner-migration.ts
function ownerRepairRequired(db) {
	if (!tableExists(db, "user_profiles") || !tableExists(db, "user_profile_identities")) return false;
	const { owner, identified } = readGatewayOwnerProfileRows(db);
	return Boolean(owner?.merged_into || identified?.merged_into || owner && identified?.id !== owner.id);
}
function repairMergedGatewayOwnerProfile(options) {
	const unchanged = {
		repaired: false,
		changes: [],
		warnings: []
	};
	if (!withExistingAssistantStateDatabaseReadOnly(({ db }) => ownerRepairRequired(db), options)) return unchanged;
	if (!options.shouldRepair) return {
		...unchanged,
		warnings: ["The shared gateway owner profile requires repair. Run testclaw doctor --fix, then reconnect."]
	};
	return runAssistantStateWriteTransaction(({ db }) => {
		if (!ownerRepairRequired(db)) return unchanged;
		const { owner } = readGatewayOwnerProfileRows(db);
		const previousOwnerHead = owner?.merged_into ? selectResolvedUserProfileMetadataById(db, owner.id)?.id : void 0;
		const kysely = userProfilesDb(db);
		const now = Date.now();
		if (owner) {
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: null,
				updated_at: now
			}).where("id", "=", GATEWAY_OWNER_PROFILE_ID));
			if (owner.merged_into) {
				publishUserProfileIdentityChange(db, GATEWAY_OWNER_PROFILE_ID);
				publishUserProfileAuthorityChange(db, GATEWAY_OWNER_PROFILE_ID, owner.merged_into, ...previousOwnerHead ? [previousOwnerHead] : []);
				deferSqlitePostCommitPublication(db, publishUserProfileAliasChange);
			}
		} else executeSqliteQuerySync(db, kysely.insertInto("user_profiles").values({
			id: GATEWAY_OWNER_PROFILE_ID,
			display_name: null,
			avatar: null,
			avatar_mime: null,
			avatar_sha256: null,
			merged_into: null,
			created_at: now,
			updated_at: now
		}));
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: "gateway.local",
			subject: "owner",
			profile_id: GATEWAY_OWNER_PROFILE_ID,
			canonical_login: null,
			created_at: now
		}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doUpdateSet({ profile_id: GATEWAY_OWNER_PROFILE_ID })));
		publishUserProfilesChange(db, GATEWAY_OWNER_PROFILE_ID);
		return {
			repaired: true,
			changes: ["Restored gateway-owner as the shared owner and repaired its local identity; personal emails, roles, and GitHub identities remain with the person."],
			warnings: []
		};
	}, options, { operationLabel: "user-profiles.repair-merged-owner" });
}
//#endregion
export { repairMergedGatewayOwnerProfile as t };
