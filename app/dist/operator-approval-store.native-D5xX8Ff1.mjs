import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CRW06h3K.mjs";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BXFT1fUC.mjs";
import { n as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-RvnlMnYc.mjs";
import { h as getOperatorApprovalResolutionKey } from "./operator-approval-store.transitions-DwqBBQ67.mjs";
import { t as executeOperatorApprovalOperation } from "./operator-approval-store.operations-BFCS7sQA.mjs";
//#region src/gateway/operator-approval-store.native.ts
function executeNativeOperatorApproval(type, input, context, assertCurrent, onCommitted) {
	context.admission.assertCurrent();
	return runWithSqliteWorkerStateContext(context, () => {
		const options = {
			env: context.environment,
			path: context.admission.databasePath
		};
		return runAssistantStateWriteTransaction((database) => {
			assertCurrent();
			const result = executeOperatorApprovalOperation(type, input, {
				...options,
				database
			});
			if (onCommitted && type === "operatorApprovals.resolve" && "outcome" in result && result.outcome === "resolved") {
				const receipt = {
					type: "operatorApprovals.resolve",
					resolutionKey: getOperatorApprovalResolutionKey(result.record)
				};
				if (!deferSqlitePostCommitPublication(database.db, () => onCommitted(receipt))) throw new Error("Operator approval commit receipt requires a transaction owner");
			}
			assertCurrent();
			return result;
		}, options);
	});
}
//#endregion
export { executeNativeOperatorApproval };
