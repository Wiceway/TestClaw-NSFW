import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./kysely-sync-CICmT-bh.js";
import "./sqlite-transaction-C94DYooc.js";
import "./sqlite-live-snapshot-C0XwFcJs.js";
import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import "./testclaw-state-db-BAeysXj_.js";
import { t as createAssistantStateSchemaEnsurer } from "./testclaw-state-feature-schema-Du6iKbeX.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { b as validateAuditListParams, x as validateAuditRunInspectParams, y as validateAuditActivityListParams } from "./validator-registry-Dpl5QmuY.js";
import { a as findAuditActivityFilterConflict } from "./audit-activity-DaGjNoqt.js";
import "./execution-identity-admission-B6Lrfbks.js";
import "./execution-owner-lifecycle-binding-store-BdaJeXtX.js";
import "./execution-decision-facts-D9JkxhJl.js";
import { t as parsePositiveAuditCursor } from "./audit-cursor-CkkbkV6J.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import "./operator-approval-store-BcOTyKqH.js";
import "node:crypto";
//#region src/audit/audit-event-store.ts
/** List newest-first records using the shared state worker and a stable sequence cursor. */
async function listAuditEvents(params) {
	const input = {
		limit: params.limit,
		now: params.now ?? Date.now(),
		...params.cursor !== void 0 ? { cursor: params.cursor } : {},
		...params.filters ? { filters: { ...params.filters } } : {}
	};
	const context = captureAssistantStateWorkerContext(params.database);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return executeAssistantStateWorker(context, {
		type: "audit.events.list",
		input
	});
}
//#endregion
//#region src/audit/execution-decision-receipts.ts
var ExecutionDecisionCursorError = class extends Error {
	constructor(message = "invalid execution decision cursor") {
		super(message);
		this.name = "ExecutionDecisionCursorError";
	}
};
function parseDecisionCursor(value) {
	if (value === void 0) return;
	const offset = parsePositiveAuditCursor(value);
	if (offset !== null && offset !== void 0) return { offset };
	const match = /^([amgctf]):(0|[1-9]\d*):(0|[1-9]\d*)$/.exec(value);
	if (!match) return null;
	const occurredAt = Number(match[2]);
	const rowId = Number(match[3]);
	if (!Number.isSafeInteger(occurredAt) || !Number.isSafeInteger(rowId)) return null;
	return {
		stage: match[1] === "a" ? "approval" : match[1] === "m" ? "message" : match[1] === "g" ? "generic" : match[1] === "c" ? "cron" : match[1] === "t" ? "task" : "flow",
		...occurredAt === 0 && rowId === 0 ? {} : { after: {
			occurredAt,
			rowId
		} }
	};
}
function isExecutionDecisionCursor(value) {
	return parseDecisionCursor(value) !== null;
}
//#endregion
//#region src/audit/execution-identity-context-build.ts
function ensureBoundedExecutionIdentityRef(value, label, maxLength = 256) {
	if (!value || value.length > maxLength) throw new Error(`${label} must be between 1 and ${String(maxLength)} characters`);
	return value;
}
function freezeExecutionIdentityContext(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeExecutionIdentityContext(nested, seen);
	return Object.freeze(value);
}
createAssistantStateSchemaEnsurer({
	table: "execution_identity_contexts",
	endMarker: "  ON execution_identity_contexts (run_id, created_at, execution_id);\n",
	operationLabel: "audit.execution-identity.schema.ensure"
});
function unavailableResult(params) {
	return {
		schemaVersion: 1,
		run: "executionId" in params.selector ? {
			executionId: params.selector.executionId,
			...params.resolvedRunId ? { runId: params.resolvedRunId } : {},
			status: params.runStatus
		} : {
			runId: params.resolvedRunId ?? params.selector.runId,
			status: params.runStatus
		},
		identity: {
			state: params.state,
			reasonCode: params.reasonCode,
			missingEvidence: params.missingEvidence,
			remediation: params.remediation
		},
		decisions: [],
		decisionDisplays: [],
		coverage: {
			state: params.state,
			missingEvidence: params.missingEvidence
		}
	};
}
function missingInspectionResult(selector) {
	if ("executionId" in selector) return unavailableResult({
		selector,
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "execution_not_found",
		missingEvidence: ["identity.context"],
		remediation: [{
			code: "verify_execution_id",
			text: "Verify the exact execution id; absence of best-effort identity evidence is not proof that no run occurred."
		}]
	});
	const runId = selector.runId;
	return unavailableResult({
		selector: { runId },
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "run_not_found",
		missingEvidence: ["run.record", "identity.context"],
		remediation: [{
			code: "verify_run_id",
			text: "Verify the run id; absence of best-effort audit activity is not proof of no run."
		}]
	});
}
/** Inspect one exact execution or discover bounded executions without host SQLite. */
async function inspectExecutionIdentityRun(params, options = {}) {
	const input = {
		...params,
		now: options.now ?? Date.now()
	};
	if ("executionId" in input) ensureBoundedExecutionIdentityRef(input.executionId, "execution id");
	else ensureBoundedExecutionIdentityRef(input.runId, "run id");
	const reply = await executeExistingAssistantStateRead(options, {
		type: "audit.run.inspect",
		input
	});
	if (!reply) return missingInspectionResult(input);
	if (!reply.ok || reply.type !== "audit.run.inspect") throw new Error("Unexpected audit run inspection result");
	if (reply.result.status === "invalid-cursor") throw new ExecutionDecisionCursorError(reply.result.message);
	const inspection = reply.result.inspection;
	if (inspection.identity.state === "present") freezeExecutionIdentityContext(inspection.identity.context);
	return inspection;
}
//#endregion
//#region src/gateway/server-methods/audit.ts
const DEFAULT_AUDIT_LIST_LIMIT = 100;
const MAX_AUDIT_LIST_LIMIT = 500;
function serializeAuditRunInspectResult(inspected) {
	const result = {
		schemaVersion: inspected.schemaVersion,
		run: inspected.run,
		identity: inspected.identity,
		decisionDisplays: inspected.decisionDisplays,
		coverage: inspected.coverage
	};
	if (inspected.nextDecisionCursor !== void 0) result.nextDecisionCursor = inspected.nextDecisionCursor;
	if (inspected.nextExecutionCursor !== void 0) result.nextExecutionCursor = inspected.nextExecutionCursor;
	return result;
}
function isOwnerDecisionCursor(value) {
	return parsePositiveAuditCursor(value) === null && isExecutionDecisionCursor(value);
}
/** Preserve the shipped audit.list result shape for run/tool-only clients. */
function mapLegacyAuditEvent(event) {
	const { schemaVersion: _schemaVersion, actorType, actorId, ...legacyEvent } = event;
	return {
		...legacyEvent,
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function mapAuditActivityEvent(event) {
	if (event.kind === "agent_run") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "agent_run",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.kind === "tool_action") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "tool_action",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.direction === "inbound") {
		const { actorType, actorId, ...activity } = event;
		const actor = actorType === "channel_sender" ? {
			type: "channel_sender",
			id: actorId
		} : {
			type: "system",
			id: actorId
		};
		return {
			...activity,
			eventType: "inbound_message",
			actor
		};
	}
	if (event.action !== "message.outbound.finished") throw new Error("nonterminal outbound messages are not audit activity records");
	const { actorType, actorId, ...activity } = event;
	return {
		...activity,
		eventType: "outbound_message",
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function invalidRangeOrCursor(params) {
	const cursor = parsePositiveAuditCursor(params.cursor);
	return {
		...cursor !== void 0 && cursor !== null ? { cursor } : {},
		invalid: cursor === null || params.after !== void 0 && params.before !== void 0 && params.after > params.before
	};
}
const auditHandlers = {
	"audit.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditListParams, "audit.list", respond)) return;
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = await listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map((event) => {
				if (event.kind === "message") throw new Error("legacy audit.list cannot project message records");
				return mapLegacyAuditEvent(event);
			}),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.activity.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditActivityListParams, "audit.activity.list", respond)) return;
		const filterConflict = findAuditActivityFilterConflict(params);
		if (filterConflict) {
			const detail = filterConflict.type === "kind" ? `${filterConflict.field} only applies to kind ${filterConflict.supportedKinds.join(" or ")}` : `${filterConflict.field} cannot be combined with ${filterConflict.conflictingField}`;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid audit.activity.list filters: ${detail}`));
			return;
		}
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.activity.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = await listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				includeMessages: true,
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.direction ? { direction: params.direction } : {},
				...params.channel ? { channel: params.channel } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map(mapAuditActivityEvent),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.run.inspect": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditRunInspectParams, "audit.run.inspect", respond)) return;
		const decisionCursor = params.decisionCursor;
		const executionOffset = typeof params.runId !== "string" || params.executionCursor === decisionCursor && decisionCursor !== void 0 && isOwnerDecisionCursor(decisionCursor) ? void 0 : parsePositiveAuditCursor(params.executionCursor);
		if (decisionCursor !== void 0 && !isExecutionDecisionCursor(decisionCursor) || executionOffset === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.run.inspect cursor"));
			return;
		}
		try {
			respond(true, serializeAuditRunInspectResult(await inspectExecutionIdentityRun({
				...typeof params.runId === "string" ? {
					runId: params.runId,
					...executionOffset !== void 0 ? { executionOffset } : {},
					executionLimit: params.executionLimit ?? 50
				} : { executionId: params.executionId },
				...decisionCursor !== void 0 ? { decisionCursor } : {},
				decisionLimit: params.decisionLimit ?? 50
			})));
		} catch (error) {
			if (error instanceof ExecutionDecisionCursorError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			throw error;
		}
	}
};
//#endregion
export { auditHandlers };
