import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { r as publishUserProfilesChange } from "./user-profile-list-CfxnGEeA.js";
import { M as publishUserProfileAuthorityChange, _ as userProfilesDb, c as requireResolvedUserProfileMetadataById, i as insertUserProfile, m as toUserProfile, p as setUserProfileEmailBinding } from "./user-profiles-internal-CUEKVOsi.js";
//#region src/state/user-profile-email.kernel.ts
function normalizeProfileEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
/** The caller owns the transaction; alias uniqueness and creation settle together. */
function ensureProfileForEmailInDatabase(db, email, initialDisplayName, now, mutation) {
	const kysely = userProfilesDb(db);
	const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", email));
	if (existingAlias) return toUserProfile(requireResolvedUserProfileMetadataById(db, existingAlias.profile_id));
	const displayName = initialDisplayName ?? truncateUtf16Safe(email.split("@", 1)[0] || email, 256);
	const row = insertUserProfile(db, displayName, now, mutation);
	setUserProfileEmailBinding(db, email, row.id, now);
	mutation?.authority(row.id);
	publishUserProfileAuthorityChange(db, row.id);
	mutation?.publish(row.id);
	publishUserProfilesChange(db, row.id);
	return toUserProfile(row);
}
//#endregion
export { normalizeProfileEmail as n, ensureProfileForEmailInDatabase as t };
