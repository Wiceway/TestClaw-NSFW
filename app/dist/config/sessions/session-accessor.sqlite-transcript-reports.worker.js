import { n as ok, t as err } from "../../result-BQGgYouL.mjs";
import { i as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-Bar1ps-o.mjs";
import { f as runAssistantAgentWriteTransaction, s as getAssistantAgentDatabaseIfOpen } from "../../testclaw-agent-db-DAdiee0a.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "../../transcript-write-context-DD1eJxQX.mjs";
import { g as toDatabaseOptions } from "../../session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { t as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-RvnlMnYc.mjs";
import { l as readSessionEntryRow } from "../../session-accessor.sqlite-entry-read-Cah7Q8q_.mjs";
import "../../session-accessor.sqlite-entry-store-Ct1v5fIu.mjs";
import { o as readTranscriptContextVersionInTransaction } from "../../session-accessor.sqlite-transcript-state-DELnx7YZ.mjs";
import { y as advanceCliHistoryBoundaryRangeInTransaction } from "../../session-accessor.sqlite-transcript-store-oZ7bC7_7.mjs";
import { n as resolveTranscriptAppendRefusal } from "../../session-accessor.sqlite-transcript-write-guard-BUjHzNXo.mjs";
import { r as prepareTranscriptReportSelection, t as appendSelectedTranscriptReportInTransaction } from "../../session-accessor.sqlite-transcript-reports.kernel-DESGawAC.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.worker.ts
/** Domain binding borrows the existing SQLite broker's canonical writer. */
function bindSqliteWorkerBackend(target, context) {
	const { fence } = target;
	const resolved = {
		...target.resolved,
		env: getSqliteWorkerStateContext().environment
	};
	const options = toDatabaseOptions(resolved);
	const database = getAssistantAgentDatabaseIfOpen(options);
	if (!database || database.db !== context.database || database.path !== context.databasePath) throw new Error("Transcript report lost its canonical database owner");
	let closed = false;
	const assertOpen = () => {
		if (closed || !database.db.isOpen) throw new Error("Transcript report domain is closed");
		assertTransactionUsable(database.db);
	};
	const readRefusal = () => {
		return resolveTranscriptAppendRefusal(readSessionEntryRow(database, resolved.sessionKey, "list")?.entry, resolved, {
			...resolved,
			...fence
		});
	};
	let prepared;
	return {
		execute(command) {
			assertOpen();
			if (command.type === "prepare") return runSqliteDeferredTransactionSync(database.db, () => {
				prepared = void 0;
				const refusal = readRefusal();
				if (refusal) return err(refusal);
				prepared = {
					facts: prepareTranscriptReportSelection(database, resolved, command.input),
					version: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
				};
				return ok(prepared.facts);
			});
			return runAssistantAgentWriteTransaction((current) => {
				if (current.db !== database.db) throw new Error("Transcript report lost its canonical database owner");
				context.admit("transaction");
				const refusal = readRefusal();
				if (refusal) {
					context.admit("commit");
					return err(refusal);
				}
				const firstSeq = target.cliWriter ? (readTranscriptContextVersionInTransaction(database, resolved.sessionId).rawSeq ?? -1) + 1 : void 0;
				let projectionNeedsReconcile = false;
				const projection = {
					scheduleProjectionReconcile: false,
					onProjectionReconcileNeeded: () => {
						projectionNeedsReconcile = true;
					}
				};
				if (command.type === "assistant") {
					const facts = prepareTranscriptReportSelection(database, resolved, {
						kind: "assistant",
						responseId: command.input.message.responseId
					});
					if (!facts.suppressed) appendSelectedTranscriptReportInTransaction(database, resolved, facts.appendParentId, command.input, projection, command.input.preparedMessage);
				} else {
					const plan = prepared;
					prepared = void 0;
					if (!plan || plan.facts.suppressed) throw new Error("Transcript report append requires its prepared selection");
					const currentVersion = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
					if (!isDeepStrictEqual(currentVersion, plan.version)) {
						context.admit("commit");
						return ok({
							committed: false,
							projectionNeedsReconcile: false
						});
					}
					appendSelectedTranscriptReportInTransaction(database, resolved, plan.facts.appendParentId, command.input, projection);
				}
				let commitGranted = false;
				const authorizeCommit = () => {
					if (!commitGranted) {
						context.admit("commit");
						commitGranted = true;
					}
				};
				const cliHistoryChanged = target.cliWriter && firstSeq !== void 0 ? advanceCliHistoryBoundaryRangeInTransaction(database, resolved, {
					first: firstSeq,
					last: readTranscriptContextVersionInTransaction(database, resolved.sessionId).rawSeq ?? -1
				}, target.cliWriter, authorizeCommit) : false;
				const rebound = readRefusal();
				if (rebound) throw new SessionTranscriptWriterClaimReboundError(rebound);
				authorizeCommit();
				return ok({
					committed: true,
					projectionNeedsReconcile,
					cliHistoryChanged
				});
			}, options, { operationLabel: "session.transcript.report" });
		},
		assertSettled() {
			assertOpen();
			if (database.db.isTransaction) throw new Error("Transcript report command left a transaction open");
		},
		close() {
			closed = true;
			prepared = void 0;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
