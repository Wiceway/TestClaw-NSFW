import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import "./session-key-AvQIavYt.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { G as getAssistantAgentDatabaseValidation, X as markAssistantAgentCanonicalValidation, et as isAssistantAgentDatabasePathCurrent, q as hasAssistantAgentCanonicalValidation, tt as readAssistantAgentDatabaseIdentity } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { a as resolveAssistantStateDirForDatabasePath, s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-De8qPH1y.js";
import { a as resolveAssistantAgentSqlitePath, r as isIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import "./testclaw-agent-db-Ckg86YCZ.js";
import { t as retainAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-BtPeevnE.js";
import { h as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { n as hasPendingCanonicalSessionValidation } from "./session-canonical-validation-BPo0CSiD.js";
import { c as withSqliteMutationWorkerLifetime, u as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-archive-CRMka_kI.js";
import { r as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-BgbzFdQ4.js";
import { setTimeout } from "node:timers/promises";
//#region src/config/sessions/session-canonical-validation-readiness.ts
const MAX_BATCH_ROWS = 128;
const MAX_BATCH_BYTES = 1048576;
const CONTENTION_BACKOFF_MS = [
	0,
	25,
	100,
	250
];
const log = createSubsystemLogger("sessions/canonical-validation");
/** Certify dirty persisted rows before startup maintenance reads their full entries. */
async function certifySessionCanonicalValidationPending(options, withWorker = withSqliteReclamationWorker, assertCurrentOwner) {
	assertCurrentOwner?.();
	const sourceEnv = options.env ?? process.env;
	const pathname = resolveAssistantAgentSqlitePath(options);
	if (isIncognitoAssistantAgentSqlitePath(pathname, options)) return;
	const retained = retainAssistantAgentDatabaseReadOnly(options);
	if (!retained.found) return;
	const { database, claim } = retained;
	let oversizedRows = 0;
	try {
		let initializeCanonicalValidation = !hasAssistantAgentCanonicalValidation(database);
		if (!initializeCanonicalValidation && !hasPendingCanonicalSessionValidation(database)) return;
		const databaseOptions = {
			agentId: normalizeAgentId(options.agentId),
			path: readAssistantAgentDatabaseIdentity(database).filename,
			env: {
				TESTCLAW_STATE_DIR: resolveAssistantStateDirForDatabasePath(options.database?.path ?? resolveAssistantStateSqlitePath(sourceEnv)),
				...isGatewayExternallySupervised(sourceEnv) ? { TESTCLAW_SUPERVISOR_MODE: "external" } : {}
			}
		};
		return await withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent: assertReadinessCurrent }) => {
			try {
				let contendedBatches = 0;
				let validation = getAssistantAgentDatabaseValidation(database);
				while (true) {
					assertCurrentOwner?.();
					assertReadinessCurrent();
					claim.assertCurrent();
					const result = await withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent, commitGate, signal }) => await withWorker(databaseOptions, claim, async (worker) => {
						const assertCommitAllowed = () => {
							assertCurrentOwner?.();
							assertReadinessCurrent();
							assertCurrent();
							worker.assertCurrent(databaseOptions, claim);
						};
						assertCommitAllowed();
						return await withSqliteReclamationAuthorization(commitGate, database.db, assertCommitAllowed, (authorize) => worker.runCanonicalValidation({
							databaseOptions,
							claim,
							validationOwner: {
								database,
								isCurrent: claim.isCurrent
							},
							commitGate,
							maxRows: MAX_BATCH_ROWS,
							maxBytes: MAX_BATCH_BYTES,
							initializeCanonicalValidation,
							onCommitRequest: authorize,
							withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
								let refusal;
								try {
									assertCommitAllowed();
								} catch (error) {
									refusal = { error };
								}
								await run(refusal);
							}, "session.canonical-validation.certify", { reclamationAdmission }, "worker")
						}));
					}, () => {
						assertCurrentOwner?.();
						assertReadinessCurrent();
						assertCurrent();
						claim.assertCurrent();
					}, signal));
					assertCurrentOwner?.();
					assertReadinessCurrent();
					claim.assertCurrent();
					const currentValidation = getAssistantAgentDatabaseValidation(database);
					if (!currentValidation || validation && validation !== currentValidation) throw new Error("SQLite session reclamation database owner is no longer current");
					validation ??= currentValidation;
					oversizedRows += result.oversizedRows;
					if (!result.hasMore) {
						if (!isAssistantAgentDatabasePathCurrent(database) || !markAssistantAgentCanonicalValidation(database)) throw new Error("SQLite session reclamation database owner is no longer current");
						return;
					}
					if (initializeCanonicalValidation) {
						initializeCanonicalValidation = false;
						continue;
					}
					if (result.certifiedRows === 0) {
						const waitMs = CONTENTION_BACKOFF_MS[contendedBatches] ?? 250;
						contendedBatches = Math.min(contendedBatches + 1, CONTENTION_BACKOFF_MS.length - 1);
						await setTimeout(waitMs);
					} else contendedBatches = 0;
				}
			} finally {
				claim.release();
			}
		});
	} finally {
		claim.release();
		if (oversizedRows > 0) log.warn("Canonical session validation processed oversized rows in its Worker", {
			path: pathname,
			rows: oversizedRows,
			batchByteLimit: MAX_BATCH_BYTES
		});
	}
}
//#endregion
export { certifySessionCanonicalValidationPending };
