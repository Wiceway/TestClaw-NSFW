import "./src-D9uQ497Z.js";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-DsCfAx8q.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { n as readSqliteDataVersion } from "./node-sqlite-9ThoWRzf.js";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-Cresg45I.js";
import "./sqlite-live-snapshot-C0XwFcJs.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-CEtGy7Vi.js";
import "./device-bootstrap-profile-Cn--rVH7.js";
import { r as isNodeHostStats } from "./node-host-stats-DXsxLJ2U.js";
import { t as clearApnsRegistrationFromDatabase } from "./push-apns-store-transaction-Da6WAFY6.js";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-CUqRhO7l.js";
import { r as pruneExpiredPending } from "./pairing-files-DQj3LJmV.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
//#region src/infra/device-pairing-store-cache.ts
const cache = resolveGlobalSingleton(Symbol.for("testclaw.devicePairingStoreCache"), () => ({ value: void 0 }));
function invalidateDevicePairingStoreCache(database) {
	if (cache.value?.connection === database.db && cache.value.path === database.path) cache.value = void 0;
}
/** A content revision is comparable across reader and writer connections. */
function resolveDevicePairingStoreRevision(paired) {
	return createHash("sha256").update(JSON.stringify(Object.values(paired).toSorted((a, b) => a.deviceId < b.deviceId ? -1 : a.deviceId > b.deviceId ? 1 : 0))).digest("hex");
}
/** Borrowed worker facts; projections must not mutate this revision's cached rows. */
function readCachedDevicePairingStoreSnapshot(db, path, read) {
	if (db.isTransaction) {
		const state = read();
		return {
			state,
			revision: resolveDevicePairingStoreRevision(state.pairedByDeviceId)
		};
	}
	const dataVersion = readSqliteDataVersion(db);
	const cached = cache.value;
	if (cached?.connection === db && cached.path === path && cached.dataVersion === dataVersion) return cached;
	const state = runSqliteDeferredTransactionSync(db, read);
	const revision = resolveDevicePairingStoreRevision(state.pairedByDeviceId);
	cache.value = {
		connection: db,
		path,
		state,
		dataVersion,
		revision
	};
	return cache.value;
}
//#endregion
//#region src/infra/device-pairing-store.ts
const boundDatabase = new AsyncLocalStorage();
/** Route an explicit pairing base dir (tests, alternate state roots) to that dir's DB. */
function resolveDevicePairingStateDbOptions(baseDir) {
	const database = boundDatabase.getStore();
	if (database) return {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	};
	return baseDir ? { env: {
		...process.env,
		TESTCLAW_STATE_DIR: baseDir
	} } : {};
}
function runDevicePairingStoreMutation(baseDir, mutate) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openAssistantStateDatabase(databaseOptions);
	return runAssistantStateWriteTransaction((transactionDatabase) => {
		const result = mutate(transactionDatabase);
		if (result.mutated) stageSqliteTransactionState(transactionDatabase.db, {
			stage: () => void 0,
			rollback: () => void 0,
			commit: () => invalidateDevicePairingStoreCache(transactionDatabase)
		});
		return result.value;
	}, {
		...databaseOptions,
		database
	});
}
const APPROVAL_KINDS = new Set(Object.keys({
	owner: true,
	silent: true,
	"trusted-cidr": true,
	"trusted-proxy": true,
	"ssh-verified": true,
	bootstrap: true
}));
function toJsonColumn(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function fromJsonColumn(value) {
	return value === null ? void 0 : JSON.parse(value);
}
function toBooleanColumn(value) {
	return value === void 0 ? null : value ? 1 : 0;
}
function optional(key, value) {
	return value === null ? {} : { [key]: value };
}
function toPendingRow(record) {
	return {
		request_id: record.requestId,
		device_id: record.deviceId,
		public_key: record.publicKey,
		display_name: record.displayName ?? null,
		platform: record.platform ?? null,
		device_family: record.deviceFamily ?? null,
		client_id: record.clientId ?? null,
		client_mode: record.clientMode ?? null,
		browser_origin: record.browserOrigin ?? null,
		role: record.role ?? null,
		roles_json: toJsonColumn(record.roles),
		scopes_json: toJsonColumn(record.scopes),
		remote_ip: record.remoteIp ?? null,
		silent: toBooleanColumn(record.silent),
		is_repair: toBooleanColumn(record.isRepair),
		ts: record.ts,
		refreshed_at_ms: record.refreshedAtMs ?? null
	};
}
function fromPendingRow(row) {
	return {
		requestId: row.request_id,
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("silent", row.silent === null ? null : row.silent !== 0),
		...optional("isRepair", row.is_repair === null ? null : row.is_repair !== 0),
		ts: row.ts,
		...optional("refreshedAtMs", row.refreshed_at_ms)
	};
}
function toPairedRow(device) {
	return {
		device_id: device.deviceId,
		public_key: device.publicKey,
		display_name: device.displayName ?? null,
		operator_label: device.operatorLabel ?? null,
		platform: device.platform ?? null,
		device_family: device.deviceFamily ?? null,
		client_id: device.clientId ?? null,
		client_mode: device.clientMode ?? null,
		browser_origin: device.browserOrigin ?? null,
		role: device.role ?? null,
		roles_json: toJsonColumn(device.roles),
		scopes_json: toJsonColumn(device.scopes),
		approved_scopes_json: toJsonColumn(device.approvedScopes),
		remote_ip: device.remoteIp ?? null,
		tokens_json: toJsonColumn(device.tokens),
		approved_via: device.approvedVia ?? null,
		node_surface_json: toJsonColumn(device.nodeSurface),
		pending_node_surface_json: toJsonColumn(device.pendingNodeSurface),
		created_at_ms: device.createdAtMs,
		approved_at_ms: device.approvedAtMs,
		last_seen_at_ms: device.lastSeenAtMs ?? null,
		last_seen_reason: device.lastSeenReason ?? null
	};
}
function fromApprovedViaColumn(value) {
	return value !== null && APPROVAL_KINDS.has(value) ? value : null;
}
new Set(Object.keys({
	full: true,
	limited: true,
	node: true
}));
function fromPairedRow(row) {
	const nodeSurface = fromJsonColumn(row.node_surface_json);
	if (nodeSurface?.lastHostStats !== void 0 && !isNodeHostStats(nodeSurface.lastHostStats)) delete nodeSurface.lastHostStats;
	return {
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("operatorLabel", row.operator_label),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("approvedScopes", fromJsonColumn(row.approved_scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("tokens", fromJsonColumn(row.tokens_json) ?? null),
		...optional("approvedVia", fromApprovedViaColumn(row.approved_via)),
		...optional("nodeSurface", nodeSurface ?? null),
		...optional("pendingNodeSurface", fromJsonColumn(row.pending_node_surface_json) ?? null),
		createdAtMs: row.created_at_ms,
		approvedAtMs: row.approved_at_ms,
		...optional("lastSeenAtMs", row.last_seen_at_ms),
		...optional("lastSeenReason", row.last_seen_reason)
	};
}
function readDevicePairingStoreStateFromDatabase(db) {
	const kysely = getNodeSqliteKysely(db);
	const pendingById = {};
	for (const row of executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_pending").selectAll()).rows) pendingById[row.request_id] = fromPendingRow(row);
	return {
		pendingById,
		pairedByDeviceId: Object.fromEntries(executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_paired").selectAll()).rows.map((row) => [row.device_id, fromPairedRow(row)]))
	};
}
/** Load the full pending + paired device snapshot from the shared state DB. */
function loadDevicePairingStoreState(baseDir) {
	const database = openAssistantStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	return structuredClone(readCachedDevicePairingStoreSnapshot(database.db, database.path, () => readDevicePairingStoreStateFromDatabase(database.db)).state);
}
/** Replace the pending and/or paired table contents with the given snapshot. */
function persistDevicePairingStoreState(state, baseDir, target, options) {
	runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		if (target !== "paired") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_pending"));
			const rows = Object.values(state.pendingById).map(toPendingRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_pending").values(rows));
		}
		if (target !== "pending") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_paired"));
			const rows = Object.values(state.pairedByDeviceId).map(toPairedRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_paired").values(rows));
		}
		for (const nodeId of new Set(options?.clearApnsNodeIds ?? [])) clearApnsRegistrationFromDatabase(db, nodeId);
		if (options?.retiredNodeToken) clearDeviceAuthTokenFromDatabase(db, {
			...options.retiredNodeToken,
			role: "node"
		});
		return {
			mutated: true,
			value: void 0
		};
	});
}
//#endregion
//#region src/infra/device-pairing-state.kernel.ts
const DEVICE_PAIRING_PENDING_TTL_MS = 3e5;
function pruneExpiredDevicePairingRequests(state, nowMs) {
	pruneExpiredPending(state.pendingById, nowMs, DEVICE_PAIRING_PENDING_TTL_MS);
}
/** Read authoritative rows inside the worker transaction or an admitted migration. */
function loadDevicePairingStateForMutation(nowMs, baseDir) {
	const state = loadDevicePairingStoreState(baseDir);
	pruneExpiredDevicePairingRequests(state, nowMs);
	return state;
}
/** Resolve the expiry timestamp for one pending device-pairing request. */
function resolvePairingRequestExpiry(timestampMs) {
	return timestampMs + DEVICE_PAIRING_PENDING_TTL_MS;
}
/** Normalize one requested or approved pairing role. */
function normalizeDevicePairingRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
/** Merge pairing roles while preserving first-seen order. */
function mergeDevicePairingRoles(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	if (roles.size === 0) return;
	return [...roles];
}
//#endregion
//#region src/infra/device-pairing-identity.ts
function listActiveTokenRoles(tokens) {
	if (!tokens) return;
	return mergeDevicePairingRoles(Object.values(tokens).filter((entry) => !entry.revokedAtMs).map((entry) => entry.role));
}
/** List the durable roles an owner approved for a paired device record. */
function listApprovedPairedDeviceRoles(device) {
	return mergeDevicePairingRoles(device.roles, device.role) ?? [];
}
/** List active-token roles, bounded by the durable approved pairing roles. */
function listEffectivePairedDeviceRoles(device) {
	const activeTokenRoles = listActiveTokenRoles(device.tokens);
	if (activeTokenRoles && activeTokenRoles.length > 0) {
		const approvedRoles = new Set(listApprovedPairedDeviceRoles(device));
		return activeTokenRoles.filter((role) => approvedRoles.has(role));
	}
	return [];
}
/** Return whether a paired device currently has an active token for one role. */
function hasEffectivePairedDeviceRole(device, role) {
	const normalized = normalizeDevicePairingRole(role);
	if (!normalized) return false;
	return listEffectivePairedDeviceRoles(device).includes(normalized);
}
/** Resolve the authenticated node pairing independently of surface approval. */
function resolveNodePairingIdentity(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node")) return null;
	const nodeToken = device.tokens?.node;
	if (!nodeToken) return null;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken.token,
		nodeToken.createdAtMs,
		nodeToken.rotatedAtMs ?? "",
		nodeToken.revokedAtMs ?? ""
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Resolve the durable node-owned identity used to admit asynchronous work. */
function resolveNodePairingGeneration(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node") || !device.nodeSurface) return null;
	const nodeToken = device.tokens?.node;
	const nodeSurface = device.nodeSurface;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken?.token ?? "",
		nodeToken?.revokedAtMs ?? "",
		nodeSurface.createdAtMs,
		nodeSurface.approvedAtMs
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Clear node runtime facts when their owning pairing generation changes. */
function clearNodePairingGenerationState(device, previousGeneration) {
	const nextGeneration = resolveNodePairingGeneration(device);
	if (previousGeneration?.key === nextGeneration?.key || !device.nodeSurface) return;
	delete device.nodeSurface.bins;
	delete device.nodeSurface.sessionHost;
}
/** Resolve connection identity and optional approved surface generation from one row. */
function resolveNodePairingState(device) {
	const identity = resolveNodePairingIdentity(device);
	if (!identity) return null;
	return {
		identity,
		generation: resolveNodePairingGeneration(device)
	};
}
//#endregion
export { resolveNodePairingGeneration as a, resolvePairingRequestExpiry as c, listEffectivePairedDeviceRoles as i, persistDevicePairingStoreState as l, hasEffectivePairedDeviceRole as n, resolveNodePairingState as o, listApprovedPairedDeviceRoles as r, loadDevicePairingStateForMutation as s, clearNodePairingGenerationState as t, readDevicePairingStoreStateFromDatabase as u };
