import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-C6kRvGBD.mjs";
//#region src/state/testclaw-agent-db-migration-required.ts
var AssistantAgentDatabaseMediaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(pathname, schemaVersion) {
		super("agent-media", `Assistant agent database ${pathname} uses schema version ${schemaVersion}; run testclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.name = "AssistantAgentDatabaseMediaMigrationRequiredError";
	}
};
//#endregion
export { AssistantAgentDatabaseMediaMigrationRequiredError as t };
