import { l as openAssistantAgentDatabase } from "./testclaw-agent-db-DAdiee0a.mjs";
import { n as withAssistantAgentDatabaseReadOnly } from "./testclaw-agent-db-readonly-VfJk0jBv.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DCABr_1E.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-Va5SIRl2.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
function withCurrentProjectionSnapshot(scope, read, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const readSnapshot = (database) => readCurrentProjectionSnapshot(database, resolved, read);
	const result = options.readOnly ? withAssistantAgentDatabaseReadOnly(readSnapshot, databaseOptions) : {
		found: true,
		value: readSnapshot(openAssistantAgentDatabase(databaseOptions))
	};
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	if (result.value.kind === "value") return result.value.value;
	if (!options.readOnly) startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
export { withCurrentProjectionSnapshot as t };
