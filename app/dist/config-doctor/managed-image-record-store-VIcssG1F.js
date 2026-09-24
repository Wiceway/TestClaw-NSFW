import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
//#region src/gateway/managed-image-record-store.kernel.ts
const MANAGED_IMAGE_RECORD_COLUMNS = [
	"attachment_id",
	"session_key",
	"agent_id",
	"message_id",
	"created_at",
	"updated_at",
	"retention_class",
	"alt",
	"original_media_root",
	"original_media_id",
	"original_media_subdir",
	"original_content_type",
	"original_width",
	"original_height",
	"original_size_bytes",
	"original_filename",
	"cleanup_pending"
];
function managedImageRecordToRow(record) {
	return {
		attachment_id: record.attachmentId,
		session_key: record.sessionKey,
		agent_id: record.agentId ?? null,
		message_id: record.messageId,
		created_at: record.createdAt,
		updated_at: record.updatedAt ?? null,
		retention_class: record.retentionClass ?? null,
		alt: record.alt,
		original_media_root: record.original.mediaRoot,
		original_media_id: record.original.mediaId,
		original_media_subdir: record.original.mediaSubdir,
		original_content_type: record.original.contentType,
		original_width: record.original.width,
		original_height: record.original.height,
		original_size_bytes: record.original.sizeBytes,
		original_filename: record.original.filename,
		record_json: JSON.stringify(record)
	};
}
function managedImageRecordFromRow(row) {
	return {
		attachmentId: row.attachment_id,
		sessionKey: row.session_key,
		...row.agent_id ? { agentId: row.agent_id } : {},
		messageId: row.message_id,
		createdAt: row.created_at,
		...row.updated_at ? { updatedAt: row.updated_at } : {},
		...row.retention_class === "history" || row.retention_class === "transient" ? { retentionClass: row.retention_class } : {},
		alt: row.alt,
		original: {
			mediaRoot: row.original_media_root,
			mediaId: row.original_media_id,
			mediaSubdir: row.original_media_subdir,
			contentType: row.original_content_type,
			width: row.original_width,
			height: row.original_height,
			sizeBytes: row.original_size_bytes,
			filename: row.original_filename
		}
	};
}
function managedImageRecordsEqual(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
//#endregion
//#region src/gateway/managed-image-record-store.ts
const MANAGED_OUTGOING_ORIGINALS_SUBDIR = "outgoing/originals";
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		TESTCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
function captureManagedImageReadContext(stateDir) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	if (stateDir) env.TESTCLAW_STATE_DIR = stateDir;
	return captureAssistantStateWorkerContext({ env });
}
async function readManagedImageRecord(attachmentId, stateDir) {
	const context = captureManagedImageReadContext(stateDir);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "managedImages.read",
		input: { attachmentId }
	});
}
async function listManagedImageRecordEntries(params) {
	const context = captureManagedImageReadContext(params.stateDir);
	const sessionKey = params.sessionKey;
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "managedImages.entries",
		input: { sessionKey }
	});
}
async function listManagedImageOriginalMediaIds(stateDir) {
	const context = captureManagedImageReadContext(stateDir);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "managedImages.originalMediaIds",
		input: void 0
	});
}
function insertManagedImageRecord(record, stateDir) {
	runAssistantStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("managed_outgoing_image_records").values(managedImageRecordToRow(record)));
	}, stateDatabaseOptions(stateDir));
}
/** Promote a transient record atomically so concurrent message commits cannot lose state. */
function attachManagedImageRecordToMessage(params) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", params.attachmentId).where("session_key", "=", params.sessionKey));
		if (!row) return false;
		if (row.cleanup_pending === 1) return false;
		const current = managedImageRecordFromRow(row);
		if (current.messageId === params.messageId && current.retentionClass === "history") return true;
		const nextRow = managedImageRecordToRow({
			...current,
			messageId: params.messageId,
			retentionClass: "history",
			updatedAt: params.updatedAt
		});
		executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({
			message_id: nextRow.message_id,
			retention_class: nextRow.retention_class,
			updated_at: nextRow.updated_at,
			record_json: nextRow.record_json
		}).where("attachment_id", "=", params.attachmentId));
		return true;
	}, stateDatabaseOptions(params.stateDir));
}
/** Claim only the exact row cleanup planned against; concurrent updates win. */
function claimManagedImageRecordCleanupIfCurrent(planned, stateDir) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
		if (!row || row.cleanup_pending === 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
		executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({ cleanup_pending: 1 }).where("attachment_id", "=", planned.attachmentId));
		return true;
	}, stateDatabaseOptions(stateDir));
}
/** Delete a durably claimed row only after its attachment file is gone. */
function deleteClaimedManagedImageRecord(planned, stateDir) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
		if (!row || row.cleanup_pending !== 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
		executeSqliteQuerySync(db, stateDb.deleteFrom("managed_outgoing_image_records").where("attachment_id", "=", planned.attachmentId));
		return true;
	}, stateDatabaseOptions(stateDir));
}
//#endregion
export { insertManagedImageRecord as a, readManagedImageRecord as c, managedImageRecordsEqual as d, deleteClaimedManagedImageRecord as i, managedImageRecordFromRow as l, attachManagedImageRecordToMessage as n, listManagedImageOriginalMediaIds as o, claimManagedImageRecordCleanupIfCurrent as r, listManagedImageRecordEntries as s, MANAGED_OUTGOING_ORIGINALS_SUBDIR as t, managedImageRecordToRow as u };
