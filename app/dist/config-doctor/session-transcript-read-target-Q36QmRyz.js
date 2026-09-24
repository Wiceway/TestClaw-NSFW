import { r as resolveConcreteSessionStorePath } from "./paths-ViQaz2td.js";
import { n as resolveSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-CGgZvou6.js";
//#region src/gateway/session-transcript-read-target.ts
async function resolveTranscriptReadTarget(scope) {
	const storePath = resolveConcreteSessionStorePath(scope.storePath);
	const target = storePath ? resolveSessionTranscriptReadTargetCore({
		...scope,
		storePath
	}) : (await import("./session-accessor.transcript-target-BbG4HQyF.js")).resolveSessionTranscriptReadTarget(scope);
	return {
		agentId: target.agentId,
		sessionFile: target.sessionKey ?? target.sessionId,
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		storePath: target.storePath
	};
}
function toTranscriptReadScope(target) {
	return {
		...target.agentId ? { agentId: target.agentId } : {},
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		...target.storePath ? { storePath: target.storePath } : {}
	};
}
//#endregion
export { toTranscriptReadScope as n, resolveTranscriptReadTarget as t };
