import { p as sessionParticipantInput } from "./runtime-CmHwV-9X.js";
import { t as recordSessionParticipantBestEffort } from "./session-participant-recording-BtIkI6qD.js";
//#region src/sessions/session-participant-input-recording.ts
/** Call only after admission and final target selection; never creates a session to count input. */
function recordAcceptedSessionParticipantInput(ctx, target) {
	for (const input of ctx[sessionParticipantInput] ?? []) if (!input.recorded) {
		input.recorded = true;
		recordSessionParticipantBestEffort({
			...target,
			identity: input.identity,
			promptedAt: input.promptedAt
		});
	}
}
//#endregion
export { recordAcceptedSessionParticipantInput as t };
