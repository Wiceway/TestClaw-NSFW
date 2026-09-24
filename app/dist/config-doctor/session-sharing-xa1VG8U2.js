import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { n as resolveGlobalMap } from "./global-singleton-DmdlcXls.js";
import { m as resolveConfiguredAgentId, p as resolveAmbientOwnerAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-BEuqweC1.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { q as tableHasColumn } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import "./config-machine-state-BiDCuNUZ.js";
import "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-cXJW6Bip.js";
import { t as sessionChanges } from "./session-row-changes-DN0Dk-5R.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import "./testclaw-state-db-BAeysXj_.js";
import "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { r as resolveAgentMainSessionKey } from "./main-session-DzZK9knv.js";
import { f as runAssistantAgentWriteTransaction, l as openAssistantAgentDatabase } from "./testclaw-agent-db-Ckg86YCZ.js";
import { c as isInternalSessionEffectsKey } from "./session-accessor.sqlite-exact-read-CFY3B1wI.js";
import { Dt as sqliteSessionEntriesEqual, f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BzD1qpup.js";
import { _ as parseSessionEntryJson, r as assertCanonicalSqliteSessionKeysCurrent, y as selectSessionEntryRows } from "./session-canonical-key-Bxbtl4CI.js";
import { C as readExactSessionEntryRow, i as publishSessionEntryCacheCategoryUpdate, k as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-cache-CTTseQJ_.js";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import "./session-accessor.sqlite-entry-CJ8WVyje.js";
import { Tt as runSessionCollaborationWrite } from "./session-accessor-DMf92PxK.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { n as resolveRequestedSessionAgentId, r as resolveRequestedSessionAgentInput } from "./session-request-agent-cU98pfB6.js";
import { r as resolveSessionStoreIdentity, t as canonicalizeSessionKeyForAgent } from "./session-store-key-DRl7Rrsc.js";
import "./targets-BxNVBaMw.js";
import { f as resolveOperatorRolePolicyForAssignment, n as authorizeGatewaySessionCreation, o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-gPgbkoHA.js";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.js";
import { a as sessionMutationTargetFields, i as isSessionProfileDependentMethod, n as isApprovalSessionTargetMethod, r as isRequiredSessionTargetMethod, t as isAgentRunStartMethod } from "./session-method-policy-Bf4wvoIc.js";
import { o as resolveGatewaySessionStoreTarget, s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-BpmBw41u.js";
import { C as authenticatedProfileUnavailableError, D as isGatewayClientProfilePending, E as gatewayClientSessionCreator, S as prepareSessionCreatorProfile, _ as resolveSessionSharingTarget, b as sharingIdentity, d as hiddenSessionNotFound, f as isGatewayAdmin, g as resolveSessionSharingRole, l as canManageSessionSharing, n as authorizeIncognitoSessionTarget, o as authorizeSessionAgentRun, r as authorizeOwnSessionMutation, s as authorizeSessionSharingTarget, x as isSessionCreatorProfile, y as resolveSessionVisibility } from "./session-sharing-policy-rVme8bnl.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-DRRHY4tb.js";
import { s as resolveAuthorizedBoardViewTicketClaims } from "./board-view-ticket-BGGhffu6.js";
import { i as readSessionGroupMembershipInWorker, n as mutateSessionGroupCatalog, r as readSessionGroupCatalog, t as ensureSessionGroupCatalog } from "./session-group-catalog-OBbSMVJw.js";
import "./server-utils-CvEJ_kDk.js";
import "node:util";
//#region src/gateway/session-sharing-snapshot-cache.ts
const SNAPSHOT_CACHE_LIMIT = 2048;
const snapshotCache = /* @__PURE__ */ new Map();
const snapshotAliases = /* @__PURE__ */ new Map();
const snapshotKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysByCanonicalKey = /* @__PURE__ */ new Map();
function snapshotKey(sessionKey, agentId) {
	return `${agentId ?? ""}\0${sessionKey}`;
}
function logicalSessionKey(key) {
	return key.slice(key.lastIndexOf("\0") + 1);
}
function addReverseIndex(index, key, value) {
	const values = index.get(key) ?? /* @__PURE__ */ new Set();
	values.add(value);
	index.set(key, values);
}
function removeReverseIndex(index, key, value) {
	const values = index.get(key);
	values?.delete(value);
	if (values?.size === 0) index.delete(key);
}
function removeSnapshotAlias(alias) {
	const canonical = snapshotAliases.get(alias);
	if (!canonical) return;
	snapshotAliases.delete(alias);
	removeReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	removeReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
}
function removeSnapshot(key) {
	if (!snapshotCache.delete(key)) return;
	removeReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	for (const alias of aliasKeysByCanonicalKey.get(key) ?? []) removeSnapshotAlias(alias);
}
function rememberSnapshot(key, snapshot) {
	const known = snapshotCache.delete(key);
	snapshotCache.set(key, snapshot);
	if (!known) addReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	if (snapshotCache.size <= SNAPSHOT_CACHE_LIMIT) return;
	const oldest = snapshotCache.keys().next().value;
	if (oldest) removeSnapshot(oldest);
}
function rememberSnapshotAlias(alias, canonical) {
	removeSnapshotAlias(alias);
	snapshotAliases.set(alias, canonical);
	addReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	addReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
	if (snapshotAliases.size <= SNAPSHOT_CACHE_LIMIT * 2) return;
	const oldest = snapshotAliases.keys().next().value;
	if (oldest) removeSnapshotAlias(oldest);
}
function invalidateSessionSharingSnapshot(sessionKey) {
	if (sessionKey) {
		const matchingCanonicalKeys = new Set(snapshotKeysBySessionKey.get(sessionKey));
		for (const alias of aliasKeysBySessionKey.get(sessionKey) ?? []) {
			const canonical = snapshotAliases.get(alias);
			if (canonical) matchingCanonicalKeys.add(canonical);
		}
		for (const key of matchingCanonicalKeys) removeSnapshot(key);
		return;
	}
	snapshotCache.clear();
	snapshotAliases.clear();
	snapshotKeysBySessionKey.clear();
	aliasKeysBySessionKey.clear();
	aliasKeysByCanonicalKey.clear();
}
function loadCachedSessionSharingSnapshot(params) {
	const requestedKey = snapshotKey(params.sessionKey, params.agentId);
	const aliasedKey = snapshotAliases.get(requestedKey);
	const cached = snapshotCache.get(aliasedKey ?? requestedKey);
	if (cached) return cached;
	const resolved = params.resolve();
	const canonicalKey = snapshotKey(resolved.canonicalKey, resolved.canonicalAgentId);
	const canonicalCached = snapshotCache.get(canonicalKey);
	if (!canonicalCached) rememberSnapshot(canonicalKey, resolved.snapshot);
	if (requestedKey !== canonicalKey) rememberSnapshotAlias(requestedKey, canonicalKey);
	return canonicalCached ?? resolved.snapshot;
}
//#endregion
//#region src/gateway/session-sharing-read.ts
function loadSharingSnapshot(params) {
	const { sessionKey, agentId } = params;
	return loadCachedSessionSharingSnapshot({
		agentId,
		sessionKey,
		resolve: () => {
			const target = resolveSessionSharingTarget(params);
			return {
				canonicalKey: target?.canonicalKey ?? sessionKey,
				canonicalAgentId: target?.agentId ?? agentId,
				snapshot: {
					visibility: target ? resolveSessionVisibility(target.entry) : "draft",
					incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
					...target ? { createdActor: target.entry.createdActor } : {}
				}
			};
		}
	});
}
function canReceiveSessionEvent(params) {
	const { cfg, client, sessionKeys, event } = params;
	if (isGatewayAdmin(client)) return true;
	const operatorActor = resolveGatewayOperatorRoleActor(client);
	const identity = sharingIdentity(client, operatorActor);
	if (!identity) return (!cfg.gateway?.roles || operatorActor?.kind === "system") && event !== "session.suggestion" && event !== "session.typing";
	const sharing = params.prepared?.sharing ?? prepareSessionSharing({
		cfg,
		client
	});
	const hidesForeignSessions = (params.prepared ? sharing.sessionCap : operatorSessionCap(client, cfg)) === "none";
	const lookup = {
		cfg,
		agentId: params.agentId,
		exactRead: sessionKeys.length === 1,
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	};
	const resolveTarget = (sessionKey) => params.prepared ? params.prepared.target(sessionKey, params.agentId) : resolveSessionSharingTarget({
		...lookup,
		sessionKey
	});
	const visible = sessionKeys.every((sessionKey) => {
		const target = params.prepared ? resolveTarget(sessionKey) : void 0;
		const snapshot = params.prepared ? {
			visibility: target ? resolveSessionVisibility(target.entry) : "draft",
			incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
			createdActor: target?.entry.createdActor
		} : loadSharingSnapshot({
			...lookup,
			sessionKey
		});
		const isCreator = sharing.isCreator(snapshot.createdActor);
		if (snapshot.incognito || hidesForeignSessions && !isCreator) return false;
		if (snapshot.visibility !== "draft" || isCreator) return true;
		if (event !== "session.typing") return false;
		const typingTarget = resolveTarget(sessionKey);
		return typingTarget !== null && canManageSessionSharing(sharing.roleForTarget(typingTarget));
	});
	if (!visible || event !== "session.suggestion") return visible;
	if ((params.payload && typeof params.payload === "object" ? params.payload.suggestion?.author?.id : void 0) === identity.id) return true;
	return sessionKeys.every((sessionKey) => {
		const target = resolveTarget(sessionKey);
		return target !== null && sharing.roleForTarget(target) !== "viewer";
	});
}
/** Share caller facts across synchronous selection/role projection, never across an await. */
function prepareSessionSharing(params, prepared) {
	const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
	const isCreator = prepareSessionCreatorProfile(identity?.id, prepared?.aliases);
	const roleForTarget = (target, isMember) => resolveSessionSharingRole({
		...params,
		target,
		isMember: isMember ?? (prepared && Boolean(identity && prepared.isMember(target, identity.id)))
	}, prepared && { value: prepared.sessionCap }, isCreator);
	return {
		isCreator,
		sessionCap: prepared?.sessionCap,
		entryFilter: createSessionListEntryFilter(params, isCreator, prepared),
		roleForTarget,
		authorizeTarget: (target) => authorizeSessionSharingTarget({
			...params,
			target
		}, prepared && {
			value: prepared.sessionCap,
			role: roleForTarget(target)
		})
	};
}
function prepareProjectedSessionSharing(params) {
	const { cfg, client, isMember } = params;
	if (client?.internal?.syntheticClient) prepareGatewayRecipientProfile(client);
	const actor = resolveGatewayOperatorRoleActor(client);
	const identity = sharingIdentity(client, actor);
	const retained = client?.preparedSessionProfile;
	const profile = identity && retained?.aliases.has(identity.id) ? retained : void 0;
	const roleProfile = actor?.kind === "operator" && retained?.aliases.has(actor.profileId) ? retained : void 0;
	const sessionCap = actor?.kind === "system" ? void 0 : resolveOperatorRolePolicyForAssignment(roleProfile?.profileId, roleProfile?.role ?? null, cfg)?.sessions.others;
	return prepareSessionSharing(params, {
		aliases: profile?.aliases ?? /* @__PURE__ */ new Set(),
		sessionCap,
		isMember
	});
}
function createSessionListEntryFilter(params, isCreator, prepared) {
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = sharingIdentity(params.client, operatorActor);
	if (isGatewayAdmin(params.client) || !identity && operatorActor?.kind === "system") return;
	if (!identity) return params.cfg?.gateway?.roles ? () => false : void 0;
	const sessionCap = prepared ? prepared.sessionCap : params.cfg && operatorSessionCap(params.client, params.cfg);
	return createProfileSessionEntryFilter({
		profileId: identity.id,
		sessionCap
	}, isCreator);
}
function createProfileSessionEntryFilter(params, isCreator) {
	const creatorMatches = isCreator ?? ((actor) => isSessionCreatorProfile(actor, params.profileId));
	return (sessionKey, entry) => entry.incognito !== true && !isIncognitoSessionKey(sessionKey) && (creatorMatches(entry.createdActor) || params.sessionCap !== "none" && resolveSessionVisibility(entry) !== "draft");
}
//#endregion
//#region src/gateway/session-group-catalog.kernel.ts
const kyselyFor = (db) => getNodeSqliteKysely(db);
function hasDefaults(db) {
	return tableHasColumn(db, "session_groups", "cwd") && tableHasColumn(db, "session_groups", "worktree");
}
function readSessionGroupCatalogEntry(db, name) {
	const query = kyselyFor(db).selectFrom("session_groups").where("name", "=", name).limit(1);
	const row = executeSqliteQuerySync(db, hasDefaults(db) ? query.selectAll() : query.select([
		"name",
		"position",
		"created_at"
	])).rows[0];
	return row && { ...row };
}
//#endregion
//#region src/config/sessions/session-group-categories.read.ts
function readSessionGroupCategoryKeys(database, name) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "list").orderBy("session_key")).rows.flatMap((row) => {
		if (isInternalSessionEffectsKey(row.session_key)) return [];
		const entry = parseSessionEntryJson(row, "list");
		if (!entry) return [];
		validateDeliveryCanonicalSessionEntry(row.session_key, entry);
		return entry.category?.trim() === name ? [row.session_key] : [];
	});
}
//#endregion
//#region src/config/sessions/session-group-categories.kernel.ts
function prepareSessionGroupCategoryMutation(database, name) {
	const rows = /* @__PURE__ */ new Map();
	for (const key of readSessionGroupCategoryKeys(database, name)) {
		const row = readExactSessionEntryRow(database, key);
		if (row?.entry.category?.trim() === name) rows.set(key, row);
	}
	return rows;
}
function applySessionGroupCategoryMutation(database, expected, to, env) {
	const current = /* @__PURE__ */ new Map();
	for (const [key, before] of expected) {
		const row = readExactSessionEntryRow(database, key);
		if (!row || row.row.entry_json !== before.row.entry_json || !sqliteSessionEntriesEqual(row.entry, before.entry)) throw new Error(`SQLite session entry changed before replacement for ${key}`);
		current.set(key, row);
	}
	assertSessionGroupCategoryDestination(to, env);
	for (const [key, row] of current) {
		const next = { ...row.entry };
		if (to === void 0) delete next.category;
		else next.category = to;
		writeSessionEntry(database, key, next, {
			canonicalPreviousEntry: row.entry,
			previousEntry: row.entry
		});
	}
	return [...current].map(([sessionKey, { entry }]) => ({
		sessionKey,
		sessionId: entry.sessionId
	}));
}
function assertSessionGroupCategoryDestination(to, env) {
	if (to !== void 0 && !withExistingAssistantStateDatabaseReadOnly(({ db }) => readSessionGroupCatalogEntry(db, to), { env })) throw new Error(`unknown session group: ${to}`);
}
//#endregion
//#region src/config/sessions/session-group-categories.ts
/** Prepared rows stay with the broker; only target identities cross the admission boundary. */
function updateSessionGroupCategoriesInWorker(params) {
	const { scope, from, to, assertTargetCurrent } = params;
	const agentId = scope.agentId;
	let keys = [];
	const superseded = /* @__PURE__ */ new Set();
	let releasePublicationFence;
	const assertCurrent = () => {
		for (const sessionKey of keys) assertTargetCurrent?.({
			agentId,
			sessionKey
		});
	};
	return runSessionCollaborationWrite(scope, {
		type: "category.apply",
		input: {
			scope,
			from,
			to
		}
	}, (capturedScope) => {
		const options = toDatabaseOptions(resolveSqliteScope(capturedScope));
		const planned = prepareSessionGroupCategoryMutation(openAssistantAgentDatabase(options), from);
		keys = [...planned.keys()];
		assertCurrent();
		return runAssistantAgentWriteTransaction((current) => {
			assertCurrent();
			return applySessionGroupCategoryMutation(current, planned, to, capturedScope.env ?? process.env).length;
		}, options);
	}, (changed, location, database) => {
		releasePublicationFence?.();
		publishSessionEntryCacheCategoryUpdate(database, changed.filter(({ sessionKey }) => !superseded.has(sessionKey)), to);
		sessionChanges.emitBatch(changed.map(({ sessionKey, sessionId }) => ({
			agentId: location.agentId,
			storePath: location.storePath,
			sessionKey,
			...superseded.has(sessionKey) ? { factsInvalidated: true } : { facts: {
				kind: "category",
				sessionId,
				category: to?.trim() || null
			} }
		})));
		return changed.length;
	}, assertCurrent, async (operation, preparedScope) => {
		keys = await operation.execute({
			type: "category.prepare",
			input: {
				scope: preparedScope,
				from
			}
		});
		assertCurrent();
		const targets = new Set(keys);
		releasePublicationFence = sessionChanges.subscribeFacts((change) => {
			if ("all" in change) for (const key of targets) superseded.add(key);
			else if (targets.has(change.sessionKey) && change.scope !== "automation" && (change.factsInvalidated || change.facts && change.facts.kind !== "unchanged" && change.facts.kind !== "member" && change.facts.kind !== "participants")) superseded.add(change.sessionKey);
		});
	}).finally(() => releasePublicationFence?.());
}
//#endregion
//#region src/gateway/session-groups.ts
var SessionGroupNotFoundError = class extends Error {
	constructor(name) {
		super(`unknown session group: ${name}`);
		this.name = "SessionGroupNotFoundError";
	}
};
var SessionGroupNotEmptyError = class extends Error {
	constructor(groups) {
		super(`sessions.groups.put cannot drop groups that still have member sessions: ${groups.map((group) => `"${group.name}" (${group.memberSessions})`).join(", ")}; include them in names or remove them via sessions.groups.delete`);
		this.groups = groups;
		this.name = "SessionGroupNotEmptyError";
	}
};
function normalizeGroupNames(names) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const raw of names) {
		const name = normalizeOptionalString(raw);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		normalized.push(name);
	}
	return normalized;
}
function normalizeSidebarSectionOrder(sectionOrder, groupNames) {
	const groups = new Set(groupNames);
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const raw of sectionOrder) {
		const sectionId = raw.trim();
		let canonical = null;
		if (sectionId === "ungrouped" || sectionId === "groups" || sectionId === "work") canonical = sectionId;
		else if (sectionId.startsWith("category:")) {
			const name = normalizeOptionalString(sectionId.slice(9));
			if (name && groups.has(name)) canonical = `category:${name}`;
		} else if (sectionId.startsWith("catalog:")) {
			const catalogId = normalizeOptionalString(sectionId.slice(8));
			if (catalogId) canonical = `catalog:${catalogId}`;
		}
		if (!canonical || seen.has(canonical)) continue;
		seen.add(canonical);
		normalized.push(canonical);
	}
	return normalized;
}
function listSessionGroups(env = process.env) {
	return readSessionGroupCatalog(env).groups;
}
function listSessionGroupDefaults(env = process.env) {
	return readSessionGroupCatalog(env).defaults;
}
function listSidebarSectionOrder(env = process.env) {
	return readSessionGroupCatalog(env).sectionOrder;
}
/**
* Replaces the ordered catalog. Dropping a name whose group still has member
* sessions is rejected: member sweeps stay owned by sessions.groups.delete,
* so a put can never leave dangling categories that resurrect the group.
*/
async function putSessionGroups(params) {
	const { cfg, names, sectionOrder, env = process.env } = params;
	await ensureSessionGroupCatalog(env);
	const normalized = normalizeGroupNames(names);
	const normalizedSectionOrder = sectionOrder === void 0 ? void 0 : normalizeSidebarSectionOrder(sectionOrder, normalized);
	const result = await mutateSessionGroupCatalog({
		kind: "put",
		names: normalized,
		sectionOrder: normalizedSectionOrder,
		cfg: {
			agents: cfg.agents,
			session: cfg.session
		}
	}, env, (facts) => {
		params.assertCurrent?.();
		for (const [, targets] of facts?.groups ?? []) for (const target of targets) params.assertTargetCurrent?.(target);
	});
	if (result.nonEmpty?.length) throw new SessionGroupNotEmptyError(result.nonEmpty);
	return result.snapshot.groups;
}
/**
* Absorbs a category assigned through sessions.patch so the catalog keeps
* covering every group an operator UI can observe, appended at the end.
*/
async function ensureSessionGroupRegistered(name, env = process.env) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) return false;
	return (await mutateSessionGroupCatalog({
		kind: "register",
		name: normalized
	}, env)).changed;
}
async function updateSessionGroupDefaults(name, defaults, env = process.env, assertCurrent, cfg = {}) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) throw new Error("group defaults update requires a non-empty name");
	const result = await mutateSessionGroupCatalog({
		kind: "defaults",
		cfg: {
			agents: cfg.agents,
			session: cfg.session
		},
		name: normalized,
		cwd: normalizeOptionalString(defaults.cwd) ?? null,
		worktree: defaults.worktree
	}, env, (facts) => assertCurrent?.(facts?.groups?.find(([group]) => group === normalized)?.[1]));
	return result.changed ? result.snapshot.defaults : null;
}
/**
* Bulk-updates member session categories across every agent store without
* bumping updatedAt: group maintenance must not reshuffle recency ordering.
*/
async function updateMemberCategories(cfg, from, to, env, assertTargetCurrent) {
	let updated = 0;
	const { stores } = await readSessionGroupMembershipInWorker(cfg, env);
	for (const target of stores) updated += await updateSessionGroupCategoriesInWorker({
		scope: {
			...target,
			sessionKey: "",
			env
		},
		from,
		to,
		assertTargetCurrent
	});
	return updated;
}
async function mutateSessionGroup(params, action) {
	const env = params.env ?? process.env;
	await ensureSessionGroupCatalog(env);
	const from = normalizeOptionalString(params.name);
	const to = action === "rename" ? normalizeOptionalString(params.to) : void 0;
	if (!from || action === "rename" && !to) throw new Error(action === "rename" ? "group rename requires non-empty names" : "group delete requires a non-empty name");
	let updatedSessions = 0;
	if (from !== to) {
		params.assertCurrent?.();
		const prepared = await mutateSessionGroupCatalog({
			kind: "prepare",
			name: from,
			to
		}, env, params.assertCurrent);
		if (prepared.missingName) throw new SessionGroupNotFoundError(prepared.missingName);
		const source = prepared.source;
		try {
			updatedSessions = await updateMemberCategories(params.cfg, from, to, env, params.assertTargetCurrent);
			params.assertCurrent?.();
			const retired = await mutateSessionGroupCatalog({
				kind: "retire",
				name: from,
				to,
				source,
				cfg: {
					agents: params.cfg.agents,
					session: params.cfg.session
				}
			}, env, params.assertCurrent);
			if (retired.missingName) throw new SessionGroupNotFoundError(retired.missingName);
		} catch (error) {
			const message = `${formatErrorMessage(error)}. Group changes may be partial; reload groups and retry the same operation.`;
			if (error instanceof SessionMutationAuthorizationChangedError) throw new SessionMutationAuthorizationChangedError({
				...error.error,
				message
			});
			throw new Error(message, { cause: error });
		}
	}
	return {
		groups: listSessionGroups(env),
		sectionOrder: listSidebarSectionOrder(env),
		updatedSessions
	};
}
async function renameSessionGroup(params) {
	return await mutateSessionGroup(params, "rename");
}
async function deleteSessionGroup(params) {
	return await mutateSessionGroup(params, "delete");
}
//#endregion
//#region src/gateway/talk/session-registry.ts
/**
* Process-local registry that lets Talk protocol methods resolve opaque
* `sessionId` values to the concrete relay or managed-room backend.
*/
const unifiedTalkSessions = resolveGlobalMap(Symbol.for("testclaw.unifiedTalkSessions"), "close-and-restart");
const talkConnectionCleanups = resolveGlobalMap(Symbol.for("testclaw.talkConnectionCleanups"), async (connections) => {
	const failures = (await Promise.allSettled([...connections].flatMap(([connId, cleanups]) => [...cleanups].map(async ([kind, cleanup]) => {
		await runTalkConnectionCleanup(connId, kind, cleanup);
	})))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Talk provider cleanup did not complete");
}, "close-and-restart");
function runTalkConnectionCleanup(connId, kind, cleanup) {
	if (cleanup.pending) return cleanup.pending;
	if (talkConnectionCleanups.get(connId)?.get(kind) !== cleanup) return;
	const completion = createDeferredCore();
	cleanup.pending = completion.promise;
	const completed = () => {
		cleanup.pending = void 0;
		cleanup.failed = false;
		const cleanups = talkConnectionCleanups.get(connId);
		if (cleanups?.get(kind) === cleanup) {
			if (cleanup.nextRun) {
				cleanup.run = cleanup.nextRun;
				cleanup.nextRun = void 0;
				return runTalkConnectionCleanup(connId, kind, cleanup);
			}
			cleanups.delete(kind);
			if (cleanups.size === 0 && talkConnectionCleanups.get(connId) === cleanups) talkConnectionCleanups.delete(connId);
		}
	};
	const failed = (error) => {
		cleanup.pending = void 0;
		cleanup.failed = true;
		throw error;
	};
	try {
		const run = cleanup.run;
		const result = run();
		if (isPromiseLike(result)) {
			completion.resolve(Promise.resolve(result).then(completed, failed));
			return completion.promise;
		}
		const next = completed();
		completion.resolve(next);
		return next;
	} catch (error) {
		completion.reject(error);
		completion.promise.catch(() => {});
		return failed(error);
	}
}
/** Keeps failed cleanup under its original owner until a successful retry. */
function registerTalkConnectionCleanup(connId, kind, cleanup) {
	const cleanups = talkConnectionCleanups.get(connId) ?? /* @__PURE__ */ new Map();
	const previous = cleanups.get(kind);
	if (previous?.pending || previous?.failed) previous.nextRun = cleanup;
	else cleanups.set(kind, {
		run: cleanup,
		failed: false
	});
	talkConnectionCleanups.set(connId, cleanups);
}
/** Starts cleanup without blocking the socket callback and reports asynchronous failures. */
function cleanupTalkConnection(connId, log) {
	const cleanups = talkConnectionCleanups.get(connId);
	if (!cleanups) return;
	const snapshot = [...cleanups];
	for (const [kind, cleanup] of snapshot) {
		if (cleanup.pending) continue;
		const report = (error) => {
			log.warn(`failed to run ${kind} Talk cleanup after connection disconnect: ${formatErrorMessage(error)}`);
		};
		try {
			const pending = runTalkConnectionCleanup(connId, kind, cleanup);
			if (pending) pending.catch(report);
		} catch (error) {
			report(error);
		}
	}
}
/** Associates a public Talk session id with its concrete gateway backend. */
function rememberUnifiedTalkSession(sessionId, session) {
	unifiedTalkSessions.set(sessionId, session);
}
/** Resolves a Talk session id or throws the protocol-facing unknown-session error. */
function getUnifiedTalkSession(sessionId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (!session) throw new Error("Unknown Talk session");
	return session;
}
/** Retains the realtime relay's admitted target without reinterpreting current defaults. */
function resolveUnifiedTalkSessionTarget(sessionId, connId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (session?.kind !== "realtime-relay") return;
	requireUnifiedTalkSessionConn(session, connId);
	const target = session.sessionTarget;
	return {
		target,
		isCurrent: () => unifiedTalkSessions.get(sessionId) === session && session.connId === connId && session.sessionTarget === target
	};
}
/** Removes a Talk session id after the concrete backend closes. */
function forgetUnifiedTalkSession(sessionId) {
	unifiedTalkSessions.delete(sessionId);
}
/** Enforces that a relay-backed Talk session is controlled by its owner socket. */
function requireUnifiedTalkSessionConn(session, connId) {
	if (!connId || session.connId !== connId) throw new Error("Talk session is not owned by this connection");
	return connId;
}
//#endregion
//#region src/gateway/session-sharing-target-input.ts
function resolveDirectSessionTargets(method, params) {
	if (method === "sessions.create" || method === "sessions.list") return [];
	if (!params || typeof params !== "object" || Array.isArray(params)) return [];
	const record = params;
	const candidates = [record.key, record.sessionKey];
	if (method.startsWith("sessions.") && Array.isArray(record.keys)) candidates.push(...record.keys);
	if (Array.isArray(record.sessionKeys)) candidates.push(...record.sessionKeys);
	const agentId = normalizeOptionalString(record.agentId);
	return candidates.flatMap((candidate) => typeof candidate === "string" ? [{
		sessionKey: candidate,
		...agentId ? { agentId } : {}
	}] : []);
}
function resolveDirectIncognitoTargets(method, params) {
	return resolveDirectSessionTargets(method, params).filter((target) => isIncognitoSessionKey(canonicalizeSessionKeyForAgent(target.agentId ?? "main", target.sessionKey)));
}
function readSessionSharingStringParam(params, key) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	return normalizeOptionalString(params[key]);
}
function preparedGroupTargets(context) {
	const projection = getSessionRowProjection(context);
	if (!projection) throw new Error("Session group membership is unavailable during Gateway startup");
	return projection.sessionGroupTargets();
}
function resolveSessionGroupMutationTargets(params) {
	const groupName = readSessionSharingStringParam(params.requestParams, "name");
	return groupName ? [...preparedGroupTargets(params.context).get(groupName) ?? []] : void 0;
}
function resolveSessionGroupsPutMutationTargets(context, requestParams) {
	const names = requestParams && typeof requestParams === "object" && "names" in requestParams ? requestParams.names : void 0;
	if (!Array.isArray(names)) return;
	const requested = new Set(normalizeGroupNames(names.filter((name) => typeof name === "string")));
	const dropped = listSessionGroups().map((group) => group.name).filter((name) => !requested.has(name));
	if (dropped.length === 0) return [];
	const byName = preparedGroupTargets(context);
	return dropped.flatMap((name) => byName.get(name) ?? []);
}
function resolveApprovalSessionTarget(method, params, context) {
	const id = readSessionSharingStringParam(params, "id");
	if (!id) return;
	const kind = readSessionSharingStringParam(params, "kind");
	const manager = method === "plugin.approval.resolve" || kind === "plugin" ? context.pluginApprovalManager : method === "approval.resolve" && kind === "system-agent" ? context.systemAgentApprovalManager : context.execApprovalManager;
	const resolvedId = manager?.lookupLocalApprovalId(id, { includeResolved: true });
	const recordId = resolvedId?.kind === "exact" || resolvedId?.kind === "prefix" ? resolvedId.id : id;
	const request = manager?.getLocalSnapshot(recordId)?.request;
	const sessionKey = readSessionSharingStringParam(request, "sessionKey");
	const agentId = readSessionSharingStringParam(request, "agentId");
	return sessionKey ? {
		sessionKey,
		...agentId ? { agentId } : {}
	} : void 0;
}
/** Realtime creates authorize their effective default; transcription stays sessionless. */
function resolveTalkSessionTargetInput(method, params, connId) {
	if (method === "talk.session.steer") {
		const sessionId = readSessionSharingStringParam(params, "sessionId");
		const retained = sessionId ? resolveUnifiedTalkSessionTarget(sessionId, connId) : void 0;
		return retained ? {
			kind: "relay",
			...retained
		} : void 0;
	}
	if (method !== "talk.client.create" && method !== "talk.client.toolCall" && method !== "talk.session.create" && method !== "talk.client.transcript" && method !== "talk.client.close" && method !== "talk.client.steer") return;
	const sessionKey = readSessionSharingStringParam(params, "sessionKey");
	if (sessionKey) return {
		kind: "request",
		sessionKey
	};
	if (method === "talk.client.create") return { kind: "request" };
	if (method === "talk.session.create" && (readSessionSharingStringParam(params, "mode") ?? "realtime") === "realtime" && readSessionSharingStringParam(params, "transport") !== "managed-room") return { kind: "request" };
}
function resolveSessionMutationTargets(params) {
	if (params.method === "sessions.patchMany") {
		const targets = params.requestParams && typeof params.requestParams === "object" && "targets" in params.requestParams ? params.requestParams.targets : void 0;
		return Array.isArray(targets) ? targets.slice(0, 101).flatMap((target) => {
			const sessionKey = readSessionSharingStringParam(target, "key");
			const agentId = readSessionSharingStringParam(target, "agentId");
			return sessionKey ? [{
				sessionKey,
				...agentId ? { agentId } : {}
			}] : [];
		}) : void 0;
	}
	if (params.method === "sessions.groups.rename" || params.method === "sessions.groups.delete" || params.method === "sessions.groups.update") return resolveSessionGroupMutationTargets({
		context: params.context,
		requestParams: params.requestParams
	});
	if (params.method === "sessions.groups.put") return resolveSessionGroupsPutMutationTargets(params.context, params.requestParams);
	if (isApprovalSessionTargetMethod(params.method)) {
		const target = resolveApprovalSessionTarget(params.method, params.requestParams, params.context);
		return target ? [target] : void 0;
	}
	const requestedAgentId = readSessionSharingStringParam(params.requestParams, "agentId");
	const directTargets = [];
	for (const field of sessionMutationTargetFields(params.method)) {
		const sessionKey = readSessionSharingStringParam(params.requestParams, field);
		if (!sessionKey) continue;
		const parentUsesRequestedAgent = field !== "parentSessionKey" || ["global", "unknown"].includes(sessionKey.toLowerCase());
		directTargets.push({
			sessionKey,
			...requestedAgentId && parentUsesRequestedAgent ? { agentId: requestedAgentId } : {}
		});
	}
	if (directTargets.length) return directTargets;
	if (params.method === "board.event" || params.method === "board.action") {
		const ticket = readSessionSharingStringParam(params.requestParams, "ticket");
		const claims = ticket ? resolveAuthorizedBoardViewTicketClaims(ticket, { gatewayContext: params.context }) : void 0;
		if (!claims || requestedAgentId && requestedAgentId !== claims.agentId) return;
		return [{
			sessionKey: claims.sessionKey,
			...claims.agentId ? { agentId: claims.agentId } : {}
		}];
	}
	if (params.method !== "sessions.abort") return;
	const runId = readSessionSharingStringParam(params.requestParams, "runId");
	const run = runId ? params.context.chatAbortControllers.get(runId) : void 0;
	return run ? [{
		sessionKey: run.sessionKey,
		...run.agentId ? { agentId: run.agentId } : {}
	}] : void 0;
}
//#endregion
//#region src/talk/agent-target.ts
/** Agent-scoped keys own their Talk session; legacy/unscoped aliases use the Talk target. */
function resolveTalkSessionAgentId(config, sessionKey) {
	const normalizedSessionKey = sessionKey ?? void 0;
	const scopedAgentId = parseAgentSessionKey(normalizedSessionKey)?.agentId;
	if (scopedAgentId) return normalizeAgentId(scopedAgentId);
	return resolvePersistedSessionStoreOwnerForKey(config, normalizedSessionKey).kind === "none" ? resolveAmbientOwnerAgentId(config, config.talk?.agentId, {
		surface: "Talk session ownership",
		hint: "Set talk.agentId to the agent that owns unscoped Talk sessions."
	}) : resolveSessionAgentId({
		config,
		sessionKey: normalizedSessionKey
	});
}
//#endregion
//#region src/gateway/talk/session-target.ts
function requirePreparedTalkSessionTarget(target) {
	if (!target) throw new Error("Talk session target was not prepared by the Gateway");
	return target;
}
/** Resolve Talk ownership before aliases collapse, then retain the exact storage target. */
function prepareTalkSessionTarget(cfg, requestedSessionKey) {
	const requestedKey = normalizeOptionalString(requestedSessionKey);
	const owner = resolveTalkSessionAgentId(cfg, requestedKey ?? "main");
	const sessionKey = requestedKey ?? resolveAgentMainSessionKey({
		cfg,
		agentId: owner
	});
	const { agentId, canonicalKey, storePath } = resolveTalkSessionStorageTarget(cfg, sessionKey, owner);
	return Object.freeze({
		agentId,
		sessionKey,
		canonicalKey,
		storePath
	});
}
/** Revalidate a retained owner without consulting the current ambient Talk default. */
function assertTalkSessionStorageTarget(cfg, target) {
	const current = resolveTalkSessionStorageTarget(cfg, target.canonicalKey, target.agentId);
	if (current.agentId !== target.agentId || current.canonicalKey !== target.canonicalKey || current.storePath !== target.storePath) throw new Error("Talk session storage target changed; retry the request");
}
function resolveTalkSessionStorageTarget(cfg, sessionKey, owner) {
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg,
		sessionKey,
		agentId: resolveConfiguredAgentId(cfg, owner)
	});
	return {
		agentId,
		canonicalKey,
		storePath: resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: canonicalKey,
			agentId,
			readOnly: true,
			exactRead: true
		}).storePath
	};
}
//#endregion
//#region src/gateway/session-sharing.ts
function sessionMutationTargetChanged(method, sessionKey) {
	return new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, `session changed before ${method}; retry the request`, { details: {
		code: "SESSION_MUTATION_AUTHORIZATION_CHANGED",
		method,
		sessionKey
	} }));
}
function expectedSessionMutationTargetError(expected, target, method) {
	return expected && (!target || target.agentId !== expected.agentId || target.canonicalKey !== expected.sessionKey || target.storePath !== expected.storePath || target.entry.sessionId?.trim() !== expected.sessionId) ? sessionMutationTargetChanged(method, expected.sessionKey).error : null;
}
const VISIBILITY_AUTHORIZED_METHODS = /* @__PURE__ */ new Set(["sessions.assignOwner"]);
function resolveSessionMutationAuthorization(params) {
	const authorizesAgentRun = isAgentRunStartMethod(params.method, params.requestParams);
	const bindsProgressLifecycle = params.method === "progressCard.put" || params.method === "progressCard.refresh";
	const adminBypass = isGatewayAdmin(params.client) && !authorizesAgentRun;
	if (adminBypass && !bindsProgressLifecycle && !params.expectedTarget) return { error: null };
	if (!adminBypass && isGatewayClientProfilePending(params.client) && isSessionProfileDependentMethod(params.method)) return { error: authenticatedProfileUnavailableError() };
	if (params.method === "sessions.describe") {
		const projection = params.sessionRowRead ?? getSessionRowProjection(params.context);
		if (projection) {
			const { cfg } = projection.state;
			for (const target of resolveDirectSessionTargets(params.method, params.requestParams)) {
				const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
				if (!agent.ok) return { error: agent.error };
				const row = projection.describe({
					key: target.sessionKey,
					agentId: agent.agentId
				});
				const sharing = prepareProjectedSessionSharing({
					cfg,
					client: params.client,
					isMember: (_target, identityId) => row?.membership.has(identityId) ?? false
				});
				if (row && gatewayClientSessionCreator(params.client) && sharing.sessionCap === "none" && !sharing.isCreator(row.entry.createdActor)) return { error: hiddenSessionNotFound(target.sessionKey) };
			}
		}
		return { error: null };
	}
	if (params.method === "sessions.list") return { error: null };
	let cachedCfg;
	const getCfg = () => cachedCfg ??= params.context.getRuntimeConfig();
	const createLookupCaches = () => ({
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	});
	let lookupCaches;
	const resolveAuthorizedTarget = (targetRef, targetCount) => {
		const input = resolveRequestedSessionAgentInput(targetRef.sessionKey, targetRef.agentId);
		if (!input.ok) return { error: input.error };
		try {
			return { target: resolveSessionSharingTarget({
				cfg: getCfg(),
				sessionKey: targetRef.sessionKey,
				agentId: input.value,
				...lookupCaches ??= createLookupCaches(),
				exactRead: targetCount === 1
			}) };
		} catch (error) {
			if (error instanceof AgentSelectionRequiredError) return { error: errorShape(ErrorCodes.INVALID_REQUEST, error.message) };
			throw error;
		}
	};
	let talkInput;
	let talkSessionTarget;
	try {
		talkInput = resolveTalkSessionTargetInput(params.method, params.requestParams, params.client?.connId);
		if (talkInput?.kind === "relay") {
			assertTalkSessionStorageTarget(getCfg(), talkInput.target);
			talkSessionTarget = talkInput.target;
		} else talkSessionTarget = talkInput && prepareTalkSessionTarget(getCfg(), talkInput.sessionKey);
	} catch (error) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(error instanceof Error ? error.message : error)) };
	}
	const talkTargets = talkSessionTarget ? [{
		sessionKey: talkSessionTarget.canonicalKey,
		agentId: talkSessionTarget.agentId
	}] : void 0;
	const directTargets = talkTargets ?? resolveDirectSessionTargets(params.method, params.requestParams);
	const hidesForeignSessions = !adminBypass && directTargets.length > 0 && gatewayClientSessionCreator(params.client) && operatorSessionCap(params.client, getCfg()) === "none";
	const protectedTargets = hidesForeignSessions ? directTargets : talkTargets?.filter((target) => isIncognitoSessionKey(target.sessionKey)) ?? resolveDirectIncognitoTargets(params.method, params.requestParams);
	for (const targetRef of protectedTargets) {
		const resolved = resolveAuthorizedTarget(targetRef, protectedTargets.length);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error) return { error };
		if (hidesForeignSessions && target && !isSessionCreatorProfile(target.entry.createdActor, params.client?.authenticatedUserProfile?.profileId)) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
	}
	const bindsOwnProfile = params.sessionScope === "operator.sessions.write";
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const ownSessionProfileId = bindsOwnProfile && actor?.kind === "operator" ? actor.profileId : void 0;
	const ownProfileError = bindsOwnProfile ? ownSessionProfileId ? authorizeOwnSessionMutation({
		client: params.client,
		target: null,
		expectedProfileId: ownSessionProfileId
	}) : authenticatedProfileUnavailableError() : null;
	if (ownProfileError) return { error: ownProfileError };
	const requestedCreateKey = params.requestParams && typeof params.requestParams === "object" && "key" in params.requestParams ? normalizeOptionalString(params.requestParams.key) : void 0;
	const permitsGeneratedSession = params.method === "sessions.create" && !requestedCreateKey;
	const targetRefs = talkTargets ?? resolveSessionMutationTargets({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		getCfg
	}) ?? (bindsOwnProfile && !isRequiredSessionTargetMethod(params.method) ? [] : void 0);
	if (params.expectedTarget && targetRefs?.length !== 1) return { error: sessionMutationTargetChanged(params.method, params.expectedTarget.sessionKey).error };
	if (!targetRefs) {
		if (isRequiredSessionTargetMethod(params.method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, "session mutation target is unavailable", { details: {
			code: "SESSION_MUTATION_TARGET_REQUIRED",
			method: params.method
		} }) };
		return { error: null };
	}
	if (talkSessionTarget && authorizesAgentRun) {
		const error = authorizeGatewaySessionCreation({
			cfg: getCfg(),
			client: params.client,
			agentId: talkSessionTarget.agentId
		});
		if (error) return { error };
	}
	const authorizedTargets = [];
	for (const targetRef of targetRefs) {
		const resolved = resolveAuthorizedTarget(targetRef, targetRefs.length);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = expectedSessionMutationTargetError(params.expectedTarget, target, params.method) ?? authorizeOwnSessionMutation({
			client: params.client,
			target,
			expectedProfileId: ownSessionProfileId
		}) ?? (target && authorizesAgentRun ? authorizeSessionAgentRun({
			cfg: getCfg(),
			client: params.client,
			target
		}) : null) ?? authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		}) ?? (target && !(VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (operatorSessionCap(params.client, getCfg()) ?? "write") === "write") ? authorizeSessionSharingTarget({
			cfg: getCfg(),
			client: params.client,
			target
		}) : null);
		if (error) return { error };
		authorizedTargets.push({
			...targetRef,
			resolved: target ? {
				agentId: target.agentId,
				canonicalKey: target.canonicalKey,
				storeKey: target.storeKey,
				storePath: target.storePath
			} : null,
			sessionId: target?.entry.sessionId?.trim() || null,
			...!target && ["sessions.send", "sessions.create"].includes(params.method) ? { absentTarget: resolveGatewaySessionStoreTarget({
				cfg: getCfg(),
				key: targetRef.sessionKey,
				agentId: targetRef.agentId
			}) } : {},
			...bindsProgressLifecycle || bindsOwnProfile ? { lifecycleRevision: target?.entry.lifecycleRevision } : {}
		});
	}
	return {
		error: null,
		authorization: (() => {
			const targetChanged = (sessionKey) => sessionMutationTargetChanged(params.method, sessionKey);
			const assertTalkTargetCurrent = (cfg) => {
				if (!talkInput || !talkSessionTarget) return;
				let current;
				try {
					if (talkInput.kind === "relay") {
						if (!talkInput.isCurrent()) throw targetChanged(talkSessionTarget.sessionKey);
						assertTalkSessionStorageTarget(cfg, talkSessionTarget);
						current = talkSessionTarget;
					} else current = prepareTalkSessionTarget(cfg, talkInput.sessionKey);
				} catch {
					throw targetChanged(talkSessionTarget.sessionKey);
				}
				if (current.agentId !== talkSessionTarget.agentId || current.sessionKey !== talkSessionTarget.sessionKey || current.canonicalKey !== talkSessionTarget.canonicalKey || current.storePath !== talkSessionTarget.storePath) throw targetChanged(talkSessionTarget.sessionKey);
				const error = authorizesAgentRun && authorizeGatewaySessionCreation({
					cfg,
					client: params.client,
					agentId: current.agentId
				});
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			const assertTargetCurrent = (targetRef, expected, currentCfg, currentLookupCaches, ensuredSessionId) => {
				if (expected?.absentTarget && !expected.created) {
					const currentRoute = resolveGatewaySessionStoreTarget({
						cfg: currentCfg,
						key: targetRef.sessionKey,
						agentId: targetRef.agentId
					});
					if (currentRoute.agentId !== expected.absentTarget.agentId || currentRoute.canonicalKey !== expected.absentTarget.canonicalKey || currentRoute.storePath !== expected.absentTarget.storePath) throw targetChanged(targetRef.sessionKey);
				}
				const current = resolveSessionSharingTarget({
					cfg: currentCfg,
					sessionKey: targetRef.sessionKey,
					agentId: targetRef.agentId,
					...currentLookupCaches,
					exactRead: !currentLookupCaches || authorizedTargets.length === 1
				});
				const ensuredTarget = talkSessionTarget && authorizesAgentRun && expected?.sessionId === null && ensuredSessionId ? {
					agentId: talkSessionTarget.agentId,
					canonicalKey: talkSessionTarget.canonicalKey,
					storeKey: talkSessionTarget.canonicalKey,
					storePath: talkSessionTarget.storePath
				} : void 0;
				const expectedResolved = expected?.resolved ?? ensuredTarget;
				const expectedSessionId = expected?.sessionId ?? (ensuredTarget ? ensuredSessionId : null);
				if (!(expected !== void 0 && (current === null ? expected.resolved === null && !ensuredSessionId : expectedResolved !== void 0 && expectedResolved !== null && current.agentId === expectedResolved.agentId && current.canonicalKey === expectedResolved.canonicalKey && current.storeKey === expectedResolved.storeKey && current.storePath === expectedResolved.storePath && (current.entry.sessionId?.trim() || null) === expectedSessionId && (!(bindsProgressLifecycle || bindsOwnProfile || expected.created) || current.entry.lifecycleRevision === expected.lifecycleRevision)))) throw targetChanged(targetRef.sessionKey);
				const ownershipError = authorizeOwnSessionMutation({
					client: params.client,
					target: current,
					expectedProfileId: ownSessionProfileId
				});
				if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
				if (!current) return;
				const visibilityAuthorized = VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (operatorSessionCap(params.client, currentCfg) ?? "write") === "write";
				const error = (authorizesAgentRun ? authorizeSessionAgentRun({
					cfg: currentCfg,
					client: params.client,
					target: current
				}) : null) ?? authorizeIncognitoSessionTarget({
					client: params.client,
					sessionKey: targetRef.sessionKey,
					target: current
				}) ?? (visibilityAuthorized ? null : authorizeSessionSharingTarget({
					cfg: currentCfg,
					client: params.client,
					target: current
				}));
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			let createdSessionRecorded = false;
			return {
				...talkSessionTarget ? { talkSessionTarget } : {},
				...authorizedTargets.length === 1 && authorizedTargets[0]?.resolved && authorizedTargets[0].sessionId ? { admittedTarget: Object.freeze({
					agentId: authorizedTargets[0].resolved.agentId,
					sessionKey: authorizedTargets[0].resolved.canonicalKey,
					sessionId: authorizedTargets[0].sessionId
				}) } : {},
				recordCreatedSession: (created) => {
					if (createdSessionRecorded) return;
					let expected = authorizedTargets.find((target) => target.sessionId === null && target.absentTarget?.agentId === created.agentId && target.absentTarget.canonicalKey === created.sessionKey && target.absentTarget.storePath === created.storePath);
					if (!expected && permitsGeneratedSession) {
						expected = {
							sessionKey: created.sessionKey,
							agentId: created.agentId,
							resolved: null,
							sessionId: null
						};
						authorizedTargets.push(expected);
					}
					if (!expected) return;
					createdSessionRecorded = true;
					expected.resolved = {
						agentId: created.agentId,
						canonicalKey: created.sessionKey,
						storeKey: created.sessionKey,
						storePath: created.storePath
					};
					expected.sessionId = created.sessionId;
					expected.lifecycleRevision = created.lifecycleRevision;
					expected.created = true;
				},
				assertCurrent: () => {
					const error = ownSessionProfileId ? authorizeOwnSessionMutation({
						client: params.client,
						target: null,
						expectedProfileId: ownSessionProfileId
					}) : null;
					if (error) throw new SessionMutationAuthorizationChangedError(error);
					const currentCfg = params.context.getRuntimeConfig();
					assertTalkTargetCurrent(currentCfg);
					const currentLookupCaches = createLookupCaches();
					for (const authorized of authorizedTargets) assertTargetCurrent(authorized, authorized, currentCfg, currentLookupCaches);
				},
				assertTargetCurrent: (targetRef) => {
					const sessionKey = normalizeOptionalString(targetRef.sessionKey);
					const agentId = normalizeOptionalString(targetRef.agentId);
					const normalizedTarget = {
						sessionKey: sessionKey ?? targetRef.sessionKey,
						agentId
					};
					const expected = authorizedTargets.find((target) => target.sessionKey === sessionKey && target.agentId === agentId);
					const currentCfg = params.context.getRuntimeConfig();
					assertTalkTargetCurrent(currentCfg);
					assertTargetCurrent(normalizedTarget, expected, currentCfg, void 0, targetRef.ensuredSessionId);
				}
			};
		})()
	};
}
//#endregion
export { updateSessionGroupDefaults as C, prepareProjectedSessionSharing as D, createSessionListEntryFilter as E, prepareSessionSharing as O, renameSessionGroup as S, createProfileSessionEntryFilter as T, ensureSessionGroupRegistered as _, resolveTalkSessionAgentId as a, listSidebarSectionOrder as b, cleanupTalkConnection as c, registerTalkConnectionCleanup as d, rememberUnifiedTalkSession as f, deleteSessionGroup as g, SessionGroupNotFoundError as h, requirePreparedTalkSessionTarget as i, invalidateSessionSharingSnapshot as k, forgetUnifiedTalkSession as l, SessionGroupNotEmptyError as m, assertTalkSessionStorageTarget as n, resolveDirectIncognitoTargets as o, requireUnifiedTalkSessionConn as p, prepareTalkSessionTarget as r, resolveDirectSessionTargets as s, resolveSessionMutationAuthorization as t, getUnifiedTalkSession as u, listSessionGroupDefaults as v, canReceiveSessionEvent as w, putSessionGroups as x, listSessionGroups as y };
