import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { _t as bindDeliveryQueueEntry } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { a as generateSecureUuid } from "./secure-random-D2trnoZY.js";
//#region src/infra/session-delivery-queue.records.ts
const SESSION_DELIVERY_QUEUE_NAME = "session";
function prepareClaimedSessionDelivery(params, initialAttemptLeaseMs, now = Date.now()) {
	return {
		...params,
		retainOnFailure: true,
		id: buildEntryId(params.idempotencyKey),
		enqueuedAt: now,
		retryCount: 0,
		availableAt: now + Math.max(0, initialAttemptLeaseMs)
	};
}
var SessionDeliveryDeferredError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SessionDeliveryDeferredError";
	}
};
/** Signals that retry budget was already persisted before a later transition failed. */
var SessionDeliveryRetryChargedError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SessionDeliveryRetryChargedError";
	}
};
/** Signals that durable pre-delivery ownership could not be established. */
var SessionDeliveryAttemptStartError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.name = "SessionDeliveryAttemptStartError";
	}
};
/** Signals that delivery proved no external or transcript side effect committed. */
var SessionDeliverySafeRetryError = class extends Error {
	constructor(..._args4) {
		super(..._args4);
		this.name = "SessionDeliverySafeRetryError";
	}
};
/** Signals that recovery must settle this pending row as failed without replaying delivery. */
var SessionDeliveryDeadLetteredError = class extends Error {
	constructor(..._args5) {
		super(..._args5);
		this.name = "SessionDeliveryDeadLetteredError";
	}
};
function buildEntryId(idempotencyKey) {
	if (!idempotencyKey) return generateSecureUuid();
	return sha256Hex(idempotencyKey);
}
function prepareSessionDelivery(params) {
	return {
		...params,
		...params.completionRetention === "permanent" ? { retainOnFailure: true } : {},
		id: buildEntryId(params.idempotencyKey),
		enqueuedAt: Date.now(),
		retryCount: 0
	};
}
/** Signals that a delivered result still needs durable settlement finalization. */
var SessionDeliveryAcknowledgementFinalizeError = class extends Error {
	constructor(id, options) {
		super(`Session delivery ${id} still needs settlement finalization`, options);
		this.name = "SessionDeliveryAcknowledgementFinalizeError";
	}
};
//#endregion
//#region src/infra/session-delivery-queue-storage.ts
function executeSessionDelivery(context, command) {
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute(command));
}
function prepareEntry(entry, mode) {
	return bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry,
		...mode === "insert" ? { insertOnly: true } : { updatePendingOnly: true }
	});
}
async function enqueueSessionDelivery(params, context) {
	const entry = prepareSessionDelivery(params);
	await executeSessionDelivery(context, {
		type: "sessionDelivery.enqueue",
		input: prepareEntry(entry, "insert")
	});
	return entry.id;
}
async function enqueueClaimedSessionDelivery(params, initialAttemptLeaseMs, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.enqueueClaimed",
		input: prepareEntry(prepareClaimedSessionDelivery(params, initialAttemptLeaseMs), "insert")
	});
}
async function releaseSessionDeliveryClaim(id, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.releaseClaim",
		input: { id }
	});
}
async function deferSessionDelivery(id, delayMs, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.defer",
		input: {
			id,
			delayMs
		}
	});
}
async function advanceSessionDeliveryAgentRun(id, updates, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.advanceAgentRun",
		input: {
			id,
			updates
		}
	});
}
async function mergeSessionDeliveryPreparedMediaBlocks(id, mediaUrl, blocks, context) {
	const result = await executeSessionDelivery(context, {
		type: "sessionDelivery.mergePreparedMedia",
		input: {
			id,
			mediaUrl,
			blocksJson: JSON.stringify(blocks)
		}
	});
	return result.source === "input" ? blocks : result.blocks;
}
async function markSessionDeliveryAttemptStarted(entry, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.markAttemptStarted",
			input: prepareEntry({
				...entry,
				deliveryStartedAt: entry.deliveryStartedAt ?? Date.now()
			}, "update")
		});
	} catch (error) {
		throw new SessionDeliveryAttemptStartError(`Session delivery ${entry.id} could not persist attempt ownership`, { cause: error });
	}
}
async function markSessionDeliverySettlement(entry, outcome, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.markSettlement",
			input: prepareEntry({
				...entry,
				settlementOutcome: outcome,
				...outcome === "recovered" ? { acknowledgedAt: entry.acknowledgedAt ?? Date.now() } : {}
			}, "update")
		});
	} catch (error) {
		throw new SessionDeliveryAcknowledgementFinalizeError(entry.id, { cause: error });
	}
}
async function completeSessionDelivery(id, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.complete",
			input: { id }
		});
	} catch (error) {
		throw new SessionDeliveryAcknowledgementFinalizeError(id, { cause: error });
	}
}
async function failSessionDelivery(id, error, context, options) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.fail",
		input: {
			id,
			error,
			...options
		}
	});
}
async function loadPendingSessionDelivery(id, context) {
	const entry = await executeSessionDelivery(context, {
		type: "sessionDelivery.load",
		input: { id }
	});
	context.admission.assertCurrent();
	return entry;
}
async function loadPendingSessionDeliveries(context) {
	const entries = await executeSessionDelivery(context, {
		type: "sessionDelivery.list",
		input: void 0
	});
	context.admission.assertCurrent();
	return entries;
}
async function moveSessionDeliveryToFailed(id, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.moveToFailed",
		input: { id }
	});
}
//#endregion
export { SessionDeliveryDeadLetteredError as _, enqueueSessionDelivery as a, SessionDeliverySafeRetryError as b, loadPendingSessionDelivery as c, mergeSessionDeliveryPreparedMediaBlocks as d, moveSessionDeliveryToFailed as f, SessionDeliveryAttemptStartError as g, SessionDeliveryAcknowledgementFinalizeError as h, enqueueClaimedSessionDelivery as i, markSessionDeliveryAttemptStarted as l, SESSION_DELIVERY_QUEUE_NAME as m, completeSessionDelivery as n, failSessionDelivery as o, releaseSessionDeliveryClaim as p, deferSessionDelivery as r, loadPendingSessionDeliveries as s, advanceSessionDeliveryAgentRun as t, markSessionDeliverySettlement as u, SessionDeliveryDeferredError as v, prepareClaimedSessionDelivery as x, SessionDeliveryRetryChargedError as y };
