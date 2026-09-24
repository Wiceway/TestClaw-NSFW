import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-C6kRvGBD.mjs";
//#region src/state/testclaw-state-db-schema-migration-required.ts
const LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX = "idx_skill_workshop_collection_reviews_workspace_time";
var AssistantStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `Assistant state database schema migration required (${kind}) at ${pathname}; run testclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "AssistantStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeAssistantStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new AssistantStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
export { AssistantStateDatabaseSchemaMigrationRequiredError as n, normalizeAssistantStateSchemaReadError as r, LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX as t };
