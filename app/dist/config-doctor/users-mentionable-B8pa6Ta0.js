import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Uo as validateUsersMentionableParams } from "./validator-registry-Dpl5QmuY.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
//#region src/gateway/server-methods/users-mentionable.ts
const usersMentionableHandlers = { "users.mentionable": async ({ client, context, params, respond }) => {
	if (!assertValidParams(params, validateUsersMentionableParams, "users.mentionable", respond)) return;
	if (!context.mentionInbox) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention directory is unavailable. Reconnect to retry."));
		return;
	}
	await context.mentionInbox.mentionable(client, params, (result) => {
		respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
	});
} };
//#endregion
export { usersMentionableHandlers };
