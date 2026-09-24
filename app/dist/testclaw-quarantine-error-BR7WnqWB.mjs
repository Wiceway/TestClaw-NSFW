import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
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
export { AssistantQuarantineReadCleanupError as n, DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME as t };
