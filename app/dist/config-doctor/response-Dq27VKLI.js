import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.js";
import { t as formatForLog } from "./ws-log-CZGKk4Rg.js";
//#region src/gateway/server-methods/response.ts
function respondUnavailable(respond, err) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
}
async function respondUnavailableOnThrow(respond, fn) {
	try {
		await fn();
	} catch (err) {
		if (err instanceof SessionMutationAuthorizationChangedError) throw err;
		respondUnavailable(respond, err);
	}
}
//#endregion
export { respondUnavailableOnThrow as n, respondUnavailable as t };
