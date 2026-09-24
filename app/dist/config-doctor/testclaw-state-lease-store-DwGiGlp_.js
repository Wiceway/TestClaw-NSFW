import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BrVKCISp.js";
import { hostname } from "node:os";
//#region src/infra/state-lease-process-owner.ts
function parseStateLeaseProcessOwner(payloadJson) {
	if (!payloadJson) return null;
	let owner;
	try {
		const parsed = JSON.parse(payloadJson);
		owner = isRecord(parsed) ? parsed.owner : null;
	} catch {
		return null;
	}
	if (!isRecord(owner)) return null;
	const { pid, host, startedAt } = owner;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0 || typeof host !== "string" || !host || startedAt !== null && (typeof startedAt !== "number" || !Number.isSafeInteger(startedAt) || startedAt < 0)) return null;
	return {
		pid,
		host,
		startedAt
	};
}
function readStateLeaseProcessOwnerStatus(owner) {
	if (!owner || owner.host !== hostname()) return "unknown";
	if (isPidDefinitelyDead(owner.pid)) return "dead";
	const currentStartedAt = getFileLockProcessStartTime(owner.pid);
	if (owner.startedAt === null || currentStartedAt === null) return "unknown";
	return currentStartedAt === owner.startedAt ? "live" : "dead";
}
//#endregion
//#region src/state/testclaw-state-lease-store.ts
/** The caller owns the write transaction; only absent or expired leases can be acquired. */
function acquireAssistantStateLeaseInTransaction(db, identity, leaseMs, payloadJson = null) {
	const now = Date.now();
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("expires_at", "<=", now));
	const expiresAt = now + leaseMs;
	if (executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
		scope: identity.scope,
		lease_key: identity.key,
		owner: identity.owner,
		expires_at: expiresAt,
		heartbeat_at: now,
		payload_json: payloadJson,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doNothing())).numAffectedRows === 1n) return {
		kind: "acquired",
		expiresAt
	};
	const held = readAssistantStateLease(db, identity);
	if (!held) throw new Error("Conflicting state lease disappeared inside its acquisition transaction");
	return {
		kind: "held",
		holder: {
			owner: held.owner,
			epoch: held.createdAt
		}
	};
}
function readAssistantStateLease(db, identity) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("state_leases").select([
		"owner",
		"created_at as createdAt",
		"expires_at as expiresAt",
		"payload_json as payloadJson"
	]).where("scope", "=", identity.scope).where("lease_key", "=", identity.key));
}
/** Reclaim only a same-host owner whose process identity is provably gone. */
function reclaimDeadAssistantStateLeaseInTransaction(db, identity) {
	const existing = readAssistantStateLease(db, identity);
	if (existing && readStateLeaseProcessOwnerStatus(parseStateLeaseProcessOwner(existing.payloadJson)) === "dead") {
		releaseAssistantStateLeaseInTransaction(db, {
			...identity,
			owner: existing.owner
		});
		return;
	}
	return existing;
}
function readAssistantStateLeaseExpiry(db, identity) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("state_leases").select("expires_at").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner).where("expires_at", ">", Date.now()).$narrowType())?.expires_at;
}
function repairMissingProcessStartTime(db, identity, processOwner) {
	if (processOwner?.startedAt == null) return;
	const row = readAssistantStateLease(db, identity);
	const recorded = parseStateLeaseProcessOwner(row?.payloadJson ?? null);
	if (row?.owner !== identity.owner || recorded?.startedAt !== null || recorded.pid !== processOwner.pid || recorded.host !== processOwner.host || !row.payloadJson) return;
	const payload = JSON.parse(row.payloadJson);
	if (!isRecord(payload) || !isRecord(payload.owner)) return;
	return JSON.stringify({
		...payload,
		owner: {
			...payload.owner,
			startedAt: processOwner.startedAt
		}
	});
}
/** The caller owns the write transaction; expired or replaced owners cannot renew. */
function renewAssistantStateLeaseInTransaction(db, identity, leaseMs, processOwner) {
	const now = Date.now();
	const expiresAt = now + leaseMs;
	const payloadJson = repairMissingProcessStartTime(db, identity, processOwner);
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("state_leases").set({
		expires_at: expiresAt,
		heartbeat_at: now,
		updated_at: now,
		...payloadJson === void 0 ? {} : { payload_json: payloadJson }
	}).where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner).where("expires_at", ">", now)).numAffectedRows === 1n ? expiresAt : void 0;
}
/** The caller owns the write transaction; a replaced owner cannot release its successor. */
function releaseAssistantStateLeaseInTransaction(db, identity) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner));
}
//#endregion
export { releaseAssistantStateLeaseInTransaction as a, readStateLeaseProcessOwnerStatus as c, reclaimDeadAssistantStateLeaseInTransaction as i, readAssistantStateLease as n, renewAssistantStateLeaseInTransaction as o, readAssistantStateLeaseExpiry as r, parseStateLeaseProcessOwner as s, acquireAssistantStateLeaseInTransaction as t };
