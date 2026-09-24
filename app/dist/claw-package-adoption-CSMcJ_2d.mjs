import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-DUH0XYlR.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BXFT1fUC.mjs";
import { existsSync } from "node:fs";
//#region src/state/claw-package-adoption.ts
/** Records an explicit non-Claw claim through the canonical package owner. */
function markClawPackageIndependentlyOwned(artifact, options = {}) {
	const databasePath = options.path ?? resolveAssistantStateSqlitePath(options.env ?? process.env);
	if (!existsSync(databasePath)) return 0;
	const nowMs = options.nowMs ?? Date.now();
	try {
		return runAssistantStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			let query = kysely.updateTable("claw_package_refs").set({
				independent_owner: 1,
				updated_at_ms: nowMs
			}).where("package_kind", "=", artifact.kind).where("package_source", "=", artifact.source).where("package_ref", "=", artifact.ref).where("independent_owner", "!=", 1);
			if (artifact.version) query = query.where("package_version", "=", artifact.version);
			if (artifact.kind === "skill") query = query.where("agent_id", "in", kysely.selectFrom("claw_installs").select("agent_id").where("workspace", "=", artifact.workspace ?? ""));
			return Number(executeSqliteQuerySync(db, query).numAffectedRows);
		}, options);
	} catch {
		return 0;
	}
}
//#endregion
export { markClawPackageIndependentlyOwned as t };
