import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
//#region src/gateway/server-json.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
function parseGatewayPayload(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	try {
		return JSON.parse(trimmed);
	} catch {
		return { payloadJSON: value };
	}
}
//#endregion
//#region src/gateway/server-methods/nodes.helpers.ts
function respondUnavailableOnNodeInvokeErrorWithProvenance(respond, res, provenance) {
	if (res.ok) return true;
	const nodeError = res.error && typeof res.error === "object" ? res.error : null;
	const nodeCode = normalizeOptionalString(nodeError?.code) ?? "";
	const nodeMessage = normalizeOptionalString(nodeError?.message) ?? "node invoke failed";
	const message = nodeCode ? `${nodeCode}: ${nodeMessage}` : nodeMessage;
	const details = {
		nodeError: res.error ?? null,
		...provenance ? { nodeCommandDispatched: provenance.nodeCommandDispatched } : {}
	};
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details }));
	return false;
}
//#endregion
export { parseGatewayPayload as n, respondUnavailableOnNodeInvokeErrorWithProvenance as t };
