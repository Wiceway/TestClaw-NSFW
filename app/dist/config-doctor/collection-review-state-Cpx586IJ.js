import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import "./config-machine-state-BiDCuNUZ.js";
import { r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { n as updateConfigMachineState } from "./config-machine-state-write-BsrY8iFO.js";
import { n as ensureSkillWorkshopSchema, r as openSkillWorkshopStore, t as databaseOptions } from "./store-sqlite-schema--9--LFuX.js";
import path from "node:path";
//#region src/skills/workshop/collection-review-state.ts
const SKILL_COLLECTION_REVIEW_HISTORY_LIMIT = 20;
function experienceReviewKey(agentId, workspaceDir) {
	return sha256Hex(`${agentId}\0${path.resolve(workspaceDir)}`);
}
function recordSkillExperienceReviewOutcome(agentId, workspaceDir, review, options = {}) {
	const entryKey = experienceReviewKey(agentId, workspaceDir);
	updateConfigMachineState("skills.curatorState", (current) => {
		const state = current?.lastResult;
		return {
			lastAttemptAtMs: 0,
			lastSuccessAtMs: null,
			lastError: null,
			...current,
			lastResult: {
				...state,
				experienceReviews: {
					...state?.experienceReviews,
					[entryKey]: review
				}
			}
		};
	}, options);
}
function parseStoredNames(value, field) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) throw new Error(`Invalid ${field} in stored skill collection review.`);
	return parsed;
}
function parseStoredDrops(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) throw new Error("Invalid dropped entries in stored skill collection review.");
	return parsed.map((entry) => {
		const record = asNullableRecord(entry);
		if (!record || typeof record.name !== "string" || typeof record.reason !== "string") throw new Error("Invalid dropped entry in stored skill collection review.");
		return {
			name: record.name,
			reason: record.reason
		};
	});
}
function readSkillCollectionBackupDrops(agentId, backupId, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_collection_reviews").select("dropped_json").where("owner_agent_id", "=", agentId).where("backup_id", "=", backupId)).rows;
	return new Set(rows.flatMap((row) => parseStoredDrops(row.dropped_json).map((drop) => drop.name)));
}
function listSkillCollectionReviewOutcomes(agentId, options = {}) {
	ensureSkillWorkshopSchema(options);
	const database = openAssistantStateDatabase(databaseOptions(options));
	const kysely = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_collection_reviews").select([
		"backup_id",
		"create_time",
		"kept_names_json",
		"written_names_json",
		"dropped_json"
	]).where("owner_agent_id", "=", agentId).orderBy("create_time", "desc").orderBy("review_id", "desc").limit(SKILL_COLLECTION_REVIEW_HISTORY_LIMIT)).rows.map((row) => ({
		createTime: row.create_time,
		backupId: row.backup_id,
		kept: parseStoredNames(row.kept_names_json, "kept names"),
		written: parseStoredNames(row.written_names_json, "written names"),
		dropped: parseStoredDrops(row.dropped_json)
	}));
}
//#endregion
export { readSkillCollectionBackupDrops as n, recordSkillExperienceReviewOutcome as r, listSkillCollectionReviewOutcomes as t };
