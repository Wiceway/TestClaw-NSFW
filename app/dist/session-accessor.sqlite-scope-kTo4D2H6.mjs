import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import { r as isIncognitoSessionKey } from "./session-key-B8Cn8Xls.mjs";
import { A as parseAgentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C_bfgyCp.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DNLGIg8_.mjs";
import { r as getChildLogger } from "./logger-Cnti88IN.mjs";
import { i as getNodeSqliteKysely } from "./kysely-sync-DUH0XYlR.mjs";
import { s as withSqliteReaderOwner } from "./sqlite-reader-lifecycle-BYUk2TxG.mjs";
import { a as resolveAssistantAgentSqlitePath, i as resolveIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { o as resolveSessionArtifactDirectory } from "./paths-D1bkI3aW.mjs";
import { l as openAssistantAgentDatabase, m as withAssistantAgentDatabaseAsync, s as getAssistantAgentDatabaseIfOpen } from "./testclaw-agent-db-DAdiee0a.mjs";
import { n as runAssistantAgentWorkerWrite, r as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-D_VtLORb.mjs";
import { a as prepareSqliteTargetFromSessionStorePath, s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CBM31t7c.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-FtNy8CfS.mjs";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-scope.ts
const SQLITE_SESSION_SLOW_WRITE_MS = 1e3;
const SQLITE_SESSION_WRITE_ERROR_MAX_CHARS = 2048;
const sessionWriteDiagnostics = channel("testclaw.session.write");
/** Checks the freshly read identity and lifecycle before a synchronous transcript mutation. */
function transcriptWriteScopeIsCurrent(entry, sessionId, scope) {
	return entry !== void 0 && entry.sessionId === sessionId && (scope.expectedLifecycleRevision === void 0 || entry.lifecycleRevision === scope.expectedLifecycleRevision) && (scope.expectedWriterRunId === void 0 || entry.activeWriterRunId === scope.expectedWriterRunId);
}
function getSessionKysely(database) {
	return getNodeSqliteKysely(database);
}
function withSqliteSessionDatabase(options, operation, assertCurrent, diagnostics) {
	assertCurrent?.();
	const startedAt = diagnostics ? performance.now() : 0;
	const finishAdmission = diagnostics ? () => {
		if (diagnostics.admissionMs === void 0) diagnostics.admissionMs = performance.now() - startedAt;
	} : void 0;
	const admittedOperation = finishAdmission ? (database) => {
		finishAdmission();
		return operation(database);
	} : operation;
	try {
		if (getAssistantAgentDatabaseIfOpen(options)) {
			if (diagnostics) diagnostics.admissionMode = "cached";
			return admittedOperation(openAssistantAgentDatabase(options));
		}
		if (diagnostics) diagnostics.admissionMode = "async";
		const result = withAssistantAgentDatabaseAsync(options, admittedOperation, assertCurrent);
		return finishAdmission ? result.finally(finishAdmission) : result;
	} catch (error) {
		finishAdmission?.();
		throw error;
	}
}
function artifactPreparationLogFields(diagnostics) {
	const milliseconds = (value) => value === void 0 ? void 0 : Math.round(value);
	return {
		admissionMode: diagnostics.admissionMode,
		admissionMs: milliseconds(diagnostics.admissionMs),
		nodeInventoryMs: milliseconds(diagnostics.nodeInventoryMs),
		referencePlanningMs: milliseconds(diagnostics.referencePlanningMs),
		orphanPlanningMs: milliseconds(diagnostics.orphanPlanningMs),
		markerScanMs: milliseconds(diagnostics.markerScanMs),
		nodeRows: diagnostics.nodeRows,
		windowRows: diagnostics.windowRows,
		referenceIds: diagnostics.referenceIds,
		selectedEntries: diagnostics.selectedEntries,
		markerWindows: diagnostics.markerWindows,
		markerRows: diagnostics.markerRows,
		deletePlans: diagnostics.deletePlans,
		completed: diagnostics.completed === true
	};
}
async function runExclusiveSqliteSessionWrite(scope, fn, operation, diagnostics, writer = "foreground") {
	const databaseOptions = toDatabaseOptions(scope);
	const timing = {};
	return observeSqliteSessionWrite(scope, () => writer === "worker" ? runAssistantAgentWorkerWrite(databaseOptions, fn, timing) : runAssistantAgentWriteAdmission(databaseOptions, fn, false, timing), operation, diagnostics, writer, timing);
}
/** Observe multi-unit maintenance without retaining foreground admission between units. */
async function observeSqliteSessionWrite(scope, fn, operation, diagnostics, writer = "foreground", timing = {}) {
	const databaseOptions = toDatabaseOptions(scope);
	const storePath = resolveAssistantAgentSqlitePath(databaseOptions);
	const startedAt = performance.now();
	const timingFields = (completedAt) => ({
		pid: process.pid,
		threadId,
		isMainThread,
		operation,
		...diagnostics?.kind ? { reclamationKind: diagnostics.kind } : {},
		...diagnostics?.workerThreadId !== void 0 ? { workerThreadId: diagnostics.workerThreadId } : {},
		...diagnostics?.artifactPreparation ? { artifactPreparation: artifactPreparationLogFields(diagnostics.artifactPreparation) } : {},
		elapsedMs: Math.round(completedAt - startedAt),
		...timing.startedAt !== void 0 && timing.finishedAt !== void 0 ? {
			queueWaitMs: Math.round(timing.startedAt - startedAt),
			writerExecutionMs: Math.round(timing.finishedAt - timing.startedAt),
			completionDelayMs: Math.round(completedAt - timing.finishedAt)
		} : {}
	});
	const logFields = (completedAt) => ({
		agentId: scope.agentId,
		...timingFields(completedAt),
		...diagnostics?.reclamationAdmission ? {
			reclamationAdmissionId: diagnostics.reclamationAdmission.admissionId,
			reclamationAdmissionReleaseCause: diagnostics.reclamationAdmission.releaseCause
		} : {},
		storePath
	});
	let completedAt = startedAt;
	let outcome = "ok";
	const owned = () => withSqliteReaderOwner({
		operation,
		ownerKind: isMainThread ? "main" : "worker",
		actorId: threadId
	}, fn);
	try {
		const result = await owned();
		completedAt = performance.now();
		if (completedAt - startedAt >= SQLITE_SESSION_SLOW_WRITE_MS) getChildLogger({ subsystem: "session-sqlite" }).warn("slow SQLite session write", logFields(completedAt));
		return result;
	} catch (error) {
		outcome = "error";
		completedAt = performance.now();
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session write failed", {
			...logFields(completedAt),
			error: truncateUtf16Safe(formatErrorMessageWithCode(error), SQLITE_SESSION_WRITE_ERROR_MAX_CHARS)
		});
		throw error;
	} finally {
		if (sessionWriteDiagnostics.hasSubscribers) sessionWriteDiagnostics.publish({
			...timingFields(completedAt),
			writer,
			outcome
		});
	}
}
function resolveSqliteDatabaseScopeIdentity(scope) {
	const parsedAgentId = parseAgentSessionKey(scope.sessionKey)?.agentId;
	const scopedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : parsedAgentId;
	const incognitoAgentId = isIncognitoSessionKey(scope.sessionKey) ? resolveAgentIdFromSessionKey(scope.sessionKey) : void 0;
	const effectiveStorePath = incognitoAgentId ? resolveIncognitoAssistantAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : scope.storePath;
	return {
		effectiveAgentId: incognitoAgentId ?? scopedAgentId,
		effectiveStorePath
	};
}
function resolveSqliteDatabaseScope(scope, targetCache, preparedStoreTarget) {
	const { effectiveAgentId, effectiveStorePath } = resolveSqliteDatabaseScopeIdentity(scope);
	const storeTarget = preparedStoreTarget ?? (effectiveStorePath ? resolveCachedSqliteStoreTarget({
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		env: scope.env,
		storePath: effectiveStorePath
	}, targetCache) : void 0);
	return {
		agentId: resolveSqliteAgentId({
			scopedAgentId: effectiveAgentId,
			sessionKey: scope.sessionKey,
			storeAgentId: storeTarget?.agentId,
			storeShared: storeTarget?.shared
		}),
		...storeTarget?.shared && storeTarget.agentId ? { databaseAgentId: storeTarget.agentId } : {},
		...scope.env ? { env: scope.env } : {},
		...effectiveStorePath ? { ownerStorePath: effectiveStorePath } : {},
		...storeTarget ? { path: storeTarget.path } : {}
	};
}
function resolveSqliteScope(scope, targetCache) {
	const { agentId, ...database } = resolveSqliteDatabaseScope(scope, targetCache);
	if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
	const normalizedSessionKey = normalizeSqliteSessionKey(scope.sessionKey);
	const sessionKey = !normalizedSessionKey || normalizedSessionKey === "global" || normalizedSessionKey === "unknown" || parseAgentSessionKey(normalizedSessionKey) ? normalizedSessionKey : toAgentStoreSessionKey({
		agentId,
		requestKey: normalizedSessionKey
	});
	return {
		agentId,
		...database,
		sessionKey
	};
}
function resolveSqliteReadScope(scope, targetCache, preparedStoreTarget) {
	const sessionKey = scope.sessionKey ? normalizeSqliteSessionKey(scope.sessionKey) : void 0;
	const { agentId, ...database } = resolveSqliteDatabaseScope({
		...scope,
		sessionKey
	}, targetCache, preparedStoreTarget);
	if (!agentId) throw new Error("Cannot resolve SQLite transcript read scope without an agent id");
	return {
		agentId,
		...database,
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveCachedSqliteStoreTarget(params, targetCache) {
	if (!targetCache) return resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	const envCache = targetCache.get(params.env) ?? /* @__PURE__ */ new Map();
	targetCache.set(params.env, envCache);
	const cacheKey = JSON.stringify([
		params.storePath,
		params.agentId,
		params.defaultAgentId
	]);
	const cached = envCache.get(cacheKey);
	if (cached) return cached;
	const resolved = resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	envCache.set(cacheKey, resolved);
	return resolved;
}
function resolveSqliteStoreScope(storePath, options = {}) {
	return resolveSqliteScope({
		...options.agentId ? { agentId: options.agentId } : {},
		sessionKey: "",
		storePath
	});
}
function resolveSqliteAgentId(params) {
	const scopedAgentId = params.scopedAgentId ? normalizeAgentId(params.scopedAgentId) : void 0;
	if (scopedAgentId && params.storeAgentId && scopedAgentId !== params.storeAgentId && !params.storeShared) throw new Error(`SQLite session store path belongs to agent ${params.storeAgentId}; requested agent ${scopedAgentId}.`);
	const parsedAgentId = params.sessionKey ? parseAgentSessionKey(params.sessionKey)?.agentId : void 0;
	return scopedAgentId ?? params.storeAgentId ?? parsedAgentId;
}
function resolveSqliteTranscriptArchiveDirectory(scope) {
	const databasePath = resolveAssistantAgentSqlitePath(toDatabaseOptions(scope));
	return resolveSessionArtifactDirectory(databasePath);
}
function resolveSqliteTranscriptScope(scope) {
	if (!scope.sessionId) throw new Error(`Cannot resolve SQLite transcript scope without a session id: ${scope.sessionKey}`);
	if (!scope.sessionKey) throw new Error(`Cannot resolve SQLite transcript scope without a session key: ${scope.sessionId}`);
	return {
		...resolveSqliteScope({
			...scope,
			sessionKey: scope.sessionKey
		}),
		sessionId: scope.sessionId
	};
}
function resolveSqliteTranscriptReadScope(scope, targetCache) {
	return {
		...resolveSqliteReadScope(scope, targetCache),
		sessionId: scope.sessionId
	};
}
/** Prepare file ownership once; the history resource and its kernel consume this same scope. */
async function prepareSqliteTranscriptReadScope(scope, signal) {
	const readScope = {
		...scope,
		sessionKey: scope.sessionKey ? normalizeSqliteSessionKey(scope.sessionKey) : void 0
	};
	if (isIncognitoSessionKey(readScope.sessionKey)) return resolveSqliteTranscriptReadScope(readScope);
	const { effectiveAgentId, effectiveStorePath } = resolveSqliteDatabaseScopeIdentity(readScope);
	return {
		...resolveSqliteReadScope(readScope, void 0, effectiveStorePath ? await prepareSqliteTargetFromSessionStorePath(effectiveStorePath, {
			agentId: effectiveAgentId,
			defaultAgentId: readScope.defaultAgentId,
			env: readScope.env
		}, signal) : void 0),
		sessionId: readScope.sessionId
	};
}
/** Pin the environment and database locator before lifecycle work yields. */
function captureLifecycleDatabaseScope(scope) {
	const env = { ...scope.env ?? process.env };
	env.TESTCLAW_STATE_DIR = resolveStateDir(env);
	return {
		...scope,
		env,
		path: resolveAssistantAgentSqlitePath(toDatabaseOptions({
			...scope,
			env
		}))
	};
}
function toDatabaseOptions(scope) {
	return {
		agentId: scope.databaseAgentId ?? scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.path ? { path: scope.path } : {}
	};
}
function normalizeSqliteSessionKey(sessionKey) {
	return normalizeStoreSessionKey(sessionKey);
}
function cloneSessionEntry(entry) {
	return structuredClone(entry);
}
function formatSqliteSessionReferenceForScope(scope) {
	return scope.sessionKey;
}
/** Legacy identity string retained only for transcript artifact metadata and plugin contracts. */
function formatLegacySqliteSessionMarkerForScope(scope) {
	return formatSqliteSessionFileMarker({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		storePath: scope.path ?? resolveAssistantAgentSqlitePath(toDatabaseOptions(scope))
	});
}
//#endregion
export { transcriptWriteScopeIsCurrent as _, getSessionKysely as a, resolveSqliteAgentId as c, resolveSqliteStoreScope as d, resolveSqliteTranscriptArchiveDirectory as f, toDatabaseOptions as g, runExclusiveSqliteSessionWrite as h, formatSqliteSessionReferenceForScope as i, resolveSqliteReadScope as l, resolveSqliteTranscriptScope as m, cloneSessionEntry as n, normalizeSqliteSessionKey as o, resolveSqliteTranscriptReadScope as p, formatLegacySqliteSessionMarkerForScope as r, prepareSqliteTranscriptReadScope as s, captureLifecycleDatabaseScope as t, resolveSqliteScope as u, withSqliteSessionDatabase as v };
