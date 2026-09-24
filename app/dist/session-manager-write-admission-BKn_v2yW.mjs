import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { c as trackAsyncWork } from "./async-work-scope-B8vgCYcj.mjs";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-Cp6p8_y7.mjs";
import { m as withAssistantAgentDatabaseAsync } from "./testclaw-agent-db-DAdiee0a.mjs";
import { a as runQueuedStoreWrite, r as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-D_VtLORb.mjs";
import { i as sameSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-TFRevCb_.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-DD1eJxQX.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-kTo4D2H6.mjs";
//#region src/agents/sessions/session-manager-write-admission.ts
const detachedWriterQueues = resolveGlobalSingleton(Symbol.for("testclaw.sessionManagerDetachedWriterQueues"), () => /* @__PURE__ */ new WeakMap());
/** Keep the manager operation, committed view adoption, and cleanup in one storage admission. */
async function withSessionManagerWrite(manager, write) {
	const target = manager.getSessionTarget();
	if (!target) {
		const sessionId = manager.getSessionId();
		const queues = detachedWriterQueues.get(manager) ?? /* @__PURE__ */ new Map();
		detachedWriterQueues.set(manager, queues);
		return await trackAsyncWork(() => runQueuedStoreWrite({
			queues,
			storePath: "session",
			label: "detached session write admission",
			reentrant: true,
			fn: async () => {
				if (manager.getSessionTarget() || manager.getSessionId() !== sessionId) throw new Error("Session manager identity changed before transcript write admission");
				return await write();
			}
		}));
	}
	const identity = { ...target };
	const assertCurrent = captureOwnedTranscriptWriteAssertion(identity);
	const options = toDatabaseOptions(resolveSqliteReadScope(identity));
	options.env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	options.path = resolveAssistantAgentSqlitePath(options);
	return await trackAsyncWork(() => runAssistantAgentWriteAdmission(options, () => withAssistantAgentDatabaseAsync(options, (database) => {
		const current = manager.getSessionTarget();
		if (!sameSessionTranscriptTargetBinding(identity, current)) throw new Error("Session manager identity changed before transcript write admission");
		return write({
			database,
			options
		});
	}, assertCurrent), true));
}
//#endregion
export { withSessionManagerWrite as t };
