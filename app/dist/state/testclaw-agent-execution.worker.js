import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { o as sqliteReaderDatabasePathKey } from "../sqlite-reader-lifecycle-BYUk2TxG.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-Bar1ps-o.mjs";
import { n as createSqliteLifecycleAggregateError } from "../sqlite-coordinator-BtCcPgOj.mjs";
import { u as onSqliteWalCheckpoint } from "../sqlite-wal-36gEREe5.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-CR_ZuhW6.mjs";
import { v as requireAssistantStateDatabaseIdentity, y as retainAssistantStateDatabase } from "../testclaw-state-db-cache-DLl9ibxh.mjs";
import { i as readAssistantAgentDatabaseIdentity } from "../testclaw-agent-db-identity-B2JyZwuj.mjs";
import { i as getAssistantAgentDatabaseValidation } from "../testclaw-agent-db-validation-cache-DBMmC7T_.mjs";
import { r as openAssistantStateDatabase } from "../testclaw-state-db-BXFT1fUC.mjs";
import { i as SQLITE_WORKER_PREPARE_COMMAND, t as SQLITE_WORKER_CLOSE_RECEIPT } from "../sqlite-worker-contract-CtlVF-ml.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt, t as SqliteWorkerOpenRefusedError } from "../sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { m as ensureAssistantAgentDatabasePermissions } from "../testclaw-agent-db-maintenance-50rOkGc_.mjs";
import { d as prepareAssistantAgentDatabaseWorkerLease } from "../testclaw-agent-db-lease-gzW677CG.mjs";
import { _ as retainAgentDatabase, a as closeAssistantAgentDatabaseByPath } from "../testclaw-agent-db-lifecycle-BQsqjh85.mjs";
import { f as runAssistantAgentWriteTransaction, l as openAssistantAgentDatabase, s as getAssistantAgentDatabaseIfOpen } from "../testclaw-agent-db-DAdiee0a.mjs";
import { isPromise } from "node:util/types";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/state/testclaw-agent-execution-domain.ts
/** One admitted publication scope borrows the canonical connection; it never owns its close. */
function createAgentDatabaseDomainOwner(context) {
	let binding;
	let prepared;
	let failedBinding = false;
	const requireBinding = (id) => {
		if (!binding || binding.id !== id || binding.closing) throw new Error("Agent database operation lost its bound publication scope");
		return binding;
	};
	return {
		async prepare(command) {
			if (command.type === "database.domain.bind") {
				if (binding || prepared) throw new Error("Agent database already has an admitted publication scope");
				const url = new URL(command.input.moduleUrl);
				if (url.protocol !== "file:" || url.search || url.hash) throw new Error("Agent publication requires a static local module URL");
				const module = await import(url.href);
				if (!isRecord(module) || typeof module.bindSqliteWorkerBackend !== "function") throw new Error("Agent publication module must export bindSqliteWorkerBackend");
				const factory = module.bindSqliteWorkerBackend;
				prepared = {
					id: command.input.id,
					factory: (input, bindingContext) => factory(input, bindingContext)
				};
			} else if (command.type === "database.domain.execute") {
				const current = requireBinding(command.input.id);
				const loading = current.backend[SQLITE_WORKER_PREPARE_COMMAND]?.(command.input.command.type);
				if (loading) await loading;
				await current.backend.prepare?.(command.input.command);
				if (requireBinding(command.input.id) !== current) throw new Error("Agent publication changed during command preparation");
			}
		},
		execute(command) {
			const database = context.assertCurrent();
			if (command.type === "database.domain.bind") {
				if (!prepared || prepared.id !== command.input.id || binding) throw new Error("Agent publication module was not prepared for this scope");
				const factory = prepared.factory;
				prepared = void 0;
				failedBinding = true;
				const backend = factory(command.input.input, {
					databasePath: context.databasePath,
					database,
					admit: (stage) => context.admit(stage)
				});
				if (isPromise(backend)) {
					backend.catch(() => {});
					throw new Error("Connection-bound publication factories must remain synchronous");
				}
				if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || typeof backend.assertSettled !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("Agent publication module returned an invalid connection-bound backend");
				binding = {
					id: command.input.id,
					backend,
					closing: false
				};
				failedBinding = false;
				return;
			}
			const current = requireBinding(command.input.id);
			if (command.type === "database.domain.close") {
				current.closing = true;
				const closed = current.backend.close();
				if (closed !== void 0) {
					closed.catch(() => {});
					throw new Error("Connection-bound publication cleanup must remain synchronous");
				}
				binding = void 0;
				return;
			}
			return current.backend.execute(command.input.command);
		},
		assertSettled() {
			prepared = void 0;
			if (failedBinding) throw new Error("Agent publication binding did not settle");
			if (binding?.closing) throw new Error("Agent publication cleanup did not settle");
			binding?.backend.assertSettled?.();
		},
		close() {
			if (binding) {
				binding.closing = true;
				const closed = binding.backend.close();
				if (closed !== void 0) {
					closed.catch(() => {});
					throw new Error("Connection-bound publication cleanup must remain synchronous");
				}
				binding = void 0;
			}
			prepared = void 0;
		}
	};
}
//#endregion
//#region src/state/testclaw-agent-execution.worker.ts
function createSqliteWorkerBackend(input, opening) {
	const backend = openAgentDatabaseBackend(input, opening);
	try {
		backend.execute({
			type: "database.prepareWrite",
			input: void 0
		});
		return backend;
	} catch (error) {
		try {
			backend.close();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Agent creation and cleanup failed", error);
		}
		throw error;
	}
}
/** The broker supplies a private admission channel before invoking this native factory. */
function openExistingSqliteWorkerBackend(input, opening) {
	return openAgentDatabaseBackend(input, opening);
}
function openAgentDatabaseBackend(input, opening) {
	if (opening.databasePath !== input.databasePath) throw new Error("Agent database open does not match its captured execution owner");
	const admitOpen = () => {
		try {
			requestSqliteWorkerOperationAdmission({
				stage: "open",
				facts: input
			});
		} catch (error) {
			throw new SqliteWorkerOpenRefusedError(error);
		}
	};
	admitOpen();
	const options = {
		agentId: input.agentId,
		path: input.databasePath,
		env: input.environment
	};
	const preparedFileIdentity = opening.existingIdentity ?? readDatabasePathIdentitySync(input.databasePath).key;
	let admittedFileIdentity = preparedFileIdentity.startsWith("file:") ? preparedFileIdentity : void 0;
	const assertFileIdentity = () => {
		if (input.expectedIdentity) assertExistingDatabaseIdentity(input.databasePath, `file:${input.expectedIdentity.physicalIdentity}`);
		if (admittedFileIdentity) assertExistingDatabaseIdentity(input.databasePath, admittedFileIdentity);
	};
	let database;
	let shared;
	let sharedBorrow;
	let releaseBorrow;
	let identity;
	let openingFailure;
	const openWriter = () => {
		let validation;
		if (!database) {
			admitOpen();
			assertFileIdentity();
			if (!shared) {
				shared = openAssistantStateDatabase({
					path: input.stateDatabasePath,
					env: input.environment
				});
				sharedBorrow = retainAssistantStateDatabase(shared);
			}
			const lease = prepareAssistantAgentDatabaseWorkerLease(options, shared, input.leaseId);
			const { port1, port2 } = new MessageChannel();
			try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "shared-owner",
						identity: requireAssistantStateDatabaseIdentity(shared),
						lease: lease.receipt,
						validationPort: port2
					}
				}, [port2]);
				lease.validation = receiveMessageOnPort(port1)?.message;
			} catch (error) {
				throw new SqliteWorkerOpenRefusedError(error);
			} finally {
				port1.close();
				port2.close();
			}
			assertFileIdentity();
			let registration;
			let openingResult;
			try {
				const opened = openAssistantAgentDatabase(options, lease, (receipt) => {
					registration = receipt;
				});
				database = opened;
				releaseBorrow = retainAgentDatabase(opened.db);
				openingResult = {
					ok: true,
					value: opened
				};
			} catch (error) {
				openingFailure = { error };
				openingResult = {
					ok: false,
					error
				};
			}
			if (registration) try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-registration-committed",
						registration
					}
				});
			} catch (error) {
				if (!openingResult.ok) throw createSqliteLifecycleAggregateError([openingResult.error, error], `${String(openingResult.error)}; committed registration reporting failed: ${String(error)}`, openingResult.error);
				throw error;
			}
			if (!openingResult.ok) throw openingResult.error;
			const opened = openingResult.value;
			const nativeIdentity = readAssistantAgentDatabaseIdentity(opened);
			if (typeof nativeIdentity.identity !== "string") throw new Error("Disk agent execution requires its canonical file identity");
			const openedFileIdentity = `file:${nativeIdentity.identity}`;
			if (admittedFileIdentity && openedFileIdentity !== admittedFileIdentity) throw new Error("Agent writer differs from its admitted physical file");
			if (input.expectedIdentity && nativeIdentity.identity !== input.expectedIdentity.physicalIdentity) throw new Error("Agent writer differs from its expected physical file");
			admittedFileIdentity = openedFileIdentity;
			identity = {
				kind: "file",
				physicalIdentity: nativeIdentity.identity,
				incarnation: nativeIdentity.incarnation,
				nativeLocation: nativeIdentity.filename
			};
			validation = getAssistantAgentDatabaseValidation(opened);
		}
		if (!database || !database.db.isOpen || getAssistantAgentDatabaseIfOpen(options) !== database) throw new Error("Agent execution lost its retained native database");
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				identity,
				validation
			}
		});
		return database;
	};
	const admit = (stage, publication) => {
		assertFileIdentity();
		requestSqliteWorkerOperationAdmission({
			stage,
			facts: {
				identity,
				...publication ? { publication } : {}
			}
		});
		if (stage === "commit") ensureAssistantAgentDatabasePermissions(input.databasePath, options);
	};
	let providerReview;
	let archivePruning;
	let replacements;
	const domain = createAgentDatabaseDomainOwner({
		databasePath: input.databasePath,
		assertCurrent() {
			assertOpen();
			const current = openWriter();
			assertFileIdentity();
			return current.db;
		},
		admit
	});
	let closed = false;
	let closeReceipt;
	const assertOpen = () => {
		if (closed) throw new Error("Agent database execution owner is closed");
	};
	return {
		prepare(command) {
			if (command.type === "session.archivePruning.deletePublished" || command.type === "session.archivePruning.removeLegacy" || command.type === "session.archivePruning.reclaimPages") return import("../session-history-archive-pruning.worker-hmyCtdnE.mjs").then((module) => {
				archivePruning = module;
			});
			if (command.type === "session.entries.replace") return import("../session-accessor.sqlite-replacement-state-Dkz_Rgyt.mjs").then((module) => {
				replacements = module;
			});
			if (command.type === "session.providerReview.compare") return import("../provider-review-store.worker-C2oq_fTE.mjs").then((module) => {
				providerReview = module;
			});
			if (command.type === "database.domain.bind" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.prepare(command);
		},
		assertSettled() {
			if (openingFailure) throw openingFailure.error;
			domain.assertSettled();
			if (database) {
				assertTransactionUsable(database.db);
				if (!identity || !database.db.isOpen || database.db.isTransaction) throw new Error("Agent database command left an unsettled native connection");
			}
		},
		execute(command) {
			assertOpen();
			if (command.type === "database.domain.bind" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.execute(command);
			if (command.type === "database.prepareWrite") {
				openWriter();
				return;
			}
			if (command.type === "session.entries.replace" && replacements) {
				const opened = openWriter();
				const replace = replacements.commitSessionEntryReplacementsInDatabase;
				const preparePublication = replacements.prepareSessionEntryReplacementPublication;
				return runAssistantAgentWriteTransaction((current) => {
					if (current.db !== opened.db) throw new Error("Session replacement lost its canonical database owner");
					admit("transaction");
					const result = replace(current, command.input, () => {});
					const publication = preparePublication(result);
					deferSqliteWorkerCommitReceipt(current.db, publication);
					admit("commit", publication);
					return result;
				}, options, { operationLabel: "session.entry-replacements" });
			}
			if (command.type === "session.providerReview.compare" && providerReview) return providerReview.compareSessionProviderReviewInWorker(openWriter(), options, command.input, admit);
			if (command.type === "session.archivePruning.deletePublished" && archivePruning) return archivePruning.deletePublishedSessionArchiveInDatabase(openWriter(), options, command.input, admit);
			if (command.type === "session.archivePruning.removeLegacy" && archivePruning) return archivePruning.removeLegacySessionArchiveInDatabase(openWriter(), options, command.input.filePath, admit);
			if (command.type === "session.archivePruning.reclaimPages" && archivePruning) return archivePruning.reclaimSessionArchivePagesInWorker(openWriter(), command.input.maxPages, admit);
			throw new Error("Unknown agent database operation");
		},
		[SQLITE_WORKER_CLOSE_RECEIPT]() {
			return closeReceipt;
		},
		close() {
			closed = true;
			closeReceipt = void 0;
			let checkpoint;
			const errors = [];
			for (const cleanup of [
				() => domain.close(),
				() => {
					if (!database) return;
					const closingPath = sqliteReaderDatabasePathKey(database.path);
					const stopObserving = onSqliteWalCheckpoint((observation) => {
						if (observation.databasePath === closingPath) checkpoint = {
							health: observation.health,
							observedAtNs: observation.observedAtNs
						};
					});
					try {
						closeAssistantAgentDatabaseByPath(database.path, database.agentId);
					} finally {
						stopObserving();
					}
				},
				() => releaseBorrow?.(),
				() => sharedBorrow?.release()
			]) try {
				cleanup();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Agent database cleanup failed", errors[0]);
			if (identity && checkpoint) closeReceipt = {
				identity: {
					key: `file:${identity.physicalIdentity}`,
					canonicalPath: identity.nativeLocation
				},
				incarnation: identity.incarnation,
				checkpoint
			};
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
