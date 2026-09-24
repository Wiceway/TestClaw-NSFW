import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DSeyJ5Sb.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0zD4p1G.mjs";
import path from "node:path";
//#region src/config/sessions/transcript-target-binding.ts
/** Retain storage routing facts without retaining caller credentials. */
function captureSessionTranscriptStorageEnvironment(source) {
	const env = cloneEnvWithPlatformSemantics(source);
	return {
		TESTCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { TESTCLAW_SUPERVISOR_MODE: "external" } : {}
	};
}
/** Bind the locator and its storage namespace before reads or caller callbacks. */
function captureSessionTranscriptTargetBinding(source) {
	return {
		...source,
		storePath: path.resolve(source.storePath),
		env: captureSessionTranscriptStorageEnvironment(source.env ?? process.env)
	};
}
function sameSessionTranscriptStorageEnvironment(left, right) {
	return left?.TESTCLAW_STATE_DIR === right?.TESTCLAW_STATE_DIR && left?.TESTCLAW_SUPERVISOR_MODE === right?.TESTCLAW_SUPERVISOR_MODE;
}
function sameSessionTranscriptTargetBinding(left, right) {
	return left && right ? left.agentId === right.agentId && left.sessionId === right.sessionId && left.sessionKey === right.sessionKey && left.storePath === right.storePath && sameSessionTranscriptStorageEnvironment(left.env, right.env) : left === right;
}
//#endregion
export { sameSessionTranscriptTargetBinding as i, captureSessionTranscriptTargetBinding as n, sameSessionTranscriptStorageEnvironment as r, captureSessionTranscriptStorageEnvironment as t };
