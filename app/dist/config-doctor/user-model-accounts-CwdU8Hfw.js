import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-0-0UmO2m.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { C as record, T as string, g as literal, k as unknown, w as strictObject, y as number } from "./schemas-D6YHSiZI.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { S as ensureSecretStoreSchema, c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { _ as userProfilesDb, d as selectResolvedUserProfile } from "./user-profiles-internal-CUEKVOsi.js";
import "./secret-store-validation-error-Bzzf_1MN.js";
import { i as inlineAuthProfileCredentialSchema, n as parseUserModelAuthProfileId, r as coerceProfileUsageStats, t as isUserModelAuthProfileId } from "./user-model-account-id-DbXiF5Ev.js";
import { randomUUID } from "node:crypto";
import { toUSVString } from "node:util";
//#region src/state/user-model-accounts.ts
const credentialSchema = inlineAuthProfileCredentialSchema.refine((credential) => credential.copyToAgents !== true, "Personal model accounts cannot be copied to agent stores.");
const linksSchema = strictObject({
	version: literal(1),
	links: record(string(), strictObject({
		authProfileId: string().min(1),
		updatedAt: number()
	}).nullable())
});
const profileSchema = strictObject({
	version: literal(1),
	credential: credentialSchema,
	usageStats: unknown().transform(coerceProfileUsageStats).optional()
});
const MODEL_ACCOUNTS_PAGE_SIZE = 50;
function invalidAccounts() {
	return /* @__PURE__ */ new Error("Personal model account state is invalid; restore a verified state backup.");
}
function parseRecord(value, schema) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw invalidAccounts();
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		throw invalidAccounts();
	}
	const result = schema.safeParse(parsed);
	if (!result.success) throw invalidAccounts();
	return result.data;
}
function resolveOwner(db, profileId) {
	if (!tableExists(db, "user_profiles")) return;
	const profile = selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").select(["id", "merged_into"]));
	return profile && !profile.merged_into ? profile.id : void 0;
}
function requireOwner(db, profileId) {
	const owner = resolveOwner(db, profileId);
	if (!owner) throw new Error("Personal model account owner is unavailable; refresh Profile and try again.");
	return owner;
}
function readRecord(db, owner, name) {
	if (!tableExists(db, "secret_store_entries")) return;
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
		"value",
		"kind",
		"allowed_hosts"
	]).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "=", name).where("deleted_at_ms", "is", null));
	if (!row) return;
	if (row.kind !== "secret" || row.allowed_hosts !== null) throw invalidAccounts();
	return row.value;
}
function writeRecord(db, owner, name, value) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new Error("Personal model account entry exceeds the 64 KiB secret-store limit.");
	ensureSecretStoreSchema(db);
	const now = Date.now();
	const mutable = {
		value,
		kind: "secret",
		allowed_hosts: null,
		deleted_at_ms: null,
		updated_at_ms: now,
		updated_by: null
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("secret_store_entries").values({
		scope_kind: "identity",
		scope_id: owner,
		name,
		created_at_ms: now,
		...mutable
	}).onConflict((conflict) => conflict.columns([
		"scope_kind",
		"scope_id",
		"name"
	]).doUpdateSet(mutable)));
}
function readLinks(db, owner) {
	const raw = readRecord(db, owner, "model-accounts");
	return raw === void 0 ? {
		version: 1,
		links: {}
	} : parseRecord(raw, linksSchema);
}
function writeLinks(db, owner, links) {
	writeRecord(db, owner, "model-accounts", JSON.stringify(linksSchema.parse(links)));
}
function readProfile(db, owner, authProfileId) {
	if (!isUserModelAuthProfileId(authProfileId)) return;
	const raw = readRecord(db, owner, `model-account:${authProfileId}`);
	if (raw === void 0) return;
	const { credential, usageStats } = parseRecord(raw, profileSchema);
	registerUserModelAuthProfileSecrets(credential);
	return {
		credential,
		usageStats
	};
}
function registerUserModelAuthProfileSecrets(credential) {
	if (credential.type === "oauth") {
		registerSecretValueForRedaction(credential.access);
		registerSecretValueForRedaction(credential.refresh);
		if (credential.idToken) registerSecretValueForRedaction(credential.idToken);
	} else if (credential.type === "token") {
		if (credential.token !== void 0) registerSecretValueForRedaction(credential.token);
	} else if (credential.key !== void 0) registerSecretValueForRedaction(credential.key);
}
function writeProfile(db, owner, authProfileId, profile) {
	const record = profileSchema.parse({
		version: 1,
		...profile
	});
	writeRecord(db, owner, `model-account:${authProfileId}`, JSON.stringify(record));
}
function accountLinks(record) {
	return Object.entries(record.links).toSorted(([a], [b]) => a.localeCompare(b)).flatMap(([provider, link]) => link ? [{
		provider,
		...link
	}] : []);
}
function credentialOwner(db, authProfileId) {
	const locator = parseUserModelAuthProfileId(authProfileId);
	return locator ? resolveOwner(db, locator.ownerProfileId) : void 0;
}
/** A locator identifies a record; only its current identity owner can newly select it. */
function isUserModelAuthProfileOwner(params, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const owner = resolveOwner(db, params.profileId);
		if (!owner || credentialOwner(db, params.authProfileId) !== owner || !tableExists(db, "secret_store_entries")) return false;
		return Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("secret_store_entries").select("name").where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "=", `model-account:${params.authProfileId}`).where("deleted_at_ms", "is", null)));
	}, options) ?? false;
}
function accountSummary(authProfileId, value, links) {
	const { credential } = parseRecord(value, profileSchema);
	return {
		authProfileId,
		provider: credential.provider,
		label: truncateUtf16Safe(toUSVString(credential.displayName?.trim() || credential.email?.trim() || credential.provider), 256),
		authType: credential.type,
		selected: links.links[credential.provider]?.authProfileId === authProfileId
	};
}
/** Owner-only control-plane inventory; runtime selection never enumerates private accounts. */
function listUserModelAccounts(params, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		if (!tableExists(db, "secret_store_entries")) return { accounts: [] };
		const links = readLinks(db, owner);
		let query = getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
			"name",
			"value",
			"kind",
			"allowed_hosts"
		]).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "like", "model-account:%").where("deleted_at_ms", "is", null).orderBy("name").limit(51);
		if (params.cursor) query = query.where("name", ">", `model-account:${params.cursor}`);
		const rows = executeSqliteQuerySync(db, query).rows;
		const accounts = rows.slice(0, MODEL_ACCOUNTS_PAGE_SIZE).map((row) => {
			if (row.kind !== "secret" || row.allowed_hosts !== null) throw invalidAccounts();
			return accountSummary(row.name.slice(14), row.value, links);
		});
		const last = accounts.at(-1);
		return {
			accounts,
			...rows.length > MODEL_ACCOUNTS_PAGE_SIZE && last ? { nextCursor: last.authProfileId } : {}
		};
	}, options) ?? { accounts: [] };
}
function readUserModelAccountSummary(params, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const owner = resolveOwner(db, params.profileId);
		if (!owner || credentialOwner(db, params.authProfileId) !== owner) return;
		const value = readRecord(db, owner, `model-account:${params.authProfileId}`);
		return value === void 0 ? void 0 : accountSummary(params.authProfileId, value, readLinks(db, owner));
	}, options);
}
/** Only an explicitly selected credential is loaded; no personal account enumeration. */
function readUserModelAuthProfile(authProfileId, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const owner = credentialOwner(db, authProfileId);
		return owner ? readProfile(db, owner, authProfileId) : void 0;
	}, options);
}
/** The canonical OAuth/usage owners mutate one exact private credential under the DB lock. */
function updateUserModelAuthProfile(authProfileId, update, options = {}) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const owner = credentialOwner(db, authProfileId);
		const current = owner ? readProfile(db, owner, authProfileId) : void 0;
		if (!owner || !current) return false;
		const provider = current.credential.provider;
		if (!update(current)) return false;
		if (current.credential.provider !== provider) throw new Error("A personal model account refresh cannot change its provider.");
		writeProfile(db, owner, authProfileId, current);
		return true;
	}, options, { operationLabel: "users.model-accounts.update" });
}
/** Credential and selection commit together, after revalidating the live authorization. */
function connectUserModelAccount(params, options = {}) {
	const credential = credentialSchema.parse(params.credential);
	const candidate = withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const id = readLinks(db, params.ownerProfileId).links[credential.provider]?.authProfileId;
		const profile = id ? readProfile(db, params.ownerProfileId, id) : void 0;
		return id && profile ? {
			id,
			credential: profile.credential
		} : void 0;
	}, options);
	const replacement = candidate?.credential.provider === credential.provider && params.matchesCredential?.(candidate.credential) ? candidate : void 0;
	return runAssistantStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.ownerProfileId);
		if (owner !== params.ownerProfileId) throw new Error("Personal model account owner changed; refresh Profile and try again.");
		const record = readLinks(db, owner);
		const authProfileId = replacement && record.links[credential.provider]?.authProfileId === replacement.id && JSON.stringify(readProfile(db, owner, replacement.id)?.credential) === JSON.stringify(replacement.credential) ? replacement.id : `personal:${owner}:${randomUUID()}`;
		record.links[credential.provider] = {
			authProfileId,
			updatedAt: Date.now()
		};
		params.assertCurrent();
		writeProfile(db, owner, authProfileId, { credential });
		writeLinks(db, owner, record);
		return {
			authProfileId,
			links: accountLinks(record)
		};
	}, options, { operationLabel: "users.model-accounts.connect" });
}
function listUserProfileAuthLinks(profileId, options = {}) {
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		const owner = resolveOwner(db, profileId);
		return owner ? accountLinks(readLinks(db, owner)) : [];
	}, options) ?? [];
}
function resolveUserProfileAuthLink(params, options = {}) {
	const links = listUserProfileAuthLinks(params.profileId, options);
	for (const provider of params.providers) {
		const link = links.find((candidate) => candidate.provider === provider);
		if (link) return link.authProfileId;
	}
}
/** Apply Doctor's verified credential renames without changing account selections or ownership. */
function renameUserProfileAuthLinks(profileIdMap, options = {}) {
	if (profileIdMap.size === 0) return 0;
	return runAssistantStateWriteTransaction(({ db }) => {
		if (!tableExists(db, "secret_store_entries")) return 0;
		const query = getNodeSqliteKysely(db);
		const rows = executeSqliteQuerySync(db, query.selectFrom("secret_store_entries").select("scope_id").where("scope_kind", "=", "identity").where("name", "=", "model-accounts").where("deleted_at_ms", "is", null)).rows;
		const replacements = [];
		for (const row of rows) {
			if (resolveOwner(db, row.scope_id) !== row.scope_id) continue;
			const record = readLinks(db, row.scope_id);
			let changed = false;
			for (const link of Object.values(record.links)) {
				if (!link) continue;
				const renamed = profileIdMap.get(link.authProfileId);
				if (renamed !== void 0 && renamed !== link.authProfileId) {
					link.authProfileId = renamed;
					changed = true;
				}
			}
			if (changed) {
				const value = JSON.stringify(record);
				parseRecord(value, linksSchema);
				replacements.push({
					owner: row.scope_id,
					value
				});
			}
		}
		for (const { owner, value } of replacements) executeSqliteQuerySync(db, query.updateTable("secret_store_entries").set({ value }).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "=", "model-accounts").where("deleted_at_ms", "is", null));
		return replacements.length;
	}, options, { operationLabel: "users.model-accounts.rename-auth-profiles" });
}
function setUserProfileAuthLink(params, options = {}) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		const record = readLinks(db, owner);
		if (isUserModelAuthProfileId(params.authProfileId) && (credentialOwner(db, params.authProfileId) !== owner || readProfile(db, owner, params.authProfileId)?.credential.provider !== params.provider)) throw new Error("Personal model account does not belong to this profile and provider.");
		record.links[params.provider] = {
			authProfileId: params.authProfileId,
			updatedAt: Date.now()
		};
		params.assertCurrent?.();
		writeLinks(db, owner, record);
		return accountLinks(record);
	}, options, { operationLabel: "users.model-accounts.link" });
}
function clearUserProfileAuthLink(params, options = {}) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		const record = readLinks(db, owner);
		record.links[params.provider] = null;
		params.assertCurrent?.();
		writeLinks(db, owner, record);
		return accountLinks(record);
	}, options, { operationLabel: "users.model-accounts.unlink" });
}
//#endregion
export { listUserProfileAuthLinks as a, registerUserModelAuthProfileSecrets as c, setUserProfileAuthLink as d, updateUserModelAuthProfile as f, listUserModelAccounts as i, renameUserProfileAuthLinks as l, connectUserModelAccount as n, readUserModelAccountSummary as o, isUserModelAuthProfileOwner as r, readUserModelAuthProfile as s, clearUserProfileAuthLink as t, resolveUserProfileAuthLink as u };
