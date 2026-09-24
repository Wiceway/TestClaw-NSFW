import { r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.js";
import "./user-profile-list-CfxnGEeA.js";
import { _ as userProfilesDb } from "./user-profiles-internal-CUEKVOsi.js";
//#region src/state/user-profiles-owner.ts
const OWNER_PROVIDER = "gateway.local";
const OWNER_SUBJECT = "owner";
/** Read raw rows: the shared owner must never inherit a person through a merge. */
function readGatewayOwnerProfileRows(db) {
	const kysely = userProfilesDb(db);
	return {
		owner: executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").selectAll().where("id", "=", GATEWAY_OWNER_PROFILE_ID)),
		identified: executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").innerJoin("user_profile_identities", "user_profile_identities.profile_id", "user_profiles.id").selectAll("user_profiles").where("provider", "=", OWNER_PROVIDER).where("subject", "=", OWNER_SUBJECT))
	};
}
//#endregion
export { readGatewayOwnerProfileRows as t };
