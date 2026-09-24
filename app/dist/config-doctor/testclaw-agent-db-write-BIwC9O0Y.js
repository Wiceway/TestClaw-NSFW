import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { m as withAssistantAgentDatabaseAsync, s as getAssistantAgentDatabaseIfOpen } from "./testclaw-agent-db-Ckg86YCZ.js";
import { g as retainAgentDatabase } from "./testclaw-agent-db-lifecycle-lcOVPLQ6.js";
import { n as runAssistantAgentWriteAdmission } from "./testclaw-agent-write-admission-fcqqlXn0.js";
//#region src/state/testclaw-agent-db-write.ts
/** Admit a synchronous mutation without blocking a reclamation worker's parent callback. */
function withAssistantAgentDatabaseWrite(inputOptions, operation, expectedDatabase) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.TESTCLAW_STATE_DIR = resolveStateDir(options.env);
	options.path = resolveAssistantAgentSqlitePath(options);
	const run = async (database) => {
		const result = operation(database);
		if (isPromiseLike(result)) {
			await result;
			throw new Error("Agent database write callbacks must remain synchronous");
		}
		return result;
	};
	return runAssistantAgentWriteAdmission(options, async () => {
		if (!expectedDatabase) return await withAssistantAgentDatabaseAsync(options, run);
		const database = getAssistantAgentDatabaseIfOpen(options);
		if (!database || database.db !== expectedDatabase || !expectedDatabase.isOpen) throw new Error("Borrowed agent database closed or changed before write admission");
		const release = retainAgentDatabase(expectedDatabase);
		try {
			return await run(database);
		} finally {
			release();
		}
	}, true);
}
//#endregion
export { withAssistantAgentDatabaseWrite as t };
