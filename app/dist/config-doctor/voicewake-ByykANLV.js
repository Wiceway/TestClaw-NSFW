import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { n as loadVoiceWakeConfig, r as setVoiceWakeTriggers, t as normalizeVoiceWakeTriggers } from "./server-utils-CvEJ_kDk.js";
import { n as respondUnavailableOnThrow } from "./response-Dq27VKLI.js";
//#region src/gateway/server-methods/voicewake.ts
/** Gateway request handlers for reading and updating voice wake triggers. */
const voicewakeHandlers = {
	"voicewake.get": async ({ respond }) => {
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { triggers: (await loadVoiceWakeConfig()).triggers });
		});
	},
	"voicewake.set": async ({ params, respond, context }) => {
		if (!Array.isArray(params.triggers)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "voicewake.set requires triggers: string[]"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const triggers = normalizeVoiceWakeTriggers(params.triggers);
			const cfg = await setVoiceWakeTriggers(triggers);
			context.broadcastVoiceWakeChanged(cfg.triggers);
			respond(true, { triggers: cfg.triggers });
		});
	}
};
//#endregion
export { voicewakeHandlers };
