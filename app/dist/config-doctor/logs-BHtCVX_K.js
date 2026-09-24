import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { in as validateLogsTailParams } from "./validator-registry-Dpl5QmuY.js";
import { t as readConfiguredLogTail } from "./log-tail-DvkURLY8.js";
import { n as defineValidatedGatewayMethod } from "./validation-BZLpfukT.js";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = { "logs.tail": defineValidatedGatewayMethod("logs.tail", validateLogsTailParams, async ({ params, respond }) => {
	try {
		respond(true, await readConfiguredLogTail({
			cursor: params.cursor,
			limit: params.limit,
			maxBytes: params.maxBytes
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
	}
}) };
//#endregion
export { logsHandlers };
