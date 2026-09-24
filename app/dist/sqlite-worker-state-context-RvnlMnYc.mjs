import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.mjs";
import { o as withExistingAssistantStateSchema } from "./testclaw-state-db-schema-policy-BQ7bZxNb.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-worker-state-context.ts
const stateContexts = resolveGlobalSingleton(Symbol.for("testclaw.sqliteWorkerStateContext"), () => new AsyncLocalStorage());
function runWithSqliteWorkerStateContext(context, operation) {
	return stateContexts.run(context, () => context.existingSchemaPath === void 0 ? operation() : withExistingAssistantStateSchema({ path: context.existingSchemaPath }, operation));
}
function getSqliteWorkerStateContext() {
	const context = stateContexts.getStore();
	if (!context) throw new Error("Shared-state SQLite requires captured host context");
	return context;
}
//#endregion
export { runWithSqliteWorkerStateContext as n, getSqliteWorkerStateContext as t };
