import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import "./testclaw-state-db-BAeysXj_.js";
import { t as lazyCompile } from "./protocol-validator-Bso29gFX.js";
import { n as DecisionReceiptV1Schema } from "./audit-run-BZxvwFii.js";
import { a as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-B6Lrfbks.js";
import "./execution-decision-facts-D9JkxhJl.js";
//#region packages/gateway-protocol/src/audit-run-validators.ts
const validateDecisionReceiptV1 = /* @__PURE__ */ lazyCompile(DecisionReceiptV1Schema);
//#endregion
//#region src/audit/execution-decision-work.ts
/** Private, bounded decision work projected by the canonical audit writer. */
const EXECUTION_DECISION_WORK_MAX_BYTES = 16384;
const EXECUTION_DECISION_RAW_REF_MAX_LENGTH = 4096;
const state = resolveGlobalSingleton(Symbol.for("testclaw.executionDecisionWorkSink"), () => ({ sink: void 0 }));
function isClosedPayloadRecord(value) {
	if (!isRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function hasOnlyKeys(value, allowed) {
	const allowedKeys = new Set(allowed);
	return Object.keys(value).every((key) => allowedKeys.has(key));
}
function parseRawRef(params) {
	if (!isClosedPayloadRecord(params.value) || !hasOnlyKeys(params.value, ["namespace", "value"]) || typeof params.value.namespace !== "string" || !params.namespaces.includes(params.value.namespace) || typeof params.value.value !== "string" || params.value.value.length < 1 || params.value.value.length > EXECUTION_DECISION_RAW_REF_MAX_LENGTH) throw new Error("execution decision work violates its bounded ref contract");
	return {
		namespace: params.value.namespace,
		value: params.value.value
	};
}
function buildReceipt(params) {
	return {
		...params.receipt,
		contextId: params.token.contextId,
		executionId: params.token.executionId,
		runId: params.token.runId,
		action: {
			...params.receipt.action,
			...params.resourceRef ? { resourceRef: params.resourceRef } : {},
			...params.targetRef ? { targetRef: params.targetRef } : {}
		}
	};
}
/** Revalidate closed work before queue cloning, key access, or database access. */
function parseExecutionDecisionWork(value) {
	if (!isClosedPayloadRecord(value) || !hasOnlyKeys(value, [
		"workVersion",
		"token",
		"receipt",
		"refs"
	]) || value.workVersion !== 1 || !isClosedPayloadRecord(value.receipt) || !hasOnlyKeys(value.receipt, [
		"schemaVersion",
		"receiptId",
		"actionId",
		"occurredAt",
		"action",
		"decision",
		"enforcement",
		"source",
		"missingEvidence",
		"remediation"
	]) || !isClosedPayloadRecord(value.receipt.action) || !hasOnlyKeys(value.receipt.action, [
		"family",
		"operation",
		"summary"
	])) throw new Error("execution decision work violates its bounded contract");
	const token = parseExecutionIdentityAdmissionToken(value.token);
	let refs;
	if (value.refs !== void 0) {
		if (!isClosedPayloadRecord(value.refs) || !hasOnlyKeys(value.refs, ["resource", "target"])) throw new Error("execution decision work violates its bounded ref contract");
		refs = {
			...value.refs.resource !== void 0 ? { resource: parseRawRef({
				value: value.refs.resource,
				namespaces: ["credential-profile"]
			}) } : {},
			...value.refs.target !== void 0 ? { target: parseRawRef({
				value: value.refs.target,
				namespaces: ["model-route", "session"]
			}) } : {}
		};
	}
	const receipt = value.receipt;
	const candidate = buildReceipt({
		token,
		receipt,
		...refs?.resource ? { resourceRef: "private-resource-ref" } : {},
		...refs?.target ? { targetRef: "private-target-ref" } : {}
	});
	if (!validateDecisionReceiptV1(candidate)) throw new Error("execution decision work receipt violates DecisionReceiptV1");
	const encoded = JSON.stringify(value);
	if (Buffer.byteLength(encoded, "utf8") > EXECUTION_DECISION_WORK_MAX_BYTES) throw new Error("execution decision work exceeds 16 KiB");
	return {
		workVersion: 1,
		token,
		receipt,
		...refs ? { refs } : {}
	};
}
/** Install the current process writer sink; callers never create a second writer. */
function configureExecutionDecisionWorkSink(sink) {
	state.sink = sink;
	return () => {
		if (state.sink === sink) state.sink = void 0;
	};
}
/** Offer one private work item to the lifecycle-owned FIFO. */
function recordExecutionDecisionWork(work) {
	return state.sink?.(work) ?? false;
}
//#endregion
export { parseExecutionDecisionWork as n, recordExecutionDecisionWork as r, configureExecutionDecisionWorkSink as t };
