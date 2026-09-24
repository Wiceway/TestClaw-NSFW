import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
//#region src/state/session-metadata-unavailable-error.ts
var SessionMetadataUnavailableError = class extends Error {
	constructor(reason, options, missingTables = []) {
		super(`Session metadata unavailable (${[reason, ...missingTables].join(": ")}); retry after the agent store is ready.`, options);
		this.reason = reason;
		this.missingTables = missingTables;
		this.name = "SessionMetadataUnavailableError";
	}
};
//#endregion
//#region src/state/testclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "AssistantQuarantineReadCleanupError";
const AssistantQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("testclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "Assistant quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
export { AssistantQuarantineReadCleanupError as n, SessionMetadataUnavailableError as r, DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME as t };
