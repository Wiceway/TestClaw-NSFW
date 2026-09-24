import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-C8MGgrNG.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { i as getAssistantDatabaseMaintenanceScope } from "./testclaw-state-db-async-lifecycle-DR_DXbgz.js";
import { a as resolveAssistantStateDirForDatabasePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { H as resolveDatabasePath, t as executeExistingAssistantStateRead, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-Bk2FCp74.js";
import { n as AgentDeletionCommitUncertainError, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-BHA6mh5y.js";
import { c as resolveExecApprovalsDisplayPath, i as generateToken, o as normalizeExecApprovalsInternal, r as createFailClosedExecApprovalsFallback, u as resolveExecApprovalsSocketPath } from "./exec-approvals-config-BN4b4XLr.js";
import { n as assertNoPendingLegacyExecApprovals, r as resetExecApprovalsMigrationGateForTest, t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-CimF5v9_.js";
import { c as serializeExecApprovals, i as deleteExecApprovalsConfigRow, l as snapshotFromExecApprovalsRow, n as assertExecApprovalsMutationAllowed, r as assertExecApprovalsMutationAuthority, s as readExecApprovalsConfigRow, t as ExecApprovalsMutationFencedError, u as writeExecApprovalsConfigRow } from "./exec-approvals-sqlite-BSJ-VMKb.js";
//#region src/infra/exec-approvals-store.ts
const log = createSubsystemLogger("infra/exec-approvals");
const WARN_INTERVAL_MS = 6e4;
let lastWarnAt;
var ExecApprovalsStoreUnavailableError = class extends Error {
	constructor(cause) {
		super(`Exec approvals SQLite state is unavailable: ${String(cause)}`, { cause });
		this.name = "ExecApprovalsStoreUnavailableError";
	}
};
function warnFailClosed(message, error) {
	const now = Date.now();
	if (lastWarnAt !== void 0 && now - lastWarnAt < WARN_INTERVAL_MS) return;
	lastWarnAt = now;
	if (error === void 0) log.warn(message);
	else log.warn(message, { error: formatErrorMessage(error) });
}
function snapshotFromExecApprovalsDatabase(db, displayPath = resolveExecApprovalsDisplayPath()) {
	return snapshotFromExecApprovalsRow({
		path: displayPath,
		row: readExecApprovalsConfigRow(db),
		onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
	});
}
function readExecApprovalsSnapshotFromDatabase(options = {}) {
	assertNoPendingLegacyExecApprovals();
	return snapshotFromExecApprovalsDatabase(openAssistantStateDatabase(options).db);
}
function readExecApprovalsSnapshotFromDatabaseReadOnly(options) {
	assertNoPendingLegacyExecApprovals({ env: options.env });
	const displayPath = resolveExecApprovalsDisplayPath(options.env);
	return withExistingAssistantStateDatabaseReadOnly(({ db }) => snapshotFromExecApprovalsDatabase(db, displayPath), options) ?? snapshotFromExecApprovalsRow({
		path: displayPath,
		row: void 0
	});
}
function readExecApprovalsSnapshotWithOptions(options = {}) {
	try {
		return readExecApprovalsSnapshotFromDatabase(options);
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		throw new ExecApprovalsStoreUnavailableError(error);
	}
}
function readExecApprovalsSnapshot() {
	return readExecApprovalsSnapshotWithOptions();
}
function loadExecApprovals() {
	try {
		return readExecApprovalsSnapshot().file;
	} catch (error) {
		if (!(error instanceof ExecApprovalsStoreUnavailableError)) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
function loadExecApprovalsReadOnlyWithOptions(options) {
	try {
		return readExecApprovalsSnapshotFromDatabaseReadOnly(options).file;
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
/** Loads exec approvals without creating or migrating shared state. */
function loadExecApprovalsReadOnly() {
	return loadExecApprovalsReadOnlyWithOptions({});
}
/** The revision includes the physical policy owner; unavailable reads cannot seed caches. */
async function readExecApprovalsPolicyReadOnlyAsync(options = {}) {
	const stateDbPath = resolveDatabasePath(options);
	const owner = {
		path: stateDbPath,
		env: { TESTCLAW_STATE_DIR: resolveAssistantStateDirForDatabasePath(stateDbPath) }
	};
	try {
		assertNoPendingLegacyExecApprovals({ env: owner.env });
		const reply = await executeExistingAssistantStateRead(owner, { type: "exec-approvals.read" });
		if (reply && (!reply.ok || reply.type !== "exec-approvals.read")) throw new Error("Unexpected exec approvals read result");
		const snapshot = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(owner.env),
			row: reply?.row,
			onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
		});
		return {
			file: snapshot.file,
			revision: JSON.stringify([stateDbPath, snapshot.hash])
		};
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return { file: createFailClosedExecApprovalsFallback() };
	}
}
async function loadExecApprovalsAsync() {
	return loadExecApprovals();
}
function replaceExecApprovalsSnapshot(target, source) {
	target.version = source.version;
	if (source.socket === void 0) delete target.socket;
	else target.socket = source.socket;
	if (source.defaults === void 0) delete target.defaults;
	else target.defaults = source.defaults;
	if (source.agents === void 0) delete target.agents;
	else target.agents = source.agents;
}
function updateExecApprovalsInTransaction(params, options = {}) {
	assertNoPendingLegacyExecApprovals();
	return runAssistantStateWriteTransaction(({ db }) => {
		const current = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(),
			row: readExecApprovalsConfigRow(db),
			onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
		});
		if (params.baseHash !== void 0 && current.hash !== params.baseHash) return null;
		const next = params.update(structuredClone(current.file));
		if (next === null) return current;
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next,
			authority: params.authority
		});
		const raw = serializeExecApprovals(next);
		if (current.exists && current.raw === raw) return current;
		writeExecApprovalsConfigRow({
			db,
			file: next,
			raw
		});
		return snapshotFromExecApprovalsRow({
			path: current.path,
			row: { raw_json: raw }
		});
	}, options, { operationLabel: "exec-approvals.update" });
}
function updateExecApprovalsSync(params) {
	return updateExecApprovalsInTransaction(params);
}
async function updateExecApprovals(params) {
	return updateExecApprovalsInTransaction(params);
}
const pendingAuthorizationBatches = [];
/** Coalesce this turn's authorizations; the shared-state actor owns ordered settlement. */
function commitExecAuthorizations(input) {
	const maintenance = getAssistantDatabaseMaintenanceScope();
	return maintenance ? maintenance.run(() => enqueueExecAuthorization(input)) : enqueueExecAuthorization(input);
}
function enqueueExecAuthorization(input) {
	const context = captureAssistantStateWorkerContext();
	assertNoPendingLegacyExecApprovals({ env: context.environment });
	const completion = createDeferredCore();
	const request = {
		input: structuredClone(input),
		context,
		resolve: completion.resolve,
		reject: completion.reject
	};
	let batch = pendingAuthorizationBatches.at(-1);
	if (batch) {
		const owner = batch[0].context;
		if (batch.length >= 64 || owner.admission.identity.key !== context.admission.identity.key || owner.maintenanceScope !== context.maintenanceScope || owner.existingSchemaPath !== context.existingSchemaPath || owner.coordinatorRuntime.directory !== context.coordinatorRuntime.directory || owner.coordinatorRuntime.keepAlive !== context.coordinatorRuntime.keepAlive || owner.environment.TESTCLAW_SUPERVISOR_MODE !== context.environment.TESTCLAW_SUPERVISOR_MODE) batch = void 0;
	}
	if (!batch) {
		batch = [request];
		pendingAuthorizationBatches.push(batch);
		const pending = batch;
		queueMicrotask(() => {
			pendingAuthorizationBatches.splice(pendingAuthorizationBatches.indexOf(pending), 1);
			runAssistantStateWorkerOperation(context, (scope) => scope.execute({
				type: "execApprovals.commitAuthorizations",
				input: { items: pending.map((item) => item.input) }
			}), { assertCurrent: () => pending.forEach((item) => item.context.admission.assertCurrent()) }).then((results) => {
				for (const [index, item] of pending.entries()) {
					const result = results[index];
					if (!result?.ok) {
						item.reject(new Error(result?.message ?? "Missing exec authorization result"));
						continue;
					}
					item.resolve({
						snapshot: result.snapshot,
						readCurrent: () => {
							item.context.admission.assertCurrent();
							return loadExecApprovalsReadOnlyWithOptions({
								path: item.context.admission.databasePath,
								env: item.context.environment
							});
						}
					});
				}
			}, (error) => pending.forEach((item) => item.reject(error)));
		});
	} else batch.push(request);
	return completion.promise;
}
/** Remove one deleted agent's policy aliases, restoring them if commit fails. */
async function withAgentExecApprovalsRemoved(agentId, commit, options = {}) {
	const key = normalizeAgentId(agentId);
	const snapshot = readExecApprovalsSnapshotWithOptions(options);
	const operationId = readAgentDeletionJournal(key, options)?.operationId;
	if (!operationId) throw new ExecApprovalsMutationFencedError();
	const removedPolicyEntries = Object.entries(snapshot.file.agents ?? {}).filter(([policyKey]) => {
		const normalizedPolicyKey = normalizeAgentIdStrict(policyKey);
		return normalizedPolicyKey.ok && normalizedPolicyKey.value === key;
	});
	if (removedPolicyEntries.length > 0) {
		if (!updateExecApprovalsInTransaction({
			baseHash: snapshot.hash,
			authority: {
				action: "remove",
				agentId: key,
				operationId
			},
			update: (file) => {
				const agents = { ...file.agents };
				for (const [policyKey] of removedPolicyEntries) delete agents[policyKey];
				return {
					...file,
					agents
				};
			}
		}, options)) throw new Error("Exec approvals changed while deleting agent; retry deletion.");
	} else runAssistantStateWriteTransaction(({ db }) => {
		assertExecApprovalsMutationAuthority(db, {
			action: "remove",
			agentId: key,
			operationId
		});
	}, options);
	try {
		return await commit();
	} catch (error) {
		if (error instanceof AgentDeletionCommitUncertainError) throw error;
		if (removedPolicyEntries.length > 0) try {
			updateExecApprovalsInTransaction({
				authority: {
					action: "restore",
					agentId: key,
					operationId
				},
				update: (file) => ({
					...file,
					agents: {
						...file.agents,
						...Object.fromEntries(removedPolicyEntries)
					}
				})
			}, options);
		} catch (rollbackError) {
			throw new AgentDeletionAuthorityRollbackError([error, rollbackError], `Failed to roll back exec approvals deletion for agent ${key}.`, { cause: error });
		}
		throw error;
	}
}
async function restoreExecApprovalsSnapshotLocked(snapshot, baseHash) {
	assertNoPendingLegacyExecApprovals();
	return runAssistantStateWriteTransaction(({ db }) => {
		const current = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(),
			row: readExecApprovalsConfigRow(db)
		});
		if (current.hash !== baseHash) return false;
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next: snapshot.file
		});
		if (!snapshot.exists) deleteExecApprovalsConfigRow(db);
		else {
			const raw = snapshot.raw ?? serializeExecApprovals(snapshot.file);
			writeExecApprovalsConfigRow({
				db,
				file: snapshot.file,
				raw
			});
		}
		return true;
	}, {}, { operationLabel: "exec-approvals.restore-cas" });
}
function ensureExecApprovalsSocket(file) {
	const next = normalizeExecApprovalsInternal(file);
	const socketPath = next.socket?.path?.trim();
	const token = next.socket?.token?.trim();
	return {
		...next,
		socket: {
			path: socketPath || resolveExecApprovalsSocketPath(),
			token: token || generateToken()
		}
	};
}
function requireInitializedExecApprovals(snapshot) {
	if (!snapshot) throw new Error("Failed to initialize exec approvals");
	return snapshot;
}
function ensureExecApprovalsSnapshotSync() {
	const snapshot = readExecApprovalsSnapshot();
	if (snapshot.file.socket?.path?.trim() && snapshot.file.socket.token?.trim() && snapshot.raw === serializeExecApprovals(ensureExecApprovalsSocket(snapshot.file))) return snapshot;
	return requireInitializedExecApprovals(updateExecApprovalsInTransaction({ update: ensureExecApprovalsSocket }));
}
async function ensureExecApprovalsSnapshot() {
	return ensureExecApprovalsSnapshotSync();
}
const testing = { reset() {
	resetExecApprovalsMigrationGateForTest();
	lastWarnAt = void 0;
} };
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.execApprovalsStoreTestApi")] = testing;
//#endregion
export { loadExecApprovalsReadOnly as a, replaceExecApprovalsSnapshot as c, updateExecApprovalsSync as d, withAgentExecApprovalsRemoved as f, loadExecApprovalsAsync as i, restoreExecApprovalsSnapshotLocked as l, ensureExecApprovalsSnapshot as n, readExecApprovalsPolicyReadOnlyAsync as o, loadExecApprovals as r, readExecApprovalsSnapshot as s, commitExecAuthorizations as t, updateExecApprovals as u };
