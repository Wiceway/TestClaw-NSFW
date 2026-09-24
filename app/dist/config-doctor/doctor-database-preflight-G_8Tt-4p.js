import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-Dr7vDKEC.js";
import path from "node:path";
//#region src/commands/doctor-database-preflight.ts
/** Prepare fleet facts through the artifact-preserving schema readers. */
async function prepareDoctorDatabasePreflight(options = {}) {
	const { scope } = options;
	const databasePreflight = await import("./testclaw-database-preflight-D-1emagy.js");
	const [{ createConfigIO }, targets, { listAgentIds, resolveAgentDir }, { openDoctorStateSchemaReadAdmission }] = await Promise.all([
		import("./io-CYktO81x.js"),
		import("./targets-WjZN3LqO.js"),
		import("./agent-scope-config-DjAEl3pT.js"),
		import("./testclaw-state-db-doctor-schema-BO_WAJqO.js")
	]);
	const snapshot = scope === "state" || options.cfg ? void 0 : await createConfigIO({
		env: { ...process.env },
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	const cfg = scope === "state" ? void 0 : options.cfg ?? snapshot?.sourceConfig ?? snapshot?.config;
	let agentDatabaseMigrationDiscovery;
	const databaseSchemas = await databasePreflight.preflightAssistantDatabaseSchemas({
		env: process.env,
		scope,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission,
		...cfg ? {
			configuredAgentDatabaseTargets: listAgentIds(cfg).map((agentId) => ({
				agentId,
				path: path.join(resolveAgentDir(cfg, agentId), "testclaw-agent.sqlite")
			})),
			configuredAgentDatabaseCandidatePaths: targets.resolveConfiguredAgentDatabaseCandidatePaths(cfg, { env: process.env }),
			agentAdmissionConfig: cfg,
			onAgentDatabaseDiscovery: (prepared) => {
				agentDatabaseMigrationDiscovery = prepared;
			}
		} : {}
	});
	if (databaseSchemas.incompatible.length > 0) throw new databasePreflight.AssistantDatabaseSchemaPreflightError(databaseSchemas.incompatible, { operation: "doctor" });
	const unreadableStateDatabase = databaseSchemas.indeterminate.find((database) => database.kind === "state");
	if (unreadableStateDatabase) throw new DoctorUnreadableStateDatabaseError(unreadableStateDatabase.path, unreadableStateDatabase.reason);
	return {
		...databaseSchemas,
		...agentDatabaseMigrationDiscovery ? { agentDatabaseMigrationDiscovery } : {}
	};
}
//#endregion
export { prepareDoctorDatabasePreflight as t };
