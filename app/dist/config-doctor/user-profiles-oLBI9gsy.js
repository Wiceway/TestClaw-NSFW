import { n as ok, t as err } from "./result-BQGgYouL.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import "./sqlite-post-commit-Cresg45I.js";
import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { i as USER_PROFILE_AVATAR_MIME_TYPES, r as MAX_USER_PROFILE_AVATAR_BYTES } from "./avatar-limits-2506OuP3.js";
import { g as selectUserProfileGitHubIdentities, r as publishUserProfilesChange, u as retainUserProfilePublication } from "./user-profile-list-CfxnGEeA.js";
import { S as hasEnsuredUserProfileRoleSchema, _ as userProfilesDb, b as ensureUserProfileRoleSchema, c as requireResolvedUserProfileMetadataById, f as selectResolvedUserProfileMetadataById, h as userProfileAvatarPresence, m as toUserProfile, v as UserProfileNotFoundError, w as runUserProfileWriteTransaction, x as ensureUserProfilesSchema } from "./user-profiles-internal-CUEKVOsi.js";
import { n as normalizeProfileEmail, t as ensureProfileForEmailInDatabase } from "./user-profile-email.kernel-DX9GWr_x.js";
import "./user-github-connections-9LXJWrAz.js";
import "./user-model-accounts-CwdU8Hfw.js";
import "./user-profiles-owner-CZrEU2Tw.js";
import { createHash } from "node:crypto";
import "kysely";
//#region src/state/user-profile-reads.ts
async function resolveCanonicalCachedGitHubIdentity(params, options = {}) {
	const reply = await executeExistingAssistantStateRead(options, {
		type: "userProfiles.githubIdentity.cached",
		accountId: params.accountId,
		email: params.email
	});
	if (!reply) return;
	if (!reply.ok || reply.type !== "userProfiles.githubIdentity.cached") throw new Error("Cached GitHub identity reader returned an unexpected result");
	return reply.identity;
}
async function listProfiles(options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "userProfiles.list",
		input: void 0
	});
}
/** Candidate IDs and search labels; current recipient policy remains caller-owned. */
async function readUserProfileDirectory(limit, options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "userProfiles.directory",
		input: { limit }
	});
}
//#endregion
//#region src/state/user-profiles-avatar.types.ts
function isUserProfileAvatarAdmission(value) {
	if (!isRecord(value) || value.kind !== "profile-avatar" || !isRecord(value.before)) return false;
	const row = value.before;
	return typeof row.id === "string" && typeof row.updated_at === "number" && (row.has_avatar === 0 || row.has_avatar === 1) && [
		"display_name",
		"avatar_mime",
		"avatar_sha256",
		"merged_into"
	].every((key) => row[key] === null || typeof row[key] === "string") && (row.role === void 0 || row.role === null || typeof row.role === "string");
}
//#endregion
//#region src/state/user-profiles-tailscale-avatar.ts
const TAILSCALE_AVATAR_FETCH_TIMEOUT_MS = 5e3;
const TAILSCALE_AVATAR_MAX_REDIRECTS = 3;
function toAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.includes(value) ? value : null;
}
async function fetchTailscaleAvatar(url, options) {
	try {
		const timeoutMs = options.timeoutMs ?? TAILSCALE_AVATAR_FETCH_TIMEOUT_MS;
		const fetchImpl = options.fetchImpl;
		const [{ readRemoteMediaBuffer }, { fileTypeFromBuffer }] = await Promise.all([import("./fetch-DREhvFhE.js"), import("file-type")]);
		const loaded = await readRemoteMediaBuffer({
			url,
			fetchImpl,
			maxBytes: MAX_USER_PROFILE_AVATAR_BYTES,
			maxRedirects: TAILSCALE_AVATAR_MAX_REDIRECTS,
			timeoutMs,
			responseHeaderTimeoutMs: timeoutMs,
			readIdleTimeoutMs: timeoutMs,
			requestInit: { headers: { Accept: USER_PROFILE_AVATAR_MIME_TYPES.join(",") } }
		});
		const mime = toAvatarMime(loaded.contentType);
		const detected = await fileTypeFromBuffer(loaded.buffer);
		return mime && detected?.mime === mime ? {
			bytes: loaded.buffer,
			mime
		} : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/state/user-profiles-avatar.ts
function requireAvatarProfile(profile, profileId) {
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
/** Best-effort avatar adoption runs after authentication so remote I/O cannot delay login. */
async function adoptTailscaleProfileAvatar(profileId, profilePic, options = {}, fetchOptions = {}) {
	const first = captureAssistantStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const { executeAssistantStateWorker, runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	const before = await executeAssistantStateWorker(first, {
		type: "userProfiles.avatar.inspect",
		input: { profileId }
	});
	const initial = requireAvatarProfile(before.profile, profileId);
	if (before.hasAvatar || !profilePic) return initial;
	const avatar = await fetchTailscaleAvatar(profilePic, fetchOptions);
	const context = captureAssistantStateWorkerContext({
		...options,
		path: first.admission.databasePath
	});
	if (!avatar) return requireAvatarProfile((await executeAssistantStateWorker(context, {
		type: "userProfiles.avatar.inspect",
		input: { profileId }
	})).profile, profileId);
	const [{ withAssistantStateSettlementRead }, { createSqliteWorkerOperationAdmission }] = await Promise.all([import("./testclaw-state-settlement-read-CEwMXVjr.js"), import("./sqlite-worker-operation-admission-DCL4Bzc8.js")]);
	return await withAssistantStateSettlementRead(context, async (settlementRead) => runAssistantStateWorkerOperation(context, async (scope) => {
		const receipt = await scope.execute({
			type: "userProfiles.avatar.adopt",
			input: {
				profileId,
				bytes: avatar.bytes,
				mime: avatar.mime,
				now: Date.now()
			}
		});
		settlementRead.acknowledge(receipt.committed);
		return requireAvatarProfile(receipt.profile, profileId);
	}, {
		requireStateLifecycle: true,
		createAdmission(retained) {
			return {
				nativeLocations: [context.admission.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					context.admission.assertCurrent();
					if (request.stage !== "transaction" || !isUserProfileAvatarAdmission(request.facts)) throw new Error("Unexpected profile avatar transaction admission");
					const publication = retainUserProfilePublication(context.admission.identity, request.facts.before.id, request.facts.before);
					try {
						settlementRead.bind({
							type: "userProfiles.reconcile",
							profileId: request.facts.before.id
						}, retained.settled, publication.reconcile, publication.release);
					} catch (error) {
						publication.release();
						throw error;
					}
					grant();
				})
			};
		}
	}));
}
//#endregion
//#region src/state/user-profiles.ts
function selectUserProfileListItemById(db, profileId) {
	const kysely = userProfilesDb(db);
	const profile = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").select([
		"id",
		"display_name",
		"avatar_mime",
		"merged_into",
		...hasEnsuredUserProfileRoleSchema(db) ? ["role"] : [],
		"created_at",
		"updated_at",
		userProfileAvatarPresence
	]).where("id", "=", profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows;
	return {
		...toUserProfile(profile),
		emails: emails.map((alias) => alias.email),
		githubIdentity: selectUserProfileGitHubIdentities(db, [profileId]).get(profileId) ?? null,
		hasAvatar: profile.has_avatar === 1
	};
}
/** Resolves a durable profile reference to its current one-hop merge head. */
function resolveUserProfileId(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openAssistantStateDatabase(options);
	return selectResolvedUserProfileMetadataById(db, profileId)?.id;
}
/** Reads a profile's protocol-facing representation through its merge head. */
function getUserProfileListItem(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openAssistantStateDatabase(options);
	return selectUserProfileListItemById(db, requireResolvedUserProfileMetadataById(db, profileId).id);
}
/** Reads the role assigned to an existing profile's current merge head. */
function getUserProfileRole(profileId, options = {}) {
	ensureUserProfileRoleSchema(options);
	const { db } = openAssistantStateDatabase(options);
	return requireResolvedUserProfileMetadataById(db, profileId).role ?? null;
}
function ensureProfileForEmailWithInitialName(email, initialDisplayName, options) {
	const normalizedEmail = normalizeProfileEmail(email);
	ensureUserProfilesSchema(options);
	const { db: reader } = openAssistantStateDatabase(options);
	const selectExistingProfile = (database) => {
		const alias = executeSqliteQueryTakeFirstSync(database, userProfilesDb(database).selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		return alias ? toUserProfile(requireResolvedUserProfileMetadataById(database, alias.profile_id)) : void 0;
	};
	const found = runSqliteDeferredTransactionSync(reader, () => selectExistingProfile(reader));
	if (found) return found;
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => ensureProfileForEmailInDatabase(db, normalizedEmail, initialDisplayName, now, options.mutation), options, { operationLabel: "user-profiles.ensure" });
}
/** Resolves an email alias or atomically creates its first durable profile. */
function ensureProfileForEmail(email, options = {}) {
	return ensureProfileForEmailWithInitialName(email, null, options);
}
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runAssistantStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
}
/** Stores a bounded, allowlisted avatar without ever leaving the write transaction async. */
function setAvatar(profileId, bytes, mime, options = {}) {
	if (bytes.byteLength > 524288) return err({
		code: "avatar_too_large",
		maxBytes: MAX_USER_PROFILE_AVATAR_BYTES
	});
	if (!USER_PROFILE_AVATAR_MIME_TYPES.includes(mime)) return err({
		code: "unsupported_avatar_mime",
		mime
	});
	const now = Date.now();
	ensureUserProfilesSchema(options);
	const value = runAssistantStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" });
	return ok(value);
}
//#endregion
export { setAvatar as a, listProfiles as c, resolveUserProfileId as i, readUserProfileDirectory as l, getUserProfileListItem as n, setDisplayName as o, getUserProfileRole as r, adoptTailscaleProfileAvatar as s, ensureProfileForEmail as t, resolveCanonicalCachedGitHubIdentity as u };
