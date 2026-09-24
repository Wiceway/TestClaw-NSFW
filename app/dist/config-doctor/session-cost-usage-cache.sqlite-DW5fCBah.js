import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import "./session-key-AvQIavYt.js";
import { et as isAssistantAgentDatabasePathCurrent } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { r as isPidAlive } from "./pid-alive-BrVKCISp.js";
import { f as runAssistantAgentWriteTransaction } from "./testclaw-agent-db-Ckg86YCZ.js";
import { g as retainAgentDatabase } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CBtrr-9r.js";
import { t as withAssistantAgentDatabaseWrite } from "./testclaw-agent-db-write-BIwC9O0Y.js";
import { n as deleteSessionCostUsageRefreshLockInDatabase, r as pruneSessionCostUsageRollupsInDatabase, s as writeSessionCostUsageRollupInDatabase, t as acquireSessionCostUsageRefreshLockInDatabase } from "./session-cost-usage-cache.kernel-ChEWsPR4.js";
//#region src/infra/session-cost-usage-cache.sqlite.ts
function captureCacheDatabaseOptions(inputOptions) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.TESTCLAW_STATE_DIR = resolveStateDir(options.env);
	return {
		...options,
		path: resolveAssistantAgentSqlitePath(options)
	};
}
function runCacheWriteTransaction(operation, inputOptions, transactionOptions, owner) {
	const options = captureCacheDatabaseOptions(inputOptions);
	return withAssistantAgentDatabaseWrite(options, (database) => runAssistantAgentWriteTransaction((current) => {
		if (current !== database || !isAssistantAgentDatabasePathCurrent(current)) throw new Error("Usage cache database changed before write admission");
		owner?.assertCurrent?.(current);
		owner?.onAdmitted?.(current);
		return operation(current);
	}, {
		...options,
		path: database.path
	}, transactionOptions), owner?.database?.db);
}
async function readCacheDatabase(options, request) {
	if (isIncognitoAssistantAgentSqlitePath(options.path, options)) {
		const { readSessionCostUsageCache } = await import("./session-cost-usage-cache-read-B7XdVQ2A.js");
		return readSessionCostUsageCache(options, request);
	}
	return withSessionHistoryWorkerDatabase(options, (owner) => owner.readUsageCache({
		request,
		env: {
			...options.env,
			TESTCLAW_STATE_DIR: options.env.TESTCLAW_STATE_DIR
		}
	}));
}
async function readRefreshLock(options) {
	const result = await readCacheDatabase(options, { kind: "usage-refresh-lock" });
	if (result.kind !== "usage-refresh-lock") throw new Error("Invalid usage refresh-lock worker result");
	return result.value;
}
async function deleteSessionCostUsageRollupsExcept(params) {
	const existing = params.rows.filter((row) => !params.liveKeys.has(row.key));
	await runCacheWriteTransaction((database) => pruneSessionCostUsageRollupsInDatabase(database.db, existing), {
		agentId: normalizeAgentId(params.agentId),
		env: params.env,
		...params.databasePath ? { path: params.databasePath } : {}
	}, { operationLabel: "session-cost-usage.rollup.prune" });
}
function parseRefreshLock(raw) {
	if (!raw) return null;
	try {
		const value = JSON.parse(raw);
		if (!value || typeof value.pid !== "number" || !Number.isInteger(value.pid) || value.pid <= 0 || typeof value.startedAt !== "number" || !Number.isFinite(value.startedAt) || typeof value.ownerNonce !== "string" || !value.ownerNonce) return null;
		return {
			pid: value.pid,
			startedAt: value.startedAt,
			ownerNonce: value.ownerNonce
		};
	} catch {
		return null;
	}
}
async function isSessionCostUsageRefreshRunning(agentId, databasePath) {
	const lock = parseRefreshLock(await readRefreshLock(captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath
	})));
	return lock !== null && isPidAlive(lock.pid);
}
function prepareSessionCostUsageRefreshLock(agentId, databasePath, owner) {
	const options = captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath,
		env: owner?.env
	});
	const lock = {
		pid: process.pid,
		startedAt: Date.now(),
		ownerNonce: `${process.pid}:${Date.now()}:${process.hrtime.bigint()}`
	};
	const lockJson = JSON.stringify(lock);
	let database;
	let releaseBorrow;
	let acquiring;
	let releasing;
	let closed = false;
	let acquired = false;
	let mayOwnLock = false;
	const assertCurrent = (current) => {
		if (closed || !acquired) throw new Error("Usage cache refresh owner is closed");
		owner?.assertCurrent?.(current);
	};
	const release = () => {
		closed = true;
		releasing ??= (async () => {
			await acquiring?.catch(() => void 0);
			if (mayOwnLock) {
				await runCacheWriteTransaction((current) => deleteSessionCostUsageRefreshLockInDatabase(current.db, lockJson), options, { operationLabel: "session-cost-usage.refresh-lock.delete" }, { database });
				mayOwnLock = false;
			}
			releaseBorrow?.();
			releaseBorrow = void 0;
		})().catch((error) => {
			releasing = void 0;
			throw error;
		});
		return releasing;
	};
	return {
		acquire() {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Usage cache refresh owner is closed"));
			acquiring ??= (async () => {
				owner?.assertCurrent?.();
				const previousRaw = await readRefreshLock(options);
				const previousLock = parseRefreshLock(previousRaw);
				const previousOwnerIsRunning = previousLock ? isPidAlive(previousLock.pid) : false;
				acquired = await runCacheWriteTransaction((current) => {
					mayOwnLock = true;
					const granted = acquireSessionCostUsageRefreshLockInDatabase(current.db, {
						previousRaw,
						previousOwnerIsRunning,
						lockJson,
						startedAt: lock.startedAt
					});
					if (!granted) mayOwnLock = false;
					return granted;
				}, options, { operationLabel: "session-cost-usage.refresh-lock.acquire" }, {
					assertCurrent: (current) => {
						if (closed) throw new Error("Usage cache refresh owner is closed");
						owner?.assertCurrent?.(current);
					},
					onAdmitted: (current) => {
						database = current;
						releaseBorrow = retainAgentDatabase(current.db);
					}
				});
				if (!acquired) {
					releaseBorrow?.();
					releaseBorrow = void 0;
				}
				return acquired;
			})();
			return acquiring;
		},
		release,
		writeRollup(params) {
			assertCurrent();
			return runCacheWriteTransaction((current) => writeSessionCostUsageRollupInDatabase(current.db, params), options, { operationLabel: "session-cost-usage.rollup.write" }, {
				database,
				assertCurrent
			});
		},
		pruneRows(rows) {
			assertCurrent();
			return runCacheWriteTransaction((current) => pruneSessionCostUsageRollupsInDatabase(current.db, rows), options, { operationLabel: "session-cost-usage.rollup.prune" }, {
				database,
				assertCurrent
			});
		}
	};
}
//#endregion
export { isSessionCostUsageRefreshRunning as n, prepareSessionCostUsageRefreshLock as r, deleteSessionCostUsageRollupsExcept as t };
