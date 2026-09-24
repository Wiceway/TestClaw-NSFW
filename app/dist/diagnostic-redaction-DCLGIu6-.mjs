import { p as redactSecrets } from "./redact-Db5P6nQB.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-B6W7qIxj.mjs";
//#region src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
//#endregion
export { redactAgentDiagnosticPayload as t };
