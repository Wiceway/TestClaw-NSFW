import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-0-0UmO2m.js";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { T as string, g as literal, l as _enum, m as discriminatedUnion, w as strictObject, y as number } from "./schemas-D6YHSiZI.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { f as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-CUEKVOsi.js";
import { c as readPersonalGitHubSecret, r as PersonalGitHubStateError, u as writePersonalGitHubSecret } from "./secret-store-hidden-github-DsuBd1gD.js";
import { a as githubOAuthSecret, i as githubOAuthScopes, n as githubOAuthProfileId, o as githubOAuthTimestamp, r as githubOAuthRefreshFields, s as validGitHubDeviceTiming, t as githubOAuthDeviceFields } from "./github-oauth-values-CYPcI5vg.js";
import { randomUUID } from "node:crypto";
//#region src/state/user-github-connections.ts
const tokenPair = strictObject({
	accessToken: githubOAuthSecret,
	refreshToken: githubOAuthSecret,
	tokenType: literal("bearer"),
	scopes: githubOAuthScopes,
	expiresInSeconds: number().int().positive().max(31622400),
	refreshTokenExpiresInSeconds: number().int().positive().max(31622400)
});
const deviceFields = {
	requestId: string().uuid(),
	createdAtMs: githubOAuthTimestamp,
	expiresAtMs: githubOAuthTimestamp
};
const device = strictObject({
	...deviceFields,
	kind: literal("device"),
	...githubOAuthDeviceFields,
	candidate: strictObject({
		profileId: githubOAuthProfileId,
		tokens: tokenPair,
		receivedAtMs: githubOAuthTimestamp
	}).optional()
});
const connected = strictObject({
	kind: literal("connected"),
	profileId: githubOAuthProfileId,
	...githubOAuthRefreshFields,
	refreshFailure: _enum(["expired", "failed"]).optional(),
	refresh: strictObject({
		operationId: string().uuid(),
		tokens: tokenPair.optional(),
		receivedAtMs: githubOAuthTimestamp.optional()
	}).optional()
});
const connectionSchema = strictObject({
	version: literal(1),
	generation: string().uuid(),
	selection: discriminatedUnion("kind", [strictObject({ kind: literal("disconnected") }), connected]),
	pending: discriminatedUnion("kind", [strictObject({
		...deviceFields,
		kind: literal("starting")
	}), device]).optional()
}).superRefine((record, ctx) => {
	const pending = record.pending;
	if (pending && !validGitHubDeviceTiming(pending)) ctx.addIssue({
		code: "custom",
		message: "Invalid device timing"
	});
	const selection = record.selection;
	if (selection.kind === "connected" && (selection.refreshExpiresAtMs <= selection.accessExpiresAtMs || Boolean(selection.refresh?.tokens) !== (selection.refresh?.receivedAtMs !== void 0))) ctx.addIssue({
		code: "custom",
		message: "Invalid refresh state"
	});
});
const retirementObservers = /* @__PURE__ */ new Set();
function observeUserGitHubProfileRetirement(observer) {
	retirementObservers.add(observer);
	return () => {
		retirementObservers.delete(observer);
	};
}
function retireAfterCommit(db, ids) {
	if (ids.length > 0) deferSqlitePostCommitPublication(db, () => {
		for (const observer of retirementObservers) observer(ids);
	});
}
function parseConnection(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new PersonalGitHubStateError();
	}
	const result = connectionSchema.safeParse(parsed);
	if (!result.success) throw new PersonalGitHubStateError();
	const record = result.data;
	if (record.pending?.kind === "device") {
		registerSecretValueForRedaction(record.pending.deviceCode);
		if (record.pending.candidate) registerTokens(record.pending.candidate.tokens);
	}
	if (record.selection.kind === "connected") {
		registerSecretValueForRedaction(record.selection.refreshToken);
		if (record.selection.refresh?.tokens) registerTokens(record.selection.refresh.tokens);
	}
	return record;
}
function registerTokens(tokens) {
	registerSecretValueForRedaction(tokens.accessToken);
	registerSecretValueForRedaction(tokens.refreshToken);
}
/** Display fallback to a tombstone is never credential ownership. */
function resolvePersonalGitHubOwner(profile, db = openAssistantStateDatabase().db) {
	if (!tableExists(db, "user_profiles")) return;
	const resolved = selectResolvedUserProfileMetadataById(db, profile);
	return resolved && !resolved.merged_into ? resolved.id : void 0;
}
function requireOwner(db, owner) {
	if (resolvePersonalGitHubOwner(owner, db) !== owner) throw new Error("Personal GitHub owner changed; reconnect and try again.");
}
function readConnection(db, owner) {
	const raw = readPersonalGitHubSecret(db, owner);
	return raw === void 0 ? void 0 : parseConnection(raw);
}
function readUserGitHubConnection(owner, database) {
	const db = openAssistantStateDatabase(database).db;
	requireOwner(db, owner);
	return readConnection(db, owner);
}
function updateUserGitHubConnection(owner, update, assertCurrent, database) {
	return runAssistantStateWriteTransaction(({ db }) => {
		requireOwner(db, owner);
		const current = readConnection(db, owner);
		const next = parseConnection(JSON.stringify(update(current)));
		assertCurrent();
		writePersonalGitHubSecret(db, owner, JSON.stringify(next));
		const retained = new Set(connectionProfiles(next));
		retireAfterCommit(db, connectionProfiles(current).filter((id) => !retained.has(id)));
		return next;
	}, database, { operationLabel: "users.github.update" });
}
function disconnectedUserGitHubConnection() {
	return {
		version: 1,
		generation: randomUUID(),
		selection: { kind: "disconnected" }
	};
}
function disconnectUserGitHubConnection(owner, assertCurrent) {
	runAssistantStateWriteTransaction(({ db }) => {
		requireOwner(db, owner);
		const previous = readConnectionForReplacement(db, owner);
		assertCurrent();
		writePersonalGitHubSecret(db, owner, JSON.stringify(disconnectedUserGitHubConnection()));
		retireAfterCommit(db, connectionProfiles(previous));
	}, void 0, { operationLabel: "users.github.disconnect" });
}
function connectionProfiles(record) {
	return [...record?.selection.kind === "connected" ? [record.selection.profileId] : [], ...record?.pending?.kind === "device" && record.pending.candidate ? [record.pending.candidate.profileId] : []];
}
function readConnectionForReplacement(db, owner) {
	try {
		return readConnection(db, owner);
	} catch (error) {
		if (!(error instanceof PersonalGitHubStateError)) throw error;
		return disconnectedUserGitHubConnection();
	}
}
/** A remote rotation may follow an exact transferred operation; this never authorizes an action. */
function updateUserGitHubRefresh(params) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const owner = resolvePersonalGitHubOwner(params.owner, db);
		if (!owner) return false;
		const record = readConnection(db, owner);
		const selection = record?.selection;
		if (!record || selection?.kind !== "connected" || selection.profileId !== params.profileId || selection.refresh?.operationId !== params.operationId) return false;
		const next = parseConnection(JSON.stringify({
			...record,
			selection: params.update(selection)
		}));
		writePersonalGitHubSecret(db, owner, JSON.stringify(next));
		return true;
	}, void 0, { operationLabel: "users.github.refresh" });
}
function listUserGitHubConnections() {
	const db = openAssistantStateDatabase().db;
	if (!tableExists(db, "secret_store_entries") || !tableExists(db, "user_profiles")) return [];
	const query = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, query.selectFrom("secret_store_entries").innerJoin("user_profiles", "user_profiles.id", "secret_store_entries.scope_id").select(["scope_id", "value"]).where("scope_kind", "=", "identity").where("name", "=", "github-connection").where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null).where("merged_into", "is", null).orderBy("scope_id")).rows.flatMap((row) => {
		try {
			return [{
				owner: row.scope_id,
				connection: parseConnection(row.value)
			}];
		} catch {
			return [];
		}
	});
}
//#endregion
export { readUserGitHubConnection as a, updateUserGitHubRefresh as c, observeUserGitHubProfileRetirement as i, disconnectedUserGitHubConnection as n, resolvePersonalGitHubOwner as o, listUserGitHubConnections as r, updateUserGitHubConnection as s, disconnectUserGitHubConnection as t };
