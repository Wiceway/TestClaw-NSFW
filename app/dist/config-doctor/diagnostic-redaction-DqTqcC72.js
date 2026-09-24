import { p as redactSecrets } from "./redact-myZeUWr_.js";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-B6W7qIxj.js";
//#region src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
//#endregion
export { redactAgentDiagnosticPayload as t };
