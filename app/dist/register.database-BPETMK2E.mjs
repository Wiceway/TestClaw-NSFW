import { a as writeRuntimeJson, o as writeRuntimeStdout, r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { a as TESTCLAW_DATABASE_SCHEMA_DOCS_URL } from "./testclaw-state-db-contract-CdyGtChZ.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-D4b5GUZ_.mjs";
import path from "node:path";
//#region src/cli/program/register.database.ts
function writeDatabaseError(error, json) {
	const message = formatErrorMessage(error);
	if (json) writeRuntimeJson(defaultRuntime, { error: message });
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
}
async function runDatabasePreflight(databasePath, options) {
	const result = options.agentId === void 0 ? await (await import("./testclaw-database-preflight-CXmB84Lv.mjs")).preflightAssistantStateDatabasePath(databasePath) : await (await import("./testclaw-agent-schema-inspection-C0siMSM9.mjs")).preflightAssistantAgentDatabasePath(databasePath, options.agentId);
	if (options.json) writeRuntimeJson(defaultRuntime, result);
	else {
		const detail = result.reason ?? result.issues[0]?.message;
		writeRuntimeStdout(defaultRuntime, `Database preflight: ${result.status} (found ${result.foundVersion ?? "unknown"}, target ${result.targetVersion}).${detail ? `\n${detail}` : ""}\nSee ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	}
	if (result.status === "incompatible" || result.status === "indeterminate") defaultRuntime.exit(1);
}
async function runDatabaseOwnership(options) {
	try {
		const databasePath = path.resolve(resolveAssistantStateSqlitePath(process.env));
		const ownership = options.manager !== void 0 ? (await import("./testclaw-state-ownership-operations-UphYWxC3.mjs")).claimAssistantStateOwnership(options.manager, {
			path: databasePath,
			env: process.env
		}) : (await import("./testclaw-state-ownership-DMfiGpYe.mjs")).inspectAssistantStateOwnershipAtPath(databasePath);
		const status = ownership ? {
			status: "external",
			ownership
		} : { status: "unowned" };
		if (options.json) {
			writeRuntimeJson(defaultRuntime, {
				databasePath,
				...status
			});
			return;
		}
		const message = status.status === "external" ? `Shared state is externally owned by ${status.ownership.managerId}.` : "Shared state is not externally owned.";
		writeRuntimeStdout(defaultRuntime, `${message}\nSee ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	} catch (error) {
		writeDatabaseError(error, options.json === true);
	}
}
function registerDatabaseCommand(program) {
	const database = program.command("database").description("Inspect database schema compatibility and shared-state write ownership").addHelpText("after", `\nDocs: ${TESTCLAW_DATABASE_SCHEMA_DOCS_URL}\n`);
	database.command("preflight").description("Compare one copied SQLite file with this release's state schema").argument("<path>", "explicit copied SQLite database path").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	database.command("preflight-agent").description("Compare one copied agent SQLite file with this release's agent schema and owner").argument("<path>", "explicit copied agent SQLite database path").requiredOption("--agent-id <id>", "exact canonical agent owner ID").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	const ownership = database.command("ownership").description("Inspect or claim write ownership");
	ownership.command("status").description("Show durable shared-state write ownership").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	ownership.command("claim").description("Claim shared-state writes for the active external supervisor").requiredOption("--manager <id>", "stable external manager identifier").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	applyParentDefaultHelpAction(ownership);
	applyParentDefaultHelpAction(database);
}
//#endregion
export { registerDatabaseCommand };
