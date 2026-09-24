import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { n as cloneEnvWithPlatformSemantics } from "../../config-env-vars-DSeyJ5Sb.mjs";
import { t as serveOwnedWorkerTasks } from "../../worker-task-server-B4qQGSM6.mjs";
import { r as readSessionColdTranscript } from "../../session-cold-storage-state-lHKSo6QB.mjs";
import { a as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-BM_e7CiR.mjs";
import { n as encodeSessionTranscriptWorkerError, r as sessionHistoryCleanupError, t as SessionHistoryDeltaPreparationError } from "../../session-history-worker-errors-CGoOj7Ld.mjs";
//#region src/config/sessions/session-transcript.worker.ts
const MAX_RETAINED_HISTORY_DATABASES = 64;
const historyDatabaseScopes = /* @__PURE__ */ new Map();
async function withHistoryDatabase(database, operation) {
	const key = JSON.stringify(database);
	let retained = historyDatabaseScopes.get(key);
	if (!retained) {
		const { AssistantAgentDatabaseReadOnlyScope } = await import("../../testclaw-agent-db-readonly-scope-DmIJMSU_.mjs");
		retained = {
			database,
			scope: new AssistantAgentDatabaseReadOnlyScope()
		};
	}
	const { scope } = retained;
	try {
		const value = await scope.run(database, operation);
		historyDatabaseScopes.delete(key);
		if (!scope.hasRetainedConnection) return {
			value,
			closedHistoryDatabase: database
		};
		historyDatabaseScopes.set(key, retained);
		if (historyDatabaseScopes.size > MAX_RETAINED_HISTORY_DATABASES) {
			const oldest = historyDatabaseScopes.entries().next().value;
			oldest[1].scope.close();
			historyDatabaseScopes.delete(oldest[0]);
			return {
				value,
				closedHistoryDatabase: oldest[1].database
			};
		}
		return { value };
	} catch (error) {
		try {
			scope.close();
		} catch (cleanupError) {
			throw sessionHistoryCleanupError(error, cleanupError, "database close");
		}
		throw error;
	}
}
let closeReadOnlyCandidates;
serveOwnedWorkerTasks(async (input, channel, control) => {
	closeReadOnlyCandidates ??= (await import("../../testclaw-agent-db-readonly-scope-DmIJMSU_.mjs")).closeAssistantAgentDatabaseReadOnlyCandidates;
	const request = input;
	if (request.kind === "sqlite-target") {
		const { resolveSqliteTargetFromSessionStorePath } = await import("../../session-sqlite-target-C-f5VyLr.mjs");
		return {
			ok: true,
			value: { target: resolveSqliteTargetFromSessionStorePath(request.storePath, request) }
		};
	}
	if (request.kind === "usage-cost") {
		const { executeUsageCostWorker, usageCostWorkerFailure } = await import("../../session-cost-usage-worker-BFUM952Z.mjs");
		try {
			if (!channel) throw new Error("Usage cost worker requires its host channel");
			const closed = /* @__PURE__ */ new Map();
			return {
				ok: true,
				value: await executeUsageCostWorker(request, channel, control, async (database, read) => {
					closed.delete(JSON.stringify(database));
					const result = await withHistoryDatabase(database, read);
					if (result.closedHistoryDatabase) closed.set(JSON.stringify(result.closedHistoryDatabase), result.closedHistoryDatabase);
					return result.value;
				}),
				closedDatabases: [...closed.values()]
			};
		} catch (error) {
			return usageCostWorkerFailure(error);
		}
	}
	try {
		if (request.kind === "session-archive-pruning") {
			const { readSessionArchivePruningInWorker } = await import("../../session-history-archive-pruning.worker-hmyCtdnE.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "session-archive-pruning",
					result: readSessionArchivePruningInWorker(request)
				}))
			};
		}
		if (request.kind === "cold-metadata") {
			const { withAssistantAgentDatabaseReadOnly } = await import("../../testclaw-agent-db-readonly-MSDkfb35.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withAssistantAgentDatabaseReadOnly((database) => readSessionColdTranscript(database.db, request.sessionId), {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.env)
					});
					return {
						kind: "cold-metadata",
						archive: result.found ? result.value : void 0
					};
				})
			};
		}
		if (request.kind === "transcript-search") {
			const { searchSessionTranscriptsReadOnlySync } = await import("../../session-transcript-search-BlZyZ8RG.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "transcript-search",
					result: searchSessionTranscriptsReadOnlySync(request.params, {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.params.env ?? process.env)
					})
				}))
			};
		}
		if (request.kind === "session-store-target") {
			const { readSessionStoreTarget } = await import("../../session-store-target-inventory-BQdGcg24.mjs");
			return {
				ok: true,
				value: readSessionStoreTarget(request.request)
			};
		}
		if (request.kind === "session-exact-entries") {
			const { readExactSessionEntriesWithLifecycle } = await import("../../session-entry-read.worker-CkLqfMeS.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readExactSessionEntriesWithLifecycle(request))
			};
		}
		if (request.kind === "session-row-facts") {
			const { readSessionRowDatabaseFacts } = await import("../../session-entry-read.worker-CkLqfMeS.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readSessionRowDatabaseFacts(request))
			};
		}
		if (request.kind === "session-row-backfill") {
			const { readSessionRowTranscriptFields } = await import("../../session-row-transcript-backfill.kernel-D5iMo_Uc.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "session-row-backfill",
					fields: readSessionRowTranscriptFields(request.params)
				}))
			};
		}
		if (request.kind === "session-target-inventory") {
			const { readSessionStoreTargetInventory } = await import("../../session-store-target-inventory-BQdGcg24.mjs");
			return {
				ok: true,
				value: readSessionStoreTargetInventory(request.request)
			};
		}
		if (request.kind === "session-identity-evidence") {
			const { withAssistantAgentDatabaseReadOnly } = await import("../../testclaw-agent-db-readonly-MSDkfb35.mjs");
			const { readSessionIdentityEvidenceInDatabase } = await import("../../session-accessor.sqlite-entry-availability-BFcO8WiP.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-Bjok3kWG.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionIdentityEvidenceInDatabase(database, request.identities)), {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.env)
					});
					return {
						kind: "session-identity-evidence",
						evidence: result.found ? result.value : request.identities.map(() => result.reason === "database-missing" ? { status: "absent" } : {
							status: "unknown",
							reason: result.reason
						})
					};
				})
			};
		}
		if (request.kind === "session-entry-list") {
			const { listSessionEntriesReadOnly } = await import("../../session-accessor.sqlite-entry-list.read-CbJr2VOL.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "session-entry-list",
					entries: listSessionEntriesReadOnly({
						...request.scope,
						env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
					})
				}))
			};
		}
		if (request.kind === "usage-cache") {
			const { readSessionCostUsageCache } = await import("../../session-cost-usage-cache-read-ByrUbrmt.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readSessionCostUsageCache({
					...request.database,
					env: request.env
				}, request.request))
			};
		}
		if (request.kind === "branch-summaries") {
			const { readSessionBranchSummariesInWorker } = await import("../../session-accessor.sqlite-branches-jqrCA9Yg.mjs");
			return {
				ok: true,
				value: readSessionBranchSummariesInWorker(request.request)
			};
		}
		if (request.kind === "session-membership-facts") {
			const { withAssistantAgentDatabaseReadOnly } = await import("../../testclaw-agent-db-readonly-MSDkfb35.mjs");
			const { readSessionMembershipFactsInDatabase } = await import("../../session-membership-facts-DiwCId77.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-Bjok3kWG.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withAssistantAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionMembershipFactsInDatabase(database, request.sessionKeys)), {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.env)
					});
					if (!result.found && result.reason !== "database-missing") throw new Error(`Session membership read unavailable: ${result.reason}`);
					return result.found ? result.value : {
						kind: "session-membership-facts",
						facts: []
					};
				})
			};
		}
		if (request.kind === "session-members") {
			const { withAssistantAgentDatabaseReadOnly } = await import("../../testclaw-agent-db-readonly-MSDkfb35.mjs");
			const { listSessionMembersInDatabase } = await import("../../session-sharing-store.kernel-CWXCMmCW.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withAssistantAgentDatabaseReadOnly((database) => listSessionMembersInDatabase(database, request.sessionKey), {
						...request.database,
						env: request.env
					});
					return result.found ? result.value : [];
				})
			};
		}
		if (request.kind === "session-progress-card") {
			const { withAssistantAgentDatabaseReadOnly } = await import("../../testclaw-agent-db-readonly-MSDkfb35.mjs");
			const { readSessionProgressCard } = await import("../../progress-card-store-CO9GkdHk.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withAssistantAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, request.sessionKey), {
						...request.database,
						env: request.env
					});
					return {
						kind: "session-progress-card",
						card: result.found ? result.value : null
					};
				})
			};
		}
		if (request.kind === "session-row-presence") {
			const { loadSessionEntryReadOnlyInScope } = await import("../../session-accessor.sqlite-entry-BnRhGs_O.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => loadSessionEntryReadOnlyInScope({
					...request.scope,
					projection: "list"
				}) !== void 0)
			};
		}
		return await runWithSessionTranscriptReadFence(request.admission, async () => {
			if (request.kind === "session-title-fields") {
				const { readSessionTitleFieldsFromTranscript } = await import("../../session-transcript-title-reader-CIpUBiU4.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => ({
						kind: "session-title-fields",
						fields: readSessionTitleFieldsFromTranscript(request.scope, {
							includeInterSession: request.includeInterSession,
							readOnly: true
						})
					}))
				};
			}
			if (request.kind === "session-preview") {
				const { readSessionPreviewItemsReadOnly } = await import("../../session-transcript-preview-reader-BHTU5aI6.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => ({
						kind: "session-preview",
						items: readSessionPreviewItemsReadOnly(request)
					}))
				};
			}
			if (request.kind === "transcript-hydration" || request.kind === "current-turn-entry") {
				const { readAssistantDatabaseQuarantineFailure } = await import("../../testclaw-quarantine-store-BFnAlzil.mjs");
				const quarantine = readAssistantDatabaseQuarantineFailure("agent", request.database.path, { env: request.target.env });
				if (quarantine) throw quarantine;
				if (request.kind === "current-turn-entry") {
					const { readSessionTranscriptCurrentTurnEntry } = await import("../../session-accessor.sqlite-current-turn-BxVxcZs5.mjs");
					return {
						ok: true,
						...await withHistoryDatabase(request.database, () => readSessionTranscriptCurrentTurnEntry(request.target, {
							entryId: request.entryId,
							version: request.version,
							includeEntry: request.includeEntry,
							readOnly: true,
							resolvedScope: request.resolvedScope
						}))
					};
				}
				const { readSessionTranscriptBoundedActiveContextCore } = await import("../../session-accessor.sqlite-active-context-BBk7_zK5.mjs");
				const { streamSessionTranscriptHydration } = await import("../../session-transcript-hydration.worker-CfPxcTw9.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => {
						if (request.limits) return {
							kind: "bounded",
							snapshot: readSessionTranscriptBoundedActiveContextCore(request.target, {
								...request.limits,
								readOnly: true,
								resolvedScope: request.resolvedScope
							})
						};
						if (!channel) throw new Error("Full transcript hydration requires its host channel");
						return streamSessionTranscriptHydration(request, channel, control);
					})
				};
			}
			if (request.kind === "model-context") {
				const { readSessionTranscriptModelContext } = await import("../../session-accessor.sqlite-model-context-CUPSppXk.mjs");
				return {
					ok: true,
					value: readSessionTranscriptModelContext(request.target, request.through, request.limits)
				};
			}
			if (request.kind === "history-page") return {
				ok: true,
				...await withHistoryDatabase(request.database, async () => {
					const { createReadonlySessionHistoryReader } = await import("../../session-history-readonly-reader-RAlwj1Ng.mjs");
					const options = {
						readers: createReadonlySessionHistoryReader({
							...request.target,
							database: request.database
						}),
						readOnly: true,
						deferProfileDisplay: true,
						resolveCronJobName: () => void 0
					};
					if (request.request.kind === "message-lookup") return {
						kind: "message-lookup",
						messages: await options.readers.readSessionMessagesMatchingIdAsync(request.request.params.target, request.request.params.messageId)
					};
					if (request.request.kind === "recent") {
						const { target, ...limits } = request.request.params;
						const { messages } = await options.readers.readRecentSessionMessagesWithStatsAsync(target, limits);
						return {
							kind: "recent",
							messages
						};
					}
					if (request.request.kind === "delta") {
						const { prepareSessionHistoryDelta } = await import("../../session-history-delta-visibility-fW1YW1pG.mjs");
						return {
							kind: "delta",
							...prepareSessionHistoryDelta(options.readers.readTranscriptDisplayDelta(request.request.params.limits), options.readers.subagentCoordination)
						};
					}
					if (request.request.kind === "rpc") {
						const { readChatHistoryPageKernel } = await import("../../chat-history-page-kernel-DRIPmmfi.mjs");
						return {
							kind: "rpc",
							page: await readChatHistoryPageKernel(request.request.params, options)
						};
					}
					const { readSessionHistorySnapshotKernel } = await import("../../session-history-snapshot-C_-G024U.mjs");
					return {
						kind: "http",
						snapshot: await readSessionHistorySnapshotKernel(request.request.params, options)
					};
				})
			};
			const { buildSessionEntryInProcess, readSessionEntryResetRecallCutoff } = await import("../../session-files-CsEjbwzm.mjs");
			const { createSensitiveTextRedactor } = await import("../../redact-CV8_zTb8.mjs");
			const entry = await buildSessionEntryInProcess(request.absPath, request.options, createSensitiveTextRedactor(request.redaction));
			return {
				ok: true,
				value: {
					entry,
					resetRecallCutoff: entry ? readSessionEntryResetRecallCutoff(entry) : { state: "absent" }
				}
			};
		});
	} catch (error) {
		if (error instanceof SessionHistoryDeltaPreparationError && request.kind === "history-page" && request.request.kind === "delta") return {
			ok: false,
			error: {
				kind: "delta-visibility",
				partial: error.partial
			}
		};
		if (error instanceof SyntaxError && request.kind === "history-page" && request.request.kind === "message-lookup") return {
			ok: false,
			error: {
				kind: "syntax",
				message: error.message
			}
		};
		const encoded = encodeSessionTranscriptWorkerError(error);
		if (encoded) return {
			ok: false,
			error: encoded
		};
		throw error;
	}
}, { closeResource: (key) => {
	const parsed = key === void 0 ? void 0 : JSON.parse(key);
	if (!Array.isArray(parsed) || !parsed.every((candidate) => isRecord(candidate) && typeof candidate.path === "string" && (candidate.scope === void 0 || candidate.scope === "sibling-family"))) throw new Error("Session reader cleanup requires captured physical paths");
	const candidates = parsed.map((candidate) => candidate.scope ? {
		path: candidate.path,
		scope: candidate.scope
	} : { path: candidate.path });
	closeReadOnlyCandidates?.(candidates);
	for (const [identity, retained] of historyDatabaseScopes) if (!retained.scope.hasRetainedConnection) historyDatabaseScopes.delete(identity);
} });
//#endregion
export {};
