import "./kysely-sync-CICmT-bh.js";
import { r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { a as generateSecureUuid } from "./secure-random-D2trnoZY.js";
import { u as upsertDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-Cx4Pn5fg.js";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-B49BfTKC.js";
import { f as executeDeliveryQueueOperation, i as deleteDeliveryQueueEntry } from "./delivery-queue-sqlite-B-sRyrQm.js";
import { t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.js";
//#region src/infra/outbound/delivery-queue-media-staging.kernel.ts
function createDeliveryQueueMediaRetentionInDatabase(database, artifacts, entryKind, prepared = {
	id: generateSecureUuid(),
	enqueuedAt: Date.now()
}) {
	const { id, enqueuedAt } = prepared;
	const entry = {
		id,
		enqueuedAt,
		retryCount: 0,
		artifacts: [...artifacts]
	};
	if (!upsertDeliveryQueueEntryInDatabase({
		queueName: "outbound-media-staging",
		entry,
		metadata: { entryKind },
		insertOnly: true
	}, database)) throw new Error(`Delivery queue media stage already exists: ${id}`);
	return id;
}
//#endregion
//#region src/infra/outbound/delivery-queue-media-staging.ts
function createDeliveryQueueMediaRetention(artifacts, entryKind, stateDir, database, context) {
	const prepared = {
		id: generateSecureUuid(),
		enqueuedAt: Date.now()
	};
	const preparedArtifacts = [...artifacts];
	return createDeliveryQueueMediaRetentionInDatabase(database ?? openAssistantStateDatabase({ env: resolveDeliveryQueueStateEnv(stateDir, context) }), preparedArtifacts, entryKind, prepared);
}
/** Release a stage or recovery lease after its owner settles. */
function cancelDeliveryQueueMediaRetention(id, stateDir, context) {
	if (!id) return;
	deleteDeliveryQueueEntry(DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, id, stateDir, context);
}
/** Captures staging expiry and all media custody on the same connection. */
async function loadDeliveryQueueMediaRetentionSnapshot(params, context) {
	return executeDeliveryQueueOperation(context, params.stateDir, {
		type: "deliveryQueue.mediaRetentionSnapshot",
		input: { expireBeforeMs: params.expireBeforeMs }
	});
}
//#endregion
export { createDeliveryQueueMediaRetentionInDatabase as i, createDeliveryQueueMediaRetention as n, loadDeliveryQueueMediaRetentionSnapshot as r, cancelDeliveryQueueMediaRetention as t };
