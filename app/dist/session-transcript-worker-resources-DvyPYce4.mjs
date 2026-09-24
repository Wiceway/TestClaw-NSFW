import { a as runInDetachedAsyncContext } from "./async-work-scope-B8vgCYcj.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CJBJfx5S.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DJeggoLv.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DEzGnZz9.mjs";
import { n as createOwnedWorkerTaskPool, r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-xVA5A4Bb.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { a as registerAssistantAgentDatabaseAsyncResource, i as matchesAgentDatabaseReadCandidatePath, o as registerAssistantAgentDatabaseReadCandidateResource } from "./testclaw-agent-db-resources-hI09vxvz.mjs";
import { r as measureSessionStoreTargetInventoryInputBytes } from "./session-store-read-candidates-AxJeGVjE.mjs";
import { i as unwrapSessionTranscriptWorkerReply, r as sessionHistoryCleanupError } from "./session-history-worker-errors-CGoOj7Ld.mjs";
import { channel } from "node:diagnostics_channel";
//#region src/infra/session-cost-usage-worker.types.ts
/** Retain the domain failure while the pool proves native retirement. */
var UsageCostWorkerReplyError = class extends Error {
	constructor(failure) {
		super(failure.message);
		this.failure = failure;
		this.name = "UsageCostWorkerReplyError";
	}
};
//#endregion
//#region src/config/sessions/session-transcript-worker-resources.ts
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
function createHistoryPool() {
	return createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: 1,
		idleTimeoutMs: 0,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		}
	});
}
const historyPages = createHistoryPool();
const maintenancePages = createHistoryPool();
function createUsageCostPool(kind) {
	return new WorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: 1,
		sharedCompute: kind === "refresh",
		idleTimeoutMs: 0,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		},
		validateResult(reply) {
			if (!reply.ok) throw new UsageCostWorkerReplyError(reply.error);
		}
	});
}
const historyDatabases = /* @__PURE__ */ new Map();
const historySetTimeout = setTimeout;
const historyClearTimeout = clearTimeout;
let historyGeneration = 0;
const historyLane = {
	name: "Session history",
	pool: historyPages,
	nativeSequence: 0,
	retiredSequence: 0,
	pending: 0
};
const maintenanceLane = {
	name: "Session maintenance",
	pool: maintenancePages,
	nativeSequence: 0,
	retiredSequence: 0,
	pending: 0
};
const costReadLane = {
	name: "Session usage read",
	pool: createUsageCostPool("read"),
	nativeSequence: 0,
	retiredSequence: 0,
	pending: 0
};
const costRefreshLane = {
	name: "Session usage refresh",
	pool: createUsageCostPool("refresh"),
	nativeSequence: 0,
	retiredSequence: 0,
	pending: 0
};
const databaseWorkerLanes = [
	historyLane,
	maintenanceLane,
	costReadLane,
	costRefreshLane
];
channel("testclaw.memory.critical").subscribe(() => {
	for (const lane of databaseWorkerLanes) {
		if (lane.pending > 0 || lane.rotation || lane.nativeSequence <= lane.retiredSequence) continue;
		historyClearTimeout(lane.idleTimer);
		runInDetachedAsyncContext(() => rotateDatabaseWorkers(lane)).catch((error) => {
			process.emitWarning(`${lane.name} worker retirement failed: ${String(error)}`);
		});
	}
});
function pruneHistoryDatabases() {
	for (const [key, resource] of historyDatabases) if (resource.pending === 0 && resource.nativeSequences.size === 0 && resource.hostEffects.size === 0 && resource.cleanups.size === 0 && !resource.closing) {
		resource.unregister();
		historyDatabases.delete(key);
	}
}
function releaseRetiredDatabaseCustody(lane, through) {
	lane.retiredSequence = Math.max(lane.retiredSequence, through);
	for (const resource of historyDatabases.values()) {
		const sequence = resource.nativeSequences.get(lane);
		if (sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
	}
	pruneHistoryDatabases();
}
function rotateDatabaseWorkers(lane) {
	const through = lane.nativeSequence;
	const rotation = lane.pool.rotate().then(() => releaseRetiredDatabaseCustody(lane, through));
	lane.rotation = rotation;
	const finished = () => {
		if (lane.rotation === rotation) lane.rotation = void 0;
	};
	rotation.then(finished, finished);
	return rotation;
}
function armDatabaseWorkerIdleRetirement(lane) {
	historyClearTimeout(lane.idleTimer);
	if (lane.nativeSequence <= lane.retiredSequence || lane.pending > 0) return;
	lane.idleTimer = runInDetachedAsyncContext(() => historySetTimeout(() => {
		rotateDatabaseWorkers(lane).catch((error) => {
			process.emitWarning(`${lane.name} worker retirement failed: ${String(error)}`);
		});
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	lane.idleTimer.unref();
}
function clearClosedDatabaseCustody(lane, through, databases) {
	for (const database of databases) {
		const resource = historyDatabases.get(JSON.stringify(database));
		const sequence = resource?.nativeSequences.get(lane);
		if (resource && sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
	}
}
function acquireHistoryDatabaseResource(options) {
	const database = {
		agentId: normalizeAgentId(options.agentId),
		path: resolveAssistantAgentSqlitePath(options)
	};
	const key = JSON.stringify(database);
	let resource = historyDatabases.get(key);
	if (!resource || resource.revoked) {
		const owned = {
			database,
			generation: ++historyGeneration,
			pending: 0,
			revoked: false,
			nativeSequences: /* @__PURE__ */ new Map(),
			hostEffects: /* @__PURE__ */ new Set(),
			cleanups: /* @__PURE__ */ new Set(),
			aborters: /* @__PURE__ */ new Set(),
			unregister: () => {}
		};
		const close = () => {
			if (!owned.closing) {
				owned.closing = (async () => {
					await Promise.all([...owned.nativeSequences.keys()].map(rotateDatabaseWorkers));
					await Promise.allSettled(owned.hostEffects);
					for (const cleanup of owned.cleanups) await cleanup.run();
				})().finally(() => {
					owned.closing = void 0;
					pruneHistoryDatabases();
					for (const lane of databaseWorkerLanes) armDatabaseWorkerIdleRetirement(lane);
				});
				owned.closing.catch(() => {});
			}
			return owned.closing;
		};
		owned.unregister = registerAssistantAgentDatabaseAsyncResource({
			...database,
			revoke: () => {
				owned.revoked = true;
				for (const abort of owned.aborters) abort();
				close();
			},
			close
		});
		historyDatabases.set(key, owned);
		resource = owned;
	}
	return resource;
}
/** Keep captured discovery aliases until the existing history worker retires its readers. */
async function withSessionHistoryWorkerReadCandidates(candidates, operation, lane = historyLane) {
	const capturedCandidates = candidates.map(({ path, physicalPath, scope }) => ({
		path,
		physicalPath,
		scope
	}));
	const selected = capturedCandidates.map(({ physicalPath, scope }) => ({
		path: physicalPath,
		...scope ? { scope } : {}
	}));
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	try {
		let revoked = false;
		let closing;
		let nativeCleanupPending = false;
		let candidateCleanupPending = false;
		let dispatched = false;
		let discoveryFailed = false;
		let outcome;
		const assertCurrent = () => {
			if (revoked) throw new WorkerTaskError("Session target discovery was revoked", "unavailable");
		};
		const releases = [];
		const release = () => {
			for (const unregister of releases.toReversed()) unregister();
		};
		const retire = () => {
			closing ??= (async () => {
				nativeCleanupPending = true;
				try {
					await rotateDatabaseWorkers(lane);
					nativeCleanupPending = false;
				} finally {
					closing = void 0;
				}
			})();
			return closing;
		};
		const close = async () => {
			await retire();
			release();
		};
		const retained = /* @__PURE__ */ new Set();
		try {
			for (const candidate of capturedCandidates) for (const pathname of [candidate.path, candidate.physicalPath]) {
				const key = JSON.stringify([pathname, candidate.scope]);
				if (retained.has(key)) continue;
				retained.add(key);
				releases.push(registerAssistantAgentDatabaseReadCandidateResource({
					path: pathname,
					scope: candidate.scope,
					revoke: () => {
						revoked = true;
					},
					close
				}));
			}
			assertCurrent();
			const value = await operation({
				assertCurrent,
				readStoreTarget: async (request) => {
					const preparedRequest = {
						...request,
						candidates: capturedCandidates
					};
					const reply = await lane.pool.run(() => {
						assertCurrent();
						dispatched = true;
						lane.nativeSequence++;
						return {
							kind: "session-store-target",
							request: preparedRequest
						};
					}, {
						inputBytes: JSON.stringify(preparedRequest).length * 2,
						timeoutMs: 6e4
					});
					const result = unwrapSessionTranscriptWorkerReply(reply);
					if (typeof result === "boolean" || Array.isArray(result) || result.kind !== "session-store-target" && result.kind !== "session-target-registry-required") throw new Error("Session history worker returned another result instead of store target");
					assertCurrent();
					return result;
				},
				readTargetInventory: async (request) => {
					const preparedRequest = {
						...request,
						candidates: capturedCandidates
					};
					const reply = await lane.pool.run(() => {
						assertCurrent();
						dispatched = true;
						lane.nativeSequence++;
						return {
							kind: "session-target-inventory",
							request: preparedRequest
						};
					}, {
						inputBytes: measureSessionStoreTargetInventoryInputBytes(preparedRequest),
						timeoutMs: 6e4
					});
					const result = unwrapSessionTranscriptWorkerReply(reply);
					if (typeof result === "boolean" || Array.isArray(result) || result.kind !== "session-target-inventory" && result.kind !== "session-target-registry-required") throw new Error("Session history worker returned another result instead of target inventory");
					if (result.kind === "session-target-inventory") discoveryFailed ||= result.agents.some(({ result: inventory }) => !inventory.available && inventory.reason !== "database-missing");
					if (result.kind === "session-target-registry-required") await retire();
					assertCurrent();
					return result;
				}
			});
			assertCurrent();
			outcome = { value };
		} catch (error) {
			outcome = { error };
		}
		if (dispatched) try {
			if ("error" in outcome || discoveryFailed || process.versions.bun) await retire();
			else {
				const through = lane.nativeSequence;
				candidateCleanupPending = true;
				try {
					await lane.pool.closeResources(JSON.stringify(selected));
					candidateCleanupPending = false;
					for (const resource of historyDatabases.values()) {
						const sequence = resource.nativeSequences.get(lane);
						if (sequence !== void 0 && sequence <= through && selected.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.database.path))) resource.nativeSequences.delete(lane);
					}
					pruneHistoryDatabases();
				} catch (error) {
					try {
						await retire();
						candidateCleanupPending = false;
					} catch (retirementError) {
						throw sessionHistoryCleanupError(error, retirementError, "worker retirement");
					}
					throw error;
				}
			}
		} catch (cleanupError) {
			outcome = { error: "error" in outcome ? sessionHistoryCleanupError(outcome.error, cleanupError, "worker retirement") : cleanupError };
		}
		if (!nativeCleanupPending && !candidateCleanupPending) release();
		if ("error" in outcome) throw outcome.error;
		assertCurrent();
		return outcome.value;
	} finally {
		lane.pending--;
		armDatabaseWorkerIdleRetirement(lane);
	}
}
//#endregion
export { costRefreshLane as a, maintenanceLane as c, rotateDatabaseWorkers as d, withSessionHistoryWorkerReadCandidates as f, costReadLane as i, pruneHistoryDatabases as l, armDatabaseWorkerIdleRetirement as n, historyClearTimeout as o, UsageCostWorkerReplyError as p, clearClosedDatabaseCustody as r, historyLane as s, acquireHistoryDatabaseResource as t, releaseRetiredDatabaseCustody as u };
