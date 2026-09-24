import "./kysely-sync-CICmT-bh.js";
import "./secret-redaction-registry-0-0UmO2m.js";
import "./sqlite-live-snapshot-C0XwFcJs.js";
import "./testclaw-state-db-BAeysXj_.js";
import { t as createAssistantStateSchemaEnsurer } from "./testclaw-state-feature-schema-Du6iKbeX.js";
import "node:crypto";
import "kysely";
createAssistantStateSchemaEnsurer({
	table: "execution_decision_facts",
	endMarker: "  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n",
	operationLabel: "audit.execution-decision.schema.ensure"
});
//#endregion
export {};
