import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-xVA5A4Bb.mjs";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-arRyGxwp.mjs";
import "./testclaw-agent-db-DAdiee0a.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { i as unwrapSessionTranscriptWorkerReply, r as sessionHistoryCleanupError } from "./session-history-worker-errors-CGoOj7Ld.mjs";
import { T as resolveSessionStorePathForScope, u as loadSessionEntryReadOnlyInScope } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import { a as costRefreshLane, d as rotateDatabaseWorkers, i as costReadLane, l as pruneHistoryDatabases, n as armDatabaseWorkerIdleRetirement, o as historyClearTimeout, p as UsageCostWorkerReplyError, r as clearClosedDatabaseCustody, s as historyLane, t as acquireHistoryDatabaseResource, u as releaseRetiredDatabaseCustody } from "./session-transcript-worker-resources-DvyPYce4.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-transcript-worker-readers.ts
/** Decode domain results; database custody remains with the enclosing history owner. */
function createSessionHistoryWorkerReaders(runRequest) {
	return {
		readArchivePruning: async (input) => await runRequest(() => ({
			kind: "session-archive-pruning",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-archive-pruning") throw new Error("Session history worker returned another result instead of archive pruning");
			return value.result;
		}),
		readColdMetadata: async (input) => await runRequest(() => ({
			kind: "cold-metadata",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "cold-metadata") throw new Error("Session history worker returned another result instead of cold metadata");
			return value;
		}),
		searchTranscripts: async (params) => await runRequest(() => ({
			kind: "transcript-search",
			params
		}), JSON.stringify(params).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "transcript-search") throw new Error("Session history worker returned another result instead of search");
			return value.result;
		}),
		readPreview: async (input) => await runRequest(() => ({
			kind: "session-preview",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-preview") throw new Error("Session history worker returned another result instead of a preview");
			return value.items;
		}),
		readTitleFields: async (input) => await runRequest(() => ({
			kind: "session-title-fields",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-title-fields") throw new Error("Session history worker returned another result instead of title fields");
			return value.fields;
		}),
		readRowBackfill: async (params) => await runRequest(() => ({
			kind: "session-row-backfill",
			params
		}), JSON.stringify(params).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-row-backfill") throw new Error("Session history worker returned another result instead of transcript fields");
			return value.fields;
		}),
		run: async (prepare, inputBytes) => await runRequest(prepare, inputBytes, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "rpc" && value.kind !== "http" && value.kind !== "delta" && value.kind !== "recent" && value.kind !== "message-lookup") throw new Error("Session history worker returned metadata instead of history");
			return value;
		}),
		readTranscript: async (input, signal) => {
			const events = [];
			let parts = [];
			let text;
			const receiveChunk = (value) => {
				if (!isRecord(value) || value.kind !== "transcript-hydration-chunk" || typeof value.encoding !== "string" || !Array.isArray(value.frames)) throw new Error("Session history worker returned an invalid transcript chunk");
				if (!text) text = {
					encoding: value.encoding,
					decoder: new TextDecoder(value.encoding, { ignoreBOM: true })
				};
				else if (text.encoding !== value.encoding) throw new Error("Session history worker changed transcript encoding during transfer");
				for (const frame of value.frames) {
					if (!isRecord(frame) || !(frame.data instanceof Uint8Array) || typeof frame.endOfEvent !== "boolean") throw new Error("Session history worker returned an invalid transcript frame");
					parts.push(text.decoder.decode(frame.data, { stream: !frame.endOfEvent }));
					if (frame.endOfEvent) {
						events.push(JSON.parse(parts.join("")));
						parts = [];
					}
				}
			};
			return await runRequest(() => ({
				kind: "transcript-hydration",
				...input
			}), JSON.stringify(input).length * 2, (value) => {
				if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "full" && value.kind !== "bounded") throw new Error("Session history worker returned another result instead of a transcript");
				if (value.kind === "bounded") return value;
				if (parts.length !== 0 || events.length !== value.eventCount) throw new Error("Session history worker returned an incomplete transcript");
				return {
					kind: "full",
					snapshot: {
						events,
						version: value.version
					}
				};
			}, signal, input.limits ? void 0 : receiveChunk);
		},
		readCurrentTurnEntry: async (input, signal) => await runRequest(() => ({
			kind: "current-turn-entry",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "current-turn-entry") throw new Error("Session history worker returned another result instead of a current-turn entry");
			return value;
		}, signal),
		readUsageCache: async (input) => await runRequest(() => ({
			kind: "usage-cache",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "usage-refresh-lock") throw new Error("Session history worker returned another result instead of usage cache");
			return value;
		}),
		readMembershipFacts: async (input) => await runRequest(() => ({
			kind: "session-membership-facts",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-membership-facts") throw new Error("Session history worker returned another result instead of membership facts");
			return value;
		}),
		readMembers: async (input) => await runRequest(() => ({
			kind: "session-members",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (!Array.isArray(value)) throw new Error("Session history worker returned another result instead of members");
			return value;
		}),
		readExactEntries: async (input) => await runRequest(() => ({
			kind: "session-exact-entries",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-exact-entries") throw new Error("Session history worker returned another result instead of exact entries");
			return value;
		}),
		readRowFacts: async (input) => {
			if (input.sessionKeys.length > 64) throw new Error(`Session row facts support at most 64 keys`);
			const captured = {
				env: { ...input.env },
				sessionKeys: [...input.sessionKeys],
				continuation: input.continuation ? { ...input.continuation } : void 0
			};
			return await runRequest(() => ({
				kind: "session-row-facts",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => {
				if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-row-facts") throw new Error("Session history worker returned another result instead of row facts");
				return value;
			});
		},
		readProgressCard: async (input) => await runRequest(() => ({
			kind: "session-progress-card",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-progress-card") throw new Error("Session history worker returned another result instead of a progress card");
			return value.card;
		}),
		readEntries: async (scope) => await runRequest(() => ({
			kind: "session-entry-list",
			scope
		}), JSON.stringify(scope).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-entry-list") throw new Error("Session history worker returned another result instead of entries");
			return value.entries;
		}),
		readIdentityEvidence: async (input) => await runRequest(() => ({
			kind: "session-identity-evidence",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "session-identity-evidence") throw new Error("Session history worker returned another result instead of identity evidence");
			return value.evidence;
		}),
		readEntryPresence: async (scope) => await runRequest(() => ({
			kind: "session-row-presence",
			scope
		}), JSON.stringify(scope).length * 2, (value) => {
			if (typeof value !== "boolean") throw new Error("Session history worker returned history instead of metadata presence");
			return value;
		})
	};
}
//#endregion
//#region src/config/sessions/session-transcript-worker-runtime.ts
/** Capture the exact metadata owner before initial-writer admission can wait. */
function prepareSessionEntryPresenceRead(input) {
	const env = { ...input.env ?? process.env };
	env.TESTCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveSessionStorePathForScope({
		...input,
		env
	});
	const resolved = resolveSqliteScope({
		...input,
		storePath,
		env
	});
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveAssistantAgentSqlitePath(options);
	const scope = {
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		storePath: databasePath,
		databaseAgentId: options.agentId,
		env
	};
	const incognito = isIncognitoAssistantAgentSqlitePath(databasePath, options);
	return {
		sessionKey: resolved.sessionKey,
		storePath,
		read: incognito ? async () => loadSessionEntryReadOnlyInScope({
			...scope,
			projection: "list"
		}) !== void 0 : async () => await withSessionHistoryWorkerDatabase(options, async (owner) => await owner.readEntryPresence(scope))
	};
}
/** Single and batch reads synchronously retain the same lane-aware database owner. */
function retainSessionHistoryWorkerDatabase(options, lane = historyLane) {
	const owned = acquireHistoryDatabaseResource(options);
	const { database } = owned;
	const assertCurrent = () => {
		if (owned.revoked) throw new WorkerTaskError("Session history database read was revoked", "unavailable");
	};
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	owned.pending++;
	const release = () => {
		owned.pending--;
		lane.pending--;
		pruneHistoryDatabases();
		armDatabaseWorkerIdleRetirement(lane);
	};
	try {
		assertCurrent();
		const runRequest = async (prepare, inputBytes, receive, signal, onRequest) => {
			assertCurrent();
			const deadline = performance.now() + 6e4;
			let sequence = 0;
			let executionRetired = false;
			try {
				const reply = await lane.pool.run(() => {
					assertCurrent();
					const input = prepare();
					assertCurrent();
					sequence = ++lane.nativeSequence;
					owned.nativeSequences.set(lane, sequence);
					return {
						...input,
						database
					};
				}, {
					inputBytes,
					timeoutMs: 6e4,
					signal,
					onRequest: onRequest ? async (value, context) => {
						context.signal.throwIfAborted();
						assertCurrent();
						onRequest(value);
						assertCurrent();
						const remaining = deadline - performance.now();
						if (remaining <= 0) throw new WorkerTaskError("worker task timed out", "timeout");
						return {
							input: null,
							timeoutMs: remaining
						};
					} : void 0,
					onExecutionSettled: ({ retired }) => {
						if (retired) {
							executionRetired = true;
							releaseRetiredDatabaseCustody(lane, sequence);
						}
					}
				});
				const value = receive(unwrapSessionTranscriptWorkerReply(reply));
				if (reply.ok && reply.closedHistoryDatabase) clearClosedDatabaseCustody(lane, sequence, [reply.closedHistoryDatabase]);
				assertCurrent();
				return value;
			} catch (error) {
				if (sequence > 0 && !executionRetired) try {
					await rotateDatabaseWorkers(lane);
				} catch (cleanupError) {
					throw sessionHistoryCleanupError(error, cleanupError, "worker retirement");
				}
				throw error;
			}
		};
		return {
			owner: {
				generation: owned.generation,
				assertCurrent,
				...createSessionHistoryWorkerReaders(runRequest)
			},
			release
		};
	} catch (error) {
		try {
			release();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Session history reader admission cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
/** Capture every selected store before yielding; a closed target cannot join a later generation. */
async function withSessionHistoryWorkerDatabases(options, operation, lane = historyLane) {
	const retained = [];
	let outcome;
	try {
		for (const target of options) retained.push(retainSessionHistoryWorkerDatabase(target, lane));
		const value = await operation(retained.map(({ owner }) => owner));
		for (const { owner } of retained) owner.assertCurrent();
		outcome = { value };
	} catch (error) {
		outcome = { error };
	}
	const cleanupErrors = [];
	for (const retainedRead of retained.toReversed()) try {
		retainedRead.release();
	} catch (error) {
		cleanupErrors.push(error);
	}
	if (cleanupErrors.length > 0) throw new AggregateError([..."error" in outcome ? [outcome.error] : [], ...cleanupErrors], "Session history read scope cleanup failed", { cause: "error" in outcome ? outcome.error : cleanupErrors[0] });
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Single-target callers retain the same batch admission and revocation boundary. */
function withSessionHistoryWorkerDatabase(options, operation, lane = historyLane) {
	return withSessionHistoryWorkerDatabases([options], (owners) => operation(expectDefined(owners[0], "retained session history reader")), lane);
}
/** Usage reads retain every physical store while compute and its admitted host effects settle. */
async function withSessionCostUsageWorkerDatabases(options, operation) {
	if (options.length === 0) throw new Error("Usage cost work requires its database owners");
	const resources = /* @__PURE__ */ new Set();
	try {
		for (const databaseOptions of options) {
			const resource = acquireHistoryDatabaseResource(databaseOptions);
			if (!resources.has(resource)) {
				resources.add(resource);
				resource.pending++;
			}
		}
	} catch (error) {
		for (const resource of resources) resource.pending--;
		pruneHistoryDatabases();
		throw error;
	}
	const pending = /* @__PURE__ */ new Set();
	const cleanups = /* @__PURE__ */ new Set();
	const lanes = /* @__PURE__ */ new Map();
	let phase = "open";
	const assertCurrent = () => {
		if (phase === "closed" || [...resources].some((resource) => resource.revoked)) throw new WorkerTaskError("Session usage database work was revoked", "unavailable");
	};
	const settle = async () => {
		while (pending.size > 0) await Promise.allSettled(pending);
		for (const [lane, custody] of lanes) {
			if (custody.nativeThrough > lane.retiredSequence) await lane.rotation;
			if (custody.failedThrough > lane.retiredSequence) await rotateDatabaseWorkers(lane);
		}
	};
	const retainCleanup = (close) => {
		if (phase === "closed") throw new WorkerTaskError("Session usage database scope is closed", "unavailable");
		const runInContext = AsyncLocalStorage.snapshot();
		let released = false;
		let closing;
		const release = () => {
			released = true;
			cleanups.delete(cleanup);
			for (const resource of resources) resource.cleanups.delete(cleanup);
			pruneHistoryDatabases();
		};
		const cleanup = { run: () => {
			if (released) return Promise.resolve();
			closing ??= (async () => {
				await settle();
				await runInContext(close);
				release();
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		} };
		cleanups.add(cleanup);
		for (const resource of resources) resource.cleanups.add(cleanup);
		return release;
	};
	const run = (input, runOptions) => {
		assertCurrent();
		if (phase !== "open") throw new WorkerTaskError("Session usage database scope is closing", "unavailable");
		const lane = input.operation.kind === "refresh" ? costRefreshLane : costReadLane;
		const custody = lanes.get(lane) ?? {
			nativeThrough: 0,
			failedThrough: 0
		};
		lanes.set(lane, custody);
		const controller = new AbortController();
		const signal = runOptions.signal ? AbortSignal.any([controller.signal, runOptions.signal]) : controller.signal;
		const abort = () => controller.abort(new WorkerTaskError("Session usage database work was revoked", "unavailable"));
		for (const resource of resources) resource.aborters.add(abort);
		historyClearTimeout(lane.idleTimer);
		lane.pending++;
		const hostEffects = /* @__PURE__ */ new Set();
		const onRequest = runOptions.onRequest;
		let sequence = 0;
		let executionSettled = false;
		const task = (async () => {
			try {
				const reply = await lane.pool.run(() => {
					assertCurrent();
					signal.throwIfAborted();
					runOptions.beforeDispatch?.();
					sequence = ++lane.nativeSequence;
					custody.nativeThrough = sequence;
					for (const resource of resources) resource.nativeSequences.set(lane, sequence);
					return {
						...input,
						databases: [...resources].map((resource) => resource.database)
					};
				}, {
					...runOptions,
					signal,
					onExecutionSettled: ({ retired }) => {
						executionSettled = true;
						if (retired && sequence > 0) releaseRetiredDatabaseCustody(lane, sequence);
					},
					onRequest: onRequest ? (value, context) => {
						const effect = createDeferredCore();
						hostEffects.add(effect.promise);
						for (const resource of resources) resource.hostEffects.add(effect.promise);
						const releaseEffect = () => {
							hostEffects.delete(effect.promise);
							for (const resource of resources) resource.hostEffects.delete(effect.promise);
						};
						effect.promise.then(releaseEffect, releaseEffect);
						try {
							assertCurrent();
							context.signal.throwIfAborted();
							effect.resolve(onRequest(value, context));
						} catch (error) {
							effect.reject(error);
						}
						return effect.promise;
					} : void 0
				});
				if (!reply.ok) throw new UsageCostWorkerReplyError(reply.error);
				clearClosedDatabaseCustody(lane, sequence, reply.closedDatabases);
				signal.throwIfAborted();
				assertCurrent();
				return reply.value;
			} catch (error) {
				if (sequence > 0 && !executionSettled) {
					custody.failedThrough = Math.max(custody.failedThrough, sequence);
					try {
						await rotateDatabaseWorkers(lane);
					} catch (cleanupError) {
						throw withSqliteWorkerCleanupFailure(toErrorObject(error, "Usage cost worker failed"), cleanupError);
					}
				}
				throw error;
			} finally {
				await Promise.allSettled(hostEffects);
				for (const resource of resources) resource.aborters.delete(abort);
				lane.pending--;
				pruneHistoryDatabases();
				armDatabaseWorkerIdleRetirement(lane);
			}
		})();
		pending.add(task);
		task.then(() => pending.delete(task), () => pending.delete(task));
		return task;
	};
	let result;
	try {
		assertCurrent();
		const value = await operation({
			assertCurrent,
			run,
			retainCleanup
		});
		assertCurrent();
		result = {
			ok: true,
			value
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	phase = "closing";
	try {
		await settle();
		for (const cleanup of cleanups) await cleanup.run();
		if (result.ok) assertCurrent();
	} catch (cleanupError) {
		throw result.ok ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Usage cost operation failed"), cleanupError);
	} finally {
		phase = "closed";
		for (const resource of resources) resource.pending--;
		pruneHistoryDatabases();
		for (const lane of lanes.keys()) armDatabaseWorkerIdleRetirement(lane);
	}
	if (!result.ok) throw result.error;
	return result.value;
}
//#endregion
export { withSessionHistoryWorkerDatabases as a, withSessionHistoryWorkerDatabase as i, retainSessionHistoryWorkerDatabase as n, withSessionCostUsageWorkerDatabases as r, prepareSessionEntryPresenceRead as t };
