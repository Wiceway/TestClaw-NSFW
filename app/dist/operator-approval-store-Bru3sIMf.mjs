import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { u as sql } from "./kysely-sync-DUH0XYlR.mjs";
import "./testclaw-state-db-schema-helpers-CQ_Xh1qa.mjs";
import "./sqlite-number-DM1AypRG.mjs";
import { a as isStateDatabaseReadAdmissionInvalidatedError } from "./testclaw-state-db-async-lifecycle-Bn4ZDDk6.mjs";
import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { l as reserveSqliteWorkerInputPreparation, n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-arRyGxwp.mjs";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-BK3z6Qfx.mjs";
import { d as decodeOperatorApprovalHistoryCursor } from "./operator-approval-store.transitions-DwqBBQ67.mjs";
import "node:crypto";
import { serialize } from "node:v8";
sql`operator_approvals.presentation_json`, sql`operator_approvals.reviewer_device_ids_json`, sql`operator_approvals.audience_session_keys_json`;
//#endregion
//#region src/gateway/operator-approval-store.ts
/** Storage admission failure is not evidence that a pending row is corrupt. */
function isOperatorApprovalStoreRefusal(error) {
	return collectNestedErrorCandidates(error).some((cause) => isStateDatabaseReadAdmissionInvalidatedError(cause) || [
		"closed",
		"overloaded",
		"unavailable"
	].includes(extractErrorCode(cause) ?? ""));
}
function isOperatorApprovalStoreOutcomeUnknown(error) {
	return collectNestedErrorCandidates(error).some((cause) => extractErrorCode(cause) === "outcome-unknown");
}
const loadNativeStore = createLazyRuntimeModule(() => import("./operator-approval-store.native-D5xX8Ff1.mjs"));
const leases = createKeyedFifoLeaseRegistry(Symbol.for("testclaw.operatorApprovalStoreLeases"));
async function runApprovalStoreOperation(context, input, operation, options, assertCurrent) {
	context.admission.assertCurrent();
	const preparation = reserveSqliteWorkerInputPreparation(serialize(input).byteLength);
	const lease = expectDefined(leases.reserve([context.admission.identity.key, `path:${context.admission.identity.canonicalPath}`]), "Operator approval storage lease");
	try {
		await lease.wait();
		preparation.assertCurrent();
		context.admission.assertCurrent();
		assertCurrent?.();
		return await runAssistantStateWorkerOperation(context, (scope) => operation(scope, preparation), options);
	} finally {
		preparation.release();
		lease.release();
	}
}
function execute(type, input, { databaseOptions, assertCurrent, guard }, onCommitted) {
	const context = captureAssistantStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(input);
	const assertOperationCurrent = () => {
		context.admission.assertCurrent();
		guard?.assertCurrent();
		assertCurrent?.();
	};
	const native = guard?.family === "native-compatibility";
	let admission;
	const createWriteAdmission = createSqliteWorkerWriteAdmission(assertOperationCurrent, [context.admission.databasePath]);
	const createAdmission = (operation) => {
		const retained = createWriteAdmission(operation);
		admission = retained.admission;
		return retained;
	};
	const publishCommitted = (facts) => {
		if (onCommitted && isRecord(facts) && facts.type === "operatorApprovals.resolve" && typeof facts.resolutionKey === "string") onCommitted(facts.resolutionKey);
	};
	return runApprovalStoreOperation(context, captured, async (scope, preparation) => {
		if (native) {
			const store = await loadNativeStore();
			preparation.assertCurrent();
			assertOperationCurrent();
			preparation.release();
			return store.executeNativeOperatorApproval(type, captured, context, assertOperationCurrent, onCommitted ? publishCommitted : void 0);
		}
		try {
			return await preparation.handoff(() => scope.execute({
				type,
				input: captured
			}));
		} finally {
			publishCommitted(admission?.committed?.facts);
		}
	}, {
		assertCurrent: native ? void 0 : assertOperationCurrent,
		requireStateLifecycle: true,
		...native ? {} : { createAdmission }
	}, assertOperationCurrent);
}
function insertOperatorApproval(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.insert", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
function getOperatorApprovalDetailed(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.get", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
function listPendingOperatorApprovals(params = {}) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.pending", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
function resolveOperatorApproval(params) {
	const { databaseOptions, assertCurrent, guard, onCommitted, ...input } = params;
	return execute("operatorApprovals.resolve", input, {
		databaseOptions,
		assertCurrent,
		guard
	}, onCommitted);
}
function forceDenyOperatorApproval(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.deny", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
function expireDueOperatorApprovals(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.expire", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
function consumeOperatorApprovalAllowOnce(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return execute("operatorApprovals.consume", input, {
		databaseOptions,
		assertCurrent,
		guard
	});
}
async function listTerminalOperatorApprovals(params = {}) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	if (input.cursor !== void 0) decodeOperatorApprovalHistoryCursor(input.cursor);
	const context = captureAssistantStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(input);
	const assertOperationCurrent = () => {
		context.admission.assertCurrent();
		guard?.assertCurrent();
		assertCurrent?.();
	};
	return runApprovalStoreOperation(context, captured, async (_scope, preparation) => {
		preparation.assertCurrent();
		assertOperationCurrent();
		preparation.release();
		const result = await executeExistingAssistantStateRead({
			env: context.environment,
			path: context.admission.databasePath
		}, {
			type: "operatorApprovals.history",
			input: captured
		});
		assertOperationCurrent();
		if (result?.ok && result.type === "operatorApprovals.history") return result.history;
		throw new Error("Operator approval history database became unavailable");
	}, void 0, assertOperationCurrent);
}
//#endregion
export { insertOperatorApproval as a, listPendingOperatorApprovals as c, getOperatorApprovalDetailed as i, listTerminalOperatorApprovals as l, expireDueOperatorApprovals as n, isOperatorApprovalStoreOutcomeUnknown as o, forceDenyOperatorApproval as r, isOperatorApprovalStoreRefusal as s, consumeOperatorApprovalAllowOnce as t, resolveOperatorApproval as u };
