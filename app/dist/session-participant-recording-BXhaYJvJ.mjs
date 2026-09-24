import { c as trackAsyncWork } from "./async-work-scope-B8vgCYcj.mjs";
import { y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-DeFm4gyw.mjs";
import { G as recordSessionParticipantInWorker } from "./session-accessor-CtBBLApI.mjs";
//#region src/sessions/session-participant-recording.ts
/** Defers participant history persistence so it can never delay or abort an admitted turn. */
function recordSessionParticipantBestEffort(params) {
	const promptedAt = params.promptedAt ?? Date.now();
	trackAsyncWork(() => runOutsideGatewayRootWorkAdmission(async () => {
		await Promise.resolve();
		try {
			await recordSessionParticipantInWorker({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, {
				identity: params.identity,
				promptedAt,
				sessionAgentId: params.agentId
			});
		} catch (error) {
			params.onError?.(error);
		}
	})).catch((error) => params.onError?.(error));
}
//#endregion
export { recordSessionParticipantBestEffort as t };
