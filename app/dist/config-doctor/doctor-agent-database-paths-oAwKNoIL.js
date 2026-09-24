import { t as note } from "./note-Dc3h_SGh.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { i as resolveAssistantRegisteredAgentDatabasePath, r as resolveAssistantAgentDatabaseStoredPath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { L as assertAssistantStateDatabaseForMaintenance } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { r as invalidateRegisteredAgentDatabasesMemo } from "./testclaw-agent-db-registry-listing-DBxqeFUz.js";
import { r as readActiveUpdateRun } from "./update-run-read.kernel-8MZChvyU.js";
import { l as isUpdateDoctorLintPass } from "./update-phase-B3ln2lPo.js";
import path from "node:path";
//#region src/state/testclaw-agent-db-path-repair.ts
/** The caller retains shared-state write admission through this synchronous repair. */
function repairAssistantAgentDatabasePathAliases(database) {
	const { db, path: pathname } = database;
	assertAssistantStateDatabaseForMaintenance(db, { pathname });
	const active = readActiveUpdateRun(db);
	if (active) return {
		repaired: 0,
		warnings: [`Skipped agent database path repair while update ${active.runId} is in progress. Run testclaw doctor --fix after the update finishes.`]
	};
	const queries = getNodeSqliteKysely(db);
	const rows = executeSqliteQuerySync(db, queries.selectFrom("agent_databases").selectAll().orderBy("last_seen_at", "desc").orderBy("path")).rows;
	const agents = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const stored = resolveAssistantAgentDatabaseStoredPath(pathname, resolveAssistantRegisteredAgentDatabasePath(pathname, row.path));
		if (path.isAbsolute(stored)) continue;
		let paths = agents.get(row.agent_id);
		if (!paths) {
			paths = /* @__PURE__ */ new Map();
			agents.set(row.agent_id, paths);
		}
		const aliases = paths.get(stored) ?? [];
		aliases.push(row);
		paths.set(stored, aliases);
	}
	let repaired = 0;
	for (const [agentId, paths] of agents) for (const [stored, aliases] of paths) {
		if (!aliases.some((row) => row.path.startsWith("\\\\?\\"))) continue;
		const newest = aliases[0];
		executeSqliteQuerySync(db, queries.insertInto("agent_databases").values({
			...newest,
			path: stored
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			last_seen_at: newest.last_seen_at,
			schema_version: newest.schema_version,
			size_bytes: newest.size_bytes
		})));
		for (const alias of aliases) if (alias.path !== stored) executeSqliteQuerySync(db, queries.deleteFrom("agent_databases").where("agent_id", "=", agentId).where("path", "=", alias.path));
		repaired += 1;
	}
	return {
		repaired,
		warnings: []
	};
}
//#endregion
//#region src/commands/doctor-agent-database-paths.ts
/** Repair inventory aliases only before an updater captures its exact-path baseline. */
function noteDoctorAgentDatabasePathHealth(params) {
	if (!params.shouldRepair || process.platform !== "win32") return [];
	const report = runAssistantStateWriteTransaction((database) => isUpdateDoctorLintPass(params.env) ? {
		repaired: 0,
		warnings: ["Skipped agent database path repair during update Doctor. Run testclaw doctor --fix after the update finishes."]
	} : repairAssistantAgentDatabasePathAliases(database), { env: params.env }, { operationLabel: "doctor.agent-database-paths" });
	if (report.repaired > 0) {
		invalidateRegisteredAgentDatabasesMemo({ env: params.env });
		note(`Repaired ${report.repaired} agent database path registration(s), preserving the newest facts.`, "Doctor changes");
	}
	if (report.warnings.length > 0) note(report.warnings.join("\n"), "Doctor warnings");
	return report.warnings;
}
//#endregion
export { noteDoctorAgentDatabasePathHealth };
