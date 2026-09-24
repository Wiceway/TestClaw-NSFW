import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as publishWorkerEnvironmentNativeMutation } from "./store-native-publication-CBjzYlTV.js";
import { n as find } from "./placement-row-codec-CkdBdVg6.js";
import "node:util";
import { Buffer } from "node:buffer";
//#region src/gateway/worker-environments/prepared-environment-store.ts
const query = (db) => getNodeSqliteKysely(db);
function readWorkerEnvironmentPreparation(row) {
	const { preparation_key: key, preparation_purpose: storedPurpose, preparation_demand_at_ms: demandAtMs, preparation_expires_at_ms: expiresAtMs, preparation_consumed_at_ms: consumedAtMs } = row;
	if (key === null && storedPurpose === null && demandAtMs === null && expiresAtMs === null && consumedAtMs === null) return null;
	if (storedPurpose !== null && storedPurpose !== "reserve" && storedPurpose !== "build" || typeof key !== "string" || !/^[a-f0-9]{64}$/u.test(key) || demandAtMs === null || !Number.isSafeInteger(demandAtMs) || demandAtMs < 0 || expiresAtMs === null || !Number.isSafeInteger(expiresAtMs) || expiresAtMs <= demandAtMs || consumedAtMs !== null && (!Number.isSafeInteger(consumedAtMs) || consumedAtMs < demandAtMs || consumedAtMs >= expiresAtMs)) throw new Error("Worker environment preparation metadata is invalid");
	return {
		purpose: storedPurpose ?? "reserve",
		key,
		demandAtMs,
		expiresAtMs,
		consumedAtMs
	};
}
function hasPlacementReference(db, environmentId) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_session_placements").select("session_id").where("environment_id", "=", environmentId).limit(1)));
}
function snapshotProjectKey(snapshot) {
	if (!isRecord(snapshot) || !isRecord(snapshot.project) || typeof snapshot.project.key !== "string" || !/^[a-f0-9]{64}$/u.test(snapshot.project.key)) throw new Error("Prepared worker has an invalid project identity");
	return snapshot.project.key;
}
function selectPreparedEnvironmentReservations(records) {
	return records.filter((record) => record.preparation !== null && !["failed", "destroyed"].includes(record.state) && (record.preparation.consumedAtMs === null || record.destroyRequestedAtMs !== null || record.state === "orphaned")).map((record) => ({
		environmentId: record.environmentId,
		profileId: record.profileId,
		leaseId: record.leaseId,
		cleanupOrder: record.destroyRequestedAtMs !== null || record.state === "orphaned" ? 0 : 1,
		state: record.state,
		purpose: record.preparation.purpose,
		projectKey: snapshotProjectKey(record.profileSnapshot),
		createdAtMs: record.createdAtMs
	})).toSorted((a, b) => a.cleanupOrder - b.cleanupOrder || a.createdAtMs - b.createdAtMs || Buffer.compare(Buffer.from(a.environmentId), Buffer.from(b.environmentId)));
}
function preparedCapacityFromReservations(reserved, input) {
	return Math.max(0, Math.min(input.maxTotal - reserved.length, input.target - reserved.filter((row) => row.profileId === input.profileId && row.projectKey === input.projectKey).length));
}
function isPreparedReservationWithinCapacity(reservations, input) {
	const owned = reservations.find((row) => row.environmentId === input.environmentId);
	if (!owned) return false;
	const reserved = owned.leaseId ? reservations.filter((row) => row.cleanupOrder === 1) : reservations;
	const index = reserved.findIndex((row) => row.environmentId === input.environmentId);
	if (index < 0 || index >= input.maxTotal) return false;
	if (owned.purpose === "build" && owned.state !== "ready") return true;
	return reserved.slice(0, index + 1).filter((row) => row.profileId === owned.profileId && row.projectKey === owned.projectKey).length <= input.target;
}
/** Placement and consumption commit together; dropping a placement never recreates a spare. */
function consumePreparedEnvironment(db, input, nowMs) {
	input.assertCurrent();
	const placement = find(db, input.sessionId);
	if (!placement || placement.state !== "requested" || placement.generation !== input.expectedGeneration || placement.agentId !== input.agentId || placement.sessionKey !== input.sessionKey || placement.executionMode !== input.executionMode || placement.turnClaim !== null) return;
	const environment = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_environments").selectAll().where("environment_id", "=", input.environmentId));
	if (!environment) return;
	const preparation = readWorkerEnvironmentPreparation(environment);
	const profile = JSON.parse(environment.profile_snapshot_json);
	if (!preparation || preparation.key !== input.preparationKey || preparation.consumedAtMs !== null || preparation.demandAtMs > nowMs || preparation.expiresAtMs <= nowMs || !isRecord(profile) || profile.executionMode !== input.executionMode || environment.state !== "ready" || environment.owner_epoch !== input.ownerEpoch || environment.provider_id !== input.providerId || environment.profile_id !== input.profileId || environment.node_device_id !== input.nodeDeviceId || environment.lease_id !== input.leaseId || environment.shared_host !== 0 || environment.bootstrap_bundle_hash !== input.bundleHash || environment.destroy_requested_at_ms !== null || environment.attached_session_ids_json !== "[]" || hasPlacementReference(db, input.environmentId)) return;
	input.assertCurrent();
	executeSqliteQuerySync(db, query(db).updateTable("worker_environments").set({
		preparation_consumed_at_ms: nowMs,
		updated_at_ms: nowMs
	}).where("environment_id", "=", input.environmentId));
	publishWorkerEnvironmentNativeMutation(db, input.environmentId, {
		preparation: {
			...preparation,
			consumedAtMs: nowMs
		},
		updatedAtMs: nowMs
	});
	return placement;
}
//#endregion
export { selectPreparedEnvironmentReservations as i, isPreparedReservationWithinCapacity as n, preparedCapacityFromReservations as r, consumePreparedEnvironment as t };
