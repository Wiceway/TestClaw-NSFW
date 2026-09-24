import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import "./session-key-C_bfgyCp.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-xVA5A4Bb.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { r as getRuntimeConfig } from "./io.runtime-DIHH_X2V.mjs";
import "./config-DqAgdhnz.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-TFRevCb_.mjs";
import { g as toDatabaseOptions, s as prepareSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DCABr_1E.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-BM_e7CiR.mjs";
import { t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-CGoOj7Ld.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-BDowgQjd.mjs";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-Dvzu7WpB.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-CQrIlHvH.mjs";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-ENI63DQX.mjs";
import path from "node:path";
//#region src/config/sessions/session-history-worker-runtime.ts
const queuedHistoryReads = /* @__PURE__ */ new Map();
let pendingHistoryReaders = 0;
let pendingHistoryBytes = 0;
function receivePage(queued, signal) {
	queued.remainingReaders++;
	return queued.promise.then((page) => {
		queued.remainingReaders--;
		signal?.throwIfAborted();
		return queued.remainingReaders === 0 ? page : structuredClone(page);
	}, (error) => {
		queued.remainingReaders--;
		if (error instanceof SessionHistoryDeltaPreparationError) {
			signal?.throwIfAborted();
			if (queued.remainingReaders > 0) throw new SessionHistoryDeltaPreparationError(structuredClone(error.partial));
		}
		throw error;
	});
}
function readQueuedHistory(input, key, owner, signal) {
	signal?.throwIfAborted();
	const existing = queuedHistoryReads.get(key);
	if (existing) return receivePage(existing, signal);
	const pending = createDeferredCore();
	const queued = {
		promise: pending.promise,
		remainingReaders: 0
	};
	queuedHistoryReads.set(key, queued);
	const forget = () => {
		if (queuedHistoryReads.get(key) === queued) queuedHistoryReads.delete(key);
	};
	(input.kind === "cold-metadata" ? owner.readColdMetadata({
		sessionId: input.sessionId,
		env: input.env
	}) : owner.run(() => {
		forget();
		return input;
	}, key.length * 2)).then((result) => {
		forget();
		pending.resolve(result);
	}, (error) => {
		forget();
		pending.reject(error);
	});
	return receivePage(queued, signal);
}
function captureHistoryRequest(request) {
	if (request.kind === "delta" || request.kind === "message-lookup" || request.kind === "recent") {
		const target = request.params.target;
		const capturedTarget = {
			...target,
			sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0,
			...target.env ? { env: captureSessionTranscriptStorageEnvironment(target.env) } : {}
		};
		if (request.kind === "recent") return {
			kind: "recent",
			params: {
				target: capturedTarget,
				maxMessages: request.params.maxMessages,
				maxLines: request.params.maxLines,
				allowResetArchiveFallback: request.params.allowResetArchiveFallback
			}
		};
		return request.kind === "delta" ? {
			kind: "delta",
			params: {
				target: capturedTarget,
				limits: { ...request.params.limits }
			}
		} : {
			kind: "message-lookup",
			params: {
				target: capturedTarget,
				messageId: request.params.messageId
			}
		};
	}
	const entry = request.kind === "rpc" ? request.params.entry : request.params.target.sessionEntry;
	const capturedEntry = entry ? {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		sessionStartedAt: entry.sessionStartedAt
	} : void 0;
	if (request.kind === "rpc") {
		const params = request.params;
		return {
			kind: "rpc",
			params: {
				entry: capturedEntry,
				provider: params.provider,
				sessionId: params.sessionId,
				storePath: params.storePath,
				sessionAgentId: params.sessionAgentId,
				canonicalKey: params.canonicalKey,
				max: params.max,
				maxHistoryBytes: params.maxHistoryBytes,
				effectiveMaxChars: params.effectiveMaxChars,
				offset: params.offset,
				messageId: params.messageId,
				ignoreCliSessionImports: params.ignoreCliSessionImports
			}
		};
	}
	const params = request.params;
	return {
		kind: "http",
		params: {
			target: {
				agentId: params.target.agentId,
				sessionEntry: capturedEntry,
				sessionId: params.target.sessionId,
				sessionKey: params.target.sessionKey,
				storePath: params.target.storePath,
				...params.target.env ? { env: captureSessionTranscriptStorageEnvironment(params.target.env) } : {}
			},
			maxChars: params.maxChars,
			limit: params.limit,
			cursor: params.cursor
		}
	};
}
async function readSessionHistoryPageInWorker(request, signal) {
	signal?.throwIfAborted();
	const capturedRequest = captureHistoryRequest(request);
	const scope = capturedRequest.kind === "rpc" ? {
		agentId: capturedRequest.params.sessionAgentId,
		sessionId: capturedRequest.params.sessionId,
		sessionEntry: capturedRequest.params.entry,
		sessionKey: capturedRequest.params.canonicalKey,
		storePath: capturedRequest.params.storePath
	} : capturedRequest.params.target;
	const env = captureSessionTranscriptStorageEnvironment(scope.env ?? process.env);
	const bound = prepareSessionTranscriptReadTargetCore(scope);
	const capturedScope = {
		...scope,
		agentId: bound.agentId,
		storePath: path.resolve(bound.storePath),
		env
	};
	const stateContext = captureAssistantStateWorkerContext({ env });
	const cfg = getRuntimeConfig();
	const receipt = resolveSessionTranscriptReadFence({
		agentId: normalizeAgentId(bound.agentId),
		sessionId: scope.sessionId
	});
	const admission = receipt ? { ...receipt } : void 0;
	let resolved;
	let inputBytes = JSON.stringify(capturedRequest).length * 2;
	if (pendingHistoryReaders >= 128 || pendingHistoryBytes + inputBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
	pendingHistoryReaders++;
	pendingHistoryBytes += inputBytes;
	try {
		resolved = await prepareSqliteTranscriptReadScope(capturedScope, signal);
		signal?.throwIfAborted();
		stateContext.maintenanceScope?.assertAdmission();
		stateContext.admission.assertCurrent();
		const entryValidationKey = bound.entryValidationScope ? resolveSqliteScope({
			agentId: resolved.agentId,
			sessionKey: bound.entryValidationScope.sessionKey
		}).sessionKey : void 0;
		const sessionKey = entryValidationKey ?? bound.sessionKey;
		const normalizedSessionKey = entryValidationKey ?? resolved.sessionKey;
		const databaseOptions = toDatabaseOptions(resolved);
		const currentSource = {
			agentId: databaseOptions.agentId,
			path: resolveAssistantAgentSqlitePath(databaseOptions)
		};
		const sourceReads = prepareGatewaySessionStoreReadSources({
			cfg,
			currentSource,
			env,
			registryPath: stateContext.admission.databasePath
		});
		const assertStateCurrent = () => {
			signal?.throwIfAborted();
			stateContext.maintenanceScope?.assertAdmission();
			stateContext.admission.assertCurrent();
			sourceReads.assertCurrent();
		};
		assertStateCurrent();
		const input = {
			kind: "history-page",
			database: currentSource,
			request: capturedRequest,
			target: {
				transcript: {
					agentId: resolved.agentId,
					sessionId: resolved.sessionId,
					...normalizedSessionKey ? { sessionKey: normalizedSessionKey } : {},
					storePath: capturedScope.storePath,
					sessionFile: sessionKey ?? resolved.sessionId
				},
				stateDatabase: {
					path: stateContext.admission.databasePath,
					environment: stateContext.environment,
					coordinatorRuntime: stateContext.coordinatorRuntime
				},
				sourceDatabases: sourceReads.sources,
				...entryValidationKey ? { entryValidationKey } : {}
			},
			...admission ? { admission } : {}
		};
		const key = JSON.stringify(input);
		const metadataInput = {
			kind: "cold-metadata",
			database: currentSource,
			sessionId: resolved.sessionId,
			env
		};
		const metadataKey = JSON.stringify(metadataInput);
		const additionalBytes = (key.length + metadataKey.length) * 2 - inputBytes;
		if (pendingHistoryBytes + additionalBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
		pendingHistoryBytes += additionalBytes;
		inputBytes += additionalBytes;
		const preparedTarget = resolved;
		const acquired = await withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
			const assertCurrent = () => {
				assertStateCurrent();
				owner.assertCurrent();
			};
			let result;
			try {
				result = await readRestoredSessionTranscript(capturedScope, async () => {
					assertCurrent();
					const page = await readQueuedHistory(input, `${owner.generation}:${key}`, owner, signal);
					if (page.kind === "cold-metadata") throw new Error("Session history worker returned cold metadata instead of history");
					return page;
				}, {
					assertCurrent,
					coldRead: {
						target: preparedTarget,
						readMetadata: async (phase) => {
							assertCurrent();
							const metadata = phase === "initial" ? await readQueuedHistory(metadataInput, `${owner.generation}:${metadataKey}`, owner, signal) : await owner.readColdMetadata({
								sessionId: metadataInput.sessionId,
								env
							});
							assertCurrent();
							if (metadata.kind !== "cold-metadata") throw new Error("Session history worker returned history instead of cold metadata");
							return metadata.archive;
						}
					}
				});
			} catch (error) {
				if (error instanceof SessionHistoryDeltaPreparationError && capturedRequest.kind === "delta") {
					owner.assertCurrent();
					result = {
						kind: "delta",
						...error.partial
					};
				} else throw error;
			}
			return {
				result,
				assertCurrent: owner.assertCurrent
			};
		});
		const assertCurrent = () => {
			acquired.assertCurrent();
			assertStateCurrent();
		};
		assertCurrent();
		const result = acquired.result;
		if (result.kind !== capturedRequest.kind) throw new Error("Session history worker returned the wrong page type");
		return result.kind === "rpc" ? result.page : result.kind === "http" ? result.snapshot : result.kind === "delta" ? {
			...result,
			assertCurrent
		} : result.messages;
	} catch (error) {
		if (resolved && isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
			...toDatabaseOptions(resolved),
			preferredSessionId: resolved.sessionId
		});
		throw error;
	} finally {
		pendingHistoryReaders--;
		pendingHistoryBytes -= inputBytes;
	}
}
//#endregion
export { readSessionHistoryPageInWorker };
